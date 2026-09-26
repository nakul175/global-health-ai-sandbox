import { z } from 'zod';
import {suiteSchemas,suitePermissions,executeSuite,isSuiteKind,suiteProjection,type SuiteAction,type SuiteKind} from './suite';
import { labSchemas, labPermissions, executeLab, isLabKind, labProjection, type LabAction } from './lab';
export type Kind=SuiteKind|'institution'|'member'|'programme'|'study'|'dataset'|'grant'|'model'|'run'|'report'|'concern'|'hold'|'ecosystem'|'audio_model'|'lab_run'|'lab_report';
export type Role='manager'|'reviewer'|'custodian'|'developer'|'safety'|'admin'|'auditor'|'support';
export type RecordItem={id:string;kind:Kind;title:string;status:string;version:number;body:Record<string,any>;createdBy:string;createdAt:string;updatedAt:string};
export type Profile={id:string;name:string;role:Role;person:string};
export const profiles:Profile[]=[
{id:'maya',name:'Maya Chen',role:'manager',person:'person-maya'},
{id:'elena',name:'Elena Ortiz',role:'reviewer',person:'person-elena'},
{id:'sam',name:'Sam Okafor',role:'custodian',person:'person-sam'},
{id:'leo',name:'Leo Park',role:'developer',person:'person-leo'},
{id:'noor',name:'Noor Ahmed',role:'safety',person:'person-noor'},
{id:'alex',name:'Alex Morgan',role:'admin',person:'person-alex'},
{id:'ravi',name:'Ravi Shah',role:'auditor',person:'person-ravi'},
{id:'support',name:'Support operator',role:'support',person:'person-support'},
{id:'maya-alias',name:'Maya Chen · reviewer alias',role:'reviewer',person:'person-maya'},
];
export const tenants=[{id:'aster',name:'Aster Research Institute',country:'GB'},{id:'beacon',name:'Beacon Health Lab',country:'KE'},{id:'cedar',name:'Cedar Research Centre',country:'IN'}];
export class AppError extends Error {constructor(public status:number,public code:string,message:string){super(message)}}
const str=(max=200)=>z.string().trim().min(1).max(max);
const id=z.string().min(1).max(100);
const note=str(2000);
const pData=z.object({title:str(160),summary:str(2000),country:z.enum(['GB','KE','IN','US','ZA','BR']),startDate:z.string().date(),endDate:z.string().date()}).strict().refine(x=>x.endDate>=x.startDate,{message:'End date must be on or after start date.'});
const study=z.object({title:str(160),programmeId:id,question:str(2000),intendedUse:str(1000),population:str(1000),primaryMetric:z.enum(['sensitivity','specificity','accuracy','auc']),minimum:z.number().min(0).max(1)}).strict();
export const schemas={
 ...labSchemas,
 ...suiteSchemas,
 'programme.create':pData,
 'programme.update':z.object({id,changes:pData}).strict(),
 'programme.archive':z.object({id,note}).strict(),
 'study.create':study,
 'study.update':z.object({id,changes:study}).strict(),
 'study.submit':z.object({id}).strict(),
 'study.review':z.object({id,decision:z.enum(['approve','return','reject']),note}).strict(),
 'dataset.import':z.object({title:str(160),csv:z.string().min(1).max(150000),synthetic:z.literal(true)}).strict(),
 'dataset.release':z.object({id,note}).strict(),
 'dataset.reject':z.object({id,note}).strict(),
 'grant.request':z.object({datasetId:id,studyId:id,purpose:str(1000),expiresAt:z.string().datetime()}).strict(),
 'grant.decide':z.object({id,decision:z.enum(['approve','reject']),note}).strict(),
 'grant.revoke':z.object({id,note}).strict(),
 'model.register':z.object({title:str(160),version:str(40),description:str(1000),weight:z.number().min(-20).max(20),intercept:z.number().min(-20).max(20),threshold:z.number().min(0.01).max(.99)}).strict(),
 'run.execute':z.object({studyId:id,datasetId:id,modelId:id}).strict(),
 'report.create':z.object({runId:id,summary:str(2000)}).strict(),
 'report.issue':z.object({id,note}).strict(),
 'report.withdraw':z.object({id,note}).strict(),
 'concern.record':z.object({title:str(160),description:str(2000),severity:z.enum(['low','moderate','high','critical']),recordId:z.union([id,z.literal('')])}).strict(),
 'concern.resolve':z.object({id,note}).strict(),
 'hold.apply':z.object({note}).strict(),
 'hold.release':z.object({id,note}).strict(),
 'institution.submit':z.object({legalName:str(160),country:z.enum(['GB','KE','IN','US','ZA','BR']),summary:str(2000)}).strict(),
 'institution.decide':z.object({id,decision:z.enum(['approve','return','reject']),note}).strict(),
 'member.status':z.object({id,active:z.boolean(),note}).strict(),
} as const;
export type Action=keyof typeof schemas;
export type Command={action:Action;data:any};
export function parseCommand(raw:unknown):Command{
 const envelope=z.object({action:z.string(),data:z.unknown()}).strict().safeParse(raw);
 if(!envelope.success||!Object.prototype.hasOwnProperty.call(schemas,envelope.data.action))throw new AppError(422,'VALIDATION','Unknown action or unexpected request fields.');
 const action=envelope.data.action as Action; const parsed=schemas[action].safeParse(envelope.data.data);
 if(!parsed.success)throw new AppError(422,'VALIDATION',parsed.error.issues.map(e=>`${e.path.join('.')||'Request'}: ${e.message}`).slice(0,6).join(' '));
 return {action,data:parsed.data};
}
export const permissions:Record<Action,Role[]>={
 ...labPermissions,
 ...suitePermissions,
 'programme.create':['manager'],'programme.update':['manager'],'programme.archive':['manager'],
 'study.create':['manager'],'study.update':['manager'],'study.submit':['manager'],'study.review':['reviewer'],
 'dataset.import':['custodian','manager'],'dataset.release':['custodian'],'dataset.reject':['custodian'],
 'grant.request':['manager','developer'],'grant.decide':['custodian'],'grant.revoke':['custodian'],
 'model.register':['developer'],'run.execute':['developer'],'report.create':['manager'],'report.issue':['reviewer'],'report.withdraw':['safety'],
 'concern.record':['manager','reviewer','custodian','developer','safety','admin','auditor','support'],
 'concern.resolve':['safety'],'hold.apply':['safety'],'hold.release':['safety'],
 'institution.submit':['manager'],'institution.decide':['admin'],'member.status':['admin'],
};
export function authorize(action:Action,actor:Profile,items:RecordItem[]){
 const membership=items.find(x=>x.kind==='member'&&x.body.profileId===actor.id);
 if(membership?.status!=='active')throw new AppError(403,'MEMBERSHIP_REVOKED','This test membership is inactive. Choose an active test identity.');
 if(!permissions[action].includes(actor.role))throw new AppError(403,'FORBIDDEN','Your current test role cannot perform this action.');
 const allowedDuringHold=['concern.record','concern.resolve','hold.apply','hold.release','grant.revoke','report.withdraw','member.status','lab.run.cancel','lab.report.withdraw','suite.job.cancel','suite.upload.revoke','suite.access.revoke','suite.identity.revoke'];
 if(items.some(x=>x.kind==='hold'&&x.status==='active')&&!allowedDuringHold.includes(action))throw new AppError(423,'SAFETY_HOLD','An active safety hold blocks this action.');
 const institution=items.find(x=>x.kind==='institution');
 if(institution?.status!=='verified'&&!['institution.submit','institution.decide','concern.record','concern.resolve','member.status'].includes(action))throw new AppError(403,'INSTITUTION_UNVERIFIED','Institution verification is required first.');
}
export function canonical(value:any):string{if(value===null||typeof value!=='object')return JSON.stringify(value);if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}'}
export async function digest(value:any){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(typeof value==='string'?value:canonical(value)));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('')}
export type Row={sample_id:string;signal:number;label:0|1;group:string};
export const sampleCSV='sample_id,signal,label,group\n'+Array.from({length:40},(_,i)=>`SYN-${String(i+1).padStart(3,'0')},${((i%20)/19).toFixed(4)},${(i%20)>=10?1:0},${i<20?'cohort_a':'cohort_b'}`).join('\n')+'\n';
export function parseCSV(csv:string):Row[]{
 const lines=csv.replace(/^\uFEFF/,'').trim().split(/\r?\n/);if(lines.shift()!=='sample_id,signal,label,group')throw new AppError(422,'CSV_HEADER','Use the exact sample_id,signal,label,group header.');
 if(lines.length<2||lines.length>1000)throw new AppError(422,'CSV_ROWS','Provide between 2 and 1,000 synthetic rows.');
 const ids=new Set<string>();return lines.map((line,i)=>{
 const parts=line.split(',');if(parts.length!==4)throw new AppError(422,'CSV_COLUMNS',`Row ${i+2} must have four unquoted fields.`);
 const [sample_id,signal,label,group]=parts;
 if(!/^SYN-[A-Za-z0-9_-]{1,40}$/.test(sample_id)||ids.has(sample_id))throw new AppError(422,'CSV_ID',`Row ${i+2}: unique synthetic sample IDs must begin SYN-.`);ids.add(sample_id);
 if(!/^(0(?:\.\d+)?|1(?:\.0+)?)$/.test(signal)||!['0','1'].includes(label)||!/^cohort_[a-z0-9_]{1,30}$/.test(group))throw new AppError(422,'CSV_VALUE',`Row ${i+2}: signal must be 0–1, label 0 or 1, and group cohort_ followed by lowercase letters or digits.`);
 return {sample_id,signal:Number(signal),label:Number(label) as 0|1,group};});
}
export function score(rows:Row[],model:{weight:number;intercept:number;threshold:number}){
 let tp=0,tn=0,fp=0,fn=0;const probs=rows.map(r=>({p:1/(1+Math.exp(-(r.signal*model.weight+model.intercept))),y:r.label}));
 for(const r of probs){if(r.p>=model.threshold){if(r.y)tp++;else fp++;}else{if(r.y)fn++;else tn++;}}
 const div=(a:number,b:number)=>b?a/b:null;const sorted=[...probs].sort((a,b)=>a.p-b.p);let rankSum=0;
 for(let i=0;i<sorted.length;){let j=i+1;while(j<sorted.length&&sorted[j].p===sorted[i].p)j++;const rank=(i+1+j)/2;for(let k=i;k<j;k++)if(sorted[k].y)rankSum+=rank;i=j;}
 const positive=tp+fn,negative=tn+fp;return {n:rows.length,tp,tn,fp,fn,accuracy:div(tp+tn,rows.length),sensitivity:div(tp,positive),specificity:div(tn,negative),precision:div(tp,tp+fp),auc:positive&&negative?(rankSum-positive*(positive+1)/2)/(positive*negative):null,brier:probs.reduce((s,r)=>s+(r.p-r.y)**2,0)/rows.length};
}
export async function execute(command:Command,actor:Profile,items:RecordItem[],now=new Date().toISOString()):Promise<RecordItem[]>{
 const {action,data:d}=command;authorize(action,actor,items);
 if(action.startsWith('suite.'))return executeSuite(action as SuiteAction,d,actor,items,now);
 if(action.startsWith('lab.'))return executeLab(action as LabAction,d,actor,items,now);
 const get=(id:string,kind?:Kind)=>{const r=items.find(x=>x.id===id&&(!kind||x.kind===kind));if(!r)throw new AppError(404,'UNAVAILABLE','Record unavailable.');return r};
 const check=(ok:unknown,msg:string)=>{if(!ok)throw new AppError(409,'GATE_BLOCKED',msg)};
 const create=(kind:Kind,title:string,status:string,body:any):RecordItem=>({id:crypto.randomUUID(),kind,title,status,version:1,body,createdBy:actor.person,createdAt:now,updatedAt:now});
 const update=(r:RecordItem,status:string,body:any=r.body,title=r.title)=>({...r,title,status,body,version:r.version+1,updatedAt:now});
 const independent=(r:RecordItem)=>check(r.createdBy!==actor.person,'A different synthetic person must make this decision. Alias accounts do not qualify.');
 const own=(r:RecordItem)=>check(r.createdBy===actor.person,'Only the author can change this draft.');
 switch(action){
 case 'programme.create':return [create('programme',d.title,'active',d)];
 case 'programme.update':{const r=get(d.id,'programme');own(r);check(r.status==='active','Only active programmes can be edited.');return [update(r,r.status,d.changes,d.changes.title)]}
 case 'programme.archive':{const r=get(d.id,'programme');own(r);check(!items.some(x=>x.kind==='study'&&x.body.programmeId===r.id&&!['rejected'].includes(x.status)),'Resolve programme studies before archiving.');return[update(r,'archived',{...r.body,archiveNote:d.note})]}
 case 'study.create':{check(get(d.programmeId,'programme').status==='active','Choose an active programme.');return [create('study',d.title,'draft',d)]}
 case 'study.update':{const r=get(d.id,'study');own(r);check(['draft','returned'].includes(r.status),'Only draft or returned studies can be edited.');check(get(d.changes.programmeId,'programme').status==='active','Choose an active programme.');return[update(r,'draft',d.changes,d.changes.title)]}
 case 'study.submit':{const r=get(d.id,'study');own(r);check(['draft','returned'].includes(r.status),'Study is not editable.');const protocol=Object.fromEntries(['title','programmeId','question','intendedUse','population','primaryMetric','minimum'].map(k=>[k,r.body[k]]));const protocolHash=await digest(protocol);return[update(r,'in_review',{...protocol,protocolHash,submittedAt:now,submittedVersion:r.version})]}
 case 'study.review':{const r=get(d.id,'study');independent(r);check(r.status==='in_review','Study must be awaiting review.');return[update(r,d.decision==='approve'?'approved':d.decision==='return'?'returned':'rejected',{...r.body,review:{decision:d.decision,note:d.note,person:actor.person,at:now,protocolHash:r.body.protocolHash}})]}
 case 'dataset.import':{const rows=parseCSV(d.csv);return[create('dataset',d.title,'quarantined',{rows,rowCount:rows.length,groups:[...new Set(rows.map(r=>r.group))],sha256:await digest(rows),synthetic:true,format:'synthetic-signal-v1'})]}
 case 'dataset.release':case 'dataset.reject':{const r=get(d.id,'dataset');independent(r);check(r.status==='quarantined','Dataset must be quarantined.');return[update(r,action==='dataset.release'?'released':'rejected',{...r.body,custody:{person:actor.person,note:d.note,at:now}})]}
 case 'grant.request':{const dataset=get(d.datasetId,'dataset'),study=get(d.studyId,'study');check(dataset.status==='released','Dataset has not been released.');check(study.status==='approved','Study must be approved.');const expiry=Date.parse(d.expiresAt);check(expiry>Date.parse(now)&&expiry<=Date.parse(now)+90*864e5,'Grant expiry must be within the next 90 days.');return[create('grant',`${dataset.title} → ${study.title}`,'pending',{...d,requestedBy:actor.person})]}
 case 'grant.decide':{const r=get(d.id,'grant');independent(r);check(r.status==='pending','Grant must be pending.');check(Date.parse(r.body.expiresAt)>Date.parse(now),'Grant has expired.');check(get(r.body.datasetId,'dataset').status==='released'&&get(r.body.studyId,'study').status==='approved','Dataset and study must remain available.');return[update(r,d.decision==='approve'?'active':'rejected',{...r.body,decision:{person:actor.person,note:d.note,at:now}})]}
 case 'grant.revoke':{const r=get(d.id,'grant');check(r.status==='active','Only active grants can be revoked.');return[update(r,'revoked',{...r.body,revokedAt:now,revocationNote:d.note})]}
 case 'model.register':return[create('model',d.title,'registered',{...d,algorithm:'fixed-logistic-v1',sha256:await digest(d)})];
 case 'run.execute':{const study=get(d.studyId,'study'),dataset=get(d.datasetId,'dataset'),model=get(d.modelId,'model');check(study.status==='approved'&&dataset.status==='released','Approved study and released dataset required.');const grant=items.find(x=>x.kind==='grant'&&x.status==='active'&&x.body.studyId===study.id&&x.body.datasetId===dataset.id&&Date.parse(x.body.expiresAt)>Date.parse(now));check(grant,'An active, unexpired study-to-dataset grant is required.');const metrics=score(dataset.body.rows,model.body as any);const groups=dataset.body.groups.map((group:string)=>{const rows=dataset.body.rows.filter((r:Row)=>r.group===group);return {group,n:rows.length,suppressed:rows.length<5,metrics:rows.length<5?null:score(rows,model.body as any)}});const measured=(metrics as any)[study.body.primaryMetric];return[create('run',`${model.title} · ${study.title}`,'completed',{...d,grantId:grant!.id,metrics,groups,primaryMetric:study.body.primaryMetric,minimum:study.body.minimum,passed:measured===null?null:measured>=study.body.minimum,modelHash:model.body.sha256,datasetHash:dataset.body.sha256,protocolHash:study.body.protocolHash,algorithm:'fixed-logistic-v1',executedAt:now,synthetic:true})]}
 case 'report.create':{const run=get(d.runId,'run');check(run.status==='completed','A completed run is required.');return[create('report',`Evidence · ${run.title}`,'draft',{runId:run.id,summary:d.summary,result:run.body,disclaimer:'Synthetic test evidence. Not clinical validation or regulatory approval.',draftDigest:await digest({runId:run.id,summary:d.summary,result:run.body})})]}
 case 'report.issue':{const r=get(d.id,'report');independent(r);check(r.status==='draft','Only draft evidence can be issued.');const run=get(r.body.runId,'run'),grant=get(run.body.grantId,'grant');check(grant.status==='active'&&Date.parse(grant.body.expiresAt)>Date.parse(now),'An active grant is required at issue time.');const body={...r.body,issuedBy:actor.person,issuedAt:now,issueNote:d.note};const bytes=canonical({...body,title:r.title,evidenceId:r.id});return[update(r,'issued',{...body,issuedBytes:bytes,sha256:await digest(bytes)})]}
 case 'report.withdraw':{const r=get(d.id,'report');check(r.status==='issued','Only issued evidence can be withdrawn.');return[update(r,'withdrawn',{...r.body,withdrawnAt:now,withdrawalNote:d.note})]}
 case 'concern.record':if(d.recordId)get(d.recordId);return[create('concern',d.title,'open',{...d})];
 case 'concern.resolve':{const r=get(d.id,'concern');check(r.status==='open','Concern already resolved.');return[update(r,'resolved',{...r.body,resolution:d.note,resolvedAt:now})]}
 case 'hold.apply':check(!items.some(x=>x.kind==='hold'&&x.status==='active'),'A safety hold is already active.');return[create('hold','Institution safety hold','active',{note:d.note,appliedBy:actor.person})];
 case 'hold.release':{const r=get(d.id,'hold');check(r.status==='active','Hold already released.');return[update(r,'released',{...r.body,releaseNote:d.note,releasedAt:now,releasedBy:actor.person})]}
 case 'institution.submit':{const r=items.find(x=>x.kind==='institution')!;check(['draft','returned'].includes(r.status),'Only a draft or returned application can be submitted.');return[{...update(r,'pending',{...d,submittedBy:actor.person},d.legalName),createdBy:actor.person}]}
 case 'institution.decide':{const r=get(d.id,'institution');independent(r);check(r.status==='pending','Application must be pending.');return[update(r,d.decision==='approve'?'verified':d.decision==='return'?'returned':'rejected',{...r.body,verification:{person:actor.person,note:d.note,at:now}})]}
 case 'member.status':{const r=get(d.id,'member');check(r.body.profileId!==actor.id,'You cannot revoke your own membership.');check(r.body.role!=='admin','The seeded administrator is protected from lockout.');return[update(r,d.active?'active':'revoked',{...r.body,note:d.note})]}
 }
 throw new AppError(422,'VALIDATION','Unknown command.');
}
export function visible(items:RecordItem[],actor:Profile){return items.filter(r=>actor.role!=='support'||['institution','member','concern','hold'].includes(r.kind)).map(r=>{if(isLabKind(r.kind))return labProjection(r);if(isSuiteKind(r.kind))return suiteProjection(r);const body={...r.body};delete body.rows;delete body.issuedBytes;return {...r,body}})}
