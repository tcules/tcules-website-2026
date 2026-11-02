/** Check the production case-study contract. Add --live to read every published case. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const directory = mkdtempSync(join(tmpdir(), 'case-study-check-'));
const output = join(directory, 'adapter.cjs');
const originalFetch = globalThis.fetch;
const envKeys = [
  'STRAPI_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_API_TOKEN',
];
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
const productionUrl = 'https://tcules-cms-2026-production.up.railway.app/graphql';

try {
  await build({
    entryPoints: ['src/content/sources/strapi/case-study.ts'],
    outfile: output,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    logLevel: 'error',
  });
  const { caseStudySource } = createRequire(import.meta.url)(output);
  for (const key of envKeys) delete process.env[key];
  process.env.STRAPI_GRAPHQL_URL = 'https://old-cms.example/graphql';

  const file = {
    url: '/uploads/case.webp',
    alternativeText: 'A product screen',
    width: 1600,
    height: 900,
    mime: 'image/webp',
    formats: { small: { url: '/uploads/small.webp', width: 320 } },
  };
  const raw = {
    documentId: 'published-case',
    slug: 'cms-case',
    title: 'Published CMS title',
    shortDescription: 'Published description',
    publishedAt: '2026-11-02T00:00:00.000Z',
    updatedAt: '2026-11-02T01:00:00.000Z',
    heroImage: file,
    thumbnail: file,
    profile: [{ id: '1', heading: 'Company', description: 'Client' }],
    statement: [{ id: '2', type: 'Problem', desc: 'Published problem' }],
    categories: [{ name: 'Enterprise' }],
    tags: [{ name: 'Modernise' }],
    caseStudyContents: Array.from({ length: 40 }, (_, index) => ({
      __typename: 'ComponentBlogAndCasestudiesBlogOrCasestudyText',
      id: String(index),
      blogContent: `## Chapter ${index + 1}\n\nPublished body ${index + 1}.`,
    })),
    seo: {
      metaTitle: 'CMS SEO',
      metaDescription: 'CMS SEO description',
      canonicalURL: 'https://www.tcules.com/case-studies/cms-case',
      robot: 'noindex,follow',
      structuredData: { '@type': 'Article' },
    },
    storyView: null,
  };
  let payload = { data: { currentCaseStudy: [raw] } };
  let status = 200;
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(url, process.env.STRAPI_CASE_STUDY_GRAPHQL_URL || productionUrl);
    const request = JSON.parse(options.body);
    assert.deepEqual(request.variables, { slug: 'cms-case', status: 'PUBLISHED' });
    assert.match(request.query, /storyView/);
    assert.equal(options.next.revalidate, 300);
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(
      options.headers.authorization,
      process.env.STRAPI_CASE_STUDY_API_TOKEN ? 'Bearer test-token' : undefined,
    );
    return new Response(JSON.stringify(payload), { status });
  };

  let page = await caseStudySource.getCaseStudyPage('cms-case');
  assert.equal(page.title, raw.title);
  assert.equal(page.blocks.length, 40);
  assert.equal(page.outline.length, 40);
  assert.equal(page.heroImage.src, new URL(file.url, productionUrl).href);
  assert.equal(page.heroImage.sources[0].width, 320);
  assert.equal(page.story, undefined);
  assert.equal(page.seo.title, 'CMS SEO');
  assert.deepEqual(page.seo.robots, { index: false, follow: true });

  const figureImage = {
    src: '/uploads/figure.webp',
    alt: 'Annotated screen',
    width: 1600,
    height: 900,
    mime: 'image/webp',
    kind: 'cut-out',
    panel: 'ink',
    shadow: false,
    sources: [{ src: '/uploads/figure-small.webp', width: 320 }],
  };
  raw.storyView = {
    slug: raw.slug,
    title: 'An obsolete duplicated title',
    categories: ['CMS category'],
    tags: [],
    chapters: [
      {
        id: 'chapter-01',
        number: '01',
        label: 'Context',
        heading: 'CMS chapter',
        parts: [
          {
            type: 'paragraphs',
            paragraphs: Array.from({ length: 125 }, (_, i) => `Paragraph ${i}`),
          },
          { type: 'quote', quote: 'CMS quote', attribution: 'Client' },
          { type: 'steps', ordered: true, items: [{ label: 'First', body: 'Act' }] },
          { type: 'principle', label: 'Principle', text: 'CMS principle' },
          {
            type: 'figures',
            figures: [
              {
                id: 'figure-1',
                image: figureImage,
                label: 'Figure 1',
                caption: 'CMS caption',
                notes: ['CMS note'],
              },
            ],
          },
        ],
      },
    ],
    closing: { label: 'Result', heading: 'CMS closing', paragraphs: ['CMS conclusion'] },
  };
  page = await caseStudySource.getCaseStudyPage('cms-case');
  assert.equal(page.story.title, raw.title);
  assert.equal(page.story.profile[0].value, 'Client');
  assert.equal(page.story.chapters[0].parts[0].paragraphs.length, 125);
  assert.deepEqual(page.story.categories, ['CMS category']);
  assert.equal(page.story.chapters[0].parts[4].figures[0].image.shadow, false);
  assert.equal(page.story.chapters[0].parts[4].figures[0].image.panel, 'ink');
  assert.equal(page.story.closing.heading, 'CMS closing');
  const validStory = structuredClone(raw.storyView);
  for (const mutate of [
    (story) => {
      story.slug = 'wrong-case';
    },
    (story) => {
      story.chapters[0].parts.push({ type: 'unsupported' });
    },
    (story) => {
      story.chapters[0].id = 'case-closing-heading';
    },
    (story) => {
      story.chapters[0].parts[4].figures[0].image.src = 'javascript:alert(1)';
    },
    (story) => {
      story.chapters[0].parts.push(story.chapters[0].parts[3]);
    },
  ]) {
    raw.storyView = structuredClone(validStory);
    mutate(raw.storyView);
    await assert.rejects(
      caseStudySource.getCaseStudyPage('cms-case'),
      /Invalid CMS case story/,
    );
  }
  raw.storyView = validStory;
  process.env.STRAPI_CASE_STUDY_GRAPHQL_URL = 'https://preview-cms.example/graphql';
  process.env.STRAPI_CASE_STUDY_API_TOKEN = 'test-token';
  assert.ok(await caseStudySource.getCaseStudyPage('cms-case'));
  const before = calls;
  for (const slug of ['', '../invalid', 'bad/slug', 'a'.repeat(201)]) {
    assert.equal(await caseStudySource.getCaseStudyPage(slug), null);
  }
  assert.equal(calls, before);
  payload = { data: { currentCaseStudy: [] } };
  assert.equal(await caseStudySource.getCaseStudyPage('cms-case'), null);
  for (const response of [
    { data: null, errors: [{ message: 'Forbidden' }] },
    { data: {} },
    { data: { currentCaseStudy: [{ ...raw, publishedAt: null }] } },
    { data: { currentCaseStudy: [{ ...raw, slug: 'wrong-case' }] } },
  ]) {
    payload = response;
    await assert.rejects(caseStudySource.getCaseStudyPage('cms-case'), /Strapi case-study/);
  }
  status = 503;
  await assert.rejects(caseStudySource.getCaseStudyPage('cms-case'), /HTTP 503/);
  console.log(
    'Case-study contract checks passed: published reads, both renderers, all story parts, media, SEO, missing pages and API errors.',
  );

  if (process.argv.includes('--live')) {
    globalThis.fetch = originalFetch;
    for (const key of envKeys) delete process.env[key];
    const response = await fetch(productionUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query:
          'query { caseStudies(status: PUBLISHED, pagination: { limit: 100 }) { slug title } }',
      }),
      signal: AbortSignal.timeout(10000),
    });
    assert.ok(response.ok);
    const listing = await response.json();
    assert.equal(listing.errors, undefined);
    assert.ok(listing.data.caseStudies.length > 0);
    let stories = 0;
    for (const record of listing.data.caseStudies) {
      const page = await caseStudySource.getCaseStudyPage(record.slug);
      assert.equal(page.title, record.title);
      assert.ok(page.publishedAt);
      assert.ok(page.story || page.blocks.length > 0);
      if (page.story) stories++;
      console.log(
        `  ${page.slug}: ${page.story ? `${page.story.chapters.length} chapters` : `${page.blocks.length} body blocks`}`,
      );
    }
    assert.equal(
      await caseStudySource.getCaseStudyPage('preview-case-that-does-not-exist'),
      null,
    );
    console.log(
      `Live production checks passed: ${listing.data.caseStudies.length} published cases (${stories} structured stories), and unknown slugs return null.`,
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
