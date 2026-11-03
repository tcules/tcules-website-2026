# /contact — 2.56 pass, 3 Nov 2026 (local, branch feat/2-56-contact, in review)

The page exists for the form. Hero (centred, figures), the enquiry island in the hero, the other ways to
reach the studio, the questions.

## Decisions
- Hero centred with no media, the enquiry island as its panel, and the NDA line under the island. Logged in
  decisions/2026-10-31-contact-hero-centred-form-below and decisions/2026-11-03-close-footnote-under-island.
- Tracker 2.56, checked against the live tcules.com/contact. "What to include in your first message" and
  "Keep the message…" (the brief and confidentiality bands) were already cut, because the 3 Nov copy no
  longer authors them. What this pass did:
  - "What happens after you send" (`next-steps`) merges into the post-send state. The three steps already
    showed in the form's sent view, word for word, so the band is no longer drawn. Its record line stays
    the hero's figures. The move is registered in `BANDS_ELSEWHERE` (src/templates/CorpusPage/kinds.ts).
    `kinds:check` lists it there, and fails if it is drawn again. Proposed:
    decisions/2026-11-03-contact-channels-and-steps-in-sent-state.
  - The other ways to reach us, the social profiles and the studio address are a row of icon cards after
    the hero. Proposed in the same ruling.
- The sent state is design only. Success and failure copy and analytics come after launch (tracker
  post-launch list), so the view keeps `conversion.on_success` and the steps as authored.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero `centred` + stats | Figures from the `next-steps` record line |
| `enquiry` | EnquiryBand, blue island, halves, `inBand` | Sent view shows the `next-steps` steps |
| (channels) | BlockCardSet `across={3}`, `lead="none"`, icon cards (`C-channels`) | Not a copy band: content from `getContactChannels`. No visible head; `aria-label` "Other ways to reach us" |
| `next-steps` | not drawn (BANDS_ELSEWHERE) | Lives in the sent state and the hero |
| `faq` | the plan's FAQ | Unchanged |

## Content mapping
- The cards take tcules.com/contact's own headings and destinations verbatim (read 3 Nov 2026):
  "General or press inquiries" → hello@tcules.com; "For partnerships or vendors" → partners@tcules.com;
  "Looking to work with us?" → "Careers Page" (/careers); "Follow us on" → LinkedIn, YouTube, Instagram,
  X; "Ahmedabad, India" → the studio address.
- Fixture: src/content/sources/fixtures/contact-channels.ts. Instagram (`https://www.instagram.com/tcules.ux`)
  and X (`https://x.com/tculesux`) were added to `EXTERNAL` from the live page. LinkedIn keeps the repo's
  `in.linkedin.com` URL, where the live page links `www.linkedin.com/company/tcules`.
- Address: the footer's record (`STUDIO_ADDRESS`, now shared by the footer and the card), which ends
  "Ahmedabad 380060, India". The live page prints "Ahmedabad - 380060, Gujarat".
- Glyphs (Solar Bold, verbatim from @iconify-json/solar): letter, hand-shake, share-circle and map-point
  are new. Careers takes users-group-rounded.
- Strapi: the CMS contact type already carries `cards` and `socialMedia`. When /contact moves to Strapi,
  sources/strapi maps them into `ContactChannel`.

## Open
- A visible heading for the channels band. The copy authors none, so the copy team or the owner could add one.
- The address form: the footer's "…Ahmedabad 380060, India" or the live "…Ahmedabad - 380060, Gujarat".
- Five cards at three across leave the second row with two cards. Four across would leave one card alone,
  and BlockCardSet has no five-across arrangement.
