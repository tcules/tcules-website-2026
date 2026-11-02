import type { Metadata } from 'next';

import { Layout, Section } from '@/components';
import { getInsightsPage, listAuthors, type Author } from '@/content';
import { jsonLdMarkup, schemaId } from '@/lib/json-ld';
import { authorPath, ROUTES, SITE_ORIGIN } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { Breadcrumbs, PageHero, ProfileCard, type BreadcrumbItem } from '@/patterns';
import { ListingClose } from '@/templates';

import { closingOf } from '../../_insights/hub';

/**
 * The authors index (owner, 1 Nov 2026; decisions/2026-11-01-author-pages-one-template-from-strapi):
 * everyone a live byline names, each as a ProfileCard linking to their page, ordered by surname and
 * all visible. The hero is centred (owner, 1 Nov 2026), the texture behind it, and the people under
 * it: each card says who the person is in a sentence or two and links to their LinkedIn where one is
 * known, so the set reads as a team of writers rather than a directory. It ends on the hub's close.
 */

const INSIGHTS_SLUG = ROUTES.insights.slice(1);

const TITLE = 'Authors';
const LEDE = 'The designers and founders who write Tcules Insights, and everything each of them has published.';
const DESCRIPTION =
  'The designers and founders who write Tcules Insights: every author, their role and their pieces.';

const CRUMBS: readonly BreadcrumbItem[] = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Insights', href: ROUTES.insights },
  { label: TITLE, href: ROUTES.authors },
];

export const metadata: Metadata = {
  title: `${TITLE} | Tcules`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_ORIGIN}${ROUTES.authors}` },
  openGraph: {
    title: `${TITLE} | Tcules`,
    description: DESCRIPTION,
    type: 'website',
    url: `${SITE_ORIGIN}${ROUTES.authors}`,
  },
};

/** By surname, then by the whole name: "Anshu Jain" before "Jatin Leuva". */
const surname = (name: string) => name.trim().split(/\s+/).at(-1) ?? name;
const bySurname = (a: Author, b: Author) =>
  surname(a.name).localeCompare(surname(b.name)) || a.name.localeCompare(b.name);

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/** The close's lead, in the hub's voice: the hub's line points at pieces, and this page shows people. */
const CLOSE_LEAD = 'If one of these writers works on the problem in your own product, tell us about it.';

export default async function AuthorsIndexPage() {
  const [authors, hub] = await Promise.all([listAuthors(), getInsightsPage(INSIGHTS_SLUG)]);
  const people = [...authors].sort(bySurname);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': schemaId(ROUTES.authors, 'webpage'),
        url: `${SITE_ORIGIN}${ROUTES.authors}`,
        name: TITLE,
        breadcrumb: { '@id': schemaId(ROUTES.authors, 'breadcrumb') },
        hasPart: people.map((person) => ({ '@id': schemaId(authorPath(person.slug), 'person') })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': schemaId(ROUTES.authors, 'breadcrumb'),
        itemListElement: CRUMBS.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.label,
          item: `${SITE_ORIGIN}${crumb.href === '/' ? '' : crumb.href}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
      />

      <PageHero
        data-fold-hero=""
        trail={heroTrail(CRUMBS, TITLE, (t) => (
          <Breadcrumbs {...t} />
        ))}
        title={TITLE}
        body={[LEDE]}
        arrangement="centred"
        texture
        surface="paper"
      />

      {/* The cards' head is the hero's (a listing, as ListingIndex sets its list under its
          masthead): every person, nothing behind a slider or a "show more". */}
      <Section surface="paper" aria-label="Every author">
        <Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
          {people.map((person) => (
            <ProfileCard
              key={person.slug}
              name={person.name}
              role={person.role}
              bio={person.bio}
              portrait={person.image}
              link={{ label: `More from ${firstName(person.name)}`, href: authorPath(person.slug) }}
              {...(person.linkedin
                ? { linkedin: { label: 'LinkedIn', href: person.linkedin } }
                : {})}
            />
          ))}
        </Layout>
      </Section>

      {hub ? (
        <ListingClose
          closing={closingOf(hub, ROUTES.authors, 'authors-index')}
          lead={CLOSE_LEAD}
        />
      ) : null}
    </>
  );
}
