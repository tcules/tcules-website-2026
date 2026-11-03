import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* /tools/audit-redesign-modernise-rebuild: the page's still plates (LongformPage family "tool", 4 Nov
   2026): the worked example's STORY scene, inside the example panel beside its words, and the diagram
   after the paragraph naming the route marks. Each drawn from this page's own words. Helpers come from
   ./offer and ./scenes, classes from ./Sketch.module.css. Each scene is undefined until it is drawn;
   the comment above it is the item's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Rebuild vs refactor in practice: a report builder with saved reports (#example): A report builder has become expensive to extend. Rebuilding its editor looks attractive, but saved reports depend on the old query service. Compare three routes: a focused repair, a redesign of the editor that keeps the existing service, and replacing the query service in stages. Before choosing the third, test whether a sample of real saved reports still return the right results, and whether old and new can run side by side. Draw the story: the editor with saved reports tied to the old query service, three routes branching from it, and a sample of real saved reports run through the staged route beside the old service. No type on the image. */
  'tool-audit-redesign-modernise-rebuild-example': undefined,
  /* Mark where each route stands before anyone commits (#reading-your-results): Mark each route "candidate", "needs evidence", "ruled out" or "preferred for next test". A preference stays provisional until the evidence is written down and someone owns the decision. Draw the diagram: the routes as a column of cards, each carrying one mark, the preferred one tied to its next test. */
  'tool-audit-redesign-modernise-rebuild-reading': undefined,
};
