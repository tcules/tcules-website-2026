import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getExpertiseListingPage } from '@/content';
import { ComposedRoute } from '@/app/_corpus/composed';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { ROUTES } from '@/lib/routes';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const listing = await getExpertiseListingPage();
  return listing
    ? corpusMetadata(listing.page)
    : {
        title: 'Expertise not found | Tcules',
        robots: { index: false, follow: false },
      };
}

export default async function ExpertiseHub() {
  const listing = await getExpertiseListingPage();
  if (!listing) notFound();
  return <ComposedRoute route={ROUTES.expertise} {...listing} />;
}
