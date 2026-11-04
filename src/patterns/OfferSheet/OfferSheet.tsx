import type { ReactNode } from 'react';

import {
  Cluster,
  Icon,
  Layout,
  Media,
  Section,
  Sketch,
  type IconName,
  type MediaImage,
  type SectionSurface,
  type SketchName,
} from '@/components';
import { ENQUIRY_ROLE_ATTRIBUTE } from '@/lib/enquiry-pick';
import { HEAD_TRACK } from '@/lib/image-sizes';

import styles from './OfferSheet.module.css';

/** One promise: what the buyer gets, then what it means. */
export type OfferSheetItem = {
  /**
   * The promise in a few words, as authored, its full stop kept ("Complex rules, simple screens.").
   * Optional: a promise authored as one sentence with no lead of its own is a STATEMENT, set whole in
   * the body role under its drawing or rule, never promoted to the title role (review 29 Oct: four
   * 20px five-line "titles" on product-design). A set is titled throughout or not at all; the caller
   * decides, because only it knows how the items were authored.
   */
  title?: string;
  /** A stable key for the item, where it has no title (React key). */
  id?: string;
  /** The sentence that says what the promise means. Plain text. */
  body?: string;
  /** Or trusted HTML from the content seam, for a body that carries a link or emphasis. */
  bodyHtml?: string;
  /**
   * Or the body as a line of short facts, each as authored ("Design", "Full-time", "In-office,
   * Ahmedabad"): set at the body role as one wrapping row parted by middle dots, each fact kept whole
   * so a narrow track breaks BETWEEN facts, never inside one at a hyphen ("In-/office", /careers
   * critic, 4 Nov 2026).
   */
  facts?: readonly string[];
  /**
   * The promise drawn: what it changes in the product, a Sketch scene drawn for this promise
   * (owner, 26 Oct 2026, product-design page). Set on every item or on none; with all four drawn the
   * sheet is two rows of two, each drawing beside its words.
   */
  scene?: SketchName;
  /**
   * The page the promise names, when the title is authored as a link (an expertise page's "What we
   * design": "**[Care coordination platforms](/…)** that connect families with carers", component-map
   * C7). The title becomes that link; the item is still not a card, so nothing else about it moves.
   */
  href?: string;
  /**
   * With `href` to the page's own form (`#apply`): the choice that form picks when the link is
   * followed (/careers' open roles → the role chip; `ENQUIRY_ROLE_ATTRIBUTE`). The value as the form
   * posts it.
   */
  choice?: string;
  /**
   * A glyph leading the item. In `rows`, before its title on the title's first line (owner, 4 Nov
   * 2026: a row is not an icon card). In `grid`, the item's HEAD: glyph, then title, then body, each
   * on its own row (decisions/2026-10-19-icon-heads-its-card), and the item drops its hairline and
   * blue mark, which are for figures (decisions/2026-10-31-marker-cell-is-for-figures). Not with
   * drawings. Set on every item or on none; a set is all-icon or all-text.
   */
  icon?: IconName;
};

/** One of the band's terms: a title and what it says. */
export type OfferSheetTerm = { title: string; body?: string; bodyHtml?: string };

export type OfferSheetProps = {
  /** The band's anchor. */
  id?: string;
  /** "What you get": the h2, the band's accessible name. */
  heading: string;
  headingId: string;
  /**
   * The sentence that frames the offer, under the heading at the lead role ("Our digital product
   * design services cover the thinking behind your product…", component-map C4). Optional: most
   * sheets open straight on their promises.
   */
  lead?: string;
  /**
   * A label over the promises when the copy names the list ("What you receive", component-map C4):
   * set in the label voice above the first rule, so the authored words stay and the h2 stays the
   * band's one heading.
   */
  listLabel?: string;
  /**
   * The band's terms (who does the work, what we need, where our part stops): they belong to the
   * whole band, so they sit in its FOOT after one full-width hairline, unruled, side by side, a role
   * under the promises (owner, 30 Oct 2026).
   */
  terms?: readonly OfferSheetTerm[];
  /** Two to six promises. Four is the shape: two rows of two beside the aside. */
  items: readonly OfferSheetItem[];
  /**
   * The SUPPORTING voice, composed by the caller: in practice a `TestimonialCard` with `fill`, so it
   * stretches to the sheet's height and shares its top and bottom edges. A pattern does not import a
   * pattern, so the panel is a slot. Absent, the sheet takes the full column, promises two up.
   */
  aside?: ReactNode;
  /**
   * An image as the aside instead (the audit's "What you receive", owner 11 Oct 2026): it fills the
   * trailing 1 from the promises' top to their foot, cover-cropped, as the testimonial does; 16:9
   * where it stacks below 1024. Ignored when `aside` is given.
   */
  asideImage?: MediaImage;
  /** A closing line under the promises, in their column (in practice the next step). A slot. */
  note?: ReactNode;
  /**
   * Promises per row from 1024 when there is no aside: 2 (default) or 3. Five principles set two up
   * left the fifth alone on a third row; three up they read 3 + 2 (healthtech, 11 Oct 2026). 4 for
   * four short glyph-headed peers in one row (4 Nov 2026, /careers' open roles: a title and a meta
   * line each, which three up would leave one alone on a row).
   */
  across?: 2 | 3 | 4;
  /**
   * `grid` (default): the promises side by side, as above. `rows`: one promise per row, its title in a
   * label column and its words beside it from 1024, each row closed by a hairline under it, ListCard's
   * row frame, with no blue mark (the
   * clients page's "What clients have asked us to do", owner, 4 Nov 2026). For a set whose bodies run
   * to several sentences and name clients, so the words need a measure, not a third of the column. A
   * rows sheet takes no aside and no drawings.
   */
  arrangement?: 'grid' | 'rows';
  /** Default `paper`. */
  surface?: SectionSurface;
};

/**
 * OfferSheet — what the buyer gets, as ONE offer, with the client's words anchored beside it
 * (product-design round 6, 11 Oct 2026; page-mapping § 23).
 *
 * The band's job is the sentence "this is what I get when I buy this service". So the promises are
 * the primary object and read as one sheet under one heading: the h2, then the promises in the leading
 * 2 of [2, 1] from 1024, two promises a row, each opening on a hairline with a blue mark (Stat's
 * device) and its title at the h3 role. The aside — the testimonial — fills the trailing 1 from the
 * first promise's rule to the last promise's foot, so the panel and the promises share both edges
 * and the voice reads as the offer's proof rather than a second band. (Stretched from the heading's
 * top it held a quarter of its height empty between the quote and the speaker.) Below 1024 one column: heading,
 * promises (two up from 768), then the aside.
 *
 * Why not cards: the promises are not objects a reader compares or clicks. Framing each one made
 * four separate rectangles of equal weight with nothing to guide the eye (owner, round 6: "it feels
 * boring and nothing guides me eye"). Only the voice, a different kind of thing, takes a panel.
 */
export function OfferSheet({
  id,
  heading,
  headingId,
  lead,
  listLabel,
  items,
  aside,
  asideImage,
  note,
  terms,
  across = 2,
  arrangement = 'grid',
  surface = 'paper',
}: OfferSheetProps) {
  const rows = arrangement === 'rows';
  const shown = items.filter(
    (item) =>
      (item.title ?? item.body ?? item.bodyHtml ?? item.facts?.join('') ?? '').trim().length > 0,
  );
  const keyOf = (item: OfferSheetItem) => item.id ?? item.title ?? item.body ?? item.bodyHtml;
  /* The item's words under (or beside) its title: HTML, a line of facts, or plain text. */
  const bodyOf = (item: OfferSheetItem) =>
    item.bodyHtml ? (
      <p className={styles.body} dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
    ) : item.facts && item.facts.length > 0 ? (
      <Cluster as="ul" colGap="tight" rowGap="inline" className={styles.facts}>
        {item.facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </Cluster>
    ) : item.body ? (
      <p className={styles.body}>{item.body}</p>
    ) : null;
  /* The title, a link where the item names a page or the page's own form. */
  const titleOf = (item: OfferSheetItem) =>
    item.title ? (
      <h3 className={styles.title}>
        {item.href ? (
          <a
            href={item.href}
            className={styles.titleLink}
            {...(item.choice ? { [ENQUIRY_ROLE_ATTRIBUTE]: item.choice } : {})}
          >
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h3>
    ) : null;
  if (process.env.NODE_ENV !== 'production' && (shown.length < 2 || shown.length > 6)) {
    console.warn(`OfferSheet: ${shown.length} promises; the sheet is built for two to six.`);
  }

  /* Drawn: every promise beside its own drawing, two up at full width, no rule (the drawing opens the
     item). The quote has its own band after the offer (owner, 26 Oct 2026: a quote beside or under
     the set "reads as noise"), so a drawn sheet takes no aside. */
  const drawn = !rows && shown.length > 0 && shown.every((item) => item.scene);
  if (process.env.NODE_ENV !== 'production' && !drawn && shown.some((item) => item.scene)) {
    console.warn('OfferSheet: some promises carry a scene and some do not; drawing none.');
  }
  /* Glyph-headed: every promise led by its glyph, in a grid (4 Nov 2026, /future-interfaces-lab/join
     "Why join"). A set is all-glyph or none; a mixed set draws no glyph and says so. */
  const glyphed =
    !rows && !drawn && shown.length > 0 && shown.every((item) => item.icon !== undefined);
  if (
    process.env.NODE_ENV !== 'production' &&
    !rows &&
    !glyphed &&
    shown.some((item) => item.icon)
  ) {
    console.warn('OfferSheet: some promises carry a glyph and some do not; drawing none.');
  }
  const words = (item: OfferSheetItem) => (
    <Layout rowGap="text">
      {titleOf(item)}
      {bodyOf(item)}
    </Layout>
  );
  /* Drawn three across (five or six promises, `across={3}`): from 1024 each drawing heads its words,
     as a Bento tile's does, so three fit a row; below it, one column, each drawing beside its words
     again. Two across keeps the approved form, the drawing beside its words from 768. */
  const drawnThree = drawn && across === 3;
  const promises = rows ? (
    /* A head beside its body is a split, so the seam is `section` (96). */
    <ul>
      {shown.map((item) => (
        <li key={keyOf(item)} className={styles.row}>
          <Layout
            columns={{ base: 1, lg: [1, 1] }}
            colGap="section"
            rowGap="text"
            align="start"
          >
            {item.icon ? (
              /* The glyph leads its title on the title's line (owner, 4 Nov 2026: a row, not a
                 card), 16 (`text`) from icon to title, owner 4 Nov 2026; unlabelled, as the title names the subject. */
              <Cluster colGap="text" align="start" nowrap>
                <span className={styles.rowIcon}>
                  <Icon name={item.icon} size="xl" />
                </span>
                {titleOf(item)}
              </Cluster>
            ) : (
              titleOf(item)
            )}
            {bodyOf(item)}
          </Layout>
        </li>
      ))}
    </ul>
  ) : drawn ? (
    <Layout
      as="ul"
      columns={{ base: 1, lg: drawnThree ? 3 : 2 }}
      colGap="gutter"
      rowGap="stack"
    >
      {shown.map((item) => (
        <li key={keyOf(item)}>
          <Layout
            columns={drawnThree ? { base: 1, md: [5, 6], lg: 1 } : { base: 1, md: [5, 6] }}
            colGap="gutter"
            rowGap="block"
            align="center"
          >
            {item.scene ? <Sketch name={item.scene} /> : null}
            {words(item)}
          </Layout>
        </li>
      ))}
    </Layout>
  ) : glyphed ? (
    /* Glyph-headed items: no hairline, no mark, no card, no disc. The glyph is the item's head, a
       `block` over its words (head to body inside a block). The items carry no rule, so the rows
       are a borderless set's seam, `column` (the gap scale's row seam of a borderless set, 29 Sep 2026). */
    <Layout as="ul" columns={{ base: 1, md: 2, lg: across }} colGap="gutter" rowGap="column">
      {shown.map((item) => (
        <li key={keyOf(item)}>
          <Layout rowGap="block">
            <span className={styles.headIcon}>
              {item.icon ? <Icon name={item.icon} size="xl" /> : null}
            </span>
            {words(item)}
          </Layout>
        </li>
      ))}
    </Layout>
  ) : (
    <Layout
      as="ul"
      columns={{ base: 1, md: 2, lg: aside || asideImage ? 2 : across }}
      colGap="gutter"
      rowGap="stack"
    >
      {shown.map((item) => (
        <li key={keyOf(item)} className={styles.item}>
          {words(item)}
        </li>
      ))}
    </Layout>
  );

  const labelled = listLabel ? (
    <Layout rowGap="block">
      <p className={styles.listLabel}>{listLabel}</p>
      {promises}
    </Layout>
  ) : (
    promises
  );
  const sheet = note ? (
    <Layout rowGap="stack">
      {labelled}
      {note}
    </Layout>
  ) : (
    labelled
  );
  const side =
    drawn || rows || glyphed
      ? undefined
      : (aside ??
        (asideImage ? (
          <div className={styles.asideFrame}>
            <Media image={asideImage} fit="fill" sizes={HEAD_TRACK} />
          </div>
        ) : undefined));

  /* The band's FOOT (owner, 30 Oct 2026): the terms belong to the whole band, so they leave the set's
     grid. A section beat (96) parts them from the promises, and they take an arrangement of their
     own: one term per row, its title in the set's first track and its words across the other two,
     so the foot keeps the grid's edges while reading as a different kind of thing. No hairline: a rule over three columns read as the set's sixth row (round 5 critic). */
  const foot = terms?.length ? (
    <Layout as="ul" rowGap="block">
      {terms.map((t) => (
        <li key={t.title}>
          <Layout columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="text">
            <h3 className={styles.termTitle}>{t.title}</h3>
            {t.bodyHtml ? (
              <p className={styles.termBody} dangerouslySetInnerHTML={{ __html: t.bodyHtml }} />
            ) : t.body ? (
              <p className={styles.termBody}>{t.body}</p>
            ) : null}
          </Layout>
        </li>
      ))}
    </Layout>
  ) : null;

  return (
    <Section id={id} surface={surface} aria-labelledby={headingId} data-band="offer-sheet">
      <Layout rowGap="section">
        <Layout rowGap="stack">
          {lead ? (
            <Layout rowGap="block">
              <h2 id={headingId} className={styles.heading}>
                {heading}
              </h2>
              <p className={styles.lead}>{lead}</p>
            </Layout>
          ) : (
            <h2 id={headingId} className={styles.heading}>
              {heading}
            </h2>
          )}
          {side ? (
            <Layout columns={{ base: 1, lg: [2, 1] }} colGap="column" rowGap="stack">
              {sheet}
              {side}
            </Layout>
          ) : (
            sheet
          )}
        </Layout>
        {foot}
      </Layout>
    </Section>
  );
}
