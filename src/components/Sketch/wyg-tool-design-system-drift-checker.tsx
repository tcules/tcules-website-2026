import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* /tools/design-system-drift-checker: the page's still plate (LongformPage family "tool", 4 Nov 2026):
   the worked example's STORY scene, inside the example panel beside its words, drawn from this page's
   own words (never the hub tile's specialist-drift-checker). Helpers come from ./offer and ./scenes,
   classes from ./Sketch.module.css. Undefined until it is drawn; the comment above it is the item's
   title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Worked example: tracing a copied multi-select (#reading-your-results): An orders team uses its own copy of a multi-select because the shared field allows only one choice. What you saw is a local copy. The likely cause is an interaction the shared component lacks. Before proposing a replacement, check where multi-select belongs: in the shared component, as a separate component or built for this one product. Draw the story: the orders team's local multi-select beside the shared single-select field, the trace running from the copy back to the interaction the shared component lacks. No type on the image. */
  'tool-design-system-drift-checker-example': undefined,
};
