import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getServiceOfferPage, listPublishedServices } from '@/content';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { OfferRoute } from '@/app/_corpus/offer';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listPublishedServices()).map(({ slug }) => ({ slug: slug.split('/') }));
}

export async function generateMetadata({
  params,
}: PageProps<'/services/[...slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceOfferPage(slug.join('/'));
  return service
    ? corpusMetadata(service.page)
    : {
        title: 'Service not found | Tcules',
        robots: { index: false, follow: false },
      };
}

export default async function ServicePage({ params }: PageProps<'/services/[...slug]'>) {
  const { slug } = await params;
  const service = await getServiceOfferPage(slug.join('/'));
  if (!service) notFound();
  return <OfferRoute route={service.page.route} {...service} />;
}
