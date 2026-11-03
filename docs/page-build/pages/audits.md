# /audits and the six audit pages — design pass, 4 Nov 2026 (local, in review)

The 3 Nov outline: What you get, how it runs, **what the report looks like**, **get a report like this**,
cases, quotes, why Tcules, **after the audit**, **other ways to start**, FAQ, enquiry. How we work together
and Industries are cut from the six (they stay on the hub). Composed through OfferPage, as expertise.

## Band → component (the six audit pages)
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside (stacked film on the readiness review) | redirect line after the ask (`actionsNote`); isometric hero placeholders registered for five: **not finished**, the illustration workstream owns them |
| deliverables / gap-map | outcomes · OfferParts | unlabelled deliverables, two term rows (two parts is a built count); scenes wired in `wyg-<slug>.tsx`, undrawn |
| method | method · MethodBand F | one flat figure per audit (`method-<slug>`), undrawn |
| worked-example | **example · ReportBand** (`report`) | tint band, one paper report page; statuses marked (readiness review), finding record + Dealpath head action (UX), rank (AI), trace with bold kept (DS), cause/fix (D2C), answers in label voice + 5-up key (PMA) |
| talk | close · CtaSection ink island | on paper (follows the tint report) |
| selected-work | cases · M | |
| testimonials | quotes · G | |
| why-tcules | reasons | isometric placeholders (illustration workstream): **not finished**, site-wide |
| after-the-audit | text · C-text | the sentence and its links as authored, sized to its words; the shared studio photograph dropped (critic, 4 Nov: an addition, the same picture on all six) |
| compare | router · Bento split tiles | from two rows; odd last tile takes the row (design-system audit) |
| enquiry, faq | L, D-faq | form before FAQ |

## /audits hub
| Band | Kind / component | Notes |
|---|---|---|
| choose | **router** · Bento split tiles (was a ruled table) | five tiles, the fifth the whole row; lead "Pick the row…" kept verbatim (reads slightly off over tiles: owner to judge, words fixed) |
| prototype | related · **wide ServiceTile** with body, `frame="none"` (`service-tile`) | on the band's ground, words start and drawing end, so it is not a second boxed full-row tile under the chooser's (critic, 4 Nov) |
| the rest | unchanged | cases, quotes, engagement options, reasons, industries, enquiry, FAQ |

## Open for the owner
- The report page replaces the 2 Nov tint panel inside What you get with a paper page on a tint band (same
  one-panel content). The panel inside a paper band is the same renderer with the grounds swapped.
- Register adjacency: deliverables (flat) then method (flat) on all six is the copy's order; the planner warns.
- Tile scenes for Coded prototyping, Design QA and the Design-to-Code Audit live in
  `components/Sketch/wyg-glossary-destinations.tsx` (shared with the glossary pages), still undrawn.
