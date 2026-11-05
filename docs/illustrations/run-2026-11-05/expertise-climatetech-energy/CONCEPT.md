# ClimateTech and energy: hero

Route `/expertise/climatetech-energy`. Also the card cover on `/expertise`. Source: `gen.mjs` writes `hero.svg`
(viewBox 783 × 653, about 1.2:1). Previews: `preview/hero.png`, `preview/hero.at-600.png`, `preview/hero.at-360.png`.

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

## Parts

- Floor: dashed brandeis-500 edge (6/5, 1.2), brandeis-300 dots, brandeis-50 inset.
- Wind turbine (white, blue outline, three slim blades, blue hub on a small iso nacelle), as on `expertise.svg`.
- Battery block (white, brandeis-200 side, two terminals, a charge gauge, a bolt on its side).
- One dashed feed (4/4, 1.6) with nodes: turbine foot and battery join, then enter the display's plinth port.
- The hero object: a light monitor with a blue screen; a white chart card with gridlines, measured line and
  area to a now ring, dashed forecast over the lime target to a dotted peak ring, a sun-to-moon day axis.
- One Tcules designer (solid blue pawn, white edge, one arm) pointing where the forecast breaks the target.

## Alt

Isometric illustration for ClimateTech and energy product design. A white wind turbine, as on the expertise hub, and a battery with a charge gauge and a lightning bolt feed one dashed line across a dotted floor into a port on a large energy display. Its blue screen holds one day chart running from a sun to a moon: a solid line of measured readings stops at a now marker, a dashed forecast climbs over a flat lime target line to a peak tonight, ringed in dots. A solid blue Tcules designer points at the spot where the forecast breaks the target.
