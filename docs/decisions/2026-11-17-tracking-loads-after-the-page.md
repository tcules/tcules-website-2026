---
title: Third-party tracking loads after the page is ready, and the duplicate tools are removed
date: 2026-11-17
status: active
area: [process]
source: Jatin, marketing go-ahead on the tracking decision table, 17 Nov 2026 (yes/no answers relayed and logged by Devagya)
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

Every third-party tag on the live site, Tag Manager included, starts on the visitor's first scroll, tap
or keypress, or 5 s after the page's `load`, whichever comes first; never before the page. A lead
conversion starts tracking itself and waits for its tags, so no conversion is lost to the delay. Jatin's
five answers, 17 Nov 2026:

1. **Load all tracking after the page is ready:** yes.
2. **Remove Hotjar, keep Microsoft Clarity:** yes (a Tag Manager change).
3. **HubSpot chat only when it's needed:** yes. The widget loads a few seconds after tracking starts, not
   during page load.
4. **One visitor-identification tool:** "RB2B". Vector, and LiveIntent with it, and Snitcher are removed.
5. **Factors.ai:** "Remove" (a Tag Manager change).

**Why.** PageSpeed, 17 Nov 2026: 13 tracking tools from 11 companies, ~1 MB of tracking code and 75–80 of
a page's 107–128 requests. Most of the time a phone spent frozen while loading was these tools, with Tag
Manager loading before the page itself (`beforeInteractive`). Hotjar duplicated Clarity at several times the
cost. The HubSpot chat ran the longest single task on /case-studies (515 ms). Three tools identified
visitors. Factors.ai caused every console error on the site. Marketing accepted the cost: visitors who
leave within 5 s without touching the page are not counted.

**The mistake it prevents.** Adding a tag as a `next/script` in `app/tracking-scripts.tsx` or the root
layout that loads with the page (`afterInteractive` or `beforeInteractive` outside the start gate). Adding
a second session recorder or a second visitor-identification tool. Reporting a conversion without waiting
for its tags, which loses the lead when the submit comes before tracking has started.

**How to apply.** `lib/tracking-start.ts` is the one switch. Tags render inside `TrackingTags`
(`app/tracking-scripts.tsx`) or behind `started` (`app/hubspot-tracking.tsx`). A new conversion goes
through `leadTrackingReady()`, as `lib/client-contact-submit.ts` does. A tag added in Tag Manager is
covered automatically, because the container itself waits for the start. Items 2 and 5 are made in the
Tag Manager container (GTM-KMJSP983), outside this repo.
