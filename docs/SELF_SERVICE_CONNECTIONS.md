# Self-service connections — release 0.6.0

The Integrations tab now supports real outbound HTTP requests. The older fixture connectors remain explicitly simulated in a separate collapsed section. No customer model, credential or hospital endpoint is preconfigured.

## User workflow

1. Open Release 2 workbench → Integrations and select the test developer role.
2. Enter the final public HTTPS endpoint. Choose prediction API (POST JSON) or service check (GET JSON).
3. Choose no authentication, bearer token, or API key. Supported API-key headers are `X-API-Key`, `api-key` and `Ocp-Apim-Subscription-Key`. Enter the credential in the password field.
4. For prediction APIs, map four input fields: subject ID, base64 PCM16 WAV, sample rate and synthetic flag. Dot-separated nested object paths are supported; arrays, scripts, arbitrary transformations and constant/custom fields are not.
5. Map the returned numeric probability field and optionally the returned subject ID. For service checks, map a scalar status field and enter its expected value.
6. Save. The server stores the credential encrypted and returns no credential value. Saving does not contact the endpoint.
7. Confirm that you are authorised to contact the destination and send synthetic inputs. A model test sends one generated WAV; a service test sends GET. Requests may incur provider charges. Inspect the actual result in history.
8. Activate after a successful test within the last 15 minutes. Editing the configuration or replacing a credential invalidates that test.
9. Run a prediction connection on an ecosystem of 10–20 synthetic people, or on one released synthetic upload. Uploaded media requires both export and inference grants. Complete-cohort metrics appear only when every subject succeeds.

Changing endpoint, authentication method or credential header requires re-entering the credential. Credentials are never silently forwarded to a new destination. Disable blocks subsequent calls and discards late results. An already sent external request cannot be undone. After an interrupted call has been running for more than a minute, Release interrupted call records an unknown provider outcome and permits a new separately authorised attempt.

## Supported contracts

Default prediction request:

```json
{
  "subjectId": "SYN-P-0001",
  "audioBase64": "<base64-encoded actual PCM16 WAV bytes>",
  "sampleRate": 8000,
  "synthetic": true
}
```

Default response:

```json
{"probability": 0.73}
```

Nested example: map request audio to `input.audio` and response probability to `result.probability`. An optional response-subject mapping must match the sent subject exactly. Probabilities must be finite numbers in [0,1]; strings such as `"0.73"` are rejected. Reference labels are never sent to providers.

Service checks require a JSON object containing the configured scalar path, for example `{"status":"ok"}`. Only a successful equality match is retained, not arbitrary service records. A successful health check **does not** establish EHR interoperability, import patients, send referrals or write laboratory results.

## Controls and limitations

| Area | Behavior |
|---|---|
| Identity | Existing private owner sign-in and synthetic institution roles. This increment does not add real multi-institution identity. |
| Secrets | AES-256-GCM encryption with random nonce and connector/workspace-bound authenticated data. Uses the existing protected checkpoint master key. No plaintext in list responses, audit events, exports or provider error logs. |
| Destination | Public HTTPS on port 443 only; no embedded credentials, queries, fragments, IP literals, common private names, self/platform destinations or followed redirects. Runtime uses global public fetch, never private service bindings. |
| Request | Fixed GET health check or POST prediction; only configured credential header plus Accept, Content-Type where needed, and Idempotency-Key. Incoming browser cookies and authentication headers are not forwarded. |
| Response | JSON only; streamed 64 KiB bound; exact mapped value/type checks; no provider error body retained. |
| Time | Eight-second per-request limit and 25-second cohort limit. No automatic retries. |
| Concurrency | One running request per connector, enforced by a partial unique database index. Same intent returns the existing result/state. |
| State | Configuration version and rights are checked before transfer and again before accepting results. Disable/edit fences late results. External in-flight processing may continue. |
| History | Configuration events and live call records are separate from the workspace command ledger. Credential values and raw provider bodies are excluded. Last 100 entries are displayed; no cursor pagination in this release. |
| Bounds | Ten connectors per institution; 200 history entries before further network calls are blocked per connector; at most 20 synthetic subjects per evaluation. Configuration lifecycle entries also contribute to history. |
| Evaluation | Real provider outputs on synthetic signals; configuration/input/response hashes, timing and generated-reference metrics. Provider model version is not independently pinned. Results remain in connection history, not the lab's signed report issuance workflow. |

Not included: OAuth login or token refresh, mTLS, private-network tunnels, binary/multipart model protocols, asynchronous prediction polling, inbound callbacks, array mapping, full FHIR/EHR read/write adapters, automatic dispatch, provider-region enforcement, clinical-data approval or clinical validation. These require additional adapters or infrastructure; they are not described as completed integrations.

## API and persistence

`GET /api/connections?tenant=aster` returns sanitized configurations and bounded call history. Support is denied. It never returns stored ciphertext or plaintext credentials.

`POST /api/connections?tenant=aster` requires authenticated identity, active test membership, matching Origin, JSON content type, a UUID `Idempotency-Key`, and a streamed body no larger than 16 KiB. The closed executable contract is `connectionCommand` in `lib/connections.ts`:

- `save`: `{action,id,version,config,secret?,keepCredential}`. Version 0 creates; subsequent versions update with optimistic conflict protection. UUID `id` remains stable across a create retry; a duplicate create conflicts without making another connector.
- `test`, `activate`, `disable`, `abandon`: `{action,id,version,consent:true}`.
- `run`: `{action,id,version,consent:true,source}` where source is either `{type:"ecosystem",id,generation}` or `{type:"media",id}`.

Save/test/activate require developer or admin; run requires developer; disable/abandon also allow safety. Safety holds block save/test/activate/run while permitting disable and interrupted-call closure. JSON errors contain safe `{error:{code,message}}`. Network executions return a persisted call status (`passed`, `failed`, `unknown`, `running`, or `discarded`); HTTP 200 does not itself mean the provider test passed. Activation explicitly requires a passed test.

New migration `0003_easy_hammerhead.sql` creates `live_connectors` and `connector_calls` with workspace foreign keys, status/JSON constraints, indexes and the single-running-call constraint. Existing migrations remain unchanged. Recovery checkpoints now include both tables and encrypted credentials. Historical nine-table checkpoints are accepted with empty connection tables. Restored running calls must be reconciled as unknown; never automatically resubmit them. The same escrow limitations for the checkpoint master key apply to stored connector credentials.

## Network deployment boundary

The network policy relies on this Site's standalone Cloudflare Worker runtime, which exposes private services only through explicit bindings. Do not port arbitrary outbound fetch to a server with private-network access without adding a vetted egress proxy or equivalent DNS/IP enforcement. URL syntax checks alone do not prevent DNS rebinding. No custom DNS pinning, residency guarantee or independent network penetration test is claimed.

Platform references consulted: [Cloudflare bindings and public fetch security](https://blog.cloudflare.com/workers-environment-live-object-bindings/) and [Request redirect and abort behavior](https://developers.cloudflare.com/workers/runtime-apis/request/). Redirects are blocked specifically to avoid forwarding credentials to another destination.

## Verification scope

Positive transport testing sends mapped audio and a test credential to an actual isolated local HTTP receiver through an injected test transport. Production code uses native fetch; it contains no fixture transport, alternate test destination or authentication bypass. Other tests inject deterministic response/failure cases. Built-Worker HTTP tests verify configuration, encrypted storage/projection, role/tenant/Origin checks, real unsuccessful network execution and credential rotation.

No customer endpoint or credential was supplied, so interoperability with a particular external provider and successful deployed public-HTTPS execution are not yet verified. Authenticated interactive browser testing remains unavailable in the internal preview. These limitations are distinct from passing the automated implementation tests.
