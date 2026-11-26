---
title: "_pages is removed from the site; every page reads the CMS"
date: 2026-11-26
status: active
area: [content]
source: "Devagya, 26 Nov 2026: \"i want _pages to be removed from production completely and also main\""
supersedes: [2026-11-26-copy-comes-from-the-cms]
dbf: []
dbf_status: none
enforced_by: "_pages/ and the corpus loader no longer exist, so nothing can read them"
---

The `_pages/` corpus is deleted from both `main` and `new-cms`, with everything that read it. Every page,
`/contact` included, reads the CMS, and share cards take their title and eyebrow from the CMS hero.

**Why.** All copy comes from the CMS. `_pages` had become a second source that could disagree with it:
`/contact` rendered the 26 Oct copy while the CMS held the current page, and the corpus loader made
Turbopack trace the whole project into the server bundle.

**The mistake it prevents.** `/contact` built from `_pages/contact.md` three weeks after the CMS Contact
Page was published, and `kinds:check` reporting the CMS's own copy as 528 lines of "copy missing".

**How to apply.** A page's words come from its CMS entry. Never reintroduce a markdown copy source, and
never mirror a Strapi edit into the repo (the graphics-issue workflow no longer touches copy).
`kinds:check`, `corpus:census`, `corpus:check`, `corpus:assets`, the `/design/corpus-page` and
`/design/about-ideal` routes and the Design System artifact's corpus snapshot are retired with it.
