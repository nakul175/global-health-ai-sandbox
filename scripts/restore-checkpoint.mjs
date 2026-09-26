// Offline operator procedure. Never points at hosted D1/R2 or overwrites a target.
import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname,sep} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';
const [archiveArg,targetArg]=process.argv.slice(2);
if(!archiveArg||!targetArg||!process.env.CHECKPOINT_KEY_HEX)throw new Error('Usage: CHECKPOINT_KEY_HEX=<escrowed key> node scripts/restore-checkpoint.mjs <archive.json> <new-empty-directory>');
const target=resolve(targetArg);if(existsSync(target)&&readdirSync(target).length)throw new Error('Target must be a new or empty isolated directory.');
const text=readFileSync(resolve(archiveArg),'utf8');if(Buffer.byteLength(text)>24*1024*1024)throw new Error('Archive exceeds the supported bound.');
mkdirSync('.test-build',{recursive:true});for(const name of ['domain','lab','suite','attestation','checkpoint']){let js=ts.transpileModule(readFileSync('lib/'+name+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;for(const dep of ['domain','lab','suite','attestation'])js=js.replaceAll(`'./${dep}'`,`'./${dep}.mjs'`);writeFileSync('.test-build/'+name+'.mjs',js)}
const {openCheckpoint,restoreCheckpoint}=await import('../.test-build/checkpoint.mjs');
const envelope=JSON.parse(text),data=await openCheckpoint(envelope,envelope.spaceId,process.env.CHECKPOINT_KEY_HEX);
mkdirSync(target,{recursive:true});const raw=new DatabaseSync(resolve(target,'workspace.sqlite'));raw.exec('PRAGMA foreign_keys=ON');for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())raw.exec(readFileSync('drizzle/'+f,'utf8'));
const db={prepare(sql){return {sql,args:[],bind(...args){this.args=args;return this}}},async batch(statements){raw.exec('BEGIN');try{const r=statements.map(s=>{const q=raw.prepare(s.sql);return /^SELECT/i.test(s.sql)?{results:q.all(...s.args)}:{meta:{changes:Number(q.run(...s.args).changes)},results:[]}});raw.exec('COMMIT');return r}catch(e){raw.exec('ROLLBACK');throw e}}};
const objectRoot=resolve(target,'objects');function objectPath(key){const p=resolve(objectRoot,key);if(!p.startsWith(objectRoot+sep))throw new Error('Invalid object path.');return p}
const bucket={async get(key){const p=objectPath(key);if(!existsSync(p))return null;const b=readFileSync(p);return {arrayBuffer:async()=>new Uint8Array(b).buffer}},async put(key,bytes){const p=objectPath(key);mkdirSync(dirname(p),{recursive:true});writeFileSync(p,bytes,{flag:'wx',mode:0o600})}};
try{const summary=await restoreCheckpoint(db,bucket,data);writeFileSync(resolve(target,'recovery-result.json'),JSON.stringify({restoredAt:new Date().toISOString(),...summary,scope:'Isolated local database and object directory; no production cutover.'},null,2),{mode:0o600});console.log(JSON.stringify({restored:true,...summary}));}finally{raw.close()}
