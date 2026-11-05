# /services hero: concept (round 3, rich scene with one route)

Slot: the hero of `/services`, centred under the title, on paper. Wide (the drawing is 1.92:1), rendered up to 860px.

Copy, as authored:
- Title: "UI/UX design services for new and established SaaS, through to working software"
- Lead: "UI/UX design leads every project. When we also build, our designers stay with it until release, and nothing gets lost between design and code."

Owner feedback on the pilot (a blue laptop, three figures, a sketch on the floor): "far too simple. look at the
expertise hub page, it shows many different aspects in one screen. so something similar for the hub page.
additionally the laptop is fully blue which i don't like. that could have a light body with just the screen in
dark blue."

## Candidate ideas

1. **"Every service they offer sits on one bench, from the first wireframe at the front to the working product
   at the back."** A studio bench divided into tiles like the expertise app's cards. Each service is one small
   part in its own tile, and the laptop running the product is the hero object.
2. **"Design is the top layer, and the build stacks up underneath it."** A layered tower: wireframe, components,
   code, database. Clear, but it repeats the software-development hero's stacked layers and cannot hold
   modernisation, mobile or audits without becoming a list.
3. **"Their designers walk the work from sketch to release."** A long road of stations ending in a release.
   Already the first-release hero's shape, and a road reads as one service, not a line of them.

## The pick, and why

**Idea 1, now with one route across the bench:** "Their design starts the work, and the same designers carry it
through to working software." A buyer sees the whole service line at once, the way `expertise.svg` shows six
industries on one app, and one path reads front left to back right: the lime design, then the laptop running the
product, then the phone at release.

Round 3 answers the fix pass (blind reader: "a we-do-everything capabilities slide", no hero, no story; critic:
five dark masses compete, lime reads as a bezel, tile insets look half-populated, connectors fall apart, arms read
as pointers):

- **One hero object.** The light laptop with its dark blue screen. The only other solid blue masses are the phone
  (allowed) and the two Tcules designers. The code panel is now white with a blue outline and blue `< >`.
- **The lime is a board, not a bezel.** A thick lime slab (its `#A1B71F` side face) lifted off the bench on
  dashed drops, with the wireframe laid on it as white parts: a title bar, a sidebar, a main panel and a journey
  ending in a tick. No inner white sheet, so it no longer reads as a tablet.
- **One route, three connectors.** A dashed line from the lime board enters the laptop screen at its lower-left
  edge; a second dashed line runs from the laptop's edge down to the phone. The third is the dotted
  modernisation line (pinned item carried from the earlier screen to the new one). The database cylinders touch
  the laptop's right side, so the back end belongs to the product without a line.
- **Design systems** is the approved tray: one long, low white tray with five parts in a row (pill, field,
  toggle, checkbox, card), along the front edge.
- **Audits** lose the magnifier. Two target markers (blue ring, centre dot) sit on the faded earlier screen, so
  it carries modernisation and audit, as the two approved heroes do.
- **The earlier screen stands on a monitor stand** (base plate and neck in brandeis-50/300), a full 1.6 outline
  and a 100 title strip, so it reads as an earlier version, not unfinished.
- **Arms** are short and horizontal, grown from the shoulder, the round hand resting on the object beside the
  figure (as on the home hero): designer 1 stands at the lime board's front-left corner, hand on its edge;
  designer 2 stands beside the phone, hand on its right edge, never across its face.
- **No tile insets.** The bench is one plain slab; the floor's back edge moved out so the laptop-to-phone line
  no longer runs parallel beside it.

## Parts

| Part | Service it stands for | What it says |
|---|---|---|
| Lime board, lifted, the wireframe in white parts, a journey to a tick | Product Design | design comes first and is the thing that matters |
| A Tcules designer, hand on the lime board's corner | the lead | a designer leads |
| Dashed line from the board into the laptop screen's lower-left edge | Design to code | nothing gets lost between design and code |
| Laptop: light body, dark blue screen running a product (sidebar, chart, cards) | Software Development, SaaS apps, front end | working software, the hero object |
| AI panel with the AI badge on the screen | AI Product UX | AI is part of the product |
| Database cylinders against the laptop | back end and APIs | the build goes all the way down |
| Faded earlier screen on its stand, one item carried by a dotted line | Product Modernisation | the old product, rebuilt, its key item kept |
| Two target markers on the earlier screen | Audits | issues found in what exists |
| Long tray of five parts | Design Systems | the system of parts |
| A component beside its white code panel with `< >` | Design Engineering | the component and its code side by side |
| Dashed line from the laptop to a blue phone, a second Tcules designer at it | mobile, Design-led MVP / first release | the designers stay until it ships |

House rules kept: one lime accent; one hero object; the phone may stay blue (owner, 5 Nov); solid arm grown from
the shoulder with a round hand and no casing; no words except the AI badge and `< >`; palette limited to the
STYLE.md table; floor diamond with dashed edge, dots and the 50 inset; `viewBox` trimmed, no width or height, no
`<style>`, no `<text>`, the one id prefixed (`svcHeroDots`).

## The drawing

- **File:** `hero.svg`, generated by `hero.gen.mjs`
  (`node docs/illustrations/run-2026-11-05/services/hero.gen.mjs docs/illustrations/run-2026-11-05/services/hero.svg`).
- **Preview:** `preview/hero.png` and `preview/hero.at-860.png`.
- **Rounds:** round 2 (1–5) built the bench; round 3 is the fix pass above. Zoom checks at 1800: the arm
  hands land on the lime side face and the phone's edge; the tray and the code pair are parted; the
  laptop-to-phone line clears the cylinders and the floor edge; the dotted line starts at the pinned item's
  right edge.

## Alt text

One bench holds the whole service line, with one route across it. At the front left, a Tcules designer holds a
lifted lime board with a wireframe laid out on it, and a dashed line runs from it into the screen of a laptop at
the back: a light laptop whose dark blue screen shows a working product with a chart, cards and an AI panel. From
the laptop a second dashed line runs on to a blue phone, where a second Tcules designer stands with a hand on it.
Database cylinders sit against the laptop. Beside it stands a faded earlier screen on its stand, two issues
marked on it and one item carried across to the new screen by a dotted line. Along the front edge lie a tray of
five interface parts and a component beside its code panel.
