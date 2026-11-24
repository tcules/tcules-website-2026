import { offerSlugs } from '../../_corpus/offer';
import { longformSlugs } from '../../_corpus/longform';
import { renderShareCard, shareCardFor } from '../../_og';

/**
 * `/og/<page path>/<card id>` — the share cards for the two catch-all families, `/services/…` and
 * `/insights/…`, whose segments cannot hold an `opengraph-image` file. The last segment is the
 * card's id (ch10 C1's versioned name plus a content hash), so a new picture or title changes the URL;
 * the rest is the page's path.
 *
 * Built at build time for every corpus page in both families; a CMS-only insight renders on its
 * first request and is cached like any other route.
 */
export async function generateStaticParams() {
  const paths = [
    ...offerSlugs('/services').map((slug) => `/services/${slug}`),
    ...longformSlugs('/insights').map((slug) => `/insights/${slug}`),
  ];
  return Promise.all(
    paths.map(async (path) => {
      const card = await shareCardFor(path);
      return { path: [...path.split('/').filter(Boolean), card.id] };
    }),
  );
}

/** Every card id starts with this (`card.ts`: `tcules-og-{type}-{slug}-{version}-{hash}`). */
const CARD_ID_PREFIX = 'tcules-og-';

export async function GET(_request: Request, { params }: RouteContext<'/og/[...path]'>) {
  const { path } = await params;
  /* A link without an id, typed or pasted by hand as /og/<page path>, draws that page's card. Read
     blindly, its last segment would be taken as the id and every /og/services/<line> would draw the
     /services card (owner, 24 Nov 2026). */
  const hasId = path.at(-1)?.startsWith(CARD_ID_PREFIX) ?? false;
  const page = `/${(hasId ? path.slice(0, -1) : path).join('/')}`;
  /* Any id draws the page's CURRENT card: an id from before a new drawing or title still unfurls,
     with today's picture, rather than failing a re-fetch. */
  return renderShareCard(await shareCardFor(page));
}
