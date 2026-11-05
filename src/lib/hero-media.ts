import { ROUTES, servicePath } from './routes';

/**
 * The high-traffic pages, whose hero ALWAYS carries an illustration or an image (owner, 29 Oct
 * 2026: "pages that will be highly visited like contact, about, services level 1, should all always
 * have a hero illustration or an image"; decisions/2026-10-29-high-traffic-heroes-carry-media).
 *
 * A route here never renders a text-only hero: where it binds no asset, its hero takes the labelled
 * placeholder from docs/image-register.md (`<route>#hero`) until the art arrives. One list, read by
 * every template that draws these heroes (CorpusPage's CorpusHero and the Strapi service route), so
 * a page cannot drop its image by changing templates.
 *
 * /contact left the list on 31 Oct 2026 (owner; decisions/2026-10-31-contact-hero-centred-form-below):
 * its hero is the centred stack with the enquiry island straight under it, and the island's drawing
 * is the first screen's picture.
 */
export const HERO_MEDIA_ROUTES: ReadonlySet<string> = new Set([
  ROUTES.about,
  servicePath('product-design'),
  servicePath('design-systems'),
  servicePath('design-engineering'),
  servicePath('ai-product-ux'),
  servicePath('product-modernisation'),
  servicePath('software-development'),
  servicePath('mvp-development'),
]);

/** Whether a route's hero must carry an illustration or an image. */
export const heroNeedsMedia = (route: string): boolean => HERO_MEDIA_ROUTES.has(route);

/**
 * Heroes set centred, the media below the words (PageHero `centred`), where a long title would stack
 * seven lines in the beside split's half column (owner, 2 Nov 2026, /services: "because the hero
 * title is so long, the center aligned version with the illustration below"). A route's choice, in
 * code, as every arrangement is (ruling H1); the title still never runs across media
 * (hero-title-stays-in-its-column), because here nothing sits beside it.
 */
export const CENTRED_HERO_ROUTES: ReadonlySet<string> = new Set([
  ROUTES.services,
  ROUTES.expertise,
  /* The hero's picture is the real Matter file, a 1.8:1 collage of three Figma frames: in the beside
     split's half column it renders about 500 wide and its detail is lost; centred it takes the 860 cap
     (docs/page-build/pages/matter-design-system.md, 4 Nov 2026). */
  ROUTES.matterDesignSystem,
  /* A 73-character title that ran to five display lines in the beside split's half column at 1440
     (docs/page-build/pages/future-interfaces-lab-join.md, 4 Nov 2026). The studio photograph takes the
     content width under the copy. */
  ROUTES.futureInterfacesLabJoin,
]);

/** Whether a route's hero is the centred stack with its media below. */
export const heroIsCentred = (route: string): boolean => CENTRED_HERO_ROUTES.has(route);

/**
 * Heroes set as words alone, centred, with no picture of their own: a page whose first picture is the
 * band directly under the hero (the /contact precedent, contact-hero-centred-form-below). /careers'
 * first band is the studio collage; a studio photograph in the hero as well would put two photographs
 * side by side down the page (adjacent-bands-change-visual-register) and stack two "words beside a
 * photograph" shapes at the top (docs/page-build/pages/careers.md, 4 Nov 2026, owner to confirm).
 * A route here is never in `HERO_MEDIA_ROUTES`: a high-traffic hero always carries media.
 */
export const TEXT_HERO_ROUTES: ReadonlySet<string> = new Set([ROUTES.careers]);

/** Whether a route's hero is the centred text stack with no media (`TEXT_HERO_ROUTES`). */
export const heroIsText = (route: string): boolean =>
  TEXT_HERO_ROUTES.has(route) && !HERO_MEDIA_ROUTES.has(route);

/**
 * A service sub-page (`/services/<service>/<sub>`) with no drawing of its own shows no picture in its
 * hero, and no placeholder: the words alone, stacked, until its illustration is drawn (owner, 5 Nov
 * 2026; decisions/2026-11-05-service-subpage-heroes-no-placeholder). A drawn or clipped hero still
 * shows (src/lib/service-illustrations.ts, hero-clips.ts); the caller checks those first.
 */
export const heroIsServiceSubPage = (route: string): boolean =>
  route.startsWith(`${ROUTES.services}/`) && route.split('/').length > 3;
