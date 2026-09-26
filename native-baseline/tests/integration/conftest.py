import json
import os
from pathlib import Path
from uuid import uuid4

import httpx
import psycopg
import pytest
from psycopg.rows import dict_row

ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture(scope="session")
def settings():
    if os.getenv("ALLOW_SYNTHETIC_HTTP_TESTS") != "true":
        pytest.fail("Run scripts/run_checks.py or explicitly provision a disposable synthetic environment.")
    return json.loads(Path(os.getenv("SANDBOX_CONFIG", ROOT / ".local/config.json")).read_text())


@pytest.fixture(scope="session")
def api(settings):
    with httpx.Client(base_url=settings["origin"], timeout=20, trust_env=False) as c:
        yield c


@pytest.fixture(scope="session")
def sessions(api, settings):
    result = {}
    for profile in ["A_PM", "B_PM", "A_EV", "A_CS", "A_SU"]:
        r = api.post(
            "/dev/session",
            json={"profile": profile},
            headers={"X-Dev-Access-Code": settings["dev_access_code"]},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        result[profile] = {
            **data,
            "headers": {
                "Authorization": "Bearer " + data["access_token"],
                "X-Context-Id": data["context_id"],
            },
        }
    return result


@pytest.fixture
def db(settings):
    # Administrative fixture mutations are isolated to the explicitly opted-in disposable test harness.
    with psycopg.connect(
        os.getenv("MIGRATION_DATABASE_URL", settings["database_url"]),
        autocommit=True,
        row_factory=dict_row,
        prepare_threshold=None,
    ) as c:
        c.execute("SET search_path=sandbox,pg_catalog")
        yield c


@pytest.fixture(scope="session")
def manifest():
    return json.loads((ROOT / "fixtures/manifest.json").read_text())


@pytest.fixture
def draft(sessions):
    return {
        "title": "Integration programme " + uuid4().hex[:8],
        "classification": "internal",
        "schema_version": "1.1",
        "payload": {
            "kind": "Programme",
            "data": {
                "code": "TEST_" + uuid4().hex[:10].upper(),
                "name": "Integration programme",
                "description": "Synthetic integration test programme only.",
                "owner_membership_ref": sessions["A_PM"]["membership_id"],
                "country_codes": ["ZZ"],
                "mode": "synthetic_research",
                "starts_at": "2026-01-01T00:00:00Z",
                "ends_at": "2030-01-01T00:00:00Z",
            },
        },
    }


@pytest.fixture
def create(api, sessions):
    def do(body):
        key = str(uuid4())
        headers = {**sessions["A_PM"]["headers"], "Idempotency-Key": key}
        r = api.post("/v1/resources/ORG", json=body, headers=headers)
        assert r.status_code == 201, r.text
        return r, headers

    return do
