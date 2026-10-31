import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/product-design/ux-research · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The question, written down.: What the research must answer, and what your team would do differently depending on the answer. */
  'wyg-ux-research-question-written-down': undefined,
  /* A plan that starts from what you hold.: Analytics, support tickets and past studies come first. New research fills only the gaps they leave. */
  'wyg-ux-research-plan-starts-from-what': undefined,
  /* Interviews and observation.: Sessions with people in the middle of real tasks, at their desks or on their own screens, including the specialists and admins who are harde */
  'wyg-ux-research-interviews-observation': undefined,
  /* Every source checked against the others.: Words against behaviour, interviews against analytics, so you learn how often a problem happens as well as why. */
  'wyg-ux-research-every-source-checked-against': undefined,
  /* A readout you can act on.: Findings tied to your question and the choices they point to. Depending on the study, it also includes a research synthesis, personas, exper */
  'wyg-ux-research-readout-you-can-act': undefined,
  /* Who does the work: A senior designer leads the study and does the work, with a researcher for interviews and sessions and an account lead keeping it on track.  */
  'team-ux-research': undefined,
  /* What we need from you: The question and what hangs on it; the analytics, tickets and past studies you already have; and help reaching the people who use the produc */
  'needs-ux-research': undefined,
  /* Where our part stops: You get the findings and the choices they point to, and the product calls stay with you. If you want the findings designed, our designers ca */
  'stops-ux-research': undefined,
};
