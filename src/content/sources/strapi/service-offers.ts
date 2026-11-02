import { cache } from 'react';
import type { CorpusPage } from '../../corpus-types';
import type { SitePage } from '../../types';
import type { OfferScenes } from '@/lib/sketches';
import { parseCorpusDocument } from '../corpus/load';
import { productionCmsQuery } from './production-cms';

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
type ServiceDocument = { route: string; body: string; frontmatter: Record<string, unknown> };
type Illustration = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: 'illustration';
};
export type ServiceOffer = {
  page: CorpusPage;
  scenes: OfferScenes;
  heroIllustration?: Illustration;
};
const validSlug = (slug: string) =>
  slug.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/u.test(slug);
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

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

export function mapServiceOffer(document: ServiceDocument, route: string): ServiceOffer {
  if (
    document.route !== route ||
    document.frontmatter.route !== route ||
    !document.body?.trim()
  ) {
    throw new Error(`Production CMS returned an invalid service document for ${route}.`);
  }
  const page = parseCorpusDocument(`cms:${route}`, document.frontmatter, document.body);
  if (!page.hero.titleText || page.pageType !== 'service') {
    throw new Error(`Production CMS service ${route} has no service page content.`);
  }
  const template = record(document.frontmatter.frontendTemplate);
  const rawScenes = record(template.scenes);
  const scenes: OfferScenes = {
    items: record(rawScenes.items) as OfferScenes['items'],
    stories: record(rawScenes.stories) as OfferScenes['stories'],
  };
  const image = record(template.heroIllustration);
  const heroIllustration =
    typeof image.src === 'string' &&
    /^https?:\/\//u.test(image.src) &&
    typeof image.width === 'number' &&
    image.width > 0 &&
    typeof image.height === 'number' &&
    image.height > 0
      ? {
          src: image.src,
          alt: typeof image.alt === 'string' ? image.alt : '',
          width: image.width,
          height: image.height,
          kind: 'illustration' as const,
        }
      : undefined;
  return { page, scenes, ...(heroIllustration ? { heroIllustration } : {}) };
}

export const getServiceOfferPage = cache(async (slug: string): Promise<ServiceOffer | null> => {
  if (!validSlug(slug) || slug === 'main') return null;
  const route = `/services/${slug}`;
  const data = await productionCmsQuery<{ scopedCorpusDocument: ServiceDocument | null }>(
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
