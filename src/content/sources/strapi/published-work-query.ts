import {
  PUBLISHED_HERO,
  PUBLISHED_FIELDS,
  PUBLISHED_CTA,
  PUBLISHED_TESTIMONIALSECTION,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
} from './published-page-fields';
const content = `__typename
... on ComponentSharedClientGrid{title anchorId clients{documentId name density media{url width height alternativeText}} markOverrides{client{documentId} media{url width height alternativeText} density width height}}
... on ComponentSharedIllustratedSection{heading anchorId description situationSurface:surface illustratedPresentation:presentation entries{title body icon anchorId} after{kind prose{body}}}
... on ComponentSharedEditorialSection{heading anchorId editorialSurface:surface blocks{kind prose{body} table{columns{heading} rows{heading cells{body}}}}}
... on ComponentSharedComparisonSection{heading anchorId description comparisonSurface:surface blocks{kind prose{body} table{columns{heading} rows{heading cells{body}}}}}
... on ComponentSharedOfferSheetSection{heading anchorId description sheetSurface:surface sheetPresentation:presentation listEntries{title body icon} cards{title description} action{...PublishedAction} relatedPages{resolved}}
${PUBLISHED_CTA}${PUBLISHED_TESTIMONIALSECTION}${PUBLISHED_ENGAGEMENTOPTIONS}${PUBLISHED_FAQSECTION}`;
export const WORK_MASTER_QUERY = `query PublishedWorkMaster{page:howWeWorkMaster(status:PUBLISHED){documentId ${PUBLISHED_HERO} content{${content}}}}${PUBLISHED_FIELDS}`;
export const WORK_DETAIL_QUERY = `query PublishedHowWeWorkDetail($slug:String!){pages:howWeWorks(filters:{slug:{eq:$slug}},status:PUBLISHED,pagination:{limit:1}){documentId name slug ${PUBLISHED_HERO} content{${content}}}}${PUBLISHED_FIELDS}`;
export const SITEMAP_QUERY = `query PublishedSitemap{page:sitemapMaster(status:PUBLISHED){documentId hero{title description breadcrumbs{label href}} content{... on ComponentSharedSitemapGroup{key label additionalLinks{label href status}}} resolvedGroups{key label anchorId entries{path title lastModified parentPath}}}}`;
