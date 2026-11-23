---
title: "Client logos are the moving ticker everywhere; How we work carries them in its hero"
date: 2026-11-23
status: active
area: [proof, components]
source: "Owner, 23 Nov 2026: \"find every instance of the logo grid on the live website and replace it with the marquee\"; \"based on the overhaul, all services pages, all expertise pages, all audit pages must have a logo marquee\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "LogoGrid arrangement=\"ticker\" at every live call site; PublishedWork lifts its logo band into the hero"
---

Every client-logo band on the live site is LogoGrid's `ticker`: one slow moving row that pauses on hover
or focus, still and wrapped under reduced motion, folding after six on a phone. This covers Home's hero,
How we work, Why Tcules, Services, Expertise, Case studies, Clients and a service page's client band.
The boxed grid no longer appears on a live page. It stays in the kit for the specimens.

How we work carries its logos in the hero, as on the overhaul: the CMS logo band moves up into the hero
and is not drawn again further down. A hero with logos of its own keeps them.

Every service, expertise and audit page, and About and Careers, also show the ticker under the hero, as
on the overhaul. The hero's `recognition` field in Strapi is the source on each page (pending: how the
pages without logos of their own get them).

**Why.** One treatment for one job. The ticker shows the client list in one row's height and was approved
on the overhaul's boards.

**The mistake it prevents.** A boxed logo grid on one page and a moving row on the next for the same list.

**How to apply.** Any new logo band uses `arrangement="ticker"`. Logos under a hero go in the hero's
`recognition`, not in a band of their own.
