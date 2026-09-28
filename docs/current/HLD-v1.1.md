# High-level design — current application and target profiles

Edition 1.1, source 870b49a343f1207b8cefbecdbfb0c5c5d10c955a. This consolidates the present implementation; original [regional ADRs](Architecture-Decision-Records-v1.1.md) and [government HLD](../releases/r3/03-hld.md) retain their own intended scope.

## Current system

~~~mermaid
flowchart LR
  U[Signed-in owner] --> D[Trusted hosting dispatcher]
  D --> UI[React workspace / lab / workbench]
  UI --> A[Protected Worker routes]
  A --> P[Identity, role, grant, hold and version checks]
  P --> S[Owner-scoped D1 records, audit, snapshots, receipts]
  A --> L[Bounded inference and workflow simulator]
  A --> O[Private R2 media and encrypted checkpoints]
  A --> X[Approved public HTTPS JSON endpoint]
  X --> A
~~~

The dispatcher supplies real owner identity. The application derives its workspace from owner plus synthetic institution; browser-selected test profiles cannot grant another owner's access. Those profiles are synthetic people, not independently authenticated institutional reviewers.

D1 persistence and application checks enforce isolation; there is no PostgreSQL RLS in this profile. The reference labels and scorer share the Worker/database. Generated media can be reconstructed from recipes; uploaded chunks and encrypted checkpoints use R2. Real outbound connector calls are separate from simulated connector fixtures.

| Component | Responsibility | Source |
|---|---|---|
| Workspace | Navigation, synthetic roles, governance and legacy evaluation | app/workspace.tsx |
| Lab | Ecosystem, registry, virtual workflow, model comparison and reports | app/laboratory.tsx; lib/lab.ts |
| Workbench | Portable models, manual jobs, media, analysis, access, operations | app/suite.tsx; lib/suite.ts |
| Policy/commands | Closed schemas, role/hold checks, state transitions | lib/domain.ts |
| Persistence | Owner scope, revisions, snapshots/audit/receipts | lib/store.ts |
| Live connections | Endpoint/mapping/secret policy, activation, call fences/history | lib/connections.ts; lib/connection-store.ts |
| Assurance | Exact-byte signatures, encrypted checkpoints, isolated restore | lib/attestation.ts; lib/checkpoint.ts; scripts/restore-checkpoint.mjs |

## Write and execution boundaries

A workspace command authenticates, validates scope/schema/rights and intent, checks the revision, then atomically commits state, snapshots, audit and receipt. Failures do not become browser-only saves. Jobs have leases and epochs, but dispatch is manual. External requests are not inside the ordinary command transaction; configuration/rights are rechecked before accepting results and unknown outcomes remain visible.

The current database has 11 tables and four additive migrations. [The exact dictionary](CURRENT-DATA-DICTIONARY.md) is derived from those SQL files. A metadata export or simulated operational exercise is not a database/media backup.

## Separate native profile

The native development slice uses FastAPI/React and PostgreSQL semantics, with a local PGlite route and a separate native PostgreSQL test profile. API/policy/worker identities, row-level security, outbox and formal contracts are part of that architecture. It is not the backend of the current hosted Site. PR #13 made documented corrections to this preserved development baseline.

## Proposed government profile

R3A proposes real institutional identity, organisation-scoped modules and additive tables in the hosted development profile. Durable unattended jobs and genuinely independent users are new dependencies. R3B selects a national integration and pilot telemetry; R3C adds evidence reuse, portfolio and a separately qualified government-hosting profile.

Owner-private synthetic records cannot silently become shared institutional records. Migration requires authorised selection, target rights and provenance. Arbitrary uploaded code/GPU execution is outside the bounded R3A hosted design.

## Deployment and quality assumptions

Public reachability still requires sign-in. Trusted identity headers must never be accepted directly from an untrusted internet client. Hosting region, independent key escrow, production recovery, full security/accessibility and clinical acceptance are not established. Proposed R3 scale targets are not measured alpha capacity. [Qualification](../QUALIFICATION.md) is the evidence authority.
