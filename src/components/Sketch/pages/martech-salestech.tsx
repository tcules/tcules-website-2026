import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/martech-salestech · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Interviews with marketers and reps: Interviews with marketers, reps, pricing experts and their managers, so the first change comes from what users say they need most */
  'wyg-martech-salestech-interviews-marketers-reps': undefined,
  /* Reports with the next action: Reports and dashboards where each figure that matters has its next action on the same screen */
  'wyg-martech-salestech-reports-next-action': undefined,
  /* AI draft review: AI draft review: suggestions kept apart, acceptance made deliberate, and AI and human work marked */
  'wyg-martech-salestech-ai-draft-review': undefined,
  /* The shared record: The shared record for a campaign, deal or quote, with every role and tool it passes through */
  'wyg-martech-salestech-shared-record': undefined,
  /* Consent and unsubscribe states: Consent and unsubscribe states marketers can read before a send */
  'wyg-martech-salestech-consent-unsubscribe-states': undefined,
  /* Shared filters, states and data displays: Shared filters, states and data displays, written up so later screens follow them */
  'wyg-martech-salestech-shared-filters-states-data': undefined,
  /* Designs your engineers build from: Designs your engineers build from, or Tcules developers building with your team */
  'wyg-martech-salestech-designs-engineers-build-from': undefined,
  /* Who does the work: Each project has a senior product designer at its head, doing the design work, and an account lead keeping it on schedule. Researchers join  */
  'team-martech-salestech': undefined,
  /* What we need from you: Sessions with the marketers, reps and managers who use the product, your analytics and the reports customers ask for most, and the person wh */
  'needs-martech-salestech': undefined,
  /* Where our part stops: Attribution models, data pipelines and CRM configuration stay with your marketing operations, data or CRM specialists; our design makes thei */
  'stops-martech-salestech': undefined,
};
