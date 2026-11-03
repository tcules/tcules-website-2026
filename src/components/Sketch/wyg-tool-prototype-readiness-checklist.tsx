import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* /tools/prototype-readiness-checklist: the page's still plate (LongformPage family "tool", 4 Nov
   2026): the worked example's STORY scene, inside the example panel beside its words, drawn from this
   page's own words (it must differ from the hub tile's specialist-prototype-readiness-checklist).
   Helpers come from ./offer and ./scenes, classes from ./Sketch.module.css. Undefined until it is
   drawn; the comment above it is the item's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Simulated vs real features: an invitation screen with no email service (#example): An invitation flow shows "Invitation sent", but no email service is connected. If the research question was whether a team owner understands invitations, the simulation may have done its job. The build brief still has to cover delivery, expired links, people who already have an account, resend rules and what happens when delivery fails. Draw the story: the success screen with nothing behind it, then the real path drawn underneath (delivery, an expired link, an existing account, resend, failed delivery) as what the build must add. No type on the image. */
  'tool-prototype-readiness-checklist-example': undefined,
};
