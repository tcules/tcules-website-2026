import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageSeo, getPublishedClientMasterPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedClientMaster } from '@/templates/CorpusPage/PublishedClientMaster';

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
      <PublishedClientMaster page={page} />
    </>
  );
}
