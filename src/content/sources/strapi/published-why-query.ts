import {
  PUBLISHED_HERO,
  PUBLISHED_FIELDS,
  PUBLISHED_CTA,
  PUBLISHED_TESTIMONIALSECTION,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
} from './published-page-fields';
export const WHY_QUERY = `query PublishedWhy {page:whyTcules(status:PUBLISHED){documentId routePath ${PUBLISHED_HERO} content{__typename
      ... on ComponentSharedClientGrid { title anchorId whyGridSurface: surface markOverrides { client { documentId } media {url width height alternativeText} density width height } clients { documentId name density media { url width height alternativeText } } }
      ... on ComponentSharedCaseStudyCards {
        heading anchorId whyCasesSurface: surface casePresentation:presentation action { name href }
        cards { title description descriptionRich showCta ctaText image { ...PublishedImage } caseStudy { documentId title slug publishedAt thumbnail { image { ...PublishedImage } } } }
      }
      ... on ComponentSharedReasonsSection { heading description anchorId reasonsSurface: surface entries { title body illustration { source scene image { ...PublishedImage } } } actions { name href } }
      ... on ComponentSharedComparisonSection { heading description anchorId comparisonSurface: surface action { name href } blocks { kind prose { body } table { columns { heading } rows { heading cells { body } } } } }

 ... on ComponentSharedOfferSheetSection { heading anchorId description sheetSurface: surface sheetPresentation:presentation listEntries{title body icon} sheetCards: cards { title description descriptionRich scene } }
 ${PUBLISHED_CTA}${PUBLISHED_TESTIMONIALSECTION}${PUBLISHED_ENGAGEMENTOPTIONS}${PUBLISHED_FAQSECTION}
}}}${PUBLISHED_FIELDS}`;
