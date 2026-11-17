export const SERVICE_BY_SLUG_QUERY = /* GraphQL */ `
  query GetServiceBySlug($slug: String!, $status: PublicationStatus = PUBLISHED) {
    servicePage: services(
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
          ...ServiceButtonFields
        }
      }

      content {
        __typename

        ... on ComponentServiceSectionHeading {
          id
          sectionHeading: heading
          anchorId
          navigationLabel
        }

        ... on ComponentServiceRichText {
          id
          richTextBody: body
        }

        ... on ComponentServiceCardGrid {
          id
          gridColumns: columns
          gridCards: cards {
            id
            eyebrow
            title
            body
            labelledItems {
              ...ServiceLabelledItemFields
            }
            link {
              ...ServiceLinkFields
            }
          }
        }

        ... on ComponentServiceComparisonCards {
          id
          comparisonItems: cards {
            id
            title
            summary
            badge
            isRecommended
            details {
              ...ServiceLabelledItemFields
            }
          }
        }

        ... on ComponentServiceTable {
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

        ... on ComponentServiceQuote {
          id
          quote
          attribution
          role
          sourceLink {
            ...ServiceLinkFields
          }
        }

        ... on ComponentServiceCallout {
          id
          label
          calloutHeading: heading
          calloutBody: body
          tone
        }

        ... on ComponentServiceLabelledList {
          id
          displayStyle
          items {
            ...ServiceLabelledItemFields
          }
        }

        ... on ComponentServiceTwoColumnContent {
          id
          left {
            ...ServiceContentColumnFields
          }
          right {
            ...ServiceContentColumnFields
          }
        }

        ... on ComponentServiceLinkGroup {
          id
          linkGroupHeading: heading
          description
          groupLinks: links {
            ...ServiceLinkFields
          }
        }

        ... on ComponentSharedMedia {
          id
          file {
            ...ServiceFileFields
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
          ...ServiceButtonFields
        }
      }

      cta {
        ...CtaFields
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

  fragment CtaFields on ComponentSharedCta {
    heading
    description
    disclaimer
  }

  fragment ServiceLabelledItemFields on ComponentServiceLabelledItem {
    id
    label
    title
    body
    link {
      ...ServiceLinkFields
    }
  }

  fragment ServiceContentColumnFields on ComponentServiceContentColumn {
    id
    eyebrow
    heading
    body
    labelledItems {
      ...ServiceLabelledItemFields
    }
    links {
      ...ServiceLinkFields
    }
  }

  fragment ServiceLinkFields on ComponentElementsLink {
    id
    name
    href
    description
    isExternal
    icon {
      ...ServiceFileFields
    }
  }

  fragment ServiceButtonFields on ComponentElementsButtons {
    id
    name
    href
    description
    isExternal
    icon {
      ...ServiceFileFields
    }
  }

  fragment ServiceFileFields on UploadFile {
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
