import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';
import sharp from 'sharp';

import { BAR_PATH, WORDMARK_PATHS, WORDMARK_VIEWBOX } from '@/components';

import type { ShareCard } from './card';
import { preparedMedia } from './media';

/**
 * Draws a share card. Authored at 1280 × 670 and exported at 2x (2560 × 1340, ch10 C1); every figure
 * below is in authored units and goes through `px`.
 *
 * One layout, from the owner's review of three directions (4 Nov 2026): the words in a left column
 * and the page's picture in the right half — a drawing unboxed on the paper, a banner or a cover
 * filling the half as a rounded image. No plates, no texture: the picture is the card's interest.
 * A page with no picture at all sets its title larger across the full width.
 *
 * Type is sans, not the site's serif titles: a card is read at about 500px wide, where the serif
 * thins out (owner, 4 Nov 2026) — the same reason card titles on the site are sans
 * (decisions/2026-10-22-card-titles-sans-except-horizontal).
 *
 * Satori reads inline styles and no CSS, so this is the one place in the site that styles with
 * objects, and the reason it reads its colours and radius out of the token layer.
 */
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
  title: string;
  subtitle: string;
  portraitGround: string;
  blue: string;
  mark: string;
  tracking: string;
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
    title: get('color-neutral-900'),
    /* The byline portrait's own pair (page-hero.css: --hero-portrait-ground, -initials-ink). */
    subtitle: get('color-neutral-700'),
    portraitGround: get('color-neutral-200'),
    blue: get('color-brandeis-500'),
    mark: get('color-neutral-950'),
    /* The sans title roles' tracking (--text-h4 reads -title-fine; at card size -title holds it). */
    tracking: get('letter-spacing-title'),
    /* Every image is rounded (decisions/2026-11-01-every-image-rounded), the site at --radius-8. A
       card is read at about 39% of its drawn size, where 8 shows as 3 and the corner is lost, so the
       card draws --radius-24: about 9 on a 500px feed card, the site's 8 as the eye gets it. */
    mediaRadius: Number.parseInt(get('radius-24'), 10),
  };
}

/* ── Type ─────────────────────────────────────────────────────────────────────────────────── */

let faces: Promise<{ name: string; data: Buffer; weight: 500 | 600; style: 'normal' }[]> | undefined;

/** Public Sans 500 (the site's sans title weight) and Geist Mono 600, as static TTFs (fonts/README.md). */
function fonts() {
  const file = (name: string) => readFile(join(process.cwd(), 'src/app/_og/fonts', name));
  faces ??= Promise.all([file('public-sans-500.ttf'), file('geist-mono-600.ttf')]).then(
    ([sans, mono]) => [
      { name: 'Public Sans', data: sans, weight: 500, style: 'normal' },
      { name: 'Geist Mono', data: mono, weight: 600, style: 'normal' },
    ],
  );
  return faces;
}

/* The title: 56 beside a picture (three lines of the 55-character ceiling in the 540 column), 72 across
   the full width when there is none. */
const title = (size: 56 | 72, ink: Ink): CSSProperties => ({
  fontFamily: 'Public Sans',
  fontWeight: 500,
  fontSize: px(size),
  lineHeight: size === 72 ? 1.08 : 1.12,
  letterSpacing: ink.tracking,
  color: ink.title,
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

const M = 72; /* the outer margin */
const COLUMN = 540; /* the words' column beside a picture */
const SPLIT = 660; /* where the picture's half starts */
const FACE = 440; /* a person's square */
const VIDEO_W = 600; /* a video's 16:9, wider than the half's 548 */
const SEAM = 48; /* the least air between the words and a picture that reaches into their column */

export async function renderShareCard(card: ShareCard): Promise<Response> {
  const [ink, fontData] = await Promise.all([inks(), fonts()]);
  const media = card.media;

  /* The frame a framed picture takes, by what it is (owner, 5 Nov 2026), each at the far margin and
     centred on the height, rounded like every image:
     - a person: a square, as the byline draws a face — their photograph from the face's focus, or
       their initials on the byline's tint;
     - a video: 16:9, a little wider than the half, the words' column giving way for it;
     - a case cover, a banner, an article cover: 16:9 across the half, a V1 cover whole.
     A drawing takes no frame (below). */
  const person = card.initials !== null || media?.kind === 'portrait';
  const video = card.source === 'video';
  const FRAME_W = person ? FACE : video ? VIDEO_W : W - SPLIT - M;
  const FRAME_H = person ? FACE : Math.round((FRAME_W * 9) / 16);
  const frame = {
    left: px(W - M - FRAME_W),
    top: px((H - FRAME_H) / 2),
    width: px(FRAME_W),
    height: px(FRAME_H),
  };
  const column = video ? W - M - VIDEO_W - SEAM - (M + 8) : COLUMN;
  const frameBox: CSSProperties = {
    position: 'absolute',
    ...frame,
    display: 'flex',
    borderRadius: px(ink.mediaRadius),
    overflow: 'hidden',
  };

  let picture = null;
  if (card.initials) {
    picture = (
      <div
        style={{
          ...frameBox,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: ink.portraitGround,
          fontFamily: 'Public Sans',
          fontWeight: 500,
          fontSize: px(128),
          letterSpacing: ink.tracking,
          color: ink.title,
        }}
      >
        {card.initials}
      </div>
    );
  } else if (media && media.kind !== 'illustration') {
    const prepared = await preparedMedia(
      media,
      { width: frame.width, height: frame.height },
      'cover',
      media.kind === 'portrait' ? ink.portraitGround : undefined,
    );
    picture = (
      <div style={frameBox}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws <img>, not next/image */}
        <img src={prepared.src} width={frame.width} height={frame.height} alt="" />
      </div>
    );
  } else if (media) {
    const box = { x: SPLIT, y: M, w: W - SPLIT - M, h: H - 2 * M };
    const prepared = await preparedMedia(media, { width: px(box.w), height: px(box.h) }, 'contain');
    const w = prepared.width / SCALE;
    const h = prepared.height / SCALE;
    /* A drawing sits at the half's far edge, centred on the height, facing the words. */
    picture = (
      <div
        style={{
          position: 'absolute',
          left: px(box.x + box.w - w),
          top: px(box.y + (box.h - h) / 2),
          width: px(w),
          height: px(h),
          display: 'flex',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws <img>, not next/image */}
        <img src={prepared.src} width={prepared.width} height={prepared.height} alt="" />
      </div>
    );
  }

  const beside = picture !== null;

  const response = new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', backgroundColor: ink.paper }}>
        {picture}
        <div
          style={{
            position: 'absolute',
            left: px(M + 8),
            top: px(M),
            width: px(beside ? column : W - 2 * M - 16),
            height: px(H - 2 * M),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* One eyebrow, the page's kind: the fact beside it is a second level a card read at feed
              size does not need (owner, 5 Nov 2026). It stays in the alt. */}
          <div style={{ ...MONO, display: 'flex', color: ink.blue }}>{card.meta.kind}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: px(16) }}>
            <div style={{ ...title(beside ? 56 : 72, ink), display: 'flex', maxWidth: px(beside ? column : 980) }}>
              {card.hero}
            </div>
            {card.subtitle ? (
              <div
                style={{
                  ...title(beside ? 56 : 72, ink),
                  display: 'flex',
                  fontSize: px(32),
                  lineHeight: 1.25,
                  color: ink.subtitle,
                }}
              >
                {card.subtitle}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: px(24) }}>
            {card.action ? <div style={{ ...MONO, color: ink.blue }}>{card.action}</div> : null}
            <svg
              width={(px(32) * WORDMARK_VIEWBOX.width) / WORDMARK_VIEWBOX.height}
              height={px(32)}
              viewBox={`0 0 ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`}
            >
              {[...WORDMARK_PATHS, BAR_PATH].map((d) => (
                <path key={d} d={d} fill={ink.mark} />
              ))}
            </svg>
          </div>
        </div>
      </div>
    ),
    { ...SHARE_SIZE, fonts: fontData },
  );

  /* A card carrying a banner or a cover goes out as JPEG q85: as PNG it runs past ch10's 1 MB, and
     C1 allows JPG for a frame with a photograph or a cut-out in it. */
  if (card.format === 'jpeg') {
    const jpeg = await sharp(Buffer.from(await response.arrayBuffer())).jpeg({ quality: 85 }).toBuffer();
    return new Response(new Uint8Array(jpeg), {
      headers: { 'content-type': 'image/jpeg' },
    });
  }
  return response;
}
