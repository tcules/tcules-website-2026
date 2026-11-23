---
title: "The stages band replaces the situation gateway on every page that has it"
date: 2026-11-23
status: active
area: [components, content]
source: "Owner, 23 Nov 2026: \"the stages are pretty much on many pages. it will more or less replace this section on any page that this section exists\"; \"we should at least add the chat thread component into the CMS so we can update the homepage once and for all\"; free tools: \"we'll go with your approach for now\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "Strapi shared.product-stages, shared.chat-thread, shared.free-tools (tcules-cms-2026#3); PublishedHome's stages, chat and tools bands"
---

"Where is your product today?" (the situation gateway: cards of situations, each with links) gives way
to the overhaul's stages band on every page that has it, Home and How we work today: one row per stage,
each with its drawing and the service it leads to, then the first-step strip. The stage rows are
ListCard's `Stages`; a phone reads them as a timeline.

The stages, the first-call chat thread and the free tools are Strapi sections, so Home and the pages
that follow it are fed from the CMS, never from code.

**Free tools pick records.** A free-tool card picks exactly one existing record, a Tool or a guide (a
Resource), with optional short copy for that placement that falls back to the record's own card copy,
as a case study card does. Tools stay their own collection for now; folding them into Resources is a
separate job, after which the Tool picker goes.

**Why.** One band for one job across the site, and an editor changes Home without a code change.

**The mistake it prevents.** Retyping a tool's title, text and link into each page that names it, so
the copies drift from the tool.

**How to apply.** A page that asks where a product is today uses Product Stages. A row of free tools
or guides uses Free Tools and picks the records.
