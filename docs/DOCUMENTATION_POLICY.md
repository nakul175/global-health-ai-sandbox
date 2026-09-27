# Documentation maintenance policy

Effective: 2026-09-26. Owner: product lead; engineering lead owns contract and implementation accuracy. Named institutional reviewers are assigned during onboarding, not invented in documentation.

## Every change

1. Use a feature branch and pull request for subsequent changes. Keep the requirement, schema, migration, UI behaviour and tests in the same review as the code they govern.
2. Add or update requirement IDs without renumbering existing IDs. Retire requirements with a reason and replacement link; never delete history to make coverage look complete.
3. Update `docs/releases/r3/requirements.json`, `backlog.json` and `tests.json`. Generate `traceability.csv` using `python3 scripts/check-docs.py --write-traceability`.
4. Update implementation status only with evidence: source commit, executed test result, environment and remaining limits. A specification, mock screen, passing fixture calculation or reference test is not application acceptance.
5. Run `python3 scripts/check-docs.py`. For application changes also run the relevant application gates from [development and CI](releases/r3/11-development-ci.md).
6. Record a dated entry in [the changelog](CHANGELOG.md). Significant changes to identity, hosting, evidence, scoring, money or integrations require an ADR.
7. Review the pull-request checklist. Review roles are specified; repository branch protection and required reviewers must be configured by the repository owner if desired. This policy does not claim those server settings exist.

## Status vocabulary

Requirements: `proposed`, `ready`, `in_progress`, `implemented`, `verified`, `deferred`, `retired`.
Application tests: `planned`, `blocked`, `passed`, `failed`, `not_applicable`.
Contracts: `design_baseline`, `frozen_for_slice`, `implemented`, `deprecated`.

`ready` requires settled critical dependencies, acceptance criteria and an implementable contract. `implemented` requires code evidence. `verified` requires acceptance evidence in the intended environment. `passed` requires test evidence and execution date; historical R2 results cannot be assigned to R3 tests.

## Review triggers

| Change | Required documentation |
|---|---|
| New feature or changed behaviour | BRD/FSD as applicable, requirements, backlog, UI, test cases |
| API or event | Versioned schema, examples, compatibility/migration note, consumer tests |
| Stored field or relationship | Data model, new candidate/active migration, retention and access rules |
| Authentication/permissions | Access matrix, threat model, negative tests, operations |
| Model, evaluation method or economics | Protocol version, evidence method, fixtures and reproducibility tests |
| Hosting, recovery or network | HLD/ADR, deployment runbook, infrastructure acceptance evidence |
| New release | Baseline commit, exact checks, deferred items and user-facing release notes |

The automated check runs on pushes and pull requests, checks references/traceability/contracts/fixtures/candidate SQL and enforces a documentation note when relevant application files change. It cannot judge clinical validity, legal compliance or whether prose fully describes a behavioural change. Reviewers remain responsible for semantic accuracy.

## Canonical format and publication

Markdown, JSON, CSV, SQL and SVG in Git are canonical. PDFs and presentations are snapshots and must name the source revision. Sensitive customer data, patient records, live credentials, private incident details and supplier-confidential datasets must never be committed. Use synthetic fixtures and controlled external evidence storage.

Maintain documentation during each future development change. The only unattended writing process is the scheduled agent pickup described in [the delivery process](DELIVERY_PROCESS.md); it opens draft pull requests and never approves or merges them. No automatic approval is implied. The CI gate checks the repository whenever a change is pushed; it does not silently invent or update product decisions.
