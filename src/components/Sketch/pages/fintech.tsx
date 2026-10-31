import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/fintech · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A status map: Every state a loan, payment or claim can reach, with what the customer sees, what staff see and what happens next */
  'wyg-fintech-status-map': undefined,
  /* Customer journeys: Customer journeys from sign-up and identity checks to repayment or payout, with every decline and failure designed beside the main path */
  'wyg-fintech-customer-journeys': undefined,
  /* Review and approval screens: Review and approval screens that show the case, its evidence, the approver's limit and who acts next */
  'wyg-fintech-review-approval-screens': undefined,
  /* Reasons, disclosures and consent wording: Reasons, disclosures and consent wording drafted with your compliance team, and checked on a small phone screen */
  'wyg-fintech-reasons-disclosures-consent-wording': undefined,
  /* Research with the people the product is for: Research with the people the product is for, where the concept still needs testing */
  'wyg-fintech-research-people-product-is': undefined,
  /* Prototypes with realistic figures: Prototypes with realistic figures that product, engineering and marketing can review before code */
  'wyg-fintech-prototypes-realistic-figures': undefined,
  /* Designs ready for your engineers: Designs ready for your engineers, or Tcules developers who build with them */
  'wyg-fintech-designs-ready-engineers': undefined,
  /* Who does the work: One senior product designer leads it and designs the screens, and an account lead keeps it moving. A researcher joins when a concept needs t */
  'team-fintech': undefined,
  /* What we need from you: Your compliance or risk lead's time on wording and decline reasons, and the policy rules behind each status. We also need the support calls  */
  'needs-fintech': undefined,
  /* Where our part stops: Lending policy, credit models, fraud rules and regulatory sign-off stay with your compliance, risk and legal teams; our designs present thei */
  'stops-fintech': undefined,
};
