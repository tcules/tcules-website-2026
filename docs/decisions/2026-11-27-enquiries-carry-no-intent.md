---
title: Enquiries carry no intent; the page and the button pressed say what an enquiry is about
date: 2026-11-27
status: active
area: [forms]
source: "Devagya, 26 Nov 2026, answers after the forms review with Jatin (docs/TRACKER.md F.2: \"Remove the intent picker: the page and the button pressed are already captured\"); \"Remove intent entirely\", 27 Nov 2026"
supersedes: [2026-11-25-intent-picker-is-a-dropdown]
dbf: []
dbf_status: none
enforced_by: "structure (no intent in src/lib/enquiry-entry.ts, EnquiryForm, the CMS queries or the analytics event types)"
---

A form has no intent to choose and records none. "Remove the intent picker: the page and the button
pressed are already captured", and then "remove intent entirely" (27 Nov): no dropdown, no `?intent=` on
links, no page `defaultIntent`, no `enquiry_intent` or `enquiry_intent_initial` with a submission, no
`intent` on an analytics event and no `intent_change`. An enquiry is attributed by the page it was sent
from (`origin_route`, `placement`) and the button pressed (`cta_id`, `{page}_{placement}`), with
`entry_route` for `/contact`. "Work email" stays as it is.

**Why.** The page and the button already say what the reader came for. A dropdown asked them to say it
again, as a first field above the ones that matter.

**The mistake it prevents.** The intent dropdown built on 25 Nov (#322 to #327): a first row on every
sales form, a CMS list of seven intents to keep worded, and a `?intent=` on every button.

**How to apply.** Never add a field or a link parameter that restates what the page or the button already
tells us. The careers role dropdown is not an intent and stays until F.7 redesigns the application. The
CMS's Enquiry Intent collection, the button's `intent` and the forms' `defaultIntent` are removed in
tcules-cms-2026 after this site change is live, since the site no longer reads them.
