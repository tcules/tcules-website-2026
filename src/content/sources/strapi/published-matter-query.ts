import { PUBLISHED_CTA, PUBLISHED_FAQSECTION, PUBLISHED_HERO } from './published-page-fields';
import { SHARED_SECTION_FRAGMENTS } from './published-service-query';

/**
 * The published Matter Design System single type (`/matter-design-system`): the shared Hero (with
 * the phone rendition of its picture, which only this type carries), then every member of its
 * Dynamic Zone in the editor's order. The Offer Sheet reads its pictures and its list entries, which
 * the shared Offer Sheet fragment does not; the editorial body is the shared flow so a table, list or
 * callout an editor adds is read too; the CTA and FAQ are the shared members.
 */
export const MATTER_QUERY = `
query PublishedMatter {
  page: matterDesignSystem(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    hero { mobileMedia { ...PublishedImage } }
    content {
      __typename
      ... on ComponentSharedOfferSheetSection {
        id heading description anchorId offerSurface: surface sheetPresentation: presentation
        cards { id variant title description descriptionRich scene image { ...PublishedImage } }
        listEntries { id title body icon }
      }
      ... on ComponentSharedEditorialSection {
        id heading anchorId editorialSurface: surface editorialSide: mediaSide
        editorialPresentation: presentation mediaFit
        media { ...PublishedImage }
        blocks { ...ServiceFlow }
      }
      ... on ComponentSharedServiceCard {
        id heading description anchorId variant serviceSurface: surface
        singleGridContent {
          id title description href
          illustration { ...ServiceIllustration }
          service { documentId name slug }
        }
      }
${PUBLISHED_CTA}
${PUBLISHED_FAQSECTION}
    }
  }
}
${SHARED_SECTION_FRAGMENTS}
`;
