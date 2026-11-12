export function publicGraphqlUrl(): string {
  const value = process.env.NEW_CMS_GRAPHQL_URL?.trim();
  if (!value) throw new Error('NEW_CMS_GRAPHQL_URL is required');
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
    throw new Error('NEW_CMS_GRAPHQL_URL must be an HTTP(S) URL without credentials');
  return url.href;
}
