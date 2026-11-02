/** Published Expertise contract. --live also reads and maps every expertise in the production CMS. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const directory = mkdtempSync(join(tmpdir(), 'expertise-check-'));
const originalFetch = globalThis.fetch;
const keys = [
  'STRAPI_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_API_TOKEN',
];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
try {
  const output = join(directory, 'expertise.cjs');
  await build({
    stdin: {
      contents: `export * from './src/content/sources/strapi/expertise-offers'; export {corpusImage} from './src/lib/corpus-images';`,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    outfile: output,
    bundle: true,
    format: 'cjs',
    platform: 'node',
    logLevel: 'error',
  });
  const {
    getExpertiseOfferPage,
    listPublishedExpertises,
    expertiseSitePages,
    mapExpertiseOffer,
    corpusImage,
  } = createRequire(import.meta.url)(output);
  const route = '/expertise/fintech';
  const image = 'https://media.example/new-cms-image.webp';
  const document = {
    route,
    frontmatter: {
      route,
      page_type: 'expertise',
      slug: 'fintech',
      page_name: 'CMS research',
      seo: {
        title: 'CMS search title',
        description: 'CMS search description',
        canonical: `https://www.tcules.com${route}`,
        robots: 'noindex,nofollow',
      },
      navigation: { breadcrumb: [{ name: 'CMS research', url: route }] },
      render: { band_order: ['proof', 'faq', 'enquiry'] },
      page_composition: {
        media_bindings: [
          {
            id: 'new-image',
            role: 'demonstrate',
            supports_section: 'proof',
            asset_uri: image,
            alt_intent: 'CMS image alt',
            status: 'BOUND_EXISTING_PUBLIC_ASSET',
            width: 1800,
            height: 1200,
            sources: [{ src: 'https://media.example/small.webp', width: 320 }],
          },
        ],
      },
      conversion: {
        form: 'project_enquiry',
        anchor: 'enquiry',
        visible_fields: ['Email'],
        optional_fields: [],
        submit_label: 'Contact the CMS team',
        hidden_context: ['origin_route'],
        on_success: {
          heading: 'CMS success',
          body: 'CMS reply time',
          retain_entered_data: true,
        },
      },
      frontendTemplate: {
        heroIllustration: { src: image, width: 1800, height: 1200, alt: 'CMS hero' },
        scenes: { items: { proof: { 'CMS outcome': 'outcome-rules' } }, stories: {} },
      },
    },
    body: '*CMS eyebrow*\n\n# CMS hero title\n\nCMS hero description.\n\n[Enquire](#enquiry)\n\n## CMS proof {#proof}\n\nCMS section copy.\n\n## CMS questions {#faq}\n\n### CMS question?\n\nCMS answer.\n\n## CMS enquiry {#enquiry}\n\nCMS closing copy.',
  };
  process.env.STRAPI_GRAPHQL_URL = 'https://old.example/graphql';
  process.env.STRAPI_CASE_STUDY_GRAPHQL_URL = 'https://new.example/graphql';
  process.env.STRAPI_CASE_STUDY_API_TOKEN = 'test-token';
  let calls = [];
  let failure;
  let missing = false;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://new.example/graphql');
    assert.equal(options.headers.authorization, 'Bearer test-token');
    assert.equal(options.next.revalidate, 300);
    assert.equal(options.cache, 'force-cache');
    assert.ok(options.signal instanceof AbortSignal);
    const request = JSON.parse(options.body);
    calls.push(request);
    if (failure) return failure();
    if (request.query.includes('expertises_connection')) {
      assert.match(request.query, /status: PUBLISHED/);
      return Response.json({
        data: {
          expertises_connection: {
            pageInfo: { pageCount: 2 },
            nodes:
              request.variables.page === 1
                ? [
                    {
                      slug: 'healthtech',
                      title: 'CMS product design',
                      updatedAt: '2026-11-02T00:00:00Z',
                    },
                    { slug: 'main', title: 'Index' },
                  ]
                : [
                    { slug: 'fintech', title: 'CMS research' },
                    { slug: 'healthtech', title: 'CMS product design' },
                  ],
          },
        },
      });
    }
    assert.deepEqual(request.variables, { route });
    assert.match(request.query, /scopedCorpusDocument/);
    return Response.json({ data: { scopedCorpusDocument: missing ? null : document } });
  };
  const mapped = await getExpertiseOfferPage('fintech');
  assert.equal(mapped.page.hero.titleText, 'CMS hero title');
  assert.deepEqual(mapped.page.hero.eyebrow, [{ type: 'text', text: 'CMS eyebrow' }]);
  assert.equal(mapped.page.seo.title, 'CMS search title');
  assert.equal(mapped.page.seo.robots, 'noindex,nofollow');
  assert.equal(mapped.page.breadcrumb[0].name, 'CMS research');
  assert.deepEqual(
    mapped.page.bands.map((band) => band.id),
    ['proof', 'faq', 'enquiry'],
  );
  assert.equal(mapped.page.conversion.submitLabel, 'Contact the CMS team');
  assert.equal(mapped.page.conversion.onSuccess.heading, 'CMS success');
  assert.equal(mapped.heroIllustration.src, image);
  assert.equal(mapped.scenes.items.proof['CMS outcome'], 'outcome-rules');
  assert.deepEqual(corpusImage(mapped.page.composition.mediaBindings[0]), {
    src: image,
    alt: 'CMS image alt',
    width: 1800,
    height: 1200,
    kind: 'capture',
    sources: [{ src: 'https://media.example/small.webp', width: 320 }],
  });
  assert.equal(mapped.page.file, `cms:${route}`);
  const narrative = mapExpertiseOffer(
    {
      ...document,
      frontmatter: {
        ...document.frontmatter,
        frontendTemplate: undefined,
        conversion: undefined,
      },
    },
    route,
  );
  assert.equal(narrative.page.conversion, null);
  assert.deepEqual(narrative.scenes, { items: {}, stories: {} });
  assert.equal(narrative.heroIllustration, undefined);
  assert.throws(
    () =>
      mapExpertiseOffer(
        {
          ...document,
          frontmatter: {
            ...document.frontmatter,
            page_type: 'service',
          },
        },
        route,
      ),
    /has no expertise page content/,
  );
  calls = [];
  assert.deepEqual(
    (await listPublishedExpertises()).map((expertise) => expertise.slug),
    ['healthtech', 'fintech'],
  );
  assert.deepEqual(
    calls.map((call) => call.variables.page),
    [1, 2],
  );
  assert.ok((await expertiseSitePages()).every((page) => page.family === 'expertise'));
  for (const slug of ['', '../product-design', 'main', 'healthtech/care'])
    assert.equal(await getExpertiseOfferPage(slug), null);
  missing = true;
  assert.equal(await getExpertiseOfferPage('fintech'), null);
  missing = false;
  assert.throws(
    () => mapExpertiseOffer({ ...document, route: '/audits/other' }, route),
    /invalid expertise document/,
  );
  assert.throws(
    () => mapExpertiseOffer({ ...document, body: '' }, route),
    /invalid expertise document/,
  );
  failure = () => new Response('Unavailable', { status: 503 });
  await assert.rejects(getExpertiseOfferPage('fintech'), /HTTP 503/);
  failure = () => Response.json({ errors: [{ message: 'Permission denied' }] });
  await assert.rejects(getExpertiseOfferPage('fintech'), /Permission denied/);
  failure = () => Response.json({});
  await assert.rejects(getExpertiseOfferPage('fintech'), /returned no data/);
  console.log(
    'Expertise checks passed: shared endpoint, publication, pagination, single-segment slugs, mapping, CMS media and failures.',
  );

  if (process.argv.includes('--live')) {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
    const expertise = await listPublishedExpertises();
    assert.ok(expertise.length > 0);
    const results = [];
    // Limit public reads to four concurrent requests.
    for (let start = 0; start < expertise.length; start += 4) {
      await Promise.all(
        expertise.slice(start, start + 4).map(async (expertise) => {
          const offer = await getExpertiseOfferPage(expertise.slug);
          assert.ok(offer, `No published expertise document: ${expertise.slug}`);
          const { page } = offer;
          assert.equal(page.route, `/expertise/${expertise.slug}`);
          assert.equal(page.hero.titleText, expertise.title);
          assert.ok(page.seo.title && page.seo.description && page.seo.canonical);
          assert.ok(page.bands.length > 0);
          if (page.bandOrder.length)
            assert.deepEqual(
              page.bands.map((band) => band.id),
              page.bandOrder,
            );
          for (const binding of page.composition.mediaBindings.filter(
            (binding) => binding.bound,
          ))
            corpusImage(binding);
          results.push({
            slug: expertise.slug,
            title: page.hero.titleText,
            seo: page.seo,
            bands: page.bands.map((band) => band.id),
            hero: offer.heroIllustration?.src,
            hasForm: !!page.conversion,
          });
        }),
      );
    }
    writeFileSync('/tmp/tcules-expertise-live.json', JSON.stringify(results, null, 2));
    console.log(
      `Live Expertise checks passed: ${expertise.length} published expertise, including pages outside the local allowlist, SEO, ordered bands, conversion and media.`,
    );
  }
} finally {
  globalThis.fetch = originalFetch;
  for (const key of keys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
  rmSync(directory, { recursive: true, force: true });
}
