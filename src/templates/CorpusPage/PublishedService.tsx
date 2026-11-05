import { Fragment, type ReactNode } from 'react';

import { Layout, Media, Section as Band, Sketch, type MediaImage } from '@/components';
import type { CorpusBand, CorpusBlock, CorpusLink } from '@/lib/corpus-types';
import { ENQUIRY_DESK, ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { placeholderIllustration } from '@/lib/placeholders';
import { ENDPOINTS } from '@/lib/routes';
import {
  offerSceneKey,
  serviceSceneFor,
  type OfferScenes,
  type SketchName,
} from '@/lib/sketches';
import {
  Bento,
  BlockCard,
  BlockCardSet,
  ContentSection,
  CtaSection,
  EnquiryForm,
  ListCard,
  LogoGrid,
  OfferParts,
  OfferSheet,
  ReadDown,
  Reasons,
  Slider,
  Steps,
  type BentoCta,
  type BlockCardSetItem,
  type HeroMedia,
  type ReadDownRow,
} from '@/patterns';

import {
  BandBody,
  ClaimRows,
  DrawnTableBand,
  ItemBody,
  LinkActions,
  ScenarioSplit,
  TableBand,
  acrossFor,
  isAskLink,
  isExampleParagraph,
  scenarioParts,
  type Claim,
} from './CopyBands';
import { LEDGER_BANDS, WHY_GLYPHS } from './OfferBands';
import { PublishedHero, PublishedSection } from './PublishedHome';
import type { HomeAction } from './published-home-model';
import type {
  PublishedServicePage,
  PublishedServiceSection as Section,
  ServiceArt,
} from './published-service-model';
import { hasLink, labelWithoutArrow, plain } from './text';

/**
 * TIER 3 — a Service detail page from the new CMS (`/services/{slug}`). The hero, then every Page
 * Content section in the editor's order, each through the component the corpus offer page used for
 * that kind of band (OfferBands / CopyBands), so moving a page to the CMS changes its source, not its
 * design. The CMS decides each section's presentation and variants; the page decides nothing about
 * order.
 *
 * Drawings: a section's CMS illustration (a Sketch scene or an upload) wins. Where the CMS has none,
 * the drawing the frontend already assigns to that band stands in (`scenes`, `reasonFigure`,
 * `claimFigure`, the hero's `fallbackMedia`), else the labelled placeholder. Illustrations are the only
 * fallback: every word comes from the CMS.
 */
export type PublishedServiceProps = {
  page: PublishedServicePage;
  /** The service line's own hero drawing, for a hero whose CMS entry has no media. */
  fallbackMedia?: HeroMedia;
  /** The drawings the frontend assigns to the route's items, by band id and item title. */
  scenes?: OfferScenes;
  reasonFigure?: (
    title: string,
    ground: 'paper' | 'paper-deep',
  ) => { src: string; width: number; height: number } | undefined;
  claimFigure?: (
    title: string,
    ground: 'paper' | 'paper-deep',
  ) => { src: string; width: number; height: number } | undefined;
};

/** What a shared section needs from its page: the route, and the drawings the frontend assigns. */
export type SharedSectionCtx = Omit<PublishedServiceProps, 'page' | 'fallbackMedia'> & {
  route: string;
  /** The enquiry's `serviceOrAudit` context: the page's slug. */
  slug: string;
  /** The enquiry's `family` context. Default `service`. */
  family?: string;
};
type Ctx = SharedSectionCtx;

type Of<T extends Section['type']> = Extract<Section, { type: T }>;

/* ── Small pieces ─────────────────────────────────────────────────────────────── */

const ground = (surface: 'paper' | 'tint' | undefined) =>
  surface === 'tint' ? ('paper-deep' as const) : ('paper' as const);

/** The head every ContentSection band shares. */
function head(section: { id?: string; key: string; heading: string; headingId: string }) {
  return { id: section.id, heading: section.heading, headingId: section.headingId };
}

/** A section in the corpus band shape, for the band renderers that read blocks. */
function band(
  section: { id?: string; key: string; heading: string },
  blocks: CorpusBlock[],
): CorpusBand {
  return {
    id: section.id ?? section.key,
    anchored: Boolean(section.id),
    heading: [{ type: 'text', text: section.heading }],
    headingText: section.heading,
    blocks,
  };
}

function corpusLink(action: HomeAction): CorpusLink {
  return {
    href: action.href,
    label: [{ type: 'text', text: action.label }],
    labelText: action.label,
  };
}

function actionsOf(action: HomeAction | undefined) {
  return action ? <LinkActions links={[corpusLink(action)]} /> : undefined;
}

/** A section's own words before or after its set: nothing when there are none. */
function body(blocks: readonly CorpusBlock[], labelledBy?: string) {
  return blocks.length > 0 ? <BandBody blocks={blocks} labelledBy={labelledBy} /> : undefined;
}

/** The drawing the frontend already assigns to one item of this band (illustration fallback only). */
function sceneFor(ctx: Ctx, bandId: string | undefined, key: string): SketchName | undefined {
  if (!bandId) return undefined;
  const items = ctx.scenes?.items[bandId];
  return items?.[offerSceneKey(key)] ?? items?.[key];
}

/** An illustration as a picture node: an upload, or its Sketch scene. */
function artNode(art: ServiceArt | undefined, sizes: string): ReactNode {
  if (art?.image) return <Media image={art.image} sizes={sizes} />;
  if (art?.scene) return <Sketch name={art.scene} />;
  return undefined;
}

/** A lone plain paragraph opening a band is its lead (the corpus rule), so it is set as one. */
function leadAndRest(lead: string | undefined, blocks: readonly CorpusBlock[]) {
  if (lead) return { lead, rest: [...blocks] };
  const [first, ...rest] = blocks;
  if (first?.type === 'paragraph' && !hasLink(first.runs))
    return { lead: plain(first.runs), rest };
  return { lead: undefined, rest: [...blocks] };
}

/* ── Bands ────────────────────────────────────────────────────────────────────── */

/** Selected work: the cases as covers (M), three across; four or more in the Slider. */
function Cases({ section }: { section: Of<'cases'> }) {
  const items: BlockCardSetItem[] = section.cards.map((card) => ({
    id: card.id,
    title: card.title,
    ...(card.eyebrow ? { eyebrow: card.eyebrow } : {}),
    ...(card.bodyHtml?.length ? { bodyHtml: card.bodyHtml } : { body: card.body }),
    ...(card.image ? { media: { type: 'image' as const, image: card.image } } : {}),
    ...(card.href
      ? { href: card.href, ...(card.ctaLabel ? { ctaLabel: card.ctaLabel } : {}) }
      : {}),
  }));
  const linked = items.every((item) => item.href);
  const cue = linked ? (items.every((item) => item.ctaLabel) ? 'cta' : 'title') : undefined;
  const set =
    items.length >= 4 && linked ? (
      <Slider label={section.heading} peek>
        {items.map(({ id, ...item }) => (
          <BlockCard key={id} {...item} cue={cue} tracks={3} />
        ))}
      </Slider>
    ) : (
      <BlockCardSet
        lead="none"
        scroll="never"
        cue={cue}
        {...(items.length === 3 ? { across: 3 as const, size: 'md' as const } : {})}
        label={linked ? undefined : section.heading}
        items={items}
      />
    );
  return section.action ? (
    <ContentSection
      {...head(section)}
      data-band="M"
      surface={section.surface}
      lead={section.lead}
      actionsAt="end"
      actions={actionsOf(section.action)}
    >
      {set}
    </ContentSection>
  ) : (
    <ContentSection
      {...head(section)}
      data-band="M"
      surface={section.surface}
      lead={section.lead}
    >
      {set}
    </ContentSection>
  );
}

/** An Offer Sheet, by its CMS presentation; each card's `column`/`row` variant chooses its group. */
function Offer({ section, ctx }: { section: Of<'offer'>; ctx: Ctx }) {
  const { headingId } = section;
  const before = body(section.before, headingId);
  const after = body(section.after, headingId);
  /* A row card is a labelled term ("Who does the work"): its title is a label, so its stop goes. */
  const terms = section.rows.map(({ title, body: words, bodyHtml }) => ({
    title: title.replace(/[.:]\s*$/, ''),
    ...(bodyHtml ? { bodyHtml } : words ? { body: words } : {}),
  }));
  /* Under a set that has no term slot of its own, each term reads as the corpus authored it: its
     label running into its words, through the band body. */
  const termBlocks = (): CorpusBlock[] => section.rows.flatMap((row) => row.blocks);
  switch (section.presentation) {
    case 'illustrated':
      /* What you get: the deliverables, then the parts, each beside its drawing (OfferParts). */
      return (
        <OfferParts
          {...head(section)}
          surface={section.surface}
          lead={section.lead}
          deliverablesTitle=""
          deliverables={section.columns.map((card) => {
            const scene = card.scene ?? sceneFor(ctx, section.id, card.title);
            return {
              title: card.title.replace(/\.\s*$/, ''),
              ...(card.bodyHtml
                ? { bodyHtml: card.bodyHtml }
                : card.body
                  ? { body: card.body }
                  : {}),
              ...(scene ? { scene } : {}),
            };
          })}
          parts={terms.map((term, index) => {
            const card = section.rows[index]!;
            const scene = card.scene ?? sceneFor(ctx, section.id, card.title);
            return scene ? { ...term, scene } : term;
          })}
          before={before}
          note={after}
        />
      );
    case 'catalogue': {
      /* What we design: drawn Bento tiles; the terms and closing words under them. */
      const items = section.columns.map((card) => {
        const scene = card.scene ?? sceneFor(ctx, section.id, card.title);
        return {
          id: card.id,
          title: card.title,
          ...(card.body ? { body: card.body } : {}),
          ...(scene ? { scene } : {}),
        };
      });
      const foot = [...termBlocks(), ...section.after];
      return (
        <ContentSection
          {...head(section)}
          data-band="catalog-tiles"
          surface={section.surface}
          lead={section.lead}
          footer={body(foot, headingId)}
        >
          {before}
          <Bento tracks={items.length === 4 || items.length >= 7 ? 4 : 3} items={items} />
        </ContentSection>
      );
    }
    default: {
      /* plain, read-down: the words without drawings. Past six promises, or read down by choice,
         they read down in two columns with the terms under them (D). */
      const items = section.columns.map(({ id, title, body: words, bodyHtml }) => ({
        id,
        title,
        ...(bodyHtml ? { bodyHtml } : words ? { body: words } : {}),
      }));
      if (section.presentation === 'read_down' || items.length > 6) {
        const readDown: ReadDownRow[] = items.map((item) => ({
          title: item.title,
          ...('bodyHtml' in item && item.bodyHtml
            ? { bodyHtml: [item.bodyHtml] }
            : 'body' in item && item.body
              ? { body: item.body }
              : {}),
        }));
        return (
          <ContentSection
            {...head(section)}
            data-band="D"
            surface={section.surface}
            lead={section.lead}
            footer={body([...termBlocks(), ...section.after], headingId)}
          >
            <Layout rowGap="block">
              {before}
              <ReadDown rows={readDown} columns={readDown.length > 3 ? 2 : 1} />
            </Layout>
          </ContentSection>
        );
      }
      return (
        <OfferSheet
          {...head(section)}
          surface={section.surface}
          lead={section.lead}
          items={items}
          across={acrossFor(items.length)}
          before={before}
          note={after}
          terms={terms.length > 0 ? terms : undefined}
        />
      );
    }
  }
}

/** Hard parts: ClaimSet, `tabs` or `page` as the CMS presentation says (D-claims). */
function Claims({ section, ctx }: { section: Of<'claims'>; ctx: Ctx }) {
  const stories: { title: string; label: string; blocks: CorpusBlock[] }[] = [];
  const claims: Claim[] = section.claims.map((claim) => {
    const parts = scenarioParts(claim.blocks);
    if (parts.label)
      stories.push({ title: claim.title, label: parts.label, blocks: parts.scenario });
    return {
      title: claim.title,
      body: parts.before,
      ...(claim.example ? { exampleRuns: claim.example } : {}),
    };
  });
  const drawings = new Map(section.claims.map((claim) => [claim.title, claim.art?.image]));
  /* A closing worked example keeps its label as the legend over its words, as the corpus set it. */
  const after = scenarioParts(section.after);
  return (
    <ContentSection
      {...head(section)}
      data-band="D-claims"
      surface={section.surface}
      lead={section.lead}
    >
      <Layout rowGap="stack">
        {body(section.before, section.headingId)}
        <ClaimRows
          claims={claims}
          stories={stories}
          layout={section.layout}
          ground={ground(section.surface)}
          labelledBy={section.headingId}
          claimFigure={(title, on) => {
            const upload = drawings.get(title);
            return upload
              ? { src: upload.src, width: upload.width, height: upload.height }
              : ctx.claimFigure?.(title, on);
          }}
        />
        {body(after.before, section.headingId)}
        {after.label ? (
          <ScenarioSplit
            label={after.label}
            blocks={after.scenario}
            scene={sceneFor(ctx, section.id, 'scenario')}
          />
        ) : null}
      </Layout>
    </ContentSection>
  );
}

/** Ctas after a set: split tiles count once, a lone CTA card two cells (OfferBands `Router`). */
function ctaTracks(cells: number): 3 | 4 {
  if (cells % 3 === 0) return 3;
  if (cells % 4 === 0) return 4;
  return cells % 3 > cells % 4 ? 3 : 4;
}

/**
 * Service Card: the Bento of service tiles (C-icon). `single`: one tile per service, the closing
 * routes as the set's CTA cards. `two`: split tiles, each with its labelled second area and action.
 */
function ServiceCards({ section, ctx }: { section: Of<'service-cards'>; ctx: Ctx }) {
  const { lead, rest } = leadAndRest(section.lead, section.before);
  const n = section.tiles.length;
  const cta: BentoCta | undefined =
    section.routes.length > 0
      ? {
          routes: section.routes.map((route) => ({
            ...(route.question ? { question: route.question } : {}),
            ...(route.answer ? { answer: route.answer } : {}),
            actions: route.actions.map(({ label, href }) => ({
              label: labelWithoutArrow(label),
              href,
            })),
          })),
        }
      : undefined;
  /* Split tiles (a detail each, either variant) take two tracks, so four tracks set them two a row,
     as the corpus chooser did (OfferBands; /audits `choose`). */
  const tracks =
    section.variant === 'two' || section.tiles.some((tile) => tile.detail)
      ? 4
      : cta
        ? ctaTracks(n + cta.routes.length + (cta.routes.length === 1 ? 1 : 0))
        : n === 7 || n === 8 || n === 4
          ? 4
          : 3;
  return (
    <ContentSection
      {...head(section)}
      data-band="C-icon"
      surface={section.surface}
      lead={lead}
      footer={body(section.after, section.headingId)}
    >
      {rest.length > 0 ? (
        <Layout rowGap="stack">
          {body(rest, section.headingId)}
          <ServiceBento section={section} ctx={ctx} tracks={tracks} cta={cta} />
        </Layout>
      ) : (
        <ServiceBento section={section} ctx={ctx} tracks={tracks} cta={cta} />
      )}
    </ContentSection>
  );
}

function ServiceBento({
  section,
  ctx,
  tracks,
  cta,
}: {
  section: Of<'service-cards'>;
  ctx: Ctx;
  tracks: 3 | 4;
  cta?: BentoCta;
}) {
  return (
    <Bento
      tracks={tracks}
      cta={cta}
      items={section.tiles.map((tile) => {
        /* Use CMS art first, then the band's drawing, then the destination's general scene. */
        const scene =
          tile.art?.scene ??
          (tile.art?.image
            ? undefined
            : ((tile.href ? sceneFor(ctx, section.id, tile.href) : undefined) ??
              sceneFor(ctx, section.id, tile.title) ??
              (tile.href ? serviceSceneFor(tile.href) : undefined)));
        return {
          id: tile.id,
          title: tile.title,
          ...(tile.body ? { body: tile.body } : {}),
          ...(tile.detail ? { detail: tile.detail } : {}),
          ...(tile.href ? { href: tile.href } : {}),
          ...(scene ? { scene: scene as SketchName } : {}),
          ...(tile.art?.image
            ? {
                picture: (
                  <Media image={tile.art.image} sizes="(min-width: 1024px) 25vw, 90vw" />
                ),
              }
            : {}),
        };
      })}
    />
  );
}

/** Stages: the numbered steps beside one flat graphic (F); the labelled plate until it is drawn. */
function Stages({ section, ctx }: { section: Of<'stages'>; ctx: Ctx }) {
  const figureScene = section.art ? undefined : sceneFor(ctx, section.id, 'figure');
  const figure = artNode(section.art, '(min-width: 1024px) 45vw, 90vw') ?? (
    <Sketch {...(figureScene ? { name: figureScene } : {})} />
  );
  const after = scenarioParts(section.after);
  return (
    <ContentSection
      {...head(section)}
      data-band="F"
      surface={section.surface}
      lead={section.lead}
    >
      <Layout rowGap="stack">
        {body(section.before, section.headingId)}
        <Layout
          columns={{ base: 1, lg: [1, 1] }}
          colGap="section"
          rowGap="stack"
          align={section.art?.image ? 'start' : 'center'}
        >
          <Steps steps={section.stages} />
          {figure}
        </Layout>
        {body(after.before, section.headingId)}
        {after.label ? (
          <ScenarioSplit
            label={after.label}
            blocks={after.scenario}
            scene={sceneFor(ctx, section.id, 'scenario')}
          />
        ) : null}
      </Layout>
    </ContentSection>
  );
}

/**
 * Why: one reason per card (Reasons, the CMS's documented mapping). Each card's own variant picks its
 * visual: `illustration` is the reason's figure, `media` its cover. An illustration card with no
 * upload takes the frontend's drawing for that reason, else the labelled illustration slot.
 */
function Why({ section, ctx }: { section: Of<'why'>; ctx: Ctx }) {
  const cards = section.cards.map((card) => ({ ...card, title: card.title.replace(/\.$/, '') }));
  if (cards.length && cards.every((card) => !card.image && WHY_GLYPHS[card.title])) {
    return (
      <OfferSheet
        {...head(section)}
        surface={section.surface}
        arrangement="list"
        items={cards.map((card) => ({ ...card, icon: WHY_GLYPHS[card.title] }))}
        note={actionsOf(section.action)}
      />
    );
  }
  const on = ground(section.surface);
  return (
    <Reasons
      {...head(section)}
      surface={section.surface === 'tint' ? 'tint' : 'paper'}
      figureSize="lg"
      action={actionsOf(section.action)}
      items={cards.map((card) => {
        const { title } = card;
        if (card.variant === 'media') {
          return card.image
            ? { title, body: card.body, proof: { kind: 'cover' as const, image: card.image } }
            : { title, body: card.body };
        }
        const drawn: MediaImage | undefined =
          card.image ??
          (() => {
            const figure = ctx.reasonFigure?.(title, on);
            return figure ? { ...figure, alt: '', kind: 'illustration' as const } : undefined;
          })();
        return {
          title,
          body: card.body,
          figure: drawn
            ? { ...drawn, alt: drawn.alt ?? '', kind: 'illustration' as const }
            : { ...placeholderIllustration(title), alt: '' },
        };
      })}
    />
  );
}

/** Comparison: a table band (E), or its drawn rows where the frontend draws every row (drawn-table). */
function Comparison({ section, ctx }: { section: Of<'flow'>; ctx: Ctx }) {
  const blocks: CorpusBlock[] = section.lead
    ? [{ type: 'paragraph', runs: [{ type: 'text', text: section.lead }] }, ...section.blocks]
    : section.blocks;
  const corpus = band(section, blocks);
  const scene = (key: string) => sceneFor(ctx, section.id, key);
  if (
    section.id &&
    ctx.scenes?.items[section.id] &&
    !scene('agree') &&
    blocks.some((b) => b.type === 'table')
  ) {
    return (
      <DrawnTableBand
        band={corpus}
        sceneOf={scene}
        scenario={scene('scenario')}
        arrangement={LEDGER_BANDS.has(section.id) ? 'ledger' : 'grid'}
      />
    );
  }
  return <TableBand band={corpus} scenario={scene('scenario')} agreement={scene('agree')} />;
}

/** Editorial: prose, its examples and scenario in place (C-text); beside its photograph (B) for `media`. */
function Editorial({ section, ctx }: { section: Of<'flow'>; ctx: Ctx }) {
  const links = section.blocks.flatMap((block) => (block.type === 'links' ? block.links : []));
  const words = section.blocks.filter((block) => block.type !== 'links');
  const examples = words.some(isExampleParagraph);
  const parts = scenarioParts(words);
  const text = parts.label ? (
    <Layout rowGap="stack">
      {body(parts.before)}
      <ScenarioSplit
        label={parts.label}
        blocks={parts.scenario}
        scene={sceneFor(ctx, section.id, 'scenario')}
      />
    </Layout>
  ) : examples ? (
    <ItemBody blocks={words} />
  ) : (
    <BandBody blocks={words} />
  );
  const actions = links.length > 0 ? <LinkActions links={links} /> : undefined;
  if (section.media) {
    return (
      <ContentSection
        {...head(section)}
        data-band="B"
        surface={section.surface}
        arrangement="media"
        media={{
          image: section.media.image,
          side: section.media.side ?? 'start',
          weight: 'photo',
          head: 'lg',
        }}
        actions={actions}
      >
        {text}
      </ContentSection>
    );
  }
  return (
    <ContentSection
      {...head(section)}
      data-band="C-text"
      surface={section.surface}
      footer={actions}
    >
      {text}
    </ContentSection>
  );
}

/** Illustrated: drawn tiles (grid), ruled rows (ledger), or one agreement beside its drawing. */
function Illustrated({ section, ctx }: { section: Of<'illustrated'>; ctx: Ctx }) {
  const art = (entry: (typeof section.entries)[number]) =>
    entry.art ??
    (sceneFor(ctx, section.id, entry.title)
      ? { scene: sceneFor(ctx, section.id, entry.title) }
      : undefined);
  const set =
    section.presentation === 'agreement' ? (
      <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack" align="center">
        <Layout rowGap="block">
          {section.legend ? <p>{section.legend}</p> : null}
          <Layout as="ul" rowGap="none">
            {section.entries.map((entry) => (
              <ListCard
                key={entry.id}
                titleAs="h3"
                title={entry.title}
                bodyHtml={entry.bodyHtml ? [entry.bodyHtml] : undefined}
              />
            ))}
          </Layout>
        </Layout>
        {artNode(section.art, '(min-width: 1024px) 45vw, 90vw') ?? <Sketch />}
      </Layout>
    ) : section.presentation === 'ledger' ? (
      <Layout as="ul" rowGap="none">
        {section.entries.map((entry) => (
          <ListCard
            key={entry.id}
            titleAs="h3"
            title={entry.title}
            bodyHtml={entry.bodyHtml ? [entry.bodyHtml] : undefined}
            href={entry.href}
          />
        ))}
      </Layout>
    ) : (
      <Bento
        tracks={section.entries.length === 4 || section.entries.length >= 7 ? 4 : 3}
        items={section.entries.map((entry) => {
          const drawing = art(entry);
          return {
            id: entry.id,
            title: entry.title,
            ...(entry.bodyHtml ? { body: plainOf(entry.bodyHtml) } : {}),
            ...(entry.href ? { href: entry.href } : {}),
            ...(entry.detail
              ? {
                  detail: { label: entry.detail.label, text: plainOf(entry.detail.html ?? '') },
                }
              : {}),
            ...(drawing?.scene ? { scene: drawing.scene } : {}),
            ...(drawing?.image
              ? {
                  picture: (
                    <Media image={drawing.image} sizes="(min-width: 1024px) 25vw, 90vw" />
                  ),
                }
              : {}),
          };
        })}
      />
    );
  return (
    <ContentSection
      {...head(section)}
      data-band="illustrated"
      surface={section.surface}
      lead={section.lead}
      footer={body(section.after, section.headingId)}
    >
      {section.before.length > 0 ? (
        <Layout rowGap="stack">
          {body(section.before, section.headingId)}
          {set}
        </Layout>
      ) : (
        set
      )}
    </ContentSection>
  );
}

/** Inline HTML's words, for a tile that sets plain text. */
function plainOf(html: string): string {
  return html
    .replace(/<br\s*\/?>/giu, ' ')
    .replace(/<[^>]+>/gu, '')
    .replace(/&amp;/gu, '&')
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'")
    .replace(/\s+/gu, ' ')
    .trim();
}

/**
 * A button CTA between bands. One that asks for the page's own enquiry form (`#enquiry`) is the ask
 * island (L, the corpus `AskIsland`): the button is the page's solid ask. Any other is the onward
 * line as its own island, the link as its one action.
 */
function Onward({ section }: { section: Extract<Section, { type: 'cta' }> }) {
  const [primary] = section.actions;
  if (!primary) return null;
  const words = section.leadHtml
    ? ([<span key="lead" dangerouslySetInnerHTML={{ __html: section.leadHtml }} />] as const)
    : section.lead
      ? ([section.lead] as const)
      : undefined;
  const action = { label: labelWithoutArrow(primary.label), href: primary.href };
  if (isAskLink(primary)) {
    return (
      <CtaSection
        id={section.id}
        data-band="L"
        arrangement="open"
        heading={section.heading}
        body={words}
        actions={[action]}
      />
    );
  }
  return (
    <CtaSection
      id={section.id}
      data-band="onward"
      arrangement="open"
      intent="onward"
      heading={section.heading}
      body={words}
      actions={[action]}
    />
  );
}

/**
 * The enquiry close (L): the island the corpus offer pages close on, the CMS's words and form settings
 * in it. The island's ground and arrangement default to the offer page's (blue, halves) unless the CMS
 * sets them; its drawing is the CMS media, else the frontend's.
 */
function Enquiry({
  family = 'service',
  section,
  route,
  slug,
}: {
  section: Extract<Section, { type: 'cta' }>;
  route: string;
  slug: string;
  family?: string;
}) {
  const { form } = section;
  if (!form) return <PublishedSection section={section} route={route} />;
  const halves = section.presentation !== 'standard';
  const art = section.image ?? (halves ? ENQUIRY_SKETCH_TO_SHIPPED : ENQUIRY_DESK);
  const words = section.leadHtml
    ? ([<span key="lead" dangerouslySetInnerHTML={{ __html: section.leadHtml }} />] as const)
    : section.lead
      ? ([section.lead] as const)
      : undefined;
  /* The card's reply promise is the form's own reply label; the caption is not repeated as one. */
  const reply = form.reply;
  const formProps = {
    action: ENDPOINTS.enquiry,
    fieldScale: 'md' as const,
    submit: 'inline' as const,
    submitLabel: form.submitLabel,
    caption: form.caption ?? null,
    success: form.success,
    nextSteps: form.nextSteps.length > 0 ? form.nextSteps : undefined,
    context: {
      originRoute: route,
      placement: section.id ?? 'enquiry',
      family,
      serviceOrAudit: slug,
      referrer: '',
      campaign: '',
    },
  };
  return (
    <CtaSection
      id={section.id}
      data-band="L"
      surface={section.surface}
      island={section.island ?? 'blue'}
      islandArrangement={halves ? 'halves' : 'beside'}
      islandTexture={halves ? 'flow' : 'frame'}
      art={<Media image={art} sizes={halves ? '300px' : '240px'} />}
      heading={section.heading}
      eyebrow={section.eyebrow}
      body={words}
      points={section.points.length > 0 ? section.points : undefined}
      footnote={section.footnote}
      footnoteIcon="shield-check"
      contact={section.contacts.length > 0 ? section.contacts : undefined}
      form={
        form.variant === 'compact' ? (
          <EnquiryForm variant="compact" {...formProps} />
        ) : (
          <EnquiryForm
            {...formProps}
            variant="enquiry"
            urlLabel={form.urlLabel}
            scheduleHref={form.scheduleHref}
            dress={{ kind: 'card', ...(reply ? { reply } : {}) }}
          />
        )
      }
    />
  );
}

/**
 * One shared Page Content section through its band component. Exported for the other page owners
 * built from the same shared sections (Expertise Master, Expertise detail), so a section renders one
 * way wherever it is placed.
 */
export function SharedSectionView({ section, ctx }: { section: Section; ctx: Ctx }) {
  switch (section.type) {
    case 'cases':
      return <Cases section={section} />;
    case 'offer':
      return <Offer section={section} ctx={ctx} />;
    case 'claims':
      return <Claims section={section} ctx={ctx} />;
    case 'service-cards':
      return <ServiceCards section={section} ctx={ctx} />;
    case 'stages':
      return <Stages section={section} ctx={ctx} />;
    case 'why':
      return <Why section={section} ctx={ctx} />;
    case 'flow':
      return section.kind === 'comparison' ? (
        <Comparison section={section} ctx={ctx} />
      ) : (
        <Editorial section={section} ctx={ctx} />
      );
    case 'illustrated':
      return <Illustrated section={section} ctx={ctx} />;
    case 'clients':
      /* The client wall as the corpus recognition band (H): the heading is the wall's h2 context. */
      return (
        <Band
          id={section.id}
          data-band="H"
          surface={section.surface}
          aria-labelledby={section.headingId}
        >
          <LogoGrid
            marks={section.marks}
            context={section.heading}
            contextAs="h2"
            headingId={section.headingId}
            edges="closed"
            density={section.compact ? 'compact' : 'default'}
          />
        </Band>
      );
    case 'cta':
      return section.variant === 'form' ? (
        <Enquiry section={section} route={ctx.route} slug={ctx.slug} family={ctx.family} />
      ) : section.variant === 'button' ? (
        <Onward section={section} />
      ) : (
        <PublishedSection section={section} route={ctx.route} />
      );
    default:
      return <PublishedSection section={section} route={ctx.route} />;
  }
}

export function PublishedService({
  page,
  fallbackMedia,
  scenes,
  reasonFigure,
  claimFigure,
}: PublishedServiceProps) {
  const ctx: Ctx = { route: page.route, slug: page.slug, scenes, reasonFigure, claimFigure };
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={fallbackMedia} />
      {page.sections.map((section) => (
        <Fragment key={section.key}>
          <SharedSectionView section={section} ctx={ctx} />
        </Fragment>
      ))}
    </>
  );
}
