import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/marketplaces-multi-sided-platforms · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* What changes hands: A written description of what changes hands: its states, when it binds and who acts at each one */
  'wyg-marketplaces-multi-sided-platforms-what-changes-hands': undefined,
  /* Research with buyers, providers and your operations staff: Research with buyers, providers and your operations staff, each interviewed separately */
  'wyg-marketplaces-multi-sided-platforms-research-buyers-providers-operations': undefined,
  /* Screens drawn together on one record: Buyer, provider and operations screens drawn together on one record */
  'wyg-marketplaces-multi-sided-platforms-screens-drawn-together-one': undefined,
  /* Cancellations and disputes as stages: Cancellations, changes, refunds and disputes designed as stages of the booking, with rules your operations lead writes once */
  'wyg-marketplaces-multi-sided-platforms-cancellations-disputes-as-stages': undefined,
  /* Operations and trust tools: Operations and trust tools for exceptions, quality checks, payment problems and appeals, with a record of who changed what */
  'wyg-marketplaces-multi-sided-platforms-operations-trust-tools': undefined,
  /* Screens your engineers build from: Screens your engineers build from, or Tcules developers coding the screens for each side */
  'wyg-marketplaces-multi-sided-platforms-screens-engineers-build-from': undefined,
  /* Who does the work: One senior product designer leads the work and designs for both sides of the market, and an account lead keeps the project moving. Researche */
  'team-marketplaces-multi-sided-platforms': undefined,
  /* What we need from you: Time with people on both sides and with your operations team, and the rules you already run on for cancellations, payouts and verification.  */
  'needs-marketplaces-multi-sided-platforms': undefined,
  /* Where our part stops: Payment providers, fraud policy and seller verification rules stay with your payments, legal and trust specialists; our design turns their r */
  'stops-marketplaces-multi-sided-platforms': undefined,
};
