---
title: "A service sub-page with no drawing shows no picture in its hero, and no placeholder"
date: 2026-11-05
status: active
area: [layout, illustration]
source: "Devagya, 5 Nov 2026, in session (illustration workflow scope): \"for now those pages can have no image in the hero at all (and no placeholder)\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (src/lib/hero-media.ts `heroIsServiceSubPage`, read by OfferPage)"
---

A service sub-page (`/services/<service>/<sub>`) whose hero has no drawing and no clip renders the words alone: no
image, no labelled placeholder. A sub-page that has a finished drawing (AI Copilots and Agents) or a clip still
shows it. "For now": the sub-page hero illustrations are out of the current illustration run, not cancelled.

**Why.** The 25 sub-page heroes were left out of the 5 Nov illustration run, and a placeholder that will stay up
for weeks reads as an unfinished site.

**The mistake it prevents.** 25 service sub-pages each showing the generic "studio photo" fallback
(`/placeholders/unregistered--slot.svg`) beside their hero copy.

**How to apply.** `heroIsServiceSubPage` in `src/lib/hero-media.ts`; `OfferPage` passes no media and plans the
hero's register as `none`. Level-1 services stay in `HERO_MEDIA_ROUTES` and keep their drawings. Audit heroes are
not covered: they keep their placeholders while videos are decided (TRACKER 2.66).
