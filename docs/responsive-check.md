# Responsive check (tracker 6.5)

How the owner reviews the site across widths with the fewest pages, what to look for on them, and
what Claude has already checked so nobody has to look for it.

## The four widths, and why these four

Every layout range on the site is at its tightest at its narrowest width, so that is where it breaks
first. One width per range, at its narrow end, sees every range at its worst:

| Width | Range it is the narrow end of | What changes as you cross into it |
|---|---|---|
| **1440** | wide desktop (1440 and up) | Layout's `xl` tracks. The design width |
| **1024** | desktop (1024–1439) | Layout's `lg` tracks; desktop type; the first band's full top air |
| **768** | tablet (768–1023) | Layout's `md` tracks; the tablet type step (`-t`); first band 48 above its content |
| **390** | phone (below 768) | everything stacks; the phone type step (`-m`); Section padding 96 → 64; first band 32 |

The breakpoints are Layout's (`md` 768, `lg` 1024, `xl` 1440) and the type steps re-declare at 1023 and
767 (`primitives.css`). A width between two of these shows nothing these four don't, only with more room.

In the browser: DevTools → device toolbar → Responsive, and type the width. Height doesn't matter.

## What to look for

Two concerns from the tracker, then the ones that come with stacking. Note what you see. You don't have
to know the cause; finding it is Claude's job.

1. **Type contrast.** Do the steps still read as steps? Hero title vs section title vs card title vs
   body, at each width, and most of all at 768 and 390, where every title steps down. If an h2 and an
   h3 look the same size, or a card title looks like body, note it. The fix is the type ladder (size and
   line height together), never one page.
2. **Grouping on a phone.** At 390, can you still tell what belongs together? A heading sits closer to
   its body than one block sits to the next, and a band's edge is the clearest break of all. If
   everything is evenly spaced and the groups dissolve, note where. The gap scale doesn't change by
   width (CLAUDE.md), so a fix that needs it to is a ruling, not a quick patch.
3. **Order when columns stack.** When a split collapses, the words come first and the picture, form or
   quote follows. Nothing important ends up below something minor, and a head never lands after its body.
4. **Pictures and drawings.** Crops keep their subject; no drawing is shrunk to a smudge; nothing
   overlaps text. No two horizontal media items sit side by side at any width.
5. **Rows and sliders.** A sideways row shows a slice of the next card so it reads as scrollable. Card
   rows wrap or stack evenly, with no lone orphan card at one width that looks wrong.
6. **Chrome that changes shape.** The nav (bar, then the phone sheet), the footer (directory, then
   accordions), breadcrumbs (full trail, then short), the table of contents (rail, then the phone bar),
   tables (across, then down). Open each one once at 390.
7. **Forms on a phone.** Chips wrap cleanly, fields are full width, and the submit button is easy to hit.
8. **Anything that just looks wrong.** Squint at each width. If a page reads as one long column of the
   same shape, say so.

**Claude has already checked** (`npm run shots -- --widths=1440,1024,768,390 --routes=…`), so skip these:
horizontal scroll, and pages that throw errors. 5 Nov 2026, after pass 1: every page above at all four widths, none with a problem.

## The pages: 17 cover everything, 4 cover most

`npm run responsive:census` reads every page in the sitemap (253 on 5 Nov) and finds the fewest that
between them render every component and every CSS rule that changes with the width (174 units). The
list below is the run after responsive pass 1 (5 Nov 2026); rerun the command after big changes, as it
updates itself.

### Pass 1: four pages, the whole page at all four widths (74% of units)

| # | Page | What it carries |
|---|---|---|
| 1 | `/services/design-systems` | the nav and its phone sheet, footer, hero, bento, the tabbed claims, offer sheet, slider, quote, FAQ, enquiry form, close |
| 2 | `/insights` | the listing template: index rail and filters, teaser rows, compact cards |
| 3 | `/` | the home hero, the gateway, case cards, logo grid, testimonial, ratings |
| 4 | `/about` | a photo beside its words, profile cards, the record table, the data table |

### Pass 2: thirteen pages, one band each (the other 26%)

Open each page and look only at the band named. The rest of the page repeats Pass 1.

| # | Page | Look only at |
|---|---|---|
| 5 | `/insights/guides/figma-to-react` | the table of contents (rail, then the phone bar), the summary panel, contributors, panel cards |
| 6 | `/audits/prototype-hardening-review` | the film clips, the status marks, the deliverable as a list and as a table |
| 7 | `/audits` | the wide bento tiles |
| 8 | `/glossary` | the A–Z index |
| 9 | `/expertise` | the centred band and the group headings |
| 10 | `/case-studies/legacy-saas-modernisation-information-architecture` | the case shape (offset column and markers) |
| 11 | `/careers` | the photo collage |
| 12 | `/future-interfaces-lab/join` | the steps with arrows, the tile cards |
| 13 | `/services/product-design/ux-research` | the breadcrumbs (they shorten on a phone) |
| 14 | `/expertise/healthtech` | the quote ledger |
| 15 | `/tools/ai-trust-control-canvas` | the diagram plate |
| 16 | `/audits/product-modernisation-test` | the mid-size quote |
| 17 | `/case-studies/insurance-workflow-software-ux-chestnut` | the figure |

**What the census can't see:** open and expanded states (the nav sheet, an opened FAQ, the gateway's
detail, filters), which is why item 6 above says to open them, and the columns a Layout chooses per
width, which are carried by the components on the list. It also found 135 width rules that no page
uses (specimen-only variants, or dead code). They're out of scope for launch.

## Reporting, and what happens next

One line per note: **page · width · band · what looks wrong**, e.g. "`/about` · 390 · team · the names
read the same size as the roles". For each note Claude finds the underlying cause, fixes it in the
component or token (never the one page), and reports note → cause → fix. A fix that changes a rule
(the type ladder, a gap) is logged with `/decide` in the same PR.
