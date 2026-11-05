import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { landedClaimFigure } from '@/app/_corpus/claim-figure';
import { heroFallback } from '@/app/_corpus/hero-fallback';
import { landedReasonFigure } from '@/app/_corpus/reason-figure';
import { getExpertiseMasterPage, getOfferScenes, getPageSeo } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedExpertiseMaster } from '@/templates/CorpusPage/PublishedExpertiseMaster';

/**
 * `/expertise`: the Expertise Master from the new CMS (its hero and sections, in the editor's order)
 * and its published SEO Page. The `(listing)` group keeps this page's error and loading states off the
 * `/expertise/{slug}` detail pages.
 */

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.expertise)).metadata;
}

export default async function ExpertiseHub() {
  const [page, { structuredData }, scenes] = await Promise.all([
    getExpertiseMasterPage(),
    getPageSeo(ROUTES.expertise),
    getOfferScenes(ROUTES.expertise),
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
      <PublishedExpertiseMaster
        page={page}
        fallbackMedia={page.hero.media ? undefined : heroFallback(ROUTES.expertise)}
        scenes={scenes}
        reasonFigure={landedReasonFigure}
        claimFigure={landedClaimFigure}
      />
    </>
  );
}
