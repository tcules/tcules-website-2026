import type { ReactNode } from 'react';

import { Cluster, Icon, Layout, Prose, Section, type SectionSurface } from '@/components';
import { ROUTES } from '@/lib/routes';
import { Callout, Proof } from '@/patterns';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';

const ONE_SENTENCE =
  '<p>This is a composite product scenario, not a delivered client artefact.</p>';
const TWO_SENTENCES =
  '<p>A small qualitative study can expose a serious problem. It cannot estimate how common the problem is.</p>';
const DIAGNOSTIC =
  '<p>These cases support the diagnostic principle. They are not presented as instances of this exact audit offer.</p>';
const LONG_NOTE =
  '<p>This illustrative synthesis combines recurring operational themes from several discovery conversations and is included to clarify the boundary of the preceding claim. It should not be read as a measured outcome, a client quotation, or evidence that every team encounters the same conditions.</p>';
const FOUR_SENTENCES =
  '<p>The examples are illustrative. They combine several recurring themes. They are not a client quotation. They do not estimate prevalence.</p>';
const LONG_TOKEN =
  '<p>https://tcules.com/case-studies/operational-battery-decision-support-evidence-note-appendix-with-a-single-unbroken-segment</p>';
const INLINE_RICH_TEXT = `<p>This is <em>illustrative</em>, not a <strong>measured outcome</strong>.</p><p>Read the <a href="${ROUTES.caseStudies}">case-study evidence</a> for attributed results.</p>`;
const TWO_LINKS = `<p>Compare the <a href="${ROUTES.services}">service scope</a> with the <a href="${ROUTES.caseStudies}">published evidence</a> before treating this synthesis as a result.</p>`;

const ROUTING_QUOTE = {
  quoteHtml: '<p>The team made the difficult parts visible early enough to act on them.</p>',
  name: 'Ashok Mohanty',
  role: 'Founder',
  company: 'Auxentios',
} as const;

const SURFACES: readonly { surface: SectionSurface; token: string; ratio: string }[] = [
  { surface: 'paper', token: '--color-neutral-600', ratio: '4.92:1' },
  { surface: 'tint', token: '--color-neutral-700', ratio: '7.27:1' },
  { surface: 'ink', token: '--color-neutral-400', ratio: '8.05:1' },
  { surface: 'blue', token: '--color-brandeis-100', ratio: '4.91:1' },
] as const;

const LABEL_SURFACES: readonly { surface: SectionSurface; label: string; content: string }[] = [
  { surface: 'paper', label: '--color-neutral-700 · 8.14:1', content: '--color-neutral-600' },
  { surface: 'tint', label: '--color-neutral-800 · 10.54:1', content: '--color-neutral-700' },
  { surface: 'ink', label: '--color-neutral-300 · 11.07:1', content: '--color-neutral-400' },
  { surface: 'blue', label: '--color-brandeis-50 · 5.57:1', content: '--color-brandeis-100' },
] as const;

function ResolvedTokens({
  rows,
}: {
  rows: readonly (readonly [token: string, value: string])[];
}) {
  return (
    <Layout as="dl" rowGap="tight">
      {rows.map(([token, value]) => (
        <Cluster as="div" key={token} colGap="inline" rowGap="inline" align="baseline">
          <dt>
            <code>{token}</code>
          </dt>
          <dd>
            <code>{value}</code>
          </dd>
        </Cluster>
      ))}
    </Layout>
  );
}

function ClaimWithChildCallout() {
  return (
    <Layout rowGap="block">
      <Prose html="<p>A qualitative study identifies where a workflow fails and why.</p>" />
      <Callout html={DIAGNOSTIC} />
    </Layout>
  );
}

function FutureNoteSlotHarness({ note }: { note: ReactNode }) {
  return (
    <Layout rowGap="block">
      <Prose html="<p>A qualitative study identifies where a workflow fails and why.</p>" />
      {note}
    </Layout>
  );
}

export default function CalloutSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>Callout</h1>
          <p>
            A quiet, unattributed scope note that qualifies the claim immediately before it. It
            renders trusted rich text through Prose, adds a note semantic, and deliberately owns
            no panel, rule, icon, heading, action, surface or outer spacing.
          </p>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>1 · Identity and the complete matrix</h2>
            <p>
              One treatment × one size. The note is body-small at body measure on every surface;
              one- and two-sentence content changes only the natural height of the flow.
            </p>
          </Layout>
          <Specimen
            title="Claim followed by its scope note"
            note="The parent Layout owns the 24px block seam. Callout itself contributes no margin."
          >
            <ClaimWithChildCallout />
          </Specimen>
          <Specimen title="One sentence" note="The minimum intended content shape.">
            <Callout html={ONE_SENTENCE} />
          </Specimen>
          <Specimen title="Two sentences" note="The common complete shape.">
            <Callout html={TWO_SENTENCES} />
          </Specimen>
          <Specimen
            title="icon · a glyph heads the note"
            note="For a note that stands as its own band (/contact confidentiality): glyph, then key, then sentence, each on its own row. The caller composes the Icon and its size."
          >
            <Layout rowGap="stack">
              <Callout html={TWO_SENTENCES} icon={<Icon name="shield-check" size="xl" />} />
              <Callout
                label="Scope"
                html={ONE_SENTENCE}
                icon={<Icon name="shield-check" size="xl" />}
              />
            </Layout>
          </Specimen>
          <Specimen
            title="tone=example · the worked example a set walks through"
            note="F's scene above the steps: body-lg in ink, a blue key, a blue rule down the start edge — a mark on one edge, not a box. The default tone stays the quiet note."
          >
            <Callout
              tone="example"
              label="Worked example"
              html="<p>A dispatch screen where three teams edit one order, and nobody trusts its status. We followed a single order through all of them.</p>"
            />
          </Specimen>
          <Specimen
            title="tone=summary · an article's TL;DR"
            note="The one tone with a ground (owner, 2 Nov 2026): the deep panel, the accent across its top, the mono key and the paragraph set large (--text-summary). The panel is as wide as its text, up to the lead measure; the short one shows it shrinking."
          >
            <Layout rowGap="stack">
              <Callout tone="summary" label="Insights" html={"<p>Heuristic evaluation, usability testing and a UX audit answer different questions. Match yours to the method, the time it takes and what you get. Pick the method by the question you need answered.</p>"} />
              <Callout
                tone="summary"
                label="Insights"
                html="<p>Pick the method by the question you need answered.</p>"
              />
              <Callout tone="summary" html={"<p>Heuristic evaluation, usability testing and a UX audit answer different questions. Match yours to the method, the time it takes and what you get. Pick the method by the question you need answered.</p>"} />
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2 · Semantic routing</h2>
            <p>
              Similar-looking source text has three destinations. An ordinary quotation remains
              in Prose, an unattributed boundary on a claim becomes Callout, and attributed
              client evidence becomes Proof. Callout never sniffs its HTML to choose among them.
            </p>
          </Layout>
          <Layout columns="fit" minTrack="md" colGap="gutter" rowGap="stack">
            <Specimen title="Ordinary rich-text quotation" note="Prose owns the blockquote.">
              <Prose html="<blockquote><p>A working assumption can still be useful when it is named as one.</p></blockquote>" />
            </Specimen>
            <Specimen title="Unattributed scope boundary" note="Callout owns role=note.">
              <Callout html={DIAGNOSTIC} />
            </Specimen>
            <Specimen
              title="Attributed evidence"
              note="Proof owns the quotation and attribution."
            >
              <Proof arrangement="compact" quote={ROUTING_QUOTE} />
            </Specimen>
          </Layout>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>3 · Trusted inline rich text</h2>
            <p>
              Emphasis, strong text and links are delegated to Prose. The content seam accepts
              one or two paragraphs with inline marks; headings, lists, blockquotes, figures and
              tables are rejected before this component is called.
            </p>
          </Layout>
          <Specimen
            title="Allowed inline schema"
            note="The link keeps Prose's visible underline and interaction treatment."
          >
            <Callout html={INLINE_RICH_TEXT} />
          </Specimen>
          <ResolvedTokens
            rows={[
              ['accepted', 'p + inline marks'],
              ['rejected', 'headings, lists, blockquote, figure, table'],
            ]}
          />
        </Layout>
      </Section>

      {SURFACES.map(({ surface, token, ratio }) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="stack">
            <Layout rowGap="block">
              <h2>4 · Surface: {surface}</h2>
              <p>
                Identical markup, resolving <code>--call-content-ink</code> to{' '}
                <code>{token}</code> at {ratio}.
              </p>
            </Layout>
            <Specimen
              title={`The same Callout on ${surface}`}
              note="No surface prop and no component-owned ground: the nearest data-surface is the only mechanism."
            >
              <Callout html={INLINE_RICH_TEXT} />
            </Specimen>
            <Specimen
              title={`tone=summary on ${surface}`}
              note="The summary panel restates its ground, rule, key and paragraph inks per surface."
            >
              <Callout tone="summary" label="Insights" html={"<p>Heuristic evaluation, usability testing and a UX audit answer different questions. Match yours to the method, the time it takes and what you get. Pick the method by the question you need answered.</p>"} />
            </Specimen>
          </Layout>
        </Section>
      ))}

      <Section surface="ink">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>5 · Nested surfaces</h2>
            <p>
              Each surface redeclares the Callout ink and Prose independently resolves its
              inline link palette. The inner band therefore cannot inherit a half-ink, half-tint
              result.
            </p>
          </Layout>
          <Section as="div" surface="tint">
            <Layout rowGap="block">
              <Callout html={INLINE_RICH_TEXT} />
              <ResolvedTokens
                rows={[
                  ['--call-content-ink', '--color-neutral-700'],
                  ['--prose-link-ink', '--color-brandeis-500'],
                  ['--prose-link-ink-hover', '--color-brandeis-600'],
                  ['--prose-link-rule', '--color-brandeis-300'],
                ]}
              />
            </Layout>
          </Section>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Section as="div" surface="ink">
            <Layout rowGap="block">
              <Callout html={TWO_SENTENCES} />
              <ResolvedTokens
                rows={[
                  ['--call-content-ink', '--color-neutral-400'],
                  ['--prose-link-ink', '--color-brandeis-300'],
                  ['--prose-link-ink-hover', '--color-brandeis-200'],
                  ['--prose-link-rule', '--color-brandeis-400'],
                ]}
              />
            </Layout>
          </Section>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>6 · States and placement equivalence</h2>
            <p>
              The root has no hover, pressed, selected, expanded or disabled state. Links inside
              trusted content retain Prose&rsquo;s rest, hover and focus behaviour. The same
              Callout is used whether a caller places it in child flow or supplies it through a
              future note slot; placement does not add a component variant.
            </p>
          </Layout>
          <Layout columns={2} colGap="gutter" rowGap="stack">
            <Specimen title="Child-flow placement">
              <ClaimWithChildCallout />
            </Specimen>
            <Specimen title="Future Note-slot harness">
              <FutureNoteSlotHarness note={<Callout html={DIAGNOSTIC} />} />
            </Specimen>
          </Layout>
          <Specimen
            title="Delegated Prose-link states"
            note="Point to the link, hold the pointer down, then Tab to it. Rest, hover, held-pointer and keyboard focus all remain the link's own Prose behavior; the Callout root has no state to force."
          >
            <Callout html={INLINE_RICH_TEXT} />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>7 · Content edges and repeated instances</h2>
            <p>
              Nothing is clamped or truncated. A whitespace-only field warns in development and
              renders no note root; many instances remain ordinary parent-owned flow.
            </p>
          </Layout>
          <Specimen title="Longest realistic note" note="Three natural lines are valid.">
            <Callout html={LONG_NOTE} />
          </Specimen>
          <Specimen title="One unbroken token" note="overflow-wrap:anywhere contains the URL.">
            <Callout html={LONG_TOKEN} />
          </Specimen>
          <Specimen
            title="Four sentences — visible content defect"
            note="The presentation layer does not silently truncate or rewrite content."
          >
            <Callout html={FOUR_SENTENCES} />
          </Specimen>
          <Specimen
            title="Whitespace-only HTML"
            note="Inspect this specimen: its rendering area contains no role=note root."
          >
            <div data-empty-callout-host>
              <Callout html="   " />
            </div>
          </Specimen>
          <Specimen
            title="Twenty instances in one parent"
            note="A normal 24px block rhythm, with no component-owned outer margin to accumulate."
          >
            <Layout rowGap="block">
              {Array.from({ length: 20 }, (_, index) => (
                <Callout
                  key={index}
                  html={`<p>Scope note ${index + 1}: this repeated instance qualifies only the claim immediately before it.</p>`}
                />
              ))}
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>8 · Narrow and unsized parents</h2>
            <p>
              The root asks for the available inline size, has zero minimum, and wraps content
              at 320, 256 and 192px. A wrapping Cluster can also size it without a Callout
              breakpoint.
            </p>
          </Layout>
          <Specimen title="320px track">
            <Layout className={s.trackMd}>
              <Callout html={TWO_SENTENCES} />
            </Layout>
          </Specimen>
          <Specimen title="256px track">
            <Layout className={s.trackSm}>
              <Callout html={TWO_SENTENCES} />
            </Layout>
          </Specimen>
          <Specimen title="192px track">
            <Layout className={s.trackXs}>
              <Callout html={TWO_SENTENCES} />
            </Layout>
          </Specimen>
          <Specimen
            title="Unsized wrapping Cluster parent"
            note="The Callouts are direct flex items with no track wrapper. Their full-available-width request makes each a stable wrapped line rather than an intrinsically collapsed note."
          >
            <Cluster colGap="block" rowGap="block" align="start">
              <Callout html={ONE_SENTENCE} />
              <Callout html={TWO_SENTENCES} />
            </Cluster>
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>9 · Parent-owned seams</h2>
            <p>
              Adjacent production content uses the block step. A zero-gap harness proves that no
              hidden margin, separator or panel survives when the parent removes that seam.
            </p>
          </Layout>
          <Specimen title="Production seam — block">
            <Layout rowGap="block">
              <Callout html={ONE_SENTENCE} />
              <Callout html={TWO_SENTENCES} />
            </Layout>
          </Specimen>
          <Specimen title="Stress seam — none">
            <Layout rowGap="none">
              <Callout html={ONE_SENTENCE} />
              <Callout html={TWO_SENTENCES} />
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      <Section surface="ink">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>10 · Semantics and focus order</h2>
            <p>
              Inspect one <code>role=&quot;note&quot;</code> wrapper, one Prose root, no
              generated id and no root tabindex. Keyboard focus moves directly through the two
              links in source order; the wrapper itself is not a stop.
            </p>
          </Layout>
          <Specimen title="Two delegated links">
            <Callout html={TWO_LINKS} />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>11 · Negative provisions and manual checks</h2>
            <p>
              The public contract rejects children, className, DOM attributes, surface, tone,
              severity, size, width, heading, mark, icon, attribution and actions. CSS contains
              no ground, border, rule, radius, shadow, z-layer, media query, motion or outer
              margin.
            </p>
          </Layout>
          <Specimen
            title="Review checklist"
            note="Point to and hold the pointer on a Prose link, then Tab through both links in the semantics specimen. Check 1023px and 767px widths, 200% zoom, and a 320px viewport for quiet hierarchy and zero page overflow. Enable reduced motion and expect no visual change because Callout has no transition or animation. With a screen reader, expect the note semantic and complete text."
          >
            <Callout html={DIAGNOSTIC} />
          </Specimen>
        </Layout>
      </Section>
      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>12 · The optional key</h2>
            <p>
              Added 29 Sep 2026 (tracker 2.17, owner&rsquo;s decision): a scope note was
              visually identical to a caption. An optional <code>label</code> leads the sentence
              as a mono key — authored in sentence case, uppercased in CSS only — in a
              baseline-aligned Cluster at <code>tight</code>. Beside the sentence while the line
              has room; above it when it does not. Without a label, nothing changes.
            </p>
          </Layout>
          <Layout columns={2} colGap="gutter" rowGap="stack">
            <Specimen title="Without label" note="Exactly the Callout of sections 1–11.">
              <Callout html={TWO_SENTENCES} />
            </Specimen>
            <Specimen
              title="With label"
              note={
                'label="Scope" — the string stays "Scope" in the DOM and the accessibility tree.'
              }
            >
              <Callout label="Scope" html={TWO_SENTENCES} />
            </Specimen>
          </Layout>
          <Specimen
            title="Claim followed by its keyed note"
            note="The same parent-owned 24px seam; the key adds no outer spacing."
          >
            <Layout rowGap="block">
              <Prose html="<p>A qualitative study identifies where a workflow fails and why.</p>" />
              <Callout label="Scope" html={DIAGNOSTIC} />
            </Layout>
          </Specimen>
          <Specimen
            title="Long label"
            note="While the line keeps 192px for the sentence beside the key, it stays beside — as here at 1440. When it cannot, the row wraps and the sentence drops beneath the key, 8 below it — as at 390 and in the phone column below."
          >
            <Callout
              label="Scope of the qualitative evidence and its sample"
              html={LONG_NOTE}
            />
          </Specimen>
          <Specimen title="Label with the longest note and inline rich text">
            <Layout rowGap="block">
              <Callout label="Note" html={LONG_NOTE} />
              <Callout label="Method" html={INLINE_RICH_TEXT} />
            </Layout>
          </Specimen>
          <Specimen
            title="Blank label"
            note={'label="  " is treated as absent — no Cluster, no empty key.'}
          >
            <Callout label="  " html={ONE_SENTENCE} />
          </Specimen>
          <Specimen title="326 — the phone column" note="Short key beside, long key above.">
            <Layout className={s.trackMobile} rowGap="block">
              <Callout label="Scope" html={TWO_SENTENCES} />
              <Callout label="Scope of the qualitative evidence" html={TWO_SENTENCES} />
            </Layout>
          </Specimen>
          <Specimen
            title="192px track"
            note="The key leads; the sentence wraps beneath at the floor."
          >
            <Layout className={s.trackXs}>
              <Callout label="Scope" html={TWO_SENTENCES} />
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      {LABEL_SURFACES.map(({ surface, label, content }) => (
        <Section key={`label-${surface}`} surface={surface}>
          <Layout rowGap="stack">
            <Layout rowGap="block">
              <h2>13 · The key on {surface}</h2>
              <p>
                <code>--call-label-ink</code> resolves to <code>{label}</code>, one rung
                stronger than the sentence&rsquo;s <code>{content}</code>.
              </p>
            </Layout>
            <Layout columns={2} colGap="gutter" rowGap="stack">
              <Specimen title={`With label on ${surface}`}>
                <Callout label="Scope" html={INLINE_RICH_TEXT} />
              </Specimen>
              <Specimen title={`Without label on ${surface}`}>
                <Callout html={INLINE_RICH_TEXT} />
              </Specimen>
            </Layout>
          </Layout>
        </Section>
      ))}
    </>
  );
}
