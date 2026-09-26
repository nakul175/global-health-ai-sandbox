import json,copy
from pathlib import Path
import pytest
from jsonschema import Draft202012Validator, FormatChecker
from openapi_spec_validator import validate
ROOT=Path(__file__).resolve().parents[1]
API=json.loads((ROOT/'contracts/openapi.json').read_text());SCHEMAS=API['components']['schemas']; CMDS=json.loads((ROOT/'contracts/command_registry.json').read_text())
def example(s):
 if '$ref' in s:return example(SCHEMAS[s['$ref'].split('/')[-1]])
 if 'oneOf' in s:return example(s['oneOf'][0])
 if 'const' in s:return s['const']
 if 'enum' in s:return s['enum'][0]
 t=s.get('type'); t=t[0] if isinstance(t,list) else t
 if t=='object':return {k:example(v) for k,v in s.get('properties',{}).items() if k in s.get('required',[])}
 if t=='array':return [example(s['items']) for _ in range(s.get('minItems',1))]
 if t=='integer':return max(s.get('minimum',0),s.get('exclusiveMinimum',-1)+1)
 if t=='number':return max(s.get('minimum',0),s.get('exclusiveMinimum',-1)+1)
 if t=='boolean':return True
 if t=='null':return None
 if s.get('format')=='uuid':return '11111111-1111-4111-8111-111111111111'
 if s.get('format')=='date-time':return '2026-09-25T00:00:00Z'
 if s.get('format')=='email':return 'synthetic@example.invalid'
 if '64' in s.get('pattern',''):return 'a'*64
 if s.get('pattern')=='^[A-Z][A-Z0-9_]{2,31}$':return 'DEMO'
 if s.get('pattern')=='^[A-Z]{2}$':return 'ZZ'
 if s.get('pattern')=='^[A-Z]{3}$':return 'USD'
 if s.get('pattern')=='^[a-z][a-z0-9_]{0,79}$':return 'synthetic_score'
 return 'x'*max(1,s.get('minLength',1))
def validator(name):return Draft202012Validator({'$ref':'#/components/schemas/'+name,'components':API['components']},format_checker=FormatChecker())
def test_openapi_valid():validate(API)
def test_every_object_closed():
 def walk(v):
  if isinstance(v,dict):
   if v.get('type')=='object':assert v.get('additionalProperties') is False
   for child in v.values():walk(child)
  elif isinstance(v,list):
   for child in v:walk(child)
 walk(SCHEMAS)
@pytest.mark.parametrize('cmd',CMDS,ids=lambda c:c['id'])
def test_command_unknown_field_rejected(cmd):
 name=cmd['name']+'Request';data=example(SCHEMAS[name])
 if cmd['name']=='DecideAccessRequest':data['payload']['approved_scope']=example(SCHEMAS[name]['properties']['payload']['properties']['approved_scope'])
 validator(name).validate(data)
 data['payload']['unexpected_privilege']='OP'
 assert list(validator(name).iter_errors(data))
def test_all_source_requirements_mapped():
 b=json.loads((ROOT/'backlog/backlog.json').read_text());assert len(b)==456;assert len({x['requirement_id'] for x in b})==456;assert sum(x['release']=='R1' for x in b)==322
@pytest.mark.parametrize('n,valid',[(0,False),(1,True),(10737418240,True),(10737418241,False)])
def test_upload_size_boundaries(n,valid):
 data=example(SCHEMAS['UploadCreate']);data['total_bytes']=n;assert (not list(validator('UploadCreate').iter_errors(data)))==valid
@pytest.mark.parametrize('i,valid',[(-1,False),(0,True),(1279,True),(1280,False)])
def test_upload_part_boundaries(i,valid):
 data=example(SCHEMAS['UploadPart']);data['index']=i;assert (not list(validator('UploadPart').iter_errors(data)))==valid
@pytest.mark.parametrize('name',['IntendedUse','ResourcePayload','MetricObservation'])
def test_nested_extensions_rejected(name):
 data=example(SCHEMAS[name]);data['arbitrary']='not allowed';assert list(validator(name).iter_errors(data))
def test_error_catalogue_consistency():
 errors=json.loads((ROOT/'contracts/errors.json').read_text());assert set(x['code'] for x in errors)==set(SCHEMAS['Error']['properties']['error']['properties']['code']['enum'])
def test_events_closed_and_unique():
 e=json.loads((ROOT/'contracts/events.schema.json').read_text());Draft202012Validator.check_schema(e)
 assert len({x['properties']['event_type']['const'] for x in e['oneOf']})==44
 for schema in e['oneOf']:
  data=example(schema);Draft202012Validator(schema,format_checker=FormatChecker()).validate(data)
  data['payload']['patient_name']='reject';assert list(Draft202012Validator(schema).iter_errors(data))
def test_fixture_repeatability():
 import uuid
 m=json.loads((ROOT/'fixtures/manifest.json').read_text());ns=uuid.UUID(m['namespace']);assert str(uuid.uuid5(ns,'A'))==m['tenants']['A']['id'];assert m['known_results']['missing'] is None
