# /expertise/content-knowledge-discovery-platforms · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, and appears as the /expertise card cover at 360.
`hero.svg`, viewBox 865 × 584 (about 1.48:1), on healthtech's 545 × 402 floor, so it renders at the family's scale. `gen.mjs` builds it: `node gen.mjs` rewrites `hero.svg`, and env
overrides (`CU`, `CV`, `HT`, `LEG`, `GRID`, `OPEN`, `DOUT`, `LIFT`, `LH`, `CH`, `TABX`, `READER`, `ARMFROM`, `HANDH`, `HANDU`, `FLOOR`, `VB`) are only for trying layouts.
Previews: `preview/hero.png`, `preview/hero.at-600.png`, `preview/hero.at-360.png`.

## The object

The hub has no object for this industry. The chosen object is a **library card catalogue**: the cabinet of small
drawers where every record has one card. It is the real thing people used to search a library, so it reads as
"finding the right material" without a word. It is drawn the way the hub draws its objects (the case, the house, the bag):
white top and front faces, a brandeis-200 side face, brandeis-500 outlines at 1.6. Blue is kept for the product, the
search field.

## Three ideas (each built around one real object)

1. **The card catalogue, one card lifted.** One drawer is pulled out, and the one right card rises clear of the
   others. That card shows its owner, a lime tick for the current version and a link mark for its source. The
   search field lies on the catalogue's top.
2. **An open reference book with its passage cited.** A large open book lies on the floor with one passage marked.
   Beside it, a standing screen shows an AI answer, with a dashed thread back to the passage.
3. **A stamped document tray.** An in-tray of documents holds older faded copies under one crisp current one,
   with a "current" stamp beside it.

**Pick: 1.** The lead says people "pick the right material first time" because every result shows its "owner,
version and source". Idea 1 shows exactly that in one object. The catalogue is the search, the lifted card is the
one result, and the card itself carries the owner, the version and the source. It reads in three seconds as
"they found the right card".

Idea 2 is the round-3 "passage cited" idea redrawn, which Jatin called "not right". It also repeats healthtech's
"object beside a screen" arrangement. Idea 3 is the round-3 stamp idea and only covers the version. It also says
"office paperwork" more than search.

**Against the siblings:** healthtech has a case with an upright phone and a lime pill. Climatetech has a turbine
and a battery feeding a monitor. Edtech has a book staircase. Proptech has a house on a lime tile beside its record.
Commerce and data have a flat tablet with an object rising off it. B2B has an expanding file with tabbed dividers.
None of them uses a cabinet with a drawer pulled out toward the viewer and one item lifted out of a row.
To keep clear of B2B's file, the cards here are plain, with no tabs, and it is the drawer that opens, not a pocket.
This hero has no screen at all. The product is the card itself.

## The drawing

- **Idea:** "When people search, the platform hands them the one right document, and they can see who owns it,
  that it is the current version and where it comes from."
- **Drawn:** healthtech's dotted plate, at healthtech's size (545 × 402, the dashed edge, the soft inset), in a
  viewBox 865 wide like healthtech's, so the catalogue and the pawn render at the family's scale. A white library
  card catalogue stands on it on four short legs: 300 wide, 120 deep, 262 high including the legs (healthtech's
  case is about 290 long). Its front holds eight drawers (two columns, four rows, the low wide drawers of a real
  catalogue), each with a label frame whose bar is a different length (an index of topics, not identical lockers)
  and a round pull. The search field is the one blue product element: a solid brandeis-500 pill lying flat on the
  lid, with a white magnifier drawn in the lid's plane and a white query bar. **The search visibly leads to the
  card:** the magnifier, the connector and the card's tab share one line. A small blue origin dot sits on the
  pill's front edge straight under the magnifier, and one dashed connector (4/4) runs from it on the iso axes,
  forward over the lid, past its edge, and straight down onto the found card's lime tab. The found card is ringed
  in a dotted focus outline (STYLE §4), the "this is the result" mark. The bottom-left drawer is pulled out; its
  stale cards stand in a row, brandeis-50 with brandeis-300 outlines. The found card is lifted clear above the row,
  with two short dashed drop lines to its slot, a true thin brandeis-200 edge on its right and top, and a lime
  guide tab at its top-left (#A1B71F edge, a small neutral-950 tick). It shows a large blue owner avatar with one
  name bar, one text bar, and a blue link mark with a short dashed tail to the card's edge (source). A white client
  pawn stands beside the drawer, just behind its front panel, and a short arm from the shoulder takes the card by
  its lower-left corner.
- **Accent:** one lime, the guide tab of the current card.
- **People:** one client (white, blue outline, light arm in a blue outline growing from the shoulder, round hand,
  healthtech's pawn dimensions and arm weight, at healthtech's scale). The arm is short: about 50 units from its
  root inside the shoulder, about 30 of it visible. No Tcules figure: the idea is the reader finding the right material.
- **Alt:** Isometric illustration for content and knowledge platform design. On a dotted floor stands a white
  library card catalogue of eight labelled drawers, with a blue search field lying on its lid. A dashed line runs
  from the search field, straight down from its magnifier, to one card lifted out of an open drawer and ringed in a
  dotted outline, landing on the card's lime tab that marks it as the current version. The card shows its owner
  and a link mark for its source, while the faded cards stay in the drawer below. A client stands beside the
  drawer and reaches up to take that card.

## Rounds

1. **Healthtech's full 545 × 402 floor, middle-row drawer, reader standing back on the left.** The arm reached
   into empty air, and the composition was heavy at the back right.
2. **Bottom-row drawer.** The reader stood behind the drawer and was half hidden by it.
3. **Right-column drawer, reader in front of the left column.** The reach was short, but the hand covered the
   source mark, and the reader overlapped the drawer's inner wall.
4. **Added the source link mark, lifted the card higher (+20), made the cabinet taller.** This brought the box
   inside 3:2.
5. **Final layout.** The left-column drawer is open and the reader stands clear of it at the front left. The
   floor went to 420 × 370 so the objects fill it. The drawer labels and pulls are smaller, so eight drawers are
   less busy, and the magnifier is larger.
6. **Hand on the card.** The hand was raised above the other cards' tops so it plainly holds the lifted card.
   The reader moved closer, which shortened the arm.

**Checked** at 600 and 360. At 360 the search field, the open drawer, the lifted card and its lime chip all read.
Joins were checked zoomed at 2400:

- The arm grows out of the body, because its outline is masked inside the body.
- The hand touches the card's left edge above the row of cards.
- The drawer's front panel and right wall cover the cards' lower ends cleanly.
- The slot behind the drawer reads as depth.
- The closed drawers' labels pass behind the lifted card.
- Nothing floats, and no line crosses a white body.

7. **Fix pass (critic + blind reader).** The solid blue cabinet read as a server rack or a locker, and the search
   did nothing visible ("manual retrieval"). Redrawn: the catalogue is white, hub-style, lower, on legs; the search
   pill is the only blue; a dashed connector from the search lands on the found card's lime tab, and the pulled
   drawer's label carries a dotted focus outline. The lime chip (read as a toggle) became a lime guide tab on the
   card's top edge. The card's offset outline became a true thin edge face, and the card is lifted clear with drop
   lines. Card cut to avatar + one name bar, one text bar, link + dashed tail. Labels differ in length.
   **Departures from the critic's notes, argued:** two columns of drawers, not three: at three columns the card is
   about 70 units wide and its facts blur at 360; at two it is about 100 and the avatar, the link and the tab read.
   The connector lands on the card's tab rather than on the drawer label: a vertical drop to the label would cross
   the lifted card's face, and ending on the current card says "the search found this one" more directly; the
   label still carries the dotted focus.

**Checked (fix pass)** at 600 and 360: at 360 the blue search pill, the dashed line, the lime tab, the avatar and
the link mark read. Zoomed at 2400: the connector clears the top-left drawer's label and stops on the tab's top;
the pulled drawer's panel has square corners so its walls meet it without a notch; the drop lines stop at the
row; the arm's root sits inside the shoulder and the hand rests on the card's left edge.

8. **Final polish (5 Nov).** Three notes: the drawing sat on a smaller floor (420 × 300, viewBox 656) and so
   rendered larger than its siblings; the client's arm was a long reach (about 90 units) to the card; and the blind
   reader saw manual filing, not search.
   - **Scale:** floor to healthtech's 545 × 402 and viewBox 865 × 584. The catalogue grew to 300 × 120 × 262 so it
     holds the frame at the family's scale. It moved forward on the plate so it does not sit at the back edge.
   - **Arm:** the reader moved from in front of the drawer to beside it, at the card's depth. The legs were
     lowered (12) and the drawers made four low rows, so the card hangs lower. The arm now runs about 50 units
     from inside the shoulder to the card's lower-left corner. The hand takes the corner from below, clear of the
     source link (the link row moved 16 to the right so the hand never sits on it).
   - **Search leads to the card:** the magnifier moved to sit straight above the card's tab, so the magnifier,
     the connector and the tab are one line. The connector starts from an origin dot on the pill under the
     magnifier, and the found card is ringed in a dotted focus outline. The dotted focus on the drawer's label was
     removed, so there is one focus mark: the result, not the drawer.

**Checked (final polish)** at 600 and 360, side by side with healthtech at 360: the plate and the pawns are the
same size in both. At 360 the blue search pill, the dashed connector down to the lime tab, the ringed card, the
avatar and the link mark read. Zoomed: the arm's root is inside the shoulder (masked by the body) and the hand
meets the card's lower-left corner below the link; the drawer's front panel overlaps the reader's right edge, so
the reader stands beside the drawer, not inside it; the origin dot sits on the pill's edge under the magnifier;
the connector stops on the tab's top; the four legs stand on the floor.

## Open points for the owner

- A 3 × 3 catalogue reads more like a classic card catalogue but costs the card's legibility at 360; switch with
  `GRID=3,3` if the owner prefers it.
- A second client, for "one search box for experts and newcomers alike", was left out to keep one idea and avoid
  a queue of pawns.
