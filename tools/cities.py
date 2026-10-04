#!/usr/bin/env python3
"""Harbor city pages, written from one template (the West Palm Beach page).

Run from the build folder:   python3 tools/cities.py
then:                        python3 tools/nav.py && python3 tools/schema.py

Each city below becomes service-areas/<slug>/index.html. The head meta and the
<main> are written from the data here; the menu is filled in by nav.py (which
imports CITY_PAGES from this file) and the structured data by schema.py, last. FAQ text here is
the single source for both the visible questions and the FAQPage schema.

West Palm Beach is the template and stays hand-written.
"""
import re, pathlib, html as H

SITE = "https://harbortc.com"
PHONE = '<a href="tel:+15613011977">(561) 301-1977</a>'

TOWNS = ["West Palm Beach", "Palm Beach Island", "Jupiter", "Palm Beach Gardens",
         "Wellington", "Boynton Beach", "Delray Beach", "Boca Raton", "Deerfield Beach"]

# Shared FAQ answers, worded exactly as on the West Palm Beach page.
INSURED = ("Is Harbor Tile & Carpet Cleaning insured?", "Yes. Harbor carries $1M+ in liability insurance.")
PETS = ("Can Harbor remove pet stains and odors?",
        "Yes. Pet stain and odor removal is offered for carpet, area rugs and upholstery.")
STICKY = ("Will my carpet feel sticky after cleaning?",
          "No. Harbor's 7-step carpet cleaning process is designed to lift stains and odors without leaving a sticky residue behind.")
HOURS = ("What are Harbor's hours?", "Monday to Saturday, 8:00 AM to 6:00 PM. Closed Sunday.")

def quote_q(place):
    return (f"How do I get a quote for cleaning in {place}?",
            "Use the Get a Personalized Quote form on this page, or call or text (561) 301-1977 Monday to Saturday, 8:00 AM to 6:00 PM.")

def answer_text(c):
    return (f"Harbor Tile & Carpet Cleaning is a locally owned Palm Beach County company, based in West Palm Beach, "
            f"that cleans tile and grout, carpet, area rugs, upholstery and mattresses in {c['place']}, removes pet stains and odors, "
            f"and cleans yacht interiors. It has 240 five-star Google reviews, carries $1M+ in liability insurance "
            f"and has served Palm Beach County for over 15 years.")

CITIES = [
    {
        "slug": "palm-beach", "town": "Palm Beach Island", "place": "Palm Beach", "schema_city": "Palm Beach",
        "in_place": "on Palm Beach",
        "img": "palm-beach",
        "hero_alt": "A Palm Beach island living room with a polished white marble floor and French doors open to the ocean",
        "sub": "Careful, discreet cleaning for island homes, from the Estate Section to the North End, timed around the season.",
        "before_alt": "Before: the marble floor dulled, with greyed grout lines",
        "after_alt": "After: the same marble floor bright, with clean light grout",
        "compare_note": "Drag to compare. An illustration of a polished marble floor, common in Palm Beach island homes, before and after a deep tile and grout clean.",
        "local_h": "Palm Beach homes, and what they need",
        "local_lead": "Fine floors, fine fabrics and a seasonal calendar. Here is what we see most often on the island.",
        "points": [
            ("Marble, coral stone and antique tile", "Island homes often have polished marble, porous coral keystone or original tile from the Mizner era. Each surface needs a clean that suits it, never one method for everything."),
            ("Heirloom rugs and fine upholstery", "Hand-knotted wool and silk rugs, and linen and silk upholstery, need fabric-safe solutions and a careful hand. Delicate rugs can be cleaned at Harbor's facility."),
            ("A seasonal calendar", "Many island homes sit closed over the summer. Book a clean before you return for the season, so the house is fresh when you arrive."),
            ("Salt air and sea breezes", "Ocean air carries salt and fine sand indoors. Both settle into grout and pile and slowly dull light floors and fabrics."),
        ],
        "hoods": ["Estate Section", "North End", "Midtown", "South End", "Worth Avenue area", "Lake Trail", "Sloan's Curve", "Phipps Plaza"],
        "hoods_note": "We cover the whole island, plus West Palm Beach across the bridges. Ask when you request your quote.",
        "faq": [
            ("Which parts of Palm Beach does Harbor serve?",
             "The whole island, including the Estate Section, the North End, Midtown, the South End, the Worth Avenue area, Lake Trail, Sloan's Curve and Phipps Plaza."),
            ("Can Harbor clean my Palm Beach home before I return for the season?",
             "Yes. Tell us when you plan to arrive and we will schedule the clean beforehand, so the house is fresh when you get back."),
            INSURED,
            quote_q("Palm Beach"),
            ("Can Harbor clean silk and antique rugs?",
             "Yes. Harbor cleans wool, viscose, oriental and silk rugs. Delicate rugs can be cleaned at Harbor's facility rather than in the home."),
            PETS,
            HOURS,
        ],
    },
    {
        "slug": "jupiter", "town": "Jupiter", "place": "Jupiter", "schema_city": "Jupiter",
        "in_place": "in Jupiter",
        "img": "jupiter",
        "hero_alt": "A Jupiter family room with clean ivory carpet and a view over the Loxahatchee River to the Jupiter Inlet Lighthouse",
        "sub": "Carpet, tile, upholstery and yacht interiors for homes along the river and the inlet, from Abacoa to Admirals Cove.",
        "before_alt": "Before: the ivory carpet greyed, with a darker worn traffic path",
        "after_alt": "After: the same carpet bright and even, the traffic path gone",
        "compare_note": "Drag to compare. An illustration of wall-to-wall carpet in a Jupiter home before and after a deep carpet clean.",
        "local_h": "Jupiter homes, and what they go through",
        "local_lead": "Life on the water is good to people and hard on floors. Here is what we see most often in Jupiter.",
        "points": [
            ("Beach sand, every day", "Sand from the beach and the inlet comes home on feet, towels and paws. It works deep into carpet pile and grout, where it wears fibers and dulls tile."),
            ("Carpet upstairs", "Many Jupiter homes keep carpet in the bedrooms and family rooms upstairs. Light carpet shows traffic paths first, on stairs and landings."),
            ("Boats and docks", "With the river, the inlet and the Intracoastal on the doorstep, plenty of Jupiter families keep a boat. Harbor cleans yacht interiors too, so one crew can do the house and the boat."),
            ("Dogs, and plenty of them", "Jupiter is a dog-loving town. Pet accidents and the odors they leave behind need enzyme treatment, not just a surface clean."),
        ],
        "hoods": ["Abacoa", "Admirals Cove", "Jonathan's Landing", "Jupiter Inlet Colony", "The Bluffs", "Jupiter Farms", "Egret Landing", "Harbourside"],
        "hoods_note": "We also serve Tequesta, Juno Beach and Palm Beach Gardens. Ask when you request your quote.",
        "faq": [
            ("Which Jupiter neighborhoods does Harbor serve?",
             "All of Jupiter, including Abacoa, Admirals Cove, Jonathan's Landing, Jupiter Inlet Colony, The Bluffs, Jupiter Farms, Egret Landing and Harbourside, plus nearby Tequesta and Juno Beach."),
            ("Does Harbor clean yacht interiors in Jupiter?",
             "Yes. Harbor offers discreet yacht interior cleaning for salons, staterooms, carpet and upholstery aboard, including Harbor Shield protection."),
            INSURED,
            quote_q("Jupiter"),
            PETS,
            STICKY,
            HOURS,
        ],
    },
    {
        "slug": "wellington", "town": "Wellington", "place": "Wellington", "schema_city": "Wellington",
        "in_place": "in Wellington",
        "img": "wellington",
        "hero_alt": "A Wellington equestrian estate study with a clean hand-knotted wool rug and a view of the paddocks",
        "sub": "Rugs, carpet, tile and upholstery for equestrian estates and family homes, from Palm Beach Polo to Olympia.",
        "before_alt": "Before: the wool rug dulled and greyed, its colours flat",
        "after_alt": "After: the same rug with clear, bright colours",
        "compare_note": "Drag to compare. An illustration of a hand-knotted wool rug in a Wellington home before and after a deep rug clean.",
        "local_h": "Wellington homes, and what they go through",
        "local_lead": "Horse country brings its own kind of wear. Here is what we see most often in Wellington.",
        "points": [
            ("Barn dust and arena footing", "Fine dust and arena sand travel in from the barn on boots and clothes. It settles deep in rugs and carpet, where a vacuum cannot reach it."),
            ("Fine rugs and leather-and-linen rooms", "Equestrian estates often have hand-knotted wool rugs and fine upholstery. They need fiber-safe solutions and a careful hand."),
            ("The winter season", "Many homes fill up for the winter show season. A deep clean before it starts, and another when it ends, keeps the house ready for guests."),
            ("Dogs and family life", "Barn dogs and house dogs both leave spots and odors in carpet, rugs and upholstery that everyday vacuuming cannot reach."),
        ],
        "hoods": ["Palm Beach Polo", "Grand Prix Village", "Olympia", "Versailles", "Binks Forest", "Aero Club", "Saddle Trail", "Equestrian Preserve"],
        "hoods_note": "We cover all of Wellington and the surrounding towns. Ask when you request your quote.",
        "faq": [
            ("Which Wellington neighborhoods does Harbor serve?",
             "All of Wellington, including Palm Beach Polo, Grand Prix Village, Olympia, Versailles, Binks Forest, Aero Club, Saddle Trail and the Equestrian Preserve."),
            ("Can Harbor clean wool and oriental rugs?",
             "Yes. Harbor cleans synthetic, wool, viscose, oriental and silk rugs, in the home or at Harbor's facility."),
            INSURED,
            quote_q("Wellington"),
            PETS,
            STICKY,
            HOURS,
        ],
    },
    {
        "slug": "delray-beach", "town": "Delray Beach", "place": "Delray Beach", "schema_city": "Delray Beach",
        "in_place": "in Delray Beach",
        "img": "delray",
        "hero_alt": "A mid-century Delray Beach living room with a polished terrazzo floor and windows onto a pool garden",
        "sub": "Tile, terrazzo, carpet and upholstery for beach houses and mid-century homes, from Seagate to Lake Ida.",
        "before_alt": "Before: the terrazzo floor dull and greyed, its marble chips faded",
        "after_alt": "After: the same terrazzo bright, its colours clear",
        "compare_note": "Drag to compare. An illustration of a terrazzo floor, common in Delray Beach's mid-century homes, before and after a deep floor clean.",
        "local_h": "Delray Beach homes, and what they go through",
        "local_lead": "Close to the beach and full of character. Here is what we see most often in Delray Beach.",
        "points": [
            ("Mid-century terrazzo and tile", "Many older Delray homes still have their original terrazzo or tile. Years of mopping leave a dull film that hides the colour of the stone."),
            ("Sand from the beach", "Living near the beach means sand in the house. It grinds into grout and carpet pile and dulls light floors."),
            ("Guests and rentals", "Homes that host family, guests or seasonal renters see more traffic, more spills and more wear on upholstery between visits."),
            ("Humidity and salt air", "Coastal humidity keeps grout damp and helps soil set in. Regular deep cleaning keeps floors and fabrics from going grey."),
        ],
        "hoods": ["Seagate", "Lake Ida", "Tropic Isle", "Marina Historic District", "Del-Ida Park", "Osceola Park", "Downtown and Atlantic Avenue", "Delray beach area"],
        "hoods_note": "We cover all of Delray Beach, plus Gulf Stream, Highland Beach and Boynton Beach. Ask when you request your quote.",
        "faq": [
            ("Which Delray Beach neighborhoods does Harbor serve?",
             "All of Delray Beach, including Seagate, Lake Ida, Tropic Isle, the Marina Historic District, Del-Ida Park, Osceola Park, Downtown and Atlantic Avenue, and the beach area, plus nearby Gulf Stream and Highland Beach."),
            ("Can Harbor clean terrazzo floors?",
             "Yes. Terrazzo is cleaned with the same machine agitation and hot-water extraction Harbor uses on tile, which lifts the dull film and brings back the colour of the stone."),
            INSURED,
            quote_q("Delray Beach"),
            PETS,
            STICKY,
            HOURS,
        ],
    },
    {
        "slug": "boynton-beach", "town": "Boynton Beach", "place": "Boynton Beach", "schema_city": "Boynton Beach",
        "in_place": "in Boynton Beach",
        "img": "boynton",
        "hero_alt": "A Boynton Beach condo living room with a clean oatmeal linen sectional and a view over the Intracoastal",
        "sub": "Upholstery, carpet and tile for Intracoastal condos and golf community homes, from Hunters Run to the marina.",
        "before_alt": "Before: the linen sectional greyed and dingy along the arms and seat fronts",
        "after_alt": "After: the same sectional clean and bright",
        "compare_note": "Drag to compare. An illustration of a linen sectional in a Boynton Beach condo before and after a deep upholstery clean.",
        "local_h": "Boynton Beach homes, and what they go through",
        "local_lead": "Condo towers, golf communities and the marina. Here is what we see most often in Boynton Beach.",
        "points": [
            ("Light upholstery that gets used", "The sofa by the window is where everyone sits. Body oils and everyday soil grey light linen along the arms and seat fronts first."),
            ("Condo living", "We work around building rules for parking, elevators and work hours. Tell us what your association requires when you book."),
            ("Tile and carpet in golf community homes", "Large porcelain tile in the living areas and carpet in the bedrooms, each needing its own clean."),
            ("Salt air on the Intracoastal", "Waterfront humidity and salt air leave a film on floors and fabrics. Regular deep cleaning keeps both bright."),
        ],
        "hoods": ["Hunters Run", "Quail Ridge", "Leisureville", "Lake Boynton Estates", "Chapel Hill", "Seacrest", "Boynton Harbor Marina", "Intracoastal condos"],
        "hoods_note": "We cover all of Boynton Beach, plus Lantana, Manalapan and Ocean Ridge. Ask when you request your quote.",
        "faq": [
            ("Which Boynton Beach neighborhoods does Harbor serve?",
             "All of Boynton Beach, including Hunters Run, Quail Ridge, Leisureville, Lake Boynton Estates, Chapel Hill, Seacrest, the Boynton Harbor Marina area and the Intracoastal condos, plus nearby Lantana, Manalapan and Ocean Ridge."),
            ("Does Harbor clean in condominiums?",
             "Yes. Harbor works around building rules for parking, elevators and work hours. Tell us what your association requires when you book."),
            INSURED,
            quote_q("Boynton Beach"),
            ("Can Harbor clean sectionals and dining chairs?",
             "Yes. Harbor offers fabric-safe cleaning for sofas, sectionals, dining chairs, mattresses and outdoor cushions."),
            PETS,
            HOURS,
        ],
    },
]

def esc(s):
    return H.escape(s, quote=False)

def city_answer_q(c):
    return f"Who cleans tile, grout and carpet {c['in_place']}?"

def schema_faq(c):
    return [(city_answer_q(c), answer_text(c))] + c["faq"]

CITY_PAGES = [{
    "file": f"service-areas/{c['slug']}/index.html",
    "url": f"{SITE}/service-areas/{c['slug']}/",
    "name": f"Tile, Carpet & Upholstery Cleaning in {c['place']}, FL",
    "description": f"Tile and grout, carpet, area rug, upholstery, pet stain and yacht interior cleaning {c['in_place']}, from a locally owned Palm Beach County company.",
    "image": (f"/assets/{c['img']}-clean.webp", 1920, 1084, c["hero_alt"]),
    "trail": [("Home", SITE + "/"), ("Service areas", None), (c["place"], f"{SITE}/service-areas/{c['slug']}/")],
    "faq": schema_faq(c),
    "speakable": ["#answer"],
    "city": c["schema_city"],
} for c in CITIES]

def main_html(c):
    a = "../../assets/"
    pts = "\n".join(f'          <div><h3>{esc(h)}</h3><p>{esc(p)}</p></div>' for h, p in c["points"])
    hoods = "\n".join(f"          <li>{esc(h)}</li>" for h in c["hoods"])
    faqs = "\n".join(f"        <details><summary>{esc(q)}</summary><p>{esc(ans)}</p></details>" for q, ans in c["faq"])
    towns = "\n".join(f"                  <option{' selected' if t == c['town'] else ''}>{esc(t)}</option>" for t in TOWNS)
    return f'''<main>

  <section class="c-hero" aria-labelledby="hero-h">
    <img class="c-hero__img" src="{a}{c['img']}-clean.webp" width="1920" height="1084" alt="{esc(c['hero_alt'])}" fetchpriority="high">
    <div class="c-hero__wash" aria-hidden="true"></div>
    <div class="wrap c-hero__copy">
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol><li><a href="../../">Home</a></li><li>Service areas</li><li aria-current="page">{esc(c['place'])}</li></ol>
      </nav>
      <h1 id="hero-h" class="display">Tile, carpet and upholstery cleaning {esc(c['in_place'])}</h1>
      <p class="sub">{esc(c['sub'])}</p>
      <div class="row">
        <a class="btn btn--lg" href="#quote">Get a Personalized Quote</a>
        <span class="or">or call or text {PHONE}</span>
      </div>
      <ul class="trust">
        <li><b>240</b>five-star Google reviews</li>
        <li><b>15+</b>years in Palm Beach County</li>
        <li><b>$1M+</b>liability insurance</li>
      </ul>
    </div>
  </section>

  <section class="band" aria-labelledby="answer-h">
    <div class="wrap">
      <div class="answer">
        <h2 id="answer-h" class="display">{esc(city_answer_q(c))}</h2>
        <div id="answer" data-sc-in data-sc-stagger="60">
          <p>Harbor Tile &amp; Carpet Cleaning is a locally owned Palm Beach County company, based in West Palm Beach, that cleans tile and grout, carpet, area rugs, upholstery and mattresses in {esc(c['place'])}, removes pet stains and odors, and cleans yacht interiors.</p>
          <p>Harbor has 240 five-star Google reviews, carries $1M+ in liability insurance and has served Palm Beach County for over 15 years. Call or text {PHONE}, Monday to Saturday, 8:00 AM to 6:00 PM.</p>
        </div>
      </div>

      <div class="compare" data-compare>
        <img src="{a}{c['img']}-dirty.webp" width="1920" height="1084" alt="{esc(c['before_alt'])}" loading="lazy">
        <img class="after" src="{a}{c['img']}-clean.webp" width="1920" height="1084" alt="{esc(c['after_alt'])}" loading="lazy">
        <span class="tag tag--b" aria-hidden="true">Before</span>
        <span class="tag tag--a" aria-hidden="true">After</span>
        <input type="range" min="0" max="100" step="0.5" value="50" aria-label="Compare before and after: slide to reveal">
        <span class="divider" aria-hidden="true"></span>
      </div>
      <p class="compare-note">{esc(c['compare_note'])}</p>
    </div>
  </section>

  <section class="band" aria-labelledby="services-h" style="padding-top: 0">
    <div class="wrap">
      <h2 id="services-h" class="display">Cleaning services {esc(c['in_place'])}</h2>
      <p class="lead">One local crew for the whole house, and the boat.</p>
      <ul class="ledger" data-sc-in data-sc-stagger="50">
        <li><h3><a href="../../tile-grout-cleaning/">Tile &amp; Grout Cleaning</a></h3><p>Rotary cleaning that lifts the film off the tile and the grey out of every grout line, for kitchens, baths, entries and patios.</p></li>
        <li><h3><a href="../../carpet-cleaning/">Carpet Cleaning</a></h3><p>Deep extraction for wall-to-wall carpet, with a 7-step process that removes embedded soil and traffic lanes without leaving a sticky residue.</p></li>
        <li><h3><a href="../../area-rug-cleaning/">Area Rug Cleaning</a></h3><p>Careful cleaning for area rugs, from everyday wool to the pieces you inherited.</p></li>
        <li><h3><a href="../../upholstery-cleaning/">Upholstery Cleaning</a></h3><p>Fabric-safe cleaning for sofas, sectionals, dining chairs and mattresses.</p></li>
        <li><h3><a href="../../pet-stain-odor-removal/">Pet Stain &amp; Odor Removal</a></h3><p>Treatment for pet accidents and the odors that linger in carpet, rugs and upholstery.</p></li>
        <li><h3><a href="../../yacht-interior-cleaning/">Yacht Interior Cleaning</a></h3><p>Discreet cleaning for salons, staterooms, carpet and upholstery aboard, including Harbor Shield protection.</p></li>
      </ul>
    </div>
  </section>

  <section class="band band--navy" aria-labelledby="local-h">
    <div class="wrap local">
      <div>
        <h2 id="local-h" class="display">{esc(c['local_h'])}</h2>
        <p class="lead">{esc(c['local_lead'])}</p>
        <div class="local__points" data-sc-in data-sc-stagger="60">
{pts}
        </div>
      </div>
      <aside class="hoods" aria-labelledby="hoods-h">
        <h3 id="hoods-h">{esc(c['place'])} neighborhoods we serve</h3>
        <ul>
{hoods}
        </ul>
        <p>{esc(c['hoods_note'])}</p>
      </aside>
    </div>
  </section>

  <section class="band" aria-labelledby="steps-h">
    <div class="wrap">
      <h2 id="steps-h" class="display">How it works</h2>
      <ol class="steps">
        <li><h3>Request your quote</h3><p>Use the form below, or call or text (561) 301-1977. Tell us what needs cleaning.</p></li>
        <li><h3>Approve your estimate</h3><p>You receive a personalized estimate to review and approve before anything is booked.</p></li>
        <li><h3>Get ready</h3><p>We send a prep sheet when you book, and a reminder the day before your appointment.</p></li>
        <li><h3>The clean, then a check-in</h3><p>The Harbor crew arrives, does the work and follows up afterwards to make sure you are happy.</p></li>
      </ol>
    </div>
  </section>

  <section class="band" aria-labelledby="faq-h" style="padding-top: 0">
    <div class="wrap faq">
      <h2 id="faq-h" class="display">{esc(c['place'])} questions, answered</h2>
      <div>
{faqs}
      </div>
    </div>
  </section>

  <section class="band band--navy" aria-labelledby="quote-h">
    <div class="wrap c-quote">
      <div>
        <h2 id="quote-h" class="display">Get a Personalized Quote {esc(c['in_place'])}</h2>
        <p class="lead">Tell us what needs cleaning and we will get back to you with a personalized estimate. Prefer to talk? Call or text <a href="tel:+15613011977" style="color: var(--sc-accent)">(561) 301-1977</a>.</p>
      </div>
@@QUOTE@@
    </div>
  </section>

</main>'''

ROOT = pathlib.Path(__file__).resolve().parent.parent

def build():
    tpl = (ROOT / "service-areas/west-palm-beach/index.html").read_text()
    quote = re.search(r'      <div class="quote" id="quote">.*?\n      </div>\n(?=    </div>\n  </section>\n\n</main>)', tpl, re.S).group(0).rstrip("\n")
    quote = re.sub(r'<select name="town">.*?</select>', '@@TOWNS@@', quote, flags=re.S)
    for c in CITIES:
        page = next(p for p in CITY_PAGES if p["file"].startswith(f"service-areas/{c['slug']}/"))
        out = tpl
        title = f"Tile, Carpet &amp; Upholstery Cleaning in {esc(c['place'])}, FL | Harbor"
        desc = esc(f"Tile and grout, carpet, area rug, upholstery, pet stain and yacht interior cleaning {c['in_place']}. 240 five-star Google reviews. Call (561) 301-1977.")
        out = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", out)
        out = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', out)
        out = out.replace("https://harbortc.com/service-areas/west-palm-beach/", page["url"])
        out = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{esc(page["name"])}">', out)
        out = re.sub(r'<meta property="og:description" content="[^"]*">',
                     f'<meta property="og:description" content="Locally owned in Palm Beach County. 240 five-star Google reviews. Get a Personalized Quote {esc(c["in_place"])}.">', out)
        out = out.replace('content="https://harbortc.com/assets/wpb-clean.webp"', f'content="https://harbortc.com/assets/{c["img"]}-clean.webp"')
        out = re.sub(r'<meta name="geo.placename" content="[^"]*">', f'<meta name="geo.placename" content="{esc(c["place"])}">', out)
        out = out.replace('href="../../assets/wpb-clean.webp" fetchpriority', f'href="../../assets/{c["img"]}-clean.webp" fetchpriority')
        towns = "\n".join(f"                  <option{' selected' if t == c['town'] else ''}>{esc(t)}</option>" for t in TOWNS)
        q = quote.replace("@@TOWNS@@", '<select name="town">\n' + towns + "\n                </select>")
        out = re.sub(r"<main>.*?</main>", lambda m: main_html(c).replace("@@QUOTE@@", q), out, count=1, flags=re.S)
        # the head above the structured data must not still point at West Palm Beach
        assert "west-palm-beach" not in re.search(r"<head>.*?(?:<!-- schema-markup:jsonld:start -->|</head>)", out, re.S).group(0)
        f = ROOT / page["file"]
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(out)
        print("city page written:", page["file"])

if __name__ == "__main__":
    build()
