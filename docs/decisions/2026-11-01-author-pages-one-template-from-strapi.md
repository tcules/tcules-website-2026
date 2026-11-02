---
title: "Author pages ship at launch: one template, filled from Strapi"
date: 2026-11-01
status: active
area: [content, process]
source: "Owner, 1 Nov 2026, on feat/insights-rich-text (\"i think we can build the author pages out today\"; \"profile pages to be built using Strapi data. so we have 1 template and things get plugged into it by Strapi\"; \"we'll use whatever strapi sends\")"
supersedes: [2026-10-30-author-pages-move-to-phase-2]
dbf: []
dbf_status: none
enforced_by: "review"
---

`/insights/authors` and `/insights/authors/<person>` ship in phase 1. There is one author template, and every
person in it comes from Strapi: everyone a live byline names gets a page, with the name, role and photo
Strapi sends, and the list of every live piece they are credited on. The 26 Oct copy's author profiles are
not used, and neither are its names: where the copy and Strapi disagree ("Yash Bhatt" in the copy, "Yash
Gidwani" in Strapi), Strapi wins.

**Why.** Bylines should link to a person, and the page is the `url` that Google's author markup asks for
(decisions/2026-10-29-author-pages-ship-at-launch). One template filled by the CMS means a new author, a
photo or a bio needs no code.

**The mistake it prevents.** Building author pages from the copy, which names 8 people, lists pieces at
new-copy URLs that are not live, and calls one author by a different name from the bylines.

**How to apply.** The person record is derived from the bylines (`blogProfileSection`: name, designation,
profile picture) until the new Strapi carries an author collection; a bio slot renders when Strapi sends
one. The byline names and "About the author" link to the page. A person without a photo shows initials
(decisions/2026-11-01-byline-initials-without-a-photo).
