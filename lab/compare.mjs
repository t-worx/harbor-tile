import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500/tile-grout-cleaning/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.querySelector('[data-compare]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(2400);
await p.locator('[data-compare]').screenshot({ path: 'lab/compare-tile.png' });
await b.close();
