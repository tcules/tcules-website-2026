---
title: "A video or podcast page puts the player straight under the title"
date: 2026-11-01
status: proposed
area: [layout, components]
source: "Owner, 1 Nov 2026, reviewing /insights/videos/mastering-design-decisions-insights-for-founders-pms-and-designers on feat/insights-rich-text (\"for videos, should the video be placed at the top?\")"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

On a video insight or a podcast, the hero comes in this order: the trail and title, then the video at
the full column, then the lead, labels and byline. This is PageHero `arrangement="watch"`. With no media
it renders exactly as `stacked`.

**Why.** On a video page the video is the piece. At 1440, the player started about 1,190px down, after the
lead, tags and byline, so it began below the first screen.

**The mistake it prevents.** The `stacked` hero on `/insights/[...slug]` and `/insights/podcasts/[slug]`
pushed the player under every line of text about it.

**How to apply.** The page template sets `watch` whenever the hero's media is a YouTube video. It is never
a CMS field. This is one part of the watch/listen shape in
decisions/2026-10-29-insight-details-take-three-shapes, which is still proposed. Stays proposed until the
owner has seen it on the built route.
