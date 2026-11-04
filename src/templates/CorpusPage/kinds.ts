import type { OfferKind } from './plan';

/**
 * One kind of section, one component (owner, 30 Oct 2026). Every band the plan classifies renders
 * through its kind's approved component and nothing else; a missing drawing is a labelled placeholder
 * inside that component, never an older design. Until 30 Oct two kinds (hard parts, What you get)
 * chose between their approved component and a fallback by the content's shape, and the fallback
 * hid the approved design on every expertise page.
 *
 * Each entry names the `data-band` value(s) its component writes on the band's `<section>`.
 * `npm run kinds:check` (after a build) joins this to the built pages: a band whose section carries
 * any other value fails, so a new fallback cannot ship unseen.
 *
 *   approved   designed, reviewed by the owner: the only component the kind may render.
 *   to-design  renders today, but the owner has not approved its design. Listed by the check as work,
 *              not failed.
 *
 * A kind missing from this list fails the check: register it in the same change that adds it.
 */
export type KindStatus = 'approved' | 'to-design';

export const KIND_COMPONENTS: Readonly<
  Partial<
    Record<OfferKind, { component: readonly string[]; status: KindStatus; note?: string }>
  >
> = {
  challenges: {
    component: ['D-claims'],
    status: 'approved',
    note: 'Hard parts: ClaimSet tabs on a stage (owner, 31 Oct 2026; hard-parts-brief § 8). Owner to judge on the pages.',
  },
  outcomes: {
    component: ['offer-parts'],
    status: 'approved',
    note: 'What you get, four parts.',
  },
  personas: { component: ['voice-ledger'], status: 'approved' },
  catalog: {
    component: ['catalog-tiles'],
    status: 'to-design',
    note: 'What we design: drawn Bento tiles, as the services hub (owner, 2 Nov 2026); a tile links its case where the copy does. Plates until each kind is drawn. Owner to judge on the expertise pages.',
  },
  cases: { component: ['M'], status: 'approved' },
  quotes: { component: ['G'], status: 'approved' },
  tiles: { component: ['engagement-options'], status: 'approved' },
  reasons: { component: ['reasons'], status: 'approved' },
  industries: {
    component: ['C-image'],
    status: 'to-design',
    note: 'Eleven photo cards; the band is heavy for a set of links (inventory § 1).',
  },
  enquiry: { component: ['L'], status: 'approved' },
  faq: { component: ['D-faq'], status: 'approved' },
  router: { component: ['C-icon'], status: 'approved' },
  method: {
    component: ['F'],
    status: 'approved',
    note: 'How we do it: numbered steps beside one flat graphic (owner, 30 Oct 2026).',
  },
  deliverables: { component: ['offer-sheet'], status: 'to-design' },
  table: {
    component: ['E', 'drawn-table'],
    status: 'approved',
    note: 'A table read across rows stays a table (E); a table of peer items is drawn (drawn-table).',
  },
  thread: {
    component: ['E'],
    status: 'approved',
    note: 'A trace read across its columns (design-to-code audit).',
  },
  text: {
    component: ['C-text', 'B'],
    status: 'to-design',
    note: 'Prose; with a photograph of its own, the copy beside it (B).',
  },
  /* Registered 31 Oct 2026, when kinds:check widened to the hubs and one-off pages. */
  set: {
    component: ['offer-sheet', 'D'],
    status: 'to-design',
    note: 'A labelled set that is not What you get (Join, Careers, Matter, How we work). The sheet; past six items the two-column read-down (D).',
  },
  record: {
    component: ['case-spread'],
    status: 'approved',
    note: 'One worked case (CaseSpread).',
  },
  recognition: { component: ['H'], status: 'approved', note: 'The client logo grid.' },
  destinations: {
    component: ['C-image', 'C-icon'],
    status: 'to-design',
    note: 'Hub destinations: grouped with images (C-image) or a plain set (C-icon).',
  },
  related: {
    component: ['K'],
    status: 'to-design',
    note: 'Ruled link rows (open roles, glossary groups).',
  },
  directory: { component: ['C-cards'], status: 'to-design', note: 'The /tools groups.' },
  note: { component: ['C-note'], status: 'to-design' },
  close: {
    component: ['L', 'C-text', 'M'],
    status: 'to-design',
    note: 'A closing ask: the ink island with its link (L); with no link, prose. A close whose ask is the case index and whose page picks its cases (OfferBands CLOSE_CASES, /clients): the case grid (M), the link the head’s end action, on the heading’s row (owner 4 Nov 2026).',
  },
};
