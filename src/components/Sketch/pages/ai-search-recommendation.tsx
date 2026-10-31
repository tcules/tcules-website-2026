import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/ai-product-ux/ai-search-recommendation · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Search entry.: Exact lookups and plain-language questions in one box, with a one-key switch between them. */
  'wyg-ai-search-recommendation-search-entry': undefined,
  /* Results that show their source.: Cards and previews with the source, its date and what it covers. */
  'wyg-ai-search-recommendation-results-show-their-source': undefined,
  /* AI answers with sources.: Generated summaries kept visibly apart from the passages behind them, and a plain message when nothing in your content supports an answer. */
  'wyg-ai-search-recommendation-ai-answers-sources': undefined,
  /* Recommendations that explain themselves.: The reasons behind each pick, what was left out, what happens on accepting it, and preferences people can change. */
  'wyg-ai-search-recommendation-recommendations-explain-themselves': undefined,
  /* Corrections.: Exclude a source, fix a name, narrow the search or fall back to the raw results, plus a way to flag a bad answer that your team learns from. */
  'wyg-ai-search-recommendation-corrections': undefined,
  /* The next step.: The chosen result carried straight into the screen where the work happens, so nobody copies it across by hand. */
  'wyg-ai-search-recommendation-next-step': undefined,
  /* A test on your own content.: A coded version run against a sample of your documents, showing where answers drift before engineering builds it. */
  'wyg-ai-search-recommendation-test-own-content': undefined,
  /* Who does the work: Your senior product designer starts from the queries people type today, sorted by the job behind each. A design engineer runs the test on yo */
  'team-ai-search-recommendation': undefined,
  /* What we need from you: A set of real queries, a sample of your documents, and what people do with a result once they find it. */
  'needs-ai-search-recommendation': undefined,
  /* Where our part stops: We design what people see, check and do. Retrieval, ranking and model quality stay with your engineers, or with ours through AI Product Engi */
  'stops-ai-search-recommendation': undefined,
};
