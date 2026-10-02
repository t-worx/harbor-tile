import { chromium, webkit } from 'playwright-core';
const out = [];
for (const [eng, launch] of [['chrome', () => chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })], ['webkit', () => webkit.launch()]]) {
  const b = await launch();
  for (const [url, w, h] of [['/', 1440, 900], ['/', 1280, 800], ['/', 390, 844], ['/service-areas/west-palm-beach/', 1440, 900], ['/service-areas/west-palm-beach/', 390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('http://localhost:4500' + url, { waitUntil: 'networkidle' });
    await p.evaluate(() => localStorage.clear());
    const measure = () => p.evaluate(() => ({ panel: Math.round(document.querySelector('.quote__panel').scrollHeight), chips: Math.round(document.querySelector('.chips').getBoundingClientRect().height) }));
    const before = await measure();
    // tick every option, one at a time, and record the tallest the chips get
    let worst = before.chips;
    const n = await p.evaluate(() => document.querySelectorAll('.chip input').length);
    for (let i = 0; i < n; i++) { await p.evaluate(i => { const c = document.querySelectorAll('.chip input')[i]; c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }, i); worst = Math.max(worst, (await measure()).chips); }
    // and the yacht button on the home page
    if (url === '/') await p.evaluate(() => document.querySelector('[data-add="Yacht interior"]').click());
    const after = await measure();
    out.push(`${eng} ${url} ${w}px  chips ${before.chips}->${after.chips} (max ${worst})  panel ${before.panel}->${after.panel}`);
    await p.close();
  }
  await b.close();
}
console.log(out.join('\n'));
