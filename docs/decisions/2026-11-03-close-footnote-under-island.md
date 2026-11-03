---
title: "A plain line in the enquiry close sits under the island, on the band's ground"
date: 2026-11-03
status: active
area: [layout, components]
source: "Owner (Devagya), 3 Nov 2026, review of /contact on the preview (PR #201): \"move the NDA first line to outside the island, under it, so the main island remains clean\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (CtaSection `footnote`; blocks.tsx `EnquiryBand` passes a linkless paragraph after the lead as the footnote)"
---

A line the enquiry band writes after its lead that is neither a contact link nor a score (contact's "Need an
NDA first? Say so and we'll set one up…") is the island's footnote: one plain line a `block` under the
island, on the band's own ground. The island holds the heading, the lead, the contact strip and the form.

**Why.** "So the main island remains clean": the island is the ask and the form; a reassurance belongs beside
it, not in it.

**The mistake it prevents.** The NDA line as a second lead paragraph inside the blue island on /contact.

**How to apply.** Every enquiry close (CtaSection island form, own band or `inBand`): such a line goes to
`footnote`, never into the island's body.
