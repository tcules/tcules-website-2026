export const GLOSSARY_BY_SLUG_QUERY = /* GraphQL */ `
  query GetGlossaryBySlug($slug: String!, $status: PublicationStatus = PUBLISHED) {
    glossaryPage: glossaries(
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
          ...GlossaryButtonFields
        }
      }

      content {
        __typename

        ... on ComponentGlossarySectionHeading {
          id
          sectionHeading: heading
          anchorId
          navigationLabel
        }

        ... on ComponentGlossaryRichText {
          id
          richTextBody: body
        }

        ... on ComponentGlossaryCardGrid {
          id
          gridColumns: columns
          gridCards: cards {
            id
            eyebrow
            title
            body
            labelledItems {
              ...GlossaryLabelledItemFields
            }
            link {
              ...GlossaryLinkFields
            }
          }
        }

        ... on ComponentGlossaryComparisonCards {
          id
          comparisonItems: cards {
            id
            title
            summary
            badge
            isRecommended
            details {
              ...GlossaryLabelledItemFields
            }
          }
        }

        ... on ComponentGlossaryTable {
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

        ... on ComponentGlossaryQuote {
          id
          quote
          attribution
          role
          sourceLink {
            ...GlossaryLinkFields
          }
        }

        ... on ComponentGlossaryCallout {
          id
          label
          calloutHeading: heading
          calloutBody: body
          tone
        }

        ... on ComponentGlossaryLabelledList {
          id
          displayStyle
          items {
            ...GlossaryLabelledItemFields
          }
        }

        ... on ComponentGlossaryTwoColumnContent {
          id
          left {
            ...GlossaryContentColumnFields
          }
          right {
            ...GlossaryContentColumnFields
          }
        }

        ... on ComponentGlossaryLinkGroup {
          id
          linkGroupHeading: heading
          description
          groupLinks: links {
            ...GlossaryLinkFields
          }
        }

        ... on ComponentSharedMedia {
          id
          file {
            ...GlossaryFileFields
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
          ...GlossaryButtonFields
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

  fragment GlossaryLabelledItemFields on ComponentGlossaryLabelledItem {
    id
    label
    title
    body
    link {
      ...GlossaryLinkFields
    }
  }

  fragment GlossaryContentColumnFields on ComponentGlossaryContentColumn {
    id
    eyebrow
    heading
    body
    labelledItems {
      ...GlossaryLabelledItemFields
    }
    links {
      ...GlossaryLinkFields
    }
  }

  fragment GlossaryLinkFields on ComponentElementsLink {
    id
    name
    href
    description
    isExternal
    icon {
      ...GlossaryFileFields
    }
  }

  fragment GlossaryButtonFields on ComponentElementsButtons {
    id
    name
    href
    description
    isExternal
    icon {
      ...GlossaryFileFields
    }
  }

  fragment GlossaryFileFields on UploadFile {
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
