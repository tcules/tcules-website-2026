export const BLOG_BY_SLUG_QUERY = /* GraphQL */ `
  query GetBlogInternalPage(
    $slug: String!
    $status: PublicationStatus = PUBLISHED
    $exploreLimit: Int = 3
  ) {
    currentBlog: blogs(
      status: $status
      filters: { slug: { eq: $slug } }
      pagination: { limit: 1 }
    ) {
      documentId
      title
      slug
      publishedAt
      updatedAt
      createdAt

      thumbnail {
        ...BlogFileFields
      }

      featureImage {
        ...BlogFileFields
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

      blogProfileSection {
        id
        name
        designation
        profilePicture {
          ...BlogFileFields
        }
      }

      mainSection {
        __typename

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

        ... on ComponentBlogAndCasestudiesBlogOrCasestudyText {
          id
          blogContent
        }

        ... on ComponentSharedRichText {
          id
          body
        }

        ... on ComponentBlogAndCasestudiesSectionImage {
          id
          layout
          imageSection {
            ...BlogFileFields
          }
        }

        ... on ComponentBlogAndCasestudiesVideo {
          id
          title
          youtubeUrl: title
          description
          autoplay
          loop
          thumbnail {
            ...BlogFileFields
          }
          videoFile {
            ...BlogFileFields
          }
        }

        ... on ComponentBlogAndCasestudiesIframe {
          id
          title
          embedCode
          url
          description
          width
          height
          thumbnail {
            ...BlogFileFields
          }
        }

        ... on ComponentBlogAndCasestudiesCodeSection {
          id
          codeSnippet
        }
      }

      ctoSection {
        id
        heading
        description
        link {
          ...BlogLinkFields
        }
      }

      seo {
        id
        metaTitle
        metaDescription
        slug
        canonicalURL
        robot
        structuredData
        codeJson
        focusString
        graphCode
      }
    }

    exploreOtherResources: blogs(
      status: $status
      filters: { slug: { ne: $slug } }
      sort: ["publishedAt:desc"]
      pagination: { limit: $exploreLimit }
    ) {
      documentId
      title
      slug
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
        ...BlogFileFields
      }
      featureImage {
        ...BlogFileFields
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
    }
  }

  fragment BlogFileFields on UploadFile {
    documentId
    url
    alternativeText
    caption
    width
    height
    formats
    mime
  }

  fragment BlogLinkFields on ComponentElementsLink {
    id
    name
    href
    description
    isExternal
  }
`;
