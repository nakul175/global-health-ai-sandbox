# Verification report — 25 September 2026

The first programme slice ran as a real FastAPI HTTP server against a separate embedded PostgreSQL process. React was built and served by that application. Tests used synthetic data only.

| Check | Result |
| --- | --- |
| Unit tests | 19 passed |
| HTTP/database/worker integration tests | 23 passed |
| Original baseline smoke tests, adapted for repository path and local transport | 3 passed |
| Browser journeys | 7 passed |
| Migration hash, unchanged replay and tamper refusal | 3 checks passed |
| Local launcher, HTTP readiness, client serving and orderly shutdown | Passed |
| TypeScript and Vite production build | Passed |
| Python lint and frontend formatting | Passed |
| Runtime Python dependency audit | 0 known findings at execution |
| Node dependency audit, including development dependencies | 0 known findings at execution |

**52 automated tests passed; no tests failed or were skipped.** Migration and launcher checks are reported separately. See `application-tests.xml`, `browser-tests.json`, `migrations.json`, `launcher.json` and `validation-summary.json` for machine-readable evidence.

Integration evidence includes foreign-tenant and unassigned-record denial; support-role denial; unsigned/invalid identity rejection; current membership/context revocation; stale/missing ETags; original-response replay after a later edit; changed intent conflicts; bounded body/JSON validation; full payload replacement; purpose-scoped visibility; authenticated cursors; minimal concern intake; hold authority and mutation blocking; immutable snapshot hashes; atomic failure rollback; worker inbox deduplication; and database privilege denial.

Browser journeys cover directory filtering and keyboard navigation, create/validation/edit/persistence, explicit stale-edit reconciliation, evaluator read-only access, institution switching and no persistent token storage, safety intake and mobile/offline behaviour. Automated axe WCAG 2/2.1 A/AA checks reported no violations on the tested directory screens. This does not establish full accessibility conformance or screen-reader compatibility. Desktop, detail and mobile screenshots were visually inspected.

Runtime: Python 3.12.14, Node 24.19.0, PGlite 0.5.8 with PostgreSQL 18.3, Playwright 1.63.0 and Chromium 153.0.8010.0. Chromium came from a separate local `@sparticuz/chromium` 153.0.0 installation because the standard browser CDN returned an unavailable page. The browser binary and local keys are not distributed.

## Not established by these results

- Native PostgreSQL 18.6 network identity, multi-backend races, WAL crash/durability, replication and recovery. The supplied native tests and CI job were not executed here.
- Hosted CI execution, production deployment, real OIDC/PKCE/browser sessions, authentic MFA or person verification.
- Full 456-requirement acceptance, load/SLO/RPO/RTO compliance, penetration testing, operational monitoring and complete accessibility review.
- Medical model accuracy, clinical safety, efficacy, regulatory approval or production use.

The repository deliberately leaves later capabilities disabled. The original reference test assets are archived under `tests/reference` and are not counted in the application pass totals.
