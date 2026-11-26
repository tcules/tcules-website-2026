---
title: Pages are rendered once and kept; a CMS publish expires them
date: 2026-11-26
status: active
area: [content, process]
source: Owner brief, 26 Nov 2026 (the root layout's revalidate = 0; this PR)
supersedes: []
dbf: []
dbf_status: none
enforced_by: aria:check and kinds:check (prerendered-page floor); tests/cms-cache.integration.mjs
---

Pages are "rendered once and kept until a CMS publish invalidates the data they use", and "the webhook
that already invalidates the data also invalidates the affected pages, so a publish still appears
immediately". No layout every route shares may force per-request rendering.

**Why.** The root layout carried `revalidate = 0` from 6 Nov 2026 (2fbe41a2, "Navigation and footer are
read from the CMS for every page request"; kept by b7bd26ba on 12 Nov as "Render the shell per request;
published CMS data persists in the tagged Data Cache"). It was never logged here, and it overrode every
page's own `revalidate = 300`: every visit was a server render, and the build prerendered one file, so
aria:check and kinds:check passed for three weeks while reading almost nothing. A prerendered page in
Next 16 carries the tags of every CMS read it made, so the webhook's `revalidateTag(tag, { expire: 0 })`
expires the page as well as the data, and its next visit renders it afresh: the immediacy the per-request
shell was for, without its cost.

**The mistake it prevents.** `export const revalidate = 0` (or `dynamic = 'force-dynamic'`) on
`app/layout.tsx` or any layout a whole section shares, or a dynamic detail route left without a
`generateStaticParams` export, which Next renders on every request.

**How to apply.** The root layout's `revalidate = 300` is the safety net under the webhook, not the
mechanism. A route reads per request only when its content is per request (`searchParams` on
/case-studies and /insights, the API routes, the `/img` resizer). A kept page must not make a `no-store`
fetch outside `unstable_cache`: Next fails it when it re-renders. A new CMS read goes through
`publicGraphql` or `cachedCmsFetch`, so it carries tags the webhook can reach.
