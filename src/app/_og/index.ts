import type { Metadata } from 'next';

import { shareCardFor } from './resolve';
import { renderShareCard, SHARE_SIZE } from './render';

export { shareCardFor } from './resolve';
export { renderShareCard, SHARE_SIZE } from './render';
export type { ShareCard } from './card';

type Params = Record<string, string | string[] | undefined>;

/**
 * One route segment's share card, through Next's `opengraph-image` convention (6.6). A segment's
 * `opengraph-image.tsx` is three lines:
 *
 *     const og = shareImage(ROUTES.about);                       // or (params) => path
 *     export const generateImageMetadata = og.generateImageMetadata;
 *     export default og.Image;
 *
 * `generateImageMetadata` gives each card its alt and its versioned id, so the URL ends in
 * ch10 C1's file name — `/about/opengraph-image/tcules-og-company-about-v01` — and a redesign that
 * bumps the version changes every URL, which is the only way past an unfurler's cache.
 */
export function shareImage(path: string | ((params: Params) => string)) {
  const pathOf = (params: Params | undefined) => (typeof path === 'string' ? path : path(params ?? {}));
  return {
    async generateImageMetadata({ params }: { params?: Params | Promise<Params> }) {
      const card = await shareCardFor(pathOf(await params));
      return [{ id: card.id, alt: card.alt, size: SHARE_SIZE, contentType: 'image/png' }];
    },
    async Image({ params }: { params?: Promise<Params>; id?: Promise<string | number> }) {
      return renderShareCard(await shareCardFor(pathOf(await params)));
    },
  };
}

/** A catch-all segment's path: `/services` + `['product-design', 'ux-research']`. */
export const under =
  (root: string) =>
  (params: Params): string => {
    const slug = params.slug;
    return `${root}/${Array.isArray(slug) ? slug.join('/') : (slug ?? '')}`;
  };

/** Where `/og/[...path]` serves a page's card: the page's path, then the card's versioned id. */
export const shareImagePath = (path: string, id: string) =>
  `/og${path === '/' ? '' : path}/${id}`;

/**
 * A page's metadata with its share card named in it, for the two catch-all families (`/services/…`,
 * `/insights/…`) that cannot hold an `opengraph-image` file. Every other route gets the same card
 * from its segment's file; this is the same card by another door.
 */
export async function withShareImage(metadata: Metadata, path: string): Promise<Metadata> {
  const card = await shareCardFor(path);
  const image = {
    url: shareImagePath(path, card.id),
    ...SHARE_SIZE,
    alt: card.alt,
    type: 'image/png',
  };
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [image] },
    twitter: { ...metadata.twitter, card: 'summary_large_image', images: [image] },
  };
}
