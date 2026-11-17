---
title: "Hover is one smooth move, there and back"
date: 2026-10-19
status: superseded
area: [motion]
source: "Owner, 19 Oct 2026 (gateway round 11, v5 and curve editor)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
legacy: "memory/hover-is-a-move.md"
---

Hover goes from the default view to a moved end state and reverts on mouse leave: "natural and smooth and shouldn't be abrupt at all." No opacity fades, pulses or keyframe replays. ONE smooth motion per drawing: all parts (traces, title colour, arrow) share one start, duration and curve both ways. FINAL, tuned by the owner in a curve editor: `transform 350ms cubic-bezier(0.25, 0.1, 0.25, 1)` (CSS ease).

**Why.** Keyframe effects (line redraw, halo breathe, pop) replay from zero and snap back on leave, so they read as abrupt and fussy.

**The mistake it prevents.** The v2 gateway board's opacity-and-move hover, and the same-day staggered lead/settle beats (superseded within the day by one motion).

**How to apply.** CSS transitions on transform (and colour) only, so an interrupted hover reverses from where it is. In-out quart was rejected; when unsure, give the owner a live curve editor rather than guessing. "One element moves most" survives as an idea.
