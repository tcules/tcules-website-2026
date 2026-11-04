---
title: "Home's case cards are one swipe row on a phone"
date: 2026-11-04
status: active
area: [cards, layout]
source: "Owner (Devagya), homepage pass 2.63, 4 Nov 2026 (design/home-pass), reviewed on the built page"
supersedes: []
dbf: []
dbf_status: none
enforced_by: structure (HomePage SelectedWork)
---
Below 768 home's selected work is one sideways scroll row (Layout `scroll="until-md"`), one card in view
and the next peeking; from 768 it stays the stacked case cards. An owner exception, for this band, to
2026-10-26-sliders-allowed-off-homepage ("the homepage never hides a card"): every card is a link and in
the page as it loads, and nothing autoplays.
**Why.** "On phone, we can keep the case study cards in a horizontal scroll to save space."
**The mistake it prevents.** Six tall case cards stacked down a phone.
**How to apply.** HomePage `SelectedWork`.
