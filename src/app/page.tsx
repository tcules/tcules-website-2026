import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getHomePage, getPageSeo } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedHome } from '@/templates/CorpusPage/PublishedHome';

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.home)).metadata;
}

export default async function Home() {
  const [page, { structuredData }] = await Promise.all([
    getHomePage(),
    getPageSeo(ROUTES.home),
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
      <PublishedHome page={page} />
    </>
  );
}
