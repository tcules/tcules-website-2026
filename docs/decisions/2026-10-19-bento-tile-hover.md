---
title: "A bento tile's hover: blue hairline, 2px lift, its texture turns blue, no shadow"
date: 2026-10-19
status: active
area: [motion, cards]
source: "Owner, 19 Oct 2026 (What we do mocks S3 v7–v13)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

On hover a bento tile lifts 2px, its hairline goes from grey to brandeis-100, its texture from neutral to light blue (the other tiles stay neutral) and its title takes the accent, all on the owner's curve both ways. No shadow: "blue hairline + 2px lift, no shadows".

**Why.** The owner asked for "some eye candy element to just level them up". A lift with a soft shadow, then a blue shadow, were tried and dropped.

**The mistake it prevents.** Card hover by ground fill (frame="box") or by drop shadow (nothing the page is made of casts one).

**How to apply.** Bento only. The hairline and texture changes are colour transitions, which `2026-10-19-hover-is-a-move` allows ("transform (and colour)"); the texture's two inks crossfade on the same curve.
