'use client';

import { useId, useState, type ReactNode } from 'react';
import { Button, Icon, Layout } from '@/components';
import styles from './Testimonial.module.css';

/**
 * The wall's phone fold (owner, 17 Nov 2026, Jatin's m- boards: three quotes, then "See 3 more"):
 * below 768 the cards past the fold (`.beyond`) are hidden until the toggle opens them; from 768 the
 * toggle is not drawn and every card shows. The hidden cards stay in the DOM, so the toggle only
 * reveals what is already there. A real button, `aria-expanded` on it and `aria-controls` naming
 * the wall.
 */
export function WallFold({ hidden, children }: { hidden: number; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <Layout rowGap="gutter">
      <div id={id} data-open={open || undefined} className={styles.fold}>
        {children}
      </div>
      {/* Centred under the wall (owner, 23 Nov 2026): the toggle belongs to the whole set, not to
          its first column. */}
      <Layout justifyItems="center" className={styles.foldToggle}>
        {/* The link button every in-band "see more" takes (owner, 18 Nov 2026: "the link button
            instead of the blocky outline button"), still a real <button> with aria-expanded. */}
        <Button
          emphasis="link"
          size="md"
          extendHitArea
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          icon={<Icon name={open ? 'alt-arrow-up' : 'alt-arrow-down'} />}
        >
          {open ? 'See fewer' : `See ${hidden} more`}
        </Button>
      </Layout>
    </Layout>
  );
}
