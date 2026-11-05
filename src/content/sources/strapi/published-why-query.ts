import {
  PUBLISHED_HERO,
  PUBLISHED_FIELDS,
  PUBLISHED_CTA,
  PUBLISHED_TESTIMONIALSECTION,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
} from './published-page-fields';
export const WHY_QUERY = `query PublishedWhy {page:whyTcules(status:PUBLISHED){documentId routePath ${PUBLISHED_HERO} content{__typename
      ... on ComponentSharedClientGrid { title anchorId markOverrides { client { documentId } media {url width height alternativeText} density width height } clients { documentId name density media { url width height alternativeText } } }
      ... on ComponentSharedCaseStudyCards {
        heading anchorId casePresentation:presentation action { name href }
        cards { title description descriptionRich showCta ctaText image { ...PublishedImage } caseStudy { documentId title slug publishedAt thumbnail { image { ...PublishedImage } } } }
      }
      ... on ComponentSharedReasonsSection { heading description anchorId entries { title body illustration { source scene image { ...PublishedImage } } } actions { name href } }
      ... on ComponentSharedComparisonSection { heading description anchorId action { name href } blocks { kind prose { body } table { columns { heading } rows { heading cells { body } } } } }

 ... on ComponentSharedOfferSheetSection { heading anchorId description sheetPresentation:presentation listEntries{title body icon} }
 ${PUBLISHED_CTA}${PUBLISHED_TESTIMONIALSECTION}${PUBLISHED_ENGAGEMENTOPTIONS}${PUBLISHED_FAQSECTION}
}}}${PUBLISHED_FIELDS}`;
