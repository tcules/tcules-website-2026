import { Input, Layout, Section } from '@/components';
import { ROUTES } from '@/lib/routes';

import { Specimen } from '../_specimen/Specimen';

function LabelledInput({
  label,
  invalid = false,
  disabled = false,
  appearance,
}: {
  label: string;
  invalid?: boolean;
  disabled?: boolean;
  appearance?: 'box' | 'line';
}) {
  return (
    <Layout as="label" rowGap="tight">
      <span>{label}</span>
      <Input
        invalid={invalid}
        disabled={disabled}
        appearance={appearance}
        placeholder="you@company.com"
      />
    </Layout>
  );
}

function LabelledTextarea({
  label,
  invalid = false,
  disabled = false,
  appearance,
}: {
  label: string;
  invalid?: boolean;
  disabled?: boolean;
  appearance?: 'box' | 'line';
}) {
  return (
    <Layout as="label" rowGap="tight">
      <span>{label}</span>
      <Input
        as="textarea"
        invalid={invalid}
        disabled={disabled}
        appearance={appearance}
        placeholder="A line about what you are building"
      />
    </Layout>
  );
}

export default function InputSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>Input</h1>
          <p>
            The native control shared by enquiry forms and the footer, in two appearances on
            every surface: the filled box the enquiry forms use, and the unboxed line (one rule
            under the value, blue and doubled on focus). Labels, flags, messages, and
            arrangement stay with the pattern that composes it.
          </p>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <h2>Native shapes and states</h2>
          {/* Four across from lg (cmp-form final round): two by two, the band was 948 at 1470 and
              ran past the fold. Each track is 286 at 1440 and 216 at 1024, and the control has no
              minimum width, so all four fit. */}
          <Layout columns={{ base: 1, md: 2, lg: 5 }} colGap="gutter" rowGap="stack">
            <Specimen
              title="Standard · input"
              note="Point, tab, type, and disable from markup."
            >
              <LabelledInput label="Email address" />
            </Specimen>
            <Specimen
              title="Standard · textarea"
              note="Four-line minimum; resize stays native."
            >
              <Layout as="label" rowGap="tight">
                <span>What are you working on?</span>
                <Input as="textarea" />
              </Layout>
            </Specimen>
            <Specimen
              title={'scale="lg" · input and textarea'}
              note="48 at every width, the value at the lead role (body below 768), a five-line textarea: a form that is its band's primary object (home round 3)."
            >
              <Layout rowGap="text">
                <Input scale="lg" aria-label="Email" placeholder="Email" type="email" />
                <Input
                  as="textarea"
                  scale="lg"
                  aria-label="What are you working on?"
                  placeholder="What are you working on?"
                />
              </Layout>
            </Specimen>
            <Specimen
              title={'as="select" · box and fill'}
              note="The enquiry form's intent picker (25 Nov 2026): the field's box, the browser's own arrow and option list."
            >
              <Layout rowGap="text">
                <Layout as="label" rowGap="tight">
                  <span>What would you like to do?</span>
                  <Input as="select" defaultValue="pilot">
                    <option value="project">Discuss a project</option>
                    <option value="pilot">Start with a pilot</option>
                    <option value="scope">Scope a project</option>
                  </Input>
                </Layout>
                <Input as="select" appearance="fill" aria-label="What would you like to do?">
                  <option>Discuss a project</option>
                  <option>Start with a pilot</option>
                </Input>
              </Layout>
            </Specimen>
            <Specimen title="Invalid and disabled" note="Neither state uses opacity.">
              <Layout rowGap="block">
                <LabelledInput label="Invalid" invalid />
                <LabelledInput label="Disabled" disabled />
              </Layout>
            </Specimen>
            <Specimen
              title="Line · input and textarea"
              note={`appearance="line": 44 tall, the value on its one rule. As EnquiryForm sets it, the placeholder is the cue and the label hidden. Focus turns the rule blue.`}
            >
              <Layout rowGap="text">
                <Input appearance="line" aria-label="Email" placeholder="Email" type="email" />
                <Input
                  as="textarea"
                  appearance="line"
                  aria-label="What are you working on?"
                  placeholder="What are you working on?"
                />
                {/* EnquiryForm disables every field while it submits and keeps `invalid` from the
                    blur messages, so this pair is a real state: it must read disabled, with no
                    danger rule left under it. */}
                <LabelledInput
                  label="Invalid and disabled"
                  appearance="line"
                  invalid
                  disabled
                />
              </Layout>
            </Specimen>
          </Layout>
        </Layout>
      </Section>

      {/* Every surface renders every STATE, not just rest, for BOTH shapes. Twelve of the nineteen
          surface-dependent tokens (--inp-standard-invalid-rule, the three --inp-disabled-* and the
          eight --inp-line-*) move per surface, and with invalid and disabled shown on one surface only they were never
          looked at on ink or blue. The invalid rule steps danger-600 / 600 / 300 / 600 across the
          four: on blue it is chosen against the WHITE field it borders, not against the blue
          ground. The LINE field has no fill, so its invalid rule is chosen against the ground
          itself: danger-600 / 600 / 300 and danger-300 on blue (danger-100 read as the rest rule drawn heavier). The textarea row is here because the textarea is the shape the enquiry forms
          lean on, and its invalid rule had only ever been seen on paper.

          Three tracks from lg, not md: at 768 a third of the column is 213px, and the row was the
          one place on the route that scrolled sideways (768–899) while Input carried a 16rem
          floor. The floor has since moved to the composing patterns; the row still waits for room. */}
      {(['paper', 'tint', 'ink', 'blue'] as const).map((surface) => (
        <div
          key={surface}
          data-fold-exempt="surface proof: twelve states on one ground, which at 390 stack one per row"
        >
          <Section surface={surface}>
            <Specimen
              title={`Surface · ${surface}`}
              note="Identical markup on all four: rest, invalid and disabled, as an input and as a textarea, boxed and lined. Every surface-dependent token renders in this band. On blue the line invalid rule is danger-300, a change of hue rather than a heavier pale rule, and the line disabled field reads its own brandeis-300 / 400 tokens."
            >
              <Layout rowGap="stack">
                <Layout columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="block">
                  <LabelledInput label="Rest" />
                  <LabelledInput label="Invalid" invalid />
                  <LabelledInput label="Disabled" disabled />
                </Layout>
                <Layout columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="block">
                  <LabelledTextarea label="Rest · textarea" />
                  <LabelledTextarea label="Invalid · textarea" invalid />
                  <LabelledTextarea label="Disabled · textarea" disabled />
                </Layout>
                <Layout columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="block">
                  <LabelledInput label="Rest · line" appearance="line" />
                  <LabelledInput label="Invalid · line" appearance="line" invalid />
                  <LabelledInput label="Disabled · line" appearance="line" disabled />
                </Layout>
                <Layout columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="block">
                  <LabelledTextarea label="Rest · line textarea" appearance="line" />
                  <LabelledTextarea label="Invalid · line textarea" appearance="line" invalid />
                  <LabelledTextarea
                    label="Disabled · line textarea"
                    appearance="line"
                    disabled
                  />
                </Layout>
              </Layout>
            </Specimen>
          </Section>
        </div>
      ))}

      {/* ── The nested-surface band ───────────────────────────────────────────────
          The reason all four blocks restate all nineteen tokens rather than carrying deltas. A blue
          Section inside an ink one must render the BLUE column; if any token were missing from the
          blue block it would inherit ink's value and the mismatch would show here as a field that
          does not match its own ground. Input owns more surface-dependent tokens than any other
          primitive, and until now it was the only one with no band to prove it. */}
      <Section surface="ink">
        {/* Side by side from lg: stacked, the band was 839 at 1470 and ran past the fold. */}
        <Layout columns={{ base: 1, lg: [1, 2] }} colGap="gutter" rowGap="stack" align="start">
          <Specimen
            title="Nested surface · ink outer"
            note="The reference: an ink field on the ink ground it belongs to."
          >
            <LabelledInput label="Standard · on ink" />
          </Specimen>
          <Section surface="blue">
            <Specimen
              title="Nested surface · blue inside ink"
              note="SPECIMEN-ONLY ARRANGEMENT — a Section inside a Section insets the content column twice, which is why the two do not align. What it proves is the colour: this field must read as blue's column (a white field, a brandeis-200 rule, and invalid at danger-600 — chosen against the white fill it borders, where danger-100 would measure 1.24:1), not as ink's stranded on a blue ground (a neutral-900 field, invalid at danger-300)."
            >
              <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="block">
                <LabelledInput label="Standard · on blue" />
                <LabelledInput label="Standard · invalid" invalid />
              </Layout>
            </Specimen>
          </Section>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="block">
          <h2>Edge cases</h2>
          <Specimen
            title="Long values"
            note="The input scrolls; the textarea wraps. Neither sets a minimum width: the pattern that composes the field owns its floor."
          >
            <Layout rowGap="block">
              <Layout as="label" rowGap="tight">
                <span>Long single-line address</span>
                <Input defaultValue="https://example.com/a-very-long-unbroken-product-address-that-keeps-going-without-a-break" />
              </Layout>
              <Layout as="label" rowGap="tight">
                <span>Long multiline address</span>
                <Input
                  as="textarea"
                  defaultValue="https://example.com/a-very-long-unbroken-product-address-that-wraps-inside-the-multiline-control-without-widening-its-parent"
                />
              </Layout>
            </Layout>
          </Specimen>
          <a href={ROUTES.design}>Back to the proving ground</a>
        </Layout>
      </Section>
    </>
  );
}
