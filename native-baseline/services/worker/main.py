"""Reference-only assurance consumer. No email, network calls, AI execution or clinical effects."""

import json
import logging

from jsonschema import Draft202012Validator, FormatChecker

from services.api.app.config import ROOT, Settings
from services.api.app.contracts import digest
from services.api.app.db import connection, set_context

SCHEMA = json.loads((ROOT / "contracts/events.schema.json").read_text())
VALIDATOR = Draft202012Validator(SCHEMA, format_checker=FormatChecker())
# Contract retry schedule (specs/02, outbox delivery): 1, 5, 30, 120 and 600 seconds, then dead-letter.
RETRY_DELAYS = (1, 5, 30, 120, 600)
log = logging.getLogger("sandbox.worker")


def retry_plan(attempt):
    """Return the next delivery state and delay in seconds after a failed attempt numbered from zero."""
    if attempt >= len(RETRY_DELAYS):
        return "dead_letter", None
    return "pending", RETRY_DELAYS[attempt]


def dead_letter(c, tenant_id, event, reason):
    c.execute(
        """UPDATE outbox_delivery SET state='dead_letter',attempt=attempt+1
        WHERE tenant_id=%s AND event_id=%s AND consumer_id='assurance-index'""",
        (tenant_id, event["event_id"]),
    )
    log.error(
        "dead_letter tenant=%s event=%s aggregate=%s sequence=%s attempt=%s reason=%s",
        tenant_id,
        event["event_id"],
        event["aggregate_id"],
        event["sequence"],
        event["attempt"] + 1,
        reason,
    )


def park(c, tenant_id, event, reason):
    """Defer a delivery that cannot be applied yet; it leaves the batch and dead-letters when exhausted."""
    state, delay = retry_plan(event["attempt"])
    if state == "dead_letter":
        dead_letter(c, tenant_id, event, reason)
        return
    c.execute(
        """UPDATE outbox_delivery SET attempt=attempt+1,next_attempt_at=now()+make_interval(secs=>%s)
        WHERE tenant_id=%s AND event_id=%s AND consumer_id='assurance-index'""",
        (float(delay), tenant_id, event["event_id"]),
    )
    log.warning(
        "parked tenant=%s event=%s aggregate=%s sequence=%s attempt=%s retry_in=%ss reason=%s",
        tenant_id,
        event["event_id"],
        event["aggregate_id"],
        event["sequence"],
        event["attempt"] + 1,
        delay,
        reason,
    )


def drain(settings, tenant_id, principal_id, maximum=100):
    """Scope comes from trusted worker assignment, never a queue payload/header."""
    processed = 0
    with connection(settings, "worker") as c:
        set_context(c, tenant_id, principal_id)
        events = c.execute(
            """SELECT e.*,d.attempt,r.state AS receipt_state,r.job_id FROM outbox e
            JOIN outbox_delivery d ON d.tenant_id=e.tenant_id AND d.event_id=e.event_id
            JOIN command_receipts r ON r.tenant_id=e.tenant_id AND r.receipt_id=e.receipt_id
            WHERE d.consumer_id='assurance-index' AND d.state='pending' AND d.next_attempt_at<=now()
            ORDER BY e.aggregate_id,e.sequence LIMIT %s FOR UPDATE OF d SKIP LOCKED""",
            (maximum,),
        ).fetchall()
        for e in events:
            envelope = {
                k: str(e[k])
                for k in [
                    "tenant_id",
                    "event_id",
                    "aggregate_id",
                    "actor_id",
                    "correlation_id",
                    "causation_id",
                ]
            }
            envelope.update(
                schema_version=1,
                event_type=e["event_type"],
                aggregate_version=e["aggregate_version"],
                sequence=e["sequence"],
                occurred_at=e["occurred_at"].isoformat(),
                payload={
                    "receipt_id": str(e["receipt_id"]),
                    "state": e["receipt_state"],
                    "job_id": str(e["job_id"]) if e["job_id"] else None,
                },
            )
            if list(VALIDATOR.iter_errors(envelope)):
                # Later events of this aggregate now have a permanent gap; they are parked below
                # and reach dead-letter through the same schedule, because the delivery states
                # allow no separate blocked marker.
                dead_letter(c, tenant_id, e, "schema")
                continue
            previous = c.execute(
                """SELECT COALESCE(MAX(o.sequence),0) AS sequence FROM outbox o
                JOIN inbox i ON i.tenant_id=o.tenant_id AND i.event_id=o.event_id
                WHERE i.consumer_id='assurance-index' AND o.aggregate_id=%s""",
                (e["aggregate_id"],),
            ).fetchone()
            exists = c.execute(
                "SELECT 1 FROM inbox WHERE tenant_id=%s AND consumer_id='assurance-index' AND event_id=%s",
                (tenant_id, e["event_id"]),
            ).fetchone()
            if not exists and previous["sequence"] + 1 != e["sequence"]:
                park(c, tenant_id, e, "sequence_gap")  # Preserve a gap. Never guess a missing transition.
                continue
            if not exists:
                c.execute(
                    "INSERT INTO inbox(tenant_id,consumer_id,event_id,sha256) VALUES(%s,'assurance-index',%s,%s)",
                    (tenant_id, e["event_id"], digest(envelope)),
                )
                c.execute(
                    """INSERT INTO assurance_index(tenant_id,event_id,resource_id,resource_version,event_type)
                    VALUES(%s,%s,%s,%s,%s)""",
                    (tenant_id, e["event_id"], e["aggregate_id"], e["aggregate_version"], e["event_type"]),
                )
                processed += 1
            c.execute(
                """UPDATE outbox_delivery SET state='processed'
                WHERE tenant_id=%s AND event_id=%s AND consumer_id='assurance-index'""",
                (tenant_id, e["event_id"]),
            )
    return processed


if __name__ == "__main__":
    import argparse

    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", required=True)
    parser.add_argument("--principal", required=True)
    args = parser.parse_args()
    print(json.dumps({"processed": drain(Settings.load(), args.tenant, args.principal)}))
