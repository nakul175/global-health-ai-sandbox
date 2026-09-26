"""Initialize once. Refuses non-loopback/admin DSNs or an existing foreign schema."""

import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path
from uuid import UUID, uuid5

import psycopg
from psycopg.conninfo import conninfo_to_dict

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from services.api.app.config import Settings  # noqa: E402
from services.api.app.contracts import canonical  # noqa: E402

settings = Settings.load()
dsn = os.getenv("MIGRATION_DATABASE_URL", settings.database_url)
if settings.app_env not in {"development", "test"} or conninfo_to_dict(dsn).get("host") not in {
    "127.0.0.1",
    "localhost",
}:
    raise SystemExit("Synthetic bootstrap is restricted to disposable loopback development databases.")
with psycopg.connect(dsn, autocommit=True, prepare_threshold=None) as c:
    c.execute((ROOT / "database/bootstrap.sql").read_text())
subprocess.run(
    [sys.executable, str(ROOT / "database/migrate.py")],
    cwd=ROOT,
    check=True,
    env={**os.environ, "MIGRATION_DATABASE_URL": dsn},
)
manifest = json.loads((ROOT / "fixtures/manifest.json").read_text())
with psycopg.connect(dsn, prepare_threshold=None) as c:
    c.execute("SET search_path=sandbox,pg_catalog")
    if c.execute("SELECT 1 FROM tenants LIMIT 1").fetchone():
        print("Existing data retained; migrations are current.")
        raise SystemExit(0)
    c.execute("SET LOCAL app.seed_allowed='synthetic-only'")
    c.execute((ROOT / "fixtures/seed.sql").read_text())
    c.execute("SET search_path=sandbox,pg_catalog")
    c.execute("UPDATE memberships SET valid_until=now()+interval '30 days'")
    for letter in ("A", "B"):
        t = manifest["tenants"][letter]
        for role, principal in t["principals"].items():
            c.execute(
                "INSERT INTO identity_bindings VALUES(%s,%s,%s,%s)",
                (t["id"], principal, settings.issuer, hashlib.sha256(principal.encode()).hexdigest()),
            )
            if role in t["contexts"]:
                c.execute(
                    "INSERT INTO context_activity(tenant_id,context_id) VALUES(%s,%s)",
                    (t["id"], t["contexts"][role]),
                )
        c.execute(
            "INSERT INTO programme_creation_scopes VALUES(%s,%s,'programme administration',now()+interval '30 days',NULL)",
            (t["id"], t["memberships"]["PM"]),
        )
        for role in ("PM", "EV", "SR", "CS", "SO"):
            c.execute(
                "INSERT INTO membership_scopes VALUES(%s,%s,%s,'programme administration') ON CONFLICT DO NOTHING",
                (t["id"], t["memberships"][role], t["resources"]["programme"]),
            )
        for i, title in enumerate(
            ["Respiratory AI evaluation", "Maternal health research", "Diagnostic equity study"]
            if letter == "A"
            else ["Community health evaluation"]
        ):
            rid = str(uuid5(UUID(t["id"]), f"programme:{i + 1}"))
            data = {
                "code": f"SYN_{letter}_{i + 1:03}",
                "name": title,
                "description": "Synthetic research programme for testing governed health AI workflows. Contains no patient data.",
                "owner_membership_ref": t["memberships"]["PM"],
                "country_codes": ["ZZ"],
                "mode": "synthetic_research",
                "starts_at": "2026-09-01T00:00:00+00:00",
                "ends_at": "2027-08-31T00:00:00+00:00",
            }
            c.execute(
                "INSERT INTO resources(tenant_id,id,kind,title,classification,state,created_by) VALUES(%s,%s,'programme',%s,'internal','draft',%s)",
                (t["id"], rid, title, t["principals"]["PM"]),
            )
            c.execute(
                "INSERT INTO programmes(tenant_id,id,code,name,description,owner_membership_id,mode,starts_at,ends_at) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (
                    t["id"],
                    rid,
                    data["code"],
                    title,
                    data["description"],
                    t["memberships"]["PM"],
                    data["mode"],
                    data["starts_at"],
                    data["ends_at"],
                ),
            )
            c.execute(
                "INSERT INTO programme_countries(tenant_id,programme_id,country_code) VALUES(%s,%s,'ZZ')",
                (t["id"], rid),
            )
            for role in ("PM", "EV", "SR", "CS", "SO"):
                c.execute(
                    "INSERT INTO membership_scopes VALUES(%s,%s,%s,'programme administration')",
                    (t["id"], t["memberships"][role], rid),
                )
            value = {
                "id": rid,
                "domain": "ORG",
                "title": title,
                "version": 1,
                "state": "draft",
                "classification": "internal",
                "schema_version": "1.1",
                "payload": {"kind": "Programme", "data": data},
            }
            raw = canonical(value)
            c.execute(
                "INSERT INTO resource_versions VALUES(%s,%s,1,'Programme','1.1',%s,%s,%s,now())",
                (t["id"], rid, hashlib.sha256(raw).hexdigest(), f"db://{rid}/1", t["principals"]["PM"]),
            )
            c.execute("INSERT INTO resource_snapshot_bytes VALUES(%s,%s,1,%s)", (t["id"], rid, raw))
    print("Seeded synthetic Aster and Beacon workspaces; identity memberships expire in 30 days.")
