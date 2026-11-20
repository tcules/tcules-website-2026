'use client';

import { useId, useState, type ReactNode } from 'react';
import { Button, Icon, Layout } from '@/components';
import styles from './LogoGrid.module.css';

/**
 * The still ticker's phone fold (owner, 19 Nov 2026: "on mobile limit to 6 logos and a button to see
 * more when reduced motion"). Only where the row does not move AND the screen is a phone does the
 * still wall fold: the marks past the sixth (LogoGrid's `TICKER_PHONE_FOLD`, and the `n + 7` in its
 * stylesheet) are hidden until the toggle opens them, and the
 * toggle is drawn only there (LogoGrid.module.css, the reduced-motion phone block). A moving row, or
 * any width from 768, shows every mark and no toggle. The hidden marks stay in the DOM, so the toggle
 * only reveals what is already there: a real button, `aria-expanded` on it, `aria-controls` naming
 * the row. The same link button the testimonial wall's phone fold takes.
 */
export function TickerFold({ hidden, children }: { hidden: number; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <Layout rowGap="gutter">
      <div id={id} data-open={open || undefined} className={styles.tickerFold}>
        {children}
      </div>
      {/* The show/hide sits on a plain wrapper: on the Layout itself, Layout's own `display` (later in
          the cascade) won, so the toggle showed at every width. */}
      <div className={styles.tickerFoldToggle}>
        <Layout justifyItems="center">
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
      </div>
    </Layout>
  );
}
