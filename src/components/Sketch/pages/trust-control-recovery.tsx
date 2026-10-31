import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /services/ai-product-ux/trust-control-recovery · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Five suggestion states.: Suggested and provisional, apart from the user's own work; supported, with its sources one click away; accepted, with who accepted it and wh */
  'wyg-trust-control-recovery-five-suggestion-states': undefined,
  /* One labelling rule.: AI and human work marked apart with the same colour or mark everywhere in the product. */
  'wyg-trust-control-recovery-one-labelling-rule': undefined,
  /* Buttons for common fixes.: Shorter, more formal or a wrong name each get a control, so users stop re-prompting to change one detail. */
  'wyg-trust-control-recovery-buttons-common-fixes': undefined,
  /* Overrides that keep a record.: A direct edit or a choice of alternatives, a short reason when someone else relies on the result, and the AI's version kept beside it. */
  'wyg-trust-control-recovery-overrides-keep-record': undefined,
  /* Recovery messages.: One for each thing that can be true after a mistake, each offering only a rescue your system can deliver. */
  'wyg-trust-control-recovery-recovery-messages': undefined,
  /* A test of the moment after a wrong answer.: We watch users meet a flawed suggestion, spot it and recover, because that moment decides whether they keep using the feature. */
  'wyg-trust-control-recovery-test-moment-after-wrong': undefined,
  /* Who does the work: Your main contact is the senior product designer doing the work, who begins with the outputs your users sign, send or pay for. An account le */
  'team-trust-control-recovery': undefined,
  /* What we need from you: The feature itself, what it produces, what your system can genuinely reverse, and any tickets or feedback about it. */
  'needs-trust-control-recovery': undefined,
  /* Where our part stops: Model quality, tool permissions and technical rollback stay with your engineers, and we say plainly where a control depends on them. For a r */
  'stops-trust-control-recovery': undefined,
};
