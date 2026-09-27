# Repository working instructions

- Read `docs/README.md` and the relevant release specification before changing behaviour.
- Maintain documentation in the same change as code: requirement IDs, contracts, permissions, migrations, UI rules, tests and runbooks as affected.
- Keep the deployed R2 technical alpha distinct from proposed R3 functionality. Do not promote a requirement to implemented/verified without source and test evidence.
- Run `python3 scripts/check-docs.py` for documentation; regenerate traceability with `--write-traceability` after mapping changes.
- Preserve existing deployed migrations and verification history. R3 candidate SQL under documentation is not an active migration.
- Use synthetic fixtures; never commit credentials, patient records or confidential supplier material.
- Record unresolved external dependencies visibly. Do not replace a missing real integration with an unlabelled stub.
- Follow `docs/DOCUMENTATION_POLICY.md` and `CONTRIBUTING.md` for future changes.
