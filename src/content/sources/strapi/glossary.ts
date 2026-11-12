import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  GlossaryAction,
  GlossaryBlock,
  GlossaryContentColumn,
  GlossaryContentSource,
  GlossaryLabelledItem,
  GlossaryPage,
  GlossarySection,
  GlossarySeo,
} from '../../types';
import { absoluteAssetUrl, mapUploadImage } from './image';
import { GLOSSARY_BY_SLUG_QUERY } from './glossary-query';
import type {
  StrapiGlossary,
  StrapiGlossaryBlock,
  StrapiGlossaryResponse,
} from './glossary-types';
import { escapeHtml, richTextToHtml, richTextToPlainText, safeContentHref } from './rich-text';
import { mapTable } from './table';
import type { StrapiContentColumn, StrapiLabelledItem, StrapiLink } from './types';

const GLOSSARY_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function joinCopy(parts: Array<string | undefined>, separator = ' '): string {
  return parts
    .map((part) => value(part))
    .filter(Boolean)
    .join(separator);
}


function mapAction(link: StrapiLink | null | undefined): GlossaryAction | undefined {
  const label = value(link?.name);
  const href = safeContentHref(link?.href);
  if (!label || !href) return undefined;

  return {
    label,
    href,
    external:
      link?.isExternal === true || href.startsWith('http://') || href.startsWith('https://'),
  };
}

function mapActions(links: StrapiLink[] | null | undefined): GlossaryAction[] {
  return (links ?? []).flatMap((link) => {
    const action = mapAction(link);
    return action ? [action] : [];
  });
}

function labelledItemSummary(item: StrapiLabelledItem): string {
  const label = value(item.label);
  const title = value(item.title);
  const body = richTextToPlainText(item.body);
  const lead = joinCopy([label, title], label && title ? ': ' : '');
  return joinCopy([lead, body], lead && body ? ' — ' : '');
}

function mapLabelledItem(item: StrapiLabelledItem): GlossaryLabelledItem | undefined {
  const label = value(item.label);
  const title = value(item.title) || label;
  if (!title) return undefined;

  const body = richTextToPlainText(item.body);
  const href = mapAction(item.link)?.href;
  return {
    title,
    body: label && label !== title ? joinCopy([label, body], body ? ' — ' : '') : body,
    ...(href ? { href } : {}),
  };
}

function mapLabelledItems(
  items: StrapiLabelledItem[] | null | undefined,
): GlossaryLabelledItem[] {
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

function blockId(block: StrapiGlossaryBlock, index: number): string {
  return `${value(block.__typename) || 'glossary-block'}-${value(block.id) || index}`;
}

function mapContentColumn(
  column: StrapiContentColumn | null | undefined,
  context: string,
): GlossaryContentColumn | undefined {
  if (!column) return undefined;

  const heading = value(column.heading);
  if (!heading) return undefined;

  return {
    id: value(column.id) || context,
    ...(value(column.eyebrow) ? { eyebrow: value(column.eyebrow) } : {}),
    heading,
    bodyHtml: richTextToHtml(column.body, `${context} body`),
    items: mapLabelledItems(column.labelledItems),
    links: mapActions(column.links),
  };
}

function mapBlock(
  block: StrapiGlossaryBlock,
  index: number,
  graphqlUrl: string,
): GlossaryBlock | undefined {
  const id = blockId(block, index);

  switch (block.__typename) {
    case 'ComponentGlossaryRichText': {
      const html = richTextToHtml(block.richTextBody, `${id} body`);
      return html ? { id, type: 'rich-text', html } : undefined;
    }

    case 'ComponentGlossaryCardGrid': {
      const cards = (block.gridCards ?? []).flatMap((card) => {
        const title = value(card.title) || value(card.eyebrow);
        if (!title) return [];

        const eyebrow = value(card.eyebrow);
        const action = mapAction(card.link);
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
            ...(action ? { href: action.href } : {}),
          },
        ];
      });

      return cards.length
        ? { id, type: 'card-grid', columns: mapGridColumns(block.gridColumns), cards }
        : undefined;
    }

    case 'ComponentGlossaryComparisonCards': {
      const cards = (block.comparisonItems ?? []).flatMap((card) => {
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

    case 'ComponentGlossaryTable': {
      const table = mapTable(block);
      return table ? { id, type: 'table', table } : undefined;
    }

    case 'ComponentGlossaryQuote': {
      const quote = value(block.quote);
      const name = value(block.attribution);
      const role = value(block.role);
      if (!quote) return undefined;

      if (!name || !role) {
        const attribution = joinCopy([name, role], name && role ? ', ' : '');
        return {
          id,
          type: 'rich-text',
          html: `<blockquote><p>${escapeHtml(quote)}</p></blockquote>${
            attribution ? `<p>${escapeHtml(attribution)}</p>` : ''
          }`,
        };
      }

      const source = mapAction(block.sourceLink);
      return {
        id,
        type: 'quote',
        quote: {
          quoteHtml: `<p>${escapeHtml(quote)}</p>`,
          name,
          role,
          company: source?.label || 'Tcules',
        },
        ...(source ? { source } : {}),
      };
    }

    case 'ComponentGlossaryCallout': {
      const label = value(block.label);
      const heading = value(block.calloutHeading);
      const lead = joinCopy([label, heading], label && heading ? ': ' : '');
      const body = richTextToHtml(block.calloutBody, `${id} body`);
      const html = `${lead ? `<p><strong>${escapeHtml(lead)}</strong></p>` : ''}${body}`;
      const tone = value(block.tone);
      return html
        ? { id, type: 'callout', html, ...(tone ? { tone: tone.toLowerCase() } : {}) }
        : undefined;
    }

    case 'ComponentGlossaryLabelledList': {
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

    case 'ComponentGlossaryTwoColumnContent': {
      const left = mapContentColumn(block.left, `${id} left column`);
      const right = mapContentColumn(block.right, `${id} right column`);
      return left || right
        ? { id, type: 'two-column', ...(left ? { left } : {}), ...(right ? { right } : {}) }
        : undefined;
    }

    case 'ComponentGlossaryLinkGroup': {
      const heading = value(block.linkGroupHeading);
      const links = (block.groupLinks ?? []).flatMap((link) => {
        const action = mapAction(link);
        if (!action) return [];
        return [{ title: action.label, body: value(link.description), href: action.href }];
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
      const href = absoluteAssetUrl(file.url, graphqlUrl);
      const mime = value(file.mime);
      const image = mapUploadImage(file, graphqlUrl, {
        fallbackAlt: caption,
        requireImageMime: true,
      });

      return caption
        ? {
            id,
            type: 'media',
            ...(image ? { image } : {}),
            caption,
            ...(!image && href ? { href } : {}),
            ...(mime ? { mime } : {}),
          }
        : undefined;
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
  const base = candidate || 'glossary-section';
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
  blocks: StrapiGlossaryBlock[] | null | undefined,
  graphqlUrl: string,
): GlossarySection[] {
  const sections: GlossarySection[] = [];
  const usedAnchors = new Set<string>();
  let current: GlossarySection | undefined;

  (blocks ?? []).forEach((block, index) => {
    if (block.__typename === 'ComponentGlossarySectionHeading') {
      const text = value(block.sectionHeading);
      const id = blockId(block, index);
      const anchorId = uniqueAnchor(
        anchorSlug(value(block.anchorId)) || anchorSlug(text) || anchorSlug(id),
        usedAnchors,
      );

      current = {
        id,
        ...(text
          ? {
              heading: {
                text,
                anchorId,
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
      current = { id: 'glossary-content-introduction', blocks: [] };
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

function structuredDataFromGlossary(
  seo: NonNullable<StrapiGlossary['seo']>,
): GlossarySeo['structuredData'] {
  for (const candidate of [seo.codeJson, seo.graphCode, seo.structuredData]) {
    const structuredData = normaliseJsonLd(candidate);
    if (structuredData) return structuredData;
  }
  return undefined;
}

function canonicalUrl(candidate: string | null | undefined): string | undefined {
  const href = safeContentHref(candidate);
  if (!href) return undefined;
  return href.startsWith('/') || href.startsWith('http://') || href.startsWith('https://')
    ? href
    : undefined;
}

function mapSeo(rawSeo: StrapiGlossary['seo']): GlossarySeo | undefined {
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
  const structuredData = structuredDataFromGlossary(rawSeo);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function mapGlossary(raw: StrapiGlossary, graphqlUrl: string): GlossaryPage | null {
  const slug = value(raw.slug);
  if (!slug) return null;

  const actions = mapActions(raw.capabilitiesCta?.heroSectionButton).slice(0, 2);
  const ctaHeading = value(raw.capabilitiesCta?.heading).replaceAll('|', '');
  const firstAction = actions[0];
  const secondAction = actions[1];
  const firstDescription = value(raw.capabilitiesCta?.description);
  const secondDescription = value(raw.capabilitiesCta?.descriptionTwo);
  const cta =
    ctaHeading && firstAction
      ? {
          heading: ctaHeading,
          body: secondDescription
            ? ([firstDescription, secondDescription] as const)
            : ([firstDescription] as const),
          points: (raw.capabilitiesCta?.label ?? []).flatMap((item) => {
            const label = value(item.listText);
            return label ? [{ label }] : [];
          }),
          actions: secondAction
            ? ([firstAction, secondAction] as const)
            : ([firstAction] as const),
        }
      : undefined;

  const faqItems = (raw.faqSection?.faqs ?? []).flatMap((faq) => {
    const question = value(faq.question);
    const answerHtml = richTextToHtml(faq.answer, `FAQ ${question || value(faq.documentId)}`);
    return faq.isActive !== false && question && answerHtml ? [{ question, answerHtml }] : [];
  });
  const faqHeading = value(raw.faqSection?.heading);
  const faq =
    faqItems.length > 0 && faqHeading
      ? {
          ...(value(raw.faqSection?.eyebrow)
            ? { eyebrow: value(raw.faqSection?.eyebrow) }
            : {}),
          heading: faqHeading,
          ...(value(raw.faqSection?.description)
            ? { description: value(raw.faqSection?.description) }
            : {}),
          items: faqItems,
        }
      : undefined;

  const seo = mapSeo(raw.seo);

  return {
    documentId: value(raw.documentId) || slug,
    slug,
    title: value(raw.title),
    ...(value(raw.createdAt) ? { createdAt: value(raw.createdAt) } : {}),
    ...(value(raw.updatedAt) ? { updatedAt: value(raw.updatedAt) } : {}),
    ...(value(raw.publishedAt) ? { publishedAt: value(raw.publishedAt) } : {}),
    hero: {
      ...(value(raw.hero?.eyebrow) ? { eyebrow: value(raw.hero?.eyebrow) } : {}),
      ...(value(raw.hero?.highlightedText)
        ? { highlightedText: value(raw.hero?.highlightedText) }
        : {}),
      description: value(raw.hero?.description),
      tags: (raw.hero?.tags ?? []).flatMap((tag) => {
        const text = value(tag.listText);
        return text ? [text] : [];
      }),
      actions: mapActions(raw.hero?.actions),
    },
    sections: mapSections(raw.content, graphqlUrl),
    ...(faq ? { faq } : {}),
    ...(cta ? { cta } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchGlossaryBySlug(slug: string): Promise<StrapiGlossary | null> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: GLOSSARY_BY_SLUG_QUERY,
      variables: { slug, status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: GLOSSARY_REVALIDATE_SECONDS,
      tags: ['glossary', `glossary:${slug.slice(0, 235)}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi glossary request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiGlossaryResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi glossary query failed: ${errors.join('; ')}`);
  }

  return payload.data?.glossaryPage?.[0] ?? null;
}

/** Map Strapi's glossary schema to route-facing content before presentation code sees it. */
export const glossarySource: GlossaryContentSource = {
  async getGlossaryPage(slug) {
    const requestedSlug = value(slug);
    if (!requestedSlug) return null;

    const graphqlUrl = getStrapiGraphqlUrl();
    const glossary = await fetchGlossaryBySlug(requestedSlug);
    return glossary ? mapGlossary(glossary, graphqlUrl) : null;
  },
};
