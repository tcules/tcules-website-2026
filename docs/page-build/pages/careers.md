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
  up to be checked). "See how we use AI" is the band's link, under the paragraphs it closes (pass 2, owner
  4 Nov), and the authored "→" is dropped.
- `what-we-look-for`: **the /about "Who uses" composition** (NEW for the composer, glyph-bands.ts `list-beside`,
  data-band `list-beside`). The head is in the start half (`split="halves"`). The six qualities are bodiless
  ListCard rows (md, sentence measure, full stops kept), each led by a Solar Bold glyph: eye, chat-round-dots,
  compass, checklist, magnifier-bug, flag. The closing line "A design degree helps…" is at body under the list.
  This replaces the blue-marker cells (marker-cell-is-for-figures).
- `open-roles` (changed after the critic: linked sheet rows, see below): **the glyph-headed offer sheet, four across** (NEW `across={4}` on OfferSheet, glyph-bands.ts
  `role-tiles`). Each role has a discipline glyph (Design ruler-pen, Engineering code-square, Marketing and visual
  communication palette, read from the meta line's first cell), the role as authored, and the meta line verbatim.
  There is no hairline, card, box or link. The track count follows the CMS count (`peerTracks`), so no tile ever
  sits alone on a row. This replaces two columns of ruled rows (a ruled grid). A boxed ListCard tile was tried
  and dropped: its box has no edge (owner, 9 Oct), so it only insets the copy off the heading's edge.
- `lab` (after the critic: head beside body, see below): kind `text`, not `close` (plan.ts). It is prose with its two inline links, on paper. As a close it took
  the close's automatic tint and fell to the no-link fallback.
- `apply` (after the critic: the second paragraph is the footnote and the link is required, see below): kind `enquiry` for every `apply` band (plan.ts), and order.ts counts an `apply` band as the form band,
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
- **New arrangement: the roles as linked sheet rows** (`open-roles`, glyph-bands.ts `role-rows`, specimen 8c on
  /design/offer-sheet). Replaces the four-across glyph grid (8b stays as a specimen). `what-we-look-for` (glyph
  rows beside its head) and `open-roles` (full-width glyph rows) are now two ruled, glyph-led lists in a row: if
  that reads as one shape twice, the cheaper change is dropping the six quality glyphs.
- **New OfferSheet item fields: `facts` and `choice`.** `facts` sets a meta line as whole facts parted by dots
  (no other caller yet); `choice` writes `data-enquiry-role` on a title link.
- **New EnquiryForm variant: a link picks a role chip** (`ENQUIRY_ROLE_ATTRIBUTE`, src/lib/enquiry-pick.ts). A
  role title links to `#apply` and the form checks that role's chip. Without script the link still scrolls.
- **New EnquiryForm variant: `urlRequired`** on the careers application. "Link to the work" has no "Optional"
  and a send checks it ("Add a link" / "Enter a valid link": interface wording, owner to confirm).
- **New arrangement: Lab band head beside body** (CopyBands `HEAD_BESIDE_PROSE`, 1 : 2 per
  content-section-head-beside-body). Fallback: plain C-text. A flat Sketch drawing for the Lab was not drawn.
- **New Layout option: `trail="until-md"`** (the last child spans every track below 768), used by Collage's
  lower row; specimen on /design/layout. Changes home's "The people behind Tcules" on phone the same way.
- **New variant: EnquiryForm role application** (`role` chips, `workLabel: null`), specimen on
  /design/enquiry-form. "Send application" is interface wording. "Apply for a role" would say it a third time.
  The link field is optional, as on every card, and there is no Name field: say if an application needs either.
  The form's accessible name is still "Send an enquiry".
- Applications post to `ENDPOINTS.enquiry`, told apart by the hidden context (family `careers`): fine for
  launch (owner, 4 Nov 2026).
- The success view says "Thanks. We have your enquiry." No application success words are authored. Content ask.
- `ai-fluency` ships with the labelled isometric placeholder (drawn by people). It is the page's one placeholder.
  On a phone the placeholder sits above the band's heading: ContentSection `media` puts the picture first below
  1024 on every B band (spec amendment 6 Oct, "the photo stays first in the DOM"). Not changed here, because it
  would move every B band on the site; say if a heading should lead on phones.
- `kinds:check` and `aria:check` need `next build`, which this run must not execute, so both are unverified here.
- og/twitter image: `IMAGE_ASSET_REQUIRED` in the copy.

## Fixed after the critic (4 Nov 2026, scored 6/10)
- "No matching role?" sat inside the blue island as a second lead → `APPLICATION_FORMS` careers set
  `lede: 'paragraphs'`, a silent exemption from close-footnote-under-island → the option is removed (no other
  caller); every enquiry close reads its band the same way, so the line is the footnote under the island. A lead
  with a link now keeps it live (`hasLink` → `renderInline`), so hello@ is still a mailto. Only /careers has a
  linked enquiry lead (checked across `_pages`).
- The roles band was the quietest on the page and led nowhere → open-roles rendered as quarter tiles with no
  action → `role-rows`: OfferSheet `rows`, glyph inline before each title (sheet-row-glyph-sits-inline), each
  title a link to `#apply` that picks its chip in the form (`choice` → `data-enquiry-role`, read by EnquiryForm).
  Checked in a browser: following "AI Systems Architect" checks that chip.
- "Link to the work" was marked Optional though the copy asks for it → the careers config reused the optional URL
  field → `urlRequired` on `ApplicationForm` and EnquiryForm: the link is a validating field like the email, on
  send only. Checked: a send with only an email lands on the link with "Add a link".
- The meta line broke at "In-/office" → one joined string in a narrow track → OfferSheet `facts`: a Cluster of
  whole facts, dots at each fact's end (EngagementOptions' convention), so a wrap falls between facts.
- The middle read as one grey idea, and the Lab paragraph hung in 60% of the width → each band took a text-led
  shape on its own, and the Lab had none → the roles now run full width as linked rows, and the Lab is set head
  beside body (`HEAD_BESIDE_PROSE`). No tint and no decoration added.
- The collage ran ~1,150 of photos on a phone → Collage's lower row collapsed to one track below 768 → the lower
  row stays two tracks (start beside the middle pair, the end frame across under them, Layout `trail`), the small
  frames 3:4 at every width. About 700 at 390, no photo hidden. Home's people band changes the same way on
  phones (shot, reads as one collage); 768 and up is unchanged.
- Skipped: the placeholder above the AI heading on phones (see Open: a site-wide ContentSection arrangement).
  Skipped nit: the placeholder label size and the "See how we use AI" position (the generator is shared by every
  placeholder; the media split places actions under the heading on every page by design).

## Pass 2, owner review 4 Nov 2026
main (home pass #219 and its 4 Nov rulings) was merged in first. Of those rulings only FAQ beside in halves
touches this page, and it renders (head in the start half, the accordion in the end half). Why Tcules, Three
ways and the industries pills are not bands on /careers. Nothing from the merge broke the page; 1440 and 390
shot with no overflow or page errors.

- **"Tcules jobs open now": "no underlines here please".** Cause: OfferSheet's linked title (`href`) was
  underlined at rest in the accent ink, so a row read as text holding an inline link, which is what the
  linked-card ruling (2026-10-16) forbids for a title. Fix, GLOBAL (OfferSheet, `.titleLink` + `.linked`,
  tokens `--ofs-title-link-shift/-duration/-easing`; `--ofs-title-link-rule/-offset` removed on every
  surface): no underline; the link's box is stretched over its whole item, so the glyph, meta line and row
  air are the target; hover and keyboard focus are one move (2026-10-19-hover-is-a-move): the title takes the
  accent ink and slides 4 along the reading direction on the owner's curve (360, ease), with no motion
  under reduced motion; the focus ring is drawn round the row. Link semantics and the role pick are
  unchanged. Checked in a browser: a click at the row's far end lands on the link and checks "AI Systems
  Architect"; hover ends at translateX(4); focus draws a 2 ring round the row. Other pages: no other
  corpus page renders an OfferSheet title link (every `_pages` route scanned). /clients' rows carry no
  link and are unchanged (shot). /design/offer-sheet's linked specimens (8c) take the same treatment.
- **"How AI fits into the job": "cta below the body?"** Cause: TextBand's two media branches (illustrated
  prose and a bound photo) passed the band's links as ContentSection's head `actions`, which a media split
  places under the heading, before the paragraphs; every other prose shape already set them as the band's
  `footer`. Fix, GLOBAL at the band mapping (CopyBands `TextBand`): a media prose band's links are its
  footer, after the body, unpinned (`pin: false`) so the link follows the last paragraph rather than
  dropping to the picture's bottom edge. ContentSection is unchanged: its head `actions` stay right for a
  head over tiles. Other pages: every `_pages` route scanned for a B band with a link; /careers' ai-fluency
  was the only one with its link before the body. The studio-photo prose bands (audits) already set the
  link after the words.

### Open (owner)
- The role rows have no rest cue now beyond the glyph and the section's sense; on a phone nothing says a
  row picks the role in the form below. The glossary's quiet end arrow (2026-11-04-term-rows-carry-an-end-
  arrow) is scoped to term rows and the 7 Oct "no arrow cue" holds elsewhere, so none was added. Say if the
  roles should carry it.
- A role row's meta line sits on the title's top edge, not its baseline (14 beside 20). Unchanged.

