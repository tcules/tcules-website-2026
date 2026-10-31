---
title: "A call-to-action island without a form carries the turbulent field; a paper block on paper is marked by it alone"
date: 2026-10-31
status: active
area: [components, motion]
source: "Devagya, 31 Oct 2026, About round 4: \"i would like that turbulent texture on cta islands that don't have a form. additionally, on the paper on paper island, i'd like a light blue texture\"; \"moving on paper as well. paper on paper works because of the texture. log it.\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

Every call-to-action island without a form carries the moving field in its **turbulent** form (`TextureFlow
flow="turbulent"`). The loose, looping churn runs across the whole island and never settles into streams, and it stays
quiet behind the words (`data-texture-calm`). Islands holding the enquiry form keep the **resolving** field, which
loops at the start and eases into parallel streams toward the form.

A **paper band marked only by its field** is allowed (About's studio links). The band takes `density="open"` (128;
96 on a phone), which also raises it one layer. Its field reaches past the band into the neighbours' empty air
(`TextureFlow bleed`, 64; 48 on a phone), so it spans the gap between their content. It fades out at its edges in a
wide, rounded blur (`feather`: 200 px, levels rounded at 240), clear of any neighbouring content. It is at full
strength around the words (`data-texture-focus`) and faint, 55%, around them. There is no island box and no ground:
the field alone marks the block. A paper block on paper with no field is still not used.

**Why.** An island with no form has no side to resolve toward, so the settling streams point at nothing. The owner
wanted the studio's links on About set apart as a block. A tint ground would have made them a tinted band. The textured
paper island marks the block without adding a ground.

**The mistake it prevents.** A paper island on paper with no texture, which draws nothing. A formless island whose
field settles toward an empty side.

**How to apply.** The open close (`CtaSection arrangement="open"`) renders `TextureFlow flow="turbulent"`. So do About's
Lab card (ink) and its studio-links band (paper, feathered, focused). The field's ink per surface is `--tex-flow-ink`, brandeis-500 on
paper.
