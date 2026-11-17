import {
  PUBLISHED_CASESTUDYCARDS,
  PUBLISHED_TESTIMONIALSECTION,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
  PUBLISHED_CTA,
  PUBLISHED_HERO,
  PUBLISHED_FIELDS,
} from './published-page-fields';

export const HOME_QUERY = `
query PublishedHome {
  home(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedSituationGateway {
        id heading anchorId description eyebrow gatewaySurface: surface
        paths { id eyebrow title body { text } glyph exampleLabel example links { ...PublishedAction } }
        closingLine action { ...PublishedAction }
      }
${PUBLISHED_CASESTUDYCARDS}
      ... on ComponentSharedOfferSheetSection {
        id heading anchorId description offerSurface: surface offerSide: mediaSide offerPresentation: presentation
        action { ...PublishedAction }
        numbered listItems { id eyebrow title body icon scene }
        parts { id title body scene }
        before { kind prose { body } }
        after { kind prose { body } }
        offerCards: cards { id variant title description descriptionRich scene }
      }
${PUBLISHED_TESTIMONIALSECTION}
${PUBLISHED_ENGAGEMENTOPTIONS}
      ... on ComponentSharedIndustryGrid {
        id heading anchorId industrySurface: surface industrySide: mediaSide selectionMode
        action { ...PublishedAction }
        expertises { title expertise { documentId name slug } }
        destinations { title href }
      }
      ... on ComponentResourceOtherResources {
        id heading anchorId description resourcesSurface: surface resourcePresentation: presentation
        items { id icon resolved }
        resources {
          documentId title slug description readingTime resourceType { name slug }
          thumbnail { title description readingTime omitReadingTime scene image { ...PublishedImage } relatedImage { ...PublishedImage } }
        }
      }
${PUBLISHED_CTA}
${PUBLISHED_FAQSECTION}
    }
  }
}

${PUBLISHED_FIELDS}
`;
