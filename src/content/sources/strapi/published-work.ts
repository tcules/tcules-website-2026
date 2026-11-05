import { cache } from 'react';

import { ROUTES } from '@/lib/routes';
import type { DataTableProps, LogoGridMark } from '@/patterns';
import type { WorkPageModel, WorkSection } from '@/templates/CorpusPage/published-work-model';

import { action, actionHref, icon, mapBand, mapHero, rows, text } from './home';
import type { CmsAction, CmsHero, CmsHomeSection, Entries } from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import { WORK_DETAIL_QUERY, WORK_MASTER_QUERY, SITEMAP_QUERY } from './published-work-query';
import { richTextToPlainText } from './rich-text';

type Text = string | null | undefined;
type Surface = 'paper' | 'tint' | null | undefined;

type Flow = {
  kind: string;
  prose?: { body: Text } | null;
  table?: {
    columns: Entries<{ heading: Text }>;
    rows: Entries<{ heading: Text; cells: Entries<{ body: Text }> }>;
  } | null;
};

type Custom = {
  __typename: string;
  heading?: Text;
  anchorId?: Text;
  title?: Text;
  description?: Text;
  editorialSurface?: Surface;
  comparisonSurface?: Surface;
  sheetSurface?: Surface;
  situationSurface?: Surface;
  clients?: Entries<{
    documentId: string;
    name: Text;
    density?: number | null;
    media?: StrapiUploadFile | null;
  }>;
  markOverrides?: Entries<{
    client: { documentId: string } | null;
    media: StrapiUploadFile | null;
    density?: number | null;
    width?: number | null;
    height?: number | null;
  }>;
  entries?: Entries<{ title: Text; body: Text; icon?: Text; anchorId?: Text }>;
  after?: Entries<Flow>;
  blocks?: Entries<Flow>;
  sheetPresentation?: Text;
  cards?: Entries<{ title: Text; description: Text }>;
  listEntries?: Entries<{ title?: Text; body: Text; icon?: Text }>;
  action?: CmsAction | null;
  relatedPages?: Entries<{
    resolved?: { label?: Text; href?: Text; documentId?: string } | null;
  }>;
};

export type WorkRecord = {
  routePath?: Text;
  slug?: Text;
  hero: CmsHero | null;
  content: Entries<Custom | CmsHomeSection>;
};

const surface = (value: Surface) => value ?? undefined;
const plain = (value: Text) => text(value)?.replace(/\*\*/g, '');

/**
 * One Dynamic Zone member as the band the page already renders. A member whose required words are
 * missing is left out with a warning, never filled in; a missing piece inside one (a logo, an entry,
 * a block) drops only that piece.
 */
function mapSection(
  value: Custom | CmsHomeSection,
  index: number,
  route: string,
  warn: (message: string) => void,
): WorkSection | undefined {
  const s = value as Custom;
  const key = `${s.__typename}-${index}`;
  const id = text(s.anchorId);
  const heading = text(s.__typename === 'ComponentSharedClientGrid' ? s.title : s.heading);
  const head = { key, id, heading: heading ?? '', headingId: `${id ?? key}-heading` };
  const needsHeading = () => {
    if (!heading) warn(`${key} has no heading; not shown`);
    return Boolean(heading);
  };
  const flowBlocks = (blocks: Entries<Flow>) =>
    rows(blocks).flatMap<{ html: string } | { table: DataTableProps }>((block, i) => {
      if (block.kind === 'prose') {
        const html = markdownToHtml(block.prose?.body, `${route} ${key} block ${i}`);
        if (!html) warn(`${key} prose block ${i} is empty`);
        return html ? [{ html }] : [];
      }
      if (block.kind === 'table' && block.table) {
        const [keyColumn, ...columns] = rows(block.table.columns);
        if (!keyColumn) {
          warn(`${key} table block ${i} has no columns; not shown`);
          return [];
        }
        return [
          {
            table: {
              keyColumn: { heading: text(keyColumn.heading) ?? '' },
              columns: columns.map((column) => ({ heading: text(column.heading) ?? '' })),
              rows: rows(block.table.rows).map((row) => ({
                header: plain(row.heading) ?? '',
                cellsHtml: rows(row.cells).map((cell) => markdownInlineToHtml(cell.body)),
              })),
            },
          },
        ];
      }
      warn(`${key} block ${i} (${block.kind}) is not supported here; not shown`);
      return [];
    });

  switch (s.__typename) {
    case 'ComponentSharedClientGrid': {
      if (!needsHeading()) return;
      const overrides = new Map(
        rows(s.markOverrides).flatMap((mark) =>
          mark.client ? [[mark.client.documentId, mark] as const] : [],
        ),
      );
      const marks = rows(s.clients).flatMap<LogoGridMark>((client) => {
        const name = text(client.name);
        if (!name) return [];
        const override = overrides.get(client.documentId);
        const media = mapUploadImage(override?.media ?? client.media, publicGraphqlUrl());
        if (!media) {
          warn(`${key} client "${name}" has no logo; shown by name`);
          return [{ name }];
        }
        return [
          {
            name,
            src: media.src,
            width: override?.width ?? media.width,
            height: override?.height ?? media.height,
            density: override?.density ?? client.density ?? undefined,
          },
        ];
      });
      if (!marks.length) {
        warn(`${key} has no clients; not shown`);
        return;
      }
      return { ...head, type: 'work-logos', marks };
    }

    case 'ComponentSharedIllustratedSection': {
      if (!needsHeading()) return;
      const paths = rows(s.entries).flatMap((entry, i) => {
        const title = text(entry.title);
        if (!title) {
          warn(`${key} entry ${i} has no title; not shown`);
          return [];
        }
        const glyph = icon(entry.icon);
        if (entry.icon && !glyph)
          warn(`${key} entry "${title}" has an unknown icon "${entry.icon}"`);
        const body = text(entry.body);
        return [
          {
            id: text(entry.anchorId) ?? `${key}-${i}`,
            title,
            body: body ? [body] : [],
            links: [],
            glyph,
          },
        ];
      });
      if (!paths.length) {
        warn(`${key} has no entries; not shown`);
        return;
      }
      const closing = rows(s.after)
        .flatMap((block, i) => {
          if (block.kind !== 'prose') {
            warn(`${key} closing block ${i} (${block.kind}) is not supported here; not shown`);
            return [];
          }
          return text(block.prose?.body) ?? [];
        })
        .join('\n\n');
      return {
        ...head,
        type: 'work-situations',
        surface: surface(s.situationSurface),
        lead: text(s.description),
        paths,
        closing: closing || undefined,
      };
    }

    case 'ComponentSharedEditorialSection':
    case 'ComponentSharedComparisonSection': {
      if (!needsHeading()) return;
      const blocks = flowBlocks(s.blocks);
      if (!blocks.length) {
        warn(`${key} has no content; not shown`);
        return;
      }
      return {
        ...head,
        type: 'work-flow',
        surface: surface(s.editorialSurface ?? s.comparisonSurface),
        lead: text(s.description),
        blocks,
      };
    }

    case 'ComponentSharedOfferSheetSection': {
      if (!needsHeading()) return;
      const list = s.sheetPresentation === 'split_list';
      if (s.sheetPresentation && !list && s.sheetPresentation !== 'plain')
        warn(`${key} presentation "${s.sheetPresentation}" renders as the grid`);
      // The band's one onward link: its first related How We Work page (resolved by the CMS to its
      // route), else its authored action.
      const related = rows(s.relatedPages).flatMap((page) => {
        const label = text(page.resolved?.label);
        const href = actionHref(page.resolved?.href);
        if (page.resolved && (!label || !href))
          warn(`${key} has a related page with no label or route`);
        return label && href ? [{ label, href }] : [];
      });
      const items = list
        ? rows(s.listEntries).flatMap((entry) => {
            const title = text(entry.title);
            const bodyHtml = markdownInlineToHtml(entry.body) || undefined;
            if (!title && !bodyHtml) return [];
            const glyph = icon(entry.icon);
            if (entry.icon && !glyph) warn(`${key} item has an unknown icon "${entry.icon}"`);
            return [{ title, bodyHtml, icon: glyph }];
          })
        : rows(s.cards).flatMap((card) => {
            const title = text(card.title);
            return title ? [{ title, body: text(card.description) }] : [];
          });
      if (!items.length) {
        warn(`${key} has no items; not shown`);
        return;
      }
      return {
        ...head,
        type: 'work-offer',
        surface: surface(s.sheetSurface),
        list,
        lead: text(s.description),
        action: related[0] ?? action(s.action),
        items,
      };
    }

    default: {
      // mapBand warns for a member it cannot render (no heading, unsupported type).
      const mapped = mapBand(value as CmsHomeSection, route);
      if (!mapped) return;
      if (
        mapped.type === 'testimonials' &&
        value.__typename === 'ComponentSharedTestimonialSection'
      ) {
        const ratings = new Map(
          rows(
            (
              value as Extract<
                CmsHomeSection,
                { __typename: 'ComponentSharedTestimonialSection' }
              >
            ).testimonials,
          ).map((item) => [item.documentId, item.rating]),
        );
        mapped.items = mapped.items.map((item) => ({
          ...item,
          rating: item.id ? (ratings.get(item.id) ?? undefined) : undefined,
        }));
      }
      if (mapped.type === 'engagement' && mapped.closing)
        warn(`${key} has a closing block, which this page's engagement band does not show`);
      return mapped;
    }
  }
}

export function mapWork(page: WorkRecord | null, route: string): WorkPageModel | null {
  if (!page) return null;
  const warn = (message: string) => console.warn(`New CMS ${route}: ${message}`);
  if (page.routePath && page.routePath !== route)
    throw new Error(`New CMS ${route}: entry has unexpected route ${page.routePath}`);
  const hero = mapHero(page.hero);
  if (!hero) throw new Error(`New CMS ${route}: published entry has no hero title`);
  if (!hero.media) warn('hero has no media');
  hero.stats = rows(page.hero?.stats).flatMap((stat) => {
    const label = text(stat.label);
    const value = richTextToPlainText(stat.body);
    if (!label || !value) {
      warn('a hero stat is missing its label or value; not shown');
      return [];
    }
    return [{ label, value }];
  });
  const sections = rows(page.content).flatMap(
    (value, index) => mapSection(value, index, route, warn) ?? [],
  );
  return { route, hero, sections };
}

export const getPublishedWorkMaster = cache(async () =>
  mapWork(
    (await publicGraphql<{ page: WorkRecord | null }>(WORK_MASTER_QUERY, 'PublishedWorkMaster'))
      .page,
    ROUTES.howWeWork,
  ),
);

/** A How We Work record by its URL slug, or null when the slug is malformed or unpublished. */
export const getPublishedWorkDetail = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const { pages } = await publicGraphql<{ pages: Entries<WorkRecord> }>(
    WORK_DETAIL_QUERY,
    'PublishedHowWeWorkDetail',
    { slug },
  );
  const found = rows(pages);
  if (found.length > 1)
    throw new Error(`New CMS: two How We Work entries share the slug ${slug}`);
  return mapWork(found[0] ?? null, `${ROUTES.howWeWork}/${slug}`);
});

export type SitemapEntry = {
  path: string;
  title: string;
  lastModified?: string;
  parentPath?: string;
};
export type SitemapGroup = {
  key: string;
  label: string;
  anchorId: string;
  entries: SitemapEntry[];
};

type CmsSitemapGroup = {
  key: Text;
  label: Text;
  anchorId: Text;
  entries: Entries<{ path: Text; title: Text; lastModified?: Text; parentPath?: Text }>;
};

/**
 * The Sitemap Master: its hero and the CMS's resolved groups (relations to published records and the
 * group's additional links, already merged and ordered by the CMS). Kept in the CMS's order; an entry
 * with no title or no root-relative path, and a path already listed, are left out with a warning.
 */
export const getPublishedSitemap = cache(async () => {
  const { page } = await publicGraphql<{
    page: {
      routePath?: Text;
      hero: CmsHero | null;
      resolvedGroups: Entries<CmsSitemapGroup>;
    } | null;
  }>(SITEMAP_QUERY, 'PublishedSitemap');
  if (!page) return null;
  const warn = (message: string) => console.warn(`New CMS ${ROUTES.sitemap}: ${message}`);
  if (page.routePath && page.routePath !== ROUTES.sitemap)
    throw new Error(`New CMS Sitemap Master has unexpected route: ${page.routePath}`);
  const hero = mapHero(page.hero);
  if (!hero) throw new Error('New CMS Sitemap Master is missing its hero title');
  const seen = new Set<string>();
  const groups = rows(page.resolvedGroups).flatMap<SitemapGroup>((group, index) => {
    const key = text(group.key) ?? `group-${index}`;
    const label = text(group.label);
    if (!label) {
      warn(`group ${key} has no label; not shown`);
      return [];
    }
    const entries = rows(group.entries).flatMap<SitemapEntry>((entry) => {
      const path = actionHref(entry.path);
      const title = text(entry.title);
      if (!path?.startsWith('/') || !title) {
        warn(`group ${key} has an entry with no title or route (${entry.path ?? 'none'})`);
        return [];
      }
      if (/^\/design(?:[/?#]|$)/i.test(path)) return [];
      if (seen.has(path)) {
        warn(`${path} is listed twice; kept in its first group`);
        return [];
      }
      seen.add(path);
      const lastModified = text(entry.lastModified);
      const parentPath = text(entry.parentPath);
      return [
        {
          path,
          title,
          ...(lastModified ? { lastModified } : {}),
          ...(parentPath ? { parentPath } : {}),
        },
      ];
    });
    if (!entries.length) {
      warn(`group ${key} has no pages; not shown`);
      return [];
    }
    return [{ key, label, anchorId: text(group.anchorId) ?? `sitemap-${key}`, entries }];
  });
  return { hero, groups };
});
