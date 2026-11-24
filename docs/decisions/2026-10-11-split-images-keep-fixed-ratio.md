---
title: "Split-section images keep a fixed ratio"
date: 2026-10-11
status: active
area: [imagery, layout]
source: "Owner review, 11 Oct 2026"
supersedes: []
dbf: ["ch05 §9"]
dbf_status: applied
enforced_by: "review"
legacy: "memory/home-review-patterns-oct-2026.md"
---

A split-section image keeps a fixed ratio (e.g. 4:5 or 3:2) at its own size. It never stretches to fill the section height (`block-size: 100%` or fill).

**Why.** Stretching to the copy's height loses control of the crop.

**The mistake it prevents.** Split images sized by the copy column beside them.

**How to apply.** Any media in a split. ch05 §9 lists placements but not this split rule.
