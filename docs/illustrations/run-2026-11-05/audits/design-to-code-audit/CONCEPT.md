# /audits/design-to-code-audit · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, must read at 400. `hero.svg`, viewBox
**865 × 556** (1.56:1), healthtech's floor (545 × 402) and the expertise heroes' 865 width. Generator: `build.py`
(`python3 build.py`). Previews in `preview/`.

## Candidates

1. **Design beside the shipped screen, matched part by part.** The approved design on a monitor and the shipped
   product on a laptop share one desk; dashed lines join each part to the same part on the other screen, and the one
   part that never arrived is an empty dashed place, its line running straight back to where it was designed.
2. **One button carried through the build.** A single component passes design, code and a live screen in a row,
   and drops out at one of them. That is a chain of steps traced back, which the UX audit hero owns.
3. **The magnified gap.** A shipped screen with a lens over one spot where the design shows through. Too close to
   the hub's clear sheet over a screen, and a lens is a "look closer" idea, not a "compare" one.

## The pick: 1

It is the buyer question drawn literally: "why does what we ship keep diverging from what we designed, and where is
the divergence introduced?" Two familiar objects (a designer's monitor, a laptop running the product) and one
visible absence say it in three seconds. It differs from `design-engineering.svg` (two panels at a corner joined by a
lime rod, a figure building between them): here the devices stand side by side on one desk, nothing is being built,
and the picture is about the one line that ends at nothing.

## The idea

"Put our approved design next to what shipped, match them part by part, and the piece that went missing shows up,
traced straight back to where it was designed."

## What is drawn (r6, after the coordinator's fix pass)

- **Floor:** healthtech's plate exactly (dots at 22, brandeis-500 inset at 7% with a 45 inset, dashed edge 1.8,
  10/8).
- **No table, no riser.** Both devices stand directly on the floor, the way fintech's terminal does, so the
  people stand beside them at family scale.
- **The monitor (the approved design):** light body on a foot and short neck, dark blue screen with a design-tool
  bar and three rows: a title (avatar and bars), a full-width picture (hill and sun), and a **wide lime button**.
- **The laptop (the shipped product):** light body and keyboard deck on the floor, dark blue screen with a browser
  bar and the **same three rows**, but where the button should be there is only an **empty lime-dashed outline**.
- **Matching lines:** three dashed lines (title, picture, button), blue over paper and bezel, white over a dark
  screen, a white dot at each end. The laptop's button row is lower than the monitor's, so the laptop stands just
  far enough behind the monitor's plane (dz = 0.9 dy) that the button line runs on the floor's own x axis on the
  drawing: it reads level and crosses nothing. The button spans the row, so its line leaves the design at the
  button's right end and lands on the slot's left end with nothing in between.
- **People:** a client developer (white pawn, light arm outlined in blue) stands at the monitor's left edge with
  a **hand on the lime button**; a Tcules designer (solid blue pawn, white edge) stands at the laptop's right edge
  with a **hand on the empty place**. Each pawn is placed by search: in front of its screen's plane, its body clear
  of the dark screen, at the spot where the arm from the shoulder is 54 long, so the hand lands on the target
  itself. Both arms 11 thick including the client's outline, both hands 8.8.

## Self-check against STYLE.md

| Row | Here |
|---|---|
| Arms from the shoulder, one weight | both start inside the body silhouette; 11 / 8.8 on both figures; both 54 long; each hand on its target |
| White edge on the blue figure | 1.8 white stroke drawn behind head, body and arm |
| Devices | light bodies, brandeis-100/200 sides, only the screens dark blue |
| Accent | lime on the design's button and as the dashed outline of its missing place: both halves of one idea (§4 allows two) |
| Stands on something | monitor on its foot on the floor; laptop deck on the floor; pawns on the floor |
| Lines stop at what they reach | each matching line ends on its part with a dot |
| No text | none; ids prefixed `d2c-`; no `<style>`, no width/height |

## Rounds

- r1–r5: monitor and laptop on one table (later on legs, the laptop on a riser). The idea read, but the people
  were small against the table and their hands pointed into empty air (coordinator's review).
- r6 (fix pass): table and riser dropped; devices on the floor at family scale; the laptop set back so the button
  line stays level; button made row-wide so both people reach its ends; pawns placed by search so each hand lands
  on its target with equal arm length; the row moved forward and the monitor made taller so the lower-left of the
  floor is less bare and the viewBox stays near 3:2; slot dash raised to 3 / 8 5 for 400px. Zoom-checked both hands
  on their targets, the Tcules white edge against the laptop bezel, the monitor neck and foot, the line ends.

## Blind read (400px, as if the copy was unseen)

"A big design monitor and a laptop stand side by side showing the same page; dashed lines join their matching
parts. On the monitor the wide button is lime; on the laptop that button is just an empty dashed outline. One person
has a hand on the lime button, the other a hand on the empty spot: something designed never made it into what
shipped." At 400 the empty outline is the faintest part; it reads because the dashed line and the second hand both
lead to it.

## Alt (on the svg root)

Isometric illustration for a design-to-code audit. On a dotted floor, a monitor showing the approved design stands
beside a laptop running the shipped product, both with dark blue screens laid out the same way. Dashed lines match
each part of the design to the same part on the laptop: the title, the picture, the button. The wide button is lime on
the design, but on the laptop its place is only an empty dashed outline. A client developer standing at the monitor has
a hand on the lime button; a Tcules designer standing at the laptop has a hand on the empty place where it should be.
