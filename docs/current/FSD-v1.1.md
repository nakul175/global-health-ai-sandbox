# Functional specification — full target and implementation boundaries

Documentation edition **1.1**, 2026-10-03. Reconciled to repository source **8b4b4b5a4b22** plus the unmerged independent cough provider candidate. Hosted alpha package 0.6.0; this candidate is not deployed.

The original functional and quality targets remain authoritative for intended outcomes. This reading edition is reconstructed from the preserved, structured BRD/FSD traceability model; it is not a byte-identical recovery of the missing original Word documents. No requirement text or release assignment is replaced by the smaller alpha. Government R3 is a separate additive design catalogue.

Current implementation and historical execution evidence are separated in [Implementation](../IMPLEMENTATION.md), [qualification](../QUALIFICATION.md) and [traceability](TRACEABILITY.csv). Related source paths indicate where to investigate a domain; they do not prove each requirement passes. Formal requirement acceptance remains unestablished.

## Consistent workflow rules

The target operates with current identity, organisation, record, purpose, field and hold policy. Independent approval is based on a verified person rather than a different login. Submitted/frozen/issued records retain their exact versions; changes use successors. Unknown external outcomes require reconciliation. Missing evidence stays missing.

The hosted adapter instead uses one real owner's synthetic profiles. Its smaller schemas and route set are documented in [current API inventory](CURRENT-API-INVENTORY.md); these are not the original /v1 or proposed /v2 and /api/v3 contracts. The [current user guide](USER-GUIDE.md) describes the available experience.

## ORG — Organisation and programme structure

Organisation representative, OP verifier, OA and programme owner. Accountable role: Product owner.

**Current relationship:** Synthetic institution/programme workflow; real institutional ownership and lifecycle incomplete.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| legal_identity | Object required for verification | Legal name, registration jurisdiction, registration reference, entity type and evidence; distinguish legal name from display name. |
| representative | Person reference required | Verified identity, capacity to represent the entity and verification evidence; cannot be an unaccepted invitation. |
| institution_domains | Set of domains optional | Verify ownership before federation or invitation automation; a shared public email domain cannot establish institutional authority. |
| parent_ref | Organisation or unit reference optional | Reject cycles and incompatible entity types; hierarchy itself does not grant access. |
| programme_rules | Versioned object required for programme activation | Objectives, eligibility rubric, countries, funding references, dates and positive participant cap; start precedes end. |
| participants | Set of organisation role records | Each has agreement reference, contribution, access scope, start, expiry and accepted representative. |
| accountable_contacts | Owner and backup required at activation | Must be eligible active members; successor accepts assignment before old owner is removed. |
| transfer_record | Object required for legal ownership change | Predecessor, successor, effective date, rights review and decision; preserve original legal attribution. |

### FS-ORG-001 / FR-ORG-001 — Organisation hierarchy

Create distinct operator, legal organisation, country association, department, site, programme and study records. Link them through typed relationships with effective dates; show the hierarchy without copying permissions between nodes.

**Exception:** Reject cycles, duplicate verified legal identities and attempts to reparent a historical study without a reviewed transfer.

**Acceptance:** A study can involve three organisations without merging their users, contracts or data permissions.

**Target screen:** S-ORG-02 · R1

### FS-ORG-002 / FR-ORG-002 — Verified organisation onboarding

Submit freezes identity evidence. A different authorised verifier records verified, returned or rejected with reasons. Activation requires a verified representative, approved administrator and valid organisational terms.

**Exception:** A returned application stays editable; an unverified institution may prepare drafts but cannot approve data or studies.

**Acceptance:** An unverified applicant can prepare an application but cannot authorise data access or approve studies.

**Target screen:** S-ORG-03 · R1

### FS-ORG-003 / FR-ORG-003 — Tenant boundaries

Resolve the active organisation before register queries, shared study views and exports. A participation record exposes only explicitly shared objects; display which institution owns each asset.

**Exception:** Use the safe unavailable response for an ungranted direct link and exclude hidden objects from counts and suggestions.

**Acceptance:** Cross organisation searches, direct links, exports and background jobs all reject ungranted access.

**Target screen:** S-ORG-01 · R1

### FS-ORG-004 / FR-ORG-004 — Programme configuration

Save programme settings as versions. Validate dates, funding eligibility, supported country profiles and capacity; preview which open applications a change would affect before publishing the new rules.

**Exception:** Existing submitted applications retain their original rule version until an approved transition decision is recorded.

**Acceptance:** Two programmes can apply different eligibility and funding rules to the same product.

**Target screen:** S-ORG-02 · R1

### FS-ORG-005 / FR-ORG-005 — Cross organisation collaboration

Invite an institutional representative with a study role, contribution, agreement and expiry. Acceptance creates pending participation; approved terms and scoped grants activate it.

**Exception:** Decline or expiry creates no membership; acceptance cannot grant access beyond the approved participation package.

**Acceptance:** Accepting a study invitation grants only the study permissions specified in the approved agreement.

**Target screen:** S-ORG-02 · R1

### FS-ORG-006 / FR-ORG-006 — Accountability register

Display the primary owner, operational contact and backup for each governed object. Reassignment requires an eligible successor to accept; dependent tasks transfer with an audit trail.

**Exception:** Block departure or closure that would leave an active critical object without an accountable owner.

**Acceptance:** Removing the last accountable owner is blocked until an authorised successor accepts responsibility.

**Target screen:** S-ORG-02 · R1

### FS-ORG-007 / FR-ORG-007 — Lifecycle management

Activate, suspend or close through reasoned commands. Suspension stops invitations and new processing in scope, while authorised evidence preservation, incidents and remediation remain available.

**Exception:** Resumption rechecks all prerequisites; closure fails with an itemised list of unassigned surviving obligations.

**Acceptance:** Suspension blocks new activity while preserving authorised incident response and required evidence access.

**Target screen:** S-ORG-03 · R1

### FS-ORG-008 / FR-ORG-008 — Delegated network administration

Delegation specifies managed countries, organisations, role ceilings and expiry. Preview effective powers and record a separate approver before delegated administration becomes active.

**Exception:** Reject rules or assignments outside the delegation or below mandatory operator safeguards.

**Acceptance:** A country administrator cannot change another country's rules or weaken mandatory operator controls.

**Target screen:** S-ORG-03 · R2

### FS-ORG-009 / FR-ORG-009 — Institutional ownership changes

Create a transfer proposal with effective date, successor acceptance and rights review. Update future responsibility only after approval; retain predecessor identity on old reports and contracts.

**Exception:** Disputed assets or nontransferable agreements remain held and appear as unresolved transfer items.

**Acceptance:** Historical reports retain the original legal entity and show the effective transfer date.

**Target screen:** S-ORG-03 · R1

### FS-ORG-010 / FR-ORG-010 — Demonstration environment

Create demonstration organisations with an immutable environment label and approved synthetic or public data catalogue. Show the label on pages and exports; issue only demonstration reports.

**Exception:** Reject production connectors, restricted source uploads and production evidence signatures from the demonstration context.

**Acceptance:** A demo administrator cannot connect a production dataset or issue a production evidence report.

**Target screen:** S-ORG-02 · R1

## IAM — Identity and user lifecycle

OA, institutional identity owner, security operator and individual user. Accountable role: Security lead.

**Current relationship:** Dispatcher-authenticated owner and synthetic roles; real institution membership and independent people absent.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| invitation | Object required | Email, institution, roles, scopes, inviter, expiry, token status and acceptance time; store only protected token verification material. |
| identity_binding | Verified identity reference required | Local account or trusted issuer plus subject; email change does not replace the immutable subject. |
| membership | Scoped role set required | Institution, role, programme or study, start, expiry, approving authority and status; prohibit indefinite guest membership. |
| assurance | Authentication context system recorded | Factor class, authentication time and approved institutional assurance; never store recovery secrets in profile text. |
| professional_credential | Object conditional | Profession, issuer, jurisdiction, identifier, evidence, verifier, valid dates and permitted decision scope. |
| service_identity | Object required for automation | Owner, purpose, scopes, destinations, credential version, rotation date and expiry; no human approval role. |
| federation_mapping | Versioned object conditional | Trusted issuer, organisation binding, allowed claims, role mapping, test result and recovery contact. |
| review_campaign | Object required for recertification | Scope, review owner, due date, effective access snapshot, retain or reduce or revoke decision and overdue treatment. |

### FS-IAM-001 / FR-IAM-001 — User invitations

Invite a named person using the shared single use invitation contract. Show pending, accepted, expired and revoked states. Acceptance verifies the identity and creates only the specified membership.

**Exception:** Resend invalidates the prior token; an already accepted or mismatched identity cannot reuse it.

**Acceptance:** An expired or already accepted invitation cannot create another membership.

**Target screen:** S-IAM-01 · R1

### FS-IAM-002 / FR-IAM-002 — Authentication

Authenticate through a verified institutional issuer or approved local account. Resolve a unique human principal before writes and show active institution on entry.

**Exception:** Reject shared account registration and untrusted issuer claims; failed login messages must not reveal whether an email exists.

**Acceptance:** Each accepted write and approval is attributable to one uniquely identified human or service principal.

**Target screen:** S-IAM-02 · R1

### FS-IAM-003 / FR-IAM-003 — Multifactor authentication

Before entering restricted scope, inspect current assurance and require an approved additional factor if insufficient. Offer phishing resistant methods for privileged roles.

**Exception:** A remembered browser or email link alone cannot satisfy a stronger factor requirement; failure preserves only safe drafts.

**Acceptance:** A restricted dataset remains inaccessible after password only authentication.

**Target screen:** S-IAM-02 · R1

### FS-IAM-004 / FR-IAM-004 — Enterprise federation

Configure federation in draft, verify domain and issuer control, map trusted claims and test a nonprivileged account before activation. Show the effect on existing members.

**Exception:** Do not create administrator powers from arbitrary group names; preserve an approved recovery procedure for issuer outage.

**Acceptance:** A federated identity cannot claim an organisation or administrator role using an untrusted attribute.

**Target screen:** S-IAM-03 · R1

### FS-IAM-005 / FR-IAM-005 — Provisioning and deprovisioning

Preview directory mappings and reconcile desired against effective memberships. Apply create, update and disable events idempotently; record source identity and event version.

**Exception:** Out of order or conflicting events enter reconciliation; deprovisioning revokes rather than deleting historical authorship.

**Acceptance:** A directory removal revokes mapped memberships within the agreed revocation objective and creates an audit event.

**Target screen:** S-IAM-03 · R2

### FS-IAM-006 / FR-IAM-006 — Account recovery

Open a recovery case with claimed identity, risk level and independent evidence. Approved recovery replaces specified factors, revokes affected sessions and sends a notice to verified channels.

**Exception:** A support agent cannot complete privileged recovery alone or rely solely on the potentially compromised mailbox.

**Acceptance:** A recovery attempt cannot replace a privileged authentication factor through email access alone.

**Target screen:** S-IAM-03 · R1

### FS-IAM-007 / FR-IAM-007 — Session management

List sessions by device description, last activity and approximate location where lawful. Revoke one or all sessions and display pending versus effective revocation.

**Exception:** The next protected action fails by the revocation deadline; do not claim immediate deletion of previously downloaded material.

**Acceptance:** A revoked session fails its next protected action within the specified revocation limit.

**Target screen:** S-IAM-02 · R1

### FS-IAM-008 / FR-IAM-008 — Membership changes

Run joiner, mover or leaver checklists covering privileges, tasks, ownership and service credentials. A move removes obsolete scopes before new duties begin.

**Exception:** Departure can revoke access immediately while ownership handover remains an open operational task; attribution is retained.

**Acceptance:** A departing reviewer loses active access without losing attribution on signed historical decisions.

**Target screen:** S-IAM-02 · R1

### FS-IAM-009 / FR-IAM-009 — Temporary access

Create temporary access with named sponsor, purpose, bounded scope and expiry. Show expiry in effective permissions and alert the owner before it lapses.

**Exception:** No renewal is automatic; expiry denies access even if a cleanup task has not run.

**Acceptance:** Expired access is denied by both the user interface and the API without manual cleanup.

**Target screen:** S-IAM-02 · R1

### FS-IAM-010 / FR-IAM-010 — Service identities

Create service principals with least privilege and a credential issue action that reveals the secret only through the approved secure channel. Track rotation and disablement separately from human departure.

**Exception:** Reject human signoff commands and unrelated scopes; missing active owner blocks new credential issuance.

**Acceptance:** A service credential cannot perform a human clinical signoff or inherit its owner's unrelated privileges.

**Target screen:** S-IAM-03 · R1

### FS-IAM-011 / FR-IAM-011 — User preferences

Allow personal language, timezone, accessibility and ordinary notification preferences. Preview localisation and preserve exact dates and units.

**Exception:** Verified names and credentials require a verification workflow; preference changes cannot suppress mandatory safety notifications.

**Acceptance:** Changing a display name does not alter the verified signer identity on an issued report.

**Target screen:** S-IAM-02 · R1

### FS-IAM-012 / FR-IAM-012 — Professional verification

Submit credential evidence for an eligible verifier. Verification records permitted jurisdictions and decisions, expiry and restrictions; qualification is evaluated at assignment and signoff.

**Exception:** Expired or suspended credentials block new decisions and trigger reassignment; old signed records retain the original verification context.

**Acceptance:** Expired credentials block new restricted decisions while preserving historical decisions for review.

**Target screen:** S-IAM-02 · R1

### FS-IAM-013 / FR-IAM-013 — Identity reconciliation

Present suspected duplicate identities and their memberships, interests and historical signatures to an authorised reconciliation reviewer. Link verified aliases without rewriting historical actor identifiers.

**Exception:** Merging cannot erase conflicts, sanctions or audit records; ambiguous identity remains separate and restricted pending resolution.

**Acceptance:** Two accounts cannot be merged in a way that removes an existing conflict of interest declaration.

**Target screen:** S-IAM-03 · R1

### FS-IAM-014 / FR-IAM-014 — Access recertification

Generate periodic review campaigns showing effective grants, inherited scopes, last use and accountable owners. Reviewers record retain, reduce or revoke for each item.

**Exception:** Overdue high risk entries follow the approved suspension policy; the campaign cannot close with unanswered required entries.

**Acceptance:** The review lists actual effective privileges and records retain, reduce or revoke decisions.

**Target screen:** S-IAM-03 · R1

## ACC — Authorisation and separation of duties

Delegated administrators, data owners, independent approvers and security owners. Accountable role: Security lead.

**Current relationship:** Bounded role/grant/hold checks; full regional and institutional authority remains open.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| action_set | Controlled set required | Discover, metadata view, record view, edit, execute, approve, export, publish, administer and delete remain distinct. |
| resource_scope | Typed references required | Institution, country, programme, study, asset versions and optional field or cohort view; wildcard scope requires explicit delegation. |
| purpose_ref | Approved purpose required for restricted access | Evaluation, approved preparation, authorised adaptation and training are separate rights. |
| restriction | Versioned rule object | Object, action, subject or group, condition, source, dates and nonwaivable classification. |
| approval_slots | Ordered or parallel eligible roles | Distinct verified persons where independence is required; record which slot each decision satisfies. |
| conflict_declaration | Object required for independent review | Employment, financial, authorship and organisational interests, relevant products, dates, materiality decision and reviewer. |
| exception | Object conditional | Reason, scope, start, expiry, oversight, permitted actions and post use review; no unbounded exception. |
| explanation | System decision record | Safe reason code plus internal policy and grant references; requester visibility is separately filtered. |

### FS-ACC-001 / FR-ACC-001 — Permission model

Evaluate the full context in Section 3 for each action. The inspector computes effective access for a chosen object and purpose using the same rules as runtime.

**Exception:** Missing context, unresolved conflicts and unavailable policy verification deny the affected protected action.

**Acceptance:** A user with an evaluator role cannot read an unassigned study merely because both share a country.

**Target screen:** S-ACC-02 · R1

### FS-ACC-002 / FR-ACC-002 — Granular actions

Display independent permission switches with a preview of resulting actions. Granting view does not preselect export, and granting edit does not preselect approve or publish.

**Exception:** Reject permission combinations beyond the grantor's delegation, even if submitted outside the interface.

**Acceptance:** Permission to view a result does not automatically permit downloading its underlying records.

**Target screen:** S-ACC-02 · R1

### FS-ACC-003 / FR-ACC-003 — Independent approval

At reviewer assignment and final signature, compare verified identity and declared affiliations against the submitter, author and beneficiary. Require eligible independent signers.

**Exception:** A conflicted sole approver is blocked; an independently accepted conflict mitigation must be scoped and visible to final reviewers.

**Acceptance:** A developer attempting to approve its own product's final report receives a recorded denial.

**Target screen:** S-ACC-03 · R1

### FS-ACC-004 / FR-ACC-004 — Privileged administration

Separate infrastructure administration from content grants. Operators see identifiers, health and approved diagnostics; a content request opens the normal access workflow.

**Exception:** Administrator flags cannot override restricted file, proprietary model or sealed benchmark policies.

**Acceptance:** An administrator can manage an account without opening that account's restricted study files.

**Target screen:** S-ACC-02 · R1

### FS-ACC-005 / FR-ACC-005 — Exceptional access

Create a narrow exceptional session after the approved emergency process. Display an active access banner, expiry and case reference; record each protected action for independent review.

**Exception:** Expiry ends the elevated session; emergency administration cannot create new clinical authority or waive prohibited processing.

**Acceptance:** The access session expires automatically and generates a reviewable record of every protected action.

**Target screen:** S-ACC-03 · R1

### FS-ACC-006 / FR-ACC-006 — Permission inheritance

Preview direct, group and inherited grants together with explicit restrictions. Show which rule determines each action before a policy change is submitted.

**Exception:** Broader programme access cannot override a dataset restriction; unresolved precedence is a blocking policy conflict.

**Acceptance:** An explicit dataset restriction remains effective when a user receives a broader programme role.

**Target screen:** S-ACC-02 · R1

### FS-ACC-007 / FR-ACC-007 — Uniform enforcement

Apply authorisation to rows, snippets, counts, suggestions, thumbnails, exports, notifications, assistant retrieval and background processing. Recheck cached content before delivery.

**Exception:** Hide existence where discovery is denied; do not return restricted fragments in diagnostics or search facets.

**Acceptance:** A denied user's search counts and file previews do not disclose hidden objects.

**Target screen:** S-ACC-01 · R1

### FS-ACC-008 / FR-ACC-008 — Access request workflow

Request access with study, purpose, dataset version, team, fields, environment and duration. Route to the owners whose rights are implicated; decisions may approve a subset.

**Exception:** Changing purpose or adding users after approval creates a new request; denied requests retain authorised reasons and appeal path.

**Acceptance:** Approval for one purpose cannot be reused for an unrelated study or training activity.

**Target screen:** S-ACC-01 · R1

### FS-ACC-009 / FR-ACC-009 — Dual control

Create an approval package with separate slots and an exact payload digest. Each eligible signer approves that version; commitment occurs only when all mandatory slots are satisfied.

**Exception:** One person cannot fill two independent slots; any payload change invalidates pending approvals.

**Acceptance:** One actor cannot satisfy two required approval roles on the same action.

**Target screen:** S-ACC-03 · R1

### FS-ACC-010 / FR-ACC-010 — Permission changes during work

On revocation identify sessions, queued work, active jobs, controlled downloads and output releases. Cancel unstarted tasks and contain active processing under the approved safety procedure.

**Exception:** A short lived link must still meet the 60 second online revocation limit; completed external downloads require recorded follow up.

**Acceptance:** A queued export is cancelled when its grant expires before delivery.

**Target screen:** S-ACC-02 · R1

### FS-ACC-011 / FR-ACC-011 — Permission explanations

Show authorised administrators the missing scope, assurance, expiry or condition and its owner. Provide the requester only an approved explanation and request route.

**Exception:** Never reveal hidden asset titles, reviewer identities or policy details that would expose restricted information.

**Acceptance:** A support explanation identifies the missing grant and responsible approver rather than revealing protected data.

**Target screen:** S-ACC-02 · R1

### FS-ACC-012 / FR-ACC-012 — Conflict aware assignment

Collect conflict declarations before assignment and periodically on material change. Match affiliations against the current study and competing submissions; exclude material conflicts pending independent review.

**Exception:** A changed employer or new ownership interest triggers reassessment without erasing previous reviews or declarations.

**Acceptance:** A reviewer with a declared material conflict is excluded until an independent decision is recorded.

**Target screen:** S-ACC-03 · R1

## CTR — Country rules and control applicability

Country owners, legal and privacy reviewers, clinical owners and authorised external reviewers. Accountable role: Country lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| profile_scope | Object required | Country, institutions, supported activities, modalities, study types and explicit exclusions. |
| authority_refs | Set required where applicable | Issuing body identity, mandate, official reference or channel and local contact; verification status is explicit. |
| rule_record | Versioned record required | Source reference, interpretation, owner, effective date, review date, governed activities and approval. |
| residency_policy | Matrix required for restricted scope | Allowed storage, execution, backups, remote support and transfer routes by data class. |
| applicability | Question set required per study | Intended use, device and research assessment, ethics route, obligations, rationale and qualified signer. |
| local_conventions | Object required | Languages, guideline versions, terminology, units, timezone and currencies with approved mappings. |
| external_permission | Typed record conditional | Issuer, decision class, reference, protocol or product version, sites, population, dates, conditions and verification evidence. |
| impact_decision | Object required after material rule change | Affected object, action, transition deadline, owner, retain or remediate or suspend outcome and reason. |

### FS-CTR-001 / FR-CTR-001 — Country profiles

Create profiles in draft and version all authorities, permitted activities and local rules. Pin the exact profile version to each gate decision and retain prior versions.

**Exception:** A draft profile cannot make a country operationally active or retrospectively change a signed study decision.

**Acceptance:** A study records the exact country profile version used at each gate.

**Target screen:** S-CTR-02 · R1

### FS-CTR-002 / FR-CTR-002 — Applicability assessment

Generate study applicability questions from intended use and country scope. Qualified owners resolve required answers with evidence or a reasoned not applicable decision.

**Exception:** An AI suggestion is visibly advisory; an unanswered mandatory item blocks only the dependent activity.

**Acceptance:** No study becomes active with an unanswered mandatory applicability item.

**Target screen:** S-CTR-02 · R1

### FS-CTR-003 / FR-CTR-003 — Rule provenance

Require source, interpretation owner, effective date and review date for each mandatory rule. Link changes to a reviewed successor and an impact task.

**Exception:** An unverified source or overdue mandatory interpretation cannot silently remain accepted for newly affected activity.

**Acceptance:** A source change creates a review task rather than silently changing a previously approved study.

**Target screen:** S-CTR-02 · R1

### FS-CTR-004 / FR-CTR-004 — Residency and transfer rules

Match requested storage, compute, backups, support location and transfer path to every contributing asset policy. Display the permitted execution choices.

**Exception:** No compatible location yields a blocking residency conflict; user preference cannot select a forbidden region.

**Acceptance:** An otherwise valid workspace request is blocked when its region conflicts with the dataset policy.

**Target screen:** S-CTR-02 · R1

### FS-CTR-005 / FR-CTR-005 — Restriction precedence

Resolve law, ethics, agreement and institutional restrictions as a combined policy set. Display conflicts with affected scope and qualified resolution owner.

**Exception:** A commercial template cannot override stricter terms; incompatible rules block processing until formally resolved.

**Acceptance:** A permissive programme template cannot override a stricter data use agreement.

**Target screen:** S-CTR-03 · R1

### FS-CTR-006 / FR-CTR-006 — Local terminology and language

Register terminology, guideline and locale versions. Show units and source language next to clinical values and require approved mappings for conversion.

**Exception:** Changing language alters presentation only; an unknown code or unit is not interpreted by analogy.

**Acceptance:** A measurement is not interpreted in a different unit because a user changes display language.

**Target screen:** S-CTR-02 · R1

### FS-CTR-007 / FR-CTR-007 — Rule change impact

On approved rule change calculate affected grants, workspaces, studies, reports and deployments. Assign an impact decision with due date and permitted transitional treatment.

**Exception:** Unreviewed affected activities remain restricted according to the effective rule; old findings are not silently rewritten.

**Acceptance:** Affected owners receive an actionable list with suspend, remediate or retain decisions and reasons.

**Target screen:** S-CTR-03 · R1

### FS-CTR-008 / FR-CTR-008 — Authority boundaries

Store internal eligibility, ethics, research, market access and procurement as separate typed records with different issuers and scopes. Present them in separate status fields.

**Exception:** The scientific result action has no ability to populate market authorisation or procurement approval.

**Acceptance:** An internal successful evaluation cannot populate a market authorisation field.

**Target screen:** S-CTR-02 · R1

### FS-CTR-009 / FR-CTR-009 — Regulatory collaboration

Invite an authority reviewer into a bounded review package with material scope, purpose and expiry. Record questions and their own decisions without inheriting other authority access.

**Exception:** Requests for additional material follow a new sharing review; one authority cannot inspect another's private deliberations.

**Acceptance:** Two authorities reviewing the same solution see only the evidence explicitly shared with each.

**Target screen:** S-CTR-02 · R2

### FS-CTR-010 / FR-CTR-010 — Profile activation

Activate a declared country scope only after local clinical, legal, privacy and operations signoff and capability checks. Publish only the activated scope to programme selection.

**Exception:** Missing signoff keeps the profile draft or restricted; marketing configuration cannot alter operational activation.

**Acceptance:** Marketing cannot advertise an active clinical sandbox in a country whose profile is still draft.

**Target screen:** S-CTR-03 · R1

## DEM — Health needs and programme intake

Institutional problem owner, programme manager, scientific reviewer and buyer. Accountable role: Programme director.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| problem | Object required | Population, current workflow, baseline, comparator, intended outcome and institutional decision owner. |
| call | Versioned object required before publication | Eligibility, admitted uses, criteria, support, dates, evidence checklist and terms. |
| application | Object required | Applicant organisation, exact solution configuration, call version, responses, attachments and submission time. |
| rubric | Versioned score definition required | Criteria, weights summing to one, scale, anchors, missing score treatment and approval. |
| funding | Object required to commission | Payer, budget owner, envelope, currency, period and accepted scope; identify exploratory status when no buyer. |
| feasibility | Structured review required | Data rights and readiness, sample rationale, reference standard, site capacity, integration and cost implications. |
| pipeline_outcome | Controlled value | Pending, returned, admitted, rejected, withdrawn or exploratory; record reason without overwriting science outcomes. |
| shared_need | Institutional commitments conditional | Common question plus separate country thresholds, budget owners and purchasing decisions. |

### FS-DEM-001 / FR-DEM-001 — Problem statements

Save a need with the current process, affected population, measurable decision and named owner. Submit for feasibility only when required context is present.

**Exception:** A vague AI topic without an institutional decision remains a draft and cannot become a commissioned evaluation.

**Acceptance:** An opportunity cannot advance to funded evaluation without a defined decision and accountable institution.

**Target screen:** S-DEM-02 · R1

### FS-DEM-002 / FR-DEM-002 — Calls for solutions

Preview and publish an approved call version. Record open and close instants and the applicant's submitted version; validate late submission against explicit programme policy.

**Exception:** Editing an open call creates a successor and transition notice; existing applicants retain original terms unless formally changed.

**Acceptance:** Applicants retain the call version under which they submitted.

**Target screen:** S-DEM-02 · R1

### FS-DEM-003 / FR-DEM-003 — Applicant screening

Apply a screening checklist to maturity, relevance, affordability, licence and deployment constraints. Each criterion has pass, gap or fail with evidence and reviewer.

**Exception:** Reject or return with authorised reasons and reconsideration deadline; confidential reviewer material stays restricted.

**Acceptance:** Rejected applicants receive authorised reasons and an available reconsideration route.

**Target screen:** S-DEM-03 · R1

### FS-DEM-004 / FR-DEM-004 — Portfolio prioritisation

Score eligible applications using the frozen rubric. Calculate weighted results only for complete valid inputs and retain individual reviewer scores and tie rules.

**Exception:** Missing criteria cannot be treated as zero without rubric authority; discretionary overrides require reasons and approval.

**Acceptance:** A ranking can be reproduced from its inputs and declared weights.

**Target screen:** S-DEM-03 · R1

### FS-DEM-005 / FR-DEM-005 — Budget and buyer identification

Bind a funding source, budget owner and purchasing decision to commissioned scope. Display exploratory status when adoption ownership is absent.

**Exception:** Exploratory studies cannot enter adoption readiness metrics as if a buyer had committed.

**Acceptance:** A study lacking an adoption buyer is explicitly labelled exploratory and excluded from adoption readiness claims.

**Target screen:** S-DEM-02 · R1

### FS-DEM-006 / FR-DEM-006 — Feasibility review

Complete data, sample, reference, staffing and integration feasibility before issuing a study commitment. Convert unresolved gaps into costed owner assigned tasks.

**Exception:** A critical unresolved feasibility gap blocks commission or requires an explicitly narrower approved exploratory scope.

**Acceptance:** A feasibility decision records unresolved gaps and their cost and schedule consequences.

**Target screen:** S-DEM-03 · R1

### FS-DEM-007 / FR-DEM-007 — Demand aggregation

Link multiple institutional needs to a shared call while keeping local decision records. Reuse common descriptions but require each institution's own scope acceptance.

**Exception:** A shared call cannot copy clinical thresholds, funding commitments or purchasing approval between countries.

**Acceptance:** A shared call produces distinct country decision records rather than one universal approval.

**Target screen:** S-DEM-02 · R2

### FS-DEM-008 / FR-DEM-008 — Pipeline management

Track first submission, current stage, accountable owner, next action and delay category. Preserve withdrawals and rejection reasons in funnel history.

**Exception:** A returned application does not reset elapsed age; scientific failure remains distinct from administrative incompleteness.

**Acceptance:** A pipeline report separates incomplete applications from scientifically unsuccessful evaluations.

**Target screen:** S-DEM-01 · R1

## NET — Clinical sites and partner network

Site owner, programme manager, investigator, network lead and specialist reviewer. Accountable role: Network lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| site_profile | Object required | Legal organisation, location, service level, supported clinical tasks, equipment and connectivity. |
| qualification | Versioned assessment required | Assessor, scope, evidence, outcome, valid dates, limitations and renewal owner. |
| capacity | Time bounded resource records | Resource type, qualified units, available period, reservation status and responsible scheduler. |
| site_roles | Eligible person references required | Investigator or equivalent, data custodian, urgent contact and backups, with validity. |
| partner_terms | Agreement references required | Responsibilities, fees, publication, incident routes, data rights and exit obligations. |
| expert_profile | Object conditional | Verified expertise, language, jurisdiction, availability and conflict declarations; confidential assignments are hidden. |
| performance | Governed metric references | Timeliness, data quality, adherence and workload with completeness and case mix qualifiers. |
| consultation | Object conditional | Representative role, consent or participation basis, concern, response owner, outcome and protocol impact. |

### FS-NET-001 / FR-NET-001 — Site registry

Register capabilities as verified or self declared and record equipment versions and current connectivity. Searches can filter only on permitted metadata.

**Exception:** Self declared capability cannot satisfy a formal study readiness gate until qualification verifies it.

**Acceptance:** A study can filter suitable sites using verified capabilities and current availability.

**Target screen:** S-NET-02 · R1

### FS-NET-002 / FR-NET-002 — Qualification and renewal

Run qualification with scoped evidence and renewal date. Approval activates only the verified tasks and resource types; expiry removes the site from new allocations.

**Exception:** An expired qualification triggers impact review for ongoing work rather than pretending prior evidence never existed.

**Acceptance:** An expired qualification blocks new study allocation until reviewed.

**Target screen:** S-NET-03 · R1

### FS-NET-003 / FR-NET-003 — Capacity planning

Reserve a resource against a dated capacity window using a concurrency checked transaction. Tentative holds have explicit expiry; confirmed reservations reduce available units.

**Exception:** Overlapping requests cannot both consume the last capacity unit; return a conflict with alternative permitted slots.

**Acceptance:** Two programme managers cannot unknowingly allocate the same unavailable clinical capacity.

**Target screen:** S-NET-03 · R1

### FS-NET-004 / FR-NET-004 — Local accountability

Assign investigator, data custodian and escalation contacts to each site and study relationship. Verify active role and accepted responsibility.

**Exception:** Opening a site fails if any required local owner or urgent backup is missing or expired.

**Acceptance:** A live study cannot open a site without all required local accountable roles.

**Target screen:** S-NET-02 · R1

### FS-NET-005 / FR-NET-005 — Partner agreements

Bind site participation to signed active terms covering the allocated work. Alert on expiry and surviving obligations in the capacity and study views.

**Exception:** A new allocation cannot rely on an unsigned or expired agreement; renewal does not erase previous obligations.

**Acceptance:** An agreement expiry is visible before a new study or renewal is approved.

**Target screen:** S-NET-02 · R1

### FS-NET-006 / FR-NET-006 — Expert matching

Rank eligible experts by required competence, language, availability and declared conflict status using transparent matching criteria.

**Exception:** Do not reveal private assignments or competing applications; conflict disqualification is reviewed through ACC.

**Acceptance:** A match explains its eligibility and never reveals a private competing application.

**Target screen:** S-NET-01 · R2

### FS-NET-007 / FR-NET-007 — Site performance

Report operational quality with approved definitions and denominators. Show incomplete data and case mix differences beside comparisons.

**Exception:** Recruitment volume alone cannot determine qualification or scientific quality; metric changes are versioned.

**Acceptance:** Performance comparisons disclose case mix and data completeness limitations.

**Target screen:** S-NET-01 · R1

### FS-NET-008 / FR-NET-008 — Partner suspension

Suspend a partner with scope, reason and effective time. Block new allocations and grants and produce an affected study continuity queue.

**Exception:** The queue remains open until qualified successors accept work or safe closure is recorded.

**Acceptance:** Affected studies receive a documented reassignment or safe closure plan.

**Target screen:** S-NET-03 · R1

### FS-NET-009 / FR-NET-009 — Community participation

Record community consultation topics, participants' capacity, concerns and responsible responses. Link accepted changes to protocol amendments.

**Exception:** Confidential feedback is restricted; closing consultation requires a reasoned response to each material concern.

**Acceptance:** Community feedback has an accountable response and can influence the approved protocol.

**Target screen:** S-NET-02 · R2

## SOL — Solution registry and submissions

Developer, intake reviewer, scientific reviewer and permitted buyer. Accountable role: Product owner.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| intended_use | Object required | Task, user, population, setting, workflow role, excluded uses and manufacturer or responsible developer. |
| configuration | Immutable component set required at submission | Model, software, preprocessing, prompts, tools, corpus, thresholds, dependencies and digest or remote identity limitations. |
| runtime_profile | Object required | Execution mode, CPU or GPU and memory needs, input and output schema, network destinations and expected duration. |
| claims | Set of evidence linked statements | Claim text, setting, population, date, product version, support and self declared or independently verified state. |
| authorisations | Scoped external records optional | Country, issuer, reference, use, version, validity, verification and conditions; no global clearance field. |
| dependencies | Component set required | Provider, licence, version policy, patient data transfer, region, retention and training terms. |
| commercial_terms | Object required for commercial readiness | Pricing basis, evaluation versus production rights, implementation needs, support, maintenance and exit. |
| sharing_scope | Per artefact classification | Public metadata and proprietary payloads have separate rights; uploader proposes scope and rights owner approves. |

### FS-SOL-001 / FR-SOL-001 — Product identity

Create a product profile with explicit intended user, population, task, setting and prohibited use. Validate responsible developer and manufacturer where applicable.

**Exception:** Missing intended use prevents submission and cannot be filled by inferred marketing text.

**Acceptance:** A solution cannot enter evaluation with an undefined intended population or user.

**Target screen:** S-SOL-02 · R1

### FS-SOL-002 / FR-SOL-002 — Version identity

Assemble a configuration from immutable component references and parameters. Freezing records a digest and version; any material component or threshold change creates a successor.

**Exception:** Remote models without stable provider versions carry an explicit identity limitation and cannot claim exact reproducibility.

**Acceptance:** Changing a decision threshold creates a new evaluated configuration rather than overwriting the old one.

**Target screen:** S-SOL-02 · R1

### FS-SOL-003 / FR-SOL-003 — Submission package

Generate the submission checklist from study task, mode and risk. Upload documents through quarantine and show missing, pending scan, accepted or returned items.

**Exception:** Scientific review cannot start while a mandatory item is absent or quarantined.

**Acceptance:** Submission validation identifies missing mandatory materials before scientific review begins.

**Target screen:** S-SOL-02 · R1

### FS-SOL-004 / FR-SOL-004 — Claims register

Create claim records with exact scope and evidence links. Display developer supplied and independently verified claims with different labels and provenance.

**Exception:** A positive result for an older configuration cannot automatically verify a new version's claim.

**Acceptance:** A developer supplied claim remains visibly distinct from a sandbox finding.

**Target screen:** S-SOL-02 · R1

### FS-SOL-005 / FR-SOL-005 — Regulatory status

Record external authorisation details and route verification to the qualified country owner. Show scope, validity and unverified status until evidence is checked.

**Exception:** A document for another indication or country cannot populate the requested scope's verified status.

**Acceptance:** An authorisation for one use and jurisdiction is not displayed as unrestricted global clearance.

**Target screen:** S-SOL-03 · R1

### FS-SOL-006 / FR-SOL-006 — Deployment modes

Declare container, local, edge or hosted API mode and required inspection visibility. Admission binds the approved execution profile and disclosed limits.

**Exception:** Unsupported mode remains in discovery; a black box API cannot be presented as inspected source or weights.

**Acceptance:** A black box API submission identifies reproducibility and inspection limits before acceptance.

**Target screen:** S-SOL-03 · R1

### FS-SOL-007 / FR-SOL-007 — Dependency disclosure

List all external models, services and licences and the data they receive. Material dependency changes trigger rights, region and version review.

**Exception:** An undeclared or unapproved provider blocks any run that would transmit restricted content.

**Acceptance:** An undeclared external model provider prevents activation of a restricted data evaluation.

**Target screen:** S-SOL-02 · R1

### FS-SOL-008 / FR-SOL-008 — Commercial readiness

Separate evaluation licence from production licence and capture recurring fees, integration, support and exit. Present the approved terms to procurement users.

**Exception:** Missing production rights or support is a readiness blocker, even when evaluation access is valid.

**Acceptance:** A procurement reviewer can distinguish evaluation access from production licensing rights.

**Target screen:** S-SOL-02 · R1

### FS-SOL-009 / FR-SOL-009 — Confidentiality controls

Assign classification and proposed audience per artefact; preview public and partner profiles independently. Publication checks all contributing rights.

**Exception:** Making a profile public does not release model binaries, confidential prices or patient evidence.

**Acceptance:** Publishing a public solution profile does not expose its proprietary model files.

**Target screen:** S-SOL-02 · R1

### FS-SOL-010 / FR-SOL-010 — Withdrawal and recall

Withdraw a submission or recall a configuration with reason and affected versions. Block new studies and identify active runs, reports and deployments for action.

**Exception:** Preserve negative findings, safety history and contractual duties; withdrawal cannot delete them.

**Acceptance:** A withdrawn version is unavailable for new studies while its historical evidence remains traceable.

**Target screen:** S-SOL-03 · R1

### FS-SOL-011 / FR-SOL-011 — Comparable profiles

Use a common profile schema and filters for intended use, population, setting and evidence status. Show comparisons only within declared compatible task and method scope.

**Exception:** Do not sort unrelated products by a single accuracy field or imply endorsement from catalogue presence.

**Acceptance:** Search results do not rank unlike clinical tasks by a single undifferentiated accuracy score.

**Target screen:** S-SOL-01 · R2

### FS-SOL-012 / FR-SOL-012 — Ownership disputes

Open an ownership dispute with claimant, evidence, affected assets and responsible institution. Apply a hold to transfer and deletion while preserving controlled review access.

**Exception:** The challenged uploader cannot resolve its own dispute or erase evidence during the hold.

**Acceptance:** A disputed uploader cannot transfer or delete the challenged asset during a hold.

**Target screen:** S-SOL-03 · R1

## AGR — Contracts intellectual property and funding conditions

Contract owner, institutional signers, privacy owner and finance owner. Accountable role: Legal and commercial lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| agreement_type | Controlled value required | Participation, confidentiality, data use, processing, evaluation, licence, site or award; multiple linked records allowed. |
| parties | Set required | Verified legal entities, representative capacities and signature requirements; distinguish programme display names. |
| activity_rights | Matrix required | Inspect, execute, modify, adapt, train, retain, publish and transfer by asset class, purpose and recipient. |
| term | Object required | Start, end, renewal notice, termination conditions, retention and surviving clauses with source references. |
| provider_approval | Object conditional | Processor, service, data classes, purpose, regions, retention, training terms and effective approval. |
| funding_conditions | Object conditional | Eligible costs, countries, award period, currency, ceiling, milestones and reporting obligations. |
| signature | Verified record required for effectiveness | Signer capacity, document digest, signature time, method, verifier and integrity outcome. |
| responsibility_schedule | Object required at activation | Care, product, study, data, safety and insurance obligations with accepted owners. |

### FS-AGR-001 / FR-AGR-001 — Agreement register

Register versions and parties, then collect verified signatures against the exact file digest. Only effective signed versions satisfy study gates.

**Exception:** Replacing a file creates a successor and resets its signature status; unsigned drafts cannot satisfy effectiveness.

**Acceptance:** A study gate evaluates the active signed agreement rather than an unsigned draft.

**Target screen:** S-AGR-02 · R1

### FS-AGR-002 / FR-AGR-002 — Rights by activity

Capture separate rights for each activity and asset class. Preview whether a proposed run, adaptation, export or publication is permitted.

**Exception:** Inference permission cannot satisfy training or redistribution checks; ambiguous rights block that activity.

**Acceptance:** Permission to run inference does not authorise training or model weight redistribution.

**Target screen:** S-AGR-02 · R1

### FS-AGR-003 / FR-AGR-003 — Evidence ownership

Record ownership and licensed use of raw data, derived assets, models, results and reports. Resolve contributing rights when assembling an export.

**Exception:** Restricted publication terms withhold affected content until redaction or an additional right is approved.

**Acceptance:** A report export checks the rights of all contributing assets.

**Target screen:** S-AGR-02 · R1

### FS-AGR-004 / FR-AGR-004 — Term and expiry

Calculate effective, expiring, expired and terminated states from signed dates. Create renewal tasks and enforce the exact effective boundary.

**Exception:** Renewal discussions do not extend rights; surviving confidentiality, retention and safety duties remain active.

**Acceptance:** An expired data licence blocks new runs even if a study remains administratively open.

**Target screen:** S-AGR-01 · R1

### FS-AGR-005 / FR-AGR-005 — Subprocessors and providers

Approve providers for specific services, purposes, regions and data classes. Connectors and assistants reference the effective approval version.

**Exception:** Changed provider or training terms suspend affected transmission until assessed; vendor registration alone is insufficient.

**Acceptance:** A new provider cannot receive study data before its approval becomes effective.

**Target screen:** S-AGR-02 · R1

### FS-AGR-006 / FR-AGR-006 — Funding restrictions

Bind awards to eligible costs, geography, period and milestones. Validate commitments and charges before allocation.

**Exception:** Out of scope costs enter a finance exception queue and cannot silently consume the award.

**Acceptance:** A charge outside the award period is flagged before invoicing or drawdown.

**Target screen:** S-AGR-02 · R1

### FS-AGR-007 / FR-AGR-007 — Independence terms

Record editorial authority, negative result treatment, developer response period and appeal route as required evaluation terms.

**Exception:** A payer cannot acquire unilateral power to replace or remove signed scientific findings.

**Acceptance:** A payer cannot remove an unfavourable finding from the signed scientific record.

**Target screen:** S-AGR-02 · R1

### FS-AGR-008 / FR-AGR-008 — Contract exceptions

Request exceptions with affected clause, compensating measures, owner, expiry and independent decision; preview the affected activities.

**Exception:** Reject nonwaivable law, clinical or data exceptions; a discount changes price only.

**Acceptance:** A commercial discount does not modify clinical safety or data protection requirements.

**Target screen:** S-AGR-03 · R1

### FS-AGR-009 / FR-AGR-009 — Signature integration

Accept an approved signature response or verify an external signed file. Bind signers, document bytes, time and verification evidence.

**Exception:** Invalid integrity or unknown signer capacity leaves the agreement pending; retries cannot duplicate signatures.

**Acceptance:** Replacing an agreement file invalidates its prior signature association.

**Target screen:** S-AGR-03 · R2

### FS-AGR-010 / FR-AGR-010 — Liability allocation

Require accepted responsibility for care, study, product, data and incidents; verify required insurance scope and period.

**Exception:** Unassigned responsibility or expired required coverage blocks the dependent activation gate.

**Acceptance:** Activation is blocked where a required responsibility or coverage obligation is unresolved.

**Target screen:** S-AGR-03 · R1

## WFL — Study workflow and review management

Programme manager, assigned reviewers, decision owners and independent appeals panel. Accountable role: Evaluation director.

**Current relationship:** Exact study snapshot review with different test-person checks; production authorities absent.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| study_scope | Object required | Decision, product configuration, study type, institutions, countries, sites and protocol reference. |
| gate_definition | Versioned item set required | Applicability, evidence type, eligible role, blocking status and expiry rule. |
| task | Object required | Assignee, accountable owner, due date, dependencies, deliverable, status and escalation. |
| decision | Immutable after signature | Outcome, scope, reasons, evidence versions, signer, conditions, authentication context and time. |
| condition | Object conditional | Prerequisite or follow up, measurable completion, owner, due date, verifier and dependent activity. |
| review_assignment | Object required | Reviewer, competence, conflict result, blinding group, visibility and review period. |
| amendment | Versioned change request | Changed objects, rationale, materiality, affected scope, reapprovals and transition treatment. |
| clock_interval | System event record | Stage, start, stop, active or applicant delay or authority delay or pause, reason and actor. |

### FS-WFL-001 / FR-WFL-001 — Configurable gates

Instantiate gates from study type and effective country profiles. Show required evidence and use the Section 5 transition guards.

**Exception:** Changing a display status or template cannot skip mandatory gates.

**Acceptance:** Users cannot skip an applicable ethics or data gate by changing a display status.

**Target screen:** S-WFL-02 · R1

### FS-WFL-002 / FR-WFL-002 — Task orchestration

Create dependent tasks with owners, due dates and escalation. Mark actionable only when prerequisites are satisfied.

**Exception:** Departure routes the task to accountable owner and backup; it never completes the task automatically.

**Acceptance:** A blocked task shows the dependency and accountable party rather than an unexplained delay.

**Target screen:** S-WFL-02 · R1

### FS-WFL-003 / FR-WFL-003 — Decision records

Present the exact evidence snapshot and scope. Commit decision, conditions and audit together after eligible signature.

**Exception:** Stale evidence or expired competence returns a blocker; no partial approval is recorded.

**Acceptance:** A report can reconstruct precisely which documents supported the decision.

**Target screen:** S-WFL-03 · R1

### FS-WFL-004 / FR-WFL-004 — Parallel review

Assign independent parallel review lanes with configured blinding. Lock each review before permitted comparison.

**Exception:** Comments, exports and notifications preserve blinding; early disclosure becomes a deviation.

**Acceptance:** A blinded reviewer cannot see another review before its permitted unblinding point.

**Target screen:** S-WFL-03 · R1

### FS-WFL-005 / FR-WFL-005 — Conditional decisions

Classify every condition as execution prerequisite or permitted follow up, with measurable completion and owner.

**Exception:** Unmet prerequisites block dependent action; vague conditions require clarification before decision acceptance.

**Acceptance:** An unmet prerequisite condition prevents the dependent activity from starting.

**Target screen:** S-WFL-03 · R1

### FS-WFL-006 / FR-WFL-006 — Rework and resubmission

Return itemised queries and accept a versioned resubmission with comparison. Preserve original review and first submission time.

**Exception:** Reviewers acknowledge changed material; unchanged evidence is reused only within continuing validity.

**Acceptance:** Reviewers can compare the changed material and distinguish new evidence from unchanged claims.

**Target screen:** S-WFL-02 · R1

### FS-WFL-007 / FR-WFL-007 — Appeals

Accept appeal grounds within the programme window and assign an independent panel. Retain the appealed decision and its evidence.

**Exception:** Original sole decision maker cannot adjudicate; an appeal does not automatically lift a safety hold.

**Acceptance:** The original decision maker cannot be the sole adjudicator of the appeal.

**Target screen:** S-WFL-03 · R1

### FS-WFL-008 / FR-WFL-008 — Suspension and resumption

Suspend affected activity, retain prior phase and permit authorised remediation. Resumption rechecks every active hold and gate.

**Exception:** Commercial users cannot clear clinical or security holds; each hold requires its own authorised resolution.

**Acceptance:** A commercial manager cannot resume a clinical suspension independently.

**Target screen:** S-WFL-03 · R1

### FS-WFL-009 / FR-WFL-009 — Amendments

Submit material changes as amendments and calculate affected sites, permissions, runs and claims. Route impact decisions separately.

**Exception:** New sites, uses or configurations remain inactive until relevant amendment and local prerequisites pass.

**Acceptance:** An added site cannot recruit under another site's approval unless explicitly covered.

**Target screen:** S-WFL-02 · R1

### FS-WFL-010 / FR-WFL-010 — Service clocks

Record stage events and reasoned pause intervals. Show wall clock elapsed and active time using normalised nonoverlapping intervals.

**Exception:** Rework cannot reset age and overlapping pauses cannot be deducted twice.

**Acceptance:** Turnaround reporting cannot improve by silently resetting an application's start date.

**Target screen:** S-WFL-01 · R1

## ETH — Ethics and participant protection

Qualified ethics owner, local investigator, communication owner and independent complaints handler. Accountable role: Clinical safety lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| determination | Object required per study | Review required, exemption or other lawful route, qualified issuer, reason, evidence and governed scope. |
| permission_scope | Object conditional | Protocol, sites, populations, activities, materials, dates and conditions. |
| participant_basis | Required before governed enrolment | Site participant key, consent or waiver basis, materials version, language, collector and time. |
| vulnerable_pathway | Approved rules conditional | Population category, representative authority, assent, exclusions and escalation owner. |
| withdrawal_request | Case conditional | Verified scope, effective time, participation changes, lawful retained uses and response. |
| oversight_plan | Versioned object conditional | Qualified clinical owner, supervision, escalation, fallback and accepted local responsibility. |
| communication | Approved content conditional | Purpose, source version, language review, recipients, release authority, channel and delivery. |
| complaint | Confidential case | Minimal concern, safe contact if supplied, affected scope, independent owner, triage and outcome. |

### FS-ETH-001 / FR-ETH-001 — Ethics applicability

Require a qualified applicability determination with evidence supporting approval, exemption or another lawful route.

**Exception:** An evaluator cannot self select exemption without the required institutional authority.

**Acceptance:** An evaluator cannot self declare exemption without the required institutional authority.

**Target screen:** S-ETH-02 · R1

### FS-ETH-002 / FR-ETH-002 — Approval records

Match permission to protocol, sites, population, activities and materials. Show scope, conditions and expiry beside the study gate.

**Exception:** A different protocol or excluded population creates a blocker, not assumed equivalence.

**Acceptance:** A study cannot use an approval that covers a different protocol or excluded population.

**Target screen:** S-ETH-02 · R1

### FS-ETH-003 / FR-ETH-003 — Consent and notices

Store approved materials by language and source version; bind exact consent or waiver evidence to each governed participant activity.

**Exception:** Draft translations or missing collection evidence cannot satisfy enrolment.

**Acceptance:** A participant's record identifies the exact consent materials and basis that apply.

**Target screen:** S-ETH-02 · R2

### FS-ETH-004 / FR-ETH-004 — Vulnerable populations

Apply the approved vulnerable population pathway and validate representative authority, assent and exclusions.

**Exception:** Missing required safeguards block recruitment and route to the qualified local owner.

**Acceptance:** Recruitment blocks when the required authorised consent pathway is missing.

**Target screen:** S-ETH-02 · R2

### FS-ETH-005 / FR-ETH-005 — Secondary use

Assess retrospective use against lawful basis, purposes, ethics and data terms; bind to dataset and protocol.

**Exception:** Deidentification does not authorise an excluded secondary purpose.

**Acceptance:** A deidentified dataset is rejected for a purpose excluded by its data use agreement.

**Target screen:** S-ETH-02 · R1

### FS-ETH-006 / FR-ETH-006 — Participant withdrawal

Verify withdrawal, stop governed future participation and review retention, analyses and follow up. Record the participant response.

**Exception:** Do not promise deletion of lawfully retained records; distinguish what ceased and what remains.

**Acceptance:** The participant and study owner receive an outcome showing what ceased and what must remain.

**Target screen:** S-ETH-03 · R2

### FS-ETH-007 / FR-ETH-007 — Clinical oversight

Require local clinical acceptance of supervision, escalation and standard care fallback. Display current urgent contacts at each site.

**Exception:** No qualified owner or fallback means care affecting functionality cannot start.

**Acceptance:** The study cannot start until a local accountable clinician accepts the oversight plan.

**Target screen:** S-ETH-02 · R2

### FS-ETH-008 / FR-ETH-008 — Ethics renewal

Generate renewal and amendment tasks and stop governed new activity at expiry unless a verified extension is effective.

**Exception:** Submitted renewal is not approval; existing participants require a local continuity decision.

**Acceptance:** New affected activity stops at expiry unless a valid extension is recorded.

**Target screen:** S-ETH-01 · R1

### FS-ETH-009 / FR-ETH-009 — Participant communication

Prepare approved language content, validate recipients and obtain release authority before dispatch. Track delivery and acknowledgement where needed.

**Exception:** Failed delivery remains open; shared device previews contain no sensitive details.

**Acceptance:** Messages are checked for language, confidentiality and approved content before release.

**Target screen:** S-ETH-03 · R2

### FS-ETH-010 / FR-ETH-010 — Ethical complaints

Accept confidential concerns independently of developer permissions and assign a handler outside the implicated chain.

**Exception:** The complaint subject cannot delete the case, reveal protected reporter details or close its independent review.

**Acceptance:** A complaint receives an independent owner and cannot be deleted by the subject of the complaint.

**Target screen:** S-ETH-03 · R1

## DAC — Data catalogue permissions and purpose control

Data custodian, study applicant, privacy reviewer and disclosure reviewer. Accountable role: Data governance lead.

**Current relationship:** Synthetic dataset/media grants; not general clinical-data purpose/region control.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| catalogue_metadata | Object required | Custodian, modalities, population, dates, geography, provenance, quality, sensitivity and discoverable fields. |
| grant_subjects | Set required | Verified users or services and study; member changes require controlled revision. |
| grant_scope | Object required | Purpose, dataset release, fields, cohort, environment, region, start, expiry and output rights. |
| legal_basis | Versioned record required | Consent categories, lawful or institutional basis, restrictions and evidence at suitable granularity. |
| minimisation | Approved view | Necessary fields, granularity, cohort, redactions, justification and retention. |
| residency | Location inventory required | Original, working, derived, cache, backup and support locations with permitted routes. |
| benchmark_controls | Conditional object | Custodians, hidden labels, attempt quota, related developer identities and reset decision. |
| export_request | Object required | Versions, fields, recipient, purpose, format, disclosure tests, rights decision and expiry. |

### FS-DAC-001 / FR-DAC-001 — Dataset catalogue

Publish metadata separately from records. Custodians choose discoverable fields and restrict sensitive population counts or locations.

**Exception:** Discovery never grants sample, thumbnail or underlying record access.

**Acceptance:** A catalogue entry can be discoverable without exposing records or sensitive sample counts.

**Target screen:** S-DAC-02 · R1

### FS-DAC-002 / FR-DAC-002 — Data access applications

Request purpose, protocol, team, version, region, period and outputs. Reviewers approve exact subsets and conditions.

**Exception:** Added users, fields or training intent require revised approval; returned requests retain questions.

**Acceptance:** The custodian can approve a restricted subset or deny with reasons.

**Target screen:** S-DAC-02 · R1

### FS-DAC-003 / FR-DAC-003 — Purpose bound grants

Issue a grant after all required decisions; enforce approved view and period on queries, runs, exports and provider calls.

**Exception:** Evaluation rights fail training requests; successor datasets are not automatically included.

**Acceptance:** A valid grant for evaluation cannot be used by a training job.

**Target screen:** S-DAC-03 · R1

### FS-DAC-004 / FR-DAC-004 — Consent and legal basis metadata

Apply consent and basis restrictions at record or cohort level where needed. Include only eligible records and retain safe exclusion counts.

**Exception:** Mixed rights cannot collapse into one permissive dataset flag; uncertain records remain excluded.

**Acceptance:** A mixed dataset can exclude records that are not authorised for the requested purpose.

**Target screen:** S-DAC-02 · R1

### FS-DAC-005 / FR-DAC-005 — Data minimisation

Review necessary fields and precision against the protocol, then publish the approved view.

**Exception:** Extra identifiers or granularity require documented need and reapproval.

**Acceptance:** An evaluator using age bands cannot request dates of birth without a new approved need.

**Target screen:** S-DAC-03 · R1

### FS-DAC-006 / FR-DAC-006 — Data residence

Validate every planned copy, backup and remote support location against the asset inventory and policy.

**Exception:** Cross border support is a governed access event, not a routine administrative exemption.

**Acceptance:** A cross border support session is evaluated under the same applicable restrictions as processing.

**Target screen:** S-DAC-02 · R1

### FS-DAC-007 / FR-DAC-007 — Pseudonymisation

Expose study pseudonyms to evaluators and restrict linkage and reidentification to separately authorised local roles.

**Exception:** Pseudonymised data remain sensitive; operators cannot use linkage stores through administrative status.

**Acceptance:** Evaluation users cannot recover identities using the linkage key store.

**Target screen:** S-DAC-02 · R1

### FS-DAC-008 / FR-DAC-008 — Revocation and downstream impact

Revoke with reason, identify active work, controlled copies and outputs, then assign containment and remediation.

**Exception:** New online access stops within 60 seconds; external copies require tracked contractual follow up.

**Acceptance:** New access stops promptly and each affected asset receives an accountable remediation decision.

**Target screen:** S-DAC-03 · R1

### FS-DAC-009 / FR-DAC-009 — Controlled exports

Check rights, personal information, small cells and inference risks on the exact export manifest, then collect required human approvals.

**Exception:** Patient rows remain withheld even when aggregate scores are releasable; changes invalidate release approval.

**Acceptance:** A result containing disallowed patient rows is withheld even when its aggregate score is releasable.

**Target screen:** S-DAC-03 · R1

### FS-DAC-010 / FR-DAC-010 — Federated access

Send an approved run to a custodian node; local acceptance and outgoing result review remain separate decisions.

**Exception:** Central scheduling cannot override refusal; missing acknowledgement never implies execution.

**Acceptance:** A local custodian can refuse a run or an output release independently of central scheduling.

**Target screen:** S-DAC-03 · R2

### FS-DAC-011 / FR-DAC-011 — Benchmark secrecy

Enforce hidden labels and attempt budgets across verified related identities. Record attempts and disclose only approved feedback.

**Exception:** Duplicate accounts cannot reset quota; reset requires independent authority.

**Acceptance:** A developer cannot download sealed labels or bypass its submission limit with a duplicate identity.

**Target screen:** S-DAC-03 · R1

### FS-DAC-012 / FR-DAC-012 — Data rights requests

Verify the rights requester, controller, scope and deadline; trace affected assets and issue a reasoned outcome.

**Exception:** Assess holds and clinical duties before deletion; do not fulfil requests by arbitrary record removal.

**Acceptance:** A request is not automatically fulfilled in a way that destroys a lawful clinical record or legal hold.

**Target screen:** S-DAC-03 · R1

## ING — Data ingestion and validation

Data engineer, custodian, mapping reviewer and integration owner. Accountable role: Data engineering lead.

**Current relationship:** Strict CSV and bounded synthetic WAV upload/quarantine; scanner and clinical ingestion absent.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| source_manifest | Object required | Source, external batch key, expected files or rows, bytes, digest, version and use rights. |
| schema_mapping | Approved version required | Source fields, destination meaning, type, unit, codes, null states and transformations. |
| transfer_state | System controlled | Created, uploading, quarantined, validating, reconciled, released, failed or cancelled. |
| record_outcome | Exclusive category per row | Accepted, rejected or quarantined with reason; legitimate encounters remain distinct. |
| duplicate_candidate | Conditional object | Approved linkage evidence, confidence, disposition and reviewer. |
| transform_manifest | Immutable on release | Inputs, mapping, parameters, actor, time and output digest. |
| deidentification | Conditional review | Structured identifiers, metadata, free text, pixels, residual risk and reviewer. |
| source_cursor | Conditional checkpoint | Connector, source version, acknowledged key, watermark, replay range and schema fingerprint. |

### FS-ING-001 / FR-ING-001 — Import methods

Register source, rights, manifest and mapping before transfer. Accept only admitted formats and approved source systems.

**Exception:** Unknown source, unsupported type or absent purpose keeps the batch unaccepted.

**Acceptance:** An import without an authorised source and active access grant cannot enter a study workspace.

**Target screen:** S-ING-02 · R1

### FS-ING-002 / FR-ING-002 — Quarantine and scanning

Quarantine before preview, extraction, indexing or execution. Record detected type, malware and unsafe structure results.

**Exception:** Failed or unavailable scan blocks downstream use; extensions cannot override content detection.

**Acceptance:** A failed scan prevents previews, execution and downstream indexing.

**Target screen:** S-ING-01 · R1

### FS-ING-003 / FR-ING-003 — Schema and semantic validation

Validate types, required values, units, codes and chronology against the approved schema. Expose field reasons to permitted reviewers.

**Exception:** Do not coerce semantically incompatible clinical values into acceptance.

**Acceptance:** A plausible numeric value with an incompatible unit is flagged rather than silently accepted.

**Target screen:** S-ING-02 · R1

### FS-ING-004 / FR-ING-004 — Identity and deduplication

Detect duplicates and overlap through approved linkage, then distinguish repeated encounters using reviewed disposition.

**Exception:** Ambiguous identity remains unresolved; messages cannot expose hidden identifiers.

**Acceptance:** Repeated encounters remain distinguishable from accidental duplicate records.

**Target screen:** S-ING-02 · R1

### FS-ING-005 / FR-ING-005 — Import reconciliation

Reconcile source count as accepted plus rejected plus quarantined. Release a summary with every exclusion and reason.

**Exception:** Unaccounted inputs block completion; partial acceptance needs explicit approval carried into analysis.

**Acceptance:** An import cannot report complete while unaccounted records remain.

**Target screen:** S-ING-03 · R1

### FS-ING-006 / FR-ING-006 — Resumable transfer

Resume verified chunks under the same upload identity and check final size and digest.

**Exception:** Conflicting payloads fail integrity; retries cannot produce duplicate released assets or charges.

**Acceptance:** A resumed upload produces one verified asset with the expected checksum.

**Target screen:** S-ING-01 · R1

### FS-ING-007 / FR-ING-007 — Provenance lineage

Persist lineage for every material transform with versions, parameters, mapping and execution identity.

**Exception:** Missing source or transform references block use in formal findings.

**Acceptance:** A reported metric can be traced back through every material transformation.

**Target screen:** S-ING-02 · R1

### FS-ING-008 / FR-ING-008 — Data correction

Correct through a successor with original, replacement, reason and evidence; notify affected analyses and reports.

**Exception:** Never overwrite an issued dataset; scientific owners decide correction or withdrawal impact.

**Acceptance:** Correcting a label creates a new dataset version and marks dependent reports for assessment.

**Target screen:** S-ING-03 · R1

### FS-ING-009 / FR-ING-009 — Deidentification review

Detect identifiers across structured metadata, text and pixels; require specified human residual risk review.

**Exception:** Removing identifier columns alone does not clear imaging or narrative data for release.

**Acceptance:** Removing structured identifiers alone does not mark an imaging dataset safe to release.

**Target screen:** S-ING-03 · R1

### FS-ING-010 / FR-ING-010 — Scheduled ingestion

Ingest incrementally with approved source cursor, freshness checks and schema fingerprint before checkpoint advancement.

**Exception:** Incompatible changes pause processing; replay uses source keys and versions to prevent duplicates.

**Acceptance:** An incompatible source change pauses affected processing and identifies the responsible integration owner.

**Target screen:** S-ING-01 · R2

## CUR — Curation annotation and reference standards

Curation manager, annotator, adjudicator and custodian. Accountable role: Clinical data lead.

**Current relationship:** Generated references and participant partitions; independent sealed-label service absent.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| reference_standard | Approved object required | Definition, rationale, timing, limitations, evidence and adjudication method. |
| guideline_version | Approved immutable reference | Label definitions, examples, allowed values, uncertainty and qualification. |
| task_assignment | Object required | Case key, annotator, competence, grant, blinding, due date and version. |
| label | Versioned observation | Value or uncertain state, evidence reference, annotator, guideline and time. |
| adjudication | Conditional object | Original labels, adjudicator, decision and rationale; originals retained. |
| quality_plan | Required for release | Sampling, agreement method, denominator, threshold, reviewer and failure treatment. |
| partition | Controlled assignment | Development, tuning, validation or final test with patient, site and time rules. |
| release_manifest | Immutable required | Members, labels, guidelines, rights, quality, digest and custodian approval. |

### FS-CUR-001 / FR-CUR-001 — Reference standard definition

Approve the clinical reference before annotation and evaluation; record timing and limitations for analysis.

**Exception:** Available model predictions cannot be declared clinical ground truth by default.

**Acceptance:** A protocol cannot label an unverified model prediction as clinical ground truth.

**Target screen:** S-CUR-02 · R1

### FS-CUR-002 / FR-CUR-002 — Annotation work allocation

Allocate to qualified users with valid grants and blinding. Reserve work while permitting planned independent labels.

**Exception:** Assignment does not grant access; expired competence or purpose blocks opening cases.

**Acceptance:** An annotator cannot open an unassigned task or access a disallowed patient identifier.

**Target screen:** S-CUR-01 · R1

### FS-CUR-003 / FR-CUR-003 — Annotation guidelines

Bind each label to an approved guideline. Changes create successors and identify tasks needing review.

**Exception:** In progress tasks cannot silently switch definitions; annotators acknowledge the new version.

**Acceptance:** Every label records the applicable guideline version and annotator identity.

**Target screen:** S-CUR-02 · R1

### FS-CUR-004 / FR-CUR-004 — Independent labelling

Collect independent labels without revealing peers, then route disagreement to an eligible adjudicator.

**Exception:** Preserve originals and disagreement; conflicts or insufficient competence require reassignment.

**Acceptance:** Initial independent labels remain recoverable after adjudication.

**Target screen:** S-CUR-03 · R1

### FS-CUR-005 / FR-CUR-005 — Agreement and quality checks

Calculate approved agreement and sampled quality with denominators, missingness and method version.

**Exception:** Post adjudication consensus cannot be reported as original interrater agreement.

**Acceptance:** A quality report distinguishes consensus, disagreement and missing labels.

**Target screen:** S-CUR-03 · R1

### FS-CUR-006 / FR-CUR-006 — Uncertain and unavailable labels

Offer explicit uncertain, indeterminate and unavailable outcomes with reasons; carry them into analysis.

**Exception:** Do not force binary labels or convert missing follow up into clinical negatives.

**Acceptance:** An indeterminate outcome is handled according to the prespecified analysis plan.

**Target screen:** S-CUR-02 · R1

### FS-CUR-007 / FR-CUR-007 — Blinding controls

Filter views, history, exports and links under blinding; record authorised unblinding.

**Exception:** Accidental output exposure creates a deviation and affected label review.

**Acceptance:** A blinded reviewer cannot see the evaluated model's prediction through exports or task history.

**Target screen:** S-CUR-02 · R1

### FS-CUR-008 / FR-CUR-008 — Dataset partitions

Assign partitions using patient, site and time rules; retain leakage checks before freezing.

**Exception:** Known overlap blocks independent test claims unless explicitly justified by the approved design.

**Acceptance:** Patient overlap across partitions is detected before an evaluation is accepted.

**Target screen:** S-CUR-03 · R1

### FS-CUR-009 / FR-CUR-009 — Curation release

Freeze records and labels after rights and quality approval and generate immutable manifest identity.

**Exception:** Membership or label changes create a successor; drafts cannot be formal test inputs.

**Acceptance:** A released dataset cannot change its membership without a new version.

**Target screen:** S-CUR-03 · R1

### FS-CUR-010 / FR-CUR-010 — Specialist annotation integrations

Export scoped tasks to approved tools and reconcile returned labels to task, guideline and reviewer.

**Exception:** Unknown tasks, changed definitions or missing attribution enter reconciliation rather than automatic acceptance.

**Acceptance:** Imported annotations reconcile to the original task and retain reviewer attribution.

**Target screen:** S-CUR-02 · R2

## RUN — Controlled workspaces and evaluation execution

Evaluator, execution operator, custodian and safety or security owner. Accountable role: Engineering lead.

**Current relationship:** Fixed/portable model execution and manually dispatched jobs; no arbitrary containers/GPU.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| workspace_request | Object required | Study, approved profile, region, access list, grants, budget and expiry. |
| run_manifest | Immutable required | Protocol, inputs, configuration, metrics, environment, dependencies, seeds, parameters and actor. |
| resource_limits | Positive bounded values | CPU, GPU, memory, storage, concurrency, runtime and spend within allocation. |
| egress_policy | Approved optional exceptions | Destination identity, purpose, transmitted data classes and provider approval; deny by default. |
| attempt | System object | Logical request, idempotency key, index, parent, state, times, exit reason and charge class. |
| output_manifest | Restricted required | Artifacts, digests, schema checks, sensitive findings, release status and audience. |
| node_status | Conditional object | Custodian, attestation, last contact, lease expiry, instruction and acknowledgement. |
| termination | Conditional command record | Requester, scope, reason, time, observed outcome and retained diagnostics. |

### FS-RUN-001 / FR-RUN-001 — Workspace request

Provision after checking study gates, configuration, grants, region, access and funded resources. Expiry is bounded by controlling permissions.

**Exception:** Missing prerequisites return blockers; partially provisioned workspaces remain inaccessible.

**Acceptance:** Provisioning fails when any required grant or prerequisite is expired.

**Target screen:** S-RUN-02 · R1

### FS-RUN-002 / FR-RUN-002 — Execution isolation

Use validated isolation profiles and verified cleanup of storage and residual CPU or GPU memory before reuse. Retain profile and cleanup evidence.

**Exception:** Failed isolation or cleanup quarantines resources before another study can use them.

**Acceptance:** A workload cannot read another study's files, secrets or residual CPU or GPU memory.

**Target screen:** S-RUN-03 · R1

### FS-RUN-003 / FR-RUN-003 — Network controls

Match each outbound destination to approved egress; record permitted categories and safe blocked connection diagnostics.

**Exception:** Undeclared connections are denied and flagged without copying unrestricted payloads into logs.

**Acceptance:** A model attempting an undeclared external API call is blocked and flagged.

**Target screen:** S-RUN-02 · R1

### FS-RUN-004 / FR-RUN-004 — Resource quotas

Reserve resources and budget before start, meter consumption and enforce limits while preserving other studies' allocations.

**Exception:** Retries cannot bypass remaining budget; safety investigation reserves remain protected.

**Acceptance:** A runaway job stops at its approved limit and cannot exhaust another study's allocation.

**Target screen:** S-RUN-01 · R1

### FS-RUN-005 / FR-RUN-005 — Reproducible run manifest

Freeze the run manifest before dispatch and record actual environment identities at start.

**Exception:** Missing or unpinned components create explicit reproducibility limits and block execution where the protocol requires stable identity.

**Acceptance:** An authorised reviewer can reconstruct the exact configuration used for a reported result.

**Target screen:** S-RUN-02 · R1

### FS-RUN-006 / FR-RUN-006 — Execution lifecycle

Use requested, validating, queued, running, cancelling, succeeded, failed, cancelled and blocked states with observed times.

**Exception:** Execution success is distinct from scientific success; failure cannot be cleared by editing status.

**Acceptance:** A failed job cannot be represented as a completed successful evaluation.

**Target screen:** S-RUN-01 · R1

### FS-RUN-007 / FR-RUN-007 — Idempotent retries

Retry with a linked attempt after checking current permission and budget; duplicate network submissions return the existing request.

**Exception:** Changed payload under the same key conflicts; evidence and charges follow the declared attempt policy.

**Acceptance:** A network retry creates no second charge or duplicate final result for the same logical request.

**Target screen:** S-RUN-03 · R1

### FS-RUN-008 / FR-RUN-008 — External API evaluation

Check endpoint terms, region, fields and version guarantees; record request identities and provider configuration.

**Exception:** Provider change triggers comparability review; unapproved transmission is blocked.

**Acceptance:** An unpinned provider change marks comparability uncertain and triggers review.

**Target screen:** S-RUN-02 · R1

### FS-RUN-009 / FR-RUN-009 — Output handling

Keep outputs and logs restricted until integrity, schema and disclosure checks pass on the exact manifest.

**Exception:** Sensitive diagnostics cannot automatically enter ordinary support tickets or public reports.

**Acceptance:** Logs containing patient data cannot be automatically attached to a public support ticket.

**Target screen:** S-RUN-03 · R1

### FS-RUN-010 / FR-RUN-010 — Expiry and shutdown

At expiry, suspension or closure block new processing, cancel queued work and safely contain active jobs.

**Exception:** Saved schedules and old credentials cannot restart an expired workspace.

**Acceptance:** A scheduled job cannot restart a closed workspace using an old credential.

**Target screen:** S-RUN-03 · R1

### FS-RUN-011 / FR-RUN-011 — Remote execution nodes

Dispatch scoped instructions to qualified local nodes and track acceptance, execution and observed completion; display contact age and lease.

**Exception:** Disconnected status stays unconfirmed; local policy stops new work after approved offline lease expiry.

**Acceptance:** A disconnected node cannot be assumed to have received a stop instruction.

**Target screen:** S-RUN-03 · R2

### FS-RUN-012 / FR-RUN-012 — Emergency termination

Allow immediate authorised termination, preserve bounded diagnostics and distinguish requested from observed stop.

**Exception:** A central command does not prove local shutdown; missing acknowledgement escalates.

**Acceptance:** Termination prevents new affected execution and records the scope, requester and observed completion status.

**Target screen:** S-RUN-03 · R1

## PRO — Evaluation protocol and analysis planning

Evaluation lead, statistician, clinical owner and independent protocol reviewer. Accountable role: Evaluation director.

**Current relationship:** Bounded protocol/configuration freezes; full clinical methodology remains open.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| study_type | Required controlled value | Benchmark, retrospective, simulation, silent prospective or interventional; determines capability and exposure gates. |
| endpoint | One or more structured records | Primary or secondary, definition, time horizon, population, denominator, metric and decision relevance. |
| sample_plan | Qualified approval required | Expected prevalence, precision or power method, assumptions, clustering, sample target and subgroup feasibility. |
| threshold | Object required for every pass criterion | Metric, operator, value, units, population, confidence treatment and clinical rationale; no universal default. |
| analysis_plan | Versioned required | Missingness, exclusions, repeated measures, multiplicity, failed predictions, uncertainty and deviations. |
| comparator | Object required for comparative claims | Version, workflow, population, data, timing and comparability limitations. |
| subgroup_plan | Set required or reasoned absence | Lawfully available attributes, definitions, interactions, sample adequacy and disclosure rules. |
| stop_rule | Conditional approved object | Trigger, observation window, threshold, action, authority and resumption conditions. |

### FS-PRO-001 / FR-PRO-001 — Protocol templates

Populate protocol sections from an approved task template, then require explicit intended use, setting, population, endpoints, comparator and oversight.

**Exception:** Missing primary endpoint or decision rule blocks freeze; copied text remains draft until reviewed for local relevance.

**Acceptance:** A protocol with an undefined primary endpoint cannot be frozen for formal evaluation.

**Target screen:** S-PRO-02 · R1

### FS-PRO-002 / FR-PRO-002 — Study type

Select study type before gate generation. Changing type recalculates ethics, site, participant and output exposure requirements.

**Exception:** Silent prospective type cannot enable clinician worklist outputs; change to intervention requires a reviewed amendment.

**Acceptance:** Study type determines required gates and allowable exposure of outputs to clinical users.

**Target screen:** S-PRO-02 · R1

### FS-PRO-003 / FR-PRO-003 — Sample justification

Capture the sample rationale, assumptions and qualified statistical approval. Preview subgroup counts against the required precision or adequacy criteria.

**Exception:** Insufficient subgroups remain inconclusive and cannot inherit overall performance as proof of safety.

**Acceptance:** An underpowered subgroup is labelled inconclusive rather than represented as proven safe.

**Target screen:** S-PRO-02 · R1

### FS-PRO-004 / FR-PRO-004 — Prespecified thresholds

Approve thresholds before final results are unblinded. Store comparison operators, units, populations and confidence rules as machine interpretable values.

**Exception:** Changing a threshold after viewing results creates an amendment and exploratory analysis label.

**Acceptance:** Threshold changes after results are viewed create a protocol amendment and disclosed exploratory analysis.

**Target screen:** S-PRO-03 · R1

### FS-PRO-005 / FR-PRO-005 — Analysis plan

Specify denominator, exclusions, failures, repeated measures and missingness before running primary analysis. Register each planned analysis identity.

**Exception:** Unplanned filtering cannot silently alter a primary denominator; deviations require explicit disclosure and review.

**Acceptance:** An evaluator cannot silently remove model failures from the primary denominator.

**Target screen:** S-PRO-02 · R1

### FS-PRO-006 / FR-PRO-006 — Comparator definition

Bind comparator version and standard care workflow to the study, including data and timing differences.

**Exception:** Different populations require a qualified limitation; they cannot be presented as a controlled head to head comparison.

**Acceptance:** A comparison using different populations must disclose the limitation and cannot imply a controlled head to head result.

**Target screen:** S-PRO-02 · R1

### FS-PRO-007 / FR-PRO-007 — Subgroup plan

Define subgroup attributes, lawful collection basis, intersections and adequacy rules. Show not collected separately from not assessed.

**Exception:** Missing protected attributes do not imply no bias; sparse groups follow disclosure and uncertainty rules.

**Acceptance:** A missing protected attribute is shown as unassessed rather than interpreted as absence of bias.

**Target screen:** S-PRO-02 · R1

### FS-PRO-008 / FR-PRO-008 — Freeze and amendment

Freeze a complete reviewed plan, generating immutable identity and signatures. Formal runs reference that version; amendments preserve the original and impact decision.

**Exception:** New material cannot modify a frozen plan in place or conceal departures from prespecification.

**Acceptance:** Final results link to the frozen plan and identify all departures from it.

**Target screen:** S-PRO-03 · R1

### FS-PRO-009 / FR-PRO-009 — Stopping rules

Define stopping triggers and responsible authorities. A qualifying observation opens the specified hold and urgent task with supporting evidence.

**Exception:** Only the relevant independent authority may resume; acknowledgement alone does not clear the trigger.

**Acceptance:** A trigger crossing creates the configured hold and requires the designated independent decision.

**Target screen:** S-PRO-02 · R1

### FS-PRO-010 / FR-PRO-010 — Protocol reuse

Clone an approved template as a new draft and display required local adaptations. Preserve template provenance without copying approvals.

**Exception:** Country permissions and clinical thresholds must be explicitly reviewed for the receiving scope.

**Acceptance:** Reusing a template does not copy another country's ethics approval or clinical thresholds automatically.

**Target screen:** S-PRO-01 · R1

### FS-PRO-011 / FR-PRO-011 — Risk proportional review

Apply the approved risk rubric to intended use, autonomy, harm and maturity. Set review depth and required competence accordingly.

**Exception:** A high risk clinical use cannot select an administrative low risk route to avoid safeguards.

**Acceptance:** A high risk clinical use cannot enter through a low risk administrative template.

**Target screen:** S-PRO-03 · R1

### FS-PRO-012 / FR-PRO-012 — Study registration

Record registry identity, registration time, protocol match and public reference when applicable. Track amendments against the external record.

**Exception:** Unverifiable or mismatched registration remains unverified and cannot support a registered study claim.

**Acceptance:** A claimed registered study includes a verifiable registration reference and matching scope.

**Target screen:** S-PRO-02 · R2

## VAL — Technical and statistical evaluation

Evaluator, statistician and independent scientific reviewer. Accountable role: Evaluation director.

**Current relationship:** Computed synthetic metrics, uncertainty and paired comparisons; no clinical validation.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| metric_definition | Approved immutable reference | Task, formula, input semantics, implementation identity, denominator, units and validated reference fixtures. |
| case_outcome | Required per attempted case | Scored, abstained, rejected, failed or unobserved reference state; protocol defines how each enters analysis. |
| analysis_population | Required manifest | Eligible source, approved exclusions, attempt count, repeated participant grouping and final denominators. |
| uncertainty_method | Required where appropriate | Interval method, confidence level, clustering, resampling unit, seed and limitations. |
| result | Versioned object | Estimate, interval, metric and data versions, denominator, population, threshold result and computation time. |
| subgroup_result | Conditional object | Attribute definition, count, adequacy, disclosure state, estimate and uncertainty. |
| comparison | Conditional object | Baseline, matched scope, absolute difference, relative effect, method and limitation. |
| interpretation | Human decision required for suitability | Criteria met, failed or insufficient, clinical meaning, scope, limitations and qualified signer. |

### FS-VAL-001 / FR-VAL-001 — Task appropriate metrics

Select metrics only from the admitted task pack. Each result binds the formula, implementation version, denominator and validated fixture evidence.

**Exception:** Unsupported metrics remain experimental and cannot become official endpoints through a user entered name.

**Acceptance:** Every reported metric identifies its definition, implementation version and denominator.

**Target screen:** S-VAL-02 · R1

### FS-VAL-002 / FR-VAL-002 — Diagnostic performance

Calculate confusion matrices and diagnostic measures using approved reference labels and failure handling. Display observed or assumed prevalence with predictive values.

**Exception:** Undefined denominators display not estimable; zero divisions cannot become zero performance or a pass.

**Acceptance:** Predictive values state the observed or assumed prevalence and are not transferred without qualification.

**Target screen:** S-VAL-02 · R1

### FS-VAL-003 / FR-VAL-003 — Uncertainty estimates

Apply the protocol's interval and clustering method. Retain participant or site resampling unit and method parameters with results.

**Exception:** Repeated observations cannot be treated as independent without approved justification; failed intervals remain explicit.

**Acceptance:** Repeated observations from one patient are not treated as independent without justification.

**Target screen:** S-VAL-02 · R1

### FS-VAL-004 / FR-VAL-004 — Calibration and utility

For risk scores show calibration measures and decision consequences alongside discrimination when required by protocol.

**Exception:** High AUROC alone cannot satisfy a calibration or clinical utility criterion.

**Acceptance:** A high discrimination score alone cannot satisfy a protocol requiring calibration or clinical utility.

**Target screen:** S-VAL-02 · R1

### FS-VAL-005 / FR-VAL-005 — Missing and rejected inputs

Reconcile every attempted case into mutually exclusive execution categories and separately identify reference availability. Carry the prespecified scoring rule into denominators.

**Exception:** Do not drop abstentions, rejected inputs or model failures to improve reported accuracy.

**Acceptance:** All attempted cases reconcile across scored, abstained, rejected and failed categories.

**Target screen:** S-VAL-02 · R1

### FS-VAL-006 / FR-VAL-006 — External validation

Record development independence and site, time and population shifts using dataset provenance and overlap checks.

**Exception:** Known tuning data cannot be labelled independent external validation; unresolved overlap blocks that claim.

**Acceptance:** A developer's tuning set cannot be labelled an independent external test set.

**Target screen:** S-VAL-02 · R1

### FS-VAL-007 / FR-VAL-007 — Robustness testing

Run the approved robustness scenarios against exact perturbation or condition definitions. Present baseline and changed-condition results with scope.

**Exception:** Untested devices, languages or shifts remain unassessed; simulated robustness is not prospective clinical evidence.

**Acceptance:** Reports distinguish tested conditions from unsupported assumptions about robustness.

**Target screen:** S-VAL-02 · R1

### FS-VAL-008 / FR-VAL-008 — Subgroup results

Calculate prespecified subgroup outputs and adequacy, then apply disclosure rules to display and export.

**Exception:** Suppressed cells stay marked suppressed and cannot be recovered through complementary totals or repeated filters.

**Acceptance:** A suppressed small cell remains marked as suppressed rather than displayed as zero.

**Target screen:** S-VAL-02 · R1

### FS-VAL-009 / FR-VAL-009 — Baseline comparison

Compare to the frozen baseline using identical inclusion rules where required. Show absolute and relative changes with uncertainty and comparator provenance.

**Exception:** Incompatible populations or follow up display limitations and block unsupported comparative claims.

**Acceptance:** A benefit claim identifies both absolute and relative differences where relevant.

**Target screen:** S-VAL-02 · R1

### FS-VAL-010 / FR-VAL-010 — Independent reproduction

Assign an independent reproducer to the retained manifest and approved metric code. Compare results against protocol tolerances and retain evidence.

**Exception:** Out of tolerance results create an investigation and prevent a reproduced status until resolved.

**Acceptance:** A reproduced result outside the declared tolerance triggers an investigation before report issue.

**Target screen:** S-VAL-03 · R1

### FS-VAL-011 / FR-VAL-011 — Custom metric governance

Register a custom metric with formula, intended task, fixtures, limits and qualified validation before activation.

**Exception:** Replacing a primary endpoint requires a protocol amendment; registration alone does not change the study plan.

**Acceptance:** A custom metric cannot replace a primary endpoint without an approved protocol change.

**Target screen:** S-VAL-03 · R2

### FS-VAL-012 / FR-VAL-012 — Evidence interpretation

Keep computed score status separate from clinical interpretation. Eligible reviewers record suitability only for the stated use and population.

**Exception:** Automated threshold checks cannot issue an independent clinical suitability decision.

**Acceptance:** A benchmark score cannot automatically issue a clinical suitability decision.

**Target screen:** S-VAL-03 · R1

## GEN — Generative AI and agent evaluation

Clinical reviewers, AI evaluators, adversarial testers and qualified language reviewers. Accountable role: AI evaluation lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| generative_config | Immutable object required | Base model, prompt, tools, corpus, decoding, guardrails, context limits, provider and version guarantees. |
| scenario | Versioned record required | Task, language, population, synthetic or real origin, expected behaviour, risk and permitted actions. |
| rubric | Approved version required | Factuality, omissions, reassurance, recommendation safety, uncertainty, escalation, severity and reviewer competence. |
| conversation | Ordered immutable messages | Role, content reference, timestamp, context changes and tool calls under approved retention. |
| trial_plan | Required | Scenario set, repeat count, seeds when meaningful, stopping rule and severe failure aggregation. |
| judge_validation | Conditional record | Human sample, agreement method, disagreements, limitations, approved use and drift review. |
| attack_artifact | Restricted object | Authorised test scope, payload reference, observed bypass, impact, containment and remediation. |
| workflow_cost | Measured record | Latency, token or compute use, retries, human correction time and total task completion cost. |

### FS-GEN-001 / FR-GEN-001 — Generative configuration identity

Freeze the complete generative configuration and provider identity before tests. Retain prompts, tools, corpus and decoding parameters under appropriate rights.

**Exception:** Any material change creates a new configuration and cannot inherit unchanged evaluation status.

**Acceptance:** A prompt or retrieval update invalidates claims of an unchanged evaluated configuration.

**Target screen:** S-GEN-02 · R2

### FS-GEN-002 / FR-GEN-002 — Clinical answer assessment

Assign qualified clinicians to rubric based response review. Score omissions, unsafe advice, reassurance, uncertainty and escalation separately from fluency.

**Exception:** Severe safety failures remain individually visible and cannot be averaged away by stylistic quality.

**Acceptance:** A fluent but clinically unsafe answer is treated as a safety failure under the approved rubric.

**Target screen:** S-GEN-02 · R2

### FS-GEN-003 / FR-GEN-003 — Grounding and citations

Link each material claim to retrieved evidence and assess support, authenticity, jurisdiction and date. Review citations in their original context.

**Exception:** A plausible but fabricated reference is an error; inaccessible support remains unverified.

**Acceptance:** A plausible fabricated citation is counted as an error rather than credited for formatting.

**Target screen:** S-GEN-02 · R2

### FS-GEN-004 / FR-GEN-004 — Interaction testing

Execute ordered multi turn scenarios with contradictions, context changes and follow up. Preserve conversation-level outcomes and the failure turn.

**Exception:** Do not report isolated turn success as full task success when later context exposes a failure.

**Acceptance:** Performance reporting identifies failures that appear only across multiple turns.

**Target screen:** S-GEN-02 · R2

### FS-GEN-005 / FR-GEN-005 — Language and population coverage

Build language and population strata with competent reviewers and scenario provenance. Report coverage and unsupported advertised languages.

**Exception:** English results cannot substitute for local language evidence; unavailable qualified review blocks the claim.

**Acceptance:** English performance cannot substitute for evidence in another advertised clinical language.

**Target screen:** S-GEN-02 · R2

### FS-GEN-006 / FR-GEN-006 — Adversarial safety

Run authorised adversarial tests in isolated accounts and data. Record attack identity, successful action, impact and remediation retest.

**Exception:** Attack content cannot escape into production tools or public artefacts; real data exposure opens an incident.

**Acceptance:** Successful bypasses are recorded with impact and remediation evidence without releasing sensitive attack artefacts publicly.

**Target screen:** S-GEN-03 · R2

### FS-GEN-007 / FR-GEN-007 — Agent permissions

Declare agent tool permissions and use simulation endpoints for consequential actions. Capture requested, denied, approved and executed tool actions.

**Exception:** No real prescribing, patient contact or clinical record write without the separately authorised clinical workflow.

**Acceptance:** A test agent cannot issue a real prescription, contact a patient or modify a live record without the separately authorised workflow.

**Target screen:** S-GEN-02 · R2

### FS-GEN-008 / FR-GEN-008 — Judge validation

Compare model judge scores to qualified human review on a documented sample and assess disagreement by severity.

**Exception:** An unvalidated judge cannot be sole safety adjudicator; material judge changes require revalidation.

**Acceptance:** An unvalidated model judge cannot be the sole basis for a final clinical safety decision.

**Target screen:** S-GEN-03 · R2

### FS-GEN-009 / FR-GEN-009 — Stochastic variation

Run the prespecified repetitions and include all attempts, failures and variability. Record seeds only where meaningful and explain provider nondeterminism.

**Exception:** Selecting a favourable run cannot replace the full planned denominator; rare severe failures remain visible.

**Acceptance:** Reporting one favourable run while excluding unsuccessful repetitions is prevented or explicitly disclosed.

**Target screen:** S-GEN-02 · R2

### FS-GEN-010 / FR-GEN-010 — Privacy and memorisation

Test cross session disclosure and memorisation with approved controlled fixtures. Restrict raw sensitive findings and record risk assessment.

**Exception:** Disclosure of another participant's data initiates containment and incident handling immediately.

**Acceptance:** A model that exposes another participant's information triggers the incident and hold workflow.

**Target screen:** S-GEN-03 · R2

### FS-GEN-011 / FR-GEN-011 — Cost and latency tradeoffs

Measure complete task cost, latency and human correction burden for the tested configuration. Include retries and failed attempts under declared accounting.

**Exception:** Per token price alone cannot be labelled workflow cost or labour saving.

**Acceptance:** A low per token price cannot be reported as total workflow cost.

**Target screen:** S-GEN-02 · R2

### FS-GEN-012 / FR-GEN-012 — Synthetic evaluation limits

Label synthetic cases and simulated patients at scenario and report level. Require qualified review of realism and limitations.

**Exception:** Passing synthetic tests cannot satisfy a protocol that requires real prospective outcome evidence.

**Acceptance:** Passing synthetic scenarios cannot automatically satisfy a requirement for prospective clinical evidence.

**Target screen:** S-GEN-02 · R2

## MOD — Modality and use case support

Modality lead, clinical expert, data engineer and evaluation pack owner. Accountable role: Clinical product lead.

**Current relationship:** Synthetic tabular/audio subset only; no general multimodal platform.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| pack_identity | Immutable required | Task, modality, study types, version, owner and admitted intended uses. |
| input_contract | Required | Fields or objects, relationship keys, units, timestamps, accepted formats and quality constraints. |
| viewer_profile | Conditional | Required display, device, controls, accessibility alternative and declared clinical interpretation limitations. |
| feature_dictionary | Structured tasks | Feature name, meaning, unit, observation time, missingness and leakage risk. |
| imaging_profile | Imaging tasks | Study and series links, supported objects, device metadata, orientation and annotation coordinates. |
| language_audio_profile | Conditional | Language, dialect, sampling, speaker and recording metadata with clinical error taxonomy. |
| signal_profile | Conditional | Sampling frequency, clock alignment, units, missing intervals, device and firmware. |
| conformance_pack | Required for activation | Representative fixtures, expected results, responsible experts, controls and signed admission. |

### FS-MOD-001 / FR-MOD-001 — Tabular prediction

Validate structured features against meaning, unit, availability time and missingness. Flag post outcome information before model execution.

**Exception:** Unresolved temporal leakage blocks predictive evaluation acceptance.

**Acceptance:** Post outcome variables are identified before a prediction evaluation is accepted.

**Target screen:** S-MOD-02 · R1

### FS-MOD-002 / FR-MOD-002 — Imaging evaluation

Preserve examination, study and series relationships and required device metadata. Validate annotation coordinates and image quality in the approved viewer.

**Exception:** Wrong series or orientation mapping blocks scoring; deidentification must preserve necessary clinical meaning.

**Acceptance:** Results retain linkage to the correct examination and evaluated image series.

**Target screen:** S-MOD-02 · R1

### FS-MOD-003 / FR-MOD-003 — Clinical text

Retain document chronology, source context, language and redaction status for text evaluation. Link material omissions back to permitted source passages.

**Exception:** An isolated excerpt cannot represent a complete record unless the task explicitly defines that scope.

**Acceptance:** A summary evaluation can identify clinically material omissions from the authorised source record.

**Target screen:** S-MOD-02 · R2

### FS-MOD-004 / FR-MOD-004 — Speech and audio

Capture recording conditions and assess clinical transcription and comprehension errors separately from ordinary word errors.

**Exception:** Negation, dosage and medical term errors retain their clinical severity instead of being hidden in aggregate word error rate.

**Acceptance:** Medical term errors and consequential negation errors remain distinguishable from ordinary word errors.

**Target screen:** S-MOD-02 · R2

### FS-MOD-005 / FR-MOD-005 — Signals and devices

Validate sampling frequency, device version, clock alignment and missing intervals before comparing signals to outcomes.

**Exception:** Misalignment or unapproved resampling blocks dependent evaluation; transformation provenance is retained.

**Acceptance:** Misaligned sensor timestamps cannot be silently compared to clinical event labels.

**Target screen:** S-MOD-02 · R3

### FS-MOD-006 / FR-MOD-006 — Multimodal systems

Test required, optional and missing modalities plus contradictory inputs according to the declared fallback contract.

**Exception:** An advertised fallback cannot be accepted without testing the absent modality scenario.

**Acceptance:** A solution's advertised fallback behaviour is tested when one required modality is absent.

**Target screen:** S-MOD-02 · R2

### FS-MOD-007 / FR-MOD-007 — Administrative and public health AI

Select operational and equity endpoints for administrative or public health tasks and document potential clinical spillovers.

**Exception:** Hospital location alone does not make diagnostic metrics appropriate for scheduling or allocation tools.

**Acceptance:** A scheduling model is not assigned diagnostic metrics solely because it operates in a hospital.

**Target screen:** S-MOD-02 · R2

### FS-MOD-008 / FR-MOD-008 — Capability admission

Activate a task pack only after fixtures, method validation, qualified owners and required controls pass within declared scope.

**Exception:** Unsupported tasks stay in discovery and cannot issue formal validated findings.

**Acceptance:** Unsupported tasks remain in discovery status and cannot receive a formal validated result.

**Target screen:** S-MOD-03 · R1

## HUM — Human factors workflow and equity

Human factors evaluator, representative users, clinical owner and economic analyst. Accountable role: Clinical implementation lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| workflow_step | Required ordered records | Actor, input, task, decision authority, handoff, standard care comparator and fallback. |
| observation_plan | Conditional approved object | Participant roles, task scenarios, sample rationale, success criteria, errors and workload method. |
| interaction_event | Conditional record | Recommendation, human response, override reason, verification effort and outcome where known. |
| barrier | Object | Disability, literacy, language, connectivity or shared device issue, affected group, severity and mitigation. |
| competence | Versioned record | User, role, course or procedure version, assessment, assessor, result and expiry. |
| outcome | Study defined record | Referral, follow up, delay or other endpoint with source, denominator and observation period. |
| feedback | Confidential record | Channel, safe attribution, concern, response owner, dispute status and corrective action. |
| economic_model | Approved assumptions | Perspective, currency, price year, time horizon, staff and equipment costs, uncertainty and method. |

### FS-HUM-001 / FR-HUM-001 — Workflow definition

Map intended work steps, handoffs and decision authority with the standard care comparator and fallback. Bind the model output to a specific step.

**Exception:** A model score cannot be interpreted as workflow benefit without its intended use context.

**Acceptance:** A model result cannot be interpreted without its intended position in the clinical workflow.

**Target screen:** S-HUM-02 · R1

### FS-HUM-002 / FR-HUM-002 — Usability studies

Run approved task scenarios with representative roles, recording completion, observed errors, training needs and workload.

**Exception:** Reports include failures and sample limits; satisfaction alone cannot establish usable clinical performance.

**Acceptance:** A usability report identifies participant roles and includes observed failures as well as satisfaction.

**Target screen:** S-HUM-02 · R2

### FS-HUM-003 / FR-HUM-003 — Human AI interaction

Capture reliance, overrides, verification time and alert exposure using the approved observation method.

**Exception:** Apparent time savings exclude no required review work; omitted verification is recorded as a safety or protocol issue.

**Acceptance:** An apparent time saving is qualified when required verification work is omitted.

**Target screen:** S-HUM-02 · R2

### FS-HUM-004 / FR-HUM-004 — Accessibility and inclusion

Assess barriers across disability, literacy, language, connectivity and device sharing. Assign mitigations and verify them in the intended context.

**Exception:** Unresolved material exclusion risk remains a deployment blocker or explicit scope restriction.

**Acceptance:** A deployment plan includes mitigations for material exclusion risks identified during evaluation.

**Target screen:** S-HUM-02 · R2

### FS-HUM-005 / FR-HUM-005 — Clinical workflow outcomes

Track downstream referrals, follow up and delays with correct eligible denominators and outcome windows.

**Exception:** Detection alone cannot satisfy an endpoint that requires completed referral or treatment.

**Acceptance:** A high detection rate alone cannot establish benefit when the protocol requires completed referral.

**Target screen:** S-HUM-02 · R2

### FS-HUM-006 / FR-HUM-006 — Training effectiveness

Record training, assessment, competence and renewal against the user role and procedure version.

**Exception:** Expired or failed required competence removes access to the affected clinical function until renewed.

**Acceptance:** An untrained user cannot be enabled for a function requiring verified competence.

**Target screen:** S-HUM-03 · R2

### FS-HUM-007 / FR-HUM-007 — Equity interpretation

Interpret equity across access, errors and downstream burden, with qualified consideration of missing groups and costs.

**Exception:** Aggregate model performance cannot erase an identified exclusion or disproportionate burden.

**Acceptance:** The report identifies who may lose access or bear additional costs under the proposed workflow.

**Target screen:** S-HUM-03 · R1

### FS-HUM-008 / FR-HUM-008 — Patient and staff feedback

Accept staff and patient feedback through approved confidential routes and link concerns to issue ownership.

**Exception:** Disputed negative feedback remains available to independent reviewers; implicated parties cannot delete it.

**Acceptance:** Negative feedback remains visible to reviewers even when a site or developer disputes it.

**Target screen:** S-HUM-02 · R2

### FS-HUM-009 / FR-HUM-009 — Economic measurement

Capture staff, integration, equipment, training, recurring and downstream costs under explicit perspective and price year.

**Exception:** Missing assumptions or incompatible currencies block a definitive cost effectiveness claim; uncertainty remains visible.

**Acceptance:** A cost effectiveness calculation states perspective, currency, price year, assumptions and uncertainty.

**Target screen:** S-HUM-02 · R2

## STU — Prospective studies and site conduct

Site investigator, authorised study staff, monitor and local clinical owner. Accountable role: Clinical operations lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| site_activation | Required before activity | Site, protocol, permissions, contracts, staff competence, systems, emergency plan and accepted readiness. |
| eligibility | Versioned rule responses required | Criterion, source evidence, inclusion or exclusion outcome, assessor and time. |
| participant_key | Site controlled required | Study pseudonym and authorised local linkage; central exports exclude direct identifiers by default. |
| case_form | Versioned schema and response | Field types, ranges from approved dictionary, visits, source, queries and corrections. |
| allocation | Conditional restricted record | Validated service reference, stratum, sequence or allocation result, concealment and authorised unblinding. |
| mode | Required enum | Silent prospective or care affecting; output exposure policy is bound to the approved protocol. |
| deviation | Record required on detection | Affected participant or process, rule, time, impact, owner, safety escalation and resolution. |
| closeout | Required reconciliation | Participants, follow up, queries, safety, assets, finance, retention and successor obligations. |

### FS-STU-001 / FR-STU-001 — Site activation

Activate each site only after verified permissions, terms, competent staff, integration and emergency readiness for exact protocol and configuration.

**Exception:** Inactive sites cannot enrol or expose care affecting outputs; another site's approval cannot substitute.

**Acceptance:** No recruitment or care affecting evaluation can begin at an inactive site.

**Target screen:** S-STU-03 · R2

### FS-STU-002 / FR-STU-002 — Eligibility and enrolment

Apply approved eligibility rules, record source evidence and check authorised duplicate enrolment constraints before enrolment.

**Exception:** An ineligible enrolment is retained as a deviation; it cannot be silently edited out of history.

**Acceptance:** An ineligible enrolment creates a deviation and cannot be silently corrected out of the record.

**Target screen:** S-STU-02 · R2

### FS-STU-003 / FR-STU-003 — Participant identifiers

Assign site controlled study keys and restrict linkage to authorised local roles. Central users see only approved participant fields.

**Exception:** Cross site matching requires explicit authority and cannot expose identities through duplicate warnings.

**Acceptance:** Central evaluators receive only the participant information authorised by their study role.

**Target screen:** S-STU-02 · R2

### FS-STU-004 / FR-STU-004 — Case report forms

Use approved form versions with semantic validation and queries. Corrections retain original value, reason, actor and time.

**Exception:** Source discrepancies remain queries until resolved; version upgrades cannot reinterpret historic answers silently.

**Acceptance:** A corrected clinical observation retains its original value, reason, actor and timestamp.

**Target screen:** S-STU-02 · R2

### FS-STU-005 / FR-STU-005 — Allocation and blinding

Use the validated allocation procedure and restrict concealed assignments. Unblinding requires an eligible actor, reason and impact record.

**Exception:** Emergency local care follows its approved route; unblinding is never an ordinary unrestricted reveal button.

**Acceptance:** Only authorised staff can unblind, with reason and downstream impact recorded.

**Target screen:** S-STU-03 · R2

### FS-STU-006 / FR-STU-006 — Silent prospective mode

Route silent predictions only to authorised evaluation storage and blinded review workflows; exclude them from clinical production worklists.

**Exception:** Accidental exposure creates a deviation and safety assessment, with containment of the leaking channel.

**Acceptance:** A silent mode prediction cannot appear in a clinician's production worklist.

**Target screen:** S-STU-02 · R2

### FS-STU-007 / FR-STU-007 — Interventional controls

Permit care affecting outputs only for authorised users, approved version and operating limits with active oversight.

**Exception:** Changed configuration or expired permission blocks further use under the affected protocol and activates fallback.

**Acceptance:** A changed clinical configuration requires the defined amendment process before use.

**Target screen:** S-STU-02 · R2

### FS-STU-008 / FR-STU-008 — Deviations and queries

Open deviations and data queries with severity, owner and due date; preserve correction history and scientific impact.

**Exception:** Safety relevant deviations escalate immediately and do not wait in ordinary data cleaning queues.

**Acceptance:** A deviation affecting participant safety triggers escalation independently of ordinary data cleaning.

**Target screen:** S-STU-02 · R2

### FS-STU-009 / FR-STU-009 — Monitoring and verification

Give monitors bounded access to consent, eligibility and source evidence. Record findings, corrective actions and independent verification.

**Exception:** Monitoring access does not permit changing original clinical observations or closing its own unresolved findings without authority.

**Acceptance:** Monitoring findings have accountable corrective actions and verifiable closure evidence.

**Target screen:** S-STU-03 · R2

### FS-STU-010 / FR-STU-010 — Safety reporting

Accept adverse events, near misses and serious concerns with minimal initial information and local escalation.

**Exception:** Causality need not be proven before reporting; incomplete fields cannot block an urgent safety case.

**Acceptance:** A report initiates safety review without waiting for causality to be proven.

**Target screen:** S-STU-02 · R2

### FS-STU-011 / FR-STU-011 — Study closeout

Reconcile participants, queries, safety, assets and duties before closeout. Assign any lawful continuing obligation to an accepting owner.

**Exception:** Unassigned required follow up blocks fully closed status even after recruitment ends.

**Acceptance:** A study cannot be marked fully closed while mandatory follow up obligations remain unassigned.

**Target screen:** S-STU-03 · R2

### FS-STU-012 / FR-STU-012 — External study systems

Import from approved EDC or trial systems with source identifiers, versions and reconciliation. Mark external authoritative fields read only locally.

**Exception:** Conflicting masters create a reconciliation case; imported data cannot silently replace the authoritative source.

**Acceptance:** An imported record retains source identity and does not create an inconsistent competing master record.

**Target screen:** S-STU-02 · R2

## SAF — Clinical safety incidents and corrective action

Reporter, clinical safety lead, security owner, investigator and local site authority. Accountable role: Clinical safety lead.

**Current relationship:** Synthetic concerns and holds; independent operational safety authority incomplete.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| hazard | Versioned record required per admitted use | Hazard, foreseeable misuse, severity, likelihood rationale, mitigation, residual risk and accepting owner. |
| incident | Minimal intake required | Concern, time if known, affected scope if known, reporter safe contact and urgency; unknown values permitted. |
| triage | Qualified record | Potential impact, population, urgency, severity, owner, time and rationale; distinguish clinical severity from operational P1. |
| hold | Scoped controlling record | Objects or activities, reason, authority, effective time, prior phase and clearance requirements. |
| investigation | Restricted record | Evidence references, chain of custody, hypotheses, decisions and implicated parties. |
| corrective_action | Required action object | Root cause, action, owner, due date, verification method, evidence and independent closure. |
| reportability | Country specific assessment | Required recipient, legal or clinical basis, deadline, preparer, release authority and submission proof. |
| site_instruction | Conditional record | Instruction, target version, site, urgent contact, request, acknowledgement, execution and escalation. |

### FS-SAF-001 / FR-SAF-001 — Safety case

Maintain hazards and residual risks linked to each admitted intended use and mitigation evidence. Require the accountable qualified acceptance before activity.

**Exception:** Unaccepted material risk blocks affected activation; lower estimated likelihood cannot hide severe unresolved consequences.

**Acceptance:** No clinical use proceeds with an unaccepted material residual risk.

**Target screen:** S-SAF-02 · R1

### FS-SAF-002 / FR-SAF-002 — Incident intake

Accept concerns from approved staff and external channels without developer permission. Preserve confidential reporter details and minimal initial facts.

**Exception:** Anonymous or incomplete reports enter triage where supported; attachments remain quarantined without delaying intake.

**Acceptance:** A reporter can raise a concern without needing permission from the implicated developer.

**Target screen:** S-SAF-01 · R1

### FS-SAF-003 / FR-SAF-003 — Severity and triage

Assign qualified triage, record uncertainty and choose urgency based on potential harm. Route potentially serious reports immediately.

**Exception:** Missing causality or participant details cannot postpone urgent review; reclassification retains original assessment.

**Acceptance:** An incomplete but potentially serious report enters urgent review rather than being rejected by form validation.

**Target screen:** S-SAF-02 · R1

### FS-SAF-004 / FR-SAF-004 — Containment

Apply targeted holds to versions, datasets, runs or sites and notify responsible local owners. Preserve evidence and permitted remediation.

**Exception:** Containment does not delete historical findings or imply that remote sites already stopped.

**Acceptance:** A targeted suspension prevents affected new activity without concealing historical evidence.

**Target screen:** S-SAF-02 · R1

### FS-SAF-005 / FR-SAF-005 — Deployment stop coordination

Issue authorised stop or rollback instructions through approved site channels. Track receipt and observed execution per site.

**Exception:** Unacknowledged sites remain visibly unresolved and escalate to local contacts and backups.

**Acceptance:** An unacknowledged instruction remains visibly unresolved and escalates to local contacts.

**Target screen:** S-SAF-02 · R2

### FS-SAF-006 / FR-SAF-006 — Investigation

Preserve evidence with source, digest, collection authority and custody history. Restrict implicated parties' access and editing.

**Exception:** An implicated party cannot alter retained evidence or close an independent investigation.

**Acceptance:** An implicated party cannot alter retained evidence or close its own independent investigation.

**Target screen:** S-SAF-02 · R1

### FS-SAF-007 / FR-SAF-007 — Corrective and preventive action

Assign root cause actions with due dates and verification criteria. Closure requires evidence accepted by an eligible verifier.

**Exception:** A completion checkbox or developer statement alone cannot close required independent remediation.

**Acceptance:** Closing an action requires verification evidence rather than a completion checkbox alone.

**Target screen:** S-SAF-02 · R1

### FS-SAF-008 / FR-SAF-008 — Reportability assessment

Assess reporting duties by country and record recipient, deadline and authorised release. Retain transmission and acknowledgement evidence.

**Exception:** An internal alert is not statutory submission; failed external delivery remains an open escalation.

**Acceptance:** The platform records proof of submission or an explicit failure; an internal alert is not treated as statutory reporting.

**Target screen:** S-SAF-03 · R1

### FS-SAF-009 / FR-SAF-009 — Cross study impact

Traverse affected dependencies to identify other versions, studies and deployments, then assign scoped impact reviews.

**Exception:** Absence of known deployments is qualified by register completeness; do not claim all sites are safe from incomplete inventory.

**Acceptance:** A recalled model component produces an actionable list of impacted evaluations and deployments.

**Target screen:** S-SAF-02 · R1

### FS-SAF-010 / FR-SAF-010 — Resumption decision

Require appropriate independent clinical, security or governance approval for remediation and resumption. Recheck other holds and prerequisites.

**Exception:** Payment, commercial urgency or reporter withdrawal cannot clear an unresolved safety hold.

**Acceptance:** Commercial pressure or payment status cannot override an active safety hold.

**Target screen:** S-SAF-03 · R1

### FS-SAF-011 / FR-SAF-011 — External warning exchange

Prepare a bounded safety summary with uncertainty, causality status and approved audience. Release only after legal, confidentiality and accuracy review.

**Exception:** Patient details and restricted attack artefacts remain excluded; draft preparation never sends externally.

**Acceptance:** A shared warning excludes unauthorised patient data and clearly states unresolved causality.

**Target screen:** S-SAF-03 · R2

### FS-SAF-012 / FR-SAF-012 — Learning and trend review

Review near misses, recurrence and overdue actions using declared cadence and definitions. Open systemic risk reviews for patterns.

**Exception:** Repeated low severity events cannot be hidden by closing individual cases without trend assessment.

**Acceptance:** Repeated low severity incidents can trigger a systemic risk review.

**Target screen:** S-SAF-01 · R1

## EVD — Evidence reports and reusable dossiers

Evidence author, independent scientific signers, rights owner and publication owner. Accountable role: Evaluation director.

**Current relationship:** Immutable reports, correction and application signatures; no institutional certification.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| dossier_manifest | Immutable on issue | Intended use, configuration, protocol, datasets, analyses, permissions, reviews and template version. |
| claim | Required per material finding | Statement, population, setting, time, result reference, limitations and supported configuration. |
| evidence_status | Controlled value | Not assessed, in progress, insufficient, meets specified criteria, fails specified criteria, superseded or withdrawn. |
| review | Signed record required | Reviewer identity, competence, conflicts, evidence snapshot, conclusion, conditions and authentication. |
| report_view | Versioned object | Public, partner or restricted audience, selected claims, redactions, disclosure results and rights approval. |
| release_record | Immutable required | Persistent report identifier, issue time, signer, digest, scope, status and approved audience. |
| correction | Linked successor conditional | Original, corrected scope, reason, impact, approvals and recipient notification outcome. |
| endpoint_reconciliation | Required | Planned endpoint, result or justified absence, deviation, approved explanation and reviewer decision. |

### FS-EVD-001 / FR-EVD-001 — Evidence dossier

Assemble dossiers from exact approved source versions. The builder flags missing required links and exposes each finding's provenance to authorised reviewers.

**Exception:** Manual attachments cannot substitute for missing result identities without an explicit verified external evidence record.

**Acceptance:** A reviewer can trace each headline finding to the underlying approved evidence.

**Target screen:** S-EVD-02 · R1

### FS-EVD-002 / FR-EVD-002 — Claim level provenance

Link every claim to exact study, population, version, date and limitations; display claim-level support in the report.

**Exception:** A product's successor cannot inherit a prior claim unless a qualified applicability decision explicitly supports it.

**Acceptance:** A new product version does not inherit an unsupported claim from an earlier version.

**Target screen:** S-EVD-02 · R1

### FS-EVD-003 / FR-EVD-003 — Evidence status

Derive evidence status from signed decisions and current validity, separately from workflow progress and regulatory status.

**Exception:** Insufficient evidence remains inconclusive and cannot be averaged or renamed into a positive badge.

**Acceptance:** Insufficient evidence cannot be displayed as a positive outcome or averaged into a pass.

**Target screen:** S-EVD-01 · R1

### FS-EVD-004 / FR-EVD-004 — Independent review

Assign eligible independent scientific and clinical reviewers, retain developer responses and obtain required signatures on the frozen dossier.

**Exception:** Conflicted sole approval or missing competent reviewer blocks issue; payer edits cannot replace the conclusion.

**Acceptance:** A developer response is retained but cannot replace the independent conclusion.

**Target screen:** S-EVD-03 · R1

### FS-EVD-005 / FR-EVD-005 — Report generation

Generate a draft from approved templates and exact result references, including units, denominators and intervals. Record generator and template versions.

**Exception:** Regeneration cannot silently change findings; any changed source creates a new draft and review cycle.

**Acceptance:** Regenerated reports preserve the same approved findings and identify the generator version.

**Target screen:** S-EVD-02 · R1

### FS-EVD-006 / FR-EVD-006 — Scope and limitations

Require tested use, population, setting, configuration, exclusions and limitations in the visible report summary.

**Exception:** Material failed subgroups or incomplete endpoints cannot be hidden in an optional attachment.

**Acceptance:** A report cannot omit a material failed subgroup that was included in the approved analysis plan.

**Target screen:** S-EVD-02 · R1

### FS-EVD-007 / FR-EVD-007 — Publication permissions

Preview each audience view and apply rights, redaction and disclosure checks before publication approval.

**Exception:** Restricted originals remain protected even when a public summary exists; content changes invalidate previous clearance.

**Acceptance:** A public report does not reveal protected small cells, patient details or proprietary artefacts.

**Target screen:** S-EVD-03 · R1

### FS-EVD-008 / FR-EVD-008 — Signed release and integrity

Issue the signed frozen report with persistent identifier, digest and current-status verification route. Store the issued bytes and manifest.

**Exception:** An altered copy fails integrity verification; no regenerated file can retain the original integrity identity if bytes change.

**Acceptance:** Altering a released report creates a new version and invalidates the altered copy's integrity check.

**Target screen:** S-EVD-03 · R1

### FS-EVD-009 / FR-EVD-009 — Corrections and retractions

Create corrections, supersession or withdrawal as linked records with reason and approvals. Notify known recipients and show current status when old links open.

**Exception:** Historical copies remain identifiable; the system cannot promise recall of every downloaded external file.

**Acceptance:** Opening a superseded report displays its current status and link to the authoritative successor.

**Target screen:** S-EVD-03 · R1

### FS-EVD-010 / FR-EVD-010 — Evidence portability

Export a structured dossier with human readable reports, manifests, restrictions and local gaps. Validate the package before authorised delivery.

**Exception:** Missing reuse rights exclude affected assets and produce an explicit restriction entry.

**Acceptance:** A receiving institution can identify what may be reused and what needs local validation.

**Target screen:** S-EVD-02 · R2

### FS-EVD-011 / FR-EVD-011 — Results completeness

Reconcile all planned endpoints, analyses and deviations against the report before signature.

**Exception:** Unreported endpoints block issue unless an eligible reviewer approves an explicit, prominent explanation.

**Acceptance:** Unreported endpoints block issue or require an explicit approved explanation.

**Target screen:** S-EVD-03 · R1

### FS-EVD-012 / FR-EVD-012 — Public evidence catalogue

Publish only approved metadata and report views with exact scope and freshness. Support filters for use, population and evidence maturity.

**Exception:** Catalogue presence cannot imply regulatory authorisation, procurement preference or universal endorsement.

**Acceptance:** Catalogue presence is not presented as an endorsement or universal approval.

**Target screen:** S-EVD-01 · R2

## REG — Regulatory and ethics submission support

Country reviewer, submission preparer and authorised institutional representative. Accountable role: Regulatory lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| checklist | Approved version required | Country, authority, submission class, source, interpretation owner, evidence items and effective dates. |
| package | Immutable at release | Target authority, purpose, forms, dossier versions, attachments, manifest and local gaps. |
| external_decision | Typed verified record | Issuer, reference, scope, configuration, sites, dates, conditions and verification evidence. |
| question | External source record | Question reference, exact text, received time, deadline, responsible owner and response version. |
| change_assessment | Conditional decision | Material change, affected permission, notification or renewed evidence requirement and qualified owner. |
| submission_channel | Approved configuration | Recipient identity, supported transmission method, credentials, authorisation and receipt semantics. |
| renewal | Deadline record | Permission, expiry, filing deadline, owner, submitted evidence and verified extension. |
| transmission | System event | Authorised package, sender, recipient, request time, send outcome, receipt and retry history. |

### FS-REG-001 / FR-REG-001 — Requirements checklist

Instantiate a source linked checklist and locate the exact evidence for each applicable item. Assign owners to gaps.

**Exception:** A checked box without evidence or an authorised not applicable rationale cannot satisfy readiness.

**Acceptance:** Each required item identifies its evidence location or a documented gap.

**Target screen:** S-REG-02 · R1

### FS-REG-002 / FR-REG-002 — Submission packages

Assemble separate packages for each jurisdiction from approved dossier versions and local forms. Freeze a manifest for review.

**Exception:** Local package differences do not modify the underlying scientific findings or their original scope.

**Acceptance:** A package can contain different evidence and forms for two jurisdictions without changing the underlying findings.

**Target screen:** S-REG-02 · R2

### FS-REG-003 / FR-REG-003 — External decision verification

Verify claimed external decisions against issuer evidence and exact use, configuration and validity.

**Exception:** Developer assertions remain unverified until qualified review; unmatched scope does not count as permission.

**Acceptance:** A developer assertion remains unverified until the designated verification process completes.

**Target screen:** S-REG-03 · R1

### FS-REG-004 / FR-REG-004 — Authority questions

Record authority questions with deadlines and bind each response to the exact question and file versions.

**Exception:** Superseded responses remain in history; preparing a response does not mark it sent.

**Acceptance:** A response can be linked to the exact question and submitted file version.

**Target screen:** S-REG-02 · R2

### FS-REG-005 / FR-REG-005 — Decision separation

Display internal eligibility, checklist completeness and external decision as separate fields and records.

**Exception:** An internal completion event cannot set legally authorised status.

**Acceptance:** Completing an internal checklist cannot mark a product legally authorised.

**Target screen:** S-REG-01 · R1

### FS-REG-006 / FR-REG-006 — Change submissions

Assess material changes against the active country profile and permission conditions; create notification, evidence or renewal tasks.

**Exception:** Changed intended use remains blocked for affected clinical activity until required external action is resolved.

**Acceptance:** A changed intended use triggers a regulatory impact task before clinical continuation.

**Target screen:** S-REG-03 · R2

### FS-REG-007 / FR-REG-007 — Permission expiry

Track expiry, conditions and withdrawal notices; update only governed activities and create an impact queue.

**Exception:** Pending renewal does not extend permission; valid historical decisions retain their original dates.

**Acceptance:** A withdrawn permission blocks affected new activity and initiates impact review.

**Target screen:** S-REG-01 · R1

### FS-REG-008 / FR-REG-008 — Submission channel control

Require human release of the previewed immutable package and verified recipient through a supported channel. Track transmitted and acknowledged separately.

**Exception:** Unsupported channel yields a prepared package for authorised manual submission, with proof subsequently recorded.

**Acceptance:** Preparing a package never automatically transmits it to an authority.

**Target screen:** S-REG-03 · R2

## TRN — Cross country evidence reuse and adaptation

Receiving institution, country owner, scientific reviewer and implementation owner. Accountable role: Country lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| origin | Immutable references required | Product configuration and dossier version with permitted reuse rights. |
| receiving_use | Required object | Country, institution, population, sites, workflow, intended decision and buyer. |
| gap | Structured assessment required | Population, prevalence, language, device, guideline, workflow, rights or regulation; reusable, uncertain or inapplicable with reason. |
| local_plan | Approved object required | Additional data, validation, thresholds, owners, resources and decision gates. |
| adaptation | Immutable configuration | Language, rules, thresholds, integration and training changes linked to origin and local evidence. |
| reliance | Independent decision | Issuing authority or buyer, accepted components, conditions, scope and expiry. |
| shared_protocol | Common core plus local appendices | Country-specific permissions, analysis, sites and nonpooled findings preserved. |
| reuse_measure | Estimate record | Avoided tasks, counterfactual, adaptation cost, time period, method and uncertainty. |

### FS-TRN-001 / FR-TRN-001 — Transfer request

Create a request against exact origin versions and receiving intended use. Check reuse rights before exposing dossier content.

**Exception:** A newer product version is not substituted automatically; inaccessible origin material remains excluded.

**Acceptance:** The request references a specific product and dossier version.

**Target screen:** S-TRN-02 · R2

### FS-TRN-002 / FR-TRN-002 — Gap assessment

Review each contextual difference and classify evidence as reusable, uncertain or inapplicable with qualified rationale.

**Exception:** Missing local information remains a gap, not an assumed match to the origin population.

**Acceptance:** The assessment identifies evidence that is reusable, uncertain or inapplicable with reasons.

**Target screen:** S-TRN-02 · R2

### FS-TRN-003 / FR-TRN-003 — Local validation plan

Approve additional validation needed to resolve material gaps, with local thresholds and owners.

**Exception:** A foreign positive result cannot bypass unresolved local safety, rights or applicability requirements.

**Acceptance:** A foreign positive report cannot bypass an unresolved local safety or applicability requirement.

**Target screen:** S-TRN-03 · R2

### FS-TRN-004 / FR-TRN-004 — Adaptation tracking

Create a local configuration for changes to language, rules, thresholds, integration or training and link new evidence.

**Exception:** Do not relabel the original configuration as locally evaluated when material modifications exist.

**Acceptance:** Local modifications remain distinguishable from the original evaluated product.

**Target screen:** S-TRN-02 · R2

### FS-TRN-005 / FR-TRN-005 — Evidence reliance decisions

Record the receiving authority's or buyer's own reliance decision with accepted scope and conditions.

**Exception:** The platform cannot issue mutual recognition or a global approval through an evidence passport field.

**Acceptance:** No automated evidence passport grants mutual recognition between countries.

**Target screen:** S-TRN-03 · R2

### FS-TRN-006 / FR-TRN-006 — Shared studies

Manage a shared protocol core and separately approved local appendices. Preserve country results and pooling rationale.

**Exception:** A favourable pooled result cannot conceal a material local failure or absent local permission.

**Acceptance:** A pooled result preserves country level findings and cannot conceal a material local failure.

**Target screen:** S-TRN-02 · R2

### FS-TRN-007 / FR-TRN-007 — Reuse measurement

Record reused tasks and avoided work against an explicit counterfactual; distinguish estimated savings from observed elapsed time.

**Exception:** Shared tasks are counted once and adaptation costs are included in the net saving.

**Acceptance:** Estimated savings remain labelled estimates and do not double count shared work.

**Target screen:** S-TRN-02 · R2

### FS-TRN-008 / FR-TRN-008 — Country withdrawal

End new sharing at the effective withdrawal date and reconcile retained rights, incidents and obligations.

**Exception:** Withdrawal cannot erase lawful historical evidence or unassigned local safety responsibilities.

**Acceptance:** Withdrawal blocks new sharing without erasing lawful historical evidence or incident responsibilities.

**Target screen:** S-TRN-03 · R2

## DEP — Implementation procurement and adoption

Buyer, implementation lead, local clinical owner and site administrator. Accountable role: Implementation lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| readiness | Required assessment | Evidence, permissions, funding, infrastructure, staffing, integration, support and maintenance with blockers. |
| business_case | Versioned object | Baseline, expected benefits, cost model, budget impact, uncertainty, horizon and purchasing route. |
| procurement_criteria | Approved neutral rubric | Requirements, evidence, scoring, conflict declarations and authorised institutional process. |
| deployment_scope | Immutable at go live | Buyer, site, intended use, configuration, permissions, owner, dates and environment. |
| implementation_plan | Required tasks | Milestones, dependencies, integration, change management, training, budget and accepted owners. |
| acceptance_plan | Required per site | Operational tests, results, authorised acceptance, downtime, rollback and standard care fallback. |
| funding_transition | Required for sustained use | Pilot end, recurring owner, approved budget, support terms and continuation or closure decision. |
| handover | Required on exit | Successor, records, monitoring, clinical duties, support, data portability and accepted effective date. |

### FS-DEP-001 / FR-DEP-001 — Adoption readiness

Score readiness dimensions independently and display blockers alongside the scientific decision.

**Exception:** A favourable evaluation can remain operationally unready; no single success badge combines the two.

**Acceptance:** A scientifically successful evaluation can remain operationally unready with explicit blockers.

**Target screen:** S-DEP-02 · R1

### FS-DEP-002 / FR-DEP-002 — Business case

Build the buyer case from full implementation and recurring costs, expected benefit, uncertainty and budget impact.

**Exception:** Licence price alone is insufficient; unobserved benefits are labelled estimates with assumptions.

**Acceptance:** The case includes integration and recurring operating costs as well as licence fees.

**Target screen:** S-DEP-02 · R2

### FS-DEP-003 / FR-DEP-003 — Procurement support

Assemble neutral procurement requirements and evidence with declared criteria and conflicts.

**Exception:** Paid participation cannot change rankings or requirements without an authorised transparent revision.

**Acceptance:** Paid participation cannot silently change procurement ranking or evaluation criteria.

**Target screen:** S-DEP-02 · R2

### FS-DEP-004 / FR-DEP-004 — Deployment authorisation

Authorise a specific buyer, site, use and configuration after G5 and local permissions pass.

**Exception:** Sandbox evaluation completion cannot issue production authority or activate unrelated sites.

**Acceptance:** A sandbox completion status alone cannot authorise production deployment.

**Target screen:** S-DEP-03 · R2

### FS-DEP-005 / FR-DEP-005 — Implementation plan

Track dependencies and accepted owners for integration, training, support and change management milestones.

**Exception:** Go live stays blocked while an applicable readiness task or required evidence is incomplete.

**Acceptance:** Go live requires evidence that applicable readiness tasks are complete.

**Target screen:** S-DEP-02 · R2

### FS-DEP-006 / FR-DEP-006 — Acceptance and fallback

Execute site acceptance and fallback tests, retain results and require local approval.

**Exception:** Failed integration or untested safe fallback blocks the affected go live; rollback status needs observed confirmation.

**Acceptance:** A failed integration acceptance test blocks the affected go live.

**Target screen:** S-DEP-03 · R2

### FS-DEP-007 / FR-DEP-007 — Training and competency

Bind role access to approved training, competence and renewal. Identify users affected by procedure changes.

**Exception:** Expired required training removes the relevant clinical permission until reassessment.

**Acceptance:** A user can be restricted from a clinical feature after required training expires.

**Target screen:** S-DEP-02 · R2

### FS-DEP-008 / FR-DEP-008 — Production boundary

Keep evaluation and production environments, credentials and data links explicitly typed and separated.

**Exception:** An evaluation service identity cannot write a live clinical record, even if the user holds a separate production role.

**Acceptance:** An evaluation credential cannot write to a production patient record.

**Target screen:** S-DEP-02 · R2

### FS-DEP-009 / FR-DEP-009 — Contract and budget transition

Record pilot end, recurring budget, production owner and support acceptance before sustained deployment.

**Exception:** Funding expiry creates continuation or safe closure tasks; it cannot silently end required patient follow up.

**Acceptance:** A pilot nearing funding expiry shows an accountable continuation or closure decision.

**Target screen:** S-DEP-02 · R2

### FS-DEP-010 / FR-DEP-010 — Deployment register

Maintain site reported installed configuration, operating dates and monitoring responsibility, including confirmation time.

**Exception:** Unknown or stale installed version is visible and included in recall follow up rather than assumed current.

**Acceptance:** A recall can locate all registered deployments of an affected version.

**Target screen:** S-DEP-01 · R2

### FS-DEP-011 / FR-DEP-011 — Benefits realisation

Review observed outcomes and total costs against the approved baseline and follow up window.

**Exception:** Incomplete follow up and attribution limits remain visible; patient reach is not demonstrated health benefit.

**Acceptance:** An adoption report identifies baseline, attribution limits and incomplete follow up.

**Target screen:** S-DEP-02 · R2

### FS-DEP-012 / FR-DEP-012 — Safe termination

Execute termination with replacement or fallback, data export, support and clinical responsibility handover.

**Exception:** A vendor exit cannot mark continuity complete until an accountable local owner accepts remaining duties.

**Acceptance:** A vendor exit leaves the institution with a documented transition and retained lawful records.

**Target screen:** S-DEP-03 · R2

## MON — Surveillance and change management

Monitoring owner, site owner, evaluator and safety authority. Accountable role: Clinical safety lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| monitoring_plan | Approved required | Deployment, metrics, sources, cadence, windows, thresholds, missingness, owners and escalation. |
| feed_state | System observed | Last source event, last successful ingestion, expected cadence, unavailable state and reconciliation. |
| outcome_window | Required for clinical follow up | Index time, label due date, maturity, censoring and observation source. |
| alert | Object required | Rule version, scope, severity, evidence, dedupe key, owner, acknowledgement and closure evidence. |
| change_notice | Required on material update | Old and new components, effective date, developer rationale, deployed sites and evidence links. |
| classification | Qualified decision | Regression, local revalidation, external permission, new study or reasoned no material impact. |
| rollback_instruction | Conditional command | Target configuration, authority, site, sent time, acknowledgement and observed state. |
| handover | Required on service exit | Incoming owner, source access, obligations, effective end and accepted transfer. |

### FS-MON-001 / FR-MON-001 — Monitoring plan

Activate a plan only with approved definitions, sources, thresholds, missingness and response owners plus a successful feed check.

**Exception:** A configured plan with a dead source cannot make a deployment actively monitored.

**Acceptance:** A deployment cannot be labelled monitored without an active plan and functioning data source.

**Target screen:** S-MON-02 · R2

### FS-MON-002 / FR-MON-002 — Operational telemetry

Track operational availability, latency, failures, abstentions and input quality using permitted telemetry and source freshness.

**Exception:** Missing feed is unavailable, not zero failures or zero usage.

**Acceptance:** A missing telemetry feed is reported as unavailable rather than interpreted as zero incidents.

**Target screen:** S-MON-01 · R2

### FS-MON-003 / FR-MON-003 — Clinical performance follow up

Separate recent unlabelled cases from mature follow up cohorts and recalculate using the declared outcome window.

**Exception:** Unobserved outcomes cannot be counted as successful; delayed label updates retain prior report versions.

**Acceptance:** Recent unlabelled cases cannot be counted as successful outcomes.

**Target screen:** S-MON-02 · R2

### FS-MON-004 / FR-MON-004 — Drift detection

Detect defined input, outcome, workflow or performance shifts and open a qualified review with limitations.

**Exception:** Statistical drift alone cannot be presented as proven patient harm or an automatic clinical verdict.

**Acceptance:** A statistical drift signal creates a review rather than an unsupported conclusion of patient harm.

**Target screen:** S-MON-03 · R2

### FS-MON-005 / FR-MON-005 — Version change intake

Register every material model, prompt, rule, dependency, device or local configuration change and identify affected evidence and sites.

**Exception:** Unreported discovered changes remain explicit uncertainty and may restrict current claims.

**Acceptance:** A changed component identifies the associated evidence and monitoring plans for reassessment.

**Target screen:** S-MON-02 · R2

### FS-MON-006 / FR-MON-006 — Change classification

A qualified owner classifies change impact and records required tests, permissions and study work.

**Exception:** The developer cannot unilaterally exempt a material clinical change from review.

**Acceptance:** A developer cannot unilaterally declare a material clinical change insignificant.

**Target screen:** S-MON-03 · R2

### FS-MON-007 / FR-MON-007 — Revalidation scheduling

Schedule periodic and event triggered revalidation and show due, overdue, restricted and completed states.

**Exception:** Overdue mandatory review prevents stale evidence being shown as current without an authorised scope decision.

**Acceptance:** An overdue required revalidation produces an explicit restricted or expired evidence status.

**Target screen:** S-MON-01 · R2

### FS-MON-008 / FR-MON-008 — Alert routing

Assign alerts with deduplication, acknowledgement, escalation and closure evidence. Critical alerts reach a backup if the primary misses the configured interval.

**Exception:** Acknowledging an alert does not resolve it; duplicates retain occurrence counts and severity history.

**Acceptance:** Unacknowledged urgent alerts reach the backup contact within the configured escalation period.

**Target screen:** S-MON-03 · R2

### FS-MON-009 / FR-MON-009 — Rollback tracking

Request rollback to an approved configuration and track site-specific acknowledgement and execution.

**Exception:** Central dispatch cannot mark a remote installation rolled back without positive evidence.

**Acceptance:** Central issuance does not imply a site completed rollback without positive confirmation.

**Target screen:** S-MON-03 · R2

### FS-MON-010 / FR-MON-010 — Comparative surveillance

Compare trends only when metric definition, case mix, denominator and follow up are compatible.

**Exception:** Incomparable series are separated or clearly qualified and cannot form a universal product ranking.

**Acceptance:** A dashboard discloses incomparable denominators and cannot imply a global product ranking.

**Target screen:** S-MON-01 · R2

### FS-MON-011 / FR-MON-011 — Monitoring handover

Transfer or terminate monitoring with accepted owners, source access and effective dates. Update catalogue and deployment claims.

**Exception:** Ended service cannot remain labelled actively monitored merely because historical data are still displayed.

**Acceptance:** No deployment remains represented as actively monitored after its responsible service has stopped.

**Target screen:** S-MON-03 · R2

### FS-MON-012 / FR-MON-012 — Evidence freshness

Show latest evidence review, supporting configuration, installed configuration, monitoring scope and unresolved alerts.

**Exception:** Version mismatch or expired conditions produce visible limitations on current suitability claims.

**Acceptance:** A buyer can identify that installed software differs from the version supporting a published claim.

**Target screen:** S-MON-01 · R2

## ANA — Dashboards reporting and decision support

Authorised role users, programme owner, metric owner and finance owner. Accountable role: Analytics lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| metric | Approved definition required | Name, purpose, numerator, denominator, exclusions, owner, source, version and cadence. |
| dimensions | Allowed set | Country, programme, study type, task, period and other approved categories subject to disclosure rules. |
| view | Saved filter object | Owner, context, filters, sort, metric versions, audience and permitted drilldown. |
| data_freshness | System field | Source event time, ingestion time, calculation time and incomplete sources. |
| report_export | Frozen object | Filters, data as of time, definitions, exclusions, confidentiality, digest and approved recipient scope. |
| schedule | Conditional object | Cadence, timezone, recipients, audience, expiry, format and delivery owner. |
| financial_measures | Restricted records | Budget, commitments, actual costs, receivables and currency or conversion basis. |
| disclosure_policy | Required for aggregate release | Cell thresholds, complementary suppression, query controls and qualified approval. |

### FS-ANA-001 / FR-ANA-001 — Role specific dashboards

Select the default dashboard from role and current context, then filter all components by effective access.

**Exception:** Funder visibility is limited to approved programme outcomes and never implies patient record access.

**Acceptance:** A funder sees approved programme outcomes without receiving patient records by default.

**Target screen:** S-ANA-01 · R1

### FS-ANA-002 / FR-ANA-002 — Portfolio funnel

Count distinct opportunities through need, application, feasibility, evaluation, decision, deployment and monitoring with explicit outcomes.

**Exception:** Scientific failure, withdrawal, missing funds and incomplete application remain separate categories.

**Acceptance:** A failed scientific evaluation is distinguishable from an unfunded otherwise suitable solution.

**Target screen:** S-ANA-01 · R1

### FS-ANA-003 / FR-ANA-003 — Time and bottlenecks

Calculate elapsed and active stage time from the event ledger with stated pause and abandonment treatment.

**Exception:** Resetting stage labels cannot erase earlier waiting or rework intervals.

**Acceptance:** Reported turnaround includes a published rule for paused and abandoned studies.

**Target screen:** S-ANA-02 · R1

### FS-ANA-004 / FR-ANA-004 — Evidence quality reporting

Display evidence completeness, independence, subgroup coverage, unresolved findings and age with their denominators.

**Exception:** Large test counts cannot substitute for missing independent clinical evidence.

**Acceptance:** A large number of tests cannot substitute for missing independent clinical validation.

**Target screen:** S-ANA-01 · R1

### FS-ANA-005 / FR-ANA-005 — Outcome reporting

Report defined clinical, workflow, equity and economic outcomes against baseline with follow up maturity and attribution limits.

**Exception:** Reach or model calls cannot be relabelled health benefit.

**Acceptance:** Patient reach is not displayed as demonstrated health benefit.

**Target screen:** S-ANA-02 · R2

### FS-ANA-006 / FR-ANA-006 — Resource and financial reporting

Reconcile authorised programme and study costs to approved usage, personnel and services; show commitments separately from actuals.

**Exception:** Do not add currencies without a disclosed approved conversion basis or double count commitments already invoiced.

**Acceptance:** Study cost reconciles with approved compute, personnel and external service charges.

**Target screen:** S-ANA-01 · R1

### FS-ANA-007 / FR-ANA-007 — Governed metrics

Approve metric definitions and allowed dimensions before shared use. Version changes and show breaks in longitudinal series.

**Exception:** A changed denominator cannot silently appear as an improvement in the same metric.

**Acceptance:** A changed definition is visible in longitudinal comparisons.

**Target screen:** S-ANA-03 · R1

### FS-ANA-008 / FR-ANA-008 — Privacy preserving reporting

Apply scope, small cell and inference controls to charts, filters, comparisons and exports.

**Exception:** Repeated queries and complementary totals must not reconstruct suppressed individual results.

**Acceptance:** Repeated small group queries cannot trivially reconstruct a protected individual's result.

**Target screen:** S-ANA-03 · R1

### FS-ANA-009 / FR-ANA-009 — Report exports

Freeze export filters, definitions, source freshness and limitations with the approved visual or tabular output.

**Exception:** Recheck rights before download; an exported chart cannot omit a material qualification.

**Acceptance:** An exported chart retains qualifications that materially affect its interpretation.

**Target screen:** S-ANA-02 · R1

### FS-ANA-010 / FR-ANA-010 — Scheduled reporting

Generate scheduled reports under the owner's approved scope, recheck each recipient at delivery and record failures.

**Exception:** Removed recipients receive no restricted content; a schedule cannot preserve privileges after its owner leaves.

**Acceptance:** A recipient removed before delivery does not receive the scheduled restricted report.

**Target screen:** S-ANA-03 · R2

## COL — Collaboration tasks and communications

Permitted object participants, task owners, communication approvers and translators. Accountable role: Programme director.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| comment | Object scoped text | Author, source object and version, content, permitted mentions, edit history and confidentiality. |
| task | Required work record | Owner, backup, due date, dependency, expected evidence and completion decision. |
| message | Draft or approved object | Template version, purpose, recipients, channel, minimal preview and authenticated source link. |
| meeting | Controlled record | Participants, capacities, conflicts, agenda, decisions, actions and final record approval. |
| document_revision | Versioned content | Parent, author, changes, review comments, conflicts and approval state. |
| translation | Source linked object | Source version, language, translator or machine provenance, qualified reviewer and approved use. |
| delivery | Per recipient record | Queued, sent, delivered where supported, failed, acknowledged, attempts and timestamps. |
| release | Human authorisation | Exact content and recipient snapshot, authority, authentication and effective time. |

### FS-COL-001 / FR-COL-001 — Contextual discussions

Attach discussions to object versions and inherit their permissions. Validate each mention against discovery and discussion rights.

**Exception:** A tagged user without access receives no confidential title or comment excerpt.

**Acceptance:** A comment mentioning a restricted study does not expose it to an unauthorised tagged user.

**Target screen:** S-COL-02 · R1

### FS-COL-002 / FR-COL-002 — Assignments and reminders

Assign work with owner, due date, dependencies and evidence; route reminders through permitted channels.

**Exception:** Departure reassigns to the accountable owner; tasks cannot disappear with a deactivated account.

**Acceptance:** A task cannot disappear when its assigned user leaves the organisation.

**Target screen:** S-COL-01 · R1

### FS-COL-003 / FR-COL-003 — Notifications

Use minimal notification previews and authenticated links; user preferences govern ordinary channels only.

**Exception:** Patient identifiers, sensitive findings and secrets never appear in email subjects or push previews.

**Acceptance:** Email subject lines and push previews do not include patient identifiers or confidential findings.

**Target screen:** S-COL-01 · R1

### FS-COL-004 / FR-COL-004 — Consequential communications

Require authorised release of exact content and recipients for submissions, public publication and external safety notices.

**Exception:** Drafting, AI generation or task completion never sends consequential communications automatically.

**Acceptance:** Drafting a message or report does not send or publish it automatically.

**Target screen:** S-COL-03 · R1

### FS-COL-005 / FR-COL-005 — Meeting decisions

Record meeting participants, conflicts, decisions and actions, then obtain approval of the final minutes.

**Exception:** Minutes do not substitute for a required structured gate decision or signature.

**Acceptance:** A discussion summary cannot silently substitute for a required formal gate decision.

**Target screen:** S-COL-02 · R1

### FS-COL-006 / FR-COL-006 — Document collaboration

Support controlled revisions and compare concurrent changes using observed versions. Preserve comments against their original text where possible.

**Exception:** Conflicting controlled text requires explicit resolution; no silent last write overwrite.

**Acceptance:** One reviewer's edit cannot overwrite another reviewer's change without resolution.

**Target screen:** S-COL-02 · R1

### FS-COL-007 / FR-COL-007 — Translation review

Bind translations to source version and qualified language review; show draft machine provenance until approved.

**Exception:** Source change marks translations for review; unapproved text cannot become consent or authority material.

**Acceptance:** An unreviewed machine translation is marked draft and cannot serve as approved consent material.

**Target screen:** S-COL-03 · R2

### FS-COL-008 / FR-COL-008 — Communication audit

Track recipient snapshots, attempts, delivery evidence and required acknowledgement. Escalate failed material notifications.

**Exception:** Sent is not delivered and delivered is not acknowledged; unsupported channel receipts remain unknown.

**Acceptance:** A failed delivery is not counted as successful notification.

**Target screen:** S-COL-03 · R1

## LRN — Knowledge training and network learning

Knowledge owner, training assessor, moderator and method reviewer. Accountable role: Network lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| knowledge_item | Versioned record | Topic, owner, source, applicable scope, review date, audience and approval state. |
| course | Versioned object | Role, objectives, required content, assessment criteria, accessible alternatives and renewal interval. |
| completion | Verified record | User, course version, attempt, assessment result, assessor, date and validity. |
| failure_case | Approved narrative | Observed outcome, context, evidence, lessons, limitations, anonymisation and publication rights. |
| community_post | Moderated record | Audience, topic, author, disclosed interests, content and moderation history. |
| method_proposal | Controlled object | Intended task, formula or procedure, reference fixtures, limits, validation and decision. |
| refresher_scope | Change impact set | Affected procedure versions, users, due dates and resulting access restrictions. |
| network_report | Approved aggregate | Sources, observed findings, hypotheses, scope limitations, rights and disclosure decision. |

### FS-LRN-001 / FR-LRN-001 — Knowledge library

Publish approved methods and guidance with owner, scope and review date. Template selection uses only currently eligible versions.

**Exception:** Overdue or withdrawn guidance remains labelled historical and is excluded from default new study templates.

**Acceptance:** Outdated guidance is labelled and excluded from default new study templates.

**Target screen:** S-LRN-02 · R1

### FS-LRN-002 / FR-LRN-002 — Learning from failure

Capture failed evaluations and implementations with evidence and context, then review confidentiality and rights before sharing.

**Exception:** Anonymisation must be assessed for reidentification; failure learning cannot expose a protected developer or participant.

**Acceptance:** A case study can describe failure without exposing a protected developer or participant.

**Target screen:** S-LRN-02 · R2

### FS-LRN-003 / FR-LRN-003 — Role based onboarding

Assign role-specific onboarding on membership activation and track required completion.

**Exception:** Restricted access remains blocked until mandatory data, integrity and escalation training is complete.

**Acceptance:** Completion of mandatory onboarding is checked before restricted access is activated.

**Target screen:** S-LRN-01 · R1

### FS-LRN-004 / FR-LRN-004 — Training records

Record course version, assessed competence and renewal; material procedure changes identify users needing refresher work.

**Exception:** Prior attendance alone cannot satisfy a new competence requirement or expired assessment.

**Acceptance:** Changing a material procedure identifies users requiring refresher training.

**Target screen:** S-LRN-02 · R2

### FS-LRN-005 / FR-LRN-005 — Community exchange

Moderate questions, methods and events within approved audiences and declared conflicts.

**Exception:** Sealed tests and private reviews cannot be shared through community content or attachments.

**Acceptance:** A community post cannot reveal sealed test data or private review materials.

**Target screen:** S-LRN-03 · R2

### FS-LRN-006 / FR-LRN-006 — Method governance

Validate a method proposal using declared fixtures and qualified review before adding it to an official pack.

**Exception:** Experimental status remains visible and cannot replace an approved metric without the relevant protocol change.

**Acceptance:** An experimental metric remains clearly identified until its review is complete.

**Target screen:** S-LRN-03 · R2

### FS-LRN-007 / FR-LRN-007 — Network learning reports

Compile aggregate lessons with source provenance and disclosure review; distinguish findings from hypotheses.

**Exception:** Network experience cannot be presented as universally applicable clinical proof.

**Acceptance:** Published lessons distinguish observed findings from hypotheses and cannot imply universal applicability.

**Target screen:** S-LRN-03 · R3

## COP — AI assistance within the platform

Authorised user, institutional AI administrator and qualified content reviewer. Accountable role: AI product lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| request_context | Required | Actor, institution, study, purpose, task, data class, enabled feature and permitted source scope. |
| provider_binding | Approved configuration | Model version, regions, retention, training use, terms, task evaluation and current status. |
| retrieved_source | Versioned permitted reference | Object, section, access decision, retrieval time and excerpt classification. |
| generated_draft | Versioned content | AI provenance, prompt configuration, model, sources, unsupported flags and user revisions. |
| action_proposal | Nonexecuting record | Suggested command, arguments, expected effect, cost or recipients and required authority. |
| human_acceptance | Explicit record | Reviewed content version, reviewer, edits, factual checks and accepted draft destination. |
| feedback | Restricted record | Error type, source span, severity, user correction, owner and remediation. |
| feature_policy | Versioned matrix | Task, role, data class, institution, provider, allowed tools, limits and activation gates. |

### FS-COP-001 / FR-COP-001 — Assisted drafting

Generate clearly labelled drafts for enabled tasks from approved sources; insert into an editable draft only after user acceptance.

**Exception:** Generated material cannot become a signed protocol, decision or report without normal review and gates.

**Acceptance:** Drafts are labelled as AI assisted and cannot become signed decisions without human review.

**Target screen:** S-COP-02 · R2

### FS-COP-002 / FR-COP-002 — Permission aware retrieval

Resolve retrieval against the current user's object, purpose and blinding permissions at query and response delivery.

**Exception:** Prompts cannot access another tenant, hidden reviewer deliberation or sealed benchmark; revoked sources are removed from delivery.

**Acceptance:** A prompt cannot expose another tenant's document, hidden review or sealed benchmark.

**Target screen:** S-COP-01 · R2

### FS-COP-003 / FR-COP-003 — Source attribution

Attach accessible source references to material factual claims and distinguish inference or missing evidence.

**Exception:** Unsupported claims are flagged and cannot be inserted as verified study findings without human source checking.

**Acceptance:** Unsupported findings are flagged and are not inserted as verified study results.

**Target screen:** S-COP-02 · R2

### FS-COP-004 / FR-COP-004 — Consequential action control

Represent consequential actions as nonexecuting proposals. The authorised user opens the ordinary command preview and passes current guards.

**Exception:** The assistant cannot approve, grant, publish, submit, issue clinical findings or spend outside an existing authorised budget.

**Acceptance:** Every consequential action requires the specified authorised human confirmation and gate checks.

**Target screen:** S-COP-02 · R2

### FS-COP-005 / FR-COP-005 — Provider governance

Check provider terms, region, retention and training permissions before transmitting any content.

**Exception:** Unapproved provider or changed terms block the request; ordinary workflow remains available.

**Acceptance:** Restricted study content is not sent to a provider lacking applicable approval.

**Target screen:** S-COP-03 · R2

### FS-COP-006 / FR-COP-006 — Untrusted content handling

Treat retrieved text, files and model output as untrusted content. Tool requests use declared allowlists and the user's effective permissions.

**Exception:** Embedded instructions cannot alter authority, export assets or disable review controls.

**Acceptance:** Embedded instructions in a document cannot trigger an export or disable a review gate.

**Target screen:** S-COP-01 · R2

### FS-COP-007 / FR-COP-007 — User correction

Allow edit, reject and report; preserve the original generated version, user revisions and AI provenance within retention rules.

**Exception:** Correcting text cannot remove provenance or silently change an issued record.

**Acceptance:** Correcting a draft does not erase the fact that AI assistance was used.

**Target screen:** S-COP-02 · R2

### FS-COP-008 / FR-COP-008 — Assistant evaluation

Activate only after task, privacy, access and adversarial tests pass; rerun affected tests after model, prompt, tool or corpus changes.

**Exception:** A critical failure blocks the feature even if average quality improves.

**Acceptance:** A failed critical safety or permission test prevents release of the feature.

**Target screen:** S-COP-03 · R2

### FS-COP-009 / FR-COP-009 — Administrative controls

Enable functions by institution, role, purpose and data class within mandatory operator limits. Preview effect before activation.

**Exception:** Disabled capability is also denied through APIs, schedules and background tasks.

**Acceptance:** A disabled feature cannot be invoked through an API or background task.

**Target screen:** S-COP-03 · R2

### FS-COP-010 / FR-COP-010 — Fallback and abstention

Show uncertainty, insufficient sources or provider failure plainly and keep the manual workflow usable.

**Exception:** Assistant outage cannot block incident filing, ordinary drafting, review or required evidence access.

**Acceptance:** A failed AI service cannot prevent an authorised user from filing a safety incident.

**Target screen:** S-COP-01 · R2

## API — Integration and interoperability

Integration owner, data custodian, security reviewer and external system owner. Accountable role: Integration lead.

**Current relationship:** Hosted command/API and public HTTPS JSON subset; full regional/national-system contracts absent.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| connector | Required object | Owner, environment, purpose, source, destination, data classes, service identity and approved regions. |
| interface_profile | Versioned contract | Protocol and version, supported operations, formats, pagination, limits and deprecation dates. |
| mapping | Approved version | Source and destination fields, meaning, unit, code system, time semantics, identifier and source of truth. |
| exchange | System record | External key, source version, direction, manifest, status, acknowledgement and correlation. |
| event | Durable envelope | Event identity, type, object version, occurred time, producer, permitted payload and delivery attempts. |
| credential | Protected reference | Scope, issue and rotation dates, expiry and revocation; raw secrets are never ordinary record fields. |
| conformance | Required activation evidence | Representative valid and invalid fixtures, semantic checks, security tests, reviewer and outcome. |
| replay_request | Controlled object | Connector, bounded source range, reason, expected effects, approver and idempotency treatment. |

### FS-API-001 / FR-API-001 — Versioned interfaces

Expose documented versioned operations with consistent authentication, object scoping, cursor pagination and structured errors.

**Exception:** Breaking changes require the BRD notice period or a recorded urgent exception with managed alternatives.

**Acceptance:** A published integration can identify the API version and supported deprecation period.

**Target screen:** S-API-02 · R1

### FS-API-002 / FR-API-002 — Scoped integration access

Create a dedicated owned service identity per connector, with purpose, destinations and minimal scopes.

**Exception:** Reporting integration cannot inherit raw clinical export rights or the administrator's other privileges.

**Acceptance:** A reporting connector cannot inherit permission to export raw clinical data.

**Target screen:** S-API-02 · R1

### FS-API-003 / FR-API-003 — Health record exchange

Select the institution's agreed FHIR version and implementation profile and validate representative resources plus terminology and units.

**Exception:** Unrecognised or invalid clinical meaning is quarantined; generic JSON acceptance is not conformance.

**Acceptance:** Profile validation and unit or terminology mapping pass agreed conformance examples before activation.

**Target screen:** S-API-02 · R2

### FS-API-004 / FR-API-004 — Medical imaging exchange

Declare supported DICOM objects and services and preserve study and series relationships under approved deidentification.

**Exception:** Missing identity reconciliation or prohibited identifiers block the transfer's accepted status.

**Acceptance:** Transferred images retain clinically necessary metadata while prohibited identifiers are handled as approved.

**Target screen:** S-API-02 · R1

### FS-API-005 / FR-API-005 — Research and health information systems

Map EDC, laboratory and research fields to authoritative sources and reconciliation rules before activation.

**Exception:** Conflicting observations do not create a competing master; raise a source resolution case.

**Acceptance:** Each connected field has an identified authoritative source and reconciliation rule.

**Target screen:** S-API-02 · R2

### FS-API-006 / FR-API-006 — Import and export portability

Export authorised records in documented open formats with schema version, dictionaries and relationship keys.

**Exception:** Receiver reconstruction tests must pass; inaccessible assets are omitted with a manifest explanation.

**Acceptance:** A receiving tool can reconstruct object relationships from an approved export.

**Target screen:** S-API-02 · R1

### FS-API-007 / FR-API-007 — Reliable events

Verify event authenticity, deduplicate by event identity and process according to stated ordering rules. Record acknowledgements and bounded retries.

**Exception:** Repeated delivery cannot repeat approval, grant or charge; replay does not create new authority.

**Acceptance:** Repeated delivery does not duplicate a clinical decision, invoice or approval.

**Target screen:** S-API-03 · R1

### FS-API-008 / FR-API-008 — Connector failures

Show failed exchanges with safe reason, affected range and retry eligibility. Preserve acknowledged source records until reconciled.

**Exception:** External outage cannot silently drop accepted inputs or block unrelated study functions.

**Acceptance:** An unavailable external system cannot cause silent loss of an acknowledged source record.

**Target screen:** S-API-01 · R1

### FS-API-009 / FR-API-009 — Mapping governance

Review and version mappings for code, unit, time and identifiers; retain original and transformed meaning.

**Exception:** Unknown codes and incompatible units are quarantined rather than guessed or silently substituted.

**Acceptance:** An unrecognised clinical code is quarantined or explicitly represented rather than silently replaced.

**Target screen:** S-API-03 · R1

### FS-API-010 / FR-API-010 — Identity and finance integrations

Use approved scoped interfaces for identity, finance, signatures and support; declare ownership of each exchanged field.

**Exception:** Accounting receives financial metadata only; role provisioning cannot trust arbitrary external group names.

**Acceptance:** An accounting integration receives billing data without gaining clinical evidence access.

**Target screen:** S-API-02 · R2

### FS-API-011 / FR-API-011 — Connector lifecycle

Activate after rights, security and conformance approval. Disable stops new exchanges while preserving pending outcomes and history.

**Exception:** Credential revocation and queued work are reconciled; disablement cannot erase past transmissions.

**Acceptance:** Disabling a connector stops new transfers and preserves the record of past exchanges.

**Target screen:** S-API-03 · R1

### FS-API-012 / FR-API-012 — External evidence exchange

Exchange only approved evidence metadata with named external networks using agreed schema and audience scope.

**Exception:** Publish current status and corrections without patient detail; partner directory membership implies no new sharing rights.

**Acceptance:** An external directory receives only the authorised metadata and current evidence status.

**Target screen:** S-API-02 · R3

## BIL — Commercial operations billing and sponsorship

Commercial owner, finance approver, budget owner and customer representative. Accountable role: Commercial lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| service_package | Versioned required | Scope, deliverables, exclusions, prerequisites, pricing basis, support and acceptance criteria. |
| estimate_line | Required cost item | Category, quantity, unit rate, currency, contingency, assumption, period and source. |
| quote | Versioned proposal | Customer, package, scope, total, currency, validity, discount, approver and customer acceptance. |
| budget | Required for billable work | Funding source, approved ceiling, commitments, actual cost, warning levels and hard limit. |
| usage | Immutable metering record | Institution, study, run or service, unit, quantity, period, rate version and billable classification. |
| invoice | Finance authority record | Issuer, customer, currency, line references, tax basis, total, status and external ledger identity. |
| credit_or_dispute | Linked record | Original invoice or charge, reason, amount, evidence, owner and independent finance decision. |
| renewal | Time bounded service record | Term, notice, price basis, support, transition owner and surviving obligations. |

### FS-BIL-001 / FR-BIL-001 — Service catalogue

Publish service packages with deliverables, exclusions, pricing basis, prerequisites and acceptance rules.

**Exception:** A quote cannot imply unsupported countries, capabilities or regulatory approval as an included deliverable.

**Acceptance:** A buyer can identify which activities and deliverables are included before contracting.

**Target screen:** S-BIL-02 · R1

### FS-BIL-002 / FR-BIL-002 — Cost estimation

Estimate staff, sites, data, compute, oversight, integration and contingency with quantities and assumptions.

**Exception:** Scope or cost changes create a revised estimate and applicable budget approval, not hidden increments.

**Acceptance:** Estimate changes identify the driver and require the applicable budget approval.

**Target screen:** S-BIL-02 · R1

### FS-BIL-003 / FR-BIL-003 — Quotes and approvals

Route quotes and discounts through delegated financial limits and record customer acceptance of the exact version.

**Exception:** Accepted scope cannot increase commitment without an authorised change order.

**Acceptance:** A change in scope cannot silently increase an institution's financial commitment.

**Target screen:** S-BIL-03 · R1

### FS-BIL-004 / FR-BIL-004 — Budget controls

Reserve budget for approved work, show committed versus actual and warn at 80 and 100 percent unless stricter rules apply.

**Exception:** Hard limits block new unauthorised consumption, including retries, while preserving safe termination and evidence.

**Acceptance:** A study cannot exceed its approved hard spending limit through automatic retries.

**Target screen:** S-BIL-02 · R1

### FS-BIL-005 / FR-BIL-005 — Usage metering

Meter usage by institution, study, service and logical run, then reconcile attempts and rate versions.

**Exception:** Failed retries are billable only under declared terms; duplicates cannot create a second charge.

**Acceptance:** A failed retry is charged only according to the declared billing policy.

**Target screen:** S-BIL-02 · R1

### FS-BIL-006 / FR-BIL-006 — Invoices and payments

Prepare invoices through approved finance processes with explicit currency and applicable tax configuration. Link credits to originals.

**Exception:** Posted accounting records are not silently edited locally; correction uses the finance authority's approved process.

**Acceptance:** An issued credit links to the original invoice and preserves audit history.

**Target screen:** S-BIL-03 · R2

### FS-BIL-007 / FR-BIL-007 — Grant and subsidy management

Allocate awards to eligible recipients, costs, milestones and periods and report remaining funds.

**Exception:** Subsidy payer visibility cannot change scientific scoring, reviewer assignment or safety gates.

**Acceptance:** A subsidised evaluation shows the payer without changing the scientific scoring rules.

**Target screen:** S-BIL-02 · R1

### FS-BIL-008 / FR-BIL-008 — Commercial independence

Apply commercial restrictions only within contracts and display protected scientific and safety actions separately.

**Exception:** Overdue payment cannot delete findings, block urgent concern intake or bypass safe closure.

**Acceptance:** An overdue invoice cannot delete unfavourable evidence or prevent an urgent safety report.

**Target screen:** S-BIL-03 · R1

### FS-BIL-009 / FR-BIL-009 — Financial disputes

Open billing disputes with charge evidence, owner and timeline; retain independent financial decisions.

**Exception:** Scientific appeals remain available under their own rules and cannot be merged into invoice negotiation.

**Acceptance:** A scientific appeal remains available under its own policy despite an unrelated invoice dispute.

**Target screen:** S-BIL-03 · R2

### FS-BIL-010 / FR-BIL-010 — Renewal and exit

Track renewals, notice and service end; obtain accepted monitoring or support handover where required.

**Exception:** Expired service removes unsupported active monitoring claims without erasing retained evidence or duties.

**Acceptance:** Service expiry triggers a documented handover and removes unsupported active monitoring claims.

**Target screen:** S-BIL-03 · R2

## AUD — Audit assurance and compliance evidence

Independent auditor, control owner, legal owner and assurance lead. Accountable role: Assurance lead.

**Current relationship:** Application audit, snapshots and receipts; external immutable assurance incomplete.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| audit_event | Protected immutable record | Actor, institution, action, scope, object version, time, outcome, reason, policy and correlation. |
| change_reference | Safe comparison record | Old and new values or protected references, reason and approval; exclude secrets and unnecessary patient data. |
| control | Versioned required | Purpose, owner, applicability, implementation reference, verification, cadence and unresolved findings. |
| inspection_scope | Approved bounded object | Authority, purpose, selected records, periods, audience, redactions and custody. |
| legal_hold | Required when applied | Reason, legal owner, scope predicate, dependencies, effective date, review date and authorised release. |
| exception | Time bounded record | Risk, scope, compensating controls, independent approver, expiry and reassessment. |
| certification | Verified optional record | Issuer, standard or scheme, scope, version, validity, evidence and claim wording. |
| retention_rule | Approved version | Purpose, jurisdiction, event class, trigger, period, holds and disposal proof. |

### FS-AUD-001 / FR-AUD-001 — Audit coverage

Capture authentication, restricted reads, grants, edits, runs, decisions, exports, publications and privileged actions with context.

**Exception:** A sensitive action cannot succeed without its required durable audit record or approved recoverable transaction treatment.

**Acceptance:** A sampled sensitive action can be traced to actor, scope, object version, time and outcome.

**Target screen:** S-AUD-01 · R1

### FS-AUD-002 / FR-AUD-002 — Audit integrity

Protect event history and provide tamper verification with separately retained integrity evidence.

**Exception:** Administrators cannot edit audit events as ordinary records; suspected tampering opens an incident.

**Acceptance:** An administrator cannot alter an event without detection and a separately retained record.

**Target screen:** S-AUD-02 · R1

### FS-AUD-003 / FR-AUD-003 — Before and after changes

Retain safe before and after values or protected references for material changes with reason and approval.

**Exception:** Do not log secrets, full prompts or patient records merely to achieve audit detail.

**Acceptance:** An investigator can reconstruct a permission change without exposing authentication credentials.

**Target screen:** S-AUD-02 · R1

### FS-AUD-004 / FR-AUD-004 — Audit access

Grant auditors time bounded read only inspection scopes and independently authorise exports.

**Exception:** Audit access cannot modify records or approve the scientific decision under inspection.

**Acceptance:** An auditor cannot approve the report being audited.

**Target screen:** S-AUD-01 · R1

### FS-AUD-005 / FR-AUD-005 — Control evidence library

Maintain controls, owners, test evidence, findings, exceptions and review dates; link each control to current verification.

**Exception:** A policy attachment without test evidence cannot be displayed as an implemented verified control.

**Acceptance:** A requested control can be linked to its latest verification and unresolved findings.

**Target screen:** S-AUD-02 · R1

### FS-AUD-006 / FR-AUD-006 — Compliance mapping

Map obligations and standard versions to applicable controls with qualified interpretation and source.

**Exception:** A checklist template cannot create a compliance or certification claim.

**Acceptance:** The platform cannot advertise compliance solely because a checklist template exists.

**Target screen:** S-AUD-02 · R1

### FS-AUD-007 / FR-AUD-007 — Inspection support

Freeze inspection scope and export manifest, apply rights and redactions and record recipient custody.

**Exception:** Exported record counts and versions must reconcile; omitted restricted items are explicitly accounted for.

**Acceptance:** The exported inspection package reconciles to the selected source versions.

**Target screen:** S-AUD-02 · R1

### FS-AUD-008 / FR-AUD-008 — Legal holds

Apply bounded holds to records and required dependencies, intercepting scheduled disposal. Record review and authorised release.

**Exception:** Deleting a parent or changing a retention rule cannot bypass an active hold.

**Acceptance:** A scheduled deletion cannot remove a held record or its required supporting evidence.

**Target screen:** S-AUD-03 · R1

### FS-AUD-009 / FR-AUD-009 — Exceptions and expiry

Approve exceptions with compensating controls, independent owner and expiry; show affected release gates.

**Exception:** Expired exceptions cease to authorise activity and cannot silently roll forward.

**Acceptance:** An expired exception cannot silently remain active.

**Target screen:** S-AUD-03 · R1

### FS-AUD-010 / FR-AUD-010 — Periodic assurance review

Schedule assurance reviews and track finding severity, owners and remediation evidence.

**Exception:** Recurring critical findings escalate even when previous instances were individually marked resolved.

**Acceptance:** A recurring critical finding triggers escalation to the appropriate governance body.

**Target screen:** S-AUD-01 · R1

### FS-AUD-011 / FR-AUD-011 — Certification claims

Verify issuing body, scope, version and validity before permitting certification wording in public or institutional views.

**Exception:** Assessment in progress remains pending and cannot be advertised as certification.

**Acceptance:** An assessment in progress is never displayed as a completed certification.

**Target screen:** S-AUD-03 · R1

### FS-AUD-012 / FR-AUD-012 — Audit retention

Apply approved audit retention by event class and jurisdiction, preserving active holds and disposal proof.

**Exception:** Available storage alone cannot justify indefinite retention or remove privacy restrictions.

**Acceptance:** Audit logs cannot be retained indefinitely solely because storage is available.

**Target screen:** S-AUD-03 · R1

## OPS — Administration support and service operations

Operations lead, support agent, security owner and release manager. Accountable role: Operations lead.

**Current relationship:** Encrypted capture and isolated restore; no measured regional recovery or production SLA.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| support_case | Scoped record | Institution, service, correlation, impact, owner, redacted attachments and access approval if needed. |
| operational_incident | Required record | Priority, scope, start, acknowledgement, timeline, recovery, communications and review due date. |
| configuration_change | Versioned object | Current and proposed values, impact, test evidence, approver, effective time and recovery plan. |
| feature_activation | Scoped record | Capability, release, institution, country, task, passed gates and authorised owner. |
| capacity_reservation | Bounded allocation | Resource profile, period, study, priority, budget and protected safety reserve. |
| backup_restore | Controlled record | Asset scope, jurisdiction, snapshot, integrity, restore test, current revocation and deletion reconciliation. |
| release | Approved object | Version, changes, linked requirements, verification, rollout, rollback or forward recovery and communication. |
| supplier | Governed record | Service, dependent studies, owner, incident route, approved terms, change notice and exit option. |

### FS-OPS-001 / FR-OPS-001 — Operational console

Show queue, health and dependency metadata with correlation references. Use approved diagnostics to locate faults.

**Exception:** Routine operators cannot open patient content, proprietary models or sealed benchmarks through the console.

**Acceptance:** Support can identify a failed job using metadata and approved diagnostics.

**Target screen:** S-OPS-01 · R1

### FS-OPS-002 / FR-OPS-002 — Support access

Accept redacted support material and request explicit scoped temporary access only when necessary.

**Exception:** Creating a ticket grants no general tenant visibility; expired support access is revoked automatically.

**Acceptance:** A user filing a ticket does not grant blanket access to all institutional data.

**Target screen:** S-OPS-02 · R1

### FS-OPS-003 / FR-OPS-003 — Incident management

Declare priority, assign owner and runbook, record recovery and issue required communications. Preserve a complete incident chronology.

**Exception:** Recovery cannot close the post incident actions or clinical safety case automatically.

**Acceptance:** Major incidents preserve a timeline and tracked corrective actions.

**Target screen:** S-OPS-02 · R1

### FS-OPS-004 / FR-OPS-004 — Configuration control

Review configuration diffs with scope impact, tests and recovery method before activation.

**Exception:** A privileged configuration edit cannot weaken nonwaivable controls or silently affect other countries.

**Acceptance:** Changing an access rule records who approved it and what affected scopes were assessed.

**Target screen:** S-OPS-03 · R1

### FS-OPS-005 / FR-OPS-005 — Feature activation

Activate capabilities only for scopes with required release and operational evidence. Maintain separate UI availability and enforceable activation record.

**Exception:** Turning on a menu or feature flag cannot bypass clinical, privacy or country gates.

**Acceptance:** Enabling a user interface feature cannot bypass a missing clinical capability approval.

**Target screen:** S-OPS-03 · R1

### FS-OPS-006 / FR-OPS-006 — Service notices

Publish scoped maintenance and incident notices with expected impact, current state and approved update cadence.

**Exception:** Avoid confidential study detail; users must distinguish service disruption from an individual study failure.

**Acceptance:** Users can distinguish a planned outage from failure of their own study.

**Target screen:** S-OPS-02 · R1

### FS-OPS-007 / FR-OPS-007 — Capacity and quota management

Allocate reservations and quotas fairly using approved priorities and protected incident capacity.

**Exception:** A large customer's workload cannot consume a reserved active safety investigation allocation.

**Acceptance:** A large commercial customer cannot consume protected capacity assigned to an active safety investigation.

**Target screen:** S-OPS-03 · R1

### FS-OPS-008 / FR-OPS-008 — Backup and restore operations

Perform restore in isolation, verify integrity and reconcile current grants, revocations, holds and deletion ledger before reopening.

**Exception:** A snapshot cannot reactivate departed users, disposed data or expired permissions.

**Acceptance:** A restored environment does not reactivate revoked users or deleted data without reconciliation.

**Target screen:** S-OPS-03 · R1

### FS-OPS-009 / FR-OPS-009 — Release management

Release only with approved requirements, regression evidence, rollout and recovery plan. Keep metric versions pinned to historical results.

**Exception:** Updating computation code cannot recalculate issued reports in place.

**Acceptance:** A metric implementation update cannot silently alter previously issued results.

**Target screen:** S-OPS-03 · R1

### FS-OPS-010 / FR-OPS-010 — Support service catalogue

Publish support hours, routes, urgency criteria and local clinical responsibilities per institution.

**Exception:** Ordinary helpdesk closure does not remove the approved out of band urgent route.

**Acceptance:** Clinical sites have a local urgent route even when ordinary technical support is unavailable.

**Target screen:** S-OPS-02 · R1

### FS-OPS-011 / FR-OPS-011 — Supplier continuity

Register critical supplier dependencies and tested continuity options; map outages and changes to affected services and studies.

**Exception:** Supplier substitution requires renewed rights, residency and conformance checks where material.

**Acceptance:** A supplier outage can be linked to affected studies and recovery options.

**Target screen:** S-OPS-02 · R1

### FS-OPS-012 / FR-OPS-012 — Institutional service reviews

Hold scoped institutional reviews of performance, unresolved issues, costs and future obligations; assign actions visible to both parties.

**Exception:** Meeting completion does not close outstanding actions without required evidence and owner acceptance.

**Acceptance:** Actions from the review have owners and due dates visible to both parties.

**Target screen:** S-OPS-02 · R2

## EXT — Retention portability and closure

Data custodian, legal owner, institutional administrator and continuity owner. Accountable role: Data governance lead.

**Current relationship:** No requirement-level acceptance established; retain the full target requirement.

| Field | Type/requirement | Validation/meaning |
|---|---|---|
| retention_schedule | Approved required | Asset class, jurisdiction, trigger, duration, basis, disposal method and responsible owner. |
| closure_inventory | Required | Memberships, credentials, runs, data, reports, incidents, contracts, finance and surviving tasks. |
| disposal_action | Controlled record | Assets and copies, approved basis, holds checked, method, completion, exceptions and verification. |
| backup_treatment | Required | Affected snapshots, expiry date, restricted restoration and deletion ledger references. |
| portable_export | Approved manifest | Objects, versions, relationship keys, dictionaries, histories, formats, rights and recipient. |
| offboarding | Required checklist | Access revocation, owner transfer, service credentials, notifications and retained attribution. |
| succession_plan | Conditional institutional agreement | Successor eligibility, custody, essential services, incident responsibility, rights and activation authority. |
| attestation | Signed scoped record | Completed actions, retained exceptions, backup expiry, residual duties, verifier and date. |

### FS-EXT-001 / FR-EXT-001 — Retention schedules

Assign an approved retention schedule before creating production assets. Derive expiry from explicit trigger events and display applicable holds.

**Exception:** Missing policy blocks asset activation; indefinite retention is not an implicit default.

**Acceptance:** A newly created asset inherits an explicit retention policy rather than an indefinite default.

**Target screen:** S-EXT-02 · R1

### FS-EXT-002 / FR-EXT-002 — Study closure

Reconcile access, jobs, data, evidence, incidents, contracts and finance at study close. Assign surviving duties to accepting owners.

**Exception:** Administrative closure cannot end unfulfilled safety obligations or remove unresolved incident records.

**Acceptance:** A study cannot close its safety obligations by changing its administrative status.

**Target screen:** S-EXT-02 · R1

### FS-EXT-003 / FR-EXT-003 — Data disposal

Review expired assets, copies and derivatives, then execute lawful disposal and retain verification plus exceptions.

**Exception:** Held records remain protected; partial completion cannot be represented as total deletion.

**Acceptance:** A disposal record identifies completed actions, retained exceptions and backup expiry treatment.

**Target screen:** S-EXT-03 · R1

### FS-EXT-004 / FR-EXT-004 — Backup deletion handling

Record backup expiry and block ordinary access to disposed content. Restore applies the current deletion and restriction ledger before reopening.

**Exception:** A restored historical snapshot cannot resurrect lawfully deleted records or revoked access.

**Acceptance:** A restore applies the current deletion and revocation ledger before user access resumes.

**Target screen:** S-EXT-03 · R1

### FS-EXT-005 / FR-EXT-005 — Institutional export

Prepare an authorised export with documented open formats, dictionaries, relationship keys, histories and manifests.

**Exception:** Verify reconstruction and rights before delivery; export creation alone is not successful handover.

**Acceptance:** An export includes relationship keys and definitions needed to interpret the files.

**Target screen:** S-EXT-02 · R1

### FS-EXT-006 / FR-EXT-006 — Rights aware portability

Evaluate retention rights for each exported asset and recipient, recording exclusions and allowed reuse.

**Exception:** A departing partner cannot take another institution's raw data through shared study membership.

**Acceptance:** A departing partner cannot take another institution's raw data merely because both joined a study.

**Target screen:** S-EXT-03 · R1

### FS-EXT-007 / FR-EXT-007 — User and tenant offboarding

Revoke user and tenant credentials, transfer ownership and retain necessary signed attribution under approved privacy rules.

**Exception:** Profile removal cannot erase clinical signoff identity; missing successor remains a visible continuity issue.

**Acceptance:** Deleting a user profile does not destroy the attribution of a clinical signoff.

**Target screen:** S-EXT-02 · R1

### FS-EXT-008 / FR-EXT-008 — Operator succession

Maintain a succession plan for insolvency, acquisition or cessation and exercise custody and incident handover assumptions.

**Exception:** No automatic asset transfer to an unapproved successor; local rights and institutional authority still apply.

**Acceptance:** A tabletop exercise identifies who would receive evidence and incident responsibilities.

**Target screen:** S-EXT-03 · R2

### FS-EXT-009 / FR-EXT-009 — Closure attestation

Issue signed closure or disposal attestations with exact scope, completed steps, held records and backup treatment.

**Exception:** Never claim deletion of retained or unverified external copies.

**Acceptance:** An attestation never claims deletion of data still retained under a documented hold.

**Target screen:** S-EXT-03 · R1

### FS-EXT-010 / FR-EXT-010 — Residual obligations

Keep surviving confidentiality, reporting, follow up and financial obligations assigned after ordinary access ends.

**Exception:** Expired contracts cannot remove required tasks; use restricted successor access or institutional handover to complete them.

**Acceptance:** An expired commercial agreement does not remove a required safety follow up task.

**Target screen:** S-EXT-01 · R1

## Complete quality-control contracts

### QC-SEC-001 / NFR-SEC-001 — Security verification baseline

The application shall meet the applicable OWASP ASVS 5.0.0 Level 2 requirements, with additional high assurance controls selected for privileged and restricted data paths.

**Realisation:** AUD records the applicable verification controls, evidence, findings and signoff; OPS prevents launch with an unresolved exploitable critical or high finding.

**Verification:** Run an independent scoped assessment against the implemented journeys and record retest evidence, including privileged and restricted data paths.

**Acceptance:** An independent assessment records applicability and evidence; no unresolved exploitable critical or high finding remains at launch.

### QC-SEC-002 / NFR-SEC-002 — Transport protection

All protected browser, API, service and data transfer traffic shall use authenticated encryption with TLS 1.2 or higher; TLS 1.3 is preferred where supported.

**Realisation:** Every protected connection validates its peer and fails without exposing content when certificate or negotiated protocol checks fail.

**Verification:** Exercise browser, connector, node and service transfers with expired certificates, mismatched identities and obsolete protocols.

**Acceptance:** Scanning finds no accepted plaintext protected endpoint or obsolete protocol; certificate failure blocks connection.

### QC-SEC-003 / NFR-SEC-003 — Stored data protection

Restricted data, backups and credentials shall be encrypted using approved contemporary cryptography and separately controlled key access.

**Realisation:** Asset and backup inventories record protected storage and key custody; ordinary operators cannot retrieve content through storage administration.

**Verification:** Inspect representative clinical data, model files, credentials and restored backups and test separation between key and storage access.

**Acceptance:** Storage and backup inspection finds no unencrypted restricted payload or plaintext secret.

### QC-SEC-004 / NFR-SEC-004 — Authentication coverage

One hundred percent of privileged users, signers and restricted data users shall use multifactor authentication; privileged access shall use phishing resistant authentication or an approved equivalent institutional control.

**Realisation:** IAM records assurance and ACC checks it at protected entry and signature; privileged functions require the stronger approved method.

**Verification:** Attempt each restricted action through UI, API and service contexts with insufficient factors and verify consistent denial.

**Acceptance:** Attempts to enter these scopes without the required assurance are denied in all supported clients.

### QC-SEC-005 / NFR-SEC-005 — Local credential policy

Local passwords shall permit at least 64 characters, require at least 15, reject known compromised values and avoid arbitrary composition or routine forced rotation without cause.

**Realisation:** Local enrolment and reset validate length and compromised values while supporting paste and password managers; do not impose arbitrary periodic resets.

**Verification:** Test minimum boundary, a 64 character password, compromised value rejection and recovery revocation without logging the submitted secret.

**Acceptance:** Password managers and paste work; recovery and change tests invalidate compromised sessions as specified.

### QC-SEC-006 / NFR-SEC-006 — Session expiry

Default inactivity expiry shall be 15 minutes for privileged sessions and 30 minutes otherwise, with a 12 hour maximum; critical approvals require authentication within the preceding 5 minutes.

**Realisation:** The UI displays safe expiry warnings; the server uses authoritative activity and authentication times and requires step up before critical signoff.

**Verification:** Test just before, at and after inactivity, absolute and five minute approval boundaries, including a stale browser tab.

**Acceptance:** Boundary tests confirm expiry and step up checks without losing safely saved drafts.

### QC-SEC-007 / NFR-SEC-007 — Revocation latency

Online permission and credential revocation shall take effect within 60 seconds across protected APIs, jobs and active sessions.

**Realisation:** Revocation generates an effective restriction and impact queue; protected actions and controlled deliveries recheck current authority.

**Verification:** Measure from committed revocation to last possible protected success across sessions, workers, caches, APIs and download paths; all must meet 60 seconds online.

**Acceptance:** A distributed revocation test has no successful new protected action after the deadline; offline limits are documented separately.

### QC-SEC-008 / NFR-SEC-008 — Isolation assurance

Cross tenant, cross study and privilege escalation test suites shall cover every protected object and execution boundary.

**Realisation:** Every protected object inherits institution and study scope; execution profiles isolate files, secrets and residual memory.

**Verification:** Use two institutions, cross study users and a hostile workload to exercise direct links, search, exports, background jobs and resource reuse.

**Acceptance:** No unauthorised access succeeds in the release suite or independent penetration test.

### QC-SEC-009 / NFR-SEC-009 — Secret handling

Secrets shall not appear in source repositories, client bundles, telemetry, reports or ordinary support logs; production secrets shall rotate at least every 90 days or faster after compromise.

**Realisation:** Secret fields are write only or masked, references replace values in logs, and rotation tasks have owners and expiry.

**Verification:** Insert synthetic secret markers and inspect bundles, telemetry, reports, tickets and source artefacts; rotate without expanding scope.

**Acceptance:** Automated scans and sampled runtime inspection find no exposed active secret; rotation does not broaden access.

### QC-SEC-010 / NFR-SEC-010 — Abuse protection

Authentication, expensive queries and public interfaces shall have tested rate limits and abuse controls that preserve authorised safety reporting.

**Realisation:** Authentication, search and expensive jobs have configured per principal and institutional limits; urgent reporting has an independently protected route.

**Verification:** Burst valid and hostile traffic and verify bounded resource use, safe rate limit messages and continued authorised urgent intake.

**Acceptance:** Load and brute force tests are contained without preventing the approved emergency reporting route.

### QC-SEC-011 / NFR-SEC-011 — Vulnerability response

Confirmed actively exploited or critical exposures shall be contained within 24 hours; high findings within 7 days and medium within 30 days unless formally risk accepted.

**Realisation:** The vulnerability register starts clocks at confirmed classification and records containment separately from final remediation.

**Verification:** Seed critical, high and medium findings and verify due dates, escalation, risk acceptance authority and evidence of closure.

**Acceptance:** The vulnerability register measures discovery to containment and remediation, with overdue escalation.

### QC-SEC-012 / NFR-SEC-012 — Independent testing

An independent penetration test shall occur before production, annually and after material changes to trust boundaries; continuous dependency and code scanning shall cover releases.

**Realisation:** OPS release and annual assurance calendars require independent testing and retest after material trust changes.

**Verification:** Inspect a release with a boundary change and verify it cannot pass on an old unrelated assessment.

**Acceptance:** Evidence includes remediation and retest of affected controls rather than only the original report.

### QC-PRI-001 / NFR-PRI-001 — Residency coverage

One hundred percent of restricted primary data, replicas, backups, logs containing sensitive content and remote support access shall conform to the approved regional policy.

**Realisation:** Country and asset policies constrain originals, replicas, logs, backups, execution and support locations; inventories expose unsupported locations.

**Verification:** Test each data lifecycle path and a forbidden support session against the active regional policy.

**Acceptance:** A residency inventory and technical validation show no unapproved processing or copy location.

### QC-PRI-002 / NFR-PRI-002 — Purpose enforcement

Every restricted data execution and export shall have an active applicable purpose bound grant.

**Realisation:** Every run and export binds the exact purpose grant and rechecks it at execution and delivery.

**Verification:** Attempt a valid user with wrong purpose, different release, added team member and expired grant; retain denial evidence.

**Acceptance:** A sampled audit and negative tests find no run or export without the required grant.

### QC-PRI-003 / NFR-PRI-003 — Minimised telemetry

Production telemetry shall exclude raw patient records, unrestricted prompts, authentication secrets and proprietary model contents by default.

**Realisation:** Telemetry schemas accept bounded metadata and safe error codes; raw clinical payloads and unrestricted prompts are excluded by default.

**Verification:** Place synthetic identifiers in inputs and failures and inspect general logs, traces, alerts and support attachments.

**Acceptance:** Synthetic sensitive markers inserted into test workflows do not appear in general telemetry.

### QC-PRI-004 / NFR-PRI-004 — Disclosure control

All public or shared aggregate releases shall pass approved small cell, linkage and inference risk rules; thresholds shall be set per context.

**Realisation:** ANA and DAC share disclosure rules across UI, exports, complementary totals and repeated queries.

**Verification:** Use fixtures with small cells and overlapping filters; confirm suppression cannot be bypassed through subtraction or a second presentation format.

**Acceptance:** A disclosure test pack verifies suppression and complementary cell handling for all supported filters and exports.

### QC-PRI-005 / NFR-PRI-005 — Privacy impact review

Every new restricted processing purpose, provider or material transfer shall have a completed privacy and rights assessment before activation.

**Realisation:** New purpose, provider or material transfer creates a required privacy assessment gate before related connector or capability activation.

**Verification:** Submit each change with an incomplete assessment and verify processing remains blocked while unaffected scope stays available.

**Acceptance:** A release cannot enable the affected processing while a mandatory assessment is incomplete.

### QC-PRI-006 / NFR-PRI-006 — Data rights service

Requests shall be acknowledged within 2 business days and assigned within 1; completion follows the shorter applicable legal or contractual deadline.

**Realisation:** Rights cases use the institution's business calendar, acknowledgement and assignment clocks plus the shorter applicable completion deadline.

**Verification:** Test weekend, holiday, reassignment and paused investigation cases without pausing a legal clock unless the approved rule permits it.

**Acceptance:** The case register tracks deadlines, identity checks, holds and reasoned outcomes without assuming one global deadline.

### QC-PRI-007 / NFR-PRI-007 — Deletion execution

Approved deletion shall remove active copies within 30 days or a shorter applicable limit; backup expiry and holds shall be disclosed and enforced.

**Realisation:** Disposal cases track active copies, held assets, backups and external notices separately, with the applicable shorter deadline.

**Verification:** Verify deleted content cannot be retrieved through caches, exports or a restored snapshot; attestation lists lawful exceptions.

**Acceptance:** Verification confirms active deletion and prevents restoration from reintroducing disposed records.

### QC-PRI-008 / NFR-PRI-008 — Provider data use

No external model or analytics provider may train on or reuse restricted content without a separately documented lawful authorisation and explicit institutional approval.

**Realisation:** Provider approvals explicitly record training and reuse permissions and are checked before content transmission.

**Verification:** Change a provider term or remove institutional permission and confirm the next affected request is blocked.

**Acceptance:** Provider configuration and terms are verified before use; an unapproved change stops affected transmission.

### QC-AVL-001 / NFR-AVL-001 — Core availability

The production control plane shall target 99.9 percent monthly availability, measured through authenticated critical journeys in supported regions, including planned maintenance impact.

**Realisation:** Availability covers authenticated login, task, study, evidence and incident journeys by supported region; planned maintenance and user-visible dependencies count.

**Verification:** Reconcile probe failures and incident intervals over the month without averaging away a failing supported region or journey.

**Acceptance:** Independent probes and incident records reconcile successful available minutes; third party failures affecting the journey count.

### QC-AVL-002 / NFR-AVL-002 — Emergency reporting continuity

An out of band route shall remain available for urgent incidents and suspension requests when the platform is unavailable.

**Realisation:** Institutions have an approved out of band urgent route with accountable operator and local site contact, published before activation.

**Verification:** Quarterly disable the platform route and record successful human contact and transfer of the urgent concern.

**Acceptance:** A quarterly outage exercise reaches an accountable operator and the relevant local site contact.

### QC-AVL-003 / NFR-AVL-003 — Recovery time

Core identity, access, study metadata, evidence and incident services shall recover within 4 hours after a declared recoverable regional disaster.

**Realisation:** The recovery runbook restores critical identity, grants, metadata, evidence and incidents only in permitted locations.

**Verification:** Time a declared recoverable regional disaster through validated reopening, including current policy reconciliation, within four hours.

**Acceptance:** A twice yearly recovery exercise meets the target within permitted residency locations.

### QC-AVL-004 / NFR-AVL-004 — Recovery point

Recovery point objectives shall be at most 15 minutes for core metadata and final artefacts and 5 minutes for signed decisions, grants and audit events.

**Realisation:** Recovery evidence distinguishes core metadata and final artefacts from signed decisions, grants and audit with their separate objectives.

**Verification:** Create timestamped fixtures before failure, recover and measure actual loss; reconcile uncertain approvals before enabling protected actions.

**Acceptance:** A recovery test demonstrates bounded loss and reconciles any missing authoritative actions before reopening access.

### QC-AVL-005 / NFR-AVL-005 — Source data recovery

Custodied input data shall have a contracted recovery point no greater than 24 hours unless a stricter study requirement applies; reproducible and unique inputs shall be distinguished.

**Realisation:** Source assets identify unique versus reproducible inputs and contracted recovery objectives in the custodian record.

**Verification:** Restore representative datasets and compare manifests; missing unique evidence blocks dependent claims.

**Acceptance:** Restored inputs reconcile to the frozen manifest; a missing unique input blocks dependent evidence claims.

### QC-AVL-006 / NFR-AVL-006 — Backup verification

Backup integrity shall be checked daily and sampled restoration tested monthly, with a full recovery exercise twice yearly.

**Realisation:** The console separates completed backups, verified integrity, sampled restore and full exercise status.

**Verification:** Demonstrate daily checks, monthly sample restoration and twice yearly recovery evidence; failed verification remains a blocking finding.

**Acceptance:** A completed backup job without successful restore evidence is not reported as proven recoverability.

### QC-AVL-007 / NFR-AVL-007 — Failure isolation

Loss of one study workload or connector shall not disable unrelated study control, incident reporting or access enforcement.

**Realisation:** Run and connector failures are scoped to their workloads while protected control and incident functions remain available.

**Verification:** Inject one workload exhaustion and one connector outage under representative load and exercise unrelated institutions' critical journeys.

**Acceptance:** Injected workload and dependency failures leave unrelated critical journeys functional.

### QC-AVL-008 / NFR-AVL-008 — Safe degraded operation

If permissions, policy or provenance cannot be verified, affected sensitive actions shall fail closed while authorised nonsensitive reporting remains available where safe.

**Realisation:** Unavailable permission or provenance dependencies return a safe unavailable state, withholding protected execution and release.

**Verification:** Simulate partial dependency failures and confirm no cached approval becomes an unrestricted fallback.

**Acceptance:** Dependency failure cannot cause unrestricted access, silent approval or fabricated successful results.

### QC-AVL-009 / NFR-AVL-009 — Disconnected sites

Remote nodes shall show last contact and unacknowledged instructions; offline permissions shall have explicit validity and risk limits.

**Realisation:** Node records show last contact, instruction acknowledgement and approved offline lease; local enforcement is part of node admission.

**Verification:** Disconnect a node before stop and verify the central state stays unconfirmed, local lease treatment and backup escalation.

**Acceptance:** An offline node is never displayed as stopped or updated without evidence; its local owner receives the escalation.

### QC-PER-001 / NFR-PER-001 — Interactive navigation

At L1, common authenticated pages shall become usable within 3 seconds at the 95th percentile under the standard network profile.

**Realisation:** Common pages load permitted summary data first and defer large assets without hiding required actions.

**Verification:** At L1 measure user-perceived usable time for login landing, study list, task queue and detail over at least 60 minutes.

**Acceptance:** A 60 minute representative load test covers login landing, study list, task queue and record view.

### QC-PER-002 / NFR-PER-002 — Transactional response

At L1, ordinary read and write APIs excluding bulk transfer and model execution shall respond within 1 second at p95 and 3 seconds at p99.

**Realisation:** Ordinary synchronous reads and writes include full authentication and policy evaluation; bulk work returns a tracked job.

**Verification:** Measure server response p95 and p99 plus error rate using the defined workload, including ordinary background processing.

**Acceptance:** Measured server response includes authentication and policy checks; error rate is below 0.5 percent excluding valid client errors.

### QC-PER-003 / NFR-PER-003 — Search response

Permission filtered metadata search over 2 million indexed records shall return within 2 seconds at p95 at L1.

**Realisation:** Search uses permitted metadata and consistent filters, counts and stable pagination.

**Verification:** Query the two million record L1 catalogue with complex filters under concurrent use, measuring response and checking hidden-result leakage.

**Acceptance:** The test includes complex filters and confirms that faster results do not omit access controls.

### QC-PER-004 / NFR-PER-004 — Dashboard response

Standard portfolio dashboards over L1 data shall load within 5 seconds at p95 and show their data freshness.

**Realisation:** Dashboards display calculation time and missing sources; expensive custom analyses become asynchronous.

**Verification:** Measure the approved standard dashboard set at L1, including scoped aggregation and disclosure checks.

**Acceptance:** Heavy custom analyses are asynchronous with progress rather than blocking the application.

### QC-PER-005 / NFR-PER-005 — Large ingestion

A valid 1 GB structured import shall complete validation and reconciliation within 10 minutes after transfer under the specified reference schema and allocated capacity.

**Realisation:** The 1 GB reference import has a declared schema and resource profile; progress distinguishes transfer from validation and reconciliation.

**Verification:** Start the measured clock after verified transfer and require reconciled output within ten minutes; profile imaging separately.

**Acceptance:** Results account for every input row; imaging and custom transforms use separately approved budgets.

### QC-PER-006 / NFR-PER-006 — Queue responsiveness

Job submission shall acknowledge within 2 seconds at p95; eligible jobs with reserved available capacity shall start within 2 minutes at p95.

**Realisation:** Submission records an acknowledged logical request quickly, then separates waiting for capacity, policy blocks and scheduler delay.

**Verification:** Measure acknowledgement and eligible reserved-capacity start separately; do not count blocked or unfunded jobs as scheduler successes.

**Acceptance:** Queue metrics distinguish unavailable resources, policy holds and scheduler delay.

### QC-PER-007 / NFR-PER-007 — Large exports

Approved exports up to 100000 tabular rows shall be prepared within 5 minutes at p95 at L1.

**Realisation:** Large exports are jobs with progress, scope manifest and expiry, followed by current authorisation at download.

**Verification:** Prepare 100000 representative rows under L1 within five minutes p95 and revoke a recipient before delivery.

**Acceptance:** The user sees progress and expiry; authorisation is rechecked before download.

### QC-PER-008 / NFR-PER-008 — Low bandwidth use

Core metadata workflows shall become usable within 8 seconds at p95 on the low bandwidth profile, excluding deliberate large asset transfer.

**Realisation:** Core metadata forms minimise required transfer and preserve saved drafts; large asset viewers are outside the constrained reference journey.

**Verification:** Use 1 Mbps, 300 ms round trip and one percent packet loss to save an application, review a task and file an incident within eight seconds p95.

**Acceptance:** Users can save an application, review a task and report an incident under the constrained profile.

### QC-PER-009 / NFR-PER-009 — Inference budgets

Each admitted evaluation pack shall declare modality specific runtime, memory, concurrency and timeout budgets rather than inherit a universal inference target.

**Realisation:** Each task pack supplies declared runtime, memory, concurrency and timeout limits that RUN validates against the request.

**Verification:** Exercise an over-budget inference and verify explicit termination or queuing, preserved diagnostics and correct billing treatment.

**Acceptance:** Out of budget runs terminate or queue according to policy with clear evidence and billing treatment.

### QC-PER-010 / NFR-PER-010 — Capacity expansion

Before enabling L2 volume, the service shall pass the same critical performance and isolation tests at L2 or contract explicitly revised targets.

**Realisation:** L2 activation requires new capacity approval and funded resource profiles, without weakening isolation or policy checks.

**Verification:** Repeat the relevant critical suites at L2; unresolved target changes require a baseline decision before promising expanded capacity.

**Acceptance:** Capacity approval is supported by load test evidence and estimated operating cost.

### QC-INTG-001 / NFR-INTG-001 — Acknowledged transactions

An acknowledged transaction shall be durable under ordinary process or single component failure and shall not be partially committed.

**Realisation:** State, decision, audit and dispatch intent form a durable acknowledged action; retries return the existing outcome.

**Verification:** Interrupt processing around each commitment boundary and verify either one complete action or an explicit failure, never partial approval.

**Acceptance:** Failure injection yields either one complete recorded action or an explicit failure, never a partial approval.

### QC-INTG-002 / NFR-INTG-002 — Artefact integrity

Every frozen dataset, model configuration and issued report shall have an integrity identifier and immutable version association.

**Realisation:** Frozen manifests and issued artefacts have immutable version associations and integrity identifiers.

**Verification:** Alter bytes and metadata in fixtures; original verification must fail and the change must require a new version.

**Acceptance:** Changing bytes changes the integrity result and cannot preserve the original verified status.

### QC-INTG-003 / NFR-INTG-003 — Provenance completeness

One hundred percent of formal findings shall identify protocol, inputs, configuration, methods, run and reviewer versions.

**Realisation:** The evidence builder checks mandatory links for every formal finding before final signature.

**Verification:** Remove each provenance link in turn and confirm issue is blocked with the specific missing evidence.

**Acceptance:** An automated completeness check blocks formal issue when any required link is missing.

### QC-INTG-004 / NFR-INTG-004 — Deterministic reproducibility

Deterministic evaluations shall reproduce within protocol specified numerical tolerances on the declared environment.

**Realisation:** Reproduction compares against protocol tolerances and the declared environment, not a universal numeric tolerance.

**Verification:** Use reference fixtures inside and outside tolerance and confirm only acceptable reproduction receives verified status.

**Acceptance:** Results outside tolerance are investigated and cannot be released as reproduced.

### QC-INTG-005 / NFR-INTG-005 — Stochastic reproducibility

Stochastic evaluations shall retain seeds where meaningful, repeat count and uncertainty methods and meet prespecified distributional criteria.

**Realisation:** Stochastic reports preserve planned repeats, meaningful seeds, distribution criteria and provider identity limits.

**Verification:** Rerun the approved plan and assess its prespecified distributional criterion without promising identical remote outputs.

**Acceptance:** A result's reproducibility statement does not promise identical output from a nondeterministic external model.

### QC-INTG-006 / NFR-INTG-006 — Clock consistency

Authoritative platform timestamps shall use UTC with a recorded display timezone and maintain clock skew below 1 second for controlled services.

**Realisation:** Authoritative events use UTC and controlled service time; external times retain source timezone and confidence.

**Verification:** Verify less than one second controlled clock skew and correct ordering across timezone, daylight saving and delayed external events.

**Acceptance:** A trace reconstruction preserves event order; unsynchronised external timestamps are explicitly identified.

### QC-INTG-007 / NFR-INTG-007 — Numerical semantics

Missing, zero, not applicable, suppressed, indeterminate and failed values shall remain distinct throughout analysis and export.

**Realisation:** All numeric views and exports preserve missing, zero, not applicable, suppressed, indeterminate and failed as separate states.

**Verification:** Round trip one fixture for each state through import, calculation, chart and export and compare exact meaning.

**Acceptance:** Round trip tests preserve each state and do not convert missing clinical values to zero.

### QC-INTG-008 / NFR-INTG-008 — Concurrent edits

Conflicting edits to controlled records shall be detected and resolved without silent last write loss.

**Realisation:** Edits use observed versions and controlled conflict resolution; immutable decisions are never automatically merged.

**Verification:** Save concurrent conflicting edits and verify both changes remain recoverable with explicit resolution.

**Acceptance:** Two simultaneous protocol edits produce an explicit conflict or preserved merge history.

### QC-USA-001 / NFR-USA-001 — Accessibility baseline

Core user journeys shall meet WCAG 2.2 Level AA, including authentication, forms, data tables and error recovery.

**Realisation:** The shared shell, forms, tables, dialogs, authentication and recovery flows implement the required accessibility behaviours.

**Verification:** Combine automated checks with keyboard, screen reader, focus, zoom and error recovery testing against WCAG 2.2 AA scope.

**Acceptance:** Automated checks plus manual keyboard, screen reader, focus and zoom testing find no unresolved critical barrier.

### QC-USA-002 / NFR-USA-002 — Task success

At least 90 percent of representative users shall complete each core role specific journey without facilitator intervention after standard onboarding.

**Realisation:** Role journeys expose status, owner and next action and are tested after standard onboarding.

**Verification:** Recruit at least five representative participants per priority role; report successes and failures per journey and check the 90 percent target.

**Acceptance:** Usability sessions include at least 5 participants per priority role and document failures and remediation.

### QC-USA-003 / NFR-USA-003 — Navigation and status clarity

Every active object shall show its status, owner, next required action and applicable blocker in plain language.

**Realisation:** Each active object header shows state, next required action, responsible owner and applicable blocker in plain language.

**Verification:** Ask representative users to identify the next action in sampled tasks and retain evidence of at least 90 percent correct identification.

**Acceptance:** Users correctly identify the next action in at least 90 percent of sampled task scenarios.

### QC-USA-004 / NFR-USA-004 — Error prevention

Consequential actions shall explain scope and consequences, require applicable confirmation and preserve recoverable drafts.

**Realisation:** Consequential actions use exact-scope confirmation and recent authentication; drafts are safely saved before step up.

**Verification:** Test accidental clicks, stale scope, changed recipients and cancel paths; no unintended destructive or release action should commit.

**Acceptance:** Tests prevent accidental publication, deletion and role escalation through one unintended ordinary click.

### QC-USA-005 / NFR-USA-005 — Responsive support

Core metadata and incident workflows shall work at viewport widths from 360 CSS pixels through desktop sizes without loss of required actions.

**Realisation:** Core metadata and incident screens reflow at 360 CSS pixels with accessible alternatives for wide matrices.

**Verification:** Exercise all required actions at mobile and desktop widths and ensure controls are neither clipped nor hidden.

**Acceptance:** Testing at agreed mobile and desktop sizes finds no blocked critical workflow or inaccessible control.

### QC-USA-006 / NFR-USA-006 — Browser support

The platform shall support the current and preceding major versions of Chrome, Edge, Firefox and Safari at release, including agreed iOS and Android browser combinations.

**Realisation:** The release record declares current and preceding major browser versions and agreed mobile combinations; specialised viewers state limits.

**Verification:** Run critical journeys on the actual release matrix and document any viewer-specific restrictions before assignment.

**Acceptance:** The release matrix records tested versions and known limitations; specialised viewers declare separate support.

### QC-USA-007 / NFR-USA-007 — Language readiness

All user facing interface strings shall be externalised with Unicode, locale formatting and expansion support; launch language is English plus approved country needs.

**Realisation:** Interface strings, dates and numbers use locale resources while clinical units and codes remain explicit.

**Verification:** Use Unicode, expansion and right-to-left readiness fixtures as applicable; verify exported terminology and controls are not corrupted or clipped.

**Acceptance:** Pseudo localisation does not clip critical controls or corrupt exported clinical terminology.

### QC-USA-008 / NFR-USA-008 — Translation integrity

Clinical, consent and regulatory translations shall require qualified review and a linked source version before official use.

**Realisation:** Translation approval binds source and language version and qualifies the reviewer for intended use.

**Verification:** Change source consent text and verify affected translations cannot remain official without renewed review.

**Acceptance:** Unapproved translations cannot appear as final participant or authority documents.

### QC-USA-009 / NFR-USA-009 — Assisted accessibility

Training and support content shall provide accessible alternatives for essential visual or audio information.

**Realisation:** Essential learning media have text, captions or equivalent accessible alternatives linked to the same learning outcome.

**Verification:** Complete a required course without its primary visual or audio channel and verify equivalent assessment access.

**Acceptance:** A user unable to use the primary media format can complete the same required training outcome.

### QC-OBS-001 / NFR-OBS-001 — Critical monitoring

Core availability, errors, queue delay, access failures, backup failures and safety channel health shall have monitored indicators and accountable owners.

**Realisation:** Service indicators cover journey health, errors, queue delay, access failures, backups and safety channels with assigned owners.

**Verification:** Inject each critical fault and verify an actionable alert within five minutes, including correct scope and runbook.

**Acceptance:** A controlled critical failure generates an operational alert within 5 minutes.

### QC-OBS-002 / NFR-OBS-002 — Incident acknowledgement

Priority 1 operational incidents shall receive human acknowledgement within 15 minutes under a staffed 24 hour rota.

**Realisation:** P1 operations alerts use a staffed 24 hour rota with backup escalation and human acknowledgement distinct from delivery.

**Verification:** Quarterly drills require human acknowledgement within 15 minutes, including off-hours and primary contact failure.

**Acceptance:** Quarterly drills demonstrate contactability and backup escalation; ordinary support hours are separately published.

### QC-OBS-003 / NFR-OBS-003 — User communications

Affected institutions shall receive an initial major incident update within 30 minutes of confirmation and at least hourly while impact continues.

**Realisation:** Major incident communications show affected services, impact, status and next update without protected study data.

**Verification:** Verify initial update within 30 minutes of confirmation and at least hourly thereafter, retaining failures and corrected delivery.

**Acceptance:** The communication log records delivery failures and contains no unauthorised sensitive data.

### QC-OBS-004 / NFR-OBS-004 — Traceability

Requests, jobs, decisions and exports shall carry correlation identifiers across supported services and connectors.

**Realisation:** Every command, job, decision and exchange propagates a correlation reference to authorised diagnostics.

**Verification:** Trace an initiating request through connector, run, export and audit without relying on patient identifiers.

**Acceptance:** An incident investigation can connect the initiating request with all material outcomes.

### QC-OBS-005 / NFR-OBS-005 — Operational history

Searchable operational telemetry shall be retained for at least 90 days unless a stricter approved privacy rule applies; audit records follow their own schedule.

**Realisation:** Telemetry retention defaults to at least 90 days subject to stricter approved privacy rules; audit uses separate policies.

**Verification:** Investigate a synthetic 60 day old incident from permitted metadata and verify no raw clinical content is required.

**Acceptance:** Operators can investigate a sampled 60 day old incident without accessing raw patient data.

### QC-OBS-006 / NFR-OBS-006 — Runbook coverage

Every critical alert shall have a tested runbook, owner, escalation route and recovery or safe shutdown action.

**Realisation:** Each critical alert links a current tested runbook, owner, backup, recovery or safe shutdown procedure.

**Verification:** Have a newly assigned operator execute sampled scenarios in a supervised exercise and record gaps.

**Acceptance:** A new on call operator can execute sampled runbooks during a supervised readiness exercise.

### QC-OBS-007 / NFR-OBS-007 — Post incident review

Major operational incidents shall receive a documented review within 5 business days of stabilisation, with actions and owners.

**Realisation:** Stabilisation creates a post incident review task due within five business days with causes, actions and owners.

**Verification:** Verify due date calculation and escalation; repeated causes appear in service review even after incident closure.

**Acceptance:** Repeat causes and overdue actions appear in the service governance review.

### QC-MNT-001 / NFR-MNT-001 — Release traceability

Every production change shall link approved requirements or fixes, verification evidence, release identity and accountable approval.

**Realisation:** Release records link changes to FS, QC or approved defect identifiers, tests, approval and recovery plans.

**Verification:** Sample every release type and reconstruct why it was authorised and how it can be recovered.

**Acceptance:** A sampled release can be traced to its business reason and rollback or recovery plan.

### QC-MNT-002 / NFR-MNT-002 — Regression gates

All applicable P0 acceptance scenarios and affected clinical metric reference tests shall pass before release.

**Realisation:** Activation requires all applicable P0 and affected metric reference tests to pass with retained evidence.

**Verification:** Introduce a failing permission, safety, provenance or metric fixture and verify the release gate remains blocked.

**Acceptance:** A failing critical permission, safety, provenance or metric test blocks deployment.

### QC-MNT-003 / NFR-MNT-003 — Rollback readiness

Ordinary application releases shall support rollback or a tested forward recovery within 30 minutes where data compatibility allows.

**Realisation:** Release plans declare rollback or forward recovery and data compatibility limitations.

**Verification:** Rehearse recovery within 30 minutes where applicable, preserving acknowledged records and current restrictions.

**Acceptance:** A rehearsal restores service without discarding acknowledged records or reviving revoked access.

### QC-MNT-004 / NFR-MNT-004 — Migration assurance

Schema and configuration migrations shall validate record counts, relationships, permissions and representative values before completion.

**Realisation:** Migration produces counts, relationships, permissions, representative values and reconciliation results before reopening.

**Verification:** Inject a mismatch and verify affected migrated records remain unavailable while the authoritative source is recoverable.

**Acceptance:** A failed reconciliation prevents the migrated environment from serving affected production records.

### QC-MNT-005 / NFR-MNT-005 — Interface stability

Published production APIs shall have at least 180 days deprecation notice except urgent security or legal changes with managed alternatives.

**Realisation:** Interface lifecycle records expose versions, affected connectors, notice dates and approved urgent exceptions.

**Verification:** Attempt premature removal and verify the 180 day notice gate or explicit exception with managed migration.

**Acceptance:** A breaking change cannot silently invalidate an agreed institutional connector.

### QC-MNT-006 / NFR-MNT-006 — Dependency governance

Releases shall inventory software dependencies and licences, assess vulnerabilities and record supported lifetimes.

**Realisation:** Release evidence contains dependency inventory, licence assessment, vulnerabilities and support end dates.

**Verification:** Verify unsupported critical components have a funded replacement or independently approved bounded exception.

**Acceptance:** Unsupported critical dependencies have a funded replacement or approved time limited exception.

### QC-MNT-007 / NFR-MNT-007 — Portability

Institutional metadata, evidence, audit exports and permitted assets shall be extractable in documented formats without proprietary reader dependence.

**Realisation:** Portable exports include readable reports, structured records, dictionaries, histories and relationship identifiers.

**Verification:** Reconstruct a sampled study in a clean tool environment without proprietary readers and verify evidence references.

**Acceptance:** A clean environment reconstructs a sampled exported study and verifies its evidence references.

### QC-MNT-008 / NFR-MNT-008 — Environment flexibility

Country requirements for hosted, dedicated or institution operated execution shall be supportable through validated deployment profiles.

**Realisation:** Hosted, dedicated and local node profiles each declare supported functions, residency, operations and acceptance evidence.

**Verification:** Run equivalent access, provenance and safety checks before a deployment profile can be sold or activated.

**Acceptance:** Each offered profile passes equivalent access, provenance, safety and operational gates before sale.

### QC-AQL-001 / NFR-AQL-001 — No universal clinical score

Each admitted clinical use shall have approved task specific thresholds, populations, uncertainty requirements and safety criteria.

**Realisation:** PRO requires approved task, population, uncertainty and threshold definitions; EVD checks them before suitability signoff.

**Verification:** Leave a clinical threshold undefined and verify no global default score or favourable result can bypass the blocker.

**Acceptance:** An undefined threshold or unsupported population blocks a suitability conclusion.

### QC-AQL-002 / NFR-AQL-002 — Platform assistant safety

Platform AI features shall have zero observed critical access, unsafe action or fabricated approval failures in the approved release test pack.

**Realisation:** Assistant activation retains the approved test pack and severe failure taxonomy; observed critical failures block release.

**Verification:** Test cross tenant leakage, unsafe action and fabricated approvals; disclose sample size and residual uncertainty even with zero observed critical failures.

**Acceptance:** The report discloses sample size and residual uncertainty; zero observed failures is not claimed as zero real world risk.

### QC-AQL-003 / NFR-AQL-003 — Generated factual grounding

Every material clinical or evaluative claim in a released AI assisted report shall be human verified against the linked approved source.

**Realisation:** Report review tracks each material generated claim, accessible supporting source and human verification decision.

**Verification:** Sample released assisted reports and require every material claim to have eligible source verification.

**Acceptance:** A random audit of released reports finds no unreviewed material generated claim.

### QC-AQL-004 / NFR-AQL-004 — Model change regression

Every material platform model, prompt, tool or retrieval change shall pass task, privacy, permission and adversarial regression gates.

**Realisation:** Model, prompt, corpus and tool changes create an impact record and require affected quality, privacy and adversarial regressions.

**Verification:** Attempt release with improved mean quality but a failing critical regression and verify denial.

**Acceptance:** Changes cannot enter production based solely on improved average response quality.

### QC-AQL-005 / NFR-AQL-005 — Human review independence

Automated scoring shall not be the sole adjudicator of clinical safety, ethics, legal applicability or final evidence approval.

**Realisation:** Protected decisions require eligible human signers with independence and professional authority; judge scores are supporting evidence.

**Verification:** Attempt safety, ethics, applicability and final issue using only service or AI actors and verify denial.

**Acceptance:** Workflow tests require the appropriate eligible human decision for each protected outcome.

### QC-AQL-006 / NFR-AQL-006 — AI service continuity

Core study, incident and review workflows shall remain usable when optional AI services are disabled.

**Realisation:** Optional AI actions are separate from core drafting, task, review and incident functions.

**Verification:** Disable all AI providers and complete the authorised manual journeys without data loss or blocked incident intake.

**Acceptance:** A simulated provider outage leaves manual authorised completion possible without data loss.

### QC-CST-001 / NFR-CST-001 — Cost attribution

At least 95 percent of variable infrastructure and external service spend shall be attributable to a programme, study or approved shared cost category.

**Realisation:** Usage and external costs carry study, programme or approved shared allocation keys; finance reports residual unattributed spend.

**Verification:** Reconcile a month of synthetic bills and metering, showing at least 95 percent attribution and explanations for the remainder.

**Acceptance:** Monthly financial reconciliation explains the remaining unattributed amount.

### QC-CST-002 / NFR-CST-002 — Spending limits

All billable automated workloads shall have approved limits and warning thresholds at 80 and 100 percent of budget unless a stricter policy applies.

**Realisation:** Budget reservations and metering drive warnings at 80 and 100 percent or stricter thresholds and enforce hard stops.

**Verification:** Use concurrent jobs and retries near the ceiling to prove no unauthorised overrun while evidence and safe termination remain possible.

**Acceptance:** The hard limit prevents further unauthorised spending while preserving evidence and safe termination.

### QC-CST-003 / NFR-CST-003 — Idle resource control

Unneeded compute shall be suspended within a configurable period, default 30 minutes, subject to active study requirements.

**Realisation:** Workspace status distinguishes idle from declared active long jobs and suspends unneeded compute after the configured interval.

**Verification:** Verify the 30 minute default stops compute charges without deleting retained data or interrupting a legitimately active job.

**Acceptance:** An idle workspace stops compute charges without deleting retained assets or disrupting a declared long job.

### QC-CST-004 / NFR-CST-004 — Resource reporting

Where providers expose credible measurements, the service shall report compute consumption and estimated environmental impact with methods and limitations.

**Realisation:** Resource reports identify measured consumption, provider estimates, method and uncertainty separately.

**Verification:** Inspect an estimate based on proxy data and confirm it cannot be labelled measured carbon emissions.

**Acceptance:** Estimates do not imply measured carbon emissions when only proxy data are available.

### QC-SUP-001 / NFR-SUP-001 — Operational ownership

Every production capability shall have an accountable product owner, operational owner and escalation route before activation.

**Realisation:** Feature activation records product, operations and relevant safety ownership with current escalation routes.

**Verification:** Remove an essential owner and verify new activation is blocked while continuity tasks are assigned.

**Acceptance:** No feature is released with an unassigned safety or maintenance responsibility.

### QC-SUP-002 / NFR-SUP-002 — Documentation completeness

Each released role shall have current task guidance, access instructions, common error recovery and escalation documentation.

**Realisation:** Each role has versioned task guidance, access setup, error recovery and escalation documentation linked from the interface.

**Verification:** Representative users complete core journeys using published guidance without undocumented internal assistance.

**Acceptance:** Representative users complete the documented core journeys without undocumented internal assistance.

### QC-SUP-003 / NFR-SUP-003 — Country launch readiness

Every active country shall have signed applicability, data, clinical, operational and commercial readiness records for its offered scope.

**Realisation:** Country activation requires signed applicability, data, clinical, operational and commercial readiness for offered scope.

**Verification:** Attempt activation through marketing configuration or a partially approved profile and verify denial.

**Acceptance:** A country cannot be marked active through marketing configuration alone.

### QC-SUP-004 / NFR-SUP-004 — Service request response

Ordinary support requests shall be acknowledged within 1 business day and triaged within 2, with local calendar and support hours disclosed.

**Realisation:** Support tickets start acknowledgement and triage clocks from receipt using disclosed local calendars and hours.

**Verification:** Verify one business day acknowledgement and two business day triage, separately from resolution and urgent incident service.

**Acceptance:** Reports measure compliance from receipt and distinguish acknowledgement from resolution.

### QC-SUP-005 / NFR-SUP-005 — Continuity responsibilities

Every care affecting deployment shall have a locally owned continuity plan independent of platform availability.

**Realisation:** Each care affecting deployment records a locally accepted downtime and continuity plan independent of platform access.

**Verification:** Simulate platform and network outage and demonstrate safe local clinical action with assigned responsibility.

**Acceptance:** A tabletop exercise shows safe local action during a platform or network outage.

### QC-SUP-006 / NFR-SUP-006 — Exit readiness

An annual continuity exercise shall test institutional data export, supplier failure and operator handover assumptions.

**Realisation:** Annual continuity exercises cover institutional export, supplier failure and operator succession with retained obligations.

**Verification:** Record exercise outcomes, named remedies and accepted custody rather than treating an untested plan as proven readiness.

**Acceptance:** The exercise records gaps, assigned remedies and lawful retained obligations.

## Later specifications

| Catalogue | Canonical source | Current state |
|---|---|---|
| Synthetic R2 | [81 requirements](../source-backlog/r2/requirements.json) | Bounded capabilities in current alpha; full source acceptance remains open |
| Government R3 | [FSD](../releases/r3/02-fsd.md) and [63 requirements](../releases/r3/requirements.json) | Proposed; all 134 application cases remain planned |
