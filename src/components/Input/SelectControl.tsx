'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cx } from '@/lib/cx';

import styles from './Input.module.css';

/** One choice in a select: what is posted, and what the reader reads. */
export type InputOption = { value: string; label: string };

export type SelectControlProps = {
  id?: string;
  /** Posted with the form, through a hidden input. */
  name?: string;
  options: readonly InputOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  /** The trigger's words while nothing is chosen. */
  placeholder?: string;
  disabled?: boolean;
  /** The trigger's glyph, composed by the caller (Input never imports Icon). */
  indicator?: ReactNode;
  /** The mark beside the chosen option, composed by the caller. */
  check?: ReactNode;
  className: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
};

/** How long a run of typed letters counts as one search (WAI-ARIA select-only combobox). */
const TYPEAHEAD_MS = 500;
/** Options moved by Page Up / Page Down. */
const PAGE = 10;

/**
 * The select's control: a field-shaped trigger and a list that opens under it (above it when there is
 * no room below), after shadcn's Select and the WAI-ARIA select-only combobox.
 *
 * Focus stays on the trigger the whole time; the list's current option is pointed at with
 * aria-activedescendant, so a screen reader reads each option as the arrows move. Closed: Down, Up,
 * Enter, Space open it on the chosen option, Home and End on the first and last, a typed letter jumps
 * to the next option it starts. Open: the arrows, Home, End, Page Up and Page Down move, a typed run
 * of letters finds an option, Enter or Space chooses and closes, Escape and Tab close without
 * changing anything. A press outside closes it. The list scrolls itself, never the page.
 */
export function SelectControl({
  id: givenId,
  name,
  options,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  indicator,
  check,
  className,
  'aria-describedby': describedBy,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
}: SelectControlProps) {
  const ownId = useId();
  const id = givenId ?? `${ownId}-select`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: '', at: 0 });

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [above, setAbove] = useState(false);

  const chosen = options.findIndex((option) => option.value === value);
  const label = chosen >= 0 ? options[chosen]?.label : undefined;

  function show(at: number) {
    if (disabled || options.length === 0) return;
    setActive(Math.max(0, Math.min(options.length - 1, at)));
    setOpen(true);
  }
  function hide(refocus = true) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  }
  function choose(index: number) {
    const option = options[index];
    if (option && option.value !== value) onValueChange(option.value);
    hide();
  }

  /* Open upward when the list would run past the bottom of the screen and there is more room above. */
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current?.getBoundingClientRect();
    const list = listRef.current;
    if (!trigger || !list) return;
    const below = window.innerHeight - trigger.bottom;
    setAbove(list.offsetHeight > below && trigger.top > below);
  }, [open]);

  /* Keep the current option in view inside the list, without moving the page. */
  useEffect(() => {
    if (!open || active < 0) return;
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`);
    if (!list || !item) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
    // optionId derives only from id, which is fixed for the control's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  /* A press anywhere outside closes it, leaving focus where the press put it. */
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  /** The next option starting with what was typed, searching on from the current one. */
  function find(key: string, from: number): number {
    const now = Date.now();
    const run = now - typed.current.at < TYPEAHEAD_MS ? typed.current.text + key : key;
    typed.current = { text: run, at: now };
    const query = run.toLowerCase();
    const start = run.length > 1 ? from : from + 1;
    for (let step = 0; step < options.length; step += 1) {
      const index = (start + step) % options.length;
      if (options[index]?.label.toLowerCase().startsWith(query)) return index;
    }
    return -1;
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    const { key } = event;
    const last = options.length - 1;
    const letter = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        show(chosen >= 0 ? chosen : 0);
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault();
        show(key === 'Home' ? 0 : last);
      } else if (letter) {
        const match = find(key, chosen >= 0 ? chosen : -1);
        if (match >= 0) show(match);
      }
      return;
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        if (event.altKey) choose(active);
        else setActive((index) => Math.min(last, index + 1));
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) choose(active);
        else setActive((index) => Math.max(0, index - 1));
        return;
      case 'Home':
        event.preventDefault();
        setActive(0);
        return;
      case 'End':
        event.preventDefault();
        setActive(last);
        return;
      case 'PageDown':
        event.preventDefault();
        setActive((index) => Math.min(last, index + PAGE));
        return;
      case 'PageUp':
        event.preventDefault();
        setActive((index) => Math.max(0, index - PAGE));
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(active);
        return;
      case 'Escape':
        event.preventDefault();
        hide();
        return;
      case 'Tab':
        setOpen(false);
        return;
      default:
        if (letter) {
          const match = find(key, active);
          if (match >= 0) setActive(match);
        }
    }
  }

  return (
    <div ref={rootRef} className={styles.selectRoot}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        className={cx(className, styles.selectTrigger, label === undefined && styles.selectEmpty)}
        onClick={() => (open ? hide() : show(chosen >= 0 ? chosen : 0))}
        onKeyDown={onKeyDown}
      >
        <span className={styles.selectValue}>{label ?? placeholder ?? ''}</span>
        {indicator ? (
          <span className={cx(styles.selectIndicator, open && styles.selectIndicatorOpen)} aria-hidden="true">
            {indicator}
          </span>
        ) : null}
      </button>
      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        aria-labelledby={id}
        tabIndex={-1}
        hidden={!open}
        className={cx(styles.selectList, above && styles.selectListAbove)}
      >
        {options.map((option, index) => (
          <div
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={index === chosen}
            className={cx(styles.selectOption, index === active && styles.selectOptionActive)}
            /* Keep focus on the trigger: a press on an option must not blur it first. */
            onPointerDown={(event) => event.preventDefault()}
            onPointerMove={() => setActive(index)}
            onClick={() => choose(index)}
          >
            <span>{option.label}</span>
            {index === chosen && check ? (
              <span className={styles.selectCheck} aria-hidden="true">
                {check}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
