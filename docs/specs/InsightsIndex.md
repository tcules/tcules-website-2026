# InsightsIndex — template specification

> **Merged into ListingIndex, 22 Oct 2026 (owner).** "/insights and /case-studies should share the
> exact same structure so any updates to one should apply to the other"
> (`decisions/2026-10-22-listings-share-one-structure`). InsightsIndex, InsightsFormat and
> CaseStudyIndex are now ONE template, `src/templates/ListingIndex/`: the hero (`masthead`), the rail
> (curated views, or a picker beside a format page's content), one section head and one close.
> Everything that differs between the listings is data: the insights curation is `insights.tsx`
> (`insightViews`, `insightFormatPage`), the case groups `cases.tsx` (`caseViews`). Token prefix
> `--lix-*` (`tokens/components/listing-index.css`); specimen `/design/listing-index`. The sections
> below record the insights design and are kept for its reasoning.

> **Superseded in structure, 16 Oct 2026 (owner).** The hub is now a CURATED page, after the idea of
> claude.com/resources: the hero, then directly the curated column with IndexRail beside it. The rail's
> switch (BY TYPE / BY TOPIC, mono capitals) changes the whole view, held in `?view=topic`; both views
> are server-rendered. BY TYPE is a section per format in its own shape (articles: feature + tiles
> beside headlines; events: dated rows; videos: a screen and two minis; guides: a pair + headlines),
> each ending in "All <format>" → the format page. BY TOPIC is a section per CMS topic (industry
> excluded), formats mixed, no piece in two sections, its shape turning. Removed: the featured lead +
> headlines, the format jumps under the hero, the topic collections and the whole feed (filters,
> month river, Show more) — no in-page filtering anywhere. The format pages (`/insights/articles` …)
> now exist as **InsightsFormat** in the same folder: a big hero, the rail as a format picker, the
> newest piece with a picture featured large, then a grid of turning beats with a server-rendered
> Show more (`?page=n`). Every piece is a **Teaser** (tier 2): held without an edge, its own picture
> or none — never a stand-in. Lab moved from ink to tint (ch02: a page closes on paper or tint before
> the ink footer). The sections below record the 13 Oct design and are kept for its reasoning.

## 0 · Front matter

| | |
|---|---|
| **Tier** | 3 template, now `src/templates/ListingIndex/` (was `src/templates/InsightsIndex/`) |
| **Status** | superseded 22 Oct 2026 by ListingIndex (see the banner above); kept for its reasoning |
| **Token prefix** | `--lix-*` (`src/styles/tokens/components/listing-index.css`; was `--iix-*`) |
| **Designer / date** | Claude Code, 13 Oct 2026, to the owner's decision of the same day |
| **Implements** | Owner decision 13 Oct 2026: "FRONT PAGE + FEED". Reference: The Verge home page, for how it lists many varied items on one page and keeps it interesting and easy to search. A featured lead and a curated mix at the top; rows per format, each its OWN shape; then a latest-first feed carrying the filters (moved off the top, still URL-driven). Beauty is the core factor. |
| **Implemented at** | `src/templates/InsightsIndex/InsightsIndex.tsx` · `InsightsIndex.module.css` · `src/styles/tokens/components/insights-index.css` · `ListCard` `eyebrow` and `date` marker (extensions, § 3; ListCard spec amendment 13 Oct) · shared mapping `src/app/_insights/hub.ts` · specimen `src/app/design/insights-index/page.tsx` · route `src/app/insights/page.tsx` |

## 1 · Identity

The insights hub page type: everything Tcules publishes (articles, guides, research, podcasts,
videos, events, interviews) on one page, arranged as a newspaper front page over an archive.

**Tier 3**, because it is a whole page shape: it composes PageHero, BlockCardSet, BlockCard,
ListCard, Slider, ContentSection, CtaRow, CtaSection, Tag and Icon, and decides which of them
each format gets. The live route and the specimen render the same composition, as `CaseStudyIndex`
does for `/case-studies`.

**What it is not:**

1. Not a format index (`/insights/podcasts` …). Those are their own pages; this links to them, or to
   the feed filtered by format while they do not exist (§ 17 Q1).
2. Not an article page. `CorpusPage/LongformPage` renders an insight.
3. Not a search page. Filters are a query over a short catalogue (≤ 100 per kind), held in the URL;
   free-text search is out of scope (§ 17 Q4).

**Nearest existing thing: `CaseStudyIndex`**, which picks a band's arrangement from its position and
count. This is not a prop on it: the case index has one kind of item and argues by count; this page
has seven kinds and argues by KIND — each format has a shape of its own so that the page never
repeats one rectangle down its length (the owner's decision; CLAUDE.md § Design quality).

One per page.

## 2 · Anatomy

| # | Band | Built from | Required |
|---|---|---|---|
| A | **Masthead**: trail, h1, lede, the format jumps | `PageHero` stacked, paper, texture; jumps in its `children` slot as a `Cluster` of link `Button`s with a count | yes (jumps only when ≥ 2 formats) |
| B | **Front page**: one lead, a curated mix of up to four, one per format first | `BlockCardSet lead="beside"`: the lead's cover in the 2, the mix as text cards in the 1 | yes when ≥ 1 item |
| C | **Start with your problem**: up to four topic collections | `Layout` 4 → 2 → 1; each column an `Icon` head, an h3, one sentence, `ListCard` rows, a related link | optional (`collections`) |
| D | **Format rows**, in the template's fixed order, each its own shape (table below) | `ContentSection` with `actionsAt="end"` "All podcasts" `CtaRow` | one per format with items |
| E | **Lab**: the other organisation's offer | `ContentSection beside` on INK (owner, 13 Oct 2026: not blue): heading, lead and its link in the head track, the Lab illustration at 16:9 filling the two-thirds track — a register placeholder (`/insights#lab`, docs/image-register.md: "Lab illustration: experiments becoming product") until it is commissioned (owner, 13 Oct 2026: the same graphic was everywhere). The page passes the record as `lab.visual`; without one it falls back to `CtaSection offer` on ink | optional |
| F | **Feed**: everything, latest first, across the full column, under ONE compact filter row | `ContentSection`; the filter row (below); the ARCHIVE (below); "12 of 46 shown · Show more" | yes |
| G | **Close** | `CtaSection arrangement="open"` on tint, only with an action | optional |

**The archive (band F, owner 13 Oct 2026: "collect examples of really well done listing pages").**
Built from `docs/research/resources-listing.md`, which studies twelve listing pages (NN/g, Smashing,
The Verge, Stripe, Linear, Vercel, Figma, Intercom, Atlassian, Pentagram, Thoughtworks, IDEO). It
replaces the river, whose mixed feature, pair and row shapes were the zig-zag The Verge's archive was
faulted for. The variety belongs to bands A–E, and the archive gets ONE anatomy:
- **Rows, one anatomy** (research patterns 1–2): a ListCard per item. The meta eyebrow comes first
  (format · day · length; an event shows its own date and place), then the title (h4), then its line
  stacked under it at the reading measure. A stacked line keeps every row's edge. A split row set the
  line wherever the image left room, and the column zig-zagged.
- **A month ledger** (pattern 8, Linear): `Layout [1, 4]`. The month (h3, h5 role) stands in the left
  column and holds while its rows scroll (sticky from 1024). On a phone it sits above its rows.
- **Images only where the item has its own** (pattern 4, Figma): a real cover or the scene drawn for
  it, at the row's END (ListCard `markerPosition="end"`), so titles keep one edge. Never a stand-in
  photograph or a generic graphic. Hidden below 768.
- **A stated total and a pager that is a link** (patterns 5 and 7): "46 pieces · newest first" under
  the filter row. "12 of 46 shown · Show more" closes the list, and "Show more" is a link to
  `?page=n+1#feed`.
- Rejected, with reasons in the research doc: numbered pages, a card grid, in-page search, sort
  controls, full-width date bands.

**The filter row (band F, owner 13 Oct 2026: "the filters take too much space and aren't doing enough
of a job").** The sticky rail of chip groups is gone; the archive takes the full column. Above it, one
row at every width (`Layout [1, auto]`):
- **Format**, the primary filter: "All" then each format, each `Tag filter` with its count ("Guides 5")
  given the other held filters, on ONE line (`Cluster nowrap`) that scrolls sideways where it runs out
  of room, never wraps. A format with no results is hidden unless held.
- **More filters**: one native `<details>` at the row's end showing the held count ("More filters 1";
  "Filters" on a phone, so the format line keeps the room), opening a small panel that drops over the
  archive. Inside: Industry, Product, Topic — only options with results (counted against the other held
  filters), a group with one option or none dropped; a held option keeps its clear glyph.
- **When something is held**, a short summary under the row: "2 of 46 · Showing [Guides ×] [SaaS ×]
  Clear all"; each chip's link removes just that filter. Nothing is shown when nothing is held.
All of it is links the page built (`?filter-<group>=<id>`, `#feed`), so it is URL-driven and needs no
script; there is one design at every width.

**The format shapes (band D)** — chosen by what each format IS, not by its count:

| Format | Shape | Why this shape |
|---|---|---|
| articles | **wide**: `BlockCardSet lead="wide"`, three covers in [2, 1, 1] | the largest set; size contrast in one row |
| events | **ledger**: `ListCard` rows led by the `date` marker (day large, month and year under it), the place as the eyebrow, title beside body | an event is a date first |
| podcasts | **episode**: the newest as a horizontal `BlockCard` (cover beside copy, "Listen" cta, duration), earlier ones as rows | an episode is one thing you press play on |
| research | **reports**: horizontal text `BlockCard`s (head beside body), a `column` apart, "Read the research" cta with reading time as `meta` | an editorial weight: a report is read for its argument. A boxed card has no edge at rest (owner, 9 Oct), so the box read as misaligned text |
| videos | **rail**: a `Slider` of covered cards | the format people scrub through |
| interviews | **voices**: text tiles, title-led (`BlockCardSet` text, `md`) | a conversation is its headline |
| guides | **catalogue**: `ListCard` thumbnail rows in two columns (text rows when any cover is missing) | a shelf of practical walkthroughs |

Order: the canonical order is articles · events · podcasts · research · videos · interviews · guides,
then RE-DEALT (`alternate`) so a covered band (articles, podcasts, videos, and guides when every guide
has a cover) and a text band take turns, whichever formats are present — so no two text-heavy bands
meet when a format is missing or a catalogue drops to text (CLAUDE.md § Design quality). A surplus of
text bands can only fall at the end. The ink Lab band, a visual band (its illustration slot), sits between the last row and the feed,
closing the front page and opening the archive.

**Ruling, feed → close.** The feed (a list) is followed by the close on tint. They are both words, but
the close is a ground change carrying one centred ask, the page's bookend on every page type; it is
not a second text band in the sense of the rule. Recorded so review does not re-open it.

## 3 · Props / API

Every type is the template's own; the page maps the view model onto it (a template may not import
`@/content`).

| Prop | Type | Default | Decides |
|---|---|---|---|
| `breadcrumbs` | `readonly BreadcrumbItem[]` | — | the trail |
| `hero` | `{ title: string; lede?: string; eyebrow?: string }` | — | band A |
| `items` | `readonly InsightsIndexItem[]` | — | every resource, newest first. Feeds B and D |
| `featuredId` | `string` | first item with a cover, else the first | B's lead |
| `formats` | `readonly InsightsIndexFormat[]` | `[]` | per kind: `title`, `lead`, and `href` ("All podcasts") |
| `collections` | `readonly InsightsIndexCollection[]` | `[]` | band C; absent renders nothing |
| `lab` | `{ heading; body?; action: HeroAction }` | — | band E |
| `standIns` | `readonly BlockCardImage[]` | `[]` | catalogue photographs for missing covers, taken in order down the page |
| `feed` | `InsightsIndexFeed` | — | band F (below) |
| `closing` | `{ eyebrow?; heading; body?; action? }` | — | band G, only with `action` |

`InsightsIndexItem` = `{ id; kind: InsightsIndexKind; title; href; description?; cover?: BlockCardImage; publishedAt?: string (ISO); readingTime?; duration?; event?: { startsAt: string (ISO); place?: string } }`.

`InsightsIndexKind` = `'article' | 'guide' | 'research' | 'podcast' | 'video' | 'event' | 'interview'`.

`InsightsIndexFeed` = `{ id; heading; lead?; items (the visible page, already filtered); total (matching); filters: { id; label; options: { id; label; href; selected }[] }[]; clearHref?; moreHref? }`.
The page computes every href: the URL is the page's (`?filter-<group>=<id>`, `?page=<n>`), so the
template renders links and never reads `searchParams`.

**ListCard gains `eyebrow?: string`** (tier 2, global): one quiet mono label above the title, the
same voice as BlockCard's eyebrow ("Podcast · 25 Aug 2026"). Built in the tier below because the feed
and the episode rows need it and a row has nowhere else to say what kind of thing it is.

**Not props, deliberately:** surface (each band's ground is the template's: paper everywhere, ink Lab,
tint close), the format order, each format's shape, the front page's count (1 + 4), the row
capacities, colour, gap, padding. A CMS that could reorder or reshape the bands is how the old site
grew 111 sections.

**Compile errors rather than review notes:** `kind` outside the union; a collection item without
`href`; `lab` without an action.

## 4 · Variants × sizes

No variants and no sizes: one page type. What varies is DATA-DRIVEN and listed in § 12 — which
formats exist, how many items each has, which items have covers. Considered and rejected:

- **A tinted band per format** — rejected: weight comes from scale, imagery and position, never from
  a ground (CLAUDE.md § Design quality), and two tints would meet.
- **Numbered "top stories"** — rejected: a ranked list implies a ranking of our own work; the mix is
  one per format, in date order, unnumbered.
- **Filters at the top** (today's page) — rejected by the owner; they belong to the feed they filter.

## 5 · States

The template has no interactive state of its own. Its links, chips, cards and the Slider own theirs.
Page-level states, all server-rendered from the URL:

| State | Rendering |
|---|---|
| no filter | feed shows every item, newest first; no "Clear" |
| filter(s) held | the format line marks its held option; "More filters n"; the summary row ("12 of 41 · Showing [chip ×] … Clear all") |
| no match | "Nothing matches these filters." + "Clear all filters" |
| empty catalogue | "Nothing has been published yet." No front page, no rows |
| more to show | "Show more" link to `?page=n+1#feed` |

## 6 · Per-surface colour

The template draws its own marks: the jump and feed counts, the collection head (glyph, title,
sentence) and the filter group labels. Every other colour is a pattern's own.

| Token | paper | tint | ink | blue |
|---|---|---|---|---|
| `--iix-count-ink` | neutral-600 (4.92:1) | neutral-700 (7.27:1) | neutral-400 (8.05:1) | brandeis-100 (4.91:1) |
| `--iix-topic-body-ink` | neutral-700 (8.14:1) | neutral-700 (7.27:1) | neutral-300 | brandeis-50 (5.57:1) |
| `--iix-topic-title-ink` | neutral-900 | neutral-900 | white | white |
| `--iix-topic-icon-ink` | brandeis-500 (6.17:1) | brandeis-500 (5.51:1) | brandeis-300 | white |
| `--iix-filter-label-ink` | neutral-600 (4.92:1) | neutral-700 (7.27:1) | neutral-400 (8.05:1) | brandeis-100 (4.91:1) |

Paper: the quiet-label ramp BlockCard's eyebrow uses. Tint: the label steps to 700 because 600 is
4.39:1 there. Ink: lifted, as BlockCard's. Blue: the brandeis-50/100 pair BlockCard uses. Every band
on this page is paper except the Lab (ink, ContentSection with its illustration slot) and the close (tint, CtaSection);
the other surfaces are declared for self-containment (tokens rule 2).

## 7 · Geometry & spacing

**(a) Distances** — gap-scale roles:

- jumps: `Cluster colGap="block" rowGap="text"` (24 / 16: link buttons are 40 tall, 16 clears them)
- front page: BlockCardSet's own (`gutter` across, `column` down)
- collections: `Layout colGap="gutter" rowGap="stack"`; inside a column `block` (icon → head group),
  `text` (title → sentence), `block` (head group → rows), rows `none`
- event row: ListCard's own (marker beside copy at `block`; day over label at `tight`)
- episode: horizontal card, then rows under it at `stack`
- feed: head over body at ContentSection's `stack`; filter row → summary `text`; filters → archive
  `stack`; format line ↔ "More filters" `block`; panel groups `gutter` apart; label → chips `text`; chips
  `text`/`text` (the 24px touch-target argument the old page made, kept); rows `none`; list → "Show
  more" `stack`

**(b) Component sizes** — none in the template. ListCard's date column `--lcrd-date-inline` (96) is new, measured against "30" at the stat role and "SEPT 2026" at the eyebrow role. The filter panel's width (`--iix-panel-inline`, 560, capped at the viewport less two gutters) is a component size; the dropdown layer reads `--z-dropdown`. (The rail's sticky offset is retired with the rail.) Previously:
`--gap-section`, clear of the 72 nav bar, as CaseStory's marker does.

**(c) Optical corrections** — none.

Radius, border, shadow, z-layer: none of the template's own.

## 8 · Typography

| Part | Role | Tracking |
|---|---|---|
| jump count | `--text-ui` (mono, uppercase) | `--text-ui-tracking`, `--text-mono-case` |
| collection title (h3) | `--text-h4` | `--text-h4-tracking` |
| collection glyph | `--text-h5` (its em) | — |
| collection sentence | `--text-body-sm` | none — this role has no tracking companion |
| feed count line | `--text-ui` | `--text-ui-tracking`, `--text-mono-case` |
| filter group label (h3) | `--text-eyebrow` | `--text-eyebrow-tracking`, `--text-mono-case` |
| event date | ListCard `--lcrd-date-day-text` (`--text-stat`) | `--text-stat-tracking` |

Display type: none — the h1 is PageHero's `stacked` h1 (display is hero-only and this hero is not a
display hero). Section heads are h2 at ContentSection's `lg`. Titles carry `--text-title-wrap`.

## 9 · Responsive

- **1023 and below:** front page stacks (lead, then mix); collections 2 across; the filter row is the
  same at every width (the format line scrolls sideways at 390, "More" folds to "Filters"); event date stays beside its copy from 768.
- **767 and below:** collections 1 across; event date above its copy; articles' wide row scrolls (the
  set's own phone row); the video rail shows one with a peek.
- **Must not change:** the order of formats, the shapes, any gap step.
- **Touch targets:** filter chips 24 × 24 (AA floor, SC 2.5.8) with 16 clearance on both axes, so no
  two targets' 24px circles intersect; link buttons 40 tall; rows and cards are whole-row anchors.

## 10 · Composition

```tsx
<PageHero trail title body texture surface="paper">
  <Cluster as="ul" colGap="block" rowGap="text">{jump links}</Cluster>
</PageHero>
<Section aria-label="Featured"><BlockCardSet lead="beside" titleAs="h2" items={[lead, ...mix]} /></Section>
<ContentSection heading="Start with your problem">
  <Layout as="ul" columns={{ base: 1, md: 2, lg: 4 }} colGap="gutter" rowGap="stack">…</Layout>
</ContentSection>
{rows.map(row => <ContentSection id={`format-${kind}`} heading actions={<CtaRow rule={false} …/>} actionsAt="end">{shape}</ContentSection>)}
<ContentSection surface="ink" arrangement="beside" heading lead actions={<CtaRow rule={false} />}><Media image={placeholder /insights#lab} /></ContentSection>
<ContentSection id="feed" heading lead>
  <Layout columns={{ base: 1, lg: [1, 2] }} colGap="section" rowGap="stack" align="start">
    <aside>{filter groups}</aside>
    <Layout rowGap="stack"><Layout as="ul" rowGap="none">{ListCard rows}</Layout>{more}</Layout>
  </Layout>
</ContentSection>
<CtaSection arrangement="open" surface="tint" … />
```

No hand-rolled grid or flex, no margins on children, nothing overrides Section from outside. The
module carries only its own marks (§ 6), the format line's overflow and the filter panel's position.

## 11 · Accessibility

- One h1 (hero). Front-page card titles are h2 (the set sits directly under the h1, as the case
  index's does). Every other band has an h2; collection titles, row titles and filter group labels
  are h3.
- Jumps: a `nav aria-label="Formats on this page"` around a list of in-page links to `#format-<kind>`;
  each format band's `id` is its anchor. Counts are part of the link's name ("Podcasts, 2").
- Filters: each chip is a link; a held chip carries `aria-current` (Tag emits it from `selected`) and
  its `close-circle` is labelled "Clear filter". The format line is a `nav aria-label="Format"`; "More filters" is a native `<details>`/`<summary>`.
  The count line is a plain `p`: it is server-rendered and changes only on a full navigation, so a live region would add nothing.
- Every filter and "Show more" href ends in `#<feed id>`, so focus lands on the feed, not the top.
- Rows and cards: one anchor each (ListCard, BlockCard). The Slider owns its carousel semantics.
- Reduced motion: nothing here moves; the Slider and cards honour it themselves.

## 12 · Content edge cases

| Case | Handling |
|---|---|
| longest realistic title (~110 chars) | wraps; `overflow-wrap: anywhere` on every title (patterns) |
| one unbroken token | same |
| zero items | front page, rows and feed list absent; feed says "Nothing has been published yet" |
| one item | the lead alone (no mix); its format row then falls back to that item |
| many items (100 per kind) | rows cap (wide 3, ledger 4, episode 1 + 3, boxed 3, rail 8, voices 3, catalogue 6); feed pages 12 at a time |
| a format with no items | no row, no jump |
| missing cover | the front-page lead, article, podcast and video covers take a GENERATED graphic where the item maps to one (§ 12a), else a catalogue stand-in photograph from the page's `standIns` pool (visual-direction § 5.7), else the texture field; the mix and rows are text by design; catalogue drops ALL thumbnails if any is missing (a set is all-image or all-text) |
| missing description | the card or row renders title alone |
| event without a date | the ledger row keeps its date column, reading "—" / "Date TBC" as text (no `<time>`); the publish date is never passed off as the event's |
| podcast without duration | the cta stands alone |
| collections absent (live CMS today) | band C absent |
| lab / closing absent | bands absent |
| 767 track | every shape stacks or scrolls (§ 9) |
| logical properties | the module uses `inset-block-start` only |
| nested surface | not applicable: the template sets every surface |

## 12a · Drawn covers for missing covers (owner, 13 Oct 2026, revised)

**Rule:** a cover graphic is DRAWN FOR ITS ARTICLE, from that article's own argument. A generic
service scene (the seven in Gateway, home and the nav) is never a cover — it was, briefly, by keyword
match, and the owner saw "the same graphic everywhere". The keyword mapping is gone.

**Assignment is data, item by item:** `coverScene` on the view model (`InsightResource`), typed to
`ArticleSceneName` (`@/lib/sketches`) so a service scene cannot be named, filled by the insights
source from `src/content/sources/cover-scenes.ts` (CMS slug → scene) only for an item with no
thumbnail. The template renders it as BlockCard's / ListCard's `sketch` fill; its row is deleted when
the real cover lands.

**Drawn today:** one scene per live item without a cover, each a different composition and different
objects, in the Sketch plate language (dot plate, no type, Sketch's own colours per surface), facing
left toward the copy, three or more layers, anchored on the drawing's grid:

| Article | Scene | Concept |
|---|---|---|
| Accepting AI-generated front-end code: what review is for now | `code-review` | the generated file ticked through line by line, and a lens held over the two lines that carry the judgement — review is now for the decisions, not for reading every line |
| Vibe-coded app security checklist: 25 checks before real users arrive | `security-checklist` | a checklist (three done, one open) and the gate it holds shut, real users walking in from the right toward it |
| I vibe-coded an app. Now what? The path from prototype to production | `prototype-to-production` | a rough dashed sketch's path through four waypoints (the four questions) leftwards into a stored, running system |

**Everything else** without a cover — the stress fixture included, which is never drawn for — takes
the next catalogue photograph (`standIns`), and with no pool the texture field. The guide catalogue
keeps thumbnails when each guide has a cover, a scene or a photograph. The Lab band carries its
register placeholder (`/insights#lab`) until its illustration is commissioned.

## 13 · Motion

None of the template's own. Card hover, Slider and focus transitions belong to their patterns.

## 14 · Do's and Don'ts

- Do keep every format's shape distinct: at a squint no two adjacent format bands share an
  arrangement.
- Do keep the front page's mix one per format before any format repeats.
- Don't put a decorative image beside a set of linked cards.
- Don't place two text bands adjacent: the order in § 2 alternates.
- Don't number or rank any set.
- Don't read `searchParams` in the template.
- Don't add a tint band other than the close.

## 15 · Specimen plan

`/design/insights-index`:

1. **Stress fixture** — all seven formats, 52 items, long titles, unbroken tokens, missing covers and
   descriptions, collections, lab and close. Filters work (the specimen reads its own URL).
2. `?state=sparse` — the live CMS's shape: three formats, no collections, no close, most covers missing.
3. `?state=empty` — no items.

Each at 1440 and 390 (`npm run shots -- insights-index`), plus the live `/insights`.

## 16 · New token requests

`src/styles/tokens/components/insights-index.css` (§ 6, plus the panel and ring-room tokens and
`--iix-hidden-size`), and in `list-card.css`: `--lcrd-eyebrow-text`, `--lcrd-eyebrow-tracking`,
`--lcrd-eyebrow-ink` (per surface, BlockCard's eyebrow values, duplicated on purpose: tokens rule 6),
`--lcrd-date-day-text`, `--lcrd-date-day-tracking`, `--lcrd-date-inline`, `--lcrd-date-ink` (per
surface).

## 17 · Open questions

1. **Format pages do not exist yet** (`/insights/podcasts` etc. 404). "All podcasts" links to the feed
   filtered by that format until they do. **Decided (owner, 13 Oct 2026): approved as built.**
2. **Guides, research and videos are not in the CMS.** The view model carries the kinds; the fixture
   proves the shapes; live, those rows are absent. *Non-blocking.* Logged in
   `docs/strapi-changes.md` § 20.
3. **Collections ("Start with your problem")** are corpus copy (`_pages/insights.md`) carried by the
   fixture; Strapi has no curated-collection field. *Non-blocking*, logged.
4. **Search.** **Decided (owner, 13 Oct 2026): no free-text search.**
6. **Mobile filters.** **Decided (owner, 13 Oct 2026):** below 1024 the filter groups fold into a
   native `<details>` whose control reads "Filters · n active"; from 1024 the open sticky rail.
   **Superseded the same day** by the one compact filter row (see "The filter row", § 2). Built.
7. **Missing covers.** **Decided (owner, 13 Oct 2026):** generated graphic wherever one fits, photograph
   otherwise — § 12a. Built.
8. **Lab link** (CMS sends `/labs`). **Decided (owner, 13 Oct 2026):** the Lab band links to
   ROUTES.futureInterfacesLab; the Strapi mapper rewrites `/labs`, so no page renders it
   (strapi-changes § 20f). Built.
5. **The lead story.** No CMS `featured` flag today, so the lead is the newest item with a cover.
   *Non-blocking*, logged.

## Appendix — self-audit

- 18 sections present: 0–17.
- Distances named by role: 14; raw values: 0.
- New tokens: 12 template + 7 ListCard, every surface block complete.
- Patterns reused: PageHero, BlockCardSet, BlockCard, ListCard, Slider, ContentSection, CtaRow,
  CtaSection, Breadcrumbs; primitives: Section, Layout, Cluster, Button, Icon, Tag.
- New patterns: 0. New template: 1. Pattern extended: ListCard (`eyebrow`, `date` marker).

## Amendment · 1 Nov 2026 — the author pages: `AuthorPieces` and `ListingClose` `lead`

The author pages sit in the listing's family (src/templates/ListingIndex/), so their parts live here.

- **`AuthorPieces({ heading, items })`** (`authors.tsx`): one person's pieces, newest first, in three
  registers, each drawn one way and never mixed (decisions/2026-10-11-card-variants-stay-distinct). The
  latest piece WITH a picture is the wide feature, the hub lead's horizontal BlockCard, its cover beside its
  words. A piece without a picture never leads (owner, 1 Nov 2026, rejecting the text-only split), and a
  person with no pictured piece has no feature. Where TWO or more of the rest have a picture, they follow as the hub's cards (`CardGrid`,
  `facts`), at most six, every card a cover. Everything else is the resource ledger, one piece per ruled
  row (Teaser `row`, `metaAside`, `ruled`, `arrow`; home's "Selected thinking"), the format glyph and name
  with the date in the meta column. Not grouped by type: a person with two pieces would get two one-item
  sections, and every row names its format. Nothing is hidden. The hub's `InsightResources` and every
  other use of the hub's cards are unchanged.
- **`ListingClose` `lead?: string`**: the close's lead line where the page around it cannot use the
  listing's own (the authors index shows people, not pieces). Absent, the closing's `body`, so `/insights`
  is unchanged.

Specimen: `/design/listing-index?data=author` (many pieces with covers, many without, two without).
