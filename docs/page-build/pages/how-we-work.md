# /how-we-work, with /ai-native-product-design and /ai-transparency: shipped for now, 2 Nov 2026 (PR #190)

The owner: "the page needs improvement but PR for now". Next pass starts from the Open list below.

Composed from the library: OfferPage's plan, no new components.

## The narrative
The hero promises designers and engineers working closely with your team, the thinking in view, and the
people responsible for the result. The page is: how you can engage (three ways) → what working with us is
like (your team · you see the thinking · into working software · the understanding grows) → the practical
details → what clients say → FAQ → enquiry. The middle four are ONE story and share one register.

## Decisions
- Round 1 (owner review): engagement shapes are three sections, not three columns; the italic first line is
  the option's eyebrow; practical details are drawn, never an OfferSheet; one heading size down the page; every
  image rounded (decisions/2026-11-01-every-image-rounded).
- Engagement shapes → EngagementOptions `rows`: an option whose kind is named in an eyebrow and told in several
  paragraphs is a section. Scenes from the eyebrow: focused → feature, defined project → area, ongoing → embedded.
  "Start wherever the work is" + the Dealpath example are the terms row under the rows (`itemCoda`).
- The middle four → B media splits with an isometric illustration each (`ILLUSTRATED_PROSE`, plan.ts), alternating
  sides, 6:5 at the photo weight, head `lg`. The copy's bound studio photo, Benchmark prototype and Doodle model are
  NOT used here (owner: "illustrations here"). Slots in docs/image-register.md (`/_illustrations`).
- Practical details → EngagementOptions grid (kind `tiles`), as About's working terms: getting started → start,
  time zones → overlap, fees and notice → commercial, who decides / owns → empty plate.
- Heroes reuse /about studio photographs per route (`STUDIO_HERO`, images.ts).
- Media splits' heads take `lg` (the h2 role) everywhere on the composer, so a band with an image beside it no
  longer out-sizes the plain band next to it.

- Round 2–3 (owner): "How it works" / "Typical starting points" must read as blocks, and beautifully; the
  closing note "feels like floating text". EngagementOptions takes `facts`, set as a spec sheet: under one rule,
  a row a fact, the mono key in the 1 of [1, 2] tracks and the value beside it, keys aligned down the option.
  Starting points stay the authored sentence, links kept: splitting them into entries dropped the copy's own
  words ("a", "or"), which kinds:check rightly fails. - Round 4 (owner): the island was wrong: "there's an example in" and an example is evidence, not an ask; the
  grouping was wrong. The closing note is the set's `closing`: "Start wherever the work is" as an h3 sub-head
  with its sentence, then its proof as a case teaser under it: a horizontal BlockCard of the Dealpath case
  (its cover, "Example · Dealpath" as eyebrow, the case's own title, the example's words; the whole card the
  link, title cue). Claim, then proof, inside the band (`closingNote`, `CaseTeaser`). The paper-deep CaseCard
  stays home's.
- Round 5, tried and reverted: the claim and teaser as a band of their own on tint. Rejected because the copy
  ("Begin with any of the three…") refers to the options above; a separate band cuts the sentence off from what
  it points at. The claim is the set's conclusion, so it stays inside the set's band.

- Round 6 (owner picked, 1–2 Nov): the job is choosing, so the set compares: `compare` sets the options three
  across, then each fact as one ruled row, its key over the three values aligned under their option. Rows was
  shown beside it and set aside; rows stand in below 1024.

## The 3 Nov copy (2.60, 4 Nov 2026, local branch design/2-60-why-how, awaiting owner review)
Reordered: product knowledge first, engagement shapes, who you work with, design to working software, how we use
AI (new), the terms. `working-loop` cut. Engagement shapes lost their eyebrows and facts, so they render as the
three plated options. `ai-native-practice` joins the illustrated set (image end). Quotes sit under their claims;
the Doodle and Benchmark Gensuite examples are ClaimProof panels where the copy sets them. The terms' new titles
map to drawn scenes (decisions → `own`, no minimum term → `commercial`, handover → `getting-started`); "What we
make is yours" is an empty plate until 2.62 draws it.

### Owner review of the 3 Nov build (4 Nov 2026)
"All sections are just alternating image + text sections instead of being designed for the content." And on
product knowledge: "isn't this essentially the where to start section?" Each band now takes its content's shape:
- product-knowledge → home's where-to-start board (Gateway `board`, unlinked items: `href` is optional on a board
  item now). A new product → the `new-product` situation drawing, an established product → `product-modernisation`,
  a prototype → empty plate until drawn. The closing paragraph sits beside the Doodle example under the board.
- engagement-shapes → unchanged (three plated options).
- your-team → the bound studio photo as the 3:1 banner, the three claims three across under it, the JoVE quote
  under its claim. Reverses the 1 Nov "illustrations here" for this band, to be confirmed by the owner.
- design-to-release → the two claims as peers under the head, then the Benchmark Gensuite prototype capture beside
  its example. Also uses the bound asset in place of the illustration slot.
- ai-native-practice → the one illustrated split left (image end).

## Band → component (/how-we-work, 2 Nov)
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, studio photo (team), record figures | |
| client-recognition | recognition · LogoGrid (H) | |
| engagement-shapes | tiles · EngagementOptions `compare` (rows below 1024), eyebrows, scenes | facts as a spec sheet; closing: sub-head + Dealpath case teaser (horizontal BlockCard) |
| your-team | text · B + illustration, image start | |
| working-loop | text · B + illustration, image end | |
| design-to-release | text · B + illustration, image start | |
| product-knowledge | text · B + illustration, image end | |
| essentials | tiles · EngagementOptions grid, 4 across | who decides → `scope-own` (drawn 2 Nov: options meet at you, then handed over, designs and code) |
| testimonials | quotes · G | |
| enquiry, faq | L, D-faq | |

## Open
- The owner: the page still needs improvement (not itemised yet).
- Four illustrations to draw (register rows).
- ai-native and ai-transparency still run three to four prose bands in a row.
- Missing client marks (content-changes, "Client marks with no file").
