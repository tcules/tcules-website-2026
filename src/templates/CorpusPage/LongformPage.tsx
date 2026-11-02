import { Layout } from '@/components';
import {
  BlockCardSet,
  CtaRow,
  CtaSection,
  ContentSection,
  ContentSectionText,
  DataTable,
  Statement,
  type BlockCardSetItem,
} from '@/patterns';
import type { CorpusBand, CorpusCaseRef, CorpusPage } from '@/lib/corpus-types';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import { renderInline } from '@/lib/inline-render';

import { CorpusHero, EnquiryBand, TableLegend, bodyOf, head, headingIdOf } from './blocks';
import { ArticleShell } from './LongformShell';
import { coverFor } from './images';
import { formBeforeFaq } from './order';
import { blocksOf, hasLink, loneLink, plain } from './text';

export type LongformFamily = 'case' | 'article' | 'term';

export type LongformPageProps = {
  page: CorpusPage;
  family: LongformFamily;
  /** The cases the page cites, as each case's own page describes them (title, cover). */
  caseRefs: Readonly<Record<string, CorpusCaseRef>>;
};

/**
 * TIER 3 — the long-form page: a page you would read like an article, from the `_pages/` corpus
 * (page-mapping § 1.1, M19). Its argument is a run of sections in ONE shell: a table-of-contents rail
 * beside a reading column, so the outline names the document and the reader can leave and return. The
 * bands before and after the shell are composed: they are the page's facts and its calls to action.
 *
 * What a long-form page is NOT is a stack of bands. The column is Prose, and what breaks it is a
 * numbered method (Steps), a bound artefact (Media) or a table, so it never runs more than two
 * Prose-only sections in a row (§ 3). Every shape is read from the words' structure, not a band id:
 *
 *   case     the hero, then its last lede paragraph as the one large statement (a split from the
 *            hero, page-mapping J); the record ("At a glance": a table whose first row is a pair);
 *            the argument shell, from the first band after the record to the last band before a
 *            table of peers; the impact cards; the cases to read next; the enquiry.
 *
 *   article  the hero (the byline as its extras row), the whole argument in one shell with the
 *            outline rail, then the close the author wrote last: a tinted band whose sentences keep
 *            their inline links, with the ask as a link button.
 *
 *   term     the hero holds the definition; the term's sharpest sentence is its statement (a split
 *            from the hero); the rest of the definition opens the shell as a head-less section above
 *            the headed ones; a close with one link as the page's ask.
 *
 * Nothing is reordered, and every word is the corpus's.
 */
export function LongformPage({ page, family, caseRefs }: LongformPageProps) {
  if (family === 'article') return <ArticlePage page={page} />;
  if (family === 'term') return <TermPage page={page} />;
  return <CasePage page={page} caseRefs={caseRefs} />;
}

/* ── The case ─────────────────────────────────────────────────────────────────── */

function CasePage({
  page,
  caseRefs,
}: {
  page: CorpusPage;
  caseRefs: LongformPageProps['caseRefs'];
}) {
  const { hero } = page;
  const anchor = page.conversion?.anchor ?? 'enquiry';
  const bands = formBeforeFaq(page.bands);

  /* The structure, read from the bands' blocks: a leading record, the shell, then a table of peers,
     a set of links to other cases, and the form. */
  const record = bands[0] && isRecord(bands[0]) ? bands[0] : undefined;
  const close = bands.find((band) => band.id === anchor);
  const peers = bands.find((band) => band !== record && isPeers(band));
  const related = bands.find((band) => hasCaseLinks(band) && band !== close);
  const shellStart = record ? 1 : 0;
  const shellEnd = peers
    ? bands.indexOf(peers)
    : related
      ? bands.indexOf(related)
      : bands.length;
  const shell = bands.slice(shellStart, shellEnd);

  /* The hero keeps two ledes; a third paragraph that is one sentence is the case's thesis, and goes to
     the next band as a statement (J) so the hero holds its fold. */
  const [lede1, lede2, ...thesis] = hero.lede;
  const ledes = [lede1, lede2].filter((runs): runs is InlineRun[] => Boolean(runs));

  return (
    <>
      <CorpusHero page={page} ledes={ledes} texture />

      {thesis.map((runs, index) => (
        <Statement
          key={index}
          as="p"
          align="start"
          id={index === 0 ? 'case-thesis' : `case-thesis-${index + 1}`}
        >
          {plain(runs)}
        </Statement>
      ))}

      {record ? <RecordBand band={record} /> : null}

      {shell.length > 0 ? <ArticleShell page={page} sections={shell} /> : null}

      {peers ? <ImpactBand band={peers} /> : null}
      {related ? <RelatedBand page={page} band={related} caseRefs={caseRefs} /> : null}
      {close ? <EnquiryBand page={page} band={close} /> : null}
    </>
  );
}

/* ── The article ──────────────────────────────────────────────────────────────── */

/**
 * An article: the hero, the whole argument in one shell, and the close. The byline is the hero's
 * extras row, verbatim (PageHero's `credits` and `dates` would replace its words). The close is the
 * last band when it ends on a lone link: its sentences keep their inline links, so it is a tinted
 * ContentSection with the ask as a link button (M3, the form with inline links), never a CtaSection.
 */
function ArticlePage({ page }: { page: CorpusPage }) {
  // Legal sections stay in authored order, including a final contact link inside the document.
  const { shell, close } =
    page.pageType === 'legal'
      ? { shell: page.bands, close: undefined }
      : splitClose(formBeforeFaq(page.bands));
  return (
    <>
      <CorpusHero page={page} texture />
      {shell.length > 0 ? <ArticleShell page={page} sections={shell} /> : null}
      {close ? <CloseBand band={close} /> : null}
    </>
  );
}

/* ── The term ─────────────────────────────────────────────────────────────────── */

/**
 * A defined term. The hero keeps the definition (its first paragraph); the sharpest sentence after
 * it is the term's statement (J, a split from the hero); the paragraphs that follow open the shell as
 * a head-less section, so the definition reads on into the headed sections beside the same rail.
 */
function TermPage({ page }: { page: CorpusPage }) {
  const { hero } = page;
  const [definition, sharpest, ...rest] = hero.lede;
  const { shell, close } = splitClose(formBeforeFaq(page.bands));
  const continued: CorpusBand | undefined =
    rest.length > 0
      ? {
          id: 'definition-2',
          anchored: false,
          heading: [],
          headingText: '',
          blocks: rest.map((runs) => ({ type: 'paragraph' as const, runs })),
        }
      : undefined;
  return (
    <>
      <CorpusHero page={page} ledes={definition ? [definition] : []} texture />
      {sharpest ? (
        <Statement as="p" align="start" id="definition">
          {plain(sharpest)}
        </Statement>
      ) : null}
      <ArticleShell page={page} sections={continued ? [continued, ...shell] : shell} />
      {close ? <CloseBand band={close} /> : null}
    </>
  );
}

/* ── The close ────────────────────────────────────────────────────────────────── */

/** The link a band ends on: its last lone-link line (the full stop, if any, is dropped). */
function closingLink(band: CorpusBand) {
  const last = band.blocks.filter((block) => block.type !== 'comment').at(-1);
  if (last?.type === 'links' && last.links.length === 1) return last.links[0];
  if (last?.type === 'paragraph') {
    const link = loneLink(last.runs);
    return link
      ? { href: link.href, label: link.children, labelText: plain(link.children) }
      : null;
  }
  return null;
}

/**
 * The bands before the close, and the close: the last band, when it ends on a lone link. A page whose
 * last band is not an ask has no close, and every band is in the shell.
 */
function splitClose(bands: readonly CorpusBand[]) {
  const last = bands.at(-1);
  const close = last && closingLink(last) ? last : undefined;
  return { shell: close ? bands.slice(0, -1) : [...bands], close };
}

/**
 * M3 — a close that is one ask. Copy with no inline link is a CtaSection `open` (heading, its
 * sentence, the link as the page's one solid). Copy WITH inline links keeps them, so it is a tinted
 * ContentSection with the sentences as running text and the ask as a link button: CtaSection's body
 * is plain strings, and a link in a sentence must survive.
 */
function CloseBand({ band }: { band: CorpusBand }) {
  const link = closingLink(band);
  if (!link) return null;
  const paragraphs = band.blocks.flatMap((block) =>
    block.type === 'paragraph' && !loneLink(block.runs) ? [block.runs] : [],
  );
  if (!paragraphs.some(hasLink) && paragraphs.length <= 2) {
    const [first, second] = paragraphs.map(plain);
    return (
      <CtaSection
        id={band.id}
        data-band="L"
        arrangement="open"
        heading={band.headingText}
        body={first ? (second ? [first, second] : [first]) : undefined}
        actions={[{ label: link.labelText, href: link.href }]}
      />
    );
  }
  return (
    <ContentSection {...head(band)} data-band="L" surface="tint">
      <ContentSectionText>
        <Layout rowGap="text">
          {paragraphs.map((runs, index) => (
            <p key={index}>{renderInline(runs)}</p>
          ))}
        </Layout>
      </ContentSectionText>
      <CtaRow rule={false} actions={[{ label: link.labelText, href: link.href }]} />
    </ContentSection>
  );
}

/** A table whose first body row is a pair and whose header is too: a record, not a comparison. */
function isRecord(band: CorpusBand): boolean {
  const table = blocksOf(band, 'table')[0];
  return Boolean(table && table.header.length === 2 && blocksOf(band, 'table').length === 1);
}

/** A band that is only a table of peers (rows with no list or prose around them). */
function isPeers(band: CorpusBand): boolean {
  const live = band.blocks.filter((block) => block.type !== 'comment');
  return live.length === 1 && live[0]?.type === 'table';
}

function hasCaseLinks(band: CorpusBand): boolean {
  return blocksOf(band, 'links').some((block) =>
    block.links.some((link) => link.href.startsWith('/case-studies/')),
  );
}

/* ── Record ───────────────────────────────────────────────────────────────────── */

/**
 * M16 — "At a glance": a key/value record whose first row is a pair, so it has no header row. The
 * markdown parser read the first pair as the header, so it is put back as the first row. The band's own
 * heading names the table, so no caption prints it twice. Words after the table (the related services,
 * with their inline links) follow it at reading width.
 */
function RecordBand({ band }: { band: CorpusBand }) {
  const table = blocksOf(band, 'table')[0];
  const after = band.blocks.flatMap((block) =>
    block.type === 'paragraph' ? [block.runs] : [],
  );
  const rows = table
    ? [table.header, ...table.rows].map((row) => ({
        header: plain(row[0] ?? []),
        cellsHtml: [inlineToHtml(row[1] ?? [])],
      }))
    : [];
  return (
    <ContentSection {...head(band)} data-band="E">
      {table ? (
        <DataTable
          head={false}
          labelledBy={headingIdOf(band)}
          keyColumn={{ heading: '' }}
          columns={[{ heading: '' }]}
          rows={rows}
        />
      ) : null}
      {after.length > 0 ? (
        <ContentSectionText>
          {after.map((runs, index) => (
            <p key={index}>{renderInline(runs)}</p>
          ))}
        </ContentSectionText>
      ) : null}
    </ContentSection>
  );
}

/* ── Impact ───────────────────────────────────────────────────────────────────── */

/**
 * M17 — a table whose rows are peers (impact dimensions): cards under a centred head, the two header
 * words once above the set as a legend. A visual peak after the reading column.
 */
function ImpactBand({ band }: { band: CorpusBand }) {
  const table = blocksOf(band, 'table')[0];
  if (!table) return null;
  const [from, to] = table.header;
  const items: BlockCardSetItem[] = table.rows.map((row) => ({
    id: plain(row[0] ?? []),
    title: plain(row[0] ?? []),
    ...bodyOf(row[1] ?? []),
  }));
  return (
    <ContentSection {...head(band)} data-band="C-text" align="center">
      <Layout rowGap="block">
        <TableLegend from={plain(from ?? [])} to={plain(to ?? [])} />
        <BlockCardSet items={items} lead="none" across={3} frame="none" scroll="never" />
      </Layout>
    </ContentSection>
  );
}

/* ── Related ──────────────────────────────────────────────────────────────────── */

/** "Read the Gold Image Printing case" → "Gold Image Printing": the name a cover is filed under. */
const caseNameOf = (linkText: string) =>
  /^Read (?:the )?(.+?) case\.?$/.exec(linkText)?.[1] ?? linkText;

/**
 * M8 — cases to read next, as cards: each case page's own title and cover (a pre-existing image the
 * corpus already points at, else the register's placeholder), linked with the authored link text. The
 * band's lead is its one paragraph; its last lone link, to a service, is the foot (M9).
 */
function RelatedBand({
  page,
  band,
  caseRefs,
}: {
  page: CorpusPage;
  band: CorpusBand;
  caseRefs: LongformPageProps['caseRefs'];
}) {
  const links = blocksOf(band, 'links').flatMap((block) => block.links);
  const caseLinks = links.filter((link) => link.href.startsWith('/case-studies/'));
  const foot = links.find((link) => !link.href.startsWith('/case-studies/'));
  const lead = band.blocks.find((block) => block.type === 'paragraph');
  const leadRuns = lead?.type === 'paragraph' ? lead.runs : [];

  const items: BlockCardSetItem[] = caseLinks.map((link) => {
    const ref = caseRefs[link.href];
    return {
      id: link.href,
      title: ref?.title ?? caseNameOf(link.labelText),
      media: { type: 'image', image: coverFor(page, caseNameOf(link.labelText), ref) },
      href: link.href,
      ctaLabel: link.labelText,
    };
  });

  return (
    <ContentSection
      {...head(band)}
      data-band="M"
      lead={leadRuns.length > 0 && !hasLink(leadRuns) ? plain(leadRuns) : undefined}
      footer={
        foot ? (
          <CtaRow rule actions={[{ label: foot.labelText, href: foot.href }]} />
        ) : undefined
      }
    >
      <BlockCardSet items={items} lead="none" cue="cta" scroll="never" />
    </ContentSection>
  );
}
