import type { ReactNode } from 'react';

import { Cluster, Layout, Section, type MediaImage, type SectionSurface } from '@/components';
import { ListCard, ReadDown, type ListCardMarker, type ReadDownRow } from '@/patterns';
import { getKitPhoto } from '@/lib/photos';
import { ROUTES } from '@/lib/routes';

import { Box, Specimen, specimenStyles as s } from '../_specimen/Specimen';

/* ReadDown rows (specimen § 12): one long body against short ones, so the level rules can be seen. */
const READ_DOWN: readonly ReadDownRow[] = [
  {
    icon: 'layers',
    title: 'A product model',
    body: 'The objects, states and rules the product runs on, agreed once by everyone who builds on it.',
  },
  {
    icon: 'document-text',
    title: 'A decision record',
    body: 'Every consequential call, with its evidence.',
  },
  {
    icon: 'code',
    title: 'Coded prototypes',
    body: 'Working surfaces your team can open and test.',
  },
  {
    icon: 'checklist',
    title: 'A ranked list of fixes',
    body: 'Each one costed and sequenced.',
  },
];

/* ── Thumbnail records ────────────────────────────────────────────────────────────
   Whole `MediaImage` records, the shape a page receives from `@/content`. The kind is the record's,
   and Media draws the edge from it; ListCard only owns the 160 × 16:9 box. The assets are the brand
   framework's own (the Media specimen's set), not 2560 masters — this proves the mechanism. */

/* One part, no panel: a single workflow node whose own edge holds against the light grounds. The
   ch05 § 9 case for a case-study thumbnail. Portrait, so the 16:9 fill crops it top and bottom —
   which is what the central-safe-area supply rule is for. */
const CUT_OUT: MediaImage = {
  src: '/design/media/cutout-node.png',
  alt: 'One workflow node: an AI feature card with a provider field.',
  width: 902,
  height: 1088,
  kind: 'cut-out',
};

/* A light-UI part whose pale edge does not hold 3:1 against paper — the B5 case, on a panel. It is
   3:2, so the 16:9 crop takes a sliver top and bottom and the inset decides what is left of it. */
const PANEL_PART: MediaImage = {
  src: '/design/media/cutout-reviews.png',
  alt: 'Review-analysis panel: user reviews summarised as benefit chips.',
  width: 855,
  height: 570,
  kind: 'cut-out',
  panel: 'paper-deep',
};

/* One illustration shape: never boxed, never on blue (ch05 § 4a). The insight/resource case. */
const ILLUSTRATION: MediaImage = {
  src: '/design/media/illustration-seam.svg',
  alt: '',
  width: 881,
  height: 544,
  kind: 'illustration',
};

/* A capture, with derived widths, so its srcset has the 320 rung a 160 `sizes` asks for at 2×.
   OFF-BRAND at this size — a whole screen is a flat capture at full column only (ch05 § 2), and § 9
   gives the thumbnail no edge — rendered so the hairline M3 gives it is visible, not hidden. */
const CAPTURE: MediaImage = {
  src: '/design/media/capture-listing.webp',
  alt: 'Listing editor with bullet fields and an assistance panel.',
  width: 1436,
  height: 883,
  kind: 'capture',
  sources: [320, 652, 1240].map((width) => ({
    src: `/design/media/capture-listing-${width}.jpg`,
    width,
  })),
};

/* No kind: what every record is until Strapi records one (strapi-changes.md 3). Renders as a
   capture (M3), hairline and all — the same off-brand edge as above, arriving by default. */
const KINDLESS: MediaImage = {
  src: '/design/list-card-sample.svg',
  alt: '',
  width: 480,
  height: 320,
};

const thumb = (image: MediaImage): ListCardMarker => ({ type: 'thumbnail', image });

/* Off tcules.com, for the external rows. A literal on purpose: ROUTES names this site's paths, and
   an external destination is by definition not one of them. */
const EXTERNAL_HREF = 'https://www.figma.com/community';

const TERMS = [
  {
    title: 'Service blueprint',
    body: 'A shared view of the customer journey, the operational handoffs and the evidence each step produces.',
  },
  {
    title: 'Decision model',
    body: 'The smallest set of product rules a team needs to make the same call without another meeting.',
  },
  {
    title: 'Interaction contract',
    body: 'The states, language and response a control promises before visual treatment is added.',
  },
  {
    title: 'Evidence map',
    body: 'A record of which claims are measured, assumed or still waiting for a source.',
  },
  {
    title: 'Release slice',
    body: 'A coherent outcome small enough to ship and complete enough for a customer to judge.',
  },
] as const;

const SAMPLES = [
  'Recruit active customers',
  'Include recent cancellations',
  'Balance account sizes',
  'Separate buyers from users',
  'Cover assisted onboarding',
  'Include self-serve onboarding',
  'Represent support teams',
  'Find one failed rollout',
  'Find one successful rollout',
  'Include the longest-standing account',
  'Include a new account',
  'Reserve two replacements',
] as const;

const LINKED = [
  {
    title: 'Product design',
    body: 'Turn a difficult workflow into a product people can understand and operate.',
    href: ROUTES.productDesign,
    marker: { type: 'icon', name: 'document-text' },
  },
  {
    title: 'Design systems',
    body: 'Build the decisions and reusable parts that keep a product coherent as it grows.',
    href: ROUTES.designSystems,
    marker: { type: 'icon', name: 'check-circle' },
  },
  {
    title: 'Design engineering',
    body: 'Carry interaction decisions into production without losing their intent.',
    href: ROUTES.designEngineering,
    marker: { type: 'icon', name: 'copy' },
  },
] as const satisfies readonly {
  title: string;
  body: string;
  href: string;
  marker: ListCardMarker;
}[];

const SURFACES: readonly { surface: SectionSurface; note: string }[] = [
  {
    surface: 'paper',
    note: 'Neutral-900 title, blue marker and numeral at rest, neutral-700 body; a linked title takes brandeis-500 on hover and focus and 700 on press. A boxed tile: neutral-300 edge, paper-deep ground on hover, neutral-100 on press.',
  },
  {
    surface: 'tint',
    note: 'The text and link ramps still pass unchanged; the rule and the box edge step to neutral-400, and a boxed tile hovers to neutral-100.',
  },
  {
    surface: 'ink',
    note: 'Title lifts to white, body to neutral-300, accent to brandeis-300 (a linked title 300 on hover, 50 on press). The box edge is neutral-700 and hovers to a neutral-900 ground.',
  },
  {
    surface: 'blue',
    note: 'Only the light end clears AA: a linked title 100 on hover, 50 on press, with a white focus ring against its blue gap. The box edge is brandeis-300 and hovers to a brandeis-600 ground.',
  },
] as const;

/* The boxed tiles (frame="box", owner 7 Oct 2026): an icon router of linked destinations, the shape
   the box exists for. Rendered on all four surfaces with identical markup. */
const BOXED = [
  {
    title: 'Product redesign',
    body: 'The cost sits in the experience, and the model underneath still holds.',
    href: ROUTES.productDesign,
    marker: { type: 'icon', name: 'ruler-pen' },
  },
  {
    title: 'Design systems',
    body: 'Every screen rebuilds the same component a little differently.',
    href: ROUTES.designSystems,
    marker: { type: 'icon', name: 'widget' },
  },
  {
    title: 'Software development',
    body: 'The change is decided, and it needs building and shipping.',
    href: ROUTES.softwareDevelopment,
    marker: { type: 'icon', name: 'code' },
  },
] as const satisfies readonly {
  title: string;
  body: string;
  href: string;
  marker: ListCardMarker;
}[];

const TILES_ICON = [
  {
    title: 'Sales',
    body: 'Sees an ageing product.',
    marker: { type: 'icon', name: 'graph-up' },
  },
  {
    title: 'Support',
    body: 'Sees recurring exceptions.',
    marker: { type: 'icon', name: 'chat-round-dots' },
  },
  {
    title: 'Engineering',
    body: 'Sees dependencies that make every change expensive.',
    marker: { type: 'icon', name: 'code' },
  },
  {
    title: 'A polished AI interaction',
    body: 'May be hiding what the model used, what it changed, and who is accountable when it is wrong.',
    marker: { type: 'icon', name: 'users-group-rounded' },
  },
] as const satisfies readonly { title: string; body: string; marker: ListCardMarker }[];

const TILES_STEPS = [
  {
    title: 'Read the real work',
    body: 'What triggers the change, who decides, who is affected.',
  },
  { title: 'Settle the product model', body: 'The job, dependency, owner and committed date.' },
  { title: 'Design the behaviour', body: 'Preview affected work before confirming.' },
  {
    title: 'Test the risky scenario',
    body: 'Conflicting jobs, limited permissions, partial updates.',
  },
  {
    title: 'Keep the rule in the build',
    body: 'States, responses and history use the same rule.',
  },
] as const;

const NESTED_SURFACE_TOKENS = {
  tint: [
    ['--lcrd-title-ink', '--color-neutral-900'],
    ['--lcrd-body-ink', '--color-neutral-700'],
    ['--lcrd-marker-ink', '--color-brandeis-500'],
    ['--lcrd-number-ink', '--color-brandeis-500'],
    ['--lcrd-link-ink', '--color-brandeis-500'],
    ['--lcrd-link-ink-pressed', '--color-brandeis-700'],
    ['--lcrd-rule-ink', '--color-neutral-400'],
    ['--lcrd-ground-hover', '--color-neutral-100'],
    ['--lcrd-ground-pressed', '--color-neutral-200'],
    ['--lcrd-ring-color', '--color-brandeis-500'],
    ['--lcrd-ring-gap-color', '--color-paper-deep'],
  ],
  ink: [
    ['--lcrd-title-ink', '--color-white'],
    ['--lcrd-body-ink', '--color-neutral-300'],
    ['--lcrd-marker-ink', '--color-brandeis-300'],
    ['--lcrd-number-ink', '--color-brandeis-300'],
    ['--lcrd-link-ink', '--color-brandeis-300'],
    ['--lcrd-link-ink-pressed', '--color-brandeis-50'],
    ['--lcrd-rule-ink', '--color-neutral-700'],
    ['--lcrd-ground-hover', '--color-neutral-900'],
    ['--lcrd-ground-pressed', '--color-neutral-800'],
    ['--lcrd-ring-color', '--color-brandeis-300'],
    ['--lcrd-ring-gap-color', '--color-neutral-950'],
  ],
} as const;

function Rows({ ordered = false, children }: { ordered?: boolean; children: ReactNode }) {
  return (
    <Layout as={ordered ? 'ol' : 'ul'} rowGap="none">
      {children}
    </Layout>
  );
}

function ResolvedTokens({ surface }: { surface: keyof typeof NESTED_SURFACE_TOKENS }) {
  return (
    <Layout as="dl" rowGap="tight">
      {NESTED_SURFACE_TOKENS[surface].map(([token, value]) => (
        <Cluster as="div" key={token} colGap="inline" rowGap="inline" align="baseline">
          <dt>
            <code>{token}</code>
          </dt>
          <dd>
            <code>{value}</code>
          </dd>
        </Cluster>
      ))}
    </Layout>
  );
}

/** Identical markup for the four-surface and nested-surface proofs. */
function SurfaceRows() {
  return (
    <Rows ordered>
      <ListCard
        arrangement="stacked"
        title="Define the decision before the interface"
        body="The static row proves title, body, number marker and base rule together."
        marker={{ type: 'number', value: 1 }}
      />
      <ListCard
        arrangement="stacked"
        title="The same numeral in its neutral tone"
        body="marker tone neutral: the ordinal steps out of the accent into the surface's quiet grey."
        marker={{ type: 'number', value: 2, tone: 'neutral' }}
      />
      <ListCard
        title="Design systems"
        body="The linked row: no arrow. Hover or Tab — the title takes the link ink, and the ring runs round the row."
        marker={{ type: 'icon', name: 'check-circle' }}
        href={ROUTES.designSystems}
      />
      <ListCard
        title="A case study, told off-site"
        body="A cut-out thumbnail, and the one glyph a linked row keeps: the small up-right arrow that says it leaves the site."
        marker={thumb(CUT_OUT)}
        href={EXTERNAL_HREF}
        external
      />
      <ListCard
        eyebrow="Ahmedabad · Meetup"
        title="An eyebrow over a dated row"
        body="The eyebrow's quiet ink and the date marker's accent ink, read from this surface's own block."
        marker={{ type: 'date', dateTime: '2026-11-14', day: '14', label: 'Nov 2026' }}
        href={ROUTES.events}
      />
    </Rows>
  );
}

/** The boxed tiles, identical on every surface: three linked, then one static with an action-free body. */
function SurfaceBoxes() {
  return (
    <Layout as="ul" columns={{ base: 1, md: 2, lg: 4 }} colGap="gutter" rowGap="gutter">
      {BOXED.map((tile) => (
        <ListCard key={tile.title} form="tile" frame="box" titleAs="h3" {...tile} />
      ))}
      <ListCard
        form="tile"
        frame="box"
        titleAs="h3"
        title="Unlinked box"
        body="No destination: the edge and inset, no ground and no pointer state."
        marker={{ type: 'icon', name: 'document-text' }}
      />
    </Layout>
  );
}

function SampleList({ count = 12 }: { count?: number }) {
  return (
    <Rows ordered>
      {Array.from({ length: count }, (_, index) => {
        const title = SAMPLES[index % SAMPLES.length] ?? 'Additional perspective';
        return (
          <ListCard
            key={`${index}-${title}`}
            arrangement="stacked"
            title={title}
            body="Recruit this perspective before synthesis so the sample does not silently optimise for the easiest people to reach."
            marker={{ type: 'number', value: index + 1 }}
          />
        );
      })}
    </Rows>
  );
}

export default function ListCardSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>ListCard</h1>
          <p>
            One ruled row in a semantic list: a number, icon, thumbnail or no marker; one title
            and body; and an optional whole-row link. It carries three jobs on purpose — a step
            in a process, a clickable article or guide on a listing page, and an item in a plain
            content list — which is why the marker, the heading level and the link are all
            independently optional. The title stays dark whether the row navigates or not, and
            the row paints no ground at rest.
          </p>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>1 · Arrangement × size</h2>
            <p>
              Two arrangements and two type steps (visual-direction § 7.2, 5 Oct).{' '}
              <code>md</code> (h4 over body) is a row&rsquo;s default; <code>sm</code> (h5) is
              what any set of four rows or more passes, and it is a tile&rsquo;s default (§ 1b).
              The title steps in every form; the body steps in a tile only, so a row at{' '}
              <code>sm</code> keeps body, since its body is a reading line at up to the body
              measure (6 Oct). A row cannot see its siblings, so the composing route passes the
              step. The copy is identical so the title/body relationship is the only visible
              difference; title to body is <code>text</code> (16) in every cell.
            </p>
          </Layout>
          <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="gutter">
            <Specimen
              title="split × md"
              note="The default: title and body side by side while both minimum tracks fit the row's own width, one track once they do not. In this half-column cell the row is too narrow, so it stacks — see 1a."
            >
              <Rows>
                <ListCard title={TERMS[0].title} body={TERMS[0].body} />
                <ListCard title={TERMS[1].title} body={TERMS[1].body} />
              </Rows>
            </Specimen>
            <Specimen
              title="stacked × md"
              note="The same record, with the lead-in attached above its sentence at every width."
            >
              <Rows>
                <ListCard arrangement="stacked" title={TERMS[0].title} body={TERMS[0].body} />
                <ListCard arrangement="stacked" title={TERMS[1].title} body={TERMS[1].body} />
              </Rows>
            </Specimen>
            <Specimen
              title="split × sm"
              note="The small step in the same cell. The split's minimum tracks are unchanged, so it stacks here too."
            >
              <Rows>
                <ListCard size="sm" title={TERMS[0].title} body={TERMS[0].body} />
                <ListCard size="sm" title={TERMS[1].title} body={TERMS[1].body} />
              </Rows>
            </Specimen>
            <Specimen
              title="stacked × sm"
              note="h5 over body: a long set's titles stop competing with the band's h2, and the body keeps its reading size."
            >
              <Rows>
                <ListCard
                  size="sm"
                  arrangement="stacked"
                  title={TERMS[0].title}
                  body={TERMS[0].body}
                />
                <ListCard
                  size="sm"
                  arrangement="stacked"
                  title={TERMS[1].title}
                  body={TERMS[1].body}
                />
              </Rows>
            </Specimen>
          </Layout>
          <Specimen
            title="bodyHtml · a body with a link and a second paragraph"
            note="For a corpus item whose body carries a link or more than one paragraph, which `body` would flatten. One entry per paragraph, trusted inline HTML built from a parsed tree; the paragraphs sit a `text` apart and take the row's own body role. An unlinked row only: a linked row is one anchor, and a link inside it would be an anchor in an anchor."
          >
            <Rows>
              <ListCard
                arrangement="stacked"
                size="md"
                title="Design and build."
                bodyHtml={[
                  'We design it, then our <a href="/services/design-engineering">Design Engineering</a> and <a href="/services/software-development">Software Development</a> teams build it.',
                  'A second paragraph, for a body that needs one.',
                ]}
              />
            </Rows>
          </Specimen>
          <Specimen
            title="Numbered rows · md and sm · the ordinal's baseline"
            note="The ordinal's optical offset is a function of the title's size, so it steps too: 4 against h4, 0 against h5. The numeral's baseline sits on the title's first baseline in both."
          >
            <Layout columns={{ base: 1, lg: 2 }} colGap="column" rowGap="stack">
              {(['md', 'sm'] as const).map((size) => (
                <Rows key={size} ordered>
                  {TILES_STEPS.slice(0, 4).map((step, index) => (
                    <ListCard
                      key={step.title}
                      size={size}
                      arrangement="stacked"
                      title={step.title}
                      body={step.body}
                      marker={{ type: 'number', value: index + 1 }}
                    />
                  ))}
                </Rows>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title="eyebrow · a row that says what kind of thing it is"
            note="13 Oct 2026, the insights feed. BlockCard's eyebrow voice: mono, quiet ink, a text (16) above the title. In a split it travels with the title, in the title's track. Blank renders nothing."
          >
            <Layout columns={{ base: 1, lg: 2 }} colGap="column" rowGap="stack">
              <Rows>
                <ListCard
                  size="sm"
                  arrangement="stacked"
                  eyebrow="Podcast · 7 Oct 2026 · 48 min"
                  title="Build AI for the user’s work, not for AI’s sake"
                  body="Samy Melaine of Eden AI on making the choice between many models simpler."
                  href={ROUTES.insights}
                />
                <ListCard
                  size="sm"
                  arrangement="stacked"
                  eyebrow="Article · 8 Oct 2026 · 11 min read · markerPosition end"
                  title="CPQ UX: designing configure-price-quote software sales teams will use"
                  marker={thumb(CUT_OUT)}
                  markerPosition="end"
                  href={ROUTES.insights}
                />
              </Rows>
              <Rows>
                <ListCard
                  eyebrow="Guide · 12 min read · sketch marker"
                  title="Improve commerce by finding the broken evidence path"
                  marker={{ type: 'sketch', name: 'prototype-to-production' }}
                  body="Trace where shoppers lose confidence between discovery and delivery, and measure the whole path."
                />
              </Rows>
            </Layout>
          </Specimen>
          <Specimen
            title="date marker · a ledger of events"
            note="13 Oct 2026. The day at the stat role in the accent, month and year under it in the label voice, in a fixed 96 column so every row's copy starts on one edge. A real <time> when it has a dateTime; without one (a date not yet set) it renders as text and keeps the column."
          >
            <Rows>
              <ListCard
                titleAs="h3"
                eyebrow="Ahmedabad"
                title="Design systems for everyone, from basics to advanced"
                body="Our meetup on design systems, from auto-layout and design tokens to composable systems."
                href={ROUTES.events}
                marker={{ type: 'date', dateTime: '2026-11-14', day: '14', label: 'Nov 2026' }}
              />
              <ListCard
                titleAs="h3"
                eyebrow="San Mateo, California"
                title="Lessons from designing the UX for AI products, at SaaStr Annual"
                href={ROUTES.events}
                marker={{ type: 'date', dateTime: '2026-09-09', day: '9', label: 'Sept 2026' }}
              />
              <ListCard
                titleAs="h3"
                title="Design systems meetup: tokens, theming and the second product"
                href={ROUTES.events}
                marker={{ type: 'date', day: '—', label: 'Date TBC' }}
              />
            </Rows>
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>1a · The split reads its own width</h2>
            <p>
              The split is a wrapping <code>Cluster</code>: title and body share a line only
              while <code>--lcrd-title-min</code> + the block seam +{' '}
              <code>--lcrd-body-min</code> (256 + 24 + 256) fits the row&rsquo;s own content
              width, and the body wraps under the title the moment it does not. It used to
              switch on at the md <em>viewport</em>, so a row in a 392px grid track was split
              into a ~150px title track and the h4 broke mid-word (&ldquo;Produ/ct&rdquo;,
              &ldquo;Interactio/n&rdquo;). The title&rsquo;s wrap is now <code>break-word</code>
              , so its words stay whole at every track below. On a wide row the title stops at{' '}
              <code>--measure-title</code> and the body at <code>--measure-body</code>, so the
              leftover collects at the row&rsquo;s end instead of opening a channel between a
              title and its sentence. The frames below stand in for the content column at 1440,
              1023, 768 and 390, and for grid tracks inside them; none can fire a media query,
              which is now the point — the row does not need one.
            </p>
          </Layout>
          {(
            [
              ['1240 · the column at 1440', undefined],
              ['960 · the column at 1023', s.trackTablet],
              ['704 · the column at 768', s.trackTabletNarrow],
              ['326 · the column at 390', s.trackMobile],
            ] as const
          ).map(([label, frame]) => (
            <Specimen key={label} title={label}>
              <div className={frame}>
                <Rows>
                  <ListCard
                    title="Product"
                    body="Turn a difficult workflow into a product people can understand and operate."
                    marker={{ type: 'icon', name: 'document-text' }}
                    href={ROUTES.productDesign}
                  />
                  <ListCard
                    title="Interaction contract"
                    body="The states, language and response a control promises before visual treatment is added."
                  />
                  <ListCard
                    title="A case study, told off-site"
                    body="A thumbnail row, linked away: the split has what is left after the 160 marker."
                    marker={thumb(CUT_OUT)}
                    href={EXTERNAL_HREF}
                    external
                  />
                </Rows>
              </div>
            </Specimen>
          ))}
          <Specimen
            title="Grid tracks · 3 across the column, 2 across 768"
            note="The shape that broke: ListCards in a lg:3 grid (~392px tracks at 1440) and a 2-up grid inside the 768 column (~336px). Every row stacks, because neither track holds 536px of copy."
          >
            <Layout rowGap="stack">
              <Layout columns={3} colGap="gutter" rowGap="gutter">
                {LINKED.map((item) => (
                  <Rows key={item.title}>
                    <ListCard {...item} titleAs="h3" />
                    <ListCard title="Interaction" body="One word, long enough to have broke." />
                  </Rows>
                ))}
              </Layout>
              <div className={s.trackTabletNarrow}>
                <Layout columns={2} colGap="gutter" rowGap="gutter">
                  {LINKED.slice(0, 2).map((item) => (
                    <Rows key={item.title}>
                      <ListCard {...item} />
                    </Rows>
                  ))}
                </Layout>
              </div>
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>1b · Tile form</h2>
            <p>
              <code>form=&quot;tile&quot;</code> is the item in a grid track. The rule opens the
              item instead of closing it, because tiles in a grid row only line up at the top;
              the marker stands above the title; the copy sits flush with the track, so the grid
              aligns with the heading over it; title and body always stack. A linked tile
              carries no arrow (owner, 7 Oct 2026): on hover its opening rule and its title take
              the link ink. An optional action (<code>ctaLabel</code>) is pinned to the foot, so
              every action in a row shares a line. A tile defaults to{' '}
              <code>size=&quot;sm&quot;</code> (h5 over body-sm, § 7.2), so every tile below is
              at the small step without being told; the third cell passes <code>md</code> to
              show the override. Rows of tiles are <code>column</code> (64) apart, the row seam
              of every borderless card set (§ 1.2, 6 Oct); the two-track cell shows it at every
              width.
            </p>
          </Layout>
          <Specimen
            title="icon tiles · four tracks · sm by default"
            note="Signals: a thing a reader can see, then what it may mean. No size passed: a tile is sm."
          >
            <Layout as="ul" columns={{ base: 1, md: 2, lg: 4 }} colGap="gutter" rowGap="column">
              {TILES_ICON.map((tile) => (
                <ListCard key={tile.title} form="tile" titleAs="h3" {...tile} />
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title="icon tiles · two tracks, two rows · the row seam"
            note="Rows of tiles are column (64) apart, the seam of every borderless card set; columns stay gutter (32). The B shape: the box stands in for the photo, the tiles sit two across in the 667 copy track."
          >
            <Layout columns={{ base: 1, lg: [5, 7] }} colGap="section" rowGap="stack">
              <Box tall />
              <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="column">
                {TILES_ICON.map((tile) => (
                  <ListCard key={tile.title} form="tile" titleAs="h3" {...tile} />
                ))}
              </Layout>
            </Layout>
          </Specimen>
          <Specimen
            title="number tiles · five tracks, ordered"
            note="A method: the <ol> carries the order"
          >
            <Layout as="ol" columns={{ base: 1, md: 2, lg: 5 }} colGap="gutter" rowGap="column">
              {TILES_STEPS.map((tile, index) => (
                <ListCard
                  key={tile.title}
                  form="tile"
                  titleAs="h3"
                  marker={{ type: 'number', value: index + 1 }}
                  {...tile}
                />
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title="icon tiles · four tracks · md, passed explicitly"
            note="The override, for comparison only. § 7.2 gives every tile sm, so h5 sits two rungs under the band's h2; at md the tiles' h4 competes with it. No page passes this."
          >
            <Layout as="ul" columns={{ base: 1, md: 2, lg: 4 }} colGap="gutter" rowGap="column">
              {TILES_ICON.map((tile) => (
                <ListCard key={tile.title} form="tile" size="md" titleAs="h3" {...tile} />
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title="linked tiles · three tracks, unequal bodies · no arrow"
            note="The whole tile is the link. Hover: the opening rule and the title take the link ink."
          >
            <Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="column">
              {LINKED.slice(0, 3).map((row) => (
                <ListCard key={row.title} form="tile" {...row} />
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title="linked tiles · ctaLabel · the action pinned to the foot"
            note="Opt-in, for an item whose action is not obvious from its title. The link Button is a span inside the one anchor: one focus stop. The title holds still; the action moves."
          >
            <Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="column">
              <ListCard
                form="tile"
                titleAs="h3"
                title="The modernisation worksheet"
                body="You can see the cost, but not yet which layer it sits in."
                marker={{ type: 'icon', name: 'checklist' }}
                href={ROUTES.contact}
                ctaLabel="Open the worksheet"
              />
              <ListCard
                form="tile"
                titleAs="h3"
                title="Research record template"
                body="One page per interview, with the evidence each claim rests on, ready for synthesis."
                marker={{ type: 'icon', name: 'document-text' }}
                href={EXTERNAL_HREF}
                external
                ctaLabel="Get the Figma file"
              />
              <ListCard
                form="tile"
                titleAs="h3"
                title="Accessibility audit"
                body="A ranked list of fixes."
                marker={{ type: 'icon', name: 'check-circle' }}
                href={ROUTES.contact}
                ctaLabel="Book an audit"
              />
            </Layout>
          </Specimen>
          <Specimen
            title='boxed tiles · frame="box" · an icon router of six, three across'
            note="Owner, 7 Oct 2026; edge removed 9 Oct 2026. No edge on any side; 24 inside on every side, which is where the ground under the pointer sits when linked, at the 8 radius. Boxed tiles sit a gutter apart both ways. Clickable, so the set runs the full column under its head — never beside a head or a photograph."
          >
            <Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {[...BOXED, ...LINKED.slice(0, 3)].map((tile) => (
                <ListCard key={tile.title} form="tile" frame="box" titleAs="h3" {...tile} />
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title="boxed tiles · numbers, a thumbnail, title only, and an action"
            note="Every marker in the box. A thumbnail sits above its copy as in the open tile."
          >
            <Layout as="ol" columns={{ base: 1, md: 2, lg: 4 }} colGap="gutter" rowGap="gutter">
              <ListCard
                form="tile"
                frame="box"
                title="Read the real work"
                body="What triggers the change, who decides, who is affected."
                marker={{ type: 'number', value: 1 }}
              />
              <ListCard
                form="tile"
                frame="box"
                title="A case study"
                body="A thumbnail in the box."
                marker={thumb(getKitPhoto('screen-over-shoulder'))}
                href={ROUTES.caseStudies}
              />
              <ListCard
                form="tile"
                frame="box"
                title="Title only"
                marker={{ type: 'number', value: 3 }}
              />
              <ListCard
                form="tile"
                frame="box"
                title="Product modernisation assessment"
                body="Capability by capability: repair, redesign, replatform or rebuild."
                marker={{ type: 'number', value: 4 }}
                href={ROUTES.contact}
                ctaLabel="Request the assessment"
              />
            </Layout>
          </Specimen>
          <Specimen
            title="title only · rows and tiles"
            note="body is optional: no paragraph, no seam"
          >
            <Layout columns={{ base: 1, lg: 2 }} colGap="column" rowGap="stack">
              <Layout as="ul" rowGap="none">
                <ListCard
                  title="Realistic access to the product"
                  marker={{ type: 'icon', name: 'check-circle' }}
                />
                <ListCard
                  title="Time with people who understand the system"
                  marker={{ type: 'icon', name: 'check-circle' }}
                />
              </Layout>
              <Layout as="ul" columns={2} colGap="gutter" rowGap="column">
                <ListCard
                  form="tile"
                  title="Product model"
                  marker={{ type: 'icon', name: 'widget' }}
                />
                <ListCard
                  form="tile"
                  title="Research record"
                  marker={{ type: 'icon', name: 'document-text' }}
                />
              </Layout>
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2 · Marker fill ladder</h2>
            <p>
              Four fills of one optional marker slot — not variants and not four components.
            </p>
          </Layout>
          <Rows ordered>
            <ListCard
              arrangement="stacked"
              title="Number marker"
              body="A two-digit index orders the sequence without outweighing the title it indexes."
              marker={{ type: 'number', value: 1 }}
            />
            <ListCard
              arrangement="stacked"
              title="Icon marker"
              body="The existing solid glyph is decorative because this title already names its subject."
              marker={{ type: 'icon', name: 'document-text' }}
            />
            <ListCard
              arrangement="stacked"
              title="Thumbnail marker"
              body="ListCard owns the 160 × 16:9 box; Media fills it with its srcset, lazy load and edge by kind."
              marker={thumb(CUT_OUT)}
            />
            <ListCard
              arrangement="stacked"
              title="No marker"
              body="Omitting the slot also removes its 24px seam; content returns to inline start."
            />
          </Rows>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2a · The thumbnail, by kind</h2>
            <p>
              The thumbnail is <code>Media</code> in <code>fit=&quot;fill&quot;</code>, inside
              ListCard&rsquo;s own 160 × 16:9 box (<code>--ratio-standard</code>), lazy, with{' '}
              <code>sizes=&quot;160px&quot;</code> from <code>LIST_CARD_THUMBNAIL</code>. The
              edge is the record&rsquo;s kind, drawn by Media — ListCard never restyles it. Per
              ch05 § 9 and ruling C1 a thumbnail belongs only to case-study and insight/resource
              rows, and carries one cut-out part or one illustration shape. The last two rows
              are the failures the pattern cannot refuse, shown so they are recognisable.
            </p>
          </Layout>
          <Rows>
            <ListCard
              arrangement="stacked"
              title="Cut-out · one part · legal"
              body="No edge: the part's own silhouette is the frame. The 16:9 fill crops a portrait part top and bottom, so its subject must sit in the central safe area."
              marker={thumb(CUT_OUT)}
              href={ROUTES.caseStudies}
            />
            <ListCard
              arrangement="stacked"
              title="Illustration · one shape · legal"
              body="Never boxed — no edge, no panel, no shadow — and never on a blue band. The insight/resource case."
              marker={thumb(ILLUSTRATION)}
              href={ROUTES.insights}
            />
            <ListCard
              arrangement="stacked"
              title="Capture · off-brand at 160"
              body="A whole screen is a flat capture at full column only (ch05 § 2), and § 9 gives a thumbnail no edge. Media draws the capture hairline because the record says capture; the fix is the record."
              marker={thumb(CAPTURE)}
            />
            <ListCard
              arrangement="stacked"
              title="No kind · renders as a capture (M3)"
              body="Every record until Strapi records kind. Same hairline, arriving by default — which is why a thumbnail record should carry its kind before it ships."
              marker={thumb(KINDLESS)}
            />
          </Rows>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2b · The panel inset at 160 (Media § 17 Q2)</h2>
            <p>
              A B5 cut-out on its contrast panel took Media&rsquo;s <code>--gap-gutter</code>{' '}
              inset at every size, so in a 160 × 107 box the part got 96 × 43 — not one
              recognisable shape. <strong>Shipped 29 Sep 2026 (2.17):</strong> Media gained{' '}
              <code>inset</code>, and the thumbnail passes <code>inset=&quot;text&quot;</code> (
              <code>--gap-text</code>, 16, &ldquo;cell padding&rdquo;), which leaves 128 × 75.
              The value stays Media&rsquo;s; ListCard names the step because only the placement
              knows its box is small. The <code>gutter</code> rendering at 160 is on
              /design/media § 3c for comparison. The supply rule still stands beside it: a part
              whose own edge holds needs no panel at all.
            </p>
          </Layout>
          <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="stack">
            <Specimen
              title="panel · inset text · shipped"
              note="128 × 75 of part inside 16 of paper-deep panel."
            >
              <Rows>
                <ListCard
                  arrangement="stacked"
                  title="Panelled part"
                  body="The inset ListCard passes."
                  marker={thumb(PANEL_PART)}
                />
              </Rows>
            </Specimen>
            <Specimen
              title="no panel · the supply rule's answer"
              note="A part whose own edge holds on the ground: the whole 160 × 107 box."
            >
              <Rows>
                <ListCard
                  arrangement="stacked"
                  title="Unpanelled part"
                  body="What the rule asks for first."
                  marker={thumb(CUT_OUT)}
                />
              </Rows>
            </Specimen>
          </Layout>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2c · Ordered and unordered sets</h2>
            <p>
              The <code>number</code> fill is the Mechanism&rsquo;s &ldquo;ordered steps&rdquo;
              variant, so a numbered set is a real <code>&lt;ol&gt;</code>: the numeral is
              aria-hidden and the list announces position. An unordered set is a{' '}
              <code>&lt;ul&gt;</code>. The list element is the caller&rsquo;s{' '}
              <code>Layout as</code>, never the row&rsquo;s — one boolean on every route drives
              both the element and the marker. A <code>&lt;ul&gt;</code> of numerals is the one
              wrong composition, and it is named here rather than rendered.
            </p>
          </Layout>
          <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="stack">
            <Specimen
              title={'<Layout as="ol"> · number markers'}
              note="“List, 3 items. 1 of 3. Name the decision…” — order from the markup, not the numeral."
            >
              <Rows ordered>
                {SAMPLES.slice(0, 3).map((title, index) => (
                  <ListCard
                    key={title}
                    arrangement="stacked"
                    title={title}
                    body="Name the decision this step must make."
                    marker={{ type: 'number', value: index + 1 }}
                  />
                ))}
              </Rows>
            </Specimen>
            <Specimen
              title={'<Layout as="ul"> · no marker, or an icon'}
              note="No order to announce, so no number fill."
            >
              <Rows>
                {TERMS.slice(0, 3).map((term, index) => (
                  <ListCard
                    key={term.title}
                    arrangement="stacked"
                    title={term.title}
                    body={term.body}
                    marker={index === 0 ? { type: 'icon', name: 'document-text' } : undefined}
                  />
                ))}
              </Rows>
            </Specimen>
          </Layout>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2d · External rows</h2>
            <p>
              <code>external</code> opens a new tab, appends a visually hidden &ldquo;(opens in
              a new tab)&rdquo; to the row&rsquo;s accessible name, and sets a small (16){' '}
              <code>arrow-right-up</code> after the title&rsquo;s last word, in the link ink. It
              is the one glyph a linked row still carries after the arrow cue was removed
              (owner, 7 Oct 2026), because it says something the hover cannot: that the page
              will leave the site, before the click (WCAG G201). An internal row carries none.
              With an action (<code>ctaLabel</code>) the action&rsquo;s own glyph turns up-right
              instead and the title carries none.
            </p>
          </Layout>
          <Rows>
            <ListCard
              title="Internal destination"
              body="No glyph. Same tab. The title takes the link ink on hover."
              href={ROUTES.caseStudies}
            />
            <ListCard
              title="External destination"
              body="The small up-right glyph after the title: leaves the site. New tab, said in words to a screen reader."
              href={EXTERNAL_HREF}
              external
            />
            <ListCard
              title="External with a thumbnail"
              body="The glyph and the marker are independent; the row is still one link and one focus stop."
              marker={thumb(ILLUSTRATION)}
              href={EXTERNAL_HREF}
              external
            />
            <ListCard
              title="An external flag with no href"
              body="No destination, so no anchor, no glyph and no hint."
              external
            />
          </Rows>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2e · Linked rows: no arrow, and an action where one is needed</h2>
            <p>
              Owner, 7 Oct 2026: almost every card carried a blue arrow next to its title, and
              it read as bulky. The whole row is the link, so a linked row carries no glyph at
              rest; on hover and focus its title takes the link ink, and the ring runs round the
              row. The row&rsquo;s hover ground and the 16 inline inset that cleared it went
              with the arrow, so every row sits flush on the column edge the head and the rules
              share. Where the action is not obvious from the title, the caller opts into a
              visible one: <code>ctaLabel</code> sets the link Button, with its arrow, under the
              copy — and the title holds still while the action moves. Below 768 a thumbnail row
              takes the 96 thumbnail and keeps it beside the copy.
            </p>
          </Layout>
          <Specimen title="linked · stacked × md · thumbnails · internal and external">
            <Rows>
              <ListCard
                arrangement="stacked"
                titleAs="h3"
                title="Design systems"
                body="When every team builds the same screens a little differently."
                marker={thumb(getKitPhoto('screen-over-shoulder'))}
                href={ROUTES.designSystems}
              />
              <ListCard
                arrangement="stacked"
                titleAs="h3"
                title="A case study, told off-site"
                body="External: the small up-right glyph after the title, and the new-tab hint at the end of the name."
                marker={thumb(getKitPhoto('desk-flatlay-devices'))}
                href={EXTERNAL_HREF}
                external
              />
            </Rows>
          </Specimen>
          <Specimen title="linked · split × sm · no marker, then a number · external last">
            <Rows>
              <ListCard
                size="sm"
                title="Product design"
                body="A row with no marker: the title, and the body beside it."
                href={ROUTES.productDesign}
              />
              <ListCard
                size="sm"
                title="Design engineering"
                body="A number marker holds its own column."
                marker={{ type: 'number', value: 2 }}
                href={ROUTES.designEngineering}
              />
              <ListCard
                size="sm"
                title="The Figma community file"
                body="External, unmarked: leaves the site, opens a new tab, says so to a reader."
                href={EXTERNAL_HREF}
                external
              />
            </Rows>
          </Specimen>
          <Specimen
            title="ctaLabel · split × md and stacked × md · internal and external"
            note="The action sits a block (24) under the copy, at its inline start. One anchor, one focus stop: the Button is a span and takes the row's hover, focus and press."
          >
            <Rows>
              <ListCard
                titleAs="h3"
                title="Product modernisation assessment"
                body="A free walk-through that decides, capability by capability, what to repair, redesign, replatform or rebuild."
                marker={{ type: 'icon', name: 'checklist' }}
                href={ROUTES.contact}
                ctaLabel="Request the assessment"
              />
              <ListCard
                arrangement="stacked"
                titleAs="h3"
                title="Research record template"
                body="One page per interview. The action's glyph turns up-right because the file leaves the site."
                marker={thumb(getKitPhoto('desk-flatlay-devices'))}
                href={EXTERNAL_HREF}
                external
                ctaLabel="Get the Figma file"
              />
            </Rows>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>3 · Content shapes</h2>
            <p>Real ordered, term-like and linked groups, each using the same row component.</p>
          </Layout>
          <Layout columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="stack">
            <Specimen title="Numbered sequence · 5 rows">
              <Rows ordered>
                {SAMPLES.slice(0, 5).map((title, index) => (
                  <ListCard
                    key={title}
                    arrangement="stacked"
                    title={title}
                    body="Name the evidence and owner before the next step begins."
                    marker={{ type: 'number', value: index + 1 }}
                  />
                ))}
              </Rows>
            </Specimen>
            <Specimen title="Term list · 5 rows">
              <Rows>
                {TERMS.map((term) => (
                  <ListCard key={term.title} title={term.title} body={term.body} />
                ))}
              </Rows>
            </Specimen>
            <Specimen
              title="Linked set · 3 rows"
              note="Each title is an h3 and the row is one link."
            >
              <Rows>
                {LINKED.map((item) => (
                  <ListCard key={item.title} {...item} titleAs="h3" />
                ))}
              </Rows>
            </Specimen>
          </Layout>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>4 · States</h2>
            <p>
              The static row has rest only. Point at, hold and Tab to the linked row: its{' '}
              <strong>title turns blue</strong> on hover and focus and deepens on press (owner,
              7 Oct 2026 — the arrow cue and the row&rsquo;s hover ground were removed). Focus
              adds the surface-aware two-part ring round the whole row, so keyboard focus is
              never carried by colour alone. A boxed tile adds a ground under the pointer (§
              1b).
            </p>
          </Layout>
          <Rows ordered>
            <ListCard
              arrangement="stacked"
              title="Static · rest only"
              body="This row is inert and never enters the tab order."
              marker={{ type: 'number', value: 1 }}
            />
            <ListCard
              arrangement="stacked"
              title="Linked · point, hold and Tab"
              body="One native anchor owns the marker, title and summary."
              marker={{ type: 'icon', name: 'copy' }}
              href={ROUTES.designEngineering}
            />
          </Rows>
          <Layout columns={{ base: 1, md: [1, 3] }} colGap="gutter" rowGap="tight">
            {[
              [
                'rest',
                'Dark h4 title, blue numeral and marker, quiet base hairline. No arrow.',
              ],
              [
                'hover',
                'The title takes --lcrd-link-ink. A boxed tile also paints --lcrd-ground-hover.',
              ],
              ['focus', 'Exactly the hover rendering plus the two-part keyboard ring.'],
              [
                'pressed',
                'The title steps to --lcrd-link-ink-pressed; a boxed tile to --lcrd-ground-pressed.',
              ],
            ].map(([state, note]) => (
              <div key={state}>
                <strong>{state}</strong>
                <p>{note}</p>
              </div>
            ))}
          </Layout>
        </Layout>
      </Section>

      {SURFACES.map(({ surface, note }, index) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="block">
            <Layout rowGap="tight">
              {index === 0 ? <h2>5 · Four surfaces · identical markup</h2> : null}
              <p className={s.specTitle}>surface=&quot;{surface}&quot;</p>
              <p className={s.specNote}>{note}</p>
            </Layout>
            <SurfaceRows />
            <SurfaceBoxes />
          </Layout>
        </Section>
      ))}

      <Section surface="ink">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>6 · Nested surfaces</h2>
            <p>
              The tint panel below resolves all fifteen ListCard colour tokens from itself; no
              ink value may leak through an omitted declaration.
            </p>
          </Layout>
          <Section as="div" surface="tint">
            <Layout columns={{ base: 1, md: [2, 1] }} colGap="gutter" rowGap="block">
              <SurfaceRows />
              <ResolvedTokens surface="tint" />
            </Layout>
          </Section>
        </Layout>
      </Section>
      <Section>
        <Layout rowGap="stack">
          <p>The ink panel below is nested back inside paper and must invert in full.</p>
          <Section as="div" surface="ink">
            <Layout columns={{ base: 1, md: [2, 1] }} colGap="gutter" rowGap="block">
              <SurfaceRows />
              <ResolvedTokens surface="ink" />
            </Layout>
          </Section>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>7 · Twelve-row sample-finding block</h2>
            <p>
              One full-width ordered list with zero row gap. Narrow the window: title/body
              stacks when the row runs out of room, two-digit markers hold the left rhythm
              quietly and the rules keep one list intact.
            </p>
          </Layout>
          <SampleList />
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>8 · Content edge cases</h2>
            <p>
              All thirteen required cases, rendered or named where invalid markup is rejected.
            </p>
          </Layout>

          <Specimen title="1 · Long title and body · 2 · one unbroken URL">
            <Rows>
              <ListCard
                title="Interaction and interface design for regulated financial products with several operational owners"
                body="The complete naming record is available at https://tcules.com/services/product-design/design-systems/a-single-unbroken-token-that-must-wrap-before-it-can-widen-the-page and the row grows rather than truncating either field."
                marker={{ type: 'icon', name: 'document-text' }}
              />
            </Rows>
          </Specimen>

          <Specimen
            title="3 · Zero items"
            note="No ul or ol is rendered inside the outlined harness."
          >
            <Box>Caller omitted the empty list.</Box>
          </Specimen>

          <Specimen title="4 · One item · 5 · 24 items">
            <Layout rowGap="stack">
              <Rows>
                <ListCard title="One item" body="Its own bottom rule still renders." />
              </Rows>
              <SampleList count={24} />
            </Layout>
          </Specimen>

          <Specimen
            title="6 · Missing optional marker and blank thumbnail source"
            note="The first omits marker; the second exercises the runtime guard and warning. Neither leaves an empty frame."
          >
            <Rows>
              <ListCard title="Marker omitted" body="Content begins at inline start." />
              <ListCard
                title="Blank thumbnail source"
                body="The image marker collapses without a placeholder."
                marker={thumb({ src: '   ', alt: '', width: 480, height: 320 })}
              />
            </Rows>
          </Specimen>

          <Specimen
            title="7 · Empty required-ish text"
            note="The blank title returns null; blank body keeps the title; blank href stays static, with no anchor."
          >
            <Rows>
              <ListCard title="   " body="This row must not render." />
              <ListCard title="Body omitted" body="   " />
              <ListCard title="Blank href is inert" body="No anchor and no hover." href="   " />
            </Rows>
          </Specimen>

          <Specimen
            title="8 · 767 track · 9 · unsized parent · 10 · logical placement"
            note="Use block/inline edges only. A larger thumbnail wraps before the xs content core collapses. The second harness is a wrapping Cluster with no track width: each ListCard must still take one complete line."
          >
            <Layout rowGap="block">
              <div className={s.trackSm}>
                <Rows>
                  <ListCard
                    title="A thumbnail in a narrow parent"
                    body="The 160px image wraps above a core that keeps its readable minimum."
                    marker={thumb(ILLUSTRATION)}
                    href={ROUTES.caseStudies}
                  />
                </Rows>
              </div>
              <Cluster as="ul">
                <ListCard
                  title="First full-line row in a wrapping parent"
                  body="No explicit track sizes this item."
                />
                <ListCard
                  title="Second full-line row in a wrapping parent"
                  body="It starts on the next line instead of sharing the first."
                />
              </Cluster>
            </Layout>
          </Specimen>

          <Specimen title="11 · Nested surface · 12 · adjacent rows">
            <Section as="div" surface="ink">
              <Rows>
                <ListCard title="First adjacent row" body="One rule at the shared seam." />
                <ListCard title="Second adjacent row" body="One final rule at block end." />
              </Rows>
            </Section>
          </Specimen>

          <Specimen
            title="13 · Interactive content inside a slot — rejected"
            note="title/body are strings, icon/number are inert, and thumbnail exposes only src/alt. The public type has no place for a nested link, button or control."
          >
            <Box>One linked row means one focus stop.</Box>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>9 · Adjacent seam</h2>
            <p>Two rows, no parent gap, one line at their shared edge and one at the end.</p>
          </Layout>
          <Rows>
            <ListCard title="Evidence before opinion" body="Write down what is known." />
            <ListCard
              title="Decision before detail"
              body="Name the choice the work must make."
            />
          </Rows>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>10 · Narrow tracks</h2>
            <p>
              Thumbnail rows in the phone&rsquo;s 326px column, then the same number, icon and
              linked thumbnail rows at Layout&rsquo;s sm and xs track widths. This is where the
              inline inset is proved: it takes 32px from each track, so the copy gets 224px at
              sm and 160px at xs — below the 192px core minimum at xs, where the marker wraps
              above the core instead of squeezing it. Nothing overflows at either width, because
              padding sits inside the border box. Markers wrap without widening the page; the
              content core can shrink below xs only when the parent itself is smaller.
            </p>
          </Layout>
          <Specimen
            title="326 · mobile column"
            note="The width every card image is approved at (ch05 B3): a 390 viewport less two 32px gutters, derived by the harness rather than written. Stacked only here; § 1a shows split rows at this width, where they stack on their own. The thumbnail keeps its own 160px slot at this width, so the asset is judged at 160, not 326: that is the narrowest it renders anywhere, and the reason a cover asset shared with BlockCard has to read at both sizes."
          >
            <div className={s.trackMobile}>
              <Rows>
                <ListCard
                  arrangement="stacked"
                  title="A linked thumbnail in the phone's column"
                  body="The cover crop at the thumbnail's own width, with the copy taking what is left of 326."
                  marker={thumb(ILLUSTRATION)}
                  href={ROUTES.caseStudies}
                />
                <ListCard
                  arrangement="stacked"
                  title="The same thumbnail, unlinked"
                  body="Linked or not, the core takes the same width: no cue."
                  marker={thumb(ILLUSTRATION)}
                />
                <ListCard
                  arrangement="stacked"
                  title="A cut-out part, off-site"
                  body="The leaves-the-site glyph at the phone's width, after the title's last word."
                  marker={thumb(CUT_OUT)}
                  href={EXTERNAL_HREF}
                  external
                />
                <ListCard
                  arrangement="stacked"
                  title="A capture — off-brand"
                  body="The M3 hairline at 160, in the 326 column."
                  marker={thumb(CAPTURE)}
                />
              </Rows>
            </div>
          </Specimen>
          <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="stack">
            <Specimen title="sm · 256px">
              <div className={s.trackSm}>
                <Rows ordered>
                  <ListCard
                    arrangement="stacked"
                    title="Step"
                    body="Compact sequence copy."
                    marker={{ type: 'number', value: 1 }}
                  />
                  <ListCard
                    arrangement="stacked"
                    title="Icon"
                    body="Compact subject copy."
                    marker={{ type: 'icon', name: 'document-text' }}
                  />
                  <ListCard
                    arrangement="stacked"
                    title="Link"
                    body="A compact linked row."
                    marker={thumb(ILLUSTRATION)}
                    href={ROUTES.caseStudies}
                  />
                </Rows>
              </div>
            </Specimen>
            <Specimen title="xs · 192px">
              <div className={s.trackXs}>
                <Rows ordered>
                  <ListCard
                    arrangement="stacked"
                    title="Step"
                    body="Compact sequence copy."
                    marker={{ type: 'number', value: 1 }}
                  />
                  <ListCard
                    arrangement="stacked"
                    title="Icon"
                    body="Compact subject copy."
                    marker={{ type: 'icon', name: 'document-text' }}
                  />
                  <ListCard
                    arrangement="stacked"
                    title="Link"
                    body="A compact linked row."
                    marker={thumb(ILLUSTRATION)}
                    href={ROUTES.caseStudies}
                  />
                </Rows>
              </div>
            </Specimen>
          </Layout>
        </Layout>
      </Section>

      <Section surface="ink">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>11 · Heading map</h2>
            <p>Three elements, identical h5 visual role. Only the document outline changes.</p>
          </Layout>
          <Rows>
            <ListCard titleAs="span" title="Span title" body="Term-list default." />
            <ListCard titleAs="h3" title="H3 title" body="Direct child of this section h2." />
            <ListCard titleAs="h4" title="H4 title" body="Available beneath an h3 grouping." />
          </Rows>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>12 · ReadDown — the D set mode</h2>
            <p>
              Ruled rows read top to bottom, one column or two (visual-direction § 3.4 D). Three
              rows or fewer in one column take md (h4); four or more, or two columns, take sm
              (h5) and keep the body at body. No inline inset (the rows never link, so no hover
              ground), and the first row of each column starts on the set&rsquo;s top edge. Two
              columns are one list in reading order, each grid row as tall as its taller item,
              so the closing rules run level across the column seam. The kit family page shows
              it in its bands: /design/kit/readdown.
            </p>
          </Layout>
          <Layout columns={{ lg: [1, 1] }} colGap="column" rowGap="stack" align="start">
            <Specimen title="columns 1 · three rows · md">
              <ReadDown rows={READ_DOWN.slice(0, 3)} />
            </Specimen>
            <Specimen title="columns 2 · four rows · sm · unequal bodies">
              <ReadDown rows={READ_DOWN.slice(0, 4)} columns={2} />
            </Specimen>
          </Layout>
          <Specimen title="columns 1 · text only, no glyphs">
            <ReadDown
              rows={READ_DOWN.slice(0, 3).map(({ title, body }) => ({ title, body }))}
            />
          </Specimen>
          <Specimen title="photo · three rows · sm — from 1024 the photo takes the trailing two thirds and runs the rows' height, ending on the last rule; below 1024 it sits above them at 3:2">
            <ReadDown rows={READ_DOWN.slice(0, 3)} photo={getKitPhoto('workshop-brick-room')} />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Specimen title="12 · ReadDown photo + rail — the § 6.3 field hung off the photo's end edge, from 1440: it starts under the photograph and runs into the margin, never under the rows">
          <ReadDown
            rows={READ_DOWN.slice(1, 4)}
            photo={getKitPhoto('hands-sketches-markers')}
            rail
          />
        </Specimen>
      </Section>

      <Section surface="ink">
        <Specimen title="12 · ReadDown on ink — the glyph lifts to brandeis-300, the rule to neutral-700">
          <ReadDown rows={READ_DOWN.slice(0, 4)} columns={2} />
        </Specimen>
      </Section>

      <Section surface="blue">
        <Specimen title="12 · ReadDown on blue — declared for self-containment; the glyph is white, the rule brandeis-300">
          <ReadDown rows={READ_DOWN.slice(0, 4)} columns={2} />
        </Specimen>
      </Section>

      <Section>
        <Specimen title="12 · ReadDown, two columns, five rows, text only — the odd row stands alone, its rule its own width">
          <ReadDown
            rows={[...READ_DOWN, { title: 'A readout', body: 'One hour, the whole team.' }].map(
              ({ title, body }) => ({ title, body }),
            )}
            columns={2}
          />
        </Specimen>
      </Section>

      {(['paper', 'tint', 'ink', 'blue'] as const).map((surface) => (
        <Section key={surface} surface={surface}>
          <Specimen
            title={`12b · cue="arrow" on ${surface}: the glossary's term rows (owner, 4 Nov 2026). A quiet end arrow at rest that slides and takes the link ink on hover; shortest and longest term, and an external row`}
          >
            <Layout as="ul" columns={{ base: 1 }} rowGap="none">
              <ListCard
                cue="arrow"
                titleAs="h3"
                title="Design intent"
                body="What the build must keep from the design."
                href="/glossary/design-intent"
              />
              <ListCard
                cue="arrow"
                titleAs="h3"
                title="AI-assisted product development"
                body="AI tools used in research, design, prototyping, engineering or testing, with people still answerable for what gets released."
                href="/glossary/ai-assisted-product-development"
              />
              <ListCard
                cue="arrow"
                titleAs="h3"
                title="An external source"
                body="Leaves the site: the arrow points up and out."
                href="https://example.com"
                external
              />
            </Layout>
          </Specimen>
        </Section>
      ))}

      <Section>
        <Layout rowGap="block">
          <h2>13 · What this static page cannot force</h2>
          <p>
            Hold the pointer for pressed and Tab for keyboard focus. The split collapse is no
            longer on the list: it follows the row&rsquo;s own width, so § 1a renders it.
            Reduced motion is no longer on the list: the rule wipe was the row&rsquo;s only
            transform and it is gone, so there is nothing left for the preference to shorten.
            None has a prop; the absence is part of the contract.
          </p>
        </Layout>
      </Section>
    </>
  );
}
