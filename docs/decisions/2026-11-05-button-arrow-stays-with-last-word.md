---
title: "A button's trailing arrow stays with the label's last word"
date: 2026-11-05
status: active
area: [components]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (Button glued, inlineGlyph)"
---

Every button with a trailing glyph and a label of more than one word keeps its last word and the glyph on one line when it wraps, boxed or bare, and a wrapped label balances. A ghost's wrapped lines take the container's alignment, as a link's do. A one-line button renders as before.

**Why.** "Buttons look odd when wrapping": home's "Start small with an optional pilot →" wrapped at 360 with the arrow stranded at the box's far end.

**The mistake it prevents.** A wrapped boxed label with its arrow beside the block rather than after the words.

**How to apply.** `Button` (the glyph sits inside the label for boxed emphases).
