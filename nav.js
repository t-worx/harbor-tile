/* Harbor main menu. Disclosure dropdowns (click, keyboard, and hover on a
   real pointer), and a full-width panel behind the menu button below 1080px.
   While anything is open the bar is marked .menu-open so it never tucks away. */
(function () {
  'use strict';
  var bar = document.querySelector('.bar');
  if (!bar) return;
  var toggle = bar.querySelector('.menu-toggle');
  var triggers = Array.prototype.slice.call(bar.querySelectorAll('.menu__trigger'));
  var narrow = matchMedia('(max-width: 1080px)');
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  function sync() {
    var anyOpen = (toggle && toggle.getAttribute('aria-expanded') === 'true') ||
      triggers.some(function (t) { return t.getAttribute('aria-expanded') === 'true'; });
    bar.classList.toggle('menu-open', !!(toggle && toggle.getAttribute('aria-expanded') === 'true'));
    bar.classList.toggle('sub-open', anyOpen);
    if (anyOpen) bar.classList.remove('is-tucked');
  }
  function setSub(t, open) { t.setAttribute('aria-expanded', String(open)); sync(); }
  function closeSubs(except) { triggers.forEach(function (t) { if (t !== except) t.setAttribute('aria-expanded', 'false'); }); sync(); }
  function setPanel(open) {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Menu';
    if (!open) closeSubs();
    sync();
  }

  // dropdown triggers: click toggles; only one open at a time on desktop
  triggers.forEach(function (t) {
    var group = t.parentNode, timer = null, hoveredAt = 0;
    t.addEventListener('click', function () {
      // A pointer that just opened this by hovering is clicking to keep it
      // open, not to close it again.
      var justHovered = Date.now() - hoveredAt < 600;
      var open = justHovered ? true : t.getAttribute('aria-expanded') !== 'true';
      hoveredAt = 0;
      if (!narrow.matches) closeSubs(t);
      setSub(t, open);
    });
    // hover opens on a real pointer, with a short grace period on leaving
    group.addEventListener('mouseenter', function () {
      if (narrow.matches || !finePointer.matches) return;
      clearTimeout(timer); closeSubs(t);
      if (t.getAttribute('aria-expanded') !== 'true') hoveredAt = Date.now();
      setSub(t, true);
    });
    group.addEventListener('mouseleave', function () {
      if (narrow.matches || !finePointer.matches) return;
      timer = setTimeout(function () { setSub(t, false); }, 160);
    });
    // keyboard: leaving the group closes it
    group.addEventListener('focusout', function (e) {
      if (narrow.matches) return;
      if (!group.contains(e.relatedTarget)) setSub(t, false);
    });
  });

  if (toggle) toggle.addEventListener('click', function () {
    setPanel(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // choosing any link closes everything (in-page section links included)
  bar.querySelectorAll('.menu a').forEach(function (a) {
    a.addEventListener('click', function () { closeSubs(); setPanel(false); });
  });

  // Escape closes the innermost open thing and returns focus to its button
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openSub = triggers.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; })[0];
    if (openSub && !narrow.matches) { setSub(openSub, false); openSub.focus(); return; }
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') { setPanel(false); toggle.focus(); }
  });

  // a click anywhere outside the bar closes it
  document.addEventListener('click', function (e) {
    if (!bar.contains(e.target)) { closeSubs(); setPanel(false); }
  });

  // crossing the breakpoint resets state
  narrow.addEventListener('change', function () { closeSubs(); setPanel(false); });
})();
