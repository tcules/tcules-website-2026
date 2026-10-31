import { Fragment, type ReactNode } from 'react';

import { BrandMark, Cluster, Icon, Layout, Media, RatingBadge, Section } from '@/components';
import {
  Accordion,
  Breadcrumbs,
  CtaRow,
  CtaSection,
  DataTable,
  ContentSection,
  EnquiryForm,
  type EnquiryDress,
  ListCard,
  LogoGrid,
  PageHero,
  Proof,
  Slider,
  type AccordionItem,
  type CtaContact,
  type HeroActions,
  type HeroCredit,
  type HeroDates,
  type HeroMedia,
  type HeroStat,
  type ProofQuote,
  TestimonialWall,
  type TestimonialItem,
  type LogoGridMark,
} from '@/patterns';
import { CLIENT_MARKS, clientMark } from '@/lib/client-marks';
import { parseAttribution } from '@/lib/attribution';
import type {
  CorpusBand,
  CorpusBlock,
  CorpusPage,
  TestimonialAvatarRecord,
  TestimonialRating,
} from '@/lib/corpus-types';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import { linkProofLine } from '@/lib/case-links';
import { renderInline } from '@/lib/inline-render';
import { HEAD_TRACK } from '@/lib/image-sizes';
import { corpusImage } from '@/lib/corpus-images';
import { ENQUIRY_DESK, ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { heroNeedsMedia } from '@/lib/hero-media';
import { placeholderImage } from '@/lib/placeholders';
import { ENDPOINTS } from '@/lib/routes';
import { isStudioRecord, recordFigures } from '@/lib/studio-record';
import { heroTrail } from '@/lib/trail';

import styles from './CorpusPage.module.css';
import { hasLink, html, inline, plain } from './text';

/**
 * The corpus pages' shared renderers: one content shape, one component, on every page type
 * (page-mapping § 2). They live in ONE template folder because a template may not import a sibling
 * template, and the renderers cannot live in `src/lib` (it may not import a pattern) or in
 * `src/patterns` (a pattern may not know a corpus type). The same arrangement ServicePage chose.
 *
 * Nothing here writes a word: every string comes from the corpus page as authored, through the
 * label rules in text.ts.
 */

export type CorpusFormContext = {
  /** Where the enquiry posts. Named in `ENDPOINTS`, never a literal here. */
  action: string;
};

/** A heading's id: `<band>-heading` (page-mapping § 3). */
export const headingIdOf = (band: CorpusBand): string => `${band.id}-heading`;

/** The head every ContentSection band shares: its id, its heading and the heading's id. */
export function head(band: CorpusBand) {
  return { id: band.id, heading: band.headingText, headingId: headingIdOf(band) } as const;
}

/* ── Hero ─────────────────────────────────────────────────────────────────────── */

export type CorpusHeroProps = {
  page: CorpusPage;
  arrangement?: 'stacked' | 'beside' | 'centred';
  media?: HeroMedia;
  /** A bare run of facts (home's studio record), one tag each, after the actions. */
  tags?: readonly string[];
  /** The lede paragraphs the hero keeps; the rest are split into the next band by the template. */
  ledes?: readonly InlineRun[][];
  /** The labelled proof line goes above the actions as the extras row. */
  proofLine?: boolean;
  /** The record as figures, a row under the actions (PageHero `stats`, home round 3). */
  stats?: readonly HeroStat[];
  texture?: boolean;
};

/**
 * M1 — the hero. Eyebrow, h1 and lede verbatim, the page's asks in order (the first is the page's one
 * blue solid), the trail from the frontmatter's breadcrumb. A labelled proof line ("Selected work:
 * …") renders above the actions as the extras row, in its authored italic; a label-less run of facts
 * becomes `tags`.
 */

export function CorpusHero({
  page,
  arrangement = 'stacked',
  media,
  tags,
  ledes,
  proofLine = true,
  stats,
  texture,
}: CorpusHeroProps) {
  const { hero } = page;
  /* A high-traffic page's hero always carries an illustration or an image (owner, 29 Oct 2026;
     src/lib/hero-media.ts): where its template handed none, its own bound hero asset, else its
     labelled placeholder, beside the words. */
  const heroMedia = media ?? (heroNeedsMedia(page.route) ? requiredHeroMedia(page) : undefined);
  const heroArrangement = media ? arrangement : heroMedia ? 'beside' : 'stacked';
  const crumbs = page.breadcrumb.map((crumb) => ({ label: crumb.name, href: crumb.url }));
  const paragraphs = (ledes ?? hero.lede).map(plain).filter(Boolean);
  const actions = hero.actions.slice(0, 2).map((action) => ({
    label: action.labelText,
    href: action.href,
  })) as unknown as HeroActions;
  const eyebrow = hero.eyebrow ? plain(hero.eyebrow) : undefined;
  const byline = editorialByline(page);
  /* The authored byline line is the same record the byline strip now presents, so it is not shown
     twice; any other proof line still is. */
  const proofs = byline
    ? hero.proofLines.filter((line) => !plain(line).includes(byline.author))
    : hero.proofLines;
  /* The studio's record line is figures wherever it is authored, never a line of facts (owner,
     29 Oct 2026; decisions/2026-10-29-studio-record-is-figures): a template that passes no `stats`
     still gets them from the hero's own record, and the record is never also printed as a line. */
  const recordLine = proofs.find((line) => isStudioRecord(plain(line)));
  const figures = stats ?? (recordLine ? recordFigures(plain(recordLine)) : undefined);
  const [firstProof] = proofs.filter((line) => line !== recordLine);
  return (
    <PageHero
      data-band="A"
      data-fold-hero=""
      surface="paper"
      trail={heroTrail(crumbs, hero.titleText, (trail) => (
        <Breadcrumbs {...trail} />
      ))}
      eyebrow={eyebrow}
      title={hero.titleText}
      body={paragraphs.length > 0 ? (paragraphs as [string, ...string[]]) : undefined}
      actions={actions}
      arrangement={heroArrangement}
      media={heroMedia}
      tags={tags}
      stats={figures && figures.length > 0 ? figures : undefined}
      texture={texture}
      credits={byline?.credits}
      dates={byline?.dates}
      readingTime={byline?.readingTime}
    >
      {proofLine && firstProof ? (
        <p className={styles.proofLine}>{renderInline(linkProofLine(firstProof))}</p>
      ) : null}
    </PageHero>
  );
}

/** The hero asset a high-traffic page binds, or its register placeholder (`<route>#hero`). */
function requiredHeroMedia(page: CorpusPage): HeroMedia {
  const binding = page.composition.mediaBindings.find(
    (b) => b.bound && b.supportsSection === 'hero',
  );
  return {
    type: 'image',
    image: binding ? corpusImage(binding) : placeholderImage(page.route, 'hero'),
  };
}

/**
 * The page's byline from its frontmatter's `editorial` record — author, who they are, reviewer, the
 * dates and the reading time — for PageHero's byline strip (owner, 11 Oct 2026: the article template
 * "had a provision for this metadata to be nicely presented"). The reading time is the one the page
 * states ("11 min read" → "11 min"). Null when the page credits no author.
 */
function editorialByline(page: CorpusPage) {
  const editorial = page.frontmatter.editorial as Record<string, unknown> | undefined;
  const str = (key: string) => {
    const value = editorial?.[key];
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  };
  const author = str('author');
  if (!author) return null;
  const role = str('author_role');
  const reviewer = str('reviewer');
  const published = str('published_at');
  const modified = str('modified_at');
  const minutes = /(\d+)\s*min/i.exec(str('reading_time_as_displayed') ?? '')?.[1];
  const credits: HeroCredit[] = [
    { role: 'author', people: [{ name: author }] },
    ...(reviewer ? [{ role: 'reviewer' as const, people: [{ name: reviewer }] as const }] : []),
  ];
  const dates: HeroDates | undefined = published
    ? { published, ...(modified ? { modified } : {}) }
    : modified
      ? { modified }
      : undefined;
  /* `role` is who the author is. It no longer sits in the byline (board G): it is for the end of the
     article, in Contributors, wired once the 26 Oct copy's templates land (feat/new-copy). */
  return { author, role, credits, dates, readingTime: minutes ? `${minutes} min` : undefined };
}

/* ── Quotes ───────────────────────────────────────────────────────────────────── */

type QuoteBlock = Extract<CorpusBlock, { type: 'quote' }>;

/**
 * A corpus quote as a Proof quote. The authored marks stay inside the quote's HTML — Proof draws
 * none of its own — and the attribution line splits into name, role and company (G13). A quote that
 * awaits client sign-off renders as written: the flag is a comment in the source and changes nothing
 * on the page.
 */
export function proofQuote(block: QuoteBlock): ProofQuote {
  const attribution = parseAttribution(block.attribution ?? []);
  return {
    quoteHtml: block.paragraphs.map(html).join(''),
    name: attribution.name,
    role: attribution.role,
    company: attribution.company,
  };
}

/** Per-testimonial ratings by testimonial id, as the route read them from the content seam. */
export type RatingsById = Readonly<Record<string, TestimonialRating>>;

/** Per-testimonial avatar portraits by testimonial id, as the route read them (home round 3). */
export type AvatarsById = Readonly<Record<string, TestimonialAvatarRecord>>;

/**
 * A corpus quote as a rated testimonial card's item: the words and the speaker as `proofQuote`
 * splits them, and the rating the page was handed for this quote's testimonial id (none when the
 * quote has no id or the id no rating: the card then shows no stars). The rating is DATA the route
 * passed down (home round 2: placeholders at the content seam until real ones replace them), never a
 * value written here.
 */
export function testimonialItem(
  block: QuoteBlock,
  ratings?: RatingsById,
  avatars?: AvatarsById,
): TestimonialItem {
  const quote = proofQuote(block);
  const rating = block.testimonialId ? ratings?.[block.testimonialId]?.value : undefined;
  /* The speaker's portrait, when the route passed one for this id (PLACEHOLDER stock portraits
     today, home round 3); without one the card shows no avatar at all. */
  const portrait = block.testimonialId ? avatars?.[block.testimonialId] : undefined;
  return {
    id: block.testimonialId ?? undefined,
    quoteHtml: quote.quoteHtml,
    name: quote.name,
    role: quote.role,
    company: quote.company,
    ...(rating !== undefined ? { rating } : {}),
    ...(portrait
      ? {
          avatar: {
            src: portrait.src,
            width: portrait.width,
            height: portrait.height,
            sources: portrait.sources,
          },
        }
      : {}),
  };
}

/** M7 — a quote inside a story, after the work: the compact Proof. */
export function QuoteCompact({ block }: { block: QuoteBlock }) {
  return <Proof arrangement="compact" quote={proofQuote(block)} />;
}

/* ── Quotes only (M5) ─────────────────────────────────────────────────────────── */

/** From this many quotes a band is the wall; fewer turn one at a time (owner, 29 Oct 2026). */
const WALL_FROM = 6;

/**
 * M5 — a band that is only client quotes, on the page's tint under a centred head, with the band's
 * lead when it authors one. Its shape is decided by the count (owner, 29 Oct 2026):
 *
 *   6 or more  the wall of rated testimonial cards (TestimonialWall: three columns of stacks).
 *   fewer      ONE quote at a time: the centred italic quote with its stars, speaker and role
 *              (Proof `display`, `align="center"`), in the kit's one-up Slider with its plain bars
 *              (2026-10-09-testimonial-slider-controls). Five, four or three cards made a wall with
 *              holes and a row of equal boxes; one voice at a time is the band's one idea. The owner's
 *              explicit exception to "no hidden cards", for testimonials only: every slide is in the
 *              page as it loads.
 *
 * The independent score the copy closes the band on ("**4.8 on Clutch** from 13 reviews. [Read the
 * reviews](…)") is the band's footer as the RatingBadge ALONE (owner, 29 Oct 2026): the badge is the
 * link to the reviews, and "from 13 reviews. Read the reviews" is its accessible name, not visible
 * text. Under the slider it sits BELOW the quotes in a fixed place, outside the turning row, so it
 * never moves with a slide: the head then the voice is the band's path, a badge between them would
 * stack its star over the quote's five, and below it is where the wall already carries it, so the
 * score has one place whatever the count.
 *
 * A quote awaiting client sign-off renders as written; the flag is a comment in the source.
 */
export function QuoteGroupBand({
  band,
  ratings,
  avatars,
  surface = 'tint',
}: {
  band: CorpusBand;
  ratings?: RatingsById;
  avatars?: AvatarsById;
  /** Default tint (the proof band). The plan passes paper where a neighbour is already tint. */
  surface?: 'paper' | 'tint';
}) {
  const firstQuote = band.blocks.findIndex((block) => block.type === 'quote');
  const lead = band.blocks.find(
    (block, index): block is Extract<CorpusBlock, { type: 'paragraph' }> =>
      block.type === 'paragraph' && index < firstQuote && !ratingOf(block),
  );
  const quotes = band.blocks.filter((block): block is QuoteBlock => block.type === 'quote');
  const ratingBlock = band.blocks.find(
    (block): block is Extract<CorpusBlock, { type: 'paragraph' }> =>
      block.type === 'paragraph' && ratingOf(block) !== undefined,
  );
  const rating = ratingBlock ? ratingOf(ratingBlock) : undefined;
  const wall = quotes.length >= WALL_FROM;
  const footer = rating ? (
    <Cluster colGap="tight" rowGap="tight" align="center" justify="center">
      <ScoreBadge rating={rating} />
    </Cluster>
  ) : undefined;
  return (
    <ContentSection
      {...head(band)}
      /* Under the wall the head stays the band's h2; one quote at a time, it is the h2 in the
         eyebrow's voice, so the quote is the band's emphasis (owner, 29 Oct 2026;
         decisions/2026-10-29-quote-slider-head-is-an-eyebrow). */
      headingSize={wall ? undefined : 'eyebrow'}
      data-band="G"
      surface={surface}
      align="center"
      lead={lead ? plain(lead.runs) : undefined}
      footer={footer}
    >
      {wall ? (
        <TestimonialWall
          items={quotes.map((block) => testimonialItem(block, ratings, avatars))}
        />
      ) : (
        <QuoteSlider
          label={band.headingText}
          quotes={quotes}
          ratings={ratings}
          avatars={avatars}
        />
      )}
    </ContentSection>
  );
}

/**
 * The one-up quote slider: each slide the centred Proof with the client's stars. A portrait shows on
 * every slide or on none, the wall's rule (review 29 Oct: some faces and some not read as unevenly
 * finished). One quote is no slider: it stands alone.
 */
function QuoteSlider({
  label,
  quotes,
  ratings,
  avatars,
}: {
  label: string;
  quotes: readonly QuoteBlock[];
  ratings?: RatingsById;
  avatars?: AvatarsById;
}) {
  const portraits = quotes.map((block) =>
    block.testimonialId ? avatars?.[block.testimonialId] : undefined,
  );
  const withPortraits = portraits.every(Boolean);
  const slides: ProofQuote[] = quotes.map((block, index) => {
    const stars = block.testimonialId ? ratings?.[block.testimonialId]?.value : undefined;
    const portrait = withPortraits ? portraits[index] : undefined;
    return {
      ...proofQuote(block),
      ...(stars !== undefined ? { stars } : {}),
      ...(portrait
        ? {
            portrait: {
              src: portrait.src,
              width: portrait.width,
              height: portrait.height,
              sources: portrait.sources,
            },
          }
        : {}),
    };
  });
  const [only] = slides;
  if (slides.length === 1 && only) return <Proof quote={only} align="center" />;
  return (
    <Slider
      label={label}
      slideName="testimonial"
      perView={1}
      align="center"
      slideAlign="center"
      autoplay
    >
      {slides.map((quote, index) => (
        <li key={`${index}-${quote.name}`}>
          <Proof quote={quote} align="center" />
        </li>
      ))}
    </Slider>
  );
}

/** An independent score as the copy authors it, parsed by `ratingOf`. */
export type ScoreLine = NonNullable<ReturnType<typeof ratingOf>>;

/**
 * The Clutch score as the RatingBadge, the ONLY form a rating takes (owner, 29 Oct 2026: never text
 * and a link). The copy's words after the score ("from 13 reviews.") and its link's words ("Read the
 * reviews") are not shown: they follow the badge's visible words in its accessible name, so a
 * screen reader and a crawler read the whole authored line and the eye reads the badge.
 */
export function ScoreBadge({ rating }: { rating: ScoreLine }) {
  const detail = [rating.detail, rating.linkLabel].filter(Boolean).join(' ');
  return (
    <RatingBadge
      score={rating.score}
      platform={rating.platform}
      href={rating.href}
      icon={<Icon name="star" size="sm" />}
      mark={<BrandMark name="clutch" />}
      {...(detail ? { detail } : {})}
    />
  );
}

/**
 * An independent score line: "**4.8 out of 5 on Clutch** across 13 independent client reviews.
 * [Read the reviews](…)" (earlier copy) or "**4.8 on Clutch** from 13 reviews. [Read the reviews](…)"
 * (26 Oct copy). The score, the platform, the reviews' link and its words, and the words between the
 * claim and the link ("from 13 reviews.") as `detail`.
 */
export function ratingOf(
  block: CorpusBlock,
):
  | { score: string; platform: string; href: string; detail?: string; linkLabel?: string }
  | undefined {
  if (block.type !== 'paragraph') return undefined;
  const link = block.runs.find((run) => run.type === 'link');
  if (!link || link.type !== 'link') return undefined;
  const [first, ...rest] = block.runs;
  const claim = first?.type === 'strong' ? plain(first.children) : '';
  const sentence = plain(block.runs.filter((run) => run !== link)).trim();
  const match =
    /^(\d+(?:\.\d+)?)\s+(?:out of \d+\s+)?on\s+(\S+?)\.?$/.exec(claim) ??
    /^(\d+(?:\.\d+)?)\s+(?:out of \d+\s+)?on\s+(\S+)/.exec(sentence);
  if (!match) return undefined;
  const detail = claim ? plain(rest.filter((run) => run !== link)).trim() : undefined;
  const linkLabel = plain(link.children).trim();
  return {
    score: match[1] ?? '',
    platform: (match[2] ?? '').replace(/\.$/, ''),
    href: link.href,
    ...(detail ? { detail } : {}),
    ...(linkLabel ? { linkLabel } : {}),
  };
}

/* ── Client recognition (home, and every hub that opens on it) ───────────────── */

/**
 * Who has worked with us: the boxed LogoGrid, centred, its heading the band's (kit home 2; owner,
 * 10 Oct 2026). The clients the copy names lead, in its order, where the studio holds their file;
 * the rest of the approved wall follows. A rating authored in the band leads the grid as its badge.
 * Shared by home and the hubs (component-map § A `client-recognition`).
 */
export function RecognitionBand({ band }: { band: CorpusBand }) {
  const paragraphsIn = band.blocks.filter(
    (block): block is Extract<CorpusBlock, { type: 'paragraph' }> => block.type === 'paragraph',
  );
  const namesBlock = paragraphsIn.find((block) => !ratingOf(block));
  const ratingBlock = paragraphsIn.find((block) => ratingOf(block));
  const names = namesBlock ? plain(namesBlock.runs).split(' · ') : [];
  const named = names.flatMap((name) => {
    const mark = clientMark(name);
    return mark ? [mark] : [];
  });
  const marks: LogoGridMark[] = [
    ...named,
    ...CLIENT_MARKS.filter((mark) => !named.includes(mark)),
  ];
  const rating = ratingBlock ? ratingOf(ratingBlock) : undefined;
  const id = headingIdOf(band);
  return (
    <Section id={band.id} data-band="H" aria-labelledby={id}>
      <LogoGrid
        marks={marks}
        badge={rating ? <ScoreBadge rating={rating} /> : undefined}
        context={band.headingText}
        contextAs="h2"
        headingId={id}
        align="center"
        edges="closed"
      />
    </Section>
  );
}

/* ── Tiles ────────────────────────────────────────────────────────────────────── */

export type TileRow = { title: string; body?: string; bodyHtml?: readonly string[] };

/**
 * A set of hairline tiles (ListCard `tile`), `columns` across from md: peers whose title is a claim and
 * whose body is the proof of it. The one tile shape every media split's copy column uses.
 */
export function ListTiles({
  rows,
  columns = 2,
}: {
  rows: readonly TileRow[];
  columns?: 1 | 2 | 3;
}) {
  return (
    <Layout as="ul" columns={{ base: 1, md: columns }} colGap="gutter" rowGap="stack">
      {rows.map((row) => (
        <ListCard
          key={row.title}
          form="tile"
          size="sm"
          titleAs="h3"
          title={row.title}
          {...(row.bodyHtml ? { bodyHtml: row.bodyHtml } : { body: row.body })}
        />
      ))}
    </Layout>
  );
}

/* ── Body shapes shared by item sets ──────────────────────────────────────────── */

/**
 * A card or row's body from runs: a plain string when the runs carry no markup that a string would
 * lose, trusted HTML (one paragraph) when they carry a link, so the link survives (G3).
 */
export function bodyOf(runs: readonly InlineRun[]): { body: string } | { bodyHtml: string[] } {
  return hasLink(runs) || runs.some((run) => run.type !== 'text')
    ? { bodyHtml: [inline(runs)] }
    : { body: plain(runs) };
}

/** The HTML of a block list as one run of paragraphs and lists, for an accordion answer. */
export function blocksHtml(blocks: readonly CorpusBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'paragraph':
          return html(block.runs);
        case 'labelled':
          return `<p><strong>${inlineToHtml(block.label)}</strong> ${inlineToHtml(block.body)}</p>`;
        case 'list': {
          const tag = block.ordered ? 'ol' : 'ul';
          return `<${tag}>${block.items.map((item) => `<li>${inlineToHtml(item)}</li>`).join('')}</${tag}>`;
        }
        /* A lone link line inside an answer ("Read about … at Tcules") is part of the answer: its own
           paragraph, the link as authored. Dropping it lost words. */
        case 'links':
          return block.links
            .map(
              (link) =>
                `<p>${inlineToHtml([{ type: 'link', href: link.href, children: link.label }])}</p>`,
            )
            .join('');
        default:
          return '';
      }
    })
    .join('');
}

/* ── Image helper ─────────────────────────────────────────────────────────────── */

/** A photograph, capture or placeholder filling a head-track aside box (ContentSection `asideFill`). */
export function AsidePhoto({ image }: { image: Parameters<typeof Media>[0]['image'] }) {
  return <Media image={image} fit="fill" sizes={HEAD_TRACK} />;
}

/* ── FAQ (M4) ─────────────────────────────────────────────────────────────────── */

export function faqItems(band: CorpusBand): AccordionItem[] {
  return band.blocks.flatMap((block) =>
    block.type === 'item' && block.level === 3
      ? [{ question: block.headingText, answerHtml: blocksHtml(block.blocks) }]
      : [],
  );
}

/** M4 — the accordion, closed by default but the first; the question is the h3. Centred head. */
export function FaqItems({ band }: { band: CorpusBand }) {
  return <Accordion items={faqItems(band)} />;
}

/* ── Enquiry (M2) ─────────────────────────────────────────────────────────────── */

export { ENQUIRY_DESK, ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';

/**
 * The island close's two form dresses (owner, 16 Oct 2026). Their framing words are not in the
 * corpus: the owner approved them for shipping, and they are logged in docs/content-changes.md for
 * the content team. The message dress's person is a PLACEHOLDER from the studio photo catalogue
 * until the owner names who answers enquiries.
 */
const ENQUIRY_PROMPT = 'A link, a Figma file, or two lines about the problem.';
const ENQUIRY_WRITE_TO = 'hello@tcules.com';
export const ENQUIRY_DRESS: Record<'card' | 'message', EnquiryDress> = {
  /* No title of its own (owner, 25 Oct 2026; every card, Jatin, 26 Oct 2026): the band's heading
     already asks. Its fields carry no placeholder, so it takes no prompt. */
  card: {
    kind: 'card',
    reply: 'We reply in 1 business day',
  },
  message: {
    kind: 'message',
    from: {
      name: 'Rushali',
      role: 'Design lead · Tcules',
      portrait: '/kit/photos/studio-portrait-rushali.webp',
    },
    note: 'Tell us what you’re building. I’ll reply within a working day.',
    prompt: ENQUIRY_PROMPT,
    writeTo: ENQUIRY_WRITE_TO,
  },
};

/**
 * M2 — the enquiry band: the L close, always on an island (owner, 29 Oct 2026;
 * decisions/2026-10-29-forms-only-on-the-island), `id="enquiry"` so the hero's "#enquiry" lands on
 * it. Fields, submit label and success words come from the page's `conversion` as authored; the
 * lead is the band's one paragraph. Hidden context names the page and its family so a submission is
 * attributable. A scheduling link appears only where `conversion.schedulingLabel` is set, and none
 * is yet (no scheduling destination exists in `routes.ts`).
 */

export type EnquiryIsland = {
  /** brandeis (`blue`, the default) or `ink`. */
  surface?: 'blue' | 'ink';
  /** The form's dress. Default `card` (untitled, as home's). */
  dress?: 'card' | 'message';
  /**
   * `halves` (default; owner, 25 Oct 2026): the island split 1:1, the sketch-to-shipped drawing
   * above the words, the TextureFlow field across the island, fading at the start. `beside`: the
   * desk drawing, heading and lede beside the form, TextureFrame framing it. The drawing and the
   * field come with the arrangement, so the two never mix.
   */
  arrangement?: 'beside' | 'halves';
  /** With the drawing (default) or without (owner, 29 Oct 2026). */
  illustration?: boolean;
};

export function EnquiryBand({
  page,
  band,
  island = {},
}: {
  page: CorpusPage;
  band: CorpusBand;
  island?: EnquiryIsland;
}) {
  const lead = band.blocks.find((block) => block.type === 'paragraph');
  const body = lead && lead.type === 'paragraph' ? ([plain(lead.runs)] as const) : undefined;
  /* The band's other lines, kept in the copy half: the independent score ("**4.8 on Clutch** from 13
     reviews. [Read the reviews]") as the RatingBadge alone (owner, 29 Oct 2026: a rating is always
     the badge, never a key and a link), and the other ways in ("Or email [hello@tcules.com]") as the
     close's contact strip, each its words as the key and its link as the value. Text never crosses
     the island edge. */
  const score = band.blocks.flatMap((block) => {
    const found = block === lead ? undefined : ratingOf(block);
    return found ? [found] : [];
  })[0];
  const contact = band.blocks.flatMap((block): CtaContact[] => {
    if (block === lead || block.type !== 'paragraph' || ratingOf(block)) return [];
    const link = block.runs.find(
      (run): run is Extract<InlineRun, { type: 'link' }> => run.type === 'link',
    );
    if (!link) return [];
    const words = plain(block.runs.filter((run) => run !== link))
      .replace(/\s+([.,])/g, '$1')
      .replace(/[.\s]+$/, '')
      .trim();
    return [{ label: words, value: plain(link.children), href: link.href }];
  });
  const contactProps = {
    ...(contact.length > 0 ? { contact } : {}),
    ...(score ? { rating: <ScoreBadge rating={score} /> } : {}),
  };
  const surface = island.surface ?? 'blue';
  const dress = ENQUIRY_DRESS[island.dress ?? 'card'];
  const drawn = island.illustration ?? true;
  if ((island.arrangement ?? 'halves') === 'halves') {
    return (
      <CtaSection
        id={band.id}
        data-band="L"
        island={surface}
        islandArrangement="halves"
        islandTexture="flow"
        art={drawn ? <Media image={ENQUIRY_SKETCH_TO_SHIPPED} sizes="300px" /> : undefined}
        heading={band.headingText}
        body={body}
        {...contactProps}
        form={corpusEnquiryForm(page, band, { dress })}
      />
    );
  }
  return (
    <CtaSection
      id={band.id}
      data-band="L"
      island={surface}
      islandTexture="frame"
      art={drawn ? <Media image={ENQUIRY_DESK} sizes="240px" /> : undefined}
      heading={band.headingText}
      body={body}
      form={corpusEnquiryForm(page, band, { dress })}
    />
  );
}

/**
 * The enquiry form the page's `conversion` describes: fields, submit label and success words as
 * authored, hidden context naming the page and its family. Shared by the template's close and by a
 * route that hands the form to a template which takes it as a slot (ListingIndex).
 */
export function corpusEnquiryForm(
  page: CorpusPage,
  band?: CorpusBand,
  /** The island close's treatment: a dress for the form. Default: lg boxes, the full submit. */
  treatment: { dress?: EnquiryDress } = {},
) {
  const conversion = page.conversion;
  /* The band's own "After sending:" line ("We'll reply within one business day.") is the caption
     under the submit, in the page's words (home round 3), where the form used to print its own. */
  const formBlock = (band ?? page.bands.find((b) => b.id === conversion?.anchor))?.blocks.find(
    (block): block is Extract<CorpusBlock, { type: 'form' }> => block.type === 'form',
  );
  const after = formBlock?.after ? plain(formBlock.after) : undefined;
  return (
    <EnquiryForm
      variant="enquiry"
      urlLabel="Product or company URL"
      action={ENDPOINTS.enquiry}
      /* The form is the band's primary object (home round 3): lg fields, the submit across the
         panel, so the one solid on the band is the widest thing in it. */
      dress={treatment.dress}
      /* A dressed form is compact (owner, 16 Oct 2026: the close fits one laptop screen). */
      fieldScale={treatment.dress ? 'md' : 'lg'}
      submit={treatment.dress ? 'inline' : 'full'}
      caption={after}
      success={
        conversion?.onSuccess
          ? { heading: conversion.onSuccess.heading, body: conversion.onSuccess.body }
          : undefined
      }
      context={{
        originRoute: page.route,
        placement: 'corpus-close',
        family: page.pageType,
        serviceOrAudit: page.slug,
        referrer: '',
        campaign: '',
      }}
    />
  );
}

/* ── Legend (M17) ─────────────────────────────────────────────────────────────── */

/**
 * M17's legend: a table whose rows are peers becomes cards, and its two header words are set ONCE
 * above the set, "header 1 → header 2", so they survive without a repeated eyebrow on every card.
 * Template-local markup in the eyebrow voice; the arrow is decoration.
 */
export function TableLegend({ from, to }: { from: string; to: string }) {
  return (
    <Cluster colGap="tight" align="center" className={styles.legend}>
      <span>{from}</span>
      <span className={styles.legendMark}>
        <Icon name="arrow-right" size="sm" />
      </span>
      <span>{to}</span>
    </Cluster>
  );
}

/* ── Generic fallback ─────────────────────────────────────────────────────────── */

/**
 * A band whose shape no template rule names yet: every block in order, as plain kit units. It exists
 * so a page of a shape the plan has not met still shows every word in its place, never a dropped
 * band. A shape that reaches here is a planning gap, and the template says so in development.
 */
export function GenericBlocks({ band }: { band: CorpusBand }) {
  return (
    <Layout rowGap="block">
      {band.blocks.map((block, index) => (
        <Fragment key={index}>{genericBlock(block)}</Fragment>
      ))}
    </Layout>
  );
}

function genericBlock(block: CorpusBlock): ReactNode {
  switch (block.type) {
    case 'paragraph':
      return <p>{renderInline(block.runs)}</p>;
    case 'labelled':
      return (
        <p>
          <strong>{renderInline(block.label)}</strong> {renderInline(block.body)}
        </p>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag>
          {block.items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </Tag>
      );
    }
    case 'table':
      return (
        <DataTable
          keyColumn={{ heading: plain(block.header[0] ?? []) }}
          columns={block.header.slice(1).map((cell) => ({ heading: plain(cell) }))}
          rows={block.rows.map((row) => ({
            header: plain(row[0] ?? []),
            cellsHtml: row.slice(1).map(inline),
          }))}
        />
      );
    case 'quote':
      return <QuoteCompact block={block} />;
    case 'links':
      return (
        <Layout rowGap="block">
          {block.links.map((link, index) => (
            <CtaRow
              key={index}
              rule={false}
              actions={[{ label: link.labelText, href: link.href }]}
            />
          ))}
        </Layout>
      );
    case 'item':
      return (
        <Layout rowGap="text">
          <h3>{block.headingText}</h3>
          {block.blocks.map((inner, index) => (
            <Fragment key={index}>{genericBlock(inner)}</Fragment>
          ))}
        </Layout>
      );
    case 'form':
    case 'comment':
      return null;
  }
}
