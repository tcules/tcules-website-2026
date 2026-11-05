import { ILLUSTRATION_LEGENDS } from './illustration-legends';
import { expertisePath, ROUTES, servicePath } from './routes';

/**
 * The hero drawings, by route.
 *
 * Six are Bhumika's finals, frozen by Jatin on 30 Oct 2026 and then polished (one outline weight,
 * corner edges, lines that stop at what they reach; docs/illustrations/polish-2026-10-30/), each cropped
 * to its own bounds. The owner approved them for the pages the same day. Four more are the owner's
 * approved canvas versions not yet through that polish (owner, 30 Oct 2026): Software Development, New
 * Product Design & First Release, and the /expertise and /audits hubs, their text flattened to paths and
 * their viewBox trimmed to the drawing. The 5 Nov 2026 run adds the /services, /tools and Lab heroes and
 * the twelve industry heroes. An illustration is never cropped; every other page's hero is a bound asset
 * or a labelled placeholder.
 *
 * Register every new hero drawing HERE, in the same change that adds its file: the page's hero and its
 * share card (src/app/_og/resolve.ts) both read this table, and a file it does not name is used by
 * neither. A page with no entry shares its family hub's drawing on its card until it has one;
 * `npm run share:census` lists those pages.
 */
const HERO_ILLUSTRATIONS: Readonly<
  Record<string, { src: string; width: number; height: number }>
> = {
  [servicePath('product-design')]: {
    src: '/illustrations/heroes/product-design.svg',
    width: 786,
    height: 543,
  },
  [servicePath('product-modernisation')]: {
    src: '/illustrations/heroes/product-modernisation.svg',
    width: 700,
    height: 499,
  },
  [servicePath('design-engineering')]: {
    src: '/illustrations/heroes/design-engineering.svg',
    width: 772,
    height: 577,
  },
  [servicePath('design-systems')]: {
    src: '/illustrations/heroes/design-systems.svg',
    width: 802,
    height: 515,
  },
  [servicePath('ai-product-ux')]: {
    src: '/illustrations/heroes/ai-product-ux.svg',
    width: 792,
    height: 446,
  },
  [servicePath('ai-product-ux/ai-copilots-agents')]: {
    src: '/illustrations/heroes/ai-copilots-agents.svg',
    width: 788,
    height: 609,
  },
  [servicePath('software-development')]: {
    src: '/illustrations/heroes/services-software-development.svg',
    width: 820,
    height: 693,
  },
  [servicePath('mvp-development')]: {
    src: '/illustrations/heroes/services-new-product-design-first-release.svg',
    width: 820,
    height: 519,
  },
  [ROUTES.expertise]: { src: '/illustrations/heroes/expertise.svg', width: 820, height: 464 },
  [ROUTES.audits]: { src: '/illustrations/heroes/audits.svg', width: 820, height: 627 },
  /* The 5 Nov 2026 illustration run (owner-approved the same day; docs/illustrations/run-2026-11-05/):
     the /services, /tools and Lab heroes, and one hero per industry, each built around its object in
     the expertise hub drawing. */
  [ROUTES.services]: { src: '/illustrations/heroes/services.svg', width: 1210, height: 630 },
  [ROUTES.tools]: { src: '/illustrations/heroes/tools.svg', width: 860, height: 650 },
  /* The designer's desk, redrawn in the run's hand (owner, 5 Nov 2026: "put the desk on the careers hero"). */
  [ROUTES.careers]: { src: '/illustrations/heroes/careers.svg', width: 864, height: 607 },
  [ROUTES.futureInterfacesLab]: {
    src: '/illustrations/heroes/future-interfaces-lab.svg',
    width: 864,
    height: 578,
  },
  [expertisePath('healthtech')]: {
    src: '/illustrations/heroes/expertise-healthtech.svg',
    width: 865,
    height: 651,
  },
  [expertisePath('fintech')]: {
    src: '/illustrations/heroes/expertise-fintech.svg',
    width: 865,
    height: 582,
  },
  [expertisePath('climatetech-energy')]: {
    src: '/illustrations/heroes/expertise-climatetech-energy.svg',
    width: 865,
    height: 578,
  },
  [expertisePath('edtech-learning')]: {
    src: '/illustrations/heroes/expertise-edtech-learning.svg',
    width: 860,
    height: 572,
  },
  [expertisePath('proptech-contech-field-operations')]: {
    src: '/illustrations/heroes/expertise-proptech-contech-field-operations.svg',
    width: 860,
    height: 574,
  },
  [expertisePath('commerce-transactional-products')]: {
    src: '/illustrations/heroes/expertise-commerce-transactional-products.svg',
    width: 865,
    height: 578,
  },
  [expertisePath('b2b-saas-workflow-software')]: {
    src: '/illustrations/heroes/expertise-b2b-saas-workflow-software.svg',
    width: 864,
    height: 522,
  },
  [expertisePath('data-analytics-decision-products')]: {
    src: '/illustrations/heroes/expertise-data-analytics-decision-products.svg',
    width: 864,
    height: 576,
  },
  [expertisePath('ai-products-developer-tools')]: {
    src: '/illustrations/heroes/expertise-ai-products-developer-tools.svg',
    width: 864,
    height: 459,
  },
  [expertisePath('content-knowledge-discovery-platforms')]: {
    src: '/illustrations/heroes/expertise-content-knowledge-discovery-platforms.svg',
    width: 865,
    height: 584,
  },
  [expertisePath('marketplaces-multi-sided-platforms')]: {
    src: '/illustrations/heroes/expertise-marketplaces-multi-sided-platforms.svg',
    width: 860,
    height: 630,
  },
  [expertisePath('martech-salestech')]: {
    src: '/illustrations/heroes/expertise-martech-salestech.svg',
    width: 865,
    height: 572,
  },
};

export type ServiceIllustration = {
  src: string;
  width: number;
  height: number;
  alt: '';
  kind: 'illustration';
  cut: (typeof ILLUSTRATION_LEGENDS)[string] | undefined;
};

/** The hero drawing for a route, or for a service slug (the fixture service template passes a slug). */
export function serviceIllustration(routeOrSlug: string): ServiceIllustration | undefined {
  const route = routeOrSlug.startsWith('/') ? routeOrSlug : servicePath(routeOrSlug);
  const drawing = HERO_ILLUSTRATIONS[route];
  if (!drawing) return undefined;
  return { ...drawing, alt: '', kind: 'illustration', cut: ILLUSTRATION_LEGENDS[drawing.src] };
}

/**
 * Every service line's drawing (ch05 isometric family, `public/illustrations/services/`), by the
 * service's route — for a card that stands for the service rather than a hero that explains it (home
 * round 1, 10 Oct 2026: the six situations of "What do you need next?" each lead with their
 * service's drawing). Decorative in a card: the card's title names the service, so `alt` is empty.
 *
 * `/services/mvp-development` has no drawing of its own yet. Until it does it takes
 * Software Development's — the end-to-end build from system to release, the first release's own
 * promise ("design a first release … and build it too") — and docs/page-mapping.md (Home round 1)
 * lists the interim for the owner.
 */
const SERVICE_DRAWINGS: Readonly<
  Record<string, { file: string; width: number; height: number }>
> = {
  '/services/product-design': { file: 'product-design', width: 962, height: 714 },
  '/services/product-modernisation': { file: 'product-modernisation', width: 787, height: 695 },
  '/services/ai-product-ux': { file: 'ai-product-ux', width: 879, height: 747 },
  '/services/design-systems': { file: 'design-systems', width: 681, height: 569 },
  '/services/design-engineering': { file: 'design-engineering', width: 737, height: 560 },
  '/services/software-development': { file: 'software-development', width: 714, height: 610 },
  '/services/mvp-development': {
    file: 'software-development',
    width: 714,
    height: 610,
  },
};

export type ServiceDrawing = {
  src: string;
  width: number;
  height: number;
  alt: '';
  kind: 'illustration';
};

/** The drawing for a service route, on paper. Undefined for a route with none. */
export function serviceDrawing(route: string): ServiceDrawing | undefined {
  const drawing = SERVICE_DRAWINGS[route];
  if (!drawing) return undefined;
  return {
    src: `/illustrations/services/${drawing.file}.paper.svg`,
    width: drawing.width,
    height: drawing.height,
    alt: '',
    kind: 'illustration',
  };
}
