import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/ai-product-ux/ai-copilots-agents · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A level for each step.: Whether the AI suggests, prepares, acts after approval, acts within limits or hands back, agreed with you step by step through the task. */
  'wyg-ai-copilots-agents-level-each-step': undefined,
  /* Screens for the start and the middle of a job.: Before it starts, the goal it understood, the data it can read and the tools it may use. While it works, the plan and progress, with control */
  'wyg-ai-copilots-agents-screens-start-middle-job': undefined,
  /* Screens for the pause and the finish.: When it needs a person, the proposed action, what it rests on and what will change. When it finishes or stops partway, what happened, what f */
  'wyg-ai-copilots-agents-screens-pause-finish': undefined,
  /* Agent approval flows.: One clear request for each risky step, and low-risk steps grouped so people approve a plan once. */
  'wyg-ai-copilots-agents-agent-approval-flows': undefined,
  /* Access and memory controls.: Whether the agent reads one record or the whole workspace, and what it remembers, shown where users can see and change it. */
  'wyg-ai-copilots-agents-access-memory-controls': undefined,
  /* Undo and repair.: Undo for anything your product can reverse, and for the rest, a record of what changed and a way to put it right, shown before the agent act */
  'wyg-ai-copilots-agents-undo-repair': undefined,
  /* The riskiest step in code.: A coded version on sample data, so your team watches the agent at work before engineering commits. */
  'wyg-ai-copilots-agents-riskiest-step-code': undefined,
  /* Who does the work: A senior product designer, hands-on throughout, starts by sitting with the people who do the task today. A design engineer builds the coded  */
  'team-ai-copilots-agents': undefined,
  /* What we need from you: Time with the people who do the task, the records, tools and permissions the AI may use, and someone who can say which actions must wait for */
  'needs-ai-copilots-agents': undefined,
  /* Where our part stops: We design the agent's limits, screens and controls. Your engineers build them, or AI Product Engineering builds them with you, and model cho */
  'stops-ai-copilots-agents': undefined,
};
