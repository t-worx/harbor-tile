import { chromium, webkit } from 'playwright-core';
const URL = 'http://localhost:4500/about-us/';
for (const [eng, launch] of [['chrome', () => chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })], ['webkit', () => webkit.launch()]]) {
  const b = await launch();
  for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = [], fails = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('response', r => r.status() >= 400 && fails.push(r.status() + ' ' + r.url())); p.on('requestfailed', r => fails.push(r.url()));
    await p.goto(URL, { waitUntil: 'networkidle' });
    // reveal everything that animates in
    for (let y = 0; y < await p.evaluate(() => document.body.scrollHeight); y += 400) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(60); }
    await p.waitForTimeout(800);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const cur = await p.evaluate(() => document.querySelector('.menu a[aria-current="page"]')?.textContent);
    if (eng === 'chrome') await p.screenshot({ path: `lab/about-${tag}.jpg`, fullPage: true, type: 'jpeg', quality: 60 });
    console.log(eng, tag, JSON.stringify({ overflow, cur, errs, fails }));
    await p.close();
  }
  await b.close();
}
