import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { heroFallback } from '@/app/_corpus/hero-fallback';
import { getPageSeo, getPublishedCareersPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedCareers } from '@/templates/CorpusPage/PublishedCareers';
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.careers)).metadata;
}
export default async function CareersPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedCareersPage(),
    getPageSeo(ROUTES.careers),
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
      <PublishedCareers
        page={page}
        fallbackMedia={page.hero.media ? undefined : heroFallback(ROUTES.careers)}
      />
    </>
  );
}
