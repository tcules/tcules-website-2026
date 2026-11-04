import { ILLUSTRATION_LEGENDS } from './illustration-legends';
import { ROUTES, servicePath } from './routes';

/**
 * The hero drawings, by route.
 *
 * Six are Bhumika's finals, frozen by Jatin on 30 Oct 2026 and then polished (one outline weight,
 * corner edges, lines that stop at what they reach; docs/illustrations/polish-2026-10-30/), each cropped
 * to its own bounds. The owner approved them for the pages the same day. Four more are the owner's
 * approved canvas versions not yet through that polish (owner, 30 Oct 2026): Software Development, New
 * Product Design & First Release, and the /expertise and /audits hubs, their text flattened to paths and
 * their viewBox trimmed to the drawing. An illustration is never cropped; every other page's hero is a
 * bound asset or a labelled placeholder.
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
