# /services — design pass, 2 Nov 2026 (local, in review)

The hub routes into the seven service lines and the audits. Composed from the library: OfferPage's plan,
one new arrangement of DrawnTableBand (`chooser`).

## Decisions
- `service-guide` is a chooser, not tiles and not a plain table (owner, 2 Nov 2026). Tried and set aside:
  the Bento with "What you come away with" as a labelled detail. Each item has three fields (name, who it
  is for, what you get) and a tile cannot hold them in line: names on two lines pushed every field down,
  the repeated mono label out-shouted the words, the drawing became filler at the foot. The band's job is
  choosing BY SITUATION (the FAQ: "you don't need our service names"), so it reads down a column.
- The chooser: one row per service, a hairline between rows; the service's own drawing at the start
  (`serviceSceneFor`), then name (h4, the whole row is its link, the arrow on its last word), "Best for"
  at body size, "What you come away with" a step quieter. The header's words once above the columns from
  1024; below, each stacked row says its own keys. Every column of the authored table is kept.
- A closing paragraph that opens with a row's name ("Product Design can also be hired in parts…",
  "Software Development covers…") sits under that row's name, links kept. The sentence with no row
  ("A new AI product often brings…") stays under the list.
- Hero: centred, the media below (owner, 2 Nov 2026: the long title), `CENTRED_HERO_ROUTES` in
  src/lib/hero-media.ts. The labelled placeholder until hub art is drawn, registered as an illustration;
  under a centred head everything but a photograph is capped at 860 (PageHero).

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero centred, placeholder below (860), record figures | illustration to draw (register row) |
| client-recognition | recognition · LogoGrid | |
| service-guide | table · DrawnTableBand `chooser` | row notes for PD and SD; one sentence under the list |
| selected-work | cases · 3-column card grid | |
| testimonials | quotes · one-at-a-time slider + Clutch badge | 4 quotes (< 6) |
| how-we-work-together | options plated + terms row, ink island ask | |
| why-tcules | reasons · isometric illustrations | The Wandering Raven's still to draw |
| industries | 3-column sector photo cards | 4 photos owed |
| enquiry, faq | Island form, FAQ | form before FAQ |

## Open
- Owner review of the chooser and the centred hero.
- Hero art; the second Why Tcules illustration; four sector photos; five client marks with no file.
