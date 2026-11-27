/**
 * One Glossary record by slug, from the new CMS (verified against the live response, 5 Nov 2026).
 * The dynamic zone's components share field names with different nullability (`anchorId` is
 * required on a heading, optional on a FAQ), so each is aliased to keep the selection valid.
 * SEO is not on the record: it is the route-keyed `seoPages` entry, read through `getPageSeo`.
 */
export const PUBLISHED_GLOSSARY_QUERY = `
query PublishedGlossary($slug: String!) {
  glossaries(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    documentId slug routePath term publishedAt updatedAt
    hero {
      title eyebrow description secondaryDescription
      additionalParagraphs { text }
      breadcrumbs { label href }
      actions { ...GlossaryAction }
    }
    content {
      __typename
      ... on ComponentContentHeading {
        id heading headingAnchor: anchorId headingNavigation: navigationLabel
      }
      ... on ComponentContentMarkdown { id body }
      ... on ComponentContentDataTable {
        id caption columns { heading } rows { heading cells { body } }
      }
      ... on ComponentContentLinkList { id links { ...GlossaryAction } }
      ... on ComponentGlossaryTermGroup {
        id heading termsAnchor: anchorId termsNavigation: navigationLabel
        terms { id term { documentId slug routePath term } }
      }
      ... on ComponentSharedFaqSection {
        id heading faqAnchor: anchorId faqNavigation: navigationLabel description
        faqs { documentId question answer isActive }
      }
    }
  }
}
fragment GlossaryAction on ComponentSharedCtaButton {
  name href description icon isExternal
}
`;
