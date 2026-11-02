const FILE = /* GraphQL */ `
  fragment ResourceFile on UploadFile {
    url
    alternativeText
    caption
    width
    height
    formats
    mime
  }
`;
const CARD = /* GraphQL */ `
  fragment ResourcePerson on EmployeeProfile {
    documentId
    name
    designation
    smallDescription
    largeDescription
    linkedInProfile
    profileImage {
      ...ResourceFile
    }
  }
  fragment ResourceCard on Resource {
    documentId
    slug
    title
    description
    publishedAt
    updatedAt
    createdAt
    publicationDate
    lastUpdatedDate
    readingTime
    resourceType {
      documentId
      name
      slug
      heroMode
    }
    stage {
      documentId
      name
      slug
    }
    industry {
      documentId
      name
      slug
    }
    topics(pagination: { limit: 100 }) {
      documentId
      name
    }
    thumbnail {
      ...ResourceFile
    }
    heroBanner {
      mediaType
      youtubeUrl
      image {
        ...ResourceFile
      }
    }
    writtenBy {
      ...ResourcePerson
    }
    coAuthors(pagination: { limit: 100 }) {
      ...ResourcePerson
    }
    eventDetails(pagination: { limit: 100 }) {
      id
      location
      date
    }
  }
`;

export const RESOURCE_LIST_QUERY = /* GraphQL */ `
  query PublishedResources($page: Int!) {
    resources_connection(
      status: PUBLISHED
      sort: ["publicationDate:desc", "slug:asc"]
      pagination: { page: $page, pageSize: 100 }
    ) {
      pageInfo {
        total
        page
        pageCount
        pageSize
      }
      nodes {
        ...ResourceCard
      }
    }
  }
  ${CARD}
  ${FILE}
`;

export const RESOURCE_BY_SLUG_QUERY = /* GraphQL */ `
  query PublishedResource($slug: String!) {
    resources(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
      ...ResourceCard
      showTableOfContents
      outline {
        anchorId
        label
      }
      body {
        __typename
        ... on ComponentResourceSectionHeading {
          id
          eyebrow
          heading2
          anchorId
          navigationLabel
        }
        ... on ComponentResourceRichText {
          id
          body
        }
        ... on ComponentResourceImageGrid {
          id
          gridColumns: columns
          showCaptions
          images(pagination: { limit: 100 }) {
            ...ResourceFile
          }
        }
        ... on ComponentResourceTable {
          id
          caption
          summary
          tableColumns: columns(pagination: { limit: 100 }) {
            heading
          }
          tableRows: rows(pagination: { limit: 100 }) {
            rowHeading
            cells(pagination: { limit: 100 }) {
              content
            }
          }
        }
        ... on ComponentResourceCallout {
          id
          heading
          body
        }
        ... on ComponentResourceInsights {
          id
          insightsTitle: title
          body
        }
        ... on ComponentResourceSeparator {
          id
          title
        }
        ... on ComponentResourceVideo {
          id
          mediaType
          title
          description
          youtubeUrl
          autoplay
          loop
          videoFile {
            ...ResourceFile
          }
          thumbnail {
            ...ResourceFile
          }
        }
        ... on ComponentResourceEmbed {
          id
          embedTitle: title
          description
          url
          embedCode
          width
          height
          thumbnail {
            ...ResourceFile
          }
        }
        ... on ComponentResourceCode {
          id
          codeSnippet
        }
      }
      exploreOtherResources {
        title
        resourceOne {
          ...ResourceCard
        }
        resourceTwo {
          ...ResourceCard
        }
        resourceThree {
          ...ResourceCard
        }
      }
      cta {
        heading
        description
        ctaType
        disclaimer
        button {
          name
          href
          isExternal
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
  ${CARD}
  ${FILE}
`;
