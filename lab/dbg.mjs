import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
await p.click('.bar [data-go-quote]');
for (const t of [100, 400, 1000, 2000]) {
  await p.waitForTimeout(t);
  console.log(t, await p.evaluate(() => ({ y: scrollY, max: document.documentElement.scrollHeight - innerHeight, p: document.getElementById('dock').style.getPropertyValue('--sc-p'), open: document.getElementById('quote').className, act: document.activeElement.tagName + ':' + (document.activeElement.name||'') })));
}
await b.close();
