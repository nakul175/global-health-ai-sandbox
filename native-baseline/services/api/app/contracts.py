import hashlib
import json
import re
from datetime import datetime

import rfc8785
from jsonschema import Draft202012Validator, FormatChecker

from .config import ROOT
from .errors import Fault

OPENAPI = json.loads((ROOT / "contracts/openapi.json").read_text())
# RFC 3339 date-time with a mandatory UTC offset. jsonschema enforces `format: date-time` only when the
# optional rfc3339-validator package is installed, so the API checks the two programme timestamps itself.
RFC3339 = re.compile(
    r"\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])"
    r"T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)",
    re.ASCII,
)
VALIDATORS = {
    name: Draft202012Validator(
        {"$ref": "#/components/schemas/" + name, "components": OPENAPI["components"]},
        format_checker=FormatChecker(),
    )
    for name in OPENAPI["components"]["schemas"]
}


def canonical(value):
    return rfc8785.dumps(value)


def digest(value):
    return hashlib.sha256(canonical(value)).hexdigest()


def unique_pairs(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate key")
        result[key] = value
    return result


def parse_json(raw):
    try:
        return json.loads(
            raw.decode("utf-8"),
            object_pairs_hook=unique_pairs,
            parse_constant=lambda _: (_ for _ in ()).throw(ValueError("non-finite")),
        )
    except (ValueError, UnicodeError, RecursionError):
        raise Fault(400, "E_BAD_REQUEST", "Use valid UTF-8 JSON with unique properties.") from None


def validate(schema, data):
    errors = list(VALIDATORS[schema].iter_errors(data))
    if errors:
        fields = [
            {"path": "/" + "/".join(map(str, e.absolute_path)), "code": e.validator} for e in errors[:10]
        ]
        raise Fault(422, "E_VALIDATION", "Check the highlighted fields.", fields)
    return data


def parse_timestamp(data, field):
    """Return the aware datetime for an RFC 3339 programme field or raise the 422 validation Fault."""
    value = data.get(field)
    try:
        if not isinstance(value, str) or not RFC3339.fullmatch(value):
            raise ValueError("not an RFC 3339 date-time")
        parsed = datetime.fromisoformat(value)
    except (ValueError, TypeError):
        parsed = None
    if parsed is None or parsed.tzinfo is None:
        raise Fault(
            422,
            "E_VALIDATION",
            "Check the highlighted fields.",
            [{"path": "/payload/data/" + field, "code": "format"}],
        )
    return parsed


def programme_semantics(data):
    for field in ("name", "description"):
        if not data[field].strip():
            raise Fault(
                422,
                "E_SEMANTIC",
                "Name and description cannot be blank.",
                [{"path": "/payload/data/" + field, "code": "blank"}],
            )
    if parse_timestamp(data, "starts_at") >= parse_timestamp(data, "ends_at"):
        raise Fault(
            422,
            "E_SEMANTIC",
            "The end must be after the start.",
            [{"path": "/payload/data/ends_at", "code": "range"}],
        )
