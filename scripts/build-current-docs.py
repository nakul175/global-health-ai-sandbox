#!/usr/bin/env python3
"""Rebuild derived reading copies and inventories; never infer requirement acceptance."""
import csv
import hashlib
import html
import io
import json
from pathlib import Path
import re
import sqlite3
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/current"
BASE = "870b49a343f1207b8cefbecdbfb0c5c5d10c955a"
DATE = "2026-09-28"

def read(path):
    return (ROOT / path).read_text()

def js(path):
    return json.loads(read(path))

def put(name, value):
    path = OUT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value if value.endswith("\n") else value + "\n")

def jput(name, value):
    put(name, json.dumps(value, indent=2, ensure_ascii=False))

def cput(name, headers, rows):
    stream = io.StringIO(newline="")
    writer = csv.writer(stream, lineterminator="\n")
    writer.writerow(headers)
    writer.writerows(rows)
    put(name, stream.getvalue())

def esc(value):
    return str(value).replace("|", r"\|").replace("\n", "<br>")

def table(headers, rows):
    return "\n".join(["| " + " | ".join(headers) + " |",
                       "|" + "|".join("---" for _ in headers) + "|"] +
                     ["| " + " | ".join(esc(x) for x in row) + " |" for row in rows]) + "\n"

def header(title):
    return ("# " + title + "\n\nDocumentation edition **1.1**, " + DATE +
            ". Reconciled to repository source **" + BASE[:12] +
            "**: hosted alpha package 0.6.0 plus PR #13; deployment not requalified.\n\n")

source = js("docs/source-backlog/source_traceability_model.json")
backlog = js("docs/source-backlog/backlog.json")
r2 = js("docs/source-backlog/r2/requirements.json")
r3 = js("docs/releases/r3/requirements.json")
catalogue = js("native-baseline/tests/reference/source_test_catalogue.json")
captext = read("lib/capabilities.ts")
caps = json.loads(captext[captext.index("["):captext.rindex("]") + 1])
capmap = {x["id"]: x for x in caps}
modulemap = {x["code"]: x for x in source["modules"]}

# These are domain relationships, not assertions that every requirement in a domain is implemented.
relationships = {
    "ORG": ("lib/domain.ts;lib/store.ts", "Synthetic institution/programme workflow; real institutional ownership and lifecycle incomplete."),
    "IAM": ("app/chatgpt-auth.ts;lib/domain.ts;lib/store.ts", "Dispatcher-authenticated owner and synthetic roles; real institution membership and independent people absent."),
    "ACC": ("lib/domain.ts;lib/suite.ts;lib/store.ts", "Bounded role/grant/hold checks; full regional and institutional authority remains open."),
    "WFL": ("lib/domain.ts;lib/store.ts", "Exact study snapshot review with different test-person checks; production authorities absent."),
    "DAC": ("lib/domain.ts;lib/suite.ts", "Synthetic dataset/media grants; not general clinical-data purpose/region control."),
    "ING": ("app/api/suite/media/route.ts;lib/suite.ts;lib/domain.ts", "Strict CSV and bounded synthetic WAV upload/quarantine; scanner and clinical ingestion absent."),
    "CUR": ("lib/lab.ts;lib/suite.ts", "Generated references and participant partitions; independent sealed-label service absent."),
    "RUN": ("lib/domain.ts;lib/lab.ts;lib/suite.ts", "Fixed/portable model execution and manually dispatched jobs; no arbitrary containers/GPU."),
    "PRO": ("lib/domain.ts;lib/lab.ts", "Bounded protocol/configuration freezes; full clinical methodology remains open."),
    "VAL": ("lib/lab.ts;lib/suite.ts", "Computed synthetic metrics, uncertainty and paired comparisons; no clinical validation."),
    "MOD": ("lib/lab.ts;lib/suite.ts", "Synthetic tabular/audio subset only; no general multimodal platform."),
    "SAF": ("lib/domain.ts;lib/store.ts", "Synthetic concerns and holds; independent operational safety authority incomplete."),
    "EVD": ("lib/attestation.ts;lib/domain.ts;lib/lab.ts", "Immutable reports, correction and application signatures; no institutional certification."),
    "API": ("app/api;lib/connections.ts;lib/connection-store.ts", "Hosted command/API and public HTTPS JSON subset; full regional/national-system contracts absent."),
    "AUD": ("lib/store.ts;lib/checkpoint.ts", "Application audit, snapshots and receipts; external immutable assurance incomplete."),
    "OPS": ("lib/checkpoint.ts;scripts/restore-checkpoint.mjs", "Encrypted capture and isolated restore; no measured regional recovery or production SLA."),
    "SEC": ("lib/http.ts;lib/store.ts;lib/connections.ts", "Bounded application security controls; independent full security acceptance absent."),
    "INTG": ("lib/store.ts;lib/connection-store.ts", "Atomic intent and scoped persistence; full distributed contract acceptance absent."),
    "USA": ("app/workspace.tsx;app/laboratory.tsx;app/suite.tsx", "Responsive controls and retained inputs; hosted authenticated accessibility/UAT unverified."),
    "MNT": ("package.json;drizzle;scripts/check-docs.py", "Versioned source, migrations and documentation checks; full maintenance NFR acceptance open."),
}

def relation(domain):
    return relationships.get(domain, ("", "No requirement-level acceptance established; retain the full target requirement."))

allreq = []
for r in source["requirements"]:
    paths, detail = relation(r["domain"])
    allreq.append({
        "catalogue": "original", "id": r["id"], "title": r["title"],
        "release": r["release"], "status": "acceptance_not_established",
        "source_statement": r["statement"], "source_acceptance": r["acceptance"],
        "source_file": "docs/source-backlog/source_traceability_model.json",
        "design": "docs/current/FSD-v1.1.md", "related_source_paths": paths.split(";") if paths else [],
        "relationship_level": "domain_only_not_requirement_acceptance",
        "current_boundary": detail, "executed_case_mapping": [],
    })
for r in r2:
    c = capmap[r["id"]]
    detail = c["detail"]
    if r["id"] == "V2-SEC-005":
        detail = ("v0.6 live connector credentials are accepted and AES-GCM encrypted with scope binding. "
                  "The current in-app register's older 'No provider secrets accepted' sentence is stale. "
                  "Independent workload secret management remains absent.")
    allreq.append({
        "catalogue": "synthetic_r2", "id": r["id"], "title": r["title"],
        "release": r["milestone"], "status": "acceptance_not_established",
        "source_statement": r["requirement"], "source_acceptance": r["acceptance_criteria"],
        "source_file": "docs/source-backlog/r2/requirements.json",
        "design": "docs/RELEASE_2_WORKBENCH.md",
        "related_source_paths": ["lib/capabilities.ts"],
        "relationship_level": "source_declared_bounded_capability",
        "source_mode": c["mode"], "current_boundary": detail, "executed_case_mapping": [],
    })
for r in r3:
    allreq.append({
        "catalogue": "government_r3", "id": r["id"], "title": r["title"],
        "release": r["stage"], "status": r["status"],
        "source_statement": r["requirement"], "source_acceptance": r["acceptance_criteria"],
        "source_file": "docs/releases/r3/requirements.json",
        "design": "docs/releases/r3/" + r["design_doc"],
        "related_source_paths": [], "relationship_level": "proposed_design",
        "current_boundary": "Proposed government workflow; application implementation not started.",
        "executed_case_mapping": [], "planned_test_ids": r["test_ids"],
    })
jput("IMPLEMENTATION-REGISTER.json", {"edition": "1.1", "baseline": BASE, "requirements": allreq,
     "note": "600 catalogue entries, not 600 deduplicated product outcomes. No new acceptance is inferred.",
     "modules": source["modules"], "critical_scenarios": source["critical"]})
cput("TRACEABILITY.csv",
     ["catalogue", "requirement_id", "title", "source_release", "acceptance_status", "source_file",
      "design", "related_source_paths", "relationship_level", "current_boundary", "planned_test_ids"],
     [[r["catalogue"],r["id"],r["title"],r["release"],r["status"],r["source_file"],r["design"],
       ";".join(r["related_source_paths"]),r["relationship_level"],r["current_boundary"],
       ";".join(r.get("planned_test_ids", []))] for r in allreq])

common = """The original functional and quality targets remain authoritative for intended outcomes. This reading edition is reconstructed from the preserved, structured BRD/FSD traceability model; it is not a byte-identical recovery of the missing original Word documents. No requirement text or release assignment is replaced by the smaller alpha. Government R3 is a separate additive design catalogue.

Current implementation and historical execution evidence are separated in [Implementation](../IMPLEMENTATION.md), [qualification](../QUALIFICATION.md) and [traceability](TRACEABILITY.csv). Related source paths indicate where to investigate a domain; they do not prove each requirement passes. Formal requirement acceptance remains unestablished.

"""
brd = header("Business requirements — full target and current profile") + common
brd += """## Product purpose and decision

Support governed health-AI assessment from institutional onboarding and health needs through controlled evaluation, independent evidence, adoption and oversight. The immediate alpha demonstrates synthetic evaluation plumbing. The proposed government adoption workflow supports comparison, affordability and a documented pilot decision.

The institutional programme lead owns the decision; evaluators own method; data custodians own allowed use; independent reviewers own evidence review; finance and procurement assess cost and procurement suitability. Vendors submit their own solution evidence. Platform support does not inherit clinical or evidence-approval authority.

Success for the proposed first government pilot means a real programme can use and explain a reviewed decision pack, identify unfunded recurring costs, reproduce evidence and hand work to another authorised officer. No customer success, savings, approval, commercial price or clinical benefit has yet been established.

## Baseline scope

456 original requirements: 369 functional and 87 quality requirements. Original release allocations: R1 322, R2 131, R3 3. The separate synthetic R2 catalogue has 81 entries; the separate government R3 catalogue has 63. Release names across these catalogues are not interchangeable.

"""
brd += table(["Module","Outcome area","Records"], [[m["code"],m["title"],m["records"]] for m in source["modules"]])
brd += "\n## Complete retained business requirements\n\n"
for r in source["requirements"]:
    brd += "### " + r["id"] + " — " + r["title"] + "\n\n"
    brd += "**" + r["priority"] + " · original " + r["release"] + "**\n\n" + r["statement"] + "\n\n"
    brd += "**Acceptance:** " + r["acceptance"] + "\n\n"
brd += """## Government extension and open decisions

The [R3 BRD](../releases/r3/01-brd.md) preserves all government business rules, buying unit, staged scope and objectives. R3A is institutional comparison/context/budget/evidence; R3B is selected integration/pilot monitoring; R3C is sharing/portfolio/hosting portability. [Open decisions](../releases/r3/16-decisions-and-release-gates.md) still require actual owners, institutions, deployment policies and evidence. No unrequested product scope or automatic procurement authority is introduced by this edition.
"""
put("BRD-v1.1.md", brd)

fsd = header("Functional specification — full target and implementation boundaries") + common
fsd += """## Consistent workflow rules

The target operates with current identity, organisation, record, purpose, field and hold policy. Independent approval is based on a verified person rather than a different login. Submitted/frozen/issued records retain their exact versions; changes use successors. Unknown external outcomes require reconciliation. Missing evidence stays missing.

The hosted adapter instead uses one real owner's synthetic profiles. Its smaller schemas and route set are documented in [current API inventory](CURRENT-API-INVENTORY.md); these are not the original /v1 or proposed /v2 and /api/v3 contracts. The [current user guide](USER-GUIDE.md) describes the available experience.

"""
for m in source["modules"]:
    fsd += "## " + m["code"] + " — " + m["title"] + "\n\n" + m["actors"] + "\n\n"
    fsd += "**Current relationship:** " + relation(m["code"])[1] + "\n\n"
    fsd += table(["Field","Type/requirement","Validation/meaning"], m["fields"]) + "\n"
    for r in source["functional"]:
        if r["domain"] != m["code"]: continue
        fsd += "### " + r["fs"] + " / " + r["id"] + " — " + r["title"] + "\n\n"
        fsd += r["behaviour"] + "\n\n**Exception:** " + r["exception"] + "\n\n"
        fsd += "**Acceptance:** " + r["fs_acceptance"] + "\n\n**Target screen:** " + r["screen"] + " · " + r["release"] + "\n\n"
fsd += "## Complete quality-control contracts\n\n"
for r in source["quality"]:
    fsd += "### " + r["qc"] + " / " + r["id"] + " — " + r["title"] + "\n\n"
    fsd += r["statement"] + "\n\n**Realisation:** " + r["realisation"] + "\n\n"
    fsd += "**Verification:** " + r["verification"] + "\n\n**Acceptance:** " + r["acceptance"] + "\n\n"
fsd += "## Later specifications\n\n" + table(["Catalogue","Canonical source","Current state"], [
    ["Synthetic R2","[81 requirements](../source-backlog/r2/requirements.json)","Bounded capabilities in current alpha; full source acceptance remains open"],
    ["Government R3","[FSD](../releases/r3/02-fsd.md) and [63 requirements](../releases/r3/requirements.json)","Proposed; all 134 application cases remain planned"]])
put("FSD-v1.1.md", fsd)

# Exact route inventory and command definitions from executable source.
routes = []
for p in sorted((ROOT / "app/api").rglob("route.ts")):
    for method in re.findall(r"export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)", p.read_text()):
        routes.append({"method":method,"path":"/"+str(p.relative_to(ROOT / "app").parent),"source":str(p.relative_to(ROOT))})
commands = []
for filename,var in [("lib/domain.ts","schemas"),("lib/lab.ts","labSchemas"),("lib/suite.ts","suiteSchemas")]:
    txt=read(filename)
    block=txt.split("export const "+var,1)[1].split("} as const",1)[0]
    permissions = dict((a,re.findall(r"'([^']+)'",roles)) for a,roles in
                       re.findall(r"'([^']+)'\s*:\s*\[([^\]]*)\]", txt.split("Permissions" if var!="schemas" else "export const permissions",1)[-1]))
    for action,definition in re.findall(r"^\s*'([^']+)':(.*),\s*$",block,re.M):
        commands.append({"action":action,"definition":definition,"source":filename,"roles":permissions.get(action,[])})
internal={"suite.upload.part","suite.upload.finalize","suite.media.result"}
for c in commands: c["entry"]="internal_media_route_only" if c["action"] in internal else "POST /api/commands"
jput("API-INVENTORY.json", {"baseline":BASE,"http_operations":routes,"commands":commands,
      "live_connection_actions":["save","test","activate","disable","abandon","run"]})
api=header("Current API and command inventory")
api += """Inventory is extracted from executable hosted routes and closed command schemas. Dispatcher sign-in/out/callback routes are platform-owned, not additional application route files. Query parameters do not confer authority. The v0.6 connector commands have their own version/idempotency contract; do not assume all routes accept the workspace command envelope.

"""
api += table(["Method","Route","Executable source"], [[r["method"],r["path"],"[source](../../"+r["source"]+")"] for r in routes])
api += "\n## Command schemas and permissions\n\n"
api += "Three internal media actions are rejected by the public command route and may only be invoked after media-route validation. The role list is only one predicate; active membership, institution status, holds, grants, exact version and record state also apply.\n\n"
api += table(["Action","Entry","Allowed test roles","Source"], [[c["action"],c["entry"],", ".join(c["roles"]),"[source](../../"+c["source"]+")"] for c in commands])
api += "\n## Exact closed definitions\n\n"
for c in commands:
    api += "### "+c["action"]+"\n\n~~~typescript\n"+c["definition"]+"\n~~~\n\n"
api += """## Specialised routes

- [Connections](../SELF_SERVICE_CONNECTIONS.md): save/test/activate/disable/abandon/run; encrypted credentials, current config and consent, endpoint policy, per-connector history and unknown outcomes.
- [Media](../WORKBENCH_API.md): part PUT, finalise POST, protected GET and inference PATCH.
- [Signatures/checkpoints](../ASSURANCE_0_5.md): P-256 application signatures; encrypted capture, download and verification; no production restore route.
- [Core](../API_CONTRACT.md), [lab](../RELEASE_2_API.md) and [workbench](../WORKBENCH_API.md) remain the detailed transport references.
- [R3 API](../releases/r3/06-api-and-events.md) is proposed; its routes do not belong in the implemented inventory.
"""
put("CURRENT-API-INVENTORY.md",api)

db=sqlite3.connect(":memory:")
migrations=[]
for p in sorted((ROOT/"drizzle").glob("*.sql")):
    db.executescript(p.read_text())
    migrations.append({"path":str(p.relative_to(ROOT)),"sha256":hashlib.sha256(p.read_bytes()).hexdigest()})
tables=[]
for name,sql in db.execute("SELECT name,sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"):
    tables.append({"table":name,"sql":sql,"columns":[list(x) for x in db.execute('PRAGMA table_info("'+name+'")')],
                   "foreign_keys":[list(x) for x in db.execute('PRAGMA foreign_key_list("'+name+'")')]})
assert not db.execute("PRAGMA foreign_key_check").fetchall()
db.close()
jput("DATA-DICTIONARY.json",{"baseline":BASE,"migrations":migrations,"tables":tables})
dd=header("Current data dictionary and migration ledger")
dd+="The four hosted migrations are applied, in order, to disposable SQLite during documentation generation. This validates the inventory, not hosted D1 performance or deployment. JSON body rules remain in the closed TypeScript domain schemas. D1 has application-enforced owner scope, not PostgreSQL RLS.\n\n"
dd+=table(["Migration","SHA-256"], [[m["path"],m["sha256"]] for m in migrations])
for t in tables:
    dd+="\n## "+t["table"]+"\n\n"+table(["Ordinal","Column","SQL type","Required","Default","Primary key"], t["columns"])
    dd+="\n~~~sql\n"+t["sql"]+";\n~~~\n"
dd+="\n## Full migration text\n\n"
for m in migrations: dd+="### "+m["path"]+"\n\n~~~sql\n"+read(m["path"])+"\n~~~\n\n"
dd+="R3 candidate SQL remains under [releases/r3/database](../releases/r3/database/001-government-foundation.sql), outside active migrations. The original PostgreSQL profile remains under [native-baseline](../../native-baseline/README.md).\n"
put("CURRENT-DATA-DICTIONARY.md",dd)

# Baseline test text and status are copied unchanged; execution evidence remains separate.
for sheet,data in catalogue.items():
    cput("test-catalogue/"+sheet.lower().replace(" ","-")+".csv",data["headers"],data["rows"])
jput("test-catalogue/synthetic-r2.json",js("docs/source-backlog/r2/test_catalogue.json"))
jput("test-catalogue/government-r3.json",js("docs/releases/r3/tests.json"))
executions=[]
for path,profile,date in [
    ("verification/r2-unit-integration.xml","hosted-v0.6","2026-09-26"),
    ("native-baseline/verification/application-tests.xml","native-v0.1","2026-09-25")]:
    for i,t in enumerate(ET.fromstring(read(path)).iter("testcase")):
        status="failed" if t.find("failure") is not None or t.find("error") is not None else "skipped" if t.find("skipped") is not None else "passed"
        executions.append([profile,date,"historical_machine_report",str(i+1),t.get("name",""),status,path,
                           "Historical source only; not rerun for the documentation update or PR #13."])
for i,t in enumerate(js("verification/http-tests.json")["checks"]):
    executions.append(["hosted-v0.6","2026-09-26","historical_machine_report",str(i+1),t["name"],t["status"],
                       "verification/http-tests.json","Built-Worker local environment; not hosted authenticated UAT."])
def browser(suites):
    for suite in suites:
        for spec in suite.get("specs",[]): yield spec
        yield from browser(suite.get("suites",[]))
for spec in browser(js("native-baseline/verification/browser-tests.json")["suites"]):
    executions.append(["native-v0.1","2026-09-25","historical_browser_report",spec["id"],spec["title"],
                       "passed" if spec["ok"] else "not_passed","native-baseline/verification/browser-tests.json",
                       "Native local slice only; not hosted UI evidence."])
cput("EXECUTION-REGISTER.csv",["profile","date","evidence_type","case_identity","name","reported_status","evidence_path","qualification"],executions)

screen_rows=[]
screen_data=[]
for s in source["screens"]:
    mod=modulemap.get(s["domain"],{})
    item=dict(s,classification="original_target",source="docs/source-backlog/source_traceability_model.json",
              fields=mod.get("fields",[]),current_boundary=relation(s["domain"])[1])
    screen_data.append(item)
    screen_rows.append([s["id"],s["title"],s["route"],"original_target","Not a confirmed implemented route",item["source"],item["current_boundary"]])
workspace=read("app/workspace.tsx")
for sid,label,desc in re.findall(r"\{id:'([^']+)',label:'([^']+)',icon:\w+,group:'[^']+',description:'([^']+)'",workspace):
    screen_data.append({"id":"ALPHA-"+sid,"title":label,"route":"/#"+sid,"domain":"ALPHA",
                        "behaviour":desc,"classification":"current_alpha_view","source":"app/workspace.tsx",
                        "fields":[],"current_boundary":"Existing synthetic UI view; no new browser acceptance claimed."})
for file,prefix in [("app/laboratory.tsx","laboratory"),("app/suite.tsx","suite")]:
    for sid in re.findall(r'<TabsContent value="([^"]+)"',read(file)):
        screen_data.append({"id":"ALPHA-"+prefix+"-"+sid,"title":prefix.title()+" / "+sid,
                            "route":"/#"+prefix+"/"+sid,"domain":"ALPHA","behaviour":"Source-backed "+prefix+" tab. See current user guide for actions and limits.",
                            "classification":"current_alpha_tab","source":file,"fields":[],
                            "current_boundary":"Live, bounded and simulated actions may coexist; inspect the record's execution mode."})
for s in screen_data:
    if s["classification"]!="original_target":
        screen_rows.append([s["id"],s["title"],s["route"],s["classification"],"Source-backed view; UAT not established",s["source"],s["current_boundary"]])
cput("SCREEN-COVERAGE.csv",["screen_id","title","target_or_hash_route","classification","acceptance","source","boundary"],screen_rows)
jput("screens.json",screen_data)
wire="""<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Global Health AI Sandbox — screen atlas</title><style>
*{box-sizing:border-box}body{margin:0;background:#f3f5f4;color:#18352d;font:16px/1.5 system-ui,sans-serif}header{background:#133c32;color:#fff;padding:28px 36px}header h1{font-size:28px;margin:0 0 6px}header p{max-width:1000px;margin:0;color:#d3e6df}main{display:grid;grid-template-columns:330px minmax(0,1fr);gap:24px;max-width:1500px;margin:auto;padding:28px}aside,article{background:white;border:1px solid #dbe4df;border-radius:12px;padding:20px}aside{align-self:start;position:sticky;top:16px}label{display:block;font-weight:650;margin:8px 0}input,select{width:100%;padding:11px;border:1px solid #819a90;border-radius:5px;font:inherit}#list{max-height:60vh;overflow:auto;margin-top:18px}button{width:100%;text-align:left;border:0;border-bottom:1px solid #e1e7e4;background:white;color:#18352d;padding:12px;font:inherit;cursor:pointer}button[aria-current=true]{background:#dcefe5;border-left:4px solid #27684f}button:hover{background:#eef5f1}button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #bf7800;outline-offset:2px}.badge{display:inline-block;background:#fff0c9;padding:5px 10px;border-radius:5px;font-size:13px}.frame{border:2px dashed #b6c9bf;border-radius:10px;margin:24px 0;padding:24px;background:#f8fbf9}.frame h3{margin:0 0 16px}.field{background:#fff;border:1px solid #c9d7cf;padding:12px;margin:10px 0}.field strong{display:block}small,.meta{color:#526c60}.split{display:grid;grid-template-columns:1fr 1fr;gap:16px}.notice{border-left:4px solid #c99834;padding:14px;background:#fff8e8}code{overflow-wrap:anywhere}h2{font-size:28px;line-height:1.2}footer{margin-top:30px;padding-top:16px;border-top:1px solid #dbe4df;color:#526c60}@media(max-width:800px){main{grid-template-columns:1fr;padding:12px}aside{position:static}#list{max-height:220px}.split{grid-template-columns:1fr}header{padding:24px}h2{font-size:24px}}
</style><header><h1>Global Health AI Sandbox</h1><p>Documentation screen atlas · Edition 1.1 · Original target screens and current alpha navigation. Layouts below are illustrative documentation, with no backend, credentials or real patient data.</p></header>
<main><aside><label for="search">Find a screen</label><input id="search" type="search" placeholder="Name, module or screen ID"><label for="filter">Screen set</label><select id="filter"><option value="">All screens</option><option value="original_target">Original target specification</option><option value="current_alpha">Current alpha views and tabs</option></select><p id="count" aria-live="polite"></p><nav id="list" aria-label="Screens"></nav></aside><article id="detail" aria-live="polite"></article></main>
<script>const screens=__DATA__;const E=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};let selected=screens[0].id;
function show(s){selected=s.id;const a=document.querySelector('#detail');a.replaceChildren();a.append(E('span',s.classification.replaceAll('_',' '),'badge'),E('h2',s.title),E('p',s.id+' · '+s.route,'meta'),E('p',s.behaviour));const f=E('section',undefined,'frame');f.append(E('h3','Illustrative workspace'),E('p','Institution / programme context · access and evidence class visible','meta'));if(s.fields.length){for(const field of s.fields){const r=E('div',undefined,'field');r.append(E('strong',field[0]),E('small',field[1]),E('p',field[2]));f.append(r)}}else{const grid=E('div',undefined,'split');for(const title of ['Context and permitted actions','Records, findings and next step']){const box=E('div',undefined,'field');box.append(E('strong',title),E('p','The source-backed behaviour above defines this view. This atlas does not imitate saved application results.'));grid.append(box)}f.append(grid)}f.append(E('p','Draft → authorised review → recorded outcome. Exact states and permissions follow the applicable source specification.','meta'));a.append(f,E('p',s.current_boundary,'notice'),E('footer','Source: '+s.source+' · Prototype navigation only. No new application acceptance result.'));for(const b of document.querySelectorAll('#list button'))b.setAttribute('aria-current',String(b.dataset.id===selected))}
function render(){const q=document.querySelector('#search').value.toLowerCase(),filter=document.querySelector('#filter').value;const rows=screens.filter(s=>(!filter||s.classification.startsWith(filter))&&(s.id+' '+s.title+' '+s.domain).toLowerCase().includes(q));const nav=document.querySelector('#list');nav.replaceChildren();document.querySelector('#count').textContent=rows.length+' screens';for(const s of rows){const b=E('button',s.id+' · '+s.title);b.type='button';b.dataset.id=s.id;b.setAttribute('aria-current',String(s.id===selected));b.onclick=()=>show(s);nav.append(b)}}
document.querySelector('#search').oninput=render;document.querySelector('#filter').onchange=render;render();show(screens[0]);
</script></html>"""
put("Wireframes-v1.1.html",wire.replace("__DATA__",json.dumps(screen_data,ensure_ascii=False).replace("</","<\\/")))

# Reading editions of all ten original engineering specifications keep the detailed original text.
for p in sorted((ROOT/"native-baseline/specs").glob("*.md")):
    name=p.stem.split("_",1)[1].replace("_","-")+"-v1.1.md"
    intro=header(p.stem.split("_",1)[1].replace("_"," ")+" — reconciled reading edition")
    intro+="""## Current implementation profile

The retained specification below describes the original regional target architecture. Current hosted execution is Worker/D1/R2 with owner-scoped synthetic people; the native FastAPI/PostgreSQL programme slice remains a separate development profile. Do not use original /v1 contracts, eight-MiB upload chunks, real independent identity or PostgreSQL RLS as descriptions of the hosted adapter.

Use [current architecture](HLD-v1.1.md), [current implementation](../IMPLEMENTATION.md), [API inventory](CURRENT-API-INVENTORY.md), [data dictionary](CURRENT-DATA-DICTIONARY.md), [qualification](../QUALIFICATION.md) and [release acceptance](RELEASE-ACCEPTANCE.md) for delivered scope. Proposed government design is in [R3](../releases/r3/README.md). Original source IDs and acceptance text are unchanged.

"""
    intro+="## Retained original engineering specification\n\nOriginal: ["+p.name+"](../../"+str(p.relative_to(ROOT))+").\n\n"
    put(name,intro+p.read_text())

counts={k:len(v["rows"]) for k,v in catalogue.items()}
case_sheets=["Functional","Quality","Critical","Unit","Integration","Smoke"]
case_count=sum(counts[k] for k in case_sheets)
test=header("Test strategy, scenarios and execution boundaries")
test+="""The current catalogue preserves every original row and original status. Reference-function success is not application success. This documentation change runs document, inventory and reference-fixture checks only; it does not run application or clinical acceptance.

"""
test+=table(["Catalogue section","Entries","Reading/export copy"],[[k,counts[k],"[CSV](test-catalogue/"+k.lower().replace(" ","-")+".csv)"] for k in counts])
test+="\nThe six original case suites contain **"+str(case_count)+" designed cases**. The 456 scenario rows, 47 HTTP script rows, fixture rows and traceability rows are supporting records, not additional executed tests. Separate [synthetic R2](test-catalogue/synthetic-r2.json) has 81 cases and [government R3](test-catalogue/government-r3.json) has 134 planned cases. These catalogues overlap conceptually; no unique total coverage percentage is inferred.\n\n"
test+="""## Execution and release qualification

[Execution register](EXECUTION-REGISTER.csv) extracts exact historical identities and outcomes from the committed XML/JSON reports. Current-main PR #13 results are separately attributed in [qualification](../QUALIFICATION.md), because its new machine reports were not committed. Never assign those aggregate numbers to unnamed case rows.

Run changed-domain unit checks, database and actual HTTP/worker tests against the exact candidate. Independently authenticated browser acceptance, cross-owner denial, stale/replayed intent, failed predictions, secret masking, interrupted effects and recovery must use the intended deployment profile. Native PostgreSQL evidence does not come from PGlite, and deployed-provider evidence does not come from a local receiver.

## Critical acceptance journeys

"""
for c in source["critical"]:
    test+="### "+c["id"]+" — "+c["title"]+"\n\n**Requirements:** "+", ".join(c["refs"])+"\n\n**Fixture:** "+c["fixture"]+"\n\n**Action:** "+c["action"]+"\n\n**Expected:** "+c["expected"]+"\n\n"
test+="## Government first-slice acceptance\n\nFollow the full [R3 test plan](../releases/r3/10-test-plan.md): two real principals/organisations, supplier isolation, frozen comparison, known budget fixture, independent pack review, exact export and denial/recovery variants. All R3 cases stay planned until executed evidence supports the intended environment.\n"
put("Test-Strategy-v1.1.md",test)
jput("inventory-summary.json",{"edition":"1.1","baseline":BASE,"original_requirements":456,
    "synthetic_r2_requirements":81,"government_r3_requirements":63,"original_case_suites":case_count,
    "catalogue_rows":counts,"historical_execution_rows":len(executions),"http_operations":len(routes),
    "command_definitions":len(commands),"public_commands":len(commands)-len(internal),
    "internal_media_commands":len(internal),"hosted_tables":len(tables),"active_migrations":len(migrations),
    "original_target_screens":len(source["screens"]),"alpha_views_and_tabs":len(screen_data)-len(source["screens"]),
    "atlas_screens":len(screen_data)})
print(json.dumps(js("docs/current/inventory-summary.json"),indent=2))
