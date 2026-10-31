import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/product-design/prototyping-usability-testing · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The prototype the question needs.: Rough clickable screens when the order of steps is in doubt, realistic content and data when people must read and compare, and working code  */
  'wyg-prototyping-usability-testing-prototype-question-needs': undefined,
  /* People who match your users.: Existing customers, trial users or others who fit a profile we agree with you before the first session. */
  'wyg-prototyping-usability-testing-people-who-match-users': undefined,
  /* Realistic tasks.: Real goals with realistic records, so people work the way they would on an ordinary day. */
  'wyg-prototyping-usability-testing-realistic-tasks': undefined,
  /* Moderated sessions your team can watch.: What people do counts for more than what they say they like. */
  'wyg-prototyping-usability-testing-moderated-sessions-team-can': undefined,
  /* A report after each round.: The tasks, who took part, what we saw, what to change and what still needs testing. */
  'wyg-prototyping-usability-testing-report-after-each-round': undefined,
  /* A revised design: A revised design, ready for the next round or for your engineers. */
  'wyg-prototyping-usability-testing-revised-design': undefined,
  /* Who does the work: A senior product designer plans each round, runs the sessions and leads the work, with an account lead keeping the rounds on schedule. Desig */
  'team-prototyping-usability-testing': undefined,
  /* What we need from you: The question at stake and the result that would change your team's mind, help reaching participants or agreement on a profile, and realistic */
  'needs-prototyping-usability-testing': undefined,
  /* Where our part stops: You get the findings and a revised design, and the build stays with your engineers. When only a browser can answer the question, Coded Proto */
  'stops-prototyping-usability-testing': undefined,
};
