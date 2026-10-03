import type {MediaPart} from '@/lib/view-types';
import {env} from 'cloudflare:workers';
import {context,database,failure,identity,json} from '@/lib/http';
import {actorFor,load,mutate} from '@/lib/store';
import {AppError,authorize,parseCommand,digest} from '@/lib/domain';
import {audioFeatures,resolveModel,inferAudio} from '@/lib/lab';
export const dynamic='force-dynamic';
const sha=async(bytes:Uint8Array)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes as BufferSource))].map(x=>x.toString(16).padStart(2,'0')).join('');
function controls(request:Request){if(request.headers.get('Origin')!==new URL(request.url).origin)throw new AppError(403,'ORIGIN','Open the workspace before uploading.');const key=request.headers.get('Idempotency-Key')||'',version=request.headers.get('If-Match')||'';if(!/^[-A-Za-z0-9_.:]{16,128}$/.test(key)||!/^"[1-9][0-9]{0,8}"$/.test(version))throw new AppError(428,'PRECONDITION','Intent key and quoted revision are required.');return{key,revision:Number(version.slice(1,-1))}}
async function setup(request:Request){const user=await identity(),c=context(request),db=database(),space=await load(db,user.userId,c.tenant,{create:false}),actor=actorFor(space,c.profile),url=new URL(request.url),id=url.searchParams.get('id'),record=space.records.find(r=>r.id===id&&r.kind==='media_session');if(!record)throw new AppError(404,'UNAVAILABLE','Media session unavailable.');if(!env.MEDIA)throw new AppError(503,'STORAGE_UNAVAILABLE','Media storage is unavailable.');return{user,c,db,space,actor,url,record,bucket:env.MEDIA}}
function keyFor(space:string,id:string,index:number,hash:string){return `${space}/media/${id}/${index}/${hash}`}
async function assemble(s:Awaited<ReturnType<typeof setup>>){const b=s.record.body;if(b.parts.length!==Math.ceil(b.size/32768))throw new AppError(409,'INCOMPLETE','Some chunks are missing.');const output=new Uint8Array(b.size);for(const p of b.parts){const object=await s.bucket.get(keyFor(s.space.id,s.record.id,p.index,p.sha256));if(!object)throw new AppError(409,'INCOMPLETE','A stored chunk is missing; resume the upload.');const bytes=new Uint8Array(await object.arrayBuffer());if(bytes.length!==p.size||await sha(bytes)!==p.sha256)throw new AppError(409,'INTEGRITY','Stored chunk failed its integrity check.');output.set(bytes,p.index*32768)}if(await sha(output)!==b.sha256)throw new AppError(409,'INTEGRITY','Whole-file digest mismatch.');return output}
export async function PUT(request:Request){try{const ctl=controls(request),s=await setup(request);authorize('suite.upload.part',s.actor,s.space.records);if(s.record.createdBy!==s.actor.person||s.record.status!=='uploading')throw new AppError(403,'FORBIDDEN','Only the uploader can write to an open session.');const index=Number(s.url.searchParams.get('part')),hash=request.headers.get('X-Chunk-SHA256')||'';if(request.headers.get('Content-Type')!=='application/octet-stream')throw new AppError(415,'CONTENT_TYPE','Use application/octet-stream.');if(Number(request.headers.get('Content-Length')||0)>32768)throw new AppError(413,'TOO_LARGE','Chunk exceeds 32 KiB.');const reader=request.body?.getReader();if(!reader)throw new AppError(400,'BODY','Chunk bytes required.');const pieces:Uint8Array[]=[];let length=0;while(true){const part=await reader.read();if(part.done)break;length+=part.value.length;if(length>32768){await reader.cancel();throw new AppError(413,'TOO_LARGE','Chunk exceeds 32 KiB.')}pieces.push(part.value)}const bytes=new Uint8Array(length);let offset=0;for(const p of pieces){bytes.set(p,offset);offset+=p.length}const command=parseCommand({action:'suite.upload.part',data:{id:s.record.id,index,size:length,sha256:hash}});if(await sha(bytes)!==hash)throw new AppError(409,'INTEGRITY','Chunk digest mismatch.');const total=Math.ceil(s.record.body.size/32768),expected=index===total-1?s.record.body.size-index*32768:32768;if(index>=total||length!==expected)throw new AppError(422,'PART','Chunk does not match the upload manifest.');const existing=s.record.body.parts.find((p:MediaPart)=>p.index===index);if(existing&&existing.sha256!==hash)throw new AppError(409,'PART_CONFLICT','This part already has different bytes.');if(s.space.revision!==ctl.revision)throw new AppError(409,'VERSION_CONFLICT','Refresh before resuming.');
 // #3: the chunk is written before the metadata commit so committed metadata never references an absent object
 // (finalisation, delivery, checkpoint capture and the client's resume all treat a committed part as stored). The
 // commit performs the idempotency, revision, role, gate and part checks; when it is rejected the object is removed
 // again unless a concurrent identical part (same index and digest, hence the same content-addressed key) has been
 // committed meanwhile, so the rejection path leaves no orphan. The object store offers no conditional delete, so a
 // commit that lands between the reference check and the delete is caught by a second check that restores the bytes;
 // a commit landing after that second check is the residual window, and re-sending the same part repairs it because
 // an identical committed part is accepted and its bytes are written before anything else happens.
 await s.bucket.put(keyFor(s.space.id,s.record.id,index,hash),bytes,{httpMetadata:{contentType:'application/octet-stream'}});
 try{
  return json(await mutate(s.db,s.user.userId,s.c.tenant,s.c.profile,command,ctl.key,ctl.revision));
 }catch(e){
  await discardUnreferenced(s,index,hash,bytes);
  throw e;
 }}catch(e){return failure(e)}}
async function partReferenced(s:Awaited<ReturnType<typeof setup>>,index:number,hash:string){
 const current=await load(s.db,s.user.userId,s.c.tenant,{create:false});
 const record=current.records.find(r=>r.id===s.record.id&&r.kind==='media_session');
 return Boolean(record?.body.parts.some((p:{index:number;sha256:string})=>p.index===index&&p.sha256===hash));
}
// Removes a freshly written chunk whose metadata commit was rejected, keeping it only when committed metadata now
// references it, and restores it if a concurrent identical part was committed while the delete was in flight.
// Cleanup is best effort: its own failure is logged and the original rejection is still reported.
async function discardUnreferenced(s:Awaited<ReturnType<typeof setup>>,index:number,hash:string,bytes:Uint8Array){
 try{
  const key=keyFor(s.space.id,s.record.id,index,hash);
  if(await partReferenced(s,index,hash))return;
  await s.bucket.delete(key);
  if(await partReferenced(s,index,hash))await s.bucket.put(key,bytes,{httpMetadata:{contentType:'application/octet-stream'}});
 }catch(cleanup){
  console.error('Media chunk cleanup failed',cleanup instanceof Error?cleanup.name:'Unknown');
 }
}
export async function POST(request:Request){try{const ctl=controls(request),s=await setup(request);authorize('suite.upload.finalize',s.actor,s.space.records);if(s.record.createdBy!==s.actor.person||!['uploading','quarantined'].includes(s.record.status))throw new AppError(403,'FORBIDDEN','Only the uploader may finalise an open session.');const bytes=await assemble(s),features=audioFeatures(bytes);return json(await mutate(s.db,s.user.userId,s.c.tenant,s.c.profile,parseCommand({action:'suite.upload.finalize',data:{id:s.record.id,sha256:await sha(bytes),features}}),ctl.key,ctl.revision));}catch(e){return failure(e)}}
export async function GET(request:Request){try{const s=await setup(request);if(s.actor.role==='support')throw new AppError(403,'FORBIDDEN','Support cannot read media.');if(s.space.records.some(r=>r.kind==='hold'&&r.status==='active'))throw new AppError(423,'SAFETY_HOLD','Media delivery is paused.');if(s.record.status!=='released')throw new AppError(403,'QUARANTINE','Media is not released for synthetic testing.');const scope=s.url.searchParams.get('purpose')==='export'?'export':'playback';if(!s.space.records.some(r=>r.kind==='access_request'&&r.status==='approved'&&r.createdBy===s.actor.person&&r.body.scope===scope&&Date.parse(r.body.expiresAt)>Date.now()))throw new AppError(403,'GRANT_REQUIRED',`An active ${scope} grant is required.`);const bytes=await assemble(s);return new Response(bytes as unknown as BodyInit,{headers:{'Content-Type':'audio/wav','Content-Disposition':`attachment; filename="synthetic-${s.record.id}.wav"`,'X-Content-SHA256':s.record.body.sha256,'Cache-Control':'no-store','X-Data-Origin':'synthetic','X-Content-Type-Options':'nosniff'}})}catch(e){return failure(e)}}
export async function PATCH(request:Request){try{const ctl=controls(request),s=await setup(request);authorize('suite.media.result',s.actor,s.space.records);if(s.record.status!=='released')throw new AppError(403,'QUARANTINE','Release synthetic media first.');if(!s.space.records.some(r=>r.kind==='access_request'&&r.status==='approved'&&r.createdBy===s.actor.person&&r.body.scope==='inference'&&Date.parse(r.body.expiresAt)>Date.now()))throw new AppError(403,'GRANT_REQUIRED','An active inference grant is required.');const model=resolveModel(s.url.searchParams.get('model')||'',s.space.records);if(!['audio-logistic-v1','portable-forest-v1'].includes(model.algorithm))throw new AppError(422,'MODEL','Select an executable audio model.');const bytes=await assemble(s),output=inferAudio(bytes,model);return json(await mutate(s.db,s.user.userId,s.c.tenant,s.c.profile,parseCommand({action:'suite.media.result',data:{id:s.record.id,modelId:model.id,modelHash:await digest(model),probability:output.probability,threshold:model.threshold}}),ctl.key,ctl.revision));}catch(e){return failure(e)}}
