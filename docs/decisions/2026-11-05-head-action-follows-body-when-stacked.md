---
title: "Once a band stacks on a phone, the head's action follows the body"
date: 2026-11-05
status: active
area: [layout, components]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: ["2026-10-29-head-end-action-centred-on-heading"]
dbf: []
dbf_status: none
enforced_by: "structure (ContentSection actionsMove; OfferSheet list note)"
---

Where a section head carries an action at its end, the heading and the action share ONE row from 1024, "vertically centred" on each other, a `column` (64) apart, the lead under that row in the heading's track and the eyebrow on its own line above (29 Oct, unchanged). When the band stacks on a phone, the head's action moves to after the body it leads on from: below 768 in a stacked band, below 1024 in a beside band, which stacks there. Between 768 and 1023 a stacked band's head is one track: heading, the action a `block` under it, then the lead.

**Why.** "Could the button appear after the list on mobile?" on home's "Why founders and product teams choose Tcules" and "Industries we know well".

**The mistake it prevents.** "See all industries →" and "See why teams choose Tcules →" sitting between the heading and the list on a phone, read before the reader has seen what they lead to.

**How to apply.** `ContentSection` (any head with actions and a body) and `OfferSheet` `list` place the action twice and show one per width (`display: none` keeps the other out of the a11y tree). Banner, Reasons, CaseSpread and EngagementOptions still keep the action in the head on a phone: follow-up.
