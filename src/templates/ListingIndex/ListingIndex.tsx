import type { ReactElement, ReactNode } from 'react';

import { Button, Icon, Layout, Section, type MediaImage } from '@/components';
import { heroTrail } from '@/lib/trail';
import {
  Breadcrumbs,
  CtaSection,
  IndexRail,
  PageHero,
  type BreadcrumbItem,
  type HeroAction,
  type HeroStat,
} from '@/patterns';

import { FinderForm, FinderLinks } from './Finder';
import styles from './ListingIndex.module.css';

/* ── The page type's shape ─────────────────────────────────────────────────────────
   One structure for every listing (owner, 22 Oct 2026: /insights and /case-studies "should share
   the exact same structure so any updates to one should apply to the other"). What differs between
   two listings is DATA handed in here — the hero's words, the views and their sections, which card
   a section's pieces take, the close — never a branch on which listing it is. A section's pieces
   arrive composed (`content`), so the template places them and never learns what they are: the
   insights compositions (insights.tsx) and the case groups (cases.tsx) are two answers to "what goes
   in a section", built beside it in this folder. */

/** The listing's opening: the title alone, the lede and its figures beside it (PageHero `masthead`). */
export type ListingHero = {
  title: string;
  /** The opening paragraphs, beside the title's last baseline from 1024. */
  lede?: readonly string[];
  /** The line above the title, as authored. */
  eyebrow?: string;
  /**
   * The record as figures under the lede (PageHero `stats`): the number large, what it counts small.
   * Never a mono line of facts (owner, 29 Oct 2026; decisions/2026-10-29-studio-record-is-figures).
   */
  stats?: readonly HeroStat[];
};

/**
 * A listing's close, on its own: the band ListingIndex ends on, for a page in the listing's family
 * that is not itself a ListingIndex (the author pages, 1 Nov 2026), so the two end the same way.
 *
 * The close is an ask, so it renders only WITH its ask: the form beside the copy, else the action
 * under it, the open close an ink island on paper (decisions/2026-10-29-cta-band-is-an-ink-island).
 * A conversation glyph is the eye's entry into it, as every corpus close has.
 */
export function ListingClose({
  closing,
  lead,
}: {
  closing?: ListingClosing;
  /**
   * The close's lead line, where the page around it says something the listing's own line cannot
   * (the authors index shows people, not pieces, so "If one of these pieces…" points at nothing).
   * Absent, the closing's own `body`: the hub and every page that leaves it unset are unchanged.
   */
  lead?: string;
}) {
  const body = (lead ?? closing?.body)?.trim();
  if (closing?.form) {
    return (
      <CtaSection
        id={closing.id}
        island={closing.island?.surface ?? 'blue'}
        islandArrangement="halves"
        islandTexture="flow"
        art={closing.island?.art}
        eyebrow={closing.eyebrow || undefined}
        heading={closing.heading}
        body={body ? [body] : undefined}
        form={closing.form}
      />
    );
  }
  if (closing?.action) {
    return (
      <CtaSection
        id={closing.id}
        arrangement="open"
        eyebrow={closing.eyebrow || undefined}
        mark={<Icon name="chat-round-dots" size="xl" />}
        heading={closing.heading}
        body={body ? [body] : undefined}
        actions={[closing.action]}
      />
    );
  }
  return null;
}

/**
 * One section of a view: a jump target in the rail, a one-line head and its pieces. The head is the
 * same grammar in every listing (beauty round 3, 16 Oct 2026; 22 Oct 2026): the name as an h3-scale
 * serif h2 and, on its baseline at the row's end, the way to all of it ("See more →").
 */
export type ListingSection = {
  /** The section's anchor, unique across every view (every view is in the HTML). */
  id: string;
  heading: string;
  /** The way to all of it, where the section shows a selection: always "See more" (owner, 23 Oct
      2026: one label on every head, never a count). */
  link?: { href: string };
  /** How many pieces it holds: the rail's collapsed bar uses it; the rail's rows never show it. */
  count?: number;
  /** The section's pieces, composed by the caller. */
  content: ReactNode;
};

/** One way of curating the listing (BY TYPE, BY TOPIC, BY STAGE …) and its sections. */
export type ListingView = {
  /** The view's value in the URL (`?view=`). The first view is the default. */
  id: string;
  /** The switch's label ("By type"). */
  label: string;
  sections: readonly ListingSection[];
};

/**
 * The rail as the listing's FINDER (Jatin, 26 Oct 2026; owner, 28 Oct 2026): the search and the
 * filter groups in the rail's place, the same spot on every visit. Nothing picked, the content is the
 * curated view; anything picked, it is the picks as removable chips, then the results. The URL holds
 * every pick, and a tick applies at once without moving the page.
 */
export type ListingFinder = {
  /** The page's own path: the form's target. */
  action: string;
  /** The query in effect, as a string: the controls re-render from the URL when it changes. */
  query: string;
  /** The search and the groups, composed by the caller (its fields are the query). */
  controls: ReactNode;
  /** The phone bar's button ("Filters · 2"). */
  label?: string;
  /** The picks over the results: present only when something is picked. */
  picks?: ReactNode;
  /** The results: present only when something is picked. Absent, the curated view. */
  results?: ReactNode;
};

/** Another offer before the close (the insights family's Lab): shown ONLY with its picture. */
export type ListingOffer = {
  heading: string;
  body?: string;
  action: HeroAction;
  image?: MediaImage;
};

/**
 * The page's close: the copy and the ask on an island before the ink footer. The form is composed by the
 * caller and handed over (a template's slot, as every corpus close takes it); a close with only an
 * action takes the open arrangement; a close with neither is not rendered.
 */
export type ListingClosing = {
  /** The close's anchor, so a hero's "#enquiry" lands on it. */
  id?: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  form?: ReactElement;
  action?: HeroAction;
  /**
   * The island close, as home has it (owner, 23 Oct 2026: "replace the enquiry form with the island
   * that we have"): the art, heading and lede beside the form on a blue or ink island on a paper band,
   * in home's halves with the moving field across it (owner, 28 Oct 2026: "the one with the moving
   * texture is preferred").
   * Taken only with a `form`, and a form is ALWAYS on it (owner, 29 Oct 2026;
   * decisions/2026-10-29-forms-only-on-the-island): absent, the island is blue with no drawing.
   */
  island?: { surface: 'blue' | 'ink'; art?: ReactElement };
};

export type ListingIndexProps = {
  breadcrumbs: readonly BreadcrumbItem[];
  hero: ListingHero;
  /** The listing band's accessible name ("Insights", "Case studies"). */
  label: string;
  /** The rail's accessible name ("Browse insights"). */
  railLabel: string;
  /** The curated views, switched in the rail and held in `?view=`. */
  views?: readonly ListingView[];
  /** The view the page opens on: the route reads it from `?view=`. Absent, the first. */
  view?: string;
  /** The rail as the finder; the first view is the curated content while nothing is picked. */
  finder?: ListingFinder;
  /** What the band says when there is nothing to list ("Nothing has been published yet."). */
  empty: string;
  offer?: ListingOffer;
  closing?: ListingClosing;
  /**
   * The page's own bands around the listing, composed by the caller (component-map C13): what a
   * listing's copy authors besides its list — the client wall under the opening, the proof wall and
   * the FAQ after it. Placed, never shaped, here: each arrives a whole band (its Section, its ground),
   * so the template learns no listing's words. The caller keeps two tints from touching.
   */
  bands?: ListingBands;
};

/** Where a listing's own bands sit: under the opening, after the list, after the close. */
export type ListingBands = {
  /** Between the opening and the list (a client wall). */
  afterHero?: ReactNode;
  /** Between the list (and any offer) and the close (a proof wall, an FAQ before a link-only close). */
  afterListing?: ReactNode;
  /** After the close (the FAQ, where the enquiry form comes before it: `formBeforeFaq`). */
  afterClose?: ReactNode;
};

/** The finder's content column: where a change of picks brings a reader scrolled past it back to. */
const FINDER_TOP = 'listing-results';

/** The fold rule's one exception, on the list band (visual-direction § 1.3). */
const FOLD_EXEMPT =
  "Index list: the page's whole content, grows with the CMS and is read by scrolling (visual-direction § 1.3).";

/**
 * ListingIndex — the listing page type: the insights hub and the case-study index, after
 * claude.com/resources (owner, 16 Oct 2026; one structure, 22 Oct 2026).
 *
 *   A  hero     the trail, the title, the lede and figures beside it (`masthead`), the texture
 *   B  listing  the rail beside the column: a switch of curated VIEWS (each a run of sections, every
 *               section a one-line head over its pieces, a `section` apart; every view is in the HTML,
 *               the switch shows one and holds it in `?view=`), or the FINDER — the filters in the
 *               rail, the curated view until something is picked, then the picks over the results
 *               (2026-10-29-insights-hub-is-the-finder)
 *   C  offer    another offer, on tint — only with its picture
 *   D  close    the ask: the copy and the form (the island close where the caller asks for one)
 *
 * The listing's own bands (`bands`: a client wall, a proof wall, an FAQ) sit after A, after B/C and
 * after D, in the copy's order.
 */
export function ListingIndex({
  breadcrumbs,
  hero,
  label,
  railLabel,
  views = [],
  view,
  finder,
  empty,
  offer,
  closing,
  bands,
}: ListingIndexProps) {
  const lede = (hero.lede ?? []).filter((paragraph) => paragraph.trim());
  const shown = views
    .map((v) => ({ ...v, sections: v.sections.filter((section) => section.content) }))
    .filter((v) => v.sections.length > 0);

  let listing: ReactNode;
  if (finder) {
    const curated = shown[0];
    listing = (
      <IndexRail
        ariaLabel={railLabel}
        modes={[{ id: 'finder', label: railLabel, items: [] }]}
        controlsLabel={finder.label}
        controls={
          <FinderForm key={finder.query} action={finder.action} anchor={FINDER_TOP}>
            {finder.controls}
          </FinderForm>
        }
      >
        <div id={FINDER_TOP}>
          {finder.picks != null ? (
            /* The picks lead the column, then the results: a stack apart, as a head over its body.
               With nothing matching, the picks stay ("Nothing matches", each chip, Clear all) rather
               than the page falling back to the curated view and losing them. */
            <Layout rowGap="stack">
              <FinderLinks anchor={FINDER_TOP}>{finder.picks}</FinderLinks>
              {finder.results != null ? (
                <FinderLinks anchor={FINDER_TOP}>{finder.results}</FinderLinks>
              ) : null}
            </Layout>
          ) : curated ? (
            <Layout rowGap="section-open">
              {curated.sections.map((section) => (
                <ListingSectionView key={section.id} section={section} />
              ))}
            </Layout>
          ) : (
            <p>{empty}</p>
          )}
        </div>
      </IndexRail>
    );
  } else if (shown.length > 0) {
    listing = (
      <IndexRail
        ariaLabel={railLabel}
        initialMode={view}
        param="view"
        modes={shown.map((v) => ({
          id: v.id,
          label: v.label,
          items: v.sections.map((section) => ({
            label: section.heading,
            href: `#${section.id}`,
            count: section.count,
          })),
          panel: (
            /* Groups open as chapters: section-open between them, against the 64 seams inside one. */
            <Layout rowGap="section-open">
              {v.sections.map((section) => (
                <ListingSectionView key={section.id} section={section} />
              ))}
            </Layout>
          ),
        }))}
      />
    );
  } else {
    listing = <p>{empty}</p>;
  }

  return (
    <>
      <PageHero
        data-fold-hero=""
        trail={heroTrail(breadcrumbs, hero.title, (t) => (
          <Breadcrumbs {...t} />
        ))}
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={lede.length > 0 ? (lede as [string, ...string[]]) : undefined}
        stats={hero.stats}
        arrangement="masthead"
        texture
        surface="paper"
      />

      {bands?.afterHero}

      {/* The fold rule's one exception on a listing: the list is the page's whole content, grows with
          the CMS and is read by scrolling, so no height could hold it. fold:check reports it with this
          reason and still measures the hero and the close. */}
      <Section surface="paper" aria-label={label} data-fold-exempt={FOLD_EXEMPT}>
        {listing}
      </Section>

      {offer?.image ? (
        <CtaSection
          arrangement="offer"
          surface="tint"
          heading={offer.heading}
          body={offer.body?.trim() ? [offer.body] : undefined}
          actions={[offer.action]}
          media={{ image: offer.image }}
        />
      ) : null}

      {bands?.afterListing}

      <ListingClose closing={closing} />

      {bands?.afterClose}
    </>
  );
}

/**
 * One section of a view: a jump target with its one-line head over its pieces, a `stack` apart
 * (owner, 22 Oct 2026: at `gutter` the head sat too close to its pieces). The head is a signpost:
 * no eyebrow and no lead sentence, so the first piece under it is the loudest thing in the section,
 * and the section ends on its last piece rather than on a link.
 */
function ListingSectionView({ section }: { section: ListingSection }) {
  const headingId = `${section.id}-heading`;
  return (
    <section id={section.id} aria-labelledby={headingId} className={styles.section}>
      <Layout rowGap="stack">
        {/* The link at the heading's end, vertically centred on it, as every head's end action
            (owner, 29 Oct 2026; decisions/2026-10-29-head-end-action-centred-on-heading). */}
        <Layout columns={{ base: [1, 'auto'] }} colGap="block" align="center">
          <h2 id={headingId} className={styles.sectionTitle}>
            {section.heading}
          </h2>
          {section.link ? (
            <Button
              as="a"
              href={section.link.href}
              emphasis="link"
              tone="primary"
              icon={<Icon name="arrow-right" />}
              aria-describedby={headingId}
            >
              See more
            </Button>
          ) : null}
        </Layout>
        {section.content}
      </Layout>
    </section>
  );
}
