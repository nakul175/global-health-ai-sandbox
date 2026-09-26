"""Live smoke subset. Requires a disposable application seeded with fixtures, never production."""
import os,json,uuid
from pathlib import Path
import pytest,httpx
from jsonschema import Draft202012Validator,FormatChecker
P=Path(__file__).resolve().parents[1]
@pytest.fixture(scope='module')
def env():
 required=['BASE_URL','TEST_TOKEN_A_PM','TEST_TOKEN_B_PM','ALLOW_SYNTHETIC_HTTP_TESTS']
 missing=[k for k in required if not os.getenv(k)]
 if missing:pytest.fail('Live test prerequisites absent: '+','.join(missing))
 if os.environ['ALLOW_SYNTHETIC_HTTP_TESTS']!='true':pytest.fail('Explicit disposable synthetic test environment required')
 m=json.loads((P/'fixtures/manifest.json').read_text());api=json.loads((P/'contracts/openapi.json').read_text())
 return dict(base=os.environ['BASE_URL'].rstrip('/'),manifest=m,api=api)
def headers(e,tenant='A'):
 return {'Authorization':'Bearer '+os.environ['TEST_TOKEN_'+tenant+'_PM'],'X-Context-Id':e['manifest']['tenants'][tenant]['contexts']['PM']}
def valid(e,schema,data):Draft202012Validator({'$ref':'#/components/schemas/'+schema,'components':e['api']['components']},format_checker=FormatChecker()).validate(data)
def test_liveness_and_readiness(env):
 for route in ['/health/live','/health/ready']:
  r=httpx.get(env['base']+route,timeout=10);assert r.status_code==200;valid(env,'Liveness',r.json())
def test_anonymous_denied(env):
 r=httpx.get(env['base']+'/v1/me',timeout=10);assert r.status_code==401;valid(env,'Error',r.json())
def test_first_programme_workflow_and_conflicts(env):
 a=env['manifest']['tenants']['A'];key='acceptance_'+uuid.uuid4().hex
 body={'title':'Synthetic acceptance programme','classification':'internal','schema_version':'1.1','payload':{'kind':'Programme','data':{'code':'TEST_'+uuid.uuid4().hex[:8].upper(),'name':'Synthetic programme','description':'Synthetic acceptance fixture only','owner_membership_ref':a['memberships']['PM'],'country_codes':['ZZ'],'mode':'synthetic_research','starts_at':'2026-01-01T00:00:00Z','ends_at':'2030-01-01T00:00:00Z'}}}
 with httpx.Client(base_url=env['base'],headers=headers(env),timeout=20) as c:
  r=c.post('/v1/resources/ORG',json=body,headers={'Idempotency-Key':key});assert r.status_code==201;valid(env,'Resource',r.json());id=r.json()['id']
  again=c.post('/v1/resources/ORG',json=body,headers={'Idempotency-Key':key});assert again.status_code in [200,201];assert again.json()['id']==id
  changed=dict(body,title='Changed with same key');r=c.post('/v1/resources/ORG',json=changed,headers={'Idempotency-Key':key});assert r.status_code==409
  r=c.get('/v1/resources/ORG/'+id);assert r.status_code==200;valid(env,'Resource',r.json());etag=r.headers['etag']
  cross=c.get('/v1/resources/ORG/'+id,headers=headers(env,'B'));assert cross.status_code==404;assert 'Synthetic acceptance' not in cross.text
  r=c.patch('/v1/resources/ORG/'+id,json={'title':'Updated synthetic programme'},headers={'If-Match':etag,'Idempotency-Key':'patch_'+uuid.uuid4().hex});assert r.status_code==200
  stale=c.patch('/v1/resources/ORG/'+id,json={'title':'Stale rejected'},headers={'If-Match':etag,'Idempotency-Key':'stale_'+uuid.uuid4().hex});assert stale.status_code==409
