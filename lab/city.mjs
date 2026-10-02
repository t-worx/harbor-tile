import { chromium, webkit } from 'playwright-core';
const URL = process.env.PAGE_URL || 'http://localhost:4500/service-areas/west-palm-beach/';
const out = {};
for (const [eng, launch] of [['chrome', () => chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })], ['webkit', () => webkit.launch()]]) {
  const b = await launch();
  for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = [], fails = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('requestfailed', r => fails.push(r.url())); p.on('response', r => r.status() >= 400 && fails.push(r.status() + ' ' + r.url()));
    await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
    if (eng === 'chrome') await p.screenshot({ path: `lab/${process.env.TAG || 'city'}-${tag}-top.png` });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    // slider
    await p.evaluate(() => document.querySelector('[data-compare]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(2200);
    if (eng === 'chrome') await p.screenshot({ path: `lab/${process.env.TAG || 'city'}-${tag}-compare.png` });
    await p.focus('[data-compare] input'); await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft');
    const pos = await p.evaluate(() => getComputedStyle(document.querySelector('[data-compare]')).getPropertyValue('--pos'));
    // form
    await p.evaluate(() => document.getElementById('quote').scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    await p.fill('input[name=name]', 'Test Person'); await p.fill('input[name=phone]', '5615550100');
    await p.click('[data-quote-form] button[type=submit]');
    const summary = await p.textContent('[data-summary]');
    if (eng === 'chrome') { await p.screenshot({ path: `lab/${process.env.TAG || 'city'}-${tag}-full.png`, fullPage: true }); }
    out[eng + '-' + tag] = { overflow, sliderPosAfterKeys: pos.trim(), townInSummary: summary.includes(process.env.TOWN || 'West Palm Beach'), errs, fails };
    await p.close();
  }
  await b.close();
}
console.log(JSON.stringify(out, null, 1));
