# Image register — `_pages` corpus

Every image slot the first-pass pages need that the frontmatter does **not** already bind. A
`media_bindings` entry with `status: BOUND_EXISTING_PUBLIC_ASSET` and an `asset_uri` is used as is
and does not appear here. Anything else gets a labelled placeholder in the page and a row below, so
the asset list is generated from the design rather than guessed. No image is generated in this pass.

Started 10 Oct 2026. Briefs and generation happen later.

## Columns

| Column        | Meaning                                                              |
| ------------- | -------------------------------------------------------------------- |
| Page          | Route the slot is on (`/services/product-design`).                   |
| Band          | Band id the image sits in or beside.                                 |
| Kind          | `illustration`, `product shot`, `studio photo`, `icon` or `diagram`. |
| What it shows | The subject, in one sentence. Concept first, not style.              |
| Ratio         | The frame the design reserves, e.g. `16:9`, `4:3`, `1:1`.            |

## Register

| Page | Band | Kind | What it shows | Ratio |
| ---- | ---- | ---- | ------------- | ----- |
| `/_unregistered` | slot | studio photo | FALLBACK, not a slot: what a page shows where its copy (26 Oct 2026) needs an image this register has no row for yet. `placeholderImage` warns in development for each one; give each its own row. | 3:2 |
| `/_illustrations` | illustration: pending | illustration | FALLBACK, not a slot: a claim or reason whose isometric illustration is not drawn yet and has no row of its own. | 6:5 |
| `/_illustrations` | illustration: Keeping teams on the system after launch. | illustration | A design system in its second year, still owned and still changing, with teams drawing from it instead of keeping local copies. | 6:5 |
| `/_illustrations` | illustration: Rules that people and AI coding tools can follow. | illustration | One rule named by its meaning, read the same way by a designer in Figma and by an AI coding tool writing the code. | 6:5 |
| `/_illustrations` | illustration: What customers do without looking. | illustration | The habits long-time customers work from (the shortcut, the saved filter, the Monday report) recorded and kept in place while the screen around them changes. | 6:5 |
| `/_illustrations` | illustration: Work that happens outside the product. | illustration | A detail entered once in the redesigned record appears wherever it is needed next, in place of the retyping and spreadsheets that carried it outside the product. | 6:5 |
| `/_illustrations` | illustration: What the business needs next. | illustration | The first move chosen underneath the product: the change that what customers use most depends on. | 6:5 |
| `/_illustrations` | illustration: We know what to leave alone in a product people rely on. | illustration | Almost all of a working product kept as it is, with one part changed. | 6:5 |
| `/_illustrations` | illustration: One studio can take it into working software, with the designers staying in the build. | illustration | The design carried on into working software, with the designers' place inside the build. | 6:5 |
| `/_illustrations` | illustration: We design AI that people can check and correct. | illustration | An AI answer stopping at a person to be checked and corrected before it counts. | 6:5 |
| `/_illustrations` | illustration: We tell you what is really wrong. | illustration | The problems on a screen traced down to the one cause underneath them. | 6:5 |
| `/` | hero | illustration | The product-decision survival model (`visual_plan`): how one consequential product decision survives from research, through design and coded prototype, into shipped software, with one Tcules practice carrying it across every step. | 5:4 |
| `/` | client-recognition | icon | **Client logo SVG needed** for Dealpath, Benchmark Gensuite, JoVE and Ringier Media Switzerland. Home round 3 (11 Oct 2026): the logo wall shows real files only, no typeset wordmarks — Doodle's SVG and Eden AI's trimmed PNG (`public/clients/eden-ai.png`, copied from the previous site; an SVG is still wanted) lead, then the in-house set (Omny, LatitudePay, Quoter, Knovos, SafeXpay, Pledge, GT Tools, Incluude). Each missing client joins the wall when its file arrives. Supply the client's own published SVG, never a redraw, with its viewBox and measured density (`node scripts/client-mark-density.mjs`). | intrinsic (logo cell) |
| `/` | ai-native-practice | studio photo | Tcules designers and engineers using AI in their own work (exploring options, prototyping in code, checking a build against the design), with a person making the call. | 3:2 |
| `/` | why-tcules (We get to the real problem first) | studio photo | A Tcules designer with a client team at a wall of the client's own requests for new screens, tracing several of them back to the one problem underneath. Home round 3: one beside banner per reason (kit I.3/I.4), the photograph in 7 of [5, 7] at 3:2 (667 × 445 at 1440). | 3:2 |
| `/` | why-tcules (We like software with a lot going on) | studio photo | Designers mapping a product with many roles, permissions, approvals and exceptions onto one shared workflow at a wall: the busy model made legible. Home round 3, beside banner (photo at the start). | 3:2 |
| `/` | why-tcules (We can build what we design) | product shot | The Wandering Raven's creative-writing world for young learners, built inside Moodle: a learner's screen mid-story, the reason shown as working software. The case page binds no cover yet (`ASSET_REQUIRED`); its first approved screen replaces this panel. Home round 3, beside banner; 3:2 (it was 2:1 in the round 2 claim row). | 3:2 |
| `/` | why-tcules (We work as part of your team) | studio photo | A Tcules designer inside a client's own tools and meeting rhythm, beside the client's product team, talking directly with them. Home round 3, beside banner (photo at the start). | 3:2 |
| `/about` | hero | studio photo | The Tcules team in the Ahmedabad studio working through one client's product together, designers and engineers at the same wall and screen: the studio, its people and its practice in one frame. High-traffic page, hero image always (owner, 29 Oct 2026). | 5:4 |
| `/services/design-systems` | hero | illustration | One set of parts serving every team: a single library of components, in Figma and in code, feeding several product screens built by different teams that all match, with the rules for using and changing the parts beside it. High-traffic page, hero image always (owner, 29 Oct 2026). | 5:4 |
| `/services/design-engineering` | hero | illustration | One interaction carried from the first prototype to production by designers who code: the prototype in a browser, the build question raised while it is cheap to change, and the released screen behaving as designed down to the keyboard and the loading state. High-traffic page, hero image always (owner, 29 Oct 2026). | 5:4 |
| `/services/ai-product-ux` | hero | illustration | An AI feature people can check, correct and undo: the AI's suggestion held apart from the user's own work, the evidence behind it shown, and a person editing or undoing it before it is accepted. High-traffic page, hero image always (owner, 29 Oct 2026). | 5:4 |
| `/services/product-modernisation` | hero | illustration | An established product changed part by part while customers keep working: the familiar product still running, one part at a time replaced by its new version, nobody's work interrupted. High-traffic page, hero image always (owner, 29 Oct 2026). | 5:4 |
| `/services/software-development` | hero | illustration | One product built from launch day to the tenth release: frontend, backend, integrations, AI features and the mobile app as one system, built from the studio's own design and readable by the engineers who extend it. High-traffic page, hero image always (owner, 29 Oct 2026). | 5:4 |
| `/services/new-product-design-first-release` | hero | illustration | What the first release must do, and what it leaves out: the few jobs the first paying customer needs carried into the release, the rest set aside for the second, then designed, built and launched. High-traffic page, hero image always (owner, 29 Oct 2026). | 5:4 |
| `/services/product-design` | hero | illustration | Uncertainty mapped to the design medium that resolves it (research, workflow, interface, prototype, code), with Doodle, Dealpath, Eden AI, Auxentios and Scissors pinned where their work sat (`visual_plan`). Replaces the interim service-line illustration. | 5:4 |
| `/audits/design-to-code-audit` | hero | illustration | One component followed from intent through the design system, implementation and runtime to acceptance (`visual_plan`), with the point where a gap enters marked and traced back to its cause. | 5:4 |
| `/insights` | lab | illustration | Lab illustration: experiments becoming product — a few experiments on the bench, the one that works carried into a product people use, the Future Interfaces Lab's argument. Drawn for an ink band (ch05 illustration rules: faces left toward the copy, the concept from the band's argument, three or more varied layers, exact anchoring, no type). Owner, 13 Oct 2026: commissioned later; a placeholder holds the slot. | 16:9 |
| `/audits/design-to-code-audit` | deliverables | product shot | The audit's difference record: a shipped screen beside the approved design, each gap tagged by type (defect, missing state, adaptation, system gap, sign-off gap) and cause. | 4:5 |
| `/audits/design-to-code-audit` | why-tcules | studio photo | A Tcules design engineer with the Figma file and the repository open together, following a gap back to where it started. | 6:5 |
| `/expertise/healthtech` | hero | illustration | Patient, clinician, carer, healthcare professional and operations team each seeing their own view of one shared case, with records and bookings arriving from connected systems and specialist rules framing what each may see (`signature_model`). | 5:4 |
| `/expertise/healthtech` | approach | studio photo | A researcher running a usability session with a nurse on a real task, on the device the nurse actually uses. **Unused from 11 Oct 2026:** the approach band became one OfferSheet of five principles three across (owner: the photo split read as two sections), so it takes no photograph. Keep the brief for a future placement. | 4:5 |
| `/expertise/healthtech` | proof (CuramCare) | product shot | CuramCare: a family member and a carer each seeing their own part of the same care arrangement, across the web platform and the two apps (frontmatter `healthtech_asset`; approved screen required). The frontmatter asks for one screen (`healthtech_asset`, CuramCare or Vovisto); if only one is approved it goes in the CuramCare slot and the Vovisto band drops its media. Home round 3 critic (11 Oct 2026): 16:9, not 4:5 — the slot renders in the featured-case BlockCard, whose one crop is 16:9, and a 4:5 panel cut to 16:9 lost its label mid-sentence. | 16:9 |
| `/expertise/healthtech` | proof (Vovisto) | product shot | Vovisto: a travel coordinator's view and a healthcare professional's portal view of the same congress trip (budget, approval, flights, hotel). Approved screen required. The frontmatter asks for one screen (`healthtech_asset`, CuramCare or Vovisto); if only one is approved it goes in the CuramCare slot and the Vovisto band drops its media. Owner, 11 Oct 2026: Vovisto is a case, so it renders as a horizontal case card, whose crop is 16:9. | 16:9 |
| `/expertise/healthtech` | why-tcules (Requirements settled while they are cheap to change) | studio photo | A Tcules designer walking a client's team through a flow on screen, the client pointing at an open question while it is still cheap to change. Beside banner (11 Oct 2026, the home "why" pattern); the first reason uses the bound studio photograph. | 3:2 |
| `/tools/design-system-drift-checker` | how-to-use-it | product shot | The Drift Checker record builder mid-trace: one select field recorded across Figma, Storybook and the shipped product, each finding marked aligned, difference found, unknown or intentional exception (`v11_tool_interface`). | 6:5 |
| `/insights/cpq-ux-design` | the-quote-is-the-shared-object | diagram | The responsibility map: six roles (sales representative, sales manager, product, pricing, solution and maintenance experts) contributing to one quotation, with where information changes and where a hand-off or exit sits. | 16:9 |
| `/insights/cpq-ux-design` | design-for-the-revision-not-the-first-draft | diagram | Two versions of one quote side by side: the lines that changed marked, the one change that moved the price called out, and which version the customer saw. Added in the critic pass. | 16:9 |
| `/about` | studio (split from the hero) | studio photo | Product Design at the centre of the studio: Tcules designers and engineers modelling a product together at a wall in the Ahmedabad studio. Added in the critic pass; 6:5 since the B3 critic pass (photo-weighted split: three short paragraphs beside it). | 6:5 |
| `/about` | leadership (Jatin Leuva) | studio photo | Jatin Leuva in the Ahmedabad studio, at work with the team rather than posed against a backdrop. About (12 Oct 2026): a ProfileCard portrait, square, the face centred a little above the middle. | 1:1 |
| `/about` | leadership (Rakesh Chitroda) | studio photo | Rakesh Chitroda in the Ahmedabad studio, in conversation with a client or the team. ProfileCard portrait, as Jatin's. | 1:1 |
| `/about` | careers | studio photo | Designers and engineers at work together in the Ahmedabad studio, critiquing one piece of work, framed wide enough to read as the whole studio. Banner `below`, added in the critic pass. | 3:1 |
| `/case-studies` (new-products); `/services/product-design` (complex-products) | case cover: Auxentios | product shot | Auxentios' industrial quoting product: one shared quoting workflow where six specialist roles contribute to the same quote. | 16:9 master |
| `/case-studies` (new-products) | case cover: Novus Insights | product shot | Novus Insights' survey tool: an AI-suggested starting questionnaire with the researcher editing and deciding. | 16:9 master |
| `/case-studies` (new-products) | case cover: Kirana store payments | product shot | The small-shop payment app shaped by twenty merchant interviews (client name withheld: no client marks). | 16:9 master |
| `/case-studies` (new-products) | case cover: OctiFi | product shot | OctiFi's mobile lending flow: onboarding and loans across two markets. | 16:9 master |
| `/case-studies` (new-products) | case cover: Vovisto | product shot | Vovisto's healthcare event and travel platform: a travel coordinator's view of one congress trip (budget, approval, flights, hotel). The case study is coming soon; the index lists it unlinked. | 16:9 master |
| `/case-studies` | case cover: ConnectX | product shot | ConnectX's AI dashboard: a plain-language question about a building answered by its digital twin, with the right data and assets in view. | 16:9 master |
| `/case-studies` (designed-and-built) | case cover: CuramCare | product shot | CuramCare's web platform and its two apps, side by side: a family member and a carer each seeing their own part of the same care arrangement. The case study is coming soon; the index lists it unlinked. | 16:9 master |
| `/case-studies/octifi-…` (related, served from the corpus since 11 Oct 2026) | case cover: merchant payments research | product shot | The same asset as "Kirana store payments" above (the OctiFi page's related link names that case "merchant payments research", so its cover is keyed by that name): the small-shop payment app shaped by twenty merchant interviews. One file serves both keys. | 16:9 master |
| `/case-studies/octifi-…` (related) | case cover: The Wandering Raven | product shot | The Wandering Raven's creative-writing world for young learners inside Moodle, as the case's cover wherever another page cites it. The case binds no cover yet (`ASSET_REQUIRED`); the same first approved screen serves home's why-tcules panel and the case index slot. | 16:9 master |
| `/case-studies` (established-products); `/case-studies/benchmark-gensuite-…` (related) | case cover: Gold Image Printing | product shot | Gold Image Printing's online ordering site and internal production system shown as one product. | 16:9 master |
| `/case-studies` (established-products) | case cover: Ryzeo | product shot | Ryzeo's marketing automation platform, at the part research decided to fix first. | 16:9 master |
| `/case-studies` (established-products); `/services/product-design` (complex-products) | case cover: Scissors | product shot | Scissors' staffing software: clients, candidates and jobs connected in one model, so details entered once carry through. | 16:9 master |
| `/case-studies` (ai-products); `/about` (work-you-can-inspect) | case cover: Omny AI | product shot | Omny AI: AI suggestions held separate from the final listing until a person accepts them. | 16:9 master |
| `/case-studies` | designed-and-built (The Wandering Raven) | product shot | The Wandering Raven's creative-writing learning world for young learners, built inside Moodle. Its own slot (critic, B2: the 16:9 cover master cropped to the story split lost its label). The story is a case card beside its client's quote; 16:9 since home round 3 (every card cover is 16:9, it was 2:1). If the case page later binds a cover, that cover replaces this panel. | 16:9 |

## Card covers are 16:9 (home round 3, 11 Oct 2026)

Every card cover, list thumbnail and video poster on the site is cropped to ONE ratio, 16:9
(`--ratio-standard`), at every width and in every arrangement: supply each cover as a **2560 × 1440
master** (the 16:9 banner's and the Clutch portfolio export's size), subject inside the central
safe area so the 160-wide list thumbnail still reads. The rows above already say 16:9 for every card
slot. Bound case artefacts that are NOT 16:9 are cropped by the card until a 16:9 master replaces
them (home `selected-work`, `COVER_FOCUS` in HomePage.tsx):

| Case | Bound artefact | Its ratio | At 16:9 |
| ---- | -------------- | --------- | ------- |
| Doodle | `home_doodle_object_model` | 2.25:1 | loses the board's end (anchored on its start) |
| Dealpath | `home_dealpath_workflow` | 1.51:1 | loses the board's foot (anchored on its top) |
| Benchmark Gensuite | `home_benchmark_scope_selector` | 3.3:1 | keeps its first panel only (anchored on its start) |
| Eden AI | `home_eden_unified_search` | 1.97:1 | loses a sliver at each side |

## Retired slots (product-design round 6, 11 Oct 2026)

Bands redesigned for their job no longer reserve these photographs (page-mapping § 23). Removed from
the register above so no asset is briefed for a slot that is not on the page:

| Page | Band | What it was | Why it went |
| ---- | ---- | ----------- | ----------- |
| `/services/product-design` | starting-points | studio photo, 3:2: a designer watching a customer use the product | The band is a VoiceLedger: the customers' own words are its picture, set large. A generic studio photo beside them competed with the complaints for the eye. |
| `/audits/design-to-code-audit` | recognition | studio photo, 3:2: a designer and a developer comparing design and shipped screen | The same band type as product-design's starting-points, so it takes the same VoiceLedger (page-mapping § 23): the four complaints are the picture. |
| `/services/product-design` | engagement | studio photo, 4:5: a Tcules designer inside a client's tools and meetings | The band is EngagementOptions: each way of working carries a scope drawing, which shows how the four differ; a photo could only show one of them. |

The Dealpath evidence (`product_design_dealpath`, bound, 3200 × 2121) now renders in a 16:9 frame
(CaseSpread), read from its top: the screen's header and the listing cards with "Add to pipeline"
stay, the foot of the second card is cropped. A 2560 × 1440 master of the same screen would show it
whole.
