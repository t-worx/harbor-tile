import { chromium } from 'playwright-core';
const exe = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://localhost:4500', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
// add tile & grout from the foyer, carpet from the great room
await p.evaluate(() => document.querySelector('[data-add="Tile & grout"]').click());
await p.evaluate(() => document.querySelector('[data-add="Rug(s)"]').click());
const count = await p.textContent('[data-count]');
// the bar CTA jumps to the form
await p.click(".bar [data-go-quote]"); await p.waitForTimeout(1800);
const open = await p.evaluate(() => document.getElementById('quote').classList.contains('is-open'));
const checked = await p.evaluate(() => [...document.querySelectorAll('input[name=service]:checked')].map(x => x.value));
const focused = await p.evaluate(() => document.activeElement && document.activeElement.name);
// empty submit shows the error, no navigation
await p.click('[data-quote-form] button[type=submit]');
const errShown = await p.evaluate(() => !document.querySelector('[data-error]').hidden);
await p.fill('input[name=name]', 'Test Person'); await p.fill('input[name=phone]', '561 555 0100');
await p.selectOption('select[name=town]', 'Jupiter');
await p.click('[data-quote-form] button[type=submit]');
const summary = await p.textContent('[data-summary]');
const sms = await p.getAttribute('[data-sms]', 'href');
console.log(JSON.stringify({ count, open, checked, focused, errShown, summary, smsStartsRight: sms.startsWith('sms:+15613011977?&body='), url: p.url(), errs }, null, 1));
await b.close();
