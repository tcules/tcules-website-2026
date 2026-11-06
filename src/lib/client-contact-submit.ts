import { ENDPOINTS } from './routes';

type OpenAiPixel = (
  command: 'measure',
  event: 'lead_created',
  properties: { type: 'customer_action' },
) => void;

function trackLead(body: FormData) {
  if (document.body.dataset.trackingEnabled !== 'true') return;

  try {
    const oaiq = (window as Window & { oaiq?: OpenAiPixel }).oaiq;
    if (typeof oaiq === 'function')
      oaiq('measure', 'lead_created', { type: 'customer_action' });
  } catch {
    // Pixel failures must not prevent GTM from receiving the success event.
  }

  const original = window.location.href;
  const attributed = new URL(original);
  for (const field of ['origin_route', 'placement']) {
    const value =
      field === 'origin_route'
        ? body.get(field) || body.get('destination_page')
        : body.get(field);
    if (!attributed.searchParams.has(field) && typeof value === 'string' && value) {
      attributed.searchParams.set(field, value);
    }
  }

  // The existing GTM listener reads the query string synchronously during the event.
  const state = window.history.state;
  try {
    if (attributed.href !== original) window.history.replaceState(state, '', attributed.href);
  } catch {
    // Send the event with the current URL if history is unavailable.
  }
  try {
    window.dispatchEvent(new CustomEvent('tcules:client-contact-success'));
  } finally {
    if (attributed.href !== original && window.location.href === attributed.href) {
      window.history.replaceState(state, '', original);
    }
  }
}

/** The server maps the form's original fields and verifies the one-time token. */
export async function submitProtectedForm(
  body: FormData,
  kind: 'contact' | 'enquiry',
  token: string,
) {
  body.set('formKind', kind);
  body.set('turnstileToken', token);
  const response = await fetch(ENDPOINTS.clientContact, { method: 'POST', body });
  if (response.ok) {
    try {
      trackLead(body);
    } catch {
      // Tracking must not change the result of a successful submission.
    }
    return { ok: true };
  }

  const result = (await response.json().catch(() => null)) as {
    code?: string;
    error?: string;
  } | null;
  return {
    ok: false,
    verificationError: result?.code === 'turnstile' ? result.error : undefined,
  };
}
