/**
 * The site's own image resizer: where a resized copy of a CMS image lives, and which ones exist.
 *
 * Owner, 11 Nov 2026 (decisions/2026-11-11-images-resized-by-own-server, superseding M1's "Strapi's
 * own formats"): the site resizes Strapi originals itself, at the M2 ladder, as lossless WebP, through
 * one route (`app/img/[width]/[...key]/route.ts`), cached at Cloudflare. Nobody does anything per
 * image and nothing in Strapi is configured.
 *
 * A leaf: `Media` builds its srcset from `resizedSrc`, and the route validates a request with
 * `originalFor`. Both read the one allowlist below, so the route can only ever resize what a page
 * could have asked for.
 */

/** The M2 ladder below the 2560 master (decisions/2026-09-28-image-width-ladder). */
export const RESIZE_WIDTHS: readonly number[] = [320, 652, 1240];

/** The only store the resizer reads from: the CMS's public R2 bucket. */
const ORIGIN = 'https://pub-03a6bf73987b442ab0a1b4037ec6740c.r2.dev';

/** Raster formats the resizer accepts. A GIF may be animated and an SVG needs no resizing. */
const RASTER = /\.(png|jpe?g|webp)$/i;

/**
 * The path a resized copy is served at, or `undefined` when this image is not ours to resize.
 * It ends in `.webp` because Cloudflare caches a response by its extension, which is what keeps a
 * width from being resized again on every request (and across deploys). An original that is
 * already a WebP keeps its own name rather than gaining a second `.webp`.
 */
export function resizedSrc(src: string, width: number): string | undefined {
  if (!RESIZE_WIDTHS.includes(width)) return undefined;
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return undefined;
  }
  if (url.origin !== ORIGIN || url.search || !RASTER.test(url.pathname)) return undefined;
  const path = /\.webp$/i.test(url.pathname) ? url.pathname : `${url.pathname}.webp`;
  return `/img/${width}${path}`;
}

/**
 * The original a resize request names, or `undefined` when the request is not one `resizedSrc`
 * could have produced: an unlisted width, another store, a path that climbs, or a non-raster file.
 */
export function originalFor(width: number, key: readonly string[]): string | undefined {
  if (!RESIZE_WIDTHS.includes(width) || key.length === 0) return undefined;
  if (key.some((part) => !part || part === '.' || part === '..')) return undefined;
  const path = key.join('/');
  if (!path.endsWith('.webp')) return undefined;
  /* `photo.png.webp` names `photo.png`; `cover.webp` names itself (see `resizedSrc`). */
  const stripped = path.slice(0, -'.webp'.length);
  const original = RASTER.test(stripped) ? stripped : path;
  return `${ORIGIN}/${original.split('/').map(encodeURIComponent).join('/')}`;
}
