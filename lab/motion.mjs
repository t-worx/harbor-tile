import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
const wheel = async (dy, n=1) => { for (let i=0;i<n;i++){ await p.mouse.wheel(0, dy); await p.waitForTimeout(60);} await p.waitForTimeout(500); };
await p.mouse.move(700, 450);
await wheel(300, 4); const down = await p.evaluate(() => document.querySelector('.bar').classList.contains('is-tucked'));
await wheel(-120, 1); const up = await p.evaluate(() => document.querySelector('.bar').classList.contains('is-tucked'));
// wall: transform of rail+track at start of the act
const work = await p.evaluate(() => { const w = document.getElementById('work'); return w.getBoundingClientRect().top + scrollY; });
const travel = await p.evaluate(() => { const w = document.getElementById('work'); return w.offsetHeight - innerHeight; });
const net = async (frac) => { await p.evaluate(y => scrollTo(0, y), Math.round(work + travel*frac)); await p.waitForTimeout(400);
  return p.evaluate(() => Math.round(document.querySelector('.wall__track').getBoundingClientRect().left)); };
const w = []; for (const f of [0, 0.08, 0.15, 0.3, 0.6, 1]) w.push([f, await net(f)]);
// counters: stop where they just come into view
const team = await p.evaluate(() => document.getElementById('team').getBoundingClientRect().top + scrollY);
await p.evaluate(y => scrollTo(0, y), team); await p.waitForTimeout(800);
const nums = await p.evaluate(() => [...document.querySelectorAll('.facts .n')].map(n => n.textContent.trim()));
const vis = await p.evaluate(() => { const r = document.querySelector('.facts').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom), innerHeight]; });
console.log(JSON.stringify({ tuckedAfterScrollDown: down, tuckedAfterScrollUp: up, wallLeftByProgress: w, countersAtTeamTop: nums, factsBox: vis }));
await b.close();
