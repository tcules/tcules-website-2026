import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

import { cx } from '@/lib/cx';

import styles from './Input.module.css';
import { SelectControl, type SelectControlProps } from './SelectControl';

export type { InputOption } from './SelectControl';

/* One emphasis and no `emphasis` prop; two APPEARANCES (`appearance`, box and line). There were two
   emphases — standard, and a `quiet` emphasis kept
   for SiteFooter's newsletter row — and on paper and ink the two rendered nearly identically: the
   same fill, the same rule, a placeholder a step apart. An emphasis nobody can see is worse than
   none, so quiet was merged into standard and deleted (29 Sep 2026, tracker 2.17), and a prop with
   one legal value went with it. The token names keep `standard` as the name of the treatment. */
type SharedProps = {
  /** Adds the invalid rule and emits aria-invalid without replacing native control semantics. */
  invalid?: boolean;
  /**
   * `box` (default) is the filled, ruled control. `line` is the unboxed field (kit cmp-form, 6 Oct
   * 2026): no fill, no side or top rule, one rule under the value that turns blue and thickens on
   * focus. references.md lists underline-only fields under the moves to adopt (Meridian, Executra);
   * it is for a short form that sits in a composition rather than being the band's whole argument,
   * where a stack of white boxes on warm paper read as a default template. Same height, same type,
   * same states, so a form can change appearance without changing size.
   *
   * `bare` (owner, 16 Oct 2026: EnquiryForm's message dress) is the value alone, with no fill, no
   * rule and no ring: the field sits inside a container the COMPOSING pattern draws (a message
   * composer), and that container owns the focus indicator (`:focus-within`). Never use `bare`
   * outside such a container: on its own it has no visible focus.
   *
   * `fill` (same day, the card dress) is a soft well one step off its ground with no rule at rest;
   * focus lifts it to the brighter step and draws the focus rule, invalid draws the danger rule.
   */
  appearance?: 'box' | 'line' | 'bare' | 'fill';
  /**
   * The control's size step (home round 3, 11 Oct 2026). `md` (default) is 40, the md Button's
   * height, stepping to the 44 touch floor below 768. `lg` is 48 at every width with the value at
   * the lead role (18) and a taller textarea — for a form that is the band's primary object (the
   * enquiry close), where generous fields are part of the invitation. Named `scale` because `size`
   * is the native input's own attribute.
   */
  scale?: 'md' | 'lg';
  className?: string;
};

type NativeInputProps = SharedProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    as?: 'input';
    /**
     * Fixed words at the start of the value, inside the box (F.3): the link field's `https://`, so a
     * reader sees the address is taken care of and types only the rest. Not part of the value: the
     * composing pattern adds it back when it sends. Set in the placeholder's ink, and hidden from
     * assistive technology, since the label already names the field.
     */
    affix?: string;
  };

type NativeTextareaProps = SharedProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
    as: 'textarea';
  };

/**
 * A select in the same box (owner, 25 Nov 2026: "a proper dropdown instead of relying on a native
 * dropdown", after shadcn): the field's trigger, height, type, rule, focus ring and invalid state on
 * every appearance, and a list that opens under it. Controlled: `value` and `onValueChange`. The
 * chevron and the chosen option's tick are the caller's glyphs (`indicator`, `check`), as Button
 * takes its icon. See SelectControl for the keyboard and the ARIA.
 */
type CustomSelectProps = SharedProps &
  Omit<SelectControlProps, 'className'> & {
    as: 'select';
  };

export type InputProps = NativeInputProps | NativeTextareaProps | CustomSelectProps;

/**
 * Input — the control box only. Labels, optional flags, validation messages and layout belong to
 * the pattern composing it. The input and the textarea keep every applicable HTML attribute; the
 * select is a field-shaped trigger and list (SelectControl).
 */
export function Input({
  as = 'input',
  invalid = false,
  appearance = 'box',
  scale = 'md',
  className,
  'aria-invalid': ariaInvalid,
  ...rest
}: InputProps) {
  const nativeInvalid = invalid ? true : ariaInvalid;
  const invalidState =
    nativeInvalid === true ||
    nativeInvalid === 'true' ||
    nativeInvalid === 'grammar' ||
    nativeInvalid === 'spelling';
  const controlClassName = cx(
    styles.control,
    as === 'textarea' && styles.textarea,
    appearance === 'line' && styles.line,
    appearance === 'bare' && styles.bare,
    appearance === 'fill' && styles.fill,
    scale === 'lg' && styles.lg,
    invalidState && styles.invalid,
    className,
  );

  if (as === 'textarea') {
    return (
      <textarea
        {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        aria-invalid={nativeInvalid}
        className={controlClassName}
      />
    );
  }

  if (as === 'select') {
    return (
      <SelectControl
        {...(rest as Omit<SelectControlProps, 'className'>)}
        aria-invalid={nativeInvalid}
        className={controlClassName}
      />
    );
  }

  const { affix, ...inputProps } = rest as InputHTMLAttributes<HTMLInputElement> & {
    affix?: string;
  };
  if (affix) {
    /* The box moves to a wrapper so the affix sits inside it; the input inside is bare and the
       wrapper takes the field's hover, focus, invalid and disabled states from it. */
    return (
      <span
        className={cx(controlClassName, styles.affixed, inputProps.disabled && styles.affixedDisabled)}
      >
        <span className={styles.affix} aria-hidden="true">
          {affix}
        </span>
        <input {...inputProps} aria-invalid={nativeInvalid} className={styles.affixInput} />
      </span>
    );
  }

  return <input {...inputProps} aria-invalid={nativeInvalid} className={controlClassName} />;
}
