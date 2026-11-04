# /future-interfaces-lab/join — designed, branch design/careers-lab-matter (local), 4 Nov 2026

Tracker 2.35. Composed from the library through OfferPage's plan (`ROUTES.futureInterfacesLabJoin` was already
in `PASS_1_COMPOSED_ROUTES`). Copy: `_pages/future-interfaces-lab__join.md`, rendered as authored. Job of the
page: a final-year student, recent graduate or early-career builder decides whether to apply to a paid,
in-person fellowship in Ahmedabad: is it serious, do I fit, how does it run, then apply here. The application
is the page's one main action; "see work from an experiment" is a quiet side door for another reader.

## Decisions
- Hero: centred (`CENTRED_HERO_ROUTES`), the 73-character title ran to five display lines in the beside half
  column. The studio review photograph (`STUDIO_HERO`, `ABOUT_REVIEW`): a person presenting work to seated
  colleagues, which is what the copy describes (direct critique, weekly demos). The page binds no image of its
  own. "Apply to the Lab" is the one blue solid and lands on `#apply` (`withApplicationAnchor`, blocks.tsx:
  matched by destination, the copy's Google Form link, never by words). The italic eyebrow is not shown under
  the breadcrumb, as on every corpus hero.
- `why-join`: the offer sheet, NEW glyph-headed grid (OfferSheet `icon` on a grid; OfferBands
  `SHEET_GLYPHS`): five abstract qualities, so an icon is the honest visual. Glyph (24, accent), title, body
  (14), each on its own row (icon-heads-its-card); no hairline, no blue mark, no card, no disc
  (marker-cell-is-for-figures). 3 + 2 from 1024, two from 768, one below; rows a `column` apart. Glyphs by
  title: clock-circle, chat-round-dots, monitor, users-group-rounded, layers.
- `who-we-are-looking-for`: the drawn offer sheet across 3, three peers at equal weight, each a NEW still flat
  drawing on the dotted plate (components/Sketch/wyg-future-interfaces-lab-join.tsx): AI systems builders, a
  chain from a data store through an agent (lit) to the running tool; product experience designers, one
  interface in three states, the sheet rising, the last state lit; growth and brand operators, one product
  routed out to three channels, the growing one lit.
- `what-youll-gain`: the offer sheet's glyph-headed grid at two tracks, no hairline (was `rows`; see "Fixed
  after the critic"): code-square, compass. Two equal peers between the drawn roles and the ruled method.
- `what-youll-do`: kind `method` (was `outcomes`), MethodBand (F): five numbered steps beside ONE new flat
  figure, a pod of three marks (design, engineering, go-to-market) joined on one build, the build shipped (lit)
  and a review loop back under it. MethodBand now reads `###` steps (cause fix, below).
- `apply`: kind `enquiry` (shape rule: an `apply` band with `###` steps), the blue island in halves, no drawing,
  the flow field. Start half: the h2, "Applications for the next cohort are now open." as the lead, the three
  steps as numbered points. End half: the card form in its NEW application wording (`APPLICATION_FORMS`,
  blocks.tsx): Email; "Your background and why you want to build in FIL"; "Links to your proof-of-work"
  (optional, as every enquiry's link); submit "Apply to the Lab" (the band's own link words); "or write to
  fil@tcules.com" (the copy's `enquiry_contact`); no reply promise (none authored). The success view repeats
  the three steps. Hidden context: placement `application`, family `future-interfaces-lab`. The italic
  "FIL is a selective fellowship…" is the footnote under the island with the info mark. Already before the FAQ.
- `frequently-asked-questions`: D-faq; "Still got questions? Drop us a note: fil@tcules.com." is now the band's
  closing line, centred under the accordion (cause fix, below).
- `artefact-access`: the ink island (`open`, turbulent field), its sentence whole as the lede, one LINK action
  "Contact page →" to /contact (the first link's words, first letter raised): both its links go to /contact.
  Opted in (`ISLAND_CLOSES`, plan.ts). It follows the FAQ, so no text-heavy pair, and the FAQ sits between it
  and the blue island.

## Cause fixes (shared code; every other page checked)
- **MethodBand read no `###` steps**: a step authored as a `###` item rendered no steps at all. It now reads
  each item as a step (heading the title, paragraphs the body). Census: no other method band has items.
- **The FAQ's closing line was inside the last answer**: shown only once "Is failure viewed negatively…" was
  opened. `faqClosing` (blocks.tsx): a last answer of more than one paragraph ending on a paragraph whose only
  link is a `mailto:` gives that paragraph to the band's foot. Census: only this page has one.
- **An enquiry band's lone link was dropped**: a paragraph or links row that is only a link became an empty
  contact cell. It is now the form's submit label when the conversion authors none.
- **The footnote glyph was always a shield**: chosen by its words now, shield-check for an NDA or
  confidentiality line (/contact unchanged, checked), info-circle otherwise.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero centred, ABOUT_REVIEW | ask → `#apply` |
| why-join | set · offer-sheet, glyph grid (NEW) | 3 + 2 |
| who-we-are-looking-for | set · offer-sheet, drawn across 3 | three new drawings |
| what-youll-gain | set · offer-sheet, glyph grid at 2 | critic fix |
| what-youll-do | method · F, steps beside one flat figure | new drawing |
| apply | enquiry · L, blue island halves, application wording (NEW) | before the FAQ |
| frequently-asked-questions | faq · D-faq, closing line under it | |
| artefact-access | close · L, ink island, link action (NEW opt-in) | |

Rhythm at a squint: a centred title over one wide studio photograph; five glyph-headed items, 3 + 2; three
dotted plates in a row; two glyph-headed peers; numbered steps beside a plate; the blue island with the form; the
centred accordion; the dark island. Registers: photo, none (icons), flat, none (icons), flat, island, none, island. No
tint, no text-heavy pair; blue and ink islands do not touch.

## Content mapping
- No copy changed. The hero's and the band's "[Apply to the Lab](forms.gle…)" keep their words; the hero's
  points at `#apply`, the band's is the form's submit. The Google Form (`primary_action`) is no longer linked
  from the page (owner, 4 Nov 2026: apply on the page).
- The textarea label joins two phrases of the copy's own sentence ("your background … and why you want to build
  in FIL"). The strict alternative is "Why you want to build in FIL".
- The artefact island's action label is "contact page" with its first letter raised; both of the lede's links
  stay live as authored.

## Open
- **New variant: OfferSheet glyph-headed grid** (`why-join`), specimen 8 on /design/offer-sheet. Owner to confirm.
- **New arrangement: the glyph-headed grid at two tracks** (`what-youll-gain`, critic fix). Owner to confirm.
- **New arrangement: unnumbered island points** (CtaSection `markers="plain"` for an enquiry island's steps). Owner
  to confirm.
- **New variant: EnquiryForm application wording** (`EnquiryWorkLabel`, the "Links to your proof-of-work" URL
  label, `APPLICATION_FORMS`), specimen on /design/enquiry-form. Owner to confirm; also the textarea wording
  above. The card has no Name field (the enquiry card never had one) and the proof-of-work link is optional, as
  the card's link always is: owner to say if an application needs a name or a required link. The form's
  accessible name is now its ask, "Apply to the Lab" (fixed after the critic).
- **New arrangement: a close whose links share one destination as the ink island** (`ISLAND_CLOSES`, opt-in).
  Ruled for every such close it would also turn /how-we-work/ai-native-product-design's `your-rules`, the
  /insights hubs' `talk` bands and /careers' `apply` into islands: owner to decide.
- **`apply` → enquiry is a shape rule** (`###` steps): /careers' "Apply for a role" (two plain paragraphs, an
  email line) stays a close, untouched, for its own designer. To take the owner's 4 Nov answer there too it
  needs an `APPLICATION_FORMS` entry and order.ts to move it before its FAQ.
- **BLOCKING for launch (owner/ops):** applications post to `ENDPOINTS.enquiry`. Whether that endpoint may take
  FIL applications, and who receives them (the copy lists FORM_ENDPOINT_VERIFICATION and
  APPLICATION_STATE_REVERIFY).
- The success view's heading is the form's default ("Thanks. We have your enquiry."): no application success
  words are authored. Content ask.
- The frontmatter's `secondary_form` (artefact_access_request) is not rendered: the body sends the reader to
  the contact page, and the body is what renders.
- Four drawings were drawn and checked by eye at 3x in this run; the blind `flat-drawings-pages` critic was not
  run, so a blind check is still owed. They are not on /design/sketch, so `sketch:frames` cannot reach them.
- The hero photograph is capped at 860 by PageHero's centred media (the treatment rule says a photograph is not
  capped; nothing in the component distinguishes the two). It reads well at 860; owner to say.
- ABOUT_REVIEW is also the hero of /clients and /how-we-work/ai-transparency; /careers should not take it too.
- og/twitter image: the copy points at the generic company card.

## Fixed after the critic (7/10, 4 Nov 2026)
- **"What you leave the fellowship with" and the method read as one long ruled list** → the kind mapping sent
  the two payoffs to OfferSheet `rows`, the same hairline register as the method's steps under it → `SHEET_GLYPHS`
  (OfferBands) now sets them as the glyph-headed `grid` at two tracks, no hairlines (acrossFor(2) = 2). Keyed by
  band id, which only this page carries, so /clients' rows are unchanged. **New arrangement for the owner:** the
  glyph grid at two (Open).
- **Mismatched glyph weight** → `checklist` is nearly all stroke even in its Bold cut → "Stronger product
  judgement" takes `compass` (a filled disc, the code square's mass; the idea is direction, deciding).
- **The island's steps restarted 01 a screen after the method's 01–05** → EnquiryBand passed the band's `###`
  steps to CtaSection with the default numeric markers → an enquiry island's points are now `markers="plain"`
  (bold label, detail under it), leaving the page's numbered sequence to the method. Only this island carries
  points (census), so no other page changes. The success view still lists them as what happens next.
- **The form's accessible name was "Send an enquiry"** → EnquiryForm hard-coded its aria-label → EnquiryForm
  takes `label`, and `corpusEnquiryForm` passes an application's own ask (the submit words, else the band
  heading). /join: "Apply to the Lab"; /careers: "Send application" (checked; right for it too); every enquiry
  form keeps "Send an enquiry" (/, /contact checked).
- **Nit, "contact Tcules" lost its link** → the single-destination island close set its lede as plain text →
  the lede now renders its runs, both authored links live; the action stays "Contact page →". Only this close
  is opted in (`ISLAND_CLOSES`).
- **Not taken:** the critic's "titles a step up" for the pair. decisions/2026-10-11-item-titles-two-steps-under-heading
  holds item titles at h4 under an h2; the pair stays h4. Its weight comes from the two-track grid and the glyphs.
- **Not taken (nit):** align the method figure to the top of the steps. MethodBand centring a flat figure beside its
  steps is the approved method form (owner, 30 Oct 2026) on every method page; changing the default changes all of
  them. Owner to say if the figure should top-align.
- **Not taken (nit):** centre the crumb trail at 390 and carry the separator with the next crumb. PageHero already
  centres the trail's row; the left-aligned wrap and the divider after each crumb are Breadcrumbs' spec
  (docs/specs/Breadcrumbs.md). A spec change for the owner, across every centred hero.
