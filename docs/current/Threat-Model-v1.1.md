# Threat Model — reconciled reading edition

Documentation edition **1.1**, 2026-09-28. Reconciled to repository source **870b49a343f1**: hosted alpha package 0.6.0 plus PR #13; deployment not requalified.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [07_Threat_Model.md](../../native-baseline/specs/07_Threat_Model.md).

# Threat Model

The primary assets are institutional identity, data rights, patient and study data, sealed labels, immutable evidence, approval authority, model and runtime artifacts, credentials and the integrity of the audit trail. The model covers the first workflows and identifies controls that must exist before later AI execution or external publication is enabled.

## Trust boundaries
The browser or offline device is untrusted relative to the regional API. The API and policy service form a trusted application boundary, with separate database credentials. PostgreSQL and regional storage enforce persistence and tenant controls. Background workers consume durable intent but recheck current authorization. Model runners and submitted models are untrusted execution and must be outside trusted application processes.
Global routing carries approved public information and minimal region or institution routing metadata; it is not a cross-border patient-data store. External institutions, identity providers, authority systems and connectors have their own trust domains. A received assertion, callback or acknowledgement is untrusted until authenticated, scoped and verified. Backups, telemetry and support tools are additional data paths, not automatically safe infrastructure.

## Threat register
| ID | Abuse path | Required control | Acceptance anchor |
| TM01 | Substitute a tenant or object ID in API, list or search | Server context, composite tenant keys, forced RLS, field projection and uniform hidden-object errors | DB03 to DB07; APP04 |
| TM02 | Union two memberships or replay a revoked allow | One active context, current policy checks, bounded cache and replay reauthorization | APP08; policy unit cases |
| TM03 | Same person approves through aliases or changes approved bytes | Verified-person binding, exact snapshot and digest, independent assignments and immutable decisions | DB27 and DB29; APP09 |
| TM04 | Exploit SQL injection or trusted credential to set another context | Bound SQL parameters, no arbitrary SQL endpoints, narrow credentials, injection testing and anomalous context alerts | Native security suite; DB08 to DB10 |
| TM05 | Upload malware, zip bomb, false media type or corrupted chunks | Size and expansion bounds, safe parser process, per-part and whole digest, quarantine and scan before access | DB16 to DB20; APP10 to APP14 |
| TM06 | Use a stale offline lease or stolen device cache | Device-bound encryption, local expiry, no raw offline browser default, revoke on reconnect and remote-unconfirmed status | APP19 |
| TM07 | Exfiltrate via support, logs, exports, previews or presigned URLs | Case-scoped metadata, short expiry, export disclosure approval, gateway checks and payload-free logs | APP21; field policy suite |
| TM08 | Prompt injection turns retrieved content into approval or tool authority | Separate instruction/data handling, tool allowlist, user/workload scope intersection and proposal-only authority | APP22 |
| TM09 | Model accesses sealed labels, network or another tenant | Isolated runner, approved egress, distinct scoring identity, per-run credentials and no model-visible labels | S04 adversarial isolation suite |
| TM10 | Duplicate messages, changed idempotency payloads or sequence gaps corrupt state | Atomic receipt/outbox, digest conflict, inbox dedupe and source reconciliation | APP06, APP07, APP16 to APP18 |
| TM11 | Race budgets or suppress actual overspend | Atomic admission, immutable usage evidence, separate ceiling and actual accounting | DB21 to DB23; APP15 |
| TM12 | Backup restore resurrects revoked, deleted or held material | Independent restriction ledger, replay before traffic, scope reconciliation and restore drills | APP23 |
| TM13 | Supply-chain artifact or dependency changes after review | Hash-pinned dependencies, signed builds, immutable artifact digests and isolated CI secrets | CI supply-chain gate |
| TM14 | Denial of service starves safety or import services | Tenant quotas, bounded queues and parts, rate limits, separate minimal safety path and capacity alerts | APP20; source load suite |
| TM15 | False partner acknowledgement implies processing or external approval | Authenticated receipt provenance, distinct transmission states and verified external decision | Connector integration cases |

## Data minimisation and security assumptions
Do not copy raw health data into event messages, traces, prompts, audit details or error responses. Use opaque references and safe classifications. Secrets are never returned by identity or support APIs. Search indexes and derived features inherit restrictions and removal obligations. An asset under quarantine remains inaccessible through every derivative interface.
The design assumes the trusted application boundary can validate context before opening a database transaction. RLS cannot prevent a fully compromised application credential from setting arbitrary session variables. Production architecture must contain and monitor that risk through credential separation, code review, query parameterization, network restrictions, workload identity, security tests and incident procedures. For threat models requiring protection from the trusted platform operator, additional cryptographic or physically isolated deployment controls need a separate decision.
Clinical misuse is addressed by intended-use restrictions, verified approvals, immutable evidence, explicit limitations and local deployment gates. These engineering controls do not establish clinical effectiveness or regulatory acceptance. The use case, jurisdiction and local authority determine additional validation requirements before activation.

## Risk handling and verification
Treat unauthorized patient disclosure, false clinical authority, cross-tenant access, sealed-label compromise and altered evidence as release blockers. The accountable security, data or safety owner records residual risk, compensating controls, test evidence and review expiry. A blanket acceptance by a platform administrator cannot waive another authority's duty.
Before each slice, update data flows, enumerate new stored and derived assets and add abuse cases. Exercise both direct APIs and indirect paths such as events, caches, search, offline replay and restored backups. Before launch, conduct independent security review, runner escape and egress testing, credential compromise exercises and a restriction-aware restore drill. No penetration or clinical validation claim is made by the reference and SQL checks in this package.
