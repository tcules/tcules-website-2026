import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getOfferScenes, getPageSeo, getServiceDetail, listServiceSlugs } from '@/content';
import { landedClaimFigure } from '@/app/_corpus/claim-figure';
import { heroFallback } from '@/app/_corpus/hero-fallback';
import { landedReasonFigure } from '@/app/_corpus/reason-figure';
import { jsonLdMarkup } from '@/lib/json-ld';
import { servicePath } from '@/lib/routes';
import { PublishedService } from '@/templates/CorpusPage/PublishedService';

/**
 * `/services/{slug}`: a Service from the new CMS, by its full relative slug (`product-design`,
 * `product-design/ux-research`). Its words, sections, order and variants are the CMS's; its SEO is the
 * published SEO Page for the same path. The listing (`/services`) is a separate route.
 */

export const revalidate = 300;

function requestedSlug(slug: readonly string[]): string {
  return slug
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

export async function generateStaticParams() {
  try {
    return (await listServiceSlugs()).map((slug) => ({ slug: slug.split('/') }));
  } catch (error) {
    /* The CMS unreachable at build: every route renders on its first request instead. */
    console.error(error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps<'/services/[...slug]'>): Promise<Metadata> {
  const slug = requestedSlug((await params).slug);
  try {
    const service = await getServiceDetail(slug);
    if (!service) {
      return {
        title: 'Service not found | Tcules',
        description: null,
        robots: { index: false, follow: false },
      };
    }
    return (await getPageSeo(service.route)).metadata;
  } catch {
    return {
      title: 'Service temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
}

export default async function ServicePage({ params }: PageProps<'/services/[...slug]'>) {
  const slug = requestedSlug((await params).slug);
  const service = await getServiceDetail(slug);
  if (!service) notFound();
  const route = servicePath(service.slug);
  const [{ structuredData }, scenes] = await Promise.all([
    getPageSeo(route),
    getOfferScenes(route),
  ]);

  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
        />
      ) : null}
      <PublishedService
        page={service}
        fallbackMedia={service.hero.media ? undefined : heroFallback(route)}
        scenes={scenes}
        reasonFigure={landedReasonFigure}
        claimFigure={landedClaimFigure}
      />
    </>
  );
}
