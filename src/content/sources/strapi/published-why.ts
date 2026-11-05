import { cache } from 'react';
import type { WhyPageModel, WhySection } from '@/templates/CorpusPage/published-why-model';
import { action, image, mapHero, mapBand } from './home';
import type { CmsHero, CmsHomeSection, CmsImage, CmsAction } from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { markdownToHtml, markdownInlineToHtml } from './markdown';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import { richTextToPlainText } from './rich-text';
import { WHY_QUERY } from './published-why-query';
type Base = {
  __typename: string;
  anchorId: string;
  heading: string;
  title?: string;
  description?: string;
  action?: CmsAction;
};
type Custom = Base & {
  clients?: { documentId: string; name: string; density: number; media?: StrapiUploadFile }[];
  markOverrides?: {
    client: { documentId: string };
    media: StrapiUploadFile;
    density: number;
    width: number;
    height: number;
  }[];
  cards?: {
    title: string;
    description: string;
    descriptionRich?: string;
    ctaText: string;
    image?: CmsImage;
    caseStudy: { documentId: string; slug: string };
  }[];
  entries?: { title: string; body: string; illustration?: { image?: CmsImage } }[];
  blocks?: {
    kind: string;
    prose?: { body: string };
    table?: {
      columns: { heading: string }[];
      rows: { heading: string; cells: { body: string }[] }[];
    };
  }[];
  sheetPresentation?: string;
  listEntries?: { title: string; body: string; icon?: string }[];
};
export type WhyRecord = { hero: CmsHero; content: (CmsHomeSection | Custom)[] };
export function mapWhy(page: WhyRecord | null): WhyPageModel | null {
  if (!page) return null;
  const hero = mapHero(page.hero);
  if (!hero) throw Error('Why Tcules hero missing');
  hero.stats = (page.hero.stats ?? [])
    .filter((stat) => stat != null)
    .map((stat) => ({ value: richTextToPlainText(stat.body), label: stat.label ?? '' }));
  const sections: WhySection[] = page.content.map((value, index) => {
    const s = value as Custom;
    const head = {
      key: s.__typename + '-' + index,
      id: s.anchorId,
      heading: s.heading,
      headingId: s.anchorId + '-heading',
    };
    switch (s.__typename) {
      case 'ComponentSharedClientGrid':
        return {
          ...head,
          heading: s.title ?? '',
          type: 'why-logos',
          marks: (s.clients ?? []).map((c) => {
            const override = s.markOverrides?.find((m) => m.client.documentId === c.documentId),
              media = mapUploadImage(override?.media ?? c.media, publicGraphqlUrl());
            if (!media) throw Error('Missing client media ' + c.name);
            return {
              name: c.name,
              src: media.src,
              width: override?.width ?? media.width,
              height: override?.height ?? media.height,
              density: override?.density ?? c.density,
            };
          }),
        };
      case 'ComponentSharedCaseStudyCards':
        return {
          ...head,
          type: 'why-cases',
          action: action(s.action),
          items: (s.cards ?? []).map((c, i) => ({
            id: String(i),
            title: c.title,
            body: c.description,
            bodyHtml: c.descriptionRich ? [markdownInlineToHtml(c.descriptionRich)] : undefined,
            media: image(c.image)
              ? { type: 'image' as const, image: image(c.image)! }
              : undefined,
            href: '/case-studies/' + c.caseStudy.slug,
            ctaLabel: c.ctaText,
          })),
        };
      case 'ComponentSharedReasonsSection':
        return {
          ...head,
          type: 'why-reasons',
          entries: (s.entries ?? []).map((e) => ({
            title: e.title,
            html: markdownInlineToHtml(e.body),
            figure: e.illustration?.image
              ? { ...image(e.illustration.image)!, alt: e.illustration.image.altText ?? '' }
              : undefined,
          })),
        };
      case 'ComponentSharedComparisonSection':
        return {
          ...head,
          type: 'why-comparison',
          lead: s.description,
          action: action(s.action),
          blocks: (s.blocks ?? []).map((b) => {
            if (b.kind === 'prose')
              return { html: markdownToHtml(b.prose?.body, 'Why comparison') };
            if (b.kind === 'table' && b.table) {
              const table = b.table;
              return {
                table: {
                  keyColumn: { heading: table.columns[0]!.heading },
                  columns: table.columns.slice(1).map((c) => ({ heading: c.heading })),
                  rows: table.rows.map((r) => ({
                    header: r.heading.replace(/\*\*/g, ''),
                    cellsHtml: r.cells.map((c) => markdownInlineToHtml(c.body)),
                    pick: r.heading.replace(/\*\*/g, '') === 'Tcules',
                  })),
                },
              };
            }
            throw Error('Unsupported Why comparison block');
          }),
        };
      case 'ComponentSharedOfferSheetSection':
        return {
          ...head,
          type: 'offer',
          presentation: 'list',
          lead: s.description,
          items: (s.listEntries ?? []).map((i) => ({
            title: i.title,
            body: i.body,
            icon: i.icon as never,
          })),
          cards: [],
          parts: [],
          before: [],
          after: [],
        };
      default: {
        const section = mapBand(value as CmsHomeSection, '/why-tcules');
        if (!section) throw Error('Unsupported Why section ' + s.__typename);
        if (
          section.type === 'testimonials' &&
          value.__typename === 'ComponentSharedTestimonialSection'
        ) {
          const ratings = new Map(
            (
              (
                value as Extract<
                  CmsHomeSection,
                  { __typename: 'ComponentSharedTestimonialSection' }
                >
              ).testimonials ?? []
            )
              .filter((item) => item != null)
              .map((item) => [item.documentId, item.rating]),
          );
          section.items = section.items.map((item) => ({
            ...item,
            rating: item.id ? (ratings.get(item.id) ?? undefined) : undefined,
          }));
        }
        return section;
      }
    }
  });
  return { hero, sections };
}
export const getPublishedWhy = cache(async () =>
  mapWhy((await publicGraphql<{ page: WhyRecord | null }>(WHY_QUERY, 'PublishedWhy')).page),
);
