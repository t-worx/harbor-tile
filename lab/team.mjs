import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
  const t = await p.evaluate(() => document.getElementById('team').getBoundingClientRect().top + scrollY);
  await p.evaluate(y => scrollTo(0, y), t); await p.waitForTimeout(2500);
  await p.screenshot({ path: `lab/team-${tag}.png`, fullPage: false });
  const hgt = await p.evaluate(() => document.getElementById('team').offsetHeight);
  await p.evaluate(y => scrollTo(0, y), t + Math.max(0, hgt - h)); await p.waitForTimeout(1500);
  await p.screenshot({ path: `lab/team-${tag}2.png` });
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1200);
  await p.screenshot({ path: `lab/foot-${tag}.png` });
  await p.close();
}
await b.close();
