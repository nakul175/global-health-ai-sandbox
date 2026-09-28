# Low-level design — executable hosted profile

Edition 1.1, baseline 870b49a343f1207b8cefbecdbfb0c5c5d10c955a. Exact schemas are linked rather than replaced with permissive pseudocode.

## Identity and policy

app/chatgpt-auth.ts reads dispatcher-controlled authenticated identity. lib/http.ts requires it for protected endpoints and resolves the selected synthetic institution/profile. lib/store.ts scopes persistent records by server-derived owner/institution. lib/domain.ts checks active membership, allowed role, institution verification and safety hold before executing a command.

Current separation-of-duty checks compare synthetic person IDs. Switching to another profile of the same person does not establish independence, and switching to a distinct synthetic person still does not establish real institutional review.

## Workspace command sequence

~~~mermaid
sequenceDiagram
  participant UI as Browser
  participant API as Commands route
  participant Store as Scoped store
  participant DB as D1
  UI->>API: closed action/data, revision, intent key
  API->>API: owner, Origin, content type and schema
  API->>Store: current scope and validated command
  Store->>Store: membership, role, hold, rights and receipt
  Store->>DB: conditional revision + atomic writes
  alt revision accepted
    DB-->>Store: records, snapshots, audit, receipt committed
    Store-->>UI: resulting revision and record IDs
  else conflict
    DB-->>Store: no accepted competing effects
    Store-->>UI: conflict or authorised identical-intent receipt
  end
~~~

The current core has 68 closed command definitions: 25 core, 14 lab and 29 workbench. Three media actions are internal-only, leaving 65 public workspace command variants. Connections use a separate six-action discriminated schema. See [exact inventory](CURRENT-API-INVENTORY.md) for definitions, roles and entry points. Route-specific authorization remains authoritative.

## Persistence and records

spaces owns the owner/tenant key and monotonic revision. records, lab_records and suite_records hold typed versioned JSON bodies. Each family has an immutable snapshot table. audit and receipts preserve committed attribution and intent. live_connectors and connector_calls hold configuration, encrypted credential envelopes, versioned activation and bounded outcomes.

The [data dictionary](CURRENT-DATA-DICTIONARY.md) provides every SQL column, constraint and migration. JSON payload validation belongs to the domain schemas; table JSON validity is not a substitute. Mutations use conditional atomic batches; object writes require compensation because the object store is outside the SQL transaction.

## Synthetic computation

The lab pins generator/recipe/model/scenario inputs. Seeded generation produces linked fictional records and reproducible PCM16 waveforms. Inference reads RMS and zero-crossing features, then executes bounded logistic or forest parameters. Imported probabilities are declared outputs and do not attest execution of the caller's model.

Virtual time drives screening/referral/laboratory/callback events, with duplicate/outage/slow/lost conditions and recorded assertions. Reset increments generation and fences stale operations while keeping history. Participant partitions, paired differences, exact McNemar probability and bootstrap estimates are synthetic analysis tools; they are not medical validation.

## Jobs and media

Jobs progress through queued/running/failed/completed/cancelled with a five-minute lease and increasing epoch. Commit requires current worker/epoch and authority. A person manually claims/processes work; no background infrastructure is implied.

Media uses canonical PCM16, per-part/full SHA-256, 32 KiB parts and a 500,000-byte maximum. Finalise verifies bytes before quarantine; a different custodian releases the media. Playback, inference and export require their own current grants. Direct submission of internal upload/finalise/result actions is rejected.

PR #13 adds rejected-part cleanup and a post-delete metadata recheck; the residual compensation race is documented in [workbench API](../WORKBENCH_API.md). There is no production orphan sweeper.

## Live connectors and secrets

Destination policy accepts public HTTPS/443, excludes literal/private/self destinations and redirects, and depends on the standalone Worker network boundary. The mapping schema is closed; array transforms, custom scripts and arbitrary fields are absent. Secrets use AES-GCM with connector/workspace-bound authenticated data and do not appear in normal projections.

A successful version-matched recent test precedes activation. One running call per connector is enforced in SQL. Quotas are insert conditions, not count-then-insert checks. Changes/disable fence results; already-sent requests may continue externally. No automatic retry turns an unknown outcome into a second effect. Full contracts are in [connections](../SELF_SERVICE_CONNECTIONS.md).

## Evidence and recovery

Evidence issuance binds exact stored JSON and digests; correction creates a successor and supersedes prior availability. Optional application P-256 signatures are created at export and verified against a separately trusted key. They do not prove current issuance status or institutional approval.

Checkpoints capture scoped tables and immutable referenced media, encrypt with AES-GCM, and validate hashes/audit/bytes. Restore writes only an isolated empty target. Five retained checkpoints are a bounded cap with a documented concurrent-creation caveat; no automatic deletion, key rotation, independent escrow or production cutover exists.

## Target contracts remain separate

The original regional /v1 and synthetic /v2 design are not the hosted transport. Proposed [government LLD](../releases/r3/04-lld.md) and [API](../releases/r3/06-api-and-events.md) introduce their own stable person identities, organisation policy, leased outbox work and exact-version evidence. Freeze those contracts and apply additive active migrations only when the corresponding implementation begins.
