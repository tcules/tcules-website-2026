/**
 * The enquiry journey's analytics events (docs/specs/EnquiryForms.md § 6), pushed to the Tag Manager
 * data layer.
 *
 * Every event carries names and IDs only: what a reader types stays in the form. The push happens on
 * every environment, so a staging review can read `window.dataLayer` in the console; Tag Manager
 * itself loads only on live (app/layout.tsx), after the page is ready (lib/tracking-start), and reads
 * whatever was queued before it arrived. Which of these become GA4 events or conversions is set in
 * the Tag Manager container, not here.
 */

/** What a form is for. It decides the conversion event and, from step 2, where a submission goes. */
export type FormType = 'sales' | 'careers' | 'privacy';

type EventParams = {
  cta_click: {
    cta_id: string;
    placement: string;
    page: string;
    destination: 'inline' | 'contact';
    band?: string;
  };
  form_view: { form_type: FormType; page: string; trigger: 'cta' | 'scroll' };
  form_start: { form_type: FormType; field_name: string };
  form_submit_attempt: { form_type: FormType };
  form_validation_error: { form_type: FormType; field_names: string[] };
  submission_accepted: AcceptedParams;
  generate_lead: AcceptedParams;
  application_submitted: AcceptedParams;
};

type AcceptedParams = {
  form_type: FormType;
  page: string;
  placement: string;
  /** The button pressed to reach the form; absent when the reader scrolled to it. */
  cta_id?: string;
};

export type AnalyticsEvent = keyof EventParams;

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

/** Push one event. Never throws: analytics must not change what the page does. */
export function track<E extends AnalyticsEvent>(event: E, params: EventParams[E]) {
  if (typeof window === 'undefined') return;
  try {
    const w = window as DataLayerWindow;
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event, ...params });
    if (process.env.NODE_ENV === 'development') console.debug('[analytics]', event, params);
  } catch {
    /* A frozen or replaced dataLayer: the page carries on without the event. */
  }
}

/* The last ask pressed, so a form that comes into view straight after one says it was reached by
   the button rather than by scrolling. */
const CTA_WINDOW_MS = 10_000;
let lastCtaAt = 0;

/** Note that an ask leading to a form was pressed just now. */
export function noteCtaPress() {
  lastCtaAt = Date.now();
}

/** Whether an ask was pressed in the last few seconds. */
export function pressedCtaRecently(): boolean {
  return Date.now() - lastCtaAt < CTA_WINDOW_MS;
}

/** The conversion event a type fires beside `submission_accepted`, if it has one. */
export function conversionFor(formType: FormType): 'generate_lead' | 'application_submitted' | null {
  return formType === 'sales'
    ? 'generate_lead'
    : formType === 'careers'
      ? 'application_submitted'
      : null;
}
