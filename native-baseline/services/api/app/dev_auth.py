import hmac
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4

import jwt

from .config import ROOT
from .db import connection, set_context
from .errors import Fault

PROFILES = {
    "A_PM": ("A", "PM", "Aster Research Institute · Programme manager"),
    "B_PM": ("B", "PM", "Beacon Health Lab · Programme manager"),
    "A_EV": ("A", "EV", "Aster Research Institute · Evaluator"),
    "A_CS": ("A", "CS", "Aster Research Institute · Clinical safety"),
    "A_SU": ("A", "SU", "Aster Research Institute · Support"),
}


def login(settings, profile, code):
    if not settings.allow_dev_auth or not hmac.compare_digest(str(code), settings.dev_access_code):
        raise Fault(401, "E_AUTH_REQUIRED", "The local access code is incorrect.")
    if profile not in PROFILES:
        raise Fault(422, "E_VALIDATION", "Select an available synthetic identity.")
    tenant_name, role, label = PROFILES[profile]
    tenant = json.loads((ROOT / "fixtures/manifest.json").read_text())["tenants"][tenant_name]
    principal, membership = tenant["principals"][role], tenant["memberships"][role]
    now = datetime.now(timezone.utc)
    context_id = str(uuid4())
    with connection(settings, "policy") as c:
        set_context(c, tenant["id"], principal)
        member = c.execute(
            """SELECT 1 FROM memberships m JOIN principals p
            ON p.tenant_id=m.tenant_id AND p.id=m.principal_id
            WHERE m.tenant_id=%s AND m.id=%s AND m.state='active' AND m.valid_until>now()
            AND m.valid_from<=now() AND p.enabled""",
            (tenant["id"], membership),
        ).fetchone()
        if not member:
            raise Fault(403, "E_ACCESS_DENIED", "This synthetic membership is expired or revoked.")
        c.execute(
            """INSERT INTO auth_contexts(tenant_id,id,principal_id,membership_id,auth_time,assurance,expires_at)
            VALUES(%s,%s,%s,%s,%s,'mfa',%s)""",
            (tenant["id"], context_id, principal, membership, now, now + timedelta(hours=1)),
        )
        c.execute(
            "INSERT INTO context_activity(tenant_id,context_id) VALUES(%s,%s)", (tenant["id"], context_id)
        )
    token = jwt.encode(
        {
            "iss": settings.issuer,
            "aud": settings.audience,
            "sub": principal,
            "tenant_id": tenant["id"],
            "principal_id": principal,
            "iat": int(now.timestamp()),
            "nbf": int(now.timestamp()),
            "exp": int((now + timedelta(hours=1)).timestamp()),
        },
        Path(settings.private_key_file).read_text(),
        algorithm="RS256",
        headers={"kid": "local-1"},
    )
    return {
        "access_token": token,
        "context_id": context_id,
        "expires_in": 3600,
        "display_name": label,
        "membership_id": membership,
        "role": role,
    }
