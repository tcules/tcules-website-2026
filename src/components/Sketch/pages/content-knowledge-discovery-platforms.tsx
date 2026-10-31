import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/content-knowledge-discovery-platforms · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A review of the searches that fail: A review of the searches that fail: zero results, repeated queries and the support tickets they cause */
  'wyg-content-knowledge-discovery-platforms-review-searches-fail': undefined,
  /* Experts and newcomers in the same box: Search, filters and browsing that serve experts and newcomers in the same box */
  'wyg-content-knowledge-discovery-platforms-experts-newcomers-same-box': undefined,
  /* Results that show source and owner: Results that show source, owner, version and date where they help someone choose */
  'wyg-content-knowledge-discovery-platforms-results-show-source-owner': undefined,
  /* AI answers linked to their passages: AI answers that link to the passages and documents behind them, and citation, provenance and saved-search views for researchers who cite wha */
  'wyg-content-knowledge-discovery-platforms-ai-answers-linked-their': undefined,
  /* A route to the next task: A route from each result to the next task: add, share, cite or configure */
  'wyg-content-knowledge-discovery-platforms-route-next-task': undefined,
  /* Prototypes tested with your real documents: Prototypes tested with your real documents and your real queries */
  'wyg-content-knowledge-discovery-platforms-prototypes-tested-real-documents': undefined,
  /* What the screens need from your search engine: A written list of what the screens need from your search engine */
  'wyg-content-knowledge-discovery-platforms-what-screens-need-from': undefined,
  /* Who does the work: A senior product designer is your lead and does the design work, and an account lead keeps it running. Researchers sit with your searchers,  */
  'team-content-knowledge-discovery-platforms': undefined,
  /* What we need from you: Search logs and real queries, a sample of your documents, time with expert and newcomer searchers, and your search engineers or vendor. We a */
  'needs-content-knowledge-discovery-platforms': undefined,
  /* Where our part stops: Ranking, indexing and relevance tuning stay with your search engineers or vendor, with a clear brief from the design on what the screens dep */
  'stops-content-knowledge-discovery-platforms': undefined,
};
