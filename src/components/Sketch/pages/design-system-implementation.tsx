import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/design-systems/design-system-implementation · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Design tokens named by meaning.: Raw colour, type and spacing values sit underneath, and names such as "danger" or "link" sit on top, the same in Figma and in code. A brand  */
  'wyg-design-system-implementation-design-tokens-named-meaning': undefined,
  /* Components in both places.: The families your products use most, each with its loading, empty, error and disabled versions, in Figma and as a React component library, o */
  'wyg-design-system-implementation-components-both-places': undefined,
  /* Documentation.: When to use each component, what can vary and a worked example, in Storybook or the tool your team already reads. Written so people, and the */
  'wyg-design-system-implementation-documentation': undefined,
  /* Versioning and releases.: Release notes and a guide for moving each product onto a new version. Done when teams know what changed and what they need to do. */
  'wyg-design-system-implementation-versioning-releases': undefined,
  /* The system on a real area of your product.: An agreed area rebuilt from the system, with real records and real screen sizes, before you sign off version one. Done when that area works  */
  'wyg-design-system-implementation-system-real-area-product': undefined,
  /* Who does the work: Design engineers build the coded components inside your codebase, alongside a senior product designer who leads the system and designs its p */
  'team-design-system-implementation': undefined,
  /* What we need from you: Agreed scope and owners, access to your Figma files and codebase, a real product area to try the system on, and time with the designers and  */
  'needs-design-system-implementation': undefined,
  /* Where our part stops: Your team owns the Figma library, the code, the documentation and the release rules once they are handed over. If scope and owners are still */
  'stops-design-system-implementation': undefined,
};
