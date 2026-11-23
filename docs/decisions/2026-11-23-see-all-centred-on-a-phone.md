---
title: "On a phone a band's see-all link is centred like \"See 3 more\"; home's cases stack, no slider"
date: 2026-11-23
status: active
area: [layout, components]
source: "Owner, 23 Nov 2026 (overhaul phase 2 review at 390: \"i like how this see more button appears ... we'll follow this same pattern for other places where this exists. i do not like the ruled approach anymore\"; \"we'll be removing the case study slider and placing the content normally like on the overhaul branch\")"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "CtaRow phone=\"centred\"; WallFold; PublishedHome CaseCards"
---

Below 768 a band's closing link ("See all case studies", "See 3 more") is one look: the blue link
button, centred under the band's body, with no rules around it. CtaRow's `phone="centred"` gives a lone
see-all link that look; the testimonial wall's toggle already has it. The ruled see-all row (two
hairlines, 18 Nov) is withdrawn. From 768 the see-all link is unchanged.

The home page's Selected work cases stack in one column at every width, a `column` (64) apart, as on the
overhaul. The sideways scroll they had below 768 is gone.

**Why.** The centred link reads as the end of the set, not as one more row of it, and one look for every
band end is easier to learn. A slider hid cases off screen; stacked, every case is seen in turn
(decisions/2026-10-16-no-hidden-cards).

**The mistake it prevents.** A see-all ruled like a list row, and a sideways case slider on a phone.

**How to apply.** Give a band's closing see-all link `phone="centred"`; never rule it. Never set a
case set to scroll sideways on a phone.
