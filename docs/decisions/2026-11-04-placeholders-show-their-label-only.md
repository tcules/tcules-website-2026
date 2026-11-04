---
title: "An image placeholder shows its short label, never its brief"
date: 2026-11-04
status: proposed
area: [imagery, process]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (audits critic: grey hero boxes printing the drawing's whole brief)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "placeholders --check (generated slots current)"
---

A registered image slot that has no asset yet shows only its short label ("Image to come · Illustration"), as /expertise does. The drawing's brief stays in docs/image-register.md for whoever draws it.

**Why.** A slot printing a paragraph of art direction reads as broken copy on the page.

**The mistake it prevents.** Every hero placeholder on the site printing the first sentence of its brief.

**How to apply.** scripts/placeholders.mjs and the generated public/placeholders/*.svg; changes every hero placeholder site-wide (L1 service pages, home, /about).
