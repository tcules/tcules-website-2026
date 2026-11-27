import Link from 'next/link';

import { Button, Layout, Section, Texture, TextureShape } from '@/components';
import { CtaSection, EnquiryForm, type EnquiryContextBase } from '@/patterns';
import { ENDPOINTS, ROUTES } from '@/lib/routes';

import { Rehearse } from '../../_specimen/Rehearse';
import { Specimen, specimenStyles as s } from '../../_specimen/Specimen';
import t from '../../_specimen/typeroles.module.css';

/**
 * The form family (kit `cmp-form`): every composition the kit asks a form to sit in, laid out as
 * a showcase page — an intro band, then each variation as a titled band — rather than a dump.
 *
 * Every band is a real pattern composed with real props: a form sits only on CtaSection's island
 * (owner, 29 Oct 2026; decisions/2026-10-29-forms-only-on-the-island), so the one page band here is
 * that close; the rest are the form's own field sets and states. Showcase copy is inline (visual-direction § 8.4); photographs
 * come from the kit registry, one temperature family (warm + neutral, § 5.5).
 *
 * Posts go to the proving ground's own endpoint; `?outcome=` picks what it answers. The error-state
 * specimen's send answers 500 on purpose, which is the one console error the page logs.
 */

const action = (outcome: 'success' | 'error' | 'pending' = 'success') =>
  `${ENDPOINTS.enquiryDesign}?outcome=${outcome}`;

const context = (placement: string): EnquiryContextBase => ({
  originRoute: ROUTES.designKitForm,
  placement,
  family: 'kit',
  serviceOrAudit: 'kit-form',
  referrer: '',
  campaign: '',
});

const VARIATIONS = [
  { id: 'close', title: 'The close, on its island' },
  { id: 'full-sets', title: 'Enquiry and audit' },
  { id: 'contact', title: 'Contact, and what it becomes' },
  { id: 'states', title: 'Invalid, error and success' },
] as const;

type VariationId = (typeof VARIATIONS)[number]['id'];

const indexOf = (id: VariationId) =>
  String(VARIATIONS.findIndex((v) => v.id === id) + 1).padStart(2, '0');

const FILLED = {
  name: 'Maya Fernandes',
  email: 'maya@northwind.studio',
  what_are_you_working_on: 'A billing redesign for a B2B payments product.',
};

const FILLED_CONTACT = {
  clientName: 'Maya Fernandes',
  clientCompany: 'Northwind',
  clientEmail: 'maya@northwind.studio',
  clientContact: '+44 20 7946 0000',
  clientComments: 'We would like to talk about a design partnership from January.',
};

/* What happens after an enquiry, said ONCE: the close's points promise it, and the success view
   keeps the promise by reading the same list (EnquiryForm `nextSteps`). It used to be a second
   copy inside the pattern, and the two had already drifted. */
const ENQUIRY_STEPS = [
  {
    label: 'A reply within a working day',
    detail: 'From the person who would lead the work, with the questions we would ask first.',
  },
  {
    label: 'A thirty-minute call',
    detail: 'What exists, what is stuck, and what a first fortnight would change.',
  },
  {
    label: 'A written proposal',
    detail: 'Scope, team and timeline on two pages. No deck, and no obligation.',
  },
] as const;

/* A plain message promises less than an enquiry, so contact says less: no proposal. */
const CONTACT_STEPS = [
  {
    label: 'A reply within a working day',
    detail: 'From a person at the studio, not a queue.',
  },
  {
    label: 'A call, if it helps',
    detail: 'Thirty minutes at a time that suits you. Nothing to prepare.',
  },
] as const;

/* The compact ask promises the first step only. */
const COMPACT_STEPS = [
  {
    label: 'A reply within a working day',
    detail: 'With what we would look at first, and whether we are the right team.',
  },
] as const;

/**
 * A variation's title band: the index numeral in blue over its name (an h2 at h3 scale; the band
 * below brings its own h2, so the outline never steps h1 → h3), and what to look for beside it.
 */
function Plate({ id, note }: { id: VariationId; note: string }) {
  const title = VARIATIONS.find((v) => v.id === id)?.title ?? id;
  return (
    <Section id={id}>
      <Layout
        className={s.spec}
        columns={{ lg: [1, 2] }}
        colGap="section"
        rowGap="text"
        align="end"
      >
        <Layout rowGap="tight">
          <p className={`${t.index} ${s.accent}`}>{indexOf(id)}</p>
          <h2 className={t.h3}>{title}</h2>
        </Layout>
        <p className={s.specNote}>{note}</p>
      </Layout>
    </Section>
  );
}

export default function KitFormPage() {
  return (
    <>
      {/* ── Intro ───────────────────────────────────────────────────────────────────── */}
      <Section>
        {/* The grid field fills the empty end of the band, clear of the title's 7 track, and
            feathers off the top edge; it never reaches a form (every form on this page is in a
            band of its own). */}
        <Texture>
          <TextureShape
            kind="ellipse"
            top={-220}
            right={-160}
            width="40%"
            height={420}
            blur={200}
          />
        </Texture>
        <Layout columns={{ lg: [7, 5] }} colGap="section" rowGap="stack">
          <Layout rowGap="stack">
            <Layout rowGap="block">
              <p className={s.eyebrow}>UI kit · Forms</p>
              <h1>Every ask, in the shape its page needs</h1>
              <p>
                One form, four field sets, and no labels over the boxes: each field says what it
                wants in its own placeholder, so a short ask stays short. The form sits on an
                island, beside the promise it makes. Errors still land under their field, and are read aloud.
              </p>
            </Layout>
            <Layout as="ol" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="tight">
              {VARIATIONS.map((v) => (
                <li key={v.id}>
                  <a href={`#${v.id}`}>
                    {indexOf(v.id)} · {v.title}
                  </a>
                </li>
              ))}
            </Layout>
          </Layout>
        </Layout>
      </Section>

      {/* ── 01 · L close ────────────────────────────────────────────────────────────── */}
      <Plate
        id="close"
        note="CtaSection split (archetype L): a form sits ONLY on an island, brandeis by default or ink, with the drawing or without (owner, 29 Oct 2026). Here the default: the head, one paragraph and three points beside the full enquiry form, with its scheduling link, on its paper panel. The placements this page showed before (the compact form beside a photograph, under a centred head, beside its head, in the offer and on an ink band) are retired with that ruling. The form's success view reads the same three points, so the promise is said once."
      />
      <CtaSection
        eyebrow="Start a project"
        heading="Tell us what you are shipping"
        body={[
          'A designer reads every enquiry, not a queue. Here is what happens after you send it.',
        ]}
        points={ENQUIRY_STEPS}
        form={
          <EnquiryForm
            action={action()}
            context={context('kit-close')}
            scheduleHref={ROUTES.contact}
            nextSteps={ENQUIRY_STEPS}
          />
        }
      />

      {/* ── 08 · Enquiry and audit ──────────────────────────────────────────────────── */}
      <Plate
        id="full-sets"
        note="The two full field sets side by side, each filling its track: email, the question and an optional link, with See available times beside the submit. One width policy for every variant, so the right edges agree."
      />
      <Section>
        <Layout columns={{ base: 1, lg: 2 }} colGap="column" rowGap="column">
          <Specimen title="enquiry" note="Send enquiry, with See available times beside it.">
            <EnquiryForm
              action={action()}
              context={context('kit-variants')}
              scheduleHref={ROUTES.contact}
              nextSteps={ENQUIRY_STEPS}
            />
          </Specimen>
          <Specimen title="audit" note="The audit wording.">
            <EnquiryForm
              variant="audit"
              action={action()}
              context={context('kit-variants')}
              scheduleHref={ROUTES.contact}
            />
          </Specimen>
        </Layout>
      </Section>

      {/* ── 09 · Contact, and its success ───────────────────────────────────────────── */}
      <Plate
        id="contact"
        note="The five-field contact set, its fields paired (name with company, email with phone) so it fits a band, beside the same form sent: the thanks and the caller's two steps. A plain message promises less than an enquiry, so it says less."
      />
      <Section>
        <Layout columns={{ base: 1, lg: 2 }} colGap="column" rowGap="column">
          <Specimen
            title="contact"
            note="Five fields in three rows; the contact page is the conversation."
          >
            <EnquiryForm
              variant="contact"
              action={action()}
              scheduleHref={ROUTES.contact}
              nextSteps={CONTACT_STEPS}
            />
          </Specimen>
          <Specimen title="contact · sent" note="The thanks, then what happens next.">
            <Rehearse submit fill={FILLED_CONTACT}>
              <EnquiryForm
                variant="contact"
                action={action()}
                scheduleHref={ROUTES.contact}
                nextSteps={CONTACT_STEPS}
              />
            </Rehearse>
          </Specimen>
        </Layout>
      </Section>

      {/* ── 10 · Error and success ──────────────────────────────────────────────────── */}
      <Plate
        id="states"
        note="Driven through the real controls on load: the first form sent with the name and question empty and the email malformed, so nothing posts, every message lands under its field and focus moves to the first; the second filled and sent to an endpoint that fails (the page's one console 500 is that send, on purpose); the third sent. On tint, as the surface proof: on pages, tint is the proof band only (§ 1.7)."
      />
      <div data-fold-exempt="specimen comparison: three states side by side, which at 390 stack past the phone limit">
        <Section surface="tint">
          <Layout columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="column">
            <Specimen
              title="Invalid · sent incomplete"
              note="Nothing posts. Each message opens under its field; the line beside the submit counts them."
            >
              <Rehearse submit fill={{ email: 'maya@' }}>
                <EnquiryForm
                  variant="compact"
                  action={action()}
                  context={context('kit-states')}
                />
              </Rehearse>
            </Specimen>
            <Specimen
              title="Error · send failed"
              note="The answers stay; the line under the submit turns."
            >
              <Rehearse submit fill={FILLED}>
                <EnquiryForm
                  variant="compact"
                  action={action('error')}
                  context={context('kit-states')}
                />
              </Rehearse>
            </Specimen>
            <Specimen
              title="Success · sent"
              note="The form gives way to the thanks, then the one step the compact ask promises."
            >
              <Rehearse submit fill={FILLED}>
                <EnquiryForm
                  variant="compact"
                  action={action()}
                  context={context('kit-states')}
                  nextSteps={COMPACT_STEPS}
                />
              </Rehearse>
            </Specimen>
          </Layout>
        </Section>
      </div>

      <Section>
        <Button as={Link} href={ROUTES.design} emphasis="link" tone="primary">
          Back to the proving ground
        </Button>
      </Section>
    </>
  );
}
