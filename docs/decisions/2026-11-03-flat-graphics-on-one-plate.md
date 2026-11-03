---
title: "Every flat drawing sits on the one dotted plate, its words under it; the textured tile is retired"
date: 2026-11-03
status: active
area: [cards, illustration]
source: "Owner, 3 Nov 2026 (tracker 2.50, /design/flat-frames, direction A: 'i'll go with your recco')"
supersedes:
  - 2026-10-19-bento-texture-is-a-continuous-wave
  - 2026-10-19-bento-sketches-are-light
  - 2026-10-19-bento-tile-hover
  - 2026-10-19-what-we-do-is-a-bento
dbf: []
dbf_status: none
enforced_by: "review"
---

Every flat drawing on the site sits in ONE frame: the Sketch plate (16:9, paper-deep, the dot field,
the 8 radius, no edge), with its words outside it, under it (or beside it in a wide or row item). A
drawing that links somewhere adds only the arrow after its name and the drawing's own move on hover.
The bento tile's hairline, pixel-grid wave, 16 radius, lift and words-inside-on-top are retired from
flat graphics. Services named as a set are still the service tile (2026-10-29-named-services-are-
service-tiles), and the service tile is now this plate with the name under it. Home's What we do keeps
its two tile sizes; a wide tile sets its plate beside its words.

**Why.** "Not about one drawing style but a consistent look and feel": home's Where to start showed the
services on dotted plates and One studio, one band later, showed the same services with the same
drawings on bordered textured cards. The plate was already nearly every flat drawing on the site, so the
tile was the outlier. Picked from three versions on one page (today, A everything on plates, B links are
tiles and the rest plates).

**The mistake it prevents.** One service drawn in two frames on one page; a band inventing its own
ground, edge, corner or title position for a flat drawing; a textured card beside a set of plates.

**How to apply.** `Bento` and `ServiceTile` (src/patterns/Bento) render `Sketch` in its plate frame with
the name and arrow under it; the `--bnt-*` layer holds no texture, lift or drawing scale. The pixel-grid
texture stays where it is ruled for grounds (the islands and CTA bands). A new component showing a flat
drawing uses the plate and puts its words outside it; never `frame="bare"` on a new ground.
