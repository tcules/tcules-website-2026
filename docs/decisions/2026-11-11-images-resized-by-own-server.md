---
title: "CMS images are resized by the site's own server, losslessly, at the M2 ladder"
date: 2026-11-11
status: active
area: [imagery]
source: "Owner, 11 Nov 2026, after the D6a image test (Jatin's 10 Nov SEO list); applied in perf/own-image-resizer"
supersedes: [2026-09-28-images-served-from-strapi-formats]
dbf: []
dbf_status: none
enforced_by: review
---

The site resizes a CMS image itself instead of relying on sizes Strapi generates.
- **What it makes:** the M2 ladder below the original, 1240 · 652 · 320. The original is still the
  largest file in the srcset.
- **Format:** lossless WebP, so nothing changes in the picture except its size.
- **Where:** one route of the site's own, `/img/<width>/<R2 key>.webp`, cached at Cloudflare by its
  extension.
- **What stays from M1:** a native `srcset` built by `Media`, and no `next/image`.
- **What's gone from M1:** "Strapi's own formats" as the source of the sizes. Nobody configures
  anything in Strapi or does anything per image.

**Why.**
- **Owner's choice:** the owner chose the site's own server over configuring Strapi ("with the
  auto-resizer built on the server it will reduce that manual effort").
- **Quality bar:** the owner's words were "crystal clear with no pixelation, no compression
  artifacts".
- **The gap it closes:** the new Strapi instance was never set to the ladder, so phones downloaded
  the 2560 original for slots about 800–1,070px wide (up to 1.5 MB per cover, 7.8 MB on
  /case-studies).
- **The test:** lossless 1240 renders indistinguishably in Chrome at iPhone density (39–44 dB), at
  57–73% less data per image.

**The mistake it prevents.**
- Leaving phones on 2560 originals because the CMS's formats are missing.
- Reaching for `next/image`, which saves lossy by default and caches on disk that Railway wipes on
  every deploy.
- A resize that comes out heavier than the original (lossless can outweigh a lossy photograph): the
  route then serves the original unchanged.
- A small slot losing Strapi's 245 thumbnail: CMS formats narrower than the ladder stay in the srcset.

**How to apply.**
- **The pieces:** `lib/image-resize.ts` holds the ladder and the allowlist. `Media`'s `mediaSrcSet`
  adds the ladder for any image in the CMS's R2 bucket. `app/img/[width]/[...key]/route.ts` does the
  resize; it keeps the colour profile and is immutable-cached.
- **What the route refuses:** other stores, other widths, non-raster files and paths that climb.
- **A new width:** it needs a ladder change (M2) first.
- **Images outside `Media`:** inline images in article markdown and the enquiry form's portrait
  aren't covered yet.
