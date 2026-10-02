import { chromium } from 'playwright-core';
import fs from 'node:fs';
const axe = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const path of ['/', '/service-areas/west-palm-beach/', '/tile-grout-cleaning/', '/carpet-cleaning/', '/area-rug-cleaning/', '/upholstery-cleaning/', '/pet-stain-odor-removal/', '/yacht-interior-cleaning/', '/service-areas/palm-beach/', '/service-areas/jupiter/', '/service-areas/wellington/', '/service-areas/delray-beach/', '/service-areas/boynton-beach/', '/about-us/']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:4500' + path, { waitUntil: 'networkidle' });
  const info = await p.evaluate(() => {
    const outline = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => h.tagName + ' ' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 70));
    const land = [...document.querySelectorAll('header,nav,main,footer,aside,section[aria-labelledby],section[aria-label]')].map(e => e.tagName.toLowerCase() + (e.getAttribute('aria-label') ? '[' + e.getAttribute('aria-label') + ']' : e.getAttribute('aria-labelledby') ? '[#' + e.getAttribute('aria-labelledby') + ']' : ''));
    const sections = [...document.querySelectorAll('main > section')].map(s => s.id || s.className || 'section').map((n, i, a) => n);
    const unlabeledSections = [...document.querySelectorAll('main > section')].filter(s => !s.getAttribute('aria-labelledby') && !s.getAttribute('aria-label')).map(s => s.id || s.className);
    const imgsNoAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
    return { lang: document.documentElement.lang, outline, land, unlabeledSections, imgsNoAlt };
  });
  await p.addScriptTag({ content: axe });
  const r = await p.evaluate(async () => { const res = await axe.run(document, { resultTypes: ['violations'] }); return res.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 2).map(n => n.target.join(' ')) })); });
  console.log('\n=== ' + path); console.log(JSON.stringify(info, null, 1)); console.log('axe violations:', JSON.stringify(r, null, 1));
  await p.close();
}
await b.close();
