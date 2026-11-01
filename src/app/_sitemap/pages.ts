import {
  getNavigation,
  listAuthors,
  listCorpusPages,
  listSitePages,
  type SitePage,
  type SitePageFamily,
} from '@/content';
import {
  auditPath,
  authorPath,
  blogPath,
  CASE_SLUG_REDIRECTS,
  caseStudyPath,
  eventPath,
  expertisePath,
  glossaryPath,
  podcastPath,
  ROUTES,
  servicePath,
  toolPath,
  type RouteKey,
} from '@/lib/routes';

import { PASS_1_CASE_ROUTES } from '../_corpus/case';
import { PASS_1_LONGFORM_ROUTES } from '../_corpus/longform';
import { PASS_1_OFFER_ROUTES } from '../_corpus/offer';
import { PASS_1_TOOL_ROUTES } from '../_corpus/tool';

/**
 * Every page the site answers, grouped — the one list `/sitemap.xml` and the `/sitemap` page both
 * read, so the two can never disagree.
 *
 * Three sources, merged and deduplicated by path:
 *   1. the fixed pages — the routes with a `page.tsx` of their own and no slug. Named here because a
 *      route in ROUTES may have no page yet (the nav names a route before it exists); a new fixed
 *      page joins this list in the same edit that creates it.
 *   2. every entry Strapi publishes in a routed collection (`listSitePages`), and every author page
 *      (`listAuthors`).
 *   3. the corpus pages that have switched over (`_corpus/*` PASS_1 lists), less any that redirect.
 *
 * Strapi before corpus, so a page both sources name keeps Strapi's last-modified date.
 *
 * A page is named by its nav label where the header or footer links to it ("Fintech and InsurTech"),
 * and by its CMS title otherwise. The nav is preferred because several Strapi titles are the hero's
 * headline ("The happy path is the easy part."), which names nothing in a list.
 * `/design/**` is the proving ground and is never listed. `_sitemap` is underscore-prefixed, so Next
 * does not route it.
 */

export type SitemapGroupKey =
  | 'company'
  | 'services'
  | 'audits'
  | 'expertise'
  | 'caseStudies'
  | 'insights'
  | 'glossary'
  | 'tools'
  | 'legal';

export type SitemapEntry = { path: string; title: string; lastModified?: string };
export type SitemapGroup = { key: SitemapGroupKey; label: string; entries: SitemapEntry[] };

/** Group order is the page's reading order: the company first, the families, then the small print. */
const GROUPS: readonly { key: SitemapGroupKey; label: string }[] = [
  { key: 'company', label: 'Company' },
  { key: 'services', label: 'Services' },
  { key: 'audits', label: 'Audits' },
  { key: 'expertise', label: 'Expertise' },
  { key: 'caseStudies', label: 'Case studies' },
  { key: 'insights', label: 'Insights' },
  { key: 'glossary', label: 'Glossary' },
  { key: 'tools', label: 'Tools' },
  { key: 'legal', label: 'Legal' },
];

const FIXED_PAGES: readonly { route: RouteKey; title: string; group: SitemapGroupKey }[] = [
  { route: 'home', title: 'Home', group: 'company' },
  { route: 'about', title: 'About', group: 'company' },
  { route: 'howWeWork', title: 'How we work', group: 'company' },
  { route: 'careers', title: 'Careers', group: 'company' },
  { route: 'contact', title: 'Contact', group: 'company' },
  { route: 'futureInterfacesLab', title: 'Future Interfaces Lab', group: 'company' },
  {
    route: 'futureInterfacesLabJoin',
    title: 'Join the Future Interfaces Lab',
    group: 'company',
  },
  { route: 'matterDesignSystem', title: 'Matter Design System', group: 'company' },
  { route: 'services', title: 'Services', group: 'services' },
  { route: 'caseStudies', title: 'Case studies', group: 'caseStudies' },
  { route: 'insights', title: 'Insights', group: 'insights' },
  { route: 'authors', title: 'Authors', group: 'insights' },
  { route: 'privacy', title: 'Privacy policy', group: 'legal' },
  { route: 'terms', title: 'Terms of use', group: 'legal' },
  { route: 'sitemap', title: 'Sitemap', group: 'legal' },
];

const FAMILIES: Record<
  SitePageFamily,
  { path: (slug: string) => string; group: SitemapGroupKey }
> = {
  service: { path: servicePath, group: 'services' },
  audit: { path: auditPath, group: 'audits' },
  expertise: { path: expertisePath, group: 'expertise' },
  glossary: { path: glossaryPath, group: 'glossary' },
  tool: { path: toolPath, group: 'tools' },
  insight: { path: blogPath, group: 'insights' },
  podcast: { path: podcastPath, group: 'insights' },
  event: { path: eventPath, group: 'insights' },
  caseStudy: { path: caseStudyPath, group: 'caseStudies' },
};

/** A corpus route's group, by its family prefix. */
const CORPUS_GROUPS: Readonly<Record<string, SitemapGroupKey>> = {
  [ROUTES.services]: 'services',
  [ROUTES.audits]: 'audits',
  [ROUTES.expertise]: 'expertise',
  [ROUTES.caseStudies]: 'caseStudies',
  [ROUTES.insights]: 'insights',
  [ROUTES.glossary]: 'glossary',
  [ROUTES.tools]: 'tools',
};

const REDIRECTED: ReadonlySet<string> = new Set(
  Object.keys(CASE_SLUG_REDIRECTS).map(caseStudyPath),
);

const CORPUS_ROUTES: readonly string[] = [
  ...PASS_1_OFFER_ROUTES,
  ...PASS_1_LONGFORM_ROUTES,
  ...PASS_1_TOOL_ROUTES,
  ...PASS_1_CASE_ROUTES,
].filter((path) => !REDIRECTED.has(path));

/** Every `{ label, href }` anywhere in the header and footer IA, first label per path. */
function navLabels(node: unknown, labels = new Map<string, string>()): Map<string, string> {
  if (Array.isArray(node)) {
    node.forEach((child) => navLabels(child, labels));
  } else if (node && typeof node === 'object') {
    const { label, href } = node as { label?: unknown; href?: unknown };
    if (typeof label === 'string' && typeof href === 'string' && !labels.has(href)) {
      labels.set(href, label);
    }
    Object.values(node).forEach((child) => navLabels(child, labels));
  }
  return labels;
}

/** Everyone with an author page. An outage lists none, as `cmsPages` does. */
async function authorPages(): Promise<SitemapEntry[]> {
  try {
    return (await listAuthors()).map((author) => ({
      path: authorPath(author.slug),
      title: author.name,
    }));
  } catch (error) {
    console.error('sitemap: authors unavailable', error);
    return [];
  }
}

async function cmsPages(): Promise<SitePage[]> {
  try {
    return await listSitePages();
  } catch (error) {
    // A Strapi outage must not take the sitemap down with it: the fixed and corpus pages still list,
    // and the next revalidation brings the CMS pages back.
    console.error('sitemap: Strapi pages unavailable', error);
    return [];
  }
}

export async function listSitemapGroups(): Promise<SitemapGroup[]> {
  const [cms, corpus, navigation, authors] = await Promise.all([
    cmsPages(),
    listCorpusPages(),
    getNavigation(),
    authorPages(),
  ]);
  const corpusNames = new Map(corpus.map((page) => [page.route, page.name]));
  const labels = navLabels(navigation);

  const seen = new Set<string>();
  const byGroup = new Map<SitemapGroupKey, SitemapEntry[]>(GROUPS.map(({ key }) => [key, []]));
  const add = (group: SitemapGroupKey, entry: SitemapEntry) => {
    if (seen.has(entry.path)) return;
    seen.add(entry.path);
    byGroup.get(group)?.push(entry);
  };

  for (const page of FIXED_PAGES)
    add(page.group, { path: ROUTES[page.route], title: page.title });
  for (const page of cms) {
    const family = FAMILIES[page.family];
    const path = family.path(page.slug);
    add(family.group, {
      path,
      title: labels.get(path) ?? page.title,
      ...(page.updatedAt ? { lastModified: page.updatedAt } : {}),
    });
  }
  for (const author of authors) add('insights', author);
  for (const path of CORPUS_ROUTES) {
    const group = CORPUS_GROUPS[`/${path.split('/')[1]}`];
    if (group) add(group, { path, title: labels.get(path) ?? corpusNames.get(path) ?? path });
  }

  // Path order keeps a family's index first and a nested service under its parent.
  return GROUPS.map(({ key, label }) => ({
    key,
    label,
    entries: (byGroup.get(key) ?? []).sort((a, b) => a.path.localeCompare(b.path)),
  })).filter((group) => group.entries.length > 0);
}
