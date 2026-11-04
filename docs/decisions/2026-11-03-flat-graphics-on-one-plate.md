---
title: "Every flat drawing sits on the one dotted plate; the bento tile keeps its card and loses its texture"
date: 2026-11-03
status: active
area: [cards, illustration]
source: "Owner, 3 Nov 2026 (tracker 2.50: direction A picked on /design/flat-frames, then on the built pages: 'keep the bento cards just remove the texture and use the plates')"
supersedes:
  - 2026-10-19-bento-texture-is-a-continuous-wave
  - 2026-10-19-bento-sketches-are-light
dbf: []
dbf_status: none
enforced_by: "review"
---

Every flat drawing on the site sits on ONE ground: the Sketch plate (16:9, paper-deep, the dot field,
the 8 radius). The bento tile and the service tile keep their card (hairline, 16 radius, words on top,
the lift and blue hairline on hover) and carry no texture; their drawing sits on the plate inside the
card, filling the tile's width. Never a flat drawing bare on a new ground.

**Why.** "Not about one drawing style but a consistent look and feel": home's Where to start showed the
services on dotted plates and One studio, one band later, the same drawings bare on the pixel-grid
texture. The owner picked one plate for every flat drawing, then rejected the build that also dropped
the bento's card for plates with ruled results ("bad design… i don't like ruled designs as much in a
grid").

**The mistake it prevents.** The same service drawn on two grounds on one page; the pixel-grid texture
behind a flat drawing; and turning the bento's cards into borderless plates with ruled halves.

**How to apply.** `Bento` and `ServiceTile` (src/patterns/Bento) render `Sketch` in its plate frame inside
the tile; the `--bnt-*` layer holds no texture or drawing scale. The pixel-grid texture stays where it
is ruled for grounds (the islands and CTA bands). The card's frame, hover and split panel stand
(2026-10-19-what-we-do-is-a-bento, 2026-10-19-bento-tile-hover).
