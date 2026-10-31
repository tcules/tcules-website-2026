import { Icon, Layout, type IconName } from '@/components';
import type { CorpusBand, CorpusBlock, CorpusPage } from '@/lib/corpus-types';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import {
  Callout,
  ContentSection,
  ContentSectionText,
  ReadDown,
  Steps,
  type HeroStat,
  type ReadDownRow,
  type Step,
} from '@/patterns';

import { CorpusHero, EnquiryBand, headingIdOf, head } from './blocks';
import { BandBody } from './CopyBands';
import { recordStats } from './HomePage';
import { UnitView, type OfferContext } from './OfferBands';
import { planOffer, type TEMPLATE_BANDS } from './plan';
import { boldLead, hasLink, labelTitle, leadOf, plain, sentenceLead, trimStart } from './text';

export type ContactPageProps = Omit<OfferContext, 'page'> & { page: CorpusPage };

type ContactBand = (typeof TEMPLATE_BANDS)['/contact'][number];

const content = (band: CorpusBand) => band.blocks.filter((block) => block.type !== 'comment');

/** A bold-only paragraph ("**Founded 2017 · More than 90 projects · …**"): the studio's record line. */
const recordLineOf = (block: CorpusBlock): InlineRun[] | null => {
  const lead = leadOf(block);
  return lead && lead.body.length === 0 && plain(lead.label).includes(' · ')
    ? [...lead.label]
    : null;
};

/** The record line the copy ends `next-steps` on, as the hero's figures (component-map Q10 default). */
function contactStats(page: CorpusPage, steps: CorpusBand | undefined): HeroStat[] {
  const line = steps ? content(steps).map(recordLineOf).find(Boolean) : null;
  if (!line) return [];
  return recordStats({ ...page, hero: { ...page.hero, proofLines: [line] } });
}

const rowBody = (runs: readonly InlineRun[]) =>
  hasLink(runs) || runs.some((run) => run.type !== 'text')
    ? { bodyHtml: [inlineToHtml(runs)] }
    : { body: plain(runs) };

/** A body that follows a "Label:" opens on a capital, as a sheet item's does (CopyBands `sheetItem`). */
function capitalised(runs: InlineRun[]): InlineRun[] {
  const [first, ...rest] = runs;
  return first?.type === 'text'
    ? [
        { type: 'text', text: first.text.charAt(0).toUpperCase() + first.text.slice(1) },
        ...rest,
      ]
    : runs;
}

/* What to put in a first message, each with the glyph of what it is about: the product, the
   situation (what is seen), the milestone ahead, the people. */
const BRIEF_GLYPHS = [
  'widget',
  'eye',
  'flag',
  'users-group-rounded',
] as const satisfies readonly IconName[];

/** What to include: the head above, the four parts of a first message as a two-column read-down
    under it, then the line that closes the band. */
function Brief({ band }: { band: CorpusBand }) {
  const blocks = content(band);
  const list = blocks.find(
    (block): block is Extract<CorpusBlock, { type: 'list' }> => block.type === 'list',
  );
  const rows: ReadDownRow[] = (list?.items ?? []).map((runs, index) => {
    const lead = boldLead(runs);
    const body = lead ? capitalised(trimStart(lead.body)) : [];
    return {
      title: lead ? labelTitle(lead.label) : plain(runs),
      ...(body.length > 0 ? rowBody(body) : {}),
      ...(BRIEF_GLYPHS[index] ? { icon: BRIEF_GLYPHS[index] } : {}),
    };
  });
  const rest = blocks.filter((block) => block !== list);
  return (
    <ContentSection {...head(band)} data-band="C-brief">
      <Layout rowGap="stack">
        {rows.length > 0 ? <ReadDown rows={rows} columns={2} /> : null}
        {rest.length > 0 ? <BandBody blocks={rest} labelledBy={headingIdOf(band)} /> : null}
      </Layout>
    </ContentSection>
  );
}

/** The numbered claims of `next-steps` as a title and its body, and the blocks that are not steps. */
function stepsOf(band: CorpusBand) {
  const blocks = content(band).filter((block) => !recordLineOf(block));
  const steps: { title: string; body: InlineRun[] }[] = [];
  const rest: CorpusBlock[] = [];
  for (const block of blocks) {
    const found = leadOf(block);
    const lead = found ? sentenceLead(found) : null;
    if (lead) {
      steps.push({
        title: labelTitle(lead.label).replace(/^\d+\.\s*/, ''),
        body: trimStart(lead.body),
      });
    } else rest.push(block);
  }
  return { steps, rest };
}

/** What happens next: the head beside the numbered claims as Steps (Steps numbers them, so the
    copy's "1." goes; the record line is the hero's figures). */
function NextSteps({ band }: { band: CorpusBand }) {
  const { steps: parsed, rest } = stepsOf(band);
  const steps: Step[] = parsed.map(({ title, body }) => ({
    title,
    ...(body.length > 0 ? rowBody(body) : {}),
  }));
  return (
    <ContentSection {...head(band)} data-band="C-steps" arrangement="beside">
      <Layout rowGap="stack">
        {steps.length > 0 ? <Steps steps={steps} /> : null}
        {rest.length > 0 ? <BandBody blocks={rest} labelledBy={headingIdOf(band)} /> : null}
      </Layout>
    </ContentSection>
  );
}

/**
 * Keep the first message high-level: a boundary on the form, under its own heading, the head in the
 * leading third and the note beside it, so the short band does not repeat the centred questions under
 * it or the wall above it.
 */
function Confidentiality({ band }: { band: CorpusBand }) {
  const html = content(band)
    .map((block) => (block.type === 'paragraph' ? `<p>${inlineToHtml(block.runs)}</p>` : ''))
    .join('');
  return (
    <ContentSection {...head(band)} data-band="C-note" arrangement="beside">
      <ContentSectionText>
        <Callout html={html} tone="band" icon={<Icon name="shield-check" size="xl" />} />
      </ContentSectionText>
    </ContentSection>
  );
}

/**
 * TIER 3 — the contact page from the `_pages/` copy (component-map § E /contact). The hero centred
 * with the studio's record as figures (the line `next-steps` ends on, Q10) and no media, the enquiry
 * island straight under it (owner, 31 Oct 2026), then the brief (head above its read-down) and the
 * next steps (head beside its steps) as two bands, the quotes on tint, the confidentiality note and
 * the questions. Every other band renders as the plan names it.
 */
export function ContactPage({ page, ...rest }: ContactPageProps) {
  const units = planOffer(page);
  const ctx: OfferContext = { page, ...rest };
  const next = page.bands.find((b) => b.id === ('next-steps' satisfies ContactBand));
  /* The form sits in the hero where an image would (owner, 31 Oct 2026): the enquiry island, as
     every close carries it, set inside the hero's band a stack under the figures. */
  const enquiry = page.bands.find((b) => b.id === page.conversion?.anchor);
  return (
    <>
      <CorpusHero
        page={page}
        arrangement="centred"
        stats={contactStats(page, next)}
        panel={
          enquiry ? (
            <EnquiryBand
              page={page}
              band={enquiry}
              island={{
                surface: 'blue',
                dress: 'card',
                arrangement: 'halves',
                inBand: true,
                /* After a send the panel shows the page's own three steps (owner, 31 Oct 2026). */
                nextSteps: next
                  ? stepsOf(next).steps.map(({ title, body }) => ({
                      label: title,
                      ...(body.length > 0 ? { detail: plain(body) } : {}),
                    }))
                  : undefined,
              }}
            />
          ) : undefined
        }
      />
      {units.map((unit) => {
        if (enquiry && unit.part !== 'b' && unit.band === enquiry) return null;
        if (unit.part === 'b') return <UnitView key={unit.id} unit={unit} ctx={ctx} />;
        switch (unit.band.id as ContactBand | string) {
          case 'brief':
            return <Brief key={unit.id} band={unit.band} />;
          case 'next-steps':
            return <NextSteps key={unit.id} band={unit.band} />;
          case 'confidentiality':
            return <Confidentiality key={unit.id} band={unit.band} />;
          default:
            return <UnitView key={unit.id} unit={unit} ctx={ctx} />;
        }
      })}
    </>
  );
}
