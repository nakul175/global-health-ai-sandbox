# Agent-assisted delivery process

Effective: 2026-09-27. Owner: product lead (the only human approver). Status: process baseline; no delivery run has been executed yet.

This repository uses a small team of Claude agents to move GitHub issues from request to pull request. Agents prepare work; they never approve, merge or deploy it. The two human gates below are the only approvals.

## Flow

| Step | Who | Trigger label | Result label |
|---|---|---|---|
| 1. Request | Product owner raises a Bug or Change Request issue using the forms | — | `status:new` |
| 2. Specify | `spec-writer` agent posts a specification comment with acceptance criteria | `status:new` | `status:spec-review` or `status:needs-input` |
| **Gate 1** | **Product owner approves the specification** by applying the label | `status:spec-review` | `status:ready` |
| 3. Build | `builder` agent implements on branch `delivery/issue-<n>-<slug>` | `status:ready` | `status:in-progress` |
| 4. Verify | `verifier` agent runs the quality gates and reports exact results | — | — |
| 5. Review | `independent-reviewer` agent reviews the diff against the spec, without the builder's reasoning | — | — |
| 6. Fix loop | Builder addresses findings; steps 4–5 repeat, at most two extra rounds | — | `status:blocked` if unresolved |
| 7. Package | `release-steward` agent completes changelog, traceability and the PR checklist, then a draft pull request is opened | — | `status:in-review` |
| **Gate 2** | **Product owner reviews and merges the pull request** | — | issue closed by `Closes #<n>` |

Agent definitions live in `.claude/agents/`. Each has restricted tools: the specification writer and independent reviewer are read-only; the verifier can run commands but must not change files; only the builder edits application code; the release steward edits documentation only.

## Automatic pickup

A scheduled Claude task runs on a fixed schedule against this repository. On each run it:

1. Handles every `status:new` issue (specification only).
2. Picks the oldest `status:ready` issue and runs steps 3–7 for that one issue.
3. Comments on each issue it touched and does nothing else.

The scheduled run opens pull requests as **drafts**. It never merges, approves, deploys, pushes to `main`, changes repository settings or edits deployed migrations. An issue that needs a human decision is labelled `status:needs-input` with the question in a comment. This is the only unattended writing process in the repository; see [the documentation policy](DOCUMENTATION_POLICY.md).

## Labels

- Type: `type:bug`, `type:change-request`
- Severity: `sev:critical`, `sev:high`, `sev:medium`, `sev:low`
- Status: `status:new`, `status:spec-review`, `status:needs-input`, `status:ready`, `status:in-progress`, `status:blocked`, `status:in-review`

## Quality gates

`.github/workflows/quality.yml` runs typecheck and tests on every pull request and on pushes to `main`, and blocks lint errors in changed files. The full-repository lint is reported but not yet blocking, because the existing code base carries lint debt (152 errors on 2026-09-27); the "changed files" gate stops that debt growing. `.github/workflows/documentation.yml` continues to enforce documentation integrity.

These workflows only block merges if the repository owner turns on branch protection for `main` and marks both checks as required. This document does not claim that setting exists.

## Known limits

- Agents are the same model family reviewing each other. The independent reviewer reduces, but does not remove, shared blind spots. Security-sensitive changes still need a human or external review.
- The built-application HTTP harness and native-baseline database tests are not part of the automated gates yet.
- Agent output is not clinical, legal or regulatory review.
