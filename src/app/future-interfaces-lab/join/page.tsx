import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageSeo, getPublishedLabJoinPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedLab } from '@/templates/CorpusPage/PublishedLab';
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.futureInterfacesLabJoin)).metadata;
}
export default async function LabPage() {
  const [page, { structuredData }] = await Promise.all([
    getPublishedLabJoinPage(),
    getPageSeo(ROUTES.futureInterfacesLabJoin),
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
      <PublishedLab page={page} />
    </>
  );
}
