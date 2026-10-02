/* Harbor city and service pages: the before/after slider, the quote form,
   and the bar that tucks away on scroll down. */
(function () {
  'use strict';
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)');

  // ------------------------------------------------------------- bar ----
  var bar = document.querySelector('.bar'), lastY = window.scrollY, accum = 0;
  if (bar) {
    addEventListener('scroll', function () {
      var y = window.scrollY, dy = y - lastY; lastY = y;
      if (y < 80) { bar.classList.remove('is-tucked'); accum = 0; return; }
      if (bar.contains(document.activeElement) || bar.classList.contains('sub-open')) return;
      accum = (dy > 0) === (accum > 0) ? accum + dy : dy;
      if (accum > 12) bar.classList.add('is-tucked');
      else if (accum < -6) bar.classList.remove('is-tucked');
    }, { passive: true });
    bar.addEventListener('focusin', function () { bar.classList.remove('is-tucked'); });
  }

  // ------------------------------------------------- before / after ----
  // A range input drives the split, so it works with a pointer, touch and
  // the keyboard. On first view it sweeps from "before" to the middle once.
  document.querySelectorAll('[data-compare]').forEach(function (box) {
    var range = box.querySelector('input[type=range]');
    var set = function (v) { box.style.setProperty('--pos', v + '%'); };
    range.addEventListener('input', function () { set(range.value); });
    set(range.value);
    if (REDUCED.matches || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      var from = 96, to = +range.value, t0 = null, touched = false;
      range.addEventListener('pointerdown', function () { touched = true; }, { once: true });
      (function step(now) {
        if (touched) return;
        if (t0 === null) t0 = now;
        var k = Math.min((now - t0) / 1600, 1), e = 1 - Math.pow(1 - k, 3);
        var v = from + (to - from) * e;
        range.value = v.toFixed(1); set(v);
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());
    }, { threshold: 0.55 });
    io.observe(box);
  });

  // ------------------------------------------------------------ FAQs ----
  // Native <details>, animated: the height eases open and closed instead of
  // snapping. Without JavaScript (or with reduced motion) they still work.
  document.querySelectorAll('.faq details').forEach(function (d) {
    var summary = d.querySelector('summary');
    var anim = null;
    var ease = 'cubic-bezier(0.23, 1, 0.32, 1)';
    summary.addEventListener('click', function (e) {
      if (REDUCED.matches || !d.animate) return;
      e.preventDefault();
      // closed height = the question row plus the divider lines around it
      var cs = getComputedStyle(d);
      var closedH = summary.getBoundingClientRect().height + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      if (anim) { anim.cancel(); anim = null; }
      d.style.overflow = 'hidden';
      if (!d.open) {
        var from = d.offsetHeight;
        d.open = true;
        var to = d.offsetHeight;   // the open height, measured without any animation applied
        anim = d.animate({ height: [from + 'px', to + 'px'] }, { duration: 380, easing: ease });
      } else {
        d.classList.add('is-closing');
        anim = d.animate({ height: [d.offsetHeight + 'px', closedH + 'px'] }, { duration: 300, easing: ease });
      }
      var closing = d.classList.contains('is-closing');
      anim.onfinish = function () {
        if (closing) { d.open = false; d.classList.remove('is-closing'); }
        d.style.overflow = ''; anim = null;
      };
      anim.oncancel = function () { d.classList.remove('is-closing'); };
    });
  });

  // ---------------------------------------------------------- the form ----
  var form = document.querySelector('[data-quote-form]');
  var quote = document.getElementById('quote');
  if (form && quote) {
    var err = form.querySelector('[data-error]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var name = (fd.get('name') || '').trim(), phone = (fd.get('phone') || '').trim();
      if (!name || phone.replace(/\D/g, '').length < 7) {
        err.hidden = false;
        (name ? form.querySelector('[name="phone"]') : form.querySelector('[name="name"]')).focus();
        return;
      }
      err.hidden = true;
      var services = fd.getAll('service');
      var lines = [
        'Personalized quote request',
        'Name: ' + name,
        'Phone: ' + phone,
        'Town: ' + (fd.get('town') || 'Not given'),
        'Services: ' + (services.length ? services.join(', ') : 'Not sure yet')
      ];
      var notes = (fd.get('notes') || '').trim();
      if (notes) lines.push('Notes: ' + notes);
      lines.push('Sent from: ' + document.title);
      var text = lines.join('\n');
      quote.querySelector('[data-summary]').textContent = text;
      quote.querySelector('[data-sms]').href = 'sms:+15613011977?&body=' + encodeURIComponent(text);
      quote.querySelector('[data-mail]').href = 'mailto:service@harbortc.com?subject=' + encodeURIComponent('Personalized quote request: ' + name) + '&body=' + encodeURIComponent(text);
      quote.classList.add('is-ready');
      var h = quote.querySelector('.sent h2'); h.setAttribute('tabindex', '-1'); h.focus();
    });
    quote.querySelector('[data-edit]').addEventListener('click', function () {
      quote.classList.remove('is-ready');
      form.querySelector('[name="name"]').focus();
    });
  }
})();
