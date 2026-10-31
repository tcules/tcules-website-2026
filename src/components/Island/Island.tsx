import type { ReactNode } from 'react';

import styles from './Island.module.css';

/**
 * The grounds an island may take, and the type is the mechanism:
 *
 *   paper  the bright island — on a tint band (or the ink band), the brightest object in it.
 *   tint   the warm island — on a paper band (or the ink band), one step deeper than its surround.
 *   blue   the brand island — on a paper band, with a paper object on it (owner, 16 Oct 2026, the
 *          home enquiry close). An owner exception to "blue is never a ground" (visual-direction
 *          § 4.1), for an island that carries a paper form: the island is the band's one strong
 *          ground and the form the brightest thing on it.
 *   ink    the dark island — on a paper band, with a paper object on it (owner, 16 Oct 2026, the
 *          same close). Neutral-900, one step off the footer's 950, so the close and the footer a
 *          band below do not read as one dark block (Island.md § 17, Q3, amended).
 */
export type IslandSurface = 'paper' | 'tint' | 'blue' | 'ink';

export type IslandProps = {
  /**
   * The island's own ground, chosen per instance (owner, 13 Oct 2026). Required: which tone floats
   * on which is the composition's decision, and the patterns that consume Island derive it from
   * their band. Must differ from the band's surface — with no edge and no shadow, a paper island on
   * a paper band draws nothing. The primitive cannot see its band, so the patterns enforce that.
   */
  surface: IslandSurface;
  /**
   * `default`: the island's own inset (48). `band`: the band's own air (96; 64 and 32 below 768), for
   * an island on a `flush` band whose texture runs through that air (owner, 31 Oct 2026, About's
   * studio links).
   */
  inset?: 'default' | 'band';
  children: ReactNode;
};

/**
 * Island — a bounded ground inside a band, with the band's own ground around it on every side.
 *
 * TIER 1, a SURFACE like Section rather than a control: it paints one ground and declares it
 * (`data-surface`), so everything inside — a heading's ink, a solid button, a link, a texture —
 * takes that surface's tokens without being told, exactly as inside a band. It sits in Section's
 * content column and never leaves it: Section owns the column and the band's air, the island owns
 * only its own inset, radius and ground. So it keeps the page gutter at every width — that is what
 * makes it an island and not a band in a band.
 *
 * It is a positioned, isolated box that clips to its radius, so a Texture placed inside it fills the
 * island rather than the band, and sits between the island's ground and its content.
 *
 * It arranges nothing: one child region, laid out by whatever Layout the caller hands it. No
 * `className`, by design — its ground, inset and radius are the whole component, and a class that
 * moved any of them would be rule 5 (never override a surface from outside) one level down.
 */
export function Island({ surface, inset = 'default', children }: IslandProps) {
  return (
    <div
      className={inset === 'band' ? `${styles.island} ${styles.insetBand}` : styles.island}
      data-surface={surface}
    >
      {children}
    </div>
  );
}

/**
 * A band's ground, as the island sees it. Section's four surfaces restated as a literal rather than
 * imported: a primitive does not import a sibling (CLAUDE.md § Scope), and these two helpers only
 * compare strings.
 */
type BandGround = 'paper' | 'tint' | 'ink' | 'blue';

/**
 * The band an island floats on when its pattern is not told: the other of the two light grounds.
 * A tint island sits on paper, a paper island on tint — the one-step contrast every boxed object
 * on the site uses (the form panel, the boxed card's hover ground).
 */
export const ISLAND_BAND: Record<IslandSurface, BandGround> = {
  paper: 'tint',
  tint: 'paper',
  blue: 'paper',
  ink: 'paper',
};

/**
 * The island's ground on a given band, refusing the band's own: with no edge and no shadow a
 * same-surface island is invisible, and a tint island in a tint band is two tints touching (the
 * § 1.7 rule, one level down). A refused request takes the other light ground and warns in
 * development — rendering something correct beats rendering nothing, and the warning names the fix.
 */
export function islandSurfaceOn(band: BandGround, requested: IslandSurface): IslandSurface {
  if (requested !== band) return requested;
  const other: IslandSurface = requested === 'paper' ? 'tint' : 'paper';
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `Island: a "${requested}" island on a "${band}" band has no edge to read by; rendered "${other}".`,
    );
  }
  return other;
}
