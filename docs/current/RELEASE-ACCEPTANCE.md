# Release acceptance and responsibility record

Edition 1.1. Status: **development handover; production acceptance open**. Accountable people and approval dates have not been provided. Roles below identify work to assign, not completed sign-offs.

| Gate | Evidence required | Accountable role | Current state |
|---|---|---|---|
| Documentation | Preserved baselines; navigable current edition; inventories, links, schemas/fixtures and QA | Product + engineering | This edition's checks recorded in DOCUMENTATION-QA.md |
| Candidate application | Exact source build and changed-domain unit/integration/HTTP evidence | Engineering/QA | Historical v0.6 reports plus limited PR #13 validation; candidate HTTP gaps visible |
| Hosted user acceptance | Actual owner sign-in and representative end-to-end/browser/error journeys | Programme owner + QA | Not established |
| Institutional identity | Distinct real people, memberships, separation of duties, safe recovery | Institution + security | Proposed R3 foundation |
| Independent security | Intended environment, egress, tenant boundaries, secrets and remediation | Security | Not established |
| Accessibility/usability | Target accessibility assessment, keyboard/screen-reader and representative users | Design/QA + users | Not established for hosted application |
| Data governance | Named institution/jurisdiction, data class, retention, rights and support boundaries | Data owner | Open decisions |
| Integrations | Named provider, current contract/credential and actual sandbox negative/recovery tests | Integration owner | Generic bounded connector exists; customer qualification absent |
| Recovery/operations | Independent keys/backups, actual restore/cutover, monitoring and incident drills | Operations/security | Isolated local restoration tested historically; regional production recovery open |
| Clinical evidence | Appropriate protocol/reference standard, representative data and local approvals | Clinical/evaluation authority | Synthetic testing only; no clinical qualification |
| Government R3A decision flow | Institution comparison, budget, independent evidence/export acceptance | Programme + evaluator + finance | Proposed, zero R3 application tests executed |
| Release approval | Named sponsor, ownership, known defects, qualification, rollback and signed decision | Release authority | Not recorded |

Documentation publication does not satisfy the other gates. An application can remain useful for synthetic development while production gates remain open. Original performance, availability and recovery targets are retained as targets, not observed results.

For a candidate acceptance record, capture: candidate commit/build and environment; scope/data class; exact evidence links; unexecuted/failed cases; accepted residual risk with actual owner; rollback/recovery plan; approver identity and date. Do not fabricate these fields or copy another profile's pass status.
