type VisitAttribution = {
  landingPage: string;
  referrer: string;
  campaign: string;
};

const STORAGE_KEY = 'tcules:hubspot-visit';
let currentVisit: VisitAttribution | undefined;

/** Capture the landing URL before client navigation replaces it. Storage may be unavailable. */
export function captureHubSpotVisit(): VisitAttribution {
  if (currentVisit) return currentVisit;
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    if (
      stored &&
      typeof stored === 'object' &&
      'landingPage' in stored &&
      typeof stored.landingPage === 'string' &&
      'referrer' in stored &&
      typeof stored.referrer === 'string' &&
      'campaign' in stored &&
      typeof stored.campaign === 'string'
    ) {
      currentVisit = stored as VisitAttribution;
      return currentVisit;
    }
  } catch {
    // Keep attribution in memory when the browser blocks sessionStorage.
  }

  const landing = new URL(window.location.href);
  landing.hash = '';
  const campaign = new URLSearchParams();
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const value = landing.searchParams.get(key);
    if (value) campaign.set(key, value);
  }
  let referrer = '';
  try {
    const url = new URL(document.referrer);
    const host = (value: string) => value.toLowerCase().replace(/^www\./u, '');
    if (/^https?:$/u.test(url.protocol) && host(url.hostname) !== host(landing.hostname)) {
      url.hash = '';
      referrer = url.href;
    }
  } catch {
    // Direct visits have no referrer.
  }
  currentVisit = { landingPage: landing.href, referrer, campaign: campaign.toString() };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentVisit));
  } catch {
    // Attribution must never prevent a form submission.
  }
  return currentVisit;
}

export function appendHubSpotAttribution(body: FormData) {
  if (document.body.dataset.trackingEnabled !== 'true') return;
  const visit = captureHubSpotVisit();
  body.set('tcules_landing_page', visit.landingPage);
  body.set('tcules_referrer', visit.referrer);
  body.set('tcules_utm_campaign', visit.campaign);
  body.set('hubspot_page_uri', window.location.href);
  body.set('hubspot_page_name', document.title);
}
