---
title: "A band's closing pointer to a piece of reading is its own ink island, never beside another island or the close"
date: 2026-11-03
status: proposed
area: [layout, components]
source: "Tracker 2.53 (Jatin review, 2 Nov 2026): one-line links in the copy (\"*Is your vibe-coded app ready for production?* covers where AI-built apps break first.\") become ink island CTA blocks; never two adjacent, never beside the close. Built on feat/2-53-link-ctas, 3 Nov 2026; awaiting the owner's look on the routes."
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (text.ts `onwardLine`, plan.ts `placeOnward`, CopyBands `OnwardIsland`, CtaSection `intent=\"onward\"`); kinds:check reads the island's `<band>-onward` section as the band's own words"
---

An **onward line** is a band's last block when it is a paragraph of its own, at most two sentences, whose
one link goes to a piece of reading (`/insights/…`). It leaves the band and becomes an ink island right
after it: `CtaSection arrangement="open" intent="onward"`, the same island and turbulent field as every
formless call-to-action island. Its words are split, never rewritten: the sentence before the one holding
the link is the heading; the sentence holding the link is the lead, or the heading when there is no
setup; a link that closes the line on its own is only the button. The button is the link's own words as
the blue **link** with its arrow, never a solid: it points to reading, and the page's one main action
belongs to the hero and the close.

The island is not placed, and the line stays in its band as written, when the next band is the enquiry
close or a closing ask, or when the band already ends in its own ask island (an `#enquiry` link). A link
to a case, a service, the contact page or the form is not an onward line; nor is a line inside an
argument (three sentences or more, or not the band's last block), nor an "Example:".

**Why.** Jatin, 2 Nov: the pointers to the studio's reading were lost as small lines at the foot of a band.
An island makes each one a step the reader can take, without becoming the page's ask.

**The mistake it prevents.** An onward line set as a blue solid (a second main action mid-page); two islands
touching (an onward island before the close or after an ask island); a line rewritten to fit the island.

**How to apply.** The rule is structural: new copy that ends a band on a reading pointer gets its island
with no per-page work. The placements, and every line left inline with its reason, are in
`docs/page-build/link-ctas.md`.
