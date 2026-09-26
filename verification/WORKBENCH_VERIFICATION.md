# Release 2 workbench verification — 0.4.0

Executed 26 September 2026 against the application source and built Worker with `pnpm verify`.

| Gate | Result |
|---|---|
| TypeScript | Passed |
| Unit and SQLite integration | 79 passed, zero failed |
| Production Worker/client build | Passed |
| Built-Worker HTTP, integration and smoke | 32 passed, zero failed |
| Authenticated interactive browser journey | Not executed |
| Hosted acceptance | Requires owner testing; publication alone does not establish application acceptance |

Machine-readable evidence: `r2-unit-integration.xml` and `http-tests.json`. These files now contain the 0.4.0 results and supersede the report counts in the historical 0.3.0 verification note.

Additional coverage includes closed portable forest contracts and real execution, lease ownership and expiry, retry/cancel and transaction rollback, generation fencing, registry amendments and merges, deterministic partitions, paired statistics, waveform perturbation, access grants, custody separation, evidence supersession and explicit simulation labels.

The HTTP suite provisions disposable local D1 and object storage and runs the built application. It verifies actual multipart audio bytes and SHA-256, interrupted-upload recovery, invalid chunks and incomplete finalisation, quarantine/release, separate playback/export/inference grants, real inference on uploaded bytes, cross-tenant denial, holds and revocation, internal command forgery denial and scoped diagnostics. Local dispatcher identities are test fixtures, not hosted authentication credentials.

These 111 checks do not establish clinical performance, production load, accessibility conformance, security certification, real institutional identity, external connector interoperability, malware scanning, cryptographic signing, regional failover or disaster recovery. No authenticated browser journey or live external service test was performed. The in-process backup exercise is a metadata serialization roundtrip, not database/media restoration. The capability register records all 81 requirements without claiming full production closure.
