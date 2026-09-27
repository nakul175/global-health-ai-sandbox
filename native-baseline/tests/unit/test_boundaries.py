import json
import time
from dataclasses import asdict, replace
from pathlib import Path

import jwt
import pytest
from psycopg import OperationalError
from psycopg.errors import CheckViolation, InsufficientPrivilege, UniqueViolation
from psycopg.pq import DiagnosticField

from services.api.app.auth import Verifier
from services.api.app.config import Settings
from services.api.app.contracts import parse_json, parse_timestamp, programme_semantics, validate
from services.api.app.errors import Fault
from services.api.app.main import PROGRAMME_CODE_UNIQUE, database_fault
from services.api.app.programmes import decode_cursor, encode_cursor
from services.worker.main import RETRY_DELAYS, retry_plan


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
    "value",
    [
        "2026-01-01T00:00:00",  # no offset
        "2026-01-01",
        "2026-01-01 00:00:00Z",  # space separator is not RFC 3339 date-time
        "2026-01-01t00:00:00z",
        "2026-01-01T00:00:00+0530",
        "2026-02-30T00:00:00Z",  # impossible day
        "2026-01-01T24:00:00Z",
        "２０２６-01-01T00:00:00Z",  # non-ASCII digits
        "yesterday",
        "",
        None,
        1767225600,
        ["2026-01-01T00:00:00Z"],
    ],
)
def test_programme_timestamps_require_rfc3339_with_offset(value):
    with pytest.raises(Fault) as e:
        parse_timestamp({"starts_at": value}, "starts_at")
    assert e.value.status == 422 and e.value.code == "E_VALIDATION"
    assert e.value.fields == [{"path": "/payload/data/starts_at", "code": "format"}]
    with pytest.raises(Fault) as e:
        parse_timestamp({}, "ends_at")
    assert e.value.fields == [{"path": "/payload/data/ends_at", "code": "format"}]


@pytest.mark.parametrize(
    "value", ["2026-01-01T00:00:00Z", "2026-01-01T00:00:00.250+05:30", "2026-12-31T23:59:59.999999-03:00"]
)
def test_programme_timestamps_accept_rfc3339_offsets(value):
    parsed = parse_timestamp({"starts_at": value}, "starts_at")
    assert parsed.tzinfo is not None and parsed.utcoffset() is not None


def test_programme_semantics_reports_dates_instead_of_crashing():
    data = {
        "name": "n",
        "description": "d",
        "starts_at": "2026-01-01T00:00:00",
        "ends_at": "2027-01-01T00:00:00Z",
    }
    with pytest.raises(Fault) as e:  # previously TypeError: naive versus aware comparison
        programme_semantics(data)
    assert e.value.code == "E_VALIDATION"
    with pytest.raises(Fault) as e:
        programme_semantics({**data, "starts_at": "2027-01-01T00:00:00+00:00"})
    assert e.value.code == "E_SEMANTIC"
    programme_semantics({**data, "starts_at": "2026-01-01T00:00:00+00:00"})


@pytest.mark.parametrize(
    "settings_change",
    [
        {"app_env": "production"},
        {"cursor_key": "short"},
        {"origin": "http://0.0.0.0:8000"},
        {"app_env": "staging", "allow_dev_auth": False},
        {"allow_dev_auth": "false"},
    ],
)
def test_unsafe_runtime_configuration_fails_closed(settings_change):
    with pytest.raises(ValueError):
        replace(Settings.load(), **settings_change).validate()


def load_settings(monkeypatch, tmp_path, file_values=None, **environment):
    values = {**asdict(Settings.load()), **(file_values or {})}
    path = tmp_path / "config.json"
    path.write_text(json.dumps(values))
    monkeypatch.setenv("SANDBOX_CONFIG", str(path))
    for name, value in environment.items():
        monkeypatch.setenv(name, value)
    return Settings.load()


@pytest.mark.parametrize(
    ("source", "value", "expected"),
    [
        ("env", "false", False),
        ("env", "False", False),
        ("env", "TRUE", True),
        ("env", "yes", ValueError),
        ("env", "1", ValueError),
        ("env", "", ValueError),
        ("file", "false", False),
        ("file", False, False),
        ("file", 1, ValueError),
        ("file", "off", ValueError),
        ("file", None, ValueError),
    ],
)
def test_allow_dev_auth_accepts_only_booleans(monkeypatch, tmp_path, source, value, expected):
    arguments = (
        {"SANDBOX_ALLOW_DEV_AUTH": value} if source == "env" else {"file_values": {"allow_dev_auth": value}}
    )
    if expected is ValueError:
        with pytest.raises(ValueError):
            load_settings(monkeypatch, tmp_path, **arguments)
    else:
        assert load_settings(monkeypatch, tmp_path, **arguments).allow_dev_auth is expected


def test_prefixed_overrides_apply_and_legacy_names_fail_loudly(monkeypatch, tmp_path):
    assert load_settings(monkeypatch, tmp_path, SANDBOX_REGION="override-region").region == "override-region"
    with pytest.raises(ValueError) as e:
        load_settings(monkeypatch, tmp_path, ALLOW_DEV_AUTH="false", DATABASE_URL="postgresql://x")
    assert "ALLOW_DEV_AUTH" in str(e.value) and "SANDBOX_ALLOW_DEV_AUTH" in str(e.value)
    assert "SANDBOX_DATABASE_URL" in str(e.value)


def violation(kind, constraint=None):
    info = {DiagnosticField.CONSTRAINT_NAME: constraint.encode()} if constraint else None
    return kind("database rejected the statement", info=info)


def test_database_errors_map_to_specific_non_retryable_faults():
    expected = [
        (violation(UniqueViolation, PROGRAMME_CODE_UNIQUE), (422, "E_SEMANTIC", False)),
        (
            violation(UniqueViolation, "outbox_tenant_id_aggregate_id_sequence_key"),
            (409, "E_GATE_BLOCKED", False),
        ),
        (violation(UniqueViolation), (409, "E_GATE_BLOCKED", False)),
        (violation(CheckViolation, "programmes_check"), (422, "E_SEMANTIC", False)),
        (violation(InsufficientPrivilege), (500, "E_DEPENDENCY", False)),
        (OperationalError("connection lost"), (503, "E_DEPENDENCY", True)),
    ]
    for exc, outcome in expected:
        fault = database_fault(exc)
        assert (fault.status, fault.code, fault.retryable) == outcome, type(exc).__name__
        body = fault.body("c")["error"]
        assert set(body) == {"code", "message", "correlation_id", "retryable", "fields"}
    assert database_fault(expected[0][0]).fields == [{"path": "/payload/data/code", "code": "unique"}]


def test_worker_retry_schedule_backs_off_then_dead_letters():
    assert RETRY_DELAYS == (1, 5, 30, 120, 600)
    assert [retry_plan(attempt) for attempt in range(6)] == [
        ("pending", 1),
        ("pending", 5),
        ("pending", 30),
        ("pending", 120),
        ("pending", 600),
        ("dead_letter", None),
    ]
    assert retry_plan(40) == ("dead_letter", None)


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
