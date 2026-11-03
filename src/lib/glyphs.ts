/**
 * Which glyph marks which destination — the icon routers' one map (page-mapping G12).
 *
 * A router card (BlockCardSet `frame="box"`, a glyph on each card) is a set of DESTINATIONS, and a
 * destination keeps its glyph wherever it is listed: product design is `ruler-pen` on the home
 * page's situations and on a service index alike. The choices start from the kit's own (`kit/home`)
 * and extend it to the destinations the corpus adds, each from the glyphs that exist today. The
 * values are plain names, not `IconName`s, because lib is a leaf and may not import a primitive;
 * the template that renders one passes it to `Icon`, which type-checks it against the set.
 *
 * Keyed by path, so a corpus link needs no translation. A route with no entry gets `undefined`,
 * and a set where any card lacks a glyph renders as the no-glyph form, never one card unmarked.
 */

export type RouterGlyph =
  | 'ruler-pen'
  | 'shield-check'
  | 'layers'
  | 'stars'
  | 'monitor'
  | 'database'
  | 'flag'
  | 'eye'
  | 'widget'
  | 'smartphone'
  | 'graph-up'
  | 'clipboard-check'
  | 'cpu'
  | 'users-group-rounded'
  | 'chat-round-dots'
  | 'cart'
  | 'wallet'
  | 'heart-pulse'
  | 'user'
  | 'checklist';

/** The seven service lines. */
const SERVICES: Readonly<Record<string, RouterGlyph>> = {
  '/services/product-design': 'ruler-pen',
  '/services/product-modernisation': 'shield-check',
  '/services/design-systems': 'layers',
  '/services/ai-product-ux': 'stars',
  '/services/design-engineering': 'monitor',
  '/services/software-development': 'database',
  '/services/mvp-development': 'flag',
  /* The audits hub, where a list of the services closes on it (/expertise, /about; 29 Oct 2026). */
  '/audits': 'checklist',
};

/** The five specialist Product Design services. */
const PRODUCT_DESIGN_SPECIALISTS: Readonly<Record<string, RouterGlyph>> = {
  '/services/product-design/ux-research': 'eye',
  '/services/product-design/information-architecture-workflow-design': 'widget',
  '/services/product-design/interaction-ui-design': 'smartphone',
  '/services/product-design/data-visualisation': 'graph-up',
  '/services/product-design/prototyping-usability-testing': 'clipboard-check',
};

/** The expertise sectors. Commerce, FinTech and HealthTech use the three sector glyphs added to Icon. */
const SECTORS: Readonly<Record<string, RouterGlyph>> = {
  '/expertise/b2b-saas-workflow-software': 'widget',
  '/expertise/ai-products-developer-tools': 'cpu',
  '/expertise/data-analytics-decision-products': 'graph-up',
  '/expertise/commerce-transactional-products': 'cart',
  '/expertise/marketplaces-multi-sided-platforms': 'users-group-rounded',
  '/expertise/fintech': 'wallet',
  '/expertise/healthtech': 'heart-pulse',
  '/expertise/martech-salestech': 'chat-round-dots',
};

/**
 * The six free tools (/tools hub, 29 Oct 2026), each marked by the job it serves: the AI checks by
 * AI Product UX's `stars` and by what the canvas plans (what people can see and check, `eye`), the
 * component worksheets by Design Systems' `layers` and a component's states (`widget`), the route
 * worksheet by Product Modernisation's `shield-check`, the prototype checklist by `clipboard-check`.
 */
const TOOLS: Readonly<Record<string, RouterGlyph>> = {
  '/tools/ai-product-ux-readiness-check': 'stars',
  '/tools/ai-trust-control-canvas': 'eye',
  '/tools/design-system-drift-checker': 'layers',
  '/tools/figma-storybook-fidelity-checklist': 'widget',
  '/tools/audit-redesign-modernise-rebuild': 'shield-check',
  '/tools/prototype-readiness-checklist': 'clipboard-check',
};

const BY_ROUTE: Readonly<Record<string, RouterGlyph>> = {
  ...SERVICES,
  ...TOOLS,
  ...PRODUCT_DESIGN_SPECIALISTS,
  ...SECTORS,
};

/** The glyph for a destination path, or undefined. A trailing slash and a fragment are ignored. */
export function glyphForRoute(href: string): RouterGlyph | undefined {
  const path = href.split(/[?#]/)[0]?.replace(/\/+$/, '') ?? '';
  return BY_ROUTE[path];
}

/**
 * HealthTech's six personas, by the words that name them (the first cell of the table's rows, as
 * authored). A persona is not a destination, so it has no route to key on.
 */
const PERSONAS: ReadonlyArray<readonly [RegExp, RouterGlyph]> = [
  [/patient or family/i, 'user'],
  [/clinician/i, 'checklist'],
  [/carer|field worker/i, 'smartphone'],
  [/professional using a portal|portal/i, 'monitor'],
  [/operations team/i, 'users-group-rounded'],
  [/compliance|clinical safety/i, 'shield-check'],
];

export function glyphForPersona(who: string): RouterGlyph | undefined {
  return PERSONAS.find(([pattern]) => pattern.test(who))?.[1];
}
