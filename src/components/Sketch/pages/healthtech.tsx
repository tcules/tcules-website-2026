import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/healthtech · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Each role's journey around one patient: Each role's journey around one patient, with what they may see and what they hand on */
  'wyg-healthtech-each-roles-journey-around': undefined,
  /* Consent, sharing and access steps: Consent, sharing and access steps, worded with your privacy lead */
  'wyg-healthtech-consent-sharing-access-steps': undefined,
  /* Research with patients, families, clinicians and carers: Research with patients, families, clinicians and carers on real tasks, on the devices they carry */
  'wyg-healthtech-research-patients-families-clinicians': undefined,
  /* Wireframes with the reasoning written down: Wireframes and walkthroughs for your clinical safety lead, with the reasoning written down */
  'wyg-healthtech-wireframes-reasoning-written-down': undefined,
  /* Screens designed for accessibility: Screens designed for accessibility: readable type, strong contrast, keyboard use and screen readers, to a standard we agree with you at the  */
  'wyg-healthtech-screens-designed-accessibility': undefined,
  /* Designs your developers build from: Designs your developers build from, or Tcules developers building the frontend and coordinating integrations and testing with your chosen te */
  'wyg-healthtech-designs-developers-build-from': undefined,
  /* Who does the work: The design sits with a senior product designer, who also leads the project, and an account lead keeps it on track. Researchers come in for w */
  'team-healthtech': undefined,
  /* What we need from you: Your clinical safety and privacy leads from the first week, with the hazards and requirements they already know. We also need access to the  */
  'needs-healthtech': undefined,
  /* Where our part stops: Hazard logs, risk assessments and medical device classification stay with your clinical safety, privacy and regulatory specialists, and clin */
  'stops-healthtech': undefined,
};
