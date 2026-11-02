import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCaseRefs, getAboutDocument } from '@/content';
import { caseRoutesIn } from '@/lib/corpus-cases';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { AboutPage } from '@/templates';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const document = await getAboutDocument();
  return document
    ? corpusMetadata(document.page)
    : { title: 'About page not found | Tcules', robots: { index: false, follow: false } };
}

export default async function About() {
  const document = await getAboutDocument();
  if (!document) notFound();
  const caseRefs = await getCaseRefs(caseRoutesIn(document.page));
  return (
    <>
      <AboutPage page={document.page} caseRefs={caseRefs} avatars={document.avatars} />
      {document.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(document.structuredData).replace(/</gu, '\\u003c'),
          }}
        />
      ) : null}
    </>
  );
}
