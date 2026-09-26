import {env} from 'cloudflare:workers';
import {context,database,failure,identity,json} from '@/lib/http';
import {actorFor,load} from '@/lib/store';
import {signerInfo} from '@/lib/attestation';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const user=await identity(),c=context(request);actorFor(await load(database(),user.userId,c.tenant),c.profile);return json(await signerInfo(env.EVIDENCE_SIGNING_JWK))}catch(e){return failure(e)}}
