import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/product-modernisation/product-redesign · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A record of what customers rely on.: Every habit we find, sorted into the four groups below, each with a reason. */
  'wyg-product-redesign-record-what-customers-rely': undefined,
  /* Research and diagnosis.: Interviews, analytics, support history and a review of the live product. */
  'wyg-product-redesign-research-diagnosis': undefined,
  /* Structure and workflows.: Navigation, records and the steps people take, redesigned where they cause friction. */
  'wyg-product-redesign-structure-workflows': undefined,
  /* Screens in every state.: Including what people see while a screen loads, when it is empty and when something fails, at the screen sizes your customers use. */
  'wyg-product-redesign-screens-every-state': undefined,
  /* Shared components.: Patterns your design system can reuse, so the redesign stays consistent as it spreads. */
  'wyg-product-redesign-shared-components': undefined,
  /* A rollout plan.: Which workflow goes first, how the old and new versions coexist, and what customers are told. */
  'wyg-product-redesign-rollout-plan': undefined,
  /* Specifications, or the build.: Specs your developers build from, or our Design Engineering and Software Development teams take it into code, with designers checking the bu */
  'wyg-product-redesign-specifications-or-build': undefined,
  /* Who does the work: The redesign is led by a senior product designer who draws every changed screen, while an account lead plans the stages with you. Design eng */
  'team-product-redesign': undefined,
  /* What we need from you: Access to the live product, the analytics and support history you have, and time with new and long-time customers to watch and test with. */
  'needs-product-redesign': undefined,
  /* Where our part stops: The product calls stay with you, including what ships and when. Our part ends at specifications your engineers build from, unless we build i */
  'stops-product-redesign': undefined,
};
