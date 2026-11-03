import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /audits/design-system-audit · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md). Every
 * scene is wired (lib/page-scenes.ts, content/sources/offer-scenes-pages.ts) and still undefined: the
 * item shows the empty plate until the Draw stage draws it from the comment above its name.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* What to keep. Patterns that work and that teams already use well. */
  'wyg-design-system-audit-what-to-keep': undefined,
  /* What to repair first. Broken behaviour, Figma and code mismatches, and controls some users can't operate. */
  'wyg-design-system-audit-what-to-repair-first': undefined,
  /* Where requests stall. Who owns the system, how change requests move, and where they stop. */
  'wyg-design-system-audit-where-requests-stall': undefined,
  /* Early warnings. Automatic checks that flag new copies and accessibility slips. */
  'wyg-design-system-audit-early-warnings': undefined,
  /* How widely it's used. Measured from your usage data, or sampled from real screens and code. */
  'wyg-design-system-audit-how-widely-used': undefined,
  /* Who does the work. A senior designer leads; a design engineer reads your code beside the Figma files. */
  'team-design-system-audit': undefined,
  /* Where our part stops. Repairs are separate work, by your team or ours; who owns the system is your decision. */
  'stops-design-system-audit': undefined,
  /* The method's one figure, beside the numbered steps. How a design system audit runs: Agree the components and the price (one call to pick the ones you rely on most, then Figma, code and Storybook access). List every version: the library one, local copies and one-off workarounds. Trace where each one breaks, from the product need, through Figma and code, to the live screen. Ask why teams bypass it, agree fixes. FIGURE: every version of one component (library, local copies, workarounds) traced from the need through Figma and code to the live screen, the point it breaks first marked. */
  'method-design-system-audit': undefined,
};
