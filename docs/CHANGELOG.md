# Documentation changelog

## 2026-09-27 — Agent-assisted delivery process

- Added five restricted-tool Claude agent definitions under `.claude/agents/` (spec writer, builder, verifier, independent reviewer, release steward) and documented the flow in [the delivery process](DELIVERY_PROCESS.md).
- Added Bug and Change Request issue forms with type, severity and status labels.
- Added an application quality workflow: typecheck and tests on every pull request, and lint errors blocked in changed files. Full-repository lint is reported but not blocking because of existing lint debt.
- Updated the documentation policy to name the scheduled agent pickup as the only unattended writing process. It opens draft pull requests only; human approval and merge remain required.
- No application behaviour, migration or deployed runtime changed.

## 2026-09-26 — Government adoption design baseline 1.0.0

- Added the R3 BRD, FSD, HLD, LLD, UI/wireframes, API/events, candidate database design, permissions, implementation backlog, test catalogue, fixture plan, development/CI, threat model, runbooks, pilot plan, economics and decision records.
- Linked new requirement IDs to work packages, acceptance cases and design documents; retained earlier requirements unchanged.
- Added a documentation index, maintenance rules, contributor instructions, pull-request checklist and automated documentation validation.
- Corrected current audience wording: the hosted alpha is publicly reachable but requires ChatGPT sign-in; application data remains separated by signed-in owner.
- All R3 application capabilities remain proposed. Candidate schemas, migrations and reference fixtures are development artefacts, not changes to the hosted runtime.
