import {spawnSync} from 'node:child_process';
// Portable ordered acceptance pipeline. No hosted credentials or live patient data.
for(const args of [
 ['node_modules/typescript/bin/tsc','--noEmit'],
 ['tests/run.mjs'],
 ['scripts/run-framework.mjs','build'],
 ['tests/http.mjs'],
 ['tests/cough-http.mjs'],
]){const r=spawnSync(process.execPath,args,{stdio:'inherit'});if(r.status!==0){process.exitCode=r.status||1;break}}
