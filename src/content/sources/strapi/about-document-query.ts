export const ABOUT_DOCUMENT_QUERY = /* GraphQL */ `
  query PublishedAboutDocument {
    about(status: PUBLISHED) {
      documentId
      title
      updatedAt
      hero {
        eyebrow
        highlightedText
        description
        record
        image {
          ...AboutDocumentFile
        }
      }
      content {
        __typename
        ... on ComponentServiceSectionHeading {
          id
          sectionHeading: heading
          anchorId
        }
        ... on ComponentAboutServiceGrid {
          id
          items {
            id
            title
            description
            href
            isExternal
          }
        }
        ... on ComponentServiceRichText {
          id
          body
        }
        ... on ComponentServiceLabelledList {
          id
          items {
            id
            label
            title
            body
            link {
              ...AboutDocumentLink
            }
          }
        }
        ... on ComponentServiceCardGrid {
          id
          cards {
            id
            title
            body
            cover {
              ...AboutDocumentFile
            }
            link {
              ...AboutDocumentLink
            }
          }
        }
        ... on ComponentAboutPeople {
          id
          people {
            documentId
            name
            designation
            description
            linkedInProfile
          }
        }
        ... on ComponentAboutImageStory {
          id
          storyHeading: heading
          body
          image {
            ...AboutDocumentFile
          }
        }
        ... on ComponentServiceLinkGroup {
          id
          linkHeading: heading
          description
          links {
            ...AboutDocumentLink
          }
        }
        ... on ComponentServiceTable {
          id
          caption
          summary
          tableColumns: columns {
            heading
          }
          rows {
            rowHeading
            cells {
              content
            }
          }
        }
        ... on ComponentServiceQuote {
          id
          quote
          attribution
          role
          company
          rating
          profileImage {
            ...AboutDocumentFile
          }
        }
        ... on ComponentServiceFaqSection {
          id
          eyebrow
          faqHeading: heading
          description
          faqs {
            documentId
            question
            answer
            isActive
          }
        }
        ... on AboutCta {
          id
          ctaHeading: heading
          description
          ctaType
          button {
            ...AboutDocumentLink
          }
        }
      }
      seo {
        metaTitle
        metaDescription
        canonicalURL
        robot
        structuredData
      }
    }
  }
  fragment AboutDocumentFile on UploadFile {
    url
    alternativeText
    width
    height
    formats
    mime
  }
  fragment AboutDocumentLink on ComponentElementsLink {
    name
    href
    description
    isExternal
  }
`;
