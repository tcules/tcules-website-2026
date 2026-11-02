/** Native About single type contract. --live compares published content with the actual template. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';
const directory = mkdtempSync(join(tmpdir(), 'about-check-'));
const originalFetch = globalThis.fetch;
const keys = [
  'STRAPI_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_GRAPHQL_URL',
  'STRAPI_CASE_STUDY_API_TOKEN',
];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
const restore = () => {
  globalThis.fetch = originalFetch;
  for (const key of keys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
};
try {
  const output = join(directory, 'about.cjs');
  await build({
    stdin: {
      contents: `export * from './src/content/sources/strapi/about-document'; export {AboutPage} from './src/templates/CorpusPage/AboutPage'; export {inlineToText} from './src/lib/inline'; export {corpusMetadata} from './src/lib/corpus-metadata'; export {createElement} from 'react'; export {renderToStaticMarkup} from 'react-dom/server';`,
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
    getAboutDocument,
    mapAboutDocument,
    AboutPage,
    inlineToText,
    corpusMetadata,
    createElement,
    renderToStaticMarkup,
  } = createRequire(import.meta.url)(output);
  const rich = (value) => [{ type: 'paragraph', children: [{ type: 'text', text: value }] }];
  const head = (id, title = id) => ({
    __typename: 'ComponentServiceSectionHeading',
    id,
    anchorId: id,
    sectionHeading: title,
  });
  const image = (name) => ({
    url: `https://media.example/${name}.webp`,
    alternativeText: `CMS ${name} alt`,
    width: 1600,
    height: 900,
    mime: 'image/webp',
    formats: { small: { url: `https://media.example/${name}-small.webp`, width: 320 } },
  });
  const record = {
    documentId: 'about-single',
    title: 'CMS studio title',
    updatedAt: '2026-11-02T00:00:00.000Z',
    hero: {
      eyebrow: 'CMS studio category',
      highlightedText: 'CMS standfirst.',
      description: 'CMS opening paragraph.',
      record: 'Founded 2019 · More than 120 projects · Clients in 24 countries',
      image: image('hero'),
    },
    seo: {
      metaTitle: 'CMS About search',
      metaDescription: 'CMS About description',
      canonicalURL: 'https://www.tcules.com/about',
      robot: 'noindex nofollow',
      structuredData: {
        types: ['AboutPage', 'BreadcrumbList', 'FAQPage'],
        organization_ref: 'https://www.tcules.com/#organization',
      },
    },
    content: [
      head('what-we-do', 'CMS services'),
      {
        __typename: 'ComponentAboutServiceGrid',
        id: 'services',
        items: [
          {
            id: 'service',
            title: 'CMS service title',
            description: 'CMS service summary.',
            href: '/services/new-native-service',
          },
        ],
      },
      head('difference', 'CMS comparison'),
      {
        __typename: 'ComponentServiceRichText',
        id: 'intro',
        body: rich('CMS comparison lead.'),
      },
      {
        __typename: 'ComponentServiceLabelledList',
        id: 'differences',
        items: [
          { id: 'difference', title: 'CMS difference', body: rich('CMS difference body.') },
        ],
      },
      head('who-uses-tcules', 'CMS audiences'),
      {
        __typename: 'ComponentServiceRichText',
        id: 'audience-intro',
        body: rich('CMS audience lead.'),
      },
      {
        __typename: 'ComponentServiceLabelledList',
        id: 'audiences',
        items: [{ id: 'audience', title: 'CMS audience' }],
      },
      {
        __typename: 'ComponentServiceRichText',
        id: 'work-heading',
        body: [
          {
            type: 'heading',
            level: 3,
            children: [{ type: 'text', text: 'CMS selected work' }],
          },
        ],
      },
      {
        __typename: 'ComponentServiceCardGrid',
        id: 'cases',
        cards: [
          {
            id: 'case',
            title: 'CMS case',
            body: rich('CMS authored case summary.'),
            cover: image('case'),
            link: { name: 'CMS case', href: '/case-studies/cms-case' },
          },
        ],
      },
      {
        __typename: 'ComponentServiceRichText',
        id: 'lab',
        body: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'CMS lab sentence ' },
              {
                type: 'link',
                url: '/future-interfaces-lab',
                children: [{ type: 'text', text: 'CMS lab link' }],
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'link',
                url: '/case-studies',
                children: [{ type: 'text', text: 'All CMS cases' }],
              },
            ],
          },
        ],
      },
      head('leadership', 'CMS leadership'),
      {
        __typename: 'ComponentServiceRichText',
        id: 'leader-intro',
        body: rich('CMS leadership introduction.'),
      },
      {
        __typename: 'ComponentAboutPeople',
        id: 'people',
        people: [
          {
            documentId: 'native-person',
            name: 'CMS person',
            designation: 'CMS role',
            description: 'CMS biography.',
          },
        ],
      },
      {
        __typename: 'ComponentAboutImageStory',
        id: 'first-story',
        storyHeading: 'CMS first story',
        body: rich('CMS first story body.'),
        image: image('story-one'),
      },
      {
        __typename: 'ComponentAboutImageStory',
        id: 'second-story',
        storyHeading: 'CMS second story',
        body: rich('CMS second story body.'),
        image: image('story-two'),
      },
      {
        __typename: 'ComponentServiceLinkGroup',
        id: 'social',
        links: [{ name: 'CMS studio link', href: 'https://example.com/studio' }],
      },
      head('how-we-work', 'CMS working terms'),
      {
        __typename: 'ComponentServiceLabelledList',
        id: 'working',
        items: [{ id: 'term', title: 'CMS working title.', body: rich('CMS working body.') }],
      },
      head('company-record', 'CMS company facts'),
      {
        __typename: 'ComponentServiceTable',
        id: 'facts',
        caption: 'CMS facts caption',
        summary: 'CMS facts summary',
        tableColumns: [{ heading: 'CMS fact' }, { heading: 'CMS detail' }],
        rows: [
          { rowHeading: 'CMS company name', cells: [{ content: rich('CMS company value') }] },
        ],
      },
      head('testimonials', 'CMS client words'),
      {
        __typename: 'ComponentServiceQuote',
        id: 'quote',
        quote: 'CMS published quote.',
        attribution: 'CMS client',
        role: 'CMS client role',
        company: 'CMS client company',
        rating: 4.5,
        profileImage: image('avatar'),
      },
      head('frequently-asked-questions', 'CMS questions'),
      {
        __typename: 'ComponentServiceFaqSection',
        id: 'faq',
        faqHeading: 'CMS questions',
        faqs: [
          {
            documentId: 'active',
            question: 'CMS question?',
            answer: [
              {
                type: 'paragraph',
                children: [
                  { type: 'text', text: 'CMS answer ' },
                  { type: 'text', text: 'emphasis', bold: true },
                  {
                    type: 'link',
                    url: '/services/product-design',
                    children: [{ type: 'text', text: 'CMS answer link' }],
                  },
                ],
              },
              {
                type: 'list',
                format: 'unordered',
                children: [
                  {
                    type: 'list-item',
                    children: [{ type: 'text', text: 'CMS answer list item' }],
                  },
                ],
              },
            ],
            isActive: true,
          },
          {
            documentId: 'inactive',
            question: 'Hidden CMS question?',
            answer: rich('Hidden answer'),
            isActive: false,
          },
        ],
      },
      head('work-with-tcules', 'CMS close'),
      {
        __typename: 'AboutCta',
        id: 'close',
        ctaHeading: 'CMS close',
        description: 'CMS closing sentence.',
        ctaType: 'button',
        button: { name: 'CMS conversation', href: '/contact' },
      },
    ],
  };
  const untouched = structuredClone(record);
  const plain = (html) =>
    html
      .replace(/<\/(?:p|div|li|h[1-6]|td|th|section|article|button|summary)>/gu, ' ')
      .replace(/<[^>]*>/gu, '')
      .replace(/&quot;/gu, '"')
      .replace(/&#x27;|&#39;/gu, "'")
      .replace(/&amp;/gu, '&')
      .replace(/\s+/gu, ' ')
      .trim();
  const normalize = (value) => value.replace(/\s+/gu, ' ').trim().toLowerCase();
  const render = (document) =>
    renderToStaticMarkup(
      createElement(AboutPage, {
        page: document.page,
        avatars: document.avatars,
        caseRefs: {},
      }),
    );
  process.env.STRAPI_GRAPHQL_URL = 'https://old.example/graphql';
  process.env.STRAPI_CASE_STUDY_GRAPHQL_URL = 'https://new.example/graphql';
  process.env.STRAPI_CASE_STUDY_API_TOKEN = 'test-token';
  let failure,
    missing = false,
    calls = 0;
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
    assert.equal(options.next.revalidate, 300);
    assert.deepEqual(options.next.tags, ['about']);
    assert.equal(options.cache, 'force-cache');
    assert.ok(options.signal instanceof AbortSignal);
    const request = JSON.parse(options.body);
    assert.match(request.query, /about\(status: PUBLISHED\)/u);
    assert.doesNotMatch(request.query, /scopedCorpusDocument|corpusContent|DRAFT/u);
    assert.deepEqual(request.variables, {});
    if (failure) return failure();
    return Response.json({ data: { about: missing ? null : record } });
  };
  const mapped = await getAboutDocument();
  assert.equal(calls, 1);
  assert.equal(mapped.page.file, 'cms:/about');
  assert.equal(mapped.page.hero.titleText, record.title);
  assert.deepEqual(mapped.page.hero.lede.map(inlineToText), [
    'CMS standfirst.',
    'CMS opening paragraph.',
  ]);
  assert.deepEqual(
    mapped.page.bandOrder,
    record.content
      .filter((b) => b.__typename === 'ComponentServiceSectionHeading')
      .map((b) => b.anchorId),
  );
  assert.equal(mapped.updatedAt, record.updatedAt);
  assert.deepEqual(corpusMetadata(mapped.page).robots, { index: false, follow: false });
  assert.equal(mapped.page.seo.title, record.seo.metaTitle);
  assert.deepEqual(mapped.page.composition.caseSlugs, ['cms-case']);
  assert.equal(mapped.avatars['about-quote-quote'].src, image('avatar').url);
  assert.equal(
    mapped.structuredData['@graph'].find((n) => n['@type'] === 'FAQPage').mainEntity.length,
    1,
  );
  const html = render(mapped),
    visible = plain(html);
  for (const value of [
    'CMS service title',
    'CMS service summary.',
    'CMS difference body.',
    'CMS audience',
    'CMS person',
    'CMS biography.',
    'CMS role',
    'CMS first story body.',
    'CMS second story body.',
    'CMS authored case summary.',
    'CMS company value',
    'CMS facts caption',
    'CMS published quote.',
    'CMS answer list item',
    'CMS conversation',
  ])
    assert.ok(visible.includes(value), value);
  for (const name of ['hero', 'story-one', 'story-two', 'case', 'avatar']) {
    assert.ok(html.includes(image(name).url), `${name} image`);
    assert.ok(html.includes(image(name).alternativeText) || name === 'avatar', `${name} alt`);
    assert.ok(html.includes(image(name).formats.small.url), `${name} responsive variant`);
  }
  assert.ok(html.includes('href="/services/new-native-service"'));
  assert.ok(html.includes('href="https://example.com/studio"'));
  assert.ok(html.includes('<strong>emphasis</strong>'));
  assert.ok(!visible.includes('Hidden CMS question'));
  assert.deepEqual(record, untouched);
  const removed = structuredClone(record);
  removed.content = removed.content.filter(
    (b) =>
      ![
        'ComponentAboutPeople',
        'ComponentAboutImageStory',
        'ComponentServiceQuote',
        'ComponentServiceFaqSection',
        'AboutCta',
      ].includes(b.__typename),
  );
  const removedHtml = render(mapAboutDocument(removed));
  for (const value of [
    'CMS person',
    'CMS first story',
    'CMS published quote.',
    'CMS question?',
    'CMS conversation',
  ])
    assert.ok(!plain(removedHtml).includes(value), `removed ${value}`);
  assert.equal(mapAboutDocument(null), null);
  for (const patch of [
    { title: '' },
    { content: [{ __typename: 'UnknownComponent', id: 'unknown' }] },
    { content: [head('repeat'), head('repeat')] },
    { hero: { ...record.hero, image: { url: 'javascript:invalid' } } },
    {
      content: [
        head('testimonials'),
        {
          __typename: 'ComponentServiceQuote',
          id: 'invalid',
          quote: 'Invalid quote',
          attribution: 'Client',
          rating: 8,
        },
      ],
    },
  ])
    assert.throws(() => mapAboutDocument({ ...record, ...patch }));
  missing = true;
  assert.equal(await getAboutDocument(), null);
  missing = false;
  delete process.env.STRAPI_CASE_STUDY_GRAPHQL_URL;
  delete process.env.STRAPI_CASE_STUDY_API_TOKEN;
  await getAboutDocument();
  for (const [response, pattern] of [
    [() => new Response('', { status: 503 }), /HTTP 503/u],
    [() => Response.json({ errors: [{ message: 'Denied' }] }), /Denied/u],
    [() => Response.json({ data: null }), /no data/u],
    [() => Response.json({ data: {} }), /no About field/u],
  ]) {
    failure = response;
    await assert.rejects(getAboutDocument(), pattern);
  }
  console.log(
    'About contract passed: native components, ordering/removal, CMS images/people/cases, FAQ links, CTA, SEO/schema, endpoint, publication and failures.',
  );
  if (process.argv.includes('--live')) {
    restore();
    let source;
    globalThis.fetch = async (...args) => {
      const response = await originalFetch(...args);
      source = (await response.clone().json()).data?.about;
      return response;
    };
    const live = await getAboutDocument();
    assert.ok(live);
    const rendered = normalize(plain(render(live)));
    const texts = [];
    const nodeText = (node) => node.text ?? (node.children || []).map(nodeText).join('');
    for (const block of source.content) {
      if (block.body)
        for (const node of block.body) {
          // A paragraph made only of social links becomes separate buttons; separators are layout.
          if (
            node.children?.some((child) => child.type === 'link') &&
            node.children.every(
              (child) =>
                child.type === 'link' ||
                (child.type === 'text' && /^[\s·|,]*$/u.test(child.text)),
            )
          ) {
            texts.push(...node.children.filter((child) => child.type === 'link').map(nodeText));
          } else {
            const value = nodeText(node);
            if (value.trim()) texts.push(value);
          }
        }
      if (block.items)
        for (const item of block.items) {
          texts.push(item.title || item.label || '');
          if (item.description) texts.push(item.description);
          for (const node of item.body || []) texts.push(nodeText(node));
        }
      if (block.cards)
        for (const card of block.cards) {
          texts.push(card.title);
          for (const node of card.body || []) texts.push(nodeText(node));
        }
      if (block.people)
        for (const person of block.people)
          texts.push(person.name, person.designation, person.description);
      if (block.quote) texts.push(block.quote, block.attribution, block.role, block.company);
      if (block.rows)
        for (const row of block.rows) {
          texts.push(row.rowHeading);
          for (const cell of row.cells || [])
            for (const node of cell.content || []) texts.push(nodeText(node));
        }
      if (block.faqs)
        for (const faq of block.faqs.filter((f) => f.isActive !== false)) {
          texts.push(faq.question);
          for (const node of faq.answer) texts.push(nodeText(node));
        }
      if (block.ctaHeading) texts.push(block.ctaHeading, block.description, block.button.name);
    }
    for (const value of texts.filter(Boolean))
      assert.ok(rendered.includes(normalize(value)), `Complete published CMS text: ${value}`);
    assert.equal(
      live.page.bands.length,
      source.content.filter((block) => block.__typename === 'ComponentServiceSectionHeading')
        .length,
    );
    const result = {
      title: source.title,
      hero: source.hero,
      seo: live.page.seo,
      updatedAt: live.updatedAt,
      bands: live.page.bands.map((b) => ({ id: b.id, heading: b.headingText })),
      services: source.content.find((b) => b.__typename === 'ComponentAboutServiceGrid').items,
      people: source.content.find((b) => b.__typename === 'ComponentAboutPeople').people,
      stories: source.content
        .filter((b) => b.__typename === 'ComponentAboutImageStory')
        .map((s) => ({
          heading: s.storyHeading,
          image: s.image.url,
          alt: s.image.alternativeText,
        })),
      cases: source.content
        .find((b) => b.__typename === 'ComponentServiceCardGrid')
        .cards.map((c) => ({ title: c.title, href: c.link.href, image: c.cover.url })),
      faqs: source.content
        .find((b) => b.__typename === 'ComponentServiceFaqSection')
        .faqs.filter((f) => f.isActive !== false)
        .map((f) => f.question),
      textSegments: texts.length,
    };
    writeFileSync('/tmp/tcules-about-live.json', JSON.stringify(result, null, 2));
    console.log(
      `Published About passed: ${live.page.bands.length} sections, ${result.services.length} services, ${result.people.length} people, ${result.stories.length} studio stories, ${result.cases.length} cases, ${result.faqs.length} FAQs, ${texts.length} complete text segments rendered.`,
    );
  }
} finally {
  restore();
  rmSync(directory, { recursive: true, force: true });
}
