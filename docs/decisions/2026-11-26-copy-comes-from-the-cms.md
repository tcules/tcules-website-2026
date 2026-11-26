---
title: "All copy comes from the CMS; _pages is retired as a copy source"
date: 2026-11-26
status: active
area: [content]
source: "Devagya, 26 Nov 2026, reviewing PR #334 (kinds:check findings)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "kinds:check no longer compares words against _pages"
---

"_pages is redundant. all copy comes from CMS." The words on a page are the CMS's. The `_pages` corpus is no
longer the source of any page's copy, and nothing checks rendered copy against it. `kinds:check` keeps only the
band to kind component check.

**Why.** The CMS now holds the copy the pages render, and where it differs from `_pages` the CMS is right.
Comparing against `_pages` reports the CMS's own copy as missing.

**The mistake it prevents.** PR #334 made `kinds:check` read all 66 corpus pages for the first time. It reported
684 problems, 528 of them "copy missing" on `#how-we-work-together` across about 48 service, expertise and audit
pages, plus more on `#why-tcules`. In every one of those, the page was rendering the CMS's engagement-options copy
correctly. A session reading that list would have "restored" retired `_pages` copy over the CMS's.

**How to apply.** Copy changes go to the CMS, never to `_pages`. Don't treat a difference between a page and
`_pages` as a defect. `_pages` still names each corpus page's bands and their kinds for `kinds:check` and
`corpus:census`. The earlier rulings on not paraphrasing authored copy (2026-10-10) still apply, now to the CMS's
copy.
