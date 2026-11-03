import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /audits/ai-product-ux-readiness · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md). Every
 * scene is wired (lib/page-scenes.ts, content/sources/offer-scenes-pages.ts) and still undefined: the
 * item shows the empty plate until the Draw stage draws it from the comment above its name.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A ranked fix list. Where each problem shows up, who it hurts and what it costs them. */
  'wyg-ai-product-ux-readiness-ranked-fix-list': undefined,
  /* Fixes users would notice. A clearer label, a visible source, an undo where one is missing. */
  'wyg-ai-product-ux-readiness-fixes-users-would-notice': undefined,
  /* Questions for your specialists. Accuracy, security and compliance, each with the example that raised it. */
  'wyg-ai-product-ux-readiness-questions-for-specialists': undefined,
  /* A walkthrough with your team. So everyone agrees what to fix first. */
  'wyg-ai-product-ux-readiness-walkthrough-with-team': undefined,
  /* Who does the work. A senior designer who works on AI products leads, with a design engineer when needed. */
  'team-ai-product-ux-readiness': undefined,
  /* Where our part stops. Model accuracy, security, compliance and rollout timing stay with your team. */
  'stops-ai-product-ux-readiness': undefined,
  /* The method's one figure, beside the numbered steps. How an AI UX audit runs: Agree the feature and the price (one call with the team that built it, then access with realistic data, key tasks and tickets). Use it on real tasks, as every role that touches the result. Push it where it's unsure: tasks it may get wrong, and who notices when it does. Rank the fixes, walk you through. FIGURE: the AI feature pushed where it is unsure, the wrong result and who notices it marked, the fixes ranked by what they cost users. */
  'method-ai-product-ux-readiness': undefined,
};
