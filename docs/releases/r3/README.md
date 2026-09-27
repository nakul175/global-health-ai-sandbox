# R3 — Government AI evaluation and adoption

Specification version **1.0.0** · 2026-09-26 · **Design baseline; implementation not started**.

Purpose: enable a health programme to compare AI solutions, model local service and budget implications, make a documented pilot decision, and subsequently monitor adoption. No government endorsement, clinical validation or production readiness is asserted.

## Read by role

| Reader | Start with |
|---|---|
| Product lead, programme director | [BRD](01-brd.md), [scope and decisions](16-decisions-and-release-gates.md), [pilot plan](14-pilot-and-adoption.md) |
| Product designer | [FSD](02-fsd.md), [UI specification and wireframes](05-ui-and-wireframes.md) |
| Engineering | [HLD](03-hld.md), [LLD](04-lld.md), [contracts](06-api-and-events.md), [data](07-data-and-migrations.md), [backlog](09-implementation-plan.md) |
| Security and operations | [Access matrix](08-access-control.md), [threat model](12-threat-model.md), [runbooks](13-operations.md) |
| QA and evaluators | [Test strategy](10-test-plan.md), [test catalogue](tests.json), [economics and evidence](17-evidence-and-economics.md) |
| Contributors | [Development/CI](11-development-ci.md), [maintenance policy](../../DOCUMENTATION_POLICY.md) |

## Full artefact inventory

- [Business requirements](01-brd.md) and [functional requirements](02-fsd.md)
- [High-level design](03-hld.md) and [low-level design](04-lld.md)
- [UI, interactions and wireframes](05-ui-and-wireframes.md)
- [API/event specification](06-api-and-events.md), [OpenAPI](contracts/openapi.json), [event schemas](contracts/events.schema.json)
- [Data model and migration procedures](07-data-and-migrations.md), [candidate migration](database/001-government-foundation.sql), [synthetic SQL seed](database/seed.sql)
- [Access control and field policies](08-access-control.md)
- [Implementation plan](09-implementation-plan.md), [backlog](backlog.json), [requirements](requirements.json), [traceability](traceability.csv)
- [Test strategy, unit, integration and smoke plans](10-test-plan.md), [executable fixture inputs and expected results](fixtures/acceptance.json), [application test cases](tests.json)
- [Development environment and CI](11-development-ci.md)
- [Threat model](12-threat-model.md), [operational runbooks](13-operations.md)
- [Pilot, onboarding and adoption measures](14-pilot-and-adoption.md)
- [Architecture decision records](15-adrs.md), [open decisions and release gates](16-decisions-and-release-gates.md)
- [Evaluation methodology and economic model](17-evidence-and-economics.md)
- [Documentation validation record](verification.md)

## Delivery stages

| Stage | Outcome | Dependencies and boundaries |
|---|---|---|
| R3A | Institution-owned comparison, local programme scenarios, budget/funding case and reviewed committee pack | Genuine identities/permissions, frozen evidence snapshots, deterministic calculations. Synthetic/aggregate data initially. |
| R3B | Selected national integration tests and monitored pilots | Named external endpoints, institutional permissions, provisioned runners, telemetry agreements; clinical data requires a separate approved activation. |
| R3C | Reusable evidence records, portfolio and alternative government hosting | Agency sharing agreements, deployment infrastructure, transferability review and verified operational controls. |

R3A is the first implementation target. Contracts for all stages are design baselines, with the freeze gate for each work package stated explicitly. Country adapters and hosting selections require named institutional decisions before their implementation can be accepted; their absence is recorded, not hidden behind dummy success.

## Audited starting point

The v0.6.0 alpha already has deterministic synthetic ecosystems, bounded model evaluation, workflow simulation, reports and limited self-service HTTP connections. It uses ChatGPT-owner workspaces and synthetic role switching. R3 requires real organisation membership, genuinely independent reviewers, controlled vendor participation, larger asynchronous execution and evidence integration. Existing connector outputs are not yet part of issued lab reports.

Earlier application tests passed for their documented R2 scope. Every new R3 application test starts `planned`. The documentation validator checks design consistency and reference fixtures only.
