import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/software-development/ai-product-engineering · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A working AI feature.: Answers from your own documents and records with the sources shown (engineers call this RAG). Or a copilot that drafts, summarises or fills  */
  'wyg-ai-product-engineering-working-ai-feature': undefined,
  /* Data inside each user's permissions.: The model sees what that person may see, kept current as the records change. */
  'wyg-ai-product-engineering-data-inside-each-users': undefined,
  /* Tests you can rerun.: Real tasks with known good answers, run again whenever the model or the prompt changes. */
  'wyg-ai-product-engineering-tests-you-can-rerun': undefined,
  /* A model chosen for each task.: Compared on your own tests for quality, waiting time and cost. The choice sits in one place in the code, so a newer model can be tried, swit */
  'wyg-ai-product-engineering-model-chosen-each-task': undefined,
  /* Corrections that become tests.: When someone overrules the AI, the design keeps the reason, and the engineers turn it into a new test. */
  'wyg-ai-product-engineering-corrections-become-tests': undefined,
  /* A view after release.: Usage, cost per use and failures, starting with a few customers and watching what they accept, edit and reject. */
  'wyg-ai-product-engineering-view-after-release': undefined,
  /* Documented code in your codebase: Documented code in your codebase, with the permissions and action log an agent will need, and designs for slow, unsure and wrong answers. */
  'wyg-ai-product-engineering-documented-code-codebase': undefined,
  /* Who does the work: Designers from our AI Product UX team and our engineers work on the feature together from the first week, and an account lead keeps it runni */
  'team-ai-product-engineering': undefined,
  /* What we need from you: One task the AI must do well, with examples of a good result, which become the first tests. Access to the data that task needs, within each  */
  'needs-ai-product-engineering': undefined,
  /* Where our part stops: Your security and legal teams decide which providers and regions the data may go to, and we build to their rules. Once the feature is live,  */
  'stops-ai-product-engineering': undefined,
};
