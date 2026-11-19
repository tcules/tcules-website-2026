import type { ReactNode } from 'react';

import {
  BrandMark,
  Icon,
  RatingBadge,
  Layout,
  Media,
  Prose,
  Section,
  Sketch,
  Texture,
  TextureShape,
  type IconName,
  type SectionSurface,
} from '@/components';
import {
  Accordion,
  BlockCard,
  ContentSection,
  ContentSectionText,
  CtaRow,
  DataTable,
  ListCard,
  Proof,
  type DataTableProps,
  type ProofFigure,
} from '@/patterns';
import { HEAD_TRACK } from '@/lib/image-sizes';
import { getKitPhoto, type PhotoId } from '@/lib/photos';
import { ROUTES } from '@/lib/routes';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';

/* ── Content ─────────────────────────────────────────────────────────────────────────────────
   Realistic copy at the lengths the content actually reaches, plus the stress ceilings the audit
   names (docs/component-audit.md §1, "Heading wrap"): an H2 of ten words, a lead of forty-five,
   and one unbroken token. Every band that is not a stress row uses the ORDINARY copy, so the
   stress rows read as stress by comparison. */

const HEADING = 'The screen is often where a deeper product problem becomes visible.';
const LEAD = 'What the interface may be telling you, before anyone opens a ticket about it.';

/* Ten words, eighty characters, and the longest words the corpus uses in a heading. */
const HEADING_LONG =
  'Modernisation programmes stall when nobody owns the operational product decisions';

/* Forty-five words, one sentence with two internal pauses — the longest lead a section carries. */
const LEAD_LONG =
  'Most modernisation work is scoped as a rebuild of screens, but the decisions that slow a ' +
  'team down live between those screens: who approves a change, which record is authoritative, ' +
  'and what happens when two operators disagree about the same customer at the same time.';

/* The KIT's copy ceilings (visual-direction § 1.5), as distinct from the CMS stress above. The
   stress copy proves the band does not break; it is past every head's word budget, so a row carrying
   it is a deliberate fold failure and says so (`FoldExempt`). A row that must FIT pushes copy to these
   instead: h2 ≤ 6 words in a 381 head track (H-beside-aside), a lead ≤ 18 words (every head form but
   H-beside-actions). HEADING_LONG is already the H-full ceiling (10 words). */
const HEADING_CEILING_TRACK = 'Modernisation stalls where ownership is unclear';
const LEAD_CEILING =
  'Most delays trace back to a decision nobody owns: which record wins, who approves the change, and when.';

/* No space, no hyphen: the only break opportunity is the one overflow-wrap makes. At 43px in a
   one-third track at 1024 this is roughly twice the track's width. */
const TOKEN_HEADING = 'ProductModernisationAssessmentWorkbench';
const TOKEN_LEAD =
  'https://tcules.com/services/product-design/design-systems/a-single-unbroken-token-that-must-wrap-before-it-can-widen-the-page';

const BODY_HTML =
  '<p>A product decision is only settled once it survives the workflow it lives in. ' +
  'That is what this section argues, at whatever length the argument needs.</p>' +
  '<p>A second paragraph, so the seam inside Prose can be read against the seam between blocks.</p>';

const BODY_SHORT_HTML = '<p>One sentence is the whole of the body here.</p>';

const BODY_LONG_HTML =
  '<p>The first thing we look at is not the interface. It is the sequence of decisions the ' +
  'interface is asking people to make, in the order it asks them, and who is allowed to make ' +
  'each one. Most of the friction a team reports lives in that sequence rather than on any single ' +
  'screen.</p>' +
  '<p>The second is the record. Two teams working from two versions of the same customer will ' +
  'produce two correct answers that disagree, and no amount of visual polish settles which one ' +
  'ships. Settling it is product work, and it has to happen before the screens are drawn.</p>' +
  '<h3>What that changes</h3>' +
  '<p>It changes what gets designed first. The model comes first, then the behaviour, and the ' +
  'surface last — which is the reverse of how most briefs arrive, and the reason most briefs ' +
  'arrive twice.</p>';

const CARDS = [
  { title: 'A confusing action', body: 'The label is fine. The authority behind it is not.' },
  { title: 'A slow workflow', body: 'Every step is fast. The sequence is the wrong sequence.' },
  { title: 'A crowded dashboard', body: 'Nothing here is wrong, and nothing here is decided.' },
];

const STEPS = [
  {
    title: 'Read the real work',
    body: 'Who does what, in which order, under whose authority.',
  },
  { title: 'Settle the product model', body: 'Which records exist and which rules bind them.' },
  { title: 'Design the behaviour', body: 'What the interface does, not what it looks like.' },
];

/* A four-column table: wide enough that a 75ch cap would visibly crush it, which is the failure the
   body measure must NOT reintroduce. It is a sibling of the text, so it keeps the full track. */
const cell = (html: string) => `<p>${html}</p>`;
const TABLE: DataTableProps = {
  caption: 'Where each design-system representation lives',
  keyColumn: { heading: 'Representation' },
  columns: [{ heading: 'Source of truth' }, { heading: 'Owner' }, { heading: 'Drift signal' }],
  rows: [
    {
      header: 'Design tokens',
      cellsHtml: [
        cell('The token layer in the repository'),
        cell('Design engineering'),
        cell('A value in Figma with no token behind it'),
      ],
    },
    {
      header: 'Components',
      cellsHtml: [
        cell('The coded component and its specimen'),
        cell('Product engineering'),
        cell('A variant that exists in one tool only'),
      ],
    },
    {
      header: 'Guidance',
      cellsHtml: [
        cell('The documentation site'),
        cell('Design operations'),
        cell('A rule nobody can find the reason for'),
      ],
    },
  ],
};

const SURFACES: readonly SectionSurface[] = ['paper', 'tint', 'ink', 'blue'];

/* The two arrangements the comparison rows show side by side. `media` has a section of its own
   (14), because what goes in its body differs. */
const PAIR = ['stacked', 'beside'] as const;
type Pair = (typeof PAIR)[number];

/* The body each of the pair takes in a comparison row. A card set reads ACROSS, so it never goes in
   a beside body (1 Oct 2026, owner; visual-direction § 1.4 rule 5): beside takes rows. */
const pairBody = (arrangement: Pair) => (arrangement === 'beside' ? <Steps /> : <Cards />);

/* Photographs for the aside, media and pair rows (src/lib/photos.ts). Atmosphere photos: alt="". */
const photo = (id: PhotoId) => getKitPhoto(id);

const ICON_CARDS: readonly { title: string; body: string; icon: IconName }[] = [
  {
    title: 'A product model',
    body: 'The records, their owners and the rules that bind them.',
    icon: 'database',
  },
  {
    title: 'Flows that hold',
    body: 'Every path through the work, including the unhappy ones.',
    icon: 'layers',
  },
  {
    title: 'A component set',
    body: 'Built once in code, documented where the team works.',
    icon: 'widget',
  },
  {
    title: 'A handover plan',
    body: 'What your team runs after us, written down and rehearsed.',
    icon: 'checklist',
  },
];

const TILES = [
  {
    title: 'Workshops, not decks',
    body: 'Decisions get made in the room with the people who own them.',
  },
  {
    title: 'One shared board',
    body: 'Every open question lives in one place the whole team can see.',
  },
  {
    title: 'Weekly working reviews',
    body: 'Real screens against real tasks, every week, from week one.',
  },
  {
    title: 'A written trail',
    body: 'Each decision recorded with the reason, so it is not reopened.',
  },
];

const PAIR_CARDS = [
  {
    title: 'Rebuilding a claims workflow around one record',
    body: 'Two teams, one customer, and the rule that settled which answer ships.',
    image: 'pair-laptop-notebook' as PhotoId,
  },
  {
    title: 'A design system the engineers asked for',
    body: 'Tokens and components the product team adopted without being told to.',
    image: 'whiteboard-pair-laptop' as PhotoId,
  },
];

const FAQ = [
  {
    question: 'Do you work with an in-house design team?',
    answerHtml: '<p>Most of the time, yes. We join the team rather than replace it.</p>',
  },
  {
    question: 'How long is a typical engagement?',
    answerHtml: '<p>Eight to sixteen weeks for a product, longer for a system.</p>',
  },
  {
    question: 'Can we start with an audit?',
    answerHtml: '<p>Yes. Every audit ends in a written plan you can run without us.</p>',
  },
  {
    question: 'Who owns what we make together?',
    answerHtml: '<p>You do, from the first commit. Nothing is held back as a licence.</p>',
  },
];

const SEE_WORK = { label: 'See the work', href: ROUTES.caseStudies };
const HOW = { label: 'How we work', href: ROUTES.howWeWork };
const START = { label: 'Start a project', href: ROUTES.contact };

/* ── Blocks ──────────────────────────────────────────────────────────────────────────────────
   Real patterns, composed exactly as a route composes them. Each owns its own set; the band only
   owns the 48 beat between blocks. */

function Cards() {
  return (
    <Layout as="ul" columns={{ base: 1, md: 3 }} colGap="gutter" rowGap="column" equalRows>
      {CARDS.map((card) => (
        <BlockCard key={card.title} title={card.title} body={card.body} />
      ))}
    </Layout>
  );
}

/** Four icon cards, two across — the beside body C-icon takes (§ 1.4 rule 5). Icons are ink (§ 4.3). */
function IconCards() {
  return (
    <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="column">
      {ICON_CARDS.map((card) => (
        <ListCard
          key={card.title}
          form="tile"
          titleAs="h3"
          title={card.title}
          body={card.body}
          marker={{ type: 'icon', name: card.icon }}
        />
      ))}
    </Layout>
  );
}

/** B tiles: up to four, two across at gutter, rows at column (§ 1.2) — or two with a CtaRow. */
function Tiles({ count = 4 }: { count?: 2 | 4 }) {
  return (
    <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="column">
      {TILES.slice(0, count).map((tile) => (
        <ListCard
          key={tile.title}
          form="tile"
          titleAs="h3"
          title={tile.title}
          body={tile.body}
        />
      ))}
    </Layout>
  );
}

/** Two pair cards with photographs — the beside body C-pair takes (§ 1.4 rule 5). */
function PairCards() {
  return (
    <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="column">
      {PAIR_CARDS.map((card) => (
        <BlockCard
          key={card.title}
          title={card.title}
          body={card.body}
          href={ROUTES.caseStudies}
          tracks={2}
          media={{ type: 'image', image: photo(card.image) }}
        />
      ))}
    </Layout>
  );
}

/** A head-track aside: a 3:2 photograph at the head track's sizes (§ 1.4, 381 × 254). */
function AsidePhoto({ id }: { id: PhotoId }) {
  return <Media image={photo(id)} ratio="3/2" sizes={HEAD_TRACK} />;
}

/* The aside's other form (§ 3.3: "D always has an aside: a photograph or one --text-stat-lg
   figure"). One Proof figure — the kit's stat-lg voice, its checked line said once. § 1.4 budgets it
   at stat-lg 54, 16, body-sm on 2 lines: 114. The stress figure carries the 12-word label ceiling
   (§ 1.5) and the widest value shape the corpus uses. */
const STAT: ProofFigure = {
  value: '90+',
  label: 'completed product and design-system engagements',
};
const STAT_LONG: ProofFigure = {
  value: '1,200+',
  label: 'operator hours a week returned to claims teams after the workflow rebuild',
};

/** A head-track aside: one stat-lg figure (§ 3.3, the D band's other aside). */
function AsideStat({ figure }: { figure: ProofFigure }) {
  return <Proof figures={[figure]} />;
}

function Steps() {
  return (
    <Layout as="ol" rowGap="none">
      {STEPS.map((step, index) => (
        <ListCard
          key={step.title}
          title={step.title}
          body={step.body}
          titleAs="h3"
          marker={{ type: 'number', value: index + 1 }}
        />
      ))}
    </Layout>
  );
}

/**
 * Marks a band that runs past the 1470 × 830 fold ON PURPOSE (visual-direction § 1.3: "a specimen
 * block that shows a deliberate failure carries data-fold-exempt"). Every use carries CMS stress copy
 * past § 1.5's word budget: it proves the band survives the copy, not that the copy is a page shape.
 * A plain block wrapper — it adds no box, no seam and no ground, so the band inside sits edge to edge
 * with its neighbours exactly as it would unwrapped.
 */
function FoldExempt({ reason, children }: { reason: string; children: ReactNode }) {
  return <div data-fold-exempt={reason}>{children}</div>;
}

const OVER_BUDGET = 'CMS stress copy (10-word h2, 45-word lead) past the § 1.5 head budget';

/**
 * A labelling band between groups of specimens. The specimens on this page are BANDS, so they
 * cannot sit inside a Specimen block without being nested inside another Section's column — which
 * would move their content column and make every measurement on the page wrong. The label is a
 * band of its own instead, tight, so the specimen bands beneath it sit edge to edge exactly as
 * they do on a route.
 */
function Label({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Section>
      <Layout rowGap="block">
        <h2>{title}</h2>
        <p className={s.specNote}>{children}</p>
      </Layout>
    </Section>
  );
}

/**
 * ContentSection — the proving ground.
 *
 * Every specimen band is a live ContentSection, and therefore a live Section: the bands sit edge
 * to edge exactly as they do on a route, which is the only way to read the 96 + 96 seam between two
 * of them and the only way `beside` can be judged against a real 1240 column.
 *
 * The page is ordered so the one comparison that matters comes first — the same content in both
 * arrangements — then the body measure (text capped at 75ch, a table and a card grid still spanning
 * the track), and everything after it is coverage: both arrangements on all four surfaces with
 * identical markup, the stress ceilings, a short and a long body beside a head, every absent slot
 * and the two degradations `beside` makes, the densities, nested surfaces, a 390 viewport, and two
 * adjacent bands.
 *
 * `beside` is a breakpoint arrangement (1024 up), so it cannot be forced inside a narrow frame on a
 * wide window. The 390 capture of this page is the proof that every `beside` band collapses to
 * `stacked`; section 9's frame shows the stacked band at 390 for comparison inside a wide window.
 */
/** 14b's band-level texture: a soft glow in one bottom corner, inside the padding. */
function CornerTexture({ side }: { side: 'start' | 'end' }) {
  const across = side === 'end' ? { right: '-12%' as const } : { left: '-12%' as const };
  return (
    <Texture>
      <TextureShape kind="ellipse" bottom={20} {...across} width="48%" height={56} blur={16} />
    </Texture>
  );
}

export default function ContentSectionSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>ContentSection</h1>
          <p className={s.specNote}>
            One CMS section as one band: an optional eyebrow, heading and lead, the head&rsquo;s
            own actions or aside, then the blocks and a foot. The gap ladder is the reason it
            exists — 24 eyebrow to heading to lead, 48 lead to actions, head to aside, head to
            body, block to block and body to footer, 96 across every split. Three arrangements:{' '}
            <code>stacked</code> (the default), <code>beside</code> (1 : 2 from 1024, the head
            static, an aside or actions in its track) and <code>media</code> (a 4:5 photograph
            in 5 of [5, 7] beside the copy, 4:3 above it below 1024). A text-only head is never
            split left/right: <code>split-head</code> (the H-row) was retired on 7 Oct 2026. One
            alignment axis: <code>align=&quot;center&quot;</code> centres a stacked head and its
            body as a block. Below 1024 every arrangement is one column in DOM order.
          </p>
        </Layout>
      </Section>

      {/* ── 1 ──────────────────────────────────────────────────────────────────────────────── */}
      <Label title="1 · The three arrangements, same head">
        One head, three arrangements, each with the body it is for. Stacked puts the head over a
        card set. Beside puts it in the leading third, static, over rows — a set that reads
        across never goes beside (§ 1.4 rule 5). Media sets the copy beside a 4:5 photograph,
        centred on it because the copy does not end in an action. Resize below 1024 and all
        three are one column.
      </Label>
      {PAIR.map((arrangement) => (
        <ContentSection
          key={arrangement}
          arrangement={arrangement}
          eyebrow={`arrangement="${arrangement}"`}
          heading={HEADING}
          headingId={`csec-compare-${arrangement}`}
          lead={LEAD}
        >
          <ContentSectionText>
            <Prose html={BODY_HTML} />
          </ContentSectionText>
          {pairBody(arrangement)}
        </ContentSection>
      ))}
      <ContentSection
        arrangement="media"
        media={{ head: 'lg', image: photo('studio-sticky-board-ux') }}
        eyebrow='arrangement="media"'
        heading="How a week with us actually runs"
        headingId="csec-compare-media"
        lead={LEAD}
      >
        <Tiles />
      </ContentSection>

      {/* ── 2 ──────────────────────────────────────────────────────────────────────────────── */}
      <Label title="2 · Text at the body measure, every other block at the track">
        Prose has no measure — the caller owns the reading column — and this band is the caller.
        A rich-text block wrapped in ContentSectionText stops at --measure-body, 75ch: 734px at
        1440, which is about 100 characters of this face a line (a ch is the width of a zero,
        wider than the average letter). It caps in both arrangements: stacked against the 1240
        column, beside against the 763 two-thirds track. The table and (stacked) the card grid
        are siblings of the text, not children, so they still run the whole track; beside
        carries no card set. At 1024 the beside track is 576, narrower than 75ch, and the track
        wins — the cap is a ceiling, never a width.
      </Label>
      {PAIR.map((arrangement) => (
        <ContentSection
          key={arrangement}
          arrangement={arrangement}
          eyebrow={`Measure · ${arrangement}`}
          heading="The model comes before the screens"
          headingId={`csec-measure-${arrangement}`}
          lead={LEAD}
        >
          <ContentSectionText>
            <Prose html={BODY_LONG_HTML} />
          </ContentSectionText>
          <DataTable {...TABLE} />
          {arrangement === 'stacked' ? <Cards /> : null}
        </ContentSection>
      ))}

      {/* ── 3 ──────────────────────────────────────────────────────────────────────────────── */}
      <Label title="3 · Four surfaces × two arrangements, identical markup">
        Eight bands, one markup, the eyebrow naming the cell. Every ink is restated per surface
        in content-section.css: heading, lead and eyebrow each hold their contrast floor on all
        four grounds. The arrangement moves no colour — it is geometry only, so no token changes
        between a stacked band and a beside band on the same ground. Blue follows ink here only
        because this is a matrix; on a route the two are never adjacent.
      </Label>
      {SURFACES.flatMap((surface) =>
        PAIR.map((arrangement) => (
          <ContentSection
            key={`${surface}-${arrangement}`}
            surface={surface}
            arrangement={arrangement}
            eyebrow={`${surface} · ${arrangement}`}
            heading="Every ink is restated per surface"
            headingId={`csec-surface-${surface}-${arrangement}`}
            lead="Heading, lead and eyebrow each hold their contrast floor on all four grounds."
          >
            <ContentSectionText>
              <Prose html={BODY_HTML} />
            </ContentSectionText>
            <Steps />
          </ContentSection>
        )),
      )}

      {/* ── 4 ──────────────────────────────────────────────────────────────────────────────── */}
      <Label title="4 · The longest realistic heading and lead">
        A ten-word H2 of eighty characters and a forty-five-word lead. Stacked, the heading
        breaks at the title measure (--measure-title, 32ch: 816px at 1440) and balances; beside,
        the one-third track (381) is narrower than that measure, so the track sets the line and
        the heading runs to more lines — the head column is allowed to be taller than a short
        body, and section 6 shows what that looks like.
      </Label>
      {PAIR.map((arrangement) => (
        <FoldExempt key={arrangement} reason={OVER_BUDGET}>
          <ContentSection
            arrangement={arrangement}
            eyebrow={`Long copy · ${arrangement}`}
            heading={HEADING_LONG}
            headingId={`csec-long-${arrangement}`}
            lead={LEAD_LONG}
          >
            <ContentSectionText>
              <Prose html={BODY_HTML} />
            </ContentSectionText>
            {pairBody(arrangement)}
          </ContentSection>
        </FoldExempt>
      ))}

      {/* ── 5 ──────────────────────────────────────────────────────────────────────────────── */}
      <Label title="5 · One unbroken token">
        A heading and a lead with no break opportunity. The tracks are minmax(0, fr), so neither
        can widen its column, and the base element rule breaks the word rather than the page.
        The 390 capture of this page is the check that nothing scrolls sideways.
      </Label>
      {PAIR.map((arrangement) => (
        <ContentSection
          key={arrangement}
          surface="tint"
          arrangement={arrangement}
          eyebrow={`Unbroken · ${arrangement}`}
          heading={TOKEN_HEADING}
          headingId={`csec-token-${arrangement}`}
          lead={TOKEN_LEAD}
        >
          <ContentSectionText>
            <Prose html={BODY_SHORT_HTML} />
          </ContentSectionText>
        </ContentSection>
      ))}

      {/* ── 6 ──────────────────────────────────────────────────────────────────────────────── */}
      <Label title="6 · Beside, with a short and a long body">
        The head is static and top-aligned, so with a one-sentence body the head is the taller
        column and the band ends under the head; with a long body the head sits at the top of a
        column that is mostly air. Neither is corrected — a sticking head is ruling O2&rsquo;s
        rejected option, and stretching the head would put the lead at the band&rsquo;s foot.
        The long body mixes prose, icon cards two across and rows — what a beside body may hold
        (§ 1.4 rule 5); never a three-up set.
      </Label>
      <ContentSection
        arrangement="beside"
        eyebrow="Short body"
        heading={HEADING}
        headingId="csec-beside-short"
        lead={LEAD}
      >
        <ContentSectionText>
          <Prose html={BODY_SHORT_HTML} />
        </ContentSectionText>
      </ContentSection>
      <ContentSection
        surface="tint"
        arrangement="beside"
        eyebrow="Long body"
        heading="The model comes before the screens"
        headingId="csec-beside-long"
        lead="Three blocks of different shape in the wide track, the head static beside them."
      >
        <ContentSectionText>
          <Prose html={BODY_LONG_HTML} />
        </ContentSectionText>
        <IconCards />
        <Steps />
      </ContentSection>

      {/* ── 7 ──────────────────────────────────────────────────────────────────────────────── */}
      <Label title="7 · Absent slots, and how beside degrades">
        Each head slot renders no element and no seam when absent — an empty string counts as
        absent. Without an eyebrow the heading is the head&rsquo;s first row; without a lead the
        eyebrow and heading are the whole head; a lead alone is a valid head. Beside needs both
        halves, a head and BLOCKS: with no head the blocks take the full column, and with no
        blocks the head does — both are the stacked band exactly, because an empty third or an
        empty two-thirds is a hole. A degraded band has no head track, so an aside is dropped
        rather than set full column (a 3:2 photo at 1240 is ~827 tall and would be upscaled from
        the 381 file). An empty children array counts as no blocks, so no 48 seam hangs under
        the head. These are degrade cases, not page shapes.
      </Label>
      <ContentSection
        arrangement="beside"
        heading="No eyebrow — heading and lead, beside"
        headingId="csec-absent-eyebrow"
        lead={LEAD}
      >
        <Steps />
      </ContentSection>
      <ContentSection
        surface="tint"
        arrangement="beside"
        eyebrow="No lead"
        heading="Eyebrow and heading only, beside"
        headingId="csec-absent-lead"
      >
        <ContentSectionText>
          <Prose html={BODY_HTML} />
        </ContentSectionText>
      </ContentSection>
      <ContentSection
        arrangement="beside"
        heading="Heading only — no eyebrow, no lead"
        headingId="csec-heading-only"
      >
        <Steps />
      </ContentSection>
      <ContentSection
        surface="tint"
        arrangement="beside"
        eyebrow=""
        heading=""
        lead="A lead with no heading: the band is an unlabelled div, and the lead is the whole head."
      >
        <ContentSectionText>
          <Prose html={BODY_HTML} />
        </ContentSectionText>
      </ContentSection>
      <ContentSection arrangement="beside">
        <ContentSectionText>
          <Prose
            html={
              '<p><strong>No head, beside.</strong> The blocks take the full column: nothing is ' +
              'drawn in a leading third, and the band is a div with no accessible name.</p>'
            }
          />
        </ContentSectionText>
        <Steps />
      </ContentSection>
      <ContentSection
        surface="tint"
        arrangement="beside"
        eyebrow="No blocks, beside"
        heading="A heading with nothing under it takes the full column"
        headingId="csec-absent-children"
        lead="The children prop is omitted. The head renders as the stacked head, measures intact."
      />
      <ContentSection
        arrangement="beside"
        eyebrow="Aside, no blocks, beside — degrades, aside dropped"
        heading="A head-track photo with no track to sit in"
        headingId="csec-absent-aside"
        lead="An aside is passed and no children: the band is stacked and the photograph is not rendered."
        aside={<AsidePhoto id="moodboard-wall-desk" />}
      />
      <ContentSection
        arrangement="stacked"
        eyebrow="Empty children array, stacked"
        heading="Zero blocks mapped leaves no seam"
        headingId="csec-empty-array"
        lead="A CMS section whose block list maps to [] renders no body row beneath this lead."
      >
        {[]}
      </ContentSection>

      {/* ── 8 ──────────────────────────────────────────────────────────────────────────────── */}
      <Label title="8 · Density">
        Vertical air passes straight through to Section. It is independent of arrangement: a
        tight band beside and an open band beside keep the same 96 between their halves.
      </Label>
      <ContentSection
        arrangement="beside"
        heading="One block, tight"
        headingId="csec-density-tight"
        lead="A band holding a paragraph does not want the air a five-card grid wants."
      >
        <ContentSectionText>
          <Prose html={BODY_HTML} />
        </ContentSectionText>
      </ContentSection>
      <ContentSection
        surface="tint"
        arrangement="beside"
        heading="One block, open"
        headingId="csec-density-open"
        lead="The other direction, for a band that carries the page's turn."
      >
        <ContentSectionText>
          <Prose html={BODY_HTML} />
        </ContentSectionText>
      </ContentSection>

      {/* ── 9 ──────────────────────────────────────────────────────────────────────────────── */}
      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>9 · Nested surfaces, any block, and a 390 viewport</h2>
            <p className={s.specNote}>
              A band inside another band is not a route composition; it is here to prove that
              every ink resolves from the NEAREST surface. The 390 frame is the phone viewport,
              so the band&rsquo;s own gutter produces the 326 column.
            </p>
          </Layout>
          <Specimen
            title="tint nested in ink · beside"
            note="The case that once rendered at 1.13:1. Heading neutral-900, lead neutral-700, eyebrow neutral-700: tint's own block, nothing from ink."
          >
            <Section as="div" surface="ink">
              <ContentSection
                surface="tint"
                arrangement="beside"
                eyebrow="Tint in ink"
                heading={HEADING}
                headingId="csec-nested-tint"
                lead={LEAD}
              >
                <ContentSectionText>
                  <Prose html={BODY_HTML} />
                </ContentSectionText>
              </ContentSection>
            </Section>
          </Specimen>
          <Specimen
            title="ink nested in paper · stacked"
            note="Heading white, lead neutral-300, eyebrow neutral-400 — inverts in full."
          >
            <ContentSection
              surface="ink"
              eyebrow="Ink in paper"
              heading={HEADING}
              headingId="csec-nested-ink"
              lead={LEAD}
            >
              <ContentSectionText>
                <Prose html={BODY_HTML} />
              </ContentSectionText>
            </ContentSection>
          </Specimen>
          <Specimen
            title="Proof in the body · blue · beside"
            note="Any block goes in the body slot; the band never enumerates what may. Blue is the pivot ground — one appearance per page, and never adjacent to an ink band."
          >
            <ContentSection
              surface="blue"
              arrangement="beside"
              eyebrow="On blue"
              heading="The pivot ground"
              headingId="csec-proof-blue"
              lead="One appearance per page, and never adjacent to an ink band."
            >
              <Proof
                arrangement="compact"
                quote={{
                  quoteHtml: '<p>The workflow between our teams was seamless.</p>',
                  name: 'A client',
                  role: 'Head of Product',
                  company: 'Tcules',
                }}
              />
            </ContentSection>
          </Specimen>
          <Specimen
            title="390 viewport · stacked · longest copy"
            note="What every beside band on this page becomes below 1024. A frame cannot fire a media query, so inside it the type stays at desktop scale and only Prose goes in the body: a ListCard would render its split row and a card set its three tracks. The 390 capture of the whole page is the real phone check, beside included."
          >
            <div className={s.viewportMobile}>
              <ContentSection
                eyebrow="390 · stacked"
                heading={HEADING_LONG}
                headingId="csec-narrow"
                lead={LEAD_LONG}
              >
                <ContentSectionText>
                  <Prose html={BODY_HTML} />
                </ContentSectionText>
              </ContentSection>
            </div>
          </Specimen>
        </Layout>
      </Section>

      {/* ── 10 ─────────────────────────────────────────────────────────────────────────────── */}
      <Label title="10 · Two adjacent bands, same ground">
        Paper after paper, beside then stacked — the arrangement changing between two bands is
        what a long page uses instead of changing the ground. The seam between them is
        Section&rsquo;s 96 + 96 and nothing else; neither band adds a margin.
      </Label>
      <ContentSection
        arrangement="beside"
        eyebrow="Adjacent · first"
        heading="How the work is sequenced"
        headingId="csec-adjacent-1"
        lead="Three steps, in the order they happen."
      >
        <Steps />
      </ContentSection>
      <ContentSection
        eyebrow="Adjacent · second"
        heading="What the interface may be telling you"
        headingId="csec-adjacent-2"
        lead={LEAD}
      >
        <Cards />
      </ContentSection>

      {/* ── 11 ─────────────────────────────────────────────────────────────────────────────── */}
      <Label title='11 · align="center"'>
        Eyebrow, heading and lead centred, each on its own measure (title 32ch, lead 56ch), and
        the body centred as a block beneath. Under a ruled ladder (the accordion) the foot
        passes rule=&#123;false&#125;: the ladder&rsquo;s last rule already closes the body, and
        a second hairline 48 under it reads as a double rule. Otherwise: a card set still spans
        the column, a capped block (the accordion in ContentSectionText, a centred CtaRow) sits
        in the middle at its cap, and text inside every block stays start-aligned, except a
        short coda after a set (ContentSectionText align=&quot;center&quot;, the first band),
        which closes on the head&rsquo;s axis. Always stacked; actions never sit in a centred
        head (the type refuses them) — a centred band&rsquo;s ask is its footer.
      </Label>
      <ContentSection
        align="center"
        eyebrow="Centred · a set"
        heading="Three places products slow down"
        headingId="csec-centre-set"
        lead="Each looks like an interface problem, and none of them starts on a screen."
      >
        <Cards />
        <ContentSectionText align="center">
          <Prose html="<p>None of the three is about the size of the team.</p><p>Each is a decision that matters enough to be designed before it is built.</p>" />
        </ContentSectionText>
      </ContentSection>
      <ContentSection
        align="center"
        eyebrow="Centred · D-faq"
        heading="Questions we are asked first"
        headingId="csec-centre-faq"
        footer={
          <CtaRow
            actions={[{ label: 'Ask us directly', href: ROUTES.contact }]}
            align="center"
            rule={false}
          />
        }
      >
        <ContentSectionText>
          <Accordion items={FAQ} />
        </ContentSectionText>
      </ContentSection>
      <ContentSection
        align="center"
        heading="What clients say"
        headingId="csec-centre-score"
        score={
          <RatingBadge
            score="4.8"
            platform="Clutch"
            href="https://clutch.co/profile/tcules-saas-product-design-studio"
            icon={<Icon name="star" size="sm" />}
            mark={<BrandMark name="clutch" />}
          />
        }
        lead="score: the caller's RatingBadge in the head, a block under the heading and over the lead (owner, 18 Nov 2026: the Clutch badge above the testimonials)."
      >
        <Cards />
      </ContentSection>
      <ContentSection
        align="center-lg"
        eyebrow="Centred from 1024 · center-lg"
        heading="Centred over the row, start-aligned over the stack"
        headingId="csec-centre-lg"
        lead="From 1024 the head centres; below it the head starts on the column edge, like the stacked body under it."
      >
        <Cards />
      </ContentSection>
      <FoldExempt reason={OVER_BUDGET}>
        <ContentSection
          align="center"
          eyebrow="Centred · longest copy"
          heading={HEADING_LONG}
          headingId="csec-centre-long"
          lead={LEAD_LONG}
        >
          <ContentSectionText>
            <Prose html={BODY_HTML} />
          </ContentSectionText>
        </ContentSection>
      </FoldExempt>
      <ContentSection
        align="center"
        surface="tint"
        eyebrow="Centred · tint"
        heading="Surface proof"
        headingId="csec-centre-tint"
        lead="Surface proof — on pages, tint is the proof band only (§ 1.7)."
        footer={
          <CtaRow
            actions={[SEE_WORK]}
            align="center"
            note="The rule and the note restate their ink per surface."
          />
        }
      >
        <ContentSectionText>
          <Prose html={BODY_HTML} />
        </ContentSectionText>
      </ContentSection>

      {/* ── 12 ─────────────────────────────────────────────────────────────────────────────── */}
      <Label title="12 · beside, with an aside or actions in the head track">
        The head track takes one large object a stack under the head text — a 3:2 photograph or
        one stat-lg figure (§ 3.3: D always has one of the two; C-icon always the photograph) —
        or the head&rsquo;s actions, never both (§ 1.4 rule 6; the type refuses the pair). The
        lead steps to body-lg in a split head track. Below 1024 the aside sits between the head
        and the body. The body is a reads-down body, icon cards two across, or two pair cards; a
        footer CtaRow closes the body track. Tint rows are surface proof — on pages, tint is the
        proof band only (§ 1.7).
      </Label>
      <ContentSection
        arrangement="beside"
        eyebrow="Aside · C-icon-4"
        heading="What you receive"
        headingId="csec-aside-icons"
        lead="Four things your team keeps, each one built to be run without us."
        aside={<AsidePhoto id="hand-sketch-wireframe" />}
        footer={<CtaRow actions={[HOW]} />}
      >
        <IconCards />
      </ContentSection>
      <ContentSection
        arrangement="beside"
        eyebrow="Aside · D"
        heading="How the work is sequenced"
        headingId="csec-aside-rows"
        lead="Three steps, in the order they happen, each with what it hands over."
        aside={<AsidePhoto id="moodboard-wall-desk" />}
      >
        <Steps />
      </ContentSection>
      <ContentSection
        arrangement="beside"
        eyebrow="Aside · D · a stat figure"
        heading="What the work returns"
        headingId="csec-aside-stat"
        lead="Three steps, and the one number that says whether they worked."
        aside={<AsideStat figure={STAT} />}
      >
        <Steps />
      </ContentSection>
      <ContentSection
        arrangement="beside"
        surface="tint"
        eyebrow="Stat aside · copy and label at the ceiling"
        heading={HEADING_CEILING_TRACK}
        headingId="csec-aside-stat-long"
        lead={LEAD_CEILING}
        aside={<AsideStat figure={STAT_LONG} />}
      >
        <Steps />
      </ContentSection>
      <ContentSection
        arrangement="beside"
        eyebrow="Actions · C-pair"
        heading="Two pieces of work that argue the same point"
        headingId="csec-beside-actions"
        lead="A rebuilt workflow and a design system, both settled at the model before a screen was drawn."
        actions={<CtaRow actions={[SEE_WORK]} rule={false} />}
      >
        <PairCards />
      </ContentSection>
      <FoldExempt reason={OVER_BUDGET}>
        <ContentSection
          arrangement="beside"
          surface="tint"
          eyebrow="Aside · longest copy"
          heading={HEADING_LONG}
          headingId="csec-aside-long"
          lead={LEAD_LONG}
          aside={<AsidePhoto id="studio-session-talk" />}
        >
          <Steps />
        </ContentSection>
      </FoldExempt>

      {/* ── 13 ─────────────────────────────────────────────────────────────────────────────── */}
      <Label title="13 · A text-only head is one column (split-head retired)">
        The H-row — heading in the leading third, lead and actions in the trailing two-thirds —
        was retired on 7 Oct 2026 (owner): with no image beside it the reading order was unclear
        and the action floated in a mostly empty track. A head with no media is eyebrow →
        heading → lead 24, lead → actions 48, in one column over a full-column body; side by
        side survives only where one side is media (14, and the aside in 8 to 12). These are the
        bands that took the H-row, as they read now. Tint rows are surface proof — on pages,
        tint is the proof band only (§ 1.7).
      </Label>
      <ContentSection
        eyebrow="Stacked · with an action"
        heading="What we do"
        headingId="csec-split-action"
        lead="Product design, design systems and the engineering that ships them, as one team."
        actions={
          <CtaRow actions={[{ label: 'All services', href: ROUTES.services }]} rule={false} />
        }
      >
        <Cards />
      </ContentSection>
      <ContentSection
        surface="tint"
        eyebrow="Stacked · lead only, and a footer"
        heading="Three places products slow down"
        headingId="csec-split-lead"
        lead={LEAD}
        footer={
          <CtaRow
            actions={[SEE_WORK]}
            note="Each one is a case study you can read in five minutes."
          />
        }
      >
        <Cards />
      </ContentSection>
      <FoldExempt reason={OVER_BUDGET}>
        <ContentSection
          eyebrow="Stacked · longest copy"
          heading={HEADING_LONG}
          headingId="csec-split-long"
          lead={LEAD_LONG}
          actions={<CtaRow actions={[START]} rule={false} />}
        >
          <Cards />
        </ContentSection>
      </FoldExempt>

      {/* ── 13b · actions at the end of the heading's row ─────────────────────────────── */}
      <Label title="13b · Actions at the end of the heading's row">
        actionsAt=&quot;end&quot; (owner, 7 Oct 2026; centred 29 Oct 2026): the heading and the
        actions share one row from 1024, vertically centred on each other, and the lead sits
        under that row — the eyebrow keeps its own line above. A content-sized track, 64 from
        the heading. Below 1024 the actions sit a block under the heading, above the lead.
        Stacked heads only; the link row on paper and on tint, then the longest heading and lead
        against it. An in-band action is always a link (r7-buttons, 8 Oct 2026): the solid pair
        is the hero&rsquo;s and the close&rsquo;s.
      </Label>
      <ContentSection
        eyebrow="Actions at the end · link"
        heading="What we do"
        headingId="csec-actions-end-link"
        lead="Product design, design systems and the engineering that ships them, as one team."
        actionsAt="end"
        actions={<CtaRow actions={[SEE_WORK]} rule={false} />}
      >
        <PairCards />
      </ContentSection>
      <ContentSection
        surface="tint"
        eyebrow="Actions at the end · on tint"
        heading="Two pieces of work that argue the same point"
        headingId="csec-actions-end-pair"
        lead="A rebuilt workflow and a design system, both settled at the model before a screen was drawn."
        actionsAt="end"
        actions={<CtaRow actions={[HOW]} rule={false} />}
      >
        <PairCards />
      </ContentSection>
      <FoldExempt reason={OVER_BUDGET}>
        <ContentSection
          eyebrow="Actions at the end · longest copy"
          heading={HEADING_LONG}
          headingId="csec-actions-end-long"
          lead={LEAD_LONG}
          actionsAt="end"
          actions={<CtaRow actions={[START]} rule={false} />}
        >
          <PairCards />
        </ContentSection>
      </FoldExempt>

      {/* ── 14 ─────────────────────────────────────────────────────────────────────────────── */}
      <Label title='14 · arrangement="media" (the B split)'>
        A 4:5 photograph in 5 of [5, 7], radius 8, the copy in 7, 96 apart. Only one shape pins:
        blocks, then a footer. That copy column stretches to the photo and pins the footer to
        its bottom edge, so the two share a top and a bottom edge (§ 3.2 rule 1). Everything
        else is centred on the photo (rule 2): tiles with no footer, and a copy column with no
        blocks — a head and a footer, or a head and its actions — because there is nothing to
        fill a stretch and pinning would leave ~400 of empty column between the lead and the
        action. Head actions are never pinned; they sit a stack under the lead. The no-blocks
        bands are degrade cases, not page shapes (§ 3.4 B always carries tiles), and their foot
        takes rule=&#123;false&#125;: with no body above it, the hairline would underline the
        lead. The pinned band is shown beside the same band with media.pin=false, for the owner
        to choose between (spec open question 7). media.side flips the photo to the end. Below
        1024 the photo sits above the copy at 4:3. Tint rows are surface proof — on pages, tint
        is the proof band only (§ 1.7).
      </Label>
      <ContentSection
        arrangement="media"
        media={{ head: 'lg', image: photo('studio-sticky-board-ux') }}
        eyebrow="Photo start · 4 tiles · centred"
        heading="How a week with us actually runs"
        headingId="csec-media-tiles"
        lead="Working sessions, one shared board and a written trail, from the first week."
      >
        <Tiles />
      </ContentSection>
      <ContentSection
        arrangement="media"
        media={{ head: 'lg', image: photo('designer-desk-monitor'), side: 'end' }}
        eyebrow="Photo end · 2 tiles + CtaRow · pinned (the default)"
        heading="The team you work with is the team that ships"
        headingId="csec-media-ctarow"
        lead="No hand-off between a pitch team and a delivery team. The people in the room build it."
        footer={<CtaRow actions={[HOW]} />}
      >
        <Tiles count={2} />
      </ContentSection>
      {/* The owner comparison: identical band, same side, so alignment is the only difference. */}
      <ContentSection
        arrangement="media"
        media={{
          head: 'lg',
          image: photo('designer-desk-monitor'),
          side: 'end',
          pin: false,
        }}
        eyebrow="Photo end · 2 tiles + CtaRow · media.pin=false, centred"
        heading="The team you work with is the team that ships"
        headingId="csec-media-ctarow-centred"
        lead="No hand-off between a pitch team and a delivery team. The people in the room build it."
        footer={<CtaRow actions={[HOW]} />}
      >
        <Tiles count={2} />
      </ContentSection>
      <ContentSection
        arrangement="media"
        media={{ head: 'lg', image: photo('stylus-tablet-sketch') }}
        eyebrow="No blocks + CtaRow · centred · degrade case"
        heading="Drawn first, then built properly"
        headingId="csec-media-lead"
        lead="Every interface starts as a sketch on paper, because a sketch is cheap to throw away and a coded screen is not."
        footer={
          <CtaRow
            actions={[SEE_WORK]}
            note="Twelve case studies, each with its first sketch."
            rule={false}
          />
        }
      />
      <ContentSection
        arrangement="media"
        media={{ head: 'lg', image: photo('whiteboard-two-hands'), side: 'end' }}
        eyebrow="Head actions, no blocks · centred · degrade case"
        heading="Start with the decision in front of you"
        headingId="csec-media-actions"
        lead="A thirty-minute call about the decision you are facing, and a written note of what we would do first."
        actions={<CtaRow actions={[START]} rule={false} />}
      />
      <ContentSection
        arrangement="media"
        media={{ head: 'lg', image: photo('studio-sticky-board-ux') }}
        surface="tint"
        eyebrow="Copy at the ceiling · 2 tiles + CtaRow"
        heading={HEADING_LONG}
        headingId="csec-media-long"
        lead={LEAD_CEILING}
        footer={<CtaRow actions={[SEE_WORK]} />}
      >
        {/* § 1.4 rule 9: ≤ 4 tiles, or ≤ 2 tiles and a CtaRow, never both in full. The stress is the
            copy at its § 1.5 ceiling (H-full: 10-word h2, 18-word lead) inside the fuller of the two
            allowed shapes, not a third shape — so this row must, and does, fit the fold. */}
        <Tiles count={2} />
      </ContentSection>
      <FoldExempt reason={`${OVER_BUDGET}: proves a copy column taller than the photo`}>
        <ContentSection
          arrangement="media"
          media={{ head: 'lg', image: photo('stylus-tablet-sketch'), side: 'end' }}
          eyebrow="CMS stress · copy taller than the photo · fold-exempt"
          heading={HEADING_LONG}
          headingId="csec-media-overflow"
          lead={LEAD_LONG}
          footer={<CtaRow actions={[SEE_WORK]} />}
        >
          <Tiles count={2} />
        </ContentSection>
      </FoldExempt>

      {/* ── 14a · a bare media head over rows, against the same head stacked ─────────────── */}
      <Label title="14a · media head = every band's head (18 Nov 2026)">
        A media split&rsquo;s heading is the band&rsquo;s h2, the same role and weight as the
        stacked band under it, at every width; the h1 role is the explicit
        media.head=&quot;xl&quot; (shown last). A bare head (no lead) sits a block (24) over its
        rows. With media.headAbove (19 Nov 2026) the head takes its own full-width row and the
        figure sits beside the rows under it: head, figure, rows on a phone. From 1024 the
        photograph is as tall as the rows, not its own 4:5 (round 10); a drawing keeps its own
        16:9 in half the width, centred on the rows&rsquo; height (round 11): the second band. The
        coda closes the whole split at the section lead&rsquo;s role (16), never above the body
        ceiling. MVP&rsquo;s &ldquo;Your prototype is the brief we build from&rdquo; is this
        band.
      </Label>
      <FoldExempt reason="compares the media head with a stacked one; height is not the point">
        <ContentSection
          arrangement="media"
          media={{ image: photo('studio-sticky-board-ux'), side: 'start', headAbove: true }}
          heading="Your prototype is the brief we build from"
          headingId="csec-media-bare-rows"
          coda="You get the call in writing, area by area, with the reason. You decide what to fund."
        >
          <Layout as="ul" rowGap="none">
            {STEPS.map((step) => (
              <ListCard
                key={step.title}
                title={step.title}
                titleAs="h3"
                arrangement="stacked"
              />
            ))}
          </Layout>
        </ContentSection>
        <ContentSection
          arrangement="media"
          media={{
            drawing: <Sketch name="design-systems" />,
            side: 'start',
            headAbove: true,
          }}
          heading="The same band, with its drawing"
          headingId="csec-media-bare-rows-drawing"
        >
          <Layout as="ul" rowGap="none">
            {STEPS.map((step) => (
              <ListCard
                key={step.title}
                title={step.title}
                titleAs="h3"
                arrangement="stacked"
              />
            ))}
          </Layout>
        </ContentSection>
        <ContentSection heading="The same head, stacked" headingId="csec-media-bare-compare">
          <Layout as="ul" rowGap="none">
            {STEPS.map((step) => (
              <ListCard
                key={step.title}
                title={step.title}
                titleAs="h3"
                arrangement="stacked"
              />
            ))}
          </Layout>
        </ContentSection>
        <ContentSection
          arrangement="media"
          media={{ head: 'xl', image: photo('whiteboard-two-hands'), side: 'end' }}
          eyebrow='media.head="xl" · the opt-in h1 role (h2 below 768)'
          heading="Start with the decision in front of you"
          headingId="csec-media-xl"
          lead="A thirty-minute call about the decision you are facing, and a written note of what we would do first."
          actions={<CtaRow actions={[START]} rule={false} />}
        />
      </FoldExempt>

      {/* ── 14b · the texture slot outside `media` ───────────────────────────────────────── */}
      <Label title="14b · texture, in every arrangement">
        The texture slot takes one of Texture&rsquo;s named placements and renders it as the
        band&rsquo;s first child, beneath the content. In media it shows from 1024 only (the
        counterweight has no phone form); in stacked, beside and a centred head it shows at
        every width, which these three bands prove at 390. Paper only, by type: beside any other
        surface the prop does not compile. Shown with a corner glow composed in place, in the
        bottom padding and leaving by the side. The media split&rsquo;s own counterweight is not
        this slot: it is media.counterweight, a field in the copy column
        (/design/kit/media-split).
      </Label>
      <ContentSection
        eyebrow="Stacked · texture"
        heading="Three places products slow down"
        headingId="csec-texture-stacked"
        lead={LEAD}
        texture={<CornerTexture side="end" />}
      >
        <Cards />
      </ContentSection>
      <ContentSection
        arrangement="beside"
        eyebrow="Beside · texture"
        heading="What changes in the first month"
        headingId="csec-texture-beside"
        lead={LEAD}
        texture={<CornerTexture side="start" />}
      >
        <Tiles count={2} />
      </ContentSection>
      <ContentSection
        align="center"
        eyebrow="Centred · texture"
        heading="One team from the first workshop"
        headingId="csec-texture-centred"
        lead={LEAD}
        texture={<CornerTexture side="end" />}
      >
        <Cards />
      </ContentSection>

      {/* ── 15 ─────────────────────────────────────────────────────────────────────────────── */}
      <Label title="15 · Footer in every arrangement, and footer alone">
        The footer is the body&rsquo;s last row, a stack under the blocks, in every arrangement
        (sections 11 to 14 show it centred, beside, stacked and media). Stacked here, and beside
        with a footer and no blocks — a degrade case, not a page shape: a footer is not a
        trailing half on its own (a lone CtaRow level with the eyebrow over an empty two-thirds
        track), so the band is the stacked band, the footer a stack under the head. With no
        blocks the foot passes rule=&#123;false&#125;: its hairline marks where a body ends, and
        with no body above it, it would sit 48 under the lead as an underline.
      </Label>
      <ContentSection
        eyebrow="Footer · stacked"
        heading="Three places products slow down"
        headingId="csec-footer-stacked"
        lead={LEAD}
        footer={
          <CtaRow
            actions={[SEE_WORK]}
            note="Each one is a case study you can read in five minutes."
          />
        }
      >
        <Cards />
      </ContentSection>
      <ContentSection
        arrangement="beside"
        surface="tint"
        eyebrow="Footer only · beside — degrades to stacked"
        heading="Not sure which of these fits?"
        headingId="csec-footer-only"
        lead="Tell us the decision you are facing and we will say which, in writing."
        footer={
          <CtaRow
            actions={[START]}
            note="Every engagement starts with a thirty-minute call."
            rule={false}
          />
        }
      />

      <Label title='16 · headingSize="xl" and asideFill'>
        headingSize=&quot;xl&quot; sets the same h2 at the display role on the display measure:
        a head that opens an argument, at the ~70 of the references against cards at 22 to 28,
        so the scale gap between head and set is unmistakable. It changes the scale, never the
        element. Shown centred and start-aligned. asideFill (beside, photo aside only) makes the
        head-track photograph end on the body&rsquo;s last line: the two tracks stretch to one
        height and the photo, a fit=&quot;fill&quot; Media, takes what the head text leaves,
        never below about 3:2. Without it (section 12) the 3:2 photo keeps its own height.
      </Label>
      <ContentSection
        align="center"
        headingSize="xl"
        eyebrow="Display · centred"
        heading="Three places products slow down"
        headingId="csec-display-centred"
        lead={LEAD}
      >
        <Cards />
      </ContentSection>
      <ContentSection
        headingSize="xl"
        eyebrow="Display · stacked"
        heading="Where the work starts"
        headingId="csec-display-stacked"
      >
        <Cards />
      </ContentSection>
      <ContentSection
        arrangement="beside"
        eyebrow="asideFill · beside"
        heading="Four things you keep"
        headingId="csec-aside-fill"
        lead={LEAD}
        asideFill
        aside={<Media image={photo('hand-sketch-wireframe')} fit="fill" sizes={HEAD_TRACK} />}
      >
        <IconCards />
      </ContentSection>
    </>
  );
}
