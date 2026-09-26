# Compatibility with baseline command names; run from repository root.
.PHONY: install contract-check database-check foundation-check app-check
install:
	$(MAKE) -f Makefile install
contract-check:
	.venv/bin/python -m pytest tests/unit -q
database-check:
	$(MAKE) -f Makefile test
foundation-check:
	$(MAKE) -f Makefile test
app-check:
	$(MAKE) -f Makefile test-browser
