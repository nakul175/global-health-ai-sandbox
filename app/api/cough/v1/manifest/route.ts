import {json} from '@/lib/http';
import {manifest} from '@/lib/cough-contract';
export async function GET(){return json(manifest);}
