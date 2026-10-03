import {AppError,canonical,digest} from './domain';
import {base64,unbase64,byteHash} from './attestation';
import type {Database} from './store';

// Fixed table/column lists are shared by capture and isolated recovery. No caller SQL.
export const checkpointColumns:Record<string,string[]>={
 spaces:['id','owner','tenant','revision','last_command','created_at'],
 records:['id','space_id','kind','title','status','version','body','created_by','created_at','updated_at'],
 lab_records:['id','space_id','kind','title','status','version','body','created_by','created_at','updated_at'],
 suite_records:['id','space_id','kind','title','status','version','body','created_by','created_at','updated_at'],
 snapshots:['id','space_id','record_id','version','body','digest'],
 lab_snapshots:['id','space_id','record_id','version','body','digest'],
 suite_snapshots:['id','space_id','record_id','version','body','digest'],
 audit:['id','space_id','sequence','actor','action','record_id','at','digest'],
 live_connectors:['id','space_id','name','status','version','config','credential','config_hash','test_at','test_passed','created_at','updated_at'],
 connector_calls:['id','space_id','connector_id','kind','status','request_hash','config_hash','actor','result','created_at','finished_at'],
 receipts:['id','space_id','actor','key','request_hash','response','created_at'],
 cough_customers:['id','space_id','customer_id','active','version','agreement_ref','created_at','updated_at'],
 cough_evaluations:['id','space_id','customer_id','request_id','request_hash','fixture','agreement_version','status','result','created_at','finished_at']
};
const maxBytes=16*1024*1024;
export type Checkpoint={format:'sandbox-checkpoint-v1';spaceId:string;revision:number;createdAt:string;tables:Record<string,any[]>;objects:{key:string;sha256:string;bytes:string}[]};
type Bucket={get:(key:string)=>Promise<{arrayBuffer:()=>Promise<ArrayBuffer>}|null>;put:(key:string,value:any,options?:any)=>Promise<any>};
function mediaParts(tables:Record<string,any[]>,sid:string){return tables.suite_records.filter(r=>r.kind==='media_session').flatMap(r=>JSON.parse(r.body).parts.map((p:any)=>({key:`${sid}/media/${r.id}/${p.index}/${p.sha256}`,size:p.size,sha256:p.sha256})))}
export async function captureCheckpoint(db:Database,bucket:Bucket,sid:string):Promise<Checkpoint>{
 const names=Object.keys(checkpointColumns),result=await db.batch(names.map(name=>db.prepare(`SELECT ${checkpointColumns[name].join(',')} FROM ${name} WHERE ${name==='spaces'?'id':'space_id'} = ? ORDER BY id`).bind(sid)));
 const tables=Object.fromEntries(names.map((name,i)=>[name,result[i].results]));if(tables.spaces.length!==1)throw new AppError(404,'UNAVAILABLE','Workspace unavailable.');
 const data:Checkpoint={format:'sandbox-checkpoint-v1',spaceId:sid,revision:tables.spaces[0].revision,createdAt:new Date().toISOString(),tables,objects:[]};let size=new TextEncoder().encode(canonical(data)).length;
 for(const p of mediaParts(tables,sid)){if(size+p.size*1.4>maxBytes)throw new AppError(413,'CHECKPOINT_LIMIT','Checkpoint exceeds the 16 MiB test bound.');const object=await bucket.get(p.key);if(!object)throw new AppError(409,'CHECKPOINT_INCOMPLETE','A referenced audio chunk is missing.');const bytes=new Uint8Array(await object.arrayBuffer());if(bytes.length!==p.size||await byteHash(bytes)!==p.sha256)throw new AppError(409,'INTEGRITY','An audio chunk failed verification.');const encoded=base64(bytes);data.objects.push({key:p.key,sha256:p.sha256,bytes:encoded});size+=encoded.length+256;}
 await validateCheckpoint(data,sid);return data;
}
export async function validateCheckpoint(data:Checkpoint,sid:string){
 const bad=()=>{throw new AppError(409,'CHECKPOINT_INTEGRITY','Checkpoint integrity or workspace scope failed.')};
 if(data.tables && !Object.hasOwn(data.tables,'live_connectors') && !Object.hasOwn(data.tables,'connector_calls')){data.tables.live_connectors=[];data.tables.connector_calls=[];}
 // Previously sealed nine/eleven-table archives predate this additive partner ledger.
 if(data.tables && !Object.hasOwn(data.tables,'cough_customers') && !Object.hasOwn(data.tables,'cough_evaluations')){data.tables.cough_customers=[];data.tables.cough_evaluations=[];}
 if(data.format!=='sandbox-checkpoint-v1'||data.spaceId!==sid||canonical(Object.keys(data.tables).sort())!==canonical(Object.keys(checkpointColumns).sort()))bad();
 for(const [name,columns] of Object.entries(checkpointColumns)){const rows=data.tables[name];if(!Array.isArray(rows)||new Set(rows.map(r=>r.id)).size!==rows.length)bad();for(const row of rows){if(canonical(Object.keys(row).sort())!==canonical([...columns].sort())||(name==='spaces'?row.id:row.space_id)!==sid)bad();}}
 if(data.tables.spaces.length!==1||data.tables.spaces[0].revision!==data.revision)bad();
 for(const [records,snapshots] of [['records','snapshots'],['lab_records','lab_snapshots'],['suite_records','suite_snapshots']]){
  for(const s of data.tables[snapshots]){if(await digest(JSON.parse(s.body))!==s.digest)bad();}
  for(const r of data.tables[records]){const snap=data.tables[snapshots].find(s=>s.record_id===r.id&&s.version===r.version);if(!snap)bad();const expected={id:r.id,kind:r.kind,title:r.title,status:r.status,version:r.version,body:JSON.parse(r.body),createdBy:r.created_by,createdAt:r.created_at,updatedAt:r.updated_at};if(canonical(expected)!==canonical(JSON.parse(snap.body)))bad();}
 }
 const sequences=data.tables.audit.map(r=>r.sequence).sort((a,b)=>a-b);if(sequences.length!==data.revision||sequences.some((v,i)=>v!==i+1))bad();
 const parts=mediaParts(data.tables,sid);if(parts.length!==data.objects.length||new Set(data.objects.map(o=>o.key)).size!==parts.length)bad();for(const p of parts){const o=data.objects.find(o=>o.key===p.key);if(!o)bad();const bytes=unbase64(o!.bytes);if(bytes.length!==p.size||o!.sha256!==p.sha256||await byteHash(bytes)!==p.sha256)bad();}
 return {revision:data.revision,tables:Object.fromEntries(Object.entries(data.tables).map(([n,r])=>[n,r.length])),audioChunks:data.objects.length,contentHash:await digest(data)};
}
async function encryptionKey(raw?:string){if(!raw||!/^[a-f0-9]{64}$/.test(raw))throw new AppError(503,'CHECKPOINT_KEY_UNAVAILABLE','Checkpoint encryption is not configured.');return crypto.subtle.importKey('raw',Uint8Array.from(raw.match(/../g)!,h=>parseInt(h,16)),{name:'AES-GCM'},false,['encrypt','decrypt'])}
export async function sealCheckpoint(data:Checkpoint,raw?:string){const bytes=new TextEncoder().encode(canonical(data));if(bytes.length>maxBytes)throw new AppError(413,'CHECKPOINT_LIMIT','Checkpoint exceeds the 16 MiB test bound.');const key=await encryptionKey(raw),iv=crypto.getRandomValues(new Uint8Array(12)),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:new TextEncoder().encode(data.spaceId)},key,bytes);return {format:'sandbox-encrypted-checkpoint-v1',spaceId:data.spaceId,keyId:await digest(raw!),iv:base64(iv),ciphertext:base64(new Uint8Array(cipher))}}
export async function openCheckpoint(envelope:any,sid:string,raw?:string):Promise<Checkpoint>{
 const key=await encryptionKey(raw);if(envelope.format!=='sandbox-encrypted-checkpoint-v1'||envelope.spaceId!==sid||envelope.keyId!==await digest(raw!))throw new AppError(409,'CHECKPOINT_INTEGRITY','Checkpoint scope or encryption key mismatch.');
 try{const decoded=unbase64(envelope.ciphertext);if(decoded.length>maxBytes+16)throw new Error('bound');const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unbase64(envelope.iv) as BufferSource,additionalData:new TextEncoder().encode(sid)},key,decoded as BufferSource);const data=JSON.parse(new TextDecoder().decode(plain));await validateCheckpoint(data,sid);return data}catch{throw new AppError(409,'CHECKPOINT_INTEGRITY','Checkpoint authentication or integrity failed.')}
}
// Operator/test API only. Never exposed as a production HTTP restore route.
// Target must be an isolated, empty, migrated database and empty object destination.
export async function restoreCheckpoint(db:Database,bucket:Bucket,data:Checkpoint){
 const summary=await validateCheckpoint(data,data.spaceId),tables=Object.keys(checkpointColumns);
 const counts=await db.batch(tables.map(t=>db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).bind()));if(counts.some(r=>r.results[0].n!==0))throw new AppError(409,'RESTORE_TARGET_NOT_EMPTY','Restore requires an empty isolated database.');
 for(const o of data.objects)if(await bucket.get(o.key))throw new AppError(409,'RESTORE_TARGET_NOT_EMPTY','Restore target contains audio objects.');
 for(const o of data.objects)await bucket.put(o.key,unbase64(o.bytes));
 const statements=tables.flatMap(t=>data.tables[t].map(row=>db.prepare(`INSERT INTO ${t} (${checkpointColumns[t].join(',')}) VALUES (${checkpointColumns[t].map(()=>'?').join(',')})`).bind(...checkpointColumns[t].map(c=>row[c]))));
 await db.batch(statements);return summary;
}
