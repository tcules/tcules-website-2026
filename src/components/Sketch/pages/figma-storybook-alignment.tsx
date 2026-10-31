import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/design-systems/figma-storybook-alignment · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A correspondence map for each component family.: How Figma and code line up, with every gap marked against six questions: colours and spacing, options, cases, behaviour, who decides and che */
  'wyg-figma-storybook-alignment-correspondence-map-each-component': undefined,
  /* The gaps that matter, fixed.: In Figma, in code or in both, with design tokens carrying the same names from one to the other. */
  'wyg-figma-storybook-alignment-gaps-matter-fixed': undefined,
  /* A Storybook entry for each case.: Loading, empty, error, disabled and validation, so designers and developers look at the same set. */
  'wyg-figma-storybook-alignment-storybook-entry-each-case': undefined,
  /* Behaviour written where designers can see it.: Keyboard, focus and screen-size behaviour that exists only in the running component, described beside the Figma component. */
  'wyg-figma-storybook-alignment-behaviour-written-where-designers': undefined,
  /* A written rule for who decides.: For each family, which side leads when the two disagree. */
  'wyg-figma-storybook-alignment-written-rule-who-decides': undefined,
  /* Checks and release notes.: Checks that flag when design and code stop matching, and notes that explain changes that break things. */
  'wyg-figma-storybook-alignment-checks-release-notes': undefined,
  /* Who does the work: A design engineer reads your code and Storybook while a senior designer works through the Figma library, and the two of them map each family */
  'team-figma-storybook-alignment': undefined,
  /* What we need from you: A Figma library and coded components, access to your repository or at least a running Storybook, and one person from design and one from fro */
  'needs-figma-storybook-alignment': undefined,
  /* Where our part stops: We align one family at a time, and your team owns both libraries throughout. If one side is missing or both need starting again, that is Des */
  'stops-figma-storybook-alignment': undefined,
};
