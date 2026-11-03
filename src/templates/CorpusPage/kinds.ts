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
 *
 * Not a kind: a band's onward line lifted onto its own ink island after the band (tracker 2.53;
 * `OnwardIsland`, `data-band="onward"`, id `<band>-onward`). It is part of the band it came from, so
 * the check reads the island's words as that band's and the band keeps its own kind and component.
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
  example: {
    component: ['report'],
    status: 'to-design',
    note: "What the report looks like (the audits' 3 Nov outline): one paper report page on the tint band, the label, scenario, sheet and reading inside it (ReportBand; the 2 Nov one-panel answer). Owner to judge on the six audit pages.",
  },
  recognition: { component: ['H'], status: 'approved', note: 'The client logo grid.' },
  destinations: {
    component: ['C-image', 'C-icon'],
    status: 'to-design',
    note: 'Hub destinations: grouped with images (C-image) or a plain set (C-icon).',
  },
  related: {
    component: ['K', 'service-tile'],
    status: 'to-design',
    note: 'Ruled link rows (open roles, glossary groups); one named offer alone is its wide service tile (/audits `prototype`, named-services-are-service-tiles).',
  },
  directory: {
    component: ['tool-tiles'],
    status: 'to-design',
    note: "The /tools groups as clickable tool tiles (tracker 2.57, 4 Nov 2026): split tiles when the group's table names each tool (its columns in the result panel), two wide tiles for a pair, one service tile across the row for a single tool. Owner to judge on /tools.",
  },
  index: {
    component: ['listing-lead', 'listing-section'],
    status: 'to-design',
    note: 'A term index as a listing (ListingIndex): the lead beside the rail, each group a section of drawn term cards (/glossary, 4 Nov 2026).',
  },
  note: { component: ['C-note'], status: 'to-design' },
  close: {
    component: ['L', 'C-text'],
    status: 'to-design',
    note: 'A closing ask: the ink island with its link (L); with no link, prose.',
  },
};

/**
 * Bands the owner moved out of the band loop into another element's state, by route, each with
 * where its words now live. The template does not draw them as bands; `npm run kinds:check` lists
 * them instead of failing on the missing `<section>`, so a band only leaves the page by an entry
 * here, never silently.
 *
 *   /contact next-steps  "What happens after you send" merges into the post-send state (tracker
 *                        2.56, owner, 3 Nov 2026): the steps show in the enquiry form's sent view,
 *                        word for word, and the record line it ends on is the hero's figures.
 */
export const BANDS_ELSEWHERE: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  '/contact': {
    'next-steps': "the enquiry form's sent state (steps) and the hero's figures (record line)",
  },
};
