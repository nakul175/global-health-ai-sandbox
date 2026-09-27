## Purpose and resulting behaviour

Explain the concrete problem, changed behaviour and affected release/requirement IDs.

## Validation

Record exact commands, source revision, fixture and environment. Distinguish reference checks, application tests, external integration tests and unexecuted cases.

## Documentation and release checks

- [ ] Updated affected requirements, contracts, data model, UI rules and runbooks, or explained why they are unchanged.
- [ ] Updated requirement/test status with real evidence; no mock or planned test is presented as passed application acceptance.
- [ ] Ran `python3 scripts/check-docs.py`; regenerated traceability if mappings changed.
- [ ] Applied new migrations only to an authorised disposable environment during development; preserved deployed migration history.
- [ ] Recorded important decisions and remaining dependencies; checked access, evidence class and supplier-data projections.
- [ ] Added an entry to `docs/CHANGELOG.md` and identified any deployment or rollback implications.
