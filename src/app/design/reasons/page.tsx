import type { ReactNode } from 'react';

import { Button, Icon, Layout, Section, type MediaImage } from '@/components';
import { getCorpusPage, getReasonFigure } from '@/content';
import { inlineToText } from '@/lib/inline';
import { placeholderCover, placeholderIllustration } from '@/lib/placeholders';
import { ROUTES } from '@/lib/routes';
import { CtaRow, Reasons, type ReasonsItem } from '@/patterns';
import { whyTcules } from '@/templates';

import { Variation } from '../_specimen/Variation';
import t from '../_specimen/typeroles.module.css';

/**
 * /design/reasons — why choose the studio, as argued reasons each with a drawing of its claim
 * (why-us mocks rounds 1–4, owner 16 Oct 2026). Every arrangement with four reasons in a 2×2 (the
 * shape since 22 Oct 2026), the three- and six-reason rows that still fill whole rows, the longest
 * copy, the bare head, and the tint ground with its paper-deep figures; then the launch copy's Why
 * Tcules reasons with their own drawings (11–13, owner 29 Oct 2026). Sample words,
 * written to the brief's lengths (a title of about five words, a sentence of about fourteen), so the
 * pattern is proven content-agnostic.
 */

/** The six drawings, each on both grounds; the intrinsic sizes are the exported SVGs'. */
const FIGURES = {
  'same-people': [399, 359],
  'ships-as-code': [399, 356],
  'week-one': [420, 351],
  'the-number': [378, 358],
  'ai-trust': [420, 373],
  'system-kept': [383, 368],
} as const;

type FigureName = keyof typeof FIGURES;

const figure = (name: FigureName, ground: 'paper' | 'paper-deep' = 'paper'): MediaImage => ({
  src: `/illustrations/reasons/${name}.${ground}.svg`,
  alt: '',
  width: FIGURES[name][0],
  height: FIGURES[name][1],
  kind: 'illustration',
});

const WORDS: { title: string; body: string; figure: FigureName }[] = [
  {
    title: 'Senior people, start to finish',
    body: 'The people in the pitch are the people on your product, through to launch day.',
    figure: 'same-people',
  },
  {
    title: 'Design that ships as code',
    body: 'Components and tokens your engineers can use, matching the file to the pixel.',
    figure: 'ships-as-code',
  },
  {
    title: 'Real screens in week one',
    body: 'Decisions start in the first five days, on screens you can click.',
    figure: 'week-one',
  },
  {
    title: 'Judged on the number',
    body: 'We agree the metric that matters first, and track it after launch.',
    figure: 'the-number',
  },
  {
    title: 'AI that people trust',
    body: 'AI features designed around what people check, accept and correct.',
    figure: 'ai-trust',
  },
  {
    title: 'A system your team keeps',
    body: 'A documented design system, so the product holds its shape after we leave.',
    figure: 'system-kept',
  },
];

const all = (ground: 'paper' | 'paper-deep' = 'paper'): ReasonsItem[] =>
  WORDS.map((w) => ({ title: w.title, body: w.body, figure: figure(w.figure, ground) }));

/** The shape: four reasons, a 2×2. */
const items = (ground: 'paper' | 'paper-deep' = 'paper'): ReasonsItem[] =>
  all(ground).slice(0, 4);

/** The ceilings P48 sets: a five-word title of long words, a sentence of twenty words. */
const LONGEST: ReasonsItem[] = items().map((item, index) =>
  index % 2 === 0
    ? {
        ...item,
        title: 'Accountable seniority, discovery through deployment',
        body: 'The specialists who scope your engagement stay accountable for every decision, review and release until your product is live.',
      }
    : item,
);

const ACTION = (
  <Button
    as="a"
    href="#how-we-work"
    emphasis="link"
    size="md"
    icon={<Icon name="arrow-right" />}
  >
    How we work
  </Button>
);

/**
 * The launch copy's Why Tcules reasons (the 26 Oct copy, words exactly as authored), each drawn from
 * its own claim (scripts/illustrations/reasons.mjs) and resolved by title at the content seam.
 */
const COPY_REASONS: readonly (readonly [string, ReactNode])[] = [
  [
    'We work out what the product has to know before we draw it.',
    <>
      Our audit of Dealpath&rsquo;s deal-management software found that one action assumed every
      listing was a new deal, and our redesign changed that step.{' '}
      <a href="#dealpath">Read the Dealpath case</a>
    </>,
  ],
  [
    'We know what to leave alone in a product people rely on.',
    <>
      In Doodle&rsquo;s scheduling MVP, we reused the existing components for standard
      interactions and designed new ones only for calendar and bookability work.{' '}
      <a href="#doodle">Read the Doodle case</a>
    </>,
  ],
  [
    'We prove the hard parts in code while they can still change.',
    <>
      ConnectX&rsquo;s AI dashboard ran first as our coded demo on sample data, while the design
      could still change, and we then carried it into a production-ready module.{' '}
      <a href="#connectx">Read the ConnectX case</a>
    </>,
  ],
  [
    'One studio can take it into working software, with the designers staying in the build.',
    <>
      ConnectX&rsquo;s AI workspace went from our coded demo to a production-ready module, live
      since late 2025. <a href="#connectx">Read the ConnectX case</a>
    </>,
  ],
  [
    'We design AI that people can check and correct.',
    <>
      In the survey product we designed for Novus Insights, the AI drafts and the researcher
      decides, and a rewritten question keeps the AI&rsquo;s original visible beneath it.{' '}
      <a href="#novus">Read the Novus Insights case</a>
    </>,
  ],
  [
    'Senior people do the work, and clients keep us for years.',
    'Primelis brought us in as an ongoing partnership three years ago, and we have designed each of its products since.',
  ],
  [
    'We tell you what is really wrong.',
    <>
      At Dealpath, our audit placed the fault in a single assumption, that every listing becomes
      a new deal, and the redesign asks people to find the existing deal first.{' '}
      <a href="#dealpath">Read the Dealpath case</a>
    </>,
  ],
];

const HOME_REASONS: readonly (readonly [string, ReactNode])[] = [
  [
    'Products customers rely on',
    <>
      Enterprise scheduling for <a href="#doodle">Doodle</a>, the deal pipeline at{' '}
      <a href="#dealpath">Dealpath</a>, the print store and production system at{' '}
      <a href="#gold-image">Gold Image Printing</a> and search across hundreds of AI models at{' '}
      <a href="#eden-ai">Eden AI</a>.
    </>,
  ],
  [
    'AI that reached production',
    <>
      The AI dashboard we designed for ConnectX, first proved in a coded demo, has been live as
      a production-ready module since late 2025.{' '}
      <a href="#connectx">See how ConnectX got there</a>
    </>,
  ],
  [
    'Relationships that last',
    <>
      Primelis has worked with us for three years and <a href="#vovisto">Vovisto</a> since its
      first concept. Our work with Benchmark Gensuite has continued since the first coded
      prototypes.
    </>,
  ],
];

/** Reasons with their drawings, resolved by title at the content seam, on the given ground. */
const drawn = (
  rows: readonly (readonly [string, ReactNode])[],
  ground: 'paper' | 'paper-deep' = 'paper',
): ReasonsItem[] =>
  rows.map(([title, body]) => {
    /* A reason with no drawing of its own takes the labelled illustration slot, as the offer band does. */
    const found = getReasonFigure(title, ground);
    return {
      title,
      body,
      figure: found
        ? { ...found, alt: '', kind: 'illustration' }
        : { ...placeholderIllustration(title), alt: '' },
    };
  });

const WHY_LINKS = (
  <Button
    as="a"
    href="#why-tcules"
    emphasis="link"
    size="md"
    icon={<Icon name="arrow-right" />}
  >
    Why teams choose Tcules
  </Button>
);

/** Stress for the proof form: names only (no approved mark), a long figure, two figures. */
const PROOF_STRESS: ReasonsItem[] = [
  {
    title: 'Products customers rely on',
    body: 'Four clients named in one sentence, none of them with an approved mark yet.',
    proof: {
      kind: 'marks',
      marks: [
        { name: 'Dealpath' },
        { name: 'Gold Image Printing' },
        { name: 'Benchmark Gensuite' },
        { name: 'Ringier Media Switzerland' },
      ],
    },
  },
  {
    title: 'AI that reached production',
    body: 'A register placeholder cover, with its one long figure under it.',
    proof: {
      kind: 'cover',
      image: placeholderCover('gold-image-printing'),
      figure: {
        value: 'Live in production since early 2026',
        label: 'A client with a long name',
      },
    },
  },
  {
    title: 'Relationships that last',
    body: 'Two tenures, so the column is shorter than its neighbours and centres in the box.',
    proof: {
      kind: 'figures',
      figures: [
        { value: '7 years', label: 'Primelis' },
        { value: 'Since the first coded prototypes', label: 'Benchmark Gensuite' },
      ],
    },
  },
];

/** Offer pages: two case covers with no figure, one tenure as a figure. */
const OFFER_PROOF: ReasonsItem[] = [
  {
    title: 'Products customers rely on',
    body: 'A linked case shows its own cover and nothing under it.',
    proof: { kind: 'cover', image: placeholderCover('gold-image-printing') },
  },
  {
    title: 'AI that reached production',
    body: 'A second linked case, the same box height.',
    proof: { kind: 'cover', image: placeholderCover('gold-image-printing') },
  },
  {
    title: 'Senior people do the work, and clients keep us for years',
    body: 'A stated tenure shows as one figure.',
    proof: { kind: 'figures', figures: [{ value: '3 years', label: 'Primelis' }] },
  },
];

export default async function ReasonsSpecimen() {
  const home = await getCorpusPage(ROUTES.home);
  const band = home?.bands.find((b) => b.id === 'why-tcules');
  const words = band ? whyTcules(band) : undefined;
  const opening = band?.blocks.find((block) => block.type === 'paragraph');
  const lead = opening?.type === 'paragraph' ? inlineToText(opening.runs) : undefined;
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <p className={t.eyebrow}>Pattern · tier 2</p>
          <h1>Reasons</h1>
          <p className={t.lead}>
            Why a buyer should choose the studio: argued reasons, each a title, one sentence and
            an isometric drawing of its claim from the ch05 kit, facing its words. Built for
            four, set 2×2. Each reason is the drawing above, then its title, then its body, at
            the full width of its track, and the head always reads across the top (owner, 29 Oct
            2026). Two ways to hold the set without boxing a reason: open (the gap scale alone)
            and boxed (the set in LogoGrid&rsquo;s rounded frame). A third, beside, sets words
            only: the head in a leading track and the reasons reading down beside it (owner, 30
            Oct 2026).
          </p>
        </Layout>
      </Section>

      <Variation
        id="open"
        title="1 · Open — four reasons 2×2, no rules (the default; home)"
        note="Mock S1, the set as home shows it. The gap scale draws the grid: column (64) between columns and rows. Each drawing heads its title and body, which take the track's full width. The head reads across with the action at the heading row's end, vertically centred on the heading, the lead under that row and the eyebrow above (owner, 29 Oct 2026). Two across from 768 (a 2×2), one below."
      />
      <Reasons
        eyebrow="Why Tcules"
        heading="A studio built for what ships."
        headingTail="Four reasons teams stay."
        headingId="rsn-open"
        items={items()}
        action={ACTION}
      />

      <Variation
        id="engagement"
        title="1b · Ways to work with us — a body with links, and a closing note"
        note="The service pages' engagement options drawn as reasons (owner, 26 Oct 2026): four in a 2×2, each with its isometric figure (scripts/illustrations/engagement.mjs), a body that may carry a link, and `note` closing the set: the limit on the offer."
      />
      <Reasons
        heading="Ways to work with us"
        headingId="rsn-engagement"
        items={(
          [
            ['feature', 'A single workflow or feature.', 'One problem, solved properly.'],
            [
              'area',
              'A product area or a whole new product.',
              'From research to designs ready to build.',
            ],
            [
              'embedded',
              'A designer in your team.',
              'An experienced designer working in your tools and meetings.',
            ],
            ['build', 'Design and build.', null],
          ] as const
        ).map(([scope, title, body]) => ({
          title,
          body: body ?? (
            <>
              We design it, then our <a href="#build">engineering team</a> builds it.
            </>
          ),
          figure: {
            src: `/illustrations/engagement/${scope}.paper.svg`,
            width: 380,
            height: 379,
            alt: '',
            kind: 'illustration' as const,
          },
        }))}
        note={<p className={t.body}>We are at our best when there is real thinking to do.</p>}
      />

      <Variation
        id="boxed"
        title="2 · Boxed — the set in one rounded frame"
        note="Mock C2a, with LogoGrid's closed frame: cells ruled between, the outer edge drawn once with the photograph radius, each cell at the gutter inset. Four cells 2×2 from 1024. The frame holds the SET; no reason is a card."
      />
      <Reasons
        eyebrow="Why Tcules"
        heading="A studio built for what ships."
        headingTail="Four reasons teams stay."
        headingId="rsn-boxed"
        items={items()}
        action={ACTION}
        arrangement="boxed"
      />

      <Variation
        id="longest"
        title="3 · The longest copy, open"
        note="Every other reason at P48's ceilings: a five-word title of long words and a twenty-word sentence. Still one fold at 1440."
      />
      <Reasons
        eyebrow="Why Tcules"
        heading="A studio built for what ships."
        headingTail="Senior people, work that lands as code, and a number we answer to."
        headingId="rsn-longest"
        items={LONGEST}
        action={ACTION}
      />

      <Variation
        id="three"
        title="4 · Three reasons, open, no eyebrow"
        note="Another count that fills whole rows. Three in open go three across from 1024 and one column below it; in boxed, three across from 1440. Counts other than three, four or six warn in development."
      />
      <Reasons
        heading="Why teams pick a studio that ships."
        headingId="rsn-three"
        items={items().slice(0, 3)}
      />

      <Variation
        id="six-boxed"
        title="5 · Six reasons, boxed"
        note="The shape before 22 Oct 2026, still accepted because it fills whole rows: three across from 1440, two from 1024, the frame ruled for each count."
      />
      <Reasons
        eyebrow="Why Tcules"
        heading="A studio built for what ships."
        headingTail="Six reasons teams stay."
        headingId="rsn-six-boxed"
        items={all()}
        action={ACTION}
        arrangement="boxed"
      />

      <Variation
        id="six-open"
        title="6 · Six reasons, open"
        note="Six in open: two across from 768, three from 1440, in two rows."
      />
      <Reasons
        eyebrow="Why Tcules"
        heading="A studio built for what ships."
        headingTail="Senior people, work that lands as code, and a number we answer to."
        headingId="rsn-six-open"
        items={all()}
        action={ACTION}
      />

      <Variation
        id="bare"
        title="7 · Boxed, a bare head"
        note="No eyebrow, no tail, no action: the heading alone over the frame."
      />
      <Reasons heading="Why Tcules" headingId="rsn-bare" items={items()} arrangement="boxed" />

      <Variation
        id="tint"
        title="8 · Tint ground, open"
        note="Every --rsn-* token is restated on tint: the tail steps to neutral-600 and the rule to neutral-300. The figures are the paper-deep exports, so their occluding faces are the ground's own colour (§4a)."
      />
      <Reasons
        eyebrow="Why Tcules"
        heading="A studio built for what ships."
        headingTail="Four reasons teams stay."
        headingId="rsn-tint"
        items={items('paper-deep')}
        action={ACTION}
        surface="tint"
      />

      <Variation
        id="tint-boxed"
        title="9 · Tint ground, boxed"
        note="The tint rule (neutral-300) on the frame and between the cells. Paper or tint only: the figures are exported for those two grounds, so `surface` takes no other."
      />
      <Reasons
        eyebrow="Why Tcules"
        heading="A studio built for what ships."
        headingTail="Four reasons teams stay."
        headingId="rsn-tint-boxed"
        items={items('paper-deep')}
        arrangement="boxed"
        surface="tint"
      />

      <Variation
        id="lead-open"
        title="10 · A lead, open"
        note="`lead`: the sentence that frames the set, under the heading at the lead role (component-map C1). Three items fill one row from 1024."
      />
      <Reasons
        heading="How we work together"
        headingId="rsn-lead-open"
        lead="Bring what you have: an idea, a prototype or a product with years behind it. Shaping the brief is part of the work, and our first conversation is about your product."
        items={items().slice(0, 3)}
        action={ACTION}
      />

      <Variation
        id="lead-two"
        title="11 · A lead of two paragraphs, with an action"
        note="A lead of two paragraphs is passed as nodes. The action sits at the end of the heading's row from 1024, its top on the heading's first line, never at the lead's foot; below 1024 it is a stack under the lead."
      />
      <Reasons
        heading="How we work together"
        headingId="rsn-lead-two"
        lead={
          <Layout rowGap="text">
            <p>
              Bring what you have: an idea, a hunch that something is wrong, a prototype or a
              product with ten years behind it.
            </p>
            <p>
              Shaping the brief is part of the work, and our first conversation is about your
              product.
            </p>
          </Layout>
        }
        items={items().slice(0, 3)}
        action={ACTION}
      />

      <Variation
        id="home-copy"
        title="12 · Home's three reasons, drawn"
        note="Home's Why Tcules as the 26 Oct copy authors it, each reason with its own drawing (scripts/illustrations/reasons.mjs, home set): every day's work running through the product; the feature proved in a coded demo and live in production; the same seat on the product as it grows, year on year."
      />
      <Reasons
        heading="A product design partner for ambitious SaaS teams"
        headingId="rsn-home-copy"
        items={drawn(HOME_REASONS)}
        action={WHY_LINKS}
      />

      <Variation
        id="offer-copy"
        title="13 · Offer page · three reasons · figureSize lg (product design)"
        note="The offer pages' Why Tcules at band scale (owner, 30 Oct 2026, round 6): one isometric illustration per reason, 256 tall (200 below 768), start-aligned with its title, no plate and no figure panel. Product design's three: the screen standing on what the product knows, the hard part proved in code across the seam from the open design, the same senior seat staying year on year. The case links stay in the text."
      />
      <Reasons
        heading="Why teams choose Tcules"
        headingId="rsn-offer-copy"
        figureSize="lg"
        items={drawn([COPY_REASONS[0]!, COPY_REASONS[2]!, COPY_REASONS[5]!])}
        action={WHY_LINKS}
      />

      <Variation
        id="offer-slot"
        title="14 · Offer page · three reasons · one is the labelled slot, on tint"
        note="A reason whose illustration is not drawn yet takes the labelled register placeholder in the same box (the four offer reasons not drawn this round: leave alone, into software, AI checked, what is wrong). One slot per reason, never an older drawing at another scale. The drawn two are the paper-deep exports on tint; the slot draws its own hairline and radius."
      />
      <Reasons
        heading="Why teams choose Tcules"
        headingId="rsn-offer-slot"
        figureSize="lg"
        items={drawn([COPY_REASONS[0]!, COPY_REASONS[1]!, COPY_REASONS[2]!], 'paper-deep')}
        surface="tint"
      />

      <Variation
        id="band-figure"
        title="14b · One drawing for the band, on tint (owner, 5 Nov 2026; parked on /why-tcules 6 Nov, see 14d)"
        note="`bandFigure`: one scene for the whole set at the content width, between the head and the reasons, so the reasons under it are words only (any figure or proof an item carries is not drawn). /why-tcules' three principles: three Tcules–client pairs at one studio table, one pair per principle. The drawing is transparent, made for the tint band's paper-deep ground."
      />
      <Reasons
        heading="Better product decisions, before you build"
        headingId="rsn-band-figure"
        surface="tint"
        bandFigure={{
          src: '/illustrations/why-tcules/principles.svg',
          width: 813,
          height: 442,
          alt: '',
          kind: 'illustration',
        }}
        items={[
          {
            title: 'Evidence before screens',
            body: 'We test your assumptions with real users before they become expensive mistakes.',
          },
          {
            title: 'What to build first',
            body: 'You leave knowing what to build, what can wait, and why.',
          },
          {
            title: 'Design that pays back',
            body: 'Every design decision is tied to the adoption, renewals or revenue it should move.',
          },
        ]}
      />

      <Variation
        id="band-figure-boxed"
        title="14c · One drawing for the band, boxed"
        note="The same band figure over the boxed set: the frame holds the three principles, words only, under the one drawing."
      />
      <Reasons
        heading="Better product decisions, before you build"
        headingId="rsn-band-figure-boxed"
        arrangement="boxed"
        surface="tint"
        bandFigure={{
          src: '/illustrations/why-tcules/principles.svg',
          width: 813,
          height: 442,
          alt: '',
          kind: 'illustration',
        }}
        items={[
          {
            title: 'Evidence before screens',
            body: 'We test your assumptions with real users before they become expensive mistakes.',
          },
          {
            title: 'What to build first',
            body: 'You leave knowing what to build, what can wait, and why.',
          },
          {
            title: 'Design that pays back',
            body: 'Every design decision is tied to the adoption, renewals or revenue it should move.',
          },
        ]}
      />

      <Variation
        id="scenes"
        title="14d · A flat drawing per reason: /why-tcules principles, on tint (owner, 6 Nov 2026)"
        note="`scene` on every item: each reason heads its words with its own Sketch plate, 16:9 at the track's full width, drawn from its sentence (components/Sketch/wyg-why-tcules.tsx). Set on every item or on none; a set with only some scenes draws none and warns in development."
      />
      <Reasons
        heading="Better product decisions, before you build"
        headingId="rsn-scenes"
        surface="tint"
        items={[
          {
            title: 'Evidence before screens',
            body: 'We test your assumptions with real users before they become expensive mistakes.',
            scene: 'why-principles-evidence',
          },
          {
            title: 'What to build first',
            body: 'You leave knowing what to build, what can wait, and why.',
            scene: 'why-principles-build-first',
          },
          {
            title: 'Design that pays back',
            body: 'Every design decision is tied to the adoption, renewals or revenue it should move.',
            scene: 'why-principles-pays-back',
          },
        ]}
      />

      <Variation
        id="scenes-boxed"
        title="14e · A flat drawing per reason, boxed, on paper"
        note="The same three plates in the boxed frame on paper: each cell holds its plate and words at the gutter inset."
      />
      <Reasons
        heading="Better product decisions, before you build"
        headingId="rsn-scenes-boxed"
        arrangement="boxed"
        items={[
          {
            title: 'Evidence before screens',
            body: 'We test your assumptions with real users before they become expensive mistakes.',
            scene: 'why-principles-evidence',
          },
          {
            title: 'What to build first',
            body: 'You leave knowing what to build, what can wait, and why.',
            scene: 'why-principles-build-first',
          },
          {
            title: 'Design that pays back',
            body: 'Every design decision is tied to the adoption, renewals or revenue it should move.',
            scene: 'why-principles-pays-back',
          },
        ]}
      />

      <Variation
        id="home-beside"
        title="15 · Beside, words only: home's three reasons (owner, 30 Oct 2026)"
        note="Home's Why Tcules on the real words. The heading, lead and link in the leading track (5 of 12 from 1024); the three claims read down the trailing one, title (h4) over its sentence with its own links, a stack (48) apart. A section (96) split. No drawing, no figure, no rule: the sentences already name the clients, the live case and the tenures. Below 1024 one column, the head above."
      />
      {words && band ? (
        <Reasons
          arrangement="beside"
          heading={band.headingText}
          headingId="rsn-home-beside"
          lead={lead}
          items={words}
          action={WHY_LINKS}
        />
      ) : null}

      <Variation
        id="beside-stress"
        title="15b · Beside under stress, on tint, with an eyebrow"
        note="The longest copy in the set, four reasons and an eyebrow on tint: the head track holds a long heading and lead, the claims wrap to two lines."
      />
      <Reasons
        arrangement="beside"
        eyebrow="Why Tcules"
        heading="A product design partner for ambitious SaaS teams building what comes next"
        headingId="rsn-beside-stress"
        lead="Tcules has delivered more than 90 projects for clients in 19 countries since 2017. Here is the evidence a product leader can check for themselves, one claim at a time."
        items={items().map(({ title, body }) => ({ title, body }))}
        action={WHY_LINKS}
        surface="tint"
      />

      <Variation
        id="proof-stress"
        title="16 · Proof under stress, on tint"
        note="Every client a typeset name, a long cover figure and label, two figures against three. Every --rsn-proof-* ink is restated on tint."
      />
      <Reasons
        heading="A product design partner for ambitious SaaS teams"
        headingId="rsn-proof-stress"
        items={PROOF_STRESS}
        action={WHY_LINKS}
        surface="tint"
      />

      <Variation
        id="offer-proof"
        title="17 · Offer page: case covers without a figure, one tenure figure"
        note="Offer pages' Why Tcules (owner, 30 Oct 2026): a reason that links a case shows the case's own cover with no figure under it; a stated tenure shows as one figure. One box height for the three. The two actions are one row: an outline button, then a link."
      />
      <Reasons
        heading="Why teams choose Tcules"
        headingId="rsn-offer-proof"
        items={OFFER_PROOF}
        action={
          <CtaRow
            rule={false}
            actions={[
              { label: 'Why teams choose Tcules', href: '#why-tcules' },
              { label: 'Meet the studio', href: '#studio' },
            ]}
          />
        }
      />
    </>
  );
}
