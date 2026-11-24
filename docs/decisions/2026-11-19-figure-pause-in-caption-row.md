---
title: "In a figure, an animated image's pause control sits at the end of the caption's row"
date: 2026-11-19
status: active
area: [motion, imagery, components]
source: "Devagya, 19 Nov 2026, reviewing figure 7 on /insights/what-an-ai-agent-console-should-show (fix/article-bugs): \"since the figcaption is anyway capped, can we put the play/pause button in the same row?\""
supersedes: []
dbf: [ch05 §2]
dbf_status: applied
enforced_by: "Figure (MediaMotionScope + MediaMotionControl in its figcaption) + review"
---

In a `Figure`, the pause control of an animated image is not a row of its own below the image: it sits at the end
of the caption's row, level with the caption's first line and aligned to the image's end edge. The caption stops at
its measure, so the row already has the room. Everywhere else (an animated image outside a figure) the control stays
below the image at its end, as `2026-11-18-animated-image-pause-below` rules; that entry still holds, and this one
refines it for figures.

**Why.** The owner's words: "since the figcaption is anyway capped, can we put the play/pause button in the same
row?" A row holding only a 32px disc added a seam between the image and its caption.

**The mistake it prevents.** A figure reading as image, control, caption: three rows where two do.

**How to apply.** `Figure` wraps itself in `MediaMotionScope` when its image moves (`mediaStill(image)` is defined),
and puts `MediaMotionControl` in the `figcaption` as a content-sized second track. The figure takes its accessible
name from the caption text (`aria-labelledby`), so the control's label is not read as part of the caption.
