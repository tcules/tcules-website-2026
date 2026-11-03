import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* /tools: the hub's tool tiles (DirectoryBand, 4 Nov 2026; tracker 2.57). Each is that tool's OWN
   scene, drawn from its own page's argument, shown wherever the tool is named as a tile
   (`serviceSceneFor`, @/lib/sketches). TILE scenes: drawn in the kit's flat grammar on the plate, and
   each makes ONE transform-only move when its tile is hovered (Move or GrowIn;
   decisions/2026-10-30-service-tile-drawing-moves-on-hover). The drift checker's and the prototype
   checklist's tiles take specialist-drift-checker and specialist-prototype-readiness-checklist
   (./wyg-glossary-destinations). Helpers come from ./offer and ./scenes, classes from
   ./Sketch.module.css. Each scene is undefined until it is drawn; the comment above it is the tool's
   title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* AI feature readiness checklist: agree what the AI may do before launch (/tools/ai-product-ux-readiness-check): The AI Product UX Readiness Check takes one AI use case through what the AI may do, what users can inspect and how mistakes get handled. You leave with the open questions and the tests to bring to your next product review. Draw: one AI use case carried through its six areas, its authority marked as suggest, prepare or act. */
  'specialist-ai-readiness-check': undefined,
  /* AI trust and control canvas: plan what people check, approve and undo (/tools/ai-trust-control-canvas): The AI Trust and Control Canvas follows one AI output to the action it can trigger. It ends in a short brief listing what people can check, approve and undo before that action happens. Draw: one AI output following its path to an action, with a check, an approve and an undo point on that path. */
  'specialist-ai-trust-canvas': undefined,
  /* Figma to Storybook checklist: test each component in every state (/tools/figma-storybook-fidelity-checklist): The Figma to Storybook Fidelity Checklist tests a component beyond its looks: keyboard paths, empty and error states, and buttons pressed twice. The result is a list of corrections someone else can check. Draw: one component shown in a run of its states (empty, error, focus, pressed twice), each state ticked or flagged. */
  'specialist-fidelity-checklist': undefined,
  /* Redesign or rebuild worksheet: compare every route before you commit (/tools/audit-redesign-modernise-rebuild): The Audit, Redesign, Modernise or Rebuild worksheet compares at least two routes for one part of your product, including the move from old to new. It ends in the case for and against each route, and the next test before you commit. Draw: one part of a product with routes forking from it (repair, redesign, replace in stages, rebuild, retire), the move from old to new drawn along each route. */
  'specialist-rebuild-worksheet': undefined,
};
