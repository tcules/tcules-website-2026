import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { heroFallback } from '@/app/_corpus/hero-fallback';
import { getPageSeo, getPublishedServicesMasterPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedServicesMaster } from '@/templates/CorpusPage/PublishedServicesMaster';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.services)).metadata;
}

export default async function ServicesPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedServicesMasterPage(),
    getPageSeo(ROUTES.services),
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
      <PublishedServicesMaster
        page={page}
        fallbackMedia={page.hero.media ? undefined : heroFallback(ROUTES.services)}
      />
    </>
  );
}
