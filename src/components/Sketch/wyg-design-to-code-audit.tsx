import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /audits/design-to-code-audit · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md). Every
 * scene is wired (lib/page-scenes.ts, content/sources/offer-scenes-pages.ts) and still undefined: the
 * item shows the empty plate until the Draw stage draws it from the comment above its name.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Every gap, side by side. Shown against the approved design, with what caused it. */
  'wyg-design-to-code-audit-every-gap-side-by-side': undefined,
  /* A fix plan. Ordered by what users feel most. */
  'wyg-design-to-code-audit-fix-plan': undefined,
  /* Stop gaps coming back. What to change in the handoff, shared components or sign-off. */
  'wyg-design-to-code-audit-stop-gaps-coming-back': undefined,
  /* Developer changes worth keeping. Sensible changes made in the build, recorded so the design can catch up. */
  'wyg-design-to-code-audit-developer-changes-worth-keeping': undefined,
  /* Who does the work. A senior designer leads; a design engineer reads your Figma and code side by side. */
  'team-design-to-code-audit': undefined,
  /* Where our part stops. The audit changes nothing in your code; who fixes it is your decision. */
  'stops-design-to-code-audit': undefined,
  /* The method's one figure, beside the numbered steps. How a design-to-code audit runs: Agree the screen and the price (one call, then its approved design, read access to its code and the live product). Check the design and the handoff: what the design and specs said, and what they left to guesswork. Check the code and the live screen: component settings, colour and spacing, permissions, keyboard use, errors and small screens. Sort every gap by cause, including how it was signed off. FIGURE: design, handoff, code and live screen compared side by side, each gap sorted by where it began. */
  'method-design-to-code-audit': undefined,
};
