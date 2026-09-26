"""Additive 0.1 application supplement, preserving the source baseline schemas."""

import copy
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
p = root / "contracts"
events = json.loads((p / "events.schema.json").read_text())
for name in ["CreateDraftCommitted", "UpdateDraftCommitted"]:
    if not any(x["properties"]["event_type"]["const"] == name for x in events["oneOf"]):
        event = copy.deepcopy(events["oneOf"][0])
        event["properties"]["event_type"]["const"] = name
        events["oneOf"].append(event)
(p / "events.schema.json").write_text(json.dumps(events, indent=2) + "\n")
spec = json.loads((p / "openapi.json").read_text())
keep = [
    "/v1/resources/{domain}",
    "/v1/resources/{domain}/{id}",
    "/v1/me",
    "/v1/capabilities",
    "/health/live",
    "/health/ready",
    "/v1/commands/RecordSafetyConcern",
    "/v1/commands/ApplyHold",
]
spec["paths"] = {k: v for k, v in spec["paths"].items() if k in keep}
spec["info"]["version"] = "1.1.1-programme-slice"
spec["info"]["description"] = (
    "Implemented programme slice. ORG/Programme is the only enabled resource. Development login is loopback-only."
)
for method in ["get", "post"]:
    spec["paths"]["/v1/resources/{domain}"][method]["parameters"][0]["schema"] = {
        "type": "string",
        "const": "ORG",
    }
for method in ["get", "patch"]:
    spec["paths"]["/v1/resources/{domain}/{id}"][method]["parameters"][0]["schema"] = {
        "type": "string",
        "const": "ORG",
    }
spec["paths"]["/v1/resources/{domain}/{id}"]["patch"]["parameters"].append(
    {
        "name": "Idempotency-Key",
        "in": "header",
        "required": True,
        "schema": {"type": "string", "pattern": "^[A-Za-z0-9_.:-]{16,128}$"},
    }
)
for item in spec["paths"].values():
    for operation in item.values():
        if isinstance(operation, dict) and "security" in operation:
            operation["security"] = [{"bearerAuth": []}]
string = {"type": "string"}
uuid = {"type": "string", "format": "uuid"}


def closed(fields):
    return {"type": "object", "additionalProperties": False, "properties": fields, "required": list(fields)}


session = closed(
    {
        "principal_id": uuid,
        "context_id": uuid,
        "membership_id": uuid,
        "role": string,
        "institution": string,
        "region": string,
        "can_create_programme": {"type": "boolean"},
    }
)
restrictions = closed(
    {
        "holds": {
            "type": "array",
            "items": closed(
                {
                    "type": {
                        "type": "string",
                        "enum": [
                            "safety",
                            "security",
                            "rights",
                            "retention",
                            "clinical",
                            "legal",
                            "governance",
                        ],
                    },
                    "applied_at": {"type": "string", "format": "date-time"},
                }
            ),
        },
        "can_edit": {"type": "boolean"},
    }
)
for route, name, schema in [
    ("/v1/session", "Session", session),
    ("/v1/resources/ORG/{id}/restrictions", "Restrictions", restrictions),
]:
    spec["components"]["schemas"][name] = schema
    params = [{"name": "X-Context-Id", "in": "header", "required": True, "schema": uuid}]
    if "{id}" in route:
        params.append({"name": "id", "in": "path", "required": True, "schema": uuid})
    spec["paths"][route] = {
        "get": {
            "operationId": "Get" + name,
            "security": [{"bearerAuth": []}],
            "parameters": params,
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {"application/json": {"schema": {"$ref": "#/components/schemas/" + name}}},
                },
                "default": {
                    "description": "Controlled rejection",
                    "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                },
            },
        }
    }
(p / "runtime-openapi.json").write_text(json.dumps(spec, indent=2) + "\n")
