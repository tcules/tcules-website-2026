import {
  BrandMark,
  Icon,
  Layout,
  RatingBadge,
  Section,
  Texture,
  TextureShape,
} from '@/components';
import { getNavigation } from '@/content';
import { ROUTES } from '@/lib/routes';
import { CtaRow, ListCard, LogoGrid, logoGridColumns } from '@/patterns';

import { Specimen, specimenStyles as s } from '../../_specimen/Specimen';
import {
  CLIENTS,
  EDEN_AI,
  DOODLE,
  GT_TOOLS,
  INCLUUDE,
  KNOVOS,
  LATITUDEPAY,
  OMNY,
  PLEDGE,
  QUOTER,
  SAFEXPAY,
  type ClientRecord,
} from '../../_specimen/clients';
import t from '../../_specimen/typeroles.module.css';

/**
 * Kit · H · Client logos — the boxed logo grid (r7-logos; 7 Oct review, owner 8 Oct 2026).
 *
 * The H band is now one unit, LogoGrid: every mark in a boxed hairline cell of its own, the outer
 * edge drawn (closed, the default since the 9 Oct review), at equal weight — equal area of INK, by
 * each mark's measured density — the Enorm reference's treatment. The cell is the named exception to "no boxes" — a logo cell is not
 * a card. The band's heading is demoted to an eyebrow-size context line, and it may lead with the
 * sourced rating badge. Each band is ≤ 830 at 1470 (`npm run fold:check`).
 *
 * The three variants differ in what leads, so the page never repeats one rectangle:
 *   01  the context line alone, start-aligned, nine marks three by three across the column;
 *   02  the RatingBadge leading a centred context line, eight marks in one flat four-by-two wall;
 *   03  a short h4-scale heading beside the grid, centred on it, nine marks three by three.
 * Then the counts: 12 cells (4 × 3; never more than four across), so 8, 9 and 12 are all on the page; the open edge, the
 * alternative; and the token proof on tint, ink and blue (never this band's ground on a page — blue
 * is the foreground accent — but every surface block in logo-grid.css has to render somewhere).
 * On a phone every count is two across; nine closes on one cell spanning the row.
 * 08 is the ticker (owner, 17 Nov 2026): no boxes, one slow row that loops, pauses under the pointer
 * or keyboard focus, and the hovered mark takes the full ink. With reduced motion it is still and wraps.
 *
 * Honesty (§ 5.8): the marks are the nine real files in public/clients, one ink, equal ink area, the
 * densities measured and recorded in ../../_specimen/clients.ts. The badge is the one sourced figure the seam
 * holds, the Clutch rating (fixtures/ratings.ts, via getNavigation). The twelve-cell grid repeats
 * three marks to reach twelve, and says so: a stress count, not a client list.
 */

/** Eight, for the flat wall: the set less Knovos. Which eight is a content choice. */
const EIGHT: readonly ClientRecord[] = [
  OMNY,
  LATITUDEPAY,
  QUOTER,
  SAFEXPAY,
  DOODLE,
  PLEDGE,
  GT_TOOLS,
  INCLUUDE,
];

/** Twelve, a STRESS count: the nine, then three repeated under a distinct name. */
const TWELVE: readonly ClientRecord[] = [
  ...CLIENTS,
  ...[OMNY, DOODLE, KNOVOS].map((m) => ({ ...m, name: `${m.name} (repeat)` })),
];

/** "4 × 2 · 4 × 2 · 2 × 4" — the grid a count takes at 1440, 1024 and 390. */
function shape(count: number, track: 'full' | 'body' = 'full') {
  const c = logoGridColumns(count, track);
  return [c.xl, c.lg, c.base].map((n) => `${n} × ${Math.ceil(count / n)}`).join(' · ');
}

/** The specimen's caption between bands: a hairline, a mono label and one line. */
function Label({ title, children }: { title: string; children: string }) {
  return (
    <Section flush>
      <Specimen title={title} note={children}>
        {null}
      </Specimen>
    </Section>
  );
}

export default async function KitLogosPage() {
  const { footer } = await getNavigation();
  const rating = footer.brand.rating;

  const badge = rating ? (
    <RatingBadge
      score={rating.score}
      platform={rating.platform}
      href={rating.href}
      icon={<Icon name="star" size="sm" />}
      mark={<BrandMark name="clutch" />}
    />
  ) : null;

  return (
    <>
      {/* ── Intro ───────────────────────────────────────────────────────────────────────── */}
      <Section>
        {/* hero-field (§ 6.3), at the recipe's numbers, clear of the copy track. */}
        <Texture>
          <TextureShape
            kind="ellipse"
            top={-220}
            right={-160}
            width="40%"
            height={420}
            blur={200}
          />
        </Texture>
        <Layout columns={{ lg: [7, 5] }} colGap="column" rowGap="stack" align="end">
          <Layout rowGap="block">
            <p className={s.eyebrow}>UI kit · Band H</p>
            <h1>Client logos</h1>
            <p className={t.lead}>
              Every client in a cell of its own, at equal weight, so a wordmark, a badge and a
              symbol between words read as one set. The marks lead; the words step back to a
              single line.
            </p>
          </Layout>
          <Layout as="ol" columns={{ base: 1, md: 2, lg: 1 }} colGap="gutter" rowGap="block">
            <ListCard
              form="tile"
              marker={{ type: 'number', value: 1, tone: 'neutral' }}
              title="Each mark in its own box"
              body="Equal hairline cells, the outer edge drawn: a logo cell is not a card."
            />
            <ListCard
              form="tile"
              marker={{ type: 'number', value: 2, tone: 'neutral' }}
              title="Equal ink, every row full"
              body="Each mark sized by its measured density. The count sets the columns: 8 is 4 × 2, 9 is 3 × 3, 12 is 4 × 3. Never more than four across."
            />
          </Layout>
        </Layout>
      </Section>

      {/* ── 01 ──────────────────────────────────────────────────────────────────────────── */}
      <Label title="01 · Context line">
        {`The heading demoted to one eyebrow-size line over the boxed grid. Nine: ${shape(9)}.`}
      </Label>
      <Section aria-labelledby="logos-context">
        <LogoGrid
          marks={CLIENTS}
          context="Product teams we have designed and shipped with"
          headingId="logos-context"
        />
      </Section>

      {/* ── 02 ──────────────────────────────────────────────────────────────────────────── */}
      {badge ? (
        <>
          <Label title="02 · Led by the rating badge">
            {`The sourced Clutch badge leads a centred context line. Eight: ${shape(8)}.`}
          </Label>
          <Section aria-labelledby="logos-rated">
            <LogoGrid
              marks={EIGHT}
              badge={badge}
              context="Rated by the product teams we work with"
              headingId="logos-rated"
              align="center"
            />
          </Section>
        </>
      ) : null}

      {/* ── 03 ──────────────────────────────────────────────────────────────────────────── */}
      <Label title="03 · Beside a short heading">
        {`A short h4 head and its action, centred on the grid beside it. Nine: ${shape(9, 'body')}.`}
      </Label>
      <Section aria-labelledby="logos-beside">
        <LogoGrid
          marks={CLIENTS}
          arrangement="beside"
          context="Clients"
          heading="Nine teams, one way of working"
          headingId="logos-beside"
          action={
            <CtaRow
              actions={[{ label: 'See the work', href: ROUTES.caseStudies }]}
              rule={false}
            />
          }
        />
      </Section>

      {/* ── 03b ─────────────────────────────────────────────────────────────────────────── */}
      <Label title="03b · Ten cells · the closing pair">
        {`The nine with Eden AI's PNG, ten (home round 3). Where four across leaves two, each spans two tracks, so the last row is a closing pair and the grid stays a whole rectangle. ${shape(10)}.`}
      </Label>
      <Section aria-labelledby="logos-ten">
        <LogoGrid
          marks={[EDEN_AI, ...CLIENTS]}
          context="Some of the teams we've worked with"
          headingId="logos-ten"
          align="center"
        />
      </Section>

      {/* ── 04 ──────────────────────────────────────────────────────────────────────────── */}
      <Label title="04 · Twelve cells">
        {`Stress count: three marks repeated to reach twelve, still a whole rectangle. ${shape(12)}.`}
      </Label>
      <Section aria-labelledby="logos-twelve">
        <LogoGrid
          marks={TWELVE}
          context="Twelve cells, every row full"
          headingId="logos-twelve"
        />
      </Section>

      {/* ── 05 ──────────────────────────────────────────────────────────────────────────── */}
      <Label title="05 · Open edges, the alternative">
        {`edges="open": rules only between cells, no frame round the set, so it sits in the paper. Eight: ${shape(8)}.`}
      </Label>
      <Section aria-labelledby="logos-open">
        <LogoGrid
          marks={EIGHT}
          context="The same wall, its outer edge left open"
          headingId="logos-open"
          edges="open"
        />
      </Section>

      {/* ── 06 ──────────────────────────────────────────────────────────────────────────── */}
      <Label title="06 · Typeset wordmarks, when a mark is missing">
        {`A client with no approved SVG is still in the set, its name typeset as a wordmark (the asset policy: never invent a logo). Home round 1 (10 Oct 2026): a set may mix them — the drawn marks keep their art and each missing one takes the wordmark role in the marks' own ink — so one missing file no longer hides every real mark as a list of names. Led by the rating, as the home band is. Six: ${shape(6)}.`}
      </Label>
      <Section aria-labelledby="logos-names">
        <LogoGrid
          badge={badge}
          marks={[
            DOODLE,
            { name: 'Dealpath' },
            { name: 'Benchmark Gensuite' },
            { name: 'Eden AI' },
            { name: 'JoVE' },
            { name: 'Ringier Media Switzerland' },
          ]}
          context="Some of the teams we’ve worked with"
          headingId="logos-names"
          align="center"
        />
      </Section>

      {/* ── 08 ──────────────────────────────────────────────────────────────────────────── */}
      <Label title="08 · Ticker">
        {`arrangement="ticker" (owner, 17 Nov 2026): the hero's client logos. No boxes, one row moving left at ~45 px/s whatever the count, fading at both edges. Point at it or tab to it and it stops; the mark under the pointer takes the full ink. Reduced motion: still, wrapped, centred, every mark in view. Ten marks.`}
      </Label>
      <Section aria-labelledby="logos-ticker">
        <LogoGrid
          marks={[EDEN_AI, ...CLIENTS]}
          arrangement="ticker"
          context="Some of the teams we've worked with"
          headingId="logos-ticker"
        />
      </Section>
      <Label title="08b · Ticker with typeset wordmarks, on tint and ink">
        A client with no approved SVG keeps its typeset wordmark in the row. Token proof for the
        hover ink and the focus ring on the other grounds.
      </Label>
      {(['tint', 'ink'] as const).map((surface) => (
        <Section key={surface} surface={surface} aria-labelledby={`logos-ticker-${surface}`}>
          <LogoGrid
            marks={[{ name: 'Dealpath' }, ...EIGHT, { name: 'JoVE' }]}
            arrangement="ticker"
            context={`Ticker · surface="${surface}"`}
            headingId={`logos-ticker-${surface}`}
            contextAs="p"
          />
        </Section>
      ))}

      {/* ── 07 ──────────────────────────────────────────────────────────────────────────── */}
      <Label title="07 · The other surfaces">
        Token proof, not placements: the rule and context inks on tint, ink and blue. Blue and
        ink are never this band&rsquo;s ground on a page.
      </Label>
      {(['tint', 'ink', 'blue'] as const).map((surface) => (
        <Section key={surface} surface={surface} aria-labelledby={`logos-${surface}`}>
          <LogoGrid
            marks={EIGHT}
            context={`surface="${surface}"`}
            headingId={`logos-${surface}`}
            contextAs="p"
          />
        </Section>
      ))}
    </>
  );
}
