export const EVENT_BY_SLUG_QUERY = /* GraphQL */ `
  query EventInternalPage($eventSlug: String!, $blogLimit: Int = 3) {
    eventInternal: events(
      filters: { slug: { eq: $eventSlug } }
      status: PUBLISHED
      pagination: { page: 1, pageSize: 1 }
    ) {
      documentId
      title
      slug
      description
      createdAt
      publishedAt

      thumbnail {
        ...EventFileFields
      }

      featureImage {
        ...EventFileFields
      }

      eventWhereAbout {
        id
        descOne
        descTwo
      }

      tags {
        documentId
        name
      }

      categories {
        documentId
        name
        slug
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

      mainSection {
        __typename

        ... on ComponentBlogAndCasestudiesBlogOrCasestudyText {
          id
          blogContent
        }

        ... on ComponentBlogAndCasestudiesVideo {
          id
          title
          videoDescription: description
          autoplay
          loop
          thumbnail {
            ...EventFileFields
          }
          videoFile {
            ...EventFileFields
            name
          }
        }

        ... on ComponentPodcasteEventsInterviewsShadowCard {
          id
          heading
          shadowDescription: description
          isShadowVisible
          isBackgroundAvailable
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

        ... on ComponentBlogAndCasestudiesTldrSection {
          id
          heading
          tdlrDescription
        }

        ... on ComponentBlogAndCasestudiesSepration {
          id
          title
          styles
          color
          thickness
          marginTop
          marginBottom
        }

        ... on ComponentBlogAndCasestudiesSectionImage {
          id
          layout
          imageSection {
            ...EventFileFields
          }
        }

        ... on Error {
          code
          message
        }
      }
    }

    exploreOtherResources: blogs(
      status: PUBLISHED
      sort: ["publishedAt:desc"]
      pagination: { page: 1, pageSize: $blogLimit }
    ) {
      documentId
      title
      slug
      createdAt
      publishedAt
      seo {
        metaDescription
      }
      mainSection {
        __typename
        ... on ComponentBlogAndCasestudiesIframe {
          id
          title
          description
          url
          embedCode
        }
      }
      thumbnail {
        ...EventFileFields
      }
    }
  }

  fragment EventFileFields on UploadFile {
    documentId
    url
    alternativeText
    caption
    width
    height
    formats
    mime
  }
`;
