import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Rect } from './offer';
import { Chip, Glyph } from './scenes';
import styles from './Sketch.module.css';

/* The overhaul pages' band figures (owner, 19 Nov 2026), all three on the 16:9 plate (320 x 180) since
   the owner's round 11 ("it looks squashed and tall ... redrawn to fit in a 16:9 plate"): MVP's two
   figures beside their rows and How we work's engagement chart over its six facts. Each is drawn from
   its band's own words; the rows beside or under it are its key. */

/**
 * The demo is the screen on top; launch needs what sits under it. The screen stays neutral and the
 * foundation it stands on is the lit subject, four cells side by side, one per row beside it: whose
 * data, the keys, the rules, a way back. The foundation's ground is the light blue a glyph takes on
 * ink (`foundation`, owner 19 Nov 2026: "the dark blue doesn't stand out much on the ink bg").
 */
function MvpUnderneath() {
  const cells = [
    [52, 'users-group-rounded', 26],
    [108, 'key', 20],
    [164, 'shield-check', 30],
    [220, 'undo-left', 16],
  ] as const;
  return (
    <>
      {/* The demo: the screen everyone sees, a window with its bar, a heading, words and an action. */}
      <Rect x={70} y={26} w={180} h={78} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M70,42 L250,42" />
      <Copy x={86} y={60} w={64} />
      <Copy x={86} y={74} w={120} quiet />
      <Copy x={86} y={86} w={96} quiet />
      <Rect x={198} y={54} w={36} h={12} rx={6} className={styles.tile} />
      {/* What it stands on, lit: the foundation the screen sits on, four cells across. */}
      <Rect x={40} y={104} w={240} h={52} rx={8} className={styles.foundation} />
      {cells.map(([x, glyph, w]) => (
        <g key={glyph}>
          <Rect x={x} y={112} w={48} h={36} className={styles.frame} />
          <Chip x={x + 16} y={117} glyph={glyph} />
          <Copy x={x + (48 - w) / 2} y={140} w={w} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * The prototype, marked up area by area: what users rely on kept (solid), what paying customers would
 * break fixed (dotted), what can't carry the next stage rebuilt (dashed). A landscape product screen,
 * its navigation down the side and its workspace in two panels; the rows beside it are its legend,
 * drawn with the same three edges.
 */
function MvpPrototypeBrief() {
  return (
    <>
      {/* The prototype's screen: a window with its bar. */}
      <Rect x={40} y={20} w={240} h={140} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M40,36 L280,36" />
      <circle className={styles.hair} cx={50} cy={28} r={2} />
      <circle className={styles.hair} cx={58} cy={28} r={2} />
      {/* Keep: the navigation people already find their way by. */}
      <Rect x={52} y={48} w={52} h={100} className={styles.areaKeep} />
      <Copy x={62} y={64} w={30} />
      <Copy x={62} y={80} w={24} quiet />
      <Copy x={62} y={92} w={30} quiet />
      <Copy x={62} y={104} w={20} quiet />
      <Copy x={62} y={116} w={26} quiet />
      {/* Fix: the workspace, sound in shape but unsafe for paying customers. */}
      <Rect x={116} y={48} w={152} h={48} className={styles.areaFix} />
      <Copy x={128} y={64} w={64} />
      <Copy x={128} y={78} w={96} quiet />
      <Rect x={220} y={58} w={36} h={12} rx={6} className={styles.tile} />
      {/* Rebuild: the data underneath that can't carry the next stage. */}
      <Rect x={116} y={108} w={152} h={40} className={styles.areaRebuild} />
      <Rect x={128} y={124} w={12} h={16} rx={2} className={styles.tile} />
      <Rect x={146} y={116} w={12} h={24} rx={2} className={styles.tile} />
      <Rect x={164} y={128} w={12} h={12} rx={2} className={styles.tile} />
      <Copy x={192} y={122} w={60} quiet />
      <Copy x={192} y={134} w={44} quiet />
    </>
  );
}

/**
 * The engagement over time, an infographic (owner, 19 Nov 2026: "drawn as an infographic like the
 * darkroast example ... because it is an infographic, we can add labels"), drawn from what Jatin said
 * it means on the 19 Nov call: each month the client's allocation can change, scaled up or down; at
 * times paused and resumed; the same person throughout, supported by specialists; flags at the peaks
 * and the pause. Months run left to right. The rows are the team, stacked from the foot: the designer,
 * lit, one unbroken line through every month, the pause too; above it UI, design engineering,
 * front-end and research. A filled cell is a specialist in that month, from the same hours, stacked
 * flush, so a column's height is the month's allocation: the designer alone in month one, a staircase
 * up to a release, the pause with billing stopped, and again after it. The words are ENGAGEMENT_LABELS.
 */
const ENG = {
  /* Month k is the column from x = 100 + 13k, fifteen months to 295; months 9 to 11 are the pause. */
  month: (k: number) => 100 + 13 * k,
  months: 15,
  pause: [8, 10],
  designer: 124,
  rows: [
    { y: 56, label: 'Research', months: [6, 7, 14] },
    { y: 72, label: 'Front-end', months: [5, 6, 7, 13, 14] },
    { y: 88, label: 'Design engineering', months: [3, 4, 5, 6, 7, 12, 13, 14] },
    { y: 104, label: 'UI', months: [1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14] },
  ],
} as const;

function HowWeWorkEngagement() {
  const { month, rows, designer } = ENG;
  const [p0, p1] = ENG.pause;
  return (
    <>
      {/* The chart's panel. */}
      <Rect x={8} y={14} w={304} h={152} rx={8} className={styles.frame} />
      {/* The allocation axis, rising, beside the rows. */}
      <path
        className={styles.hair}
        d={`M${month(0) - 2},${designer - 8} L${month(0) - 2},46`}
      />
      {/* The months: the time axis, a tick at each month's edge. */}
      <path className={styles.rule} d={`M${month(0)},136 L${month(ENG.months)},136`} />
      {Array.from({ length: ENG.months + 1 }, (_, k) => (
        <path key={k} className={styles.hair} d={`M${month(k)},136 L${month(k)},139`} />
      ))}
      {/* The pause: three months with nothing billed, dashed, its mark under its words. */}
      <Rect
        x={month(p0)}
        y={44}
        w={month(p1 + 1) - month(p0)}
        h={86}
        className={styles.trailFrame}
      />
      <Chip x={(month(p0) + month(p1 + 1)) / 2 - 8} y={84} glyph="chrome-pause" />
      {/* The specialists: a cell for every month each is in. */}
      {rows.map((row) =>
        row.months.map((k) => (
          <Rect
            key={`${row.y}-${k}`}
            x={month(k) + 1}
            y={row.y - 7}
            w={11}
            h={14}
            rx={2}
            className={styles.region}
          />
        )),
      )}
      {/* The flags: a stem from each flag's words down to its column. */}
      {[7, 14].map((k) => (
        <path
          key={k}
          className={styles.hair}
          d={`M${month(k) + 6.5},40 L${month(k) + 6.5},48`}
        />
      ))}
      <path className={styles.hair} d={`M${month(11) + 6.5},40 L${month(11) + 6.5},96`} />
      {/* The designer, lit: one line through every month, the pause included. */}
      <path
        className={styles.line}
        d={`M${month(0)},${designer} L${month(ENG.months) - 7},${designer}`}
      />
      <ArrowRight x={month(ENG.months)} y={designer} />
    </>
  );
}

const ENGAGEMENT_LABELS: readonly SketchLabel[] = [
  { x: 94, y: 40, lines: ['Allocation'], align: 'end' },
  ...ENG.rows.map((row) => ({
    x: 94,
    y: row.y,
    lines: row.label === 'Design engineering' ? ['Design', 'engineering'] : [row.label],
    align: 'end' as const,
  })),
  {
    x: 94,
    y: ENG.designer,
    lines: ['Your designer', 'throughout'],
    align: 'end',
    accent: true,
  },
  { x: 94, y: 147, lines: ['Month'], align: 'end' },
  ...Array.from({ length: ENG.months }, (_, k) => ({
    x: ENG.month(k) + 6.5,
    y: 147,
    lines: [String(k + 1)],
  })),
  { x: ENG.month(7) + 6.5, y: 34, lines: ['Release'], accent: true },
  { x: ENG.month(14) + 6.5, y: 34, lines: ['Release'], accent: true },
  { x: ENG.month(11) + 6.5, y: 34, lines: ['Resume'], accent: true },
  {
    x: (ENG.month(ENG.pause[0]) + ENG.month(ENG.pause[1] + 1)) / 2,
    y: 62,
    lines: ['Paused', 'no billing'],
  },
];

/**
 * The same chart for a phone (owner, 19 Nov 2026: "it also needs a MOBILE version"), on the portrait
 * plate (240 x 300): fewer months with the same story, the team named in a key above the chart (a
 * chip per row, the words beside it) because the rows' names cannot sit beside a chart this narrow.
 * Ten months: the designer alone, a staircase to a release, a two-month pause, a staircase to the
 * next.
 */
const ENG_PHONE = {
  month: (k: number) => 44 + 18 * k,
  months: 10,
  pause: [5, 6],
  designer: 234,
  key: [48, 64, 80, 96, 112, 128],
  rows: [
    { y: 174, glyph: 'chat-round-dots', months: [4, 9] },
    { y: 188, glyph: 'code', months: [3, 4, 8, 9] },
    { y: 202, glyph: 'widget', months: [2, 3, 4, 8, 9] },
    { y: 216, glyph: 'palette', months: [1, 2, 3, 4, 7, 8, 9] },
  ],
} as const;

function HowWeWorkEngagementPhone() {
  const { month, rows, designer, key } = ENG_PHONE;
  const [p0, p1] = ENG_PHONE.pause;
  const end = month(ENG_PHONE.months);
  return (
    <>
      <Rect x={8} y={20} w={224} h={262} rx={8} className={styles.frame} />
      {/* The key: each row's chip, the designer's lit, the pause's dashed. */}
      {rows.map((row, i) => (
        <Chip key={row.glyph} x={20} y={key[i]! - 8} glyph={row.glyph} />
      ))}
      <Rect x={20} y={key[4]! - 8} w={16} h={16} rx={4} className={styles.solid} />
      <Glyph name="user" cx={28} cy={key[4]!} size={10} className={styles.glyphOn} />
      <Rect x={20} y={key[5]! - 8} w={16} h={16} rx={4} className={styles.trailFrame} />
      <Glyph
        name="chrome-pause"
        cx={28}
        cy={key[5]!}
        size={10}
        className={styles.glyphAccent}
      />
      <path className={styles.rule} d="M20,144 L220,144" />
      {/* The allocation axis, and the rows' chips beside it. */}
      <path
        className={styles.hair}
        d={`M${month(0) - 4},${designer - 8} L${month(0) - 4},166`}
      />
      {rows.map((row) => (
        <g key={row.glyph}>
          <Chip x={18} y={row.y - 8} glyph={row.glyph} />
          {row.months.map((k) => (
            <Rect
              key={k}
              x={month(k) + 1}
              y={row.y - 6}
              w={16}
              h={12}
              rx={2}
              className={styles.region}
            />
          ))}
        </g>
      ))}
      <Rect x={18} y={designer - 8} w={16} h={16} rx={4} className={styles.solid} />
      <Glyph name="user" cx={26} cy={designer} size={10} className={styles.glyphOn} />
      {/* The pause. */}
      <Rect
        x={month(p0) + 1}
        y={166}
        w={month(p1 + 1) - month(p0) - 2}
        h={76}
        className={styles.trailFrame}
      />
      {/* The flags' stems. */}
      {[4, 9].map((k) => (
        <path key={k} className={styles.hair} d={`M${month(k) + 9},158 L${month(k) + 9},166`} />
      ))}
      <path className={styles.hair} d={`M${month(7) + 9},172 L${month(7) + 9},208`} />
      {/* The months. */}
      <path className={styles.rule} d={`M${month(0)},250 L${end},250`} />
      {Array.from({ length: ENG_PHONE.months + 1 }, (_, k) => (
        <path key={k} className={styles.hair} d={`M${month(k)},250 L${month(k)},253`} />
      ))}
      <path className={styles.line} d={`M${month(0)},${designer} L${end - 7},${designer}`} />
      <ArrowRight x={end} y={designer} />
    </>
  );
}

const ENGAGEMENT_PHONE_LABELS: readonly SketchLabel[] = [
  ...['Research', 'Front-end', 'Design engineering', 'UI'].map((line, i) => ({
    x: 44,
    y: ENG_PHONE.key[i]!,
    lines: [line],
    align: 'start' as const,
  })),
  {
    x: 44,
    y: ENG_PHONE.key[4]!,
    lines: ['Your designer, throughout'],
    align: 'start',
    accent: true,
  },
  { x: 44, y: ENG_PHONE.key[5]!, lines: ['Paused, no billing'], align: 'start' },
  { x: 20, y: 158, lines: ['Allocation'], align: 'start' },
  { x: 40, y: 262, lines: ['Month'], align: 'end' },
  ...Array.from({ length: ENG_PHONE.months }, (_, k) => ({
    x: ENG_PHONE.month(k) + 9,
    y: 262,
    lines: [String(k + 1)],
  })),
  { x: ENG_PHONE.month(4) + 9, y: 154, lines: ['Release'], accent: true },
  { x: ENG_PHONE.month(9) + 18, y: 154, lines: ['Release'], align: 'end', accent: true },
  { x: ENG_PHONE.month(7) + 9, y: 168, lines: ['Resume'], accent: true },
];

/** A label set over an infographic's plate: its point in drawing units, its words as authored. */
export type SketchLabel = {
  x: number;
  y: number;
  lines: readonly string[];
  /** Which edge of the words sits on the point; default `middle`. Always centred on it vertically. */
  align?: 'start' | 'middle' | 'end';
  /** The accent ink, for what the chart is about: the designer and the flags. */
  accent?: boolean;
};

/**
 * The scenes that are INFOGRAPHICS (owner, 19 Nov 2026), the only flat drawings with words: their
 * labels, and the phone composition that replaces them below 768.
 */
export const INFOGRAPHICS: Partial<
  Record<
    PageSceneName,
    {
      labels: readonly SketchLabel[];
      phone?: { name: PageSceneName; labels: readonly SketchLabel[] };
    }
  >
> = {
  'ov-how-we-work-engagement': {
    labels: ENGAGEMENT_LABELS,
    phone: { name: 'ov-how-we-work-engagement-phone', labels: ENGAGEMENT_PHONE_LABELS },
  },
};

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Your demo works. Launch needs what sits underneath. (WIDE 320 x 180, beside four rows on ink): Who sees whose data; where the keys live; where the rules run; a way back. */
  'ov-mvp-development-underneath': MvpUnderneath,
  /* Your prototype is the brief we build from (WIDE 320 x 180, beside the keep / fix / rebuild rows): Keep: what your users already rely on. Fix: what paying customers would break. Rebuild: only what can't carry the next stage. You get the call in writing, area by area. */
  'ov-mvp-development-prototype-brief': MvpPrototypeBrief,
  /* The engagement moves with your product (WIDE 320 x 180, over six facts): No fixed plan: starts within a week, scales with a week's notice, pauses when you need it to (billing pauses too), specialists from the same hours, usually the same people for months or years. */
  'ov-how-we-work-engagement': HowWeWorkEngagement,
  /* The engagement chart's phone composition (PORTRAIT 240 x 300), shown below 768 in its place. */
  'ov-how-we-work-engagement-phone': HowWeWorkEngagementPhone,
};
