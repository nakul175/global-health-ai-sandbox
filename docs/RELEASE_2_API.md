# Release 2 hosted adapter API

Version 0.3.0. This is the implemented adapter, not the proposed regional `/v2` API. Executable validation is in `lib/lab.ts`; shared transport is in `app/api/commands/route.ts`. No service-account API, remote model endpoint or conformant FHIR server is provided.

## Authentication and command transport

All data routes require trusted hosted ChatGPT identity. `tenant` defaults to `aster`; supported fixture institutions are `aster`, `beacon`, `cedar`, beneath the authenticated owner's scope. `X-Test-Profile` defaults to `maya` and selects an active synthetic profile. Client-selected owner IDs are never accepted.

Send `POST /api/commands?tenant=aster` with matching `Origin`, `Content-Type: application/json`, `Idempotency-Key` matching `[-A-Za-z0-9_.:]{16,128}`, and `If-Match: "<current workspace revision>"`. Obtain the revision from `/api/workspace`. Body: exactly `{ "action": "<command>", "data": { ... } }`. Unknown fields and type coercion are rejected; the maximum body is 180,000 bytes.

Success is HTTP 200 with `{commandId,revision,recordIds,action,replayed}`. Execution is synchronous. Identical retries under the same owner, institution, profile and intent key return the original receipt after current policy/generation checks. Changed intent is 409. New intent with stale revision is 409. Revision, changed records, snapshots, audit and receipt commit atomically.

## Closed schemas

All fields below are required unless explicitly optional. Objects reject unknown properties. Numbers must be finite JSON numbers. `id`: string 1–100 characters; `generation`: positive integer; `note`/`summary`: trimmed text 3–2,000 characters.

| Schema | Exact fields |
|---|---|
| Recipe | name: trimmed 3–120; count: integer 10–200; seed: integer 1–2147483647; positiveCount: integer 0–count; facilityCount: integer 1–10; clinicianCount: integer 1–20; synthetic: literal true |
| Scenario | mode: normal / outage / duplicate / slow / lost_callback; labDelayHours: integer 1–72; outageStartHour: integer 0–72; outageDurationHours: integer 1–72; maxWaitHours: integer 1–168. All fields required in every mode; outage fields affect only outage mode |
| Model configuration | name: trimmed 3–120; version: digits.digits.digits; rmsWeight and zcrWeight: −30..30; intercept: −20..20; threshold: 0.01..0.99; synthetic: true |
| Prediction | subjectId: SYN-P- followed by exactly four digits; probability: 0..1 |

| Command | Data | Roles |
|---|---|---|
| lab.ecosystem.generate | Recipe | manager, developer, custodian |
| lab.ecosystem.fork | id, generation, name (trimmed 3–120) | manager, developer |
| lab.ecosystem.reset | id, generation, note | manager |
| lab.model.register | Model configuration | developer |
| lab.run.create | environmentId (id), generation, modelId (id), scenario | manager, developer |
| lab.run.import | environmentId, generation, modelName (trimmed 3–120), threshold (0.01..0.99), scenario, predictions (10–200 Prediction objects) | developer |
| lab.run.advance | id, hours (integer 1–168) | manager, developer |
| lab.run.pause / lab.run.resume | id | manager, developer |
| lab.run.cancel | id, note | manager, developer, safety |
| lab.run.replay | id | manager, developer |
| lab.report.create | runId (id), summary | manager |
| lab.report.issue | id, note | reviewer |
| lab.report.withdraw | id, note | safety |

Built-in model IDs: `audio-reference-v1`, `audio-reference-v2`, `workflow-stub`. Registered configurations get generated record IDs. Imported predictions must join every subject exactly once with no extra IDs. A workflow stub is labelled separately from inference; imports do not claim model execution inside the platform.

Pause requires running; resume requires paused; cancel requires running/paused; advance requires running. Replay requires completed/cancelled, current generation and the original snapshot. Completed means all planned events processed; assertions may still fail. Evidence requires a completed run. Issuance requires an intact draft digest and a different synthetic person from both run and draft authors. Withdrawal requires issued state.

Safety holds deny lab mutations except cancellation and withdrawal. Membership, institution and role checks apply before idempotent replay. Synthetic recipes do not use legacy clinical-data grants. Completed historical runs can still generate evidence.

## Read routes

| Endpoint | Query parameters | Result |
|---|---|---|
| /api/workspace | tenant | Revision, permitted records, audit and fixture profiles. Lab projections exclude references, audio seeds, resources, predictions, plans, effects and issued bytes. Runs include latest 60 events plus eventCount |
| /api/lab/registry | tenant; environment; generation; type (default Patient); search (optional ≤100); limit (default 25, integer 1–100); cursor (optional); run (optional overlay) | `{profile:"synthetic-registry-r4-shaped-v1",synthetic:true,generation,total,items,next_cursor}` |
| /api/lab/audio | tenant; environment; generation; subject | Canonical 4,044-byte mono PCM16 WAV at 8 kHz, .25 seconds; X-Data-Origin: synthetic |
| /api/lab/timeline | tenant; run | `{synthetic:true,runId,generation,clockHour,events}` with full committed event history |
| /api/lab/export | tenant; id | Exact issued JSON bytes; X-Content-SHA256 gives their SHA-256 |
| /api/health | none | Availability/version of required tables; no tenant records |

These are GET endpoints. All lab data routes deny support. Audio and evidence downloads also deny active holds. Withdrawn evidence is unavailable. Registry/audio need current generation; timeline/evidence permit historical views. Data responses use no-store and nosniff.

Registry supports Patient, Organization, Practitioner, Encounter, Observation, ServiceRequest and DiagnosticReport. Search is case-insensitive ID/name substring; order is resourceType/id. The opaque cursor binds owner scope, environment, generation, type, search and selected run version, and expires after 15 minutes. Run advancement invalidates its cursor. Cursor possession grants no authority.

## Internal event records

Events are persisted simulation records, not an external bus contract. Shape: `{id:string,atHour:integer,type:string,subjectId:string,effectKey:string,duplicate:boolean,outcome:"applied"|"duplicate_suppressed"}`. Types: screen.completed, referral.created, lab.retry_scheduled, lab.completed, callback.delivered.

Order is virtual hour then stable event ID. Effects deduplicate within a run by effectKey. Each run owns its plan, cursor and effect set. Events through the target hour commit with counts, derived resources and assertions in one transaction. Virtual timestamps use the fixed 2026-01-05 epoch; audit uses real server time. Final-state hashes do not depend on the user's clock increment sizes.

## Errors and retries

Errors have `{error:{code,message}}`. Validation diagnostics are folded into the message, not a typed field-error array.

| HTTP | Codes / conditions |
|---|---|
| 400 | JSON, CURSOR |
| 401 | UNAUTHENTICATED |
| 403 | FORBIDDEN, ORIGIN, MEMBERSHIP_REVOKED; institution restrictions |
| 404 | UNAVAILABLE: absent or outside owner/institution scope |
| 409 | VERSION_CONFLICT, IDEMPOTENCY_CONFLICT, GATE_BLOCKED, INTEGRITY, TEST_LIMIT |
| 410 | STALE_GENERATION |
| 413 | TOO_LARGE |
| 415 | CONTENT_TYPE |
| 422 | VALIDATION, IDEMPOTENCY_KEY, PRECONDITION, PROFILE_UNSUPPORTED, PREDICTION_INVALID, PREDICTION_MISSING, AUDIO_FORMAT |
| 423 | SAFETY_HOLD |
| 428 | PRECONDITION missing |
| 429 | LAB_QUOTA: six ecosystems or 24 preserved runs per institution |
| 503 | DATABASE_UNAVAILABLE / unavailable service |

Do not automatically retry 409/410/422: refresh and review conflicts, select the current generation or correct input. After transient transport failure, retry identical intent with its existing key; it may already have committed.
