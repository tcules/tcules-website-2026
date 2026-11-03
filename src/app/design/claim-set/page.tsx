import { Layout, Media, Section } from '@/components';
import { ClaimSet, type ClaimSetItem } from '@/patterns';
import { placeholderIllustration } from '@/lib/placeholders';

import { Variation } from '../_specimen/Variation';
import t from '../_specimen/typeroles.module.css';

/**
 * /design/claim-set — a page's hard parts (owner, 31 Oct 2026; docs/page-build/hard-parts-brief.md).
 * Every arrangement: tabs with five claims, every one with an example; tabs where most claims have
 * none (the slide fills, its words in two columns); two claims, the floor; and the page layout,
 * ruled. Sample words at the corpus's lengths. The real test is the census review list's pages.
 */

const figure = (title: string) => (
  <Media image={{ ...placeholderIllustration(title), alt: '' }} sizes="200px" />
);
const words = (...paras: string[]) =>
  paras.map((p) => (
    <p key={p} className={t.body}>
      {p}
    </p>
  ));
const example = (client: string, text: string) => ({
  bodyHtml: text,
  link: { href: '#', label: `Read the ${client} case` },
});

const FIVE: ClaimSetItem[] = [
  {
    title: 'Several roles working on one record',
    figure: figure('Several roles working on one record'),
    words: words(
      'Sales, pricing and operations all change one quote, and nobody can tell what the others did. Work moves between roles in whatever order the deal demands, and approvals sit wherever authority changes hands.',
      'We give each role its own view and rights on the same record, so a sales manager and a pricing expert both trust they are reading the same quote.',
    ),
    example: example(
      'Auxentios',
      'auxentios, a new quoting product where one quotation passes through six specialist roles. Interviews with people in all six shaped one shared workflow.',
    ),
  },
  {
    title: 'Records that outlast any one workflow',
    figure: figure('Records that outlast any one workflow'),
    words: words(
      'Many products begin as a run of screens. The work underneath is a set of things that last: a client persists across jobs, a candidate sits on several shortlists.',
    ),
    example: example(
      'Scissors',
      'Scissors, where onboarding a client organisation could take weeks of manual work. In the redesign each organisation is a lasting record.',
    ),
  },
  {
    title: 'The exceptions your customers live in',
    figure: figure('The exceptions your customers live in'),
    words: words(
      'The happy path is rarely where people spend their day. We design the duplicates, the partial approvals and the undo first.',
    ),
    example: example(
      'Dealpath',
      'In Dealpath’s redesign, Add to pipeline looks for an existing deal before it creates a new one.',
    ),
  },
  {
    title: 'Enterprise SaaS UX design for admins and permissions',
    figure: figure('Enterprise SaaS UX design for admins and permissions'),
    words: words(
      'Larger customers arrive with their own admins and org charts. Permissions become a product of their own.',
    ),
    example: example(
      'Benchmark Gensuite',
      'Benchmark Gensuite, where one admin console now sets who sees what across forty sites.',
    ),
  },
  {
    title: 'Design for AI agents acting on SaaS records',
    figure: figure('Design for AI agents acting on SaaS records'),
    words: words(
      'An agent that edits a record needs the same trail a person leaves: what changed, why, and how to undo it.',
    ),
    example: example(
      'Doodle',
      'Doodle, where suggested times are proposals a person accepts, never changes made silently.',
    ),
  },
];

const MOSTLY_PLAIN: ClaimSetItem[] = FIVE.map((item, i) =>
  i === 0 ? item : { ...item, example: undefined },
);

export default function ClaimSetSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <p className={t.eyebrow}>Pattern · tier 2</p>
          <h1>ClaimSet</h1>
          <p className={t.lead}>
            A page&rsquo;s hard parts. Tabs: one claim at a time on a paper-deep stage, the
            claims along its top, the chosen claim&rsquo;s slide on paper below in two parts
            (its title and words; the example), with no drawing. The slide moves as one piece
            toward the chosen claim, and the panel&rsquo;s height follows it. With a mouse,
            resting on a tab for a moment chooses it (a quick sweep across the row changes
            nothing); click, tap and the arrow keys, Home and End work as before. Once, as a stage
            comes into view, the slide peeks: the first claim eases aside, the edge of the next one
            shows, and both come back; the tab row never moves, and reduced motion stills it.
            Autoplay has no
            control: it runs only where there is a mouse, the pointer or focus holds it, any
            deliberate act stops it, and it plays once. Below 1024 every claim is on the page.
            Page: every claim on the page, ruled, in three columns.
          </p>
        </Layout>
      </Section>

      <Variation
        id="tabs-five"
        title="1 · Tabs — five claims, each with an example"
        note="From 1024 the stage; below it, every claim stacked. Hover a tab to choose it."
      />
      <Section>
        <Layout rowGap="stack">
          <h2 id="cls-five-h">Where B2B workflow software gets hard</h2>
          <ClaimSet id="cls-five" labelledBy="cls-five-h" items={FIVE} />
        </Layout>
      </Section>

      <Variation
        id="tabs-plain"
        title="2 · Tabs — four of five without an example"
        note="A claim with no example fills the slide, its words in two columns from 1024. Scroll down to it to see the peek: the slide eases aside to show the next claim's edge, then comes back."
      />
      <Section>
        <Layout rowGap="stack">
          <h2 id="cls-plain-h">FinTech app design for approvals and statuses</h2>
          <ClaimSet id="cls-plain" labelledBy="cls-plain-h" items={MOSTLY_PLAIN} />
        </Layout>
      </Section>

      <Variation
        id="tabs-two"
        title="3 · Tabs — two claims, the floor"
        note="Two tabs share the stage's width."
      />
      <Section>
        <Layout rowGap="stack">
          <h2 id="cls-two-h">Where design systems get hard</h2>
          <ClaimSet id="cls-two" labelledBy="cls-two-h" items={FIVE.slice(0, 2)} />
        </Layout>
      </Section>

      <Variation
        id="page"
        title="4 · Page — every claim on the page, ruled"
        note="Drawing, words, example; a claim with no example ends at its words."
      />
      <Section>
        <Layout rowGap="stack">
          <h2 id="cls-page-h">Where B2B workflow software gets hard</h2>
          <ClaimSet id="cls-page" labelledBy="cls-page-h" items={MOSTLY_PLAIN} layout="page" />
        </Layout>
      </Section>
    </>
  );
}
