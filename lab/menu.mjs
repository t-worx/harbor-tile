import { chromium, webkit } from 'playwright-core';
const res = {};
for (const [eng, launch] of [['chrome', () => chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })], ['webkit', () => webkit.launch()]]) {
  const b = await launch();
  // ---------- desktop
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' });
  const exp = sel => p.getAttribute(sel, 'aria-expanded');
  await p.click('[aria-controls="menu-services"]'); const clickOpen = await exp('[aria-controls="menu-services"]');
  if (eng === 'chrome') await p.screenshot({ path: 'lab/menu-desktop.png', clip: { x: 0, y: 0, width: 1440, height: 520 } });
  const subLinks = await p.$$eval('#menu-services a', as => as.map(a => a.getAttribute('href')));
  await p.click('[aria-controls="menu-areas"]'); const onlyOne = [await exp('[aria-controls="menu-services"]'), await exp('[aria-controls="menu-areas"]')];
  await p.keyboard.press('Escape'); const escClosed = await exp('[aria-controls="menu-areas"]');
  const focusBack = await p.evaluate(() => document.activeElement.getAttribute('aria-controls'));
  await p.mouse.click(700, 700); 
  await p.hover('[aria-controls="menu-services"]'); await p.waitForTimeout(250); const hoverOpen = await exp('[aria-controls="menu-services"]');
  await p.mouse.move(700, 800); await p.waitForTimeout(400); const hoverClosed = await exp('[aria-controls="menu-services"]');
  // keyboard: Tab into the bar and open with Enter
  await p.focus('[aria-controls="menu-services"]'); await p.keyboard.press('Enter'); await p.keyboard.press('Tab');
  const kbFocus = await p.evaluate(() => document.activeElement.textContent.trim());
  await p.keyboard.press('Escape');
  // section highlight + link scroll
  await p.click('.menu a[data-room="work"]'); await p.waitForTimeout(1500);
  const cur = await p.$$eval('.menu a[data-room]', as => as.filter(a => a.getAttribute('aria-current') === 'true').map(a => a.textContent));
  // bar stays while open after scrolling
  await p.mouse.move(700, 500); await p.mouse.wheel(0, -100); await p.waitForTimeout(500);
  await p.click('[aria-controls="menu-services"]'); await p.mouse.move(1300, 120);
  await p.evaluate(() => scrollBy(0, 600)); await p.waitForTimeout(400);
  const tuckedWhileOpen = await p.evaluate(() => document.querySelector('.bar').classList.contains('is-tucked'));
  await p.close();
  // ---------- phone
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: eng === 'chrome' });
  await m.goto('http://localhost:4500/service-areas/west-palm-beach/', { waitUntil: 'networkidle' });
  const visBefore = await m.evaluate(() => getComputedStyle(document.querySelector('.bar .menu')).visibility);
  await m.click('.menu-toggle'); await m.waitForTimeout(350);
  const visOpen = await m.evaluate(() => getComputedStyle(document.querySelector('.bar .menu')).visibility);
  await m.click('[aria-controls="menu-services"]'); await m.waitForTimeout(200);
  const accordion = await m.evaluate(() => getComputedStyle(document.getElementById('menu-services')).display);
  if (eng === 'chrome') await m.screenshot({ path: 'lab/menu-mobile.png' });
  const label = await m.textContent('.menu-toggle .sr-only');
  await m.click('#menu-services a >> nth=0').catch(() => {});
  await m.waitForTimeout(300);
  const urlAfter = m.url();
  await m.close();
  res[eng] = { clickOpen, subLinks: subLinks.length, firstSub: subLinks[0], onlyOneOpen: onlyOne, escClosed, focusBack, hoverOpen, hoverClosed, kbFocus, highlightAtTeam: cur, tuckedWhileOpen, mobile: { visBefore, visOpen, accordion, label, urlAfter }, errs };
  await b.close();
}
console.log(JSON.stringify(res, null, 1));
