# Documentation and reference verification

Date: 2026-09-26. Scope: R3 design baseline 1.0.0. Command: `python3 scripts/check-docs.py` from repository root. The Git commit containing this file identifies the exact documentation revision.

## Checks in this delivery

- Unique and bidirectional requirement/package/test mappings; dependency-cycle checks; generated CSV traceability.
- Local Markdown links, JSON syntax and SVG XML structure.
- Closed nested OpenAPI/event object schemas, local references, route parameters, write idempotency, update preconditions and typed examples.
- Typed synthetic resource fixtures and SQL-seeded payloads checked against the design schemas.
- Independent decimal recalculation of synthetic classification metrics, annual programme costs, funding gaps and rounding.
- Candidate migration and seed applied to disposable in-memory SQLite; foreign-key integrity verified.
- Nine database rejection cases: cross-org parent, wrong parent type, invalid object status, issued payload mutation, unfreezing a protocol, skipped version, protected deletion, self-approval and duplicate observation.

The validator implements the JSON Schema vocabulary used by this pack. It is not a general OpenAPI compliance tool, clinical statistical review, penetration test or production benchmark.

## Explicit limits

R3 application tests executed: **0**. All new application cases are planned. No feature was deployed, no active migration was applied, no patient data was processed and no national service was connected by this documentation change. The earlier v0.6.0 application verification remains separately recorded in [the existing verification report](../../../verification/CONNECTIONS_0_6_VERIFICATION.md).

The GitHub workflow runs the same documentation checks on pushes and pull requests. Its run status is external evidence; this document does not claim repository branch-protection rules were configured or that a future workflow run passed before it occurred.
