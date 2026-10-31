import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/climatetech-energy · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Each role's view of the same figures: Each role's view of the same figures, at the depth that role needs */
  'wyg-climatetech-energy-each-roles-view-same': undefined,
  /* Readings, forecasts and targets marked apart: Readings, forecasts and targets marked apart, with scenarios shown against a stated baseline */
  'wyg-climatetech-energy-readings-forecasts-targets-marked': undefined,
  /* A digital twin or site view: A digital twin or site view that shows which assets matter now */
  'wyg-climatetech-energy-digital-twin-or-site': undefined,
  /* Totals that open onto their sources: Carbon and emissions totals that open onto their sources, estimates and approver */
  'wyg-climatetech-energy-totals-open-onto-their': undefined,
  /* The limits people set, and a morning view: The limits people set for automated actions, and a morning view of what the system did */
  'wyg-climatetech-energy-limits-people-set-morning': undefined,
  /* A coded demo on sample data: A coded demo on sample data, so the direction is agreed before live integrations exist */
  'wyg-climatetech-energy-coded-demo-sample-data': undefined,
  /* Specs your engineers build from: Specs your engineers build from, or Tcules developers taking it into production */
  'wyg-climatetech-energy-specs-engineers-build-from': undefined,
  /* Who does the work: Your energy product gets a senior product designer who leads the design and does it, while an account lead keeps the project moving. Design  */
  'team-climatetech-energy': undefined,
  /* What we need from you: Each role's real questions, from the operator, the finance lead and the sustainability lead. The data you have today, measured or modelled,  */
  'needs-climatetech-energy': undefined,
  /* Where our part stops: Data pipelines, forecasting models and device integrations stay with your data and engineering teams. Which reporting rules apply is for you */
  'stops-climatetech-energy': undefined,
};
