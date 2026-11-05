import { Layout, Section } from '@/components';

import { Box, Specimen, specimenStyles as s } from '../_specimen/Specimen';

/**
 * Layout specimen — the checkpoint page. If the ratio grid, the reflow grid and equalRows all
 * render correctly here, then the reset, the var() fallbacks, CSS Modules and the layout engine
 * are all working together.
 */
export default function LayoutSpecimenPage() {
  return (
    <Section>
      <Layout rowGap="stack">
        <Layout rowGap="block">
          <h1>Layout</h1>
          <p>
            The columnar primitive. Owns the two seams between its children and arranges them
            into tracks. A vertical stack is the single-track case.
          </p>
        </Layout>

        <Specimen
          title="columns={[2, 1]} colGap='block' rowGap='block'"
          note="Fractional weights — a 2:1 ratio from md up, collapsing to a single track below 768."
        >
          <Layout columns={[2, 1]} colGap="block" rowGap="block">
            <Box tall>2fr</Box>
            <Box tall accent>
              1fr
            </Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={{ lg: [1, 'auto'] }} colGap='column' rowGap='block'"
          note="An 'auto' weight is a content-sized track: as wide as its child, while the 1fr track takes the rest. For a control group pinned to the end of a row (ContentSection actionsAt='end'); never for text, which would grow the track to its full length. Single track below 1024."
        >
          <Layout columns={{ lg: [1, 'auto'] }} colGap="column" rowGap="block">
            <Box tall>1fr</Box>
            <Box accent>auto · sized to me</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={3} colGap='block' rowGap='block'"
          note="Three equal tracks from md up. minmax(0, 1fr) means a long unbroken word cannot widen its track."
        >
          <Layout columns={3} colGap="block" rowGap="block">
            <Box>1</Box>
            <Box>2</Box>
            <Box>3</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns='fit' minTrack='sm' colGap='block' rowGap='block'"
          note="Content-driven: as many 16rem tracks as fit, no breakpoints involved. Resize the window — it reflows continuously, and the part-full last row STRETCHES to absorb the slack."
        >
          <Layout columns="fit" minTrack="sm" colGap="block" rowGap="block">
            <Box>fit</Box>
            <Box>fit</Box>
            <Box>fit</Box>
            <Box>fit</Box>
            <Box>fit</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns='tile' minTrack='sm' justify='center'"
          note="The same reflow, but tracks keep their width so the leftover stays leftover — which is what lets justify centre a part-full last row instead of stretching it. Compare against 'fit' above."
        >
          <Layout columns="tile" minTrack="sm" colGap="block" rowGap="block" justify="center">
            <Box>tile</Box>
            <Box>tile</Box>
            <Box>tile</Box>
            <Box>tile</Box>
            <Box>tile</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={3} equalRows"
          note="Every item fills its row, so the short cards grow to match the tall one — the fill is on the box itself, not just the invisible track."
        >
          <Layout columns={3} colGap="block" rowGap="block" equalRows>
            <Box>short</Box>
            <Box tall>tall — sets the row height</Box>
            <Box>short</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={{ base: 1, md: 3 }} lead equalRows"
          note="The first child spans every track in a row of its own; the rest fill the tracks below. The lead is tall, and the rows under it are still equal only to each other: the lead's row is explicit and auto, the later rows are 1fr, so its height never leaks into theirs."
        >
          <Layout columns={{ base: 1, md: 3 }} colGap="block" rowGap="block" equalRows lead>
            <Box tall accent>
              lead — spans the row
            </Box>
            <Box>short</Box>
            <Box>a longer peer that sets its own row height for the two beside it</Box>
            <Box>short</Box>
            <Box>short</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={[7, 5]} align='first-baseline'"
          note="First lines share a baseline although the two sides open at different sizes and the right one wraps: a large line beside a smaller reply (VoiceLedger). align='baseline' would sink the reply's first line to the large line's last; 'start' would set it high by the difference in line height."
        >
          <Layout columns={[7, 5]} colGap="column" rowGap="text" align="first-baseline">
            <p className={s.specFirstBaselineLarge}>A large first line</p>
            <p>
              A smaller reply beside it that runs on to a second line, its first line on the
              large line&apos;s baseline.
            </p>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={3} align='center'"
          note="Without equalRows, align places each item in its row instead of stretching it. Centre: the short boxes sit mid-height against the tall one."
        >
          <Layout columns={3} colGap="block" rowGap="block" align="center">
            <Box>short</Box>
            <Box tall>tall</Box>
            <Box>short</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={{ base: 1, md: 2, xl: 4 }}"
          note="Per-breakpoint object. Each breakpoint falls back to the nearest smaller defined template, so lg inherits md's two tracks."
        >
          <Layout columns={{ base: 1, md: 2, xl: 4 }} colGap="block" rowGap="block">
            <Box>1</Box>
            <Box>2</Box>
            <Box>3</Box>
            <Box>4</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={{ base: 2, md: 3 }} trail='until-md'"
          note="The last child spans every track below 768, in a row of its own: at 390 children 1 and 2 pair and 3 runs across under them, where it would otherwise sit alone in the first track. From 768 nothing is placed and the three sit side by side. The studio collage's lower row is built on it."
        >
          <Layout columns={{ base: 2, md: 3 }} colGap="text" rowGap="text" trail="until-md">
            <Box tall>1</Box>
            <Box tall>2</Box>
            <Box accent>3 · trail — across on a phone</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={[1, 1]} reverse — from md up"
          note="Bare reverse applies from md, like a bare columns spec. At 1440 the image (accent, first in the DOM) sits RIGHT; at 390 the row is one 326 track and the image comes first, in source order. Visual only: reading and Tab order are always the DOM order, so reverse is for image/text pairs, never for a sequence."
        >
          <Layout columns={[1, 1]} colGap="column" rowGap="block" align="center" reverse>
            <Box tall accent>
              1 · image — first in the DOM
            </Box>
            <Box>2 · copy — second in the DOM</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={[2, 1]} reverse={{ lg: true }}"
          note="Reversed from 1024 only: the ratio travels with its child, so the 2fr image lands on the right and the 1fr copy on the left. Between 768 and 1023 it reads in source order; at 390 it is a single track."
        >
          <Layout columns={[2, 1]} colGap="column" rowGap="block" reverse={{ lg: true }}>
            <Box tall accent>
              1 · image — 2fr
            </Box>
            <Box>2 · copy — 1fr</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={3} reverse — a triple"
          note="Child k takes the k-th track from the end, so a triple mirrors to 3 · 2 · 1 at 1440 and stacks 1 · 2 · 3 at 390."
        >
          <Layout columns={3} colGap="block" rowGap="block" reverse>
            <Box accent>1</Box>
            <Box>2</Box>
            <Box>3</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={{ base: 2 }} reverse={{ base: true, lg: false }}"
          note="The explicit off. Two tracks at every width, reversed at 390 and restored from 1024 — so at 1440 the accent box is back on the left."
        >
          <Layout
            columns={{ base: 2 }}
            colGap="block"
            rowGap="block"
            reverse={{ base: true, lg: false }}
          >
            <Box accent>1</Box>
            <Box>2</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={[1, 2]} offset={1}"
          note="One child, set into the 2fr track with the leading 1fr left empty — a reading column offset into the page. At 390 a bare offset does not apply and the child fills the 326 track."
        >
          <Layout columns={[1, 2]} colGap="column" rowGap="block" offset={1}>
            <Box tall>the reading column — starts at track 2</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={4} offset={2}"
          note="The first child starts at track 3; the second flows on after it into track 4, and a third wraps to the start of the next row. Stacked in source order at 390."
        >
          <Layout columns={4} colGap="block" rowGap="block" offset={2}>
            <Box accent>1 · starts at track 3</Box>
            <Box>2 · flows on</Box>
            <Box>3 · wraps</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={3} — each card a Layout rowGap='block' pinLast"
          note="Three cards with different body lengths in one row. The outer row stretches every card to the tallest; inside each, the last row is 1fr and the cta aligns to its end, so the three ctas share one baseline at 1440. At 390 each card is its content height and pinLast changes nothing."
        >
          <Layout columns={3} colGap="gutter" rowGap="gutter">
            {[
              'A short body.',
              'A body of middling length that wraps to two or three lines at desktop width.',
              'The longest body in the row, written to run on so that this card sets the row height for the other two and the pinned ctas beside it have spare height to sit at the foot of.',
            ].map((body, i) => (
              <Layout key={i} rowGap="block" pinLast className={s.box}>
                <strong>Card {i + 1}</strong>
                <p>{body}</p>
                <Box accent>cta — pinned to the foot</Box>
              </Layout>
            ))}
          </Layout>
        </Specimen>

        <Specimen
          title="columns={2} — the start stack fillLast, beside a taller stack"
          note="The chip form's split panel (19 Oct 2026): the start stack is stretched to the taller stack beside it, its last row is 1fr and its last child keeps the default stretch, so the accent box GROWS down to where the other half ends and both halves finish on one line. pinLast would sit the box at the foot at its own height instead. At 390 the stacks are their content height and fillLast changes nothing."
        >
          <Layout columns={2} colGap="column" rowGap="gutter">
            <Layout rowGap="text" fillLast>
              <Box>a pair of fields</Box>
              <Box accent>the message — fills the rest</Box>
            </Layout>
            <Layout rowGap="block">
              <Box>a group</Box>
              <Box tall>a taller group</Box>
              <Box>a field</Box>
            </Layout>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={{ lg: 2 }} shareRows={3} — parts of two items on shared lines"
          note="From 1024 each item's three parts start on one line across both items even though item 1's middle part is taller; at 390 they stack as usual."
        >
          <Layout columns={{ lg: 2 }} colGap="column" rowGap="stack" shareRows={3}>
            {[
              "A long body that runs to about three lines at desktop width, written so that this item's middle part is taller than the other's and the rows below must still start together.",
              'A one-line body.',
            ].map((body, i) => (
              <Layout key={i} rowGap="block" className={s.box}>
                <Box>head</Box>
                <p>{body}</p>
                <Box accent>rows start here</Box>
              </Layout>
            ))}
          </Layout>
        </Specimen>

        <Specimen
          title="columns={3} — the same cards without pinLast"
          note="The control. Each cta follows its own body, so the three sit at three different heights."
        >
          <Layout columns={3} colGap="gutter" rowGap="gutter">
            {[
              'A short body.',
              'A body of middling length that wraps to two or three lines at desktop width.',
              'The longest body in the row, written to run on so that this card sets the row height for the other two and the pinned ctas beside it have spare height to sit at the foot of.',
            ].map((body, i) => (
              <Layout key={i} rowGap="block" className={s.box}>
                <strong>Card {i + 1}</strong>
                <p>{body}</p>
                <Box accent>cta — follows the body</Box>
              </Layout>
            ))}
          </Layout>
        </Specimen>

        <Specimen
          title="columns={{ lg: [2, 1] }} lead='tall' colGap='gutter' rowGap='column'"
          note="From 1024 the first child takes the first track and spans every row; the rest stack beside it, one per row. Below 1024 it is the single-track stack, lead first. BlockCardSet's spotlight (lead='beside') is built on it."
        >
          <Layout columns={{ lg: [2, 1] }} colGap="gutter" rowGap="column" lead="tall">
            <Box tall accent>
              lead · spans both rows
            </Box>
            <Box>beside · row 1</Box>
            <Box>beside · row 2</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={2} stagger colGap='gutter'"
          note="From 1024 every even child drops by the section step (96). The offset is a track, not a margin: three rows (offset, cards, offset), odd children in the first two and even in the last two, so both share one height and the row grows by exactly 96. One row only. Below 1024 the two sit level."
        >
          <Layout columns={2} colGap="gutter" stagger>
            <Box tall>1 · at the top</Box>
            <Box tall accent>
              2 · dropped one section step
            </Box>
          </Layout>
        </Specimen>

        <Specimen
          title="columns={[1, 1]} — a stretched card whose stack takes fillFirst"
          note="The mirror of pinLast. The left card is stretched to the right one's height; its stack fills it and the FIRST row (accent) takes the spare height, never dropping below its own size. BlockCard's spotlight lead uses it so its cover grows to the notes beside it."
        >
          <Layout columns={[1, 1]} colGap="gutter" rowGap="gutter">
            <Layout rowGap="block" fillFirst className={s.box}>
              <Box accent>first row · grows</Box>
              <p>Short copy under it.</p>
            </Layout>
            <Layout rowGap="block" className={s.box}>
              <strong>The taller neighbour</strong>
              <p>
                A longer column, written to run on so that this card sets the row height and the
                first row in the card beside it has spare height to take. It wraps to several
                lines at desktop width and more on a phone, where the two stack and nothing
                grows.
              </p>
            </Layout>
          </Layout>
        </Specimen>

        <Specimen
          title="scroll='until-md' tabIndex={0} aria-label='Studio photographs'"
          note="A scroll row whose items hold nothing focusable takes the tab stop itself, so it needs a name: aria-label is passed straight through. Below 768 the row also bleeds through the 32 gutter to the viewport edge, with the first item still on the column edge."
        >
          <Layout
            scroll="until-md"
            columns={{ base: 1, md: 3 }}
            colGap="gutter"
            tabIndex={0}
            aria-label="Studio photographs"
          >
            {['1', '2', '3'].map((n) => (
              <Box key={n}>{n}</Box>
            ))}
          </Layout>
        </Specimen>

        <Specimen
          title="Nesting — rhythm comes from grouping, not from a rhythm knob"
          note="An outer stack at 'stack' (48) holding two inner stacks at 'tight' (8). The tight pairs read as units because of the contrast between the two seams, and no child sets any margin of its own."
        >
          <Layout rowGap="stack">
            <Layout rowGap="tight">
              <Box>grouped — tight seam</Box>
              <Box>grouped — tight seam</Box>
            </Layout>
            <Layout rowGap="tight">
              <Box>grouped — tight seam</Box>
              <Box>grouped — tight seam</Box>
            </Layout>
          </Layout>
        </Specimen>

        <Specimen
          title="The gap scale — inline · tight · text · block · gutter · stack · column · section · section-open"
          note="All nine steps, in order: 4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128. The scale does not shift responsively — a step is chosen by what it separates, and the layout changes at a breakpoint, not the distance."
        >
          <Layout rowGap="block">
            {(
              [
                'inline',
                'tight',
                'text',
                'block',
                'gutter',
                'stack',
                'column',
                'section',
                'section-open',
              ] as const
            ).map((rung) => (
              <Layout key={rung} rowGap={rung}>
                <div className={s.ruler}>rowGap=&quot;{rung}&quot;</div>
                <div className={s.ruler} />
              </Layout>
            ))}
          </Layout>
        </Specimen>

        <Specimen
          title="scroll='until-md' columns={4} colGap='gutter'"
          note="Four equal tracks from 768 up, exactly as without the prop. Below 768 the same children are one sideways row: one item in view and a 24 peek of the next (--lay-scroll-peek), each item a snap point, the scrollbar hidden. visual-direction § 3.7: a linked card set of more than three, where every item is focusable so Tab moves the row. Resize below 768, or read the 390 shot."
        >
          <Layout scroll="until-md" columns={4} colGap="gutter" rowGap="column">
            <Box tall>1</Box>
            <Box tall>2</Box>
            <Box tall>3</Box>
            <Box tall accent>
              4
            </Box>
          </Layout>
        </Specimen>

        <Specimen
          title="scroll='always' columns={{ base: 1, md: 2, lg: 3 }} colGap='gutter'"
          note="Scrolls at every width; columns names how many are IN VIEW per step, counts not ratios. Three in view from 1024 are a 3-up grid's tracks to the pixel, so the band arithmetic holds; below 768 the peek appears. The row grows its box by --lay-scroll-ring-room (4) on every side, padding cancelled by a negative margin, so its clip cannot cut a focus ring and the items still sit on the column edges. The Slider pattern drives this mode and adds the controls; on its own it has no affordance on a desktop without a trackpad."
        >
          <Layout scroll="always" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter">
            {['1', '2', '3', '4', '5', '6'].map((n) => (
              <Box key={n} tall accent={n === '4'}>
                {n}
              </Box>
            ))}
          </Layout>
        </Specimen>

        <Specimen
          title="scroll='always' columns={1} peek={false} colGap='gutter'"
          note="The peek switched off: exactly one item in view at every width, 390 included, and the next one wholly off the row's end. For a one-up row whose items are composites — the Slider's one-per-view testimonial, a portrait over a quote — where a 24 sliver of the neighbour reads as a stray photograph edge rather than as more to come. The controls carry that message instead. Default true; ignored without scroll. Compare the 390 shot with the row above."
        >
          <Layout scroll="always" columns={1} peek={false} colGap="gutter">
            {['1', '2', '3'].map((n) => (
              <Box key={n} tall accent={n === '2'}>
                {n}
              </Box>
            ))}
          </Layout>
        </Specimen>

        <Specimen
          title="scroll='always' with no colGap → items touch"
          note="The seam is stated or it is 0, in a scroll row as everywhere. A row of edge-to-edge items is wrong on sight, which is the point."
        >
          <Layout scroll="always" columns={3}>
            {['1', '2', '3', '4'].map((n) => (
              <Box key={n}>{n}</Box>
            ))}
          </Layout>
        </Specimen>

        <Specimen
          title="A horizontal media item takes a whole row — data-media-row"
          note="Owner, 29 Oct 2026 (decisions/2026-10-29-media-rows-take-a-whole-row): an item whose picture sits BESIDE its words (BlockCard horizontal, a ListCard row with a thumbnail, a Teaser row or beside with a picture) declares data-media-row, and in any track count it spans every track, so two never sit side by side. The vertical items around it keep their tracks. Not in a scroll row. Here a three-track Layout: vertical, vertical, the media row on its own row, then vertical again."
        >
          <Layout columns={{ md: 3 }} colGap="gutter" rowGap="column">
            <Box>vertical card</Box>
            <Box>vertical card</Box>
            <div data-media-row>
              <Box>media row — picture beside words, the whole row</Box>
            </div>
            <Box>vertical card</Box>
          </Layout>
        </Specimen>

        <Specimen
          title="No gap stated → 0, on purpose"
          note="Neither axis has a default. A silent 24 looks plausible and hides an omission; a collapsed seam is wrong on sight. These two boxes share an edge."
        >
          <Layout columns={2}>
            <Box>no colGap</Box>
            <Box>no colGap</Box>
          </Layout>
        </Specimen>
      </Layout>
    </Section>
  );
}
