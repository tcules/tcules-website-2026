import type { ReactNode } from 'react';

import { Layout, Section } from '@/components';
import { TableOfContents, type TocItem } from '@/patterns';

import styles from './ResourceArticle.module.css';

/**
 * One part of an article's column, in reading order.
 *
 *   text   running words (paragraphs, lists, headings, a FAQ): capped at the reading measure (68ch, about
 *          80 characters) rather than the 941 track's ~120 (owner, 18 Nov 2026).
 *   block  a figure, a table, a callout, the summary, the author box: the whole track.
 *
 * Both share the one inline-start edge; only the text's end edge stops short.
 */
export type ArticleItem = { key: string; node: ReactNode; measure: 'text' | 'block' };

export type ResourceArticleProps = {
  /** The outline; the contents rail shows from two entries. */
  outline: readonly TocItem[];
  items: readonly ArticleItem[];
};

/**
 * ResourceArticle — the body of an insight (article, guide, research, podcast or event page): the
 * contents rail beside the article column, on paper. The page reads the content and renders each
 * block; this template makes the two decisions every insight shares — the rail's split and the
 * reading measure — once, for every one of them. LongformShell's rule, applied to the CMS's own
 * articles: "the text caps itself, the block does not".
 */
export function ResourceArticle({ outline, items }: ResourceArticleProps) {
  const hasOutline = outline.length >= 2;
  return (
    /* The body continues the hero above it on the same paper: one seam between them, the hero's foot,
       not the hero's and this band's both (owner and Jatin, 19 Nov 2026). */
    <Section as="div" surface="paper" continues>
      <Layout
        columns={hasOutline ? { base: 1, lg: [1, 4] } : { base: 1 }}
        colGap="column"
        rowGap="stack"
        align="start"
      >
        {hasOutline ? <TableOfContents items={outline} /> : null}
        <Layout as="article" rowGap="stack">
          {items.map((item) =>
            item.measure === 'text' ? (
              <div key={item.key} className={styles.reading}>
                {item.node}
              </div>
            ) : (
              <div key={item.key} className={styles.block}>
                {item.node}
              </div>
            ),
          )}
        </Layout>
      </Layout>
    </Section>
  );
}
