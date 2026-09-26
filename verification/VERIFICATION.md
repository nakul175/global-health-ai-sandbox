# Verification — hosted test edition 0.2.0

Historical baseline report. See [RELEASE_2_VERIFICATION.md](RELEASE_2_VERIFICATION.md) for the current v0.3.0 execution and current `http-tests.json` results.

25 September 2026. These results apply to the hosted adapter, not to the full source requirement catalogue.

- 29 automated domain / SQLite integration checks: closed command schemas, CSV validation, known metric values, missing-denominator semantics, seed stability, owner/tenant isolation, role denials, atomic snapshots/audit/receipts, idempotency, stale and concurrent writes, transaction failure rollback, same-person alias rejection, exact protocol resubmission, quarantine/custody, execution gates, revocation, evidence hashes, safety overlays, membership controls, synthetic onboarding and database constraints.
- 13 built-Worker HTTP checks, including 3 smoke checks: real local D1 migrations/readiness, signed-out denials, authenticated application HTML, scoped fixture projection, Origin/content-type/precondition validation, actual evaluation, evidence issuance and exact download hash, hold/concern/resume, grant revocation, cross-tenant projection and audit continuity.
- TypeScript compile and Worker/client production build: passed.
- Signed-out internal browser view: rendered and inspected; no application console errors observed.

The SQLite adapter executes real SQL and transactions but is not a hosted D1 availability, replication or disaster-recovery test. The HTTP suite executes the built Worker against the local D1 runtime, with synthetic test identity headers representing dispatcher input. Those headers are not hosted credentials and no hosted login bypass is implemented.

Authenticated browser interactions, mobile/device behaviour and full accessibility checks were not executed: the internal browser preview cannot complete the hosted ChatGPT sign-in flow. The browser inspected only the signed-out view. Live-site login is left to the owning user. The native hosting service's successful deployment status supplies publication verification, not full application acceptance.

No production load, penetration, recovery, external OIDC, clinical, regulatory or independent human review acceptance has been completed. The earlier 52 passing tests in `native-baseline/verification` are separate evidence for v0.1 and are not added to this edition's count.
