import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID

import jwt

from .db import set_context
from .errors import Fault


@dataclass(frozen=True)
class Actor:
    tenant: str
    principal: str
    context: str
    membership: str
    role: str
    person: str
    tenant_code: str
    auth_time: datetime
    assurance: str


class Verifier:
    def __init__(self, settings):
        self.settings = settings

    def claims(self, authorization):
        if not authorization or not authorization.startswith("Bearer "):
            raise Fault(401, "E_AUTH_REQUIRED", "Sign in to continue.")
        token = authorization[7:]
        if len(token) > 8192:
            raise Fault(401, "E_AUTH_REQUIRED", "The session is invalid or expired.")
        try:
            # Trusted local JWKS path; no token-supplied URL or algorithm is followed.
            header = jwt.get_unverified_header(token)
            if header.get("alg") != "RS256" or not isinstance(header.get("kid"), str):
                raise ValueError("invalid header")
            keys = json.loads(Path(self.settings.jwks_file).read_text())["keys"]
            matching = [k for k in keys if k["kid"] == header["kid"] and k.get("alg") == "RS256"]
            if len(matching) != 1:
                raise ValueError("unknown signing key")
            claims = jwt.decode(
                token,
                jwt.PyJWK.from_dict(matching[0]).key,
                algorithms=["RS256"],
                issuer=self.settings.issuer,
                audience=self.settings.audience,
                leeway=5,
                options={"require": ["sub", "exp", "iat", "nbf", "iss", "aud", "tenant_id", "principal_id"]},
            )
            claims["tenant_id"] = str(UUID(claims["tenant_id"]))
            claims["principal_id"] = str(UUID(claims["principal_id"]))
            if claims["exp"] - claims["iat"] > 3600:
                raise ValueError("token lifetime")
            return claims
        except (jwt.PyJWTError, ValueError, TypeError, KeyError):
            raise Fault(401, "E_AUTH_REQUIRED", "The session is invalid or expired.") from None

    def actor(self, c, authorization, context_id):
        claims = self.claims(authorization)
        try:
            context_id = str(UUID(context_id or ""))
        except (ValueError, TypeError):
            raise Fault(400, "E_BAD_REQUEST", "Select a valid institution context.") from None
        set_context(c, claims["tenant_id"], claims["principal_id"])
        c.execute("SELECT lock_current_identity(%s)", (context_id,))
        row = c.execute(
            """SELECT c.*,m.role_code,p.person_id,t.code,t.region,t.state AS tenant_state,
            a.last_seen_at
            FROM auth_contexts c JOIN principals p ON p.tenant_id=c.tenant_id AND p.id=c.principal_id
            JOIN tenants t ON t.id=c.tenant_id
            JOIN memberships m ON m.tenant_id=c.tenant_id AND m.id=c.membership_id
            JOIN identity_bindings b ON b.tenant_id=p.tenant_id AND b.principal_id=p.id
            JOIN context_activity a ON a.tenant_id=c.tenant_id AND a.context_id=c.id
            WHERE c.id=%s AND c.principal_id=%s AND b.issuer=%s AND b.subject_sha256=%s
            AND p.enabled AND p.kind='human' AND c.revoked_at IS NULL AND c.expires_at>now()
            AND c.auth_time<=now() AND c.auth_time>now()-interval '12 hours'
            AND m.principal_id=p.id AND m.state='active' AND m.valid_from<=now() AND m.valid_until>now()
            """,
            (
                context_id,
                claims["principal_id"],
                self.settings.issuer,
                hashlib.sha256(claims["sub"].encode()).hexdigest(),
            ),
        ).fetchone()
        if not row:
            raise Fault(403, "E_ACCESS_DENIED", "This institution context is no longer available.")
        now = datetime.now(timezone.utc)
        idle_seconds = 900 if row["role_code"] in {"OA", "SO", "CS"} else 1800
        if (now - row["last_seen_at"]).total_seconds() >= idle_seconds:
            raise Fault(401, "E_AUTH_REQUIRED", "Your session timed out. Sign in again.")
        if row["region"] != self.settings.region:
            raise Fault(403, "E_REGION_FORBIDDEN", "This context belongs to another region.")
        if row["tenant_state"] != "verified":
            raise Fault(403, "E_ACCESS_DENIED", "A verified institution is required for this workflow.")
        c.execute(
            "UPDATE context_activity SET last_seen_at=now() WHERE tenant_id=%s AND context_id=%s",
            (claims["tenant_id"], context_id),
        )
        return Actor(
            claims["tenant_id"],
            claims["principal_id"],
            context_id,
            str(row["membership_id"]),
            row["role_code"],
            str(row["person_id"]),
            row["code"],
            row["auth_time"],
            row["assurance"],
        )


def require_recent_mfa(actor):
    if actor.assurance != "mfa" or (datetime.now(timezone.utc) - actor.auth_time).total_seconds() > 300:
        raise Fault(403, "E_ASSURANCE_REQUIRED", "Sign in again before applying a safety hold.")
