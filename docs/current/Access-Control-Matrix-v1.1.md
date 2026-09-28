# Access Control Matrix — reconciled reading edition

Documentation edition **1.1**, 2026-09-28. Reconciled to repository source **870b49a343f1**: hosted alpha package 0.6.0 plus PR #13; deployment not requalified.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [04_Access_Control_Matrix.md](../../native-baseline/specs/04_Access_Control_Matrix.md).

# Access Control Matrix

Authorization combines a verified identity, one current context, a registered action, an exact record scope and an allowed field projection. All conditions must pass, and any hold, expiry, revocation or disclosure restriction can deny the operation. The machine-readable matrix contains the 40 commands and 14 shared actions, supported by roles.json, role_aliases.json and field_policies.json.

## Policy evaluation order
Authenticate the person or workload and validate token/session assurance. Resolve the server-issued active context and current institution status. Check action eligibility, membership validity, delegated scope and purpose. Resolve the record without revealing undiscoverable existence. Enforce object state, version, ownership, grant, cohort, fields, region, time, independence and hold rules. Project permitted fields. Recheck immediately before the durable effect and before returning a replayed result.
A role alone never means all records in a tenant. Permissions are intersected, not unioned across contexts. A partner operates through its own verified membership or a bounded delegation and a custodian-owned external reference. A positive allow is invalid if any required condition cannot be established.

## Role responsibilities
| Roles | Permitted action families | Conditions and exclusions |
| OP operator administrator | Platform configuration and institution administration assigned by policy | No blanket clinical data, sealed labels, scientific approval or tenant impersonation |
| OA organisation administrator | Invite, revoke, request delegated membership and institution ownership workflows | Cannot self-elevate, exceed delegable scope or independently sign own institution submission |
| PM programme manager and CO country owner | Programme coordination and assigned country oversight | No automatic study activation, dataset grant or scientific sign-off; CO holds only within mandate |
| DV developer | Submit own solution configuration and authorized drafts | Cannot access sealed benchmark labels or approve own evaluation |
| DC data custodian and DE data engineer | Custodian grant and release decisions; engineer import and upload operations | Engineer cannot grant access; custodian cannot exceed data rights or ignore independent approvals |
| AN annotator | Assigned annotation records and permitted fields | No broad dataset export or access to unrelated cohorts |
| EV evaluator and PI site investigator | Assigned study requests, protocol and run workflows; PI local deployment observations | Activation requires all gates; no independent approval of own results |
| SR independent reviewer | Assigned scientific and disclosure decisions, evidence issue and correction | Verified person distinct from author and other required independent slots |
| CS clinical safety and ER ethics or authority | Safety controls and assigned authority decisions | Evidence and authority scope must match; external decisions require verification |
| BY buyer and FN finance | Buyer deployment requests and scoped budget adjustments | No ability to alter scientific conclusions or provide clinical authority |
| SO operations and security | Incident containment, approved operations, job retry and exceptional access | No standing patient access or sealed labels; emergency scope expires and is reviewed |
| SU support and AU auditor | Approved case metadata or scoped assurance projection | No raw patient/model data, secret fields, standing tenant impersonation or business mutation |
| CR community member | Explicit community features and approved public material | No access to restricted study resources by community membership |
| SV service identity | Exact registered connector, node, monitoring or assistant capability | No human signature, implicit role inheritance, institution admin or self-created scope |

## Shared action decisions
| Action | Record boundary | Field and condition rules |
| Discover and list | Explicitly discoverable resource scopes | No hidden title, existence, facet or aggregate count leakage |
| View record | Assigned study, programme, site or active grant | Return only permitted metadata/data fields; quarantine and label rules apply |
| Create and patch draft | Registered domain editor and owning scope | Only schema allowlist; actor, tenant, state, version, digest and approval are server-owned |
| Review and sign | Exact snapshot, assignment, role slot and person | MFA within five minutes; current membership; no author or alias self-approval |
| Upload and finalise | Exact owner, target and current grant | Per-part size/hash/expiry check; finalise enters quarantine, not availability |
| Export and publish | Approved assets, purpose, recipient and current rights | Disclosure approval on exact bytes; every attachment and download is rechecked |
| Read audit | Assigned assurance scope | Redacted events; no credentials, patient payloads or unneeded reporter identifiers |
| Support read | Approved case, named subject, exact resources and expiry | Metadata allowlist only; raw clinical content, labels and durable bearer links excluded |
| AI retrieve and propose | Workload capability intersected with current user's scope | Retrieval rules apply to search and tool output; proposal only, no autonomous approval or dispatch |
| Read public evidence | Approved public projection and current issue status | Superseded and withdrawn status preserved; no restricted dossier inference |

## Signature and approval matrix
Registered review slots are scientific to SR, custodian to DC, safety to CS, institution to OA, disclosure to SR and rights to ER. A snapshot lists required slots and independent verified people. A role is necessary but not sufficient: assignment, validity, conflict declaration, version and assurance all apply. Completion counts distinct people, not accounts or signatures.
Submitter and signer permissions are separate. A request to grant membership is not a right to activate it. A data access request is not a grant. A buyer request is not deployment authority. OP, SO, SU and service accounts cannot stand in for a missing scientific, custody, ethics or safety decision.

## Privileged and support access
Support access requires a case, purpose, resource scope, permitted metadata projection, independent decision, start and expiry. Default duration is sixty minutes with no automatic renewal; a renewed window is a new approved record. End it immediately on case completion or revocation. Show an access banner to the operator and log entry, queries and exit with safe identifiers.
Emergency access is a separate incident workflow for SO. Require step-up authentication, a named incident, a bounded scope and an independent approving person. If a local emergency procedure permits urgent containment before approval, it may disable or isolate a service without granting data-reading privileges. A generic break-glass action does not waive sealed labels, patient-field limits or self-signing rules. Any broader exception requires its own reviewed policy before implementation.
Service accounts are named, scoped, revocable and bound to issuer, audience, workload and environment. They receive no interactive session and cannot impersonate a reviewer. Tokens are short-lived and keys rotate through the secret manager. A connector receipt is only a receipt for its assigned delivery. A node completion must bind the admitted instruction and an attestation.

## Field policy and tests
Identity profile fields are visible to self or a specifically assigned verification case; factor secrets and recovery material are never returned. Patient data requires the exact active release, study, cohort, purpose, fields, recipients, region and time interval. Sealed benchmark labels are available only to an admitted trusted scorer, never the developer, evaluator, support operator or assistant. Public evidence uses an independently approved projection.
Negative tests must cover direct IDs, lists, search snippets, counts, logs, previews, attachments, exports, caches, cursor reuse, websocket or event updates, asynchronous jobs and offline replay. Test a user with two memberships, a revoked context, an expired support case, aliases of the same person and an AI retrieval request containing malicious instructions. UI hiding is useful feedback but is never the authorization control.
DB03 to DB10, DB24 to DB30 and APP04, APP08, APP09, APP21 and APP22 supply concrete acceptance anchors. Record the policy version and decision reason with each privileged effect. Avoid logging sensitive input values in denied requests.
