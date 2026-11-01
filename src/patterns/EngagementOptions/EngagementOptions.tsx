import type { ReactNode } from 'react';

import { Layout, Section, Sketch, type SectionSurface } from '@/components';
import { cx } from '@/lib/cx';

import styles from './EngagementOptions.module.css';

/**
 * What an option's scope drawing shows. Each draws only what the option's name says:
 *   feature   one workflow: a single line through three screens
 *   area      a product area or a whole product: a region holding several workflows
 *   embedded  a designer in your team: one blue node among your team's
 *   build     design and build: a drawn region becoming a built one
 * How an engagement runs (about, "How Tcules works", owner 11 Oct 2026):
 *   start      start where the uncertainty is: the first node lit, the rest of the path optional
 *   direct     work directly with the people doing the work: our node joined to each of theirs
 *   inside     work inside the client's product environment: our workflow inside their window
 *   overlap    across time zones: two working days, the overlap between them marked
 *   commercial the commercial shape follows the work: a fixed piece, a defined project, a monthly run
 */
export type EngagementScope =
  | 'feature'
  | 'area'
  | 'embedded'
  | 'build'
  | 'start'
  | 'direct'
  | 'inside'
  | 'overlap'
  | 'commercial';

export type EngagementTerm = {
  /** The term's paragraph, inline content the caller renders. */
  body: ReactNode;
};

export type EngagementOption = {
  /** The option's name as authored, its full stop kept ("A designer in your team."). */
  title: string;
  /** What it is: plain text, or inline content the caller renders (a link to the team that builds). */
  body: ReactNode;
  /**
   * The paragraphs after the first, when the option is told in several (how it works, where it
   * starts: /how-we-work's engagement shapes). Each its own paragraph under `body`, at the same size.
   */
  more?: readonly ReactNode[];
  /** The scope drawing. Absent, the option shows its words alone. */
  scope?: EngagementScope;
};

/**
 * How the options are set (owner, 11 Oct 2026).
 *   grid  image cards two by two (one column below 768): the scope drawing on its plate at 16:9 as
 *         each card's image, then the name and what it is. THE BAND (product design).
 *   rows  one alternating row per option, the drawing in 5 of [5, 7] beside its words, sides
 *         swapping row by row. Explored: roomier, but four rows run to about two folds (1,551 at
 *         1440).
 */
export type EngagementArrangement = 'grid' | 'rows';

export type EngagementOptionsProps = {
  /** The band's anchor. */
  id?: string;
  /** The h2, the band's accessible name. */
  heading: string;
  headingId: string;
  /**
   * The band's lead: one paragraph, or several stacked a `text` apart in the lead's column (the
   * page's own opening line, then the shared "Bring what you have…", owner 29 Oct 2026). Each entry
   * is one paragraph's inline content, the caller's links kept.
   */
  lead?: string | readonly ReactNode[];
  /**
   * Two to five options, peers: none is featured (a featured option reads as a recommendation). Five
   * set five across from 1440 (three from 1024) at the denser card steps, h5 over body-sm.
   */
  options: readonly EngagementOption[];
  /** The limit on the claim, composed by the caller: in practice a `Callout`. A `stack` under the row. */
  note?: ReactNode;
  /**
   * Terms that hold for every option, one plain text row at body size under the set, on the options'
   * column grid from 1024 (tracks 1, 2 …), a `column` below the set; no plates, drawings, lines or nodes
   * (decisions/2026-10-30-engagement-terms-plain-row).
   */
  terms?: readonly EngagementTerm[];
  /**
   * The band's own way deeper ("How we work together →"), composed by the caller: in practice a
   * single-link `CtaRow`. It is the head's end action (owner, 29 Oct 2026;
   * decisions/2026-10-29-how-we-work-together-link-in-head): at the inline end of the heading's
   * row from 1024, vertically centred on the heading, a `column` (64) from it, the lead under that
   * row; below 1024 a `block` under the heading. One action only: two links at the heading's end
   * floated away from the words (decisions/2026-10-29-how-we-work-together-band).
   */
  action?: ReactNode;
  /** Default `paper`. */
  surface?: SectionSurface;
  /** Default `grid`. See `EngagementArrangement`. */
  arrangement?: EngagementArrangement;
};

/** The scope's drawing: a kit scene, on its plate, in the grammar every flat drawing shares. */
function Drawing({ scope }: { scope: EngagementScope }) {
  return <Sketch name={`scope-${scope}`} />;
}

/**
 * EngagementOptions — the ways an engagement can be shaped, comparable at a glance (product-design
 * round 6, 11 Oct 2026; page-mapping § 23).
 *
 * The reader is choosing a shape for their own project, so the options are genuinely comparable
 * objects: peers, set as image cards two by two (owner, 11 Oct: four across was too tight, the
 * alternating rows ran to two folds — "what about 4 image cards in a 2x2 grid?"). See
 * `EngagementArrangement`. The drawings are what make them
 * comparable before reading: the same plate, a different scene for each scope, drawn by Sketch. The limit on the
 * claim (when we are not the right team) closes the band as a note, a `stack` under the row.
 *
 * Not a Thread: the options are not stages in order. Not icon cards: the specialist services band
 * on the same page already is one, and a glyph cannot show scope. No boxes round the card, no discs:
 * the plate is the card's image, as a photograph would be.
 */
export function EngagementOptions({
  id,
  heading,
  headingId,
  lead,
  options,
  note,
  terms = [],
  action,
  surface = 'paper',
  arrangement = 'grid',
}: EngagementOptionsProps) {
  const shown = options.filter((option) => option.title.trim().length > 0);
  /* Five options: five across from 1440 at the denser card steps. */
  const dense = shown.length >= 5;
  const anyDrawn = shown.some((option) => option.scope);
  /* Three options take three tracks from 768, so no track is left open (owner, 29 Oct 2026). */
  const three = shown.length === 3;
  /* The terms sit on the options' own track count from 1024. */
  const termTracks = three || dense ? 3 : 4;
  const leads = lead === undefined ? [] : typeof lead === 'string' ? [lead] : lead;
  /* Six take three tracks, 3 + 3: five across would leave the sixth alone on its row (About's
     working terms, 31 Oct 2026). */
  const six = shown.length === 6;
  const optionTracks = six
    ? ({ base: 1, md: 2, lg: 3 } as const)
    : dense
      ? ({ base: 1, md: 2, lg: 3, xl: 5 } as const)
      : three
        ? ({ base: 1, md: 3 } as const)
        : ({ base: 1, md: 2, lg: 4 } as const);
  return (
    <Section
      id={id}
      surface={surface}
      aria-labelledby={headingId}
      data-band="engagement-options"
    >
      <Layout rowGap="stack">
        {/* The head: the heading, the action at its end from 1024 centred on it (ContentSection
            `actionsAt="end"`, the one rule for every head's end action), the lead under that row. */}
        <Layout
          columns={action ? { lg: [1, 'auto'] } : undefined}
          colGap={action ? 'column' : undefined}
          rowGap="block"
          align={action ? 'center' : undefined}
        >
          <h2 id={headingId} className={styles.heading}>
            {heading}
          </h2>
          {action ? <div>{action}</div> : null}
          {leads.length > 0 ? (
            <Layout rowGap="text">
              {leads.map((paragraph, index) => (
                <p key={index} className={styles.lead}>
                  {paragraph}
                </p>
              ))}
            </Layout>
          ) : null}
        </Layout>
        <Layout rowGap="column">
          {arrangement === 'grid' ? (
            /* Image cards, four across from 1024 (owner, 11 Oct: "make it 4x1"), two by two from 768, one
               column below: a borderless tile each (the drawing's plate is the image, the
               name and its words under it), 32 across and a `column` down the set — the row seam of
               every borderless card set. */
            <Layout as="ul" columns={optionTracks} colGap="gutter" rowGap="column">
              {shown.map((option) => {
                const card = (
                  <Layout rowGap="block">
                    {option.scope ? (
                      <Drawing scope={option.scope} />
                    ) : anyDrawn ? (
                      /* Not drawn yet, in a set that is: the empty plate holds its place. */
                      <Sketch />
                    ) : null}
                    <Layout rowGap="text">
                      <h3 className={cx(styles.title, dense && styles.titleDense)}>
                        {option.title}
                      </h3>
                      <OptionBody
                        option={option}
                        className={cx(styles.body, dense && styles.bodyDense)}
                      />
                    </Layout>
                  </Layout>
                );
                return <li key={option.title}>{card}</li>;
              })}
            </Layout>
          ) : (
            <Layout as="ul" rowGap="column">
              {shown.map((option, index) => (
                <li key={option.title}>
                  {/* One row per option, the drawing and the words side by side, swapping sides row
                      by row from 768. Below 768 the drawing heads its words, full width at 2:1:
                      beside them, the column gap left both too narrow. */}
                  <Layout
                    columns={option.scope ? { base: 1, md: [5, 7] } : { base: 1 }}
                    reverse={{ md: index % 2 === 1 }}
                    colGap="column"
                    rowGap="block"
                    align="center"
                  >
                    {option.scope ? <Drawing scope={option.scope} /> : null}
                    <Layout rowGap="block">
                      <h3 className={styles.title}>{option.title}</h3>
                      <OptionBody
                        option={option}
                        className={cx(styles.body, styles.bodyRows)}
                      />
                    </Layout>
                  </Layout>
                </li>
              ))}
            </Layout>
          )}
          {terms.length > 0 ? (
            <Layout columns={{ base: 1, lg: termTracks }} colGap="gutter" rowGap="text">
              {terms.map((term, index) => (
                <p key={index} className={styles.termText}>
                  {term.body}
                </p>
              ))}
            </Layout>
          ) : null}
        </Layout>
        {note}
      </Layout>
    </Section>
  );
}

/** An option's words: its body, then any further paragraphs, one `text` step apart. */
function OptionBody({ option, className }: { option: EngagementOption; className?: string }) {
  if (!option.more || option.more.length === 0)
    return <p className={className}>{option.body}</p>;
  return (
    <Layout rowGap="text">
      <p className={className}>{option.body}</p>
      {option.more.map((paragraph, index) => (
        <p key={index} className={className}>
          {paragraph}
        </p>
      ))}
    </Layout>
  );
}
