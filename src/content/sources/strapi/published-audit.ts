import { cache } from 'react';

import type { CorpusBlock } from '@/lib/corpus-types';
import { auditPath } from '@/lib/routes';
import type {
  AuditAction,
  AuditBlock,
  AuditContentColumn,
  AuditLabelledItem,
  AuditTable,
  PublishedAuditPage,
  PublishedAuditSection,
} from '@/templates/CorpusPage/published-audit-model';

import { parseBlocks, slugify } from '../corpus/parse-body';
import { parseInline } from '../corpus/parse-inline';
import { action, actionHref, mapHero, rows, text } from './home';
import type { CmsAction, CmsHero, CmsIllustration, Entries } from './home-types';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { PUBLISHED_AUDIT_QUERY, PUBLISHED_AUDIT_SLUGS_QUERY } from './published-audit-query';
import { mapSharedSection, type CmsSharedSection } from './published-service';
import { publicGraphql } from './public-graphql';
import { escapeHtml, richTextToPlainText } from './rich-text';

type Text = string | null | undefined;

type CmsTable = {
  caption: Text;
  columns: Entries<{ heading: Text }>;
  rows: Entries<{ heading: Text; cells: Entries<{ body: Text }> }>;
};

/** A Service Card tile as the Audit zone selects it: it may name an Audit instead of a Service. */
type CmsAuditTile = {
  id: string;
  title: Text;
  description: Text;
  href: Text;
  illustration: CmsIllustration | null;
  service: { slug: Text } | null;
  audit: { slug: Text } | null;
};

type CmsServiceCard = Extract<CmsSharedSection, { __typename: 'ComponentSharedServiceCard' }>;
type CmsAuditServiceCard = Omit<CmsServiceCard, 'singleGridContent' | 'twoGridContent'> & {
  singleGridContent: Entries<CmsAuditTile>;
  twoGridContent: Entries<{
    id: string;
    ctaText: Text;
    detail: { label: Text; body: Text } | null;
    content: CmsAuditTile | null;
  }>;
};

type CmsWorkedReport = {
  __typename: 'ComponentSharedWorkedReportSection';
  id: string;
  heading: Text;
  anchorId: Text;
  eyebrow: Text;
  reportSurface: 'paper' | 'tint' | null;
  scenario: Text;
  interpretation: Text;
  reportTable: CmsTable | null;
  reportAction: CmsAction | null;
};

export type CmsAuditBlock = {
  id: string;
  kind: string | null;
  heading: Text;
  description: Text;
  gridColumns: number | null;
  displayStyle: Text;
  prose: { body: Text } | null;
  callout: { label: Text; body: Text; icon: Text } | null;
  cards: Entries<{ id: string; title: Text; description: Text; href: Text }>;
  items: Entries<{ id: string; title: Text; body: Text }>;
  columns: Entries<{
    id: string;
    eyebrow: Text;
    heading: Text;
    body: { body: Text } | null;
    items: Entries<{ id: string; title: Text; body: Text }>;
    links: Entries<CmsAction>;
  }>;
  table: CmsTable | null;
  quote: { id: string; quote: Text; attribution: Text; kind: Text } | null;
  links: Entries<CmsAction>;
};

type CmsAuditSection = {
  __typename: 'ComponentAuditSection';
  id: string;
  heading: Text;
  anchorId: Text;
  blocks: Entries<CmsAuditBlock>;
};

type CmsAuditZoneSection =
  | Exclude<CmsSharedSection, { __typename: 'ComponentSharedServiceCard' }>
  | CmsAuditServiceCard
  | CmsWorkedReport
  | CmsAuditSection
  /* A member this query does not select (or Strapi's `Error` for a broken entry) arrives bare. */
  | { __typename: string; id?: string };

type CmsAudit = {
  documentId: string;
  name: Text;
  slug: string;
  routePath: string;
  hero: CmsHero | null;
  content: Entries<CmsAuditZoneSection>;
};

/* ── Shared sections ─────────────────────────────────────────────────────────── */

/**
 * A tile's destination: its own href, else the Service or Audit it selects. The tile is handed on with
 * that href set, so the shared Service Card mapping resolves an Audit relation the same way it
 * resolves a Service relation.
 */
function withResolvedHref(tile: CmsAuditTile): CmsAuditTile {
  if (actionHref(tile.href)) return tile;
  const slug = text(tile.audit?.slug);
  return slug ? { ...tile, href: auditPath(slug) } : tile;
}

function serviceCard(section: CmsAuditServiceCard): CmsServiceCard {
  return {
    ...section,
    singleGridContent: rows(section.singleGridContent).map(withResolvedHref),
    twoGridContent: rows(section.twoGridContent).map((split) => ({
      ...split,
      content: split.content ? withResolvedHref(split.content) : null,
    })),
  } as CmsServiceCard;
}

/* ── Worked Report → the corpus band ReportBand reads ────────────────────────── */

function tableBlock(value: CmsTable | null | undefined): CorpusBlock | undefined {
  const columns = rows(value?.columns);
  if (columns.length < 2) return undefined;
  const sheetRows = rows(value?.rows).map((row) => {
    const cells = rows(row.cells);
    return [
      parseInline(text(row.heading) ?? ''),
      ...columns.slice(1).map((_, index) => parseInline(text(cells[index]?.body) ?? '')),
    ];
  });
  if (sheetRows.length === 0) return undefined;
  return {
    type: 'table',
    header: columns.map((column) => parseInline(text(column.heading) ?? '')),
    rows: sheetRows,
  };
}

/**
 * The scenario, the sheet, then the interpretation, with the section's action closing it as a link run
 * — the exact band the corpus authored, so ReportBand lifts a case link to the heading's end and keeps
 * any other link in the reading, as it always has.
 */
function mapWorkedReport(
  section: CmsWorkedReport,
  warn: (message: string) => void,
): PublishedAuditSection | undefined {
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  if (!heading) {
    warn(`${key} has no heading`);
    return undefined;
  }
  const sheet = tableBlock(section.reportTable);
  if (!sheet) {
    warn(`${key} has no table with at least two columns and one row`);
    return undefined;
  }
  const link = action(section.reportAction);
  const interpretation = [
    text(section.interpretation),
    link ? `[${link.label.replace(/[[\]]/g, '\\$&')}](${link.href})` : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  const anchor = text(section.anchorId);
  return {
    key,
    type: 'report',
    surface: section.reportSurface ?? 'tint',
    eyebrow: text(section.eyebrow),
    band: {
      id: anchor ?? slugify(heading),
      anchored: Boolean(anchor),
      heading: parseInline(heading),
      headingText: heading,
      blocks: [
        ...parseBlocks(text(section.scenario) ?? ''),
        sheet,
        ...parseBlocks(interpretation),
      ],
    },
  };
}

/* ── Audit Section → the audit block model ───────────────────────────────────── */

function markdownHtml(value: Text, context: string, warn: (message: string) => void): string {
  try {
    return markdownToHtml(value, context);
  } catch {
    warn(`unsupported embedded content in ${context}`);
    return markdownInlineToHtml(value);
  }
}

function auditAction(value: CmsAction | null | undefined): AuditAction | undefined {
  const mapped = action(value);
  return mapped
    ? { label: mapped.label, href: mapped.href, external: value?.isExternal === true }
    : undefined;
}

function labelledItems(values: Entries<{ title: Text; body: Text }>): AuditLabelledItem[] {
  return rows(values).flatMap((item) => {
    const title = text(item.title);
    return title ? [{ title, body: text(item.body) ?? '' }] : [];
  });
}

function auditTable(value: CmsTable | null | undefined): AuditTable | undefined {
  const columns = rows(value?.columns).map((column) => text(column.heading) ?? '');
  if (columns.length < 2) return undefined;
  const tableRows = rows(value?.rows).flatMap((row) => {
    const header = richTextToPlainText(row.heading).trim();
    const cells = rows(row.cells);
    const cellsHtml = columns
      .slice(1)
      .map((_, index) => markdownInlineToHtml(cells[index]?.body));
    return header || cellsHtml.some(Boolean) ? [{ header, cellsHtml }] : [];
  });
  if (tableRows.length === 0) return undefined;
  const caption = text(value?.caption);
  return {
    ...(caption ? { caption } : {}),
    keyColumn: { heading: columns[0] ?? '' },
    columns: columns.slice(1).map((heading) => ({ heading })),
    rows: tableRows,
  };
}

const GRID_COLUMNS = [1, 2, 3, 4] as const;

export function mapAuditBlock(
  block: CmsAuditBlock,
  key: string,
  warn: (message: string) => void,
): AuditBlock | undefined {
  const id = `${key}-block-${block.id}`;
  const skip = (reason: string) => {
    warn(`${id} (${block.kind ?? 'no kind'}) ${reason}; not shown`);
    return undefined;
  };

  switch (block.kind) {
    case 'rich_text': {
      const html = markdownHtml(block.prose?.body, `${id} prose`, warn);
      return html ? { id, type: 'rich-text', html } : skip('has no prose');
    }
    case 'card_grid':
    case 'comparison_cards': {
      const cards = rows(block.cards).flatMap((card) => {
        const title = text(card.title);
        if (!title) return [];
        const href = actionHref(card.href);
        return [{ title, body: text(card.description) ?? '', ...(href ? { href } : {}) }];
      });
      if (cards.length === 0) return skip('has no titled cards');
      if (block.kind === 'comparison_cards') return { id, type: 'comparison-cards', cards };
      const columns = GRID_COLUMNS.find((count) => count === block.gridColumns) ?? 2;
      return { id, type: 'card-grid', columns, cards };
    }
    case 'table': {
      const table = auditTable(block.table);
      return table ? { id, type: 'table', table } : skip('has no table rows');
    }
    case 'quote': {
      const words = text(block.quote?.quote);
      const name = text(block.quote?.attribution);
      if (!words || !name) return skip('has no quote or no named attribution');
      return {
        id,
        type: 'quote',
        quote: { quoteHtml: `<p>${escapeHtml(words)}</p>`, name, company: '' },
      };
    }
    case 'callout': {
      const label = text(block.callout?.label);
      const body = markdownHtml(block.callout?.body, `${id} callout`, warn);
      const html = `${label ? `<p><strong>${escapeHtml(label)}</strong></p>` : ''}${body}`;
      return body || label ? { id, type: 'callout', html } : skip('has no callout body');
    }
    case 'labelled_list': {
      const items = labelledItems(block.items);
      return items.length > 0
        ? {
            id,
            type: 'labelled-list',
            displayStyle: (text(block.displayStyle) ?? 'plain').toLowerCase(),
            items,
          }
        : skip('has no titled items');
    }
    case 'two_column': {
      const [left, right] = rows(block.columns).flatMap<AuditContentColumn>((column) => {
        const heading = text(column.heading);
        if (!heading) return [];
        return [
          {
            id: `${id}-column-${column.id}`,
            eyebrow: text(column.eyebrow),
            heading,
            bodyHtml: markdownHtml(column.body?.body, `${id} column ${column.id}`, warn),
            items: labelledItems(column.items),
            links: rows(column.links).flatMap((link) => auditAction(link) ?? []),
          },
        ];
      });
      if (rows(block.columns).length > 2)
        warn(`${id} has more than two columns; the first two show`);
      return left || right
        ? { id, type: 'two-column', ...(left ? { left } : {}), ...(right ? { right } : {}) }
        : skip('has no headed columns');
    }
    case 'link_group': {
      const heading = text(block.heading);
      const links = rows(block.links).flatMap((link) => {
        const mapped = auditAction(link);
        return mapped
          ? [
              {
                title: mapped.label,
                body: text(link.description) ?? '',
                href: mapped.href,
                ...(mapped.external ? { external: true } : {}),
              },
            ]
          : [];
      });
      if (!heading || links.length === 0) return skip('has no heading or no valid links');
      const description = text(block.description);
      return {
        id,
        type: 'link-group',
        heading,
        ...(description ? { description } : {}),
        links,
      };
    }
    default:
      return skip('is a kind this page cannot render');
  }
}

function mapAuditSection(
  section: CmsAuditSection,
  warn: (message: string) => void,
): PublishedAuditSection | undefined {
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  if (!heading) {
    warn(`${key} has no heading`);
    return undefined;
  }
  const id = text(section.anchorId);
  const blocks = rows(section.blocks).flatMap((block) => mapAuditBlock(block, key, warn) ?? []);
  return {
    key,
    id,
    heading,
    headingId: `${id ?? key}-heading`,
    type: 'audit-section',
    blocks,
  };
}

/* ── The page ────────────────────────────────────────────────────────────────── */

function mapSection(
  section: CmsAuditZoneSection,
  route: string,
): PublishedAuditSection | undefined {
  const warn = (message: string) => console.warn(`New CMS ${route}: ${message}`);
  switch (section.__typename) {
    case 'ComponentSharedWorkedReportSection':
      return mapWorkedReport(section as CmsWorkedReport, warn);
    case 'ComponentAuditSection':
      return mapAuditSection(section as CmsAuditSection, warn);
    case 'ComponentSharedServiceCard':
      return mapSharedSection(serviceCard(section as CmsAuditServiceCard), route);
    case 'ComponentSharedStageSection':
    case 'ComponentSharedOfferSheetSection':
    case 'ComponentSharedWhySection':
    case 'ComponentSharedCaseStudyCards':
    case 'ComponentSharedTestimonialSection':
    case 'ComponentSharedFaqSection':
    case 'ComponentSharedCta':
      return mapSharedSection(section as CmsSharedSection, route);
    default:
      warn(`${section.__typename} ${section.id ?? ''} is not a section this page can render`);
      return undefined;
  }
}

/** One segment below /audits, as the CMS's uid field allows it. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/**
 * One published Audit by slug, or null when no published entry has it (a draft or a missing record is
 * a 404). A CMS failure throws, so the route's error boundary answers rather than a 404.
 */
export const getPublishedAudit = cache(
  async (slug: string): Promise<PublishedAuditPage | null> => {
    if (!SLUG.test(slug)) return null;
    const route = auditPath(slug);
    const { audits } = await publicGraphql<{ audits: CmsAudit[] }>(
      PUBLISHED_AUDIT_QUERY,
      'PublishedAudit',
      { slug },
      { optionalImagePaths: ['audits.*.hero.media.file'] },
    );
    const audit = audits.find((entry) => entry.slug === slug);
    if (!audit) return null;
    if (audit.routePath !== route) {
      throw new Error(`New CMS ${route}: published entry reports route ${audit.routePath}`);
    }
    const hero = mapHero(audit.hero);
    if (!hero) throw new Error(`New CMS ${route}: published entry has no hero title`);
    return {
      slug,
      route,
      name: text(audit.name) ?? hero.title,
      hero,
      sections: rows(audit.content).flatMap((section) => mapSection(section, route) ?? []),
    };
  },
);

/** Every published Audit slug. */
export const listPublishedAuditSlugs = cache(async (): Promise<string[]> => {
  const { audits } = await publicGraphql<{ audits: { slug: string }[] }>(
    PUBLISHED_AUDIT_SLUGS_QUERY,
    'PublishedAuditSlugs',
  );
  return audits.map(({ slug }) => slug).filter((slug) => SLUG.test(slug));
});
