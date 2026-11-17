---
title: "Hover is one smooth move, for cards with a drawing; controls and marks may ease colour"
date: 2026-11-17
status: active
area: [motion]
source: "Owner, 17 Nov 2026 (page overhaul planning): \"the ruling was more so for cards that have an interactive flat graphic\""
supersedes: [2026-10-19-hover-is-a-move]
dbf: []
dbf_status: none
enforced_by: "review"
---

On a card with an interactive flat drawing, hover goes from the default view to a moved end state and reverts on mouse leave, one smooth motion: no opacity fades, pulses or keyframe replays, all parts on one start, duration and curve, `transform 350ms cubic-bezier(0.25, 0.1, 0.25, 1)` (CSS ease). The rule does not govern the logo marquee, buttons or other controls; a colour transition is fine there.

**Why.** The 19 Oct ruling was made for the gateway drawings, where keyframe effects replayed from zero and snapped back on leave. Read site-wide it stopped buttons and marks easing a colour, which the owner never meant: "the hover-is-a-move rule doesn't apply on the marquee and other elements like buttons."

**The mistake it prevents.** Refusing a colour ease on the logo ticker's hovered mark, or on a button, by citing the drawn-card rule.

**How to apply.** Drawn cards (Gateway, Bento tiles, service tiles): the one-move rule as before. Controls and marks: an ease on colour or background is allowed, and respects reduced motion. Buttons without transitions today are a polish item, not a violation.
