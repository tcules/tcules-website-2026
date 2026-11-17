import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOfferScenes, getPageSeo, getPublishedLabPage } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { hasPlaceholder, placeholderImage } from '@/lib/placeholders';
import { ROUTES } from '@/lib/routes';
import type { HeroMedia } from '@/patterns';
import { PublishedLab } from '@/templates/CorpusPage/PublishedLab';

/**
 * `/future-interfaces-lab`: the Future Interfaces Lab Single Type from the new CMS. Its words, sections,
 * order and variants are the CMS's; its SEO is the published SEO Page for the same path.
 */
export const revalidate = 300;

const route = ROUTES.futureInterfacesLab;

/** The hero illustration the page drew before the CMS (the register's labelled slot), for a hero with none. */
const heroFallback: HeroMedia | undefined = hasPlaceholder(route, 'hero')
  ? { type: 'image', image: placeholderImage(route, 'hero') }
  : undefined;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(route)).metadata;
}

export default async function LabPage() {
  const [page, { structuredData }, scenes] = await Promise.all([
    getPublishedLabPage(),
    getPageSeo(route),
    getOfferScenes(route),
  ]);
  if (!page) notFound();
  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
        />
      ) : null}
      <PublishedLab
        page={page}
        scenes={scenes}
        fallbackMedia={page.hero.media ? undefined : heroFallback}
      />
    </>
  );
}
