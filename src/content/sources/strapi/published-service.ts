import { cache } from 'react';

import { isSketchName } from '@/components/Sketch';
import type { CorpusBlock, CorpusLink } from '@/lib/corpus-types';
import type { InlineRun } from '@/lib/inline';
import { caseStudyPath, servicePath } from '@/lib/routes';
import type { LogoGridMark } from '@/patterns';
import type {
  PublishedServicePage,
  PublishedServiceSection,
  ServiceArt,
  ServiceOfferCard,
} from '@/templates/CorpusPage/published-service-model';

import { parseBlocks } from '../corpus/parse-body';
import { parseInline } from '../corpus/parse-inline';
import { action, actionHref, illustration, image, mapBand, mapHero, rows, text } from './home';
import type {
  CmsAction,
  CmsHero,
  CmsHomeSection,
  CmsIllustration,
  CmsImage,
  Entries,
  ResolvedCase,
} from './home-types';
import type { StrapiUploadFile } from './image';
import { mapUploadImage } from './image';
import { markdownInlineToHtml } from './markdown';
import {
  PUBLISHED_SERVICE_QUERY,
  PUBLISHED_SERVICE_SLUGS_QUERY,
} from './published-service-query';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';

type Text = string | null | undefined;
type Surface = 'paper' | 'tint' | null;
type Side = 'start' | 'end' | null;

type CmsTable = {
  caption: Text;
  columns: Entries<{ heading: Text }>;
  rows: Entries<{ heading: Text; cells: Entries<{ body: Text }> }>;
};
type CmsProof = { label: Text; body: Text; link?: CmsAction | null };
type CmsBody = {
  kind: string;
  prose?: { body: Text } | null;
  table?: CmsTable | null;
  labelled?: { title: Text; body: Text } | null;
  links?: { links: Entries<CmsAction> } | null;
};
export type CmsFlow = CmsBody & {
  id: string;
  proof?: CmsProof | null;
  scenario?: {
    label: Text;
    illustration?: CmsIllustration | null;
    blocks: Entries<CmsBody>;
  } | null;
  sequence?: {
    heading: Text;
    ordered: boolean | null;
    entries: Entries<{ title: Text; body: Text }>;
  } | null;
  callout?: { label: Text; body: Text; icon: Text } | null;
  ledger?: { entries: Entries<{ question: Text; role: Text }> } | null;
};
type CmsTile = {
  id: string;
  title: Text;
  description: Text;
  href: Text;
  illustration?: CmsIllustration | null;
  service?: { slug: Text } | null;
};
type Band = { id: string; anchorId: Text; heading: Text };

type ServiceOnlySection = Band &
  (
    | {
        __typename: 'ComponentSharedClientGrid';
        title: Text;
        clientSurface: Surface;
        gridDensity: 'compact' | 'standard' | null;
        clients: Entries<{
          documentId: string;
          name: Text;
          density: number | null;
          media: StrapiUploadFile | null;
        }>;
        markOverrides: Entries<{
          client: { documentId: string } | null;
          media: StrapiUploadFile | null;
          density: number | null;
          width: number | null;
          height: number | null;
        }>;
      }
    | {
        __typename: 'ComponentSharedServiceCard';
        description: Text;
        variant: 'single_grid_content' | 'two_grid_content' | null;
        serviceSurface: Surface;
        singleGridContent: Entries<CmsTile>;
        twoGridContent: Entries<{
          id: string;
          ctaText: Text;
          detail: { label: Text; body: Text } | null;
          content: CmsTile | null;
        }>;
        closingRoutes: Entries<{
          id: string;
          question: Text;
          answer: Text;
          actions: Entries<CmsAction>;
        }>;
        before: Entries<CmsFlow>;
        after: Entries<CmsFlow>;
      }
    | {
        __typename: 'ComponentSharedStageSection';
        description: Text;
        stageSurface: Surface;
        stageSide: Side;
        illustration: CmsIllustration | null;
        stages: Entries<{ id: string; title: Text; description: Text; descriptionRich: Text }>;
        before: Entries<CmsFlow>;
        after: Entries<CmsFlow>;
      }
    | {
        __typename: 'ComponentSharedOfferSheetSection';
        description: Text;
        offerSurface: Surface;
        offerPresentation: 'illustrated' | 'plain' | 'read_down' | 'catalogue' | null;
        offerCards: Entries<{
          id: string;
          variant: 'column' | 'row' | null;
          title: Text;
          description: Text;
          descriptionRich: Text;
          scene: Text;
        }>;
        before: Entries<CmsFlow>;
        after: Entries<CmsFlow>;
      }
    | {
        __typename: 'ComponentSharedWhySection';
        whySurface: Surface;
        cta: CmsAction | null;
        whyCards: Entries<{
          id: string;
          variant: 'illustration' | 'media' | null;
          title: Text;
          points: Entries<{ text: Text }>;
          illustration: StrapiUploadFile | null;
          media: StrapiUploadFile | null;
        }>;
      }
    | {
        __typename: 'ComponentSharedHardPartsSection';
        description: Text;
        hardSurface: Surface;
        hardPartsPresentation: 'page' | 'tabs' | null;
        before: Entries<CmsFlow>;
        claims: Entries<{
          id: string;
          title: Text;
          illustration: CmsIllustration | null;
          blocks: Entries<CmsFlow>;
          example: CmsProof | null;
        }>;
        after: Entries<CmsFlow>;
      }
    | {
        __typename: 'ComponentSharedComparisonSection';
        description: Text;
        comparisonSurface: Surface;
        blocks: Entries<CmsFlow>;
      }
    | {
        __typename: 'ComponentSharedEditorialSection';
        editorialSurface: Surface;
        editorialSide: Side;
        editorialPresentation: 'text' | 'media' | null;
        media: CmsImage | null;
        blocks: Entries<CmsFlow>;
      }
    | {
        __typename: 'ComponentSharedIllustratedSection';
        description: Text;
        illustratedSurface: Surface;
        illustratedPresentation: 'grid' | 'ledger' | 'agreement' | null;
        legend: Text;
        illustration: CmsIllustration | null;
        entries: Entries<{
          id: string;
          title: Text;
          body: Text;
          href: Text;
          illustration: CmsIllustration | null;
          detail: { title: Text; body: Text } | null;
        }>;
        agreementEntries: Entries<{ id: string; title: Text; body: Text }>;
        before: Entries<CmsFlow>;
        after: Entries<CmsFlow>;
      }
  );

/* The Offer Sheet is read here with its supporting flow blocks, so Home's narrower shape is set aside. */
export type CmsSharedSection =
  | Exclude<CmsHomeSection, { __typename: 'ComponentSharedOfferSheetSection' }>
  | ServiceOnlySection;
type CmsServiceSection = CmsSharedSection;

type CmsService = {
  documentId: string;
  name: Text;
  slug: string;
  routePath: string;
  hero: CmsHero | null;
  content: Entries<CmsServiceSection>;
};

/* ── Markdown and flow blocks → the corpus block model ───────────────────────── */

function markdownBlocks(value: Text): CorpusBlock[] {
  const source = text(value);
  return source ? parseBlocks(source) : [];
}

function inline(value: Text): InlineRun[] {
  const source = text(value);
  return source ? parseInline(source) : [];
}

function link(value: CmsAction | null | undefined): CorpusLink | undefined {
  const mapped = action(value);
  return mapped
    ? { href: mapped.href, label: parseInline(mapped.label), labelText: mapped.label }
    : undefined;
}

/** A labelled line as the corpus authors it: the bold label running into its words. */
function labelled(title: Text, body: Text): CorpusBlock[] {
  const label = text(title);
  const words = text(body);
  if (!label) return markdownBlocks(words);
  return parseBlocks(words ? `**${label}** ${words}` : `**${label}**`);
}

/** A CMS data table: its first column is the row-heading column, every row one cell per other column. */
function table(value: CmsTable | null | undefined): CorpusBlock[] {
  const columns = rows(value?.columns);
  if (columns.length < 2) return [];
  return [
    {
      type: 'table',
      header: columns.map((column) => inline(column.heading)),
      rows: rows(value?.rows).map((row) => {
        const cells = rows(row.cells);
        return [
          inline(row.heading),
          ...columns.slice(1).map((_, index) => inline(cells[index]?.body)),
        ];
      }),
    },
  ];
}

function linkRow(values: Entries<CmsAction>): CorpusBlock[] {
  const links = rows(values).flatMap((value) => link(value) ?? []);
  return links.length > 0 ? [{ type: 'links', links }] : [];
}

/** A proof as the corpus authors one: its label running into its words, its link closing them. */
function proofRuns(value: CmsProof | null | undefined): InlineRun[] | undefined {
  const body = text(value?.body);
  if (!body) return undefined;
  const label = text(value?.label);
  const labelled =
    label && !body.toLowerCase().startsWith(label.toLowerCase()) ? `${label}: ${body}` : body;
  const onward = action(value?.link);
  return parseInline(onward ? `${labelled} [${onward.label}](${onward.href})` : labelled);
}

function bodyBlocks(block: CmsBody): CorpusBlock[] {
  switch (block.kind) {
    case 'prose':
      return markdownBlocks(block.prose?.body);
    case 'table':
      return table(block.table);
    case 'labelled':
      return labelled(block.labelled?.title, block.labelled?.body);
    case 'links':
      return linkRow(block.links?.links);
    default:
      return [];
  }
}

export function flowBlocks(
  entries: Entries<CmsFlow>,
  warn: (message: string) => void,
): CorpusBlock[] {
  return rows(entries).flatMap((block): CorpusBlock[] => {
    switch (block.kind) {
      case 'prose':
      case 'table':
      case 'labelled':
      case 'links': {
        const mapped = bodyBlocks(block);
        if (mapped.length === 0) warn(`flow block ${block.id} (${block.kind}) has no content`);
        return mapped;
      }
      case 'proof': {
        const runs = proofRuns(block.proof);
        return runs ? [{ type: 'paragraph', runs }] : [];
      }
      case 'scenario': {
        const label = text(block.scenario?.label);
        const body = rows(block.scenario?.blocks).flatMap(bodyBlocks);
        return label ? [{ type: 'paragraph', runs: parseInline(label) }, ...body] : body;
      }
      case 'sequence': {
        const heading = text(block.sequence?.heading);
        const items = rows(block.sequence?.entries).flatMap((entry) => {
          const title = text(entry.title);
          const body = text(entry.body);
          return title ? [parseInline(body ? `**${title}** ${body}` : `**${title}**`)] : [];
        });
        return [
          ...(heading ? labelled(heading, undefined) : []),
          ...(items.length > 0
            ? [{ type: 'list' as const, ordered: Boolean(block.sequence?.ordered), items }]
            : []),
        ];
      }
      case 'callout':
        return labelled(block.callout?.label, block.callout?.body);
      case 'ledger':
        return rows(block.ledger?.entries).flatMap((entry) =>
          labelled(entry.question, entry.role),
        );
      default:
        warn(`flow block ${block.id} has an unsupported kind (${block.kind})`);
        return [];
    }
  });
}

const MARKDOWN_LINK = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/gu;

/**
 * A case card's words. The whole card is one link, so its words can hold none (an anchor inside an
 * anchor is invalid HTML, and the browser splits the card). The closing "[Read the … case](…)" that
 * repeats the card's own action or destination is the card's CTA, so it leaves the words, as the
 * corpus case set lifted it; any other link keeps its words without the link.
 */
function cardWords(
  value: Text,
  card: { href?: string; ctaLabel?: string },
): string | undefined {
  const source = text(value);
  if (!source) return undefined;
  const same = (label: string, target: string) =>
    label.trim().toLowerCase() === card.ctaLabel?.trim().toLowerCase() ||
    actionHref(target) === card.href;
  const trimmed = source.replace(
    /\s*(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)\s*$/u,
    (link, label: string, target: string) => (same(label, target) ? '' : link),
  );
  return text(trimmed.replace(MARKDOWN_LINK, '$1'));
}

/** A registered Sketch scene, or nothing: an unknown name never reaches the renderer. */
function scene(value: Text) {
  return value && isSketchName(value) ? value : undefined;
}

function art(value: CmsIllustration | null | undefined): ServiceArt | undefined {
  return illustration(value);
}

function upload(file: StrapiUploadFile | null | undefined) {
  return mapUploadImage(file, publicGraphqlUrl());
}

function tileHref(tile: CmsTile): string | undefined {
  return (
    actionHref(tile.href) ?? (tile.service?.slug ? servicePath(tile.service.slug) : undefined)
  );
}

/* ── Sections ────────────────────────────────────────────────────────────────── */

/**
 * One shared Page Content section (the 15 members every page owner built from the shared sections
 * can hold) as its view model, or nothing when it cannot render. `route` names the page in warnings.
 */
export function mapSharedSection(
  section: CmsSharedSection,
  route: string,
): PublishedServiceSection | undefined {
  const warn = (message: string) => console.warn(`New CMS ${route}: ${message}`);
  const key = `${section.__typename}-${section.id}`;
  const id = text(section.anchorId);
  const headingOf =
    section.__typename === 'ComponentSharedClientGrid' ? section.title : section.heading;
  const heading = text(headingOf);
  if (!heading) {
    warn(`${key} has no heading`);
    return undefined;
  }
  const head = { key, id, heading, headingId: `${id ?? key}-heading` };
  const flow = (entries: Entries<CmsFlow>) => flowBlocks(entries, (m) => warn(`${key} ${m}`));

  switch (section.__typename) {
    case 'ComponentSharedOfferSheetSection': {
      const cards = rows(section.offerCards).flatMap((card) => {
        const title = text(card.title);
        if (!title) {
          warn(`${key} offer card ${card.id} has no title`);
          return [];
        }
        const mapped: ServiceOfferCard & { variant: 'column' | 'row' } = {
          id: card.id,
          title,
          body: text(card.description),
          bodyHtml: markdownInlineToHtml(card.descriptionRich) || undefined,
          blocks: labelled(title, text(card.descriptionRich) ?? card.description),
          scene: scene(card.scene),
          variant: card.variant ?? 'column',
        };
        if (card.scene && !mapped.scene)
          warn(`${key} offer card "${title}" names an unknown scene "${card.scene}"`);
        return [mapped];
      });
      return {
        ...head,
        type: 'offer',
        surface: section.offerSurface ?? undefined,
        presentation: section.offerPresentation ?? 'illustrated',
        lead: text(section.description),
        before: flow(section.before),
        after: flow(section.after),
        columns: cards.filter((card) => card.variant === 'column'),
        rows: cards.filter((card) => card.variant === 'row'),
      };
    }
    case 'ComponentSharedHardPartsSection':
      return {
        ...head,
        type: 'claims',
        surface: section.hardSurface ?? undefined,
        layout: section.hardPartsPresentation === 'page' ? 'page' : 'tabs',
        lead: text(section.description),
        before: flow(section.before),
        after: flow(section.after),
        claims: rows(section.claims).flatMap((claim) => {
          const title = text(claim.title);
          if (!title) {
            warn(`${key} claim ${claim.id} has no title`);
            return [];
          }
          return [
            {
              title,
              blocks: flow(claim.blocks),
              example: proofRuns(claim.example),
              art: art(claim.illustration),
            },
          ];
        }),
      };
    case 'ComponentSharedServiceCard': {
      const two = section.variant === 'two_grid_content';
      const tile = (value: CmsTile | null | undefined) => {
        const title = text(value?.title);
        if (!value || !title) return undefined;
        return {
          id: value.id,
          title,
          body: text(value.description),
          href: tileHref(value),
          art: art(value.illustration),
        };
      };
      const tiles = two
        ? rows(section.twoGridContent).flatMap((split) => {
            const content = tile(split.content);
            if (!content) {
              warn(`${key} split tile ${split.id} has no title`);
              return [];
            }
            const label = text(split.detail?.label);
            const detail = text(split.detail?.body);
            return [
              {
                ...content,
                id: split.id,
                detail:
                  label && detail
                    ? { label, text: detail, action: text(split.ctaText) }
                    : undefined,
              },
            ];
          })
        : rows(section.singleGridContent).flatMap((value) => tile(value) ?? []);
      if (two && rows(section.singleGridContent).length > 0)
        warn(`${key} is two-grid but also carries single-grid tiles; they are not shown`);
      if (!two && rows(section.twoGridContent).length > 0)
        warn(`${key} is single-grid but also carries split tiles; they are not shown`);
      return {
        ...head,
        type: 'service-cards',
        surface: section.serviceSurface ?? undefined,
        variant: two ? 'two' : 'single',
        lead: text(section.description),
        before: flow(section.before),
        after: flow(section.after),
        tiles,
        routes: two
          ? []
          : rows(section.closingRoutes).flatMap((route) => {
              const actions = rows(route.actions).flatMap((value) => action(value) ?? []);
              return actions.length > 0
                ? [{ question: text(route.question), answer: text(route.answer), actions }]
                : [];
            }),
      };
    }
    case 'ComponentSharedStageSection':
      return {
        ...head,
        type: 'stages',
        surface: section.stageSurface ?? undefined,
        lead: text(section.description),
        art: art(section.illustration),
        before: flow(section.before),
        after: flow(section.after),
        stages: rows(section.stages).flatMap((stage) => {
          const title = text(stage.title);
          if (!title) return [];
          /* The rich override wins when it has words; the plain description otherwise. */
          const paragraphs = (text(stage.descriptionRich) ?? '')
            .split(/\n\s*\n/u)
            .map((paragraph) => markdownInlineToHtml(paragraph))
            .filter(Boolean);
          return [
            paragraphs.length > 0
              ? { title, bodyHtml: paragraphs }
              : { title, body: text(stage.description) },
          ];
        }),
      };
    case 'ComponentSharedWhySection':
      return {
        ...head,
        type: 'why',
        surface: section.whySurface ?? undefined,
        action: action(section.cta),
        cards: rows(section.whyCards).flatMap((card) => {
          const title = text(card.title);
          const body = rows(card.points)
            .flatMap((point) => text(point.text) ?? [])
            .join(' ');
          if (!title || !body) {
            warn(`${key} why card ${card.id} has no title or points`);
            return [];
          }
          const variant = card.variant === 'media' ? 'media' : 'illustration';
          const picture = upload(variant === 'media' ? card.media : card.illustration);
          if (!picture) warn(`${key} why card "${title}" has no ${variant} upload`);
          return [{ id: card.id, title, variant, image: picture, body }];
        }),
      };
    case 'ComponentSharedComparisonSection':
      return {
        ...head,
        type: 'flow',
        kind: 'comparison',
        surface: section.comparisonSurface ?? undefined,
        lead: text(section.description),
        blocks: flow(section.blocks),
      };
    case 'ComponentSharedEditorialSection': {
      const media =
        section.editorialPresentation === 'media' ? image(section.media) : undefined;
      if (section.editorialPresentation === 'media' && !media)
        warn(`${key} is a media presentation with no usable photograph`);
      return {
        ...head,
        type: 'flow',
        kind: 'editorial',
        surface: section.editorialSurface ?? undefined,
        blocks: flow(section.blocks),
        media: media ? { image: media, side: section.editorialSide ?? undefined } : undefined,
      };
    }
    case 'ComponentSharedIllustratedSection': {
      const presentation = section.illustratedPresentation ?? 'grid';
      const entries =
        presentation === 'agreement'
          ? rows(section.agreementEntries).flatMap((entry) => {
              const title = text(entry.title);
              return title
                ? [
                    {
                      id: entry.id,
                      title,
                      bodyHtml: markdownInlineToHtml(entry.body) || undefined,
                    },
                  ]
                : [];
            })
          : rows(section.entries).flatMap((entry) => {
              const title = text(entry.title);
              if (!title) return [];
              const label = text(entry.detail?.title);
              return [
                {
                  id: entry.id,
                  title,
                  bodyHtml: markdownInlineToHtml(entry.body) || undefined,
                  href: actionHref(entry.href),
                  art: art(entry.illustration),
                  detail: label
                    ? { label, html: markdownInlineToHtml(entry.detail?.body) || undefined }
                    : undefined,
                },
              ];
            });
      return {
        ...head,
        type: 'illustrated',
        surface: section.illustratedSurface ?? undefined,
        presentation,
        lead: text(section.description),
        legend: text(section.legend),
        art: art(section.illustration),
        before: flow(section.before),
        after: flow(section.after),
        entries,
      };
    }
    case 'ComponentSharedCaseStudyCards':
      return {
        ...head,
        type: 'cases',
        surface: section.casesSurface ?? undefined,
        lead: text(section.description),
        action: action(section.action),
        cards: rows(section.cards).flatMap((card, index) => {
          /* The CMS resolves each card (override, then the case's own thumbnail); the card's own
             fields stand in only where a card has no published case to resolve. */
          const slug = text(card.caseStudy?.slug);
          const resolved: ResolvedCase = card.resolved ?? {
            title: card.title ?? card.caseStudy?.title,
            eyebrow: card.eyebrow,
            description: card.descriptionRich ?? card.description,
            descriptionFormat: card.descriptionRich ? 'markdown' : 'text',
            href: slug ? caseStudyPath(slug) : undefined,
            showCta: card.showCta,
            ctaLabel: card.ctaText,
            image: card.image,
          };
          const title = text(resolved.title);
          if (!title) {
            warn(`${key} card ${index + 1} has no title`);
            return [];
          }
          const href = actionHref(resolved.href);
          const ctaLabel = resolved.showCta === false ? undefined : text(resolved.ctaLabel);
          const description = cardWords(resolved.description, { href, ctaLabel });
          /* The card's own image override wins over the case's thumbnail. */
          const cover = image(card.image) ?? image(resolved.image);
          if (!href || !cover) warn(`${key} card "${title}" is missing a case link or cover`);
          return [
            {
              id: resolved.id ?? `${section.id}-${index}`,
              title,
              eyebrow: text(resolved.eyebrow),
              ...(description && resolved.descriptionFormat === 'markdown'
                ? {
                    bodyHtml: description
                      .split(/\n\s*\n/u)
                      .map((paragraph) => markdownInlineToHtml(paragraph))
                      .filter(Boolean),
                  }
                : { body: description }),
              href,
              ctaLabel,
              image: cover,
            },
          ];
        }),
      };
    case 'ComponentSharedClientGrid':
      return {
        ...head,
        type: 'clients',
        surface: section.clientSurface ?? undefined,
        /* The logo wall is compact unless the CMS asks for the standard grid (as the hero's wall). */
        compact: section.gridDensity !== 'standard',
        marks: (() => {
          const overrides = new Map(
            rows(section.markOverrides).map((mark) => [mark.client?.documentId, mark]),
          );
          return rows(section.clients).flatMap<LogoGridMark>((client) => {
            const name = text(client.name);
            if (!name) return [];
            const override = overrides.get(client.documentId);
            const asset = upload(override?.media) ?? upload(client.media);
            if (!asset) warn(`${key} client ${client.documentId} has no usable logo`);
            return asset
              ? [
                  {
                    src: asset.src,
                    name,
                    width: override?.width ?? asset.width,
                    height: override?.height ?? asset.height,
                    density: override?.density ?? client.density ?? undefined,
                  },
                ]
              : [{ name }];
          });
        })(),
      };
    default: {
      const mapped = mapBand(section, route);
      switch (mapped?.type) {
        case 'testimonials':
        case 'engagement':
        case 'industries':
        case 'faq':
        case 'cta':
          return mapped;
        case undefined:
          return undefined;
        default:
          warn(`${key} mapped to an unsupported band (${mapped?.type})`);
          return undefined;
      }
    }
  }
}

/** Slugs are relative paths below /services, nested for specialists: `product-design/ux-research`. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/u;

export const getPublishedService = cache(
  async (slug: string): Promise<PublishedServicePage | null> => {
    if (!SLUG.test(slug)) return null;
    const route = servicePath(slug);
    const { services } = await publicGraphql<{ services: CmsService[] }>(
      PUBLISHED_SERVICE_QUERY,
      'PublishedService',
      { slug },
      { optionalImagePaths: ['services.*.hero.media.file'] },
    );
    const service = services.find((entry) => entry.slug === slug);
    if (!service) return null;
    if (service.routePath !== route) {
      throw new Error(`New CMS ${route}: published entry reports route ${service.routePath}`);
    }
    const hero = mapHero(service.hero);
    if (!hero) throw new Error(`New CMS ${route}: published entry has no hero title`);
    return {
      slug,
      route,
      name: text(service.name) ?? hero.title,
      hero,
      sections: rows(service.content).flatMap(
        (section) => mapSharedSection(section, route) ?? [],
      ),
    };
  },
);

/** Every published Service slug. An audit route named as a tile destination is not a Service. */
export const listPublishedServiceSlugs = cache(async (): Promise<string[]> => {
  const { services } = await publicGraphql<{ services: { slug: string }[] }>(
    PUBLISHED_SERVICE_SLUGS_QUERY,
    'PublishedServiceSlugs',
  );
  return services.map(({ slug }) => slug).filter((slug) => SLUG.test(slug));
});
