---
title: Only a sales submission is a lead; every form reports its journey with names and IDs only
date: 2026-11-25
status: active
area: [forms, process]
source: Devagya, 25 Nov 2026, approving docs/specs/EnquiryForms.md (Jatin's Form & CTA prototype, 20 Nov)
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

A lead is a sales submission and nothing else. The OpenAI pixel's `lead_created`, Tag Manager's lead
listener (`tcules:client-contact-success`) and the `generate_lead` data-layer event fire for
`form_type = sales` only. A careers application (the careers page and the Future Interfaces Lab join
form) fires `application_submitted` instead. Every form pushes the journey events (`cta_click`,
`form_view`, `form_start`, `form_submit_attempt`, `form_validation_error`, `submission_accepted`)
carrying names and IDs only, never what the reader typed.

**Why.** The owner's ruling that "hubspot should only ever see sales form submissions", and the spec's
rule that the lead counts only after the server accepts a sales send. A job application counted as a
lead inflates every conversion report and teaches ad platforms to find job seekers.

**The mistake it prevents.** `submitProtectedForm` reporting every successful send as a lead, so an
application on `/careers` or the Lab's join page fired `lead_created` and the GTM lead listener exactly
as a client enquiry did.

**How to apply.** `EnquiryForm` takes `formType` (`sales` by default, `careers` for an application,
`privacy` for a privacy request) and passes `{ lead: formType === 'sales' }` to
`submitProtectedForm`. Events go through `track()` in `src/lib/analytics.ts`, which is the only place
that writes to `window.dataLayer` for the journey; `CtaTracker` (root layout) counts presses on links
that lead to a form. A new form names its type; a new event is added to the typed list in
`analytics.ts`, never pushed ad hoc.
