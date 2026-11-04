import type { ComponentType } from 'react';

import {
  Button,
  Cluster,
  isSituationFigureName,
  Layout,
  SituationFigure,
  Sketch,
  type IconName,
} from '@/components';
import {
  Banner,
  Bento,
  BlockCard,
  BlockCardSet,
  CaseCard,
  ContentSection,
  ContentSectionText,
  CtaRow,
  Gateway,
  GatewayPaths,
  OfferSheet,
  ProcessFlow,
  Teaser,
  TEASER_FORMAT_ICON,
  type TeaserFormat,
  type BentoItem,
  type BlockCardSetItem,
  type GatewayItem,
  type GatewayPath,
  type HeroStat,
  type ReasonsItem,
} from '@/patterns';
import { splitClaim } from '@/lib/claim';
import { caseRouteOf, insightRouteOf } from '@/lib/corpus-cases';
import { corpusImage } from '@/lib/corpus-images';
import type {
  CorpusBand,
  CorpusBlock,
  CorpusCaseRef,
  CorpusInsightRef,
  CorpusMediaBinding,
  CorpusPage,
  PlaceholderReasons,
  ProposedEyebrows,
} from '@/lib/corpus-types';
import { getKitPhoto, HOME_SECTOR_PHOTOS } from '@/lib/photos';
import { placeholderImage } from '@/lib/placeholders';
import { ROUTES } from '@/lib/routes';
import { serviceSceneFor, sketchForRoute } from '@/lib/sketches';
import { recordFigures } from '@/lib/studio-record';

import {
  CorpusHero,
  QuoteGroupBand,
  RecognitionGrid,
  bodyOf,
  head,
  headingIdOf,
  type AvatarsById,
  type RatingsById,
} from './blocks';
import {
  AskIsland,
  LinkActions,
  RelatedBand,
  askLinkIn,
  content,
  entriesOf,
  isAskLink,
  sheetParts,
} from './CopyBands';
import { bindingNamed, coverFor, slugOf } from './images';
import { UnitView, type OfferContext } from './OfferBands';
import { planOffer, TEMPLATE_BANDS } from './plan';
import { bandLinks, inline, labelTitle, leadOf, plain, trimEnd, trimStart } from './text';

export type HomePageProps = {
  page: CorpusPage;
  caseRefs?: Readonly<Record<string, CorpusCaseRef>>;
  /**
   * The insights the page links, as each piece's own corpus page describes it (format and length),
   * by live route (`getInsightRefs`). A piece with none shows no meta column facts.
   */
  insightRefs?: Readonly<Record<string, CorpusInsightRef>>;
  shared?: Readonly<Record<string, CorpusMediaBinding>>;
  /**
   * Star ratings for the page's testimonials, by testimonial id, as the route read them from the
   * content seam (PLACEHOLDERS today: fixtures/testimonial-ratings.ts). A quote with none shows no
   * stars.
   */
  ratings?: RatingsById;
  /**
   * Avatar portraits for the page's testimonials, by testimonial id (PLACEHOLDERS today:
   * fixtures/testimonial-avatars.ts, home round 3). A quote with none shows no avatar.
   */
  avatars?: AvatarsById;
  /**
   * The reasons "Why teams choose Tcules" shows (PLACEHOLDERS: fixtures/placeholder-reasons.ts, P48).
   * With none the band is not shown: the corpus's four reasons do not fill the Reasons band.
   */
  reasons?: PlaceholderReasons | null;
  /** Eyebrows proposed for bands the corpus authors without one, by band id (PROPOSED, P49). */
  eyebrows?: ProposedEyebrows;
  /** A Why Tcules reason's drawing by its authored title, as OfferPage takes it (component-map C1). */
  reasonFigure?: OfferContext['reasonFigure'];
};

type ItemBlock = Extract<CorpusBlock, { type: 'item' }>;
type ParagraphBlock = Extract<CorpusBlock, { type: 'paragraph' }>;

const items = (b: CorpusBand): ItemBlock[] =>
  b.blocks.filter((block): block is ItemBlock => block.type === 'item');

const paragraphRuns = (blocks: readonly CorpusBlock[]) =>
  blocks.flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));

/** Every lone-link line of an item, as links, in order. */
const linkLines = (item: ItemBlock | undefined) =>
  (item?.blocks ?? []).flatMap((block) => (block.type === 'links' ? block.links : []));

/**
 * TIER 3 — the home page, from the `_pages/` corpus (page-mapping § 4.1, as redrawn in Home rounds
 * 1 to 3, 10–11 Oct 2026).
 *
 * The narrative is the content team's, band for band. Inside each band the information is DESIGNED,
 * never paraphrased (owner, 10 Oct 2026: "we are allowed to design the content"): the hero's record
 * line becomes three figures inside the hero, the client names become the logo wall the Clutch score
 * leads, the situations become a scannable set of decisions, the two quoted cases are featured with
 * their clients' words as each case's twin panel, the reasons are a set each headed by the
 * drawing of its claim, and the client voices are a wall of rated cards. The one reorder is shared by
 * every corpus page: the form sits directly above the questions (order.ts).
 *
 * Shapes down the page, so no two neighbours are one rectangle: a split hero with its figures · a
 * boxed logo wall · the six situations as a one-column typographic router · two case-and-quote
 * diptychs, then a lighter pair · six icon boxes · four reasons 2×2, each under its drawing · a wall
 * of rated cards on tint · a photo banner · eight sector cards · the form panel on tint · the
 * questions. The hero's solid is the page's one blue ask; the form's submit repeats it.
 */
export function HomePage({
  page,
  caseRefs = {},
  insightRefs = {},
  shared = {},
  ratings,
  avatars,
  reasons,
  eyebrows,
  reasonFigure,
}: HomePageProps) {
  /* The plan decides every band's kind and surface, and the form sits right before the questions. */
  const units = planOffer(page);
  const ctx: OfferContext = { page, caseRefs, shared, ratings, avatars, reasonFigure };
  /* The logo wall is the hero's foot row, full width under the split (owner, 4 Nov 2026, homepage
     pass), so its band renders nothing of its own (Recognition, below). */
  const recognition = page.bands.find((band) => band.id === 'client-recognition');
  return (
    <>
      <CorpusHero
        page={page}
        arrangement="beside"
        media={{
          type: 'scene',
          scene: 'arena',
          title:
            'A field of similar grey apps, each made by one person at a prompt. One app stands out, rises and opens: underneath, a client and a researcher talk while an AI agent sorts what they say; a designer chooses one of several options the agent proposes; an engineer and an agent build it, with questions passing back and forth. The finished card flies up into the app, which now shows a clear new screen in place of a cluttered old one.',
        }}
        proofLine={false}
        stats={recordStats(page)}
        foot={recognition ? <RecognitionGrid band={recognition} /> : undefined}
      />
      {units.map((unit) => {
        const b = unit.band;
        /* Why Tcules on home renders as on every other page: the plan's Reasons, one illustration
           per reason (owner, 3 Nov 2026, superseding 2026-10-30-home-reasons-beside-words-only: the
           3 Nov copy's six reasons are the services pages' six, so one drawn set serves both). */
        const Band = unit.part === 'b' ? undefined : BANDS[b.id];
        /* Home composes its own bands (the table below); every other band of the copy renders as
           the plan names it, so no band is ever skipped (component-map § E, 29 Oct 2026). */
        if (!Band) return <UnitView key={unit.id} unit={unit} ctx={ctx} />;
        return (
          <Band
            key={unit.id}
            page={page}
            b={b}
            ratings={ratings}
            avatars={avatars}
            reasons={reasons}
            eyebrows={eyebrows}
            caseRefs={caseRefs}
            insightRefs={insightRefs}
          />
        );
      })}
    </>
  );
}

type BandProps = {
  page: CorpusPage;
  b: CorpusBand;
  ratings?: RatingsById;
  avatars?: AvatarsById;
  reasons?: PlaceholderReasons | null;
  eyebrows?: ProposedEyebrows;
  caseRefs?: Readonly<Record<string, CorpusCaseRef>>;
  insightRefs?: Readonly<Record<string, CorpusInsightRef>>;
};

/* ── 0 · the studio's record, as three figures in the hero ───────────────────────── */

/**
 * The hero's record line is the page's first credibility, so it is set as figures rather than a
 * bullet line (owner, 10 Oct 2026, note 1; 29 Oct 2026, decisions/2026-10-29-studio-record-is-figures):
 * one Stat per fact, the figure large and blue, what it counts under it. The split is one table for
 * every page (src/lib/studio-record.ts).
 *
 * INSIDE THE HERO (owner, home round 3, 11 Oct 2026: "could the facts/figures section be integrated
 * into the hero so it doesn't take one entire section"): PageHero's `stats` row, under the actions.
 */
export function recordStats(page: CorpusPage): HeroStat[] {
  const [line] = page.hero.proofLines;
  return line ? recordFigures(plain(line)) : [];
}

/* ── 1 · who has worked with us, led by the one independent score ─────────────────── */

/**
 * The kit home's approved band (kit/home 2): the boxed LogoGrid led by the Clutch RatingBadge, one
 * band, centred (owner, 10 Oct 2026, notes 2 and 3).
 *
 * EVERY CELL IS A REAL LOGO FILE (owner, home round 3, 11 Oct 2026: "we probably have logos for most
 * if not all the clients. please use them"). The corpus names six clients; the studio holds files
 * for two of them (Doodle's SVG, Eden AI's trimmed PNG), so those lead, in the corpus's order, and the
 * rest of the approved in-house set follows — the full wall the kit home was approved with (nine
 * marks) plus Eden AI, ten in all: 4 + 4 + a closing pair at 1440, 2 × 5 on a phone. A client with no
 * file (Dealpath, Benchmark Gensuite, JoVE, Ringier) is NOT typeset as a wordmark any more: names in
 * a wall of logos read as a list (round 3). Their files are registered as needed
 * (docs/image-register.md); each replaces nothing and joins the wall when it arrives. P41 notes the
 * wall shows clients the corpus does not name.
 *
 * NO LINE UNDER THE GRID (owner, home round 2): the badge IS the link to the Clutch profile.
 */
function Recognition() {
  /* Drawn inside the hero as its foot row (HomePage). */
  return null;
}

/* ── 2 · six situations, the gateway to the services ──────────────────────────────── */

/**
 * The situation band's items as Gateway rows: each `###` situation, its one paragraph (plain: the
 * band authors no inline link in a situation), and its lone link line, whose label names the
 * service. Exported so /design/kit/gateway proves every arrangement on the real corpus words.
 */
export function gatewayItems(b: CorpusBand): GatewayItem[] {
  return items(b).flatMap((item) => {
    const para = item.blocks.find((x): x is ParagraphBlock => x.type === 'paragraph');
    const target = linkLines(item)[0];
    if (!target) return [];
    return [
      {
        id: slugOf(item.headingText),
        title: item.headingText,
        body: para ? plain(para.runs) : '',
        href: target.href,
        service: target.labelText,
        /* A drawing of the service each situation leads to, in the answer (owner, 12 Oct 2026:
           "similar design here on the homepage with some visual element in the content area"). */
        ...(sketchForRoute(target.href)
          ? {
              visual: <Sketch name={sketchForRoute(target.href)!} />,
            }
          : {}),
      },
    ];
  });
}

/**
 * The band's items for Gateway's `board`: each situation with its own SituationFigure in place of
 * the service sketch (round 11). Exported so /design/kit/gateway shows the board on the real words.
 */
export function gatewayBoardItems(b: CorpusBand): GatewayItem[] {
  return gatewayItems(b).map((item) => {
    const scene = sketchForRoute(item.href);
    return {
      ...item,
      visual:
        scene && isSituationFigureName(scene) ? <SituationFigure name={scene} /> : undefined,
    };
  });
}

/**
 * The page's gateway: "which of these is me?" (owner, round 6, 11 Oct 2026: "i may not know if i
 * need product design service or design system service, but i'll probably know if i want to launch
 * a new product"). Rounds 1–10 tried a selector, grids, tiles and rows. Round 11 (19 Oct 2026, locked
 * from a hi-fi mock) is Gateway's `board`: all six at once on paper, three across, each with a
 * SituationFigure that tells its situation in two states and plays on hover; no link line, the
 * whole item links. The head is a proposed eyebrow over the centred heading (P49). One fold at 1440.
 */
/**
 * The 26 Oct copy's two paths as GatewayPaths items: each `###` path, its paragraphs (plain: the copy
 * authors no inline link in a path), and its links in the authored order, whether written as a list
 * of links or as link lines, each with its service's own scene for its graphic card
 * (decisions/2026-10-31-paths-graphic-cards). Exported so /design/kit/gateway proves the paths form on the real words.
 */
export function gatewayPaths(b: CorpusBand): GatewayPath[] {
  return items(b).flatMap((path) => {
    const links = path.blocks.flatMap((block) => {
      if (block.type === 'links') {
        /* The ask filed under the last path ("Book a call") is not a service: Situations sets it as
           its own island (owner, 3 Nov 2026). */
        return block.links
          .filter((link) => !isAskLink(link))
          .map((link) => ({ label: link.labelText, href: link.href }));
      }
      if (block.type === 'list') {
        return block.items.flatMap((item) =>
          item.length === 1 && item[0]?.type === 'link'
            ? [{ label: plain(item[0].children), href: item[0].href }]
            : [],
        );
      }
      return [];
    });
    if (links.length === 0) return [];
    const paragraphs = paragraphRuns(path.blocks);
    /* A first paragraph wholly italic ("*New product*") names the kind of product the path is for:
       the card's label, not its first line (v2.1 copy, 4 Nov 2026). A paragraph opening "Example:"
       is the path's example, kept whole with its case link (decisions/2026-11-02-examples-are-one-
       pattern: the example is set apart from the argument). */
    const [first] = paragraphs;
    const only = first?.length === 1 ? first[0] : undefined;
    const eyebrow = only?.type === 'em' ? plain(only.children).trim() : undefined;
    const isExample = (runs: (typeof paragraphs)[number]) => /^\s*Example:/.test(plain(runs));
    const example = paragraphs.find(isExample);
    const words = paragraphs
      .filter((runs) => runs !== first || !eyebrow)
      .filter((runs) => !isExample(runs));
    return [
      {
        id: slugOf(path.headingText),
        title: path.headingText,
        body: words.map((runs) => plain(runs)),
        ...(eyebrow ? { eyebrow } : {}),
        ...(example
          ? { example: <span dangerouslySetInnerHTML={{ __html: inline(example) }} /> }
          : {}),
        /* Each service's own scene, the one its service page draws; none borrowed (owner, 31 Oct
           2026; decisions/2026-10-31-paths-graphic-cards). */
        links: links.map((link) => {
          const scene = serviceSceneFor(link.href);
          return scene ? { ...link, scene } : link;
        }),
      },
    ];
  });
}

/**
 * The page's gateway: "which of these is me?" (owner, round 6, 11 Oct 2026: "i may not know if i
 * need product design service or design system service, but i'll probably know if i want to launch
 * a new product"). Round 11 (19 Oct 2026) locked Gateway's `board`, six single-link situations each
 * with its SituationFigure. The 26 Oct copy has TWO paths, each with two or three services, so it
 * takes GatewayPaths: each path a small label and its words, its services as graphic cards on equal
 * tracks, the head at the band's left (owner, 31 Oct 2026: mock round 2, 3b with phone B;
 * decisions/2026-10-31-paths-graphic-cards). A band still written as six single-link situations keeps
 * the board, centred as it was.
 */
function Situations({ b, eyebrows }: BandProps) {
  const paths = gatewayPaths(b);
  const multi = paths.some((path) => path.links.length > 1);
  const ask = askLinkIn(b);
  /* The v2.1 copy's three doors, each named by its kind of product (owner, 4 Nov 2026, homepage
     pass): a classic three-card set under the head, each card its label, title, words, example and
     two ways in, then the band's ask centred under the set as the page's main action repeated — a
     primary solid in the band, as the owner asked (decisions/2026-11-04-where-to-start-doors). */
  if (paths.length > 0 && paths.every((path) => path.eyebrow)) {
    return (
      /* On tint, the cards on paper: the set reads as three objects on a ground (owner, 4 Nov 2026:
         "this needs to be cleaner"). */
      <ContentSection
        {...head(b)}
        eyebrow={eyebrows?.[b.id]}
        data-band="C-router"
        surface="tint"
      >
        <GatewayPaths paths={paths} form="cards" />
        {ask ? (
          <Cluster justify="center">
            <Button as="a" href={ask.href} size="md">
              {ask.labelText}
            </Button>
          </Cluster>
        ) : null}
      </ContentSection>
    );
  }
  return multi ? (
    <>
      <ContentSection {...head(b)} eyebrow={eyebrows?.[b.id]} data-band="C-router">
        <GatewayPaths paths={paths} />
      </ContentSection>
      {ask ? <AskIsland link={ask} /> : null}
    </>
  ) : (
    <ContentSection {...head(b)} eyebrow={eyebrows?.[b.id]} align="center" data-band="C-router">
      <Gateway items={gatewayBoardItems(b)} arrangement="board" />
    </ContentSection>
  );
}

/* ── 2b · one studio: the four disciplines as a row of drawn tiles ───────────────── */

/**
 * "One studio, from the first question to working software": two paragraphs and a link row of the
 * four disciplines (component-map C11, built straight to hi-fi 29 Oct 2026).
 *
 * The heading runs the full width and the four disciplines sit under it as the approved What-we-do
 * Bento, four equal tiles on four tracks, each the service's name and its scene (the copy writes no
 * line per service, so the tiles carry none: Bento `body` is optional). Clickable cards sit under
 * their full-width head (2026-10-09), so the head is never a `beside` track.
 *
 * The two paragraphs are the band's argument in two beats, the centre and what sits around it, so
 * they are set as two columns on the bento's own grid: the first over the first two tracks, the
 * second over the last two, one `gutter` apart exactly as the tiles are. Stacked as a lead over a
 * body paragraph they read as two voices at two measures; side by side they read as one spread, and
 * the row of tiles under them answers both. One column below 1024.
 */
function OneStudio({ b }: BandProps) {
  const paras = paragraphRuns(b.blocks);
  const tiles: BentoItem[] = bandLinks(b).flatMap((link) => {
    const scene = sketchForRoute(link.href);
    return scene ? [{ id: link.href, title: link.labelText, href: link.href, scene }] : [];
  });
  return (
    <ContentSection {...head(b)} data-band="C-bento">
      {paras.length > 0 ? (
        /* One lead column, the paragraphs stacked: set two across, they read as a split rather than
           as the band's lead (review 29 Oct). */
        <Layout rowGap="text">
          {paras.map((runs, index) => (
            <ContentSectionText key={index}>
              <p>{plain(runs)}</p>
            </ContentSectionText>
          ))}
        </Layout>
      ) : null}
      <Bento items={tiles} tracks={4} />
    </ContentSection>
  );
}

/* ── 2c · the people, and how the designers use AI ─────────────────────────────── */

/* ── 3 · selected work: every case as a horizontal case card ───────────────────────── */

/**
 * Where a case cover is cropped (Media `focus`) in the one 16:9 card box (home round 3). Every
 * cover is cut. The two featured cases carry their case-study thumbnails, the covers /case-studies
 * shows (19 Oct 2026). Those are square masters, so each keeps a band 56% of its height: Doodle's
 * its mark and booking header over the bookable rows, Eden AI's the toolbar and the workflow's nodes. The listed pair carry
 * wide artefacts, 1.5:1 (Dealpath) and 3.3:1 (Benchmark Gensuite): Benchmark anchors on its first
 * panel (at 16:9 the centre of the board cut both panels in half), Dealpath on its top. Art
 * direction a CMS field would carry as a focal point (docs/strapi-changes.md); here it is the
 * template's, keyed by binding id. Each case needs a 16:9 master (docs/image-register.md), which
 * ends the cropping.
 */
const COVER_FOCUS: Readonly<Record<string, { x: number; y: number }>> = {
  home_doodle_cover: { x: 0.5, y: 0.15 },
  home_dealpath_workflow: { x: 0.5, y: 0 },
  home_benchmark_scope_selector: { x: 0, y: 0.5 },
  home_eden_ai_cover: { x: 0.5, y: 0.3 },
};

/**
 * Every case as one horizontal CaseCard (owner, 29 Oct 2026; supersedes home round 2's "featured,
 * then listed"): the cover beside the claim on the card's paper-deep ground, a `gutter` apart, every
 * second card mirrored. The client's name before the title's colon is the card's eyebrow, the rest
 * its claim (splitClaim). No quote is shown on a card (owner, 22 Oct 2026); the client's words stay in
 * the page's own testimonial band.
 *
 * A HOME shape: home emphasises its case studies. Every other page's selected work stays the
 * three-across BlockCard grid (OfferBands), where the cases are paths to more content.
 */
function SelectedWork({ page, b, caseRefs = {} }: BandProps) {
  const cases = items(b);
  /* Each case ends on its own "Read the … case" line. The band's closing link ("See all case
     studies") is authored after the last case, so the parser files it under that case: the last link
     line of the last case is the band's, and the case keeps the one before it. */
  const lastLines = linkLines(cases.at(-1));
  const closing = lastLines.length > 1 ? lastLines.at(-1) : undefined;

  /* What a case card and a featured case both read from one authored item. */
  const parts = (item: ItemBlock, index: number) => {
    const lines = linkLines(item);
    const link = index === cases.length - 1 && closing ? lines.at(-2) : lines.at(-1);
    /* The client's name before the colon names the artefact: a title's other words can name
       another case's ("Eden AI: one way into the workflow builder" against Dealpath's
       `home_dealpath_workflow`). */
    const binding = bindingNamed(page, item.headingText.split(':')[0] ?? item.headingText);
    const focus = binding ? COVER_FOCUS[binding.id] : undefined;
    /* A first paragraph wholly italic ("*Doodle · New product*") is the case's tag: the card's
       eyebrow (v2.1 copy), not a line of its story. */
    const all = paragraphRuns(item.blocks);
    const only = all[0]?.length === 1 ? all[0][0] : undefined;
    const tag = only?.type === 'em' ? plain(only.children).trim() : undefined;
    const paragraphs = tag ? all.slice(1) : all;
    const story =
      paragraphs.length === 1 && paragraphs[0]
        ? bodyOf(paragraphs[0])
        : { bodyHtml: paragraphs.map((runs) => `<p>${plain(runs)}</p>`) };
    const image = binding
      ? { ...corpusImage(binding), ...(focus ? { focus } : {}) }
      : undefined;
    return { link, story, image, tag };
  };

  const card = (item: ItemBlock, index: number) => {
    const { link, story, image } = parts(item, index);
    return (
      <BlockCard
        key={item.headingText}
        size="md"
        titleAs="h3"
        title={item.headingText}
        {...story}
        href={link?.href}
        ctaLabel={link?.labelText}
        cue="cta"
        media={image ? { type: 'image', image } : undefined}
      />
    );
  };

  /* Every case is one horizontal CaseCard on its paper-deep ground, the second mirroring the first
     (owner, 29 Oct 2026; decisions/2026-10-29-home-selected-work-is-case-cards): home emphasises its
     case studies, so each gets the row. Every other page sets its selected work as the three-across
     BlockCard grid (OfferBands), because there the cases are paths to more content. The cover is the
     page's binding that names the case, else the case's own cover, else its placeholder (coverFor). */
  /* Below 768 the cases are one swipe row, one card in view and the next peeking (owner, 4 Nov 2026:
     "on phone, we can keep the case study cards in a horizontal scroll to save space"); every card
     is a link, so the row is reachable by Tab, and every case is in the page as it loads. */
  const body = (
    <Layout rowGap="gutter" colGap="gutter" columns={1} scroll="until-md">
      {cases.map((item, index) => {
        const { link, story, image, tag } = parts(item, index);
        /* A case without its link falls back to the plain card. */
        if (!link) return <ul key={item.headingText}>{card(item, index)}</ul>;
        const cover =
          image ??
          coverFor(
            page,
            item.headingText.split(':')[0] ?? item.headingText,
            caseRefs[caseRouteOf(link.href)],
          );
        return (
          <CaseCard
            key={item.headingText}
            {...splitClaim(item.headingText)}
            {...(tag ? { eyebrow: tag } : {})}
            {...story}
            href={link.href}
            ctaLabel={link.labelText}
            image={cover}
            reverse={index % 2 === 1}
          />
        );
      })}
    </Layout>
  );
  return closing ? (
    <ContentSection
      {...head(b)}
      data-band="M"
      actionsAt="end"
      actions={<LinkActions links={[closing]} />}
    >
      {body}
    </ContentSection>
  ) : (
    <ContentSection {...head(b)} data-band="M">
      {body}
    </ContentSection>
  );
}

/* ── 4 · what we do: six services as a bento ─────────────────────────────────────── */

/**
 * The second way into the services, and visibly a different one from the gateway's board above it
 * (owner, 10 Oct 2026, note 6): a Bento (owner, 19 Oct 2026, What we do mocks S3). Six tiles on two
 * rows of four tracks, each the service's name, its line and its Sketch scene over the row's
 * texture. The sizes carry the band's own argument — "Product Design is at the heart of every
 * project" — so Product Design is wide at the start and Software Development wide at the end, the
 * four that apply it between. The label's closing full stop is the run-in's punctuation, not part of
 * the service's name, so the tile's title drops it. A service with no scene is left out, with a
 * warning: a tile without its drawing would be the one hole in the set.
 */
function Capabilities({ b }: BandProps) {
  const intro = b.blocks.find((x): x is ParagraphBlock => x.type === 'paragraph' && !leadOf(x));
  const tiles: BentoItem[] = b.blocks.flatMap((block) => {
    const lead = leadOf(block);
    if (!lead) return [];
    const link = lead.label.find((run) => run.type === 'link');
    const href = link?.type === 'link' ? link.href : undefined;
    const title = labelTitle(lead.label).replace(/\.$/, '');
    const scene = href ? sketchForRoute(href) : undefined;
    if (!href || !scene) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`HomePage: "${title}" has no service scene; its tile is not rendered.`);
      }
      return [];
    }
    return [{ id: href, title, body: plain(lead.body).trim(), href, scene }];
  });
  /* Six is the shape the diagonal is drawn for: wide, single, single / single, single, wide. Any
     other count stays four single tiles a row. */
  const placed: BentoItem[] =
    tiles.length === 6
      ? tiles.map((tile, index) => (index === 0 || index === 5 ? { ...tile, span: 2 } : tile))
      : tiles;
  return (
    <ContentSection
      {...head(b)}
      data-band="C-bento"
      lead={intro ? plain(intro.runs) : undefined}
    >
      <Bento items={placed} />
    </ContentSection>
  );
}

/* ── 5 · why Tcules: the head beside the three claims, words only ─────────────────── */

/**
 * Home's three reasons as the 26 Oct copy authors them: each its title and its sentence, with the
 * sentence's own links (owner, 30 Oct 2026; decisions/2026-10-30-home-reasons-beside-words-only).
 * The sentences already name the clients, the live case and the tenures, so nothing is pulled out of
 * them into a picture or a figure. Undefined when the band has no items, so the plan's Reasons renders.
 */
export function whyTcules(b: CorpusBand): ReasonsItem[] | undefined {
  const parts = sheetParts(b);
  if (parts.items.length === 0) return undefined;
  return parts.items.flatMap((item) =>
    item.title
      ? [
          {
            title: item.title,
            body: item.bodyHtml ? (
              <span dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
            ) : (
              (item.body ?? '')
            ),
          },
        ]
      : [],
  );
}

/**
 * Each reason's glyph, by its title as authored (owner, 4 Nov 2026, homepage pass: "each title gets an
 * inline icon"). A title the copy renames drops the glyphs from the whole set, so a stale map never
 * shows a set with holes.
 */
const WHY_GLYPHS: Readonly<Record<string, IconName>> = {
  'Fluent in SaaS': 'layers',
  'Idea to launch': 'flag',
  'Craft people notice': 'eye',
  'Evidence before screens': 'clipboard-check',
  'Seen your problem before': 'users-group-rounded',
  'Start small': 'hand-shake',
};

/**
 * Why Tcules on home: the heading at the left with its way deeper under it, the six reasons down the
 * right, one ruled row each, its glyph inline before its title and its sentence under it (owner,
 * 4 Nov 2026, homepage pass: "simplify and bring it back to the heading left list right structure";
 * decisions/2026-11-04-home-why-is-a-list, superseding the proposed 2026-11-03 illustrations). Home
 * only: the offer pages keep the plan's Reasons. A reason whose title has no glyph sets the whole
 * list without glyphs, so nothing is dropped and the set never mixes.
 */
function WhyTcules({ b }: BandProps) {
  const parts = sheetParts(b);
  /* The run-in's closing full stop is its punctuation, not part of the reason's name. */
  const titled = parts.items.map((item) => ({
    ...item,
    title: item.title?.replace(/\.$/, ''),
  }));
  /* A set is all-glyph or all-text (OfferSheet): one title the map does not know drops every glyph. */
  const glyphs = titled.every((item) => item.title && WHY_GLYPHS[item.title]);
  const items = titled.map((item) =>
    glyphs && item.title ? { ...item, icon: WHY_GLYPHS[item.title] } : item,
  );
  const links = parts.after.flatMap((block) => (block.type === 'links' ? block.links : []));
  return (
    <OfferSheet
      {...head(b)}
      arrangement="list"
      lead={parts.lead}
      items={items}
      note={links.length > 0 ? <LinkActions links={links} /> : undefined}
    />
  );
}

/* ── 6 · what clients say: the voices as one wall of rated cards ─────────────────── */

function ClientVoices({ b, ratings, avatars }: BandProps) {
  return <QuoteGroupBand band={b} ratings={ratings} avatars={avatars} />;
}

/* ── 7 · how we use AI: one idea and one link ────────────────────────────────────── */

function AiPractice({ page, b }: BandProps) {
  /* The v2.1 copy (4 Nov 2026): one line, then the run as steps ("1. **AI:** Checks your live
     product…"), then the link. Each step's bold label is who acts, its words what they do: the
     flow's stages, in order, under the head; the link the band's action. */
  const list = b.blocks.find(
    (block): block is Extract<CorpusBlock, { type: 'list' }> =>
      block.type === 'list' && block.ordered,
  );
  const stages = (list?.items ?? []).flatMap((runs) => {
    const [first, ...rest] = runs;
    if (first?.type !== 'strong') return [];
    return [
      {
        label: plain(first.children).trim().replace(/[:.]$/, ''),
        items: [plain(trimStart(rest))],
      },
    ];
  });
  if (stages.length >= 2) {
    const intro = paragraphRuns(b.blocks).find(
      (runs) => !runs.some((run) => run.type === 'link'),
    );
    const link = bandLinks(b)[0];
    return (
      <ContentSection
        {...head(b)}
        data-band="F"
        lead={intro ? plain(intro) : undefined}
        footer={
          link ? (
            <CtaRow
              rule={false}
              actions={[{ label: link.labelText.replace(/\s*→\s*$/, ''), href: link.href }]}
            />
          ) : undefined
        }
      >
        <ProcessFlow stages={stages} />
      </ContentSection>
    );
  }
  const [lead, ...rest] = paragraphRuns(b.blocks);
  /* The band's link closes its last paragraph ("… [See a typical AI-assisted design run](…)"): the
     link is the banner's action, and the sentence before it stays, under the lead. */
  const last = rest.at(-1);
  const trailing = last?.at(-1)?.type === 'link' ? last.at(-1) : undefined;
  const link =
    trailing && trailing.type === 'link'
      ? { href: trailing.href, labelText: plain(trailing.children) }
      : bandLinks(b)[0];
  const support = rest
    .map((runs, index) =>
      index === rest.length - 1 && trailing ? trimEnd(runs.slice(0, -1)) : runs,
    )
    .filter((runs) => plain(runs).trim().length > 0);
  return (
    <Banner
      form="beside"
      mediaSide="start"
      headingId={headingIdOf(b)}
      heading={b.headingText}
      /* The words in their order: both paragraphs as the lead, at one role and measure (the
         sentence before the link is the lead going on, not a body at another ink), then the link
         as the action. */
      lead={[...(lead ? [plain(lead)] : []), ...support.map((runs) => plain(runs))]}
      actions={
        link ? (
          <CtaRow rule={false} actions={[{ label: link.labelText, href: link.href }]} />
        ) : undefined
      }
      image={{ ...placeholderImage(page.route, b.id), kind: 'photograph' }}
    />
  );
}

/* ── 8 · the products we know: eight sectors, each with its picture ──────────────── */

/**
 * Eight sectors as image cards (owner, 10 Oct 2026, note 9), four across from 1024 and two across on a
 * phone — never one per row, never a scroll row (BlockCardSet `phone="pair"`). Each card's picture is
 * its sector's stock photograph (owner, 26 Oct 2026: the main part of the sector's activity, close,
 * no faces), else its register slot.
 */
function Expertise({ page, b }: BandProps) {
  /* "See all industries →" (3 Nov 2026 copy) is the band's action in the head, never a sector card
     (owner, 3 Nov 2026), as IndustriesBand sets it on every other page. */
  const onward = bandLinks(b).filter((link) => link.href === ROUTES.expertise);
  const sectors = bandLinks(b).filter((link) => link.href !== ROUTES.expertise);
  const cards: BlockCardSetItem[] = sectors.map((link) => {
    const photo = HOME_SECTOR_PHOTOS[link.href];
    return {
      id: link.href,
      title: link.labelText,
      href: link.href,
      media: {
        type: 'image',
        image: photo
          ? getKitPhoto(photo)
          : placeholderImage(page.route, b.id, slugOf(link.labelText)),
      },
    };
  });
  return (
    <ContentSection
      {...head(b)}
      data-band="C-image"
      actionsAt="end"
      actions={onward.length > 0 ? <LinkActions links={onward} /> : undefined}
    >
      <BlockCardSet items={cards} lead="none" across={4} cue="title" phone="pair" />
    </ContentSection>
  );
}

/* ── 7 · selected thinking: a resource listing, one piece per row ────────────────────── */

/** A piece's format as its own page names it (`page_type`), in words: `article` → "Article". */
const formatLabel = (pageType: string) =>
  pageType.charAt(0).toUpperCase() + pageType.slice(1).replace(/_/g, ' ');

/** A piece's format glyph (owner, 29 Oct 2026: the resource rows "can have format icons"), from the
    one format map; a format it does not know shows no glyph rather than a wrong one. */
const formatIcon = (pageType: string): IconName | undefined =>
  pageType in TEASER_FORMAT_ICON ? TEASER_FORMAT_ICON[pageType as TeaserFormat] : undefined;

/**
 * "Selected thinking from the studio" as a resource listing (owner, 29 Oct 2026): ONE piece per row
 * at the column's full width, the rows ruled, each row one link (Teaser `row`, `metaAside`, `ruled`,
 * `arrow`). The meta column holds the piece's format and its length as the piece's OWN corpus page
 * displays them (insightRefs; never a word nobody authored); the title is the row's anchor with the
 * summary under it, and an arrow ends the row. A band with anything other than linked entries keeps
 * the shared related-reading list (RelatedBand), so no block is dropped.
 */
function Insights({ b, insightRefs = {} }: BandProps) {
  const blocks = content(b);
  const [first] = blocks;
  const leadText =
    first?.type === 'paragraph' && !first.runs.some((run) => run.type === 'link')
      ? plain(first.runs)
      : undefined;
  const { entries, rest } = entriesOf(leadText ? blocks.slice(1) : blocks);
  if (rest.length > 0 || entries.length === 0 || entries.some((entry) => !entry.href)) {
    return <RelatedBand band={b} />;
  }
  return (
    <ContentSection {...head(b)} data-band="K" lead={leadText}>
      <Layout as="ul" rowGap="none">
        {entries.map((entry) => {
          const href = entry.href ?? '';
          const ref = insightRefs[insightRouteOf(href)];
          return (
            <Teaser
              key={href}
              arrangement="row"
              metaAside
              ruled
              arrow
              size="lg"
              title={entry.title}
              href={href}
              body={entry.body}
              label={ref ? formatLabel(ref.format) : undefined}
              icon={ref ? formatIcon(ref.format) : undefined}
              meta={ref?.length ? [ref.length] : undefined}
            />
          );
        })}
      </Layout>
    </ContentSection>
  );
}

/* ── The band table: the content team's ids, each to its renderer ─────────────────── */

/** Home's own bands (plan.ts `TEMPLATE_BANDS['/']`); every other band renders as the plan names it. */
const HOME_BANDS: Readonly<
  Record<(typeof TEMPLATE_BANDS)['/'][number], ComponentType<BandProps>>
> = {
  'client-recognition': Recognition,
  'why-tcules': WhyTcules,
  'product-situations': Situations,
  'product-design': OneStudio,
  'selected-work': SelectedWork,
  testimonials: ClientVoices,
  'ai-native-practice': AiPractice,
  expertise: Expertise,
  insights: Insights,
};

const BANDS: Readonly<Record<string, ComponentType<BandProps>>> = {
  ...HOME_BANDS,
  /* The earlier copy's ids, for a page that still carries them. */
  capabilities: Capabilities,
  'client-voices': ClientVoices,
};
