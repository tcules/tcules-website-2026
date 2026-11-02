import { cache } from 'react';

import type {
  CorpusBand,
  CorpusBlock,
  CorpusLink,
  CorpusPage,
  TestimonialAvatarRecord,
} from '../../corpus-types';
import { inlineToText, type InlineRun } from '../../../lib/inline';
import { ROUTES, SITE_ORIGIN } from '../../../lib/routes';
import { caseRoutesIn } from '../../../lib/corpus-cases';
import { liveCaseLinks, parseCorpusDocument } from '../corpus/load';
import { ABOUT_DOCUMENT_QUERY } from './about-document-query';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { productionCmsQuery, productionCmsUrl } from './production-cms';
import { safeContentHref } from './rich-text';

type Node = {
  type?: string;
  text?: string;
  url?: string;
  children?: Node[];
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  format?: string;
  level?: number;
};
type Link = { name?: string | null; href?: string | null };
type Item = {
  id: string;
  title?: string | null;
  label?: string | null;
  body?: Node[] | null;
  description?: string | null;
  href?: string | null;
  link?: Link | null;
  cover?: StrapiUploadFile | null;
};
type Block = {
  __typename: string;
  id: string;
  sectionHeading?: string | null;
  anchorId?: string | null;
  body?: Node[] | null;
  items?: Item[];
  cards?: Item[];
  people?: {
    documentId: string;
    name: string;
    designation?: string | null;
    description?: string | null;
    linkedInProfile?: string | null;
  }[];
  storyHeading?: string | null;
  image?: StrapiUploadFile | null;
  linkHeading?: string | null;
  description?: string | null;
  links?: Link[];
  caption?: string | null;
  summary?: string | null;
  tableColumns?: { heading?: string | null }[];
  rows?: { rowHeading?: string | null; cells?: { content?: Node[] | null }[] }[];
  quote?: string | null;
  attribution?: string | null;
  role?: string | null;
  company?: string | null;
  rating?: number | null;
  profileImage?: StrapiUploadFile | null;
  faqHeading?: string | null;
  faqs?: { documentId: string; question: string; answer: Node[]; isActive?: boolean | null }[];
  ctaHeading?: string | null;
  ctaType?: string | null;
  button?: Link | null;
};
type About = {
  documentId: string;
  title: string;
  updatedAt?: string | null;
  hero: {
    eyebrow?: string | null;
    highlightedText?: string | null;
    description: string;
    record?: string | null;
    image?: StrapiUploadFile | null;
  };
  content: Block[];
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalURL?: string | null;
    robot?: string | null;
    structuredData?: unknown;
  } | null;
};
export type CmsAboutDocument = {
  page: CorpusPage;
  updatedAt?: string;
  avatars: Record<string, TestimonialAvatarRecord>;
  structuredData?: Record<string, unknown> | unknown[];
};
const text = (value: string | null | undefined) => value?.trim() || '';
const runs = (value: string): InlineRun[] => (value ? [{ type: 'text', text: value }] : []);
const paragraph = (value: string): CorpusBlock => ({ type: 'paragraph', runs: runs(value) });
const paragraphs = (value: string | null | undefined): CorpusBlock[] =>
  text(value)
    .split(/\n\s*\n/u)
    .filter(Boolean)
    .map(paragraph);
const item = (
  id: string,
  title: string,
  blocks: CorpusBlock[],
): Extract<CorpusBlock, { type: 'item' }> => ({
  type: 'item',
  level: 3,
  id,
  heading: runs(title),
  headingText: title,
  blocks,
});

/** Strapi's structured inline nodes remain structured through the CMS seam. */
function inline(nodes: Node[] = []): InlineRun[] {
  return nodes.flatMap((node): InlineRun[] => {
    if (node.type === 'link') {
      const children = inline(node.children);
      const href = safeContentHref(node.url);
      return href ? [{ type: 'link', href, children }] : children;
    }
    if (typeof node.text === 'string') {
      let result: InlineRun[] = [{ type: node.code ? 'code' : 'text', text: node.text }];
      if (node.bold) result = [{ type: 'strong', children: result }];
      if (node.italic) result = [{ type: 'em', children: result }];
      return result;
    }
    return inline(node.children);
  });
}
function nativeBlocks(nodes: Node[] = []): CorpusBlock[] {
  const blocks: CorpusBlock[] = [];
  let nested: Extract<CorpusBlock, { type: 'item' }> | undefined;
  for (const node of nodes) {
    const content = inline(node.children);
    if (node.type === 'heading') {
      const heading = item('', inlineToText(content), []);
      heading.id = null;
      heading.heading = content;
      heading.level = (node.level || 3) >= 4 ? 4 : 3;
      if (heading.level === 4 && nested) nested.blocks.push(heading);
      else {
        blocks.push(heading);
        nested = heading;
      }
      continue;
    }
    let block: CorpusBlock;
    if (node.type === 'list')
      block = {
        type: 'list',
        ordered: node.format === 'ordered',
        items: (node.children || []).map((child) => inline(child.children)),
      };
    else if (node.type === 'quote')
      block = {
        type: 'quote',
        paragraphs: [content],
        attribution: null,
        pendingSignoff: false,
        testimonialId: null,
        rating: null,
      };
    else {
      if (!content.length) continue;
      const links = content.filter((run) => run.type === 'link');
      block =
        links.length &&
        content.every(
          (run) => run.type === 'link' || (run.type === 'text' && /^[\s·|,]*$/u.test(run.text)),
        )
          ? {
              type: 'links',
              links: links.map((link) => ({
                href: link.href,
                label: link.children,
                labelText: inlineToText(link.children),
              })),
            }
          : { type: 'paragraph', runs: content };
    }
    (nested ? nested.blocks : blocks).push(block);
  }
  return blocks;
}
function flattened(nodes: Node[] | null | undefined): InlineRun[] {
  return (nodes || []).flatMap((node, index) => [
    ...(index ? runs(' ') : []),
    ...inline(node.children),
  ]);
}
function link(value: Link | null | undefined): CorpusLink {
  const href = safeContentHref(value?.href),
    labelText = text(value?.name);
  if (!href || !labelText) throw new Error('Production CMS About has an invalid link.');
  return { href, labelText, label: runs(labelText) };
}

function aboutSchema(raw: unknown, page: CorpusPage): CmsAboutDocument['structuredData'] {
  if (!raw || typeof raw !== 'object') return undefined;
  if (Array.isArray(raw)) return raw;
  const schema = raw as Record<string, unknown>;
  if ('@type' in schema || '@graph' in schema) return schema;
  // The CMS also accepts the corpus's declarative schema types. Project these from live content.
  const types = Array.isArray(schema.types)
    ? schema.types.filter((type): type is string => typeof type === 'string')
    : [];
  page.structuredData = {
    types,
    organizationRef:
      typeof schema.organization_ref === 'string' ? schema.organization_ref : null,
    raw: schema,
  };
  const graph: Record<string, unknown>[] = [];
  if (types.includes('AboutPage'))
    graph.push({
      '@type': 'AboutPage',
      '@id': page.seo.canonical,
      url: page.seo.canonical,
      name: page.hero.titleText,
      description: page.seo.description,
      ...(page.structuredData.organizationRef
        ? { about: { '@id': page.structuredData.organizationRef } }
        : {}),
    });
  if (types.includes('BreadcrumbList'))
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: page.breadcrumb.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: new URL(crumb.url, SITE_ORIGIN).toString(),
      })),
    });
  if (types.includes('FAQPage')) {
    const faq = page.bands.find((band) => band.id === 'frequently-asked-questions');
    const plainBlocks = (blocks: CorpusBlock[]): string =>
      blocks
        .map((block) =>
          block.type === 'paragraph'
            ? inlineToText(block.runs)
            : block.type === 'links'
              ? block.links.map((link) => link.labelText).join(' ')
              : block.type === 'list'
                ? block.items.map(inlineToText).join(' ')
                : block.type === 'item'
                  ? `${block.headingText} ${plainBlocks(block.blocks)}`
                  : '',
        )
        .join(' ');
    const questions = (faq?.blocks || []).flatMap((block) =>
      block.type === 'item'
        ? [
            {
              '@type': 'Question',
              name: block.headingText,
              acceptedAnswer: { '@type': 'Answer', text: plainBlocks(block.blocks) },
            },
          ]
        : [],
    );
    if (questions.length) graph.push({ '@type': 'FAQPage', mainEntity: questions });
  }
  return graph.length ? { '@context': 'https://schema.org', '@graph': graph } : undefined;
}

/** All visible About content comes from native components, without reading a local/snapshot body. */
export function mapAboutDocument(raw: About | null): CmsAboutDocument | null {
  if (!raw) return null;
  if (
    !text(raw.documentId) ||
    !text(raw.title) ||
    !text(raw.hero?.description) ||
    !Array.isArray(raw.content)
  )
    throw new Error('Production CMS About has no valid page content.');
  const route = ROUTES.about;
  const page = parseCorpusDocument(
    `cms:${route}`,
    {
      route,
      slug: 'about',
      page_name: 'About Tcules',
      page_type: 'page',
      seo: {
        title: text(raw.seo?.metaTitle) || `${raw.title} | Tcules`,
        description: text(raw.seo?.metaDescription) || raw.hero.description,
        canonical: text(raw.seo?.canonicalURL) || `${SITE_ORIGIN}${route}`,
        robots:
          text(raw.seo?.robot)
            .split(/[\s,]+/u)
            .filter(Boolean)
            .join(',') || 'index,follow',
      },
      navigation: {
        breadcrumb: [
          { name: 'Home', url: ROUTES.home },
          { name: 'About', url: route },
        ],
      },
    },
    '# About',
  );
  page.hero = {
    eyebrow: text(raw.hero.eyebrow) ? runs(text(raw.hero.eyebrow)) : null,
    title: runs(raw.title),
    titleText: raw.title,
    lede: [
      ...paragraphs(raw.hero.highlightedText),
      ...paragraphs(raw.hero.description),
    ].flatMap((block) => (block.type === 'paragraph' ? [block.runs] : [])),
    actions: [],
    proofLines: text(raw.hero.record) ? [runs(text(raw.hero.record))] : [],
    extra: [],
  };
  const avatars: CmsAboutDocument['avatars'] = {};
  function image(
    file: StrapiUploadFile | null | undefined,
    id: string,
    section: string,
    role: string,
    alt: string,
    card: string | null = null,
  ) {
    if (!file) return;
    const mapped = mapUploadImage(file, productionCmsUrl(), {
      fallbackAlt: alt,
      requireImageMime: true,
    });
    if (!mapped) throw new Error(`Production CMS About image ${id} is invalid.`);
    page.composition.mediaBindings.push({
      id,
      role,
      supportsSection: section,
      card,
      assetUri: mapped.src,
      altIntent: mapped.alt,
      width: mapped.width,
      height: mapped.height,
      sources: mapped.sources,
      bound: true,
      status: 'BOUND_EXISTING_PUBLIC_ASSET',
      source: 'About single type',
      caption: null,
      attribution: null,
    });
    return mapped;
  }
  image(raw.hero.image, 'about-hero', 'hero', 'humanise', raw.title);
  let current: CorpusBand | undefined;
  let nested: Extract<CorpusBlock, { type: 'item' }> | undefined;
  const start = (id: string, heading: string) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id) || page.bands.some((band) => band.id === id))
      throw new Error(`Production CMS About has an invalid/duplicate section ${id}.`);
    current = { id, anchored: true, heading: runs(heading), headingText: heading, blocks: [] };
    page.bands.push(current);
    nested = undefined;
    return current;
  };
  const append = (blocks: CorpusBlock[]) => {
    if (!current) start('about-introduction', '');
    for (const block of blocks) {
      if (block.type === 'item' && block.level === 3) {
        current!.blocks.push(block);
        nested = block;
      } else (nested ? nested.blocks : current!.blocks).push(block);
    }
  };
  for (const block of raw.content) {
    if (block.__typename === 'ComponentServiceSectionHeading') {
      start(text(block.anchorId) || `about-section-${block.id}`, text(block.sectionHeading));
      continue;
    }
    if (!current) start('about-introduction', '');
    switch (block.__typename) {
      case 'ComponentAboutServiceGrid':
        current!.blocks.push(
          ...(block.items || []).map((entry) =>
            item(`about-service-${entry.id}`, text(entry.title), [
              ...paragraphs(entry.description),
              { type: 'links', links: [link({ name: entry.title, href: entry.href })] },
            ]),
          ),
        );
        nested = undefined;
        break;
      case 'ComponentServiceRichText':
        append(nativeBlocks(block.body || []));
        break;
      case 'ComponentServiceLabelledList': {
        const entries = block.items || [];
        if (['who-uses-tcules', 'how-we-work'].includes(current!.id)) {
          append([
            {
              type: 'list',
              ordered: false,
              items: entries.map((entry) => {
                const title = text(entry.title) || text(entry.label),
                  body = flattened(entry.body);
                return current!.id === 'how-we-work'
                  ? [
                      { type: 'strong', children: runs(title) },
                      ...runs(body.length ? ' ' : ''),
                      ...body,
                    ]
                  : [...runs(title), ...runs(body.length ? ' ' : ''), ...body];
              }),
            },
          ]);
        } else {
          current!.blocks.push(
            ...entries.map((entry) =>
              item(`about-item-${entry.id}`, text(entry.title) || text(entry.label), [
                ...nativeBlocks(entry.body || []),
                ...(entry.link ? [{ type: 'links' as const, links: [link(entry.link)] }] : []),
              ]),
            ),
          );
          nested = undefined;
        }
        break;
      }
      case 'ComponentServiceCardGrid':
        for (const card of block.cards || []) {
          const action = link(card.link),
            title = text(card.title) || action.labelText;
          append([
            {
              type: 'paragraph',
              runs: [
                { type: 'link', href: action.href, children: runs(title) },
                ...runs(' '),
                ...flattened(card.body),
              ],
            },
          ]);
          image(
            card.cover,
            `about-case-${card.id}`,
            current!.id,
            'demonstrate',
            title,
            action.href,
          );
        }
        break;
      case 'ComponentAboutPeople':
        current!.blocks.push(
          ...(block.people || []).map((person) =>
            item(
              `about-person-${person.documentId}`,
              [person.name, text(person.designation)].filter(Boolean).join(', '),
              [
                ...paragraphs(person.description),
                ...(person.linkedInProfile
                  ? [
                      {
                        type: 'links' as const,
                        links: [
                          link({
                            name: `${person.name} on LinkedIn`,
                            href: person.linkedInProfile,
                          }),
                        ],
                      },
                    ]
                  : []),
              ],
            ),
          ),
        );
        nested = undefined;
        break;
      case 'ComponentAboutImageStory': {
        const story = item(
          `about-story-${block.id}`,
          text(block.storyHeading),
          nativeBlocks(block.body || []),
        );
        current!.blocks.push(story);
        nested = story;
        image(block.image, story.id!, story.id!, 'humanise', text(block.storyHeading));
        break;
      }
      case 'ComponentServiceLinkGroup':
        if (text(block.linkHeading))
          append([item(`about-links-${block.id}`, text(block.linkHeading), [])]);
        append([
          ...paragraphs(block.description),
          { type: 'links', links: (block.links || []).map(link) },
        ]);
        break;
      case 'ComponentServiceTable':
        append([
          {
            type: 'table',
            header: (block.tableColumns || []).map((column) => runs(text(column.heading))),
            rows: (block.rows || []).map((row) => [
              runs(text(row.rowHeading)),
              ...(row.cells || []).map((cell) => flattened(cell.content)),
            ]),
            ...(text(block.caption) ? { caption: text(block.caption) } : {}),
            ...(text(block.summary) ? { summary: text(block.summary) } : {}),
          },
        ]);
        break;
      case 'ComponentServiceQuote': {
        const id = `about-quote-${block.id}`;
        if (
          !text(block.quote) ||
          !text(block.attribution) ||
          typeof block.rating !== 'number' ||
          !Number.isFinite(block.rating) ||
          block.rating < 0 ||
          block.rating > 5
        )
          throw new Error('Production CMS About has an invalid testimonial.');
        append([
          {
            type: 'quote',
            paragraphs: [runs(text(block.quote))],
            attribution: runs(
              [block.attribution, block.role, block.company].filter(Boolean).join(', '),
            ),
            pendingSignoff: false,
            testimonialId: id,
            rating: { value: block.rating, placeholder: false },
          },
        ]);
        const portrait = image(
          block.profileImage,
          `${id}-avatar`,
          `${id}-avatar`,
          'humanise',
          text(block.attribution),
        );
        if (portrait)
          avatars[id] = {
            src: portrait.src,
            width: portrait.width,
            height: portrait.height,
            sources: portrait.sources,
            placeholder: false,
          };
        break;
      }
      case 'ComponentServiceFaqSection':
        if (text(block.faqHeading)) {
          current!.heading = runs(text(block.faqHeading));
          current!.headingText = text(block.faqHeading);
        }
        append([
          ...paragraphs(block.description),
          ...(block.faqs || [])
            .filter((faq) => faq.isActive !== false)
            .map((faq) =>
              item(`about-faq-${faq.documentId}`, faq.question, nativeBlocks(faq.answer)),
            ),
        ]);
        break;
      case 'AboutCta':
        if (block.ctaType !== 'button') throw new Error('Unsupported About CTA type.');
        if (text(block.ctaHeading)) {
          current!.heading = runs(text(block.ctaHeading));
          current!.headingText = text(block.ctaHeading);
        }
        append([
          ...paragraphs(block.description),
          { type: 'links', links: [link(block.button)] },
        ]);
        break;
      default:
        throw new Error(`Unsupported production CMS About component ${block.__typename}.`);
    }
  }
  page.bands = liveCaseLinks(page.bands.filter((band) => band.blocks.length));
  page.bandOrder = page.bands.map((band) => band.id);
  page.composition.caseSlugs = caseRoutesIn(page).map((route) =>
    route.slice('/case-studies/'.length),
  );
  page.composition.testimonialIds = raw.content
    .filter((block) => block.__typename === 'ComponentServiceQuote')
    .map((block) => `about-quote-${block.id}`);
  const structuredData = aboutSchema(raw.seo?.structuredData, page);
  return {
    page,
    avatars,
    ...(text(raw.updatedAt) ? { updatedAt: text(raw.updatedAt) } : {}),
    ...(structuredData && typeof structuredData === 'object'
      ? { structuredData: structuredData as Record<string, unknown> | unknown[] }
      : {}),
  };
}

export const getAboutDocument = cache(async (): Promise<CmsAboutDocument | null> => {
  const data = await productionCmsQuery<{ about: About | null }>(ABOUT_DOCUMENT_QUERY, {}, [
    'about',
  ]);
  if (!('about' in data)) throw new Error('Production CMS returned no About field.');
  return mapAboutDocument(data.about);
});
