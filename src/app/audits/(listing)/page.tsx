import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { landedClaimFigure } from '@/app/_corpus/claim-figure';
import { heroFallback } from '@/app/_corpus/hero-fallback';
import { landedReasonFigure } from '@/app/_corpus/reason-figure';
import { getAuditMasterPage, getOfferScenes, getPageSeo } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedAuditMaster } from '@/templates/CorpusPage/PublishedAuditMaster';

/**
 * `/audits`: the Audit Master from the new CMS (its hero and sections, in the editor's order; its
 * audit cards through their Audit relations) and its published SEO Page. The `(listing)` group keeps
 * this page's error and loading states off the `/audits/{slug}` detail pages.
 */

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.audits)).metadata;
}

export default async function AuditsHub() {
  const [page, { structuredData }, scenes] = await Promise.all([
    getAuditMasterPage(),
    getPageSeo(ROUTES.audits),
    getOfferScenes(ROUTES.audits),
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
      <PublishedAuditMaster
        page={page}
        fallbackMedia={page.hero.media ? undefined : heroFallback(ROUTES.audits)}
        scenes={scenes}
        reasonFigure={landedReasonFigure}
        claimFigure={landedClaimFigure}
      />
    </>
  );
}
