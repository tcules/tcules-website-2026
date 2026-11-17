import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageSeo, getPublishedMatterPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedMatter } from '@/templates/CorpusPage/PublishedMatter';
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.matterDesignSystem)).metadata;
}
export default async function MatterPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedMatterPage(),
    getPageSeo(ROUTES.matterDesignSystem),
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
      <PublishedMatter page={page} />
    </>
  );
}
