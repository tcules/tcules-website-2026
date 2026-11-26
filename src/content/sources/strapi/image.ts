import type { ImageRecord, ImageSource } from '../../types';

/**
 * The one mapping from a Strapi upload file to the view model's image record.
 *
 * Every Strapi mapper used to carry its own `absoluteAssetUrl` and its own four-field image
 * literal. They agreed on the four fields and disagreed on everything around them, and none of
 * them read `formats` — so the site had a responsive-image primitive (`Media`) and no data for it.
 * This file is where an upload's derived widths become `sources`, once, for every mapper.
 *
 * Nothing above `sources/` learns that Strapi exists: the output is `ImageRecord`, which is
 * shaped for the page, and `Media`'s own `MediaImage` matches it structurally.
 */

/** The fields of a Strapi upload file this module reads. Every mapper's file type satisfies it. */
export type StrapiUploadFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
  /** A JSON scalar in the GraphQL schema: `{ [formatName]: { url, width, height, … } }`. */
  formats?: unknown;
  /** Set by `markAnimatedUploads` when the file's header says it moves; Strapi does not record it. */
  animated?: boolean;
};

function text(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

/**
 * Alt text as a reader may hear it, or undefined. The copy corpus marks an open image slot with a
 * status in capitals joined by underscores (`IMAGE_ASSET_REQUIRED`), and the import carried some of
 * those into Strapi's alt fields, where a screen reader read them aloud. A status is never alt text.
 */
export function readableAlt(candidate: string | null | undefined): string | undefined {
  const value = text(candidate);
  return value && !/^[A-Z0-9]+(?:_[A-Z0-9]+)+$/.test(value) ? value : undefined;
}

export function positiveDimension(candidate: number | null | undefined): number | undefined {
  return typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0
    ? candidate
    : undefined;
}

/**
 * Resolve an upload URL against the GraphQL endpoint. Strapi's local provider returns a
 * root-relative `/uploads/…`; a cloud provider returns an absolute URL. Anything that does not
 * resolve to http(s) is refused rather than rendered.
 */
export function absoluteAssetUrl(
  url: string | null | undefined,
  graphqlUrl: string,
): string | undefined {
  const path = text(url);
  if (!path) return undefined;

  try {
    const resolved = new URL(path, graphqlUrl);
    return resolved.protocol === 'https:' || resolved.protocol === 'http:'
      ? resolved.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}

/**
 * Strapi's generated formats as `sources`, ascending by width.
 *
 * The format NAMES are not read — `thumbnail`, `small`, `medium`, `large` or whatever the upload
 * breakpoints are configured to (strapi-changes.md: 1240 · 652 · 320 under ruling M2). Only each
 * entry's url and width matter, so a breakpoint change in Strapi changes nothing here. A format
 * as wide as the master or wider is dropped: the master is the better file at that width, and
 * `Media` adds it to the srcset itself.
 */
export function imageSources(
  formats: unknown,
  masterWidth: number,
  graphqlUrl: string,
): ImageSource[] | undefined {
  if (!isRecord(formats)) return undefined;

  const byWidth = new Map<number, string>();
  for (const format of Object.values(formats)) {
    if (!isRecord(format)) continue;
    const width = positiveDimension(
      typeof format.width === 'number' ? format.width : undefined,
    );
    const src = absoluteAssetUrl(
      typeof format.url === 'string' ? format.url : undefined,
      graphqlUrl,
    );
    if (!width || !src || width >= masterWidth) continue;
    byWidth.set(Math.round(width), src);
  }
  if (byWidth.size === 0) return undefined;

  return [...byWidth.entries()]
    .sort(([a], [b]) => a - b)
    .map(([width, src]) => ({ src, width }));
}

/**
 * An upload file as an `ImageRecord`, or `undefined` when it cannot be one: no resolvable URL, or
 * no intrinsic width and height (an image with no dimensions cannot reserve its space, so it is
 * not an image record). `requireImageMime` additionally refuses a non-`image/*` upload, for the
 * fields that also accept video or documents.
 *
 * `kind`, `panel` and `shadow` are left undefined: Strapi records none of them yet
 * (strapi-changes.md entries 3 and 7), and an image with no kind renders as a capture (M3).
 */
export function mapUploadImage(
  file: StrapiUploadFile | null | undefined,
  graphqlUrl: string,
  options: { fallbackAlt?: string; requireImageMime?: boolean } = {},
): ImageRecord | undefined {
  if (!file) return undefined;
  if (options.requireImageMime && !text(file.mime).startsWith('image/')) return undefined;

  const src = absoluteAssetUrl(file.url, graphqlUrl);
  const width = positiveDimension(file.width);
  const height = positiveDimension(file.height);
  if (!src || !width || !height) return undefined;

  const sources = imageSources(file.formats, width, graphqlUrl);
  return {
    src,
    alt: text(file.alternativeText) || options.fallbackAlt || '',
    width,
    height,
    ...(sources ? { sources } : {}),
    ...(file.animated ? { animated: true } : {}),
  };
}

/* ── Motion ─────────────────────────────────────────────────────────────────────────────────── */

const motionMemo = new Map<string, Promise<boolean>>();

/**
 * Whether the file at `src` moves, read from its own header: a WebP's VP8X chunk carries an
 * animation flag (bit 1 of the byte after the chunk header), and an animated GIF carries the
 * NETSCAPE2.0 looping extension ahead of its frames. Strapi records neither, so the header is the
 * one place it is written. Only the first kilobyte is fetched (a range request), once per file per
 * process: an upload's URL carries its hash, so its bytes never change. Any failure reads as still,
 * which is how every image rendered before this check existed.
 */
export function isAnimated(src: string): Promise<boolean> {
  if (!/\.(webp|gif)$/i.test(new URL(src, 'https://x.invalid').pathname)) return Promise.resolve(false);
  let pending = motionMemo.get(src);
  if (!pending) {
    pending = fetch(src, {
      headers: { Range: 'bytes=0-1023' },
      cache: 'force-cache',
      signal: AbortSignal.timeout(4_000),
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const head = new Uint8Array(await response.arrayBuffer()).subarray(0, 1024);
        const ascii = (from: number, to: number) => String.fromCharCode(...head.subarray(from, to));
        if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP')
          return ascii(12, 16) === 'VP8X' && ((head[20] ?? 0) & 0x02) !== 0;
        if (ascii(0, 3) === 'GIF') return ascii(0, head.length).includes('NETSCAPE2.0');
        return false;
      })
      .catch(() => false);
    motionMemo.set(src, pending);
  }
  return pending;
}

/**
 * Marks every upload file in a CMS response whose file moves (`isAnimated`) with `animated: true`,
 * in place. Run once on every response, where it is fetched and before it is cached, so every
 * mapper's image record carries the fact without knowing it exists: an animated image renders
 * the same way wherever it appears on the site. An upload is any object with a string `url` to a
 * WebP or GIF and numeric `width` and `height`; a Strapi format inside `formats` is a JSON scalar
 * and is never an upload, so its copies are not read.
 */
export async function markAnimatedUploads(data: unknown, graphqlUrl: string): Promise<void> {
  const uploads: Record<string, unknown>[] = [];
  const walk = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach(walk);
    const record = value as Record<string, unknown>;
    if (
      typeof record.url === 'string' &&
      /\.(webp|gif)(?:$|[?#])/i.test(record.url) &&
      typeof record.width === 'number' &&
      typeof record.height === 'number'
    )
      uploads.push(record);
    for (const [key, child] of Object.entries(record)) if (key !== 'formats') walk(child);
  };
  walk(data);
  await Promise.all(
    uploads.map(async (upload) => {
      const src = absoluteAssetUrl(upload.url as string, graphqlUrl);
      if (src && (await isAnimated(src))) upload.animated = true;
    }),
  );
}
