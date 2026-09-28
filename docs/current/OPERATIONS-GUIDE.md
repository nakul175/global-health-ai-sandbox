# Operations guide — development and bounded hosted alpha

Edition 1.1. Follow the actual deployment profile, not a mixture of the native PostgreSQL and hosted Worker procedures.

## Build and local verification

Use the package.json engine (Node at least 22.13.0), pinned pnpm 11.25.0 and checked-in lockfile. From the repository:

~~~sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm test:http
~~~

pnpm verify runs the required sequence. The HTTP harness provisions disposable local D1/R2, applies migrations, starts the built Worker, performs checks and stops it. It does not operate on hosted records or complete hosted ChatGPT sign-in. Keep its identity-header fixtures confined to that isolated harness.

The development launcher depends on the configured execution profile; ordinary local preview does not establish trusted hosted authentication. Do not invent a login bypass or expose a server that trusts caller-supplied owner headers. Native local development uses the separate [native README](../../native-baseline/README.md).

## Deployment configuration

.openai/hosting.json identifies the existing Site and the DB/MEDIA bindings. Reuse that Site for authorised future deployments. D1 DB is required; MEDIA backs uploaded audio and checkpoints. EVIDENCE_SIGNING_JWK and CHECKPOINT_KEY_HEX are protected runtime secrets, never source.

Deploy only a reviewed exact candidate after its applicable checks. Confirm journal-order additive migrations 0000–0003 and compatibility; preserve the existing bytes. Record build/source and actual deployment identity, migration checksums, verification and rollback target. A GitHub documentation merge alone does not deploy.

## Back up, verify and recover

Capture an encrypted workspace checkpoint through the administrator endpoint and verify it. This includes the eleven current tables and referenced audio, including encrypted connection credentials. Independent retention and key escrow must be arranged separately before relying on it for a provider loss.

For isolated recovery, provide the checkpoint key through the authorised secret environment and run:

~~~sh
node scripts/restore-checkpoint.mjs /path/checkpoint.json /path/new-isolated-recovery
~~~

Use an empty destination. Compare database counts, audit continuity, hashes and media bytes. A failed isolated attempt may leave disposable output; preserve evidence and handle cleanup through the operator process. The command performs no production cutover.

Historical checkpoints with nine tables are supported with empty connection tables. Restored running calls must be reconciled as unknown, not automatically resent. Do not rotate the checkpoint key before older archives are escrowed or re-encrypted and verified.

## Fault handling

| Condition | Operator action |
|---|---|
| D1 unavailable | Fail protected work closed, preserve draft inputs, inspect binding/service; no browser-only replacement data store |
| Stale revision | Refresh authorised state and review; do not silently replay with a new intent |
| Job failed/lease lost | Inspect current epoch/rights; use the explicit retry/claim path rather than publishing a stale worker result |
| Provider timeout | Inspect recorded call outcome, reconcile remotely if supported; new attempt requires separate authorised intent |
| Suspected secret exposure | Disable connector, revoke/rotate at provider, replace and retest; preserve redacted incident metadata |
| Evidence integrity mismatch | Quarantine/restrict export and investigate source bytes, snapshots and signing trust; never repair by replacing only the digest |
| Media cleanup failure | Inspect referenced object/metadata carefully; no automated production orphan sweeper is present |
| Checkpoint limit reached | Use the documented authorised object-store process; no application deletion/rotation endpoint exists |

## Rollback and acceptance

Redeploy a compatible prior application source while retaining additive schema, objects and compatible secrets. Do not drop tables or remove historical media as a rollback shortcut. Database migration rollback, region loss, independent escrow and production cutover need their own environment-specific evidence.

Operational exercises in the workbench are simulations. The backup_restore exercise is a falsifiable in-process metadata consistency check, not physical restoration. Current acceptance does not establish production SLA, RPO/RTO, regional failover, live customer connector qualification or independent penetration/accessibility results.

Detailed current references: [assurance](../ASSURANCE_0_5.md), [connections](../SELF_SERVICE_CONNECTIONS.md), [workbench API](../WORKBENCH_API.md), [qualification](../QUALIFICATION.md).
