# The illustration style, from the 10 approved heroes

**Status:** working guide for the 5 Nov 2026 illustration run (TRACKER 2.61). Not a ruling. Owner, 5 Nov 2026:
"all older rules are loose. consistency is appreciated." The standard is the ten approved hero drawings in
`public/illustrations/heroes/` (previews in `references/`). Where this guide and those drawings disagree, the
drawings win. ch05 §4 and the older illustration rulings are background, not constraints.

The goal, in the owner's words: **"relevant, clear, straightforward drawings that are elegant, beautiful,
polished."**

## 1 · The idea

- **One idea, from the slot's own words.** Write the idea as one sentence a buyer would say back ("they show
  every person around a patient the same next step") before drawing anything. If it needs a second sentence,
  it is two ideas.
- **Relevant and literal enough to read in three seconds.** A reader who never saw the copy should name the
  subject. A clever metaphor that needs explaining has failed.
- **Real-life objects are welcome** (owner, 5 Nov 2026): a house, a wind turbine, books with a graduation cap,
  a bank card, a shopping bag, a medical case, database cylinders, a phone, a desk object. Draw them as simple
  isometric volumes in the house palette, the way `expertise.svg` and `services-software-development.svg` do.
- **Minimal, at the right scale.** An item-scale drawing (a card, a small figure) takes three to six elements.
  Jatin, 30 Oct: "everything stays minimal": keep only the details the idea needs.
- **Rich scenes for hubs and important pages** (owner, 5 Nov 2026, on the `/services` pilot: "far too simple.
  look at the expertise hub page, it shows many different aspects in one screen"). A hub hero (`/services`) and
  a band-wide drawing on an important page (`/why-tcules`) show several aspects in one screen, organised on one
  base the way `expertise.svg` puts six industries on one app: roughly 6–12 elements, each small part still
  simple, one clear hero object holding them together. Rich is not busy: every part is there to say something,
  and the picture still reads in three seconds.
- **No words.** Text is rounded bars. No numbers, no logos, no client screens. The only lettering allowed is
  the small "AI" badge on something an AI made, and the code brackets `< >`.

## 2 · The stage

- **2:1 isometric** (the parallel projection every hero uses; verticals stay vertical).
- **The floor diamond:** a large rhombus with a **dashed brandeis-500 edge** (dash about 6/5, stroke 1.2),
  a field of small **brandeis-300 dots** at a wide pitch, and a soft **brandeis-50 inset** shape under the
  objects. It is the family's signature ground. A small figure (a principle's drawing, about 400px wide) keeps
  the inset and may drop the dots, which turn to noise when small.
- **Composition:** objects sit on or rise from the floor; the picture is cropped to the drawing's own bounds
  (`viewBox` trimmed, no empty margin). Never cropped through an object.

## 3 · Objects

- **One hero object, solid brandeis-500**, with a visible thickness edge in brandeis-600/700. It is the thing
  the idea is about: the phone, the screen, the slab, the control bar.
- **Everything else is white with a brandeis-500 outline**, and side faces in brandeis-100/200. Faded or
  earlier things drop to brandeis-300 outlines and brandeis-50 fills.
- **Devices** (owner, 5 Nov 2026): a laptop or a monitor has a **light body** (white faces, brandeis-100/200
  sides, blue outline) with **only the screen in dark blue**. A fully blue laptop is not wanted. A phone may
  stay solid blue.
- **Rounded corners** on screens, cards, slabs and buttons (about 8–12 on a screen, pills for buttons).
- **Thickness:** one side-face shape per edge, two flat tones. Never a stack of copies, never a gradient,
  never a shadow.
- **UI shorthand:** rounded bars for text (brandeis-200/300 on white; white or brandeis-200 on blue), circles
  for avatars, simple glyph marks (heart, cross, tick, clock, pin). Kept sparse.

## 4 · The accent

- **One peridot-400 (`#D7F04A`) fill on the one thing that matters**: the chosen row, the pressed button, the
  open lid. Its side face is `#A1B71F`. One accent per drawing; two only when both halves of one idea need it.
- **No thick lime rings and no thick cased lime rods** (Jatin and Bhumika, 30 Oct: "this could be lighter").
  To mark focus without fill, use a dotted brandeis-500 outline.

## 5 · People

- **The pawn:** a rounded cylinder body and a round head, standing on the floor.
  **Solid brandeis-500 = the Tcules person; white with a blue outline = the client's people.**
- **The arm** (owner, 5 Nov 2026), as on the home hero (`public/illustrations/home/arena.svg`): one solid
  stroke in the figure's own colour, **no white casing and no outline**, growing out of the shoulder (it starts
  inside the body's silhouette, so arm and body read as one shape), about a quarter of the body's width thick,
  with a round cap and a round hand (a filled circle about 1.6× the stroke) at its end. A cased line reads as a
  stick held by the figure.
- **Who is who** (owner, 5 Nov 2026): **blue figures are Tcules people; white or light-blue figures are
  clients** (and their users). A client's arm and hand are in the client's own colour, **white or light blue,
  outlined in blue**: the same shape as the Tcules arm (from the shoulder, round cap, round hand), drawn as a
  light stroke inside a brandeis-500 outline, never a solid blue stroke.
- **One arm weight** (owner, 5 Nov 2026: "white figurines have thicker hands than blue ones. match the
  weight"). In one drawing, a client's arm *including its blue outline* is exactly as thick as a Tcules arm,
  and the two hands are the same size. The client's light core is thinner by twice the outline.
- **Tcules figures carry a white outline** (owner, 5 Nov 2026: "so they can read separate from other blue
  elements that overlap"). Head, body and arm of a blue figure are edged in white (about 1.5–2 at hero scale,
  `paint-order: stroke` or a white shape behind, so the blue shape keeps its size), so a figure standing in
  front of a blue screen or slab never merges with it. Client figures keep their blue outline.
- **Never a crowd of blue.** A scene does not hold four blue figures. Where a scene shows how Tcules works with
  clients, pair them: one Tcules figure beside one client figure, working on the same thing (owner, 5 Nov 2026,
  `/why-tcules`: "3 pairs so it shows that we work directly with the client").
- A headset or a hand is allowed where the role needs it (support agent; a hand pressing a button, as in
  `ai-copilots-agents.svg`).
- People are scale and role, not decoration: include one only when the idea is about who does what.

## 6 · Lines and connectors

- Outlines **1.6** on objects, **1.2** on inner detail. Nothing thicker than **2.2** except a deliberate
  solid fill edge. `stroke-linejoin="round"`, `stroke-linecap="round"`.
- Dashed **brandeis-500** connectors (about 4/4) show "this goes to that" or projection; dotted for focus.
  Lines may run on any angle (the old iso-axes rule is loose), but prefer the iso directions where a line
  runs between two objects, and stop every line at the edge of what it reaches.

## 7 · Palette (exact values; nothing else)

| Token | Hex | Use |
|---|---|---|
| brandeis-500 | `#0048FF` | outlines, the hero object, dashed floor edge, pawns |
| brandeis-600 | `#003EE0` | side face of a solid blue object |
| brandeis-700 | `#0031B0` | deeper side face, small dark detail on blue |
| brandeis-300 | `#8AA5FF` | floor dots, faded outlines |
| brandeis-200 | `#B8C8FF` | side faces of white objects, text bars |
| brandeis-100 | `#DBE4FF` | pale fills, panels |
| brandeis-50 | `#EEF2FF` | floor inset, palest fills |
| white | `#FFFFFF` | object faces |
| peridot-400 | `#D7F04A` | the one accent |
| peridot dark | `#A1B71F` | the accent's side face |
| neutral-950 | `#1B1B18` | only a tiny mark on peridot (a bar on a lime button) |

The page ground is not drawn: the SVG is transparent. Paper is `#fffefa`; a tint band is paper-deep
`#f3f1ea`, and a drawing for a tint band must hold up on it (white faces read as lighter panels there).

## 8 · Sizes

| Slot | Box | Rendered at |
|---|---|---|
| Hero, beside the copy (expertise pages) | about 5:4 to 3:2, `viewBox` trimmed to the drawing | about 560–620px wide |
| Hero, centred under the title (`/services`, `/expertise`) | wide, about 16:9 to 2:1 | up to 860px wide |
| A band-wide drawing (`/why-tcules` principles) | wide, about 2:1 to 3:1 | up to the content width, 1180px |
| A principle / reason figure | 458 × 402 box, the drawing start-aligned in it | about 400px wide |

Judge every drawing at the size it renders. A detail that vanishes at 400px is cut, not shrunk.

## 9 · A set

Drawings that share a band (the three `/why-tcules` principles) are one set: the same box, the same floor,
the same scale of objects, one hero object each, and **each with a different centrepiece**, so the three
read as siblings and never as one picture repeated. A page's hero idea is not reused on another page.

## 9a · The expertise family (owner, 5 Nov 2026: "A is good", polish, keep each idea)

The twelve industry heroes are one family, children of `expertise.svg`. Each is built around its industry's
object from the hub (card, wind turbine, cap on books, house on its lime tile, shopping bag, medical case);
an industry the hub has no object for gets one real object drawn in the same way. Simple is right here: one
idea per page, not a rich scene. What makes them one family:

- **One floor:** healthtech's, the standard: the dotted plate, the brandeis-50 inset, the dashed edge, wide
  enough to hold every object with air around it.
- **One scale:** the hub object and the product (a phone, a screen) at the scale of the hub drawing and the
  healthtech hero. No oversized card or wall display.
- **Everything stands on something.** Nothing floats unless it is plainly lifted with dashed drop lines.
- **At least one person**, by the people rules (§5); a Tcules person works beside a client where the idea is
  about working together.
- **No shared formula.** Healthtech owns "hub object on the left, blue phone on the right, lime pill button";
  no other industry hero repeats that arrangement. Vary where the object sits and what the product is
  (phone, laptop, wall screen, tablet, a printed thing) so siblings never look alike.
- **One screen at most**, unless the idea is two people's views of the same thing.
- **Box:** 5:4 to 3:2, the viewBox trimmed; it must read at 360px as the industry's card cover on /expertise.

## 10 · Files

- Hand-written SVG, `viewBox` trimmed, no `width`/`height` attributes, no `<style>`, no ids that could clash
  on a page (or prefix them with the drawing's slug), no external references, no `<text>`.
- Preview: `node scripts/illustrations/preview.mjs --ground paper <out-dir> <file.svg>` (add
  `--ground paper-deep` for a tint band and `--small 400` to see it at the size it renders).
