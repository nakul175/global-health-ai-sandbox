"""Start the actual DB and HTTP application in one process namespace, then test and shut down."""

import json
import os
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
processes = []
logs = []


def run(args, **kwargs):
    subprocess.run(args, check=True, **kwargs)


def start(args, name):
    file = (ROOT / ".local" / name).open("w")
    logs.append(file)
    child = subprocess.Popen(args, stdout=file, stderr=subprocess.STDOUT)
    processes.append(child)
    return child


try:
    run([sys.executable, "scripts/configure_local.py"])
    settings = json.loads(Path(os.getenv("SANDBOX_CONFIG", ROOT / ".local/config.json")).read_text())
    if settings["db_engine"] == "pglite":
        # A new, private fixture database per run; never mutate the developer's persisted work.
        test_directory = tempfile.TemporaryDirectory(prefix="checks-", dir=ROOT / ".local")
        test_config = Path(test_directory.name) / "config.json"
        test_config.write_text(json.dumps(settings))
        test_config.chmod(0o600)
        os.environ["SANDBOX_CONFIG"] = str(test_config)
        os.environ["SANDBOX_DATA_DIR"] = str(Path(test_directory.name) / "pg")
        database = start(["node", "scripts/embedded-db.mjs"], "db-check.log")
        for _ in range(120):
            if database.poll() is not None:
                raise RuntimeError("Embedded database exited")
            try:
                with socket.create_connection(("127.0.0.1", 55432), timeout=0.2):
                    break
            except OSError:
                time.sleep(0.1)
        else:
            raise RuntimeError("Database startup timed out")
    run([sys.executable, "scripts/bootstrap_local.py"])
    run([sys.executable, "scripts/verify_migrations.py"])
    application = start(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "services.api.app.main:create_app",
            "--factory",
            "--host",
            "127.0.0.1",
            "--port",
            "8000",
            "--no-access-log",
        ],
        "api-check.log",
    )
    for _ in range(100):
        if application.poll() is not None:
            raise RuntimeError("Application exited; inspect .local/api-check.log")
        try:
            if httpx.get(settings["origin"] + "/health/ready", timeout=1, trust_env=False).status_code == 200:
                break
        except httpx.HTTPError:
            pass
        time.sleep(0.1)
    else:
        raise RuntimeError("Application readiness timed out")
    env = {**os.environ, "ALLOW_SYNTHETIC_HTTP_TESTS": "true"}
    env["BASE_URL"] = settings["origin"]
    for name in ("A", "B"):
        issued = httpx.post(
            settings["origin"] + "/dev/session",
            json={"profile": name + "_PM"},
            headers={"X-Dev-Access-Code": settings["dev_access_code"]},
            trust_env=False,
        )
        issued.raise_for_status()
        env["TEST_TOKEN_" + name + "_PM"] = issued.json()["access_token"]
    if "--browser" in sys.argv:
        run(["npm", "run", "test:browser"], env=env)
    run(
        [
            sys.executable,
            "-m",
            "pytest",
            "tests/unit",
            "tests/integration",
            "tests/smoke",
            *(["tests/native"] if "--native" in sys.argv else []),
            "-q",
            "--junitxml=verification/application-tests.xml",
        ],
        env=env,
    )
finally:
    for process in reversed(processes):
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
    for log in logs:
        log.close()
    if "test_directory" in globals():
        test_directory.cleanup()
