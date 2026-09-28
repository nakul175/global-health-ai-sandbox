# Data governance and authority boundaries

Edition 1.1. This is an implementation/control record, not a jurisdictional compliance determination.

| Data class | Current handling | Decision still required |
|---|---|---|
| Owner identity | Supplied by trusted hosting dispatcher; storage scope derived server-side | Real institutional identity/membership and recovery |
| Synthetic patient/service records | Fictional generated identifiers, provenance, controlled views and generation history | Clinical-data activation is separate; a synthetic flag alone does not prove provenance |
| Reference labels | Excluded from ordinary projections and inference arguments | Independent scorer/vault and protected reference governance |
| Uploaded synthetic WAV | Bounded canonical bytes, hashes, quarantine, custody release and distinct grants | Malware scanning, expanded data classes and retention schedule |
| Provider credentials | Scope-bound encrypted envelopes; masked projections and safe error handling | Independent key management, escrow and deployment-specific egress review |
| Supplier/commercial information | No real government supplier domain in current alpha | R3 assignment/field policy, neutrality and authorised sharing |
| Evidence and audit | Version/digest provenance, exact issued bytes, correction/withdrawal metadata, scoped audit | Institutional authority, external audit durability and approved disclosure |
| Checkpoints | Encrypted database/media archive with isolated restore | Independent backup/key retention, legal holds and measured regional recovery |

Do not put patient data, credentials or supplier-confidential artifacts in Git, test fixtures, tickets or documentation. Keep assumptions, synthetic evidence, supplier declarations and measured observations distinguishable. R3 requires explicit rights and environment review before patient-level data use.

The initial jurisdiction, customer policy, retention/disposal schedule, legal holds, data-location controls, support responsibilities, incident reporting and public disclosure approvals remain open. No statutory retention duration, compliance certification or government endorsement is invented. Resolve the [decision register](../releases/r3/16-decisions-and-release-gates.md) with actual institutional owners.

Cross-agency sharing and government/private hosting are R3C proposals. Revocation can prevent future access but cannot recall already-downloaded copies; the sharing design must disclose that limitation. The current alpha is owner scoped and does not deliver that sharing workflow.
