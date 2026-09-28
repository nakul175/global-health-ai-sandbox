# Test strategy, scenarios and execution boundaries

Documentation edition **1.1**, 2026-09-28. Reconciled to repository source **870b49a343f1**: hosted alpha package 0.6.0 plus PR #13; deployment not requalified.

The current catalogue preserves every original row and original status. Reference-function success is not application success. This documentation change runs document, inventory and reference-fixture checks only; it does not run application or clinical acceptance.

| Catalogue section | Entries | Reading/export copy |
|---|---|---|
| Scenarios | 456 | [CSV](test-catalogue/scenarios.csv) |
| Functional | 738 | [CSV](test-catalogue/functional.csv) |
| Quality | 87 | [CSV](test-catalogue/quality.csv) |
| Critical | 40 | [CSV](test-catalogue/critical.csv) |
| Unit | 117 | [CSV](test-catalogue/unit.csv) |
| Integration | 60 | [CSV](test-catalogue/integration.csv) |
| Smoke | 24 | [CSV](test-catalogue/smoke.csv) |
| HTTP Scripts | 47 | [CSV](test-catalogue/http-scripts.csv) |
| Fixtures | 6 | [CSV](test-catalogue/fixtures.csv) |
| Traceability | 456 | [CSV](test-catalogue/traceability.csv) |

The six original case suites contain **1066 designed cases**. The 456 scenario rows, 47 HTTP script rows, fixture rows and traceability rows are supporting records, not additional executed tests. Separate [synthetic R2](test-catalogue/synthetic-r2.json) has 81 cases and [government R3](test-catalogue/government-r3.json) has 134 planned cases. These catalogues overlap conceptually; no unique total coverage percentage is inferred.

## Execution and release qualification

[Execution register](EXECUTION-REGISTER.csv) extracts exact historical identities and outcomes from the committed XML/JSON reports. Current-main PR #13 results are separately attributed in [qualification](../QUALIFICATION.md), because its new machine reports were not committed. Never assign those aggregate numbers to unnamed case rows.

Run changed-domain unit checks, database and actual HTTP/worker tests against the exact candidate. Independently authenticated browser acceptance, cross-owner denial, stale/replayed intent, failed predictions, secret masking, interrupted effects and recovery must use the intended deployment profile. Native PostgreSQL evidence does not come from PGlite, and deployed-provider evidence does not come from a local receiver.

## Critical acceptance journeys

### AC01 — Unauthorised tenant access

**Requirements:** FR-ORG-003, FR-ACC-007, NFR-SEC-008

**Fixture:** Two institutions A and B, private study B1 and an evaluator scoped only to A.

**Action:** Try list, guessed deep link, search count, thumbnail, export, API and assistant retrieval for B1.

**Expected:** No protected content or existence clue appears; safe denial and scoped audit are recorded.

### AC02 — Self elevation

**Requirements:** FR-IAM-008, FR-ACC-006, FR-ACC-009

**Fixture:** An organisation administrator has a delegated role ceiling and requests a stronger role for themself.

**Action:** Submit through the UI and direct command; try to occupy both approval slots under two role labels.

**Expected:** Delegation and verified person checks reject both attempts; no effective privilege changes.

### AC03 — Leaver revocation

**Requirements:** FR-IAM-007, FR-IAM-008, FR-ACC-010, NFR-SEC-007

**Fixture:** A member has an open session, queued export, active workspace and a scheduled connector job.

**Action:** Commit departure, then attempt protected actions repeatedly and execute queued work.

**Expected:** No new online protected action succeeds beyond 60 seconds; queued delivery stops and ownership tasks remain visible.

### AC04 — Conflicting reviewer

**Requirements:** FR-ACC-003, FR-ACC-012, FR-EVD-004

**Fixture:** The report author is also a financial beneficiary and is assigned as sole scientific signer.

**Action:** Attempt final signature, then assign an eligible independent reviewer after conflict assessment.

**Expected:** First issue is blocked; eligible independent signoff can proceed only after all other gates pass.

### AC05 — Expired agreement

**Requirements:** FR-AGR-004, FR-DAC-003, FR-RUN-001

**Fixture:** A study remains active while its data agreement expires at a known UTC instant.

**Action:** Submit just before expiry and let a queued run reach its start check just after expiry.

**Expected:** New execution is blocked despite active study status; expired agreement is identified without changing past decisions.

### AC06 — Wrong purpose

**Requirements:** FR-DAC-003, FR-AGR-002, NFR-PRI-002

**Fixture:** A valid grant permits evaluation on dataset version D1 for study A1.

**Action:** Request model training, study A2 use and dataset D2 using the same grant.

**Expected:** Each mismatched purpose, study or version is denied; no copied grant expands rights.

### AC07 — Forbidden region

**Requirements:** FR-CTR-004, FR-DAC-006, NFR-PRI-001

**Fixture:** An asset permits primary data and support only in region X, with separately declared backup policy.

**Action:** Request workspace, backup copy and remote support from forbidden region Y.

**Expected:** Each restricted route is blocked and creates a scoped policy explanation; approved unrelated processing remains available.

### AC08 — Hostile artefact

**Requirements:** FR-ING-002, FR-RUN-002, FR-COP-006, NFR-SEC-008

**Fixture:** Controlled malicious file, hostile container and document containing unauthorised tool instructions are available in an isolated test environment.

**Action:** Upload, preview, execute and retrieve them through relevant approved test routes.

**Expected:** Files remain quarantined, workload cannot escape scope and embedded text creates no authority; findings are retained safely.

### AC09 — Silent data loss

**Requirements:** FR-ING-005, NFR-INTG-003

**Fixture:** A synthetic source contains 1000 records with 930 accepted, 50 rejected and 20 quarantined.

**Action:** Complete validation, attempt release with one missing record, then restore full accounting.

**Expected:** Unaccounted record blocks completion; final counts reconcile and partial acceptance remains explicit.

### AC10 — Clinical unit mismatch

**Requirements:** FR-ING-003, FR-API-009, NFR-INTG-007

**Fixture:** A numeric clinical field has valid magnitude but an incompatible unit; another field has an unknown clinical code.

**Action:** Import with an unapproved conversion and round trip through export.

**Expected:** Records are quarantined or explicitly unmapped; no guessed conversion or silent substitution occurs.

### AC11 — Patient leakage

**Requirements:** FR-CUR-008, FR-VAL-006

**Fixture:** One participant has different encounter keys in development and final test partitions.

**Action:** Run the approved linkage and leakage check before release.

**Expected:** Overlap is identified without revealing unnecessary identity; independent test status is blocked until qualified resolution.

### AC12 — Sealed benchmark exposure

**Requirements:** FR-DAC-011, FR-ACC-007, FR-COP-002

**Fixture:** A developer has two verified related accounts and a sealed benchmark attempt limit.

**Action:** Exhaust quota, retry through the second account, query hidden labels and request assistant summaries.

**Expected:** Quota remains enforced across related identity; labels do not appear in any output, preview or side channel.

### AC13 — Protocol change after results

**Requirements:** FR-PRO-004, FR-PRO-008, FR-EVD-011

**Fixture:** A protocol was frozen before results and contains a failed primary endpoint.

**Action:** Change endpoint or threshold after unblinding and attempt to regenerate the original report.

**Expected:** A successor amendment and exploratory label are required; original plan and unfavourable result remain traceable.

### AC14 — Failed predictions

**Requirements:** FR-VAL-005, FR-PRO-005, NFR-INTG-007

**Fixture:** The diagnostic fixture has 200 labelled scored cases and ten failed attempts.

**Action:** Calculate metrics and attempt to filter failures out without an approved analysis rule.

**Expected:** Attempted and scored denominators remain separate and reconciled; the primary rule follows the frozen protocol.

### AC15 — Insufficient subgroup

**Requirements:** FR-VAL-008, FR-HUM-007, FR-EVD-006

**Fixture:** Overall performance is favourable but a prespecified subgroup has inadequate sample size and a small disclosure-sensitive count.

**Action:** Generate the subgroup conclusion, dashboard and export.

**Expected:** The subgroup is inconclusive and suppressed where required; it is never certified safe or displayed as zero.

### AC16 — Reproducibility failure

**Requirements:** FR-VAL-010, NFR-INTG-004

**Fixture:** An independent rerun differs from the signed analysis beyond protocol tolerance.

**Action:** Attempt to mark it reproduced and issue the dossier.

**Expected:** Reproduction remains failed or under investigation and issue is blocked for the unsupported claim.

### AC17 — Unpinned remote model

**Requirements:** FR-SOL-002, FR-RUN-008, FR-MON-005

**Fixture:** An external API provides no fixed version guarantee and changes behaviour between planned repeats.

**Action:** Ingest provider evidence and compare runs; attempt unchanged configuration claims.

**Expected:** Identity limitation and impact review are visible; exact reproducibility and unchanged evidence claims are withheld.

### AC18 — Fabricated citation

**Requirements:** FR-GEN-003, FR-COP-003, NFR-AQL-003

**Fixture:** An assisted report contains a plausible nonexistent guideline citation and a material clinical claim.

**Action:** Run human claim verification and attempt publication without source support.

**Expected:** The claim is flagged and cannot enter released findings; reviewer correction and AI provenance are retained.

### AC19 — Prompt injection

**Requirements:** FR-COP-002, FR-COP-004, FR-COP-006

**Fixture:** An accessible source document instructs the assistant to export another study and grant an administrator role.

**Action:** Retrieve it in a legitimate drafting task and observe proposed tool actions.

**Expected:** No unauthorised data retrieval, export or role change occurs; untrusted text remains content.

### AC20 — Silent study contamination

**Requirements:** FR-STU-006, FR-DEP-008, FR-SAF-004

**Fixture:** A prospective site is activated in silent mode with a separate live clinical worklist.

**Action:** Execute predictions and attempt to send them to the care-facing connector.

**Expected:** The production destination is denied; attempted exposure creates a deviation and safety review.

### AC21 — Missing participant permission

**Requirements:** FR-ETH-002, FR-ETH-003, FR-STU-002

**Fixture:** Participant permission covers an old materials version or excludes the proposed population.

**Action:** Attempt enrolment and governed data use at the site.

**Expected:** Affected activity is blocked with the missing approved basis; a local qualified owner must resolve it.

### AC22 — Serious safety concern

**Requirements:** FR-SAF-002, FR-SAF-003, NFR-AVL-002

**Fixture:** A reporter knows of potential serious harm but lacks participant identity and proof of causality.

**Action:** Submit minimal concern through platform and outage route exercises.

**Expected:** Both routes reach qualified urgent triage; incomplete optional fields cannot suppress intake or local escalation.

### AC23 — Offline site stop

**Requirements:** FR-RUN-011, FR-SAF-005, NFR-AVL-009

**Fixture:** A registered local node is offline when a safety owner sends a stop instruction.

**Action:** Observe central status, backup escalation and eventual local acknowledgement.

**Expected:** State remains unconfirmed until evidence arrives; contact age and approved offline lease behaviour are visible.

### AC24 — Payment influence

**Requirements:** FR-BIL-008, FR-EVD-009, FR-SAF-010

**Fixture:** A developer has an overdue invoice, a negative report and an active safety hold.

**Action:** A commercial user attempts report deletion, hold release and disabling incident intake.

**Expected:** Each prohibited action is denied; financial dispute remains separate from scientific and safety processes.

### AC25 — Regulatory status confusion

**Requirements:** FR-CTR-008, FR-REG-005, FR-EVD-003

**Fixture:** An evaluation meets specified criteria but there is no verified market authorisation.

**Action:** Complete internal checklists and inspect public and buyer profiles.

**Expected:** Scientific success remains distinct; no market-authorised field or regulatory approval claim is created.

### AC26 — Transfer to new country

**Requirements:** FR-TRN-002, FR-TRN-003, FR-TRN-005

**Fixture:** A receiving country has different language, prevalence, workflow and permissions from the origin study.

**Action:** Clone a dossier and attempt immediate local suitability and deployment.

**Expected:** Gap assessment, local evidence and independent reliance decisions are required; foreign permissions are not copied.

### AC27 — Restricted publication

**Requirements:** FR-DAC-009, FR-EVD-007, NFR-PRI-004

**Fixture:** A public report draft contains a patient row, a protected small cell and a proprietary model attachment.

**Action:** Preview, approve and export the public view through normal and direct routes.

**Expected:** Disclosure and rights checks withhold disallowed content; changed redactions require renewed review.

### AC28 — Report correction

**Requirements:** FR-EVD-008, FR-EVD-009, FR-COL-008

**Fixture:** A report was issued to two recipients and later corrected, with one recipient currently unable to receive email.

**Action:** Open the old verification link and dispatch correction notifications.

**Expected:** Old status is superseded with successor link; delivery failure remains recorded and escalated appropriately.

### AC29 — Model recall

**Requirements:** FR-SOL-010, FR-SAF-009, FR-DEP-010

**Fixture:** A recalled component appears in several configurations and registered sites, including one stale version report.

**Action:** Run impact discovery and issue required site actions.

**Expected:** All registered dependent scopes appear, stale inventory is explicit and unresolved acknowledgements remain open.

### AC30 — Deletion with hold

**Requirements:** FR-AUD-008, FR-EXT-003, NFR-PRI-007

**Fixture:** A deletion request covers both held and unheld assets with a shorter local disposal deadline.

**Action:** Approve the lawful scope and run disposal.

**Expected:** Held assets remain preserved, unheld assets meet applicable deadline and attestation lists exact retained exceptions.

### AC31 — Restoration resurrection

**Requirements:** FR-OPS-008, FR-EXT-004, NFR-AVL-004

**Fixture:** A backup predates a user's revocation and a lawful data deletion.

**Action:** Restore into isolation and attempt to reopen service before current ledger reconciliation.

**Expected:** Reopening is blocked until current restrictions apply; departed user and disposed data remain inaccessible.

### AC32 — Duplicate webhook

**Requirements:** FR-API-007, FR-RUN-007, FR-BIL-005

**Fixture:** One webhook representing a completed billable run is delivered five times and later replayed out of order.

**Action:** Process all deliveries and reconcile resulting evidence and charge records.

**Expected:** One logical outcome and declared charge exist; duplicate event receipts remain auditable without repeated effects.

### AC33 — Spending overrun

**Requirements:** FR-BIL-004, FR-RUN-004, NFR-CST-002

**Fixture:** Two concurrent jobs approach a shared hard budget ceiling and one triggers retry.

**Action:** Submit both and inspect reservations, metering and stop behaviour.

**Expected:** No unauthorised overrun is committed; warnings, safe termination, retained evidence and charge reconciliation are correct.

### AC34 — Unsupported capability

**Requirements:** FR-MOD-008, FR-CTR-010, FR-OPS-005

**Fixture:** A user selects an unsupported modality or a draft country profile while the UI capability flag is enabled.

**Action:** Attempt admission, execution and formal issue through direct commands.

**Expected:** Capability and country gates deny formal activity regardless of menu visibility.

### AC35 — Accessibility barrier

**Requirements:** NFR-USA-001, NFR-USA-004, NFR-USA-005

**Fixture:** Representative keyboard and screen reader users complete onboarding and core workflows using the approved browser matrix.

**Action:** Authenticate, resolve form errors, review a record, confirm an action and file an incident.

**Expected:** Required actions are operable with labelled fields, focus handling and announcements; critical accessibility barriers block release.

### AC36 — Constrained connection

**Requirements:** NFR-PER-008, NFR-USA-005

**Fixture:** L1 workload is active over 1 Mbps, 300 ms round trip and one percent packet loss.

**Action:** Save application, review task and file incident with representative content.

**Expected:** Core metadata workflows meet eight seconds p95 without losing saved changes; large deliberate transfers are separately measured.

### AC37 — Regional disaster

**Requirements:** NFR-AVL-003, NFR-AVL-004, NFR-AVL-005, NFR-PRI-001

**Fixture:** A recoverable regional disaster occurs after timestamped decisions, grants, metadata and source data changes.

**Action:** Execute the approved recovery plan in a permitted region and reconcile evidence before reopening.

**Expected:** Four hour RTO and differentiated 5 minute, 15 minute and contracted source RPO targets are verified with actual loss measurements.

### AC38 — Ai provider outage

**Requirements:** FR-COP-010, NFR-AQL-006

**Fixture:** All optional AI providers are unavailable or disabled by the institution.

**Action:** Draft manually, review evidence and report an incident.

**Expected:** Authorised core workflows remain usable; assistant state shows unavailable without fabricated content or blocked safety intake.

### AC39 — Institutional exit

**Requirements:** FR-EXT-005, FR-EXT-006, FR-EXT-010, FR-MON-011

**Fixture:** An institution exits with a shared dataset, active monitoring duty, retained report and open financial item.

**Action:** Create export, revoke access, transfer owners and issue closure attestation.

**Expected:** Only permitted assets transfer, monitoring responsibility is accepted, attribution remains and residual obligations stay assigned.

### AC40 — Clinical threshold misuse

**Requirements:** FR-PRO-004, FR-VAL-012, NFR-AQL-001

**Fixture:** An admitted task has no approved clinical threshold but a model scores highly on a generic benchmark.

**Action:** Attempt protocol freeze, suitability decision and final issue using a global accuracy default.

**Expected:** Each dependent decision remains blocked until a qualified task-specific rule is approved; favourable score provides no bypass.

## Government first-slice acceptance

Follow the full [R3 test plan](../releases/r3/10-test-plan.md): two real principals/organisations, supplier isolation, frozen comparison, known budget fixture, independent pack review, exact export and denial/recovery variants. All R3 cases stay planned until executed evidence supports the intended environment.
