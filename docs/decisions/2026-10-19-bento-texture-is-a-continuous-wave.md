---
title: "Bento's texture is the pixel grid in one continuous wave per row"
date: 2026-10-19
status: superseded
area: [imagery, cards]
source: "Owner, 19 Oct 2026 (What we do mocks S3 v3–v13, with a sketch of the wave)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

Behind a bento's drawings the site's pixel grid shows through one soft wave per row, drawn across the whole row and clipped by each tile, so it seems continuous while every seam stays clean. Neutral at rest, blue on the hovered tile. "We keep the same symbol we were using": never a halftone or any other texture in its place. No hard edge, and slight.

**Why.** The tiles needed "a little character"; a faded dot field "looks kinda off", hard-edged fields and per-tile halos were set aside for the owner's continuous sketch.

**The mistake it prevents.** The v11 halftone re-render ("just the wrong texture") and its lumpy first row.

**How to apply.** `public/textures/bento-wave-*.svg` from `scripts/bento-waves.mjs`; the strength is `--bnt-tex-strength`.
