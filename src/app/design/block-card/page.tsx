import type { ComponentProps, ReactNode } from 'react';

import { Cluster, Layout, Section, type IconName, type SectionSurface } from '@/components';
import {
  BlockCard,
  BlockCardSet,
  FEATURED_FROM,
  SMALL_FROM,
  type BlockCardImage,
  type BlockCardMedia,
  type BlockCardSetItem,
} from '@/patterns';
import { getKitPhoto } from '@/lib/photos';
import { glossaryPath, ROUTES } from '@/lib/routes';

import { Box, Specimen, specimenStyles as s } from '../_specimen/Specimen';

/* ── Assets ──────────────────────────────────────────────────────────────────────
   The brand framework's own images (docs/specs/Media.md § 17 Q1): not 2560 masters, so they prove
   the mechanism — srcset, fill, the edge by kind — rather than the ladder. */

const DERIVED = (base: string, ext: string) =>
  [320, 652, 1240].map((width) => ({ src: `/design/media/${base}-${width}.${ext}`, width }));

/** A cut-out cover: the product's own UI, lifted out, one shadow (ch05 §2a, §9a). */
const COVER_FLOW: BlockCardImage = {
  src: '/design/media/cutout-flow.png',
  alt: 'Workflow node: an input connected to an AI feature card with a provider field, a file field and an output.',
  width: 1796,
  height: 1112,
  kind: 'cut-out',
  shadow: true,
  sources: DERIVED('cutout-flow', 'png'),
};

/** A light part whose edge does not hold on paper, so it sits on a contrast panel (B5, M4). */
const COVER_REVIEWS: BlockCardImage = {
  src: '/design/media/cutout-reviews.png',
  alt: 'Review-analysis panel: user reviews summarised as benefit chips beside empty benefit slots.',
  width: 855,
  height: 570,
  kind: 'cut-out',
  panel: 'paper-deep',
};

/** A tall part, to show the cover crop taking the upper part of a portrait asset (Media's anchor). */
const COVER_NODE: BlockCardImage = {
  src: '/design/media/cutout-node.png',
  alt: 'A configuration node with a provider picker and two connected outputs.',
  width: 902,
  height: 1088,
  kind: 'cut-out',
};

/** An illustration cover: unboxed, empty alt because the title names what it stands for (§9a). */
const COVER_SEAM: BlockCardImage = {
  src: '/design/media/illustration-seam.svg',
  alt: '',
  width: 881,
  height: 544,
  kind: 'illustration',
};

/** A capture: the one kind whose edge is its own. In a card the crop box rules every kind (5a). */
const CAPTURE: BlockCardImage = {
  src: '/design/media/capture-listing.webp',
  alt: 'Listing editor with four bullet fields beside an AI assistance panel.',
  width: 1436,
  height: 883,
  kind: 'capture',
  sources: DERIVED('capture-listing', 'jpg'),
};

/** The old 480×320 card sample, as a record that arrives with NO dimensions (spec § 17 Q15). */
const NO_DIMENSIONS: BlockCardImage = {
  src: '/design/list-card-sample.svg',
  alt: '',
};

/** A 1600×900 screenshot with small type — the asset that fails at 326 (B3). */
const WIDE_CAPTURE: BlockCardImage = {
  src: '/design/figure-sample-wide.svg',
  alt: '',
  width: 1600,
  height: 900,
  kind: 'capture',
};

const cover = (image: BlockCardImage): BlockCardMedia => ({ type: 'image', image });

/** Stand-in pools for the mixed sets (§ 5.7): studio photographs, which show our own work. */
const STAND_INS: readonly BlockCardImage[] = [getKitPhoto('studio-whiteboard-crit')];
const STAND_INS_TWO: readonly BlockCardImage[] = [
  getKitPhoto('studio-whiteboard-crit'),
  getKitPhoto('studio-session-talk'),
];

/* ── Set shapes (cmp-feature) ────────────────────────────────────────────────────
   The set's other arrangements, each on its smallest honest input. Kit photographs, once each. */
const kit = (id: Parameters<typeof getKitPhoto>[0]): BlockCardMedia => ({
  type: 'image',
  image: getKitPhoto(id),
});
const SHAPE_SPOTLIGHT: readonly BlockCardSetItem[] = [
  {
    id: 'sh-lead',
    title: 'One record for a claims team of four hundred',
    body: 'Two systems gave two answers about one customer. We settled which ships.',
    media: kit('pair-at-laptop-sticky-wall'),
    href: ROUTES.caseStudies,
  },
  {
    id: 'sh-note-1',
    eyebrow: 'What we learned',
    title: 'The rule that decides is the design',
    body: 'Most of the work was agreeing which system owns each fact.',
    href: ROUTES.caseStudies,
  },
  {
    id: 'sh-note-2',
    eyebrow: 'In numbers',
    title: 'Eleven screens became four',
    body: 'Support tickets halved within the quarter.',
    href: ROUTES.caseStudies,
  },
];
const SHAPE_WIDE: readonly BlockCardSetItem[] = [
  {
    id: 'sw-1',
    title: 'Underwriting in one screen, not nine',
    body: 'The decision and its evidence side by side, for the first time.',
    media: kit('conversation-chalkboard'),
    href: ROUTES.caseStudies,
  },
  {
    id: 'sw-2',
    title: 'Search that knows the catalogue',
    body: 'Forty thousand parts, found by what engineers call them.',
    media: kit('wall-sketching-portrait'),
    href: ROUTES.caseStudies,
  },
  {
    id: 'sw-3',
    title: 'A care record nurses can scan',
    body: 'The six things a shift needs, first, on every patient.',
    media: kit('moodboard-wall-desk'),
    href: ROUTES.caseStudies,
  },
];
const SHAPE_PAIR: readonly BlockCardSetItem[] = [
  {
    id: 'sp-1',
    title: 'A fixed-scope project',
    body: 'A defined problem, a fixed fee and a date.',
    media: kit('whiteboard-two-hands'),
  },
  {
    id: 'sp-2',
    title: 'An embedded team',
    body: 'Designers and design engineers inside your roadmap.',
    media: kit('pair-desk-through-plants'),
  },
];
const SHAPE_ICONS: readonly BlockCardSetItem[] = [
  {
    id: 'si-1',
    icon: 'database',
    title: 'A product model',
    body: 'The records, their owners and the rules that bind them.',
  },
  {
    id: 'si-2',
    icon: 'layers',
    title: 'Flows that hold',
    body: 'Every path through the work, including the unhappy ones.',
  },
  {
    id: 'si-3',
    icon: 'widget',
    title: 'A component set',
    body: 'Built once in code and documented where the team works.',
  },
  {
    id: 'si-4',
    icon: 'clipboard-check',
    title: 'A handover plan',
    body: 'What your team runs after us, written down and rehearsed.',
  },
];
const SHAPE_RESOURCES: readonly BlockCardSetItem[] = [
  {
    id: 'sr-1',
    icon: 'clipboard-check',
    title: 'An AI feature review',
    body: 'Twelve questions before launch.',
    meta: 'Checklist · PDF',
    href: ROUTES.tools,
  },
  {
    id: 'sr-2',
    icon: 'notebook',
    title: 'A decision log',
    body: 'One page per decision.',
    meta: 'Template · Notion',
    href: ROUTES.tools,
  },
  {
    id: 'sr-3',
    icon: 'document-text',
    title: 'A crit that decides',
    body: 'End a review with fewer questions.',
    meta: 'Guide · PDF',
    href: ROUTES.guides,
  },
];

/** One item of a list by position, for the specimens that reorder or reuse a set's members. Its
    `id` rides along into a lone card's props, where it is unused. */
function item(list: readonly BlockCardSetItem[], index: number): BlockCardSetItem {
  const found = list[index];
  if (!found) throw new Error(`BlockCard specimen: no item ${index}`);
  return found;
}

/* ── Content ─────────────────────────────────────────────────────────────────────
   Realistic families, at realistic lengths, because ruling C2 is judged on how a set READS. */

/** The case-study card — client, a one-line description, a cover of every kind. The
    titles are live ones at the corpus's extremes (37 and 87 characters, 29 Sep). */
const CASE_INDEX: readonly BlockCardSetItem[] = [
  {
    id: 'cs-dealpath',
    eyebrow: 'Dealpath',
    title: 'Simplifying the interface without simplifying the work',
    body: 'The problem was never the amount of data; it was an unclear decision.',
    media: cover(CAPTURE),
    href: ROUTES.caseStudies,
  },
  {
    id: 'cs-buildtwin',
    eyebrow: 'BuildTwin',
    title: 'Trust needed evidence, not reassurance',
    body: 'Showing engineers what the AI checked, what it missed, and what stayed theirs.',
    media: cover(COVER_FLOW),
    href: ROUTES.caseStudies,
  },
  {
    id: 'cs-chain-hut',
    eyebrow: 'The Chain Hut',
    title: "Crafting a Seamless E-Commerce Experience for UK's Online Fashion Jewellery Market",
    body: 'A jewellery store rebuilt around product discovery on a phone.',
    media: cover(COVER_REVIEWS),
    href: ROUTES.caseStudies,
  },
  {
    id: 'cs-benchmark',
    eyebrow: 'Benchmark Gensuite',
    title: 'Evolving the experience across a 75+ application enterprise suite',
    body: 'Modernising a large suite is a design-systems problem, not many redesigns.',
    media: cover(COVER_SEAM),
    href: ROUTES.caseStudies,
  },
  {
    id: 'cs-connectx',
    eyebrow: 'ConnectX',
    title: 'Building energy management as a 0 to 1 AI product',
    body: 'Adding a chatbot is not the same as building an AI-native product.',
    media: cover(COVER_NODE),
    href: ROUTES.caseStudies,
  },
  {
    id: 'cs-omny',
    eyebrow: 'OmnyAI',
    title: 'Designing trust: reframing the AI–human relationship',
    body: 'Decision control moved back to the person the AI was meant to help.',
    media: cover(CAPTURE),
    href: ROUTES.caseStudies,
  },
];

/** Service and capability cards — media-less by ruling C1. */
const SERVICES: readonly BlockCardSetItem[] = [
  {
    id: 'product-design',
    eyebrow: 'Service',
    title: 'Product design',
    body: 'Frame the decision, the evidence it needs and the outcome a customer should notice, then design the thing that earns it.',
    href: ROUTES.productDesign,
  },
  {
    id: 'design-systems',
    eyebrow: 'Service',
    title: 'Design systems',
    body: 'Turn recurring interface decisions into one shared, durable language that a product team can build with.',
    href: ROUTES.designSystems,
  },
  {
    id: 'design-engineering',
    eyebrow: 'Service',
    title: 'Design engineering',
    body: 'Carry interaction intent into production alongside the implementation team, in their codebase.',
    href: ROUTES.designEngineering,
  },
  {
    id: 'ai-product-ux',
    eyebrow: 'Service',
    title: 'AI product UX',
    body: 'Make model behaviour legible enough for the people using it to judge it, trust it and correct it.',
    href: ROUTES.aiProductUx,
  },
  {
    id: 'readiness',
    eyebrow: 'Audit',
    title: 'AI product UX readiness',
    body: 'A two-week review of where your product explains its model and where it asks for blind trust.',
    href: ROUTES.aiProductUxReadiness,
  },
];

/** Static situation items — media-less and unlinked, the other common text-only set. */
const SITUATIONS: readonly BlockCardSetItem[] = [
  {
    id: 'many-owners',
    title: 'Several teams own one decision',
    body: 'Design, engineering and compliance each hold part of the answer and none of them holds the brief.',
  },
  {
    id: 'model-changed',
    title: 'The model changed under the interface',
    body: 'The product still explains last quarter’s behaviour, and support is carrying the difference.',
  },
  {
    id: 'acquired',
    title: 'Four products, four design languages',
    body: 'An acquisition brought its own components, and every shared screen is now a negotiation.',
  },
  {
    id: 'no-evidence',
    title: 'The roadmap outruns the evidence',
    body: 'Features ship on conviction, and nobody can say which of last year’s moved a number.',
  },
];

/** Case studies — every one carries its cover (ch05 §9a). */
const CASE_STUDIES: readonly BlockCardSetItem[] = [
  {
    id: 'connectx',
    eyebrow: 'ConnectX · Case study',
    title: 'Rebuilding a claims workflow around the adjuster',
    body: 'Three systems became one flow, and the average claim lost eleven minutes of re-keying.',
    media: cover(COVER_FLOW),
    href: ROUTES.caseStudies,
    ctaLabel: 'Read the ConnectX case',
  },
  {
    id: 'northwind',
    eyebrow: 'Northwind · Case study',
    title: 'One design language across four acquired products',
    body: 'A shared component set that each product team adopted on its own release schedule.',
    media: cover(COVER_SEAM),
    href: ROUTES.caseStudies,
    ctaLabel: 'Read the Northwind case',
  },
  {
    id: 'halden',
    eyebrow: 'Halden · Case study',
    title: 'Making a forecasting model’s reasoning legible',
    body: 'Planners can now see which inputs moved a forecast, and overrule it with a reason.',
    media: cover(COVER_REVIEWS),
    href: ROUTES.caseStudies,
    ctaLabel: 'Read the Halden case',
  },
  {
    id: 'orbit',
    eyebrow: 'Orbit · Case study',
    title: 'A configuration tool that explains its own defaults',
    body: 'Setup calls halved once every default said why it was the default.',
    media: cover(COVER_NODE),
    href: ROUTES.caseStudies,
    ctaLabel: 'Read the Orbit case',
  },
  {
    id: 'meridian',
    eyebrow: 'Meridian · Case study',
    title: 'Field operations on one screen, offline first',
    body: 'Crews close jobs without signal, and the office sees them the moment they reconnect.',
    media: cover(COVER_FLOW),
    href: ROUTES.caseStudies,
    ctaLabel: 'Read the Meridian case',
  },
];

/** Insights — the family ruling C1 adds: a cover where the resource has one, none where not. */
const INSIGHTS: readonly BlockCardSetItem[] = [
  {
    id: 'article-seams',
    eyebrow: 'Article',
    title: 'Where design and build meet, and why the seam matters',
    body: 'A component is a contract. The seam between the file and the codebase is where it breaks.',
    media: cover(COVER_SEAM),
    href: ROUTES.articles,
    ctaLabel: 'Read article',
  },
  {
    id: 'podcast-trust',
    eyebrow: 'Podcast',
    title: 'Designing for a model you cannot fully predict',
    body: 'Forty minutes on confidence, correction and the interface’s job when the model is wrong.',
    href: ROUTES.podcasts,
    ctaLabel: 'Listen to the episode',
  },
  {
    id: 'video-review',
    eyebrow: 'Video',
    title: 'A design review, recorded end to end',
    body: 'One real review of one real flow, with the decisions and the arguments left in.',
    media: cover(COVER_REVIEWS),
    href: ROUTES.videos,
    ctaLabel: 'Watch the video',
  },
  {
    id: 'article-evidence',
    eyebrow: 'Article',
    title: 'The roadmap is a claim about evidence',
    body: 'How to read a roadmap for what it assumes, and what to ask for before a feature ships.',
    href: ROUTES.articles,
    ctaLabel: 'Read article',
  },
];

const SURFACES: readonly { surface: SectionSurface; note: string }[] = [
  {
    surface: 'paper',
    note: 'Title at neutral-900, body at 700, eyebrow at 600. The cta is a link Button and takes its ramp from Button. Covers are legal here.',
  },
  {
    surface: 'tint',
    note: 'The light-surface text inks hold; the eyebrow steps to neutral-700 because 600 would be 4.39:1. Covers are legal here — the cut-out shows the tint through its alpha.',
  },
  {
    surface: 'ink',
    note: 'Title to white, body to neutral-300, eyebrow to 400; Button lifts the cta on its own ink block. Text-only: a cover is not placed on ink (ch05 §9a), so a reserved band carries the media-less set.',
  },
  {
    surface: 'blue',
    note: 'White and the light Brandeis steps carry title, body, eyebrow and focus; Button carries the cta. Text-only for the same reason as ink, and an illustration is never placed on blue (§4a).',
  },
] as const;

/* Every --bcrd colour token, as each surface block declares it (tokens/components/block-card.css).
   One constant, rendered under every surface band and both nested panels, so the specimen lists the
   whole colour set rather than a hand-picked five. The cta's ramp is Button's and is listed after. */
const COLOUR_TOKENS = {
  paper: [
    ['--bcrd-title-ink', '--color-neutral-900'],
    ['--bcrd-title-ink-hover', '--color-brandeis-500'],
    ['--bcrd-title-ink-pressed', '--color-brandeis-700'],
    ['--bcrd-mark-ink', '--color-brandeis-500'],
    ['--bcrd-body-ink', '--color-neutral-700'],
    ['--bcrd-eyebrow-ink', '--color-neutral-600'],
    ['--bcrd-media-rule-ink', '--color-neutral-300'],
    ['--bcrd-text-rule-ink', '--color-neutral-300'],
    ['--bcrd-box-ground-hover', '--color-paper-deep'],
    ['--bcrd-box-ground-pressed', '--color-neutral-100'],
    ['--bcrd-ring-color', '--color-brandeis-500'],
    ['--bcrd-ring-gap-color', '--color-paper'],
    ['--btn-link-primary-fg', '--color-brandeis-500'],
  ],
  tint: [
    ['--bcrd-title-ink', '--color-neutral-900'],
    ['--bcrd-title-ink-hover', '--color-brandeis-500'],
    ['--bcrd-title-ink-pressed', '--color-brandeis-700'],
    ['--bcrd-mark-ink', '--color-brandeis-500'],
    ['--bcrd-body-ink', '--color-neutral-700'],
    ['--bcrd-eyebrow-ink', '--color-neutral-700'],
    ['--bcrd-media-rule-ink', '--color-neutral-400'],
    ['--bcrd-text-rule-ink', '--color-neutral-400'],
    ['--bcrd-box-ground-hover', '--color-neutral-100'],
    ['--bcrd-box-ground-pressed', '--color-neutral-200'],
    ['--bcrd-ring-color', '--color-brandeis-500'],
    ['--bcrd-ring-gap-color', '--color-paper-deep'],
    ['--btn-link-primary-fg', '--color-brandeis-500'],
  ],
  ink: [
    ['--bcrd-title-ink', '--color-white'],
    ['--bcrd-title-ink-hover', '--color-brandeis-300'],
    ['--bcrd-title-ink-pressed', '--color-brandeis-100'],
    ['--bcrd-mark-ink', '--color-brandeis-300'],
    ['--bcrd-body-ink', '--color-neutral-300'],
    ['--bcrd-eyebrow-ink', '--color-neutral-400'],
    ['--bcrd-media-rule-ink', '--color-neutral-700'],
    ['--bcrd-text-rule-ink', '--color-neutral-700'],
    ['--bcrd-box-ground-hover', '--color-neutral-900'],
    ['--bcrd-box-ground-pressed', '--color-neutral-800'],
    ['--bcrd-ring-color', '--color-brandeis-300'],
    ['--bcrd-ring-gap-color', '--color-neutral-950'],
    ['--btn-link-primary-fg', '--color-brandeis-300'],
  ],
  blue: [
    ['--bcrd-title-ink', '--color-white'],
    ['--bcrd-title-ink-hover', '--color-brandeis-50'],
    ['--bcrd-title-ink-pressed', '--color-brandeis-100'],
    ['--bcrd-mark-ink', '--color-white'],
    ['--bcrd-body-ink', '--color-brandeis-50'],
    ['--bcrd-eyebrow-ink', '--color-brandeis-100'],
    ['--bcrd-media-rule-ink', '--color-brandeis-300'],
    ['--bcrd-text-rule-ink', '--color-brandeis-300'],
    ['--bcrd-box-ground-hover', '--color-brandeis-600'],
    ['--bcrd-box-ground-pressed', '--color-brandeis-700'],
    ['--bcrd-ring-color', '--color-white'],
    ['--bcrd-ring-gap-color', '--color-brandeis-500'],
    ['--btn-link-primary-fg', '--color-white'],
  ],
} as const;

type CardColumns = ComponentProps<typeof Layout>['columns'];

/** A hand-built grid: the parent owns columns, both seams and equal rows. Rows sit a `column`
    apart, the row seam of every borderless card set (CLAUDE.md § the gap scale, 29 Sep). */
function Cards({
  columns = { base: 1, md: 2 },
  gap = true,
  children,
}: {
  columns?: CardColumns;
  gap?: boolean;
  children: ReactNode;
}) {
  return (
    <Layout
      as="ul"
      columns={columns}
      colGap={gap ? 'gutter' : 'none'}
      rowGap={gap ? 'column' : 'none'}
      equalRows
    >
      {children}
    </Layout>
  );
}

/**
 * The horizontal stack. One track, `rowGap="section"`, and deliberately no separator rule: a
 * borderless card is bounded by distance, and a rule between rows would put ListCard's finish on
 * BlockCard's object. `equalRows` is absent because a single-track stack has no peers to match.
 */
function Rows({ children }: { children: ReactNode }) {
  return (
    <Layout as="ul" rowGap="section">
      {children}
    </Layout>
  );
}

/** A band heading: the number and name, and the paragraph that says what to look for. */
function BandHead({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Layout rowGap="block">
      <h2>{title}</h2>
      <p>{children}</p>
    </Layout>
  );
}

/** The set and the row on a surface: a numbered text set (hairline, blue index, title cue) over a
    horizontal card, with or without its cover, then a boxed icon router. Identical markup on every
    surface. */
function SurfaceSetAndRow({ covers }: { covers: boolean }) {
  return (
    <Layout rowGap="column">
      <BlockCardSet
        lead="none"
        numbered
        cue="title"
        items={[
          {
            id: 's-one',
            title: 'A numbered text card',
            body: 'Hairline, then the blue index, then the title. No arrow: the title is the cue.',
            href: ROUTES.productDesign,
          },
          {
            id: 's-two',
            title: 'Its linked peer',
            body: 'Point at it: the title goes blue; hold it: it deepens.',
            href: ROUTES.designSystems,
          },
          {
            id: 's-three',
            title: 'An unlinked peer',
            body: 'No hover and no cta, and the same rule and index.',
          },
        ]}
      />
      <Rows>
        <BlockCard
          orientation="horizontal"
          eyebrow="Horizontal"
          title={covers ? 'The row, with its cover' : 'The row, head beside body'}
          body={
            covers
              ? 'Media beside copy at 16:9, the title the cue.'
              : 'No cover on this surface, so the hairline stands in for its top edge.'
          }
          media={covers ? cover(COVER_FLOW) : undefined}
          href={ROUTES.caseStudies}
          cue="title"
        />
      </Rows>
      <BoxedRouter />
    </Layout>
  );
}

/** The boxed icon router (frame="box", owner 7 Oct 2026): four linked icon cards and one static,
    two across. Identical markup on every surface. */
function BoxedRouter() {
  return (
    <BlockCardSet
      lead="none"
      across={2}
      scroll="never"
      frame="box"
      items={[
        {
          id: 'b-one',
          icon: 'ruler-pen',
          title: 'Product redesign',
          body: 'The cost sits in the experience, and the model underneath still holds.',
          href: ROUTES.productDesign,
        },
        {
          id: 'b-two',
          icon: 'refresh',
          title: 'Legacy software modernisation',
          body: 'Dependencies and accumulated change cost are the binding constraint.',
          href: ROUTES.productModernisation,
        },
        {
          id: 'b-three',
          icon: 'widget',
          title: 'Design systems',
          body: 'Every screen rebuilds the same component a little differently.',
          href: ROUTES.designSystems,
        },
        {
          id: 'b-four',
          icon: 'code',
          title: 'An unlinked box',
          body: 'No destination: the edge and the inset, no ground and no pointer state.',
        },
      ]}
    />
  );
}

/** Identical markup for every surface proof; covers only where a cover may be placed. */
function SurfaceCards({ covers }: { covers: boolean }) {
  return (
    <Cards columns={{ base: 1, lg: 3 }}>
      <BlockCard
        eyebrow="Service"
        title="Static text-only card"
        body="Title, eyebrow and body resolve without any interactive ink."
      />
      <BlockCard
        eyebrow="Service"
        title="Linked text-only card"
        body="One anchor resolves the cta ink and the keyboard focus ring. The title stays dark."
        href={ROUTES.productDesign}
      />
      <BlockCard
        eyebrow="Case study"
        title={covers ? 'Linked cover card' : 'The same card, its cover withheld'}
        body={
          covers
            ? 'A cut-out cover: no edge, the band showing through its alpha.'
            : 'A cover is not placed on ink or blue, so this band shows the card without one.'
        }
        media={covers ? cover(COVER_FLOW) : undefined}
        href={ROUTES.caseStudies}
        tracks={3}
      />
    </Cards>
  );
}

function ResolvedTokens({ surface }: { surface: keyof typeof COLOUR_TOKENS }) {
  return (
    <Layout as="dl" rowGap="tight">
      {COLOUR_TOKENS[surface].map(([token, value]) => (
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

function ManyCards({ count }: { count: number }) {
  return (
    <Cards columns={{ base: 1, md: 2, xl: 4 }}>
      {Array.from({ length: count }, (_, index) => (
        <BlockCard
          key={index}
          title={`Card ${index + 1}`}
          body="The component does not clamp, paginate, count siblings or hide later rows."
          media={index % 3 === 0 ? cover(COVER_FLOW) : undefined}
        />
      ))}
    </Cards>
  );
}

export default function BlockCardSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>BlockCard</h1>
          <p>
            One borderless card: an optional eyebrow, a title and body, an optional cover image
            through <code>Media</code>, and a whole-card link whose destination is named by a
            read-more cta. It has no edge and no fill, and it never decides its grid —{' '}
            <code>BlockCardSet</code> does, and is the one place that knows the count.
          </p>
        </Layout>
      </Section>

      {/* ── The three rulings, first, because they are what is judged ─────────────── */}

      <Section>
        <Layout rowGap="stack">
          <BandHead title="1 · Text-only sets (ruling C2)">
            Service, audit, glossary and capability cards carry no media (C1), so for most
            families the text-only set is the common case, and it has to read as more than
            identical boxes. It does that with scale and position and nothing else: no box, no
            fill and no border are added. The h4 title carries the weight, the body stays tight
            under it in one copy group, and the whole card is the link. Variety comes from the
            set&rsquo;s arrangement: 3-up, 2-up, and from four items the first card featured
            across the row as a head beside its body.
          </BandHead>
          <Specimen
            title="3 items · BlockCardSet · two from md, three from lg"
            note="Linked service cards. Squint: three columns of dark type, each ending in an ink cta that goes blue on hover, separated by the 32 gutter alone."
          >
            <BlockCardSet items={SERVICES.slice(0, 3)} />
          </Specimen>
          <Specimen
            title="2 items · BlockCardSet · two from md"
            note="Static situation items, no cta. The object is the title and its paragraph; nothing marks a card's edge, and nothing needs to."
          >
            <BlockCardSet items={SITUATIONS.slice(0, 2)} />
          </Specimen>
          <Specimen
            title={`4 items · the first featured (C3: from ${FEATURED_FROM})`}
            note="The featured card is the horizontal arrangement without an image: its head (eyebrow and h3 title) in the first half, its body and cta in the second, spanning the row. The three peers sit below it. One list, one grid: Layout's lead puts the first item in a row of its own."
          >
            <BlockCardSet items={SERVICES.slice(0, 4)} />
          </Specimen>
          <Specimen
            title="5 items · featured + 2×2, four across from lg"
            note="Five service and audit cards. The four peers take the four-card shape: 2×2 from 768 to 1023, one row from 1024 (fix round 2: the 2×2 at 1024 was an image wall 1140 to 1300 tall)."
          >
            <BlockCardSet items={SERVICES} />
          </Specimen>
          <Specimen
            title="4 static items · featured"
            note="The same arrangement with no links: the featured card has no cta, so its second half is the body alone."
          >
            <BlockCardSet items={SITUATIONS} />
          </Specimen>
          <Specimen
            title="bodyHtml · two paragraphs, and a link in the body"
            note="For a corpus item whose body carries a link or a second paragraph, which `body` would flatten: one entry per paragraph, trusted inline HTML built from a parsed tree, the paragraphs a `text` apart in the card's body role. A card with an href is one anchor, so its HTML may not hold a link: a linked card lifts its trailing link into `href` and `ctaLabel`, and an unlinked one may keep it inline, as here."
          >
            <BlockCardSet
              lead="none"
              items={[
                {
                  id: 'html-1',
                  title: 'Benchmark Gensuite.',
                  bodyHtml: [
                    'For Benchmark’s software suite, we turned the new shared patterns into working coded prototypes, and its engineers reviewed them while choices were still open.',
                    'One engineer spotted a build problem the static designs had hidden, while there was still time to design around it. <a href="/case-studies/benchmark-gensuite-enterprise-suite-modernisation">Read the case</a>.',
                  ],
                },
                {
                  id: 'html-2',
                  title: 'GT Tools.',
                  body: 'A plain body beside it, for the set to compare against.',
                },
              ]}
            />
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="2 · Cover-image sets (ruling C1)">
            Case studies carry their cover, and so does every insight or resource that has one —
            articles, videos, podcasts. The image goes through <code>Media</code> with{' '}
            <code>fit=&quot;fill&quot;</code> inside the card&rsquo;s own ratio box: 16:9 (
            <code>--ratio-standard</code>), the one card ratio, in every set and arrangement
            (home round 3). The box draws one hairline round every kind; Media draws none of its
            own inside a card.
          </BandHead>
          <Specimen
            title="3 case studies · three from lg"
            note="A shadowed cut-out, an illustration (empty alt: the title names it) and a light cut-out on its paper-deep contrast panel. The illustration is a hero export shown whole in the 16:9 box: a card illustration is recomposed at the card ratio at supply (B4), and Media leaves it unboxed either way."
          >
            <BlockCardSet items={CASE_STUDIES.slice(0, 3)} />
          </Specimen>
          <Specimen
            title="2 case studies · two from md"
            note="The two-track sizes value: 604 at the cap."
          >
            <BlockCardSet items={CASE_STUDIES.slice(0, 2)} />
          </Specimen>
          <Specimen
            title="4 case studies · the first featured"
            note="The featured card is media beside copy, the cover at 16:9 in half the row, at the lg size (h3 over body-lg). Its image reads the two-track sizes value; the three peers read the three-track one and keep md: three peers is the two-to-three shape."
          >
            <BlockCardSet items={CASE_STUDIES.slice(0, 4)} />
          </Specimen>
          <Specimen
            title="5 case studies · featured + 2×2, four across from lg"
            note={`Four peers in four tracks from lg, so they step to sm (h5 over body-sm): the step follows the track — ${SMALL_FROM} across is 286px at 1470 — not the count (§ 7.2, cmp-feature).`}
          >
            <BlockCardSet items={CASE_STUDIES} />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="2b · Set shapes: spotlight, wide lead, stagger, icon and texture sets">
            The arrangements a feature band chooses (visual-direction § 1.4, cmp-feature). Each
            is one prop on the set; the cards inside are unchanged. The kit page
            /design/kit/feature composes every one of them in a real band.
          </BandHead>
          <Specimen
            title='lead="beside" · the spotlight'
            note="From 1024 the lead takes a 2:1 track at the one 16:9 crop and lg; the rest stack beside it as text notes, their covers dropped. The cover never grows past 16:9 (home round 3)."
          >
            <BlockCardSet items={SHAPE_SPOTLIGHT} lead="beside" />
          </Specimen>
          <Specimen
            title='lead="wide" · a wide lead and two companions, all 16:9'
            note="From 1024, [2, 1, 1]: every cover 16:9, so the lead's is twice its companions' — size contrast in one row. lg over sm. Below 1024 the ordinary three-card set, and on a phone a scroll row."
          >
            <BlockCardSet items={SHAPE_WIDE} lead="wide" />
          </Specimen>
          <Specimen
            title="stagger · a pair, the second dropped a section step"
            note="From 1024 the even card drops 96 (Layout stagger: a track, not a margin). One row only. Below 1024 the two sit level."
          >
            <BlockCardSet items={SHAPE_PAIR} lead="none" stagger />
          </Specimen>
          <Specimen
            title='icon cards · across={2} · size="md" is ignored'
            note="Icon cards are h5 and body-sm whatever the set is told, and their rows sit on their content (no equalRows), one stack apart."
          >
            <BlockCardSet items={SHAPE_ICONS} lead="none" across={2} size="md" />
          </Specimen>
          <Specimen
            title='standIns="texture" · cue="download" · meta'
            note="Artefacts with no cover take the card's own texture cover, three fields in turn, the glyph large in its foot-start corner."
          >
            <BlockCardSet
              items={SHAPE_RESOURCES}
              lead="none"
              standIns="texture"
              cue="download"
            />
          </Specimen>
          <Specimen
            title='media type "sketch" · a generated cover'
            note="13 Oct 2026, the insights hub: an article with no cover takes the Sketch scene DRAWN for it from its own argument, on its dot-field plate inside the same ruled 16:9 box — never a service scene (owner, revised). The caller assigns it item by item, in data. No type on it."
          >
            <BlockCardSet
              lead="none"
              items={[
                {
                  id: 'sketch-1',
                  title: 'Accepting AI-generated front-end code: what review is for now',
                  eyebrow: '26 Sept 2026 · 14 min read',
                  media: { type: 'sketch', name: 'code-review' },
                  href: ROUTES.insights,
                },
                {
                  id: 'sketch-2',
                  title:
                    'Vibe-coded app security checklist: 25 checks before real users arrive',
                  eyebrow: '15 Sept 2026 · 10 min read',
                  media: { type: 'sketch', name: 'security-checklist' },
                  href: ROUTES.insights,
                },
                {
                  id: 'sketch-3',
                  title: 'I vibe-coded an app. Now what? The path from prototype to production',
                  eyebrow: '28 Aug 2026 · 9 min read',
                  media: { type: 'sketch', name: 'prototype-to-production' },
                  href: ROUTES.insights,
                },
              ]}
            />
          </Specimen>
          <Specimen
            title='media type "sketch" · a glossary term, drawn (4 Nov 2026)'
            note="A term's own scene is a cover too: drawn for that one term from its definition, shown wherever the term is (the hub's groups, a term page's related terms). Title from the term's link, body its definition. The shortest and the longest definitions the hub authors, three tracks with two pieces taking two of them."
          >
            <BlockCardSet
              lead="none"
              across={3}
              cue="title"
              scroll="never"
              items={[
                {
                  id: 'term-1',
                  title: 'Workflow design',
                  body: 'How work moves between roles, rules and handoffs, including what happens when the normal path fails.',
                  media: { type: 'sketch', name: 'glossary-workflow-design' },
                  href: glossaryPath('workflow-design'),
                },
                {
                  id: 'term-2',
                  title: 'Design engineering',
                  body: 'Exploring, refining and building product experiences directly in code, from early prototype to production, so permissions and real content behave as designed.',
                  media: { type: 'sketch', name: 'glossary-design-engineering' },
                  href: glossaryPath('design-engineering'),
                },
              ]}
            />
          </Specimen>
          <Specimen
            title="label · an unlinked covered set of three on a phone"
            note="Below 768 it scrolls and, holding nothing focusable, the list takes the tab stop, so it is named by `label` (aria-label). Above 768 it is the ordinary grid and the label is not emitted."
          >
            <BlockCardSet
              items={SHAPE_WIDE.map((card) => ({ ...card, href: undefined }))}
              lead="none"
              label="Three products"
            />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="3 · Mixed sets">
            A set is all-image or all-text (visual-direction § 3.1, 6 Oct 2026). Where covers
            and text-only items meet — an insights index — the set settles it: with a stand-in
            pool, each missing cover takes the next stand-in (marked, never labelled); without
            one, or with too few, every card drops its cover and the set renders as text cards.
            A set never shows a hole or an empty frame.
          </BandHead>
          <Specimen
            title="3 insights · two covers, one without · no pool → C-text"
            note="Article, podcast (no cover), video. standIns absent behaves as standIns={false}: all three render as text cards, hairline first."
          >
            <BlockCardSet items={INSIGHTS.slice(0, 3)} />
          </Specimen>
          <Specimen
            title="The same three · a stand-in pool of one"
            note="The podcast takes the studio photograph; the set is all-image, 16:9 at three across."
          >
            <BlockCardSet items={INSIGHTS.slice(0, 3)} standIns={STAND_INS} />
          </Specimen>
          <Specimen
            title="4 insights · featured · two missing, a pool of two"
            note='The first item decides the featured arrangement: media beside copy. The featured lead is the index&apos;s shape; feature bands pass lead="none".'
          >
            <BlockCardSet items={INSIGHTS} standIns={STAND_INS_TWO} />
          </Specimen>
          <Specimen
            title="4 insights · featured · a pool too short → C-text"
            note="One stand-in for two gaps is not enough, so the set renders as text: the featured row falls to head-beside-body."
          >
            <BlockCardSet items={INSIGHTS} standIns={STAND_INS} />
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="4 · The 326 row">
            Every image placed on the site is approved at 326px, a 390 viewport&rsquo;s column
            (ch05 B3). The frame cannot fire a media query, so the featured card in it still
            splits at this window&rsquo;s width; the 390 capture of this page shows the real
            collapse, where the featured card becomes a stack like any other card.
          </BandHead>
          <Specimen
            title="326 · cover cards"
            note="A cut-out, an illustration, a panelled cut-out, and the wide capture — whose small type is what fails at 326, and is the asset to judge."
          >
            <div className={s.trackMobile}>
              <Cards columns={{ base: 1 }}>
                {CASE_STUDIES.slice(0, 3).map(({ id, ...card }) => (
                  <BlockCard key={id} {...card} />
                ))}
                <BlockCard
                  eyebrow="Case study"
                  title="A wide capture in the phone's column"
                  body="The cover crop at 326, from a 1600×900 screenshot with small type."
                  media={cover(WIDE_CAPTURE)}
                  href={ROUTES.caseStudies}
                />
              </Cards>
            </div>
          </Specimen>
          <Specimen title="326 · text-only cards">
            <div className={s.trackMobile}>
              <Cards columns={{ base: 1 }}>
                {SERVICES.slice(0, 3).map(({ id, ...card }) => (
                  <BlockCard key={id} {...card} />
                ))}
              </Cards>
            </div>
          </Specimen>
        </Layout>
      </Section>

      {/* ── The card itself ──────────────────────────────────────────────────────── */}

      <Section>
        <Layout rowGap="stack">
          <BandHead title="5 · Identity and finish">
            Neither object draws a border on any side, in any state. The tile is bounded by the
            parent gutter alone, and its copy is flush to the media rather than inset from an
            edge that no longer exists. Compare the two titles: the linked one is the same dark
            ink as the static one, and the cta &mdash; a real link Button in the primary tone
            &mdash; is blue at rest, label and arrow.
          </BandHead>
          <Cards>
            <BlockCard
              title="Static and complete"
              body="No destination means no anchor, no cta, no blank action row and no interactive state."
            />
            <BlockCard
              title="Linked as one target"
              body="A non-blank destination adds one native anchor and the cta that names it."
              href={ROUTES.productDesign}
            />
          </Cards>
          <Specimen
            title="Title ink · linked and static, side by side"
            note="Inspect both computed colours. Both must be --bcrd-title-ink. The cta is --btn-link-neutral-fg at rest and goes blue only on hover, focus and press; Button owns that."
          >
            <Cards>
              <BlockCard
                eyebrow="Case study"
                title="The same title ink when linked"
                body="The card navigates and the heading stays dark."
                media={cover(COVER_FLOW)}
                href={ROUTES.caseStudies}
              />
              <BlockCard
                eyebrow="Case study"
                title="The same title ink when static"
                body="Identical markup with the destination removed."
                media={cover(COVER_FLOW)}
              />
            </Cards>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="6 · Media by kind, and the record">
            The card owns the box, the ratio and — since 29 Sep — the edge: one hairline round
            every kind, because the card crops every kind to its own ratio (ch05 amendment 5a).{' '}
            <code>Media</code> is passed <code>edge=&quot;placement&quot;</code> and draws none,
            so a capture shows one line, not two. A cut-out keeps its shadow and panel.
          </BandHead>
          <Cards columns={{ base: 1, md: 2, xl: 4 }}>
            <BlockCard
              eyebrow="cut-out · shadow"
              title="Shadow inside the rule"
              body="The card's hairline; the one drop shadow still follows the alpha."
              media={cover(COVER_FLOW)}
            />
            <BlockCard
              eyebrow="cut-out · panel"
              title="On its contrast panel"
              body="The panel fills the ruled box; the part is inset by the gutter (Media § 17 Q2)."
              media={cover(COVER_REVIEWS)}
            />
            <BlockCard
              eyebrow="illustration"
              title="Ruled as a crop"
              body="Cropped to the card's ratio, so the card marks the cut. No panel, no shadow."
              media={cover(COVER_SEAM)}
            />
            <BlockCard
              eyebrow="capture"
              title="One line, not two"
              body="The capture's own hairline is handed to the box, so it is not doubled."
              media={cover(CAPTURE)}
            />
          </Cards>
          <Specimen
            title="A record with no dimensions · a blank source"
            note="Several view models still arrive without width and height. The card gives such a record its box's proportions and drops its sources — a srcset needs the master's true width. A blank src omits the media and warns, and no placeholder ships."
          >
            <Cards>
              <BlockCard
                title="No width, no height"
                body="Rendered at the box's 16:9; the file is fetched as-is, with no srcset."
                media={cover(NO_DIMENSIONS)}
              />
              <BlockCard
                title="Blank image source"
                body="No broken image and no empty frame remain."
                media={cover({ src: '   ', alt: '' })}
              />
            </Cards>
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="7 · Eyebrow ladder">
            One optional plain string above the title, in uppercase mono at the quiet-label ink.
            What it holds is the caller&rsquo;s composition — a client, a content type, a topic
            or a kicker.
          </BandHead>
          <Cards columns={{ base: 1, md: 2, xl: 4 }}>
            <BlockCard
              eyebrow="ConnectX"
              title="A client name"
              body="The eyebrow names whose work this is."
              media={cover(COVER_FLOW)}
              href={ROUTES.caseStudies}
            />
            <BlockCard
              eyebrow="Case study"
              title="A content type"
              body="The eyebrow names what kind of page this is."
              media={cover(COVER_SEAM)}
              href={ROUTES.caseStudies}
            />
            <BlockCard
              eyebrow="Featured —"
              title="A kicker"
              body="The eyebrow is editorial rather than taxonomic."
              media={cover(COVER_REVIEWS)}
              href={ROUTES.caseStudies}
            />
            <BlockCard
              title="Eyebrow omitted"
              body="No element and no seam remain; the title starts the copy group."
              media={cover(COVER_NODE)}
              href={ROUTES.caseStudies}
            />
          </Cards>
          <Specimen
            title="Eyebrow without media, and a long eyebrow"
            note="The label wraps like any other copy; there is no clamp and no truncation."
          >
            <Cards>
              <BlockCard
                eyebrow="Design systems"
                title="Text-only with an eyebrow"
                body="The three copy parts stay one tight group."
              />
              <BlockCard
                eyebrow="A deliberately long eyebrow line that has to wrap in a narrow track"
                title="Long eyebrow"
                body="It wraps rather than widening the card."
              />
            </Cards>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="8 · The cta and the title cue">
            The cta is for text-only linked cards by default (29 Sep), and for any card whose
            action is not obvious from its title (<code>cue=&quot;cta&quot;</code>). A card with
            a cover renders no cta and no arrow (owner, 7 Oct 2026 — the blue arrow after nearly
            every title read as bulky): the whole card is the link, and on hover and focus the
            title goes blue while the image leans in. The cta is the shipped link{' '}
            <code>Button</code>, with its arrow, rendered <code>as=&quot;span&quot;</code>{' '}
            inside the one frame anchor: never in the tab order, no nested link. Tab to a card
            and count focus stops: one.
          </BandHead>
          <Cards columns={{ base: 1, lg: 3 }}>
            <BlockCard
              eyebrow="Case study"
              title="Cover, no cta, no arrow"
              body="Linked and covered: hover and the title goes blue as the image leans in."
              media={cover(COVER_FLOW)}
              href={ROUTES.caseStudies}
              tracks={3}
            />
            <BlockCard
              eyebrow="ConnectX"
              title="Caller-named label"
              body="Text-only, so the page's named line renders."
              href={ROUTES.caseStudies}
              ctaLabel="Read the ConnectX case"
              tracks={3}
            />
            <BlockCard
              eyebrow="Service"
              title="No destination, no cta"
              body="A static card is complete without an empty action row."
            />
          </Cards>
          <Specimen
            title="Blank ctaLabel · long ctaLabel in a narrow track"
            note="A whitespace-only label falls back to the default and warns. Button keeps its label and glyph on one line by design, so a long label in a narrow track is the case to watch."
          >
            <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="block">
              <Cards columns={{ base: 1 }}>
                <BlockCard
                  title="Blank label"
                  body="Falls back to the default wording."
                  href={ROUTES.caseStudies}
                  ctaLabel="   "
                />
              </Cards>
              <div className={s.trackXs}>
                <Cards columns={{ base: 1 }}>
                  <BlockCard
                    title="Long label at 192px"
                    body="The cta's arrow stays with its last word."
                    href={ROUTES.caseStudies}
                    ctaLabel="Read the whole engagement write-up"
                  />
                </Cards>
              </div>
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title='8b · The boxed card · frame="box"'>
            Owner, 7 Oct 2026; edge removed 9 Oct 2026. For a set whose cards must read as
            separate targets — an icon router of four to six destinations — every card keeps a
            block (24) inset and NO edge on any side. The inset is what the hover is for: a
            linked box paints a ground at the 8 radius under the pointer, its title goes blue,
            and focus draws the ring round the inset. Boxed rows sit a gutter apart. A text-only
            card draws no top hairline inside a box. A set of clickable cards sits UNDER its
            head at full width, never beside it or a photograph. Default stays unboxed, and it
            is the set&rsquo;s decision, never one card&rsquo;s.
          </BandHead>
          <Specimen
            title="icon router · six, three across, under its head · the service-page Router"
            note="BlockCardSet lead=none scroll=never frame=box. Five services and an audit, at the full column: the head stacks above, never beside."
          >
            <BlockCardSet
              lead="none"
              scroll="never"
              frame="box"
              items={[
                [
                  'ruler-pen',
                  'Product Redesign',
                  'The cost sits in the experience, and the model underneath still holds.',
                  ROUTES.productDesign,
                ],
                [
                  'refresh',
                  'Legacy Software Modernisation',
                  'Dependencies and accumulated change cost are the binding constraint.',
                  ROUTES.productModernisation,
                ],
                [
                  'layers',
                  'Replatforming Product Design',
                  'The platform move is decided; the behaviour that must survive is not.',
                  ROUTES.productModernisation,
                ],
                [
                  'widget',
                  'Design Systems',
                  'Every screen rebuilds the same component a little differently.',
                  ROUTES.designSystems,
                ],
                [
                  'code',
                  'Software Development',
                  'The change is decided, and it needs building and shipping.',
                  ROUTES.softwareDevelopment,
                ],
                [
                  'checklist',
                  'The modernisation worksheet',
                  'You can see the cost, but not yet which layer it sits in.',
                  ROUTES.contact,
                ],
              ].map(([icon, title, body, href]) => ({
                id: title as string,
                icon: icon as IconName,
                title: title as string,
                body: body as string,
                href: href as string,
              }))}
            />
          </Specimen>
          <Specimen
            title="text, cover and cta cards, boxed · three across"
            note="A text-only box has no top hairline (the box draws it). A cover sits inside the inset. A cta card's title holds still and the cta moves."
          >
            <BlockCardSet
              lead="none"
              frame="box"
              cue="title"
              items={[
                {
                  id: 'bx-text',
                  eyebrow: 'Service',
                  title: 'A text-only card in a box',
                  body: 'The index or eyebrow, the title and the body, 24 inside the edge.',
                  href: ROUTES.productDesign,
                },
                {
                  id: 'bx-static',
                  eyebrow: 'Note',
                  title: 'Unlinked, boxed',
                  body: 'The same edge and inset; no ground, no pointer state.',
                },
                {
                  id: 'bx-third',
                  eyebrow: 'Service',
                  title: 'A third text card',
                  body: 'Rows of boxes sit a gutter apart.',
                  href: ROUTES.designSystems,
                },
              ]}
            />
          </Specimen>
          <Specimen title="cta-cued boxes · the action at the foot, pinned level">
            <BlockCardSet
              lead="none"
              frame="box"
              cue="cta"
              items={[
                {
                  id: 'bc-one',
                  title: 'Accessibility audit',
                  body: 'A ranked list of fixes, each costed and sequenced.',
                  href: ROUTES.contact,
                  ctaLabel: 'Book an audit',
                },
                {
                  id: 'bc-two',
                  title: 'Design-to-code audit',
                  body: 'Where the build drifts from the design, and what it costs you to leave it.',
                  href: ROUTES.contact,
                  ctaLabel: 'Book an audit',
                },
                {
                  id: 'bc-three',
                  title: 'The modernisation worksheet',
                  body: 'You can see the cost, but not yet which layer it sits in.',
                  href: ROUTES.contact,
                  ctaLabel: 'Open the worksheet',
                },
              ]}
            />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title='8c · The tile · frame="tile"'>
            Owner, 3 Nov 2026 (/contact, &ldquo;Other ways to reach us&rdquo;). A filled ground
            at rest, one step off the surface, at the 16 radius: no edge, and no ground that
            appears only under the pointer. The copy sits a gutter inside. For a short set of
            destinations, each led by its glyph and closed by its own action: linkScope=cta, so
            the tile does not answer the pointer and the action does. ctaEmphasis=outline draws
            that action as a labelled outline; a destination that leaves the site (a mailbox,
            another origin) takes the up-right arrow, one that stays takes the right arrow.
          </BandHead>
          <Specimen
            title="three routes, each with its own action · the contact page"
            note="BlockCardSet lead=none across=3 frame=tile linkScope=cta ctaEmphasis=outline."
          >
            <BlockCardSet
              lead="none"
              across={3}
              frame="tile"
              linkScope="cta"
              ctaEmphasis="outline"
              items={[
                {
                  id: 'tl-hello',
                  icon: 'letter',
                  title: 'General or press inquiries',
                  href: 'mailto:hello@tcules.com',
                  ctaLabel: 'hello@tcules.com',
                },
                {
                  id: 'tl-partners',
                  icon: 'hand-shake',
                  title: 'For partnerships or vendors',
                  href: 'mailto:partners@tcules.com',
                  ctaLabel: 'partners@tcules.com',
                },
                {
                  id: 'tl-careers',
                  icon: 'users-group-rounded',
                  title: 'Looking to work with us?',
                  href: ROUTES.careers,
                  ctaLabel: 'Careers',
                },
              ]}
            />
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Specimen
            title="the tile on tint · its ground steps to paper"
            note="--bcrd-tile-ground per surface: paper-deep on paper, paper on tint, one step off ink and blue."
          >
            <BlockCardSet
              lead="none"
              across={3}
              frame="tile"
              linkScope="cta"
              ctaEmphasis="outline"
              items={[
                {
                  id: 'tt-one',
                  icon: 'letter',
                  title: 'General or press inquiries',
                  body: 'A tile with a line of body under its title.',
                  href: 'mailto:hello@tcules.com',
                  ctaLabel: 'hello@tcules.com',
                },
                {
                  id: 'tt-two',
                  icon: 'users-group-rounded',
                  title: 'Looking to work with us?',
                  href: ROUTES.careers,
                  ctaLabel: 'Careers',
                },
                {
                  id: 'tt-three',
                  icon: 'hand-shake',
                  title: 'A static tile, no action',
                  body: 'The ground and the inset, nothing under the pointer.',
                },
              ]}
            />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="8c · The icon card · the glyph is the title's em">
            Owner, 7 Oct 2026: size each icon from the card title, from a token; 9 Oct 2026: the
            glyph stands on its own row ABOVE the title, never inline beside it. It is set in
            the title&rsquo;s own role, so --bcrd-icon-size (1em) is 18 over an h5, 22 over an
            h4 and 34 over the horizontal card&rsquo;s h3, stepping with the roles at 1023 and
            767. An icon card takes no top hairline (that is the text card&rsquo;s); a router
            set that must read as separate objects is boxed (band 8b). A set of icon cards is
            always sm.
          </BandHead>
          <Specimen
            title="the ladder · one icon card per size step"
            note="BlockCard size=sm | md | lg, icon=ruler-pen, linked. Glyph 22 / 28 / 34 at 1440."
          >
            <Cards columns={{ base: 1, lg: 3 }}>
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <BlockCard
                  key={size}
                  size={size}
                  icon="ruler-pen"
                  title={`Product design, ${size}`}
                  body="The glyph is set in the title's role, so it is always the title's em."
                  href={ROUTES.productDesign}
                />
              ))}
            </Cards>
          </Specimen>
          <Specimen
            title="a long title · the glyph holds the first line"
            note="Two and three lines of h5: the glyph stays centred on line one, never on the block."
          >
            <BlockCardSet
              lead="none"
              scroll="never"
              items={[
                {
                  id: 'lt-one',
                  icon: 'refresh',
                  title: 'Legacy software modernisation without a rewrite',
                  body: 'Dependencies and accumulated change cost are the binding constraint.',
                  href: ROUTES.productModernisation,
                },
                {
                  id: 'lt-two',
                  icon: 'layers',
                  title:
                    'Replatforming product design while the old platform is still live and paying',
                  body: 'The platform move is decided; the behaviour that must survive is not.',
                  href: ROUTES.productModernisation,
                },
                {
                  id: 'lt-three',
                  icon: 'widget',
                  title: 'Design systems',
                  body: 'Every screen rebuilds the same component a little differently.',
                },
              ]}
            />
          </Specimen>
          <p>
            Sections of clickable cards — eyebrow, heading and body, then three, four or six
            cards, with no decorative image — are laid out in{' '}
            <a href="/design/kit/services">Kit · Services</a>.
          </p>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="9 · Orientation">
            One anatomy, two arrangements, and a presentation prop rather than a CMS field.
            Vertical fills a grid track. Horizontal takes two equal tracks from md and defaults
            to the <code>lg</code> size (band 22): media beside copy at 16:9 when there is a
            cover, head beside body when there is not. <code>imageSide</code> is set per card —
            there is no alternation logic inside the component, because a card that alternated
            would have to know its index.
          </BandHead>

          <Specimen
            title='orientation="horizontal" · imageSide="left" and "right"'
            note="Inspect the DOM order: it follows the visual order, so no CSS order property is needed and the reading order is never reversed."
          >
            <Rows>
              <BlockCard {...item(CASE_STUDIES, 0)} orientation="horizontal" imageSide="left" />
              <BlockCard
                {...item(CASE_STUDIES, 1)}
                orientation="horizontal"
                imageSide="right"
              />
            </Rows>
          </Specimen>

          <Specimen
            title="A stacked horizontal group · alternated by the caller · no separator rule"
            note={`rowGap="section" is the only thing between these rows. The caller alternates the side by index; the alternation comes from the composition rather than a card prop.`}
          >
            <Rows>
              {CASE_STUDIES.slice(0, 3).map(({ id, ...card }, index) => (
                <BlockCard
                  key={id}
                  {...card}
                  orientation="horizontal"
                  imageSide={index % 2 === 0 ? 'left' : 'right'}
                />
              ))}
            </Rows>
          </Specimen>

          <Specimen
            title="Horizontal without an image · head beside body"
            note="The copy splits across the two tracks instead of leaving one empty: eyebrow and title first, body and cta second, top-aligned. imageSide has nothing to place and is ignored. Below md it collapses to the vertical card's order."
          >
            <Rows>
              <BlockCard {...item(SERVICES, 3)} orientation="horizontal" />
              <BlockCard {...item(SITUATIONS, 0)} orientation="horizontal" imageSide="right" />
            </Rows>
          </Specimen>

          <Specimen
            title="Media ratio · 16:9 in every orientation and set"
            note="Inspect the wrappers' computed aspect-ratio: one token, --bcrd-media-ratio, aliasing --ratio-standard (16:9), for every tile and row at every width (home round 3, 11 Oct 2026). There is no ratio prop."
          >
            <Layout rowGap="stack">
              <Cards columns={{ base: 1, md: 2 }}>
                <BlockCard
                  eyebrow="Vertical · 16:9"
                  title="The grid tile crop"
                  body="Wide enough that the image does not dominate the copy beneath it."
                  media={cover(COVER_FLOW)}
                  href={ROUTES.caseStudies}
                />
                <BlockCard
                  eyebrow="Vertical · 16:9"
                  title="Its grid peer"
                  body="Both tracks resolve the same vertical ratio."
                  media={cover(COVER_FLOW)}
                  href={ROUTES.caseStudies}
                />
              </Cards>
              <Rows>
                <BlockCard
                  orientation="horizontal"
                  eyebrow="Horizontal · 16:9"
                  title="The row crop"
                  body="The same crop as the tile, so one cover reads alike in both."
                  media={cover(COVER_FLOW)}
                  href={ROUTES.caseStudies}
                />
              </Rows>
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="10 · Hand-built grid-count ladder">
            A caller that is not a <code>BlockCardSet</code> still states columns, gutter seams
            and equal rows itself; no card knows its count.
          </BandHead>
          <Specimen title="2 cards · md:2">
            <Cards>
              {SITUATIONS.slice(0, 2).map(({ id, ...card }) => (
                <BlockCard key={id} {...card} />
              ))}
            </Cards>
          </Specimen>
          <Specimen title="3 cards · md:2, lg:3">
            <Cards columns={{ base: 1, md: 2, lg: 3 }}>
              {SITUATIONS.slice(0, 3).map(({ id, ...card }) => (
                <BlockCard key={id} {...card} />
              ))}
            </Cards>
          </Specimen>
          <Specimen title="4 cards · md:2, xl:4 · no featured, because nothing asked for one">
            <Cards columns={{ base: 1, md: 2, xl: 4 }}>
              {SITUATIONS.map(({ id, ...card }) => (
                <BlockCard key={id} {...card} />
              ))}
            </Cards>
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="11 · Static majority and linked minority">
            Eight cards, exactly two links: six static objects remain visually complete.
          </BandHead>
          <Cards columns={{ base: 1, md: 2, xl: 4 }}>
            {Array.from({ length: 8 }, (_, index) => {
              const linked = index === 1 || index === 5;
              return (
                <BlockCard
                  key={index}
                  title={linked ? `Linked card ${index + 1}` : `Static card ${index + 1}`}
                  body="The same title ink and copy hold whether or not navigation exists."
                  href={linked ? ROUTES.designEngineering : undefined}
                />
              );
            })}
          </Cards>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="12 · States">
            Point at, hold and Tab to both linked cards. On the covered card the image leans in
            (1.03) inside its ruled box, which never moves, and nothing else changes — no
            underline, no darker rule. On the text-only card the cta wipes its underline in,
            because the frame carries <code>data-btn-link-group</code>. Keyboard focus shows
            what hover shows, plus the surface-aware two-part ring around the whole card.
          </BandHead>
          <Cards columns={{ base: 1, md: 3 }}>
            <BlockCard
              eyebrow="ConnectX"
              title="Point, hold and Tab"
              body="Rest, hover, focus and pressed all come from this one native link."
              media={cover(CAPTURE)}
              href={ROUTES.caseStudies}
            />
            <BlockCard
              eyebrow="Service"
              title="The text-only linked card"
              body="No cover, so the cta says it navigates."
              href={ROUTES.caseStudies}
            />
            <Layout rowGap="tight">
              {[
                [
                  'rest',
                  'Dark title, quiet eyebrow, the image in a --bcrd-media-rule-ink hairline.',
                ],
                [
                  'hover',
                  'The image scales to --bcrd-media-zoom inside the still box, and the title goes blue. Text-only: the cta wipes in. Boxed: the --bcrd-box-ground-hover ground.',
                ],
                ['focus', 'Everything hover does, plus the two-part ring around the card.'],
                [
                  'pressed',
                  'The title deepens to --bcrd-title-ink-pressed, one step past hover; the zoom holds. The cta steps to its own pressed colour; a boxed ground to --bcrd-box-ground-pressed.',
                ],
                ['reduced motion', 'No zoom at all; keyboard focus keeps its ring.'],
              ].map(([state, note]) => (
                <Layout key={state} rowGap="inline">
                  <strong>{state}</strong>
                  <p>{note}</p>
                </Layout>
              ))}
            </Layout>
          </Cards>
        </Layout>
      </Section>

      {SURFACES.map(({ surface, note }, index) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="block">
            <Layout rowGap="tight">
              {index === 0 ? <h2>13 · Four surfaces</h2> : null}
              <p className={s.specTitle}>surface=&quot;{surface}&quot;</p>
              <p className={s.specNote}>{note}</p>
            </Layout>
            <SurfaceCards covers={surface === 'paper' || surface === 'tint'} />
            <SurfaceSetAndRow covers={surface === 'paper' || surface === 'tint'} />
            <ResolvedTokens surface={surface} />
          </Layout>
        </Section>
      ))}

      <Section surface="ink">
        <Layout rowGap="stack">
          <BandHead title="14 · Nested surfaces">
            The nearest surface resolves every colour below, the cta&rsquo;s three Button steps
            included; no outer palette leaks in. The card&rsquo;s own colour set is eleven
            tokens, every one declared on every surface.
          </BandHead>
          <Section as="div" surface="tint">
            <Layout columns={{ base: 1, lg: [2, 1] }} colGap="gutter" rowGap="block">
              <SurfaceCards covers />
              <ResolvedTokens surface="tint" />
            </Layout>
          </Section>
        </Layout>
      </Section>
      <Section>
        <Layout rowGap="stack">
          <p>The ink panel below is nested back inside paper and must invert in full.</p>
          <Section as="div" surface="ink">
            <Layout columns={{ base: 1, lg: [2, 1] }} colGap="gutter" rowGap="block">
              <SurfaceCards covers={false} />
              <ResolvedTokens surface="ink" />
            </Layout>
          </Section>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="15 · Equal-height challenge">
            The parent&rsquo;s <code>equalRows</code> makes every root and frame fill the row.
            Inspect their computed heights: all four must match despite the copy lengths.
          </BandHead>
          <Cards columns={{ base: 1, xl: 4 }}>
            <BlockCard title="One line" body="Short body." />
            <BlockCard title="A title intended to wrap across two lines" body="Short body." />
            <BlockCard
              title="A deliberately long card title that should occupy about five lines in the four-column track"
              body="Short body."
            />
            <BlockCard
              title="Long body"
              body="This longer paragraph challenges the shared row height with substantially more supporting copy while preserving the same copy group, type and natural wrapping behaviour."
            />
          </Cards>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="16 · Content edge cases">
            Every section 12 case is rendered, or named where the API rejects it.
          </BandHead>

          <Specimen title="Long title/body · unbroken URL">
            <Cards columns={{ base: 1, md: 2 }}>
              <BlockCard
                eyebrow="Product modernisation"
                title="Interaction design for regulated products with several operational owners today."
                body="This long supporting paragraph keeps every part of the content visible while it explains the evidence, constraints, decision owners, handoffs and customer outcome that a service team must align before implementation begins without clamping."
              />
              <BlockCard
                title="Unbroken content"
                body="https://tcules.com/services/product-design/design-systems/a-single-unbroken-token-that-must-wrap-before-it-can-widen-the-page"
              />
            </Cards>
          </Specimen>

          <Specimen
            title="Long copy in the featured row"
            note="The featured card at the CU04 ceilings: its h3 title balances across lines in its half, and the body wraps beside it."
          >
            <BlockCardSet
              items={[
                {
                  id: 'long',
                  eyebrow: 'A long eyebrow that names the client and the practice area',
                  title:
                    'Interaction design for regulated products with several operational owners',
                  body: 'This long supporting paragraph keeps every part of the content visible while it explains the evidence, constraints, decision owners, handoffs and customer outcome that a service team must align before implementation begins.',
                  href: ROUTES.productDesign,
                },
                ...SERVICES.slice(1, 4),
              ]}
            />
          </Specimen>

          <Specimen
            title="Zero items"
            note="BlockCardSet with an empty list renders nothing — no empty ul inside this harness."
          >
            <Box>
              <BlockCardSet items={[]} />
              Caller passed zero items.
            </Box>
          </Specimen>

          <Specimen title="One item · sixteen items">
            <Layout rowGap="stack">
              <BlockCardSet
                items={[
                  {
                    id: 'one',
                    title: 'One item',
                    body: 'It sits in half the row rather than stretching across it.',
                  },
                ]}
              />
              <ManyCards count={16} />
            </Layout>
          </Specimen>

          <Specimen
            title="Blank title, body, eyebrow and href"
            note="Blank title returns null; blank body keeps the heading; blank eyebrow omits the label; blank href remains a static div with no cta. All warn in development."
          >
            <Cards>
              <BlockCard title="   " body="This card must not render." />
              <BlockCard title="Body omitted" body="   " />
              <BlockCard eyebrow="   " title="Eyebrow omitted" body="No blank label line." />
              <BlockCard title="Blank href is inert" body="No anchor and no cta." href="   " />
            </Cards>
          </Specimen>

          <Specimen
            title="Single track through 767 · unsized wrapping parent"
            note="Narrow the viewport through 767. The horizontal card collapses to one track and its rowGap takes over from the column gutter; imageSide describes nothing below that boundary, so a right-side card reads copy-then-image."
          >
            <Layout rowGap="block">
              <div className={s.trackSm}>
                <Cards columns={{ base: 1 }}>
                  <BlockCard
                    eyebrow="Case study"
                    title="Narrow image card"
                    body="Copy wraps without changing the fixed content relationships."
                    media={cover(COVER_FLOW)}
                    href={ROUTES.caseStudies}
                  />
                </Cards>
              </div>
              <Rows>
                <BlockCard
                  orientation="horizontal"
                  imageSide="right"
                  eyebrow="Case study"
                  title="Horizontal collapsing to one track"
                  body="Below md there are no sides, so DOM order decides and the copy comes first."
                  media={cover(COVER_FLOW)}
                  href={ROUTES.caseStudies}
                />
              </Rows>
              <Cluster as="ul" rowGap="block">
                <BlockCard
                  title="First complete line"
                  body="No explicit track sizes this item."
                />
                <BlockCard title="Second complete line" body="It wraps below the first." />
              </Cluster>
            </Layout>
          </Specimen>

          <Specimen
            title="Nested surface · zero-gap adjacent cards"
            note="With no edge to meet, two cards at zero gap run together — which is exactly why the gutter is required. This is a stress harness, not a composition."
          >
            <Section as="div" surface="ink">
              <Cards columns={2} gap={false}>
                <BlockCard title="First object" body="Nothing marks where it ends." />
                <BlockCard title="Second object" body="Nothing marks where it begins." />
              </Cards>
            </Section>
          </Specimen>

          <Specimen
            title="Interactive slot — rejected"
            note="Title, body, eyebrow and ctaLabel are strings and media is a closed record. The public type cannot accept a nested link, Button, control or arbitrary child, and the cta is a span rather than a second anchor."
          >
            <Box>One linked card means exactly one focus stop.</Box>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="17 · Narrow tracks">
            Cover, linked text-only and static cards at Layout&rsquo;s 256px and 192px track
            sizes. Text wraps, the image shrinks and the cta never collides or widens the page.
          </BandHead>
          <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="stack">
            {(
              [
                ['sm · 256px', s.trackSm],
                ['xs · 192px', s.trackXs],
              ] as const
            ).map(([label, className]) => (
              <Specimen key={label} title={label}>
                <div className={className}>
                  <Cards columns={{ base: 1 }}>
                    <BlockCard
                      eyebrow="Case study"
                      title="Cover link"
                      body="Compact linked copy."
                      media={cover(COVER_FLOW)}
                      href={ROUTES.caseStudies}
                    />
                    <BlockCard
                      eyebrow="Service"
                      title="Text link"
                      body="Compact linked copy."
                      href={ROUTES.productDesign}
                    />
                    <BlockCard title="Static" body="Compact text-only copy." />
                  </Cards>
                </div>
              </Specimen>
            ))}
          </Layout>
        </Layout>
      </Section>

      <Section surface="ink">
        <Layout rowGap="stack">
          <BandHead title="18 · Heading map">
            H3 and h4 elements retain the same h4 visual type; only the outline changes. The
            horizontal row steps both to the h3 role.
          </BandHead>
          <Cards>
            <BlockCard titleAs="h3" title="H3 element" body="Directly below a section h2." />
            <BlockCard titleAs="h4" title="H4 element" body="Available below an h3 grouping." />
          </Cards>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="19 · Adjacent boundary">
            A borderless card is separated by distance and nothing else, so the gutter is the
            boundary rather than a decoration on top of one.
          </BandHead>
          <Specimen title="zero gap · stress only">
            <Cards columns={2} gap={false}>
              <BlockCard title="First card" body="Its copy runs into the next card's." />
              <BlockCard title="Second card" body="Nothing separates the two." />
            </Cards>
          </Specimen>
          <Specimen title="gutter · production">
            <Cards columns={2}>
              <BlockCard title="First card" body="Reads as one object." />
              <BlockCard title="Second card" body="Reads as another." />
            </Cards>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="block">
          <h2>20 · What this static page cannot force</h2>
          <p>
            Hold the pointer for pressed, Tab for keyboard focus, and test viewport widths 767,
            1439 and 1440 exactly. Reduced motion drops the cover zoom (the card&rsquo;s own
            stylesheet) and the cta wipe (Button&rsquo;s). None of these has a component prop;
            the absence is part of the contract.
          </p>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="21 · The case-study index (29 Sep)">
            The case-study card at the corpus&rsquo;s extremes: the client as the eyebrow above
            the title, a one-line description (8&ndash;15 words, strapi-changes §13), no cta.
            Titles are the live shortest (37 characters) and longest (87). The whole page is the
            <code>ListingIndex</code> template&rsquo;s specimen (<code>?data=cases</code>).
          </BandHead>
          <Specimen title="6 case studies · featured + three from lg">
            <BlockCardSet items={CASE_INDEX} />
          </Specimen>
          <Specimen
            title="Longest real title in a 326 track"
            note="87 characters at the h4 role: balanced, no cap, no clamp."
          >
            <div className={s.trackMobile}>
              <Cards columns={{ base: 1 }}>
                <BlockCard {...item(CASE_INDEX, 2)} />
              </Cards>
            </div>
          </Specimen>
          <Specimen
            title="The same title at sm in a 326 track"
            note="What the index's peers carry: h5 over body-sm. Five peers under the featured row step down, so the band's h2 stands two rungs clear of every card."
          >
            <div className={s.trackMobile}>
              <Cards columns={{ base: 1 }}>
                <BlockCard {...item(CASE_INDEX, 2)} size="sm" />
              </Cards>
            </div>
          </Specimen>
          <Specimen
            title="No eyebrow"
            note="With neither a client nor a category the eyebrow emits nothing and the title starts the copy."
          >
            <Cards columns={{ base: 1, md: 2, lg: 3 }}>
              <BlockCard {...item(CASE_INDEX, 1)} eyebrow={undefined} />
              <BlockCard {...item(CASE_INDEX, 3)} eyebrow={undefined} />
            </Cards>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <BandHead title="22 · Size steps with the count (visual-direction § 7.2, 5 Oct)">
            The card does not know its count, so it takes its type step as a component size and
            the set passes it. <code>lg</code> is the one featured card (h4 over body-lg, and
            the serif h3 when horizontal); <code>md</code> is two to three cards and every text
            card (h4 over body); <code>sm</code> is four to six across (h5 over body-sm). Card
            titles are sans; the horizontal card at lg is the one serif title (owner, 22 Oct
            2026). Inside every size the copy is one group at <code>text</code> (16): eyebrow,
            title, body.
          </BandHead>
          <Specimen
            title='size="lg" · md · sm, one record'
            note="The same case-study record at each step. lg is shown in its own arrangement, the horizontal row (the serif h3), then vertical in a two-track set (sans h4 over body-lg); md and sm in tracks of the widths their sets give them (392 and 286 at the cap)."
          >
            <Layout rowGap="column">
              <Rows>
                <BlockCard {...item(CASE_STUDIES, 1)} orientation="horizontal" size="lg" />
              </Rows>
              <Cards columns={{ base: 1, md: 2 }}>
                <BlockCard {...item(CASE_STUDIES, 1)} size="lg" />
                <BlockCard {...item(CASE_STUDIES, 2)} size="lg" />
              </Cards>
              <Cards columns={{ base: 1, md: 2, lg: 3 }}>
                <BlockCard {...item(CASE_STUDIES, 1)} size="md" tracks={3} />
                <BlockCard {...item(CASE_STUDIES, 2)} size="md" tracks={3} />
                <BlockCard {...item(CASE_STUDIES, 3)} size="md" tracks={3} />
              </Cards>
              <Cards columns={{ base: 1, md: 2, xl: 4 }}>
                <BlockCard {...item(CASE_STUDIES, 1)} size="sm" />
                <BlockCard {...item(CASE_STUDIES, 2)} size="sm" />
                <BlockCard {...item(CASE_STUDIES, 3)} size="sm" />
                <BlockCard {...item(CASE_STUDIES, 4)} size="sm" />
              </Cards>
            </Layout>
          </Specimen>
          <Specimen
            title="Text-only at each size"
            note="The same steps without media. A text card's title is its only object, so a text-only set stays md at any count; sm here is the step proven, not a set's choice."
          >
            <Layout rowGap="column">
              <Rows>
                <BlockCard {...item(SERVICES, 0)} orientation="horizontal" size="lg" />
              </Rows>
              <Cards columns={{ base: 1, md: 2, lg: 3 }}>
                <BlockCard {...item(SERVICES, 1)} size="md" />
                <BlockCard {...item(SERVICES, 2)} size="md" />
                <BlockCard {...item(SERVICES, 3)} size="md" />
              </Cards>
              <Cards columns={{ base: 1, md: 2, xl: 4 }}>
                <BlockCard {...item(SERVICES, 1)} size="sm" />
                <BlockCard {...item(SERVICES, 2)} size="sm" />
                <BlockCard {...item(SERVICES, 3)} size="sm" />
                <BlockCard {...item(SERVICES, 4)} size="sm" />
              </Cards>
            </Layout>
          </Specimen>
          <Specimen
            title="BlockCardSet picks the step · 3, 4, 5 and 6 items"
            note={`3 items: md. 4: lg featured over three md peers (three is the two-to-three shape). 5: lg over four sm peers. 6: lg over five sm peers. From ${SMALL_FROM} peers the step is sm — except a text-only set, which stays md.`}
          >
            <Layout rowGap="section">
              <BlockCardSet items={CASE_STUDIES.slice(0, 3)} />
              <BlockCardSet items={CASE_STUDIES.slice(0, 4)} />
              <BlockCardSet items={CASE_STUDIES} />
              <BlockCardSet items={CASE_INDEX} />
            </Layout>
          </Specimen>
          <Specimen
            title="A linked icon set kept stacked on a phone · scroll never"
            note="A router shows every route at once: below 768 the set stacks instead of scrolling, and every icon card still stacks glyph, title, body (owner, 9 Oct 2026)."
          >
            <BlockCardSet
              lead="none"
              across={2}
              scroll="never"
              items={SHAPE_ICONS.map((card) => ({ ...card, href: ROUTES.services }))}
            />
          </Specimen>
          <Specimen
            title='linkScope="cta" · the static frame'
            note="A card whose body carries a link of its own cannot be one whole-card anchor (an anchor inside an anchor). With linkScope cta the frame stays a div and the cta Button is the card's only anchor, and the set takes it for every card so the six answer the pointer alike (page-mapping G3b). The first card's body links to AI engineering; the pointer rests on the cta, never the card."
          >
            <BlockCardSet
              lead="none"
              across={3}
              frame="box"
              linkScope="cta"
              scroll="never"
              items={SHAPE_ICONS.map((card, index) => ({
                id: card.id,
                icon: card.icon,
                title: card.title,
                bodyHtml:
                  index === 0
                    ? [
                        'Frontend, backend, integrations, <a href="/services/software-development/ai-product-engineering">AI engineering</a>, testing and release.',
                      ]
                    : [card.body ?? ''],
                href: ROUTES.services,
                ctaLabel: 'Explore services',
              }))}
            />
          </Specimen>
          <Specimen
            title="A text-only set of five · stays md"
            note="Four text peers, h4 still: the text card row of § 7.2."
          >
            <BlockCardSet items={SERVICES} />
          </Specimen>
        </Layout>
      </Section>
      <Section>
        <Layout rowGap="stack">
          <BandHead title="23 · One crop, and the phone pair (home rounds 1 and 3)">
            The set no longer states a crop: every cover is 16:9 (home round 3, 11 Oct 2026), so
            a linked pair of contained drawings is 16:9 too. <code>phone=&quot;pair&quot;</code>
            : two across below 768, never a scroll row, for a set of short covered cards whose
            title is their whole content — eight sectors stacked ran ~2900 tall at 390 and a
            scroll row hid seven of them.
          </BandHead>
          <Specimen
            title={'Linked covered pair · size="lg"'}
            note="Two drawn situations two up, contained drawings in the 16:9 box, the service named on each cta."
          >
            <BlockCardSet
              lead="none"
              across={2}
              size="lg"
              cue="cta"
              scroll="never"
              items={SITUATIONS.slice(0, 2).map((card, index) => ({
                ...card,
                href: ROUTES.services,
                ctaLabel: index === 0 ? 'Product Design' : 'Design Systems',
                media: {
                  type: 'image',
                  image: {
                    src: `/illustrations/services/${index === 0 ? 'product-design' : 'design-systems'}.paper.svg`,
                    width: index === 0 ? 962 : 681,
                    height: index === 0 ? 714 : 569,
                    alt: '',
                    kind: 'illustration',
                  },
                },
              }))}
            />
          </Specimen>
          <Specimen
            title={'Eight covered cards · across={4} · phone="pair"'}
            note="Four across from 1024, two across at every width below it; titles only, title-cued."
          >
            <BlockCardSet
              lead="none"
              across={4}
              cue="title"
              phone="pair"
              items={Array.from({ length: 8 }, (_, index) => ({
                id: `sector-${index}`,
                title:
                  [
                    'B2B SaaS',
                    'AI products',
                    'Data products',
                    'Commerce',
                    'Marketplaces',
                    'FinTech',
                    'HealthTech',
                    'MarTech',
                  ][index] ?? '',
                href: ROUTES.services,
                media: {
                  type: 'image',
                  image:
                    [COVER_FLOW, COVER_REVIEWS, COVER_NODE, COVER_SEAM][index % 4] ??
                    COVER_FLOW,
                },
              }))}
            />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <BandHead title="24 · The panel, the date and the topic tag (the insights finder, 28–29 Oct)">
            A piece with no picture stands as a panel (<code>frame=&quot;panel&quot;</code>):
            the paper plate in the cover&rsquo;s place, its hairline the box, its format&rsquo;s
            glyph and label at its head, the title and standfirst pinned to its foot, so a row
            of mixed pieces ends level. The date sits at the label line&rsquo;s end (
            <code>aside</code>) and the topic is a tag under the copy (<code>tag</code>), on a
            pictured card too. A horizontal lead carries no tag.
          </BandHead>
          <Specimen
            title="Three tracks · a pictured card beside two panels"
            note="size='sm', cue='title'. Left: the cover, the label with the date at its end, the title, the tag. Middle: a panel with a long title. Right: a panel with a standfirst (clamped to three lines). Every card's tag follows its own copy, a block under it."
          >
            <Cards columns={{ base: 1, md: 3 }}>
              <BlockCard
                size="sm"
                tracks={3}
                cue="title"
                eyebrow="Article"
                aside="28 Oct 2026"
                tag="Design Systems"
                title="Design systems for SaaS: what to build, in what order"
                media={cover(COVER_SEAM)}
                href={ROUTES.insights}
              />
              <BlockCard
                size="sm"
                tracks={3}
                cue="title"
                frame="panel"
                icon="document-text"
                eyebrow="Article"
                aside="27 Oct 2026"
                tag="Design Systems"
                title="Best design system agencies and consultants: an honest shortlist by what you need"
                href={ROUTES.insights}
              />
              <BlockCard
                size="sm"
                tracks={3}
                cue="title"
                frame="panel"
                icon="notebook"
                eyebrow="Guide"
                aside="6 Aug 2026"
                tag="Product Design"
                title="How do you audit a design system?"
                body="A checklist for the first week: what to inventory, who to ask, and which gaps to name before anyone redesigns a single component, so the audit ends in decisions rather than a slide deck."
                href={ROUTES.insights}
              />
            </Cards>
          </Specimen>
          <Specimen
            title="The lead · horizontal, no tag"
            note="orientation='horizontal', split='grid', cue='cta'. The hub's lead takes no topic tag (owner, 29 Oct 2026: on the horizontal card 'the tag feels like an impediment'); the caller leaves tag off."
          >
            <Rows>
              <BlockCard
                orientation="horizontal"
                size="lg"
                tracks={2}
                split="grid"
                cue="cta"
                ctaLabel="Read more"
                title="Design Thinking vs CX vs UX: Explained"
                media={cover(COVER_FLOW)}
                href={ROUTES.insights}
              />
            </Rows>
          </Specimen>
        </Layout>
      </Section>
    </>
  );
}
