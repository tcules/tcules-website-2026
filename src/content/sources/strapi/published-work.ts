import { cache } from 'react';
import type { WorkPageModel, WorkSection } from '@/templates/CorpusPage/published-work-model';
import { action, icon, mapBand, mapHero } from './home';
import type { CmsAction, CmsHero, CmsHomeSection } from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { richTextToPlainText } from './rich-text';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import { WORK_MASTER_QUERY, WORK_DETAIL_QUERY, SITEMAP_QUERY } from './published-work-query';
type Flow = {
  kind: string;
  prose?: { body: string };
  table?: {
    columns: { heading: string }[];
    rows: { heading: string; cells: { body: string }[] }[];
  };
};
type Custom = {
  __typename: string;
  heading: string;
  anchorId: string;
  title?: string;
  description?: string;
  editorialSurface?: 'paper' | 'tint';
  comparisonSurface?: 'paper' | 'tint';
  sheetSurface?: 'paper' | 'tint';
  situationSurface?: 'paper' | 'tint';
  clients?: { documentId: string; name: string; density: number; media?: StrapiUploadFile }[];
  markOverrides?: {
    client: { documentId: string };
    media: StrapiUploadFile;
    density: number;
    width: number;
    height: number;
  }[];
  entries?: { title: string; body: string; icon: string; anchorId: string }[];
  after?: Flow[];
  blocks?: Flow[];
  sheetPresentation?: string;
  cards?: { title: string; description: string }[];
  listEntries?: { title?: string; body: string; icon?: string }[];
  action?: CmsAction;
  relatedPages?: { resolved?: { label: string; href: string; documentId: string } }[];
};
export type WorkRecord = { hero: CmsHero; content: (Custom | CmsHomeSection)[]; slug?: string };
export function mapWork(page: WorkRecord | null, route: string): WorkPageModel | null {
  if (!page) return null;
  const hero = mapHero(page.hero);
  if (!hero) throw Error('Missing work hero');
  hero.stats = (page.hero.stats ?? [])
    .filter((s) => s != null)
    .map((s) => ({ label: s.label ?? '', value: richTextToPlainText(s.body) }));
  const sections: WorkSection[] = page.content.map((value, index) => {
    const s = value as Custom,
      head = {
        key: s.__typename + '-' + index,
        id: s.anchorId,
        heading: s.heading,
        headingId: s.anchorId + '-heading',
        surface:
          s.editorialSurface ?? s.comparisonSurface ?? s.sheetSurface ?? s.situationSurface,
      };
    switch (s.__typename) {
      case 'ComponentSharedClientGrid':
        return {
          ...head,
          heading: s.title ?? '',
          type: 'work-logos',
          marks: (s.clients ?? []).map((c) => {
            const override = s.markOverrides?.find((m) => m.client.documentId === c.documentId),
              media = mapUploadImage(override?.media ?? c.media, publicGraphqlUrl());
            if (!media) throw Error('Missing client ' + c.name);
            return {
              name: c.name,
              src: media.src,
              width: override?.width ?? media.width,
              height: override?.height ?? media.height,
              density: override?.density ?? c.density,
            };
          }),
        };
      case 'ComponentSharedIllustratedSection':
        return {
          ...head,
          type: 'work-situations',
          lead: s.description,
          paths: (s.entries ?? []).map((e) => ({
            id: e.anchorId,
            title: e.title,
            body: [e.body],
            links: [],
            glyph: icon(e.icon),
          })),
          closing: s.after?.map((b) => b.prose?.body).join('\n\n'),
        };
      case 'ComponentSharedEditorialSection':
      case 'ComponentSharedComparisonSection':
        return {
          ...head,
          type: 'work-flow',
          lead: s.description,
          blocks: (s.blocks ?? []).map((b) => {
            if (b.kind === 'prose')
              return { html: markdownToHtml(b.prose?.body, 'Work prose') };
            if (b.kind === 'table' && b.table) {
              const t = b.table;
              return {
                table: {
                  keyColumn: { heading: t.columns[0]!.heading },
                  columns: t.columns.slice(1).map((c) => ({ heading: c.heading })),
                  rows: t.rows.map((r) => ({
                    header: r.heading.replace(/\*\*/g, ''),
                    cellsHtml: r.cells.map((c) => markdownInlineToHtml(c.body)),
                  })),
                },
              };
            }
            throw Error('Unsupported flow block');
          }),
        };
      case 'ComponentSharedOfferSheetSection': {
        const list = s.sheetPresentation === 'split_list';
        const link = s.relatedPages?.[0]?.resolved ?? action(s.action);
        return {
          ...head,
          type: 'work-offer',
          list,
          lead: s.description,
          action: link,
          items: list
            ? (s.listEntries ?? []).map((i) => ({
                title: i.title,
                bodyHtml: markdownInlineToHtml(i.body),
                icon: icon(i.icon),
              }))
            : (s.cards ?? []).map((i) => ({ title: i.title, body: i.description })),
        };
      }
      default: {
        const mapped = mapBand(value as CmsHomeSection, route);
        if (!mapped) throw Error('Unsupported Work section ' + s.__typename);
        if (mapped.type === 'testimonials') {
          const raw = value as Extract<
            CmsHomeSection,
            { __typename: 'ComponentSharedTestimonialSection' }
          >;
          const ratings = new Map(
            (raw.testimonials ?? [])
              .filter((i) => i != null)
              .map((i) => [i.documentId, i.rating]),
          );
          mapped.items = mapped.items.map((i) => ({
            ...i,
            rating: i.id ? (ratings.get(i.id) ?? undefined) : undefined,
          }));
        }
        return mapped;
      }
    }
  });
  return { route, hero, sections };
}
export const getPublishedWorkMaster = cache(async () =>
  mapWork(
    (await publicGraphql<{ page: WorkRecord | null }>(WORK_MASTER_QUERY, 'PublishedWorkMaster'))
      .page,
    '/how-we-work',
  ),
);
export const getPublishedWorkDetail = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const { pages } = await publicGraphql<{ pages: WorkRecord[] }>(
    WORK_DETAIL_QUERY,
    'PublishedHowWeWorkDetail',
    { slug },
  );
  if (pages.length > 1) throw Error('Duplicate work slug');
  return mapWork(pages[0] ?? null, '/how-we-work/' + slug);
});
export type SitemapGroup = {
  key: string;
  label: string;
  anchorId: string;
  entries: { path: string; title: string; lastModified?: string; parentPath?: string }[];
};
export const getPublishedSitemap = cache(async () => {
  const { page } = await publicGraphql<{
    page: { hero: CmsHero; resolvedGroups: SitemapGroup[] } | null;
  }>(SITEMAP_QUERY, 'PublishedSitemap');
  if (!page) return null;
  const hero = mapHero(page.hero);
  if (!hero) throw Error('Missing sitemap hero');
  return { hero, groups: page.resolvedGroups };
});
