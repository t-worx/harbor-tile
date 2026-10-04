import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const path of ['/', '/about-us/', '/tile-grout-cleaning/', '/service-areas/palm-beach/']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [], fails = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => r.status() >= 400 && fails.push(r.status() + ' ' + r.url()));
  await p.goto('https://harbor-tile.vercel.app' + path, { waitUntil: 'networkidle' });
  for (let y = 0; y < await p.evaluate(() => document.body.scrollHeight); y += 600) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(50); }
  await p.waitForTimeout(500);
  console.log(path, JSON.stringify({ errs, fails }));
  if (path === '/') { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800); await p.screenshot({ path: 'lab/live-home.jpg', type: 'jpeg', quality: 60 }); }
  await p.close();
}
await b.close();
