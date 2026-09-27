# Test strategy, scenarios and acceptance catalogue

Status: planned application testing. [tests.json](tests.json) contains case IDs, requirement, type, setup, steps, expected results and execution status. [fixtures/acceptance.json](fixtures/acceptance.json) contains reproducible synthetic inputs and known economic/metric outputs. No R3 application test is marked passed by creating this pack.

## Test layers

| Layer | Scope | Required evidence |
|---|---|---|
| Unit | Validators, state machines, policy predicates, metrics, money rounding, hashes, event parsing | Test command, source commit, case IDs, actual/expected outputs |
| Database integration | All migrations, composite org/type FKs, uniqueness, immutability, receipts and rollback | Disposable database schema version and invariant assertions |
| Application integration | Real HTTP API plus database/storage/queue, role projections and external receiver | Running application version, provisioned fixture, request/response assertions |
| Contract | Every closed request/response/event schema and consumer example | Schema version, positive/negative payload corpus |
| Browser acceptance | Actual independent users, programme to issued pack, conflicts and errors | Browser/platform, screenshots where relevant, observed result |
| Smoke | Identity, context create/read, one bounded evaluation, budget result, independent review, export digest | Actual environment, deploy commit and result; use synthetic disposable programme |
| Nonfunctional | Isolation, abuse, load, accessibility, backup recovery, retention and egress | Measured environment-specific report and unresolved findings |

## End-to-end scenarios

**SC-GOV-01 — Decision workflow:** real test users at Institution A create a synthetic TB programme, register A/B/C submissions, freeze a protocol, run/compare, model costs and issue a reviewed pack. The report identifies synthetic evidence and expected funding gaps; a supplier sees only released own results.

**SC-GOV-02 — Institutional separation:** Institution B guesses all A IDs through read, write, search, pagination, export, job and artifact routes. All return a safe denial without counts, titles or side effects. Repeat with revoked membership and an expired service credential.

**SC-GOV-03 — Immutable evidence:** change a model, context, price or threshold after freeze; the original comparison retains its source hashes and a new run is required. Attempt direct mutation of issued evidence and verify rejection; correction creates a new linked version.

**SC-GOV-04 — Interrupted operations:** duplicate a create/run command, race two updates, expire a worker lease, time out a provider response and cancel during transfer. Confirm no duplicate accepted result, no silent overwrite and a visible unknown outcome when provider execution cannot be established.

**SC-GOV-05 — Integration and pilot:** execute a real selected sandbox transaction, duplicate callback/observation, expired consent, outage and recovery. Check feed freshness, late-window revision, authorised pause and independent resume. A mock run cannot satisfy this scenario's real adapter gate.

**SC-GOV-06 — Sharing and exit:** approve a redacted record for Agency B, verify recipient access and transferability conditions, revoke future access, export institution data, restore to an isolated compatible environment and verify evidence hashes. Document that already downloaded copies cannot be recalled.

## Fixture catalogue

- Two synthetic institutions, separate principals and vendors; one suspended and one expired membership.
- An author, independent evaluator, finance officer, supplier, safety officer, auditor, service identity and support user with a 4-hour diagnostic grant.
- One synthetic TB programme, two contrasting district profiles and three suppliers with deliberately different performance/coverage/price profiles.
- Draft/frozen protocols, queued/completed/failed/unknown runs, a self-approval attempt and issued/superseded packs.
- A three-year funding scenario with a year-two gap and no year-three commitment.
- Duplicate/late/stale pilot observations, an active safety hold, malformed JSON and cross-org parent references.

Seed data is reproducible and marked synthetic. SQL seed provisions storage-level examples; application fixtures must be provisioned through the implemented API or a controlled test-only loader. A SQL insert alone is not proof a user journey works.

## Load and accessibility targets

At the initial HLD envelope, target p95 interactive reads under 1 second, p95 writes under 2 seconds excluding background work, and no cross-tenant leakage or duplicate effects under 100 concurrent sessions. Run sustained 30-minute traffic plus a documented burst. Establish worker throughput using the selected adapter; do not assume the existing synchronous alpha supports 10,000 rows.

Target WCAG 2.2 AA using automated checks plus keyboard, screen reader, zoom/reflow and validation tasks. Automated success alone does not establish conformance. Test local-language formatting and low bandwidth when those configurations are enabled.

## Smoke procedure after deployment

Provision a disposable synthetic programme in a designated test organisation, authenticate two distinct users, create/freeze/run with the tiny built-in fixture, verify expected budget figures, review as the second person, issue/download and recompute the artifact digest. Verify a cross-org denial. Clean up only disposable fixtures under approved retention rules. Never use a clinical programme for smoke testing.

## Release gates and reporting

All critical access, evidence-integrity and money-calculation tests must pass. No unresolved critical/high security defect in the claimed deployment scope. Each blocked case must name the dependency and affected claim. Store results in a new dated verification file; do not overwrite historical reports to imply a different release was tested. Documentation validation and reference calculations are reported separately from running-application acceptance.
