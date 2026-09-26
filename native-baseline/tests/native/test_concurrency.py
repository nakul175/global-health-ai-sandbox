"""Required native-only assertions. An embedded database is an explicit failure, never a skip."""

import json
import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from uuid import uuid4

import httpx
import psycopg


def test_native_same_key_and_stale_edit_races():
    config = json.loads(Path(os.environ["SANDBOX_CONFIG"]).read_text())
    assert config["db_engine"] == "postgres", "Native PostgreSQL is required for this gate"
    with psycopg.connect(os.environ["MIGRATION_DATABASE_URL"]) as db:
        assert db.execute("SELECT current_setting('server_version_num')::int").fetchone()[0] == 180006
    sessions = []
    for _ in range(2):
        session = httpx.post(
            config["origin"] + "/dev/session",
            json={"profile": "A_PM"},
            headers={"X-Dev-Access-Code": config["dev_access_code"]},
            trust_env=False,
        ).json()
        sessions.append(session)
    code = "RACE_" + uuid4().hex[:16].upper()
    body = {
        "title": "Native concurrency fixture",
        "classification": "internal",
        "schema_version": "1.1",
        "payload": {
            "kind": "Programme",
            "data": {
                "code": code,
                "name": "Concurrent fixture",
                "description": "Synthetic native race test.",
                "owner_membership_ref": sessions[0]["membership_id"],
                "country_codes": ["ZZ"],
                "mode": "synthetic_research",
                "starts_at": "2026-01-01T00:00:00Z",
                "ends_at": "2030-01-01T00:00:00Z",
            },
        },
    }
    key = str(uuid4())

    def headers(index):
        s = sessions[index]
        return {
            "Authorization": "Bearer " + s["access_token"],
            "X-Context-Id": s["context_id"],
            "Idempotency-Key": key,
        }

    def create(index):
        return httpx.post(
            config["origin"] + "/v1/resources/ORG",
            json=body,
            headers=headers(index),
            trust_env=False,
            timeout=10,
        )

    with ThreadPoolExecutor(2) as pool:
        results = list(pool.map(create, [0, 1]))
    assert [r.status_code for r in results] == [201, 201]
    assert results[0].json() == results[1].json()
    rid = results[0].json()["id"]

    def edit(index):
        return httpx.patch(
            config["origin"] + "/v1/resources/ORG/" + rid,
            json={"title": f"Concurrent edit {index}"},
            headers={**headers(index), "If-Match": '"v1"', "Idempotency-Key": str(uuid4())},
            trust_env=False,
            timeout=10,
        )

    with ThreadPoolExecutor(2) as pool:
        results = list(pool.map(edit, [0, 1]))
    assert sorted(r.status_code for r in results) == [200, 409]
    with psycopg.connect(os.environ["MIGRATION_DATABASE_URL"]) as db:
        assert db.execute("SELECT count(*) FROM sandbox.programmes WHERE code=%s", (code,)).fetchone()[0] == 1
        assert (
            db.execute("SELECT count(*) FROM sandbox.outbox WHERE aggregate_id=%s", (rid,)).fetchone()[0] == 2
        )
