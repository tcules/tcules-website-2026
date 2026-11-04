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
| use | text · C-text | no visual, on purpose |
| beyond-the-file | text · illustrated prose (B), isometric placeholder | side from the plan's alternation |
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
  existing C-icon behaviour on every router page, not patched here.
- og/twitter image: `IMAGE_ASSET_REQUIRED`. The collage is the obvious source but needs a 1200 × 630 crop on a
  ground: an owner content decision.
