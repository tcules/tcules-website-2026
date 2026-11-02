---
title: Author pages move to phase 2
date: 2026-10-30
status: superseded
area: [content, process]
source: "Owner, 30 Oct 2026, after PR #171 merged"
supersedes: [2026-10-29-author-pages-ship-at-launch]
dbf: []
dbf_status: none
enforced_by: review
---

`/insights/authors` and the `/insights/authors/<person>` pages are parked for phase 2, after the 6 Nov
launch. They come back into phase 1 only if the weekend of 31 Oct to 1 Nov leaves time.

**Why.** The owner: "park author pages for post-launch for now. unless we get time on the weekend." The
29 Oct ruling shipped them on the condition that they did not change the timeline. With the freeze on
Wed 4 Nov, that condition no longer holds.

**The mistake it prevents.** Linking bylines to `/insights/authors/*`, which falls through to
`[...slug]` and 404s. At launch, the byline names and the "About the author" block (PR #171) carry no
author link, and there is no "More from …" link.

**How to apply.** When the author pages ship, add the `href` to `HeroPerson` and the `link` to each
`Contributors` entry on the insight routes, plus `ProfilePage` and `Person` markup
(`docs/research/insight-structured-data.md`).
