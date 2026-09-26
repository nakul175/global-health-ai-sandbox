# ADR 009: first executable vertical slice

Status: accepted for local implementation; production gates pending.

Implement one small, complete programme workflow before broad module activation. Reuse the typed relational schema and closed API contracts, add only the missing execution-level details, and keep disabled capabilities visible in the source backlog rather than as nonfunctional interface controls.

Use FastAPI, direct parameterized psycopg queries and JSON Schema request validation for this slice. This keeps runtime validation aligned with the supplied contract and makes transaction, row-lock and authorization boundaries reviewable. Introduce connection pooling and generated SDKs only with measured need and appropriate tests.

Use React/TypeScript for a same-origin interface. Keep bearer tokens and unsaved drafts in memory. A local-only RSA issuer makes synthetic workflows reproducible, but it cannot substitute for production OIDC/PKCE, actual MFA, verified people or privileged support sessions.

Use embedded PostgreSQL for development where native processes are unavailable. The same migrations and driver protocol execute real SQL, constraints and RLS. Serialize local transactions to respect its single backend. Supply a native PostgreSQL 18.6 CI gate with restricted logins and concurrent HTTP assertions; do not count embedded results as native security or recovery evidence.

Persist canonical snapshots inside PostgreSQL for this small metadata workflow so version, bytes, hash, audit and outbox remain atomic. Large media and clinical objects still require the regional object-storage and quarantine protocols in S03. This decision does not enable patient data ingestion.
