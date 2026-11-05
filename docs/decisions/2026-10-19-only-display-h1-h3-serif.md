---
title: "Only display and h1–h3 are serif"
date: 2026-10-19
status: superseded
area: [type]
source: "Owner, 19 Oct 2026 (PR #126)"
supersedes: ["2026-10-16-type-under-28-is-sans"]
dbf: ["ch03 §2"]
dbf_status: pending
enforced_by: "review"
legacy: "memory/references-first-per-section.md"
---

Only display and h1–h3 stay serif. h4 moves to the sans at its optical size, 22 / 20 / 18 (was serif 28 / 25 / 22), keeping the 16 Oct ratio (sans 22 ≈ serif 28). h5, h6 and quote-sm stay sans. Quotes, mark and score were not part of this change.

**Why.** h4 was the last small serif role in card and item titles, where the serif reads poorly.

**The mistake it prevents.** Serif h4 item titles in cards.

**How to apply.** Title roles in `primitives.css`. ch03 §2 still lists `--text-h4` as Newsreader 500 28/25/22.
