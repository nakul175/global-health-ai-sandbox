# Database Migrations and Data Model — reconciled reading edition

Documentation edition **1.1**, 2026-10-03. Reconciled to repository source **8b4b4b5a4b22** plus the unmerged independent cough provider candidate. Hosted alpha package 0.6.0; this candidate is not deployed.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [03_Database_Migrations_and_Data_Model.md](../../native-baseline/specs/03_Database_Migrations_and_Data_Model.md).

# Database Migrations and Data Model

The SQL files provide an executable foundation for identity, scoped resources, programmes, studies, review, governed imports and resumable uploads. They replace the earlier blueprint for this boundary. They also provide typed institution applications, membership invitations, access requests and their scope rows, plus audit, idempotency, outbox, budget and synthetic metric primitives needed to test the first workflows. Later domain-specific persistence is a delivery gate rather than an arbitrary JSON extension.

## Files and execution order
| File | Purpose | Execution identity |
| database/bootstrap.sql | Create non-login owner and runtime group roles; lock public schema; create sandbox schema | Dedicated database administrator |
| migrations/001_foundation.sql | Tables, typed keys, checks, indexes and invariant functions | Migrator temporarily assuming sandbox_owner |
| migrations/002_isolation_and_privileges.sql | Forced tenant RLS, immutable-record triggers and explicit privileges | Migrator temporarily assuming sandbox_owner |
| database/migrate.py | Advisory lock, checksum ledger and transactional migration runner | Isolated migration credential |
| fixtures/seed.sql | Synthetic tenants and known workflow states | Administrator in a disposable test database |
| database/verify.sql | Role, RLS and privilege inspection | Read-only assurance or database administrator |
Bootstrap is an administrative operation, not an application startup task. Re-running it does not repair an incorrectly privileged existing role: inspect and reject any owner, superuser or BYPASSRLS runtime identity. Database ownership and login provisioning belong to the infrastructure boundary. No password is embedded in the package.

## Relational design
Tenant-owned tables use a tenant_id and object identifier composite primary key. Every local reference includes the tenant. resources also exposes a unique tenant, ID and kind tuple. Typed tables use a generated constant kind and a composite foreign key to prevent, for example, inserting an artifact as a study. Reference arrays are normalized into rows for memberships, grant subjects, grant fields, programme countries and review assignments.
| Entity group | Tables and invariant |
| Identity | tenants, people, principals, memberships, membership_scopes, auth_contexts; a human principal has a verified person, a service has none |
| Resource identity | resource_kinds, resources, resource_versions; positive version and immutable version digest |
| Workflow | programmes, programme_countries, studies, review_snapshots, review_assignments, review_decisions; exact version and person independence |
| Data governance | external_references, artifacts, dataset_releases, access_grants, grant_fields, grant_subjects, imports; bounded scope and reconciliation |
| Transfer | uploads and upload_parts; unique session/index, exact chunk bounds, terminal state lock |
| Evaluation foundation | metrics, observations, budgets; missing distinct from zero; observed overrun remains recordable |
| Operational integrity | holds, jobs, audit_events, command_receipts, outbox, outbox_delivery, inbox, support_access, restriction_ledger |
A foreign institution's study is represented by a custodian-owned external_reference with remote tenant, object kind, object ID, version, region, digest, verifier and expiry. Remote identifiers are intentionally not local foreign keys. A local access grant references either a local study or a verified external study reference, exactly one. The external reference must have kind study. Verification is not automatic authorization.
No patient payload is stored in generic JSON. Canonical object versions store schema identity, digest and a protected immutable snapshot key; typed tables or immutable regional artifacts carry their supported content. A future module must add its explicit typed fields, references and constraints before enabling its commands. An arbitrary payload column is not an extension mechanism.

## State and integrity controls
Immutable triggers cover people verification records, resource versions, review snapshots, assignments, decisions, dataset releases, stored parts, metric versions, observations, audit, receipts, events, inbox records and the restriction ledger. Corrections append successors. Runtime roles cannot TRUNCATE, delete arbitrary data, disable triggers, create functions or change ownership.
The signer trigger checks the exact assignment, enabled human principal, matching verified person, current membership, registered role slot and MFA no older than five minutes. An author is ineligible even through another login. Duplicate person signatures on a snapshot and duplicate role-slot decisions are constrained. Conflict-of-interest declarations and full business gates remain mandatory policy-service checks.
The part trigger locks the session, requires open and unexpired state, computes the expected chunk length and rejects indexes beyond the total. API logic must hash received bytes and implement idempotent acknowledgement; a unique database index alone is not an upload protocol. Finalisation uses the same session lock and creates its durable job in one transaction.
Import finalisation requires accepted plus rejected plus quarantined to equal source count. Observation checks require a real missing reason for non-observed values. Metric-specific interpretation still requires semantic validation. A budget reservation is an atomic conditional UPDATE. Actual usage may exceed the ceiling and must be retained; no constraint suppresses an observed overrun. Multi-connection admission races are a native CI requirement.

## Tenant isolation and privileges
RLS is enabled and forced on every tenant-owned table and on tenants. Missing tenant or principal context yields no rows. Runtime connections use non-owner, NOSUPERUSER and NOBYPASSRLS identities. The request middleware sets tenant and principal with SET LOCAL inside the transaction after validating a server-issued context. Rollback and connection reuse must clear that context.
RLS is a tenant boundary, not the complete action, record, field, purpose or clinical authority engine. The application policy boundary enforces those dimensions before any query or effect. Database access is unavailable to browsers, model containers, offline devices and arbitrary tenant code. A compromised trusted application credential can manipulate session context; prevention and detection of SQL injection and credential compromise therefore remain explicit threat controls.
| Runtime role | Permitted work | Explicit limits |
| sandbox_api | Scoped business reads and allowlisted draft, review, upload, job, audit and receipt writes | No identity elevation, ownership changes, DDL, arbitrary deletion or immutable updates |
| sandbox_policy | Verified identity, membership, assignments, grant and restriction changes through policy workflows | No owner or BYPASSRLS; no generic API reuse of this credential |
| sandbox_worker | Declared jobs, artifact state and delivery progress; immutable result/event append | No authority to grant permissions or sign as a human |
| sandbox_auditor | Assurance reads within the selected tenant | No business or privilege mutation; application redaction still applies |
A worker receives a bounded task context and rechecks authority before the effect. There is no unconstrained cross-tenant queue scan under an owner account. Scheduler enumeration uses a dedicated routing control plane with no patient payload and dispatches one tenant context at a time.

## Migration and rollback procedure
Take and verify the required backup before a material production migration. Check free space, lock impact, replica lag and the existing schema checksum ledger. The runner obtains a session advisory lock, checks applied file hashes and applies each new file in a transaction with a five-second lock timeout and a two-minute statement timeout. A modified applied file is rejected. Do not edit history to make a checksum pass.
Use expand, compatible deploy, bounded backfill, verify and later contract migrations. Large indexes use a separately reviewed concurrent-index migration with an explicit nontransactional procedure; they must not be placed blindly in the transactional runner. An application rollback may run only against a schema it understands. Failed transactional changes roll back. Destructive down migrations are not a production recovery method; use a forward fix or an approved restore with restriction-ledger replay.
Synthetic seed execution requires app.seed_allowed set to synthetic-only. Seed a fresh disposable database; repeated insertion intentionally encounters uniqueness constraints rather than modifying an existing environment. Destroy and recreate only that test database for reset. Production credentials must never be supplied to a seed job.

## Verification and limits
Thirty executable database checks passed on PostgreSQL 18.3 through PGlite 0.5.8. They cover migration execution, seed constraints, tenant read and write isolation, typed and cross-tenant references, privilege denial, immutable decisions, missing and zero observations, upload bounds, budget admission, context restoration and author-signature rejection.
The deployment target is PostgreSQL 18.6. The same test harness supports a native PostgreSQL connection through DATABASE_TEST_URL. Native migration replay and checksum rejection, multiple simultaneous connections, process crashes, replication, backups, extensions and recovery have not been executed in this package. They are required CI and prelaunch gates. PGlite is a development test dependency, not the production database.
PostgreSQL RLS reference https://www.postgresql.org/docs/18/ddl-rowsecurity.html
Deployment release reference https://www.postgresql.org/docs/18/release-18-6.html
