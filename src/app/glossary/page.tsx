import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCorpusPage } from '@/content';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { ROUTES } from '@/lib/routes';
import { CorpusBandView, ListingIndex, glossaryIndex } from '@/templates';

/**
 * `/glossary` — the hub, read from the `_pages/` copy and set as a LISTING (4 Nov 2026): the glossary
 * is the listing family's term index, so it takes the insights hub's structure (ListingIndex): the
 * opening, then the rail beside the term groups, each term a drawn card; the group's ask as the
 * close; the FAQ after it, the same FAQ band every corpus page renders. Composition only.
 *
 * The route stays in PASS_1_COMPOSED_ROUTES (src/app/_corpus/composed.tsx) so kinds:check keeps
 * proving every band of its copy reaches the page; it no longer renders through ComposedRoute.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getCorpusPage(ROUTES.glossary);
  return page ? corpusMetadata(page) : { title: 'Tcules' };
}

export default async function GlossaryHub() {
  const page = await getCorpusPage(ROUTES.glossary);
  if (!page) notFound();
  const index = glossaryIndex(page);
  return (
    <ListingIndex
      breadcrumbs={page.breadcrumb.map((crumb) => ({ label: crumb.name, href: crumb.url }))}
      hero={index.hero}
      label="Glossary"
      railLabel="Browse the glossary"
      views={[{ id: 'groups', label: 'Groups', sections: index.sections }]}
      lead={index.lead}
      empty="No terms are published yet."
      closing={index.closing}
      bands={{
        afterClose: index.after.map((band) => (
          <CorpusBandView key={band.id} page={page} band={band} />
        )),
      }}
    />
  );
}
