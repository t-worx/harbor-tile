import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
const top = await p.evaluate(() => document.getElementById('work').getBoundingClientRect().top + scrollY);
const travel = await p.evaluate(() => document.getElementById('work').offsetHeight - innerHeight);
// step through the hold region in small increments; the track must not move at all, and positions must be monotonic after
const xs = [];
for (let y = top - 200; y <= top + travel * 0.35; y += 12) {
  await p.evaluate(v => scrollTo(0, v), Math.round(y));
  await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  xs.push(await p.evaluate(() => Math.round(document.querySelector('.wall__track').getBoundingClientRect().left * 10) / 10));
}
let backwards = 0; for (let i = 1; i < xs.length; i++) if (xs[i] > xs[i-1] + 0.5) backwards++;
const holdSlice = xs.slice(0, Math.floor(xs.length * 0.45));
console.log(JSON.stringify({ samples: xs.length, backwardSteps: backwards, holdMin: Math.min(...holdSlice), holdMax: Math.max(...holdSlice), last: xs.slice(-4) }));
await b.close();
