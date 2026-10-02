import { chromium, webkit } from 'playwright-core';
for (const [eng, launch] of [['chrome', () => chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })], ['webkit', () => webkit.launch()]]) {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:4500/tile-grout-cleaning/', { waitUntil: 'networkidle' });
  const fig = p.locator('.proof figure').nth(1);
  await fig.scrollIntoViewIfNeeded(); await p.mouse.move(5, 5); await p.waitForTimeout(300);
  const before = await fig.evaluate(f => { const m = f.querySelector('.mat').getBoundingClientRect(); return [getComputedStyle(f.querySelector('img')).transform, Math.round(m.width), Math.round(m.height)]; });
  await fig.hover(); await p.waitForTimeout(900);
  const after = await fig.evaluate(f => { const m = f.querySelector('.mat').getBoundingClientRect(), z = f.querySelector('.zoom').getBoundingClientRect(), i = f.querySelector('img').getBoundingClientRect();
    return [getComputedStyle(f.querySelector('img')).transform, Math.round(m.width), Math.round(m.height), 'img wider than its frame:', Math.round(i.width - z.width)]; });
  if (eng === 'chrome') await fig.screenshot({ path: 'lab/zoom-hover.png' });
  const rm = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const r = await rm.newPage();
  await r.goto('http://localhost:4500/tile-grout-cleaning/', { waitUntil: 'networkidle' });
  const rf = r.locator('.proof figure').nth(1); await rf.scrollIntoViewIfNeeded(); await rf.hover(); await r.waitForTimeout(800);
  const reduced = await rf.evaluate(f => getComputedStyle(f.querySelector('img')).transform);
  console.log(eng, JSON.stringify({ before, after, reducedMotion: reduced }));
  await b.close();
}
