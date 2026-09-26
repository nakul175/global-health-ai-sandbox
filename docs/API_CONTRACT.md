# Hosted test API 0.2

This adapter has its own API. It does not claim wire compatibility with the preserved native `/v1` OpenAPI specification.

- `GET /api/workspace?tenant=aster|beacon|cedar`: requires hosted identity and an active `X-Test-Profile`; returns current `revision`, redacted `records`, latest 100 `audit` entries, active profile and test selectors. Every record has id, kind, title, status, integer version, body, createdBy, createdAt and updatedAt. `ETag` is the quoted institution revision. No response includes raw rows or issued bytes.
- `POST /api/commands?tenant=...`: requires hosted identity, same-origin `Origin`, JSON content type, quoted positive `If-Match`, and `Idempotency-Key` of 16–128 ASCII alphanumeric / `_.:-` characters. Body is exactly `{action,data}`. All 25 action schemas are closed Zod objects in `lib/domain.ts`, with required fields, enums, bounds and dates. Unknown properties and coerced numbers are rejected. Request body is bounded to 180,000 bytes. CSV text is at most 150,000 characters, with the transport byte bound applying as well.
- Mutation receipt: `{commandId,revision,recordIds,action,replayed}`. Reusing a key with identical canonical action/data returns the original receipt. Changed intent returns 409. Current rights and holds are checked before historical replay. Frontend preserves keys across network retries, rotates them on input changes and explicit conflict review.
- `GET /api/export?tenant=...&id=...`: current role, membership, safety and grant checks; only issued evidence. Exact frozen JSON attachment, `X-Content-SHA256`; no-store. Withdrawn or unavailable evidence returns 404.
- `GET /api/health`: bounded readiness query, no business records returned.

Errors are `{error:{code,message}}`. 400 malformed JSON; 401 missing identity; 403 forbidden/revoked/unverified/invalid origin/missing rights; 404 unavailable; 409 transition, version or intent conflict; 413 body bound; 415 media type; 422 schema/CSV/header validation; 423 safety hold; 428 missing version precondition; 503 unavailable. No wildcard If-Match, numeric coercion, arbitrary nested request fields or direct client-set status is supported.

The dispatcher owns sign-in and strips/sets trusted identity headers. The application must not be exposed directly without that trusted edge. API test harnesses use explicit synthetic identity headers against a local, private Worker only; no hosted identity bypass is implemented.

Entity definitions, exact command schemas, action-to-role matrix, transition checks and metric calculations are executable in `lib/domain.ts`. Storage mappings and canonical receipts are in `lib/store.ts`. Dataset rows never appear in the browser data projection. Support sees only institution, memberships, concerns and holds, with no audit list.
