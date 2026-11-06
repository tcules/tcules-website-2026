import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Media } from '@/components';
import {
  getCaseIndustries,
  getCaseRefs,
  getCaseStudyIndex,
  getCorpusPage,
  getTestimonialAvatars,
  getTestimonialRatings,
  listCorpusPages,
} from '@/content';
import { caseRoutesIn } from '@/lib/corpus-cases';
import type {
  CaseIndustry,
  CorpusBand,
  CorpusBlock,
  CorpusCaseRef,
  CorpusPage,
} from '@/lib/corpus-types';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { inlineToHtml, inlineToText, type InlineRun } from '@/lib/inline';
import { caseStudyPath, CASE_SLUG_REDIRECTS, ROUTES } from '@/lib/routes';
import { recordFigures } from '@/lib/studio-record';

import { readFinder, slugOf, type FinderGroupDef, type Query } from '../_listing/finder-query';
import {
  CorpusBandView,
  ENQUIRY_DRESS,
  ENQUIRY_SKETCH_TO_SHIPPED,
  ListingIndex,
  caseFinder,
  caseViews,
  corpusEnquiryForm,
  coverFor,
  type CaseGroup,
  type CaseItem,
  type CaseView,
  type ListingIndexProps,
} from '@/templates';

/**
 * `/case-studies`, from the 26 Oct 2026 copy and the Strapi list of live cases (component-map G10,
 * C13; owner, 29 Oct 2026). The template takes no corpus type, so this module is the one place the
 * page's shapes are read onto its props:
 *
 *   hero                 the eyebrow, title and lede; the studio record ("Founded 2017 · …") as the
 *                        masthead's figures
 *   client-recognition   the client wall, under the opening (C13)
 *   featured             three `###` cases, the page's featured cases: the first the listing's
 *                        card-less horizontal lead, the other two cards under it (never home's
 *                        CaseCard; owner, 29 Oct 2026)
 *   four stage tables    the stage shelves: one group per table, a card per row ("Case | What we
 *                        did | Best for") in the listing's three-track grid, as /insights sets its
 *                        cards; "Best for" is kept as the card's second line (Q9)
 *   testimonials         the proof wall after the list (decisions/2026-10-29-case-index-carries-
 *                        testimonials, superseding the 22 Oct ruling)
 *   enquiry              the close: home's halves island (2026-10-29-listing-close-is-home-halves)
 *   faq                  after the close: the form comes before the FAQ (`formBeforeFaq`)
 *
 * The rail is the FINDER, as /insights has it (owner, 29 Oct 2026;
 * decisions/2026-10-29-case-index-takes-the-finder): a search and the groups Stage, Industry and Service. Nothing picked, the curated
 * view above (featured, then the stage shelves); anything picked, the cases it lets through as one
 * grid. Every live case is in the finder: a live case no table names (three today) after the copy's.
 * A case is tagged only from a source, never by guess (`tagsOf`); a case no source files under a
 * group stays untagged in it.
 *
 * Covers come from the live case's Strapi thumbnail.
 *
 * `_corpus` is underscore-prefixed, so Next does not route it.
 */
export const CASE_INDEX_ROUTE = '/case-studies';

export async function caseIndexMetadata(): Promise<Metadata> {
  const page = await getCorpusPage(CASE_INDEX_ROUTE);
  return page ? corpusMetadata(page) : { title: 'Case studies | Tcules' };
}

type Link = Extract<InlineRun, { type: 'link' }>;
type QuoteBlock = Extract<CorpusBlock, { type: 'quote' }>;

const text = inlineToText;

/** The bands the page places itself, around the listing (C13). Every other band is the listing. */
const RECOGNITION = 'client-recognition';
const TESTIMONIALS = 'testimonials';
const FAQ = 'faq';

/** The first link anywhere in runs (a title that is a link, or holds one). */
function firstLink(runs: readonly InlineRun[]): Link | undefined {
  for (const run of runs) {
    if (run.type === 'link') return run;
    if ('children' in run) {
      const found = firstLink(run.children);
      if (found) return found;
    }
  }
  return undefined;
}

/** The link that closes a run list ("… [Read the Doodle case](/…)"), if one does. */
const trailingLink = (runs: readonly InlineRun[]): Link | undefined => {
  const last = runs.at(-1);
  return last?.type === 'link' ? last : undefined;
};

/** What the route reads besides the copy: the cases' own records, by live route. */
type PublishedCaseCard = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getCaseStudyIndex>>>['listing']
>['cases'][number];

type Sources = {
  page: CorpusPage;
  refs: Readonly<Record<string, CorpusCaseRef>>;
  /** The Strapi list, by live route. */
  live: ReadonlyMap<string, PublishedCaseCard>;
};

/**
 * A case's cover: the live case's own Strapi thumbnail (the picture its record carries), else what
 * the copy binds for it, else the register's labelled placeholder (`coverFor`), so a set of covers
 * never has a hole.
 */
function coverOf(sources: Sources, name: string, href: string | undefined, band: string) {
  const thumb = href ? sources.live.get(href)?.cover : undefined;
  if (thumb?.src) {
    return {
      src: thumb.src,
      alt: thumb.alt,
      ...(thumb.width && thumb.height ? { width: thumb.width, height: thumb.height } : {}),
      ...(thumb.sources ? { sources: thumb.sources } : {}),
    };
  }
  return coverFor(sources.page, name, href ? sources.refs[href] : undefined, band);
}

/**
 * A `###` case: its paragraph, then its "**Our role:** … [Read the … case](…)" line. The line gives
 * the card its link and cta wording only: the role itself is the case page's ("At a glance"), never
 * the card's (owner, 16 Oct 2026).
 */
function featuredItem(
  sources: Sources,
  block: Extract<CorpusBlock, { type: 'item' }>,
  band: string,
): CaseItem | null {
  const bodyHtml: string[] = [];
  let link: Link | undefined;
  for (const inner of block.blocks) {
    if (inner.type === 'paragraph') bodyHtml.push(inlineToHtml(inner.runs));
    if (inner.type === 'labelled') link = trailingLink(inner.body);
  }
  const href = link?.href;
  if (!href?.startsWith('/case-studies/')) return null;
  const name = block.headingText.split(':')[0] ?? block.headingText;
  return {
    id: href,
    href,
    title: block.headingText,
    description: '',
    bodyHtml,
    ctaLabel: link ? text(link.children) : undefined,
    cover: coverOf(sources, name, href, band),
    featured: true,
  };
}

/**
 * A stage table's row: the case's name (a link where the case is published), what we did, and who
 * it is best for. The name is the card's title; "What we did" its body; "Best for" its second line,
 * under the column's own header, so the words the copy gives every case survive on the card (Q9).
 * A row with no link ("Case study coming soon") is shown, unlinked: the copy lists it.
 */
function rowItem(
  sources: Sources,
  header: readonly InlineRun[][],
  row: readonly InlineRun[][],
  band: string,
): CaseItem | null {
  const [nameCell = [], didCell = [], bestCell = []] = row;
  const name = text(nameCell).trim();
  if (!name) return null;
  const link = firstLink(nameCell);
  const href = link?.href.startsWith('/case-studies/') ? link.href : undefined;
  const bestLabel = text(header[2] ?? []).trim();
  const best = text(bestCell).trim();
  return {
    id: href ?? `${band}-${name}`,
    href,
    title: name,
    description: '',
    bodyHtml: [
      inlineToHtml(didCell),
      ...(best
        ? [`${bestLabel ? `<strong>${bestLabel}:</strong> ` : ''}${inlineToHtml(bestCell)}`]
        : []),
    ],
    cover: coverOf(sources, name, href, band),
  };
}

/** One listing band as its group: the featured `###` cases, or a stage table's rows. */
function groupOf(sources: Sources, band: CorpusBand): CaseGroup {
  const items = band.blocks.flatMap((block): CaseItem[] => {
    if (block.type === 'item') {
      const item = featuredItem(sources, block, band.id);
      return item ? [item] : [];
    }
    if (block.type === 'table') {
      return block.rows.flatMap((row) => {
        const item = rowItem(sources, block.header, row, band.id);
        return item ? [item] : [];
      });
    }
    return [];
  });
  return { id: band.id, heading: band.headingText, items };
}

/** A live case no table names: its Strapi record, as the industry view lists it. */
function liveItem(sources: Sources, route: string, record: PublishedCaseCard): CaseItem {
  return {
    id: route,
    href: route,
    title: record.title,
    description: record.description,
    cover: coverOf(sources, record.title, route, 'live'),
  };
}

/** A case route the filing names by its planned slug, moved to the live one as every link is. */
function liveRoute(route: string): string {
  const slug = /^\/case-studies\/([^/#?]+)$/.exec(route)?.[1];
  const moved = slug ? CASE_SLUG_REDIRECTS[slug] : undefined;
  return moved ? caseStudyPath(moved) : route;
}

/* ── The finder's groups ──────────────────────────────────────────────────────────
   Each case's tags, from sources only (owner, 29 Oct 2026: "never invent a tag"):
     stage     the copy's own stage tables: a row of `new-products` is a new product, and so on. The
               featured cases and the live-only cases sit in no table, so they carry no stage.
     industry  the filing read off the expertise pages (getCaseIndustries, PROPOSED P50): each case an
               expertise page cites, under the sector it is cited for. A case none cites, none.
     service   the case page's own "Related Tcules services:" line, each link rolled up to its service
               line (/services/ai-product-ux/trust-control-recovery → AI Product UX). A case with no
               page in the copy, none. */

/** The copy's stage tables, by band id, and the stage each files its cases under (the filter's label). */
const STAGES: readonly { band: string; label: string }[] = [
  { band: 'new-products', label: 'New product' },
  { band: 'established-products', label: 'Established product' },
  { band: 'ai-products', label: 'AI product' },
  { band: 'designed-and-built', label: 'Carried into working software' },
];

/** The six service lines, in the nav's order: the Service group's options, named by their own pages. */
const SERVICE_LINES = [
  ROUTES.productDesign,
  ROUTES.productModernisation,
  ROUTES.designSystems,
  ROUTES.aiProductUx,
  ROUTES.designEngineering,
  ROUTES.softwareDevelopment,
] as const;

type Tags = { stage: string[]; industry: string[]; service: string[] };

/** Every link in runs, nested ones included. */
function linksIn(runs: readonly InlineRun[]): Link[] {
  return runs.flatMap((run) =>
    run.type === 'link' ? [run] : 'children' in run ? linksIn(run.children) : [],
  );
}

/** A case page's "Related Tcules services:" line as its service lines' routes. */
function serviceLinesOf(page: CorpusPage): string[] {
  const lines = new Set<string>();
  for (const band of page.bands) {
    for (const block of band.blocks) {
      if (block.type !== 'paragraph') continue;
      if (!/^related tcules services:/i.test(text(block.runs).trim())) continue;
      for (const link of linksIn(block.runs)) {
        const line = SERVICE_LINES.find(
          (route) => link.href === route || link.href.startsWith(`${route}/`),
        );
        if (line) lines.add(line);
      }
    }
  }
  return [...lines];
}

/**
 * The finder's groups and each case's tags, keyed by the case's live route (or its id, unlinked).
 * `stageOf` is the copy's own filing; industries and service lines are read here.
 */
async function finderData(
  items: readonly CaseItem[],
  stageOf: ReadonlyMap<string, string>,
  industries: readonly CaseIndustry[],
) {
  const casePages = (await listCorpusPages()).filter((page) =>
    page.route.startsWith(`${CASE_INDEX_ROUTE}/`),
  );
  const servicesByRoute = new Map(
    casePages.map((page) => [liveRoute(page.route), serviceLinesOf(page)] as const),
  );
  const industryByRoute = new Map<string, string[]>();
  for (const group of industries) {
    for (const planned of group.cases) {
      const route = liveRoute(planned);
      industryByRoute.set(route, [...(industryByRoute.get(route) ?? []), group.label]);
    }
  }
  const tags = new Map<string, Tags>(
    items.map((item) => [
      item.id,
      {
        stage: stageOf.has(item.id) ? [stageOf.get(item.id) as string] : [],
        industry: item.href ? (industryByRoute.get(item.href) ?? []) : [],
        service: item.href ? (servicesByRoute.get(item.href) ?? []) : [],
      },
    ]),
  );
  const used = (group: keyof Tags, id: string) =>
    [...tags.values()].some((tag) => tag[group].includes(id));
  const serviceNames = await Promise.all(
    SERVICE_LINES.map(async (route) => (await getCorpusPage(route))?.name ?? route),
  );
  const groups: FinderGroupDef[] = [
    {
      name: 'stage',
      label: 'Stage',
      options: STAGES.filter((stage) => used('stage', stage.band)).map((stage) => ({
        id: stage.band,
        value: slugOf(stage.label),
        label: stage.label,
      })),
    },
    {
      name: 'industry',
      label: 'Industry',
      options: industries
        .filter((group) => used('industry', group.label))
        .map((group) => ({ id: group.label, value: slugOf(group.label), label: group.label })),
    },
    {
      name: 'service',
      label: 'Service',
      options: SERVICE_LINES.flatMap((route, index) =>
        used('service', route)
          ? [{ id: route, value: slugOf(serviceNames[index] ?? route), label: serviceNames[index] ?? route }]
          : [],
      ),
    },
  ].filter((group) => group.options.length > 0);
  return { groups, tags };
}

/* ── The proof wall's ratings ─────────────────────────────────────────────────────
   The copy's testimonials band quotes five clients but its frontmatter lists two ids, so the seam's
   positional match (load.ts) gives none of the five an id, and a quote without one shows no stars
   (2026-10-12: a testimonial always shows its rating). Each quote is matched instead by its words to
   the same quote where another page's copy gives it an id, then by the frontmatter id whose name the
   attribution carries ("DRAFT-CONNECTX-GHOSHAL" ← "Pratik Ghoshal, CEO, ConnectX"), then by the
   register (`REGISTER_IDS`), then by the id another page gives the same speaker — the first of them
   that carries a rating. */

const normal = (value: string) =>
  value
    .toLowerCase()
    .replace(/[“”"’']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const quoteKey = (block: QuoteBlock) => normal(block.paragraphs.map(text).join(' '));

function quotesOf(blocks: readonly CorpusBlock[]): QuoteBlock[] {
  return blocks.flatMap((block) =>
    block.type === 'quote' ? [block] : block.type === 'item' ? quotesOf(block.blocks) : [],
  );
}

/**
 * The testimonial register's ids for the two speakers no page's copy gives an id (Gold Image
 * Printing's "find their way around", Ryzeo's reporting method): the register names them, the copy's
 * frontmatter does not yet. CONTENT GAP: the content team adds all five ids to /case-studies'
 * `testimonial_ids` and this table goes.
 */
const REGISTER_IDS: Readonly<Record<string, string>> = {
  'david aghaei': 'FP-GOLDIMAGE-NAVIGATION',
  'russell miler': 'UW-RAZEO-METHOD',
};

/** Who a quote is from, as a key: the attribution's first part, the speaker's name. */
const speakerKey = (block: QuoteBlock) =>
  normal(text(block.attribution ?? []).split(',')[0] ?? '');

async function withTestimonialIds(page: CorpusPage, band: CorpusBand): Promise<CorpusBand> {
  const known = new Map<string, string>();
  const bySpeaker = new Map<string, string>();
  for (const other of await listCorpusPages()) {
    for (const quote of quotesOf(other.bands.flatMap((b) => b.blocks))) {
      if (!quote.testimonialId) continue;
      if (!known.has(quoteKey(quote))) known.set(quoteKey(quote), quote.testimonialId);
      const speaker = speakerKey(quote);
      if (speaker && !bySpeaker.has(speaker)) bySpeaker.set(speaker, quote.testimonialId);
    }
  }
  const declared = page.composition.testimonialIds;
  /* Every id each quote could take, in order: the same words; the id the page declares for this
     speaker; the register's; the id another page gives the same speaker (one client, one rating). */
  const candidatesOf = (block: QuoteBlock) => {
    const who = normal(text(block.attribution ?? []));
    const byName = declared.find((id) =>
      id
        .toLowerCase()
        .split('-')
        .slice(1)
        .some((token) => token.length > 3 && who.includes(token)),
    );
    return [
      known.get(quoteKey(block)),
      byName,
      REGISTER_IDS[speakerKey(block)],
      bySpeaker.get(speakerKey(block)),
    ].filter((id): id is string => Boolean(id));
  };
  const quotes = band.blocks.filter((block): block is QuoteBlock => block.type === 'quote');
  const rated = await getTestimonialRatings([...new Set(quotes.flatMap(candidatesOf))]);
  return {
    ...band,
    blocks: band.blocks.map((block) => {
      if (block.type !== 'quote' || block.testimonialId) return block;
      const candidates = candidatesOf(block);
      /* The first that carries a rating, so the card shows its stars; else the first. */
      const id = candidates.find((candidate) => rated[candidate]) ?? candidates[0];
      return id ? { ...block, testimonialId: id } : block;
    }),
  };
}

/**
 * The page's ListingIndex props, from the copy, the Strapi list and the URL (the finder's picks).
 * `adjust` lets the specimen (`/design/listing-index?data=cases`) run this same mapping over a
 * stressed set of views, so the live page and its specimen cannot drift.
 */
export async function caseIndexProps(
  query: Query = {},
  adjust: (views: CaseView[]) => CaseView[] = (views) => views,
  /** The page's own path, with any query it always carries (the specimen's `?data=cases`). */
  path: string = CASE_INDEX_ROUTE,
): Promise<ListingIndexProps | null> {
  const page = await getCorpusPage(CASE_INDEX_ROUTE);
  if (!page) return null;

  const bandById = (id: string) => page.bands.find((band) => band.id === id);
  const anchor = page.conversion?.anchor ?? 'enquiry';
  const closeBand = bandById(anchor);
  const recognition = bandById(RECOGNITION);
  const faq = bandById(FAQ);
  const quotesBand = bandById(TESTIMONIALS);
  const proof = quotesBand ? await withTestimonialIds(page, quotesBand) : undefined;
  const ids = proof
    ? quotesOf(proof.blocks).flatMap((quote) =>
        quote.testimonialId ? [quote.testimonialId] : [],
      )
    : [];

  const [refs, ratings, avatars, industries, listing] = await Promise.all([
    getCaseRefs(caseRoutesIn(page)),
    getTestimonialRatings(ids),
    getTestimonialAvatars(ids),
    getCaseIndustries(),
    /* The live list; without it the page still renders from the copy, covers from the copy. */
    getCaseStudyIndex().catch(() => null),
  ]);
  const live = new Map(
    (listing?.listing?.cases ?? []).flatMap((record) =>
      record.href ? [[record.href, record] as const] : [],
    ),
  );
  const sources: Sources = { page, refs, live };

  /* The listing: every band the page does not place itself, in the copy's order. */
  const own = new Set([RECOGNITION, TESTIMONIALS, FAQ, anchor]);
  const groups = page.bands
    .filter((band) => !own.has(band.id))
    .map((band) => groupOf(sources, band))
    .filter((group) => group.items.length > 0);

  /* The curated view: the featured cases, then the stage shelves, in the copy's order. */
  const views = adjust([{ id: 'stage', label: 'By stage', groups }]);
  const curated = views.flatMap((view) => view.groups);

  /* The finder holds every case once: the copy's, in its order, then the live ones it does not
     name. A view adjusted to nothing (the specimen's empty state) holds none. */
  const seen = new Set<string>();
  const copyCases = curated
    .flatMap((group) => group.items)
    .filter((item) => !seen.has(item.id) && Boolean(seen.add(item.id)));
  const unnamed =
    curated.length === 0
      ? []
      : [...live.entries()]
          .filter(([route]) => !seen.has(route))
          .map(([route, record]) => liveItem(sources, route, record));
  const cases = [...copyCases, ...unnamed];
  const stageOf = new Map(
    curated.flatMap((group) =>
      STAGES.some((stage) => stage.band === group.id)
        ? group.items.map((item) => [item.id, group.id] as const)
        : [],
    ),
  );
  const filing = await finderData(cases, stageOf, industries);
  const read = readFinder({
    path,
    query,
    groups: filing.groups,
    items: cases,
    matches: (item, group, id) =>
      filing.tags.get(item.id)?.[group as keyof Tags]?.includes(id) ?? false,
    text: (item) =>
      [item.title, item.description, ...(item.bodyHtml ?? []).map((html) => html.replace(/<[^>]+>/g, ''))]
        .join(' '),
  });
  const finder = caseFinder({
    action: read.action,
    query: read.query,
    search: { value: read.search, label: 'Search case studies' },
    groups: read.groups,
    picks: read.picks,
    clearHref: read.clearHref,
    items: read.filtered,
    shown: read.shown,
    moreHref: read.moreHref,
  });

  const lead = closeBand?.blocks.find((block) => block.type === 'paragraph');
  /* The studio record the copy sets in bold under the lede ("Founded 2017 · More than 90 projects
     · …"): the masthead's figures, the number large and what it counts small (owner, 29 Oct 2026;
     decisions/2026-10-29-studio-record-is-figures). */
  const stats = page.hero.proofLines
    .map((line) => recordFigures(text(line)))
    .find((figures) => figures.length > 0);

  /* The listing's opening takes no ask (PageHero `masthead`: a listing's ask is its list; the
     29 Sep ruling kept a button off the index), so the hero's "Tell us about your product" is not
     shown — proposal P15. The close below is the page's ask. */
  return {
    breadcrumbs: page.breadcrumb.map((crumb) => ({ label: crumb.name, href: crumb.url })),
    hero: {
      title: page.hero.titleText.trim() || page.name,
      eyebrow: page.hero.eyebrow ? text(page.hero.eyebrow) : undefined,
      lede: page.hero.lede.map(text),
      ...(stats ? { stats } : {}),
    },
    label: 'Case studies',
    railLabel: 'Browse case studies',
    views: caseViews(views),
    finder,
    empty: 'No case studies have been published yet.',
    bands: {
      afterHero: recognition ? <CorpusBandView page={page} band={recognition} /> : undefined,
      afterListing: proof ? (
        <CorpusBandView page={page} band={proof} ratings={ratings} avatars={avatars} />
      ) : undefined,
      afterClose: faq ? <CorpusBandView page={page} band={faq} /> : undefined,
    },
    closing: closeBand
      ? {
          id: closeBand.id,
          heading: closeBand.headingText,
          body: lead?.type === 'paragraph' ? text(lead.runs) : undefined,
          /* Home's close, as /insights has it (2026-10-29-listing-close-is-home-halves): the proof
             wall above it is tint, so the plain tint close would touch it. */
          island: {
            surface: 'blue',
            art: <Media image={ENQUIRY_SKETCH_TO_SHIPPED} sizes="300px" />,
          },
          form: corpusEnquiryForm(page, closeBand, { dress: ENQUIRY_DRESS.card }),
        }
      : undefined,
  };
}

type CaseIndexRouteProps = {
  searchParams?: Promise<Query>;
};

export async function CaseIndexRoute({ searchParams }: CaseIndexRouteProps) {
  const props = await caseIndexProps(await searchParams);
  if (!props) notFound();
  return <ListingIndex {...props} />;
}
