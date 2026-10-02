#!/usr/bin/env python3
"""Harbor structured data: one source of truth, written into every page.

Run from the build folder:   python3 tools/schema.py

Each page carries the same full business, website and service entities (same
@id everywhere, so search engines merge them into one graph), plus the nodes
that belong to that page alone: WebPage, BreadcrumbList, FAQPage, ImageObject.
The block is written between <!-- schema:start --> and <!-- schema:end -->;
nothing else in the page is touched.

To add a city: add an entry to PAGES with its path, title, description,
image, breadcrumb and FAQ, then re-run. FAQ text must match what is visible
on the page.
"""
import json, re, pathlib
from cities import CITY_PAGES

SITE = "https://harbortc.com"
BIZ = SITE + "/#business"
WEB = SITE + "/#website"

def wiki(title):
    return "https://en.wikipedia.org/wiki/" + title

# Cities linked to their Wikipedia articles, so answer engines resolve exactly
# which place is meant.
CITIES = {
    "Jupiter": "Jupiter,_Florida",
    "Palm Beach Gardens": "Palm_Beach_Gardens,_Florida",
    "Palm Beach": "Palm_Beach,_Florida",
    "West Palm Beach": "West_Palm_Beach,_Florida",
    "Wellington": "Wellington,_Florida",
    "Boynton Beach": "Boynton_Beach,_Florida",
    "Delray Beach": "Delray_Beach,_Florida",
    "Boca Raton": "Boca_Raton,_Florida",
    "Deerfield Beach": "Deerfield_Beach,_Florida",
}
COUNTY = {"@type": "AdministrativeArea", "name": "Palm Beach County, Florida",
          "sameAs": wiki("Palm_Beach_County,_Florida")}

def city(name):
    return {"@type": "City", "name": name, "sameAs": wiki(CITIES[name]),
            "containedInPlace": COUNTY}

AREA = [city(c) for c in CITIES]

SERVICES = [
    ("tile-grout", "Tile & Grout Cleaning", "Tile and grout cleaning",
     "Machine agitation and hot-water extraction that lift soil, grease and soap scum out of tile and grout, with optional grout sealing, for kitchens, baths, entries and patios.",
     "tile-grout-cleaning/"),
    ("carpet", "Carpet Cleaning", "Carpet cleaning",
     "Deep extraction for wall-to-wall carpet with a 7-step process that removes embedded soil and traffic lanes without leaving a sticky residue.",
     "carpet-cleaning/"),
    ("area-rug", "Area Rug Cleaning", "Rug cleaning",
     "In-home or off-site cleaning for synthetic, wool, viscose, oriental and silk area rugs.",
     "area-rug-cleaning/"),
    ("upholstery", "Upholstery Cleaning", "Upholstery cleaning",
     "Fabric-safe cleaning for sofas, sectionals, dining chairs, mattresses and outdoor cushions.",
     "upholstery-cleaning/"),
    ("pet-stain-odor", "Pet Stain & Odor Removal", "Pet stain and odor removal",
     "Enzyme treatment and UV detection for pet stains and odors in carpet, rugs, upholstery and tile.",
     "pet-stain-odor-removal/"),
    ("yacht-interior", "Yacht Interior Cleaning", "Yacht interior cleaning",
     "Discreet cleaning for salons, staterooms, carpet, upholstery and mattresses aboard, including Harbor Shield protection.",
     "yacht-interior-cleaning/"),
]

def service_nodes():
    return [{
        "@type": "Service",
        "@id": SITE + "/#service-" + key,
        "name": name,
        "serviceType": stype,
        "description": desc,
        "provider": {"@id": BIZ},
        "areaServed": AREA,
        "url": SITE + "/" + anchor,
    } for key, name, stype, desc, anchor in SERVICES]

def business():
    return {
        "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
        "@id": BIZ,
        "name": "Harbor Tile & Carpet Cleaning",
        "alternateName": "Harbor",
        "slogan": "Your Sparkle Specialists!",
        "description": "Locally owned tile and grout, carpet, area rug, upholstery, pet stain and odor, and yacht interior cleaning company in West Palm Beach, serving Palm Beach County from Deerfield Beach to Jupiter.",
        "url": SITE + "/",
        "logo": {"@type": "ImageObject", "url": SITE + "/assets/logo.webp", "width": 720, "height": 220},
        "image": SITE + "/assets/foyer-clean.webp",
        "telephone": "+1-561-301-1977",
        "email": "service@harbortc.com",
        "address": {"@type": "PostalAddress", "streetAddress": "500 S Australian Ave #600",
                    "addressLocality": "West Palm Beach",
                    "addressRegion": "FL", "postalCode": "33401", "addressCountry": "US"},
        # 500 S Australian Ave, geocoded via OpenStreetMap Nominatim.
        "geo": {"@type": "GeoCoordinates", "latitude": 26.70979, "longitude": -80.06414},
        "hasMap": "https://www.google.com/maps/search/?api=1&query=500+S+Australian+Ave+%23600+West+Palm+Beach+FL+33401",
        # Named cities plus a radius around West Palm Beach (serviceArea is
        # superseded by areaServed in schema.org, so both live here).
        "areaServed": AREA + [{"@type": "GeoCircle",
                               "geoMidpoint": {"@type": "GeoCoordinates", "latitude": 26.70979, "longitude": -80.06414},
                               "geoRadius": "55000"}],
        "openingHoursSpecification": [{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00", "closes": "18:00"}],
        "contactPoint": [{
            "@type": "ContactPoint", "contactType": "customer service",
            "telephone": "+1-561-301-1977", "email": "service@harbortc.com",
            "availableLanguage": "English", "areaServed": "US-FL",
            "contactOption": [], "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "08:00", "closes": "18:00"}}],
        "knowsAbout": ["Tile and grout cleaning", "Natural stone floor cleaning",
                       "Cement and encaustic tile", "Terrazzo", "Carpet hot-water extraction",
                       "Area rug cleaning", "Upholstery cleaning", "Mattress cleaning",
                       "Pet stain and odor removal", "Yacht interior cleaning"],
        "hasOfferCatalog": {
            "@type": "OfferCatalog", "name": "Cleaning services",
            "itemListElement": [{"@type": "Offer", "itemOffered": {"@id": SITE + "/#service-" + s[0]}}
                                for s in SERVICES]},
        "sameAs": ["https://www.instagram.com/harbortc/", "https://www.facebook.com/harbortc/"],
    }

def website():
    return {"@type": "WebSite", "@id": WEB, "url": SITE + "/",
            "name": "Harbor Tile & Carpet Cleaning", "publisher": {"@id": BIZ},
            "inLanguage": "en-US"}

def faq_node(url, faqs):
    return {"@type": "FAQPage", "@id": url + "#faq", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
        for q, a in faqs]}

def crumbs(url, trail):
    return {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
        dict({"@type": "ListItem", "position": i + 1, "name": n},
             **({"item": u} if u else {}))
        for i, (n, u) in enumerate(trail)]}

# ------------------------------------------------------------------ pages ----
WPB_FAQ = [
    ("Who cleans tile, grout and carpet in West Palm Beach?",
     "Harbor Tile & Carpet Cleaning is a locally owned West Palm Beach company that cleans tile and grout, carpet, area rugs, upholstery and mattresses, removes pet stains and odors, and cleans yacht interiors. It has 240 five-star Google reviews, carries $1M+ in liability insurance and has served Palm Beach County for over 15 years."),
    ("Which West Palm Beach neighborhoods does Harbor serve?",
     "All of West Palm Beach, including El Cid, Flamingo Park, Grandview Heights, Northwood, Prospect Park, SoSo (South of Southern), Downtown and the Flagler Drive waterfront, Palm Beach Lakes and Ibis."),
    ("Is Harbor Tile & Carpet Cleaning insured?", "Yes. Harbor carries $1M+ in liability insurance."),
    ("How do I get a quote for cleaning in West Palm Beach?",
     "Use the Get a Personalized Quote form on this page, or call or text (561) 301-1977 Monday to Saturday, 8:00 AM to 6:00 PM."),
    ("Can Harbor remove pet stains and odors?",
     "Yes. Pet stain and odor removal is offered for carpet, area rugs and upholstery."),
    ("Does Harbor clean yacht interiors in West Palm Beach?",
     "Yes. Harbor offers discreet yacht interior cleaning for salons, staterooms, carpet and upholstery aboard, including Harbor Shield protection."),
    ("Will my carpet feel sticky after cleaning?",
     "No. Harbor's 7-step carpet cleaning process is designed to lift stains and odors without leaving a sticky residue behind."),
    ("What are Harbor's hours?", "Monday to Saturday, 8:00 AM to 6:00 PM. Closed Sunday."),
]

TILE_FAQ = [
    ("What does professional tile and grout cleaning include?",
     "Harbor's tile and grout cleaning follows six steps: a pre-inspection with floor protection, a pre-spray to break down buildup, machine agitation into the grout lines, hot-water extraction to flush out the soil, air movers to speed drying, and a neutral rinse so no residue is left behind. Grout sealing is available as an add-on."),
    ("Do you scrub the grout by hand?",
     "No. Harbor uses a bristle agitation machine to work the cleaning solution into every grout line, then hot-water extraction to rinse the soil away. It reaches deeper and more evenly than hand scrubbing."),
    ("What kinds of tile can you clean?",
     "Porcelain and ceramic tile, travertine and other natural stone, and terracotta, in kitchens, bathrooms, entries, patios and high-traffic commercial spaces."),
    ("Do you seal grout after cleaning?",
     "Yes. Grout sealing is offered after cleaning to help the grout resist new stains and stay brighter for longer."),
    ("Is tile and grout cleaning safe for kids and pets?",
     "Yes. Harbor uses cleaning solutions that are safe for kids and pets, and finishes with a neutral rinse so nothing is left on the floor."),
    ("How much does tile and grout cleaning cost?",
     "Every quote is personalized, because cost depends on the size of the area, the type of tile and the condition of the grout. Request a free personalized quote online or call or text (561) 301-1977."),
    ("Is there a guarantee?", "Yes. Harbor's tile and grout cleaning is backed by a 100% satisfaction guarantee."),
    ("Where do you offer tile and grout cleaning?",
     "Throughout Palm Beach County, including West Palm Beach, Palm Beach, Jupiter, Palm Beach Gardens, Wellington, Boynton Beach, Delray Beach, Boca Raton and Deerfield Beach."),
]

CARPET_FAQ = [
    ("How does Harbor clean carpet?",
     "Harbor cleans carpet in seven steps: a pre-inspection with home protection, a deep vacuum, a pre-spray left to dwell, agitation with an Austrian-engineered bristle machine, hot-water extraction, dry passes to pull out moisture, and air movers to speed drying. The solutions are eco-friendly, non-toxic and safe for pets, and every clean is backed by a 100% satisfaction guarantee."),
    ("Will my carpet feel sticky after cleaning?",
     "No. Harbor's process rinses the fibers with hot-water extraction and finishes with dry passes, so no sticky residue is left behind to attract new dirt."),
    ("How long does carpet take to dry?",
     "Dry passes pull out as much moisture as possible, and air movers are set up to speed drying, so carpet dries fast. Your technician will tell you when the rooms are ready to use."),
    ("Is carpet cleaning safe for kids and pets?",
     "Yes. Harbor uses eco-friendly, non-toxic cleaning solutions that are safe for pets and families."),
    ("Can you remove pet stains and odors from carpet?",
     "Yes. Pet stains and odors are treated as part of Harbor's pet stain and odor removal service, which targets the source rather than masking the smell."),
    ("Do you offer carpet protection?",
     "Yes. An optional fiber protection treatment can be applied after cleaning to help the carpet resist future spills and stains."),
    ("How much does carpet cleaning cost?",
     "Every quote is personalized, because cost depends on the number of rooms, the size of the area and the condition of the carpet. Request a free personalized quote online or call or text (561) 301-1977."),
    ("Is there a guarantee?", "Yes. Harbor's carpet cleaning is backed by a 100% satisfaction guarantee."),
]

RUG_FAQ = [
    ("How much does area rug cleaning cost?",
     "Harbor prices area rug cleaning by the square foot, based on the fiber: $1.50 to $3 for synthetic rugs, $2.50 to $4.50 for natural fibers like wool, cotton and jute, $4 to $6 for delicate fibers like viscose and art silk, and $6 to $10 for fine oriental and silk rugs. Rugs can be cleaned in your home or at Harbor's facility, and every clean is backed by a 100% satisfaction guarantee."),
    ("Do you clean rugs in my home or take them away?",
     "Both. Rugs can be cleaned in your home, or taken to Harbor's facility for a deeper restoration. Delicate, heirloom and heavily soiled rugs usually benefit most from facility cleaning."),
    ("Can you clean viscose and silk rugs?",
     "Yes. Viscose, art silk and silk-highlight rugs are cleaned as delicate fibers, and fine silk rugs as a specialist category, each with methods suited to the fiber."),
    ("Do you clean Persian and oriental rugs?",
     "Yes. Persian, oriental and handmade silk rugs are cleaned as fine rugs, with fiber-matched care."),
    ("What is the difference between a surface clean and a deep wash?",
     "A surface clean is a gentle top-layer extraction that refreshes the pile and colour. A deep wash is a full-immersion restoration that cleans the whole rug, foundation and fringe included."),
    ("Can you remove pet stains and odors from rugs?",
     "Yes. Pet stains and odors in rugs are treated through Harbor's pet stain and odor removal service."),
    ("Do you offer rug protection?",
     "Yes. An optional fiber protection treatment can be applied after cleaning to help the rug resist future spills and stains."),
    ("Is there a guarantee?", "Yes. Harbor's area rug cleaning is backed by a 100% satisfaction guarantee."),
]

UPH_FAQ = [
    ("What upholstery can Harbor clean?",
     "If it has fabric, Harbor can clean it: sofas, sectionals, loveseats, reading chairs, dining chairs, ottomans, mattresses, and outdoor and patio cushions. Every piece goes through a six-step, fabric-safe process that lifts embedded dirt and body oils, stains, odors and pet hair, backed by a 100% satisfaction guarantee."),
    ("Is upholstery cleaning safe for delicate fabrics?",
     "Yes. Harbor uses fabric-safe solutions and gentle machine agitation, and checks each fabric before cleaning."),
    ("Do you clean mattresses?",
     "Yes. Mattress cleaning removes allergens, dust mites and the buildup that collects in a mattress over time."),
    ("Can you clean outdoor furniture and patio cushions?",
     "Yes. Outdoor furniture and patio cushions are cleaned with the same fabric-safe process."),
    ("Can you remove pet hair, stains and odors?",
     "Yes. Upholstery cleaning lifts pet hair, stains and odors, and stubborn pet accidents are treated through Harbor's pet stain and odor removal service."),
    ("How long does upholstery take to dry?",
     "Air movers are set up to speed drying, so furniture is back in use sooner. Your technician will tell you when each piece is ready."),
    ("How much does upholstery cleaning cost?",
     "Every quote is personalized, because cost depends on the number and size of the pieces and the fabric. Request a free personalized quote online or call or text (561) 301-1977."),
    ("Is there a guarantee?", "Yes. Harbor's upholstery cleaning is backed by a 100% satisfaction guarantee."),
]

PET_FAQ = [
    ('How does Harbor remove pet stains and odors?',
     'Harbor uses enzyme-based cleaners that break down the bacteria behind pet odors at the source, instead of covering them with fragrance, and UV light to find hidden stains you cannot see in normal light. Treatment reaches deep to neutralize urine and waste odors, the solutions are non-toxic and safe for pets and families, and it works on carpet, area rugs, upholstery, mattresses and tile and grout.'),
    ('Is pet stain and odor removal safe for my pets and kids?',
     'Yes. Harbor uses non-toxic, pet-safe solutions that are gentle enough for every member of the household.'),
    ('Can you find pet stains I cannot see?',
     'Yes. Harbor uses UV light detection to reveal hidden pet stains that are invisible in normal light, so they can be treated too.'),
    ('Do you just cover up the smell?',
     'No. Enzyme-based cleaners break down the odor-causing bacteria at the source, rather than masking the smell with fragrance.'),
    ('What surfaces can you treat for pet stains and odors?',
     'Carpet, area rugs including wool, synthetic and oriental, upholstery and mattresses, and tile and grout, where odors can become trapped in porous grout.'),
    ('Can pet odors be removed from tile and grout?',
     'Yes. Grout is porous and can hold pet odors, so it is treated along with the tile surface.'),
    ('How much does pet stain and odor removal cost?',
     'Every quote is personalized, because cost depends on the surfaces, the size of the affected areas and how old the stains are. Request a free personalized quote online or call or text (561) 301-1977.'),
    ('Is there a guarantee?',
     "Yes. Harbor's pet stain and odor removal is backed by a 100% satisfaction guarantee."),
]

YACHT_FAQ = [
    ('What does yacht interior cleaning include?',
     "Harbor's yacht interior cleaning covers the salon and staterooms: removable rugs and snap-in carpet, built-in seating, upholstered walls and soft furnishings, stain and odor treatment, and mattresses. Rugs, snap-in carpet and mattresses can be cleaned off-site to keep disruption aboard to a minimum, and Harbor Shield, an EPA-registered, non-toxic biostatic treatment, protects against mold, mildew and odor-causing bacteria."),
    ('Do you clean aboard, or take items off the boat?',
     "Both. Upholstery, built-in seating and upholstered walls are cleaned aboard, while removable rugs, snap-in carpet and mattresses can be cleaned off-site at Harbor's facility to minimize disruption on the vessel."),
    ('What is Harbor Shield?',
     'Harbor Shield is an EPA-registered, non-toxic biostatic treatment that protects against mold, mildew, algae, fungus and odor-causing bacteria. It can be applied to mattresses, outdoor furniture, life vests, wetsuits and water toys.'),
    ('Can you clean viscose and delicate rugs aboard a yacht?',
     'Yes. Delicate fibers such as viscose are cleaned off-site with methods suited to the fiber.'),
    ('How quickly does everything dry?',
     "Harbor's equipment dries carpet and upholstery in hours rather than days, so the vessel is back in use quickly."),
    ('What products do you use on board?',
     'High-end, low-toxicity products that will not damage fine finishes and fabrics, and all tools are sanitized after each use.'),
    ('Can you respond quickly to a spill or odor aboard?',
     'Yes. Stain and odor treatment is offered with a fast response, with discretion for owners, captains and crew.'),
    ('Where do you clean yachts?',
     'Throughout Palm Beach County and the surrounding coastal communities, including West Palm Beach, Palm Beach, Jupiter, Palm Beach Gardens, Boynton Beach, Delray Beach and Boca Raton.'),
]

PAGES = [
    {
        "file": "index.html",
        "url": SITE + "/",
        "name": "Harbor Tile & Carpet Cleaning · Palm Beach County",
        "description": "Tile and grout, carpet, area rug, upholstery and yacht interior cleaning from Deerfield Beach to Jupiter.",
        "image": ("/assets/foyer-clean.webp", 1920, 1084, "A Palm Beach foyer with a freshly cleaned limestone tile floor"),
        "trail": [("Home", None)],
        "faq": None,
        "speakable": None,
    },
    {
        "file": "service-areas/west-palm-beach/index.html",
        "url": SITE + "/service-areas/west-palm-beach/",
        "name": "Tile, Carpet & Upholstery Cleaning in West Palm Beach, FL",
        "description": "Locally owned in West Palm Beach. Tile and grout, carpet, area rug, upholstery, pet stain and yacht interior cleaning.",
        "image": ("/assets/wpb-clean.webp", 1920, 1084, "A restored 1920s Mediterranean Revival entry hall in West Palm Beach with clean patterned cement tile floors"),
        "trail": [("Home", SITE + "/"), ("Service areas", None), ("West Palm Beach", SITE + "/service-areas/west-palm-beach/")],
        "faq": WPB_FAQ,
        "speakable": ["#answer"],
        "city": "West Palm Beach",
    },
    {
        "file": "tile-grout-cleaning/index.html",
        "url": SITE + "/tile-grout-cleaning/",
        "name": "Tile & Grout Cleaning in Palm Beach County",
        "description": "Six-step tile and grout cleaning with machine agitation, hot-water extraction and optional grout sealing, from Harbor Tile & Carpet Cleaning.",
        "image": ("/assets/kitchen-clean.webp", 1920, 1084, "A Palm Beach kitchen with clean travertine tile and bright grout lines"),
        "trail": [("Home", SITE + "/"), ("Services", None), ("Tile & Grout Cleaning", SITE + "/tile-grout-cleaning/")],
        "faq": TILE_FAQ,
        "speakable": ["#answer"],
        "service": "tile-grout",
    },
    {
        "file": "carpet-cleaning/index.html",
        "url": SITE + "/carpet-cleaning/",
        "name": "Carpet Cleaning in Palm Beach County",
        "description": "Seven-step hot-water extraction carpet cleaning with eco-friendly, pet-safe solutions and no sticky residue, from Harbor Tile & Carpet Cleaning.",
        "image": ("/assets/bedroom-clean.webp", 1920, 1084, "A bright Palm Beach bedroom with clean, plush ivory wall-to-wall carpet"),
        "trail": [("Home", SITE + "/"), ("Services", None), ("Carpet Cleaning", SITE + "/carpet-cleaning/")],
        "faq": CARPET_FAQ,
        "speakable": ["#answer"],
        "service": "carpet",
    },
    {
        "file": "area-rug-cleaning/index.html",
        "url": SITE + "/area-rug-cleaning/",
        "name": "Area Rug Cleaning in Palm Beach County",
        "description": "Area rug cleaning for synthetic, wool, viscose, oriental and silk rugs, in your home or at Harbor's facility, priced by fiber from $1.50 per square foot.",
        "image": ("/assets/rug-clean.webp", 1920, 1084, "A Palm Beach living room with a clean, richly coloured hand-knotted Persian rug"),
        "trail": [("Home", SITE + "/"), ("Services", None), ("Area Rug Cleaning", SITE + "/area-rug-cleaning/")],
        "faq": RUG_FAQ,
        "speakable": ["#answer"],
        "service": "area-rug",
    },
    {
        "file": "upholstery-cleaning/index.html",
        "url": SITE + "/upholstery-cleaning/",
        "name": "Upholstery Cleaning in Palm Beach County",
        "description": "Six-step, fabric-safe upholstery cleaning for sofas, sectionals, chairs, mattresses and outdoor cushions, from Harbor Tile & Carpet Cleaning.",
        "image": ("/assets/sofa-clean.webp", 1920, 1084, "A bright Palm Beach family room with a clean ivory linen sectional"),
        "trail": [("Home", SITE + "/"), ("Services", None), ("Upholstery Cleaning", SITE + "/upholstery-cleaning/")],
        "faq": UPH_FAQ,
        "speakable": ["#answer"],
        "service": "upholstery",
    },
    {
        "file": "pet-stain-odor-removal/index.html",
        "url": SITE + "/pet-stain-odor-removal/",
        "name": "Pet Stain & Odor Removal in Palm Beach County",
        "description": "Enzyme treatment and UV detection remove pet stains and odors from carpet, rugs, upholstery and tile, with non-toxic, pet-safe solutions.",
        "image": ("/assets/pet-clean.webp", 1920, 1084, "A calm Palm Beach family room with clean cream carpet and a golden retriever"),
        "trail": [("Home", SITE + "/"), ("Services", None), ("Pet Stain & Odor Removal", SITE + "/pet-stain-odor-removal/")],
        "faq": PET_FAQ,
        "speakable": ["#answer"],
        "service": "pet-stain-odor",
    },
    {
        "file": "yacht-interior-cleaning/index.html",
        "url": SITE + "/yacht-interior-cleaning/",
        "name": "Yacht Interior Cleaning in Palm Beach County",
        "description": "Discreet yacht interior cleaning for salons, staterooms, carpet, upholstery and mattresses, with Harbor Shield protection against mold and mildew.",
        "image": ("/assets/yacht-clean.webp", 1920, 1084, "The bright main salon of a luxury motor yacht"),
        "trail": [("Home", SITE + "/"), ("Services", None), ("Yacht Interior Cleaning", SITE + "/yacht-interior-cleaning/")],
        "faq": YACHT_FAQ,
        "speakable": ["#answer"],
        "service": "yacht-interior",
    },
]

# The owners, named as on Harbor's About Us page (no surnames are published).
OWNERS = [{"@type": "Person", "@id": SITE + "/about-us/#" + n.lower(), "name": n,
           "jobTitle": "Owner", "worksFor": {"@id": BIZ}} for n in ("Jennifer", "Jonny")]
PAGES.append({
    "file": "about-us/index.html",
    "url": SITE + "/about-us/",
    "type": ["WebPage", "AboutPage"],
    "name": "About Us: Meet Jennifer & Jonny",
    "description": "Meet Jennifer and Jonny, the owners of Harbor Tile & Carpet Cleaning: premium, pet-safe cleaning, a relentless focus on quality and unreasonable hospitality.",
    "image": ("/assets/owners.webp", 1920, 1292, "Jennifer and Jonny, the owners of Harbor Tile & Carpet Cleaning, with their dog"),
    "trail": [("Home", SITE + "/"), ("About us", SITE + "/about-us/")],
    "faq": None,
    "speakable": ["#answer"],
    "extra": OWNERS,
    "subjectOf": {"@type": "Article", "headline": "Meet Jennifer and Jonny of Harbor Tile & Carpet Cleaning",
                  "url": "https://voyagemia.com/interview/meet-jennifer-and-jonny-of-harbor-tile-carpet-cleaning/",
                  "datePublished": "2024-10-31", "publisher": {"@type": "Organization", "name": "VoyageMIA"},
                  "about": {"@id": BIZ}},
})
PAGES += CITY_PAGES

def graph_for(page):
    url = page["url"]
    img_path, w, h, cap = page["image"]
    img = {"@type": "ImageObject", "@id": url + "#primaryimage", "url": SITE + img_path,
           "contentUrl": SITE + img_path, "width": w, "height": h, "caption": cap}
    webpage = {
        "@type": page.get("type", "WebPage"), "@id": url + "#webpage", "url": url, "name": page["name"],
        "description": page["description"], "inLanguage": "en-US",
        "isPartOf": {"@id": WEB}, "about": {"@id": BIZ},
        "primaryImageOfPage": {"@id": url + "#primaryimage"},
        "breadcrumb": {"@id": url + "#breadcrumb"},
        "mentions": [{"@id": SITE + "/#service-" + s[0]} for s in SERVICES],
        "potentialAction": [{"@type": "ContactAction", "name": "Get a Personalized Quote",
                             "target": url + "#quote"}],
    }
    if page.get("service"):
        webpage["about"] = [{"@id": BIZ}, {"@id": SITE + "/#service-" + page["service"]}]
    if page.get("city"):
        webpage["spatialCoverage"] = city(page["city"])
    if page.get("speakable"):
        webpage["speakable"] = {"@type": "SpeakableSpecification", "cssSelector": page["speakable"]}
    nodes = [business(), website(), webpage, img, crumbs(url, page["trail"])] + service_nodes()
    if page.get("extra"):
        webpage["mainEntity"] = [{"@id": n["@id"]} for n in page["extra"]]
        nodes += page["extra"]
    if page.get("subjectOf"):
        nodes.append(page["subjectOf"])
    if page.get("faq"):
        webpage["mainEntity"] = {"@id": url + "#faq"}
        nodes.append(faq_node(url, page["faq"]))
    return {"@context": "https://schema.org", "@graph": nodes}

def strip_empty(o):
    if isinstance(o, dict):
        return {k: strip_empty(v) for k, v in o.items() if v not in ([], None, "")}
    if isinstance(o, list):
        return [strip_empty(v) for v in o]
    return o

ROOT = pathlib.Path(__file__).resolve().parent.parent
BLOCK = re.compile(r"<!-- schema:start -->.*?<!-- schema:end -->", re.S)

for page in PAGES:
    f = ROOT / page["file"]
    html = f.read_text()
    data = json.dumps(strip_empty(graph_for(page)), indent=1, ensure_ascii=False)
    block = "<!-- schema:start -->\n<script type=\"application/ld+json\">\n" + data + "\n</script>\n<!-- schema:end -->"
    if BLOCK.search(html):
        html = BLOCK.sub(lambda m: block, html)
    else:
        # first run: replace any hand-written JSON-LD, else insert before </head>
        old = re.compile(r"<script type=\"application/ld\+json\">.*?</script>\n?", re.S)
        html = old.sub(lambda m: block + "\n", html, count=1) if old.search(html) else html.replace("</head>", block + "\n</head>", 1)
    f.write_text(html)
    print(f"{page['file']}: {len(graph_for(page)['@graph'])} nodes")
