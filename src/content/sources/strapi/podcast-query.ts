export const PODCAST_BY_SLUG_QUERY = /* GraphQL */ `
  query PodcastInternalPage($podcastSlug: String!, $blogLimit: Int = 3) {
    podcastInternal: podcasts(
      filters: { slug: { eq: $podcastSlug } }
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
        ...PodcastFileFields
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

        ... on ComponentPodcasteEventsInterviewsShadowCard {
          id
          heading
          shadowDescription: description
          isShadowVisible
          isBackgroundAvailable
          link {
            name
            href
            description
            isExternal
            icon {
              url
              alternativeText
            }
          }
        }

        ... on ComponentBlogAndCasestudiesVideo {
          id
          title
          videoDescription: description
          autoplay
          loop
          thumbnail {
            ...PodcastFileFields
          }
          videoFile {
            ...PodcastFileFields
            name
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
            ...PodcastFileFields
          }
        }

        ... on ComponentBlogAndCasestudiesBlogOrCasestudyText {
          id
          blogContent
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
        ...PodcastFileFields
      }
    }
  }

  fragment PodcastFileFields on UploadFile {
    url
    alternativeText
    caption
    width
    height
    formats
    mime
  }
`;
