/** Published Glossary contract. --live maps every published term in the production CMS. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const directory = mkdtempSync(join(tmpdir(), 'glossary-check-'));
const originalFetch = globalThis.fetch;
const keys = [
  'STRAPI_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_API_TOKEN',
];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
try {
  const output = join(directory, 'glossary.cjs');
  await build({
    stdin: {
      contents: `export * from './src/content/sources/strapi/glossary-documents'; export {corpusImage} from './src/lib/corpus-images'; export {inlineToText} from './src/lib/inline'; export {LongformPage} from './src/templates/CorpusPage/LongformPage'; export {createElement} from 'react'; export {renderToStaticMarkup} from 'react-dom/server';`,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    outfile: output,
    bundle: true,
    format: 'cjs',
    platform: 'node',
    plugins: [
      {
        name: 'omit-render-test-styles',
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, () => ({
            contents: 'export default {};',
            loader: 'js',
          }));
        },
      },
    ],
    logLevel: 'error',
  });
  const {
    getGlossaryDocument,
    listPublishedGlossaries,
    glossarySitePages,
    mapGlossaryDocument,
    corpusImage,
    inlineToText,
    LongformPage,
    createElement,
    renderToStaticMarkup,
  } = createRequire(import.meta.url)(output);
  const route = '/glossary/cms-term';
  const document = {
    route,
    frontmatter: {
      route,
      slug: 'cms-term',
      page_name: 'CMS term',
      page_type: 'defined_term',
      seo: {
        title: 'CMS search title',
        description: 'CMS search description',
        canonical: `https://www.tcules.com${route}`,
        robots: 'noindex,nofollow',
      },
      navigation: {
        breadcrumb: [
          { name: 'Glossary', url: '/glossary' },
          { name: 'CMS term', url: route },
        ],
      },
      render: { band_order: ['comparison', 'faq', 'next'] },
      page_composition: {
        media_bindings: [
          {
            id: 'cms-image',
            role: 'demonstrate',
            supports_section: 'comparison',
            asset_uri: 'https://media.example/new.webp',
            alt_intent: 'CMS comparison',
            status: 'BOUND_EXISTING_PUBLIC_ASSET',
            width: 1600,
            height: 900,
          },
        ],
      },
    },
    body: '*Glossary · CMS term*\n\n# What is a CMS term?\n\nThe CMS definition is the first paragraph.\n\nThe CMS statement remains the second paragraph.\n\nFurther CMS definition detail.\n\n## CMS comparison {#comparison}\n\n| CMS concept | CMS meaning |\n| --- | --- |\n| Native term | The authored definition |\n\n[Related term](/glossary/related-term)\n\n## CMS questions {#faq}\n\n### What does this term mean?\n\nThe complete CMS answer stays here.\n\n## CMS next step {#next}\n\nRead about [Design Systems](/services/design-systems) for more.\n\n[Explore the service](/services/design-systems)',
  };
  process.env.STRAPI_GRAPHQL_URL = 'https://old.example/graphql';
  process.env.STRAPI_CASE_STUDY_GRAPHQL_URL = 'https://new.example/graphql';
  process.env.STRAPI_CASE_STUDY_API_TOKEN = 'test-token';
  let calls = [];
  let failure;
  let missing = false;
  globalThis.fetch = async (url, options) => {
    assert.equal(
      url,
      process.env.STRAPI_CASE_STUDY_GRAPHQL_URL ||
        'https://tcules-cms-2026-production.up.railway.app/graphql',
    );
    assert.equal(
      options.headers.authorization,
      process.env.STRAPI_CASE_STUDY_API_TOKEN ? 'Bearer test-token' : undefined,
    );
    assert.equal(options.cache, 'force-cache');
    assert.equal(options.next.revalidate, 300);
    assert.ok(options.signal instanceof AbortSignal);
    const request = JSON.parse(options.body);
    calls.push(request);
    if (failure) return failure();
    if (request.query.includes('glossaries_connection')) {
      assert.match(request.query, /status: PUBLISHED/);
      return Response.json({
        data: {
          glossaries_connection: {
            pageInfo: { pageCount: 2 },
            nodes:
              request.variables.page === 1
                ? [
                    { slug: 'cms-term', title: 'CMS term', updatedAt: '2026-11-02T00:00:00Z' },
                    { slug: 'main', title: 'Index' },
                  ]
                : [
                    { slug: 'related-term', title: 'Related term' },
                    { slug: 'cms-term', title: 'CMS term' },
                  ],
          },
        },
      });
    }
    assert.deepEqual(request.variables, { route });
    assert.match(request.query, /scopedCorpusDocument/);
    return Response.json({ data: { scopedCorpusDocument: missing ? null : document } });
  };
  const mapped = await getGlossaryDocument('cms-term');
  assert.equal(mapped.hero.titleText, 'What is a CMS term?');
  assert.deepEqual(mapped.hero.lede.map(inlineToText), [
    'The CMS definition is the first paragraph.',
    'The CMS statement remains the second paragraph.',
    'Further CMS definition detail.',
  ]);
  assert.equal(mapped.seo.title, 'CMS search title');
  assert.equal(mapped.seo.robots, 'noindex,nofollow');
  assert.equal(mapped.breadcrumb[1].name, 'CMS term');
  assert.deepEqual(
    mapped.bands.map((band) => band.id),
    ['comparison', 'faq', 'next'],
  );
  assert.equal(mapped.bands[0].blocks[0].type, 'table');
  assert.equal(mapped.bands[1].blocks[0].headingText, 'What does this term mean?');
  assert.equal(mapped.bands[0].blocks[1].links[0].href, '/glossary/related-term');
  assert.equal(mapped.file, `cms:${route}`);
  // Render the actual term template: a standalone body link and every closing paragraph survive.
  for (const count of [2, 3]) {
    const closingCopy = Array.from(
      { length: count },
      (_, index) => `Complete closing paragraph ${index + 1}.`,
    );
    const page = mapGlossaryDocument(
      {
        ...document,
        frontmatter: {
          ...document.frontmatter,
          page_composition: {},
          render: {},
        },
        body: `# A CMS term\n\nThe complete definition.\n\n## Details {#details}\n\nThe complete body paragraph.\n\n[Read the authored link](/how-we-work/ai-native-product-design)\n\n## Continue {#next}\n\n${closingCopy.join('\n\n')}\n\n[Explore the service](/services/design-systems)`,
      },
      route,
    );
    const html = renderToStaticMarkup(
      createElement(LongformPage, { page, family: 'term', caseRefs: {} }),
    );
    const text = html.replace(/<[^>]*>/gu, ' ').replace(/\s+/gu, ' ');
    assert.ok(text.includes('Read the authored link'));
    assert.ok(html.includes('href="/how-we-work/ai-native-product-design"'));
    for (const paragraph of closingCopy) assert.ok(text.includes(paragraph));
  }
  assert.deepEqual(corpusImage(mapped.composition.mediaBindings[0]), {
    src: 'https://media.example/new.webp',
    alt: 'CMS comparison',
    width: 1600,
    height: 900,
    kind: 'capture',
  });
  assert.equal(
    mapGlossaryDocument(
      { ...document, frontmatter: { ...document.frontmatter, page_type: 'glossary' } },
      route,
    ).pageType,
    'glossary',
  );
  assert.throws(
    () =>
      mapGlossaryDocument(
        { ...document, frontmatter: { ...document.frontmatter, page_type: 'service' } },
        route,
      ),
    /no glossary term content/,
  );
  assert.throws(
    () => mapGlossaryDocument({ ...document, route: '/glossary/other' }, route),
    /invalid glossary document/,
  );
  assert.throws(
    () => mapGlossaryDocument({ ...document, body: '' }, route),
    /invalid glossary document/,
  );
  calls = [];
  assert.deepEqual(
    (await listPublishedGlossaries()).map((term) => term.slug),
    ['cms-term', 'related-term'],
  );
  assert.deepEqual(
    calls.map((call) => call.variables.page),
    [1, 2],
  );
  assert.ok((await glossarySitePages()).every((page) => page.family === 'glossary'));
  calls = [];
  for (const slug of ['', '../cms-term', 'main', 'cms/term'])
    assert.equal(await getGlossaryDocument(slug), null);
  assert.equal(calls.length, 0);
  missing = true;
  assert.equal(await getGlossaryDocument('cms-term'), null);
  missing = false;
  delete process.env.STRAPI_CASE_STUDY_GRAPHQL_URL;
  delete process.env.STRAPI_CASE_STUDY_API_TOKEN;
  assert.ok(await getGlossaryDocument('cms-term'));
  failure = () => new Response('Unavailable', { status: 503 });
  await assert.rejects(getGlossaryDocument('cms-term'), /HTTP 503/);
  failure = () => Response.json({ errors: [{ message: 'Permission denied' }] });
  await assert.rejects(getGlossaryDocument('cms-term'), /Permission denied/);
  failure = () => Response.json({});
  await assert.rejects(getGlossaryDocument('cms-term'), /returned no data/);
  console.log(
    'Glossary checks passed: shared endpoint, auth, published pagination, definitions, sections, tables, FAQs, links, media, legacy page type and failures.',
  );

  if (process.argv.includes('--live')) {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
    const terms = await listPublishedGlossaries();
    assert.ok(terms.length > 0);
    const results = [];
    function textOf(block) {
      switch (block.type) {
        case 'paragraph':
          return [inlineToText(block.runs)];
        case 'labelled':
          return [inlineToText(block.label), inlineToText(block.body)];
        case 'list':
          return block.items.map(inlineToText);
        case 'table':
          return [...block.header, ...block.rows.flat()].map(inlineToText);
        case 'item':
          return [block.headingText, ...block.blocks.flatMap(textOf)];
        case 'links':
          return block.links.map((link) => link.labelText);
        case 'quote':
          return [
            ...block.paragraphs.map(inlineToText),
            ...(block.attribution ? [inlineToText(block.attribution)] : []),
          ];
        default:
          return [];
      }
    }
    function hrefsOf(node) {
      if (Array.isArray(node)) return node.flatMap(hrefsOf);
      if (node && typeof node === 'object')
        return [
          ...(typeof node.href === 'string' ? [node.href] : []),
          ...Object.values(node).flatMap(hrefsOf),
        ];
      return [];
    }
    for (let start = 0; start < terms.length; start += 4) {
      await Promise.all(
        terms.slice(start, start + 4).map(async (term) => {
          const page = await getGlossaryDocument(term.slug);
          assert.ok(page, `No published glossary document: ${term.slug}`);
          assert.equal(page.route, `/glossary/${term.slug}`);
          assert.ok(page.hero.lede.length > 0);
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
          const segments = [
            ...page.hero.lede.map(inlineToText),
            ...page.hero.extra.flatMap(textOf),
            ...page.bands.flatMap((band) => [band.headingText, ...band.blocks.flatMap(textOf)]),
          ].filter((segment) => segment.trim().length >= 12);
          results.push({
            slug: term.slug,
            label: term.title,
            title: page.hero.titleText,
            seo: page.seo,
            pageType: page.pageType,
            bands: page.bands.map((band) => band.id),
            segments,
            links: [...new Set(hrefsOf({ hero: page.hero, bands: page.bands }))],
          });
        }),
      );
    }
    writeFileSync('/tmp/tcules-glossary-live.json', JSON.stringify(results, null, 2));
    console.log(
      `Live Glossary checks passed: ${terms.length} published terms, SEO, definitions, authored band order, links and media.`,
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
