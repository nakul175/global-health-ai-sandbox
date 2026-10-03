import {env} from 'cloudflare:workers';
import {json,failure} from '@/lib/http';
import {authenticate,evaluate,type CoughDatabase} from '@/lib/cough-provider';
import {coughBody,discardCoughBody} from '@/lib/cough-http';
export async function POST(request:Request){try{const e=env;await authenticate(request,e);const result=await evaluate(e.DB as CoughDatabase,e,await coughBody(request),request.headers.get('idempotency-key')??'');return result.pending?json({status:'pending',requestId:result.requestId},202):json(result.result);}catch(error){await discardCoughBody(request);return failure(error);}}
