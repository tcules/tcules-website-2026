/** Native resources contract checks. --live additionally reads every published CMS resource. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const directory = mkdtempSync(join(tmpdir(), 'resources-check-'));
const originalFetch = globalThis.fetch;
const keys = [
  'STRAPI_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_API_TOKEN',
];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
try {
  const output = join(directory, 'resources.cjs');
  await build({
    stdin: {
      contents: `export * from './src/content/sources/strapi/resources'; export * from './src/content/sources/strapi/resource-authors';`,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    outfile: output,
    bundle: true,
    format: 'cjs',
    platform: 'node',
    logLevel: 'error',
  });
  const adapter = createRequire(import.meta.url)(output);
  const {
    mapResource,
    listPublishedResources,
    getPublishedResource,
    resourceInsightsSource,
    resourceAuthorsSource,
  } = adapter;
  for (const key of keys) delete process.env[key];
  process.env.STRAPI_GRAPHQL_URL = 'https://old-cms.example/graphql';
  process.env.STRAPI_CASE_STUDY_GRAPHQL_URL = 'https://new-cms.example/graphql';
  process.env.STRAPI_CASE_STUDY_API_TOKEN = 'test-token';
  const file = {
    url: '/uploads/resource.webp',
    width: 1600,
    height: 900,
    mime: 'image/webp',
    alternativeText: 'CMS alt',
    caption: 'CMS caption',
    formats: { small: { url: '/uploads/small.webp', width: 320 } },
  };
  const person = {
    documentId: 'author-1',
    name: 'CMS Author',
    designation: 'Designer',
    largeDescription: 'CMS biography',
    profileImage: file,
  };
  const raw = {
    documentId: 'resource-1',
    slug: 'native-resource',
    title: 'Native CMS title',
    description: 'Native description',
    publishedAt: '2026-11-02T00:00:00.000Z',
    publicationDate: '2025-03-04',
    lastUpdatedDate: '2026-10-30',
    readingTime: 12,
    resourceType: { documentId: 'articles', name: 'Articles', slug: 'articles' },
    topics: [{ documentId: 'topic-1', name: 'AI' }],
    stage: { documentId: 'stage-1', name: 'Growth' },
    thumbnail: file,
    heroBanner: { mediaType: 'image', image: file },
    writtenBy: person,
    coAuthors: [{ ...person, documentId: 'author-2', name: 'Co Author' }],
    showTableOfContents: true,
    outline: [{ anchorId: 'authored-anchor', label: 'Short navigation label' }],
    body: [
      {
        __typename: 'ComponentResourceSectionHeading',
        id: '1',
        heading2: 'Authored heading',
        anchorId: 'authored-anchor',
      },
      {
        __typename: 'ComponentResourceRichText',
        id: '2',
        body: '**Bold** [safe link](https://example.com) and [jump](#authored-heading)',
      },
      {
        __typename: 'ComponentResourceImageGrid',
        id: '3',
        gridColumns: 'one',
        showCaptions: true,
        images: [file, file],
      },
      {
        __typename: 'ComponentResourceTable',
        id: '4',
        tableColumns: [{ heading: 'Feature' }, { heading: 'Detail' }],
        tableRows: [
          {
            rowHeading: 'CMS row',
            cells: [
              {
                content: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: 'Bold cell', bold: true }],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        __typename: 'ComponentResourceCallout',
        id: '5',
        heading: 'CMS note',
        body: 'Note text',
      },
      {
        __typename: 'ComponentResourceInsights',
        id: '6',
        insightsTitle: 'CMS insight',
        body: 'Insight text',
      },
      {
        __typename: 'ComponentResourceVideo',
        id: '7',
        mediaType: 'youtube',
        youtubeUrl: 'https://youtu.be/abcdefghijk',
      },
      {
        __typename: 'ComponentResourceEmbed',
        id: '8',
        embedTitle: 'CMS embed',
        embedCode: '<iframe src="https://example.com/embed"></iframe>',
      },
      {
        __typename: 'ComponentResourceCode',
        id: '9',
        codeSnippet: '<script>literal code</script>',
      },
      { __typename: 'ComponentResourceSeparator', id: '10', title: 'CMS separator' },
      {
        __typename: 'ComponentResourceEmbed',
        id: '11',
        embedTitle: 'CMS diagram',
        embedCode:
          '<figure><svg xmlns="" viewBox="0 0 600 400"><desc>CMS diagram description</desc><rect width="600" height="400" fill="white"/></svg><p>CMS diagram description</p></figure>',
      },
    ],
    cta: {
      ctaType: 'button',
      heading: 'CMS CTA',
      description: 'CTA copy',
      button: { name: 'Talk to us', href: '/contact' },
    },
    seo: {
      metaTitle: 'Native SEO',
      metaDescription: 'Native SEO description',
      robot: 'noindex,follow',
      canonicalURL: 'https://www.tcules.com/insights/native-resource',
    },
  };
  raw.exploreOtherResources = {
    title: 'Chosen resources',
    resourceOne: {
      ...raw,
      documentId: 'related-1',
      slug: 'guides/related',
      resourceType: { documentId: 'guides', name: 'Guides', slug: 'guides' },
    },
  };
  const page = mapResource(raw);
  assert.equal(page.title, raw.title);
  assert.equal(page.blocks.length, 11);
  assert.equal(page.blocks[0].anchorId, 'authored-anchor');
  assert.equal(page.outline[0].label, 'Short navigation label');
  assert.match(page.blocks[1].html, /href="#authored-anchor"/);
  const retiredAnchor = mapResource({
    ...raw,
    slug: 'ai-search-in-saas-should-search-and-the-ai-assistant-be-one-input',
    body: [
      {
        __typename: 'ComponentResourceSectionHeading',
        id: '1',
        heading2: 'The updated section',
        anchorId: 'toc-7',
      },
      {
        __typename: 'ComponentResourceRichText',
        id: '2',
        body: '[Jump](#one-field-two-modes-our-eden-ai-redesign)',
      },
    ],
  });
  assert.match(retiredAnchor.blocks[1].html, /href="#toc-7"/);
  assert.equal(page.blocks[2].columns, 1);
  assert.equal(page.blocks[2].figures[0].caption, 'CMS caption');
  assert.equal(page.blocks[3].table.rows[0].header, 'CMS row');
  assert.match(page.blocks[3].table.rows[0].cellsHtml[0], /<strong>Bold cell<\/strong>/);
  assert.equal(page.blocks[6].youtubeId, 'abcdefghijk');
  assert.equal(page.blocks[7].url, 'https://example.com/embed');
  assert.ok(!page.blocks[8].html.includes('<script>'));
  assert.match(page.blocks[10].diagram.src, /^data:image\/svg\+xml/);
  assert.equal(page.blocks[10].diagram.width, 600);
  assert.equal(page.blocks[10].description, 'CMS diagram description');
  assert.ok(
    decodeURIComponent(page.blocks[10].diagram.src).includes(
      'xmlns="http://www.w3.org/2000/svg"',
    ),
  );
  assert.throws(
    () =>
      mapResource({
        ...raw,
        body: [
          {
            ...raw.body[10],
            embedCode: '<svg viewBox="0 0 1 1"><script>alert(1)</script></svg>',
          },
        ],
      }),
    /invalid SVG/,
  );
  assert.equal(page.heroVideo, undefined);
  assert.equal(page.featureImage.src, 'https://new-cms.example/uploads/resource.webp');
  assert.equal(page.authors.length, 2);
  assert.equal(page.publishedContent, '2025-03-04');
  assert.equal(page.updatedAt, '2026-10-30');
  assert.equal(page.readingTime, '12 min');
  assert.equal(page.resourcesHeading, 'Chosen resources');
  assert.equal(page.resources[0].kind, 'guide');
  assert.equal(page.cta.actions[0].href, '/contact');
  assert.deepEqual(page.seo.robots, { index: false, follow: true });
  assert.deepEqual(mapResource({ ...raw, showTableOfContents: false }).outline, []);
  assert.equal(
    mapResource({
      ...raw,
      resourceType: { documentId: 'guides', name: 'Guides', slug: 'guides' },
    }).kind,
    'guide',
  );
  assert.throws(
    () => mapResource({ ...raw, body: [{ __typename: 'UnknownComponent', id: '1' }] }),
    /Unsupported resource body/,
  );

  const records = Array.from({ length: 105 }, (_, i) => ({
    ...raw,
    documentId: `resource-${i}`,
    slug: `resource-${i}`,
  }));
  const requests = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, process.env.STRAPI_CASE_STUDY_GRAPHQL_URL);
    assert.equal(options.headers.authorization, 'Bearer test-token');
    assert.equal(options.next.revalidate, 300);
    assert.ok(options.signal instanceof AbortSignal);
    const request = JSON.parse(options.body);
    requests.push(request);
    assert.match(request.query, /status: PUBLISHED/);
    const data = request.query.includes('query PublishedResources(')
      ? {
          resources_connection: {
            nodes: records.slice(
              (request.variables.page - 1) * 100,
              request.variables.page * 100,
            ),
            pageInfo: { total: 105, page: request.variables.page, pageCount: 2 },
          },
        }
      : { resources: request.variables.slug === raw.slug ? [raw] : [] };
    return Response.json({ data });
  };
  assert.equal((await listPublishedResources()).length, 105);
  assert.deepEqual(
    requests.slice(0, 2).map((request) => request.variables.page),
    [1, 2],
  );
  assert.equal(
    (await resourceInsightsSource.getInsightsPage('insights')).resources.items.length,
    105,
  );
  assert.equal((await resourceAuthorsSource.listAuthors()).length, 2);
  assert.equal((await resourceAuthorsSource.getAuthorPage('cms-author')).pieceCount, 105);
  assert.equal(await getPublishedResource('unknown-resource'), null);
  const before = requests.length;
  assert.equal(await getPublishedResource('../invalid'), null);
  assert.equal(requests.length, before);
  assert.equal((await getPublishedResource('native-resource')).title, raw.title);
  for (const response of [
    { errors: [{ message: 'Forbidden' }], data: null },
    { data: {} },
    { data: { resources: [{ ...raw, publishedAt: null }] } },
  ]) {
    globalThis.fetch = async () => Response.json(response);
    await assert.rejects(getPublishedResource('native-resource'), /CMS/);
  }
  globalThis.fetch = async () => new Response('Unavailable', { status: 503 });
  await assert.rejects(getPublishedResource('native-resource'), /HTTP 503/);
  globalThis.fetch = async () =>
    Response.json({
      data: {
        resources_connection: { nodes: [raw], pageInfo: { total: 105, page: 1, pageCount: 1 } },
      },
    });
  await assert.rejects(listPublishedResources(), /incomplete collection/);
  console.log(
    'Resources contract checks passed: shared endpoint, pagination beyond 100, native body types, authored anchors/dates, media, authors, related content, CTA, SEO and API failures.',
  );

  if (process.argv.includes('--live')) {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (originalEnv[key] == null) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
    const inventory = await listPublishedResources();
    const types = {};
    const bodyTypes = new Set();
    const report = [];
    for (let i = 0; i < inventory.length; i += 4) {
      await Promise.all(
        inventory.slice(i, i + 4).map(async (card) => {
          const native = await getPublishedResource(card.slug);
          const mapped = mapResource(native);
          assert.equal(mapped.title, card.title);
          assert.equal(
            mapped.kind,
            {
              articles: 'article',
              guides: 'guide',
              videos: 'video',
              events: 'event',
              podcasts: 'podcast',
              research: 'research',
              interviews: 'interview',
            }[card.resourceType.slug],
          );
          assert.equal(
            mapped.blocks.length,
            native.body.length,
            `Dropped body content in ${card.slug}`,
          );
          assert.equal(
            mapped.outline.length,
            native.showTableOfContents === false ? 0 : native.outline.length,
          );
          assert.equal(
            mapped.authors.length,
            [native.writtenBy, ...(native.coAuthors || [])].filter(Boolean).length,
          );
          assert.equal(mapped.seo.title, native.seo.metaTitle);
          assert.equal(mapped.publishedContent, native.publicationDate || undefined);
          const targets = new Set(
            mapped.blocks.flatMap((block) =>
              block.type === 'heading'
                ? [block.anchorId]
                : typeof block.html === 'string'
                  ? [...block.html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1])
                  : [],
            ),
          );
          for (const block of mapped.blocks)
            if (typeof block.html === 'string') {
              for (const link of block.html.matchAll(/href="#([^"]+)"/gu)) {
                assert.ok(
                  targets.has(link[1]),
                  `Unresolved article link ${link[1]} in ${card.slug}`,
                );
              }
            }
          for (const block of mapped.blocks.filter((block) => block.type === 'embed')) {
            assert.ok(
              block.url || block.thumbnail || block.diagram,
              `Empty embed in ${card.slug}`,
            );
          }
          for (const block of native.body) bodyTypes.add(block.__typename);
          types[mapped.kind] = (types[mapped.kind] || 0) + 1;
          report.push({
            slug: card.slug,
            kind: mapped.kind,
            blocks: mapped.blocks.length,
            title: mapped.title,
          });
        }),
      );
      console.log(
        `  Verified ${Math.min(i + 4, inventory.length)}/${inventory.length} resources`,
      );
    }
    assert.equal(await getPublishedResource('preview-resource-that-does-not-exist'), null);
    writeFileSync(
      '/tmp/tcules-resources-live-check.json',
      JSON.stringify(
        { total: report.length, types, bodyTypes: [...bodyTypes], resources: report },
        null,
        2,
      ),
    );
    console.log(
      `Live production checks passed: ${report.length} resources; ${JSON.stringify(types)}.`,
    );
  }
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value == null) delete process.env[key];
    else process.env[key] = value;
  }
  rmSync(directory, { recursive: true, force: true });
}
