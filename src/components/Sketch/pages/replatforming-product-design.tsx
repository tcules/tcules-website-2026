import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/product-modernisation/replatforming-product-design · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Each feature's fate.: Moved as it is, fixed on the way, moved later or left behind, decided feature by feature with a reason. */
  'wyg-replatforming-product-design-each-features-fate': undefined,
  /* The months in between, designed.: Who sees which version, where their records live and how support tells the versions apart. */
  'wyg-replatforming-product-design-months-between-designed': undefined,
  /* A plan for saved work.: What happens to customers' saved views, filters, reports, roles and drafts, agreed item by item with your engineers. */
  'wyg-replatforming-product-design-plan-saved-work': undefined,
  /* Names that still make sense.: Renamed features and moved settings carried over or explained, so help articles, training and habits survive the move. */
  'wyg-replatforming-product-design-names-still-make-sense': undefined,
  /* Risky interactions tried in code: Risky interactions tried in code on the new platform, before the wider rollout. */
  'wyg-replatforming-product-design-risky-interactions-tried-code': undefined,
  /* Help with the platform choice: Help with the platform choice, if you start early enough: the workflows and saved work customers rely on, mapped so each candidate platform  */
  'wyg-replatforming-product-design-help-platform-choice': undefined,
  /* Who does the work: A senior designer runs the customer side of the move and does the design, and our engineers build the risky interactions on the new platform */
  'team-replatforming-product-design': undefined,
  /* What we need from you: The workflows and saved work customers rely on, the chosen or candidate platforms, and time with the engineers running the migration. */
  'needs-replatforming-product-design': undefined,
  /* Where our part stops: How the data moves stays with your engineers, or with our Software Development team for the parts you hand us. We define what each item shou */
  'stops-replatforming-product-design': undefined,
};
