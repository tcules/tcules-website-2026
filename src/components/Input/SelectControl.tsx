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
export type InputOption = {
  value: string;
  label: string;
  /** What the closed field shows when it is chosen, if shorter than the label ("+91"). */
  short?: string;
  /** What a searchable list matches besides the label (a dial code with and without its plus). */
  keywords?: readonly string[];
};

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
  /**
   * A long list opens with a filter field at its top (F.3; Devagya, 27 Nov 2026: "dropdown plus type
   * so nobody has to scroll"): focus moves into it, typing narrows the options, best match first
   * (`rank`), and the arrows and Enter work from it.
   * `label` names the filter field, `empty` is said when nothing matches.
   */
  search?: { label: string; placeholder?: string; empty: string };
  className: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
};

/**
 * A searchable list's matches for what was typed, best first: a keyword that is exactly the words
 * ("91" for India +91), then a label that starts with them ("ind" for India), then a keyword that
 * starts with them, then a word inside the label that does ("British Indian Ocean Territory"). A
 * keyword matches from its start only, so "91" never finds Bolivia +591. The list's own order is
 * kept within each rank.
 */
function rank(options: readonly InputOption[], words: string): InputOption[] {
  const score = (option: InputOption): number => {
    const keywords = (option.keywords ?? []).map((keyword) => keyword.toLowerCase());
    const label = option.label.toLowerCase();
    if (keywords.includes(words)) return 0;
    if (label.startsWith(words)) return 1;
    if (keywords.some((keyword) => keyword.startsWith(words))) return 2;
    if (label.split(/[\s(),-]+/).some((word) => word.startsWith(words))) return 3;
    return 4;
  };
  return options
    .map((option, index) => ({ option, index, score: score(option) }))
    .filter((entry) => entry.score < 4)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((entry) => entry.option);
}

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
  search,
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
  const searchRef = useRef<HTMLInputElement>(null);
  const typed = useRef({ text: '', at: 0 });

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [above, setAbove] = useState(false);
  const [query, setQuery] = useState('');

  /* The options on show: all of them, or those the filter field's words match, best first. */
  const words = query.trim().toLowerCase();
  const shown = !search || words === '' ? options : rank(options, words);
  const chosen = shown.findIndex((option) => option.value === value);
  /* Where the list reopens: the chosen option's place in the whole list, since opening clears the
     filter. */
  const chosenInAll = options.findIndex((option) => option.value === value);
  const chosenOption = options.find((option) => option.value === value);
  const label = chosenOption ? (chosenOption.short ?? chosenOption.label) : undefined;

  function show(at: number, seed = '') {
    if (disabled || options.length === 0) return;
    setQuery(seed);
    setActive(Math.max(0, Math.min(options.length - 1, at)));
    setOpen(true);
  }
  function hide(refocus = true) {
    setOpen(false);
    setQuery('');
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  }
  function choose(index: number) {
    const option = shown[index];
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

  /* A searchable list takes focus into its filter field as it opens. */
  useEffect(() => {
    if (open && search) searchRef.current?.focus({ preventScroll: true });
  }, [open, search]);

  /* Keep the current option in view inside the list, without moving the page. */
  useEffect(() => {
    if (!open || active < 0) return;
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`);
    if (!list || !item) return;
    /* Under a searchable list's filter field, which stays over the top of the scroll. */
    const cover = searchRef.current?.offsetHeight ?? 0;
    if (item.offsetTop - cover < list.scrollTop) list.scrollTop = item.offsetTop - cover;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
    // optionId derives only from id, which is fixed for the control's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  /* A press anywhere outside closes it, leaving focus where the press put it. */
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
      setQuery('');
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  /** The next option starting with what was typed, searching on from the current one. `now` is the
      key event's own time, so a run of letters is timed without reading the clock. */
  function find(key: string, from: number, now: number): number {
    const run = now - typed.current.at < TYPEAHEAD_MS ? typed.current.text + key : key;
    typed.current = { text: run, at: now };
    const typedRun = run.toLowerCase();
    const start = run.length > 1 ? from : from + 1;
    for (let step = 0; step < options.length; step += 1) {
      const index = (start + step) % options.length;
      if (options[index]?.label.toLowerCase().startsWith(typedRun)) return index;
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
        show(chosenInAll >= 0 ? chosenInAll : 0);
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault();
        show(key === 'Home' ? 0 : last);
      } else if (letter && search) {
        /* A searchable list opens with the letter already in its filter field. */
        event.preventDefault();
        show(0, key);
      } else if (letter) {
        const match = find(key, chosen >= 0 ? chosen : -1, event.timeStamp);
        if (match >= 0) show(match);
      }
      return;
    }
    navigate(event);
  }

  /** The open list's keys, from the trigger or from a searchable list's filter field. */
  function navigate(event: KeyboardEvent<HTMLElement>) {
    const { key } = event;
    const last = shown.length - 1;
    const letter = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

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
      case 'End':
        /* In the filter field, Home and End move the caret. */
        if (search) return;
        event.preventDefault();
        setActive(key === 'Home' ? 0 : last);
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
        event.preventDefault();
        if (shown.length > 0) choose(active);
        return;
      case ' ':
        /* In the filter field a space is a space ("United Kingdom"). */
        if (search) return;
        event.preventDefault();
        choose(active);
        return;
      case 'Escape':
        event.preventDefault();
        hide();
        return;
      case 'Tab':
        setOpen(false);
        setQuery('');
        return;
      default:
        if (letter && !search) {
          const match = find(key, active, event.timeStamp);
          if (match >= 0) setActive(match);
        }
    }
  }

  const optionRows = shown.map((option, index) => (
    <div
      key={option.value}
      id={optionId(index)}
      role="option"
      aria-selected={index === chosen}
      className={cx(styles.selectOption, index === active && styles.selectOptionActive)}
      /* Keep focus where it is: a press on an option must not blur it first. */
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
  ));
  const activeId = open && active >= 0 && active < shown.length ? optionId(active) : undefined;

  return (
    <div ref={rootRef} className={styles.selectRoot}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        /* Searchable, the filter field is the combobox and the trigger only opens it. */
        role={search ? undefined : 'combobox'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={search ? undefined : activeId}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        className={cx(className, styles.selectTrigger, label === undefined && styles.selectEmpty)}
        onClick={() => (open ? hide() : show(chosenInAll >= 0 ? chosenInAll : 0))}
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
      {search ? (
        <div
          ref={listRef}
          hidden={!open}
          className={cx(styles.selectList, styles.selectListSearch, above && styles.selectListAbove)}
        >
          <input
            ref={searchRef}
            type="text"
            role="combobox"
            aria-label={search.label}
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
            placeholder={search.placeholder}
            className={styles.selectSearch}
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              setActive(0);
            }}
            onKeyDown={navigate}
          />
          <div id={listId} role="listbox" aria-label={search.label}>
            {optionRows}
          </div>
          {/* Always mounted, so "nothing matches" is announced as its words arrive; empty, it takes
              no room. */}
          <p className={shown.length === 0 ? styles.selectNote : undefined} role="status">
            {shown.length === 0 ? search.empty : null}
          </p>
        </div>
      ) : (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={id}
          tabIndex={-1}
          hidden={!open}
          className={cx(styles.selectList, above && styles.selectListAbove)}
        >
          {optionRows}
        </div>
      )}
    </div>
  );
}
