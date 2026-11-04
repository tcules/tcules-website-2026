---
title: "Free tools render as article-shaped pages (limits 2026-08-27 for tools)"
date: 2026-11-04
status: proposed
area: [content, layout]
source: "Proposed by the tools run, 4 Nov 2026, citing the 28 Oct launch roadmap ('tools launch as article-style pages') and the 4 Nov tools shape-off; for the owner to confirm with the built /tools pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

The six free tool pages (`/tools/<slug>`) render through LongformPage `family="tool"`: the hero, then every band in one reading shell beside its outline rail, the FAQ last. Inside the shell they keep composed shapes of their own: a bold-led method as Steps, the worked example as the tint example panel with its drawing, a marks diagram after the paragraph naming the marks, worksheet tables that read down on a phone. This LIMITS 2026-08-27-long-form-page-types for tools only; services, expertise and audits stay composed pages. It does not supersede that entry until the owner promotes it.

**Why.** The 28 Oct launch roadmap ships tools as article-style pages until the interactive record builder exists, and the 4 Nov shape-off chose the article shell over a composed page. The change was applied without being logged, so the critic and the owner were reviewing the tool pages against a ruling that says the opposite.

**The mistake it prevents.** Reviewing a page against an unlogged rule: either the tool pages get rebuilt as composed pages on a reviewer's reading of 2026-08-27, or the article shape spreads to services and audits because nothing recorded that it was a tools-only exception.

**How to apply.** A `/tools/<slug>` route renders LongformPage `family="tool"` (app/_corpus/tool.tsx). Nothing else changes family. If the owner rejects this, the tool pages move back to composed pages and this entry is marked superseded by that ruling.
