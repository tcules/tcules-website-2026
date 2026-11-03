# Collage

## 0 · Front matter

| | |
|---|---|
| **Tier** | 2 pattern (`src/patterns/`) |
| **Status** | implemented |
| **Token prefix** | none (no component layer: every value is a gap step or the `--radius-8` primitive) |
| **Designer / date** | Owner (Devagya), 3 Nov 2026: mock "Studio collage" Direction A, revised by the owner; photos, crops and zoom picked in the collage picker |
| **Implements** | The ask of 3 Nov 2026, for home's "The people behind Tcules" band: "a collage for the people behind tcules … like a bento with varying sizes … L shape so the section title and body sit in one corner and images surround it" |
| **Implemented at** | `src/patterns/Collage/`, `Media`'s `zoom`, `src/templates/CorpusPage/HomePage.tsx` (`PEOPLE_COLLAGE`), `/design/collage` |

## 1 · Identity

A band's heading and words in the top-left corner, with six studio photographs around them in an L: one large frame beside the copy, then a row of three equal thirds under both. The middle third is a wide frame over two small ones. It is a pattern because it composes `Layout` and `Media` around a content shape.

What it is NOT:
- **Not a gallery or a photo list.** It has exactly six named tiles, and a set of N photos is a `Layout` of `Figure`s.
- **Not `ContentSection`'s media split.** Use the split for one photograph beside the copy.
- **Not `Bento`.** Bento's tiles are links with titles. Nothing here is clickable, and nothing sits on a photograph.

## 2 · Anatomy

Heading (h2 by default) and the caller's body, then `lead`, `start`, `middle`, `middleStart`, `middleEnd` and `end`. Each tile is a rounded clipping frame holding one `Media` with `fit="fill"` and `edge="placement"`.

## 3 · Props / API

`heading`, `headingId?`, `headingAs?: 'h2' | 'h3'`, `children` (the body), `actions?` (the band's links, under the words), and `photos: { lead, start, middle, middleStart, middleEnd, end }`. Each photo is `{ image: MediaImage; focus?: MediaFocus; zoom?: number }`. All six are required.

`focus` and `zoom` describe how this placement crops the photo, not the photo itself, so they never go on the catalogue record. `zoom` is a new `Media` prop: it scales a cropped photograph, under `fill` or `ratio` inside a box that clips it, by 1 to 2 around the focal point. The srcset `sizes` grow by the same factor.

## 4 · Variants × sizes

None. It is one arrangement (owner, 3 Nov 2026).

## 5 · States

None. Nothing is interactive.

## 6 · Per-surface colour

None. The tiles paint no ground, and the photographs sit on the band's surface (see the tint specimen).

## 7 · Geometry & spacing

| Distance | Value | Why |
|---|---|---|
| Copy to lead (from 1024) | `section` (96) | Copy beside a photograph is a split (gap rule 2). |
| Copy over lead (below 1024) | `stack` (48) | Block to block. |
| Photo to photo, both axes | `text` (16) | So the six read as one collage. Ruling `2026-11-03-studio-collage`. |
| Heading to body | `block` (24) | Head to body. |

Minimum shapes:
- `lead`: 3:2, growing with the copy.
- `middle`: 3:2.
- `middleStart` and `middleEnd`: 3:4 (square below 768).
- `start` and `end`: 4:3 below 768. From 768 they take the middle third's height.

Corners use `--radius-8`, the photograph radius.

## 8 · Typography

The heading is a bare h2/h3 on the global composite. The body is the caller's (Prose).

## 9 · Responsive

- **From 1024:** the copy is in a [5, 7] split beside the lead.
- **768 to 1023:** the copy sits over the lead, and the lower row is still three thirds.
- **Below 768:** everything stacks, and the two small frames stay side by side.

## 10 · Composition

The template places it in a `Section` labelled by `headingId`. Today that is home's "The people behind Tcules" (`data-band="B-collage"`), its "See the studio" link in the `actions` slot.

## 11 · Accessibility

Only the lead carries alt text ("The Tcules team together in the Ahmedabad studio"). The other five are the studio's atmosphere and take `alt=""` (ch05 §7). The heading is a real h2 with an id for the band's `aria-labelledby`.

## 12 · Content edge cases

- One paragraph: the lead keeps its 3:2 floor.
- Four paragraphs: the lead stretches with the copy, and the lower row moves down with it.
- The specimen renders both.

## 13 · Motion

None.

## 14 · Do's and Don'ts

Do pick each tile's photo and crop by eye. Don't put type on a photograph, and don't add a seventh tile.

## 15 · Specimen plan

`/design/collage`:
1. Home's copy with the owner's picks.
2. One paragraph.
3. Four paragraphs (stress).
4. On tint.

## 16 · New token requests

None.

## 17 · Open questions

None blocking. The photo tone layer (`--media-photo-grade`) still ships `none`, and the treatment is to be made in Figma.

## Appendix — self-audit

- No hand-rolled grid: the arrangement is nested `Layout`s.
- No child margins.
- No raw px in the module. The percentages are minimum shapes.
- `npm run verify`, `build` and `aria:check` pass.
