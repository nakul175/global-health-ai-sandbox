import { z } from 'zod';
import { AppError, canonical, digest, type Profile, type RecordItem, type Role } from './domain';

// This bounded, synthetic-only adapter is deliberately separate from the regional
// protected-data and arbitrary-container design. It never executes submitted code.
export const LAB_VERSION = 'r2-lab-1.0.0';
export const GENERATOR_VERSION = 'xorshift32-pcm16-v1';
export const labKinds = ['ecosystem', 'audio_model', 'lab_run', 'lab_report'] as const;
export const isLabKind = (kind:string) => (labKinds as readonly string[]).includes(kind);
const id = z.string().min(1).max(100);
const note = z.string().trim().min(3).max(2000);
export const recipeSchema = z.object({
  name:z.string().trim().min(3).max(120), count:z.number().int().min(10).max(200),
  seed:z.number().int().min(1).max(2147483647), positiveCount:z.number().int().min(0).max(200),
  facilityCount:z.number().int().min(1).max(10), clinicianCount:z.number().int().min(1).max(20), synthetic:z.literal(true),
}).strict().refine(x=>x.positiveCount<=x.count,{path:['positiveCount'],message:'Positive quota cannot exceed population.'});
export const scenarioSchema = z.object({
  mode:z.enum(['normal','outage','duplicate','slow','lost_callback']), labDelayHours:z.number().int().min(1).max(72),
  outageStartHour:z.number().int().min(0).max(72), outageDurationHours:z.number().int().min(1).max(72),
  maxWaitHours:z.number().int().min(1).max(168),
}).strict();
export const modelSchema = z.object({name:z.string().trim().min(3).max(120),version:z.string().regex(/^\d+\.\d+\.\d+$/),
  rmsWeight:z.number().finite().min(-30).max(30),zcrWeight:z.number().finite().min(-30).max(30),
  intercept:z.number().finite().min(-20).max(20),threshold:z.number().finite().min(.01).max(.99),synthetic:z.literal(true),
}).strict();
export const labSchemas = {
 'lab.ecosystem.generate':recipeSchema,
 'lab.ecosystem.reset':z.object({id,generation:z.number().int().positive(),note}).strict(),
 'lab.ecosystem.fork':z.object({id,generation:z.number().int().positive(),name:z.string().trim().min(3).max(120)}).strict(),
 'lab.model.register':modelSchema,
 'lab.run.create':z.object({environmentId:id,generation:z.number().int().positive(),modelId:id,scenario:scenarioSchema}).strict(),
 'lab.run.import':z.object({environmentId:id,generation:z.number().int().positive(),modelName:z.string().trim().min(3).max(120),threshold:z.number().finite().min(.01).max(.99),scenario:scenarioSchema,predictions:z.array(z.object({subjectId:z.string().regex(/^SYN-P-\d{4}$/),probability:z.number().finite().min(0).max(1)}).strict()).min(10).max(200)}).strict(),
 'lab.run.advance':z.object({id,hours:z.number().int().min(1).max(168)}).strict(),
 'lab.run.pause':z.object({id}).strict(),
 'lab.run.resume':z.object({id}).strict(),
 'lab.run.cancel':z.object({id,note}).strict(),
 'lab.run.replay':z.object({id}).strict(),
 'lab.report.create':z.object({runId:id,summary:note}).strict(),
 'lab.report.issue':z.object({id,note}).strict(),
 'lab.report.withdraw':z.object({id,note}).strict(),
} as const;
export type LabAction = keyof typeof labSchemas;
export const labPermissions:Record<LabAction,Role[]> = {
 'lab.ecosystem.generate':['manager','developer','custodian'], 'lab.ecosystem.reset':['manager'], 'lab.ecosystem.fork':['manager','developer'],
 'lab.model.register':['developer'], 'lab.run.create':['manager','developer'], 'lab.run.advance':['manager','developer'],
 'lab.run.import':['developer'],
 'lab.run.pause':['manager','developer'], 'lab.run.resume':['manager','developer'], 'lab.run.cancel':['manager','developer','safety'],
 'lab.run.replay':['manager','developer'], 'lab.report.create':['manager'], 'lab.report.issue':['reviewer'], 'lab.report.withdraw':['safety'],
};
export type Recipe=z.infer<typeof recipeSchema>;
export type Scenario=z.infer<typeof scenarioSchema>;
export type AudioModel=z.infer<typeof modelSchema> & {id:string;trees?:{feature:'rms'|'zcr';threshold:number;below:number;above:number}[];algorithm:'audio-logistic-v1'|'workflow-stub-v1'|'imported-predictions-v1'|'portable-forest-v1'};
export const referenceModels:AudioModel[]=[
 {id:'audio-reference-v1',name:'Audio reference A',version:'1.0.0',rmsWeight:18,zcrWeight:4,intercept:-3,threshold:.5,synthetic:true,algorithm:'audio-logistic-v1'},
 {id:'audio-reference-v2',name:'Audio reference B',version:'2.0.0',rmsWeight:13,zcrWeight:3,intercept:-3,threshold:.6,synthetic:true,algorithm:'audio-logistic-v1'},
 {id:'workflow-stub',name:'Deterministic workflow stub',version:'1.0.0',rmsWeight:0,zcrWeight:0,intercept:0,threshold:.5,synthetic:true,algorithm:'workflow-stub-v1'},
];
export type Resource={resourceType:string;id:string;meta:{tag:{system:string;code:string}[]};[key:string]:any};
type Subject={id:string;audioSeed:number;amplitude:number;frequency:number;sex:string;age:number};
type Event={id:string;atHour:number;type:string;subjectId:string;effectKey:string;duplicate?:boolean};
const baseTime=Date.parse('2026-01-05T00:00:00Z');
const iso=(hour:number)=>new Date(baseTime+hour*3600000).toISOString();
function guard(ok:unknown,message:string,code='GATE_BLOCKED',status=409):asserts ok {if(!ok)throw new AppError(status,code,message)}
export function rng(seed:number){let state=seed>>>0;return()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296}}
const meta=(recipeHash:string)=>({tag:[{system:'https://sandbox.example.invalid/origin',code:'synthetic'},{system:'https://sandbox.example.invalid/recipe',code:recipeHash}]});
export async function generateEcosystem(recipe:Recipe){
 const parsed=recipeSchema.safeParse(recipe);guard(parsed.success,'Invalid generation recipe.','VALIDATION',422);
 const recipeHash=await digest({recipe,generator:GENERATOR_VERSION}),random=rng(recipe.seed),resources:Resource[]=[],subjects:Subject[]=[],references:Record<string,0|1>={};
 const make=(type:string,id:string,body:any)=>({resourceType:type,id,meta:meta(recipeHash),...body});
 const ordering=Array.from({length:recipe.count},(_,i)=>i);for(let i=ordering.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[ordering[i],ordering[j]]=[ordering[j],ordering[i]]}
 const positives=new Set(ordering.slice(0,recipe.positiveCount));
 for(let i=0;i<recipe.facilityCount;i++)resources.push(make('Organization',`SYN-FAC-${i+1}`,{active:true,name:`Fictional health centre ${i+1}`}));
 resources.push(make('Organization','SYN-LAB-1',{active:true,name:'Fictional central laboratory'}));
 for(let i=0;i<recipe.clinicianCount;i++)resources.push(make('Practitioner',`SYN-CLIN-${i+1}`,{active:true,name:[{text:`Synthetic clinician ${i+1}`}]}));
 for(let i=0;i<recipe.count;i++){
  const sid=`SYN-P-${String(i+1).padStart(4,'0')}`,positive=positives.has(i),sex=random()<.5?'female':'male',age=18+Math.floor(random()*63);
  const subject:Subject={id:sid,audioSeed:Math.floor(random()*2147483646)+1,amplitude:Number((.05+random()*.22+(positive?.09:0)).toFixed(6)),frequency:Math.round(170+random()*350+(positive?100:0)),sex,age};
  subjects.push(subject);references[sid]=positive?1:0;
  resources.push(make('Patient',sid,{active:true,name:[{text:`Fictional participant ${i+1}`}],gender:sex,birthDate:`${2026-age}-01-01`,telecom:[{system:'email',value:`${sid.toLowerCase()}@example.invalid`}]}));
  resources.push(make('Encounter',`SYN-ENC-${i+1}`,{status:'finished',class:{system:'http://terminology.hl7.org/CodeSystem/v3-ActCode',code:'AMB'},subject:{reference:`Patient/${sid}`},serviceProvider:{reference:`Organization/SYN-FAC-${i%recipe.facilityCount+1}`},participant:[{individual:{reference:`Practitioner/SYN-CLIN-${i%recipe.clinicianCount+1}`}}],period:{start:iso(0),end:iso(1)}}));
  resources.push(make('Observation',`SYN-OBS-${i+1}`,{status:'final',code:{text:'Synthetic audio sample available'},subject:{reference:`Patient/${sid}`},encounter:{reference:`Encounter/SYN-ENC-${i+1}`},effectiveDateTime:iso(1),valueString:'Generated waveform for technical testing only'}));
 }
 resources.sort((a,b)=>(a.resourceType+'/'+a.id).localeCompare(b.resourceType+'/'+b.id));
 const referenceHash=await digest(references),snapshotHash=await digest({resources,subjects,referenceHash}),counts:Record<string,number>={};
 for(const r of resources)counts[r.resourceType]=(counts[r.resourceType]||0)+1;
 return {recipe,recipeHash,snapshotHash,referenceHash,generatorVersion:GENERATOR_VERSION,generation:1,synthetic:true,resources,subjects,references,
  manifest:{counts,resourceCount:resources.length,patientCount:recipe.count,positiveCount:recipe.positiveCount,negativeCount:recipe.count-recipe.positiveCount,
  femaleCount:subjects.filter(s=>s.sex==='female').length,maleCount:subjects.filter(s=>s.sex==='male').length,quotaMode:'exact',audioFormat:'PCM16 mono / 8000 Hz / 0.25 s',classification:'synthetic-workflow-only'}};
}

// Feature extraction receives only waveform bytes. Reference labels are joined
// afterward by the scorer and are never arguments to the inference function.
export function syntheticWav(subject:Subject):Uint8Array {
 const count=2000,rate=8000,bytes=new Uint8Array(44+count*2),view=new DataView(bytes.buffer),rand=rng(subject.audioSeed);
 const ascii=(at:number,text:string)=>{for(let i=0;i<text.length;i++)view.setUint8(at+i,text.charCodeAt(i))};
 ascii(0,'RIFF');view.setUint32(4,36+count*2,true);ascii(8,'WAVE');ascii(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);ascii(36,'data');view.setUint32(40,count*2,true);
 for(let i=0;i<count;i++){const envelope=.55+.45*Math.sin(Math.PI*i/count),sample=subject.amplitude*envelope*Math.sin(2*Math.PI*subject.frequency*i/rate)+(rand()-.5)*.025;view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,sample))*32767),true)}return bytes;
}
export function audioFeatures(bytes:Uint8Array){
 guard(bytes.byteLength>=48&&bytes.byteLength<=500000,'Audio must be a bounded PCM16 waveform.','AUDIO_FORMAT',422);
 const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),txt=(at:number,n:number)=>String.fromCharCode(...bytes.slice(at,at+n));
 guard(txt(0,4)==='RIFF'&&txt(8,4)==='WAVE'&&txt(12,4)==='fmt '&&v.getUint32(16,true)===16&&v.getUint16(20,true)===1&&v.getUint16(22,true)===1&&v.getUint16(34,true)===16&&txt(36,4)==='data','Only canonical mono PCM16 WAV is supported.','AUDIO_FORMAT',422);
 const rate=v.getUint32(24,true),length=v.getUint32(40,true);guard([8000,16000,44100,48000].includes(rate)&&length>0&&length%2===0&&44+length===bytes.length&&v.getUint32(4,true)+8===bytes.length,'Waveform length or sample rate is invalid.','AUDIO_FORMAT',422);
 let sum=0,crossings=0,previous=0;for(let i=0;i<length/2;i++){const x=v.getInt16(44+i*2,true)/32768;sum+=x*x;if(i&&((x>=0)!==(previous>=0)))crossings++;previous=x}
 return {rms:Math.sqrt(sum/(length/2)),zcr:crossings/(length/2),sampleRate:rate,samples:length/2,durationSeconds:length/2/rate};
}
export function inferAudio(bytes:Uint8Array,model:AudioModel){const f=audioFeatures(bytes);if(model.algorithm==='portable-forest-v1'){guard(model.trees?.length,'Portable model has no trees.','MODEL',422);return {features:f,probability:model.trees.reduce((sum,t)=>sum+(f[t.feature]<t.threshold?t.below:t.above),0)/model.trees.length}}return {features:f,probability:1/(1+Math.exp(-(f.rms*model.rmsWeight+f.zcr*model.zcrWeight+model.intercept)))}}
export function scorePredictions(predictions:{subjectId:string;probability:number}[],references:Record<string,0|1>,threshold:number){
 const ids=new Set<string>();let tp=0,tn=0,fp=0,fn=0;const joined=predictions.map(p=>{guard(!ids.has(p.subjectId)&&Object.hasOwn(references,p.subjectId)&&Number.isFinite(p.probability)&&p.probability>=0&&p.probability<=1,'Invalid or duplicate prediction.','PREDICTION_INVALID',422);ids.add(p.subjectId);const y=references[p.subjectId];if(p.probability>=threshold){if(y)tp++;else fp++}else{if(y)fn++;else tn++}return {p:p.probability,y}});
 guard(ids.size===Object.keys(references).length,'Every eligible input must have one prediction.','PREDICTION_MISSING',422);
 const div=(a:number,b:number)=>b?a/b:null,sorted=[...joined].sort((a,b)=>a.p-b.p);let rankSum=0;for(let i=0;i<sorted.length;){let j=i+1;while(j<sorted.length&&sorted[j].p===sorted[i].p)j++;for(let k=i;k<j;k++)if(sorted[k].y)rankSum+=(i+1+j)/2;i=j}
 const positives=tp+fn,negatives=tn+fp;
 const wilson=(success:number,n:number)=>{if(!n)return null;const z=1.959963984540054,p=success/n,den=1+z*z/n,mid=(p+z*z/(2*n))/den,half=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/den;return {lower:mid-half,upper:mid+half,method:'Wilson 95%'}};
 return {n:joined.length,eligible:Object.keys(references).length,missing:0,tp,tn,fp,fn,sensitivity:div(tp,positives),specificity:div(tn,negatives),precision:div(tp,tp+fp),accuracy:div(tp+tn,joined.length),auc:positives&&negatives?(rankSum-positives*(positives+1)/2)/(positives*negatives):null,brier:joined.length?joined.reduce((s,r)=>s+(r.p-r.y)**2,0)/joined.length:null,sensitivityInterval:wilson(tp,positives),specificityInterval:wilson(tn,negatives)};
}
export function resolveModel(id:string,items:RecordItem[]):AudioModel {const builtin=referenceModels.find(m=>m.id===id);if(builtin)return {...builtin};const r=items.find(r=>r.kind==='audio_model'&&r.id===id&&r.status==='admitted');guard(r,'Admitted model unavailable.','UNAVAILABLE',404);return {...r.body.config,id:r.id,algorithm:r.body.config.algorithm||'audio-logistic-v1'}}
async function makeRun(env:RecordItem,model:AudioModel,scenario:Scenario,provided?:{subjectId:string;probability:number}[]){
 const predictions=provided?[...provided].sort((a,b)=>a.subjectId.localeCompare(b.subjectId)):env.body.subjects.map((s:Subject,index:number)=>({subjectId:s.id,probability:model.algorithm==='workflow-stub-v1'?(index%3===0?.85:.15):inferAudio(syntheticWav(s),model).probability}));
 const metrics=scorePredictions(predictions,env.body.references,model.threshold),groups=['female','male'].map(group=>{const ss=env.body.subjects.filter((s:Subject)=>s.sex===group),ids=new Set(ss.map((s:Subject)=>s.id)),refs=Object.fromEntries(ss.map((s:Subject)=>[s.id,env.body.references[s.id]]));return {group,n:ss.length,suppressed:ss.length<5,metrics:ss.length<5?null:scorePredictions(predictions.filter((p:any)=>ids.has(p.subjectId)),refs,model.threshold)}});
 const referred=predictions.filter((p:any)=>p.probability>=model.threshold),plan:Event[]=[],event=(id:string,atHour:number,type:string,subjectId:string,effectKey:string,duplicate=false)=>plan.push({id,atHour,type,subjectId,effectKey,duplicate});
 for(const p of predictions)event(`screen-${p.subjectId}`,1,'screen.completed',p.subjectId,`screen:${p.subjectId}`);
 for(const p of referred){
  event(`refer-${p.subjectId}`,2,'referral.created',p.subjectId,`refer:${p.subjectId}`);let labAt=2+scenario.labDelayHours;
  if(scenario.mode==='slow')labAt+=48;
  if(scenario.mode==='outage'&&labAt>=scenario.outageStartHour&&labAt<scenario.outageStartHour+scenario.outageDurationHours){event(`wait-${p.subjectId}`,labAt,'lab.retry_scheduled',p.subjectId,`wait:${p.subjectId}`);labAt=scenario.outageStartHour+scenario.outageDurationHours+1}
  event(`lab-${p.subjectId}`,labAt,'lab.completed',p.subjectId,`lab:${p.subjectId}`);
  if(scenario.mode!=='lost_callback')event(`callback-${p.subjectId}`,labAt+1,'callback.delivered',p.subjectId,`callback:${p.subjectId}`);
  if(scenario.mode==='duplicate')event(`callback-repeat-${p.subjectId}`,labAt+2,'callback.delivered',p.subjectId,`callback:${p.subjectId}`,true);
 }
 plan.sort((a,b)=>a.atHour-b.atHour||a.id.localeCompare(b.id));
 const input={environmentId:env.id,generation:env.body.generation,recipeHash:env.body.recipeHash,snapshotHash:env.body.snapshotHash,referenceHash:env.body.referenceHash,model,scenario,engine:LAB_VERSION};
 const freeze={...input,inputHash:await digest(input),modelHash:await digest(model),planHash:await digest(plan),predictionHash:await digest(predictions)};
 return {freeze,metrics,groups,predictions,plan,referredIds:referred.map((p:any)=>p.subjectId),clockHour:0,cursor:0,events:[],effects:[],resources:[],assertions:[],synthetic:true,classification:model.algorithm==='workflow-stub-v1'?'stub-workflow-only':provided?'imported-predictions-technical':'synthetic-audio-technical',executionKind:model.algorithm,counts:{screened:0,referrals:0,labResults:0,callbacks:0,duplicatesSuppressed:0},finalStateHash:null};
}
export async function advanceRun(body:any,hours:number){
 const b=structuredClone(body),target=Math.min(336,b.clockHour+hours),effects=new Set<string>(b.effects),newEvents=b.plan.slice(b.cursor).filter((e:Event)=>e.atHour<=target);
 const tags=meta(b.freeze.recipeHash);
 for(const e of newEvents){const duplicate=effects.has(e.effectKey);b.events.push({...e,outcome:duplicate?'duplicate_suppressed':'applied'});b.cursor++;
  if(duplicate){b.counts.duplicatesSuppressed++;continue}effects.add(e.effectKey);
  if(e.type==='screen.completed')b.counts.screened++;
  if(e.type==='referral.created'){b.counts.referrals++;b.resources.push({resourceType:'ServiceRequest',id:`SYN-REF-${e.subjectId}`,meta:tags,status:'active',intent:'order',subject:{reference:`Patient/${e.subjectId}`},requester:{reference:'Organization/SYN-FAC-1'},code:{text:'Synthetic laboratory referral'},authoredOn:iso(e.atHour)})}
  if(e.type==='lab.completed'){b.counts.labResults++;b.resources.push({resourceType:'DiagnosticReport',id:`SYN-RESULT-${e.subjectId}`,meta:tags,status:'final',code:{text:'Synthetic workflow result'},subject:{reference:`Patient/${e.subjectId}`},basedOn:[{reference:`ServiceRequest/SYN-REF-${e.subjectId}`}],issued:iso(e.atHour),conclusion:'Fictional result delivered; clinical labels withheld'})}
  if(e.type==='callback.delivered')b.counts.callbacks++;
 }
 b.effects=[...effects].sort();b.clockHour=target;
 const completed=b.cursor===b.plan.length;
 if(completed){const refs=b.referredIds.length,latencies=b.plan.filter((e:Event)=>e.type==='lab.completed').map((e:Event)=>e.atHour-2),maxLatency=latencies.length?Math.max(...latencies):0;
  b.assertions=[{id:'all_screened',label:'Every participant screened',passed:b.counts.screened===b.metrics.n,actual:b.counts.screened,expected:b.metrics.n},{id:'one_referral',label:'One referral per positive prediction',passed:b.counts.referrals===refs,actual:b.counts.referrals,expected:refs},{id:'lab_completion',label:'Every referral receives a result',passed:b.counts.labResults===refs,actual:b.counts.labResults,expected:refs},{id:'callback_completion',label:'Every result reaches the callback sink',passed:b.counts.callbacks===refs,actual:b.counts.callbacks,expected:refs},{id:'max_wait',label:'Lab wait stays within the frozen limit',passed:maxLatency<=b.freeze.scenario.maxWaitHours,actual:maxLatency,expected:b.freeze.scenario.maxWaitHours}];
  b.finalStateHash=await digest({freeze:b.freeze,counts:b.counts,events:b.events,resources:b.resources,assertions:b.assertions});
 }
 return {body:b,status:completed?'completed':'running'};
}
export function assertLabCurrent(action:string,data:any,items:RecordItem[]){
 if(!action.startsWith('lab.'))return;
 let target=items.find(r=>r.id===data.id),run=items.find(r=>r.id===data.runId)||target;
 if(target?.kind==='lab_report')run=items.find(r=>r.id===target?.body.runId);
 const environmentId=data.environmentId||run?.body.freeze?.environmentId||((target?.kind==='ecosystem')?target.id:null);
 if(!environmentId)return;const env=items.find(r=>r.id===environmentId&&r.kind==='ecosystem');guard(env,'Environment unavailable.','UNAVAILABLE',404);
 const generation=data.generation??run?.body.freeze?.generation;
 // Frozen historical reports remain reviewable after reset; replay and writes do not.
 if(!['lab.report.create','lab.report.issue','lab.report.withdraw'].includes(action)&&generation!=null)guard(generation===env.body.generation,'This environment was reset. Start a new run in its current generation.','STALE_GENERATION',410);
}
export async function executeLab(action:LabAction,d:any,actor:Profile,items:RecordItem[],now:string):Promise<RecordItem[]>{
 assertLabCurrent(action,d,items);
 if(['lab.ecosystem.generate','lab.ecosystem.fork'].includes(action))guard(items.filter(r=>r.kind==='ecosystem').length<6,'This alpha workspace supports six ecosystems. Reuse or reset an existing one.','LAB_QUOTA',429);
 if(['lab.run.create','lab.run.import','lab.run.replay'].includes(action))guard(items.filter(r=>r.kind==='lab_run').length<24,'This alpha workspace supports 24 preserved runs per institution.','LAB_QUOTA',429);
 const create=(kind:RecordItem['kind'],title:string,status:string,body:any):RecordItem=>({id:crypto.randomUUID(),kind,title,status,version:1,body,createdBy:actor.person,createdAt:now,updatedAt:now});
 const get=(id:string,kind:string)=>{const r=items.find(r=>r.id===id&&r.kind===kind);guard(r,'Record unavailable.','UNAVAILABLE',404);return r};
 const update=(r:RecordItem,status:string,body:any)=>({...r,status,body,version:r.version+1,updatedAt:now});
 if(action==='lab.ecosystem.generate')return [create('ecosystem',d.name,'ready',await generateEcosystem(d))];
 if(action==='lab.ecosystem.reset'){const env=get(d.id,'ecosystem');return [update(env,'ready',{...env.body,generation:env.body.generation+1,resetNote:d.note}),...items.filter(r=>r.kind==='lab_run'&&r.body.freeze.environmentId===env.id&&['running','paused'].includes(r.status)).map(r=>update(r,'cancelled',{...r.body,cancelNote:'Environment reset',cancelledAt:now}))]}
 if(action==='lab.ecosystem.fork'){const env=get(d.id,'ecosystem');return [create('ecosystem',d.name,'ready',{...structuredClone(env.body),generation:1,forkedFrom:{id:env.id,generation:env.body.generation}})]}
 if(action==='lab.model.register'){const config={...d,algorithm:'audio-logistic-v1'};return [create('audio_model',d.name,'admitted',{config,sha256:await digest(config),admission:{checks:['closed schema','bounded finite weights','fixed inference implementation'],scope:'configuration-only; no submitted code'},synthetic:true})]}
 if(action==='lab.run.create'){const env=get(d.environmentId,'ecosystem'),model=resolveModel(d.modelId,items);return [create('lab_run',`${env.title} · ${model.name} · ${d.scenario.mode}`,'running',await makeRun(env,model,d.scenario))]}
 if(action==='lab.run.import'){const env=get(d.environmentId,'ecosystem'),model:AudioModel={id:'imported',name:d.modelName,version:'1.0.0',rmsWeight:0,zcrWeight:0,intercept:0,threshold:d.threshold,synthetic:true,algorithm:'imported-predictions-v1'};return [create('lab_run',`${env.title} · ${model.name}`,'running',await makeRun(env,model,d.scenario,d.predictions))]}
 if(action==='lab.run.replay'){const run=get(d.id,'lab_run');guard(['completed','cancelled'].includes(run.status),'Replay requires a terminal run.');const env=get(run.body.freeze.environmentId,'ecosystem');guard(env.body.snapshotHash===run.body.freeze.snapshotHash,'Source snapshot has changed.');return [create('lab_run',`Replay · ${run.title}`,'running',{...await makeRun(env,run.body.freeze.model,run.body.freeze.scenario,run.body.executionKind==='imported-predictions-v1'?run.body.predictions:undefined),replayOf:run.id})]}
 if(action==='lab.run.advance'){const run=get(d.id,'lab_run');guard(run.status==='running','Only a running scenario can advance.');const advanced=await advanceRun(run.body,d.hours);return [update(run,advanced.status,advanced.body)]}
 if(action==='lab.run.pause'||action==='lab.run.resume'){const run=get(d.id,'lab_run');guard(run.status===(action.endsWith('pause')?'running':'paused'),'The run is not in the required state.');return [update(run,action.endsWith('pause')?'paused':'running',run.body)]}
 if(action==='lab.run.cancel'){const run=get(d.id,'lab_run');guard(['running','paused'].includes(run.status),'Only an active run can be cancelled.');return [update(run,'cancelled',{...run.body,cancelNote:d.note,cancelledAt:now})]}
 if(action==='lab.report.create'){const run=get(d.runId,'lab_run');guard(run.status==='completed','Complete the scenario before drafting evidence.');const result={freeze:run.body.freeze,metrics:run.body.metrics,groups:run.body.groups,counts:run.body.counts,assertions:run.body.assertions,finalStateHash:run.body.finalStateHash,classification:run.body.classification};return [create('lab_report',`Evidence · ${run.title}`,'draft',{runId:run.id,runAuthor:run.createdBy,summary:d.summary,result,draftDigest:await digest({summary:d.summary,result}),disclaimer:'Synthetic technical test evidence. Generated waveforms are not patient coughs. No TB screening, clinical accuracy or regulatory approval claim is supported.',synthetic:true})]}
 if(action==='lab.report.issue'){const r=get(d.id,'lab_report');guard(r.status==='draft','Only a draft report can be issued.');guard(r.createdBy!==actor.person&&r.body.runAuthor!==actor.person,'A different synthetic person must review the report and underlying run.');guard(await digest({summary:r.body.summary,result:r.body.result})===r.body.draftDigest,'Draft evidence failed its integrity check.','INTEGRITY');const content={...r.body,evidenceId:r.id,title:r.title,issuedAt:now,issuedBy:actor.person,reviewNote:d.note},bytes=canonical(content);const changes=[update(r,'issued',{...content,issuedBytes:bytes,sha256:await digest(bytes),integrityMethod:'SHA-256; not a digital signature'})];if(r.body.correctionOf){const prior=get(r.body.correctionOf,'lab_report');guard(prior.status==='issued','Original evidence is no longer issued.');changes.push(update(prior,'superseded',{...prior.body,supersededBy:r.id,supersededAt:now}))}return changes}
 if(action==='lab.report.withdraw'){const r=get(d.id,'lab_report');guard(r.status==='issued','Only issued evidence can be withdrawn.');return [update(r,'withdrawn',{...r.body,withdrawalNote:d.note,withdrawnAt:now})]}
 throw new AppError(422,'VALIDATION','Unknown lab command.');
}
export function labProjection(r:RecordItem){const body={...r.body};for(const k of ['references','subjects','resources','plan','predictions','effects','referredIds','issuedBytes'])delete body[k];if(r.kind==='lab_run'){body.eventCount=body.events.length;body.events=body.events.slice(-60)}return {...r,body}}
export async function labExport(items:RecordItem[],actor:Profile,id:string){guard(actor.role!=='support','Support cannot export evidence.','FORBIDDEN',403);guard(!items.some(r=>r.kind==='hold'&&r.status==='active'),'Exports are blocked by the safety hold.','SAFETY_HOLD',423);const r=items.find(r=>r.id===id&&r.kind==='lab_report'&&r.status==='issued');guard(r,'Issued evidence unavailable.','UNAVAILABLE',404);guard(typeof r.body.issuedBytes==='string'&&await digest(r.body.issuedBytes)===r.body.sha256,'Stored evidence failed its integrity check.','INTEGRITY');return {bytes:r.body.issuedBytes,sha256:r.body.sha256}}
export function registryResources(items:RecordItem[],actor:Profile,environmentId:string,generation:number,runId?:string):Resource[]{
 guard(actor.role!=='support','Support cannot browse registries.','FORBIDDEN',403);const env=items.find(r=>r.id===environmentId&&r.kind==='ecosystem');guard(env,'Environment unavailable.','UNAVAILABLE',404);guard(env.body.generation===generation,'Registry generation is no longer current.','STALE_GENERATION',410);
 let extra:Resource[]=[];if(runId){const run=items.find(r=>r.id===runId&&r.kind==='lab_run'&&r.body.freeze.environmentId===environmentId&&r.body.freeze.generation===generation);guard(run,'Run unavailable.','UNAVAILABLE',404);extra=run.body.resources}return [...env.body.resources,...extra].sort((a,b)=>(a.resourceType+'/'+a.id).localeCompare(b.resourceType+'/'+b.id));
}
