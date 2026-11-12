import test from 'node:test';
import assert from 'node:assert/strict';

import modules from './helpers/cms-module.mjs';

const FORM =
  'https://api.hsforms.com/submissions/v3/integration/submit/9387720/41f4177f-a64c-49d8-a1fc-2bbbf6b1cdee';
const COOKIE = '0123456789abcdef0123456789abcdef';

function harness(t, options = {}) {
  const env = { ...process.env };
  const originalFetch = global.fetch;
  const originalError = console.error;
  t.after(() => {
    process.env = env;
    global.fetch = originalFetch;
    console.error = originalError;
  });
  process.env.RAILWAY_ENVIRONMENT_NAME = options.environment ?? 'live';
  process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  process.env.TURNSTILE_EXPECTED_HOSTNAME = 'www.tcules.com';
  const events = [];
  const payloads = [];
  const saved = [];
  const errors = [];
  console.error = (...args) => errors.push(args);
  global.fetch = async (url, init) => {
    if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
      events.push('verify');
      return Response.json({ success: options.verified !== false, hostname: 'www.tcules.com' });
    }
    assert.equal(url, FORM, 'only the configured HubSpot endpoint may be called');
    assert.equal(init.cache, 'no-store');
    assert.ok(init.signal);
    events.push('hubspot');
    payloads.push(JSON.parse(init.body));
    if (options.networkFailure) throw new TypeError('Network unavailable');
    return Response.json({}, { status: options.hubspotStatus ?? 200 });
  };
  const load = modules({
    '@/content': {
      createClientContact: async (submission) => {
        events.push('strapi');
        if (options.cmsFailure) throw new Error('CMS unavailable');
        saved.push(submission);
        return { documentId: 'saved-document' };
      },
    },
  });
  const { submitClientContact } = load('src/app/api/_client-contact.ts');
  const send = (overrides = {}, kind = 'enquiry', cookie = COOKIE) => {
    const body = new FormData();
    for (const [key, value] of Object.entries({
      name: 'Ada Byron Lovelace',
      email: 'ada@example.com',
      what_are_you_working_on: 'A product audit',
      destination_page: '/audits/ux-product-audit',
      origin_route: '/services/product-design',
      placement: 'corpus-close',
      turnstileToken: 'test-token',
      tcules_landing_page: 'https://www.tcules.com/services?utm_source=google',
      tcules_referrer: 'https://www.google.com/',
      tcules_utm_campaign: 'utm_source=google&utm_medium=cpc&utm_campaign=design',
      hubspot_page_uri: 'https://www.tcules.com/audits/ux-product-audit',
      hubspot_page_name: 'UX product audit',
      ...overrides,
    }))
      if (value !== null) body.set(key, value);
    return submitClientContact(
      new Request(options.requestUrl ?? 'https://www.tcules.com/api/client-contact', {
        method: 'POST',
        headers: cookie ? { Cookie: `other=value; hubspotutk=${cookie}; another=value` } : {},
        body,
      }),
      kind,
    );
  };
  return { send, events, payloads, saved, errors };
}

const fields = (payload) =>
  Object.fromEntries(payload.fields.map(({ name, value }) => [name, value]));

test('verified enquiries save to Strapi first, then send one attributed HubSpot submission', async (t) => {
  const h = harness(t);
  const response = await h.send();
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true, documentId: 'saved-document' });
  assert.deepEqual(h.events, ['verify', 'strapi', 'hubspot']);
  assert.equal(h.payloads.length, 1);
  assert.deepEqual(fields(h.payloads[0]), {
    email: 'ada@example.com',
    firstname: 'Ada',
    lastname: 'Byron Lovelace',
    message: 'A product audit',
    tcules_origin_route: '/services/product-design',
    tcules_placement: 'corpus-close',
    tcules_landing_page: 'https://www.tcules.com/services?utm_source=google',
    tcules_referrer: 'https://www.google.com/',
    tcules_utm_campaign: 'utm_source=google&utm_medium=cpc&utm_campaign=design',
    tcules_lead_source: 'Website',
  });
  assert.deepEqual(h.payloads[0].context, {
    hutk: COOKIE,
    pageUri: 'https://www.tcules.com/audits/ux-product-audit',
    pageName: 'UX product audit',
  });
  assert.ok(
    !('tcules_landing_page' in h.saved[0]),
    'analytics data must not change the CMS payload',
  );
});

test('contact-page field names, company and message map without inventing a surname', async (t) => {
  const h = harness(t);
  assert.equal(
    (
      await h.send(
        {
          clientName: 'Ada',
          clientEmail: 'ada@example.com',
          clientCompany: 'Example Ltd',
          clientContact: '+1 555 0100',
          clientComments: 'Contact request',
          destination_page: '/contact',
        },
        'contact',
      )
    ).status,
    201,
  );
  const data = fields(h.payloads[0]);
  assert.equal(data.firstname, 'Ada');
  assert.equal(data.lastname, undefined);
  assert.equal(data.company, 'Example Ltd');
  assert.equal(data.message, 'Contact request');
});

test('email-only enquiry variants omit absent optional names and cookie', async (t) => {
  const h = harness(t);
  assert.equal((await h.send({ name: null }, 'enquiry', '')).status, 201);
  assert.equal(fields(h.payloads[0]).firstname, undefined);
  assert.equal(fields(h.payloads[0]).lastname, undefined);
  assert.equal(h.payloads[0].context.hutk, undefined);
});

test('careers, application placements and newsletter remain Strapi-only', async (t) => {
  const h = harness(t);
  for (const data of [
    { destination_page: '/careers' },
    { destination_page: '/careers/designer' },
    { origin_route: '/careers' },
    { family: 'careers' },
    { placement: 'application' },
  ])
    assert.equal((await h.send(data)).status, 201);
  assert.equal((await h.send({}, 'newsletter')).status, 201);
  assert.equal(h.saved.length, 6);
  assert.equal(h.payloads.length, 0);
  assert.equal(h.saved.at(-1).destinationPage, '#footer');
});

test('preview environments never deliver production HubSpot enquiries', async (t) => {
  const h = harness(t, { environment: 'production' });
  assert.equal((await h.send()).status, 201);
  assert.deepEqual(h.events, ['verify', 'strapi']);
});

test('invalid input and failed Turnstile cannot save or deliver enquiries', async (t) => {
  const h = harness(t, { verified: false });
  assert.equal((await h.send({ email: 'invalid' })).status, 400);
  assert.equal((await h.send({ turnstileToken: '' })).status, 400);
  assert.equal((await h.send()).status, 400);
  assert.equal(h.saved.length, 0);
  assert.equal(h.payloads.length, 0);
});

test('failed Strapi writes never reach HubSpot', async (t) => {
  const h = harness(t, { cmsFailure: true });
  assert.equal((await h.send()).status, 502);
  assert.deepEqual(h.events, ['verify', 'strapi']);
});

for (const failure of [{ hubspotStatus: 503 }, { networkFailure: true }]) {
  test(`HubSpot ${failure.hubspotStatus ?? 'network failure'} preserves successful saved enquiry`, async (t) => {
    const h = harness(t, failure);
    assert.equal((await h.send()).status, 201);
    assert.equal(h.saved.length, 1);
    assert.equal(h.payloads.length, 1, 'no retries that could duplicate contacts');
    assert.equal(h.errors.length, 1);
    assert.ok(!JSON.stringify(h.errors).includes('ada@example.com'));
    assert.ok(!JSON.stringify(h.errors).includes(COOKIE));
  });
}

test('internal referrers, invalid cookies and foreign page contexts are not forwarded', async (t) => {
  const h = harness(t);
  await h.send(
    {
      origin_route: '//foreign.test',
      tcules_referrer: 'https://tcules.com/contact',
      tcules_landing_page: 'javascript:alert(1)',
      hubspot_page_uri: 'https://foreign.test/',
    },
    'enquiry',
    'invalid',
  );
  const data = fields(h.payloads[0]);
  assert.equal(data.tcules_origin_route, '/audits/ux-product-audit');
  assert.equal(data.tcules_referrer, undefined);
  assert.equal(data.tcules_landing_page, undefined);
  assert.equal(h.payloads[0].context.hutk, undefined);
  assert.equal(h.payloads[0].context.pageUri, 'https://www.tcules.com/audits/ux-product-audit');
});

test('reverse-proxy request origins preserve the public page URL and reject internal referrers', async (t) => {
  const h = harness(t, { requestUrl: 'http://localhost:3000/api/client-contact' });
  await h.send({ tcules_referrer: 'https://www.tcules.com/services' });
  assert.equal(h.payloads[0].context.pageUri, 'https://www.tcules.com/audits/ux-product-audit');
  assert.equal(fields(h.payloads[0]).tcules_referrer, undefined);
});

function browser(
  t,
  { referrer = 'https://www.google.com/search?q=design', blocked = false } = {},
) {
  const originals = new Map(
    ['window', 'document', 'sessionStorage'].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(global, key),
    ]),
  );
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(global, key, descriptor);
      else delete global[key];
    }
  });
  const entries = new Map();
  global.window = {
    location: {
      href: 'https://www.tcules.com/services?utm_source=google&utm_medium=cpc&utm_campaign=launch',
    },
  };
  global.document = {
    referrer,
    title: 'Services',
    body: { dataset: { trackingEnabled: 'true' } },
  };
  global.sessionStorage = {
    getItem: (key) => {
      if (blocked) throw new Error('Storage blocked');
      return entries.get(key) ?? null;
    },
    setItem: (key, value) => {
      if (blocked) throw new Error('Storage blocked');
      entries.set(key, value);
    },
  };
  return modules();
}

test('landing attribution survives route navigation and reload while submission context stays current', (t) => {
  const load = browser(t);
  const { captureHubSpotVisit, appendHubSpotAttribution } = load(
    'src/lib/hubspot-attribution.ts',
  );
  captureHubSpotVisit();
  window.location.href = 'https://www.tcules.com/contact';
  document.title = 'Contact';
  const body = new FormData();
  appendHubSpotAttribution(body);
  assert.equal(
    body.get('tcules_landing_page'),
    'https://www.tcules.com/services?utm_source=google&utm_medium=cpc&utm_campaign=launch',
  );
  assert.equal(body.get('tcules_referrer'), 'https://www.google.com/search?q=design');
  assert.equal(
    body.get('tcules_utm_campaign'),
    'utm_source=google&utm_medium=cpc&utm_campaign=launch',
  );
  assert.equal(body.get('hubspot_page_uri'), 'https://www.tcules.com/contact');
  assert.equal(body.get('hubspot_page_name'), 'Contact');
  const reloaded = modules()('src/lib/hubspot-attribution.ts');
  assert.equal(reloaded.captureHubSpotVisit().landingPage, body.get('tcules_landing_page'));
});

test('blocked storage and internal referrers do not break attribution or submissions', (t) => {
  const load = browser(t, { blocked: true, referrer: 'https://tcules.com/about' });
  const { captureHubSpotVisit, appendHubSpotAttribution } = load(
    'src/lib/hubspot-attribution.ts',
  );
  assert.equal(captureHubSpotVisit().referrer, '');
  window.location.href = 'https://www.tcules.com/contact';
  assert.ok(captureHubSpotVisit().landingPage.includes('/services?'));
  const body = new FormData();
  document.body.dataset.trackingEnabled = undefined;
  appendHubSpotAttribution(body);
  assert.equal([...body].length, 0);
});

test('shared submit helper retains one conversion after success and none after failure', async (t) => {
  const load = browser(t);
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });
  const events = [];
  const pixels = [];
  window.location.href = 'https://www.tcules.com/contact?utm_source=google';
  const originalUrl = window.location.href;
  window.history = {
    state: {},
    replaceState: (_state, _title, url) => {
      window.location.href = url;
    },
  };
  window.oaiq = (...args) => pixels.push(args);
  window.dispatchEvent = (event) =>
    events.push({ type: event.type, url: window.location.href });
  let forwarded;
  global.fetch = async (url, init) => {
    assert.equal(url, '/api/client-contact');
    forwarded = init.body;
    return Response.json({ ok: true }, { status: 201 });
  };
  const { submitProtectedForm } = load('src/lib/client-contact-submit.ts');
  const body = new FormData();
  body.set('origin_route', '/services/product-design');
  body.set('placement', 'corpus-close');
  assert.equal((await submitProtectedForm(body, 'enquiry', 'fresh-token')).ok, true);
  assert.equal(forwarded.get('turnstileToken'), 'fresh-token');
  assert.equal(forwarded.get('hubspot_page_uri'), originalUrl);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'tcules:client-contact-success');
  assert.equal(new URL(events[0].url).searchParams.get('placement'), 'corpus-close');
  assert.equal(window.location.href, originalUrl);
  assert.equal(pixels.length, 1);
  global.fetch = async () =>
    Response.json({ code: 'turnstile', error: 'Verification failed' }, { status: 400 });
  assert.equal((await submitProtectedForm(body, 'enquiry', 'retry-token')).ok, false);
  assert.equal(events.length, 1);
  assert.equal(pixels.length, 1);
});
