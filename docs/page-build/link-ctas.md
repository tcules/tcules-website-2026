# Link CTAs: one-line links in the copy as ink islands (tracker 2.53)

Built 3 Nov 2026 on `feat/2-53-link-ctas`. The rule is logged `status: proposed` in
`docs/decisions/2026-11-03-onward-line-is-an-ink-island.md` until the owner has seen the routes.

## The rule, as the code applies it

- **What counts.** A band's *onward line*: the band's last block is a paragraph of its own, at most two
  sentences, with exactly one link, and that link goes to a piece of reading (`/insights/…`)
  (`onwardLine`, `src/templates/CorpusPage/text.ts`).
- **What it becomes.** The line leaves its band and is set right after it as an ink island
  (`OnwardIsland`, `CopyBands.tsx`): `CtaSection arrangement="open" intent="onward"`, the same island and
  turbulent field as every formless CTA island. The words are split, never rewritten: the sentence before
  the one holding the link is the heading; the sentence holding the link is the lead (or the heading when
  there is no setup); a link that closes the line on its own is the button alone. A title the
  sentence runs through keeps its mark as curly quotation marks, since its link is now the button. The button is the link's
  own words as the blue **link** with its arrow (the authored "→" is dropped, the control draws one), never
  a solid.
- **Where it may go** (`placeOnward`, `plan.ts`). Not when the next band is the enquiry close or a closing
  ask, and not when the band already ends in its own ask island (an `#enquiry` link → `AskIsland`), so two
  islands never touch and none sits beside the close. Two onward islands always have a band between them,
  since each follows its own band. The island is paper around ink: it never makes two tints touch, and it
  is a visual band, so it never makes a text-heavy pair.
- **kinds:check.** The island's section is `<band>-onward`; the check reads it as part of the band's words,
  so the lifted line is still proved to reach the page. The island is not a kind and has no kinds.ts entry
  of its own (noted in `kinds.ts`).
- **Scope.** Every page that renders through `OfferPage`: the offer pages (services, audits, expertise) and
  the composed routes (hubs and one-off pages). On today's copy five offer pages carry a qualifying line;
  no composed route does. Home, About, Contact, the tools and the long-form pages (insights, glossary, case
  studies) have templates of their own and are not touched; their lines are listed below with the reason.

## Placements

| Page | Line (`_pages/`) | Decision | Reason |
|---|---|---|---|
| `/audits/prototype-readiness-review` | `audits__prototype-readiness-review.md:229` "[Is your vibe-coded app ready for production?](…) covers where AI-built apps break first." | **Island** after `#method` | The tracker's example. Next band is `#compare`, not an island. Heading is the whole sentence (no setup), with the title in quotation marks: “Is your vibe-coded app ready for production?” covers where AI-built apps break first. The button is the title again: see open question 1. |
| `/audits/ai-product-ux-readiness` | `audits__ai-product-ux-readiness.md:233` "A confidence score alone rarely helps the person approving. Our article explains [why …](…)." | **Island** after `#method` | Setup as heading, pointer sentence as lead. Next band is `#compare`. |
| `/services/ai-product-ux` | `services__ai-product-ux.md:229` "Added a confidence score and usage stayed flat? [Read why a score alone doesn't earn trust →](…)" | **Island** after `#autonomy` | Question as heading, link as the button. Next band is `#whats-next`. |
| `/services/ai-product-ux/trust-control-recovery` | `services__ai-product-ux__trust-control-recovery.md:237` "A score beside each answer doesn't fix trust on its own. [What does: a review step people control →](…)" | **Island** after `#recovery` | Next band is the testimonials (tint): paper around the island, no tint pair. |
| `/services/software-development/mobile-app-development` | `services__software-development__mobile-app-development.md:241` "Still weighing it up? Our guide, [Does my SaaS need a mobile app? …](…), walks through the questions." | **Island** after `#format` | Next band is `#platforms` (a table). The lead quotes the guide's title: Our guide, “Does my SaaS need a mobile app? …”, walks through the questions. The longest button label the copy carries; it wraps centred at 390. |
| `/services/product-modernisation/legacy-software-modernisation` | `…legacy-software-modernisation.md:274` "Moving to a new platform has its own page: [Replatforming Product Design](…)." | Inline | A link to a sibling service, not to reading: services point to each other in the copy and in the router bands. Open question 2. |
| `/audits/prototype-readiness-review` | `audits__prototype-readiness-review.md:243` "Reviews for products already in customers' hands sit under [Audits & Assessments](/audits)." | Inline | A footnote to the comparison table, pointing to the audits hub, not reading. An island here would also follow `#compare`, two bands after the `#method` island. |
| `/audits/product-modernisation-assessment` | `audits__product-modernisation-assessment.md:240` "If you only need to know where users struggle, a [UX & Product Audit](…) is more focused." | Inline | Qualifies the comparison table it closes; a sibling audit, not reading. |
| `/services/ai-product-ux` | `services__ai-product-ux.md:254` "Building a new AI product? [Design-led MVP Development](…) takes it from idea to MVP." | Inline | A sibling service closing the services band; the page already carries the `#autonomy` island two bands up. |
| `/services/design-systems/governance-adoption` | `…governance-adoption.md:217` "… Our article follows [how a product need becomes a shared design system release](…)." | Inline | Not the band's last block: lifting it out would reorder the copy. |
| `/audits/ux-product-audit` | `audits__ux-product-audit.md:192` "… Our guide covers [how to turn UX audit findings into decisions …](…)." | Inline | Mid-band, inside the deliverables. |
| `/services/ai-product-ux/ai-search-recommendation` | `…ai-search-recommendation.md:227` "… Eden AI's founder talks through [why to build AI around the user's job](…) in our podcast." | Inline | The band's opening paragraph, three sentences of argument. |
| `/services/ai-product-ux/human-in-the-loop-workflows` | `…human-in-the-loop-workflows.md:242` "… as our article on [why confidence scores don't build trust …](…) explains." | Inline | Mid-band, inside an argument. |
| `/services/ai-product-ux/trust-control-recovery` | `…trust-control-recovery.md:231` "… which our article on [how much an AI feature should show users …](…) works through." | Inline | Mid-band argument; the band's last line (above) already takes the island. |
| `/services/design-engineering/implementation-qa` | `…implementation-qa.md:239` "… Our article explains [why interface regressions cost confidence …](…)." | Inline | Mid-band. |
| `/services/design-systems/design-system-strategy` | `…design-system-strategy.md:214` "… Our article covers [matching a design system to the size of your product](…)." | Inline | Mid-band, three sentences. |
| `/services/mvp-development` | `services__mvp-development.md:212` "… Our guide to [showing each role why the product is worth using](…) goes further on the first." | Inline | Mid-band. |
| `/services/mvp-development` | `services__mvp-development.md:301` "… [Is your vibe-coded app ready for production?](…)" | Inline | Inside an FAQ answer. |
| `/services/product-modernisation/product-redesign` | `…product-redesign.md:225` "… including [the small regressions that cost confidence …](…)." | Inline | Mid-band, the link is a clause of the argument. |
| `/services/software-development/frontend-development` | `…frontend-development.md:252` "… Our article on [what quiet interface regressions cost …](…) explains why." | Inline | The band's last block, but three sentences: an argument that ends on a pointer, not a pointer. |
| `/expertise/ai-products-developer-tools` | `expertise__ai-products-developer-tools.md:244` "… Our article on [how a review step hands control back to people](…) explains why." | Inline | Inside a hard part's `###` item. |
| `/why-tcules` | `why-tcules.md:222` "… Comparing studios? Our guide covers [what to ask before you hire a product design agency](…)." | Inline | Not an offer page; and three sentences, an argument ending on a pointer. |
| `/how-we-work/ai-native-product-design` | `how-we-work__ai-native-product-design.md:165` "For data handling and procurement questions, see [what happens to your material …](/how-we-work/ai-transparency)." | Inline | It is the page's `close` band (its closing ask), already rendered as an ink island. |
| `/` (home) | `home.md:320` "… [See a typical AI-assisted design run](/how-we-work/ai-native-product-design)" | Inline | Home's own template; the band is due to go (tracker 2.55). |
| `/insights` | `insights.md:88, 98, 108, 118` "Our related service: […]" | Inline | A hub's per-group action, four in a row: islands would become the page's rhythm. |
| `/tools/ai-trust-control-canvas` | `tools__ai-trust-control-canvas.md:168` "… start with the [AI Product UX Readiness Check](…)." | Inline | Tool page; part of "who it's for", pointing to a sibling tool. |
| `/tools/*` | `tools__ai-product-ux-readiness-check.md:213`, `tools__figma-storybook-fidelity-checklist.md:212`, `tools__audit-redesign-modernise-rebuild.md:231`, `tools__design-system-drift-checker.md:205` | Inline | Each is the body of the tool's own `#next` band, which is already the page's onward step. |

Glossary entries, case studies and insights articles are long-form reading; their in-text links stay in the
text.

## Open questions for the owner

1. **The no-setup form repeats the title.** "[Is your vibe-coded app ready for production?](…) covers where
   AI-built apps break first." has no sentence before the link, so its island's heading is the whole line, with
   the title in quotation marks so the sentence reads (fixed 3 Nov after review: flattened, it read
   "…production? covers …"), and the button is the title again. A one-word change in the copy (a setup sentence, or a button label) would
   end the repeat; the rule renders whatever the copy gives it.
2. **Sibling-service pointers.** The rule lifts only links to reading. Should a band's last line that points to
   a sibling service ("Moving to a new platform has its own page: [Replatforming Product Design]") take an
   island too? Today it stays inline.
