import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  ToolBlock,
  ToolCard,
  ToolContentColumn,
  ToolContentSource,
  ToolLabelledItem,
  ToolPage,
  ToolSection,
  ToolSeo,
} from '../../types';
import { absoluteAssetUrl, mapUploadImage } from './image';
import { escapeHtml, richTextToHtml, richTextToPlainText, safeContentHref } from './rich-text';
import { mapTable } from './table';
import { TOOL_BY_SLUG_QUERY } from './tool-query';
import type {
  StrapiTool,
  StrapiToolBlock,
  StrapiToolContentColumn,
  StrapiToolLabelledItem,
  StrapiToolResponse,
} from './tool-types';

const TOOL_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function joinCopy(parts: Array<string | undefined>, separator = ' '): string {
  return parts
    .map((part) => value(part))
    .filter(Boolean)
    .join(separator);
}


function labelledItemSummary(item: StrapiToolLabelledItem): string {
  const label = value(item.label);
  const title = value(item.title);
  const body = richTextToPlainText(item.body);
  const lead = joinCopy([label, title], label && title ? ': ' : '');
  return joinCopy([lead, body], lead && body ? ' — ' : '');
}

function mapLabelledItem(item: StrapiToolLabelledItem): ToolLabelledItem | undefined {
  const label = value(item.label);
  const title = value(item.title) || label;
  if (!title) return undefined;

  const body = richTextToPlainText(item.body);
  return {
    title,
    body: label && label !== title ? joinCopy([label, body], body ? ' — ' : '') : body,
  };
}

function mapLabelledItems(
  items: StrapiToolLabelledItem[] | null | undefined,
): ToolLabelledItem[] {
  return (items ?? []).flatMap((item) => {
    const mapped = mapLabelledItem(item);
    return mapped ? [mapped] : [];
  });
}

function mapGridColumns(columns: string | null | undefined): 1 | 2 | 3 | 4 {
  switch (value(columns).toLowerCase()) {
    case 'one':
    case '1':
      return 1;
    case 'three':
    case '3':
      return 3;
    case 'four':
    case '4':
      return 4;
    default:
      return 2;
  }
}

function blockId(block: StrapiToolBlock, index: number): string {
  return `${value(block.__typename) || 'tool-block'}-${value(block.id) || index}`;
}

function mapContentColumn(
  column: StrapiToolContentColumn | null | undefined,
  context: string,
): ToolContentColumn | undefined {
  if (!column) return undefined;

  const heading = value(column.heading);
  if (!heading) return undefined;

  return {
    id: context,
    ...(value(column.eyebrow) ? { eyebrow: value(column.eyebrow) } : {}),
    heading,
    bodyHtml: richTextToHtml(column.body, `${context} body`),
    items: mapLabelledItems(column.labelledItems),
  };
}

function mapBlock(
  block: StrapiToolBlock,
  index: number,
  graphqlUrl: string,
): ToolBlock | undefined {
  const id = blockId(block, index);

  switch (block.__typename) {
    case 'ComponentToolRichText': {
      const html = richTextToHtml(block.body, `${id} body`);
      return html ? { id, type: 'rich-text', html } : undefined;
    }

    case 'ComponentToolCardGrid': {
      const cards: ToolCard[] = (block.cardGridCards ?? []).flatMap((card) => {
        const title = value(card.title) || value(card.eyebrow);
        if (!title) return [];

        const eyebrow = value(card.eyebrow);
        return [
          {
            title,
            body: joinCopy(
              [
                richTextToPlainText(card.body),
                ...(card.labelledItems ?? []).map(labelledItemSummary),
              ],
              ' — ',
            ),
            ...(eyebrow && eyebrow !== title ? { eyebrow } : {}),
          },
        ];
      });

      return cards.length
        ? { id, type: 'card-grid', columns: mapGridColumns(block.cardGridColumns), cards }
        : undefined;
    }

    case 'ComponentToolComparisonCards': {
      const cards: ToolCard[] = (block.comparisonCards ?? []).flatMap((card) => {
        const title = value(card.title);
        if (!title) return [];

        const eyebrow = joinCopy(
          [card.isRecommended === true ? 'Recommended' : undefined, value(card.badge)],
          ' · ',
        );
        return [
          {
            title,
            body: joinCopy(
              [
                richTextToPlainText(card.summary),
                ...(card.details ?? []).map(labelledItemSummary),
              ],
              ' — ',
            ),
            ...(eyebrow ? { eyebrow } : {}),
          },
        ];
      });

      return cards.length ? { id, type: 'comparison-cards', cards } : undefined;
    }

    case 'ComponentToolTable': {
      const table = mapTable(block);
      return table ? { id, type: 'table', table } : undefined;
    }

    case 'ComponentToolQuote': {
      const quote = value(block.quote);
      const name = value(block.attribution);
      const role = value(block.role);
      return quote && name && role
        ? {
            id,
            type: 'quote',
            quote: {
              quoteHtml: `<p>${escapeHtml(quote)}</p>`,
              name,
              role,
              company: 'Tcules',
            },
          }
        : undefined;
    }

    case 'ComponentToolCallout': {
      const label = value(block.label);
      const heading = value(block.calloutHeading);
      const lead = joinCopy([label, heading], label && heading ? ': ' : '');
      const body = richTextToHtml(block.body, `${id} body`);
      const html = `${lead ? `<p><strong>${escapeHtml(lead)}</strong></p>` : ''}${body}`;
      return html ? { id, type: 'callout', html } : undefined;
    }

    case 'ComponentToolLabelledList': {
      const items = mapLabelledItems(block.items);
      return items.length
        ? {
            id,
            type: 'labelled-list',
            displayStyle: value(block.displayStyle).toLowerCase(),
            items,
          }
        : undefined;
    }

    case 'ComponentToolTwoColumnContent': {
      const left = mapContentColumn(block.left, `${id} left column`);
      const right = mapContentColumn(block.right, `${id} right column`);
      return left || right
        ? { id, type: 'two-column', ...(left ? { left } : {}), ...(right ? { right } : {}) }
        : undefined;
    }

    case 'ComponentToolLinkGroup': {
      const heading = value(block.linkGroupHeading);
      const links = (block.groupLinks ?? []).flatMap((link) => {
        const title = value(link.name);
        const href = safeContentHref(link.href);
        if (!title || !href) return [];

        return [
          {
            title,
            body: value(link.description),
            href,
            external:
              link.isExternal === true ||
              href.startsWith('http://') ||
              href.startsWith('https://'),
          },
        ];
      });

      return heading && links.length
        ? {
            id,
            type: 'link-group',
            heading,
            ...(value(block.description) ? { description: value(block.description) } : {}),
            links,
          }
        : undefined;
    }

    case 'ComponentSharedMedia': {
      const file = block.file;
      if (!file) return undefined;

      const caption = value(file.caption) || value(file.alternativeText) || value(file.name);
      if (!caption) return undefined;

      const src = absoluteAssetUrl(file.url, graphqlUrl);
      const image = mapUploadImage(file, graphqlUrl, {
        fallbackAlt: value(file.name),
        requireImageMime: true,
      });
      const download =
        !image && src
          ? {
              label: value(file.name) || caption,
              href: src,
            }
          : undefined;

      return {
        id,
        type: 'media',
        ...(image ? { image } : {}),
        caption,
        ...(download ? { download } : {}),
      };
    }

    default:
      return undefined;
  }
}

function anchorSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
}

function uniqueAnchor(candidate: string, usedAnchors: Set<string>): string {
  const base = candidate || 'tool-section';
  let anchor = base;
  let suffix = 2;

  while (usedAnchors.has(anchor)) {
    anchor = `${base}-${suffix}`;
    suffix += 1;
  }

  usedAnchors.add(anchor);
  return anchor;
}

function mapSections(
  blocks: StrapiToolBlock[] | null | undefined,
  graphqlUrl: string,
): ToolSection[] {
  const sections: ToolSection[] = [];
  const usedAnchors = new Set<string>();
  let current: ToolSection | undefined;

  (blocks ?? []).forEach((block, index) => {
    if (block.__typename === 'ComponentToolSectionHeading') {
      const text = value(block.sectionHeading);
      const id = blockId(block, index);
      const anchor = uniqueAnchor(
        anchorSlug(value(block.anchorId)) || anchorSlug(text) || anchorSlug(id),
        usedAnchors,
      );

      current = {
        id,
        ...(text
          ? {
              heading: {
                text,
                anchorId: anchor,
                ...(value(block.navigationLabel)
                  ? { navigationLabel: value(block.navigationLabel) }
                  : {}),
              },
            }
          : {}),
        blocks: [],
      };
      sections.push(current);
      return;
    }

    const mapped = mapBlock(block, index, graphqlUrl);
    if (!mapped) return;

    if (!current) {
      current = { id: 'tool-content-introduction', blocks: [] };
      sections.push(current);
    }
    current.blocks.push(mapped);
  });

  return sections.filter((section) => section.heading || section.blocks.length > 0);
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}

function parseJson(candidate: unknown): unknown {
  if (typeof candidate === 'string') {
    const source = candidate.trim();
    if (!source) return undefined;
    try {
      return JSON.parse(source) as unknown;
    } catch {
      return undefined;
    }
  }

  if (Array.isArray(candidate)) {
    const isRichText = candidate.some(
      (item) => isRecord(item) && typeof item.type === 'string',
    );
    const source = richTextToPlainText(candidate);
    if (source) {
      try {
        return JSON.parse(source) as unknown;
      } catch {
        return isRichText ? undefined : candidate;
      }
    }
    return isRichText ? undefined : candidate;
  }

  return candidate;
}

function normaliseJsonLd(candidate: unknown): Record<string, unknown> | unknown[] | undefined {
  const parsed = parseJson(candidate);
  if (Array.isArray(parsed)) return parsed;
  if (!isRecord(parsed)) return undefined;

  const preview = parsed.full_json_ld_preview;
  return isRecord(preview) || Array.isArray(preview) ? preview : parsed;
}

function structuredDataFromTool(
  seo: NonNullable<StrapiTool['seo']>,
): ToolSeo['structuredData'] {
  for (const candidate of [seo.codeJson, seo.graphCode, seo.structuredData]) {
    const structuredData = normaliseJsonLd(candidate);
    if (structuredData) return structuredData;
  }
  return undefined;
}

function canonicalUrl(rawUrl: string | null | undefined): string | undefined {
  const candidate = safeContentHref(rawUrl);
  if (!candidate) return undefined;
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return candidate;

  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapSeo(rawSeo: StrapiTool['seo']): ToolSeo | undefined {
  if (!rawSeo) return undefined;

  const title = value(rawSeo.metaTitle);
  const description = value(rawSeo.metaDescription);
  const canonical = canonicalUrl(rawSeo.canonicalURL);
  const robotTokens = value(rawSeo.robot)
    .toLowerCase()
    .split(/[\s,]+/u)
    .filter(Boolean);
  const robots = robotTokens.length
    ? { index: !robotTokens.includes('noindex'), follow: !robotTokens.includes('nofollow') }
    : undefined;
  const structuredData = structuredDataFromTool(rawSeo);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function mapTool(rawTool: StrapiTool, graphqlUrl: string): ToolPage | null {
  const slug = value(rawTool.slug);
  if (!slug) return null;

  const seo = mapSeo(rawTool.seo);
  return {
    documentId: value(rawTool.documentId) || slug,
    slug,
    title: value(rawTool.title),
    ...(value(rawTool.publishedAt) ? { publishedAt: value(rawTool.publishedAt) } : {}),
    hero: {
      ...(value(rawTool.hero?.eyebrow) ? { eyebrow: value(rawTool.hero?.eyebrow) } : {}),
      ...(value(rawTool.hero?.highlightedText)
        ? { highlightedText: value(rawTool.hero?.highlightedText) }
        : {}),
      description: value(rawTool.hero?.description),
    },
    sections: mapSections(rawTool.content, graphqlUrl),
    ...(seo ? { seo } : {}),
  };
}

async function fetchToolBySlug(slug: string): Promise<StrapiTool | null> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: TOOL_BY_SLUG_QUERY,
      variables: { slug, status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: TOOL_REVALIDATE_SECONDS,
      tags: ['tools', `tool:${slug.slice(0, 240)}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi tool request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiToolResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi tool query failed: ${errors.join('; ')}`);
  }

  return payload.data?.tools?.[0] ?? null;
}

/** Convert Strapi's tool schema into the stable view model consumed by the dynamic route. */
export const toolSource: ToolContentSource = {
  async getToolPage(slug) {
    const requestedSlug = value(slug);
    if (!requestedSlug) return null;

    const graphqlUrl = getStrapiGraphqlUrl();
    const tool = await fetchToolBySlug(requestedSlug);
    return tool ? mapTool(tool, graphqlUrl) : null;
  },
};
