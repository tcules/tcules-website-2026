# Content proposals — `_pages` corpus

**Purpose.** Where the design and the copy disagree, the copy wins and the design adapts: the content
team sets the narrative, so nothing in `_pages/` is reworded, trimmed, paraphrased or reordered
during the build. Splitting a band into two sections and changing how an item is _shown_ (a table as
cards, a case list as case cards, "Related services" as chips) are design decisions and need no
proposal. A proposal is for the other kind of problem: content that pulls the design down because it
is too long, carries too much in one place, or has an awkward shape.

Each one is a suggestion for the content team. Nothing here has been applied.

**Scope: the 26 Oct 2026 copy.** The file began on 10 Oct with the first `_pages` batch. On 2 Nov 2026
every proposal was checked against the 26 Oct copy, and the ones it had already settled or replaced
were removed: P2–P14, P16, P17, P19–P23, P26, P28, P29, P35, P37, P39, P42, P44, P46–P48. They are
in git history (`git show 1caa78a9:docs/content-proposals.md`). The rest keep their numbers, so
references in code and other docs still resolve, and their evidence now quotes the 26 Oct copy.
Words the build adds around the copy are logged in `docs/content-changes.md`.

## Entry format

Append one entry per problem, newest last, numbered from P52.

```
### <page route> · <band id> · <short title>

- **Problem:** what the content does to the design, concretely (length, density, shape).
- **Proposal:** the specific change, in words the content team can act on.
- **Why:** what it buys, and what the design does in the meantime (the copy renders as written).
```

## Proposals

### P1 · heroes with a trail · eyebrow · authored, never shown

- **Pages, for example:** `/services/product-design` "Product Design services";
  `/expertise/healthtech` "Expertise · HealthTech product design"; `/case-studies` "Case studies";
  `/about` "About Tcules · Product design studio in Ahmedabad, India"; the glossary terms
  ("Glossary · Design System" and six more).
- **Problem:** PageHero renders no text eyebrow when the hero carries a trail (owner, 11 Oct 2026:
  "lets not put anything in the eyebrow since the breadcrumb already tells the page location"). The
  26 Oct copy still authors the `*…*` eyebrow line on these heroes, so the source holds words the
  page drops.
- **Proposal:** delete the eyebrow line from every hero that has a `navigation.breadcrumb` of two or
  more crumbs. Home has no trail and keeps its eyebrow.
- **Why:** the source should say what the page shows, so nobody looks for a line that never renders.

### P15 · `/case-studies` · hero · the action competes with the index

- **Problem:** the hero's action "Tell us about your product" renders as the page's blue solid, so
  the first action a visitor sees asks them to leave the cases. It renders as written.
- **Proposal:** drop the hero action. The enquiry close at the end of the page carries the same ask.
- **Why:** the index's job is to get a case read. The ask belongs after the evidence.

### P18 · `/audits/design-to-code-audit` · deliverables · a run-in label that ends in a comma

- **Problem:** "**Every difference we found,** shown against the approved design, with its type and
  cause." When the items show as cards, the bold run becomes the title and the rest the body, so the
  title ends in a comma and the body starts lower-case mid-sentence. Rendered as written.
- **Proposal:** write the item as a short title plus a full sentence, as the copy's other labelled
  sets do ("**Every difference we found.** Shown against the approved design, with its type and
  cause.").
- **Why:** the set then matches every other card set on the site.

### P24 · `/case-studies/benchmark-gensuite-…` · the argument sections · navigation labels for the outline

- **Problem:** the case's table of contents takes each section heading as its label, and the 26 Oct
  headings are long ("What prospects and existing customers each needed from the modernised suite",
  "Enterprise suite modernisation: four jobs to separate before you start"). The rail is narrow, so
  each label clamps and its tail is cut.
- **Proposal:** add a short `navigation_label` (two to four words) to every long-form section: "The
  constraint", "The scope selector", "Three needs", "Built in code", "Where it stands", "What to take
  from it". The heading on the page stays as written.
- **Why:** an outline is a map, and a label cut mid-clause stops being one. Every case, article and
  glossary term on the long-form template meets the same clamp, so the field is a corpus-wide ask.

### P25 · `/case-studies/benchmark-gensuite-…` · related · two cases cited by a link line alone

- **Problem:** `related` carries "[Read the Gold Image Printing case]" and "[Read the Dealpath case]"
  under one shared sentence, and no words about either case. The cards take their titles from each
  case's own h1, a headline written for that page, and carry no body.
- **Proposal:** a one-sentence teaser under each link, saying what that case shares with this one.
- **Why:** a reader choosing the next case needs the connection, and the band's lead says it only for
  both at once.

### P27 · corpus-wide · straight quote marks (with P31 and P45)

- **Problem:** quotations are typed with straight marks ("). 29 `_pages` files carry at least one,
  for example the Benchmark hero ("…put it: \"For established users, familiarity and consistency…\"")
  and the engineering stakeholder's question ("asked: \"I was curious…\""). Set at large sizes beside
  the serif, a straight mark reads as a typing slip. Other pages already use typographic marks, so the
  copy is inconsistent.
- **Proposal:** one corpus-wide sweep to typographic marks (“ ” and ’). No word changes.
- **Why:** the page renders the authored characters, so the fix belongs in the copy, and one sweep
  catches every page.

### P30 · `/about` · work you can inspect · sentences that continue after a link

- **Problem:** "[Doodle](…) shows research changing the product model behind enterprise scheduling."
  The name is the card's title and what follows starts lower-case, so the body reads as half a
  sentence under its own title. Same family as P18.
- **Proposal:** write each body as a sentence that stands alone ("Doodle's research changed the
  product model behind enterprise scheduling.").
- **Why:** a card body is read on its own. Rendered as written, lower-case, in the meantime.

### P32 · `/insights/cpq-ux-design` · decide-which-kind-of-quote-you-are-designing-for · the comparison table has an empty first header

- **Problem:** the header row is `|  | Rep-assembled quote | Expert-assembled quote |`, with nothing
  in its first cell, so a screen reader has nothing to announce for the row labels.
- **Proposal:** give the key column a word, such as "Aspect" or "Question", the way the page's
  checklist table names its first column "Question".
- **Why:** every row header gets a column to belong to, and both tables on the page share one shape.

### P33 · every page with the record line · the record, as figures (with P38)

- **Problem:** "Founded 2017 · More than 90 projects · Clients in 19 countries · Studio in Ahmedabad,
  India" is set as three figures under the hero: **2017** / Founded, **90+** / Projects, **19** /
  Countries with clients (`RECORD_FORMS`, `src/lib/studio-record.ts`). The place is not a measure and
  is not shown. The content team has not seen these forms.
- **Proposal:** confirm the three forms, or author the record as value-and-label pairs in the
  frontmatter so the page never splits a sentence. If "90+" overstates "more than 90" for legal
  review, give the exact count. Drop "Studio in Ahmedabad, India" from the record line, or move it to
  the lede, which already names Ahmedabad on About.
- **Why:** figures are scanned, not read; short values and labels let them sit in one row at 1440 and
  two by two at 390.

### P34 · every page · quotes shown together · keep their lengths within a band

- **Problem:** the design sets quotes as peers (a pair, a banner side, a wall), and peers are read as
  one shape. A quote twice the length of its neighbour leaves one side half empty or a column
  ragged. The group absorbs moderate differences, not a factor of two.
- **Proposal:** quotes chosen for one band fall within **±25% of the set's median length**, and
  within the range for their placement:

  | Placement | Words per quote |
  | --- | --- |
  | One quote alone (centred typographic band, or beside a portrait) | 20–35 |
  | A banner side (beside a reason, a case, a figure) | 18–30 |
  | Peers: a pair or a group of three | 18–30, each within ±25% of the others |
  | A wall of four to six | 18–30; the longest no more than 1.5× the shortest |
  | Inside a reading flow (an article, a case story) | ≤ 30 |

  Ask for a shorter approved excerpt at each quote's sign-off where one runs over.
- **Why:** a quote is evidence in the client's words and is never cut by the design; the length has
  to be chosen with the client. The quotes render in full meanwhile.

### P36 · every page with testimonials · star ratings · placeholders, to be replaced before launch

- **Problem:** testimonials render as rated cards, and the ratings in
  `src/content/sources/fixtures/testimonial-ratings.ts` were chosen to fill the owner's brief (4 to 5,
  in half steps); none was read off a review. A star rating beside a named client's words is a claim
  about what that client said.
- **Proposal:** before launch, replace each placeholder with that review's own published rating,
  keyed by the testimonial id. A quote whose source has no rating ships with no stars. Add `rating`
  (and its source) to the testimonial record (docs/strapi-changes.md § 18).
- **Why:** the stars are evidence, and evidence has a source. Every placeholder carries
  `placeholder: true`, so a launch check can list what is left.

### P40 · every testimonial card · the avatars are stock portraits, not the speakers

- **Problem:** cards with an avatar show a stock studio portrait from the kit registry
  (`src/content/sources/fixtures/testimonial-avatars.ts`, every entry `placeholder: true`); none shows
  the named person.
- **Proposal:** before launch, replace each with the speaker's own photograph, supplied with consent
  and shot square, or remove it. Add `portrait` to the testimonial record (docs/strapi-changes.md § 19).
- **Why:** a face beside a named client's words is a claim about who said them.

### P41 · `/` and `/case-studies` · client-recognition · the logo wall and the named clients differ

- **Problem:** the 26 Oct copy names five clients in the band: Doodle, Dealpath, Benchmark Gensuite,
  Eden AI and ConnectX. The wall shows the logo files the studio holds: Doodle and Eden AI plus the
  approved in-house set (Omny, LatitudePay, Quoter, Knovos, SafeXpay, Pledge, GT Tools, Incluude). So
  named clients are missing from the wall and unnamed ones are on it.
- **Proposal:** either list the wall's clients in the copy so the source says what the page shows,
  or supply the missing logos (docs/image-register.md) and choose which the wall shows.
- **Why:** the wall is a proof claim; its members should be the content team's decision.

### P43 · every built page · case mentions · cases with no page

- **Problem:** two clients the pages present as case work have no case page: **CuramCare** (the
  case index lists it as "Case study coming soon") and **Vovisto**. Their mentions link to
  placeholder anchors on `/case-studies`, flagged in `CASE_STUDY_PLACEHOLDERS` (`src/lib/routes.ts`).
- **Proposal:** publish the two cases, or confirm they never will and the mentions stay unlinked. When
  one publishes, move its name from `CASE_STUDY_PLACEHOLDERS` to `CASE_STUDY_SLUGS`.
- **Why:** every case mention is linked (owner); a placeholder link must not ship.

### P49 · `/` · product-situations · an eyebrow for the gateway

- **Proposed:** the band carries the eyebrow **"Where to start"** above its heading ("Start where your
  product is: brand new, or already in use"). The copy authors no eyebrow on this band.
- **Why:** the owner asked for the head to be centred with an eyebrow (19 Oct 2026). The eyebrow
  names the band's job, not a location.
- **On home:** a PROPOSED value (`src/content/sources/fixtures/proposed-eyebrows.ts`), read through
  `getProposedEyebrows`; it goes when the content team decides.

### P50 · `/case-studies` · an industry for every case, for the BY INDUSTRY view

- **Proposed:** each case is filed under ONE sector for the **By industry** view:

  | Sector | Cases |
  |---|---|
  | B2B SaaS and workflow software | Doodle, Scissors |
  | AI products and developer tools | Eden AI, Novus Insights |
  | Commerce | GT Tools, Gold Image Printing, The Chain Hut |
  | MarTech and SalesTech | Auxentios, Omny AI, Ryzeo |
  | FinTech | OctiFi, Kirana store payments |
  | PropTech and field operations | Dealpath, BuildTwin |
  | Climate and energy | ConnectX, Benchmark Gensuite |
  | EdTech | The Wandering Raven |

- **Why:** the owner asked for the cases to be browsable by industry (19 Oct 2026). The copy authors
  no industry for a case, so the filing is read off the expertise pages. The content team should
  confirm or re-file, and name the sectors as they want them read.
- **On the page:** a PROPOSED value (`src/content/sources/fixtures/case-industries.ts`), read through
  `getCaseIndustries`. The CMS field that retires the file is `industry` on the case record
  (docs/strapi-changes.md § 5).

### P51 · `/case-studies` · a stage for every case, for the BY STAGE view (the default)

- **Proposed:** the case index opens **By stage**; **By industry** is the second view (owner, 22 Oct
  2026). Each case is filed under ONE stage, where the client's product stood when the work began.
  The stages and the filing are PLACEHOLDERS until the owner names them:

  | Stage | Cases |
  |---|---|
  | Zero to one | Auxentios, ConnectX, Novus Insights, OctiFi, Kirana store payments, BuildTwin |
  | Finding fit | Eden AI, Omny AI, Ryzeo, Scissors, GT Tools, The Wandering Raven |
  | Scaling | Doodle, Dealpath, Benchmark Gensuite, Gold Image Printing, The Chain Hut |

- **Why:** a founder at 0–1 finds work from a product like theirs first (Jatin review, 22 Oct 2026).
- **On the page:** a PLACEHOLDER value (`src/content/sources/fixtures/case-stages.ts`), read through
  `getCaseStages`. The CMS field that retires the file is `stage` on the case record
  (docs/strapi-changes.md § 21). The copy's own bands still collect the cases, but their headings no
  longer appear on the page.

### /tools/* — outline markers and the record builder (4 Nov 2026)

- **Proposed:** short outline markers (two to four words) for every section of the six tool pages, in
  each page's `navigation.section_labels` ("Who it suits", "Worked example", "Seven parts", "FAQs" …).
  Navigation only: every heading stays as authored. For the content team to confirm or reword.
- **Owner decision needed before approval:** the tool pages promise an interactive tool ("Use the
  checklist", "Download the record", FAQs: "You type your answers into the page and download the result
  as a brief"; the hub's "Try the tool"), but the page renders the authored table as a static
  worksheet. Either build the record builder (inputs on the table's rows, then a download), or the
  content team proposes copy for a static launch here. The copy is not edited until one is chosen.
