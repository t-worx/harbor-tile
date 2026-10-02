import { webkit, devices } from 'playwright-core';
const b = await webkit.launch();
const cases = [
  ['1280x720', { viewport: { width: 1280, height: 720 } }],
  ['1512x860', { viewport: { width: 1512, height: 860 } }],
  ['reduce-motion', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }],
  ['iPhone', { ...devices['iPhone 15 Pro'] }],
];
for (const [name, opts] of cases) {
  const c = await b.newContext(opts); const p = await c.newPage();
  await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => { const s = document.getElementById('work'); return { top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight, ih: innerHeight }; });
  const xs = [];
  for (const f of [0, .5, 1]) { await p.evaluate(([t,h,f]) => scrollTo(0, t + (h - innerHeight) * f), [d.top, d.h, f]); await p.waitForTimeout(500);
    xs.push(await p.evaluate(() => Math.round(document.querySelector('.wall__track').getBoundingClientRect().left))); }
  const sticky = await p.evaluate(() => { const st = document.querySelector('#work [data-sc-stage]'); return [getComputedStyle(st).position, Math.round(st.getBoundingClientRect().top)]; });
  console.log(name, JSON.stringify({ d, trackLeftAt0_50_100: xs, stage: sticky }));
  await c.close();
}
await b.close();
