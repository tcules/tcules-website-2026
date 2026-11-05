import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { cx } from '@/lib/cx';

import styles from './Button.module.css';

/**
 * How loud the button is. Three labelled kinds, one per job (owner, 7 Oct 2026 as corrected 8 Oct —
 * docs/kit/review-7-oct.md r7-buttons):
 *
 *   solid    the page's ONE main action — the hero's and/or the bottom close's ask (PageHero,
 *            CtaSection's closes, EnquiryForm's submit). Always blue: there is no ink solid.
 *   ghost    the solid's partner, beside it and nowhere else in content — blue, no outline, the fill
 *            is the whole affordance. (Site chrome — the nav's menu triggers, a filter set — also
 *            uses the neutral ghost; that is a control, not an action in content.)
 *   link     every other action, which navigates: a band's "Start with an audit", a card's foot, a
 *            line of text. No box at all, so it can sit in a paragraph.
 *   outline  a hairline-ruled control, primary only. Icon alone, round: a stepper through a set —
 *            a slider's previous / next (fdn-scroll, 6 Oct 2026). Labelled, at the button's own
 *            radius: the FIRST of a band's two actions, where no solid is in view (a Banner's
 *            "Meet the studio" before its quieter "Careers at Tcules" link; owner, 29 Oct 2026;
 *            decisions/2026-10-29-banner-two-actions-one-row). A labelled outline never sits
 *            beside a solid: there it would read as a second action of the solid's rank.
 *
 * Solid, ghost and link carry no outline. Separation comes from fill and from the space around it,
 * and a labelled outline beside a solid would read as a second action of the same rank. `outline`
 * never stands beside a solid: as a stepper it carries no label (a bare ghost glyph at rest is
 * indistinguishable from the decorative icons in a card, visual-direction § 3.1), and labelled it
 * leads an in-band pair whose second is a link, where the band has no solid at all. It is a Button
 * variant rather than a pattern's own control so every use takes the same states, ring, hit area
 * and per-surface colour instead of copying them.
 */
export type ButtonEmphasis = 'solid' | 'ghost' | 'link' | 'outline';

/**
 * The token layer's colour axis — `primary` and `neutral` select `--btn-{emphasis}-primary-*` and
 * `--btn-{emphasis}-neutral-*` respectively. It applies to the QUIET emphases only: a solid is blue
 * by type (`PrimaryTone` / `NeutralTone` below), because the solid is the page's one main action and that action is
 * the offer (r7-buttons, 8 Oct 2026, which retired the ink solid and its `--btn-solid-neutral-*`).
 *
 * It is named `tone` rather than `color` for one reason: `color` is a real (if deprecated) HTML
 * attribute, so a prop of that name collides with React's own typing for every element this can
 * render as, and the resulting error points at the DOM rather than at the design system.
 *
 *   primary  Brandeis blue — the default, and every ghost and link in CONTENT. On the web, blue
 *            means clickable: blue is the recurring foreground accent.
 *   neutral  ink — site CHROME only: the nav's menu triggers and its quiet links, a segmented
 *            filter set. It claims nothing, so it never stands for an action in a band.
 */
export type ButtonTone = 'primary' | 'neutral';

/**
 * Three heights. Only the height, the label and the icon step — the box padding, the label margin
 * and the gap are identical at all three, so a button never looks like a different button at a
 * different size.
 *
 *   sm  32  table rows, toolbars, filter sets, anything inside a dense grid cell
 *   md  40  the default: headers, forms, cards, every button with no reason to be another size
 *   lg  48  heroes, closing calls, and every button on a phone
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/* Everything a <button> accepts, minus the two we redefine. `color` is dropped so `tone` can own
   the colour axis without colliding with the HTML attribute; `children` is dropped so each variant
   below can state its own rule about whether a label is required. */
type ButtonBase = Omit<
  ComponentPropsWithoutRef<'button'>,
  'color' | 'children' | 'aria-busy' | 'disabled'
> & {
  /**
   * Element to render. Defaults to `button`.
   *
   * A button that NAVIGATES is an anchor: `as="a"` with an href, or `as={Link}` for an internal
   * route. Link emphasis is almost always an anchor; solid and ghost are almost always buttons.
   * Paths come from `@/lib/routes`, never written out at the call site.
   *
   *     <Button as={Link} href={ROUTES.contact}>Start a project</Button>
   *     <Button as="a" href="https://example.com">Read the paper</Button>
   *
   * `type` and `disabled` are only emitted for a real `button`; an anchor gets `aria-disabled`
   * and leaves the tab order instead, because neither attribute means anything on an `<a>`.
   *
   * A caller-held `aria-disabled` is honoured too: the control renders unavailable (no `.live`,
   * the disabled colours) and its `onClick` is withheld, but it KEEPS focus and its ring. That is
   * the end-of-row state of a stepper — a Slider's Next at the last slide — where a native
   * `disabled` would throw a keyboard user who pressed to the end out to the body.
   */
  as?: ElementType;
  /** Destination, when rendering as an anchor. Ignored by a native button. */
  href?: string;
  /** Height, label size and icon size together. Defaults to `md` (40). */
  size?: ButtonSize;
  /**
   * The HELD second step — this control is the current one. A selected filter, the current nav
   * item, an open panel. It reads the same value a press reads, so pressing a stateful control
   * previews the state it is about to take.
   *
   * A call to action never enters it. On a solid primary the deep step should only ever be
   * momentary, which is why this is a prop on segmented controls and navigation, not on a CTA.
   */
  active?: boolean;
  /**
   * Extend the hit area to the 44px touch floor without changing the box, for a control that
   * stays at 32 or 40 on touch — a toolbar, a dense table row.
   *
   * A button that can simply be `size="lg"` on a phone should do that instead: at 48 the box
   * already clears the floor and needs no extension.
   */
  extendHitArea?: boolean;
  /**
   * Extra classes. Do NOT set colour, background, padding, height or radius here — all six live
   * in the token layer, per surface, and a hand-set value is exactly the drift the layer exists
   * to prevent. Position and margin are the caller's business; nothing else is.
   *
   * A button never sets its own outer spacing either. Put it in a `Cluster` and let the container
   * own the gap.
   */
  className?: string;
};

/* Progress and unavailability are mutually exclusive contracts. A busy action must keep focus;
   a disabled action must leave the tab order. Allowing both would make that promise impossible. */
type ButtonAvailability =
  | {
      /**
       * An in-progress action. Keeps the control focusable and named, suppresses pointer states,
       * and emits aria-busy without pretending the action is unavailable.
       */
      busy: true;
      disabled?: never;
    }
  | { busy?: false; disabled?: boolean };

/* Emphasis and tone, as one decision. `emphasis` defaults to `solid`, and `neutral` is open to the
   quiet emphases only: the ink solid is retired (r7-buttons), so `<Button tone="neutral">` — a solid
   by default — is a type error rather than a review comment. Split by TONE rather than by emphasis
   so a caller that computes its emphasis (`index === 0 ? 'solid' : 'ghost'`) still type-checks
   against the primary member without TypeScript having to discriminate a union. */
type PrimaryTone<E extends ButtonEmphasis> = {
  /** Loudness. Defaults to `solid`. See `ButtonEmphasis`. */
  emphasis?: E;
  /** The token layer's colour axis. Defaults to `primary`, the only tone a solid takes. */
  tone?: 'primary';
};
type NeutralTone<E extends ButtonEmphasis> = {
  /** Loudness. A neutral control is never a solid. See `ButtonEmphasis`. */
  emphasis: E;
  /** Site chrome only. See `ButtonTone`. */
  tone: 'neutral';
};

/* A labelled button. The label is the whole button in the common case: two to four words, terse
   and literal, uppercased by the stylesheet rather than by the copy. */
type WithLabel = {
  iconOnly?: false;
  children: ReactNode;
} & (PrimaryTone<'solid' | 'ghost' | 'link' | 'outline'> | NeutralTone<'ghost' | 'link'>);

/* One icon, one side — never both. A trailing glyph means the click changes where you are; a
   leading glyph names the KIND of action. Together they read as two claims about one action, and
   the label loses the middle of the box. The `never`s are what make that a type error rather than
   a review comment. */
type TrailingIcon = { icon?: ReactNode; iconLeft?: never };
type LeadingIcon = { iconLeft?: ReactNode; icon?: never };

/* Icon alone. Square at the size's height, and it MUST carry its own accessible name — the glyph
   is `aria-hidden`, so without one the control is unlabelled to a screen reader and unfindable in
   a test. Requiring it here is why that cannot be forgotten.
 *
 * `emphasis` narrows to solid or ghost: intersecting with the base's wider union removes `link`.
 * Strip the box from an icon-only button and what is left is a bare glyph, indistinguishable from
 * the decorative icons above a feature cell. An icon that must be clickable keeps its box. */
type IconAlone = {
  iconOnly: true;
  icon: ReactNode;
  'aria-label': string;
  children?: never;
  iconLeft?: never;
} & (PrimaryTone<'solid' | 'ghost'> | NeutralTone<'ghost'>);

/* The outlined stepper. Icon alone by construction — a labelled outline is the "two buttons of the
   same rank" the three labelled emphases avoid — and primary only: it is navigation through a set,
   which the owner's 6 Oct ruling puts in blue (arrows, small marks), so a neutral axis would be
   tokens nobody reads. Never busy: stepping is instant, so there is no request to wait on and no
   post-activation value to show. */
type OutlineAlone = {
  iconOnly: true;
  icon: ReactNode;
  emphasis: 'outline';
  tone?: 'primary';
  busy?: never;
  'aria-label': string;
  children?: never;
  iconLeft?: never;
};

export type ButtonProps = ButtonBase &
  ButtonAvailability &
  ((WithLabel & (TrailingIcon | LeadingIcon)) | IconAlone | OutlineAlone);

/**
 * Button — the control, built to the Button Spec Sheet.
 *
 * Five combinations (the blue solid; ghost and link in two tones, the neutral pair for site chrome
 * only), three sizes, three variants (label, label and icon, icon alone) and seven states. It contributes no colour and no distance: every value comes
 * from `--btn-*` in tokens/components/button.css, which re-declares the whole set once per
 * surface. So the same markup is correct on paper, on a tint panel, in the ink footer and on the
 * blue pivot — including a tint panel nested inside an ink section — without being told where it
 * is. Put it inside a `Section` and the `data-surface` attribute does the rest.
 *
 * Hover, pressed, focus and disabled are the stylesheet's business. `active` and `busy` are the
 * two states a caller holds, because only application state knows selection and request progress.
 */
export function Button({
  as: Tag = 'button',
  emphasis = 'solid',
  tone = 'primary',
  size = 'md',
  icon,
  iconLeft,
  iconOnly = false,
  active = false,
  busy = false,
  disabled = false,
  extendHitArea = false,
  type,
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  /* A real <button> takes the attributes; anything else takes the ARIA equivalent, because
     `disabled` is not valid on an anchor and would be dropped silently. `type` defaults to
     "button" so a control inside a form does not submit it by accident — the browser's default is
     "submit", which is a bug waiting for the first form on the site. */
  const isNativeButton = Tag === 'button';
  const nativeState = isNativeButton
    ? { type: type ?? 'button', disabled: disabled || undefined }
    : { 'aria-disabled': disabled || undefined, tabIndex: disabled ? -1 : undefined };
  /* Unavailable but focused: the caller states `aria-disabled` and keeps the control in the tab
     order (see `as`). It takes the disabled look and loses its click, and nothing else changes. */
  const held = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';
  const off = disabled || held;
  /* A label's last word and its trailing glyph never part (see GluedLabel). A bare link since
     29 Oct 2026; every boxed button too since 5 Nov 2026 (owner, the responsive pass: the hero's
     "Start small with an optional pilot →" wrapped at 360 with its arrow stranded at the box's end). */
  const glued = Boolean(icon) && !iconOnly && lastSpace(children) > 0;
  /* In a box the glyph is a flex item beside the label, so it cannot follow the label's last line.
     A glued boxed button sets it INSIDE the label, inline, where the bare link already has it. */
  const inlineGlyph = glued && emphasis !== 'link';

  return (
    <Tag
      {...rest}
      {...nativeState}
      onClick={held ? undefined : onClick}
      aria-busy={busy || undefined}
      className={cx(
        styles.button,
        styles[emphasis],
        styles[tone],
        /* md is the base rule, so it emits no class — matching the token layer, where
           --btn-height-md is what `.button` reads and sm/lg are the deltas. */
        size !== 'md' && styles[size],
        iconOnly && styles.iconOnly,
        active && styles.active,
        /* `live` is what every hover, press, active and focus rule is gated on, and it is derived
           here rather than passed: a caller cannot make a disabled button interactive by
           forgetting a prop. It exists as a class rather than a `:not(:disabled)` selector
           because an anchor has no `:disabled` to negate. */
        off ? styles.disabled : busy ? styles.busy : styles.live,
        held && styles.held,
        extendHitArea && styles.hit,
        glued && styles.glued,
        className,
      )}
    >
      {iconOnly ? (
        icon
      ) : (
        <>
          {iconLeft}
          <span className={styles.label}>
            <span className={styles.labelInk}>
              {glued ? <GluedLabel text={children as string} /> : children}
            </span>
            {inlineGlyph && icon}
          </span>
          {!inlineGlyph && icon}
        </>
      )}
    </Tag>
  );
}

/** Where a plain-string label's last word starts (its last space), else -1. */
const lastSpace = (label: ReactNode) =>
  typeof label === 'string' ? label.trimEnd().lastIndexOf(' ') : -1;

/**
 * A link's label with its LAST word kept on the trailing glyph's line (owner, 29 Oct 2026: the
 * case lead's "Read the … case" broke its arrow off onto a line of its own at 1440). A bare link
 * flows as inline content and the glyph is an atomic inline, so a line could break between the
 * label's last word and the glyph. `.glued` sets `nowrap` on the link; everything before the last
 * word sits in `.labelHead`, which restores normal wrapping, so a long label still wraps between its
 * words and only the last word and the glyph are inseparable.
 */
function GluedLabel({ text }: { text: string }) {
  const at = lastSpace(text);
  return (
    <>
      <span className={styles.labelHead}>{text.slice(0, at + 1)}</span>
      {text.slice(at + 1).trimEnd()}
    </>
  );
}
