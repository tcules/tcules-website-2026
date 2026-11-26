# AutonomyLadder

## 0 · Front matter

| | |
|---|---|
| **Component** | `AutonomyLadder` |
| **Tier** | 2 pattern (`src/patterns/AutonomyLadder/`) |
| **Status** | proposed. Built 17 Nov 2026 (overhaul O.8) to Jatin's Saas-v2 board (`Saas-v2.dc.html` § framework-ai, `m-Saas-v2.dc.html`). Open questions in § 9 are for the owner's review. |
| **Token prefix** | `--ladder-*` |
| **File** | `tokens/components/autonomy-ladder.css` |
| **Implemented at** | `src/patterns/AutonomyLadder/` · specimen `src/app/design/autonomy-ladder/page.tsx` |

## 1 · Identity

How much the software does on its own, step by step: each step a plate filled to the share of the
work the software does, its name, the person's job at that step and one example; an arrow that says
the steps are climbed; a labelled note; and, optionally, the receipt every AI action leaves, drawn as
a torn slip. The B2B SaaS page's "How much should the software do on its own?".

Not Steps (a method you follow) and not a chart: the plates are a flat drawing of one quantity, and
the step's words carry the meaning.

## 2 · Anatomy

| Part | Drawn as | Ink |
|---|---|---|
| Legend | a swatch (fill with its top line) + one line | muted |
| Plate | quiet frame, 1 border, radius 8, 128 tall from 1024, 64 below | plate ground, neutral edge |
| Fill | from the bottom to `share` × 100%, with a 2 top line; none at 0 | brandeis-100 fill, blue line |
| Step | h3 title (h4 role, sans), role (h6), example (body-sm) | ink, muted example |
| Arrow (from 768) | a 2 line with a start dot and a chevron head | blue |
| Note | mono eyebrow label in blue, then a body sentence | muted |
| Receipt | a slip with a torn foot (clip-path teeth), title (h4), `dl` rows with dashed rules, caption under | slip ground per surface |

The plates are `aria-hidden`; the steps are an `<ol>` in order; the receipt is a `<figure>` with a
`<dl>` and a `<figcaption>`.

## 3 · Arrangement

- Steps: `Layout as="ol"`, two columns on a phone, one row of `steps.length` from 1024;
  `colGap="block"`, `rowGap="gutter"`.
- With a receipt: `Layout columns={{ lg: [2, 1] }}`, `colGap="section"` (a split: two regions of
  different kind), `rowGap="stack"` — the receipt under the ladder below 1024.
- Receipt rows: `Layout as="dl" columns={[1, 3]}`, each row's wrapper `display: contents`.

## 4 · Props

| Prop | Type | Default | |
|---|---|---|---|
| `steps` | `readonly AutonomyStep[]` | — | 2–6, least to most; fewer than two renders nothing |
| `legend` | `string` | — | what the fill measures |
| `note` | `{ label: string; body: string }?` | — | absent: no arrow and no note |
| `receipt` | `AutonomyReceipt?` | — | absent: the ladder takes the whole column |
| `stepHeading` | `'h3' \| 'h4'` | `'h3'` | |

`AutonomyStep = { title: string; role: string; example: string; share: number /* 0–1, clamped */ }`
`AutonomyReceipt = { title: string; rows: readonly { term: string; detail: string }[]; caption?: string }`

## 5 · Surfaces

paper, tint, ink, blue — every block declares every token. The board shows tint (white slip, paper plates).

## 6 · States

None.

## 7 · Band

Composed by the caller in a `ContentSection` (eyebrow "The AI dimension", h2, lead).

## 8 · Deviations from the board

- Step titles and the receipt title are sans h4, not serif 24 (h4–h6 are sans by rule).
- Split seam is `section` (96), not the board's 64: copy-beside-object is a split (CLAUDE.md § gap scale 2).
- The arrow shows from 768 (the board hides it below 760).

## 9 · Open questions (none blocking)

1. Should the receipt be its own pattern? The page says "the same receipt shows in Hand over, Govern
   and Grow" — if it appears elsewhere, it should be lifted out.
2. The receipt title is a `<p>`, not a heading (it names a figure). Make it an h3?
3. On paper the slip is paper-deep; confirm (the board only shows tint, where it is white).
