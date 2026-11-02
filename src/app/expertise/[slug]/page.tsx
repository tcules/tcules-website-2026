import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getExpertiseOfferPage, listPublishedExpertises } from '@/content';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { OfferRoute } from '@/app/_corpus/offer';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listPublishedExpertises()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/expertise/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const expertise = await getExpertiseOfferPage(slug);
  return expertise
    ? corpusMetadata(expertise.page)
    : {
        title: 'Expertise not found | Tcules',
        robots: { index: false, follow: false },
      };
}

export default async function ExpertisePage({ params }: PageProps<'/expertise/[slug]'>) {
  const { slug } = await params;
  const expertise = await getExpertiseOfferPage(slug);
  if (!expertise) notFound();
  return <OfferRoute route={expertise.page.route} {...expertise} />;
}
