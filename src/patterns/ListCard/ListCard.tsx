import type { ReactNode } from 'react';

import {
  Button,
  Cluster,
  Icon,
  Layout,
  Media,
  type IconName,
  type MediaImage,
  Sketch,
} from '@/components';
import { cx } from '@/lib/cx';
import type { ArticleSceneName } from '@/lib/sketches';
import { LIST_CARD_THUMBNAIL } from '@/lib/image-sizes';

import styles from './ListCard.module.css';

/**
 * One slot, three fills. The discriminator is content, not a visual variant: every member lands in
 * the same leading position and the row around it keeps the same rule, inset and type.
 *
 * The discriminant is `type`, not `kind`, for the reason PageHero's and BlockCard's media unions
 * switched (docs/specs/Media.md § 17 Q7): the thumbnail carries an image RECORD, and the record has
 * its own `kind` — capture, cut-out, illustration, photograph — which decides the image's edge.
 * Two fields called `kind` one level apart is a spread away from one overwriting the other.
 *
 * `number` is the ordered-steps fill (the Mechanism's semantic variant). It is only legal inside an
 * `<ol>`: the numeral is aria-hidden because the list announces position, so in a `<ul>` the order
 * would be visual only. The caller's `Layout as="ol"` owns that — see the component comment.
 *
 * `thumbnail` takes `Media`'s own `MediaImage` record, whole and untouched, exactly as a page
 * received it from `@/content`. ListCard owns the box — 160 inline, the shared 3:2 cover crop — and
 * `Media` owns everything inside it: the srcset, the lazy load, the panel. The edge is the box's: a
 * radius and no frame, for every kind (§ 5.3). `alt` is
 * required by the record even when its right value is `""`, so decoration is chosen, never omitted.
 *
 * Per ch05 § 9 and ruling C1 a thumbnail is for case-study and insight/resource rows only, and it
 * carries one cut-out part or one illustration shape. That is a supply rule, not a type: the
 * pattern cannot tell a case study from a glossary term, so the route decides whether to pass one.
 */
export type ListCardMarker =
  /** `tone` (owner, 7 Oct 2026): `accent` (default) sets the numeral blue; `neutral` sets it in a
      quiet grey, for a set whose band already carries its accent elsewhere. */
  | { type: 'number'; value: number; tone?: ListCardNumberTone }
  | { type: 'icon'; name: IconName }
  | { type: 'thumbnail'; image: MediaImage }
  /** `sketch` (13 Oct 2026, the insights hub): a DRAWN thumbnail — the scene drawn for this article
      (never a service scene), in the thumbnail's own 16:9 box, assigned item by item in data.
      Decorative (the Sketch is aria-hidden). */
  | { type: 'sketch'; name: ArticleSceneName }
  /** `date` (13 Oct 2026, the insights hub's events): the day large in the stat voice, in the
      accent, and the month and year under it in the label voice — a row that IS a date first. A
      real `<time>`, not aria-hidden: the date is content, unlike an ordinal. The caller formats
      both strings ("14", "Nov 2026") and passes the ISO value for `dateTime`. Without `dateTime`
      (a date not yet set: "—", "Date TBC") it renders as text, not a `<time>`, so a ledger
      with one undated row keeps every row's copy on one edge. */
  | { type: 'date'; dateTime?: string; day: string; label: string };

export type ListCardNumberTone = 'accent' | 'neutral';

export type ListCardArrangement = 'split' | 'stacked';

/**
 * Where the item sits, which decides where its rule and marker go (1 Oct 2026).
 *
 *   row   one row of a one-column list. The rule CLOSES the row (block-end), the marker stands
 *         beside the content, and the title and body split or stack (`arrangement`). The default.
 *   tile  one item in a grid track. The rule OPENS the item (block-start), the marker stands above
 *         the title, and the title and body always stack. The copy sits flush with the track, so a
 *         grid of tiles aligns with the section heading over it.
 *
 * A form, not a finish: both are the same ruled, groundless item. The rule moves because of what it
 * has to line up with. Rows close on a rule so every row ends on the same line as its neighbour;
 * tiles in a grid have unequal heights, so only their TOPS align, and an opening rule is the edge
 * that does. The service pages drew their own tile for this (Signals, Steps, Ledger) because
 * ListCard could not; this is that tile, once.
 */
export type ListCardForm = 'row' | 'tile';

/**
 * The item's type step (visual-direction § 7.2, 5 Oct 2026). A COMPONENT SIZE, so a t-shirt name. A
 * row cannot see its siblings, so the composing route passes it.
 *
 *   md  h4 title, body      a set of up to three rows; the default for `form="row"`
 *   sm  h5 title            any set of four rows or more, and every tile; the default for
 *                           `form="tile"`. A tile's body steps to body-sm with it; a row's body
 *                           stays at body, because it runs at up to --measure-body and body-sm at
 *                           that measure read as fine print (6 Oct 2026; § 1.4's F step row and
 *                           one-column D row are h5 over body)
 *
 * The default follows the form (5 Oct 2026), so the rule that tiles take `sm` is the path of least
 * resistance rather than something every grid has to remember. A route still passes `sm` to a row
 * set of four or more, because only it can count.
 *
 * There is no `lg`. § 7.2's large step is the one featured, horizontal card, which is BlockCard's
 * arrangement; a ListCard is never featured, so a third step would be a size nothing may use.
 */
export type ListCardSize = 'md' | 'sm';
export type ListCardTitleElement = 'span' | 'h3' | 'h4';

/**
 * The tile's finish (owner, 7 Oct 2026 — a partial reversal of "a card is never a box").
 *
 *   none  the default: the groundless tile, opened by its rule.
 *   box   a hairline round all four sides at the 8 radius, the copy a `block` (24) inside it, and —
 *         on a linked tile — a ground under the pointer. For a set whose items must read as
 *         separate objects at a glance: an icon router of four to six destinations, where open
 *         tiles in a grid read as one field of text.
 *
 * A tile only. A row sits in a ruled ladder whose rules ARE its separation; a box round each row
 * would be a stack of panels with a second rule between them.
 */
export type ListCardFrame = 'none' | 'box';

/**
 * A closed content record. There is no `children`, `className` or DOM-attribute spread: allowing
 * any of them would reopen nested controls, call-site geometry and a second source for the action.
 */
type ListCardFormProps =
  | {
      /** A row in a one-column list. See `ListCardForm`. */
      form?: 'row';
      /** Title/body geometry only. Defaults to the corpus's highest-volume split arrangement. */
      arrangement?: ListCardArrangement;
      /** A row is never boxed. See `ListCardFrame`. */
      frame?: never;
    }
  | {
      /** An item in a grid track. See `ListCardForm`. */
      form: 'tile';
      /** A tile always stacks: a split needs a row's width, and a grid track never has it. */
      arrangement?: never;
      /** The tile's finish. Defaults to `none`. See `ListCardFrame`. */
      frame?: ListCardFrame;
    };

export type ListCardProps = ListCardFormProps & {
  /** Primary label. Whitespace-only values render nothing and warn in development. */
  title: string;
  /**
   * One quiet label above the title — what KIND of thing the item is and when ("Podcast · 25 Aug
   * 2026", "12 min read"). BlockCard's eyebrow voice: mono, uppercase in presentation only, the
   * quiet-label ink, never blue (the words stay ink; blue is for marks). Set a `text` (16) above the
   * title, the step BlockCard's head group uses, so a row and a card under one heading share one
   * rhythm. In a split row it travels with the title, in the title's track. Added for the insights
   * feed (the insights hub, 13 Oct 2026), where a row of mixed formats has nowhere else to say which
   * format it is. A plain string: the caller composes the line. Whitespace-only omits it and warns.
   */
  eyebrow?: string;
  /**
   * One explanatory paragraph. Optional (1 Oct 2026): an item can be its name alone — a checklist
   * line, a deliverable that needs no gloss. Absent renders no paragraph and no seam; a value that
   * is present but whitespace-only is a CMS fault, so it is omitted with a warning.
   */
  body?: string;
  /**
   * The body as trusted inline HTML, one entry per paragraph (page-mapping G3): for an item whose
   * body carries a link, a bold run or a second paragraph, which `body: string` would flatten.
   * Built by `inlineToHtml` at the content seam. Exclusive with `body`. On a row or tile with an
   * `href` the whole item is one anchor, so its HTML may not hold a link.
   */
  bodyHtml?: readonly string[];
  /** Optional leading content. Absence removes both the slot and its adjacent seam. */
  marker?: ListCardMarker;
  /** Heading semantics without a visual type change. */
  titleAs?: ListCardTitleElement;
  /** The type step, passed by the set. Defaults to `sm` on a tile and `md` on a row. */
  size?: ListCardSize;
  /**
   * A non-blank destination turns the entire item into one native link (owner, 7 Oct 2026: no arrow
   * after the title). The item carries no glyph at rest; on hover and focus its title takes the
   * accent ink, and a keyboard focus ring runs round the whole item.
   */
  href?: string;
  /**
   * The destination leaves tcules.com. Opens in a new tab, appends a visually hidden "(opens in a
   * new tab)" to the item's accessible name, and sets a small up-right glyph after the title — the
   * one glyph a linked item may still carry, so a sighted reader is told the same thing (WCAG
   * G201) before the click rather than after it. Ignored on an item with no destination.
   */
  external?: boolean;
  /**
   * A visible action at the item's foot: the link Button, with its arrow, carrying this label
   * (owner, 7 Oct 2026). Opt-in, for an item whose action is NOT obvious from its title — "Download
   * the template", "Book a slot". Most linked items need none: the title names the destination.
   * Rendered as a span inside the item's one anchor, so it adds no second focus stop. Ignored
   * without a destination. Pass ordinary capitalisation; Button sets the case.
   */
  ctaLabel?: string;
  /**
   * Which end of a ROW the marker stands at (13 Oct 2026, the insights archive). `start` (default)
   * leads with it. `end` sets an image marker (`thumbnail`, `sketch`) after the copy, so a list where
   * only SOME rows carry an image keeps every title and eyebrow on one edge — the archive-index
   * pattern (docs/research/resources-listing.md). Visual and DOM order agree: the copy first. Ignored
   * on a tile, whose marker always heads it, and for a number, icon or date marker, which index the
   * row and must lead it. Below 768 an end image is not shown: it is supplementary (the copy leads
   * the row), and beside a 326 phone column it squeezed the copy to ~200px.
   */
  markerPosition?: 'start' | 'end';
};

/** One modifier per step, on the root; the module sets title, body and ordinal offset under it. */
const SIZE_CLASS: Record<ListCardSize, string | undefined> = {
  md: styles.sizeMd,
  sm: styles.sizeSm,
};

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') console.warn(`ListCard: ${message}`);
}

/** The marker slot. Blank thumbnail sources collapse rather than leaving a broken-image frame. */
function Marker({ marker, form }: { marker: ListCardMarker; form: ListCardForm }) {
  if (marker.type === 'number') {
    /* At least two digits, not exactly two: the expected 01–12 align, while an out-of-range 100
       stays honest rather than being truncated. The <ol> announces position, so the visual copy
       is hidden and cannot be read twice. */
    const value = String(marker.value).padStart(2, '0');

    return (
      <span
        aria-hidden="true"
        className={cx(
          styles.marker,
          styles.number,
          marker.tone === 'neutral' && styles.numberNeutral,
          form === 'tile' && styles.numberAbove,
        )}
      >
        {value}
      </span>
    );
  }

  if (marker.type === 'date') {
    /* A fixed-width column (--lcrd-date-inline), so a ledger of dates keeps every row's copy on one
       edge whether the day is "1" or "30". Day over label at `tight` (8): a stat and its unit. */
    const face = (
      <Layout as="span" rowGap="tight">
        <span className={styles.dateDay}>{marker.day}</span>
        <span className={styles.dateLabel}>{marker.label}</span>
      </Layout>
    );
    return marker.dateTime ? (
      <time className={cx(styles.marker, styles.date)} dateTime={marker.dateTime}>
        {face}
      </time>
    ) : (
      <span className={cx(styles.marker, styles.date)}>{face}</span>
    );
  }

  if (marker.type === 'sketch') {
    return (
      <span className={cx(styles.marker, styles.thumbnail)}>
        <Sketch name={marker.name} />
      </span>
    );
  }

  if (marker.type === 'icon') {
    /* The title names the subject, so Icon's unlabelled form is the right one: it emits
       aria-hidden and cannot duplicate the row name. */
    return (
      <span className={cx(styles.marker, styles.markerIcon)}>
        <Icon name={marker.name} size="xl" />
      </span>
    );
  }

  if (marker.image.src.trim().length === 0) {
    warn('thumbnail marker received a blank src; omitting the marker.');
    return null;
  }

  /* The box is ListCard's and Media fills it: `fill` covers a ratio the PARENT set, from Media's anchor,
     which is the whole of what a mechanical crop is (Media.md § 3). The record's own width and height
     still reach the <img>, so the browser reserves the right box before the file lands, and the
     160 `sizes` means a 2× screen asks for the ladder's 320 rung rather than the 2560 master.
     Never `priority`: a thumbnail is never a page's LCP image, so it stays lazy and async.

     `inset="text"`: a B5 cut-out on its contrast panel keeps 16px of panel round it here rather than
     the 32 a full-column placement takes, because at 160 × 107 the gutter inset left the part
     96 × 43 — not one recognisable shape (ch05 § 9). Media owns the value; ListCard only names the
     step, since only the placement knows how small its box is (29 Sep 2026, 2.17).

     `edge="placement"`: the box draws the thumbnail's edge, and that edge is a radius with no frame,
     for every kind (visual-direction § 5.3, fdn-media, 6 Oct 2026). A capture's own hairline would
     otherwise run round a 160px crop the row made, which is a frame (spec § 17 q9). */
  return (
    <span className={cx(styles.marker, styles.thumbnail)}>
      <Media
        image={marker.image}
        sizes={LIST_CARD_THUMBNAIL}
        fit="fill"
        edge="placement"
        inset="text"
      />
    </span>
  );
}

/**
 * ListCard — one ruled row, built to docs/specs/ListCard.md.
 *
 * The root is always an <li>; its parent decides whether the list is ordered. That is the caller's
 * on purpose: the set is a `Layout as="ol" | "ul"` with `rowGap="none"`, because Layout owns the list
 * axis and the seam between rows, and a row cannot see its siblings. Every route composes it that
 * way today — `as={numbered ? 'ol' : 'ul'}` beside `marker={numbered ? { type: 'number', … } : …}`,
 * one boolean driving both — so a numbered set is a real <ol> and an unordered one a <ul>. A
 * wrapper pattern that owned the list would be a pattern importing a pattern, or a second Layout.
 *
 * A non-blank href changes only the frame element and the title's hover ink: one <a> wraps the
 * item, giving it one focus stop and one accessible name, while the static shape is an inert <div>
 * with no pointer states. There is no arrow cue (owner, 7 Oct 2026): the whole item is the link, and
 * a blue arrow after nearly every title read as bulky. Where the action is not obvious from the
 * title the caller opts into a visible one at the foot (`ctaLabel`).
 *
 * Every arrangement is a primitive. The outer Cluster puts marker beside the content core and may
 * wrap the larger thumbnail above it. The title/body split is a second, wrapping Cluster whose
 * break point is the two children's minimum tracks — the row's own width decides, never the
 * viewport's (29 Sep 2026, 2.17). A stacked row, and a row's copy over its action, are single-track
 * Layouts. The module contains no grid or flex arrangement; its flex declarations only size
 * children inside those primitives.
 */
export function ListCard({
  title,
  eyebrow,
  body,
  bodyHtml,
  marker,
  form = 'row',
  arrangement = 'split',
  frame = 'none',
  titleAs: Title = 'span',
  size,
  href,
  external = false,
  ctaLabel,
  markerPosition = 'start',
}: ListCardProps) {
  if (title.trim().length === 0) {
    warn('title is blank; rendering nothing.');
    return null;
  }

  const hasBodyHtml = bodyHtml !== undefined && bodyHtml.some((html) => html.trim().length > 0);
  if (hasBodyHtml && body !== undefined) {
    warn(`both body and bodyHtml for ${JSON.stringify(title)}; bodyHtml wins.`);
  }
  const hasBody = hasBodyHtml || (body !== undefined && body.trim().length > 0);
  if (!hasBodyHtml && body !== undefined && !hasBody) {
    warn(`body is blank for ${JSON.stringify(title)}; omitting the paragraph.`);
  }
  /* The body element, in one place: a paragraph, or — for `bodyHtml` — a div of paragraphs a `text`
     apart (the card's own paragraph step; no Prose margins), carrying the same role class. */
  const bodyNode = (className: string | undefined) =>
    hasBodyHtml ? (
      <div className={className}>
        <Layout rowGap="text">
          {bodyHtml.map((html, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </Layout>
      </div>
    ) : hasBody ? (
      <p className={className}>{body}</p>
    ) : null;
  const isTile = form === 'tile';
  const boxed = isTile && frame === 'box';
  const step: ListCardSize = size ?? (isTile ? 'sm' : 'md');

  const destination = href?.trim() ? href : undefined;
  const isSplit = !isTile && arrangement === 'split';
  const leaves = destination !== undefined && external;

  if (ctaLabel !== undefined && ctaLabel.trim().length === 0) {
    warn(`ctaLabel is blank for ${JSON.stringify(title)}; omitting the action.`);
  }
  /* The opt-in action: the shipped link Button, as BlockCard's cta draws it. `as="span"` keeps the
     single-anchor contract — the item already navigates, so a nested <a> would be invalid markup
     and a second stop for one destination — and the frame's `data-btn-link-group` hands it the
     item's hover, focus and press. The Cluster keeps it at the copy's inline start rather than
     letting a blockified inline-flex take the whole track. */
  const action =
    destination && ctaLabel?.trim() ? (
      <Cluster>
        <Button
          as="span"
          emphasis="link"
          tone="primary"
          icon={<Icon name={leaves ? 'arrow-right-up' : 'arrow-right'} />}
        >
          {ctaLabel}
        </Button>
      </Cluster>
    ) : null;

  /* An external item says so to the eye as well as to a screen reader: a small up-right glyph after
     the title's last word, joined by a non-breaking space so it never starts a line alone. Not the
     removed arrow cue — it does not say "this is a link" (the hover does that), it says "this
     leaves the site", which a sighted reader cannot otherwise know before the new tab opens. With
     an action, the action's own glyph says it instead, so the title carries none. */
  const leavesGlyph =
    leaves && !action ? (
      <>
        {'\u00a0'}
        <span className={styles.leaves}>
          <Icon name="arrow-right-up" size="md" />
        </span>
      </>
    ) : null;

  const titleNode = (className: string | undefined) => (
    <Title className={className}>
      {title}
      {leavesGlyph}
    </Title>
  );

  if (eyebrow !== undefined && eyebrow.trim().length === 0) {
    warn(`eyebrow is blank for ${JSON.stringify(title)}; omitting the label.`);
  }
  /* The head: the title, or the eyebrow over it at `text` (16) — one group, so a split row keeps the
     label in the title's track. `extra` is the split's sizing class, which belongs to whatever sits
     in the title's track: the title alone, or the group. */
  const headNode = (extra?: string) =>
    eyebrow?.trim() ? (
      <Layout rowGap="text" className={extra}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        {titleNode(styles.title)}
      </Layout>
    ) : (
      titleNode(cx(styles.title, extra))
    );

  /* The tile: marker, then the title over its body, then — when there is one — the action at the
     foot, pinned there so every action in a grid row sits on one line however long its body runs.

     An icon tile STACKS at every width (owner, 9 Oct 2026): the glyph on its own row, then the
     title, then the body — never the glyph inline beside the title, which read as a bulleted
     heading. Icon to title is `text` (16), the step the head group already uses between its rows:
     the glyph is a row of the head, sized from the title's role, not a label it decorates. The
     phone cost the inline form saved (~1500 for four stacked tiles) is accepted with the ruling.

     A number or thumbnail marker and the copy are a wrapping Cluster (final fix round, cmp-media-
     split, 6 Oct 2026). From md the copy takes a whole line, so it wraps UNDER the marker at the
     Cluster's `block` (24); below md a number's copy takes the rest of its line. A thumbnail
     always sits above: beside a phone-width copy column, a 160 image leaves it ~140.

     Title to body stays `text`, not `tight` (8), in every form (visual-direction § 1.1, S3): it puts
     ListCard and BlockCard on one card rhythm. The action sits a `block` under the copy, as
     BlockCard's. */
  const tileCopy = (
    <Layout rowGap="text" className={styles.content}>
      {headNode()}
      {bodyNode(styles.body)}
    </Layout>
  );
  let tileHead: ReactNode = tileCopy;
  if (marker && marker.type === 'icon') {
    tileHead = (
      <Layout rowGap="text">
        <Marker marker={marker} form={form} />
        {tileCopy}
      </Layout>
    );
  } else if (marker) {
    tileHead = (
      <Cluster colGap="block" rowGap="block" align="start">
        <Marker marker={marker} form={form} />
        <div
          className={cx(
            styles.tileCopy,
            marker.type === 'thumbnail' || marker.type === 'sketch'
              ? styles.tileCopyBelow
              : styles.tileCopyBeside,
          )}
        >
          {tileCopy}
        </div>
      </Cluster>
    );
  }
  const tile = (
    <Layout rowGap="block" pinLast={action !== null} className={styles.tileInner}>
      {tileHead}
      {action}
    </Layout>
  );

  /* The split reads the row's OWN width, not the viewport's. A wrapping Cluster puts title and body
     side by side only while both of their minimum tracks fit on one line, and wraps the body under
     the title the moment they do not — so a row in a 390px grid track stacks even on a 1440 screen,
     and the title is never squeezed into a track narrower than its words. The two maxima
     (--measure-title, --measure-body) are the cap: past them the leftover stays at the core's inline
     end instead of prising the title and its sentence apart. The module only sizes the two children
     inside Cluster. */
  const rowCopy = isSplit ? (
    <Cluster colGap="block" rowGap="text" align="start" className={styles.content}>
      {headNode(cx(styles.splitTitle, !hasBody && styles.titleSentence))}
      {bodyNode(cx(styles.body, styles.splitBody))}
    </Cluster>
  ) : (
    <Layout rowGap="text" className={styles.content}>
      {/* A row with no body is its sentence alone, so the title runs to the lead measure rather
          than the title's 32ch (owner, 1 Nov 2026: About's audiences wrapped at half their track). */}
      {headNode(hasBody ? undefined : styles.titleSentence)}
      {bodyNode(styles.body)}
    </Layout>
  );

  const hasPicture =
    marker !== undefined && (marker.type === 'thumbnail' || marker.type === 'sketch');
  const trailing = markerPosition === 'end' && hasPicture;
  const markerNode = marker ? <Marker marker={marker} form={form} /> : null;
  const row = (
    <Cluster colGap="block" rowGap="block" align="start">
      {trailing ? null : markerNode}
      <div className={styles.core}>
        {action ? (
          <Layout rowGap="block">
            {rowCopy}
            {action}
          </Layout>
        ) : (
          rowCopy
        )}
      </div>
      {trailing ? markerNode : null}
    </Cluster>
  );

  const inner = isTile ? tile : row;

  return (
    <li
      className={cx(
        styles.root,
        SIZE_CLASS[step],
        isTile && styles.tile,
        boxed && styles.boxed,
        action !== null && styles.withAction,
        trailing && styles.markerEnd,
      )}
      /* A row with a picture (a thumbnail or a drawn scene beside its copy) is a horizontal media
         row: it takes a whole row of any grid it is set in (owner, 29 Oct 2026: "either 1 item takes
         one row and then it takes this form or it uses the vertical card"). A tile stacks its
         picture above its copy, so it is the vertical card and keeps its track. */
      data-media-row={!isTile && hasPicture ? true : undefined}
    >
      {destination ? (
        /* `data-btn-link-group` is Button's published contract: this anchor's states are the
           states of the link Button inside it. Emitted only when there is one. */
        <a
          className={cx(styles.frame, styles.link)}
          href={destination}
          target={leaves ? '_blank' : undefined}
          rel={leaves ? 'noreferrer' : undefined}
          data-btn-link-group={action ? true : undefined}
        >
          {inner}
          {/* The glyph is aria-hidden, so the new tab is said in words, at the END of the
              accessible name so the title is still what a screen reader leads with. */}
          {leaves ? <span className={styles.hint}> (opens in a new tab)</span> : null}
        </a>
      ) : (
        <div className={styles.frame}>{inner}</div>
      )}
    </li>
  );
}
