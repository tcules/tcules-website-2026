import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageSeo, getPublishedWorkPage } from '@/content';
import { PublishedWork } from '@/templates/CorpusPage/PublishedWork';
import { jsonLdMarkup } from '@/lib/json-ld';
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo('/how-we-work/ai-transparency')).metadata;
}
export default async function WorkPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedWorkPage('ai-transparency'),
    getPageSeo('/how-we-work/ai-transparency'),
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
      <PublishedWork page={page} />
    </>
  );
}
