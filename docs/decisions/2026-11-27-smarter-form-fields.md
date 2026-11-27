---
title: Form fields help as people type; an email typo suggestion appears on leaving the field, and the phone takes a searchable country code
date: 2026-11-27
status: active
area: [forms, components]
source: "Devagya, 26 Nov 2026, answers after the forms review with Jatin (docs/TRACKER.md F.3); the suggestion's timing, the country code and the phone library, 27 Nov 2026"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "code (Input `affix`, SelectControl `search`, EnquiryForm's field specs; src/lib/email-suggest.ts, phone-region.ts, phone.ts, file-rule.ts; tests/form-fields.test.mjs)"
---

The shared controls help with every field, so every form gets it:

- **Link:** `https://` sits inside the field before the value (`Input affix`), and a pasted or typed
  `https://` or `http://` is taken off. The send adds `https://` back. Where the placeholder is the
  field's only cue, the affix waits until the field is focused or filled.
- **Keyboards and autofill:** each field asks for its keyboard: email and link never capitalise or
  correct, names capitalise words, and free text writes sentences.
- **Phone:** a country code beside the number. It is a dropdown you can type into, "so nobody has to
  scroll to find their country code", preselected "based on the visitor's region" (the browser's
  languages, then its time zone). The number takes digits only, is checked for the chosen country on
  send, and is sent as one international number. A pasted `+44 …` sets the country.
- **Email typo:** a suggestion ("Did you mean ada@gmail.com?", one press to accept) when the reader
  leaves the field. It is help, not an error: hint ink, never blocking send. Errors still appear on
  send only (2026-10-16-form-errors-on-submit-only stands).
- **Spaces:** trimmed from every typed field on send, and from inside an email address.
- **Files:** a file field states its types and size before upload ("PDF or Word, up to 10 MB",
  `describeFileRule`). The first file field is careers' CV (F.7).

**Why.** "Smarter fields, in the shared controls so every form gets them" (26 Nov). The form applies
rules itself instead of making the reader learn them.

**The mistake it prevents.** A link field that rejected `acme.com` for lacking a scheme. A phone field
that took any text, with no country. A mistyped `gmial.com` that reached the team as a dead address.

**How to apply.** Add a field to `EnquiryForm`'s `FIELD` with its `keys`, never as a bespoke
`<Input>`. A long pick-list uses `Input as="select"` with `search`. The phone library
(libphonenumber-js, its smallest data set) is loaded with `loadPhoneKit` only by a form that asks for a
phone, when it nears the screen or the field is touched, never with the page ("shouldn't affect
performance", 27 Nov).
