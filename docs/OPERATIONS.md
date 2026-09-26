# Test deployment and operations

For 0.5.0 signing, encrypted checkpoints and the tested isolated recovery procedure, use `ASSURANCE_0_5.md`. The original recovery limitation below is historical; production regional recovery and RPO/RTO remain unverified.

This deployment is owner-private. Opening the hosted URL requires ChatGPT sign-in with the owning account. Keep that audience until the owner explicitly requests sharing.

## Development

Use the pinned pnpm lockfile and the Site build integration. `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Runtime bindings are declared in `.openai/hosting.json`; DB is required. No environment secret is required for the fixed evaluator. No app-owned login keys exist.

D1 migrations are generated from `db/schema.ts`. Apply once, in journal order. Deployed migrations are immutable. Future changes must use new migrations and maintain backward-compatible reads during deployment. Do not recreate tables in request handlers; `seed()` inserts synthetic fixture data only.

Local HTTP verification: build first, then run `pnpm test:http`. The harness now creates a disposable local D1 database, applies every checked-in migration in order, starts and stops the actual built Worker and writes `verification/http-tests.json`. Identity headers belong only to synthetic local fixtures and cannot establish hosted access.

Release 2 uses additive migration `0001_long_young_avengers.sql`. Run history and evidence survive application rollback. Do not delete tables to roll back. A 410 after ecosystem reset requires selecting the current generation; a 429 lab quota requires reusing existing scenarios/environments or a planned capacity change. Reset does not delete historical runs. A 409 INTEGRITY requires investigation of stored evidence; never repair it by silently recalculating a replacement hash.

## User support

- Unknown or revoked profile: switch to Alex, restore the synthetic membership, then reselect the intended role.
- Safety hold: switch to Noor and open Safety centre. Record a reason to release the hold after testing.
- Data grant expired/revoked: request a new purpose-bound grant and approve it as Sam.
- 409 conflict: preserve the draft, refresh current records, review the differences and submit again. Do not silently overwrite.
- Database unavailable: show recoverable error, preserve input and retry. Do not switch to browser-only storage.

## Rollback and recovery limits

Revert to a previous compatible source version and redeploy through the hosting service. Rollback must retain schema compatibility; never roll back a migration by deleting data. This test edition does not establish backup restoration, clinical record retention, production RPO/RTO, residency or SLA. Before clinical launch, implement and exercise the original operational runbooks using the intended production infrastructure.
