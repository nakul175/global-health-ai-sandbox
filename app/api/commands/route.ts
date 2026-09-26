import { context,database,failure,identity,json,verifyOrigin } from '@/lib/http';
import { AppError,parseCommand } from '@/lib/domain';
import { mutate } from '@/lib/store';
export const dynamic='force-dynamic';
export async function POST(request:Request){try{
 const u=await identity();verifyOrigin(request);const c=context(request),key=request.headers.get('Idempotency-Key'),version=request.headers.get('If-Match');
 if(!key||!/^[-A-Za-z0-9_.:]{16,128}$/.test(key))throw new AppError(422,'IDEMPOTENCY_KEY','A 16–128 character idempotency key is required.');
 if(!version)throw new AppError(428,'PRECONDITION','If-Match is required.');
 if(!/^"[1-9][0-9]{0,8}"$/.test(version))throw new AppError(422,'PRECONDITION','If-Match must contain the quoted current revision.');
 if(Number(request.headers.get('Content-Length')||0)>180000)throw new AppError(413,'TOO_LARGE','Request is too large.');
 const reader=request.body?.getReader();let total=0,body='';const decoder=new TextDecoder();
 if(!reader)throw new AppError(400,'JSON','Request body required.');
 while(true){const part=await reader.read();if(part.done)break;total+=part.value.length;if(total>180000){await reader.cancel();throw new AppError(413,'TOO_LARGE','Request is too large.')}body+=decoder.decode(part.value,{stream:true})}body+=decoder.decode();
 let raw;try{raw=JSON.parse(body)}catch{throw new AppError(400,'JSON','Malformed JSON request.')}
 if(['suite.upload.part','suite.upload.finalize','suite.media.result'].includes(raw?.action))throw new AppError(403,'DEDICATED_ROUTE','Use the verified media transfer endpoint.');
 return json(await mutate(database(),u.userId,c.tenant,c.profile,parseCommand(raw),key,Number(version.slice(1,-1))));
 }catch(e){return failure(e)}}
