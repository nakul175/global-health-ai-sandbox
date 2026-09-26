import hashlib
import json
import re
from uuid import uuid4

from psycopg.errors import LockNotAvailable

from .contracts import canonical, digest
from .errors import Fault


def idempotency(c, actor, operation, key, body, method, route, context=None):
    if not key or not re.fullmatch(r"[A-Za-z0-9_.:-]{16,128}", key):
        raise Fault(400, "E_BAD_REQUEST", "A 16–128 character Idempotency-Key is required.")
    fingerprint = digest({"method": method, "route": route, "context": context or {}, "payload": body})
    lock = int.from_bytes(
        hashlib.sha256((actor.tenant + actor.principal + operation + key).encode()).digest()[:8],
        "big",
        signed=True,
    )
    try:
        c.execute("SELECT pg_advisory_xact_lock(%s)", (lock,))
    except LockNotAvailable:
        raise Fault(
            409, "E_GATE_BLOCKED", "Another request is completing. Retry this same action.", retryable=True
        ) from None
    receipt = c.execute(
        """SELECT r.*,o.status_code,o.response_bytes FROM command_receipts r
        JOIN operation_results o ON o.tenant_id=r.tenant_id AND o.receipt_id=r.receipt_id
        WHERE r.tenant_id=%s AND r.principal_id=%s AND r.operation=%s AND r.idempotency_key=%s""",
        (actor.tenant, actor.principal, operation, key),
    ).fetchone()
    if receipt and receipt["request_sha256"] != fingerprint:
        raise Fault(409, "E_IDEMPOTENCY_CONFLICT", "This request key was used for different content.")
    return fingerprint, receipt


def store_snapshot(c, actor, resource):
    raw = canonical(resource)
    c.execute(
        """INSERT INTO resource_versions(tenant_id,resource_id,version,schema_name,schema_version,
        canonical_sha256,snapshot_key,created_by) VALUES(%s,%s,%s,%s,'1.1',%s,%s,%s)""",
        (
            actor.tenant,
            resource["id"],
            resource["version"],
            resource["payload"]["kind"],
            hashlib.sha256(raw).hexdigest(),
            f"db://{resource['id']}/{resource['version']}",
            actor.principal,
        ),
    )
    c.execute(
        "INSERT INTO resource_snapshot_bytes VALUES(%s,%s,%s,%s)",
        (actor.tenant, resource["id"], resource["version"], raw),
    )


def commit_result(c, actor, operation, key, fingerprint, resource, response, status, correlation, event_type):
    receipt_id = str(uuid4())
    committed = c.execute(
        """INSERT INTO command_receipts(tenant_id,principal_id,operation,idempotency_key,
        request_sha256,receipt_id,resource_id,resource_version,state,correlation_id)
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING committed_at""",
        (
            actor.tenant,
            actor.principal,
            operation,
            key,
            fingerprint,
            receipt_id,
            resource["id"],
            resource["version"],
            resource["state"],
            correlation,
        ),
    ).fetchone()["committed_at"]
    if response is None:
        response = {
            "receipt_id": receipt_id,
            "object_id": resource["id"],
            "version": resource["version"],
            "state": resource["state"],
            "correlation_id": correlation,
            "job_id": None,
            "committed_at": committed.isoformat(),
        }
    c.execute(
        "INSERT INTO operation_results VALUES(%s,%s,%s,%s)",
        (actor.tenant, receipt_id, status, canonical(response)),
    )
    c.execute(
        """INSERT INTO audit_events(tenant_id,id,actor_id,action,object_id,object_version,
        correlation_id,outcome) VALUES(%s,%s,%s,%s,%s,%s,%s,'committed')""",
        (
            actor.tenant,
            str(uuid4()),
            actor.principal,
            operation,
            resource["id"],
            resource["version"],
            correlation,
        ),
    )
    event_id = str(uuid4())
    c.execute(
        """INSERT INTO outbox(tenant_id,event_id,aggregate_id,aggregate_version,sequence,event_type,
        schema_version,actor_id,receipt_id,correlation_id,causation_id)
        SELECT %s,%s,%s,%s,COALESCE(MAX(sequence),0)+1,%s,1,%s,%s,%s,%s FROM outbox
        WHERE tenant_id=%s AND aggregate_id=%s""",
        (
            actor.tenant,
            event_id,
            resource["id"],
            resource["version"],
            event_type,
            actor.principal,
            receipt_id,
            correlation,
            receipt_id,
            actor.tenant,
            resource["id"],
        ),
    )
    c.execute(
        """INSERT INTO outbox_delivery(tenant_id,event_id,consumer_id,state)
        VALUES(%s,%s,'assurance-index','pending')""",
        (actor.tenant, event_id),
    )
    return response, status


def replay(receipt):
    return json.loads(bytes(receipt["response_bytes"])), receipt["status_code"]
