import time
from dataclasses import replace
from pathlib import Path

import jwt
import pytest

from services.api.app.auth import Verifier
from services.api.app.config import Settings
from services.api.app.contracts import parse_json, validate
from services.api.app.errors import Fault
from services.api.app.programmes import decode_cursor, encode_cursor


@pytest.mark.parametrize("body", [b'{"a":1,"a":2}', b'{"x":NaN}', b'{"x":Infinity}', b"\xff", b"{"])
def test_json_rejects_ambiguous_or_nonstandard_input(body):
    with pytest.raises(Fault) as e:
        parse_json(body)
    assert e.value.status == 400


def test_nested_unknown_fields_are_rejected():
    with pytest.raises(Fault) as e:
        validate("ResourcePatch", {"title": "Draft", "tenant_id": "injected"})
    assert e.value.code == "E_VALIDATION"
    with pytest.raises(Fault):
        validate("ResourcePatch", {"payload": {"kind": "Programme", "data": {"unregistered": True}}})


@pytest.mark.parametrize(
    "settings_change",
    [
        {"app_env": "production"},
        {"cursor_key": "short"},
        {"origin": "http://0.0.0.0:8000"},
        {"app_env": "staging", "allow_dev_auth": False},
    ],
)
def test_unsafe_runtime_configuration_fails_closed(settings_change):
    with pytest.raises(ValueError):
        replace(Settings.load(), **settings_change).validate()


def test_cursor_is_authenticated_scoped_and_expiring():
    value = {"tenant": "A", "scope": "one", "exp": int(time.time()) + 60}
    token = encode_cursor(value, "secret-key")
    assert decode_cursor(token, "secret-key", {"tenant": "A", "scope": "one"}) == value
    for changed, key, binding in [
        (token + "x", "secret-key", {"tenant": "A"}),
        (token, "wrong-key", {"tenant": "A"}),
        (token, "secret-key", {"tenant": "B"}),
        (token, "secret-key", {"scope": "two"}),
        (encode_cursor({**value, "exp": 0}, "secret-key"), "secret-key", {}),
    ]:
        with pytest.raises(Fault) as e:
            decode_cursor(changed, key, binding)
        assert e.value.code == "E_VALIDATION"


@pytest.mark.parametrize(
    "change",
    [
        {"iss": "https://untrusted.example"},
        {"aud": "another-api"},
        {"exp": 0},
        {"iat": 4102444800},
        {"tenant_id": "not-a-uuid"},
        {"sub": None},
        {"exp": 4102444800},
    ],
)
def test_invalid_signed_identity_claims_rejected(change):
    settings = Settings.load()
    now = int(time.time())
    claims = {
        "iss": settings.issuer,
        "aud": settings.audience,
        "sub": "subject",
        "iat": now,
        "nbf": now,
        "exp": now + 300,
        "tenant_id": "00000000-0000-4000-8000-000000000001",
        "principal_id": "00000000-0000-4000-8000-000000000002",
        **change,
    }
    token = jwt.encode(
        claims, Path(settings.private_key_file).read_text(), algorithm="RS256", headers={"kid": "local-1"}
    )
    with pytest.raises(Fault) as e:
        Verifier(settings).claims("Bearer " + token)
    assert e.value.code == "E_AUTH_REQUIRED"


def test_key_confusion_and_unknown_key_rejected():
    settings = Settings.load()
    token = jwt.encode(
        {"sub": "spoof"},
        "attacker-controlled-key-with-32-characters",
        algorithm="HS256",
        headers={"kid": "local-1"},
    )
    with pytest.raises(Fault):
        Verifier(settings).claims("Bearer " + token)
    token = jwt.encode(
        {"sub": "spoof"},
        Path(settings.private_key_file).read_text(),
        algorithm="RS256",
        headers={"kid": "wrong"},
    )
    with pytest.raises(Fault):
        Verifier(settings).claims("Bearer " + token)
