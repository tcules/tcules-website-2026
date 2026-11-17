import { createClientContact, type ContactFormSubmission } from '@/content';
import { ROUTES } from '@/lib/routes';

import { verifyTurnstile } from './_turnstile';
import { sendHubSpotEnquiry } from './_hubspot';

type FormKind = 'contact' | 'enquiry' | 'newsletter';

function text(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function pagePath(value: string): string | undefined {
  return /^\/(?![\/\\])[^?#\\\s]*$/u.test(value) ? value : undefined;
}

function referringPage(request: Request): string | undefined {
  const referrer = request.headers.get('referer');
  if (!referrer) return;
  try {
    const url = new URL(referrer);
    if (url.origin === new URL(request.url).origin) return pagePath(url.pathname);
  } catch {
    return;
  }
}

function validWebsite(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function error(message: string, status = 400) {
  return Response.json(
    { ok: false, error: message },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function submitClientContact(request: Request, endpointKind?: FormKind) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error('The form could not be read.');
  }

  const get = (name: string) => text(form.get(name));
  const postedKind = get('formKind');
  const kind =
    endpointKind ??
    (postedKind === 'contact' || postedKind === 'enquiry' ? postedKind : undefined);
  if (!kind) return error('Unknown form.');
  const contact = kind === 'contact';
  const clientEmail = get(contact ? 'clientEmail' : 'email');
  if (
    contact &&
    ![
      clientEmail,
      get('clientName'),
      get('clientCompany'),
      get('clientContact'),
      get('clientComments'),
    ].every(Boolean)
  ) {
    return error('All contact fields are required.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(clientEmail)) {
    return error('Enter a valid email address.');
  }

  let submission: ContactFormSubmission;
  if (kind === 'newsletter') {
    submission = {
      clientEmail,
      destinationPage: '#footer',
      clientComments: 'Newsletter subscription request',
    };
  } else {
    const destinationPage =
      pagePath(get('destination_page')) ??
      referringPage(request) ??
      pagePath(get('origin_route')) ??
      (contact ? ROUTES.contact : undefined);
    if (!destinationPage) return error('The enquiry destination could not be determined.');

    const clientName = get(contact ? 'clientName' : 'name');
    const clientCompany = get('clientCompany');
    const clientContact = get('clientContact');
    const clientWebsite = get('url');
    const message = get(contact ? 'clientComments' : 'what_are_you_working_on');
    const application = !contact && destinationPage === ROUTES.careers;
    if ((form.has('name') && !clientName) || (!message && !(application && clientWebsite))) {
      return error('Complete the required enquiry fields.');
    }
    if (clientWebsite && !validWebsite(clientWebsite))
      return error('Enter a valid website URL.');

    const needs = [...new Set(form.getAll('needs').map(text).filter(Boolean))];
    const serviceContext = /^\/(services|audits)\/.+/u.test(destinationPage)
      ? get('service_or_audit')
      : '';
    const stage = get('stage');
    const role = get('role');
    submission = {
      clientName: clientName || undefined,
      clientEmail,
      destinationPage,
      clientComments: [
        message || `Proof of work: ${clientWebsite}`,
        stage && `Stage: ${stage}`,
        role && `Role: ${role}`,
      ]
        .filter(Boolean)
        .join('\n\n'),
      clientCompany: clientCompany || undefined,
      clientContact: clientContact || undefined,
      clientWebsite: clientWebsite || undefined,
      services: needs.join(', ') || serviceContext || undefined,
    };
  }

  if (kind !== 'newsletter') {
    const verification = await verifyTurnstile(get('turnstileToken'));
    if (verification !== 'verified') {
      const unavailable = verification === 'unavailable';
      return Response.json(
        {
          ok: false,
          code: 'turnstile',
          error: unavailable
            ? 'Verification is unavailable. Please try again later.'
            : 'Verification failed. Please try again.',
        },
        { status: unavailable ? 503 : 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }
  }

  try {
    const { documentId } = await createClientContact(submission);
    await sendHubSpotEnquiry(request, form, kind, submission, documentId);
    return Response.json(
      { ok: true, documentId },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return error(
      kind === 'newsletter'
        ? 'The subscription could not be submitted.'
        : 'The contact request could not be submitted.',
      502,
    );
  }
}
