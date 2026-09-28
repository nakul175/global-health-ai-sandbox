# Global Health AI Sandbox documentation index

Edition **1.1**, 28 September 2026. Reconciled to repository **870b49a343f1207b8cefbecdbfb0c5c5d10c955a**, package **0.6.0** plus PR #13. This is a development handover edition. It does not deploy the Site or establish production/clinical acceptance.

## Start here

| Need | Document |
|---|---|
| Continue development, including with another coding agent | [Developer handover](DEVELOPER-HANDOVER.md), [implementation](../IMPLEMENTATION.md), [next delivery](../NEXT-DELIVERY.md) |
| Understand current architecture and boundaries | [HLD](HLD-v1.1.md), [LLD](LLD-v1.1.md) |
| Use the implemented alpha | [User guide](USER-GUIDE.md) |
| Administer and support the test workspace | [Administrator guide](ADMINISTRATOR-GUIDE.md), [operations guide](OPERATIONS-GUIDE.md) |
| Assess readiness and actual evidence | [Qualification](../QUALIFICATION.md), [release acceptance](RELEASE-ACCEPTANCE.md), [documentation QA](DOCUMENTATION-QA.md) |
| Find preserved originals and earlier versions | [History and provenance](../history/README.md) |

## Complete specifications

| Document | Current reading edition |
|---|---|
| BRD | [Full business requirements](BRD-v1.1.md) |
| FSD | [Full functional and quality contracts](FSD-v1.1.md) |
| HLD / LLD | [High-level design](HLD-v1.1.md), [low-level design](LLD-v1.1.md) |
| Engineering implementation plan | [Reading edition](Engineering-Implementation-Plan-v1.1.md) |
| API / events | [Target specification and current profile](API-and-Event-Contracts-v1.1.md), [exact hosted inventory](CURRENT-API-INVENTORY.md) |
| Database / migrations | [Target specification](Database-Migrations-and-Data-Model-v1.1.md), [current data dictionary](CURRENT-DATA-DICTIONARY.md) |
| Access control | [Target and current-profile specification](Access-Control-Matrix-v1.1.md) |
| Development / CI | [Specification](Development-Environment-and-CI-v1.1.md) and [handover setup](DEVELOPER-HANDOVER.md) |
| Fixtures / acceptance | [Specification](Seed-Data-and-Acceptance-Fixtures-v1.1.md) |
| Threat model | [Target and current-profile specification](Threat-Model-v1.1.md), [current data governance](DATA-GOVERNANCE.md) |
| UI / interactions | [Specification](UI-Component-and-Interaction-Specification-v1.1.md), [wireframe atlas](Wireframes-v1.1.html) |
| Architecture decisions | [Retained ADRs and profile](Architecture-Decision-Records-v1.1.md) |
| Operational runbooks | [Target runbooks](Operational-Runbooks-v1.1.md), [current operations](OPERATIONS-GUIDE.md) |
| Test cases / scenarios | [Test strategy and all critical scenarios](Test-Strategy-v1.1.md), [catalogue CSVs](test-catalogue/functional.csv) |
| Government adoption extension | [Complete R3 design pack](../releases/r3/README.md), unchanged and explicitly proposed |

Markdown is the reviewable reading format; JSON/CSV/SQL/SVG preserve structured definitions. No original Word file or workbook is silently replaced with a reconstructed file. BRD/FSD reading copies preserve the detailed structured model and identify the missing original document binaries.

## Structured records and inventories

| Record | Scope |
|---|---|
| [Implementation register](IMPLEMENTATION-REGISTER.json), [traceability CSV](TRACEABILITY.csv) | 456 original + 81 synthetic R2 + 63 government R3 catalogue entries; separate namespaces, no invented acceptance |
| [Original test catalogue](Test-Strategy-v1.1.md) | 1,066 designed case rows, 456 scenarios, 47 HTTP scripts; original text/status preserved |
| [R2 cases](test-catalogue/synthetic-r2.json), [R3 cases](test-catalogue/government-r3.json) | 81 synthetic R2 and 134 planned government R3 cases |
| [Execution register](EXECUTION-REGISTER.csv) | 152 historical hosted v0.6 + 52 historical native v0.1 identities; not a combined current-main run |
| [Screen coverage](SCREEN-COVERAGE.csv), [screen atlas](Wireframes-v1.1.html) | 113 original target screens plus 28 source-backed alpha views/tabs; layouts illustrative |
| [API inventory](API-INVENTORY.json) | 20 HTTP operations; 68 closed command definitions, of which 3 are internal media actions; 6 separate connection actions |
| [Data dictionary](DATA-DICTIONARY.json) | 11 hosted tables from 4 immutable active migrations; R3 candidate SQL separately documented |
| [Source preservation](../history/pre-v1.1/MANIFEST.json) | Exact hashes and archive of available earlier documentation, contracts, catalogues and evidence |

## Maintenance and status

The target requirement defines the intended outcome; implementation notes describe delivered subsets. Historical test evidence applies to its own source and environment. No full acceptance is inferred from a design, mock, source path or similarly named test.

Update the current implementation, source-derived inventories, requirement relationships, UI guidance, execution evidence and release decision together. Retain original IDs, original release allocations, migration bytes and historical provenance. Run both documentation validators and the affected application checks. See [maintenance policy](../DOCUMENTATION_POLICY.md), [change record](CHANGELOG.md) and [document control](DOCUMENT-CONTROL.md).
