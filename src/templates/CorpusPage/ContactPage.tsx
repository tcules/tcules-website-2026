import { Icon, Layout, type IconName } from '@/components';
import type { CorpusBand, CorpusBlock, CorpusPage } from '@/lib/corpus-types';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import {
  BlockCardSet,
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
import { BANDS_ELSEWHERE } from './kinds';
import { LinksIsland, type IslandLink } from './LinksIsland';
import { planOffer, type TEMPLATE_BANDS } from './plan';
import { boldLead, hasLink, labelTitle, leadOf, plain, sentenceLead, trimStart } from './text';

/** What a way to reach the studio is, which decides its glyph. */
export type ContactChannelKind = 'email' | 'partners' | 'careers' | 'studio';

/**
 * One way to reach the studio other than the form (tracker 2.56): its title and its one action, a
 * mailbox or a page, whose label is the destination as the reader will use it ("hello@tcules.com",
 * "Careers"). The page passes them in from the content seam.
 */
export type ContactChannel = {
  kind: ContactChannelKind;
  title: string;
  /** One line under the title, where the route needs it (the studio's street address). */
  body?: string;
  href: string;
  action: string;
};

/** The studio's profiles and address, for the contact page's "Follow us on" island. */
export type ContactFollow = {
  heading: string;
  links: readonly IslandLink[];
  address?: string;
};

export type ContactPageProps = Omit<OfferContext, 'page'> & {
  page: CorpusPage;
  /** The other ways to reach the studio, as a row of tiles after the form. Absent, no band. */
  channels?: readonly ContactChannel[];
  /** The profiles and the studio address, as a short links island after the tiles. */
  follow?: ContactFollow;
};

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

/* One Solar glyph per kind of channel, heading its tile (an icon heads its card). */
const CHANNEL_GLYPHS = {
  email: 'letter',
  partners: 'hand-shake',
  careers: 'users-group-rounded',
  studio: 'map-point',
} as const satisfies Record<ContactChannelKind, IconName>;

/**
 * The other ways to reach the studio (tracker 2.56; owner's Contact A, 3 Nov 2026): one filled tile
 * per route, glyph then title then its one action as a labelled outline, the mailbox or the page
 * itself as the label. The tile does not answer the pointer; the action does. Under the head "Other
 * ways to reach us" (owner, 3 Nov 2026).
 */
function Channels({ channels }: { channels: readonly ContactChannel[] }) {
  return (
    <ContentSection
      id="channels"
      data-band="C-channels"
      heading="Other ways to reach us"
      headingId="channels-heading"
    >
      <BlockCardSet
        lead="none"
        across={channels.length >= 4 ? 4 : 3}
        frame="tile"
        linkScope="cta"
        ctaEmphasis="outline"
        items={channels.map((channel) => ({
          id: channel.kind,
          title: channel.title,
          icon: CHANNEL_GLYPHS[channel.kind],
          body: channel.body,
          href: channel.href,
          ctaLabel: channel.action,
        }))}
      />
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
 * island straight under it (owner, 31 Oct 2026), then the other ways to reach the studio as a row of
 * icon cards (tracker 2.56), then the questions. Next steps is not a band: its steps are the form's
 * sent state and its record line the hero's figures (BANDS_ELSEWHERE). The brief, next-steps and
 * confidentiality views stay for copy that still authors those bands. Every other band renders as
 * the plan names it.
 */
export function ContactPage({ page, channels = [], follow, ...rest }: ContactPageProps) {
  /* A band the owner moved into another element's state (BANDS_ELSEWHERE) is read for its words
     but not drawn as a band: next steps lives in the form's sent state (tracker 2.56). */
  const elsewhere = BANDS_ELSEWHERE[page.route] ?? {};
  const units = planOffer({ ...page, bands: page.bands.filter((b) => !(b.id in elsewhere)) });
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
      {channels.length > 0 ? <Channels channels={channels} /> : null}
      {follow ? (
        <LinksIsland
          id="follow"
          band="C-links"
          heading={follow.heading}
          links={follow.links}
          footnote={follow.address}
        />
      ) : null}
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
