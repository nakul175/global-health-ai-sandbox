# Release 2 verification — 0.3.0

Historical report. See `WORKBENCH_VERIFICATION.md` for 0.4.0; the adjacent machine-readable reports now contain the newer results.

Executed 25 September 2026 against the hosted adapter source and its built Worker.

| Gate | Result | Evidence |
|---|---|---|
| TypeScript | Passed | `node node_modules/typescript/bin/tsc --noEmit` |
| Unit and SQLite integration | 57 passed, 0 failed, 0 skipped | `r2-unit-integration.xml`; 29 legacy tests plus 28 Release 2 tests |
| Built-Worker HTTP/integration/smoke | 22 passed, 0 failed | `http-tests.json`; 13 legacy/transport/smoke checks plus nine Release 2 checks |
| Production Worker/client build | Passed | Managed Site build includes all four `/api/lab/*` routes |
| Authenticated interactive browser journey | Not executed | Internal preview shows sign-in but cannot supply hosted owner authentication |
| Hosted application acceptance | Owner testing required | Publication status confirms deployment, not the user's sign-in and interactive journey |

## Tested behaviors

Closed schemas and numeric bounds; deterministic seed, quota, waveform and snapshot; connected resource integrity and correct recipe lineage; waveform decoding/features; golden metric arithmetic, ties, missing denominators and confidence intervals; exact prediction joins; atomic persistence and injected-failure rollback; cross-owner/institution isolation; hidden references and support denial; normal scenarios; pause/resume/cancel; outages and recovery; duplicate effect suppression; intentional lost-callback/slow-lab assertion failure; replay digest equality; reset generation fencing including historical retries; fork independence; intent deduplication and stale versions; safety holds and membership revocation; registered model differences; prediction-import and stub classifications; role separation; exact evidence bytes; refusal of altered drafts/export bytes; SQL constraints.

The HTTP suite additionally starts the actual production Worker, provisions a disposable local D1 database from all migrations, tests anonymous denial, authenticated server-rendered application HTML, Origin/content-type/preconditions, registry pagination and scope, binary WAV response, real inference, event/registry outputs, replay, evidence download hash, hold/revocation and old-generation rejection. It cleans up its Worker on completion. Hosted data is not changed by these tests.

## Reproducible fixture

Release 2 unit/integration recipe: 40 people, seed 240925, exactly 12 positive references, three facilities plus one laboratory, six clinicians. Before simulation: 130 resources. Default scenario: lab delay 24 hours, outage start 24/duration 12, maximum wait 48. Normal lab completion is virtual hour 26 with callbacks at 27. Outage delays results to hour 37. Duplicate mode produces one callback effect per referral plus suppressed repeats. Slow mode exceeds the wait limit; lost-callback mode fails callback completion whenever referrals exist. Replaying the same frozen inputs yields the same final-state digest regardless of clock-step size.

The four-row arithmetic fixture has probabilities .9/.4/.7/.1, references 1/1/0/0 and threshold .5: TP=TN=FP=FN=1, sensitivity=specificity=.5, AUC=.75 and Brier=.2175. No estimated clinical accuracy is implied.

## Limits of this evidence

Local SQLite/D1 checks do not establish hosted replication, availability or disaster recovery. HTTP fixtures use synthetic dispatcher identity headers in the isolated local test process; those are not hosted credentials and no login bypass is added. Interactive authenticated browser, device, accessibility conformance, external identity, remote model, load, penetration, restore, clinical and regulatory acceptance have not been executed.

Source requirement catalogue tests are design obligations, not executed application tests. Native baseline tests are separate evidence and are not added to these counts. The first technical slice does not close all 81 Release 2 requirements.
