import { database,failure,json } from '@/lib/http';
export const dynamic='force-dynamic';
export async function GET(){try{await database().prepare('SELECT revision FROM spaces LIMIT 1').first();await database().prepare('SELECT id FROM lab_records LIMIT 1').first();await database().prepare('SELECT id FROM suite_records LIMIT 1').first();await database().prepare('SELECT id FROM live_connectors LIMIT 1').first();return json({status:'ready',edition:'synthetic-r2-alpha',version:'0.6.0'})}catch(e){return failure(e)}}
