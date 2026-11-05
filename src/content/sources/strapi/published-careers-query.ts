import { PUBLISHED_FIELDS, PUBLISHED_HERO } from './published-page-fields';

/* The shared hero in full (eyebrow, media, illustration, stats …), so nothing the CMS authors on it is
   dropped. GraphQL rejects an unused fragment, and no Careers field carries a rating. */
const FIELDS = PUBLISHED_FIELDS.replace(/fragment PublishedRating[^}]*}/, '');

export const CAREERS_QUERY = `query PublishedCareers {
  page:careerMaster(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedCollageSection {
        heading body anchorId
        lead { ...CareerPhoto }
        start { ...CareerPhoto }
        middle { ...CareerPhoto }
        middleStart { ...CareerPhoto }
        middleEnd { ...CareerPhoto }
        end { ...CareerPhoto }
        actions { name href isExternal }
      }
      ... on ComponentSharedEditorialSection {
        heading anchorId editorialPresentation: presentation
        blocks { kind prose { body } links { links { name href } } }
      }
      ... on ComponentSharedOfferSheetSection {
        heading description anchorId sheetPresentation: presentation
        listEntries { title body icon }
        action { name href isExternal }
      }
      ... on ComponentSharedChecklistSection {
        heading anchorId closing entries { text icon }
      }
      ... on ComponentSharedJobListing {
        heading description anchorId
        jobs { documentId title department employmentType location isActive publishedAt choiceValue }
      }
      ... on ComponentSharedCta {
        media { altText kind file {url width height formats alternativeText} }
        heading description descriptionRich disclaimer anchorId ctaType ctaPresentation: presentation
        form {
          variant purpose formLabel submitLabel showWork workLabel urlLabel urlRequired
          roleListingAnchor roleQuestion otherRoleLabel successHeading successBody
        }
      }
      ... on ComponentSharedFaqSection {
        heading anchorId faqs { documentId question answer slug isActive publishedAt }
      }
    }
  }
}
fragment CareerPhoto on ComponentContentCollagePhoto {
  zoom
  image {
    altText kind focusX focusY toneTemperature toneSaturation
    file { documentId url width height alternativeText mime formats }
  }
}
${FIELDS}
`;
