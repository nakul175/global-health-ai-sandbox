import {context,database,failure,identity,json} from '@/lib/http';
import {load,actorFor} from '@/lib/store';
import {AppError} from '@/lib/domain';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const u=await identity(),c=context(request),s=await load(database(),u.userId,c.tenant),a=actorFor(s,c.profile);if(a.role!=='admin'&&!s.records.some(r=>r.kind==='access_request'&&r.status==='approved'&&r.createdBy===a.person&&r.body.scope==='support_diagnostics'&&Date.parse(r.body.expiresAt)>Date.now()))throw new AppError(403,'GRANT_REQUIRED','An approved, unexpired diagnostics grant is required.');return json({revision:s.revision,recordCount:s.records.length,jobs:s.records.filter(r=>r.kind==='job').map(r=>({id:r.id,status:r.status,attemptCount:r.body.attempts.length})),mediaSessions:s.records.filter(r=>r.kind==='media_session').length,scope:'Aggregate diagnostics only',productionTelemetry:'not_connected'})}catch(e){return failure(e)}}
