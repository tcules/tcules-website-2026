import type { Metadata } from 'next';

import { Layout, Section } from '@/components';
import { CASE_INDEX_ROUTE } from '@/app/_corpus/case-index';
import { isCorpusCase } from '@/app/_corpus/case';
import { isCorpusLongform } from '@/app/_corpus/longform';
import { isCorpusOffer } from '@/app/_corpus/offer';
import { isCorpusTool } from '@/app/_corpus/tool';
import { listCorpusPages } from '@/content';
import { designCorpusPagePath } from '@/lib/routes';
import { ListCard } from '@/patterns';
import { planOffer } from '@/templates';

export const metadata: Metadata = {
  title: 'CorpusPage | Design',
  robots: { index: false, follow: false },
};

/** The file slug `generateStaticParams` and the sub-route use: `/a/b` is `a__b`, `/` is `home`. */
const fileSlug = (route: string) =>
  route === '/' ? 'home' : route.slice(1).replaceAll('/', '__');

/**
 * CorpusPage, the templates the `_pages/` corpus renders through: `HomePage` for `/`, and
 * `OfferPage` for a service, an audit or an expertise page.
 *
 * Each page below links to the SAME template the live route renders, here under /design so a band
 * can be judged without the site chrome's route gate. Under every offer page is its PLAN: the shape
 * each band was classified as, the surface it takes, the side its photograph sits on, and whether it
 * is a visual or a text-heavy band in the rhythm. The plan is `planOffer`, the same function the page
 * calls, so this list cannot drift from what renders. A band whose kind is `generic` has a shape no
 * rule names yet, and renders plainly, every word in place.
 */
export default async function CorpusPageIndex() {
  const pages = await listCorpusPages();
  const offers = pages.filter((page) => isCorpusOffer(page.route));
  const cases = pages.filter((page) => isCorpusCase(page.route));
  const tools = pages.filter((page) => isCorpusTool(page.route));
  const longform = pages.filter((page) => isCorpusLongform(page.route));
  const about = pages.find((page) => page.route === '/about');
  const index = pages.find((page) => page.route === CASE_INDEX_ROUTE);

  return (
    <Section>
      <Layout rowGap="stack">
        <Layout rowGap="block">
          <h1>CorpusPage</h1>
          <p>
            The templates the content team&apos;s pages render through. Every band keeps its
            words and its place; the template decides only how it is shown.
          </p>
        </Layout>

        <Layout rowGap="block">
          <h2>Home</h2>
          <Layout as="ul" rowGap="none">
            <ListCard
              title="HomePage"
              body="/ — one page type, one page: a name grid, a rating, six situations, four cases one at a time, six services, four reasons, client voices, a banner, eight sectors, the questions and the form."
              titleAs="h3"
              href={designCorpusPagePath('home')}
            />
          </Layout>
        </Layout>

        <Layout rowGap="block">
          <h2>OfferPage</h2>
          <Layout as="ul" rowGap="none">
            {offers.map((page) => (
              <ListCard
                key={page.route}
                title={page.route}
                body={`${page.pageType} · ${page.bands.length} bands, planned as ${planOffer(
                  page,
                )
                  .map(
                    (unit) =>
                      `${unit.id} ${unit.kind}${unit.part === 'whole' ? '' : `/${unit.part}`}`,
                  )
                  .join(' · ')}`}
                titleAs="h3"
                href={designCorpusPagePath(fileSlug(page.route))}
              />
            ))}
          </Layout>
        </Layout>

        <Layout rowGap="block">
          <h2>LongformPage</h2>
          <Layout as="ul" rowGap="none">
            {cases.map((page) => (
              <ListCard
                key={page.route}
                title={page.route}
                body={`${page.pageType} · ${page.bands.length} bands: the facts as a record, the argument in one shell (a table-of-contents rail beside a reading column, a numbered method as Steps, bound artefacts as Media), the impact as cards, the cases to read next, the form.`}
                titleAs="h3"
                href={designCorpusPagePath(fileSlug(page.route))}
              />
            ))}
          </Layout>
        </Layout>

        <Layout rowGap="block">
          <h2>LongformPage, article and term</h2>
          <Layout as="ul" rowGap="none">
            {longform.map((page) => (
              <ListCard
                key={page.route}
                title={page.route}
                body={
                  page.pageType === 'article'
                    ? `${page.pageType} · ${page.bands.length} bands: the byline in the hero, the whole argument in one shell (the outline rail beside a reading column; tables, a numbered method and labelled diagrams break the prose), a tinted close that keeps its inline links.`
                    : `${page.pageType} · ${page.bands.length} bands: the definition in the hero, its sharpest sentence as a statement, the rest of the definition and the headed sections in one shell beside the outline, a closing ask.`
                }
                titleAs="h3"
                href={designCorpusPagePath(fileSlug(page.route))}
              />
            ))}
          </Layout>
        </Layout>

        {about ? (
          <Layout rowGap="block">
            <h2>AboutPage</h2>
            <Layout as="ul" rowGap="none">
              <ListCard
                title={about.route}
                body={`${about.pageType} · ${about.bands.length} bands: the studio paragraphs beside a photograph, six services on a rail, three situations, the differences in two halves, the principles in an accordion, two people, four cases beside the working wall, client voices, the company record as two halves, the questions, a coda, the ask and a careers banner.`}
                titleAs="h3"
                href={designCorpusPagePath(fileSlug(about.route))}
              />
            </Layout>
          </Layout>
        ) : null}

        <Layout rowGap="block">
          <h2>LongformPage, tool</h2>
          <Layout as="ul" rowGap="none">
            {tools.map((page) => (
              <ListCard
                key={page.route}
                title={page.route}
                body={`${page.pageType} · ${page.bands.length} bands: the hero with its one action to the worksheet, then every band in one shell beside the outline: the bold-led method as Steps, the worksheet as a boxed table (#workspace), the worked example as the tint example panel with its story drawing beside the words, a diagram plate after the words it explains, the FAQ last.`}
                titleAs="h3"
                href={designCorpusPagePath(fileSlug(page.route))}
              />
            ))}
          </Layout>
        </Layout>

        {index ? (
          <Layout rowGap="block">
            <h2>ListingIndex, the case-study index</h2>
            <Layout as="ul" rowGap="none">
              <ListCard
                title={index.route}
                body={`${index.pageType} · ${index.bands.length} bands: the case-study index on the one listing template, its cases grouped by stage or industry. Each group's shape comes from its position and count: a featured case, a featured set, equal covers, thumbnail rows in two columns, then the form close.`}
                titleAs="h3"
                href={designCorpusPagePath(fileSlug(index.route))}
              />
            </Layout>
          </Layout>
        ) : null}
      </Layout>
    </Section>
  );
}
