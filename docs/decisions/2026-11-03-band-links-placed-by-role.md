---
title: "A band's links are placed by role: the page link in the head, the ask as its own ink island"
date: 2026-11-03
status: active
area: [layout, components]
source: "Owner (Devagya), 3 Nov 2026, review of the 3 Nov copy on the preview (PR #201): \"Book a Call is the CTA that needs to be presented in the island. See how we work is the link that goes in the section header.\""
supersedes: [2026-10-29-how-we-work-together-link-in-head, 2026-10-30-service-pages-keep-both-asks]
dbf: []
dbf_status: none
enforced_by: "structure (CopyBands `isAskLink` / `askLinkIn` / `AskIsland`; OfferBands `tiles` and HomePage `Situations` read links by href, never by position)"
---

A band's closing links are placed by what they do, never by their order in the copy. A link to another page
("See how we work →") is the band head's end action. The ask, a link to the page's own form (`#enquiry`,
"Book a call"), is its own ink island after the band: a placeholder heading, "Tell us what you're working
on", until the copy supplies one ("some invented heading for now which we'll get updated later"), and the
link's own words as the one button, to the form. It applies to How we work together on every offer page and
home, and to home's "Where to start", where the ask must never be a path card.

Carried over unchanged from the entries this supersedes: How we work together is EngagementOptions with its
page link in the head; a service page still asks twice, mid-page (this island) and at the close (the form).

**Why.** The 3 Nov copy reversed the link row ("[Book a call](#enquiry) · [See how we work →](/how-we-work)"),
and a renderer that took the first link as the head action and the second as the island put the ask in the
head and turned "See how we work →" into an island heading with an invented "Start a project" button.

**The mistake it prevents.** The 3 Nov preview: "See how we work →" as the ink island's heading over a
"Start a project" button to /contact; "Book a call" as an empty-plate card in home's "Where to start" Bento.

**How to apply.** Read a link's role from its href (`#enquiry` is the ask). Replace the placeholder heading
when the copy writes one, in `ASK_ISLAND_HEADING` only, never per page.
