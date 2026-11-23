import { Button, Cluster, Icon, Layout, Section, Tag } from '@/components';
import { BlockCard, PageHero } from '@/patterns';
import { ROUTES } from '@/lib/routes';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';

/**
 * Tag specimen — two variants, one size, one box, on all four surfaces.
 *
 * Three states deliberately have no props: hover, pressed and tab focus are the stylesheet's
 * business, driven by :hover, :active and :focus-visible. The spec's mockup printed them with a
 * `force` prop that exists only in a mockup and must never be implemented, so this page cannot
 * print them in a column — it says so where it matters rather than showing two states and calling
 * them five. Point at a chip, hold it down, and tab to it, on each of the four surfaces below.
 *
 * `selected` IS a real prop and is printed on every surface, because the held chip is the one
 * state this component's argument turns on: a REVERSED FILL on every surface — blue's model carried
 * to all four (tracker 2.17) — with the label and a `chrome-close` glyph turned to the opposite end.
 */

/* Eight labels spanning the measured range: 3 characters to 32, including both 31-character
   navigation labels the site actually ships. */
const HERO_TAGS = [
  'Lab',
  'Design systems',
  'Product Modernisation Assessment',
  'B2B SaaS and Workflow Software',
  'Research',
  'Front of house',
  'AI Products and Developer Tools',
  'Delivery',
] as const;

const SURFACES = [
  {
    surface: 'paper',
    note: 'The only ground either row stands on today, and the trap is exactly that. The mark sits on the system’s own warm tint at 1.12:1 — a change of paper rather than a drawn box. The chip is the inverse and paints nothing at rest: one neutral-600 hairline at 4.92:1, a box rather than a hint (400 measures 2.13:1 and fails the 3:1 outline floor). Hover a chip: blue arrives, and it arrives nowhere else. Held reverses: a neutral-950 fill under a paper label at 17.10:1 — the opposite end of the ramp from the mark’s 1.12:1 tint.',
  },
  {
    surface: 'tint',
    note: 'Two values move and each has a measurement behind it. The mark’s ground goes to neutral-200, because paper-deep on paper-deep is 1.00:1 — this surface IS the mark’s paper colour. The chip’s hairline steps to neutral-700 at 7.27:1, one firmer than paper’s, because this ground is one step down. Held is paper’s reversal unchanged — neutral-950 under a paper label. The rest is restated rather than inherited.',
  },
  {
    surface: 'ink',
    note: 'Every step runs the other way up. The chip’s rest label LIFTS to neutral-200 at 12.83:1 over a neutral-500 hairline at 5.41:1 — the paper relationship inverted, firmer meaning lighter. Hover takes the pale end of the blue ramp, not the deep end: brandeis-950 measures 1.07:1 on this ground. Held fills with paper under a neutral-950 label at 17.10:1, because on a dark section the loud state is the light one.',
  },
  {
    surface: 'blue',
    note: 'The one column where an outline cannot carry the whole ladder. Rest is brandeis-100 at 4.91:1, line and label alike — the tightest text cell in the component. Hover takes it to white, and there the ramp runs out: nothing is lighter than white and no dark ink clears the floor on #0048ff. So held fills — a white ground under a brandeis-700 label at 10.16:1, forced here first and now the model the other three surfaces follow. Tab to a chip here: the ring is white and its gap is the blue ground.',
  },
] as const;

/* Two filter groups, deliberately asymmetric: one holds a selection and one holds none, so the
   empty-group case sits beside the held one. THERE IS NO "ALL" CHIP — "all" is the absence of a
   filter, not a filter, and a group with nothing selected already says so by having no held chip
   in it. Clearing a group is the held chip's close glyph and nothing else. */
const FILTER_GROUPS = [
  {
    label: 'Format',
    options: ['Articles', 'Podcasts', 'Events', 'Research'],
    held: 'Podcasts',
  },
  {
    label: 'Expertise',
    options: ['Design Systems', 'AI Products and Developer Tools', 'Modernisation'],
    held: null,
  },
] as const;

const CLEAR = <Icon name="chrome-close" label="Clear filter" />;

/** A row of marks. The row is always a Cluster — the component owns no distance outside its box. */
function Marks({ items }: { items: readonly string[] }) {
  return (
    <Cluster as="ul" colGap="text" rowGap="tight">
      {items.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </Cluster>
  );
}

/**
 * The per-surface matrix, rendered with BYTE-IDENTICAL markup on all four grounds. That is the
 * whole point of the four bands: if a value drifts, it drifts here and nowhere else, because
 * nothing below is told which surface it is on.
 */
function Matrix() {
  return (
    <Layout rowGap="block">
      <Layout rowGap="tight">
        <p className={s.specTitle}>Inert marks — a ground with no edge, and no states at all</p>
        <Marks items={['Lab', 'Design systems', 'Research']} />
      </Layout>
      <Layout rowGap="tight">
        <p className={s.specTitle}>Filter chips — an edge with no ground at rest · rest, then held (filled)</p>
        <p className={s.specNote}>
          Hover, pressed and tab focus have no props and are not printed. Point at the first
          chip, hold it down, and tab to it — that is the rest of the specification on this
          ground.
        </p>
        <Cluster as="ul" colGap="text" rowGap="text">
          <li>
            <Tag variant="filter" href={ROUTES.insights}>
              Podcasts
            </Tag>
          </li>
          <li>
            <Tag variant="filter" href={ROUTES.insights}>
              A
            </Tag>
          </li>
          <li>
            <Tag variant="filter" href={ROUTES.insights} selected icon={CLEAR}>
              Podcasts
            </Tag>
          </li>
          <li>
            <Tag variant="filter" href={ROUTES.insights} selected icon={CLEAR}>
              AI Products and Developer Tools
            </Tag>
          </li>
        </Cluster>
      </Layout>
    </Layout>
  );
}

export default function TagSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h1>Tag</h1>
            <p>
              Two variants, one size, one box. The <strong>mark</strong> names what a page is
              filed under and does nothing; the <strong>filter</strong> offers a query and
              behaves like the control it is. They differ by an <strong>inversion</strong> — a
              ground with no edge against an edge with no ground — never by a degree, because
              two weights of one treatment read as one object twice.
            </p>
            <p>
              The component owns its box and nothing outside it. Every row on this page is a{' '}
              <code>Cluster</code>, and every gap belongs to it.
            </p>
          </Layout>

          <Specimen
            title="The two variants, side by side"
            note="Two static axes separate them before any state exists: ENCLOSURE (a 1.12:1 ground against a 3.16:1 outline) and VOICE (13px sans in the author’s case against 12px mono uppercase by role). Blue is not a third axis at rest — it is what arrives under the pointer."
          >
            <Cluster colGap="text" rowGap="text">
              <Tag>Design systems</Tag>
              <Tag>Product Modernisation Assessment</Tag>
              <Tag variant="filter" href={ROUTES.insights}>
                Podcasts
              </Tag>
              <Tag variant="filter" href={ROUTES.insights} selected icon={CLEAR}>
                Podcasts
              </Tag>
            </Cluster>
          </Specimen>

          <Specimen
            title="The slim mark — size sm, on an eyebrow line"
            note="Owner, 19 Nov 2026 (the case card's kind): a tag, not a chip. The mark's ground and no edge, so still inert, in a 20 box and the 11px micro mono, uppercase by role, so it reads as one more word of a mono eyebrow line. Here after a client eyebrow, a `tight` step apart (Cluster), and beside the md mark it replaces."
          >
            <Layout rowGap="block">
              <Cluster colGap="tight" rowGap="tight">
                <span className={s.eyebrow}>Auxentios</span>
                <Tag size="sm">New product</Tag>
              </Cluster>
              <Cluster colGap="text" rowGap="text">
                <Tag size="sm">New product</Tag>
                <Tag size="sm">Redesign</Tag>
                <Tag size="sm">Established product</Tag>
                <Tag>New product</Tag>
              </Cluster>
            </Layout>
          </Specimen>

          <Specimen
            title="A mark beside a chip — the collision that matters"
            note="An inert mark can never be mistaken for a SELECTED filter, because a held chip is a reversal to the far end of the ramp and a mark is a tint at 1.12:1. Two adjacent instances also prove the gap: Cluster owns it on both axes and neither tag contributes a margin, so these are exactly --gap-text apart with no collapsing and no double gap."
          >
            <Cluster as="ul" colGap="text" rowGap="text">
              <li>
                <Tag>Podcasts</Tag>
              </li>
              <li>
                <Tag variant="filter" href={ROUTES.insights}>
                  Podcasts
                </Tag>
              </li>
              <li>
                <Tag variant="filter" href={ROUTES.insights} selected icon={CLEAR}>
                  Podcasts
                </Tag>
              </li>
            </Cluster>
          </Specimen>
        </Layout>
      </Section>

      {/* ── Band: the page that decides it ──────────────────────────────────────
          Both variants on one page is the case this component was argued against, and /insights is
          where it happens. Squint at this band: the filter rows must read as a control surface and
          the card eyebrows below as metadata, without either shouting. */}
      <Section surface="tint">
        <Layout rowGap="stack">
          <Specimen
            title="/insights in miniature — the page that decides it"
            note="Two filter groups, one holding a selection and one holding none. No “All” chip: “all” is the absence of a filter, so a group with nothing selected says that by having no held chip. The held chip’s close glyph is the only way back to an unfiltered group, which is what makes it a control rather than a decoration."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {FILTER_GROUPS.map((group) => (
                <Layout key={group.label} rowGap="text">
                  <h3>{group.label}</h3>
                  <Cluster as="ul" colGap="text" rowGap="text">
                    {group.options.map((option) => (
                      <li key={option}>
                        <Tag
                          variant="filter"
                          href={ROUTES.insights}
                          selected={option === group.held}
                          icon={option === group.held ? CLEAR : undefined}
                        >
                          {option}
                        </Tag>
                      </li>
                    ))}
                  </Cluster>
                </Layout>
              ))}
            </Layout>
          </Specimen>

          <Specimen
            title="…and the cards under it, whose eyebrows carry the same taxonomy"
            note="Card metadata stays the joined string it is today. A Tag does not go inside a BlockCard’s eyebrow — that is out of scope, and a row of chips inside a card would compete with the card’s own title."
          >
            <Layout as="ul" columns={3} colGap="gutter" rowGap="gutter">
              {[
                {
                  t: 'What a design system owes its second team',
                  e: 'Article · Design systems',
                },
                { t: 'Modernisation without a rewrite', e: 'Guide · Modernisation' },
                { t: 'Shipping AI features people keep using', e: 'Podcast · AI products' },
              ].map((c) => (
                /* No <li> here: BlockCard's root IS the <li>, so wrapping it nests li in li — invalid
                   HTML, and the hydration mismatch this page used to throw at both widths. */
                <BlockCard
                  key={c.t}
                  eyebrow={c.e}
                  title={c.t}
                  body="One supporting paragraph, so the card carries the weight a real one would."
                />
              ))}
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      {/* ── Band: the hero ──────────────────────────────────────────────────────
          The real PageHero, with eight marks in its children slot. This is the argument for sans:
          a mono uppercase row eight lines under a mono uppercase eyebrow reads as a second eyebrow
          that has slipped down the page. Squint — the row should read as metadata about the page,
          not as a second label band. */}
      <PageHero
        eyebrow="Case study"
        title="A platform team’s second act"
        body={[
          'The hero is real: eyebrow, h1, lede, two actions, and the tag row in its children slot — which is exactly where ten route modules put it today.',
          'Eight marks, spanning the measured range from three characters to thirty-two, including both 31-character navigation labels the site ships.',
        ]}
        actions={[
          { label: 'Read the case study', href: ROUTES.caseStudies },
          { label: 'Talk to us', href: ROUTES.contact },
        ]}
        surface="paper"
      >
        <Marks items={HERO_TAGS} />
      </PageHero>

      {/* ── Bands: the four surfaces ────────────────────────────────────────────
          Sibling Sections, identical markup, one per ground. */}
      {SURFACES.map((sf) => (
        <Section key={sf.surface} surface={sf.surface}>
          <Layout rowGap="block">
            <p className={s.eyebrow}>surface = {sf.surface}</p>
            <Matrix />
            <p className={s.specNote}>{sf.note}</p>
          </Layout>
        </Section>
      ))}

      {/* ── Band: the nested case ───────────────────────────────────────────────
          The failure this token layer exists to prevent: a tint panel inside an ink section. The
          chip is the part that depends on the surface having been declared, because at rest it
          paints no ground and its label sits directly on whatever is behind it. */}
      <Section surface="ink">
        <Layout rowGap="block">
          <p className={s.eyebrow}>tint panel nested inside an ink section</p>
          <p className={s.specNote}>
            Every one of the eleven colour tokens is declared in full in all four surface
            blocks, so the nearest <code>data-surface</code> ancestor resolves the whole set and
            nothing inherits half of one. These marks and chips must be identical to the tint
            band above, not to the ink band around them.
          </p>
          <Section as="div" surface="tint">
            <Matrix />
          </Section>
        </Layout>
      </Section>

      {/* ── Band: section 12, every row ─────────────────────────────────────────
          Each tile is one edge case from the spec, labelled with what it decides. */}
      <Section>
        <Layout rowGap="stack">
          <h2>Content edge cases</h2>

          <Specimen
            title="1 · Longest realistic string, both variants — one line, always"
            note="229.88 × 24 as a mark, 267.96 × 24 as a filter, both one line in the 392px track a filter group actually gets and in the 311px column a 375px phone gives. Nothing wraps, for the reason no Button wraps."
          >
            <Cluster colGap="text" rowGap="text">
              <Tag>Product Modernisation Assessment</Tag>
              <Tag variant="filter" href={ROUTES.insights}>
                AI Products and Developer Tools
              </Tag>
            </Cluster>
          </Specimen>

          <Specimen
            title="2 · One long unbroken token, and 8 · the narrow track — the only cases that reach the clip"
            note="Both rows are --lay-track-sm, 256px. The URL and the 31-character chip (267.96 natural) both exceed it, so this is the one condition under which anything is ever clipped. ABOVE, in a Layout: the track has a definite width, max-inline-size caps the box and overflow takes the remainder — clipped at the inline end, not wrapped and not scrolled. No ellipsis, because text-overflow needs a block container, which is an inner element this component deliberately does not have, and a tidy “…” would make a content defect look intentional. BELOW, the same two labels in a Cluster as='ul': here the li is the flex item, and at the default min-width:auto it takes its minimum from the nowrap text inside it — so the ROW is pushed past the track instead of the box clipping. This row sits in a box that scrolls on its own, so the push is visible without the page scrolling sideways at 390. Compare the two. The fix is min-inline-size:0 on the flex item, which belongs to Cluster and not to Tag; it is filed as the spec’s Q13."
          >
            <Layout rowGap="block">
              <Layout rowGap="text" className={s.trackSm}>
                <p className={s.specTitle}>In a Layout track — the box clips</p>
                <Tag>https://tcules.com/insights/articles/a-very-long-slug-indeed</Tag>
                <Tag variant="filter" href={ROUTES.insights}>
                  AI Products and Developer Tools
                </Tag>
              </Layout>
              {/* The pushed row is the documented boundary (Q13), and it is SUPPOSED to exceed its
                  track — at 390 the URL's 376px row is wider than the 326px column itself. So the
                  256px track sits in a full-width box that scrolls on its own, the idiom
                  /design/cluster uses for its nowrap row: at 1440 the push past the track is in
                  plain view, and at 390 it scrolls inside the box rather than dragging the page.
                  Nothing is clipped: scroll the box and the whole row is there. */}
              <div className={s.scrollX}>
                <Layout rowGap="text" className={s.trackSm}>
                  <p className={s.specTitle}>In a Cluster — the row is pushed instead</p>
                  <Cluster as="ul" colGap="text" rowGap="text">
                    <li>
                      <Tag>https://tcules.com/insights/articles/a-very-long-slug-indeed</Tag>
                    </li>
                    <li>
                      <Tag variant="filter" href={ROUTES.insights}>
                        AI Products and Developer Tools
                      </Tag>
                    </li>
                  </Cluster>
                </Layout>
              </div>
            </Layout>
          </Specimen>

          <Specimen
            title="3 · Zero items · 4 · one item"
            note="Zero is the CALLER’s case and there is nothing to show: the caller renders no Cluster at all, not an empty one, so there is no seam and no stray gap. Tag itself has no zero case — it is one mark. One item renders one mark; nothing in the component knows how many siblings it has."
          >
            <Marks items={['Lab']} />
          </Specimen>

          <Specimen
            title="5 · Many items — 16, twice the expected ceiling"
            note="The ROW wraps to as many lines as it needs at whichever rowGap the caller passed — that is Cluster’s wrap, and it is the only wrapping on this page. Each tag stays one line inside it. Nothing collapses and there is no “+3 more”."
          >
            <Marks
              items={[
                ...HERO_TAGS,
                'Discovery',
                'Platform',
                'Strategy',
                'Content and Knowledge Platforms',
                'Workshops',
                'Measurement',
                'Accessibility',
                'Migration',
              ]}
            />
          </Specimen>

          <Specimen
            title="6 · Missing optional slot — a chip with no glyph"
            note="The empty case is the ordinary one: every chip but the held one passes no glyph. No reserved space, no placeholder box, no layout shift for the chips that never get one. The held chip beside it is 21px wider — 16 glyph (the counter floor, Icon.md), 4 gap, and the 1px label trim restored, because the trailing element is no longer a tracked capital."
          >
            <Cluster colGap="text" rowGap="text">
              <Tag variant="filter" href={ROUTES.insights}>
                Podcasts
              </Tag>
              <Tag variant="filter" href={ROUTES.insights} selected icon={CLEAR}>
                Podcasts
              </Tag>
            </Cluster>
          </Specimen>

          <Specimen
            title="7 · Empty required-ish text — the failure, made lookable-at"
            note="children is '' and '   '. Both render NOTHING and warn in development, matching BlockCard’s handling of a whitespace title. The alternative is what would otherwise be here: a 24 × 24 empty box, and for the filter a focusable control with no accessible name. Returning null is the only handling that cannot ship a nameless target — so this tile is deliberately blank, and the blankness is the pass."
          >
            <Cluster colGap="text" rowGap="text">
              <Tag>{''}</Tag>
              <Tag variant="filter" href={ROUTES.insights}>
                {'   '}
              </Tag>
              <span className={s.specNote}>← nothing renders, and that is correct</span>
            </Cluster>
          </Specimen>

          <Specimen
            title="9 · A parent that does not size it, and the narrowest target"
            note="The minimum is 24 in BOTH axes, so a one-character chip is a 24 × 24 square that meets SC 2.5.8 by size rather than by the spacing exception. There is no block padding to absorb, so on one line the minimum IS the height — 24, at every width, for both variants. Measure them."
          >
            <Layout className={s.trackXs} rowGap="text">
              <Cluster colGap="text" rowGap="text">
                <Tag variant="filter" href={ROUTES.insights}>
                  A
                </Tag>
                <Tag>A</Tag>
                <Tag>Lab</Tag>
              </Cluster>
            </Layout>
          </Specimen>

          <Specimen
            title="12 · A mark in a dd — the same mark, outside a hero"
            note="Neither variant emits its own li and neither requires one. Cluster as='ul' supplies it at all eleven call sites today; here the caller is a definition list instead, and the mark is unchanged."
          >
            <dl>
              <dt className={s.specTitle}>Filed under</dt>
              <dd>
                <Cluster colGap="text" rowGap="tight">
                  <Tag>Design systems</Tag>
                  <Tag>Research</Tag>
                </Cluster>
              </dd>
            </dl>
          </Specimen>

          <Specimen
            title="Ring clearance — the arithmetic in section 9, made lookable-at"
            note="Tab into this row. The ring reaches 4px past the box (2 offset + 2 width) against 16px of gap on both axes, so a focused chip clears its neighbours with 12px to spare either way. The row below is at rowGap='tight' (8) — legal, and the reason the filter rows do not use it: a 24px target 8px from the next one is the case that made the row gap step up."
          >
            <Layout rowGap="block">
              <Cluster as="ul" colGap="text" rowGap="text" className={s.trackMd}>
                {['Articles', 'Podcasts', 'Events', 'Research', 'Guides'].map((o) => (
                  <li key={o}>
                    <Tag variant="filter" href={ROUTES.insights}>
                      {o}
                    </Tag>
                  </li>
                ))}
              </Cluster>
              <Cluster as="ul" colGap="tight" rowGap="tight" className={s.trackMd}>
                {['Articles', 'Podcasts', 'Events', 'Research', 'Guides'].map((o) => (
                  <li key={o}>
                    <Tag variant="filter" href={ROUTES.insights}>
                      {o}
                    </Tag>
                  </li>
                ))}
              </Cluster>
            </Layout>
          </Specimen>

          <Specimen
            title="Beside the control it replaces — the size argument, made lookable-at"
            note="Today’s selected filter on /insights is a ghost Button at --btn-height-sm 32 with extendHitArea. The chip beside it is 24. The filter rows get SHORTER when Tag lands, and that is the point: a tag is a mark in a row of text, not a control the height of a button. The cost is stated rather than hidden — 24 meets the AA target floor exactly, so the caller’s rowGap='text' is what keeps two targets apart, and no hit area is extended."
          >
            <Cluster colGap="text" rowGap="text">
              <Button
                as="a"
                href={ROUTES.insights}
                emphasis="ghost"
                tone="neutral"
                size="sm"
                active
                extendHitArea
              >
                Podcasts
              </Button>
              <Tag variant="filter" href={ROUTES.insights} selected icon={CLEAR}>
                Podcasts
              </Tag>
            </Cluster>
          </Specimen>

          <Specimen
            title="Measured boxes — the numbers the spec quotes, so they can be checked rather than believed"
            note="These are the spec’s § 7(b) figures, and every box that produces them is on this page. Measure them in devtools; if a box disagrees with a number here, the spec is wrong and not the code. mark 3 chars 38.24 × 24.00 · mark 32 chars 229.88 × 24.00 · filter 8 chars 80.28 × 24.00 · filter 8 chars held 101.28 × 24.00 · filter 1 char 24.00 × 24.00 · filter 31 chars 267.96 × 24.00. Every height is 24, at every width, which is what the nowrap rule buys."
          >
            <Cluster colGap="text" rowGap="text">
              <Tag>Lab</Tag>
              <Tag>Product Modernisation Assessment</Tag>
              <Tag variant="filter" href={ROUTES.insights}>
                Podcasts
              </Tag>
              <Tag variant="filter" href={ROUTES.insights} selected icon={CLEAR}>
                Podcasts
              </Tag>
              <Tag variant="filter" href={ROUTES.insights}>
                A
              </Tag>
              <Tag variant="filter" href={ROUTES.insights}>
                AI Products and Developer Tools
              </Tag>
            </Cluster>
          </Specimen>
        </Layout>
      </Section>
    </>
  );
}
