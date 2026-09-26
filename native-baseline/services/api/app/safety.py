from uuid import uuid4

from .auth import require_recent_mfa
from .contracts import validate
from .errors import Fault
from .programmes import available, represent
from .transactions import commit_result, idempotency, replay, store_snapshot


def concern(c, actor, body, key, correlation):
    validate("RecordSafetyConcernRequest", body)
    data = body["payload"]
    if not data["concern"].strip():
        raise Fault(422, "E_SEMANTIC", "Describe the safety concern.")
    if any(k in body["context"] for k in ("study_ref", "evidence_refs")):
        raise Fault(409, "E_CAPABILITY_DISABLED", "Study and evidence links are not enabled in this slice.")
    for rid in data.get("scope_refs", []):
        available(c, actor, rid)
    fp, receipt = idempotency(
        c, actor, "RecordSafetyConcern", key, body, "POST", "/v1/commands/RecordSafetyConcern"
    )
    if receipt:
        return replay(receipt)
    rid = str(uuid4())
    c.execute(
        """INSERT INTO resources(tenant_id,id,kind,title,classification,state,created_by)
        VALUES(%s,%s,'safety_concern','Safety concern','restricted','submitted',%s)""",
        (actor.tenant, rid, actor.principal),
    )
    c.execute(
        """INSERT INTO safety_concerns(tenant_id,id,concern,contact,occurred_at) VALUES(%s,%s,%s,%s,%s)""",
        (actor.tenant, rid, data["concern"], data.get("contact"), data.get("occurred_at")),
    )
    for scope in data.get("scope_refs", []):
        c.execute("INSERT INTO concern_scopes VALUES(%s,%s,%s)", (actor.tenant, rid, scope))
    resource = {
        "id": rid,
        "domain": "SAF",
        "title": "Safety concern",
        "classification": "restricted",
        "state": "submitted",
        "version": 1,
        "schema_version": "1.1",
        "payload": {"kind": "SafetyConcern", "data": data},
    }
    store_snapshot(c, actor, resource)
    return commit_result(
        c,
        actor,
        "RecordSafetyConcern",
        key,
        fp,
        resource,
        None,
        200,
        correlation,
        "RecordSafetyConcernCommitted",
    )


def hold(c, actor, body, key, correlation):
    validate("ApplyHoldRequest", body)
    require_recent_mfa(actor)
    data = body["payload"]
    allowed = {"CS": {"clinical"}, "SO": {"security"}, "CO": {"legal", "governance"}}
    if data["hold_type"] not in allowed.get(actor.role, set()):
        raise Fault(403, "E_ACCESS_DENIED", "This hold type is outside your assigned authority.")
    rid = body["context"]["object_ref"]
    if data["scope_refs"] != [rid] or any(k in body["context"] for k in ("study_ref", "evidence_refs")):
        raise Fault(
            409, "E_CAPABILITY_DISABLED", "This slice supports one explicitly delegated programme per hold."
        )
    # Metadata lookup only: security/governance containment never grants programme content access.
    row = c.execute(
        """SELECT r.* FROM resources r JOIN programmes p ON p.tenant_id=r.tenant_id AND p.id=r.id
        WHERE r.tenant_id=%s AND r.id=%s AND EXISTS(SELECT 1 FROM membership_scopes s
        WHERE s.tenant_id=r.tenant_id AND s.resource_id=r.id AND s.membership_id=%s
        AND s.purpose='programme administration') FOR UPDATE OF r""",
        (actor.tenant, rid, actor.membership),
    ).fetchone()
    if not row:
        from .errors import hidden

        raise hidden()
    fp, receipt = idempotency(c, actor, "ApplyHold", key, body, "POST", "/v1/commands/ApplyHold")
    if receipt:
        return replay(receipt)
    if row["version"] != body["context"]["expected_version"]:
        raise Fault(409, "E_VERSION_CONFLICT", "The programme changed. Review the current version.")
    hold_id = str(uuid4())
    c.execute(
        """INSERT INTO holds(tenant_id,id,scope_id,hold_type,reason,applied_by)
        VALUES(%s,%s,%s,%s,%s,%s)""",
        (actor.tenant, hold_id, rid, data["hold_type"], data["reason"], actor.principal),
    )
    c.execute(
        "INSERT INTO safety_impact_tasks(tenant_id,hold_id,scope_id) VALUES(%s,%s,%s)",
        (actor.tenant, hold_id, rid),
    )
    # Hold is an overlay: it does not falsely change the programme's lifecycle state.
    c.execute(
        "UPDATE resources SET version=version+1,updated_at=now() WHERE tenant_id=%s AND id=%s",
        (actor.tenant, rid),
    )
    snapshot_row = c.execute(
        """SELECT r.*,p.code,p.name,p.description,p.owner_membership_id,p.mode,p.starts_at,p.ends_at
        FROM resources r JOIN programmes p ON p.tenant_id=r.tenant_id AND p.id=r.id
        WHERE r.tenant_id=%s AND r.id=%s""",
        (actor.tenant, rid),
    ).fetchone()
    resource = represent(c, actor, snapshot_row)
    store_snapshot(c, actor, resource)
    return commit_result(
        c, actor, "ApplyHold", key, fp, resource, None, 200, correlation, "ApplyHoldCommitted"
    )
