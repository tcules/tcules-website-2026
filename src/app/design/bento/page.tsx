import { Layout, Media, Section } from '@/components';
import { getKitPhoto, HOME_SECTOR_PHOTOS } from '@/lib/photos';
import { ROUTES } from '@/lib/routes';
import type { SketchName } from '@/lib/sketches';
import { Bento, BlockCard, ServiceTile, type BentoItem } from '@/patterns';

import { Variation } from '../_specimen/Variation';
import t from '../_specimen/typeroles.module.css';

/**
 * /design/bento — linked tiles of two sizes on four tracks over one continuous texture per row
 * (home "What we do", owner 19 Oct 2026, mocks S3). The six-tile diagonal home ships, the even
 * four-up row, a two-wide row, the tint, ink and blue grounds, and one tile on its own as a card in
 * another set (ServiceTile, 29 Oct 2026): a related service, a related expertise with its photo, and
 * the wide tile that takes a row it would otherwise sit alone on. Hover a tile: it lifts 2px, its hairline and
 * texture turn blue and its title takes the accent.
 */

const PD_SEVEN = (
  [
    ['ux-research', 'UX Research', 'Teams about to spend on an assumption nobody has tested', 'specialist-research', '/services/product-design/ux-research'],
    ['ia', 'Information Architecture & Workflow Design', 'Products where work passes between people, or the menu keeps growing', 'specialist-ia', '/services/product-design/information-architecture-workflow-design'],
    ['ui', 'Interaction & UI Design', 'Products whose structure works but whose screens confuse people', 'specialist-ui', '/services/product-design/interaction-ui-design'],
    ['dataviz', 'Data Visualisation', 'Dashboards that people export to a spreadsheet', 'specialist-dataviz', '/services/product-design/data-visualisation'],
    ['prototyping', 'Prototyping & Usability Testing', 'Choosing between directions before engineers start', 'specialist-prototype', '/services/product-design/prototyping-usability-testing'],
    ['new-product', 'New Product Design & First Release', 'Founders turning an idea or prototype into an MVP', 'specialist-new-product', '/services/new-product-design-first-release'],
    ['audit', 'UX & Product Audit', 'Teams who know something is wrong but not yet what', 'specialist-audit', '/audits/ux-product-audit'],
  ] as const
).map(([id, title, body, scene, href]) => ({ id, title, body, href, scene })) satisfies BentoItem[];

const tiles = (rows: readonly (readonly [string, string, string])[], scenes: readonly SketchName[]) =>
  rows.map(([title, body, href], i) => ({
    id: href,
    title,
    body,
    href,
    scene: scenes[i] as SketchName,
  })) satisfies BentoItem[];

const AI_SIX = tiles(
  [
    ['AI Copilots & Agents', 'Teams putting an assistant inside the product', '/services/ai-product-ux/copilots-agents'],
    ['AI Search & Recommendations', 'Products where people cannot find what they need', '/services/ai-product-ux/search-recommendations'],
    ['Human-in-the-Loop Workflows', 'Teams whose AI needs a person to review', '/services/ai-product-ux/human-in-the-loop'],
    ['Trust, Control & Recovery', 'Products where people must be able to undo the AI', '/services/ai-product-ux/trust-control-recovery'],
    ['AI Readiness', 'Teams deciding where AI belongs', '/services/ai-product-ux/ai-readiness'],
    ['AI Product Engineering', 'Teams that need the AI feature built', '/services/ai-product-ux/ai-product-engineering'],
  ],
  ['specialist-ai-copilots', 'specialist-ai-search', 'specialist-ai-hitl', 'specialist-ai-trust', 'specialist-ai-readiness', 'specialist-ai-engineering'],
);

const DS_FIVE = tiles(
  [
    ['Design System Strategy', 'Products that must share one scope', '/services/design-systems/strategy'],
    ['Implementation', 'Components built in Figma, then in code', '/services/design-systems/implementation'],
    ['Alignment', 'Library and code that have drifted apart', '/services/design-systems/alignment'],
    ['Governance', 'Teams contributing to one system', '/services/design-systems/governance'],
    ['Design System Audit', 'Products with local copies of the library', '/services/design-systems/audit'],
  ],
  ['specialist-ds-strategy', 'specialist-ds-implementation', 'specialist-ds-alignment', 'specialist-ds-governance', 'specialist-ds-audit'],
);

const SD_SEVEN = tiles(
  [
    ['SaaS App Development', 'A new workflow added to a live product', '/services/software-development/saas-app'],
    ['Frontend Development', 'One layout on desktop and phone', '/services/software-development/frontend'],
    ['Backend Development', 'Data, sign-in and rules behind the product', '/services/software-development/backend'],
    ['Maintenance & Support', 'The team that knows the product', '/services/software-development/maintenance'],
    ['Mobile App Development', 'The task people do away from a desk', '/services/software-development/mobile'],
    ['Prototype Review', 'One flow read for what holds up', '/services/software-development/prototype-review'],
    ['Redesign Implementation', 'A cluttered screen made clean', '/services/software-development/redesign'],
  ],
  ['specialist-saas-app', 'specialist-frontend', 'specialist-backend', 'specialist-maintenance', 'specialist-mobile', 'specialist-prototype-review', 'specialist-redesign'],
);

const SIX: BentoItem[] = [
  {
    id: 'pd',
    title: 'Product Design',
    body: 'Research, workflows, interface design, prototyping and testing.',
    href: ROUTES.productDesign,
    scene: 'product-design',
    span: 2,
  },
  {
    id: 'pm',
    title: 'Product Modernisation',
    body: 'Improving established software without breaking what customers rely on.',
    href: ROUTES.productModernisation,
    scene: 'product-modernisation',
  },
  {
    id: 'ds',
    title: 'Design Systems',
    body: 'One set of components and rules, shared by design and code.',
    href: ROUTES.designSystems,
    scene: 'design-systems',
  },
  {
    id: 'ai',
    title: 'AI Product UX',
    body: 'AI features people understand, trust and stay in control of.',
    href: ROUTES.aiProductUx,
    scene: 'ai-product-ux',
  },
  {
    id: 'de',
    title: 'Design Engineering',
    body: 'Design built and checked in real code.',
    href: ROUTES.designEngineering,
    scene: 'design-engineering',
  },
  {
    id: 'sd',
    title: 'Software Development',
    body: 'Our engineers turn the design into working software, with the designers beside them.',
    href: ROUTES.softwareDevelopment,
    scene: 'software-development',
    span: 2,
  },
];

const single: BentoItem[] = SIX.map((item) => ({ ...item, span: 1 }));

export default function BentoSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <p className={t.eyebrow}>Pattern · tier 2</p>
          <h1>Bento</h1>
          <p className={t.lead}>
            Linked tiles of two sizes on four tracks, each its destination&rsquo;s name, one
            line and its Sketch scene. Every tile shows its hairline at rest. Behind the
            drawings, one texture per row: the pixel grid through a feathered wave drawn across
            the row and clipped by each tile, so it reads as one field. Neutral at rest; the
            hovered tile turns blue and lifts.
          </p>
        </Layout>
      </Section>

      <Variation
        id="six"
        title="1 · Six on a diagonal (home)"
        note="Wide, single, single / single, single, wide. The first row's wave and the second's run on across their tiles at 1024 and up. Two across from 768 with the wide tiles on rows of their own; one across below, each tile its own wave."
      />
      <Section>
        <Bento items={SIX} />
      </Section>

      <Variation
        id="four"
        title="2 · Four single tiles a row"
        note="Any count without spans: four across from 1024, each row's wave running on across its four tiles."
      />
      <Section>
        <Bento items={single.slice(0, 4)} />
      </Section>

      <Variation
        id="three-tracks"
        title="2b · Peers on three tracks (tracks={3})"
        note="Five destinations of one weight (owner, 26 Oct 2026, product-design specialist services): every tile one size, three a row from 1024 and the last row left-aligned; spans are ignored. Each row's wave runs on across its three tiles."
      />
      <Section>
        <Bento
          tracks={3}
          items={(
            [
              [
                'ux-research',
                'UX Research',
                'Find out how people really use your product.',
                'specialist-research',
              ],
              [
                'ia',
                'Information Architecture & Workflow Design',
                'Make complex products easy to navigate.',
                'specialist-ia',
              ],
              [
                'ui',
                'Interaction & UI Design',
                'Screens and interactions that make the next step obvious.',
                'specialist-ui',
              ],
              [
                'dataviz',
                'Data Visualisation',
                'Dashboards and charts people can act on.',
                'specialist-dataviz',
              ],
              [
                'prototyping',
                'Prototyping & Usability Testing',
                'Test ideas before you build them.',
                'specialist-prototype',
              ],
            ] as const
          ).map(([id, title, body, scene]) => ({ id, title, body, scene, href: `#${id}` }))}
        />
      </Section>

      <Variation
        id="seven-note"
        title="2c · Seven peers on four tracks, the closing words in the eighth cell"
        note="`tracks={4}` with seven tiles is 4 + 3; `note` puts the band's closing paragraph in the cell the last row leaves, unframed and untextured, so it reads as the row's last word, never an eighth destination (owner, 29 Oct 2026, Q7, /services/product-design). Below 1024 the note takes a row of its own."
      />
      <Section>
        <Bento
          tracks={4}
          note={
            <>
              Want the riskiest screens tried in code, or the whole product built?{' '}
              <a href="#de">Design Engineering</a> and <a href="#sd">Software Development</a>{' '}
              carry the design on.
            </>
          }
          items={(
            [
              [
                'ux-research',
                'UX Research',
                'Teams about to spend on an assumption nobody has tested',
                'specialist-research',
              ],
              [
                'ia',
                'Information Architecture & Workflow Design',
                'Products where work passes between people, or the menu keeps growing',
                'specialist-ia',
              ],
              [
                'ui',
                'Interaction & UI Design',
                'Products whose structure works but whose screens confuse people',
                'specialist-ui',
              ],
              [
                'dataviz',
                'Data Visualisation',
                'Dashboards that people export to a spreadsheet',
                'specialist-dataviz',
              ],
              [
                'prototyping',
                'Prototyping & Usability Testing',
                'Choosing between directions before engineers start',
                'specialist-prototype',
              ],
              [
                'new-product',
                'New Product Design & First Release',
                'Founders turning an idea or prototype into an MVP',
                'specialist-new-product',
              ],
              [
                'audit',
                'UX & Product Audit',
                'Teams who know something is wrong but not yet what',
                'specialist-audit',
              ],
            ] as const
          ).map(([id, title, body, scene]) => ({ id, title, body, scene, href: `#${id}` }))}
        />
      </Section>

      <Variation
        id="title-only"
        title="2d · Title and drawing, no body"
        note="`body` is optional (component-map C11/C17): a set whose copy names each destination and says nothing more, as home's &ldquo;One studio&rdquo; row of four. Every tile or none."
      />
      <Section>
        <Bento
          items={single.slice(2, 6).map((item) => ({ ...item, body: undefined }))}
          tracks={4}
        />
      </Section>

      <Variation
        id="pair"
        title="3 · Two wide tiles"
        note="2 + 2: each tile's drawing beside its words, at the wide scale."
      />
      <Section>
        <Bento items={[SIX[0]!, { ...SIX[5]! }]} />
      </Section>

      <Variation
        id="tint"
        title="4 · Tint ground"
        note="Every --bnt-* token restated on tint: the hairline steps to neutral-300 and the texture to neutral-600, so both still read on paper-deep."
      />
      <Section surface="tint">
        <Bento items={SIX} />
      </Section>

      <Variation
        id="ink"
        title="5 · Ink ground"
        note="Declared for self-containment: white titles, a neutral-800 hairline lifting to brandeis-700, a neutral-600 texture lifting to brandeis-300. Home sets the band on paper."
      />
      <Section surface="ink">
        <Bento items={SIX} />
      </Section>

      <Variation
        id="blue"
        title="6 · Blue ground"
        note="Declared for self-containment: white titles, a brandeis-400 hairline, a brandeis-300 texture lifting to white."
      />
      <Section surface="blue">
        <Bento items={SIX} />
      </Section>

      <Variation
        id="service-tile"
        title="7 · ServiceTile — a related service as a card in another set"
        note="Services named as a set are always the service tile (owner, 29 Oct 2026). One named beside other cards, as an insights shelf's related service, is ONE bento tile in that grid: the same hairline, texture and hover, its wave fitted to itself. As a card (owner, 29 Oct 2026): the copy's own words before the link as its mono eyebrow (&ldquo;Our related service&rdquo;), the title, the flat drawing centred in the spare height, &ldquo;Explore the service&rdquo; at the foot."
      />
      <Section>
        <Layout as="ul" columns={{ md: 3 }} colGap="gutter" rowGap="column">
          <BlockCard
            title="How to choose a product design agency and test the fit"
            body="What to check before you hire, and how a studio compares with a freelancer, an in-house hire or a development company."
            href="#service-tile"
            frame="panel"
            icon="notebook"
            eyebrow="Guide"
            size="sm"
            tracks={3}
            cue="title"
            compact
          />
          <BlockCard
            title="Does my SaaS need a mobile app? A moment-by-moment test"
            body="The answer lies in the work that happens away from a desk and cannot wait."
            href="#service-tile"
            frame="panel"
            icon="document-text"
            eyebrow="Article"
            size="sm"
            tracks={3}
            cue="title"
            compact
          />
          <li>
            <ServiceTile
              title="New Product Design & First Release"
              eyebrow="Our related service"
              href={ROUTES.services}
              scene="new-product"
              action="Explore the service"
            />
          </li>
        </Layout>
      </Section>

      <Variation
        id="expertise-tile"
        title="8 · ServiceTile — a related expertise, with its sector photograph"
        note="The same card for an expertise (&ldquo;Our related expertise&rdquo;): the expertise's sector photograph in the drawing's place, as home shows it, or its labelled placeholder, never another subject's picture; &ldquo;Explore the expertise&rdquo; at the foot."
      />
      <Section>
        <Layout as="ul" columns={{ md: 3 }} colGap="gutter" rowGap="column">
          <BlockCard
            title="CPQ UX design: quoting software sales reps choose over spreadsheets"
            body="Design quoting software around the quote that several roles contribute to."
            href="#expertise-tile"
            frame="panel"
            icon="document-text"
            eyebrow="Article"
            size="sm"
            tracks={3}
            cue="title"
            compact
          />
          <BlockCard
            title="SaaS user engagement: measure the behaviour that shows customers getting value"
            body="Why fewer sessions can mean a better product."
            href="#expertise-tile"
            frame="panel"
            icon="notebook"
            eyebrow="Guide"
            size="sm"
            tracks={3}
            cue="title"
            compact
          />
          <li>
            <ServiceTile
              title="B2B SaaS and workflow software"
              eyebrow="Our related expertise"
              href={ROUTES.b2bSaasWorkflow}
              picture={
                <Media
                  image={getKitPhoto(HOME_SECTOR_PHOTOS[ROUTES.b2bSaasWorkflow]!)}
                  ratio="16/9"
                  sizes="400px"
                />
              }
              action="Explore the expertise"
            />
          </li>
        </Layout>
      </Section>

      <Variation
        id="tile-wide"
        title="9 · ServiceTile wide — the row's last card would sit alone"
        note="Where a shelf's pieces fill whole rows, the related card would be alone on a row, so it takes the whole row (`wide`, its li `data-media-row`): eyebrow, title and action beside the visual, a section apart, as every horizontal media item."
      />
      <Section>
        <Layout as="ul" columns={{ md: 3 }} colGap="gutter" rowGap="column">
          {['Article', 'Guide', 'Guide'].map((format, index) => (
            <BlockCard
              key={index}
              title="Does my SaaS need a mobile app? A moment-by-moment test"
              body="The answer lies in the work that happens away from a desk and cannot wait."
              href="#tile-wide"
              frame="panel"
              icon={format === 'Article' ? 'document-text' : 'notebook'}
              eyebrow={format}
              size="sm"
              tracks={3}
              cue="title"
              compact
            />
          ))}
          <li data-media-row="">
            <ServiceTile
              title="B2B SaaS and workflow software"
              eyebrow="Our related expertise"
              href={ROUTES.b2bSaasWorkflow}
              picture={
                <Media
                  image={getKitPhoto(HOME_SECTOR_PHOTOS[ROUTES.b2bSaasWorkflow]!)}
                  ratio="16/9"
                  sizes="600px"
                />
              }
              action="Explore the expertise"
              wide
            />
          </li>
          <li data-media-row="">
            <ServiceTile
              title="Design Systems"
              eyebrow="Our related service"
              href={ROUTES.designSystems}
              scene="design-systems"
              action="Explore the service"
              wide
            />
          </li>
        </Layout>
      </Section>
      <Variation
        id="cta"
        title="2c · Seven peers and two cards on three tracks (9 cells)"
        note="`cta`: one dotted card per question, each a normal cell: its question, its sentence, then its destinations as arrow links pinned to the foot; no fill, no drawing, no outline button. Tracks are chosen so tiles plus cards fill whole rows; where 3 and 4 both leave a hole, the last card takes what its row leaves. Seven tiles and two cards are nine cells: three full rows."
      />
      <Section>
        <Bento
          tracks={3}
          items={PD_SEVEN}
          cta={{
            routes: [
              {
                question: 'Want the riskiest screens tried in code, or the whole product built?',
                answer: 'Design Engineering and Software Development carry the design on.',
                actions: [
                  { label: 'Design Engineering', href: '/services/design-engineering' },
                  { label: 'Software Development', href: '/services/software-development' },
                ],
              },
              {
                question: 'Already have finished screens?',
                answer: 'Design to Code takes them from there.',
                actions: [
                  { label: 'Design to Code', href: '/services/design-engineering/design-to-code' },
                ],
              },
            ],
          }}
        />
      </Section>
      <Variation
        id="cta-one"
        title="2d · Six and one card on four tracks, the card spanning two"
        note="Seven cells fill neither three nor four tracks; four leaves the fuller last row (4 + 3), so the one card takes the last two cells."
      />
      <Section>
        <Bento
          tracks={4}
          items={AI_SIX}
          cta={{
            routes: [
              {
                question: 'Building a new AI product?',
                answer: 'New Product Design & First Release takes it from idea to MVP.',
                actions: [
                  {
                    label: 'New Product Design & First Release',
                    href: '/services/new-product-design-first-release',
                  },
                ],
              },
            ],
          }}
        />
      </Section>
      <Variation
        id="cta-statement"
        title="2e · Five and a statement card on three tracks (6 cells)"
        note="A closing statement with no question: its sentence takes the title role, then its arrow links. Six cells fill three tracks."
      />
      <Section>
        <Bento
          tracks={3}
          items={DS_FIVE}
          cta={{
            routes: [
              {
                answer:
                  'One hard interaction to try in code is Design Engineering; one difficult component, such as a data table, is Frontend Design Systems.',
                actions: [
                  { label: 'Design Engineering', href: '/services/design-engineering' },
                  {
                    label: 'Frontend Design Systems',
                    href: '/services/design-systems/frontend-design-systems',
                  },
                ],
              },
            ],
          }}
        />
      </Section>
      <Variation
        id="cta-three-actions"
        title="2f · Seven and one card on four tracks (8 cells), three actions"
        note="One question, both sentences, three arrow links stacked. Eight cells fill four tracks."
      />
      <Section>
        <Bento
          tracks={4}
          items={SD_SEVEN}
          cta={{
            routes: [
              {
                question: 'Have engineers ready to build?',
                answer:
                  'Product Design gives them designs for every state, and Design Engineering takes the hardest interfaces into code inside your product. If you already hold an early build, a Prototype Readiness Review shows how close it is to launch.',
                actions: [
                  { label: 'Product Design', href: '/services/product-design' },
                  { label: 'Design Engineering', href: '/services/design-engineering' },
                  {
                    label: 'Prototype Readiness Review',
                    href: '/audits/prototype-readiness-review',
                  },
                ],
              },
            ],
          }}
        />
      </Section>
      <Variation
        id="cta-row"
        title="2g · Three and two cards on three tracks, the last card spanning two"
        note="Five cells fill neither; three tracks leave the fuller last row (3 + 2), so the second card takes the last two cells."
      />
      <Section>
        <Bento
          tracks={3}
          items={PD_SEVEN.slice(0, 3)}
          cta={{
            routes: [
              {
                question: 'Want it built, not only designed?',
                answer: 'Software Development carries the design on.',
                actions: [{ label: 'Software Development', href: '/services/software-development' }],
              },
              {
                question: 'Already have finished screens?',
                answer: 'Design to Code takes them from there.',
                actions: [
                  { label: 'Design to Code', href: '/services/design-engineering/design-to-code' },
                ],
              },
            ],
          }}
        />
      </Section>
      <Variation
        id="cta-tint"
        title="2h · The CTA card on tint"
        note="the dotted outline's ink restated on tint (neutral-400)"
      />
      <Section surface="tint">
        <Bento
          tracks={3}
          items={PD_SEVEN}
          cta={{
            routes: [
              {
                question: 'Want the riskiest screens tried in code, or the whole product built?',
                answer: 'Design Engineering and Software Development carry the design on.',
                actions: [
                  { label: 'Design Engineering', href: '/services/design-engineering' },
                  { label: 'Software Development', href: '/services/software-development' },
                ],
              },
              {
                question: 'Already have finished screens?',
                answer: 'Design to Code takes them from there.',
                actions: [
                  { label: 'Design to Code', href: '/services/design-engineering/design-to-code' },
                ],
              },
            ],
          }}
        />
      </Section>
    </>
  );
}
