import { getKitPhoto } from '@/lib/photos';
import { Fragment, type ReactNode } from 'react';

import {
  Button,
  Cluster,
  Icon,
  Island,
  Layout,
  Prose,
  Section,
  TextureFlow,
  type MediaImage,
} from '@/components';
import {
  Banner,
  Bento,
  BlockCardSet,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  DataTable,
  EngagementOptions,
  ListCard,
  OfferSheet,
  ProfileCard,
  ProfileFollow,
  VoiceLedger,
  type BentoItem,
  type BlockCardSetItem,
  type EngagementScope,
  type HeroStat,
} from '@/patterns';
import type { CorpusBand, CorpusBlock, CorpusCaseRef, CorpusPage } from '@/lib/corpus-types';
import type { IconName } from '@/components';
import { glyphForRoute } from '@/lib/glyphs';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import { placeholderImage } from '@/lib/placeholders';
import { ROUTES } from '@/lib/routes';
import { sketchForRoute, type SketchName } from '@/lib/sketches';

import {
  CorpusHero,
  FaqItems,
  QuoteGroupBand,
  bodyOf,
  head,
  headingIdOf,
  type RatingsById,
} from './blocks';
import { corpusImage } from '@/lib/corpus-images';
import { coverFor, slotImage } from './images';
import styles from './CorpusPage.module.css';
import { CloseBand, LinkActions } from './CopyBands';
import { recordStats as homeRecordStats } from './HomePage';
import { UnitView, type OfferContext } from './OfferBands';
import { planOffer, TEMPLATE_BANDS } from './plan';
import { bandLinks, blocksOf, boldLead, html, labelTitle, plain, trimStart } from './text';

export type AboutPageProps = {
  page: CorpusPage;
  /** The cases the page cites, as each case's own page describes them (title, cover). */
  caseRefs?: Readonly<Record<string, CorpusCaseRef>>;
  /** Star ratings for the page's testimonials, by id (PLACEHOLDERS today; see the content seam). */
  ratings?: RatingsById;
};

type ItemBlock = Extract<CorpusBlock, { type: 'item' }>;

/** Every band id the About composition reads by name. */
const LEGACY_ABOUT_BANDS = [
  'ahmedabad-is-part-of-how-we-work',
  'the-practice-keeps-moving',
  'what-we-do',
  'who-we-work-with',
  'difference',
  'how-we-work',
  'leadership',
  'work-you-can-inspect',
  'testimonials',
  'company-record',
  'frequently-asked-questions',
  'what-remains-constant',
  'work-with-tcules',
  'careers',
] as const;

/**
 * Whether the corpus page still carries every band this composition names. The 26 Oct 2026 copy
 * reshaped About, so the template checks this and falls back to `PlainPage` rather than crash.
 */
const aboutPageFits = (page: CorpusPage): boolean =>
  LEGACY_ABOUT_BANDS.every((id) => page.bands.some((b) => b.id === id));

type AboutBandProps = {
  page: CorpusPage;
  band: CorpusBand;
  caseRefs: NonNullable<AboutPageProps['caseRefs']>;
};

/**
 * The 26 Oct copy's About (component-map § E /about, 29 Oct 2026): the ids About composes itself.
 * Every other band renders through the plan's id table (plan.ts `BAND_KINDS`) and OfferBands, so no
 * band of the copy is skipped: what-we-do as destinations, difference / who-uses-tcules / how-we-work
 * as sheets, testimonials as the wall, the questions, the close.
 */
const ABOUT_BANDS: Readonly<
  Record<(typeof TEMPLATE_BANDS)['/about'][number], (props: AboutBandProps) => ReactNode>
> = {
  'what-we-do': WhatWeDoBento,
  'who-uses-tcules': WhoUsesBand,
  leadership: LeadershipBand,
  'company-record': ({ page }) => <CompanyRecord page={page} />,
  /* About ends on a blue island, the same content and structure as the ink close (owner, 31 Oct 2026). */
  'work-with-tcules': ({ page, band }) => <CloseBand page={page} band={band} island="blue" />,
};

/**
 * The hero's paragraphs as authored: the bold standfirst ("Tcules is a digital product design studio
 * in Ahmedabad…") first, then the lede. The parser files a bold-only paragraph after the title as a
 * label with no body (`hero.extra`), which no hero reads, so About gathers it here rather than lose it.
 */
function aboutLedes(page: CorpusPage): InlineRun[][] {
  const standfirst = page.hero.extra.flatMap((block) =>
    block.type === 'labelled' && block.body.length === 0 ? [block.label] : [],
  );
  return [...standfirst, ...page.hero.lede];
}

/* The studio's own wide frame; faces cluster at 0.42 of its height. */
const ABOUT_HERO_PHOTO = {
  ...getKitPhoto('studio-team-holi'),
  focus: { x: 0.5, y: 0.42 },
  alt: 'The Tcules team in the Ahmedabad studio, faces and hands coloured for Holi',
};

/** The 26 Oct copy's About: the hero with the record as figures, then every band in order. */
function AboutCopy({ page, caseRefs, ratings }: AboutPageProps) {
  const units = planOffer(page);
  const ctx: OfferContext = { page, caseRefs: caseRefs ?? {}, shared: {}, ratings };
  return (
    <>
      <CorpusHero
        page={page}
        ledes={aboutLedes(page)}
        proofLine={false}
        stats={homeRecordStats(page)}
        /* The studio, wide, under the words, the head centred (owner, 31 Oct 2026). */
        arrangement="centred"
        media={{ type: 'image', image: ABOUT_HERO_PHOTO, ratio: { base: '3/2', lg: '2/1' } }}
      />
      {units.map((unit) => {
        const Band =
          unit.part === 'b'
            ? undefined
            : (ABOUT_BANDS as Readonly<Record<string, (props: AboutBandProps) => ReactNode>>)[
                unit.band.id
              ];
        return Band ? (
          <Fragment key={unit.id}>
            <Band page={page} band={unit.band} caseRefs={caseRefs ?? {}} />
          </Fragment>
        ) : (
          <UnitView key={unit.id} unit={unit} ctx={ctx} />
        );
      })}
    </>
  );
}

/** A list item's words as a row title: the first letter set in capitals, the words as authored. */
const sentenceCase = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

/** A service's scene, by its route; the audits hub takes the audit specialist's (component-map C17). */
const sceneForService = (href: string): SketchName | undefined =>
  sketchForRoute(href) ?? (href === ROUTES.audits ? 'specialist-audit' : undefined);

/**
 * What Tcules does (component-map § E /about 2): the eight services as home's approved What-we-do
 * Bento, four equal tiles on four tracks, two rows, every service in view. Each tile is its service's
 * name, its authored paragraph and its scene, and the whole tile is the link its "Explore …" line
 * names. Clickable tiles under the band's full-width head, nothing beside them.
 */
function WhatWeDoBento({ band: b }: AboutBandProps) {
  const tiles: BentoItem[] = items(b).flatMap((item) => {
    const link = item.blocks.flatMap((block) => (block.type === 'links' ? block.links : []))[0];
    const scene = link ? sceneForService(link.href) : undefined;
    if (!link || !scene) return [];
    return [
      {
        id: link.href,
        title: item.headingText,
        body: paragraphRuns(item.blocks).map(plain).join(' '),
        href: link.href,
        scene,
      },
    ];
  });
  return (
    <ContentSection {...head(b)} data-band="C-bento">
      <Bento items={tiles} tracks={4} />
    </ContentSection>
  );
}

/**
 * Who uses Tcules (component-map § E /about 4), ONE band so it reads as the visual one after the text
 * of `difference`: the head and its lead; the five audiences as a two-column read-down, each with the
 * glyph of the service line it comes for (first release, growth, modernisation, AI, design systems);
 * the SaaS line; then the authored h3 "Work you can inspect" over the four cases as covered cards
 * (each its own cover, its authored sentence the body), and the Lab line with "Explore all case
 * studies" under them. The cards sit under their own full-width head with nothing beside them.
 */
const AUDIENCE_GLYPHS = [
  'flag',
  'graph-up',
  'shield-check',
  'stars',
  'layers',
] as const satisfies readonly IconName[];

/** The first link in a run of paragraphs (the Lab line's own link), for the card's action. */
function labLink(paragraphs: readonly InlineRun[][]) {
  for (const runs of paragraphs) for (const run of runs) if (run.type === 'link') return run;
  return undefined;
}

function WhoUsesBand({ page, band: b, caseRefs }: AboutBandProps) {
  const blocks = b.blocks.filter((block) => block.type !== 'comment');
  const [leadBlock] = blocks;
  const lead = leadBlock?.type === 'paragraph' ? plain(leadBlock.runs) : undefined;
  const list = blocks.find(
    (block): block is Extract<CorpusBlock, { type: 'list' }> => block.type === 'list',
  );
  const lines = blocks.filter(
    (block): block is Extract<CorpusBlock, { type: 'paragraph' }> =>
      block.type === 'paragraph' && block !== leadBlock,
  );
  const work = items(b)[0];
  const workBlocks = work?.blocks ?? [];
  const cases = workBlocks.flatMap((block) => {
    if (block.type !== 'paragraph') return [];
    const [first, ...tail] = block.runs;
    return first?.type === 'link' && first.href.startsWith('/case-studies/')
      ? [{ link: first, body: trimStart(tail) }]
      : [];
  });
  const cards: BlockCardSetItem[] = cases.map(({ link, body }) => {
    const name = plain(link.children);
    return {
      id: link.href,
      title: name,
      /* "Doodle shows research…": the name is the card's title, so its sentence opens the body. */
      body: sentenceCase(plain(body)),
      media: { type: 'image', image: coverFor(page, name, caseRefs[link.href], b.id) },
      href: link.href,
    };
  });
  const after = workBlocks.filter(
    (block) =>
      !(
        block.type === 'paragraph' &&
        block.runs[0]?.type === 'link' &&
        block.runs[0].href.startsWith('/case-studies/')
      ),
  );
  const afterLinks = after.flatMap((block) => (block.type === 'links' ? block.links : []));
  const afterText = paragraphRuns(after);
  return (
    <ContentSection {...head(b)} data-band="M" lead={lead}>
      <Layout rowGap="section">
        <Layout rowGap="stack">
          {list ? (
            /* The five audiences as list cards, one per row: the glyph, then the title (owner,
               31 Oct 2026). A ruled row stands alone on its line, never in a grid. */
            /* In the start half, the end half left open (owner, 31 Oct 2026). */
            <Layout columns={{ base: 1, lg: 2 }} colGap="column">
              <Layout as="ul" rowGap="none">
                {list.items.map((runs, index) => (
                  <ListCard
                    key={index}
                    size="md"
                    titleAs="h3"
                    title={sentenceCase(plain(runs))}
                    {...(AUDIENCE_GLYPHS[index]
                      ? { marker: { type: 'icon' as const, name: AUDIENCE_GLYPHS[index] } }
                      : {})}
                  />
                ))}
              </Layout>
            </Layout>
          ) : null}
          {lines.length > 0 ? <Text paragraphs={lines.map((block) => block.runs)} /> : null}
        </Layout>
        {work ? (
          <Layout rowGap="stack">
            {/* The way to every case at the head's end, centred on it (owner, 31 Oct 2026). */}
            <Layout
              columns={{ base: 1, md: [1, 'auto'] }}
              colGap="column"
              rowGap="block"
              align="center"
            >
              <h3 id={`${b.id}-work-heading`}>{work.headingText}</h3>
              {afterLinks.length > 0 ? <LinkActions links={afterLinks} /> : null}
            </Layout>
            <BlockCardSet
              items={cards}
              lead="none"
              across={4}
              size="sm"
              cue="title"
              scroll="never"
              titleAs="h4"
            />
            {afterText.length > 0 ? (
              /* The Lab line as a card of its own, an ink island (owner, 31 Oct 2026): the sentence as
                 authored, its link lifted into the card's action. */
              <Island surface="ink">
                {/* The moving field, turbulent across the whole card with no side to resolve toward;
                    quiet behind the sentence (owner, 31 Oct 2026). */}
                <TextureFlow flow="turbulent" />
                <Layout
                  columns={{ base: 1, lg: [1, 'auto'] }}
                  colGap="column"
                  rowGap="block"
                  align="center"
                >
                  <div data-texture-calm>
                    <Text paragraphs={afterText} />
                  </div>
                  {labLink(afterText) ? (
                    <Button
                      as="a"
                      href={labLink(afterText)!.href}
                      emphasis="solid"
                      tone="primary"
                      size="md"
                    >
                      {plain(labLink(afterText)!.children)}
                    </Button>
                  ) : null}
                </Layout>
              </Island>
            ) : null}
          </Layout>
        ) : null}
      </Layout>
    </ContentSection>
  );
}

/**
 * Who founded Tcules (G17): the founders as profile cards under the head and its lead (ruling
 * 2026-10-12-people-get-profile-cards); then the studio's two `###` (The Ahmedabad studio, The
 * practice keeps moving) as a part of their own beside the team photograph, with the closing links.
 */
/**
 * The studio bands' photographs, in the order of the copy's two stories (owner, 31 Oct 2026: "images
 * from studio"): the Ahmedabad studio is the review in its room; the practice keeps moving is a pair
 * working at one screen.
 */
const STUDIO_PHOTOS: readonly ((page: CorpusPage) => MediaImage)[] = [
  (page) => {
    const binding = page.composition.mediaBindings.find((m) => m.id === 'about_studio_review');
    return binding
      ? { ...corpusImage(binding), alt: 'A design review in the Tcules studio in Ahmedabad' }
      : slotImage(page, 'leadership');
  },
  () =>
    getKitPhoto('studio-pair-at-monitor', {
      alt: 'Two Tcules designers working through a screen together',
    }),
];

function LeadershipBand({ page, band: b }: AboutBandProps) {
  const blocks = b.blocks.filter((block) => block.type !== 'comment');
  const lead = blocks[0]?.type === 'paragraph' ? plain(blocks[0].runs) : undefined;
  const people = items(b).filter((item) =>
    item.blocks.some(
      (block) =>
        block.type === 'links' && block.links.some((l) => /linkedin\.com\/in\//.test(l.href)),
    ),
  );
  const studio = items(b).filter((item) => !people.includes(item));
  const studioLinks = studio.flatMap((item) =>
    item.blocks.flatMap((block) => (block.type === 'links' ? block.links : [])),
  );
  return (
    <>
      <ContentSection {...head(b)} data-band="P" lead={lead}>
        <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="gutter">
          {people.map((item) => {
            const [name = item.headingText, ...role] = item.headingText.split(', ');
            const link = item.blocks.flatMap((block) =>
              block.type === 'links' ? block.links : [],
            )[0];
            const bio = paragraphRuns(item.blocks).map(plain).join(' ');
            return (
              <ProfileCard
                key={item.headingText}
                name={name}
                role={role.join(', ') || undefined}
                bio={bio || undefined}
                linkedin={link ? { label: link.labelText, href: link.href } : undefined}
              />
            );
          })}
        </Layout>
      </ContentSection>
      {/* The studio and the practice, each its own band with a photograph from the studio beside it,
          the sides zig-zagging (owner, 31 Oct 2026). Their links are the page's way out to the
          studio's other places, so they leave the story for a block of their own. */}
      {studio.map((item, index) => {
        const photo = STUDIO_PHOTOS[index];
        return (
          <ContentSection
            key={item.headingText}
            id={`${b.id}-${index + 2}`}
            data-band="B"
            heading={item.headingText}
            headingId={`${b.id}-${index + 2}-heading`}
            arrangement="media"
            media={{
              image: photo ? photo(page) : slotImage(page, b.id),
              side: index % 2 === 0 ? 'start' : 'end',
              weight: 'photo',
            }}
          >
            <ContentSectionText>
              <Prose html={paragraphRuns(item.blocks).map(html).join('')} />
            </ContentSectionText>
          </ContentSection>
        );
      })}
      {studioLinks.length > 0 ? (
        /* The studio elsewhere (owner, 31 Oct 2026: "a separate cta block with some relevant title"),
           as a paper island on the paper band, read by its moving light-blue field and its rounding
           (decisions/2026-10-31-formless-islands-turbulent-paper-island-textured). The title is ours,
           not the copy's: logged in docs/content-changes.md. */
        <Section
          id={`${b.id}-elsewhere`}
          data-band="C-links"
          aria-labelledby={`${b.id}-elsewhere-heading`}
          density="open"
        >
          {/* The field across the band, edges blurred wide and rounded; at full strength around the
              words, faint in the space around them (owner, 31 Oct 2026). */}
          <TextureFlow flow="turbulent" feather bleed />
          <Layout
            rowGap="stack"
            justifyItems="center"
            className={styles.centred}
            data-texture-focus
          >
            <h2 id={`${b.id}-elsewhere-heading`}>
              Follow the studio, read its reviews, join the team
            </h2>
            <Cluster colGap="stack" rowGap="block" justify="center">
              {studioLinks.map((link) => (
                <Button
                  key={link.href}
                  as="a"
                  href={link.href}
                  emphasis="link"
                  tone="primary"
                  size="md"
                  icon={<Icon name="arrow-right" />}
                >
                  {link.labelText}
                </Button>
              ))}
            </Cluster>
          </Layout>
        </Section>
      ) : null}
    </>
  );
}

const band = (page: CorpusPage, id: string): CorpusBand => {
  const found = page.bands.find((b) => b.id === id);
  if (!found) throw new Error(`AboutPage: the corpus page has no band "${id}".`);
  return found;
};

const items = (b: CorpusBand): ItemBlock[] =>
  b.blocks.filter((block): block is ItemBlock => block.type === 'item');

const paragraphRuns = (blocks: readonly CorpusBlock[]): InlineRun[][] =>
  blocks.flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));

/** A run of paragraphs as running text at the body measure. */
function Text({
  paragraphs,
  align,
}: {
  paragraphs: readonly InlineRun[][];
  align?: 'start' | 'center';
}) {
  return (
    <ContentSectionText align={align}>
      <Prose html={paragraphs.map(html).join('')} />
    </ContentSectionText>
  );
}

/* An external link opens in a new tab and says so to the engine's privacy default. */
/**
 * TIER 3 — the About page, from the `_pages/` corpus (page-mapping § 4.10).
 *
 * The one page of its type, composed band by band in the content team's order. No two neighbours share
 * a shape: the studio paragraphs beside a photograph, a photograph beside the studio's story, plain
 * prose, a rail of six services, three situations, two tiles beside a photograph, three differences,
 * the principles in an accordion beside a photograph, two people, four cases, the working wall, client
 * voices, the company record as two halves, the questions, a coda beside a photograph, the ask and a
 * careers banner. The hero holds the title and its first paragraph; the rest of the opening splits into
 * `studio`, so the first viewport is not a wall of text.
 */
export function AboutPage({ page, caseRefs = {}, ratings }: AboutPageProps) {
  /* The 26 Oct 2026 copy reshaped About's bands: it composes from the plan (AboutCopy). The earlier
     composition below stays for a page that still carries the earlier bands. */
  if (!aboutPageFits(page))
    return <AboutCopy page={page} caseRefs={caseRefs} ratings={ratings} />;
  const [lede1, ...opening] = page.hero.lede;
  return (
    <>
      <CorpusHero page={page} ledes={lede1 ? [lede1] : []} stats={recordStats(page)} texture />
      <Studio page={page} opening={opening} />
      <Ahmedabad page={page} />
      <Practice page={page} />
      <WhatWeDo page={page} />
      <WhoWeWorkWith page={page} />
      <Difference page={page} />
      <HowWeWork page={page} />
      <Leadership page={page} />
      <WorkYouCanInspect page={page} caseRefs={caseRefs} />
      <QuoteGroupBand band={band(page, 'testimonials')} ratings={ratings} />
      <CompanyRecord page={page} />
      <Faq page={page} />
      <Constant page={page} />
      <WorkWithUs page={page} />
      <Careers page={page} />
    </>
  );
}

/* ── the record as the hero's figures ─────────────────────────────────────────── */

/**
 * The studio's three figures from its own record table ("Tcules at a glance"), in the hero's stats
 * row as on home (home round 3): founded, projects, countries. The table still prints every fact.
 */
const RECORD_FIGURES: Readonly<Record<string, (value: string) => HeroStat>> = {
  Founded: (value) => ({ value, label: 'Founded' }),
  Projects: (value) => ({
    value: value.replace(/^More than (\d+)$/u, '$1+'),
    label: 'Projects',
  }),
  'Client reach': (value) => ({
    value: /\d+/u.exec(value)?.[0] ?? value,
    label: 'Countries with clients',
  }),
};

function recordStats(page: CorpusPage): HeroStat[] {
  const table = blocksOf(band(page, 'company-record'), 'table')[0];
  if (!table) return [];
  return Object.entries(RECORD_FIGURES).flatMap(([fact, form]) => {
    const row = table.rows.find((cells) => plain(cells[0] ?? []) === fact);
    return row ? [form(plain(row[1] ?? []))] : [];
  });
}

/* ── S · the opening, split from the hero ────────────────────────────────────── */

/**
 * Three short paragraphs and no head, so the photograph carries the band (`weight: 'photo'`, 6:5 in
 * the 7 track). Copy-weighted, the paragraphs sat as a 130-tall island in the middle of a 596-tall
 * 4:5 column, the band's large thing nowhere (critic C3.5).
 */
function Studio({ page, opening }: { page: CorpusPage; opening: readonly InlineRun[][] }) {
  return (
    <ContentSection
      id="studio"
      data-band="B"
      arrangement="media"
      media={{ image: slotImage(page, 'studio'), side: 'end', pin: false, weight: 'photo' }}
    >
      <Text paragraphs={opening} />
    </ContentSection>
  );
}

/* ── 1 · Ahmedabad: the studio and its people, the band's own photograph ─────── */

function Ahmedabad({ page }: { page: CorpusPage }) {
  const b = band(page, 'ahmedabad-is-part-of-how-we-work');
  return (
    <ContentSection
      {...head(b)}
      data-band="B"
      arrangement="media"
      media={{ image: slotImage(page, b.id), side: 'start', pin: false, head: 'lg' }}
    >
      <Text paragraphs={paragraphRuns(b.blocks)} />
    </ContentSection>
  );
}

/* ── 2 · the practice: an argument in prose ──────────────────────────────────── */

function Practice({ page }: { page: CorpusPage }) {
  const b = band(page, 'the-practice-keeps-moving');
  return (
    <ContentSection {...head(b)} data-band="C-text" arrangement="beside">
      <Text paragraphs={paragraphRuns(b.blocks)} />
    </ContentSection>
  );
}

/* ── 3 · what we do: six services, all in view ───────────────────────────────── */

/**
 * Six services with long bodies, as one grid of linked icon cards: three across from 1024, two from
 * 768, stacked on a phone. Every service stays in view (owner, 10 Oct 2026, home round 1: a slider
 * hides everything past its first view from most readers; this band was a Slider showing three). Each
 * card's body may carry a link of its own (Software Development's), so every card takes the static
 * frame (G3b): the cta is each card's one anchor, and all six answer the pointer alike.
 */
function WhatWeDo({ page }: { page: CorpusPage }) {
  const b = band(page, 'what-we-do');
  const cards: BlockCardSetItem[] = items(b).map((item) => {
    const link = blocksOf({ ...b, blocks: item.blocks }, 'links')[0]?.links[0];
    return {
      id: item.headingText,
      title: item.headingText,
      bodyHtml: paragraphRuns(item.blocks).map((runs) => inlineToHtml(runs)),
      icon: link ? glyphForRoute(link.href) : undefined,
      href: link?.href,
      ctaLabel: link?.labelText,
    };
  });
  return (
    <ContentSection {...head(b)} data-band="C-icon">
      <BlockCardSet
        items={cards}
        lead="none"
        across={3}
        frame="box"
        linkScope="cta"
        cue="cta"
        scroll="never"
      />
    </ContentSection>
  );
}

/* ── 4 · who we work with: three situations as peers ─────────────────────────── */

function WhoWeWorkWith({ page }: { page: CorpusPage }) {
  const b = band(page, 'who-we-work-with');
  const [leadBlock, list, ...closing] = b.blocks;
  const rows =
    list?.type === 'list'
      ? list.items.flatMap((runs) => {
          const lead = boldLead(runs);
          return lead ? [{ voice: labelTitle(lead.label), reply: plain(lead.body) }] : [];
        })
      : [];
  /* The three situations as the questions layout (pattern 32: the reader recognises their own
     situation in the large line, what it involves beside it); the closing two lines under the rows,
     in the same band. */
  return (
    <VoiceLedger
      id={b.id}
      heading={b.headingText}
      headingId={headingIdOf(b)}
      lead={leadBlock?.type === 'paragraph' ? plain(leadBlock.runs) : undefined}
      items={rows}
      note={<Text paragraphs={paragraphRuns(closing)} />}
    />
  );
}

/* ── 5 · what makes the practice different: five principles, one set ───────────── */

/**
 * Five principles as ONE OfferSheet, three across (3 + 2), the band's link under the set. It was two
 * tiles beside a photograph and three more under it, the set running on past the image into a second
 * row (owner, 11 Oct 2026: an image beside a set whose items extend into the next row is illegal).
 * Each principle's two paragraphs read as one body.
 */
function Difference({ page }: { page: CorpusPage }) {
  const b = band(page, 'difference');
  const all = items(b);
  const link = bandLinks({ ...b, blocks: all.at(-1)?.blocks ?? [] })[0];
  return (
    <OfferSheet
      id={b.id}
      heading={b.headingText}
      headingId={headingIdOf(b)}
      across={3}
      items={all.map((item) => ({
        title: item.headingText,
        bodyHtml: paragraphRuns(item.blocks)
          .map((runs) => inlineToHtml(runs))
          .join(' '),
      }))}
      note={
        link ? (
          <CtaRow rule={false} actions={[{ label: link.labelText, href: link.href }]} />
        ) : undefined
      }
    />
  );
}

/* ── 6 · how Tcules works: five principles, closed ───────────────────────────── */

/* Each principle's drawing, in the authored order (EngagementOptions' scopes). */
const HOW_SCOPES: readonly EngagementScope[] = [
  'start',
  'direct',
  'inside',
  'overlap',
  'commercial',
];

/**
 * Five working principles as the "Ways to work with us" cards (owner, 11 Oct 2026): a drawing each on
 * its plate, the principle under it, its two paragraphs as one body. Five across from 1440. They were
 * five tiles in two columns beside a stand-in photograph — "a hella lot of content for this one
 * section"; the drawings make the five comparable before a word is read.
 */
function HowWeWork({ page }: { page: CorpusPage }) {
  const b = band(page, 'how-we-work');
  return (
    <EngagementOptions
      id={b.id}
      heading={b.headingText}
      headingId={headingIdOf(b)}
      options={items(b).map((item, index) => ({
        title: item.headingText,
        body: paragraphRuns(item.blocks).map(plain).join(' '),
        scope: HOW_SCOPES[index],
      }))}
    />
  );
}

/* ── 7 · the people behind the studio ────────────────────────────────────────── */

/**
 * PROFILE CARDS, then ONE studio LinkedIn banner (owner, 12 Oct 2026: "somewhat like the testimonial
 * card. image (square or circle), name, position, bio, linkedin. and then 1 tcules linkedin banner").
 * The heading "Jatin Leuva, Founder & CEO" is split at its first comma into the name and the position.
 * Each portrait is a square register placeholder until the shoot; the banner carries the team photo.
 */
function Leadership({ page }: { page: CorpusPage }) {
  const b = band(page, 'leadership');
  const leaders = items(b).map((item) => {
    const at = item.blocks.findIndex((block) => block.type === 'links');
    const [name = item.headingText, ...role] = item.headingText.split(', ');
    const own = item.blocks.slice(0, at + 1);
    return {
      name,
      role: role.join(', '),
      bio: paragraphRuns(own),
      link: blocksOf({ ...b, blocks: own }, 'links')[0]?.links[0],
      after: item.blocks.slice(at + 1),
    };
  });
  const after = leaders.flatMap((leader) => leader.after);
  const studioLink = blocksOf({ ...b, blocks: after }, 'links')[0]?.links[0];
  const studioText = paragraphRuns(after);
  return (
    <ContentSection {...head(b)} data-band="P">
      <Layout rowGap="gutter">
        <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="gutter">
          {leaders.map((leader) => (
            <ProfileCard
              key={leader.name}
              name={leader.name}
              role={leader.role || undefined}
              bio={leader.bio.length > 0 ? leader.bio.map(plain).join(' ') : undefined}
              linkedin={
                leader.link
                  ? { label: leader.link.labelText, href: leader.link.href }
                  : undefined
              }
            />
          ))}
        </Layout>
        {studioLink ? (
          <ProfileFollow
            body={studioText.map(plain).join(' ')}
            link={{ label: studioLink.labelText, href: studioLink.href }}
            image={slotImage(page, b.id)}
          />
        ) : null}
      </Layout>
    </ContentSection>
  );
}

/* ── 8a · 8b · the work you can inspect ──────────────────────────────────────── */

/**
 * Four cases, each named for what it proves, as linked covers, FEATURED THEN LISTED (home round 2,
 * 10 Oct 2026: four identical items in a row is the shape the owner called boring): the first leads
 * at full width beside its copy and the other three sit under it (BlockCardSet `auto`, ruling C3),
 * the arrangement the case-study index's "Four to start with" already uses. Then the Lab paragraph
 * and the link to every case beside the working wall. The band's bound photograph may not sit beside clickable cards
 * (9 Oct), so the band splits: the cards first, then the wall.
 */
function WorkYouCanInspect({
  page,
  caseRefs,
}: {
  page: CorpusPage;
  caseRefs: NonNullable<AboutPageProps['caseRefs']>;
}) {
  const b = band(page, 'work-you-can-inspect');
  const cases = b.blocks.flatMap((block) => {
    if (block.type !== 'paragraph') return [];
    const [first, ...tail] = block.runs;
    return first?.type === 'link' ? [{ link: first, body: trimStart(tail) }] : [];
  });
  const cards: BlockCardSetItem[] = cases.map(({ link, body }) => {
    const name = plain(link.children);
    return {
      id: link.href,
      title: name,
      ...bodyOf(body),
      media: { type: 'image', image: coverFor(page, name, caseRefs[link.href]) },
      href: link.href,
    };
  });
  const wall = blocksOf(b, 'links').flatMap((block) => block.links)[0];
  const labParagraph = b.blocks.find(
    (block) => block.type === 'paragraph' && block.runs[0]?.type !== 'link',
  );
  return (
    <>
      <ContentSection
        {...head(b)}
        data-band="M"
        footer={
          wall ? <CtaRow actions={[{ label: wall.labelText, href: wall.href }]} /> : undefined
        }
      >
        <BlockCardSet items={cards} lead="auto" cue="title" scroll="never" />
      </ContentSection>
      {labParagraph?.type === 'paragraph' ? (
        <Lab page={page} band={b} runs={labParagraph.runs} />
      ) : null}
    </>
  );
}

/**
 * The Future Interfaces Lab, as a band of its own after the cases (owner, 11 Oct 2026: "the FIL section
 * is just text and image. i think that can be designed really well"). The cases' link to every case
 * moves to the cases band's foot, where it belongs; the Lab is a Banner beside its working-wall
 * photograph, on the dark band (owner, 12 Oct 2026: "use the dark band for FIL"), its name (the sentence's own link words) as the banner's heading and
 * the sentence as the lead, and the Lab's link as the banner's one action (its own link words).
 */
function Lab({
  page,
  band: b,
  runs,
}: {
  page: CorpusPage;
  band: CorpusBand;
  runs: readonly InlineRun[];
}) {
  const link = runs.find(
    (run): run is Extract<InlineRun, { type: 'link' }> => run.type === 'link',
  );
  const name = link ? plain(link.children) : 'Future Interfaces Lab';
  return (
    <Banner
      form="beside"
      mediaSide="end"
      id={`${b.id}-lab`}
      headingId={`${b.id}-lab-heading`}
      heading={name}
      lead={plain(runs)}
      actions={
        link ? <CtaRow rule={false} actions={[{ label: name, href: link.href }]} /> : undefined
      }
      image={{ ...slotImage(page, b.id), kind: 'photograph' }}
      surface="ink"
    />
  );
}

/* ── 10 · the company record, two halves ─────────────────────────────────────── */

/**
 * Sixteen facts as a record that holds the fold: DataTable's `split`, two boxed halves of eight side
 * by side from 1024, each with the authored header row, and one continuous table where the layout is
 * one column (owner, 10 Oct 2026). The band's heading names it.
 */
function CompanyRecord({ page }: { page: CorpusPage }) {
  const b = band(page, 'company-record');
  const table = blocksOf(b, 'table')[0];
  if (!table) return null;
  const [key = [], ...columns] = table.header;
  return (
    <ContentSection {...head(b)} data-band="E">
      <DataTable
        split
        labelledBy={headingIdOf(b)}
        keyColumn={{ heading: plain(key) }}
        columns={columns.map((cell) => ({ heading: plain(cell) }))}
        rows={table.rows.map((row) => ({
          header: plain(row[0] ?? []),
          cellsHtml: row.slice(1).map((cell) => inlineToHtml(cell)),
        }))}
      />
    </ContentSection>
  );
}

/* ── 11 · the questions ──────────────────────────────────────────────────────── */

function Faq({ page }: { page: CorpusPage }) {
  const b = band(page, 'frequently-asked-questions');
  return (
    <ContentSection {...head(b)} data-band="D-faq" align="center">
      <ContentSectionText>
        <FaqItems band={b} />
      </ContentSectionText>
    </ContentSection>
  );
}

/* ── 12 · what remains constant: the coda beside a photograph ────────────────── */

/**
 * The coda: four short lines that close the argument, set as type rather than beside a stand-in
 * photograph. The short declarative lines ("Software is our material.") are large, the one sentence
 * that explains them reads at the lead step between them.
 */
function Constant({ page }: { page: CorpusPage }) {
  const b = band(page, 'what-remains-constant');
  const lines = paragraphRuns(b.blocks).map(plain);
  return (
    <ContentSection {...head(b)} data-band="B" arrangement="beside">
      <Layout rowGap="stack">
        {lines.map((line, index) => (
          <p key={index} className={line.length > 60 ? styles.codaBody : styles.codaLine}>
            {line}
          </p>
        ))}
      </Layout>
    </ContentSection>
  );
}

/* ── 13 · the ask · 14 · careers ─────────────────────────────────────────────── */

function WorkWithUs({ page }: { page: CorpusPage }) {
  const b = band(page, 'work-with-tcules');
  const link = bandLinks(b)[0];
  const [lead] = paragraphRuns(b.blocks);
  if (!link) return null;
  return (
    <CtaSection
      id={b.id}
      data-band="L"
      arrangement="open"
      heading={b.headingText}
      body={lead ? [plain(lead)] : undefined}
      actions={[{ label: link.labelText, href: link.href }]}
    />
  );
}

/**
 * A second ask after the close is authored (P19), so it takes a link and a photograph rather than a
 * second solid: a head over a wide panorama, so the page ends the way the studio opens.
 */
function Careers({ page }: { page: CorpusPage }) {
  const b = band(page, 'careers');
  const link = bandLinks(b)[0];
  const [lead] = paragraphRuns(b.blocks);
  return (
    <Banner
      form="below"
      headingId={headingIdOf(b)}
      heading={b.headingText}
      lead={lead ? plain(lead) : undefined}
      actions={
        link ? (
          <CtaRow rule={false} actions={[{ label: link.labelText, href: link.href }]} />
        ) : undefined
      }
      image={{ ...placeholderImage(page.route, b.id), kind: 'photograph' }}
    />
  );
}
