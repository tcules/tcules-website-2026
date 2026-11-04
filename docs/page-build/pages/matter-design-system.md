# /matter-design-system — designed, branch design/careers-lab-matter (local), 4 Nov 2026

Tracker 2.43. Composed from the library through OfferPage's plan (`ROUTES.matterDesignSystem` was already in
`PASS_1_COMPOSED_ROUTES`). Copy: `_pages/matter-design-system.md`, rendered as authored. Job of the page: a
designer who searched "Matter Figma design system" sees the real file, learns the three ideas in it, and the
reader who needs more than a file reaches the design-system services and the enquiry island.

## Decisions
- Hero: the real Matter file. The live site's collage of three Matter Figma frames (accessible colour
  palettes, the Button component in every size and state, the Tokens Studio panel of purpose-named tokens),
  copied to `public/matter-design-system/matter-collage.webp` (2000 × 1111, alpha). The copy's `visual_plan` is
  `real_matter_figma_artefacts`. Rendered as a Media `cut-out` on the `paper-deep` panel, no added shadow (each
  frame carries its own), through a new route-keyed `ARTEFACT_HERO` map in `CorpusPage/images.ts` read by
  `heroImage()` after the page's own binding and before `STUDIO_HERO`. `SlotImage` widened with `HeroCutOut`.
- Hero arrangement: centred, collage below the head (`CENTRED_HERO_ROUTES`, as /services and /expertise). At 1.8:1
  the collage would be about 500 wide in the beside half column; centred it renders about 720 inside the 860 cap.
  "Open Matter on Figma" is the page's one blue solid, "Book a call" the link after it.
- What's inside (`contents`): the drawn offer sheet across 3, each property's still flat drawing heading its
  title and words (treatment rules § 1, "how something works"). Three new scenes in
  `components/Sketch/wyg-matter-design-system.tsx`, wired in `lib/page-scenes.ts`, `Sketch/wyg.ts` and
  `content/sources/offer-scenes-pages.ts`: a ladder of values with the one chosen for its purpose routed to a
  button's fill; three parts joined into one component, shown at rest, pressed (lit) and disabled; a library
  panel of nested groups, one path lit from a group to its piece. Each reads apart from the page's four
  service drawings.
- `use`: C-text, unchanged; the breath between two visual bands, no action added.
- `beyond-the-file`: illustrated prose (ContentSection `media`, weight `photo`, head `lg`): the id joins
  `ILLUSTRATED_PROSE` in plan.ts (it appears on this page only). An abstract claim takes an isometric
  illustration (treatment rules § 1); flat would match the services band below. It also ends the two
  touching prose bands (`use` → `beyond-the-file`; decisions/2026-10-07-no-two-text-heavy-bands-in-a-row).
  Placeholder until drawn, with its register row (`/_illustrations`, "What a working design system adds to a
  Figma file") carrying the concept for the illustrator.
- `services`, `enquiry` (blue island, before the FAQ) and `faq`: unchanged, approved kinds.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero `centred`, cut-out collage on `paper-deep` | eyebrow suppressed under the breadcrumb, as before |
| contents | set · OfferSheet, drawn, across 3 | three new still drawings |
| use | text · B media split, Matter's components (pass 2) | photo-led 7 : 5, cropped; was peer paragraphs |
| beyond-the-file | text · B split in halves, the live page's screen-and-code picture (pass 2) | whole at its own ratio; was the isometric placeholder |
| services | services · C-icon service tiles | four hairline cards with their drawings |
| enquiry | enquiry · L, blue island in halves | before the FAQ |
| faq | faq · D-faq | |

Rhythm at a squint: centred head over the wide collage panel; three borderless drawn plates; a short text
column; a split with the illustration slot; four hairline cards; the blue island; the centred accordion. No
tint, no text-heavy pair, registers alternate (cut-out → flat → none → isometric → flat → isometric → none).

## Content mapping
- No copy changed. The hero alt is new wording (an alt describes the image): "Three frames from the Matter Figma
  file: accessible colour palettes, the Button component in every size and state, and the Tokens Studio panel of
  purpose-named tokens."

## Open
- **New arrangement for this route:** the centred hero (`CENTRED_HERO_ROUTES`), chosen for the wide collage.
  Owner to confirm centred against beside.
- **New variant of the hero image wiring:** a cut-out on `paper-deep` via `ARTEFACT_HERO` (no other route
  changes; only this map produces a cut-out). White frames on paper fall below 3:1 (B5); paper-deep does not
  reach 3:1 either, and the baked shadows carry the edge. Owner to confirm paper-deep, or no panel.
- At 390 the collage renders about 240 wide inside the panel's `gutter` inset: it reads as the product, its
  detail does not. Not fixed locally; options are a tighter inset on phones (Media `inset`) or no panel.
- The collage master is a 2000px WebP; ruling 2026-09-25-cut-outs-png-master-webp-served wants a 2560 PNG
  master from the Figma source. 2000 covers 860 CSS px at 2x.
- The three contents drawings were drawn and checked by eye in this run; the `flat-drawings-pages` workflow
  (blind critic) was not available to this builder, so a blind check is still owed. Later, real Matter frames
  exported from the file could replace them as per-item cut-outs.
- `beyond-the-file` ships a labelled isometric placeholder until an illustrator draws it.
- The four service tiles' titles wrap to one or two lines, so their "when" lines start at different heights:
  existing C-icon behaviour on every router page, not patched here. At 390 each tile is about 300 tall (the
  plate keeps its desktop ratio). Both are Bento changes that would move every service-tile set: owner to
  decide (subgrid title rows; a shorter plate below 768).
- **New arrangement for this route:** `use` set as two peer paragraphs (`PEER_PARAGRAPHS`, as /careers
  `product-work`). The critic wanted a real Matter frame beside the words; the live site has no single
  legible frame other than the hero collage, so a frame exported from the Matter Figma file (one component
  or the token panel, flat) would give this band its picture. Owner to confirm or supply.
- **Promote the proposed ruling** decisions/2026-11-04-placeholders-show-their-label-only: this run applied
  it in the generator, so every placeholder site-wide now shows its short label only.
- **Global, not route-local:** a hero or CtaRow action whose href leaves the site now trails the
  leaving-the-site arrow (`lib/href.ts` `leavesSite`); the hero's blue solid carries it too. Owner to confirm
  the solid may carry that one glyph (r7-buttons gave it none).
- og/twitter image: `IMAGE_ASSET_REQUIRED`. The collage is the obvious source but needs a 1200 × 630 crop on a
  ground: an owner content decision.

## Fixed after the critic (4 Nov 2026, 6.5/10)
- Placeholder printed its whole brief at ~30px on a cool grey (#EEF0F3) with a clipped dashed edge → the
  generator (`scripts/placeholders.mjs`) wrote the brief, a non-palette ground and a dashed stroke into every
  slot → the generator now draws the short label only, centred, in the mono voice on paper-deep (#F3F1EA),
  warm neutral-600 ink, no stroke (Media draws the hairline); all 70 slots regenerated
  (decisions/2026-11-04-placeholders-show-their-label-only, proposed).
- `use` was a thin text stack at ~95 characters a line with the right third empty → the `text` kind set two
  short paragraphs at full stacked width → the band joins `PEER_PARAGRAPHS` (two columns under the
  full-width head, `column` apart), as /careers does; flagged in Open.
- "Open Matter on Figma" looked like an on-site button → PageHero (and CtaRow) never cue an off-site href →
  `lib/href.ts` `leavesSite()`; PageHero and CtaRow trail `arrow-right-up` for an off-site action, so every
  page gets it.
- Nit, hero collage small in its panel → the master carried its own transparent margin → cropped to its
  alpha bounds (1900 × 1041, shadows kept), dimensions updated in `ARTEFACT_HERO`.
- Skipped: the services tiles' ragged title rows and their phone height. Both are Bento changes that move
  every service-tile set on the site; listed in Open for the owner.

## Pass 2, owner review 4 Nov

Owner note: "there are some images for MDS on the live website. go find them and use them where necessary."
After main's merge (#219), checked first: the FAQ sits beside in halves (2026-11-04-faq-beside-in-halves) and
the enquiry island stays before it; the page has no Why Tcules list, Three ways cards or industries pills, so
nothing else from the 4 Nov rulings lands here; the merge broke nothing (0 page errors, no overflow at 1440 or 390).

### What the live site holds (www.tcules.com/matter-design-system, the Lab page, sitemap; /matter times out, /resources/matter-design-system is an empty shell; og:image is empty)
| Image (largest available) | What it is | Where it went |
|---|---|---|
| `961737187e…6b4860934f.webp`, 2000 × 1111, alpha | the collage of three Matter frames | already the hero (`matter-collage.webp`), unchanged |
| `/assets/images/b050a84e…ed078.png`, 1600 × 1200 (the Lab page's `Matter_Design_System…webp` is a 698 × 481 crop of it) | Matter components exploded in perspective: Blue 500 / Cyan 500 swatches, Primary / Secondary buttons, select, checkboxes, radios, type styles | `use`, as `public/matter-design-system/matter-components.webp` |
| `image_a3154e52ee.webp`, 1080 × 600 | the live page's "Matter component shown beside its front-end code": a screen, its code panel, an assistant's suggestions | `beyond-the-file`, as `public/matter-design-system/matter-component-code.webp` |
| `Container_ebdebfea4c.webp`, 292 × 96 | three token chips (`color.orange.400` …) | not used: too small for any slot |
| `Events_Design_system_for_everyone…webp`, 1290 × 770 | a meetup banner, type on the image | not used: an event, not the file |
| five 3D icons (Tokens Studio, variables, arrow, magnifier, Figma), 96–168 px | decorative renders | not used: off-style and tiny |
| `/assets/images/91ba78b8…png`, 2000 × 2000 | a noise texture laid over images | not used |

### note → cause → fix
- **Real Matter images where the page needs a picture of the file** → the template could show the page's own
  artefact only as its hero (`ARTEFACT_HERO`); a prose band had a placeholder or nothing → new route-keyed
  `ARTEFACT_BAND` in `CorpusPage/images.ts` (`bandArtefact()`), read by the text kind before its illustration
  slot and by the plan (register `photo`, a visual band). `crop` sets the image as the media split's photograph;
  `own` keeps it whole at its own ratio in the split's figure half (ContentSection `media.drawing`, the track the
  /future-interfaces-lab pass added today). New `MEDIA_SPLIT_HALVES` sizes for that half. **Local by data,
  general by mechanism**: only this route has entries; ContentSection itself is unchanged.
  - `use` (the 'use' band had no frame): Matter's components beside "open a component and follow how a
    foundation value flows into the finished piece", photo-led 7 : 5, cropped (a field of parts bleeding off
    every edge loses nothing). Leaves `PEER_PARAGRAPHS`; /careers `product-work` still uses it, unchanged.
  - `beyond-the-file`: the isometric placeholder replaced by the live page's screen-beside-its-code picture,
    whole, in halves; it shows the band's claim (coded components, AI building screens and code from the
    system). Leaves `ILLUSTRATED_PROSE` (the id is on this page only). The alt describes what it shows and does
    not call it Matter's code (the FAQ says Matter has none).
- **What's inside kept its three flat drawings**: each explains a mechanism (a value chosen for its purpose
  routed to a button, parts joined into a component in three states, one path through the library) that no
  live image shows; the only frames that would match are the hero collage's, which would repeat the hero at a
  third of its resolution. Kept on purpose.
- **Hero, 390 collage too small**: tried the collage with no panel (326 wide on a phone instead of ~262,
  and larger at 1440). Not applied: decisions/2026-09-24-cut-out-contrast-panel-below-3-1 requires the panel
  where the white frames fall below 3:1 against paper, and the panel inset is a site-wide token. Still Open.

Rhythm now: centred head over the collage panel → three drawn plates → components photo (start) beside
words → words beside the code picture (end) → four service cards → blue island → FAQ in halves. Registers:
cut-out → flat → photo → photo → flat → isometric → none; no tint, no two text-heavy bands.

### Open (pass 2)
- **New arrangement for this route:** `ARTEFACT_BAND` (a prose band showing the page's own artefact); the
  `own` fit puts a raster image in ContentSection's figure half, which was built for a flat drawing. Owner to
  confirm.
- The screen-and-code picture is drawn in green (the live Matter page's accent), the only green on the site,
  and it is 1080 wide (1.9× at its 572 half; soft on a 3× phone). Owner: keep, or ask for a blue,
  2× export; the isometric brief stays in docs/image-register.md if the owner prefers it drawn.
- The components image is a 1600 PNG from the old site (served as WebP); a 2560 master would match
  2026-09-25-cut-outs-png-master-webp-served.
- Hero at 390 (carried over): the collage reads as the product, not its detail. Options for the owner: the
  ink panel (passes 3:1, but ink is reserved), a phone-only tighter crop of the Button frame, or accepting it.
- og/twitter image still `IMAGE_ASSET_REQUIRED` (carried over).
