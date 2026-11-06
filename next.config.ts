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

const nextConfig: NextConfig = {
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
      the retired format pages → the insights finder (§ FORMAT_PAGE_REDIRECTS). Temporary, so nothing
      caches either as moved for good. */
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
      ...FORMAT_PAGE_REDIRECTS.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: false,
      })),
      ...legacyRedirects,
    ];
  },
};

export default nextConfig;
