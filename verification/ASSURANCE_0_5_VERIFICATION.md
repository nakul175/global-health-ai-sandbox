# Assurance verification — 0.5.0

Executed 26 September 2026.

| Check | Result |
|---|---|
| TypeScript and production Worker/client build | Passed |
| Unit, SQLite integration and operator recovery CLI | 90 passed; zero failures or skips |
| Built-Worker HTTP, integration, concurrency and smoke | 37 passed; zero failures |
| Measured local read workload | 60 requests, concurrency 6, zero errors; p50 75.69 ms, p95 90.78 ms, max 94.13 ms |
| Browser unauthenticated gate | Sign-in page displayed; hosted sign-in route unavailable in internal preview (404) |
| Authenticated browser, accessibility and real-user journey | Blocked/unverified; no authentication bypass introduced |
| Production load, independent penetration testing, regional failover | Not executed |

Evidence files: `r2-unit-integration.xml`, `http-tests.json`, `local-performance.json`. The local timing numbers are observations from one disposable synthetic test process, not production latency or capacity commitments.

Recovery testing actually rebuilds an empty SQLite database with every application table and exact referenced audio bytes, and runs the supplied operator CLI against an encrypted disk archive. Negative cases cover populated targets, object collisions, missing or corrupt media, altered snapshots, missing audit entries, cross-workspace envelopes, wrong keys, ciphertext tampering and injected transaction failure. It does not test loss of the hosting region, independent key recovery or production cutover.

Signing tests verify exact exported bytes against a separately trusted public key and reject evidence, signed-metadata, signature and trust-root changes. Real HTTP checks verify that private key material is absent from the public-key endpoint and that existing access/hold checks protect the new checkpoint routes.
