import { cache } from 'react';
import type { SitePage } from '../../types';
import { productionCmsQuery } from './production-cms';
import { mapOfferDocument, type OfferDocument, type CmsOffer } from './offer-document';

const EXPERTISE_LIST_QUERY = /* GraphQL */ `
  query PublishedExpertises($page: Int!, $pageSize: Int!) {
    expertises_connection(
      status: PUBLISHED
      sort: ["slug:asc"]
      pagination: { page: $page, pageSize: $pageSize }
    ) {
      pageInfo {
        pageCount
      }
      nodes {
        slug
        title
        updatedAt
      }
    }
  }
`;

/** This CMS resolver reads published entries of the collection owning the route (Expertise here). */
const EXPERTISE_OFFER_QUERY = /* GraphQL */ `
  query PublishedExpertiseOffer($route: String!) {
    scopedCorpusDocument(route: $route) {
      route
      body
      frontmatter
    }
  }
`;

type ExpertiseIdentity = { slug: string; title: string; updatedAt?: string | null };
export type ExpertiseOffer = CmsOffer;
const validSlug = (slug: string) =>
  slug.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug);
export const listPublishedExpertises = cache(async (): Promise<ExpertiseIdentity[]> => {
  const expertises = new Map<string, ExpertiseIdentity>();
  let page = 1;
  let pageCount = 1;
  do {
    const data = await productionCmsQuery<{
      expertises_connection: { pageInfo: { pageCount: number }; nodes: ExpertiseIdentity[] };
    }>(EXPERTISE_LIST_QUERY, { page, pageSize: 100 }, ['expertise', 'site-pages']);
    const connection = data.expertises_connection;
    if (
      !connection ||
      !Array.isArray(connection.nodes) ||
      !Number.isInteger(connection.pageInfo?.pageCount)
    ) {
      throw new Error('Production CMS returned an invalid expertise list.');
    }
    for (const expertise of connection.nodes) {
      if (validSlug(expertise.slug) && expertise.slug !== 'main')
        expertises.set(expertise.slug, expertise);
    }
    pageCount = connection.pageInfo.pageCount;
    page += 1;
  } while (page <= pageCount);
  return [...expertises.values()];
});

export function mapExpertiseOffer(document: OfferDocument, route: string): ExpertiseOffer {
  return mapOfferDocument(document, route, 'expertise');
}

export const getExpertiseOfferPage = cache(
  async (slug: string): Promise<ExpertiseOffer | null> => {
    if (!validSlug(slug) || slug === 'main') return null;
    const route = `/expertise/${slug}`;
    const data = await productionCmsQuery<{ scopedCorpusDocument: OfferDocument | null }>(
      EXPERTISE_OFFER_QUERY,
      { route },
      ['expertise', `expertise:${slug}`],
    );
    return data.scopedCorpusDocument
      ? mapExpertiseOffer(data.scopedCorpusDocument, route)
      : null;
  },
);

export async function expertiseSitePages(): Promise<SitePage[]> {
  return (await listPublishedExpertises()).map((expertise) => ({
    family: 'expertise',
    slug: expertise.slug,
    title: expertise.title,
    ...(expertise.updatedAt ? { updatedAt: expertise.updatedAt } : {}),
  }));
}
