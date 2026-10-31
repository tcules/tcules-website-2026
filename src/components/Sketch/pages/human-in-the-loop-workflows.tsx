import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/ai-product-ux/human-in-the-loop-workflows · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Review triggers.: Each reason work reaches a person, tied to what a mistake would cost: a costly action, a policy rule, missing information or an unusual resu */
  'wyg-human-in-the-loop-workflows-review-triggers': undefined,
  /* The review card.: The AI's proposal, what it was based on, what is missing and what approval will change, in the reviewer's reading path. */
  'wyg-human-in-the-loop-workflows-review-card': undefined,
  /* What the reviewer can do.: Approve, edit, reject, ask for more, overrule with a reason or pass it to someone senior. */
  'wyg-human-in-the-loop-workflows-what-reviewer-can-do': undefined,
  /* Routing and the queue.: Who picks an item up, what happens if nobody does, and what the person who asked can see while they wait. */
  'wyg-human-in-the-loop-workflows-routing-queue': undefined,
  /* The record.: The original AI result, the reviewer's choice, the reason and the action that followed. */
  'wyg-human-in-the-loop-workflows-record': undefined,
  /* A day's workload.: How much a person can judge properly in a day, riskiest items first and routine ones cleared in groups. */
  'wyg-human-in-the-loop-workflows-days-workload': undefined,
  /* A path to spot checks.: The rules for moving a type of work from full review to sampling, and back again. */
  'wyg-human-in-the-loop-workflows-path-spot-checks': undefined,
  /* A test on past cases.: A coded version loaded with a sample of past items, so your reviewers try it before the build. */
  'wyg-human-in-the-loop-workflows-test-past-cases': undefined,
  /* Who does the work: The lead is a senior product designer, hands-on from the first day, who starts by sitting with your reviewers to learn what they check and a */
  'team-human-in-the-loop-workflows': undefined,
  /* What we need from you: Access to the people who review the AI's output, a sample of past items, and the rules or standards they work to. */
  'needs-human-in-the-loop-workflows': undefined,
  /* Where our part stops: Domain policy, legal accountability and the model's acceptance criteria stay with your qualified owners; we design the screens that carry th */
  'stops-human-in-the-loop-workflows': undefined,
};
