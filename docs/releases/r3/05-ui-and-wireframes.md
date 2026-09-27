# UI components, interactions and wireframes

Status: design specification; wireframes are illustrative and have no connected backend. [Visual wireframes](wireframes.svg) show programme overview, comparison, budget and evidence review.

## Navigation and users

Institution switcher uses verified memberships. Main navigation: Overview, Programmes, Evaluations, Budgets, Evidence, Integrations, Pilots, Registry, Administration. Hide actions a user cannot take; explain read-only state where it helps their task. Server permissions remain authoritative.

Programme workspace tabs: Context, Suppliers, Protocol, Runs, Comparison, Budget, Decision. Overview gives the next required action, responsible role, evidence freshness and missing inputs. Technical logs are in a details panel; programme users see the practical implication first.

## Screen specification

| Screen | Content and primary action | Validation and exceptional states |
|---|---|---|
| Organisation onboarding | Institution details, identity setup, members; invite user | Expired invitation, recipient mismatch, suspended account, last-admin restriction |
| Programme overview | Objective, stage, owner, evidence class, tasks and last update | Empty programme suggests context setup; archival shows preserved history |
| District context | Facilities and capacity, source metadata, assumptions; preview import | Error summary links to rows/fields; no partial save; synthetic values use persistent badges |
| Supplier submission | Intended use, version, declared evidence and price | Vendor sees only its own submission; submitted version is immutable |
| Protocol editor | Population, comparator, metrics, thresholds, subgroups, evidence class | Missing rights or method blocks freeze; show exact frozen dependency list |
| Comparison | Criteria by supplier; metrics, uncertainty, cost, coverage, missing evidence | Partial results shown as incomplete; no default winner; minimum eligibility separate from optional weights |
| Budget | Assumptions alongside annual totals, funding and capacity gap | Currency/horizon mismatch blocks comparison; changing an input marks old outputs stale |
| Evidence review | Brief, findings, provenance, gaps, reviewer decisions | Same-person approval unavailable; conflicting revision preserves comments and requires reread |
| Integration test | Adapter/environment, mappings, test cases and results | Mock/sandbox/live badge; missing secret is blocked; no credential values in logs |
| Pilot monitor | Freshness, completeness, outcomes, incidents and pause status | Stale feed has explicit warning; alert resolution needs a reason |
| Evidence registry | Search by intended use, version, population, location and date | Restricted records absent from search/facets; sharing requires preview of disclosed fields |
| Administration | Memberships, audit, retention, integrations, exports | Support access shows scope/expiry; destructive/irreversible operations require exact context |

## Reusable components

- `EvidenceClassBadge`: synthetic, retrospective, prospective or supplier-declared; never colour alone.
- `SourceField`: value, unit, source, date, classification and owner; an unknown is distinct from numeric zero.
- `VersionBanner`: draft/current/frozen/superseded, version and dependency digest; stale data explains which dependency changed.
- `MetricCell`: value, denominator, interval and evidence quality; handles `not_estimable` and suppressed subgroup counts.
- `FundingTable`: source, period, committed/proposed/received, allocated amount, gap; no double counting.
- `RunStatus`: accessible live status, last update, cancellation state and recovery action; avoid indefinite spinner.
- `ReviewDecision`: reason, conflict declaration, exact reviewed version and consequences.
- `PermissionNotice`: actionable role/assignment explanation without exposing a hidden object's existence.

## Interaction rules

Tables support keyboard navigation, column labels and accessible sorting; pagination maintains filters. At 320 CSS pixels, content reflows or provides a labelled scroll region for inherently tabular comparisons. Dialog focus is trapped and restored; Escape closes non-destructive dialogs. Validation is both inline and in a linked summary. Required fields are labelled in text.

Target WCAG 2.2 AA through automated checks and manual keyboard/screen-reader exercises. Error/status announcements use appropriate live regions. Controls have visible focus and sufficient contrast; charts include tables and do not rely on colour. Timeouts warn before session expiry and preserve permitted drafts without storing sensitive data in browser local storage.

On 409/412, retain local edits in memory, retrieve authorised current version and display differences. User explicitly reapplies changes; no silent overwrite. On timeout, first retrieve intent status before offering a fresh submission. Loading states preserve table dimensions and do not show fabricated numbers.

Localisation starts with English and externalised message keys, locale-aware formatting, UTC storage and programme-local display. Additional translations require review by a named language owner. Low-bandwidth mode omits optional charts and large attachments. Offline R3A permits viewing downloaded synthetic briefs; protected writes and live transfers require online authorisation. Full offline data collection is outside this increment.

## User acceptance tasks

Programme officer creates a programme from a spreadsheet; evaluator freezes a protocol and compares submissions; finance officer explains the funding gap; independent reviewer returns and approves a pack; successor officer finds the decision rationale. Record completion, time, errors and assistance. Wireframes are not usability evidence until representative users perform these tasks in the implemented application.
