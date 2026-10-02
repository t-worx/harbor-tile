import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [w,h,t] of [[1440,900,'d'],[390,844,'m']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' });
  const y = await p.evaluate(() => document.querySelector('.owners').getBoundingClientRect().top + scrollY - innerHeight * 0.4);
  for (let s = 0; s <= y; s += 500) { await p.evaluate(s => scrollTo(0, s), s); await p.waitForTimeout(40); }
  await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(1500);
  if (t === 'd') await p.hover('.owners'); await p.waitForTimeout(400);
  await p.screenshot({ path: `lab/owners-${t}.jpg`, type: 'jpeg', quality: 70 });
}
await b.close();
