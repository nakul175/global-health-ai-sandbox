# Independent synthetic cough evaluation service

3 October 2026. Candidate source from main `8b4b4b5`; disabled by default, unmerged and not deployed. [ADR 012](ADR_012_Independent_Cough_Evaluation.md) records the ownership and storage decisions. This extends the synthetic technical alpha, not the proposed government release.

| Responsibility | Global Health AI Sandbox | Saha |
| --- | --- | --- |
| Identity | Actual signed-in provider owner and synthetic administrator profile | Trusted Saha identity, organisation membership and assigned care role |
| Permission | Independent customer agreement and workspace hold | Explicitly synthetic patient, current confirmed visit, AI permission, processing restrictions, disputes and organisation agreement |
| Request | Customer authentication, strict fixture contract, atomic reservation and bounded ledger | Approval and durable checkpoint before one POST; opaque request ID with no patient identifiers |
| Result | Existing generated-signal reference, technical features, input-bound HMAC receipt | Strict signature/binding validation; fresh permission and version checks before retaining a result |
| Uncertainty | Reserved request stays pending; duplicate POST/GET never recomputes | Unconfirmed result stays uncertain; receipt lookup uses GET; no automatic resend |
| Review | No clinical decision | Staff acknowledgement/rejection with reason; no fact, diagnosis, treatment or outgoing record change |

## Versioned contract

Runtime schemas are closed in [lib/cough-contract.ts](../lib/cough-contract.ts), copied byte for byte to Saha's `lib/saha/cough/contract.ts`. `synthetic-cough-evaluation-v1` is the wire version; `audio-reference-a-generated-v1` is the reference version. SHA-256 `2d1343c56c82c3f7442ea49913b2513fd0ad7296abee79783124bc806f0e26e4` pins the execution specification (reference configuration, generator version, fixed fixture and quality rule), not trained weights.

| Method | Path | Authority / outcome |
| --- | --- | --- |
| GET | `/api/cough/v1/manifest` | Public contract and limitations; no database or secrets |
| POST | `/api/cough/v1/evaluations` | Enabled server, customer bearer key, active agreement and no hold; matching `Idempotency-Key`; 200 signed result or 202 pending |
| GET | `/api/cough/v1/evaluations/{requestId}` | Same customer authority; 200 original receipt or 202 pending; no computation |
| GET | `/api/cough-partners` | Configured, signed-in provider owner plus administrator test profile; own agreement and bounded ledger |
| POST | `/api/cough-partners` | Same owner/profile plus exact Origin, JSON and current agreement version; activate/suspend |

Request example (all fields required, no extra fields):

```json
{"schemaVersion":"synthetic-cough-evaluation-v1","requestId":"synthetic_request_0001","customerId":"saha-demo","environment":"synthetic","purpose":"engineering-demonstration","modelVersion":"audio-reference-a-generated-v1","syntheticFixtureConfirmed":true,"fixture":"generated-waveform"}
```

`fixture` is `generated-waveform` or `silence`; request IDs are 8–100 ASCII letters, digits, underscores or hyphens. JSON is streamed with a 2,000-byte bound and strict UTF-8. Browser Origin and cross-site service requests are refused. The consumer approves one fixed HTTPS origin, refuses redirects, bounds results at 16,000 bytes and applies a 20-second transport timeout.

The provider generates the canonical 2,000-sample, 8 kHz mono PCM16 waveform from seed 240925, amplitude 0.34 and frequency 650 using the existing generator. Silence zeros the PCM payload. RMS below 0.001 produces a signed `unable_to_assess` result with no score; otherwise the score is `sigmoid(18 × RMS + 4 × ZCR − 3)`. Both results state `clinicalUse:false` and `tbScreening:false`. Result verification checks strict fields, finite bounds, quality/status consistency, fixture, request/customer/input hash, pinned model/contract and HMAC signature. This is not a tuberculosis probability, sensitivity estimate or diagnostic output.

Authentication failures return 401, paused customer 403, body limit 413, format 415, schema/intent 422, workspace hold 423, version/input conflicts 409, absent receipt/workspace 404, and disabled/unconfigured service 503. No raw exception, credential, patient information or audio is returned in errors. Rejected POST bodies are drained within the fixture bound before cancellation so repeated keep-alive requests close consistently.

## Storage and administration

[Migration 0004](../drizzle/0004_cough_evaluation.sql) adds two owner-workspace-scoped tables. Customer rows retain activation, agreement reference and optimistic version. Evaluation rows retain opaque request ID, canonical input hash, fixture, agreement version, status, signed technical result and timestamps. No audio or Saha patient/visit ID is stored. The quota is 200 reservations per customer workspace; there is no deletion/reset endpoint. The provider owner sees the ledger at `/cough-partners`. Synthetic test profiles still simulate multiple people; they do not prove independent institutional authority.

Reservation and completion append ordinary workspace audit events and advance its revision atomically. Completion with a changed agreement or hold records `blocked` and no result. Interrupted computation stays `reserved`; manual intervention may investigate it, but lookup/replay cannot rerun it. Agreement reactivation increments its version and does not release older receipts.

Encrypted capture, verification and isolated recovery include both tables. Older archives default both absent tables to empty; a partly missing pair is rejected. No hosted restore or schema rollback is exposed. Capture a fresh checkpoint before a future provider deployment or activation, and retain existing keys and a saved rollback version.

## Configuration and release gates

The checked-in environment template leaves `COUGH_EVALUATION_ENABLED=false` and all private values empty. Server bindings are `COUGH_PROVIDER_OWNER_ID` (the actual trusted owner), `COUGH_SAHA_API_KEY` and `COUGH_RESULT_SIGNING_KEY` (each at least 32 characters). The owner's Aster workspace must already exist. No request creates it. Owner agreement activation requires the server configuration to be explicitly enabled, then customer agreement revision 0 is activated through the owner console. Suspension stays available when the server switch is off.

This change does not configure secrets, activate a customer, deploy either feature branch or merge a PR. Saha also defaults off and requires its own owner agreement, approved origin and server credentials. A future synthetic activation requires source review, the additive migration, compatible D1/MEDIA bindings, a verified encrypted checkpoint, a rollback choice and an independently checked hosted machine-auth/receipt flow. Keep Saha's existing anaemia candidate when assembling a hosted release; the cough adapter has its own fields and routes and does not alter anaemia.

Real recordings and trained model evaluation are excluded. Public redistribution of CODA participant data is not permitted; a private research use needs the applicable Synapse approval/IDU and safeguards, with the hosting/processor question clarified before import. Specific weights, containers and dependencies still require artifact-specific licence review. The [terms review PR](https://github.com/nakul175/global-health-ai-sandbox/pull/18) is the authoritative pending documentation change. No request for data access or acceptance of terms was made here.

## Local evidence and technical requirements

`pnpm verify` passed: type checking, 128 application tests, portable build, 43 existing HTTP checks and 14 additional cough-provider HTTP checks, using only isolated local D1/R2 and throwaway credentials. The new service files also pass targeted ESLint. See [evidence](../verification/cough-provider-2026-10-03/README.md).

| Technical subset ID | Local evidence | Remaining gate |
| --- | --- | --- |
| COUGH-EVAL-01: closed synthetic input/reference | Strict request/quality/signature unit cases and real Worker waveform/silence results | Trained model, real signal capture and clinical validity |
| COUGH-EVAL-02: customer/owner separation and pause | Auth, owner/profile, CAS, hold and in-flight suspension cases | Independent institutional identities and hosted dispatch |
| COUGH-EVAL-03: checkpointed idempotent receipt | D1 reservation-before-compute, interrupted pending, concurrent duplicate and GET cases | Operational resolution of interrupted reservations |
| COUGH-EVAL-04: complete encrypted recovery | Thirteen-table capture/restore and prior-archive compatibility; real Worker verification | Independently escrowed keys and regional recovery |
| COUGH-EVAL-05: independent care consumer | Saha adapter checks in its separate PR | Approved release/activation and representative intended-use evidence |

These IDs describe this engineering subset only. No original source requirement or R3 application acceptance is promoted, and all 134 R3 cases remain planned.
