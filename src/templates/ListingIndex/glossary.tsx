import { Layout, Prose } from '@/components';
import type { CorpusBand, CorpusPage } from '@/lib/corpus-types';
import { inlineToHtml, inlineToText, paragraphHtml, type InlineRun } from '@/lib/inline';
import { glossarySceneFor } from '@/lib/sketches';
import { BlockCard } from '@/patterns';

import { ListingGrid } from './compositions';
import type {
  ListingClosing,
  ListingHero,
  ListingLead,
  ListingSection,
} from './ListingIndex';

/* ── The glossary hub as a listing ───────────────────────────────────────────────────
   The glossary is the listing family's term index (cms-templates: glossary_hub beside knowledge_hub
   and tool_hub; decisions/2026-10-22-listings-share-one-structure), so it takes ListingIndex: the
   title across the column, the lede beside it and the texture field, then the rail beside the term
   groups. What this file adds is the answer to "what goes in a section" for terms: each term a drawn
   card, its own scene on the plate (`glossarySceneFor`), the term as the title and its one-line
   definition as the body, each group opening on its lead as the insights hub's groups do. Every word
   is the copy's. */

type Link = Extract<InlineRun, { type: 'link' }>;

/** One term of a group: the link that names it and the definition after the colon. */
type Term = { link: Link; body: InlineRun[] };

const capitalised = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** `[Term](/glossary/x): definition` — the term and its definition, or null for any other line. */
function termOf(runs: readonly InlineRun[]): Term | null {
  const [first, second, ...rest] = runs;
  if (first?.type !== 'link' || !first.href.startsWith('/glossary/')) return null;
  if (second?.type !== 'text' || !second.text.startsWith(':')) return null;
  const tail = second.text.replace(/^:\s*/, '');
  return { link: first, body: tail ? [{ type: 'text', text: tail }, ...rest] : rest };
}

/**
 * A definition whose later sentence carries links (prototype hardening: "…before customers arrive.
 * If a prototype exists, the [Prototype Readiness Review](…) …"): the sentences before it are the
 * card's body, and the rest is the group's note under its cards, links kept. A card is one link, so
 * a link inside its body would nest. Null rest when the definition has no link.
 */
function splitAtLink(body: readonly InlineRun[]): { card: string; rest: InlineRun[] | null } {
  const at = body.findIndex((run) => run.type !== 'text');
  if (at < 0) return { card: inlineToText(body).trim(), rest: null };
  const before = body.slice(0, at).map((run) => (run.type === 'text' ? run.text : '')).join('');
  const stop = before.lastIndexOf('. ');
  if (stop < 0) return { card: inlineToText(body).trim(), rest: null };
  return {
    card: before.slice(0, stop + 1).trim(),
    rest: [{ type: 'text', text: before.slice(stop + 2) }, ...body.slice(at)],
  };
}

/** A line made of words and then one link at its end (`Want to talk …? [Talk to us](/contact).`). */
function askOf(runs: readonly InlineRun[]): { heading: string; link: Link } | null {
  const linkAt = runs.findIndex((run) => run.type === 'link');
  const link = runs[linkAt];
  if (linkAt < 1 || link?.type !== 'link') return null;
  const after = inlineToText(runs.slice(linkAt + 1)).trim();
  if (after && after !== '.') return null;
  if (runs.slice(0, linkAt).some((run) => run.type !== 'text')) return null;
  return { heading: inlineToText(runs.slice(0, linkAt)).trim(), link };
}

const paragraphsOf = (band: CorpusBand) =>
  band.blocks.flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));

const isGroup = (band: CorpusBand) => paragraphsOf(band).some((runs) => termOf(runs));

/** The rail's row for a group: the label before an authored colon ("Design system glossary"). */
const railLabelOf = (heading: string) => {
  const at = heading.indexOf(':');
  return at > 0 ? heading.slice(0, at).trim() : undefined;
};

/** The lead's action, in the verb a term takes (the insights lead's `ACTION`, for a definition). */
const TERM_ACTION = 'Read the definition';

type TermEntry = { term: Term; card: string };

/** One term as the site's card: its own scene on the plate, the term as the title, the definition as
    the body. The SAME card at every placement (a term page's related terms set it at this step too). */
function TermCard({
  entry: { term, card },
  orientation = 'vertical',
  imageSide,
}: {
  entry: TermEntry;
  orientation?: 'vertical' | 'horizontal';
  imageSide?: 'left' | 'right';
}) {
  const scene = glossarySceneFor(term.link.href);
  const shared = {
    title: inlineToText(term.link.children),
    body: capitalised(card),
    href: term.link.href,
    titleAs: 'h3' as const,
    ...(scene ? { media: { type: 'sketch' as const, name: scene } } : {}),
  };
  /* No `compact`: that is the insights card's phone row, which drops the standfirst. A term card's
     definition IS its content, so on a phone it stacks as plate, title, definition. */
  return orientation === 'horizontal' ? (
    <BlockCard
      {...shared}
      orientation="horizontal"
      imageSide={imageSide}
      size="lg"
      tracks={2}
      cue="cta"
      ctaLabel={TERM_ACTION}
      split="grid"
    />
  ) : (
    <BlockCard {...shared} size="sm" tracks={3} cue="title" />
  );
}

/**
 * One group, in the listing's own group shape (decisions/2026-10-22-listings-share-one-structure;
 * the insights hub's Feature): its first term as the horizontal lead, the drawing across two thirds
 * and the definition in the third, then the rest as cards in rows of three. A group never ends on a
 * lone card under a row: where one term would be left over (a group of two, or of five), it closes
 * the group as a second horizontal card with its drawing on the other side, so the group opens and
 * closes on the same wide shape and every row in between is full (or two of three tracks, as the
 * insights grid sets a pair).
 */
function TermGroup({ terms }: { terms: readonly TermEntry[] }) {
  const [lead, ...rest] = terms;
  const tail = rest.length % 3 === 1 ? rest[rest.length - 1] : undefined;
  const grid = tail ? rest.slice(0, -1) : rest;
  return (
    <Layout rowGap="column">
      {lead ? (
        <ul>
          <TermCard entry={lead} orientation="horizontal" />
        </ul>
      ) : null}
      {grid.length > 0 ? (
        <ListingGrid>
          {grid.map((entry) => (
            <TermCard key={entry.term.link.href} entry={entry} />
          ))}
        </ListingGrid>
      ) : null}
      {tail ? (
        <ul>
          <TermCard entry={tail} orientation="horizontal" imageSide="right" />
        </ul>
      ) : null}
    </Layout>
  );
}

export type GlossaryIndex = {
  hero: ListingHero;
  lead?: ListingLead;
  sections: ListingSection[];
  closing?: ListingClosing;
  /** The bands after the index, in the copy's order (the FAQ), for the route to render. */
  after: CorpusBand[];
};

/**
 * The glossary hub's copy as a listing: the opening band with no terms is the lead; every band of
 * `[Term](…): definition` lines is a section of drawn cards; a group's closing ask ("Want to talk
 * through one of these …? Talk to us.") leaves the band by role, onto the listing's close
 * (decisions/2026-11-03-band-links-placed-by-role), anchored `<band>-onward` as every lifted onward
 * line is; the bands after the last group go back to the route in order.
 */
export function glossaryIndex(page: CorpusPage): GlossaryIndex {
  const firstGroup = page.bands.findIndex(isGroup);
  const lastGroup = page.bands.reduce((at, band, index) => (isGroup(band) ? index : at), -1);
  const leadBand = firstGroup > 0 ? page.bands[0] : undefined;
  const groups = firstGroup >= 0 ? page.bands.slice(firstGroup, lastGroup + 1) : [];
  let closing: ListingClosing | undefined;

  const sections: ListingSection[] = groups.map((band) => {
    const terms: TermEntry[] = [];
    const notes: InlineRun[][] = [];
    for (const runs of paragraphsOf(band)) {
      const term = termOf(runs);
      if (term) {
        const { card, rest } = splitAtLink(term.body);
        terms.push({ term, card });
        if (rest) notes.push(rest);
        continue;
      }
      const ask = askOf(runs);
      if (ask && !closing) {
        closing = {
          id: `${band.id}-onward`,
          heading: ask.heading,
          action: { label: inlineToText(ask.link.children), href: ask.link.href },
        };
        continue;
      }
      notes.push(runs);
    }
    return {
      id: band.id,
      heading: band.headingText,
      railLabel: band.navLabel ?? railLabelOf(band.headingText),
      count: terms.length,
      band: 'listing-section',
      content: <TermGroup terms={terms} />,
      note:
        notes.length > 0 ? (
          <Prose html={notes.map((runs) => paragraphHtml(runs)).join('')} />
        ) : undefined,
    };
  });

  const lead: ListingLead | undefined = leadBand
    ? {
        id: leadBand.id,
        heading: leadBand.headingText,
        band: 'listing-lead',
        content: (
          <Prose
            html={paragraphsOf(leadBand)
              .map((runs) => `<p>${inlineToHtml(runs)}</p>`)
              .join('')}
          />
        ),
      }
    : undefined;

  return {
    hero: {
      title: page.hero.titleText,
      lede: page.hero.lede.map((runs) => inlineToText(runs)),
    },
    lead,
    sections,
    closing,
    after: page.bands.slice(lastGroup + 1),
  };
}
