---
title: The legal pages close on the privacy request form
date: 2026-11-25
status: proposed
area: [forms, layout]
source: Devagya, 25 Nov 2026 ("privacy forms should be in scope and should be added to the legal pages"); docs/specs/EnquiryForms.md § 3
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

The Privacy Policy, Cookie Policy and Terms of Use end on one shared close: a heading, a line and the
privacy request form on the ink island, with no drawing. Its fields are name, email and "What do you need
help with?"; it asks for no link and shows no dropdown while the CMS lists one privacy intent.

**Why.** A reader with a question about their data is on these pages; the form routes them to the team
without the sales pipeline.

**The mistake it prevents.** Privacy questions arriving through the sales form, tagged as leads.

**How to apply.** `PrivacyClose` (templates), fed by the CMS's Privacy Request Form single type, edited
once and shown on all three pages.
