import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
  await p.click('.bar [data-go-quote]'); await p.waitForTimeout(2200);
  await p.screenshot({ path: `lab/dock-${tag}.png` });
  const r = await p.evaluate(() => { const c = document.querySelector('.bar .btn').getBoundingClientRect(); const q = document.querySelector('.quote').getBoundingClientRect(); return { ctaRight: Math.round(c.right), formRight: Math.round(q.right), open: document.querySelector('.quote').classList.contains('is-open') }; });
  console.log(tag, JSON.stringify(r));
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1200);
  await p.screenshot({ path: `lab/foot-${tag}.png` });
  await p.close();
}
await b.close();
