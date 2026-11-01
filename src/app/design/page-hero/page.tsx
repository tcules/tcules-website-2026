import {
  BrandMark,
  Button,
  Cluster,
  Layout,
  Section,
  type MediaImage,
  type SectionSurface,
} from '@/components';
import {
  Breadcrumbs,
  PageHero,
  type HeroArrangement,
  type HeroCredit,
  type HeroDates,
  type HeroMedia,
  type HeroActions,
  type HeroRating,
  type PageHeroProps,
} from '@/patterns';

import { getNavigation } from '@/content';
import { ILLUSTRATION_LEGENDS } from '@/lib/illustration-legends';
import { getKitPhoto } from '@/lib/photos';
import { placeholderImage } from '@/lib/placeholders';
import { ROUTES, authorPath, glossaryPath, servicePath } from '@/lib/routes';
import { heroTrail, type Trail } from '@/lib/trail';

import { specimenStyles as s } from '../_specimen/Specimen';

/* Two portraits for the credited people (byline board G): the leadership placeholders, so the specimen
   shows the overlap without a real photograph. */
const ALICE = {
  name: 'Alice Chen',
  href: '#',
  portrait: placeholderImage('/about', 'leadership', 'jatin-leuva'),
};
const BEN = {
  name: 'Ben Ndlovu',
  href: '#',
  portrait: placeholderImage('/about', 'leadership', 'rakesh-chitroda'),
};

/**
 * PageHero specimen — one variant, one size, SLOT PRESENCE, and (blocks 16–20) the two
 * arrangements against every kind of media.
 *
 * Every hero below is a BAND, at the top level of this page and never nested inside another
 * Section — the component owns its band, so nesting it would inset its content column a second
 * time inside the outer one. That is also why this page does not use the `Specimen` wrapper the
 * primitive routes use: `Specimen` is a Layout, and a Layout cannot contain a band. Each hero's
 * note therefore sits in its own band below it.
 *
 * THIS ROUTE RENDERS MANY h1 ELEMENTS, DELIBERATELY. One h1 per page is the component's hardest
 * constraint and the proving ground is the one route that has to break it: every band here is a
 * real hero and a real hero carries the page's h1. So the spec's §14 check — grep the built HTML
 * for `<h1` and expect exactly one — is written against ROUTE output and this page is excluded
 * from it by inspection. Nothing else on the page mints one: the title you are reading is an h2
 * at h1 scale, via the harness's `titleScale`.
 *
 * There is no state column, and that absence is the specimen. Nothing this component renders
 * responds to a pointer, takes focus or opens, so there is no `active`, no `disabled` and no
 * `expanded` to force — see the "States" block. The Buttons in the bands DO have hover, pressed
 * and focus; they take no props and they are tested on /design/button rather than re-tested here.
 *
 * What a static page cannot show, and where to look instead: the 767 and 375 columns need the
 * window narrowed (nothing in this component changes at either — that is the assertion; the 326
 * image check alone gets a band, "15 · 326", framed to a 390 viewport by the harness), and the
 * 44px touch floor on an action is a rendered hit area rather than a visible box, so the hit-floor
 * band prints the arithmetic beside a dashed 44px outline.
 */

/* ── The copy ─────────────────────────────────────────────────────────────────────
   Real sentences rather than lorem, because the measure, the lead/body split and the balanced
   title can only be judged against text that behaves like text. Twelve paragraphs, so the
   paragraph ladder can reach 2× the corpus maximum without repeating one. */
const PARAS = [
  'A retrofit programme that pays for itself in the first year, measured on the meter rather than in the model. We built the product that proves it, and the one that sells it.',
  'The client had eleven buildings, four metering vendors and no single number anybody trusted. Every quarterly review started by arguing about the data instead of the plan.',
  'We began with the meter. One ingest path, one unit, one timestamp convention, and a reconciliation report that names the gap rather than smoothing it over.',
  'The forecast came second, and it is deliberately conservative: it under-promises on the buildings we know least about, so a portfolio review is a conversation about what to do rather than about whether to believe the tool.',
  'The interface is a single page per building and a single page per portfolio. Everything else is a link out to the evidence.',
  'Rollout took nine weeks, ran alongside the existing reporting rather than replacing it on day one, and the first month of overlap is what earned the switch.',
  'The energy team now closes a quarter in two days instead of three weeks, and the argument about the data has not happened since.',
  'What we would do differently: start the vendor reconciliation earlier. It was the longest pole and we found that out in week five.',
  'The product is now in its second year and has been extended to two more portfolios without a rewrite, which is the only durable test of a data model.',
  'Nothing in it is bespoke to this client except the buildings. The metering adapters, the reconciliation report and the forecast are the parts we bring.',
  'This paragraph exists to push the stack past the corpus maximum, so the measure and the rhythm can be judged at a length no route actually has.',
  'And this one takes it to twelve — 2× the maximum. There is no cap and no truncation: the stack simply grows, and a hero this long is a review comment on a route rather than a behaviour in a component.',
] as const;

const paragraphs = (count: number): readonly [string, ...string[]] => [
  PARAS[0],
  ...PARAS.slice(1, count),
];

const TITLE = 'A building energy product that pays for its own rollout';

/* A short title for the two byline blocks, and the reason is the squint test. Blocks 4 and 5 vary
   ONE row across eight bands; rendered under a two-line title and three paragraphs they read as
   eight copies of the same rectangle, which §15 promised would be "a dense byline matrix" instead.
   A short title and a single paragraph make the byline most of the band, so the thing under test is
   the thing you see. */
const SHORT_TITLE = 'The ConnectX rollout';
const EYEBROW = 'ConnectX · AI-native building energy product';

/* The corpus's longest h1 — a Service L3 name at 57 characters, which is the string edge case 1
   is written about. */
const LONG_TITLE = 'Design Engineering for Regulated Energy Platform Rollouts';

/* Edge case 2: one unbroken token far longer than any track. It must break inside itself rather
   than push a horizontal scrollbar onto the band. */
const URL_PARA =
  'The full naming decision is written up at https://tcules.com/services/product-design/design-systems/token-naming-and-prefix-reservation-policy and is worth reading before proposing a prefix.';

/* Every path through ROUTES, including in the proving ground. `/case-studies` is the canonical
   family and `/work` is explicitly NOT a route — routes.ts records that as a settled decision the
   previous codebase carried unresolved across five files — so a specimen that wrote /work would
   put the question back into a grep. The leaf is composed from the family rather than written out
   for the same reason. */
/* ── The media assets ─────────────────────────────────────────────────────────────
   Three SVGs in public/design, at three intrinsic ratios, because the ratio is the only thing the
   image rendering does NOT normalise: it renders at its own, uncropped, scaled to the column. A
   single 16/9 sample would prove nothing about that and would silently agree with the video's box.

   SVG rather than a screenshot for the same reason every other specimen asset here is: it is a few
   hundred bytes, it is legible under review as text, and it upscales cleanly — which matters for
   the NARROW one, whose whole job is to be upscaled past its intrinsic width. An SVG makes that
   band understate the softness a real 480px raster would show, and the note says so. */
const MEDIA_WIDE: HeroMedia = {
  type: 'image',
  image: {
    src: '/design/hero-sample-wide.svg',
    alt: 'The ConnectX portfolio dashboard: a sidebar of buildings, a table of meter readings and a bar chart comparing forecast against actual consumption.',
    width: 2400,
    height: 1350,
  },
};

const MEDIA_TALL: HeroMedia = {
  type: 'image',
  image: {
    src: '/design/hero-sample-tall.svg',
    alt: 'The single-building view, portrait: a header, a table of readings, a highlighted forecast panel and two grouped charts.',
    width: 900,
    height: 1200,
  },
};

const MEDIA_NARROW: HeroMedia = {
  type: 'image',
  image: {
    src: '/design/hero-sample-narrow.svg',
    alt: 'A 480px-wide thumbnail of the same dashboard, used here to show what happens to an asset narrower than the content column.',
    width: 480,
    height: 270,
  },
};

/* Blender's Big Buck Bunny — a Creative Commons film, chosen because it is genuinely free to embed
   and has been at the same id for years, which is what a proving ground needs from a third party.
   If YouTube ever answers with "Video unavailable", the band still does its whole job: the ratio,
   the hairline and the four surface columns are ours and are what this block is looking at. */
const MEDIA_VIDEO: HeroMedia = {
  type: 'youtube',
  id: 'aqz-KE-bpKQ',
  title: 'Big Buck Bunny — Blender Foundation, Creative Commons',
};

/* ── The media kinds (blocks 17–21) ─────────────────────────────────────────────
   The brand framework's own assets, the same files /design/media proves Media against, each
   carrying the kind ch05 would give it — because in a hero the KIND decides the edge (Media's
   job) and the arrangement decides the width (this component's). The capture and the flow cut-out
   carry derived widths, so their srcset rows choose between real files. None is a 2560 master
   (ruling M2): the portrait in particular is 292 square and upscales visibly in a 588 track, which
   is the supply fault the note on it names, not a rendering one. */
const DERIVED = (base: string, ext: string) =>
  [320, 652, 1240].map((width) => ({ src: `/design/media/${base}-${width}.${ext}`, width }));

const CAPTURE: MediaImage = {
  src: '/design/media/capture-listing.webp',
  alt: 'Listing editor with four bullet fields on the left and an AI assistance panel of benefit chips on the right.',
  width: 1436,
  height: 883,
  kind: 'capture',
  sources: DERIVED('capture-listing', 'jpg'),
};

const CUT_OUT: MediaImage = {
  src: '/design/media/cutout-flow.png',
  alt: 'Workflow node: an input connected to an AI feature card with a provider field, a file field and an output.',
  width: 1796,
  height: 1112,
  kind: 'cut-out',
  sources: DERIVED('cutout-flow', 'png'),
};

/* Portrait-ratio product part (902 × 1088), for the tall row of block 19. */
const CUT_OUT_TALL: MediaImage = {
  src: '/design/media/cutout-node.png',
  alt: 'A single workflow node card: a header, three configured fields and an output handle.',
  width: 902,
  height: 1088,
  kind: 'cut-out',
};

/* alt="" on purpose: an illustration banner is named by the h1 beside it, so the image adds no
   information the page does not already carry (ch05 § 9a, § 7). Never omitted, never "image". */
const ILLUSTRATION: MediaImage = {
  src: '/design/media/illustration-seam.svg',
  alt: '',
  width: 881,
  height: 544,
  kind: 'illustration',
};

const PHOTOGRAPH: MediaImage = {
  src: '/design/media/photograph-portrait.png',
  alt: 'Portrait, head and shoulders, facing the camera in available light.',
  width: 292,
  height: 292,
  kind: 'photograph',
};

const STRESS_TALL: MediaImage = {
  src: '/design/media/stress-tall.svg',
  alt: 'A settings column of twelve stacked rows above a footer panel.',
  width: 400,
  height: 2000,
  kind: 'capture',
};

const asHero = (image: MediaImage): HeroMedia => ({ type: 'image', image });

/* One row per media case the arrangements are proved against, in the order ch05 § 1 leads them. */
const MEDIA_CASES: readonly { key: string; label: string; media?: HeroMedia; note: string }[] =
  [
    {
      key: 'none',
      label: 'no media',
      note: 'The no-visual hero — 97 of 129 routes. Both arrangements render the same single column, because there is nothing to put beside the copy: `beside` with no media is not an error, it is the family member that has no image.',
    },
    {
      key: 'illustration',
      label: 'illustration',
      media: asHero(ILLUSTRATION),
      note: 'Service line, how-we-work, audit, article (VAP). Never boxed — no hairline, no panel, no shadow — so the drawing sits on the band’s own ground and its edges are its own lines. alt="" because the h1 names what it stands for (ch05 § 9a).',
    },
    {
      key: 'cut-out',
      label: 'cut-out',
      media: asHero(CUT_OUT),
      note: 'Case-study banner and Matter / Future Interfaces Lab. No edge: the silhouette is the frame, and the band shows through the alpha (ch05 § 2a).',
    },
    {
      key: 'capture',
      label: 'capture',
      media: asHero(CAPTURE),
      note: 'A flat screen, only where the whole layout is the subject (ch05 § 2). Its one edge cue is Media’s hairline in the surface’s rule ink. An image with no kind renders exactly like this (M3).',
    },
    {
      key: 'photograph',
      label: 'photograph',
      media: asHero(PHOTOGRAPH),
      note: 'About and careers: “a photograph as a block beside or below the h1, never behind it” (ch05 § 6a). No edge, radius 0. This asset is 292 square and upscales — a supply fault, visible on purpose.',
    },
    {
      key: 'youtube',
      label: 'YouTube',
      media: MEDIA_VIDEO,
      note: 'Podcast and event. The one media with a box of its own — 16/9, because that is what YouTube serves — and the hero’s own hairline. Lazy, never the LCP.',
    },
  ];

const ARRANGEMENTS: readonly HeroArrangement[] = ['stacked', 'beside', 'watch'];

/* CU04's budgets, at the floor and the ceiling: H1 4–10 words, hero support 15–35. */
const CU_TITLE_MIN = 'Design systems, shipped properly';
const CU_SUPPORT_MIN =
  'We build tokens, components and documentation inside your team, so the system ships with you.';
const CU_TITLE_MAX = 'Design systems that ship with the product, not after it';
const CU_SUPPORT_MAX =
  'We build the tokens, the components and the documentation inside your delivery team, so every release carries the system forward instead of leaving it behind, and nobody has to choose between consistency and speed again.';

const CASE_STUDY = `${ROUTES.caseStudies}/connectx`;

const ONE_ACTION = [{ label: 'Read the case study', href: CASE_STUDY }] as const;
/* The hero's first action is the page's one main action, the blue solid; the second is its blue
   ghost partner (r7-buttons, 8 Oct 2026 — there is no ink solid, whatever the action is). */
const TWO_ACTIONS = [
  { label: 'Read the case study', href: CASE_STUDY },
  { label: 'Talk to the team', href: ROUTES.contact },
] as const;

const TRAIL = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Case studies', href: ROUTES.caseStudies },
  { label: 'ConnectX', href: CASE_STUDY },
] as const;

/* The eyebrow a hero under TRAIL may carry: a category and a format, neither of which the trail
   says. EYEBROW cannot stand there — it opens with 'ConnectX', the trail's last crumb, and the
   deliberately wrong block below uses it for exactly that reason. */
const TRAIL_EYEBROW = 'Climate tech · Platform rebuild';

/* Two eyebrows against TRAIL's section crumb, 'Case studies'. The first holds its word and adds
   what the trail cannot say, so it stands; the second is the crumb alone, so it is a repeat. */
const STRUCTURE_EYEBROW = 'Case study · Fintech';
const BARE_STRUCTURE_EYEBROW = 'Case study';

/* A page whose only name IS its h1 — a glossary term. Its whole trail ends in that name, and
   heroTrail drops the leaf because the title says it, so the trail ends at the parent. */
const TERM = 'Design intent';
const TERM_TRAIL = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Glossary', href: ROUTES.glossary },
  { label: TERM, href: glossaryPath('design-intent') },
] as const;

/* The one render every hero below hands to heroTrail. */
const crumbs = (trail: Trail) => <Breadcrumbs {...trail} />;

/* A real service-line illustration, so block 9's service hero is the shape the six pages render. */
const SERVICE_ILLUSTRATION: MediaImage = {
  src: '/illustrations/services/product-design.paper.svg',
  alt: '',
  width: 962,
  height: 714,
  kind: 'illustration',
};

const SERVICE_TRAIL = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Services', href: ROUTES.services },
  { label: 'Product Design', href: servicePath('product-design') },
] as const;

/* Block 22: the score in the eyebrow's place, each frame where it belongs and once where it does not
   (the plain frame on the centred axis), so the reason for the default is visible. */
const RATING_CASES: readonly {
  key: string;
  title: string;
  frame: 'pill' | 'plain';
  note: string;
  props: Pick<PageHeroProps, 'arrangement' | 'media' | 'trail' | 'surface'>;
}[] = [
  {
    key: 'stacked-pill',
    title: 'stacked',
    frame: 'pill',
    note: 'The default frame on the default arrangement. The pill takes the eyebrow row, 24 over the title; the wrapper stops the Layout track stretching it to the column.',
    props: {},
  },
  {
    key: 'stacked-plain',
    title: 'stacked',
    frame: 'plain',
    note: 'No outline and no inline padding, so the star starts on the column edge like any eyebrow. The block padding stays, so the link target is still taller than 24.',
    props: {},
  },
  {
    key: 'beside-plain',
    title: 'beside a photograph',
    frame: 'plain',
    note: 'The doodle.com placement: the photograph and the solid are the band’s edged objects, and the score is one more line of label type, top-aligned with the photograph.',
    props: {
      arrangement: 'beside',
      media: {
        type: 'image',
        ratio: '5/4',
        image: getKitPhoto('studio-pair-at-monitor', { alt: '' }),
      },
    },
  },
  {
    key: 'trail-pill',
    title: 'under a trail',
    frame: 'pill',
    note: 'Under Home / Case studies / ConnectX. The score is the one eyebrow that cannot repeat a crumb, so no warning can fire: it is a claim with a source, not a name.',
    props: { trail: heroTrail(TRAIL, CU_TITLE_MIN, crumbs) },
  },
  {
    key: 'centred-pill',
    title: 'centred',
    frame: 'pill',
    note: 'Centred, the pill is an object on the axis, centred by the Layout’s justify-items.',
    props: { arrangement: 'centred' },
  },
  {
    key: 'centred-plain',
    title: 'centred',
    frame: 'plain',
    note: 'Legal, and shown so the default is argued: without an edge the star and the mark are different widths, and the line reads off the axis by a few px. Prefer the pill here.',
    props: { arrangement: 'centred' },
  },
  {
    key: 'ink-pill',
    title: 'on ink',
    frame: 'pill',
    note: 'RatingBadge reads its ground from the hero’s data-surface: the star lifts to brandeis-300 and the rule to neutral-800, with no prop.',
    props: { surface: 'ink' },
  },
];

/**
 * The note for the band above it, in its own band on the same ground. Below rather than above,
 * because a hero gives 96 in both directions: putting the note underneath makes the seam you read
 * as "this note belongs to that hero" the smaller of the two.
 */
function Note({
  title,
  note,
  surface = 'paper',
}: {
  title: string;
  note: string;
  surface?: SectionSurface;
}) {
  return (
    <Section surface={surface}>
      <Layout rowGap="tight">
        <p className={s.specTitle}>{title}</p>
        <p className={s.specNote}>{note}</p>
      </Layout>
    </Section>
  );
}

/* §4's slot table, printed so a reader meets the argument that collapsed three arrangements into
   one before they meet any rendering. */
const SLOT_TABLE = [
  { part: 'eyebrow', left: 'filled on 18', caseStudy: 'filled on 1', article: 'filled on 13' },
  { part: 'title', left: 'always', caseStudy: 'always', article: 'always' },
  { part: 'lead + body', left: 'always', caseStudy: 'always', article: 'always' },
  { part: 'byline', left: 'never', caseStudy: 'never', article: 'always' },
  { part: 'extras', left: '1 (/contact)', caseStudy: 'never', article: 'never' },
  { part: 'actions', left: '0 / 1 / 2', caseStudy: '0', article: '0 / 1' },
  { part: 'media', left: 'some families', caseStudy: 'banner', article: 'illustration' },
] as const;

/* The four optional slots, as a type. Annotated rather than inferred with `as const`, for two
   reasons: the literals below are then checked against the real prop types at the point they are
   written, and a spread of this shape after `title` and `body` cannot widen either of them to
   undefined the way a Partial<PageHeroProps> would. */
type HeroSlots = Pick<PageHeroProps, 'eyebrow' | 'credits' | 'dates'> & {
  actions?: HeroActions;
};

/* Block 2 — the slot-presence ladder, each rung labelled with its corpus count. */
const LADDER: readonly { key: string; title: string; note: string; props: HeroSlots }[] = [
  {
    key: 'bare',
    title: 'Bare title and body — 113 routes',
    note: 'The default, and the arrangement 13 of the 14 case studies use byte-for-byte. No eyebrow, no byline, no extras, no actions: the stack has one child, so it shows no 48px seam at all.',
    props: {},
  },
  {
    key: 'eyebrow',
    title: '+ eyebrow — 32 routes',
    note: 'One slot filled. The eyebrow sits 24 above the title, not 8 — 8 under a 12px label reads as a caption stuck to the title; 24 reads as a label above one. It is uppercased by the stylesheet, so the frontmatter keeps "ConnectX · AI-native building energy product" as authored.',
    props: { eyebrow: EYEBROW },
  },
  {
    key: 'one-action',
    title: '+ one action — 59 routes have at least one',
    note: 'One action renders the blue solid Button — the page\u2019s one main action — no arrow, and no partner. The second emphasis is a consequence of a second array entry, not a slot waiting to be filled.',
    props: { actions: ONE_ACTION },
  },
  {
    key: 'two-actions',
    title: '+ two actions',
    note: 'Position decides emphasis: first the blue solid with no arrow, second its blue ghost partner with the trailing arrow (owner, 7 Oct 2026; the ink solid retired 8 Oct). Both are size="md" with extendHitArea, both anchors. Four actions is a compile error, not a runtime cap.',
    props: { actions: TWO_ACTIONS },
  },
  {
    key: 'audit',
    title: '+ eyebrow and two actions — the audit hero, 6 routes',
    note: 'Two independent slots filled at once, which is the whole of §4: this is not a third arrangement, it is the two optional slots that differentiate the corpus both being present.',
    props: { eyebrow: EYEBROW, actions: TWO_ACTIONS },
  },
  {
    key: 'article',
    title: '+ credits and dates — the article hero, 15 routes',
    note: 'The byline appears as a <dl>, 48 below the copy. Each pair is a key over its value at 4px, and pair-to-pair is 24 — a six-fold difference, which is why the row needs no rule, no dot and no separator character.',
    props: {
      credits: [{ role: 'author', people: [ALICE, BEN] }],
      dates: { published: '2026-03-03', modified: '2026-06-12' },
    },
  },
  {
    key: 'both',
    title: '+ eyebrow, credits and dates — 1 route',
    note: 'The podcast-with-a-client case, and the band that proves the two slots are independent rather than two settings of one. No new prop and no new code renders it.',
    props: {
      eyebrow: EYEBROW,
      credits: [
        { role: 'host', people: [ALICE] },
        { role: 'guest', people: [BEN, { name: 'Cara Whitfield' }] },
      ],
      dates: { published: '2026-03-03' },
    },
  },
];

/* Block 4 — the credit shapes, including the one the type allows and no page uses. */
const CREDIT_SHAPES: readonly {
  key: string;
  title: string;
  note: string;
  credits: readonly HeroCredit[];
}[] = [
  {
    key: 'one-author',
    title: 'One author',
    note: 'One group, one portrait, one linked name. "Written by" is read to a screen reader and hidden on screen: the face and the name already say it (board G).',
    credits: [{ role: 'author', people: [ALICE] }],
  },
  {
    key: 'two-authors',
    title: 'Two authors',
    note: 'The portraits overlap and the names join with "and". One <dd> for the group, not one per person.',
    credits: [{ role: 'author', people: [ALICE, BEN] }],
  },
  {
    key: 'host-guest',
    title: 'Host and one guest',
    note: 'Two groups, two labels: "Hosted by" and "With". The labels come from the role and never change with the count.',
    credits: [
      { role: 'host', people: [ALICE] },
      { role: 'guest', people: [BEN] },
    ],
  },
  {
    key: 'host-guests',
    title: 'Host and three guests',
    note: 'Three or more names are comma-separated with "and" before the last, in one <dd>. A guest without a portrait shows initials in an outlined disc beside those who have one.',
    credits: [
      { role: 'host', people: [ALICE] },
      { role: 'guest', people: [BEN, { name: 'Cara Whitfield' }, { name: 'Dev Anand' }] },
    ],
  },
  {
    key: 'author-detail',
    title: 'Author without a portrait, and a reading time',
    note: 'No portrait, so their initials in the outlined disc (owner, 1 Nov 2026: every byline carries a face), then the dates and `readingTime`. Who they are sits after the content, in Contributors (board G).',
    credits: [{ role: 'author', people: [{ name: 'Rakesh Chitroda' }] }],
  },
  {
    key: 'author-reviewer',
    title: 'Author and reviewer — the shape that exists in the type and on no page',
    note: 'Shown so that its absence on all 15 long-read routes is visibly a choice rather than an oversight. `reviewer` is a role inside credits, so an absent reviewer is an absent group: no label, no value, no space. A separate reviewer prop would be a "Reviewed by" hole waiting for somebody to pass an empty array.',
    credits: [
      { role: 'author', people: [{ name: 'Alice Chen' }] },
      { role: 'reviewer', people: [{ name: 'Ben Ndlovu' }] },
    ],
  },
];

/* Block 5 — the date shapes. The third one is the assertion. */
const DATE_SHAPES: readonly { key: string; title: string; note: string; dates: HeroDates }[] = [
  {
    key: 'published',
    title: 'Published only',
    note: 'One pair. Rendered as <time datetime="2026-03-03">3 March 2026</time>, formatted in UTC so the server and every browser agree.',
    dates: { published: '2026-03-03' },
  },
  {
    key: 'updated-only',
    title: 'Updated only',
    note: 'A page that states only when it was last updated: one "Updated" pair and no invented publish date.',
    dates: { modified: '2026-10-07' },
  },
  {
    key: 'both',
    title: 'Published and modified',
    note: 'Two pairs, in that order, labelled "Published" and "Updated".',
    dates: { published: '2026-03-03', modified: '2026-06-12' },
  },
  {
    key: 'equal',
    title: 'Published and modified EQUAL — must render one pair, not two',
    note: 'Both dates are 2026-03-03. A modified date equal to the published one is not a second fact — it is the CMS stamping a timestamp on save — so it renders nothing. Count the pairs: there must be one.',
    dates: { published: '2026-03-03', modified: '2026-03-03' },
  },
];

/* Block 6 — printed in place of the state column this component cannot have. */
const STATE_REFERENCE = [
  {
    state: 'rest',
    what: 'The only rendering this component has. Six inks, three families, one measure per part. Given the same props it renders the same pixels at every moment of its life.',
  },
  {
    state: 'hover / pressed',
    what: 'Nothing in the hero responds to a pointer. Point at the title, the eyebrow or a credit and nothing moves — that is the assertion, not a missing rule. The Buttons do respond, through --btn-*, which is their spec’s business.',
  },
  {
    state: 'focus',
    what: 'Nothing the component renders is focusable, so it declares no ring token and paints no ring. Tab through a band: focus goes to any control in extras, then the first action, then the second, in DOM order, and the rings you see are Button’s.',
  },
  {
    state: 'held / disabled / expanded',
    what: 'None of the three can be expressed. A hero is never "the current one" — there is one per page, so there is nothing for it to be current among; a page opening cannot be unavailable; and nothing here opens, so there is no aria-expanded and no idref pointing at a panel that is not rendered.',
  },
] as const;

/* Block 7 — §6's per-surface paragraph, beside the band it describes. */
const SURFACES: readonly { surface: SectionSurface; note: string }[] = [
  {
    surface: 'paper',
    note: 'The baseline and a three-step ramp: the title at neutral-900 (14.62:1) is the loudest ink on the page, the lead and the byline values sit together at neutral-800 (11.81:1), the body drops to neutral-700 (8.14:1), and the two mono labels sit quietest at neutral-600 (4.92:1) — which they can afford because mono, semibold and the eyebrow tracking already make them read louder than their size. Nothing here is blue: blue means clickable and appears on nothing that is not, so the only blue in the band is inside the Button.',
  },
  {
    surface: 'tint',
    note: 'THE ONE CELL A FUTURE REVIEWER WILL WANT TO LIGHTEN — and both parts it moves are on this band, the eyebrow above the title and the credit keys below the copy. The title and the lead hold their ramp steps, losing about a point each to the deeper ground. The one real move is at the quiet end: neutral-600 on paper-deep computes 4.39:1 and FAILS the 4.5 floor, so the eyebrow and the credit keys step to neutral-700 (7.27:1) — where the body paragraphs already are. On tint, and only on tint, those three parts share an ink; they stay distinguishable by family, case and tracking, which is the rule anyway. Leaving 600 in place because it is "nearly" 4.5 is exactly the class of failure a deltas-only table produces.',
  },
  {
    surface: 'ink',
    note: 'The direction inverts and the ramp gets more room. Title to white (17.26:1), lead and byline values to neutral-100 (14.47:1), body to neutral-300 (11.07:1), mono labels to neutral-400 (8.05:1) — the same step Breadcrumbs lifts its links to on this ground, so a trail and an eyebrow standing 32 apart are the same grey rather than two greys. Every cell here is at least 8:1, which matters on the surface where a serif title is most at risk of looking thin.',
  },
  {
    surface: 'blue',
    note: 'The ramp runs out and the three-step structure survives on the last three values it has: white (6.23:1), brandeis-50 (5.57:1), brandeis-100 (4.91:1) — the tightest cells in the table, and the reason nothing quieter than 100 is allowed here, since 200 is already 3.78:1. One consequence to accept knowingly: on blue the eyebrow and the body paragraphs are the same ink, as they are on tint. Blue and tint both lose the eyebrow’s colour distinction and keep its typographic one.',
  },
];

export default async function PageHeroSpecimenPage() {
  const { footer } = await getNavigation();
  const source = footer.brand.rating;
  const rating: HeroRating | undefined = source && {
    score: source.score,
    platform: source.platform,
    href: source.href,
    mark: source.mark,
  };
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h2 className={s.titleScale}>PageHero</h2>
          <p>
            The opening block of a page: an optional ancestor trail, one <code>h1</code>, an
            optional eyebrow above it, one to six paragraphs of lead copy, an optional byline of
            credits and dates, an optional caller block, nought to two actions and — last — an
            optional image or YouTube embed. It paints its own band and it is the first thing
            inside <code>main</code> on all 129 routes.
          </p>
          <p>
            <strong>This route renders many h1 elements on purpose.</strong> Every band below is
            a real hero, and a real hero carries the page&apos;s h1 — so the one-h1 rule is
            checked against built route output, not against the proving ground. The title above
            is an <code>h2</code> at h1 scale so the page adds none of its own.
          </p>
          <p>
            One variant and one size. The three page families the brief described — text-left,
            article, case study — are one arrangement of the <em>copy</em>: they differ only in
            which optional slot is filled. Where the <em>media</em> goes is the one arrangement
            choice, <code>arrangement=&quot;stacked | beside&quot;</code>, made by the page
            template per family (ruling H1). Blocks 16–21 prove it against every media kind.
          </p>
        </Layout>
      </Section>

      {/* ── 1 · The matrix ─────────────────────────────────────────────────────── */}
      <Section>
        <Layout rowGap="block">
          <p className={s.specTitle}>1 · The matrix — 1 variant × 1 size</p>
          <p className={s.specNote}>
            Printed rather than rendered, there being one cell. Below it is §4&apos;s slot
            table: the three briefed arrangements laid against each other by part. No row
            differs in ARRANGEMENT — every difference is a slot that is filled or is not.
          </p>
          <Layout rowGap="tight">
            <Layout columns={[2, 1, 1, 1]} colGap="gutter" rowGap="tight">
              <p className={s.eyebrow}>part</p>
              <p className={s.eyebrow}>text-left · 100</p>
              <p className={s.eyebrow}>case study · 14</p>
              <p className={s.eyebrow}>article · 15</p>
            </Layout>
            {SLOT_TABLE.map((row) => (
              <Layout key={row.part} columns={[2, 1, 1, 1]} colGap="gutter" rowGap="tight">
                <p className={s.specNote}>
                  <code>{row.part}</code>
                </p>
                <p className={s.specNote}>{row.left}</p>
                <p className={s.specNote}>{row.caseStudy}</p>
                <p className={s.specNote}>{row.article}</p>
              </Layout>
            ))}
          </Layout>
          <p className={s.specNote}>
            The two slots that do the differentiating — <code>eyebrow</code> and{' '}
            <code>byline</code> — are independent, so what can render is a 2 × 2 of slot
            presence rather than a three-way switch. A{' '}
            <code>variant=&quot;caseStudy&quot;</code> would have been a name for a page family
            styled identically to the default, and the first thing it would have done is make
            the eyebrow a consequence of the variant.
          </p>
        </Layout>
      </Section>

      {/* ── 2 · The slot-presence ladder ───────────────────────────────────────── */}
      {LADDER.map((rung) => (
        <div key={rung.key}>
          <PageHero title={TITLE} body={paragraphs(3)} {...rung.props} />
          <Note title={`2 · ${rung.title}`} note={rung.note} />
        </div>
      ))}

      {/* ── 2b · The one-word title at the mark scale ──────────────────────────── */}
      <div>
        <PageHero
          title="Articles"
          titleSize="mark"
          body={['Essays and field notes from building complex products.']}
          tags={['42 published', 'Latest 15 Oct 2026']}
          texture
        />
        <Note
          title="2b · titleSize mark — a one-word title"
          note="--text-mark (136 · 104 · 64): the word is the band's graphic; the end-fade widens toward it, and below 1024 the corner field keeps the texture on a phone."
        />
      </div>

      {/* ── 2c · A long title read across the split ──────────────────────────────── */}
      <div>
        <PageHero
          title="UI/UX design services and software development for new and established products"
          titleAcross
          body={paragraphs(2)}
          arrangement="beside"
          media={{
            type: 'image',
            image: getKitPhoto('studio-pair-at-monitor', { alt: '' }),
          }}
        />
        <Note
          title="2c · titleAcross — a long title over the beside split"
          note="A title that would set five or more display lines in half the column (CorpusHero's estimate) reads across it at display, and the lead, actions and figures sit beside the media under it (review 29 Oct, /services)."
        />
      </div>

      {/* ── 3 · The paragraph ladder ───────────────────────────────────────────── */}
      {([1, 2, 3, 4, 5, 6, 12] as const).map((count) => (
        <div key={count}>
          <PageHero title={TITLE} body={paragraphs(count)} />
          <Note
            title={`3 · ${count} paragraph${count === 1 ? '' : 's'}`}
            note={
              count === 1
                ? '34 routes. One paragraph renders as a single lead <p> (--text-lead-lg, 18; block 23) and copy shows no seam at all.'
                : count === 12
                  ? '2× the corpus maximum, and there is no route like it. No cap, no truncation, no warning: the lead role still applies to the first paragraph only, so this renders as a lead and eleven body paragraphs and looks exactly like what it is — a page whose opening should have been a section. That is a review comment on a route, not a behaviour here.'
                  : `Corpus counts: 1 → 34, 2 → 58, 3 → 10, 4 → 25, 5 → 1, 6 → 1. The lead stays at --text-lead-lg (18, block 23) and everything under it at --text-body (16); the measure does NOT narrow as the copy grows, because a hero that tightened its measure at six paragraphs would turn its longest pages into ribbons. Note the lead's line length against the paragraphs below it: the lead takes --measure-lead (a ch measure, so it follows the lead’s size) and the paragraphs --measure-body (68ch, 666px at 16), so the lead is a short, large block and the body a long, small one — two shapes rather than one ragged column. Before 28 Sep both took 68ch and the lead ran 832px.`
            }
          />
        </div>
      ))}

      {/* ── 4 · The credit shapes ──────────────────────────────────────────────── */}
      {CREDIT_SHAPES.map((shape) => (
        <div key={shape.key}>
          <PageHero
            title={SHORT_TITLE}
            body={paragraphs(1)}
            credits={shape.credits}
            dates={{ published: '2026-03-03' }}
            readingTime={shape.key === 'author-detail' ? '10 min' : undefined}
          />
          <Note title={`4 · ${shape.title}`} note={shape.note} />
        </div>
      ))}

      {/* ── 5 · The date shapes ────────────────────────────────────────────────── */}
      {DATE_SHAPES.map((shape) => (
        <div key={shape.key}>
          <PageHero
            title={SHORT_TITLE}
            body={paragraphs(1)}
            credits={[{ role: 'author', people: [{ name: 'Alice Chen' }] }]}
            dates={shape.dates}
          />
          <Note title={`5 · ${shape.title}`} note={shape.note} />
        </div>
      ))}

      {/* ── 5b · The record as figures, inside the hero (home round 3) ──────────── */}
      <PageHero
        title={TITLE}
        body={paragraphs(1)}
        eyebrow={EYEBROW}
        actions={ONE_ACTION}
        arrangement="beside"
        media={{
          type: 'image',
          image: getKitPhoto('studio-pair-at-monitor', { alt: '' }),
          ratio: '5/4',
        }}
        stats={[
          { value: '2017', label: 'Founded' },
          { value: '90+', label: 'Projects' },
          { value: '19', label: 'Countries with clients' },
        ]}
      />
      <Note
        title="5b · stats — the record as figures, inside the hero"
        note="Owner, home round 3 (11 Oct 2026): the facts band under the home hero moved INTO the hero. Two to four Stats at the md step, one row at every width (three ~87 tracks at 390), their own block a stack (48) under the actions (round 4: at 16 they read as part of the button's group), each opening on its hairline and blue mark. It replaced a tint band of its own (~330 at 1440)."
      />
      <PageHero
        title={SHORT_TITLE}
        body={paragraphs(1)}
        actions={TWO_ACTIONS}
        stats={[
          { value: '12', unit: 'weeks', label: 'From the first workshop to a release' },
          { value: '4.8', label: 'Average client rating across 13 reviews' },
        ]}
      />
      <Note
        title="5b · stats on a text hero — two figures, one with a unit"
        note="The same row under a hero with no media; a unit sits on the figure's baseline in the mono label voice."
      />

      {/* ── 6 · States: none to force ──────────────────────────────────────────── */}
      <PageHero title={TITLE} body={paragraphs(2)} eyebrow={EYEBROW} actions={TWO_ACTIONS} />
      <Section>
        <Layout rowGap="block">
          <p className={s.specTitle}>6 · States — and why there is no state column here</p>
          <p className={s.specNote}>
            Rest is what the band above renders, and it needs no prop. NO STATE IN THIS
            COMPONENT CAN BE FORCED FROM OUTSIDE, because there are none: zero{' '}
            <code>--hero-*</code> state tokens exist, and that is the assertion that this
            component&apos;s rendering is a function of its props alone. Do not go looking for a
            control column that should not exist.
          </p>
          <Layout rowGap="text">
            {STATE_REFERENCE.map((row) => (
              <Layout key={row.state} columns={[1, 3]} colGap="gutter" rowGap="tight">
                <p className={s.eyebrow}>{row.state}</p>
                <p className={s.specNote}>{row.what}</p>
              </Layout>
            ))}
          </Layout>
        </Layout>
      </Section>

      {/* ── 7 · Four surfaces, identical markup, one prop apart ─────────────────── */}
      {SURFACES.map((entry) => (
        <div key={entry.surface}>
          {/* Every one of the six inks, on every surface, in one band. The byline is here
              deliberately and it was missing at first: without credits and dates, --hero-key-ink
              and --hero-value-ink — 2 of the 6 tokens, 6 of the 24 cells — rendered on paper and
              nowhere else, and the most-argued cell in the whole token layer is one of them. The
              tint block steps the eyebrow AND the credit keys to neutral-700 because neutral-600
              on paper-deep is 4.39:1, and the key half of that fix could not be looked at. */}
          <PageHero
            surface={entry.surface}
            title={TITLE}
            body={paragraphs(3)}
            eyebrow={EYEBROW}
            credits={[{ role: 'author', people: [ALICE, BEN] }]}
            dates={{ published: '2026-03-03', modified: '2026-06-12' }}
            actions={TWO_ACTIONS}
          />
          <Note
            surface={entry.surface}
            title={`7 · Surface · ${entry.surface}`}
            note={entry.note}
          />
        </div>
      ))}

      {/* ── 8 · The nested-surface bands ────────────────────────────────────────
          Not nested inside a Section — these are SIBLING bands. The hero paints its own ground,
          so a tint hero standing between two ink bands is the real composition rather than an
          approximation of it, and the only thing that decides which column it reads is the
          data-surface its own Section writes. */}
      <Section surface="ink">
        <p className={s.specNote}>An ink band above.</p>
      </Section>
      <PageHero surface="tint" title={TITLE} body={paragraphs(2)} eyebrow={EYEBROW} />
      <Section surface="ink">
        <p className={s.specNote}>An ink band below.</p>
      </Section>
      <Note
        title="8 · Nested surface · a tint hero between two ink bands"
        note="This hero reads the TINT column, not ink's: lead at neutral-800 on paper-deep (10.54:1), eyebrow and keys at neutral-700 (7.27:1), title at neutral-900 (13.06:1). Had the tint block carried only its deltas from paper it would have inherited ink's values for whatever it omitted and stranded neutral-100 on this light ground at 1.13:1 — which is a measured failure elsewhere in this system, not a hypothetical one. The repetition in the token layer is the fix."
      />

      <Section>
        <p className={s.specNote}>A paper band above.</p>
      </Section>
      <PageHero surface="ink" title={TITLE} body={paragraphs(2)} eyebrow={EYEBROW} />
      <Section>
        <p className={s.specNote}>A paper band below.</p>
      </Section>
      <Note
        title="8 · Nested surface · an ink hero between two paper bands"
        note="The same test in the other direction: white title (17.26:1), neutral-100 lead (14.47:1), neutral-400 eyebrow (8.05:1). The seam above and below is two 96px paddings meeting, which is what every band-to-band seam on a real route looks like."
      />

      {/* ── 9 · The trail inside the hero ──────────────────────────────────────── */}
      {(['paper', 'tint', 'ink', 'blue'] as const).map((surface) => (
        <PageHero
          key={surface}
          surface={surface}
          trail={heroTrail(TRAIL, TITLE, crumbs)}
          title={TITLE}
          body={paragraphs(2)}
          eyebrow={TRAIL_EYEBROW}
        />
      ))}
      <Note
        title="9 · The trail inside the hero — paper, tint, ink and blue, above"
        note="Breadcrumbs in the trail slot: 96 of the hero's own padding above it, 32 (gutter) from the trail to the eyebrow. One band, so the trail reads the hero's ground and a two-tone seam can no longer be written — the four bands above pass nothing to the crumbs but the items. The eyebrow here is a category and a format the trail cannot say, which is the only kind an eyebrow under a trail may carry."
      />

      <PageHero
        arrangement="beside"
        trail={heroTrail(
          SERVICE_TRAIL,
          'Finished screens can hide an unresolved product.',
          crumbs,
        )}
        title="Finished screens can hide an unresolved product."
        body={[
          'Tcules takes responsibility for the product beneath the screens: who does what, the records and rules behind it, how it behaves, and what to learn first.',
        ]}
        actions={[
          { label: 'Start a project', href: ROUTES.contact },
          { label: 'Start with a UX Product Audit', href: ROUTES.audits },
        ]}
        media={{
          type: 'image',
          image: SERVICE_ILLUSTRATION,
          cut: ILLUSTRATION_LEGENDS[SERVICE_ILLUSTRATION.src],
        }}
      />
      <Note
        title="9 · The service hero — trail, no eyebrow, one solid and its ghost partner, illustration centred"
        note="The locked [1, 1] shape (ruling H2) as the six service pages render it (visual-direction § 2.3–2.4). No eyebrow: the last crumb is the service's name. A title of at most 48 characters on three lines, a lead of at most 26 words, the solid action as the band's one Accent and the illustration as its Field; the second action is the solid's ghost partner, with the arrow. The illustration is centred on the copy because it has no box to share an edge with. At 1470 × 830 the h1 starts at 222 and the band ends at or above 823."
      />

      <PageHero
        trail={heroTrail(TERM_TRAIL, TERM, crumbs)}
        title={TERM}
        body={[
          'The decision a design records about how the product should behave, as distinct from how one screen of it looks.',
        ]}
      />
      <Note
        title="9 · A page whose h1 is its name — the trail ends at the parent"
        note="The page's whole trail is Home / Glossary / Design intent, and its h1 is 'Design intent'. A current crumb would say the headline 32px above it, and a headline-length one wraps on a phone, so heroTrail drops the leaf when it repeats the title and Breadcrumbs renders endsWith='parent': every crumb is a link and none is aria-current, because the h1 is the current page. The same rule ends an article, an audit, a tool, a case study and a legal page at its parent; a top-level page whose h1 is its name is left a lone 'Home' and gets no trail at all."
      />

      <PageHero
        trail={heroTrail(TRAIL, TITLE, crumbs)}
        title={TITLE}
        body={paragraphs(1)}
        eyebrow={EYEBROW}
      />
      <Note
        title="9 · Deliberately WRONG — an eyebrow that repeats the last crumb"
        note="The eyebrow opens with 'ConnectX' 32px under a trail that ends in 'ConnectX', so the crumb reads twice even though the two strings are not equal. In development PageHero logs a warning naming the eyebrow, and the band still renders, so the fault is visible on the page as well as in the console. The comparison is repeatsTrail from @/lib/trail, the same one the routes' eyebrowBesideTrail uses: an eyebrow repeats a crumb that names something when it says the crumb's words as a whole-word phrase, and repeats the site's structure (Home, a section index such as Case studies) only when it equals it, with zero-width characters, punctuation, case and plurals ignored throughout. So 'Product Design specialist' under 'Product design' and a bare 'Case study' under 'Case studies' are caught, while 'Case study · Fintech' under 'Case studies' and 'Designer' under 'Design' are not. The fix is to drop the eyebrow, or to replace it with a category or format the trail cannot say, like block 9's 'Climate tech · Platform rebuild'."
      />

      <PageHero
        trail={heroTrail(TRAIL, TITLE, crumbs)}
        title={TITLE}
        body={paragraphs(1)}
        eyebrow={STRUCTURE_EYEBROW}
      />
      <Note
        title="9 · An eyebrow that holds a section crumb's word and stands — 'Case study · Fintech' under Home / Case studies"
        note="'Case studies' is the site's structure, a section index named once in SECTION_INDEXES (@/lib/routes), so an eyebrow repeats it only by equalling it. 'Case study · Fintech' says the format and the category, which the trail cannot, so it stands with no warning. The same rule lets 'Product audit' stand under Home / Audits. Against a crumb that NAMES something, 'ConnectX' here, or a top-level page such as 'Future Interfaces Lab', the eyebrow is a repeat as soon as it says the name, which is the next block's ConnectX case."
      />

      <PageHero
        trail={heroTrail(TRAIL, TITLE, crumbs)}
        title={TITLE}
        body={paragraphs(1)}
        eyebrow={BARE_STRUCTURE_EYEBROW}
      />
      <Note
        title="9 · Deliberately WRONG — a bare 'Case study' under Home / Case studies"
        note="The eyebrow equals the section crumb once plurals are folded ('Case study' and 'Case studies' normalise alike), so it is the crumb read twice, 32px apart. In development PageHero logs a warning naming it, and the band still renders so the fault shows on the page. On a live route eyebrowBesideTrail drops it before PageHero sees it, and reports the drop once per server process. The fix is to add what the trail cannot say, as the block above does."
      />

      {/* ── 9b · masthead · a listing's opening ─────────────────────────────────── */}
      <PageHero
        trail={heroTrail(
          TRAIL,
          'Insights from building products at the edge of design',
          crumbs,
        )}
        title="Insights from building products at the edge of design"
        body={[PARAS[0]]}
        arrangement="masthead"
        texture
      />
      <Note
        title="9b · masthead — a listing's opening, the lede on the title's last baseline"
        note="The title alone in two thirds from 1024, the lede (and its figures) in the third, both halves on the title's last baseline: the band's end half, where the texture runs, carries the words that frame it, and the band is a title's height, so the list under it starts inside the first screen. Below 1024 it renders exactly as stacked."
      />
      <PageHero
        trail={heroTrail(TRAIL, 'Articles', crumbs)}
        title="Articles"
        titleSize="mark"
        body={['Essays and field notes from building complex products.']}
        stats={[
          { value: '2017', label: 'Founded' },
          { value: '90+', label: 'Projects' },
          { value: '19', label: 'Countries with clients' },
        ]}
        arrangement="masthead"
        texture
      />
      <Note
        title="9b · masthead · mark title + figures — a listing's record"
        note="One word at the mark scale, the lede on its baseline across the texture, and the record as figures a stack under it: the number large, what it counts small (owner, 29 Oct 2026: a record is shown as stats, never as a mono line of facts; the case-study listing's studio record)."
      />

      {/* ── 10 · Every edge case from §12 ───────────────────────────────────────── */}
      <PageHero title={LONG_TITLE} body={paragraphs(2)} />
      <Note
        title="10 · Row 1 · the longest realistic title, 57 characters"
        note="The corpus's longest h1 is a Service L3 name of about this length. It wraps inside --measure-title (22ch, measured 878px at --text-display) and the lines BALANCE rather than leaving one word alone on the last — a widow in the strongest shape on the page is visible from across a room. Never truncated, never clamped: there is no line-clamp and no text-overflow anywhere in this component."
      />

      <PageHero title={TITLE} body={[PARAS[0], PARAS[1], URL_PARA]} />
      <Note
        title="10 · Row 2 · one long unbroken token, in paragraph 3"
        note="A 100-character URL breaks inside itself rather than pushing a horizontal scrollbar onto the band. Check the page's own horizontal scroll: there must be none, at any width. reset.css sets overflow-wrap: break-word on p and h1, which is why this component does not restate it — and why the two byline parts, which are dt and dd, do state it themselves."
      />

      <PageHero title="" body={paragraphs(2)} />
      <Note
        title='10 · Row 7 · title="" — an empty h1, deliberately'
        note="No placeholder copy, ever — no Untitled, no em dash, no fallback string — because a fallback is how a content fault ships. A page with no h1 is worse than a page with a visibly empty one, and the empty element is what makes the fault findable in an audit. Inspect the DOM above: there is an h1 element and it is empty."
      />

      <PageHero title={TITLE} body={[PARAS[0], '   ', PARAS[1]]} />
      <Note
        title="10 · Row 7 · an empty string inside body"
        note="Three entries, one of them whitespace. It is filtered BEFORE the roles are assigned, so it produces no <p> and no seam around nothing — and the filtering order matters: dropping blanks afterwards would let a blank first entry make the lead an empty paragraph and promote paragraph two to body scale. Count the paragraphs above: two."
      />

      <PageHero
        title={TITLE}
        body={paragraphs(2)}
        eyebrow={EYEBROW}
        credits={[{ role: 'author', people: [{ name: 'Alice Chen' }] }]}
        dates={{ published: '2026-03-03', modified: '2026-06-12' }}
        actions={TWO_ACTIONS}
      >
        <Layout columns={3} colGap="gutter" rowGap="block">
          <Layout rowGap="inline">
            <h3>11 buildings</h3>
            <p className={s.specNote}>across four metering vendors</p>
          </Layout>
          <Layout rowGap="inline">
            <h3>9 weeks</h3>
            <p className={s.specNote}>from kickoff to first switch</p>
          </Layout>
          <Layout rowGap="inline">
            <h3>2 days</h3>
            <p className={s.specNote}>to close a quarter, from three weeks</p>
          </Layout>
        </Layout>
      </PageHero>
      <Note
        title="10 · Rows 6 and 11 · every slot filled at once, extras included"
        note="The only band on this page with all six slots present, and the one that proves the order: eyebrow, title, copy, byline, extras, actions, at 48 between each block. The stat block is the /contact case — headings start at h3, because the page's body sections use h2 and a hero adjunct is subordinate to them. It carries no ink of its own: whatever goes in extras reads --sec-* from the hero's own band, so this same block on a blue hero would be white-on-blue without being told."
      />

      {/* ── 11 · Two adjacent ───────────────────────────────────────────────────── */}
      <PageHero title={TITLE} body={paragraphs(1)} />
      <PageHero title="A second hero, which is a second h1" body={paragraphs(1)} />
      <Note
        title="11 · Two adjacent — THIS IS A BUG; the specimen shows what the bug looks like"
        note="Forbidden: two heroes are two h1s and one page has one h1. The component cannot detect a sibling — there is no :has() and no upward selector — so this is a lint rule and a review, not a runtime guard. The visual tell is the seam you are looking at: two --sec-padding-y paddings meet and leave 192px of dead air between two display titles, which is unmistakable once it has been seen once."
      />

      {/* ── 12 · Interactive content in extras ──────────────────────────────────── */}
      <PageHero title={TITLE} body={paragraphs(1)} actions={TWO_ACTIONS}>
        <Cluster colGap="tight" rowGap="tight">
          <Button
            as="a"
            href={ROUTES.caseStudies}
            emphasis="ghost"
            tone="primary"
            size="md"
            extendHitArea
          >
            An extras control
          </Button>
        </Cluster>
      </PageHero>
      <Note
        title="12 · Interactive content in extras — tab order"
        note="Tab from the top: the extras control, then the first action, then the second. (One extras control, not two: two ghosts side by side is a pairing the owner ruled out on 7 Oct 2026.) DOM order, which is visual order, and the component adds no tabindex, no focus trap and no roving index. Anything focusable in extras reaches the 44px floor by its own means — this one is a Button with extendHitArea, which already do. The other slots CANNOT hold interactive content, and that is a compile-time guarantee rather than a rule: title, eyebrow and every entry in body are typed string, so no control, no link and no second heading can be passed into them."
      />

      {/* ── 13 · The hit floor ──────────────────────────────────────────────────── */}
      <PageHero title={TITLE} body={paragraphs(1)} actions={TWO_ACTIONS} />
      <Section>
        <Layout rowGap="block">
          <p className={s.specTitle}>
            13 · The 44px touch floor, which a screenshot will not show
          </p>
          <p className={s.specNote}>
            Both actions are <code>Button size=&quot;md&quot;</code> with{' '}
            <code>extendHitArea</code>, and the floor is <code>--btn-hit-min</code> 44 for both.
            The solid&apos;s box is <code>--btn-height-md</code> 40, so for it the extension
            covers the missing 4 without moving the row — and the row not moving is the point:
            stepping to <code>size=&quot;lg&quot;</code> would make the hero&apos;s button 48
            while every other control on the site stayed at 40, and the hero would be claiming a
            loudness the design does not intend. The ghost partner has the same 40 box (it was a
            link until 7 Oct 2026, whose label line made the extension the whole target). The
            dashed box below is 44 tall, for comparison against the actions above. An action
            missing the extension is the one failure this component can ship that a screenshot
            will not show, so assert the 44 in the rendered DOM: both boxes are 40, and both hit
            areas are 44.
          </p>
          <div className={s.hitFloor} />
        </Layout>
      </Section>

      {/* ── 14 · Illegal placements, rendered ───────────────────────────────────── */}
      <Section>
        <Layout rowGap="block">
          <p className={s.specTitle}>
            14 · Illegal placements — a band in a narrow track, at 320 and at 256
          </p>
          <p className={s.specNote}>
            PageHero is a band and may only be a direct child of the page or its template. It
            must not be placed inside a <code>Section</code> (the content column would inset
            twice), inside a <code>Layout</code> track (a band is not a row) or inside a{' '}
            <code>Cluster</code> (which would shrink it to its longest word). Both bands below
            are clamped by the harness to Layout&apos;s own track widths so the floor is a
            rendering rather than a claim — and both are wrong on purpose.
          </p>
          <div className={s.trackMd}>
            <PageHero
              title={TITLE}
              body={paragraphs(2)}
              eyebrow={EYEBROW}
              actions={ONE_ACTION}
            />
          </div>
          <p className={s.specNote}>
            <strong>320px, --lay-track-md — the named minimum.</strong> The longest single word
            in a corpus h1 still fits without overflow at this width. Both measures exceed the
            column here and go inert, which is the correct behaviour and needs no rule; nothing
            reorders and no media query fires, because there are none in this component.
          </p>
          <div className={s.trackSm}>
            <PageHero
              title={TITLE}
              body={paragraphs(2)}
              eyebrow={EYEBROW}
              actions={ONE_ACTION}
            />
          </div>
          <p className={s.specNote}>
            <strong>256px, --lay-track-sm — below the floor.</strong> It renders and it breaks
            inside words rather than overflowing. That is the documented behaviour of a
            placement that should not exist, not a supported width.
          </p>
        </Layout>
      </Section>

      {/* ── 15 · The media slot ─────────────────────────────────────────────────
          The one part of the hero that is a BOX, and the only one that reaches both edges of the
          content column. Everything above it is left-set text inside a measure, which is why this
          slot exists at all: squint at any band in block 2 and it is three sizes of the same
          rectangle, and squint at the first band below and it is not.

          Nine bands. Two renderings, three intrinsic ratios, four surfaces and the two placements
          that are wrong. */}
      <PageHero
        title={TITLE}
        body={paragraphs(2)}
        eyebrow={EYEBROW}
        credits={[{ role: 'author', people: [ALICE, BEN] }]}
        dates={{ published: '2026-03-03', modified: '2026-06-12' }}
        actions={TWO_ACTIONS}
        media={MEDIA_WIDE}
      />
      <Note
        title="15 · An image, with every other slot filled"
        note="The whole order, and the media is LAST: eyebrow, title, copy, byline, actions, image, at 48 between each block. Below the actions rather than under the copy on purpose — the byline stays tight to the title it credits and the actions stay in the reading flow rather than stranded under a picture. The image takes the full 1240 column while the copy above it stops at its measures, and that difference in width is the whole point of the slot. The image has no kind, so Media renders it as a capture (M3) — the hairline is --media-capture-rule-ink: a light UI screenshot on near-white paper has no edge of its own, so 300 at 1.54:1 is decoration doing a job rather than a frame."
      />

      <PageHero title={TITLE} body={paragraphs(1)} eyebrow={EYEBROW} media={MEDIA_VIDEO} />
      <Note
        title="15 · A YouTube embed"
        note="An id and a title, never a URL and never an iframe: the component builds the src, so all 129 routes embed on the same host (youtube-nocookie.com, which withholds tracking cookies until a visitor presses play), with the same parameters and the same referrer policy. The 16/9 box is an aspect-ratio on the iframe ITSELF — no wrapper, no padding-top percentage, nothing absolutely positioned — and 16/9 is YouTube's ratio rather than a house one, which is why it is not applied to the images. Autoplay is deliberately absent from the allow list. Tab through this band: the iframe ELEMENT is not in the tab order, so focus passes into YouTube's own document, whose controls and rings are theirs and cannot be reached from our stylesheet at any cost."
      />

      <PageHero title={TITLE} body={paragraphs(1)} media={MEDIA_TALL} />
      <Note
        title="15 · A portrait asset — the intrinsic ratio is the decision"
        note="No object-fit, no aspect-ratio and no max-block-size on the image, exactly as in Figure: a crop mode would cut small type out of some screenshots, and a hero is where a screenshot is largest and most likely to be read. So a 900×1200 asset renders 1240 wide and about 1653 tall, and it dominates the band — which is a content decision about what to put in the slot rather than a component that needs a knob. If a route wants a shorter band, it wants a wider asset."
      />

      <PageHero title={TITLE} body={paragraphs(1)} media={MEDIA_NARROW} />
      <Note
        title="15 · An asset narrower than the column — upscaled, knowingly"
        note="480px wide in a 1240px column. There is no cap at the intrinsic width, and that is a knowing omission: a max-inline-size here would leave a short image sitting in a column-width row and turn a content fault into a layout one. The fix belongs to the asset — deliver at 1240 or wider — and the prop doc says so. This sample is an SVG, so it upscales cleanly and UNDERSTATES the problem; a 480px raster in this band is visibly soft. What the band does prove is that nothing breaks: the box is still the column, the hairline still meets it, and the rhythm above is untouched."
      />

      {SURFACES.map((entry) => (
        <div key={`media-${entry.surface}`}>
          <PageHero
            surface={entry.surface}
            title={SHORT_TITLE}
            body={paragraphs(1)}
            media={MEDIA_WIDE}
          />
          <Note
            surface={entry.surface}
            title={`15 · Media on ${entry.surface}`}
            note={
              entry.surface === 'ink'
                ? 'The rule DROPS to neutral-700 (2.10:1) rather than lifting with the inks, and this is the band that shows why: a light screenshot on near-black already has all the edge it needs from its own pixels, so a pale hairline would read as a second surface sitting on the black one. Almost none is the honest amount of rule here.'
                : entry.surface === 'blue'
                  ? 'The rule takes brandeis-300 (2.64:1) — DARKER than every text ink on this ground. The light end of the ramp is spent on the type, and on a saturated ground the distinction wanted is a slight one; stepping toward the ground is what makes it slight.'
                  : entry.surface === 'tint'
                    ? 'The rule steps with the ground, neutral-300 to neutral-400 (1.90:1), and has less to do than on paper: the tint ground is already darker than a light screenshot, so some of the distinction is made before the rule draws anything.'
                    : 'The surface that needs the rule most. neutral-300 at 1.54:1 against near-white paper is a grey hairline that is visible without being a frame — Media\u2019s capture edge, which the hero no longer restates: the image is a Media, and its edge is the capture kind\u2019s on every placement.'
            }
          />
        </div>
      ))}

      <PageHero title={TITLE} body={paragraphs(1)} media={MEDIA_WIDE}>
        <Cluster colGap="tight" rowGap="tight">
          <Button
            as="a"
            href={ROUTES.caseStudies}
            emphasis="ghost"
            tone="primary"
            size="md"
            extendHitArea
          >
            An extras control
          </Button>
        </Cluster>
      </PageHero>
      <Note
        title="15 · Media and extras together — the order, and the tab order"
        note="extras sits between the byline and the actions; media is after both. Tab from the top: the extras control, then the actions if there were any, then into the video document if the media were a video. DOM order is visual order and the component adds no tabindex anywhere. Note also that extras and media are not alternatives — extras is a caller-composed block that reads the band's --sec-* inks, and media is a closed union of two renderings the component owns. A caller who wants a second image puts it in extras and owns its geometry there."
      />

      {/* ── 15 · The media slot at 326 ──────────────────────────────────────────
          ch05 B3: every image is approved at the phone's column. A band's column is its own
          gutter's doing, so the harness frames the VIEWPORT (390) and lets the hero produce the
          326 itself, instead of clamping the band to 326 and insetting it a second time. */}
      <Section>
        <Layout rowGap="block">
          <p className={s.specTitle}>15 · 326 · mobile column</p>
          <p className={s.specNote}>
            The hero at a 390 viewport, so its media fills a 326 column — the width every image
            is approved at (ch05 B3). This is NOT an illegal placement like block 14: the
            harness frame stands in for the phone, derived from <code>--viewport-390</code>, and
            the band&apos;s own <code>--sec-gutter</code> makes the 326 rather than a second
            inset. The frame cannot fire a media query, so at a wide window the title keeps its
            desktop step here (the h1 re-declares on the viewport at 767, not on the frame) —
            judge the media, not the title. Wide capture first, then portrait: the wide
            one&apos;s type is what fails at this width, and that failure belongs to the asset.
            Hero media is intrinsic, so nothing crops it to pass.
          </p>
          <div className={s.viewportMobile}>
            <PageHero title={SHORT_TITLE} body={paragraphs(1)} media={MEDIA_WIDE} />
          </div>
          <div className={s.viewportMobile}>
            <PageHero title={SHORT_TITLE} body={paragraphs(1)} media={MEDIA_TALL} />
          </div>
        </Layout>
      </Section>

      {/* ── 16 · The no-visual hero, at CU04's budgets ─────────────────────────────
          The most common hero on the site, so it is proved first and at both ends of the copy
          standard: H1 4–10 words, support 15–35 (CU04). Weight comes from scale and position —
          the h1 at 22ch, the lead at 40ch, both left-set on the column's strongest edge — and from
          nothing else: no rule, no tint band, no reserved box. */}
      <PageHero title={CU_TITLE_MIN} body={[CU_SUPPORT_MIN]} />
      <Note
        title="16 · No visual · CU04 floor — a 4-word H1, 15-word support"
        note="Two shapes, not one: a large serif statement and a smaller sans lead that stops well short of the title's width. The band's open right half is the composition, not a hole — nothing is waiting to fill it."
      />
      <PageHero
        title={CU_TITLE_MAX}
        body={[CU_SUPPORT_MAX]}
        eyebrow="Design systems"
        actions={TWO_ACTIONS}
      />
      <Note
        title="16 · No visual · CU04 ceiling — a 10-word H1, 35-word support, eyebrow and two actions"
        note="The lead takes --measure-lead (40ch), the measure ContentSection's lead already uses, rather than the body's 68ch: at 68ch a 35-word lead runs three long lines and reads as the first paragraph of the body; at 40ch it is a five-line block under a balanced title, and the title and the lead read as two distinct shapes at squint. Paragraphs after the lead keep 68ch — they are body copy."
      />

      {/* ── 17 · Arrangement × media kind ──────────────────────────────────────────
          Every arrangement against every media case. Identical copy in every band, so the only
          variables are the two props under test. Narrow the window below 1024 and every `beside`
          band becomes its `stacked` twin above it, byte for byte in layout. */}
      {ARRANGEMENTS.map((arrangement) =>
        MEDIA_CASES.map((entry) => (
          <div key={`${arrangement}-${entry.key}`}>
            <PageHero
              arrangement={arrangement}
              title={TITLE}
              body={[CU_SUPPORT_MAX]}
              eyebrow={EYEBROW}
              actions={ONE_ACTION}
              media={entry.media}
            />
            <Note
              title={`17 · arrangement="${arrangement}" · ${entry.label}`}
              note={
                arrangement === 'beside' && entry.media
                  ? `From 1024: copy and media in two equal tracks, 96 apart (--gap-section), the media at its own ratio inside a 572 track (sizes: HERO_BESIDE). An illustration is centred on the copy; every other kind is top-aligned. ${entry.note}`
                  : arrangement === 'stacked' && entry.media
                    ? `The media below the copy as a full-column block, 48 under the actions (sizes: FULL_COLUMN). This is ruling H1's "below". ${entry.note}`
                    : arrangement === 'watch' && entry.media
                      ? `The media first, under the trail, then the title, lead and the rest, 48 apart: for a piece whose media is the piece, a video (owner, 1 Nov 2026). With no media it is \`stacked\`. ${entry.note}`
                      : entry.note
              }
            />
          </div>
        )),
      )}

      {/* ── 18 · Beside at the ceiling ─────────────────────────────────────────── */}
      <PageHero
        arrangement="beside"
        title={CU_TITLE_MAX}
        body={[CU_SUPPORT_MAX]}
        eyebrow="Design systems"
        actions={TWO_ACTIONS}
        media={asHero(ILLUSTRATION)}
      />
      <Note
        title="18 · beside · CU04 ceiling — a 10-word H1 and 35-word support against an illustration"
        note="The longest copy the standard allows, in a 588 track. The title's 22ch measure exceeds the track and goes inert, so the h1 wraps to the track instead; the lead's 40ch still fits. The two tracks stay equal (H2) however the copy runs — the image does not grow into the copy's side, and the copy does not push the image down."
      />
      <PageHero
        arrangement="beside"
        title={TITLE}
        body={paragraphs(3)}
        eyebrow={EYEBROW}
        credits={[{ role: 'author', people: [ALICE, BEN] }]}
        dates={{ published: '2026-03-03', modified: '2026-06-12' }}
        actions={TWO_ACTIONS}
        media={asHero(CUT_OUT)}
      />
      <Note
        title="18 · beside · every copy slot filled — three paragraphs, a byline and two actions"
        note="The copy column outgrows the media and that is accepted: top-aligned, the difference is air under the image, not a stretched or centred one. This is an over-budget hero (three paragraphs is past CU04's 35 words) and it still holds."
      />

      {/* ── 19 · Beside · the asset's shape ────────────────────────────────────── */}
      {(
        [
          [
            'square',
            PHOTOGRAPH,
            'A 1:1 photograph. 588 × 588 in the track — close to the copy’s own height at this length, so the band reads as two equal halves.',
          ],
          [
            'tall',
            CUT_OUT_TALL,
            'A 902 × 1088 cut-out: about 710 tall in the track, so the image is the longer side and the copy sits at its top. Intrinsic, uncropped (H3).',
          ],
          [
            'wide',
            CAPTURE,
            'A 1436 × 883 capture: about 360 tall in the track, so the copy is the longer side. A wide asset beside the copy is short; if the page wants it large, the template wants `stacked`.',
          ],
          [
            '1:5 stress',
            STRESS_TALL,
            'A 400 × 2000 asset renders 588 × 2940 — the band becomes the image. Nothing clips it and nothing should: a very tall asset is a supply problem the 326 check catches (audit § 3), not something this component crops.',
          ],
        ] as const
      ).map(([shape, image, note]) => (
        <div key={shape}>
          <PageHero
            arrangement="beside"
            title={TITLE}
            body={[CU_SUPPORT_MAX]}
            actions={ONE_ACTION}
            media={asHero(image)}
          />
          <Note title={`19 · beside · a ${shape} asset`} note={note} />
        </div>
      ))}

      {/* ── 20 · Beside on every surface ────────────────────────────────────────
          A capture, because its hairline is the one surface-dependent value in the media and it
          must re-tune on each ground without being told. Not an illustration: ch05 § 4a forbids
          one on blue, and § 9a keeps a banner off ink and blue altogether — this row proves the
          token layer, not a page anyone should build on the reserved grounds. */}
      {SURFACES.map((entry) => (
        <div key={`beside-${entry.surface}`}>
          <PageHero
            arrangement="beside"
            surface={entry.surface}
            title={TITLE}
            body={[CU_SUPPORT_MAX]}
            eyebrow={EYEBROW}
            credits={[{ role: 'author', people: [{ name: 'Alice Chen' }] }]}
            dates={{ published: '2026-03-03' }}
            actions={TWO_ACTIONS}
            media={asHero(CAPTURE)}
          />
          <Note
            surface={entry.surface}
            title={`20 · beside · surface ${entry.surface}`}
            note="Identical markup, one prop apart. The six text inks are --hero-*, the capture's hairline is Media's --media-capture-rule-ink, and both re-declare per surface from the band's data-surface."
          />
        </div>
      ))}

      {/* ── 21 · 326 · every kind in the phone's column ────────────────────────────
          The harness frames the VIEWPORT (390) and the band's own gutter makes the 326. The frame
          cannot fire a media query, so `beside` would split inside it at a wide window — and below
          1024 `beside` IS `stacked`, so these bands render `stacked`, which is what a phone gets
          from either arrangement. The real 390 capture of this page shows every band above in
          that state. */}
      <Section>
        <Layout rowGap="block">
          <p className={s.specTitle}>21 · 326 · every media kind at the mobile column</p>
          <p className={s.specNote}>
            Below 1024 both arrangements are one column — copy, then media — so this is the
            phone rendering of every band in 17. Each asset must still read at 326 (ch05 B3). At
            a wide window the h1 keeps its desktop step inside the frame; judge the media and
            the lead.
          </p>
        </Layout>
      </Section>
      {MEDIA_CASES.map((entry) => (
        <div key={`mobile-${entry.key}`} className={s.viewportMobile}>
          <PageHero
            title={CU_TITLE_MAX}
            body={[CU_SUPPORT_MAX]}
            actions={ONE_ACTION}
            media={entry.media}
          />
        </div>
      ))}

      {/* ── 22 · The score in the eyebrow's place ─────────────────────────────────
           r7-hero, owner 7 Oct 2026. `rating` and `eyebrow` are one union: the line holds one
           thing. Two frames × the three arrangements a score fits, then the trail and a ground. */}
      {rating
        ? RATING_CASES.map((entry) => (
            <div key={entry.key}>
              <PageHero
                {...entry.props}
                rating={{ ...rating, frame: entry.frame }}
                title={CU_TITLE_MIN}
                body={[CU_SUPPORT_MIN]}
                actions={TWO_ACTIONS}
              />
              <Note
                title={`22 · rating · ${entry.frame} · ${entry.title}`}
                note={entry.note}
                surface={entry.props.surface}
              />
            </div>
          ))
        : null}

      {/* ── 23 · The lead ─────────────────────────────────────────────────────── */}
      <div>
        <PageHero title={TITLE} body={paragraphs(3)} />
        <Note
          title="23 · The lead"
          note="One size since 19 Oct 2026 (owner: no body text above 16, and the hero lead is the one place 18 is allowed). --text-lead-lg, 18, over --text-body paragraphs at 16: the lead is the larger, shorter line, so it reads as the lead without shouting over the title. The 20px opt-in (leadSize) was removed."
        />
      </div>

      {/* ── 23a · A page about a person ───────────────────────────────────────────
           The author page (owner, 1 Nov 2026): `portrait` above the title, `titleSize="h1"` for
           a name. With a photograph, then without one (the initials hold the square), then on
           the tint and ink grounds the initials' tint is declared for. */}
      <div>
        <PageHero
          trail={heroTrail(
            [
              { label: 'Home', href: ROUTES.home },
              { label: 'Insights', href: ROUTES.insights },
              { label: 'Authors', href: ROUTES.authors },
              { label: ALICE.name, href: authorPath('alice-chen') },
            ],
            ALICE.name,
            crumbs,
          )}
          portrait={{ name: ALICE.name, image: ALICE.portrait }}
          title={ALICE.name}
          titleSize="h1"
          body={['Founder and CEO', PARAS[0] ?? '']}
          texture
        />
        <Note
          title="23a · portrait · a photograph · h1 title · role as the lead, a bio under it"
          note="The face of the person a page is about, a fixed 128 square at the 8 radius, a block above the title. Not `media`: a portrait of a few hundred pixels would be blown up to the full track. The name is set at the h1 role, a step under display. The bio is a body paragraph only when the CMS sends one; without it the hero is the face, the name and the role."
        />
      </div>
      {(['paper', 'tint', 'ink'] as const).map((surface) => (
        <div key={`portrait-initials-${surface}`}>
          <PageHero
            portrait={{ name: 'Yash Gidwani' }}
            title="Yash Gidwani"
            titleSize="h1"
            body={['Product Designer']}
            surface={surface}
          />
          <Note
            title={`23a · portrait · no photograph, initials · ${surface}`}
            note="Without a photograph the initials hold the square on the portrait's filled tint in the title's full ink, at the h2 role: one treatment with ProfileCard. The byline disc keeps its outline (decisions/2026-11-01-byline-initials-without-a-photo)."
            surface={surface}
          />
        </div>
      ))}

      {/* ── 23b · arrangement="profile" ────────────────────────────────────────────
           The author page's composed head (owner, 1 Nov 2026: "a real profile page"): the portrait
           at 240 beside the whole opening from 1024 (192 from 768, stacked at 128 below), the
           name, the role and bio, the topics as labels and the LinkedIn link on the role line
           (`leadAside`). With a photograph and every slot, then initials with no LinkedIn, on paper and
           ink. */}
      <div>
        <PageHero
          trail={heroTrail(
            [
              { label: 'Home', href: ROUTES.home },
              { label: 'Insights', href: ROUTES.insights },
              { label: 'Authors', href: ROUTES.authors },
              { label: ALICE.name, href: authorPath('alice-chen') },
            ],
            ALICE.name,
            crumbs,
          )}
          arrangement="profile"
          portrait={{ name: ALICE.name, image: ALICE.portrait }}
          title={ALICE.name}
          titleSize="h1"
          body={['Founder and CEO', PARAS[0] ?? '']}
          labels={['AI Product UX', 'Design Systems', 'B2B SaaS & Workflow Software']}
          leadAside={
            <Button
              as="a"
              href="#"
              emphasis="link"
              tone="primary"
              iconLeft={<BrandMark name="linkedin" />}
            >
              LinkedIn
            </Button>
          }
          texture
        />
        <Note
          title="23b · arrangement=profile · a photograph · labels · LinkedIn on the role line (leadAside)"
          note="The face beside the whole opening, a `stack` (48) apart, top-aligned: one composed head. 240 from 1024, 192 from 768, and below 768 the portrait stacks above the name at the default 128. The frame carries the tint ground, so a photograph cut to a circle on transparency still reads as the rounded square. The LinkedIn link is the caller's, passed as `leadAside`: it shares the role's line, a `block` apart on the baseline, the LinkedIn BrandMark before the label, and wraps under the role on a narrow column."
        />
      </div>
      {(['paper', 'ink'] as const).map((surface) => (
        <div key={`profile-initials-${surface}`}>
          <PageHero
            arrangement="profile"
            portrait={{ name: 'Yash Gidwani' }}
            title="Yash Gidwani"
            titleSize="h1"
            body={['Product Designer', PARAS[1] ?? '']}
            labels={['Onboarding & Engagement', 'UX Audits']}
            surface={surface}
          />
          <Note
            title={`23b · arrangement=profile · initials, no LinkedIn · ${surface}`}
            note="Without a photograph the initials hold the larger square at the display role, on the frame's filled tint in the title's full ink (ProfileCard's treatment). Without a LinkedIn URL nothing renders on the role line."
            surface={surface}
          />
        </div>
      ))}

      {/* ── 24 · What this page cannot show ─────────────────────────────────────── */}
      <Section>
        <Layout rowGap="block">
          <p className={s.specTitle}>24 · What a static page cannot show</p>
          <p className={s.specNote}>
            <strong>The 1024, 767 and 375 columns.</strong> Narrow the window. At 1023 every{' '}
            <code>beside</code> band stacks — copy, then media — through Layout&apos;s{' '}
            <code>lg</code> template, and that is the only change in the component. Nothing
            changes at 767 or 375 — no DOM change, no reordering, no gap change, no type change
            of its own — and that is the assertion rather than an omission: the stack is
            single-track at every width, both Clusters wrap by themselves, and both measures are{' '}
            <code>ch</code>-based so they follow the type down with no second value to keep in
            sync. <code>--text-display</code> re-declares itself at 1023 (54) and 767 (43) in
            the type layer, which is where that decision belongs.
          </p>
          <p className={s.specNote}>
            <strong>The Buttons&apos; three stateless states.</strong> Hover, pressed and{' '}
            <code>:focus-visible</code> have no props anywhere in this system. Point at an
            action, hold it down, and tab to it, on each of the four surfaces in block 7. They
            are Button&apos;s states and Button&apos;s specimen tests them properly.
          </p>
          <p className={s.specNote}>
            <strong>Reduced motion.</strong> Nothing in this component moves, so{' '}
            <code>prefers-reduced-motion: reduce</code> has nothing to switch off and the
            rendering under it is byte-identical. The stylesheet contains no <code>@media</code>{' '}
            block of any kind, including that one — the identity is structural, not conditional.
          </p>
        </Layout>
      </Section>
    </>
  );
}
