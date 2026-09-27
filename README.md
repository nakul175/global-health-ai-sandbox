# Global Health AI Sandbox — Release 2 technical alpha

Version 0.6.0 · 26 September 2026

**Documentation:** [Complete index](docs/README.md) · [Government adoption R3 specification](docs/releases/r3/README.md) · [Contribution and maintenance rules](CONTRIBUTING.md). R3 is a proposed design baseline, not a deployed feature release.

**Self-service live connections:** In Release 2 workbench → Integrations, configure a public HTTPS JSON endpoint, encrypted credentials and field mappings, run a real test, activate it, and evaluate synthetic audio through your model. JSON service checks are also supported. See [supported contracts, setup and limits](docs/SELF_SERVICE_CONNECTIONS.md). No customer endpoint is preconfigured; full EHR write workflows, OAuth and private-network adapters remain unsupported.

Application-signed evidence, encrypted database/media checkpoints, isolated recovery tooling and measured concurrency checks are now implemented. See [assurance scope and runbook](docs/ASSURANCE_0_5.md) and [current verification](verification/ASSURANCE_0_5_VERIFICATION.md). Institutional signing, independent key escrow, regional recovery and authenticated browser acceptance remain incomplete.

The default screen is now **Release 2 workbench**, with all nine remaining delivery areas represented by working workflows or clearly labelled simulations/unconnected dependencies. Read [the workbench guide](docs/RELEASE_2_WORKBENCH.md) and [its API contract](docs/WORKBENCH_API.md). The earlier lab and governance workflows remain available.

New working capabilities include portable model-package execution, resumable R2 audio uploads, purpose-specific audio grants, manually dispatched durable jobs, registry amendments/merges, participant partitions, paired statistics, audio perturbation tests, evidence corrections and scoped support diagnostics. External connectors, application identities and production infrastructure exercises are clearly marked dummy or simulated.

A persistent application that generates a fictional health ecosystem, evaluates bounded audio models, simulates referrals and laboratory services, and produces reviewed technical evidence. The hosted site is publicly reachable and requires ChatGPT sign-in; each signed-in owner has separate application data. Existing study, data custody, grant, safety and audit workflows remain available.

**This is a bounded synthetic Release 2 implementation, not a clinical service.** Generated waveforms are test signals, not patient coughs. Earlier implementation and verification notes are historical; current scope is recorded in the workbench and assurance guides. The original native implementation is preserved under `native-baseline/`.

## Try it

1. Open the deployed Site and sign in with your ChatGPT account. Each account receives its own synthetic workspace.
2. Choose **Aster** and **Maya Chen**. In **Release 2 lab → Ecosystem**, select **Generate ecosystem**. Defaults create 80 fictional people, three health centres, six clinicians and a laboratory.
3. Browse the registry and download a generated WAV sample. In **Simulation**, choose **Audio reference A**, keep the normal scenario, then start a run.
4. Advance virtual time by **48 hours**. Inspect screened people, referrals, laboratory results, callback events and assertions. Run **Audio reference B** on the same ecosystem and compare results.
5. Try outage, duplicate callback, slow laboratory and lost callback scenarios. In **Evidence**, draft a report as Maya; switch to **Elena Ortiz** to review, issue and download it.
6. To evaluate predictions from your application, switch to **Leo Park**, download the input manifest, run your application outside this Site, and import one probability per synthetic subject. The platform scores those outputs and simulates their downstream journey.

Role switching uses synthetic people controlled by one signed-in owner. It tests workflow rules, not real independent review. Changes persist on the server. This alpha permits six ecosystems and 24 preserved runs per institution; reset starts a new generation but does not erase history. Legacy evaluation and governance workflows remain available in the sidebar.

## Code map

- `app/laboratory.tsx`, `app/laboratory.css`: ecosystem, registry, simulation, comparison and evidence interface.
- `lib/lab.ts`: recipes, deterministic WAV generation, feature extraction, inference, scoring, event simulation, replay and integrity checks.
- `app/workspace.tsx`: responsive test interface, role/context switching, retained form input and conflict review.
- `lib/domain.ts`: closed command schemas, role matrix, workflow gates, strict CSV parser and fixed evaluator.
- `lib/store.ts`: owner/tenant scoping, fixtures, atomic D1 batches, snapshots, audit and idempotency.
- `app/api/`: protected workspace, command, evidence and health routes.
- `db/schema.ts`, `drizzle/`: executable database schema and migration history.
- `tests/`: domain, SQLite integration and live built-Worker HTTP tests.
- `verification/`: executed evidence and testing limits.
- `docs/`: hosted architecture decision, API contract, operations, implementation status and preserved requirement backlog.
- `native-baseline/`: unchanged FastAPI/PostgreSQL programme slice from v0.1.

## Commands

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm test:http
pnpm verify
```

The HTTP harness provisions disposable local D1 databases from all migrations, starts the actual built Worker, runs synthetic fixture requests and stops the Worker. It does not touch hosted records or test hosted sign-in. JUnit and HTTP JSON reports are saved under `verification/`.

The managed hosting workflow publishes the selected source with its exact build archive. Public reachability does not remove sign-in: the dispatcher supplies authenticated identity and storage is separated by owner. Never expose this Worker behind an untrusted proxy that accepts caller-supplied identity headers. A documentation commit to GitHub does not itself deploy a new application version.
