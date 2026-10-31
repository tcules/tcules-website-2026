import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/design-systems/governance-adoption · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A map of where teams leave the system.: Live screens and code compared with the library, with every local copy and override listed. Our Design System Drift Checker gives a first lo */
  'wyg-governance-adoption-map-where-teams-leave': undefined,
  /* Gaps told apart.: A missing case needs a better component; a slow approval needs a better path. Each workaround is labelled as one or the other. */
  'wyg-governance-adoption-gaps-told-apart': undefined,
  /* Named owners.: People in design and engineering for the foundations, the shared components and each product's exceptions. */
  'wyg-governance-adoption-named-owners': undefined,
  /* A path for every change.: Request, sort, build, release and confirm, fitted to how your teams already plan work. */
  'wyg-governance-adoption-path-every-change': undefined,
  /* A governance model.: Central team, contribution model or shared core with local layers, chosen with you and set up with the people you have. */
  'wyg-governance-adoption-governance-model': undefined,
  /* An exceptions register.: Each exception with a type, an owner and a date to review it. */
  'wyg-governance-adoption-exceptions-register': undefined,
  /* A way to retire components.: Versioning, release notes, migration guidance and an end date for the old version. */
  'wyg-governance-adoption-way-retire-components': undefined,
  /* Adoption measures.: How many screens use shared components and how many local copies remain, so adoption shows up as a number. */
  'wyg-governance-adoption-adoption-measures': undefined,
  /* Who does the work: A senior designer leads the governance work with a design engineer who reads your code, and an account lead runs the schedule. We take the f */
  'team-governance-adoption': undefined,
  /* What we need from you: Access to live screens, code and the library, time with each system owner, and an honest account of how changes reach the system today. */
  'needs-governance-adoption': undefined,
  /* Where our part stops: Your owners run the system once the first changes are through. If nobody has agreed what belongs in the system, start with Design System Str */
  'stops-governance-adoption': undefined,
};
