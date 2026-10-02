import { webkit } from 'playwright-core';
const b = await webkit.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
const d = await p.evaluate(() => { const w = document.querySelector('.wall'), t = document.querySelector('.wall__track'), s = document.getElementById('work');
  return { wallScrollW: w.scrollWidth, wallClientW: w.clientWidth, trackW: t.offsetWidth, inner: innerWidth, actH: s.offsetHeight, top: s.getBoundingClientRect().top + scrollY }; });
const xs = [];
for (const f of [0, .3, .6, 1]) { await p.evaluate(([t,h,f]) => scrollTo(0, t + (h - innerHeight) * f), [d.top, d.actH, f]); await p.waitForTimeout(400);
  xs.push(await p.evaluate(() => [Math.round(document.querySelector('.wall__track').getBoundingClientRect().left), document.querySelector('.wall__track').style.transform])); }
console.log(JSON.stringify({ d, xs, errs }));
await b.close();
