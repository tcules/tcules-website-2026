import { cache } from 'react';

import type {
  CorpusBand,
  CorpusBlock,
  CorpusHero,
  CorpusLink,
  CorpusPage,
} from '@/lib/corpus-types';
import { inlineToText, type InlineRun } from '@/lib/inline';
import { glossaryPath } from '@/lib/routes';

import { parseBlocks } from '../corpus/parse-body';
import { parseInline } from '../corpus/parse-inline';
import { action, rows, text } from './home';
import type { CmsAction, Entries } from './home-types';
import { getPublishedPageSeo } from './page-seo';
import { PUBLISHED_GLOSSARY_QUERY } from './published-glossary-query';
import { publicGraphql } from './public-graphql';
import { safeContentHref } from './rich-text';

type Text = string | null | undefined;

type CmsTermRef = {
  documentId: string;
  slug: string;
  routePath: Text;
  term: Text;
};

type CmsGlossaryBlock =
  | {
      __typename: 'ComponentContentHeading';
      id: string;
      heading: Text;
      headingAnchor: Text;
      headingNavigation: Text;
    }
  | { __typename: 'ComponentContentMarkdown'; id: string; body: Text }
  | {
      __typename: 'ComponentContentDataTable';
      id: string;
      caption: Text;
      columns: Entries<{ heading: Text }>;
      rows: Entries<{ heading: Text; cells: Entries<{ body: Text }> }>;
    }
  | { __typename: 'ComponentContentLinkList'; id: string; links: Entries<CmsAction> }
  | {
      __typename: 'ComponentGlossaryTermGroup';
      id: string;
      heading: Text;
      termsAnchor: Text;
      termsNavigation: Text;
      terms: Entries<{ id: string; term: CmsTermRef | null }>;
    }
  | {
      __typename: 'ComponentSharedFaqSection';
      id: string;
      heading: Text;
      faqAnchor: Text;
      faqNavigation: Text;
      description: Text;
      faqs: Entries<{
        documentId: string;
        question: Text;
        answer: unknown;
        isActive: boolean | null;
      }>;
    }
  | { __typename: string; id?: string };

type CmsGlossary = {
  documentId: string;
  slug: string;
  routePath: Text;
  term: Text;
  publishedAt: Text;
  updatedAt: Text;
  hero: {
    title: Text;
    eyebrow: Text;
    description: Text;
    secondaryDescription: Text;
    additionalParagraphs: Entries<{ text: Text }>;
    breadcrumbs: Entries<{ label: Text; href: Text }>;
    actions: Entries<CmsAction>;
  } | null;
  content: Entries<CmsGlossaryBlock>;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const inline = (value: Text): InlineRun[] => {
  const source = text(value);
  return source ? parseInline(source) : [];
};

function link(value: CmsAction | null | undefined): CorpusLink | undefined {
  const mapped = action(value);
  return mapped
    ? { href: mapped.href, label: parseInline(mapped.label), labelText: mapped.label }
    : undefined;
}

/* ── Strapi rich text (the FAQ answers) → the corpus block model ─────────────── */

type RichNode = {
  type?: unknown;
  text?: unknown;
  url?: unknown;
  format?: unknown;
  bold?: unknown;
  italic?: unknown;
  code?: unknown;
  children?: unknown;
};

const childrenOf = (node: RichNode): RichNode[] =>
  Array.isArray(node.children)
    ? node.children.filter(
        (child): child is RichNode => typeof child === 'object' && child !== null,
      )
    : [];

function richRuns(nodes: readonly RichNode[], context: string): InlineRun[] {
  return nodes.flatMap((node): InlineRun[] => {
    if (node.type === 'text') {
      const value = typeof node.text === 'string' ? node.text : '';
      if (!value) return [];
      let run: InlineRun =
        node.code === true ? { type: 'code', text: value } : { type: 'text', text: value };
      if (node.italic === true) run = { type: 'em', children: [run] };
      if (node.bold === true) run = { type: 'strong', children: [run] };
      return [run];
    }
    if (node.type === 'link') {
      const children = richRuns(childrenOf(node), context);
      const href = safeContentHref(node.url);
      if (!href) console.warn(`New CMS ${context}: rich-text link dropped (unsafe href)`);
      return href ? [{ type: 'link', href, children }] : children;
    }
    return richRuns(childrenOf(node), context);
  });
}

export function richBlocks(value: unknown, context: string): CorpusBlock[] {
  if (typeof value === 'string') return value.trim() ? parseBlocks(value) : [];
  if (!Array.isArray(value)) return [];
  return value
    .filter((node): node is RichNode => typeof node === 'object' && node !== null)
    .flatMap((node): CorpusBlock[] => {
      if (node.type === 'list')
        return [
          {
            type: 'list',
            ordered: node.format === 'ordered',
            items: childrenOf(node).map((item) => richRuns(childrenOf(item), context)),
          },
        ];
      if (node.type !== 'paragraph')
        console.warn(`New CMS ${context}: rich-text ${String(node.type)} read as a paragraph`);
      const runs = richRuns(childrenOf(node), context);
      return runs.length > 0 ? [{ type: 'paragraph', runs }] : [];
    });
}

/* ── Blocks → hero lede and bands, in CMS order ──────────────────────────────── */

function band(id: string, heading: InlineRun[], navLabel: Text, anchored = true): CorpusBand {
  const label = text(navLabel);
  return {
    id,
    anchored,
    heading,
    headingText: inlineToText(heading),
    ...(label ? { navLabel: label } : {}),
    blocks: [],
  };
}

function tableBlock(
  block: Extract<CmsGlossaryBlock, { __typename: 'ComponentContentDataTable' }>,
): CorpusBlock {
  return {
    type: 'table',
    header: rows(block.columns).map((column) => inline(column.heading)),
    rows: rows(block.rows).map((row) => [
      inline(row.heading),
      ...rows(row.cells).map((cell) => inline(cell.body)),
    ]),
  };
}

/** A related term links to its own record's route, built from its slug (one path, `glossaryPath`). */
function termLink(ref: CmsTermRef | null, context: string): InlineRun[] | undefined {
  const name = text(ref?.term);
  if (!ref || !name || !SLUG.test(ref.slug)) {
    console.warn(
      `New CMS ${context}: related term without a published term name or slug omitted`,
    );
    return undefined;
  }
  const href = glossaryPath(ref.slug);
  if (ref.routePath !== href)
    console.warn(
      `New CMS ${context}: related term ${ref.slug} routePath ${ref.routePath} ≠ ${href}`,
    );
  return [{ type: 'link', href, children: parseInline(name) }];
}

export const getPublishedGlossary = cache(async (slug: string): Promise<CorpusPage | null> => {
  if (!SLUG.test(slug)) return null;
  const route = glossaryPath(slug);
  const { glossaries } = await publicGraphql<{ glossaries: CmsGlossary[] }>(
    PUBLISHED_GLOSSARY_QUERY,
    'PublishedGlossary',
    { slug },
  );
  const record = glossaries.find((entry) => entry.slug === slug);
  if (!record) return null;

  const term = text(record.term);
  const title = text(record.hero?.title) ?? term;
  if (!term || !title) throw new Error(`New CMS ${route}: glossary record has no term`);
  if (record.routePath !== route)
    console.warn(
      `New CMS ${route}: glossary routePath is ${record.routePath}; serving by slug`,
    );

  const titleRuns = parseInline(title);
  const hero: CorpusHero = {
    eyebrow: text(record.hero?.eyebrow) ? parseInline(text(record.hero?.eyebrow)!) : null,
    title: titleRuns,
    titleText: inlineToText(titleRuns),
    lede: [
      record.hero?.description,
      record.hero?.secondaryDescription,
      ...rows(record.hero?.additionalParagraphs).map((item) => item.text),
    ].flatMap((value) => (text(value) ? [parseInline(text(value)!)] : [])),
    actions: rows(record.hero?.actions).flatMap((value) => link(value) ?? []),
    proofLines: [],
    extra: [],
  };

  /* The definition runs on from the hero until the first heading, exactly as the corpus body does:
     its paragraphs are the hero's lede (the term template splits them), anything else stays extra. */
  const bands: CorpusBand[] = [];
  const append = (blocks: CorpusBlock[]) => {
    const current = bands.at(-1);
    if (current) {
      current.blocks.push(...blocks);
      return;
    }
    for (const block of blocks) {
      if (block.type === 'paragraph') hero.lede.push(block.runs);
      else if (block.type === 'links') hero.actions.push(...block.links);
      else hero.extra.push(block);
    }
  };

  for (const block of rows(record.content)) {
    const context = `${route} ${block.__typename} ${block.id ?? ''}`.trim();
    switch (block.__typename) {
      case 'ComponentContentHeading': {
        const b = block as Extract<CmsGlossaryBlock, { __typename: 'ComponentContentHeading' }>;
        const heading = inline(b.heading);
        const anchor = text(b.headingAnchor);
        if (!heading.length || !anchor) {
          console.warn(`New CMS ${context}: heading without words or anchor omitted`);
          break;
        }
        bands.push(band(anchor, heading, b.headingNavigation));
        break;
      }
      case 'ComponentContentMarkdown': {
        const body = text((block as { body: Text }).body);
        if (body) append(parseBlocks(body));
        break;
      }
      case 'ComponentContentDataTable':
        append([
          tableBlock(
            block as Extract<CmsGlossaryBlock, { __typename: 'ComponentContentDataTable' }>,
          ),
        ]);
        break;
      case 'ComponentContentLinkList': {
        const links = rows((block as { links: Entries<CmsAction> }).links).flatMap(
          (value) => link(value) ?? [],
        );
        if (links.length) append([{ type: 'links', links }]);
        break;
      }
      case 'ComponentGlossaryTermGroup': {
        const b = block as Extract<
          CmsGlossaryBlock,
          { __typename: 'ComponentGlossaryTermGroup' }
        >;
        const heading = inline(b.heading);
        const anchor = text(b.termsAnchor);
        const items = rows(b.terms).flatMap((item) => {
          const runs = termLink(item.term, context);
          return runs ? [runs] : [];
        });
        if (!heading.length || !anchor || !items.length) {
          console.warn(
            `New CMS ${context}: related-term group without heading, anchor or terms omitted`,
          );
          break;
        }
        const group = band(anchor, heading, b.termsNavigation);
        group.blocks.push({ type: 'list', ordered: false, items });
        bands.push(group);
        break;
      }
      case 'ComponentSharedFaqSection': {
        const b = block as Extract<
          CmsGlossaryBlock,
          { __typename: 'ComponentSharedFaqSection' }
        >;
        const heading = inline(b.heading);
        const anchor = text(b.faqAnchor);
        const questions = rows(b.faqs).filter(
          (faq) => faq.isActive !== false && text(faq.question),
        );
        if (!heading.length || !anchor || !questions.length) {
          console.warn(
            `New CMS ${context}: FAQ without heading, anchor or active questions omitted`,
          );
          break;
        }
        const faq = band(anchor, heading, b.faqNavigation);
        if (text(b.description)) faq.blocks.push(...parseBlocks(text(b.description)!));
        for (const question of questions) {
          const headingRuns = parseInline(text(question.question)!);
          faq.blocks.push({
            type: 'item',
            level: 3,
            id: null,
            heading: headingRuns,
            headingText: inlineToText(headingRuns),
            blocks: richBlocks(question.answer, `${context} FAQ ${question.documentId}`),
          });
        }
        bands.push(faq);
        break;
      }
      default:
        console.warn(`New CMS ${context}: unsupported glossary block omitted`);
    }
  }

  const breadcrumb = rows(record.hero?.breadcrumbs).flatMap((crumb) => {
    const name = text(crumb.label);
    const url = safeContentHref(crumb.href);
    return name && url ? [{ name, url }] : [];
  });
  if (breadcrumb.at(-1)?.url !== route)
    console.warn(`New CMS ${route}: glossary breadcrumb does not end on the page's route`);

  return {
    route,
    slug,
    name: term,
    pageType: 'defined_term',
    /* The page's <head> is the route-keyed CMS SEO entry (`getPublishedGlossarySeo`), not this. */
    seo: { title, description: '', canonical: '', robots: '', ogImageAlt: null },
    breadcrumb,
    conversion: null,
    bandOrder: bands.map((item) => item.id),
    searchContext: {
      primaryIntent: null,
      primaryBuyerQuestion: null,
      supportingQuestions: [],
      primaryQuery: null,
      secondaryQueries: [],
      keyEntities: [],
    },
    structuredData: { types: [], organizationRef: null, raw: {} },
    composition: {
      visualPlan: null,
      mediaBindings: [],
      logoClients: [],
      clientRecognition: null,
      caseSlugs: [],
      testimonialIds: [],
      caseMeta: null,
      raw: {},
    },
    release: { contentState: null, siteReleaseState: null },
    hero,
    bands,
    frontmatter: {},
    file: `cms:glossary/${record.documentId}`,
  };
});

/** The record's <head>: its route-keyed CMS SEO entry, mapped once (title through JSON-LD). */
export const getPublishedGlossarySeo = (slug: string) =>
  getPublishedPageSeo(glossaryPath(slug));
