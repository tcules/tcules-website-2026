import { cache } from 'react';
import type { SitePage } from '../../types';
import { productionCmsQuery } from './production-cms';
import type { CorpusPage } from '../../corpus-types';
import { parseCorpusDocument } from '../corpus/load';

const GLOSSARY_LIST_QUERY = /* GraphQL */ `
  query PublishedGlossaries($page: Int!, $pageSize: Int!) {
    glossaries_connection(
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

/** This CMS resolver reads published entries of the collection owning the route (Glossary here). */
const GLOSSARY_DOCUMENT_QUERY = /* GraphQL */ `
  query PublishedGlossaryDocument($route: String!) {
    scopedCorpusDocument(route: $route) {
      route
      body
      frontmatter
    }
  }
`;

type GlossaryDocument = { route: string; body: string; frontmatter: Record<string, unknown> };
type GlossaryIdentity = { slug: string; title: string; updatedAt?: string | null };
const validSlug = (slug: string) =>
  slug.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug);
export const listPublishedGlossaries = cache(async (): Promise<GlossaryIdentity[]> => {
  const glossaries = new Map<string, GlossaryIdentity>();
  let page = 1;
  let pageCount = 1;
  do {
    const data = await productionCmsQuery<{
      glossaries_connection: { pageInfo: { pageCount: number }; nodes: GlossaryIdentity[] };
    }>(GLOSSARY_LIST_QUERY, { page, pageSize: 100 }, ['glossary', 'site-pages']);
    const connection = data.glossaries_connection;
    if (
      !connection ||
      !Array.isArray(connection.nodes) ||
      !Number.isInteger(connection.pageInfo?.pageCount)
    ) {
      throw new Error('Production CMS returned an invalid glossary list.');
    }
    for (const glossary of connection.nodes) {
      if (validSlug(glossary.slug) && glossary.slug !== 'main')
        glossaries.set(glossary.slug, glossary);
    }
    pageCount = connection.pageInfo.pageCount;
    page += 1;
  } while (page <= pageCount);
  return [...glossaries.values()];
});

export function mapGlossaryDocument(document: GlossaryDocument, route: string): CorpusPage {
  if (
    document.route !== route ||
    document.frontmatter.route !== route ||
    !document.body?.trim()
  ) {
    throw new Error(`Production CMS returned an invalid glossary document for ${route}.`);
  }
  const page = parseCorpusDocument(`cms:${route}`, document.frontmatter, document.body);
  if (!page.hero.titleText || !['defined_term', 'glossary'].includes(page.pageType)) {
    throw new Error(`Production CMS glossary ${route} has no glossary term content.`);
  }
  return page;
}

export const getGlossaryDocument = cache(async (slug: string): Promise<CorpusPage | null> => {
  if (!validSlug(slug) || slug === 'main') return null;
  const route = `/glossary/${slug}`;
  const data = await productionCmsQuery<{ scopedCorpusDocument: GlossaryDocument | null }>(
    GLOSSARY_DOCUMENT_QUERY,
    { route },
    ['glossary', `glossary:${slug}`],
  );
  return data.scopedCorpusDocument
    ? mapGlossaryDocument(data.scopedCorpusDocument, route)
    : null;
});

export async function glossarySitePages(): Promise<SitePage[]> {
  return (await listPublishedGlossaries()).map((glossary) => ({
    family: 'glossary',
    slug: glossary.slug,
    title: glossary.title,
    ...(glossary.updatedAt ? { updatedAt: glossary.updatedAt } : {}),
  }));
}
