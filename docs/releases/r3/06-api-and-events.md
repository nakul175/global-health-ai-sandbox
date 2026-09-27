# API and event contracts

Status: design baseline. Machine source: [OpenAPI 3.1](contracts/openapi.json), [events](contracts/events.schema.json). These are proposed `/api/v3` routes; they are not deployed endpoints. Each stage freezes its contracts before independently implementing frontend/backend consumers.

## Transport

HTTPS; UTF-8 JSON. Organisation context is in the path. Authentication is a verified session or scoped service bearer token, with the transport adapter chosen at the identity gate. A caller-supplied organisation or actor never confers authority. Browser mutations require same-origin CSRF protection; bearer service APIs do not accept ambient browser credentials.

All command objects and nested structures reject unknown fields. Integers have explicit bounds, currency uses a three-letter ISO code plus configured decimal exponent, amounts are nonnegative integer minor units and rates are bounded decimal strings. Dates use full-date or UTC date-time as declared. UUIDs identify resources, snapshots and intents. JSON bodies are limited to 1 MiB except documented import/media endpoints; observation ingestion accepts one bounded record per request. The context-import endpoint permits up to 7 MiB JSON containing base64 for at most 5 MiB of decoded CSV.

Use `Idempotency-Key` (UUID) on every write. Scope to organisation + authenticated actor + key for 24 hours. Persist request path/method/hash and result reference. Same intent/body returns the same logical outcome (including operation ID); changed body/path with same key returns 409 `IDEMPOTENCY_CONFLICT`. Rights are rechecked on replay. Beyond retention, unique resource IDs still prevent duplicate creates; clients must query status before resubmitting an ambiguous external operation.

Updates/actions on existing resources require `If-Match: "vN"`. Missing header returns 428; mismatched current version returns 412 with the current ETag when readable. New resources start version 1. Reads return ETag. A state conflict with a current version is 409, distinct from stale data. Async start returns 202 plus operation resource and Location. Creation returns 201; synchronous transitions return 200.

## Pagination, sorting and filtering

Lists use `limit` 1–100 (default 25) and opaque `cursor` (max 2048 characters). Sort is fixed `(createdAt DESC, id DESC)`. Cursor binds organisation, filter set and last key, expires after 24 hours and is authenticated by the server. Changed filters or invalid cursor return 400. New records do not cause duplicates within a cursor walk; no snapshot-consistency claim across mutable records. Response is `{items, nextCursor}` where `nextCursor` is null at end. Totals are omitted to avoid false precision or hidden-row disclosure.

## Error contract

All errors use `{error:{code,message,requestId,fieldErrors,retryAfterSeconds}}`; nullable fields are explicit and `fieldErrors` contains only safe field paths and messages. Never include stack traces, tokens, raw supplier bodies or hidden labels. HTTP status and stable enum code must agree.

| Status | Codes and handling |
|---|---|
| 400 | `BAD_REQUEST`, `INVALID_CURSOR`: correct input |
| 401 | `UNAUTHENTICATED`: renew verified session |
| 403 | `FORBIDDEN`, `HOLD_ACTIVE`, `CONFLICT_OF_INTEREST`: no blind retry |
| 404 | `NOT_FOUND`: includes cross-organisation hidden objects |
| 409 | `STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `DUPLICATE_EVENT`: inspect current state |
| 410 | `EXPIRED`: obtain a fresh grant/invitation |
| 412 / 428 | `VERSION_CONFLICT` / `PRECONDITION_REQUIRED` |
| 413 / 415 / 422 | `PAYLOAD_TOO_LARGE` / `UNSUPPORTED_MEDIA_TYPE` / `VALIDATION_FAILED` |
| 429 | `RATE_LIMITED`: obey Retry-After |
| 502 / 503 / 504 | `PROVIDER_FAILURE` / `UNAVAILABLE` / `TIMEOUT`: reconcile before replaying effects |

An operation status can be `failed`, `blocked` or `unknown` even when the status-read HTTP request returns 200. A response code alone does not establish a passed evaluation.

## Endpoint coverage

The OpenAPI file defines typed lists, creates, reads and action endpoints for organisations/memberships, programmes, contexts, submissions, protocols, runs, budgets, evidence packs, adapters/tests, pilots/observations, alerts and registry shares. Resources carry schema-specific `data`, an explicit status enum, IDs, version and timestamps. Generic open `object` payloads are not permitted. Semantic rules in this document, the FSD and access matrix remain mandatory beyond JSON Schema validation.

## Event delivery

Envelope: UUID eventId, versioned type, occurredAt, orgId, actorId, correlationId, aggregateId, aggregateVersion and typed payload. No secrets or raw clinical records. Supported events cover protocol freeze, run state change, budget calculation, evidence issue/withdrawal, connector test, pilot state change, observation receipt and registry sharing.

Transactional outbox guarantees an accepted write is paired with its event. Delivery is at least once; inbox dedupe gives idempotent consumption, not exactly-once transport. Preserve per-aggregate version order; when a gap is detected, pause that aggregate and retrieve missing state. No global ordering guarantee. Unknown event versions are quarantined with an alert; never parse them optimistically. Breaking payload changes get a new type/version and documented consumer transition.

## Files and resumable media

R3A reuses the existing bounded R2 resumable protocol only for its already-supported synthetic media. See [current workbench media contract](../../WORKBENCH_API.md). R3 does not quietly extend that contract to patient files. A new data class needs its own grant, scan, retention and evidence protocol before upload activation.

Committee export creation returns an operation; completed artifacts have size, MIME type and SHA-256. A separate grant action checks current rights and returns a URL valid for at most 300 seconds. Never put permanent artifact URLs in public events or supplier-visible records.

## Additional semantic validation

Context unknown values are null and block dependent calculations; source maps resolve to the provided source IDs. Budget input source maps identify the source of every quantity. Observation value is null exactly when quality is missing; accepted/suspect values are nonnegative decimal strings and their unit must match the pilot indicator. CSV preview is mandatory before commit; commit must present the matching preview digest and identical bytes, organisation and programme version. Completed export operations expose artifact metadata; only the separate authorised grant action returns download URLs.

Access-grant requests cannot grant the caller new rights: approval requires authority to delegate the requested action/data scope and a distinct grantee where independent approval is required. Diagnostic grants expire within four hours; other durations are institution-policy bounded. Safety-hold creation is immediately effective for the scoped programme; resolution requires a distinct authorised safety reviewer and satisfied resumption criteria. Frozen manifest digests hash the canonical content excluding their own digest field; resource digests hash the canonical data payload, with linked manifests bound explicitly at review/issuance.
