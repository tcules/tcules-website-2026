# Treatment rules: what a section's content asks for

**Status:** living, started 29 Oct 2026 from the owner's reviews of the pages built on the 26 Oct copy.
The individual rulings are in `docs/decisions/` (each row names its entry). This file is the
generalisation: it turns those rulings into the questions a builder asks of any section, including one
nobody has designed yet, so the component map can decide "this needs flat graphics", "this needs an IRL
photo", "this needs a cleaner arrangement" without waiting for a review. Every review adds to it.

Read a section in this order: **what does its content do → what visual does that job → which
arrangement holds it → what it must never do.**

## 1 · The visual is decided by what the content IS

| The content is… | Its visual is… | Never | Rulings |
|---|---|---|---|
| **Evidence**: named clients, dates, durations, counts, a shipped outcome | the proof itself: client marks, the case's own cover, figures for the numbers | a decorative drawing standing in for proof | home-reasons-show-their-proof, studio-record-is-figures, why-tcules on every page (30 Oct) |
| **A problem with its named example** (hard parts) | one row per claim: its isometric illustration at 168 at the start (above the words below 768), then title and text, the example as a footnote: client mark + case title as one link with an arrow, the sentence under it in small type with "Example:" dropped; no case page, sentence only | a case cover; a band-level image about one item; a ruled text 2×2 | hard-parts-claims-lead-proof-footnotes (30 Oct; builds on claim-visual-depicts-the-claim) |
| **Stats** (a record line, "90 projects · 19 countries") | figures: number large, label small | a mono run-on line | studio-record-is-figures |
| **A rating** | the RatingBadge (14 text / 16 marks), its link and review count as the machine-readable name | text + link, "from 13 reviews" as visible text | rating-is-always-the-badge, rating-badge-text-14-marks-16 |
| **How something works**: engagement options, deliverables, a process, a mechanism | flat graphics (Sketch grammar); a drawn set's items each carry a title | isometric illustration | set-reasons-head-above-drawing-above, how-we-work-together-* |
| **An abstract claim with no evidence in its sentence** | isometric illustration (Reasons house style) | flat graphics (would read as a mechanism) | set-reasons-head-above-drawing-above |
| **A named service** (a set of services, a related service, a path's way in) | the service tile: the bento card with its flat drawing on the plate (no texture) | an icon + name list, a mono link stack, plain "Our related service:" text | named-services-are-service-tiles, related-destination-is-a-card, flat-graphics-on-one-plate |
| **A way onward** (questions answered by links to other services, closing a set) | the CTA card: 2 columns of the last row (3 or 4 tracks chosen so two cells remain; the rest of the row at five; a whole row when the tiles fill theirs), a ground, no hairline or texture, every question and link, the first action outline then links; a linked closing statement with no question takes the title role | a text cell dropped into the grid, a solid tile that reads as one more item, a dashed onward cell | 2026-10-30-set-ends-in-a-cta-card (supersedes onward-cell) |
| **A named expertise** | an expertise card with the sector photo / product-type art | a text line | related-destination-is-a-card |
| **People, the studio, a place** | an IRL photograph (one grade, `--media-photo-grade`) | an illustration | brand imagery rulings |
| **An industry** | the sector photo (a client's user at a good moment) | a metaphor, a generic stock scene | sector photos ruling (26 Oct) |
| **A case study** | on home: the paper-deep horizontal CaseCard, alternating; elsewhere: the 3-column card grid; on /case-studies: per group one card-less horizontal card then the grid | the paper-deep card anywhere but home | home-selected-work-is-case-cards, paper-deep-is-for-case-cards, case-index-takes-the-finder |
| **Readable resources** (articles, podcasts) as a short set | ruled resource rows: format glyph + label, length, title, summary, arrow | a 2×2 grid of text cells | resource-rows-meta-format-then-length |
| **A choice of situations** (new vs established product) | each path its own drawing, its title as the hero, its ways in as service rows | 2–3 stacked buttons, one shared wide drawing, a container | paths-service-rows |
| **Testimonials** | 6+: the wall; under 6: the one-at-a-time slider, heading in eyebrow style, quote centred | quotes inside case cards | testimonials-under-six-turn-one-at-a-time |
| **A form** | the Island only: brandeis (default) or ink, with (default) or without the illustration | copy beside a white form panel on tint | forms-only-on-the-island |
| **A closing call to action** | the ink Island with the texture | a plain tint band | cta-band-is-an-ink-island |
| **A high-traffic page's hero** (home, about, contact, L1 services) | always an illustration or image (placeholder until the art lands) | a text-only hero | high-traffic-heroes-carry-media |

## 2 · Arrangement rules

- **Head above, items below**, full width. No head beside items (the `beside` arrangement is retired).
- **A head's end action is centred on the heading.** One action in the head; a second becomes the
  band's closing link.
- **Two actions = one row with a hierarchy:** a button (outline, quiet hover = secondary) then a link.
  Blue solid is the page's one main action.
- **Never two horizontal media rows side by side**: one per row, or the vertical card in a grid.
- **No lone tile on a row**: change the track count, or let the odd item take the full row.
- **No hairlines between Reasons items.** Card variants stay distinct.
- **What you get is four rows in a label column** (OfferParts; 2026-10-30-what-you-get-label-rows, proposed): the part's name in a label column from 1024 (over its content below), row 1 the drawn deliverables as a strip, rows 2–4 (who does the work, what we need, where our part stops) a compact 16:9 flat drawing beside the words. Every visual is flat (one-register-per-section). One body role (14). No numbers, hairlines or containers: rows are separated by Layout seams only. Never the terms as a text foot, a photograph among drawings, or more items on the deliverables' tracks. Until a page's drawings exist the old sheet stands.
- **A bare label between the lead and the set** ('What you receive') is not rendered; the heading names the set. Except on What you get, where it titles the first of the four parts.
- **Never two text-heavy bands touching; never two tints touching.**
- **An image about one item belongs to that item**, never above the whole set.
- **The CTA card closes a tile set** (`Bento cta`): a cell of its own kind (the tile's radius, a ground, no hairline, no texture, no lift), two tracks of the last row, or every track it leaves, or a whole row when the tiles fill theirs; never a plain text cell.
- **A countdown indicator shows where a carousel is heading**: the old bar stays empty, the next is full from the first frame; a wrap never lights the bars it passes.
- **Outline hover lays the ghost's pale tint under it and firms the line**; press one tint deeper; never the blue solid fill.
- **Two actions = different jobs?** A way deeper (head end action) and an ask (its own ink island band, one solid to ROUTES.contact, labelled 'Start a project') are separated, not paired. Check order: the island touches no island or tint, and sits two bands above the enquiry island.
- **Engagement tiers**: options are the subject (plated flat drawings); terms that hold for every option are ONE tier under the whole set: a stem rises from a port on one rail to each option's own text, the rail runs only between the outer stems and turns into them at a rounded corner, the terms under it, each led by its small mark (0.6, fixed slot, end-aligned beside its words from 768), never on the options' own tracks and never a bare hairline (2026-10-30-options-and-shared-terms-are-two-tiers; 2026-10-30-shared-terms-sit-on-one-rail, proposed).
- **Mixed evidence in one set** sits on one plate of one size, the title under its edge; text that is not a number is never an accent figure (a tenure is a wordmark over a mono label); a missing asset shows the labelled placeholder.
- **Peers with parts of different length share lines from 1024** (shareRows / subgrid).
- **Service rows** carry service weight (plate 128, h5 label) and each draws its own service's scene; a service's drawing is registered once by route.
- **A worked example ("Illustration, not client work") is its own section kind**, never a claim inside hard parts and never a method (owner, 30 Oct 2026, proposed). It is designed as a story, not set as text beside a picture: either one animated flat graphic that plays what the words say, or a short run of frames (three to five) showing the moments the words name, its label in the mono legend voice. Where the copy authors it inside a hard-parts band, it renders as its own block after the claims.
- **Three kinds, three components** (owner, 30 Oct 2026): *hard parts* are claims (a problem and how we design for it); *how we do it* is a method (numbered Steps beside one flat graphic of the process: the `method` band, approved as is); a *worked example* is a story (above). A peer set where each item pairs what it is with what goes wrong without it is the drawn ledger (`status-example`, approved as is). Decide the kind from what the content does, then use that kind's one component.
- **The ruled cell with the blue marker is for figures, not content** (owner, 30 Oct 2026): a stat and its label. Product kinds, deliverables and claims never sit in it.
- **A table of peer items** (levels, places, options) renders as drawn items, one drawing per row; a table read across rows stays a table. Router tables never drop a column.
- **One method, one numbered run** (owner, 2 Nov 2026, prototype readiness review): a step authored as a
  bold-led paragraph keeps the plain paragraphs after it as its body, so a step is never split into a
  numbered half and a loose text grid. Steps named in sequence ("Before we start", "First", "Then") end
  where a lead stops naming a moment: a variant of the work ("A wider review") is a labelled note under
  the steps, never a numbered step and never a peer tile. Until the band's drawing exists its labelled
  plate stands beside the steps.
- **A worked example in What you get is one panel** (owner, 2 Nov 2026, the audits): the sentences that
  introduce it sit above, and everything the example is (its "Illustration, not client work" label, the
  scenario, its table, the reading of it) sits inside one tint panel. A key table the example's table
  refers to (the readiness review's five statuses, the design-to-code audit's five types of gap) is
  the panel's legend, not a table of its own; a status with a conventional glyph carries it in both
  places. Below 768 the example's table reads down, row by row, inside the panel.
- **A numbered method without its own drawing** sits beside its bound case capture, else the page's service drawing or a scenario drawing.
- **A drawing is reused only for an item arguing the same thing, never twice on one page.** Scene keys ignore trailing punctuation.
- **A cited case's picture, on a case card, is the case's own cover**, never a page binding matched by client name. (A claim's example is a citation, not a picture: § 6.)
- **Rendering changes, words don't.** The owner decides presentation; the copy is not reworded.
- **A card takes its title from its own words** (owner, 2 Nov 2026; first done 30 Oct on four service
  pages, `6f1f1057`). Before a list renders as titled cards (What you get deliverables, any drawn tile or
  card set), check every item has a short bold lead. Where one doesn't, write it into `_pages/` from the
  item's opening words, verbatim, and keep the rest as the body: "a gap map, marking every…" →
  "**A gap map:** marking every…". Capitalise the title's first letter; the parser capitalises the body.
  Never invent a title, never paraphrase, never leave lower-case sentences set as card titles. Sweep
  every page using the same band when you change a band's renderer, not only the page under review:
  `awk` the band's list items for lines that don't start `- **`. A run-on lead ("**A fix plan,** …")
  is already titled and needs no edit.

## 3 · How to use it on a section nobody has designed

1. Name what the content does (evidence? mechanism? claim? destination? people?).
2. Take the visual from § 1. If none fits, it is a gap: list it, mock it, ask.
3. Arrange it with § 2. Squint: more than one idea down the page?
4. If a review overturns a row here, update the row and the ruling together.

## 4 · The four PD sections, redesigned in round 5 (owner, 30 Oct)

The four sections the owner marked on /services/product-design were redesigned in round 5 and their
rulings generalised into the tables above, so every service page maps the same way:
1. **The hard parts**: one row per problem, the cited case's own cover beside it. DONE; REDONE in round 6 (an isometric illustration of each claim, the example a citation).
2. **How we work together**: options plated (subject), terms as a lighter tier, the ask its own ink island. DONE.
3. **Why teams choose Tcules**: evidence shown as proof on one plate; the head's two links as outline + link. DONE; REDONE in round 6 (one isometric illustration per reason, band scale, case links stay in the text; an undrawn reason takes the labelled slot).
4. **What you get**: four label-column rows (OfferParts), round 7.

Also queued for the owner's redesign: /about, sections of /contact, the /services hub.

## 5 · Owner answers, 30 Oct (round 5)

- Deliverable titles on the other service pages are kept (short bold lead + the rest of the sentence).
- The "Why teams choose Tcules" outline button stays and /why-tcules gets built, after the service-page set is improved.
- Service pages keep both asks: the ink "Tell us what you're working on" island and the closing enquiry form (2026-10-30-service-pages-keep-both-asks).
- What you get foot: superseded by 2026-10-30-what-you-get-titled-terms-four-parts (four parts, round 6).

## 6 · Balancing the visual registers (owner, 30 Oct; logged)

1. **Scale decides first.** Flat graphics are item-scale (one per item, sets of 4+ concrete things: deliverables,
   services, engagement options). Isometric illustrations are band-scale (one per band, or one each for 2–4 peer
   claims). 2026-10-30-flat-for-items-illustration-for-ideas.
2. **Neighbouring bands never share a register** (flat · isometric · IRL photo · proof · figures).
   2026-10-30-adjacent-bands-change-visual-register.
3. **Content still picks the register** (§ 1). Revised rows:

| The content is… | Its visual is… | Never | Rulings |
|---|---|---|---|
| **Claims backed by examples** (hard parts) | one row per claim: its isometric illustration at 168 at the start (above the words below 768), then title and text, the example as a footnote: client mark + case title as one link with an arrow, the sentence under it in small type with "Example:" dropped; no case page, sentence only | the cited case's cover as the claim's picture | hard-parts-claims-lead-proof-footnotes |
| **A reason to choose us** | an isometric illustration of the reason; case links stay in the text | a case cover; a phrase lifted into a figure card | reasons-take-illustrations |
| **What you get** (deliverables · who works · what we need · where it stops) | four rows in a label column: deliverables as a drawn strip; who does the work, what we need, where our part stops each a compact 16:9 flat drawing beside the words. All flat (one-register-per-section) | a photograph among drawings; terms as a foot | what-you-get-label-rows (proposed) |
| **Options + terms that hold for all of them** | options as the subject; terms one plain text row at body size under the whole set, on its grid | the terms as items, a rail, plates or drawings | options-and-shared-terms-are-two-tiers; shared-terms-sit-on-one-rail (proposed); engagement-terms-plain-row |
| **A tile set that closes with a routing line** | a 2-column mini CTA card holding all the content; 3 or 4 columns so it fills the last row; dotted outline, no fill; one half per question; arrow links only (cta-card-is-dotted-halves) | the line placed as plain text in a cell | set-ends-in-a-cta-card |
| **A service tile** | its drawing moves on hover; polished at zoom | a static or sloppy drawing | service-tile-drawing-moves-on-hover |
| **Any image in a card or row** | hairline + rounded corners (card-image-radius-8) | a bare rectangle | 2026-09-29-card-image-radius-8 |

4. **A band's illustration set is drawn as one set** (proposed): each drawing start-aligned in the shared box so it
   lands on its text column; a route over the blue plane in one opaque colour; one light base plate with the blue
   slab as its centrepiece; no unexplained frame or stray mark. 2026-10-30-illustration-set-craft.

The § 1 rows "Evidence" and "An abstract claim" are refined by these: evidence that SUPPORTS a claim is a
citation; only a band whose subject is the evidence (home's proof band, selected work) shows covers.

## 7 · Owner, 30 Oct afternoon (mockup review)

- **One register per section** (one-register-per-section): What you get draws "Who does the work" flat, not as a photo.
- **Flat graphics:** only frames on the plate; routes between frames allowed; draw the TITLE's idea (flat-graphics-sit-in-frames).
- **Hard parts:** small illustration | claim; the example a compact case link + sentence under the claim; no cover, no card (hard-parts-claims-lead-proof-footnotes).
- **What you get:** four rows, a label column; row 1 the five deliverables as a strip; rows 2–4 compact, a 16:9 visual beside the text (still proposed).
- **CTA card:** dotted outline, one half per question, arrow links, no button (cta-card-is-dotted-halves).
- **How we work together:** shared terms a plain text row, no rail (engagement-terms-plain-row).
- **Industries:** the standard 3-column card grid (industries-are-a-card-grid).

## 8 · Owner, 30 Oct evening

- **Hard parts:** three columns, drawing | claim | example as authored; no logo, citation, card or cover (hard-parts-three-columns-as-authored).
- **Tile set CTA:** one dotted card per question (cta-card-per-question).
- **Heroes:** the seven L1 service pages, /expertise and /audits carry the owner-approved isometric heroes from the illustration canvas (public/illustrations/heroes/, text flattened to paths, viewBox trimmed to the drawing).
- **Standing lesson:** render the copy as authored with existing components; change the arrangement before adding parts; use the full width.


## Added 1 Nov 2026 (/how-we-work)

- **A page with no hero art of its own** reuses a studio photograph bound on /about, named per route in
  `images.ts` `STUDIO_HERO`, never guessed. Use the photo whose subject matches the page's claim (team, review,
  work wall).
- **Options with an eyebrow and several paragraphs each are sections**: EngagementOptions `rows`, not a
  three-column card set. An italic first line naming the option's kind is its eyebrow, never body.
- **An option's labelled lines are facts**: "**How it works:**", "*Typical starting points:*", "*Best when:*" are
  a spec sheet under the option's description (mono key in a narrow track, value beside it), never more
  body; a sentence-list of starting points stays the authored sentence (its joints are copy). A set's closing
  claim with its worked example is claim-then-proof inside the band: the claim as a sub-head, the example as
  a case teaser (horizontal BlockCard of the case) under it. Never an ask: an example is evidence, and an
  island that carries one mixes the two jobs. Never a band of its own when its words point back at the set
  ("any of the three"): a conclusion stays in the band it concludes.
- **Practical terms (getting started, time zones, fees, ownership) are drawn cards**, as About's working terms;
  never an OfferSheet. A term with no scene takes the empty plate.
- **Bands that unpack one promise share one register**: on /how-we-work the four "what working with us is
  like" bands each take an isometric illustration of their claim, alternating sides.
- **One heading size per page**: a media split's head is `lg`, the same as a plain band's.
- **Prose with its own photograph is a media split**: it alternates sides with every other media band. A run of
  photo bands that all sit image-left is a planner bug, not a design.

## Added 2 Nov 2026 (/why-tcules)

- **A claim's example is one pattern everywhere** (2026-11-02-examples-are-one-pattern): an "Example:" paragraph
  is the ClaimProof panel under its claim's words, in hard parts, Reasons and prose bands alike.
- **A case snippet on a non-case page** (the copy tells one product's story in titled steps, then links the case)
  is the CaseSpread strip, as Dealpath's: each step a picture over its words, the earlier steps drawn, the last the
  case's real capture, the case link the band's action at the heading's end.
- **Every quote carries its person's one rating** (2026-11-02-one-person-one-rating).
- **A comparison of options keeps its table, and the row naming Tcules is picked** (DataTable `pick`: blue ground,
  blue key, start bar), so the table reads as advice with our suggestion in it (owner, 2 Nov 2026).

## Added 2 Nov 2026 (/services)

- **Named services that each carry a second field** (a router table: service · best for · what you get)
  are split service tiles: two a row, the named half (drawing, name, line) and an inset result panel
  (label, text, the tile's action at its foot). Never four-across tiles with the field stacked in: three
  fields cannot stay in line across a tile, and a label repeated per tile out-shouts the words.
- **Mixed closing words under a tile set** (notes on single destinations, not a question and its way
  onward): the authored sentences in their order, run on as one paragraph at the body measure, links
  inline. Never a CTA card per note (it repeats the names as links and outshouts the set), never loose
  lines, and never moved out of their place: the copy's order is fixed.
- **A hero title too long for the beside split's half column** takes the centred hero with the media below
  (route list `CENTRED_HERO_ROUTES`); a drawing or its placeholder is capped at 860, a photograph is not.

## Added 2 Nov 2026 (/expertise)

- **Groups of borderless cards inside one band sit a `section` (96) apart**, each head a `block` from its own
  cards. The set's own rows are a `column` (64) apart, so at `stack` (48) the next group's head read as one more
  row of the set before it. The distance between groups is always larger than the distance inside one.
- **/expertise takes the centred hero** with its drawing below, as /services does (`CENTRED_HERO_ROUTES`).
- **A group head told as "Label: statement"** ("By product type: what your product does") sets the label as the
  group's eyebrow and the statement as its h3, first letter raised. A head with no colon stays one h3.

## Added 4 Nov 2026 (/audits, the 3 Nov outline; proposed until the owner sees the pages)

- **A worked example that carries a table is a page of the report** (kind `example`, ReportBand): the band on
  tint, one paper page on it holding everything the example is, in order — its italic label in the mono label
  voice, the scenario, the sheet, the reading. A column of statuses takes its marks; a column whose values a
  key after the table defines is set in the label voice, and the key is the page's legend under the reading.
  A trailing case link is the band's head action at the heading's end. A worked example told as bold-led
  story rows stays `record` (CaseSpread). Below 768 the sheet reads down, each row's key its title.
- **An option table takes the split tiles from two rows**, and **a split tile left alone on the last row takes
  the whole row** (its drawing beside its words, the panel the last third). Never a split tile beside a hole.
- **One named offer on its own under a heading is its wide service tile** (name, the copy's sentence beside
  it, its drawing, the action for what it opens), never one ruled row beside the head.
- **A hero line that redirects the wrong reader** ("Already live with customers? See …") keeps its authored
  place after the ask, in the proof-line voice; it is never suppressed with the "Selected work" line.
- ~~A text band about who carries the work on reuses a studio photograph~~ (withdrawn the same day by the
  audits critic: a photo the copy never asks for, the same one on six pages). "After the audit" is its
  sentence and its links as authored, the closing "→" link a link row under the words.
- **What you get never sets more than four deliverables a row**: five read 3 + 2 from 1024; below 768 each
  drawing stacks full width over its words (decisions/2026-11-04-deliverables-never-more-than-four-a-row).
- Logged as proposed: decisions/2026-11-04-worked-example-table-is-a-report-page,
  -option-tables-take-split-tiles, -lone-named-offer-on-band-ground, -redirect-hero-line-keeps-its-place,
  -split-tile-panel-is-ruled, -placeholders-show-their-label-only.

## Added 4 Nov 2026 (/tools and the six tool pages; proposed until the owner sees the pages)

- **A directory of free tools is the /services hub's split tile for every tool** (kind `directory`, `tool-tiles`;
  tools critic, 4 Nov 2026, proposed: decisions/2026-11-04-one-tool-tile): drawing, name and paragraph in the
  named half, the router table's value columns as the result panel's fields, "Try the tool" at its foot, two to
  a row. A table of tools ("Tool | …") with no tools of its own hosts the plain groups after it: its head and
  lead as the band's, each group's h2 at the h3 scale a `block` over its tiles, groups a `section` apart, two
  single-tool groups sharing a row as two headed halves (Bento `tracks={2}`); the words after the set go under
  it at the body measure. No tool is shown twice, so the table is not also drawn as a grid.
- **A free tool renders as an article-style page** (LongformPage `family="tool"`, the 28 Oct launch plan): the
  hero's one action to `#workspace`, the worksheet in one shell beside its outline, the FAQ last. In the column:
  a bold-led numbered method is Steps; the worked example is the tint example panel, its words beside the
  story drawing from 1440, any table it carries at the panel's full width; a diagram follows the paragraph
  naming its marks, at the column's width (a marks paragraph with no diagram warns in development); the band sending the reader on stays prose with inline links.

## Added 4 Nov 2026 (/glossary and the term pages; proposed until the owner sees the pages)

- **A Statement holds one short line, never a paragraph** (`isStatementLine`: no link, at most 16 words). A
  paragraph promoted to a Statement is a wall of near-title serif larger than every h2 on the page, and the
  Statement drops its links. Anything longer stays prose at body size, its links kept. A term page's drawing
  stands beside its definition in the hero, so it is in the same place whether or not the page has a statement.
- **A set of peers gets equal weight in a listing too**: the glossary's terms are each the same vertical drawn
  card, in rows of three re-tracked to two where the count leaves a pair (`termRows`: 4 = 2 + 2, 5 = 3 + 2), so
  no row is left two thirds full. A horizontal lead is for a featured item (the insights hub's newest piece),
  never a term promoted by its place in the list or a horizontal used to fill a row.
- **A term's comparison table reads down on a phone** (DataTable `narrow="read-down"`, as a tool's worksheet):
  the term's own column is the table's point and was the one cut behind the scroll fade at 390.
- **A term page closes in one shape**: the close's sentences as running text with their links, then the
  destination's wide service tile across the row. Never a per-page choice between sentences inside the tile and
  prose beside a narrow tile.
- **A listing rail with one view collapses on a phone** to the section-in-view button that opens the jump list
  (IndexRail), never a sideways line of group names cut at the edge.
- Logged as proposed: decisions/2026-11-04-glossary-hub-is-a-listing, -statement-holds-one-short-line,
  -term-page-closes-in-one-shape, -comparison-picks-its-term.

## Added 4 Nov 2026 (/matter-design-system; proposed until the owner sees the page)

- **A page about one artefact shows the artefact itself in its hero**, where the live site holds the real one
  and the page binds no hero asset: a route-keyed cut-out (`ARTEFACT_HERO`, CorpusPage/images.ts), read after
  the page's own binding and before a studio reuse. White product frames on paper take the `paper-deep`
  contrast panel (ink is reserved); an artefact that carries its own shadows takes no Media `shadow`.
- **A wide artefact (about 1.8:1 or wider) takes the centred hero**, media below (`CENTRED_HERO_ROUTES`): in
  the beside split's half column it renders about 500 wide and its detail is lost.
- **Three properties of a product, each a concrete mechanism** ("how tokens are named", "how components are
  assembled"), are the drawn offer sheet across 3: one still flat drawing per property, heading its title and
  words. Never the blue-marker ruled cell, which is for figures.

## Added 4 Nov 2026 (/future-interfaces-lab; proposed until the owner sees the page)

- **A set of experiments or artefacts takes each item's real image as its cover when every item has one**
  (route-keyed `ITEM_COVERS`, CorpusPage/images.ts): vertical covered cards, three across, linked only where
  the item links. Where any item lacks a usable image, the whole set is drawn instead (one still flat drawing
  per item on Bento's plates, a tile linked only where the item has a page). Never a set of captures mixed
  with plates: one register per band.
- **An item whose paragraph ends on its own "→" link is a destination**: the link becomes the tile's or
  card's href, the sentence before it its words (DestinationsBand).
- **A close that is one sentence with several inline links** (a mechanism, not an ask) stays prose and, where
  the page draws it (`figure` scene), sits beside one flat figure from 1024 (`CloseFigureBand`), as a method
  sits beside its graphic. Its links stay inline; nothing is lifted into an action.
- **Two closing asks for two readers, each one sentence with one link, share one ink island in two peer
  halves** (`PAIRED_CLOSES` in plan.ts, CtaSection `second`): two islands would touch, and as prose they make
  a run of text bands after the FAQ. The first ask keeps the solid, the second the outline partner; the
  moved band is listed in `BANDS_ELSEWHERE`.

## Added 4 Nov 2026 (/future-interfaces-lab/join; proposed until the owner sees the page)

- **A set of abstract qualities** (reasons to join, what a programme is like) is the offer sheet headed by
  glyphs: one Solar glyph per item over its title and words, no hairline or blue mark (those are for figures),
  no card, no disc; 3 + 2 for five (OfferBands `SHEET_GLYPHS`, `arrangement: 'grid'`). A flat drawing would read
  as a mechanism; an isometric set would be five placeholders.
- **Roles or peers a reader places themselves among** are the drawn sheet across 3, one still flat drawing per
  role drawing its title's idea, equal weight, no lead item.
- **A method told as `###` steps is a method**: MethodBand reads each item as a numbered step beside the one
  figure, exactly as bold-led paragraphs.
- **An application the page takes itself** (the owner's 4 Nov answer) is the enquiry island in the application
  wording (`APPLICATION_FORMS`, blocks.tsx): the band's selection steps as the island's numbered points and the
  success view's next steps, its own link words as the submit, the programme's address as "or write to", no
  reply promise unless authored. The hero's ask to the same external form lands on the band (`#apply`).
- **A closing line filed under the last FAQ answer** ("Still got questions? Drop us a note: …") closes the band,
  centred under the accordion, never hidden inside an answer.
- **An island footnote's glyph names its kind**: a shield for an NDA or confidentiality line, the info mark for
  any other.
- **A close whose inline links all go to one place** is the ink island, its sentences whole as the lede, the
  first link's words as one LINK action (never a solid when the page's main action is elsewhere). Opt-in by
  route and band (`ISLAND_CLOSES`, plan.ts) until the owner rules it for every such close.

## Added 4 Nov 2026 (/careers; proposed until the owner sees the page)

- **A band that shows the studio itself is the studio collage** on any page (`STUDIO_COLLAGE`, CorpusPage/images.ts;
  studio-collage), with each tile matched to a sentence of its copy. It takes no side in the media alternation.
- **A page whose first band is the studio collage takes a words-only centred hero** (`TEXT_HERO_ROUTES`), so two
  photograph bands never touch at the top of the page. High-traffic routes are never on that list.
- **Two prose paragraphs that are peers of one kind** (what the work is, how it grows) sit as two columns under
  the full-width head from 1024, `column` apart (`PEER_PARAGRAPHS`), and never leave a half-empty band.
- **A checklist a reader checks themselves against** is the head beside glyph-led bodiless rows, one item per
  row, with the closing line under the list (`list-beside`). Never the blue-marker cells.
- **Peers a reader picks from (open roles)** are the glyph-headed offer sheet, as many across as keep no tile
  alone on a row (up to four). The glyph is by discipline, read from the item's meta line. Never ruled rows in
  two columns.
- **An application band is always the enquiry island**, placed before the FAQ (order.ts). Its form asks only what
  the copy asks for: a role chip group read from the page's roles band, the address, the link. Without selection
  steps it keeps the island's drawing.
