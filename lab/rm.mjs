import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p = await c.newPage(); await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
const top = await p.evaluate(() => document.getElementById('work').getBoundingClientRect().top + scrollY);
await p.evaluate(v => scrollTo(0, v), top + 200); await p.waitForTimeout(300);
console.log(JSON.stringify(await p.evaluate(() => { const w = document.querySelector('.wall'); return { overflowX: getComputedStyle(w).overflowX, scrollable: w.scrollWidth - w.clientWidth }; })));
await b.close();
