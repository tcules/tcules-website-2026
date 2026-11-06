import { listPublishedSitemapInventory } from '@/content';
import {
  AUDIT_PATH_REDIRECTS,
  CASE_SLUG_REDIRECTS,
  EXPERTISE_SLUG_REDIRECTS,
  FORMAT_PAGE_REDIRECTS,
  INSIGHT_PATH_REDIRECTS,
  ROUTES,
  caseStudyPath,
  expertisePath,
} from '@/lib/routes';

const FIXED_PATHS = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.howWeWork,
  ROUTES.whyTcules,
  ROUTES.careers,
  ROUTES.contact,
  ROUTES.futureInterfacesLab,
  ROUTES.futureInterfacesLabJoin,
  ROUTES.matterDesignSystem,
  ROUTES.services,
  ROUTES.audits,
  ROUTES.expertise,
  ROUTES.glossary,
  ROUTES.tools,
  ROUTES.caseStudies,
  ROUTES.clients,
  ROUTES.insights,
  ROUTES.authors,
  ROUTES.privacy,
  ROUTES.terms,
  ROUTES.cookiePolicy,
  ROUTES.sitemap,
];

const REDIRECTED = new Set([
  ...Object.keys(CASE_SLUG_REDIRECTS).map(caseStudyPath),
  ...Object.keys(EXPERTISE_SLUG_REDIRECTS).map(expertisePath),
  ...Object.keys(AUDIT_PATH_REDIRECTS),
  ...Object.keys(INSIGHT_PATH_REDIRECTS),
  ...FORMAT_PAGE_REDIRECTS.map(({ from }) => from),
]);

export async function listSitemapFallbackEntries() {
  const fixed = FIXED_PATHS.map((path): { path: string; lastModified?: string } => ({ path }));
  try {
    const { entries, excluded } = await listPublishedSitemapInventory();
    return [
      ...new Map(
        [...fixed, ...entries]
          .filter(({ path }) => !REDIRECTED.has(path) && !excluded.has(path))
          .map((entry) => [entry.path, entry]),
      ).values(),
    ];
  } catch (error) {
    console.error('sitemap.xml: the published route inventory could not be read', error);
    return fixed;
  }
}
