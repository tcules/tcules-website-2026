import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPageSeo, getPublishedContactPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedContact } from '@/templates/CorpusPage/PublishedContact';

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.contact)).metadata;
}

/** /contact from the CMS Contact Page. Composition only. */
export default async function ContactPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedContactPage(),
    getPageSeo(ROUTES.contact),
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
      <PublishedContact page={page} />
    </>
  );
}
