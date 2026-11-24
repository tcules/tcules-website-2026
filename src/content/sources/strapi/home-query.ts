import {
  PUBLISHED_CASESTUDYCARDS,
  PUBLISHED_TESTIMONIALSECTION,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
  PUBLISHED_CTA,
  PUBLISHED_HERO,
  PUBLISHED_FIELDS,
  PUBLISHED_PRODUCTSTAGES,
  PUBLISHED_CHATTHREAD,
  PUBLISHED_FREETOOLS,
  PUBLISHED_OTHERRESOURCES,
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
${PUBLISHED_OTHERRESOURCES}
${PUBLISHED_CTA}
${PUBLISHED_FAQSECTION}
${PUBLISHED_PRODUCTSTAGES}
${PUBLISHED_CHATTHREAD}
${PUBLISHED_FREETOOLS}
    }
  }
}

${PUBLISHED_FIELDS}
`;
