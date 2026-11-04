import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';
import type { CSSProperties, ReactNode } from 'react';

import { BAR_PATH, WORDMARK_PATHS, WORDMARK_VIEWBOX } from '@/components';

import type { ShareCard } from './card';
import { preparedMedia, textureField } from './media';

/**
 * Draws a share card. Authored at 1280 × 670 and exported at 2x (2560 × 1340, ch10 C1); every figure
 * below is in authored units and goes through `px`.
 *
 * Three directions, for the owner to pick between (4 Nov 2026). Each carries the page's own picture
 * where it has one, and the same parts: the mono meta line, the serif hero, the wordmark. They differ
 * in where the picture sits and how much of the card it takes:
 *   a · split          words left, the picture right — unboxed if it is a drawing
 *   b · island         words on paper, the picture on a textured island; a drawing rises out of it
 *   c · picture first  the picture across the top, the words under it, as the page itself opens
 * A page with no picture gets the island in every direction, holding its own subject word large.
 *
 * Satori reads inline styles and no CSS, so this is the one place in the site that styles with
 * objects, and the reason it reads its colours and radii out of the token layer.
 */
export type ShareDirection = 'a' | 'b' | 'c';
export const SHARE_DIRECTIONS: readonly ShareDirection[] = ['a', 'b', 'c'];

const SCALE = 2;
const W = 1280;
const H = 670;
export const SHARE_SIZE = { width: W * SCALE, height: H * SCALE } as const;
const px = (value: number) => Math.round(value * SCALE);

/* ── Tokens, from the token layer ─────────────────────────────────────────────────────────── */

let primitives: Promise<Map<string, string>> | undefined;

/** Every literal `--name: value;` in primitives.css, by name. */
function tokens(): Promise<Map<string, string>> {
  primitives ??= readFile(join(process.cwd(), 'src/styles/tokens/primitives.css'), 'utf8').then((css) => {
    const found = new Map<string, string>();
    for (const [, name, value] of css.matchAll(/--([a-z0-9-]+):\s*([^;{}]+?)\s*;/gi)) {
      if (name && value && !found.has(name)) found.set(name, value);
    }
    return found;
  });
  return primitives;
}

type Ink = {
  paper: string;
  island: string;
  hero: string;
  meta: string;
  blue: string;
  mark: string;
  islandRadius: number;
  mediaRadius: number;
};

async function inks(): Promise<Ink> {
  const t = await tokens();
  const get = (name: string) => {
    const value = t.get(name);
    if (!value) throw new Error(`share card: no --${name} in primitives.css`);
    return value;
  };
  return {
    paper: get('color-paper'),
    island: get('color-paper-deep'),
    hero: get('color-neutral-900'),
    meta: get('color-neutral-700'),
    blue: get('color-brandeis-500'),
    mark: get('color-neutral-950'),
    /* --isl-radius and --media-radius, by the primitives they name (island.css, media.css). */
    islandRadius: Number.parseInt(get('radius-24'), 10),
    mediaRadius: Number.parseInt(get('radius-8'), 10),
  };
}

/* ── Type ─────────────────────────────────────────────────────────────────────────────────── */

let faces: Promise<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]> | undefined;

/** Newsreader 400 at optical size 72 and Geist Mono 600, as static TTFs (fonts/README.md). */
function fonts() {
  const file = (name: string) => readFile(join(process.cwd(), 'src/app/_og/fonts', name));
  faces ??= Promise.all([file('newsreader-72-400.ttf'), file('geist-mono-600.ttf')]).then(
    ([serif, mono]) => [
      { name: 'Newsreader', data: serif, weight: 400, style: 'normal' },
      { name: 'Geist Mono', data: mono, weight: 600, style: 'normal' },
    ],
  );
  return faces;
}

/* ch10 A3's serif ladder: size, leading, tracking. A split column takes 64 (C3). */
const SERIF = {
  88: { leading: 1.06, tracking: '-0.022em' },
  72: { leading: 1.1, tracking: '-0.02em' },
  64: { leading: 1.12, tracking: '-0.018em' },
  52: { leading: 1.16, tracking: '-0.012em' },
} as const;
type SerifSize = keyof typeof SERIF;

const serif = (size: SerifSize, color: string): CSSProperties => ({
  fontFamily: 'Newsreader',
  fontWeight: 400,
  fontSize: px(size),
  lineHeight: SERIF[size].leading,
  letterSpacing: SERIF[size].tracking,
  color,
  textWrap: 'balance',
});

/* C2: mono 24 on a preview, tracked +.12em, uppercase in presentation only. */
const MONO: CSSProperties = {
  fontFamily: 'Geist Mono',
  fontWeight: 600,
  fontSize: px(24),
  lineHeight: 1.2,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

/* ── Parts ────────────────────────────────────────────────────────────────────────────────── */

function Meta({ card, ink }: { card: ShareCard; ink: Ink }) {
  return (
    <div style={{ ...MONO, display: 'flex', flexWrap: 'wrap', columnGap: '0.6em' }}>
      <span style={{ color: ink.blue }}>{card.meta.kind}</span>
      {card.meta.fact ? <span style={{ color: ink.meta }}>·</span> : null}
      {card.meta.fact ? <span style={{ color: ink.meta }}>{card.meta.fact}</span> : null}
    </div>
  );
}

function Mark({ ink, height = 32 }: { ink: Ink; height?: number }) {
  const h = px(height);
  return (
    <svg
      width={(h * WORDMARK_VIEWBOX.width) / WORDMARK_VIEWBOX.height}
      height={h}
      viewBox={`0 0 ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`}
    >
      {[...WORDMARK_PATHS, BAR_PATH].map((d) => (
        <path key={d} d={d} fill={ink.mark} />
      ))}
    </svg>
  );
}

function Action({ card, ink }: { card: ShareCard; ink: Ink }) {
  return card.action ? <div style={{ ...MONO, color: ink.blue }}>{card.action}</div> : null;
}

/** An absolutely placed box, in authored units. */
const at = (x: number, y: number, w: number, h: number): CSSProperties => ({
  position: 'absolute',
  left: px(x),
  top: px(y),
  width: px(w),
  height: px(h),
  display: 'flex',
});

type Box = { x: number; y: number; w: number; h: number };

/**
 * The paper-deep island with the site's pixel-grid field, its corners --isl-radius. Holds the picture,
 * or — on a page with none — the page's own subject word, set large in blue.
 */
async function Island({
  box,
  ink,
  children,
}: {
  box: Box;
  ink: Ink;
  children?: ReactNode;
}): Promise<ReactNode> {
  const field = await textureField({ width: px(box.w), height: px(box.h) }, ink.blue, SCALE * 2);
  return (
    <div
      style={{
        ...at(box.x, box.y, box.w, box.h),
        backgroundColor: ink.island,
        borderRadius: px(ink.islandRadius),
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws <img>, not next/image */}
      <img src={field} width={px(box.w)} height={px(box.h)} style={{ position: 'absolute', left: 0, top: 0 }} alt="" />
      {children}
    </div>
  );
}

/** The subject word on an island: blue serif, bottom-left, inside the island's own padding. */
function Feature({ card, ink, size, pad }: { card: ShareCard; ink: Ink; size: SerifSize; pad: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: px(pad),
        right: px(pad),
        bottom: px(pad - 8),
        display: 'flex',
        ...serif(size, ink.blue),
      }}
    >
      {card.feature}
    </div>
  );
}

/**
 * The page's picture inside `box`. A photograph fills it (cropped about its focus, --media-radius);
 * a capture or a drawing is fitted whole and placed by `align` — a drawing unboxed, a capture with
 * the media radius.
 */
async function Picture({
  card,
  box,
  ink,
  align = 'center',
  valign = 'center',
}: {
  card: ShareCard;
  box: Box;
  ink: Ink;
  align?: 'start' | 'center' | 'end';
  valign?: 'start' | 'center' | 'end';
}): Promise<ReactNode> {
  const media = card.media;
  if (!media) return null;
  const prepared = await preparedMedia(media, { width: px(box.w), height: px(box.h) });
  const w = prepared.width / SCALE;
  const h = prepared.height / SCALE;
  const x = box.x + (align === 'start' ? 0 : align === 'end' ? box.w - w : (box.w - w) / 2);
  const y = box.y + (valign === 'start' ? 0 : valign === 'end' ? box.h - h : (box.h - h) / 2);
  const radius = media.kind === 'illustration' ? 0 : px(ink.mediaRadius);
  return (
    <div style={{ ...at(x, y, w, h), borderRadius: radius, overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws <img>, not next/image */}
      <img src={prepared.src} width={prepared.width} height={prepared.height} alt="" />
    </div>
  );
}

/* ── The three directions ─────────────────────────────────────────────────────────────────── */

const M = 72; /* the outer margin: the thumbnail's 72 (D1), so a picture can take more of the card */

/** a · split: the words in a 520 column, the picture in the right half. */
async function Split({ card, ink }: { card: ShareCard; ink: Ink }) {
  const right: Box = { x: 660, y: M, w: W - 660 - M, h: H - 2 * M };
  let side: ReactNode;
  if (!card.media) {
    side = await Island({ box: right, ink, children: Feature({ card, ink, size: 72, pad: 48 }) });
  } else if (card.media.kind === 'photo') {
    side = await Picture({ card, box: right, ink });
  } else if (card.media.kind === 'capture') {
    side = await Island({ box: right, ink });
    side = (
      <>
        {side}
        {await Picture({ card, box: { x: right.x + 32, y: right.y + 32, w: right.w - 64, h: right.h - 64 }, ink })}
      </>
    );
  } else {
    side = await Picture({ card, box: right, ink, align: 'end', valign: 'center' });
  }
  return (
    <>
      {side}
      <div style={{ ...at(M + 8, M, 540, H - 2 * M), flexDirection: 'column', justifyContent: 'space-between' }}>
        <Meta card={card} ink={ink} />
        <div style={{ ...serif(64, ink.hero), display: 'flex' }}>{card.hero}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: px(24) }}>
          <Action card={card} ink={ink} />
          <Mark ink={ink} />
        </div>
      </div>
    </>
  );
}

/** b · island: the words on paper, the picture on a textured island; a drawing rises out of its top. */
async function IslandDirection({ card, ink }: { card: ShareCard; ink: Ink }) {
  const isDrawing = card.media?.kind === 'illustration';
  const island: Box = isDrawing
    ? { x: 620, y: 260, w: W - 620 - M, h: H - 260 - M }
    : { x: 620, y: M, w: W - 620 - M, h: H - 2 * M };
  let picture: ReactNode = null;
  if (card.media) {
    picture = isDrawing
      ? await Picture({ card, box: { x: island.x + 16, y: M - 24, w: island.w - 32, h: island.y + island.h - 40 - (M - 24) }, ink, valign: 'end' })
      : await Picture({ card, box: { x: island.x + 40, y: island.y + 40, w: island.w - 80, h: island.h - 80 }, ink });
  }
  const ground = await Island({
    box: island,
    ink,
    children: card.media ? null : Feature({ card, ink, size: 72, pad: 48 }),
  });
  return (
    <>
      {ground}
      {picture}
      <div style={{ ...at(M + 8, M, 480, H - 2 * M), flexDirection: 'column', justifyContent: 'space-between' }}>
        <Meta card={card} ink={ink} />
        <div style={{ ...serif(64, ink.hero), display: 'flex' }}>{card.hero}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: px(24) }}>
          <Action card={card} ink={ink} />
          <Mark ink={ink} />
        </div>
      </div>
    </>
  );
}

/** c · picture first: the picture across the top, the words under it, the mark at the foot's end. */
async function PictureFirst({ card, ink }: { card: ShareCard; ink: Ink }) {
  const band: Box = { x: 56, y: 56, w: W - 112, h: 372 };
  let top: ReactNode;
  if (!card.media) {
    top = await Island({ box: band, ink, children: Feature({ card, ink, size: 88, pad: 56 }) });
  } else if (card.media.kind === 'photo') {
    top = await Picture({ card, box: band, ink });
  } else {
    const inner = card.media.kind === 'capture'
      ? { x: band.x + 40, y: band.y + 32, w: band.w - 80, h: band.h - 64 }
      : { x: band.x + 40, y: band.y + 16, w: band.w - 80, h: band.h - 32 };
    top = (
      <>
        {await Island({ box: band, ink })}
        {await Picture({ card, box: inner, ink, align: card.media.kind === 'illustration' ? 'end' : 'center' })}
      </>
    );
  }
  return (
    <>
      {top}
      <div style={{ ...at(M + 8, band.y + band.h + 36, W - 2 * M - 16, H - band.y - band.h - 36 - 56), justifyContent: 'space-between', alignItems: 'flex-end', gap: px(48) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: px(16), maxWidth: px(860) }}>
          <Meta card={card} ink={ink} />
          <div style={{ ...serif(52, ink.hero), display: 'flex' }}>{card.hero}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: px(16) }}>
          <Action card={card} ink={ink} />
          <Mark ink={ink} />
        </div>
      </div>
    </>
  );
}

export async function renderShareCard(card: ShareCard, direction: ShareDirection = 'a'): Promise<ImageResponse> {
  const [ink, fontData] = await Promise.all([inks(), fonts()]);
  const body =
    direction === 'b'
      ? await IslandDirection({ card, ink })
      : direction === 'c'
        ? await PictureFirst({ card, ink })
        : await Split({ card, ink });
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', backgroundColor: ink.paper }}>
        {body}
      </div>
    ),
    { ...SHARE_SIZE, fonts: fontData },
  );
}
