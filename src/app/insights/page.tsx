import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getInsightsPage } from '@/content';
import { ROUTES } from '@/lib/routes';
import { ListingIndex } from '@/templates';

import { insightsIndexProps } from '../_insights/hub';

const INSIGHTS_SLUG = ROUTES.insights.slice(1);

type InsightsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getInsightsPage(INSIGHTS_SLUG);

  if (!page) {
    return {
      title: 'Insights not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = page.seo?.title || page.hero.heading;
  const description = page.seo?.description || page.hero.description;
  const canonical = page.seo?.canonical;
  const image =
    page.resources.items.find((item) => item.image && !item.image.standIn)?.image ??
    page.formatCards.find((card) => card.image)?.image;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(page.seo?.robots ? { robots: page.seo.robots } : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      ...(canonical ? { url: canonical } : {}),
      images: image ? [{ url: image.src, alt: image.alt }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image.src] : [],
    },
  };
}

/**
 * The insights hub: a curated page, BY TYPE or BY TOPIC (ListingIndex). The route reads the CMS and
 * the URL (`?view=topic`); `insightsIndexProps` maps both onto the template, and the specimen at
 * /design/listing-index runs the same mapping over the stress fixture.
 */
export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const [page, query] = await Promise.all([getInsightsPage(INSIGHTS_SLUG), searchParams]);

  if (!page) notFound();

  return <ListingIndex {...insightsIndexProps(page, query)} />;
}
