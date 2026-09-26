.PHONY: install build dev test test-browser lint audit
install:
	python3.12 -m venv .venv
	.venv/bin/python -m pip install --require-hashes -r environment/requirements-dev.lock
	npm ci
build:
	npm run build
dev:
	npm run dev
test: build
	.venv/bin/python scripts/run_checks.py
test-browser: build
	.venv/bin/python scripts/run_checks.py --browser
lint:
	.venv/bin/ruff check services scripts tests/unit tests/integration tests/native
	npx prettier --check 'apps/web/src/*.{ts,tsx,css}' apps/web/vite.config.ts scripts/*.mjs tests/browser/*.ts playwright.config.ts
audit:
	.venv/bin/pip-audit -r environment/requirements.lock
	npm audit
