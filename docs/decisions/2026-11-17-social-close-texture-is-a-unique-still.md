---
title: The close's texture is a still, held at a new moment for every export, and kept subtle
date: 2026-11-17
status: active
area: [motion, imagery]
source: Owner review of /design/social, 17 Nov 2026 ("we can't use the moving texture in the bg but i think lets keep it so every export has a unique texture"; "the texture could be made subtler so the text reads cleanly")
supersedes: []
dbf: [ch10 §A8]
dbf_status: applied
enforced_by: script
---

The blue close keeps the texture field, as a still picture. Each export holds the field at a new
random moment, so no two exports share a texture. The moment is saved beside the export so one can
be repeated. The field is set subtle enough that the words read cleanly over it.

**Why.** A post is a still image, but the field is part of what makes the close ours.

**The mistake it prevents.** Dropping the texture from social because it moves, or exporting the
same texture on every post.

**How to apply.** The `tcules-social` exporter picks the moment (`--field <n>` repeats one).
