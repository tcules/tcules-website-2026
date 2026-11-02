/** Expertise singleton contract. --live additionally reads the published production listing. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';
const directory = mkdtempSync(join(tmpdir(), 'expertise-listing-check-'));
const originalFetch = globalThis.fetch;
const keys = [
  'STRAPI_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_API_TOKEN',
];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
try {
  const output = join(directory, 'listing.cjs');
  await build({
    stdin: {
      contents: `export * from './src/content/sources/strapi/expertise-listing'; export {inlineToText} from './src/lib/inline'; export {DestinationGroupsBand} from './src/templates/CorpusPage/HubBands'; export {createElement} from 'react'; export {renderToStaticMarkup} from 'react-dom/server';`,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    outfile: output,
    bundle: true,
    format: 'cjs',
    platform: 'node',
    plugins: [
      {
        name: 'render-test-styles',
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
    getExpertiseListingPage,
    mapExpertiseListing,
    inlineToText,
    DestinationGroupsBand,
    createElement,
    renderToStaticMarkup,
  } = createRequire(import.meta.url)(output);
  const document = {
    route: '/expertise',
    frontmatter: {
      route: '/expertise',
      slug: 'expertise',
      page_type: 'expertise_hub',
      seo: { title: 'Snapshot SEO' },
      navigation: {
        breadcrumb: [
          { name: 'Home', url: '/' },
          { name: 'Expertise', url: '/expertise' },
        ],
      },
      render: { band_order: ['product-types', 'faq', 'enquiry'] },
      page_composition: {},
      conversion: {
        form: 'project_enquiry',
        anchor: 'enquiry',
        visible_fields: ['Email'],
        submit_label: 'Send enquiry',
        on_success: {
          heading: 'Snapshot success',
          body: 'Snapshot reply time',
          retain_entered_data: true,
        },
      },
    },
    body: '# Snapshot hero\n\nSnapshot description.\n\n## Snapshot directory {#product-types}\n\nSnapshot intro.\n\n### Snapshot group\n\n| Page | Best for | How |\n| --- | --- | --- |\n| [Stale page](/expertise/stale-page) | Stale fit | Stale approach |\n\n## Snapshot FAQ {#faq}\n\n### Snapshot question?\n\nSnapshot answer.\n\n## Snapshot enquiry {#enquiry}\n\nSnapshot enquiry copy.\n\n**Enquiry form**\n\n- Email\n- What are you working on?\n- Product or company URL (optional)\n\n**Submit:** Send enquiry\n\n**After sending:** Snapshot reply.',
  };
  const listing = {
    documentId: 'listing',
    title: 'Native CMS expertise',
    updatedAt: '2026-11-02T00:00:00Z',
    hero: {
      eyebrow: 'Native eyebrow',
      description: 'Native first paragraph.\n\nNative second paragraph.',
      actions: [{ name: 'Discuss your product', href: '#enquiry' }],
    },
    content: [
      {
        __typename: 'ComponentListingExpertiseDirectory',
        id: 'directory',
        heading: 'Native directory',
        description: 'Native introduction.',
        groups: [
          {
            id: 'one',
            heading: 'Native first group',
            expertises: [
              {
                documentId: 'fintech',
                slug: 'fintech',
                href: '/expertise/fintech',
                title: 'Native FinTech card',
                bestFor: 'Native finance fit',
                designApproach: 'Native finance approach',
                image: {
                  url: '/uploads/finance.webp',
                  width: 1600,
                  height: 900,
                  mime: 'image/webp',
                  alternativeText: 'Native image alt',
                  formats: {
                    small: { url: '/uploads/finance-small.webp', width: 320, height: 180 },
                  },
                },
              },
            ],
          },
          {
            id: 'two',
            heading: 'Native second group',
            expertises: [
              {
                documentId: 'healthtech',
                slug: 'healthtech',
                href: '/expertise/healthtech',
                title: 'Native HealthTech card',
                bestFor: 'Native health fit',
                designApproach: 'Native health approach',
                image: null,
              },
            ],
          },
        ],
      },
    ],
    faqSection: {
      heading: 'Native questions',
      description: 'Native FAQ lead.',
      faqs: [
        {
          documentId: 'faq',
          question: 'Native question?',
          isActive: true,
          answer: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Native answer ', bold: true },
                {
                  type: 'link',
                  url: '/case-studies/benchmark-gensuite-enterprise-suite-modernisation',
                  children: [{ type: 'text', text: 'Dealpath' }],
                },
              ],
            },
            {
              type: 'list',
              format: 'ordered',
              children: [
                {
                  type: 'list-item',
                  children: [{ type: 'text', text: 'Native ordered detail' }],
                },
              ],
            },
          ],
        },
        {
          documentId: 'inactive',
          question: 'Inactive question?',
          isActive: false,
          answer: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Inactive answer' }] },
          ],
        },
      ],
    },
    cta: {
      heading: 'Native enquiry',
      description: 'Native enquiry copy.',
      ctaType: 'form',
      form: {
        variant: 'enquiry',
        caption: 'Native reply caption.',
        successHeading: 'Native success',
        successBody: 'Native success body',
      },
    },
    seo: {
      metaTitle: 'Native SEO title',
      metaDescription: 'Native SEO description',
      canonicalURL: 'https://www.tcules.com/expertise',
      robot: 'noindex,nofollow',
    },
  };
  const data = { expertiseListing: listing, scopedCorpusDocument: document };
  const input = JSON.stringify(data);
  process.env.STRAPI_GRAPHQL_URL = 'https://old.example/graphql';
  process.env.STRAPI_CASE_STUDY_GRAPHQL_URL = 'https://new.example/graphql';
  process.env.STRAPI_CASE_STUDY_API_TOKEN = 'test-token';
  let payload = { data };
  let status = 200;
  let calls = 0;
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
    assert.ok(options.next.tags.includes('expertise-listing'));
    assert.ok(options.signal instanceof AbortSignal);
    const request = JSON.parse(options.body);
    assert.deepEqual(request.variables, {});
    assert.match(request.query, /expertiseListing\(status: PUBLISHED\)/);
    assert.match(request.query, /scopedCorpusDocument\(route: "\/expertise"\)/);
    assert.match(request.query, /bestFor/);
    assert.match(request.query, /designApproach/);
    return new Response(JSON.stringify(payload), { status });
  };
  const mapped = await getExpertiseListingPage();
  assert.equal(calls, 1);
  const { page } = mapped;
  assert.equal(page.hero.titleText, 'Native CMS expertise');
  assert.deepEqual(page.hero.lede.map(inlineToText), [
    'Native first paragraph.',
    'Native second paragraph.',
  ]);
  assert.equal(page.hero.actions[0].href, '#enquiry');
  assert.equal(page.seo.title, 'Native SEO title');
  assert.equal(page.seo.robots, 'noindex,nofollow');
  assert.equal(mapped.updatedAt, listing.updatedAt);
  const band = page.bands.find((band) => band.id === 'product-types');
  assert.equal(band.headingText, 'Native directory');
  assert.equal(inlineToText(band.blocks[0].runs), 'Native introduction.');
  assert.deepEqual(
    band.blocks.filter((block) => block.type === 'item').map((group) => group.headingText),
    ['Native first group', 'Native second group'],
  );
  assert.ok(!JSON.stringify(page).includes('stale-page'));
  assert.ok(!JSON.stringify(page).includes('Snapshot question'));
  const html = renderToStaticMarkup(createElement(DestinationGroupsBand, { page, band }));
  assert.ok(html.includes('Native finance fit'));
  assert.ok(html.includes('Native finance approach'));
  assert.ok(html.includes('src="https://new.example/uploads/finance.webp"'));
  assert.ok(html.includes('https://new.example/uploads/finance-small.webp'));
  assert.ok(html.includes('Native image alt'));
  const faq = page.bands.find((band) => band.id === 'faq');
  assert.equal(faq.headingText, 'Native questions');
  assert.equal(faq.blocks.filter((block) => block.type === 'item').length, 1);
  assert.ok(
    JSON.stringify(faq).includes(
      '/case-studies/legacy-saas-modernisation-information-architecture',
    ),
  );
  assert.ok(JSON.stringify(faq).includes('"type":"strong"'));
  assert.ok(JSON.stringify(faq).includes('"ordered":true'));
  const close = page.bands.find((band) => band.id === 'enquiry');
  assert.equal(close.headingText, 'Native enquiry');
  assert.equal(inlineToText(close.blocks[0].runs), 'Native enquiry copy.');
  assert.equal(
    inlineToText(close.blocks.find((block) => block.type === 'form').after),
    'Native reply caption.',
  );
  assert.equal(page.conversion.onSuccess.heading, 'Native success');
  assert.equal(JSON.stringify(data), input, 'The mapping must not mutate CMS inputs');
  const changed = structuredClone(data);
  changed.expertiseListing.content[0].groups.reverse();
  changed.expertiseListing.content[0].groups[1].expertises = [];
  const revised = mapExpertiseListing(changed);
  const revisedGroups = revised.page.bands
    .find((band) => band.id === 'product-types')
    .blocks.filter((block) => block.type === 'item');
  assert.deepEqual(
    revisedGroups.map((group) => group.headingText),
    ['Native second group', 'Native first group'],
  );
  assert.equal(revisedGroups[1].blocks[0].rows.length, 0);
  assert.ok(!JSON.stringify(revised.page.bands).includes('/expertise/fintech'));
  const optional = structuredClone(data);
  optional.expertiseListing.faqSection = null;
  optional.expertiseListing.cta = null;
  const without = mapExpertiseListing(optional);
  assert.deepEqual(without.page.bandOrder, ['product-types']);
  assert.equal(without.page.conversion, null);
  assert.equal(without.page.bands.length, 1);
  assert.equal(mapExpertiseListing({ ...data, expertiseListing: null }), null);
  assert.equal(mapExpertiseListing({ ...data, scopedCorpusDocument: null }), null);
  assert.throws(
    () => mapExpertiseListing({ ...data, expertiseListing: { ...listing, content: [] } }),
    /one directory/,
  );
  const badReference = structuredClone(data);
  badReference.expertiseListing.content[0].groups[0].expertises[0].href =
    'https://outside.example';
  assert.throws(() => mapExpertiseListing(badReference), /invalid reference/);
  delete process.env.STRAPI_CASE_STUDY_GRAPHQL_URL;
  delete process.env.STRAPI_CASE_STUDY_API_TOKEN;
  assert.ok(await getExpertiseListingPage());
  status = 503;
  await assert.rejects(getExpertiseListingPage(), /HTTP 503/);
  status = 200;
  payload = { errors: [{ message: 'Permission denied' }] };
  await assert.rejects(getExpertiseListingPage(), /Permission denied/);
  payload = {};
  await assert.rejects(getExpertiseListingPage(), /returned no data/);
  payload = { data: { expertiseListing: null, scopedCorpusDocument: null } };
  assert.equal(await getExpertiseListingPage(), null);
  console.log(
    'Expertise listing checks passed: published single type, endpoint/auth, native groups/order/removal, rendered CMS images, hero, FAQ links, form, SEO, missing content and failures.',
  );
  if (process.argv.includes('--live')) {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
    const live = await getExpertiseListingPage();
    assert.ok(live);
    assert.equal(live.page.route, '/expertise');
    assert.equal(live.page.pageType, 'expertise_hub');
    assert.ok(live.page.seo.title && live.page.seo.description && live.page.seo.canonical);
    assert.deepEqual(
      live.page.bands.map((band) => band.id),
      live.page.bandOrder,
    );
    const directoryBand = live.page.bands.find((band) => band.id === 'product-types');
    const groups = directoryBand.blocks
      .filter((block) => block.type === 'item')
      .map((group) => ({
        heading: group.headingText,
        entries: group.blocks
          .find((block) => block.type === 'table')
          .rows.map((row) => ({
            title: inlineToText(row[0]),
            href: row[0][0].href,
            bestFor: inlineToText(row[1]),
            designApproach: inlineToText(row[2]),
          })),
      }));
    assert.ok(groups.length > 0 && groups.some((group) => group.entries.length));
    assert.ok(live.page.conversion);
    const questions = live.page.bands
      .find((band) => band.id === 'faq')
      .blocks.filter((block) => block.type === 'item')
      .map((item) => item.headingText);
    assert.ok(questions.length);
    const result = {
      title: live.page.hero.titleText,
      lede: live.page.hero.lede.map(inlineToText),
      seo: live.page.seo,
      updatedAt: live.updatedAt,
      groups,
      faq: questions,
      cta: live.page.bands.find((band) => band.id === 'enquiry').headingText,
    };
    writeFileSync('/tmp/tcules-expertise-listing-live.json', JSON.stringify(result, null, 2));
    console.log(
      `Live expertise listing passed: ${groups.length} ordered groups, ${groups.reduce((count, group) => count + group.entries.length, 0)} selected cards, ${questions.length} FAQs and enquiry form.`,
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
