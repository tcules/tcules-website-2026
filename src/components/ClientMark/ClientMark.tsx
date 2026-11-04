import type { CSSProperties } from 'react';

import { cx } from '@/lib/cx';

import styles from './ClientMark.module.css';

/** ch05 §10: "corrected by up to ±15% of that size". */
const CORRECTION_LIMIT = 0.15;

/**
 * The ink coverage a mark is sized FOR (r7-logos fix round, 9 Oct 2026): a mark whose artwork inks
 * this fraction of its viewBox is drawn at exactly --cmark-target-side's area, so a set without
 * densities renders as it always has. 0.28 is the set's light-middle (Omny 0.28, Knovos 0.33). A
 * denser mark comes down and a sparser one goes up, until every mark lays the same AREA OF INK.
 */
const REFERENCE_DENSITY = 0.28;
/** Outside this a density is a measuring error, not a mark: a hairline monogram is ~0.1. */
const DENSITY_RANGE = [0.1, 0.6] as const;

export type ClientMarkProps = {
  /**
   * The client's own SVG, as a URL — the file the client supplies or publishes (ch05 §10), never
   * a redraw. Its colours are ignored: only its alpha is used, as a mask.
   */
  src: string;
  /**
   * The client's name. This IS the accessible name, because the mark is an image of the name:
   * pass "Northwind", never "Northwind logo". Required and non-empty — a mark with no name says
   * nothing to a screen reader, and there is no decorative case: a link wrapping the mark takes
   * its name from this.
   */
  name: string;
  /**
   * The SVG's intrinsic width and height, in any unit — only their RATIO is used. The viewBox
   * numbers are the honest source. A wrong ratio letterboxes the mark inside its box (the mask
   * is `contain`); it never crops or distorts it.
   */
  width: number;
  height: number;
  /**
   * The weight correction recorded with the asset (ch05 §10), as a fraction of the size:
   * -0.1 draws a heavy mark 10% smaller, 0.12 a hairline mark 12% larger. Clamped to ±0.15, with
   * a dev warning outside it. It scales the capped size (ch05 §10); the height cap applies again
   * after it, the width cap does not, so a corrected wide mark may reach 184.
   */
  correction?: number;
  /**
   * The mark's OPTICAL density: the fraction of its viewBox the artwork inks, 0–1, measured from
   * the file (`node scripts/client-mark-density.mjs`) and recorded with the asset beside its
   * viewBox. It turns "equal area" from equal BOXES into equal INK: the box's area is scaled by
   * REFERENCE_DENSITY / density, so a thin, tracked wordmark (LatitudePay, 0.16) is drawn larger
   * and a bold, packed one (Doodle, 0.40) smaller, by measurement rather than by eye. A one-off
   * shared cap cannot do this: it sizes every mark by its box, and a box says nothing about how
   * much of it is ink (owner, 9 Oct 2026: LatitudePay and Quoter read half the mass of Knovos).
   *
   * An enclosing FRAME is not mass and is left out of the measurement: Quoter's pill is a container
   * the eye reads past to the name inside it, so its density is the name's (0.22), not the pill's
   * and the name's together (0.37). Absent, the mark is sized as if at REFERENCE_DENSITY — exactly
   * the box-area sizing it had before densities. Clamped to 0.1–0.6, warned outside it.
   */
  density?: number;
  /**
   * `md` (default) is the set's size: a logo strip or client wall. `sm` is the compact client wall
   * (LogoGrid `density="compact"`, owner 4 Nov 2026): the same ink rules at about four fifths of md,
   * 32 tall at most, with its own phone step. `xs` is a mark in a citation line (a case's title
   * beside it): 24 tall at most, one value at every width.
   */
  size?: 'md' | 'sm' | 'xs';
  className?: string;
};

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') console.warn(`ClientMark: ${message}`);
}

/** CSS string for url(). JSON's escaping of `"` and `\` is valid CSS string escaping. */
const cssUrl = (src: string) => `url(${JSON.stringify(src)})`;

/** Four decimals is well under a device pixel at the 240px width cap. */
const round = (n: number) => Math.round(n * 10000) / 10000;

/**
 * ClientMark — one client's logo in a set: a logo strip, a client wall.
 *
 * A MARK, like Logo, and not an Icon or a Figure. It draws the client's SVG as a mask filled with
 * --cmark-ink, so every mark in a set is one colour — the ground's ink — with one file for all
 * four surfaces. It sizes each mark to equal visual weight: the same AREA OF INK (its box's area
 * scaled by its recorded density), not the
 * same width, then capped in height and width (ch05 §10, ruling P2).
 *
 * The strip is not a component. It is `ClientMark` × n in a `Cluster`, which owns the gap —
 * ch05 §10 says so outright — and this component sets no outer spacing.
 *
 * Failure modes, all silent in production and warned in development:
 *   - no src, no name, or a width/height that is not a positive number: renders nothing. There is
 *     no honest box to reserve and no honest name to announce.
 *   - a src that 404s: the box is reserved at its computed size and paints nothing (a mask that
 *     fails to load is transparent), and the name is still announced. The fallback is
 *     deliberately NOT the name set as text: that would be the client's name retyped in our
 *     typeface, which ch05 §10 forbids ("never redrawn, retyped, traced"). The row keeps its
 *     rhythm, and the broken asset is a content defect for the CMS to fix, not for the page to
 *     paper over. Detecting the 404 would also make this a client component for one edge case.
 */
export function ClientMark({
  src,
  name,
  width,
  height,
  correction = 0,
  density,
  size = 'md',
  className,
}: ClientMarkProps) {
  if (!src) {
    warn(`no src for "${name}"; rendering nothing.`);
    return null;
  }
  if (!name.trim()) {
    warn(`no name for ${src}; rendering nothing. The name is the mark's only accessible text.`);
    return null;
  }
  if (!(width > 0) || !(height > 0) || !Number.isFinite(width / height)) {
    warn(
      `"${name}" needs a positive width and height (got ${width} × ${height}); rendering nothing.`,
    );
    return null;
  }
  if (!/\.svg($|[?#])/i.test(src)) {
    warn(`"${name}" is not an SVG (${src}). ch05 §10 takes client marks as SVG only.`);
  }

  let k = Number.isFinite(correction) ? correction : 0;
  if (Math.abs(k) > CORRECTION_LIMIT) {
    warn(`"${name}" correction ${correction} is outside ±${CORRECTION_LIMIT}; clamped.`);
    k = Math.max(-CORRECTION_LIMIT, Math.min(CORRECTION_LIMIT, k));
  }

  let d = density ?? REFERENCE_DENSITY;
  if (!Number.isFinite(d) || d < DENSITY_RANGE[0] || d > DENSITY_RANGE[1]) {
    warn(`"${name}" density ${density} is outside ${DENSITY_RANGE.join('–')}; clamped.`);
    d = Number.isFinite(d)
      ? Math.max(DENSITY_RANGE[0], Math.min(DENSITY_RANGE[1], d))
      : REFERENCE_DENSITY;
  }

  const ratio = width / height;

  /* Per-asset values on the style prop, because a class cannot express them: the URL is the
     asset, and the ratio is continuous. These five custom properties are the whole of it — every
     length is computed in ClientMark.module.css from tokens.

     √ratio and √(reference / density) are computed HERE rather than with CSS sqrt(), deliberately. sqrt() needs Chrome 120 /
     Firefox 118 / Safari 15.4, and Next 16's supported floor is Chrome and Edge 111 — in 111–119
     the declaration is invalid, the width computes to nothing, and every mark in the strip
     collapses to zero with no error. A number computed once on the server costs nothing. */
  const vars = {
    '--cmark-src': cssUrl(src),
    '--cmark-ratio': round(ratio),
    '--cmark-ratio-root': round(Math.sqrt(ratio)),
    '--cmark-correction': round(1 + k),
    /* Equal INK: the area scales by REFERENCE_DENSITY / density, so the side by its root. */
    '--cmark-optical': round(Math.sqrt(REFERENCE_DENSITY / d)),
  } as CSSProperties;

  return (
    /* role="img" + aria-label: the element has no content, so the label is its entire accessible
       text, and the role makes a screen reader announce it as an image ("Northwind, image")
       rather than skip an empty span. */
    <span role="img" aria-label={name} className={cx(styles.mark, size === 'sm' && styles.sm, size === 'xs' && styles.xs, className)} style={vars} />
  );
}
