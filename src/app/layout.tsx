import type { Metadata } from 'next';

import { getNavigation } from '@/content';
import { SITE_ORIGIN } from '@/lib/routes';
import { SiteFooter, SiteNav } from '@/patterns';

import './globals.css';

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
 *
 * Still absent on purpose: analytics, which is added at launch rather than during scaffolding.
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { nav, footer } = await getNavigation();

  return (
    <html lang="en">
      <head>
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
      <body>
        {nav.available !== false ? <SiteNav {...nav} /> : null}
        <main>{children}</main>
        {footer.available !== false ? <SiteFooter {...footer} /> : null}
      </body>
    </html>
  );
}
