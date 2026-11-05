export const CONTACT_QUERY = /* GraphQL */ `
  query GetContactPage($status: PublicationStatus = PUBLISHED) {
    contactUs(status: $status) {
      documentId
      heading
      description
      createdAt
      updatedAt
      publishedAt

      cards {
        id
        heading
        icon {
          documentId
          url
          alternativeText
          width
          height
          formats
          mime
        }
        link {
          id
          name
          href
          description
          isExternal
          icon {
            documentId
            url
            alternativeText
          }
        }
      }

      socialMedia {
        id
        name
        href
        description
        isExternal
        icon {
          documentId
          url
          alternativeText
        }
      }

      seo {
        metaTitle
        metaDescription
        slug
        canonicalURL
        robot
        focusString
        graphCode
      }
    }
  }
`;
