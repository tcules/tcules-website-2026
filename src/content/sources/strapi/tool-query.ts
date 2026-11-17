export const TOOL_BY_SLUG_QUERY = /* GraphQL */ `
  query GetTools($slug: String!, $status: PublicationStatus = PUBLISHED) {
    tools(status: $status, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
      documentId
      title
      slug
      publishedAt

      hero {
        eyebrow
        highlightedText
        description
      }

      content {
        __typename

        ... on ComponentToolSectionHeading {
          sectionHeading: heading
          anchorId
          navigationLabel
        }

        ... on ComponentToolRichText {
          body
        }

        ... on ComponentToolCardGrid {
          cardGridColumns: columns
          cardGridCards: cards {
            eyebrow
            title
            body
            labelledItems {
              label
              title
              body
            }
          }
        }

        ... on ComponentToolComparisonCards {
          comparisonCards: cards {
            title
            summary
            badge
            isRecommended
            details {
              label
              title
              body
            }
          }
        }

        ... on ComponentToolTable {
          caption
          summary
          tableColumns: columns {
            heading
          }
          tableRows: rows {
            rowHeading
            cells {
              content
            }
          }
        }

        ... on ComponentToolQuote {
          quote
          attribution
          role
        }

        ... on ComponentToolCallout {
          label
          calloutHeading: heading
          body
          tone
        }

        ... on ComponentToolLabelledList {
          displayStyle
          items {
            label
            title
            body
          }
        }

        ... on ComponentToolTwoColumnContent {
          left {
            eyebrow
            heading
            body
            labelledItems {
              label
              title
              body
            }
          }
          right {
            eyebrow
            heading
            body
            labelledItems {
              label
              title
              body
            }
          }
        }

        ... on ComponentToolLinkGroup {
          linkGroupHeading: heading
          description
          groupLinks: links {
            id
            name
            href
            description
            isExternal
          }
        }

        ... on ComponentSharedMedia {
          id
          file {
            documentId
            name
            alternativeText
            caption
            width
            height
            formats
            url
            mime
          }
        }
      }

      seo {
        metaTitle
        metaDescription
        canonicalURL
        structuredData
        codeJson
        graphCode
        robot
      }
    }
  }
`;
