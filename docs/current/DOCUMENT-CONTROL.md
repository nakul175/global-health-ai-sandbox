# Document control and provenance

Edition 1.1, 28 September 2026. Reconciliation baseline 870b49a343f1207b8cefbecdbfb0c5c5d10c955a. Review state: prepared and mechanically checked; institutional/sponsor approval not recorded.

| Document family | Role owner | Authority and update trigger |
|---|---|---|
| BRD/FSD and original model | Product | Retain requirement IDs, statements, acceptance and original release; change through explicit requirement review |
| HLD/LLD/API/data/ADRs | Engineering | Current source governs implemented mechanics; change with affected interfaces, schema or runtime |
| Access/threat/data governance | Security + data owner | Current controls and target gaps; review identity, data classes, egress, disclosure and retention changes |
| Guides/wireframes | Product/design/support | Describe source-backed actions; prototypes remain illustrations; review user journeys |
| Test catalogue and execution | QA | Original expected outcomes retained; exact run evidence attached separately |
| Operations/release | Operations + release authority | Environment-specific records and actual signoffs; no inferred SLA/readiness |
| Government R3 | Programme/product and implementing owners | Proposed contracts; freeze and qualify each stage before declaring implementation |

## Precedence

1. Original and additive requirements define intended outcomes; none is weakened by a smaller alpha.
2. Executable source plus profile/version-specific evidence define what currently works and what has actually been tested.
3. Current reading editions consolidate those two layers; discrepancies stay visible.
4. Historical files retain their original dates and claims. Later capabilities do not rewrite earlier test results.

The current BRD/FSD are detailed reading reconstructions from the preserved structured source model. Missing original Word files remain explicitly missing. The ten engineering specifications are retained in place and embedded unchanged below a current-profile preface in their reading editions.

All available pre-edition documentation/contract/catalogue/evidence files selected for preservation are stored with exact hashes in [history](../history/README.md). Runtime source remains versioned in Git. The new edition does not rename or delete original files.
