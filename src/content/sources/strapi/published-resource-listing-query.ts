import { PUBLISHED_CTA, PUBLISHED_FIELDS, PUBLISHED_HERO } from './published-page-fields';

/** Strapi's relation page size: a relation returns at most 100 records per read. */
export const RESOURCE_PAGE_SIZE = 100;

/**
 * One Resource as the hub's card reads it: its card copy (`thumbnail`), the type it is filed under, the
 * taxonomies the finder filters by, and an event's date. Read through the Resource Index's relation,
 * never copied into the listing.
 */
const LISTING_RESOURCE = `
fragment ListingResource on Resource {
  documentId slug routePath title description
  publicationDate listingDate omitListingDate readingTime
  resourceType { documentId name slug }
  topics { documentId name }
  stage { documentId name slug }
  industries { documentId name slug }
  eventListing { startsAt place }
  thumbnail { title description scene readingTime omitReadingTime image { ...ListingImage } }
}
fragment ListingImage on ComponentContentImage {
  altText kind panel shadow focusX focusY toneTemperature toneSaturation
  file { url width height formats alternativeText }
}
`;

/**
 * The published Resource Listing (`/insights`): the fixed Hero, then every Page Content member in the
 * editor's order. The Resource Index's first page of Resources comes with it; the rest are read page by
 * page with `resourceIndexPageQuery`.
 */
export const PUBLISHED_RESOURCE_LISTING_QUERY = `
query PublishedResourceListing {
  resourceListing(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentListingResourceIndex {
        id
        resources(pagination: { start: 0, limit: ${RESOURCE_PAGE_SIZE} }) { ...ListingResource }
      }
${PUBLISHED_CTA}
    }
  }
}
${LISTING_RESOURCE}
${PUBLISHED_FIELDS}
`;

/** One further page of every Resource Index's Resources, from `start` (a whole number). */
export function resourceIndexPageQuery(start: number): string {
  if (!Number.isSafeInteger(start) || start < 0)
    throw new Error(`Invalid Resource offset ${start}`);
  return `
query PublishedResourceIndexPage {
  resourceListing(status: PUBLISHED) {
    content {
      __typename
      ... on ComponentListingResourceIndex {
        id
        resources(pagination: { start: ${start}, limit: ${RESOURCE_PAGE_SIZE} }) { ...ListingResource }
      }
    }
  }
}
${LISTING_RESOURCE}
`;
}
