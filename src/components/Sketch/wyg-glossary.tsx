import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* The glossary's TERM drawings (/glossary and /glossary/<term>), one per term, each drawn from that
   term's own definition. Still plates: these never move, so draw the finished picture.
   Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched ...) and classes
   from ./Sketch.module.css. Each scene below is undefined until it is drawn; the comment above it is
   the item's title and words. An undefined scene renders the empty dot plate. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* AI Product UX: the design of how people understand, direct, check and undo what an AI does inside a product. (Draw: a person directing an AI's change, checking it, and an undo.) */
  'glossary-ai-product-ux': undefined,
  /* Agentic UX: the design of AI that carries out several steps on its own. It sets which steps need approval and how a wrong change is reversed. (Draw: a multi-step run with one approval gate and a way back.) */
  'glossary-agentic-ux': undefined,
  /* Human in the loop: a person reviewing an AI's work who has the information, authority and time to stop the result before it takes effect. (Draw: a reviewer with a stop control before a result takes effect.) */
  'glossary-human-in-the-loop': undefined,
  /* AI-native product design: a way of working in which designers direct AI agents and automation through parts of the work. People make the decisions that matter. (Draw: a designer routing tasks to agents and automation, the decision kept in hand.) */
  'glossary-ai-native-product-design': undefined,
  /* AI-assisted product development: AI tools used in research, design, prototyping, engineering or testing, with people still answerable for what gets released. (Draw: AI tools along research, design, prototype, code and test; a person signs off the release.) */
  'glossary-ai-assisted-product-development': undefined,
  /* Coded prototype: working software built to test what a design file can't show, such as real amounts of data or keyboard use. (Draw: a running screen tested with a real volume of data and keyboard focus.) */
  'glossary-coded-prototype': undefined,
  /* Design engineering: exploring, refining and building product experiences directly in code, from early prototype to production, so permissions and real content behave as designed. (Draw: one component refined live in code, from prototype to production.) */
  'glossary-design-engineering': undefined,
  /* Design intent: what the build must keep from the design, such as which information comes first, even when content or screen size forces a change. (Draw: an information order kept as a layout reflows to a narrow screen.) */
  'glossary-design-intent': undefined,
  /* Design to code: turning designs into working software and keeping the two in step, from behaviour and content to accessibility. (Draw: a design frame and a running screen kept in step on behaviour, content and accessibility.) */
  'glossary-design-to-code': undefined,
  /* Prototype hardening: the engineering that replaces a demo's shortcuts, such as pretend sign-in or sample data, with the real thing before customers arrive. (Draw: a demo's fake sign-in and sample data swapped for the real parts.) */
  'glossary-prototype-hardening': undefined,
  /* Design system: the shared building blocks, code and guidance that several products or teams build with, plus the rules for how they change. (Draw: one shared kit, tokens, components and guidance, feeding several products.) */
  'glossary-design-system': undefined,
  /* Design system adoption: whether teams really use the shared system in product work, judged by reuse, overrides and contributions instead of download counts. (Draw: shared parts reused, overridden and contributed back in product work.) */
  'glossary-design-system-adoption': undefined,
  /* Design system drift: what happens when Figma, code, documentation and live products slowly stop agreeing on how a shared component behaves. (Draw: one component in Figma, code, docs and the live product, slowly disagreeing.) */
  'glossary-design-system-drift': undefined,
  /* Design system governance: who can propose, approve, release and retire shared components, and what happens when a product needs something the system lacks. (Draw: a component's route through propose, approve, release and retire.) */
  'glossary-design-system-governance': undefined,
  /* Information architecture: how a product's records, labels and menus are organised, so people can predict where things live. (Draw: records, labels and menus grouped so a person predicts where a thing lives.) */
  'glossary-information-architecture': undefined,
  /* Product modernisation: updating an established product's workflows, interface and code while keeping the behaviour and data customers still rely on. (Draw: an old workflow rebuilt, the same data and behaviour carried across.) */
  'glossary-product-modernisation': undefined,
  /* User journey mapping: following a person across stages such as sales, setup and support. It shows where the product helps and where it lets them down. (Draw: one person's path through sales, setup and support, marked where the product helps or fails.) */
  'glossary-user-journey-mapping': undefined,
  /* UX debt: the growing cost of past design shortcuts, visible when every change takes longer and workarounds end up in the training material. (Draw: workarounds piling into the training manual as every change slows.) */
  'glossary-ux-debt': undefined,
  /* Workflow design: how work moves between roles, rules and handoffs, including what happens when the normal path fails. (Draw: work handed between roles under rules, including the failure branch.) */
  'glossary-workflow-design': undefined,
};
