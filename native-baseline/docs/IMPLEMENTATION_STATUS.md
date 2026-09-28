# Implementation status: programme slice 0.1

The code implements a local vertical slice across selected S00 controls and S02 programme drafts using provisioned synthetic S01 identities. This is deliberate test scaffolding: S01 onboarding is not complete, and S02 is not accepted as a production-ready slice.

## Delivered capabilities and evidence

| Capability | Engineering task | Related source requirements | Evidence and scope |
| --- | --- | --- | --- |
| Repository, pinned installs, build, launcher and executable CI | ENG01 | FR-OPS source family | Build/type/lint checks; native hosted CI still pending |
| Checksummed SQL, restrictive runtime privileges and forced tenant RLS | ENG02–03 | FR-ORG-003, FR-ACC-001 | Fresh embedded migration; zero-context and foreign-tenant read denial; role escalation denied |
| Verified signed subject bound to provisioned principal/context | ENG03, ENG06 partial | FR-IAM-002 | Issuer/audience/signature/key/time negatives; revoked context and membership denied |
| Scoped programme creation, list, read and edit | ENG09 partial | FR-ORG-004 partial, FR-ORG-003 | Live HTTP and browser workflow; no programme eligibility/funding rule engine yet |
| Atomic mutation, snapshot, receipt, audit and outbox | ENG04 partial | FR-API-007 and assurance requirements | Injected outbox failure rolls back business writes; retries return original result; worker deduplicates |
| Minimal concern intake and one-programme hold | ENG05 partial | FR-SAF-002; containment requirements | Incomplete concern accepted; current scoped authority and recent MFA required for hold; hold blocks edits/replay |
| Synthetic demonstration environment | Cross-cutting | FR-ORG-010 partial | No uploads, production connectors, clinical activation or production evidence issuance endpoints enabled |

These are coverage links, not assertions that each broad FR has met all original acceptance criteria. None of the 456 source requirements is automatically closed merely because one related test passes. The preserved backlog remains authoritative; the additional `backlog/implementation_status.json` records actual slice progress separately.

## Important implementation decisions

- Programme create requires a PM membership and a separately provisioned, bounded institutional `programme_creation_scopes` delegation. Role alone is insufficient. The new programme belongs to that active membership.
- Reading requires a registered reader role and an explicit resource scope with purpose `programme administration`. Editing also requires current ownership and a draft/returned state. Support and service accounts cannot use the ordinary programme API.
- Code and ownership are immutable in this slice. Full payload replacement can change descriptive fields, dates, mode and the active country set. Ownership transfer requires its future accepted-successor workflow.
- No context union occurs: each request binds one principal, membership and tenant. Auth and delegation rows are read-locked while accepting an operation. The API receives no general membership-update privilege.
- Negative responses for absent and unauthorized records use the same unavailable message. Counts are only over visible loaded results; no hidden total is emitted.
- Local synthetic sign-in represents MFA only as a fixture. It is not evidence of a real person-verification or MFA ceremony. The API's external identity provisioning and browser OIDC flow need their own acceptance slice.
- Safety intake currently requires a valid context at a verified institution. Applicant, anonymous and degraded-identity intake are pending. Holds are limited to one explicitly delegated programme. Hold release, multi-object containment and full impact-task operations are pending.
- Worker tenant/principal assignment is trusted configuration in this local slice. The batch consumer has schema checks, aggregate ordering and inbox deduplication. A sequence gap is parked with the contract schedule (1, 5, 30, 120, 600 seconds, then `dead_letter`) instead of being re-selected in every batch; an external scheduler, alerting, workload attestation and operational DLQ replay remain pending.
- API input uses the supplied JSON Schema directly, with no coercion, duplicate JSON keys or arbitrary nested fields. Programme `starts_at`/`ends_at` are additionally parsed in code as RFC 3339 with an offset, because jsonschema's `date-time` format check depends on the optional `rfc3339-validator` package. The frontend uses TypeScript types and the same declared field semantics; generation of a complete SDK remains later work.
- Database errors are mapped by constraint: a duplicate programme code is 422/`E_SEMANTIC` on `/payload/data/code`, other unique violations 409/`E_GATE_BLOCKED`, check/not-null/foreign-key violations 422 without retry advice, privilege or row-security denial 500 without retry advice, and only remaining failures (connection, timeout, serialization) 503 with `Retry-After`.
- Runtime configuration accepts only `SANDBOX_<FIELD>` environment overrides; `allow_dev_auth` must be a boolean or exactly `true`/`false`, and the unprefixed names of the earlier environment template are refused at startup.

## Outstanding gates and next tasks

| Priority | Task | Exit evidence |
| --- | --- | --- |
| 1 | Run native PostgreSQL 18.6 CI, migration replay/tamper, isolation and independent-connection races | CI report attached to candidate source; no skipped required check |
| 2 | Native crash/restart, migration interruption, backup/restore and restriction replay | RPO/RTO and integrity evidence; not established by embedded tests |
| 3 | Real OIDC/PKCE integration, context provisioning and verified people | External test realm, key rotation, MFA, revocation and independent identity checks |
| 4 | Institution application, verification and bounded membership delegation | Applicant isolation, no self-elevation, independent verification and owner continuity |
| 5 | Study drafts and exact-snapshot independent review | Different-person approval including alias accounts; reviewed state transitions |
| 6 | Data grant and resumable synthetic ingestion | Current-purpose/region rights, interrupted upload integrity, quarantine and custody release |
| 7 | Production operations and quality | Capacity/load, screen-reader audit, complete accessibility review, penetration test, external alerting, restore and launch decisions |

Authentication, authorization and mutations have behavioural tests. Full application security, accessibility conformance, the published load profile and clinical/regulatory suitability have not been established. There is no production deployment or external Git repository created by this task.
