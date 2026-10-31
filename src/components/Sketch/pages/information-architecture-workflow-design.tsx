import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/product-design/information-architecture-workflow-design · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A map of your records.: What the product tracks and how those things connect, such as clients, jobs and candidates, or listings and deals. */
  'wyg-information-architecture-workflow-design-map-records': undefined,
  /* Roles and permissions.: Who can see, create, change or approve each record, worked out role by role. */
  'wyg-information-architecture-workflow-design-roles-permissions': undefined,
  /* Statuses and rules.: What "draft", "blocked" or "approved" means, what can happen next, and the conditions and exceptions that decide it. */
  'wyg-information-architecture-workflow-design-statuses-rules': undefined,
  /* Every hand-off designed.: Who is told, what they see and what they can do next, including whoever picks the work up again days later. */
  'wyg-information-architecture-workflow-design-every-handoff-designed': undefined,
  /* Navigation.: Menus grouped around the records people track and the work each role does most. */
  'wyg-information-architecture-workflow-design-navigation': undefined,
  /* Clickable prototypes: Clickable prototypes of the structure and key flows, tried by people from each role. */
  'wyg-information-architecture-workflow-design-clickable-prototypes': undefined,
  /* The reasoning, written down: The reasoning, written down, so your team can question every choice. */
  'wyg-information-architecture-workflow-design-reasoning-written-down': undefined,
  /* Who does the work: The model is drawn by a senior product designer who leads the project, and an account lead looks after plans and timings. A researcher joins */
  'team-information-architecture-workflow-design': undefined,
  /* What we need from you: Time with people from each role doing real tasks, including the moments the work leaves your product for a spreadsheet or a chat, and someon */
  'needs-information-architecture-workflow-design': undefined,
  /* Where our part stops: Our part is the structure and the prototypes. The look and behaviour of each screen is Interaction & UI Design, and your engineers build, un */
  'stops-information-architecture-workflow-design': undefined,
};
