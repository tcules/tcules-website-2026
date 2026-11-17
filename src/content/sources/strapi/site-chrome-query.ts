const NAV_LINK = 'label href status description external';
const FOOTER_LINK = 'name href description icon isExternal';

export const SITE_NAVIGATION_QUERY = `
  query PublishedSiteNavigation {
    navigation(status: PUBLISHED) {
      documentId
      configuration {
        surface
        items {
          id key label form href
          groups { label links { ${NAV_LINK} } }
          aside { label links { ${NAV_LINK} } }
          hub { ${NAV_LINK} }
          children { ${NAV_LINK} }
          rail { __typename }
        }
        cta { ${NAV_LINK} }
        ctaSecondary { ${NAV_LINK} }
      }
    }
  }
`;

export const SITE_FOOTER_QUERY = `
  query PublishedSiteFooter {
    footer(status: PUBLISHED) {
      documentId
      configuration {
        tagline address legal statement email legalCredit addressLabel socialLabel surface
        cta { ${FOOTER_LINK} }
        rating { score platform mark href detail }
        groups { id title links { ${FOOTER_LINK} } }
        social { id label href mark isExternal }
        newsletter { title description fieldLabel placeholder submitLabel eyebrow }
        meta { key value href }
        utility { ${FOOTER_LINK} }
        addressLines { text }
      }
    }
  }
`;
