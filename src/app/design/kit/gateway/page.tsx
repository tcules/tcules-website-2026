import { isSituationFigureName, Layout, Section, SituationFigure } from '@/components';
import { ContentSection, Gateway, GatewayPaths, type GatewayItem, type GatewayPath } from '@/patterns';
import { servicePath } from '@/lib/routes';
import { sketchForRoute } from '@/lib/sketches';

import { Specimen } from '../../_specimen/Specimen';
import t from '../../_specimen/typeroles.module.css';

/**
 * /design/kit/gateway — the home gateway ("What do you need next?").
 *
 * On specimen paths: home's gateway left the CMS home for the stages band (owner, 23 Nov 2026), so the
 * words here are the specimen's, at home's shape — two paths, five services — and the selector
 * arrangements set each service as one situation. G.0 is home since round 11 (19 Oct 2026): the `board`, every situation at
 * once with its SituationFigure. G.1–G.3 are the round 6–7 selector and its explored alternative,
 * kept as Gateway arrangements.
 */
/** A caption strip above a band: the direction's name and what to look for. Scaffolding. */
function Variation({ id, title, note }: { id: string; title: string; note: string }) {
  return (
    <Section flush id={id}>
      <Specimen title={title} note={note}>
        {null}
      </Specimen>
    </Section>
  );
}

/* Two paths at home's shape: a new product, and one already in use. Specimen words. */
const PATHS: readonly GatewayPath[] = [
  {
    id: 'new',
    eyebrow: 'New product',
    title: 'Creating a new product',
    body: ['You have an idea or an early prototype and need a first version people can use.'],
    links: [
      { label: 'Design and launch your MVP', href: servicePath('mvp-development') },
      { label: 'Shape the product before you build', href: servicePath('product-design') },
    ],
  },
  {
    id: 'existing',
    eyebrow: 'Existing product',
    title: 'Improving a product in use',
    body: ['Customers rely on it, and it has grown harder to use, change or extend.'],
    links: [
      { label: 'Modernise an ageing product', href: servicePath('product-modernisation') },
      { label: 'Bring a design system into line', href: servicePath('design-systems') },
      { label: 'Add AI features users can check', href: servicePath('ai-product-ux') },
    ],
  },
];

export default function KitGatewayPage() {
  const heading = 'What do you need next?';
  const eyebrow = 'Where to start';
  const paths = PATHS.map((path) => ({
    ...path,
    links: path.links.map((link) => ({ ...link, scene: sketchForRoute(link.href) })),
  }));
  const items: GatewayItem[] = PATHS.flatMap((path) =>
    path.links.map((link) => ({
      id: `${path.id}-${link.href}`,
      title: link.label,
      body: path.body?.[0] ?? '',
      href: link.href,
      service: link.label,
    })),
  );
  /* The board's drawing is the service's SituationFigure, as home's board drew it (round 11). */
  const board = items.map((item) => {
    const scene = sketchForRoute(item.href);
    return scene && isSituationFigureName(scene)
      ? { ...item, visual: <SituationFigure name={scene} /> }
      : item;
  });

  return (
    <>
      <Section>
        <Layout columns={{ lg: [1, 1] }} colGap="section" rowGap="stack" align="end">
          <Layout rowGap="block">
            <p className={t.eyebrow}>UI kit · the situation selector</p>
            <h1>Gateway</h1>
            <p className={t.lead}>
              Six reader situations down one column, every one at full ink. The reader recognises their
              situation first, so the titles are the band&rsquo;s largest repeated thing; a marker
              glides behind the current one and its sentence and service glide beside it. Below
              1024 every situation shows its sentence and service.
            </p>
          </Layout>
        </Layout>
      </Section>

      <Variation
        id="paths"
        title="G.P · Two paths, graphic cards — home (owner, 31 Oct 2026)"
        note="GatewayPaths, home’s band (decisions/2026-10-31-paths-graphic-cards): the head at the band’s left, the two paths one under the other, 64 apart. Each path is a small label (h5, sans) over its words (body-sm), then its services as flat graphic cards: the service’s own Sketch scene on its plate, the action’s authored words (h5-lg) under it, an arrow at the first line’s end; the whole card is the link, no box and no border. From 1024 words and cards are a split (1 : 2, 96 apart). From 768 the cards stand on three EQUAL tracks for both paths, so the two-service path leaves its third track empty. Below 768 each card is a row: the scene at 144 beside the words, the arrow trailing the last word. Hover a card: its arrow moves 4 (transform only)."
      />
      <ContentSection heading={heading} headingId="gw-paths" eyebrow={eyebrow}>
        <GatewayPaths paths={paths} />
      </ContentSection>

      <Variation
        id="board"
        title="G.0 · Board on paper — home (round 11)"
        note="Every situation at once, three across (two from 768, one below): its drawing, its title (h4, the sans), its sentence. No ground, no box and no link line; the whole item links. Hover or tab to an item: its drawing plays rest → end as one motion (360ms, the ease curve) and its title takes the accent; leaving plays it back. The head is the proposed eyebrow (P49) over the centred heading. One fold at 1440."
      />
      <ContentSection heading={heading} headingId="gw-board" eyebrow={eyebrow} align="center">
        <Gateway items={board} arrangement="board" />
      </ContentSection>

      <Variation
        id="paper"
        title="G.1 · Selector on paper — the round 6–7 home"
        note="From 1024: every title at full ink. A faint blue marker sits behind the current situation and glides to whichever one the pointer or focus is on, with no delay; the answer (sentence at lead size, the service as the link) glides beside it, level with its title. Run the pointer down the list to browse. Below 1024: every title, sentence and service in one column. Every word is in the HTML at every width."
      />
      <ContentSection heading={heading} headingId="gw-paper">
        <Gateway items={items} />
      </ContentSection>

      <Variation
        id="tint"
        title="G.2 · Selector on tint"
        note="The same on the tint ground: the marker turns paper."
      />
      <ContentSection heading={heading} headingId="gw-tint" surface="tint">
        <Gateway items={items} />
      </ContentSection>

      <Variation
        id="expand"
        title="G.3 · Expanding rows — explored alternative"
        note="Ruled rows at full ink; from 1024 the current row opens in place to show its sentence and service, and the others shut. Calm and familiar (an accordion that follows the pointer), but it is in-flow: rows move as one opens and another closes, so it needs a beat of hover intent and cannot feel as fluid as the selector. Below 1024 every row is open."
      />
      <ContentSection heading={heading} headingId="gw-expand">
        <Gateway items={items} arrangement="expand" />
      </ContentSection>
    </>
  );
}
