import type { ReactNode } from 'react';

import {
  ClientMark,
  Cluster,
  Layout,
  Media,
  Section,
  type ClientMarkProps,
  type MediaImage,
  type SectionSurface,
} from '@/components';
import { cx } from '@/lib/cx';

import styles from './Reasons.module.css';

/** A figure set from a reason's own sentence: the fact large, what it belongs to under it. */
export type ReasonsFigure = {
  /** The fact as the owner set it from the sentence ("3 years", "Live since late 2025"). */
  value: string;
  /** Whose it is ("Primelis"). Mono label voice; pass it as authored. */
  label?: string;
};

/**
 * A client in a reason's mark cluster: its approved mark (ClientMark's own record, density included),
 * or, for a client with no approved mark, its NAME, typeset as a wordmark in the marks' ink — never
 * an invented mark (ch05 §10).
 */
export type ReasonsMark =
  Omit<ClientMarkProps, 'className'> | { name: string; src?: undefined };

/**
 * A reason's EVIDENCE as its visual, in place of a drawing (owner, 29 Oct 2026, home's "A product design
 * partner for ambitious SaaS teams"; decisions/2026-10-29-home-reasons-show-their-proof). Each is set
 * from what the reason's own sentence names; the sentence still renders in full under the title.
 *
 *   marks    the named clients' marks as a small cluster, two across
 *   cover    the case's own cover filling the plate, a caption strip under it (status dot + the fact)
 *   figures  two to four entries, one under the other: whose (a wordmark) over what (a mono label)
 *
 * Every proof sits on one plate of one size (--rsn-proof-height), its ground the set's, the title
 * under the plate's edge; the words never go inside it. No accent figure.
 */
export type ReasonsProof =
  | { kind: 'marks'; marks: readonly ReasonsMark[] }
  | { kind: 'cover'; image: MediaImage; figure?: ReasonsFigure }
  | { kind: 'figures'; figures: readonly ReasonsFigure[] };

/** One reason: the claim in the reader's words, the sentence that argues it, and its drawing. */
export type ReasonsItem = {
  /** The claim in about five words ("Senior people, start to finish"). */
  title: string;
  /** One sentence that argues it, about fourteen words. Plain text, or inline content the caller
   *  renders (a link to the service an engagement hands on to). */
  body: ReactNode;
  /**
   * The drawing of the claim: an isometric figure from the ch05 §4a kit, facing left toward its
   * words, exported on the band's ground (`.paper.svg` on paper, `.paper-deep.svg` on tint). It
   * illustrates the sentence and carries no data, so it is decorative: `alt` is empty, because the
   * title and body beside it already say everything it shows. Give a reason a `figure` or a `proof`.
   */
  figure?: MediaImage;
  /**
   * The reason's evidence set as its visual, in place of a drawing: where the sentence names checkable
   * proof (clients, a live case, tenures), the proof is the picture. Every item of a set takes the
   * same kind of visual, figures or proofs, and the proofs share one box height so the row reads
   * level. It restates the sentence below it, so it is hidden from assistive technology.
   */
  proof?: ReasonsProof;
};

/**
 * How the set is held together (owner, 16 Oct 2026, why-us mocks rounds 3–4). One item shape — the
 * drawing above, then the title, then the body, at the full width of its track (owner, 29 Oct 2026;
 * decisions/2026-10-29-set-reasons-head-above-drawing-above) — and two ways of ordering the set without
 * making it read as boxed cards. The head always reads across the top with the items below. Four
 * reasons (the shape since 22 Oct 2026) go two across: a 2×2.
 *
 *   open    no rules at all: the gap scale alone draws the grid, `column` (64) between columns and
 *           rows — the row seam of a borderless set, and between columns because each reason is a
 *           peer that must read as separate. (Mock S1.)
 *   boxed   LogoGrid's closed frame: the cells are ruled between, the whole set sits in one rounded
 *           box, and each cell holds its drawing and words at the gutter inset. The frame makes four
 *           different reasons read as one set of equals, as it does for nine marks. (Mock C2a.)
 *
 *   beside  words only (owner, 30 Oct 2026; decisions/2026-10-30-home-reasons-beside-words-only):
 *           the head (eyebrow, heading, lead, action) in a leading track, 5 : 7 from 1024, and the
 *           reasons read down the trailing one, title over sentence, a `stack` (48) apart. Two kinds
 *           of thing side by side, so a `section` (96) split. No rules, no drawing, no proof: for a set
 *           whose sentences already carry the evidence (home's "A product design partner…"), where a
 *           picture or a figure pulled out of the sentence says less than the sentence. Below 1024 it
 *           is one column, the head above. Any `figure` or `proof` passed is not drawn.
 *
 * The 29 Oct `beside` (the head in a leading third, hairlines between the columns) stays retired.
 */
export type ReasonsArrangement = 'open' | 'boxed' | 'beside';

export type ReasonsProps = {
  /** The band's anchor. */
  id?: string;
  /** A short label above the heading ("Why Tcules"). Mono, uppercase in presentation only. */
  eyebrow?: string;
  /** The claim the band makes: the h2, the band's accessible name with `headingTail`. */
  heading: string;
  /**
   * The heading's second clause, set in the same h2 and stepped back in ink, so the claim leads and
   * its gloss follows in one sentence ("A studio built for what ships." + "Four reasons teams stay.").
   * Optional; part of the accessible name, so it must read on from `heading`.
   */
  headingTail?: string;
  headingId: string;
  /**
   * The sentence that frames the set, under the heading at the lead role (component-map C1: Why
   * Tcules and How we work together both open on one: "Bring what you have: an idea, a prototype…").
   * A string, or inline content the caller renders (a link inside it). It reads under the heading
   * across the top.
   */
  lead?: ReactNode;
  /**
   * Built for four, set 2×2 (owner, 22 Oct 2026). Three and six are still accepted: they fill whole
   * rows at three across. Any other count leaves a hole and warns in development.
   */
  items: readonly ReasonsItem[];
  /** One way to go deeper, composed by the caller: in practice a link `Button` with an arrow. */
  action?: ReactNode;
  /**
   * A closing note under the set, in the band (the limit on an offer: "We are at our best when there is
   * real thinking to do…", product-design Ways to work with us, owner 26 Oct 2026). A slot.
   */
  note?: ReactNode;
  /** Default `open`. See `ReasonsArrangement`. */
  arrangement?: ReasonsArrangement;
  /**
   * Default `paper`. Paper or tint only: the drawings are exported on those two grounds, and a
   * figure's occluding faces are its ground's own colour (§4a), so on ink or blue they would show as
   * light patches. Pass figures exported on the matching ground.
   */
  surface?: Extract<SectionSurface, 'paper' | 'tint'>;
  /**
   * The drawing's scale. `sm` (default) is the 2×2 fold set's, 140 tall (home). `lg` is band scale,
   * 256 tall (200 below 768), for offer pages: the set sets one drawn illustration per reason, a size
   * that matches the retired proof plate so the row keeps its height. No plate, no ground: an
   * illustration is never boxed (ch05 §4a).
   */
  figureSize?: 'sm' | 'lg';
};

/** The drawing's rendered width: its box is --rsn-figure-height tall at the set's widest ratio (6:5),
 *  so 168 at the 140 step. */
const FIGURE_SIZES = '170px';

/** The `lg` drawing's rendered width: 256 tall at the set's widest ratio (6:5), ~310 at most. */
const FIGURE_SIZES_LG = '(min-width: 1024px) 310px, 100vw';

/** The case cover's rendered width: the plate's full width, ~400 at most. */
const COVER_SIZES = '(min-width: 1024px) 400px, 100vw';

/** A reason's proof on its plate: one fixed-size ground for the set (never a container for the words).
 *  Marks and figures centre in it; the cover fills it from the top over a caption strip. */
function Proof({ proof, flat }: { proof: ReasonsProof; flat: boolean }) {
  if (proof.kind === 'cover') {
    return (
      <div className={cx(styles.proof, flat && styles.proofFlat)} aria-hidden="true">
        <Layout fillFirst className={styles.proofFill}>
          <div className={styles.cover}>
            <Media
              image={{ ...proof.image, alt: '' }}
              sizes={COVER_SIZES}
              fit="fill"
              edge="placement"
            />
          </div>
          {proof.figure ? (
            <div className={styles.caption}>
              <Cluster colGap="tight" justify="between" align="center" nowrap>
                <Cluster colGap="tight" align="center" nowrap>
                  <span className={styles.status} />
                  <span className={styles.captionValue}>{proof.figure.value}</span>
                </Cluster>
                {proof.figure.label ? (
                  <span className={cx(styles.proofLabel, styles.captionLabel)}>
                    {proof.figure.label}
                  </span>
                ) : null}
              </Cluster>
            </div>
          ) : null}
        </Layout>
      </div>
    );
  }
  const only =
    proof.kind === 'figures' && proof.figures.length === 1 ? proof.figures[0] : undefined;
  const count = only ? /^(\d[\d,.]*)\s+(.+)$/.exec(only.value) : null;
  const stat =
    only && count ? { number: count[1], unit: count[2], label: only.label } : undefined;
  const inner =
    proof.kind === 'marks' ? (
      <Layout
        columns={{ base: [1, 1] }}
        colGap="gutter"
        rowGap="stack"
        align="center"
        justifyItems="center"
      >
        {proof.marks.map((mark) =>
          mark.src ? (
            <ClientMark key={mark.name} {...mark} />
          ) : (
            <span key={mark.name} className={styles.wordmark}>
              {mark.name}
            </span>
          ),
        )}
      </Layout>
    ) : stat ? (
      /* One tenure that is a count ("3 years"): the figures treatment, the number large and what it
         counts with whose it is small under it, so the plate reads as a set figure, never as an
         image that failed to load (round 5 critic, 30 Oct 2026). */
      <Layout rowGap="tight" justifyItems="center" className={styles.entry}>
        <p className={styles.stat}>{stat.number}</p>
        <p className={styles.proofLabel}>
          {stat.unit}
          {stat.label ? ` · ${stat.label}` : null}
        </p>
      </Layout>
    ) : (
      <Layout rowGap="text" justifyItems="center">
        {proof.figures.map((figure) => (
          <Layout
            key={`${figure.value}-${figure.label ?? ''}`}
            rowGap="inline"
            justifyItems="center"
            className={styles.entry}
          >
            {figure.label ? <p className={styles.wordmark}>{figure.label}</p> : null}
            <p className={styles.proofLabel}>{figure.value}</p>
          </Layout>
        ))}
      </Layout>
    );
  return (
    <div
      className={cx(styles.proof, styles.proofInset, flat && styles.proofFlat)}
      aria-hidden="true"
    >
      <Layout fillFirst align="center" className={styles.proofFill}>
        {inner}
      </Layout>
    </div>
  );
}

/** The drawing anchored at its box's start, so a figure narrower than the box begins on the same
 *  edge as its title and body. */
const FIGURE_START = { x: 0, y: 0.5 } as const;

/**
 * Reasons — why a buyer should choose the studio, as argued reasons each with a drawing of its claim
 * (why-us, owner 16 Oct 2026). The band fits one fold at 1440 with four reasons in every arrangement.
 *
 * The reasons are not cards: nobody clicks or compares them, so no arrangement frames one on its
 * own. `open` uses no line, and `boxed` frames the SET (LogoGrid's device), never a reason.
 *
 * Each item is one Layout, one track: the drawing heads its words, then the title and the body at
 * the track's full width (owner, 29 Oct 2026). Beside its words the drawing left the text a narrow
 * column that wrapped a short title onto three lines.
 *
 * The action sits at the end of the heading's row from 1024, vertically centred on the heading, the
 * lead under that row and the eyebrow on its own line above (owner, 29 Oct 2026;
 * decisions/2026-10-29-head-end-action-centred-on-heading; ContentSection `actionsAt="end"`).
 */
export function Reasons({
  id,
  eyebrow,
  heading,
  headingTail,
  headingId,
  lead,
  items,
  action,
  note,
  arrangement = 'open',
  surface = 'paper',
  figureSize = 'sm',
}: ReasonsProps) {
  const shown = items.filter((item) => item.title.trim().length > 0);
  if (process.env.NODE_ENV !== 'production' && ![3, 4, 5, 6].includes(shown.length)) {
    console.warn(
      `Reasons: ${shown.length} reasons; the set is built for four (or three, five or six), which fill whole rows.`,
    );
  }

  /* Four is two across wherever the set has more than one column: a 2×2, never a 3 + 1. Five, open,
     is the standard three-track grid, 3 + 2 (owner, 31 Oct 2026, About's difference). */
  const four = shown.length === 4;
  const five = shown.length === 5;

  const eyebrowEl = eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null;
  const headingEl = (
    <h2 id={headingId} className={styles.heading}>
      {heading}
      {headingTail ? (
        <>
          {' '}
          <span className={styles.headingTail}>{headingTail}</span>
        </>
      ) : null}
    </h2>
  );
  const leadEl =
    typeof lead === 'string' ? (
      <p className={styles.lead}>{lead}</p>
    ) : lead ? (
      <div className={styles.lead}>{lead}</div>
    ) : null;

  /* The head: eyebrow → heading → lead at `block`. With an action, the eyebrow keeps its own line and
     the heading and the action share one row from 1024, centred on each other, `column` (64) apart,
     the lead under that row in the heading's track. Below 1024 one track: heading, lead, then the
     actions after the copy (round 5 critic, 30 Oct 2026: at 390 the pair stood above the lead), each
     a `block` apart. */
  const head = action ? (
    <Layout rowGap="block">
      {eyebrowEl}
      <Layout columns={{ lg: [1, 'auto'] }} colGap="column" rowGap="block" align="center">
        {headingEl}
        {leadEl}
        <div className={styles.headAction}>{action}</div>
      </Layout>
    </Layout>
  ) : (
    <Layout rowGap="block">
      {eyebrowEl}
      {headingEl}
      {leadEl}
    </Layout>
  );

  if (arrangement === 'beside') {
    if (process.env.NODE_ENV !== 'production' && shown.some((i) => i.figure || i.proof)) {
      console.warn(
        'Reasons: `beside` sets words only; the figures and proofs passed are not drawn.',
      );
    }
    return (
      <Section id={id} surface={surface} aria-labelledby={headingId} data-band="reasons">
        <Layout rowGap="stack">
          <Layout columns={{ base: 1, lg: [5, 7] }} colGap="section" rowGap="stack">
            {/* The head track: eyebrow → heading → lead at `block`, the action a `stack` under the lead. */}
            <Layout rowGap="stack" justifyItems="start">
              <Layout rowGap="block">
                {eyebrowEl}
                {headingEl}
                {leadEl}
              </Layout>
              {action}
            </Layout>
            <Layout as="ul" rowGap="stack">
              {shown.map((item, index) => (
                <li key={`${index}-${item.title}`} className={styles.item}>
                  <Layout rowGap="tight">
                    <h3 className={cx(styles.title, styles.titleBeside)}>{item.title}</h3>
                    <p className={styles.body}>{item.body}</p>
                  </Layout>
                </li>
              ))}
            </Layout>
          </Layout>
          {note}
        </Layout>
      </Section>
    );
  }

  const open = arrangement === 'open';
  // A set whose covers carry no figure (offer pages) sizes its plate to the cover: 16:9, no caption strip.
  const flatProofs =
    items.some((i) => i.proof?.kind === 'cover') &&
    !items.some((i) => i.proof?.kind === 'cover' && i.proof.figure);
  const allProof = shown.length > 0 && shown.every((i) => i.proof);
  /* A reason's picture: its proof, else its drawing at the set's figure size. */
  const visualOf = (item: (typeof shown)[number]) =>
    item.proof ? (
      <Proof proof={item.proof} flat={flatProofs} />
    ) : item.figure ? (
      <div className={cx(styles.figure, figureSize === 'lg' && styles.figureLg)}>
        <Media
          image={{ ...item.figure, alt: '' }}
          sizes={figureSize === 'lg' ? FIGURE_SIZES_LG : FIGURE_SIZES}
          fit="contain"
          focus={FIGURE_START}
        />
      </div>
    ) : null;
  const itemNode = (item: (typeof shown)[number], index: number) => (
    <li key={`${index}-${item.title}`} className={styles.item}>
      <Layout rowGap="block" justifyItems="start">
        {visualOf(item)}
        <Layout rowGap="tight">
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.body}>{item.body}</p>
        </Layout>
      </Layout>
    </li>
  );
  const colGap = allProof ? 'gutter' : 'column';
  const set = (
    <Layout
      as="ul"
      className={cx(
        !open && styles.cells,
        !open && shown.length === 3 && styles.three,
        !open && four && styles.four,
      )}
      columns={
        open
          ? shown.length === 3
            ? { base: 1, lg: 3 }
            : five
              ? { base: 1, md: 2, lg: 3 }
              : four
                ? { base: 1, md: 2 }
                : { base: 1, md: 2, xl: 3 }
          : shown.length === 3
            ? { base: 1, xl: 3 }
            : four
              ? { base: 1, lg: 2 }
              : { base: 1, lg: 2, xl: 3 }
      }
      colGap={open ? colGap : 'none'}
      rowGap={open ? 'column' : 'none'}
    >
      {shown.map(itemNode)}
    </Layout>
  );

  const boxed = arrangement === 'boxed' ? <div className={styles.frame}>{set}</div> : set;
  const framed = note ? (
    <Layout rowGap="stack">
      {boxed}
      {note}
    </Layout>
  ) : (
    boxed
  );

  return (
    <Section id={id} surface={surface} aria-labelledby={headingId} data-band="reasons">
      <Layout rowGap="stack">
        {head}
        {framed}
      </Layout>
    </Section>
  );
}
