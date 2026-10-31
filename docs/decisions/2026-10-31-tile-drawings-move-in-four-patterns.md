---
title: "A tile drawing moves in one of four patterns, two at most, and its start and end differ"
date: 2026-10-31
status: active
area: [cards, illustration]
source: "Devagya, 31 Oct 2026, review of /design/sketch S.7 after the flat-drawings pilot (branch design/flat-line-motion)"
supersedes: [2026-10-30-service-tile-drawing-moves-on-hover]
dbf: []
dbf_status: none
enforced_by: "review; npm run sketch:frames measures changed (>= 25%) and traceUnits (>= 80 with a line); the flat-drawings workflow's critic checks the patterns"
---

Every service tile's drawing (texture + flat drawing, inside a link) moves on hover, and "the start and end
states are different". Its motion comes only from four patterns, derived from the seven S.3 service stories,
which "are all valid":

1. **A line draws.** "If there's a line, it draws over the course of animation" (`TraceIn`).
2. **A circle icon grows or fills.** It "grows from 0 size like in specialist-research OR be unfilled and fill
   over the animation like on software-development" (`GrowIn`, or the `release` class).
3. **A highlight is done as in Audits.** A halo grows behind a `block`, which fills.
4. **A cursor moves to the button** (`Glide`, the button drawn `press`).

"No more than 2 patterns could be combined otherwise it would be too much." Every tile drawing is still
checked at zoom for polish: no stray marks, highlights sized to what they highlight.

**Why.** The motion has to be noticed, and the approved stories show what noticeable looks like: the eye
follows a line across the drawing and the thing it reaches answers.

**The mistake it prevents.** The 30 Oct tile scenes moved a part 12 units or popped a small badge (`Move`,
`GrowIn` alone): `new-product` "fails because the start and end state are same", and
`specialist-ai-hitl`, `-ai-engineering`, `-ai-readiness`, `-ds-strategy`, `-ds-implementation`,
`-ds-alignment`, `-redesign` "plus almost every new diagram" failed the same way.

**How to apply.** `docs/research/flat-graphics/drawing-brief.md` § How it moves holds the table of
patterns and their parts; `.claude/workflows/flat-drawings.js` applies it per band. `Move` is not one
of the patterns: no nudges, no small scales. Story scenes keep their approved stories. Plates never move and
are held finished. Reduced motion makes the change instant.
