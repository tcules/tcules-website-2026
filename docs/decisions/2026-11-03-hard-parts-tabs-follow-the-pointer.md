---
title: "Hard parts: a resting pointer chooses a tab, and the later tabs slide in once on entry"
date: 2026-11-03
status: proposed
area: [motion, layout]
source: "Tracker 2.54 (Jatin review, 2 Nov 2026): \"tabs change on hover, and an entry animation shows there is more\"; built on feat/2-54-claimset-hover for the owner to see at /design/claim-set and the expertise pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

On `ClaimSet`'s tabs, with a mouse (`(hover: hover) and (pointer: fine)`), resting the pointer on a tab for
140ms chooses it; a quicker sweep across the row changes nothing, and hovering never moves focus. Click, tap
and the keyboard (arrows, Home, End) work as before. Once, when a stage scrolls into view, the tabs after the
chosen one slide in from the side, one after another (64px, the slide's 360ms ease, 80ms apart), so the row
reads as more than one claim. A stage already on screen at load is left still; reduced motion and widths
below 1024 get neither.

**Why.** The tracker item asks that the tabs change on hover and that an entry shows there is more. The intent
delay is what keeps hover switching from flickering as the pointer crosses the row on its way somewhere else.

**The mistake it prevents.** A hover switch with no delay that flashes every slide a sweep passes over; an entry
that snaps the tabs away and back on a stage the reader is already looking at; an entry built from fades or
keyframes (2026-10-19-hover-is-a-move).

**How to apply.** `src/patterns/ClaimSet/ClaimTabs.tsx` (`HOVER_INTENT_MS`, the entry effect) and
`ClaimSet.module.css` (`data-entry`), tokens `--clm-entry-*` in `claim-set.css`. A hover choice is a deliberate
act and stops autoplay, like a click. Transitions on transform only.
