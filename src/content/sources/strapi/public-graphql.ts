import { unstable_cache } from 'next/cache';

import { publicGraphqlUrl } from './cms-url';
export { publicGraphqlUrl } from './cms-url';

import { modelTag, queryTags, relationDependencies } from '../../../lib/cms/cache-policy';

const inFlight = new Map<string, Promise<unknown>>();

async function coalesce<T>(key: string, read: () => Promise<T>): Promise<T> {
  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;
  const promise = read();
  inFlight.set(key, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(key);
  }
}

/** Cache only validated published data; webhook tags control its lifetime. */
export async function publicGraphql<T>(
  query: string,
  operationName: string,
  variables?: Record<string, string>,
  options?: { optionalImagePaths?: readonly string[]; revalidate?: number },
): Promise<T> {
  if (/\bmutation\s/.test(query))
    throw new Error('CMS mutations must not use the content cache');
  const url = publicGraphqlUrl();
  const key = JSON.stringify([
    url,
    query,
    operationName,
    variables,
    options?.optionalImagePaths,
  ]);
  return coalesce(
    key,
    unstable_cache(
      () => readPublicGraphql<T>(url, query, operationName, variables, options),
      ['cms-graphql-v1', key],
      { tags: queryTags(query, operationName, variables), revalidate: false },
    ),
  );
}

async function readPublicGraphql<T>(
  url: string,
  query: string,
  operationName: string,
  variables?: Record<string, string>,
  options?: { optionalImagePaths?: readonly string[]; revalidate?: number },
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, operationName, variables }),
    cache: 'no-store',
    signal: AbortSignal.timeout(8_000),
  });
  const result = (await response.json()) as {
    data?: T;
    errors?: { message: string; path?: (string | number)[] }[];
  };
  // Strapi can null an optional image whose required file is missing.
  const hasUnexpectedError = result.errors?.some(({ message, path }) => {
    if (
      message !== 'Cannot return null for non-nullable field ComponentContentImage.file.' ||
      !path
    )
      return true;
    if (path.slice(-3).join('.') === 'illustration.image.file') return false;

    // Other image slots are explicitly allowed by the query. Match any array index, and
    // only recover if the response kept the containing card or relationship intact.
    const pattern = path.map((part) => (typeof part === 'number' ? '*' : part)).join('.');
    if (!options?.optionalImagePaths?.includes(pattern)) return true;
    const image = path.slice(0, -1).reduce<unknown>((parent, part) => {
      return parent && typeof parent === 'object'
        ? (parent as Record<string | number, unknown>)[part]
        : undefined;
    }, result.data);
    return image !== null;
  });
  if (!response.ok || hasUnexpectedError || !result.data) {
    const reason = result.errors?.map(({ message }) => message).join('; ');
    throw new Error(`New CMS ${operationName}: ${reason || `HTTP ${response.status}`}`);
  }
  if (result.errors?.length) {
    console.warn(
      `New CMS ${operationName}: ${result.errors.length} optional image files are missing`,
    );
  }
  return result.data;
}

/** Compatibility for the older GraphQL envelopes. Keep their queries and mappers intact. */
const LEGACY_MODELS: Record<string, string> = {
  audits: 'audit',
  services: 'service',
  'services-master': 'service-master',
  expertise: 'expertise',
  glossary: 'glossary',
  tools: 'tool',
  blogs: 'resource',
  events: 'resource',
  podcasts: 'resource',
  interviews: 'resource',
  insights: 'resource-listing',
  authors: 'author',
  careers: 'career-master',
  'case-studies': 'case-study',
};
export async function cachedCmsFetch(
  url: string,
  init: RequestInit & { next?: { tags?: string[]; revalidate?: number | false } },
) {
  if (url !== publicGraphqlUrl()) throw new Error('CMS requests must use NEW_CMS_GRAPHQL_URL');
  const body = JSON.parse(String(init.body)) as { query: string };
  if (/\bmutation\s/.test(body.query)) throw new Error('CMS mutations must not be cached');
  const tags = new Set(
    (init.next?.tags ?? []).map((tag) =>
      modelTag(LEGACY_MODELS[tag.split(':')[0]!] ?? tag.split(':')[0]!),
    ),
  );
  for (const model of relationDependencies(body.query, false)) tags.add(modelTag(model));
  const key = JSON.stringify([url, init.body]);
  const data = await coalesce(
    key,
    unstable_cache(
      async () => {
        const response = await fetch(url, {
          ...init,
          next: undefined,
          cache: 'no-store',
          signal: AbortSignal.timeout(8_000),
        });
        const payload = (await response.json()) as { data?: unknown; errors?: unknown[] };
        if (!response.ok || payload.errors?.length || !payload.data)
          throw new Error(`CMS legacy query failed (HTTP ${response.status})`);
        return payload;
      },
      ['cms-legacy-v1', key],
      { tags: [...tags], revalidate: false },
    ),
  );
  return Response.json(data);
}
