# Deployment, recovery and support runbooks

Status: proposed runbooks for R3. These do not assert provisioned infrastructure, an operational SLA or completed drills. Each deployment has named accountable people, escalation contacts and selected services in a private deployment record; no private contacts or credentials are committed.

## Deploy and verify

Release operator records source commit, artifact digest, contract version, migration version, enabled stage and test evidence. Confirm stage gates, restore evidence, secrets, identity configuration and approved destinations. Apply additive schema changes in staging, deploy compatible code, run smoke with disposable synthetic records, then repeat in the target environment. Enable one organisation first. Stop rollout for identity failures, cross-org access, failed evidence hashes, duplicate accepted effects or migration errors.

Rollback: disable affected feature flags, pause dispatch, record unknown external operations, deploy last compatible application and preserve additive schema/history. Do not drop tables or rewrite signed artifacts. Reconcile in-flight jobs before resumption.

## Restore

Proposed pilot recovery objectives: RPO <=24 hours and RTO <=8 hours, subject to selected infrastructure and measured exercises. They are targets, not commitments. Back up database plus artifact inventory/bytes, hashes, key references and schema/application versions. Store encrypted backups separately with controlled key recovery.

Restore only into an isolated empty target first. Verify decryption, schema, row/foreign-key counts, evidence digests, membership and credential projections. Mark formerly running external operations `unknown`; do not replay them automatically. Validate with smoke, approve cutover and record the recovery point and any lost/unreconciled writes. Test key loss separately; a backup without recoverable keys is not usable recovery.

## Incident response

| Incident | Immediate action | Investigation / resumption |
|---|---|---|
| Suspected cross-org exposure | Disable affected route/export and revoke compromised grants | Preserve restricted audit; establish scope; repair policy; run negative suite; authorised incident lead decides resumption |
| Credential leak | Disable connector and rotate/revoke provider credential | Identify disclosure paths, inspect redacted telemetry, retest destination/config before activation |
| Evidence mismatch | Quarantine affected pack/exports, preserve original bytes | Verify source manifests and signatures; issue correction/withdrawal; never silently regenerate |
| Provider timeout | Fence late results and mark unknown where necessary | Query/reconcile provider operation if supported; explicit new intent only after review |
| Stale pilot feed | Show degraded freshness, alert responsible owner | Check source/ingestion; replay idempotently; revise event-time windows transparently |
| Safety concern | Pause new platform dispatch and preserve records | Independent safety review; revalidation after material change; test external stop only if actually integrated |
| Queue backlog | Enforce quotas and backpressure | Inspect oldest job, failed leases and dead-letter cases; retry only classified safe work |

## Observability

Collect request/error rates, latency, queue age, lease expiry, failed/unknown provider calls, denied access, evidence hash failures, export counts, backup age and pilot-feed freshness. Correlate using request/job/event IDs. No secret values, raw supplier responses, hidden labels or patient identifiers in routine logs.

Proposed initial alerts: any evidence-integrity failure; repeated cross-org denial anomaly; oldest interactive export job >15 minutes; no successful scheduled backup for >26 hours; pilot source beyond its approved freshness interval. Calibrate noisy thresholds with the partner before operational rollout. An in-app alert does not guarantee someone received an external notification.

## Support and staff handover

Open a support case with safe request ID, affected operation and user-visible symptom. Institution grants diagnostic scope with expiry; support cannot request raw records or impersonate reviewers. Record actions and end/revoke grant when resolved. Staff departure suspends access and transfers assignments through an institutional administrator; evidence ownership and contribution history remain unchanged.

## Retention, export and exit

Apply institution-approved schedules and legal holds. Preview eligible deletions, confirm dependencies, audit execution and verify eventual backup expiry. Full institution exit exports typed records, audit/provenance, artifacts and hashes in documented formats. Verify completeness and import into an isolated compatible target. Revoke access and integrations after the agreed handover; retain/delete remaining data according to the contract and applicable policy.

## Stage sign-off

Use [release gates](16-decisions-and-release-gates.md). Infrastructure/security/government approvals are recorded only when actual named reviewers perform them. Passing local document validation never substitutes for operational drills.
