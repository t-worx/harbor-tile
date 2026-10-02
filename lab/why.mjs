import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [w,h,t] of [[1440,900,'d'],[390,844,'m']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:4500/tile-grout-cleaning/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('.why').scrollIntoView({ block: 'center' })); await p.waitForTimeout(800);
  const box = await p.evaluate(() => { const r = document.querySelector('.band--sand').getBoundingClientRect(); return { y: Math.max(0, r.top), h: Math.min(innerHeight, r.bottom) - Math.max(0, r.top) }; });
  await p.screenshot({ path: `lab/why-${t}.png` });
  await p.close();
}
await b.close();
