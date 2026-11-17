import { PUBLISHED_CTA, PUBLISHED_FIELDS } from './published-page-fields';

export const PUBLISHED_AUTHOR_QUERY = `
query PublishedAuthor($slug: String!) {
  authors(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    documentId slug routePath name designation description linkedInProfile
    profilePicture { url alternativeText width height formats }
    seo {
      metaTitle metaDescription canonicalURL robot structuredData focusString
      secondaryKeywords { text }
      openGraph { title description imageAlt type url siteName locale image { url width height alternativeText } }
      twitter { title description imageAlt card siteHandle creatorHandle image { url width height alternativeText } }
      technical { index follow noSnippet noImageIndex maxSnippet maxImagePreview maxVideoPreview alternates { language url } }
    }
  }
  seoSettings { siteName siteURL language twitterSiteHandle allowIndexing defaultImage { url width height alternativeText } }
  resourceListing(status: PUBLISHED) {
    routePath
    content { __typename ${PUBLISHED_CTA} }
  }
}
${PUBLISHED_FIELDS}
`;

/** Read every published primary/coauthored piece. Listing credits customize card bylines,
 * and do not turn a person into a resource's author. Offset pagination avoids a silent cap. */
export function authorResourcesQuery(offset = 0, limit = 100) {
  if (
    !Number.isSafeInteger(offset) ||
    offset < 0 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 100
  )
    throw new Error('Invalid author resource pagination');
  return `
query PublishedAuthorResources($slug: String!) {
  resources_connection(status: PUBLISHED,
    filters: { or: [{ author: { slug: { eq: $slug } } }, { coAuthors: { slug: { eq: $slug } } }] },
    pagination: { start: ${offset}, limit: ${limit} }, sort: ["publicationDate:desc", "slug:asc"]) {
    pageInfo { total }
    nodes {
      documentId slug routePath title description publicationDate listingDate omitListingDate readingTime
      author { slug } coAuthors { slug }
      resourceType { name slug }
      topics { documentId name }
      industries { documentId name }
      stage { documentId name }
      expertises { documentId name }
      thumbnail {
        title description scene readingTime omitReadingTime
        image {
          altText kind panel shadow focusX focusY toneTemperature toneSaturation
          file { url alternativeText width height formats }
        }
      }
    }
  }
}
`;
}
