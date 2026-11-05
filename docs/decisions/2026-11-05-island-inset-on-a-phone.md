---
title: "On a phone an island is 32 above and below and 24 at the sides; the form island 16 at the sides"
date: 2026-11-05
status: active
area: [spacing, components]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: ["2026-10-13-island-inset-is-band-air"]
dbf: []
dbf_status: none
enforced_by: "tokens (island.css); Island inset='form'"
---

Island's inset is 48 on every side from 768 (owner, 16 Oct 2026, in island.css). Below 768 it is 32 above and below (`--gap-gutter`) and 24 at the sides (`--gap-block`); the island that holds the enquiry form takes 16 at the sides (`inset="form"`, `--isl-inset-form-inline`). The `band` inset keeps the band's own air (96, and 64 / 32 below 768).

**Why.** "Padding 24px in the dark islands", then "vertical padding 32px" and "form island should be 16px inline". Inside a 16-gutter band the island's own 48 read as a void and its 32 sides left the form narrow.

**The mistake it prevents.** The 13 Oct inset (64 block and the 32 gutter below 768) left the close's form at about 262 wide at 390; a form island and a words-only island sharing one inset when only the form needs the width.

**How to apply.** `tokens/components/island.css`; CtaSection's three form arrangements pass `inset="form"`. CLAUDE.md § gap-scale rule 4 states it.
