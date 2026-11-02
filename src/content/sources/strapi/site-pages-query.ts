/**
 * Every routed collection's slugs in one request, for the sitemap. Each collection is read at the
 * publication status its own page reads — the audit and tool routes render the latest
 * draft, while case-study routes render published entries only — so the
 * list names exactly the pages the site answers. Resources, services, expertise and glossary are appended from the new
 * CMS by their own published readers. `limit: -1` lifts Strapi's default page of 10.
 */
export const SITE_PAGES_QUERY = /* GraphQL */ `
  query SitePages {
    audits(status: DRAFT, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
    tools(status: DRAFT, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
    caseStudies(status: PUBLISHED, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
  }
`;
