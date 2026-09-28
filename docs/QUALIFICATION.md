# Qualification and evidence ledger

Edition 1.1, 28 September 2026. This records the evidence available for each source/profile. No application tests were rerun by the documentation reconciliation.

| Profile / source | Recorded checks | What it supports | Remaining gap |
|---|---|---|---|
| Native v0.1, 25 September | 45 unit/integration/smoke plus 7 browser journeys; separate migration/launcher checks | Local programme slice against embedded PostgreSQL/PGlite | Native PostgreSQL infrastructure, production identity and operational acceptance |
| Hosted v0.2 | 29 domain/SQLite plus 13 built-Worker HTTP checks | Initial hosted adapter scope | Earlier profile; superseded scope, not current-main rerun |
| Hosted v0.3 | 57 unit/integration plus 22 HTTP | Synthetic lab increment | Historical only |
| Hosted v0.4 | 79 unit/integration plus 32 HTTP | Workbench increment | Historical only |
| Hosted v0.5 | 90 unit/integration/recovery plus 37 HTTP | Signatures, capture and isolated restore | No regional disaster/cutover/escrow qualification |
| Hosted v0.6, source imported as 538cbd0 | 111 unit/integration plus 41 built-Worker HTTP; typecheck/build | Last committed hosted machine reports: 152 checks | Successful deployed customer HTTPS provider, authenticated hosted browser/UAT absent |
| PR #13 source 2f0f352, merged as 870b49a | PR reports 114 hosted unit/integration; native 51 unit and 84 full embedded harness; documentation checks | Reported validation of eleven fixes; 51 native unit checks are included in broader native harness, not additive | New built-Worker HTTP checks, native PostgreSQL and browser checks explicitly not executed; new machine reports not committed |
| Government R3 design | Documentation/reference validation only; 134 planned application cases | Design consistency and candidate fixtures | Zero executed R3 application tests |

Historical report sources: [native](../native-baseline/verification/VERIFICATION.md), [v0.2](../verification/VERIFICATION.md), [v0.3](../verification/RELEASE_2_VERIFICATION.md), [v0.4](../verification/WORKBENCH_VERIFICATION.md), [v0.5](../verification/ASSURANCE_0_5_VERIFICATION.md), [v0.6](../verification/CONNECTIONS_0_6_VERIFICATION.md), [PR #13](https://github.com/nakul175/global-health-ai-sandbox/pull/13).

[EXECUTION-REGISTER.csv](current/EXECUTION-REGISTER.csv) contains 204 exact historical identities: 152 hosted v0.6 and 52 native v0.1. These are separate applications/environments, not a 204-test current-main acceptance run. Older prose counts do not create additional executions. Local timings in v0.5 are observations from one synthetic process, not production commitments.

## Source test catalogues

The original catalogue contains 1,066 designed cases across Functional 738, Quality 87, Critical 40, Unit 117, Integration 60 and Smoke 24. It also contains 456 scenarios and 47 HTTP script definitions. Original application statuses remain unchanged; reference-test passes remain distinct. Synthetic R2 adds 81 case definitions; government R3 has 134. Conceptually overlapping cases are not a deduplicated coverage denominator.

No broad original requirement or government requirement gains acceptance merely because a similarly named alpha test exists. Traceability records explicitly distinguish domain relationships, declared bounded capabilities and proposed designs.

## Release decision

Development handover is supported by the repository and current documentation. Production release, institutional multiuser acceptance, independent security/accessibility review, clinical validation, real national integration, independent escrow and operational recovery are not established. The release acceptance record assigns role-level responsibilities without fabricating approver names or signatures.

See [release acceptance](current/RELEASE-ACCEPTANCE.md) and [documentation QA](current/DOCUMENTATION-QA.md).
