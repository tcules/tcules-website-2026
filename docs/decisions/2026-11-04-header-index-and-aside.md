---
title: The header's menus are an index of short-labelled groups beside an aside, at the content width
date: 2026-11-04
status: superseded
area: [components, layout]
source: "Owner, 4 Nov 2026, header mock rounds 1–3 (Header Menu Directions artifact): \"build B with short labels in SiteNav\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (SiteNav's PlatePane and SiteNavAside; the nav fixture)"
---

The header bar runs Work, Services, Expertise, Resources, Studio and one offer, Start a project. Each
menu opens one plate, floating under the bar at the content column's width, with its edges on the logo
and the CTA. Inside it, the section's groups form an index of equal columns. Each group has a two- or
three-word mono label (Core practice, Starting new, Live products, Design to software) and no note
under it. Where a section has a way onward, it sits in an **aside**: a deeper ground at the plate's
right edge, headed by the same mono label when it needs one, with the "All …" link pinned to its foot.
Services' aside holds How we work, Expertise's holds See the work, and Resources' holds its two
featured pieces as plain links. Studio has no aside. Rows that carry a description sit 32 apart and
plain rows 24. Hover is the label turning blue and the arrow moving in, with no ground. "Request
audit" left the header.

**Why.** Across three rounds the owner rejected a full-screen-width band, a foot strip under the
columns, an "All services" set apart as an outlier, a fifth column holding one link, and a serif lead
panel ("works in some places but not all"). Index + aside held for every section once the aside's
contents were chosen per section.

**The mistake it prevents.** The image-led rail with a Request Free Audit row; three plate widths
shrunk to content; a hover fill behind rows; featured articles as cards; long group labels with a note
under each.

**How to apply.** SiteNav and the nav fixture in `src/content/sources/fixtures/navigation.ts`. A new
way onward joins the section's aside instead of becoming a column or a foot. A new section with no way
onward has no aside. Promote to `active` when the owner approves the built header.

Superseded 5 Nov 2026 by `2026-11-05-studio-menu-has-an-aside`.
