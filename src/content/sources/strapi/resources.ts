import { cache } from 'react';
import type {
  BlogAuthor,
  BlogBlock,
  BlogPage,
  BlogResource,
  ContentSeo,
  EventPage,
  InsightResource,
  InsightResourceKind,
  InsightsPage,
  PodcastPage,
  SitePage,
} from '../../types';
import { personSlug } from '../people';
import { mapUploadImage, absoluteAssetUrl } from './image';
import { markdownToHtml, resolveInPageAnchors } from './markdown';
import { escapeHtml, safeContentHref } from './rich-text';
import { mapTable } from './table';
import { productionCmsQuery, productionCmsUrl } from './production-cms';
import { RESOURCE_BY_SLUG_QUERY, RESOURCE_LIST_QUERY } from './resource-query';
import { RESOURCE_ANCHOR_ALIASES } from './resource-anchor-aliases';
import type {
  ResourceBodyBlock,
  ResourceFile,
  ResourcePerson,
  ResourceRecord,
  ResourceTaxonomy,
} from './resource-types';

const KINDS: Record<string, InsightResourceKind> = {
  articles: 'article',
  guides: 'guide',
  research: 'research',
  videos: 'video',
  events: 'event',
  podcasts: 'podcast',
  interviews: 'interview',
};
const text = (value: string | null | undefined) => value?.trim() || '';
const validSlug = (slug: string) =>
  slug.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/u.test(slug);
function kindOf(record: ResourceRecord): InsightResourceKind {
  const kind = KINDS[record.resourceType?.slug || ''];
  if (!kind) throw new Error(`Unsupported production resource type for ${record.slug}.`);
  return kind;
}
function image(file: ResourceFile | null | undefined, fallbackAlt: string) {
  const mapped = mapUploadImage(file, productionCmsUrl(), {
    fallbackAlt,
    requireImageMime: true,
  });
  return mapped ? { ...mapped, mime: text(file?.mime) } : undefined;
}
export function resourceAuthors(record: ResourceRecord): ResourcePerson[] {
  const unique = new Map<string, ResourcePerson>();
  for (const person of [record.writtenBy, ...(record.coAuthors || [])]) {
    if (person?.name) unique.set(person.documentId, person);
  }
  return [...unique.values()];
}
function authors(record: ResourceRecord): BlogAuthor[] {
  return resourceAuthors(record).map((person) => ({
    id: person.documentId,
    name: person.name,
    slug: personSlug(person.name),
    designation: text(person.designation),
    image: image(person.profileImage, person.name),
  }));
}
function seo(record: ResourceRecord): ContentSeo | undefined {
  const raw = record.seo;
  if (!raw) return undefined;
  const tokens = text(raw.robot)
    .toLowerCase()
    .split(/[\s,]+/u)
    .filter(Boolean);
  const canonical = safeContentHref(raw.canonicalURL);
  const structuredData = raw.structuredData;
  return {
    title: text(raw.metaTitle),
    description: text(raw.metaDescription),
    ...(canonical?.startsWith('http') ? { canonical } : {}),
    ...(tokens.length
      ? {
          robots: { index: !tokens.includes('noindex'), follow: !tokens.includes('nofollow') },
          noindex: tokens.includes('noindex'),
        }
      : {}),
    ...(structuredData && typeof structuredData === 'object'
      ? { structuredData: structuredData as Record<string, unknown> | unknown[] }
      : {}),
  };
}
export function resourceCard(record: ResourceRecord): InsightResource {
  const kind = kindOf(record);
  const tags = record.topics || [];
  const categories = [record.resourceType, record.stage, record.industry].filter(
    (item): item is ResourceTaxonomy => !!item,
  );
  return {
    documentId: record.documentId,
    slug: record.slug,
    title: record.title,
    kind,
    description: text(record.description),
    image: image(record.thumbnail || record.heroBanner?.image, record.title),
    tags,
    categories,
    filterIds: [...tags, ...categories].map((item) => item.documentId),
    publishedAt: record.publicationDate || undefined,
    ...(record.readingTime ? { readingTime: `${record.readingTime} min read` } : {}),
  };
}
function related(record: ResourceRecord): BlogResource[] {
  const group = record.exploreOtherResources;
  const seen = new Set([record.documentId]);
  return [group?.resourceOne, group?.resourceTwo, group?.resourceThree].flatMap((item) => {
    if (!item?.publishedAt || seen.has(item.documentId)) return [];
    seen.add(item.documentId);
    const card = resourceCard(item);
    return [
      {
        documentId: card.documentId,
        slug: card.slug,
        title: card.title,
        kind: card.kind,
        description: card.description,
        publishedAt: card.publishedAt,
        image: image(item.thumbnail || item.heroBanner?.image, item.title),
        tags: card.tags.map((tag) => tag.name),
        categories: card.categories.map((category) => category.name),
      },
    ];
  });
}
function youtubeId(candidate: string | null | undefined): string | undefined {
  try {
    const url = new URL(candidate || '');
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
      return undefined;
    const host = url.hostname.replace(/^(?:www\.|m\.|music\.)/u, '');
    const id =
      host === 'youtu.be'
        ? url.pathname.split('/')[1]
        : ['youtube.com', 'youtube-nocookie.com'].includes(host)
          ? url.searchParams.get('v') ||
            url.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)/u)?.[1]
          : undefined;
    return id && /^[A-Za-z0-9_-]{11}$/u.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}
function mapBlock(block: ResourceBodyBlock, record: ResourceRecord): BlogBlock[] {
  const id = `${block.__typename}-${block.id}`;
  switch (block.__typename) {
    case 'ComponentResourceSectionHeading':
      if (!block.anchorId || !block.heading2)
        throw new Error(`Invalid resource section in ${record.slug}.`);
      return [
        {
          id,
          type: 'heading',
          anchorId: block.anchorId,
          heading: block.heading2,
          eyebrow: block.eyebrow,
        },
      ];
    case 'ComponentResourceRichText':
      return [{ id, type: 'prose', html: markdownToHtml(block.body, id) }];
    case 'ComponentResourceCallout':
    case 'ComponentResourceInsights': {
      const heading = block.heading || block.insightsTitle;
      return [
        {
          id,
          type: 'callout',
          html: `${heading ? `<p><strong>${escapeHtml(heading)}</strong></p>` : ''}${markdownToHtml(block.body, id)}`,
        },
      ];
    }
    case 'ComponentResourceTable': {
      const table = mapTable(block);
      return table ? [{ id, type: 'table', table }] : [];
    }
    case 'ComponentResourceImageGrid': {
      const columns = block.gridColumns === 'one' ? 1 : block.gridColumns === 'three' ? 3 : 2;
      const figures = (block.images || []).flatMap((file) => {
        const mapped = image(file, `${record.title} — project image`);
        return mapped
          ? [
              {
                image: mapped,
                ...(block.showCaptions !== false && file.caption
                  ? { caption: file.caption }
                  : {}),
              },
            ]
          : [];
      });
      return figures.length ? [{ id, type: 'figures', columns, figures }] : [];
    }
    case 'ComponentResourceVideo': {
      const thumbnail = image(block.thumbnail, `${record.title} — video thumbnail`);
      const src = absoluteAssetUrl(block.videoFile?.url, productionCmsUrl());
      const mime = text(block.videoFile?.mime);
      return [
        {
          id,
          type: 'video',
          title: block.title,
          description: block.description,
          thumbnail,
          ...(block.mediaType === 'youtube'
            ? { youtubeId: youtubeId(block.youtubeUrl) }
            : src && mime.startsWith('video/')
              ? {
                  video: {
                    src,
                    mime,
                    poster: thumbnail?.src,
                    autoplay: block.autoplay === true,
                    loop: block.loop === true,
                  },
                }
              : {}),
        },
      ];
    }
    case 'ComponentResourceEmbed': {
      const candidate =
        block.url || block.embedCode?.match(/\bsrc\s*=\s*["']([^"']+)["']/iu)?.[1];
      const href = safeContentHref(candidate);
      const diagram = svgDiagram(block);
      return [
        {
          id,
          type: 'embed',
          title: block.embedTitle || record.title,
          description: block.description || diagram?.alt,
          url: href?.startsWith('http') ? href : undefined,
          width: block.width,
          height: block.height,
          thumbnail: image(block.thumbnail, `${record.title} — embedded content`),
          ...(diagram ? { diagram } : {}),
        },
      ];
    }
    case 'ComponentResourceCode':
      return [
        {
          id,
          type: 'code',
          html: `<pre><code>${escapeHtml(block.codeSnippet || '')}</code></pre>`,
        },
      ];
    case 'ComponentResourceSeparator':
      return [
        {
          id,
          type: 'separator',
          html: `${block.title ? `<p><strong>${escapeHtml(block.title)}</strong></p>` : ''}<hr>`,
        },
      ];
    default:
      throw new Error(
        `Unsupported resource body component ${block.__typename} in ${record.slug}.`,
      );
  }
}

/** SVG runs in an image document; CMS markup is never inserted into the page's DOM. */
function svgDiagram(block: ResourceBodyBlock) {
  let svg = block.embedCode?.match(/<svg\b[\s\S]*?<\/svg>/iu)?.[0];
  if (!svg) return undefined;
  // The CMS's imported figure wrapper can serialize the SVG with an empty namespace.
  svg = /\sxmlns\s*=/iu.test(svg)
    ? svg.replace(/\sxmlns\s*=\s*["'][^"']*["']/iu, ' xmlns="http://www.w3.org/2000/svg"')
    : svg.replace(/^<svg\b/iu, '<svg xmlns="http://www.w3.org/2000/svg"');
  const dimensions = svg
    .match(/\bviewBox\s*=\s*["']([^"']+)["']/iu)?.[1]
    ?.trim()
    .split(/[\s,]+/u)
    .map(Number);
  const externalCss = [...svg.matchAll(/\burl\(\s*(["']?)(.*?)\1\s*\)/giu)].some(
    (match) => !match[2]?.trim().startsWith('#'),
  );
  if (
    !dimensions ||
    dimensions.length !== 4 ||
    !dimensions.every(Number.isFinite) ||
    dimensions[2]! <= 0 ||
    dimensions[3]! <= 0 ||
    /<(?:script|foreignObject)\b|<!DOCTYPE|<!ENTITY|\son[a-z]+\s*=|\s(?:xlink:)?href\s*=\s*["'](?!#)|@import/iu.test(
      svg,
    ) ||
    externalCss
  ) {
    throw new Error('Production CMS resource contains an invalid SVG diagram.');
  }
  const description = svg
    .match(/<desc\b[^>]*>([\s\S]*?)<\/desc>/iu)?.[1]
    ?.replace(/<[^>]*>/gu, '')
    .replace(/&amp;/gu, '&')
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&quot;/gu, '"')
    .replace(/&apos;/gu, "'")
    .trim();
  return {
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    alt: description || block.embedTitle || 'Resource diagram',
    width: dimensions[2]!,
    height: dimensions[3]!,
    mime: 'image/svg+xml',
    kind: 'illustration' as const,
  };
}

/** Native records retain tables, authored anchors and publication dates instead of legacy DTOs. */
export function mapResource(record: ResourceRecord): BlogPage {
  const hero = record.heroBanner;
  const featureImage =
    hero?.mediaType === 'image' ? image(hero.image, record.title) : undefined;
  const heroId = hero?.mediaType === 'youtube' ? youtubeId(hero.youtubeUrl) : undefined;
  const href = safeContentHref(record.cta?.button?.href);
  const cta =
    record.cta?.ctaType === 'button' && href && record.cta.button?.name
      ? {
          heading: record.cta.heading,
          body: [text(record.cta.description)] as const,
          actions: [
            {
              label: record.cta.button.name,
              href,
              external: record.cta.button.isExternal === true || /^https?:/u.test(href),
            },
          ] as const,
        }
      : undefined;
  return {
    documentId: record.documentId,
    slug: record.slug,
    title: record.title,
    kind: kindOf(record),
    description: text(record.description) || text(record.seo?.metaDescription),
    createdAt: record.createdAt,
    publishedAt: record.publishedAt,
    publishedContent: record.publicationDate || undefined,
    updatedAt: record.lastUpdatedDate || undefined,
    readingTime: record.readingTime ? `${record.readingTime} min` : undefined,
    ...(heroId ? { heroVideo: { id: heroId, title: `${record.title} video` } } : {}),
    featureImage,
    socialImage: image(record.thumbnail, record.title) || featureImage,
    authors: authors(record),
    tags: (record.topics || []).map((topic) => topic.name),
    categories: [record.resourceType.name],
    blocks: resourceAnchors(record),
    outline: record.showTableOfContents === false ? [] : record.outline || [],
    resources: related(record),
    resourcesHeading: record.exploreOtherResources?.title,
    cta,
    seo: seo(record),
  };
}

function resourceAnchors(record: ResourceRecord): BlogBlock[] {
  const blocks = resolveInPageAnchors(
    (record.body || []).flatMap((block) => mapBlock(block, record)),
  );
  const aliases = RESOURCE_ANCHOR_ALIASES[record.slug];
  if (!aliases) return blocks;
  const ids = new Set(
    blocks.flatMap((block) => (block.type === 'heading' ? [block.anchorId] : [])),
  );
  return blocks.map((block) =>
    'html' in block
      ? {
          ...block,
          html: block.html.replace(/href="#([^"]+)"/gu, (original, anchor: string) => {
            const target = aliases[anchor];
            return target && ids.has(target) ? `href="#${escapeHtml(target)}"` : original;
          }),
        }
      : block,
  );
}

type ResourceConnection = {
  resources_connection: {
    pageInfo: { total: number; page: number; pageCount: number };
    nodes: ResourceRecord[];
  };
};
export const listPublishedResources = cache(async (): Promise<ResourceRecord[]> => {
  const records = new Map<string, ResourceRecord>();
  let pageCount = 1;
  let total = 0;
  for (let page = 1; page <= pageCount; page++) {
    const data = await productionCmsQuery<ResourceConnection>(RESOURCE_LIST_QUERY, { page }, [
      'resources',
    ]);
    const connection = data.resources_connection;
    if (
      !connection ||
      !Array.isArray(connection.nodes) ||
      !Number.isInteger(connection.pageInfo?.total)
    ) {
      throw new Error('Production CMS returned an invalid resource collection.');
    }
    total = connection.pageInfo.total;
    pageCount = connection.pageInfo.pageCount;
    if (
      pageCount < 0 ||
      pageCount > 10000 ||
      !Number.isInteger(pageCount) ||
      connection.pageInfo.page !== page
    ) {
      throw new Error('Production CMS returned invalid resource pagination.');
    }
    for (const record of connection.nodes) {
      if (!record.publishedAt || !validSlug(record.slug) || records.has(record.documentId))
        throw new Error('Production CMS returned an invalid or duplicate resource.');
      kindOf(record);
      records.set(record.documentId, record);
    }
  }
  if (records.size !== total)
    throw new Error('Production CMS resource pagination returned an incomplete collection.');
  return [...records.values()];
});

export const getPublishedResource = cache(
  async (slug: string): Promise<ResourceRecord | null> => {
    if (!validSlug(slug)) return null;
    const data = await productionCmsQuery<{ resources: ResourceRecord[] }>(
      RESOURCE_BY_SLUG_QUERY,
      { slug },
      ['resources', `resource:${slug.slice(0, 240)}`],
    );
    if (!Array.isArray(data.resources))
      throw new Error('Production CMS returned no resource collection.');
    const record = data.resources[0] || null;
    if (record && (record.slug !== slug || !record.publishedAt))
      throw new Error('Production CMS returned an unexpected or unpublished resource.');
    return record;
  },
);

export const resourceBlogSource = {
  getBlogPage: cache(async (slug: string) => {
    const record = await getPublishedResource(slug);
    return record ? mapResource(record) : null;
  }),
};
export const resourceEventSource = {
  getEventPage: cache(async (slug: string): Promise<EventPage | null> => {
    const record = await getPublishedResource(`events/${slug}`);
    return record && kindOf(record) === 'event'
      ? { ...mapResource(record), slug, details: record.eventDetails || [] }
      : null;
  }),
};
export const resourcePodcastSource = {
  getPodcastPage: cache(async (slug: string): Promise<PodcastPage | null> => {
    const record = await getPublishedResource(`podcasts/${slug}`);
    return record && kindOf(record) === 'podcast' ? { ...mapResource(record), slug } : null;
  }),
};

export const resourceInsightsSource = {
  getInsightsPage: cache(async (slug: string): Promise<InsightsPage | null> => {
    if (slug !== 'insights') return null;
    const records = await listPublishedResources();
    const items = records.map(resourceCard);
    const types = [
      ...new Map(
        records.map((record) => [record.resourceType.documentId, record.resourceType]),
      ).values(),
    ];
    const filters = (label: string, values: (ResourceTaxonomy | null | undefined)[]) => ({
      id: label.toLowerCase(),
      label,
      options: [
        ...new Map(
          values
            .filter((item): item is ResourceTaxonomy => !!item)
            .map((item) => [
              item.documentId,
              { id: item.documentId, name: item.name, kind: 'tag' as const },
            ]),
        ).values(),
      ],
    });
    return {
      documentId: 'resources',
      slug,
      hero: {
        heading: 'Insights from building products at the edge of design, engineering and AI',
        description:
          'In-depth articles, podcasts & interviews from teams solving complexity-heavy product problems.',
      },
      formatCards: types.map((type) => ({
        id: type.documentId,
        title: type.name,
        kind: KINDS[type.slug || ''],
      })),
      lab: {
        id: 'insights-lab',
        heading: 'Tcules Labs Experiments',
        description:
          "We're crafting innovative AI solutions to improve user experiences, streamline processes, & enhance efficiency across various sectors.",
        action: { label: 'GO TO LABS', href: '/future-interfaces-lab', external: false },
      },
      closing: {
        id: 'insights-closing',
        heading: 'Level up your UX knowledge',
        description: 'Subscribe to receive practical UX insights for your product',
      },
      resources: {
        id: 'insights-resources',
        heading: 'Tcules resources',
        items,
        filters: [
          filters(
            'Topic',
            records.flatMap((record) => record.topics || []),
          ),
          filters(
            'Stage',
            records.map((record) => record.stage),
          ),
          filters(
            'Industry',
            records.map((record) => record.industry),
          ),
        ],
      },
      seo: {
        title: 'Product Design Insights: Articles, Guides, Videos | Tcules',
        description:
          'Articles, guides, videos and events from Tcules on new SaaS products, AI inside products, design systems, modernisation and everyday SaaS UX.',
        canonical: 'https://www.tcules.com/insights',
      },
    };
  }),
};

export async function resourceSitePages(): Promise<SitePage[]> {
  return (await listPublishedResources()).map((record) => ({
    family:
      kindOf(record) === 'event'
        ? ('event' as const)
        : kindOf(record) === 'podcast'
          ? ('podcast' as const)
          : ('insight' as const),
    slug: ['event', 'podcast'].includes(kindOf(record))
      ? record.slug.split('/').slice(1).join('/')
      : record.slug,
    title: record.title,
    updatedAt: record.lastUpdatedDate || record.publicationDate || record.updatedAt,
  }));
}
