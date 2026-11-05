---
title: Articles reserve no diagram placeholder slots; their figures come from the CMS
date: 2026-11-05
status: active
area: [content, imagery]
source: Owner, 5 Nov 2026, placeholder sweep before launch (chore/drop-cpq-diagram-slots)
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

An article page draws no image placeholder of its own. "Articles come from CMS, so no need": a figure an
article needs arrives with the article's content from Strapi, and an article without one renders without
one.

**Why.** Articles are authored and published in the CMS. A slot the site reserves in an article is a
picture nobody will commission: the CMS copy doesn't ask for it, and the slot stays a labelled panel
on a live page.

**The mistake it prevents.** `/insights/cpq-ux-design` carried two "Image to come: diagram" panels (the
responsibility map after `the-quote-is-the-shared-object`, the quote-version comparison after
`design-for-the-revision-not-the-first-draft`). Both were added in the 10 Oct page-mapping critic pass
so the long-form column broke its Prose runs, and were placed by `DIAGRAM_AFTER` in `LongformShell`.
Neither was ever drawn, and the second had no basis in the copy at all.

**How to apply.** No `docs/image-register.md` row for an `/insights/**` article band, and no
placement table in `LongformShell` that inserts a placeholder into an article. The long-form rhythm
(no more than two Prose-only sections in a row) is met from the article's own structure (tables,
Steps, bound media) or not at all; it never justifies adding a picture the content doesn't hold.
