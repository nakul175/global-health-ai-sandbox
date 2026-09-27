# Low-level design

Status: proposed implementation design. Names below are intended new modules, not assertions that files already exist.

## Module and repository layout

| Proposed location | Responsibility |
|---|---|
| `lib/government/policy.ts` | Principal, membership, conflict, purpose and field authorisation |
| `lib/government/contracts.ts` | Validators generated/implemented from closed OpenAPI schemas |
| `lib/government/repository.ts` | Organisation-required queries, composite keys and transactions |
| `lib/government/programmes.ts` | Profile validation, import and version snapshots |
| `lib/government/evaluation.ts` | Protocol freeze, run manifest, metrics and eligibility |
| `lib/government/economics.ts` | Decimal/integer-safe cost calculation and scenario comparison |
| `lib/government/evidence.ts` | Pack state machine, independent review, issue and correction |
| `lib/government/jobs.ts` | Leases, fencing, outbox dispatch, retry classification |
| `lib/government/integrations.ts` | Adapter registry, egress and contract-test execution |
| `lib/government/pilots.ts` | Observation dedupe, event-time windows, alerts and pause |
| `lib/government/registry.ts` | Controlled sharing and transferability |
| `app/government/` | Accessible institution-focused screens |
| `tests/government/` | Unit, policy, database, worker HTTP and browser acceptance |

## Principal and policy

Principal contains `issuer`, immutable `subject`, stable `personId`, session expiry and authentication strength. Identity verification validates signature, issuer, audience, expiry and nonce/state as applicable. Membership resolves `orgId`, role, status and scoped assignments. Do not trust role claims that have not been mapped to the organisation's current membership record.

Order: authenticate → enforce organisation membership → load org-scoped resource → check hold/archival → check action/assignment → check purpose/data class → conflict/separation of duty → field projection. Unknown cross-org IDs return 404, while denied actions on a known accessible object return 403. A valid session without active membership grants no access.

All repository methods require an explicit server-validated `OrgScope`. No global `getById(id)` helper is allowed for organisation-owned entities. Composite foreign keys prevent an object in organisation A referencing a parent in B even if the application omits a check.

## Write algorithm

1. Parse bounded JSON and reject unknown fields and invalid enums.
2. Authorise against current membership, assignments and holds.
3. Canonicalise the validated body and calculate SHA-256; exclude transport headers.
4. Locate receipt by organisation, verified actor and idempotency key. Same key/different route or body returns 409. Same request replays only after checking current read/operation rights.
5. Validate `If-Match` against the persisted integer version; missing is 428 and stale is 412.
6. Atomically compare-and-update the row; write snapshot, audit, receipt and outbox if needed. A failed comparison rolls back all effects.
7. Respond with a versioned resource or durable operation reference; no external calls occur inside the database transaction.

First writes use version 1. Each accepted mutation increments version exactly once. Creation uses a unique client-generated UUID; create retries do not allocate duplicates. Timestamps are UTC RFC3339; programme display uses its configured IANA time zone.

## Freeze and provenance

Protocol freeze serialises canonical JSON with lexicographically sorted object keys, original array order, UTF-8 strings and no insignificant whitespace. Quantities use specified decimal strings or integers; NaN/Infinity are forbidden. Hash bytes with SHA-256. A manifest includes context, cohort, model and price digests, protocol version, scorer/calculator version, adapter version and evidence class. Server verifies digests against stored bytes before accepting the freeze.

Changing any pinned dependency creates a new manifest. Existing results retain their original dependencies and show `stale_for_current_draft`; they are not rewritten. External model version verification has states `verified_digest`, `supplier_declared`, `unverifiable`. Only the first supports an artifact-equivalence claim.

## Jobs and outbox

Jobs contain state, attempt, lease owner, lease expiry, fencing counter, cancellation request and result digest. Claim uses compare-and-swap; proposed lease 60 seconds with heartbeat every 20 seconds. Every accepted write carries the current fence. Expired workers cannot publish results. Chunk work so it can checkpoint before the lease expires; enforce adapter-specific timeouts independently.

Outbox delivery is at least once. Event IDs are unique; consumers keep an inbox of processed IDs. Retry transient internal failures with exponential delay (1, 2, 4, 8, 16 seconds, then dead-letter after 5 attempts). Do not retry an externally ambiguous operation by this generic policy. An explicit reconciliation command records provider status or `unknown`; a new attempt requires a new intent when safety/idempotency cannot be established.

Cancel sets `cancel_requested`; worker checks before each transfer and after each response. A late result can be retained in restricted diagnostics but cannot move the accepted run to succeeded. An organisational hold prevents new dispatch immediately on the next policy check; already-sent provider calls cannot be retracted.

## Computation and results

Classification uses a pinned threshold: probability greater than or equal to threshold is positive. Results retain TP/FP/TN/FN, eligible/input/completed/error counts, coverage and failure categories. Metrics and intervals follow [method specification](17-evidence-and-economics.md). Cost computation uses decimal arithmetic or integer rational operations, never binary float currency accumulation. Intermediate expected counts are not prematurely rounded.

Low/base/high scenarios are independent explicit inputs. No undocumented probabilistic confidence is attached to these scenarios. Missing clinical performance blocks a clinical cost-effectiveness interpretation but may still allow a clearly synthetic workflow exercise.

## Evidence transitions

All transitions are allow-listed. Submission to review pins the exact pack hash. A review records reviewer person ID, conflict declaration, decision and reason. Approval from the author or contributor to the evaluated vendor is rejected. Issuance rechecks approvals and their scope, stores immutable bytes and their digest and writes `EvidenceIssued.v1` atomically with the outbox record. Export retries reuse the same artifact identity when inputs are unchanged.

Correction has a new pack ID and `supersedesId`; predecessor remains retrievable to authorised users with its superseded status. Download grants last at most 5 minutes and are bound to organisation, artifact and purpose; a fresh grant is required after access revocation. Public sharing never reuses private signed URLs.

## Observation ingestion

Scope service credentials to one organisation, source and allowed pilot. Unique key `(orgId, sourceId, sourceEventId)` deduplicates payloads; identical replay is acknowledged, changed payload with same event ID conflicts. Store `observedAt` and `receivedAt`. Late events are included in their event-time window and flag that window revised. Windows are not final until the declared lateness allowance passes; default 72 hours for the initial adapter, configurable only through a new pilot-plan version.

## Portability and compatibility

Adapters implement `validateConfig`, `test`, `execute`, `reconcile`, `redact` and `describeCapabilities`. Capability absence returns a specific unsupported/blocked result, never a fallback success. API v3 does not change v2 payload semantics. Database candidate migrations remain outside active `drizzle/` until their slice is implemented and promoted through review.
