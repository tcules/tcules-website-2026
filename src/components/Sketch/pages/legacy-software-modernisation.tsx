import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/product-modernisation/legacy-software-modernisation · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A map of what the system really does.: Its behaviour, rules, data, connected systems and the workarounds people rely on, written down. */
  'wyg-legacy-software-modernisation-map-what-system-really': undefined,
  /* A keep-or-change call on each rule.: Judged by what the rule does for your users and the business, with a reason for every rule that stays and a plan for every one that goes. */
  'wyg-legacy-software-modernisation-keeporchange-call-each-rule': undefined,
  /* A staged plan.: The order of change, and how the old and new systems share the work in between. */
  'wyg-legacy-software-modernisation-staged-plan': undefined,
  /* Designs for each stage.: Screens, states and the move of people's saved work, ready for your engineers or ours. */
  'wyg-legacy-software-modernisation-designs-each-stage': undefined,
  /* Help through each rollout.: Designers on hand while staff and customers move across. */
  'wyg-legacy-software-modernisation-help-through-each-rollout': undefined,
  /* Who does the work: A senior designer leads and does the work, and owns what users notice: which rules carry over, how the new screens behave and how people mov */
  'team-legacy-software-modernisation': undefined,
  /* What we need from you: The running system, staff we can watch at work, and whatever documentation exists for the system and the software connected to it. */
  'needs-legacy-software-modernisation': undefined,
  /* Where our part stops: Cloud migration and other infrastructure moves stay with your platform team or a specialist firm. We plan alongside them so product and plat */
  'stops-legacy-software-modernisation': undefined,
};
