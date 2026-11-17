import { cx } from '@/lib/cx';

import { glyphs, hasCounter, type IconName } from '@/lib/icon-glyphs';
import styles from './Icon.module.css';

export type { IconName };

/**
 * The four size roles, mapped onto the ramp in tokens/components/icon.css.
 *
 *   sm  14  inside a 32px control
 *   md  16  inside a 40px control — the default
 *   lg  18  inside a 48px control
 *   xl  24  the glyph at its native size, standing on its own rather than inside a control
 *
 * A control that owns its icon size overrides all four. `Button` does: it sizes the `<svg>` it
 * contains from --btn-icon-size-*, so `<Button size="sm" icon={<Icon name="copy" />} />` gets a
 * 14px glyph without the call site restating it, and a `size` passed to that Icon is ignored.
 * That is deliberate — the spec's rule is that the icon steps with the BUTTON, so the button is
 * the component that gets to decide.
 *
 * The 16px floor: a glyph with a counter (see `hasCounter` in @/lib/icon-glyphs) is never set at `sm`.
 * Its hole is about 1.5 units wide, which at 14px is under a device pixel and fills in. Icon warns
 * in development when asked for one; a control that sizes its own glyph owes the same rule and is
 * told so in docs/specs/Icon.md.
 */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export type IconProps = {
  /** Which glyph. A union of the set in @/lib/icon-glyphs, so a typo fails to compile. */
  name: IconName;
  /** Size role. Defaults to `md` (16). Ignored inside a control that sizes its own icons. */
  size?: IconSize;
  /**
   * An accessible name, for an icon that carries meaning ON ITS OWN — a status glyph in a table
   * cell with no text beside it.
   *
   * Leave it off for the overwhelmingly common case: an icon beside a label, or inside a button
   * that already has one. There the glyph is decorative and a name would make a screen reader
   * announce the same thing twice. Unlabelled icons are `aria-hidden`, which is why an icon-only
   * Button requires its own `aria-label` rather than relying on the glyph to supply it.
   */
  label?: string;
  className?: string;
};

/**
 * Icon — a solid glyph from the system's set, filled with `currentColor`.
 *
 * It has no colour of its own and takes no colour prop. The glyph is filled with `currentColor`,
 * so it inherits the ink of the surface or the foreground of the control it sits in and is
 * correct on all four surfaces without being told which one. There is no coloured icon inside a
 * button anywhere in this system, in either colour variant.
 *
 * A glyph's counters are HOLES, cut with `fill-rule: evenodd` in Icon.module.css, not shapes
 * painted in the ground colour — so they show whatever is behind them and stay correct on all
 * four surfaces. A painted counter would be right on exactly one.
 *
 * There is no stroke weight to set. A solid glyph carries its weight in the geometry, which is
 * what lets one drawing serve 14, 16, 18 and 24 — and the reason the ramp is expressed as a
 * viewBox rather than a set of separately drawn sizes.
 */
export function Icon({ name, size = 'md', label, className }: IconProps) {
  const named = label !== undefined;

  if (process.env.NODE_ENV !== 'production' && size === 'sm' && hasCounter(name)) {
    console.warn(
      `Icon: "${name}" has a counter and is never set below 16px; use size "md" or larger.`,
    );
  }

  return (
    <svg
      className={cx(styles.icon, styles[size], className)}
      viewBox="0 0 24 24"
      /* A glyph beside a label is decoration and is hidden; a glyph that IS the content gets a
         role and an aria-label. Not a <title>: an SVG <title> in the body is a second <title>
         element on the page, and some parsers read the first one they meet as the page's title.
         focusable="false" is for IE/legacy Edge, where an inline SVG is a
         tab stop by default — cheap to keep and invisible everywhere else. */
      role={named ? 'img' : undefined}
      aria-label={named ? label : undefined}
      aria-hidden={named ? undefined : true}
      focusable="false"
    >
      {glyphs[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
