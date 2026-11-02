const DEFAULT_GRAPHQL_URL = 'https://tcules-cms-2026-production.up.railway.app/graphql';

/** Shared by case studies, resources and services in preview. Server-only settings. */
export function productionCmsUrl(): string {
  return process.env.STRAPI_CASE_STUDY_GRAPHQL_URL?.trim() || DEFAULT_GRAPHQL_URL;
}

export function productionCmsHeaders(): Record<string, string> {
  const token = process.env.STRAPI_CASE_STUDY_API_TOKEN?.trim();
  return {
    accept: 'application/json',
    'content-type': 'application/json',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
}

export async function productionCmsQuery<T>(
  query: string,
  variables: Record<string, unknown>,
  tags: string[],
): Promise<T> {
  const response = await fetch(productionCmsUrl(), {
    method: 'POST',
    headers: productionCmsHeaders(),
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(10_000),
    cache: 'force-cache',
    next: { revalidate: 300, tags },
  });
  if (!response.ok)
    throw new Error(`Production CMS request failed with HTTP ${response.status}.`);
  const payload = (await response.json()) as {
    data?: T | null;
    errors?: { message?: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(
      `Production CMS GraphQL query failed: ${payload.errors.map((error) => error.message).join('; ')}`,
    );
  }
  if (!payload.data) throw new Error('Production CMS GraphQL query returned no data.');
  return payload.data;
}
