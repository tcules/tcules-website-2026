import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getGlossaryDetail, getGlossaryDetailSeo } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { LongformPage } from '@/templates';

type GlossaryPageProps = { params: Promise<{ slug: string }> };

/* A Glossary record from the new CMS, resolved by slug on demand: a record published later
   renders without a rebuild, and an unknown or unpublished slug is a 404. The record is mapped onto
   the term page's own view model, so the page is the same TERM template the corpus drew. */
export const revalidate = 300;

export async function generateMetadata({ params }: GlossaryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const glossary = await getGlossaryDetail(slug);
    if (!glossary)
      return {
        title: 'Glossary entry not found | Tcules',
        description: null,
        robots: { index: false, follow: false },
      };
    return (await getGlossaryDetailSeo(slug)).metadata;
  } catch {
    return {
      title: 'Glossary entry temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
}

export default async function GlossaryPage({ params }: GlossaryPageProps) {
  const { slug } = await params;
  const glossary = await getGlossaryDetail(slug);
  if (!glossary) notFound();
  const { structuredData } = await getGlossaryDetailSeo(slug);

  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
        />
      ) : null}
      <LongformPage page={glossary} family="term" caseRefs={{}} />
    </>
  );
}
