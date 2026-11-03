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
  - The other ways to reach us are three tiles under the head "Other ways to reach us", each with one
    labelled outline action (the mailbox or "Careers"). The social profiles and the studio address are a
    short "Follow us on" links island after them. This is the owner's Contact A mock (3 Nov 2026), after
    the first build (five equal icon cards) was rejected. Proposed in the same ruling.
- The sent state is design only. Success and failure copy and analytics come after launch (tracker
  post-launch list), so the view keeps `conversion.on_success` and the steps as authored.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero `centred` + stats | Figures from the `next-steps` record line |
| `enquiry` | EnquiryBand, blue island, halves, `inBand` | Sent view shows the `next-steps` steps |
| (channels) | ContentSection "Other ways to reach us" + BlockCardSet `frame="tile"`, `linkScope="cta"`, `ctaEmphasis="outline"` (`C-channels`) | Not a copy band: content from `getContactChannels`. Heading is the owner's |
| (follow) | LinksIsland, the band About uses, without `open` (`C-links`) | Content from `getContactFollow`; the address as its footnote |
| `next-steps` | not drawn (BANDS_ELSEWHERE) | Lives in the sent state and the hero |
| `faq` | the plan's FAQ | Unchanged |

## Content mapping
- The tiles take tcules.com/contact's own headings and destinations verbatim (read 3 Nov 2026):
  "General or press inquiries" → hello@tcules.com; "For partnerships or vendors" → partners@tcules.com;
  "Looking to work with us?" → "Careers" (/careers; the owner's label, the live page says "Careers Page").
  "Follow us on" → LinkedIn, YouTube, Instagram, X, with the studio address under them.
- Fixture: src/content/sources/fixtures/contact-channels.ts. Instagram (`https://www.instagram.com/tcules.ux`)
  and X (`https://x.com/tculesux`) were added to `EXTERNAL` from the live page. LinkedIn keeps the repo's
  `in.linkedin.com` URL, where the live page links `www.linkedin.com/company/tcules`.
- Address: the footer's record (`STUDIO_ADDRESS`, now shared by the footer and the card), which ends
  "Ahmedabad 380060, India". The live page prints "Ahmedabad - 380060, Gujarat".
- Glyphs (Solar Bold, verbatim from @iconify-json/solar): letter and hand-shake head the tiles; Careers
  takes users-group-rounded. share-circle and map-point were added for the first build and stay in the set.
- Strapi: the CMS contact type already carries `cards` and `socialMedia`. When /contact moves to Strapi,
  sources/strapi maps them into `ContactChannel`.

## Open
- The address form: the footer's "…Ahmedabad 380060, India" or the live "…Ahmedabad - 380060, Gujarat".
- LinkedIn: the repo's `in.linkedin.com` URL or the live page's `www.linkedin.com/company/tcules`.
