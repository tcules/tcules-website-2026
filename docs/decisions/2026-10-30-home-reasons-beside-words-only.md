---
title: "Home's Why Tcules is Reasons beside, words only: the head beside three claims, no visual pulled from the sentences"
date: 2026-10-30
status: superseded
area: [components, layout, proof]
source: "Owner (Devagya), 30 Oct 2026, home round-6 mocks (https://claude.ai/artifact/4f1ghRa3vzg21ycaxLaXDd, credibility 6b), asked to build"
supersedes: [2026-10-29-home-reasons-show-their-proof, 2026-10-30-home-proof-on-one-plate, 2026-10-29-set-reasons-head-above-drawing-above]
dbf: []
dbf_status: none
enforced_by: "structure (Reasons `arrangement=\"beside\"` draws no figure or proof and warns if one is passed; HomePage's WhyTcules passes words only)"
---
Home's "A product design partner for ambitious SaaS teams" is `Reasons` with `arrangement="beside"`: the
heading, lead and "Why teams choose Tcules" link in the leading track (5 : 7 from 1024, a `section` (96)
split), and the three claims reading down the trailing one, each its title (h4) over its sentence with its
own links, a `stack` (48) apart. No rules, no drawing, no figures, no proof panels. Below 1024 one column,
the head above.

Carried over from the entry this supersedes, unchanged: every DRAWN Reasons set (`open`, `boxed`) puts its
head above, full width, with each item the drawing above its title and body, and no hairlines. `beside` is
only for a set of words.

**Why.** A tile of client logos, or of typeset names and tenures, is "an assembled item acting as a graphic
when it isn't" (owner): illegal, as is a typeset name standing in for a logo. And figures pulled out of the
sentences (round 6c: "4", "2025", "3 yrs") read smaller than the sentences they came from, so they hurt
more than help; the strong figures (90+ projects, 19 countries, since 2017) are already the hero's.

**The mistake it prevents.** The round-5 proof plates on home (four client names 2×2 in a box, a ConnectX
placeholder cover with a "Live since late 2025" strip, three tenures typeset as a panel), and the round-6
fixes that kept adding figures (a stat row of 90+ / 19 / 2017, per-reason stat figures) to give the band
weight.

**How to apply.** `src/patterns/Reasons/` (`beside`, `--rsn-title-beside-*` in
tokens/components/reasons.css), `whyTcules` and `WhyTcules` in src/templates/CorpusPage/HomePage.tsx;
`src/lib/reason-proof.ts` is deleted. Specimen: /design/reasons 15 and 15b. Offer pages' Why Tcules keeps
its own proofs (decisions on the offer page), untouched.
