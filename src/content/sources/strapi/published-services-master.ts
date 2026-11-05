import { cache } from 'react';
import type { LogoGridMark } from '@/patterns';

import { placeholderIllustration } from '@/lib/placeholders';
import { ROUTES, servicePath } from '@/lib/routes';
import { sketchForRoute } from '@/lib/sketches';
import type {
  ServicesMasterPage,
  ServicesMasterSection,
} from '@/templates/CorpusPage/published-services-master-model';

import { action, actionHref, illustration, mapBand, mapHero, rows, text } from './home';
import type {
  CmsAction,
  CmsHero,
  CmsHomeSection,
  CmsIllustration,
  Entries,
} from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { PUBLISHED_SERVICES_MASTER_QUERY } from './published-services-master-query';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';

type Text = string | null | undefined;
type Surface = 'paper' | 'tint' | null;
type Head = { id: string; anchorId: Text; heading?: Text; description?: Text };
type Tile = {
  id: string;
  title: Text;
  description: Text;
  href: Text;
  supportingCopy: Text;
  ctaText: Text;
  illustration?: CmsIllustration | null;
  detail?: { label: Text; body: Text } | null;
  service?: {
    documentId: string;
    name: Text;
    slug: Text;
    hero?: { title: Text; description: Text } | null;
  } | null;
};
type Flow = { id: string; kind: string; prose?: { body: Text } | null };
type CustomSection = Head &
  (
    | {
        __typename: 'ComponentSharedClientGrid';
        title: Text;
        clientSurface: Surface;
        gridDensity: Text;
        clients: Entries<{
          documentId: string;
          name: Text;
          density?: number | null;
          media?: StrapiUploadFile | null;
        }>;
        namedClients: Entries<{ documentId: string; name: Text }>;
        markOverrides: NonNullable<CmsHero['recognition']>['markOverrides'];
      }
    | {
        __typename: 'ComponentSharedServiceCard';
        serviceSurface: Surface;
        variant: Text;
        columns?: number | null;
        singleGridPresentation: Text;
        singleGridContent: Entries<Tile>;
        twoGridContent: Entries<{
          id: string;
          content?: Tile | null;
          ctaText: Text;
          detail?: Tile['detail'];
        }>;
        before: Entries<Flow>;
        after: Entries<Flow>;
        closingRoutes: Entries<{
          id: string;
          question: Text;
          answer: Text;
          actions: Entries<CmsAction>;
        }>;
      }
    | {
        __typename: 'ComponentSharedWhySection';
        whySurface: Surface;
        cta?: CmsAction | null;
        whyCards: Entries<{
          id: string;
          variant: Text;
          title: Text;
          points: Entries<{ text: Text }>;
          illustration?: StrapiUploadFile | null;
          media?: StrapiUploadFile | null;
        }>;
      }
  );

function warn(message: string) {
  console.warn(`New CMS /services: ${message}`);
}

function flow(entries: Entries<Flow>) {
  return rows(entries).flatMap((block) => {
    if (block.kind !== 'prose') {
      warn(`unsupported ${block.kind} flow block ${block.id}`);
      return [];
    }
    return markdownToHtml(block.prose?.body, `services flow ${block.id}`) || [];
  });
}

function mapSection(
  section: CustomSection | CmsHomeSection,
): ServicesMasterSection | undefined {
  const key = `${section.__typename}-${section.id}`;
  const id = text(section.anchorId);
  const heading = text(
    section.__typename === 'ComponentSharedClientGrid' ? section.title : section.heading,
  );
  if (!heading) {
    warn(`${key} has no heading or supported component mapping`);
    return;
  }
  const head = { key, id, heading, headingId: `${id ?? key}-heading` };
  switch (section.__typename) {
    case 'ComponentSharedClientGrid': {
      const overrides = new Map(
        rows(section.markOverrides).map((mark) => [mark.client?.documentId, mark]),
      );
      return {
        ...head,
        type: 'clients',
        surface: section.clientSurface ?? undefined,
        compact: section.gridDensity === 'compact',
        names: rows(section.namedClients).flatMap((client) => text(client.name) ?? []),
        marks: rows(section.clients).flatMap<LogoGridMark>((client) => {
          const name = text(client.name);
          if (!name) return [];
          const override = overrides.get(client.documentId);
          const image = mapUploadImage(override?.media ?? client.media, publicGraphqlUrl());
          if (!image) warn(`client ${client.documentId} has no logo`);
          return image
            ? [
                {
                  name,
                  src: image.src,
                  width: override?.width ?? image.width,
                  height: override?.height ?? image.height,
                  density: override?.density ?? client.density ?? undefined,
                },
              ]
            : [{ name }];
        }),
      };
    }
    case 'ComponentSharedServiceCard': {
      const split = section.variant === 'two_grid_content';
      if (!split && section.variant !== 'single_grid_content') {
        warn(`${key} uses unsupported variant ${section.variant}`);
        return;
      }
      if (section.singleGridPresentation)
        warn(`${key} uses unmapped single grid presentation ${section.singleGridPresentation}`);
      const tiles = split
        ? rows(section.twoGridContent).flatMap((tile) =>
            tile.content
              ? [{ ...tile.content, id: tile.id, detail: tile.detail, ctaText: tile.ctaText }]
              : [],
          )
        : rows(section.singleGridContent);
      return {
        ...head,
        type: 'services',
        surface: section.serviceSurface ?? undefined,
        lead: text(section.description),
        tracks: section.columns === 2 || section.columns === 3 ? section.columns : 4,
        before: flow(section.before),
        after: flow(section.after),
        cta: section.closingRoutes?.length
          ? {
              routes: rows(section.closingRoutes).map((route) => ({
                question: text(route.question),
                answer: text(route.answer),
                actions: rows(route.actions).flatMap((value) => action(value) ?? []),
              })),
            }
          : undefined,
        items: tiles.flatMap((tile) => {
          const related = tile.service;
          const title = text(related?.name) ?? text(tile.title);
          if (!title) {
            warn(`tile ${tile.id} is missing a title and published Service relationship`);
            return [];
          }
          const relationshipHref = related?.slug ? servicePath(related.slug) : undefined;
          const authoredHref = actionHref(tile.href);
          if (relationshipHref && authoredHref && authoredHref !== relationshipHref)
            warn(`tile ${tile.id} href disagrees with its Service slug`);
          const href = relationshipHref ?? authoredHref;
          if (!related && href?.startsWith('/services/')) {
            warn(`tile ${tile.id} is missing its published Service relationship`);
            return [];
          }
          if (!href) warn(`tile ${tile.id} has no valid link`);
          const art = illustration(tile.illustration);
          const detailLabel = text(tile.detail?.label);
          const detailText = text(tile.detail?.body);
          if (split && (!detailLabel || !detailText))
            warn(`tile ${tile.id} has incomplete detail copy`);
          return [
            {
              id: tile.id,
              title,
              href,
              body: text(tile.description) ?? text(related?.hero?.description),
              supportingCopy: text(tile.supportingCopy),
              action: text(tile.ctaText),
              detail:
                detailLabel && detailText
                  ? { label: detailLabel, text: detailText, action: text(tile.ctaText) }
                  : undefined,
              scene: art?.scene ?? (!art?.image && href ? sketchForRoute(href) : undefined),
              image: art?.image,
            },
          ];
        }),
      };
    }
    case 'ComponentSharedWhySection':
      return {
        ...head,
        type: 'why',
        surface: section.whySurface ?? undefined,
        action: action(section.cta),
        items: rows(section.whyCards).flatMap((card) => {
          const title = text(card.title);
          if (!title) return [];
          const upload = card.variant === 'illustration' ? card.illustration : card.media;
          const image =
            mapUploadImage(upload, publicGraphqlUrl()) ??
            (card.variant === 'illustration' ? placeholderIllustration(title) : undefined);
          return [
            {
              id: card.id,
              title: title.replace(/\.$/, ''),
              body:
                rows(card.points)
                  .flatMap((point) => text(point.text) ?? [])
                  .join(' ') || undefined,
              image: image
                ? {
                    ...image,
                    kind: card.variant === 'illustration' ? 'illustration' : 'photograph',
                  }
                : undefined,
            },
          ];
        }),
      };
    default: {
      const mapped = mapBand(section, ROUTES.services);
      if (mapped?.type === 'cases') {
        return {
          ...mapped,
          cards: mapped.cards.map((card) => ({
            ...card,
            bodyHtml: card.bodyHtml ? markdownInlineToHtml(card.body) : undefined,
          })),
        };
      }
      if (mapped?.type === 'cta' && mapped.variant === 'form') {
        // Services uses the existing split blue enquiry island when no layout override is authored.
        return {
          ...mapped,
          presentation: mapped.presentation ?? 'form_island',
          island: mapped.island ?? 'blue',
        };
      }
      return mapped;
    }
  }
}

export const getPublishedServicesMaster = cache(
  async (): Promise<ServicesMasterPage | null> => {
    const { serviceMaster } = await publicGraphql<{
      serviceMaster: {
        routePath: string;
        hero: CmsHero | null;
        content: Entries<CustomSection | CmsHomeSection>;
      } | null;
    }>(PUBLISHED_SERVICES_MASTER_QUERY, 'PublishedServicesMaster');
    if (!serviceMaster) return null;
    if (serviceMaster.routePath !== ROUTES.services)
      throw new Error(`Unexpected Services Master path ${serviceMaster.routePath}`);
    const hero = mapHero(serviceMaster.hero);
    if (!hero) throw new Error('New CMS /services: missing hero title');
    const sections = rows(serviceMaster.content).flatMap(
      (section) => mapSection(section) ?? [],
    );
    // CSS masks need CORS. Embed CMS logos so the existing styling works with this upload host.
    for (const section of sections) {
      if (section.type !== 'clients') continue;
      section.marks = (
        await Promise.all(
          section.marks.map(async (mark) => {
            if (!mark.src) return mark;
            try {
              const response = await fetch(mark.src, {
                cache: 'no-store',
                signal: AbortSignal.timeout(8_000),
              });
              const mime = response.headers.get('content-type')?.split(';')[0];
              if (!response.ok || !mime?.startsWith('image/'))
                throw new Error('invalid image response');
              const bytes = await response.arrayBuffer();
              if (bytes.byteLength > 3_000_000) throw new Error('logo exceeds 3 MB');
              return {
                ...mark,
                src: `data:${mime};base64,${Buffer.from(bytes).toString('base64')}`,
              };
            } catch {
              warn(`could not load CMS logo for ${mark.name}`);
              return undefined;
            }
          }),
        )
      ).filter((mark): mark is LogoGridMark => mark !== undefined);
    }
    return { hero, sections };
  },
);
