import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getCaseRefs,
  getContactChannels,
  getContactFollow,
  getCorpusPage,
  getPageSeo,
  getTestimonialAvatars,
  getTestimonialRatings,
} from '@/content';
import { caseRoutesIn } from '@/lib/corpus-cases';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { ContactPage as ContactTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.contact)).metadata;
}

/** The 26 Oct copy through the Contact template (component-map § E /contact). Composition only. */
async function ContactFromCopy() {
  const page = await getCorpusPage(ROUTES.contact);
  if (!page) notFound();
  const [caseRefs, ratings, avatars, channels, follow] = await Promise.all([
    getCaseRefs(caseRoutesIn(page)),
    getTestimonialRatings(page.composition.testimonialIds),
    getTestimonialAvatars(page.composition.testimonialIds),
    getContactChannels(),
    getContactFollow(),
  ]);
  return (
    <ContactTemplate
      page={page}
      caseRefs={caseRefs}
      shared={{}}
      ratings={ratings}
      avatars={avatars}
      channels={channels}
      follow={follow}
    />
  );
}

export default async function ContactPage() {
  const { structuredData } = await getPageSeo(ROUTES.contact);
  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
        />
      ) : null}
      <ContactFromCopy />
    </>
  );
}
