import { context,database,failure,identity,json } from '@/lib/http';
import { actorFor,load,responseView } from '@/lib/store';
export const dynamic='force-dynamic';
// #6: this is the only route that creates the seeded workspace (default `load`); the browser must fetch it before any
// other screen renders, so the first open of an institution seeds it here and every other read passes `{create:false}`.
export async function GET(request:Request){try{const u=await identity(),c=context(request),space=await load(database(),u.userId,c.tenant),actor=actorFor(space,c.profile);return json(responseView(space,actor),200,{'ETag':`"${space.revision}"`})}catch(e){return failure(e)}}
