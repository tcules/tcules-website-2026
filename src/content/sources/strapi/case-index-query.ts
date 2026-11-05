import {
  PUBLISHED_CTA,
  PUBLISHED_FAQSECTION,
  PUBLISHED_FIELDS,
  PUBLISHED_HERO,
  PUBLISHED_TESTIMONIALSECTION,
} from './published-page-fields';

export const CASE_INDEX_QUERY = `
query PublishedCaseStudyIndex {
  caseStudyListing(status: PUBLISHED) {
    routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedClientGrid {
        id title anchorId gridSurface: surface gridDensity: density
        namedClients { documentId name }
        clients { documentId name density media { url alternativeText width height } }
        markOverrides { client { documentId } media { url alternativeText width height } density width height }
      }
      ... on ComponentListingCaseIndex {
        id
        finder {
          label railLabel searchLabel emptyText
          filters {
            source label
            options {
              label value
              industry { documentId name slug }
              stage { documentId name slug }
              service { documentId name slug }
            }
          }
        }
        groups(pagination: { limit: -1 }) {
          id heading anchorId
          stage { documentId name slug }
          entries(pagination: { limit: -1 }) {
            id kind
            bestFor { title body }
            comingSoon { title description image { ...PublishedImage } }
            card {
              title eyebrow description descriptionRich showCta ctaText
              image { ...PublishedImage }
              caseStudy { ...IndexCaseStudy }
            }
          }
        }
        cases(pagination: { limit: -1 }) { ...IndexCaseStudy }
      }
${PUBLISHED_TESTIMONIALSECTION}
${PUBLISHED_CTA}
${PUBLISHED_FAQSECTION}
    }
  }
}

fragment IndexCaseStudy on CaseStudy {
  documentId slug title
  stage { documentId name slug }
  industries { documentId name slug }
  services { documentId name slug }
  thumbnail { title eyebrow description showCta ctaText image { ...PublishedImage } }
}

${PUBLISHED_FIELDS}
`;
