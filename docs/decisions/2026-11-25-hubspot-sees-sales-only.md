---
title: HubSpot receives sales submissions only; every submission is kept in the CMS and emailed
date: 2026-11-25
status: active
area: [forms, process]
source: Devagya, 25 Nov 2026 ("hubspot should only ever see sales form submissions"); docs/specs/EnquiryForms.md § 5
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

A submission carries its type (`sales`, `careers` or `privacy`). Every type is saved as a CMS Client
Contact, which emails the team and acknowledges the sender in that type's words. Only a sales submission
is sent to HubSpot. Careers applications, which went to HubSpot until now, and privacy requests do not.

**Why.** HubSpot is the sales pipeline; applications and privacy requests are not leads, and a privacy
request has no place in a marketing CRM.

**The mistake it prevents.** `_client-contact.ts` sending every enquiry-endpoint submission to HubSpot,
the careers application included.

**How to apply.** `EnquiryForm` posts `form_type`; the API sends to HubSpot when it is `sales` and only
then. A new form names its type.
