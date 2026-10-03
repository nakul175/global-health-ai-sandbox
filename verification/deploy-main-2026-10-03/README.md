# Hosted source audit and prepared deployment — 2026-10-03

Status: **prepared, not deployed**. This record must not be read as a successful production deployment. Complete and verify the hosted checkpoint before deploying, then append the actual deployment ID, terminal status, timestamp and post-deployment observations to this record and the changelog.

## Live source

The existing `.openai/hosting.json` selects Site `appgprj_6ab66a581574819184777e2e9d3f28b3`, D1 binding `DB` and R2 binding `MEDIA`. The Site is publicly reachable at <https://global-health-ai-sandbox.nakul1729233.chatgpt.site> and application workspaces require ChatGPT sign-in. Audience and protected runtime configuration were not changed.

- Live saved version: 5, `appgprj_6ab66a581574819184777e2e9d3f28b3~appgver_51c37fab9b888191a319bf425ea0224b`.
- Live Site source: `8a08831be002da80b0cdf6e4ec43d8fadcb02310`.
- Successful deployment: `appgdep_6ab813d5e8808191af378ebc82073d92`, updated `2026-09-26T18:50:54.330489+00:00`.
- PR #13 merge: `870b49a343f1207b8cefbecdbfb0c5c5d10c955a`. The live source omits its hosted review fixes and predates that PR. The owner was told this before redeployment preparation.

GitHub and the Site use separate source histories; matching source trees, rather than equal commit identifiers, establish the candidate below.

## Verified and saved candidate

| Identity | Value |
|---|---|
| GitHub `main` | `8b4b4b5a4b223773f9b91b7e21b1a0f9f3f295d3` |
| Exact source tree (both repositories) | `bd086ab9fdf233a5fdf0fde6f274a668c86fff8d` |
| Pushed Site source | `542ae40320d1c4bea19c64799cf9128210242225` |
| Saved version | 6 |
| Saved version ID | `appgprj_6ab66a581574819184777e2e9d3f28b3~appgver_36c53a7b4f0081919d28782c9bfa7af1` |
| Build archive SHA-256 | `3e800e09598e2bf3823117e514cfe21bfcb1f570454715011aa3062871898db9` |
| New deployment ID | None; deployment was not requested |

The existing Sites `site-workflow.mjs` pushed the exact candidate and packaged the local Worker build; `save_site_version` saved it without deployment. The lint and terms branches are not part of this source tree. A later merge of this audit document will not itself publish the Site.

`pnpm install --frozen-lockfile` and `pnpm verify` passed on that exact candidate. Environment: Node 24.19.0, pnpm 11.25.0, portable Vinext Worker. Typecheck/build passed, 114 application tests passed and 43 built Worker HTTP checks passed, with zero failures. Fixtures use disposable local D1/R2 and synthetic owners/roles. Evidence: [application XML](r2-unit-integration.xml), [HTTP checks](http-tests.json), [local performance observation](local-performance.json). These checks do not establish authenticated hosted acceptance or a hosted backup.

## Compatibility and remaining gate

The deployed migration bytes and journal order 0000–0003 are unchanged in the candidate:

| Migration | SHA-256 |
|---|---|
| `0000_messy_war_machine.sql` | `8fc84930e30e1a904c5b7b5d14682aad3843b08c70e3779d9adcc5c2ac8a1bf6` |
| `0001_long_young_avengers.sql` | `0db7df0abe9519ea170234b60fc7af45e23671a8cdcf500cee82e0429e7e24c2` |
| `0002_amazing_silhouette.sql` | `138b1d5bb5c2199c16473ba2ec93bc6f2fb166b536a0975bb28e2043fb137488` |
| `0003_easy_hammerhead.sql` | `7069058239efaefbf9d7145ae08028c3bfb50fca96c1b62e4e57ce20ebdc1e1c` |

Read-only hosted D1 inspection confirmed the eleven current application tables and an existing workspace. No hosted row/media content is copied into this record. Protected runtime metadata declares `CHECKPOINT_KEY_HEX` and `EVIDENCE_SIGNING_JWK`; their values are redacted and were not read or changed. Declaration alone does not verify that a checkpoint can be created or that signing succeeds.

[Next delivery](../../docs/NEXT-DELIVERY.md) explicitly requires, before any deployment, compatible migrations/bindings/secrets, capture/verification of a checkpoint and a rollback choice. The [operations guide](../../docs/current/OPERATIONS-GUIDE.md) requires an encrypted administrator checkpoint with verification. Sites' connector can inspect the database but does not expose that application checkpoint operation. Browser access reached the owner's Google sign-in; checkpoint capture/verification remains unexecuted pending authentication. No authentication bypass was introduced.

Rollback choice: redeploy the existing saved version 5 above, retaining the additive schema, objects and compatible secrets. No table/media deletion or secret rotation is authorized by this record. After a successful candidate deployment, verify the live version/source and authenticated owner-scoped smoke checks, and record observed outcomes; do not infer these from local tests.

Documentation checks: `python3 scripts/check-docs.py` and `python3 scripts/check-current-docs.py`. Requirement/case statuses and historical evidence are unchanged.
