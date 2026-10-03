import {env} from 'cloudflare:workers';
import {json,failure} from '@/lib/http';
import {authenticate,lookup,type CoughDatabase} from '@/lib/cough-provider';
export async function GET(request:Request,{params}:{params:Promise<{requestId:string}>}){try{const e=env;await authenticate(request,e);const result=await lookup(e.DB as CoughDatabase,e,(await params).requestId);return result.pending?json({status:'pending',requestId:result.requestId},202):json(result.result);}catch(error){return failure(error);}}
