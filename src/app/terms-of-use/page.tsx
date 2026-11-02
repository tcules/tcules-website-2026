import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LongformRoute } from '@/app/_corpus/longform';
import { getLegalDocument } from '@/content';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { ROUTES } from '@/lib/routes';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const document = await getLegalDocument(ROUTES.terms);
  return document
    ? corpusMetadata(document.page)
    : { title: 'Page not found | Tcules', robots: { index: false, follow: false } };
}

export default async function TermsOfUsePage() {
  const document = await getLegalDocument(ROUTES.terms);
  if (!document) notFound();
  return (
    <>
      <LongformRoute route={ROUTES.terms} page={document.page} />
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
