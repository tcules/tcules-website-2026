export const SERVICES_MASTER_QUERY = /* GraphQL */ `
  query GetNewCapabilities($status: PublicationStatus = PUBLISHED) {
    newCapabilities(status: $status) {
      documentId
      createdAt
      updatedAt
      publishedAt

      capablitiesSingleType {
        __typename

        ... on ComponentServiceHeroSection {
          id
          capabilitiesHeroHeading: heading
          capabilitiesHeroDescription: description
          capabilitiesHeroDescriptionTwo: descriptionTwo

          label {
            id
            listText
          }

          heroSectionButton {
            ...NewCapabilitiesButtonFields
          }
        }

        ... on ComponentCapablitiesCapablitiesCardSection {
          id
          cardSectionHeading: heading
          cardSectionDescription: description
          serviceName

          icon {
            ...NewCapabilitiesFileFields
          }

          subRouteLink {
            ...NewCapabilitiesLinkFields
          }

          sectionCards {
            id
            heading
            description

            link {
              ...NewCapabilitiesLinkFields
            }

            icon {
              ...NewCapabilitiesFileFields
            }

            cardPoints {
              id
              listText
            }
          }
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

  fragment NewCapabilitiesLinkFields on ComponentElementsLink {
    id
    name
    href
    description
    isExternal

    icon {
      ...NewCapabilitiesFileFields
    }
  }

  fragment NewCapabilitiesButtonFields on ComponentElementsButtons {
    id
    name
    href
    description
    isExternal

    icon {
      ...NewCapabilitiesFileFields
    }
  }

  fragment NewCapabilitiesFileFields on UploadFile {
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
