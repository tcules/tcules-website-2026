import { cx } from '@/lib/cx';

import styles from './Logo.module.css';

/**
 * Three heights. A logotype is not text and does not step with the type ladder — it is sized so
 * that its x-height reads level with the chrome beside it, which is a per-context measurement.
 *
 *   sm  20  a dense bar, a utility row
 *   md  24  the header bar — the default
 *   lg  40  the footer's brand block, where the mark is the largest thing in the band
 */
export type LogoSize = 'sm' | 'md' | 'lg';

/**
 * What paints the bar above the "u".
 *
 *   mono    --logo-ink, so the bar joins the letterforms and the mark is one colour — neutral-950
 *           on paper and tint, white on ink and blue. THE DEFAULT, because it is what the brand
 *           asks for everywhere the site draws the mark: ch02 v1.0 says that in UI chrome — nav,
 *           footer, favicon and anything at that size — "the whole wordmark is neutral-950", and
 *           that on blue and on ink "it is white throughout".
 *   accent  the bar in brandeis-500, via --logo-bar. For the mark at MARKETING SCALE on paper or
 *           tint only (ch02: "on paper at marketing scale the letters stay neutral-950 and the bar
 *           is brandeis-500"). On ink and blue --logo-bar is the wordmark's own ink, so accent
 *           there renders exactly as mono — safe, but never the reason to pass it.
 */
export type LogoVariant = 'accent' | 'mono';

export type LogoProps = {
  /** Height role. Defaults to `md` (24). Width follows from the mark's own proportions. */
  size?: LogoSize;
  /** Bar treatment. Defaults to `mono` — the chrome treatment; `accent` is marketing scale only. */
  variant?: LogoVariant;
  /**
   * Accessible name. Pass `""` to render the mark decoratively, for the common case where a
   * wrapping link already carries the name — otherwise a screen reader announces "Tcules,
   * Tcules, link".
   */
  title?: string;
  className?: string;
};

/* The wordmark, as path data on a 675×177 box. Inline rather than an <img> for one reason: the
   letterforms and the bar take tokens remapped per surface, so the mark is correct on all four
   surfaces without four files and without knowing which surface it is on. An SVG file cannot read
   a custom property from the page that embeds it.

   Order matters below only in that the bar is drawn last, over the letterforms. */
export const WORDMARK_PATHS = [
  'M547.89 80.1704C546.69 76.7804 545.24 73.5704 543.52 70.5504C543.32 70.1904 543.12 69.8403 542.91 69.4903C541.1 66.4603 539.04 63.6404 536.71 60.9804C530.87 54.3504 523.87 49.6203 515.7 46.7803C515.41 46.6903 515.12 46.5904 514.84 46.5004C514.31 46.3204 513.78 46.1604 513.24 46.0104C513.19 45.9904 513.14 45.9704 513.09 45.9604C512.5 45.7904 511.91 45.6304 511.31 45.4804C508.23 44.6904 505 44.1604 501.61 43.8704C501.58 43.8704 501.55 43.8604 501.52 43.8604C501.03 43.8204 500.55 43.7904 500.06 43.7604C499.9 43.7504 499.74 43.7404 499.58 43.7304C499.25 43.7104 498.92 43.6904 498.58 43.6804C498.33 43.6704 498.07 43.6504 497.81 43.6504C497.56 43.6404 497.3 43.6304 497.04 43.6304C496.93 43.6204 496.81 43.6204 496.7 43.6204H496.45C496.25 43.6104 496.05 43.6104 495.85 43.6104H495.57C495.45 43.6104 495.34 43.6104 495.22 43.6204C495.14 43.6104 495.05 43.6104 494.97 43.6204C494.73 43.6104 494.48 43.6104 494.23 43.6104C493.94 43.6104 493.65 43.6104 493.36 43.6204H493.11C492.99 43.6304 492.87 43.6304 492.76 43.6304C491.63 43.6404 490.52 43.6904 489.41 43.7704C482.08 44.2304 475.16 45.8403 468.65 48.5903C465.87 49.7603 463.23 51.1203 460.73 52.6503C460.51 52.7803 460.3 52.9204 460.09 53.0504C455.74 55.8504 451.8 59.2104 448.28 63.1304C442.81 69.0904 438.62 76.0504 435.73 84.0303C434.37 87.7603 433.33 91.6104 432.61 95.5704C432.58 95.7204 432.55 95.8704 432.53 96.0104C432.46 96.4404 432.39 96.8604 432.32 97.2904C432 99.4204 431.76 101.6 431.61 103.81C431.58 104.25 431.55 104.7 431.52 105.15C431.49 105.63 431.47 106.11 431.45 106.59C431.41 107.56 431.39 108.53 431.38 109.51V109.91C431.38 110.39 431.38 110.87 431.4 111.35C431.57 120.15 433.01 128.31 435.73 135.83C438.62 143.89 442.81 150.89 448.28 156.85C453.92 162.97 460.69 167.64 468.57 170.86C476.46 174.08 485.07 175.69 494.42 175.69C503.29 175.69 511.45 174.2 518.86 171.22C522.35 169.82 525.67 168.09 528.83 166.03C534.8 162.15 539.78 157.4 543.78 151.77L520.38 133.22C518.4 137.32 515.58 140.61 511.92 143.08C507.18 146.31 501.42 147.91 494.65 147.91C486.29 147.91 479.31 145.18 473.77 139.7C468.2 134.23 464.88 126.66 463.74 116.99H552.01C552.01 116.99 552.01 115.13 552.01 114.51V106.51C552.01 96.7604 550.63 87.9804 547.89 80.1704ZM464.95 94.0504C466.88 86.4804 470.3 80.6904 475.22 76.6604C480.12 72.6304 486.04 70.6203 492.96 70.6203C500.38 70.6203 506.3 72.7504 510.72 77.0204C515.15 81.2904 517.45 86.9704 517.6 94.0504H464.95Z',
  'M142.04 30.63H88.6V173.15H53.68V30.63H0V0H142.04V30.63Z',
  'M351.7 45.6096V170.54H318.45V157.71C314.17 162.78 309.19 166.62 303.49 169.23C297.79 171.84 291.53 173.15 284.73 173.15C271.9 173.15 261.61 169.07 253.85 160.92C246.09 152.76 242.21 141.88 242.21 128.26V45.5996H275.46V120.89C275.46 128.33 277.16 133.99 280.57 137.87C283.97 141.75 288.92 143.69 295.42 143.69C301.92 143.69 307.38 141.39 311.81 136.8C316.24 132.21 318.46 126.27 318.46 118.99V45.5996L351.7 45.6096Z',
  'M411.63 0.00976562V173.16H378.38V0.00976562H411.63Z',
  'M584.56 169.97C573.79 165.6 565.65 159.68 560.14 152.23L581.28 130.6C585.65 136.43 591.36 141.13 598.41 144.69C605.46 148.25 612.63 150.04 619.92 150.04C626.56 150.04 631.79 148.87 635.59 146.52C639.4 144.17 641.3 140.97 641.3 136.92C641.3 134 640.41 131.7 638.63 129.99C636.85 128.29 633.69 126.87 629.15 125.74C628.02 125.42 626.64 125.09 625.02 124.77C623.4 124.45 618.86 123.56 611.41 122.1C603.15 120.48 596.87 118.9 592.58 117.36C588.29 115.82 584.6 114.08 581.52 112.13C576.98 109.21 573.58 105.53 571.31 101.07C569.04 96.6096 567.91 91.3096 567.91 85.1496C567.91 72.8396 572.77 62.8396 582.49 55.1396C592.21 47.4396 604.76 43.5996 620.15 43.5996C631 43.5996 641.21 45.6296 650.77 49.6696C660.33 53.7196 667.7 59.0696 672.88 65.7096L653.44 87.0896C649.23 81.5796 644.13 77.3696 638.13 74.4496C632.14 71.5296 625.82 70.0796 619.18 70.0796C613.83 70.0796 609.54 71.1296 606.3 73.2396C603.06 75.3496 601.44 78.1796 601.44 81.7496C601.44 84.1796 602.17 86.1196 603.63 87.5796C605.09 89.0396 607.52 90.2496 610.92 91.2296C612.22 91.7196 613.71 92.1596 615.42 92.5696C617.12 92.9796 620.56 93.6596 625.75 94.6396C635.63 96.7496 642.76 98.5296 647.13 99.9896C651.5 101.45 655.31 103.07 658.55 104.85C663.9 107.93 667.91 111.82 670.58 116.51C673.25 121.21 674.59 126.8 674.59 133.28C674.59 146.08 669.37 156.49 658.92 164.51C648.47 172.53 635.23 176.54 619.19 176.54C606.87 176.53 595.33 174.34 584.56 169.97Z',
  'M201.38 130.85L225.68 149.79C187.28 198.72 114.77 170.32 114.77 107.86C114.77 33.9897 201.35 30.0397 226.07 69.6197L201.38 88.8597C182.99 56.8097 147.76 73.4697 147.76 109.42C147.76 146.97 182.7 160.93 201.35 130.83L201.38 130.85Z',
] as const;

/** The wordmark's box, for a renderer that draws the paths itself (the share-card generator). */
export const WORDMARK_VIEWBOX = { width: 675, height: 177 } as const;

/** The bar above the "u" — the one element of the mark that is not a letterform. */
export const BAR_PATH = 'M351.86 0.139648H225.23V27.1396H351.86V0.139648Z';

/**
 * Logo — the Tcules wordmark.
 *
 * A primitive, and specifically not an `Icon`. Both are filled now, so the difference is not the
 * paint: an icon is drawn on the system's own 24-unit box and takes `currentColor` entirely,
 * whereas this is a logotype at its own aspect ratio, painted from its own tokens rather than
 * inherited. Filing it as a glyph would have cost it both.
 *
 * It sets no outer spacing. The letterforms read --logo-ink — neutral-950 on paper and tint, white
 * on ink and blue, as ch02 names them — so the mark is correct in the header, in the ink footer and
 * on a blue pivot without being told which, and does not take the colour of a link that wraps it.
 * By default (mono) the bar does too; `accent` reads --logo-bar, which is brandeis-500 on the light
 * grounds and white on the dark ones — see tokens/components/logo.css.
 */
export function Logo({
  size = 'md',
  variant = 'mono',
  title = 'Tcules',
  className,
}: LogoProps) {
  const decorative = title === '';

  return (
    <svg
      className={cx(styles.logo, styles[size], className)}
      viewBox="0 0 675 177"
      /* Same convention as Icon: a mark that carries the name gets a role and an aria-label (never an SVG <title>, see Icon), a mark
         whose name is already on the link that wraps it is hidden. focusable="false" keeps legacy
         Edge from making an inline SVG a tab stop. */
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      {WORDMARK_PATHS.map((d) => (
        <path key={d} className={styles.mark} d={d} />
      ))}
      {/* The fill comes from a CLASS, not a `fill="…"` presentation attribute. A var() inside an
          SVG presentation attribute is not reliably resolved (and does not react to a change in
          the property) in Chrome, so the bar would silently render unpainted. A real CSS
          declaration resolves it. */}
      <path className={variant === 'mono' ? styles.barMono : styles.bar} d={BAR_PATH} />
    </svg>
  );
}
