import type { ContactFormSubmission } from '@/content';
import { SITE_ORIGIN } from '@/lib/routes';

const ENDPOINT =
  'https://api.hsforms.com/submissions/v3/integration/submit/9387720/41f4177f-a64c-49d8-a1fc-2bbbf6b1cdee';

function value(form: FormData, name: string, limit = 2048): string {
  const item = form.get(name);
  return typeof item === 'string' ? item.trim().slice(0, limit) : '';
}

function httpUrl(input: string): URL | undefined {
  try {
    const url = new URL(input);
    if (/^https?:$/u.test(url.protocol) && !url.username && !url.password) return url;
  } catch {
    return;
  }
}

/** Best-effort delivery after Strapi succeeds. Never log enquiry data, cookies or tokens. */
export async function sendHubSpotEnquiry(
  request: Request,
  form: FormData,
  kind: 'contact' | 'enquiry' | 'newsletter',
  submission: ContactFormSubmission,
  documentId: string,
) {
  if (process.env.RAILWAY_ENVIRONMENT_NAME !== 'live' || kind === 'newsletter') return;
  const originRoute = value(form, 'origin_route');
  if (
    [submission.destinationPage, originRoute].some((path) =>
      /^\/careers(?:\/|$)/u.test(path),
    ) ||
    value(form, 'family') === 'careers' ||
    value(form, 'placement') === 'application'
  )
    return;

  try {
    const fields: { objectTypeId: string; name: string; value: string }[] = [];
    const add = (name: string, field: string | undefined) => {
      if (field) fields.push({ objectTypeId: '0-1', name, value: field });
    };
    const [firstName, ...lastName] = submission.clientName?.trim().split(/\s+/u) ?? [];
    add('email', submission.clientEmail);
    add('firstname', firstName);
    add('lastname', lastName.join(' '));
    add('company', submission.clientCompany);
    add('message', submission.clientComments);
    add(
      'tcules_origin_route',
      /^\/(?![\/\\])[^?#\\\s]*$/u.test(originRoute) ? originRoute : submission.destinationPage,
    );
    add('tcules_placement', value(form, 'placement', 256));
    const landing = httpUrl(value(form, 'tcules_landing_page'));
    add('tcules_landing_page', landing?.href);
    const referrer = httpUrl(value(form, 'tcules_referrer'));
    const site = new URL(request.url);
    const publicSite = new URL(SITE_ORIGIN);
    const host = (name: string) => name.toLowerCase().replace(/^www\./u, '');
    if (
      referrer &&
      ![site.hostname, publicSite.hostname].some(
        (name) => host(referrer.hostname) === host(name),
      )
    ) {
      add('tcules_referrer', referrer.href);
    }
    add('tcules_utm_campaign', value(form, 'tcules_utm_campaign'));
    add('tcules_lead_source', 'Website');

    const page = httpUrl(value(form, 'hubspot_page_uri'));
    const context: { hutk?: string; pageUri: string; pageName?: string } = {
      pageUri:
        page && [site.origin, publicSite.origin].includes(page.origin)
          ? page.href
          : new URL(submission.destinationPage, publicSite.origin).href,
      pageName: value(form, 'hubspot_page_name', 512) || undefined,
    };
    const cookie = request.headers
      .get('cookie')
      ?.match(/(?:^|;\s*)hubspotutk=([a-f0-9]{32})(?:;|$)/iu);
    if (cookie?.[1]) context.hutk = cookie[1];

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields, context }),
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      console.error('[HubSpot] Enquiry delivery failed', {
        documentId,
        status: response.status,
      });
    }
  } catch (error) {
    console.error('[HubSpot] Enquiry delivery failed', {
      documentId,
      reason: error instanceof Error ? error.name : 'UnknownError',
    });
  }
}
