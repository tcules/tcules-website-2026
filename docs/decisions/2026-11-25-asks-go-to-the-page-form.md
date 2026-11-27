---
title: An ask scrolls to the page's own form, else goes to /contact; there is no enquiry pop-up
date: 2026-11-25
status: proposed
area: [forms]
source: Devagya, 25 Nov 2026, on Jatin's Form & CTA prototype ("prototype wins", "no pop-up at all"); docs/specs/EnquiryForms.md § 2
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

A button that leads to the enquiry form takes the reader to a form on a page, never an overlay. On a page
with its own sales form it scrolls there and puts focus on the form. On a page without one it goes to
`/contact`, carrying the page it came from. (This entry first had the ask select an intent and carry it
in `?intent=`; superseded by 2026-11-27-enquiries-carry-no-intent.) The nav's ask follows the same rule; the nav's and the footer's Contact item always
goes to `/contact`, because it names a page.

**Why.** The prototype's recommendation, which the owner chose over the pop-up: the page form keeps the
reader's context and has no overlay failure states, and a link that already works with no script stays
the source of truth.

**The mistake it prevents.** The enquiry pop-up on `design/enquiry-popup` (18 to 19 Nov), which opened a
dialog for every ask, and a phone sheet that crowds the keyboard.

**How to apply.** `EnquiryLinks` (root layout) handles the press and sends the button pressed to the
form as `cta_id`; the link itself is plain (`#enquiry`, `/contact`), so a new tab or a blocked script
still lands on the form. Never add an overlay to reach a form.
