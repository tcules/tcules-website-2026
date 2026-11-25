---
title: A page can carry its own nav button; careers asks to apply
date: 2026-11-25
status: proposed
area: [components, forms]
source: Devagya, 25 Nov 2026 ("that CMS feature is valid … the careers button should say Apply to Tcules or something relevant and then scroll to the form")
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

The nav's one offer can be replaced on a specific page. The CMS navigation lists page buttons (an
exact path and a button); a listed page shows its own offer in the bar and in the phone sheet's foot,
every other page keeps the site's. `/careers` shows **Apply to Tcules**, which scrolls to the
application form (`#apply`).

**Why.** "Book a free product review" asks a job seeker on /careers for the wrong thing; the page's own
ask is the application.

**The mistake it prevents.** A careers-only exception hard-coded in SiteNav, or a nav ask that sends an
applicant to the sales form.

**How to apply.** `SiteNav`'s `pageCtas`, fed by the navigation's `pageButtons` (CMS
tcules-cms-2026#8). Add a page there, never in code. It is still one offer per page: the bar never
carries two.
