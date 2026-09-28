# Global Health AI Sandbox — working programme slice

Version 0.1.0 · 25 September 2026

A working FastAPI, React and PostgreSQL application built from the saved implementation pack. This is the first local development slice, not the complete R1 system or a production deployment.

## What works

- Sign in with a short-lived, RSA-signed synthetic identity. Switch between two institutions and five test roles.
- Browse only explicitly delegated programmes; create a programme and edit its complete draft payload.
- Reject stale edits, invalid nested fields, unauthorized ownership, duplicate request intents and cross-tenant access.
- Commit each change with an immutable snapshot, receipt, audit record and outbox event in one transaction.
- Record a safety concern without attachments or a selected programme. The API also supports an authorized, recent-MFA, single-programme hold that blocks changes and replay.
- Consume committed events once into a local assurance index using the worker command.
- Use a responsive interface with validation, retained drafts, conflict review, read-only states, keyboard access and offline feedback.

## Start locally

The supplied local launcher targets Linux/macOS with Python **3.12.14**, Node **24.19.0**, and npm **11.9.0**. Use a Linux environment such as WSL on Windows.

```bash
cd health-ai-sandbox
python3.12 -m venv .venv
.venv/bin/python -m pip install --require-hashes -r environment/requirements-dev.lock
npm ci
npm run dev
```

Open **http://127.0.0.1:8000**. The launcher prints a newly generated local access code. Choose **Aster Research Institute · Programme manager**, enter that code, then create a programme. Choose the evaluator identity to inspect read-only behaviour, or Beacon to see a different tenant.

The launcher creates private local signing material, applies checksum-guarded migrations, seeds synthetic data once, builds the client and starts the API. `Ctrl+C` stops both processes. Programme data persists under `.local/pg`; signing material and local data are excluded from this package and version control. Fixture memberships expire after 30 days. Do not use this development issuer or database with real patient data.

The default local database is **PGlite 0.5.8 / PostgreSQL 18.3**, accessed through PostgreSQL's wire protocol. It lets the application run without Docker. It has a single backend, and its application transactions are serialized for this development mode. Its database transport is loopback-only and does not establish native PostgreSQL authentication, concurrency, crash, replication or recovery correctness.

## Run the checks

```bash
make test
npx playwright install chromium
make test-browser
make lint
make audit
```

`make test` builds the client and starts a real API with a fresh, isolated synthetic database. It runs unit, HTTP integration and the original baseline smoke tests. It preserves your development data. `make test-browser` additionally executes the browser journeys. Missing infrastructure fails the tests; it is not reported as a pass or silently skipped.

The browser runner accepts `BROWSER_EXECUTABLE_PATH` for a separately provisioned Chromium binary. This workspace used Chromium **153.0.8010.0** because the standard browser download endpoint was unavailable. No browser binary is included in the archive.

See `verification/VERIFICATION.md` for the exact executed checks and limits. Native PostgreSQL 18.6 tests and the hosted CI workflow are supplied but were **not run here**.

## Native PostgreSQL development and CI

Use the digest-pinned database in `environment/compose.yaml` with a generated local password. Set `MIGRATION_DATABASE_URL` to that disposable loopback database's administrative DSN, then:

```bash
.venv/bin/python scripts/provision_native.py
export SANDBOX_CONFIG=.local/native-config.json
.venv/bin/python scripts/run_checks.py --browser --native
```

`provision_native.py` checks for PostgreSQL 18.6 and creates separate restricted API, policy and worker logins. It refuses a non-loopback host. Keep administrative credentials out of application processes. The CI workflow in `.github/workflows/ci.yml` provisions an ephemeral native database and runs these gates, including concurrent request tests; there is no deployment step.

Configuration comes from the JSON file named by `SANDBOX_CONFIG`. Any field can be overridden with an environment variable named `SANDBOX_<FIELD>` (for example `SANDBOX_ALLOW_DEV_AUTH=false`, which accepts only `true` or `false`); `environment/.env.example` lists every accepted name. Unprefixed names from older templates such as `APP_ENV`, `DATABASE_URL` or `ALLOW_DEV_AUTH` are not read and make startup fail rather than being silently ignored. Hosting platforms that inject generic variables such as `DATABASE_URL` or `REGION` therefore refuse to start until those are removed or renamed; this is deliberate, so that a misnamed setting is never mistaken for an applied one.

For interactive native development, first run `scripts/bootstrap_local.py` with the same configuration and administrative migration DSN, build with `npm run build`, then start:

```bash
.venv/bin/python -m uvicorn services.api.app.main:create_app --factory --host 127.0.0.1 --port 8000 --no-access-log
```

The local sign-in code is the one printed by `npm run dev` or stored in your private `.local/config.json`. The browser holds tokens in memory; refreshing or switching institutions requires signing in again. Production browser OIDC/PKCE integration remains pending. The API verifier supports only a configured issuer, audience, RS256 keys and provisioned subject bindings; it never trusts JWT-supplied key URLs.

## Repository map

| Location | Purpose |
| --- | --- |
| `services/api/app` | Authentication, authorization, closed-contract validation, programme and safety API |
| `services/worker/main.py` | Scoped assurance-index consumer with inbox deduplication |
| `apps/web/src` | React interface and typed API client |
| `contracts/runtime-openapi.json` | Implemented API subset and additive response contracts |
| `contracts/openapi.json` | Original complete specification, including disabled later capabilities |
| `database/migrations` | Original 001/002 plus additive 003/004 |
| `fixtures` | Original deterministic fixtures; application extension lives in `bootstrap_local.py` |
| `tests/unit`, `tests/integration`, `tests/smoke`, `tests/browser` | Executed application checks |
| `tests/native` | Native PostgreSQL race checks, required before acceptance |
| `tests/reference` | Archived pre-application test assets; not counted as application evidence |
| `backlog`, `specs` | Preserved requirements and implementation baseline |
| `docs` | Contract decisions, scope mapping and next implementation tasks |

## Worker example

With the application database running and the same configuration loaded, run the worker under the explicit synthetic A assignment:

```bash
.venv/bin/python -m services.worker.main \
  --tenant e08c4c63-745d-515f-a994-e317f5d946aa \
  --principal d8f54081-9c11-5c55-8d31-d8d48e40320b
```

This processes a bounded batch into the assurance index. It does not send messages or perform external clinical effects. An event with an invalid schema is dead-lettered. An event whose predecessor has not reached the inbox (a sequence gap, for example behind a dead-lettered event) is parked with the contract retry schedule of 1, 5, 30, 120 and 600 seconds and then dead-lettered, so it neither blocks the batch nor is retried forever; parked and dead-lettered deliveries are logged with identifiers only. A production assignment scheduler, alerting, dead-letter replay and independently verified workload identity are pending.

## Next delivery slice

Implement institution application and independent verification, production OIDC/PKCE session provisioning, and membership delegation. Then enable study drafts and independent snapshot review. Data grants, resumable uploads, model execution, clinical evaluation, exports and production operations remain disabled and retain their source backlog requirements.

The complete source catalogue contains 456 requirements. The application does not claim all requirements are complete; `docs/IMPLEMENTATION_STATUS.md` records partial coverage and outstanding gates.
