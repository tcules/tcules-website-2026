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
  servicePath('new-product-design-first-release'),
]);

/** Whether a route's hero must carry an illustration or an image. */
export const heroNeedsMedia = (route: string): boolean => HERO_MEDIA_ROUTES.has(route);
