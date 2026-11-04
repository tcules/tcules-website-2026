# OfferParts — component specification

## 0 · Front matter

| | |
|---|---|
| **Component** | OfferParts |
| **Tier** | 2 · pattern (`src/patterns/`) |
| **Status** | `proposed: building` (matches decisions/2026-10-30-what-you-get-titled-terms-four-parts, which stays `proposed` until the owner has seen it built) |
| **Token prefix** | `--ofp-*` |
| **Designer / date** | Claude Code with the round 6 designer pass, 30 Oct 2026 |
| **Implements** | decisions/2026-10-30-what-you-get-titled-terms-four-parts; docs/page-build/treatment-rules.md § 2, § 6 |
| **Implemented at** | `src/patterns/OfferParts/` · `src/styles/tokens/components/offer-parts.css` · specimen `src/app/design/offer-parts/page.tsx` · wired by `WhatYouGetBand` (`src/templates/CorpusPage/CopyBands.tsx`) |

## 1 · Identity

"What you get" in four parts: the drawn deliverables across the full width, then three peer parts
(who does the work, what we need from you, where our part stops), each led by its visual. A pattern,
not a primitive, because it composes Section, Layout, Sketch and Media into one band.

Not: **OfferSheet** (the one-offer sheet with a text foot, which still serves principles, audits,
expertise and the pages without drawings); **Reasons** (argued reasons, each an isometric
illustration); **EngagementOptions** (options plus shared terms, two tiers).

## 2 · Anatomy

Section (the band) > band head (h2, lead) > part seam (column, 64) > Part 1 (h3 "What you receive",
then a `ul` of drawn deliverables: Sketch plate, h4, body) and the peer row (three parts, each h3,
then a 16:9 visual beside or over its words) > optional note.

## 3 · Props / API

`heading`, `headingId`, `lead?`, `deliverablesTitle`, `deliverables` (2 to 6: `title`, `body` or
`bodyHtml`, required `scene`), `parts` (0 to 3: `title`, `body` or `bodyHtml`, `visual`: a photo or a
drawing with an optional scene), `note?`, `surface?` (`paper` default, or `tint`), `id?`.
No `@/content`; it takes what it renders.

## 4 · Variants × sizes

Deliverable tracks from 1024 follow the count (2 to 5; six read three over three). Parts: three on
three tracks, two on two, one beside its own visual. No size prop.

## 5 · States

None. The drawings are not links and nothing responds to a pointer, so the hover-move ruling does
not apply. The only state is a body link's hover colour.

## 6 · Per-surface colour

Paper and tint, and ink and blue declared too (every surface block declares every surface-dependent
token): heading, lead, both title roles, body and body link inks. `tokens/components/offer-parts.css`.

## 7 · Geometry & spacing

Layout gaps only. Band head to parts: stack (48). Part seam: column (64). Part head to content:
block (24). Deliverable gutter: gutter (32); deliverable row seam: stack. Title to body: text (16).
No margins, no hand-rolled grid or flex.

## 8 · Typography

h2 role for the band, h4 for every part title, h5 for a deliverable title, body-sm (14) for every body.
No mono. Tracking pairs with each role.

## 9 · Responsive

From 1024: deliverables one row; peers on their tracks, heads on one line, visuals sharing top and
bottom (`shareRows`). 768 to 1023: one column, each visual the 5 of [5, 6] beside its words. Below 768:
one column, each visual full width.

## 10 · Composition

Imports `@/components` (Section, Layout, Sketch, Media) and `@/lib`. The photograph is passed in as a
`MediaImage`; Media applies the one tone layer and the radius. A drawing is a Sketch plate (16:9), so
the three peer visuals share one box.

## 11 · Accessibility

h2 > h3 (four parts) > h4 (deliverables). Deliverables are a `ul`; the parts are not a list, the
headings carry the structure. Drawings are `aria-hidden`; the words carry the meaning. The photograph
keeps its authored alt.

## 12 · Content edge cases

Long bodies grow their part; `shareRows` keeps heads and visuals aligned. A body with a link
(`bodyHtml`) styles the link. Two to six deliverables; zero to three parts. A drawing part with no
scene renders the empty plate and warns in development.

## 13 · Motion

None.

## 14 · Do's and Don'ts

Do: title every part at one role; keep one body role. Don't: number the parts, rule them, box them,
give the three peers the deliverables' tracks, or borrow a drawing (the terms' scenes are drawn per page).

## 15 · Specimen plan

`/design/offer-parts`: the real product-design words (5 + 3), four deliverables, six, two parts, one
part, an undrawn part, tint. The 14 term drawings are on `/design/sketch` (S.7).

## 16 · New token requests

`--ofp-*` layer (registered in `tokens/index.css`). `PART_TRACK` in `src/lib/image-sizes.ts`.

## 17 · Open questions

None blocking. Follow-up, not blocking: the L2 services and the expertise pages carry the same three
terms and keep the old sheet until their deliverable and needs/stops drawings are drawn.

## Appendix — self-audit

Tier imports flow one way; no margins; no restated sizes; every surface block complete.

## Amendment · 4 Nov 2026 — two parts, and five deliverables read 3 + 2 (status proposed; owner to judge)

- The terms under the deliverables are two or three: the audits' 3 Nov copy has no "What we need", so two is
  a built count, not a gap (the development warning accepts two).
- Never more than four deliverable tracks a row: five read three then two at every width from 1024.
- Below 768 a deliverable's drawing stacks at full width over its words, not beside them.
