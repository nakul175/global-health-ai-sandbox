# Hosted test edition 0.2.0

Historical baseline status. Release 2 additions and current limitations are documented in [RELEASE_2_IMPLEMENTATION.md](RELEASE_2_IMPLEMENTATION.md); this file preserves the v0.2 assessment.

25 September 2026. This is a working, private user acceptance testing edition with persistent storage. It is not completion of all 456 source requirements, all 322 R1 requirements, or a production clinical release.

## Working workflows

| Area | Implemented behaviour | Source relationship | Remaining production work |
|---|---|---|---|
| Identity | Hosted ChatGPT sign-in, owner-private site, owner-separated storage, nine synthetic role profiles, membership revocation | S00/S01; IAM, ACC | External OIDC/PKCE, real verified people, delegated membership management, invitations, MFA, genuine independent authority |
| Institution | Synthetic application, independent test-person verification, returned/rejected states, restrictions until verified | S01; ORG | Legal identity, evidence verification and operational onboarding |
| Programme | Create, edit, constrained archival; country, dates and objective | S02; ORG | Complete programme eligibility, funding, contracting and ownership workflows |
| Study | Draft, edit, submit exact protocol digest, approve/return/reject; same-person alias rejection | S02; WFL | Real independent reviews, full protocol/method contracts, multiple authority gates |
| Data | Strict synthetic CSV parser, row validation, quarantine, independent custody release/rejection, raw-label suppression in API | S03; DAT | Clinical schemas, protected health data, malware scanning, R2 media, resumable multipart protocol, external references |
| Access | Purpose-recorded study/dataset grants, expiry within 90 days, independent test approval, revoke; checked on use and retry | S03; ACC | Full subject/region/purpose intersection, dynamic grants and external institutional rights |
| Models | Immutable logistic reference configurations, parameters, version and hash | S04; AI model/configuration | Container registry, artifact signing, external models, model lifecycle review |
| Execution | Real deterministic logistic evaluation, bounded input, accuracy/sensitivity/specificity/precision/AUC/Brier, confusion matrix and subgroups | S04; RUN/evaluation families | Isolated untrusted runner, sealed labels, budgets, queues, cancellation, GPU execution, confidence intervals, clinical suitability |
| Evidence | Interpretation, different-person test issuance, immutable exact JSON bytes and digest, governed download, withdrawal | S05; REP | Real evidence review, public views, correction lineage, disclosure and regulatory workflows |
| Safety | Concern intake without attachment/linked record, resolution, institution hold/release; overrides changes, evaluation and export | S00/S06; SAF | Degraded/anonymous reporting, independent resumption authority, object-specific containment and impact management |
| Assurance | Per-tenant optimistic revision, intent deduplication, atomic record/snapshot/audit/receipt batches, strict request schemas | S00/S06; AUD/API | External append-only audit, outbox/worker effects, production observability, retention/disposal and restore controls |

These are broad coverage relationships, not closure of source FRs or NFRs. Original requirement-level backlog files are preserved in `docs/source-backlog`. Source IDs and acceptance text are not rewritten to imply completion.

## Deliberate boundaries

- Every profile is a **synthetic identity controlled by the same signed-in owner**. Person IDs test separation-of-duty logic; they are not real identity proof or independent clinical approval.
- Every signed-in account gets its own three test institutions. Ownership is a site-scoped authenticated user ID supplied by the hosting dispatcher. Client-selected tenant and profile select only within that owner's synthetic workspace.
- Data is synthetic-only. The input vocabulary rejects free-text clinical identifiers: IDs must begin `SYN-`, signal is bounded 0–1, label is binary, group begins `cohort_`. This cannot establish provenance or certify that submitted data is synthetic.
- The evaluator executes fixed application code, not user model code. Metrics are computed, not simulated. Passing a synthetic target does not imply clinical performance.
- This D1 adapter is not the original PostgreSQL architecture. The unmodified native source is retained under `native-baseline/`; its earlier 52-test report applies only to that earlier programme slice.
- Storage is persistent, but measured regional residency, SLA, disaster recovery, RPO/RTO, retention and regulatory controls are not established.
- The test edition uses bounded list responses (500 ordinary records per institution; latest 100 audit rows). Safety reporting/holds remain possible at the ordinary-record limit. Large-scale pagination, offline persistence and a resource-sharing policy beyond test roles remain pending.
- No production secrets, patient data, real invitation, real external model or external connector is configured.

## Validation at delivery

See `verification/VERIFICATION.md`. The production build, unit/domain checks, SQLite integration checks and built-Worker HTTP smoke/integration checks passed. The signed-out page was inspected in the internal browser. Authenticated interactive browser journeys could not be completed because the internal preview does not provide hosted ChatGPT sign-in. No full accessibility conformance, load, penetration, clinical or recovery claim is made.
