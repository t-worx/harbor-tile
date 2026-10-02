/* Harbor: page-local behaviour. The engine is untouched; everything here reads
   the --sc-p it publishes on each act.

   1. The Harbor pass: a surface cleans under the scroll in the pattern Harbor's
      tools make. Tile: rotary swirl rows worked from the far end back toward the
      door. Carpet: extraction-wand lanes pulled toward the viewer, then the sofa.
      A dirty and a clean photograph (pixel-aligned) are composited through a
      mask that is rebuilt from progress every frame, so scrolling back up
      re-soils the floor exactly.
   2. The quote list: "Add to my quote" toggles, a count in the bar, and a form
      that arrives pre-selected.
   3. The room index: marks the room you are in.
*/
(function () {
  'use strict';

  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  // ------------------------------------------------------------ paths ----
  // All geometry is in image-normalised coordinates (u, v in 0..1 of the
  // source photograph), measured off the generated plates.

  // Foyer floor, far to near. Each row: v top, v bottom, and the floor's x
  // extent at that depth. The corridor through the arch comes first.
  function foyerRows() {
    var ys = [0.585, 0.625, 0.672, 0.725, 0.79, 0.865, 0.94, 1.01];
    var rows = [];
    for (var i = 0; i < ys.length - 1; i++) {
      var y0 = ys[i], y1 = ys[i + 1], ym = (y0 + y1) / 2;
      var xl, xr;
      if (ym < 0.72) { var k = (ym - 0.585) / 0.135; xl = lerp(0.415, 0.395, k); xr = lerp(0.585, 0.605, k); }
      else { var k2 = (ym - 0.72) / 0.29; xl = lerp(0.145, 0.1, k2); xr = lerp(0.715, 0.9, k2); }
      rows.push({ y0: y0, y1: y1, xl: xl, xr: xr });
    }
    return rows;
  }

  // Great room carpet: lanes converge toward the far wall.
  var CARPET = { farY: 0.555, nearY: 1.02, farL: 0.0, farR: 0.8, nearL: -0.03, nearR: 1.03, lanes: 8 };
  var SOFA = { x0: 0.115, x1: 0.695, y0: 0.29, y1: 0.585 };

  // ------------------------------------------------------------- pass ----
  function Pass(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = canvas.getAttribute('data-pass');
    this.from = parseFloat(canvas.getAttribute('data-from')) || 0;
    this.to = parseFloat(canvas.getAttribute('data-to')) || 1;
    this.act = canvas.closest('[data-sc-act]');
    this.mask = document.createElement('canvas');
    this.mctx = this.mask.getContext('2d');
    this.tmp = document.createElement('canvas');
    this.tctx = this.tmp.getContext('2d');
    this.t = -1; this.cur = 0; this.w = 0; this.h = 0; this.ready = false;
    // optional source crop (u0 v0 u1 v1) and vertical anchor for the cover fit
    var cr = (canvas.getAttribute('data-crop') || '0 0 1 1').split(/\s+/).map(parseFloat);
    this.crop = { u0: cr[0], v0: cr[1], u1: cr[2], v1: cr[3] };
    this.ay = parseFloat(canvas.getAttribute('data-anchor-y'));
    if (isNaN(this.ay)) this.ay = 0.5;
    this.ax = parseFloat(canvas.getAttribute('data-anchor-x'));
    if (isNaN(this.ax)) this.ax = 0.5;
    this.rows = this.mode === 'tile' ? foyerRows() : null;
    var self = this, n = 0;
    this.dirty = new Image(); this.clean = new Image();
    var done = function () { if (++n === 2) { self.ready = true; self.resize(); } };
    this.dirty.onload = done; this.clean.onload = done;
    this.dirty.decoding = 'async'; this.clean.decoding = 'async';
    this.dirty.src = canvas.getAttribute('data-dirty');
    this.clean.src = canvas.getAttribute('data-clean');
  }

  Pass.prototype.resize = function () {
    if (!this.ready) return;
    var r = this.c.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width * DPR)), h = Math.max(1, Math.round(r.height * DPR));
    if (w === this.w && h === this.h) return;
    this.w = this.c.width = this.tmp.width = w;
    this.h = this.c.height = this.tmp.height = h;
    // A low-resolution mask, upscaled with smoothing and a blur, is what makes
    // the boundary between dirty and clean a soft gradient rather than an edge.
    this.mask.width = Math.max(1, Math.round(w / 5));
    this.mask.height = Math.max(1, Math.round(h / 5));
    this.feather = Math.max(2, Math.round(w / 260));
    // cover-fit inside the crop, shared by both photographs and the mask geometry
    var iw = this.clean.naturalWidth, ih = this.clean.naturalHeight, c = this.crop;
    var cx = c.u0 * iw, cy = c.v0 * ih, cw = (c.u1 - c.u0) * iw, ch = (c.v1 - c.v0) * ih;
    var s = Math.max(w / cw, h / ch);
    this.sw = w / s; this.sh = h / s;
    this.sx = cx + (cw - this.sw) * this.ax; this.sy = cy + (ch - this.sh) * this.ay;
    this.iw = iw; this.ih = ih;
    this.t = -1;
  };

  // image-normalised (u, v) -> mask pixels
  Pass.prototype.mx = function (u) { return (u * this.iw - this.sx) / this.sw * this.mask.width; };
  Pass.prototype.my = function (v) { return (v * this.ih - this.sy) / this.sh * this.mask.height; };

  Pass.prototype.dot = function (u, v, r) {
    var m = this.mctx, x = this.mx(u), y = this.my(v), rr = r / this.sh * this.mask.height * this.ih;
    var g = m.createRadialGradient(x, y, rr * 0.2, x, y, rr);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.7, 'rgba(0,0,0,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = g; m.beginPath(); m.arc(x, y, rr, 0, Math.PI * 2); m.fill();
  };

  Pass.prototype.poly = function (pts, alpha) {
    var m = this.mctx;
    m.fillStyle = 'rgba(0,0,0,' + (alpha == null ? 1 : alpha) + ')';
    m.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var x = this.mx(pts[i][0]), y = this.my(pts[i][1]);
      if (i) m.lineTo(x, y); else m.moveTo(x, y);
    }
    m.closePath(); m.fill();
  };

  // Rotary rows, far to near, serpentine. Returns the working head (u, v, r).
  Pass.prototype.paintTile = function (t) {
    var rows = this.rows, n = rows.length, head = null;
    var f = t * n;
    for (var i = 0; i < n; i++) {
      var row = rows[i], local = clamp01(f - i);
      if (local <= 0) break;
      var hgt = row.y1 - row.y0, r = hgt * 0.78;
      if (local >= 1) {
        this.poly([[row.xl - 0.02, row.y0 - hgt * 0.15], [row.xr + 0.02, row.y0 - hgt * 0.15], [row.xr + 0.02, row.y1 + 0.004], [row.xl - 0.02, row.y1 + 0.004]]);
        continue;
      }
      var ltr = i % 2 === 0, span = row.xr - row.xl, step = r * 0.34;
      var count = Math.ceil(span / step), upto = local * count;
      for (var k = 0; k <= upto; k++) {
        var a = Math.min(k, upto) / count;
        var u = ltr ? row.xl + span * a : row.xr - span * a;
        // the rotary head wanders a little inside its row
        var v = (row.y0 + row.y1) / 2 + Math.sin(k * 1.7) * hgt * 0.16;
        this.dot(u, v, r * (0.85 + 0.15 * Math.sin(k * 2.3)));
        head = { u: u, v: v, r: r };
      }
    }
    return head;
  };

  function carpetX(side, v) {
    var k = (v - CARPET.farY) / (CARPET.nearY - CARPET.farY);
    return side === 'L' ? lerp(CARPET.farL, CARPET.nearL, k) : lerp(CARPET.farR, CARPET.nearR, k);
  }
  function laneEdge(u, v) { return lerp(carpetX('L', v), carpetX('R', v), u); }

  // Wand lanes pulled toward the viewer, left to right; then the sofa.
  Pass.prototype.paintCarpet = function (t) {
    var head = null, lanesT = clamp01(t / 0.74), sofaT = clamp01((t - 0.74) / 0.26);
    var L = CARPET.lanes, f = lanesT * L;
    this.stripes = [];
    for (var i = 0; i < L; i++) {
      var local = clamp01(f - i);
      if (local <= 0) break;
      var u0 = i / L, u1 = (i + 1) / L, over = 0.012;
      var vFar = CARPET.farY, vNow = lerp(CARPET.farY, CARPET.nearY, local);
      var poly = [[laneEdge(u0, vFar) - over, vFar - 0.01], [laneEdge(u1, vFar) + over, vFar - 0.01],
                  [laneEdge(u1, vNow) + over, vNow], [laneEdge(u0, vNow) - over, vNow]];
      this.poly(poly);
      this.stripes.push({ i: i, poly: poly });
      if (local < 1) head = { u: (laneEdge(u0, vNow) + laneEdge(u1, vNow)) / 2, v: vNow, r: (laneEdge(u1, vNow) - laneEdge(u0, vNow)) * 0.7, lane: true };
    }
    if (sofaT > 0) {
      var x = lerp(SOFA.x0, SOFA.x1 + 0.04, sofaT);
      this.poly([[SOFA.x0 - 0.02, SOFA.y0], [x, SOFA.y0], [x - 0.03, SOFA.y1], [SOFA.x0 - 0.02, SOFA.y1]]);
      // soft leading edge
      this.poly([[x, SOFA.y0], [x + 0.025, SOFA.y0], [x - 0.005, SOFA.y1], [x - 0.03, SOFA.y1]], 0.5);
      if (sofaT < 1) head = { u: x - 0.015, v: (SOFA.y0 + SOFA.y1) / 2, r: 0.12, sofa: true };
    }
    return head;
  };

  Pass.prototype.draw = function (t) {
    if (!this.ready || !this.w) return;
    var ctx = this.ctx, W = this.w, H = this.h;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(t >= 1 ? this.clean : this.dirty, this.sx, this.sy, this.sw, this.sh, 0, 0, W, H);
    if (t <= 0 || t >= 1) return;

    this.mctx.clearRect(0, 0, this.mask.width, this.mask.height);
    var head = this.mode === 'tile' ? this.paintTile(t) : this.paintCarpet(t);

    var tc = this.tctx;
    tc.globalCompositeOperation = 'source-over';
    tc.clearRect(0, 0, W, H);
    tc.drawImage(this.clean, this.sx, this.sy, this.sw, this.sh, 0, 0, W, H);
    tc.globalCompositeOperation = 'destination-in';
    tc.imageSmoothingEnabled = true; tc.imageSmoothingQuality = 'high';
    if ('filter' in tc) tc.filter = 'blur(' + this.feather + 'px)';
    tc.drawImage(this.mask, 0, 0, W, H);
    if ('filter' in tc) tc.filter = 'none';
    ctx.drawImage(this.tmp, 0, 0);

    // fresh-clean stripes on alternate lanes
    if (this.stripes) {
      ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,255,255,0.16)';
      for (var s = 0; s < this.stripes.length; s++) {
        if (this.stripes[s].i % 2) continue;
        var p = this.stripes[s].poly; ctx.beginPath();
        for (var j = 0; j < p.length; j++) {
          var x = (p[j][0] * this.iw - this.sx) / this.sw * W, y = (p[j][1] * this.ih - this.sy) / this.sh * H;
          if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    // the sheen riding the working edge
    if (head) {
      var hx = (head.u * this.iw - this.sx) / this.sw * W, hy = (head.v * this.ih - this.sy) / this.sh * H;
      var hr = head.r * this.ih / this.sh * H * 1.6;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var g = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      g.addColorStop(0, 'rgba(255,248,235,0.32)'); g.addColorStop(1, 'rgba(255,248,235,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  };

  // The drawn progress eases toward the scroll target every frame, the same
  // way the engine lerps a scrub playhead, so wheel notches never show as steps.
  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)');
  Pass.prototype.tick = function () {
    if (!this.ready) return;
    var p = parseFloat(this.act.style.getPropertyValue('--sc-p')) || 0;
    var target = clamp01((p - this.from) / (this.to - this.from));
    var d = target - this.cur;
    this.cur = (REDUCE.matches || Math.abs(d) < 0.0008) ? target : this.cur + d * 0.12;
    var t = Math.round(this.cur * 2000) / 2000;
    if (t === this.t) return;
    this.t = t;
    this.draw(t);
  };

  var passes = Array.prototype.map.call(document.querySelectorAll('canvas[data-pass]'), function (c) { return new Pass(c); });
  addEventListener('resize', function () { passes.forEach(function (p) { p.resize(); p.t = -1; }); }, { passive: true });
  (function loop() {
    for (var i = 0; i < passes.length; i++) {
      var r = passes[i].act.getBoundingClientRect();
      if (r.bottom > -innerHeight * 0.5 && r.top < innerHeight * 1.5) passes[i].tick();
    }
    requestAnimationFrame(loop);
  })();

  // ------------------------------------------------------- quote list ----
  var KEY = 'harbor-quote';
  var chosen = [];
  try { chosen = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { chosen = []; }
  var valid = Array.prototype.map.call(document.querySelectorAll('[data-quote-form] input[name="service"]'), function (x) { return x.value; });
  chosen = chosen.filter(function (v) { return valid.indexOf(v) > -1; });
  var form = document.querySelector('[data-quote-form]');
  var boxes = form ? Array.prototype.slice.call(form.querySelectorAll('input[name="service"]')) : [];
  var countEl = document.querySelector('[data-count]');

  function save() { try { localStorage.setItem(KEY, JSON.stringify(chosen)); } catch (e) {} }
  function sync() {
    document.querySelectorAll('[data-add]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(chosen.indexOf(b.getAttribute('data-add')) > -1));
    });
    boxes.forEach(function (x) { x.checked = chosen.indexOf(x.value) > -1; });
    if (countEl) { countEl.textContent = String(chosen.length); countEl.hidden = chosen.length === 0; }
  }
  function toggle(v, on) {
    var i = chosen.indexOf(v);
    if (on && i < 0) chosen.push(v);
    if (!on && i > -1) chosen.splice(i, 1);
    save(); sync();
  }
  document.querySelectorAll('[data-add]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-add');
      toggle(v, chosen.indexOf(v) < 0);
    });
  });
  boxes.forEach(function (x) { x.addEventListener('change', function () { toggle(x.value, x.checked); }); });
  sync();

  // Every "Get a Personalized Quote" goes to the form, which lives at the very
  // end of the dock act (it only shows once that act is past its midpoint).
  // The form lives in the pinned dock act, which is followed by the footer, so
  // "the form" is a point inside the dock's pinned travel, not the page bottom.
  function quoteY() {
    var d = document.getElementById('dock');
    var top = d.getBoundingClientRect().top + window.scrollY;
    return Math.round(top + (d.offsetHeight - innerHeight) * 0.72);
  }
  function toQuote(focus) {
    window.scrollTo({ top: quoteY(), behavior: 'auto' });
    if (!focus) return;
    // The page scrolls smoothly to the dock; focus the first field once the
    // form has actually opened (a hidden field cannot take focus).
    var tries = 0;
    (function wait() {
      var f = form && form.querySelector('input[name="name"]');
      if (f && quote.classList.contains('is-open')) { f.focus({ preventScroll: true }); return; }
      if (++tries < 180) requestAnimationFrame(wait);
    })();
  }
  document.querySelectorAll('[data-go-quote]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); toQuote(true); });
  });
  var quote = document.getElementById('quote');
  // The form opens once the dock act passes 0.36 and then stays open. It is
  // revealed here rather than as an engine cue: the card is its own ground,
  // and a cue's contrast is measured with the element (card included) hidden.
  var dock = document.getElementById('dock');
  // On phones the form starts just below the yacht copy, which holds above it.
  var ycopy = document.querySelector('.yacht-copy');
  function placeQuote() {
    if (!ycopy || innerWidth > 860) { dock.style.removeProperty('--yacht-end'); return; }
    var stage = ycopy.offsetParent;
    dock.style.setProperty('--yacht-end', (ycopy.offsetTop + ycopy.offsetHeight + 12) + 'px');
  }
  addEventListener('resize', placeQuote, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeQuote);
  placeQuote();
  (function watchQuote() {
    var p = parseFloat(dock.style.getPropertyValue('--sc-p')) || 0;
    var open = p > 0.36 || quote.contains(document.activeElement);
    if (open !== quote.classList.contains('is-open')) quote.classList.toggle('is-open', open);
    requestAnimationFrame(watchQuote);
  })();
  if (quote) quote.addEventListener('focusin', function () {
    var p = parseFloat(dock.style.getPropertyValue('--sc-p')) || 0;
    if (p < 0.4 || p >= 1) window.scrollTo({ top: quoteY(), behavior: 'auto' });
  });

  // ---------------------------------------------------------- the form ----
  if (form) {
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
        'Services: ' + (services.length ? services.join(', ') : 'Not sure yet'),
      ];
      var notes = (fd.get('notes') || '').trim();
      if (notes) lines.push('Notes: ' + notes);
      var text = lines.join('\n');
      quote.querySelector('[data-summary]').textContent = text;
      quote.querySelector('[data-sms]').href = 'sms:+15613011977?&body=' + encodeURIComponent(text);
      quote.querySelector('[data-mail]').href = 'mailto:service@harbortc.com?subject=' + encodeURIComponent('Personalized quote request: ' + name) + '&body=' + encodeURIComponent(text);
      quote.classList.add('is-ready');
      quote.querySelector('.sent h2').setAttribute('tabindex', '-1');
      quote.querySelector('.sent h2').focus();
    });
    quote.querySelector('[data-edit]').addEventListener('click', function () {
      quote.classList.remove('is-ready');
      form.querySelector('[name="name"]').focus();
    });
  }

  // ------------------------------------------------------- room index ----
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a[data-room]'));
  var rooms = links.map(function (a) { return document.getElementById(a.getAttribute('data-room')); });
  var current = -1;
  function mark() {
    var y = innerHeight * 0.45, idx = -1;
    for (var i = 0; i < rooms.length; i++) {
      var r = rooms[i] && rooms[i].getBoundingClientRect();
      if (r && r.top <= y && r.bottom > y) idx = i;
    }
    if (idx !== current) {
      current = idx;
      links.forEach(function (a, i) { a.setAttribute('aria-current', String(i === idx)); });
    }
  }
  addEventListener('scroll', mark, { passive: true });
  mark();

  // ------------------------------------------------------- the bar ----
  // Tucks away while scrolling down, returns on any scroll up.
  var bar = document.querySelector('.bar'), lastY = window.scrollY, accum = 0;
  addEventListener('scroll', function () {
    var y = window.scrollY, dy = y - lastY; lastY = y;
    if (y < 80) { bar.classList.remove('is-tucked'); accum = 0; return; }
    if (bar.contains(document.activeElement) || bar.classList.contains('sub-open')) return;
    accum = (dy > 0) === (accum > 0) ? accum + dy : dy;
    if (accum > 12) bar.classList.add('is-tucked');
    else if (accum < -6) bar.classList.remove('is-tucked');
  }, { passive: true });
  bar.addEventListener('focusin', function () { bar.classList.remove('is-tucked'); });

  // ----------------------------------------------------- our work wall ----
  // The wall is moved here alone (no engine rail), from the scroll position
  // read in the same frame, so nothing else can be a frame out of step with it.
  // It holds still for the first HOLD of the act, then travels its overflow.
  var HOLD = 0.16;
  var work = document.getElementById('work');
  var wall = work && work.querySelector('.wall');
  var track = work && work.querySelector('.wall__track');
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
  var lastX = null;
  // Everything is measured live, every frame: no cached offsets that a late
  // font, image or layout pass (Safari is prone to these) could leave stale.
  function moveWall() {
    if (!track) return;
    var r = work.getBoundingClientRect();
    var travel = Math.max(r.height - innerHeight, 1);
    var p = clamp01(-r.top / travel);
    var f = clamp01((p - HOLD) / (1 - HOLD));
    var e = f * f * (3 - 2 * f);           // ease into and out of the travel
    work.style.setProperty('--pan', e.toFixed(4));
    var over = track.offsetWidth + parseFloat(getComputedStyle(wall).paddingLeft) * 2 - innerWidth;
    over = over > 0 ? over * (1 + (parseFloat(wall.getAttribute('data-overshoot')) || 0)) : 0;
    var x = REDUCED.matches ? 0 : Math.round(-over * e * 10) / 10;
    if (x !== lastX) { track.style.transform = x ? 'translate3d(' + x + 'px,0,0)' : ''; lastX = x; }
  }
  (function wallLoop() {
    var r = work && work.getBoundingClientRect();
    if (r && r.bottom > -innerHeight && r.top < innerHeight * 2) moveWall();
    requestAnimationFrame(wallLoop);
  })();
  addEventListener('scroll', moveWall, { passive: true });

  // The engine measures once at mount; re-measure after fonts settle.
  function relayout() { dispatchEvent(new Event('resize')); }
  addEventListener('load', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
})();
