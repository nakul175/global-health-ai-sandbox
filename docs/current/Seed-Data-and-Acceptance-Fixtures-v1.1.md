# Seed Data and Acceptance Fixtures — reconciled reading edition

Documentation edition **1.1**, 2026-10-03. Reconciled to repository source **8b4b4b5a4b22** plus the unmerged independent cough provider candidate. Hosted alpha package 0.6.0; this candidate is not deployed.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [06_Seed_Data_and_Acceptance_Fixtures.md](../../native-baseline/specs/06_Seed_Data_and_Acceptance_Fixtures.md).

# Seed Data and Acceptance Fixtures

The fixture set supplies repeatable synthetic identities, permissions, programmes, studies, indicators, observations and review states. It is intended for disposable development and CI databases and for provisioned acceptance environments. It contains no patient data, production account credentials or clinical performance claim.

## Fixture identity and lifecycle
Use fixtures/manifest.json as the identifier authority. IDs are UUIDv5 under a fixed namespace and remain reproducible. seed.sql inserts three tenants: verified A, verified B and an isolated applicant C. Each verified tenant has synthetic role principals, verified people, memberships, contexts, programme and study records, source versions, review assignments and decisions, data grants, an import, an upload and a budget.
Two accounts may reference the same verified person; the author alias tests independence. Named test subjects in the OIDC realm must be bound to these IDs by the trusted identity provisioner. The manifest is not an authentication token. The included hashed snapshots cover synthetic metadata and database signature constraints. A live review test must create its full domain snapshot through the application before signing. Synthetic country ZZ and region test-region-1 are nonproduction fixture values, not launch geography decisions.
Run the seed in a transaction against a fresh migrated database with app.seed_allowed set to synthetic-only. The seed intentionally fails on duplicate identifiers. Reset by recreating the disposable database, not by upserting over an acceptance run. Never use seed execution as a repair or production migration.
The fixture clock is the seed transaction time. Memberships and grants last twenty-four hours; approval MFA is current only for five minutes. Re-seed or use a controlled test-clock boundary for a later isolated run. Do not disable expiry checks to keep an old environment green. Tests of expiry advance the application test clock or create deliberately expired rows through a privileged fixture loader.

## Known data and expected results
| Fixture | Known state | Expected assertion |
| Tenant A and tenant B | Separate resources and scoped principals | A cannot read or write B; B reads of A API IDs return safe 404 |
| Applicant C | No institution membership privilege | Own bounded application only; cannot assume A or B context |
| Programme and study | Synthetic research programme; approved study and separate draft | Typed references valid; programme cannot be used as a study |
| Reviews | Scientific and custody approvals by people distinct from author | Exact version and assignment required; author alias cannot sign independently |
| Review queue examples | In review, returned and rejected resources | Distinct UI state and permitted next action; resource state alone is not a new signature |
| Access grants | Active and revoked grants with field and recipient rows | Revoked grant unusable; active grant still subject to artifact state and all other gates |
| Artifact | Quarantined synthetic source content | No preview, search, AI, export or use until separately released |
| Ratio observation | Numerator 80 and denominator 100 | Value exactly 0.8 within numeric tolerance |
| Zero observation | Numerator 0 and denominator 100 | Value 0, displayed as measured zero |
| Missing observation | Null value and source-absent reason | Display missing; never aggregate as zero |
| Budget | Ceiling 100, actual 20, initially unreserved | Reserve 60 succeeds; a further 21 fails; actual overrun is still retained |
| Upload | 8,388,613 bytes | Part 0 is 8,388,608 bytes; part 1 is 5 bytes |
The observations exercise the shared typed metric model. They do not activate the R2 monitoring product or assert that a clinical sensitivity of 0.8 is acceptable. The active grant and quarantined artifact intentionally test that an allow does not override quarantine. A later positive dataset-consumption scenario must add a released artifact through its accepted custody workflow.

## Synthetic media generation
Run fixtures/generate_media.py to create exactly eight MiB of ASCII G followed by HELLO and a manifest containing object and per-part SHA256 digests. Regeneration produces the same bytes. The seed upload's full digest matches this generator. Do not treat a filename or client digest as proof that received bytes match.
Test recovery by sending part 1 first, withholding the acknowledgement response, reading session state and retrying the same part. Change one byte for a negative digest test. Test last-part length, zero-length input rejection, maximum allowed size, one byte above maximum, duplicate index, out-of-order parts, finalisation with a hole, finalise-versus-abort and expired sessions. Large boundary cases may use declared lengths and streamed generators rather than storing ten GiB in source.

## Acceptance fixture packages
The source test catalogue is included unchanged for traceability. New tests/application_cases.json defines APP01 to APP25 with known outcomes covering workflow, authorization, idempotency, review independence, upload recovery, budget races, transaction rollback, event replay, offline expiry, support, AI and restored restrictions.
The executable HTTP smoke subset in tests/test_application.py requires BASE_URL, two provisioned test tokens and explicit ALLOW_SYNTHETIC_HTTP_TESTS=true. It checks liveness and readiness, anonymous denial, a programme create/read/edit cycle, duplicate and conflicting request keys, cross-tenant denial and stale ETags. Missing configuration fails the run; it does not turn a missing application into a passed or skipped test.
The broader APP scenarios need service-specific fault controls, identities and accepted feature implementations. Each owning work package must implement these tests as part of its slice. Store synthetic run identifiers in reports and remove only that run's disposable environment afterward. Tests must not mutate shared production records or send real partner notifications.

## Current verification
The delivered contract suite has 57 passing tests, and the database suite has 30 passing checks on embedded PostgreSQL 18.3. The earlier pack's 117 passing reference checks remain reference-only evidence. No live application integration or smoke suite has run for this package. verification/application_status.json records that status explicitly.
A release fixture report must identify the seed manifest hash, build digest, configuration and policy version, identity-provider setup, clock, database engine, storage adapter and cleanup result. Expected values should be asserted from this fixture specification rather than recalculated by the same application function under test.
