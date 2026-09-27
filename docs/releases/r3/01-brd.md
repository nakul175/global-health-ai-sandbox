# Business requirements document

Status: proposed R3 design baseline 1.0.0. Accountable role: product lead. Approval by an actual customer programme and implementation team is pending.

## Problem and value

A department needs to decide whether an AI solution improves a public service under its local constraints. Supplier demonstrations do not by themselves establish comparable performance, affordability, integration readiness or sustainability. Evaluations also need to survive staff changes and remain useful when another district considers adoption.

The product will assemble reproducible technical evidence, transparent economic scenarios and accountable human decisions. It supports the decision to decline, request more evidence, run a limited pilot or consider expansion. It does not award contracts or approve clinical use automatically.

## Users and responsibilities

| Persona | Job to be done | Success evidence |
|---|---|---|
| Programme director | Decide whether and where to pilot | Reviewed decision brief, explicit evidence gaps and named owner |
| Programme analyst | Configure local context and compare options | Reproducible comparisons, traceable assumptions |
| Independent evaluator | Test suppliers against a frozen protocol | Protected evaluation data, immutable results and conflict declarations |
| Finance officer | Understand costs and funding continuity | Reconciled annual costs and unfunded balances |
| Procurement officer | Review evidence fairly | Same criteria, versioned submissions, decision trail |
| District manager | Understand capacity and delivery work | Staffing, referrals, device and training requirements |
| Vendor contributor | Submit and correct its own solution | Clear requirements, isolated submission and feedback |
| Institutional administrator | Manage real membership and continuity | Auditable access and handover |
| Safety lead | Investigate and contain problems | Incident workflow, escalation, controlled resumption |
| Support operator | Diagnose authorised technical faults | Time-bound, redacted access with expiry |

## Business objectives and pilot measures

Targets below are product hypotheses, not established outcomes or service commitments. Measure a baseline with the first partner, then approve numeric thresholds before its pilot.

| Objective | Measure | Proposed pilot success criterion |
|---|---|---|
| Produce a useful adoption decision | Decision pack accepted for committee consideration | At least one actual programme decision with recorded evidence and limitations |
| Reduce avoidable evaluation effort | Analyst hours per comparable supplier | Baseline and pilot hours recorded using the same task definition |
| Improve funding visibility | Cost items with named funding source | Every recurring item is funded, partly funded or explicitly unfunded |
| Make evidence reproducible | Independent replay of a frozen test | Equal deterministic outputs, or declared stochastic tolerances |
| Enable institutional continuity | Handover exercise | A second authorised user can explain and reproduce the decision trail |
| Make trade-offs understandable | Observed usability tasks | At least 4 of 5 representative users complete priority tasks without facilitator intervention |

## Scope

R3A includes institutional membership, programme context, supplier submissions, protocol freeze, comparable evaluations, capacity/budget modelling, funding scenarios and committee exports. R3B adds selected interoperability adapters, pilot plans, operational observations and alert handling. R3C adds evidence sharing, portfolio reuse and a separately verified deployment profile for government-selected infrastructure.

All eight proposed product features are mapped in [requirements](requirements.json). Cross-cutting requirements cover accessibility, privacy, security, reliability, portability, audit, localisation and maintenance.

Excluded: automatic procurement award, a universal compliance certificate, autonomous clinical decisions, replacing national patient systems, unrestricted execution of uploaded code, arbitrary clinical-data ingestion, inferred cost savings presented as observed outcomes, or a claim that results from one country are valid everywhere.

## Core business rules

1. The institution owns its evaluation records; individual staff departure does not transfer or destroy them.
2. Supplier access is limited to explicitly assigned submissions. No competitor's prices, raw results or hidden reference labels are disclosed through UI, exports or APIs.
3. An evaluator or report issuer with a declared conflict cannot act as the independent approver. A role change cannot erase the person's prior contribution.
4. Protocol, model, dataset, context, scoring method and price version must be frozen together. Changes create a new version and visibly stale downstream comparisons.
5. Synthetic, retrospective clinical, prospective pilot and vendor-declared evidence are separate evidence classes. No aggregate score silently combines them.
6. Model metrics alone do not establish clinical benefit or service affordability. Funding gaps, failure rates, coverage and operating assumptions are first-class outputs.
7. A committee decision is a human-authored record with rationale, conditions, owner and date. The product may calculate facts and organise evidence but cannot impersonate authority.
8. Missing evidence is displayed as missing, not zero. Failed requests and excluded subjects remain visible in evaluation coverage.

## Commercial and adoption design

Initial buying unit: one programme or department with a small evaluation team and explicitly invited suppliers. Demonstrate one end-to-end use case before adding multiple sectors. Proposed packaging: setup/configuration and training; annual workspace/support; transparent bounded execution allowance; separately priced private hosting or bespoke adapters. No actual pricing is set in this specification.

Implementation deliverables must include administrator training, evaluator exercises, documentation handover, exports and an exit procedure. Supplier evaluations must remain independent of any commercial relationship with the platform operator. Declare conflicts and obtain agency approval of the evaluation governance arrangement.

## Assumptions and risks

- A partner can name an accountable programme owner and independent evaluator.
- Some local context and cost data are available; unavailable figures remain labelled assumptions.
- Access to a national sandbox is a dependency, not implied by an integration logo.
- Clinical evidence and data access require an institution-approved protocol and appropriate permissions before activation.
- A department's preferred hosting, identity provider, retention policy and procurement route are not known. See [decision register](16-decisions-and-release-gates.md).

## Evidence informing the design

Consulted 2026-09-26: [UK AI procurement guidance](https://www.gov.uk/government/publications/guidelines-for-ai-procurement/guidelines-for-ai-procurement) for fair evaluation, whole-life cost, oversight and portability; [NICE digital-health evidence framework](https://www.nice.org.uk/what-nice-does/digital-health/evidence-standards-framework-esf-for-digital-health-technologies) for performance and economic evidence; [ABDM FHIR guide](https://nrces.in/ndhm/fhir/r4/) as a potential country-specific interoperability input. These are design references, not a statement that this product meets those frameworks or that one jurisdiction's rules apply elsewhere.
