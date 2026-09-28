#!/usr/bin/env python3
"""Verify the reconciled edition without turning documentation checks into application claims."""
import csv
import hashlib
import io
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
import zipfile

ROOT = Path(__file__).resolve().parents[1]
CURRENT = ROOT / "docs/current"

def require(ok, message):
    if not ok:
        raise AssertionError(message)

def load(path):
    return json.loads((ROOT / path).read_text())

def check():
    # Regeneration must be deterministic, and stale source-derived inventories must fail.
    with tempfile.TemporaryDirectory(prefix="sandbox-documentation-") as temp:
        copy = Path(temp) / "repo"
        shutil.copytree(ROOT, copy, ignore=shutil.ignore_patterns(".git", "node_modules", ".venv", ".wrangler", "dist", "__pycache__"))
        subprocess.run([sys.executable, str(copy / "scripts/build-current-docs.py")],
                       check=True, stdout=subprocess.DEVNULL, cwd=copy)
        generated = copy / "docs/current"
        checked = 0
        for p in generated.rglob("*"):
            if not p.is_file():
                continue
            actual = CURRENT / p.relative_to(generated)
            require(actual.exists() and actual.read_bytes() == p.read_bytes(),
                    "Stale current document; regenerate/review: " + str(actual.relative_to(ROOT)))
            checked += 1

    source = load("docs/source-backlog/source_traceability_model.json")
    register = load("docs/current/IMPLEMENTATION-REGISTER.json")
    reqs = register["requirements"]
    expected = {
        "original": source["requirements"],
        "synthetic_r2": load("docs/source-backlog/r2/requirements.json"),
        "government_r3": load("docs/releases/r3/requirements.json"),
    }
    require(len(reqs) == len({(r["catalogue"], r["id"]) for r in reqs}), "Duplicate namespaced requirement")
    for catalogue, rows in expected.items():
        require({r["id"] for r in rows} == {r["id"] for r in reqs if r["catalogue"] == catalogue},
                "Missing requirement: " + catalogue)
    for r in reqs:
        require(r["status"] not in {"passed", "verified", "accepted"}, "Unsupported promoted acceptance")
        require((ROOT / r["source_file"]).exists() and (ROOT / r["design"]).exists(), "Missing traceability source/design")
        for p in r["related_source_paths"]:
            require((ROOT / p).exists(), "Missing related source: " + p)
    require(all(t["status"] == "planned" for t in load("docs/releases/r3/tests.json")), "R3 test statuses unexpectedly changed")

    original = load("native-baseline/tests/reference/source_test_catalogue.json")
    for sheet, data in original.items():
        target = CURRENT / "test-catalogue" / (sheet.lower().replace(" ", "-") + ".csv")
        rows = list(csv.reader(io.StringIO(target.read_text())))
        expected_rows = [data["headers"]] + [[str(x) for x in row] for row in data["rows"]]
        require(rows == expected_rows, "Original catalogue text/status changed: " + sheet)

    links = 0
    for p in list(CURRENT.glob("*.md")) + [ROOT / "docs/IMPLEMENTATION.md", ROOT / "docs/QUALIFICATION.md",
                                         ROOT / "docs/NEXT-DELIVERY.md", ROOT / "docs/history/README.md"]:
        for target in re.findall(r'!?\[[^\]]*\]\(([^)]+)\)', p.read_text()):
            target = target.split(' "', 1)[0]
            if re.match(r"^[a-z]+:", target) or target.startswith("#"):
                continue
            target = urllib.parse.unquote(target.split("#", 1)[0])
            require((p.parent / target).resolve().exists(), "Broken link: " + str(p.relative_to(ROOT)) + " → " + target)
            links += 1

    manifest = load("docs/history/pre-v1.1/MANIFEST.json")
    archive_path = ROOT / "docs/history/pre-v1.1/baseline-documentation.zip"
    require(hashlib.sha256(archive_path.read_bytes()).hexdigest() == manifest["archive_sha256"], "History archive hash changed")
    with zipfile.ZipFile(archive_path) as archive:
        require(archive.testzip() is None, "History ZIP integrity failed")
        require(set(archive.namelist()) == {r["path"] for r in manifest["files"]}, "History archive membership changed")
        for row in manifest["files"]:
            raw = archive.read(row["path"])
            require(hashlib.sha256(raw).hexdigest() == row["sha256"], "History bytes changed: " + row["path"])
            require(hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest() == row["git_blob_sha"],
                    "Git source mismatch in archive: " + row["path"])

    screens = load("docs/current/screens.json")
    require(len(screens) == len({s["id"] for s in screens}), "Duplicate screen IDs")
    require({s["id"] for s in source["screens"]} == {s["id"] for s in screens if s["classification"] == "original_target"},
            "Original screens not preserved")
    api = load("docs/current/API-INVENTORY.json")
    require(all(c["roles"] for c in api["commands"]), "Command permission extraction failed")
    require(len(api["commands"]) == len({c["action"] for c in api["commands"]}), "Duplicate commands")
    require(sum(c["entry"] == "internal_media_route_only" for c in api["commands"]) == 3, "Internal action boundary lost")

    # Readiness files must expose key qualifications, not merely document titles.
    implementation = (ROOT / "docs/IMPLEMENTATION.md").read_text()
    qualification = (ROOT / "docs/QUALIFICATION.md").read_text()
    require("PR #13" in implementation and "not inspected" in implementation, "Missing code/deployment distinction")
    require("134 planned" in qualification and "not executed" in qualification, "Missing execution limits")
    return {"scope":"documentation_and_reference_inventory_only","current_files_checked":checked,
            "relative_links":links,"requirement_entries":len(reqs),"history_files":len(manifest["files"]),
            "screen_entries":len(screens),"application_tests_run":0}

if __name__ == "__main__":
    print(json.dumps(check(), indent=2))
