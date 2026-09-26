import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { AppError } from './domain';
export async function identity(){const u=await getChatGPTUser();if(!u)throw new AppError(401,'UNAUTHENTICATED','Sign in with ChatGPT to open your private test workspace.');return u}
export function database(){if(!env.DB)throw new AppError(503,'DATABASE_UNAVAILABLE','The workspace is temporarily unavailable. Please try again.');return env.DB}
export function json(value:any,status=200,extra:Record<string,string>={}){return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}})}
export function failure(e:unknown){if(e instanceof AppError)return json({error:{code:e.code,message:e.message}},e.status);console.error('Workspace request failed',e instanceof Error?e.name:'Unknown');return json({error:{code:'UNAVAILABLE',message:'The request could not be completed. Your unsaved input is preserved; please retry.'}},503)}
export function context(request:Request){const url=new URL(request.url);return {tenant:url.searchParams.get('tenant')||'aster',profile:request.headers.get('X-Test-Profile')||'maya'}}
export function verifyOrigin(request:Request){const origin=request.headers.get('Origin');if(!origin||origin!==new URL(request.url).origin)throw new AppError(403,'ORIGIN','Open the workspace directly before making changes.');if(request.headers.get('Content-Type')?.split(';')[0]!=='application/json')throw new AppError(415,'CONTENT_TYPE','Use application/json.');}
