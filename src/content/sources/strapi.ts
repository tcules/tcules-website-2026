import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './strapi/public-graphql';
import type {
  AuditAction,
  AuditBlock,
  AuditContentColumn,
  AuditContentSource,
  AuditLabelledItem,
  AuditPage,
  AuditSection,
  AuditSeo,
  HowWeWorkContentSource,
  HowWeWorkPage,
} from '../types';
import { AUDIT_BY_SLUG_QUERY } from './strapi/audit-query';
import { HOW_WE_WORK_QUERY } from './strapi/how-we-work-query';
import { mapUploadImage } from './strapi/image';
import {
  escapeHtml,
  richTextToHtml,
  richTextToPlainText,
  safeContentHref,
} from './strapi/rich-text';
import { mapTable } from './strapi/table';
import type {
  StrapiAudit,
  StrapiAuditBlock,
  StrapiAuditResponse,
  StrapiContentColumn,
  StrapiHowWeWork,
  StrapiHowWeWorkResponse,
  StrapiLabelledItem,
  StrapiLink,
} from './strapi/types';

const AUDIT_REVALIDATE_SECONDS = false;
const HOW_WE_WORK_REVALIDATE_SECONDS = false;
const HOW_WE_WORK_SLUG = 'how-we-work';

function value(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function joinCopy(parts: Array<string | undefined>, separator = ' '): string {
  return parts
    .map((part) => value(part))
    .filter(Boolean)
    .join(separator);
}


function mapAction(link: StrapiLink | null | undefined): AuditAction | undefined {
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

function mapActions(links: StrapiLink[] | null | undefined): AuditAction[] {
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

function mapLabelledItem(item: StrapiLabelledItem): AuditLabelledItem | undefined {
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

function mapLabelledItems(items: StrapiLabelledItem[] | null | undefined): AuditLabelledItem[] {
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

function blockId(block: StrapiAuditBlock, index: number): string {
  return `${value(block.__typename) || 'audit-block'}-${value(block.id) || index}`;
}

function mapContentColumn(
  column: StrapiContentColumn | null | undefined,
  context: string,
): AuditContentColumn | undefined {
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
  block: StrapiAuditBlock,
  index: number,
  graphqlUrl: string,
): AuditBlock | undefined {
  const id = blockId(block, index);

  switch (block.__typename) {
    case 'ComponentAuditRichText': {
      const html = richTextToHtml(block.body, `${id} body`);
      return html ? { id, type: 'rich-text', html } : undefined;
    }

    case 'ComponentAuditCardGrid': {
      const cards = (block.cardGridCards ?? []).flatMap((card) => {
        const title = value(card.title) || value(card.eyebrow);
        if (!title) return [];

        const action = mapAction(card.link);
        return [
          {
            title,
            body: joinCopy(
              [
                value(card.eyebrow) !== title ? value(card.eyebrow) : undefined,
                richTextToPlainText(card.body),
                ...(card.labelledItems ?? []).map(labelledItemSummary),
              ],
              ' — ',
            ),
            ...(action ? { href: action.href } : {}),
          },
        ];
      });

      return cards.length
        ? { id, type: 'card-grid', columns: mapGridColumns(block.cardGridColumns), cards }
        : undefined;
    }

    case 'ComponentAuditComparisonCards': {
      const cards = (block.comparisonCards ?? []).flatMap((card) => {
        const title = value(card.title);
        if (!title) return [];

        return [
          {
            title,
            body: joinCopy(
              [
                card.isRecommended === true ? 'Recommended' : undefined,
                value(card.badge),
                richTextToPlainText(card.summary),
                ...(card.details ?? []).map(labelledItemSummary),
              ],
              ' — ',
            ),
          },
        ];
      });

      return cards.length ? { id, type: 'comparison-cards', cards } : undefined;
    }

    case 'ComponentAuditTable': {
      const table = mapTable(block);
      return table ? { id, type: 'table', table } : undefined;
    }

    case 'ComponentAuditQuote': {
      const quote = value(block.quote);
      const name = value(block.attribution);
      const role = value(block.role);
      if (!quote || !name || !role) return undefined;

      const source = mapAction(block.sourceLink);
      return {
        id,
        type: 'quote',
        quote: {
          quoteHtml: `<p>${escapeHtml(quote)}</p>`,
          name,
          role,
          company: 'Tcules',
        },
        ...(source ? { source } : {}),
      };
    }

    case 'ComponentAuditCallout': {
      const label = value(block.label);
      const heading = value(block.calloutHeading);
      const lead = joinCopy([label, heading], label && heading ? ': ' : '');
      const body = richTextToHtml(block.body, `${id} body`);
      const html = `${lead ? `<p><strong>${escapeHtml(lead)}</strong></p>` : ''}${body}`;
      return html ? { id, type: 'callout', html } : undefined;
    }

    case 'ComponentAuditLabelledList': {
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

    case 'ComponentAuditTwoColumnContent': {
      const left = mapContentColumn(block.left, `${id} left column`);
      const right = mapContentColumn(block.right, `${id} right column`);
      return left || right
        ? { id, type: 'two-column', ...(left ? { left } : {}), ...(right ? { right } : {}) }
        : undefined;
    }

    case 'ComponentAuditLinkGroup': {
      const heading = value(block.linkGroupHeading);
      const links = (block.links ?? []).flatMap((link) => {
        const action = mapAction(link);
        if (!action) return [];
        return [
          {
            title: action.label,
            body: value(link.description),
            href: action.href,
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
      const image = mapUploadImage(file, graphqlUrl, {
        fallbackAlt: caption,
        requireImageMime: true,
      });

      return caption ? { id, type: 'media', ...(image ? { image } : {}), caption } : undefined;
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
  const base = candidate || 'audit-section';
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
  blocks: StrapiAuditBlock[] | null | undefined,
  graphqlUrl: string,
): AuditSection[] {
  const sections: AuditSection[] = [];
  const usedAnchors = new Set<string>();
  let current: AuditSection | undefined;

  (blocks ?? []).forEach((block, index) => {
    if (block.__typename === 'ComponentAuditSectionHeading') {
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
      current = { id: 'audit-content-introduction', blocks: [] };
      sections.push(current);
    }
    current.blocks.push(mapped);
  });

  return sections.filter((section) => section.heading || section.blocks.length > 0);
}

function parseJson(valueToParse: unknown): unknown {
  if (typeof valueToParse === 'string') {
    const source = valueToParse.trim();
    if (!source) return undefined;
    try {
      return JSON.parse(source) as unknown;
    } catch {
      return undefined;
    }
  }

  if (Array.isArray(valueToParse)) {
    const isRichText = valueToParse.some(
      (item) => isRecord(item) && typeof item.type === 'string',
    );
    const source = richTextToPlainText(valueToParse);
    if (source) {
      try {
        return JSON.parse(source) as unknown;
      } catch {
        return isRichText ? undefined : valueToParse;
      }
    }
    return isRichText ? undefined : valueToParse;
  }

  return valueToParse;
}

function isRecord(valueToCheck: unknown): valueToCheck is Record<string, unknown> {
  return (
    typeof valueToCheck === 'object' && valueToCheck !== null && !Array.isArray(valueToCheck)
  );
}

function normaliseJsonLd(
  valueToNormalise: unknown,
): Record<string, unknown> | unknown[] | undefined {
  const parsed = parseJson(valueToNormalise);
  if (Array.isArray(parsed)) return parsed;
  if (!isRecord(parsed)) return undefined;

  const preview = parsed.full_json_ld_preview;
  if (isRecord(preview) || Array.isArray(preview)) return preview;
  return parsed;
}

function structuredDataFromAudit(
  seo: NonNullable<StrapiAudit['seo']>,
): AuditSeo['structuredData'] {
  for (const candidate of [seo.codeJson, seo.graphCode, seo.structuredData]) {
    const structuredData = normaliseJsonLd(candidate);
    if (structuredData) return structuredData;
  }
  return undefined;
}

function canonicalUrl(rawUrl: string | null | undefined): string | undefined {
  const candidate = value(rawUrl);
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapSeo(rawSeo: StrapiAudit['seo']): AuditSeo | undefined {
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
  const structuredData = structuredDataFromAudit(rawSeo);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function mapAudit(rawAudit: StrapiAudit, graphqlUrl: string): AuditPage | null {
  const slug = value(rawAudit.slug);
  if (!slug) return null;

  const actions = mapActions(rawAudit.capabilitiesCta?.heroSectionButton).slice(0, 2);
  const ctaHeading = value(rawAudit.capabilitiesCta?.heading).replaceAll('|', '');
  const firstAction = actions[0];
  const secondAction = actions[1];
  const firstDescription = value(rawAudit.capabilitiesCta?.description);
  const secondDescription = value(rawAudit.capabilitiesCta?.descriptionTwo);
  const cta =
    ctaHeading && firstAction
      ? {
          heading: ctaHeading,
          body: secondDescription
            ? ([firstDescription, secondDescription] as const)
            : ([firstDescription] as const),
          points: (rawAudit.capabilitiesCta?.label ?? []).flatMap((item) => {
            const label = value(item.listText);
            return label ? [{ label }] : [];
          }),
          actions: secondAction
            ? ([firstAction, secondAction] as const)
            : ([firstAction] as const),
        }
      : undefined;

  const faqItems = (rawAudit.faqSection?.faqs ?? []).flatMap((faq) => {
    const question = value(faq.question);
    const answerHtml = richTextToHtml(faq.answer, `FAQ ${question || value(faq.documentId)}`);
    return faq.isActive !== false && question && answerHtml ? [{ question, answerHtml }] : [];
  });
  const faqHeading = value(rawAudit.faqSection?.heading);
  const faq =
    faqItems.length > 0 && faqHeading
      ? {
          ...(value(rawAudit.faqSection?.eyebrow)
            ? { eyebrow: value(rawAudit.faqSection?.eyebrow) }
            : {}),
          heading: faqHeading,
          ...(value(rawAudit.faqSection?.description)
            ? { description: value(rawAudit.faqSection?.description) }
            : {}),
          items: faqItems,
        }
      : undefined;

  const seo = mapSeo(rawAudit.seo);

  return {
    documentId: value(rawAudit.documentId) || slug,
    slug,
    title: value(rawAudit.title),
    hero: {
      ...(value(rawAudit.hero?.eyebrow) ? { eyebrow: value(rawAudit.hero?.eyebrow) } : {}),
      ...(value(rawAudit.hero?.highlightedText)
        ? { highlightedText: value(rawAudit.hero?.highlightedText) }
        : {}),
      description: value(rawAudit.hero?.description),
      tags: (rawAudit.hero?.tags ?? []).flatMap((tag) => {
        const text = value(tag.listText);
        return text ? [text] : [];
      }),
      actions: mapActions(rawAudit.hero?.actions),
    },
    sections: mapSections(rawAudit.content, graphqlUrl),
    ...(faq ? { faq } : {}),
    ...(cta ? { cta } : {}),
    ...(seo ? { seo } : {}),
  };
}

function mapHowWeWork(
  rawPage: StrapiHowWeWork,
  requestedSlug: string,
  graphqlUrl: string,
): HowWeWorkPage | null {
  if (!value(rawPage.title)) return null;

  const auditShape: StrapiAudit = {
    ...rawPage,
    // newHowWeWork is a singleton in the supplied schema. Its internal CMS slug currently names
    // the singleton version; the public route is intentionally fixed by the content seam.
    slug: requestedSlug,
    content: (rawPage.content ?? []).map((block) => ({
      ...block,
      body:
        block.__typename === 'ComponentAuditRichText'
          ? block.richTextBody
          : block.__typename === 'ComponentAuditCallout'
            ? block.calloutBody
            : block.body,
      cardGridColumns: block.gridColumns,
      cardGridCards: block.gridCards,
      comparisonCards: block.comparisonItems,
      links: block.__typename === 'ComponentAuditLinkGroup' ? block.groupLinks : block.links,
    })),
  };
  const mapped = mapAudit(auditShape, graphqlUrl);
  if (!mapped) return null;

  return {
    ...mapped,
    ...(value(rawPage.createdAt) ? { createdAt: value(rawPage.createdAt) } : {}),
    ...(value(rawPage.updatedAt) ? { updatedAt: value(rawPage.updatedAt) } : {}),
    ...(value(rawPage.publishedAt) ? { publishedAt: value(rawPage.publishedAt) } : {}),
  };
}

async function fetchAuditBySlug(slug: string): Promise<StrapiAudit | null> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: AUDIT_BY_SLUG_QUERY,
      variables: { slug, status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: AUDIT_REVALIDATE_SECONDS,
      tags: ['audits', `audit:${slug.slice(0, 240)}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi audit request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiAuditResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi audit query failed: ${errors.join('; ')}`);
  }

  return payload.data?.auditPage?.[0] ?? null;
}

async function fetchHowWeWork(): Promise<{
  graphqlUrl: string;
  page: StrapiHowWeWork | null;
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: HOW_WE_WORK_QUERY,
      variables: { status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: HOW_WE_WORK_REVALIDATE_SECONDS,
      tags: ['how-we-work'],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi how-we-work request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiHowWeWorkResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi how-we-work query failed: ${errors.join('; ')}`);
  }

  return { graphqlUrl, page: payload.data?.newHowWeWork ?? null };
}

/**
 * The audit source is the only layer that knows Strapi's response shape. It converts every CMS
 * record into page-facing view models, sanitises rich text, and rejects media embedded in rich
 * text before presentation code can see it.
 */
export const strapiSource: AuditContentSource = {
  async getAuditPage(slug) {
    const requestedSlug = value(slug);
    if (!requestedSlug) return null;

    const graphqlUrl = getStrapiGraphqlUrl();
    const audit = await fetchAuditBySlug(requestedSlug);
    return audit ? mapAudit(audit, graphqlUrl) : null;
  },
};

export const howWeWorkSource: HowWeWorkContentSource = {
  async getHowWeWorkPage(slug) {
    const requestedSlug = value(slug);
    if (requestedSlug !== HOW_WE_WORK_SLUG) return null;

    const { graphqlUrl, page } = await fetchHowWeWork();
    return page ? mapHowWeWork(page, requestedSlug, graphqlUrl) : null;
  },
};
