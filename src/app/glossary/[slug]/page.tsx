import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getGlossaryDocument, listPublishedGlossaries } from '@/content';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { LongformRoute } from '@/app/_corpus/longform';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listPublishedGlossaries()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/glossary/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const page = await getGlossaryDocument(slug);
  return page
    ? corpusMetadata(page)
    : {
        title: 'Glossary entry not found | Tcules',
        robots: { index: false, follow: false },
      };
}

export default async function GlossaryPage({ params }: PageProps<'/glossary/[slug]'>) {
  const { slug } = await params;
  const page = await getGlossaryDocument(slug);
  if (!page) notFound();
  return <LongformRoute route={page.route} page={page} />;
}
