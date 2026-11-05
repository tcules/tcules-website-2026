# Reasons

## 0 · Front matter

| | |
|---|---|
| **Tier** | 2 pattern (`src/patterns/`) |
| **Status** | implemented |
| **Token prefix** | `--rsn-*` |
| **Designer / date** | Claude, owner decisions 16 Oct 2026 (why-us mocks rounds 1–4); four reasons 2×2, 22 Oct 2026 |
| **Implements** | Home queue item "Why Tcules: find a standard section type, single fold" (review 15 Oct 2026) |
| **Implemented at** | `src/patterns/Reasons/`, `src/styles/tokens/components/reasons.css`, `public/illustrations/reasons/`, `/design/reasons` |

## 1 · Identity

The "why choose us" band: four argued reasons, set 2×2 (owner, 22 Oct 2026; six before). Three or six are still accepted. Each reason has a title in the reader's words, one
sentence that argues it, and an isometric drawing of its claim. The drawing illustrates the sentence and
carries no data (owner, round 1: the visual is not evidence). Tier 2, because it composes Section, Layout
and Media into one band.

What it is NOT:

- **Not a card set.** Nobody clicks or compares the reasons, so none is framed alone. Linked items use
  BlockCard.
- **Not an offer.** Deliverables, read as one offer beside a testimonial, use OfferSheet.
- **Not a selector.** Situations a reader picks between use Gateway.

The nearest existing pattern is OfferSheet, which has unframed promises under one heading. It has no
drawing slot, no two-tone heading, no action and no split head. Adding those as props would make one
pattern serve two jobs (an offer and an argument), so Reasons is separate.

One per page.

## 2 · Anatomy

| Part | Required | Notes |
|---|---|---|
| eyebrow | optional | mono label above the heading |
| heading | required | the h2, the claim |
| heading-tail | optional | the h2's second clause, stepped back in ink |
| action | optional | slot; in practice a link Button with an arrow |
| set | required | `ul` of 4 items (3 or 6 accepted) |
| item | required | `li`: figure + title + body |
| figure | required unless `bandFigure` | MediaImage, kind `illustration`, decorative |
| band figure | optional | `bandFigure`: one drawing for the whole set at the content width, between the head and the set; the items then draw no figure or proof (owner, 5 Nov 2026; decisions/2026-11-05-why-tcules-principles-one-drawing). `open` and `boxed` only |
| title | required | h3 |
| body | required | one sentence, plain text |
| rule / frame | arrangement | `boxed`: cell rules + rounded frame; `beside`: verticals between columns |

## 3 · Props / API

`id?`, `eyebrow?`, `heading`, `headingTail?`, `headingId`,
`items: { title; body; figure: MediaImage }[]`, `action?: ReactNode`,
`arrangement?: 'open' | 'boxed' | 'beside'` (default `open`), `surface?: 'paper' | 'tint'` (default `paper`; the type rules out ink and blue),
`figureSize?: 'sm' | 'lg'`, item `proof?` and `example?`, `note?`, `lead?`,
`bandFigure?: MediaImage` (one drawing for the set; items then words only; warns in development when items also carry figures or proofs, or under `beside`).
Any count other than 3, 4 or 6 warns in development.

## 4 · Variants × sizes

| Arrangement | From | Set | Item |
|---|---|---|---|
| `open` (mock S1) | four: 2 across from 1024 (a 2×2) · six: 3 across from 1440, 2 from 1024 · below: 1 | no rules; `column` (64) both axes | drawing beside its words, facing them |
| `boxed` (mock C2a + LogoGrid frame) | as `open` | cells ruled between, one rounded frame, cell inset `gutter` | as `open` |
| `beside` (mock C2b, locked from the owner's screenshot) | 1440: head ⅓ beside set ⅔ (split, `section`) · 768–1439: head above · set 2 across from 768 for four (a 2×2), 3 for three or six | verticals between columns only, `stack` rows | drawing above its words from 768, beside below |

The title and body sizes are the same in every arrangement.

## 5 · States

None. Nothing responds to a pointer. The action is a Button and carries its own states.

## 6 · Per-surface colour

Every surface declares heading, heading-tail, eyebrow, title, body and rule inks (`reasons.css`).
Figures are exported per ground: `.paper.svg` on paper and `.paper-deep.svg` on tint. Every occluding
face takes the ground's own colour (§4a). There are no figure exports for ink or blue, so the prop
type admits paper and tint only. The ink and blue token blocks exist because every layer declares every surface.

## 7 · Geometry & spacing

Section padding and column. Head: eyebrow to heading `block`; head to set `stack`; head to action
`stack`, the action on the heading's last baseline. Item: drawing to words `block`, title to body
`tight`. Figure box sizes: 156 × 140 beside the words; 112 (`-sm`) tall at 6:5 above them; 92 (`-xs`) on phones. Four reasons go two across wherever the set has more than one column, so they always read 2×2. Three reasons in `open`/`boxed` go three across from 1440 and one column below, so the boxed frame never holds a hole.
Rules are hairlines.

## 8 · Typography

Heading `--text-h2`. Item title `--text-h5`, the step the home "What we do" cards use four to six
across. Body `--text-body-sm`. Eyebrow `--text-eyebrow`, with mono case.

## 9 · Responsive

Covered in § 4. The phone is one column for every arrangement: each drawing (92) sits beside its words.

## 10 · Composition

The caller passes the action. Figures come from `public/illustrations/reasons/`, drawn with the ch05
isometric kit (`scripts/illustrations/lib.mjs`, left-facing, blue 1.5 line, paper plinths, peridot
carried item). A new reason needs a new drawing made from its own argument; existing scenes are never
reused as stand-ins.

## 11 · Accessibility

`section` labelled by the h2. The heading tail is part of the accessible name, so it must read on
from the heading. The set is a `ul`, and each title is an h3. Drawings have an empty alt (they are
decorative, and the words carry the meaning). The drawing comes first in DOM order but is hidden from
assistive tech, so the reading order is title then body.

## 12 · Content edge cases

- **Titles:** five words or fewer. Six or more wrap to three lines in `beside`.
- **Bodies:** about 14 words. Longer bodies push `beside` past the fold.
- **Counts:** 4, set 2×2. Three and six also fill whole rows; other counts leave a ragged last row and warn.
- **Heading tail:** in `beside`, keep the heading and tail under about 100 characters.

## 13 · Motion

None in the pattern. (The mocks lifted drawings on hover. That was dropped because the items are not
interactive, and motion on a non-control reads as clickable.)

## 14 · Do's and Don'ts

- **Do** draw each figure from its reason's argument.
- **Don't** box one reason.
- **Don't** add icons or numbering.
- **Don't** put the band on ink or blue without figure exports for those grounds.

## 15 · Specimen plan

`/design/reasons`:

1. open, four reasons 2×2 (home)
2. boxed, four reasons
3. beside, four reasons
4. the longest copy (P48 ceilings), beside
5. three reasons, beside, no eyebrow
6. six reasons, boxed
7. six reasons, beside
8. boxed with a bare head
9. tint, open
10. 14b · `bandFigure`: one drawing for the set (/why-tcules principles), open and boxed, on tint
10. tint, boxed

## 16 · New token requests

None at the usage layer. The component layer is `--rsn-*`.

## 17 · Open questions

1. Which arrangement goes on home, and which on service pages? Resolved 22 Oct 2026: home keeps `open` (now 2×2); `beside` 2×2 is the alternative the owner asked to see. The pattern ships all three.
2. Content brief for the content team: `docs/content-proposals.md` P48 (four reasons; a title of five words or fewer and a sentence of about 14 words each). Not blocking.

## Appendix — self-audit

`npm run verify` passes. aria:check passes after a build. Shots at 1440 and 390 show no overflow.
At 1440 every arrangement sits inside the 830 fold (22 Oct 2026, `fold:check /design/reasons`: tallest band 750, four reasons and six).
