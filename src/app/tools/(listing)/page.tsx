import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { heroFallback } from '@/app/_corpus/hero-fallback';
import { getOfferScenes, getPageSeo, getToolsMasterPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedToolsMaster } from '@/templates/CorpusPage/PublishedToolsMaster';

/**
 * `/tools`: the Tool Master from the new CMS (its hero and sections, in the editor's order), each tool
 * read through its Tool relation and linked to `/tools/{slug}`, and the published SEO Page for
 * `/tools`. The `(listing)` group keeps this page's error state off the `/tools/{slug}` detail pages.
 *
 * The route stays in PASS_1_COMPOSED_ROUTES (src/app/_corpus/composed.tsx) so kinds:check keeps
 * comparing the `_pages/` copy with what renders; it no longer renders through ComposedRoute.
 */

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.tools)).metadata;
}

export default async function ToolsHub() {
  const [page, { structuredData }, scenes] = await Promise.all([
    getToolsMasterPage(),
    getPageSeo(ROUTES.tools),
    getOfferScenes(ROUTES.tools),
  ]);
  if (!page) notFound();

  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
        />
      ) : null}
      <PublishedToolsMaster
        page={page}
        fallbackMedia={page.hero.media ? undefined : heroFallback(ROUTES.tools)}
        scenes={scenes}
      />
    </>
  );
}
