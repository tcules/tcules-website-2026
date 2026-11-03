import { Layout, Section } from '@/components';
import { Callout, CtaRow, EngagementOptions, type EngagementOption } from '@/patterns';

import { Variation } from '../_specimen/Variation';
import t from '../_specimen/typeroles.module.css';

/**
 * /design/engagement-options — ways to work with us, comparable at a glance (product-design round 6,
 * 11 Oct 2026; page-mapping § 23). Every arrangement: How we work together as every offer page and
 * home set it (owner, 29 Oct 2026), the four scopes with a note, three options, an option with no
 * drawing, and the paper and tint grounds. Sample words.
 */

const TOGETHER: EngagementOption[] = [
  {
    title: 'A pilot project.',
    body: 'Optional: one flow, one hard question or an audit, at a fixed price agreed up front.',
    scope: 'pilot',
  },
  {
    title: 'A defined project.',
    body: 'A first release, a redesign or a design system, with the scope and the price agreed before we begin.',
    scope: 'area',
  },
  {
    title: 'An ongoing partnership.',
    body: 'A senior designer joins your team, with specialists as the work needs them.',
    scope: 'embedded',
  },
];

/* Three options with an eyebrow and keyed facts (/how-we-work, 1 Nov 2026). Sample words. */
const FACTS: EngagementOption[] = [
  {
    eyebrow: 'A focused engagement',
    title: 'Start with one meaningful challenge',
    body: 'One workflow, one interface or one prototype, investigated, redesigned or tested.',
    scope: 'feature',
    facts: [
      { label: 'How it works', body: 'An agreed scope, deliverable and fixed price.' },
      {
        label: 'Typical starting points',
        items: [
          <a key="a" href="#facts">
            UX or product audit
          </a>,
          'one workflow',
          'design pilot',
        ],
      },
    ],
  },
  {
    eyebrow: 'A defined project',
    title: 'Take a product initiative forward',
    body: 'A first release, a redesign or a design system, with the scope agreed first.',
    scope: 'area',
    facts: [
      {
        label: 'How it works',
        body: 'Scope, roles, milestones and fees agreed before work starts.',
      },
      { label: 'Typical starting points', items: ['MVP', 'major workflow redesign'] },
    ],
  },
  {
    eyebrow: 'An ongoing partnership',
    title: 'Keep design close as your product grows',
    body: 'A senior designer in your team, specialists as the roadmap calls for them.',
    scope: 'embedded',
    facts: [
      { label: 'How it works', body: 'A fixed monthly fee for an agreed team.' },
      { label: 'Best when', body: 'Design is a continuing responsibility.' },
    ],
  },
];

const FOUR: EngagementOption[] = [
  {
    title: 'One workflow or feature.',
    body: 'One problem, solved properly.',
    scope: 'feature',
  },
  {
    title: 'A product area or a new product.',
    body: 'From research to designs ready to build.',
    scope: 'area',
  },
  {
    title: 'A designer in your team.',
    body: 'One of our designers in your tools and meetings, specialists joining when needed.',
    scope: 'embedded',
  },
  {
    title: 'Design and build.',
    body: 'We design it, then our engineers build it.',
    scope: 'build',
  },
];

const NOTE = (
  <Callout html="<p>We are at our best when there is real thinking to do. If every screen is already specified, a production team will suit you better.</p>" />
);

export default function EngagementOptionsSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <p className={t.eyebrow}>Pattern · tier 2</p>
          <h1>EngagementOptions</h1>
          <p className={t.lead}>
            Peers a reader chooses between, so each carries a scope drawing on the same dot
            field — one line, a region, one blue node among yours, a drawn region becoming a
            built one — in the EngagementModel chart&rsquo;s language. The drawings make the
            four comparable before a word is read. No icons, no discs, no boxes; none is
            featured.
          </p>
        </Layout>
      </Section>

      <Variation
        id="together"
        title="0 · How we work together — the offer pages and home (owner, 29 Oct 2026)"
        note="Three options on three tracks from 768, each its flat scope drawing on its plate. The two closing terms hold for every option, so they are one plain text row at body size a column under the set: from 1024 on the options' grid (tracks 1 and 2, track 3 empty), stacked below; no plates, drawings, rail or nodes (owner, 30 Oct 2026, engagement-terms-plain-row). The ask is the next band, an ink island."
      />
      <EngagementOptions
        heading="How we work together"
        headingId="eop-together"
        lead={[
          'When you are not sure which service fits, a good first piece of work is one workflow, one feature or a focused audit, run as a small pilot project.',
          'Bring what you have: an idea, a prototype or a product with years behind it. Shaping the brief is part of the work, and our first conversation is about your product.',
        ]}
        options={TOGETHER}
        terms={[
          {
            body: 'We can stop at designs your engineers build, take the hardest parts into code, or build the product with you. You keep the product calls, and once the work is paid for, what we make is yours.',
          },
          {
            body: 'Our studio is in Ahmedabad, India, and most of our clients work in other countries. We agree the hours we share before each project starts, and you work directly with the people doing the work.',
          },
        ]}
        action={
          <CtaRow
            rule={false}
            actions={[{ label: 'How we work together', href: '#together' }]}
          />
        }
      />

      <Variation
        id="together-tint"
        title="0b · Shared terms on tint"
        note="The same on tint, proving the term ink per surface."
      />
      <EngagementOptions
        surface="tint"
        heading="How we work together"
        headingId="eop-together-tint"
        lead={[
          'When you are not sure which service fits, a good first piece of work is one workflow, one feature or a focused audit, run as a small pilot project.',
          'Bring what you have: an idea, a prototype or a product with years behind it. Shaping the brief is part of the work, and our first conversation is about your product.',
        ]}
        options={TOGETHER}
        terms={[
          {
            body: 'We can stop at designs your engineers build, take the hardest parts into code, or build the product with you. You keep the product calls, and once the work is paid for, what we make is yours.',
          },
          {
            body: 'Our studio is in Ahmedabad, India, and most of our clients work in other countries. We agree the hours we share before each project starts, and you work directly with the people doing the work.',
          },
        ]}
        action={
          <CtaRow
            rule={false}
            actions={[{ label: 'How we work together', href: '#together' }]}
          />
        }
      />

      <Variation
        id="four"
        title="1 · Four scopes and a note — image cards, two by two (product design)"
        note="Each drawing on its plate at 16:9 is the card's image, then the name and what it is; two across from 768, one below; 32 across and a column down. The note (the caller's Callout) a stack under the set."
      />
      <EngagementOptions
        heading="Ways to work with us"
        headingId="eop-four"
        options={FOUR}
        note={NOTE}
        terms={[
          {
            body: 'We can stop at designs your engineers build, take the hardest parts into code, or build the product with you.',
          },
          {
            body: 'Our studio is in Ahmedabad, India. We agree the hours we share before each project starts.',
          },
        ]}
      />

      <Variation
        id="rows"
        title="1b · Alternating rows — explored"
        note="One row per option from 768, the 16:9 drawing in 5 of [5, 7] beside its words, swapping sides row by row; rows a column apart. Roomier, but four rows run to about two folds (1,551 at 1440). Below 768 each drawing heads its words at full width."
      />
      <EngagementOptions
        heading="Ways to work with us"
        headingId="eop-rows"
        options={FOUR}
        note={NOTE}
        arrangement="rows"
      />

      <Variation
        id="compare"
        title="1c · Compare, with eyebrows and facts"
        note="The options three across from 1024, then each fact as one ruled row: its key over the three values aligned under their option, a list value one entry a line. Mixed keys on a row join with a slash. Below 1024 it is the rows arrangement (1d). /how-we-work's three ways."
      />
      <EngagementOptions
        heading="Three ways to work together"
        headingId="eop-compare"
        options={FACTS}
        arrangement="compare"
      />

      <Variation
        id="facts"
        title="1d · Rows with eyebrows and facts"
        note="Each option's facts as a spec sheet under one rule: the mono key in 1 of [1, 2], the value beside it, keys aligned down the option; a list value runs as one line parted by middle dots."
      />
      <EngagementOptions
        heading="Three ways to work together"
        headingId="eop-facts"
        options={FACTS}
        arrangement="rows"
      />

      <Variation
        id="three-blank"
        title="2 · Three options, one with no drawing"
        note="Three take three tracks from 768, so no track is left open. An option whose name fits no scope shows its words alone rather than a wrong picture."
      />
      <EngagementOptions
        heading="Ways to work with us"
        headingId="eop-three"
        lead="Start where it fits; most engagements grow from the first."
        options={[
          FOUR[0] as EngagementOption,
          FOUR[1] as EngagementOption,
          {
            title: 'A review of what you have.',
            body: 'A fixed-scope look before anything is designed.',
          },
        ]}
      />

      <Variation
        id="tint"
        title="3 · Tint ground"
        note="Every --eop-* token restated on tint: the dot field steps to neutral-400, open nodes take paper-deep."
      />
      <EngagementOptions
        heading="Ways to work with us"
        headingId="eop-tint"
        options={FOUR}
        note={NOTE}
        surface="tint"
      />
    </>
  );
}
