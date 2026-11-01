# Content changes — for Devagya

Places where the copy, or words the build adds around it, need the content team's eye: words the
design added that the copy does not author, a field a section needs, items that don't form a set.

**Scope: the 26 Oct 2026 copy in `_pages/` only.** Entries written against the earlier copy (the six
service pages recomposed from the `ideal/` fixtures, their closes, records and thread loops, the hero
budgets, the trail asks, the Sep illustration messages, home's old "What we do" line) were removed on
1 Nov 2026: the new copy replaced the text they asked about. They are in git history at `92511e23`
(`git show 92511e23:docs/content-changes.md`). Length and shape problems in the copy itself go to
`docs/content-proposals.md` (`decisions/2026-10-10-design-content-dont-paraphrase`).

Each entry: **page / section** · **what's needed** · **why** · **found in**.

---

## Case-study cards: client out of the title, one-line description

**Page / section.** `/case-studies` (every card), and anywhere a case study appears as a card.

**What's needed.** For every case study:
- Fill a **client** field (strapi-changes §13) with the client's name only.
- Take the client out of the card **title** where it leads it. The 26 Oct copy still does on the
  featured cases ("Benchmark Gensuite: modernising an enterprise suite", "ConnectX: an AI
  building-energy workspace", "Doodle: finding meeting times that will hold").
- Keep the card **description** to **8–15 words**, one sentence. The three featured descriptions in
  `_pages/case-studies.md` run 27–49 words.

**Why.** The card shows client, title, one line and the categories. When the client sits inside the
title, half the cards name it and half don't. A description longer than one line is the largest block
on the card and repeats the title.

- **Categories** no longer show on the card once the client is filled in: one label line per card.
- **"Our role"** does not show on a featured card (owner, 16 Oct 2026). The `_pages/case-studies.md`
  line "**Our role:** … [Read the … case](…)" still supplies the card's link and cta wording; the role
  itself is stated on the case page. The CMS needs no role field on the card.

**Found in.** BlockCard revision, 29 Sep 2026; checked against the 26 Oct copy, 1 Nov 2026.

## Case study cards drop their quotes; the case index opens by stage (22 Oct 2026, owner)

Case study cards never hold a testimonial (Jatin review, 22 Oct 2026). On home, the featured cases are
still featured cards, without the client's words; those words stay in the page's testimonial band. On
`/case-studies`, a band's quote still marks which case that band features, but the quote itself is not
shown on the card. No copy was changed.

The case index's BY TYPE view is replaced by BY STAGE, the default. The stages are placeholders until
the owner names them: `docs/content-proposals.md` P51.

## Enquiry close: the form's framing words (16 Oct 2026, owner)

The island close's form dresses add words the copy does not author. The owner approved them for
shipping; the content team should confirm or replace them. They live in
`src/templates/CorpusPage/blocks.tsx` (`ENQUIRY_DRESS`).

| Where | Added copy |
|---|---|
| message dress, example in "What are you working on?" | A link, a Figma file, or two lines about the problem. |
| message dress, foot | or write to hello@tcules.com |
| card dress, beside the send | We reply in 1 business day |
| message dress, the note | Tell us what you’re building. I’ll reply within a working day. |
| message dress, the person | Rushali · Design lead · Tcules (PLACEHOLDER: the owner will name who answers enquiries) |

The card dress has no heading of its own (owner 25 Oct, Jatin 26 Oct 2026): the band's heading asks.
The page's own after-line is not shown by the card dress; the success view still uses the page's
`on_success` words.

## Expertise "What you get": every deliverable takes a title pulled from its own words (30 Oct 2026, owner)

**Page / section.** All 12 `/expertise/*` pages, What you get (`#what-you-get`), the "What you receive" list.

**What's needed.** Each deliverable is written as one lower-case sentence with no title ("a map of the records,
roles, rules and states the workflow runs on"). Each now gets a short title pulled from that sentence's own
words, and the sentence stays whole as its body: "The workflow map" over "A map of the records, roles, rules
and states the workflow runs on." No new words. The proposed title for every deliverable on all 12 pages is in
`docs/page-build/visual-inventory-expertise.md` § 2 (the "What you get (pulled title)" tables). The content
team should confirm or replace each one, keeping it pulled from the sentence.

**Why.** The band's approved arrangement (`decisions/2026-10-30-what-you-get-label-rows`, proposed) is a set of titled
deliverables, each with its drawing. Untitled sentences fell back to a ruled grid of lower-case statements, the
format the owner rejected on 30 Oct. FinTech's first item ("**a status map:** …") is the only one that was
already titled.

**Found in.** Expertise pages pass, tracker 2.32.

## About: the studio's links take a title of ours (31 Oct 2026, owner)

LinkedIn, Clutch and Careers left "The practice keeps moving" for a block of their own (owner). The block's
title is ours, not the copy's: "Follow the studio, read its reviews, join the team". For Jatin to keep or
replace (`src/templates/CorpusPage/AboutPage.tsx`).
