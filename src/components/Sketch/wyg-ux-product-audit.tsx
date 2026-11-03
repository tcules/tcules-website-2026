import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /audits/ux-product-audit · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md). Every
 * scene is wired (lib/page-scenes.ts, content/sources/offer-scenes-pages.ts) and still undefined: the
 * item shows the empty plate until the Draw stage draws it from the comment above its name.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Findings ranked by harm. Who each one hurts, how far it spreads, and how sure we are. */
  'wyg-ux-product-audit-findings-ranked-by-harm': undefined,
  /* A next step for each. Fix, redesign, test first or leave alone. */
  'wyg-ux-product-audit-next-step-each': undefined,
  /* What each fix takes. A rough size for every fix, so you can plan it into the roadmap. */
  'wyg-ux-product-audit-what-each-fix-takes': undefined,
  /* A walkthrough with your team. Everyone leaves agreeing what comes first. */
  'wyg-ux-product-audit-walkthrough-with-team': undefined,
  /* Who does the work. A senior designer leads the audit; a researcher joins when users need interviewing. */
  'team-ux-product-audit': undefined,
  /* Where our part stops. Whether to fund a redesign, and who builds it, stays with you. */
  'stops-ux-product-audit': undefined,
  /* The method's one figure, beside the numbered steps. How a UX audit runs: Agree the workflow and the price (one call, then product access, analytics, support tickets and time with whoever knows it best). Walk the real tasks, role by role, including errors, permissions and awkward cases. Read the signals: analytics and support tickets show where people stall; user interviews can follow. Rank the findings, walk you through. FIGURE: one workflow walked role by role, the stalls marked from the signals, turned into findings ranked by harm. */
  'method-ux-product-audit': undefined,
};
