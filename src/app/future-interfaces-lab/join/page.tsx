import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOfferScenes, getPageSeo, getPublishedLabJoinPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedLab } from '@/templates/CorpusPage/PublishedLab';

/**
 * `/future-interfaces-lab/join`: the Future Interfaces Lab Join Single Type from the new CMS, with the
 * fellowship application form. The form's words and options are the CMS's; its fields, validation,
 * submission and success handling are EnquiryForm's. SEO is the published SEO Page for this path.
 *
 * No hero fallback: the page's hero before the CMS was a studio photograph, not an illustration.
 */
export const revalidate = 300;

const route = ROUTES.futureInterfacesLabJoin;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(route)).metadata;
}

export default async function LabJoinPage() {
  const [page, { structuredData }, scenes] = await Promise.all([
    getPublishedLabJoinPage(),
    getPageSeo(route),
    getOfferScenes(route),
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
      <PublishedLab page={page} scenes={scenes} />
    </>
  );
}
