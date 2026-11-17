import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCookiePolicyDocument, getCaseRefs } from '@/content';
import { caseRoutesIn } from '@/lib/corpus-cases';
import { jsonLdMarkup } from '@/lib/json-ld';
import { LongformPage } from '@/templates';

/**
 * `/cookie-policy` — the Cookie Policy single type from the new CMS, as one document in the article shell (legal
 * pages need no design: owner, 31 Oct 2026): its hero, its last-updated date, its sections in the
 * editor's order. Its <head> is the entry's own SEO. Composition only.
 */

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return (
    (await getCookiePolicyDocument())?.metadata ?? { title: 'Tcules', robots: { index: false } }
  );
}

export default async function CookiePolicyPage() {
  const legal = await getCookiePolicyDocument();
  if (!legal) notFound();
  const caseRefs = await getCaseRefs(caseRoutesIn(legal.page));
  return (
    <>
      {legal.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(legal.structuredData) }}
        />
      ) : null}
      <LongformPage page={legal.page} family="article" caseRefs={caseRefs} />
    </>
  );
}
