import { CopyLink } from './CopyLink';

import styles from './AnchorHeading.module.css';

export type AnchorHeadingProps = {
  /** The section's anchor: the heading's id, and the fragment the copied link ends in. */
  id: string;
  /** The heading as authored. Plain text: it names the control too. */
  children: string;
  /** The heading level. Defaults to `h2`, a section of a long-form body. */
  as?: 'h2' | 'h3';
};

/**
 * A section heading a reader can link to: the heading, then a copy-link control after its last
 * word (P3 #5, 18 Nov 2026: "copy-link icon on each H2").
 *
 * The heading takes no type of its own. Inside Prose it is a Prose h2, outside it the base h2, so
 * the flow's rhythm and scale are untouched; this component adds the control and nothing else.
 *
 * ── Why the heading is named with aria-label ────────────────────────────────────────
 * The control sits INSIDE the heading, so it follows the last word on the same line at every width
 * (the last word and the control are glued, never split across a wrap). Named from its content, the
 * heading would then read "Title, Copy link: Title". aria-label keeps its name the authored title,
 * which is also what the table of contents and a screen reader's heading list show.
 *
 * The control is a button, not a link: the action is copying. Its confirmation is a status message
 * screen readers announce ("Link copied"), shown on screen as a toast for two seconds.
 */
export function AnchorHeading({ id, children, as: Tag = 'h2' }: AnchorHeadingProps) {
  const title = children.trim();
  const cut = title.lastIndexOf(' ');
  const head = cut === -1 ? '' : title.slice(0, cut + 1);
  const last = cut === -1 ? title : title.slice(cut + 1);
  return (
    <Tag id={id} aria-label={title}>
      {head}
      <span className={styles.glue}>
        {last}
        {' '}
        <CopyLink anchor={id} title={title} />
      </span>
    </Tag>
  );
}
