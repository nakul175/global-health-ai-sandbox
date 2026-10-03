# Developer handover

## Unmerged independent cough provider candidate

Read [the contract and runbook](../INDEPENDENT_COUGH_PROVIDER.md), [ADR 012](../ADR_012_Independent_Cough_Evaluation.md) and [fresh local evidence](../../verification/cough-provider-2026-10-03/README.md). This branch adds a default-disabled generated-signal service and separate Saha consumer integration; it has not been deployed. Applied migrations 0000–0003 and historical evidence are preserved; new migration 0004 adds two checkpointed ledger tables. `pnpm verify` now also executes the independent provider HTTP suite. Main deployment and CODA terms are separate sibling PRs.

Edition 1.1, 28 September 2026. This repository can be picked up for continued development by a developer or coding agent with repository access. No private credential or customer dataset is part of this handover.

## Read in order

1. Repository AGENTS.md and CONTRIBUTING.md.
2. [Current implementation](../IMPLEMENTATION.md) and [qualification](../QUALIFICATION.md).
3. [Documentation index](DOCUMENTATION-INDEX.md), [HLD](HLD-v1.1.md), [LLD](LLD-v1.1.md).
4. [Next delivery](../NEXT-DELIVERY.md) and the exact source requirements for the selected slice.
5. [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [test strategy](Test-Strategy-v1.1.md).

## Reproduce a development checkout

~~~sh
git clone https://github.com/nakul175/global-health-ai-sandbox.git
cd global-health-ai-sandbox
pnpm install --frozen-lockfile
python3 scripts/check-docs.py
python3 scripts/check-current-docs.py
pnpm verify
~~~

Use repository-authorised Git credentials, Node satisfying package.json and the pinned pnpm version. No local validation command above authorises a hosted deployment or real provider request. See [operations](OPERATIONS-GUIDE.md) for authentication/runtime boundaries. Native FastAPI/PostgreSQL work has a separate launcher and test profile.

## Where to work

| Task | Source |
|---|---|
| Main governance UI | app/workspace.tsx; lib/domain.ts; lib/store.ts |
| Synthetic lab | app/laboratory.tsx; lib/lab.ts |
| Workbench and uploads | app/suite.tsx; lib/suite.ts; app/api/suite/media/route.ts |
| Live endpoints | app/connections.tsx; lib/connections.ts; lib/connection-store.ts |
| Signing/checkpoints | app/assurance.tsx; lib/attestation.ts; lib/checkpoint.ts |
| Active schema | db/schema.ts and immutable drizzle/ migrations |
| Actual HTTP tests | tests/http.mjs and the built-Worker harness |
| Original native profile | native-baseline/ |
| Proposed government slice | docs/releases/r3/; intended lib/government/app/government modules are not implemented |

## Evidence rules

Keep original IDs, text and release allocations. The traceability register's original-domain references are investigation pointers, not proof that every requirement is covered. Current R2 capability modes describe bounded subsets; R3 status is proposed. Do not turn reference-fixture results or old machine reports into current candidate acceptance.

For a new change, record exact source, profile, executed cases, expected/actual results and remaining gates. Preserve original verification provenance. Follow source constraints for active migrations, identity, support rights and evidence immutability.

## Maintain this edition

scripts/build-current-docs.py deterministically regenerates the full structured BRD/FSD reading copies, original engineering reading profiles, test CSVs, traceability, current route/command/database inventories, historical execution register and screen atlas. Human-authored HLD/LLD, guides and release decisions must be reviewed alongside regeneration.

The generator pins the reconciliation source in BASE. For a later edition, deliberately update that baseline and authored version/source statements, then run both validators. Do not relabel history to the new edition. Current-document JSON and CSV are designed for Git review and further import, not substitutes for missing original Word/workbook binaries.

No automatic agent coordination, background maintenance, production access, external message or deploy is configured by this documentation. Choose an authorised work item from the next-delivery record.
