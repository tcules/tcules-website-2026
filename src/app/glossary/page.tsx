import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getGlossaryMasterPage, getPageSeo } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { ListingIndex, publishedGlossaryIndex } from '@/templates';
import type { HomeSection } from '@/templates/CorpusPage/published-home-model';
import { PublishedSection } from '@/templates/CorpusPage/PublishedHome';

/**
 * `/glossary` — the hub, read from the new CMS's Glossary Master single type and set as a LISTING
 * (4 Nov 2026): the opening, then the rail beside the term groups, each term a row linking to its
 * `/glossary/{slug}` page; the CTA after the groups as the close; the FAQ and any other band in the
 * Dynamic Zone's order around them. Terms come through each group's Glossary relation. SEO is the
 * SEO Page for `/glossary`. Composition only.
 *
 * The route stays in PASS_1_COMPOSED_ROUTES (src/app/_corpus/composed.tsx) so kinds:check keeps
 * comparing the `_pages/` copy with what renders; it no longer renders through ComposedRoute.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.glossary)).metadata;
}

const bands = (sections: readonly HomeSection[]) =>
  sections.map((section) => (
    <PublishedSection key={section.key} section={section} route={ROUTES.glossary} />
  ));

export default async function GlossaryHub() {
  const [page, { structuredData }] = await Promise.all([
    getGlossaryMasterPage(),
    getPageSeo(ROUTES.glossary),
  ]);
  if (!page) notFound();
  const { lead, sections } = publishedGlossaryIndex(page);
  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
        />
      ) : null}
      <ListingIndex
        breadcrumbs={page.hero.breadcrumbs}
        hero={{ title: page.hero.title, eyebrow: page.hero.eyebrow, lede: page.hero.body }}
        label="Glossary"
        railLabel="Browse the glossary"
        views={[{ id: 'groups', label: 'Groups', sections }]}
        lead={lead}
        empty="No terms are published yet."
        closing={page.closing}
        bands={{
          afterHero: bands(page.before),
          afterListing: bands(page.between),
          afterClose: bands(page.after),
        }}
      />
    </>
  );
}
