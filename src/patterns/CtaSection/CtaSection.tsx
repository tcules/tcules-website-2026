import { useId, type ReactElement, type ReactNode } from 'react';

import {
  Button,
  Cluster,
  Icon,
  Island,
  ISLAND_BAND,
  Layout,
  Media,
  Section,
  type IconName,
  type IslandSurface,
  type MediaImage,
  type SectionSurface,
  TextureFlow,
  TextureFrame,
} from '@/components';
import { cx } from '@/lib/cx';
import { coverSizes, MEDIA_SPLIT } from '@/lib/image-sizes';

import styles from './CtaSection.module.css';

/**
 * One step in "what happens next". `label` is the step, `detail` an optional clause under it.
 *
 * Both are typed `string`, so no element — and therefore no control, no link and no heading — can
 * be passed into a point. The two are separate parts sharing one ink because they take different
 * measures: a step name is capped by the list's own track, a clause is running text.
 */
export type CtaPoint = {
  label: string;
  detail?: string;
};

/** A point under `markers="icon"`: the glyph is required, so no point renders a hole in the column. */
export type CtaIconPoint = CtaPoint & {
  icon: IconName;
};

/**
 * What stands in front of each point (cmp-cta, 6 Oct 2026).
 *
 *   number  the list position as a two-digit mono numeral, in the quiet neutral (owner, 7 Oct 2026: the numbers are auxiliary to the ask) — and the list is an `<ol>`,
 *           because the order is the meaning ("what happens next"). The default.
 *   icon    a Solar Bold glyph at `xl` (24), in the same blue (visual-direction § 4.2: icons and
 *           markers are the foreground accent). The list is a `<ul>`: an icon names a kind of thing,
 *           not a position, so these are the contents of an offer rather than a sequence.
 *   plain   no marker. A `<ul>`. The serif label carries the point on its own — for an offer whose
 *           points are short claims that a numeral or a glyph would over-dress.
 */
export type CtaPointMarker = 'number' | 'icon' | 'plain';

/** One action. `href` comes from `@/lib/routes` at the call site, never written out there. */
export type CtaAction = {
  label: string;
  href: string;
};

/** Which inline end of the band the K offer's photograph takes from 1024. Below 1024 it follows the copy. */
export type CtaMediaSide = 'start' | 'end';

/**
 * The K offer's photograph (visual-direction § 3.4 K, § 5.2: "an ask — one quiet photograph").
 *
 * A record rather than a ReactNode for the reason ContentSection's `media` is one: the crop is the
 * arrangement's, not the caller's — 4:5 in the 477 track from 1024 and 4:3 below it (§ 3.7 item 4),
 * at the split track's `sizes`. A caller handing over a finished `<Media>` would have to know all
 * three at every call site. A `quiet` photograph only (§ 5.5 rule 3); the registry tags it.
 */
export type CtaMedia = {
  image: MediaImage;
  /** Default `end` — the copy leads, the photo closes the row. `start` flips it (§ 3.2 rule 4). */
  side?: CtaMediaSide;
  /**
   * Below 1024, where the photo sits against the copy (page-product-design fix round 2). Default
   * `after`: the copy, then the photo (§ 3.7 item 4). `before` sets the photo first, for an offer a
   * template places beside another head → photo → list band, where at 390 the two read as one
   * repeated rectangle. The photo is decorative (alt=""), so its DOM position carries no meaning;
   * from 1024 `side` alone decides where it sits.
   */
  phone?: 'after' | 'before';
};

/**
 * One cell of the close's contact strip: a key and its value, e.g. "Write to" / "hello@…".
 * `href` makes the value a link (a `mailto:` or a route from `@/lib/routes`), inked blue by the
 * surface. Strings only, for the reason a point is: no element can be smuggled into the strip.
 */
export type CtaContact = {
  label: string;
  value: string;
  href?: string;
};

type CtaSectionBaseProps = {
  /**
   * The block's `h2`, verbatim. An empty string renders an empty `h2` — there is no fallback copy.
   *
   * A `string` and not a `ReactNode`, and that typing is the mechanism rather than a convenience:
   * it makes a second heading impossible to smuggle in, which matters here because this block
   * appears once or twice on a route that already has exactly one `h1` from `PageHero`.
   *
   * An empty string renders an empty `h2` on purpose. The region is labelled from this heading, so
   * an empty one exposes an unnamed region — a findable fault, where a fallback string would be a
   * shipped one, on 76 routes.
   */
  heading: string;
  /**
   * One or two paragraphs. `body[0]` renders as the lead, `body[1]` as body copy. Optional
   * (cmp-feature, 6 Oct 2026): a close that is a heading and its ask needs no lede, and callers
   * were passing `['']` to satisfy the type.
   *
   * A third paragraph does not compile, and that is the point of the tuple: this block asks, it
   * does not explain. Whatever wants a third paragraph belongs in the page above it.
   */
  body?: readonly [string] | readonly [string, string];
  /** The category label above the heading. Absent renders no element and no seam. */
  eyebrow?: string;
  /**
   * A glyph above everything in the lede, the eye's entry into the band (owner, 11 Oct 2026: the
   * enquiry close had nothing guiding the eye in). An `Icon` the caller composes, drawn blue at
   * --cta-mark-size, bare: no disc. Absent renders no element and no seam.
   */
  mark?: ReactNode;
  /**
   * Which ground `Section` paints under this band. Passed straight through and read nowhere else.
   *
   * A prop here rather than an inherited attribute, and it is the same conclusion `SiteNav` and
   * `PageHero` reached: this component IS the band, so it has no ancestor to read `data-surface`
   * from. Passing it through is not the same as owning the ground — the stylesheet paints nothing.
   * The CLOSES (`split`, `open`) are islands (owner, 29 Oct 2026), so their band defaults to
   * paper around the island (`ISLAND_BAND`); the island carries the close's weight. The mid-page
   * `offer` defaults to paper too. Pass `surface` to override.
   */
  surface?: SectionSurface;
  /**
   * The band's id, passed to `Section`: the in-page anchor a page's actions link to — the close's
   * `enquiry` (src/lib/routes.ts `ANCHORS`), so "Start a project" lands on the form. On the band
   * itself rather than a wrapper `div` around it, which added an element that was neither the band
   * nor its content (ServicePage audit, 6 Oct 2026). Distinct from the heading's id, which names the
   * region and is generated.
   */
  id?: string;
  /** The band's archetype for `fold:check` (§ 1.3) — `K` for an offer, `L` for a close — passed to
      Section's `data-band`. A marker for the gate, never a style hook. */
  'data-band'?: string;
};

/**
 * The points and their marker, as one decision: `markers="icon"` requires every point to carry its
 * glyph, so the pairing is a type rather than a review comment.
 *
 * Empty or absent renders no list and no seam. 20 of the 113 instances are expected to be pointless.
 */
type CtaPointsProps =
  | {
      /** Default `number`. See `CtaPointMarker`. */
      markers?: 'number' | 'plain';
      points?: readonly CtaPoint[];
    }
  | {
      markers: 'icon';
      points?: readonly CtaIconPoint[];
    };

/* ── Three members for three arrangements ────────────────────────────────────────
   Each member below encodes a constraint that would otherwise be a review comment:

     split   requires a form, and the form is always on an ISLAND, blue (default) or ink (owner,
             29 Oct 2026; decisions/2026-10-29-forms-only-on-the-island). The copy-beside-a-panel
             close on a tint band is retired: there is no prop that renders it.
     open    forbids a form and requires actions. A closing block that asks for nothing has no
             reason to exist. Always an ink island with the texture on it (owner, 29 Oct 2026;
             decisions/2026-10-29-cta-band-is-an-ink-island).
     offer   actions only, and never `proof`. The offer with a form was retired with the split
             close on paper (owner, 29 Oct 2026): a form appears only on an island.

   The `proof` asymmetry is deliberate and load-bearing: the mid-page offer and the closing block
   appear on the same 37 pages, and the fastest way to make them look like the same block twice is
   to give them both a figure row.

   Two more asymmetries arrived with the kit (cmp-cta, 6 Oct 2026), each also a type:

     media    the K offer's photograph — on the offer with ACTIONS only. A photo beside a compact
              form is cmp-form's L-photo variation, composed there; and a close carries no photograph
              on the service pages (§ 5.6: the close is copy and form, on tint — owner, 7 Oct 2026).

   One more constraint rides on the form/actions pairing: a form allows only the empty `actions`
   tuple, because the form's own submit is the primary ask and a second primary beside it is two
   asks in one block. "See available times" moved into EnquiryForm's own action row on 29 Sep 2026
   (tracker 2.17), so CtaSection takes no `scheduleHref`: EnquiryForm's enquiry and audit variants
   require it, which is where the 56-instance constraint lives — and that is its whole scope. */

/**
 * The grounds a FORM's island may take (owner, 29 Oct 2026; decisions/2026-10-29-forms-only-on-the-island):
 * brandeis (`blue`, the default) or `ink`. Paper and tint islands carry no form.
 */
export type CtaFormIsland = Extract<IslandSurface, 'blue' | 'ink'>;

type CtaSplitProps = {
  arrangement?: 'split';
  /**
   * The full EnquiryForm. A `ReactElement`, not a `ReactNode`, so `form={null}` (or `false`) does
   * not compile: a split close with nothing in its 7-track reserved the track and its 96 seam for
   * nothing.
   */
  form: ReactElement;
  actions?: readonly [];
  /**
   * Refused since cmp-cta fix round 1. A close with the FULL form and a proof row ran 880–1104 at
   * 1470 with standard copy — past the 830 fold at every proof kind — so the evidence for the ask is
   * its own band above the close (a G proof band), and the close is the copy and the form alone.
   */
  proof?: never;
  media?: never;
  /**
   * The contact strip, a `stack` under the lede (or the points): how to reach the studio, how fast
   * it answers, which hours it keeps. One to three cells, side by side from md. It FOLLOWS the copy
   * rather than being pinned to the form's foot (final fix round): it ends in a key and a value, not
   * an action, so § 3.2 rule 1 does not call for the pin, and pinned it opened ~244 of bare paper
   * between the lede and the strip at 1470 — the dead column § 3.2 warns about.
   */
  contact?: readonly CtaContact[];
  /**
   * An independent score, composed by the caller — in practice one `RatingBadge` (owner, 29 Oct
   * 2026: a rating is always the badge, never a key and a link in the contact strip). It closes the
   * words' column, a `block` under the lede and the contact strip, at its own width. A node, so a
   * pattern composes no sibling's control.
   */
  rating?: ReactNode;
  /**
   * The island the close sits on (owner, 16 Oct 2026, the home enquiry close; ALWAYS since 29 Oct
   * 2026): the copy and the form on a floating island of this surface, the form on a paper panel
   * inside it. Default `blue`; `ink` the other. The band takes paper unless `surface` says otherwise
   * (`ISLAND_BAND`). There is no form without an island: the copy beside a panel on a tint band was
   * retired (decisions/2026-10-29-forms-only-on-the-island).
   */
  island?: CtaFormIsland;
  /**
   * The island close's drawing, above the heading: an illustration the caller composes (a `Media`
   * of kind `illustration`), at --cta-art-inline-size and never cropped. Island only.
   */
  art?: ReactNode;
  /**
   * The island's texture. Island only.
   *
   *   frame  `TextureFrame`, a soft field framing the form.
   *   flow   `TextureFlow` (owner, 23 Oct 2026): the grid across the whole island as one field in
   *          motion — loose toward the start, parallel streams toward the form, still and quieter
   *          behind the words. With a drawing it fades out toward the start, so the drawing always
   *          sits on calm ground: the fade is a rule of the pairing, not a knob.
   */
  islandTexture?: 'frame' | 'flow';
  /**
   * Where the island close sets its words against the form (19 Oct 2026, the chip form). Island
   * only.
   *
   *   beside  (default) the drawing, heading and lede as one group in 5, the form in 7 — the
   *           close as home carries it.
   *   above   a HEAD ROW over the form: the drawing at its small size (--cta-art-inline-size-sm)
   *           beside the heading and lede, then the panel across the island's whole width. For a
   *           form too wide for 7 — the chip form's two halves — and so the close fits one laptop
   *           screen (~760 of island at 1440). Below 768 the drawing sits over the heading.
   *   halves  (owner, 23 Oct 2026) the island split 1:1: the words pinned to the foot of the start
   *           half and the drawing, when there is one, above them at --cta-art-inline-size-lg; the
   *           form in the end half, centred on the row. The narrower form leaves the start half as
   *           open ground, which is what `islandTexture="flow"` is for. Below 1024 it stacks.
   */
  islandArrangement?: 'beside' | 'above' | 'halves';
};

type CtaOpenProps = {
  arrangement: 'open';
  form?: never;
  /**
   * The close's ask: the blue solid, then at most its blue ghost partner. A close is where the page
   * makes its one main action (r7-buttons, 8 Oct 2026), so this is a solid by position.
   */
  actions: readonly [CtaAction] | readonly [CtaAction, CtaAction];
  proof?: ReactNode;
  media?: never;
  contact?: never;
  rating?: never;
  /**
   * The island: ink by default, with the moving field on it (owner, 29 Oct 2026;
   * decisions/2026-10-29-cta-band-is-an-ink-island). `blue` where the page closes on brandeis, as
   * About does (owner, 31 Oct 2026): the same content and structure on the other close ground.
   */
  island?: CtaFormIsland;
  art?: never;
  islandTexture?: never;
  islandArrangement?: never;
};

type CtaOfferWithActionsProps = {
  arrangement: 'offer';
  form?: never;
  /**
   * ONE action, rendered as the blue LINK button with its arrow — never a solid (r7-buttons, owner
   * 7 Oct 2026 as corrected 8 Oct). The offer interrupts the page mid-scroll; the page's one main
   * action belongs to the hero and the close, so "Start with a UX Product Audit" inside a band is a
   * link, not a button. One, because two links side by side are two actions of one emphasis (the
   * CtaRow rule); a second destination is a second band's.
   */
  actions: readonly [CtaAction];
  proof?: never;
  /**
   * The K offer's photograph. With it, the band is [7, 5] — copy in 7 (667 at 1470), the 4:5 photo
   * in 5 (477). Without it, the band is the beside offer: head and actions in the 381 head track,
   * the points in the 763 body track (§ 1.4 "K without a photo").
   */
  media?: CtaMedia;
  contact?: never;
  rating?: never;
  island?: never;
  art?: never;
  islandTexture?: never;
  islandArrangement?: never;
};

export type CtaSectionProps = CtaSectionBaseProps &
  CtaPointsProps &
  (CtaSplitProps | CtaOpenProps | CtaOfferWithActionsProps);

/**
 * Is there anything in this slot to render? `null`, `undefined`, a boolean and an empty string all
 * render nothing in React, so each is ABSENT here too — otherwise `proof={hasProof && <Proof />}`
 * would reserve a column, a 48 seam and an empty div for a `false` (spec § 12 row 6: an absent slot
 * renders no element and no seam). `0` renders a "0" in React, so it counts as present.
 */
function present(node: ReactNode): boolean {
  return node != null && typeof node !== 'boolean' && node !== '';
}

/**
 * The lede: eyebrow, heading, copy — the same three parts in the same order in every arrangement,
 * which is why this is one function rather than copies. It takes `headingId` rather than generating
 * one, because the id belongs to the region the BAND labels, and only the branch that renders the
 * band knows which one that is.
 *
 * `leadRole="body"` sets `body[0]` at body-lg rather than lead: a lede in the 381 head track is
 * H-beside-actions, whose lead is body-lg on up to four lines (§ 1.4, § 7.1 "Section head (beside)").
 */
/**
 * `scale` picks the heading's step: `offer` h2 (the mid-page ask), `close` h1 (the split close),
 * `open` display (the centred open close), `halves` the offer step at a two-line measure (the halves
 * close, 25 Oct 2026). The element is an `h2` in all four.
 */
type CtaHeadingScale = 'offer' | 'close' | 'open' | 'halves';

const HEADING_CLASS: Record<CtaHeadingScale, string | undefined> = {
  offer: styles.heading,
  close: styles.headingClose,
  open: styles.headingOpen,
  halves: styles.headingHalves,
};

function CtaLede({
  headingId,
  mark,
  eyebrow,
  heading,
  body,
  leadRole = 'lead',
  scale = 'offer',
  centred = false,
}: {
  headingId: string;
  mark?: ReactNode;
  eyebrow?: string;
  heading: string;
  body?: readonly [string] | readonly [string, string];
  leadRole?: 'lead' | 'body';
  scale?: CtaHeadingScale;
  centred?: boolean;
}) {
  /* Blank entries are dropped, so a stray empty string in frontmatter produces no <p> and no seam
     around nothing. The survivors are re-indexed, so an empty body[0] promotes body[1] into the lead
     role rather than rendering an empty lead above a body paragraph. An absent body (cmp-feature:
     the body is optional) renders the head alone. */
  const paragraphs = (body ?? []).filter((paragraph) => paragraph.trim().length > 0);

  return (
    <Layout rowGap="block" justifyItems={centred ? 'center' : undefined}>
      {mark ? (
        <span className={styles.mark} aria-hidden="true">
          {mark}
        </span>
      ) : null}
      {/* The eyebrow carries the kit's blue mark, as every band eyebrow does (fix round 1, 7 Oct
          2026): one rule for the label's accent, so no band reads as the unmarked one. */}
      {eyebrow !== undefined ? (
        <Cluster
          as="p"
          colGap="tight"
          align="center"
          nowrap
          justify={centred ? 'center' : 'start'}
          className={styles.eyebrow}
        >
          <span>{eyebrow}</span>
        </Cluster>
      ) : null}
      <h2 id={headingId} className={HEADING_CLASS[scale]}>
        {heading}
      </h2>
      {paragraphs.length > 0 ? (
        <Layout rowGap="text" justifyItems={centred ? 'center' : undefined}>
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph}`}
              className={index === 0 && leadRole === 'lead' ? styles.lead : styles.body}
            >
              {paragraph}
            </p>
          ))}
        </Layout>
      ) : null}
    </Layout>
  );
}

function CtaPointContent({ point, reading = false }: { point: CtaPoint; reading?: boolean }) {
  /* Whitespace-only detail is treated as absent, not rendered empty — otherwise a bad record puts
     an empty span under a step name and the 8px seam appears around nothing. The ORIGINAL string
     is rendered, not the trimmed one: trimming is the test, not the transform.

     Label to detail is `tight` (8), not `inline` (4): `inline` is a key and its value, and a step
     name over the sentence describing it is a tight pair (visual-direction § 1.1, S5). */
  const detail = point.detail?.trim() ? point.detail : undefined;

  return (
    <Layout rowGap="tight">
      <span className={styles.label}>{point.label}</span>
      {detail ? (
        <span className={reading ? styles.detailReading : styles.detail}>{detail}</span>
      ) : null}
    </Layout>
  );
}

/**
 * How the list sits in its band — four shapes of one list, chosen by the arrangement:
 *
 *   stack  a single track at `--gap-block`, beside a photograph or a form: the K offer's and the L
 *          close's 667 copy column. The image or the form is the band's large thing, so the list
 *          stays light — no rule, the marker and the serif label carry each step.
 *   rows   the same single track, each point OPENED by a hairline (§ 3.1 item 5: "between the rows
 *          of a read-down list"), its detail at body rather than body-sm. The beside offer's 763 body
 *          track, where the list IS the band's body and runs at a reading measure (§ 7.2: a row's
 *          body steps with the track). Without the rules, three small rows floated in 763 of paper.
 *   row    3-up from md, the marker ABOVE its label, because a 392 track (or ~207 beside proof) is
 *          too narrow to put a marker in front of a step name and still read as a row. Each point is
 *          opened by a hairline the width of its track, the text-only card's top edge (§ 3.1), and
 *          the 32 gutter breaks the rule between them so the row reads as three objects. `open`.
 *   line   the K offer beside its photograph: the marker and the label, ONE line each, no detail
 *          (§ 3.4 K: "≤ 3 one-line points"; final fix round). With a detail under every label the
 *          copy column became a six-line list and the band read as a document beside a photo; the
 *          head and the photograph carry the offer, and two-line points belong to the close.
 *   centred  3-up from md, the marker above its label, NO rule, every line centred on its track:
 *          the open close's centred column (cmp-cta fix round 1). A rule under a centred column
 *          reads as a table's header line; the centring and the 32 gutter separate the three.
 */
type CtaPointsShape = 'line' | 'stack' | 'rows' | 'row' | 'centred';

/**
 * The points, in one of four shapes with one of three markers. Nothing about the content, the
 * order or the numbering moves between them; only where the marker sits and what it is.
 *
 * In `stack` the marker sits in FRONT of the label on one non-wrapping row — a nowrap
 * Cluster, so a marker can never orphan onto a line of its own (the failure a wrapping Cluster had
 * at 390). A numeral sits on the label's first baseline (`baseline`); a glyph has no baseline, so it
 * tops out with the label's line box (`start`) — a 24 glyph against the h5 label's ~28 line box.
 */
function CtaPoints({
  shape,
  markers,
  points,
}: {
  shape: CtaPointsShape;
  markers: CtaPointMarker;
  points: readonly (CtaPoint & { icon?: IconName })[];
}) {
  /* A point with no label is dropped rather than rendered, so a bad frontmatter record cannot put
     a bare numeral in the list. Filtering BEFORE the index is taken is what keeps the numbering
     contiguous: drop the second of four and the rendered markers are 01 02 03, not 01 03 04. */
  const visiblePoints = points.filter((point) => point.label.trim().length > 0);
  if (visiblePoints.length === 0) return null;

  /* A detail handed to a one-line list is not rendered — the arrangement has no line for it — and
     in development it says so, so the omission is findable rather than silent. */
  if (
    shape === 'line' &&
    process.env.NODE_ENV !== 'production' &&
    visiblePoints.some((point) => point.detail?.trim())
  ) {
    console.warn(
      'CtaSection: the offer beside a photograph sets one-line points; `detail` is not rendered.',
    );
  }

  /* An ordered list only when the marker IS the order. Icons and plain points are an offer's
     contents, not a sequence, and an `<ol>` would announce a position nobody can see. */
  const listElement = markers === 'number' ? 'ol' : 'ul';

  const items = visiblePoints.map((point, index) => {
    const key = `${index}-${point.label}`;

    /* The marker. A numeral is the position zero-padded to two digits — a marker of constant width
       from 01 to 10, so every label starts on one vertical line. It is aria-hidden (the <ol> carries
       position) but a sighted reader counts with it, so it holds a real 4.5:1. A glyph is decorative
       beside its label and Icon hides it. */
    const marker =
      markers === 'number' ? (
        <span aria-hidden="true" className={styles.marker}>
          {String(index + 1).padStart(2, '0')}
        </span>
      ) : markers === 'icon' && point.icon ? (
        <span className={styles.glyph}>
          <Icon name={point.icon} size="xl" />
        </span>
      ) : null;

    const reading = shape === 'rows';
    const content =
      shape === 'line' ? (
        <span className={styles.label}>{point.label}</span>
      ) : (
        <CtaPointContent point={point} reading={reading} />
      );

    /* The point's body: the marker above the copy in a 3-up row, in front of it everywhere else —
       a nowrap Cluster, so a marker can never orphan onto a line of its own. */
    if (shape === 'centred') {
      return (
        <Layout as="li" key={key} rowGap="text" justifyItems="center">
          {marker}
          {content}
        </Layout>
      );
    }

    const body =
      marker === null ? (
        content
      ) : shape === 'row' ? (
        <Layout rowGap="text">
          {marker}
          {content}
        </Layout>
      ) : (
        <Cluster nowrap colGap="text" align={markers === 'number' ? 'baseline' : 'start'}>
          {marker}
          {/* A div, not a span: CtaPointContent is a Layout, and a div inside a span is invalid. */}
          <div className={styles.pointContent}>{content}</div>
        </Cluster>
      );

    /* A ruled point: the hairline heads it, `block` (24) to its content — head to body inside a
       block, CtaRow's rule-to-row step. An empty div with one block-start border, not an <hr>: it
       is decoration, not a break a screen reader should announce inside a list item. */
    if (shape === 'row' || shape === 'rows') {
      return (
        <Layout as="li" key={key} rowGap="block">
          <div className={styles.rule} />
          {body}
        </Layout>
      );
    }

    return <li key={key}>{body}</li>;
  });

  if (shape === 'row' || shape === 'centred') {
    return (
      <Layout as={listElement} columns={{ base: 1, md: 3 }} colGap="gutter" rowGap="gutter">
        {items}
      </Layout>
    );
  }

  /* Ruled rows sit a `gutter` (32) apart — rule to rule, the content's 24 below each rule plus a
     clear 32 above the next, so a rule always belongs to the row it opens. */
  if (shape === 'rows') {
    return (
      <Layout as={listElement} rowGap="gutter">
        {items}
      </Layout>
    );
  }

  return (
    <Layout as={listElement} rowGap="block">
      {items}
    </Layout>
  );
}

/**
 * The control row for the actions-only shapes. A form brings its own row — submit and "See
 * available times" together, inside EnquiryForm — so this renders only when there is no form.
 *
 * Two kinds, by where the band sits (r7-buttons, owner 7 Oct 2026 as corrected 8 Oct):
 *
 *   ask   the CLOSE (`open`). The page's one main action: the first is the blue `solid`, no arrow
 *         — the label carries the ask; the second its partner, a blue GHOST with the trailing
 *         arrow, because it navigates. The hero's shape exactly (PageHero). There is no ink solid
 *         and no `converts`: colour no longer follows the kind of action.
 *   link  the mid-page OFFER (K). One blue link button with the trailing arrow — every action that
 *         is not the page's main one is a link, and the offer is in-band.
 *
 * Every control is `size="md"` with `extendHitArea`: the box is 40 (or the link's label line) and
 * the touch floor is 44, so the target is legal without the row growing. `block` (24) between the
 * solid and its ghost, as CtaRow and PageHero set it: two boxes need clear air between them.
 */
function CtaActions({
  actions,
  kind,
  justify,
}: {
  actions: readonly CtaAction[];
  /** `ask` on a close, `link` on the offer. See above. */
  kind: 'ask' | 'link';
  /** `center` in the open close's centred column; otherwise the row starts at the copy's edge. */
  justify?: 'center';
}) {
  return (
    <Cluster colGap="block" rowGap="block" align="center" justify={justify}>
      {actions.map((action, index) => {
        const solid = kind === 'ask' && index === 0;
        return (
          <Button
            key={`${index}-${action.href}-${action.label}`}
            as="a"
            href={action.href}
            emphasis={solid ? 'solid' : kind === 'ask' ? 'ghost' : 'link'}
            size="md"
            extendHitArea
            icon={solid ? undefined : <Icon name="arrow-right" />}
          >
            {action.label}
          </Button>
        );
      })}
    </Cluster>
  );
}

/**
 * The split close's contact strip: one to three key/value cells side by side from md, a `dl`
 * because each cell IS a term and its value. A cell with a blank key or value is dropped, so a bad
 * record renders no orphan key. `inline` (4) inside a cell — a key and its value — and `gutter`
 * between cells, the gap between items in a set.
 *
 * Beside the form (`besideForm`) the strip is one column from 1024 to 1279 (page-showcase fix round 2,
 * 7 Oct 2026): there the close is [1, 1] and the copy track ~432, so three cells were ~130 each and
 * the address broke mid-word ("hello@tcules.c / om") in the band whose job is to get a visitor to
 * write in. From 1280 the 10 of [10, 7] gives each of three cells ~200 again.
 */
function CtaContactStrip({
  contact,
  besideForm,
}: {
  contact: readonly CtaContact[];
  besideForm: boolean;
}) {
  const cells = contact.filter((cell) => cell.label.trim() && cell.value.trim());
  if (cells.length === 0) return null;

  return (
    <Layout
      as="dl"
      columns={
        besideForm
          ? { base: 1, md: cells.length, lg: 1, xl: cells.length }
          : { base: 1, md: cells.length }
      }
      colGap="gutter"
      rowGap="block"
      align="start"
    >
      {cells.map((cell, index) => (
        <Layout key={`${index}-${cell.label}`} rowGap="inline">
          <dt className={styles.contactKey}>{cell.label}</dt>
          <dd className={styles.contactValue}>
            {cell.href ? <a href={cell.href}>{cell.value}</a> : cell.value}
          </dd>
        </Layout>
      ))}
    </Layout>
  );
}

/** A master's ratio, width ÷ height, for `coverSizes`. */
const ratioOf = (image: MediaImage) => image.width / image.height;

/* The K frame's ratio per `sizes` entry (MEDIA_SPLIT: cap, from 1024, below),
   restating --cta-photo-ratio-* (TypeScript cannot read a custom property). The portrait frame is a
   FLOOR, and from 1024 to 1303 the copy column can stretch it to ~0.62, so that entry states the
   tallest it gets: an over-ask by one rung, never an under-ask. */
const PORTRAIT_FRAMES = [4 / 5, 0.62, 4 / 3] as const;

/**
 * CtaSection — the page's ask, built to docs/specs/CtaSection.md and visual-direction § 3.4 K / L.
 *
 * An optional eyebrow, one `h2`, one or two paragraphs, a list of points, and then either a form
 * (which carries its own scheduling link) or one to two actions. 76 routes, 113 instances — 37
 * routes carry two, because a mid-page offer and a closing block are both this component.
 *
 * THREE ARRANGEMENTS, and they are three jobs rather than three densities of one shape:
 *
 *   split   L, the close that asks for an ENQUIRY — ALWAYS on a blue (default) or ink island,
 *           the form on a paper panel inside it (owner, 29 Oct 2026): `islandArrangement`
 *           `beside` [5, 7], `above` a head row over the panel, or `halves` 1:1. With or
 *           without a drawing (`art`). No proof.
 *   open    the close that asks for a CLICK — ALWAYS an ink island with the moving field on it
 *           (owner, 29 Oct 2026): a centred column, h1 heading, lede, a centred 3-up row of
 *           points, the actions on the axis. With proof, [3, 2] left-aligned and the proof beside.
 *   offer   K, which INTERRUPTS a page mid-scroll. Sets `density="tight"` itself. Three shapes:
 *             with `media`   [7, 5]: H-full, ≤ 3 one-line points (`line`) and the actions in 7, a quiet 4:5
 *                            photograph in 5 (`media.side` flips it). The copy column is centred on
 *                            the photo, the actions a `stack` under the points (fix round 1). The only
 *                            offer-with-photo shape: a landscape [5, 7] with the points as a strip
 *                            under both was removed (owner, 9 Oct 2026) — points stay with the copy.
 *             without        [1, 2]: head and actions in the 381 head track (H-beside-actions), the
 *                            points in the 763 body track.
 *
 * The heading's SCALE follows the job (fix round 1): the offer is h2, the split close h1, the
 * centred open close display. At h2 the page's last ask weighed what a mid-page head did. The
 * element is an `h2` in every case.
 *
 * It contributes TYPE AND INK only. `Section` paints the band from the `surface` handed to it,
 * `Layout` and `Cluster` own every seam, `Media` the photograph and its radius, `Button` every
 * interactive value, and the form, proof and texture slots own themselves. There are no `--cta-*`
 * state tokens at all: nothing here responds to a pointer and nothing opens.
 *
 * A server component in effect: `useId` is the only hook, there is no state, no effect, no ref and
 * no DOM handler.
 */

/** A form's island when the caller names none: brandeis (owner, 29 Oct 2026). */
const FORM_ISLAND: CtaFormIsland = 'blue';

/** The open close's island, always (owner, 29 Oct 2026). */
const OPEN_ISLAND: CtaFormIsland = 'ink';

/**
 * A close's island on its band. A close's island is blue or ink, never paper or tint (owner,
 * 29 Oct 2026), so where the band already IS that ground — no edge to read by — it takes the other
 * of the two, rather than `islandSurfaceOn`'s light fallback, which would set a form or the field on
 * a paper box.
 */
function closeIslandOn(band: SectionSurface, requested: CtaFormIsland): CtaFormIsland {
  return band === requested ? (requested === 'blue' ? 'ink' : 'blue') : requested;
}

export function CtaSection(props: CtaSectionProps) {
  /* The heading owns the region's name. `useId` rather than a caller-supplied id, because two
     instances on one route would otherwise have to be told apart by hand — and the id is only ever
     pointed at the `h2`, which is always rendered, so the idref can never dangle. */
  const headingId = `${useId()}-heading`;
  const points = props.points ?? [];
  const markers: CtaPointMarker = props.markers ?? 'number';
  const hasPoints = points.some((point) => point.label.trim().length > 0);

  const lede = (
    options: { leadRole?: 'lead' | 'body'; scale?: CtaHeadingScale; centred?: boolean } = {},
  ) => (
    <CtaLede
      headingId={headingId}
      mark={props.mark}
      eyebrow={props.eyebrow}
      heading={props.heading}
      body={props.body}
      {...options}
    />
  );

  if (props.arrangement === 'open') {
    /* `present`, not `!== undefined`, so a `proof={false}` reserves nothing (§ 12 row 6). */
    const hasProof = present(props.proof);
    /* ALWAYS an ink island (owner, 29 Oct 2026: "for CTA bands like this, I'd like to use the
       island variant … in ink with the text and button as is and the texture on the island";
       decisions/2026-10-29-cta-band-is-an-ink-island). The band takes paper unless told; the
       island's ground is ink on any band but an ink one (`closeIslandOn`). The moving field
       (`TextureFlow`) runs across the island, still and quieter behind the lede alone
       (`data-texture-calm` on a box the lede's own width, so the field keeps its strength across
       the rest of the island), as on the enquiry island. */
    const requested = props.island ?? OPEN_ISLAND;
    const band: SectionSurface = props.surface ?? ISLAND_BAND[requested];
    const islandSurface = closeIslandOn(band, requested);
    const field = (content: ReactNode) => (
      <Island surface={islandSurface}>
        {/* Turbulent: an island with no form has no side to resolve toward (owner, 31 Oct 2026;
            decisions/2026-10-31-formless-islands-turbulent-paper-island-textured). */}
        <TextureFlow flow="turbulent" />
        {content}
      </Island>
    );
    const arrangement = 'open-island';

    /* ── Open with proof ─────────────────────────────────────────────────────────────────────
       [3, 2]: the lede (h1), a ruled 3-up row of points and the actions in 3, the proof beside in
       2. Evidence beside the ask needs a column, so this shape stays left-aligned. */
    if (hasProof) {
      return (
        <Section
          surface={band}
          id={props.id}
          data-band={props['data-band']}
          aria-labelledby={headingId}
          data-arrangement={arrangement}
        >
          {field(
            <Layout
              columns={{ base: 1, lg: [3, 2] }}
              colGap="section"
              rowGap="stack"
              align="start"
            >
              <Layout rowGap="stack">
                <Layout justifyItems="start">
                  <div data-texture-calm>{lede({ scale: 'close' })}</div>
                </Layout>
                <CtaPoints shape="row" markers={markers} points={points} />
                <CtaActions actions={props.actions} kind="ask" />
              </Layout>
              <div>{props.proof}</div>
            </Layout>,
          )}
        </Section>
      );
    }

    /* ── Open, the centred close (cmp-cta fix round 1) ────────────────────────────────────────
       Quantum's close (references.md: "eyebrow, H2, body and actions in a centred column, with the
       texture anchored to the band edge, not behind the text"). The heading at DISPLAY scale on
       the display measure, the lede at its 44ch wedge under it, the points as a centred 3-up row,
       the actions centred on the axis. `density="open"` (128): the close is the page's last beat
       and its bottom padding is where the texture rises, so the field has 128 of its own ground
       below the actions rather than living behind them. It was a flush-left stack of lede, ruled
       row and buttons, which read as a document with an empty right half. */
    return (
      <Section
        surface={band}
        id={props.id}
        data-band={props['data-band']}
        aria-labelledby={headingId}
        data-arrangement={arrangement}
      >
        {field(
          <div className={styles.centred}>
            <Layout rowGap="stack">
              <Layout justifyItems="center">
                <div data-texture-calm>{lede({ scale: 'open', centred: true })}</div>
              </Layout>
              {/* The points take the middle 4 of [1, 4, 1] — about 8/12, 784 at 1470 — so the row
                stays inside the centred column's silhouette rather than spreading the full 1240
                (final fix round: at full width it read as a three-feature strip under a narrow
                column). `offset` places the one child; the outer tracks stay empty. */}
              {hasPoints ? (
                <Layout columns={{ lg: [1, 4, 1] }} offset={{ lg: 1 }} colGap="gutter">
                  <CtaPoints shape="centred" markers={markers} points={points} />
                </Layout>
              ) : null}
              <CtaActions actions={props.actions} kind="ask" justify="center" />
            </Layout>
          </div>,
        )}
      </Section>
    );
  }

  if (props.arrangement === 'offer') {
    const actions = props.actions;
    const media = 'media' in props ? props.media : undefined;

    const photoFirst = media?.phone === 'before';

    /* ── K with a portrait photograph ────────────────────────────────────────────────────────
       [7, 5] at `section` (96): the copy column in 7, the photo in 5 — the same 477 track as the B
       media split, which is why it reads MEDIA_SPLIT's `sizes`. `reverse` for `side="start"`
       mirrors the template with the children, so the photo keeps its 5 at the start; visual only,
       the copy stays first in the DOM, which is the phone's order (photo BELOW the copy in K, § 3.7
       item 4) and carries no meaning against an atmosphere photo (alt="").

       The copy column is CENTRED on the photo and the actions FOLLOW the points, a `stack` under
       them (page-product-design fix round 1, 7 Oct 2026). It used to stretch to the photo and pin
       the actions to its foot (§ 3.2 rule 1), and with three one-line points that opened a ~160 hole
       between the list and the buttons at 1470 — the dead column § 3.2 warns about. The ask belongs
       to the list it closes. The photo FILLS a frame whose ratio is a floor (`.photoFrame`): where
       the copy is taller than a 4:5 photo — 1024 to 1279, where the 7 track is ~500 — the frame
       stretches with it, so the photo never ends short of the copy. */
    if (media) {
      /* 4:5 beside the copy, 4:3 against it below 1024: a 4:5 at the 326 phone column would be 408
         tall under a band that has already made its ask. `sizes` accounts for the cover crop
         (`coverSizes`), or a landscape master is fetched too short for the frame. */
      const portraitPhoto = (
        <div className={cx(styles.photoFrame, styles.photoPortrait)}>
          <Media
            image={media.image}
            fit="fill"
            sizes={coverSizes(MEDIA_SPLIT, ratioOf(media.image), PORTRAIT_FRAMES)}
          />
        </div>
      );
      return (
        <Section
          surface={props.surface}
          id={props.id}
          data-band={props['data-band']}
          aria-labelledby={headingId}
          data-arrangement="offer"
        >
          <Layout
            columns={photoFirst ? { lg: [5, 7] } : { lg: [7, 5] }}
            colGap="section"
            rowGap="stack"
            reverse={(media.side === 'start') !== photoFirst ? { lg: true } : undefined}
            align="center"
          >
            {photoFirst ? portraitPhoto : null}
            <Layout rowGap="stack">
              {lede()}
              <CtaPoints shape="line" markers={markers} points={points} />
              {actions.length > 0 ? <CtaActions actions={actions} kind="link" /> : null}
            </Layout>
            {photoFirst ? null : portraitPhoto}
          </Layout>
        </Section>
      );
    }

    /* ── K without a photograph ──────────────────────────────────────────────────────────────
       [1, 2] at `section` from 1440: the head and its actions in the 381 head track
       (H-beside-actions, the lead at body-lg), the points in the 763 body track (§ 1.4 "K without
       a photo", 411). [5, 7] from 1024 to 1439: at 1024 a third of the column is ~290 and the h2
       ran to four lines, past H-beside-actions' three (fix round 1); 5 of 12 holds it to three.
       With no points there is no body track to fill, and the band is the head alone, one track. */
    return (
      <Section
        surface={props.surface}
        id={props.id}
        data-band={props['data-band']}
        aria-labelledby={headingId}
        data-arrangement="offer"
      >
        <Layout
          columns={hasPoints ? { lg: [5, 7], xl: [1, 2] } : undefined}
          colGap={hasPoints ? 'section' : undefined}
          rowGap={hasPoints ? 'stack' : undefined}
          align="start"
        >
          <Layout rowGap="stack">
            {lede({ leadRole: hasPoints ? 'body' : 'lead' })}
            {actions.length > 0 ? <CtaActions actions={actions} kind="link" /> : null}
          </Layout>
          <CtaPoints shape="rows" markers={markers} points={points} />
        </Layout>
      </Section>
    );
  }

  /* `split` is the default and the fall-through, which is why it needs no discriminator check: the
     union's first member has `arrangement?: 'split'`, so an omitted arrangement lands here.

     THE FORM IS THE BAND'S PRIMARY OBJECT (owner, home round 3, 11 Oct 2026, from the stakeholder:
     "the form isn't the main item in those sections. the form feels secondary … design it in a way
     that the user fills out more"). It was [10, 7] with the copy in the larger track at h1 and the
     form in the narrower one on the bare ground, so the eye landed on the heading and the form
     read as an attachment to it. Now:

       · the form takes the LARGER track, 7 of [5, 7] from 1024 (667 at 1470, the width the full set
         reads best at with lg fields), on a raised panel: a small surface of its own, one step off
         the band's ground (paper on the tint close, PANEL_SURFACE), at the 8 radius with a
         `block` inset (the module says why not `gutter`) — the one bright, bounded object in the band;
       · the copy beside it steps down to the offer's h2 and is centred on the panel, the quieter
         supporting voice: what to send and why, never louder than the place to send it;
       · the submit is the band's one solid primary, in the panel (the caller's form).

     The panel declares its own surface (`data-surface`) so the fields, the submit and the caption
     inside it take that surface's tokens — every surface block is self-contained exactly so a
     surface can nest (CLAUDE.md § Tokens rule 2). Below 1024 the copy comes first and the panel
     a `stack` under it, full column.

     No proof row: see `CtaSplitProps.proof`. */
  const contact = props.contact ?? [];
  const hasContact = contact.some((cell) => cell.label.trim() && cell.value.trim());
  /* The score at its own width: a Cluster row, so the pill never stretches to the column. */
  const ratingRow =
    'rating' in props && present(props.rating) ? <Cluster>{props.rating}</Cluster> : null;

  /* ── The island close (owner, 16 Oct 2026) ─────────────────────────────────────────────────────
     The copy and the form on a blue or ink island, the form on a paper panel inside it. [5, 7] at
     `section` from 1024 (a split: words and drawing beside a form), the form in the larger track.
     The drawing, heading and lede are ONE group, a `block` apart, centred against the form: the
     form is usually the taller, and the group never spreads to fill it (owner: "too much space
     between the illustration and the copy"). Below 1024 it stacks: the group, then the form. */
  const requested: CtaFormIsland = props.island ?? FORM_ISLAND;
    const band: SectionSurface = props.surface ?? ISLAND_BAND[requested];
    const islandSurface = closeIslandOn(band, requested);
    const panel = (
      <div className={styles.islandPanel} data-surface="paper">
        {props.form}
      </div>
    );

    /* ── Above (19 Oct 2026): the head row, then the panel across the island ──────────────────
       The head row is the drawing BESIDE the heading and lede from 768 (`['auto', 1]`: the
       drawing at its own small width, the words taking the rest), centred on each other; the
       drawing over the words below. The drawing is the head's own mark, not a region of the band,
       so it sits a `block` from the words (the head-to-body step) rather than a split's `section`.
       The panel follows a `stack` under the head row: block to block inside the band. Points and
       a contact strip, when a caller passes them, follow the lede in the words' column as they do
       beside; the close is built for a heading and a lede, and each of them costs the fit. */
    /* ── Halves (23 Oct 2026): 1:1, the words at the foot of the start half ──────────────────
       Two regions of different kind side by side, so the split's `section`. The start half pins
       one group to its foot (`pinLast`): the drawing, then a `stack` under it the words (owner,
       25 Oct 2026: "right above the title with a 48px gap"). The words are the field's still water
       (`data-texture-calm`). The panel centres on the row rather than stretching to it, so it
       never grows empty paper under the form. */
    if (props.islandArrangement === 'halves') {
      const art = present(props.art);
      return (
        <Section
          surface={band}
          id={props.id}
          data-band={props['data-band']}
          aria-labelledby={headingId}
          data-arrangement="split"
        >
          <Island surface={islandSurface}>
            {props.islandTexture === 'flow' ? <TextureFlow fade={art ? 'start' : undefined} /> : null}
            {props.islandTexture === 'frame' ? <TextureFrame /> : null}
            <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack">
              <Layout pinLast>
                <Layout rowGap="stack">
                  {art ? <div className={styles.artLarge}>{props.art}</div> : null}
                  <div data-texture-calm>
                    <Layout rowGap="block">
                      {lede({ scale: 'halves' })}
                      <CtaPoints shape="stack" markers={markers} points={points} />
                      {hasContact ? <CtaContactStrip contact={contact} besideForm /> : null}
                      {ratingRow}
                    </Layout>
                  </div>
                </Layout>
              </Layout>
              <div className={cx(styles.islandPanel, styles.islandPanelHalves)} data-surface="paper">
                {props.form}
              </div>
            </Layout>
          </Island>
        </Section>
      );
    }

    if (props.islandArrangement === 'above') {
      return (
        <Section
          surface={band}
          id={props.id}
          data-band={props['data-band']}
          aria-labelledby={headingId}
          data-arrangement="split"
        >
          <Island surface={islandSurface}>
            {props.islandTexture === 'frame' ? <TextureFrame panel="foot" /> : null}
            {props.islandTexture === 'flow' ? <TextureFlow /> : null}
            <Layout rowGap="stack">
              <Layout
                columns={present(props.art) ? { md: ['auto', 1] } : undefined}
                colGap={present(props.art) ? 'block' : undefined}
                rowGap={present(props.art) ? 'block' : undefined}
                align="center"
              >
                {present(props.art) ? <div className={styles.artSmall}>{props.art}</div> : null}
                <Layout rowGap="block">
                  {lede({ scale: 'offer' })}
                  <CtaPoints shape="stack" markers={markers} points={points} />
                  {hasContact ? <CtaContactStrip contact={contact} besideForm={false} /> : null}
                  {ratingRow}
                </Layout>
              </Layout>
              {panel}
            </Layout>
          </Island>
        </Section>
      );
    }

    return (
      <Section
        surface={band}
        id={props.id}
        data-band={props['data-band']}
        aria-labelledby={headingId}
        data-arrangement="split"
      >
        <Island surface={islandSurface}>
          {props.islandTexture === 'frame' ? <TextureFrame /> : null}
          {props.islandTexture === 'flow' ? <TextureFlow fade={present(props.art) ? 'start' : undefined} /> : null}
          <Layout columns={{ base: 1, lg: [5, 7] }} colGap="section" rowGap="stack" align="center">
            <Layout rowGap="block">
              {present(props.art) ? <div className={styles.art}>{props.art}</div> : null}
              {lede({ scale: 'offer' })}
              <CtaPoints shape="stack" markers={markers} points={points} />
              {hasContact ? <CtaContactStrip contact={contact} besideForm /> : null}
              {ratingRow}
            </Layout>
            {panel}
          </Layout>
        </Island>
      </Section>
    );
}
