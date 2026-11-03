import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* /tools/ai-product-ux-readiness-check: the page's still plates (LongformPage family "tool", 4 Nov
   2026): the worked example's STORY scene, inside the example panel beside its words, and the diagram
   after the marking paragraph. Each drawn from this page's own words, never another page's scene.
   Helpers come from ./offer and ./scenes, classes from ./Sketch.module.css. Each scene is undefined
   until it is drawn; the comment above it is the item's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* AI feature risk assessment: an assistant using an out-of-date record (#example): A support assistant drafts a reply from a customer's account record. The record may be out of date, and the screen gives no sign of when it was last refreshed. That is a case nobody has tested: the assistant working from out-of-date information. The test is to give the assistant an old record and watch whether the reviewer spots the mistake and fixes it before sending. Draw the story: the draft built from a record with no date sign; the record ages; a reviewer given the old record catches it before the reply is sent. No type on the image. */
  'tool-ai-product-ux-readiness-check-example': undefined,
  /* Mark each check and keep unknowns open until someone answers them (#marking): Give each check one of four marks: "evidence available", "decision only", "open" or "not applicable". A written decision still needs a test to show the interaction works, so "decision only" stays on your list. Leave an unknown open until someone can answer it, and note what would close it: the evidence, the owner or the product decision it is waiting for. Draw the diagram: one record's checks, each carrying one of the four marks, the open one tied to what would close it. */
  'tool-ai-product-ux-readiness-check-marking': undefined,
};
