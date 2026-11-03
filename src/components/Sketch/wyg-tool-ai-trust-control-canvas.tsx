import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* /tools/ai-trust-control-canvas: the page's still plate (LongformPage family "tool", 4 Nov 2026):
   the worked example's STORY scene, inside the example panel beside its words, drawn from this page's
   own words. Helpers come from ./offer and ./scenes, classes from ./Sketch.module.css. Undefined until
   it is drawn; the comment above it is the item's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Worked example: an AI-drafted notice to a customer (#example): An assistant drafts a notice about a change to a customer's account. Before it goes, the reviewer sees the recipient, the proposed change and the account record behind it, and can edit or reject the draft. After it goes, recovery means correcting the account where needed and sending the recipient a correction. Deleting the message from the sender's screen leaves its effect in place. Draw the story: the drafted notice with its recipient, change and record, reviewed and sent; then the correction flowing to the account and to the recipient, while the copy deleted on the sender's screen leaves the effect in place. No type on the image. */
  'tool-ai-trust-control-canvas-example': undefined,
};
