import { Cluster } from '@/components';

import { cx } from '@/lib/cx';

import styles from './Breadcrumbs.module.css';

/**
 * One level of the trail. The shape a frontmatter record already has, which is half the reason
 * this is a pattern rather than a primitive: it consumes content, it does not merely arrange.
 *
 * `href` is required on EVERY item including the last, and the last one's is deliberately ignored
 * at render — the current page is a <span>, never a link, because a link to the page you are on is
 * a control that does nothing. Requiring it anyway keeps the frontmatter mapper uniform and saves
 * it a special case for the leaf.
 */
export type BreadcrumbItem = { label: string; href: string };

/**
 * Two props, and the closed props type is the point rather than an oversight.
 *
 * There is no index signature and no HTMLAttributes spread, so `className`, `style`, `separator`,
 * `size`, `density`, `surface` and `children` are all excess-property errors at the call site
 * rather than review comments. Each is answered somewhere else: colour by the token layer, read
 * from the enclosing band's `data-surface`; distance by the primitives and by the hero that places
 * the trail; the divider by one decision made once; and outer spacing by nobody — there is none.
 *
 * `surface` was a prop until 5 Oct 2026 (kit `fdn-top`), when the trail owned its own band. It no
 * longer does — it sits inside the hero's — so it reads its ground the way a Button does (token
 * rule 7), and a trail can no longer be painted a different ground from the hero it introduces.
 *
 * `pathname` is absent for the hardest reason: the trail comes from frontmatter, and a component
 * that COULD derive a trail from a URL would eventually be asked to.
 */
export type BreadcrumbsProps = {
  /**
   * The ancestors, in order, ending with this page (or, with `endsWith="parent"`, with its
   * parent). Everything else is derived from it: which item is last, how many dividers there are
   * (always one fewer than the rendered items), and whether the middle collapses (at four or more).
   *
   * Two or more items, and depth beyond four is free — the collapse holds the rendered count at
   * four whether the route is six levels deep or sixteen. Fewer than two renders nothing.
   */
  items: readonly BreadcrumbItem[];
  /**
   * What the last item is. `page` (the default): this page, rendered as text with
   * `aria-current="page"`. `parent`: this page's parent, rendered as a link like every other crumb,
   * and no item is current.
   *
   * `parent` exists because the trail sits 32px above the h1 (kit `fdn-top`, 5 Oct 2026). On a page
   * whose only name IS its h1 (an article, an audit, a glossary term, a legal page) a current crumb
   * repeats the headline directly below it, and a headline-length crumb wraps on a phone. Such a
   * page's trail stops at its parent and the h1 is the current page. Routes do not choose this by
   * hand: `heroTrail` in `@/lib/trail` decides it by comparing the last label with the title.
   */
  endsWith?: 'page' | 'parent';
};

/** Whitespace-only labels are dropped, so a bad frontmatter record cannot skew the divider count. */
const hasLabel = (item: BreadcrumbItem) => item.label.trim().length > 0;

/**
 * Breadcrumbs — the ancestor trail, built to docs/specs/Breadcrumbs.md.
 *
 * An ordered list of the pages above this one, ending in this one or, when the h1 below names it,
 * in its parent (`endsWith`). It states position; it is not a
 * way of getting elsewhere — SiteNav does that, and the trail's links are a by-product of saying
 * where you are rather than the point of it.
 *
 * It contributes no colour and no distance: every value comes from `--crumb-*` in
 * tokens/components/breadcrumbs.css, which re-declares the whole set once per surface, and every
 * gap comes from `Cluster`. So the same markup is correct on paper, on a tint panel, in an ink
 * band and on the blue pivot — including a tint panel nested inside an ink section — without being
 * told where it is standing.
 *
 * It renders ONLY the landmark and its trail — no `Section`, no band, no air of its own (kit
 * `fdn-top`, 5 Oct 2026). Its one placement is `PageHero`'s `trail` slot: the route or template
 * passes `trail={heroTrail(items, title, (t) => <Breadcrumbs {...t} />)}` (`@/lib/trail`), and the
 * hero sets it 32 above the split inside its own band. `heroTrail` drops the last item when it
 * repeats the h1, which is when `endsWith` becomes `parent`. That is what moved the h1 from 296 to 222 on a service page: the
 * trail's own 64-above band and the hero's 96 no longer stack. The hero's 96 of top padding is now
 * the air above the trail, and the 44px hit extension reaches 23.15px up into it.
 *
 * A server component. No state, no effect, no ref, no DOM handler — hover, press and focus are the
 * stylesheet's business and take no props, and nothing in this component ever opens.
 */
export function Breadcrumbs({ items, endsWith = 'page' }: BreadcrumbsProps) {
  const trail = items.filter(hasLabel);
  const first = trail[0];
  const current = trail[trail.length - 1];

  /* Fewer than two levels renders nothing at all — not an empty <nav>, because an empty landmark
     is worse than no landmark: a screen reader lists it and it answers nothing. A trail of one is
     a statement about nothing, and a lone "Home" above a hero is noise.

     This is the defence against a bad frontmatter record, not a supported call. `/` does not
     render the component. The warning cannot name the route — reading the URL is the one thing
     this component may never do — so it names the labels it was handed, which is what identifies
     the offending record anyway.

     The two truthiness checks are not a second condition: with noUncheckedIndexedAccess an
     indexed read is `T | undefined` whatever the length says, and this guard is what narrows
     them for the render below. A non-empty tuple prop type would move all of this into the type
     system and make the branch unreachable — the spec asks for that in the frontmatter loader,
     in its own change. */
  if (!first || !current || trail.length < 2) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `Breadcrumbs: needs two or more items with labels, received ${trail.length} ` +
          `(${JSON.stringify(items.map((i) => i.label))}). Rendering nothing. ` +
          `Check navigation.breadcrumb in the page's frontmatter.`,
      );
    }
    return null;
  }

  /* The collapse is DEPTH-DRIVEN, and it has two depths — one per side of the md breakpoint.

     From 768 up, four or more authored levels render as four: first, collapse, parent, current.
     Below 768 the same trail renders as THREE: first, collapse, current — the parent goes into the
     collapse too. On a phone a four-crumb trail wrapped onto a second line 44.85px below the first,
     led by a divider, and read as two elements rather than one phrase (29 Sep 2026, tracker 2.17).
     The rowGap that caused that distance is not the thing to change — it is what keeps the 44px
     targets of two wrapped lines from overlapping — so the fix is to stop the trail wrapping by
     holding it to three crumbs where the column is narrow.

     A trail of three or fewer levels is the same at both widths: three crumbs is already the phone's
     count, and collapsing a three-level trail would trade a real link for a mark and save nothing.

     No client JS and no prop. Both renderings are ONE list: the parent <li> and the two count
     strings carry a breakpoint class, and the stylesheet removes the one that does not apply with
     `display: none`, which takes it out of the accessibility tree as well as out of the layout. So at
     any width a screen reader walks exactly one trail with one count in it — never both counts,
     never a parent the eye cannot see. Depth is still free after four, which is why there is no
     `maxItems`. */
  const collapsed = trail.length >= 4;
  const parent = trail[trail.length - 2];

  /* Everything between the first item and the current page when the trail is short. Once collapsed
     the middle is the parent alone, rendered separately below because it carries the wide-only
     class. */
  const middle = collapsed ? [] : trail.slice(1, -1);

  /* Levels the collapse stands for: from 768 up it hides everything but the parent; below 768 it
     hides the parent too. */
  const omittedWide = trail.length - 3;
  const omittedNarrow = trail.length - 2;

  return (
    /* The landmark, and nothing around it — no band, no colour, no box and no air. The name is a
       constant: one trail per page means there is nothing to disambiguate. */
    <nav aria-label="Breadcrumb">
      {/* Both axes stated. colGap on the inline seam either side of every solidus, so the trail
        reads as one phrase rather than as four separated items; rowGap between WRAPPED lines,
        which is Cluster's largest step and is there for the touch targets. */}
      <Cluster as="ol" colGap="inline" rowGap="block" align="baseline" className={styles.trail}>
        {/* Every crumb but the last is a nowrap Cluster of its label and the divider AFTER it: the
          trail wraps BETWEEN crumbs and never inside one, and the divider stays at the end of the
          line with the crumb it follows, so a wrapped line never STARTS with a solidus (critic,
          audits run, 4 Nov 2026: "Home / Audits & Assessments" then "/ Product Modernisation
          Assessment" on a 390 phone read as an orphaned mark). The last crumb has no divider. A
          single label longer than the track still breaks inside itself — nowrap governs the flex
          children, not the text inside one of them. */}
        <Cluster as="li" colGap="inline" align="baseline" nowrap>
          <a className={styles.link} href={first.href}>
            {first.label}
          </a>
          <Divider />
        </Cluster>

        {collapsed ? (
          <Cluster as="li" colGap="inline" align="baseline" nowrap>
            {/* Inert, deliberately. It says levels were dropped without pretending to be a
              control — so there is no aria-expanded, no aria-controls naming a list that is not
              rendered, no keyboard contract and no focus to place after a state change. The
              meaning is carried by the hidden sibling, not by the character.
              Two siblings, one per side of the breakpoint, because the count differs by the
              parent. The stylesheet removes the one that does not apply, so exactly one is ever
              in the accessibility tree. */}
            <span aria-hidden="true" className={styles.collapse}>
              {'\u2026'}
            </span>
            <span className={cx(styles.collapseCount, styles.wideOnly)}>
              {levelsOmitted(omittedWide)}
            </span>
            <span className={cx(styles.collapseCount, styles.narrowOnly)}>
              {levelsOmitted(omittedNarrow)}
            </span>
            <Divider />
          </Cluster>
        ) : null}

        {middle.map((item) => (
          <Cluster key={item.href} as="li" colGap="inline" align="baseline" nowrap>
            <a className={styles.link} href={item.href}>
              {item.label}
            </a>
            <Divider />
          </Cluster>
        ))}

        {/* The parent of a collapsed trail — shown from 768 up, folded into the collapse below it.
          `display: none` below 768 rather than a visually hidden clip, because a link the eye
          cannot see must not be a tab stop or an announced crumb either. */}
        {collapsed && parent ? (
          <Cluster as="li" colGap="inline" align="baseline" nowrap className={styles.wideOnly}>
            <a className={styles.link} href={parent.href}>
              {parent.label}
            </a>
            <Divider />
          </Cluster>
        ) : null}

        <li>
          {/* Never an <a>, and never a link that has merely been marked: currency here is
            STRUCTURAL — it is the last item — so it is a different element with its own token,
            which is why no --crumb-link-ink-current exists. It differs from its ancestors by ink
            alone and does not need more: it is not focusable, it gains no rule on hover, and it
            carries aria-current, so nothing about it is carried by colour only.

            With `endsWith="parent"` the last item is an ancestor like the rest, so it is a link
            like the rest, and nothing in the trail is current: the h1 below is. */}
          {endsWith === 'parent' ? (
            <a className={styles.link} href={current.href}>
              {current.label}
            </a>
          ) : (
            <span aria-current="page" className={styles.current}>
              {current.label}
            </span>
          )}
        </li>
      </Cluster>
    </nav>
  );
}

/** The collapse's announced meaning. A sans sentence, so it is authored in sentence case. */
function levelsOmitted(n: number) {
  return n === 1 ? '1 level omitted' : `${n} levels omitted`;
}

/**
 * The separator: U+002F, in the label's own face.
 *
 * A text character rather than an Icon, so it aligns on the baseline and scales with the type for
 * free, needs no glyph request, and does not imply a direction or a control the way a chevron does
 * everywhere else in this system. `aria-hidden` because a solidus announced as "slash" three times
 * is noise — the ordered list already carries the structure.
 */
function Divider() {
  return (
    <span aria-hidden="true" className={styles.divider}>
      /
    </span>
  );
}
