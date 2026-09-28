import copy
import hashlib
import json
from uuid import uuid4

import pytest
from jsonschema import Draft202012Validator, FormatChecker

from services.api.app.config import Settings
from services.api.app.contracts import validate
from services.worker.main import drain


def changed_headers(headers, **extra):
    return {**headers, "Idempotency-Key": str(uuid4()), **extra}


def test_live_readiness_and_anonymous_denial(api):
    for route in ["/health/live", "/health/ready"]:
        r = api.get(route)
        assert r.status_code == 200
        validate("Liveness", r.json())
    r = api.get("/v1/me")
    assert r.status_code == 401
    validate("Error", r.json())
    assert r.headers["cache-control"] == "no-store"


def test_first_workflow_persists_snapshot_audit_and_event(api, sessions, create, draft, db):
    r, headers = create(draft)
    resource = r.json()
    validate("Resource", resource)
    assert r.headers["etag"] == '"v1"'
    get = api.get("/v1/resources/ORG/" + resource["id"], headers=headers)
    assert get.json() == resource
    versions = db.execute(
        "SELECT * FROM resource_versions WHERE resource_id=%s", (resource["id"],)
    ).fetchall()
    raw = db.execute(
        "SELECT canonical_bytes FROM resource_snapshot_bytes WHERE resource_id=%s", (resource["id"],)
    ).fetchone()["canonical_bytes"]
    assert hashlib.sha256(raw).hexdigest() == versions[0]["canonical_sha256"]
    assert json.loads(bytes(raw)) == resource
    for table, field in [
        ("audit_events", "object_id"),
        ("outbox", "aggregate_id"),
        ("command_receipts", "resource_id"),
    ]:
        assert (
            db.execute(f"SELECT count(*) AS n FROM {table} WHERE {field}=%s", (resource["id"],)).fetchone()[
                "n"
            ]
            == 1
        )


def test_retry_returns_original_result_even_after_an_edit(api, create, draft):
    r, headers = create(draft)
    resource = r.json()
    path = "/v1/resources/ORG/" + resource["id"]
    patch_headers = changed_headers(headers, **{"If-Match": '"v1"'})
    updated = api.patch(path, json={"title": "Changed programme"}, headers=patch_headers)
    assert updated.status_code == 200, updated.text
    assert updated.json()["version"] == 2
    again = api.post("/v1/resources/ORG", json=draft, headers=headers)
    assert again.status_code == 201 and again.json() == resource
    assert again.headers["etag"] == '"v1"'
    patch_again = api.patch(path, json={"title": "Changed programme"}, headers=patch_headers)
    assert patch_again.json() == updated.json()
    conflict = api.post("/v1/resources/ORG", json={**draft, "title": "Different intent"}, headers=headers)
    assert conflict.status_code == 409 and conflict.json()["error"]["code"] == "E_IDEMPOTENCY_CONFLICT"


def test_tenant_context_scope_and_support_denial(api, sessions, create, draft, db, manifest):
    r, headers = create(draft)
    path = "/v1/resources/ORG/" + r.json()["id"]
    cross = api.get(path, headers=sessions["B_PM"]["headers"])
    absent = api.get("/v1/resources/ORG/" + str(uuid4()), headers=sessions["B_PM"]["headers"])
    assert cross.status_code == absent.status_code == 404
    assert cross.json()["error"]["message"] == absent.json()["error"]["message"]
    assert draft["title"] not in cross.text
    mixed = {**headers, "X-Context-Id": sessions["B_PM"]["context_id"]}
    assert api.get(path, headers=mixed).status_code == 403
    assert api.get(path, headers=sessions["A_EV"]["headers"]).status_code == 404
    support = api.get(
        "/v1/resources/ORG/" + manifest["tenants"]["A"]["resources"]["programme"],
        headers=sessions["A_SU"]["headers"],
    )
    assert support.status_code == 404
    response = api.post("/v1/resources/ORG", json=draft, headers=changed_headers(sessions["A_EV"]["headers"]))
    assert response.status_code == 403


def test_stale_and_missing_versions_preserve_saved_value(api, create, draft):
    r, headers = create(draft)
    path = "/v1/resources/ORG/" + r.json()["id"]
    assert (
        api.patch(path, json={"title": "Missing precondition"}, headers=changed_headers(headers)).status_code
        == 428
    )
    assert (
        api.patch(
            path, json={"title": "Wildcard"}, headers=changed_headers(headers, **{"If-Match": "*"})
        ).status_code
        == 400
    )
    assert (
        api.patch(
            path, json={"title": "Committed title"}, headers=changed_headers(headers, **{"If-Match": '"v1"'})
        ).status_code
        == 200
    )
    stale = api.patch(
        path, json={"title": "Overwrite attempt"}, headers=changed_headers(headers, **{"If-Match": '"v1"'})
    )
    assert stale.status_code == 409 and stale.json()["error"]["code"] == "E_VERSION_CONFLICT"
    assert api.get(path, headers=headers).json()["title"] == "Committed title"


def test_complete_payload_update_and_immutable_identity(api, create, draft):
    r, headers = create(draft)
    path = "/v1/resources/ORG/" + r.json()["id"]
    body = {"payload": copy.deepcopy(draft["payload"])}
    body["payload"]["data"]["country_codes"] = ["US", "GB"]
    body["payload"]["data"]["description"] = "An updated synthetic description."
    update = api.patch(path, json=body, headers=changed_headers(headers, **{"If-Match": '"v1"'}))
    assert update.status_code == 200, update.text
    assert update.json()["payload"]["data"]["country_codes"] == ["GB", "US"]
    body["payload"]["data"]["code"] = "RENAMED_CODE"
    assert (
        api.patch(path, json=body, headers=changed_headers(headers, **{"If-Match": '"v2"'})).status_code
        == 422
    )
    assert (
        api.patch(
            path,
            json={"payload": {"kind": "Programme", "data": {"name": "Partial"}}},
            headers=changed_headers(headers, **{"If-Match": '"v2"'}),
        ).status_code
        == 422
    )


@pytest.mark.parametrize(
    "mutation", ["unknown", "nested", "reversed", "blank", "bad_country", "extra_owner", "duplicate_country"]
)
def test_invalid_programmes_rejected(api, sessions, draft, mutation):
    d = draft["payload"]["data"]
    if mutation == "unknown":
        draft["tenant_id"] = str(uuid4())
    if mutation == "nested":
        d["arbitrary"] = {}
    if mutation == "reversed":
        d["ends_at"] = "2025-01-01T00:00:00Z"
    if mutation == "blank":
        d["description"] = "   "
    if mutation == "bad_country":
        d["country_codes"] = ["USA"]
    if mutation == "extra_owner":
        d["owner_membership_ref"] = str(uuid4())
    if mutation == "duplicate_country":
        d["country_codes"] = ["ZZ", "ZZ"]
    r = api.post("/v1/resources/ORG", json=draft, headers=changed_headers(sessions["A_PM"]["headers"]))
    assert r.status_code in {422, 403}, r.text
    validate("Error", r.json())


def test_transport_controls_and_disabled_capability(api, sessions):
    headers = changed_headers(sessions["A_PM"]["headers"])
    r = api.post(
        "/v1/resources/ORG",
        content='{"title":"a","title":"b"}',
        headers={**headers, "Content-Type": "application/json"},
    )
    assert r.status_code == 400
    assert (
        api.post(
            "/v1/resources/ORG", content="{}", headers={**headers, "Content-Type": "text/plain"}
        ).status_code
        == 415
    )
    assert (
        api.post(
            "/v1/resources/ORG",
            content=" " * (1048577),
            headers={**headers, "Content-Type": "application/json"},
        ).status_code
        == 413
    )
    assert api.get("/v1/me", headers={**headers, "Origin": "https://foreign.example"}).status_code == 403
    assert api.get("/v1/me", headers={**headers, "Host": "foreign.example"}).status_code == 400
    r = api.post("/v1/commands/SubmitRun", json={}, headers=headers)
    assert r.status_code == 409 and r.json()["error"]["code"] == "E_CAPABILITY_DISABLED"
    caps = api.get("/v1/capabilities", headers=headers).json()
    assert "SubmitRun" not in caps["enabled_commands"]


def test_pagination_is_stable_scoped_and_rejects_tampering(api, sessions, create, draft):
    for i in range(3):
        body = copy.deepcopy(draft)
        body["payload"]["data"]["code"] = "PAGE_" + uuid4().hex[:12].upper()
        create(body)
    headers = sessions["A_PM"]["headers"]
    first = api.get("/v1/resources/ORG?limit=2", headers=headers).json()
    validate("ResourceList", first)
    cursor = first["next_cursor"]
    assert cursor
    second = api.get("/v1/resources/ORG", params={"limit": 2, "cursor": cursor}, headers=headers).json()
    assert not ({x["id"] for x in first["items"]} & {x["id"] for x in second["items"]})
    assert (
        api.get("/v1/resources/ORG", params={"limit": 2, "cursor": cursor + "x"}, headers=headers).status_code
        == 422
    )
    assert (
        api.get(
            "/v1/resources/ORG", params={"limit": 2, "cursor": cursor}, headers=sessions["B_PM"]["headers"]
        ).status_code
        == 422
    )
    for limit in ["0", "201", "2.5"]:
        assert api.get("/v1/resources/ORG", params={"limit": limit}, headers=headers).status_code == 422


def test_revoked_membership_and_context_block_retry(api, sessions, create, draft, db, manifest):
    r, headers = create(draft)
    tenant = manifest["tenants"]["A"]["id"]
    membership = sessions["A_PM"]["membership_id"]
    try:
        db.execute(
            "UPDATE memberships SET state='revoked' WHERE tenant_id=%s AND id=%s", (tenant, membership)
        )
        retry = api.post("/v1/resources/ORG", json=draft, headers=headers)
        assert retry.status_code == 403
    finally:
        db.execute("UPDATE memberships SET state='active' WHERE tenant_id=%s AND id=%s", (tenant, membership))
    try:
        db.execute(
            "UPDATE auth_contexts SET revoked_at=now() WHERE tenant_id=%s AND id=%s",
            (tenant, sessions["A_PM"]["context_id"]),
        )
        assert api.get("/v1/me", headers=headers).status_code == 403
    finally:
        db.execute(
            "UPDATE auth_contexts SET revoked_at=NULL WHERE tenant_id=%s AND id=%s",
            (tenant, sessions["A_PM"]["context_id"]),
        )


def test_receipt_does_not_bypass_lost_creation_delegation(api, sessions, create, draft, db, manifest):
    r, headers = create(draft)
    tenant = manifest["tenants"]["A"]["id"]
    member = sessions["A_PM"]["membership_id"]
    try:
        db.execute(
            "UPDATE programme_creation_scopes SET revoked_at=now() WHERE tenant_id=%s AND membership_id=%s",
            (tenant, member),
        )
        assert api.post("/v1/resources/ORG", json=draft, headers=headers).status_code == 403
    finally:
        db.execute(
            "UPDATE programme_creation_scopes SET revoked_at=NULL WHERE tenant_id=%s AND membership_id=%s",
            (tenant, member),
        )


def test_safety_concern_minimal_intake_idempotency(api, sessions, db):
    headers = changed_headers(sessions["A_SU"]["headers"])
    body = {
        "context": {"object_ref": None, "expected_version": None},
        "payload": {"concern": "Synthetic issue raised without any attachment."},
    }
    r = api.post("/v1/commands/RecordSafetyConcern", json=body, headers=headers)
    assert r.status_code == 200, r.text
    validate("CommandReceipt", r.json())
    assert api.post("/v1/commands/RecordSafetyConcern", json=body, headers=headers).json() == r.json()
    assert (
        db.execute(
            "SELECT count(*) AS n FROM safety_concerns WHERE id=%s", (r.json()["object_id"],)
        ).fetchone()["n"]
        == 1
    )


def test_authorized_hold_blocks_edits_and_replays(api, sessions, create, draft, db, manifest):
    r, headers = create(draft)
    rid = r.json()["id"]
    tenant = manifest["tenants"]["A"]["id"]
    db.execute(
        "INSERT INTO membership_scopes VALUES(%s,%s,%s,'programme administration')",
        (tenant, sessions["A_CS"]["membership_id"], rid),
    )
    body = {
        "context": {"object_ref": rid, "expected_version": 1},
        "payload": {
            "scope_refs": [rid],
            "reason": "Synthetic clinical concern requires review.",
            "hold_type": "clinical",
        },
    }
    denied = api.post("/v1/commands/ApplyHold", json=body, headers=changed_headers(headers))
    assert denied.status_code == 403
    held = api.post("/v1/commands/ApplyHold", json=body, headers=changed_headers(sessions["A_CS"]["headers"]))
    assert held.status_code == 200, held.text
    assert held.json()["version"] == 2 and held.json()["state"] == "draft"
    patch = api.patch(
        "/v1/resources/ORG/" + rid,
        json={"title": "Should fail"},
        headers=changed_headers(headers, **{"If-Match": '"v2"'}),
    )
    assert patch.status_code == 409 and patch.json()["error"]["code"] == "E_HOLD_ACTIVE"
    assert (
        api.post("/v1/resources/ORG", json=draft, headers=headers).json()["error"]["code"] == "E_HOLD_ACTIVE"
    )
    assert not api.get("/v1/resources/ORG/" + rid + "/restrictions", headers=headers).json()["can_edit"]
    assert (
        db.execute("SELECT count(*) AS n FROM safety_impact_tasks WHERE scope_id=%s", (rid,)).fetchone()["n"]
        == 1
    )


def test_transaction_failure_rolls_back_every_business_effect(api, sessions, draft, db):
    draft["title"] = "FAILURE_INJECTION_" + uuid4().hex
    db.execute("""CREATE OR REPLACE FUNCTION public.test_reject_event() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN IF EXISTS(SELECT 1 FROM sandbox.resources WHERE id=NEW.aggregate_id AND title LIKE 'FAILURE_INJECTION_%%')
        THEN RAISE EXCEPTION 'test failure'; END IF; RETURN NEW; END $$""")
    db.execute(
        "CREATE TRIGGER test_reject_event BEFORE INSERT ON sandbox.outbox FOR EACH ROW EXECUTE FUNCTION public.test_reject_event()"
    )
    try:
        r = api.post("/v1/resources/ORG", json=draft, headers=changed_headers(sessions["A_PM"]["headers"]))
        assert r.status_code == 503, r.text
        assert (
            db.execute("SELECT count(*) AS n FROM resources WHERE title=%s", (draft["title"],)).fetchone()[
                "n"
            ]
            == 0
        )
        assert (
            db.execute(
                "SELECT count(*) AS n FROM programmes WHERE code=%s", (draft["payload"]["data"]["code"],)
            ).fetchone()["n"]
            == 0
        )
    finally:
        db.execute("DROP TRIGGER test_reject_event ON sandbox.outbox")
        db.execute("DROP FUNCTION public.test_reject_event()")


def test_worker_processes_durable_events_once(api, create, draft, db, manifest):
    r, _ = create(draft)
    a = manifest["tenants"]["A"]
    count = drain(Settings.load(), a["id"], a["principals"]["SV"])
    assert count > 0
    assert drain(Settings.load(), a["id"], a["principals"]["SV"]) == 0
    rows = db.execute("SELECT * FROM assurance_index WHERE resource_id=%s", (r.json()["id"],)).fetchall()
    assert len(rows) == 1
    assert (
        db.execute(
            "SELECT count(*) AS n FROM inbox WHERE event_id=%s AND consumer_id='assurance-index'",
            (rows[0]["event_id"],),
        ).fetchone()["n"]
        == 1
    )


def test_worker_parks_sequence_gaps_and_dead_letters_exhausted_deliveries(api, create, draft, db, manifest):
    r, headers = create(draft)
    rid = r.json()["id"]
    patch = api.patch(
        "/v1/resources/ORG/" + rid,
        json={"title": "Second event"},
        headers=changed_headers(headers, **{"If-Match": '"v1"'}),
    )
    assert patch.status_code == 200, patch.text
    a = manifest["tenants"]["A"]
    events = db.execute(
        "SELECT event_id,sequence FROM outbox WHERE aggregate_id=%s ORDER BY sequence", (rid,)
    ).fetchall()
    assert [e["sequence"] for e in events] == [1, 2]
    first, second = events[0]["event_id"], events[1]["event_id"]

    def delivery(event_id):
        return db.execute(
            """SELECT state,attempt,next_attempt_at>now() AS deferred,
            next_attempt_at-now() AS wait FROM outbox_delivery WHERE event_id=%s""",
            (event_id,),
        ).fetchone()

    # An event that never reaches the inbox (quarantined schema) leaves a permanent gap behind it.
    db.execute("UPDATE outbox_delivery SET state='dead_letter' WHERE event_id=%s", (first,))
    drain(Settings.load(), a["id"], a["principals"]["SV"])
    parked = delivery(second)
    assert (parked["state"], parked["attempt"]) == ("pending", 1)
    assert parked["wait"].total_seconds() <= 1
    assert (
        db.execute("SELECT count(*) AS n FROM assurance_index WHERE resource_id=%s", (rid,)).fetchone()["n"]
        == 0
    )
    # Not due: a deferred delivery no longer occupies every batch.
    db.execute("UPDATE outbox_delivery SET attempt=4,next_attempt_at=now() WHERE event_id=%s", (second,))
    drain(Settings.load(), a["id"], a["principals"]["SV"])
    parked = delivery(second)
    assert (parked["state"], parked["attempt"], parked["deferred"]) == ("pending", 5, True)
    assert 590 < parked["wait"].total_seconds() <= 600
    drain(Settings.load(), a["id"], a["principals"]["SV"])
    assert delivery(second)["attempt"] == 5
    # The contract schedule is exhausted after 1, 5, 30, 120 and 600 seconds: durable dead-letter.
    db.execute("UPDATE outbox_delivery SET next_attempt_at=now() WHERE event_id=%s", (second,))
    drain(Settings.load(), a["id"], a["principals"]["SV"])
    assert (delivery(second)["state"], delivery(second)["attempt"]) == ("dead_letter", 6)
    assert db.execute("SELECT count(*) AS n FROM inbox WHERE event_id=%s", (second,)).fetchone()["n"] == 0


def test_country_history_is_retired_once_and_kept_for_unchanged_rows(api, create, draft, db):
    r, headers = create(draft)
    rid = r.json()["id"]
    body = {"payload": copy.deepcopy(draft["payload"])}

    def replace_countries(version, codes):
        body["payload"]["data"]["country_codes"] = codes
        update = api.patch(
            "/v1/resources/ORG/" + rid,
            json=body,
            headers=changed_headers(headers, **{"If-Match": f'"v{version}"'}),
        )
        assert update.status_code == 200, update.text
        assert update.json()["payload"]["data"]["country_codes"] == sorted(codes)
        return {
            row["country_code"]: row["retired_at"]
            for row in db.execute(
                "SELECT country_code,retired_at FROM programme_countries WHERE programme_id=%s", (rid,)
            ).fetchall()
        }

    assert replace_countries(1, ["ZZ", "US"]) == {"ZZ": None, "US": None}
    retired = replace_countries(2, ["US"])
    assert retired["US"] is None and retired["ZZ"] is not None
    kept = replace_countries(3, ["US", "GB"])
    assert kept == {"ZZ": retired["ZZ"], "US": None, "GB": None}  # ZZ is not retired a second time
    back = replace_countries(4, ["ZZ"])
    assert back["ZZ"] is None and back["US"] is not None and back["GB"] is not None
    assert len(back) == 3


def test_duplicate_programme_code_is_a_field_error(api, sessions, create, draft):
    create(draft)
    draft["title"] = "Same code again"
    r = api.post("/v1/resources/ORG", json=draft, headers=changed_headers(sessions["A_PM"]["headers"]))
    assert r.status_code == 422, r.text
    error = r.json()["error"]
    assert error["code"] == "E_SEMANTIC" and error["retryable"] is False
    assert error["fields"] == [{"path": "/payload/data/code", "code": "unique"}]
    assert "retry-after" not in r.headers
    validate("Error", r.json())


@pytest.mark.parametrize("value", ["2026-01-01T00:00:00", "2026-01-01", "2026-02-30T00:00:00Z", "soon"])
def test_programme_dates_without_offset_are_validation_errors(api, sessions, draft, value):
    # Previously a naive or malformed timestamp reached datetime comparison and became a 500.
    # With rfc3339-validator installed the schema reports the closed payload (oneOf) as a whole;
    # without it, parse_timestamp reports the exact field. Both are 422 E_VALIDATION.
    draft["payload"]["data"]["starts_at"] = value
    r = api.post("/v1/resources/ORG", json=draft, headers=changed_headers(sessions["A_PM"]["headers"]))
    assert r.status_code == 422, r.text
    error = r.json()["error"]
    assert error["code"] == "E_VALIDATION" and error["retryable"] is False
    assert error["fields"] and all(f["path"].startswith("/payload") for f in error["fields"])
    validate("Error", r.json())


def test_rls_no_context_no_cross_tenant_and_no_elevation(settings, db, manifest):
    import psycopg

    from services.api.app.db import connection, set_context

    with connection(Settings.load()) as c:
        assert c.execute("SELECT count(*) AS n FROM resources").fetchone()["n"] == 0
        a, b = manifest["tenants"]["A"], manifest["tenants"]["B"]
        set_context(c, a["id"], a["principals"]["PM"])
        assert (
            c.execute("SELECT count(*) AS n FROM resources WHERE tenant_id=%s", (b["id"],)).fetchone()["n"]
            == 0
        )
    with pytest.raises(psycopg.errors.InsufficientPrivilege):
        with connection(Settings.load()) as c:
            set_context(c, a["id"], a["principals"]["PM"])
            c.execute("UPDATE memberships SET role_code='OP' WHERE id=%s", (a["memberships"]["PM"],))
    tables = db.execute("""SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
       JOIN information_schema.columns f ON f.table_schema=n.nspname AND f.table_name=c.relname
       WHERE n.nspname='sandbox' AND f.column_name='tenant_id' AND (NOT c.relrowsecurity OR NOT c.relforcerowsecurity)""").fetchall()
    assert tables == []


def test_runtime_openapi_is_valid_and_extension_shapes_are_closed(api, sessions):
    from openapi_spec_validator import validate as validate_openapi

    spec = api.get("/openapi.json").json()
    validate_openapi(spec)
    for schema, path in [("Session", "/v1/session"), ("CapabilitySet", "/v1/capabilities")]:
        value = api.get(path, headers=sessions["A_PM"]["headers"]).json()
        Draft202012Validator(
            {"$ref": "#/components/schemas/" + schema, "components": spec["components"]},
            format_checker=FormatChecker(),
        ).validate(value)
