import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  ServiceAction,
  ServiceBlock,
  ServiceContentColumn,
  ServiceContentSource,
  ServiceLabelledItem,
  ServicePage,
  ServiceSection,
  ServiceSeo,
} from '../../types';
import { absoluteAssetUrl, mapUploadImage } from './image';
import { markdownToHtml } from './markdown';
import { escapeHtml, richTextToHtml, richTextToPlainText, safeContentHref } from './rich-text';
import { mapTable } from './table';
import { SERVICE_BY_SLUG_QUERY } from './service-query';
import type {
  StrapiService,
  StrapiServiceBlock,
  StrapiServiceContentColumn,
  StrapiServiceLabelledItem,
  StrapiServiceLink,
  StrapiServiceResponse,
} from './service-types';

const SERVICE_REVALIDATE_SECONDS = false;

function value(rawValue: string | null | undefined): string {
  return typeof rawValue === 'string' ? rawValue.trim() : '';
}

function joinCopy(parts: Array<string | undefined>, separator = ' '): string {
  return parts
    .map((part) => value(part))
    .filter(Boolean)
    .join(separator);
}


function mapAction(link: StrapiServiceLink | null | undefined): ServiceAction | undefined {
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

function mapActions(links: StrapiServiceLink[] | null | undefined): ServiceAction[] {
  return (links ?? []).flatMap((link) => {
    const action = mapAction(link);
    return action ? [action] : [];
  });
}

function labelledItemSummary(item: StrapiServiceLabelledItem): string {
  const label = value(item.label);
  const title = value(item.title);
  const body = richTextToPlainText(item.body);
  const lead = joinCopy([label, title], label && title ? ': ' : '');
  return joinCopy([lead, body], lead && body ? ' — ' : '');
}

function mapLabelledItem(item: StrapiServiceLabelledItem): ServiceLabelledItem | undefined {
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
  items: StrapiServiceLabelledItem[] | null | undefined,
): ServiceLabelledItem[] {
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

function blockId(block: StrapiServiceBlock, index: number): string {
  return `${value(block.__typename) || 'service-block'}-${value(block.id) || index}`;
}

function mapContentColumn(
  column: StrapiServiceContentColumn | null | undefined,
  context: string,
): ServiceContentColumn | undefined {
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
  block: StrapiServiceBlock,
  index: number,
  graphqlUrl: string,
): ServiceBlock | undefined {
  const id = blockId(block, index);

  switch (block.__typename) {
    case 'ComponentServiceRichText': {
      const html = richTextToHtml(block.richTextBody, `${id} body`);
      return html ? { id, type: 'rich-text', html } : undefined;
    }

    case 'ComponentServiceCardGrid': {
      const cards = (block.gridCards ?? []).flatMap((card) => {
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
        ? { id, type: 'card-grid', columns: mapGridColumns(block.gridColumns), cards }
        : undefined;
    }

    case 'ComponentServiceComparisonCards': {
      const cards = (block.comparisonItems ?? []).flatMap((card) => {
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

    case 'ComponentServiceTable': {
      const table = mapTable(block);
      return table ? { id, type: 'table', table } : undefined;
    }

    case 'ComponentServiceQuote': {
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

    case 'ComponentServiceCallout': {
      const label = value(block.label);
      const heading = value(block.calloutHeading);
      const lead = joinCopy([label, heading], label && heading ? ': ' : '');
      const body = richTextToHtml(block.calloutBody, `${id} body`);
      const html = `${lead ? `<p><strong>${escapeHtml(lead)}</strong></p>` : ''}${body}`;
      return html ? { id, type: 'callout', html } : undefined;
    }

    case 'ComponentServiceLabelledList': {
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

    case 'ComponentServiceTwoColumnContent': {
      const left = mapContentColumn(block.left, `${id} left column`);
      const right = mapContentColumn(block.right, `${id} right column`);
      return left || right
        ? { id, type: 'two-column', ...(left ? { left } : {}), ...(right ? { right } : {}) }
        : undefined;
    }

    case 'ComponentServiceLinkGroup': {
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
  const base = candidate || 'service-section';
  let anchor = base;
  let suffix = 2;

  while (usedAnchors.has(anchor)) {
    anchor = `${base}-${suffix}`;
    suffix += 1;
  }

  usedAnchors.add(anchor);
  return anchor;
}

/**
 * Lift a section's LEAD out of the rich text it is currently hiding in.
 *
 * ComponentServiceSectionHeading has no `lead` field, so authors have been writing the section's
 * lead as an ITALIC FIRST PARAGRAPH at the top of the section's first rich-text block — "What the
 * interface may be telling you", "What Product Design owns", "What you may actually receive". On
 * product-design that is six of the seven rich-text blocks, which is not a style choice; it is
 * what a missing field looks like from the outside.
 *
 * The test is deliberately narrow, because a heuristic that fires on the wrong paragraph silently
 * rewrites the page. All four must hold:
 *
 *   • the block is the section's FIRST — a mid-section italic lead ("A useful next step") is a
 *     transition inside the argument, not the section's lead, and stays where it was authored
 *   • it is a rich-text block, and its first node is a paragraph
 *   • EVERY text child of that paragraph is italic — a paragraph with one emphasised phrase in it
 *     is a paragraph, not a lead
 *   • the resulting sentence is short enough to be a lead rather than an argument
 *
 * Returns the lead text and the paragraphs that remain. When the block was only the lead, nothing
 * remains and the caller drops the block entirely rather than leaving an empty Prose in the band.
 *
 * This is a BRIDGE. When the CMS grows the field, this function is deleted and the lead is read.
 */
const LEAD_MAX_LENGTH = 200;

function liftLead(body: unknown): { lead: string; rest: unknown[] } | undefined {
  if (!Array.isArray(body) || body.length === 0) return undefined;

  const [first, ...rest] = body;
  if (!isRecord(first) || first.type !== 'paragraph') return undefined;

  const children = Array.isArray(first.children) ? first.children : [];
  const texts = children.filter(
    (child): child is Record<string, unknown> =>
      isRecord(child) && typeof child.text === 'string',
  );

  /* Every text child italic, and at least one of them — an empty paragraph is not a lead. Nodes
     that are not text at all (a link, an inline image) disqualify it: a lead is a sentence. */
  if (texts.length === 0 || texts.length !== children.length) return undefined;
  if (!texts.every((child) => child.italic === true)) return undefined;

  const lead = texts
    .map((child) => String(child.text))
    .join('')
    .trim();

  if (!lead || lead.length > LEAD_MAX_LENGTH) return undefined;

  return { lead, rest };
}

function mapSections(
  blocks: StrapiServiceBlock[] | null | undefined,
  graphqlUrl: string,
): ServiceSection[] {
  const sections: ServiceSection[] = [];
  const usedAnchors = new Set<string>();
  let current: ServiceSection | undefined;

  (blocks ?? []).forEach((block, index) => {
    if (block.__typename === 'ComponentServiceSectionHeading') {
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

    if (!current) {
      current = { id: 'service-content-introduction', blocks: [] };
      sections.push(current);
    }

    /* The lead lift, applied only to a section's FIRST block — see liftLead. When the lifted
       paragraph was the whole block, `rest` is empty and mapBlock returns undefined, so the
       block disappears rather than leaving an empty Prose under the heading. */
    if (current.blocks.length === 0 && block.__typename === 'ComponentServiceRichText') {
      const lifted = liftLead(block.richTextBody);
      if (lifted) {
        current.lead = lifted.lead;
        const remainder = mapBlock({ ...block, richTextBody: lifted.rest }, index, graphqlUrl);
        if (remainder) current.blocks.push(remainder);
        return;
      }
    }

    const mapped = mapBlock(block, index, graphqlUrl);
    if (!mapped) return;

    current.blocks.push(mapped);
  });

  return sections.filter(
    (section) => section.heading || section.lead || section.blocks.length > 0,
  );
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

function structuredDataFromService(
  seo: NonNullable<StrapiService['seo']>,
): ServiceSeo['structuredData'] {
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

function mapSeo(rawSeo: StrapiService['seo']): ServiceSeo | undefined {
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
  const structuredData = structuredDataFromService(rawSeo);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function mapService(rawService: StrapiService, graphqlUrl: string): ServicePage | null {
  const slug = value(rawService.slug);
  if (!slug) return null;

  const actions = mapActions(rawService.capabilitiesCta?.heroSectionButton).slice(0, 2);
  const capabilitiesHeading = value(rawService.capabilitiesCta?.heading).replaceAll('|', '');
  const firstAction = actions[0];
  const secondAction = actions[1];
  const firstDescription = value(rawService.capabilitiesCta?.description);
  const secondDescription = value(rawService.capabilitiesCta?.descriptionTwo);
  const capabilitiesCta =
    capabilitiesHeading && firstAction
      ? {
          heading: capabilitiesHeading,
          body: secondDescription
            ? ([firstDescription, secondDescription] as const)
            : ([firstDescription] as const),
          points: (rawService.capabilitiesCta?.label ?? []).flatMap((item) => {
            const label = value(item.listText);
            return label ? [{ label }] : [];
          }),
          actions: secondAction
            ? ([firstAction, secondAction] as const)
            : ([firstAction] as const),
        }
      : undefined;

  const faqItems = (rawService.faqSection?.faqs ?? []).flatMap((faq) => {
    const question = value(faq.question);
    const answerHtml = richTextToHtml(faq.answer, `FAQ ${question || value(faq.documentId)}`);
    return faq.isActive !== false && question && answerHtml ? [{ question, answerHtml }] : [];
  });
  const faqHeading = value(rawService.faqSection?.heading);
  const faq =
    faqItems.length > 0 && faqHeading
      ? {
          ...(value(rawService.faqSection?.eyebrow)
            ? { eyebrow: value(rawService.faqSection?.eyebrow) }
            : {}),
          heading: faqHeading,
          ...(value(rawService.faqSection?.description)
            ? { description: value(rawService.faqSection?.description) }
            : {}),
          items: faqItems,
        }
      : undefined;

  const sharedCtaHeading = value(rawService.cta?.heading);
  const descriptionHtml = markdownToHtml(
    rawService.cta?.description,
    `service ${slug} CTA description`,
  );
  const disclaimerHtml = markdownToHtml(
    rawService.cta?.disclaimer,
    `service ${slug} CTA disclaimer`,
  );
  const cta = sharedCtaHeading
    ? { heading: sharedCtaHeading, descriptionHtml, disclaimerHtml }
    : undefined;
  const seo = mapSeo(rawService.seo);

  return {
    documentId: value(rawService.documentId) || slug,
    slug,
    title: value(rawService.title),
    hero: {
      ...(value(rawService.hero?.eyebrow) ? { eyebrow: value(rawService.hero?.eyebrow) } : {}),
      ...(value(rawService.hero?.highlightedText)
        ? { highlightedText: value(rawService.hero?.highlightedText) }
        : {}),
      description: value(rawService.hero?.description),
      tags: (rawService.hero?.tags ?? []).flatMap((tag) => {
        const text = value(tag.listText);
        return text ? [text] : [];
      }),
      actions: mapActions(rawService.hero?.actions),
    },
    sections: mapSections(rawService.content, graphqlUrl),
    ...(faq ? { faq } : {}),
    ...(capabilitiesCta ? { capabilitiesCta } : {}),
    ...(cta ? { cta } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchServiceBySlug(slug: string): Promise<StrapiService | null> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: SERVICE_BY_SLUG_QUERY,
      variables: { slug, status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: SERVICE_REVALIDATE_SECONDS,
      tags: ['services', `service:${slug.slice(0, 235)}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi service request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiServiceResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi service query failed: ${errors.join('; ')}`);
  }

  return payload.data?.servicePage?.[0] ?? null;
}

/** Convert Strapi's service schema into the stable view model consumed by the catch-all route. */
export const serviceSource: ServiceContentSource = {
  async getServicePage(slug) {
    const requestedSlug = value(slug);
    if (!requestedSlug) return null;

    const graphqlUrl = getStrapiGraphqlUrl();
    const service = await fetchServiceBySlug(requestedSlug);
    return service ? mapService(service, graphqlUrl) : null;
  },
};
