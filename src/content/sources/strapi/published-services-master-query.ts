import {
  PUBLISHED_CASESTUDYCARDS,
  PUBLISHED_TESTIMONIALSECTION,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
  PUBLISHED_CTA,
  PUBLISHED_HERO,
  PUBLISHED_FIELDS,
} from './published-page-fields';

export const PUBLISHED_SERVICES_MASTER_QUERY = `
query PublishedServicesMaster {
  serviceMaster(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedClientGrid {
        id title anchorId clientSurface: surface gridDensity: density
        clients { documentId name density media { ...ServicesUpload } }
        namedClients { documentId name }
        markOverrides {
          client { documentId }
          media { ...ServicesUpload }
          density width height
        }
      }
      ... on ComponentSharedServiceCard {
        id heading anchorId description serviceSurface: surface
        variant columns singleGridPresentation
        singleGridContent { ...ServiceTile }
        twoGridContent {
          id ctaText
          content { ...ServiceTile }
          detail { label body }
        }
        before { id kind prose { body } }
        after { id kind prose { body } }
        closingRoutes { id question answer actions { ...PublishedAction } }
      }
      ... on ComponentSharedWhySection {
        id heading anchorId whySurface: surface
        cta { ...PublishedAction }
        whyCards: cards {
          id variant title
          illustration { ...ServicesUpload }
          media { ...ServicesUpload }
          points { text }
        }
      }
      ... on ComponentSharedIndustryGrid {
        id heading anchorId industrySurface: surface industrySide: mediaSide selectionMode
        action { ...PublishedAction }
        expertises { title expertise { documentId name slug } }
        destinations { title href }
      }
${PUBLISHED_CASESTUDYCARDS}
${PUBLISHED_TESTIMONIALSECTION}
${PUBLISHED_ENGAGEMENTOPTIONS}
${PUBLISHED_CTA}
${PUBLISHED_FAQSECTION}
    }
  }
}

fragment ServiceTile on ComponentServiceCardTile {
  id title description href supportingCopy ctaText
  service { documentId name slug hero { title description } }
  illustration { source scene image { ...PublishedImage } }
  detail { label body }
}

fragment ServicesUpload on UploadFile {
  url alternativeText width height formats
}
${PUBLISHED_FIELDS}
`;
