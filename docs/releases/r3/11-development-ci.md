# Development environment and CI

Status: specification plus a documentation CI workflow. Current application dependency pins are authoritative in root `package.json` and `pnpm-lock.yaml`; do not invent a new dependency stack for documentation.

## Existing application baseline

At this audit: application v0.6.0, Node >=22.13.0, pnpm 11.25.0; React 19.2.6, TypeScript 5.9.3, Drizzle 0.45.2, Wrangler 4.92.0 and the existing Sites build integration. Semver ranges in package.json are resolved by the checked-in lockfile. A future application runtime pin/update requires its own reviewed change and lockfile verification.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm test:http
python3 scripts/check-docs.py
```

Documentation checks use Python 3.12 in CI (Python 3.10+ locally) and the standard library. They require no credentials, model endpoint, database service or package installation. They validate the pack, calculate reference fixtures and apply candidate SQL in memory. Application tests require the actual project dependencies and disposable services documented in the existing runtime.

## R3 environment boundaries

Development uses synthetic fixtures, local database/object-store emulation and a controlled HTTP receiver. Staging has its own institution identities, keys, database, queue and storage. Production credentials and patient data are never copied to development. Test identity injection is allowed only in isolated test harnesses and must not be reachable in a deployed build.

| Configuration | Purpose | Treatment |
|---|---|---|
| `GOV_IDENTITY_ISSUER`, `GOV_IDENTITY_AUDIENCE` | Validated institutional identity | Non-secret deployment configuration |
| `GOV_ALLOWED_ORIGINS` | Browser CSRF boundary | Exact allow-list, no wildcard with credentials |
| `GOV_DATABASE`, `GOV_ARTIFACTS`, `GOV_JOBS` | Database/storage/queue bindings | Provisioned per environment |
| `GOV_SECRET_KEY_REF` | Encryption/signing key reference | Secret-manager reference; no key bytes in repository |
| `GOV_EGRESS_POLICY_REF` | Approved destinations and adapter policy | Reviewed configuration version |
| `GOV_AUDIT_SINK_REF` | Independent operational audit destination | Access-controlled deployment binding |
| `GOV_FEATURE_STAGE` | Disabled/R3A/R3B/R3C feature activation | Server-enforced, never a browser-only flag |

These are proposed configuration names. They do not currently provision services or add environment support to the v0.6.0 runtime.

## Automated documentation gate

The repository workflow runs on pull requests and pushes. It checks local Markdown links, JSON parsing, unique requirement/test/package IDs, dependency cycles, complete traceability, closed OpenAPI/event objects, local schema references, required example fields, fixture arithmetic and candidate migration invariants. A relevant application change requires a documentation change note in the same diff; semantic review remains manual.

The workflow uses read-only repository permissions and no deployment secrets. It does not deploy the website, send messages or approve a release. If repository settings disable Actions, the local command remains runnable and remote enforcement is reported as unavailable until enabled.

## Application CI required during R3 implementation

Typecheck/lint → unit/contract → disposable database integration → build → built-application HTTP → authenticated browser acceptance → dependency/security scans → release-specific NFR gates. Publish test reports with the tested commit, environment and fixture version. Reuse existing verification harnesses where appropriate; new tests must cover changed risks rather than repeat implementation line by line.

Use a lockfile, minimal token permissions and pinned action revisions. Configure branch protection/required reviewers separately with owner authorisation; merely writing a workflow does not turn it into a required merge check. Do not use `pull_request_target` to run untrusted submitted code with secrets.
