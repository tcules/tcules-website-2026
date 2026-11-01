import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BrandMark, Button } from '@/components';
import { getAuthorPage, getInsightsPage, listAuthors, type AuthorPage } from '@/content';
import { jsonLdMarkup, ORGANIZATION_ID, schemaId } from '@/lib/json-ld';
import { authorPath, ROUTES, SITE_ORIGIN } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { Breadcrumbs, PageHero, type BreadcrumbItem } from '@/patterns';
import { AuthorPieces, ListingClose } from '@/templates';

import { closingOf, insightCards } from '../../../_insights/hub';

/**
 * One person's author page (owner, 1 Nov 2026; decisions/2026-11-01-author-pages-one-template-from-strapi):
 * the ONE template every person a live byline names is plugged into. One composed head (owner, 1 Nov
 * 2026: "a real profile page"): their face at a confident size beside their name, role, bio, the
 * topics they write about as labels and their LinkedIn on the role line where known. Then every live
 * piece that credits them, newest first and all visible, under a head that counts them (AuthorPieces:
 * the latest as the wide feature, a row of covers where there are enough, the rest as the ledger),
 * then the hub's close.
 *
 * It is the `url` Google's author markup asks for (decisions/2026-10-29-author-pages-ship-at-launch),
 * so it emits `ProfilePage` with its `Person`, on the `@id` the CMS's article markup already names.
 */

type AuthorPageProps = { params: Promise<{ slug: string }> };

const INSIGHTS_SLUG = ROUTES.insights.slice(1);

/* A LinkedIn profile opens beside the page. Spread, as Button's anchor props are open (ProfileCard's idiom). */
const NEW_TAB = { target: '_blank', rel: 'noopener' } as const;

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
 * The topic chips under the bio: what they write about, the most frequent few, so the head stays one
 * composed block. Counted from the live pieces, so no chip claims a subject the cards below lack.
 */
const TOPIC_LABELS = 4;

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
        ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
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
        arrangement="profile"
        portrait={{ name: author.name, ...(author.image ? { image: author.image } : {}) }}
        title={author.name}
        titleSize="h1"
        body={body.length > 0 ? (body as [string, ...string[]]) : undefined}
        labels={author.topics.slice(0, TOPIC_LABELS)}
        leadAside={
          /* Their LinkedIn, only where one is known, on the role line: it belongs to who the person
             is, not to a row of its own under the labels. A link, the mark before the label as on
             every LinkedIn link, opening beside the page. Never the blue solid: that is the page's
             one main action, and a profile asks nothing of the reader. */
          author.linkedin ? (
            <Button
              as="a"
              href={author.linkedin}
              {...NEW_TAB}
              emphasis="link"
              tone="primary"
              iconLeft={<BrandMark name="linkedin" />}
              aria-label={`${author.name} on LinkedIn (opens in a new tab)`}
            >
              LinkedIn
            </Button>
          ) : undefined
        }
        texture
        surface="paper"
      />

      {hub ? (
        <AuthorPieces heading={piecesHeading(author)} items={insightCards(hub, author.pieces)} />
      ) : null}

      {hub ? (
        <ListingClose closing={closingOf(hub, authorPath(author.slug), 'author-page')} />
      ) : null}
    </>
  );
}
