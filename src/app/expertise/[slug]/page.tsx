import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getExpertiseDetail, getOfferScenes, getPageSeo, listExpertiseSlugs } from '@/content';
import { landedClaimFigure } from '@/app/_corpus/claim-figure';
import { heroFallback } from '@/app/_corpus/hero-fallback';
import { landedReasonFigure } from '@/app/_corpus/reason-figure';
import { jsonLdMarkup } from '@/lib/json-ld';
import { PublishedExpertise } from '@/templates/CorpusPage/PublishedExpertise';

/**
 * `/expertise/{slug}`: an Expertise from the new CMS, by its slug (`healthtech`). Its words, sections,
 * order and variants are the CMS's; its SEO is the published SEO Page for the same path. The listing
 * (`/expertise`) is a separate route.
 */

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    return (await listExpertiseSlugs()).map((slug) => ({ slug }));
  } catch (error) {
    /* The CMS unreachable at build: every route renders on its first request instead. */
    console.error(error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps<'/expertise/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  try {
    const expertise = await getExpertiseDetail(slug);
    if (!expertise) {
      return {
        title: 'Expertise not found | Tcules',
        description: null,
        robots: { index: false, follow: false },
      };
    }
    return (await getPageSeo(expertise.route)).metadata;
  } catch {
    return {
      title: 'Expertise temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
}

export default async function ExpertisePage({ params }: PageProps<'/expertise/[slug]'>) {
  const { slug } = await params;
  const expertise = await getExpertiseDetail(slug);
  if (!expertise) notFound();
  const route = expertise.route;
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
      <PublishedExpertise
        page={expertise}
        fallbackMedia={expertise.hero.media ? undefined : heroFallback(route)}
        scenes={scenes}
        reasonFigure={landedReasonFigure}
        claimFigure={landedClaimFigure}
      />
    </>
  );
}
