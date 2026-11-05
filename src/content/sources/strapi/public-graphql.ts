const PRODUCTION_URL = 'https://tcules-cms-2026-production.up.railway.app/graphql';

export function publicGraphqlUrl(): string {
  return process.env.NEW_CMS_GRAPHQL_URL?.trim() || PRODUCTION_URL;
}

/** Read published content and SEO from the new CMS on each server request. */
export async function publicGraphql<T>(
  query: string,
  operationName: string,
  variables?: Record<string, string>,
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
  // Strapi returns a null image for a missing file inside an optional illustration.
  // Keep the surrounding content available so the existing illustration fallback can render.
  const hasUnexpectedError = result.errors?.some(
    ({ message, path }) =>
      message !== 'Cannot return null for non-nullable field ComponentContentImage.file.' ||
      path?.slice(-3).join('.') !== 'illustration.image.file',
  );
  if (!response.ok || hasUnexpectedError || !result.data) {
    const reason = result.errors?.map(({ message }) => message).join('; ');
    throw new Error(`New CMS ${operationName}: ${reason || `HTTP ${response.status}`}`);
  }
  if (result.errors?.length) {
    console.warn(
      `New CMS ${operationName}: ${result.errors.length} illustration files are missing`,
    );
  }
  return result.data;
}
