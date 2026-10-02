import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
const travel = await p.evaluate(() => document.getElementById('foyer').offsetHeight - innerHeight);
const out = [];
for (const f of [0.6, 0.85, 0.9, 0.95, 1, 1.3]) {
  await p.evaluate(y => scrollTo(0, y), Math.round(travel * f)); await p.waitForTimeout(350);
  out.push(await p.evaluate(f => ({ p: f, scrim: (+getComputedStyle(document.querySelector('.pass-scrim')).opacity).toFixed(2), copy: (+getComputedStyle(document.querySelector('.pass-copy')).opacity).toFixed(2) }), f));
}
console.log(JSON.stringify(out)); await b.close();
