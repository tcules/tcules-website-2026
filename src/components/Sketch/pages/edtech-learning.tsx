import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/edtech-learning · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Research with learners and educators: Research with learners and educators, on the devices they really use */
  'wyg-edtech-learning-research-learners-educators': undefined,
  /* An audit with a plain verdict: An audit of content structure, mobile use, consistency and community features, each with a plain verdict */
  'wyg-edtech-learning-audit-plain-verdict': undefined,
  /* Content regrouped: Content regrouped so every learner can see the current activity and what follows it */
  'wyg-edtech-learning-content-regrouped': undefined,
  /* Views built around who needs help: Teacher, mentor and assessor views built around who needs help */
  'wyg-edtech-learning-views-built-around-who': undefined,
  /* Hybrid wireframes: Hybrid wireframes that put the course structure and the visual direction in front of you at once */
  'wyg-edtech-learning-hybrid-wireframes': undefined,
  /* Parent views for younger learners: Defaults, consent steps and parent views for younger learners */
  'wyg-edtech-learning-parent-views-younger-learners': undefined,
  /* Configured in Moodle or your LMS: The theme, plugins and settings configured in Moodle or your LMS by our team */
  'wyg-edtech-learning-configured-moodle-or-lms': undefined,
  /* Who does the work: One senior product designer leads and does the design, and an account lead runs the project day to day. Our developers configure the platfor */
  'team-edtech-learning': undefined,
  /* What we need from you: Time with learners and educators, and access to your LMS with its plugins, themes and settings. The course content, your instructional desig */
  'needs-edtech-learning': undefined,
  /* Where our part stops: Course content, assessment standards and accreditation stay with your instructional designers and subject experts. Privacy requirements for  */
  'stops-edtech-learning': undefined,
};
