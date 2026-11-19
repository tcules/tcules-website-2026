'use client';

import { useEffect, useRef, useState } from 'react';

import { glyphs } from '@/lib/icon-glyphs';

import styles from './AnchorHeading.module.css';

/** How long the confirmation stays on screen. Long enough to read two words, short enough to clear. */
const SHOWN_MS = 2000;

/**
 * The copy-link control of AnchorHeading. Copies the page's address with the section's fragment.
 * Where the clipboard is refused (an insecure origin, a denied permission), it puts the fragment in
 * the address bar instead and says so, so the reader still leaves with the link.
 */
export function CopyLink({ anchor, title }: { anchor: string; title: string }) {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const say = (text: string) => {
    clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(''), SHOWN_MS);
  };

  const copy = async () => {
    const url = new URL(window.location.href);
    url.hash = anchor;
    try {
      await navigator.clipboard.writeText(url.href);
      say('Link copied');
    } catch {
      window.history.replaceState(null, '', url.href);
      say('Link is in the address bar');
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.control}
        onClick={copy}
        aria-label={`Copy link: ${title}`}
      >
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {glyphs['chrome-link'].map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </button>
      {/* Always in the tree, so the announcement is heard: a live region added at the moment it
          speaks is missed by some screen readers. Empty, it has no box. */}
      <span role="status" className={styles.toast}>
        {message}
      </span>
    </>
  );
}
