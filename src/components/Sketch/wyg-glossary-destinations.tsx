import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* The destinations the glossary's term pages close on that had no drawing of their own: each the
   service, audit or tool's OWN scene, drawn from that page's own argument (never borrowed from its
   What-you-get items), shown wherever the destination is named as a ServiceTile
   (`serviceSceneFor`, @/lib/sketches). Still plates: draw the finished picture. Helpers come from
   ./offer and ./scenes, classes from ./Sketch.module.css. Each scene is undefined until it is drawn;
   the comment above it is the destination's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Implementation QA (/services/design-engineering/implementation-qa): Your engineers get one sorted fix list from our design QA, and each fix is retested before customers see the release. */
  'specialist-implementation-qa': undefined,
  /* Coded Prototyping (/services/design-engineering/coded-prototyping): Coded prototyping turns your idea into working code on real or sample data. Your team then decides what to build from something it can try. */
  'specialist-coded-prototyping': undefined,
  /* Design to Code (/services/design-engineering/design-to-code): Our design to code service answers your developers' questions before the sprint starts, so they build each Figma screen once, in your own components. */
  'specialist-design-to-code': undefined,
  /* Design-to-Code Audit (/audits/design-to-code-audit): In about two days, at a fixed price, a senior designer and a design engineer find why one screen ships unlike its design. */
  'specialist-design-to-code-audit': undefined,
  /* Design System Drift Checker (/tools/design-system-drift-checker): The free Design System Drift Checker follows one shared component through Figma, Storybook (where coded components are previewed) and the live product to show where the differences creep in. */
  'specialist-drift-checker': undefined,
  /* Prototype Readiness Checklist (/tools/prototype-readiness-checklist): The free Prototype Readiness Checklist sorts what a prototype really does from what it only simulates. It works for any prototype, including ones built with AI tools. */
  'specialist-prototype-readiness-checklist': undefined,
};
