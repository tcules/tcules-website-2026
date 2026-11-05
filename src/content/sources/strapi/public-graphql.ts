import { unstable_cache } from 'next/cache';

import { CMS_CONTENT_TAG, CMS_REVALIDATE_SECONDS } from './cache';

const PRODUCTION_URL = 'https://tcules-cms-2026-production.up.railway.app/graphql';

export function publicGraphqlUrl(): string {
  return process.env.NEW_CMS_GRAPHQL_URL?.trim() || PRODUCTION_URL;
}

async function requestPublishedData<T>(
  url: string,
  operationName: string,
  body: string,
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(8_000),
  });
  const result = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (!response.ok || result.errors?.length || !result.data) {
    const reason = result.errors?.map(({ message }) => message).join('; ');
    throw new Error(`New CMS ${operationName}: ${reason || `HTTP ${response.status}`}`);
  }
  return result.data;
}

/** Published reads for routes on the new CMS. The legacy endpoint remains route-specific. */
export function publicGraphql<T>(
  query: string,
  operationName: string,
  variables?: Record<string, string>,
): Promise<T> {
  // Cache validated GraphQL data so HTTP 200 responses containing errors are never stored.
  const read = unstable_cache(requestPublishedData<T>, ['strapi-published-graphql'], {
    revalidate: CMS_REVALIDATE_SECONDS,
    tags: [CMS_CONTENT_TAG, operationName],
  });
  return read(
    publicGraphqlUrl(),
    operationName,
    JSON.stringify({ query, operationName, variables }),
  );
}
