import { cache } from 'react';
import type { SitePage } from '../../types';
import { productionCmsQuery } from './production-cms';
import { mapOfferDocument, type OfferDocument, type CmsOffer } from './offer-document';

const SERVICE_LIST_QUERY = /* GraphQL */ `
  query PublishedServices($page: Int!, $pageSize: Int!) {
    services_connection(
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

/** This CMS resolver reads published entries of the collection owning the route (Services here). */
const SERVICE_OFFER_QUERY = /* GraphQL */ `
  query PublishedServiceOffer($route: String!) {
    scopedCorpusDocument(route: $route) {
      route
      body
      frontmatter
    }
  }
`;

type ServiceIdentity = { slug: string; title: string; updatedAt?: string | null };
export type ServiceOffer = CmsOffer;
const validSlug = (slug: string) =>
  slug.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/u.test(slug);
export const listPublishedServices = cache(async (): Promise<ServiceIdentity[]> => {
  const services = new Map<string, ServiceIdentity>();
  let page = 1;
  let pageCount = 1;
  do {
    const data = await productionCmsQuery<{
      services_connection: { pageInfo: { pageCount: number }; nodes: ServiceIdentity[] };
    }>(SERVICE_LIST_QUERY, { page, pageSize: 100 }, ['services', 'site-pages']);
    const connection = data.services_connection;
    if (
      !connection ||
      !Array.isArray(connection.nodes) ||
      !Number.isInteger(connection.pageInfo?.pageCount)
    ) {
      throw new Error('Production CMS returned an invalid services list.');
    }
    for (const service of connection.nodes) {
      if (validSlug(service.slug) && service.slug !== 'main')
        services.set(service.slug, service);
    }
    pageCount = connection.pageInfo.pageCount;
    page += 1;
  } while (page <= pageCount);
  return [...services.values()];
});

export function mapServiceOffer(document: OfferDocument, route: string): ServiceOffer {
  return mapOfferDocument(document, route, 'service');
}

export const getServiceOfferPage = cache(async (slug: string): Promise<ServiceOffer | null> => {
  if (!validSlug(slug) || slug === 'main') return null;
  const route = `/services/${slug}`;
  const data = await productionCmsQuery<{ scopedCorpusDocument: OfferDocument | null }>(
    SERVICE_OFFER_QUERY,
    { route },
    ['services', `service:${slug}`],
  );
  return data.scopedCorpusDocument ? mapServiceOffer(data.scopedCorpusDocument, route) : null;
});

export async function serviceSitePages(): Promise<SitePage[]> {
  return (await listPublishedServices()).map((service) => ({
    family: 'service',
    slug: service.slug,
    title: service.title,
    ...(service.updatedAt ? { updatedAt: service.updatedAt } : {}),
  }));
}
