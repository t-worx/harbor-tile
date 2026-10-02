import { chromium, webkit } from 'playwright-core';
for (const [eng, launch] of [['chrome', () => chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })], ['webkit', () => webkit.launch()]]) {
  const b = await launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:4500/area-rug-cleaning/', { waitUntil: 'networkidle' });
  const d = p.locator('.faq details').first(); await d.scrollIntoViewIfNeeded();
  const h = () => d.evaluate(e => Math.round(e.getBoundingClientRect().height));
  const closed = await h();
  await d.locator('summary').click(); await p.waitForTimeout(120); const mid = await h(); await p.waitForTimeout(500); const opened = await h();
  const isOpen = await d.evaluate(e => e.open);
  await d.locator('summary').click(); await p.waitForTimeout(100); const midClose = await h(); const stillOpenMid = await d.evaluate(e => e.open); await p.waitForTimeout(500);
  const final = await h(); const isOpenEnd = await d.evaluate(e => e.open);
  // keyboard
  await d.locator('summary').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(500); const kb = await d.evaluate(e => e.open);
  console.log(eng, JSON.stringify({ closed, midOpening: mid, opened, isOpen, midClosing: midClose, stillOpenMid, final, isOpenEnd, keyboardOpens: kb }));
  await b.close();
}
