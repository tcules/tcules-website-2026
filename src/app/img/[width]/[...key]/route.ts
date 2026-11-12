import sharp from 'sharp';

import { originalFor } from '@/lib/image-resize';

/**
 * One CMS image at one width of the ladder, as lossless WebP: `/img/1240/<r2 key>.webp`.
 *
 * Lossless because the owner's bar is "crystal clear, no artifacts" (11 Nov 2026): the only change
 * from the original is the resize, which the browser would otherwise do itself. The response is
 * immutable (an R2 key carries the upload's hash, so its bytes never change), and Cloudflare caches
 * it by its `.webp` extension, so each width is made once. Only what `lib/image-resize.ts` allows is
 * served: anything else is a 404, never a fetch.
 */
export async function GET(_request: Request, ctx: RouteContext<'/img/[width]/[...key]'>) {
  const { width, key } = await ctx.params;
  const target = Number(width);
  const original = originalFor(target, key);
  if (!original) return notFound();

  const upstream = await fetch(original, { signal: AbortSignal.timeout(15_000) }).catch(
    () => null,
  );
  if (!upstream?.ok) return notFound();

  const originalBytes = Buffer.from(await upstream.arrayBuffer());
  try {
    const resized = await sharp(originalBytes)
      .rotate()
      .resize({ width: target, withoutEnlargement: true })
      /* The original's colour profile travels with it: a screenshot taken on a Mac is often
         Display P3, and stripped of it the copy renders duller than the original. */
      .keepIccProfile()
      .webp({ lossless: true, effort: 4 })
      .toBuffer();
    /* Lossless can outweigh a lossy original (a photograph saved as lossy WebP at 2560): then the
       original is served as it is, so a smaller width is never a heavier download or a lesser file. */
    const smaller = resized.length < originalBytes.length;
    return new Response(new Uint8Array(smaller ? resized : originalBytes), {
      headers: {
        'Content-Type': smaller
          ? 'image/webp'
          : (upstream.headers.get('content-type') ?? 'application/octet-stream'),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error(`Image resize failed for ${original} at ${target}`, error);
    return notFound();
  }
}

function notFound() {
  return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
}
