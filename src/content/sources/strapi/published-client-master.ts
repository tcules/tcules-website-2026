import { cache } from 'react';
import { caseStudyPath, ROUTES } from '@/lib/routes';
import type {
  ClientMasterPage,
  ClientMasterSection,
} from '@/templates/CorpusPage/published-client-master-model';
import { action, icon, image, mapBand, mapHero, rows, text } from './home';
import type { CmsAction, CmsHero, CmsHomeSection, CmsImage, Entries } from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { markdownInlineToHtml } from './markdown';
import {
  PUBLISHED_CTA,
  PUBLISHED_FAQSECTION,
  PUBLISHED_FIELDS,
  PUBLISHED_HERO,
  PUBLISHED_TESTIMONIALSECTION,
} from './published-page-fields';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import { escapeHtml } from './rich-text';

export const PUBLISHED_CLIENT_MASTER_QUERY = `
query PublishedClientMaster {
  clientMaster(status: PUBLISHED) {
    documentId routePath
    ${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedClientGrid {
        id title anchorId gridDensity: density
        clients { documentId name density media { url width height alternativeText } }
        namedClients { documentId name }
        markOverrides { client { documentId } media { url width height alternativeText } density width height }
      }
      ... on ComponentSharedOfferSheetSection {
        id heading anchorId offerPresentation: presentation
        offerCards: cards { id variant title description descriptionRich icon }
      }
      ... on ComponentSharedClientWorkTable {
        id heading anchorId clientColumnLabel productColumnLabel workColumnLabel
        entries { id clientLabel product work client { documentId name } caseStudy { documentId slug } }
      }
      ... on ComponentSharedClientStories {
        id heading anchorId entries { id body client { documentId name } }
      }
      ... on ComponentSharedCaseStudyCards {
        id heading anchorId description casePresentation: presentation
        action { ...PublishedAction }
        cards { id title image { ...PublishedImage }
          caseStudy { documentId title slug thumbnail { image { ...PublishedImage } } }
        }
      }
      ${PUBLISHED_TESTIMONIALSECTION}
      ${PUBLISHED_CTA}
      ${PUBLISHED_FAQSECTION}
    }
  }
}
${PUBLISHED_FIELDS}
`;
type Text = string | null | undefined;
type Head = { id: string; heading?: Text; anchorId?: Text };
type Client = {
  documentId: string;
  name: Text;
  density?: number | null;
  media?: StrapiUploadFile | null;
};
type CustomSection = Head &
  (
    | {
        __typename: 'ComponentSharedClientGrid';
        title: Text;
        gridDensity: Text;
        clients: Entries<Client>;
        markOverrides: Entries<{
          client?: Pick<Client, 'documentId'> | null;
          media?: StrapiUploadFile | null;
          density?: number | null;
          width?: number | null;
          height?: number | null;
        }>;
      }
    | {
        __typename: 'ComponentSharedOfferSheetSection';
        offerPresentation: Text;
        offerCards: Entries<{
          id: string;
          title: Text;
          description: Text;
          descriptionRich: Text;
          icon: Text;
        }>;
      }
    | {
        __typename: 'ComponentSharedClientWorkTable';
        clientColumnLabel: Text;
        productColumnLabel: Text;
        workColumnLabel: Text;
        entries: Entries<{
          id: string;
          clientLabel: Text;
          product: Text;
          work: Text;
          client?: Client | null;
          caseStudy?: { slug: Text } | null;
        }>;
      }
    | {
        __typename: 'ComponentSharedClientStories';
        entries: Entries<{ id: string; body: Text; client?: Client | null }>;
      }
    | {
        __typename: 'ComponentSharedCaseStudyCards';
        description: Text;
        casePresentation: Text;
        action?: CmsAction | null;
        cards: Entries<{
          id: string;
          title: Text;
          image?: CmsImage | null;
          caseStudy?: {
            documentId: string;
            title: Text;
            slug: Text;
            thumbnail?: { image?: CmsImage | null } | null;
          } | null;
        }>;
      }
  );
type SharedSection = Exclude<
  CmsHomeSection,
  { __typename: 'ComponentSharedOfferSheetSection' | 'ComponentSharedCaseStudyCards' }
>;
type CmsPage = {
  routePath?: Text;
  hero?: CmsHero | null;
  content: Entries<CustomSection | SharedSection>;
};

function warn(message: string) {
  console.warn(`New CMS ${ROUTES.clients}: ${message}`);
}

export function mapClientMaster(page: CmsPage | null | undefined): ClientMasterPage | null {
  if (!page) return null;
  if (page.routePath && page.routePath !== ROUTES.clients)
    warn(`the published entry reports route ${page.routePath}`);
  const hero = mapHero(page.hero);
  if (!hero) throw new Error(`New CMS ${ROUTES.clients}: published entry has no hero title`);
  const sections: ClientMasterSection[] = [];
  for (const section of rows(page.content)) {
    const heading = text(
      section.__typename === 'ComponentSharedClientGrid' ? section.title : section.heading,
    );
    const key = `${section.__typename}-${section.id}`;
    if (!heading) {
      warn(`${key} has no heading; not shown`);
      continue;
    }
    const id = text(section.anchorId);
    const head = { key, id, heading, headingId: `${id ?? key}-heading` };
    switch (section.__typename) {
      case 'ComponentSharedClientGrid': {
        const overrides = new Map(
          rows(section.markOverrides).map((mark) => [mark.client?.documentId, mark]),
        );
        sections.push({
          ...head,
          type: 'client-logos',
          compact: section.gridDensity === 'compact',
          marks: rows(section.clients).flatMap((client) => {
            const name = text(client.name),
              override = overrides.get(client.documentId);
            const media = mapUploadImage(override?.media ?? client.media, publicGraphqlUrl());
            if (!name || !media)
              warn(
                `${key} client ${client.documentId} has no name or no usable logo; not shown`,
              );
            return name && media
              ? [
                  {
                    name,
                    src: media.src,
                    width: override?.width ?? media.width,
                    height: override?.height ?? media.height,
                    density: override?.density ?? client.density ?? undefined,
                  },
                ]
              : [];
          }),
        });
        break;
      }
      case 'ComponentSharedOfferSheetSection':
        if (section.offerPresentation === 'rows') {
          sections.push({
            ...head,
            type: 'client-offer',
            items: rows(section.offerCards).flatMap((card) => {
              const title = text(card.title);
              return title
                ? [
                    {
                      id: card.id,
                      title,
                      icon: icon(card.icon),
                      bodyHtml:
                        markdownInlineToHtml(card.descriptionRich ?? card.description) ||
                        undefined,
                    },
                  ]
                : [];
            }),
          });
        } else {
          warn(
            `${key} has presentation ${section.offerPresentation ?? 'unset'}; only rows renders here`,
          );
        }
        break;
      case 'ComponentSharedClientWorkTable':
        sections.push({
          ...head,
          type: 'client-work',
          labels: [
            text(section.clientColumnLabel) ?? '',
            text(section.productColumnLabel) ?? '',
            text(section.workColumnLabel) ?? '',
          ],
          rows: rows(section.entries).flatMap((entry) => {
            const name = text(entry.clientLabel) ?? text(entry.client?.name);
            if (!name) return [];
            const slug = text(entry.caseStudy?.slug);
            return [
              {
                header: name,
                headerHtml: slug
                  ? `<a href="${escapeHtml(caseStudyPath(slug))}">${escapeHtml(name)}</a>`
                  : undefined,
                cellsHtml: [
                  escapeHtml(text(entry.product) ?? ''),
                  escapeHtml(text(entry.work) ?? ''),
                ],
              },
            ];
          }),
        });
        break;
      case 'ComponentSharedClientStories':
        sections.push({
          ...head,
          type: 'client-stories',
          entries: rows(section.entries).flatMap((entry) => {
            const title = text(entry.client?.name),
              bodyHtml = markdownInlineToHtml(entry.body);
            if (!title || !bodyHtml)
              warn(`${key} entry ${entry.id} has no client name or no words; not shown`);
            return title && bodyHtml ? [{ key: entry.id, title, bodyHtml }] : [];
          }),
        });
        break;
      case 'ComponentSharedCaseStudyCards':
        if (section.casePresentation === 'title_linked') {
          sections.push({
            ...head,
            type: 'client-cases',
            lead: text(section.description),
            action: action(section.action),
            items: rows(section.cards).flatMap((card) => {
              const selected = card.caseStudy,
                title = text(card.title) ?? text(selected?.title),
                slug = text(selected?.slug);
              if (!title || !slug) {
                warn(`${key} card ${card.id} selects no published case study; not shown`);
                return [];
              }
              const cover = image(card.image ?? selected?.thumbnail?.image);
              return [
                {
                  id: card.id,
                  title,
                  href: caseStudyPath(slug),
                  media: cover ? { type: 'image' as const, image: cover } : undefined,
                },
              ];
            }),
          });
        } else {
          warn(
            `${key} has presentation ${section.casePresentation ?? 'unset'}; only title_linked renders here`,
          );
        }
        break;
      default: {
        const mapped = mapBand(section, ROUTES.clients);
        if (
          mapped?.type === 'testimonials' &&
          section.__typename === 'ComponentSharedTestimonialSection'
        ) {
          // The existing Clients page displays these source scores, including recorded placeholders.
          const ratings = new Map(
            rows(section.testimonials).map((item) => [item.documentId, item.rating]),
          );
          mapped.items = mapped.items.map((item) => ({
            ...item,
            rating: ratings.get(item.id ?? '') ?? undefined,
          }));
        }
        if (mapped) sections.push(mapped);
        else warn(`${key} cannot render here; not shown`);
      }
    }
  }
  /* A band with nothing in it is left out rather than drawn empty. */
  const filled = sections.filter((section) => {
    const empty =
      (section.type === 'client-logos' && section.marks.length === 0) ||
      ((section.type === 'client-offer' || section.type === 'client-cases') &&
        section.items.length === 0) ||
      (section.type === 'client-work' && section.rows.length === 0) ||
      (section.type === 'client-stories' && section.entries.length === 0);
    if (empty) warn(`${section.key} has nothing to show; not shown`);
    return !empty;
  });
  return { hero, sections: filled };
}

export const getPublishedClientMaster = cache(async () => {
  const data = await publicGraphql<{ clientMaster: CmsPage | null }>(
    PUBLISHED_CLIENT_MASTER_QUERY,
    'PublishedClientMaster',
  );
  return mapClientMaster(data.clientMaster);
});
