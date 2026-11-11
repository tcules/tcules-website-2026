---
title: A content edit that changes a drawn item raises a graphics issue; reuse a drawing or redraw
date: 2026-11-11
status: active
area: [process, illustration]
source: "Devagya, 11 Nov 2026: instructions for Jatin's Claude editing Strapi"
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

When an item whose drawing shows what its words say (a flat drawing per item, a hard-parts claim or a Why Tcules reason) is changed in Strapi, the
editor's Claude checks whether the drawing still fits. "Meaning changed? needs an appropriate drawing.
Drawing exists? pick from the existing drawings. Drawing doesn't exist? redraw." A changed title always
needs relinking, even when the meaning holds. Jatin doesn't keep a copy of the repo: Jatin raises a
`graphic-needs-review` issue. A GitHub Action has Claude do the relink, reuse or redraw and open the PR,
and once Devagya merges it to main, the change is carried to new-cms on its own PR, which waits for
Devagya's merge, since new-cms is the live site and there are no preview environments (owner, 11 Nov 2026). "I don't really need to do anything other than merging the PR at the end." Heroes, home and enquiry
illustrations, and case covers, are out: "they simply show a specific industry or expertise and they will
rarely change."

**Why.** Drawings are bound to items by title (`offerSceneKey`). An edit in Strapi never passes through
git, so nothing in the build notices when a title changes or an item's meaning moves away from its drawing.

**The mistake it prevents.** An item renamed in Strapi showing an empty plate with nobody told. Also, a
drawing left beside copy that now says something else.

**How to apply.** `docs/guides/content-edits-with-graphics.md` (Jatin's Claude reads it from GitHub),
`.claude/commands/graphics-issue.md` (the runbook), `.github/workflows/graphics-issue.yml` and `graphics-carry.yml`,
`.github/ISSUE_TEMPLATE/graphic-needs-review.md`, `team/roles/approver.md`. Reuse is limited to a drawing
made for the same idea, never a keyword match: the per-item drawing rulings still stand.
