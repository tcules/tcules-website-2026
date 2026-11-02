/**
 * Every path in the site, named once.
 *
 * Routes get referenced from navigation, footers, breadcrumbs, sitemaps, redirects and
 * cross-links — so a path that is written as a literal in each of those places turns any URL
 * decision into a hunt. Named here, renaming a family is a one-line edit plus a directory
 * rename.
 *
 * FLAT, deliberately. A nested shape (`ROUTES.services.designSystems`) reads well at the call
 * site and then costs you `RouteKey`: the union of every route name is what lets a nav item, a
 * breadcrumb or a redirect table be typed against "a route this site actually has". Grouping is
 * done with comments, which cost nothing.
 *
 * The families below come from the site sitemap and are what the header and footer navigate to.
 * A path with no page behind it yet is still named here — the nav is the first consumer of a
 * route and it exists before the route does.
 */
export const ROUTES = {
  home: '/',

  /* Services — the six offers, plus the two ways an engagement starts. */
  services: '/services',
  productDesign: '/services/product-design',
  productModernisation: '/services/product-modernisation',
  designSystems: '/services/design-systems',
  aiProductUx: '/services/ai-product-ux',
  designEngineering: '/services/design-engineering',
  softwareDevelopment: '/services/software-development',
  audits: '/audits',
  howWeWork: '/how-we-work',
  howWeWorkAiNative: '/how-we-work/ai-native-product-design',
  howWeWorkAiTransparency: '/how-we-work/ai-transparency',
  whyTcules: '/why-tcules',

  /* The six audits, named individually because the nav lists them as a group of six rather than
     linking the index. They resolve through the `/audits/[slug]` route that already ships, so
     `auditPath()` below would build the same strings — but a nav item takes a NAME, and a call
     site that computes one cannot be checked against the union. */
  uxProductAudit: '/audits/ux-product-audit',
  designSystemAudit: '/audits/design-system-audit',
  designToCodeAudit: '/audits/design-to-code-audit',
  productModernisationAssessment: '/audits/product-modernisation-assessment',
  aiProductUxReadiness: '/audits/ai-product-ux-readiness',
  prototypeHardeningReview: '/audits/prototype-hardening-review',

  /* Work. `/case-studies` is the canonical family and `/work` is not a route — the previous
     codebase carried that question unresolved across five files, which is why it is settled
     here rather than at a call site. */
  caseStudies: '/case-studies',
  clients: '/clients',

  /* Expertise — products and platforms first, then industries. */
  expertise: '/expertise',
  b2bSaasWorkflow: '/expertise/b2b-saas-workflow-software',
  aiDeveloperTools: '/expertise/ai-products-developer-tools',
  dataDecisionProducts: '/expertise/data-analytics-decision-products',
  marketplaces: '/expertise/marketplaces-multi-sided-platforms',
  contentDiscovery: '/expertise/content-knowledge-discovery-platforms',
  commerce: '/expertise/commerce-transactional-products',
  fintech: '/expertise/fintech',
  healthtech: '/expertise/healthtech',
  edtech: '/expertise/edtech-learning',
  martech: '/expertise/martech-salestech',
  proptech: '/expertise/proptech-contech-field-operations',
  climatetech: '/expertise/climatetech-energy',

  /* Insights. A format's path is the parent of its pieces' pages; as a page of its own it is retired
     (owner, 28 Oct 2026; decisions/2026-10-29-insights-hub-is-the-finder) and redirects to the hub's
     finder with the format picked (FORMAT_PAGE_REDIRECTS). */
  insights: '/insights',
  articles: '/insights/articles',
  guides: '/insights/guides',
  research: '/insights/research',
  podcasts: '/insights/podcasts',
  videos: '/insights/videos',
  events: '/insights/events',
  interviews: '/insights/interviews',
  /* Everyone a live byline names, and each person's page under it (owner, 1 Nov 2026;
     decisions/2026-11-01-author-pages-one-template-from-strapi). */
  authors: '/insights/authors',
  tools: '/tools',
  glossary: '/glossary',

  /* Lab and company. The five Lab children are carried by the nav data even though Lab renders as
     a direct link today — see docs/specs/SiteNav.md §2.1. Naming them is what makes switching Lab
     to a menu a one-field edit rather than a content migration.

     These five were dropped by the conflict resolution in PR #36's `Merge branch 'main' into
     strapi-integration` and are restored here. The tell that it was a casualty rather than a
     decision: the comment above survived while the routes it describes did not. `join` is PR #36's
     and stays. */
  futureInterfacesLab: '/future-interfaces-lab',
  futureInterfacesLabJoin: '/future-interfaces-lab/join',
  labExperiments: '/future-interfaces-lab/experiments',
  labTools: '/future-interfaces-lab/tools',
  labResearch: '/future-interfaces-lab/research',
  labDatasets: '/future-interfaces-lab/datasets',
  labProgrammes: '/future-interfaces-lab/programmes',
  matterDesignSystem: '/matter-design-system',
  about: '/about',
  team: '/team',
  careers: '/careers',
  security: '/security-and-confidentiality',
  contact: '/contact',

  /* Utility — the footer's bottom row. */
  privacy: '/privacy-policy',
  terms: '/terms-of-use',
  cookiePolicy: '/cookie-policy',
  accessibility: '/accessibility',
  sitemap: '/sitemap',

  /* The proving ground. Not linked from the site; named so a specimen can cross-link. */
  design: '/design',
  designCtaSection: '/design/cta-section',
  designEnquiryForm: '/design/enquiry-form',
  designChip: '/design/chip',
  designIsland: '/design/island',
  designKitForm: '/design/kit/form',
  designProof: '/design/proof',
  designKitTestimonials: '/design/kit/testimonials',
  designKitFacts: '/design/kit/facts',
  designCallout: '/design/callout',
  designKitProcess: '/design/kit/process',
  designSteps: '/design/steps',
  designKitHome: '/design/kit/home',
  designKitAbout: '/design/kit/about',
  designKitServicesIndex: '/design/kit/services-index',
  designListingIndex: '/design/listing-index',
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * The site's public origin, for the few outputs that must carry absolute URLs (the sitemap). Set
 * `SITE_URL` to point a preview deployment's sitemap at itself; production needs nothing.
 */
export const SITE_ORIGIN = (process.env.SITE_URL?.trim() || 'https://tcules.com').replace(
  /\/+$/u,
  '',
);

/**
 * The site's section indexes: the pages that exist to list a family ("Services", "Case studies",
 * "Insights"), as against a top-level page that NAMES something ("How we work", "Future Interfaces
 * Lab", "Matter Design System").
 *
 * Named once, here, because the difference decides what a hero eyebrow may say. `@/lib/trail`
 * treats Home and these crumbs as the site's structure, which an eyebrow repeats only by equalling
 * ("Case study · Fintech" stands under Home / Case studies, a bare "Case study" does not); every
 * other crumb is a name, which an eyebrow repeats by saying it. It used to be inferred from href
 * depth, which counted every top-level page as structure. A new family's index joins this list in
 * the same edit that names its route.
 */
export const SECTION_INDEXES: readonly string[] = [
  ROUTES.services,
  ROUTES.audits,
  ROUTES.caseStudies,
  ROUTES.expertise,
  ROUTES.insights,
  ROUTES.tools,
  ROUTES.glossary,
];

/**
 * In-page anchors, named once. A page's enquiry form is the target of every "Start a project" on
 * it, so the id the close band carries and the fragment every action links to are one string —
 * the ServicePage close used to wrap itself in `<div id="enquiry">` while six fixtures wrote
 * `'#enquiry'` by hand (ServicePage audit, 6 Oct 2026).
 */
export const ANCHORS = {
  enquiry: 'enquiry',
} as const;

/** The fragment href for an in-page anchor: `#enquiry`. */
export function anchorHref(id: (typeof ANCHORS)[keyof typeof ANCHORS]): `#${string}` {
  return `#${id}`;
}

/** A corpus page through its template in the proving ground: `/design/corpus-page/<file-slug>`. */
export function designCorpusPagePath(fileSlug: string): string {
  return `${ROUTES.design}/corpus-page/${encodeURIComponent(fileSlug)}`;
}

/** The designed service page in the proving ground: `/design/service-page/<slug>`. */
export function designServicePagePath(slug: string): string {
  return `${ROUTES.design}/service-page/${encodeURIComponent(slug)}`;
}

/** Build one canonical audit-detail path without duplicating the route family at call sites. */
export function auditPath(slug: string): string {
  return `${ROUTES.audits}/${encodeURIComponent(slug)}`;
}

/** Build a service-detail path while preserving each level of a nested CMS slug. */
export function servicePath(slug: string): string {
  const encodedSlug = slug
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return encodedSlug ? `${ROUTES.services}/${encodedSlug}` : ROUTES.services;
}

/** Build one canonical expertise-detail path from the named route family. */
export function expertisePath(slug: string): string {
  return `${ROUTES.expertise}/${encodeURIComponent(slug)}`;
}

/** Build one canonical case-study detail path from the named route family. */
export function caseStudyPath(slug: string): string {
  return `${ROUTES.caseStudies}/${encodeURIComponent(slug)}`;
}

/**
 * The case studies, by the client name the copy uses for them (owner, 11 Oct 2026: "everytime a
 * case study appears, it should be linked to the case study page"). Named here, once, so a card, a
 * proof line or a sentence that names a client finds its case without a literal path at the call
 * site; `caseStudyLink` (@/lib/case-links) is the lookup. Each slug is a `_pages/case-studies__<slug>.md`
 * page's case as Strapi publishes it today: case pages keep the CMS content and its live slugs, not the
 * corpus rewrite (owner, 11 Oct 2026: "keep what's on strapi right now"). CASE_SLUG_REDIRECTS sends
 * the corpus's planned slugs, which its own pages link to, on to the live ones.
 * Aliases are the other ways the corpus names the same client ("Benchmark", "Auxentios Technology").
 */
export const CASE_STUDY_SLUGS = {
  Doodle: 'doodle-case-study-automating-enterprise-meeting-scheduling',
  Dealpath: 'enterprise-workflow-redesign-dealpath-real-estate',
  'Benchmark Gensuite': 'legacy-saas-modernisation-information-architecture',
  Benchmark: 'legacy-saas-modernisation-information-architecture',
  'Eden AI': 'unifying-workflow-creation-through-intelligent-search',
  Auxentios: 'consumer-grade-ux-in-enterprise-saas-a-case-study-on-mvp-design-for-cpq-software',
  'Auxentios Technology':
    'consumer-grade-ux-in-enterprise-saas-a-case-study-on-mvp-design-for-cpq-software',
  Scissors:
    'saas-ux-ui-case-study-research-and-object-oriented-ux-for-staffing-agencies-software',
  'GT Tools': 'redesigning-for-a-shopify-website-ux-design',
  ConnectX: 'ai-native-building-energy-product-connectx',
  BuildTwin: 'ai-quality-control-expert-review-buildtwin',
  'Novus Insights': 'saas-ux-ui-case-study-ai-for-market-research-automation',
  'Omny AI': 'designing-trust-how-tcules-helped-omnyai-reframe-their-ai-human-relationship',
  OctiFi: 'optimising-microlending-fintech-app-for-a-y-combinator-batch-startup',
  Ryzeo: 'ux-revamp-for-a-saas-product-in-marketing-automation-vertical',
  'Gold Image Printing':
    'boosting-web-to-print-sales-and-efficiency-by-modernising-legacy-erp-ux',
  'The Wandering Raven': 'transforming-an-edtech-platform-into-an-engaging-learning-experience',
  'The Chain Hut': 'ux-ui-design-and-development-for-magento-of-a-silver-chain-store',
  'Kirana store payments': 'ux-research-for-kirana-store-payment-app',
} as const;

/**
 * PLACEHOLDER case links: clients the copy presents as case work whose case page does not exist
 * yet. Each points at the case index with a greppable fragment (so the link opens a real page, 200)
 * until its case publishes; then it moves to CASE_STUDY_SLUGS. Listed in content proposal P43.
 * The value is the slug the case is expected to publish under, where the corpus names one.
 */
export const CASE_STUDY_PLACEHOLDERS = {
  CuramCare: 'curamcare',
  Vovisto: 'vovisto-healthcare-event-travel-platform',
} as const;

/**
 * The corpus's planned case slug → the slug the case lives at on Strapi today, for the 11 cases whose
 * corpus page renamed it. next.config.ts serves these as temporary redirects so every corpus link
 * opens the live case; when a case moves to its planned slug, its entry goes.
 */
export const CASE_SLUG_REDIRECTS: Readonly<Record<string, string>> = {
  'auxentios-cpq-product-mvp-design':
    'consumer-grade-ux-in-enterprise-saas-a-case-study-on-mvp-design-for-cpq-software',
  'benchmark-gensuite-enterprise-suite-modernisation':
    'legacy-saas-modernisation-information-architecture',
  'eden-ai-workflow-builder-search-redesign':
    'unifying-workflow-creation-through-intelligent-search',
  'gold-image-printing-web-to-print-erp-modernisation':
    'boosting-web-to-print-sales-and-efficiency-by-modernising-legacy-erp-ux',
  'gt-tools-shopify-product-discovery': 'redesigning-for-a-shopify-website-ux-design',
  'novus-insights-ai-survey-product-design':
    'saas-ux-ui-case-study-ai-for-market-research-automation',
  'octifi-mobile-lending-product-design':
    'optimising-microlending-fintech-app-for-a-y-combinator-batch-startup',
  'omny-ai-suggestion-trust-redesign':
    'designing-trust-how-tcules-helped-omnyai-reframe-their-ai-human-relationship',
  'ryzeo-marketing-automation-ux-revamp':
    'ux-revamp-for-a-saas-product-in-marketing-automation-vertical',
  'scissors-staffing-software-object-oriented-ux':
    'saas-ux-ui-case-study-research-and-object-oriented-ux-for-staffing-agencies-software',
  'wandering-raven-edtech-moodle-experience':
    'transforming-an-edtech-platform-into-an-engaging-learning-experience',
};

/**
 * A path the copy links → the path the piece lives at on Strapi today, for an insight the copy files
 * under another format or slug. The home page's Eden AI episode is linked as a podcast; the live page
 * is a video (review 29 Oct 2026). The corpus seam rewrites every link to the live path, and
 * next.config.ts serves the copy's path as a temporary redirect, the way it does a case's slug.
 */
export const INSIGHT_PATH_REDIRECTS: Readonly<Record<string, string>> = {
  '/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo':
    '/insights/videos/do-ai-not-for-ai-sake-but-for-your-user-insights-from-eden-ai-ctpo',
};

/**
 * A live expertise slug → the slug the 26 Oct 2026 copy renamed it to (the copy's `redirect_from`):
 * `/expertise/fintech-insurtech` became `/expertise/fintech`. Every expertise page renders from the
 * corpus now, so next.config.ts sends the old path to the new one and old links keep landing.
 */
export const EXPERTISE_SLUG_REDIRECTS: Readonly<Record<string, string>> = {
  'fintech-insurtech': 'fintech',
};

/** A placeholder case link: the case index, marked so every one can be found and replaced. */
export function caseStudyPlaceholderPath(slug: string): string {
  return `${ROUTES.caseStudies}#placeholder-case-${encodeURIComponent(slug)}`;
}

/**
 * The retired format pages, each to the insights hub with its type picked (`/insights/articles` →
 * `/insights?type=articles`): the breadcrumbs of a podcast's or an event's page and any old link
 * still land. The type's value is the path's last segment, the slug the hub's Type group uses.
 */
export const FORMAT_PAGE_REDIRECTS: readonly { from: string; to: string }[] = [
  ROUTES.articles,
  ROUTES.guides,
  ROUTES.research,
  ROUTES.podcasts,
  ROUTES.videos,
  ROUTES.events,
  ROUTES.interviews,
].map((from) => ({ from, to: `${ROUTES.insights}?type=${from.split('/').pop()}` }));

/** Build one canonical podcast-detail path from the named insights family. */
export function podcastPath(slug: string): string {
  return `${ROUTES.podcasts}/${encodeURIComponent(slug)}`;
}

/** Build one canonical event-detail path from the named insights family. */
export function eventPath(slug: string): string {
  return `${ROUTES.events}/${encodeURIComponent(slug)}`;
}

/** Build one canonical article-detail path for podcast resource links. */
export function articlePath(slug: string): string {
  return `${ROUTES.articles}/${encodeURIComponent(slug)}`;
}

/** Build one canonical tool-detail path from the named insights family. */
export function toolPath(slug: string): string {
  return `${ROUTES.tools}/${encodeURIComponent(slug)}`;
}

/** Build an insight-detail path while preserving each level of a nested CMS slug. */
export function blogPath(slug: string): string {
  const encodedSlug = slug
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return encodedSlug ? `${ROUTES.insights}/${encodedSlug}` : ROUTES.insights;
}

/** Build one person's author page from their slug (the name, slugified: "Yash Gidwani" → yash-gidwani). */
export function authorPath(slug: string): string {
  return `${ROUTES.authors}/${encodeURIComponent(slug)}`;
}

/** Build one canonical glossary-detail path from the named route family. */
export function glossaryPath(slug: string): string {
  return `${ROUTES.glossary}/${encodeURIComponent(slug)}`;
}

/**
 * A destination the sitemap does not answer yet.
 *
 * Three navigation items — Series, Rising Topics, Latest Insights — are real editorial ideas
 * with no canonical URL decided. They point here rather than at a guessed path, because a
 * plausible guess is indistinguishable from a decision six months later, and `#` scattered
 * through the IA cannot be grepped for. This can be.
 */
export const UNRESOLVED_ROUTE = '/#unresolved-route';

/**
 * An off-site destination not yet supplied. Same argument as UNRESOLVED_ROUTE: one greppable name
 * beats a scattering of `#`s.
 *
 * The social profiles were its first users and are all supplied now — see EXTERNAL. It stays
 * because the need recurs: `Proof`'s specimen uses it for a figure whose source is not yet
 * published, and the next unsourced claim will want it too.
 */
export const UNRESOLVED_EXTERNAL = '#unresolved-external';

/**
 * Off-site profiles that more than one component links to. All three are supplied.
 *
 * Clutch is the reason this exists: the footer's rating badge and `Stat`'s source link are two
 * consumers of one URL, and two fixtures each holding their own copy is how they drift apart.
 *
 * The Clutch profile is also the SOURCE OF THE RATING the footer prints. Whoever changes the
 * score in the fixture reads it off this page, and the score and this URL move together — a
 * number nobody can check against its own source is worse than no badge.
 *
 * LinkedIn is the regional `in.linkedin.com` host and YouTube the `@handle` form, both as the
 * companies themselves publish them. Neither is normalised to a canonical host or a channel id:
 * these are the URLs that were given, they redirect correctly, and rewriting somebody's own
 * address into what looks tidier is how a link quietly stops resolving.
 */
export const EXTERNAL = {
  clutch: 'https://clutch.co/profile/tcules-ux-design-studio',
  linkedin: 'https://in.linkedin.com/company/tcules',
  youtube: 'https://www.youtube.com/@tcules',
} as const;

/**
 * Endpoints, which are not routes. Named here anyway so a form action is not a literal in a
 * pattern's fixture. NOTHING SERVES `newsletter` OR `enquiry` YET — the newsletter field posts to a
 * 404 until an `app/api/newsletter/route.ts` exists, and the corpus pages' enquiry form posts to a
 * 404 until `app/api/enquiry/route.ts` does (FORM_ENDPOINT_VERIFICATION, a release dependency on
 * every corpus page).
 */
export const ENDPOINTS = {
  newsletter: '/api/newsletter',
  contact: '/api/contact',
  enquiry: '/api/enquiry',
  enquiryDesign: '/api/design/enquiry',
} as const;
