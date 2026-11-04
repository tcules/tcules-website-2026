# /future-interfaces-lab — designed, branch design/careers-lab-matter (local), 4 Nov 2026

Tracker 2.35. Composed from the library through OfferPage's plan (`ROUTES.futureInterfacesLab` was already in
`PASS_1_COMPOSED_ROUTES`). Copy: `_pages/future-interfaces-lab.md`, rendered as authored. Job of the page: a
buyer, a peer or a would-be collaborator sees what the Lab is experimenting with and what each artefact is,
then candidates go to the Lab application page and product owners to /contact. The two experiment sets are the
page's weight; purpose, direction, threshold and promotion stay quiet.

## Decisions
- Hero: beside, the register's labelled placeholder (`/future-interfaces-lab#hero`, 5:4) until the Lab hero
  illustration is drawn; the studio working wall was dropped after the critic (below). "Join the Lab" is the
  page's one blue solid. No record figures (the copy has none).
- `purpose`: the short intro, C-text, unchanged.
- `direction`: illustrated prose (B), the id joins `ILLUSTRATED_PROSE` (plan.ts). The Lab's thesis is an
  abstract claim, so one band-scale isometric illustration; labelled placeholder until drawn (register row
  "Where we think software interfaces are heading"). It also keeps `purpose` from touching a prose band.
- `design-work`: Bento drawn tiles, four across (2 + 2 below 1024, one per row on a phone), one still flat
  drawing per tool, new in `components/Sketch/wyg-future-interfaces-lab.tsx`: a library feeding a screen's
  button (Matter), a reviewed screen sorted into three bins with "fix first" lit (audit agent), a boxed pattern
  whose one tag a cursor and a machine both read (labelling tool), a landing page with three margin notes,
  "change" lit (audit programme). Matter's tile is the link to /matter-design-system (its paragraph's
  "See Matter Design System →"); the other three are still tiles. Its drawing moves on hover (the route draws,
  the pill fills); the still tiles hold finished.
- `ai-interfaces`: three covered cards (C-image), each the experiment's own image from the live site, copied
  to `public/future-interfaces-lab/` and keyed by title in `ITEM_COVERS`: the node canvas (Open Canvas), two
  students using the tutor on a tablet (photograph), the shopping assistant's phone screens. Not linked
  (the copy links none). Whole set visible at every width.
- `threshold`: C-text, unchanged; the breath between the covers and the drawn promotion.
- `promotion`: the sentence (four inline links as authored) beside one flat figure from 1024
  (`CloseFigureBand`): the experiment in the Lab, one route branching to four frames (a method sheet, a tool,
  a definition, a case study). Its scene is `promotion.figure`, so the plan reads it as visual and flat.
- `faq`: D-faq, unchanged.
- `join` + `talk`: ONE ink island in two peer halves (CtaSection `open` with the new `second` ask; plan.ts
  `PAIRED_CLOSES`). Start half: "Apply to work on Lab projects", its sentence as the lede word for word, the
  link's words "Lab application page" as the island's solid. End half (id `talk`): "Talk to us", its two
  sentences as the lede, "contact page" as a blue link with its arrow. Actions pinned to each half's foot so they
  share a line. `talk` is listed in `BANDS_ELSEWHERE`. Stacked below 1024.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, placeholder 5:4 | eyebrow suppressed under the breadcrumb |
| purpose | close · C-text | no link, so prose |
| direction | text · illustrated prose (B), isometric placeholder | image at the start |
| design-work | destinations · Bento drawn tiles (C-icon), 4 across | Matter tile linked |
| ai-interfaces | destinations · BlockCardSet covers (C-image), 3 across | not linked |
| threshold | text · C-text | |
| promotion | close · C-text beside one flat figure | links inline |
| faq | faq · D-faq | |
| join (+ talk) | close · L, ink island in two halves | talk in BANDS_ELSEWHERE |

Rhythm at a squint: photo split hero; a short line; illustration split; four drawn tiles; three photographic
covers; a two-paragraph text band; a sentence beside a drawing; the centred accordion; a dark island in halves.
Registers: photo, none, isometric, flat, photo, none, flat, none, island. No tint, no text-heavy pair.

## Content mapping
- No copy changed. The Matter tile's "See Matter Design System →" is the tile's destination and is printed as
  its foot action (Bento item `action`), so the copy reaches the page whole.
- The island ledes keep the link words as plain words in the sentence; the links' own words are the actions.
- Cover alts are the live site's alts.

## Open
- **New variant of the destinations kind (design-work):** still drawn Bento tiles with page-assigned scenes and
  one linked tile, read drawing first (new Bento `visual="start"`) with the linked tile's foot action (new
  Bento item `action`). Owner to confirm both Bento additions. Tile bodies run 130–200 characters against Bento's 60–90 guide; kept whole,
  plates end on one line at 1440.
- **New variant of the destinations kind (ai-interfaces):** per-item covers from a route map, no links, at the
  card's `sm` title step so the two experiment sets carry equal weight. Owner to confirm.
- **New arrangement of the close (promotion):** prose beside one flat figure. Owner to confirm.
- **New CtaSection variant + band move (join/talk):** two asks on one island (`second`), specimen 3a on
  /design/cta-section. The boldest of the four. Fallback if rejected: `join` becomes prose beside a drawing and
  `talk` the lone island; that needs a CloseBand rule for "one sentence whose one link is the action", checked
  across the other close bands first.
- The Open Canvas image is named `blog_dummy_1` on the live CMS: owner to confirm it is the experiment's real
  image; if not, the set falls back to drawings (one register).
- The tutor image looks like it may be generated (the tablet's UI text): owner to confirm it is a real
  photograph of the experiment. It carries a baked white vignette at its lower corners.
- The three covers are 698 × 481 masters, about 392 CSS px wide at 1440: soft on a 2x screen. The live CMS holds
  nothing larger (checked 4 Nov), and Open Canvas's chips and the shopping phones are cut by the source's own
  crop, so they cannot be reframed here. **Owner question:** re-export the two UI renders at 800+ wide with the
  subject whole, or make the set all screens (the tutor as its tablet screen), or keep the photo with them.
- Live images rejected after viewing: AI Design Audit Agent (type set in the image, another illustration
  style), UI Pattern labelling (abstract shapes), Landing Page Audit (an unrelated email list), the generic
  Labs_* renders (not Tcules work). Real captures of the three internal tools could later replace the drawings.
- The five drawings were drawn and checked by eye in this run; the blind `flat-drawings-pages` critic was not
  run, so a blind check is still owed.
- Isometric art for `direction` and the hero (both placeholders; people draw these). Until then a phone opens
  on two placeholders a short paragraph apart: the hero's, then `direction`'s, which ContentSection's `media`
  arrangement puts above the head below 1024 (critic nit: left, a component change for every media band).
- `purpose` is three sentences in a full band (critic nit): it could take the band's lead slot so it reads as a
  statement. Left for the owner; a figure on `threshold` would put two flat bands side by side.
- og/twitter image: `IMAGE_ASSET_REQUIRED` in the copy.

## Fixed after the critic (4 Nov 2026, 6.5/10)
- Matter's tile dropped "See Matter Design System →"; nothing visible said it was the one link → the C-icon
  renderer took the trailing link as the href and threw its label away, and Bento had no foot action for a
  single tile → Bento item `action` (link Button as a span, the tile still the one anchor, `data-btn-link-group`);
  DestinationsBand passes the trailing link's words as authored. Only items whose paragraph ends on a "→" link
  take it (the path that strips it from the body); link-line items elsewhere are unchanged.
- Hero photo ran past the fold and showed a design workshop, shared with two other heroes → images.ts bound
  `ABOUT_WALL` to the route → binding removed; the hero takes a registered 5:4 placeholder (Lab bench concept).
  The fix's other half, a fixed hero frame, was NOT applied: hero media sits at its intrinsic ratio, never
  cropped (decisions/2026-09-28-hero-media-at-intrinsic-ratio). The live Lab page has no Lab picture.
- The two experiment sets, halves of one list, had unequal weight (18px boxed titles under 22px open ones, drawings
  at the foot vs images at the top) → two kind components with different title steps and media order → the
  covered set takes BlockCard `size="sm"` (Bento's h5 step) and the drawn set Bento's new `visual="start"`
  (drawing, title, body, action pinned). 4-up and 3-up kept, so the bands still differ in shape.
- The Talk half's action started 12 inside its column → CtaSection's lone `partner` was a ghost, whose box
  inset moves the label off the edge → a lone partner is a link button (label on the edge). Only the `second`
  ask uses `partner`.
- Not fixed: the two weak UI renders (no larger originals; owner question in Open); purpose's thin band and the
  phone placement of direction's placeholder (Open).


## Pass 2, owner review 4 Nov
- **"See Matter Design System →" feels broken when wrapping** (Matter tile, four across) → cause: a bare
  link (`Button emphasis="link"`) wrapped greedily, so the first line filled and "SYSTEM →" hung alone under
  it, reading as a label that ran out of room. The arrow already stayed with the last word (GluedLabel).
  Fix, GLOBAL at the component: `.link` takes `text-wrap: var(--text-title-wrap)` (balance), so a wrapped
  link breaks into near-equal lines ("SEE MATTER / DESIGN SYSTEM →"); one-line links are unchanged. The
  label is the copy's, not shortened. Checked on `/` at 390 (case cards' "Read the Benchmark Gensuite
  case", "See a typical AI-assisted design run") and `/about` at 390 ("Rakesh Chitroda on LinkedIn"):
  all now break into balanced pairs and read as set. `/product-design` and `/careers` have no wrapping
  link at 1440 or 390.
- **Promotion: "why isn't the title simply in the left side area with the body?"** → cause: CloseFigureBand
  put the band head across the top and a halves Layout (words | figure, centred) under it, so the sentence
  sat alone low-left beside the figure. Fix, GLOBAL for the arrangement: ContentSection's `media` split now
  takes a flat `drawing` as well as a photograph (`media.drawing`): head AND body in the copy column, the
  figure in the other half, 96 apart (a split), top edges shared (decisions/2026-10-11-secondary-anchored-to-primary),
  the figure at its own ratio, never cropped; below 1024 the words come first and the figure follows.
  CloseFigureBand renders through it (head at the band's h2 step). It is the only close with a figure
  today (offer-scenes-pages: `promotion.figure`), so no other page changes; every photo media split is
  untouched (the drawing branch is separate). **New ContentSection option, owner to confirm** (no specimen
  block yet on /design/content-section).
- **After the merge of main:** the FAQ renders beside in halves (decisions/2026-11-04-faq-beside-in-halves).
  The page has no Why Tcules, Three ways or industries band, so those rulings do not apply here. Nothing
  from the merge broke the page (shots at 1440 and 390, no overflow, no page errors).
- **Critic, pass 2 (7.5/10), fixes:**
  - Matter tile's foot link still wrapped at 1100–1440 (236 label in a 236 column at 1440) → cause: a
    single tile's foot action was set at the band's link size (md, 13) inside a four-across card column.
    Fix, at Bento (single, non-wide tile `action` only): the link Button's `sm` (12, Button's "dense grid
    cell" size); one line, 218 wide, at 1280, 1440 and 390; the balanced wrap stays the fallback at
    1024–1100. A wide tile keeps md. Only this page authors a tile `action`; CTA cards, split-tile
    `detail.action` and ServiceTile actions are untouched (no change on the audits, tools or listings
    pages), checked on /design/bento.
  - Close island: the solid and the bare link ended on one foot, so the link's label sat 12 under the
    solid's → cause: the pinned action rows had their controls' own heights. Fix, GLOBAL in CtaSection's
    paired close (`second`): each action row is one md box tall (`--cta-pair-action-block-size`, 40,
    duplicated from the button on purpose) with its control centred; both centres now measure equal at
    1024–1440. Stacked, the two routes part at `column` (64) instead of `stack` (48), so the second
    reads as its own door. Only /future-interfaces-lab pairs closes today (plan.ts PAIRED_CLOSES);
    /careers and /future-interfaces-lab/join do not use the pair and are unchanged; /design/cta-section
    shot clean.
  - Skipped: labelling the promotion figure's four rows with words (the flat grammar sets no words
    inside a drawing, and brand imagery carries no type); its hub is the shared `Focus` mark every flat
    scene uses, so dropping its halo is a grammar question for the owner, not this page. Skipped: one
    fixed-size placeholder label (scripts/placeholders.mjs renders text in SVG units); that is a
    site-wide placeholder change, left in Open.

## Pass 3, owner review 4 Nov 2026
- Alternating grounds (decisions/2026-11-04-lab-pages-alternate-grounds): purpose, design-work, threshold and
  the FAQ on tint; the closing island on paper. Cause: the band renderers took no ground from the plan, so
  every band was paper. Fix: plan.ts `ALTERNATE_GROUNDS`, and `surface` threaded through TextBand,
  CloseBand, CloseFigureBand, DestinationsBand, SheetBand, MethodBand, GlyphTilesBand and the FAQ (global
  plumbing; only routes in the set change).
