import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/design-engineering/design-to-code · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The missing states, designed.: Empty, long, failed, slow, restricted and small-screen versions of each screen, before the build starts. */
  'wyg-design-to-code-missing-states-designed': undefined,
  /* Each part mapped to your components.: Every piece of the screen points to a building block you already have, or a new one agreed with your team. */
  'wyg-design-to-code-each-part-mapped-components': undefined,
  /* What must stay exact, marked.: Which details are fixed and which engineering is free to choose, so your team spends less time going back and forth. */
  'wyg-design-to-code-what-must-stay-exact': undefined,
  /* A buildable spec: A buildable spec, if your team has frontend time: annotated designs covering every state. */
  'wyg-design-to-code-buildable-spec': undefined,
  /* A working example: A working example, for interactions easier to show than describe: a coded version of the hardest part, so developers watch the behaviour ins */
  'wyg-design-to-code-working-example': undefined,
  /* Code in your product: Code in your product, if you are short of frontend time: React or other frontend code written by our design engineers in your codebase, merg */
  'wyg-design-to-code-code-product': undefined,
  /* Answers during the build.: We answer developers' questions while they build and review what ships, unless you prefer a clean handover. */
  'wyg-design-to-code-answers-during-build': undefined,
  /* Who does the work: Design engineers, working with the designer who made the screens, ours or yours. An account lead agrees the handover format with you before  */
  'team-design-to-code': undefined,
  /* What we need from you: The Figma designs, your component library, codebase access if we are writing code, and time with the developers who will build it for a walk */
  'needs-design-to-code': undefined,
  /* Where our part stops: Your developers own the codebase and decide what is merged. For a whole interface built to an agreed design, see Frontend Development. */
  'stops-design-to-code': undefined,
};
