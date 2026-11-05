---
title: "Every case study renders the CMS body; no local story overrides one"
date: 2026-11-05
status: active
area: [content]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (case-studies/[slug] route)"
---

Every /case-studies page renders its Strapi body through the case template. No local copy overrides a case.

**Why.** The legacy SaaS case "shouldn't render like that. It should render like any other case study, but that should be handled by the CMS."

**The mistake it prevents.** /case-studies/legacy-saas-modernisation-information-architecture rendering a hand-authored local story (CaseStory) unlike every other case.

**How to apply.** The route no longer reads `getCaseStory`. The CaseStory template stays on /design/case-story; a better case is authored in Strapi.
