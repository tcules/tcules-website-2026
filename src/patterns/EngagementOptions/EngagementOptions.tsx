import type { ReactNode } from 'react';

import { Cluster, Layout, Section, Sketch, type SectionSurface } from '@/components';
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
 *   own        who decides and who owns the work: our options meet at you, the result handed to you
 * The working terms (About, "How Tcules works with clients", owner 1 Nov 2026), one each:
 *   who, communication, response, getting-started, turnaround, hours
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
  | 'commercial'
  | 'own'
  | 'who'
  | 'communication'
  | 'response'
  | 'getting-started'
  | 'turnaround'
  | 'hours';

export type EngagementTerm = {
  /** The term's paragraph, inline content the caller renders. */
  body: ReactNode;
};

/**
 * One labelled fact of an option ("How it works", "Typical starting points", "Best when"): a mono key
 * over its value, so the terms read as blocks of their own under the option's description rather than
 * as more body. `items` sets the value as a list, one entry a line (the starting points).
 */
export type EngagementFact = {
  label: string;
  body?: ReactNode;
  items?: readonly ReactNode[];
};

export type EngagementOption = {
  /**
   * What kind of engagement the option is ("A focused engagement"), set as the mono eyebrow over its
   * name. Authored case is kept; the transform is CSS (owner, 1 Nov 2026, /how-we-work).
   */
  eyebrow?: string;
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
  /** The option's terms as labelled blocks under its words, two across from 1024. */
  facts?: readonly EngagementFact[];
};

/**
 * How the options are set (owner, 11 Oct 2026).
 *   grid  image cards two by two (one column below 768): the scope drawing on its plate at 16:9 as
 *         each card's image, then the name and what it is. THE BAND (product design).
 *   compare  the options three across, then each fact as one ruled row, its values aligned under
 *         their option (owner, 1 Nov 2026, /how-we-work). Below 1024, `rows`.
 *   rows  one alternating row per option, the drawing in 5 of [5, 7] beside its words, sides
 *         swapping row by row. Explored: roomier, but four rows run to about two folds (1,551 at
 *         1440).
 */
export type EngagementArrangement = 'grid' | 'rows' | 'compare';

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
   * What holds for the whole set, with its proof (owner, 1 Nov 2026, /how-we-work: "start wherever the
   * work is" and its example): a sub-head and its sentence, the proof composed by the caller under it (a
   * case teaser), a `column` under the options. Part of the band, never an ask: an example is evidence.
   */
  closing?: { heading: string; lead: ReactNode; proof?: ReactNode };
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
  closing,
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
                      <OptionHead
                        option={option}
                        className={cx(styles.title, dense && styles.titleDense)}
                      />
                      <OptionBody
                        option={option}
                        className={cx(styles.body, dense && styles.bodyDense)}
                      />
                      {option.facts && option.facts.length > 0 ? (
                        <Facts facts={option.facts} />
                      ) : null}
                    </Layout>
                  </Layout>
                );
                return <li key={option.title}>{card}</li>;
              })}
            </Layout>
          ) : arrangement === 'compare' ? (
            <>
              {/* From 1024: the options head the set three across, then each fact runs as one ruled
                  row, its key over the three values aligned under their option, so a read across a
                  row compares the deals (owner, 1 Nov 2026, /how-we-work). Below 1024 there is no
                  across to read: the rows arrangement, one option a section. */}
              <div className={styles.compareWide}>
                <Compare shown={shown} />
              </div>
              <div className={styles.compareNarrow}>
                <Rows shown={shown} />
              </div>
            </>
          ) : (
            <Rows shown={shown} />
          )}
          {closing ? (
            <Layout rowGap="block">
              <Layout rowGap="text">
                <h3 className={styles.closingHeading}>{closing.heading}</h3>
                <p className={styles.lead}>{closing.lead}</p>
              </Layout>
              {closing.proof}
            </Layout>
          ) : null}
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

/**
 * The option's facts as a spec sheet: one row a fact, the mono key in a narrow track and its value
 * beside it, every row on the same two tracks so the keys align down the option (owner, 1 Nov 2026,
 * round 3: two narrow columns of small text "don't look very good"). A list value runs as one wrapping
 * line, its entries parted by a middle dot. Under one rule, the facts are the option's terms.
 */
function Facts({ facts }: { facts: readonly EngagementFact[] }) {
  return (
    <Layout as="dl" rowGap="text" className={styles.facts}>
      {facts.map((fact) => (
        <Layout
          key={fact.label}
          columns={{ base: 1, md: [1, 2] }}
          colGap="gutter"
          rowGap="tight"
        >
          <dt className={styles.factKey}>{fact.label}</dt>
          <dd className={cx(styles.body, styles.factValue)}>
            {fact.items ? (
              <Cluster as="ul" colGap="tight" rowGap="inline" className={styles.factItems}>
                {fact.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </Cluster>
            ) : (
              fact.body
            )}
          </dd>
        </Layout>
      ))}
    </Layout>
  );
}

/** One row per option, the drawing beside its words, sides swapping row by row. */
function Rows({ shown }: { shown: readonly EngagementOption[] }) {
  return (
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
              <OptionHead option={option} className={styles.title} />
              <OptionBody option={option} className={cx(styles.body, styles.bodyRows)} />
              {option.facts && option.facts.length > 0 ? <Facts facts={option.facts} /> : null}
            </Layout>
          </Layout>
        </li>
      ))}
    </Layout>
  );
}

/** The labels a fact row carries: each option's label at that row, distinct, in option order. */
function rowLabel(shown: readonly EngagementOption[], index: number): string {
  return [
    ...new Set(shown.flatMap((o) => (o.facts?.[index] ? [o.facts[index].label] : []))),
  ].join(' / ');
}

/** The comparison: the heads three across, then one ruled row a fact. */
function Compare({ shown }: { shown: readonly EngagementOption[] }) {
  const rows = Math.max(0, ...shown.map((o) => o.facts?.length ?? 0));
  const tracks = { base: 1, lg: shown.length as 2 | 3 | 4 } as const;
  return (
    <Layout rowGap="stack">
      <Layout as="ul" columns={tracks} colGap="gutter" rowGap="column">
        {shown.map((option) => (
          <li key={option.title}>
            <Layout rowGap="block">
              {option.scope ? <Drawing scope={option.scope} /> : <Sketch />}
              <Layout rowGap="text">
                <OptionHead option={option} className={styles.title} />
                <OptionBody option={option} className={styles.body} />
              </Layout>
            </Layout>
          </li>
        ))}
      </Layout>
      {Array.from({ length: rows }, (_, index) => (
        <Layout key={index} rowGap="block" className={styles.compareRow}>
          <p className={styles.factKey}>{rowLabel(shown, index)}</p>
          <Layout columns={tracks} colGap="gutter" rowGap="block">
            {shown.map((option) => {
              const fact = option.facts?.[index];
              return (
                <div key={option.title} className={cx(styles.body, styles.factValue)}>
                  {fact?.items ? (
                    <Layout as="ul" rowGap="tight">
                      {fact.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </Layout>
                  ) : (
                    fact?.body
                  )}
                </div>
              );
            })}
          </Layout>
        </Layout>
      ))}
    </Layout>
  );
}

/** The option's name, with its eyebrow over it a `tight` step when it has one. */
function OptionHead({ option, className }: { option: EngagementOption; className?: string }) {
  const title = <h3 className={className}>{option.title}</h3>;
  if (!option.eyebrow) return title;
  return (
    <Layout rowGap="tight">
      <p className={styles.eyebrow}>{option.eyebrow}</p>
      {title}
    </Layout>
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
