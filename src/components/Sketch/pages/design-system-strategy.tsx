import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/design-systems/design-system-strategy · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* An inventory.: What already exists in Figma and in code, and which duplicates to merge. */
  'wyg-design-system-strategy-inventory': undefined,
  /* A scope map.: Every pattern your teams use, sorted into shared, product-specific, technical and still open, filled in for your products. */
  'wyg-design-system-strategy-scope-map': undefined,
  /* A structure for the system.: How colours, type, spacing and components are organised, so the system grows without a reshuffle, and where a theme layer handles brand diff */
  'wyg-design-system-strategy-structure-system': undefined,
  /* Owners and contribution rules.: Who proposes, who builds, who signs off and who releases, for each kind of change. */
  'wyg-design-system-strategy-owners-contribution-rules': undefined,
  /* A design system roadmap.: The components your products need first, in the order teams will use them, with the measures agreed before the build. */
  'wyg-design-system-strategy-design-system-roadmap': undefined,
  /* A business case in your numbers.: Which screens teams rebuild today, how often and in how many products, and what the first release would let them stop doing. */
  'wyg-design-system-strategy-business-case-numbers': undefined,
  /* Rules for AI coding tools.: What they may assemble from the system on their own, and what still needs a designer's sign-off. */
  'wyg-design-system-strategy-rules-ai-coding-tools': undefined,
  /* Who does the work: A senior designer leads the strategy and runs the conversations with every team, a design engineer reads the components already in your code */
  'team-design-system-strategy': undefined,
  /* What we need from you: Product, design and frontend leads from each team that will use the system, someone who can make product calls, and access to your Figma fil */
  'needs-design-system-strategy': undefined,
  /* Where our part stops: You get a plan, and the build is a separate choice. Design System Implementation builds it, Governance & Adoption runs the owners and rules  */
  'stops-design-system-strategy': undefined,
};
