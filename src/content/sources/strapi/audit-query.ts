export const AUDIT_BY_SLUG_QUERY = /* GraphQL */ `
  query GetAuditBySlug($slug: String!, $status: PublicationStatus = PUBLISHED) {
    auditPage: audits(
      status: $status
      filters: { slug: { eq: $slug } }
      pagination: { limit: 1 }
    ) {
      documentId
      title
      slug
      createdAt
      updatedAt
      publishedAt

      hero {
        id
        eyebrow
        highlightedText
        description
        tags {
          id
          listText
        }
        actions {
          ...AuditButtonFields
        }
      }

      content {
        __typename

        ... on ComponentAuditSectionHeading {
          id
          sectionHeading: heading
          anchorId
          navigationLabel
        }

        ... on ComponentAuditRichText {
          id
          body
        }

        ... on ComponentAuditCardGrid {
          id
          cardGridColumns: columns
          cardGridCards: cards {
            id
            eyebrow
            title
            body
            labelledItems {
              ...AuditLabelledItemFields
            }
            link {
              ...AuditLinkFields
            }
          }
        }

        ... on ComponentAuditComparisonCards {
          id
          comparisonCards: cards {
            id
            title
            summary
            badge
            isRecommended
            details {
              ...AuditLabelledItemFields
            }
          }
        }

        ... on ComponentAuditTable {
          id
          caption
          summary
          tableColumns: columns {
            id
            heading
          }
          tableRows: rows {
            id
            rowHeading
            cells {
              id
              content
            }
          }
        }

        ... on ComponentAuditQuote {
          id
          quote
          attribution
          role
          sourceLink {
            ...AuditLinkFields
          }
        }

        ... on ComponentAuditCallout {
          id
          label
          calloutHeading: heading
          body
          tone
        }

        ... on ComponentAuditLabelledList {
          id
          displayStyle
          items {
            ...AuditLabelledItemFields
          }
        }

        ... on ComponentAuditTwoColumnContent {
          id
          left {
            ...AuditContentColumnFields
          }
          right {
            ...AuditContentColumnFields
          }
        }

        ... on ComponentAuditLinkGroup {
          id
          linkGroupHeading: heading
          description
          links {
            ...AuditLinkFields
          }
        }

        ... on ComponentSharedMedia {
          id
          file {
            ...AuditFileFields
          }
        }
      }

      faqSection {
        id
        eyebrow
        heading
        description
        faqs(filters: { isActive: { eq: true } }, pagination: { limit: 100 }) {
          documentId
          question
          answer
          slug
          isActive
        }
      }

      capabilitiesCta {
        id
        heading
        description
        descriptionTwo
        label {
          id
          listText
        }
        heroSectionButton {
          ...AuditButtonFields
        }
      }

      seo {
        id
        metaTitle
        metaDescription
        slug
        canonicalURL
        structuredData
        codeJson
        focusString
        graphCode
        robot
      }
    }
  }

  fragment AuditLabelledItemFields on ComponentAuditLabelledItem {
    id
    label
    title
    body
    link {
      ...AuditLinkFields
    }
  }

  fragment AuditContentColumnFields on ComponentAuditContentColumn {
    id
    eyebrow
    heading
    body
    labelledItems {
      ...AuditLabelledItemFields
    }
    links {
      ...AuditLinkFields
    }
  }

  fragment AuditLinkFields on ComponentElementsLink {
    id
    name
    href
    description
    isExternal
    icon {
      ...AuditFileFields
    }
  }

  fragment AuditButtonFields on ComponentElementsButtons {
    id
    name
    href
    description
    isExternal
    icon {
      ...AuditFileFields
    }
  }

  fragment AuditFileFields on UploadFile {
    documentId
    name
    alternativeText
    caption
    width
    height
    formats
    url
    mime
    size
  }
`;
