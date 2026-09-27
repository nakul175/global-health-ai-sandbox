# Functional specification

Status: proposed. Normative requirement IDs, acceptance conditions, release stage and test mappings are in [requirements.json](requirements.json). This narrative defines the workflows those requirements implement. See [UI behaviour](05-ui-and-wireframes.md) for screen states and [access rules](08-access-control.md) for every protected action.

## 1. Institutional onboarding

An authorised bootstrap administrator creates an organisation with a stable identifier, name, jurisdiction and policy profile. Users authenticate with a verified provider subject, then accept a single-use, recipient-bound invitation. The server derives membership; a supplied organisation ID selects context but never grants authority. Email domains are not automatic proof of employment. Invitations expire after 72 hours and cannot assign the platform-operator role.

Membership states: invited → active → suspended or revoked. Revocation blocks the next protected request and any queued operation before dispatch. At least one active institutional administrator must remain; removing the last one requires an audited recovery procedure. Separate people must author and independently approve evidence; switching roles never changes person identity. Service accounts have explicit scopes and cannot approve evidence.

## 2. Programme and district setup

Create a programme with name, objective, country code, currency, time zone and dates. Configure district profiles containing facilities, staffing, devices, connectivity, screening volume, reference prevalence, laboratory capacity and referral completion assumptions. Each quantitative input records its source, observation period, owner and classification (`measured`, `estimated`, `synthetic`). Missing required inputs block the affected calculation; optional unknowns show `unknown` rather than defaulting to zero.

CSV import provides a template, encoding/size checks, row-level preview, duplicate detection and a final confirmation. Import is atomic: errors leave the previous profile unchanged. Proposed limit: 5 MiB and 10,000 rows, parsed on the server with CSV formula characters escaped on export. No free-text patient records are accepted by this module.

Profiles can be cloned. Published snapshots are immutable; editing a draft or creating a new version does not rewrite earlier evaluations. A programme may be archived only when no run or unresolved pilot incident needs action. Read access and evidence exports remain available under retention rules.

## 3. Supplier participation

A programme owner records or invites a supplier. Each submission specifies intended use, immutable model identifier or digest, runtime mode, input/output contract, supplier-declared limitations, price schedule and evidence references. Supplier assertions are labelled as such. Each supplier can see only its assigned submissions and feedback approved for release.

Submission states: draft → submitted → accepted or returned or withdrawn. Submitted content is immutable; a return creates a new revision with a reason. Withdrawing does not erase historical evaluation evidence. Declared model version is distinguished from independently verified artifact digest; remote services whose version cannot be verified are ineligible for an unqualified reproducibility claim.

## 4. Protocol and comparison

The evaluator defines intended use, population, inclusion/exclusion rules, evidence class, protected reference dataset digest, comparator, thresholds, metrics, subgroups, sample adequacy rules and operational scenarios. A different authorised reviewer freezes it after checking conflicts and rights. The frozen manifest pins every dependency and its version/hash.

Start comparison creates an asynchronous run and returns a run ID. States: queued → running → succeeded, failed, cancelled or unknown. Cancellation is a request; results arriving after a cancellation fence are retained for audit but excluded from accepted results. An interrupted external call may have an unknown outcome and is never automatically replayed unless its adapter proves idempotence.

All compared suppliers use the same relevant protocol and cohort. Incomplete or incompatible runs cannot appear as an unqualified ranking. Show confusion matrices, sensitivity, specificity, precision, coverage, excluded/error counts and uncertainty; zero-denominator metrics are `not_estimable`. Suppress small subgroup detail according to policy and show insufficient evidence. Operational cost and latency are displayed separately from clinical metrics. Weighted ranking is optional, uses published weights and cannot override minimum eligibility criteria or human selection.

## 5. Budget and service modelling

The finance user chooses programme context, model metrics, annual screening volume, cost schedule and funding sources. A deterministic calculation produces expected true/false positives, referrals, confirmatory demand, capacity gap, setup cost, recurring cost, annual funding and unfunded balance. It includes a no-AI/current-service comparator where relevant data exist.

A user can change assumptions in a clone and compare low/base/high scenarios. Every result shows the calculation version, currency, price date, horizon and limitations. No cross-currency addition or automatic exchange-rate lookup is permitted in R3A. Do not interpret laboratory volume divided by capacity as a waiting-time model. See [exact equations and rounding](17-evidence-and-economics.md).

Funding lines have source, period, amount and status (`proposed`, `committed`, `received`). Only committed/received amounts count as secured funding, without double counting the same commitment when received. Unfunded recurring costs after a grant expires remain visible.

## 6. Evidence and committee decisions

Create a pack from frozen comparison, budget and context snapshots. Its provenance manifest stores source versions and hashes; unknown or failed tests remain visible. The author adds interpretation, limitations and a proposed next action. A different conflict-free reviewer can request changes, reject or approve. Issue requires approval of the exact pack hash and a current permission check.

States: draft → in_review → changes_requested, rejected or approved → issued → withdrawn or superseded. Approved changes invalidate approval. Issued content is immutable; correction produces a successor with a reason and links both versions. Withdrawal changes availability/status without erasing the issued bytes. Download rights are checked at request and short-lived URL generation. Public disclosure is a separate explicit action.

Exports: human-readable PDF; editable DOCX brief and XLSX comparison/cost table; canonical JSON manifest. Each includes evidence class, generation time, pack version, limitations and source hashes. Editable copies are labelled uncontrolled after modification. Formula injection is neutralised. Application signing attests bytes and provenance; it does not represent a regulator or an institutional signature unless that authority is actually configured.

## 7. Integration proving ground — R3B

Configure an approved adapter, environment, endpoint, secret reference and allowed operation set. Tests have assertions for successful transactions, consent expiry/revocation, invalid references, duplicate events, timeouts and recovery. Test records include adapter/profile version, request/response hashes and redacted findings. A generic GET health check cannot pass a transaction or conformance test.

Mocks, sandbox endpoints and production endpoints are different modes with persistent badges. A missing credential/endpoint yields `blocked`, never simulated success. Activating a live transfer requires a named authority, data-class permission, destination approval and a passed version-matched test. Remote schema/credential changes invalidate activation as specified by the adapter. R3B begins with one selected national test ecosystem; adapter selection is an explicit release gate.

## 8. Pilot supervision — R3B

A pilot plan names sites, dates, authorised model versions, success measures, baseline/comparison method, data sources, oversight owners and pause criteria. Independent approval is required before activation. Observations have source event IDs, timestamps, units, site and quality status. Deduplicate within source; retain late data with event-time attribution and mark revised reporting windows. Display freshness and completeness beside all indicators.

Alerts route to assigned roles in-app; external notifications require configured channels and recipient authorisation. An alert can be acknowledged, investigated, resolved or dismissed with a reason. A pause stops new platform-controlled dispatch; it cannot claim to stop an external clinical service without a tested control integration. Resumption requires an independent safety decision and, after material change, revalidation.

## 9. Evidence reuse and portfolio — R3C

An institution can publish an approved, redacted evidence record to named partner agencies. The recipient accepts access and sees exact scope, evidence age and model version. Reuse requires a transferability assessment of population, setting, devices, language, service pathway and costs. Outcomes are `reusable`, `local_tests_required` or `not_applicable`, with reasons; no automatic country equivalence.

Portfolio views aggregate only accessible programmes and records, with freshness and provenance. Drill-down cannot reveal restricted supplier or patient details. Public summaries require institution-selected fields and approval, and exclude sensitive operational and commercial information. Revocation prevents future access but cannot recall previously downloaded copies; this is disclosed before sharing.

## Global exception behaviour

Permission/hold failures leave state unchanged. Conflicts preserve user input and show a comparison; no last-write-wins. Duplicate intents replay the prior authorised outcome. Missing external services produce a recoverable blocked state. Unsupported operations have a named dependency and no fake success control. Every asynchronous action exposes progress, cancellation state and an accessible error summary.
