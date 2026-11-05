import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import sharp from 'sharp';

/**
 * A share card's picture, prepared for Satori: read (a public file or a CMS URL), sized to the box it
 * lands in at export resolution, and handed over as a PNG data URL. Satori decodes neither WebP nor
 * AVIF — the formats the CMS and the kit photo catalogue serve — so every picture passes through here.
 *
 * An illustration is fitted whole (decisions/2026-10-16-drawing-never-cropped-faces-its-form). Every
 * other picture fills the card's one 16:9 frame (owner, 5 Nov 2026): a case cover and a video thumbnail
 * are 16:9 already and fill it whole; a Strapi banner or an article cover of another ratio is cropped
 * from its centre, a portrait from the face.
 */
export type ShareMedia = {
  kind: 'illustration' | 'capture' | 'portrait';
  /** Where a crop is anchored, 0–1 on each axis; the centre when absent. A portrait passes the face. */
  focus?: { x: number; y: number };
  /** A public path (`/kit/…`, `/illustrations/…`) or an absolute CMS URL. */
  src: string;
  width: number;
  height: number;
};

async function bytes(src: string): Promise<Buffer> {
  if (/^https?:\/\//.test(src)) {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`share card: ${src} answered ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  }
  return readFile(join(process.cwd(), 'public', src));
}

/**
 * Whether a photograph was cut to a circle on transparency: all four corners clear. Such a portrait is
 * a cut-out, not a photograph a frame can hold, so a person's card sets their initials instead
 * (owner, 5 Nov 2026: Rakesh's and Rushali's photos are rounded crops). Read failures say no.
 */
export async function isCutOut(src: string): Promise<boolean> {
  try {
    const { data, info } = await sharp(await bytes(src)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alpha = (x: number, y: number) => data[(y * info.width + x) * info.channels + 3] ?? 255;
    const [r, b] = [info.width - 3, info.height - 3];
    return [alpha(2, 2), alpha(r, 2), alpha(2, b), alpha(r, b)].every((a) => a < 16);
  } catch {
    return false;
  }
}

/**
 * The picture as a data URL at `width` × `height` export pixels. `cover` fills the box, cropped from
 * the centre; `contain` fits the whole picture inside it at its own ratio and returns the size it took.
 */
export async function preparedMedia(
  media: ShareMedia,
  box: { width: number; height: number },
  fit: 'cover' | 'contain',
  /** The ground under any transparency (a portrait cut to a circle), since JPEG has none. */
  ground?: string,
): Promise<{ src: string; width: number; height: number }> {
  const input = await bytes(media.src);
  const density = media.src.endsWith('.svg') ? 300 : undefined;
  const image = sharp(input, density ? { density } : {});

  if (fit === 'cover') {
    const { width: w = box.width, height: h = box.height } = await sharp(input).metadata();
    const scale = Math.max(box.width / w, box.height / h);
    const sw = Math.max(box.width, Math.round(w * scale));
    const sh = Math.max(box.height, Math.round(h * scale));
    const focus = media.focus ?? { x: 0.5, y: 0.5 };
    const clamp = (v: number, max: number) => Math.min(Math.max(0, Math.round(v)), max);
    const out = await (ground ? image.flatten({ background: ground }) : image)
      .resize(sw, sh)
      .extract({
        left: clamp(focus.x * sw - box.width / 2, sw - box.width),
        top: clamp(focus.y * sh - box.height / 2, sh - box.height),
        width: box.width,
        height: box.height,
      })
      .jpeg({ quality: 90 })
      .toBuffer();
    return { src: `data:image/jpeg;base64,${out.toString('base64')}`, ...box };
  }

  const ratio = media.width / media.height;
  const width = Math.round(Math.min(box.width, box.height * ratio));
  const height = Math.round(width / ratio);
  const out = await image.resize(width, height, { fit: 'inside' }).png().toBuffer();
  return { src: `data:image/png;base64,${out.toString('base64')}`, width, height };
}
