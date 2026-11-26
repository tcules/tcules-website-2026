import type { NextConfig } from 'next';

import legacyRedirects from './src/lib/legacy-redirects.json';
import {
  AUDIT_PATH_REDIRECTS,
  CASE_SLUG_REDIRECTS,
  EXPERTISE_SLUG_REDIRECTS,
  INSIGHT_PATH_REDIRECTS,
  caseStudyPath,
  FORMAT_PAGE_REDIRECTS,
} from './src/lib/routes';
import { HTML_LIMITED_BOT_UA_RE } from 'next/dist/shared/lib/router/utils/html-bots';

/**
 * Crawlers that read the HTML without running JavaScript, so they must get the title, canonical and
 * share tags in `<head>` rather than streamed in after it. Next keeps its own list (search engines and
 * link unfurlers) and setting this option REPLACES that list, so it is imported and extended rather
 * than copied: a copy would silently fall behind Next's, and a renamed export fails the build instead.
 *
 * The additions are the AI answer engines' crawlers and fetchers. Next 16.4 began streaming metadata
 * on pages whose `generateMetadata` waits on the CMS (home, /why-tcules, the author pages …), and none
 * of these run scripts, so they would otherwise find no title in `<head>` (20 Nov 2026). Only a
 * matching user agent waits for metadata before the first byte; people still get the streamed page.
 */
const AI_CRAWLERS =
  /GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Amazonbot|meta-externalagent|Bytespider|cohere-ai|DuckAssistBot|MistralAI-User/;

const nextConfig: NextConfig = {
  htmlLimitedBots: new RegExp(`${HTML_LIMITED_BOT_UA_RE.source}|${AI_CRAWLERS.source}`, 'i'),
  /**
   * Hosts allowed to request DEV-ONLY assets — the JS chunks, the HMR socket, the dev font
   * endpoint. Development only; it has no effect on a build and grants nothing in production.
   *
   * Next blocks these cross-origin by default, and the failure mode is worth knowing because it
   * looks like a bug in your own code rather than a config gap: the HTML renders fine, so the page
   * looks right, but the client chunks 404 and nothing hydrates. Every client component silently
   * becomes static markup — the nav's mega-menu triggers stop opening, the mobile drawer stops
   * toggling, and there is no error on screen. The only signal is `⚠ Blocked cross-origin request`
   * in the dev server log.
   *
   * That is exactly what happens the moment you open the dev server on anything other than
   * localhost — a phone on the same wi-fi, a tablet, a second machine — which is also when you
   * most want to test the drawer.
   *
   * Both forms are listed on purpose. The wildcard covers the subnet, so a DHCP lease change does
   * not break this again; the .local name covers Bonjour, which is how a phone usually resolves
   * this machine. Adjust the subnet if this repo is checked out somewhere on a different one.
   */
  allowedDevOrigins: ['192.168.1.*', '*.local'],
  /** The corpus's planned case slugs → the live Strapi slugs (routes.ts § CASE_SLUG_REDIRECTS), and
      the retired format pages → the insights finder (§ FORMAT_PAGE_REDIRECTS). The slug redirects are
      temporary, so nothing caches them as moved for good; the format pages' are permanent (below). */
  async redirects() {
    return [
      ...Object.entries(CASE_SLUG_REDIRECTS).map(([from, to]) => ({
        source: caseStudyPath(from),
        destination: caseStudyPath(to),
        permanent: false,
      })),
      /* The live expertise slugs the copy renamed → their new slugs (routes.ts § EXPERTISE_SLUG_REDIRECTS). */
      ...Object.entries(EXPERTISE_SLUG_REDIRECTS).map(([from, to]) => ({
        source: `/expertise/${from}`,
        destination: `/expertise/${to}`,
        permanent: false,
      })),
      /* An insight the copy links at another path → its live path (routes.ts § INSIGHT_PATH_REDIRECTS). */
      /* An audit the copy renamed → its new path (routes.ts § AUDIT_PATH_REDIRECTS). */
      ...Object.entries(AUDIT_PATH_REDIRECTS).map(([from, to]) => ({
        source: from,
        destination: to,
        permanent: false,
      })),
      ...Object.entries(INSIGHT_PATH_REDIRECTS).map(([from, to]) => ({
        source: from,
        destination: to,
        permanent: false,
      })),
      /* Permanent (308): the format pages are retired for good (owner, 28 Oct 2026), so a search
         engine should move whatever it holds for them to the hub rather than keep the old URL. */
      ...FORMAT_PAGE_REDIRECTS.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
      ...legacyRedirects,
    ];
  },
  /**
   * Pages are kept in this server's route cache and expired by the CMS webhook (app/layout.tsx), and
   * Next then tells every cache downstream it may keep them too (`s-maxage=300,
   * stale-while-revalidate` of a year). A webhook cannot reach a CDN's or a browser's copy, so a
   * publish would stay hidden behind one for minutes, or a year of "stale". Pages and their RSC
   * payloads therefore go out exactly as they did when they were rendered per request: nobody
   * downstream keeps them, and every visit asks this server, which answers from its route cache.
   *
   * Excluded, because their own headers are right: build assets (`/_next/`), resized images (`/img/`,
   * immutable), share cards (`/og/`, `opengraph-image`, `twitter-image`), API routes, and any path
   * with a file extension (public files, favicon, sitemap.xml, robots.txt).
   */
  async headers() {
    const noDownstreamCache = [
      { key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' },
    ];
    return [
      { source: '/', headers: noDownstreamCache },
      {
        source:
          '/:path((?!_next/|img/|og/|api/)(?!.*(?:opengraph-image|twitter-image))(?!.*\\.\\w+$).+)',
        headers: noDownstreamCache,
      },
    ];
  },
};

export default nextConfig;
