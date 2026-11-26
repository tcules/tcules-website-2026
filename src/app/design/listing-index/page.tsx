import type { Metadata } from 'next';

import {
  getInsightsFixturePage,
  type InsightsPage,
} from '@/content';
import { ROUTES } from '@/lib/routes';
import {
  AuthorPieces,
  ListingClose,
  ListingIndex,
} from '@/templates';

import { closingOf, insightCards, insightsIndexProps } from '../../_insights/hub';

export const metadata: Metadata = {
  title: 'ListingIndex · both listings | Design',
  robots: { index: false, follow: false },
};

const PATH = ROUTES.designListingIndex;

type Query = Record<string, string | string[] | undefined>;

type Props = {
  searchParams: Promise<Query>;
};

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * The live CMS's shape today, made from the fixture: articles, events and podcasts only (Strapi's
 * guides and videos aside), no collections, no close, and most covers missing — what the template
 * must still make a page of.
 */
function sparse(page: InsightsPage): InsightsPage {
  const keep = new Set(['article', 'event', 'podcast']);
  return {
    ...page,
    collections: undefined,
    closing: undefined,
    resources: {
      ...page.resources,
      items: page.resources.items
        .filter((item) => keep.has(item.kind))
        .map((item, index) => ({
          ...item,
          featured: undefined,
          image: item.kind === 'podcast' || index % 5 === 4 ? item.image : undefined,
        })),
    },
  };
}

/** No items at all: the hub before anything is published. */
function empty(page: InsightsPage): InsightsPage {
  return {
    ...page,
    collections: undefined,
    resources: { ...page.resources, items: [] },
  };
}

/**
 * ListingIndex — the one listing page type (owner, 22 Oct 2026: /insights and /case-studies share
 * one structure) — through the same mapping as the live insights hub (src/app/_insights/hub.tsx), so
 * the specimen and the page cannot drift.
 *
 *   (default)             the insights hub over the stress fixture (src/content/sources/fixtures/
 *                         insights.ts): all seven formats, more items than any section shows, the
 *                         longest titles and an unbroken one, missing covers and descriptions, an
 *                         event without a date
 *   ?type=articles&topic=… the finder: its picks over the results (any of the live page's
 *                         parameters); ticks, chips and "Show more" stay here, the state kept
 *   ?state=sparse         the live CMS's shape
 *   ?state=empty          nothing published
 *   ?data=author          an author page's pieces (AuthorPieces): a person with covers among many
 *                         pieces, one with many and no covers, one with two and none; then the close
 *                         with its `lead` set, as the authors index sets it
 *
 * A template's specimen is the page itself rather than Specimen blocks: what is judged is the
 * composition down its length, which a row of crops cannot show.
 */
export default async function ListingIndexSpecimen({ searchParams }: Props) {
  const query = await searchParams;
  const state = one(query.state);

  const fixture = await getInsightsFixturePage();

  if (one(query.data) === 'author') {
    const all = fixture.resources.items.filter((item) => item.kind !== 'event');
    const bare = all.map((item) => ({ ...item, image: undefined, coverScene: undefined }));
    /* Covers among the pieces: the fixture's catalogue photographs are stand-ins the hub never shows,
       so every third piece that has one shows it here as its own cover. */
    const mixed = all.map((item, at) =>
      item.image && at % 3 === 1 ? { ...item, image: { ...item.image, standIn: false } } : item,
    );
    return (
      <>
        <AuthorPieces
          heading="17 pieces by Alice"
          items={insightCards(fixture, mixed.slice(0, 17))}
        />
        <AuthorPieces
          heading="12 pieces by Ben"
          items={insightCards(fixture, bare.slice(0, 12))}
        />
        <AuthorPieces
          heading="2 pieces by Cleo"
          items={insightCards(fixture, bare.slice(0, 2))}
        />
        <ListingClose
          closing={closingOf(fixture, PATH, 'design-specimen')}
          lead="If one of these writers works on the problem in your own product, tell us about it."
        />
      </>
    );
  }

  const page =
    state === 'sparse' ? sparse(fixture) : state === 'empty' ? empty(fixture) : fixture;
  /* The finder's links and form come back to the specimen, the state kept. */
  const path = state ? `${PATH}?${new URLSearchParams({ state }).toString()}` : PATH;
  return <ListingIndex {...insightsIndexProps(page, query, path)} />;
}

