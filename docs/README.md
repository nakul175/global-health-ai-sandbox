# Documentation index

This repository is the source of truth for product, engineering and operating documentation. Specifications describe intended behaviour; only versioned implementation and verification records establish delivered behaviour.

## Start here

| Need | Document |
|---|---|
| Government adoption release: business case through implementation | [R3 documentation pack](releases/r3/README.md) |
| What the live alpha does | [Release 2 workbench](RELEASE_2_WORKBENCH.md) and [self-service connections](SELF_SERVICE_CONNECTIONS.md) |
| Current application test evidence | [0.6.0 verification](../verification/CONNECTIONS_0_6_VERIFICATION.md) |
| API currently implemented | [Core](API_CONTRACT.md), [lab](RELEASE_2_API.md), [workbench](WORKBENCH_API.md), [connections](SELF_SERVICE_CONNECTIONS.md) |
| Current architecture decisions | [Hosted adapter](ADR_010_Hosted_Test_Adapter.md), [R2 adapter](ADR_011_Release_2_Hosted_Adapter.md) |
| Current operational limits | [Operations](OPERATIONS.md), [assurance](ASSURANCE_0_5.md) |
| Original implementation specifications | [Native specification catalogue](../native-baseline/specs/01_Engineering_Implementation_Plan.md) and the other nine files in that directory |
| Original requirement traceability | [Source backlog](source-backlog/backlog.json), [R2 requirements](source-backlog/r2/requirements.json) |
| Documentation maintenance | [Policy](DOCUMENTATION_POLICY.md), [changelog](CHANGELOG.md) |

## Baselines and precedence

The audited runtime is v0.6.0, GitHub commit `538cbd052630bef27cc8ffa5ec880ffd01d53810`, with the same source tree as deployed source commit `8a08831be002da80b0cdf6e4ec43d8fadcb02310`. Historical files retain their original scope and dates. The v0.2 implementation status and original PostgreSQL design do not describe all current hosted behaviour.

R3 is an additive **proposed specification**, not a deployed release or government endorsement. It introduces genuine institutional access, programme evaluation and budget workflows, then integration/pilot monitoring and evidence reuse. The R3 pack identifies dependencies and unresolved deployment choices explicitly.

For current behaviour, consult executable source and current verification. For intended R3 behaviour, consult its requirements and contracts. A discrepancy requires an explicit change record; do not silently treat the newest prose as proof of implementation.

## Navigation for the earlier specification pack

1. [Engineering implementation plan](../native-baseline/specs/01_Engineering_Implementation_Plan.md)
2. [API and events](../native-baseline/specs/02_API_and_Event_Contracts.md)
3. [Database and migrations](../native-baseline/specs/03_Database_Migrations_and_Data_Model.md)
4. [Access control](../native-baseline/specs/04_Access_Control_Matrix.md)
5. [Development and CI](../native-baseline/specs/05_Development_Environment_and_CI.md)
6. [Fixtures](../native-baseline/specs/06_Seed_Data_and_Acceptance_Fixtures.md)
7. [Threat model](../native-baseline/specs/07_Threat_Model.md)
8. [UI interactions](../native-baseline/specs/08_UI_Component_and_Interaction_Specification.md)
9. [Architecture decisions](../native-baseline/specs/09_Architecture_Decision_Records.md)
10. [Operational runbooks](../native-baseline/specs/10_Operational_Runbooks.md)

The repository contains preserved engineering artefacts, not an independently verified copy of every earlier conversation document. The new R3 BRD, FSD, HLD, LLD, wireframes and test catalogue below are complete authored baselines for the newly proposed scope.
