import { listServiceSlugs } from '@/content';
import { servicePath } from '@/lib/routes';

import { renderShareCard, shareCardFor } from '../../_og';

/**
 * `/og/<page path>/<card id>` — the share cards for the two catch-all families, `/services/…` and
 * `/insights/…`, whose segments cannot hold an `opengraph-image` file. The last segment is the
 * card's id (ch10 C1's versioned name plus a content hash), so a new picture or title changes the URL;
 * the rest is the page's path.
 *
 * Built at build time for every published service; an insight's card renders on its first request
 * and is kept like any other route.
 */
export async function generateStaticParams() {
  let paths: string[] = [];
  try {
    paths = (await listServiceSlugs()).map((slug) => servicePath(slug));
  } catch (error) {
    /* The CMS unreachable at build: every card renders on its first request instead. */
    console.error(error);
  }
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
