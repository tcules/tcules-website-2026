import { SITE_ORIGIN } from '@/lib/routes';

/** One level of a page's trail, as `@/lib/trail` and Breadcrumbs take it. */
type Crumb = { label: string; href: string };
type Graph = Record<string, unknown> | unknown[];

/**
 * A page's graph with its BreadcrumbList built from the trail the page shows (owner, 11 Nov 2026:
 * the template owns the structured data it can derive). The CMS entry's own hand-typed BreadcrumbList
 * is replaced, not merged: two lists that can disagree is the failure this removes. The node keeps the
 * entry's `@id` when it had one, so the WebPage node's `breadcrumb` reference still resolves.
 *
 * Every level is listed, the page itself last, even where the visible trail stops at the parent
 * because the h1 names the page (lib/trail.ts): the markup describes the hierarchy, not the layout.
 */
export function withBreadcrumbList(data: Graph | undefined, crumbs: readonly Crumb[]): Graph {
  const leaf = crumbs.at(-1);
  const isList = (node: unknown): node is Record<string, unknown> =>
    Boolean(node) &&
    typeof node === 'object' &&
    (node as Record<string, unknown>)['@type'] === 'BreadcrumbList';

  const graph: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.['@graph'])
      ? (data['@graph'] as unknown[])
      : data
        ? [data]
        : [];
  const existing = graph.find(isList);
  const id =
    (existing && typeof existing['@id'] === 'string' ? existing['@id'] : undefined) ??
    (leaf ? `${absolute(leaf.href)}#breadcrumb` : undefined);
  const list = {
    '@type': 'BreadcrumbList',
    ...(id ? { '@id': id } : {}),
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: absolute(crumb.href),
    })),
  };
  const nodes = [...graph.filter((node) => !isList(node)), list];

  if (!data || Array.isArray(data))
    return { '@context': 'https://schema.org', '@graph': nodes };
  if (Array.isArray(data['@graph'])) return { ...data, '@graph': nodes };
  return { '@context': data['@context'] ?? 'https://schema.org', '@graph': nodes };
}

function absolute(href: string): string {
  return new URL(href, SITE_ORIGIN).href;
}
