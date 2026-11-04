import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import sharp from 'sharp';

/**
 * A share card's picture, prepared for Satori: read (a public file or a CMS URL), sized to the box it
 * lands in at export resolution, and handed over as a PNG data URL. Satori decodes neither WebP nor
 * AVIF — the formats the CMS and the kit photo catalogue serve — so every picture passes through here.
 *
 * The fit follows the rulings, not the box: a photograph is cropped to its box about its focal point;
 * a capture (a case banner, an article cover) and an illustration are never cropped (ruling H3,
 * decisions/2026-10-16-drawing-never-cropped-faces-its-form) — they are fitted whole, and the layout
 * sizes the box to them.
 */
export type ShareMedia = {
  kind: 'illustration' | 'photo' | 'capture';
  /** A public path (`/kit/…`, `/illustrations/…`) or an absolute CMS URL. */
  src: string;
  width: number;
  height: number;
  /** A photograph's focal point, 0–1 on each axis. */
  focus?: { x: number; y: number };
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
 * The picture as a data URL at `width` × `height` export pixels. `cover` crops (photographs only);
 * `contain` fits the whole picture inside the box at its own ratio, and returns the size it took.
 */
export async function preparedMedia(
  media: ShareMedia,
  box: { width: number; height: number },
): Promise<{ src: string; width: number; height: number }> {
  const input = await bytes(media.src);
  const density = media.src.endsWith('.svg') ? 300 : undefined;
  const image = sharp(input, density ? { density } : {});

  if (media.kind === 'photo') {
    const meta = await image.metadata();
    const w = meta.width ?? media.width;
    const h = meta.height ?? media.height;
    const scale = Math.max(box.width / w, box.height / h);
    const scaledW = Math.round(w * scale);
    const scaledH = Math.round(h * scale);
    const fx = media.focus?.x ?? 0.5;
    const fy = media.focus?.y ?? 0.5;
    const left = Math.min(Math.max(Math.round(scaledW * fx - box.width / 2), 0), scaledW - box.width);
    const top = Math.min(Math.max(Math.round(scaledH * fy - box.height / 2), 0), scaledH - box.height);
    const out = await image
      .resize(scaledW, scaledH)
      .extract({ left, top, width: box.width, height: box.height })
      .jpeg({ quality: 85 })
      .toBuffer();
    return { src: `data:image/jpeg;base64,${out.toString('base64')}`, ...box };
  }

  const ratio = media.width / media.height;
  const width = Math.round(Math.min(box.width, box.height * ratio));
  const height = Math.round(width / ratio);
  const out = await image.resize(width, height, { fit: 'inside' }).png().toBuffer();
  return { src: `data:image/png;base64,${out.toString('base64')}`, width, height };
}

/* ── The pixel-grid field ─────────────────────────────────────────────────────────────────── */

type Grid = { pitch: number; cells: { x: number; y: number; width: number; height: number; alpha: number }[] };

let grid: Promise<Grid> | undefined;

/**
 * The site's texture (src/styles/textures/pixel-grid.json, the one source the component and the
 * export script read) as a field over a box, fading out from one corner the way the site's feathered
 * field does (TextureFlow `feather`). Drawn by sharp, since Satori has no pattern fill.
 */
export async function textureField(
  box: { width: number; height: number },
  ink: string,
  scale: number,
): Promise<string> {
  grid ??= readFile(join(process.cwd(), 'src/styles/textures/pixel-grid.json'), 'utf8').then(
    (json) => JSON.parse(json) as Grid,
  );
  const { pitch, cells } = await grid;
  const p = pitch * scale;
  const rects = cells
    .map(
      (c) =>
        `<rect x="${c.x * scale}" y="${c.y * scale}" width="${c.width * scale}" height="${c.height * scale}" fill="${ink}" fill-opacity="${c.alpha}"/>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}">
    <defs>
      <pattern id="p" width="${p}" height="${p}" patternUnits="userSpaceOnUse">${rects}</pattern>
      <radialGradient id="g" cx="0.85" cy="0.9" r="0.95">
        <stop offset="0" stop-color="#fff"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.75"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <mask id="m"><rect width="100%" height="100%" fill="url(#g)"/></mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#p)" mask="url(#m)"/>
  </svg>`;
  const out = await sharp(Buffer.from(svg)).png().toBuffer();
  return `data:image/png;base64,${out.toString('base64')}`;
}
