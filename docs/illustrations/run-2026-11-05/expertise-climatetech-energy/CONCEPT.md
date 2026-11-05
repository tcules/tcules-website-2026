# ClimateTech and energy: hero

Route `/expertise/climatetech-energy`. Also the card cover on `/expertise`. Source: `gen.mjs` writes `hero.svg`
(viewBox 865 × 578, 1.50:1, the same width as healthtech's 865 and shorter than its 651). Previews: `preview/hero.png`, `preview/hero.at-600.png`, `preview/hero.at-360.png`.

## Three ideas (all built around the hub's wind turbine)

1. **Readings, forecast and target told apart.** A wind turbine and a battery feed one energy display, whose
   chart shows the measured line, the dashed forecast and the lime target as three things that are never
   confused; a designer points at it.
2. **A total with its sources.** The turbine, a battery and an EV charger each send a dashed line into one
   reported total on a card, with an approver's tick.
3. **The turbine on the product.** The hub's turbine stands on its product tile, now lifted into a phone
   that shows its live output against tonight's forecast.

## Pick: 1

The page's title says what it designs: energy software "that separates readings, forecasts and targets". Idea 1
draws exactly that sentence, keeps the turbine a visitor saw on the hub, and reads in three seconds as
"energy data, made clear". Idea 2 is narrower (carbon reporting only) and idea 3 needs a second step to read.

This keeps the unreviewed first draft's idea and reworks it: the legend marks and key tiles are gone (they
were noise at 360px), the chart is larger with one lime target line, the battery moved forward-left so the
turbine's feed line is not hidden behind it, both feeds run as nested L-shaped dashed lines into the
display's plinth, the floor is cut tighter so the box comes to about 5:4, and the designer's hand lands on
the chart.

## Fix pass (critic and blind reader, 5 Nov)

- **Target reads as a level.** Two faint brandeis-100 gridlines and the baseline run parallel to it, so the
  eye learns the screen's horizontal. The target is now a flat uncased peridot line (3.6), no #A1B71F casing.
- **Tension and result.** The dashed forecast climbs clearly over the target to tonight's peak, which carries a
  dotted brandeis-500 focus ring. The designer's hand lands where the forecast breaks the target.
- **Energy-specific UI.** The three filler bars are gone; the day axis runs from a sun to a moon (round-3 idea
  A). The sidebar is down to two bars.
- **Battery reads as a battery.** One charge gauge (two thirds full) on the front, a lightning bolt on the
  side face, the two terminals kept.
- **One feed, with ends.** Dash 4/4 at 1.6, starting at a filled node at the turbine's tower foot and one on
  the battery; the battery's line joins the turbine's at a node, and a single line enters a port on the
  display's plinth.
- **Scale.** The display is about 12% smaller and the figure about 25% larger (arm 10, hand r 8, white edge).
- **Turbine.** The nacelle is a small iso box running back from the rotor, hidden behind the hub at the front;
  the duplicated base ellipse is gone.
- **Stage to STYLE.md.** Floor edge dash 6/5 at 1.2, dots filled #8AA5FF, inset filled #EEF2FF, no opacity
  anywhere; measured line 2.2, forecast 2.0.
- Checked at 360: turbine, battery bolt, chart with gridlines, lime target and peak ring all read; the sun and
  moon are small but present.

## Polish pass (family check, 5 Nov: "A is good", polish, keep the idea)

The idea is unchanged: readings, forecast and target kept apart, and tonight's peak caught before it breaks the
target. What changed, from the family check (STYLE.md §9a):

- **Floor = healthtech's.** The same world plate (545 × 402), the same inset (45 in), the same dashed edge (10/8
  at 1.8) and dot field, so the two sit side by side at one scale.
- **The turbine leads.** It is the tallest thing in the picture and stands at the front left (tower 286, blades
  124). The display shrank from a 390 × 222 wall display to a 224 × 168 monitor on a stand, well under the
  healthtech phone (196 × 372) against the same floor.
- **The feed reads as a link.** One dashed line (5/4 at 1.8) leaves a node at the turbine's foot, runs into the
  battery (which stands on it), leaves the battery's side at a node, turns at a corner node, carries two flow
  chevrons towards the monitor, ends at a node on the stand's foot and climbs the neck into the screen. No more
  floating join in the middle of the floor; every end lands on an object.
- **The figure stands clear.** The Tcules designer stands beside the monitor, right of its side face, so the
  body and head never overlap the blue screen; only the arm crosses the bezel, and its 2px white edge holds at
  360. Family height: body 44 wide, head r 16 at 104 above the foot, as healthtech's pawns. The hand lands just
  under the dotted peak ring so the ring stays readable.
- **The chart** fills the smaller screen: the sidebar bars are gone, two gridlines and the baseline remain, the
  peak moved right (to 0.84 of the day) so the arm is shorter.
- **Box** 865 × 680, 1.27:1 (toward 5:4).
- Checked at 600 and 360 beside healthtech: floors match, pawn heights match, the monitor is smaller than the
  phone, and the lime target, the forecast over it and the peak ring still read at 360.

## Family fix (5 Nov, second family check)

Two findings, both fixed; the idea is unchanged.

- **No pointer stick (§5).** The arm reached about twice the body height (152 px) to touch the peak: it read as
  a stick. The figure now stands at the screen, just in front of its left edge, and the arm is a short reach
  from the shoulder (35 px, the healthtech patient's length), up and to the right. To bring the chart into a
  pawn's reach the monitor lost its neck and sits on a low console plinth (16 high), the screen is 150 tall,
  and the hand rests on the start of the lime target, the level the forecast must stay under. The dotted ring
  still marks tonight's peak on its own. The generator places the figure from the hand (`RX`/`RY` reach), so
  the arm cannot grow back. The figure's white edge holds it apart from the blue bezel it stands in front of.
- **Turbine at hub scale.** Tower 286 → 242, blades 124 → 96; the box is 865 × 578 (1.50:1), no taller than
  healthtech (651) or any sibling. The turbine and battery moved forward on the floor (TY 322) and the
  monitor came forward to y 150, so the group sits in the middle of the plate instead of its back half.
- The console's front carries the feed's end node (a port); the feed no longer climbs a neck.
- The measured readings sit lower (×0.55) so the line, the now marker and the dashed forecast stay clearly
  under the lime target until the forecast climbs over it.
- Checked at 600 and 360 against healthtech and the hub: one floor, matching pawn height, the monitor smaller
  than the healthtech phone, no float, joins zoom-checked (hand on the card edge, figure edge on the bezel,
  feed node on the console, battery and turbine nodes).

## Parts

- Floor: healthtech's plate (545 × 402, inset 45, dashed edge 10/8 at 1.8, dots), the family standard.
- Wind turbine, the lead (white, blue outline, three slim blades, blue hub on a small iso nacelle), as on `expertise.svg`.
- Battery block on the feed (white, brandeis-200 side, two terminals, a charge gauge, a bolt on its side).
- One dashed feed (5/4, 1.8) with nodes and two chevrons: turbine foot, through the battery, a corner, a port
  on the console's front.
- The hero object: a light monitor (224 × 150) with a blue screen on a low console plinth with a feed port; a white chart card with
  gridlines, measured line and area to a now ring, dashed forecast over the lime target to a dotted peak ring,
  a sun-to-moon day axis.
- One Tcules designer (solid blue pawn, white edge, one short arm) at the screen's left edge, a hand on the lime target.

## Alt

Isometric illustration for ClimateTech and energy product design. A white wind turbine, as on the expertise hub, stands on a dotted floor. One dashed line runs from its foot through a battery with a charge gauge and a lightning bolt, then on, with arrows, into a port on the low console of a monitor with a blue screen. The screen holds one day chart running from a sun to a moon: a solid line of measured readings stops at a now marker, and a dashed forecast climbs over a flat lime target line to a peak tonight, ringed in dots. A solid blue Tcules designer stands at the screen with a short arm raised, a hand resting on the lime target.
