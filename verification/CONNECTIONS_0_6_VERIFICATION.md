# Self-service connection verification — 0.6.0

Executed 26 September 2026. TypeScript, production build, 111 unit/integration checks and 41 built-Worker HTTP/smoke checks passed (152 total; zero failures).

New evidence includes an actual isolated local HTTP receiver receiving mapped WAV bytes, a test bearer credential and an idempotency header. The integration runs the real connector logic with an explicitly injected test transport that points to that receiver. Production uses native fetch and has no fixture endpoint override.

Negative cases cover nested contract fields, prototype/overlapping paths, literal/encoded IPs, private names, URL credentials/query strings, self destinations, response probability types/ranges, subject mismatch, redirects, non-JSON/invalid JSON/oversized responses, credential tampering or cross-scope decryption, absent secrets in projections/history, destination changes with retained credentials, expired activation tests, duplicate intents, concurrent calls, interrupted requests, in-flight disable, incomplete-cohort metrics, tenant/owner/role/hold checks and uploaded-media transfer grants. Checkpoints restore live connector and history tables with encrypted credentials intact.

The built-Worker HTTP suite exercises save, field/consent validation, inability to activate an untested connector, actual unsuccessful network execution, safe projections, tenant/role/Origin checks, credential rotation and disable. Existing tests continue covering the rest of the application. Machine evidence remains in `r2-unit-integration.xml` and `http-tests.json`.

**Not executed:** successful deployed connection to a customer public HTTPS provider (no customer endpoint or credential supplied), provider interoperability/certification, authenticated browser journey, independent network penetration assessment or clinical evaluation. Passing an isolated HTTP receiver test is not evidence that a particular hospital or model endpoint has been connected.
