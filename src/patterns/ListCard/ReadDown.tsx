import { Layout, Media, Texture, TextureShape, type IconName, type MediaImage } from '@/components';
import { cx } from '@/lib/cx';
import { READ_DOWN_PHOTO } from '@/lib/image-sizes';

/* Bound as `Row`: the set's items are ListCard rows (and classes:check reads the stylesheet's path
   below as the stylesheet, not as a member access on the component). */
import { ListCard as Row, type ListCardTitleElement } from './ListCard';
import styles from './ListCard.module.css';

/** One read-down row: a subject, one sentence on it, and the blue glyph that gives it a shape. */
export type ReadDownRow = {
  title: string;
  /**
   * One sentence, set under the title at the lead measure (56ch). One column: ≤ 20 words, two lines
   * (the body box is ~548 at 1440, ~528 at 1024). Two columns: ≤ 19 words, three lines at 1440,
   * where the body box is 301 beside its glyph; at 1024 it is 208 and the same sentence runs a
   * line longer, so write to the 1440 ceiling and stay under it.
   */
  body?: string;
  /** The body as trusted inline HTML, one entry per paragraph (ListCard `bodyHtml`). Exclusive with `body`. */
  bodyHtml?: readonly string[];
  /** A Solar Bold glyph, blue (§ 4.2). Give every row one or none: a set is all-icon or all-text. */
  icon?: IconName;
};

/**
 * One column (≤ 3 rows) or two (≤ 3 rows each). § 1.4 rule 8: a set never exceeds six, and two
 * columns with a CtaRow take ≤ 2 rows each — the band's footer is the caller's, so that half of
 * the rule is the caller's too.
 */
export type ReadDownColumns = 1 | 2;

type ReadDownBase = {
  rows: readonly ReadDownRow[];
  /** The row titles' element. Default `h3`, under the band's h2. */
  titleAs?: ListCardTitleElement;
};

/**
 * THE PHOTO FORM (fix round 2, 6 Oct 2026). The photograph is the band's large thing, so it takes
 * the WIDE track: from 1024 the set splits [1, 2] at 96 (`section`) — the rows in the leading third,
 * the photo in the trailing two thirds — and the photo runs the rows' full height, so the two start
 * on the first title's line and end on the last rule at every width from 1024. About 763 × 450 at
 * 1440 with three rows: half the band, the mass the references give an image (Meridian's
 * deliverables split), where round 1's 349 portrait read as a third equal column.
 *
 * PLACE IT UNDER A STACKED ContentSection head, which sits above both halves (`split-head`, the
 * H-row that put the heading over the rows and the lead over the photo, was retired on 7 Oct 2026:
 * a text-only head is never split left/right). Never under `beside`: the set would split again
 * inside the two-thirds track.
 *
 * Exactly three rows, `sm` (h5) in the 381 track. Fewer and the photo becomes a letterbox (two rows
 * stretch a 763 photo to ~290, 2.6 : 1), more and the band passes the fold. Below 1024 the photo sits
 * above the rows at 3:2 across the column, first in DOM order, the phone's order (§ 3.7 item 4:
 * aside between head and body). The photograph is atmosphere (alt=""), so its visual move to the
 * trailing track carries no meaning. The caller passes no `aside`: the photo is it.
 */
type ReadDownWithPhoto = ReadDownBase & {
  columns?: 1;
  photo: MediaImage;
  /**
   * The `rail` texture (§ 6.3), anchored to the PHOTOGRAPH'S END EDGE, never to the band: the field
   * starts 80 under the photo and runs to the viewport edge, one shape 220 wide with blur 120, so
   * the grid always reads as coming out from behind the image — at 1440 it fills the 100 margin, at
   * 1920 it fades out inside the 340 one, never a stray strip at the screen edge (round 2: anchored to
   * the band, it sat 170 clear of the photo at 1920). It never passes under a word: under the photo
   * and in the margin only. From 1440, where the margin is wide enough to hold it. Paper only (§ 6.2);
   * it spends one of the band's two blue masses (§ 4.3).
   */
  rail?: boolean;
};

type ReadDownPlain = ReadDownBase & {
  /** Default 1. See `ReadDownColumns`. */
  columns?: ReadDownColumns;
  photo?: never;
  rail?: never;
};

export type ReadDownProps = ReadDownWithPhoto | ReadDownPlain;

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') console.warn(`ReadDown: ${message}`);
}

/**
 * ReadDown — the D band's body (visual-direction § 3.4 D): ruled ListCard rows in one column or
 * two, read top to bottom. A SET MODE of ListCard, in ListCard's folder, for the reason `Steps` is:
 * the set is ListCard's rows and nothing else, and a pattern beside it would be a pattern importing
 * a pattern. `Steps` is a method (numbered, read in order); this is a read-down of PEERS — what you
 * receive, who is involved, what a review covers — so its marker is a blue glyph, not an ordinal,
 * and its list is a `<ul>`.
 *
 *   THE SIZE IS THE SET'S (§ 7.2). One column (≤ 3 rows) takes `md` (h4), each row a title with its
 *   sentence under it at the lead measure, so three rows hold the head track's height rather than
 *   leaving a hole under a split. Every two-column set takes `sm` (h5), as does a one-column set
 *   pushed past its ceiling (which also warns); the body stays at body (6 Oct: a row's body does
 *   not step).
 *
 *   TWO COLUMNS ARE ONE LIST. A `<ul>` laid out two across at `column` (64, peer halves), in reading
 *   order, every grid row the height of its taller item, so the closing rules run level across the
 *   seam and the set reads as rows of a ladder rather than two ragged lists.
 *
 *   ON THE CONTENT EDGE. Read-down rows never take `href`, so they never paint the hover ground the
 *   row's 16 inline inset exists to clear: the inset goes and the glyph sits on the track's edge.
 *   The first row in each column drops its top inset, so the first title starts on the head's top
 *   line, and the ladder's rules sit between rows and after the last, never above the first.
 */
export function ReadDown({ rows, columns = 1, titleAs = 'h3', photo, rail }: ReadDownProps) {
  const perColumn = Math.ceil(rows.length / columns);
  if (rows.length > 6) warn(`received ${rows.length} rows; a read-down set never exceeds six.`);
  if (perColumn > 3) {
    warn(
      `${perColumn} rows in a column; a read-down column holds three at most (§ 1.4 rule 8).`,
    );
  }
  const icons = rows.filter((row) => row.icon).length;
  if (icons !== 0 && icons !== rows.length) {
    warn('some rows carry a glyph and some do not; a set is all-icon or all-text.');
  }

  if (photo && rows.length !== 3) {
    warn(`the photo form takes three rows; received ${rows.length}.`);
  }

  /* The photo form's rows sit in the 381 track, narrower than a two-column half, and take its step. */
  const size = rows.length >= 4 || columns === 2 || photo ? 'sm' : 'md';

  const list = (
    <Layout
      as="ul"
      /* Five or fewer titles with no body (About's audiences) are one row from 1024: two columns
         would leave the fifth alone on its row. */
      columns={
        columns === 2
          ? rows.length <= 5 && rows.every((row) => !row.body && !row.bodyHtml)
            ? { md: 2, lg: rows.length as 2 | 3 | 4 | 5 }
            : { md: 2 }
          : undefined
      }
      colGap={columns === 2 ? 'column' : undefined}
      /* Two columns are a grid of items, so no rules (owner, 31 Oct 2026: a ruled row only when one
         item stands per row): each item is a tile, its glyph heading it, and the borderless set's row
         seam stands between rows. */
      rowGap={columns === 2 ? 'column' : 'none'}
      className={cx(styles.readdown, columns === 2 && styles.readdownTwo)}
    >
      {rows.map((row, index) => (
        <Row
          key={`${index}-${row.title}`}
          size={size}
          {...(columns === 2 ? { form: 'tile' as const } : { arrangement: 'stacked' as const })}
          titleAs={titleAs}
          title={row.title}
          body={row.body}
          bodyHtml={row.bodyHtml}
          marker={row.icon ? { type: 'icon', name: row.icon } : undefined}
        />
      ))}
    </Layout>
  );

  if (!photo) return list;

  /* The photo form. Photo first in the DOM (above the rows below 1024), reversed into the trailing
     two-thirds track from 1024. Layout owns both tracks and the 96 seam; `stretch`, so the photo's
     box takes the rows' height (the outer box is the inline-size container the base ratio reads).

     The rail's svg sits in the photo's box but is NOT contained by it: nothing between it and the
     Section is positioned, so the band is its containing block, and its CSS sizes it from the band's
     end edge back to 80 under the photo (the margin is a max() over the band's width, which only a
     child of the band can resolve). That is what keeps it inside the viewport — a field hung off the
     photo box would overflow the page sideways at 1440. So place a railed set straight in a band,
     as ContentSection's body is, never in a positioned wrapper. The shape fills that field's start;
     its vertical place is the photo's in a three-row band (35% to 85% of it). Raw numbers because
     TextureShape takes them as props (as Statement's head-half field does). */
  return (
    <Layout
      /* [2, 1] in DOM order: the ratio travels with its child under `reverse`, so the photo (first)
         keeps the 2fr track and lands in it at the trailing end. */
      columns={{ lg: [2, 1] }}
      colGap="section"
      rowGap="stack"
      reverse={{ lg: true }}
      align="stretch"
    >
      <div className={styles.readdownPhoto}>
        {rail ? (
          <Texture className={styles.rail}>
            <TextureShape left={0} top="35%" width={220} height="50%" blur={120} />
          </Texture>
        ) : null}
        <div className={styles.readdownPhotoBox}>
          <Media image={photo} fit="fill" sizes={READ_DOWN_PHOTO} />
        </div>
      </div>
      {list}
    </Layout>
  );
}
