import type { ReactNode } from 'react';

import { Layout, Prose } from '@/components';
import { cx } from '@/lib/cx';

import styles from './Callout.module.css';

export type CalloutProps = {
  /**
   * Trusted, content-seam-sanitised rich text for one parenthetic note.
   *
   * The field supports the same inline markup as Prose. It does not support headings, figures,
   * blockquotes or other block schemas: the content seam owns that narrower authoring contract,
   * while Prose remains responsible for rendering the trusted HTML it receives.
   */
  html: string;
  /**
   * An optional short key naming what kind of boundary this is — "Scope", "Note", "Method".
   * Authored in sentence case and passed as written: the mono label voice uppercases it in CSS,
   * never in the string (tracker 2.17). Absent — or blank — renders the note exactly as it was
   * before the key existed: no Layout, no empty span, no seam.
   */
  label?: string;
  /**
   * What kind of note it is (cmp-process-stats fix round, 6 Oct 2026).
   *
   *   note     the quiet boundary on the claim before it: body-sm in a secondary ink. The default.
   *   example  the worked example a set is walked through — F's scene above the steps (§ 3.3). It
   *            leads the body track rather than trailing a claim, so it takes a voice: body-lg in
   *            the surface's ink, a blue key, and a blue rule down its start edge (a mark, not a
   *            box — nothing closes the other three sides). As a footnote-quiet note it read as a
   *            caption floating above the steps.
   *   band     the note IS a band's whole body, beside the band's own heading (the contact page's
   *            confidentiality boundary; owner, 31 Oct 2026: "something is off about this"). Set as a
   *            footnote — body-sm in the secondary ink under a grey glyph — the band's one statement
   *            read as disabled text. It takes the body role in the surface's full ink, and its
   *            glyph the accent.
   */
  tone?: CalloutTone;
  /**
   * A glyph that heads the note (an `Icon`, composed by the caller): glyph, then key, then sentence,
   * each on its own row, as an icon heads its card. For a note that stands as its own band (the
   * contact page's confidentiality boundary, review 29 Oct), where a muted sentence alone made a
   * third text band in a row. The note sizes nothing; the caller picks the glyph and its size.
   */
  icon?: ReactNode;
};

export type CalloutTone = 'note' | 'example' | 'band';

/**
 * Callout — a quiet boundary on the claim immediately before it.
 *
 * The wrapper supplies the note semantic and nothing visual beyond the fixed quiet text role.
 * It paints no ground or edge, sets no outer spacing and takes no surface prop; the nearest
 * Section supplies the palette and the parent Layout supplies the seam. Prose remains the one
 * place that renders and styles trusted rich text.
 *
 * With a `label`, a mono key sits above the sentence, 8 apart (`Layout rowGap="tight"`). The key
 * tells a scope note from a caption at a glance, which ink and size alone did not (tracker 2.17);
 * it went from beside the sentence to above it on 30 Sep 2026, because a key and a sentence set
 * side by side read as two columns of one thing.
 */
export function Callout({ html, label, tone = 'note', icon }: CalloutProps) {
  if (html.trim().length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Callout: html must contain visible content; rendering nothing.');
    }
    return null;
  }

  const keyText = label?.trim();
  const root = cx(
    styles.root,
    tone === 'example' && styles.example,
    tone === 'band' && styles.band,
  );

  const glyph = icon ? (
    <span className={styles.glyph} aria-hidden="true">
      {icon}
    </span>
  ) : null;

  if (!keyText) {
    return (
      <div role="note" className={root}>
        {glyph ? (
          <Layout rowGap="block">
            {glyph}
            <Prose html={html} className={styles.content} />
          </Layout>
        ) : (
          <Prose html={html} className={styles.content} />
        )}
      </div>
    );
  }

  /* The key sits ABOVE the sentence, never beside it (owner, 30 Sep 2026): two lines of text set
     left and right read as two columns of one thing. The 8 seam is the key's bind to what it keys;
     a glyph heads both, a `block` above them. */
  const keyed = (
    <Layout rowGap="tight">
      <span className={styles.label}>{keyText}</span>
      <Prose html={html} className={styles.content} />
    </Layout>
  );
  return (
    <div role="note" className={root}>
      {glyph ? (
        <Layout rowGap="block">
          {glyph}
          {keyed}
        </Layout>
      ) : (
        keyed
      )}
    </div>
  );
}
