---
title: "A hero's tags are the article's Tag chips, with its labels, above the actions"
date: 2026-11-18
status: active
area: [components]
source: 'Owner (Devagya), 18 Nov 2026, overhaul review: "tags like on article pages instead of this list. also above the CTA"'
supersedes: []
dbf: []
dbf_status: none
enforced_by: "PageHero (labels and tags one chip row through distinctLabels)"
---

PageHero renders `tags` as `Tag` chips in the same row as `labels`, under the copy and above the actions.
The unboxed mono grid after the actions, each tag after a blue pixel, is retired. Labels come first, then
tags, as one set through `distinctLabels`, so a repeat shows once (decisions/2026-11-19-hero-tags-distinct-three-at-most),
and the row keeps its one sideways scroll on a phone (decisions/2026-11-18-hero-tags-scroll-on-phone).

**Why.** Two treatments for one kind of taxonomy, one of them after the ask, read as a metadata footnote.

**The mistake it prevents.** Bringing back a second tag style for non-article heroes.

**How to apply.** Pass taxonomy as `labels` or `tags`; never style a tag set locally in a hero.
