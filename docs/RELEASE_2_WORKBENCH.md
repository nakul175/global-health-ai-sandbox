# Release 2 workbench — v0.4.0

Historical 0.4.0 scope. `ASSURANCE_0_5.md` adds real application signatures and encrypted database/media checkpoints with tested isolated restoration; institutional certification and regional recovery remain absent.

26 September 2026. Requested scope: complete remaining test workflows, using conspicuously labelled stubs where dependencies or production capabilities are unavailable.

## Execution labels

- **Working:** this specific action executes application logic and persists its result. This label does not certify the full regional architecture or clinical suitability.
- **Working subset:** a bounded part operates; the screen states the remaining boundary.
- **SIMULATED / DUMMY:** stored fixture data or a local simulation, with no claimed external effect.
- **NOT CONNECTED:** the required service or acceptance evidence is absent. No successful result is fabricated.

These labels appear in module descriptions, saved records, exports and the 81-entry source requirement register. The register lives in `lib/capabilities.ts`, retains the original requirement text, and describes scope against the complete specification. Original acceptance criteria remain unchanged under `docs/source-backlog/r2/`.

## Working additions

| Module | Implemented behavior | Explicit boundary |
|---|---|---|
| Portable models | Closed JSON forest upload, bounded parameters, fixed audio preprocessing, actual dry-run inference, hashed immutable package record, execution through lab or job workflow | This is a supported portable format, not arbitrary Python/ONNX/Docker/GPU execution; no trained medical model is supplied |
| Job control | Durable queued/running/failed/completed/cancelled states, active-job quota, 5-minute leases, increasing epochs, same-worker commits, retry history and atomic run/job results | Dispatch is manually invoked; there is no autonomous worker or external queue service |
| Audio | R2 chunk storage, 32 KiB parts, resume, per-part and whole-file SHA-256, canonical PCM16 validation, quarantine, different-test-person release and revocation | ≤500,000 bytes; synthetic audio only; malware scanner is visibly unconnected |
| Audio permissions | Separate approved, expiring playback/export/inference grants; protected delivery and actual inference on stored bytes | Test-person rights within one owner's synthetic institution; not legal approval for patient data |
| Registry | Three service presets, editable patient/facility/practitioner names and active flag, snapshot/generation updates; same-reference participant merge with alias retention and subject rewiring | Presets are service/population fixtures, not clinically coherent disease models; full FHIR validation absent |
| Analysis | 60/20/20 participant partitions; paired accuracy difference, 400-replicate percentile bootstrap and exact McNemar probability; actual gain/noise waveform perturbation and inference | One synthetic environment; no cross-dataset identity proof, clinical validation or hardware benchmark |
| Access | Recorded scoped requests, independent test-admin decision, expiry, revocation; aggregate support diagnostics protected by grant | Invitations and application/device identities are explicitly dummy; no message is sent or real credential created |
| Evidence | Correction draft links to original; independent issuance atomically supersedes old report; old download blocked; hashes verified | No institutional digital signature, real independent reviewer or regulatory approval |
| Operations | Permitted metadata export, measured in-process metadata serialisation roundtrip, repeatable acceptance pipeline | Export is not a complete backup; failover/worker-crash/key-rotation/load exercises are tabletop fixtures |

## Clearly simulated dependencies

The fixture installer creates an example cough-model connector, hospital connector and nonfunctional application identity. Connector tests exercise success, timeout, duplicate and error responses locally. Endpoints are syntax checked, but no request is sent. Timeouts remain labelled unknown-provider-outcome fixtures. Duplicate tests produce a single simulated business effect.

Container/GPU workers, live remote inference/EHR/laboratory connections, real institutional federation, separate protected reference storage, malware scanning, signing infrastructure, production telemetry and regional failover are not connected. Static example entries do not pass admission, authenticate requests or count as verified production capabilities.

## User acceptance walkthrough

1. Open **Release 2 workbench** as Maya. Install the dummy entries; verify their amber simulation labels.
2. In **Registries**, generate a service population. In **Models**, switch to Leo and register the example JSON forest (or upload a compatible package).
3. In **Jobs**, select that ecosystem and model, enqueue, claim and process. Inspect the completed run in Release 2 lab. Inject timeout on a separate job, retry, claim the next epoch and process.
4. In **Analysis**, partition participants, compare two completed runs on the same snapshot, and execute a waveform perturbation test. Inspect/export the computed results.
5. Download a generated WAV from the lab. In **Audio**, upload it as Leo. The file remains quarantined. Switch to Sam to release it for synthetic testing.
6. As Leo, request playback and inference separately in **Access**. As Alex, approve. Return to Leo: download and score the uploaded bytes. Revoke a grant and confirm the corresponding operation fails.
7. In lab Evidence, draft as Maya and issue as Elena. In workbench Evidence, draft a correction; issue it as Elena in the lab. The old report becomes superseded.
8. In Operations, compare the real metadata roundtrip with the labelled regional-failover fixture. No production latency, availability or recovery result should appear as measured.

Active module selection survives test-role switching through the URL. Failed commands preserve input; stale revisions require refresh/review. An interrupted upload can resume by selecting the same file with the original uploader identity.

## Limits and operational conditions

Existing limits remain explicit: six ecosystems, 200 people per ecosystem, 24 preserved lab runs and 500 aggregate records per institution. Additional bounds: three active jobs and 20 media sessions. Reset does not erase historical runs/media. Capacity increases require changing the architecture and measuring the declared profile, not raising constants without evidence.

Reference labels are hidden from normal views but still share this Worker/database. Synthesised waveforms correlate with generated labels by construction. Neither metrics nor fixture approvals establish real clinical accuracy.

Native hosting applies new migration `0002_amazing_silhouette.sql` and provisions logical R2 binding `MEDIA`. Prior migrations are unchanged. Roll application code back to a compatible source version while retaining additive tables and bucket content. Do not destroy data to roll back. Interrupted storage writes can leave unreferenced chunk objects if the later database commit fails; a production orphan-retention sweeper is not implemented.

## Verification and automation

`pnpm verify` runs typecheck, domain/SQLite tests, production build and actual built-Worker HTTP tests in order. The HTTP runner provisions isolated local D1/R2 fixtures and never touches hosted test records. JUnit and HTTP JSON evidence are committed in `verification/`. Hosted sign-in, authenticated interactive browser, formal accessibility, penetration, production load and infrastructure recovery acceptance remain unverified.
