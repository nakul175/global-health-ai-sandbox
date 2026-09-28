# Workbench API and access contract — v0.4.0

All previous `/api/commands` authentication, Origin, strict envelope, 180,000-byte limit, workspace revision and idempotency rules remain. `lib/suite.ts` contains the executable closed schemas and explicit role matrix for every `suite.*` command. `suitePermissions` is enforced on the server, including current membership, institution verification and safety hold policy. The original `/v2` regional API has not been substituted with these adapter routes.

## Command groups

| Group | Commands | Role boundary |
|---|---|---|
| Fixtures / templates | demo.seed; template.generate | Manager/admin for fixture install; manager/developer/custodian for generation |
| Portable model | package.register | Developer |
| Connectors | connector.create / test / disable | Developer configuration; manager/developer tests; admin may disable |
| Jobs | job.enqueue / claim / process / retry / cancel | Manager/developer; safety may cancel |
| Media | upload.create / part / finalize / release / revoke; media.result | Developer/custodian upload; different custodian release; developer inference; safety/custodian revoke |
| Registry | registry.patch / merge | Manager/custodian amendment; custodian merge |
| Analysis | analysis.partition / compare / robustness | Manager/developer; custodian partition; reviewer comparison |
| Access | access.request / decide / revoke | Requester roles including support; admin decision; admin/safety revocation |
| Dummy identities | identity.create / revoke | Admin; safety may revoke |
| Evidence | evidence.correct | Manager drafts; existing reviewer-only lab.report.issue performs independent issue |
| Operations | exercise.run | Admin/safety |

Each name above has `suite.` prefix. Media part/finalisation/result commands cannot be called through generic `/api/commands`: callers must use the dedicated route that verifies stored bytes. The internal command schemas remain closed and are tested through the domain and HTTP layers.

## Portable package

Required fields: `name` (trimmed 3–120), `version` (digits.digits.digits), `format:"portable-forest-v1"`, `preprocessing:"pcm16-rms-zcr-v1"`, `threshold` (.01–.99), `synthetic:true`, `trees` (1–32 closed objects). Every tree contains `feature` (rms or zcr), `threshold` (0–1), `below` (0–1) and `above` (0–1). All numbers are finite. Each tree chooses its below/above probability by comparing the extracted feature with threshold. The package probability is the arithmetic mean of tree outputs. There is no interpreter, evaluation of code, dynamic import or network access.

## Resumable media protocol

1. Create `suite.upload.create` with closed `{name,size,sha256,synthetic:true}`. Size: 48–500,000 bytes; SHA-256 is 64 lowercase hex characters. Response gives a `media_session` ID. Part size is fixed at 32,768 bytes; the final part is exact remaining size. Maximum 16 parts.
2. Read `/api/workspace` to recover that session's committed parts and current revision. Only the original test person may resume/finalise.
3. `PUT /api/suite/media?tenant=aster&id=<session>&part=<zero-based index>`. Headers: matching Origin, `Content-Type: application/octet-stream`, `X-Test-Profile`, `X-Chunk-SHA256`, quoted `If-Match`, valid `Idempotency-Key`. Body is the exact chunk bytes. Declared and streamed size are bounded; index/size/hash conflicts are rejected.
4. Bytes are stored under owner/institution-derived scope + session + index + chunk hash. Metadata, audit and receipt commit via the shared optimistic transaction. Identical content can be resumed; changed bytes at a committed part index return 409 PART_CONFLICT. A failed database commit cannot publish uncommitted bytes through the API, and the route removes the just-written chunk object when its commit is rejected unless committed metadata already references that same content-addressed key. The object store has no conditional delete, so a concurrent identical part committed in the few milliseconds around that delete is re-checked and its bytes restored; the remaining window is repaired by re-sending the same part, which is accepted for an already committed identical part.
5. `POST /api/suite/media?tenant=aster&id=<session>` with Origin/revision/intent/profile headers and no required body assembles all stored parts, verifies every part and final digest, and runs bounded PCM16 decoding. Missing data returns 409 INCOMPLETE; corrupt bytes return 409 INTEGRITY; malformed WAV returns 422 AUDIO_FORMAT. Success persists features and moves the record to quarantined.
6. `suite.upload.release` requires a different test-person custodian. Scanner status remains **STUB**. This release is synthetic-only.
7. `GET /api/suite/media?...` requires released status, no hold, active membership, non-support role and an unexpired approved playback grant for that test person. `purpose=export` requires a separate export grant. Exact bytes and X-Content-SHA256 are returned. Revocation blocks later delivery.
8. `PATCH /api/suite/media?...&model=<model ID>` requires developer role, an inference grant, released media and the mutation headers. It verifies/reassembles the stored file, executes the selected local model, and atomically records an analysis containing input/model hashes and computed probability. No reference diagnosis or accuracy is fabricated.

Grants apply to the synthetic institution and recorded purpose. They do not authorise clinical data or external transfers. No bearer service credential is accepted; hosted authentication remains mandatory.

## Job and registry concurrency

Jobs freeze input IDs and generation at enqueue. Claim creates a five-minute lease bound to the test person and incremented epoch. Processing requires matching epoch, owner, running state and unexpired lease; its model result and job completion commit together. Concurrent cancellation or registry change prevents a stale commit through workspace revision checks. Failures retain attempt history; explicit retries are bounded to three attempts. Cancellation fences local dispatch; there is no remote process to acknowledge termination.

Registry changes require current generation and no running/paused lab run. Changes create a new snapshot/generation. Merge refuses conflicting references, retains an inactive replaced-by alias, rewrites encounter subjects and removes duplicate scoring input. Old queued jobs cannot run after generation changes; cancellation remains possible.

## Read/export scope

- `/api/suite/diagnostics`: admin or approved/unexpired support_diagnostics grant. Returns counts and job statuses, not patient/reference/audio content.
- `/api/suite/export`: permitted non-support roles; blocked by hold. Returns projected metadata, explicit mode labels, limitations and a digest. It is not a complete data backup or signed evidence package.
- Issued clinical-style test evidence continues through `/api/lab/export`; correction issuance supersedes the original and prevents its old download.

Errors retain `{error:{code,message}}`. Additional codes include ENDPOINT (422), QUOTA (429), LEASE_CONFLICT (409), PART (422), PART_CONFLICT (409), INCOMPLETE (409), INTEGRITY (409), STORAGE_UNAVAILABLE (503), QUARANTINE (403), GRANT_REQUIRED (403), DEDICATED_ROUTE (403). Existing role, hold, membership, generation, idempotency and revision errors continue to apply.
# Live connection extension

Release 0.6 adds `/api/connections`; its closed request schemas, role rules, actual network behavior and limits are described in `SELF_SERVICE_CONNECTIONS.md`. Existing `suite.connector.*` commands remain explicit simulators and never send live requests.
