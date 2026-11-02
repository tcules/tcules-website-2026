/**
 * Every routed collection's slugs in one request, for the sitemap. Each collection is read at the
 * publication status its own page reads — tool routes render the latest
 * draft, while case-study routes render published entries only — so the
 * list names exactly the pages the site answers. Resources, services, expertise, glossary and audits are appended from the new
 * CMS by their own published readers. `limit: -1` lifts Strapi's default page of 10.
 */
export const SITE_PAGES_QUERY = /* GraphQL */ `
  query SitePages {
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
