import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Section } from '@/components';
import { getCaseStudyIndex, getPageSeo } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
import { LogoGrid } from '@/patterns';
import { caseFinder, caseViews, ListingIndex } from '@/templates';
import { PublishedSection } from '@/templates/CorpusPage/PublishedHome';

import { readFinder } from '@/app/_listing/finder-query';

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo(ROUTES.caseStudies)).metadata;
}

type ListingPage = NonNullable<Awaited<ReturnType<typeof getCaseStudyIndex>>>;

function bands(sections: ListingPage['before']) {
  return sections.map((section) => {
    if (section.type !== 'clients')
      return (
        <PublishedSection key={section.key} section={section} route={ROUTES.caseStudies} />
      );
    const headingId = section.heading ? `${section.id ?? section.key}-heading` : undefined;
    return (
      <Section
        key={section.key}
        id={section.id}
        surface={section.surface}
        data-band="H"
        aria-labelledby={headingId}
      >
        <LogoGrid
          marks={section.marks}
          context={section.heading}
          contextAs="h2"
          headingId={headingId}
          edges="closed"
          density={section.compact ? 'compact' : 'default'}
        />
      </Section>
    );
  });
}

export default async function CaseStudies({ searchParams }: PageProps<'/case-studies'>) {
  const [page, { structuredData }, query] = await Promise.all([
    getCaseStudyIndex(),
    getPageSeo(ROUTES.caseStudies),
    searchParams,
  ]);
  if (!page) notFound();

  const { hero, listing } = page;
  const config = listing.finder;
  const read = readFinder({
    path: ROUTES.caseStudies,
    query,
    groups: config.filters,
    items: listing.cases,
    matches: (item, group, id) =>
      Object.entries(item.tags).some(([name, ids]) => group === name && ids.includes(id)),
    text: (item) =>
      [
        item.title,
        item.eyebrow,
        item.description,
        ...(item.bodyHtml ?? []).map((html) => html.replace(/<[^>]+>/g, '')),
      ].join(' '),
  });

  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
        />
      ) : null}
      <ListingIndex
        breadcrumbs={hero.breadcrumbs}
        hero={{ title: hero.title, eyebrow: hero.eyebrow, lede: hero.body, stats: hero.stats }}
        label={config.label}
        railLabel={config.railLabel}
        views={caseViews([{ id: 'stage', label: 'By stage', groups: listing.groups }], true)}
        finder={caseFinder({
          ...read,
          search: { value: read.search, label: config.searchLabel },
          items: read.filtered,
          preserveOrder: true,
        })}
        empty={config.empty ?? ''}
        bands={{ afterHero: bands(page.before), afterListing: bands(page.after) }}
      />
    </>
  );
}
