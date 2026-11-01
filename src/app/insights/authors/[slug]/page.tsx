import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAuthorPage, getInsightsPage, listAuthors, type AuthorPage } from '@/content';
import { jsonLdMarkup, ORGANIZATION_ID, schemaId } from '@/lib/json-ld';
import { authorPath, ROUTES, SITE_ORIGIN } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { Breadcrumbs, PageHero, type BreadcrumbItem } from '@/patterns';
import { InsightResources, ListingClose } from '@/templates';

import { closingOf, insightCards } from '../../../_insights/hub';

/**
 * One person's author page (owner, 1 Nov 2026; decisions/2026-11-01-author-pages-one-template-from-strapi):
 * the ONE template every person a live byline names is plugged into. Their face, name and role as the
 * CMS sends them, a bio only when the CMS has one, then every live piece that credits them as the
 * hub's own cards, newest first and all visible, then the hub's close.
 *
 * It is the `url` Google's author markup asks for (decisions/2026-10-29-author-pages-ship-at-launch),
 * so it emits `ProfilePage` with its `Person`, on the `@id` the CMS's article markup already names.
 */

type AuthorPageProps = { params: Promise<{ slug: string }> };

const INSIGHTS_SLUG = ROUTES.insights.slice(1);

export async function generateStaticParams() {
  const authors = await listAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/** "Chirag Patel, Product Designer" — the name, then the role where the CMS sends one. */
const nameAndRole = (author: AuthorPage) =>
  author.role ? `${author.name}, ${author.role}` : author.name;

/** "a, b and c" */
function listed(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

/** The pieces' head: how many, by whom. Videos and guides count, because each is a piece. */
const piecesHeading = (author: AuthorPage) =>
  `${author.pieceCount} ${author.pieceCount === 1 ? 'piece' : 'pieces'} by ${firstName(author.name)}`;

/**
 * The description, from what the CMS holds and nothing else: their role, how many pieces, and the
 * topics those pieces are filed under. No biography is written for anyone.
 */
function describe(author: AuthorPage): string {
  const who = author.role ? `${author.name}, ${author.role} at Tcules.` : `${author.name}, Tcules.`;
  const topics = author.topics.slice(0, 3);
  const count = `${author.pieceCount} ${author.pieceCount === 1 ? 'piece' : 'pieces'}`;
  return topics.length > 0
    ? `${who} ${count} on ${listed(topics)}.`
    : `${who} ${count} on Tcules Insights.`;
}

function breadcrumbs(author: AuthorPage): BreadcrumbItem[] {
  return [
    { label: 'Home', href: ROUTES.home },
    { label: 'Insights', href: ROUTES.insights },
    { label: 'Authors', href: ROUTES.authors },
    { label: author.name, href: authorPath(author.slug) },
  ];
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorPage(slug);

  if (!author) {
    return { title: 'Author not found | Tcules', robots: { index: false, follow: false } };
  }

  const title = `${nameAndRole(author)} | Tcules`;
  const description = describe(author);
  const url = `${SITE_ORIGIN}${authorPath(author.slug)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'profile',
      url,
      images: author.image
        ? [
            {
              url: author.image.src,
              width: author.image.width,
              height: author.image.height,
              alt: author.name,
            },
          ]
        : [],
    },
    twitter: { card: 'summary', title, description, images: author.image ? [author.image.src] : [] },
  };
}

function structuredData(author: AuthorPage, crumbs: readonly BreadcrumbItem[]) {
  const path = authorPath(author.slug);
  const url = `${SITE_ORIGIN}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': schemaId(path, 'webpage'),
        url,
        name: nameAndRole(author),
        breadcrumb: { '@id': schemaId(path, 'breadcrumb') },
        mainEntity: { '@id': schemaId(path, 'person') },
      },
      {
        '@type': 'Person',
        '@id': schemaId(path, 'person'),
        name: author.name,
        url,
        ...(author.role ? { jobTitle: author.role } : {}),
        ...(author.image
          ? {
              image: author.image.src.startsWith('/')
                ? `${SITE_ORIGIN}${author.image.src}`
                : author.image.src,
            }
          : {}),
        ...(author.bio ? { description: author.bio } : {}),
        worksFor: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': schemaId(path, 'breadcrumb'),
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.label,
          item: `${SITE_ORIGIN}${crumb.href === '/' ? '' : crumb.href}`,
        })),
      },
    ],
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const [author, hub] = await Promise.all([getAuthorPage(slug), getInsightsPage(INSIGHTS_SLUG)]);

  if (!author) notFound();

  const crumbs = breadcrumbs(author);
  /* The role is the lead line; a bio, when the CMS has one, the paragraph under it. A person with
     neither still has a finished hero: the face, the name and the trail. */
  const body = [author.role ?? '', author.bio ?? ''].filter((line) => line.trim().length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData(author, crumbs)) }}
      />

      <PageHero
        data-fold-hero=""
        trail={heroTrail(crumbs, author.name, (t) => (
          <Breadcrumbs {...t} />
        ))}
        portrait={{ name: author.name, ...(author.image ? { image: author.image } : {}) }}
        title={author.name}
        titleSize="h1"
        body={body.length > 0 ? (body as [string, ...string[]]) : undefined}
        texture
        surface="paper"
      />

      {hub ? (
        <InsightResources heading={piecesHeading(author)} items={insightCards(hub, author.pieces)} />
      ) : null}

      {hub ? (
        <ListingClose closing={closingOf(hub, authorPath(author.slug), 'author-page')} />
      ) : null}
    </>
  );
}
