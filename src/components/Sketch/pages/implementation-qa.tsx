import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/design-engineering/implementation-qa · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The build checked screen by screen.: A Figma vs build comparison of layout and components, including your design system. Then the loading, empty, error and disabled states, each */
  'wyg-implementation-qa-build-checked-screen-screen': undefined,
  /* Every difference sorted.: Each one typed as a defect, a justified change, a missing state or an open question, with a named owner. */
  'wyg-implementation-qa-every-difference-sorted': undefined,
  /* A fix list engineers can act on.: Each finding states what was expected, what happened, how to reproduce it, why it matters to users, and who owns it. */
  'wyg-implementation-qa-fix-list-engineers-can': undefined,
  /* Retests until it closes.: Each fix is checked in the build, and anything still failing goes back to its owner with the new result. */
  'wyg-implementation-qa-retests-until-it-closes': undefined,
  /* Fixes, if you want them.: Our design engineers can correct interface issues in your code, or hand every finding to your team. */
  'wyg-implementation-qa-fixes-if-you-want': undefined,
  /* Who does the work: Design engineers who know why the design is the way it is, so a finding explains the reason as well as the bug. An account lead plans the or */
  'team-implementation-qa': undefined,
  /* What we need from you: The agreed designs and rules for this release, a test environment, the release date, the areas you are least sure about, and someone who can */
  'needs-implementation-qa': undefined,
  /* Where our part stops: You choose who fixes what, and product calls on open questions stay with your product owner. When the same mismatches return release after r */
  'stops-implementation-qa': undefined,
};
