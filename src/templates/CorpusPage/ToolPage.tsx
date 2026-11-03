import { Layout, Prose, Sketch } from '@/components';
import { ContentSection, ContentSectionText } from '@/patterns';
import type { CorpusBand, CorpusBlock, CorpusPage } from '@/lib/corpus-types';
import type { SketchName } from '@/lib/sketches';

import { CorpusHero, FaqItems, head } from './blocks';
import {
  MethodBand,
  TableBand,
  TextBand,
  WorkedExampleBand,
  content,
  scenarioParts,
} from './CopyBands';
import { formBeforeFaq, isFaqBand } from './order';
import { boldLead, html } from './text';

export type ToolPageProps = { page: CorpusPage };

/**
 * TIER 3 — the tool page: a free tool from the `_pages/` corpus (page-mapping § 4.7). A tool is a
 * guide you work through, so it is a run of composed bands, each the approved component for what its
 * words do, read from their structure and never from a band id:
 *
 *   method     a numbered list whose items open on a bold lead ("**Pick one part.** …"): the method,
 *              steps beside one flat drawing (F, the approved "how we do it").
 *   example    a band holding "Illustration, not client work": the worked example as ONE panel on
 *              its own ground, the scenario beside its story drawing (owner, 2 Nov 2026).
 *   table      a band with a table: its lead, the boxed table read across rows, the notes after it
 *              (E). The hero's action points at one of these (`#workspace`): the table IS the tool
 *              until the record builder ships, so no empty mount stands in for it.
 *   diagram    prose a drawing explains (`DIAGRAMS`): the words beside a flat drawing.
 *   faq        the questions, as every page's (D-faq).
 *   text       anything else: prose at the body measure (C-text), as an offer page's prose band. A
 *              band sending the reader on ("next") keeps its links inside its sentences.
 *
 * Every word is the corpus's, in its order; nothing is dropped (until 4 Nov the template lost every
 * numbered method, workspace table, note and FAQ on all six tools).
 */
export function ToolPage({ page }: ToolPageProps) {
  return (
    <>
      <CorpusHero page={page} texture />
      {formBeforeFaq(page.bands).map((band) => (
        <ToolBand key={band.id} page={page} band={band} />
      ))}
    </>
  );
}

/**
 * The drawings a tool's bands carry, by route and band, as the scenes are drawn (src/lib/sketches.ts).
 * A band with no scene yet holds its place with the empty plate (owner, 2 Nov 2026: never the words
 * alone in half the band).
 */
const SCENES: Readonly<Record<string, Readonly<Record<string, SketchName>>>> = {};

/** Prose bands a flat diagram explains (the tools assessment, 4 Nov 2026), by route. */
const DIAGRAMS: Readonly<Record<string, readonly string[]>> = {
  '/tools/ai-product-ux-readiness-check': ['marking'],
  '/tools/audit-redesign-modernise-rebuild': ['reading-your-results'],
  '/tools/figma-storybook-fidelity-checklist': ['corrections'],
};

const sceneOf = (page: CorpusPage, band: CorpusBand): SketchName | undefined =>
  SCENES[page.route]?.[band.id];

/** A numbered list whose every item opens on a bold lead: a method. */
function isMethod(blocks: readonly CorpusBlock[]): boolean {
  return blocks.some(
    (block) =>
      block.type === 'list' &&
      block.ordered &&
      block.items.length >= 2 &&
      block.items.every((item) => boldLead(item) !== null),
  );
}

function ToolBand({ page, band }: { page: CorpusPage; band: CorpusBand }) {
  const blocks = content(band);
  const scene = sceneOf(page, band);

  if (isFaqBand(band)) {
    return (
      <ContentSection {...head(band)} data-band="D-faq" align="center">
        <ContentSectionText>
          <FaqItems band={band} />
        </ContentSectionText>
      </ContentSection>
    );
  }

  if (scenarioParts(blocks).label) return <WorkedExampleBand band={band} scene={scene} />;

  if (isMethod(blocks)) {
    return <MethodBand band={band} {...(scene ? { figure: { sketch: scene } } : {})} />;
  }

  if (blocks.some((block) => block.type === 'table')) return <TableBand band={band} />;

  if (DIAGRAMS[page.route]?.includes(band.id)) {
    return <DiagramBand band={band} blocks={blocks} scene={scene} />;
  }

  return <TextBand page={page} band={band} />;
}

const proseHtml = (blocks: readonly CorpusBlock[]) =>
  blocks.flatMap((block) => (block.type === 'paragraph' ? [html(block.runs)] : [])).join('');

/**
 * Prose a drawing explains: the words beside the flat drawing (copy beside a drawing is a split, so
 * `section`), the drawing on the end side. The empty plate holds its place until the diagram is drawn.
 */
function DiagramBand({
  band,
  blocks,
  scene,
}: {
  band: CorpusBand;
  blocks: readonly CorpusBlock[];
  scene?: SketchName;
}) {
  return (
    <ContentSection {...head(band)} data-band="B">
      <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack" align="center">
        <Prose html={proseHtml(blocks)} />
        <Sketch {...(scene ? { name: scene } : {})} />
      </Layout>
    </ContentSection>
  );
}
