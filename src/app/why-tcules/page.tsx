import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageSeo, getPublishedWhyPage } from '@/content';
import { landedReasonFigure } from '@/app/_corpus/reason-figure';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedWhy } from '@/templates/CorpusPage/PublishedWhy';
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.whyTcules)).metadata;
}
export default async function WhyPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedWhyPage(),
    getPageSeo(ROUTES.whyTcules),
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
      <PublishedWhy page={page} reasonFigure={landedReasonFigure} />
    </>
  );
}
