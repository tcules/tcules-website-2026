import { offerSlugs } from '../../_corpus/offer';
import { longformSlugs } from '../../_corpus/longform';
import { renderShareCard, SHARE_DIRECTIONS, shareCardFor, type ShareDirection } from '../../_og';

/**
 * `/og/<page path>/<card id>` — the share cards for the two catch-all families, `/services/…` and
 * `/insights/…`, whose segments cannot hold an `opengraph-image` file. The last segment is the
 * card's versioned id (ch10 C1), so a redesign changes the URL; the rest is the page's path.
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

/** Review only, until the owner picks a direction: `?direction=b` draws that direction. */
function directionOf(request: Request): ShareDirection {
  const asked = new URL(request.url).searchParams.get('direction');
  return SHARE_DIRECTIONS.find((one) => one === asked) ?? 'a';
}

export async function GET(request: Request, { params }: RouteContext<'/og/[...path]'>) {
  const { path } = await params;
  const page = `/${path.slice(0, -1).join('/')}`;
  const card = await shareCardFor(page);
  if (card.id !== path.at(-1)) return new Response('Not found', { status: 404 });
  return renderShareCard(card, directionOf(request));
}
