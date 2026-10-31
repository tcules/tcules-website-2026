import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/software-development/backend-api-development · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The rules written down.: What each record means, who may do what and which system holds the true value, agreed before the code (the five answers below). */
  'wyg-backend-api-development-rules-written-down': undefined,
  /* The riskiest gaps closed first.: Permissions the API fails to enforce and integrations that half-complete come before new features. */
  'wyg-backend-api-development-riskiest-gaps-closed-first': undefined,
  /* Tested endpoints.: Each one ships with tests for its failure cases, including retries that charge only once. */
  'wyg-backend-api-development-tested-endpoints': undefined,
  /* Integrations planned for failure.: Payment providers, CRMs, ERPs, sign-in providers and the other platforms you depend on, each with a plan for duplicates, timeouts and outage */
  'wyg-backend-api-development-integrations-planned-failure': undefined,
  /* An API that agents can use safely.: Actions with clear names and plain errors, and permissions that know whether a person or an AI agent is acting. Limits on what an agent may  */
  'wyg-backend-api-development-api-agents-can-use': undefined,
  /* A backend your team can run.: The agreed hosting, deployment, monitoring and alerts, with runbooks and notes in your repository. */
  'wyg-backend-api-development-backend-team-can-run': undefined,
  /* Who does the work: Our engineers build the backend, and designers work through the rules people meet on screen as error messages, missing buttons and statuses. */
  'team-backend-api-development': undefined,
  /* What we need from you: For a live backend: the code, data model, deployment set-up and the screens that call the API. A new product starts from the designs. */
  'needs-backend-api-development': undefined,
  /* Where our part stops: Large infrastructure and cloud moves stay with your platform team, and who owns each part is written down before the build starts. Afterward */
  'stops-backend-api-development': undefined,
};
