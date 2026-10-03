# Lint cleanup verification — 2026-10-03

Base source: GitHub `main` at `8b4b4b5a4b223773f9b91b7e21b1a0f9f3f295d3`, tree `bd086ab9fdf233a5fdf0fde6f274a668c86fff8d`. The after run used this pull request's code delta on that base. These are new local observations; they do not replace historical release qualification or establish hosted/clinical acceptance.

Environment: Node 24.19.0, pinned pnpm 11.25.0, frozen lockfile, portable Vinext Worker profile. The existing HTTP harness provisions disposable local D1/R2, applies migrations 0000–0003 and uses synthetic owner/role fixtures and throwaway keys. No hosted data or authenticated hosted UI was tested.

| Check | Before | After |
|---|---|---|
| `pnpm lint` | Exit 1: 151 errors, 14 warnings (165 findings) | Exit 0: no findings |
| `pnpm verify` — typecheck | Passed | Passed |
| `pnpm verify` — application tests | 114 passed, 0 failed | 114 passed, 0 failed |
| `pnpm verify` — Worker build | Passed | Passed |
| `pnpm verify` — built Worker HTTP checks | 43 passed, 0 failed | 43 passed, 0 failed |

The unchanged `pnpm verify` sequence runs `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm test:http`. Both complete runs exited 0. The checkpoint tests here exercise only disposable local workspaces and are not a backup of the hosted Site.

Evidence is preserved separately:

- Before: [application XML](before/r2-unit-integration.xml), [HTTP JSON](before/http-tests.json), [bounded local performance observation](before/local-performance.json).
- After: [application XML](after/r2-unit-integration.xml), [HTTP JSON](after/http-tests.json), [bounded local performance observation](after/local-performance.json).

## Behaviour preservation

132 explicit `any` annotations were replaced with projections of existing shapes or `unknown` at external boundaries. The remaining two envelopes in `lib/domain.ts` have local explanatory exceptions: kind-specific record bodies and the already schema-validated command dispatcher. Type annotations and assertions erase; existing guards, closed runtime schemas, validation errors and dispatch remain in place. No global lint rule was disabled.

Existing React initialization/scope resets, explicit Search/Enter fetch timing, mutable request epochs and event-handler ref/clock access retain their ordering through narrowly documented lint exceptions. The connections effect depends on its existing `base` URL derived solely from tenant, preserving the same scope changes. The SQL test adapters retain deferred preparation of the same statement/receiver while removing `this` aliases.

As an additional review, TypeScript transpilation with comments removed was compared for 18 modified TypeScript/TSX files. Fourteen emitted byte-identical JavaScript. The other four differed only in two `let` to `const` bindings, parentheses from erased assertions, and the equivalent connections dependency described above. JavaScript test adapter changes were exercised by the application tests. The native web source changes are comments only; no native API/worker or dependency changed, and native end-to-end tests were not run.

Documentation checks: `python3 scripts/check-docs.py` and `python3 scripts/check-current-docs.py`. Historical reports under `verification/` remain unchanged. No requirement or planned-case status is promoted by this cleanup.
