# UI Component and Interaction Specification — reconciled reading edition

Documentation edition **1.1**, 2026-10-03. Reconciled to repository source **8b4b4b5a4b22** plus the unmerged independent cough provider candidate. Hosted alpha package 0.6.0; this candidate is not deployed.

## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

## Retained original engineering specification

Original: [08_UI_Component_and_Interaction_Specification.md](../../native-baseline/specs/08_UI_Component_and_Interaction_Specification.md).

# UI Component and Interaction Specification

This specification turns the existing wireframe concepts into reusable, testable interactions. It covers the initial institution, programme, study review, access request and resumable import flows, while providing common rules for later screens. The source screen identifiers remain in the full traceability model; engineering links each implemented route to those identifiers and its source acceptance cases.

## Shared application structure
Use a persistent institution and region context selector with a clear active-context label. A context switch cancels in-flight requests, clears scoped caches, resets cursors and confirms the new context before rendering records. Never merge records from two contexts in one implicit session. Show a connection-status indicator and a distinct safety-report action that remains reachable when other features fail.
Navigation reflects enabled capabilities and current rights. A direct URL still receives server authorization. Use a page title, breadcrumb, status text, owner and last-updated version on record pages. Display human names and dates only where the user's field projection permits them. Record identifiers used for support are copyable without exposing hidden metadata.

## Component catalogue
| Component | Inputs and behaviour | Required states |
| Context selector | Authorized contexts from identity endpoint; explicit switch | Loading, no context, active, expired, switch failed |
| Resource list | Server projection, permitted filters and opaque cursor | Skeleton, results, empty, denied, offline, retryable failure |
| Draft form | Closed payload schema and business rules; server-owned fields absent | Pristine, dirty, validating, saving, saved, conflict, returned |
| Review panel | Exact snapshot digest, version, assigned slot and independence status | Unassigned, ready, step-up required, decision submitted, superseded |
| Access scope editor | Explicit purpose, fields, cohort, recipients, region and validity | Missing scope, invalid subset, expired rights, approved read-only scope |
| Upload manager | File length/hash, session, confirmed parts and control version | Local hashing, uploading, interrupted, resuming, verifying, quarantined, available, failed, expired, aborted |
| Status and hold panel | Source lifecycle state plus separate active restrictions | Unknown, active, held, remote-unconfirmed, superseded, withdrawn |
| Metric value | Number, unit, status, reason and version | Measured value, measured zero, missing, suppressed, invalid |
| Evidence viewer | Approved projection, exact issue digest and current status | Issued, corrected successor, withdrawn, unavailable |

## Form and review interaction rules
Validate format and required fields on blur and on submit. Keep user input after recoverable failures. Put a concise error summary at the top, move focus there and link each item to its field. Server errors use the safe code and correlation ID; do not display raw stack traces. Do not accept unknown fields even when a client extension sends them.
Disable duplicate submit while awaiting acknowledgement, but retain one idempotency key for retries of the same intent. Changing the intent creates a new key. A timeout shows outcome unknown and offers a status check or safe retry; it does not claim failure when the server may have committed.
A stale edit opens a conflict view with the user's draft and currently authorized server values. Let the user review and deliberately create a new intent against the current version. Never silently overwrite or auto-merge approval, grant, identity, scientific or safety fields. Frozen records open in read-only mode with an allowed successor action.
The review screen displays the exact version and content digest being signed, required role slot, conflict declaration and independent-person status. Reauthentication does not submit a decision automatically. Require a deliberate final action after the user returns. A changed snapshot invalidates the open decision form and explains why a new review is required.

## Upload and offline behaviour
Progress has three separate values: local bytes processed, server-acknowledged transfer and server verification or release. One hundred percent transfer does not display success while content is verifying or quarantined. The user can pause local transfer, inspect confirmed parts, resume an active session or abort with a reason.
After reconnect, fetch session state, verify the selected file's identity and resend only missing parts. Show expiry time and remaining quota before large transfers. If rights have changed, stop transfer and explain the permitted next step without exposing policy details the user cannot see. If a full digest fails, require a new upload; do not offer to accept mismatched content.
Responsive layouts retain the same controls on narrow screens. Critical review and scope summaries become stacked sections with clear labels rather than horizontally clipped tables. Protected media is not cached in the browser by default. A managed offline flow must expose lease expiry, queued intent and server acknowledgement separately. Never present an offline local action as an approved server transition.

## Accessibility and feedback
Use semantic headings, labels, buttons and tables with keyboard-operable controls. Tab order follows reading order. Preserve visible focus and return focus to the triggering control after a dialog closes. Announce validation errors and state changes through appropriate live regions without repeatedly announcing every byte of upload progress.
Status must use text and icons, not colour alone. Provide sufficient text and control contrast, usable target sizes, zoom and reflow, reduced-motion behaviour and equivalent non-drag upload controls. Document the applicable accessibility target in the release quality catalogue and verify it with both automation and human keyboard/screen-reader review.
Dates show local presentation with the authoritative UTC value available. Missing values use explicit text; zero is shown as zero with its unit. Suppression explains that the value is intentionally hidden without disclosing the suppressed count. A withdrawn report cannot retain an apparently valid success banner.

## Acceptance and instrumentation
Test loading, empty, permission loss, session expiry, validation, server error, slow response, duplicate click, unknown outcome, stale version, hold activation and offline reconnect on each relevant component. The first workflow must complete under the standard and constrained network profiles with no duplicate business effect.
Collect route and operation latency, validation category, error code, upload phase and correlation ID. Exclude form content, patient values, tokens, file names containing identifiers and document text. Product analytics must respect tenant and purpose restrictions. APP03 to APP14, APP19, APP21, APP24 and APP25 provide the initial interaction acceptance set.
