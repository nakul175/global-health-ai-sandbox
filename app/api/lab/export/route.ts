import {env} from 'cloudflare:workers';
import {attest} from '@/lib/attestation';
import {canonical,digest,AppError} from '@/lib/domain';
import { context,database,failure,identity } from '@/lib/http';
import { actorFor,load } from '@/lib/store';
import { labExport } from '@/lib/lab';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const user=await identity(),c=context(request),space=await load(database(),user.userId,c.tenant),actor=actorFor(space,c.profile),id=new URL(request.url).searchParams.get('id')||'',result=await labExport(space.records,actor,id);if(await digest(result.bytes)!==result.sha256)throw new AppError(409,'INTEGRITY','Evidence digest mismatch.');const signed=new URL(request.url).searchParams.get('signed')==='1';const bytes=signed?canonical(await attest(result.bytes,{spaceId:space.id,recordId:id,kind:'lab_report'},env.EVIDENCE_SIGNING_JWK)):result.bytes;return new Response(bytes,{headers:{'Content-Type':'application/json','Content-Disposition':`attachment; filename="release-2-evidence-${id.slice(0,8)}.json"`,'X-Content-SHA256':await digest(bytes),'X-Evidence-Signature':signed?'ECDSA-P256-SHA256':'unsigned','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}catch(e){return failure(e)}}
