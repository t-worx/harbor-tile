import { chromium, webkit } from 'playwright-core';
for (const [eng, launch] of [['chrome', () => chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })], ['webkit', () => webkit.launch()]]) {
  const b = await launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:4500/upholstery-cleaning/', { waitUntil: 'networkidle' });
  const d = p.locator('.faq details').first(); await d.scrollIntoViewIfNeeded();
  // sample the height every frame while it opens, then while it closes
  const run = () => d.evaluate(e => new Promise(res => { const hs = []; const t0 = performance.now(); e.querySelector('summary').click();
    (function f() { hs.push(Math.round(e.getBoundingClientRect().height)); if (performance.now() - t0 < 600) requestAnimationFrame(f); else res(hs); })(); }));
  const open = await run(); const close = await run();
  const mono = (a, up) => a.every((v, i) => i === 0 || (up ? v >= a[i-1] : v <= a[i-1]));
  console.log(eng, 'CLOSE FRAMES', close.join(','));
  console.log(eng, 'open', open[0], '->', Math.max(...open), 'end', open.at(-1), 'smooth:', mono(open, true), '| close', close[0], '->', close.at(-1), 'smooth:', mono(close, false));
  await b.close();
}
