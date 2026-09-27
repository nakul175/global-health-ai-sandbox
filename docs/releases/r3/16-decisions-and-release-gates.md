# Decisions, dependencies and release gates

Status: open decisions are intentionally visible. Owner names, jurisdictions and service providers are not fabricated. Role owners below must be assigned to actual people at project mobilisation.

| ID | Decision / dependency | Proposed default | Owner role | Blocks |
|---|---|---|---|---|
| DEC-01 | First institution, programme and decision to support | One health programme, synthetic TB example for development | Product/programme lead | Customer acceptance |
| DEC-02 | Institutional identity provider and verification | Verified OIDC-compatible identity; real memberships | Security/engineering | Shared institutional launch |
| DEC-03 | Hosting jurisdiction and data class | Existing hosted dev environment; synthetic/approved aggregates | Institution/data owner | Operational or clinical data use |
| DEC-04 | Queue/runner and execution limits | Durable bounded worker adapter, no arbitrary user code | Engineering | Unattended evaluation/export |
| DEC-05 | Evaluation protocol/statistical adequacy | Pre-specified methods; minimum subgroup disclosure policy | Independent evaluator | Clinical interpretation |
| DEC-06 | Initial country integration | One selected official sandbox and its versioned profile | Institution/integration lead | R3B adapter activation |
| DEC-07 | Cost/funding sources and currency exponent | User-reviewed single-currency schedule | Finance | Customer budget sign-off |
| DEC-08 | Retention, legal hold and evidence disclosure | Configurable, no invented statutory duration | Institution/data owner | Operational deployment/sharing |
| DEC-09 | Signing authority and independent reviewer assignments | Application integrity signature plus named human review | Institution/evaluation lead | Institutional issuance claim |
| DEC-10 | Support, SLA, key recovery and external audit | Proposed targets; provision and rehearse before promise | Operations/security | Production readiness |
| DEC-11 | Private/government cloud profile | Select only for named customer requirement | Institution/architecture | R3C deployment |
| DEC-12 | Pricing, procurement route and neutrality | Separate configuration/support/usage scope | Commercial/programme | Paid deployment |

## Contract freeze gates

R3A schema baseline is available for review now. Before feature implementation: accept identity principal model, storage mapping and economics representation; freeze each affected operation/example with frontend and backend owners. Before R3B: freeze the chosen external adapter's exact schemas and failure semantics using actual sandbox documentation and credentials. Before R3C: freeze recipient-sharing policy and selected hosting bindings. Do not describe third-party-specific contracts as final before the third party is selected.

## Release evidence

| Gate | Required evidence |
|---|---|
| G0 documentation | Validated links/IDs/closed schemas, candidate SQL and known fixture calculations; unresolved decisions visible |
| G1 R3A foundation | Two verified people, organisation/vendor isolation, permission tests, safe membership recovery |
| G2 R3A decision flow | Frozen comparison, reconciled funding, independent review/export and accessible user acceptance |
| G3 R3B external work | Actual selected sandbox transactions, negative/recovery cases and explicit data-transfer rights |
| G4 R3B monitoring | Sourced observations, dedupe/freshness, incident workflow and pause/resume drill |
| G5 R3C reuse | Recipient isolation, approved projection, revocation and transferability review |
| G6 operational profile | Selected infrastructure, security review, restore/exit drills, monitoring, support and approved data policy |

Passing G0 does not imply any application gate has passed. Current R3 application test statuses are planned. Scope changes require a requirement update and ADR when significant; new evidence classes or deployment profiles need their own gate evidence.
