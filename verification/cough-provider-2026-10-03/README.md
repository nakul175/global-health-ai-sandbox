# Independent synthetic cough provider verification

3 October 2026. Main source base `8b4b4b5a4b223773f9b91b7e21b1a0f9f3f295d3`; feature branch `codex/independent-cough-provider-20261003`. Node 24.19.0, pnpm 11.25.0, frozen lock, portable Vinext Worker, isolated local D1/R2 and throwaway fixture credentials. No hosted provider dispatch, deployment, data import or customer activation.

| Check | Result | Retained report |
| --- | --- | --- |
| Frozen dependency install | exit 0; package and lock unchanged | Existing pinned package/lock |
| Type check and portable build | exit 0 | Ordered `pnpm verify` |
| Application suites | 128 cases, 0 failures (114 existing plus 14 new cases) | [JUnit](unit.xml) |
| Existing Worker HTTP suite | 43 passed, 0 failed | [HTTP](existing-http.json) |
| New provider Worker HTTP suite | 14 passed, 0 failed | [HTTP](provider-http.json) |
| Targeted ESLint on new service modules/page/routes | 0 errors/warnings | Command below |

The silence test initially found an accidental copy of the waveform payload; the final code zeros the actual payload. The HTTP run also exposed inconsistent early-rejection connection handling; the final routes drain bounded unread POST bodies. Final verification passed after these fixes. No historical report or applied migration was rewritten; fresh reports above are separate from the preserved R2 evidence.

Reproduce with `pnpm install --frozen-lockfile` then `pnpm verify`. The ordered pipeline now includes `tests/cough-http.mjs` after the existing HTTP suite; it creates its own migrated local state and stops its Worker. Targeted lint: `pnpm exec eslint lib/cough-contract.ts lib/cough-provider.ts lib/cough-http.ts app/cough-partners/page.tsx app/api/cough-partners/route.ts app/api/cough/v1 --ignore-pattern dist`.

Covered: exact contract/specification, true waveform features, silence refusal, signature/binding/quality negatives, owner/customer separation, suspended/default-disabled configuration, optimistic agreements, same-input replay, changed-input denial, committed reservation before computation, interrupted pending, GET without recomputation, concurrent quota/duplicate cases, in-flight hold/pause withholding, streaming bounds, encrypted ledger recovery and older archive compatibility. These are synthetic engineering checks; clinical, hosted identity/egress, institutional independence, legal permission for real data and regional recovery remain unverified.
