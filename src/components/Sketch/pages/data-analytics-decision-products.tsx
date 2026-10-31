import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/data-analytics-decision-products · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A definition for each figure: A plain definition, scope and freshness rule for each figure that matters, agreed before any chart is drawn */
  'wyg-data-analytics-decision-products-definition-each-figure': undefined,
  /* Views at different depths: Views for analysts, managers and customers at different depths, on the same definitions */
  'wyg-data-analytics-decision-products-views-at-different-depths': undefined,
  /* Charts that show their baseline: Reports, scores and charts that show their baseline and what they rest on */
  'wyg-data-analytics-decision-products-charts-show-their-baseline': undefined,
  /* The next step beside the figure: The next step placed beside the figure that prompts it */
  'wyg-data-analytics-decision-products-next-step-beside-figure': undefined,
  /* Screens for missing and late data: Screens for missing, late, partial and restricted data */
  'wyg-data-analytics-decision-products-screens-missing-late-data': undefined,
  /* Saved views and filters: Saved views and filters in place of one-off custom reports */
  'wyg-data-analytics-decision-products-saved-views-filters': undefined,
  /* Prototypes with realistic figures: Prototypes with real or realistic figures, because tidy sample numbers hide the hard cases */
  'wyg-data-analytics-decision-products-prototypes-realistic-figures': undefined,
  /* Who does the work: The work is led by a senior product designer who does it hands-on, and an account lead keeps it on course. Design engineers build the views  */
  'team-data-analytics-decision-products': undefined,
  /* What we need from you: The questions each role opens the product to answer, your data team's time on definitions, real data or a realistic sample, your usage analy */
  'needs-data-analytics-decision-products': undefined,
  /* Where our part stops: Pipelines, warehouses, metric calculations and models stay with your data team or BI vendor.One dashboard or chart set people misread may ne */
  'stops-data-analytics-decision-products': undefined,
};
