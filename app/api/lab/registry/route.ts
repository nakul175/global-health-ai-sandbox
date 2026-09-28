import { context,database,failure,identity,json } from '@/lib/http';
import { actorFor,load } from '@/lib/store';
import { AppError,digest } from '@/lib/domain';
import { registryResources } from '@/lib/lab';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{
 const user=await identity(),c=context(request),url=new URL(request.url),space=await load(database(),user.userId,c.tenant,{create:false}),actor=actorFor(space,c.profile);
 const environmentId=url.searchParams.get('environment')||'',generation=Number(url.searchParams.get('generation')),type=url.searchParams.get('type')||'Patient',search=(url.searchParams.get('search')||'').trim().toLowerCase(),runId=url.searchParams.get('run')||undefined;
 const limit=Number(url.searchParams.get('limit')||25);if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(generation)||generation<1||search.length>100)throw new AppError(422,'VALIDATION','Use a current generation, search up to 100 characters and a limit from 1 to 100.');
 if(!['Patient','Organization','Practitioner','Encounter','Observation','ServiceRequest','DiagnosticReport'].includes(type))throw new AppError(422,'PROFILE_UNSUPPORTED','Resource type is not part of this registry profile.');
 const all=registryResources(space.records,actor,environmentId,generation,runId).filter(r=>r.resourceType===type&&(!search||r.id.toLowerCase().includes(search)||JSON.stringify(r.name||'').toLowerCase().includes(search)));
 const binding=await digest({space:space.id,environmentId,generation,type,search,runId:runId||null,revision:runId?space.records.find(r=>r.id===runId)?.version:null});
 let offset=0;const token=url.searchParams.get('cursor');if(token){try{const cursor=JSON.parse(atob(token));if(cursor.binding!==binding||!Number.isInteger(cursor.offset)||cursor.offset<0||cursor.offset>all.length||cursor.expiresAt<Date.now())throw new Error();offset=cursor.offset}catch{throw new AppError(400,'CURSOR','Cursor is invalid, expired, or belongs to another query.')}}
 const items=all.slice(offset,offset+limit),next=offset+items.length;
 return json({profile:'synthetic-registry-r4-shaped-v1',synthetic:true,generation,total:all.length,items,next_cursor:next<all.length?btoa(JSON.stringify({binding,offset:next,expiresAt:Date.now()+15*60000})):null});
 }catch(e){return failure(e)}}
