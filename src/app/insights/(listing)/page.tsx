import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getInsightsPage, getPageSeo } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { ListingIndex } from '@/templates';

import { insightsIndexProps } from '../../_insights/hub';

const INSIGHTS_SLUG = ROUTES.insights.slice(1);

type InsightsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** The hub's SEO is its published SEO Page on the new CMS, as every CMS-backed page's is. */
export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.insights)).metadata;
}

/**
 * The insights hub: the Resource Listing from the new CMS (its hero, its Resource Index's pieces in the
 * editor's order, its CTAs), a curated page BY TYPE with the finder (ListingIndex). The route reads the
 * CMS and the URL; `insightsIndexProps` maps both onto the template, and the specimen at
 * /design/listing-index runs the same mapping over the stress fixture. The `(listing)` group keeps this
 * page's error state off the `/insights/*` pages.
 */
export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const [page, { structuredData }, query] = await Promise.all([
    getInsightsPage(INSIGHTS_SLUG),
    getPageSeo(ROUTES.insights),
    searchParams,
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
      <ListingIndex {...insightsIndexProps(page, query)} />
    </>
  );
}
