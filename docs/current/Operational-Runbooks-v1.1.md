# Operational Runbooks — reconciled reading edition

Documentation edition **1.1**, 2026-09-28. Reconciled to repository source **870b49a343f1**: hosted alpha package 0.6.0 plus PR #13; deployment not requalified.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [10_Operational_Runbooks.md](../../native-baseline/specs/10_Operational_Runbooks.md).

# Operational Runbooks

These runbooks define the operational procedures required before production launch. Execute them with named owners, approved environment access and evidence linked to the candidate build. The platform is not yet deployed by this document package; rehearsal and measured recovery outcomes are launch gates.

## Operating roles and escalation
Assign an incident commander, operations responder, security owner, data custodian, clinical safety owner and communications owner with an on-call schedule. Identify a deputy for each. Clinical concerns route to the safety owner immediately; data disclosure and credential incidents route to security and custody. Support cannot improvise a data-access workaround.
Use safe correlation, tenant and resource identifiers in the incident system. Do not paste patient payload, secrets, full prompts or private evidence into chat or unrestricted tickets. External notifications follow the approved local incident process and authorized recipients; no universal notification deadline is assumed by this engineering document.

## Deployment and migration
Confirm the build digest, contract version, migration checksums, configuration, dependency report and fixture-derived acceptance results. Confirm compatible application rollback, a usable backup and the restriction-ledger recovery point. Check database health, capacity, lock impact and current incident or hold status.
Apply additive migrations with the dedicated migrator. Stop on checksum mismatch, timeout, privilege drift or unexpected row counts. Deploy the exact signed candidate to a limited staging or production canary according to the approved change window. Run liveness, readiness, authentication, cross-tenant denial, first-workflow mutation and worker acknowledgement smoke tests using synthetic records.
Promote only after error, latency, queue, storage and denial telemetry remain within approved thresholds for the rollout observation window. The release record defines that window and automatic abort thresholds before deployment. Preserve tested and promoted image digests and the approver's decision.

## Rollback
If a canary fails, stop promotion and route traffic to the last compatible build. Pause affected workers so old and new logic cannot produce conflicting effects. Check schema compatibility before changing the application version. Do not blindly reverse a migration that has accepted new data.
Use a forward migration fix where possible. If recovery requires restore, follow the recovery procedure and apply restrictions before opening traffic. Reconcile accepted jobs and external receipts to avoid repeating irreversible effects. Run smoke and authorization tests before reopening the affected capability. Document the exact recovery point and any unconfirmed external actions.

## Database and regional storage recovery
The source RTO is four hours. RPO is five minutes for decisions, grants and audit, fifteen minutes for metadata and final outputs, and twenty-four hours for input data. Configure backups, point-in-time recovery and storage versioning to those separate classes. Monitor actual recovery lag and alert before an RPO is exceeded.
Perform daily automated backup checks, a monthly sampled restore and twice-yearly full recovery rehearsal. A backup success flag alone is insufficient. Recover into an isolated regional environment, verify checksums and database consistency, reconcile object versions and test decryption with approved key access.
Before serving any restored data, replay the independent restriction ledger through the recovery boundary. Reapply revocations, deletion tombstones, active holds and corrected publication status. Rebuild caches and search indexes from current permitted state. Reconcile outstanding jobs and external acknowledgements. Compare the achieved recovery time and data-loss interval against the targets, with evidence retained.

## Security and tenant isolation incident
Contain the affected credential, context, workload or region. Stop risky exports and suspend affected capabilities using a bounded hold; preserve the minimal safety-report path. Revoke sessions and rotate compromised secrets through the approved credential process. Avoid broad deletion or actions that destroy evidence.
Identify affected tenants, records, fields, time intervals and egress paths using safe audit evidence. Review direct access, caches, search, previews, events, exports, support and backups. Validate isolation controls in a clean environment before lifting containment. The accountable security and custody owners approve restoration; a support operator or automated assistant cannot release the hold.

## Clinical safety concern and resumption
Accept a minimal authenticated concern even when the reporter cannot identify a study. Route it promptly to the safety owner and record available scope and occurrence time. Apply the narrowest containment that reliably protects affected use, escalating scope when evidence is uncertain.
Central cancellation is an intent until a run or device reports observed stop. An offline device remains remote-unconfirmed; do not show it as stopped from lack of contact. Track every affected configuration, site, evidence view and permitted use. Keep investigation records and notify through the approved local process.
Resumption requires remediation evidence, exact scope, current rights, required independent decisions and observed readiness. Remove only the hold being approved; other active restrictions remain. Verify the resumed version and record the decision and observation separately.

## Upload and quarantine operations
For a stalled transfer, inspect session state, expiry, acknowledged parts and safe digest metadata. Let the authorized client resume missing parts. Do not manually mark an unverified upload complete or alter a stored hash to match a complaint. An expired session requires a new authorized transfer.
For verification or scan failures, preserve quarantine and the reason. Retry only a retryable worker failure with the same durable job identity. Integrity failure requires new content or a new session. Clean orphan chunks through an idempotent collector after checking retention and holds. Retain deletion proof and safe upload history; never make quarantined content available through an operator preview shortcut.

## Queue and connector recovery
Alert on oldest queued age, lease expiry, retry rate and dead-letter growth. A worker claim has a bounded lease. On worker failure, another authorized worker may reclaim after expiry and must recheck current scope before the effect. Inspect the original event or job and its checksum before replay.
Keep event IDs stable on retries. A consumer inbox records completion in the same transaction as its state effect. Reconcile sequence gaps from the authoritative aggregate. For external connectors, distinguish transmitted, acknowledged and processed. If an external effect is uncertain, reconcile with the receiver before sending a new business intent.

## Support access and retention
Support needs a named case, approved metadata projection, exact scope and expiry. Record entry and exit, show the active-access banner and revoke at case closure or expiry. No standing impersonation or raw clinical-data access is permitted by the standard support runbook.
For disposal, verify the approved basis, ownership, retention period, active holds and all derived locations. A retention hold blocks disposal. Inventory primary objects, caches, search indexes, replicas, exports under control and backup lifecycle. Delete through the approved retention worker, retain safe proof and a tombstone, and preserve required immutable evidence according to the approved schedule. A database restore must not resurrect deleted availability.

## Monitoring and launch readiness
| Signal | Operational response |
| Authentication or policy failures spike | Distinguish legitimate denials, stale context and active attack; never widen permissions to reduce errors |
| p95 or p99 latency exceeds target | Inspect policy, DB locks, storage and queue saturation; apply bounded load controls |
| Audit or outbox cannot commit | Reject affected mutations atomically; alert operations |
| Upload verification backlog grows | Preserve quarantine; scale admitted workers within quotas; communicate phase accurately |
| Backup or restriction-ledger lag exceeds target | Stop claiming recoverability; escalate and repair before risky change |
| Offline node lease expires | Enforce local restriction; central status remains unconfirmed until observation |
Before launch, rehearse deployment, rollback, credential compromise, tenant-isolation response, a safety hold and resumption, queue replay and a restriction-aware restore. Attach results to the exact build and environment. Record responsible people and escalation contacts in the secured operational system. The absence of a running application is explicitly recorded in this package's test status, so these rehearsals remain required work.
