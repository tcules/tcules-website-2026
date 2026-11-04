# /future-interfaces-lab — designed, branch design/careers-lab-matter (local), 4 Nov 2026

Tracker 2.35. Composed from the library through OfferPage's plan (`ROUTES.futureInterfacesLab` was already in
`PASS_1_COMPOSED_ROUTES`). Copy: `_pages/future-interfaces-lab.md`, rendered as authored. Job of the page: a
buyer, a peer or a would-be collaborator sees what the Lab is experimenting with and what each artefact is,
then candidates go to the Lab application page and product owners to /contact. The two experiment sets are the
page's weight; purpose, direction, threshold and promotion stay quiet.

## Decisions
- Hero: beside, the studio working wall (`STUDIO_HERO[futureInterfacesLab] = ABOUT_WALL`): hands placing notes
  on a discovery wall, work in progress. Not one experiment's capture: an image about one item belongs to that
  item. "Join the Lab" is the page's one blue solid. No record figures (the copy has none).
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
  sentences as the lede, "contact page" as the outline partner. Actions pinned to each half's foot so they
  share a line. `talk` is listed in `BANDS_ELSEWHERE`. Stacked below 1024.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, ABOUT_WALL | eyebrow suppressed under the breadcrumb |
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
- No copy changed. The Matter tile's "See Matter Design System →" is the tile's destination; its words are not
  printed (Bento bodies are plain text), the tile title "Matter Design System" names the page it opens.
- The island ledes keep the link words as plain words in the sentence; the links' own words are the actions.
- Cover alts are the live site's alts.

## Open
- **New variant of the destinations kind (design-work):** still drawn Bento tiles with page-assigned scenes and
  one linked tile. Owner to confirm. Tile bodies run 130–200 characters against Bento's 60–90 guide; kept whole,
  plates end on one line at 1440.
- **New variant of the destinations kind (ai-interfaces):** per-item covers from a route map, no links. Owner to
  confirm.
- **New arrangement of the close (promotion):** prose beside one flat figure. Owner to confirm.
- **New CtaSection variant + band move (join/talk):** two asks on one island (`second`), specimen 3a on
  /design/cta-section. The boldest of the four. Fallback if rejected: `join` becomes prose beside a drawing and
  `talk` the lone island; that needs a CloseBand rule for "one sentence whose one link is the action", checked
  across the other close bands first.
- The Open Canvas image is named `blog_dummy_1` on the live CMS: owner to confirm it is the experiment's real
  image; if not, the set falls back to drawings (one register).
- The tutor image looks like it may be generated (the tablet's UI text): owner to confirm it is a real
  photograph of the experiment. It carries a baked white vignette at its lower corners.
- The three covers are 698 × 481 masters, about 392 CSS px wide at 1440: soft on a 2x screen. Originals wanted.
- Live images rejected after viewing: AI Design Audit Agent (type set in the image, another illustration
  style), UI Pattern labelling (abstract shapes), Landing Page Audit (an unrelated email list), the generic
  Labs_* renders (not Tcules work). Real captures of the three internal tools could later replace the drawings.
- The five drawings were drawn and checked by eye in this run; the blind `flat-drawings-pages` critic was not
  run, so a blind check is still owed.
- Isometric art for `direction` (placeholder), and optionally a Lab hero illustration (people draw these).
- og/twitter image: `IMAGE_ASSET_REQUIRED` in the copy.
