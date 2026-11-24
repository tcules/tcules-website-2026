---
title: "Client logos may run as a slow ticker; walls stay boxed"
date: 2026-11-17
status: active
area: [proof, components, motion]
source: "Owner, 17 Nov 2026 (page overhaul planning, Jatin's 9-page canvas; PR feat/logo-marquee)"
supersedes: [2026-10-07-boxed-logo-grid]
dbf: [ch05 §10]
dbf_status: applied
enforced_by: "review"
---

A hero's client logos may move as one slow row: LogoGrid `arrangement="ticker"`, no boxes, the edges fading, about 45 px/s whatever the count. Hovering the row or giving it keyboard focus pauses it, and the mark under the pointer takes the ground's full ink. There is no pause button: "i don't want any pause button." With reduced motion nothing moves, and the marks wrap, centred, all in view. A client wall that is not a hero strip keeps the boxed grid from the Enorm reference, its heading demoted to eyebrow size, at most one MacBook Air viewport tall.

**Why.** The page overhaul's final picks (Jatin's canvas, 17 Nov) set the hero logos as the "L2 slow ticker", and the owner defined the interaction from it. The owner accepts that hover-and-focus pausing without a control falls short of WCAG 2.2.2.

**The mistake it prevents.** Reading the 7 Oct "no marquee" line as still binding and rebuilding the hero logos as a boxed wall; or adding a pause button the owner ruled out.

**How to apply.** LogoGrid `ticker` and ClientMark `highlight="hover"`; tokens in `tokens/components/logo-grid.css` (`--lgrid-ticker-*`) and `client-mark.css` (`--cmark-ink-hover`). Specimen: `/design/kit/logos` 08. The mark is still one solid ink, never an opacity.
