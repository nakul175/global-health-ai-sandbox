# Business requirements — full target and current profile

Documentation edition **1.1**, 2026-10-03. Reconciled to repository source **8b4b4b5a4b22** plus the unmerged independent cough provider candidate. Hosted alpha package 0.6.0; this candidate is not deployed.

The original functional and quality targets remain authoritative for intended outcomes. This reading edition is reconstructed from the preserved, structured BRD/FSD traceability model; it is not a byte-identical recovery of the missing original Word documents. No requirement text or release assignment is replaced by the smaller alpha. Government R3 is a separate additive design catalogue.

Current implementation and historical execution evidence are separated in [Implementation](../IMPLEMENTATION.md), [qualification](../QUALIFICATION.md) and [traceability](TRACEABILITY.csv). Related source paths indicate where to investigate a domain; they do not prove each requirement passes. Formal requirement acceptance remains unestablished.

## Product purpose and decision

Support governed health-AI assessment from institutional onboarding and health needs through controlled evaluation, independent evidence, adoption and oversight. The immediate alpha demonstrates synthetic evaluation plumbing. The proposed government adoption workflow supports comparison, affordability and a documented pilot decision.

The institutional programme lead owns the decision; evaluators own method; data custodians own allowed use; independent reviewers own evidence review; finance and procurement assess cost and procurement suitability. Vendors submit their own solution evidence. Platform support does not inherit clinical or evidence-approval authority.

Success for the proposed first government pilot means a real programme can use and explain a reviewed decision pack, identify unfunded recurring costs, reproduce evidence and hand work to another authorised officer. No customer success, savings, approval, commercial price or clinical benefit has yet been established.

## Baseline scope

456 original requirements: 369 functional and 87 quality requirements. Original release allocations: R1 322, R2 131, R3 3. The separate synthetic R2 catalogue has 81 entries; the separate government R3 catalogue has 63. Release names across these catalogues are not interchangeable.

| Module | Outcome area | Records |
|---|---|---|
| ORG | Organisation and programme structure | Organisation, membership, programme, participation and ownership transfer. |
| IAM | Identity and user lifecycle | Invitation, identity, membership, factor, session, credential and access review. |
| ACC | Authorisation and separation of duties | Policy, grant, request, conflict declaration and exceptional access session. |
| CTR | Country rules and control applicability | Country profile, rule, applicability assessment and authority decision. |
| DEM | Health needs and programme intake | Health need, call, application, scorecard and feasibility decision. |
| NET | Clinical sites and partner network | Site, qualification, capacity reservation, expert profile and consultation. |
| SOL | Solution registry and submissions | Product, configuration, submission, claim, authorisation and recall. |
| AGR | Contracts intellectual property and funding conditions | Agreement, rights schedule, provider approval, award and exception. |
| WFL | Study workflow and review management | Study, gate, task, decision, condition, amendment and appeal. |
| ETH | Ethics and participant protection | Ethics determination, permission, consent basis, withdrawal and complaint. |
| DAC | Data catalogue permissions and purpose control | Catalogue entry, access request, grant, approved view and rights case. |
| ING | Data ingestion and validation | Transfer, import batch, source record, validation result and transformation. |
| CUR | Curation annotation and reference standards | Reference standard, label task, guideline, adjudication and partition. |
| RUN | Controlled workspaces and evaluation execution | Workspace, logical request, attempt, manifest, output and node instruction. |
| PRO | Evaluation protocol and analysis planning | Protocol, endpoint, analysis plan, threshold, subgroup and amendment. |
| VAL | Technical and statistical evaluation | Analysis job, metric definition, case outcome, result and interpretation. |
| GEN | Generative AI and agent evaluation | Generative configuration, scenario, conversation, rubric, judge and trial result. |
| MOD | Modality and use case support | Capability pack, input schema, viewer profile and conformance fixture. |
| HUM | Human factors workflow and equity | Workflow map, observation, competence record, feedback and economic analysis. |
| STU | Prospective studies and site conduct | Site activation, participant, form, allocation, query, deviation and closeout. |
| SAF | Clinical safety incidents and corrective action | Hazard, incident, hold, investigation, corrective action and external notification. |
| EVD | Evidence reports and reusable dossiers | Dossier, claim, report view, review, release and correction. |
| REG | Regulatory and ethics submission support | Checklist, submission package, external decision, question and renewal. |
| TRN | Cross country evidence reuse and adaptation | Reuse request, gap assessment, local plan, adaptation and reliance decision. |
| DEP | Implementation procurement and adoption | Readiness assessment, business case, procurement package, deployment and handover. |
| MON | Surveillance and change management | Plan, feed, observation, alert, change assessment and revalidation. |
| ANA | Dashboards reporting and decision support | Dashboard, governed metric, saved view, report and delivery schedule. |
| COL | Collaboration tasks and communications | Comment, task, message, meeting record, document revision and delivery. |
| LRN | Knowledge training and network learning | Knowledge item, course, assessment, competence and method proposal. |
| COP | AI assistance within the platform | Assistant request, retrieved evidence, generated draft, proposal and feedback. |
| API | Integration and interoperability | Connector, mapping, service identity, exchange, event and reconciliation. |
| BIL | Commercial operations billing and sponsorship | Service package, estimate, quote, commitment, usage, invoice and dispute. |
| AUD | Audit assurance and compliance evidence | Audit event, control evidence, applicability mapping, hold and exception. |
| OPS | Administration support and service operations | Service incident, ticket, configuration, capacity, backup, release and supplier. |
| EXT | Retention portability and closure | Retention schedule, disposal, export, offboarding, closure and succession. |

## Complete retained business requirements

### FR-ORG-001 — Organisation hierarchy

**P0 · original R1**

The platform shall represent the operator, countries, legal organisations, departments, sites, programmes and studies with stable identifiers and effective dates.

**Acceptance:** A study can involve three organisations without merging their users, contracts or data permissions.

### FR-ORG-002 — Verified organisation onboarding

**P0 · original R1**

The service shall verify an organisation's legal identity, authorised representative, institutional email domains and accountable administrator before granting institutional privileges.

**Acceptance:** An unverified applicant can prepare an application but cannot authorise data access or approve studies.

### FR-ORG-003 — Tenant boundaries

**P0 · original R1**

The platform shall maintain separate security boundaries for organisations and explicitly authorised shared workspaces; membership in a network shall confer no implicit access.

**Acceptance:** Cross organisation searches, direct links, exports and background jobs all reject ungranted access.

### FR-ORG-004 — Programme configuration

**P1 · original R1**

Authorised managers shall configure programme objectives, eligibility, funding, countries, clinical areas, dates, owners and participant limits.

**Acceptance:** Two programmes can apply different eligibility and funding rules to the same product.

### FR-ORG-005 — Cross organisation collaboration

**P1 · original R1**

An organisation shall join a study through a documented invitation and agreement identifying its role, contributed assets and access expiry.

**Acceptance:** Accepting a study invitation grants only the study permissions specified in the approved agreement.

### FR-ORG-006 — Accountability register

**P0 · original R1**

Every active programme, study, dataset and deployment shall have an accountable institutional owner and a named operational contact with a backup.

**Acceptance:** Removing the last accountable owner is blocked until an authorised successor accepts responsibility.

### FR-ORG-007 — Lifecycle management

**P1 · original R1**

Organisations and programmes shall support draft, active, suspended and closed states with controlled effects on invitations, jobs and existing records.

**Acceptance:** Suspension blocks new activity while preserving authorised incident response and required evidence access.

### FR-ORG-008 — Delegated network administration

**P1 · original R2**

Country and programme administrators shall manage only assigned institutions and configurations within centrally defined policy limits.

**Acceptance:** A country administrator cannot change another country's rules or weaken mandatory operator controls.

### FR-ORG-009 — Institutional ownership changes

**P1 · original R1**

The service shall handle mergers, renamed institutions and changes of sponsor through reviewed transfers preserving provenance and contractual restrictions.

**Acceptance:** Historical reports retain the original legal entity and show the effective transfer date.

### FR-ORG-010 — Demonstration environment

**P1 · original R1**

Demonstration tenants shall use approved synthetic or public demonstration data and visibly identify their nonproduction status.

**Acceptance:** A demo administrator cannot connect a production dataset or issue a production evidence report.

### FR-IAM-001 — User invitations

**P0 · original R1**

Invitations shall identify organisation, proposed roles, scope, inviter and expiry; acceptance shall verify the invitee and prevent reuse.

**Acceptance:** An expired or already accepted invitation cannot create another membership.

### FR-IAM-002 — Authentication

**P0 · original R1**

Users shall authenticate through approved enterprise federation or secure local accounts; shared human accounts shall be prohibited.

**Acceptance:** Each accepted write and approval is attributable to one uniquely identified human or service principal.

### FR-IAM-003 — Multifactor authentication

**P0 · original R1**

Multifactor authentication shall be mandatory for privileged users and anyone accessing restricted data or approvals; phishing resistant methods shall be available.

**Acceptance:** A restricted dataset remains inaccessible after password only authentication.

### FR-IAM-004 — Enterprise federation

**P1 · original R1**

The platform shall support institutional single sign on using approved SAML or OpenID Connect profiles with verified organisation mapping.

**Acceptance:** A federated identity cannot claim an organisation or administrator role using an untrusted attribute.

### FR-IAM-005 — Provisioning and deprovisioning

**P1 · original R2**

The platform shall support managed directory provisioning, group mapping and deprovisioning, including SCIM where required by an institution.

**Acceptance:** A directory removal revokes mapped memberships within the agreed revocation objective and creates an audit event.

### FR-IAM-006 — Account recovery

**P0 · original R1**

Recovery shall verify identity, invalidate compromised credentials and notify the legitimate user; support staff shall not bypass multifactor controls without a reviewed recovery procedure.

**Acceptance:** A recovery attempt cannot replace a privileged authentication factor through email access alone.

### FR-IAM-007 — Session management

**P0 · original R1**

Users and security administrators shall view and revoke sessions; inactivity, absolute expiry and step up authentication shall follow the active risk policy.

**Acceptance:** A revoked session fails its next protected action within the specified revocation limit.

### FR-IAM-008 — Membership changes

**P0 · original R1**

Joiner, mover and leaver workflows shall remove obsolete privileges, reassign responsibilities and preserve authorship history.

**Acceptance:** A departing reviewer loses active access without losing attribution on signed historical decisions.

### FR-IAM-009 — Temporary access

**P0 · original R1**

Guest memberships and exceptional privileges shall have an owner, purpose, expiry and review; indefinite guest access shall be disallowed.

**Acceptance:** Expired access is denied by both the user interface and the API without manual cleanup.

### FR-IAM-010 — Service identities

**P0 · original R1**

Automations and integrations shall use separately governed service identities with limited scopes, credential rotation and a named owner.

**Acceptance:** A service credential cannot perform a human clinical signoff or inherit its owner's unrelated privileges.

### FR-IAM-011 — User preferences

**P1 · original R1**

Users shall manage language, timezone, accessibility settings, notification channels and ordinary profile information without changing verified professional credentials.

**Acceptance:** Changing a display name does not alter the verified signer identity on an issued report.

### FR-IAM-012 — Professional verification

**P0 · original R1**

Clinical investigators, adjudicators and authorised signers shall have role specific credentials, verification evidence, validity periods and restrictions recorded.

**Acceptance:** Expired credentials block new restricted decisions while preserving historical decisions for review.

### FR-IAM-013 — Identity reconciliation

**P1 · original R1**

Duplicate identities and changed institutional addresses shall be reconciled through verified procedures with an audit trail.

**Acceptance:** Two accounts cannot be merged in a way that removes an existing conflict of interest declaration.

### FR-IAM-014 — Access recertification

**P0 · original R1**

Institutional owners shall periodically review active users, service identities and permissions; overdue high risk access shall follow a defined suspension policy.

**Acceptance:** The review lists actual effective privileges and records retain, reduce or revoke decisions.

### FR-ACC-001 — Permission model

**P0 · original R1**

The platform shall combine roles with organisation, country, study, dataset, purpose, sensitivity, lifecycle state and time constraints; default access shall be denied.

**Acceptance:** A user with an evaluator role cannot read an unassigned study merely because both share a country.

### FR-ACC-002 — Granular actions

**P0 · original R1**

Permissions shall distinguish discover, view metadata, view records, edit, execute, approve, export, publish, administer and delete.

**Acceptance:** Permission to view a result does not automatically permit downloading its underlying records.

### FR-ACC-003 — Independent approval

**P0 · original R1**

The submitter or commercial beneficiary of an evaluation shall not be its sole final scientific approver; conflicting assignments shall be blocked or independently resolved.

**Acceptance:** A developer attempting to approve its own product's final report receives a recorded denial.

### FR-ACC-004 — Privileged administration

**P0 · original R1**

Platform administrators shall not receive routine access to patient data, proprietary models or sealed benchmarks by virtue of administrative status.

**Acceptance:** An administrator can manage an account without opening that account's restricted study files.

### FR-ACC-005 — Exceptional access

**P0 · original R1**

Emergency administrative access shall require a recorded purpose, narrow scope, time limit and independent oversight; local clinical emergency procedures remain separate.

**Acceptance:** The access session expires automatically and generates a reviewable record of every protected action.

### FR-ACC-006 — Permission inheritance

**P0 · original R1**

Inherited grants, group membership and explicit restrictions shall resolve predictably; administrators shall preview effective access before changes.

**Acceptance:** An explicit dataset restriction remains effective when a user receives a broader programme role.

### FR-ACC-007 — Uniform enforcement

**P0 · original R1**

Authorisation shall apply to APIs, search, previews, thumbnails, aggregate reports, exports, notifications, caches and asynchronous tasks.

**Acceptance:** A denied user's search counts and file previews do not disclose hidden objects.

### FR-ACC-008 — Access request workflow

**P0 · original R1**

Users shall request additional access with purpose and duration; authorised data and institutional owners shall decide with reasons.

**Acceptance:** Approval for one purpose cannot be reused for an unrelated study or training activity.

### FR-ACC-009 — Dual control

**P0 · original R1**

Sensitive exports, grant of powerful roles, evidence publication and deletion under special circumstances shall require the configured independent approvals.

**Acceptance:** One actor cannot satisfy two required approval roles on the same action.

### FR-ACC-010 — Permission changes during work

**P0 · original R1**

Active jobs, downloads and cached authorisations shall respond to revoked grants according to the safety and revocation policy.

**Acceptance:** A queued export is cancelled when its grant expires before delivery.

### FR-ACC-011 — Permission explanations

**P1 · original R1**

Authorised administrators shall inspect why access is granted or denied without disclosing restricted content to the requester.

**Acceptance:** A support explanation identifies the missing grant and responsible approver rather than revealing protected data.

### FR-ACC-012 — Conflict aware assignment

**P0 · original R1**

Financial, employment, authorship and organisational conflicts shall affect reviewer selection and the visibility of competing submissions.

**Acceptance:** A reviewer with a declared material conflict is excluded until an independent decision is recorded.

### FR-CTR-001 — Country profiles

**P0 · original R1**

Each participating country shall have a versioned profile of responsible authorities, ethics routes, data restrictions, approved activities and institutional contacts.

**Acceptance:** A study records the exact country profile version used at each gate.

### FR-CTR-002 — Applicability assessment

**P0 · original R1**

A qualified owner shall assess each study's intended use, device status, research status and applicable legal obligations; automated suggestions shall remain advisory.

**Acceptance:** No study becomes active with an unanswered mandatory applicability item.

### FR-CTR-003 — Rule provenance

**P0 · original R1**

Every mandatory country rule shall record its source, effective date, interpretation owner, review date and evidence of approval.

**Acceptance:** A source change creates a review task rather than silently changing a previously approved study.

### FR-CTR-004 — Residency and transfer rules

**P0 · original R1**

Profiles shall specify permitted storage, processing, support access, backup regions and cross border transfers for each data class.

**Acceptance:** An otherwise valid workspace request is blocked when its region conflicts with the dataset policy.

### FR-CTR-005 — Restriction precedence

**P0 · original R1**

The platform shall apply applicable legal restrictions, ethics conditions and contracts together; unresolved conflicts shall block the affected activity.

**Acceptance:** A permissive programme template cannot override a stricter data use agreement.

### FR-CTR-006 — Local terminology and language

**P1 · original R1**

Country profiles shall support languages, clinical guideline versions, terminology systems, currencies, units and timezone conventions.

**Acceptance:** A measurement is not interpreted in a different unit because a user changes display language.

### FR-CTR-007 — Rule change impact

**P0 · original R1**

Changes to country rules shall identify affected grants, studies, workspaces, reports and deployments and route decisions to accountable owners.

**Acceptance:** Affected owners receive an actionable list with suspend, remediate or retain decisions and reasons.

### FR-CTR-008 — Authority boundaries

**P0 · original R1**

The platform shall distinguish internal eligibility, ethics approval, research permission, market authorisation and procurement decisions with separate issuers and scopes.

**Acceptance:** An internal successful evaluation cannot populate a market authorisation field.

### FR-CTR-009 — Regulatory collaboration

**P1 · original R2**

Participating authorities may review permitted materials through scoped workspaces and record requests without gaining unrelated institutional access.

**Acceptance:** Two authorities reviewing the same solution see only the evidence explicitly shared with each.

### FR-CTR-010 — Profile activation

**P0 · original R1**

A country profile shall be activated only after local clinical, legal, privacy and operational owners approve the supported scope.

**Acceptance:** Marketing cannot advertise an active clinical sandbox in a country whose profile is still draft.

### FR-DEM-001 — Problem statements

**P1 · original R1**

Institutions shall register priority problems with affected population, current workflow, baseline, comparator, intended outcome and decision owner.

**Acceptance:** An opportunity cannot advance to funded evaluation without a defined decision and accountable institution.

### FR-DEM-002 — Calls for solutions

**P1 · original R1**

Managers shall publish versioned calls specifying eligibility, intended use, evidence needed, support offered, timelines and evaluation criteria.

**Acceptance:** Applicants retain the call version under which they submitted.

### FR-DEM-003 — Applicant screening

**P1 · original R1**

The service shall screen technical maturity, clinical relevance, affordability, licensing and deployment feasibility against declared criteria.

**Acceptance:** Rejected applicants receive authorised reasons and an available reconsideration route.

### FR-DEM-004 — Portfolio prioritisation

**P1 · original R1**

Programme owners shall score opportunities using transparent weights for need, readiness, equity, evidence gaps, cost and adoption prospects.

**Acceptance:** A ranking can be reproduced from its inputs and declared weights.

### FR-DEM-005 — Budget and buyer identification

**P1 · original R1**

Each funded study shall identify its payer, budget owner, purchasing decision, available envelope and funding expiry.

**Acceptance:** A study lacking an adoption buyer is explicitly labelled exploratory and excluded from adoption readiness claims.

### FR-DEM-006 — Feasibility review

**P1 · original R1**

Intake shall assess data availability, sample feasibility, reference standards, site capacity and integration constraints before commitment.

**Acceptance:** A feasibility decision records unresolved gaps and their cost and schedule consequences.

### FR-DEM-007 — Demand aggregation

**P1 · original R2**

Multiple health systems may define a shared evaluation need while retaining local thresholds and purchasing decisions.

**Acceptance:** A shared call produces distinct country decision records rather than one universal approval.

### FR-DEM-008 — Pipeline management

**P1 · original R1**

Managers shall track application status, owner, next action, age, blockers and reasons for withdrawal or rejection.

**Acceptance:** A pipeline report separates incomplete applications from scientifically unsuccessful evaluations.

### FR-NET-001 — Site registry

**P0 · original R1**

The service shall maintain site identity, service level, location, clinical capabilities, equipment, connectivity, data assets and responsible personnel.

**Acceptance:** A study can filter suitable sites using verified capabilities and current availability.

### FR-NET-002 — Qualification and renewal

**P0 · original R1**

Sites and specialist partners shall undergo documented due diligence, capability assessment and periodic requalification.

**Acceptance:** An expired qualification blocks new study allocation until reviewed.

### FR-NET-003 — Capacity planning

**P1 · original R1**

Sites shall publish capacity for data preparation, recruitment, evaluation and oversight with booking and overcommitment controls.

**Acceptance:** Two programme managers cannot unknowingly allocate the same unavailable clinical capacity.

### FR-NET-004 — Local accountability

**P0 · original R1**

Every clinical site shall identify its principal investigator or equivalent, data custodian and escalation contacts.

**Acceptance:** A live study cannot open a site without all required local accountable roles.

### FR-NET-005 — Partner agreements

**P1 · original R1**

Participation terms shall cover responsibilities, data access, compensation, incident reporting, publication and exit.

**Acceptance:** An agreement expiry is visible before a new study or renewal is approved.

### FR-NET-006 — Expert matching

**P1 · original R2**

Managers shall identify reviewers, statisticians and specialists by verified expertise, language, availability and conflict status.

**Acceptance:** A match explains its eligibility and never reveals a private competing application.

### FR-NET-007 — Site performance

**P1 · original R1**

Operational reports shall track timeliness, data quality, protocol adherence and workload without using recruitment volume as the sole quality measure.

**Acceptance:** Performance comparisons disclose case mix and data completeness limitations.

### FR-NET-008 — Partner suspension

**P0 · original R1**

The service shall suspend compromised or unqualified partners, stop new access and coordinate study continuity.

**Acceptance:** Affected studies receive a documented reassignment or safe closure plan.

### FR-NET-009 — Community participation

**P1 · original R2**

Programmes shall record community and patient representatives, consultation outcomes and responses to material concerns.

**Acceptance:** Community feedback has an accountable response and can influence the approved protocol.

### FR-SOL-001 — Product identity

**P0 · original R1**

Each solution shall record developer, manufacturer where relevant, owner, intended use, users, population, deployment setting and prohibited uses.

**Acceptance:** A solution cannot enter evaluation with an undefined intended population or user.

### FR-SOL-002 — Version identity

**P0 · original R1**

Each evaluated configuration shall bind model, software, prompts, retrieval corpus, rules, preprocessing, thresholds and material dependencies to immutable version identifiers.

**Acceptance:** Changing a decision threshold creates a new evaluated configuration rather than overwriting the old one.

### FR-SOL-003 — Submission package

**P1 · original R1**

Developers shall provide technical documentation, prior evidence, known limitations, security information, commercial terms and required runtime resources.

**Acceptance:** Submission validation identifies missing mandatory materials before scientific review begins.

### FR-SOL-004 — Claims register

**P0 · original R1**

Each performance or clinical claim shall identify supporting evidence, tested setting, date, limitations and whether it is independently verified.

**Acceptance:** A developer supplied claim remains visibly distinct from a sandbox finding.

### FR-SOL-005 — Regulatory status

**P0 · original R1**

The registry shall record jurisdiction, authority, reference, scope, version and validity of reported authorisations with verification status.

**Acceptance:** An authorisation for one use and jurisdiction is not displayed as unrestricted global clearance.

### FR-SOL-006 — Deployment modes

**P1 · original R1**

Submissions shall identify hosted API, local software, container, edge device or other supported execution modes and the visibility each permits.

**Acceptance:** A black box API submission identifies reproducibility and inspection limits before acceptance.

### FR-SOL-007 — Dependency disclosure

**P0 · original R1**

Developers shall disclose relevant third party models, services, licences, update policies and patient data transmission.

**Acceptance:** An undeclared external model provider prevents activation of a restricted data evaluation.

### FR-SOL-008 — Commercial readiness

**P1 · original R1**

Solutions shall disclose pricing structure, licensing restrictions, implementation needs, support, maintenance and exit conditions.

**Acceptance:** A procurement reviewer can distinguish evaluation access from production licensing rights.

### FR-SOL-009 — Confidentiality controls

**P1 · original R1**

Developers shall classify submission materials and propose sharing scopes subject to contractual and transparency obligations.

**Acceptance:** Publishing a public solution profile does not expose its proprietary model files.

### FR-SOL-010 — Withdrawal and recall

**P0 · original R1**

Developers and authorised operators shall withdraw submissions or flag recalls without deleting existing findings, safety history or obligations.

**Acceptance:** A withdrawn version is unavailable for new studies while its historical evidence remains traceable.

### FR-SOL-011 — Comparable profiles

**P1 · original R2**

The public and restricted catalogues shall use consistent metadata and filters for use case, evidence status, population and operating requirements.

**Acceptance:** Search results do not rank unlike clinical tasks by a single undifferentiated accuracy score.

### FR-SOL-012 — Ownership disputes

**P0 · original R1**

The service shall record ownership challenges, restrict disputed assets and preserve evidence while a responsible institution resolves the dispute.

**Acceptance:** A disputed uploader cannot transfer or delete the challenged asset during a hold.

### FR-AGR-001 — Agreement register

**P0 · original R1**

The platform shall track participation, confidentiality, data use, processing, evaluation, licensing and site agreements with parties, versions and signatures.

**Acceptance:** A study gate evaluates the active signed agreement rather than an unsigned draft.

### FR-AGR-002 — Rights by activity

**P0 · original R1**

Agreements shall separately identify rights to inspect, execute, modify, fine tune, train, retain, publish and transfer assets.

**Acceptance:** Permission to run inference does not authorise training or model weight redistribution.

### FR-AGR-003 — Evidence ownership

**P0 · original R1**

Contracts shall specify ownership, use rights, publication rights and confidentiality for raw data, derived data, models, results and reports.

**Acceptance:** A report export checks the rights of all contributing assets.

### FR-AGR-004 — Term and expiry

**P0 · original R1**

Effective dates, renewal, termination, surviving obligations and legal holds shall drive alerts and activity restrictions.

**Acceptance:** An expired data licence blocks new runs even if a study remains administratively open.

### FR-AGR-005 — Subprocessors and providers

**P0 · original R1**

The service shall register approved processors, subprocessors, external model providers and their permitted regions and retention terms.

**Acceptance:** A new provider cannot receive study data before its approval becomes effective.

### FR-AGR-006 — Funding restrictions

**P1 · original R1**

Sponsors shall attach eligible costs, reporting rules, geographic limits, milestones and spending periods to awards.

**Acceptance:** A charge outside the award period is flagged before invoicing or drawdown.

### FR-AGR-007 — Independence terms

**P0 · original R1**

Evaluation agreements shall define reviewer independence, treatment of negative results, developer response rights and final editorial authority.

**Acceptance:** A payer cannot remove an unfavourable finding from the signed scientific record.

### FR-AGR-008 — Contract exceptions

**P1 · original R1**

Proposed exceptions shall have an owner, rationale, approval, scope and expiry and shall not waive nonwaivable controls.

**Acceptance:** A commercial discount does not modify clinical safety or data protection requirements.

### FR-AGR-009 — Signature integration

**P1 · original R2**

The platform shall accept authenticated signatures or verified external signed documents with signer identity and document integrity.

**Acceptance:** Replacing an agreement file invalidates its prior signature association.

### FR-AGR-010 — Liability allocation

**P0 · original R1**

The service shall record responsibilities for care, product performance, study conduct, data handling, insurance where required and incident response.

**Acceptance:** Activation is blocked where a required responsibility or coverage obligation is unresolved.

### FR-WFL-001 — Configurable gates

**P0 · original R1**

Workflows shall define mandatory evidence, responsible roles, dependencies and permitted transitions by study type and country.

**Acceptance:** Users cannot skip an applicable ethics or data gate by changing a display status.

### FR-WFL-002 — Task orchestration

**P1 · original R1**

The platform shall assign tasks, deadlines, dependencies, reminders and escalation paths with clear ownership.

**Acceptance:** A blocked task shows the dependency and accountable party rather than an unexplained delay.

### FR-WFL-003 — Decision records

**P0 · original R1**

Each gate decision shall record decision, scope, evidence versions, conditions, reasons, signer and timestamp.

**Acceptance:** A report can reconstruct precisely which documents supported the decision.

### FR-WFL-004 — Parallel review

**P0 · original R1**

Independent reviewers shall work concurrently where appropriate with controlled visibility and conflict checks.

**Acceptance:** A blinded reviewer cannot see another review before its permitted unblinding point.

### FR-WFL-005 — Conditional decisions

**P0 · original R1**

Approvals with conditions shall record measurable obligations, responsible owners and expiry or recheck triggers.

**Acceptance:** An unmet prerequisite condition prevents the dependent activity from starting.

### FR-WFL-006 — Rework and resubmission

**P0 · original R1**

Applicants shall answer queries and resubmit versioned materials without destroying earlier reviews.

**Acceptance:** Reviewers can compare the changed material and distinguish new evidence from unchanged claims.

### FR-WFL-007 — Appeals

**P1 · original R1**

Applicants shall have an auditable appeal route with grounds, deadlines and an independent reviewer or panel.

**Acceptance:** The original decision maker cannot be the sole adjudicator of the appeal.

### FR-WFL-008 — Suspension and resumption

**P0 · original R1**

Authorised safety or governance owners shall suspend affected work; resumption requires recorded remediation and approval.

**Acceptance:** A commercial manager cannot resume a clinical suspension independently.

### FR-WFL-009 — Amendments

**P0 · original R1**

Material changes to intended use, protocol, data, model, sites or oversight shall trigger impact assessment and appropriate reapproval.

**Acceptance:** An added site cannot recruit under another site's approval unless explicitly covered.

### FR-WFL-010 — Service clocks

**P1 · original R1**

Review timers shall separate active work, applicant delay, external authority delay and agreed pauses.

**Acceptance:** Turnaround reporting cannot improve by silently resetting an application's start date.

### FR-ETH-001 — Ethics applicability

**P0 · original R1**

Every study shall record whether ethics review is required and the qualified determination supporting approval, exemption or another lawful route.

**Acceptance:** An evaluator cannot self declare exemption without the required institutional authority.

### FR-ETH-002 — Approval records

**P0 · original R1**

Ethics permissions shall capture issuing body, protocol version, sites, population, conditions, dates and approved materials.

**Acceptance:** A study cannot use an approval that covers a different protocol or excluded population.

### FR-ETH-003 — Consent and notices

**P0 · original R2**

Prospective studies shall maintain approved participant information, consent or authorised waiver basis, language versions and collection evidence.

**Acceptance:** A participant's record identifies the exact consent materials and basis that apply.

### FR-ETH-004 — Vulnerable populations

**P0 · original R2**

Protocols involving children or other vulnerable groups shall specify applicable safeguards, assent or representative processes and exclusions.

**Acceptance:** Recruitment blocks when the required authorised consent pathway is missing.

### FR-ETH-005 — Secondary use

**P0 · original R1**

Retrospective use shall document permitted purposes, lawful basis and ethics conditions independently of assumptions about deidentification.

**Acceptance:** A deidentified dataset is rejected for a purpose excluded by its data use agreement.

### FR-ETH-006 — Participant withdrawal

**P0 · original R2**

Withdrawal requests shall stop relevant future participation and trigger an assessment of permitted retention and analysis obligations.

**Acceptance:** The participant and study owner receive an outcome showing what ceased and what must remain.

### FR-ETH-007 — Clinical oversight

**P0 · original R2**

Studies influencing care shall specify qualified supervision, escalation, standard care fallback and responsibilities at each site.

**Acceptance:** The study cannot start until a local accountable clinician accepts the oversight plan.

### FR-ETH-008 — Ethics renewal

**P0 · original R1**

Expiry and amendment conditions shall trigger alerts and prevent unauthorised continued activity.

**Acceptance:** New affected activity stops at expiry unless a valid extension is recorded.

### FR-ETH-009 — Participant communication

**P1 · original R2**

The service shall support approved communication of study information, material changes and results through site appropriate channels.

**Acceptance:** Messages are checked for language, confidentiality and approved content before release.

### FR-ETH-010 — Ethical complaints

**P0 · original R1**

Participants and staff shall have accessible routes to raise concerns, including confidential handling and protection against retaliation.

**Acceptance:** A complaint receives an independent owner and cannot be deleted by the subject of the complaint.

### FR-DAC-001 — Dataset catalogue

**P0 · original R1**

Each dataset shall describe custodian, modality, provenance, population, time period, geography, quality, permitted uses, sensitivity and access conditions.

**Acceptance:** A catalogue entry can be discoverable without exposing records or sensitive sample counts.

### FR-DAC-002 — Data access applications

**P0 · original R1**

Applicants shall specify purpose, protocol, users, environment, duration, outputs and training intent for each access request.

**Acceptance:** The custodian can approve a restricted subset or deny with reasons.

### FR-DAC-003 — Purpose bound grants

**P0 · original R1**

Data permissions shall bind approved users, study, purpose, dataset version, region and duration and be enforced on execution and export.

**Acceptance:** A valid grant for evaluation cannot be used by a training job.

### FR-DAC-004 — Consent and legal basis metadata

**P0 · original R1**

Datasets shall retain applicable consent categories, lawful basis, use restrictions and evidence references at suitable granularity.

**Acceptance:** A mixed dataset can exclude records that are not authorised for the requested purpose.

### FR-DAC-005 — Data minimisation

**P0 · original R1**

Study owners shall justify required fields, granularity and retention; approved views shall expose only the necessary information.

**Acceptance:** An evaluator using age bands cannot request dates of birth without a new approved need.

### FR-DAC-006 — Data residence

**P0 · original R1**

The catalogue shall record where original, working, derived, cached and backup data may reside and whether remote access is allowed.

**Acceptance:** A cross border support session is evaluated under the same applicable restrictions as processing.

### FR-DAC-007 — Pseudonymisation

**P0 · original R1**

Direct identifiers and linkage keys shall be separated and restricted; pseudonymised data shall remain governed as sensitive personal data where applicable.

**Acceptance:** Evaluation users cannot recover identities using the linkage key store.

### FR-DAC-008 — Revocation and downstream impact

**P0 · original R1**

A revoked grant shall identify active workspaces, copies, jobs, exports and derived outputs requiring action.

**Acceptance:** New access stops promptly and each affected asset receives an accountable remediation decision.

### FR-DAC-009 — Controlled exports

**P0 · original R1**

Outputs shall be assessed for personal information, small cells, memorisation and contractual restrictions before authorised release.

**Acceptance:** A result containing disallowed patient rows is withheld even when its aggregate score is releasable.

### FR-DAC-010 — Federated access

**P1 · original R2**

A dataset may remain with its custodian while approved evaluation work and reviewed outputs move under local rules.

**Acceptance:** A local custodian can refuse a run or an output release independently of central scheduling.

### FR-DAC-011 — Benchmark secrecy

**P0 · original R1**

Sealed evaluation sets shall have limited custodians, query budgets and rules preventing disclosure or repeated optimisation against hidden labels.

**Acceptance:** A developer cannot download sealed labels or bypass its submission limit with a duplicate identity.

### FR-DAC-012 — Data rights requests

**P0 · original R1**

The service shall route access, correction, objection and deletion requests to the responsible controller with deadlines and evidence of disposition.

**Acceptance:** A request is not automatically fulfilled in a way that destroys a lawful clinical record or legal hold.

### FR-ING-001 — Import methods

**P0 · original R1**

Approved users shall import supported files or connect authorised source systems with declared source, schema, owner and expected volume.

**Acceptance:** An import without an authorised source and active access grant cannot enter a study workspace.

### FR-ING-002 — Quarantine and scanning

**P0 · original R1**

Incoming files, archives, models and attachments shall be quarantined and checked for malware, unsupported content and unsafe structures.

**Acceptance:** A failed scan prevents previews, execution and downstream indexing.

### FR-ING-003 — Schema and semantic validation

**P0 · original R1**

Imports shall validate field types, required values, units, codes, time ordering and modality specific constraints.

**Acceptance:** A plausible numeric value with an incompatible unit is flagged rather than silently accepted.

### FR-ING-004 — Identity and deduplication

**P0 · original R1**

Imports shall detect duplicates, repeated participants and linkage ambiguity without exposing unnecessary identifiers.

**Acceptance:** Repeated encounters remain distinguishable from accidental duplicate records.

### FR-ING-005 — Import reconciliation

**P0 · original R1**

The platform shall reconcile source, accepted, rejected and quarantined counts with record level reasons visible to authorised users.

**Acceptance:** An import cannot report complete while unaccounted records remain.

### FR-ING-006 — Resumable transfer

**P0 · original R1**

Large uploads shall support interrupted transfer recovery, integrity verification and duplicate safe retries.

**Acceptance:** A resumed upload produces one verified asset with the expected checksum.

### FR-ING-007 — Provenance lineage

**P0 · original R1**

Transformations shall retain source version, applied rules, actor, timestamp and destination versions without overwriting source evidence.

**Acceptance:** A reported metric can be traced back through every material transformation.

### FR-ING-008 — Data correction

**P1 · original R1**

Custodians shall correct data through controlled versions and issue impact notifications to affected analyses.

**Acceptance:** Correcting a label creates a new dataset version and marks dependent reports for assessment.

### FR-ING-009 — Deidentification review

**P0 · original R1**

Relevant modalities shall undergo identifier detection and human review as required, including metadata, free text and burned in image identifiers.

**Acceptance:** Removing structured identifiers alone does not mark an imaging dataset safe to release.

### FR-ING-010 — Scheduled ingestion

**P1 · original R2**

Approved connectors shall support incremental ingestion, freshness monitoring, schema change detection and safe replay.

**Acceptance:** An incompatible source change pauses affected processing and identifies the responsible integration owner.

### FR-CUR-001 — Reference standard definition

**P0 · original R1**

Each evaluation shall document its reference standard, rationale, timing, limitations and adjudication method.

**Acceptance:** A protocol cannot label an unverified model prediction as clinical ground truth.

### FR-CUR-002 — Annotation work allocation

**P1 · original R1**

Managers shall allocate annotation tasks by verified expertise, permitted data access and blinding rules.

**Acceptance:** An annotator cannot open an unassigned task or access a disallowed patient identifier.

### FR-CUR-003 — Annotation guidelines

**P0 · original R1**

Instructions, label definitions and examples shall be versioned and approved before use.

**Acceptance:** Every label records the applicable guideline version and annotator identity.

### FR-CUR-004 — Independent labelling

**P0 · original R1**

Studies shall support multiple independent labels and adjudication by an eligible reviewer when their protocol requires it.

**Acceptance:** Initial independent labels remain recoverable after adjudication.

### FR-CUR-005 — Agreement and quality checks

**P1 · original R1**

The system shall calculate appropriate interrater agreement and sample quality checks, with methods and denominators disclosed.

**Acceptance:** A quality report distinguishes consensus, disagreement and missing labels.

### FR-CUR-006 — Uncertain and unavailable labels

**P0 · original R1**

Reference data shall represent uncertainty, indeterminate findings and unavailable follow up without forcing a binary label.

**Acceptance:** An indeterminate outcome is handled according to the prespecified analysis plan.

### FR-CUR-007 — Blinding controls

**P0 · original R1**

Label assignment shall restrict access to model outputs or other information that could bias the reference standard.

**Acceptance:** A blinded reviewer cannot see the evaluated model's prediction through exports or task history.

### FR-CUR-008 — Dataset partitions

**P0 · original R1**

Data owners shall control development, tuning, validation and final test partitions using patient, site and time boundaries as applicable.

**Acceptance:** Patient overlap across partitions is detected before an evaluation is accepted.

### FR-CUR-009 — Curation release

**P0 · original R1**

A dataset release shall require quality review, rights verification and a frozen manifest of included records and labels.

**Acceptance:** A released dataset cannot change its membership without a new version.

### FR-CUR-010 — Specialist annotation integrations

**P1 · original R2**

The platform shall integrate approved annotation tools while preserving task identity, access rules and provenance.

**Acceptance:** Imported annotations reconcile to the original task and retain reviewer attribution.

### FR-RUN-001 — Workspace request

**P0 · original R1**

Workspace provisioning shall require approved study, configuration, data grants, execution region, access list and resource budget.

**Acceptance:** Provisioning fails when any required grant or prerequisite is expired.

### FR-RUN-002 — Execution isolation

**P0 · original R1**

Submitted models, containers and scripts shall run in isolated environments with approved privileges, storage, network access and controlled cleanup before resource reuse.

**Acceptance:** A workload cannot read another study's files, secrets or residual CPU or GPU memory.

### FR-RUN-003 — Network controls

**P0 · original R1**

Outbound access shall be denied unless explicitly required and authorised; allowed destinations and transmitted data shall be logged appropriately.

**Acceptance:** A model attempting an undeclared external API call is blocked and flagged.

### FR-RUN-004 — Resource quotas

**P0 · original R1**

The platform shall enforce compute, storage, concurrency, runtime and spend limits at study and institutional levels.

**Acceptance:** A runaway job stops at its approved limit and cannot exhaust another study's allocation.

### FR-RUN-005 — Reproducible run manifest

**P0 · original R1**

Every run shall bind input versions, model configuration, environment, dependencies, seeds where applicable, parameters and execution identity.

**Acceptance:** An authorised reviewer can reconstruct the exact configuration used for a reported result.

### FR-RUN-006 — Execution lifecycle

**P1 · original R1**

Users shall submit, queue, start, inspect, cancel and retry authorised runs with explicit states and failure reasons.

**Acceptance:** A failed job cannot be represented as a completed successful evaluation.

### FR-RUN-007 — Idempotent retries

**P0 · original R1**

Retries shall preserve lineage and avoid duplicate evidence, charges or downstream actions.

**Acceptance:** A network retry creates no second charge or duplicate final result for the same logical request.

### FR-RUN-008 — External API evaluation

**P0 · original R1**

Remote model endpoints shall be permitted only under approved data terms and recorded version guarantees or limitations.

**Acceptance:** An unpinned provider change marks comparability uncertain and triggers review.

### FR-RUN-009 — Output handling

**P0 · original R1**

Run outputs shall remain restricted until validated and reviewed under the applicable output release policy.

**Acceptance:** Logs containing patient data cannot be automatically attached to a public support ticket.

### FR-RUN-010 — Expiry and shutdown

**P0 · original R1**

Workspace access and new processing shall stop on grant expiry, suspension or study closure; retained assets follow policy.

**Acceptance:** A scheduled job cannot restart a closed workspace using an old credential.

### FR-RUN-011 — Remote execution nodes

**P1 · original R2**

Approved local institutions may operate execution nodes with policy enforcement, attestation evidence and connectivity status.

**Acceptance:** A disconnected node cannot be assumed to have received a stop instruction.

### FR-RUN-012 — Emergency termination

**P0 · original R1**

Authorised operators shall terminate unsafe sandbox execution and preserve necessary diagnostic evidence.

**Acceptance:** Termination prevents new affected execution and records the scope, requester and observed completion status.

### FR-PRO-001 — Protocol templates

**P0 · original R1**

Protocols shall specify intended use, setting, population, comparators, endpoints, data, risks, methods, oversight and decision rules.

**Acceptance:** A protocol with an undefined primary endpoint cannot be frozen for formal evaluation.

### FR-PRO-002 — Study type

**P0 · original R1**

The platform shall distinguish technical benchmarking, retrospective validation, simulation, silent prospective evaluation and interventional studies.

**Acceptance:** Study type determines required gates and allowable exposure of outputs to clinical users.

### FR-PRO-003 — Sample justification

**P0 · original R1**

An accountable statistician or qualified reviewer shall approve sample size or precision rationale, prevalence assumptions and subgroup feasibility.

**Acceptance:** An underpowered subgroup is labelled inconclusive rather than represented as proven safe.

### FR-PRO-004 — Prespecified thresholds

**P0 · original R1**

Clinical and technical thresholds shall be defined by intended use, comparator and risk before final testing.

**Acceptance:** Threshold changes after results are viewed create a protocol amendment and disclosed exploratory analysis.

### FR-PRO-005 — Analysis plan

**P0 · original R1**

The plan shall define missing data, exclusions, repeated measures, multiplicity, uncertainty estimates and handling of failed predictions.

**Acceptance:** An evaluator cannot silently remove model failures from the primary denominator.

### FR-PRO-006 — Comparator definition

**P0 · original R1**

Each comparative claim shall identify the comparator version, standard care workflow and comparable dataset or study design.

**Acceptance:** A comparison using different populations must disclose the limitation and cannot imply a controlled head to head result.

### FR-PRO-007 — Subgroup plan

**P0 · original R1**

Protocols shall prespecify relevant demographic, clinical, site, device, language and intersectional analyses with lawful data collection.

**Acceptance:** A missing protected attribute is shown as unassessed rather than interpreted as absence of bias.

### FR-PRO-008 — Freeze and amendment

**P0 · original R1**

Protocol and analysis versions shall be frozen before formal evaluation, with approved amendments and access to prior versions.

**Acceptance:** Final results link to the frozen plan and identify all departures from it.

### FR-PRO-009 — Stopping rules

**P0 · original R1**

Clinical studies and high risk tests shall define pause, stop, escalation and resumption criteria with accountable decision makers.

**Acceptance:** A trigger crossing creates the configured hold and requires the designated independent decision.

### FR-PRO-010 — Protocol reuse

**P1 · original R1**

Approved templates may be reused across sites or countries while identifying required local adaptation.

**Acceptance:** Reusing a template does not copy another country's ethics approval or clinical thresholds automatically.

### FR-PRO-011 — Risk proportional review

**P0 · original R1**

Review depth shall reflect intended use, harm potential, autonomy, evidence maturity and deployment context.

**Acceptance:** A high risk clinical use cannot enter through a low risk administrative template.

### FR-PRO-012 — Study registration

**P1 · original R2**

The service shall record applicable external study registration, identifier and timing and reconcile material changes.

**Acceptance:** A claimed registered study includes a verifiable registration reference and matching scope.

### FR-VAL-001 — Task appropriate metrics

**P0 · original R1**

The platform shall support registered metric definitions suited to classification, regression, segmentation, detection, forecasting or other admitted tasks.

**Acceptance:** Every reported metric identifies its definition, implementation version and denominator.

### FR-VAL-002 — Diagnostic performance

**P0 · original R1**

Diagnostic evaluations shall support sensitivity, specificity, predictive values, confusion matrices and threshold analysis where applicable.

**Acceptance:** Predictive values state the observed or assumed prevalence and are not transferred without qualification.

### FR-VAL-003 — Uncertainty estimates

**P0 · original R1**

Reports shall include appropriate confidence or uncertainty intervals and clustering adjustments when required by the study design.

**Acceptance:** Repeated observations from one patient are not treated as independent without justification.

### FR-VAL-004 — Calibration and utility

**P0 · original R1**

Risk score evaluations shall assess calibration and decision consequences where relevant, alongside discrimination.

**Acceptance:** A high discrimination score alone cannot satisfy a protocol requiring calibration or clinical utility.

### FR-VAL-005 — Missing and rejected inputs

**P0 · original R1**

Tests shall measure missing fields, poor quality inputs, abstentions, unsupported cases and failed outputs under explicit scoring rules.

**Acceptance:** All attempted cases reconcile across scored, abstained, rejected and failed categories.

### FR-VAL-006 — External validation

**P0 · original R1**

Evaluation records shall identify independence from development data and report site, temporal and population differences.

**Acceptance:** A developer's tuning set cannot be labelled an independent external test set.

### FR-VAL-007 — Robustness testing

**P0 · original R1**

Relevant tests shall examine input variation, noise, device differences, distribution shift and operational constraints.

**Acceptance:** Reports distinguish tested conditions from unsupported assumptions about robustness.

### FR-VAL-008 — Subgroup results

**P0 · original R1**

The system shall report prespecified subgroup performance, uncertainty, sample sufficiency and clinically relevant gaps.

**Acceptance:** A suppressed small cell remains marked as suppressed rather than displayed as zero.

### FR-VAL-009 — Baseline comparison

**P0 · original R1**

Evaluations shall compare against the approved baseline using consistent inclusion and analysis rules.

**Acceptance:** A benefit claim identifies both absolute and relative differences where relevant.

### FR-VAL-010 — Independent reproduction

**P0 · original R1**

An independent reviewer shall be able to verify reported outputs from retained manifests, data access and approved metric code.

**Acceptance:** A reproduced result outside the declared tolerance triggers an investigation before report issue.

### FR-VAL-011 — Custom metric governance

**P1 · original R2**

Qualified teams may register task specific metrics with documentation, validation and version controls.

**Acceptance:** A custom metric cannot replace a primary endpoint without an approved protocol change.

### FR-VAL-012 — Evidence interpretation

**P0 · original R1**

Automated score calculation shall remain separate from the authorised interpretation of clinical significance and suitability.

**Acceptance:** A benchmark score cannot automatically issue a clinical suitability decision.

### FR-GEN-001 — Generative configuration identity

**P0 · original R2**

Evaluation shall bind base model version, prompts, tools, retrieval corpus, decoding settings, guardrails and context limits.

**Acceptance:** A prompt or retrieval update invalidates claims of an unchanged evaluated configuration.

### FR-GEN-002 — Clinical answer assessment

**P0 · original R2**

Tests shall assess factuality, harmful omissions, inappropriate reassurance, unsafe recommendations, uncertainty and escalation using qualified clinical review.

**Acceptance:** A fluent but clinically unsafe answer is treated as a safety failure under the approved rubric.

### FR-GEN-003 — Grounding and citations

**P0 · original R2**

Tests shall assess whether retrieved sources support generated claims and whether guideline jurisdiction and currency are appropriate.

**Acceptance:** A plausible fabricated citation is counted as an error rather than credited for formatting.

### FR-GEN-004 — Interaction testing

**P0 · original R2**

Evaluation shall cover multi turn conversations, contradictory inputs, changing context, long records and follow up questions.

**Acceptance:** Performance reporting identifies failures that appear only across multiple turns.

### FR-GEN-005 — Language and population coverage

**P0 · original R2**

Tests shall include approved languages, dialects, health literacy levels and locally relevant presentations with competent reviewers.

**Acceptance:** English performance cannot substitute for evidence in another advertised clinical language.

### FR-GEN-006 — Adversarial safety

**P0 · original R2**

Authorised testing shall assess prompt injection, malicious documents, tool misuse, leakage and unsafe instruction following in isolated environments.

**Acceptance:** Successful bypasses are recorded with impact and remediation evidence without releasing sensitive attack artefacts publicly.

### FR-GEN-007 — Agent permissions

**P0 · original R2**

Agents shall operate within explicit action scopes, simulation boundaries and approval requirements for consequential actions.

**Acceptance:** A test agent cannot issue a real prescription, contact a patient or modify a live record without the separately authorised workflow.

### FR-GEN-008 — Judge validation

**P0 · original R2**

Automated evaluators shall have documented agreement with qualified human reviewers, known limitations and drift checks.

**Acceptance:** An unvalidated model judge cannot be the sole basis for a final clinical safety decision.

### FR-GEN-009 — Stochastic variation

**P0 · original R2**

Tests shall use prespecified repeat runs and report variability, rare severe failures and uncertainty where outputs are stochastic.

**Acceptance:** Reporting one favourable run while excluding unsuccessful repetitions is prevented or explicitly disclosed.

### FR-GEN-010 — Privacy and memorisation

**P0 · original R2**

Evaluations shall assess inappropriate disclosure, cross session leakage and relevant memorisation risk with controlled test data.

**Acceptance:** A model that exposes another participant's information triggers the incident and hold workflow.

### FR-GEN-011 — Cost and latency tradeoffs

**P1 · original R2**

Reports shall measure task completion, latency, resource consumption and human correction burden with the tested configuration.

**Acceptance:** A low per token price cannot be reported as total workflow cost.

### FR-GEN-012 — Synthetic evaluation limits

**P0 · original R2**

Synthetic cases and simulated patients shall be labelled, reviewed and separated from evidence based on real clinical outcomes.

**Acceptance:** Passing synthetic scenarios cannot automatically satisfy a requirement for prospective clinical evidence.

### FR-MOD-001 — Tabular prediction

**P1 · original R1**

Admitted structured data tasks shall support feature dictionaries, units, timestamps, missingness and leakage checks.

**Acceptance:** Post outcome variables are identified before a prediction evaluation is accepted.

### FR-MOD-002 — Imaging evaluation

**P1 · original R1**

Admitted imaging tasks shall support study series relationships, device metadata, relevant annotations and image quality assessment.

**Acceptance:** Results retain linkage to the correct examination and evaluated image series.

### FR-MOD-003 — Clinical text

**P1 · original R2**

Text evaluations shall preserve document context, redaction status, chronology and applicable language while restricting identifiers.

**Acceptance:** A summary evaluation can identify clinically material omissions from the authorised source record.

### FR-MOD-004 — Speech and audio

**P1 · original R2**

Speech evaluations shall assess clinically relevant transcription and comprehension errors, speaker variation and recording conditions.

**Acceptance:** Medical term errors and consequential negation errors remain distinguishable from ordinary word errors.

### FR-MOD-005 — Signals and devices

**P1 · original R3**

Time series and connected device tasks shall support sampling frequency, device versions, missing intervals and alignment requirements.

**Acceptance:** Misaligned sensor timestamps cannot be silently compared to clinical event labels.

### FR-MOD-006 — Multimodal systems

**P1 · original R2**

Combined input solutions shall be evaluated for modality contribution, missing modalities and inconsistent inputs.

**Acceptance:** A solution's advertised fallback behaviour is tested when one required modality is absent.

### FR-MOD-007 — Administrative and public health AI

**P1 · original R2**

Nonclinical workflow tools shall be assessed against their own operational and equity outcomes with documented clinical spillover risks.

**Acceptance:** A scheduling model is not assigned diagnostic metrics solely because it operates in a hospital.

### FR-MOD-008 — Capability admission

**P0 · original R1**

Each supported modality and study type shall have a validated evaluation pack, responsible experts and required controls before admission.

**Acceptance:** Unsupported tasks remain in discovery status and cannot receive a formal validated result.

### FR-HUM-001 — Workflow definition

**P0 · original R1**

Evaluations shall describe user roles, work steps, handoffs, decision authority and standard care fallback.

**Acceptance:** A model result cannot be interpreted without its intended position in the clinical workflow.

### FR-HUM-002 — Usability studies

**P1 · original R2**

Teams shall assess task completion, errors, training needs and cognitive workload with representative users in relevant settings.

**Acceptance:** A usability report identifies participant roles and includes observed failures as well as satisfaction.

### FR-HUM-003 — Human AI interaction

**P0 · original R2**

Tests shall assess overreliance, underreliance, overrides, alert fatigue and the quality of human review.

**Acceptance:** An apparent time saving is qualified when required verification work is omitted.

### FR-HUM-004 — Accessibility and inclusion

**P1 · original R2**

Studies shall examine barriers related to disability, literacy, language, connectivity and shared devices for the intended users.

**Acceptance:** A deployment plan includes mitigations for material exclusion risks identified during evaluation.

### FR-HUM-005 — Clinical workflow outcomes

**P0 · original R2**

Prospective evaluations shall capture referral completion, follow up, treatment delays and other relevant workflow outcomes.

**Acceptance:** A high detection rate alone cannot establish benefit when the protocol requires completed referral.

### FR-HUM-006 — Training effectiveness

**P1 · original R2**

Implementation teams shall record training participation, assessed competence, refresher needs and role specific permissions.

**Acceptance:** An untrained user cannot be enabled for a function requiring verified competence.

### FR-HUM-007 — Equity interpretation

**P0 · original R1**

Equity assessments shall consider access, error distribution and downstream burden as well as aggregate performance.

**Acceptance:** The report identifies who may lose access or bear additional costs under the proposed workflow.

### FR-HUM-008 — Patient and staff feedback

**P1 · original R2**

Feedback shall be collected through approved confidential channels and linked to issues and corrective actions.

**Acceptance:** Negative feedback remains visible to reviewers even when a site or developer disputes it.

### FR-HUM-009 — Economic measurement

**P1 · original R2**

Studies shall capture staff time, integration, equipment, training, recurring fees and downstream resource costs.

**Acceptance:** A cost effectiveness calculation states perspective, currency, price year, assumptions and uncertainty.

### FR-STU-001 — Site activation

**P0 · original R2**

Each site shall pass a readiness gate covering approvals, contracts, trained staff, systems, emergency procedures and resources.

**Acceptance:** No recruitment or care affecting evaluation can begin at an inactive site.

### FR-STU-002 — Eligibility and enrolment

**P0 · original R2**

Authorised site staff shall apply approved inclusion and exclusion criteria, document eligibility and prevent duplicate enrolment where relevant.

**Acceptance:** An ineligible enrolment creates a deviation and cannot be silently corrected out of the record.

### FR-STU-003 — Participant identifiers

**P0 · original R2**

Studies shall use site controlled identifiers and restrict reidentification and cross site linkage to approved roles.

**Acceptance:** Central evaluators receive only the participant information authorised by their study role.

### FR-STU-004 — Case report forms

**P0 · original R2**

The platform or approved integration shall support versioned forms, validation, queries, source references and correction history.

**Acceptance:** A corrected clinical observation retains its original value, reason, actor and timestamp.

### FR-STU-005 — Allocation and blinding

**P1 · original R2**

Studies requiring randomisation or allocation concealment shall use validated procedures and controlled unblinding.

**Acceptance:** Only authorised staff can unblind, with reason and downstream impact recorded.

### FR-STU-006 — Silent prospective mode

**P0 · original R2**

Outputs from silent evaluation shall remain unavailable for treatment decisions and clearly separated from active care interfaces.

**Acceptance:** A silent mode prediction cannot appear in a clinician's production worklist.

### FR-STU-007 — Interventional controls

**P0 · original R2**

Studies influencing care shall enforce authorised users, approved version, operating limits and oversight specified in the protocol.

**Acceptance:** A changed clinical configuration requires the defined amendment process before use.

### FR-STU-008 — Deviations and queries

**P0 · original R2**

Sites shall record protocol deviations, missing observations and data queries with resolution ownership and impact review.

**Acceptance:** A deviation affecting participant safety triggers escalation independently of ordinary data cleaning.

### FR-STU-009 — Monitoring and verification

**P0 · original R2**

Monitors shall review consent, eligibility, source evidence and study conduct within approved access boundaries.

**Acceptance:** Monitoring findings have accountable corrective actions and verifiable closure evidence.

### FR-STU-010 — Safety reporting

**P0 · original R2**

Sites shall report adverse events, near misses and serious concerns with timely local escalation and applicable reporting routes.

**Acceptance:** A report initiates safety review without waiting for causality to be proven.

### FR-STU-011 — Study closeout

**P0 · original R2**

Closeout shall reconcile participants, unresolved queries, safety events, assets, financial obligations and retention requirements.

**Acceptance:** A study cannot be marked fully closed while mandatory follow up obligations remain unassigned.

### FR-STU-012 — External study systems

**P1 · original R2**

Existing validated electronic data capture and trial systems may remain the source of record with controlled integration.

**Acceptance:** An imported record retains source identity and does not create an inconsistent competing master record.

### FR-SAF-001 — Safety case

**P0 · original R1**

Each admitted use shall maintain hazards, foreseeable misuse, mitigations, residual risks, evidence and accountable acceptance.

**Acceptance:** No clinical use proceeds with an unaccepted material residual risk.

### FR-SAF-002 — Incident intake

**P0 · original R1**

The service shall accept reports from authorised staff, institutions and appropriate external channels with confidentiality controls.

**Acceptance:** A reporter can raise a concern without needing permission from the implicated developer.

### FR-SAF-003 — Severity and triage

**P0 · original R1**

Qualified owners shall triage impact, affected population, urgency and scope while allowing uncertain initial information.

**Acceptance:** An incomplete but potentially serious report enters urgent review rather than being rejected by form validation.

### FR-SAF-004 — Containment

**P0 · original R1**

Authorised owners shall suspend affected datasets, versions, jobs or sites and communicate local containment responsibilities.

**Acceptance:** A targeted suspension prevents affected new activity without concealing historical evidence.

### FR-SAF-005 — Deployment stop coordination

**P0 · original R2**

For deployed tools, the platform shall issue stop or rollback instructions through approved channels and record acknowledgement from each site.

**Acceptance:** An unacknowledged instruction remains visibly unresolved and escalates to local contacts.

### FR-SAF-006 — Investigation

**P0 · original R1**

Investigations shall preserve artefacts, timestamps, decisions and chain of custody while restricting sensitive details.

**Acceptance:** An implicated party cannot alter retained evidence or close its own independent investigation.

### FR-SAF-007 — Corrective and preventive action

**P0 · original R1**

Actions shall identify root cause, owner, due date, verification method and recurrence prevention.

**Acceptance:** Closing an action requires verification evidence rather than a completion checkbox alone.

### FR-SAF-008 — Reportability assessment

**P0 · original R1**

Country owners shall determine applicable notifications, recipients and deadlines with legal and clinical input.

**Acceptance:** The platform records proof of submission or an explicit failure; an internal alert is not treated as statutory reporting.

### FR-SAF-009 — Cross study impact

**P0 · original R1**

An incident involving a shared dependency shall identify other potentially affected studies and product versions.

**Acceptance:** A recalled model component produces an actionable list of impacted evaluations and deployments.

### FR-SAF-010 — Resumption decision

**P0 · original R1**

Resumption shall require appropriate independent clinical, security or governance approval and a verified remediation scope.

**Acceptance:** Commercial pressure or payment status cannot override an active safety hold.

### FR-SAF-011 — External warning exchange

**P1 · original R2**

Approved safety summaries may be shared with participating networks under legal, confidentiality and accuracy review.

**Acceptance:** A shared warning excludes unauthorised patient data and clearly states unresolved causality.

### FR-SAF-012 — Learning and trend review

**P0 · original R1**

The service shall review near misses, recurring issues, overdue actions and emerging hazards on a defined cadence.

**Acceptance:** Repeated low severity incidents can trigger a systemic risk review.

### FR-EVD-001 — Evidence dossier

**P0 · original R1**

Each dossier shall assemble intended use, configuration, protocol, datasets, metrics, limitations, reviews, decisions and relevant external permissions.

**Acceptance:** A reviewer can trace each headline finding to the underlying approved evidence.

### FR-EVD-002 — Claim level provenance

**P0 · original R1**

Claims shall cite specific studies, populations, versions, dates and limitations rather than only a product level badge.

**Acceptance:** A new product version does not inherit an unsupported claim from an earlier version.

### FR-EVD-003 — Evidence status

**P0 · original R1**

Reports shall distinguish not assessed, in progress, insufficient evidence, meets specified criteria, fails specified criteria, superseded and withdrawn.

**Acceptance:** Insufficient evidence cannot be displayed as a positive outcome or averaged into a pass.

### FR-EVD-004 — Independent review

**P0 · original R1**

Final reports shall undergo scientific and clinical review appropriate to scope with declared conflicts and signed decisions.

**Acceptance:** A developer response is retained but cannot replace the independent conclusion.

### FR-EVD-005 — Report generation

**P0 · original R1**

Reports shall use approved templates with exact run references, analysis versions, units, denominators and uncertainty.

**Acceptance:** Regenerated reports preserve the same approved findings and identify the generator version.

### FR-EVD-006 — Scope and limitations

**P0 · original R1**

Every issued report shall prominently state tested use, population, setting, product version, exclusions and evidentiary limits.

**Acceptance:** A report cannot omit a material failed subgroup that was included in the approved analysis plan.

### FR-EVD-007 — Publication permissions

**P0 · original R1**

Public, partner and restricted report views shall follow approved publication rights and redaction decisions.

**Acceptance:** A public report does not reveal protected small cells, patient details or proprietary artefacts.

### FR-EVD-008 — Signed release and integrity

**P0 · original R1**

Issued reports shall have persistent identifiers, issue dates, authorised signers and a verifiable integrity record.

**Acceptance:** Altering a released report creates a new version and invalidates the altered copy's integrity check.

### FR-EVD-009 — Corrections and retractions

**P0 · original R1**

The service shall issue linked corrections, supersession notices and withdrawals with reasons and notification of prior recipients.

**Acceptance:** Opening a superseded report displays its current status and link to the authoritative successor.

### FR-EVD-010 — Evidence portability

**P1 · original R2**

An exportable dossier shall include structured metadata and human readable evidence with usage restrictions and unresolved gaps.

**Acceptance:** A receiving institution can identify what may be reused and what needs local validation.

### FR-EVD-011 — Results completeness

**P0 · original R1**

Final reports shall reconcile all prespecified endpoints, registered analyses, deviations and missing results.

**Acceptance:** Unreported endpoints block issue or require an explicit approved explanation.

### FR-EVD-012 — Public evidence catalogue

**P1 · original R2**

The catalogue shall show verified publication status and allow discovery by use, setting, population and evidence maturity.

**Acceptance:** Catalogue presence is not presented as an endorsement or universal approval.

### FR-REG-001 — Requirements checklist

**P1 · original R1**

Country reviewers shall maintain applicable submission checklists linked to authoritative sources and approved interpretations.

**Acceptance:** Each required item identifies its evidence location or a documented gap.

### FR-REG-002 — Submission packages

**P1 · original R2**

Authorised users shall assemble jurisdiction specific packages from approved dossier versions.

**Acceptance:** A package can contain different evidence and forms for two jurisdictions without changing the underlying findings.

### FR-REG-003 — External decision verification

**P0 · original R1**

Approvals and decisions shall identify issuing authority, reference, scope, date, conditions and verification evidence.

**Acceptance:** A developer assertion remains unverified until the designated verification process completes.

### FR-REG-004 — Authority questions

**P1 · original R2**

The system shall manage questions, responses, deadlines and changed documents with a complete submission history.

**Acceptance:** A response can be linked to the exact question and submitted file version.

### FR-REG-005 — Decision separation

**P0 · original R1**

Internal reviews, external authorisations and conditions shall have separate status records and responsible issuers.

**Acceptance:** Completing an internal checklist cannot mark a product legally authorised.

### FR-REG-006 — Change submissions

**P1 · original R2**

The service shall assess whether material changes require notification, additional evidence or renewed permission under the applicable profile.

**Acceptance:** A changed intended use triggers a regulatory impact task before clinical continuation.

### FR-REG-007 — Permission expiry

**P0 · original R1**

External conditions, renewal dates and withdrawal notices shall affect the activities they govern.

**Acceptance:** A withdrawn permission blocks affected new activity and initiates impact review.

### FR-REG-008 — Submission channel control

**P1 · original R2**

Direct authority submission shall occur only through an approved supported channel and authorised human release.

**Acceptance:** Preparing a package never automatically transmits it to an authority.

### FR-TRN-001 — Transfer request

**P1 · original R2**

A receiving institution shall define intended local use, population, sites, workflow and decision using an existing evidence dossier.

**Acceptance:** The request references a specific product and dossier version.

### FR-TRN-002 — Gap assessment

**P0 · original R2**

Qualified reviewers shall assess population, prevalence, language, equipment, guidelines, workflow, data rights and regulation differences.

**Acceptance:** The assessment identifies evidence that is reusable, uncertain or inapplicable with reasons.

### FR-TRN-003 — Local validation plan

**P0 · original R2**

The receiving institution shall approve the additional evaluation required to address material gaps.

**Acceptance:** A foreign positive report cannot bypass an unresolved local safety or applicability requirement.

### FR-TRN-004 — Adaptation tracking

**P1 · original R2**

Changes to language, rules, thresholds, integrations or training shall create a traceable local configuration.

**Acceptance:** Local modifications remain distinguishable from the original evaluated product.

### FR-TRN-005 — Evidence reliance decisions

**P0 · original R2**

Authorities and buyers shall record their own decisions to rely on external evidence, including scope and conditions.

**Acceptance:** No automated evidence passport grants mutual recognition between countries.

### FR-TRN-006 — Shared studies

**P1 · original R2**

Multi country protocols shall support a common core with local appendices, approvals and analysis plans.

**Acceptance:** A pooled result preserves country level findings and cannot conceal a material local failure.

### FR-TRN-007 — Reuse measurement

**P1 · original R2**

The service shall measure avoided duplicate tasks, adaptation cost and elapsed time with a stated counterfactual.

**Acceptance:** Estimated savings remain labelled estimates and do not double count shared work.

### FR-TRN-008 — Country withdrawal

**P0 · original R2**

A country or institution may leave the network while retaining rights and obligations under its agreements.

**Acceptance:** Withdrawal blocks new sharing without erasing lawful historical evidence or incident responsibilities.

### FR-DEP-001 — Adoption readiness

**P1 · original R1**

The service shall assess evidence, local permissions, financing, infrastructure, staffing, integration, support and maintenance readiness.

**Acceptance:** A scientifically successful evaluation can remain operationally unready with explicit blockers.

### FR-DEP-002 — Business case

**P1 · original R2**

Buyers shall receive cost, expected benefit, budget impact, procurement options, uncertainty and implementation dependencies.

**Acceptance:** The case includes integration and recurring operating costs as well as licence fees.

### FR-DEP-003 — Procurement support

**P1 · original R2**

The platform shall assemble neutral specifications, evidence references, requirements and evaluation criteria for an institution's purchasing process.

**Acceptance:** Paid participation cannot silently change procurement ranking or evaluation criteria.

### FR-DEP-004 — Deployment authorisation

**P0 · original R2**

Each deployment shall bind buyer, sites, intended use, approved configuration, permissions, owner and support arrangements.

**Acceptance:** A sandbox completion status alone cannot authorise production deployment.

### FR-DEP-005 — Implementation plan

**P1 · original R2**

Plans shall identify milestones, integrations, change management, training, support, budget and accountable owners.

**Acceptance:** Go live requires evidence that applicable readiness tasks are complete.

### FR-DEP-006 — Acceptance and fallback

**P0 · original R2**

Sites shall approve operational acceptance tests, downtime procedures, rollback and safe standard care fallback.

**Acceptance:** A failed integration acceptance test blocks the affected go live.

### FR-DEP-007 — Training and competency

**P1 · original R2**

Role specific training and competency records shall be linked to access and renewal requirements.

**Acceptance:** A user can be restricted from a clinical feature after required training expires.

### FR-DEP-008 — Production boundary

**P0 · original R2**

Evaluation and production environments, credentials, datasets and operational permissions shall remain explicitly separated.

**Acceptance:** An evaluation credential cannot write to a production patient record.

### FR-DEP-009 — Contract and budget transition

**P1 · original R2**

Pilot funding, production ownership, recurring budget and support handover shall be recorded before sustained deployment.

**Acceptance:** A pilot nearing funding expiry shows an accountable continuation or closure decision.

### FR-DEP-010 — Deployment register

**P0 · original R2**

Each site shall report installed version, configuration, operating dates and monitoring responsibilities.

**Acceptance:** A recall can locate all registered deployments of an affected version.

### FR-DEP-011 — Benefits realisation

**P1 · original R2**

The buyer shall compare observed outcomes and total costs with the approved business case on a defined schedule.

**Acceptance:** An adoption report identifies baseline, attribution limits and incomplete follow up.

### FR-DEP-012 — Safe termination

**P0 · original R2**

Contracts and plans shall define termination, replacement, data portability and continuity of care obligations.

**Acceptance:** A vendor exit leaves the institution with a documented transition and retained lawful records.

### FR-MON-001 — Monitoring plan

**P0 · original R2**

Every monitored deployment shall specify metrics, data sources, cadence, thresholds, owners, missing data handling and escalation.

**Acceptance:** A deployment cannot be labelled monitored without an active plan and functioning data source.

### FR-MON-002 — Operational telemetry

**P1 · original R2**

The service shall track availability, latency, failures, abstentions, input quality and usage within permitted data limits.

**Acceptance:** A missing telemetry feed is reported as unavailable rather than interpreted as zero incidents.

### FR-MON-003 — Clinical performance follow up

**P0 · original R2**

Where outcome data permit, the service shall assess performance and subgroup outcomes with delayed label handling.

**Acceptance:** Recent unlabelled cases cannot be counted as successful outcomes.

### FR-MON-004 — Drift detection

**P0 · original R2**

Monitoring shall distinguish input, outcome, workflow and performance shifts with documented limitations and review triggers.

**Acceptance:** A statistical drift signal creates a review rather than an unsupported conclusion of patient harm.

### FR-MON-005 — Version change intake

**P0 · original R2**

Developers and sites shall report changes to models, prompts, rules, dependencies, devices and local configurations.

**Acceptance:** A changed component identifies the associated evidence and monitoring plans for reassessment.

### FR-MON-006 — Change classification

**P0 · original R2**

Qualified owners shall determine whether a change requires regression tests, local revalidation, regulatory action or a new study.

**Acceptance:** A developer cannot unilaterally declare a material clinical change insignificant.

### FR-MON-007 — Revalidation scheduling

**P0 · original R2**

The service shall schedule periodic and event triggered revalidation and prevent stale findings from appearing current.

**Acceptance:** An overdue required revalidation produces an explicit restricted or expired evidence status.

### FR-MON-008 — Alert routing

**P0 · original R2**

Alerts shall have severity, owner, acknowledgement, deduplication, escalation and closure evidence.

**Acceptance:** Unacknowledged urgent alerts reach the backup contact within the configured escalation period.

### FR-MON-009 — Rollback tracking

**P0 · original R2**

Where integrations support rollback, requests shall identify target configuration, authority and site confirmation.

**Acceptance:** Central issuance does not imply a site completed rollback without positive confirmation.

### FR-MON-010 — Comparative surveillance

**P1 · original R2**

Portfolio views shall compare trends only where definitions, case mix and follow up support meaningful comparison.

**Acceptance:** A dashboard discloses incomparable denominators and cannot imply a global product ranking.

### FR-MON-011 — Monitoring handover

**P0 · original R2**

The operator shall transfer or terminate monitoring responsibilities explicitly when contracts end.

**Acceptance:** No deployment remains represented as actively monitored after its responsible service has stopped.

### FR-MON-012 — Evidence freshness

**P0 · original R2**

Reports and registry entries shall display latest review, monitored version, unresolved alerts and expiry conditions.

**Acceptance:** A buyer can identify that installed software differs from the version supporting a published claim.

### FR-ANA-001 — Role specific dashboards

**P1 · original R1**

Users shall see actionable views for developers, sites, reviewers, authorities, funders and operators within their access scopes.

**Acceptance:** A funder sees approved programme outcomes without receiving patient records by default.

### FR-ANA-002 — Portfolio funnel

**P1 · original R1**

Reports shall track need, application, feasibility, evaluation, decision, deployment and ongoing monitoring with withdrawal reasons.

**Acceptance:** A failed scientific evaluation is distinguishable from an unfunded otherwise suitable solution.

### FR-ANA-003 — Time and bottlenecks

**P1 · original R1**

The platform shall measure elapsed and active time at each stage, including external delays and rework.

**Acceptance:** Reported turnaround includes a published rule for paused and abandoned studies.

### FR-ANA-004 — Evidence quality reporting

**P1 · original R1**

Dashboards shall show completeness, independence, representativeness, unresolved findings and evidence age.

**Acceptance:** A large number of tests cannot substitute for missing independent clinical validation.

### FR-ANA-005 — Outcome reporting

**P1 · original R2**

Programmes shall report relevant clinical, operational, equity and economic outcomes with baseline and attribution limits.

**Acceptance:** Patient reach is not displayed as demonstrated health benefit.

### FR-ANA-006 — Resource and financial reporting

**P1 · original R1**

Managers shall view budget, committed and actual costs, capacity, receivables and funding runway at authorised granularity.

**Acceptance:** Study cost reconciles with approved compute, personnel and external service charges.

### FR-ANA-007 — Governed metrics

**P1 · original R1**

Every shared metric shall have definition, owner, source, refresh rate, allowed dimensions and version history.

**Acceptance:** A changed definition is visible in longitudinal comparisons.

### FR-ANA-008 — Privacy preserving reporting

**P0 · original R1**

Aggregate views shall apply suppression, scope and disclosure controls to filters, comparisons and exports.

**Acceptance:** Repeated small group queries cannot trivially reconstruct a protected individual's result.

### FR-ANA-009 — Report exports

**P1 · original R1**

Users shall export approved views with timestamp, filters, definitions, data freshness and confidentiality labels.

**Acceptance:** An exported chart retains qualifications that materially affect its interpretation.

### FR-ANA-010 — Scheduled reporting

**P1 · original R2**

Reports shall be generated and delivered only to authorised recipients with expiry and failure tracking.

**Acceptance:** A recipient removed before delivery does not receive the scheduled restricted report.

### FR-COL-001 — Contextual discussions

**P1 · original R1**

Users shall comment on specific requirements, protocol sections, assets and findings with permissions inherited from the object.

**Acceptance:** A comment mentioning a restricted study does not expose it to an unauthorised tagged user.

### FR-COL-002 — Assignments and reminders

**P1 · original R1**

Tasks shall support owners, due dates, dependencies, escalations and completion evidence.

**Acceptance:** A task cannot disappear when its assigned user leaves the organisation.

### FR-COL-003 — Notifications

**P1 · original R1**

Notifications shall use approved channels, minimise sensitive content and link to authenticated records.

**Acceptance:** Email subject lines and push previews do not include patient identifiers or confidential findings.

### FR-COL-004 — Consequential communications

**P0 · original R1**

Regulatory submissions, public publication and external safety notices shall require an authorised release action.

**Acceptance:** Drafting a message or report does not send or publish it automatically.

### FR-COL-005 — Meeting decisions

**P1 · original R1**

Meeting notes shall capture participants, conflicts, decisions, actions and approval of the final record.

**Acceptance:** A discussion summary cannot silently substitute for a required formal gate decision.

### FR-COL-006 — Document collaboration

**P1 · original R1**

The system shall support controlled versions, review comments, comparison and concurrent edit conflict handling.

**Acceptance:** One reviewer's edit cannot overwrite another reviewer's change without resolution.

### FR-COL-007 — Translation review

**P1 · original R2**

Translated clinical and legal materials shall retain source version, reviewer and approved language version.

**Acceptance:** An unreviewed machine translation is marked draft and cannot serve as approved consent material.

### FR-COL-008 — Communication audit

**P1 · original R1**

Material notifications shall record intended recipients, delivery status, acknowledgement when required and retries.

**Acceptance:** A failed delivery is not counted as successful notification.

### FR-LRN-001 — Knowledge library

**P1 · original R1**

The platform shall maintain approved protocols, checklists, methods, case studies and implementation guidance with owners and review dates.

**Acceptance:** Outdated guidance is labelled and excluded from default new study templates.

### FR-LRN-002 — Learning from failure

**P1 · original R2**

Programmes shall capture unsuccessful evaluations and implementation failures with approved confidentiality and publication scopes.

**Acceptance:** A case study can describe failure without exposing a protected developer or participant.

### FR-LRN-003 — Role based onboarding

**P1 · original R1**

Users shall receive required guidance for their role, including data handling, evaluation integrity and escalation.

**Acceptance:** Completion of mandatory onboarding is checked before restricted access is activated.

### FR-LRN-004 — Training records

**P1 · original R2**

Training shall have version, completion, assessment, renewal date and applicable roles.

**Acceptance:** Changing a material procedure identifies users requiring refresher training.

### FR-LRN-005 — Community exchange

**P1 · original R2**

Members may share approved questions, methods and events with moderation and conflict controls.

**Acceptance:** A community post cannot reveal sealed test data or private review materials.

### FR-LRN-006 — Method governance

**P1 · original R2**

Proposed new methods shall undergo validation and approval before they enter official templates or evaluation packs.

**Acceptance:** An experimental metric remains clearly identified until its review is complete.

### FR-LRN-007 — Network learning reports

**P1 · original R3**

The service may publish aggregated lessons and recurring evidence gaps under disclosure and rights review.

**Acceptance:** Published lessons distinguish observed findings from hypotheses and cannot imply universal applicability.

### FR-COP-001 — Assisted drafting

**P1 · original R2**

Users may obtain drafts of protocols, evidence summaries, applications and implementation plans grounded in approved sources.

**Acceptance:** Drafts are labelled as AI assisted and cannot become signed decisions without human review.

### FR-COP-002 — Permission aware retrieval

**P0 · original R2**

AI assistants shall retrieve only information the requesting user may access for the active purpose and study.

**Acceptance:** A prompt cannot expose another tenant's document, hidden review or sealed benchmark.

### FR-COP-003 — Source attribution

**P0 · original R2**

Material factual claims in generated summaries shall reference accessible evidence and distinguish inference or missing information.

**Acceptance:** Unsupported findings are flagged and are not inserted as verified study results.

### FR-COP-004 — Consequential action control

**P0 · original R2**

AI assistance shall not autonomously approve studies, grant access, issue clinical findings, publish reports, submit to authorities or spend unapproved funds.

**Acceptance:** Every consequential action requires the specified authorised human confirmation and gate checks.

### FR-COP-005 — Provider governance

**P0 · original R2**

Model providers, data transmission, retention, training use and processing regions shall meet approved institutional terms.

**Acceptance:** Restricted study content is not sent to a provider lacking applicable approval.

### FR-COP-006 — Untrusted content handling

**P0 · original R2**

Uploaded documents, retrieved pages and model outputs shall be treated as content rather than authority to change permissions or instructions.

**Acceptance:** Embedded instructions in a document cannot trigger an export or disable a review gate.

### FR-COP-007 — User correction

**P1 · original R2**

Users shall edit, reject and report generated content with retained provenance and feedback routing.

**Acceptance:** Correcting a draft does not erase the fact that AI assistance was used.

### FR-COP-008 — Assistant evaluation

**P0 · original R2**

Platform AI features shall have task specific quality, safety and privacy evaluation before activation and after material changes.

**Acceptance:** A failed critical safety or permission test prevents release of the feature.

### FR-COP-009 — Administrative controls

**P1 · original R2**

Institutions shall enable or disable AI features by purpose, data class and user role within mandatory controls.

**Acceptance:** A disabled feature cannot be invoked through an API or background task.

### FR-COP-010 — Fallback and abstention

**P0 · original R2**

The assistant shall indicate uncertainty and permit normal workflow completion when AI is unavailable or unsuitable.

**Acceptance:** A failed AI service cannot prevent an authorised user from filing a safety incident.

### FR-API-001 — Versioned interfaces

**P1 · original R1**

The platform shall expose documented versioned APIs for approved core objects with consistent authentication, pagination and error handling.

**Acceptance:** A published integration can identify the API version and supported deprecation period.

### FR-API-002 — Scoped integration access

**P0 · original R1**

Each connector shall have a separate owner, purpose, scopes, credentials, approved destinations and revocation path.

**Acceptance:** A reporting connector cannot inherit permission to export raw clinical data.

### FR-API-003 — Health record exchange

**P1 · original R2**

Selected clinical integrations shall support the receiving institution's agreed HL7 FHIR version and implementation profile where applicable.

**Acceptance:** Profile validation and unit or terminology mapping pass agreed conformance examples before activation.

### FR-API-004 — Medical imaging exchange

**P1 · original R1**

Imaging integrations shall support the agreed DICOM objects and services with identity, study relationship and deidentification checks.

**Acceptance:** Transferred images retain clinically necessary metadata while prohibited identifiers are handled as approved.

### FR-API-005 — Research and health information systems

**P1 · original R2**

The platform shall support approved connections to institutional EDC, laboratory, public health or research systems according to programme need.

**Acceptance:** Each connected field has an identified authoritative source and reconciliation rule.

### FR-API-006 — Import and export portability

**P0 · original R1**

Authorised data and metadata shall be exchangeable in documented nonproprietary formats with a data dictionary and version information.

**Acceptance:** A receiving tool can reconstruct object relationships from an approved export.

### FR-API-007 — Reliable events

**P0 · original R1**

Webhooks and events shall support verification, idempotency, retry, ordering assumptions and replay controls.

**Acceptance:** Repeated delivery does not duplicate a clinical decision, invoice or approval.

### FR-API-008 — Connector failures

**P0 · original R1**

Integration failures shall be visible, retriable where safe and isolated from unrelated workflows.

**Acceptance:** An unavailable external system cannot cause silent loss of an acknowledged source record.

### FR-API-009 — Mapping governance

**P0 · original R1**

Mappings for codes, units, time, identifiers and field meaning shall be reviewed and versioned.

**Acceptance:** An unrecognised clinical code is quarantined or explicitly represented rather than silently replaced.

### FR-API-010 — Identity and finance integrations

**P1 · original R2**

The service shall integrate approved identity directories, ticketing, accounting and signature systems with limited scopes.

**Acceptance:** An accounting integration receives billing data without gaining clinical evidence access.

### FR-API-011 — Connector lifecycle

**P0 · original R1**

New and changed connectors shall undergo security, data rights and conformance assessment and support controlled disablement.

**Acceptance:** Disabling a connector stops new transfers and preserves the record of past exchanges.

### FR-API-012 — External evidence exchange

**P1 · original R3**

Participating registries and governance networks may exchange approved evidence metadata through agreed schemas and permissions.

**Acceptance:** An external directory receives only the authorised metadata and current evidence status.

### FR-BIL-001 — Service catalogue

**P1 · original R1**

The service shall define evaluation, data preparation, implementation and monitoring packages with scope, exclusions and pricing basis.

**Acceptance:** A buyer can identify which activities and deliverables are included before contracting.

### FR-BIL-002 — Cost estimation

**P1 · original R1**

Study estimates shall include staff, sites, data preparation, compute, oversight, integration and contingency assumptions.

**Acceptance:** Estimate changes identify the driver and require the applicable budget approval.

### FR-BIL-003 — Quotes and approvals

**P1 · original R1**

Quotes, discounts and change orders shall be versioned with delegated approval limits and customer acceptance.

**Acceptance:** A change in scope cannot silently increase an institution's financial commitment.

### FR-BIL-004 — Budget controls

**P1 · original R1**

The platform shall allocate budgets, commitments, actual costs and funding sources with alerts and spend approval limits.

**Acceptance:** A study cannot exceed its approved hard spending limit through automatic retries.

### FR-BIL-005 — Usage metering

**P1 · original R1**

Billable consumption shall be attributable to institution, study, service and run with reconciliation and dispute support.

**Acceptance:** A failed retry is charged only according to the declared billing policy.

### FR-BIL-006 — Invoices and payments

**P1 · original R2**

The service shall support invoices, credits, payment status, local currency and applicable tax handling through approved finance processes.

**Acceptance:** An issued credit links to the original invoice and preserves audit history.

### FR-BIL-007 — Grant and subsidy management

**P1 · original R1**

Awards shall identify eligible recipients, permitted costs, milestones, reporting and remaining funds.

**Acceptance:** A subsidised evaluation shows the payer without changing the scientific scoring rules.

### FR-BIL-008 — Commercial independence

**P0 · original R1**

Payment, sponsorship and sales relationships shall not override data, ethics, safety or scientific gates.

**Acceptance:** An overdue invoice cannot delete unfavourable evidence or prevent an urgent safety report.

### FR-BIL-009 — Financial disputes

**P1 · original R2**

Billing disputes shall have an owner, evidence, timeline and decision separate from scientific appeals.

**Acceptance:** A scientific appeal remains available under its own policy despite an unrelated invoice dispute.

### FR-BIL-010 — Renewal and exit

**P1 · original R2**

Monitoring and service subscriptions shall have renewal, notice, transition and retained obligation records.

**Acceptance:** Service expiry triggers a documented handover and removes unsupported active monitoring claims.

### FR-AUD-001 — Audit coverage

**P0 · original R1**

The platform shall record authentication, access grants, restricted data reads, changes, executions, approvals, exports, publications and privileged activity.

**Acceptance:** A sampled sensitive action can be traced to actor, scope, object version, time and outcome.

### FR-AUD-002 — Audit integrity

**P0 · original R1**

Audit records shall be append only or equivalently protected with detectable tampering and restricted administrative access.

**Acceptance:** An administrator cannot alter an event without detection and a separately retained record.

### FR-AUD-003 — Before and after changes

**P0 · original R1**

Material changes shall preserve previous and new values or safe references, reasons and approvals without logging unnecessary secrets.

**Acceptance:** An investigator can reconstruct a permission change without exposing authentication credentials.

### FR-AUD-004 — Audit access

**P0 · original R1**

Auditors shall receive scoped read only access with confidentiality controls and no routine permission to alter study records.

**Acceptance:** An auditor cannot approve the report being audited.

### FR-AUD-005 — Control evidence library

**P1 · original R1**

The service shall maintain policies, control owners, assessments, test evidence, exceptions and renewal dates.

**Acceptance:** A requested control can be linked to its latest verification and unresolved findings.

### FR-AUD-006 — Compliance mapping

**P0 · original R1**

Qualified owners shall map applicable laws, contracts and standards to controls and evidence with versioned applicability decisions.

**Acceptance:** The platform cannot advertise compliance solely because a checklist template exists.

### FR-AUD-007 — Inspection support

**P0 · original R1**

Authorised inspections shall produce bounded evidence packages with access records, redaction and chain of custody.

**Acceptance:** The exported inspection package reconciles to the selected source versions.

### FR-AUD-008 — Legal holds

**P0 · original R1**

Authorised legal holds shall prevent affected destruction and record scope, reason, approver, review and release.

**Acceptance:** A scheduled deletion cannot remove a held record or its required supporting evidence.

### FR-AUD-009 — Exceptions and expiry

**P0 · original R1**

Control exceptions shall have compensating measures, risk owner, independent approval, scope and expiry.

**Acceptance:** An expired exception cannot silently remain active.

### FR-AUD-010 — Periodic assurance review

**P1 · original R1**

The service shall track security assessments, privacy reviews, clinical audits and remediation with accountable owners.

**Acceptance:** A recurring critical finding triggers escalation to the appropriate governance body.

### FR-AUD-011 — Certification claims

**P0 · original R1**

Any certification or accreditation claim shall identify issuing body, scope, version, validity and supporting evidence.

**Acceptance:** An assessment in progress is never displayed as a completed certification.

### FR-AUD-012 — Audit retention

**P0 · original R1**

Audit retention shall follow approved purpose and jurisdiction profiles with privacy controls and verifiable disposal.

**Acceptance:** Audit logs cannot be retained indefinitely solely because storage is available.

### FR-OPS-001 — Operational console

**P1 · original R1**

Operators shall see service health, queues, capacity, failures and dependencies without routine access to restricted study content.

**Acceptance:** Support can identify a failed job using metadata and approved diagnostics.

### FR-OPS-002 — Support access

**P0 · original R1**

Support cases shall use redacted attachments and explicit time limited approvals for any exceptional sensitive access.

**Acceptance:** A user filing a ticket does not grant blanket access to all institutional data.

### FR-OPS-003 — Incident management

**P1 · original R1**

Operational incidents shall have severity, owner, communications, recovery actions and post incident review.

**Acceptance:** Major incidents preserve a timeline and tracked corrective actions.

### FR-OPS-004 — Configuration control

**P0 · original R1**

Production configuration changes shall be reviewed, versioned, tested and reversible where appropriate.

**Acceptance:** Changing an access rule records who approved it and what affected scopes were assessed.

### FR-OPS-005 — Feature activation

**P0 · original R1**

Risky or conditional capabilities shall be activated only for scopes that pass their release and operational gates.

**Acceptance:** Enabling a user interface feature cannot bypass a missing clinical capability approval.

### FR-OPS-006 — Service notices

**P1 · original R1**

Maintenance and incident communications shall identify affected services, scope, expected impact and current status.

**Acceptance:** Users can distinguish a planned outage from failure of their own study.

### FR-OPS-007 — Capacity and quota management

**P1 · original R1**

Operators shall manage fair allocation, reservations and escalation for competing workloads.

**Acceptance:** A large commercial customer cannot consume protected capacity assigned to an active safety investigation.

### FR-OPS-008 — Backup and restore operations

**P0 · original R1**

Operators shall perform verified backups and controlled restores with residency, access and deletion restrictions preserved.

**Acceptance:** A restored environment does not reactivate revoked users or deleted data without reconciliation.

### FR-OPS-009 — Release management

**P0 · original R1**

Application and evaluation component releases shall include approvals, verification, rollback conditions and affected user communication.

**Acceptance:** A metric implementation update cannot silently alter previously issued results.

### FR-OPS-010 — Support service catalogue

**P1 · original R1**

Institutions shall know support hours, contact methods, escalation routes and responsibility boundaries.

**Acceptance:** Clinical sites have a local urgent route even when ordinary technical support is unavailable.

### FR-OPS-011 — Supplier continuity

**P0 · original R1**

Critical suppliers shall have assessed dependencies, exit options, incident contacts and change notification requirements.

**Acceptance:** A supplier outage can be linked to affected studies and recovery options.

### FR-OPS-012 — Institutional service reviews

**P1 · original R2**

The operator shall provide agreed reviews of performance, unresolved issues, costs and upcoming obligations.

**Acceptance:** Actions from the review have owners and due dates visible to both parties.

### FR-EXT-001 — Retention schedules

**P0 · original R1**

Data classes shall have approved retention triggers, durations, legal bases, holds and disposal methods by jurisdiction and contract.

**Acceptance:** A newly created asset inherits an explicit retention policy rather than an indefinite default.

### FR-EXT-002 — Study closure

**P0 · original R1**

Closure shall reconcile access, jobs, datasets, reports, incidents, contracts, billing and outstanding obligations.

**Acceptance:** A study cannot close its safety obligations by changing its administrative status.

### FR-EXT-003 — Data disposal

**P0 · original R1**

Expired assets shall be deleted or irreversibly rendered inaccessible according to policy, with copies and derived artefacts assessed.

**Acceptance:** A disposal record identifies completed actions, retained exceptions and backup expiry treatment.

### FR-EXT-004 — Backup deletion handling

**P0 · original R1**

Deletion policy shall define backup expiry and prevent restoration from resurrecting deleted or restricted records.

**Acceptance:** A restore applies the current deletion and revocation ledger before user access resumes.

### FR-EXT-005 — Institutional export

**P1 · original R1**

Institutions shall obtain authorised records, metadata, histories and evidence in documented portable formats.

**Acceptance:** An export includes relationship keys and definitions needed to interpret the files.

### FR-EXT-006 — Rights aware portability

**P0 · original R1**

Exports shall exclude assets the recipient has no right to retain and explain restrictions.

**Acceptance:** A departing partner cannot take another institution's raw data merely because both joined a study.

### FR-EXT-007 — User and tenant offboarding

**P0 · original R1**

Offboarding shall revoke credentials, transfer accountable ownership and preserve required authorship and audit records.

**Acceptance:** Deleting a user profile does not destroy the attribution of a clinical signoff.

### FR-EXT-008 — Operator succession

**P1 · original R2**

The service shall maintain an agreed plan for operator insolvency, acquisition or cessation including custody and continuity of essential records.

**Acceptance:** A tabletop exercise identifies who would receive evidence and incident responsibilities.

### FR-EXT-009 — Closure attestation

**P0 · original R1**

Authorised custodians shall issue closure or deletion attestations stating scope and lawful retention exceptions.

**Acceptance:** An attestation never claims deletion of data still retained under a documented hold.

### FR-EXT-010 — Residual obligations

**P0 · original R1**

The platform shall track surviving confidentiality, reporting, clinical follow up and financial obligations after access ends.

**Acceptance:** An expired commercial agreement does not remove a required safety follow up task.

### NFR-SEC-001 — Security verification baseline

**P0 · original R1**

The application shall meet the applicable OWASP ASVS 5.0.0 Level 2 requirements, with additional high assurance controls selected for privileged and restricted data paths.

**Acceptance:** An independent assessment records applicability and evidence; no unresolved exploitable critical or high finding remains at launch.

### NFR-SEC-002 — Transport protection

**P0 · original R1**

All protected browser, API, service and data transfer traffic shall use authenticated encryption with TLS 1.2 or higher; TLS 1.3 is preferred where supported.

**Acceptance:** Scanning finds no accepted plaintext protected endpoint or obsolete protocol; certificate failure blocks connection.

### NFR-SEC-003 — Stored data protection

**P0 · original R1**

Restricted data, backups and credentials shall be encrypted using approved contemporary cryptography and separately controlled key access.

**Acceptance:** Storage and backup inspection finds no unencrypted restricted payload or plaintext secret.

### NFR-SEC-004 — Authentication coverage

**P0 · original R1**

One hundred percent of privileged users, signers and restricted data users shall use multifactor authentication; privileged access shall use phishing resistant authentication or an approved equivalent institutional control.

**Acceptance:** Attempts to enter these scopes without the required assurance are denied in all supported clients.

### NFR-SEC-005 — Local credential policy

**P0 · original R1**

Local passwords shall permit at least 64 characters, require at least 15, reject known compromised values and avoid arbitrary composition or routine forced rotation without cause.

**Acceptance:** Password managers and paste work; recovery and change tests invalidate compromised sessions as specified.

### NFR-SEC-006 — Session expiry

**P0 · original R1**

Default inactivity expiry shall be 15 minutes for privileged sessions and 30 minutes otherwise, with a 12 hour maximum; critical approvals require authentication within the preceding 5 minutes.

**Acceptance:** Boundary tests confirm expiry and step up checks without losing safely saved drafts.

### NFR-SEC-007 — Revocation latency

**P0 · original R1**

Online permission and credential revocation shall take effect within 60 seconds across protected APIs, jobs and active sessions.

**Acceptance:** A distributed revocation test has no successful new protected action after the deadline; offline limits are documented separately.

### NFR-SEC-008 — Isolation assurance

**P0 · original R1**

Cross tenant, cross study and privilege escalation test suites shall cover every protected object and execution boundary.

**Acceptance:** No unauthorised access succeeds in the release suite or independent penetration test.

### NFR-SEC-009 — Secret handling

**P0 · original R1**

Secrets shall not appear in source repositories, client bundles, telemetry, reports or ordinary support logs; production secrets shall rotate at least every 90 days or faster after compromise.

**Acceptance:** Automated scans and sampled runtime inspection find no exposed active secret; rotation does not broaden access.

### NFR-SEC-010 — Abuse protection

**P0 · original R1**

Authentication, expensive queries and public interfaces shall have tested rate limits and abuse controls that preserve authorised safety reporting.

**Acceptance:** Load and brute force tests are contained without preventing the approved emergency reporting route.

### NFR-SEC-011 — Vulnerability response

**P0 · original R1**

Confirmed actively exploited or critical exposures shall be contained within 24 hours; high findings within 7 days and medium within 30 days unless formally risk accepted.

**Acceptance:** The vulnerability register measures discovery to containment and remediation, with overdue escalation.

### NFR-SEC-012 — Independent testing

**P0 · original R1**

An independent penetration test shall occur before production, annually and after material changes to trust boundaries; continuous dependency and code scanning shall cover releases.

**Acceptance:** Evidence includes remediation and retest of affected controls rather than only the original report.

### NFR-PRI-001 — Residency coverage

**P0 · original R1**

One hundred percent of restricted primary data, replicas, backups, logs containing sensitive content and remote support access shall conform to the approved regional policy.

**Acceptance:** A residency inventory and technical validation show no unapproved processing or copy location.

### NFR-PRI-002 — Purpose enforcement

**P0 · original R1**

Every restricted data execution and export shall have an active applicable purpose bound grant.

**Acceptance:** A sampled audit and negative tests find no run or export without the required grant.

### NFR-PRI-003 — Minimised telemetry

**P0 · original R1**

Production telemetry shall exclude raw patient records, unrestricted prompts, authentication secrets and proprietary model contents by default.

**Acceptance:** Synthetic sensitive markers inserted into test workflows do not appear in general telemetry.

### NFR-PRI-004 — Disclosure control

**P0 · original R1**

All public or shared aggregate releases shall pass approved small cell, linkage and inference risk rules; thresholds shall be set per context.

**Acceptance:** A disclosure test pack verifies suppression and complementary cell handling for all supported filters and exports.

### NFR-PRI-005 — Privacy impact review

**P0 · original R1**

Every new restricted processing purpose, provider or material transfer shall have a completed privacy and rights assessment before activation.

**Acceptance:** A release cannot enable the affected processing while a mandatory assessment is incomplete.

### NFR-PRI-006 — Data rights service

**P0 · original R1**

Requests shall be acknowledged within 2 business days and assigned within 1; completion follows the shorter applicable legal or contractual deadline.

**Acceptance:** The case register tracks deadlines, identity checks, holds and reasoned outcomes without assuming one global deadline.

### NFR-PRI-007 — Deletion execution

**P0 · original R1**

Approved deletion shall remove active copies within 30 days or a shorter applicable limit; backup expiry and holds shall be disclosed and enforced.

**Acceptance:** Verification confirms active deletion and prevents restoration from reintroducing disposed records.

### NFR-PRI-008 — Provider data use

**P0 · original R1**

No external model or analytics provider may train on or reuse restricted content without a separately documented lawful authorisation and explicit institutional approval.

**Acceptance:** Provider configuration and terms are verified before use; an unapproved change stops affected transmission.

### NFR-AVL-001 — Core availability

**P0 · original R1**

The production control plane shall target 99.9 percent monthly availability, measured through authenticated critical journeys in supported regions, including planned maintenance impact.

**Acceptance:** Independent probes and incident records reconcile successful available minutes; third party failures affecting the journey count.

### NFR-AVL-002 — Emergency reporting continuity

**P0 · original R1**

An out of band route shall remain available for urgent incidents and suspension requests when the platform is unavailable.

**Acceptance:** A quarterly outage exercise reaches an accountable operator and the relevant local site contact.

### NFR-AVL-003 — Recovery time

**P0 · original R1**

Core identity, access, study metadata, evidence and incident services shall recover within 4 hours after a declared recoverable regional disaster.

**Acceptance:** A twice yearly recovery exercise meets the target within permitted residency locations.

### NFR-AVL-004 — Recovery point

**P0 · original R1**

Recovery point objectives shall be at most 15 minutes for core metadata and final artefacts and 5 minutes for signed decisions, grants and audit events.

**Acceptance:** A recovery test demonstrates bounded loss and reconciles any missing authoritative actions before reopening access.

### NFR-AVL-005 — Source data recovery

**P0 · original R1**

Custodied input data shall have a contracted recovery point no greater than 24 hours unless a stricter study requirement applies; reproducible and unique inputs shall be distinguished.

**Acceptance:** Restored inputs reconcile to the frozen manifest; a missing unique input blocks dependent evidence claims.

### NFR-AVL-006 — Backup verification

**P0 · original R1**

Backup integrity shall be checked daily and sampled restoration tested monthly, with a full recovery exercise twice yearly.

**Acceptance:** A completed backup job without successful restore evidence is not reported as proven recoverability.

### NFR-AVL-007 — Failure isolation

**P0 · original R1**

Loss of one study workload or connector shall not disable unrelated study control, incident reporting or access enforcement.

**Acceptance:** Injected workload and dependency failures leave unrelated critical journeys functional.

### NFR-AVL-008 — Safe degraded operation

**P0 · original R1**

If permissions, policy or provenance cannot be verified, affected sensitive actions shall fail closed while authorised nonsensitive reporting remains available where safe.

**Acceptance:** Dependency failure cannot cause unrestricted access, silent approval or fabricated successful results.

### NFR-AVL-009 — Disconnected sites

**P0 · original R2**

Remote nodes shall show last contact and unacknowledged instructions; offline permissions shall have explicit validity and risk limits.

**Acceptance:** An offline node is never displayed as stopped or updated without evidence; its local owner receives the escalation.

### NFR-PER-001 — Interactive navigation

**P1 · original R1**

At L1, common authenticated pages shall become usable within 3 seconds at the 95th percentile under the standard network profile.

**Acceptance:** A 60 minute representative load test covers login landing, study list, task queue and record view.

### NFR-PER-002 — Transactional response

**P1 · original R1**

At L1, ordinary read and write APIs excluding bulk transfer and model execution shall respond within 1 second at p95 and 3 seconds at p99.

**Acceptance:** Measured server response includes authentication and policy checks; error rate is below 0.5 percent excluding valid client errors.

### NFR-PER-003 — Search response

**P1 · original R1**

Permission filtered metadata search over 2 million indexed records shall return within 2 seconds at p95 at L1.

**Acceptance:** The test includes complex filters and confirms that faster results do not omit access controls.

### NFR-PER-004 — Dashboard response

**P1 · original R1**

Standard portfolio dashboards over L1 data shall load within 5 seconds at p95 and show their data freshness.

**Acceptance:** Heavy custom analyses are asynchronous with progress rather than blocking the application.

### NFR-PER-005 — Large ingestion

**P1 · original R1**

A valid 1 GB structured import shall complete validation and reconciliation within 10 minutes after transfer under the specified reference schema and allocated capacity.

**Acceptance:** Results account for every input row; imaging and custom transforms use separately approved budgets.

### NFR-PER-006 — Queue responsiveness

**P1 · original R1**

Job submission shall acknowledge within 2 seconds at p95; eligible jobs with reserved available capacity shall start within 2 minutes at p95.

**Acceptance:** Queue metrics distinguish unavailable resources, policy holds and scheduler delay.

### NFR-PER-007 — Large exports

**P1 · original R1**

Approved exports up to 100000 tabular rows shall be prepared within 5 minutes at p95 at L1.

**Acceptance:** The user sees progress and expiry; authorisation is rechecked before download.

### NFR-PER-008 — Low bandwidth use

**P1 · original R1**

Core metadata workflows shall become usable within 8 seconds at p95 on the low bandwidth profile, excluding deliberate large asset transfer.

**Acceptance:** Users can save an application, review a task and report an incident under the constrained profile.

### NFR-PER-009 — Inference budgets

**P1 · original R1**

Each admitted evaluation pack shall declare modality specific runtime, memory, concurrency and timeout budgets rather than inherit a universal inference target.

**Acceptance:** Out of budget runs terminate or queue according to policy with clear evidence and billing treatment.

### NFR-PER-010 — Capacity expansion

**P1 · original R2**

Before enabling L2 volume, the service shall pass the same critical performance and isolation tests at L2 or contract explicitly revised targets.

**Acceptance:** Capacity approval is supported by load test evidence and estimated operating cost.

### NFR-INTG-001 — Acknowledged transactions

**P0 · original R1**

An acknowledged transaction shall be durable under ordinary process or single component failure and shall not be partially committed.

**Acceptance:** Failure injection yields either one complete recorded action or an explicit failure, never a partial approval.

### NFR-INTG-002 — Artefact integrity

**P0 · original R1**

Every frozen dataset, model configuration and issued report shall have an integrity identifier and immutable version association.

**Acceptance:** Changing bytes changes the integrity result and cannot preserve the original verified status.

### NFR-INTG-003 — Provenance completeness

**P0 · original R1**

One hundred percent of formal findings shall identify protocol, inputs, configuration, methods, run and reviewer versions.

**Acceptance:** An automated completeness check blocks formal issue when any required link is missing.

### NFR-INTG-004 — Deterministic reproducibility

**P0 · original R1**

Deterministic evaluations shall reproduce within protocol specified numerical tolerances on the declared environment.

**Acceptance:** Results outside tolerance are investigated and cannot be released as reproduced.

### NFR-INTG-005 — Stochastic reproducibility

**P0 · original R2**

Stochastic evaluations shall retain seeds where meaningful, repeat count and uncertainty methods and meet prespecified distributional criteria.

**Acceptance:** A result's reproducibility statement does not promise identical output from a nondeterministic external model.

### NFR-INTG-006 — Clock consistency

**P0 · original R1**

Authoritative platform timestamps shall use UTC with a recorded display timezone and maintain clock skew below 1 second for controlled services.

**Acceptance:** A trace reconstruction preserves event order; unsynchronised external timestamps are explicitly identified.

### NFR-INTG-007 — Numerical semantics

**P0 · original R1**

Missing, zero, not applicable, suppressed, indeterminate and failed values shall remain distinct throughout analysis and export.

**Acceptance:** Round trip tests preserve each state and do not convert missing clinical values to zero.

### NFR-INTG-008 — Concurrent edits

**P0 · original R1**

Conflicting edits to controlled records shall be detected and resolved without silent last write loss.

**Acceptance:** Two simultaneous protocol edits produce an explicit conflict or preserved merge history.

### NFR-USA-001 — Accessibility baseline

**P1 · original R1**

Core user journeys shall meet WCAG 2.2 Level AA, including authentication, forms, data tables and error recovery.

**Acceptance:** Automated checks plus manual keyboard, screen reader, focus and zoom testing find no unresolved critical barrier.

### NFR-USA-002 — Task success

**P1 · original R1**

At least 90 percent of representative users shall complete each core role specific journey without facilitator intervention after standard onboarding.

**Acceptance:** Usability sessions include at least 5 participants per priority role and document failures and remediation.

### NFR-USA-003 — Navigation and status clarity

**P1 · original R1**

Every active object shall show its status, owner, next required action and applicable blocker in plain language.

**Acceptance:** Users correctly identify the next action in at least 90 percent of sampled task scenarios.

### NFR-USA-004 — Error prevention

**P1 · original R1**

Consequential actions shall explain scope and consequences, require applicable confirmation and preserve recoverable drafts.

**Acceptance:** Tests prevent accidental publication, deletion and role escalation through one unintended ordinary click.

### NFR-USA-005 — Responsive support

**P1 · original R1**

Core metadata and incident workflows shall work at viewport widths from 360 CSS pixels through desktop sizes without loss of required actions.

**Acceptance:** Testing at agreed mobile and desktop sizes finds no blocked critical workflow or inaccessible control.

### NFR-USA-006 — Browser support

**P1 · original R1**

The platform shall support the current and preceding major versions of Chrome, Edge, Firefox and Safari at release, including agreed iOS and Android browser combinations.

**Acceptance:** The release matrix records tested versions and known limitations; specialised viewers declare separate support.

### NFR-USA-007 — Language readiness

**P1 · original R1**

All user facing interface strings shall be externalised with Unicode, locale formatting and expansion support; launch language is English plus approved country needs.

**Acceptance:** Pseudo localisation does not clip critical controls or corrupt exported clinical terminology.

### NFR-USA-008 — Translation integrity

**P0 · original R2**

Clinical, consent and regulatory translations shall require qualified review and a linked source version before official use.

**Acceptance:** Unapproved translations cannot appear as final participant or authority documents.

### NFR-USA-009 — Assisted accessibility

**P1 · original R2**

Training and support content shall provide accessible alternatives for essential visual or audio information.

**Acceptance:** A user unable to use the primary media format can complete the same required training outcome.

### NFR-OBS-001 — Critical monitoring

**P0 · original R1**

Core availability, errors, queue delay, access failures, backup failures and safety channel health shall have monitored indicators and accountable owners.

**Acceptance:** A controlled critical failure generates an operational alert within 5 minutes.

### NFR-OBS-002 — Incident acknowledgement

**P0 · original R1**

Priority 1 operational incidents shall receive human acknowledgement within 15 minutes under a staffed 24 hour rota.

**Acceptance:** Quarterly drills demonstrate contactability and backup escalation; ordinary support hours are separately published.

### NFR-OBS-003 — User communications

**P1 · original R1**

Affected institutions shall receive an initial major incident update within 30 minutes of confirmation and at least hourly while impact continues.

**Acceptance:** The communication log records delivery failures and contains no unauthorised sensitive data.

### NFR-OBS-004 — Traceability

**P0 · original R1**

Requests, jobs, decisions and exports shall carry correlation identifiers across supported services and connectors.

**Acceptance:** An incident investigation can connect the initiating request with all material outcomes.

### NFR-OBS-005 — Operational history

**P1 · original R1**

Searchable operational telemetry shall be retained for at least 90 days unless a stricter approved privacy rule applies; audit records follow their own schedule.

**Acceptance:** Operators can investigate a sampled 60 day old incident without accessing raw patient data.

### NFR-OBS-006 — Runbook coverage

**P1 · original R1**

Every critical alert shall have a tested runbook, owner, escalation route and recovery or safe shutdown action.

**Acceptance:** A new on call operator can execute sampled runbooks during a supervised readiness exercise.

### NFR-OBS-007 — Post incident review

**P1 · original R1**

Major operational incidents shall receive a documented review within 5 business days of stabilisation, with actions and owners.

**Acceptance:** Repeat causes and overdue actions appear in the service governance review.

### NFR-MNT-001 — Release traceability

**P0 · original R1**

Every production change shall link approved requirements or fixes, verification evidence, release identity and accountable approval.

**Acceptance:** A sampled release can be traced to its business reason and rollback or recovery plan.

### NFR-MNT-002 — Regression gates

**P0 · original R1**

All applicable P0 acceptance scenarios and affected clinical metric reference tests shall pass before release.

**Acceptance:** A failing critical permission, safety, provenance or metric test blocks deployment.

### NFR-MNT-003 — Rollback readiness

**P1 · original R1**

Ordinary application releases shall support rollback or a tested forward recovery within 30 minutes where data compatibility allows.

**Acceptance:** A rehearsal restores service without discarding acknowledged records or reviving revoked access.

### NFR-MNT-004 — Migration assurance

**P0 · original R1**

Schema and configuration migrations shall validate record counts, relationships, permissions and representative values before completion.

**Acceptance:** A failed reconciliation prevents the migrated environment from serving affected production records.

### NFR-MNT-005 — Interface stability

**P1 · original R1**

Published production APIs shall have at least 180 days deprecation notice except urgent security or legal changes with managed alternatives.

**Acceptance:** A breaking change cannot silently invalidate an agreed institutional connector.

### NFR-MNT-006 — Dependency governance

**P1 · original R1**

Releases shall inventory software dependencies and licences, assess vulnerabilities and record supported lifetimes.

**Acceptance:** Unsupported critical dependencies have a funded replacement or approved time limited exception.

### NFR-MNT-007 — Portability

**P1 · original R1**

Institutional metadata, evidence, audit exports and permitted assets shall be extractable in documented formats without proprietary reader dependence.

**Acceptance:** A clean environment reconstructs a sampled exported study and verifies its evidence references.

### NFR-MNT-008 — Environment flexibility

**P1 · original R2**

Country requirements for hosted, dedicated or institution operated execution shall be supportable through validated deployment profiles.

**Acceptance:** Each offered profile passes equivalent access, provenance, safety and operational gates before sale.

### NFR-AQL-001 — No universal clinical score

**P0 · original R1**

Each admitted clinical use shall have approved task specific thresholds, populations, uncertainty requirements and safety criteria.

**Acceptance:** An undefined threshold or unsupported population blocks a suitability conclusion.

### NFR-AQL-002 — Platform assistant safety

**P0 · original R2**

Platform AI features shall have zero observed critical access, unsafe action or fabricated approval failures in the approved release test pack.

**Acceptance:** The report discloses sample size and residual uncertainty; zero observed failures is not claimed as zero real world risk.

### NFR-AQL-003 — Generated factual grounding

**P0 · original R2**

Every material clinical or evaluative claim in a released AI assisted report shall be human verified against the linked approved source.

**Acceptance:** A random audit of released reports finds no unreviewed material generated claim.

### NFR-AQL-004 — Model change regression

**P0 · original R2**

Every material platform model, prompt, tool or retrieval change shall pass task, privacy, permission and adversarial regression gates.

**Acceptance:** Changes cannot enter production based solely on improved average response quality.

### NFR-AQL-005 — Human review independence

**P0 · original R2**

Automated scoring shall not be the sole adjudicator of clinical safety, ethics, legal applicability or final evidence approval.

**Acceptance:** Workflow tests require the appropriate eligible human decision for each protected outcome.

### NFR-AQL-006 — AI service continuity

**P1 · original R2**

Core study, incident and review workflows shall remain usable when optional AI services are disabled.

**Acceptance:** A simulated provider outage leaves manual authorised completion possible without data loss.

### NFR-CST-001 — Cost attribution

**P1 · original R1**

At least 95 percent of variable infrastructure and external service spend shall be attributable to a programme, study or approved shared cost category.

**Acceptance:** Monthly financial reconciliation explains the remaining unattributed amount.

### NFR-CST-002 — Spending limits

**P0 · original R1**

All billable automated workloads shall have approved limits and warning thresholds at 80 and 100 percent of budget unless a stricter policy applies.

**Acceptance:** The hard limit prevents further unauthorised spending while preserving evidence and safe termination.

### NFR-CST-003 — Idle resource control

**P1 · original R1**

Unneeded compute shall be suspended within a configurable period, default 30 minutes, subject to active study requirements.

**Acceptance:** An idle workspace stops compute charges without deleting retained assets or disrupting a declared long job.

### NFR-CST-004 — Resource reporting

**P1 · original R2**

Where providers expose credible measurements, the service shall report compute consumption and estimated environmental impact with methods and limitations.

**Acceptance:** Estimates do not imply measured carbon emissions when only proxy data are available.

### NFR-SUP-001 — Operational ownership

**P0 · original R1**

Every production capability shall have an accountable product owner, operational owner and escalation route before activation.

**Acceptance:** No feature is released with an unassigned safety or maintenance responsibility.

### NFR-SUP-002 — Documentation completeness

**P1 · original R1**

Each released role shall have current task guidance, access instructions, common error recovery and escalation documentation.

**Acceptance:** Representative users complete the documented core journeys without undocumented internal assistance.

### NFR-SUP-003 — Country launch readiness

**P0 · original R1**

Every active country shall have signed applicability, data, clinical, operational and commercial readiness records for its offered scope.

**Acceptance:** A country cannot be marked active through marketing configuration alone.

### NFR-SUP-004 — Service request response

**P1 · original R1**

Ordinary support requests shall be acknowledged within 1 business day and triaged within 2, with local calendar and support hours disclosed.

**Acceptance:** Reports measure compliance from receipt and distinguish acknowledgement from resolution.

### NFR-SUP-005 — Continuity responsibilities

**P0 · original R1**

Every care affecting deployment shall have a locally owned continuity plan independent of platform availability.

**Acceptance:** A tabletop exercise shows safe local action during a platform or network outage.

### NFR-SUP-006 — Exit readiness

**P1 · original R2**

An annual continuity exercise shall test institutional data export, supplier failure and operator handover assumptions.

**Acceptance:** The exercise records gaps, assigned remedies and lawful retained obligations.

## Government extension and open decisions

The [R3 BRD](../releases/r3/01-brd.md) preserves all government business rules, buying unit, staged scope and objectives. R3A is institutional comparison/context/budget/evidence; R3B is selected integration/pilot monitoring; R3C is sharing/portfolio/hosting portability. [Open decisions](../releases/r3/16-decisions-and-release-gates.md) still require actual owners, institutions, deployment policies and evidence. No unrequested product scope or automatic procurement authority is introduced by this edition.
