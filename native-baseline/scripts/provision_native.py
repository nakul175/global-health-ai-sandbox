"""Provision restricted native development identities on an explicitly supplied disposable localhost DB."""

import json
import os
import secrets
import subprocess
import sys
from pathlib import Path

import psycopg
from psycopg import sql
from psycopg.conninfo import conninfo_to_dict, make_conninfo

root = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(root / "scripts/configure_local.py")], check=True)
dsn = os.environ["MIGRATION_DATABASE_URL"]
parts = conninfo_to_dict(dsn)
if parts.get("host") not in {"127.0.0.1", "localhost"}:
    raise SystemExit(
        "Local disposable PostgreSQL only. Shared provisioning belongs to the deployment pipeline."
    )
settings = json.loads((root / ".local/config.json").read_text())
settings["db_engine"] = "postgres"
with psycopg.connect(dsn, autocommit=True) as c:
    version = c.execute("SELECT current_setting('server_version_num')::int").fetchone()[0]
    if version != 180006:
        raise SystemExit("The native acceptance target is exactly PostgreSQL 18.6.")
    c.execute((root / "database/bootstrap.sql").read_text())
    for role, key in [
        ("api", "database_url"),
        ("policy", "policy_database_url"),
        ("worker", "worker_database_url"),
    ]:
        username = "health_sandbox_local_" + role
        password = secrets.token_urlsafe(32)
        exists = c.execute("SELECT 1 FROM pg_roles WHERE rolname=%s", (username,)).fetchone()
        if not exists:
            c.execute(
                sql.SQL(
                    "CREATE ROLE {} LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE NOREPLICATION"
                ).format(sql.Identifier(username))
            )
        c.execute(
            sql.SQL("ALTER ROLE {} PASSWORD {}").format(sql.Identifier(username), sql.Literal(password))
        )
        c.execute(
            sql.SQL("GRANT {} TO {}").format(sql.Identifier("sandbox_" + role), sql.Identifier(username))
        )
        settings[key] = make_conninfo(dsn, user=username, password=password)
path = root / ".local/native-config.json"
path.write_text(json.dumps(settings, indent=2) + "\n")
path.chmod(0o600)
print("Native runtime identities provisioned. Configuration: .local/native-config.json")
