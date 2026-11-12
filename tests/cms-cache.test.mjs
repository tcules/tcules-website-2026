import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import modules from './helpers/cms-module.mjs';

function harness() {
  const entries = new Map();
  const invalidated = [];
  let fail = false;
  const load = modules({
    'next/cache': {
      unstable_cache: (read, key, options) => async () => {
        const id = JSON.stringify(key);
        if (!entries.has(id)) entries.set(id, { value: await read(), tags: options.tags });
        return entries.get(id).value;
      },
      revalidateTag: (tag, profile) => {
        assert.deepEqual(profile, { expire: 0 });
        if (fail) throw new Error('Cache unavailable');
        invalidated.push(tag);
        for (const [key, entry] of entries) if (entry.tags.includes(tag)) entries.delete(key);
      },
    },
  });
  return {
    load,
    invalidated,
    setFailure: (value) => {
      fail = value;
    },
  };
}
const SECRET = 'test-cache-secret-0123456789-abcdef';
const endpoint = (body, secret = SECRET) =>
  new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}` },
    body: JSON.stringify(body),
  });

function environment(t) {
  const env = { ...process.env };
  const originalFetch = global.fetch;
  process.env.NEW_CMS_GRAPHQL_URL = 'http://cms.test/graphql';
  process.env.CMS_REVALIDATION_SECRET = SECRET;
  t.after(() => {
    process.env = env;
    global.fetch = originalFetch;
  });
}

test('all published operations have a cache owner', () => {
  const { CMS_QUERY_MODELS } = harness().load('src/lib/cms/cache-policy.ts');
  const directory = 'src/content/sources/strapi';
  for (const file of readdirSync(directory).filter((file) => file.endsWith('.ts'))) {
    for (const [, operation] of readFileSync(`${directory}/${file}`, 'utf8').matchAll(
      /\bquery\s+(Published\w+)/g,
    ))
      assert.ok(CMS_QUERY_MODELS[operation], `${operation} in ${file} must be registered`);
  }
});

test('native Admin payloads handle all five events for every public content model', () => {
  const h = harness();
  const { CMS_MODELS, modelTag, entryTag, detailTag } = h.load('src/lib/cms/cache-policy.ts');
  const { parseCmsEvent, eventTags } = h.load('src/lib/cms/webhook.ts');
  for (const model of CMS_MODELS)
    for (const event of ['create', 'update', 'publish', 'unpublish', 'delete']) {
      const tags = eventTags(
        parseCmsEvent({
          event: `entry.${event}`,
          uid: `api::${model}.${model}`,
          entry: { slug: 'new', pagePath: '/new' },
          createdAt: '2026-11-12T07:00:00.000Z',
        }),
      );
      assert.ok(tags.includes(modelTag(model)));
      assert.ok(tags.includes(entryTag(model, model === 'seo-page' ? '/new' : 'new')));
      assert.ok(tags.includes(detailTag(model)), 'native events cover omitted previous slugs');
    }
});

test('shared fragments and resolved placements carry their relationship dependencies', () => {
  const h = harness();
  const { queryTags, modelTag, entryTag } = h.load('src/lib/cms/cache-policy.ts');
  for (const [file, constant, operation, dependencies] of [
    [
      'published-service-query',
      'PUBLISHED_SERVICE_QUERY',
      'PublishedService',
      ['faq', 'testimonial', 'case-study', 'client', 'expertise', 'service'],
    ],
    [
      'published-resource-query',
      'PUBLISHED_RESOURCE_QUERY',
      'PublishedResource',
      ['author', 'resource-type', 'resource', 'faq', 'seo-settings'],
    ],
    [
      'published-glossary-query',
      'PUBLISHED_GLOSSARY_QUERY',
      'PublishedGlossary',
      ['glossary', 'faq'],
    ],
    [
      'published-tools-master-query',
      'PUBLISHED_TOOLS_MASTER_QUERY',
      'PublishedToolsMaster',
      ['tool', 'faq'],
    ],
    ['published-careers-query', 'CAREERS_QUERY', 'PublishedCareers', ['job', 'faq']],
  ]) {
    const query = h.load(`src/content/sources/strapi/${file}.ts`)[constant];
    const tags = queryTags(query, operation, { slug: 'sample' });
    for (const model of dependencies)
      assert.ok(tags.includes(modelTag(model)), `${operation}: ${model}`);
    assert.ok(tags.every((tag) => tag.length <= 256));
  }
  const tags = queryTags('query PublishedTool($slug:String!){tools{slug}}', 'PublishedTool', {
    slug: 'a',
  });
  assert.ok(tags.includes(entryTag('tool', 'a')));
  assert.ok(!tags.includes(modelTag('tool')), 'independent detail reads can expire by slug');
  const seo = queryTags(
    'query PublishedPageSeo($path:String!){seoPages{resolved}}',
    'PublishedPageSeo',
    { path: '/about' },
  );
  assert.ok(
    seo.includes(modelTag('faq')) && seo.includes(modelTag('file')),
    'resolved SEO depends on FAQ answers and media',
  );
});

test('cache stays warm across reads; events refresh detail and listing while unrelated data stays warm', async (t) => {
  environment(t);
  let version = 1;
  let calls = 0;
  global.fetch = async () => {
    calls++;
    return Response.json({ data: { version } });
  };
  const h = harness();
  const { publicGraphql } = h.load('src/content/sources/strapi/public-graphql.ts');
  const { POST } = h.load('src/app/api/revalidate/route.ts');
  const tool = () =>
    publicGraphql('query PublishedTool($slug:String!){tools{slug}}', 'PublishedTool', {
      slug: 'one',
    });
  const listing = () =>
    publicGraphql(
      'query PublishedToolsMaster{toolMaster{tools{tool{slug}}}}',
      'PublishedToolsMaster',
    );
  const legal = () =>
    publicGraphql(
      'query PublishedPrivacyPolicy{privacyPolicy{title}}',
      'PublishedPrivacyPolicy',
    );
  await Promise.all([tool(), tool(), tool()]);
  assert.equal(calls, 1, 'parallel identical POST requests are coalesced');
  await listing();
  await legal();
  version = 2;
  assert.equal((await tool()).version, 1);
  assert.equal(calls, 3);
  const result = await POST(
    endpoint({
      event: 'entry.update',
      model: 'tool',
      entry: { slug: 'one' },
    }),
  );
  assert.equal(result.status, 200);
  assert.equal((await tool()).version, 2);
  assert.equal((await listing()).version, 2);
  assert.equal((await legal()).version, 1);
  assert.equal(calls, 5);
});

test('rename, unpublish and delete expire old pages and cached missing slugs; duplicates are safe', async (t) => {
  environment(t);
  let published = ['old'];
  global.fetch = async (_url, init) => {
    const { variables } = JSON.parse(init.body);
    return Response.json({
      data: { tools: published.includes(variables.slug) ? [{ slug: variables.slug }] : [] },
    });
  };
  const h = harness();
  const { publicGraphql } = h.load('src/content/sources/strapi/public-graphql.ts');
  const { POST } = h.load('src/app/api/revalidate/route.ts');
  const read = (slug) =>
    publicGraphql('query PublishedTool($slug:String!){tools{slug}}', 'PublishedTool', { slug });
  assert.equal((await read('old')).tools.length, 1);
  assert.equal((await read('new')).tools.length, 0);
  published = ['new'];
  const event = {
    event: 'entry.update',
    model: 'tool',
    entry: { slug: 'new' },
  };
  await POST(endpoint(event));
  await POST(endpoint(event));
  assert.equal((await read('old')).tools.length, 0);
  assert.equal((await read('new')).tools.length, 1);
  for (const eventName of ['entry.unpublish', 'entry.delete']) {
    published = [];
    await POST(endpoint({ event: eventName, model: 'tool', entry: { slug: 'new' } }));
    assert.equal((await read('new')).tools.length, 0);
  }
});

test('auth, validation, payload limit and retry after partial failure', async (t) => {
  environment(t);
  const h = harness();
  const { POST } = h.load('src/app/api/revalidate/route.ts');
  const event = {
    event: 'entry.publish',
    model: 'tool',
    entry: { slug: 'one' },
  };
  assert.equal((await POST(endpoint(event, 'incorrect'))).status, 401);
  assert.equal((await POST(endpoint({ event: 'wrong' }))).status, 400);
  assert.equal(
    (await POST(endpoint({ ...event, entry: { huge: 'x'.repeat(270000) } }))).status,
    413,
  );
  h.setFailure(true);
  assert.equal((await POST(endpoint(event))).status, 503);
  h.setFailure(false);
  assert.equal((await POST(endpoint(event))).status, 200);
  assert.equal((await POST(endpoint({ ...event, model: 'client-contact' }))).status, 200);
  delete process.env.CMS_REVALIDATION_SECRET;
  assert.equal((await POST(endpoint(event))).status, 503);
});

test('HTTP and GraphQL errors are not cached; successful optional image recovery is preserved', async (t) => {
  environment(t);
  const h = harness();
  const { publicGraphql, publicGraphqlUrl } = h.load(
    'src/content/sources/strapi/public-graphql.ts',
  );
  const read = () => publicGraphql('query PublishedHome{home{title}}', 'PublishedHome');
  global.fetch = async () =>
    Response.json({ data: { home: null }, errors: [{ message: 'temporary error' }] });
  await assert.rejects(read, /temporary error/);
  global.fetch = async () => Response.json({ data: { home: null } }, { status: 503 });
  await assert.rejects(read, /HTTP 503/);
  global.fetch = async () => Response.json({ data: { home: { title: 'available' } } });
  assert.equal((await read()).home.title, 'available');
  global.fetch = async () =>
    Response.json({
      data: { tools: [{ illustration: { image: null } }] },
      errors: [
        {
          message: 'Cannot return null for non-nullable field ComponentContentImage.file.',
          path: ['tools', 0, 'illustration', 'image', 'file'],
        },
      ],
    });
  const result = await publicGraphql('query PublishedTool{tools{slug}}', 'PublishedTool');
  assert.equal(result.tools[0].illustration.image, null);
  delete process.env.NEW_CMS_GRAPHQL_URL;
  assert.throws(publicGraphqlUrl, /NEW_CMS_GRAPHQL_URL is required/);
});

test('legacy envelopes share persistent caching and canonical dependency tags', async (t) => {
  environment(t);
  const h = harness();
  const { cachedCmsFetch, publicGraphqlUrl } = h.load(
    'src/content/sources/strapi/public-graphql.ts',
  );
  const { POST } = h.load('src/app/api/revalidate/route.ts');
  let calls = 0;
  let version = 1;
  global.fetch = async () => {
    calls++;
    return Response.json({ data: { version } });
  };
  const read = async () =>
    (
      await cachedCmsFetch(publicGraphqlUrl(), {
        method: 'POST',
        body: JSON.stringify({
          query: 'query GetSitePages { services { slug } tools { slug } }',
        }),
        next: { tags: ['site-pages'], revalidate: 300 },
      })
    ).json();
  assert.equal((await read()).data.version, 1);
  version = 2;
  assert.equal((await read()).data.version, 1);
  assert.equal(calls, 1);
  global.fetch = async () => {
    throw new Error('CMS offline');
  };
  assert.equal(
    (await read()).data.version,
    1,
    'a warm cache survives CMS outages between updates',
  );
  await POST(endpoint({ event: 'entry.publish', model: 'service', entry: { slug: 'fresh' } }));
  global.fetch = async () => {
    calls++;
    return Response.json({ data: { version } });
  };
  assert.equal((await read()).data.version, 2);
  assert.equal(calls, 2);
  await assert.rejects(
    () => cachedCmsFetch('https://legacy.test/graphql', { body: '{}' }),
    /NEW_CMS_GRAPHQL_URL/,
  );
});

test('Admin Trigger probes authenticate and succeed without invalidating cache or fetching CMS', async (t) => {
  environment(t);
  const h = harness();
  const { POST } = h.load('src/app/api/revalidate/route.ts');
  global.fetch = async () => {
    throw new Error('A webhook probe must never call the CMS');
  };
  const probe = { event: 'trigger-test', createdAt: '2026-11-12T07:00:00.000Z' };
  assert.equal((await POST(endpoint(probe, 'wrong'))).status, 401);
  const response = await POST(endpoint(probe));
  assert.equal(response.status, 200);
  const receipt = await response.json();
  assert.equal(receipt.test, true);
  assert.equal(receipt.revalidated, false);
  assert.deepEqual(receipt.tags, []);
  assert.equal(h.invalidated.length, 0);
});

test('native media events expire image dependencies while unrelated text stays cached', async (t) => {
  environment(t);
  const h = harness();
  const { publicGraphql } = h.load('src/content/sources/strapi/public-graphql.ts');
  const { POST } = h.load('src/app/api/revalidate/route.ts');
  let version = 1;
  global.fetch = async () => Response.json({ data: { version } });
  const illustrated = () =>
    publicGraphql('query PublishedHome{home{image{url}}}', 'PublishedHome');
  const text = () =>
    publicGraphql(
      'query PublishedPrivacyPolicy{privacyPolicy{title}}',
      'PublishedPrivacyPolicy',
    );
  await illustrated();
  await text();
  for (const event of ['media.create', 'media.update', 'media.delete']) {
    version++;
    const response = await POST(
      endpoint({ event, createdAt: '2026-11-12T07:00:00.000Z', media: { id: 123 } }),
    );
    assert.equal(response.status, 200);
    assert.equal((await illustrated()).version, version);
    assert.equal((await text()).version, 1);
  }
});
