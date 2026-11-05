import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageSeo, getPublishedWorkPage } from '@/content';
import { PublishedWork } from '@/templates/CorpusPage/PublishedWork';
import { jsonLdMarkup } from '@/lib/json-ld';
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo('/how-we-work/ai-native-product-design')).metadata;
}
export default async function WorkPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedWorkPage('ai-native-product-design'),
    getPageSeo('/how-we-work/ai-native-product-design'),
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
