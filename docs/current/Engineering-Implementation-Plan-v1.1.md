# Engineering Implementation Plan — reconciled reading edition

Documentation edition **1.1**, 2026-09-28. Reconciled to repository source **870b49a343f1**: hosted alpha package 0.6.0 plus PR #13; deployment not requalified.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [01_Engineering_Implementation_Plan.md](../../native-baseline/specs/01_Engineering_Implementation_Plan.md).

# Engineering Implementation Plan

The Global Health AI Sandbox can begin repository setup and the first governed workflow using this implementation baseline. Delivery follows dependency gates, with each feature receiving its final contracts, permissions, migration and acceptance evidence before independent implementation. This plan preserves the source release scope and connects it to coding work.

Version 1.1 | 25 September 2026 | Accountable owner role Product and Engineering Lead

## Scope and release baseline
The source contains 456 requirements: 369 functional and 87 nonfunctional. Of these, 322 are R1, 131 are R2 and 3 are R3. The accompanying backlog has one entry for every source requirement and retains its FSD or quality-control identifier, source acceptance text, release, work package and primary test identifiers. There are 84 grouped work packages and 22 engineering tasks. These counts include requirements across all releases, not a commitment to deliver every module in R1.
R1 covers institution onboarding and access, governed retrospective evaluation, data custody, controlled execution, independent evidence, essential institutional services and operational assurance. R2 and R3 include the later prospective, deployment, monitoring, training and generative AI capabilities specified by their individual source requirements. An R1 requirement inside a later-oriented module remains in R1; a module name never overrides its requirement-level release.
The package closes seven resource payloads for the initial workflows, all 40 command inputs, 44 event variants and the upload protocol. It supplies executable foundation migrations. Further domain detail is a named gate in contract_activation.json. It is sufficient to start S00 and the first workflow; it does not declare all later modules ready for parallel implementation.

## Delivery sequence
| Slice | Coding outcome | Entry dependency | Exit evidence |
| S00 | Repository, identity boundaries, migrations, policy context, receipt, audit, outbox, minimal safety intake and holds | Baseline accepted for engineering | Locked installs, contract checks, native DB checks, rollback of partial transactions |
| S01 | Institution application, verification, people, memberships and delegation | S00 | Applicant isolation, no self-elevation, independent verification, revocation within 60 seconds |
| S02 | Programme and study drafts, exact snapshot review and institutional coordination | S01 | Version conflict, scoped ownership, different-person approval; close additional contracting schemas first |
| S03 | Data requests, grants, uploads, quarantine, imports and dataset release | S02 and early safety controls | Interrupted upload recovery, current rights, object integrity, count reconciliation, custody approval |
| S04 | Protocol, configuration, methods, isolated runs and trusted scoring | S03 | Frozen inputs, budget admission, sealed-label isolation, cancellation and failure accounting |
| S05 | Independent evidence, public views, corrections and institutional services | S04 | Exact issued bytes, disclosure approval, scientific and commercial separation |
| S06 | Full R1 operations, support, retention, closure and recovery | S01, S03, S05 | SLO, restore, security, load and source acceptance gates; named production owners |
| S07 | R2 and R3 capability expansion | S06 and capability-specific review | Own finalized schemas, migrations, safety evidence and local authority gates |
Minimal SAF, AUD, OPS and API controls are infrastructure dependencies in S00, even where their full functional acceptance work is completed in S06. No restricted ingestion or execution starts before containment and audit controls work. Feature branches may overlap after dependencies pass; deployment order remains constrained by the migration and contract compatibility rules.

## Work packages and ownership
The files backlog.json and work_packages.json are the full requirement mapping. engineering_tasks.json provides the initial implementation breakdown. Each work package receives one accountable engineering lead, one product decision owner and an independent acceptance reviewer before sprint commitment. These are role assignments to be staffed, not invented personnel or dates.
| Task group | Main coding tasks | Accountable role | Required evidence |
| ENG01 to ENG05 | Repository locks, SQL and RLS, transaction context, atomic receipt and outbox, basic safety overlay | Platform lead | Fresh environment build, no tenant leakage, rollback and safety intake proof |
| ENG06 to ENG08 | OIDC binding, verified people, applicant context, delegation and institution lifecycle | Identity lead | Alias identity, role subset, applicant and revocation tests |
| ENG09 to ENG11 | Typed drafts, review snapshots and assignments, contracting and network schema closure | Workflow lead | Exact snapshot signatures, stale edit rejection, independent people |
| ENG12 to ENG15 | Access scope, external references, chunk gateway, scan and import processing, curation schemas | Data lead | Grant intersection, resumed byte integrity, quarantine and reconciliation |
| ENG16 to ENG17 | Domain contract closure, isolated execution, budget reservation and trusted scoring | AI runtime lead | Runner isolation, data and label separation, truthful completion and cancellation |
| ENG18 to ENG19 | Evidence issuance and corrections, R1 institutional services | Evidence lead | Approval on exact bytes and versions; scoped disclosure |
| ENG20 to ENG21 | Support, exports, retention, recovery, security and first-release validation | Operations and QA leads | Restore restrictions, staged deployment, runbooks and measurable quality gates |
| ENG22 | Later capability implementation | Relevant domain lead | Per-capability contracts and local governance before activation |

## Vertical workflow acceptance
The first useful slice lets an applicant submit its own institution application. After verification, authorized members create programme or study drafts, submit exact snapshots and receive decisions from independently verified people. The next slice adds a purpose-bound access request and a resumable synthetic import. A successful UI action must have a matching authorized API receipt, database state, audit event and durable event record.
Acceptance must include the negative path: an unrelated tenant sees no object; a programme manager cannot self-grant a stronger role; a stale editor cannot overwrite a later version; an author using another account cannot supply an independent signature. An expired or revoked grant must block replay and background effects, not only new UI buttons.
Every source FR maps to its TC and EX cases; every NFR maps to its QT case. The supplied source test catalogue remains the acceptance authority. The new APP01 to APP25 cases add concrete cross-layer checks. A passing reference function is not evidence that the application endpoint implements it.

## Definition of ready and done
A feature is ready when its source IDs, outcome, permissions, record states, closed schemas, migration, UI states, test identities and expected results are linked. The owner resolves business decisions that affect meaning, such as clinical thresholds or authority roles, before that feature starts. Engineering may select routine implementation details through an ADR.
A feature is done when implementation and independent review are complete; happy, denied, invalid, stale, retry and relevant concurrent paths pass; database and API compatibility are demonstrated; sensitive fields are masked; metrics and logs disclose no protected payload; documentation and operational recovery are updated; all mapped acceptance evidence is attached. There must be no unresolved critical release blocker and no unexplained skipped required test.
Code coverage is supporting information. Isolation, authority, financial admission, immutable evidence and recovery require behavioural assertions and failure injection. Unit tests that merely repeat implementation are insufficient.

## Planning and release control
Estimate tasks after engineers inspect the domain and repository. Use measured team throughput to forecast dates; no duration is assumed here. Split work that cannot demonstrate an independently testable outcome within a sprint. Track dependency blocks, open decisions, contract changes and acceptance evidence beside each requirement.
Release evidence includes commit and image digests, lockfile and migration checksums, contract version, fixture version, test reports, dependency audit, accessibility results, performance measurements, restore evidence and approval records. Pin this evidence to the actual candidate build. New source requirements receive a new backlog item and impact review rather than being hidden inside an existing item.
The R1 source targets include 99.9 percent availability for authenticated journeys including maintenance, RTO of four hours, and separate RPOs of five minutes for decisions, grants and audit, fifteen minutes for metadata and final outputs, and twenty-four hours for input data. The detailed quality catalogue governs measurements. These are release targets, not measured outcomes of this document package.

## Decisions that govern launch
The initial launch jurisdictions, participating institutions, regional hosting provider, clinical use case, intended-use limits, local authority requirements, retention schedules and clinical thresholds require accountable product, data, safety and governance decisions. Candidate examples in the earlier designs do not establish a launch decision. Repository and synthetic workflow development can proceed while these decisions are prepared. Clinical or cross-border activation cannot assume them.
The full engineering pack and current LLD are the source baseline recorded by hash in source_traceability.json. This implementation package supersedes their open schema and SQL blueprint portions only for the explicitly covered foundation and first workflows. Later functionality retains its source requirements and must pass its named closure gate.
