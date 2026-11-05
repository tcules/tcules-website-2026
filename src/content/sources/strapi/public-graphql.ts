const PRODUCTION_URL = 'https://tcules-cms-2026-production.up.railway.app/graphql';

export function publicGraphqlUrl(): string {
  return process.env.NEW_CMS_GRAPHQL_URL?.trim() || PRODUCTION_URL;
}

/** Read published content and SEO from the new CMS on each server request. */
export async function publicGraphql<T>(
  query: string,
  operationName: string,
  variables?: Record<string, string>,
  options?: { optionalImagePaths: readonly string[] },
): Promise<T> {
  const response = await fetch(publicGraphqlUrl(), {
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
    if (message !== 'Cannot return null for non-nullable field ComponentContentImage.file.' || !path)
      return true;
    if (path.slice(-3).join('.') === 'illustration.image.file') return false;

    // Other image slots are explicitly allowed by the query. Match any array index, and
    // only recover if the response kept the containing card or relationship intact.
    const pattern = path.map((part) => (typeof part === 'number' ? '*' : part)).join('.');
    if (!options?.optionalImagePaths.includes(pattern)) return true;
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
