import { Button, Cluster, Icon, Layout } from '@/components';
import { cx } from '@/lib/cx';
import { leavesSite } from '@/lib/href';

import styles from './CtaRow.module.css';

/** One action. `href` comes from `@/lib/routes` at the call site, never written out there. */
export type CtaRowAction = {
  label: string;
  href: string;
};

/**
 * Where the row sits in its box.
 *
 *   start   note at the start and actions at the end ("between") when there is a note; the actions
 *           at the start when there is not. Every left-weighted band.
 *   center  note and actions centred, and the whole row — rule included — capped at the body
 *           measure, for a band under a centred head (D-faq, S, G typographic: § 3.5). The band
 *           centres the capped row as a block; the row centres its own content.
 */
export type CtaRowAlign = 'start' | 'center';

type CtaRowCommon = {
  /**
   * One sentence before the actions — what the action is FOR ("Every engagement starts with a
   * thirty-minute call."). Body-sm, the row's small voice. Absent renders no element; a
   * whitespace-only string is treated as absent.
   */
  note?: string;
  /**
   * The hairline above the row. Default `true`: a section-level CtaRow — a band's `footer` — takes
   * one (§ 3.1 item 5), because it marks where the body ends and the ask begins. `false` for a row
   * in a HEAD (ContentSection's `actions`), which sits a `stack` under the lead and has no body above
   * it to close off; a rule there would read as an underline on the lead. And `false` under a
   * RULED LADDER — an Accordion, a set of ListCard rows, a DataTable — whose last rule already closes
   * the body: a second hairline a `stack` under the first reads as a double rule, not as an edge.
   * And `false` for a FOOTER IN A BAND WITH NO BLOCKS (a footer-only band, a media split that is a
   * head and its ask): there is no body for the rule to close, so it sits a `stack` under the lead
   * and reads as the same underline. The row cannot see what is above it, so the placing caller
   * states it; ContentSection's `footer` doc says so.
   */
  rule?: boolean;
  /** Default `start`. See `CtaRowAlign`. */
  align?: CtaRowAlign;
};

export type CtaRowProps = CtaRowCommon & {
  /**
   * ONE action, rendered as the blue link button with the trailing arrow (the kit's link cue).
   *
   * A CtaRow is always in-band — under a card set, a read-down, a quote, an FAQ, in a head's actions
   * slot — and an in-band action is a LINK (r7-buttons, owner 7 Oct 2026 as corrected 8 Oct): the
   * blue solid is the page's one main action and belongs to the hero (PageHero) and the bottom
   * close (CtaSection), never to a band's foot. "Start with a UX Product Audit" inside a band is a
   * link, not a button. Never two links side by side: two actions of the same emphasis, which a
   * group never is. The tuple makes that a type.
   *
   * A PAIR is one action and its quieter second, in one row (owner, 29 Oct 2026;
   * decisions/2026-10-29-banner-two-actions-one-row): the first a labelled `outline` Button, the
   * second the link. A Banner's "Meet the studio" and "Careers at Tcules". Never a solid: the blue
   * solid stays the page's one main action.
   *
   * Until r7-buttons the row also took `emphasis="solid"` (a solid, blue when it `converts` and ink
   * when not, with a ghost partner). Both props are gone: there is no in-band solid to render.
   */
  actions: readonly [CtaRowAction] | readonly [CtaRowAction, CtaRowAction];
};

/**
 * CtaRow — a band's row of actions, built to docs/specs/CtaRow.md (fdn-section-head, 6 Oct 2026).
 *
 * The section-level CTA the kit needs in four families (visual-direction § 1.4): under a card set,
 * under a read-down, under a quote, under an FAQ, at the foot of a media split's copy column — and,
 * with the rule off, in a section head's actions slot. Before it, each of those would have been a
 * Cluster of Buttons written at the call site, each with its own guess at emphasis, glyph and gap.
 *
 *   ┌───────────────────────────────────────────── rule (hairline, neutral) ─┐
 *   │                              block (24)                                │
 *   │ note (body-sm, ≤ 56ch)         between                         LINK → │
 *   └────────────────────────────────────────────────────────────────────────┘
 *
 * § 1.4 budgets it at "48 seam + one 48 row": the band supplies the 48 above it (its `footer` is a
 * `stack` under the body), and the row is the 1px rule, the 24 `block` step and a link label line
 * of about 22 — 47.
 *
 * Distances, every one a gap-scale step and none of them responsive:
 *   rule → row        block (24)   head to body inside a block: the rule is the row's head
 *   note ↔ action     block (24) across and when they wrap — at 326 the note wraps above the
 *                                  link, and 16 there sat the mono label tight under body-sm
 *                                  (fix round, 6 Oct: the owner rules spacing is never cramped)
 *
 * It contributes the rule and the note only. `Button` owns every interactive value and state,
 * `Cluster` and `Layout` every seam, the band its ground. No `'use client'`, no state, no ref.
 *
 * A pattern for the usual two reasons: it consumes a content shape (`{ label, href }`) and it
 * composes Button, Icon, Cluster and Layout. It is placed by a band — ContentSection's `footer` or
 * `actions`, or a template's own row — and never imports one.
 */
export function CtaRow(props: CtaRowProps) {
  const { actions, note, rule = true, align = 'start' } = props;
  const centred = align === 'center';
  /* Whitespace-only is absent, so a bad record cannot put an empty paragraph in front of the
     actions and turn a start row into a "between" row around nothing. */
  const hasNote = Boolean(note?.trim());
  const [action, second] = actions;

  /* The link: blue, trailing arrow — the link cue. An anchor, because it navigates. The label line
     is ~22 tall; the touch floor is 44, so the hit area is extended past it. */
  const linkTo = (to: CtaRowAction) => (
    <Button
      as="a"
      href={to.href}
      emphasis="link"
      size="md"
      extendHitArea
      icon={<Icon name={leavesSite(to.href) ? 'arrow-right-up' : 'arrow-right'} />}
    >
      {to.label}
    </Button>
  );
  /* A pair: the first an outlined button, the second the link, `block` apart in one row (a
     Cluster, so a narrow column wraps the link under the button rather than off the page). */
  const link = second ? (
    <Cluster colGap="block" rowGap="text" align="center">
      <Button as="a" href={action.href} emphasis="outline" size="md">
        {action.label}
      </Button>
      {linkTo(second)}
    </Cluster>
  ) : (
    linkTo(action)
  );

  return (
    <Layout rowGap="block" className={centred ? styles.centredBox : undefined}>
      {rule ? <div className={styles.rule} /> : null}
      {/* `between` only when there is a note to sit opposite the actions: a lone action at the far
          end of a 1240 row reads as stranded, so without a note the link starts the row. Centred
          rows centre everything. `center` on the cross axis, so the link's label sits on the
          note's line. */}
      <Cluster
        colGap="block"
        rowGap="block"
        align="center"
        justify={centred ? 'center' : hasNote ? 'between' : 'start'}
      >
        {hasNote ? <p className={cx(styles.note, centred && styles.centred)}>{note}</p> : null}
        {link}
      </Cluster>
    </Layout>
  );
}
