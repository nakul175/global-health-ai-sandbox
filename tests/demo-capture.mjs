// Recreates the screens in docs/demo/cough-2026-10-03/ (see docs/COUGH_DEMO_WALKTHROUGH.md).
//
// Isolation matches tests/http.mjs: disposable local D1/R2 under .test-state/, throwaway signing
// keys, and synthetic identity headers sent only to the built Worker on 127.0.0.1. It never
// contacts the hosted Site and is not part of `pnpm verify`.
//
// Needs `pnpm build` first, plus playwright-core and a Chromium binary supplied outside the
// repository (no dependency is added to package.json):
//   PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core CHROMIUM=/path/to/chrome \
//     node tests/demo-capture.mjs [--out docs/demo/cough-2026-10-03]
import {spawn, spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, mkdtempSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const port = 8766;
const origin = `http://127.0.0.1:${port}`;
const outIndex = process.argv.indexOf('--out');
const out = resolve(outIndex > -1 ? process.argv[outIndex + 1] : '.test-state/demo-screens');

if (!process.env.PLAYWRIGHT_CORE || !process.env.CHROMIUM) {
  console.error('Set PLAYWRIGHT_CORE (playwright-core package directory) and CHROMIUM (browser executable).');
  process.exit(2);
}
if (!existsSync('dist/server/wrangler.json')) {
  console.error('Run `pnpm build` first.');
  process.exit(2);
}
const {chromium} = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_CORE, 'index.mjs')).href);

mkdirSync('.test-state', {recursive: true});
mkdirSync(out, {recursive: true});
const persistTo = resolve(mkdtempSync('.test-state/demo-'));
for (const file of readdirSync('drizzle').filter(f => f.endsWith('.sql')).sort()) {
  const migration = spawnSync(process.execPath, ['--import', './scripts/sites-env.mjs', './node_modules/wrangler/bin/wrangler.js',
    'd1', 'execute', 'DB', '--local', '--config', 'dist/server/wrangler.json', '--persist-to', persistTo,
    '--file', resolve('drizzle', file)], {encoding: 'utf8'});
  if (migration.status !== 0) throw new Error('Local D1 migration failed: ' + migration.stderr + migration.stdout);
}
const pair = await crypto.subtle.generateKey({name: 'ECDSA', namedCurve: 'P-256'}, true, ['sign', 'verify']);
const signing = JSON.stringify(await crypto.subtle.exportKey('jwk', pair.privateKey));
const checkpointKey = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
const worker = spawn(process.execPath, ['--import', './scripts/sites-env.mjs', './node_modules/wrangler/bin/wrangler.js',
  'dev', '--config', 'dist/server/wrangler.json', '--local', '--persist-to', persistTo,
  '--ip', '127.0.0.1', '--port', String(port), '--inspector-port', '0',
  '--var', 'EVIDENCE_SIGNING_JWK:' + signing, '--var', 'CHECKPOINT_KEY_HEX:' + checkpointKey],
{stdio: ['ignore', 'pipe', 'pipe']});
let log = '';
worker.stdout.on('data', x => { log += x; });
worker.stderr.on('data', x => { log += x; });

let browser;
try {
  let ready = false;
  for (let n = 0; n < 120 && !ready; n++) {
    try { ready = (await fetch(origin + '/api/health')).status === 200; } catch { /* still starting */ }
    if (worker.exitCode !== null) throw new Error('Worker exited: ' + log);
    if (!ready) await new Promise(r => setTimeout(r, 250));
  }
  if (!ready) throw new Error('Worker did not start: ' + log);

  browser = await chromium.launch({executablePath: process.env.CHROMIUM});
  const context = await browser.newContext({
    viewport: {width: 560, height: 900}, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    extraHTTPHeaders: {'oai-authenticated-user-id': 'demo-capture-' + crypto.randomUUID(), 'oai-authenticated-user-email': 'synthetic@example.test'},
  });
  const page = await context.newPage();
  const settle = async (ms = 600) => { await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(ms); };
  const tab = async name => { await page.locator('main [role=tab]', {hasText: name}).click(); await settle(900); };
  const choose = async (field, option) => {
    await page.getByRole('combobox', {name: field}).click(); await settle(300);
    await page.locator('[role=option]', {hasText: option}).click(); await settle(800);
  };

  // One picture per step: the card around a heading, scrolled to its left edge, toasts hidden.
  const shot = async (name, heading, maxHeight) => {
    await page.addStyleTag({content: '[data-sonner-toaster],section[aria-label^="Notifications"]{display:none!important}'});
    const title = page.locator('main h1, main h2, main h3, main h4').filter({hasText: heading}).first();
    await title.waitFor();
    const card = (await title.evaluateHandle(h => h.closest('[data-slot="card"]') || h.closest('section') || h.parentElement)).asElement();
    await card.scrollIntoViewIfNeeded();
    await card.evaluate(root => root.querySelectorAll('*').forEach(n => { if (n.scrollLeft) n.scrollLeft = 0; }));
    await page.waitForTimeout(300);
    const box = await card.boundingBox();
    const scrollY = await page.evaluate(() => window.scrollY);
    const height = maxHeight ? Math.min(maxHeight, box.height) : box.height;
    await page.screenshot({path: resolve(out, name + '.png'), fullPage: true,
      clip: {x: Math.max(0, box.x - 8), y: box.y + scrollY - 8, width: Math.min(560, box.width + 16), height: height + 16}});
    console.log('captured', name);
  };
  const runScenario = async () => {
    await page.getByRole('button', {name: 'Start scenario'}).click(); await settle(2000);
    await page.getByLabel('Advance by hours').fill('48');
    await page.getByRole('button', {name: 'Advance clock'}).click(); await settle(3000);
  };

  await page.goto(origin + '/', {waitUntil: 'networkidle'});
  if (!(await page.getByRole('button', {name: 'Release 2 lab'}).first().isVisible())) {
    await page.getByRole('button', {name: 'Toggle Sidebar'}).first().click(); await settle(400);
  }
  await page.getByRole('button', {name: 'Release 2 lab'}).first().click(); await settle(800);

  await page.getByRole('button', {name: 'Generate ecosystem'}).click(); await settle(2500);
  await shot('1-district', 'Connected services');
  await shot('2-registry', 'Registry explorer', 760);

  await tab('Simulation');
  await runScenario();
  await shot('3-model-a-48h', 'Scenario control');
  await choose('Model', 'Audio reference B');
  await runScenario();

  await tab('Compare');
  await choose('Primary run', 'Audio reference A');
  await choose('Comparison run', 'Audio reference B');
  await shot('4-model-a-results', 'Computed model results');
  await shot('5-a-versus-b', 'Compare a second version');

  await tab('Evidence');
  await choose('Completed run', 'Audio reference A');
  await page.getByLabel('Interpretation and limitations').fill('Synthetic technical test. Audio reference A referred 12 of 80 fictional people and found 6 of 16 generated positives. No clinical accuracy claim.');
  await page.getByRole('button', {name: 'Draft evidence'}).click(); await settle(2000);
  await page.getByRole('button', {name: 'Switch to independent reviewer'}).click(); await settle(2000);
  await page.getByLabel('Review rationale').fill('Checked the frozen run, metrics and limitations. Issued as synthetic technical evidence only.');
  await page.getByRole('button', {name: 'Review & issue'}).click(); await settle(2500);
  await shot('6-evidence-issued', 'Evidence history');
  console.log('Screens written to', out);
} finally {
  await browser?.close();
  worker.kill('SIGTERM');
}
