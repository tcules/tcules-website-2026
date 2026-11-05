---
title: The footer runs brand, directory, newsletter, studio, legal, then the watermark, with no texture
date: 2026-11-04
status: active
area: [components, layout]
source: "Owner, 4 Nov 2026, footer review rounds on design/nav-footer-v2 (\"the footer is 95% there\")"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (SiteFooter's band order; the footer fixture's group order)"
---

The site footer, on ink, runs in this order: the brand band (logo, the tagline "Code got easy. Good
products didn't.", Start a project and the small Clutch badge); the six link groups (Services, Software
Product Expertise, Industries, Work, Resources, Studio, with Studio last); the newsletter; the studio
split (the one-line statement at 14px in the body ink under a short bar in the logo's proportion, in the labels' row, beside two labelled facts, **Address** with the email, and **Elsewhere**);
the legal row (copyright, legal pages, the Solar Icons credit); then the faint watermark flush to the
foot. Social links are words with an external arrow, never marks. Nothing moves or is textured at the
foot: "remove the texture from the bottom. we'll keep it simple."

**Why.** The owner set the order of the new content and judged each band on the built footer; the studio
facts became a split because a run-on paragraph over a line of small print needed "something better".

**The mistake it prevents.** The TextureFlow field under the watermark (a fade, then a field warped round
the letters) built on this branch and removed; a second "Studio" label beside the Studio link group; the
credit moved out of the footer; brand marks for the social links.

**How to apply.** SiteFooter and its fixture in `src/content/sources/fixtures/navigation.ts`. A new group
or fact joins the band it belongs to rather than adding a band.

