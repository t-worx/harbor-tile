# Harbor Tile & Carpet Cleaning: BRIEF

Interviewed, 2026-09-30 (Tracy, for Harbor). Verbatim answers are quoted;
authored decisions are labelled **Authored**.

Redo of https://harbortc.com/. User framing: "premium, trusted ... modern and
cutting edge for a tile and carpet cleaning company in south florida, but not
too-off-the-deep-end tech ... look premium."

## The eight topics

1. **Vibe:** "Upscale, warm, trustworthy." No references given.
2. **Journey, in their words:** "Tell a story through the scroll." Sequence
   authored below as a walk through one home.
3. **Energy curve:** "Calm - the page should hit hardest in the hero with a
   'Get a Personalized Quote' CTA."
4. **Feeling and the one moment:** "The grout and tile, carpets, and
   upholstery going from dirty to sparkling clean when I scroll."
5. **Only-this-site:** "Tell a story through the scroll."
6. **Range:** "Premium, warm and dense - Harbor's target customers are along
   the east coast (A1A) from Deerfield beach to Jupiter."
7. **World vs scenes:** "I like the idea of a camera flight through a home and
   distinct scenes, find a happy medium."
8. **Assets:** "Several Photos." 43 real job photos (phone quality: finished
   floors, rugs, upholstery, yacht salons, team, vans, customers' dogs), the
   HarborTC logo (pit bull mascot on a turquoise disc, outlined wordmark).

## Business

- **Who:** "Palm Beach homeowners with high-end homes, yacht owners."
- **Believe by the end:** "Harbor Tile & Carpet Cleaning is the absolute best
  choice for whole house tile, carpet, and upholstery cleaning, and yacht
  interior cleaning."
- **One action, one label:** "Get a Personalized Quote". Used everywhere.
- **Mascot:** "keep it as a small signature mark".
- **Palette:** "keep the same color palette" (logo turquoise, ink outline,
  white, the dog's warm brown).
- **Real numbers only:** 240 five-star Google reviews; over 15 years in
  business (user correction mid-session: "Use over 15"); $1M+ liability
  insurance; $1M+ saved in potential replacement costs.
- **Facts from the current site / profile:** (561) 301-1977 call or text,
  service@harbortc.com, Mon to Sat 8 to 6, 7-step carpet process, Harbor
  Shield for yacht interiors. Services: carpet, area rugs, tile & grout,
  upholstery & mattresses, pet stain & odor, yacht interiors, pressure washing.
  Area: West Palm Beach, Palm Beach Island, Jupiter, Palm Beach Gardens,
  Wellington, Boynton, Delray, Boca, up the A1A corridor from Deerfield Beach.
- Business context (from notes): converting leads is the most pressing issue.
  The page's job is a qualified quote request, not browsing.

## Authored decisions

- **Grammar: House tour** (new; constraints below). The happy medium between
  one continuous flight and distinct scenes. User follow-up: "how cool it would
  be if the scenes were something like a drone fly through, starting with the
  front of the house, flying through the open door and foyer, towards the end,
  flying through the yacht and ending with a full wide angle of the home."
  So the tour is bookended by two drone flights (the page's only two scrubs):
  in through the front doors, and out through the yacht to the whole estate.
  The rooms between are distinct scenes.
- **World:** photographic, architectural interiors in natural late sun. The
  preamble is in PROMPTS.md and reused verbatim.
- **Signature move: the Harbor pass.** Surfaces clean under the scroll in the
  pattern Harbor's tools actually make: rotary swirl rows across tile, straight
  extraction-wand lanes across carpet, with a soft sheen riding the working
  edge. Bespoke canvas mask over an aligned dirty/clean photo pair, driven by
  `--sc-p`. Nothing in the kit does this.
- **Useful interaction: the quote list.** Each room carries "Add to my quote".
  The nav keeps count, and the closing form arrives pre-filled with the rooms
  the visitor chose.

### Grammar: House tour

- **Unit:** a room. Every act is a place in one home; no abstract type-only acts.
- **Joins:** a camera walk-through (scrub) or a doorway wipe between rooms,
  never a crossfade to an empty ground.
- **Nav:** a room index (Foyer, Great room, Our work, The team, The dock) that
  marks where you are and jumps, plus the phone number and the one CTA.
- **Hero:** stepping inside the front door. The establishing room, already lit.
- **Close:** the last place on the tour, the dock at golden hour. The quote
  form lives there, in that place.
- **Forbids:** section counters; centred hero copy; cards as page structure;
  a footer that trails off after the close; more than two scrubs; stock
  lifestyle people (the only people are the real Harbor team).

## Journey

```
1  Arrival      the drone flies you in through the front doors, and the foyer floor comes back to life
2  Passage      the camera walks you through the arch: every room, one visit
3  Comfort      the great room carpet, traffic lanes and a pet spot, lifted pass by pass
4  Proof        a hallway of real Harbor jobs, labelled plainly
5  Assurance    the people, the numbers, the coastline they cover
6  Homecoming   through the yacht and out over the water to the whole estate; the quote, pre-filled
```

## Feeling curve

```
1  Anticipation → delight  the approach and the doors; the tired foyer holds; then the floor cleans
                         in rotary rows under your hand and the light comes up (PEAK)
2  Ease                  a slow walk-through into the next room, nothing to do
3  Relief                wand lanes lift the traffic pattern and the pet stain
4  Trust                 real photographs, real homes, labels not slogans
5  Confidence            240 reviews, 15+ years, $1M+ insured, the team's faces
6  Resolve               the camera pulls back to the whole house; one form, already yours
```

## The peak

> "The floor literally got cleaned while I scrolled, row by row, like the
> machine was going over it."

Lives in act 1 (the hero, largest span). The user asked for the hardest hit in
the hero, so the peak is there: the first screen holds still for its first
~12% of travel (authored silence, not dead scroll), then the pass begins.

## It's the site where...

> it's the site where you scroll and watch a Palm Beach foyer get cleaned tile
> row by tile row, then the carpet in those perfect fresh-clean stripes.

## Authored silence

- Act 1: the drone lands on the dirty foyer and holds on it briefly before the
  first pass begins. Intentional; the transformation needs a before.

## Revision, 2026-09-30: drone flight dropped

User, after the drone clips: "I'm not liking the drone shots. Let's try your
original concept. When going from dirty to clean, the transitions need to be
smooth." Also: "I do want the dirty-to-clean transitions."

Final build uses no AI video. All motion is scroll-driven photography: the
foyer pushes in while the front-door frames slide apart (four planes), the
great room opens through an arch, the estate settles back at the close.
Smoothness: the pass progress eases toward the scroll target every frame
(lerp 0.12) and the dirty/clean boundary is a blurred low-resolution mask, so
there are no hard edges and no stepping between wheel notches.

Final order (variety law: no device twice in a row):

```
1  Foyer       pin, 3.6vh   the peak: rotary rows clean the stone, far end first
2  Our work    pan, 3.3vh   the hallway wall of real Harbor photographs
3  Great room  pin, 2.7vh   arch opens; wand lanes lift the carpet, then the sofa
4  The team    flow         the crew, 240 reviews, 15+ years, $1M+ x2, the coast
5  The dock    pin, 2.0vh   the estate from the water; yacht line; the quote
```
Total ~13.2 viewport-heights. Feeling curve unchanged in intent; act 2 is now
Trust (proof) and act 3 Relief, which keeps adjacent feelings distinct.
