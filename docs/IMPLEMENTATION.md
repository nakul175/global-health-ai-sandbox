# Current implementation and handover record

Documentation edition **1.1**, 28 September 2026. Source baseline: **870b49a343f1207b8cefbecdbfb0c5c5d10c955a**. Package version remains **0.6.0**. This edition changes documentation and documentation tooling only.

The repository can support continued development with the source, contracts, fixtures, test evidence and next work linked below. Production acceptance and government R3 delivery are not established.

## Three distinct profiles

| Profile | Implemented or intended scope | Authority |
|---|---|---|
| Hosted technical alpha | React/TypeScript on Worker/D1/R2; synthetic health ecosystem, bounded evaluation, workflow simulation and evidence; limited real HTTPS JSON connections | Executable app/lib/routes/migrations plus scoped verification |
| Native programme baseline | Separate FastAPI/React/PostgreSQL/PGlite development slice for programme management, identity-policy boundaries, audit/outbox and safety | native-baseline source and its separate reports |
| Government R3 | Institution-owned comparison, context, economics, evidence decisions, later integrations/pilots/reuse | Proposed design only; 63 requirements and 134 planned application cases |

The earlier original target has 456 requirements across 35 functional modules. The synthetic R2 extension has 81 requirements. These are separate catalogues, not a combined completion denominator. No full source requirement is newly declared accepted by this reconciliation.

## Current behaviour

| Area | Available implementation | Remaining boundary |
|---|---|---|
| Identity and institutions | ChatGPT-owner authentication, three separate synthetic institutions, nine test profiles across eight roles; institution review and membership controls | No real shared institutional memberships, enterprise federation or independent authenticated reviewers |
| Programme and study | Drafts, updates, constrained archive, exact protocol submission and different-test-person review | Full contracts, ethics, country rules and human authority remain target scope |
| Data | Strict synthetic CSV; controlled grants; bounded resumable PCM16 uploads, quarantine and custody release | No clinical ingestion, arbitrary media, scanner or general regional data policy |
| Ecosystem | Deterministic linked fictional patients, facilities, clinicians, encounters/observations, generated WAV and downstream referrals/results | FHIR-shaped subset; no FHIR server conformance or medical realism |
| Models | Fixed logistic references, probability imports, bounded JSON forest, actual waveform feature inference | No arbitrary code, Python/ONNX/container/GPU execution or trained clinical model supplied |
| Runs and analysis | Virtual-time faults/replay, manual leased jobs, partitioning, paired comparisons and perturbation | Manual dispatcher, shared labels/scorer, bounded synthetic acceptance |
| Connections | Configured public HTTPS POST prediction or GET service check, encrypted secrets, mapped fields, activation and call records | No customer provider qualification, full EHR transactions, OAuth, callbacks or private-network adapter |
| Evidence | Frozen exact bytes, test-person review, correction/supersession, application P-256 signatures | No institutional trust service; live connector results are not in lab signed-report issuance |
| Assurance | Atomic receipts/audit/snapshots; encrypted database/media checkpoints and isolated restore tool | No independent escrow, regional cutover, proven RPO/RTO or production SLA |
| Operations | Diagnostic grants, metadata export and conspicuously simulated exercises | Exercise fixtures are not production load, failover, key rotation or database restoration |

Sources: [workbench](RELEASE_2_WORKBENCH.md), [connections](SELF_SERVICE_CONNECTIONS.md), [assurance](ASSURANCE_0_5.md), [current API](current/CURRENT-API-INVENTORY.md), [data dictionary](current/CURRENT-DATA-DICTIONARY.md).

## Version and deployment ledger

| Revision | Meaning |
|---|---|
| 538cbd052630bef27cc8ffa5ec880ffd01d53810 | GitHub import of v0.6 alpha, recorded as matching deployed source 8a08831be002da80b0cdf6e4ec43d8fadcb02310 |
| 72037bd5cc67ef00e450a1842aff374e68c39026 | R3 proposed documentation and maintenance workflow |
| 2f0f35271c287722efd5b39c48dfeae971041df1 | Eleven hosted/native review fixes |
| 870b49a343f1207b8cefbecdbfb0c5c5d10c955a | PR #13 merged; reconciliation source baseline |

PR #13 fixed canonical JSON handling, simulated-drill integrity, rejected media-part cleanup, checkpoint limits, atomic connector quotas and explicit workspace creation. Native fixes address outbox backoff/dead-lettering, date validation, country history, configuration and database error mapping. [PR details](https://github.com/nakul175/global-health-ai-sandbox/pull/13) describe the residual media cleanup window and tests not run. A commit does not deploy the Site. The current hosted deployment was not inspected for this documentation edition.

## Capacity and error boundaries

Six ecosystems and 24 preserved lab runs per institution; 10–200 people, 1–10 health centres and 1–20 clinicians per recipe. Ordinary records are bounded at 500; three active jobs and 20 media sessions. Uploaded WAV is 48–500,000 bytes in 32 KiB parts. Live connections allow ten connectors, 200 history entries per connector and up to 20 subjects per evaluation. The checkpoint cap is five per workspace; concurrent object-store creations can exceed it by in-flight requests. No deletion/rotation endpoint exists.

Reset advances the ecosystem generation and preserves history. A stale generation is not a request to erase records. Late external results may be discarded without undoing external processing. Unknown provider outcomes require explicit reconciliation.

## Known explanatory discrepancies

| Location | Stale description | Current interpretation |
|---|---|---|
| app/workspace.tsx testing-guide exclusions | Says resumable uploads, live remote execution and external integrations are absent | Later v0.4/v0.6 modules implement bounded synthetic uploads and live JSON connections |
| app/suite.tsx Models explanatory panel | Describes only dummy remote models | The Integrations tab also has the separate live-connection workflow |
| lib/capabilities.ts, V2-SEC-005 | Says no provider secrets are accepted | v0.6 accepts scope-bound encrypted connector credentials |
| Earlier native-baseline descriptions | Call the baseline unchanged | PR #13 made explicit native fixes; original revisions remain in Git history |

This documentation edition corrects the reading profile without modifying application code. The in-product wording remains a separately recorded next task. Source-declared capability modes and full acceptance are not equivalent.

## Continue development

Start at [documentation index](current/DOCUMENTATION-INDEX.md), [next delivery](NEXT-DELIVERY.md), [qualification](QUALIFICATION.md) and [developer handover](current/DEVELOPER-HANDOVER.md). Preserve historical results, migration bytes, source IDs and explicit missing dependencies.
