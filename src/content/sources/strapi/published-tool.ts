import { cache } from 'react';

import type { SketchName } from '@/components/Sketch';
import type {
  CorpusBand,
  CorpusBlock,
  CorpusHero,
  CorpusLink,
  CorpusPage,
} from '@/lib/corpus-types';
import { inlineToText, type InlineRun } from '@/lib/inline';
import { toolPath } from '@/lib/routes';
import type { HeroMedia } from '@/patterns';
import type { ToolShell } from '@/templates/CorpusPage/LongformShell';
import type { AuditBlock } from '@/templates/CorpusPage/published-audit-model';

import type { ToolBlock, ToolPage, ToolSection } from '../../types';
import { parseBlocks } from '../corpus/parse-body';
import { parseInline } from '../corpus/parse-inline';
import { action, illustration, mapHero, rows, text } from './home';
import type { CmsAction, CmsHero, CmsIllustration, Entries } from './home-types';
import { mapAuditBlock, type CmsAuditBlock } from './published-audit';
import { richBlocks } from './published-glossary';
import { flowBlocks, type CmsFlow } from './published-service';
import { PUBLISHED_TOOL_QUERY, PUBLISHED_TOOL_SLUGS_QUERY } from './published-tool-query';
import { htmlProseToMarkdown, htmlTableToMarkdown } from './prose-html';
import { publicGraphql } from './public-graphql';
import { safeContentHref } from './rich-text';

type Text = string | null | undefined;

type CmsToolFlow = CmsFlow & { illustration?: CmsIllustration | null };

type CmsEditorialSection = {
  __typename: 'ComponentSharedEditorialSection';
  id: string;
  heading: Text;
  anchorId: Text;
  navigationLabel: Text;
  editorialPresentation: 'text' | 'media' | null;
  media: unknown;
  blocks: Entries<CmsToolFlow>;
};

type CmsFaqSection = {
  __typename: 'ComponentSharedFaqSection';
  id: string;
  heading: Text;
  faqAnchor: Text;
  navigationLabel: Text;
  description: Text;
  faqs: Entries<{
    documentId: string;
    question: Text;
    answer: unknown;
    isActive: boolean | null;
  }>;
};

type CmsToolAuditSection = {
  __typename: 'ComponentAuditSection';
  id: string;
  heading: Text;
  sectionAnchor: Text;
  sectionNavigation: Text;
  sectionBlocks: Entries<CmsAuditBlock>;
};

type CmsToolSection = CmsEditorialSection | CmsFaqSection | CmsToolAuditSection;

type CmsTool = {
  documentId: string;
  name: Text;
  slug: string;
  routePath: Text;
  presentation: 'article' | 'sections' | null;
  publishedAt: Text;
  hero: CmsHero | null;
  content: Entries<CmsToolSection>;
};

/**
 * A Tool record (`/tools/{slug}`) as the page renders it, by the record's `presentation`:
 *
 *   article   the corpus tool page (LongformPage `tool`): the record mapped onto the corpus page model,
 *             its hero drawing, and the worksheet's drawings (`shell`) read from the CMS
 *   sections  the section-by-section tool page: the record mapped onto the tool page view model
 */
export type PublishedTool =
  | {
      presentation: 'article';
      slug: string;
      route: string;
      page: CorpusPage;
      /** The CMS hero drawing; absent, the page falls back to the frontend's drawing for the route. */
      heroMedia?: HeroMedia;
      /** The CMS's worked-example and diagram drawings, by band; missing ones fall back per band. */
      shell: ToolShell;
    }
  | { presentation: 'sections'; slug: string; route: string; tool: ToolPage };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

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

function band(id: string, heading: InlineRun[], navLabel: Text, anchored: boolean): CorpusBand {
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

/** A registered scene from a CMS illustration, or nothing (an uploaded image is reported). */
function sceneOf(
  value: CmsIllustration | null | undefined,
  warn: (message: string) => void,
): SketchName | undefined {
  const art = illustration(value);
  if (art?.scene) return art.scene as SketchName;
  if (art?.image)
    warn('an uploaded image is not a drawing this page can place; frontend drawing kept');
  return undefined;
}

/** Where a diagram sits: after the paragraph, or the table, the CMS saved before it. */
function anchorOf(block: CorpusBlock | undefined): string | undefined {
  if (block?.type === 'paragraph') return text(inlineToText(block.runs));
  if (block?.type === 'table') return text(inlineToText(block.header[0] ?? []));
  return undefined;
}

/* ── article: the record onto the corpus page model ──────────────────────────── */

function mapEditorial(
  section: CmsEditorialSection,
  shell: { stories: Record<string, SketchName>; diagrams: ToolShell['diagrams'] },
  route: string,
  warn: (message: string) => void,
): CorpusBand | undefined {
  const key = `${section.__typename}-${section.id}`;
  const heading = inline(section.heading);
  if (heading.length === 0) {
    warn(`${key} has no heading; not shown`);
    return undefined;
  }
  const anchor = text(section.anchorId);
  const id = anchor ?? key;
  if (!anchor) warn(`${key} has no anchor id; it is left out of the outline's links`);
  if (section.editorialPresentation === 'media' || section.media)
    warn(`${key} carries media, which the tool page's column has no slot for; not shown`);
  const out = band(id, heading, section.navigationLabel, Boolean(anchor));
  const sectionWarn = (message: string) => warn(`${key} ${message}`);
  const diagrams: Record<string, { after: string; scene: SketchName }> = {};
  for (const block of rows(section.blocks)) {
    if (block.kind === 'illustration') {
      const scene = sceneOf(block.illustration, (m) => sectionWarn(`block ${block.id}: ${m}`));
      if (!scene) continue;
      const after = anchorOf(out.blocks.at(-1));
      if (!after) {
        sectionWarn(
          `block ${block.id}: a diagram with no paragraph or table before it; not placed`,
        );
        continue;
      }
      if (diagrams[id])
        sectionWarn(`block ${block.id}: a second diagram in one section; not placed`);
      else diagrams[id] = { after, scene };
      continue;
    }
    if (block.kind === 'scenario' && block.scenario?.illustration) {
      const scene = sceneOf(block.scenario.illustration, (m) =>
        sectionWarn(`block ${block.id}: ${m}`),
      );
      if (scene) shell.stories[id] = scene;
    }
    const tableWarn = (m: string) => sectionWarn(`block ${block.id} table: ${m}`);
    const prose = (body: Text) =>
      htmlProseToMarkdown(body, (m) => sectionWarn(`block ${block.id}: ${m}`));
    const normalised: CmsToolFlow = {
      ...block,
      ...(block.prose ? { prose: { body: prose(block.prose.body) } } : {}),
      ...(block.table ? { table: htmlTableToMarkdown(block.table, tableWarn) } : {}),
      ...(block.scenario
        ? {
            scenario: {
              ...block.scenario,
              blocks: rows(block.scenario.blocks).map((inner) => ({
                ...inner,
                ...(inner.prose ? { prose: { body: prose(inner.prose.body) } } : {}),
                ...(inner.table ? { table: htmlTableToMarkdown(inner.table, tableWarn) } : {}),
              })),
            },
          }
        : {}),
    };
    out.blocks.push(...flowBlocks([normalised], sectionWarn));
  }
  Object.assign(shell.diagrams, diagrams);
  if (out.blocks.length === 0) warn(`${route} ${key} has no words`);
  return out;
}

function mapFaq(
  section: CmsFaqSection,
  warn: (message: string) => void,
): CorpusBand | undefined {
  const key = `${section.__typename}-${section.id}`;
  const heading = inline(section.heading);
  const anchor = text(section.faqAnchor);
  const questions = rows(section.faqs).filter(
    (faq) => faq.isActive !== false && text(faq.question),
  );
  if (heading.length === 0 || !anchor || questions.length === 0) {
    warn(`${key}: FAQ without heading, anchor or active questions; not shown`);
    return undefined;
  }
  const faq = band(anchor, heading, section.navigationLabel, true);
  const description = text(section.description);
  if (description) faq.blocks.push(...parseBlocks(description));
  for (const question of questions) {
    const headingRuns = parseInline(text(question.question)!);
    faq.blocks.push({
      type: 'item',
      level: 3,
      id: null,
      heading: headingRuns,
      headingText: inlineToText(headingRuns),
      blocks: richBlocks(question.answer, `${key} FAQ ${question.documentId}`),
    });
  }
  return faq;
}

function articleTool(record: CmsTool, route: string, warn: (message: string) => void) {
  const title = text(record.hero?.title) ?? text(record.name);
  if (!title) throw new Error(`New CMS ${route}: tool record has no title or name`);
  const titleRuns = parseInline(title);
  const eyebrow = text(record.hero?.eyebrow);
  const hero: CorpusHero = {
    eyebrow: eyebrow ? parseInline(eyebrow) : null,
    title: titleRuns,
    titleText: inlineToText(titleRuns),
    lede: [
      record.hero?.description,
      record.hero?.secondaryDescription,
      ...rows(record.hero?.additionalParagraphs).map((item) => item.text),
    ].flatMap((value) => (text(value) ? [inline(value)] : [])),
    actions: rows(record.hero?.actions).flatMap((value) => link(value) ?? []),
    proofLines: [],
    extra: [],
  };

  const shell = { stories: {} as Record<string, SketchName>, diagrams: {} };
  const bands = rows(record.content).flatMap((section): CorpusBand[] => {
    switch (section.__typename) {
      case 'ComponentSharedEditorialSection': {
        const mapped = mapEditorial(section, shell, route, warn);
        return mapped ? [mapped] : [];
      }
      case 'ComponentSharedFaqSection': {
        const mapped = mapFaq(section, warn);
        return mapped ? [mapped] : [];
      }
      default:
        warn(
          `${section.__typename} ${section.id} is not a section an article tool can show; not shown`,
        );
        return [];
    }
  });

  const breadcrumb = rows(record.hero?.breadcrumbs).flatMap((crumb) => {
    const name = text(crumb.label);
    const url = safeContentHref(crumb.href);
    return name && url ? [{ name, url }] : [];
  });
  if (breadcrumb.at(-1)?.url !== route) warn('the breadcrumb does not end on the page’s route');

  const page: CorpusPage = {
    route,
    slug: record.slug,
    name: text(record.name) ?? title,
    pageType: 'tool',
    /* The page's <head> is the route-keyed CMS SEO entry (`getPageSeo`), not this. */
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
    file: `cms:tool/${record.documentId}`,
  };
  const heroMedia = mapHero(record.hero)?.media;
  return { page, shell, ...(heroMedia ? { heroMedia } : {}) };
}

/* ── sections: the record onto the tool page view model ──────────────────────── */

/** The audit block model is the tool block model's twin; the few fields it adds are not drawn here. */
function toolBlock(block: AuditBlock, warn: (message: string) => void): ToolBlock {
  switch (block.type) {
    case 'card-grid':
    case 'comparison-cards':
      if (block.cards.some((card) => card.href))
        warn(`${block.id}: card links are not drawn on a tool page`);
      return block.type === 'card-grid'
        ? { ...block, cards: block.cards.map(({ title, body }) => ({ title, body })) }
        : { ...block, cards: block.cards.map(({ title, body }) => ({ title, body })) };
    case 'quote':
      return {
        id: block.id,
        type: 'quote',
        quote: {
          quoteHtml: block.quote.quoteHtml,
          name: block.quote.name ?? '',
          role: block.quote.role ?? '',
          company: block.quote.company ?? '',
        },
      };
    case 'table':
      return {
        id: block.id,
        type: 'table',
        table: {
          ...(block.table.caption ? { caption: block.table.caption } : {}),
          ...(block.table.summary ? { summary: block.table.summary } : {}),
          keyColumn: { heading: block.table.keyColumn?.heading ?? '' },
          columns: block.table.columns.map(({ heading }) => ({ heading })),
          rows: block.table.rows.map(({ header, cellsHtml }) => ({
            header,
            cellsHtml: cellsHtml.map((cell) => (typeof cell === 'string' ? cell : '')),
          })),
        },
      };
    case 'two-column': {
      const column = (value: typeof block.left) => {
        if (!value) return undefined;
        if (value.links.length > 0)
          warn(`${value.id}: column links are not drawn on a tool page`);
        return {
          id: value.id,
          ...(value.eyebrow ? { eyebrow: value.eyebrow } : {}),
          heading: value.heading,
          bodyHtml: value.bodyHtml,
          items: value.items,
        };
      };
      const left = column(block.left);
      const right = column(block.right);
      return {
        id: block.id,
        type: 'two-column',
        ...(left ? { left } : {}),
        ...(right ? { right } : {}),
      };
    }
    default:
      return block;
  }
}

function sectionsTool(
  record: CmsTool,
  route: string,
  warn: (message: string) => void,
): ToolPage {
  const title = text(record.hero?.title) ?? text(record.name);
  if (!title) throw new Error(`New CMS ${route}: tool record has no title or name`);
  if (record.hero?.illustration || record.hero?.media)
    warn('hero media is set, but the sections tool page draws no hero media');
  const sections = rows(record.content).flatMap((section): ToolSection[] => {
    if (section.__typename !== 'ComponentAuditSection') {
      warn(`${section.__typename} ${section.id} is not a section a sections tool can show`);
      return [];
    }
    const key = `${section.__typename}-${section.id}`;
    const heading = text(section.heading);
    const anchor = text(section.sectionAnchor);
    const blockWarn = (message: string) => warn(`${key} ${message}`);
    const blocks = rows(section.sectionBlocks).flatMap((block) => {
      const normalised: CmsAuditBlock = {
        ...block,
        ...(block.prose
          ? { prose: { body: htmlProseToMarkdown(block.prose.body, blockWarn) } }
          : {}),
        ...(block.callout
          ? {
              callout: {
                ...block.callout,
                body: htmlProseToMarkdown(block.callout.body, blockWarn),
              },
            }
          : {}),
        table: htmlTableToMarkdown(block.table, blockWarn) ?? null,
        columns: rows(block.columns).map((column) =>
          column.body
            ? { ...column, body: { body: htmlProseToMarkdown(column.body.body, blockWarn) } }
            : column,
        ),
      };
      const mapped = mapAuditBlock(normalised, key, blockWarn);
      return mapped ? [toolBlock(mapped, blockWarn)] : [];
    });
    if (!heading && blocks.length === 0) return [];
    return [
      {
        id: anchor ?? key,
        ...(heading
          ? {
              heading: {
                text: heading,
                anchorId: anchor ?? key,
                ...(text(section.sectionNavigation)
                  ? { navigationLabel: text(section.sectionNavigation)! }
                  : {}),
              },
            }
          : {}),
        blocks,
      },
    ];
  });
  const paragraphs = [
    record.hero?.secondaryDescription,
    ...rows(record.hero?.additionalParagraphs).map((item) => item.text),
  ].flatMap((value) => (text(value) ? [text(value)!] : []));
  return {
    documentId: record.documentId,
    slug: record.slug,
    title,
    ...(text(record.publishedAt) ? { publishedAt: text(record.publishedAt)! } : {}),
    hero: {
      ...(text(record.hero?.eyebrow) ? { eyebrow: text(record.hero?.eyebrow)! } : {}),
      description: text(record.hero?.description) ?? '',
      ...(paragraphs.length > 0 ? { paragraphs } : {}),
      actions: rows(record.hero?.actions).flatMap((value) => {
        const mapped = action(value);
        return mapped ? [{ label: mapped.label, href: mapped.href }] : [];
      }),
    },
    sections,
  };
}

/* ── The record ──────────────────────────────────────────────────────────────── */

/** The published Tool for `slug`, or null when none is published under it. */
export const getPublishedTool = cache(async (slug: string): Promise<PublishedTool | null> => {
  if (!SLUG.test(slug)) return null;
  const route = toolPath(slug);
  const { tools } = await publicGraphql<{ tools: CmsTool[] }>(
    PUBLISHED_TOOL_QUERY,
    'PublishedTool',
    { slug },
  );
  const record = tools.find((entry) => entry.slug === slug);
  if (!record) return null;
  const warn = (message: string) => console.warn(`New CMS ${route}: ${message}`);
  if (text(record.routePath) !== route)
    warn(`the record reports route ${record.routePath}; serving it by slug`);

  if (record.presentation === 'sections')
    return { presentation: 'sections', slug, route, tool: sectionsTool(record, route, warn) };
  if (record.presentation !== 'article')
    warn(`presentation ${record.presentation ?? 'unset'}; rendering it as an article tool`);
  return { presentation: 'article', slug, route, ...articleTool(record, route, warn) };
});

/** Every published Tool slug, for static params. */
export const listPublishedToolSlugs = cache(async (): Promise<string[]> => {
  const { tools } = await publicGraphql<{ tools: { slug: string }[] }>(
    PUBLISHED_TOOL_SLUGS_QUERY,
    'PublishedToolSlugs',
  );
  return tools.map((tool) => tool.slug).filter((slug) => SLUG.test(slug));
});
