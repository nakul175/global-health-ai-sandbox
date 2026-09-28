# Next delivery and unresolved work

Edition 1.1. Starting source: 870b49a343f1207b8cefbecdbfb0c5c5d10c955a. The current product is the v0.6 synthetic alpha with later repository fixes. Proposed government R3 has not started. Development dates, staffing and customer decisions are not assigned here.

## Prepare the existing alpha for a new candidate

1. Correct the three stale in-product explanatory areas recorded in [Implementation](IMPLEMENTATION.md): the old testing-guide exclusions, remote-model panel and V2-SEC-005 secret description. Retain accurate unavailable/partial/simulated labels.
2. Run the built-Worker HTTP suite on the candidate including PR #13's new cases. Record source, environment and machine results; do not overwrite historical reports without retaining their provenance.
3. Exercise authenticated hosted user journeys using an actual owner. Verify sign-in, persistence, role switching, media upload/grants, evidence/signature and error recovery. Native-profile browser results do not substitute.
4. Before any deployment, verify compatible migrations, bindings and secrets, capture/verify a checkpoint and record rollback choice. Requalification/deployment is separate from this documentation publication.

## First government vertical slice

Resolve the institution/identity and deployment/data-class decisions needed by WP-GOV-01 and WP-GOV-12. Establish distinct real people and organisation ownership before presenting synthetic profile switching as independent review.

Then implement programme/context and supplier isolation, frozen protocol/comparison, deterministic economics and independent evidence export. The reviewable outcome is two organisations and distinct users; three synthetic supplier submissions; a versioned district profile; a frozen comparison; a three-year funding case; another reviewer; and a committee pack. Demonstrate cross-organisation/vendor denial, self-approval rejection, stale-write preservation and immutable evidence.

The first slice may use bounded built-in models. A missing customer endpoint must remain blocked and cannot silently become a successful dummy evaluation. Candidate R3 SQL is not an active migration.

| Stage | Packages | Gate |
|---|---|---|
| Foundation | WP-GOV-01 identity/policy; WP-GOV-12 assurance | Two real users, organisation/vendor boundaries, migration/audit/CI |
| Context and suppliers | WP-GOV-02, WP-GOV-03 | Versioned local context, sourced assumptions and isolated submissions |
| Evaluation and costs | WP-GOV-04, WP-GOV-05 | Frozen cohorts, complete denominators, reproducible runs and reconciled currency/funding |
| Decision | WP-GOV-06 | Independent exact-version review and controlled PDF/DOCX/XLSX/JSON export |
| R3B | WP-GOV-07, WP-GOV-08 | Selected actual national sandbox and monitored pilot with failure/recovery evidence |
| R3C | WP-GOV-09–11 | Approved evidence reuse, portfolio and separately verified hosting profile |

Exact [requirements](releases/r3/requirements.json), [packages](releases/r3/backlog.json), [tests](releases/r3/tests.json) and [open decisions](releases/r3/16-decisions-and-release-gates.md) remain canonical. Keep original catalogues and release assignments intact.

## Documentation recovery

Original BRD/FSD Word files and earlier standalone HLD/LLD/wireframe binaries are not present in the repository. Their absence is recorded in [history](history/README.md). The current detailed BRD/FSD reading editions recover all retained structured requirements and acceptance text; they are not claimed to be the missing original files. Add originals with provenance if recovered, without replacing the current edition or rewriting history.
