---
title: "Hard parts: a resting pointer chooses a tab, and the slide peeks the next claim once on entry"
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
140ms chooses it; a quicker sweep across the row changes nothing, and hovering never moves focus. Only the
hand moving the pointer counts: a tab the page scrolls under a still pointer is never chosen, because only a deliberate act may stop autoplay (2026-10-31-hard-parts-tabs-on-a-stage). Click, tap
and the keyboard (arrows, Home, End) work as before. Once, when a stage first comes into view, the slide peeks: the first claim's slide
eases 96px aside, the edge of the next claim's slide shows in the space it leaves, and after a short hold both
come back (520ms each way on the slide's ease). The tab row never moves (owner, 3 Nov 2026: "I didn't mean the
tab selectors to move"). Nothing is chosen, so autoplay is untouched; a choice made during the peek ends it at
once. Reduced motion and widths below 1024 get neither.

**Why.** The tracker item asks that the tabs change on hover and that an entry shows there is more. The intent
delay is what keeps hover switching from flickering as the pointer crosses the row on its way somewhere else.

**The mistake it prevents.** A wheel scroll that parks a tab under a resting mouse choosing it and stopping
autoplay for good (pointerenter fires on scroll; the intent starts from a pointermove whose screen point
moved). A hover switch with no delay that flashes every slide a sweep passes over; an entry
that moves the tab row, which reads as the controls shifting rather than the content showing more; an entry
built from fades or keyframes (2026-10-19-hover-is-a-move).

**How to apply.** `src/patterns/ClaimSet/ClaimTabs.tsx` (`HOVER_INTENT_MS`, the peek effect) and
`ClaimSet.module.css` (`data-peek`), tokens `--clm-peek-*` in `claim-set.css`. A hover choice is a deliberate
act and stops autoplay, like a click. Transitions on transform only.
