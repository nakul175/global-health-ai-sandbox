# Development Environment and CI — reconciled reading edition

Documentation edition **1.1**, 2026-10-03. Reconciled to repository source **8b4b4b5a4b22** plus the unmerged independent cough provider candidate. Hosted alpha package 0.6.0; this candidate is not deployed.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [05_Development_Environment_and_CI.md](../../native-baseline/specs/05_Development_Environment_and_CI.md).

# Development Environment and CI

This specification makes repository setup reproducible and separates foundation checks from application release checks. The environment directory contains exact dependency inputs, resolved hash locks, a Node lockfile, a digest-pinned PostgreSQL service, example configuration, Make targets and a provider-neutral CI specification. The package supplies contracts and verification assets; application source is the work to be implemented.

## Pinned baseline
| Component | Pinned version | Use |
| Python | 3.12.14 | API, policy and worker runtime |
| Node and npm | 24.19.0 and 11.9.0 | Web build and JavaScript test harness |
| PostgreSQL | 18.6 with recorded OCI digest | Native development, CI and deployment database target |
| FastAPI and Uvicorn | 0.141.1 and 0.53.0 | Typed regional API and server |
| Pydantic and settings | 2.13.5 and 2.15.0 | Closed input and configuration validation |
| Psycopg | 3.3.6 | Database driver with bound parameters |
| React and React DOM | 19.3.0 | Proposed web client baseline |
| Vite and TypeScript | 8.3.1 and 7.0.2 | Web build and type checking |
| Playwright | 1.63.0 | Browser acceptance tests once UI exists |
| Pytest and Ruff | 9.1.1 and 0.16.9 | Test and static-check baseline |
| PGlite | 0.5.8 with embedded PostgreSQL 18.3 | Development SQL checks only |
All transitive Python dependencies are pinned with hashes in requirements.lock and requirements-dev.lock. package-lock.json records Node transitive resolution and integrity. Install Python with --require-hashes and Node with npm ci. Do not use floating latest tags. A lock update is a reviewed change with vulnerability and compatibility checks, not an automatic deployment.

## Repository and module boundaries
Use services/api, services/policy and services/worker for trusted application processes; apps/web for the client; contracts, database, fixtures, tests, infra, docs and runbooks as shared controlled assets. Group API modules by identity, programmes, review, data, uploads and safety first. Later modules follow source ownership boundaries. Untrusted model execution runs outside these trusted processes with a separately controlled runtime and network boundary.
The foundation queue is PostgreSQL jobs plus transactional outbox and inbox. Claim eligible work with bounded row locks and lease expiry; use SKIP LOCKED in native worker implementation. An external broker is not required for the first slice. Introduce one only through an ADR with ordering, replay and operational consequences demonstrated. The database remains the source of durable intent.
Development storage uses a confined local directory with the same quarantine and immutable-key interface as regional object storage. Production uses the chosen regional object store with encryption, versioning, restricted service identities, audit and approved retention settings. Test object-adapter conformance before enabling S03. Never give a model runner, browser or support session database or bucket-admin credentials.

## Local setup
From the package root, create a Python 3.12.14 virtual environment. Run make -f environment/Makefile install. Copy .env.example to an ignored .env.local and replace placeholder secrets with random local values. Use a secret manager in shared environments. Do not commit generated secrets, fixture tokens, media caches or database volumes.
Start the database with docker compose --env-file .env.local -f environment/compose.yaml up -d database. It binds only to loopback. Bootstrap roles using the local administrative credential, then apply database/migrate.py with MIGRATION_DATABASE_URL. Provision separate API, policy and worker LOGIN identities with exactly their named group role. Run synthetic seed only against a disposable local or CI database after setting the explicit seed guard.
Run make -f environment/Makefile foundation-check. The embedded database check creates an isolated temporary database. To exercise native PostgreSQL, set DATABASE_TEST_URL to a fresh disposable administrative DSN and run the same database test harness. The test harness is destructive only within its freshly provisioned schema; do not point it at an existing shared or production database.
The later application commands are python -m uvicorn services.api.app.main:app --host 127.0.0.1 --port 8000, the registered worker entry point, and the apps/web build and dev scripts. These entry points must be added by ENG01; they are not falsely supplied as a running application in this document pack. CI must fail if a required application build or test target is absent.

## Authentication and configuration
Shared development and CI use an isolated OIDC test realm with deterministic synthetic subjects mapped to fixture principals. Configure issuer, audience, client ID, redirect URI, allowed algorithms and JWKS URI. The browser uses authorization code with PKCE. For API tests, obtain real short-lived test-realm tokens and set TEST_TOKEN_A_PM and TEST_TOKEN_B_PM; fixture UUIDs alone are not authentication credentials.
A loopback-only development token issuer may be implemented behind ALLOW_DEV_AUTH and APP_ENV=development. Non-development startup must reject that combination. Never use a static token bypass in staging or production. Store private signing material outside source; publish only JWKS public keys. Test issuer mismatch, audience mismatch, expired token, key rotation, clock skew, revoked context and missing MFA.
Validate configuration at startup. Reject placeholder secrets, a region mismatch, an owner database credential, an unapproved storage driver or an untrusted OIDC issuer. Use distinct cursor and session signing keys. Key rotation supports overlap only for its declared lifetime. Log configuration identifiers and versions, not secret values or complete connection strings.

## CI gates
| Gate | Required evidence | Failure behaviour |
| Contracts and traceability | Valid OpenAPI and JSON Schema, unknown-key negatives, source requirement coverage, examples | Block merge on incompatible or unreviewed weakening |
| SQL foundation | Fresh migration, seed, RLS, typed foreign keys, privileges and immutable records | Block merge on any expected denial becoming allowed |
| Native database | PostgreSQL 18.6, replay and altered checksum rejection, separate-connection races, crash behaviour | Required before persistent feature acceptance |
| Code and supply chain | Types, lint, meaningful unit tests, secret scan, dependency audit and SBOM | Block exploitable critical or high issues absent recorded exception |
| Application integration | Real API, policy, worker, identity, storage and synthetic data; source and APP cases | Missing environment or skipped critical tests cannot count as success |
| Browser and quality | Keyboard, screen reader, responsive and constrained-network flows; source performance and security cases | Block relevant feature or release until criteria pass |
| Release | Immutable build digest, signed provenance, staging migration, canary smoke, rollback and recovery | Stop promotion on failure; preserve evidence |
Untrusted pull requests receive no shared or production secrets. Build and release identities are separate. Deploy the exact tested image digest once, with environment configuration and secret references supplied independently. Required test reports include commit, runtime, database version, contract and fixture versions, counts, failures, skips and execution time.

## Nonfunctional environment profile
The source L1 profile includes 25 institutions, 50 sites, 1,000 named and 200 concurrent users, 100 studies, 500 solutions, 20 CPU and 5 GPU runs, two million metadata records and ten TB of data. Use representative skew, tenant sizes and denied traffic, not only evenly distributed happy paths. The standard network profile is ten Mbps and 100 ms; the constrained profile is one Mbps, 300 ms and one percent loss.
Measure source page and API percentile targets under those loads, including authentication and policy work. Report a three-second standard page p95, one-second API p95 and three-second API p99 against their actual source definitions; constrained journeys have an eight-second target. Validate large import and export completion separately from transfer duration. Capacity planning and production provider choice remain engineering decisions to measure, not promises inferred from unit tests.
