import { cache } from 'react';

import { caseStudyPath, ROUTES } from '@/lib/routes';
import type { DataTableProps, LogoGridMark } from '@/patterns';
import type { WhyPageModel, WhySection } from '@/templates/CorpusPage/published-why-model';

import { action, icon, image, mapBand, mapHero, rows, text } from './home';
import type { CmsAction, CmsHero, CmsHomeSection, CmsImage, Entries } from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { WHY_QUERY } from './published-why-query';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import { richTextToPlainText } from './rich-text';

type Text = string | null | undefined;
type Surface = 'paper' | 'tint' | null | undefined;

type Custom = {
  __typename: string;
  anchorId?: Text;
  heading?: Text;
  title?: Text;
  description?: Text;
  action?: CmsAction | null;
  whyGridSurface?: Surface;
  whyCasesSurface?: Surface;
  reasonsSurface?: Surface;
  comparisonSurface?: Surface;
  sheetSurface?: Surface;
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
  cards?: Entries<{
    title: Text;
    description: Text;
    descriptionRich?: Text;
    showCta?: boolean | null;
    ctaText: Text;
    image?: CmsImage | null;
    caseStudy: {
      documentId: string;
      title?: Text;
      slug: Text;
      thumbnail?: { image?: CmsImage | null } | null;
    } | null;
  }>;
  entries?: Entries<{
    title: Text;
    body: Text;
    illustration?: { source?: Text; scene?: Text; image?: CmsImage | null } | null;
  }>;
  blocks?: Entries<{
    kind: string;
    prose?: { body: Text } | null;
    table?: {
      columns: Entries<{ heading: Text }>;
      rows: Entries<{ heading: Text; cells: Entries<{ body: Text }> }>;
    } | null;
  }>;
  sheetPresentation?: Text;
  listEntries?: Entries<{ title: Text; body: Text; icon?: Text }>;
};

export type WhyRecord = {
  routePath?: Text;
  hero: CmsHero | null;
  content: Entries<CmsHomeSection | Custom>;
};

function warn(message: string) {
  console.warn(`New CMS ${ROUTES.whyTcules}: ${message}`);
}

const surface = (value: Surface) => value ?? undefined;
const plain = (value: Text) => text(value)?.replace(/\*\*/g, '');

/**
 * One Dynamic Zone member as the band the page already renders. A member whose required words are
 * missing is left out with a warning, never filled in; a missing piece inside one (a logo, a card,
 * a block) drops only that piece.
 */
function mapSection(value: CmsHomeSection | Custom, index: number): WhySection | undefined {
  const s = value as Custom;
  const key = `${s.__typename}-${index}`;
  const id = text(s.anchorId);
  const heading = text(s.__typename === 'ComponentSharedClientGrid' ? s.title : s.heading);
  const head = { key, id, heading: heading ?? '', headingId: `${id ?? key}-heading` };
  const needsHeading = () => {
    if (!heading) warn(`${key} has no heading; not shown`);
    return Boolean(heading);
  };

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
      return { ...head, type: 'why-logos', surface: surface(s.whyGridSurface), marks };
    }

    case 'ComponentSharedCaseStudyCards': {
      if (!needsHeading()) return;
      const items = rows(s.cards).flatMap((card, i) => {
        const related = card.caseStudy;
        const slug = text(related?.slug);
        const title = text(card.title) ?? text(related?.title);
        if (!slug || !title) {
          warn(`${key} card ${i} has no published Case Study relation or title; not shown`);
          return [];
        }
        // The card's own image, else the related case study's thumbnail (both CMS relationships).
        const picture = image(card.image) ?? image(related?.thumbnail?.image);
        if (!picture) warn(`${key} card "${title}" has no image`);
        const bodyHtml = markdownInlineToHtml(card.descriptionRich);
        return [
          {
            id: related?.documentId ?? String(i),
            title,
            body: text(card.description),
            bodyHtml: bodyHtml ? [bodyHtml] : undefined,
            media: picture ? { type: 'image' as const, image: picture } : undefined,
            href: caseStudyPath(slug),
            ctaLabel: card.showCta === false ? undefined : text(card.ctaText),
          },
        ];
      });
      if (!items.length) {
        warn(`${key} has no cards; not shown`);
        return;
      }
      return {
        ...head,
        type: 'why-cases',
        surface: surface(s.whyCasesSurface),
        action: action(s.action),
        items,
      };
    }

    case 'ComponentSharedReasonsSection': {
      if (!needsHeading()) return;
      const entries = rows(s.entries).flatMap((entry) => {
        const title = text(entry.title);
        if (!title) {
          warn(`${key} has a reason with no title; not shown`);
          return [];
        }
        const art = entry.illustration?.image;
        const figure = image(art);
        if (!figure)
          warn(
            `${key} reason "${title}" has no CMS illustration; the frontend's drawing stands in`,
          );
        return [
          {
            title,
            html: markdownInlineToHtml(entry.body),
            figure: figure ? { ...figure, alt: text(art?.altText) ?? '' } : undefined,
          },
        ];
      });
      if (!entries.length) {
        warn(`${key} has no reasons; not shown`);
        return;
      }
      return { ...head, type: 'why-reasons', surface: surface(s.reasonsSurface), entries };
    }

    case 'ComponentSharedComparisonSection': {
      if (!needsHeading()) return;
      const blocks = rows(s.blocks).flatMap<{ html: string } | { table: DataTableProps }>(
        (block, i) => {
          if (block.kind === 'prose') {
            const html = markdownToHtml(block.prose?.body, `${key} block ${i}`);
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
                    pick: plain(row.heading) === 'Tcules',
                  })),
                },
              },
            ];
          }
          warn(`${key} block ${i} (${block.kind}) is not supported here; not shown`);
          return [];
        },
      );
      return {
        ...head,
        type: 'why-comparison',
        surface: surface(s.comparisonSurface),
        lead: text(s.description),
        action: action(s.action),
        blocks,
      };
    }

    case 'ComponentSharedOfferSheetSection': {
      if (!needsHeading()) return;
      if (s.sheetPresentation && s.sheetPresentation !== 'split_list')
        warn(`${key} presentation "${s.sheetPresentation}" renders as the list`);
      const items = rows(s.listEntries).flatMap((entry) => {
        const title = text(entry.title);
        if (!title) return [];
        const glyph = icon(entry.icon);
        if (entry.icon && !glyph)
          warn(`${key} item "${title}" has an unknown icon "${entry.icon}"`);
        return [{ title, body: text(entry.body), icon: glyph }];
      });
      if (!items.length) {
        warn(`${key} has no items; not shown`);
        return;
      }
      return {
        ...head,
        type: 'offer',
        surface: surface(s.sheetSurface),
        presentation: 'list',
        lead: text(s.description),
        items,
        cards: [],
        parts: [],
        before: [],
        after: [],
      };
    }

    default: {
      const section = mapBand(value as CmsHomeSection, ROUTES.whyTcules);
      // mapBand warns for a member it cannot render (no heading, unsupported type).
      if (!section) return;
      if (
        section.type === 'testimonials' &&
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
        section.items = section.items.map((item) => ({
          ...item,
          rating: item.id ? (ratings.get(item.id) ?? undefined) : undefined,
        }));
      }
      return section;
    }
  }
}

export function mapWhy(page: WhyRecord | null): WhyPageModel | null {
  if (!page) return null;
  if (page.routePath && page.routePath !== ROUTES.whyTcules)
    throw new Error(`New CMS Why Tcules has unexpected route: ${page.routePath}`);
  const hero = mapHero(page.hero);
  if (!hero) throw new Error('New CMS Why Tcules is missing its hero title');
  if (!hero.media) warn('hero has no media');
  hero.stats = rows(page.hero?.stats).flatMap((stat) => {
    const label = text(stat.label);
    const value = richTextToPlainText(stat.body);
    if (!label || !value) {
      warn('a hero stat is missing its label or value; not shown');
      return [];
    }
    return [{ value, label }];
  });
  const sections = rows(page.content).flatMap((value, index) => mapSection(value, index) ?? []);
  return { hero, sections };
}

export const getPublishedWhy = cache(async () => {
  const { page } = await publicGraphql<{ page: WhyRecord | null }>(
    WHY_QUERY,
    'PublishedWhy',
    undefined,
    { optionalImagePaths: ['page.content.*.cards.*.image.file'] },
  );
  return mapWhy(page);
});
