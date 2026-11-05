import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPageSeo, getPublishedAuthorMasterPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedAuthorMaster } from '@/templates/ListingIndex/PublishedAuthorMaster';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.authors)).metadata;
}

export default async function AuthorsIndexPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedAuthorMasterPage(),
    getPageSeo(ROUTES.authors),
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
      <PublishedAuthorMaster page={page} />
    </>
  );
}
