---
title: "Hard parts: the claims as tabs on a stage, one slide moving as one piece, no drawings"
date: 2026-10-31
status: superseded
area: [layout, proof, motion]
source: "Devagya, 31 Oct 2026, hard parts rounds 1–4 (artifact 56SLJxHf8TUXzRq9CxgWYd) and the built pages on design/expertise-pages"
supersedes: [2026-10-30-hard-parts-three-columns-as-authored, 2026-10-30-claim-visual-depicts-the-claim]
dbf: []
dbf_status: none
enforced_by: "kinds:check (challenges renders ClaimSet, data-band D-claims); review"
---

Every hard-parts band is `ClaimSet` with the tabs layout: the claims as tabs along the top of a paper-deep stage, each
tab "01" and a rule that is its timer, and the chosen claim's slide on paper below in two parts, its title and words,
then its example on a tinted panel under the label "Example" (or the copy's own qualified label). The slide moves "as
one piece", out to one side and in from the other toward the chosen claim, and the panel's height follows it. Hard
parts carry no drawing: "we won't be drawing illustrations for this content". Below 1024 every claim is on the page.
`/services/product-design` shows the on-page layout (locked, dividers on) so the two can be judged side by side.

**Why.** The ruled three-column rows read as an info dump on the design-to-code audit and the expertise pages. The
owner wanted one claim at a time with "a nice view for each", and picked the stage (from Giga's) over a ruled index
and a segmented track: "i like stage better". Columns animating separately and a texture field were rejected ("i
don't like that the 3 columns animate independently"; "texture implementation is bad").

**The mistake it prevents.** A segmented pill track floating apart from its content; tabs as square boxes; three
parts per slide each moving on its own; a 200px drawing slot on every claim that nobody will draw; empty space under
a short claim because the box held the tallest one.

**How to apply.** `src/patterns/ClaimSet` (`layout="tabs"`, `layout="page"`), tokens in `claim-set.css`, specimen
`/design/claim-set`. `ClaimRows` in CopyBands renders every hard-parts band through it; `HARD_PARTS_ON_PAGE` names
the one page on the other layout. Every claim title stays visible as a tab, which is how this squares with
2026-10-16-no-hidden-cards. Beautifying the shell (texture, motion) waits for the owner's review on the pages.
