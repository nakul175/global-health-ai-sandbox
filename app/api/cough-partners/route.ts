import {env} from 'cloudflare:workers';
import {identity,context,json,failure,verifyOrigin} from '@/lib/http';
import {partnersRead,partnersWrite,type CoughDatabase} from '@/lib/cough-provider';
import {coughBody,discardCoughBody} from '@/lib/cough-http';
export async function GET(request:Request){try{const e=env,u=await identity(),c=context(request);return json(await partnersRead(e.DB as CoughDatabase,e,u.userId,c.profile));}catch(error){return failure(error);}}
export async function POST(request:Request){try{verifyOrigin(request);const e=env,u=await identity(),c=context(request);return json(await partnersWrite(e.DB as CoughDatabase,e,u.userId,c.profile,await coughBody(request)));}catch(error){await discardCoughBody(request);return failure(error);}}
