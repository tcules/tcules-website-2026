import { Fragment, type ReactNode } from 'react';

import { Layout, Section, type IconName } from '@/components';
import {
  BlockCard,
  BlockCardSet,
  Bento,
  CaseSpread,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  EngagementOptions,
  ListCard,
  OfferSheet,
  Proof,
  Reasons,
  Slider,
  TestimonialBeside,
  Thread,
  TracePlates,
  VoiceLedger,
  type BentoCta,
  type BlockCardSetItem,
  type EngagementScope,
  type TraceScene,
  type TraceStage,
} from '@/patterns';
import { caseStudyLink } from '@/lib/case-links';
import { caseRouteOf } from '@/lib/corpus-cases';
import { corpusImage } from '@/lib/corpus-images';
import type {
  CorpusBand,
  CorpusBlock,
  CorpusCaseRef,
  CorpusMediaBinding,
  CorpusPage,
} from '@/lib/corpus-types';
import { glyphForRoute } from '@/lib/glyphs';
import { placeholderIllustration } from '@/lib/placeholders';
import { ROUTES } from '@/lib/routes';
import {
  offerSceneKey,
  serviceSceneFor,
  type OfferScenes,
  type SketchName,
} from '@/lib/sketches';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import { renderInline } from '@/lib/inline-render';

import {
  EnquiryBand,
  FaqItems,
  GenericBlocks,
  ListTiles,
  bodyOf,
  head,
  QuoteGroupBand,
  RecognitionBand,
  proofQuote,
  testimonialItem,
  type AvatarsById,
  type RatingsById,
} from './blocks';
import {
  bindingNamed,
  caseCover,
  coverFor,
  hasSlot,
  slotImage,
  slugOf,
  type SlotImage,
} from './images';
import {
  BandBody,
  ChallengesBand,
  ClaimRows,
  claimsOf,
  CloseBand,
  DestinationsBand,
  DirectoryBand,
  DrawnTableBand,
  IndustriesBand,
  LinkActions,
  MethodBand,
  NoteBand,
  RelatedBand,
  SheetBand,
  TableBand,
  TextBand,
  WhatYouGetBand,
  sheetParts,
} from './CopyBands';
import { DestinationGroupsBand, hasDestinationGroups } from './HubBands';
import { kindOf, type OfferUnit } from './plan';
import {
  bandLinks,
  blocksOf,
  hasLink,
  labelTitle,
  lastIndexWhere,
  leadOf,
  linksIn,
  linkLead,
  plain,
  trimEnd,
  trimStart,
} from './text';

/**
 * The offer page's bands, one function per shape (page-mapping § 2 and § 4). Every arrangement is
 * Layout, Cluster and the kit's units; this file draws no tile, row or card of its own, sets no
 * margin and no distance, and never overrides a Section's column or ground. A unit arrives already
 * planned (plan.ts): its shape, its surface, its media side and its texture are decided, and every
 * word is the corpus's.
 */

export type OfferContext = {
  page: CorpusPage;
  /** The cases the page cites, as each case's own page describes them (title, cover). */
  caseRefs: Readonly<Record<string, CorpusCaseRef>>;
  /** Studio photographs the corpus binds on other pages, by binding id, for the slots that reuse them. */
  shared: Readonly<Record<string, CorpusMediaBinding>>;
  /**
   * Star ratings for the page's testimonials, by testimonial id, as the route read them (PLACEHOLDERS
   * today: fixtures/testimonial-ratings.ts). A quote with none shows no stars.
   */
  ratings?: RatingsById;
  /** Portraits for the page's testimonials, by testimonial id (PLACEHOLDERS today, as on home). */
  avatars?: AvatarsById;
  /** The drawings the page's items carry, assigned item by item at the content seam (owner, 26 Oct 2026). */
  scenes?: OfferScenes;
  /**
   * A Why Tcules reason's drawing by the reason's title as authored, exported on the band's ground
   * (component-map C1; the content seam's `getReasonFigure`). Undefined for a reason not drawn yet:
   * the band draws the labelled illustration slot in its place (src/lib/placeholders.ts).
   */
  reasonFigure?: (
    title: string,
    ground: 'paper' | 'paper-deep',
  ) => { src: string; width: number; height: number } | undefined;
  /**
   * A hard-parts claim's drawing by the claim's title as authored, exported on the band's ground
   * (the content seam's `getClaimFigure`). Undefined for a claim not drawn yet: the band draws the
   * labelled illustration slot in its place.
   */
  claimFigure?: (
    title: string,
    ground: 'paper' | 'paper-deep',
  ) => { src: string; width: number; height: number } | undefined;
};

/** The scene assigned to one item of a band, by the item's title (or a router item's href). */
function sceneFor(ctx: OfferContext, band: CorpusBand, key: string): SketchName | undefined {
  return ctx.scenes?.items[band.id]?.[offerSceneKey(key)] ?? ctx.scenes?.items[band.id]?.[key];
}

type Lead = { title: string; body: readonly InlineRun[] };

/** Every labelled claim of a band as a title and the runs after it, in order. */
function leads(band: CorpusBand): Lead[] {
  return band.blocks.flatMap((block) => {
    const lead = leadOf(block);
    return lead ? [{ title: labelTitle(lead.label), body: lead.body }] : [];
  });
}

/** The band's first lead-in paragraph (before any labelled claim), as plain text. */
function leadText(band: CorpusBand): string | undefined {
  const first = band.blocks.find((block) => block.type !== 'comment');
  return first?.type === 'paragraph' && !leadOf(first) && !linkLead(first)
    ? plain(first.runs)
    : undefined;
}

/** Options authored as bold-led bullets (About's working terms): the label is the title, as authored. */
function listOptions(band: CorpusBand) {
  return blocksOf(band, 'list').flatMap((list) =>
    list.items.flatMap((runs) => {
      const lead = leadOf({ type: 'paragraph', runs });
      return lead
        ? [
            {
              title: labelTitle(lead.label),
              body: renderInline(lead.body),
              scope: scopeOf(labelTitle(lead.label)),
            },
          ]
        : [];
    }),
  );
}

/**
 * Options authored as `###` items (/how-we-work's engagement shapes: a name, a line saying what kind of
 * engagement it is, then how it works and where it starts), each item's paragraphs in order.
 */
function itemOptions(band: CorpusBand) {
  return band.blocks.flatMap((block) => {
    if (block.type !== 'item') return [];
    const paragraphs = block.blocks.flatMap((inner) =>
      inner.type === 'paragraph'
        ? [inner.runs]
        : inner.type === 'labelled'
          ? [
              [
                { type: 'strong', children: inner.label } as InlineRun,
                { type: 'text', text: ' ' } as InlineRun,
                ...inner.body,
              ],
            ]
          : inner.type === 'list'
            ? inner.items
            : [],
    );
    const [first, ...more] = paragraphs;
    return [
      {
        title: block.headingText,
        body: first ? renderInline(first) : null,
        more: more.map((runs) => renderInline(runs)),
        scope: scopeOf(block.headingText),
      },
    ];
  });
}

/** The paragraphs that follow the labelled claims or items (a closing note), as runs. */
function trailingParagraphs(band: CorpusBand): InlineRun[][] {
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  const lastLead = lastIndexWhere(
    blocks,
    (block) => leadOf(block) !== null || block.type === 'item',
  );
  return blocks
    .slice(lastLead + 1)
    .flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));
}

const quoteOf = (band: CorpusBand) => blocksOf(band, 'quote')[0];

/** The paragraphs before a band's first labelled claim (its lead-in), as runs. */
function leadingParagraphs(band: CorpusBand): InlineRun[][] {
  const out: InlineRun[][] = [];
  for (const block of band.blocks) {
    if (block.type === 'comment') continue;
    if (block.type !== 'paragraph' || leadOf(block)) break;
    out.push(block.runs);
  }
  return out;
}

/** A case band's closing links: the link lines after the last case's own "Read the … case". */
function closingCaseLinks(band: CorpusBand) {
  const items = band.blocks.filter(
    (b): b is Extract<CorpusBlock, { type: 'item' }> => b.type === 'item',
  );
  const last = items.at(-1);
  const top = band.blocks.flatMap((b) => (b.type === 'links' ? b.links : []));
  if (!last) return [];
  const lines = last.blocks.flatMap((b) => (b.type === 'links' ? b.links : []));
  return [...(lines.length > 1 ? lines.slice(1) : []), ...top];
}

const tiles = (rows: readonly Lead[], columns: 1 | 2 | 3 = 2) => (
  <ListTiles
    columns={columns}
    rows={rows.map((row) => ({ title: row.title, ...bodyOf(row.body) }))}
  />
);

/** A trailing link run lifted out of a paragraph ("… [Read the case](/…)"): the runs without it, and the link. */
function liftTrailingLink(runs: readonly InlineRun[]) {
  const last = runs.at(-1);
  if (last?.type !== 'link') return { runs: [...runs], link: undefined };
  return { runs: trimEnd(runs.slice(0, -1)), link: last };
}

/**
 * Which scope an engagement option's drawing shows, read from the option's own name (EngagementOptions
 * draws only what the name says). A name none of these fit shows no drawing rather than a wrong one.
 */
/**
 * About's working terms, by their authored titles, each to the scene drawn for the same claim in the
 * 11 Oct "How Tcules works" band (owner, 31 Oct 2026). Who you work with, response time and getting
 * started argue something no scene draws yet: they take the empty plate until drawn.
 */
const TERM_SCOPES: Readonly<Record<string, EngagementScope>> = {
  communication: 'inside',
  turnaround: 'commercial',
  'working hours': 'overlap',
};

function scopeOf(title: string): EngagementScope | undefined {
  const name = title.toLowerCase();
  const term = TERM_SCOPES[name.replace(/[.:]\s*$/, '')];
  if (term) return term;
  /* The 26 Oct copy's three engagements (component-map C9): a focused piece of work draws one
     feature, a defined project an area, an ongoing partnership the embedded designer. */
  if (/\bfocused\b/.test(name)) return 'feature';
  if (/\bdefined project\b/.test(name)) return 'area';
  if (/\bongoing\b/.test(name)) return 'embedded';
  if (/\bbuild\b/.test(name)) return 'build';
  if (/\b(team|designer|embedded)\b/.test(name)) return 'embedded';
  if (/\b(area|whole|new product)\b/.test(name)) return 'area';
  if (/\b(workflow|feature)\b/.test(name)) return 'feature';
  return undefined;
}

/**
 * Which plate a traced stage draws, read from the stage's own name (TracePlates draws only what the
 * name says). A thread with any stage none of these fit keeps Thread's beads.
 */
function sceneOf(title: string): TraceScene | undefined {
  const name = title.toLowerCase();
  if (/\bsign-?off\b|\baccept/.test(name)) return 'signoff';
  if (/\bhand-?off\b|\bspec/.test(name)) return 'handoff';
  if (/\brunning\b|\blive\b|\bproduct\b/.test(name)) return 'product';
  if (/\bcode\b|\bbuild\b/.test(name)) return 'code';
  if (/\bdesign\b/.test(name)) return 'design';
  return undefined;
}

/** A list item as a stage: its bold lead as the title, the rest as the body. */
function stagesOf(items: readonly InlineRun[][]) {
  return items.map((item) => {
    const split = leadOf({ type: 'paragraph', runs: item });
    return split
      ? { title: labelTitle(split.label), body: plain(split.body) }
      : { title: plain(item) };
  });
}

/**
 * The stages as a trace, when every stage names a point in one screen's life (design, handoff,
 * code, the running product, sign-off); otherwise undefined and the path keeps Thread's beads.
 */
function traceOf(items: readonly InlineRun[][]): TraceStage[] | undefined {
  const stages = stagesOf(items);
  const scenes = stages.map((stage) => sceneOf(stage.title));
  return scenes.every(Boolean)
    ? stages.map((stage, index) => ({ ...stage, scene: scenes[index] as TraceScene }))
    : undefined;
}

/**
 * The tables read across their rows, which sit one under another with their drawing at the start
 * (DrawnTableBand `ledger`): a chain of checks, a choice between services, a comparison. The bands
 * before them ("What you get") are the tile grid, so these take the other shape (round 5 critic).
 */
const LEDGER_BANDS: ReadonlySet<string> = new Set(['status-example', 'options', 'compare']);

/** A method whose closing sentence is its own point (the AI sixth choice) stands as a callout with a mark. */
const METHOD_NOTE_ICON: Readonly<Record<string, IconName>> = { decisions: 'stars' };

/* ── Unit renderers ───────────────────────────────────────────────────────────── */

export function UnitView({ unit, ctx }: { unit: OfferUnit; ctx: OfferContext }) {
  const { page } = ctx;
  const { band } = unit;

  switch (unit.kind) {
    case 'faq':
      return (
        <ContentSection {...head(band)} data-band="D-faq" align="center">
          <ContentSectionText>
            <FaqItems band={band} />
          </ContentSectionText>
        </ContentSection>
      );

    case 'enquiry':
      /* Home's close (owner, 26 Oct 2026: every page closes the way home does): the blue island in
         halves, the sketch-to-shipped drawing over the words, the untitled card beside them. */
      return (
        <EnquiryBand
          page={page}
          band={band}
          island={{ surface: 'blue', dress: 'card', arrangement: 'halves' }}
        />
      );

    /* The client's words, a band of their own on tint, right after the offer or the cases they
       support (owner, 26 Oct 2026). With a portrait, the featured testimonial: the portrait beside the
       quote, the voices' portraits alternating sides; without one, the quote alone, centred. Stars and
       quote marks always (owner, 12 and 26 Oct 2026). A voice after a set of cases links to the case
       its client is from. */
    case 'voice':
      return <Voice unit={unit} ctx={ctx} />;

    /* What you get — the outcomes as ONE offer (OfferSheet; product-design round 6, 11 Oct 2026,
       page-mapping § 23), each promise beside its own drawing where the page assigns one (owner,
       26 Oct 2026). The client's words that close the band in the corpus follow it as a band of their
       own (`voice`, plan.ts), so the offer stands alone: the quote as a third column, or a line under
       the set, "reads as noise". "What you get" itself is FOUR PARTS (OfferParts; owner, 30 Oct 2026,
       round 7; decisions/2026-10-30-what-you-get-label-rows): the deliverables, then who does the
       work, what we need and where our part stops, each part's title in a label column, the last
       three each led by its drawing. The sheet stands wherever a drawing is missing. */
    case 'outcomes':
    case 'set':
    case 'catalog': {
      const scenes = (title: string) => sceneFor(ctx, band, title);
      if (band.id === 'what-you-get') {
        return <WhatYouGetBand band={band} scenes={scenes} />;
      }
      return <SheetBand band={band} scenes={scenes} />;
    }

    /* ── The 26 Oct copy's kinds (component-map § A, § B; CopyBands.tsx) ── */
    case 'quotes':
      return (
        <QuoteGroupBand
          band={band}
          ratings={ctx.ratings}
          avatars={ctx.avatars}
          surface={unit.surface}
        />
      );
    case 'industries':
      return <IndustriesBand page={page} band={band} />;
    case 'challenges':
      return (
        <ChallengesBand
          page={page}
          band={band}
          claimFigure={ctx.claimFigure}
          ground={unit.surface === 'tint' ? 'paper-deep' : 'paper'}
        />
      );
    case 'method': {
      const figureScene = sceneFor(ctx, band, 'figure');
      const bound = page.composition.mediaBindings.some(
        (b) => b.bound && b.supportsSection === band.id,
      );
      const figure = figureScene
        ? { sketch: figureScene }
        : bound
          ? { image: slotImage(page, band.id) }
          : undefined;
      return (
        <MethodBand
          band={band}
          scenario={sceneFor(ctx, band, 'scenario')}
          {...(figure ? { figure } : {})}
          {...(METHOD_NOTE_ICON[band.id] ? { noteIcon: METHOD_NOTE_ICON[band.id] } : {})}
        />
      );
    }
    case 'related':
      return <RelatedBand band={band} />;
    case 'recognition':
      return <RecognitionBand band={band} />;
    case 'destinations':
      /* `###` groups of linked tables (/expertise `product-types`): HubBands, 29 Oct 2026. */
      return hasDestinationGroups(band) ? (
        <DestinationGroupsBand page={page} band={band} />
      ) : (
        <DestinationsBand band={band} />
      );
    case 'directory':
      return <DirectoryBand page={page} band={band} />;
    case 'text':
      return (
        <TextBand
          page={page}
          band={band}
          side={unit.side}
          scenario={sceneFor(ctx, band, 'scenario')}
        />
      );
    case 'note':
      return <NoteBand band={band} />;
    case 'close':
      return <CloseBand page={page} band={band} />;

    /* Symptoms in the customer's own words, each answered by where we start (VoiceLedger;
       product-design round 6, page-mapping § 23). The reader knows what is going wrong before they
       know which service they need, so the complaint is the band's large thing, set in the speech
       voice down one edge, and the answer is the reply beside it. Round 1–5 set them as a two-column
       read-down beside a placeholder photograph: the eye zigzagged and the voices read as titles. */
    case 'symptoms':
      return (
        <VoiceLedger
          {...head(band)}
          lead={leadText(band)}
          items={leads(band).map((row) => ({
            voice: row.title,
            reply: renderInline(row.body),
            scene: sceneFor(ctx, band, row.title),
          }))}
        />
      );

    /* A worked example, with the emphasis where the argument is (CaseSpread; product-design round 6,
       page-mapping § 23): the OUTCOME ("The result.") is the claim, beside the evidence at 16:9; the
       problem and what we did are the backstory under both; the case link is the claim's action.
       Round 1 set three equal ruled rows beside the shot, so the result read as the third of three. */
    case 'record': {
      const binding = bindingNamed(page, band.headingText);
      /* A product capture is read from its top: the 16:9 frame keeps the screen's header and loses
         the foot (the master is 3:2). */
      const image = binding
        ? { ...corpusImage(binding), focus: { x: 0, y: 0 } }
        : slotImage(page, band.id);
      const rows = leads(band);
      const at = rows.findIndex((row) => /^the result/i.test(row.title));
      const claimAt = at >= 0 ? at : rows.length - 1;
      const claim = rows[claimAt];
      if (!claim) return null;
      const [link] = bandLinks(band);
      /* "Example: Dealpath": the kind of band as the eyebrow, the case as the heading (owner, 26 Oct
         2026). Typesetting the authored heading, never rewording it. */
      const named = /^(example):\s*(.+)$/i.exec(band.headingText);
      const story = ctx.scenes?.stories[band.id];
      return (
        <CaseSpread
          {...head(band)}
          {...(named ? { eyebrow: named[1], heading: named[2] } : {})}
          {...(story ? { scenes: story } : {})}
          surface={unit.surface}
          claim={{ title: claim.title, body: renderInline(claim.body) }}
          action={
            link ? (
              <CtaRow rule={false} actions={[{ label: link.labelText, href: link.href }]} />
            ) : undefined
          }
          image={image}
          {...(leadingParagraphs(band).length > 0
            ? { lead: renderInline(leadingParagraphs(band).flat()) }
            : {})}
          {...(trailingParagraphs(band).length > 0
            ? { coda: renderInline(trailingParagraphs(band).flat()) }
            : {})}
          story={rows
            .filter((_, index) => index !== claimAt)
            .map((row) => ({ title: row.title, body: renderInline(row.body) }))}
        />
      );
    }

    /* M8 — cited cases as covers; the case a quote is about featured with the quote beside it. */
    case 'cases': {
      /* The 26 Oct copy: a lead paragraph, three `###` cases, and on some pages a closing link line
         after the last case ("See all case studies"), which is the band's action (component-map C3). */
      const caseLead = leadText(band);
      const closing = closingCaseLinks(band);
      return closing.length > 0 ? (
        <ContentSection
          {...head(band)}
          data-band="M"
          lead={caseLead}
          actionsAt="end"
          actions={<LinkActions links={closing} />}
        >
          <CaseSet ctx={ctx} band={band} />
        </ContentSection>
      ) : (
        <ContentSection {...head(band)} data-band="M" lead={caseLead}>
          <CaseSet ctx={ctx} band={band} />
        </ContentSection>
      );
    }

    /* How we work together / Ways to work with us — the head (heading, its own link as end action,
       lead), the three options (primary, plated flat drawings), the two terms (one plain text row at body size under the set, on its grid). Its ask ("Tell us what you're working on") is its own band after it, an ink
       island with the texture and one solid to the contact route (owner, 30 Oct 2026, round 5: "the 2
       buttons split up and down is horrible design… an island section with that title and a button to
       the contact page"). */
    case 'tiles': {
      const opening = leadingParagraphs(band);
      const terms = trailingParagraphs(band);
      const links = bandLinks(band);
      return (
        <Fragment>
          <EngagementOptions
            {...head(band)}
            surface={unit.surface}
            lead={opening.length > 0 ? opening.map((runs) => renderInline(runs)) : undefined}
            options={
              leads(band).length > 0
                ? leads(band).map((row) => ({
                    title: row.title,
                    body: renderInline(row.body),
                    scope: scopeOf(row.title),
                  }))
                : listOptions(band).length > 0
                  ? listOptions(band)
                  : itemOptions(band)
            }
            terms={terms.map((runs) => ({ body: renderInline(runs) }))}
            action={links.length > 0 ? <LinkActions links={links.slice(0, 1)} /> : undefined}
          />
          {links[1] ? (
            <CtaSection
              data-band="L"
              arrangement="open"
              heading={links[1].labelText}
              actions={[{ label: 'Start a project', href: ROUTES.contact }]}
            />
          ) : null}
        </Fragment>
      );
    }

    /* M13 — destinations with a description: an icon router, the head above, no photograph. */
    case 'router':
      return <Router band={band} ctx={ctx} />;

    /* E — a path, drawn on the line rather than bulleted. */
    case 'thread': {
      const list = blocksOf(band, 'list')[0];
      const lead = band.blocks.find((b) => b.type === 'paragraph');
      const leadRuns = lead?.type === 'paragraph' ? lead.runs : [];
      const closing = trailingAfterList(band);
      const trace = list ? traceOf(list.items) : undefined;
      const leadText = hasLink(leadRuns) ? undefined : plain(leadRuns);
      const leadLinked = hasLink(leadRuns) ? (
        <ContentSectionText>
          <p>{renderInline(leadRuns)}</p>
        </ContentSectionText>
      ) : null;
      const after = closing.map((runs, index) => (
        <ContentSectionText key={index}>
          <p>{renderInline(runs)}</p>
        </ContentSectionText>
      ));
      /* A trace — one screen followed through every hand-over — runs DOWN beside the head: one row
         per stage, the screen drawn at that stage beside what we look at there, the trace running
         down through it (TracePlates `down`; owner, 11 Oct 2026). */
      if (trace) {
        /* The closing stance sits in the head track under the lead, so the five rows fit a fold. */
        const plates = leadLinked ? (
          <Layout rowGap="stack">
            {leadLinked}
            <TracePlates orientation="down" stages={trace} />
          </Layout>
        ) : (
          <TracePlates orientation="down" stages={trace} />
        );
        return after.length > 0 ? (
          <ContentSection
            {...head(band)}
            data-band="E"
            arrangement="beside"
            lead={leadText}
            aside={<Layout rowGap="text">{after}</Layout>}
          >
            {plates}
          </ContentSection>
        ) : (
          <ContentSection {...head(band)} data-band="E" arrangement="beside" lead={leadText}>
            {plates}
          </ContentSection>
        );
      }
      return (
        <ContentSection {...head(band)} data-band="E" align="center" lead={leadText}>
          {leadLinked}
          {list ? <Thread align="center" stages={stagesOf(list.items)} /> : null}
          {after}
        </ContentSection>
      );
    }

    /* M15 — a comparison: a key column against rows, boxed. */
    case 'table':
      return ctx.scenes?.items[band.id] &&
        !sceneFor(ctx, band, 'agree') &&
        blocksOf(band, 'table').length > 0 ? (
        <DrawnTableBand
          page={page}
          band={band}
          sceneOf={(key) => sceneFor(ctx, band, key)}
          scenario={sceneFor(ctx, band, 'scenario')}
          arrangement={LEDGER_BANDS.has(band.id) ? 'ledger' : 'grid'}
        />
      ) : (
        <TableBand
          band={band}
          scenario={sceneFor(ctx, band, 'scenario')}
          agreement={sceneFor(ctx, band, 'agree')}
        />
      );

    /* What you receive: a list of deliverables, with the product shot beside it. */
    /* What you receive — the deliverables as ONE offer (OfferSheet, as "What you get" on the service
       page; owner, 11 Oct 2026): two rows of two promises, each on its rule and blue mark, the
       product shot filling the trailing 1 beside them, and the next step closing their column. */
    case 'deliverables': {
      const list = blocksOf(band, 'list')[0];
      const rows: Lead[] = (list?.items ?? []).flatMap((item) => {
        const split = leadOf({ type: 'paragraph', runs: item });
        return split ? [{ title: labelTitle(split.label), body: split.body }] : [];
      });
      /* Everything after the list as authored, tables and a worked example included: until 31 Oct only
         its paragraphs rendered, and the design-to-code audit lost both its tables (kinds:check). */
      const rest = band.blocks.filter((block) => block.type !== 'comment');
      const after = rest.slice(lastIndexWhere(rest, (block) => block.type === 'list') + 1);
      return (
        <OfferSheet
          {...head(band)}
          lead={leadText(band)}
          items={rows.map((row) => ({
            title: row.title,
            ...(hasLink(row.body) || row.body.some((run) => run.type !== 'text')
              ? { bodyHtml: inlineToHtml(row.body) }
              : { body: plain(row.body) }),
          }))}
          {...(hasSlot(page, band.id) ? { asideImage: slotImage(page, band.id) } : {})}
          note={
            after.length > 0 ? (
              <BandBody blocks={after} labelledBy={head(band).headingId} />
            ) : undefined
          }
        />
      );
    }

    /* M11 — two reasons: a media split, or (a third in a row) a read-down beside the photograph. */
    case 'reasons': {
      /* The 26 Oct copy's Why Tcules: a lead, three reasons (bold-led bullets, or `###` items), the
         closing links. One isometric illustration per reason, band scale (`figureSize="lg"`), never
         a case cover or a figure panel (decisions/2026-10-30-reasons-take-illustrations): the case
         links stay in the sentence. A reason not drawn yet takes the labelled illustration slot
         (decisions/2026-10-30-undrawn-illustration-slot), so a band never mixes two scales. Head
         above, drawing above (decisions/2026-10-29-set-reasons-head-above-drawing-above), and
         isometric, so it never reads as How we work together's flat options beside it. */
      if (blocksOf(band, 'list').length > 0 || band.blocks.some((b) => b.type === 'item')) {
        const parts = sheetParts(band);
        /* The closing link row ("Why teams choose Tcules") follows the last `###` reason, so the
           parser files it under that reason: read it from what follows the items, which holds the
           band's own link rows too. */
        const links = parts.after.flatMap((block) =>
          block.type === 'links' ? block.links : [],
        );
        const action = links.length > 0 ? <LinkActions links={links} pair /> : undefined;
        const ground = unit.surface === 'tint' ? 'paper-deep' : 'paper';
        const titled = parts.items.filter((item) => item.title);
        if ([3, 4, 5, 6].includes(parts.items.length) && titled.length === parts.items.length) {
          return (
            <Reasons
              {...head(band)}
              surface={unit.surface === 'tint' ? 'tint' : 'paper'}
              figureSize="lg"
              lead={parts.lead}
              action={action}
              items={titled.map((item) => {
                const drawn = ctx.reasonFigure?.(item.title!, ground);
                return {
                  title: item.title!,
                  body: item.bodyHtml ? (
                    <span dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
                  ) : (
                    (item.body ?? '')
                  ),
                  figure: drawn
                    ? { ...drawn, alt: '', kind: 'illustration' as const }
                    : { ...placeholderIllustration(item.title!), alt: '' },
                };
              })}
            />
          );
        }
        return (
          <OfferSheet
            {...head(band)}
            lead={parts.lead}
            items={parts.items}
            across={parts.items.length === 4 ? 2 : 3}
            note={action}
          />
        );
      }
      const rows = leads(band);
      /* D — the "why" band as a run of beside banners, one reason each, alternating sides (as
         home's "Why teams choose Tcules", owner 11 Oct 2026): the reason leads at the banner's
         heading, its sentence under it, a photograph beside. The first reason takes the studio
         photograph the page binds; each other reason its own slot. */
      if (unit.variant === 'D') {
        const studio = ctx.shared['about_studio_review'];
        /* D — the "why" band as one section of image cards, a reason each: a 16:9 photograph, the
           reason as the card's title, its sentence under it. The first reason takes the studio
           photograph the page binds; each other reason its own slot. Home's one-banner-per-reason
           run is for reasons that fill a fold (a claim, a paragraph and a client's words); a
           sentence each, as here, left every banner a short caption floating beside a large photo
           (owner, 12 Oct 2026, healthtech: "idk what but this looks bad"). */
        const cards: BlockCardSetItem[] = rows.flatMap((row, index) => {
          const slug = slugOf(row.title);
          const image: SlotImage | undefined = hasSlot(page, band.id, slug)
            ? { ...slotImage(page, band.id, slug), kind: 'photograph' as const }
            : index === 0
              ? studio
                ? corpusImage(studio)
                : hasSlot(page, band.id)
                  ? { ...slotImage(page, band.id), kind: 'photograph' as const }
                  : undefined
              : undefined;
          return [
            {
              id: slug,
              title: row.title,
              ...(hasLink(row.body) || row.body.some((run) => run.type !== 'text')
                ? { bodyHtml: [inlineToHtml(row.body)] }
                : { body: plain(row.body) }),
              ...(image ? { media: { type: 'image' as const, image } } : {}),
            },
          ];
        });
        return (
          <ContentSection {...head(band)} data-band="C-cards">
            <BlockCardSet
              items={cards}
              lead="none"
              across={cards.length >= 3 ? 3 : 2}
              size="lg"
              scroll="never"
            />
          </ContentSection>
        );
      }
      return (
        <ContentSection
          {...head(band)}
          data-band="B"
          arrangement="media"
          media={{
            image: slotImage(page, band.id),
            side: unit.side ?? 'start',
            weight: 'photo',
            head: 'lg',
          }}
        >
          {tiles(rows)}
        </ContentSection>
      );
    }

    /* People who each have a question, in their own words (VoiceLedger, as the service page's
       "Where we start"; owner, 11 Oct 2026: the icon-card grid was "too dense and doesn't make
       sense"). Each question is the row's large thing — what a visitor recognises — and the person
       asking stands beside it; the closing line sits under the rows, in the same band (it was a
       Statement band of its own, part b, which read as a second section). */
    case 'personas': {
      if (unit.part === 'b') return null;
      const table = blocksOf(band, 'table')[0];
      const closing = trailingAfterTable(band);
      /* The people table is the ledger; the hard parts that follow it are claim rows under it, as on
         every other hard-parts band. Until 31 Oct only the table rendered, and HealthTech's four claims
         never reached the page (found by kinds:check). */
      const { claims, stories } = claimsOf(band);
      const rows = (
        <ClaimRows
          claims={claims}
          stories={stories}
          claimFigure={ctx.claimFigure}
          ground={unit.surface === 'tint' ? 'paper-deep' : 'paper'}
          labelledBy={head(band).headingId}
        />
      );
      return (
        <VoiceLedger
          {...head(band)}
          lead={leadText(band)}
          items={(table?.rows ?? []).map((row) => ({
            voice: plain(row[1] ?? []),
            reply: plain(row[0] ?? []),
          }))}
          note={
            <Layout rowGap="stack">
              {closing.length > 0 ? (
                <ContentSectionText>
                  {closing.map((runs, index) => (
                    <p key={index}>{renderInline(runs)}</p>
                  ))}
                </ContentSectionText>
              ) : null}
              {rows}
            </Layout>
          }
        />
      );
    }

    /* Principles: ONE set (OfferSheet, as "What you get"; owner, 11 Oct 2026: two beside a
       photograph and three more in a band under it read as "2 sections or one?"). The principles three
       across (3 + 2 for five) on their rules and blue marks, in the full column: with the photograph
       beside them five ran two up to a lonely fifth and past the fold, so the band takes no photo. */
    case 'principles': {
      if (unit.part === 'b') return null;
      const rows = leads(band);
      return (
        <OfferSheet
          {...head(band)}
          items={rows.map((row) => ({
            title: row.title,
            ...(hasLink(row.body) || row.body.some((run) => run.type !== 'text')
              ? { bodyHtml: inlineToHtml(row.body) }
              : { body: plain(row.body) }),
          }))}
          across={rows.length % 3 === 0 || rows.length === 5 ? 3 : 2}
        />
      );
    }

    /* Two cases told in turn: the work, each beside its artefact. A story its client spoke about is
       set as a case card with the client's rated quote BESIDE it (TestimonialBeside), so the quote
       sits with its own story and never inside it (home round 2, 10 Oct 2026; round 1 had moved
       every story quote to a tint band after the last story, away from the story it was about). */
    case 'caseStories': {
      const items = band.blocks.filter(
        (b): b is Extract<CorpusBlock, { type: 'item' }> => b.type === 'item',
      );
      const item = items[unit.itemIndex ?? 0];
      if (!item) return null;
      const qualifier = slugOf(item.headingText.split(':')[0] ?? item.headingText);
      /* The story's client links to its case (owner, 11 Oct 2026), found by the name before the
         colon; a client whose case is unpublished gets a flagged PLACEHOLDER link (P43). */
      const caseLink = caseStudyLink(item.headingText.split(':')[0] ?? '');
      const image = hasSlot(page, band.id, qualifier)
        ? slotImage(page, band.id, qualifier)
        : undefined;
      const first = unit.part === 'a';
      const headProps = first ? head(band) : { id: unit.id };
      const quote = item.blocks.find(
        (b): b is Extract<CorpusBlock, { type: 'quote' }> => b.type === 'quote',
      );
      if (quote) {
        const paragraphs = item.blocks.flatMap((b) =>
          b.type === 'paragraph' ? [inlineToHtml(b.runs)] : [],
        );
        return (
          <ContentSection {...headProps} data-band="M">
            <TestimonialBeside
              work={
                <ul>
                  <BlockCard
                    title={item.headingText}
                    bodyHtml={paragraphs}
                    size="lg"
                    {...(image ? { media: { type: 'image' as const, image } } : {})}
                    {...(caseLink ? { href: caseLink.href, cue: 'title' as const } : {})}
                  />
                </ul>
              }
              item={testimonialItem(quote, ctx.ratings)}
            />
          </ContentSection>
        );
      }
      /* A story with no client quote is still a case (owner, 11 Oct 2026: "that's probably going
         to be a case study so treat it as such"): one horizontal case card, its cover beside its
         words, linked to the case (a flagged placeholder until it publishes, P43). */
      const paragraphs = item.blocks.flatMap((b) =>
        b.type === 'paragraph' ? [inlineToHtml(b.runs)] : [],
      );
      return (
        <ContentSection {...headProps} data-band="M">
          <ul>
            <BlockCard
              title={item.headingText}
              bodyHtml={paragraphs}
              size="lg"
              orientation="horizontal"
              {...(image ? { media: { type: 'image' as const, image } } : {})}
              {...(caseLink ? { href: caseLink.href, cue: 'title' as const } : {})}
            />
          </ul>
        </ContentSection>
      );
    }

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `OfferPage ${page.route}: band "${band.id}" has a shape the plan has not met; rendering it plainly.`,
        );
      }
      return (
        <ContentSection {...head(band)} data-band="C-text">
          <GenericBlocks band={band} />
        </ContentSection>
      );
  }
}

/* ── Pieces ───────────────────────────────────────────────────────────────────── */

/** The blocks after a band's list (a closing paragraph), as runs. */
function trailingAfterList(band: CorpusBand): InlineRun[][] {
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  const at = lastIndexWhere(blocks, (block) => block.type === 'list');
  return blocks
    .slice(at + 1)
    .flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));
}

function trailingAfterTable(band: CorpusBand): InlineRun[][] {
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  const at = lastIndexWhere(blocks, (block) => block.type === 'table');
  return blocks
    .slice(at + 1)
    .flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));
}

type Sentence = { runs: InlineRun[]; text: string };
function sentencesOf(runs: readonly InlineRun[]): Sentence[] {
  const out: Sentence[] = [];
  let cur: InlineRun[] = [];
  const flush = () => {
    const text = plain(cur).trim();
    if (text) out.push({ runs: trimEnd(trimStart(cur)), text });
    cur = [];
  };
  for (const run of runs) {
    if (run.type !== 'text') {
      cur.push(run);
      continue;
    }
    const parts = run.text.split(/(?<=[.?!])\s+/);
    parts.forEach((part, i) => {
      if (part) cur.push({ type: 'text', text: part });
      if (i < parts.length - 1) flush();
    });
  }
  flush();
  return out;
}

/** A closing paragraph authored as questions each answered by where to go (the CTA card's routes): undefined when it is not. */
function routesOf(
  paragraphs: readonly InlineRun[][],
): { question?: string; answer: InlineRun[] }[] | undefined {
  const routes: { question: string; answer: InlineRun[] }[] = [];
  for (const s of paragraphs.flatMap(sentencesOf)) {
    if (s.text.endsWith('?')) routes.push({ question: s.text, answer: [] });
    else {
      const r = routes.at(-1);
      if (!r) return undefined;
      if (r.answer.length) r.answer.push({ type: 'text', text: ' ' });
      r.answer.push(...s.runs);
    }
  }
  return routes.length > 0 && routes.every((r) => r.answer.length > 0 && hasLink(r.answer))
    ? routes
    : undefined;
}

/** A router row's words: the second column, and a third ("Best for") as a sentence after it. */
function routerBody(
  table: Extract<CorpusBlock, { type: 'table' }>,
  row: InlineRun[][],
): string {
  const second = plain(row[1] ?? []).replace(/\.$/, '');
  return table.header.length >= 3
    ? `${second}. ${plain(table.header[2] ?? [])}: ${plain(row[2] ?? [])}`
    : second;
}

/**
 * 3 or 4 tracks for `cells` (the tiles plus one CTA card per question) so they fill whole rows; where
 * neither does, the count whose last row is fuller, the last card taking what that row leaves
 * (owner, 30 Oct 2026: one dotted card per question).
 */
function ctaTracks(cells: number): 3 | 4 {
  if (cells % 3 === 0) return 3;
  if (cells % 4 === 0) return 4;
  return cells % 3 > cells % 4 ? 3 : 4;
}

/** M13 — a router: one icon card per destination, title the link's own words, body what follows the colon. */
function Router({ band, ctx }: { band: CorpusBand; ctx: OfferContext }) {
  /* Destinations come as link-led lines ("[UX Research](/…): find out…"), as a table whose key
     column links each service and whose second column says who it is for (component-map C8), or as
     a link row of names alone. */
  const table = blocksOf(band, 'table')[0];
  const rows = table
    ? table.rows.flatMap((row) => {
        const link =
          row[0]?.find((run) => run.type === 'link') ??
          row[0]?.flatMap((run) =>
            'children' in run ? run.children.filter((c) => c.type === 'link') : [],
          )[0];
        return link && link.type === 'link'
          ? [{ href: link.href, title: plain(link.children), body: routerBody(table, row) }]
          : [];
      })
    : band.blocks.flatMap((block) => {
        if (block.type === 'links')
          return block.links.map((link) => ({
            href: link.href,
            title: link.labelText,
            body: '',
          }));
        /* A bulleted list of link-led lines (/matter-design-system's services) reads as the same lines. */
        const lines =
          block.type === 'list'
            ? block.items.map((runs) => ({ type: 'paragraph' as const, runs }))
            : [block];
        return lines.flatMap((line) => {
          const lead = linkLead(line);
          return lead
            ? [
                {
                  href: lead.link.href,
                  title: plain(lead.link.children),
                  body: plain(lead.body),
                },
              ]
            : [];
        });
      });
  /* The paragraphs after a table are the band's closing words; before it, its lead. */
  const tableAt = band.blocks.findIndex((block) => block.type === 'table');
  const closing =
    tableAt >= 0
      ? band.blocks
          .slice(tableAt + 1)
          .flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []))
      : [];
  const sentence = (body: string) => body.charAt(0).toUpperCase() + body.slice(1);
  const routerLead = leadText(band);
  const closingFooter =
    closing.length > 0 ? (
      <ContentSectionText>
        {closing.map((runs, index) => (
          <p key={index}>{renderInline(runs)}</p>
        ))}
      </ContentSectionText>
    ) : undefined;
  const wrap = (set: ReactNode, footer?: ReactNode) => (
    <ContentSection {...head(band)} data-band="C-icon" lead={routerLead} footer={footer}>
      {set}
    </ContentSection>
  );
  /* Destinations the page draws (owner, 26 Oct 2026, the specialist services): home's bento, every
     tile one size, because the destinations are peers. Seven or eight take four tracks, 4 + 3 with
     the band's closing words in the eighth cell (owner, 29 Oct 2026, Q7); others three. Services
     named as a set are always the service tile, each with its own scene, wherever they are named
     (owner, 29 Oct 2026; decisions/2026-10-29-named-services-are-service-tiles). */
  const scenes = rows.map((row) => sceneFor(ctx, band, row.href) ?? serviceSceneFor(row.href));
  if (rows.length >= 3 && scenes.every(Boolean)) {
    /* The closing router is the set's CTA card (owner, 30 Oct 2026; decisions/2026-10-30-set-ends-in-a-cta-card)
       on every service page that closes its set with a way onward: questions each answered by links, or
       one linked statement kept whole (its words unchanged, no question). The words go in verbatim and
       every link becomes an arrow link in a dotted card, one card per question (owner, 30 Oct 2026). A closing with no link stays below the set. */
    const routes =
      routesOf(closing) ??
      (closing.length > 0 && closing.every(hasLink)
        ? [
            {
              answer: closing.flatMap((runs, index) =>
                index > 0 ? [{ type: 'text', text: ' ' } as InlineRun, ...runs] : runs,
              ),
            },
          ]
        : undefined);
    const n = rows.length;
    const cta: BentoCta | undefined = routes
      ? {
          routes: routes.map((r) => ({
            ...(r.question ? { question: r.question, answer: plain(r.answer).trim() } : {}),
            ...(!r.question ? { answer: plain(r.answer).trim() } : {}),
            actions: linksIn(r.answer).map((link) => ({
              label: plain(link.children),
              href: link.href,
            })),
          })),
        }
      : undefined;
    return wrap(
      <Bento
        tracks={
          cta
            ? /* A lone card is two cells wide (decisions/2026-10-30-set-ends-in-a-cta-card): counted
                 as one, seven tiles chose four tracks and squeezed it into the eighth cell. */
              ctaTracks(n + cta.routes.length + (cta.routes.length === 1 ? 1 : 0))
            : n === 7 || n === 8 || n === 4
              ? 4
              : 3
        }
        cta={cta}
        items={rows.map((row, index) => ({
          id: row.href,
          title: row.title,
          ...(row.body ? { body: sentence(row.body) } : {}),
          href: row.href,
          scene: scenes[index] as SketchName,
        }))}
      />,
      routes ? undefined : closingFooter,
    );
  }
  const glyphs = rows.map((row) => glyphForRoute(row.href));
  const items: BlockCardSetItem[] = rows.map((row, index) => ({
    id: row.href,
    title: row.title,
    ...(row.body ? { body: sentence(row.body) } : {}),
    href: row.href,
    icon: glyphs.every(Boolean) ? glyphs[index] : undefined,
  }));
  if (glyphs.every(Boolean)) {
    /* No `frame`: a boxed card set is retired (2026-10-19-no-hover-only-grounds). */
    return wrap(
      <BlockCardSet
        items={items}
        lead="none"
        across={rows.length % 4 === 0 ? 4 : 3}
        cue="title"
        scroll="never"
      />,
      closingFooter,
    );
  }
  return wrap(
    <Layout as="ul" rowGap="none">
      {rows.map((row) => (
        <ListCard
          key={row.href}
          titleAs="h3"
          title={row.title}
          body={row.body}
          href={row.href}
        />
      ))}
    </Layout>,
    closingFooter,
  );
}

type CaseGroup = {
  title: string;
  paragraphs: InlineRun[][];
  link?: Extract<InlineRun, { type: 'link' }>;
};

/** Labelled claims as cases: a claim starts one, the paragraphs after it belong to it. */
function caseGroups(band: CorpusBand): CaseGroup[] {
  const groups: CaseGroup[] = [];
  /* `###` cases (the 26 Oct copy, component-map C3): the heading is the case's title as authored, its
     paragraphs the body, its first link line ("Read the Dealpath case") the card's link. */
  const items = band.blocks.filter(
    (b): b is Extract<CorpusBlock, { type: 'item' }> => b.type === 'item',
  );
  if (items.length > 0) {
    return items.map((item) => {
      const link = item.blocks.flatMap((b) => (b.type === 'links' ? b.links : []))[0];
      const paragraphs = item.blocks.flatMap((b) => (b.type === 'paragraph' ? [b.runs] : []));
      const lifted = link ? undefined : paragraphs.at(-1);
      const trailing = lifted ? liftTrailingLink(lifted) : undefined;
      if (trailing?.link) paragraphs[paragraphs.length - 1] = trailing.runs;
      return {
        title: item.headingText,
        paragraphs,
        link: link
          ? { type: 'link' as const, href: link.href, children: link.label }
          : trailing?.link,
      };
    });
  }
  for (const block of band.blocks) {
    const lead = leadOf(block);
    if (lead) {
      groups.push({ title: labelTitle(lead.label), paragraphs: [[...lead.body]] });
    } else if (block.type === 'paragraph') {
      groups.at(-1)?.paragraphs.push(block.runs);
    }
  }
  for (const group of groups) {
    const last = group.paragraphs.at(-1);
    if (!last) continue;
    const lifted = liftTrailingLink(last);
    if (lifted.link) {
      group.link = lifted.link;
      group.paragraphs[group.paragraphs.length - 1] = lifted.runs;
    }
  }
  return groups;
}

/** The case group a quote is about: the one whose name its company carries ("Auxentios" in
 *  "Auxentios Technology"), else the last, after which the content authors a case set's quote. */
function quotedGroup(groups: readonly CaseGroup[], company: string): number {
  const name = (title: string) => title.replace(/[.:]$/, '').trim().toLowerCase();
  const wanted = company.toLowerCase();
  const found = groups.findIndex(
    (group) => wanted.includes(name(group.title)) || name(group.title).includes(wanted),
  );
  return found >= 0 ? found : groups.length - 1;
}

/**
 * M8 — case cards: each case with its cover, its name as authored and the words after it. Linked only
 * where a link is authored (the trailing "Read the case" becomes the card's cta, so no card holds a
 * link in its body).
 *
 * Cases are peers, so no card is featured, and none holds the client's quote (22 Oct 2026): a quote
 * the set ends on follows it as a band of its own (`voice`, owner 26 Oct 2026), linking to the case
 * its client is from. Four or more linked cases run in the kit Slider; fewer sit as one grid.
 */
function CaseSet({ ctx, band }: { ctx: OfferContext; band: CorpusBand }) {
  const groups = caseGroups(band);
  /* Every case links to its case page (owner, 11 Oct 2026). An authored "Read the case" line keeps
     its words as the card's cta; a case named without one finds its page by its name (routes.ts
     CASE_STUDY_SLUGS, or a flagged PLACEHOLDER). Where a set mixes the two, the found cards take the
     band's own authored label when every authored label agrees, so no card invents a wording. */
  const authoredLabels = new Set(
    groups.flatMap((group) => (group.link ? [plain(group.link.children)] : [])),
  );
  const sharedLabel = authoredLabels.size === 1 ? [...authoredLabels][0] : undefined;
  const items: BlockCardSetItem[] = groups.map((group) => {
    const found = group.link ? undefined : caseStudyLink(group.title);
    const href = group.link?.href ?? found?.href;
    const ctaLabel = group.link ? plain(group.link.children) : sharedLabel;
    const ref = href ? ctx.caseRefs[href] : undefined;
    const paragraphs = group.paragraphs.filter((runs) => runs.length > 0);
    const body =
      paragraphs.length > 1 ||
      paragraphs.some((runs) => hasLink(runs) || runs.some((r) => r.type !== 'text'))
        ? { bodyHtml: paragraphs.map((runs) => inlineToHtml(runs)) }
        : { body: paragraphs[0] ? plain(paragraphs[0]) : undefined };
    return {
      id: group.title,
      title: group.title,
      ...body,
      media: { type: 'image' as const, image: coverFor(ctx.page, group.title, ref) },
      ...(href ? { href, ...(ctaLabel ? { ctaLabel } : {}) } : {}),
    };
  });
  const linked = items.every((item) => item.href);
  /* A set whose cards all carry a cta wording reads its cta; one whose links were all found by name
     has no authored wording, so its titles are the cue. */
  const labelled = items.every((item) => item.ctaLabel);
  const cue = linked ? (labelled ? 'cta' : 'title') : undefined;
  /* Four or more cases: the kit Slider, three in view and the next peeking inside the column (Slider
     `peek`, owner 26 Oct 2026: the bled row "just shows the overflow"; sliders are allowed off the homepage while every card is in the page
     as it loads, with real links and no autoplay). The client's words left the set for a band of their
     own (`voice`); a case card never holds a quote (22 Oct 2026). */
  if (items.length >= 4 && linked) {
    return (
      <Slider label={band.headingText} peek>
        {items.map((item) => (
          <BlockCard
            key={item.id}
            title={item.title}
            {...('bodyHtml' in item && item.bodyHtml
              ? { bodyHtml: item.bodyHtml }
              : { body: item.body })}
            media={item.media}
            href={item.href}
            ctaLabel={item.ctaLabel}
            cue={cue}
            tracks={3}
          />
        ))}
      </Slider>
    );
  }
  return (
    <BlockCardSet
      lead="none"
      scroll="never"
      cue={cue}
      {...(items.length === 3 ? { across: 3 as const, size: 'md' as const } : {})}
      label={linked ? undefined : band.headingText}
      items={items}
    />
  );
}

/**
 * A client's words as a band of their own (owner, 26 Oct 2026). Proof `featured` where the speaker has a
 * portrait (the unit's `side` says which side it takes), else Proof centred; the stars come from the
 * page's ratings and the marks from Proof. After a set of cases, the quote links to its client's case.
 */
function Voice({ unit, ctx }: { unit: OfferUnit; ctx: OfferContext }) {
  const block = quoteOf(unit.band);
  if (!block) return null;
  const id = block.testimonialId;
  const rating = id ? ctx.ratings?.[id]?.value : undefined;
  const avatar = id ? ctx.avatars?.[id] : undefined;
  const quote = {
    ...proofQuote(block),
    ...(rating !== undefined ? { stars: rating } : {}),
    ...(avatar
      ? {
          portrait: {
            src: avatar.src,
            width: avatar.width,
            height: avatar.height,
            sources: avatar.sources,
          },
        }
      : {}),
  };
  const groups = kindOf(unit.band) === 'cases' ? caseGroups(unit.band) : [];
  const group = groups.length > 0 ? groups[quotedGroup(groups, quote.company)] : undefined;
  const found = group && !group.link ? caseStudyLink(group.title) : undefined;
  const href = group?.link?.href ?? found?.href;
  const name = group ? group.title.replace(/[.:]$/, '').trim() : undefined;
  const footer =
    href && name ? (
      <CtaRow rule={false} actions={[{ label: `Read the ${name} case`, href }]} />
    ) : undefined;
  return (
    <Section id={unit.id} surface={unit.surface} data-band="G">
      {avatar ? (
        <Proof
          arrangement="featured"
          quote={quote}
          reverse={unit.side === 'end'}
          footer={footer}
        />
      ) : (
        <Proof quote={quote} align="center" />
      )}
    </Section>
  );
}
