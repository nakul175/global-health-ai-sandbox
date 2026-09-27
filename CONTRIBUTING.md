# Contributing

Start with [the documentation index](docs/README.md). Current runtime is R2 technical alpha v0.6.0; [R3](docs/releases/r3/README.md) is a proposed government-adoption specification.

Use a feature branch and a focused pull request. Include stable requirement IDs and update the affected documentation alongside implementation. Preserve earlier source requirements and historical verification reports. Never claim that a generated mock, design document or passing reference fixture establishes a working application feature.

Run `python3 scripts/check-docs.py` for documentation changes. Use `--write-traceability` after changing requirement mappings. For application changes, run the relevant existing typecheck/build/test gates and the R3 cases for that slice. Publish honest evidence including unexecuted cases and external dependencies.

Follow [documentation policy](docs/DOCUMENTATION_POLICY.md), [development/CI](docs/releases/r3/11-development-ci.md) and the pull-request checklist. Do not commit secrets, patient data, supplier-confidential files, generated dependency directories or production credentials. GitHub is the canonical source for code and documentation; deployed website changes require the existing hosting workflow and are separate from documentation commits.
