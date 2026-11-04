import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { BAR_PATH, WORDMARK_PATHS, WORDMARK_VIEWBOX } from '@/components';

import type { ShareCard, ShareGround } from './card';

/**
 * Draws a share card: layout T of ch10 Part C, the shell at preview scale (C2).
 *
 * Authored at 1280 × 670 and exported at 2x, 2560 × 1340 (C1, ch05 §8): every distance below is the
 * chapter's figure times SCALE. The image is drawn by Satori, which reads inline styles and no CSS,
 * so this is the one place in the site that styles with objects — and the reason it reads its
 * colours out of the token layer rather than restating them.
 */
const SCALE = 2;
export const SHARE_SIZE = { width: 1280 * SCALE, height: 670 * SCALE } as const;

const px = (value: number) => value * SCALE;

/* A2/C2: margin 80 on all four sides; the gap ladder is bind 24 · row 48 · field 80. */
const MARGIN = px(80);
const BIND = px(24);
const ROW = px(48);

/* ── Colour, from the token layer ─────────────────────────────────────────────────────────── */

let palette: Promise<Map<string, string>> | undefined;

/** `--color-*` primitives, read from the one file that declares them. */
function colours(): Promise<Map<string, string>> {
  palette ??= readFile(join(process.cwd(), 'src/styles/tokens/primitives.css'), 'utf8').then((css) => {
    const found = new Map<string, string>();
    for (const [, name, value] of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)) {
      if (name && value) found.set(name, value);
    }
    return found;
  });
  return palette;
}

/**
 * C2's ground table, paper and paper-deep (ink is reserved for an argued one-off and is not
 * generated). The meta line splits in two since the 6 Oct ruling put more blue in the foreground
 * (decisions/2026-10-06-more-blue-in-the-foreground): the kind word takes brandeis-500, as the
 * action line already does, and the fact keeps the ground's meta ink.
 */
const GROUNDS: Record<
  ShareGround,
  { ground: string; hero: string; meta: string; kind: string; rule: string; action: string; mark: string }
> = {
  paper: {
    ground: 'paper',
    hero: 'neutral-900',
    meta: 'neutral-700',
    kind: 'brandeis-500',
    rule: 'neutral-200',
    action: 'brandeis-500',
    mark: 'neutral-950',
  },
  'paper-deep': {
    ground: 'paper-deep',
    hero: 'neutral-900',
    meta: 'neutral-800',
    kind: 'brandeis-500',
    rule: 'neutral-300',
    action: 'brandeis-500',
    mark: 'neutral-950',
  },
};

/* ── Type ─────────────────────────────────────────────────────────────────────────────────── */

let faces: Promise<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]> | undefined;

/**
 * Two faces are all a card sets: Newsreader 400 at its 72 optical size for the hero, Geist Mono 600
 * for the meta and action lines. Static TTF instances, because Satori reads neither WOFF2 nor a
 * variable axis (fonts/README.md).
 */
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

/* A3: the two hero rungs, size / leading / tracking. */
const RUNGS = {
  88: { size: px(88), leading: 1.06, tracking: '-0.022em' },
  72: { size: px(72), leading: 1.1, tracking: '-0.02em' },
} as const;

/* C2: mono 24 on a preview (raised from 22), tracked +.12em, uppercase in presentation only. */
const MONO = {
  fontFamily: 'Geist Mono',
  fontWeight: 600,
  fontSize: px(24),
  lineHeight: 1.2,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
} as const;

/* C2: the wordmark at 32 tall on a preview (raised from 24); monochrome (2026-09-25 ruling). */
const MARK_HEIGHT = px(32);

export async function renderShareCard(card: ShareCard): Promise<ImageResponse> {
  const [palette, fontData] = await Promise.all([colours(), fonts()]);
  const ink = (role: keyof (typeof GROUNDS)['paper']) => {
    const value = palette.get(GROUNDS[card.ground][role]);
    if (!value) throw new Error(`share card: no --color-${GROUNDS[card.ground][role]} in primitives.css`);
    return value;
  };
  const rung = RUNGS[card.rung];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: MARGIN,
          backgroundColor: ink('ground'),
        }}
      >
        {/* Identity row: the meta line, and only that (C2). */}
        <div style={{ ...MONO, display: 'flex', gap: '0.6em' }}>
          <span style={{ color: ink('kind') }}>{card.meta.kind}</span>
          {card.meta.fact ? <span style={{ color: ink('meta') }}>·</span> : null}
          {card.meta.fact ? <span style={{ color: ink('meta') }}>{card.meta.fact}</span> : null}
        </div>

        {/* Content row: the hero, vertically centred — the row that grows. */}
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', paddingTop: ROW, paddingBottom: ROW }}>
          <div
            style={{
              fontFamily: 'Newsreader',
              fontWeight: 400,
              fontSize: rung.size,
              lineHeight: rung.leading,
              letterSpacing: rung.tracking,
              color: ink('hero'),
              textWrap: 'balance',
            }}
          >
            {card.hero}
          </div>
        </div>

        {/* Action row: a 2px rule, a bind of air, the wordmark left and the action line right. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: BIND }}>
          <div style={{ height: px(2), backgroundColor: ink('rule') }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <svg
              width={(MARK_HEIGHT * WORDMARK_VIEWBOX.width) / WORDMARK_VIEWBOX.height}
              height={MARK_HEIGHT}
              viewBox={`0 0 ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`}
            >
              {[...WORDMARK_PATHS, BAR_PATH].map((d) => (
                <path key={d} d={d} fill={ink('mark')} />
              ))}
            </svg>
            {card.action ? <div style={{ ...MONO, color: ink('action') }}>{card.action}</div> : null}
          </div>
        </div>
      </div>
    ),
    { ...SHARE_SIZE, fonts: fontData },
  );
}
