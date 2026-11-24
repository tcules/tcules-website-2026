---
title: "On the website, peridot is ::selection only"
date: 2026-10-05
status: active
area: [colour]
source: "Owner, 5 Oct 2026"
supersedes: []
dbf: ["ch02 §4"]
dbf_status: applied
enforced_by: "review"
legacy: "memory/ui-kit-direction-oct-2026.md"
---

Peridot on the site is `::selection` only (and the carried item inside illustrations). The "marked phrase" band is a social-media device; the website does not highlight text.

**Why.** Peridot does not work as a UI colour.

**The mistake it prevents.** A marked-phrase highlight in a website heading.

**How to apply.** `globals.css` `::selection`. ch02 §4 lists the marked phrase as one of peridot's two uses without limiting it to social.
