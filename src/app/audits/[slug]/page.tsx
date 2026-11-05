import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAuditDetail, getOfferScenes, getPageSeo, listAuditSlugs } from '@/content';
import { landedClaimFigure } from '@/app/_corpus/claim-figure';
import { heroFallback } from '@/app/_corpus/hero-fallback';
import { landedReasonFigure } from '@/app/_corpus/reason-figure';
import { heroClip } from '@/lib/hero-clips';
import { jsonLdMarkup } from '@/lib/json-ld';
import { hasPlaceholder, placeholderImage } from '@/lib/placeholders';
import type { HeroMedia } from '@/patterns';
import { PublishedAudit } from '@/templates/CorpusPage/PublishedAudit';

/**
 * `/audits/{slug}`: an Audit from the new CMS, by its slug (`ux-product-audit`). Its words, sections,
 * order and variants are the CMS's; its SEO is the published SEO Page for the same path. The listing
 * (`/audits`) is a separate route.
 */

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    return (await listAuditSlugs()).map((slug) => ({ slug }));
  } catch (error) {
    /* The CMS unreachable at build: every route renders on its first request instead. */
    console.error(error);
    return [];
  }
}

/**
 * The hero the audit pages already drew where the CMS entry has none: the route's film, else its own
 * drawing, else the register's labelled hero placeholder. Illustrations only; never words.
 */
function auditHeroFallback(route: string): HeroMedia | undefined {
  const clip = heroClip(route);
  if (clip) return { type: 'clip', ...clip };
  return (
    heroFallback(route) ??
    (hasPlaceholder(route, 'hero')
      ? { type: 'image', image: placeholderImage(route, 'hero') }
      : undefined)
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/audits/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  try {
    const audit = await getAuditDetail(slug);
    if (!audit) {
      return {
        title: 'Audit not found | Tcules',
        description: null,
        robots: { index: false, follow: false },
      };
    }
    return (await getPageSeo(audit.route)).metadata;
  } catch {
    return {
      title: 'Audit temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
}

export default async function AuditPage({ params }: PageProps<'/audits/[slug]'>) {
  const { slug } = await params;
  const audit = await getAuditDetail(slug);
  if (!audit) notFound();
  const route = audit.route;
  const [{ structuredData }, scenes] = await Promise.all([
    getPageSeo(route),
    getOfferScenes(route),
  ]);

  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
        />
      ) : null}
      <PublishedAudit
        page={audit}
        fallbackMedia={audit.hero.media ? undefined : auditHeroFallback(route)}
        scenes={scenes}
        reasonFigure={landedReasonFigure}
        claimFigure={landedClaimFigure}
      />
    </>
  );
}
