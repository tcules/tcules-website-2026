import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/b2b-saas-workflow-software · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The workflow map: A map of the records, roles, rules and states the workflow runs on */
  'wyg-b2b-saas-workflow-software-workflow-map': undefined,
  /* Screens for each role: The screens each role works in, with every exception designed beside the main path */
  'wyg-b2b-saas-workflow-software-screens-each-role': undefined,
  /* Admin, permission and audit screens: The admin, permission and audit screens enterprise customers look for */
  'wyg-b2b-saas-workflow-software-admin-permission-audit-screens': undefined,
  /* How an agent's work appears: How an agent's work, or a model's output, appears to the people who check it */
  'wyg-b2b-saas-workflow-software-how-agents-work-appears': undefined,
  /* Prototypes tested: Prototypes tested with people who do the job, clickable or in code */
  'wyg-b2b-saas-workflow-software-prototypes-tested': undefined,
  /* Parts your engineers can build from: Parts your engineers can build from, or Tcules developers working alongside them */
  'wyg-b2b-saas-workflow-software-parts-engineers-can-build': undefined,
  /* Who does the work: A senior product designer leads the work and does it. Researchers, design engineers and developers join when the work needs them. */
  'team-b2b-saas-workflow-software': undefined,
  /* What we need from you: Time with people in each role doing real tasks, including the admins and whoever clears the exceptions. We also need your analytics and supp */
  'needs-b2b-saas-workflow-software': undefined,
  /* Where our part stops: Some calls belong with your team or another specialist: pricing and packaging, building or training AI models, and go-to-market. We design h */
  'stops-b2b-saas-workflow-software': undefined,
};
