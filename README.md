# Harbor Tile & Carpet Cleaning website

A static site for Harbor Tile & Carpet Cleaning (West Palm Beach, FL), built with
the scroll-craft engine (`scrollcraft.js` / `scrollcraft.css`, not edited per project).

## Pages
- `/`: scroll-driven homepage (dirty-to-clean room tour, quote form)
- Services: `/tile-grout-cleaning/`, `/carpet-cleaning/`, `/area-rug-cleaning/`,
  `/upholstery-cleaning/`, `/pet-stain-odor-removal/`, `/yacht-interior-cleaning/`
- Service areas: `/service-areas/<city>/` (West Palm Beach, Palm Beach, Jupiter,
  Wellington, Delray Beach, Boynton Beach)
- `/about-us/`

## Generators (run from this folder after changing a page)
```
python3 tools/cities.py   # rebuild city pages from the West Palm Beach template
python3 tools/nav.py      # header menu, footer towns and "near you" lists
python3 tools/schema.py   # last: validated JSON-LD on every page, plus robots.txt,
                          # llms.txt, llms-full.txt and sitemap.xml (schema-markup skill;
                          # facts in schema.config.json)
```

## Preview
```
npx serve -l 4500 .
```

## Tests
`npm install`, then the Playwright scripts in `lab/` (e.g. `node lab/sem.mjs` for
the accessibility scan, `node lab/city.mjs` for city pages).
