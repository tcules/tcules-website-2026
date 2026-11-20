---
title: Every page that attracts buyers closes on the enquiry form, which replaces the button close
date: 2026-11-20
status: active
area: [forms, content]
source: 'Owner, 20 Nov 2026, relaying Jatin: "all pages will have an enquiry form (except pages like Careers, Lab, etc whose function is not to attract buying customers)"; "the form should replace the button outright"; glossary, tools and videos "count as commercial pages that attract buyers"'
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

A page that exists to attract buyers ends on the enquiry form, never on a button to `/contact`. Where a
page closes on a button, the form replaces it outright: the close keeps its own title and body, and takes
the ink close's tick points and the client quote (one standard quote everywhere until there is a page's
own, e.g. a case study's client). Careers, the Lab and its join page are not buyer pages and keep their
own closes. Insights (articles, guides, research, videos), glossary, tools and About are buyer pages.

**Why.** The form is the primary action (home review, Oct 2026), and a button that sends a reader to
another page to fill in the same form loses some of them on the way.

**The mistake it prevents.** 139 insights, About and the glossary index ended on an ink island with one
"Book a free product review" button linking to `/contact`, while every service page carried the form.

**How to apply.**

- In Strapi the close is a `shared.cta` with `ctaType: form`, the enquiry form and island `ink`
  (`ink-close.ts`). Its leads keep the button's attribution: an insight sends `placement: terminal`.
- `PublishedSection` takes `inkFrame`: the band where a band follows, the island on paper where the
  close is the last band before the ink footer (an insight with no further reading, About).
- Pages with no close yet (case studies, tool pages, glossary terms, some insights) and the author
  pages are not covered by the 20 Nov change; they are added later, case studies each with their own
  copy and, when one exists, their client's quote.
