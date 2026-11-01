# /how-we-work, with /ai-native-product-design and /ai-transparency: designed 1 Nov 2026 (PR #190)

Composed from the library: OfferPage's plan, no new components.

## Decisions
- Hero: a studio photograph reused from /about, named per route in `images.ts` `STUDIO_HERO`. The team outside
  the studio on /how-we-work; the work wall on ai-native; the review session on ai-transparency. Owner to judge
  on the route.
- A media slot authored `SATISFIED_BY_EXISTING_ASSET` with a URL counts as bound (`load.ts`). The copy uses it
  once: the studio photograph on `your-team`, which had silently rendered as text.
- Prose bands with their own photograph join the side alternation (`plan.ts`). The three photo bands now run
  end · start · end instead of all image-left.
- An option set authored as `###` items: whatever follows the last option's italic closing line
  ("*Best when:* …") is the set's closing note, rendered as the terms row under the set (`itemCoda`).

## Band → component (/how-we-work)
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, studio photo, record figures | |
| client-recognition | recognition · LogoGrid (H) | named clients without a file fall back to the default marks |
| engagement-shapes | tiles · EngagementOptions | three options; "Start wherever…" + Dealpath as the terms row |
| your-team | text with photo · B, image end | studio review photo |
| working-loop | text · C-text | the one prose band, between two photo bands |
| design-to-release | text with photo · B, image start | Benchmark coded prototype |
| product-knowledge | text with photo · B, image end | Doodle object model |
| essentials | outcomes · OfferSheet 2×2 | |
| testimonials | quotes · G | |
| enquiry, faq | L, D-faq | form before FAQ |

## Content mapping
- Copy rendered as authored; no words moved except the engagement closing note (above).

## Open
- EngagementOptions draws no plate: the three option names match no drawn scope. Illustrations pass.
- ai-native and ai-transparency run three to four prose bands in a row; each needs a drawing (illustrations
  pass) or an owner call on which bands take a studio photograph.
- Logos: Dealpath, Benchmark Gensuite, JoVE, Ringier and Primelis are named, but only some have files
  (content-changes, "Client marks with no file").
