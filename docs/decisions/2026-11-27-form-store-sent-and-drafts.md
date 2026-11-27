---
title: Forms remember a send per type, keep typing in memory only, and reach storage through one consent gate
date: 2026-11-27
status: active
area: [forms]
source: "Devagya, 26 Nov 2026, answers after the forms review with Jatin (Granola: \"Website forms system, CTA strategy, and Figma seat renewal\"; docs/TRACKER.md F.1); the business-day clock picked 27 Nov 2026"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "code (src/lib/form-store.ts, src/lib/form-sent.ts, src/lib/storage.ts; tests/form-sent.test.mjs)"
---

A sent form is remembered in the visitor's browser per type, **sales and careers kept apart**, across
reloads and pages. Sales counts as sent until the end of the next business day, in the visitor's own
time, Monday to Friday, with no holiday calendar ("Visitor's time, Mon–Fri", 27 Nov). Careers counts for
30 days. Privacy requests are not remembered. The record keeps the date it was sent, so the "already
sent" prompt can name it.

What a reader types lives **in memory on the page only, never in browser storage**. Every placement of a
form of one type on the page shares it: the page form and the bottom sheet are one form, typing
included. Leaving the page leaves the draft behind. This replaces the session-storage draft of 31 Oct
2026 (the paragraph in 2026-10-31-contact-hero-centred-form-below, now marked superseded there).

Every read and write of browser storage goes through one gate, `storageAllowed` in `lib/storage`, so the
cookie banner (backlog) connects in one line. Each submission is counted once, however many placements
of the form are on the page; a form's view and start are counted once per page.

**Why.** The sales window follows the promise beside the form, "We reply within a business day": once
that has passed without a reply, a second message is fair. Careers has no reply promise yet. Typed text
is personal and stays out of storage. One gate keeps consent a single switch.

**The mistake it prevents.** The 31 Oct draft, which wrote whatever a reader typed into session storage
per placement, so the page form and a sheet would have held two different drafts. Also a send
remembered across types, which would tell an applicant they had "already sent this" when they asked
about a project.

**How to apply.** `EnquiryForm` reads and writes drafts through `readDraft`, `writeDraft` and
`subscribeDraft`, calls `markSent` on an accepted sales or careers send, and gates once-per-page events
with `firstOnPage`. The root layout's `EnquiryLinks` calls `enterPage` on every navigation. F.4's
"already sent" prompt reads `useSent(type)` and "send another" calls `clearSent(type)`. Never call
`localStorage` or `sessionStorage` directly: use `readStorage`, `writeStorage` and `removeStorage`.
