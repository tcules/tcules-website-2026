import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  ExpertiseAction,
  ExpertiseBlock,
  ExpertiseContentColumn,
  ExpertiseContentSource,
  ExpertiseLabelledItem,
  ExpertisePage,
  ExpertiseSection,
  ExpertiseSeo,
} from '../../types';
import { absoluteAssetUrl, mapUploadImage } from './image';
import { EXPERTISE_BY_SLUG_QUERY } from './expertise-query';
import type {
  StrapiExpertise,
  StrapiExpertiseBlock,
  StrapiExpertiseContentColumn,
  StrapiExpertiseLabelledItem,
  StrapiExpertiseLink,
  StrapiExpertiseResponse,
} from './expertise-types';
import { markdownToHtml } from './markdown';
import { escapeHtml, richTextToHtml, richTextToPlainText, safeContentHref } from './rich-text';
import { mapTable } from './table';

const EXPERTISE_REVALIDATE_SECONDS = false;

function value(rawValue: string | null | undefined): string {
  return typeof rawValue === 'string' ? rawValue.trim() : '';
}

function joinCopy(parts: Array<string | undefined>, separator = ' '): string {
  return parts
    .map((part) => value(part))
    .filter(Boolean)
    .join(separator);
}


function mapAction(link: StrapiExpertiseLink | null | undefined): ExpertiseAction | undefined {
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

function mapActions(links: StrapiExpertiseLink[] | null | undefined): ExpertiseAction[] {
  return (links ?? []).flatMap((link) => {
    const action = mapAction(link);
    return action ? [action] : [];
  });
}

function labelledItemSummary(item: StrapiExpertiseLabelledItem): string {
  const label = value(item.label);
  const title = value(item.title);
  const body = richTextToPlainText(item.body);
  const lead = joinCopy([label, title], label && title ? ': ' : '');
  return joinCopy([lead, body], lead && body ? ' — ' : '');
}

function mapLabelledItem(item: StrapiExpertiseLabelledItem): ExpertiseLabelledItem | undefined {
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
  items: StrapiExpertiseLabelledItem[] | null | undefined,
): ExpertiseLabelledItem[] {
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

function blockId(block: StrapiExpertiseBlock, index: number): string {
  return `${value(block.__typename) || 'expertise-block'}-${value(block.id) || index}`;
}

function mapContentColumn(
  column: StrapiExpertiseContentColumn | null | undefined,
  context: string,
): ExpertiseContentColumn | undefined {
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
  block: StrapiExpertiseBlock,
  index: number,
  graphqlUrl: string,
): ExpertiseBlock | undefined {
  const id = blockId(block, index);

  switch (block.__typename) {
    case 'ComponentExpertiseRichText': {
      const html = richTextToHtml(block.richTextBody, `${id} body`);
      return html ? { id, type: 'rich-text', html } : undefined;
    }

    case 'ComponentExpertiseCardGrid': {
      const cards = (block.gridCards ?? []).flatMap((card) => {
        const title = value(card.title) || value(card.eyebrow);
        if (!title) return [];

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
            ...(value(card.eyebrow) && value(card.eyebrow) !== title
              ? { eyebrow: value(card.eyebrow) }
              : {}),
            ...(action ? { href: action.href, ctaLabel: action.label } : {}),
          },
        ];
      });

      return cards.length
        ? { id, type: 'card-grid', columns: mapGridColumns(block.gridColumns), cards }
        : undefined;
    }

    case 'ComponentExpertiseComparisonCards': {
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

    case 'ComponentExpertiseTable': {
      const table = mapTable(block);
      return table ? { id, type: 'table', table } : undefined;
    }

    case 'ComponentExpertiseQuote': {
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

    case 'ComponentExpertiseCallout': {
      const label = value(block.label);
      const heading = value(block.calloutHeading);
      const lead = joinCopy([label, heading], label && heading ? ': ' : '');
      const body = richTextToHtml(block.calloutBody, `${id} body`);
      const html = `${lead ? `<p><strong>${escapeHtml(lead)}</strong></p>` : ''}${body}`;
      return html ? { id, type: 'callout', html } : undefined;
    }

    case 'ComponentExpertiseLabelledList': {
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

    case 'ComponentExpertiseTwoColumnContent': {
      const left = mapContentColumn(block.left, `${id} left column`);
      const right = mapContentColumn(block.right, `${id} right column`);
      return left || right
        ? { id, type: 'two-column', ...(left ? { left } : {}), ...(right ? { right } : {}) }
        : undefined;
    }

    case 'ComponentExpertiseLinkGroup': {
      const heading = value(block.linkGroupHeading);
      const links = (block.groupLinks ?? []).flatMap((link) => {
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
      return links.length
        ? {
            id,
            type: 'link-group',
            ...(heading ? { heading } : {}),
            ...(value(block.description) ? { description: value(block.description) } : {}),
            links,
          }
        : undefined;
    }

    case 'ComponentSharedMedia': {
      const file = block.file;
      if (!file) return undefined;

      const caption = value(file.caption) || value(file.alternativeText) || value(file.name);
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
              external: true,
            }
          : undefined;

      return caption
        ? {
            id,
            type: 'media',
            ...(image ? { image } : {}),
            caption,
            ...(download ? { download } : {}),
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
  const base = candidate || 'expertise-section';
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
  blocks: StrapiExpertiseBlock[] | null | undefined,
  graphqlUrl: string,
): ExpertiseSection[] {
  const sections: ExpertiseSection[] = [];
  const usedAnchors = new Set<string>();
  let current: ExpertiseSection | undefined;

  (blocks ?? []).forEach((block, index) => {
    if (block.__typename === 'ComponentExpertiseSectionHeading') {
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
      current = { id: 'expertise-content-introduction', blocks: [] };
      sections.push(current);
    }
    current.blocks.push(mapped);
  });

  return sections.filter((section) => section.heading || section.blocks.length > 0);
}

function isRecord(valueToCheck: unknown): valueToCheck is Record<string, unknown> {
  return (
    typeof valueToCheck === 'object' && valueToCheck !== null && !Array.isArray(valueToCheck)
  );
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

function structuredDataFromExpertise(
  seo: NonNullable<StrapiExpertise['seo']>,
): ExpertiseSeo['structuredData'] {
  for (const candidate of [seo.codeJson, seo.graphCode, seo.structuredData]) {
    const structuredData = normaliseJsonLd(candidate);
    if (structuredData) return structuredData;
  }
  return undefined;
}

function canonicalUrl(rawUrl: string | null | undefined): string | undefined {
  const candidate = value(rawUrl);
  if (!candidate) return undefined;
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return candidate;

  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapSeo(rawSeo: StrapiExpertise['seo']): ExpertiseSeo | undefined {
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
  const structuredData = structuredDataFromExpertise(rawSeo);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function optionalDate(rawDate: string | null | undefined): string | undefined {
  const date = value(rawDate);
  return date || undefined;
}

function mapExpertise(rawExpertise: StrapiExpertise, graphqlUrl: string): ExpertisePage | null {
  const slug = value(rawExpertise.slug);
  if (!slug) return null;

  const actions = mapActions(rawExpertise.capabilitiesCta?.heroSectionButton).slice(0, 2);
  const capabilitiesHeading = value(rawExpertise.capabilitiesCta?.heading).replaceAll('|', '');
  const firstAction = actions[0];
  const secondAction = actions[1];
  const firstDescription = value(rawExpertise.capabilitiesCta?.description);
  const secondDescription = value(rawExpertise.capabilitiesCta?.descriptionTwo);
  const capabilitiesCta =
    capabilitiesHeading && firstAction
      ? {
          heading: capabilitiesHeading,
          body: secondDescription
            ? ([firstDescription, secondDescription] as const)
            : ([firstDescription] as const),
          points: (rawExpertise.capabilitiesCta?.label ?? []).flatMap((item) => {
            const label = value(item.listText);
            return label ? [{ label }] : [];
          }),
          actions: secondAction
            ? ([firstAction, secondAction] as const)
            : ([firstAction] as const),
        }
      : undefined;

  const faqItems = (rawExpertise.faqSection?.faqs ?? []).flatMap((faq) => {
    const question = value(faq.question);
    const answerHtml = richTextToHtml(faq.answer, `FAQ ${question || value(faq.documentId)}`);
    return faq.isActive !== false && question && answerHtml ? [{ question, answerHtml }] : [];
  });
  const faqHeading = value(rawExpertise.faqSection?.heading);
  const faq =
    faqItems.length > 0 && faqHeading
      ? {
          ...(value(rawExpertise.faqSection?.eyebrow)
            ? { eyebrow: value(rawExpertise.faqSection?.eyebrow) }
            : {}),
          heading: faqHeading,
          ...(value(rawExpertise.faqSection?.description)
            ? { description: value(rawExpertise.faqSection?.description) }
            : {}),
          items: faqItems,
        }
      : undefined;

  const sharedCtaHeading = value(rawExpertise.cta?.heading);
  const descriptionHtml = markdownToHtml(
    rawExpertise.cta?.description,
    `expertise ${slug} CTA description`,
  );
  const disclaimerHtml = markdownToHtml(
    rawExpertise.cta?.disclaimer,
    `expertise ${slug} CTA disclaimer`,
  );
  const cta = sharedCtaHeading
    ? { heading: sharedCtaHeading, descriptionHtml, disclaimerHtml }
    : undefined;
  const seo = mapSeo(rawExpertise.seo);

  return {
    documentId: value(rawExpertise.documentId) || slug,
    slug,
    title: value(rawExpertise.title),
    ...(optionalDate(rawExpertise.createdAt)
      ? { createdAt: optionalDate(rawExpertise.createdAt) }
      : {}),
    ...(optionalDate(rawExpertise.updatedAt)
      ? { updatedAt: optionalDate(rawExpertise.updatedAt) }
      : {}),
    ...(optionalDate(rawExpertise.publishedAt)
      ? { publishedAt: optionalDate(rawExpertise.publishedAt) }
      : {}),
    hero: {
      ...(value(rawExpertise.hero?.eyebrow)
        ? { eyebrow: value(rawExpertise.hero?.eyebrow) }
        : {}),
      ...(value(rawExpertise.hero?.highlightedText)
        ? { highlightedText: value(rawExpertise.hero?.highlightedText) }
        : {}),
      description: value(rawExpertise.hero?.description),
      tags: (rawExpertise.hero?.tags ?? []).flatMap((tag) => {
        const text = value(tag.listText);
        return text ? [text] : [];
      }),
      actions: mapActions(rawExpertise.hero?.actions),
    },
    sections: mapSections(rawExpertise.content, graphqlUrl),
    ...(faq ? { faq } : {}),
    ...(capabilitiesCta ? { capabilitiesCta } : {}),
    ...(cta ? { cta } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchExpertiseBySlug(slug: string): Promise<StrapiExpertise | null> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: EXPERTISE_BY_SLUG_QUERY,
      variables: { slug, status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: EXPERTISE_REVALIDATE_SECONDS,
      tags: ['expertise', `expertise:${slug.slice(0, 235)}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi expertise request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiExpertiseResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi expertise query failed: ${errors.join('; ')}`);
  }

  return payload.data?.expertisePage?.[0] ?? null;
}

/** Convert Strapi's expertise schema into the stable view model consumed by the dynamic route. */
export const expertiseSource: ExpertiseContentSource = {
  async getExpertisePage(slug) {
    const requestedSlug = value(slug);
    if (!requestedSlug) return null;

    const graphqlUrl = getStrapiGraphqlUrl();
    const expertise = await fetchExpertiseBySlug(requestedSlug);
    return expertise ? mapExpertise(expertise, graphqlUrl) : null;
  },
};
