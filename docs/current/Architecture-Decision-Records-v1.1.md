# Architecture Decision Records — reconciled reading edition

Documentation edition **1.1**, 2026-09-28. Reconciled to repository source **870b49a343f1**: hosted alpha package 0.6.0 plus PR #13; deployment not requalified.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [09_Architecture_Decision_Records.md](../../native-baseline/specs/09_Architecture_Decision_Records.md).

# Architecture Decision Records

These decisions establish the implementation baseline for repository setup and the first workflows. They are recorded as engineering selections, not claims of production deployment or stakeholder sign-off. A decision changes only through a successor ADR that states the problem, alternatives, consequences and evidence. The launch-specific decisions listed at the end remain prerequisites for activation.

## ADR 001 Regional modular application
Decision: use a regional modular application with explicit domain ownership and separate API, policy and worker process identities. Keep global services to routing and approved public metadata. Patient and restricted study content stays in its approved regional boundary.
Reason and alternatives: this makes the first workflow coherent without the deployment and transaction burden of one microservice per module. A single global data lake would complicate regional restrictions. Consequence: module interfaces and ownership must be enforced in code review; a later split requires measured scaling or isolation needs and contract compatibility.

## ADR 002 Relational foundation and forced tenant isolation
Decision: use PostgreSQL 18.6, composite tenant keys, typed resource references, forced RLS and separate non-owner runtime roles. Apply record, field, purpose and authority policy in the trusted application boundary.
Reason and alternatives: related approvals, grants, budgets and events need transactional integrity. RLS is useful defence for tenant access, but does not replace the policy engine or protect against a fully compromised trusted credential. Consequence: native SQL, privilege, pool-context and concurrency tests are required; a generic document store or arbitrary JSON payload is not the first-slice persistence model.

## ADR 003 Closed and versioned contracts
Decision: use OpenAPI 3.1.1 and JSON Schema with closed objects, registered payload kinds, explicit semantic rules and capability discovery. Finalize each domain before independently implementing its frontend and backend.
Reason and alternatives: open objects postpone ambiguity to runtime. Free-form extension bags make permissions and migrations difficult to review. Consequence: strict consumers require coordinated contract evolution. The package closes the first payloads and command inputs; later detailed objects remain disabled until their closure gate passes.

## ADR 004 Durable intent and at least once delivery
Decision: commit state, idempotency receipt, audit and outbox atomically. Use PostgreSQL jobs initially, and inbox deduplication at consumers. Track aggregate sequence and reconcile gaps.
Reason and alternatives: a distributed transaction across database and broker is unnecessary for the first slice. Exactly-once transport is not assumed. Consequence: consumers must be idempotent, external acknowledgements are explicit and replay requires authority. Add a broker only when measured throughput or operational needs justify it.

## ADR 005 Immutable evidence and independent people
Decision: snapshots, decisions, versions and evidence are immutable. Correct through successors. Approval independence is based on verified people, not logins.
Reason and alternatives: overwriting an issued finding or counting aliases as independent reviewers would weaken provenance. Consequence: retention and legal correction workflows may restrict access while preserving required evidence. Reviews need current role, assignment, assurance and conflict checks as well as a digest.

## ADR 006 Gateway controlled resumable upload
Decision: use fixed eight-MiB chunks, full and per-part SHA256, a seventy-two-hour session and a current-rights-checking upload gateway. Finalise into quarantine before scanning and release.
Reason and alternatives: bounded whole-object uploads do not support unreliable connections adequately. Long-lived direct upload/download bearer links make mid-session revocation harder. Consequence: gateway bandwidth and verification require capacity planning; object-store multipart operations may be an internal implementation detail but must preserve this external protocol.

## ADR 007 Restricted AI authority and isolated execution
Decision: separate untrusted model runners from trusted services and from the scorer holding sealed labels. Assistant retrieval intersects user and workload scope, and assistant output is a proposal only.
Reason and alternatives: model-generated text and retrieved documents are untrusted inputs. Sharing control-plane credentials or human approval powers with a model creates an avoidable authority path. Consequence: network egress, tool capability, output review, resource limits and runner isolation need independent S04 acceptance before activation.

## ADR 008 Measured release evidence
Decision: distinguish reference, contract, database, deployed integration, browser, load, security and recovery evidence. Release gates refer to the candidate build and exact environment.
Reason and alternatives: pure policy checks cannot prove an HTTP or worker implementation uses those policies. Consequence: the current passing checks support foundation confidence only. Application and native operational validation remain required and visible, rather than being inferred from schema or unit success.

## Decision ownership and pending activation choices
The engineering lead owns technical decisions with security and data owners reviewing affected controls. Product, clinical safety, custody and local governance owners decide intended use, launch jurisdictions, clinical thresholds, retention and external authority requirements. Operations decides the hosting and regional storage provider with those owners.
No ADR here selects a final clinical claim, regulator, cross-border transfer basis or production deployment provider. Record those decisions before the relevant feature becomes active. Routine repository setup and synthetic workflow development do not need to wait for unrelated later-capability decisions.
