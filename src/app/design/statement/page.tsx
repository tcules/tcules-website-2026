import type { ReactNode } from 'react';

import { Layout, Section, Sketch, type SectionSurface } from '@/components';
import { CtaRow, Statement } from '@/patterns';
import { ROUTES } from '@/lib/routes';

import { Box, specimenStyles as s } from '../_specimen/Specimen';

/**
 * Statement — the proving ground, laid out as a showcase: the flagship first, then each choice the
 * band offers, each under a two-column caption (index and title on the start, what to look for on
 * the end).
 *
 * Coverage: the sentence in one uniform ink (the italic turn was retired, owner, 9 Oct 2026); both
 * elements; both alignments (the split form was retired 7 Oct 2026); both textures; an action; the
 * graphic slot, start and centred; an absent eyebrow; the 14-word ceiling; three surfaces. One size,
 * the h1 role — `size="display"` was retired (owner, 7 Oct 2026: "way too big").
 */

const SENTENCE =
  'Most product problems are decisions nobody has made yet, showing up on a screen.';
const HOW_WE_WORK = [{ label: 'See how we work', href: ROUTES.howWeWork }] as const;

/* No blue band: blue is never a ground (owner ruling, § 4.3). The blue token block stays declared
   for self-containment, which tokens:check proves without a render. Paper is every band above. */
type ShownSurface = Exclude<SectionSurface, 'blue' | 'paper'>;
const SURFACES: readonly ShownSurface[] = ['tint', 'ink'];
const SURFACE_NOTE: Record<ShownSurface, string> = {
  tint: 'Tint — the sentence holds neutral-900, 13.05:1; the eyebrow lifts to 700.',
  ink: 'Ink — the sentence lifts to white (17.26:1), the eyebrow to neutral-400.',
};

/**
 * A caption band: the index and title on the start, what to look for beside it from 1024. The title
 * is the harness's mono label, never a title role, so no caption competes with the sentence it
 * introduces.
 */
function Caption({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Section>
      <Layout
        columns={{ base: 1, lg: [1, 2] }}
        colGap="column"
        rowGap="text"
        className={s.spec}
      >
        <h2 className={s.specTitle}>
          {index} · {title}
        </h2>
        <p className={s.specNote}>{children}</p>
      </Layout>
    </Section>
  );
}

export default function StatementSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>Statement</h1>
          <p className={s.specNote}>
            The J band: one sentence, said rather than titled. It sits at the h1 role on an{' '}
            <code>h2</code> (default) or a <code>p</code>, never an h1, in one column — the
            eyebrow directly above it, start-aligned or centred. What sets it apart from a
            section title is its voice: regular weight, one uniform ink. One optional{' '}
            <code>graphic</code> above the eyebrow, for the secondary brand shapes; one optional
            action; a texture on paper from 1024. ≤ 14 words, ≤ 3 lines.{' '}
            <code>size=&quot;display&quot;</code> is retired (owner, 7 Oct 2026).
          </p>
        </Layout>
      </Section>

      <Caption index="J · 1" title="As h2 and as p">
        One tone of full ink at the h1 role, regular weight; one link a stack under it. The h2
        names its band (a labelled section); the p band is a plain div, kept out of the outline.
      </Caption>
      <Statement
        eyebrow="What we believe"
        id="stmt-h2"
        actions={<CtaRow actions={HOW_WE_WORK} rule={false} />}
      >
        {SENTENCE}
      </Statement>
      <Statement eyebrow="In short" as="p">
        A small senior team, working in the open, from the first week to release.
      </Statement>

      <Caption index="J · 2" title="Centred, with the corner field">
        <code>align=&quot;center&quot;</code> and <code>texture=&quot;corner&quot;</code>: one
        column on the band&rsquo;s axis — the service page&rsquo;s J where neither neighbour is
        centred. The corner field sits in the top-end corner from 1024, clear of the eyebrow.
      </Caption>
      <Statement
        eyebrow="How we work"
        id="stmt-centre"
        align="center"
        texture="corner"
        actions={<CtaRow actions={HOW_WE_WORK} rule={false} />}
      >
        One accountable team, from the first question to the shipped build.
      </Statement>

      <Caption index="J · 3" title="The head-half field">
        <code>texture=&quot;head-half&quot;</code>: the band&rsquo;s one blue mass arrives from
        its top-end edge, from 1024. The sentence stays ink.
      </Caption>
      <Statement eyebrow="How we work" id="stmt-texture" texture="head-half">
        We design the decision first. The screen follows from it.
      </Statement>

      <Caption index="J · 3b" title="The end-edge horizontal fade">
        <code>texture=&quot;end-fade&quot;</code>: the same field run the band&rsquo;s full
        height down its end edge, fading right to left rather than in from the corner.
        Start-aligned only, from 1024.
      </Caption>
      <Statement
        eyebrow="What we believe"
        id="stmt-end-fade"
        texture="end-fade"
        actions={<CtaRow actions={HOW_WE_WORK} rule={false} />}
      >
        A good interface is a product decision someone finally made.
      </Statement>

      <Caption index="J · 2b" title="Centred, with the balanced corner pair">
        <code>texture=&quot;corner-pair&quot;</code>: the top-end corner field plus a lighter,
        related cluster in the bottom-start corner, so a centred band reads balanced. From 1024.
      </Caption>
      <Statement
        eyebrow="How we work"
        id="stmt-corner-pair"
        align="center"
        texture="corner-pair"
        actions={<CtaRow actions={HOW_WE_WORK} rule={false} />}
      >
        One accountable team, from the first question to the shipped build.
      </Statement>

      <Caption index="J · 4" title="The graphic slot">
        <code>graphic</code>: a square a block (24) above the eyebrow, sized by{' '}
        <code>--stmt-graphic-size</code> (64) — a mark beside the type, never an image competing
        with it. Statement sizes the slot; the page supplies the shape, so the secondary brand
        shapes can be tried without touching the band. Rendered aria-hidden. The tinted square
        stands in for a shape; start, then centred.
      </Caption>
      <Statement eyebrow="Our view" id="stmt-graphic" graphic={<Box accent />}>
        A product slows down where nobody owns the decision its interface is asking for.
      </Statement>
      <Statement
        eyebrow="Why we started"
        id="stmt-graphic-centre"
        align="center"
        graphic={<Box accent />}
      >
        Good products kept dying in the handover, so we removed the handover.
      </Statement>

      <Caption index="J · 5" title="No eyebrow, and the ceiling">
        Without an eyebrow the sentence opens the band on its own; nothing holds its place. Then
        14 words, the § 1.5 ceiling, inside 3 lines — the measure (32ch) keeps the band&rsquo;s
        end open as air.
      </Caption>
      <Statement id="stmt-no-eyebrow">
        Good products are mostly decisions, made early, kept.
      </Statement>
      <Statement eyebrow="Our view" id="stmt-ceiling">
        A product slows down where nobody owns the decision its interface is asking for.
      </Statement>

      <Caption index="J · 5b" title="The figure beside the sentence">
        <code>figure</code>: the item&rsquo;s own flat drawing on its plate beside the sentence,
        a <code>section</code> (96) split from 1024, under the sentence below it (the
        glossary&rsquo;s term pages, 4 Nov 2026). The shortest and the longest sentence a term
        page lifts.
      </Caption>
      <Statement
        as="p"
        id="stmt-figure-short"
        figure={<Sketch name="glossary-ai-native-product-design" />}
      >
        The term describes how the practice works, whatever the product, including products with
        no AI in them.
      </Statement>
      <Statement as="p" id="stmt-figure-long" figure={<Sketch name="design-systems" />}>
        Teams most often need the term when they must work out what is shared and what stays
        local to one product.
      </Statement>

      <Caption index="J · 6" title="Surfaces">
        Identical markup on tint and ink; each surface declares its sentence and eyebrow ink.
        Texture is paper only and is ignored elsewhere.
      </Caption>
      {SURFACES.map((surface) => (
        <Layout key={surface} rowGap="none">
          <Section surface={surface}>
            <p className={s.specTitle}>{SURFACE_NOTE[surface]}</p>
          </Section>
          <Statement surface={surface} eyebrow="What we believe" id={`stmt-${surface}`}>
            {SENTENCE}
          </Statement>
        </Layout>
      ))}

      <Caption index="J · 7" title="The island">
        <code>island</code>: the statement on a floating box of its own ground (Island), the
        band&rsquo;s ground around it on every side. The value is the island&rsquo;s surface;
        without <code>surface</code> the band takes the other light ground. The texture moves
        inside the island and is cut at its radius, so it needs the paper island (texture is
        paper only). Start on a tint island; centred on a paper island with the corner pair;
        start on a paper island with the end-edge fade; and the surface proof on ink.
      </Caption>
      <Statement
        island="tint"
        eyebrow="What we believe"
        id="stmt-island"
        actions={<CtaRow actions={HOW_WE_WORK} rule={false} />}
      >
        {SENTENCE}
      </Statement>
      <Statement
        island="paper"
        align="center"
        texture="corner-pair"
        eyebrow="How we work"
        id="stmt-island-centre"
        actions={<CtaRow actions={HOW_WE_WORK} rule={false} />}
      >
        One accountable team, from the first question to the shipped build.
      </Statement>
      <Statement island="paper" texture="end-fade" eyebrow="Our view" id="stmt-island-fade">
        A good interface is a product decision someone finally made.
      </Statement>
      <Statement island="tint" surface="ink" eyebrow="Surface proof" id="stmt-island-ink">
        {SENTENCE}
      </Statement>
    </>
  );
}
