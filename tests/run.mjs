import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
mkdirSync('.test-build',{recursive:true});
mkdirSync('verification',{recursive:true});
for(const name of ['domain','store','lab','suite','attestation','checkpoint','connections','connection-store','cough-contract','cough-provider','cough-http']){const source=readFileSync('lib/'+name+'.ts','utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll("'./cough-contract'","'./cough-contract.mjs'").replaceAll("'./domain'","'./domain.mjs'").replaceAll("'./lab'","'./lab.mjs'").replaceAll("'./suite'","'./suite.mjs'").replaceAll("'./attestation'","'./attestation.mjs'").replaceAll("'./connections'","'./connections.mjs'").replaceAll("'./store'","'./store.mjs'");writeFileSync('.test-build/'+name+'.mjs',js)}
const r=spawnSync(process.execPath,['--test','--test-reporter=spec','--test-reporter=junit','--test-reporter-destination=stdout','--test-reporter-destination=verification/r2-unit-integration.xml','tests/core.test.mjs','tests/lab.test.mjs','tests/suite.test.mjs','tests/operations.test.mjs','tests/connections.test.mjs','tests/cough-provider.test.mjs'],{stdio:'inherit'});process.exit(r.status||0);
