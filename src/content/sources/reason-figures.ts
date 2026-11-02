import { offerSceneKey } from '../../lib/sketches.ts';

/**
 * The drawing each Why Tcules reason carries in the Reasons band (component map C1, owner 29 Oct
 * 2026), keyed by the reason's title as the copy authors it. Drawn by
 * scripts/illustrations/reasons.mjs in the Reasons house style, one drawing per reason from that
 * reason's own claim (its message line is filed here with it), each exported on paper and paper-deep.
 *
 * Two sets, each drawn in one world box so a band's three sit at one scale:
 *   offer  the three offer reasons drawn so far (`why_tcules_reasons`); the other four take the slot
 *   home   home's own three (`/` why-tcules)
 *
 * A title with no row takes the labelled illustration slot (src/lib/placeholders.ts), so a band never
 * mixes two scales.
 * The sizes are the exported SVGs'; `npm run illustrations:reasons -- --check` fails if they drift.
 */
export type ReasonFigureRef = {
  /** The file's name in public/illustrations/reasons/. */
  name: string;
  set: 'offer' | 'home';
  /** What the drawing says: one sentence about the subject, written before it was drawn (ch05 §4). */
  message: string;
};

/** Each set's exported size (one shared viewBox per set). */
export const REASON_FIGURE_SIZE = {
  offer: { width: 458, height: 402 },
  home: { width: 352, height: 349 },
} as const;

const OFFER: Record<string, Omit<ReasonFigureRef, 'set'>> = {
  'We work out what the product has to know before we draw it.': {
    name: 'known-before-drawn',
    message:
      'What the product has to know is worked out and solid first; the screen above it is still a dashed outline.',
  },
  'We prove the hard parts in code while they can still change.': {
    name: 'proved-in-code',
    message:
      'In a board whose design is still open, the one hard interaction, dragging a card to another column, already works in code.',
  },
  'Senior people do the work, and clients keep us for years.': {
    name: 'same-seat-years',
    message:
      'The same senior seat stands beside each product the client has launched, year after year.',
  },
};

/**
 * /why-tcules' principles, where a reason argues what an offer reason's drawing already says (a drawing
 * is reused only for an item arguing the same thing; treatment rules § 2). Same set, so the band keeps
 * one scale. "We design software people enjoy using" has no drawing yet and takes the labelled slot
 * (docs/image-register.md).
 */
const WHY: Record<string, Omit<ReasonFigureRef, 'set'>> = {
  'We see the product behind the brief': {
    name: 'known-before-drawn',
    message:
      'What the product has to know is worked out and solid first; the screen above it is still a dashed outline.',
  },
  'We make ideas real in working software': {
    name: 'proved-in-code',
    message:
      'In a board whose design is still open, the one hard interaction, dragging a card to another column, already works in code.',
  },
};

const HOME: Record<string, Omit<ReasonFigureRef, 'set'>> = {
  'Products customers rely on': {
    name: 'relied-on',
    message: "Every day's work runs through the product we designed.",
  },
  'AI that reached production': {
    name: 'ai-in-production',
    message: 'The AI feature proved in a coded demo is the same one running in production.',
  },
  'Relationships that last': {
    name: 'relationships-last',
    message: "The same seat stays with the client's product as it grows, year on year.",
  },
};

const keyed = (set: 'offer' | 'home', rows: Record<string, Omit<ReasonFigureRef, 'set'>>) =>
  Object.entries(rows).map(([title, ref]) => [offerSceneKey(title), { ...ref, set }] as const);

export const REASON_FIGURES: Readonly<Record<string, ReasonFigureRef>> = Object.fromEntries([
  ...keyed('offer', OFFER),
  ...keyed('offer', WHY),
  ...keyed('home', HOME),
]);
