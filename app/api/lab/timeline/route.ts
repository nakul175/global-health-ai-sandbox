import { context,database,failure,identity,json } from '@/lib/http';
import { actorFor,load } from '@/lib/store';
import { AppError } from '@/lib/domain';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const user=await identity(),c=context(request),space=await load(database(),user.userId,c.tenant),actor=actorFor(space,c.profile);if(actor.role==='support')throw new AppError(403,'FORBIDDEN','Support cannot inspect run events.');const run=space.records.find(r=>r.kind==='lab_run'&&r.id===new URL(request.url).searchParams.get('run'));if(!run)throw new AppError(404,'UNAVAILABLE','Run unavailable.');return json({synthetic:true,runId:run.id,generation:run.body.freeze.generation,clockHour:run.body.clockHour,events:run.body.events})}catch(e){return failure(e)}}
