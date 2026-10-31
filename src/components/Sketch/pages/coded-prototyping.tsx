import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/design-engineering/coded-prototyping · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The question, agreed first.: One sentence the prototype must answer, and what would count as an answer, written down before any code. */
  'wyg-coded-prototyping-question-agreed-first': undefined,
  /* The hard cases before the happy path.: Empty, loading, error, long content, dense data and different user roles, built first because they are most likely to break the idea. */
  'wyg-coded-prototyping-hard-cases-before-happy': undefined,
  /* Real or representative data.: Your own records when access and privacy allow, or sample data shaped like them. */
  'wyg-coded-prototyping-real-or-representative-data': undefined,
  /* A working session.: Your team, and users where it helps, work through the prototype in the browser with us. */
  'wyg-coded-prototyping-working-session': undefined,
  /* A short write-up.: What we learned, what is still open, and our recommendation to build it, change it or stop, with the reasons for anyone who missed the sessi */
  'wyg-coded-prototyping-short-writeup': undefined,
  /* Who does the work: Design engineers build the prototype, in HTML, CSS and JavaScript or in your own framework, such as React. The product designer who owns the */
  'team-coded-prototyping': undefined,
  /* What we need from you: The question, and what you would do differently depending on the answer. The data, or the rules for realistic sample data. And an engineer w */
  'needs-coded-prototyping': undefined,
  /* Where our part stops: A prototype answers a question; it leaves out the security, testing and monitoring real customers need. If the answer is to build, Design to */
  'stops-coded-prototyping': undefined,
};
