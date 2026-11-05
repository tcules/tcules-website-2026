---
title: "Body type never above 16px"
date: 2026-10-19
status: active
area: [type]
source: "Owner, 19 Oct 2026 (PR #123)"
supersedes: ["2026-10-09-section-body-16-lead-18"]
dbf: ["ch03 §2"]
dbf_status: pending
enforced_by: "review"
legacy: "memory/body-type-ceiling.md"
---

No body or lede text above 16px anywhere on the site. Only the PageHero lead and testimonial quotes may take 18 (`--text-lead-lg`). Card bodies and copy under an h4/h5/h6 title take 14 (`--text-body-sm`). Form input text is 16; the footer tagline 16. Smaller-than-usual type is welcome.

**Why.** The owner has had to repeat this many times; 20px ledes kept creeping back via `--text-lead` / `--text-lead-lg`.

**The mistake it prevents.** A 20px lead, or a hero `leadSize` opt-in, reintroduced by a new component or variant.

**How to apply.** Never point a new component's body or lead token above 16 unless it is the hero lead or a testimonial quote. ch03 §2 still lists `--text-lead` at 20 and `--text-body-lg` at 18. One exception since 2 Nov 2026: an insight's summary paragraph, `--text-summary` (22, phone 18), in Callout tone="summary" only (decisions/2026-11-02-insight-summary-is-a-blue-topped-panel).
