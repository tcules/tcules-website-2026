import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPageSeo, getPublishedWorkPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { PublishedWork } from '@/templates/CorpusPage/PublishedWork';

/**
 * `/how-we-work/{slug}` — one How We Work record from the new CMS, by its slug. The record has no SEO
 * field of its own, so its <head> is the SEO Page for its path. An unknown or malformed slug is the
 * site's not-found page. Composition only.
 */
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedWorkPage(slug);
  if (!page)
    return {
      title: 'Page not found | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  return (await getPageSeo(`${ROUTES.howWeWork}/${slug}`)).metadata;
}

export default async function WorkDetail({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedWorkPage(slug);
  if (!page) notFound();
  const { structuredData } = await getPageSeo(page.route);
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
