import {
  PUBLISHED_CASESTUDYCARDS,
  PUBLISHED_TESTIMONIALSECTION,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
  PUBLISHED_CTA,
  PUBLISHED_HERO,
  PUBLISHED_FIELDS,
} from './published-page-fields';

export const PUBLISHED_ABOUT_QUERY = `query PublishedAbout {
  about(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename

      ... on ComponentSharedServiceCard {
        id heading anchorId description variant serviceSurface: surface serviceSide: mediaSide columns singleGridPresentation
        singleGridContent { id title description href supportingCopy ctaText illustration { source scene image { ...PublishedImage } } service { documentId name slug } expertise { documentId name slug } caseStudy { documentId title slug } audit { documentId name slug } detail { label body } }
        closingRoutes { __typename } twoGridContent { __typename } before { __typename } after { __typename }
      }
      ... on ComponentSharedAudienceSection {
        id heading anchorId description afterCopy: after entries { id title icon }
      }
      ... on ComponentSharedLinkBanner {
        id anchorId body action { ...PublishedAction }
      }
      ... on ComponentSharedPeopleSection {
        id heading anchorId description profiles { id name role bio linkedin { ...PublishedAction } }
      }
      ... on ComponentSharedEditorialSection {
        id heading anchorId navigationLabel editorialSurface: surface editorialSide: mediaSide editorialPresentation: presentation
        media { ...PublishedImage }
        blocks { ...AboutBlock }
      }
      ... on ComponentSharedLinksIsland {
        id heading anchorId links { ...PublishedAction }
      }
      ... on ComponentSharedComparisonSection {
        id heading anchorId description comparisonSurface: surface comparisonSide: mediaSide
        blocks { ...AboutBlock }
      }
${PUBLISHED_CASESTUDYCARDS}
${PUBLISHED_TESTIMONIALSECTION}
${PUBLISHED_ENGAGEMENTOPTIONS}
${PUBLISHED_FAQSECTION}
${PUBLISHED_CTA}
    }
  }
}

fragment AboutBlock on ComponentContentFlowBlock {
  id kind prose { body } illustration { source scene image { ...PublishedImage } } table { __typename caption split columns { __typename heading } rows { __typename heading cells { __typename body } } }
}
${PUBLISHED_FIELDS}

`;
