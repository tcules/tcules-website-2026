/**
 * `next/cache` — host-framework shim for the Design System artifact bundle. See next-link.tsx for why
 * the real module cannot be bundled (it pulls in Next's server tracer, which needs Next's runtime).
 *
 * The reader is the Strapi source's published-data cache, which every specimen importing `@/content`
 * reaches through `source.ts`. A library card reads the fixtures and never calls it, so the shim passes
 * the function through uncached and makes revalidation a no-op.
 */
export function unstable_cache<T extends (...args: never[]) => unknown>(fn: T): T {
  return fn;
}

export function revalidateTag(): void {}

export function revalidatePath(): void {}
