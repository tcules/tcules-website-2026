import { cache } from 'react';

import { isSketchName } from '@/components/Sketch';
import { ROUTES, servicePath } from '@/lib/routes';
import type { BentoItem, OfferSheetItem } from '@/patterns';
import type {
  MatterPageModel,
  MatterSection,
} from '@/templates/CorpusPage/published-matter-model';

import { actionHref, illustration, image, mapBand, mapHero, rows, text } from './home';
import type { CmsHero, CmsHomeSection, CmsIllustration, CmsImage, Entries } from './home-types';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { MATTER_QUERY } from './published-matter-query';
import { flowBlocks, type CmsFlow } from './published-service';
import { publicGraphql } from './public-graphql';

type Text = string | null | undefined;
type Surface = 'paper' | 'tint' | 'ink' | 'blue' | null | undefined;

type CmsOfferSheet = {
  __typename: 'ComponentSharedOfferSheetSection';
  id: string;
  heading: Text;
  description: Text;
  anchorId: Text;
  offerSurface: Surface;
  sheetPresentation: Text;
  cards: Entries<{
    id: string;
    variant: Text;
    title: Text;
    description: Text;
    descriptionRich: Text;
    scene: Text;
    image: CmsImage | null;
  }>;
  listEntries: Entries<{ id: string; title: Text; body: Text; icon: Text }>;
};

type CmsEditorial = {
  __typename: 'ComponentSharedEditorialSection';
  id: string;
  heading: Text;
  anchorId: Text;
  editorialSurface: Surface;
  editorialSide: 'start' | 'end' | null | undefined;
  editorialPresentation: Text;
  mediaFit: Text;
  media: CmsImage | null;
  blocks: Entries<CmsFlow>;
};

type CmsServiceCards = {
  __typename: 'ComponentSharedServiceCard';
  id: string;
  heading: Text;
  description: Text;
  anchorId: Text;
  variant: Text;
  serviceSurface: Surface;
  singleGridContent: Entries<{
    id: string;
    title: Text;
    description: Text;
    href: Text;
    illustration: CmsIllustration | null;
    service: { documentId: string; name: Text; slug: Text } | null;
  }>;
};

type CmsShared = Extract<
  CmsHomeSection,
  { __typename: 'ComponentSharedCta' | 'ComponentSharedFaqSection' }
>;

export type MatterRecord = {
  documentId: string;
  routePath: Text;
  hero: (CmsHero & { mobileMedia?: CmsImage | null }) | null;
  content: Entries<CmsOfferSheet | CmsEditorial | CmsServiceCards | CmsShared>;
};

const ROUTE = ROUTES.matterDesignSystem;
const warn = (message: string) => console.warn(`New CMS ${ROUTE}: ${message}`);

function head(section: { __typename: string; id: string; heading: Text; anchorId: Text }) {
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  if (!heading) {
    warn(`${key} has no heading; not shown`);
    return undefined;
  }
  const id = text(section.anchorId);
  return { key, id, heading, headingId: `${id ?? key}-heading` };
}

/**
 * The Offer Sheet: the illustrated cards (title, words, picture or drawing), or, presented as a split
 * list, its list entries. Every word and picture is the entry's.
 */
function offerSheet(section: CmsOfferSheet): MatterSection | undefined {
  const top = head(section);
  if (!top) return undefined;
  const list = section.sheetPresentation === 'split_list';
  if (
    section.sheetPresentation &&
    !['illustrated', 'split_list'].includes(section.sheetPresentation)
  )
    warn(
      `${top.key} presentation "${section.sheetPresentation}" is shown as illustrated cards`,
    );
  const items: OfferSheetItem[] = list
    ? rows(section.listEntries).flatMap((entry) => {
        const bodyHtml = markdownInlineToHtml(entry.body);
        if (!bodyHtml) {
          warn(`${top.key} list entry ${entry.id} has no body; not shown`);
          return [];
        }
        return [{ id: entry.id, title: text(entry.title), bodyHtml }];
      })
    : rows(section.cards).flatMap((card) => {
        const title = text(card.title);
        const bodyHtml = markdownInlineToHtml(card.descriptionRich) || undefined;
        const body = bodyHtml ? undefined : text(card.description);
        if (!title && !body && !bodyHtml) {
          warn(`${top.key} card ${card.id} has no title or words; not shown`);
          return [];
        }
        const picture = image(card.image);
        const scene = card.scene && isSketchName(card.scene) ? card.scene : undefined;
        if (card.scene && !scene) warn(`${top.key} card ${card.id} names an unknown scene`);
        return [
          {
            id: card.id,
            title,
            ...(bodyHtml ? { bodyHtml } : { body }),
            ...(picture ? { image: picture } : scene ? { scene } : {}),
          },
        ];
      });
  if (items.length === 0) warn(`${top.key} has nothing to list`);
  return {
    ...top,
    type: 'offer',
    surface: section.offerSurface ?? undefined,
    arrangement: list ? 'list' : 'grid',
    lead: text(section.description),
    items,
  };
}

/**
 * The editorial band: its picture beside its words. A body that is prose throughout is one Prose
 * column; any other flow block (a table, a list, a callout) takes the whole body through the shared
 * flow mapping, so nothing an editor adds is dropped.
 */
function editorial(section: CmsEditorial): MatterSection | undefined {
  const top = head(section);
  if (!top) return undefined;
  const blocks = rows(section.blocks);
  const prose = blocks.every((block) => block.kind === 'prose');
  const html = prose
    ? blocks.map((block) => markdownToHtml(block.prose?.body, `${ROUTE} ${top.key}`)).join('')
    : undefined;
  const flow = prose ? undefined : flowBlocks(section.blocks, (m) => warn(`${top.key} ${m}`));
  if (!html && !flow?.length) warn(`${top.key} has no words`);
  const art = image(section.media);
  if (!art) warn(`${top.key} has no usable picture`);
  return {
    ...top,
    type: 'editorial',
    surface: section.editorialSurface ?? undefined,
    side: section.editorialSide ?? 'start',
    art,
    ...(html ? { html } : {}),
    ...(flow?.length ? { flow } : {}),
  };
}

/**
 * The service tiles. Each links to its related Service (the relation, not a typed URL, unless the
 * editor set one); a tile whose Service is not published has nowhere to go and is left out.
 */
function serviceCards(section: CmsServiceCards): MatterSection | undefined {
  const top = head(section);
  if (!top) return undefined;
  if (section.variant && section.variant !== 'single_grid_content')
    warn(`${top.key} variant "${section.variant}" is shown as a single grid`);
  const items = rows(section.singleGridContent).flatMap((tile): BentoItem[] => {
    const title = text(tile.title) ?? text(tile.service?.name);
    const slug = text(tile.service?.slug);
    const href = actionHref(tile.href) ?? (slug ? servicePath(slug) : undefined);
    if (!title || !href) {
      warn(`${top.key} tile ${tile.id} has no title or no published Service; not shown`);
      return [];
    }
    const art = illustration(tile.illustration);
    if (art?.image)
      warn(`${top.key} tile "${title}" has a picture; the tile draws scenes only`);
    return [
      {
        id: tile.service?.documentId ?? tile.id,
        title,
        body: text(tile.description),
        href,
        scene: art?.scene,
      },
    ];
  });
  if (items.length === 0) warn(`${top.key} has no tiles`);
  return {
    ...top,
    type: 'services',
    surface: section.serviceSurface ?? undefined,
    lead: text(section.description),
    items,
  };
}

const one = (section: MatterSection | undefined): MatterSection[] => (section ? [section] : []);

export function mapMatter(page: MatterRecord | null | undefined): MatterPageModel | null {
  if (!page) return null;
  if (page.routePath && page.routePath !== ROUTE)
    throw new Error(`New CMS ${ROUTE}: published entry reports route ${page.routePath}`);
  const hero = mapHero(page.hero);
  if (!hero) throw new Error(`New CMS ${ROUTE}: published entry has no hero title`);
  /* The phone cut of the hero picture, below 768: a different file the CMS carries beside it. */
  const phone = image(page.hero?.mobileMedia);
  if (hero.media?.type === 'image' && phone)
    hero.media = {
      ...hero.media,
      phone: { src: phone.src, width: phone.width, height: phone.height },
    };
  else if (phone)
    warn('hero has a phone picture but no main picture; the phone picture is unused');

  const sections = rows(page.content).flatMap((section): MatterSection[] => {
    switch (section.__typename) {
      case 'ComponentSharedOfferSheetSection':
        return one(offerSheet(section));
      case 'ComponentSharedEditorialSection':
        return one(editorial(section));
      case 'ComponentSharedServiceCard':
        return one(serviceCards(section));
      case 'ComponentSharedCta':
      case 'ComponentSharedFaqSection': {
        const mapped = mapBand(section, ROUTE);
        return mapped?.type === 'cta' || mapped?.type === 'faq' ? [mapped] : [];
      }
      default:
        warn(`${(section as { __typename: string }).__typename} has no place on this page`);
        return [];
    }
  });
  return { hero, sections };
}

export const getPublishedMatter = cache(async () =>
  mapMatter(
    (await publicGraphql<{ page: MatterRecord | null }>(MATTER_QUERY, 'PublishedMatter')).page,
  ),
);
