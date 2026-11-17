import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { heroFallback } from '@/app/_corpus/hero-fallback';
import { getPageSeo, getPublishedClientMasterPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedClientMaster } from '@/templates/CorpusPage/PublishedClientMaster';

/**
 * `/clients`: the Client Master from the new CMS (its hero and sections, in the editor's order), each
 * client, case study, testimonial and FAQ read through its relation, and the published SEO Page for
 * `/clients`. Composition only.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.clients)).metadata;
}
export default async function ClientsPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedClientMasterPage(),
    getPageSeo(ROUTES.clients),
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
      <PublishedClientMaster
        page={page}
        fallbackMedia={page.hero.media ? undefined : heroFallback(ROUTES.clients)}
      />
    </>
  );
}
