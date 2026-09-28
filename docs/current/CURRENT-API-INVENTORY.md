# Current API and command inventory

Documentation edition **1.1**, 2026-09-28. Reconciled to repository source **870b49a343f1**: hosted alpha package 0.6.0 plus PR #13; deployment not requalified.

Inventory is extracted from executable hosted routes and closed command schemas. Dispatcher sign-in/out/callback routes are platform-owned, not additional application route files. Query parameters do not confer authority. The v0.6 connector commands have their own version/idempotency contract; do not assume all routes accept the workspace command envelope.

| Method | Route | Executable source |
|---|---|---|
| POST | /api/commands | [source](../../app/api/commands/route.ts) |
| GET | /api/connections | [source](../../app/api/connections/route.ts) |
| POST | /api/connections | [source](../../app/api/connections/route.ts) |
| GET | /api/export | [source](../../app/api/export/route.ts) |
| GET | /api/health | [source](../../app/api/health/route.ts) |
| GET | /api/lab/audio | [source](../../app/api/lab/audio/route.ts) |
| GET | /api/lab/export | [source](../../app/api/lab/export/route.ts) |
| GET | /api/lab/registry | [source](../../app/api/lab/registry/route.ts) |
| GET | /api/lab/timeline | [source](../../app/api/lab/timeline/route.ts) |
| GET | /api/suite/checkpoint | [source](../../app/api/suite/checkpoint/route.ts) |
| POST | /api/suite/checkpoint | [source](../../app/api/suite/checkpoint/route.ts) |
| PATCH | /api/suite/checkpoint | [source](../../app/api/suite/checkpoint/route.ts) |
| GET | /api/suite/diagnostics | [source](../../app/api/suite/diagnostics/route.ts) |
| GET | /api/suite/export | [source](../../app/api/suite/export/route.ts) |
| PUT | /api/suite/media | [source](../../app/api/suite/media/route.ts) |
| POST | /api/suite/media | [source](../../app/api/suite/media/route.ts) |
| GET | /api/suite/media | [source](../../app/api/suite/media/route.ts) |
| PATCH | /api/suite/media | [source](../../app/api/suite/media/route.ts) |
| GET | /api/suite/signing | [source](../../app/api/suite/signing/route.ts) |
| GET | /api/workspace | [source](../../app/api/workspace/route.ts) |

## Command schemas and permissions

Three internal media actions are rejected by the public command route and may only be invoked after media-route validation. The role list is only one predicate; active membership, institution status, holds, grants, exact version and record state also apply.

| Action | Entry | Allowed test roles | Source |
|---|---|---|---|
| programme.create | POST /api/commands | manager | [source](../../lib/domain.ts) |
| programme.update | POST /api/commands | manager | [source](../../lib/domain.ts) |
| programme.archive | POST /api/commands | manager | [source](../../lib/domain.ts) |
| study.create | POST /api/commands | manager | [source](../../lib/domain.ts) |
| study.update | POST /api/commands | manager | [source](../../lib/domain.ts) |
| study.submit | POST /api/commands | manager | [source](../../lib/domain.ts) |
| study.review | POST /api/commands | reviewer | [source](../../lib/domain.ts) |
| dataset.import | POST /api/commands | custodian, manager | [source](../../lib/domain.ts) |
| dataset.release | POST /api/commands | custodian | [source](../../lib/domain.ts) |
| dataset.reject | POST /api/commands | custodian | [source](../../lib/domain.ts) |
| grant.request | POST /api/commands | manager, developer | [source](../../lib/domain.ts) |
| grant.decide | POST /api/commands | custodian | [source](../../lib/domain.ts) |
| grant.revoke | POST /api/commands | custodian | [source](../../lib/domain.ts) |
| model.register | POST /api/commands | developer | [source](../../lib/domain.ts) |
| run.execute | POST /api/commands | developer | [source](../../lib/domain.ts) |
| report.create | POST /api/commands | manager | [source](../../lib/domain.ts) |
| report.issue | POST /api/commands | reviewer | [source](../../lib/domain.ts) |
| report.withdraw | POST /api/commands | safety | [source](../../lib/domain.ts) |
| concern.record | POST /api/commands | manager, reviewer, custodian, developer, safety, admin, auditor, support | [source](../../lib/domain.ts) |
| concern.resolve | POST /api/commands | safety | [source](../../lib/domain.ts) |
| hold.apply | POST /api/commands | safety | [source](../../lib/domain.ts) |
| hold.release | POST /api/commands | safety | [source](../../lib/domain.ts) |
| institution.submit | POST /api/commands | manager | [source](../../lib/domain.ts) |
| institution.decide | POST /api/commands | admin | [source](../../lib/domain.ts) |
| member.status | POST /api/commands | admin | [source](../../lib/domain.ts) |
| lab.ecosystem.generate | POST /api/commands | manager, developer, custodian | [source](../../lib/lab.ts) |
| lab.ecosystem.reset | POST /api/commands | manager | [source](../../lib/lab.ts) |
| lab.ecosystem.fork | POST /api/commands | manager, developer | [source](../../lib/lab.ts) |
| lab.model.register | POST /api/commands | developer | [source](../../lib/lab.ts) |
| lab.run.create | POST /api/commands | manager, developer | [source](../../lib/lab.ts) |
| lab.run.import | POST /api/commands | developer | [source](../../lib/lab.ts) |
| lab.run.advance | POST /api/commands | manager, developer | [source](../../lib/lab.ts) |
| lab.run.pause | POST /api/commands | manager, developer | [source](../../lib/lab.ts) |
| lab.run.resume | POST /api/commands | manager, developer | [source](../../lib/lab.ts) |
| lab.run.cancel | POST /api/commands | manager, developer, safety | [source](../../lib/lab.ts) |
| lab.run.replay | POST /api/commands | manager, developer | [source](../../lib/lab.ts) |
| lab.report.create | POST /api/commands | manager | [source](../../lib/lab.ts) |
| lab.report.issue | POST /api/commands | reviewer | [source](../../lib/lab.ts) |
| lab.report.withdraw | POST /api/commands | safety | [source](../../lib/lab.ts) |
| suite.demo.seed | POST /api/commands | manager, admin | [source](../../lib/suite.ts) |
| suite.template.generate | POST /api/commands | manager, custodian, developer | [source](../../lib/suite.ts) |
| suite.package.register | POST /api/commands | developer | [source](../../lib/suite.ts) |
| suite.connector.create | POST /api/commands | developer | [source](../../lib/suite.ts) |
| suite.connector.test | POST /api/commands | developer, manager | [source](../../lib/suite.ts) |
| suite.connector.disable | POST /api/commands | developer, admin | [source](../../lib/suite.ts) |
| suite.job.enqueue | POST /api/commands | developer, manager | [source](../../lib/suite.ts) |
| suite.job.claim | POST /api/commands | developer, manager | [source](../../lib/suite.ts) |
| suite.job.process | POST /api/commands | developer, manager | [source](../../lib/suite.ts) |
| suite.job.retry | POST /api/commands | developer, manager | [source](../../lib/suite.ts) |
| suite.job.cancel | POST /api/commands | developer, manager, safety | [source](../../lib/suite.ts) |
| suite.upload.create | POST /api/commands | developer, custodian | [source](../../lib/suite.ts) |
| suite.upload.part | internal_media_route_only | developer, custodian | [source](../../lib/suite.ts) |
| suite.upload.finalize | internal_media_route_only | developer, custodian | [source](../../lib/suite.ts) |
| suite.upload.release | POST /api/commands | custodian | [source](../../lib/suite.ts) |
| suite.upload.revoke | POST /api/commands | custodian, safety | [source](../../lib/suite.ts) |
| suite.media.result | internal_media_route_only | developer | [source](../../lib/suite.ts) |
| suite.registry.patch | POST /api/commands | custodian, manager | [source](../../lib/suite.ts) |
| suite.registry.merge | POST /api/commands | custodian | [source](../../lib/suite.ts) |
| suite.analysis.compare | POST /api/commands | developer, reviewer, manager | [source](../../lib/suite.ts) |
| suite.analysis.partition | POST /api/commands | developer, custodian, manager | [source](../../lib/suite.ts) |
| suite.analysis.robustness | POST /api/commands | developer, manager | [source](../../lib/suite.ts) |
| suite.access.request | POST /api/commands | manager, developer, custodian, support | [source](../../lib/suite.ts) |
| suite.access.decide | POST /api/commands | admin | [source](../../lib/suite.ts) |
| suite.access.revoke | POST /api/commands | admin, safety | [source](../../lib/suite.ts) |
| suite.identity.create | POST /api/commands | admin | [source](../../lib/suite.ts) |
| suite.identity.revoke | POST /api/commands | admin, safety | [source](../../lib/suite.ts) |
| suite.evidence.correct | POST /api/commands | manager | [source](../../lib/suite.ts) |
| suite.exercise.run | POST /api/commands | admin, safety | [source](../../lib/suite.ts) |

## Exact closed definitions

### programme.create

~~~typescript
pData
~~~

### programme.update

~~~typescript
z.object({id,changes:pData}).strict()
~~~

### programme.archive

~~~typescript
z.object({id,note}).strict()
~~~

### study.create

~~~typescript
study
~~~

### study.update

~~~typescript
z.object({id,changes:study}).strict()
~~~

### study.submit

~~~typescript
z.object({id}).strict()
~~~

### study.review

~~~typescript
z.object({id,decision:z.enum(['approve','return','reject']),note}).strict()
~~~

### dataset.import

~~~typescript
z.object({title:str(160),csv:z.string().min(1).max(150000),synthetic:z.literal(true)}).strict()
~~~

### dataset.release

~~~typescript
z.object({id,note}).strict()
~~~

### dataset.reject

~~~typescript
z.object({id,note}).strict()
~~~

### grant.request

~~~typescript
z.object({datasetId:id,studyId:id,purpose:str(1000),expiresAt:z.string().datetime()}).strict()
~~~

### grant.decide

~~~typescript
z.object({id,decision:z.enum(['approve','reject']),note}).strict()
~~~

### grant.revoke

~~~typescript
z.object({id,note}).strict()
~~~

### model.register

~~~typescript
z.object({title:str(160),version:str(40),description:str(1000),weight:z.number().min(-20).max(20),intercept:z.number().min(-20).max(20),threshold:z.number().min(0.01).max(.99)}).strict()
~~~

### run.execute

~~~typescript
z.object({studyId:id,datasetId:id,modelId:id}).strict()
~~~

### report.create

~~~typescript
z.object({runId:id,summary:str(2000)}).strict()
~~~

### report.issue

~~~typescript
z.object({id,note}).strict()
~~~

### report.withdraw

~~~typescript
z.object({id,note}).strict()
~~~

### concern.record

~~~typescript
z.object({title:str(160),description:str(2000),severity:z.enum(['low','moderate','high','critical']),recordId:z.union([id,z.literal('')])}).strict()
~~~

### concern.resolve

~~~typescript
z.object({id,note}).strict()
~~~

### hold.apply

~~~typescript
z.object({note}).strict()
~~~

### hold.release

~~~typescript
z.object({id,note}).strict()
~~~

### institution.submit

~~~typescript
z.object({legalName:str(160),country:z.enum(['GB','KE','IN','US','ZA','BR']),summary:str(2000)}).strict()
~~~

### institution.decide

~~~typescript
z.object({id,decision:z.enum(['approve','return','reject']),note}).strict()
~~~

### member.status

~~~typescript
z.object({id,active:z.boolean(),note}).strict()
~~~

### lab.ecosystem.generate

~~~typescript
recipeSchema
~~~

### lab.ecosystem.reset

~~~typescript
z.object({id,generation:z.number().int().positive(),note}).strict()
~~~

### lab.ecosystem.fork

~~~typescript
z.object({id,generation:z.number().int().positive(),name:z.string().trim().min(3).max(120)}).strict()
~~~

### lab.model.register

~~~typescript
modelSchema
~~~

### lab.run.create

~~~typescript
z.object({environmentId:id,generation:z.number().int().positive(),modelId:id,scenario:scenarioSchema}).strict()
~~~

### lab.run.import

~~~typescript
z.object({environmentId:id,generation:z.number().int().positive(),modelName:z.string().trim().min(3).max(120),threshold:z.number().finite().min(.01).max(.99),scenario:scenarioSchema,predictions:z.array(z.object({subjectId:z.string().regex(/^SYN-P-\d{4}$/),probability:z.number().finite().min(0).max(1)}).strict()).min(10).max(200)}).strict()
~~~

### lab.run.advance

~~~typescript
z.object({id,hours:z.number().int().min(1).max(168)}).strict()
~~~

### lab.run.pause

~~~typescript
z.object({id}).strict()
~~~

### lab.run.resume

~~~typescript
z.object({id}).strict()
~~~

### lab.run.cancel

~~~typescript
z.object({id,note}).strict()
~~~

### lab.run.replay

~~~typescript
z.object({id}).strict()
~~~

### lab.report.create

~~~typescript
z.object({runId:id,summary:note}).strict()
~~~

### lab.report.issue

~~~typescript
z.object({id,note}).strict()
~~~

### lab.report.withdraw

~~~typescript
z.object({id,note}).strict()
~~~

### suite.demo.seed

~~~typescript
z.object({}).strict()
~~~

### suite.template.generate

~~~typescript
z.object({template:z.enum(['respiratory','maternal','rural']),name,count:z.number().int().min(10).max(200),seed:z.number().int().min(1).max(2147483647)}).strict()
~~~

### suite.package.register

~~~typescript
portablePackage
~~~

### suite.connector.create

~~~typescript
z.object({name,kind:z.enum(['remote_model','ehr','laboratory','callback']),endpoint:z.string().max(300),response:z.enum(['success','timeout','error','duplicate']),synthetic:z.literal(true)}).strict()
~~~

### suite.connector.test

~~~typescript
z.object({id,response:z.enum(['success','timeout','error','duplicate'])}).strict()
~~~

### suite.connector.disable

~~~typescript
z.object({id,note}).strict()
~~~

### suite.job.enqueue

~~~typescript
z.object({environmentId:id,generation,modelId:id,scenario:scenarioSchema}).strict()
~~~

### suite.job.claim

~~~typescript
z.object({id}).strict()
~~~

### suite.job.process

~~~typescript
z.object({id,epoch:generation,fault:z.enum(['none','timeout'])}).strict()
~~~

### suite.job.retry

~~~typescript
z.object({id}).strict()
~~~

### suite.job.cancel

~~~typescript
z.object({id,note}).strict()
~~~

### suite.upload.create

~~~typescript
z.object({name,size:z.number().int().min(48).max(500000),sha256:hash,synthetic:z.literal(true)}).strict()
~~~

### suite.upload.part

~~~typescript
z.object({id,index:z.number().int().min(0).max(15),size:z.number().int().min(1).max(32768),sha256:hash}).strict()
~~~

### suite.upload.finalize

~~~typescript
z.object({id,sha256:hash,features:z.object({rms:z.number().finite(),zcr:z.number().finite(),sampleRate:z.number().int(),samples:z.number().int(),durationSeconds:z.number().finite()}).strict()}).strict()
~~~

### suite.upload.release

~~~typescript
z.object({id,note}).strict()
~~~

### suite.upload.revoke

~~~typescript
z.object({id,note}).strict()
~~~

### suite.media.result

~~~typescript
z.object({id,modelId:id,modelHash:hash,probability:z.number().finite().min(0).max(1),threshold:z.number().finite().min(.01).max(.99)}).strict()
~~~

### suite.registry.patch

~~~typescript
z.object({environmentId:id,generation,resourceType:z.enum(['Patient','Organization','Practitioner']),resourceId:id,name,active:z.boolean()}).strict()
~~~

### suite.registry.merge

~~~typescript
z.object({environmentId:id,generation,sourceId:id,targetId:id,note}).strict()
~~~

### suite.analysis.compare

~~~typescript
z.object({leftId:id,rightId:id,seed:z.number().int().min(1).max(2147483647)}).strict()
~~~

### suite.analysis.partition

~~~typescript
z.object({environmentId:id,generation,seed:z.number().int().min(1).max(2147483647)}).strict()
~~~

### suite.analysis.robustness

~~~typescript
z.object({runId:id,gain:z.number().finite().min(.25).max(2),noise:z.number().finite().min(0).max(.1),seed:z.number().int().min(1).max(2147483647)}).strict()
~~~

### suite.access.request

~~~typescript
z.object({name,scope:z.enum(['support_diagnostics','playback','inference','export','organisation_invitation']),reason:note,hours:z.number().int().min(1).max(24)}).strict()
~~~

### suite.access.decide

~~~typescript
z.object({id,decision:z.enum(['approve','reject']),note}).strict()
~~~

### suite.access.revoke

~~~typescript
z.object({id,note}).strict()
~~~

### suite.identity.create

~~~typescript
z.object({name,scope:z.enum(['registry_read','prediction_submit','callback_receive']),hours:z.number().int().min(1).max(24)}).strict()
~~~

### suite.identity.revoke

~~~typescript
z.object({id,note}).strict()
~~~

### suite.evidence.correct

~~~typescript
z.object({id,summary:note,note}).strict()
~~~

### suite.exercise.run

~~~typescript
z.object({kind:z.enum(['backup_restore','revocation','worker_crash','regional_failover','key_rotation','load_test']),note}).strict()
~~~

## Specialised routes

- [Connections](../SELF_SERVICE_CONNECTIONS.md): save/test/activate/disable/abandon/run; encrypted credentials, current config and consent, endpoint policy, per-connector history and unknown outcomes.
- [Media](../WORKBENCH_API.md): part PUT, finalise POST, protected GET and inference PATCH.
- [Signatures/checkpoints](../ASSURANCE_0_5.md): P-256 application signatures; encrypted capture, download and verification; no production restore route.
- [Core](../API_CONTRACT.md), [lab](../RELEASE_2_API.md) and [workbench](../WORKBENCH_API.md) remain the detailed transport references.
- [R3 API](../releases/r3/06-api-and-events.md) is proposed; its routes do not belong in the implemented inventory.
