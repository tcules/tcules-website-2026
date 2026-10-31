import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/design-engineering/frontend-design-systems · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The component, rebuilt in code.: A data table, rich text editor, complex form or drag-and-drop list, built in place on the screen that depends on it, with your real data. */
  'wyg-frontend-design-systems-component-rebuilt-code': undefined,
  /* Its contract.: Purpose, options, states, behaviour, accessibility and the real data it must handle, written down (an example follows below). */
  'wyg-frontend-design-systems-its-contract': undefined,
  /* Every state on show.: Each one in Storybook, or the tool your team already uses, so designers, developers and testers look at the same thing. */
  'wyg-frontend-design-systems-every-state-show': undefined,
  /* Automatic checks.: Tests for appearance, behaviour and accessibility, run on every later change. */
  'wyg-frontend-design-systems-automatic-checks': undefined,
  /* Notes to extend it.: In your naming conventions, written so people and AI coding assistants pick up the component as it is instead of copying and changing it. */
  'wyg-frontend-design-systems-notes-extend-it': undefined,
  /* Who does the work: Design engineers review the current code, keep what works and build the rest. When the component needs an option or a state the design never */
  'team-frontend-design-systems': undefined,
  /* What we need from you: The current code, the screen that depends on the component, real data or a realistic sample, and the developer who will look after the compo */
  'needs-frontend-design-systems': undefined,
  /* Where our part stops: We work in one product. When several products need to share one set of components, that is Design System Implementation. */
  'stops-frontend-design-systems': undefined,
};
