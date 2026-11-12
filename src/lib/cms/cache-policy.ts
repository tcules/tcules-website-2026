import { createHash } from 'node:crypto';

/** Query owners. Unknown operations fail closed so a new CMS reader cannot silently go untagged. */
export const CMS_QUERY_MODELS: Record<string, string> = {
  PublishedHome: 'home',
  PublishedAbout: 'about',
  PublishedService: 'service',
  PublishedServiceSlugs: 'service',
  PublishedServicesMaster: 'service-master',
  PublishedAudit: 'audit',
  PublishedAuditSlugs: 'audit',
  PublishedAuditMaster: 'audit-master',
  PublishedExpertise: 'expertise',
  PublishedExpertiseSlugs: 'expertise',
  PublishedExpertiseMaster: 'expertise-master',
  PublishedGlossary: 'glossary',
  PublishedGlossaryMaster: 'glossary-master',
  PublishedTool: 'tool',
  PublishedToolSlugs: 'tool',
  PublishedToolsMaster: 'tool-master',
  PublishedCaseStudy: 'case-study',
  PublishedCaseStudyIndex: 'case-study-listing',
  PublishedResource: 'resource',
  PublishedResourceVideo: 'resource',
  PublishedResourceImage: 'resource',
  PublishedResourceListing: 'resource-listing',
  PublishedResourceIndexPage: 'resource-listing',
  PublishedAuthor: 'author',
  PublishedAuthorResources: 'resource',
  PublishedAuthorShareProfile: 'author',
  PublishedAuthorMaster: 'author-master',
  PublishedClientMaster: 'client-master',
  PublishedCareers: 'career-master',
  PublishedLab: 'future-interfaces-lab',
  PublishedLabJoin: 'future-interfaces-lab-join',
  PublishedMatter: 'matter-design-system',
  PublishedWhy: 'why-tcules',
  PublishedWorkMaster: 'how-we-work-master',
  PublishedHowWeWorkDetail: 'how-we-work',
  PublishedSitemap: 'sitemap-master',
  PublishedSitemapInventory: 'sitemap-master',
  PublishedPrivacyPolicy: 'privacy-policy',
  PublishedTermsOfUse: 'terms-of-use',
  PublishedCookiePolicy: 'cookie-policy',
  PublishedCookiePolicySeo: 'cookie-policy',
  PublishedPageSeo: 'seo-page',
  PublishedSiteNavigation: 'navigation',
  PublishedSiteFooter: 'footer',
  PublishedSiteIdentity: 'seo-settings',
};

export const ROUTED_MODELS = [
  'home',
  'about',
  'contact',
  'service',
  'service-master',
  'audit',
  'audit-master',
  'expertise',
  'expertise-master',
  'glossary',
  'glossary-master',
  'tool',
  'tool-master',
  'case-study',
  'case-study-listing',
  'resource',
  'resource-listing',
  'author',
  'author-master',
  'client-master',
  'career-master',
  'future-interfaces-lab',
  'future-interfaces-lab-join',
  'matter-design-system',
  'why-tcules',
  'how-we-work',
  'how-we-work-master',
  'privacy-policy',
  'terms-of-use',
  'cookie-policy',
  'seo-page',
];
export const CMS_MODELS = new Set([
  ...ROUTED_MODELS,
  'sitemap-master',
  'navigation',
  'footer',
  'seo-settings',
  'faq',
  'testimonial',
  'client',
  'job',
  'industry',
  'stage',
  'topic',
  'resource-type',
  'file',
]);

// These reads resolve relationships in Strapi JSON rather than GraphQL selections.
const RESOLVED_DEPENDENCIES: Record<string, readonly string[]> = {
  PublishedSitemap: ROUTED_MODELS,
  PublishedSitemapInventory: ROUTED_MODELS,
  PublishedPageSeo: ['seo-settings', 'faq', 'file', 'author', 'resource', 'case-study'],
  PublishedCaseStudy: ['seo-settings', 'faq'],
};

// Selections are matched only in our trusted, source-controlled queries, including expanded fragments.
// This also covers relationship fields added to shared fragments without a second dependency list.
const RELATION_FIELDS: Record<string, string> = {
  caseStudy: 'case-study',
  caseStudies: 'case-study',
  services: 'service',
  service: 'service',
  audit: 'audit',
  audits: 'audit',
  expertise: 'expertise',
  expertises: 'expertise',
  term: 'glossary',
  glossaries: 'glossary',
  tool: 'tool',
  tools: 'tool',
  resource: 'resource',
  resources: 'resource',
  resources_connection: 'resource',
  author: 'author',
  authors: 'author',
  coAuthors: 'author',
  client: 'client',
  clients: 'client',
  namedClients: 'client',
  testimonial: 'testimonial',
  testimonials: 'testimonial',
  faqs: 'faq',
  jobs: 'job',
  industry: 'industry',
  industries: 'industry',
  stage: 'stage',
  topics: 'topic',
  resourceType: 'resource-type',
  seoSettings: 'seo-settings',
  resourceListing: 'resource-listing',
};

export const modelTag = (model: string) => `cms:model:${model}`;
export const detailTag = (model: string) => `cms:details:${model}`;
export const entryTag = (model: string, key: string) =>
  `cms:entry:${model}:${createHash('sha256').update(key).digest('hex')}`;

export function queryTags(
  query: string,
  operation: string,
  variables?: Record<string, string>,
): string[] {
  const model = CMS_QUERY_MODELS[operation];
  if (!model) throw new Error(`Register CMS cache dependencies for ${operation}`);
  const key = operation === 'PublishedPageSeo' ? variables?.path : variables?.slug;
  // AuthorResources filters resources by author slug, rather than by the resource's own slug.
  const detail = !!key && operation !== 'PublishedAuthorResources';
  const tags = new Set(detail ? [entryTag(model, key), detailTag(model)] : [modelTag(model)]);
  const dependencies = new Set(RESOLVED_DEPENDENCIES[operation] ?? []);
  for (const target of relationDependencies(query)) dependencies.add(target);
  for (const target of dependencies) tags.add(modelTag(target));
  return [...tags];
}

export function relationDependencies(query: string, skipRoot = true): Set<string> {
  const dependencies = new Set<string>();
  const selection = /\bquery\s+\w+(?:\([^)]*\))?\s*\{\s*(\w+)\s*(?::\s*(\w+))?/.exec(query);
  const rootField = selection?.[2] ?? selection?.[1];
  for (const [field, target] of Object.entries(RELATION_FIELDS)) {
    const occurrences = query.match(new RegExp(`\\b${field}\\s*(?:\\(|\\{)`, 'g'))?.length ?? 0;
    if (occurrences > (skipRoot && field === rootField ? 1 : 0)) dependencies.add(target);
  }
  if (/\b(?:url|formats)\b/.test(query)) dependencies.add('file');
  // JSON placements can select any routed collection. Conservatively cover their possible targets.
  if (/\bresolved\b/.test(query) && rootField !== 'seoPages') {
    for (const target of ROUTED_MODELS) dependencies.add(target);
  }
  return dependencies;
}
