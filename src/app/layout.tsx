import type { Metadata } from 'next';

import { getNavigation, getSiteIdentity } from '@/content';
import { siteGraphMarkup } from '@/lib/json-ld';
import { SITE_ORIGIN } from '@/lib/routes';
import { SiteFooter, SiteNav } from '@/patterns';

import './globals.css';
import { TrackingScripts } from './tracking-scripts';

/*
 * Every page is rendered once and kept (the Full Route Cache) until a CMS publish expires the data it
 * read: the Strapi webhook (api/revalidate) calls revalidateTag on the tags the CMS reads carry, and a
 * prerendered page carries the tags of every read it made, so the next request renders it afresh
 * (`expire: 0`, never stale). A publish therefore still shows on the next visit, which is what the
 * per-request shell of 6 Nov was for, without rendering every visit.
 *
 * 300 is the safety net, and the lowest value on a route wins, so it covers every page: a render
 * that met a CMS failure fell back without caching the failed read, so it heals within five minutes
 * instead of staying until the next publish. Cached CMS data is not refetched by it (owner, 26 Nov
 * 2026; decisions/2026-11-26-pages-prerendered-publish-expires-them).
 */
export const revalidate = 300;

const publicDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();

export const metadata: Metadata = {
  /* Generated cards are served by this deployment. Absolute URLs from Strapi keep their origin. */
  metadataBase: new URL(publicDomain ? `https://${publicDomain}` : SITE_ORIGIN),
  title: 'Tcules',
  description: 'Tcules website',
};

/**
 * The root shell.
 *
 * Composition only, which is what a route file is for: it reads the seam and passes props. The
 * header's and footer's IA arrives from `getNavigation()` and neither pattern knows or cares
 * whether it came from a fixture or from a CMS — switching the whole site over is one assignment
 * in content/source.ts.
 *
 * The <link> below is the token system's one network call. It belongs here rather than in
 * tokens/fonts.css because an @import inside a bundled stylesheet is position-invalid and gets
 * dropped at build time — silently, leaving every family on its local fallback. See
 * src/styles/tokens/fonts.css for the full note and the self-hosting path.
 *
 * `<main>` wraps the page so the header and footer are outside it — a screen reader's "skip to
 * main content" and a landmark list both depend on exactly one main region per document, and a
 * page that renders its own would make two.
 */
/** The Google Fonts stylesheet, attached by script so it never blocks the first paint (perf A/B, 6 Nov). */
const FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Geist+Mono:wght@400;500;600&display=swap';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [{ nav, footer }, identity] = await Promise.all([getNavigation(), getSiteIdentity()]);
  const trackingEnabled = process.env.RAILWAY_ENVIRONMENT_NAME === 'live';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- the rule targets the
            Pages Router (it wants fonts in pages/_document.js so they are not per-page). This IS
            the App Router root layout, so a link here already applies to every route, which is
            exactly what the rule is asking for. */}
        <link rel="preload" as="style" href={FONTS_CSS} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(FONTS_CSS)};document.head.appendChild(l)})()`,
          }}
        />
        <noscript>
          <link rel="stylesheet" href={FONTS_CSS} />
        </noscript>
      </head>
      <body data-tracking-enabled={trackingEnabled ? 'true' : undefined}>
        {trackingEnabled ? (
          <>
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-KMJSP983"
                height="0"
                width="0"
                style={{ border: 0, display: 'none', visibility: 'hidden' }}
                title="Google Tag Manager"
              />
            </noscript>
            <TrackingScripts />
          </>
        ) : null}
        {nav.available !== false ? <SiteNav {...nav} /> : null}
        <main>{children}</main>
        {footer.available !== false ? <SiteFooter {...footer} /> : null}
        {/* The site-wide Organization and WebSite nodes, once per page from SEO Settings. Each
            page's own graph refers to them by @id (lib/json-ld.ts strips the copies it carries). */}
        {identity ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: siteGraphMarkup(identity) }}
          />
        ) : null}
      </body>
    </html>
  );
}
