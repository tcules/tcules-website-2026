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

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, work-wall photo, record figures | |
| client-recognition | recognition · LogoGrid | 5 of 7 named clients have no mark yet |
| principles | reasons · Reasons + ClaimProof examples | |
| signature-work | record · CaseSpread strip | on tint |
| studio | text · B + team photo, ClaimProof example | |
| alternatives | table · DataTable, Tcules row `pick` | owner, 2 Nov: stays a table; the Tcules row reads as the suggestion |
| testimonials | quotes · slider, stars on every quote | |
| enquiry, faq | L, D-faq | |

## Open
- The craft reason's illustration (register row). Client marks for Dealpath, Benchmark Gensuite, ConnectX, JoVE, Ringier.
