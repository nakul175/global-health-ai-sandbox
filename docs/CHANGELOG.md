# Documentation changelog

## 2026-09-28 — Reconciled documentation and development handover edition 1.1

- Added full BRD/FSD reading editions from the preserved 456-requirement model, current HLD/LLD, ten engineering reading editions, guides, data governance and release acceptance.
- Reconciled v0.6, later PR #13 fixes, native development profile and proposed R3 without promoting requirement or test status.
- Preserved 1,066 original case definitions and supporting scenarios/scripts in CSV, separated historical execution identities, and added three-catalogue traceability, exact API/schema inventories and an illustrative screen atlas.
- Archived 137 available earlier documentation/contract/fixture/catalogue/evidence files with exact hashes. Missing original Word/standalone documents remain explicit.
- Added deterministic generation and a current-edition validator to documentation CI. No runtime code, active migration, historical verification report or deployment changed.

## 2026-09-27 — Hosted alpha code-review fixes (issues #2–#7)

- `canonical()` now matches `JSON.stringify` for unrepresentable values: object keys holding `undefined` are omitted and undefined array items become `null`, so canonical output is always valid JSON (#7; unit test added).
- The `backup_restore` operational exercise is recorded as `simulated` like the other exercises, with a limitation pointing at the checkpoint API; its check is now falsifiable (parsed record count and recomputed content digests of datasets, partition manifests, run model freezes and evidence drafts) and fails visibly when a stored digest no longer recomputes (#2; tests updated and added; `RELEASE_2_WORKBENCH.md`, capability register and workbench copy reworded).
- Media chunk upload removes the just-written object when its metadata commit is rejected, unless committed metadata already references the same content-addressed key, so a rejected part leaves no orphan (#3; `RELEASE_2_WORKBENCH.md`, `WORKBENCH_API.md`).
- Checkpoint creation refuses a sixth checkpoint per workspace with 409 `CHECKPOINT_LIMIT`; no deletion or rotation endpoint exists (#4; `ASSURANCE_0_5.md`).
- Live-connector and call-history quotas are enforced inside the inserting SQL statement, closing the count-then-insert race; error codes unchanged (#5; concurrency test added; `SELF_SERVICE_CONNECTIONS.md`).
- Only `GET /api/workspace` creates the seeded workspace; all other reads and all commands require it to exist and return 404 `UNAVAILABLE` otherwise (#6; `API_CONTRACT.md`).
- Native baseline (issues #8–#12, not part of the hosted runtime): outbox worker retry schedule and dead-lettering, strict RFC 3339 programme dates returning 422, programme country history preserved across edits, configuration names aligned with the loader and strict boolean handling, constraint-aware database error mapping. Details in `native-baseline/docs/CONTRACT_CHANGES.md`; `rfc3339-validator` added to `requirements.in` with both hashed locks regenerated.
- No migration, dependency or hosted-runtime deployment is part of this change; the hosted baseline remains v0.6.0 until redeployed through the existing hosting workflow.

## 2026-09-26 — Government adoption design baseline 1.0.0

- Added the R3 BRD, FSD, HLD, LLD, UI/wireframes, API/events, candidate database design, permissions, implementation backlog, test catalogue, fixture plan, development/CI, threat model, runbooks, pilot plan, economics and decision records.
- Linked new requirement IDs to work packages, acceptance cases and design documents; retained earlier requirements unchanged.
- Added a documentation index, maintenance rules, contributor instructions, pull-request checklist and automated documentation validation.
- Corrected current audience wording: the hosted alpha is publicly reachable but requires ChatGPT sign-in; application data remains separated by signed-in owner.
- All R3 application capabilities remain proposed. Candidate schemas, migrations and reference fixtures are development artefacts, not changes to the hosted runtime.
