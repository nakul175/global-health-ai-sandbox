# Release 2 assurance increment — 0.5.0

Historical 0.5.0 scope. Release 0.6 adds self-service live JSON prediction/service connections and includes their two tables in checkpoints; see `SELF_SERVICE_CONNECTIONS.md`. Institutional and production acceptance gaps remain.

26 September 2026. This release closes application-level signing and recovery implementation gaps. It does not close infrastructure, independent-identity or clinical acceptance gates.

## Implemented

1. Evidence downloads optionally carry a real ECDSA P-256/SHA-256 signature. The signature covers the exact evidence digest, workspace, record, kind, application key fingerprint and export signing time. Both original and Release 2 report endpoints retain current role, grant, hold and issuance checks. Altered evidence is rejected before export.
2. The Evidence screen downloads signed bundles and the public key, and verifies bundles locally against a separately supplied trusted public key. Embedded keys are not automatically trusted. Application signatures do not represent institutional reviewer signatures. A valid downloaded signature does not establish that the report remains issued, the grant remains valid or the key remains trusted.
3. Administrators can capture encrypted checkpoints of all nine application tables, including complete audit, snapshots, receipts and referenced uploaded audio chunks. Database tables are read in a single D1 batch. Audio keys are immutable content-addressed references from that snapshot. Missing or altered objects fail capture.
4. Checkpoints are encrypted with AES-256-GCM and a new random 96-bit nonce, with workspace ID as authenticated additional data. The 16 MiB plaintext limit is enforced. Server-side verification authenticates and decrypts the archive, verifies scope, record/snapshot digests, continuous audit sequence and exact media bytes. This does not overwrite live state.
5. The offline recovery command restores only to a new/empty local directory and migrated SQLite database. Database inserts are transactional. Existing rows or colliding objects are rejected. A failed restore may leave audio in its disposable target; discard the failed isolated target through the normal operator process before another attempt. There is no destructive production restore endpoint.
6. The existing built-Worker suite now exercises signature and checkpoint APIs, eight concurrent identical intents, eight competing writes, and a measured local read workload.

No database migration or dependency upgrade is introduced in this increment. Runtime secrets are configured separately from source and are not embedded in deployment archives. The public signing key is retained in `application-signing-public-key.json` for comparison/pinning through a trusted distribution channel.

## API additions

Every endpoint requires the hosted authenticated user, a valid synthetic tenant and active selected test membership. The selected test role is not an independently authenticated person.

| Endpoint | Contract |
|---|---|
| `GET /api/suite/signing?tenant=aster` | Active member. `{configured, purpose}` when unavailable; otherwise adds `algorithm`, `keyId`, `publicKey` with only `kty`, `crv`, `x`, `y`. No private material. |
| `GET /api/export?id=…&signed=1` and `/api/lab/export?id=…&signed=1` | Existing report authorization applies. Returns `{statement, signature, publicKey, evidence}`. `evidence` is the exact original JSON string, `signature` is base64 IEEE-P1363 ECDSA bytes. `X-Content-SHA256` hashes the entire returned bundle. Without `signed=1`, existing exact-byte exports remain unchanged. |
| `GET /api/suite/checkpoint?tenant=aster` | Administrator only, no active hold. Returns up to 100 checkpoint metadata entries and an explicit `truncated` flag. No plaintext tables or references. This bounded release does not implement catalogue pagination. |
| `POST /api/suite/checkpoint?tenant=aster` | Administrator, matching Origin, quoted current `If-Match`, UUID `Idempotency-Key`. No request body. Captures and encrypts current workspace and referenced media, using that UUID as an immutable object key. Repeated UUID returns the existing checkpoint; creation uses conditional object put. Conflicting revision fails. |
| `GET /api/suite/checkpoint?tenant=aster&id=UUID` | Same administrator/hold checks. Downloads the encrypted archive only. Another workspace/owner cannot access it. |
| `PATCH /api/suite/checkpoint?tenant=aster&id=UUID` | Same checks plus matching Origin. Decrypts and validates; returns revision, per-table counts, audio chunk count and content hash. Does not restore live data or mutate the source. |

The signed statement has exactly these generated fields: `format="sandbox-export-attestation-v1"`, `algorithm="ECDSA-P256-SHA256"`, `keyId`, `spaceId`, `recordId`, `kind`, `sha256`, `signedAt`, `purpose`. SHA-256 fields are lowercase hexadecimal. Canonical JSON recursively orders object keys; signing and verification use UTF-8 bytes of that canonical statement. Signing happens at export, not at historical issuance.

Checkpoint errors include `CHECKPOINT_UNAVAILABLE`/`CHECKPOINT_KEY_UNAVAILABLE` (503), `CHECKPOINT_INCOMPLETE`/`CHECKPOINT_INTEGRITY`/`INTEGRITY`/`VERSION_CONFLICT` (409), `CHECKPOINT_LIMIT` (413), `CHECKPOINT_ID` (422), `FORBIDDEN`/`ORIGIN` (403), `SAFETY_HOLD` (423), and `UNAVAILABLE` (404). Signing without configuration fails with `SIGNING_UNAVAILABLE` (503); it never silently returns an unsigned success.

## Recovery and key runbook

Runtime settings:

- `EVIDENCE_SIGNING_JWK`: private P-256 JWK, marked secret. Corresponding public key and SHA-256 fingerprint are accessible to authenticated members.
- `CHECKPOINT_KEY_HEX`: 32 random bytes encoded as 64 lowercase hexadecimal characters, marked secret. Never expose it through application APIs, logs, repository or browser.

Independent key escrow is **not provisioned**. This prevents claiming disaster recovery. An authorized infrastructure operator must arrange secure key escrow and independent backup retention before relying on these archives outside the current service. Runtime secrets and archives in one provider are one failure domain.

To exercise offline recovery, provide an encrypted archive and its escrowed checkpoint key through the operator's secret environment, then run from the repository:

```bash
node scripts/restore-checkpoint.mjs /path/checkpoint.json /path/new-isolated-recovery
```

The command reads `CHECKPOINT_KEY_HEX` from the environment; do not place its value in a shell command, document or ticket. It creates `workspace.sqlite`, an `objects/` tree and `recovery-result.json`. Compare counts, hashes and media bytes before considering any separately authorized production cutover. The command has no production connection and performs no cutover.

For signing-key compromise, restrict evidence export, record affected key fingerprint and time interval, preserve incident evidence, provision a replacement secret, publish its public key through a trusted channel and redeploy. Offline signature verification cannot discover key revocation; a revocation registry and institutional trust service remain absent.

Do not replace the checkpoint key until old archives have secure key escrow or have been re-encrypted and verified under a replacement key. There is no automatic key rotation, retention scheduler or key-recovery service. Application rollback retains additive tables, R2 objects and compatible secrets. Never delete live tables or objects to roll back.

## Threat model and residual boundaries

| Abuse path / boundary | Implemented control and evidence | Remaining boundary |
|---|---|---|
| Browser to private dispatcher | Hosted owner access; anonymous API denial; no added login bypass | Internal browser preview cannot run hosted sign-in |
| Owner/tenant/role crossing | Owner-derived space keys; scoped SQL/R2 keys; active membership and role checks; HTTP cross-owner/tenant tests | Test-person chooser is a simulation; true institutional multiuser membership absent |
| Forged evidence or key substitution | Exact digest plus signed statement; verification against a separately trusted key; tamper tests | No institutional PKI, trust registry, revocation lookup or protected signing hardware |
| Backup exposure or modification | AES-GCM authenticated encryption and workspace binding; no plaintext download route; integrity tests | No independent escrow/region/retention service; same application can use the encryption key |
| Destructive restore | Only isolated empty target; collision refusal; database rollback tests; actual CLI test | No production restore/cutover/reconciliation exercise |
| Duplicate or competing commands | Idempotency receipts, optimistic revisions, atomic transactions; concurrent HTTP tests | Synthetic bounded profile; no regional coordination/load SLA claim |
| Malicious model/media | Closed portable forest parameters; bounded canonical WAV validation; quarantine and grants | No arbitrary container isolation, GPU service or malware scanner |
| External destination abuse | Current connector fixtures send no external requests | Live EHR/model adapters need authenticated destinations and restricted egress |
| Reference-label disclosure | Normal projections omit references; support is scoped; checkpoints encrypted | Labels and scorer share one Worker/database; no independent reference vault |

## Unclosed production gates

| Gate | Concrete dependency |
|---|---|
| Real cough/EHR integration | Actual model artifact or API contract, approved endpoint and credentials; interoperability environment |
| Autonomous model/GPU execution | Worker/queue/GPU infrastructure, limits, monitoring and approved runtime/image |
| Real institutional identities | Identity provider and institution membership; independently authenticated reviewers |
| Malware scanning | Deployed scanner, update process and quarantine integration |
| Institutional signing | Institution-controlled signing authority and trusted reviewer identity |
| Regional disaster recovery | Independent key escrow, backup retention, second environment and measured restore/cutover |
| Production assurance | Intended deployment profile, authenticated browser journeys, accessibility audit, independent security assessment and representative load |
| Clinical use | Appropriate data, model validation, governance and clinical acceptance; synthetic signals cannot establish this |

These are blockers or unimplemented services, not passed fixture outcomes.
