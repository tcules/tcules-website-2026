import type { ElementType, ReactNode } from 'react';

import { cx } from '@/lib/cx';

import styles from './Section.module.css';

/**
 * The four grounds. Declared in tokens/components/section.css, which remaps every
 * --sec-* role per surface — so a button three components deep gets the right treatment
 * without being told what it is sitting on.
 *
 * `blue` is a pivot: one appearance per page, and never adjacent to an `ink` section.
 */
export type SectionSurface = 'paper' | 'tint' | 'ink' | 'blue';

/**
 * Vertical air. Omit for the standard band (--sec-padding-y, 96). The variants are the token
 * layer's own, and there is no arbitrary value: a band is standard, tight, open, a strip, or flush.
 *
 *   tight  64   the I banner, and other bands whose content is one large object
 *   open   128  the J statement: an exception band that breathes (visual-direction § 1.2)
 *   strip  24   the announcement strip (§ 3.4): one line of copy, not an argument. Added by
 *               cmp-banner (6 Oct 2026) so a strip needs neither `flush` plus an inner padding
 *               (the padding-block collision) nor a padding through `className` (rule 5)
 */
export type SectionDensity = 'strip' | 'open';

export type SectionProps = {
  /** Element to render. Defaults to a semantic <section>; use "div"/"header"/"footer" as needed. */
  as?: ElementType;
  /**
   * The ground this band paints, and the ink, rules, accents and links that read on it.
   * Defaults to `paper`.
   *
   * The attribute is emitted even for `paper`, deliberately: paper is the `:root` default, so
   * omitting it would work at the top level but leave a paper band nested inside an `ink` one
   * inheriting dark roles.
   */
  surface?: SectionSurface;
  /**
   * `strip` (24): the one-line announcement band. `open` (128; 96 below 768): a band whose moving
   * field needs room to fade out around its words (owner, 31 Oct 2026). Otherwise every band takes
   * the same vertical air at a given width — 96 from 768, 64 below (owner, 7 Oct 2026) — so no band
   * is tightened or loosened to fit a fold. Fit the content instead.
   */
  density?: SectionDensity;
  /**
   * Drop the vertical air to zero, for a composition that supplies its own — a full-bleed
   * immersive hero being the case that needs it. Overrides `density`.
   */
  flush?: boolean;
  /**
   * Extra classes. Do NOT set horizontal padding, max-width, background or colour here —
   * Section owns the content column and the ground, and overriding either from outside puts
   * one band out of alignment with every other band on the page.
   */
  className?: string;
  children: ReactNode;
  id?: string;
  /** Accessible name relationship for a band that is exposed as a labelled region. */
  'aria-labelledby'?: string;
  /**
   * An accessible name for a band with no heading to point at — an announcement strip rendered as
   * an `aside`, a landmark that would otherwise be announced without a name. Prefer
   * `aria-labelledby` whenever the band has a heading.
   */
  'aria-label'?: string;
  /**
   * The band's archetype (visual-direction § 3.4: `A` to `S`, or `strip`), emitted for `fold:check`,
   * which measures every band by it (§ 1.3). A marker for the gate, never a style hook.
   */
  'data-band'?: string;
  /**
   * Marks the band as a page's opening for `fold:check`'s hero rule (§ 1.3: the hero + the nav end
   * inside the first screen). Present (`""`) or absent; a marker for the gate, never a style hook.
   */
  'data-fold-hero'?: '';
  /**
   * Exempts the band from `fold:check`'s height rule, with the reason as the value (§ 1.3: a list
   * that grows with the CMS). On the band itself, so the band stays the page's first child of
   * `main` and keeps the first band's air. A marker for the gate, never a style hook.
   */
  'data-fold-exempt'?: string;
  /** Optional component-owned arrangement marker for rendered-output acceptance checks. */
  'data-arrangement'?: string;
};

/**
 * Section — the full-width band. Paints the ground, insets its content to the shared content
 * column, applies the vertical rhythm, and provides the positioning context for full-bleed
 * layers. Drop a Layout inside it to arrange the content.
 *
 * Every value it uses comes from the --sec-* component token layer; this component contributes
 * no distances and no colours of its own.
 *
 * Every band keeps its full air on both sides, so two adjacent bands on the same surface are
 * separated by both paddings (96 + 96). The single-seam merge of 2.17 was reverted on 30 Sep
 * 2026 — see Section.module.css.
 */
export function Section({
  as: Tag = 'section',
  surface = 'paper',
  density,
  flush = false,
  className,
  children,
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel,
  'data-arrangement': dataArrangement,
  'data-band': dataBand,
  'data-fold-hero': dataFoldHero,
  'data-fold-exempt': dataFoldExempt,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      data-arrangement={dataArrangement}
      data-band={dataBand}
      data-fold-hero={dataFoldHero}
      data-fold-exempt={dataFoldExempt}
      data-surface={surface}
      className={cx(
        styles.section,
        !flush && density && styles[density],
        flush && styles.flush,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
