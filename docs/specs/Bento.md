# Bento

## 0 · Front matter

| | |
|---|---|
| **Tier** | 2 pattern (`src/patterns/`) |
| **Status** | implemented |
| **Token prefix** | `--bnt-*` |
| **Designer / date** | Claude, owner decisions 19 Oct 2026 (What we do mocks, references round, S1–S3 v1–v13) |
| **Implements** | Home queue item "What we do: hover tile grid; indent optically off; title and description steal weight" (review 15 Oct 2026), and the plan in `decisions/2026-10-19-no-hover-only-grounds` |
| **Implemented at** | `src/patterns/Bento/`, `src/styles/tokens/components/bento.css`, `public/textures/bento-wave-*.svg` (`scripts/bento-waves.mjs`), `/design/bento` |
| **Mocks** | references https://claude.ai/artifact/UddfwEVAWfhuWe6g8iCsXp · directions https://claude.ai/artifact/SkS1Zngh96SnziuKxZnUFj (S3 is the build) |

## 1 · Identity

A set of linked tiles of two sizes on four tracks. Each tile is a destination's name, one or two lines
on what it is, and its own Sketch scene. It is a services section: the reader sees every service at once
and goes to one. The model is Supabase's product grid (owner, 19 Oct 2026: "find a visually good example
for the section and copy it here").

The asymmetry carries the content's weight rather than decoration. On home the band's own lead says
"Product Design is at the heart of every project", so Product Design takes the wide tile at the start, and
Software Development the wide tile at the end. The four services that apply Product Design sit between.

What it is NOT:

- **Not BlockCardSet.** A BlockCardSet's peers are equal, one shape repeated. A Bento's two sizes are its
  statement, its tiles are boxed, and a texture runs behind the whole set. Adding those as BlockCardSet
  props would give one pattern two looks, which `decisions/2026-10-11-card-variants-stay-distinct`
  rules out.
- **Not a selector.** Situations a reader recognises use Gateway.
- **Not Reasons.** Nobody clicks a reason.

One per page.

## 2 · Anatomy

| Part | Required | Notes |
|---|---|---|
| tile | required | the link and the frame: hairline at rest, 16 radius, 24 inset (32 in a wide tile) |
| title | required | h5 in a single tile, h4 in a wide one (both sans) |
| body | required | body-sm, one or two lines |
| drawing | required | the destination's Sketch scene, `frame="bare"`, `weight="light"` |
| texture | always | the pixel grid through the row's wave, behind the drawings |

No icon. The drawing is the tile's visual (owner, 19 Oct 2026; `decisions/2026-10-19-drawn-tile-carries-no-icon`).

## 3 · Arrangement

- Four tracks from 1024 (`gutter` 32 between tiles both ways), two from 768, one below.
- A tile spans one or two tracks. Each row of four must fill exactly; the set warns in development if one
  does not.
- **Single tile:** a stack: words, then the drawing pinned to the tile's foot at the words' left edge, at
  scale .7 of its drawing units.
- **Wide tile:** words and drawing side by side (`[1, 1]`, `gutter`), the words at the top, the drawing
  centred in its half at scale 1.3, inset 32 from 768. From 768 to 1023 a wide tile takes a row of its own; below 768 it stacks like a single tile.

## 4 · The texture

The site's pixel grid (`public/textures/pixel-grid.svg`), never another symbol (owner, 19 Oct 2026).
From 1024 each row of tiles has one wave (`bento-wave-row-a.svg`, then `row-b`, alternating), drawn across
the whole row, so the field reads as one band behind the set. Each tile is a window onto its row: the wave
and the grid are offset by the tile's track (`data-col`, against the set's width in `cqi`), so the wave
runs on across the seams and the grid's cells line up. Below 1024 each tile takes `bento-wave-tile.svg`,
fitted to itself.

The waves follow the owner's sketch over the v6 mock. Their points live in `scripts/bento-waves.mjs`,
which writes the SVGs; `--check` fails if a committed file is out of date.

## 5 · States

One state, hover, which keyboard focus also gets (plus a 2px ring at a 2px offset). Every part moves on
the owner's curve (`--duration-slow`, `--easing-ease`) both ways:

| Part | Rest | Hover |
|---|---|---|
| tile | in place | lifts 2px |
| hairline | neutral-200 | brandeis-100 |
| texture | neutral-500 | brandeis-400 (the other tiles stay neutral) |
| title | neutral-900 | brandeis-500 |

No shadow. Reduced motion drops the lift and keeps the colours.

## 6 · Tokens

`tokens/components/bento.css`. Geometry: radius, rule width, title and body roles, the three drawing
scales, texture strength (.8 of the grid's measured alphas), lift, duration, easing, ring. Per surface
(paper, tint, ink, blue): rule ink and its hover, title ink and its hover, body ink, texture ink and its
hover, ring colour.

## 7 · Owner decisions (19 Oct 2026)

1. Layout: Supabase's asymmetric grid over Customer.io's ruled six-box (references round, then S1/C1).
2. Software Development's line cut to its opening clause, one or two lines like the others (`docs/content-changes.md`).
3. A texture behind the drawings, "a little character"; light blue and soft, then continuous across each
   row from the owner's sketch, clipped clean by every tile; no hard edge; lighter, twice.
4. Neutral texture at rest, blue on the hovered tile.
5. Hover: a brandeis-100 hairline and a 2px lift, no shadow (a blue shadow was tried and dropped).
6. Light strokes on the drawings. 24 inset and the drawing at the left on single tiles; 32 on wide tiles,
   whose drawings are larger.
7. No icons: the drawings guide the eye.

## 8 · Open

- The drawings' own hover motion (one story per scene, two states, then the motion, as the Gateway's) is
  not designed yet. Today the tile moves; the scene does not.
- About, the offer pages and the service-page router still use BlockCardSet `frame="box"`. Retiring it is
  the follow-up `decisions/2026-10-19-no-hover-only-grounds` plans.
