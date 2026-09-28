# Additive contract decisions for 0.1

The saved pack remains the baseline. Source migrations 001 and 002 and the full OpenAPI specification retain their original content. This application adds migrations 003/004 and a separate `runtime-openapi.json` covering only activated operations.

| Issue found during coding | Resolution |
| --- | --- |
| Draft POST/PATCH had no event variants | Add closed `CreateDraftCommitted` and `UpdateDraftCommitted` events with the existing reference-only receipt payload. Total registered event variants: 46. |
| PATCH smoke scenario required retry safety but its path omitted the header | Require `Idempotency-Key` for PATCH and include it in runtime OpenAPI. Mutation keys use 16–128 ASCII letters, numbers, dot, underscore, colon or hyphen. |
| Creation lacked an exact bounded delegation record | Add `programme_creation_scopes`, editable only by trusted policy. The API can insert only its own new programme scope under a restrictive RLS policy. |
| Snapshot keys alone did not persist reviewable bytes atomically | Add immutable `resource_snapshot_bytes` with a database SHA-256 validation trigger. Version metadata and canonical bytes commit with the business write. |
| Safe HTTP replay needed the original response, including after later edits | Add immutable `operation_results`, keyed to the receipt. Recheck current access and holds, then replay the original status/body/version. |
| Country replacement would require forbidden DELETE | Preserve historical country rows with `retired_at`; the current set consists of non-retired rows. API receives only that column's update privilege. |
| SQL hold enum differed from the API | Preserve legacy database hold values and add the public `clinical`, `legal`, `governance` vocabulary. No silent translation of legal into retention. |
| Read locks on identity rows would otherwise require broad UPDATE grants | Add `lock_current_identity(uuid)`, a fixed-search-path security-definer function bound to current tenant/principal. Public execution is revoked. |
| Frontend needed the current membership and permissions without guessing roles | Add closed `/v1/session` and `/v1/resources/ORG/{id}/restrictions` projections. Restrictions disclose type/time, not safety narrative. |
| `format: date-time` is enforced by jsonschema only when `rfc3339-validator` is installed, and it was only a development dependency; a naive timestamp reached the date comparison and produced a 500 | Parse `starts_at`/`ends_at` in code as RFC 3339 with a mandatory offset and answer 422/`E_VALIDATION` (`code: format`). Add `rfc3339-validator` to the runtime requirements; the hashed locks must be regenerated with `uv pip compile`. |
| Every unique violation was reported as a duplicate programme code, and constraint, privilege and row-security failures advertised a retry | Map by constraint name: `programmes_tenant_id_code_key` is 422/`E_SEMANTIC` with `/payload/data/code`; other unique violations 409/`E_GATE_BLOCKED`; check, not-null and foreign-key violations 422 without retry; privilege/RLS denial 500 without retry. Transient failures remain 503 with `Retry-After`. The error envelope is unchanged. |
| Country replacement retired every existing row again, including already retired and unchanged ones | Retire only active rows that leave the set, leave rows that stay untouched and reactivate a returning country in its single row. |
| A dead-lettered event never reaches the inbox, so later events of the aggregate failed the gap check in every run without advancing `attempt`/`next_attempt_at` | Park a gap with the contract retry schedule (1, 5, 30, 120, 600 seconds) and dead-letter it when exhausted. The delivery states allow no separate blocked marker, so no schema change is made. |

Resource PATCH still replaces the complete payload when supplied; omitted fields remain unchanged. Server-owned identity, state, version, classification and kind are not editable through PATCH. Unchanged code/ownership must be supplied in a full payload; changing them is rejected until the corresponding governed workflow exists.

Creation and patch use strong `"vN"` ETags. Missing PATCH precondition is 428, stale version is 409, a reused key with changed intent is 409, closed schema or business-field validation is 422, and undiscoverable records are 404/E_UNAVAILABLE. Currently disabled commands consistently return 409/E_CAPABILITY_DISABLED after authentication.

Receipts are never automatically deleted. The first seven days support the required replay contract; older keys remain reserved conservatively until a reviewed retention procedure exists. This avoids duplicates after expiry. No retention/compliance claim is implied by indefinite local fixture storage.

The runtime implements bearer authentication only. Session-cookie/CSRF alternatives in the full source contract are not advertised by the runtime subset. Development sign-in is a separate, loopback-only synthetic helper, disabled outside development/test; no application endpoint accepts unsigned fixture UUIDs as credentials.

The native migration/connection functions use the same SQL and API code as embedded tests. Only embedded development uses fixed `SET LOCAL ROLE` statements and a process lock because its transport lacks independent native sessions. It is rejected at staging/production configuration validation.
