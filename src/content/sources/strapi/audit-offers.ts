import { cache } from 'react';
import type { SitePage } from '../../types';
import { productionCmsQuery } from './production-cms';
import { mapOfferDocument, type OfferDocument, type CmsOffer } from './offer-document';

const AUDIT_LIST_QUERY = /* GraphQL */ `
  query PublishedAudits($page: Int!, $pageSize: Int!) {
    audits_connection(
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

/** This CMS resolver reads published entries of the collection owning the route (Audit here). */
const AUDIT_OFFER_QUERY = /* GraphQL */ `
  query PublishedAuditOffer($route: String!) {
    scopedCorpusDocument(route: $route) {
      route
      body
      frontmatter
    }
  }
`;

type AuditIdentity = { slug: string; title: string; updatedAt?: string | null };
export type AuditOffer = CmsOffer;
const validSlug = (slug: string) =>
  slug.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug);
export const listPublishedAudits = cache(async (): Promise<AuditIdentity[]> => {
  const audits = new Map<string, AuditIdentity>();
  let page = 1;
  let pageCount = 1;
  do {
    const data = await productionCmsQuery<{
      audits_connection: { pageInfo: { pageCount: number }; nodes: AuditIdentity[] };
    }>(AUDIT_LIST_QUERY, { page, pageSize: 100 }, ['audits', 'site-pages']);
    const connection = data.audits_connection;
    if (
      !connection ||
      !Array.isArray(connection.nodes) ||
      !Number.isInteger(connection.pageInfo?.pageCount)
    ) {
      throw new Error('Production CMS returned an invalid audit list.');
    }
    for (const audit of connection.nodes) {
      if (validSlug(audit.slug) && audit.slug !== 'main') audits.set(audit.slug, audit);
    }
    pageCount = connection.pageInfo.pageCount;
    page += 1;
  } while (page <= pageCount);
  return [...audits.values()];
});

export function mapAuditOffer(document: OfferDocument, route: string): AuditOffer {
  return mapOfferDocument(document, route, 'audit');
}

export const getAuditOfferPage = cache(async (slug: string): Promise<AuditOffer | null> => {
  if (!validSlug(slug) || slug === 'main') return null;
  const route = `/audits/${slug}`;
  const data = await productionCmsQuery<{ scopedCorpusDocument: OfferDocument | null }>(
    AUDIT_OFFER_QUERY,
    { route },
    ['audits', `audit:${slug}`],
  );
  return data.scopedCorpusDocument ? mapAuditOffer(data.scopedCorpusDocument, route) : null;
});

export async function auditSitePages(): Promise<SitePage[]> {
  return (await listPublishedAudits()).map((audit) => ({
    family: 'audit',
    slug: audit.slug,
    title: audit.title,
    ...(audit.updatedAt ? { updatedAt: audit.updatedAt } : {}),
  }));
}
