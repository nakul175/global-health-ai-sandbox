# User guide — synthetic technical alpha

Edition 1.1, reconciled to package 0.6.0 plus PR #13. A deployed Site may still run the earlier source. All examples here are fictional; the generated waveforms are not patient cough recordings.

## Enter and choose context

Open the institution's supplied Site URL and sign in with ChatGPT. Each signed-in owner has separate persistent data. Choose Aster for the ready synthetic workspace. Beacon demonstrates another institution; Cedar demonstrates onboarding. The profile selector simulates people controlled by the same owner.

| Test person/profile | Role and main use |
|---|---|
| Maya Chen | Programme manager: drafts, ecosystems, access requests and evidence drafts |
| Maya reviewer alias | Same test person in a reviewer role; must not approve Maya's own work |
| Elena Ortiz | Reviewer: study decisions and report issuance |
| Sam Okafor | Custodian: data release and legacy grants |
| Leo Park | Developer: models, evaluations and live connections |
| Noor Ahmed | Safety: concerns, holds and withdrawals |
| Alex Morgan | Administrator: synthetic institution/team, workbench grants and checkpoints |
| Ravi Shah | Auditor: read-only review |
| Support operator | Support: restricted context and granted aggregate diagnostics |

The executable profile names/IDs in lib/domain.ts are authoritative. These labels do not establish real employment, legal authority or independence.

## Run the lab journey

1. As Maya, open Release 2 lab → Ecosystem. Generate the default population: 80 fictional people, three health centres, six clinicians and a laboratory. Inspect linked records and download a generated WAV.
2. In Simulation, choose Audio reference A and normal conditions. Start a run and advance virtual time by 48 hours.
3. Inspect coverage, screening, referrals, lab results, callback events and assertions. Try a separate outage/duplicate/slow/lost-callback run and inspect its visible failures.
4. Run Audio reference B on the same ecosystem and compare. A changed generation or scenario is not an identical comparison.
5. Draft evidence as Maya. Switch to Elena to review and issue the exact report, then download. A same-person alias cannot supply independent test approval.

Reset begins a new generation and cancels active old-generation runs; it does not delete historical evidence. Select the new generation after a stale-generation error. Use the report's synthetic evidence limitations when interpreting metrics.

## Use the workbench

| Module | Procedure | Important boundary |
|---|---|---|
| Models | As Leo, download/edit/register the example closed JSON forest | Parameters execute; uploaded Python, ONNX, Docker and GPU models do not |
| Jobs | Enqueue a model/ecosystem/scenario, claim it, then process; inspect the resulting lab run | Dispatch is manual; a queued row is not an unattended worker |
| Audio | Download a generated WAV, upload as Leo, resume with the same file/person if interrupted; release as Sam | Quarantine is not malware scanning |
| Access | Request playback, inference and export separately; Alex approves the workbench request | Legacy dataset grants instead use Sam; grants expire and are rechecked |
| Analysis | Partition, compare compatible completed runs and run gain/noise perturbations | Synthetic statistics do not establish clinical performance |
| Registries | Use service presets, edit supported names/active flags, merge under permitted custody | Limited synthetic resources, not a full patient-system registry |
| Evidence | Create a correction, then independently issue in the lab; verify a signed bundle with a trusted public key | Application signature is not institutional certification |
| Operations | Export permitted metadata, examine simulated exercises, capture/verify checkpoints as Alex | Simulated backup/restore is only a metadata consistency drill |

## Connect your own JSON service

In Integrations choose the live-connection form, not the collapsed simulated-fixture section. As Leo, configure a final public HTTPS endpoint, supported authentication and request/response field mappings. Saving alone does not contact it.

Confirm authority to send synthetic inputs, run a real test and inspect the persisted outcome. Activate only after a successful current-configuration test within 15 minutes. Then evaluate 10–20 generated subjects or one released upload with export/inference grants. Complete metrics require all subjects to succeed. Calls can consume provider usage.

Changing destination or authentication details requires a replacement credential and retesting. Disable blocks later calls and rejects late results but cannot undo a sent request. Release an interrupted call only after reviewing its unknown outcome. Connection results remain in connection history and are not automatically part of an issued lab report.

See [supported contracts and limits](../SELF_SERVICE_CONNECTIONS.md). No customer service is preconfigured. A successful GET status check does not prove EHR interoperability.

## Legacy governed journey

Create a programme/study as Maya, submit the exact protocol and review as Elena. Import the strict synthetic CSV, release as Sam, request a study/dataset grant and approve it as Sam. Register a bounded reference model as Leo, execute, then draft and issue evidence under the appropriate distinct test roles.

## Recover from common problems

| Message/state | Action |
|---|---|
| Wrong/revoked role | Choose an active permitted test profile; Alex can restore a non-admin test membership |
| Unverified institution | Submit as Maya and decide as Alex; these are synthetic verification fixtures |
| Conflict / stale version | Preserve input, refresh, inspect changes and explicitly resubmit |
| Safety hold | Stop the blocked operation; review in Safety centre as Noor and record the reason for release |
| Missing/expired grant | Obtain a new grant for the exact required scope; old approval cannot be reused |
| Unknown provider outcome | Reconcile before another request; do not assume timeout means nothing happened |
| Quota reached | Reuse existing test records or plan a reviewed capacity change; reset does not erase history |
| Integrity failure | Preserve the evidence and escalate; never replace its hash to make it pass |

Some older in-app explanatory panels predate the upload/live-connector increments. [The discrepancy register](../IMPLEMENTATION.md) identifies these; current routes and release-specific guides control the interpretation.
