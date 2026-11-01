# /how-we-work, with /ai-native-product-design and /ai-transparency: round 2, 1 Nov 2026 (draft PR #190)

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

## Band → component (/how-we-work)
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, studio photo (team), record figures | |
| client-recognition | recognition · LogoGrid (H) | |
| engagement-shapes | tiles · EngagementOptions rows, eyebrows, scenes | terms row: start wherever + Dealpath |
| your-team | text · B + illustration, image start | |
| working-loop | text · B + illustration, image end | |
| design-to-release | text · B + illustration, image start | |
| product-knowledge | text · B + illustration, image end | |
| essentials | tiles · EngagementOptions grid, 4 across | empty plate on "who decides" |
| testimonials | quotes · G | |
| enquiry, faq | L, D-faq | |

## Open
- Four illustrations to draw (register rows), and a flat scene for "who decides, who owns the work".
- ai-native and ai-transparency still run three to four prose bands in a row.
- Missing client marks (content-changes, "Client marks with no file").
