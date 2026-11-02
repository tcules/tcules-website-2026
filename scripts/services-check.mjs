/** Published Services contract. --live also reads and maps every service in the production CMS. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const directory = mkdtempSync(join(tmpdir(), 'services-check-'));
const originalFetch = globalThis.fetch;
const keys = [
  'STRAPI_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_API_TOKEN',
];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
try {
  const output = join(directory, 'services.cjs');
  await build({
    stdin: {
      contents: `export * from './src/content/sources/strapi/service-offers'; export {corpusImage} from './src/lib/corpus-images';`,
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
    getServiceOfferPage,
    listPublishedServices,
    serviceSitePages,
    mapServiceOffer,
    corpusImage,
  } = createRequire(import.meta.url)(output);
  const route = '/services/product-design/ux-research';
  const image = 'https://media.example/new-cms-image.webp';
  const document = {
    route,
    frontmatter: {
      route,
      page_type: 'service',
      slug: 'ux-research',
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
    if (request.query.includes('services_connection')) {
      assert.match(request.query, /status: PUBLISHED/);
      return Response.json({
        data: {
          services_connection: {
            pageInfo: { pageCount: 2 },
            nodes:
              request.variables.page === 1
                ? [
                    {
                      slug: 'product-design',
                      title: 'CMS product design',
                      updatedAt: '2026-11-02T00:00:00Z',
                    },
                    { slug: 'main', title: 'Index' },
                  ]
                : [
                    { slug: 'product-design/ux-research', title: 'CMS research' },
                    { slug: 'product-design', title: 'CMS product design' },
                  ],
          },
        },
      });
    }
    assert.deepEqual(request.variables, { route });
    assert.match(request.query, /scopedCorpusDocument/);
    return Response.json({ data: { scopedCorpusDocument: missing ? null : document } });
  };
  const mapped = await getServiceOfferPage('product-design/ux-research');
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
  calls = [];
  assert.deepEqual(
    (await listPublishedServices()).map((service) => service.slug),
    ['product-design', 'product-design/ux-research'],
  );
  assert.deepEqual(
    calls.map((call) => call.variables.page),
    [1, 2],
  );
  assert.ok((await serviceSitePages()).every((page) => page.family === 'service'));
  for (const slug of ['', '../product-design', 'main', 'product-design//ux-research'])
    assert.equal(await getServiceOfferPage(slug), null);
  missing = true;
  assert.equal(await getServiceOfferPage('product-design/ux-research'), null);
  missing = false;
  assert.throws(
    () => mapServiceOffer({ ...document, route: '/audits/other' }, route),
    /invalid service document/,
  );
  assert.throws(
    () => mapServiceOffer({ ...document, body: '' }, route),
    /invalid service document/,
  );
  failure = () => new Response('Unavailable', { status: 503 });
  await assert.rejects(getServiceOfferPage('product-design/ux-research'), /HTTP 503/);
  failure = () => Response.json({ errors: [{ message: 'Permission denied' }] });
  await assert.rejects(getServiceOfferPage('product-design/ux-research'), /Permission denied/);
  failure = () => Response.json({});
  await assert.rejects(getServiceOfferPage('product-design/ux-research'), /returned no data/);
  console.log(
    'Services checks passed: shared endpoint, publication, pagination, nested slugs, mapping, CMS media and failures.',
  );

  if (process.argv.includes('--live')) {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
    const services = await listPublishedServices();
    assert.ok(services.length > 0);
    const results = [];
    // Limit public reads to four concurrent requests.
    for (let start = 0; start < services.length; start += 4) {
      await Promise.all(
        services.slice(start, start + 4).map(async (service) => {
          const offer = await getServiceOfferPage(service.slug);
          assert.ok(offer, `No published service document: ${service.slug}`);
          const { page } = offer;
          assert.equal(page.route, `/services/${service.slug}`);
          assert.equal(page.hero.titleText, service.title);
          assert.ok(page.seo.title && page.seo.description && page.seo.canonical);
          assert.ok(page.bands.length > 0 && page.conversion);
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
            slug: service.slug,
            title: page.hero.titleText,
            seo: page.seo,
            bands: page.bands.map((band) => band.id),
            hero: offer.heroIllustration?.src,
          });
        }),
      );
    }
    writeFileSync('/tmp/tcules-services-live.json', JSON.stringify(results, null, 2));
    console.log(
      `Live Services checks passed: ${services.length} published services, including nested routes, SEO, ordered bands, conversion and media.`,
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
