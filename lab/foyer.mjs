import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' });
const top = await p.evaluate(() => document.getElementById('foyer').offsetTop);
const span = await p.evaluate(() => document.getElementById('foyer').offsetHeight - innerHeight);
for (const f of [0, 0.3, 0.55, 0.8]) {
  await p.evaluate(y => scrollTo(0, y), top + span * f); await p.waitForTimeout(1500);
  await p.screenshot({ path: `lab/foyer-${f}.jpg`, type: 'jpeg', quality: 70 });
}
await b.close();
