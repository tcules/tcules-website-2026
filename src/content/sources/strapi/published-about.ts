import { cache } from 'react';

import { auditPath, caseStudyPath, expertisePath, ROUTES, servicePath } from '@/lib/routes';
import { sketchForRoute } from '@/lib/sketches';
import type {
  AboutFlow,
  PublishedAboutPage,
  PublishedAboutSection,
} from '@/templates/CorpusPage/published-about-model';

import {
  action,
  actionHref,
  icon,
  illustration,
  image,
  mapBand,
  mapHero,
  rows,
  text,
} from './home';
import type {
  CmsAction,
  CmsHero,
  CmsHomeSection,
  CmsIllustration,
  CmsImage,
  Entries,
} from './home-types';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { PUBLISHED_ABOUT_QUERY } from './published-about-query';
import { publicGraphql } from './public-graphql';

type Text = string | null | undefined;
type Surface = 'paper' | 'tint' | null;
type Relation = { documentId: string; slug: Text; name?: Text; title?: Text };

type Flow = {
  id: string;
  kind: string;
  prose?: { body: Text } | null;
  illustration?: CmsIllustration | null;
  table?: {
    caption: Text;
    split?: boolean | null;
    columns: Entries<{ heading: Text }>;
    rows: Entries<{ heading: Text; cells: Entries<{ body: Text }> }>;
  } | null;
};

type SharedSection = Extract<
  CmsHomeSection,
  {
    __typename:
      | 'ComponentSharedCaseStudyCards'
      | 'ComponentSharedEngagementOptions'
      | 'ComponentSharedTestimonialSection'
      | 'ComponentSharedFaqSection'
      | 'ComponentSharedCta';
  }
>;

type AboutSection =
  | SharedSection
  | ({
      id: string;
      anchorId: Text;
      heading?: Text;
      description?: Text;
    } & (
      | {
          __typename: 'ComponentSharedServiceCard';
          variant: Text;
          serviceSurface: Surface;
          columns: number | null;
          singleGridPresentation: Text;
          singleGridContent: Entries<{
            id: string;
            title: Text;
            description: Text;
            supportingCopy: Text;
            ctaText: Text;
            href: Text;
            illustration?: CmsIllustration | null;
            detail?: { label: Text; body: Text } | null;
            service?: Relation | null;
            expertise?: Relation | null;
            caseStudy?: Relation | null;
            audit?: Relation | null;
          }>;
          closingRoutes: Entries<unknown>;
          twoGridContent: Entries<unknown>;
          before: Entries<unknown>;
          after: Entries<unknown>;
        }
      | {
          __typename: 'ComponentSharedAudienceSection';
          afterCopy: Text;
          entries: Entries<{ id: string; title: Text; icon: Text }>;
        }
      | { __typename: 'ComponentSharedLinkBanner'; body: Text; action?: CmsAction | null }
      | {
          __typename: 'ComponentSharedPeopleSection';
          profiles: Entries<{
            id: string;
            name: Text;
            role: Text;
            bio: Text;
            linkedin?: CmsAction | null;
          }>;
        }
      | {
          __typename: 'ComponentSharedEditorialSection';
          editorialSurface: Surface;
          editorialSide?: 'start' | 'end' | null;
          editorialPresentation?: 'stacked' | 'beside' | 'media' | null;
          media?: CmsImage | null;
          blocks: Entries<Flow>;
        }
      | {
          __typename: 'ComponentSharedComparisonSection';
          comparisonSurface: Surface;
          blocks: Entries<Flow>;
        }
      | { __typename: 'ComponentSharedLinksIsland'; links: Entries<CmsAction> }
    ));

function warn(message: string) {
  console.warn(`New CMS /about: ${message}`);
}

function prose(body: Text, key: string) {
  try {
    return markdownToHtml(body, key) || undefined;
  } catch {
    warn(`${key} contains an unsupported inline media embed`);
  }
}

function mapFlow(block: Flow, headingId: string): AboutFlow | undefined {
  const key = block.id;
  if (block.kind === 'prose') {
    const html = prose(block.prose?.body, key);
    if (html) return { key, type: 'prose', html };
  }
  if (block.kind === 'illustration') {
    const art = illustration(block.illustration);
    if (art) return { key, type: 'illustration', ...art };
  }
  if (block.kind === 'table' && block.table) {
    const { caption, split, columns, rows: tableRows } = block.table;
    const [first, ...rest] = rows(columns);
    if (first && rest.length > 0) {
      return {
        key,
        type: 'table',
        table: {
          caption: text(caption),
          labelledBy: headingId,
          split: split ?? undefined,
          keyColumn: { heading: text(first.heading) ?? '' },
          columns: rest.map(({ heading }) => ({ heading: text(heading) ?? '' })),
          rows: rows(tableRows).map(({ heading, cells }) => ({
            header: text(heading) ?? '',
            cellsHtml: rest.map((_, index) => markdownInlineToHtml(cells?.[index]?.body)),
          })),
        },
      };
    }
  }
  warn(`block ${key} has missing or unsupported ${block.kind} content`);
}

function mapSection(section: AboutSection): PublishedAboutSection | undefined {
  const key = `${section.__typename}-${section.id}`;
  const id = text(section.anchorId);
  if (section.__typename === 'ComponentSharedLinkBanner') {
    return {
      type: 'link-banner',
      id,
      html: prose(section.body, key),
      action: action(section.action),
    };
  }

  const heading = text(section.heading);
  if (!heading) {
    warn(`${key} has no heading or supported mapping`);
    return;
  }
  const head = { id, heading, headingId: `${id ?? key}-heading` };
  const lead = 'description' in section ? text(section.description) : undefined;

  switch (section.__typename) {
    case 'ComponentSharedServiceCard': {
      const {
        columns,
        variant,
        singleGridPresentation,
        before,
        after,
        closingRoutes,
        twoGridContent,
      } = section;
      if (
        variant !== 'single_grid_content' ||
        singleGridPresentation ||
        [before, after, closingRoutes, twoGridContent].some((entries) => entries?.length)
      ) {
        warn(`${key} contains a service layout or flow outside the About Bento mapping`);
      }
      return {
        ...head,
        type: 'services',
        lead,
        surface: section.serviceSurface ?? undefined,
        tracks: columns === 2 || columns === 3 || columns === 4 ? columns : undefined,
        items: rows(section.singleGridContent).flatMap((tile) => {
          const { service, expertise, caseStudy, audit } = tile;
          const title = text(
            tile.title ?? service?.name ?? expertise?.name ?? caseStudy?.title ?? audit?.name,
          );
          if (!title) {
            warn(`service tile ${tile.id} has no title`);
            return [];
          }
          const href =
            actionHref(tile.href) ??
            (service?.slug
              ? servicePath(service.slug)
              : expertise?.slug
                ? expertisePath(expertise.slug)
                : caseStudy?.slug
                  ? caseStudyPath(caseStudy.slug)
                  : audit?.slug
                    ? auditPath(audit.slug)
                    : undefined);
          if (!href) warn(`service tile ${tile.id} has no usable destination`);
          const art = illustration(tile.illustration);
          const scene =
            art?.scene ??
            (!art?.image && href
              ? href === ROUTES.audits
                ? 'specialist-audit'
                : sketchForRoute(href)
              : undefined);
          const label = text(tile.detail?.label);
          const detail = text(tile.detail?.body);
          return [
            {
              id: tile.id,
              title,
              href,
              body: text(tile.description),
              supportingCopy: text(tile.supportingCopy),
              action: text(tile.ctaText),
              detail:
                label && detail
                  ? { label, text: detail, action: text(tile.ctaText) }
                  : undefined,
              scene,
              image: art?.image,
            },
          ];
        }),
      };
    }
    case 'ComponentSharedAudienceSection':
      return {
        ...head,
        type: 'audience',
        lead,
        after: prose(section.afterCopy, key),
        entries: rows(section.entries).flatMap((entry) => {
          const title = text(entry.title);
          return title ? [{ key: entry.id, title, icon: icon(entry.icon) }] : [];
        }),
      };
    case 'ComponentSharedPeopleSection':
      return {
        ...head,
        type: 'people',
        lead,
        profiles: rows(section.profiles).flatMap((profile) => {
          const name = text(profile.name);
          return name
            ? [
                {
                  key: profile.id,
                  name,
                  role: text(profile.role),
                  bio: text(profile.bio),
                  linkedin: action(profile.linkedin),
                },
              ]
            : [];
        }),
      };
    case 'ComponentSharedEditorialSection': {
      const media = image(section.media);
      if (section.editorialPresentation === 'media' && !media)
        warn(`${key} has no usable photograph`);
      return {
        ...head,
        type: 'editorial',
        arrangement: section.editorialPresentation ?? undefined,
        media: media
          ? { image: media, side: section.editorialSide ?? undefined, weight: 'photo' }
          : undefined,
        surface: section.editorialSurface ?? undefined,
        blocks: rows(section.blocks).flatMap((block) => mapFlow(block, head.headingId) ?? []),
      };
    }
    case 'ComponentSharedLinksIsland':
      return {
        ...head,
        type: 'links',
        links: rows(section.links).flatMap((link) => action(link) ?? []),
      };
    case 'ComponentSharedComparisonSection':
      return {
        ...head,
        type: 'comparison',
        lead,
        surface: section.comparisonSurface ?? undefined,
        blocks: rows(section.blocks).flatMap((block) => mapFlow(block, head.headingId) ?? []),
      };
    default: {
      const mapped = mapBand(section, ROUTES.about);
      switch (mapped?.type) {
        case 'testimonials':
          return { ...mapped, surface: mapped.surface ?? 'tint' };
        case 'cases':
        case 'engagement':
        case 'faq':
        case 'cta':
          return mapped;
      }
    }
  }
}

export const getPublishedAbout = cache(async (): Promise<PublishedAboutPage | null> => {
  const { about } = await publicGraphql<{
    about: { routePath: string; hero: CmsHero | null; content: Entries<AboutSection> } | null;
  }>(PUBLISHED_ABOUT_QUERY, 'PublishedAbout');
  if (!about) return null;
  if (about.routePath !== ROUTES.about)
    throw new Error(`Unexpected About route: ${about.routePath}`);
  const hero = mapHero(about.hero);
  if (!hero) throw new Error('New CMS /about: published entry has no hero title');
  if (!hero.media) warn('hero has no usable media');

  return {
    hero,
    sections: rows(about.content).flatMap((section) => {
      const mapped = mapSection(section);
      return mapped ? [{ ...mapped, key: `${section.__typename}-${section.id}` }] : [];
    }),
  };
});
