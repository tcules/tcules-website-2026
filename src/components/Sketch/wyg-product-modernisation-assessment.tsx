import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /audits/product-modernisation-assessment · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md). Every
 * scene is wired (lib/page-scenes.ts, content/sources/offer-scenes-pages.ts) and still undefined: the
 * item shows the empty plate until the Draw stage draws it from the comment above its name.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Area-by-area answers. Each part of the product gets one of five answers, from keep to rebuild. */
  'wyg-product-modernisation-assessment-area-by-area-answers': undefined,
  /* What must survive. The workflows and habits customers rely on every day. */
  'wyg-product-modernisation-assessment-what-must-survive': undefined,
  /* The order of work. What moves first, and which changes depend on others. */
  'wyg-product-modernisation-assessment-order-of-work': undefined,
  /* Questions to answer first. What to find out before you commit budget. */
  'wyg-product-modernisation-assessment-questions-to-answer-first': undefined,
  /* Ready for AI features. Areas with the clean records and safe actions AI features need. */
  'wyg-product-modernisation-assessment-ready-for-ai-features': undefined,
  /* Who does the work. A senior designer leads; an engineer works alongside on the technical side. */
  'team-product-modernisation-assessment': undefined,
  /* Where our part stops. It's a recommendation; which way to go, and when, stays your decision. */
  'stops-product-modernisation-assessment': undefined,
  /* The method's one figure, beside the numbered steps. How a modernisation assessment runs: Agree the workflow and the price (one call, then analytics, support history, a few users to talk to and engineers' time). Split the product into areas that could change on their own, such as reporting or billing. Learn what must survive: what customers rely on, and what code, data and integrations allow. Give each area its answer, set the order: one of five answers per area, sequenced by dependency and risk. FIGURE: the product split into areas, each given its answer, with the order of work. */
  'method-product-modernisation-assessment': undefined,
};
