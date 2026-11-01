import type {
  Author,
  AuthorPage,
  AuthorsContentSource,
  ImageRecord,
  InsightResource,
} from '../../types';
import { personSlug, teamPortrait } from '../people';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { insightsSource } from './insights';

/**
 * The author pages' source (owner, 1 Nov 2026; decisions/2026-11-01-author-pages-one-template-from-strapi).
 *
 * Strapi has no author collection yet: a person exists only as the byline component on each blog
 * (`blogProfileSection`: name, designation, profile picture). So the person list is DERIVED from
 * every live blog's bylines, the same pool the insights hub lists, and each person's pieces are the
 * hub's own records for the blogs that credit them. When the CMS carries an author collection, a
 * source that reads it replaces this file at one assignment in `source.ts`, and no page changes.
 *
 * Events, podcasts and interviews credit nobody (checked 1 Nov 2026: none of the three types has a
 * person field), so only blogs are read.
 *
 * Per person: the name as Strapi sends it, merged by slug; the role and the photograph from the
 * first byline (newest piece first) that has each; the portrait in `public/people/` where Strapi has
 * none, exactly as the byline falls back (`teamPortrait`), so the byline and the page show one face.
 */

const DEFAULT_STRAPI_GRAPHQL_URL = 'https://tcules-server-production.up.railway.app/graphql';
const AUTHORS_REVALIDATE_SECONDS = 300;
/* The hub's limit (insights.ts): above every live count, so no byline is dropped. */
const BLOG_LIMIT = 500;
const INSIGHTS_SLUG = 'insights';

const BYLINES_QUERY = /* GraphQL */ `
  query GetBlogBylines($status: PublicationStatus = PUBLISHED, $limit: Int = 500) {
    blogs(status: $status, sort: ["publishedAt:desc"], pagination: { limit: $limit }) {
      slug
      blogProfileSection {
        id
        name
        designation
        profilePicture {
          url
          alternativeText
          width
          height
          formats
          mime
        }
      }
    }
  }
`;

type StrapiByline = {
  id?: string | null;
  name?: string | null;
  designation?: string | null;
  profilePicture?: StrapiUploadFile[] | null;
};

type StrapiBylinesResponse = {
  data?: {
    blogs?: Array<{ slug?: string | null; blogProfileSection?: StrapiByline[] | null }> | null;
  } | null;
  errors?: Array<{ message?: string | null }> | null;
};

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.replace(/\s+/gu, ' ').trim() : '';
}

function normaliseSlug(candidate: string | null | undefined): string {
  return value(candidate)
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

function getStrapiGraphqlUrl(): string {
  return value(process.env.STRAPI_GRAPHQL_URL) || DEFAULT_STRAPI_GRAPHQL_URL;
}

async function fetchBylines(graphqlUrl: string): Promise<StrapiBylinesResponse> {
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      query: BYLINES_QUERY,
      variables: { status: 'PUBLISHED', limit: BLOG_LIMIT },
    }),
    cache: 'force-cache',
    next: { revalidate: AUTHORS_REVALIDATE_SECONDS, tags: ['blogs', 'authors'] },
  });

  if (!response.ok) {
    throw new Error(`Strapi bylines request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiBylinesResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi bylines query failed: ${errors.join('; ')}`);
  }
  return payload;
}

function profileImage(
  files: StrapiUploadFile[] | null | undefined,
  name: string,
  graphqlUrl: string,
): ImageRecord | undefined {
  for (const file of files ?? []) {
    const image = mapUploadImage(file, graphqlUrl, {
      fallbackAlt: name,
      requireImageMime: true,
    });
    if (image) return image;
  }
  return undefined;
}

/** What a person writes about: their pieces' categories and tags, most frequent first. */
function topicsOf(pieces: readonly InsightResource[]): string[] {
  const counts = new Map<string, number>();
  for (const piece of pieces) {
    const names = new Set(
      [...piece.categories, ...piece.tags].map((item) => item.name.trim()).filter(Boolean),
    );
    for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
}

type Person = Omit<Author, 'pieceCount'> & { pieces: InsightResource[] };

/**
 * Everyone a live byline names, each with the hub's records of their pieces in the hub's order
 * (newest first). A byline on a blog the hub does not list is not a live piece and is not counted.
 */
async function loadPeople(): Promise<Person[]> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const [payload, hub] = await Promise.all([
    fetchBylines(graphqlUrl),
    insightsSource.getInsightsPage(INSIGHTS_SLUG),
  ]);
  /* The blog collection's pieces only (articles, guides, research, videos): the hub's events,
     podcasts and interviews are other collections, whose slugs could repeat a blog's. */
  const pool = (hub?.resources.items ?? []).filter(
    (item) => item.kind !== 'event' && item.kind !== 'podcast' && item.kind !== 'interview',
  );
  const bySlug = new Map(pool.map((item) => [item.slug, item]));

  type Gathered = Person & { credited: Set<string> };
  const people = new Map<string, Gathered>();
  for (const blog of payload.data?.blogs ?? []) {
    const piece = bySlug.get(normaliseSlug(blog.slug));
    if (!piece) continue;
    for (const byline of blog.blogProfileSection ?? []) {
      const name = value(byline.name);
      const slug = personSlug(name);
      if (!name || !slug) continue;
      let person = people.get(slug);
      if (!person) {
        person = { slug, name, pieces: [], credited: new Set<string>() };
        people.set(slug, person);
      }
      const role = value(byline.designation);
      if (!person.role && role) person.role = role;
      if (!person.image) {
        const image = profileImage(byline.profilePicture, name, graphqlUrl);
        if (image) person.image = image;
      }
      person.credited.add(piece.slug);
    }
  }

  return [...people.values()].map(({ credited, ...person }) => {
    const image = person.image ?? teamPortrait(person.name);
    return {
      ...person,
      ...(image ? { image } : {}),
      /* The hub's order, so the page lists newest first exactly as the hub does. */
      pieces: pool.filter((item) => credited.has(item.slug)),
    };
  });
}

export const authorsSource: AuthorsContentSource = {
  async listAuthors() {
    const people = await loadPeople();
    return people.map(({ pieces, ...person }) => ({ ...person, pieceCount: pieces.length }));
  },

  async getAuthorPage(slug): Promise<AuthorPage | null> {
    /* The canonical slug only: "Yash-Gidwani" is not a second URL for the same page. */
    const person = (await loadPeople()).find((candidate) => candidate.slug === slug);
    if (!person) return null;
    return {
      ...person,
      pieceCount: person.pieces.length,
      topics: topicsOf(person.pieces),
    };
  },
};
