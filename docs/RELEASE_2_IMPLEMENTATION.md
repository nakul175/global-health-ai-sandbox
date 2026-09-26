# Release 2 implementation status

Historical v0.3 baseline. Current scope is in [RELEASE_2_WORKBENCH.md](RELEASE_2_WORKBENCH.md); several limitations below now have bounded working implementations or explicit simulations.

Version 0.3.0, 25 September 2026. Status: bounded synthetic technical alpha.

## Delivered experience

The lab creates connected fictional patients, facilities, practitioners, encounters and observations from a validated recipe. Each participant has a reproducible WAV test signal. The application reads its samples, computes RMS and zero-crossing features, applies fixed logistic inference, and scores predictions against generated reference labels. It can alternatively accept externally computed probabilities or run an explicitly labelled workflow stub.

A deterministic virtual clock drives screening, referral, laboratory result and callback events. Users can inject outages, duplicate callbacks, slow results or lost callbacks; pause, resume or cancel; inspect assertions; replay frozen inputs; compare model versions; and issue evidence through separate synthetic roles. Registries expose generated referral and result records as events commit.

## Relationship to the specification

This table records capability, not closure of original acceptance criteria. The regional architecture and `/v2` contract remain targets. Original requirements are retained unchanged in `source-backlog/r2/` with their proposed status.

| Source requirements | Implemented capability | Remaining scope |
|---|---|---|
| V2-SYN-001–008 | Strict recipes, exact quotas, deterministic linked records, synthetic namespace, lineage, atomic publication, waveform bytes | Rich distributions, additional templates, protected/mixed lineage, clinical audio |
| V2-SYN-010; V2-SCN-005 | Fork, snapshots, increasing generation, cancellation on reset and stale-generation rejection | Worker barriers, retention, restore |
| V2-REG-001–004 | Seven resource types, scoped search/pagination, linked referrals/results | Registry writes, identity merge, capacity, full lifecycle |
| V2-REG-006 | FHIR R4-shaped synthetic records | FHIR server conformance, validated profiles, terminology and standard search |
| V2-SCN-001–004,006–008 | Frozen plans, stable order, virtual/audit clocks, faults, assertions, replay, separate run overlays | Distributed queue delivery, scenario DSL, external callbacks |
| V2-MOD-001–003,005 | Hashed bounded configurations, actual audio inference, labelled imports and stubs | Arbitrary model artifacts, isolated admission, GPU/remote inference |
| V2-DAT-004 | Labels excluded from inference arguments, workspace projection and input manifest | Separate scorer identity and protected label store |
| V2-VAL-001–004,006 | Frozen inputs, complete joins, null undefined metrics, Wilson intervals, small-group suppression | Clinical protocols, broader uncertainty and disclosure methods |
| V2-VAL-005,008 | Same-snapshot/generation comparison; differing scenario warning | Paired inference, approved comparison plans and hardware benchmarks |
| V2-RUN-001,003–005,007 | Atomic synchronous admission, bounded workload, cancellation, policy rechecks, exact joins | Fenced workers, fair scheduling, time budgets, asynchronous termination and attempts |
| V2-UX-001–004 | Four stages, truthful provenance, labelled responsive controls, preserved input | Authenticated browser acceptance, formal accessibility, offline recovery |
| V2-SEC-001,003,006 | Owner/institution scope, support restriction and synthetic containment | Regional policy, time-bound support, real institutional identity |
| V2-API-001–003 | Closed commands, revisions, idempotency, scoped cursors | Original `/v2`, typed field errors, interoperable FHIR and durable events |
| V2-EVD-001–003 | Exact bytes, rechecked SHA-256, scope disclaimer, different test-person issue and withdrawal | Signatures, correction lineage, disclosure rights and genuine independent review |
| V2-OPS-001–002 | Locked dependencies, migrations, fixtures, application tests and build | Complete milestone gates, load/security/recovery and supply-chain evidence |

Recipe suggestions, device/service accounts, resumable uploads, arbitrary media, robustness perturbations, live remote inference, real independent approval, external effects, production availability/recovery/fairness targets and external event delivery are not implemented. The specification's 81 requirement IDs are not represented as 81 passing application tests.

## Runtime boundaries

- Each signed-in owner has separate synthetic institutions. The role selector tests policy inside that owner's scope.
- Generated synthetic runs do not require legacy study/dataset grants. They require verified synthetic institution, active membership, allowed role and no safety hold. They cannot import clinical datasets.
- References share a process/database with the scorer. Hiding fields and separating function arguments does not establish sealed-label infrastructure; aggregate metrics may reveal generated labels.
- Generated audio deliberately correlates signal properties with generated labels. Results demonstrate executable plumbing, not realistic cough distributions or medical performance.
- Imported predictions are declared outputs. The platform does not attest their generating model, call that application or measure its inference latency.
- Callback delivery is an internal simulation event. No real hospital, laboratory, patient or external endpoint is contacted.
- Integrity hashes detect changed bytes against the stored expected hash. They are not signatures and do not defend against an administrator replacing both content and digest.
- Limits: six ecosystems and 24 preserved runs per institution; 10–200 people, 1–10 health centres and 1–20 clinicians per recipe. Processing is synchronous; no queue/GPU worker is implied.
- Reset retains history, increments generation and cancels running/paused runs. Old-generation registry/audio/replay is rejected. Historical timeline/evidence remains readable subject to access policy.

## Next delivery slices

1. Isolated execution plane using the original `/v2` contracts: artifact intake, admission, queue/outbox, fenced attempts and separate scoring identity.
2. Application/service identities and approved endpoint adapters with real callback, retry and uncertainty fixtures.
3. Resumable media, quarantine, object storage, controlled transforms and protected reference partitions.
4. FHIR profile validation, richer scenarios, paired statistical comparison and disclosure controls.
5. Regional infrastructure with independently exercised security, accessibility, load, recovery and clinical governance gates.
