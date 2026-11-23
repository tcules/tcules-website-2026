---
title: "On a phone: full-width main action, 38 hero title, words before the photo, the see-all link centred under the band"
date: 2026-11-18
status: proposed
area: [layout, type, components]
source: "Owner (Devagya), 18 Nov 2026: phone audit of the nine overhaul pages at 390 against Jatin's m- boards (design/ov5-phone); built, not yet seen by the owner"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "Button block, --font-size-display-m, ContentSection MediaSplit order and .headingXl phone swap, CtaRow phone=\"centred\""
---

Below 768, four global changes, each at the component or token that owns it (1–3 shipped site-wide in
overhaul phase 1, 19 Nov 2026; 4 and CtaRow's solid in phase 2):

1. **The page's main action runs the full width at 48.** `Button block="until-md"`, set by the slots
   that place the main action: PageHero's first action, CtaRow's converting solid
   (decisions/2026-11-18-converting-ask-is-solid), CtaSection's solid and EnquiryForm's submit. From
   768 every button is its own size.
2. **The hero title is 38 / 1.06** (`--font-size-display-m`, was 43 / 1.08). Display is the hero's
   alone, so this is every hero title on a phone.
3. **A media split reads head, words, then photograph**, and its head is the band's h2 like every other
   band head (`media.head="xl"` is an explicit opt-in, and h2 below 768 either way). From 1024 nothing moves.
4. **A band's see-all link is centred under the band's body** (`CtaRow phone="centred"`), bare, as the
   testimonial wall's "See 3 more" sits (decisions/2026-11-23-see-all-centred-on-a-phone). The ruled
   row first built here (two hairlines, `joined` onto a ruled list) was rejected by the owner on
   23 Nov 2026. On the Selected work bands of `/` and `/why-tcules`.

**Why.** The owner noticed the phone layouts reflowed desktop rather than following Jatin's m- boards.

**The mistake it prevents.** A phone page that is the desktop reflowed: a label-width main action, a
hero title and a split head a step above the boards, a photograph between a heading and its words,
and a see-all link floating as a small label.

**How to apply.** Place the main action with `block="until-md"` in any new slot that carries it; give
a band's closing see-all link `phone="centred"`. Never restate these per page.

**Open.** Point 1 sets the enquiry submit at 48 on a phone, where decisions/2026-10-26-enquiry-form-buttons-md
holds every form button at 40; promote this entry to `active` with a line on that, or narrow point 1.
