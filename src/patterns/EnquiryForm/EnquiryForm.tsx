'use client';

import type { FormEvent, ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';

import { Button, Chip, Cluster, Icon, Input, Layout } from '@/components';
import { cx } from '@/lib/cx';

import styles from './EnquiryForm.module.css';

/* The plain noun first; the two longer labels stay for the placements whose page asks a different
   question of the link. See § Field labels on FieldGroup. */
export type EnquiryUrlLabel =
  'Website' | 'Link to the work' | 'Where can we see it?' | 'Product or company URL';

export type AuditUrlLabel = 'Site to audit';

export type EnquiryContextBase = {
  originRoute: string;
  placement: string;
  family: string;
  serviceOrAudit: string;
  referrer: string;
  campaign: string;
};

type SharedProps = {
  action: string;
  onSubmitted?: () => void;
  /**
   * How wide the form sets (cmp-form fix round, 6 Oct 2026). ONE policy for every variant: the form
   * fills the track it is placed in, down to its own floor, so four variants side by side share a
   * right edge, and a form stacked under a full-width photograph meets the photograph's edge.
   *
   * `measure` caps it at --enq-form-measure (667) for the one placement that has no track of its
   * own to fill: a standalone form under a CENTRED head, where ContentSection gives every body row
   * the whole 1240 column and the cap is what centres.
   */
  width?: 'track' | 'measure';
  /**
   * The field treatment. `box` (default, every variant; owner, 7 Oct 2026) is Input's filled
   * control, which separates each field more clearly than a rule. `line` is the unboxed
   * underline field — references.md's Meridian and Executra move.
   */
  fields?: 'line' | 'box';
  /**
   * How the submit sets. `inline` (default) is the button at its own width, the caption (compact)
   * or the scheduling link (full) beside it. `full` sets the button across the form's whole track
   * with the line under it — the reference move (Executra) for a form that ends a column, and the
   * variation that stops every compact form on a page being the same rectangle.
   */
  submit?: 'inline' | 'full';
  /**
   * What happens after a send, shown in the success view as numbered steps. The CALLER's copy,
   * never the pattern's: on a close it is the same list the band's points promise (pass
   * CtaSection's `points` straight through), so the success view keeps the band's promise and
   * cannot drift from it. Absent, the success view is the thanks and one line. Structurally
   * CtaSection's CtaPoint — a pattern does not import a pattern, so the shape is restated, not the
   * type.
   */
  nextSteps?: readonly EnquiryNextStep[];
  /**
   * The success view's own words, where the page authors them (the corpus's `on_success`, page-mapping
   * G2): a heading and the line under it. The CALLER's copy, as `nextSteps` is. Absent, the view
   * says "Thanks. We have your enquiry." and its one line, as it always has.
   */
  success?: { heading: string; body: string };
  /**
   * The resting line beside or under the submit — what happens after a send — in the page's own
   * words (home round 3, 11 Oct 2026): the corpus authors "We'll reply within one business day." on
   * every enquiry, and the form printed its own "We reply within a business day." beside it. The
   * CALLER's copy, as `success` is. Absent, the form's own line. The status of a send replaces it in
   * the same live region.
   */
  caption?: string;
  /**
   * The fields' size step, passed to every Input (`scale`). `md` (default); `lg` (48, the value at
   * the lead role) where the form is the band's primary object — the enquiry close (home round 3).
   */
  fieldScale?: 'md' | 'lg';
};

/** One step in the success view's "what happens next". */
export type EnquiryNextStep = { label: string; detail?: string };

/**
 * One answer in a chip group (19 Oct 2026, the chip form). The CALLER's copy, as every dress's is.
 *
 *   value   what posts: `needs=product-design`, `stage=prototype`.
 *   label   the chip's words, sentence case as authored: "Product design".
 *   prompt  a need's follow-up question. Picking the chip makes it the message field's example
 *           ("Where do people get stuck today?"); the most recent pick that has one wins.
 *   echo    the words the reply line says the pick back with, where they differ from the label:
 *           a stage "A prototype" echoes as "a prototype" mid-sentence. Absent, the label.
 */
export type EnquiryChoice = { value: string; label: string; prompt?: string; echo?: string };

/**
 * A chip group: the question it answers, a quiet aside after it ("Pick any", "Optional"), and its
 * answers. Rendered as a `<fieldset>` whose `<legend>` is the question and the aside.
 */
export type EnquiryChoiceGroup = {
  question: string;
  aside?: string;
  options: readonly EnquiryChoice[];
};

/**
 * How the enquiry set is DRESSED (owner, 16 Oct 2026, the home close: "it just looks like a blank
 * box with a few lines instead of feeling like a well rounded form"). The behaviour is the same
 * form's — the same fields, names, send-only validation, statuses and success view — and only its
 * presentation changes. Absent, the plain set: hidden labels, the noun as the cue.
 *
 * The card's fields carry NO placeholder (Jatin, 26 Oct 2026: "so much cleaner"): the visible
 * label already names each one, and grey text inside the box is a second thing to read past.
 *
 *   card     a structured card with no heading of its own (Jatin, 26 Oct 2026: the band's heading
 *            already asks): visible labels over filled fields, and a foot under a hairline:
 *            the send with the reply promise beside it, led by a bolt in a disc, and optionally a line
 *            under ("or write to …", a note). The status of a send replaces the promise, in the
 *            same live region.
 *   message  the reply to a note: a person's portrait, name and role with their one-line note in a
 *            bubble, then a composer — the big field first, name, email and link as its details,
 *            and the send in its foot beside "or write to …". With `needs` (19 Oct 2026), the
 *            note is answered first by a row of chips under the bubble, then the composer.
 *   choice   the chip form, "split panel" (owner, 19 Oct 2026): two halves under a hairline split —
 *            name and email side by side over the message (which stretches so the half ends level
 *            with the other), and the chip groups with the optional link — then a foot across both:
 *            the reply line saying the picks back as a sentence, and the send at the end.
 *
 * All copy is the CALLER's, as `caption` and `success` are. The chip groups post `needs` (one
 * value per checked chip) and `stage` (the one checked radio); both are optional answers.
 */
export type EnquiryDress =
  | {
      kind: 'card';
      /** The address offered in the foot as "or write to …", linked as mailto. */
      writeTo?: string;
      /** A closing clause after it: "We never share your details." */
      note?: string;
      /** The promise beside the send, led by a bolt in a disc (speed, not a tick): "We reply in 1 business day". */
      reply?: string;
    }
  | {
      kind: 'message';
      /** The person written to. Their name, role and a square portrait (rendered as a circle). */
      from: { name: string; role: string; portrait: string };
      /** Their note, the first message in the thread: one sentence. */
      note: string;
      prompt?: string;
      writeTo?: string;
      /**
       * The note answered as chips under the bubble (pick any; posts `needs`). The question is the
       * group's accessible name; the bubble describes it, so the question is never shown twice.
       */
      needs?: EnquiryChoiceGroup;
    }
  | {
      kind: 'choice';
      /** "What do you need?" · "Pick any": a pick-any group, posts `needs`. */
      needs: EnquiryChoiceGroup;
      /** "Where is it today?" · "Optional": a pick-one group, posts `stage`. */
      stage?: EnquiryChoiceGroup;
      /** The message field's example before a need with a prompt is picked. */
      prompt?: string;
      /** The reply line's promise, after the picks: "We reply within one business day." */
      reply?: string;
    };

/* "See available times" lives in the form's own action row, beside the submit, so the two asks
   read as one group rather than as a form with a stray link under it. Amended 29 Sep 2026
   (tracker 2.17): it used to be CtaSection's, rendered a --gap-stack below the form.

   REQUIRED on audit. Every audit instance must offer it, and that constraint used to be CtaSection's
   `scheduleHref`; it moved here with the link, so the type still refuses an audit form without one.
   Optional on contact: the contact page's own form is the scheduling conversation, and a link to it
   from itself would be a loop. OPTIONAL on enquiry since 10 Oct 2026 (page-mapping G2): the corpus
   authors a scheduling link on case pages only, and no scheduling destination exists in
   `src/lib/routes.ts`, so a corpus enquiry that names none must be able to say so rather than
   invent a href. Where the page passes one, the link renders exactly as before. */
type EnquiryVariantProps = SharedProps & {
  variant?: 'enquiry';
  urlLabel?: EnquiryUrlLabel;
  context: EnquiryContextBase & { intent?: never };
  scheduleHref?: string;
  /** The enquiry set's dress. See `EnquiryDress`. Enquiry only: the other sets keep their shape. */
  dress?: EnquiryDress;
};

type AuditVariantProps = SharedProps & {
  variant: 'audit';
  urlLabel?: AuditUrlLabel;
  context: EnquiryContextBase & { intent: string };
  scheduleHref: string;
  dress?: never;
};

type ContactVariantProps = SharedProps & {
  variant: 'contact';
  urlLabel?: never;
  context?: never;
  scheduleHref?: string;
  dress?: never;
};

/* The compact form (kit cmp-form, 6 Oct 2026): name, email, the one free-text question and the
   submit, at most 400 tall, for the placements where the form is not the band's whole argument: a
   quiet photograph beside a short form (L-photo), the mid-page offer, a standalone ask inside a
   ContentSection. Context travels as on enquiry, so a compact submission is attributable. It is 369
   tall in a 667 track and in any track that holds the name and email pair and the caption beside
   the submit; in a phone column the pair stacks and the caption drops under the submit (544 at
   326, measured 6 Oct 2026).

   NO scheduling link, and the type refuses one. Compact is the short ask by definition; the link is
   the second way to take the step, and a second way is what pushed the full form past 400. The
   placements that want both use `enquiry`. */
type CompactVariantProps = SharedProps & {
  variant: 'compact';
  urlLabel?: never;
  context: EnquiryContextBase & { intent?: never };
  scheduleHref?: never;
  dress?: never;
};

export type EnquiryFormProps =
  EnquiryVariantProps | AuditVariantProps | ContactVariantProps | CompactVariantProps;

/* `invalid`: a send was attempted with a required answer missing or malformed, and the form held
   it back (r7-form). Nothing was posted. */
type Lifecycle = 'idle' | 'invalid' | 'submitting' | 'error' | 'success';
type FieldMessages = {
  email: string;
  work: string;
  name: string;
  company: string;
  contact: string;
  comments: string;
};

const EMPTY_MESSAGES: FieldMessages = {
  email: '',
  work: '',
  name: '',
  company: '',
  contact: '',
  comments: '',
};

/**
 * A URL as people type it — "acme.com", "www.acme.com/app" — made into the full address the form
 * sends. The field used to REJECT anything not starting with https://, which made a person learn a
 * rule the form could apply itself, and is the only reason the optional URL field carried an error
 * row (1 Oct 2026). Normalise, don't reject: a scheme-less value gets https:// in front; anything
 * that already has a scheme is left as typed. Blank stays blank.
 */
function normaliseUrl(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '' || /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * One field's frame: a hidden label, an optional hint, the control and its message (r7-form, owner
 * 7 Oct 2026).
 *
 * NO VISIBLE LABEL. The placeholder is the field's visible cue — "Name", "Email", "What are you
 * working on?" — and the <label> stays, visually hidden, so the field keeps its accessible name and
 * the name does not vanish for a screen reader once something is typed. A field that needs more
 * than its noun says it in a visible hint above the control. The compact form is the point: a row
 * of labels over a row of boxes doubled the form's height for words the boxes already said.
 *
 *   label     the NOUN for the value — Email, Name, Company, Phone, Website — or the question
 *             where the field asks for free text. Never "Your …", never Title Case. The same words
 *             are the placeholder, so what is announced is what is seen.
 *   optional  said inside the cue, in the cue's own voice: "Website (optional)".
 *   hint      a visible row above the control, only when the field has something to explain.
 *   validates the field can fail. Its message row is ALWAYS mounted and is a polite live region,
 *             so an error from a send is announced as it appears; it is empty and takes no height until
 *             there is a message, which keeps the form compact. The control points at it with
 *             aria-describedby, so a return visit to the field reads the error with its name.
 *
 * Errors say what to do, in a few words, no period, no blame: "Enter your email", "Enter a valid
 * email". Prefer normalising over rejecting (see normaliseUrl).
 */
type FieldGroupProps = {
  id: string;
  label: string;
  /**
   * The card dress: the label is VISIBLE over the control, with "Optional" set at the row's end for
   * an optional field (still read as part of the label by a screen reader).
   */
  visibleLabel?: boolean;
  optional?: boolean;
  hint?: { id: string; text: string };
  /** Present when the field validates: the id of its message row, and the message. */
  validation?: { id: string; message: string };
  /**
   * The control takes whatever height its group is stretched to (the chip form's message field,
   * which runs down to where the chip half beside it ends). Visible label only: the label row stays
   * its own height, the control and its message take the rest, and the control fills it.
   */
  fill?: boolean;
  children: ReactNode;
};

function FieldGroup({
  id,
  label,
  visibleLabel = false,
  optional = false,
  hint,
  validation,
  fill = false,
  children,
}: FieldGroupProps) {
  const message = validation?.message ?? '';
  const messageRow = validation ? (
    <div className={styles.message} id={validation.id} aria-live="polite">
      {message ? (
        <Cluster colGap="tight" align="center" nowrap>
          <Icon name="close-circle" />
          <span>{message}</span>
        </Cluster>
      ) : null}
    </div>
  ) : null;
  const labelRow = (
    <Cluster justify="between" align="baseline" colGap="text">
      <label className={styles.labelVisible} htmlFor={id}>
        {label}
        {optional ? <span className={styles.hidden}> (optional)</span> : null}
      </label>
      {optional ? (
        <span className={styles.labelAside} aria-hidden="true">
          Optional
        </span>
      ) : null}
    </Cluster>
  );
  if (fill && visibleLabel && !hint) {
    /* Two nested stretches: the label row and the rest (`fillLast`), then the control and its
       message, the control's row taking the height (`fillFirst`). The control is a grid item at the
       default stretch, so it fills its row. */
    return (
      <Layout rowGap="tight" fillLast>
        {labelRow}
        <Layout rowGap={message ? 'tight' : undefined} fillFirst>
          {children}
          {messageRow}
        </Layout>
      </Layout>
    );
  }
  return (
    /* The control and its message group at `tight`, but ONLY while there is a message: an empty
       message row is mounted (it is the live region) and must cost nothing, so with no message the
       group states no row gap and the empty row is zero tall. A visible label always opens a
       `tight` above its control. */
    <Layout rowGap={message || visibleLabel ? 'tight' : undefined}>
      {visibleLabel ? (
        labelRow
      ) : (
        <label className={styles.hidden} htmlFor={id}>
          {label}
          {optional ? ' (optional)' : null}
        </label>
      )}
      {hint ? (
        <p className={styles.hint} id={hint.id}>
          {hint.text}
        </p>
      ) : null}
      {children}
      {messageRow}
    </Layout>
  );
}

/** A field's message for its current value: empty, malformed, or none. Submit sets it; editing only clears it. */
function messageFor(spec: FieldSpec, control: HTMLInputElement | HTMLTextAreaElement): string {
  if (control.value.trim() === '') return spec.empty;
  if (control instanceof HTMLInputElement && control.validity.typeMismatch) {
    return 'Enter a valid email';
  }
  return '';
}

/** Picks said back as a list: "A", "A and B", "A, B and C". */
function listOf(items: readonly string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** The reassurance line beside (or under) the submit. One sentence, said once, and kept at the
    submit by ruling (owner, 7 Oct 2026): the promise belongs where the decision to send is made. */
const CAPTION = 'We reply within a business day.';

/** The validating text fields, keyed by the message slot each one fills. */
type FieldKey = keyof FieldMessages;

/**
 * One validating field, declared once. Name, email and the free-text question used to be written
 * out per variant — the compact branch was a near-verbatim copy of contact's Name and Email blocks
 * and their validators — so a change to one could drift from the other. Each variant is now a
 * LIST of these, and one renderer turns every entry into the same FieldGroup + Input.
 *
 * `name` is the posted field name, which differs by variant (contact posts `clientEmail`, the
 * enquiry sets post `email`); everything a person sees is the spec's.
 */
type FieldSpec = {
  key: FieldKey;
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel';
  as?: 'textarea';
  autoComplete?: string;
  /** The message when a send finds the field empty. */
  empty: string;
};

const FIELD = {
  name: (name: string): FieldSpec => ({
    key: 'name',
    label: 'Name',
    name,
    autoComplete: 'name',
    empty: 'Enter your name',
  }),
  email: (name: string): FieldSpec => ({
    key: 'email',
    label: 'Email',
    name,
    type: 'email',
    autoComplete: 'email',
    empty: 'Enter your email',
  }),
  company: {
    key: 'company',
    label: 'Company',
    name: 'clientCompany',
    autoComplete: 'organization',
    empty: 'Enter your company',
  } satisfies FieldSpec,
  phone: {
    key: 'contact',
    label: 'Phone',
    name: 'clientContact',
    type: 'tel',
    autoComplete: 'tel',
    empty: 'Enter your phone number',
  } satisfies FieldSpec,
  work: {
    key: 'work',
    label: 'What are you working on?',
    name: 'what_are_you_working_on',
    as: 'textarea',
    empty: 'Add a line about it',
  } satisfies FieldSpec,
  message: {
    key: 'comments',
    label: 'What would you like to talk about?',
    name: 'clientComments',
    as: 'textarea',
    empty: 'Add a message',
  } satisfies FieldSpec,
};

/**
 * EnquiryForm — the site's shared enquiry behavior for the three-field enquiry/audit set, the
 * five-field contact set and the three-field compact set. Validation runs on SUBMIT only (owner,
 * 16 Oct 2026: "errors must not show until a person clicks submit. we don't show errors on focus
 * change"). After a send has flagged a field, editing it only ever CLEARS its message, once the
 * value is valid; nothing new appears while someone types or moves between fields. Submission keeps
 * uncontrolled values mounted on failure and replaces the form on success.
 *
 * A pattern in its own right, not CtaSection's part: it fills whatever track it is placed in, down
 * to its own floor (`--enq-form-min-inline`), so it reads the same in CtaSection's form column, in
 * ContentSection's `media` copy column beside a photograph, and — with `width="measure"` — as a
 * centred block under a centred head.
 *
 * Blue is its recurring foreground accent (visual-direction § 4, owner 6 Oct 2026): the trailing
 * arrow on the submit, the mark leading the caption, the label of the field being written in, the
 * rule under that field, the success mark and the numerals of the next steps. No ground is blue.
 */
export function EnquiryForm(props: EnquiryFormProps) {
  const instanceId = useId();
  const successRef = useRef<HTMLDivElement>(null);
  const submittedCallbackFired = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [lifecycle, setLifecycle] = useState<Lifecycle>('idle');
  const [messages, setMessages] = useState<FieldMessages>(EMPTY_MESSAGES);
  /* The chip groups' answers, for what the form SAYS about them (the message field's example, the
     reply line). The inputs stay uncontrolled: the form posts what the DOM holds. `picked` is in the
     order the needs were checked, so the latest pick's prompt wins. */
  const [picked, setPicked] = useState<readonly string[]>([]);
  const [stageValue, setStageValue] = useState('');

  const variant = props.variant ?? 'enquiry';
  const onSubmitted = props.onSubmitted;
  const urlLabel = props.urlLabel ?? (variant === 'audit' ? 'Site to audit' : 'Website');
  const appearance = props.fields === 'line' ? 'line' : 'box';
  const submitting = lifecycle === 'submitting';
  const invalidCount = Object.values(messages).filter(Boolean).length;
  const bounds = props.width === 'measure' ? styles.measure : styles.track;

  const idFor = (key: string) => `${instanceId}-${key}`;
  const statusId = idFor('status');
  const urlId = idFor('url');

  /* The draft (owner, 31 Oct 2026, the contact page pass): what someone has typed or picked is kept
     in their own browser's session storage while they look around, and comes back when they return
     to this form. One key per form placement; it is dropped once the enquiry sends. A per-viewer
     convenience, so every read and write is guarded: private windows and blocked storage simply
     start empty. Hidden context is never saved, it is the page's. */
  const draftKey = `tcules:enquiry-draft:${props.action}:${
    props.variant === 'contact'
      ? 'contact'
      : `${props.context.originRoute}:${props.context.placement}`
  }`;

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    let saved: Record<string, string[]> | null = null;
    try {
      const raw = window.sessionStorage.getItem(draftKey);
      saved = raw ? (JSON.parse(raw) as Record<string, string[]>) : null;
    } catch {
      saved = null;
    }
    if (!saved) return;
    const restoredNeeds: string[] = [];
    for (const control of Array.from(form.elements)) {
      if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement))
        continue;
      if (control.type === 'hidden' || !control.name) continue;
      const values = saved[control.name];
      if (!values) continue;
      if (
        control instanceof HTMLInputElement &&
        (control.type === 'checkbox' || control.type === 'radio')
      ) {
        control.checked = values.includes(control.value);
        if (control.checked && control.name === 'needs') restoredNeeds.push(control.value);
        if (control.checked && control.name === 'stage') setStageValue(control.value);
      } else {
        control.value = values[0] ?? '';
      }
    }
    if (restoredNeeds.length > 0) setPicked(restoredNeeds);
    // Restore once, on mount: the key is fixed for a placement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveDraft(form: HTMLFormElement) {
    const draft: Record<string, string[]> = {};
    for (const control of Array.from(form.elements)) {
      if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement))
        continue;
      if (control.type === 'hidden' || !control.name) continue;
      if (
        control instanceof HTMLInputElement &&
        (control.type === 'checkbox' || control.type === 'radio')
      ) {
        if (control.checked) (draft[control.name] ??= []).push(control.value);
      } else if (control.value.trim() !== '') {
        draft[control.name] = [control.value];
      }
    }
    try {
      if (Object.keys(draft).length === 0) window.sessionStorage.removeItem(draftKey);
      else window.sessionStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {
      /* Storage blocked or full: the form works the same without a draft. */
    }
  }

  useEffect(() => {
    if (lifecycle !== 'success') return;
    try {
      window.sessionStorage.removeItem(draftKey);
    } catch {
      /* Nothing to clear where storage is blocked. */
    }

    successRef.current?.focus();
    if (!submittedCallbackFired.current) {
      submittedCallbackFired.current = true;
      onSubmitted?.();
    }
  }, [lifecycle, onSubmitted, draftKey]);

  function setMessage(field: keyof FieldMessages, message: string) {
    setMessages((current) => ({ ...current, [field]: message }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const fallbackSubmitter =
      event.currentTarget.querySelector<HTMLButtonElement>('button[type="submit"]');
    /* Validate before sending (r7-form): every required field gets its message at once, the
       line beside the submit says how many need a look, and focus moves to the first of them so a
       keyboard or screen-reader user lands on the problem with its name and its message. */
    const form = event.currentTarget;
    const next: FieldMessages = { ...EMPTY_MESSAGES };
    let firstInvalid: HTMLElement | null = null;
    for (const spec of validated) {
      const control = form.elements.namedItem(spec.name);
      if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement))
        continue;
      next[spec.key] = messageFor(spec, control);
      if (next[spec.key] && !firstInvalid) firstInvalid = control;
    }
    if (firstInvalid) {
      setMessages(next);
      setLifecycle('invalid');
      firstInvalid.focus();
      return;
    }

    (submitter instanceof HTMLElement ? submitter : fallbackSubmitter)?.focus();

    setLifecycle('submitting');

    try {
      const response = await fetch(props.action, {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });
      setLifecycle(response.ok ? 'success' : 'error');
    } catch {
      setLifecycle('error');
    }
  }

  /* The rows, in order. A row is one field or a PAIR side by side: compact pairs name and email,
     contact pairs name with company and email with phone (cmp-form final round — stacked one per
     row, the five-field set was 1021 tall and ran past the fold). A pair sits side by side wherever
     the form's own width holds two 192px tracks (`fit`, `xs`) and stacks where it does not, so the
     form decides from its track, not from the viewport. The optional link field is a row of its
     own at the end of the enquiry and audit sets. */
  type Row = readonly FieldSpec[] | 'url';
  const rows: Row[] =
    variant === 'contact'
      ? [
          [FIELD.name('clientName'), FIELD.company],
          [FIELD.email('clientEmail'), FIELD.phone],
          [FIELD.message],
        ]
      : variant === 'compact'
        ? [[FIELD.name('name'), FIELD.email('email')], [FIELD.work]]
        : [[FIELD.email('email')], [FIELD.work], 'url'];

  /* The dress, when the enquiry set wears one (see EnquiryDress). */
  const dress =
    props.variant === undefined || props.variant === 'enquiry' ? props.dress : undefined;

  /* The required fields a send checks, in the order they render, so focus lands on the FIRST
     failing field on the page. The plain sets read their rows; the dresses that add a name state
     their own order: the chip form's name and email come before its message, the composer's
     message comes before its details. */
  const validated: readonly FieldSpec[] =
    dress?.kind === 'choice'
      ? [FIELD.name('name'), FIELD.email('email'), FIELD.work]
      : dress?.kind === 'message'
        ? [FIELD.work, FIELD.name('name'), FIELD.email('email')]
        : rows.flatMap((row) => (row === 'url' ? [] : row));

  /** One validating field, from its spec. The only place a FieldGroup + Input pair is written. */
  function renderField(
    spec: FieldSpec,
    dressed: {
      visibleLabel?: boolean;
      placeholder?: string | null;
      look?: 'box' | 'line' | 'bare' | 'fill';
      /** The control fills its stretched group (the chip form's message). */
      fill?: boolean;
    } = {},
  ) {
    const id = idFor(spec.key);
    const messageId = idFor(`${spec.key}-msg`);
    const shared = {
      id,
      name: spec.name,
      autoComplete: spec.autoComplete,
      /* The visible cue (r7-form): the label's own words, since the label is hidden. A dress
         passes its own example instead, or `null` for none (the card). */
      placeholder:
        dressed.placeholder === null ? undefined : (dressed.placeholder ?? spec.label),
      required: true,
      disabled: submitting,
      appearance: dressed.look ?? appearance,
      scale: props.fieldScale ?? 'md',
      invalid: Boolean(messages[spec.key]),
      'aria-describedby': messageId,
    } as const;
    /* Never ADDS a message: only a send does. Once a send has flagged this field, its message
       clears the moment the value becomes valid. */
    const clearIfFixed = (control: HTMLInputElement | HTMLTextAreaElement) => {
      if (messages[spec.key] && !messageFor(spec, control)) setMessage(spec.key, '');
    };

    return (
      <FieldGroup
        key={spec.key}
        id={id}
        label={spec.label}
        visibleLabel={dressed.visibleLabel}
        fill={dressed.fill}
        validation={{ id: messageId, message: messages[spec.key] }}
      >
        {spec.as === 'textarea' ? (
          <Input
            {...shared}
            as="textarea"
            rows={dressed.look === 'bare' ? 4 : undefined}
            onInput={(event) => clearIfFixed(event.currentTarget)}
          />
        ) : (
          <Input
            {...shared}
            type={spec.type ?? 'text'}
            onInput={(event) => clearIfFixed(event.currentTarget)}
          />
        )}
      </FieldGroup>
    );
  }

  /** The optional link field in a dress: the same control and normalising as the plain set's. */
  function renderDressedUrl(
    look: 'fill' | 'bare',
    visibleLabel: boolean,
    placeholder?: string,
  ) {
    return (
      <FieldGroup key="url" id={urlId} label={urlLabel} optional visibleLabel={visibleLabel}>
        <Input
          id={urlId}
          type="url"
          inputMode="url"
          name="url"
          autoComplete="url"
          placeholder={placeholder}
          appearance={look}
          scale={props.fieldScale ?? 'md'}
          disabled={submitting}
          onBlur={(event) => {
            event.currentTarget.value = normaliseUrl(event.currentTarget.value);
          }}
        />
      </FieldGroup>
    );
  }

  /**
   * A chip group (the chip form, and the message's answers): a `<fieldset>` named by its `<legend>`,
   * the question and its aside. The legend is visually hidden and the same words are shown above
   * the chips, aria-hidden, as FieldGroup shows a visible label's "Optional": a rendered legend sits
   * in the fieldset's border and cannot take a Layout's row gap. `shown: false` drops the visible
   * question (the message, where the bubble asks it, and `describedBy` points at the bubble).
   */
  function renderChoiceGroup(
    group: EnquiryChoiceGroup,
    kind: 'needs' | 'stage',
    { shown = true, describedBy }: { shown?: boolean; describedBy?: string } = {},
  ) {
    const type = kind === 'needs' ? 'checkbox' : 'radio';
    const chips = (
      <Cluster colGap="tight" rowGap="tight">
        {group.options.map((option) => (
          <Chip
            key={option.value}
            type={type}
            name={kind}
            value={option.value}
            tick={<Icon name="chrome-check" />}
            disabled={submitting}
            onChange={(event) => {
              const { checked, value } = event.currentTarget;
              if (kind === 'stage') {
                if (checked) setStageValue(value);
                return;
              }
              setPicked((current) => {
                const rest = current.filter((item) => item !== value);
                return checked ? [...rest, value] : rest;
              });
            }}
          >
            {option.label}
          </Chip>
        ))}
      </Cluster>
    );
    return (
      <fieldset className={styles.group} aria-describedby={describedBy}>
        <legend className={styles.hidden}>
          {group.question}
          {group.aside ? ` (${group.aside})` : null}
        </legend>
        {shown ? (
          <Layout rowGap="text">
            <Cluster colGap="tight" rowGap="inline" align="baseline">
              <span className={styles.labelVisible} aria-hidden="true">
                {group.question}
              </span>
              {group.aside ? (
                <span className={styles.labelAside} aria-hidden="true">
                  {group.aside}
                </span>
              ) : null}
            </Cluster>
            {chips}
          </Layout>
        ) : (
          chips
        )}
      </fieldset>
    );
  }

  function renderRow(row: Row) {
    if (row === 'url') {
      return (
        <FieldGroup key="url" id={urlId} label={urlLabel} optional>
          <Input
            id={urlId}
            type="url"
            inputMode="url"
            name="url"
            autoComplete="url"
            placeholder={`${urlLabel} (optional)`}
            appearance={appearance}
            scale={props.fieldScale ?? 'md'}
            disabled={submitting}
            onBlur={(event) => {
              event.currentTarget.value = normaliseUrl(event.currentTarget.value);
            }}
          />
        </FieldGroup>
      );
    }
    const [first, second] = row;
    if (!first) return null;
    if (!second) return renderField(first);
    /* `text` both ways: the pair's seam is the form's own field step, so name beside email and
       name over email (stacked in a narrow track) are the same distance apart as every other row. */
    return (
      <Layout key={first.key} columns="fit" minTrack="xs" colGap="text" rowGap="text">
        {row.map((spec) => renderField(spec))}
      </Layout>
    );
  }

  if (lifecycle === 'success') {
    const steps = props.nextSteps ?? [];
    return (
      <div
        className={cx(styles.success, bounds)}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        ref={successRef}
      >
        {/* The moment the form earns, in reading order: the mark, the THANKS at title scale, then
            what happens next — the caller's steps, numbered in blue, when it passes them. */}
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <span className={styles.successMark}>
              <Icon name="check-circle" size="xl" />
            </span>
            <Layout rowGap="text">
              <h3 className={styles.successHeading}>
                {props.success?.heading ??
                  (variant === 'contact'
                    ? 'Thanks. We have your message.'
                    : 'Thanks. We have your enquiry.')}
              </h3>
              <p className={styles.successBody}>
                {props.success?.body ??
                  (steps.length > 0
                    ? 'Here is what happens next.'
                    : 'We will reply to the address you gave us.')}
              </p>
            </Layout>
          </Layout>
          {steps.length > 0 ? (
            <Layout as="ol" rowGap="block">
              {/* The first step is the one under way the moment the enquiry lands (owner, 31 Oct
                  2026): its numeral takes the accent and it is the list's current step; the rest
                  keep the neutral numerals of steps still to come. */}
              {steps.map((step, index) => (
                <li key={step.label} aria-current={index === 0 ? 'step' : undefined}>
                  <Cluster nowrap colGap="text" align="baseline">
                    <span
                      aria-hidden="true"
                      className={cx(styles.stepMarker, index === 0 && styles.stepNow)}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Layout rowGap="inline" className={styles.stepContent}>
                      <span className={styles.stepLabel}>{step.label}</span>
                      {step.detail ? (
                        <span className={styles.stepDetail}>{step.detail}</span>
                      ) : null}
                    </Layout>
                  </Cluster>
                </li>
              ))}
            </Layout>
          ) : null}
          {/* The scheduling link survives the swap. It used to, for free, because CtaSection
              rendered it outside the form; now the form owns it, so the success view carries it
              on — a sent enquiry does not make "talk sooner" any less of an offer. */}
          {props.scheduleHref ? (
            <Cluster colGap="block" rowGap="tight" align="center">
              <Button
                as="a"
                href={props.scheduleHref}
                emphasis="ghost"
                tone="primary"
                size="md"
                icon={<Icon name="arrow-right" />}
              >
                See available times
              </Button>
            </Cluster>
          ) : null}
        </Layout>
      </div>
    );
  }

  const status =
    lifecycle === 'submitting'
      ? variant === 'contact'
        ? 'Sending your message.'
        : 'Sending your enquiry.'
      : lifecycle === 'error'
        ? 'That did not send. Your answers are still here — try again.'
        : lifecycle === 'invalid' && invalidCount > 0
          ? invalidCount === 1
            ? 'One answer needs a look before this can send'
            : `${invalidCount} answers need a look before this can send`
          : '';

  const submitLabel =
    variant === 'audit'
      ? 'Request free audit'
      : variant === 'contact'
        ? 'Send message'
        : 'Send enquiry';

  /* The submit is the converting action, so it carries NO arrow on any variant (owner, 7 Oct 2026:
     a solid primary never takes one — the label carries the ask). Its partner, "See available
     times", is a ghost with the trailing arrow, because it navigates.
     The submit is the blue solid: the form sits in the close, which carries the page's one main
     action (r7-buttons, 8 Oct 2026 — there is no ink solid). */
  const submitButton = (
    <Button type="submit" emphasis="solid" tone="primary" size="md" busy={submitting}>
      {submitLabel}
    </Button>
  );

  const scheduleLink = props.scheduleHref ? (
    <Button
      as="a"
      href={props.scheduleHref}
      emphasis="ghost"
      tone="primary"
      size="md"
      icon={<Icon name="arrow-right" />}
    >
      See available times
    </Button>
  ) : null;

  /* The caption line, led by a blue mark. The mark is the clock at rest — the sentence is a
     promise about time — and the danger triangle when the line has become an error. The
     paragraph is the live region, so the status is announced where the reassurance sat. */
  const error = lifecycle === 'error' || (lifecycle === 'invalid' && invalidCount > 0);
  const captionLine = (
    <Cluster nowrap colGap="tight" align="start" className={styles.note}>
      <span className={cx(styles.noteMark, error && styles.statusError)}>
        <Icon name={error ? 'danger-triangle' : 'clock-circle'} />
      </span>
      <p
        className={cx(styles.noteText, error && styles.statusError)}
        id={statusId}
        role="status"
        aria-live="polite"
      >
        {status || (props.caption?.trim() ? props.caption : CAPTION)}
      </p>
    </Cluster>
  );

  /* The action row's three shapes.

       full     the submit across the track (a one-track Layout stretches it), the scheduling link
                under it, then the line — every row at `text`.
       compact  the submit and ONE line beside it: the caption at rest, the status once there is
                one, in the same live region. The row WRAPS: the line asks for at least
                --enq-note-min-inline beside the submit, and in a track that cannot give it that (a
                phone column, a 392 card track) it drops under the submit at `text` and takes the
                whole width, rather than wrapping to three ragged lines beside a 48px button.
       enquiry  the submit and the scheduling link in ONE row — two ways to take the same next
                step, so they group, at `block`; wrapped on a narrow column the link drops under
                the submit at `block` too, as CtaSection's and CtaRow's action rows do (cmp-cta
                final fix round: at `tight` the two stacked ~12 apart at 390 while the K offer
                beside them stacked ~30 — one stacked-action gap in every variant). The line under
                them at `text`. Both lg (48, clears the touch floor). */
  const actions =
    props.submit === 'full' ? (
      <Layout rowGap="text">
        {submitButton}
        {scheduleLink}
        {captionLine}
      </Layout>
    ) : variant === 'compact' ? (
      <Cluster colGap="block" rowGap="text" align="center">
        {submitButton}
        {captionLine}
      </Cluster>
    ) : (
      <Layout rowGap="text">
        <Cluster rowGap="block" colGap="block" align="center">
          {submitButton}
          {scheduleLink}
        </Cluster>
        {captionLine}
      </Layout>
    );

  /* The context that makes a submission attributable: hidden, not focusable, not announced. */
  const hiddenContext =
    props.variant === 'contact' ? null : (
      <>
        <input type="hidden" name="origin_route" value={props.context.originRoute} />
        <input type="hidden" name="placement" value={props.context.placement} />
        <input type="hidden" name="family" value={props.context.family} />
        <input type="hidden" name="service_or_audit" value={props.context.serviceOrAudit} />
        <input type="hidden" name="referrer" value={props.context.referrer} />
        <input type="hidden" name="campaign" value={props.context.campaign} />
        {props.variant === 'audit' ? (
          <input type="hidden" name="intent" value={props.context.intent} />
        ) : null}
      </>
    );

  /* ── The dressed forms (see EnquiryDress) ─────────────────────────────────────────────────── */
  if (dress) {
    const noteId = idFor('note');
    const formAttrs = {
      className: cx(styles.form, bounds),
      action: props.action,
      method: 'post',
      noValidate: true,
      'aria-label': 'Send an enquiry',
      'aria-busy': submitting || undefined,
      onSubmit: handleSubmit,
      onInput: (event: FormEvent<HTMLFormElement>) => saveDraft(event.currentTarget),
      ref: formRef,
    } as const;
    /* The foot's one line: "or write to …" and the note at rest; the status of a send replaces it,
       in the same live region the plain set uses. */
    const writeTo = dress.kind === 'choice' ? undefined : dress.writeTo;
    const restLine = (
      <>
        {writeTo ? (
          <>
            or write to <a href={`mailto:${writeTo}`}>{writeTo}</a>
          </>
        ) : null}
        {dress.kind === 'card' && dress.note
          ? writeTo
            ? ` · ${dress.note}`
            : dress.note
          : null}
      </>
    );
    const line = (
      <p
        className={cx(styles.dressLine, error && styles.statusError)}
        id={statusId}
        role="status"
        aria-live="polite"
      >
        {status || restLine}
      </p>
    );
    const email = FIELD.email('email');
    const name = FIELD.name('name');

    /* The message field's example: the latest picked need's own follow-up question, else the
       dress's prompt. */
    const needs = dress.kind === 'card' ? undefined : dress.needs;
    const pickedPrompt = [...picked]
      .reverse()
      .map((value) => needs?.options.find((option) => option.value === value)?.prompt)
      .find(Boolean);

    if (dress.kind === 'choice') {
      /* The reply line says the picks back as one sentence — "Product design and AI product UX,
         for a prototype. We reply within one business day." — then the promise. A send's status
         replaces the whole line, in the same live region. */
      const chosen = dress.needs.options
        .filter((option) => picked.includes(option.value))
        .map((option) => option.echo ?? option.label);
      const stage = dress.stage?.options.find((option) => option.value === stageValue);
      const stageWords = stage ? (stage.echo ?? stage.label) : undefined;
      const promise = dress.reply ?? (props.caption?.trim() ? props.caption : CAPTION);
      const echo =
        chosen.length > 0 || stageWords ? (
          <>
            {chosen.length > 0 ? (
              <strong className={styles.echoPick}>{listOf(chosen)}</strong>
            ) : null}
            {stageWords ? (
              <>
                {chosen.length > 0 ? ', for ' : 'For '}
                <strong className={styles.echoPick}>{stageWords}</strong>
              </>
            ) : null}
            {`. ${promise}`}
          </>
        ) : (
          promise
        );

      /* Two halves under one hairline split, then a foot across both (owner, 19 Oct 2026).

           halves  [1, 1] from 1024, a `gutter` apart, with the chip half's own `gutter` inset after
                   its hairline: 64 between the two, the `column` step two peer halves of one form
                   take, with the rule at its middle. The chip half comes first in the DOM, so a
                   phone reads the chips, then the fields; `reverse` sets the fields at the start
                   from 1024. The fields half is stretched to the chip half's height and its message
                   takes the rest (`fillLast`, FieldGroup `fill`), so both halves end on one line.
           foot    under a hairline: the reply line at the start, the send at its own width at the
                   end, from 1024; below, the send across the panel and the line under it. */
      return (
        <form {...formAttrs}>
          <Layout rowGap="block">
            <Layout
              columns={{ lg: [1, 1] }}
              reverse={{ lg: true }}
              colGap="gutter"
              rowGap="block"
            >
              <div className={styles.choiceSide}>
                <Layout rowGap="block">
                  {renderChoiceGroup(dress.needs, 'needs')}
                  {dress.stage ? renderChoiceGroup(dress.stage, 'stage') : null}
                  {renderDressedUrl('fill', true, 'https://')}
                </Layout>
              </div>
              <Layout rowGap="text" fillLast>
                <Layout columns="fit" minTrack="xs" colGap="text" rowGap="text">
                  {renderField(name, {
                    visibleLabel: true,
                    placeholder: 'Your name',
                    look: 'fill',
                  })}
                  {renderField(email, {
                    visibleLabel: true,
                    placeholder: 'you@company.com',
                    look: 'fill',
                  })}
                </Layout>
                {renderField(FIELD.work, {
                  visibleLabel: true,
                  placeholder: pickedPrompt ?? dress.prompt ?? FIELD.work.label,
                  look: 'fill',
                  fill: true,
                })}
              </Layout>
            </Layout>
            <div className={styles.dressFoot}>
              <Layout
                columns={{ lg: ['auto', 1] }}
                reverse={{ lg: true }}
                colGap="block"
                rowGap="text"
                align="center"
              >
                {/* With a scheduling link the two asks group, as on the card; alone, the send
                    stretches across the panel below 1024. */}
                {scheduleLink ? (
                  <Cluster colGap="block" rowGap="text" align="center">
                    {submitButton}
                    {scheduleLink}
                  </Cluster>
                ) : (
                  submitButton
                )}
                <p
                  className={cx(styles.echo, error && styles.statusError)}
                  id={statusId}
                  role="status"
                  aria-live="polite"
                >
                  {status || echo}
                </p>
              </Layout>
            </div>
          </Layout>
          {hiddenContext}
        </form>
      );
    }

    if (dress.kind === 'card') {
      /* The promise beside the send, and the live region a send's status takes over. */
      const reply = (
        /* A div, not a p: the promise is a Cluster (a div), which a paragraph cannot contain. */
        <div
          className={cx(styles.dressReply, error && styles.statusError)}
          id={statusId}
          role="status"
          aria-live="polite"
        >
          {status ? (
            status
          ) : dress.reply ? (
            <Cluster nowrap colGap="tight" align="center">
              <span className={styles.dressReplyMark}>
                <Icon name="bolt-circle" />
              </span>
              <span className={styles.dressReplyText}>{dress.reply}</span>
            </Cluster>
          ) : null}
        </div>
      );
      const after = dress.writeTo || dress.note;
      return (
        <form {...formAttrs}>
          <Layout rowGap="block">
            <Layout rowGap="text">
              {renderField(email, { visibleLabel: true, placeholder: null, look: 'fill' })}
              {renderField(FIELD.work, { visibleLabel: true, placeholder: null, look: 'fill' })}
              {renderDressedUrl('fill', true)}
            </Layout>
            <div className={styles.dressFoot}>
              <Layout rowGap="text">
                <Cluster colGap="block" rowGap="text" align="center">
                  {submitButton}
                  {scheduleLink}
                  {reply}
                </Cluster>
                {after ? <p className={styles.dressLine}>{restLine}</p> : null}
              </Layout>
            </div>
          </Layout>
          {hiddenContext}
        </form>
      );
    }

    return (
      <form {...formAttrs}>
        <Layout rowGap="block">
          <Cluster nowrap colGap="text" align="start">
            {/* Decorative: the name beside it says who this is. */}
            <img
              className={styles.portrait}
              src={dress.from.portrait}
              alt=""
              width={88}
              height={88}
              loading="lazy"
              decoding="async"
            />
            <Layout rowGap="tight">
              <Cluster colGap="tight" align="baseline">
                <span className={styles.fromName}>{dress.from.name}</span>
                <span className={styles.fromRole}>{dress.from.role}</span>
              </Cluster>
              <p className={styles.bubble} id={noteId}>
                {dress.note}
              </p>
            </Layout>
          </Cluster>
          {/* The note answered first: the chips under the bubble, set in to the bubble's edge from
              768 and flush on a phone. The bubble asks the question, so it describes the group. */}
          {dress.needs ? (
            <div className={styles.replies}>
              {renderChoiceGroup(dress.needs, 'needs', { shown: false, describedBy: noteId })}
            </div>
          ) : null}
          <div className={styles.composer}>
            <div className={styles.composerMain}>
              {renderField(FIELD.work, {
                placeholder:
                  pickedPrompt ??
                  (dress.prompt ? `${FIELD.work.label} ${dress.prompt}` : FIELD.work.label),
                look: 'bare',
              })}
            </div>
            {/* Name · Email · Link (19 Oct 2026: the name is required). Three across where the
                composer is the full column (768–1023) or the wide panel (1440); one per row in
                the island’s narrower form track between, where three would leave each ~85. The
                email cell is the widest (4 : 5 : 4): its cue is the longest. */}
            <Layout columns={{ base: 1, md: [4, 5, 4], lg: 1, xl: [4, 5, 4] }}>
              <div className={styles.composerCell}>
                <Layout rowGap="inline">
                  <span className={styles.composerKey} aria-hidden="true">
                    Your name
                  </span>
                  {renderField(name, { placeholder: 'Name', look: 'bare' })}
                </Layout>
              </div>
              <div className={styles.composerCell}>
                <Layout rowGap="inline">
                  <span className={styles.composerKey} aria-hidden="true">
                    Your email
                  </span>
                  {renderField(email, { placeholder: 'you@company.com', look: 'bare' })}
                </Layout>
              </div>
              <div className={styles.composerCell}>
                <Layout rowGap="inline">
                  <span className={styles.composerKey} aria-hidden="true">
                    Link · optional
                  </span>
                  {renderDressedUrl('bare', false, 'https://')}
                </Layout>
              </div>
            </Layout>
            <div className={styles.composerFoot}>
              <Cluster justify="between" align="center" colGap="block" rowGap="text">
                {line}
                {submitButton}
              </Cluster>
            </div>
          </div>
        </Layout>
        {hiddenContext}
      </form>
    );
  }

  return (
    <form
      className={cx(styles.form, bounds)}
      action={props.action}
      method="post"
      noValidate
      aria-label={
        variant === 'audit'
          ? 'Request a free audit'
          : variant === 'contact'
            ? 'Contact Tcules'
            : 'Send an enquiry'
      }
      aria-busy={submitting || undefined}
      onSubmit={handleSubmit}
      onInput={(event) => saveDraft(event.currentTarget)}
      ref={formRef}
    >
      {/* Compact by nesting (r7-form): the fields are one group at `text` — with no labels and no
          reserved message lines, field to field is the 16 between two controls — and the actions
          sit a `block` below that group, so the submit reads as the end of the form and not as one
          more field. A message, when there is one, opens its own `tight` under its field. */}
      <Layout rowGap="block">
        <Layout rowGap="text">{rows.map(renderRow)}</Layout>
        {actions}
      </Layout>

      {hiddenContext}
    </form>
  );
}
