"""Read ledger, replay without change, and prove an altered applied migration is refused."""

import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import psycopg

root = Path(__file__).resolve().parents[1]
config = json.loads(Path(os.getenv("SANDBOX_CONFIG", root / ".local/config.json")).read_text())
if config["app_env"] not in {"development", "test"}:
    raise SystemExit("Migration verification requires a disposable development database.")
dsn = os.getenv("MIGRATION_DATABASE_URL", config["database_url"])
env = {**os.environ, "MIGRATION_DATABASE_URL": dsn}


def ledger():
    with psycopg.connect(dsn, autocommit=True) as c:
        return c.execute(
            "SELECT version,sha256,applied_at FROM public.sandbox_migrations ORDER BY version"
        ).fetchall()


before = ledger()
subprocess.run([sys.executable, str(root / "database/migrate.py")], env=env, check=True, capture_output=True)
assert ledger() == before, "Replay changed the ledger"
for name, digest, _ in before:
    assert hashlib.sha256((root / "database/migrations" / name).read_bytes()).hexdigest() == digest
with tempfile.TemporaryDirectory(prefix="migration-tamper-") as temporary:
    directory = Path(temporary)
    shutil.copy(root / "database/migrate.py", directory / "migrate.py")
    shutil.copytree(root / "database/migrations", directory / "migrations")
    first = sorted((directory / "migrations").glob("*.sql"))[0]
    first.write_text(first.read_text() + "\n-- Deliberate checksum rejection fixture.\n")
    result = subprocess.run(
        [sys.executable, str(directory / "migrate.py")], env=env, capture_output=True, text=True
    )
    assert result.returncode != 0 and "Applied migration checksum changed" in result.stderr
assert ledger() == before, "Tamper test changed the database"
(root / "verification/migrations.json").write_text(
    json.dumps(
        {
            "checks": 3,
            "failed": 0,
            "engine": config["db_engine"],
            "evidence": [
                "ledger hashes match source",
                "repeat application unchanged",
                "modified applied checksum rejected",
            ],
        },
        indent=2,
    )
    + "\n"
)
print("Migration checks: 3 passed (hashes, replay, tamper refusal).")
