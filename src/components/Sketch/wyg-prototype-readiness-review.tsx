import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /audits/prototype-readiness-review · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md). Every
 * scene is wired (lib/page-scenes.ts, content/sources/offer-scenes-pages.ts) and still undefined: the
 * item shows the empty plate until the Draw stage draws it from the comment above its name.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* What's proven, what isn't. Every key part marked proven, assumed or missing, from sign-in to payments. */
  'wyg-prototype-readiness-review-whats-proven-what-isnt': undefined,
  /* Fixes customers will notice. Where people get stuck in the flow, and what to change. */
  'wyg-prototype-readiness-review-fixes-customers-will-notice': undefined,
  /* Code worth keeping. If you add a reading of the code, which parts are safe to build on. */
  'wyg-prototype-readiness-review-code-worth-keeping': undefined,
  /* The work before launch. In order, so whoever builds it can plan and you can set a date. */
  'wyg-prototype-readiness-review-work-before-launch': undefined,
  /* Who does the work. A senior designer leads; an engineer checks how the app holds up under real use. */
  'team-prototype-readiness-review': undefined,
  /* Where our part stops. Launch timing is yours; security and compliance sign-off goes to a qualified specialist, yours or hired. */
  'stops-prototype-readiness-review': undefined,
  /* The method's one figure, beside the numbered steps. How a prototype readiness review runs: Agree the flow and the price (one call to pick the flow, such as sign-up to first payment, then a link and test logins). Use it as each of your users. Try what a demo skips: failed payments, double taps, locked-out users, two people editing one record. Mark every part, order the work. FIGURE: the one flow walked as each kind of user, the demo-skipped failures lit where they break, each part marked and the work ordered. */
  'method-prototype-readiness-review': undefined,
};
