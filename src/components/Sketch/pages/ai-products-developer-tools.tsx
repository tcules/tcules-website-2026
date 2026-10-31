import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/ai-products-developer-tools · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A first working result: The path from sign-up to a first working result, with keys, code samples and error messages */
  'wyg-ai-products-developer-tools-first-working-result': undefined,
  /* Documentation beside the work: Documentation, previews, consoles, usage and billing views placed beside the work, and the limits people meet as they grow */
  'wyg-ai-products-developer-tools-documentation-beside-work': undefined,
  /* A written split: For each step, a written split between what the system proposes and what a person checks, edits or approves */
  'wyg-ai-products-developer-tools-written-split': undefined,
  /* Sources and limits: Results that show their sources and limits, and review screens that keep the original beside any correction */
  'wyg-ai-products-developer-tools-sources-limits': undefined,
  /* Prototypes tested: Prototypes tested with your users and your engineers, clickable or in code */
  'wyg-ai-products-developer-tools-prototypes-tested': undefined,
  /* Specs your developers build from: Specs your developers build from, or Tcules developers through AI Product Engineering */
  'wyg-ai-products-developer-tools-specs-developers-build-from': undefined,
  /* Who does the work: The product designer who leads your project is senior and does the design; an account lead keeps it running. Design engineers try uncertain  */
  'team-ai-products-developer-tools': undefined,
  /* What we need from you: Your demo, prototype, model endpoint or live product. Early time with your ML engineers on what the system can report: sources, confidence a */
  'needs-ai-products-developer-tools': undefined,
  /* Where our part stops: The model, prompts, evaluations, infrastructure and security stay with your engineers. Where rules such as the EU AI Act apply, your legal t */
  'stops-ai-products-developer-tools': undefined,
};
