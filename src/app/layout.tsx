import type { Metadata } from 'next';
import Script from 'next/script';

import { getNavigation } from '@/content';
import { SITE_ORIGIN } from '@/lib/routes';
import { SiteFooter, SiteNav } from '@/patterns';

import './globals.css';
import { TrackingScripts } from './tracking-scripts';

// Navigation and footer are read from the CMS for every page request.
export const revalidate = 0;

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
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { nav, footer } = await getNavigation();
  const trackingEnabled = process.env.RAILWAY_ENVIRONMENT_NAME === 'live';

  return (
    <html lang="en">
      <head>
        {trackingEnabled ? (
          <Script id="gtm-script" strategy="beforeInteractive">
            {`
              (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                var first = d.getElementsByTagName(s)[0];
                var tag = d.createElement(s);
                var layer = l !== 'dataLayer' ? '&l=' + l : '';
                tag.async = true;
                tag.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + layer;
                first.parentNode.insertBefore(tag, first);
              })(window, document, 'script', 'dataLayer', 'GTM-KMJSP983');
            `}
          </Script>
        ) : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- the rule targets the
            Pages Router (it wants fonts in pages/_document.js so they are not per-page). This IS
            the App Router root layout, so a link here already applies to every route, which is
            exactly what the rule is asking for. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Geist+Mono:wght@400;500;600&display=swap"
        />
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
      </body>
    </html>
  );
}
