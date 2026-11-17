export const EXPERTISE_BY_SLUG_QUERY = /* GraphQL */ `
  query GetExpertiseBySlug($slug: String!, $status: PublicationStatus = PUBLISHED) {
    expertisePage: expertises(
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
          ...ExpertiseButtonFields
        }
      }

      content {
        __typename

        ... on ComponentExpertiseSectionHeading {
          id
          sectionHeading: heading
          anchorId
          navigationLabel
        }

        ... on ComponentExpertiseRichText {
          id
          richTextBody: body
        }

        ... on ComponentExpertiseCardGrid {
          id
          gridColumns: columns
          gridCards: cards {
            id
            eyebrow
            title
            body
            labelledItems {
              ...ExpertiseLabelledItemFields
            }
            link {
              ...ExpertiseLinkFields
            }
          }
        }

        ... on ComponentExpertiseComparisonCards {
          id
          comparisonItems: cards {
            id
            title
            summary
            badge
            isRecommended
            details {
              ...ExpertiseLabelledItemFields
            }
          }
        }

        ... on ComponentExpertiseTable {
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

        ... on ComponentExpertiseQuote {
          id
          quote
          attribution
          role
          sourceLink {
            ...ExpertiseLinkFields
          }
        }

        ... on ComponentExpertiseCallout {
          id
          label
          calloutHeading: heading
          calloutBody: body
          tone
        }

        ... on ComponentExpertiseLabelledList {
          id
          displayStyle
          items {
            ...ExpertiseLabelledItemFields
          }
        }

        ... on ComponentExpertiseTwoColumnContent {
          id
          left {
            ...ExpertiseContentColumnFields
          }
          right {
            ...ExpertiseContentColumnFields
          }
        }

        ... on ComponentExpertiseLinkGroup {
          id
          linkGroupHeading: heading
          description
          groupLinks: links {
            ...ExpertiseLinkFields
          }
        }

        ... on ComponentSharedMedia {
          id
          file {
            ...ExpertiseFileFields
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
          ...ExpertiseButtonFields
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

  fragment ExpertiseLabelledItemFields on ComponentExpertiseLabelledItem {
    id
    label
    title
    body
    link {
      ...ExpertiseLinkFields
    }
  }

  fragment ExpertiseContentColumnFields on ComponentExpertiseContentColumn {
    id
    eyebrow
    heading
    body
    labelledItems {
      ...ExpertiseLabelledItemFields
    }
    links {
      ...ExpertiseLinkFields
    }
  }

  fragment ExpertiseLinkFields on ComponentElementsLink {
    id
    name
    href
    description
    isExternal
    icon {
      ...ExpertiseFileFields
    }
  }

  fragment ExpertiseButtonFields on ComponentElementsButtons {
    id
    name
    href
    description
    isExternal
    icon {
      ...ExpertiseFileFields
    }
  }

  fragment ExpertiseFileFields on UploadFile {
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
