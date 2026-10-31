import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/product-design/data-visualisation · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A view for each role.: Defaults, level of detail and actions for each person who opens the dashboard, all drawing on the same figures. */
  'wyg-data-visualisation-view-each-role': undefined,
  /* Every number defined.: What it means, how it is calculated and when it was last updated, agreed with your product and data teams. */
  'wyg-data-visualisation-every-number-defined': undefined,
  /* A comparison for every figure.: Last month, a target, a peer group or a forecast: whatever makes the number mean something. */
  'wyg-data-visualisation-comparison-every-figure': undefined,
  /* Charts, tables, filters and drill-downs: Charts, tables, filters and drill-downs, each chosen for the question it answers. */
  'wyg-data-visualisation-charts-tables-filters-drilldowns': undefined,
  /* Screens for imperfect data.: What people see when figures are missing, late, estimated or partial. */
  'wyg-data-visualisation-screens-imperfect-data': undefined,
  /* Thresholds and alerts: Thresholds and alerts, each paired with the action that follows. */
  'wyg-data-visualisation-thresholds-alerts': undefined,
  /* Views tried with real numbers.: Where a chart only proves itself once data fills it, we build it in code with your data or a realistic sample. */
  'wyg-data-visualisation-views-tried-real-numbers': undefined,
  /* Who does the work: Each view comes from a senior product designer who leads the project and does the design, while an account lead keeps it on schedule. Design */
  'team-data-visualisation': undefined,
  /* What we need from you: The questions each role brings to the screen, someone on your product or data team who can agree what each metric means, and your data or a  */
  'needs-data-visualisation': undefined,
  /* Where our part stops: Pipelines, data models and one-off analysis stay with your data team or BI tool. We design what people see and do with the data, and your en */
  'stops-data-visualisation': undefined,
};
