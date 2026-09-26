import base64
import hashlib
import hmac
import json
import re
import time
from datetime import datetime, timezone
from uuid import uuid4

from .contracts import canonical, digest, programme_semantics, validate
from .errors import Fault, hidden
from .transactions import commit_result, idempotency, replay, store_snapshot

READ_ROLES = {"PM", "EV", "SR", "CS"}
PURPOSE = "programme administration"


def can_create(c, actor):
    return actor.role == "PM" and bool(
        c.execute(
            """SELECT 1 FROM programme_creation_scopes
        WHERE tenant_id=%s AND membership_id=%s AND purpose=%s
        AND valid_until>now() AND revoked_at IS NULL""",
            (actor.tenant, actor.membership, PURPOSE),
        ).fetchone()
    )


def available(c, actor, rid, write=False):
    if actor.role not in READ_ROLES:
        raise hidden()
    row = c.execute(
        """SELECT r.*,p.code,p.name,p.description,p.owner_membership_id,p.mode,p.starts_at,p.ends_at
        FROM resources r JOIN programmes p ON p.tenant_id=r.tenant_id AND p.id=r.id
        WHERE r.tenant_id=%s AND r.id=%s AND EXISTS(SELECT 1 FROM membership_scopes s
        WHERE s.tenant_id=r.tenant_id AND s.resource_id=r.id AND s.membership_id=%s
        AND s.purpose=%s)"""
        + (" FOR UPDATE OF r" if write else " FOR SHARE OF r"),
        (actor.tenant, rid, actor.membership, PURPOSE),
    ).fetchone()
    if not row:
        raise hidden()
    if write and (actor.role != "PM" or str(row["owner_membership_id"]) != actor.membership):
        raise Fault(403, "E_ACCESS_DENIED", "Only the current programme owner can edit this draft.")
    return row


def check_hold(c, actor, rid):
    if c.execute(
        "SELECT 1 FROM holds WHERE tenant_id=%s AND scope_id=%s AND released_at IS NULL", (actor.tenant, rid)
    ).fetchone():
        raise Fault(409, "E_HOLD_ACTIVE", "An active hold prevents changes to this programme.")


def represent(c, actor, row):
    countries = c.execute(
        """SELECT country_code FROM programme_countries
        WHERE tenant_id=%s AND programme_id=%s AND retired_at IS NULL ORDER BY country_code""",
        (actor.tenant, row["id"]),
    ).fetchall()
    return {
        "id": str(row["id"]),
        "domain": "ORG",
        "title": row["title"],
        "version": row["version"],
        "state": row["state"],
        "classification": row["classification"],
        "schema_version": "1.1",
        "payload": {
            "kind": "Programme",
            "data": {
                "code": row["code"],
                "name": row["name"],
                "description": row["description"],
                "owner_membership_ref": str(row["owner_membership_id"]),
                "country_codes": [r["country_code"] for r in countries],
                "mode": row["mode"],
                "starts_at": row["starts_at"].isoformat(),
                "ends_at": row["ends_at"].isoformat(),
            },
        },
    }


def create(c, actor, body, key, correlation):
    validate("ResourceDraft", body)
    if body["payload"]["kind"] != "Programme":
        raise Fault(409, "E_CAPABILITY_DISABLED", "This resource type is not enabled in this release.")
    if not can_create(c, actor):
        raise Fault(403, "E_ACCESS_DENIED", "Programme creation is not delegated to this context.")
    data = body["payload"]["data"]
    programme_semantics(data)
    if data["owner_membership_ref"] != actor.membership:
        raise Fault(403, "E_ACCESS_DENIED", "Create the draft under your active programme membership.")
    fp, receipt = idempotency(c, actor, "CreateDraft", key, body, "POST", "/v1/resources/ORG")
    if receipt:
        available(c, actor, receipt["resource_id"], write=True)
        check_hold(c, actor, receipt["resource_id"])
        return replay(receipt)
    if not body["title"].strip():
        raise Fault(422, "E_SEMANTIC", "Title cannot be blank.")
    rid = str(uuid4())
    c.execute(
        """INSERT INTO resources(tenant_id,id,kind,title,classification,state,created_by)
        VALUES(%s,%s,'programme',%s,%s,'draft',%s)""",
        (actor.tenant, rid, body["title"], body["classification"], actor.principal),
    )
    c.execute(
        """INSERT INTO programmes(tenant_id,id,code,name,description,owner_membership_id,
        mode,starts_at,ends_at) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (
            actor.tenant,
            rid,
            data["code"],
            data["name"],
            data["description"],
            actor.membership,
            data["mode"],
            data["starts_at"],
            data["ends_at"],
        ),
    )
    for country in data["country_codes"]:
        c.execute(
            "INSERT INTO programme_countries(tenant_id,programme_id,country_code) VALUES(%s,%s,%s)",
            (actor.tenant, rid, country),
        )
    c.execute(
        "INSERT INTO membership_scopes VALUES(%s,%s,%s,%s)", (actor.tenant, actor.membership, rid, PURPOSE)
    )
    resource = represent(c, actor, available(c, actor, rid))
    store_snapshot(c, actor, resource)
    return commit_result(
        c, actor, "CreateDraft", key, fp, resource, resource, 201, correlation, "CreateDraftCommitted"
    )


def update(c, actor, rid, body, key, etag, correlation):
    validate("ResourcePatch", body)
    if not etag:
        raise Fault(428, "E_PRECONDITION_REQUIRED", "Reload the programme version before saving.")
    if not re.fullmatch(r'"v[1-9][0-9]*"', etag):
        raise Fault(400, "E_BAD_REQUEST", "Use the quoted programme version in If-Match.")
    row = available(c, actor, rid, write=True)
    check_hold(c, actor, rid)
    fp, receipt = idempotency(
        c,
        actor,
        "UpdateDraft",
        key,
        body,
        "PATCH",
        "/v1/resources/ORG/" + str(rid),
        {"object_ref": str(rid), "expected_version": int(etag[2:-1])},
    )
    if receipt:
        return replay(receipt)
    if row["version"] != int(etag[2:-1]):
        raise Fault(409, "E_VERSION_CONFLICT", "A newer version is available. Review it before saving.")
    if row["state"] not in {"draft", "returned"}:
        raise Fault(409, "E_GATE_BLOCKED", "This version is read-only.")
    title = body.get("title", row["title"])
    if not title.strip():
        raise Fault(422, "E_SEMANTIC", "Title cannot be blank.")
    if "payload" in body:
        if body["payload"]["kind"] != "Programme":
            raise Fault(422, "E_SEMANTIC", "The resource type cannot change.")
        data = body["payload"]["data"]
        programme_semantics(data)
        if data["code"] != row["code"] or data["owner_membership_ref"] != str(row["owner_membership_id"]):
            raise Fault(422, "E_SEMANTIC", "Programme code and ownership are fixed for this workflow.")
        c.execute(
            """UPDATE programmes SET name=%s,description=%s,mode=%s,starts_at=%s,ends_at=%s
            WHERE tenant_id=%s AND id=%s""",
            (
                data["name"],
                data["description"],
                data["mode"],
                data["starts_at"],
                data["ends_at"],
                actor.tenant,
                rid,
            ),
        )
        c.execute(
            "UPDATE programme_countries SET retired_at=now() WHERE tenant_id=%s AND programme_id=%s",
            (actor.tenant, rid),
        )
        for country in data["country_codes"]:
            c.execute(
                """INSERT INTO programme_countries(tenant_id,programme_id,country_code) VALUES(%s,%s,%s)
                ON CONFLICT(tenant_id,programme_id,country_code) DO UPDATE SET retired_at=NULL""",
                (actor.tenant, rid, country),
            )
    c.execute(
        "UPDATE resources SET title=%s,version=version+1,updated_at=now() WHERE tenant_id=%s AND id=%s",
        (title, actor.tenant, rid),
    )
    resource = represent(c, actor, available(c, actor, rid))
    store_snapshot(c, actor, resource)
    return commit_result(
        c, actor, "UpdateDraft", key, fp, resource, resource, 200, correlation, "UpdateDraftCommitted"
    )


def scope_revision(c, actor):
    rows = c.execute(
        """SELECT resource_id,purpose FROM membership_scopes
        WHERE tenant_id=%s AND membership_id=%s ORDER BY resource_id,purpose""",
        (actor.tenant, actor.membership),
    ).fetchall()
    return digest([{"id": str(r["resource_id"]), "purpose": r["purpose"]} for r in rows])


def encode_cursor(value, key):
    raw = canonical(value)
    return (
        base64.urlsafe_b64encode(raw).decode().rstrip("=")
        + "."
        + hmac.new(key.encode(), raw, hashlib.sha256).hexdigest()
    )


def decode_cursor(token, key, binding):
    try:
        if len(token) > 2048:
            raise ValueError()
        encoded, signature = token.split(".")
        raw = base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4))
        if not hmac.compare_digest(signature, hmac.new(key.encode(), raw, hashlib.sha256).hexdigest()):
            raise ValueError()
        value = json.loads(raw)
        if any(value[k] != v for k, v in binding.items()) or value["exp"] < time.time():
            raise ValueError()
        return value
    except (ValueError, KeyError, TypeError):
        raise Fault(
            422, "E_VALIDATION", "This page link expired or its access scope changed. Refresh the list."
        ) from None


def listing(c, actor, limit, cursor, key):
    if actor.role not in READ_ROLES:
        return {"items": [], "next_cursor": None}
    binding = {
        "v": 1,
        "tenant": actor.tenant,
        "principal": actor.principal,
        "context": actor.context,
        "scope": scope_revision(c, actor),
        "filter": digest({"domain": "ORG", "limit": limit}),
    }
    now = datetime.now(timezone.utc).isoformat()
    page = (
        decode_cursor(cursor, key, binding)
        if cursor
        else {**binding, "as_of": now, "exp": int(time.time()) + 900}
    )
    values = [actor.tenant, actor.membership, PURPOSE, page["as_of"]]
    tail = ""
    if "last_id" in page:
        tail = " AND (r.created_at,r.id)<(%s::timestamptz,%s::uuid)"
        values += [page["last_at"], page["last_id"]]
    values += [limit + 1]
    rows = c.execute(
        """SELECT r.* FROM resources r JOIN programmes p ON p.tenant_id=r.tenant_id AND p.id=r.id
        WHERE r.tenant_id=%s AND EXISTS(SELECT 1 FROM membership_scopes s WHERE s.tenant_id=r.tenant_id
        AND s.resource_id=r.id AND s.membership_id=%s AND s.purpose=%s) AND r.created_at<=%s::timestamptz"""
        + tail
        + " ORDER BY r.created_at DESC,r.id DESC LIMIT %s",
        values,
    ).fetchall()
    more = len(rows) > limit
    rows = rows[:limit]
    items = [
        {
            "id": str(r["id"]),
            "domain": "ORG",
            "title": r["title"],
            "version": r["version"],
            "state": r["state"],
            "classification": r["classification"],
            "schema_version": "1.1",
        }
        for r in rows
    ]
    next_page = None
    if more:
        next_page = encode_cursor(
            {**page, "last_id": str(rows[-1]["id"]), "last_at": rows[-1]["created_at"].isoformat()}, key
        )
    return {"items": items, "next_cursor": next_page}
