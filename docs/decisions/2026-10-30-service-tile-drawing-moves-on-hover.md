---
title: "A service tile's drawing always moves on hover"
date: 2026-10-30
status: superseded
area: [cards, illustration]
source: "Owner, 30 Oct 2026, round 5 review of /services/product-design and the L1 service pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (Sketch `Move`/`GrowIn`, live only under Bento/ServiceTile `story`; specimen /design/sketch S.7)"
---

Every service tile (texture + flat drawing) has a hover interaction in its drawing: a move on transform only
(hover-is-a-move), rest to end state and back on one curve. Every tile drawing is checked at zoom for polish:
no stray marks (the UX Research mic), highlights sized to what they highlight (the Data Visualisation bar).

**Why.** The tile is a link; its drawing is the thing that should answer the pointer.

**The mistake it prevents.** Static drawings on some tiles and moving ones on others, and unchecked drawing details.

**How to apply.** ServiceTile's drawing gets one transform-only hover move per scene; check every scene at zoom.
Story scenes (the seven service stories, 25 Oct) keep their approved story; every other tile scene makes its one
transform-only move (`Move` a part, or `GrowIn` a part that arrives). Reduced motion holds the rest state.

**A move must read (30 Oct 2026, round 6 fix pass).** Tile drawings render near 0.7 css px per unit, so a travel under
about 12 units reads as jitter. A part moves at least 12 units, or it scales, or it arrives (`GrowIn`). A move never ends
misaligned: nothing leaves the drawn box or comes within 4 units of another mark, and a scene with no room for a clear
travel makes a `GrowIn` of its check or flag instead.
