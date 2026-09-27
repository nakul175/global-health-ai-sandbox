# Threat model

Status: design assessment, not penetration-test evidence. Security owner: engineering/security lead. Scope includes browser, identity provider, application, database, workers, suppliers, egress, storage and support operators.

| ID | Abuse path | Required controls | Acceptance evidence |
|---|---|---|---|
| TH-01 | User guesses another organisation's IDs | Verified org scope, composite FKs, safe 404, scoped search/cursors | Cross-org read/write/export/job tests |
| TH-02 | User changes role or alias to approve own evidence | Stable person identity and contribution/conflict history | Same-person aliases and role-switch tests |
| TH-03 | Supplier reads reference labels or competitor information | Separate label store, field projections, supplier assignment | API/export/log leakage tests |
| TH-04 | Connector reaches private metadata or forwards credentials | Approved egress proxy, destination/DNS checks, no redirects, credential binding | DNS rebinding/private destination/redirect tests in target network |
| TH-05 | Uploaded artifact or CSV exploits workers/users | Type/size limits, quarantine/scanning, no arbitrary code, formula escaping | Malformed/media bomb/formula payload tests |
| TH-06 | Replay creates duplicate costly calls or issued packs | Intent receipts, unique keys, outbox/inbox, external reconciliation | Retry/race/unknown-outcome tests |
| TH-07 | Worker publishes after cancellation or hold | Leases/fencing, before/after authority checks | Late response and expired worker tests |
| TH-08 | Evidence changed after review | Immutable bytes, hashes, exact-version approvals, correction lineage | Tamper/stale-review/withdrawal tests |
| TH-09 | Privileged support extracts data | Time-bound scoped grant, redaction, independent audit | Expiry/revocation/no-secret diagnostics tests |
| TH-10 | Synthetic results presented as clinical evidence | Persistent evidence class, export labels, method/coverage metadata | UI/PDF/JSON consistency tests |
| TH-11 | Budget creates false confidence through missing data | Explicit sources/unknowns, currency/horizon checks, transparent equations | Known fixtures, denominator-zero and currency-conflict tests |
| TH-12 | Stale/duplicate telemetry masks pilot failures | Source dedupe, event/receive timestamps, completeness and freshness | Late data, stale feed, duplicate conflict tests |
| TH-13 | Share/export discloses supplier or personal data | Approved projection, scoped expiring grants, audit | Redaction/recipient/cursor/download tests |
| TH-14 | Compromised identity or last-admin loss | Session validation, revocation, recovery procedure, strong privileged authentication | Expired/revoked session and recovery drill |
| TH-15 | Backup stolen or restore destroys current evidence | Encryption, separate keys, isolated restore, approved recovery point | Restore and key-loss exercises |
| TH-16 | Vendor document instructs an AI assistant to exfiltrate | Treat document text as data; restricted tools, no autonomous authority | Prompt-injection tests before any assistant activation |
| TH-17 | Overload consumes shared budget and hides partial results | Per-org quotas, bounded jobs, backpressure and complete denominators | Load/fairness/partial-failure tests |

## Data boundary

R3A accepts synthetic evaluation fixtures and approved aggregate programme/cost information. Clinical patient-level data requires a separately approved purpose, access, retention, hosting and evidence-generation protocol. This is an activation boundary, not a conclusion that synthetic data alone validates an AI for clinical deployment.

## Risk acceptance

Each unresolved threat is assigned an owner role, severity and affected stage in the release review. Critical/high issues affecting the proposed scope block that release. A mock adapter cannot close TH-04 for a real national service; local SQLite tests cannot close TH-01 at every API boundary. Record residual risk and the institution's actual decision rather than manufacturing a signed approval.

## Security exercises

Before institutional pilot: independent multi-user isolation review, credential/log inspection, upload handling and authority checks. Before live external transfers: target-network egress/SSRF tests and provider idempotency/reconciliation review. Before government hosting: infrastructure access review, restore, incident response and exit drills. Reassess on identity, network, data-class or model-execution changes.
