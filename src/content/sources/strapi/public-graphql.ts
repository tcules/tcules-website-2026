const PRODUCTION_URL = 'https://tcules-cms-2026-production.up.railway.app/graphql';

export function publicGraphqlUrl(): string {
  return process.env.NEW_CMS_GRAPHQL_URL?.trim() || PRODUCTION_URL;
}

/** Published reads for routes on the new CMS. The legacy endpoint remains route-specific. */
export async function publicGraphql<T>(
  query: string,
  operationName: string,
  variables?: Record<string, string>,
): Promise<T> {
  const response = await fetch(publicGraphqlUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, operationName, variables }),
    cache: 'force-cache',
    next: { revalidate: 300, tags: [operationName] },
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
