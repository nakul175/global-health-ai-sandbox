import {env} from 'cloudflare:workers';
import {attest} from '@/lib/attestation';
import {canonical,digest,AppError} from '@/lib/domain';
import { context,database,failure,identity } from '@/lib/http';
import { actorFor,exportReport,load } from '@/lib/store';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const u=await identity(),c=context(request),space=await load(database(),u.userId,c.tenant,{create:false}),actor=actorFor(space,c.profile),id=new URL(request.url).searchParams.get('id')||'',report=exportReport(space,actor,id);if(await digest(report.bytes)!==report.sha256)throw new AppError(409,'INTEGRITY','Evidence digest mismatch.');const signed=new URL(request.url).searchParams.get('signed')==='1';const bytes=signed?canonical(await attest(report.bytes,{spaceId:space.id,recordId:id,kind:'report'},env.EVIDENCE_SIGNING_JWK)):report.bytes;return new Response(bytes,{headers:{'Content-Type':'application/json','Content-Disposition':`attachment; filename="synthetic-evidence-${id.slice(0,12)}.json"`,'Cache-Control':'no-store','X-Content-SHA256':await digest(bytes),'X-Evidence-Signature':signed?'ECDSA-P256-SHA256':'unsigned','X-Content-Type-Options':'nosniff'}})}catch(e){return failure(e)}}
