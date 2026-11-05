# Tcules UI kit: visual direction

Status: **decided** (design director, 5 Oct 2026, revision 3). § 10 lists what still goes to the owner.
Only one item there blocks anything, and what it blocks is a docs-only package (`fdn-brand-docs`).

Scope:
- the six service pages (`/design/service-page/<slug>`);
- the kit family specimens (`/design/kit/<family>` plus one `/design/<unit>` route per new unit);
- the kit showcase pages (`/design/kit/home`, `/design/kit/about`, `/design/kit/services-index`).

**Precedence.** Every package in § 11 carries these rules.
- Where a rule here conflicts with a spec in `docs/specs/`, this document wins. The package that owns
  the spec amends it in the same PR.
- Where a rule conflicts with `docs/brand/` ch02 or ch05, this document also wins until `fdn-brand-docs`
  applies the edits in § 9. Every brief repeats this, because agents read the brand chapters.

**Inputs:**
- the 1 Oct review;
- the owner rulings relayed with this brief (5 Oct);
- the spacing audit, the hero/breadcrumb proposal and the texture proposal (5 Oct; shots are in the
  session scratchpad under `kit/`);
- `public/kit/photos/catalogue.json` (52 photos), plus a tone measurement of every file (§ 5.5);
- the four references at 1470 × 830.

**Changed from revision 2** (each of these answers a critic note):
- S1 now unifies at 24.
- Card-set rows stay at `column`, with a CLAUDE.md amendment.
- Word ceilings are derived from line counts, and every band has 40px of slack.
- New rules: photo resolution, photo tone, and a frame/radius table.
- The service hero shape is locked, and § 2.3 says what lifts it.
- kit/home opens on a photograph.
- Slider uses a Layout scroll mode.
- Texture is no longer gated.
- Fit, ProofBlock-with-case and Steps are kept.
- A hero family, text-only cards, and CtaRow variants in four families are added.
- fdn-gates lands before any family starts.
- File lists are complete.

---

## Arithmetic constants

Every number below is measured at **1470 × 830**.
- **Content column:** 1240.
- **Section padding:** 96 + 96, which leaves **638** for content. `tight` (64 + 64) leaves 702, and
  `open` (128 + 128) leaves 574.

**Line boxes,** from the token ladders (size × line height):

| Role | Line box (px) |
|---|---|
| eyebrow | 14 |
| display | 70 |
| h1 | 57 |
| h2 | 47 |
| h3 | 39 |
| h4 | 34 |
| h5 | 28 |
| h6 | 24 |
| quote-lg | 44 |
| quote (28px) | 38 |
| stat-lg | 54 |
| lead | 30 |
| body-lg | 28 |
| body | 26 |
| body-sm | 22 |
| button lg | 48 |
| button md | 40 |

**Words per line** are estimated at 6.1 characters per word including the space. Sans is taken at
0.5 em per character and the serif titles at 0.45 em. `fold:check` (§ 1.3) measures real line counts,
so these numbers are for writers and planners, and the gate is the authority.

| Role at width | Characters per line | Words per line |
|---|---|---|
| display 67 at 572 | 19 | 3.1 |
| h1 54 at 763 | 31 | 5.1 |
| h2 43 at 32ch (stacked) | 35 | 5.8 |
| h2 at 667 | 34 | 5.6 |
| h2 at 477 | 25 | 4 |
| h2 at 381 | 20 | 3.2 |
| h4 28 at 392 / 365 | 31 / 29 | 5 / 4.7 |
| h5 22 at 286 / 365 | 29 / 37 | 4.7 / 6 |
| lead 20 at 56ch / 572 / 477 | 62 / 57 / 48 | 10 / 9.4 / 7.8 |
| body-lg 18 at 381 | 42 | 6.9 |
| body 16 at 392 / 365 / 763 | 49 / 46 / 95 | 8 / 7.5 / 15.6 |
| body-sm 14 at 286 / 349 / 365 / 667 | 41 / 50 / 52 / 95 | 6.7 / 8.2 / 8.5 / 15.6 |
| quote-lg 34 at 667 | 44 | 7.1 |
| quote 28 at 392 / 763 | 31 / 60 | 5 / 10 |

---

## Owner rulings · 7 Oct 2026 (design review)

These override anything below that disagrees; the inline amendments point here.

1. **Tables are boxed.** Tabular content — a key column and data columns that a reader compares
   across rows — renders as the boxed DataTable: outer border, head fill, body ground, a hairline
   between every row and column. The box is the table's, not a variant: DataTable's `frame="ruled"`
   (6 Oct) is withdrawn, because ruled tables read dense and compact. The service page's Spectrum,
   Matrix and Record are boxed DataTables; a record of six or more fields sets as two boxed halves
   side by side from 1024, so the band keeps its fold. The "no boxes around text content" ruling
   still holds for cards and diagrams — a table is not text content in a box, it is a table. Where a
   ruled list is genuinely the right form (ListCard rows, ReadDown, Steps), it stays ruled, and any
   loosening is a gap-scale step, never a local distance.
2. **No text-only left/right splits.** A head with no image beside it is ONE column: eyebrow →
   heading → lead (24 each), then its action a `stack` under the lead. ContentSection's `split-head`
   (the H-row) is removed, and Banner `below` stacks its head over the photograph. Side by side
   survives only where one side is media: ContentSection `media`, `beside` with a photograph or stat
   aside (and `beside` over a read-down body, where the split is head | body), Banner `beside`, K, L.
   Every H-row arithmetic below is superseded by H-compact or H-full plus the action:
   + 48 + 40 (a link) to the head.
3. **A set's heading outranks its items.** A heading over a set of titled items is always at least
   one type step above the largest item title. On the service page that is `SetHeading` (the h3
   role), the one way the template heads a set: a ledger, a slice's acceptance levels, a record.
   The ledger's h5 heading over h4 rows was the failure.
4. **The statement has no split.** Statement is one column: the eyebrow directly above the sentence
   (`block`), start-aligned on a generous measure (`align="start"`, the default) or centred
   (`align="center"`). The `[1, 2]` form, eyebrow alone in the head track ~480 from its sentence,
   left the band with no anchor.
5. **A head's actions may sit at the end of the heading's row** (ContentSection `actionsAt="end"`).
   The text stays one column on the left; the actions take a content-sized track at the row's end
   from 1024, their top on the heading's top (the eyebrow keeps its own line above both), 64
   (`column`) from the text. Below 1024 they fall back a `stack` under the lead. This is not the
   retired split: the text is still read top to bottom in one column, and the actions are a control
   group pinned to the title, not a second column of copy. Stacked heads only.
6. **Tables scroll sideways on a phone; they never restack** into key/value blocks. A table is read
   across its rows, and that reading survives a horizontal scroll better than it survives blocks.
7. **Never two text-heavy bands back to back** (§ 1.7): follow a text-heavy band with a visual one.
8. **IRL photographs carry one consistent tone layer** (§ 5.5a). The treatment is TBD; the hook ships.
9. **Proof is a set, not a ranking** (§ 5.8): logos, case studies, testimonials and the platform rating.

**Image pass, 7 Oct 2026** (owner: "sometimes you need one, sometimes you don't"). A photograph earns
its band only when it shows what the words cannot (the studio, people at the work, an artefact), is
the one large thing in a text-only stretch, or is a hero, banner, offer, case cover or portrait.
Generic stock beside a structure that is already the content (steps, a typed list, an icon set)
does not. So **F takes no photograph** (head beside the steps), and a six-route **C-icon names no
photo where a neighbour band already carries an image**, unless it is the page's only studio photo or
dropping it leaves three image-less bands in a row (product-design keeps its router crit for both
reasons); without one it stacks its head over the icons, three across. Rhythm floor instead of the old minimums: roughly every second or third band still carries
an image. This amends § 3.3's F and C-icon binding rules and § 5.1 rule 3's "≥ 4 photographs".

## Owner rulings · 9 Oct 2026 (card sections)

These override anything below that disagrees, including the 7 Oct image pass where it gave C-icon a
photograph.

1. **An icon card stacks.** Glyph on its own row, then the title, then the body — in every card
   (BlockCard, ListCard tile, every frame, the hairline tile included) and at every width. Never the
   glyph inline beside the title: that reads as a bulleted heading. The glyph keeps its size (the title
   role's em) and sits a `text` (16) above the title.
2. **The box has no edge.** `frame="box"` keeps its 24 inset and its hover ground at the 8 radius —
   the inset exists for the ground — and loses its border on every side and surface. A linked box
   answers the pointer with the ground and the title's accent, and the keyboard with the ring.
3. **A section of clickable cards puts its head above them.** Eyebrow, heading and lead run the full
   column, and the cards follow under them as the heading's continuation. Never a head track beside a
   card grid: that reads as two things side by side.
4. **No decorative image in a section of clickable cards.** The cards are the band's shape. A
   photograph may sit beside a list of items a reader does NOT click (B: a hairline problem list),
   with the items continuing under the heading in the same column.

So C-icon, the list router and C-pair stack their heads and take no photograph; B is unchanged.

5. **Section copy steps down one size.** The section lead (`--text-lead`) is 18 (was 20; line height
   1.55, was 1.5) and section body (`--text-body-lg`) is 16 (was 18; 1.6, was 1.55), so body-lg now
   equals body by decision. Neither re-declares at 1023 or 767. The hero keeps 18 / 20: its default
   lead re-points to `--text-lead`, and `leadSize="lg"` to the new `--text-lead-lg` (20 / 1.5,
   18 / 1.55 at 767), which carries the old lead's ladder.
6. **No close repeats the reply time.** The compact form already says "We reply within a business
   day", so the close copy is one short lead, at most one short note and at most one next step.
7. **Two tinted bands are never adjacent**, the close L included. On a service page the plan
   enforces it as it assigns surfaces (`plan.ts`): the proof band G keeps tint and its neighbour
   drops to paper, so a page ending on G gets a paper close.
8. **A set of points never sits as a separate strip under a split; points stay with the copy they
   belong to.** (9 Oct 2026.) CtaSection's landscape offer (`media.frame="landscape"`, [5, 7] with
   the points as a ruled 3-up strip under copy and photo) is removed; every K offer with a photo is
   the portrait [7, 5], its points in the copy column.

---

## 0 · The diagnosis, in numbers

The review said the pages read as "text, text, text". There are four causes, and copy volume is one of
them.

| | Bands | Words per band | Head (eyebrow + title + lead) | Bands with a photo, illustration or video |
|---|---|---|---|---|
| Meridian (systems design) | 9 | 9 to 136 (FAQ 271) | 9 to 60 | 4 of 9, plus a slider and a photo close |
| Executra | 12 | 46 to 107 (FAQ 210) | 12 to 45 | a photo in every second band |
| Our six service pages | 10 to 12 | **37 to 238** | 30 to 90 | **1 or 2** (the hero illustration, plus case covers) |

1. **Too much copy per band.** Without a ceiling, the only way to meet the fold rule is to pack the band
   full. **Copy now has a budget, derived from line counts (§ 1.5).**
2. **No imagery.** The references put an image in every second band. We have one or two per page.
3. **One shape repeated.** We put ruled rows under a stacked, left-aligned head eight times in a row.
4. **Bands taller than the screen.** 17 of our bands are over 830.

**The fix is composition, imagery and a copy budget. It is not shrinking gaps.**

---

## 1 · Spacing

### 1.1 No token value changes. Five seams change step.

The nine gap steps keep their values, and no token is added. The audit found no step at the wrong value,
only seams using the wrong step.

| # | Seam | File | Old step | New step | Ink gap after | Why |
|---|---|---|---|---|---|---|
| S1 | Section eyebrow → title | `ContentSection.tsx:221` | `tight` 8, in a nested Layout | **`block` 24, flat**: one `rowGap="block"` Layout holds eyebrow, title and lead | 16 → ~32 | Matches PageHero (`PageHero.tsx:447`) and CtaSection (`CtaSection.tsx:143`), which already use `block`. **Neither of those changes.** |
| S2 | Card eyebrow → title, and title → body | `BlockCard.tsx:259`, `:303–304` | `tight` 8 | **`text` 16** | 16 → ~24, and 25 → ~33 | Three rows at one step have no hierarchy. A 12px label stuck to a 28px serif reads as cramped. |
| S3 | ListCard title → body | `ListCard.tsx:217`, `:242` | `tight` 8 | **`text` 16** | 25 → ~33 | Puts ListCard and BlockCard on one card rhythm. |
| S4 | Card set → the block after it (Callout, CtaRow) | `Cases` in `ServicePage/Blocks.tsx:187` | `gutter` 32 | **`stack` 48** | | `gutter` separates peers in a set. This seam is block to block. |
| S5 | CTA point label → detail | `CtaSection.tsx:171` | `inline` 4 | **`tight` 8** | | `inline` is a key and its value. A label over its description is a tight pair. |

**Why S1 is flat at 24, and not a 16 nest.** Every section head in the kit (PageHero, CtaSection and
ContentSection) now uses one rhythm: **eyebrow → title 24, title → lead 24.** Nothing gets tighter than
it is today, which the owner's "eyebrow too close" note requires.

ContentSection's comment cites layout rule 4 (rhythm comes from nesting). The PR rewrites that comment
the way PageHero's already reads: "the eyebrow-to-title seam and the title-to-copy seam are the same
step, so one Layout." Hierarchy between the eyebrow and the lead comes from scale (a 12px mono label
against a 20px lead), not from a different gap.

**Cards keep 16 inside.** That is one step below the section's 24, so a card reads as a smaller unit of
the same system.

S6 (Breadcrumbs) and S7 (the repeated eyebrow) are solved by § 2.

### 1.2 The rhythm every component carries

| Relation | Step | px |
|---|---|---|
| Key → value; name → role in a quote | `inline` | 4 |
| Icon → label; CTA point label → detail; chips; Callout label → content | `tight` | 8 |
| Card eyebrow → title → body; paragraph → paragraph; icon → card title | `text` | 16 |
| **Section eyebrow → title → lead**; card media → copy; card copy → card CTA; quote → attribution | `block` | 24 |
| Peer cards in a row (columns); the trail → hero title | `gutter` | 32 |
| Head → body; lead → actions; body → CtaRow; block → block | `stack` | 48 |
| **Rows of a card set**; peer halves; a contrast pair | `column` | 64 |
| A split (copy beside image, head beside body, copy beside form); section padding | `section` | 96 |
| Statement band padding (§ 3.4 J) | `section-open` | 128 |

**Card-set rows are `column`, and the worktree CLAUDE.md is amended to say so (in the `fdn-spacing`
PR).**
- `BlockCardSet` already sets rows at `column`, and that was approved by the owner on 29 Sep. Its
  comment records why: at 32, a borderless tile's copy ran into the image below it, and 48 still read
  as one field.
- A step is chosen by what it separates. Down a borderless set, each row is the next set of objects and
  must read as separate. That is the `column` step's own job, turned to the block axis.
- **Amendment** to the gap-scale table's `--gap-column` row: "column gutter where two halves must read
  as separate, **and the row seam of a borderless card set (29 Sep 2026)**".
- The rule covers every card set in the kit: image, icon and text cards, and B tiles. It does not cover
  ruled ListCard rows, whose padding is their own.

**The gap and the ratio are separate decisions.**
- **The gap is set by kind.** A split always takes `section`; peer halves take `column`.
- **The ratio is set by weight.** A split may be [1, 1] (hero, ruling H2), [1, 2], [5, 7] or [7, 5].
  Equal tracks do not make two regions peers.

### 1.3 The fold rule, with slack

**Hard limit:** at 1470 × 830, every band except the footer is ≤ 830 tall, so its content is ≤ 638 at
default density. The hero must also *end* at or above y = 830.

**Design target:** every archetype's arithmetic, with copy at its ceiling, leaves **≥ 40 of slack**:
content ≤ **598** at default density, ≤ 662 at `tight` and ≤ 534 at `open`. The slack is the calm. A
band sized to 0 to 10px under the limit looks packed even when it passes.

How it is measured:
- An accordion is measured closed.
- A slider is measured at its tallest slide plus its controls.
- **Enforced by `npm run fold:check`** (`fdn-gates`). Every `Section` carries `data-band="<archetype>"`.
  The check measures every band on every route listed in `fold.config.json`. Each family adds its
  specimen route, and `cmp-service-pages` adds the six pages.
- A specimen block that shows a deliberate failure carries `data-fold-exempt="<reason>"`.

**Never** shrink a gap step, drop a lead, or change density to make a band fit. Density belongs to a band
type (I is `tight`, J is `open`), and is not a way to squeeze. **When a band does not fit, move detail to
the deep page or into an accordion. Only if that fails, split it into two bands** with different
archetypes. The ai-product-ux *evidence* band (1341) and *product-responsibility* band (1143) are split.

### 1.4 How each archetype fits: the arithmetic

**Head forms** (§ 1.1 rhythm; ceilings are from § 1.5):

| Head | Parts | Height | + `stack` to body |
|---|---|---|---|
| **H-title** | eyebrow, h2 on 1 line | 14 + 24 + 47 = **85** | 133 |
| **H-compact** | eyebrow, h2 on 1 line, lead on 2 lines | 85 + 24 + 60 = **169** | 217 |
| **H-full** | eyebrow, h2 on 2 lines, lead on 2 lines | 14 + 24 + 94 + 24 + 60 = **216** | 264 |
| ~~**H-row**~~ | **Retired 7 Oct 2026 (7 Oct ruling 2).** Was [1, 2] at `section`: eyebrow + h2 (2 lines) in 381, then lead (2 lines) + 48 + action in 763 | max(132, 156) = **156** | 204 |
| **H-compact + action** | the stacked head that replaces it: H-compact, then 48 + a link (40) | 169 + 88 = **257** | 305 |
| **H-beside-aside** | in 381: eyebrow, h2 on 2 lines, body-lg lead on 3 lines; then 48 + aside | 14 + 24 + 94 + 24 + 84 = **240** | its own column |
| **H-beside-actions** | in 381: eyebrow, h2 on 3 lines, body-lg lead on 4 lines, 48, actions | 14 + 24 + 141 + 24 + 112 + 48 + 48 = **411** | its own column |

**Superseded 7 Oct 2026 (7 Oct ruling 2): the H-row is retired; the two amendments below are history.**

**Amended 6 Oct 2026 (`fdn-section-head`): the H-row's eyebrow sits above the split.** Built as first
written (eyebrow + h2 in the 381 track), no alignment of the two tracks reads as one row: top-aligned,
the lead starts beside the 12px eyebrow; bottom-aligned, the taller trailing track (lead + 48 + action)
drops the heading below the lead's first line. ContentSection `split-head` therefore puts the eyebrow
on its own row, then h2 (381) beside lead + 48 + action (763), top-aligned: 14 + 24 + max(94, 128) =
**166**, + `stack` = 214. C-image-3 with an H-row is 214 + 381 = **595** (target 598); C-image-4 with
an H-row 515. Word ceilings (§ 1.5) are unchanged.

**Amended 6 Oct 2026 (`cmp-banner`): the I banner's H-row is lead + 24 + action.** In Banner `below`
the lead and its single link are one trailing unit set against the h2, and at 48 the link floated
loose in a mostly empty 763 track and the row read as a form. ContentSection's H-row keeps lead + 48 +
action, where the action is a section action rather than the lead's own link. Two H-rows, two beats,
on purpose: the banner's is a head over one photograph, ContentSection's a head over a body.

**Tracks:**

| Split | Tracks |
|---|---|
| [1, 2] at `section` | 381 \| 763 |
| [5, 7] at `section` | 477 \| 667 |
| [1, 1] at `section` | 572 \| 572 |
| [1, 1] at `column` | 588 \| 588 |
| 3 across at `gutter` | 392 |
| 4 across at `gutter` | 286 |
| 2 across at `gutter` inside 763 | 365 |
| 2 across at `column` inside 763 | 349 |
| 2 across at `gutter` inside 667 | 317 |

**Unit heights:**

| Unit | Parts | Height |
|---|---|---|
| Card-3 (392) | 16:9 = 221; 24; h4 on 2 lines = 68; 16; body on 2 lines = 52 | **381** (+30 with a card eyebrow; +64 with a per-card CTA, 24 + 40) |
| Card-4 (286) | 16:9 = 161; 24; h5 on 2 lines = 56; 16; body-sm on 2 lines = 44 | **301** |
| Card-pair (365) | 3:2 = 243; 24; h4 on 2 lines = 68; 16; body on 3 lines = 78 | **429** |
| Text card (392) | hairline 1; 24; index/eyebrow 14 + 16; h4 on 2 lines = 68; 16; body on 3 lines = 78 | **217** (191 with a 2-line body) |
| Icon card (365) | icon 32; 16; h5 on 1 line = 28; 16; body-sm on 2 lines = 44 | **136** |
| B tile (317) | h5 on 1 line = 28; 16; body-sm on 3 lines = 66 | **110** |
| D row (349, 2 columns) | h5 = 28; 16; body on 3 lines = 78; padding 64 | **186** (body-sm, 174, until 6 Oct: § 7.2) |
| D row (763, 1 column) | h5 = 28; 16; body on 2 lines = 52; padding 64 | **160** |
| F step row (ListCard, split form) | max(h5 28, body on 2 lines 52) + padding 64 | **116** (90 with a 1-line body) |
| CTA point | h6 = 24; 8; detail = 22 (1 line) or 44 (2 lines) | **54 / 76** |
| CtaRow | 48 seam + one 48 row | **96** |
| Photo aside, 3:2 at 381 | | **254** |
| Stat aside | stat-lg 54; 16; body-sm on 2 lines = 44 | **114** (measured 123 as a Proof figure with its "checked on" line; 136 with a 12-word label on 3 lines: `fdn-section-head`, 6 Oct) |
| Slider controls | 24 + 48 (the steppers are 48 since 6 Oct, cmp-testimonials) | **72** |

**Fit, per archetype** (§ 3.4 defines the archetypes; every row is checked against the 598 target):

| Band | Composition | Content | Target |
|---|---|---|---|
| **A** service hero | § 2.4 | band ends ≤ 823 | ✓ |
| **B** media split | photo 4:5 in 477 = **596**. Copy in 667: H-full 264 + 2 rows of 2 tiles (110 + 64 + 110 = 284) = 548 | 596 | ✓ 42 |
| **B** with a CtaRow | copy: H-full 264 + 1 row of 2 tiles 110 + 96 = 470 | 596 | ✓ |
| **C-image-3**, linked whole card | H-compact 217 + 381 | **598** | ✓ 40 |
| **C-image-3**, H-row with a section action | 204 + 381 | **585** | ✓ |
| **C-image-3**, per-card CTA | H-title 133 + 381 + 64 | **578** | ✓ |
| **C-image-3**, CtaRow below | H-title 133 + card with a 1-line title (347) + 96 | **576** | ✓ |
| **C-image-4** | H-full 264 + 301 = **565**. With a per-card CTA: H-compact 217 + 301 + 64 = **582**. H-row: 204 + 301 = **505** | ≤ 582 | ✓ |
| **C-image-5+**, Slider showing 3 | H-title 133 + 381 + 72 | **586** | ✓ |
| **C-text-3** | H-compact 217 + 217 = **434**; +64 with a per-card CTA = 498 | ≤ 498 | ✓ |
| **C-text-6** | H-title 133 + 2 × 191 + 64 = **579** | | ✓ |
| **C-icon-4** | head track: H-beside-aside 240 + 48 + 254 = **542**. Body: 2 × 136 + 64 = 336, + CtaRow 96 = 432 | 542 | ✓ |
| **C-icon-6** | head track 542. Body: 3 × 136 + 2 × 64 = 536. **No CtaRow** (632) | 542 | ✓ |
| **C-pair** | head track H-beside-actions 411; body: 2 pair cards = 429 | **429** | ✓ |
| **D**, 2 columns | head track: H-beside-aside 240 + 48 + photo 254 (or stat 114) = 542 (402). Body: 3 rows × 186 = 558; with a CtaRow, ≤ 2 rows: 372 + 96 = 468 | **558** | ✓ 40 |
| **D**, 1 column | head track as above. Body: ≤ 3 rows × 160 = 480, + CtaRow = 576 | **576** | ✓ |
| **D-faq** | centred H-title 133 + ≤ 7 closed items × 64 = **581**. With a CtaRow: ≤ 5 items: 133 + 320 + 96 = **549** | | ✓ |
| **N** contrast | H-title 133 + [1, 1] at `column`: h4 34 + 24 + ≤ 4 rows × 84 = 394 | **527** | ✓ |
| **E** diagram | H-compact 217 + a diagram ≤ 380 | **597** | ✓ |
| **F** process | head track 542 (photo aside). Body: ≤ 4 rows × 116 = 464, or 5 one-line rows × 90 = 450; + CtaRow 96 = 560 / 546. With the worked-example Callout above the rows (≈ 158 + 48): ≤ 3 rows, 554 | **≤ 560** | ✓ |
| **G** typographic | eyebrow 14 + 48 + quote-lg on 5 lines 221 + 24 + attribution 50 + 24 + RatingBadge 40 = **421**; + CtaRow = 517 | | ✓ |
| **G-case** | H-title 48 + 48 + [1, 2]: case card in 381 (3:2 254 + 24 + 30 + 68 + 16 + 52 + 24 + 40 = 508). Quote in 763, stretched to the card and its attribution and badge pinned to the card's foot, so the tracks share a top and a bottom line (cmp-testimonials, 6 Oct). **Measured at 1470: 564** (card 467 with a 3-line body; band 756); without the rating 538 (band 730) | **564** | ✓ |
| **G** featured with portrait | [5, 7]: portrait 1:1 at 477 = **477**. Copy: quote-lg on 6 lines 265 + 24 + 50 = 339, + CtaRow = 435 | 477 | ✓ |
| **G** group of 3 | H-title 133 + (portrait 64 + 24 + quote on 5 lines 190 + 24 + 50 = 352) = **485**; + CtaRow = 581 | | ✓ |
| **G** slider | slide 477 + 24 + controls 48 = **549**, no head: the one-up slide is the large object and the rail and steppers name the band (6 Oct: an eyebrow a `stack` above measured 603 against the 598 target). **Measured at 1470: 549** (band 741) | **549** | ✓ |
| **G** rating-led | eyebrow 14 + 48 + [5, 7]: score at `--text-score` (105) with its scale and label at its side, + 24 + pill 34, beside quote-lg on 3 lines 133 + 24 + 50 = **347** budget; + CtaRow = 443. **Measured at 1470: 269**, + CtaRow 358 | | ✓ |
| **H** strip | centred H-title 133 + 2 rows of marks (48 + 48 + 48) = **277** | | ✓ |
| **H** grid beside a head | head 240; grid 2 × 48 + 48 = 144 | **240** | ✓ |
| **H** marks beside a real quote | H-title 133 + max(quote on 4 lines 152 + 24 + 50 = 226, 3 × 48 + 2 × 48 = 240) | **373** | ✓ |
| **S** stats | H-compact 217 + one row of stats (114) = **331**; + CtaRow = 427 | | ✓ |
| **I** banner, below (`tight`) | stacked head with its link (7 Oct 2026, 7 Oct ruling 2) ~257 + 48 + photo 3:1 at 1240 = 413 | **~695** (measured 695 at 1440, band 823 with 64 + 64) | ✓ ≤ 702 |
| **I** banner, beside (`tight`) | photo 3:2 in 667 = **445**. Copy in 477: 14 + 24 + h2 on 3 lines 141 + 24 + lead on 3 lines 90 + 48 + 48 = 389 | 445 | ✓ |
| **J** statement (`open`) | one column (7 Oct 2026, 7 Oct ruling 4): eyebrow 14 + 24 + h1 on 3 lines 171 | **209** | ✓ ≤ 534 |
| **K** offer | [7, 5]: copy in 667: H-full 264 + 3 one-line points (3 × 54 + 2 × 24 = 210) + 48 + 48 = 570. Photo 4:5 in 477 = **596** | 596 | ✓ |
| **K** without a photo | [1, 2]: head track H-beside-actions 411; points in 763: 3 × 76 + 48 = 276 | **411** | ✓ |
| **L** close | [5, 7]: copy in 477: 14 + 24 + h2 on 2 lines 94 + 24 + lead on 3 lines 90 + 48 + 3 two-line points (3 × 76 + 48 = 276) = 570. Form in 667 ≤ 560 | **570** | ✓ |
| **L** beside a photo | [5, 7]: photo 4:5 in 477 = **596**. In 667: H-title 133 + compact form ≤ 400 = 533 | 596 | ✓ |
| **M** resources | as C-image-3, linked | **598** | ✓ |

**The rules this arithmetic fixes, which are binding:**

1. **Card images in a set of 3 or more are 16:9.** 3:2 stays for 1 or 2 cards. Horizontal cards are
   4:3.
2. **A 3-across image set** takes exactly one of four forms:
   - H-compact with whole-card links;
   - H-row with a section action;
   - H-title with a per-card CTA;
   - H-title with a CtaRow and 1-line card titles.

   It never takes H-full, and never carries a card eyebrow under H-compact (628).
3. **An image set of 5 or more** is a Slider showing 3 (§ 3.4 C). A 3 × 2 grid of image cards (826) does
   not fit.
4. **Feature sets never use BlockCardSet's featured lead.** BlockCardSet features its first card from 4
   items (ruling C3, for the case-study index). Feature bands pass `lead="none"` (`cmp-feature`).
5. **A 2 × 2 image grid never sits in a beside body.** A beside body takes 2 pair cards, icon cards or
   rows.
6. **The head track takes an aside *or* actions, never both.** 411 + 254 overflows.
7. **C-icon-6 never takes a CtaRow.** It takes per-card links. C-icon-4 may take one.
8. **D rows:** ≤ 3 per column. A set never exceeds 6. Two columns with a CtaRow take ≤ 2 rows each.
9. **B carries ≤ 4 tiles, or ≤ 2 tiles and a CtaRow,** never both in full.

### 1.5 The copy budget, derived from the lines above

Every ceiling is the line count the arithmetic assumes, at the § 0 words per line, rounded down. A
writer meets the word ceiling; `fold:check` measures the line count. A unit over its line count fails.
Patterns emit `data-copy="<role>"` on copy elements so the gate can find them (`fdn-gates`).

**Heads**

| Unit | Lines | Words |
|---|---|---|
| Eyebrow | 1 | ≤ 4 |
| h2: H-title, H-compact | 1 | ≤ 5 |
| h2: H-full | 2 | ≤ 10 |
| h2: H-row, H-beside-aside | 2 (in 381) | ≤ 6 |
| h2: H-beside-actions | 3 (in 381) | ≤ 8 |
| Lead: stacked or H-row | 2 | ≤ 18 |
| Lead: H-beside-aside | 3 (body-lg) | ≤ 18 |
| Lead: H-beside-actions | 4 (body-lg) | ≤ 24 |

**Cards and rows**

| Unit | Lines | Words |
|---|---|---|
| Card-3 title / body | 2 / 2 | ≤ 8 / ≤ 14 |
| Card-4 title / body | 2 / 2 | ≤ 8 / ≤ 12 |
| Card-pair title / body | 2 / 3 | ≤ 8 / ≤ 20 |
| Text card title / body | 2 / 3 | ≤ 8 / ≤ 22 (≤ 14 in C-text-6) |
| Icon card title / body | 1 / 2 | ≤ 5 / ≤ 14 |
| B tile title / body | 1 / 3 | ≤ 4 / ≤ 20 |
| D row (2 columns) title / body | 1 / 3 | ≤ 5 / ≤ 19 (body, not body-sm, from 6 Oct: § 7.2) |
| D row (1 column) title / body | 1 / 2 | ≤ 5 / ≤ 28 |
| F step title / body | 1 / 2 (1 line in a set of 5) | ≤ 4 / ≤ 18 (≤ 9) |
| N contrast item | 2 | ≤ 14 |
| CTA point label / detail | 1 / 1 in K, 2 in L | ≤ 4 / ≤ 12 in K, ≤ 18 in L |
| D-faq question / answer | 1 / hidden | ≤ 12 / ≤ 80 |
| Stat label | 2 | ≤ 12 |

**Quotes, statements and the hero**

| Unit | Lines | Words |
|---|---|---|
| Quote-lg (typographic G) / featured | 5 / 6 | ≤ 35 / ≤ 40 |
| Compact quote: G-case / group | 5 | ≤ 45 / ≤ 25 |
| J statement (h1) | 3 | ≤ 14 |
| Hero title | 3 | ≤ 48 characters |
| Hero lead | 3 | ≤ 26 words |

**Band totals** (visible words; each is the sum of its ceilings, so a band can never sit at its total and
break a unit ceiling):

| Archetype | Ceiling | | Archetype | Ceiling |
|---|---|---|---|---|
| B | 128 | | G typographic / G-case | 50 / 80 |
| C-image-3 / -4 / slider (visible 3) | 95 / 112 / 75 | | H / S | 10 / 95 |
| C-text-3 / -6 | 120 / 140 | | I below / beside | 32 / 38 |
| C-icon-4 / -6 | 110 / 142 | | J | 18 |
| C-pair | 92 | | K / L | 86 / 100 |
| D 2-column / 1-column | 190 / 128 | | M | 95 |
| D-faq (questions only) | 95 | | E (with diagram labels ≤ 60) | 87 |
| F | 120 | | N | 125 |

**Copy that goes over is rewritten.** Detail moves to a row, to an accordion, or to the linked deep page.
Splitting into a second band is the last resort (§ 1.6). `cmp-service-pages` logs every edit to a
service fixture in `docs/content-changes.md`, with the old and new text.

### 1.6 Band count

**A page carries 8 to 12 bands, as many as its argument needs.**
- "Do not cap at 5" does not mean "12". The references run 9 (Meridian) to 12 (Executra), and their
  calm comes from fewer, airier bands.
- **Moving detail to the deep page or into an accordion is always preferred over adding a band.**
- `fold:check` reports the band count. Below 8 or above 12 fails on the service and showcase pages.

### 1.7 Rhythm between bands

- **The seam is 96 + 96 = 192** between any two bands. Section keeps both paddings, as it has since
  30 Sep.
- **There is no blue band** (§ 4). The footer is ink.
- **Paper carries the page.** Tint marks two things: the proof band (G), placed mid-page, and **the
  close** (L — the page's last band; owner, 7 Oct 2026), so the page steps paper → tint → the ink
  footer and the end reads as an ending. More than one tint band on a page is fine when they are
  well apart; never two adjacent. The mid-page offer (K) stays paper: a tinted offer would spend the
  ending's signal. The close carries no texture for now (textures are to be reworked after the
  7 Oct review). The slim announcement strip (§ 3.4) may also sit on tint. It is a strip, not a band.

**Paper runs of 4 or 5 bands need something that marks where one band ends.** Every page uses all three
of these devices:
1. **Head alignment alternates** (§ 3.5). No two adjacent bands share both a head form and an alignment.
2. **Imagery cadence** (§ 5.1).
3. **The arrangement changes at every seam** (§ 3.4).

**Never two text-heavy bands back to back** (owner, 7 Oct 2026). A text-heavy band is one a reader can
only read: no photograph, and a body made of words — J, D-faq, N, F, C-text, and D, G, K or I when no
photograph or case card landed in it. A band is **visual** when it carries a photograph or its job is
drawn: E (a diagram), H (marks), M (covers), C-icon (an icon set), C-pair and G-case (cards with
covers). After a text-heavy band comes a visual one. `planBands` checks the rule on the finished plan
(`textHeavy`, `textHeavyPairs` in `ServicePage/plan.ts`) and warns in development; it never reorders,
because the fix is the story's order or a photograph, and both are decisions.

---

## 2 · Top of page

**Chosen: the trail moves inside the hero, and service pages drop the hero eyebrow.** This is Option C
of the hero proposal, with the split kept at **[1, 1]** (ruling H2).

### 2.1 Breadcrumbs (pattern)

- Renders only `<nav aria-label="Breadcrumb">` and its trail, and no longer renders a `Section`.
- Delete `.root`, which held the 64 above and the focus-ring clearance below.
- Delete the `surface` prop. The colour comes from the enclosing band's `data-surface`, as a Button's
  does (token rule 7). The per-surface tokens in `breadcrumbs.css` keep their values.
- The 44px hit area extends upward into the hero's 96 of padding, which leaves 23 clear.

### 2.2 PageHero (pattern)

- **New prop `trail?: { crumbs: ReactNode; current: string }`.** The route or template passes
  `crumbs: <Breadcrumbs items={…} />` and `current`, the last crumb's label.
  - No pattern imports another.
  - **In development, PageHero warns** when `eyebrow` equals `trail.current` (trimmed, ignoring case).
- Structure: `<Layout rowGap="gutter">{trail.crumbs}{split}</Layout>`. That puts 32 between the 13px
  trail and the 67px title.
- `beside` keeps `{ lg: [1, 1] }` and `colGap="section"` (96). Fix the stale comment that says 64; the
  code is right.
- **Alignment against media** (§ 3.2):
  - an illustration is centred on the copy (`align="center"`);
  - a photograph is top-aligned, at a ratio chosen so its height matches the copy (§ 2.5).
- `eyebrow?` stays, for heroes where it adds what the trail cannot (`Podcast · Ep 12`,
  `Case study · Fintech`).
  - *Built 6 Oct 2026 (`fdn-top`):* "repeats" is decided in `src/lib/trail.ts`. An eyebrow repeats a
    crumb that names something when it says that crumb's words ("Product Design specialist" under
    "Product design"). It repeats a section crumb ("Home", "Services", "Case studies", the list
    `SECTION_INDEXES` in `src/lib/routes.ts`) only when it equals it. So both models above stand, and a bare "Case study" under Home / Case studies does not.
    The warning compares with every crumb in `trail.labels`, not `trail.current`; see
    `docs/specs/PageHero.md` items 1 and 2.
- `texture?: ReactNode` (`fdn-texture`): only on a hero with no media or with a photograph, never with an
  illustration.

### 2.3 The service-page hero: the shape is locked; this is what lifts it

**The [1, 1] copy-plus-illustration shape is locked by ruling H2.** This revision does not change it.
Instead it changes everything that made the first viewport read as a document:

1. **The h1 starts at 222, not 296.** The crumb band and the eyebrow are gone, so 74px return to the
   title.
2. **The title is rewritten to ≤ 48 characters.** That is 3 balanced lines at 572, where today's titles
   run 3 to 5 lines (51 to 64 characters). It is a sentence, not a slogan.
3. **The lead is cut to ≤ 26 words** (3 lines). `hero.body` moves to the first band's lead.
4. **One solid action and its blue ghost partner.** The hero's blue masses are the solid and the
   illustration (§ 4.3); the ghost's label and arrow are the foreground accent (§ 4.2). *(Amended
   7 Oct 2026, owner: the partner was a link-style action; § 4.5.)*
5. **The illustration stays 572 wide and is centred on the copy.** It is unboxed at its own ratio (the
   six run 1.13 to 1.35 : 1, so 424 to 505 tall). No texture sits behind it and no type sits on it.
6. **The next band is the B photograph.** The hero ends 7 to 88px above the fold, and on every service
   page the first scroll lands on a photograph (§ 5.6).
7. **The six hero illustrations are redrawn** to the illustration drawing standard: left-facing, the
   concept taken from the page's argument, 3 or more varied layers, exact anchoring. This is the biggest
   single lift to the first viewport, and it is tracked outside this kit (`docs/illustration-concepts.md`).
   The kit does not wait on it.

**Option offered to the owner, not blocking** (§ 10, item 2):
- `cmp-hero` builds a **centred-head + media-below** service hero on the `/design/kit/hero` specimen,
  using product-design's content: the trail, a centred display title, the lead and actions, then the
  illustration at 1240 wide and clipped by the fold.
- That variant cannot meet "the hero ends ≤ 830". It is a specimen marked `data-fold-exempt`, shown
  beside the locked shape, so the owner can compare the two.
- H2 stands unless the owner picks the other variant.

### 2.4 Budget at 1470 × 830 (the service hero)

| | px | running |
|---|---|---|
| SiteNav (72 + hairline) | 73 | 73 |
| Hero top padding | 96 | 169 |
| Trail | 21 | 190 |
| Trail → split (`gutter`) | 32 | **222**, the top of the split (was 296) |
| Copy: title on 3 lines 209 + 24 + lead on 3 lines 90 + 48 + actions 48 | 419 | |
| Illustration, 572 wide | 424 to 505 | split = max(copy, illustration) ≤ 505 |
| Hero bottom padding | 96 | **≤ 823** |

- Tags (optional) add 48 + 32 = 80 to the copy (499), which stays inside the tallest illustration. Tags
  are therefore allowed only when the title is ≤ 3 lines.
- **On a phone**, the trail starts at 161 and the h1 at about 214 (65 + 96 + 21 + 32). The illustration
  sits below the actions.

### 2.5 The hero variants the kit proves (`cmp-hero`)

| Variant | Where | Composition | Budget |
|---|---|---|---|
| **Illustration** [1, 1] | service pages | § 2.4 | ends ≤ 823 |
| **Photograph** [1, 1] | `kit/home`, `kit/about` | copy (eyebrow 14 + 24 + display on 3 lines 209 + 24 + lead on 3 lines 90 + 48 + 48 = 457), beside a **5:4 photograph at 572 × 458**, top-aligned; `hero-foot` texture under the copy | 73 + 96 + 458 + 96 = **723** |
| **No media** | `kit/services-index`, and the specimen | stacked; display at `--measure-display`; lead; actions; `hero-field` texture in the empty end half | ≈ 73 + 96 + 14 + 24 + 140 + 24 + 60 + 48 + 48 + 96 = **623** |
| **Centred head + media below** | specimen only (§ 2.3 option) | `data-fold-exempt` | — |
| with or without a secondary action; with or without Tags; with an announcement strip above (showcase only, +74) | all variants | | the photo hero with a strip: **797** |

PageHero's `media.image` takes a photograph with `ratio` and `focus` from `fdn-media`. Today's `image`
media is intrinsic only.

### 2.6 Migration

There are **25 rendering consumers** of Breadcrumbs:
- **20 live routes:** about, audits/[slug], careers, case-studies/[slug], contact, expertise/[slug],
  future-interfaces-lab, future-interfaces-lab/join, glossary/[slug], how-we-work, insights,
  insights/[...slug], insights/events/[slug], insights/podcasts/[slug], matter-design-system,
  privacy-policy, services, services/[...slug], terms-of-use, tools/[slug];
- **3 specimens:** design/breadcrumbs, design/page-hero, design/section;
- **2 templates:** CaseStudyIndex, ServicePage.

Every rendering consumer moves its crumbs into the PageHero `trail`. On every route where the eyebrow
repeats the last crumb, the migration **fixes** it: it drops the eyebrow, or replaces it with a category
or format the trail cannot say. The PR lists each route and what changed. A route whose first band is
not a PageHero is listed too, and gets no special case.

---

## 3 · Composition without boxes

### 3.1 How a card or group is delimited, in order of preference

1. **Space.** The gap ladder groups by proximity: 16 inside a card, 24 from media to copy, 32 between
   peers in a row, 64 between rows of a set, 48 between blocks. The steps are distinct, which is why S2
   and S3 matter.
2. **The image's edges.** A card with media is the image plus the copy under it. The image sets the
   card's width and top edge (frame and radius: § 5.3).
3. **Scale.** A serif title at h4 or h5 against 14 to 16px body anchors a card on its own.
4. **Alignment.** Shared top edges (`equalRows`), shared baselines, and `pinLast` for the CTA.
5. **A hairline rule, only where it is earned:**
   - between the rows of a read-down list;
   - the top edge of a **text-only card** (below);
   - table rows;
   - above a section-level CtaRow — **except under a ruled ladder** (an Accordion, ListCard rows, a
     table), whose last rule already closes the body; there the CtaRow takes `rule={false}`, or two
     hairlines 48 apart read as a double rule (`fdn-section-head`, 6 Oct 2026).

   Never around a card, under a card title, or between cards in a set.

**Text-only cards** (a card with no image, `C-text`):
- **A text-only card takes a hairline at its own top edge, the width of the card.** It stands in for the
  top edge an image would give. The 32 gutter breaks the rule between cards, so the set reads as three
  objects and not as a table row.
- Then 24, then an index numeral or eyebrow in mono, then the title and body. The rule is
  `--bcrd-text-rule-*` (`cmp-feature`), neutral on every surface.

**Mixed sets.** A set is all-image or all-text.
- When some items lack an image, BlockCardSet takes a stand-in for each missing one (§ 5.7).
- If stand-ins are switched off (`standIns={false}`), every card drops its media and the set renders as
  C-text.
- A set never renders with holes or empty frames. `cmp-feature`'s specimen proves both outcomes from
  the same mixed input.

**Boxes stay where they are the thing:** form fields, Tag chips, the RatingBadge, slider controls, the
Callout, the code chip, and the ch05 contrast panel behind a cut-out.

**A card is not a box by default:** no border, no ground, no radius on the card, and no shadow.

**Amendment (owner, 7 Oct 2026; edge removed 9 Oct) — the boxed variant.** A set whose items must read
as separate targets — an icon router of four to six destinations — may box every card:
`BlockCardSet frame="box"` (BlockCard `frame="box"`) and ListCard `form="tile" frame="box"`.
- No edge on any side (9 Oct). 24 (`block`) inside on every side, which is where the hover ground sits.
- A linked box paints a quiet ground at the 8 radius under the pointer (paper → paper-deep, tint →
  neutral-100, ink → neutral-900, blue → brandeis-600); nothing paints at rest.
- Boxed cards in a set sit a `gutter` (32) apart both ways.
- The set runs under its head at full width, never beside a head or a photograph (9 Oct rulings 3–4).
- It is a set's decision, never one card's, and the default stays unboxed. Applied to every icon router
  (ServicePage `Router`, the kit's C-icon routers). Not for unlinked icon sets, image sets or text sets.
- This partially reverses the "no box on any card" rule of § 3.1 and § 8.5; the rest of § 3 stands.

**Named exception (owner, 7 Oct review, 8 Oct ruling) — the logo cell.** A client mark in the H band sits
in a hairline cell of its own (`LogoGrid`, the Enorm reference), so marks of different kinds read as
equals. A logo cell is not a card, so this is an exception to the rule above rather than a third card
form: every cell a whole box, the outer edge drawn (`edges="closed"`, the default since the 9 Oct
review), or rules between cells only (`edges="open"`, the alternative); no ground, radius or shadow;
the column count follows the mark count so every row is full, two across on a phone with a lone last
mark spanning the row. Each mark is sized to equal area of ink by its measured density. The section
heading is demoted to an eyebrow-size context line, which a RatingBadge may lead; beside the grid, a
short heading at the h4 role, centred on it.

**Whole-card links carry no arrow (owner, 7 Oct 2026, superseding the 6 Oct arrow cue).** The blue
arrow after the title's last word stood on nearly every card and read as bulky; the whole card is the
link.
- On hover and focus the **title** takes the accent ink (§ 4.2), the image zooms (approved 29 Sep), and
  the keyboard ring runs round the card. ListCard's linked rows and tiles answer the same way: no end
  arrow, no row hover ground.
- **Where a card needs a visible action,** it gets a link button at its foot — Button `emphasis="link"`
  with its arrow, the arrow-carrying control: BlockCard `cue="cta"` / `ctaLabel`, ListCard `ctaLabel`.
  Opt-in, only where the action is not obvious from the title.
- An external ListCard keeps a small (16) up-right glyph after its title and the hidden "(opens in a new
  tab)": it says "leaves the site", which the hover cannot.

### 3.2 Asymmetry, and how copy aligns against an image

| Split | Columns at lg | Gap | Use |
|---|---|---|---|
| Hero | [1, 1] | `section` | copy, then illustration or photograph |
| Head beside body | [1, 2] | `section` | read-down bodies, icon grids, pair cards (the H-row, a text-only head split, is retired: 7 Oct ruling 2) |
| Media split | [5, 7] or [7, 5] | `section` | a photograph beside copy, a form beside a photo, a featured testimonial, the offer, the close |
| Peer halves | [1, 1] | `column` | the N contrast pair, two lists |

**Alignment against an image (B, I-beside, K, L-photo, G-featured):**
1. **When the copy column ends in an action** (CtaRow, actions or a form):
   - the copy column stretches to the image's height;
   - the head's top edge sits on the image's top edge;
   - the last element is pinned to the image's bottom edge (`pinLast`).

   Two shared edges is what makes a split look finished.

   **Only when blocks sit between the head and the action** (tiles, points, a quote). A copy column
   that is a head and an action and nothing else is centred on the image, as in rule 2: stretched,
   it left 350 to 400 of empty column between the lead and the action at 1440 (`fdn-section-head`
   fix round, 6 Oct; ContentSection `media`). B always carries tiles (§ 3.4), so this is the degrade
   path, not a page shape. Head actions are never pinned: they sit a `stack` under the lead, and only
   blocks followed by a footer stretch the column.

   **Open for the owner (6 Oct, second fix round):** pinned, B with 2 tiles and a CtaRow leaves ~180
   of empty column between the tiles and the CtaRow's rule at 1440. ContentSection's `media.pin: false`
   centres that column instead; `/design/content-section` § 14 renders the two side by side, and
   `cmp-media-split` builds on the owner's choice (ContentSection spec, open question 7).
2. **When it does not end in an action** (a quote, rows only), the copy shares the image's top edge
   (`align="start"`). It was centred until 4 Nov 2026; the active ruling "pairs top-align"
   (decisions/2026-10-11-secondary-anchored-to-primary) governs, and a centred head floated mid-photo.
3. **An illustration has no box,** so it is always centred on the copy (the hero).
4. Consecutive media bands on a page alternate side.

### 3.3 One large thing per band, with five declared exceptions

Every band has exactly one large object. Everything else in it is small: 12 to 16px labels and body.

| The large thing | Bands |
|---|---|
| `--text-display` title + illustration or photograph (a pair, by ruling H2) | A |
| A photograph ≥ 380 wide | B, I, K, L-photo, C-icon (head aside), D (head aside), F (head aside) |
| A set of card images | C-image, C-pair, M |
| A diagram | E |
| `--text-quote-lg`, a portrait at 477, or a case card | G |
| `--text-stat-lg` numerals | S, D (the stat aside) |
| `--text-score`, one numeral that is the band (105 serif) | G rating-led (the score; cmp-testimonials, 6 Oct — at stat-lg 54 it did not outrank the 34 quote) |

**Declared exceptions.** These bands have no image, are bounded on both sides by image bands (§ 5.1),
and are capped per page:

| Exception | What carries it | Cap |
|---|---|---|
| **J** statement | `--text-h1` | ≤ 1 per page |
| **H** logos | the marks, as a set | ≤ 1 |
| **D-faq** | nothing; centred head over the accordion | ≤ 1, always followed by an image band and then the close |
| **N** contrast (Fit) | the check and close glyphs at `xl` | ≤ 1 |
| **L** close | the form (its texture is air, not an object) | 1, always last |

Binding rules:
- **C-icon stacks its head over the cards and carries no photograph** (owner, 9 Oct 2026, superseding
  "always carries a photograph in its head track"). A section CTA on an icon set is a CtaRow under the
  grid (C-icon-4 only) or per-card links.
- **D always has an aside:** a photograph or one `--text-stat-lg` figure.
- **F always has a photograph aside** (withdrawn by the 7 Oct image pass: F takes none). The worked-example Callout goes above the rows in the body track
  (§ 3.6).
- **Two large things is a failure.** A photo beside numerals, or a photo beside a statement title, has
  two.
- **Section h2 (43) and card titles step at least two rungs apart:** h4 (28) for 2 to 3 cards, and h5
  (22) for 4 to 6 (§ 7.2).

### 3.4 Band archetypes, so it never reads "table, table, table"

Every band on a kit page is one of these. Rules for the sequence:
- **Two adjacent bands never share an archetype.** B may follow B only if the media side flips.
- **No page has more than two D bands**, counting D-faq.

| | Archetype | Arrangement | Head | Large thing | Family |
|---|---|---|---|---|---|
| A | Hero | trail + [1, 1] split, or stacked (no media) | the hero | illustration / photo | `fdn-top`, `cmp-hero` |
| B | Media split | [5, 7] / [7, 5]: H-full + ≤ 4 tiles, or ≤ 2 tiles + a CtaRow, beside a 4:5 photo | left | photograph | `cmp-media-split` |
| C | Feature | **image:** 3 or 4 cards across, or a Slider at 5+. **text:** 3 or 6 text cards. **icon:** beside head + photo aside + 4 or 6 icon cards. **pair:** beside head + actions + 2 image cards | centred (image, text), left (stacked head; the H-row is retired, the 7 Oct rulings), beside (icon, pair) | card images, or the head photo | `cmp-feature` |
| D | Read-down | beside head with an aside + ruled rows (1 or 2 columns) | beside | aside photo or stat | `cmp-readdown` |
| D-faq | FAQ | centred head over a centred accordion at `--measure-body` | centred | exception | `cmp-readdown` |
| E | Diagram | H-compact + a full-column diagram ≤ 380 tall | left | the diagram | `cmp-service-pages` (diagrams stay template-local) |
| F | Process | beside head + photo aside + ≤ 5 numbered read-down rows (the approved Steps) | beside | head photo | `cmp-process-stats` |
| G | Proof | typographic; **G-case** (case card + compact quote, the work first); featured with portrait; group of 2 to 3; slider; rating-led | centred (typographic, group, rating), left (case, featured) | quote-lg, portrait or case card | `cmp-testimonials` |
| H | Logos | a centred strip; a grid beside a head; marks beside a real quote | centred | exception | `cmp-logos` |
| I | Banner | stacked head over a 3:1 photo (7 Oct 2026), or a 3:2 photo beside copy; `tight` | left | photograph | `cmp-banner` |
| J | Statement | one column: eyebrow directly above the h1- or display-role sentence, start or centred (7 Oct 2026; the [1, 2] split is retired); `open` | left or centred | exception | `cmp-banner` |
| K | Offer | [7, 5]: head + 3 points + actions, beside a 4:5 photo; or beside head + points (no photo) | left | photograph | `cmp-cta` |
| L | Close | [10, 7] from 1280 ([1, 1] from 1024): copy + points beside the full EnquiryForm on paper, top-aligned, the `closing` equaliser under the copy (amended 6 Oct 2026, cmp-cta: the full form holds its own 470, so the 7 is sized to it); or [5, 7], a photo beside a compact form | left | exception (or the photo) | `cmp-cta`, `cmp-form` |
| M | Resources | head + 3 cover cards, whole-card links | centred (on a service page: a stacked start head over a full-width card row — the H-row it took in page-product-design fix round 2 is retired, the 7 Oct rulings) | covers | `cmp-feature` |
| N | Contrast (Fit) | H-title + two lists in peer halves, check and close glyphs | left | exception | `cmp-readdown` |
| S | Stats | H-compact + one row of 3 or 4 stats | centred | numerals | `cmp-process-stats` |
| — | Announcement strip | `Section density="strip"` on tint: body-sm + one blue link; showcase only | — | — | `cmp-banner` |

**E draws on the template-local diagrams in `ServicePage/Diagrams.tsx`:** Spectrum, Matrix, Record,
Parts, Slice and Bridge, whichever the page's fixture already names. They stay template-local, because
each one is a service-page argument and not a reusable unit. Thread is promoted (`cmp-process-stats`).

**Statement J is never an `<h1>`.** The page's only `<h1>` is the hero's. `Statement` renders
`as="h2"` (the default) or `as="p"`, carrying the h1 *role* class (`--text-h1`). The element marks the
outline and the role sets the scale, which is the Heading-size argument in CLAUDE.md.

**The announcement strip gets its padding from Section.** `cmp-banner` adds `density="strip"` to
`Section`: `--sec-padding-y-strip: var(--gap-block)` (24) in `section.css`, beside the tight and open
paddings. No padding sits on the Section through `className` (rule 5). No inner element carries a
`padding-block` beside `flush`; that is the shorthand collision `Breadcrumbs.module.css` documents.

### 3.5 Head alignment is a variation axis

ContentSection gains `align="start" | "center"` (`fdn-section-head`). A centred head:
- sets eyebrow, h2 and lead centred;
- uses `--measure-title` for the h2 and `--measure-lead` for the lead;
- centres the body below it as a block, while text inside cards stays start-aligned;
- is always stacked, is never beside, and never carries actions in its column.

Rules:
- **Centred:** C-image (H-compact and H-title forms), C-text, D-faq, G (typographic, group,
  rating-led), H, M, S.
- **Left-weighted:** everything else.
- **Per page:** 3 to 5 centred heads, never two in adjacent bands.

### 3.6 Approved compositions this kit keeps (owner, 1 Oct)

These were approved, so the kit keeps them as they are:

| Composition | The ruling | Kept as |
|---|---|---|
| **Fit**: two contrasting lists with check/close glyphs, in the text's ink | 1 Oct; ch04 fixed glyphs | **N contrast**. Promoted to the `Contrast` pattern by `cmp-readdown`, unchanged in look. Swapped into the template by `cmp-service-pages`. |
| **ProofBlock with a case**: the work first, then what the client said | 1 Oct: "the work first, then what the client said" | **G-case** in `cmp-testimonials`: case card in the 381 track carrying the band's image, compact quote in 763, RatingBadge a `block` below the attribution (1 Oct). |
| **Steps** as read-down numbered rows | 1 Oct: five 220px columns "broke every title onto two lines and read as five options" | **F process.** Numbered ListCard rows read top to bottom, the example Callout above them. **No across-the-row step grid exists in the kit.** ProcessFlow keeps its own approved lane form for flows, and is not used for a method. |

### 3.7 Phones (390)

The fold rule is for the MacBook Air, but 390 has its own rules, because a 2300px phone band is the
wall of text again.

**Gaps do not shrink when a row stacks (owner, 7 Oct 2026).** A set whose items sit a `column`
(64) apart keeps 64 when it stacks on a phone: Proof's quote group and BlockCardSet's spotlight
were reviewed at 390 and the separation reads clearly. Only Section's own padding steps down
below 768 (CLAUDE.md, gap-scale rule 3).

1. **Every band is ≤ 1700 at 390** (two 844 viewports). `fold:check` measures 390 too.
2. **A linked card set of more than 3 items scrolls sideways below 768** (Layout `scroll="until-md"`,
   § 11 `fdn-scroll`): one card per view, with the next card peeking.
   - This is allowed only where every card is focusable, so Tab moves the row.
   - Unlinked sets, and icon sets of up to 6, stay stacked.
3. **Rows.** The budget holds a D band to about 1350 at 390. A read-down body that cannot meet it is an
   Accordion at every width.
4. **Media.**
   - B and K photos take 4:3 below 1024. They sit above the copy in B and below it in K.
   - The hero illustration and the hero photo go below the actions.
   - Head-track asides sit between the head and the body.
5. **Texture.** Only `horizon` runs below 1024 (§ 6).
6. **Cadence and shape hold at 390 too.** At 390, the reader must still meet an image at least every
   second band, and the bands must not collapse into one repeated head-plus-rows shape. Full-page shots
   at 390 are part of the `cmp-service-pages` and `cmp-showcase` acceptance (§ 8.5).

---

### 3.8 Labels: a bulleted list or a Tag (owner, 7 Oct 2026)

The kit has two label shapes, and the choice follows what the label is attached to.

| Shape | What it is | Use it when | Never |
|---|---|---|---|
| **Bulleted label** (PageHero's tag list: blue square, mono label, no box) | facets that describe the page or band you are ON | a run of 3–6 attributes of the subject itself: what a service covers, a hero's facts | on a card; interactive; a single label alone |
| **`Tag` `mark`** (badge: quiet ground, no edge) | files ONE object in a set under a taxonomy | a card's, article's or case study's category, one or two per item, attached to the item | as a list describing the page; clickable |
| **`Tag` `filter`** (chip: edge, no ground) | a query the reader can apply | an index page's filter row | as decoration or a category label |

The test, in order: can the reader act on it → `filter`. Does it label one item among several →
`mark`. Does it describe the thing the reader is on → bulleted. The blue square survives only on
the bulleted label: it is a bullet, not an eyebrow mark (eyebrows carry no mark, owner 7 Oct 2026).

### 3.9 Numerals: accent or neutral (owner, 7 Oct 2026)

A numeral is blue when the numbered points ARE the band's information — a process, a numbered
ledger, a set whose order is the argument. It is neutral when the numbers are auxiliary to
something else: a form's field numbers (`--enq-index-ink`), an offer's points beside the ask
(`--cta-number-ink`), a ListCard set with `tone: 'neutral'` whose band carries its accent elsewhere.

## 4 · Blue: the recurring foreground accent

### 4.1 The rule (owner, 6 Oct 2026, binding)

> "I want more blue in icons, links, and other places so it doesn't read black and white. The
> reservation is only for being in the background. No surface is ever blue."

**Blue is the recurring FOREGROUND accent.** It recurs in every band, in the same roles on every page,
so nothing reads black and white. "Wisely" means **coherently, not sparsely**: a role that is blue is
blue everywhere it appears, and a role that is ink is ink everywhere. **Blue is never a ground.**

This replaces the 5 Oct budget (a Free row plus Accent / Signal / Field tiers, "icons are ink", "card
arrows at rest are ink"). `fdn-colour` (85c0dea, 6d4e6ed) applied that budget and moved icon, marker,
numeral, arrow and per-card-link tokens to ink at rest; `fdn-blue` moved every one of them back and
added blue where the accent belongs. The record is in `docs/kit/brand-amendments.md`.

### 4.2 Blue at rest, by role

| Role | Where | Tokens (paper and tint → ink) |
|---|---|---|
| **Text links**, blue at rest | inline and Prose links; every link-style action — the per-card cta, a Proof's source link, a CtaRow link row — and the ghost partner beside a solid (hero, close, "See available times"; § 4.5) | `--btn-link-primary-fg`, `--btn-ghost-primary-fg`, `--prose-link-ink`: brandeis-500 → 300 (200 on a control) |
| **Icons** | content icons: ListCard markers, the service page's sheet, frame and loop glyphs, a check in a needs-list or a comparison, the RatingBadge star | `--lcrd-marker-ink`, `--svc-mark`, `--rbadge-star-fg`: 500 → 300 |
| **Markers and numerals** | list and step markers, index numerals, a CtaSection's points, an `<ol>` numeral in Prose | `--lcrd-number-ink`, `--flow-number-ink`, `--cta-marker-ink`, `--prose-marker-ink`: 500 → 300 |
| **Arrows and cues** | ProcessFlow and Thread connectors, an accordion chevron, ListCard's external glyph (card title arrows removed, owner 7 Oct 2026) | `--lcrd-link-ink`, `--flow-arrow-ink`, `--svc-mark`, `--acc-mark-ink`: 500 → 300 |
| **Small graphic marks** | a Proof's quote rule, a diagram's blue line, the tile's opening rule on hover | `--proof-quote-rule`, … |
| **Active and current states** | the nav and TOC current marker, the current breadcrumb, the slider thumb, focus rings, link hover and pressed, input focus, the whole-card hover | `--crumb-current-ink`, `--sld-progress-thumb`, rings |
| **Slider controls** | previous / next, glyph and hairline rule | Button `emphasis="outline"`, `--btn-outline-primary-*` |
| **Stat accents** | a Proof stat's numeral | `--proof-value-ink`: 500 → 300 |
| **The ask** | the page's one main action — the hero's and the close's solid, and EnquiryForm's submit (§ 4.5, 8 Oct 2026). There is no ink solid | `--btn-solid-primary-bg` |

**Contrast, on every surface:** text links ≥ 4.5:1; icons and marks ≥ 3:1. brandeis-500 is 6.17:1 on
paper and 5.51:1 on tint. On ink it is 2.77:1, so the accent lifts to **brandeis-300 (7.32:1)**, or 200
on a control. On a blue ground (none on pages; the token layer still declares one) the accent is white
or brandeis-100.

### 4.3 What stays ink, and the one thing blue never is

- **The words stay ink:** headings, eyebrows, card titles at rest, body text, Tag chips at rest. Blue
  marks around them. Ink words are what keep blue reading as an accent rather than a theme.
- **A cross stays quiet ink** beside a blue check: it only says "not this one".
- **Hairline separators on paper and tint are neutral.** A blue rule is a mark (the quote rule, the
  tile's hover rule), never a divider.
- **Chrome is exempt and unchanged.** SiteNav and SiteFooter keep their approved colours (nav direction
  B), including the rail arrows.
- **No ground is blue: no band, no card fill, no panel.** There are no blue bands until the owner names
  a purpose for one. Three live routes outside this kit carry one (`insights`,
  `future-interfaces-lab/join`, `matter-design-system`); they are left untouched (§ 10, item 4).
- **Blue masses are not the accent and are counted.** The solid primary button, an illustration's
  field and a Texture placement are areas, not marks. A band carries **at most one solid primary** and
  **at most two of solid primary, illustration and Texture** (the band rule); at most two
  illustrations per page. The foreground accent in § 4.2 is never counted. ch02's 5%-by-area ceiling
  applies to the masses.

| Band | Blue masses | Therefore |
|---|---|---|
| A, service hero | solid + illustration | no texture |
| A, photo or no-media hero | solid + Texture | — |
| B with `counterweight` | Texture | no solid button |
| E with `horizon` | Texture | — |
| J with `head-half` | Texture | the h1 is ink |
| K offer | solid | no texture (the photo fills the band) |
| L close | solid (submit) + Texture (`closing`) | — |

### 4.4 Peridot

Peridot has exactly two uses on the website:
- `::selection`: peridot-500 under neutral-950, already in `globals.css`;
- the carried item inside an illustration (ch05 § 4b).

**The website does not highlight text.** "The band behind a marked phrase" is a social-media device
(ch10).

`fdn-colour` removes the leftovers:
- `--prose-mark-bg` and `--prose-mark-ink` (peridot-300): `<mark>` renders as plain inherited text;
- `--prose-quote-rule` on blue (peridot-400) becomes white, matching `proof.css`;
- `--sec-highlight` and `--sec-highlight-ink`: unused, so deleted;
- the peridot reference in `logo.css` is inventoried; if it paints anything, it goes.

**The gate,** added to `tokens:check`: no component layer and no `*.module.css` consumes
`var(--color-peridot-*)`.
- The one exception is the `::selection` rule in `globals.css`.
- The ramp's declarations in `primitives.css` stay.
- Comments that mention peridot are not consumption.
- Illustration SVGs are exempt.

The typography specimen's `<mark>` example is deleted.

---

### 4.5 Actions: three kinds, pairing and arrows (owner, 7 Oct 2026 as corrected 8 Oct, binding)

r7-buttons (8 Oct 2026, `docs/kit/review-7-oct.md`) reverses `fix/tone`'s "converts blue, else ink".
There is no ink solid. **Kind follows WHERE the action sits, not what it does:**

| Kind | Where | Examples |
|---|---|---|
| **Blue solid** | the page's ONE main action — the hero's and/or the bottom close's ask; EnquiryForm's submit | Start a project · Book a call · Send enquiry |
| **Blue ghost** | the solid's partner, beside it, in the hero and the close — nowhere else in content | See the work → · How we work → · See available times → |
| **Link button** | every other action, which navigates: a band's foot (CtaRow), a mid-page offer (CtaSection `offer`), a card's foot, a line of text | Start with a UX Product Audit → · All case studies → · See the sprint → |

- The same "Start a project" is the solid in the hero and a link at a band's foot.
- Neutral ghost and link buttons remain in Button for site chrome only (SiteNav, SiteFooter, a filter
  set, a utility glyph). Content never uses them, and there is no neutral solid at all.

**Encoded, not chosen.** Nothing classifies an action: `converts` is gone from PageHero, CtaSection and
CtaRow, and `src/lib/conversion.ts` is deleted (`docs/strapi-changes.md` § 17, withdrawn). Button types a
solid primary-only. CtaRow takes exactly one action and renders the link. CtaSection's `offer` takes one
action (or a form) and renders the link; its `open` close and PageHero take one or two and render the
solid, then its ghost.

**Pairing and arrows:**

1. **The solid carries no arrow, ever.** The label carries the ask. One solid per page — the hero's and
   the close's are the same ask, repeated.
2. **A solid's partner is a ghost button**, not a link button. The ghost takes the trailing arrow when
   it navigates. A ghost has no outline at rest and so looks like a link button until hovered; that is
   intended (owner, 7 Oct 2026) — the interaction tells them apart.
3. **Every other action is a link button** with the arrow. It is never the secondary beside a solid.
4. **Never two buttons of the same emphasis side by side.** A group is at most one solid + one ghost,
   and only in the hero and the close. An in-band action is one link. A stack of links, one per line, is
   a list rather than a group.
5. **Everywhere.** Banner actions, Statement's action, CtaSection, ContentSection actions and footers,
   PageHero, CtaRow, EnquiryForm, and every page and specimen composition.

The table and the list of what is deliberately not covered are in `docs/specs/Button.md` § 14a.

## 5 · Image-to-text balance

### 5.1 Rules for the page

1. **No two consecutive bands both without an image.** An image is a photograph, an illustration, a
   diagram or card images. Logos, numerals, a statement, texture, icons, Tags and a form are not images.
2. **At least 60% of the bands between the hero and the close carry an image.**
3. **Every service page carries:**
   - the hero illustration;
   - **≥ 4 photographs outside card sets** (B, I, K and the head-track asides);
   - **≥ 1 studio photograph** at any placement its resolution allows (§ 5.4);
   - ≥ 1 diagram;
   - one G band, one H band and one I banner.
4. **No photograph appears twice on one page.** Across the six service pages, a *stock* photograph in a
   B, I, K or aside slot appears on one page only. Studio photographs may recur across sibling pages:
   only three resolve outside cards, and their recurrence is continuity. Card images may repeat across
   pages.
5. **One photograph per band**, except card sets.
6. **No type on any image, ever.** Type goes beside or below. No overlays, scrims, duotones or tints
   (ch05 § 5).

### 5.2 Which kind of image: the defaults

Read the rows top-down. The first match is the **default**. **Any card may carry an image of any kind**
(owner ruling); a default is overridden only to serve a better image, never to drop imagery. The
"Never" column holds only the hard rules.

| If the band or card is about… | Default | Never (hard rule) |
|---|---|---|
| the client's product, or our shipped work for it | capture or cut-out (ch05 § 2, § 2a) | a stock screen presented as the client's product |
| a result, a count, a time saved | stat-lg numerals | a photo of people "celebrating" |
| how a system, model or flow works | a diagram, or an illustration if it is the page's argument | |
| the page's whole argument (service hero) | a bespoke isometric illustration (ch05 § 4) | |
| people working, collaborating, a workshop, how we engage | a photograph: studio first, then stock | |
| who said it (fictional, showcase only) | a stock portrait, 1:1 | an avatar initial |
| who said it (a real client) | no portrait unless the client supplies one; a typographic quote | a stock face beside a real name (§ 5.8) |
| a set of ≥ 4 parallel options | a Solar Bold icon in blue (§ 4.2), with a photo in the head track; image cards are equally allowed | |
| 2 to 3 options with their own pages | card images: a photograph or an illustration; icons are equally allowed | |
| a case study, article or resource | its cover; until covers exist, a stand-in (§ 5.7) | an empty frame |
| an ask (offer, form) | one quiet photograph (`saturation: quiet`) | a busy scene with faces cut at the edge |
| air or rhythm with no content | Texture (§ 6) | a photograph as decoration |

### 5.3 Frame and radius, by placement

The default is that **photographs carry no frame and captures carry the hairline.** One exception is
locked: every card image carries the card's hairline (owner, 29 Sep, ch05 amendment 5a). The 29 Sep 8px
radius on card images is extended to every photograph, so a page never shows rounded card photos beside
a square 4:5 photo.

| Placement | Kind | Frame | Radius | Token (owner) |
|---|---|---|---|---|
| Card image (BlockCard, any set, G-case, M) | any kind | hairline, the crop box's | 8 | `--bcrd-media-rule-*`, `--bcrd-media-radius` (unchanged) |
| B, K, L-photo, I banner, head-track aside, hero photograph | photograph | **none** | 8 | `--media-photo-radius: var(--radius-8)` (new, `fdn-media`) |
| Hero, Figure, any full-column placement | capture | hairline | 0 | `--media-capture-rule-*`, `--media-radius` (unchanged) |
| Any placement | cut-out | none; panel per § 2a when contrast asks | 0 | unchanged |
| Any placement | illustration | **never boxed**: no frame, no radius, no panel | — | unchanged |
| Featured testimonial portrait (477 or 280) | photograph 1:1 | none | 8 | `--proof-portrait-radius` (`cmp-testimonials`) |
| Compact proof portrait (64) | photograph 1:1 | none | 4 | `--proof-portrait-radius-compact` |
| ListCard thumbnail (160 × 107) | any | none | 8 | `--lcrd-thumbnail-radius` (`fdn-media`) |
| SiteNav rail card | any | unchanged | 4 | unchanged |
| Client marks | logo | **none**, no tile | — | — |

The radius belongs to the image box, never to a card (§ 3.1). Media takes `kind="photograph"` and
applies `--media-photo-radius`. A placement that rules its own crop box (`edge="placement"`) keeps
drawing its own frame and radius.

### 5.4 Resolution: a placement takes a photo only when the crop is ≥ 2×

**Rule:** the cropped source (the largest region of the master at the placement's ratio) must be at
least **1.9 × the rendered box** on both axes. The 5% tolerance admits exactly one photograph,
`studio-sticky-board-ux` at 1.93×, and nothing below it. `fold:check` enforces it: Media emits
`data-src-w`, `data-src-h` from the registry, and the gate compares the crop against the rendered box.

| Placement | Renders at 1470 | Crop needs | Qualifies |
|---|---|---|---|
| B, K, L-photo, 4:5 | 477 × 596 | 906 × 1133 | all stock scenes; `studio-sticky-board-ux` (922 × 1152, 1.93×). **No other studio photo.** |
| Hero photograph, 5:4 | 572 × 458 | 1087 × 870 | all stock scenes. No studio photo. |
| Banner below, **3:1** | 1240 × 413 | 2356 × 785 | 2400-wide stock landscapes, and the Holi photo (About and Careers only) |
| Banner beside, 3:2 | 667 × 445 | 1267 × 846 | 2400-wide stock landscapes |
| Head-track aside, 3:2 | 381 × 254 | 724 × 483 | all stock; `studio-whiteboard-crit` (2.36×), `studio-session-talk` (2.48×), `studio-sticky-board-ux` |
| Card, 3 across, 16:9 | 392 × 221 | 745 × 420 | all stock; those three studio photos. **Not the 622px studio squares** (1.59×). |
| Card, 4 across, 16:9 | 286 × 161 | 543 × 306 | everything, **including the 622px studio squares** (2.17×) |
| Card pair, 3:2 | 365 × 243 | 694 × 462 | all stock; the three larger studio photos |
| Horizontal card, 4:3 | ≤ 604 × 453 | 1148 × 861 | 2400 landscapes; 1200 portraits (1200 × 900) |
| ListCard thumbnail, 3:2 | 160 × 107 | 304 × 203 | everything |
| Featured portrait, 1:1 | 477 | 906 | the five stock 1200 squares |
| Compact portrait, 1:1 | 64 | 122 | the stock squares. The studio headshots are pre-cut circles, and ch05 § 6 bans masking, so they are not used. |

**In practice:**
- The four 622px studio squares (`studio-desk-pairing`, `studio-pair-at-monitor`,
  `studio-workshop-presenting`, `studio-offsite-talk`) go only in 4-across card sets and ListCard
  thumbnails.
- `studio-whiteboard-crit` and `studio-session-talk` go only in asides, cards and stand-in covers.
- `studio-sticky-board-ux` is the one studio photo for a 4:5 slot.

`fdn-media` derives 1240, 652 and 320 widths for each master, plus the master itself, so the browser
fetches the 2× candidate.

### 5.5 Tone: one temperature family per page, at most one vivid photo

Grading, duotone and tint are banned (amended 7 Oct: one site-wide tone layer, § 5.5a), so **selection is the first lever.** Meridian and Executra get their
finish from a photo set shot in one light. The rule makes our selection decidable.

**Every catalogue entry is tagged by measurement**, not by eye. `npm run photos:tone` (`fdn-media`)
downsamples each file to 64px and writes two fields into `catalogue.json`:
- **`temperature`**, from the mean red minus the mean blue (0 to 1 scale):
  - `warm` at ≥ 0.10;
  - `cool` below 0.02;
  - `neutral` between.
- **`saturation`**, from the mean HSV saturation: `vivid` at ≥ 0.40, `quiet` below.

**Rules:**
1. **A page is a warm-family page (warm + neutral) or a cool-family page (cool + neutral).** It never
   carries both a warm and a cool photograph. This counts every photograph on the page: cards, asides,
   portraits and stand-ins.
2. **At most one `vivid` photograph per page.**
3. The `cta-media` and `form-media` slots (K, L-photo) take `quiet` only.

The gate reads `data-photo-temp` and `data-photo-sat` from Media and fails a page that breaks these
rules.

**The measured result**, run 5 Oct; `fdn-media` re-runs it and commits the fields:

| Tag | Photographs |
|---|---|
| **warm** | sticky-notes-wall-dense (vivid), studio-offsite-talk (vivid), sticky-grid-minimal, hand-mouse-detail, workshop-sticky-sort (vivid), sticky-notes-mass (vivid), studio-workshop-presenting, studio-sticky-board-ux, sticky-wall-soft-focus, studio-team-holi, moodboard-wall-desk, portrait-man-blue-office |
| **cool** | conversation-chalkboard, screen-over-shoulder, hands-sticky-blue-pen, desk-flatlay-devices, desk-minimal-white, pair-testing-overhead, wall-sketching-portrait, pair-desk-through-plants, pencil-wireframe-violet, portrait-man-glasses, portrait-woman-laughing, and the three studio headshots (unused) |
| **neutral** | everything else, with `desk-sketch-flatlay` and `portrait-man-green` measuring vivid |

### 5.5a The tone layer (owner, 7 Oct 2026; amends § 5.5's "grading is banned")

IRL photographs carry one consistent tone layer, so a page's photographs read as one shoot. The
treatment is **TBD**, so what ships is the hook, not a filter: every `kind: 'photograph'` Media renders
takes `filter: var(--media-photo-grade)` (studio and stock alike, every placement and edge), and the
token is `none` in `tokens/components/media.css`. It renders nothing. When the owner rules, the value
lands in that one token and grades every photograph at once; no prop or placement can opt out, which
is what makes it consistent. Selection by measured tone (§ 5.5) still applies underneath: a grade
unifies a set, it does not rescue a mixed one. Captures, cut-outs and illustrations never take it.

### 5.6 Photo assignment for the six service pages

Every pick meets § 5.4 (resolution), § 5.5 (tone) and § 5.1 (uniqueness). `cmp-service-pages` may swap
any photo for a better catalogue match, as long as the gate still passes.

| Page (family) | B 4:5 | I 3:1 | K 4:5 | Aside 1 (C-icon) | Aside 2 (F or D) | Studio |
|---|---|---|---|---|---|---|
| product-design (warm) | `hands-trackpad` (fix round 2: the sticky wall was the page's one off-key, saturated frame) | — (no banner; fix round 1, 7 Oct) | `designer-tablet-monitor` (3:2, landscape offer) | `studio-whiteboard-crit` | — (image pass, 7 Oct: F takes none) | aside 1 |
| software-development (warm) | `designer-desk-monitor` | `workshop-hands-writing` | `whiteboard-pair-laptop` | — (image pass, 7 Oct: router between image bands) | — (image pass, 7 Oct: F takes none) | — |
| design-engineering (warm) | `hands-sketches-markers` (fix round 2, 6 Oct: a portrait source that holds 4:5) | `pair-at-laptop-sticky-wall` | `desk-sketch-flatlay` (3:2, landscape offer) | `studio-whiteboard-crit` | — (image pass, 7 Oct: F takes none) | aside 1 |
| design-systems (cool) | `swatch-book-pages` (fix round 2, 6 Oct: the system's own artefacts, not screens) | — (no banner) | `swatch-ring-white` (3:2, landscape offer) | `white-bricks-pile` (the four-route router's media split) | — (no F or D band) | `studio-whiteboard-crit` as a stand-in cover |
| ai-product-ux (cool) | `pair-testing-overhead` | `workshop-whiteboard-lounge` (no banner on the page yet) | `pair-laptop-notebook` (3:2, landscape offer; fix round 2, replacing the staged chalkboard pair) | `hands-sticky-blue-pen` (not shown: the stat band takes the slot and shows its figure) | `studio-whiteboard-crit` (the numbered record's aside; fix round 2, replacing the pink-cast pencil crop) | aside 2 |
| product-modernisation (cool) | `wall-sketching-portrait` | — (no banner) | `pair-at-laptop-sticky-wall` (3:2, landscape offer; fix round 1: the violet pencil read as a stock filter; fix round 2: the empty `office-calm-interior` showed no people and no work) | — (image pass, 7 Oct: router under K's photo) | — (image pass, 7 Oct: F takes none) | `studio-whiteboard-crit` as a stand-in cover |

- **No large slot uses a vivid photo.** Each page may spend its one vivid photo in a card set, for
  example `workshop-sticky-sort` on a discovery card. Keep it away from blue-accented blocks.
- **Card images and stand-in covers** come from the rest of the catalogue in the page's family, at the
  resolution § 5.4 allows.
- **The close (L) carries no photograph** on service pages. The close is copy, form and texture.
- `pair-at-laptop-sticky-wall` is NOT reserved for the home hero any more (corrected 7 Oct 2026 against
  `SERVICE_PHOTO_SLOTS` in `src/lib/photos.ts` and the kit routes). It is product-modernisation's K offer
  photo and design-engineering's I banner, and the kit's home hero (`design/kit/home`) and the
  photograph hero variant (`design/kit/hero`) also use it, as do the testimonials, service-list, media-split,
  CTA, feature and block-card specimens. It is a stock photograph (`photo-catalogue.ts`), so its use on
  two service pages' B/I/K slots breaks rule 4 of § 5.1 (a stock photograph appears on one service page
  only). Open: one of the two slots needs another catalogue pick. The table rows above follow `photos.ts`, which is the source of truth.

### 5.7 Case-study and resource covers: stand-ins are permitted

Real covers are parked. Under the owner's "beauty over transparency" ruling for internal review, a card
with no cover takes a stand-in: **a catalogue photograph with no legible screen**, in the page's tone
family. Studio photographs make the best stand-ins, because they show our own work.
- A stand-in carries `standIn: true` in the view model. **It is not labelled on the page**, and it is
  replaced when the real cover exists.
- **An empty hairline frame is a bug.** `fdn-media` fixes it in BlockCard and in ServicePage `Cases` and
  `Resources`: no image means no media slot, never an empty one.

### 5.8 People, quotes, marks and numerals

- **Service-page G bands use the real fixture quotes with no portrait.** A stock face beside a real name
  is a fabricated likeness. The real Clutch RatingBadge may sit with a real quote.
- **Showcase pages use fictional people and fictional companies** with stock portraits, and never set
  them beside a real client mark or the real Clutch rating.
- **A real client mark sits only beside real words or real numerals:** a real approved quote, the real
  rating, or a figure sourced from a record (`fixtures/ratings.ts`, a published case-study number).
- **Illustrative numerals never share a band with real marks.** On showcase pages, the S stats band and
  the H logo band are separate bands, and the stats are illustrative. `cmp-logos`' stats-over-strip
  variant uses only sourced figures (the ratings fixture), or it is not built.
- Stock photographs need no credit or label (owner, 5 Oct: internal review).
- **Proof is a set, not a ranking** (owner, 7 Oct 2026). The four proof items are client logos, case
  studies, testimonials and the platform rating (Clutch). A page draws whichever it has, in the order
  its argument needs; none is numbered, labelled "top" or "best", or scaled up as the headline proof
  over the others, and none is required before another. Weight within a band still follows § 3.3
  (one large thing); that is composition, not rank.
- **Never combine proof types in one section** (owner, 9 Oct 2026). Client logos, testimonials, the
  aggregate rating and the studio's record (years, projects, team) are each their own kind of proof
  and each gets its own band; a facts band need not show every figure every time.

### 5.9 Client logos

- One colour per set (ch05 § 10), sized to equal area, with no boxes or tiles.
- A strip is a Cluster with `colGap="stack"` and `rowGap="stack"`.
- A grid is a Layout with `columns={{ base: 2, md: 3, lg: 5 }}`, `colGap="stack"` and `rowGap="stack"`.
- The nine real marks are in `public/clients/`.
- This is a composition of `ClientMark` with Layout or Cluster. It is not a new unit.

---

## 6 · Texture

### 6.1 What it is

The texture is **the Tcules pixel-grid** (`docs/textures.md`, `src/styles/textures/pixel-grid.json`):
a fixed 5px tile, with one 3px LCD column at alphas .035 / .21 / .07 / .21 / .035, generated through
iterations. **It is not a dot grid.** The ch05 § 4a dot field is a different thing, a mark *inside*
illustrations (brand edit, § 9).

**The owner has ruled that it is used for page rhythm, with real graphic-design judgement** (5 Oct).
That ruling replaces Texture.md limits 4 ("at most one per page") and 5 ("never a rhythm device"). The
budget in § 6.4 is this document's reading of the ruling. The owner sees it in the `fdn-texture` PR, but
it does not block the build.

### 6.2 Fixed rules

- **Ground: paper only**, with `--tex-ink` brandeis-500. Never on tint, ink or blue. Section warns in
  development, and `fold:check` fails a placement on any other ground.
- Strength, pitch and cell never vary. **A placement varies four things only:** anchor, aspect, side
  and blur. No two placements on a page share more than one of these.
- **Limit 2 is unchanged and binding: no shape box intersects a content box** at 1470 or 390. A content
  box is a heading, any text, an image, a form, a ruled row or a table. Only the feather (the blur beyond
  the box) may reach content.
- Blur ≥ 100 on any shape that enters the content column (limit 6).
- It counts against the band rule (§ 4.3).
- It never sits on a band with an illustration, behind an image, behind a form, or under ruled rows.

### 6.3 The recipes, and where their numbers live

**The numbers live in one place:** a single `TEXTURE_RECIPES` constant in
`src/components/Texture/recipes.ts`.
(Interim, 6 Oct 2026: until that file exists, each recipe a kit family needed is a named component
beside Texture — `TextureClosing` (cmp-cta), `TextureCounterweight` (cmp-media-split) — holding its
numbers in one place, so no call site writes one. `fdn-texture` folds them into `TEXTURE_RECIPES`.)
- Each recipe states its shapes per breakpoint and its mirror behaviour.
- `docs/textures.md` gains a table that mirrors it, generated by `npm run texture -- --recipes` so it
  cannot drift.
- Call sites write `<Texture recipe="closing" side="start" />` and never a raw number.

**The values are SVG geometry in TSX, which `tokens:check` cannot see.** They are enforced by
`fold:check`'s box-clear measurement on every enforced route at 1470 and 390, and by the texture
specimen, which renders every recipe in a realistic band.

| Recipe | Where | Shape (lg) | Why its box clears content | Below 1024 |
|---|---|---|---|---|
| `hero-field` | a hero with no media, a full-height end column from 1440 *(cmp-hero fix round 1: the ellipse sat off the band and read as a smudge)* | rect, top −120, end −120, 32% × 140%, blur 96 | its ramp centres on x ≈ 1120 at 1470 and is full by 1210; the title's 26ch box ends at 1075 | `horizon` in the foot padding, rect bottom −80, 120% × 152, blur 24 |
| `hero-plinth` (was `hero-foot`) | a hero with a photograph: a field the photo stands on *(fix round 1)* | rect, bottom −80, end −80, 42% × 520, blur 32 | starts 150 inside the photo's start edge (x ≈ 933; the copy track ends at 687), so it shows only in the end margin and the foot padding | rect, bottom −80, end −80, 78% × 330, blur 24, under the stacked photo |
| `counterweight` | a B band, in the corner opposite the image | ellipse, bottom −260, side −180, 34% × 340, blur 180 | the box rises 80 into the band, inside the 96 padding, under the copy track | none |
| `horizon` | the bottom edge of a paper band directly above a change of ground; never above ruled rows | **amended 6 Oct 2026 (cmp-services):** a STEPPED PIXEL FIELD, `TextureHorizon` — four rows of hard 10px pixels at the band's foot, 40 tall, dithered 100 / 70 / 38 / 14% from the foot up; it starts 56 under the last line of copy. Was: rect, bottom −200, 110% × 260, blur 200, whose feathered edge read as a moiré over a card set's last line | it reaches 60 into the band, inside the 96 | same |
| `closing` | the L close, under the copy column's foot, running into the ink footer seam; the form column stays clean. On a centred close, both flanks (`side="both"`) | **amended 6 Oct 2026 (cmp-cta):** a pixel EQUALISER, not a haze — 22 hard-sided columns (64% of their pitch) falling irregularly from 0.86 of the field to nothing, each with a one-pitch peak dash 12 above it, faded upward by one field-wide gradient (1 → 0.82 at 45% → 0.28). On a centred close: 12 columns per flank over the outer 24% of the band, tallest 0.58 (≈ 444 in a 760 close). Was: rect, bottom −260, start −120, 44% × 320, blur 200, which drew a ~200 haze that read as a smudge | its field starts a `stack` (48) under the copy's last line and stops at the copy column's end (CtaSection's `.textureField`); on a centred close the tall columns stay in the outer ~14% and fall under ~0.12 before the column's track | `horizon` |
| `head-half` | the empty end quadrant beside a J statement | rect, top −200, end −120, 34% × 296, blur 160 | the box ends 96 into the band, at the padding edge | none |
| `rail` | a long D band at ≥ 1440, in the outer margin | rect, side −140, top 15%, 220 × 70%, blur 120 | only 80 enters the band, outside the content column | none (≥ 1440 only) |

**Rejected:**
- the offer frame (two shapes, and it competes with the offer's photo);
- the stat halo (it would need limit 2 relaxed);
- texture spanning two bands;
- texture behind cards;
- texture inside a slider.

### 6.4 Budget and rhythm

**Per page:**
- ≤ 3 placements at 8 or more bands;
- ≤ 2 at 5 to 7 bands;
- ≤ 1 below that.

**Never in adjacent bands. Sides zig-zag** between successive side-anchored placements (`horizon` is
centred and does not count). Each recipe appears once per page, except `horizon`.

**The service-page signature, the same on all six pages:**
1. `counterweight` (end side) on the B band, whose photo is on the left;
2. `horizon` on the band directly above the tint G band, unless that band ends in ruled rows;
3. `closing` (start side) on the L close.

The hero spends Field, so it carries none. Repeating the same recipe in the same slot across sibling
pages is the continuity the review asked for.

**The kit/home signature:** `head-half` (end) on the J statement, `closing` (start). The `hero-foot` was dropped in page-showcase fix round 2 (brand-amendments.md): at the grid's fixed strength it read as a placeholder stripe.

---

## 7 · Typography

No new type roles. The roles exist; the kit uses them with more contrast.

### 7.1 One large voice per band

| Band | Large voice | Small voice |
|---|---|---|
| Hero | `--text-display` (67) at the 572 column, ≤ 3 lines | `--text-lead` (20), ≤ 3 lines |
| Section head (stacked) | `--text-h2` (43) at `--measure-title`, 1 to 2 lines | `--text-lead`, ≤ 2 lines |
| Section head (beside) | `--text-h2`, 2 to 3 lines in 381 | `--text-body-lg`, 3 to 4 lines |
| Statement (J) | the `--text-h1` role (54) on an `h2` or `p`, ≤ 3 lines | `--text-eyebrow` |
| Stats | `--text-stat-lg` (54, mono) | `--text-body-sm` label, ≤ 2 lines |
| Typographic or featured testimonial | `--text-quote-lg` (34) | `--text-h6` name, `--text-body-sm` role |
| Banner | `--text-h2` | `--text-lead` |
| Close | `--text-h2` | `--text-lead`, then points at h6 + body-sm |

### 7.2 Card titles step with the count

| Set | Title role | Body role |
|---|---|---|
| 1 featured, horizontal | `--text-h3` (34) | `--text-body-lg` |
| 2 to 3 cards; text cards | `--text-h4` (28) | `--text-body` |
| 4 to 6 cards; icon cards; tiles | `--text-h5` (22) | `--text-body-sm` |
| any ListCard set of ≥ 4 **rows** (ruled, D and F) | `--text-h5` (22) | `--text-body` |

**Amended 6 Oct 2026 (`fdn-spacing` review): a row's body does not step.** As first written, the last
row coupled h5 with body-sm for ListCard rows too, which contradicted § 1.4: the F step row and the
one-column D row are h5 over **body**. Built that way, product-design's five numbered steps and its
"What you receive" rows read as fine print beside an h2 band at 1440. **The title steps with the
count; the body steps with the track.** A card or tile body runs in a 286 to 392 track, where body-sm
is right. A ruled row's body runs at up to `--measure-body`, beside or under its title, and is a reading
line, so it stays at body at either size. § 1.4's two-column D row is re-derived at body (186; the band
is 558, still 40 under the target), and its word ceiling in § 1.5 drops from 22 to 19. ListCard
implements this as "at `sm`, only a tile's body steps". **Owner check:** if body-sm rows were
intended, the alternative is to keep § 7.2 as first written and correct § 1.4's F and D rows instead.

The card does not know its count. It takes the step as a component-size prop (`size="lg" | "md" |
"sm"`), and the set passes it (BlockCardSet, or the composing route). `fdn-spacing` adds the prop to
BlockCard and ListCard, because it already edits both files.

### 7.3 Measure and copy shape

- Copy follows the budget in § 1.5.
- Titles balance (`--text-title-wrap`). Running text uses `pretty`.
- **Eyebrows:**
  - at most one per band, and optional;
  - never repeats the heading, the crumb or the band before it;
  - never the same eyebrow on every card of a set (that is the set's heading, so say it once).
- Mono stays uppercase in presentation only (`--text-mono-case`). Strings stay in sentence case.

---

## 8 · The kit

### 8.1 The deliverable

1. **Eleven component families**, each proven at `/design/kit/<family>` with every variation at 1470 and
   390. Every new unit also gets its own `/design/<unit>` route (§ 11).
2. **The six service pages**, recomposed from those families. No template-local block survives that a
   family now covers.
3. **Three kit showcase pages**, where the kit is judged against the references. They use free,
   Tcules-flavoured content.

### 8.2 Service page, worked example (product-design, 12 bands)

| # | Band | Head | Image | Texture | Blue masses |
|---|---|---|---|---|---|
| 1 | A hero, illustration | hero | illustration | — | solid + illustration |
| 2 | B media split, photo left | left | `studio-sticky-board-ux` | `counterweight` (end) | Texture |
| 3 | H logo strip (real marks) | centred | — | — | — |
| 4 | C-icon-6, "What you receive" | beside | aside `hand-sketch-wireframe` | — | — |
| 5 | E diagram, "How one decision moves" | left | diagram | `horizon` | Texture |
| 6 | G-case, on tint | left | case card (stand-in) | — | — |
| 7 | F process (Steps) | beside | aside `moodboard-wall-desk` | — | — |
| 8 | M work, 3 linked cases | centred | stand-in covers | — | — |
| 9 | K offer, photo right | left | `pair-laptop-notebook` | — | solid |
| 10 | D-faq | centred | — | — | — |
| 11 | I banner, 3:1 | left | `sticky-wall-soft-focus` | — | — |
| 12 | L close | left | — | `closing` (start) | solid + Texture |

**Checks on this sequence:**
- **Cadence:** the image-less bands 3 and 10 each sit between image bands, and 12 is the close. 9 of
  the 12 bands carry an image, and 8 of the 10 between the hero and the close do.
- **Centred heads:** 3, 8 and 10, none adjacent.
- **Texture:** 3 placements, none adjacent, sides end then start.
- **Media sides:** B left, K right.

The other five pages follow the same shape. Their bands differ where their fixtures argue differently:
Fit becomes N, the stat becomes S or a D stat aside, and D read-downs replace C-icon where the content is
a list.

### 8.3 Showcase pages

*As built (page-showcase fix round 2, 7 Oct 2026): the band lists below are the brief; each page's `page.tsx` header is the record of what renders, and brand-amendments.md § page-showcase fix round 2 lists where they differ (heroes, image moments, texture).*

**`kit/home`** (warm family, 12 bands). This is the page judged against the references, so it opens on
a photograph.

| # | Band | Head | Image | Texture |
|---|---|---|---|---|
| 1 | Announcement strip on tint, then **A, photo hero** [1, 1] | hero | `wireframe-wall`, 5:4 (fix round 1: the video still was soft) | `hero-plinth` |
| 2 | H logo strip: the real marks, headed "Teams we have shipped with" | centred | — | — |
| 3 | C-image-3, H-row with a section action, "What we do" | left | card images | — |
| 4 | J statement | left | — | `head-half` (end) |
| 5 | B media split, photo left, 4 tiles, "How we work" | left | `studio-sticky-board-ux` | — |
| 6 | G slider on tint: fictional clients with stock portraits | centred | portraits | — |
| 7 | F process | beside | aside photo | — |
| 8 | S stats, illustrative numerals (no marks in this band) | centred | — | — |
| 9 | I banner, 3:1 | left | `office-calm-interior` | — |
| 10 | D-faq | centred | — | — |
| 11 | C-pair, "Latest thinking" | beside | stand-in covers | — |
| 12 | L close | left | — | `closing` (start) |

The slider portraits must sit in the warm family: `portrait-man-blue-office` (warm), `portrait-woman-grey`
(neutral), and `portrait-man-green` (neutral, and the page's one vivid photo).

**`kit/about`** (warm family, 10 bands):
1. A photo hero with the Holi photo (5:4, 2.97×), `hero-foot` (start);
2. J statement;
3. **C-image-4 team scenes** (`lead="none"`): `studio-session-talk`, `studio-workshop-presenting`,
   `studio-pair-at-monitor` and `studio-offsite-talk` at 286 × 161, all ≥ 2×. Offsite is the page's one
   vivid photo;
4. D read-down: names and roles, no portraits, with a stat aside;
5. B media split, photo left, `studio-sticky-board-ux`, `counterweight` (end);
6. G featured with portrait (`portrait-man-blue-office`);
7. S stats;
8. I banner beside (`whiteboard-two-hands`);
9. K offer;
10. L close, `closing` (start).

**`kit/services-index`** (cool family, 11 bands):
1. A no-media hero, `hero-field` (end);
2. C-icon-6 router with per-card links (aside photo);
3. B media split;
4. C-image-4, specialist services (centred);
5. N contrast, "Right for you if…";
6. C-pair, with `horizon`, because it sits directly above the tint G band;
7. G rating-led, on tint (centred);
8. K offer;
9. D-faq (centred);
10. I banner;
11. L close, `closing` (start).

### 8.4 Content on showcase pages

- **May be invented, in Tcules' voice:** headlines, leads, card copy, process stages, FAQs and
  illustrative numerals.
- **Testimonials use fictional people and fictional companies**, with stock portraits (§ 5.8).
- Real client marks appear only beside real words or sourced numerals.
- Stock photographs need no credit or label (owner, 5 Oct).
- Showcase content lives inline in the showcase `page.tsx`, and never enters the `src/content` fixtures
  that live routes read. Photos come from `getKitPhoto` (`fdn-media`).

### 8.5 Acceptance bar, applied to every family and page

- [ ] **`npm run fold:check -- <route>` passes. This is mandatory, not "if merged".** It checks:
  - every band ≤ 830 at 1470 and ≤ 1700 at 390;
  - the hero ends ≤ 830;
  - line counts within § 1.5;
  - band count 8 to 12 (pages only);
  - photo resolution and tone;
  - texture budget, ground and box clearance;
  - archetype and centred-head adjacency.
- [ ] `npm run shots` shows no horizontal overflow and no page errors.
- [ ] **The squint test at 1470:** any three consecutive bands read as three different shapes, and the
      alignment alternates (§ 3.5).
- [ ] **`cmp-service-pages` and `cmp-showcase` only: full-page shots at 390, put in front of the owner.**
      Check them for the § 3.7 item 6 cadence, and for no run of 3 bands that collapse to the same head +
      rows shape.
- [ ] The band rule (§ 4.3) holds; no ground is blue; the page does not read black and white (§ 4.2). The peridot gate (§ 4.4) passes.
- [ ] Image cadence (§ 5.1) holds. There are no empty media frames.
- [ ] No box on any card, except a set boxed on purpose (`frame="box"`, § 3.1 amendment, 7 Oct 2026).
      No margin on any child. No hand-rolled grid or flex.
- [ ] `npm run verify`, `npm run build && npm run aria:check`, and `/audit-component` on each new or
      changed unit all pass.

### 8.6 Specimens and tint

A family specimen may show a variant on tint, to prove surface self-containment. Each one carries the
caption **"Surface proof — on pages, tint is the proof band only (§ 1.7)."**

---

## 9 · Brand-guide edits this implies (listed, not applied)

`fdn-brand-docs` applies these once the owner approves them (§ 10, item 1). Until then, this document
overrides the conflicting passages, and every package brief says so.

### ch02 Colour

| § | Current | Change |
|---|---|---|
| The families · Peridot | "Two uses only: a marked phrase in text, and the carried item…" | On the website: `::selection` (peridot-500 under neutral-950) and the illustration's carried item only. The marked phrase is a social-media device (ch10), not used on the website. |
| Peridot ramp note | "500 is the band behind a marked phrase, on every surface." | "500 is `::selection` on the website, and the marked phrase on social (ch10)." |
| How much of each · Blue | "≤ 5%. One band per page at most, usually the ask." | On the website: no blue bands until a purpose is set (owner, 5 Oct). Social is unchanged. |
| How much of each · Tint | "a proof block, a form, a reference table" | One tint band per page at most on the website (the proof band), plus an optional announcement strip. The close is on paper, because it carries the texture. |
| What may sit on each ground | the "marked peridot-500 · highlight" swatch on each ground | Relabel it: selection (website), marked phrase (social). |
| new: Blue as an accent | | Add: blue is the recurring foreground accent (icons, text links, markers and numerals, arrows, small marks, active states, slider controls, stat accents), never a ground; the band rule counts blue masses only (§ 4, owner 6 Oct; `docs/kit/brand-amendments.md`). |
| new: Texture on grounds | | The pixel-grid takes brandeis-500 on paper only; never tint, ink or blue on the website. |
| Do and don't | the "one pivot band" composition | Remove the blue band from the website "Do" page rhythm. |

### ch05 Imagery (recorded in `docs/dbf-ch05-amendments.md` as amendments 9 to 15)

| § | Current | Change |
|---|---|---|
| intro note, § 10 Sourcing | "Stock photography is not published… A credited stand-in may appear inside an internal document." | Stock may be used on internal review builds with no credit or label (owner, 5 Oct). Public use is § 10, item 3. |
| § 3 Team and studio | shot by the team | The tcules.com/about photos are approved at the placements § 5.4 allows. The Holi photo is for About and Careers only. The pre-cut headshots are not used. |
| § 4a, the "Texture" row | "A dot grid marks a raw or unresolved surface…" | Rename the row **"Surface marks (dot field)"**. Add: "The Tcules texture (pixel-grid) is a page device, never drawn inside or behind an illustration." |
| § 6 Corner radius | "--radius-0 on every image… one exception: the SiteNav rail card" (amended by 5b for BlockCard) | Every **photograph** box takes `--radius-8` (`--radius-4` at 64px). Captures and cut-outs stay at 0. Illustrations are never boxed. Adds § 5.3's table. |
| § 7 Captions | every non-decorative image has a caption | Add an **"Atmosphere photograph"** category, for photos in a split, banner, offer, aside or card: decorative, no caption, `alt=""`, unless a person is named. |
| § 9 Placement specs | 7 placements | Add § 5.3 and § 5.4: 4:5 media split, 5:4 hero photo, 3:2 head aside, 3:1 and 3:2 banner, **16:9 for card sets of 3 or more**, the 1:1 portraits, and the **1.9× crop rule**. Allow a crop on the master's focal point. |
| § 9 Card imagery by family | "Services, audits, glossary, capabilities: No media." | Any card may carry an image of any kind (owner). Defaults per § 5.2. |
| § 9a Covers | "never a stock stand-in" | On internal review builds, a catalogue photograph with no legible screen may stand in for a missing cover, unlabelled (§ 5.7). |
| new § 11 Tone | | One temperature family per page, ≤ 1 vivid photo, measured tags (§ 5.5). |
| § 6 Bleed | never for on-page imagery | Unchanged. The banner is full-column (1240), not full-bleed. |

### Texture.md (spec, not brand)

- Limits 4 and 5 are replaced by § 6.4, under the owner's rhythm ruling.
- Limit 2 is unchanged. Add the box-clear measurement as its check.
- Tint, ink and blue rows: paper only. Delete the `.texInk*` candidate classes.
- Add the recipe API (§ 6.3) and the gaps G1 (breakpoints), G3 (recipes), G4 (side) and G5 (one side
  per axis).

### Worktree CLAUDE.md (in the `fdn-spacing` PR, not brand)

- The `--gap-column` row adds "and the row seam of a borderless card set (29 Sep 2026)" (§ 1.2).
- The tier table's tier-2 list gains the new patterns as they land: `Slider`, `CtaRow`, `Statement`,
  `Banner`, `Contrast`, `Thread`.

---

## 10 · Open items for the owner

Only item 1 blocks anything, and what it blocks is docs only.

1. **BLOCKING for `fdn-brand-docs` only: approve the § 9 brand-guide edits.** Nothing else waits on
   this, because this document overrides the passages until then.
2. **Service hero, shown and not asked:** the locked [1, 1] shape beside a centred-head + media-below
   variant, on `/design/kit/hero` (§ 2.3). H2 stands unless the owner picks the variant.
3. **Public stock.** May stock ship on public routes, or is it for internal review only?
4. **Live blue bands.** `insights`, `future-interfaces-lab/join` and `matter-design-system` each carry
   one. They are outside this kit and untouched until ruled on.
5. **Shown in their PRs, not blocking:**
   - the eyebrow at 24 (`fdn-spacing`);
   - the texture budget 3 / 2 / 1 (`fdn-texture`);
   - the photograph radius 8 extended beyond cards (`fdn-media`);
   - the arrow cue on linked image cards (`cmp-feature`).
6. **Studio originals.** The about-page originals at ≥ 1200px, and square headshots, would let studio
   photos take B, K and the hero, and let the team appear as portraits. Until then, § 5.4 holds.

---

## 11 · Build order

**Foundations land serially, in this order. Each is a self-contained PR.** **No component family starts
until `fdn-gates` has merged**, so every family is built against `fold:check`.

1. `fdn-spacing`: S1 to S5, the card `size` prop, and the CLAUDE.md `column` amendment.
2. `fdn-top`: § 2.1 to § 2.3 and § 2.6.
3. `fdn-colour`: § 4.4 and the peridot gate. (Its blue-at-rest-to-ink fixes were reversed by `fdn-blue`, § 4.1.)
4. `fdn-media`: the photo registry, tone tags, derived widths, Media `ratio`, `focus` and
   `--media-photo-radius`, stand-ins, and the empty-frame fix.
5. `fdn-section-head`: ContentSection `align`, `aside`, `actions`, `footer`, the `split-head` and
   `media` arrangements, and the `CtaRow` pattern.
6. `fdn-scroll`: Layout `scroll` mode, and the `Slider` pattern.
7. `fdn-texture`: the recipes, `side`, breakpoints, and the slot on Section, PageHero, ContentSection
   and CtaSection. **Not gated.**
8. `fdn-gates`: `fold:check`, `fold.config.json`, `data-band` and `data-copy`.
9. `fdn-brand-docs`: the § 9 edits. Gated on § 10 item 1; docs only, so it can land any time after.

**Component families then build in parallel:**
`cmp-hero`, `cmp-cta`, `cmp-feature`, `cmp-testimonials`, `cmp-logos`, `cmp-form`, `cmp-banner`,
`cmp-process-stats`, `cmp-media-split`, `cmp-readdown`.

**One waits:** `cmp-services` waits on `cmp-feature`'s BlockCard changes.

**Then:** `cmp-service-pages` recomposes the six pages, and `cmp-showcase` builds the kit pages.

**Recorded follow-up (`fdn-spacing`, 6 Oct 2026), outside this kit's scope.** The § 7.2 count rule is
wired for the six service pages, the specimens and `BlockCardSet` only. The live routes that render a
ListCard set of four rows or more (`services/[...slug]`, `expertise/[slug]`, `audits/[slug]`,
`tools/[slug]`, `how-we-work`, `glossary`) pass no `size`, so their rows stay at `md`. Each adopts the
rule when it is recomposed from the kit. Nothing breaks meanwhile: `md` is the row's prior look.

**The § 1.2 row seam, by contrast, is applied everywhere now (`fdn-spacing` fix round, 6 Oct 2026).**
CLAUDE.md states it as a system rule, so it holds on every live route and not only in the kit:
- **Moved to `column`:** every borderless card set on a live route (BlockCard sets and the routes' own
  hand-built card `li`s):
  - the `card-grid` and `comparison-cards` blocks on `services/[...slug]`, `expertise/[slug]`,
    `audits/[slug]`, `tools/[slug]`, `how-we-work` and `glossary/[slug]`;
  - the section cards, nested tiles and interface-lab cards on `future-interfaces-lab`;
  - the cards on `future-interfaces-lab/join`, `services`, `careers`, `matter-design-system` and
    `about` (voices);
  - the resource grids on `insights`, `insights/[...slug]`, `insights/events/[slug]` and
    `insights/podcasts/[slug]`, and the format cards on `insights`;
  - the statements on `case-studies/[slug]`;
  - the ContentSection specimen's card set, and the service template's Thread stages (below).
- **Left at `gutter`, because they are not card sets:** Figure groups (`figures` blocks), the about
  galleries (an image mosaic), the insights filter groups (form controls), the join page's two-panel
  split, and the about closing cards (grounded Sections with a surface of their own; § 1.2 covers
  borderless sets only).
- **Thread** (`ServicePage/Diagrams.tsx`) was first scoped out as "not a card set". At 1440 its
  bodied stages read as one: rule-opened tiles, three across. They now take the card steps (row seam
  `column`, key → title → body `text`) until `cmp-service-pages` replaces Thread.
- **Still open, recorded rather than fixed:** the hand-built card `li`s on `services`,
  `future-interfaces-lab`, `future-interfaces-lab/join` and the `about` closing cards keep their title → body at `tight` 8, where § 1.1 S2 puts a card's at `text`. They are
  inline one-offs that BlockCard replaces when each route is recomposed from the kit. They take the
  card rhythm then, rather than through a second hand-tuned copy now.

**Who edits what:**
- **`src/templates/ServicePage/*` is edited only by foundations** (serially: `fdn-spacing`, `fdn-top`,
  `fdn-colour`, `fdn-media`, `fdn-gates`) **and by `cmp-service-pages`.**
- No family edits a template. Families build units, and `cmp-service-pages` swaps them in: Thread, Stat,
  Fit → Contrast, Steps → F, Router → the service list, Cases → M, ProofBlock → G-case.
- **Each shared pattern has one family owner** during the parallel phase:
  - BlockCard → `cmp-feature`;
  - ListCard → `cmp-readdown`;
  - CtaSection → `cmp-cta`;
  - Proof and RatingBadge → `cmp-testimonials`;
  - EnquiryForm → `cmp-form`;
  - Section (`density="strip"`) → `cmp-banner`;
  - PageHero → `cmp-hero`.

  Any other family uses them as they are.
- **Cross-family variations live with the owner of the unit they need.** The "offer with a compact
  form" variation lives in `cmp-form`'s specimen, which composes `CtaSection arrangement="offer"` with
  `<EnquiryForm variant="compact" />`. `CtaSection` already takes `form: ReactNode`, so `cmp-cta` has no
  dependency on `cmp-form`.

**The integrator merges the shared files:**
- `src/patterns/index.ts`;
- `src/components/index.ts`;
- `src/styles/tokens/index.css`;
- the `SPECIMENS` list in `src/app/design/page.tsx`;
- `fold.config.json`;
- `docs/content-changes.md`.

Each package lists the lines it adds to them.
