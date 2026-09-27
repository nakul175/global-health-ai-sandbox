# Access-control matrix and field policy

Status: proposed. Default deny. Every permission is restricted to active organisation membership, explicit programme assignment where required, allowed evidence/data class and current hold state. A role is never a substitute for record-level scope.

## Roles and actions

Legend: **Own** = assigned organisation/programme/submission only; **Review** = independent person, no declared conflict; **Grant** = explicit time-bound scope; dash = denied.

| Action | Institution admin | Programme lead | Evaluator | Finance | Procurement | Vendor | Safety | Auditor | Service | Support |
|---|---|---|---|---|---|---|---|---|---|---|
| Invite/revoke membership | Own | — | — | — | — | — | — | Read audit | — | — |
| Configure programme/context | Own | Own | Assigned draft | Read | Read | — | Read | Read | — | — |
| Submit supplier artifact | — | On behalf, attributed | — | — | Read released | Own | — | Read metadata | Scoped upload | — |
| View competitor commercial data | Grant | Own | Grant | Own | Own | — | — | Grant | — | — |
| Create evaluation protocol | — | Own | Own | — | Read | Read released | Read | Read | — | — |
| Freeze protocol | — | Review | Review | — | — | — | Review | Read | — | — |
| Start/cancel evaluation | — | Own | Own | — | — | — | Cancel/pause | Read | Execute grant | — |
| Access protected labels | — | — | Grant | — | — | — | — | Grant | Scorer grant | — |
| Edit costs/funding | — | Own | Read | Own | Read | Own quote only | — | Read | — | — |
| Draft evidence pack | — | Own | Own | Cost annex | Read | — | Safety annex | Read | — | — |
| Approve evidence | — | Review | Review | Cost review | Procurement review | — | Safety review | — | — | — |
| Issue reviewed pack | — | Review | Review | — | — | — | — | Read | — | — |
| Configure external connector | Own + grant | Own + grant | Grant | — | — | Own test submission | Disable | Read metadata | Execute grant | — |
| Approve/activate pilot | — | Review | Review | Budget review | — | — | Safety review | Read | — | — |
| Ingest pilot observations | — | — | — | — | — | — | — | Read aggregate | Source grant | — |
| Pause / resume pilot | — | Pause | — | — | — | — | Pause / independent resume | Read | Enforce pause | — |
| Share redacted evidence | — | Own + approved pack | Propose | — | — | — | Review concerns | Read | — | — |
| Export authorised records | Own admin metadata | Own | Grant | Cost scope | Released scope | Own released scope | Safety scope | Audit scope | Export grant | — |
| Diagnostic access | — | — | — | — | — | — | — | Read grant audit | — | Grant only |

The platform operator provisions infrastructure and bootstrap institution administration but cannot use that authority to approve evaluation evidence. An institution admin needs a separate eligible programme role to participate in evidence work; all separation-of-duty rules still apply.

## Record and field rules

- Vendor list/search/facets must reveal only assigned submissions and released requirements/feedback. Hide competitor identity where a blinded comparison is configured, prices, raw metrics, evaluator notes and protected labels.
- Reference labels remain unavailable to vendor code/API; the trusted scorer joins predictions after execution. Service principals cannot approve their own outputs.
- Finance sees cost fields and appropriate aggregate results, not raw media or individual clinical records.
- Auditor scope defaults to metadata and decision history. Raw artifacts require an additional explicit data grant.
- Support sees request IDs, error classes, timings and redacted configuration, never tokens, raw patient data, labels or supplier payloads. A grant names purpose, approver, scope and expiry (maximum 4 hours); actions are logged and grants can be revoked immediately.
- AI assistance, if added later, receives only caller-authorised fields, treats vendor documents as untrusted input, cites source records and cannot approve, issue, award, transfer data or create access grants. No AI summariser is assumed implemented in this release.
- Public registry fields are a separate approved projection, never the private resource serialisation minus a few fields.

## Conditional checks

Independent approval compares stable person identity and recorded contribution history, not current display name or role. Conflicts include employment/advisory/commercial interest in an evaluated supplier and direct authorship of the reviewed artifact. Record declaration and reviewer assignment; unresolved conflicts block independent approval.

Safety hold blocks new evaluation/transfer/issuance and permits incident intake, pause, investigation and authorised reads. Suspended members lose session authority on the next request and job dispatch. Archival preserves authorised reads while disallowing edits and new work. Every download and idempotent replay rechecks current access.

## Service and emergency access

Service credentials name allowed org, programme, operation, data class and expiry; rotate and revoke with audit. They cannot select arbitrary organisation scope in payloads. Emergency access is a separately approved, short-lived incident action, never a permanent superuser UI or synthetic role switch. Emergency activity cannot create independent clinical/procurement approval.

Test positive and negative cases for each row, plus cross-org IDs, delegated roles, revoked grants, role changes, aliases, expired support access and redacted exports. See [test catalogue](tests.json).
