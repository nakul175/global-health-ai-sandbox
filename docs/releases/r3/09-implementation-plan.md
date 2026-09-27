# Engineering implementation plan

Status: proposed. Canonical packages/dependencies: [backlog.json](backlog.json). Canonical requirements: [requirements.json](requirements.json). Every package carries owner role, outputs, acceptance gate and dependency list; no fabricated delivery dates or staffing commitments are assigned.

## Sequence

| Stage | Work packages | Reviewable outcome |
|---|---|---|
| Foundation | WP-GOV-01 identity/policy; WP-GOV-12 assurance starts here | Two real test users, isolated organisations, migrations, audit and CI |
| R3A context | WP-GOV-02 programme/context; WP-GOV-03 suppliers | Institution-owned programme and isolated vendor submission |
| R3A execution | WP-GOV-04 evaluation; WP-GOV-05 economics | Frozen comparable runs and deterministic budget scenarios |
| R3A decision | WP-GOV-06 evidence | Independent review and downloadable committee pack |
| R3B integration | WP-GOV-07 adapters | One selected national test integration with negative/recovery tests |
| R3B pilot | WP-GOV-08 pilot monitoring | Approved synthetic pilot, sourced observations, freshness and pause drill |
| R3C reuse | WP-GOV-09 registry; WP-GOV-10 portfolio | Approved cross-agency sharing and transferability review |
| R3C hosting | WP-GOV-11 deployment portability | Separately provisioned and verified government deployment profile |

Assurance is cross-cutting and must pass for each stage; it is not postponed until all features are complete. R3A starts with synthetic and aggregate context. Patient-level data, official integrations and alternative hosting remain gated by their exact dependencies.

## Tasks within each package

1. Resolve its blocking decisions and freeze the relevant schemas/acceptance examples.
2. Implement domain/state rules and meaningful unit tests.
3. Implement additive database migration, repository scoping and constraint tests.
4. Implement protected HTTP commands/reads and event/outbox logic; test against a running application.
5. Implement UI states, accessibility and permission-aware navigation.
6. Execute integrated happy/negative/interrupt/recovery journeys with provisioned fixtures.
7. Update requirement status, API examples, runbooks and exact verification evidence in the same change.

Packages may parallelise only after shared contract freeze. No frontend dependency on undocumented open JSON; no backend interpreting wireframes as the permission specification. Do not mark a package done because a mock endpoint responds.

## First vertical slice

Create two organisations and distinct users; create a programme and district profile; submit three synthetic supplier versions; freeze an approved synthetic protocol; execute comparisons; calculate a three-year budget and funding gap; have a different reviewer approve the pack; issue and export it. Demonstrate rejection of cross-org access, supplier access to competitors, self-approval, stale edits and modified frozen evidence.

The first slice can use bounded built-in reference models. If a customer provider endpoint is unavailable, its submission is labelled `blocked_external_dependency` and excluded from any claim of an executed comparison. No dummy provider is silently substituted.

## Definition of ready

- Requirement and acceptance IDs exist; scope and evidence class are explicit.
- Contract and schema are closed, with examples and semantic rules.
- Access and field rules, threats and error recovery are specified.
- External dependencies are provisioned or the slice explicitly excludes their activation.
- Fixtures have known outputs; performance/operational criteria have a target environment.

## Definition of done

- Runtime implementation exists and is reviewed; migrations applied to a disposable test database.
- Relevant unit, integration, HTTP and user acceptance cases pass with stored evidence.
- Denial, timeout, conflict, incomplete-data and recovery behaviour is tested.
- Accessibility checks and representative manual tasks pass for changed screens.
- No outstanding blocker affecting the claimed scope; deferred cases are disclosed.
- Documentation, source and test report identify the same revision and deployment profile.

## Release acceptance

R3A: end-to-end institutional decision workflow and all R3A security/data/UX gates. R3B: each named adapter passes actual sandbox transactions and pilot telemetry tests; missing credentials prevent acceptance. R3C: actual cross-agency access checks, export/exit drill and deployment-specific recovery/security evidence. No global 'fully developed' claim is implied by completing a documentation pack.
