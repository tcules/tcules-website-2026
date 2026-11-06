# /why-tcules — in design (branch design/why-tcules, on #190), 2 Nov 2026

Composed from the library: OfferPage's plan. No new components; two new flat drawings.

## Decisions
- Hero: the working-wall studio photo (`STUDIO_HERO`), the page's own `why_work_wall`; the team photo stays the studio band's.
- Principles: Reasons, two drawings reused from the offer set where the argument is the same (known-before-drawn,
  proved-in-code); the craft reason takes the slot (image register). Each "Example:" is the ClaimProof panel
  under the reason (decisions/2026-11-02-examples-are-one-pattern).
- Signature work: the ConnectX story is a case snippet, so it is the CaseSpread strip (owner, 2 Nov 2026): the
  thinking and the craft drawn (`case-connectx-thinking`, `case-connectx-craft`), the code the real capture,
  "Read the ConnectX case" lifted from the result's last words to the head's action.
- Studio: the Primelis/Vovisto example is the ClaimProof panel under the text.
- Testimonials: every quote rated by its person (decisions/2026-11-02-one-person-one-rating).

## The 3 Nov copy (2.60, 4 Nov 2026, local branch design/2-60-why-how, awaiting owner review)
New outline: selected work, principles, complex software, design to code, AI products, testimonials, alternatives.
Every claim carries a client's quote (treatment rules, "Added 4 Nov 2026 (/why-tcules and /how-we-work)").
| Band | Kind / component | Notes |
|---|---|---|
| selected-work | cases · M | "Craft people notice" leads the set (words start, quote beside); Eden AI, Omny AI, Phoenix as cards. Phoenix has no case file in the copy, so its card shows the placeholder cover (its page is live from Strapi) |
| principles | reasons · OfferSheet (drawn, three across) | one flat drawing per principle (wyg-why-tcules.tsx), 6 Nov 2026; the 5 Nov wide drawing parked (decisions/2026-11-06-why-tcules-principles-flat-drawings) |
| complex-software | text · B | the team photo (why_team) as the 3:1 banner; four claims two by two; the sectors as one dotted line |
| design-to-code | text · B | ConnectX coded demo beside, two claims with quotes |
| ai-products | text · B | AI Product UX's own flat drawing beside the words; "See AI Product UX" the action |
| alternatives | table · E | unchanged; "Start small" and the OctiFi line render under the table as before |
| studio, signature-work | — | cut by the copy |

## Band → component (2 Nov)
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, work-wall photo, record figures | |
| client-recognition | recognition · LogoGrid | 5 of 7 named clients have no mark yet |
| principles | reasons · OfferSheet, a flat drawing per principle | 6 Nov 2026 |
| signature-work | record · CaseSpread strip | on tint |
| studio | text · B + team photo, ClaimProof example | |
| alternatives | table · DataTable, Tcules row `pick` | owner, 2 Nov: stays a table; the Tcules row reads as the suggestion |
| testimonials | quotes · slider, stars on every quote | |
| enquiry, faq | L, D-faq | |

## Open
- The craft reason's illustration (register row). Client marks for Dealpath, Benchmark Gensuite, ConnectX, JoVE, Ringier.

## Owner review, 4 Nov 2026 (2.60)
- complex-software → the four claims as three-ways glyph cards (plan `CARD_SETS`), "See all industries →" the head's
  end action; design-to-code → the Why Tcules list (plan `CLAIM_LIST`). Swapped at the owner's word, positions kept.
- ai-products → the ink CTA island. Claim quotes, "Craft people notice", the twelve industry links, the Start small /
  OctiFi lines and the AI band's sub-heading cut (docs/content-changes.md).
- Hero → `studio-sticky-wall-sorting` (designers sorting notes on the wall); grounds alternate to the quotes band.
