import test from 'node:test';
import assert from 'node:assert/strict';

import modules from './helpers/cms-module.mjs';

function harness(t, options = {}) {
  const previous = { ...process.env };
  const originalFetch = global.fetch;
  t.after(() => {
    process.env = previous;
    global.fetch = originalFetch;
  });
  process.env.RAILWAY_ENVIRONMENT_NAME = 'live';
  process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  process.env.TURNSTILE_EXPECTED_HOSTNAME = 'www.tcules.com';
  if (options.missingSecret) delete process.env.TURNSTILE_SECRET_KEY;
  if (options.missingHostname) delete process.env.TURNSTILE_EXPECTED_HOSTNAME;
  const events = [];
  const saved = [];
  const redeemed = new Set();
  global.fetch = async (url, init) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(init.body.get('secret'), 'test-secret');
    assert.equal(init.cache, 'no-store');
    assert.ok(init.signal);
    const token = init.body.get('response');
    events.push('verify');
    if (options.offline) throw new TypeError('Cloudflare unavailable');
    const duplicate = redeemed.has(token);
    redeemed.add(token);
    return Response.json(
      {
        success: !duplicate && !options.rejected,
        hostname: options.hostname ?? 'www.tcules.com',
        'error-codes': duplicate
          ? ['timeout-or-duplicate']
          : options.rejected
            ? ['invalid-input-response']
            : [],
      },
      { status: options.status ?? 200 },
    );
  };
  const load = modules({
    '@/content': {
      createClientContact: async (submission) => {
        events.push('save');
        if (options.cmsFailure) throw new Error('CMS unavailable');
        saved.push(submission);
        return { documentId: 'newsletter-document' };
      },
    },
  });
  const { POST } = load('src/app/api/newsletter/route.ts');
  async function send(token = 'fresh-token', email = 'newsletter@example.com') {
    const body = new FormData();
    body.set('email', email);
    if (token !== null) body.set('turnstileToken', token);
    return POST(new Request('https://www.tcules.com/api/newsletter', { method: 'POST', body }));
  }
  return { events, saved, send };
}

test('live newsletter saves only after verified CAPTCHA, retaining its exact CMS mapping', async (t) => {
  const h = harness(t);
  const response = await h.send();
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true, documentId: 'newsletter-document' });
  assert.deepEqual(h.events, ['verify', 'save']);
  assert.deepEqual(h.saved, [
    {
      clientEmail: 'newsletter@example.com',
      destinationPage: '#footer',
      clientComments: 'Newsletter subscription request',
    },
  ]);
});

test('missing, empty and oversized tokens cannot create a subscription', async (t) => {
  const h = harness(t);
  for (const token of [null, '', 'x'.repeat(2049)]) {
    const response = await h.send(token);
    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, 'turnstile');
  }
  assert.deepEqual(h.events, []);
  assert.deepEqual(h.saved, []);
});

test('invalid CAPTCHA cannot create a subscription', async (t) => {
  const h = harness(t, { rejected: true });
  assert.equal((await h.send()).status, 400);
  assert.deepEqual(h.events, ['verify']);
  assert.deepEqual(h.saved, []);
});

test('hostname mismatch fails closed even when Cloudflare reports success', async (t) => {
  const h = harness(t, { hostname: 'unapproved.example.com' });
  assert.equal((await h.send()).status, 400);
  assert.deepEqual(h.saved, []);
});

test('each request is verified; expired or reused tokens rejected by Cloudflare cannot save again', async (t) => {
  const h = harness(t);
  assert.equal((await h.send('one-time-token')).status, 201);
  assert.equal((await h.send('one-time-token')).status, 400);
  assert.equal(h.saved.length, 1);
  assert.equal((await h.send('new-token')).status, 201);
  assert.deepEqual(h.events, ['verify', 'save', 'verify', 'verify', 'save']);
});

for (const options of [
  { missingSecret: true },
  { missingHostname: true },
  { offline: true },
  { status: 503 },
]) {
  test(`unavailable verification blocks subscription: ${JSON.stringify(options)}`, async (t) => {
    const h = harness(t, options);
    const response = await h.send();
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, 'turnstile');
    assert.deepEqual(h.saved, []);
  });
}

test('email validation runs before CAPTCHA and subscription creation', async (t) => {
  const h = harness(t);
  assert.equal((await h.send('fresh-token', 'invalid')).status, 400);
  assert.deepEqual(h.events, []);
});

test('a failed CMS save remains an error after CAPTCHA success', async (t) => {
  const h = harness(t, { cmsFailure: true });
  assert.equal((await h.send()).status, 502);
  assert.deepEqual(h.events, ['verify', 'save']);
  assert.deepEqual(h.saved, []);
});
