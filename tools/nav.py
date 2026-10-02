#!/usr/bin/env python3
"""Harbor site header: one menu, written into every page.

Run from the build folder:   python3 tools/nav.py

Writes the <header class="bar"> between <!-- nav:start --> and <!-- nav:end -->
(or replaces the existing <header class="bar"> on first run). Links are made
relative to each page's depth, so the same menu works at / and at
/service-areas/west-palm-beach/.

Add a service: append to SERVICES. Add a city: give its TOWNS entry a path and
add it to PAGES, once its page exists, so nothing links to a missing page.
"""
import re, pathlib

SERVICES = [  # (label, path): the URLs Harbor's live site already uses
    ("Tile & Grout Cleaning", "tile-grout-cleaning/"),
    ("Carpet Cleaning", "carpet-cleaning/"),
    ("Area Rug Cleaning", "area-rug-cleaning/"),
    ("Upholstery Cleaning", "upholstery-cleaning/"),
    ("Pet Stain & Odor Removal", "pet-stain-odor-removal/"),
    ("Yacht Interior Cleaning", "yacht-interior-cleaning/"),
]
# Every town Harbor names, in footer order. A town with a path has its own
# page and is linked everywhere (menu, footer, "near you" pills); the rest are
# listed as plain text until their page exists.
TOWNS = [
    ("Jupiter", "service-areas/jupiter/"),
    ("Palm Beach Gardens", None),
    ("Palm Beach Island", "service-areas/palm-beach/"),
    ("West Palm Beach", "service-areas/west-palm-beach/"),
    ("Wellington", "service-areas/wellington/"),
    ("Boynton Beach", "service-areas/boynton-beach/"),
    ("Delray Beach", "service-areas/delray-beach/"),
    ("Boca Raton", None),
    ("Deerfield Beach", None),
]
# the menu lists the towns that have a page, in the same north-to-south order
AREAS = [(l, p) for l, p in TOWNS if p]

PAGES = [
    # file, prefix back to the site root, is this the home page
    ("index.html", "", True),
    ("service-areas/west-palm-beach/index.html", "../../", False),
    ("service-areas/palm-beach/index.html", "../../", False),
    ("service-areas/jupiter/index.html", "../../", False),
    ("service-areas/wellington/index.html", "../../", False),
    ("service-areas/delray-beach/index.html", "../../", False),
    ("service-areas/boynton-beach/index.html", "../../", False),
    ("tile-grout-cleaning/index.html", "../", False),
    ("carpet-cleaning/index.html", "../", False),
    ("area-rug-cleaning/index.html", "../", False),
    ("upholstery-cleaning/index.html", "../", False),
    ("pet-stain-odor-removal/index.html", "../", False),
    ("yacht-interior-cleaning/index.html", "../", False),
    ("about-us/index.html", "../", False),
]

def esc(s):
    return s.replace("&", "&amp;")

CHEVRON = '<svg class="menu__chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def header(prefix, home, current):
    here = lambda path: ' aria-current="page"' if path == current else ""
    sub = lambda items: "\n".join(
        f'          <li><a href="{prefix}{p}"{here(p)}>{esc(l)}</a></li>' for l, p in items)
    sec = (lambda a: "#" + a) if home else (lambda a: prefix + "#" + a)
    cta = ('<a class="btn" href="#quote" data-go-quote><span>Get a<span class="long"> Personalized</span> Quote</span><span class="count" data-count hidden>0</span></a>'
           if home else
           '<a class="btn" href="#quote"><span>Get a<span class="long"> Personalized</span> Quote</span></a>')
    brand_href = "#foyer" if home else prefix
    return f'''<!-- nav:start -->
<header class="bar">
  <a class="brand" href="{brand_href}" aria-label="Harbor Tile &amp; Carpet Cleaning, {'back to the top' if home else 'home'}">
    <img src="{prefix}assets/logo.webp" width="720" height="220" alt="">
  </a>
  <nav class="menu" id="site-menu" aria-label="Main">
    <ul class="menu__list">
      <li><a class="menu__link" href="{sec('work')}" data-room="work">Our work</a></li>
      <li class="menu__group">
        <button class="menu__trigger" type="button" aria-expanded="false" aria-controls="menu-services">Services{CHEVRON}</button>
        <ul class="menu__sub" id="menu-services">
{sub(SERVICES)}
        </ul>
      </li>
      <li class="menu__group">
        <button class="menu__trigger" type="button" aria-expanded="false" aria-controls="menu-areas">Service areas{CHEVRON}</button>
        <ul class="menu__sub" id="menu-areas">
{sub(AREAS)}
        </ul>
      </li>
      <li><a class="menu__link" href="{prefix}about-us/"{here('about-us/')}>About us</a></li>
    </ul>
    <a class="menu__phone" href="tel:+15613011977">Call or text (561) 301-1977</a>
  </nav>
  <a class="phone" href="tel:+15613011977">(561) 301-1977</a>
  {cta}
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu">
    <span class="sr-only">Menu</span>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path class="l1" d="M4 7h16"/><path class="l2" d="M4 12h16"/><path class="l3" d="M4 17h16"/></svg>
  </button>
</header>
<!-- nav:end -->'''

def town_items(prefix, current, tag):
    out = []
    for label, path in TOWNS:
        if not path:
            out.append(f"<li>{tag(esc(label))}</li>" if tag else f"<li>{esc(label)}</li>")
        elif path == current:
            out.append(f'<li><a href="{prefix}{path}" aria-current="page">{esc(label)}</a></li>')
        else:
            out.append(f'<li><a href="{prefix}{path}">{esc(label)}</a></li>')
    return out

def footer_towns(prefix, current):
    items = town_items(prefix, current, None)
    rows = ["".join(items[i:i + 3]) for i in range(0, len(items), 3)]
    return '<ul class="site-foot__towns">\n' + "\n".join("        " + r for r in rows) + "\n      </ul>"

def pills(prefix, current):
    items = town_items(prefix, current, lambda t: f"<span>{t}</span>")
    return '<ul class="pills">\n' + "\n".join("            " + i for i in items) + "\n          </ul>"

FOOT = re.compile(r'<ul class="site-foot__towns">.*?</ul>', re.S)
# the first pills list in a "near you" hub is the town list
HUB_TOWNS = re.compile(r'(<h2 id="more-h"[^>]*>.*?</h2>\s*)<ul class="pills">.*?</ul>', re.S)

ROOT = pathlib.Path(__file__).resolve().parent.parent
BLOCK = re.compile(r"<!-- nav:start -->.*?<!-- nav:end -->", re.S)
OLD = re.compile(r'<header class="bar">.*?</header>', re.S)

for f, prefix, home in PAGES:
    path = ROOT / f
    html = path.read_text()
    current = f.replace("index.html", "") if not home else ""
    block = header(prefix, home, current)
    if BLOCK.search(html):
        html = BLOCK.sub(lambda m: block, html, count=1)
    else:
        assert OLD.search(html), f"no header in {f}"
        html = OLD.sub(lambda m: block, html, count=1)
    html = FOOT.sub(lambda m: footer_towns(prefix, current), html, count=1)
    html = HUB_TOWNS.sub(lambda m: m.group(1) + pills(prefix, current), html, count=1)
    # every page loads the shared menu styles and script
    css = f'<link rel="stylesheet" href="{prefix}nav.css">'
    if css not in html:
        html = html.replace("</head>", css + "\n</head>", 1)
    js = f'<script src="{prefix}nav.js"></script>'
    if js not in html:
        html = html.replace("</body>", js + "\n</body>", 1)
    path.write_text(html)
    print("nav written:", f)
