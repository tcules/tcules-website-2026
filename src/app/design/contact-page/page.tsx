import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPublishedContactPage } from '@/content';
import { PublishedContact } from '@/templates/CorpusPage/PublishedContact';
import type { ContactPageModel } from '@/templates/CorpusPage/published-contact-model';

export const metadata: Metadata = {
  title: 'PublishedContact | Design',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * /design/contact-page — /contact's template (PublishedContact) over the CMS Contact Page as
 * published, the folder's specimen now that the page reads the CMS (owner, 26 Nov 2026;
 * decisions/2026-11-26-pages-corpus-removed). The other CMS page templates in the folder are reviewed
 * on their own routes (decisions/2026-10-31-kinds-approved-on-real-pages).
 *
 *   (default)          the page as the CMS publishes it: the centred hero with the enquiry island
 *                      inside it, the channels, the profiles and the questions
 *   ?state=three       three channels: the tiles go three across
 *   ?state=no-form     no form CTA: the hero carries no panel, the rest unchanged
 *
 * A template's specimen is the page itself: what is judged is the composition down its length.
 */
export default async function ContactPageSpecimen({ searchParams }: Props) {
  const live = await getPublishedContactPage();
  if (!live) notFound();
  const state = (await searchParams).state;
  const page: ContactPageModel =
    state === 'three'
      ? {
          ...live,
          sections: live.sections.map((section) =>
            section.type === 'channels'
              ? { ...section, channels: section.channels.slice(0, 3) }
              : section,
          ),
        }
      : state === 'no-form'
        ? { ...live, sections: live.sections.filter((section) => section.type !== 'cta') }
        : live;
  return <PublishedContact page={page} />;
}
