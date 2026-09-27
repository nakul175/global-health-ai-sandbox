#!/usr/bin/env python3
"""Standard-library design validation; never reports application acceptance."""
from __future__ import annotations
import argparse
import csv
import datetime as dt
from decimal import Decimal, ROUND_HALF_UP
import io
import hashlib
import json
import math
from pathlib import Path
import re
import sqlite3
import subprocess
import sys
import urllib.parse
import uuid
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / 'docs/releases/r3'

def require(condition, message):
    if not condition:
        raise AssertionError(message)

def read_json(path):
    return json.loads(path.read_text())

def walk(value):
    yield value
    if isinstance(value, dict):
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)

def resolve(document, reference):
    require(reference.startswith('#/'), 'Only local schema refs supported: '+reference)
    value = document
    for key in reference[2:].split('/'):
        value = value[key.replace('~1','/').replace('~0','~')]
    return value

def validate(schema, value, document, path='$'):
    """Checks the JSON Schema vocabulary used by this pack, not a general linter."""
    if '$ref' in schema:
        return validate(resolve(document, schema['$ref']), value, document, path)
    for keyword in ('oneOf', 'anyOf'):
        if keyword in schema:
            matches = 0
            for option in schema[keyword]:
                try:
                    validate(option,value,document,path)
                    matches += 1
                except (AssertionError, ValueError):
                    pass
            require(matches == 1 if keyword == 'oneOf' else matches > 0, path+': '+keyword+' mismatch')
            return
    if 'const' in schema:
        require(value == schema['const'] and type(value) is type(schema['const']),path+': const')
    if 'enum' in schema:
        require(value in schema['enum'],path+': enum')
    kind = schema.get('type')
    types = {'object':lambda x:isinstance(x,dict), 'array':lambda x:isinstance(x,list),
             'string':lambda x:isinstance(x,str), 'integer':lambda x:type(x) is int,
             'number':lambda x:type(x) in (int,float) and math.isfinite(x),
             'boolean':lambda x:type(x) is bool, 'null':lambda x:x is None}
    if kind:
        require(kind in types and types[kind](value),path+': type '+str(kind))
    if kind == 'object':
        require(schema.get('additionalProperties') is False,path+': open object')
        properties=schema.get('properties',{})
        require(set(schema.get('required',[])) <= set(value),path+': missing required fields')
        require(set(value) <= set(properties),path+': unknown fields '+str(set(value)-set(properties)))
        for key,child in value.items(): validate(properties[key],child,document,path+'.'+key)
    elif kind == 'array':
        require(schema.get('minItems',0)<=len(value)<=schema.get('maxItems',10**9),path+': array length')
        for i,child in enumerate(value): validate(schema['items'],child,document,f'{path}[{i}]')
    elif kind == 'string':
        require(schema.get('minLength',0)<=len(value)<=schema.get('maxLength',10**9),path+': string length')
        if 'pattern' in schema: require(re.search(schema['pattern'],value) is not None,path+': pattern')
        fmt=schema.get('format')
        if fmt=='uuid': uuid.UUID(value)
        elif fmt=='date': dt.date.fromisoformat(value)
        elif fmt=='date-time':
            parsed=dt.datetime.fromisoformat(value.replace('Z','+00:00'))
            require(parsed.tzinfo is not None,path+': timezone required')
        elif fmt=='uri': require(bool(urllib.parse.urlsplit(value).scheme),path+': URI scheme')
        elif fmt=='email': require(bool(re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+',value)),path+': email')
    elif kind in ('integer','number'):
        require(schema.get('minimum',-math.inf)<=value<=schema.get('maximum',math.inf),path+': numeric bounds')

def traceability(requirements):
    stream=io.StringIO(newline='')
    writer=csv.writer(stream,lineterminator='\n')
    writer.writerow(['requirement_id','type','stage','status','work_package','design_document','test_ids'])
    for item in requirements:
        writer.writerow([item['id'],item['type'],item['stage'],item['status'],item['work_package'],item['design_doc'],';'.join(item['test_ids'])])
    return stream.getvalue()

def check_links():
    files=[ROOT/'README.md', ROOT/'CONTRIBUTING.md', ROOT/'AGENTS.md']+list((ROOT/'docs').glob('*.md'))+list(PACK.glob('*.md'))
    count=0
    for file in files:
        if not file.exists(): continue
        text=file.read_text()
        for target in re.findall(r'!?\[[^\]]*\]\(([^)]+)\)',text):
            target=target.split(' "',1)[0]
            if re.match(r'^[a-z]+:',target) or target.startswith('#'): continue
            target=urllib.parse.unquote(target.split('#',1)[0])
            if not target: continue
            require((file.parent/target).resolve().exists(),f'Broken link in {file.relative_to(ROOT)}: {target}')
            count+=1
    return count

def check_catalogue(write):
    reqs=read_json(PACK/'requirements.json'); tests=read_json(PACK/'tests.json'); packages=read_json(PACK/'backlog.json')
    rmap={r['id']:r for r in reqs}; tmap={t['id']:t for t in tests}; pmap={p['id']:p for p in packages}
    for rows,mapping,name in [(reqs,rmap,'requirements'),(tests,tmap,'tests'),(packages,pmap,'packages')]:
        require(len(rows)==len(mapping),'Duplicate IDs in '+name)
    for r in reqs:
        require(r['status'] in ['proposed','ready','in_progress','implemented','verified','deferred','retired'],'Unknown requirement status')
        require(r['work_package'] in pmap,'Missing work package: '+r['id'])
        require(r['id'] in pmap[r['work_package']]['requirements'],'Reverse package mapping missing')
        require((PACK/r['design_doc']).is_file(),'Missing design document')
        require(r['acceptance_criteria'] and r['test_ids'],'Missing acceptance/tests')
        for tid in r['test_ids']: require(tid in tmap and tmap[tid]['requirement_id']==r['id'],'Broken test mapping '+tid)
        if r['status'] in ['implemented','verified']: require(r['implementation_evidence'],'Implementation status requires evidence')
    for t in tests:
        require(t['requirement_id'] in rmap,'Orphan test '+t['id'])
        require(t['id'] in rmap[t['requirement_id']]['test_ids'],'Reverse test mapping missing')
        require(t['steps'] and t['expected'] and t['preconditions'],'Incomplete test '+t['id'])
        require(t['status'] in ['planned','blocked','passed','failed','not_applicable'],'Unknown test status')
        if t['status'] in ['passed','failed']: require(t['evidence'],'Executed test requires evidence')
    def visit(pid,chain):
        require(pid not in chain,'Dependency cycle '+pid)
        require(pid in pmap,'Unknown dependency '+pid)
        for parent in pmap[pid]['depends_on']: visit(parent,chain+[pid])
    for p in packages:
        visit(p['id'],[])
        require(all(rid in rmap for rid in p['requirements']),'Unknown package requirement')
    expected=traceability(reqs); path=PACK/'traceability.csv'
    if write: path.write_text(expected)
    require(path.exists() and path.read_text()==expected,'Traceability stale: run --write-traceability')
    return {'requirements':len(reqs),'planned_application_tests':sum(t['status']=='planned' for t in tests),'work_packages':len(packages)}

def check_contracts():
    api=read_json(PACK/'contracts/openapi.json'); events=read_json(PACK/'contracts/events.schema.json')
    require(api['openapi']=='3.1.0','Unexpected OpenAPI version')
    for doc,schemas in [(api,api['components']['schemas']),(events,events)]:
        for item in walk(schemas):
            if not isinstance(item,dict): continue
            if '$ref' in item: resolve(doc,item['$ref'])
            if item.get('type')=='object':
                require(item.get('additionalProperties') is False,'Open nested object')
                require(set(item.get('required',[]))<=set(item.get('properties',{})),'Required field undefined')
    operation_ids=[]
    for path,operations in api['paths'].items():
        for method,op in operations.items():
            operation_ids.append(op['operationId'])
            params=[resolve(api,p['$ref']) if '$ref' in p else p for p in op.get('parameters',[])]
            require(set(re.findall(r'\{([^}]+)\}',path))=={p['name'] for p in params if p['in']=='path'},'Path parameter mismatch '+path)
            if method in ['post','put','patch','delete']:
                require(any(p['name']=='Idempotency-Key' and p['required'] for p in params),'Missing write idempotency '+path)
                require('requestBody' in op,'Missing closed request body '+path)
            if method=='put' or path.endswith('/actions'):
                require(any(p['name']=='If-Match' and p['required'] for p in params),'Missing version precondition '+path)
            require('401' in op['responses'] and '403' in op['responses'],'Missing protected error responses')
            for item in walk(op):
                if isinstance(item,dict) and '$ref' in item: resolve(api,item['$ref'])
    require(len(operation_ids)==len(set(operation_ids)),'Duplicate operation ID')
    examples=0
    for name,schema in api['components']['schemas'].items():
        for value in schema.get('examples',[]): validate(schema,value,api,name);examples+=1
    for example in read_json(PACK/'fixtures/resources.json'):
        validate(api['components']['schemas'][example['schema']],example['data'],api,example['schema']);examples+=1
    # Explicitly reject an unknown nested field and an out-of-range decimal rate.
    budget=api['components']['schemas']['BudgetInputs']; original=budget['examples'][0]
    for invalid in [dict(original,unexpected=True),dict(original,prevalence='1.01'),dict(original,screenUnitMinor=-1)]:
        try: validate(budget,invalid,api)
        except (AssertionError,ValueError): pass
        else: raise AssertionError('Invalid budget contract accepted')
    types=[e['properties']['type']['const'] for e in events['oneOf']]
    require(len(types)==len(set(types)),'Duplicate event type')
    return {'schema_definitions':len(api['components']['schemas']),'api_operations':len(operation_ids),'event_types':len(types),'valid_examples':examples}

def check_fixture():
    f=read_json(PACK/'fixtures/acceptance.json'); b=f['budget']; e=f['expected']
    require(f['classification']=='synthetic_only','Fixture must be synthetic')
    n=Decimal(b['screeningVolume']);p=Decimal(b['prevalence']);se=Decimal(b['sensitivity']);sp=Decimal(b['specificity']);r=Decimal(b['referralCompletion'])
    tp=n*p*se;fn=n*p*(1-se);fp=n*(1-p)*(1-sp);tn=n*(1-p)*sp;demand=(tp+fp)*r
    values={'tp':tp,'fn':fn,'fp':fp,'tn':tn,'confirmatoryDemand':demand,'capacityGap':max(Decimal(0),demand-b['annualCapacity'])}
    for name,value in values.items(): require(value==Decimal(e[name]),'Fixture mismatch '+name)
    variable=n*b['screenUnitMinor']+demand*b['confirmUnitMinor']
    totals=[int((variable+b['annualFixedMinor']+(b['setupMinor'] if y==0 else 0)).quantize(Decimal(1),rounding=ROUND_HALF_UP)) for y in range(b['horizonYears'])]
    gaps=[max(0,t-fund) for t,fund in zip(totals,b['securedFundingMinor'])]
    require(totals==e['annualTotalsMinor'] and sum(totals)==e['totalMinor'],'Annual/total money mismatch')
    require(gaps==e['annualFundingGapMinor'] and sum(gaps)==e['fundingGapMinor'],'Funding mismatch')
    for name,value in {'sensitivity':tp/(tp+fn),'specificity':tn/(tn+fp),'precision':tp/(tp+fp),'accuracy':(tp+tn)/n}.items():
        require(abs(value-Decimal(e[name]))<Decimal('0.0000000001'),'Metric fixture mismatch '+name)
    require(Decimal('1.5').quantize(Decimal(1),rounding=ROUND_HALF_UP)==2,'Money tie rounding')
    for example in f['supplier_result_examples']:
        require(sum(example[k] for k in ['tp','fn','fp','tn'])==example['completed'],'Supplier fixture denominator mismatch')
        if 'expectedSensitivity' in example:
            require(Decimal(example['tp'])/(example['tp']+example['fn'])==Decimal(example['expectedSensitivity']),'Supplier sensitivity fixture mismatch')
            require(Decimal(example['tn'])/(example['tn']+example['fp'])==Decimal(example['expectedSpecificity']),'Supplier specificity fixture mismatch')
        else:
            require(example['completed']<example['eligible'] and example['completeCohortAccepted'] is False,'Partial fixture must remain incomplete')
    return {'economic_fixture':'passed','clinical_validation':'not_performed'}

def check_database():
    db=sqlite3.connect(':memory:')
    db.executescript((PACK/'database/001-government-foundation.sql').read_text())
    db.executescript((PACK/'database/seed.sql').read_text())
    require(not db.execute('PRAGMA foreign_key_check').fetchall(),'Foreign key violations')
    def uid(n): return '00000000-0000-4000-8000-'+str(n).zfill(12)
    def denied(sql,args=()):
        db.execute('SAVEPOINT negative_case')
        try:
            db.execute(sql,args)
        except sqlite3.IntegrityError:
            db.execute('ROLLBACK TO negative_case');db.execute('RELEASE negative_case');return
        db.execute('ROLLBACK TO negative_case');db.execute('RELEASE negative_case')
        raise AssertionError('Database allowed forbidden mutation: '+sql)
    base="INSERT INTO gov_objects (org_id,id,kind,status,version,programme_id,created_by,payload,digest,created_at,updated_at) VALUES (?,?, 'context','draft',1,?,?,'{}',?,'2026-09-26','2026-09-26')"
    denied(base,(uid(2),uid(999),uid(100),uid(20),'a'*64))
    denied(base,(uid(1),uid(999),uid(101),uid(10),'a'*64))
    denied("UPDATE gov_objects SET status='running',version=version+1 WHERE kind='programme'")
    denied("UPDATE gov_objects SET payload='{}',version=version+1 WHERE kind='evidence'")
    denied("UPDATE gov_objects SET status='draft',version=version+1 WHERE kind='protocol'")
    denied("UPDATE gov_objects SET version=version+2 WHERE kind='programme'")
    denied("DELETE FROM gov_objects WHERE kind='evidence'")
    denied("INSERT INTO gov_reviews VALUES (?,?,?,'evidence',?,?,'approve',0,'self review','2026-09-26')",(uid(1),uid(998),uid(108),uid(10),'a'*64))
    denied("INSERT INTO gov_observations SELECT org_id,?,pilot_id,pilot_kind,source_id,source_event_id,site_id,indicator_code,value_decimal,unit,quality,observed_at,received_at,payload_digest FROM gov_observations LIMIT 1",(uid(997),))
    require(db.execute('SELECT count(*) FROM gov_reviews').fetchone()[0]==1,'Independent seeded review missing')
    api=read_json(PACK/'contracts/openapi.json');schemas=api['components']['schemas']
    mapping={'programme':'ProgrammeData','context':'ContextData','submission':'SubmissionData','protocol':'ProtocolData','run':'RunData','budget':'BudgetData','evidence':'EvidenceData','pilot':'PilotData','registry_share':'RegistryShareData','access_grant':'AccessGrantData'}
    for kind,payload,digest in db.execute('SELECT kind,payload,digest FROM gov_objects'):
        validate(schemas[mapping[kind]],json.loads(payload),api,'SQL seed '+kind)
        require(hashlib.sha256(payload.encode()).hexdigest()==digest,'Stored fixture digest mismatch')
    for reviewed,actual in db.execute('SELECT r.reviewed_digest,o.digest FROM gov_reviews r JOIN gov_objects o ON r.org_id=o.org_id AND r.object_id=o.id'):
        require(reviewed==actual,'Seed review is not for the exact evidence version')
    for payload, in db.execute("SELECT payload FROM gov_objects WHERE kind='evidence'"):
        for finding in json.loads(payload)['findings']:
            if finding['sourceResourceId']:
                actual=db.execute('SELECT digest FROM gov_objects WHERE id=?',(finding['sourceResourceId'],)).fetchone()
                require(actual and actual[0]==finding['sourceDigest'],'Seed finding source digest mismatch')
    count=db.execute("SELECT count(*) FROM sqlite_master WHERE type='table'").fetchone()[0]
    db.close()
    return {'candidate_tables':count,'negative_database_cases':9,'hosted_database_changed':False}

def check_change_note(base):
    if not base: return 'not_requested'
    require(bool(re.fullmatch('[a-fA-F0-9]{40}',base)),'Diff base must be a full commit SHA')
    changed=subprocess.check_output(['git','diff','--name-only',base,'HEAD'],cwd=ROOT,text=True).splitlines()
    app=any(p.startswith(('app/','lib/','db/','drizzle/','tests/')) or p in ['package.json','pnpm-lock.yaml'] for p in changed)
    documented=any(p.startswith('docs/') and p.endswith(('.md','.json','.csv','.sql')) for p in changed)
    require(not app or documented,'Application changes require an accompanying documentation change note')
    return 'passed'

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--write-traceability',action='store_true');parser.add_argument('--diff-base');args=parser.parse_args()
    result={'scope':'documentation_structure_and_reference_fixtures_only'}
    result.update(check_catalogue(args.write_traceability));result.update(check_contracts());result.update(check_fixture());result.update(check_database())
    result['local_links']=check_links()
    ET.parse(PACK/'wireframes.svg')
    result['documentation_change_gate']=check_change_note(args.diff_base)
    result['application_tests_executed']=0
    print(json.dumps(result,indent=2))

if __name__=='__main__':
    try: main()
    except (AssertionError,KeyError,ValueError,sqlite3.Error) as error:
        print('Documentation validation failed: '+str(error),file=sys.stderr);sys.exit(1)
