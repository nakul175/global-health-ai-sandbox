# Architecture decision records

All decisions below are **proposed** until accepted with the implementing slice. Existing ADRs 010/011 still describe the hosted alpha.

## ADR-GOV-001 — Additive organisation domain

Context: R2 scopes data to one signed-in owner and synthetic institutions. Decision: introduce verified organisations/memberships and additive `gov_*` storage/routes. Preserve R2 workspaces; explicit authorised snapshot import only. Consequence: real identity and migration work is required; a profile selector cannot be treated as institutional access. Alternative rejected: changing the meaning of existing tenant IDs in place.

## ADR-GOV-002 — Keep one active database profile per deployment

Decision: R3A develops on the existing D1 runtime with explicit org scoping and composite FKs. Government-selected PostgreSQL/private hosting is a separately provisioned/tested profile. Consequence: no RLS claim for D1 and no assertion that native-baseline SQL is active. Revisit when a named customer requires a different infrastructure profile.

## ADR-GOV-003 — Immutable evaluation and evidence manifests

Decision: pin context, model, cohort, protocol, method, prices and adapter versions; review exact pack hashes. Corrections create successors. Consequence: more explicit version UI and storage, but reproducible decision trails. Alternative rejected: reports reading mutable current dashboard values.

## ADR-GOV-004 — Separate evidence classes

Decision: synthetic, retrospective, prospective and supplier-declared evidence cannot silently collapse into one validated score. Coverage, missingness and provenance are always shown. Consequence: clear limitations may prevent a simple ranking; this is preferable to unsupported precision.

## ADR-GOV-005 — Durable asynchronous work

Decision: use jobs with leases/fencing and transactional outbox/inbox; externally ambiguous operations require reconciliation. Consequence: queue provisioning and worker tests are prerequisites; HTTP timeout is not proof no provider action occurred. No exactly-once network claim.

## ADR-GOV-006 — Transparent economics

Decision: explicit equations, currency-safe amounts, versioned cost inputs and separate committed funding. No opaque AI-generated cost model or assumed exchange rates. Consequence: missing inputs may block a result; scenario ranges are not statistical confidence intervals.

## ADR-GOV-007 — Country adapters as capability packs

Decision: configure one named, versioned profile with exact conformance cases and endpoint permissions. Mock, sandbox and live are separate modes. Consequence: global catalogue breadth is secondary to proof of each connection; a health check is not interoperability certification.

## ADR-GOV-008 — Documentation in the same repository

Decision: Markdown/JSON/SQL/SVG are canonical, with stable IDs, generated traceability, PR checklist and CI validation. Consequence: documentation changes follow code changes and historical evidence remains intact. External PDFs are snapshots, not competing sources of truth. Automated checks establish structural consistency, not clinical or regulatory approval.

## ADR-GOV-009 — Controlled evidence sharing

Decision: share approved projections with named recipient institutions and require transferability assessment. Consequence: recipient context and local validation remain explicit; downloads cannot be recalled after sharing. Alternative rejected: an undifferentiated public list of 'approved AI'.
