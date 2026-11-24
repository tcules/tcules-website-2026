---
title: "An animated image moves only with a pause control, set below the image at its end"
date: 2026-11-18
status: active
area: [motion, imagery, components]
source: "Devagya, 18 Nov 2026, reviewing figure 7 on /insights/what-an-ai-agent-console-should-show (fix/animated-figures): picked \"Below the image\" over Clip's corner placement; P1 of the article bug report (animated figures froze on most screens, no pause)"
supersedes: []
dbf: [ch05 §2]
dbf_status: applied
enforced_by: "Media (MediaMotion renders the control for every `animated` record) + review"
---

An animated image (an animated WebP or GIF, such as a figure's recorded product tour) moves by itself only with a
pause control. The control sits **below the image, at its end** (a 32 disc with a 44 target, `--gap-tight` under
the image), never laid on the image. Pausing shows the still, the file's first frame; under `prefers-reduced-motion`
the image starts on the still and plays only when the reader presses play. An animated original is served unresized.

**Why.** WCAG 2.2.2: anything that moves by itself for more than five seconds can be stopped, and the tours run
17–26 s on a loop. Below rather than on the image because a recorded tour has its own step cards and controls in its
corners: Clip's corner button covered "Catch a behaviour change · Step 1 of 4" on figure 7.

**The mistake it prevents.** Animated figures frozen on their first frame at 1× desktop and on phones (the `/img`
resizer decoded one frame), looping with no way to stop them where they did play; and a pause button laid over the
recording's corner. Not to be confused with `2026-10-31-autoplay-without-a-control`, which is about sets that
advance by themselves (tabs), not media that moves.

**How to apply.** Everywhere on the site, whatever the page: every CMS response is read for uploads whose file
moves (`markAnimatedUploads`, from the file header), and `Media` renders any `animated` record through `MediaMotion`,
drawing the `chrome-play` / `chrome-pause` marks itself so no placement can leave the control out. The `/img/*` copy
of an animated original is its still, at 1240. The still is the clip's title frame, so the clip should open on one.
Not covered: an image inside Markdown body copy, which is HTML rather than `Media`.
