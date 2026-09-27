import { context,database,failure,identity } from '@/lib/http';
import { actorFor,load } from '@/lib/store';
import { AppError } from '@/lib/domain';
import { registryResources,syntheticWav } from '@/lib/lab';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{
 const user=await identity(),c=context(request),url=new URL(request.url),space=await load(database(),user.userId,c.tenant,{create:false}),actor=actorFor(space,c.profile),environmentId=url.searchParams.get('environment')||'',generation=Number(url.searchParams.get('generation'));
 if(space.records.some(r=>r.kind==='hold'&&r.status==='active'))throw new AppError(423,'SAFETY_HOLD','Audio access is paused by the safety hold.');
 registryResources(space.records,actor,environmentId,generation);const env=space.records.find(r=>r.id===environmentId)!,subject=env.body.subjects.find((s:any)=>s.id===url.searchParams.get('subject'));
 if(!subject)throw new AppError(404,'UNAVAILABLE','Synthetic audio unavailable.');const bytes=syntheticWav(subject);
 return new Response(bytes as unknown as BodyInit,{headers:{'Content-Type':'audio/wav','Content-Disposition':`attachment; filename="${subject.id}-synthetic.wav"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Data-Origin':'synthetic'}});
 }catch(e){return failure(e)}}
