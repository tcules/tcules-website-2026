---
title: The enquiry form's intent picker is a dropdown, shown only when there is a choice
date: 2026-11-25
status: proposed
area: [forms, components]
source: Devagya, 25 Nov 2026 ("dropdown for the picker"; "pages that don't really have options should not show … the picker"); docs/specs/EnquiryForms.md § 4
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

What the reader came for is chosen in a native dropdown, the form's first field, labelled "What would you
like to do?". It lists the CMS's intents for the form's type and opens on the one the button named, else
the link's `?intent=`, else the page's default, else the type's. A form whose type has one intent shows
no dropdown and records that intent silently; a second intent added in the CMS makes the dropdown appear
with no code change.

This is the one exception to 2026-10-19 (form choices are chips), which still governs every other
pick-question in the form, such as "How did you hear about us?".

**Why.** The prototype's pattern: one list per form type, preselected by the page and the button,
changeable by the reader. A dropdown keeps a list of seven out of the form's height and opens each
phone's own picker.

**The mistake it prevents.** A "your selected interest" line or a picker on a form with nothing to
choose, and a row of seven chips above every form.

**How to apply.** `Input as="select"` inside `EnquiryForm` (`intentPicker`); the list comes from the
root layout's `EnquiryIntentsContext`, the page default from the CMS form's `defaultIntent`. Careers keeps
its role chips until ruled otherwise.
