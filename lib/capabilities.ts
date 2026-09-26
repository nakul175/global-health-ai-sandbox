// Generated from the preserved Release 2 requirement catalogue. Status describes this hosted adapter.
export const capabilities = [
  {
    "id": "V2-SYN-001",
    "title": "Closed recipe validation",
    "requirement": "The generator shall reject undeclared fields, invalid ranges and infeasible exact quotas before publishing any records.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-SYN-002",
    "title": "Deterministic connected records",
    "requirement": "Generation shall pin algorithm, template, seed and canonical ordering, with stable logical IDs independent of worker order.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-SYN-003",
    "title": "Referential and temporal integrity",
    "requirement": "Every generated relation and time sequence shall satisfy the published template constraints.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-SYN-004",
    "title": "Distribution and quota reporting",
    "requirement": "Generation shall distinguish exact allocations from sampled distributions and report realised counts.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-SYN-005",
    "title": "Synthetic identity namespace",
    "requirement": "The default generator shall emit reserved fictional identities and non routable contact destinations.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-SYN-006",
    "title": "Origin and mixed lineage",
    "requirement": "Every generated resource shall carry synthetic origin and recipe lineage; mixed inputs shall retain per asset classification.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-SYN-007",
    "title": "Atomic publication",
    "requirement": "A generation job shall stage records and publish only a complete validated snapshot.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-SYN-008",
    "title": "Technical audio boundary",
    "requirement": "Generated technical audio shall be marked as a compatibility fixture and shall not create clinical accuracy evidence.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-SYN-009",
    "title": "Recipe suggestion review",
    "requirement": "AI assisted recipe drafts shall use allowlisted schema fields and require authorised publication.",
    "mode": "simulated",
    "detail": "Three editable population/service presets stand in for an AI recipe adviser. No generative model or clinical distribution approval."
  },
  {
    "id": "V2-SYN-010",
    "title": "Snapshot lifecycle",
    "requirement": "Users shall inspect, fork, archive and reproduce authorised snapshots without changing prior evidence.",
    "mode": "partial",
    "detail": "Working seeded generator, exact quotas, lineage and service templates. Rich clinical distributions and mixed-data provenance remain unavailable."
  },
  {
    "id": "V2-REG-001",
    "title": "Capability declaration",
    "requirement": "Each registry profile shall declare resource types, operations, searches, schema version and limitations.",
    "mode": "partial",
    "detail": "Working synthetic registry reads, amendments, merges and linked service results. FHIR conformance and external terminology are not connected."
  },
  {
    "id": "V2-REG-002",
    "title": "Scoped state and revisions",
    "requirement": "Registry writes shall enforce tenant, project, environment generation, profile and resource revision.",
    "mode": "partial",
    "detail": "Working synthetic registry reads, amendments, merges and linked service results. FHIR conformance and external terminology are not connected."
  },
  {
    "id": "V2-REG-003",
    "title": "Patient relationships and merge",
    "requirement": "The patient profile shall support scoped duplicate detection and explicit alias or merge history without guessing identity.",
    "mode": "partial",
    "detail": "Working synthetic registry reads, amendments, merges and linked service results. FHIR conformance and external terminology are not connected."
  },
  {
    "id": "V2-REG-004",
    "title": "Lab and referral lifecycle",
    "requirement": "Supported lab and referral transitions shall maintain order, result, correction and referral lineage.",
    "mode": "partial",
    "detail": "Working synthetic registry reads, amendments, merges and linked service results. FHIR conformance and external terminology are not connected."
  },
  {
    "id": "V2-REG-005",
    "title": "Simulated policy separation",
    "requirement": "Simulated consent and identity profiles shall test application behaviour without influencing platform authorisation.",
    "mode": "simulated",
    "detail": "Test-person roles and internal policy scenarios; no real health-system authorisation is inferred."
  },
  {
    "id": "V2-REG-006",
    "title": "FHIR profile conformance",
    "requirement": "An advertised FHIR endpoint shall implement only its pinned, tested profile with standard response conventions.",
    "mode": "simulated",
    "detail": "Seven FHIR-shaped resource types and example hospital connector. Not a validated FHIR server or certified profile."
  },
  {
    "id": "V2-REG-007",
    "title": "Safe external effects",
    "requirement": "Synthetic messages, identities and fault traffic shall remain within approved test bindings.",
    "mode": "simulated",
    "detail": "Callbacks terminate in the local fixture sink; dummy connectors cannot contact a patient, hospital or laboratory."
  },
  {
    "id": "V2-SCN-001",
    "title": "Frozen scenario plan",
    "requirement": "A scenario shall freeze snapshot, bindings, steps, faults, clock policy and assertions as one immutable version.",
    "mode": "partial",
    "detail": "Working deterministic internal scenarios, virtual clocks, assertions, replay and generation fences. External delivery remains simulated."
  },
  {
    "id": "V2-SCN-002",
    "title": "Separate clocks",
    "requirement": "Virtual time shall control simulated events while wall time controls credentials, leases, quotas and grants.",
    "mode": "partial",
    "detail": "Working deterministic internal scenarios, virtual clocks, assertions, replay and generation fences. External delivery remains simulated."
  },
  {
    "id": "V2-SCN-003",
    "title": "Deterministic event ordering",
    "requirement": "Events shall order by virtual due time, service sequence and event ID under a versioned algorithm.",
    "mode": "partial",
    "detail": "Working deterministic internal scenarios, virtual clocks, assertions, replay and generation fences. External delivery remains simulated."
  },
  {
    "id": "V2-SCN-004",
    "title": "Fault phase and duplicate effect",
    "requirement": "Fault recipes shall specify deterministic occurrence and whether failure happens before or after business commit.",
    "mode": "partial",
    "detail": "Working deterministic internal scenarios, virtual clocks, assertions, replay and generation fences. External delivery remains simulated."
  },
  {
    "id": "V2-SCN-005",
    "title": "Generation fenced reset",
    "requirement": "Reset shall create a new generation, revoke old credentials and reject stale callbacks.",
    "mode": "partial",
    "detail": "Working deterministic internal scenarios, virtual clocks, assertions, replay and generation fences. External delivery remains simulated."
  },
  {
    "id": "V2-SCN-006",
    "title": "Assertion semantics",
    "requirement": "Assertions shall distinguish exact count, eventual state, invariant and absent effect with bounded deadlines.",
    "mode": "partial",
    "detail": "Working deterministic internal scenarios, virtual clocks, assertions, replay and generation fences. External delivery remains simulated."
  },
  {
    "id": "V2-SCN-007",
    "title": "Consistent snapshots",
    "requirement": "Snapshot capture shall preserve state, event cursor, pending callbacks and virtual clock consistently.",
    "mode": "partial",
    "detail": "Working deterministic internal scenarios, virtual clocks, assertions, replay and generation fences. External delivery remains simulated."
  },
  {
    "id": "V2-SCN-008",
    "title": "Concurrent scenario isolation",
    "requirement": "Concurrent scenarios shall fork isolated state unless shared state testing is explicitly selected.",
    "mode": "partial",
    "detail": "Working deterministic internal scenarios, virtual clocks, assertions, replay and generation fences. External delivery remains simulated."
  },
  {
    "id": "V2-MOD-001",
    "title": "Immutable model identity",
    "requirement": "A model version shall bind package, preprocessing, postprocessing, runtime, input and output digests.",
    "mode": "partial",
    "detail": "Working portable JSON forest admission and actual audio execution. Live JSON prediction connections now execute on bounded synthetic audio. Arbitrary containers and GPU execution remain unconnected."
  },
  {
    "id": "V2-MOD-002",
    "title": "Admission and dry run",
    "requirement": "Only packages that pass integrity, contract, resource and isolation admission shall become runnable.",
    "mode": "partial",
    "detail": "Working portable JSON forest admission and actual audio execution. Live JSON prediction connections now execute on bounded synthetic audio. Arbitrary containers and GPU execution remain unconnected."
  },
  {
    "id": "V2-MOD-003",
    "title": "Actual audio inference",
    "requirement": "The platform shall execute the admitted package on permitted audio rather than substituting a fixed internal model.",
    "mode": "partial",
    "detail": "Working portable JSON forest admission and actual audio execution. Live JSON prediction connections now execute on bounded synthetic audio. Arbitrary containers and GPU execution remain unconnected."
  },
  {
    "id": "V2-MOD-004",
    "title": "Approved remote inference",
    "requirement": "Remote adapters shall enforce destination, region, current data rights, secret scope and version declaration.",
    "mode": "partial",
    "detail": "Self-service live HTTPS JSON prediction adapters, encrypted credentials, field mapping, real tests and activation. Synthetic inputs only; region enforcement and independently pinned provider model versions remain incomplete."
  },
  {
    "id": "V2-MOD-005",
    "title": "Evidence scope labelling",
    "requirement": "Prediction import, stub responses, local model execution and remote service execution shall be labelled distinctly.",
    "mode": "partial",
    "detail": "Working portable JSON forest admission and actual audio execution. Live JSON prediction connections now execute on bounded synthetic audio. Arbitrary containers and GPU execution remain unconnected."
  },
  {
    "id": "V2-MOD-006",
    "title": "Application and device identity",
    "requirement": "Application tests shall bind build digest, model binding, device or emulator profile and exercised path.",
    "mode": "simulated",
    "detail": "Revocable dummy application/device identity records. No actual device emulator, build attestation or hosted API credential."
  },
  {
    "id": "V2-DAT-001",
    "title": "Resumable integrity",
    "requirement": "Audio transfer shall preserve the baseline chunk protocol with per part and final integrity checks and current rights.",
    "mode": "partial",
    "detail": "Working R2 chunk storage, SHA-256 verification, bounded PCM16 decode, quarantine and playback/export grants. Synthetic inputs only."
  },
  {
    "id": "V2-DAT-002",
    "title": "Quarantine and decoder limits",
    "requirement": "Audio shall remain unavailable until scanner, bounded decode and release checks succeed.",
    "mode": "partial",
    "detail": "Actual bounded WAV decoder and quarantine/release. Malware scanner explicitly marked STUB and only synthetic data may be released."
  },
  {
    "id": "V2-DAT-003",
    "title": "Explicit transforms",
    "requirement": "Raw audio shall remain immutable and any conversion shall carry a versioned recipe and derived digest.",
    "mode": "partial",
    "detail": "Working R2 chunk storage, SHA-256 verification, bounded PCM16 decode, quarantine and playback/export grants. Synthetic inputs only."
  },
  {
    "id": "V2-DAT-004",
    "title": "Restricted references",
    "requirement": "The model and simulator shall not read restricted labels or label revealing metadata.",
    "mode": "unavailable",
    "detail": "Labels are excluded from model arguments/API projections but share the process/database. Physically restricted scoring infrastructure is not provisioned."
  },
  {
    "id": "V2-DAT-005",
    "title": "Participant partitions",
    "requirement": "Known participant grouping and approved duplicate checks shall inform partitions and report unresolved overlap.",
    "mode": "partial",
    "detail": "Working same-person merge, deterministic participant partitions and exact prediction joins within one synthetic ecosystem. Cross-dataset identity and clinical split approval are not implemented."
  },
  {
    "id": "V2-DAT-006",
    "title": "Purpose and playback",
    "requirement": "Audio read, playback, inference and export shall require separate applicable permissions and current grants.",
    "mode": "partial",
    "detail": "Working R2 chunk storage, SHA-256 verification, bounded PCM16 decode, quarantine and playback/export grants. Synthetic inputs only."
  },
  {
    "id": "V2-VAL-001",
    "title": "Protocol freeze",
    "requirement": "Evaluation shall bind immutable reference definition, data release, sampling unit, threshold and analysis method.",
    "mode": "partial",
    "detail": "Computed synthetic metrics, Wilson intervals, paired bootstrap/McNemar comparison and waveform perturbation tests. No clinical validity claim."
  },
  {
    "id": "V2-VAL-002",
    "title": "Complete denominators",
    "requirement": "The scorer shall account for every eligible unit and distinguish failure, abstention and missing reference.",
    "mode": "partial",
    "detail": "Computed synthetic metrics, Wilson intervals, paired bootstrap/McNemar comparison and waveform perturbation tests. No clinical validity claim."
  },
  {
    "id": "V2-VAL-003",
    "title": "Undefined measures",
    "requirement": "Unavailable metrics shall carry a not estimable reason rather than zero or fabricated confidence.",
    "mode": "partial",
    "detail": "Computed synthetic metrics, Wilson intervals, paired bootstrap/McNemar comparison and waveform perturbation tests. No clinical validity claim."
  },
  {
    "id": "V2-VAL-004",
    "title": "Uncertainty calculation",
    "requirement": "Intervals shall use the declared sampling unit, method, seed, replicate count and invalid replicate policy.",
    "mode": "partial",
    "detail": "Computed synthetic metrics, Wilson intervals, paired bootstrap/McNemar comparison and waveform perturbation tests. No clinical validity claim."
  },
  {
    "id": "V2-VAL-005",
    "title": "Paired comparison",
    "requirement": "Version comparison shall preserve matched units and show all eligible cohort coverage and failure changes.",
    "mode": "partial",
    "detail": "Computed synthetic metrics, Wilson intervals, paired bootstrap/McNemar comparison and waveform perturbation tests. No clinical validity claim."
  },
  {
    "id": "V2-VAL-006",
    "title": "Cohorts and disclosure",
    "requirement": "Cohort results shall show denominators, missing metadata and approved suppression and query budgets.",
    "mode": "partial",
    "detail": "Computed synthetic metrics, Wilson intervals, paired bootstrap/McNemar comparison and waveform perturbation tests. No clinical validity claim."
  },
  {
    "id": "V2-VAL-007",
    "title": "Robustness lineage",
    "requirement": "Perturbed audio evaluations shall preserve the raw input and record recipe, seed and invalid variants.",
    "mode": "partial",
    "detail": "Computed synthetic metrics, Wilson intervals, paired bootstrap/McNemar comparison and waveform perturbation tests. No clinical validity claim."
  },
  {
    "id": "V2-VAL-008",
    "title": "Comparable technical measures",
    "requirement": "Latency and cost reporting shall distinguish phases, failures, resource profile and measurement authority.",
    "mode": "partial",
    "detail": "Computed synthetic metrics, Wilson intervals, paired bootstrap/McNemar comparison and waveform perturbation tests. No clinical validity claim."
  },
  {
    "id": "V2-RUN-001",
    "title": "Atomic admission",
    "requirement": "Run creation shall atomically check scope and reserve quota with audit, receipt and outbox.",
    "mode": "partial",
    "detail": "Persistent manually dispatched jobs with expiring leases, epoch fencing, retries and atomic results. Autonomous workers and infrastructure quotas are not connected."
  },
  {
    "id": "V2-RUN-002",
    "title": "Fenced attempt leases",
    "requirement": "Only the active attempt lease fencing token shall commit result and terminal run state.",
    "mode": "partial",
    "detail": "Persistent manually dispatched jobs with expiring leases, epoch fencing, retries and atomic results. Autonomous workers and infrastructure quotas are not connected."
  },
  {
    "id": "V2-RUN-003",
    "title": "Bounded resources",
    "requirement": "Execution shall enforce package admitted CPU, memory, disk, duration, network and output ceilings.",
    "mode": "partial",
    "detail": "Persistent manually dispatched jobs with expiring leases, epoch fencing, retries and atomic results. Autonomous workers and infrastructure quotas are not connected."
  },
  {
    "id": "V2-RUN-004",
    "title": "Confirmed cancellation",
    "requirement": "Cancellation shall be requested, acknowledged and confirmed after actual worker termination.",
    "mode": "partial",
    "detail": "Persistent manually dispatched jobs with expiring leases, epoch fencing, retries and atomic results. Autonomous workers and infrastructure quotas are not connected."
  },
  {
    "id": "V2-RUN-005",
    "title": "Policy rechecks",
    "requirement": "Policy shall be rechecked at admission, lease, data read, scoring and evidence release.",
    "mode": "partial",
    "detail": "Persistent manually dispatched jobs with expiring leases, epoch fencing, retries and atomic results. Autonomous workers and infrastructure quotas are not connected."
  },
  {
    "id": "V2-RUN-006",
    "title": "Remote uncertainty",
    "requirement": "Remote timeout and cancellation shall record unknown provider outcome and use only approved retry semantics.",
    "mode": "partial",
    "detail": "Live requests retain unknown timeout/network outcomes, do not auto-retry, and fence disabled or edited connections. Already-sent provider processing cannot be undone."
  },
  {
    "id": "V2-RUN-007",
    "title": "Output cardinality",
    "requirement": "Output validation shall reject extra, duplicate, malformed and nonfinite predictions and account for missing ones.",
    "mode": "partial",
    "detail": "Persistent manually dispatched jobs with expiring leases, epoch fencing, retries and atomic results. Autonomous workers and infrastructure quotas are not connected."
  },
  {
    "id": "V2-RUN-008",
    "title": "Attempt accounting",
    "requirement": "All failed, retried, cancelled and successful attempts shall retain usage and release abandoned reservations.",
    "mode": "partial",
    "detail": "Persistent manually dispatched jobs with expiring leases, epoch fencing, retries and atomic results. Autonomous workers and infrastructure quotas are not connected."
  },
  {
    "id": "V2-UX-001",
    "title": "Lab journeys",
    "requirement": "Users shall start model evaluation and ecosystem testing from project scoped journeys with actionable readiness checks.",
    "mode": "partial",
    "detail": "Working module interface, explicit mode labels, preserved failed-command inputs and responsive controls. Authenticated browser and accessibility acceptance remain unverified."
  },
  {
    "id": "V2-UX-002",
    "title": "Truthful status and provenance",
    "requirement": "Every result shall expose origin, execution scope, completeness and approval state without conflating them.",
    "mode": "partial",
    "detail": "Working module interface, explicit mode labels, preserved failed-command inputs and responsive controls. Authenticated browser and accessibility acceptance remain unverified."
  },
  {
    "id": "V2-UX-003",
    "title": "Accessible interaction",
    "requirement": "Forms, state changes, tables and charts shall support keyboard and assistive technology operation with non colour cues.",
    "mode": "partial",
    "detail": "Working module interface, explicit mode labels, preserved failed-command inputs and responsive controls. Authenticated browser and accessibility acceptance remain unverified."
  },
  {
    "id": "V2-UX-004",
    "title": "Recoverable state",
    "requirement": "Drafts and asynchronous operations shall survive navigation; stale changes and partial failures shall be explicit.",
    "mode": "partial",
    "detail": "Working module interface, explicit mode labels, preserved failed-command inputs and responsive controls. Authenticated browser and accessibility acceptance remain unverified."
  },
  {
    "id": "V2-SEC-001",
    "title": "Tenant and field policy",
    "requirement": "All services shall enforce scoped records, field access and separate privileges for protected references.",
    "mode": "partial",
    "detail": "Working owner scope, test-role policy, holds, revocation and expiring diagnostics grants. Real institutional identities and separate scorer infrastructure remain unconnected."
  },
  {
    "id": "V2-SEC-002",
    "title": "Real independent approval",
    "requirement": "Protected review and release shall require eligible real people and applicable separation of duties.",
    "mode": "simulated",
    "detail": "Independent test-person approvals and dummy organisation invitations. These do not represent distinct authenticated real people."
  },
  {
    "id": "V2-SEC-003",
    "title": "Controlled support",
    "requirement": "Support shall use scoped expiring grants linked to reason and ticket with independent audit.",
    "mode": "partial",
    "detail": "Working owner scope, test-role policy, holds, revocation and expiring diagnostics grants. Real institutional identities and separate scorer infrastructure remain unconnected."
  },
  {
    "id": "V2-SEC-004",
    "title": "Network destination protection",
    "requirement": "Outbound inference and callbacks shall block unapproved, private, metadata, redirected and rebound destinations.",
    "mode": "partial",
    "detail": "Live public HTTPS requests block IP literals, common private names, platform destinations and redirects. Private-network isolation relies on the standalone Worker runtime; no independent network penetration test or regional policy is claimed."
  },
  {
    "id": "V2-SEC-005",
    "title": "Secret and log control",
    "requirement": "Secrets shall use workload scoped references and sensitive outputs shall remain out of ordinary logs and client bundles.",
    "mode": "partial",
    "detail": "No provider secrets accepted; dummy identity strings are explicitly nonfunctional. External workload secret management is not connected."
  },
  {
    "id": "V2-SEC-006",
    "title": "Simulation containment",
    "requirement": "Simulator faults, synthetic identities and test credentials shall be unusable against production and control services.",
    "mode": "partial",
    "detail": "Working owner scope, test-role policy, holds, revocation and expiring diagnostics grants. Real institutional identities and separate scorer infrastructure remain unconnected."
  },
  {
    "id": "V2-NFR-001",
    "title": "Availability and recovery targets",
    "requirement": "Production shall retain 99.9 percent availability and recovery within four hours in permitted locations.",
    "mode": "simulated",
    "detail": "Tabletop operational exercises only. No production SLO, capacity or recovery claim; source targets are not measurements."
  },
  {
    "id": "V2-NFR-002",
    "title": "Recovery point reconciliation",
    "requirement": "Recovery shall meet 5 minute decision, grant and audit RPO; 15 minute metadata and final artefact RPO; 24 hour input RPO unless stricter.",
    "mode": "simulated",
    "detail": "Tabletop operational exercises only. No production SLO, capacity or recovery claim; source targets are not measurements."
  },
  {
    "id": "V2-NFR-003",
    "title": "Source performance targets",
    "requirement": "The implementation shall retain source L1 interaction, API and queue targets with measured profile and denominators.",
    "mode": "simulated",
    "detail": "Tabletop operational exercises only. No production SLO, capacity or recovery claim; source targets are not measurements."
  },
  {
    "id": "V2-NFR-004",
    "title": "Simulator capacity profile",
    "requirement": "P1 shall support five environments, each 1,000 people and 20,000 linked resources, at aggregate 20 registry requests per second.",
    "mode": "simulated",
    "detail": "Tabletop operational exercises only. No production SLO, capacity or recovery claim; source targets are not measurements."
  },
  {
    "id": "V2-NFR-005",
    "title": "Online revocation target",
    "requirement": "Online credential, grant and job revocation shall become effective within 60 seconds.",
    "mode": "simulated",
    "detail": "Tabletop operational exercises only. No production SLO, capacity or recovery claim; source targets are not measurements."
  },
  {
    "id": "V2-NFR-006",
    "title": "Resource fairness",
    "requirement": "No tenant shall exceed admitted quotas or starve other reserved tenants through generator or model overload.",
    "mode": "simulated",
    "detail": "Tabletop operational exercises only. No production SLO, capacity or recovery claim; source targets are not measurements."
  },
  {
    "id": "V2-NFR-007",
    "title": "Numerical reproducibility",
    "requirement": "Evidence shall distinguish bitwise synthetic determinism from bounded stochastic model reproducibility.",
    "mode": "partial",
    "detail": "Synthetic replay is deterministic and forest output is computed. Stochastic/GPU numerical tolerances remain untested."
  },
  {
    "id": "V2-API-001",
    "title": "Strict schemas and errors",
    "requirement": "Control APIs shall reject unknown fields and invalid enums and return safe structured errors.",
    "mode": "partial",
    "detail": "Working strict command validation, optimistic revisions, idempotency and scoped reads. Hosted adapter differs from the original regional /v2 contract."
  },
  {
    "id": "V2-API-002",
    "title": "Idempotency and revision",
    "requirement": "Mutations shall bind operation keys to current scope and request digest; mutable edits require If-Match.",
    "mode": "partial",
    "detail": "Working strict command validation, optimistic revisions, idempotency and scoped reads. Hosted adapter differs from the original regional /v2 contract."
  },
  {
    "id": "V2-API-003",
    "title": "Stable pagination",
    "requirement": "List APIs shall use scoped opaque cursors, deterministic ordering, limits and a frozen snapshot boundary.",
    "mode": "partial",
    "detail": "Working strict command validation, optimistic revisions, idempotency and scoped reads. Hosted adapter differs from the original regional /v2 contract."
  },
  {
    "id": "V2-API-004",
    "title": "Reliable versioned events",
    "requirement": "Events shall use typed payloads, outbox delivery, scoped consumer deduplication and bounded retry with dead letters.",
    "mode": "simulated",
    "detail": "Internal committed event history and connector duplicate/timeout fixtures. No external durable bus or webhook delivery contract."
  },
  {
    "id": "V2-EVD-001",
    "title": "Immutable evidence manifest",
    "requirement": "Evidence shall bind all model, data, protocol, runtime, scenario, environment and scorer versions with integrity hashes.",
    "mode": "partial",
    "detail": "Working frozen evidence bytes, integrity verification, linked corrections and supersession. Application export signatures use a configured ECDSA key. Institutional approval and certified institutional signatures remain unconnected."
  },
  {
    "id": "V2-EVD-002",
    "title": "Rights aware release",
    "requirement": "Release shall require current export rights, unresolved issue disclosure and eligible independent approval where required.",
    "mode": "partial",
    "detail": "Working frozen evidence bytes, integrity verification, linked corrections and supersession. Application export signatures use a configured ECDSA key. Institutional approval and certified institutional signatures remain unconnected."
  },
  {
    "id": "V2-EVD-003",
    "title": "Scope and correction history",
    "requirement": "Reports shall retain origin, limitations, complete denominators and correction or retraction lineage.",
    "mode": "partial",
    "detail": "Working frozen evidence bytes, integrity verification, linked corrections and supersession. Application export signatures use a configured ECDSA key. Institutional approval and certified institutional signatures remain unconnected."
  },
  {
    "id": "V2-OPS-001",
    "title": "Pinned build and fixture provenance",
    "requirement": "Builds shall pin dependencies, images, profiles and software inventory and record their source revision.",
    "mode": "partial",
    "detail": "Working pinned source/build, migrations and fixture tests. Full production release, recovery and security acceptance remain unverified."
  },
  {
    "id": "V2-OPS-002",
    "title": "Slice gates",
    "requirement": "Each slice shall include contracts, migrations, access policies, negative cases, observability and runbook evidence before enabling its capability.",
    "mode": "partial",
    "detail": "Working pinned source/build, migrations and fixture tests. Full production release, recovery and security acceptance remain unverified."
  },
  {
    "id": "V2-OPS-003",
    "title": "Deployed smoke journey",
    "requirement": "Every deployment shall run a dedicated synthetic smoke journey across actual provisioned services.",
    "mode": "partial",
    "detail": "Local built-Worker smoke journeys execute against provisioned local D1/R2. Automatic post-deployment authenticated smoke remains unconnected."
  },
  {
    "id": "V2-OPS-004",
    "title": "Recovery and rollback operations",
    "requirement": "Operators shall have tested procedures for rollback, restore, stuck jobs, key rotation and unknown external outcomes.",
    "mode": "partial",
    "detail": "Actual metadata serialisation roundtrip and documented rollback; failover, crash, key rotation and load exercises are explicitly simulated."
  }
] as const;
