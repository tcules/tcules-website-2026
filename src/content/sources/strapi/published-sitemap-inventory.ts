import { publicGraphql } from './public-graphql';

const COLLECTIONS = {
  services: '/services/',
  audits: '/audits/',
  expertises: '/expertise/',
  glossaries: '/glossary/',
  tools: '/tools/',
  caseStudies: '/case-studies/',
  authors: '/insights/authors/',
  resources: '/insights/',
  howWeWorks: '/how-we-work/',
} as const;

type Collection = keyof typeof COLLECTIONS;
type Seo = { robot?: string | null; technical?: { index?: string | null } | null };
type RecordNode = {
  slug: string;
  routePath: string;
  updatedAt?: string;
  resourceType?: { slug: string } | null;
  seo?: Seo | null;
};
type SeoNode = { pagePath: string; seo: Seo | null };
type Connection<T> = { nodes: T[]; pageInfo: { pageCount: number } };
type Inventory = Partial<Record<Collection, Connection<RecordNode>>> & {
  seoPages?: Connection<SeoNode>;
};

const SEO_FIELDS = 'seo { robot technical { index } }';
const EMBEDDED_SEO = new Set<Collection>(['caseStudies', 'authors', 'resources']);
const RESOURCE_TYPES = new Set(['articles', 'guides', 'research', 'videos', 'events', 'podcasts']);
const SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isNoindex(seo: Seo | null | undefined) {
  return seo?.technical?.index === 'noindex' || /(?:^|[,\s])noindex(?:$|[,\s])/i.test(seo?.robot ?? '');
}

function isRouted(collection: Collection, record: RecordNode) {
  if (!record.slug || record.slug === 'main') return false;
  if (record.routePath !== COLLECTIONS[collection] + record.slug) return false;
  const segments = record.slug.split('/');
  if (!segments.every((segment) => SEGMENT.test(segment))) return false;
  if (collection === 'resources') {
    const kind = record.resourceType?.slug;
    if (!kind || !RESOURCE_TYPES.has(kind) || /^authors?(?:\/|$)/.test(record.slug)) return false;
    if (record.slug.startsWith('events/') || record.slug.startsWith('podcasts/'))
      return segments.length === 2 && segments[0] === kind;
    return kind !== 'events' && kind !== 'podcasts';
  }
  return collection === 'services' || segments.length === 1;
}

export async function listPublishedSitemapInventory() {
  const entries: { path: string; lastModified?: string }[] = [];
  const excluded = new Set<string>();
  let collections = Object.keys(COLLECTIONS) as Collection[];
  let readSeo = true;

  for (let page = 1; collections.length || readSeo; page++) {
    const pagination = `pagination: { page: ${page}, pageSize: 100 }`;
    const fields = collections.map((collection) => `
      ${collection}: ${collection}_connection(status: PUBLISHED, ${pagination}, sort: ["slug:asc"]) {
        nodes {
          slug routePath updatedAt
          ${collection === 'resources' ? 'resourceType { slug }' : ''}
          ${EMBEDDED_SEO.has(collection) ? SEO_FIELDS : ''}
        }
        pageInfo { pageCount }
      }`);
    if (readSeo) {
      fields.push(`seoPages: seoPages_connection(status: PUBLISHED, ${pagination}, sort: ["pagePath:asc"]) {
        nodes { pagePath ${SEO_FIELDS} }
        pageInfo { pageCount }
      }`);
    }
    const data = await publicGraphql<Inventory>(
      `query PublishedSitemapInventory { ${fields.join('\n')} }`,
      'PublishedSitemapInventory',
    );

    for (const collection of collections) {
      for (const node of data[collection]?.nodes ?? []) {
        if (!isRouted(collection, node) || isNoindex(node.seo)) continue;
        entries.push({ path: node.routePath, lastModified: node.updatedAt });
      }
    }
    for (const node of data.seoPages?.nodes ?? []) {
      if (isNoindex(node.seo)) excluded.add(node.pagePath);
    }
    collections = collections.filter((collection) => (data[collection]?.pageInfo.pageCount ?? 0) > page);
    readSeo = (data.seoPages?.pageInfo.pageCount ?? 0) > page;
  }

  return { entries, excluded };
}
