import { AppError, authorize, canonical, digest, execute, parseCSV, profiles, sampleCSV, tenants, visible, type Command, type Profile, type RecordItem } from './domain';
import { assertLabCurrent, isLabKind } from './lab';
import {suiteCurrent,isSuiteKind} from './suite';
export type Database={prepare:(sql:string)=>any;batch:(statements:any[])=>Promise<any[]>};
export type Space={id:string;revision:number;records:RecordItem[];audit:any[]};
export async function spaceId(owner:string,tenant:string){return (await digest(`workspace:${owner}:${tenant}`)).slice(0,40)}
export async function seed(db:Database,owner:string,tenant:string){
 const t=tenants.find(t=>t.id===tenant);if(!t)throw new AppError(404,'UNAVAILABLE','Institution unavailable.');
 const sid=await spaceId(owner,tenant);
 if(await db.prepare('SELECT id FROM spaces WHERE id = ? AND owner = ?').bind(sid,owner).first())return sid;
 const now=new Date().toISOString();const rid=(key:string)=>`${sid}-${key}`;
 const record=(key:string,kind:RecordItem['kind'],title:string,status:string,body:any,person='fixture-author'):RecordItem=>({id:rid(key),kind,title,status,version:1,body,createdBy:person,createdAt:now,updatedAt:now});
 const items:RecordItem[]=[record('institution','institution',t.name,tenant==='cedar'?'draft':'verified',{legalName:t.name,country:t.country,summary:'Synthetic institution for workflow acceptance testing.',fixture:true},'person-maya'),...profiles.map(p=>record('member-'+p.id,'member',p.name,'active',{profileId:p.id,role:p.role,person:p.person,synthetic:true}))];
 if(tenant!=='cedar'){
 const programme=record('programme','programme','Retrospective AI evaluation','active',{title:'Retrospective AI evaluation',summary:'A controlled programme for synthetic screening benchmarks and evaluation workflow tests.',country:t.country,startDate:'2026-01-01',endDate:'2027-12-31'},'person-maya');
 const protocol={title:'Synthetic screening benchmark',programmeId:programme.id,question:'Can the fixed logistic baseline distinguish the generated positive and negative labels?',intendedUse:'Workflow testing with generated signals only. No clinical decisions.',population:'40 generated records in two balanced synthetic cohorts.',primaryMetric:'sensitivity',minimum:0.85};
 const protocolHash=await digest(protocol);
 const study=record('study','study',protocol.title,'approved',{...protocol,protocolHash,fixture:true,review:{person:'person-elena',decision:'approve',note:'Seeded synthetic approval for immediate evaluation testing.',at:now,protocolHash}},'person-maya');
 const pending=record('study-review','study','Cohort robustness assessment','in_review',{...protocol,title:'Cohort robustness assessment',question:'Does the test pipeline report subgroup metrics consistently?',protocolHash:await digest({...protocol,title:'Cohort robustness assessment',question:'Does the test pipeline report subgroup metrics consistently?'}),submittedAt:now,submittedVersion:1,fixture:true},'person-maya');
 const rows=parseCSV(sampleCSV);
 const dataset=record('dataset','dataset','Synthetic signal cohort · 40 rows','released',{rows,rowCount:rows.length,groups:['cohort_a','cohort_b'],sha256:await digest(rows),synthetic:true,format:'synthetic-signal-v1',custody:{person:'person-sam',note:'Seeded synthetic dataset release.',at:now}},'person-maya');
 const grant=record('grant','grant','Synthetic cohort → screening benchmark','active',{datasetId:dataset.id,studyId:study.id,purpose:'Retrospective synthetic evaluation',expiresAt:new Date(Date.now()+30*864e5).toISOString(),requestedBy:'person-maya',decision:{person:'person-sam',note:'Seeded test grant.',at:now},fixture:true},'person-maya');
 const config={title:'Logistic reference baseline',version:'1.0.0',description:'Deterministic reference implementation on generated signals.',weight:8,intercept:-4,threshold:0.5};
 const model=record('model','model',config.title,'registered',{...config,algorithm:'fixed-logistic-v1',sha256:await digest(config)},'person-leo');
 items.push(programme,study,pending,dataset,grant,model);
 }
 const statements=[db.prepare('INSERT OR IGNORE INTO spaces (id,owner,tenant,revision,last_command,created_at) VALUES (?,?,?,1,?,?)').bind(sid,owner,tenant,'seed',now)];
 for(const r of items){statements.push(db.prepare('INSERT OR IGNORE INTO records (id,space_id,kind,title,status,version,body,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(r.id,sid,r.kind,r.title,r.status,r.version,canonical(r.body),r.createdBy,r.createdAt,r.updatedAt));statements.push(db.prepare('INSERT OR IGNORE INTO snapshots (id,space_id,record_id,version,body,digest) VALUES (?,?,?,?,?,?)').bind(`${r.id}-v1`,sid,r.id,1,canonical(r),await digest(r)))}
 statements.push(db.prepare('INSERT OR IGNORE INTO audit (id,space_id,sequence,actor,action,record_id,at,digest) VALUES (?,?,1,?,?,?,?,?)').bind(`${sid}-seed`,sid,'fixture-system','workspace.initialized',null,now,await digest(items)));
 await db.batch(statements);return sid;
}
export async function load(db:Database,owner:string,tenant:string):Promise<Space>{
 const sid=await seed(db,owner,tenant);
 const results=await db.batch([
 db.prepare('SELECT id,revision FROM spaces WHERE id = ? AND owner = ?').bind(sid,owner),
 db.prepare('SELECT id,kind,title,status,version,body,created_by AS createdBy,created_at AS createdAt,updated_at AS updatedAt FROM records WHERE space_id = ? UNION ALL SELECT id,kind,title,status,version,body,created_by AS createdBy,created_at AS createdAt,updated_at AS updatedAt FROM lab_records WHERE space_id = ? UNION ALL SELECT id,kind,title,status,version,body,created_by AS createdBy,created_at AS createdAt,updated_at AS updatedAt FROM suite_records WHERE space_id = ? ORDER BY createdAt DESC,id').bind(sid,sid,sid),
 db.prepare('SELECT sequence,actor,action,record_id AS recordId,at,digest FROM audit WHERE space_id = ? ORDER BY sequence DESC LIMIT 100').bind(sid)]);
 const space=results[0].results[0];if(!space)throw new AppError(404,'UNAVAILABLE','Institution unavailable.');
 return {...space,records:results[1].results.map((r:any)=>({...r,body:JSON.parse(r.body)})),audit:results[2].results};
}
export function actorFor(space:Space,profileId:string):Profile{
 const actor=profiles.find(p=>p.id===profileId);
 if(!actor)throw new AppError(403,'FORBIDDEN','Select a valid test identity.');
 if(!space.records.some(r=>r.kind==='member'&&r.body.profileId===actor.id&&r.status==='active'))throw new AppError(403,'MEMBERSHIP_REVOKED','This membership is inactive. Switch to an active test identity.');return actor;
}
export function responseView(space:Space,actor:Profile){return {revision:space.revision,records:visible(space.records,actor),audit:actor.role==='support'?[]:space.audit,profile:actor,profiles,tenants,edition:'synthetic-uat',limits:{records:500,datasetRows:1000}}}
function currentRights(command:Command,space:Space){
 let studyId=command.data.studyId,datasetId=command.data.datasetId;
 if(command.action==='report.issue'||command.action==='report.create'){
 const r=space.records.find(r=>r.id===(command.data.runId||command.data.id));
 const result=r?.kind==='run'?r.body:r?.body.result;
 studyId=result?.studyId;datasetId=result?.datasetId;
 }
 if(['run.execute','report.create','report.issue'].includes(command.action)){
 const grant=space.records.find(r=>r.kind==='grant'&&r.status==='active'&&r.body.studyId===studyId&&r.body.datasetId===datasetId&&Date.parse(r.body.expiresAt)>Date.now());
 if(!grant)throw new AppError(403,'GRANT_REQUIRED','An active, unexpired grant is required, including for retries.');
 }
}
export async function mutate(db:Database,owner:string,tenant:string,profileId:string,command:Command,key:string,expected:number){
 const space=await load(db,owner,tenant),actor=actorFor(space,profileId);authorize(command.action,actor,space.records);currentRights(command,space);assertLabCurrent(command.action,command.data,space.records);suiteCurrent(command.action,command.data,space.records);
 const hash=await digest(command);const existing=await db.prepare('SELECT request_hash,response FROM receipts WHERE space_id = ? AND actor = ? AND key = ?').bind(space.id,actor.id,key).first();
 if(existing){if(existing.request_hash!==hash)throw new AppError(409,'IDEMPOTENCY_CONFLICT','This retry key was used for a different request.');return {...JSON.parse(existing.response),replayed:true}}
 if(space.revision!==expected)throw new AppError(409,'VERSION_CONFLICT','This institution changed in another tab or role. Refresh and review before retrying.');
 const changed=await execute(command,actor,space.records);
 const added=changed.filter(r=>!space.records.some(x=>x.id===r.id)).length;
 if(space.records.length+added>500&&!['concern.record','hold.apply'].includes(command.action))throw new AppError(409,'TEST_LIMIT','This test institution has reached its 500-record limit. Safety reporting and existing record updates remain available.');const cmdId=crypto.randomUUID(),now=new Date().toISOString();
 const receipt={commandId:cmdId,revision:expected+1,recordIds:changed.map(r=>r.id),action:command.action,replayed:false};
 const gate='EXISTS (SELECT 1 FROM spaces WHERE id = ? AND last_command = ?)';
 const queries=[db.prepare('UPDATE spaces SET revision = revision + 1,last_command = ? WHERE id = ? AND owner = ? AND revision = ?').bind(cmdId,space.id,owner,expected)];
 for(const r of changed){
 const table=isSuiteKind(r.kind)?'suite_records':isLabKind(r.kind)?'lab_records':'records',snapshotTable=isSuiteKind(r.kind)?'suite_snapshots':isLabKind(r.kind)?'lab_snapshots':'snapshots';
 queries.push(db.prepare(`INSERT INTO ${table} (id,space_id,kind,title,status,version,body,created_by,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE ${gate} ON CONFLICT(id) DO UPDATE SET title=excluded.title,status=excluded.status,version=excluded.version,body=excluded.body,updated_at=excluded.updated_at,created_by=excluded.created_by WHERE ${table}.space_id=excluded.space_id`).bind(r.id,space.id,r.kind,r.title,r.status,r.version,canonical(r.body),r.createdBy,r.createdAt,r.updatedAt,space.id,cmdId));
 queries.push(db.prepare(`INSERT INTO ${snapshotTable} (id,space_id,record_id,version,body,digest) SELECT ?,?,?,?,?,? WHERE ${gate}`).bind(`${r.id}-v${r.version}`,space.id,r.id,r.version,canonical(r),await digest(r),space.id,cmdId));
 }
 queries.push(db.prepare(`INSERT INTO audit (id,space_id,sequence,actor,action,record_id,at,digest) SELECT ?,?,?,?,?,?,?,? WHERE ${gate}`).bind(cmdId,space.id,expected+1,actor.id,command.action,changed[0]?.id||null,now,await digest(changed),space.id,cmdId));
 queries.push(db.prepare(`INSERT INTO receipts (id,space_id,actor,key,request_hash,response,created_at) SELECT ?,?,?,?,?,?,? WHERE ${gate}`).bind(cmdId,space.id,actor.id,key,hash,canonical(receipt),now,space.id,cmdId));
 const results=await db.batch(queries);
 if(!results[0].meta.changes){
 const replay=await db.prepare('SELECT request_hash,response FROM receipts WHERE space_id = ? AND actor = ? AND key = ?').bind(space.id,actor.id,key).first();
 if(replay?.request_hash===hash)return {...JSON.parse(replay.response),replayed:true};
 throw new AppError(409,'VERSION_CONFLICT','Another change completed first. Refresh and review your draft.');
 }
 return receipt;
}
export function exportReport(space:Space,actor:Profile,id:string){
 if(actor.role==='support')throw new AppError(403,'FORBIDDEN','Support cannot export evidence.');
 if(space.records.some(r=>r.kind==='hold'&&r.status==='active'))throw new AppError(423,'SAFETY_HOLD','Exports are blocked by the safety hold.');
 const report=space.records.find(r=>r.id===id&&r.kind==='report'&&r.status==='issued');if(!report)throw new AppError(404,'UNAVAILABLE','Issued evidence unavailable.');
 const grant=space.records.find(r=>r.id===report.body.result.grantId&&r.status==='active'&&Date.parse(r.body.expiresAt)>Date.now());
 if(!grant)throw new AppError(403,'GRANT_REQUIRED','The data grant is no longer valid. Export is blocked.');
 return {bytes:report.body.issuedBytes,sha256:report.body.sha256};
}
