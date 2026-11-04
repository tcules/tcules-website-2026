# /careers — designed, branch design/careers-lab-matter (local), 4 Nov 2026

Tracker 2.42. Composed from the library through OfferPage's plan (`ROUTES.careers` was already in
`PASS_1_COMPOSED_ROUTES`). Copy: `_pages/careers.md`, rendered as authored. The page is for a designer or
engineer, often early in their career and often in India, deciding whether to work at Tcules. It answers four
questions in order: what working here is like, what the work is, what the studio looks for, which roles are open.
Then it asks them to apply on the blue island. Early-career readers get a side path to the Lab first.

## Decisions
- **Hero: centred words, no picture** (NEW, `TEXT_HERO_ROUTES` in src/lib/hero-media.ts). Breadcrumb, the h1 in
  display, the lead at 18, one blue solid "Apply for a role" → `#apply`. The first picture is the collage
  straight under it (the /contact precedent). A studio photo in the hero would sit next to the collage's six
  photos (adjacent-bands-change-visual-register) and stack two "words beside a photo" shapes at the top.
  /careers is not in `HERO_MEDIA_ROUTES`.
- `ahmedabad`: **the studio collage** (studio-collage ruling: "any band that shows the studio itself"), NEW in the
  corpus composer (images.ts `STUDIO_COLLAGE`, OfferBands `CollageBand`, data-band `B-collage`). Both paragraphs
  as authored in the corner. Each tile matches a sentence of the copy. Lead: the team round a meeting-room table
  (alt "The Tcules team working round a table in the Ahmedabad studio"). Start: a review over printouts. Middle:
  a whiteboard walkthrough. Middle start: two people at one screen. Middle end: two neighbours talking across
  desks. End: a presenter at the board. The other five have alt "". None is in home's collage or another frame of
  one of home's moments. Four photos were promoted from `studio-2026-11/` with catalogue entries, tone and derive.
  The collage takes no side in the media alternation (its big frame is always at the end).
- `product-work`: **two peer columns** (NEW, CopyBands `PEER_PARAGRAPHS`). The h2 is full width, and the two
  paragraphs sit side by side from 1024 (`column`, 64) at body 16. Below 1024 they stack `text` apart. It is the
  quiet words band between two picture bands.
- `ai-fluency`: illustrated prose (`ILLUSTRATED_PROSE`), with the isometric placeholder on the start side. It
  uses the register row "How AI fits into the job" (agent station → drafts → a designer's desk where one is held
  up to be checked). "See how we use AI" is the band's link action. The component places it under the heading,
  as on every media split, and the authored "→" is dropped.
- `what-we-look-for`: **the /about "Who uses" composition** (NEW for the composer, glyph-bands.ts `list-beside`,
  data-band `list-beside`). The head is in the start half (`split="halves"`). The six qualities are bodiless
  ListCard rows (md, sentence measure, full stops kept), each led by a Solar Bold glyph: eye, chat-round-dots,
  compass, checklist, magnifier-bug, flag. The closing line "A design degree helps…" is at body under the list.
  This replaces the blue-marker cells (marker-cell-is-for-figures).
- `open-roles`: **the glyph-headed offer sheet, four across** (NEW `across={4}` on OfferSheet, glyph-bands.ts
  `role-tiles`). Each role has a discipline glyph (Design ruler-pen, Engineering code-square, Marketing and visual
  communication palette, read from the meta line's first cell), the role as authored, and the meta line verbatim.
  There is no hairline, card, box or link. The track count follows the CMS count (`peerTracks`), so no tile ever
  sits alone on a row. This replaces two columns of ruled rows (a ruled grid). A boxed ListCard tile was tried
  and dropped: its box has no edge (owner, 9 Oct), so it only insets the copy off the heading's edge.
- `lab`: kind `text`, not `close` (plan.ts). It is prose with its two inline links, on paper. As a close it took
  the close's automatic tint and fell to the no-link fallback.
- `apply`: kind `enquiry` for every `apply` band (plan.ts), and order.ts counts an `apply` band as the form band,
  so it sits before the FAQ. It is the blue island in halves with the sketch-to-shipped drawing over the words:
  an application **without** steps keeps the drawing, and FIL's, with steps, does not. Both paragraphs are the
  island's words, the mailto live in the island's link ink, with no footnote (`lede: 'paragraphs'`). The form is
  the card in a NEW role-application wording (`APPLICATION_FORMS`): a pick-one chip group "The role you want"
  (the open roles read from the `open-roles` band, then "No matching role"; posts `role`), Email, then "Link to
  the work" (optional). There is no free-text question (`workLabel: null`), no "or write to" (the sentence above
  already gives the address), no reply promise, and the submit is "Send application". Hidden context: placement
  `application`, family `careers`.
- `faq`: D-faq, unchanged.

Rhythm at a squint (1440): centred words; a large L of six photographs; a full-width head over two prose
columns; a drawing slot on the left beside words; a head beside a glyph-led list; four glyph-headed roles in a
row; a short head and paragraph; the blue island; the centred accordion. Registers: none → photo → none →
isometric → none → none → none → isometric (island) → none. There is no tint band, no text-heavy pair (the list
and the roles are icon sets, and lab touches the island, which the check exempts), and no ink. The island is 608
tall at 1440 and stacks words over form at 390.

## Cause fixes and shared changes (every other page checked)
- **EnquiryForm**: the card dress takes `role` (a pick-one chip group, posts `role`), and `workLabel: null` drops
  the free-text question. Both are additive, so every existing form is unchanged (/contact shot, unchanged).
- **OfferSheet** `across` takes 4. This is additive, and no other caller passes it.
- **order.ts**: an `apply` band is the form band. Only /careers and /future-interfaces-lab/join have one, and
  /join's is already above its FAQ (shot, unchanged).
- **plan.ts**: `apply` is always `enquiry` (/join was already), `lab` is `text` (only /careers has it), and
  `ai-fluency` is illustrated prose (only /careers).
- **icon-glyphs.ts**: `compass` and `palette` were added verbatim from Solar Bold (Iconify API), plus the
  .design-sync Icon preview.

## Content mapping
- No copy changed. The FAQ's "Is Tcules hiring product designers?" answer still names the openings by hand. If
  the CMS job list changes, the FAQ can disagree with the roles band and the chips (content team).

## Open (owner)
- **New arrangement: words-only centred hero** (`TEXT_HERO_ROUTES`). Fallback: the beside hero with
  `studio-meeting-room-laptops`, which then leaves the collage, and you would need to allow a photo next to a photo.
- **New arrangement: the studio collage on a corpus page** (`STUDIO_COLLAGE`, B-collage under `text`). The tile
  picks, focus and zoom need your eye, as home's did. Two tiles show someone presenting at a whiteboard.
  `studio-pair-at-monitor` is also /about's second studio photo.
- **New arrangement: two peer prose columns** (`product-work`). Fallback: plain C-text.
- **New arrangement: a head beside glyph rows** (`what-we-look-for`). It is the About composition on a `set`
  band. Treatment rules § 2 retires `beside` for heads above items; the bodiless-row ruling (1 Nov) allows it for a
  short list. Also, `what-we-look-for` and `open-roles` are two glyph-led bands in a row. Their shapes differ, but
  if they read as repetitive, drop the six quality glyphs.
- **New variant: OfferSheet glyph grid four across** (`open-roles`), specimen 8b on /design/offer-sheet. The
  Engineering meta line breaks at "In-/office" in a 286 track at 1440. Should each role link to `#apply` with its
  chip picked? That is not in the copy, so it is not built.
- **New variant: EnquiryForm role application** (`role` chips, `workLabel: null`), specimen on
  /design/enquiry-form. "Send application" is interface wording. "Apply for a role" would say it a third time.
  The link field is optional, as on every card, and there is no Name field: say if an application needs either.
  The form's accessible name is still "Send an enquiry".
- **BLOCKING for launch (owner/ops):** applications post to `ENDPOINTS.enquiry` and land with sales enquiries,
  told apart only by the hidden context (family `careers`). Confirm this, or name a careers inbox.
- The success view says "Thanks. We have your enquiry." No application success words are authored. Content ask.
- `ai-fluency` ships with the labelled isometric placeholder (drawn by people). It is the page's one placeholder.
- `kinds:check` and `aria:check` need `next build`, which this run must not execute, so both are unverified here.
- og/twitter image: `IMAGE_ASSET_REQUIRED` in the copy.
