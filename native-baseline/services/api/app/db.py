import threading
from contextlib import contextmanager, nullcontext

import psycopg
from psycopg.rows import dict_row

EMBEDDED_LOCK = threading.RLock()
ROLES = {"api": "sandbox_api", "policy": "sandbox_policy", "worker": "sandbox_worker"}


@contextmanager
def connection(settings, role="api"):
    # PGlite has one backend. Serialize entire local transactions, never individual SQL statements.
    guard = EMBEDDED_LOCK if settings.db_engine == "pglite" else nullcontext()
    url = {
        "api": settings.database_url,
        "policy": settings.policy_database_url,
        "worker": settings.worker_database_url,
    }[role]
    with guard:
        with psycopg.connect(url, row_factory=dict_row, connect_timeout=5, prepare_threshold=None) as c:
            if settings.db_engine == "pglite":
                c.execute("SET LOCAL ROLE " + ROLES[role])  # fixed allowlist; local harness only
            c.execute("SET LOCAL search_path=sandbox,pg_catalog")
            c.execute("SET LOCAL statement_timeout='8s'")
            c.execute("SET LOCAL lock_timeout='2s'")
            yield c


def set_context(c, tenant, principal):
    c.execute(
        "SELECT set_config('app.tenant_id',%s,true),set_config('app.principal_id',%s,true)",
        (str(tenant), str(principal)),
    )


def check_runtime(settings):
    with connection(settings) as c:
        row = c.execute(
            "SELECT rolsuper,rolbypassrls,rolname FROM pg_roles WHERE rolname=current_user"
        ).fetchone()
        if row["rolsuper"] or row["rolbypassrls"] or row["rolname"] == "sandbox_owner":
            raise ValueError("Unsafe API database identity")
        if c.execute("SELECT pg_has_role(current_user,'sandbox_owner','MEMBER') AS owner").fetchone()[
            "owner"
        ]:
            raise ValueError("API identity must not inherit the owner role")
        for privilege in ("DELETE", "TRUNCATE"):
            if c.execute(
                "SELECT has_table_privilege(current_user,'sandbox.resources',%s) AS allowed", (privilege,)
            ).fetchone()["allowed"]:
                raise ValueError("Unsafe API database privileges")
