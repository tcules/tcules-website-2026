/** Native legal single types, through the real adapter and article renderer. --live reads production. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const directory = mkdtempSync(join(tmpdir(), 'legal-pages-check-'));
const originalFetch = globalThis.fetch;
const keys = [
  'STRAPI_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_API_TOKEN',
];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
try {
  const output = join(directory, 'legal.cjs');
  await build({
    stdin: {
      contents: `export * from './src/content/sources/strapi/legal-documents'; export {LongformPage} from './src/templates/CorpusPage/LongformPage'; export {inlineToText} from './src/lib/inline'; export {corpusMetadata} from './src/lib/corpus-metadata'; export {markdownToHtml} from './src/content/sources/strapi/markdown'; export {createElement} from 'react'; export {renderToStaticMarkup} from 'react-dom/server';`,
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
    getLegalDocument,
    mapLegalDocument,
    LongformPage,
    inlineToText,
    corpusMetadata,
    markdownToHtml,
    createElement,
    renderToStaticMarkup,
  } = createRequire(import.meta.url)(output);
  const render = (document) =>
    renderToStaticMarkup(
      createElement(LongformPage, { page: document.page, family: 'article', caseRefs: {} }),
    );
  const plain = (html) =>
    html
      .replace(/<[^>]*>/gu, ' ')
      .replace(/&quot;/gu, '"')
      .replace(/&#x27;|&#39;/gu, "'")
      .replace(/&amp;/gu, '&')
      .replace(/\s+/gu, ' ')
      .trim();
  const record = {
    documentId: 'native-legal',
    heading: 'CMS Legal title',
    description: 'CMS introduction.\n\nCMS second paragraph.',
    publishedDate: '2026-10-25',
    updatedDate: '2026-10-28',
    legalDescription: [
      {
        id: '42',
        heading: 'Native first section',
        description:
          'The **complete** CMS paragraph with [privacy](/privacy-policy).\n\n- First requirement\n- Second requirement\n\n### Details\n\nThe complete nested paragraph.\n\n| Topic | Detail |\n| --- | --- |\n| Privacy | CMS table copy |\n\n> The nested CMS quote.\n\n#### Further detail\n\nThe complete nested subheading body.',
      },
      {
        id: '43',
        heading: 'Native last contact section',
        description:
          'Final contact paragraph.\n\n- Final contact requirement\n\n[Email the team](mailto:legal@tcules.com)',
      },
    ],
    seo: {
      metaTitle: 'CMS legal search title',
      metaDescription: 'CMS legal search description',
      canonicalURL: 'https://www.tcules.com/legal-canonical',
      robot: 'noindex nofollow',
      structuredData: { '@type': 'WebPage', name: 'CMS JSON-LD' },
    },
  };
  const untouched = structuredClone(record);
  process.env.STRAPI_GRAPHQL_URL = 'https://old.example/graphql';
  process.env.STRAPI_CASE_STUDY_GRAPHQL_URL = 'https://new.example/graphql';
  process.env.STRAPI_CASE_STUDY_API_TOKEN = 'test-token';
  let calls = 0;
  let failure;
  let missing = false;
  globalThis.fetch = async (url, options) => {
    calls++;
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
    const { query, variables } = JSON.parse(options.body);
    assert.deepEqual(variables, {});
    assert.match(query, /status: PUBLISHED/u);
    assert.match(query, /publishedDate/u);
    assert.match(query, /updatedDate/u);
    assert.doesNotMatch(query, /scopedCorpusDocument|corpusContent|DRAFT/u);
    const field = query.includes('termsOfUse(') ? 'termsOfUse' : 'privacyPolicy';
    assert.ok(
      options.next.tags.includes(field === 'termsOfUse' ? 'terms-of-use' : 'privacy-policy'),
    );
    if (failure) return failure();
    return Response.json({ data: { [field]: missing ? null : record } });
  };
  for (const route of ['/terms-of-use', '/privacy-policy']) {
    const document = await getLegalDocument(route);
    const { page } = document;
    assert.equal(page.file, `cms:${route}`);
    assert.equal(page.pageType, 'legal');
    assert.equal(page.hero.titleText, record.heading);
    assert.deepEqual(page.hero.lede.map(inlineToText), [
      'CMS introduction.',
      'CMS second paragraph.',
    ]);
    assert.equal(
      inlineToText(page.hero.proofLines[0]),
      'Published: 25 October 2026 · Last updated: 28 October 2026',
    );
    assert.deepEqual(
      page.bands.map((b) => b.headingText),
      record.legalDescription.map((s) => s.heading),
    );
    assert.deepEqual(
      page.bands.map((b) => b.id),
      ['legal-section-42', 'legal-section-43'],
    );
    assert.equal(document.publishedAt, '2026-10-25T00:00:00.000Z');
    assert.equal(document.updatedAt, '2026-10-28T00:00:00.000Z');
    assert.deepEqual(document.structuredData, record.seo.structuredData);
    const metadata = corpusMetadata(page);
    assert.equal(metadata.title, record.seo.metaTitle);
    assert.equal(metadata.description, record.seo.metaDescription);
    assert.equal(metadata.alternates.canonical, record.seo.canonicalURL);
    assert.deepEqual(metadata.robots, { index: false, follow: false });
    const html = render(document);
    for (const copy of [
      'complete',
      'First requirement',
      'Second requirement',
      'The complete nested paragraph.',
      'CMS table copy',
      'The nested CMS quote.',
      'The complete nested subheading body.',
      'Final contact paragraph.',
      'Final contact requirement',
      'Email the team',
    ])
      assert.ok(plain(html).includes(copy), copy);
    assert.ok(html.includes('href="/privacy-policy"'));
    assert.ok(html.includes('href="mailto:legal@tcules.com"'));
    // A last standalone link stays in the document, preserving its list and ToC entry.
    assert.ok(html.includes('href="#legal-section-43-heading"'));
    assert.ok(
      plain(html).indexOf('Final contact requirement') <
        plain(html).lastIndexOf('Email the team'),
    );
  }
  assert.deepEqual(record, untouched);
  const before = calls;
  assert.equal(await getLegalDocument('/cookie-policy'), null);
  assert.equal(calls, before);
  for (const patch of [
    { heading: '' },
    { documentId: '' },
    { legalDescription: [] },
    { publishedDate: '2026-02-30' },
    { updatedDate: '2026-10-01' },
    { legalDescription: [{ id: '1', description: '' }] },
    {
      legalDescription: [
        { id: '1', description: 'First' },
        { id: '1', description: 'Second' },
      ],
    },
  ])
    assert.throws(() => mapLegalDocument({ ...record, ...patch }, '/terms-of-use'));
  assert.throws(() => mapLegalDocument(record, '/cookie-policy'));
  const defaults = mapLegalDocument(
    {
      ...record,
      seo: null,
      description: null,
      legalDescription: [
        { id: '1', description: 'Headless content.\n\n## A nested heading\n\nNested content.' },
      ],
    },
    '/terms-of-use',
  );
  assert.equal(defaults.page.seo.title, 'CMS Legal title | Tcules');
  assert.equal(defaults.page.seo.canonical, 'https://tcules.com/terms-of-use');
  assert.equal(defaults.page.seo.robots, 'index,follow');
  assert.equal(defaults.page.bands[0].headingText, '');
  assert.equal(defaults.page.bands[0].blocks[1].headingText, 'A nested heading');
  assert.ok(plain(render(defaults)).includes('Headless content.'));
  assert.equal(
    mapLegalDocument(
      {
        ...record,
        seo: {
          canonicalURL: 'javascript:bad',
          structuredData: 'invalid',
          codeJson: JSON.stringify({ full_json_ld_preview: { '@type': 'WebPage' } }),
        },
      },
      '/terms-of-use',
    ).structuredData['@type'],
    'WebPage',
  );
  missing = true;
  assert.equal(await getLegalDocument('/terms-of-use'), null);
  missing = false;
  delete process.env.STRAPI_CASE_STUDY_GRAPHQL_URL;
  delete process.env.STRAPI_CASE_STUDY_API_TOKEN;
  await getLegalDocument('/privacy-policy');
  for (const [response, pattern] of [
    [() => new Response('', { status: 503 }), /HTTP 503/u],
    [() => Response.json({ errors: [{ message: 'Denied' }] }), /Denied/u],
    [() => Response.json({ data: null }), /no data/u],
    [() => Response.json({ data: {} }), /no termsOfUse field/u],
  ]) {
    failure = response;
    await assert.rejects(getLegalDocument('/terms-of-use'), pattern);
  }
  console.log(
    'Legal page contract: native copy, sections, dates, SEO, renderer, endpoint and published-only reads passed.',
  );
  if (process.argv.includes('--live')) {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
    for (const route of ['/terms-of-use', '/privacy-policy']) {
      const document = await getLegalDocument(route);
      assert.ok(document, `${route} has a published single type`);
      const field = route === '/terms-of-use' ? 'termsOfUse' : 'privacyPolicy';
      const response = await originalFetch(
        process.env.STRAPI_CASE_STUDY_GRAPHQL_URL ||
          'https://tcules-cms-2026-production.up.railway.app/graphql',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(process.env.STRAPI_CASE_STUDY_API_TOKEN
              ? { authorization: `Bearer ${process.env.STRAPI_CASE_STUDY_API_TOKEN}` }
              : {}),
          },
          body: JSON.stringify({
            query: `query { ${field}(status: PUBLISHED) { heading description legalDescription { heading description } } }`,
          }),
          signal: AbortSignal.timeout(10000),
        },
      );
      const raw = (await response.json()).data[field];
      const html = render(document);
      const rendered = plain(html);
      assert.equal(document.page.hero.titleText, raw.heading);
      assert.equal(document.page.bands.length, raw.legalDescription.length);
      for (const section of raw.legalDescription) {
        const expected = plain(markdownToHtml(section.description, 'live legal section'));
        assert.ok(rendered.includes(expected), `${route}: complete section ${section.heading}`);
      }
      console.log(
        `${route}: ${document.page.bands.length} ordered sections, complete CMS text, publication and revision dates rendered.`,
      );
    }
  }
} finally {
  globalThis.fetch = originalFetch;
  for (const key of keys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
  rmSync(directory, { recursive: true, force: true });
}
