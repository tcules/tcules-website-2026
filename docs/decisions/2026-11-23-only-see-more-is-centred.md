---
title: "Only a \"See N more\" toggle is centred; a see-all link keeps its place; home's cases stack"
date: 2026-11-23
status: active
area: [layout, components]
source: "Owner, 23 Nov 2026 (overhaul phase 2 review at 390): \"i like how this see more button appears\"; \"the center alignment should only be on the 'see n more' buttons like the logo grid and testimonials. case studies' button redirects to a different page so that shouldn't be centered\"; \"i do not like the ruled approach anymore\"; \"we'll be removing the case study slider and placing the content normally like on the overhaul branch\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "WallFold (centred toggle); CtaRow has no phone variant; PublishedHome CaseCards"
---

A "See N more" toggle, which opens more of the same set in place (the testimonial wall, the logo wall),
is centred under the set it opens. A link that goes to another page ("See all case studies") is not a
toggle: it keeps the usual link's place and alignment, never centred and never ruled. The ruled see-all
row (18 Nov) and its centred successor are both withdrawn.

The home page's Selected work cases stack in one column at every width, a `column` (64) apart, as on the
overhaul. The sideways scroll they had below 768 is gone.

**Why.** Centred, the toggle belongs to the whole set it opens. A see-all link leaves the page, so it
reads with the band's other links, and centring it set it apart as if it were a toggle. A slider hid
cases off screen (decisions/2026-10-16-no-hidden-cards).

**The mistake it prevents.** A navigation link dressed as a toggle, and a sideways case slider on a phone.

**How to apply.** Centre only in-place "See N more" toggles. Never set a case set to scroll sideways
on a phone.
