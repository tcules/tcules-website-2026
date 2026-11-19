---
title: A piece's hero shows three distinct tags at most, topics then industry then expertise
date: 2026-11-19
status: proposed
area: [content, cards]
source: Article bug report #8 (P3), 18 Nov 2026; owner asked for it to be built, 19 Nov 2026 (branch fix/hero-tags-dedupe)
supersedes: []
dbf: []
dbf_status: none
enforced_by: src/lib/labels.ts (distinctLabels, HERO_LABEL_LIMIT); tests/labels.test.mjs
---

An insight's hero shows its tags in this order: topics, then industries, then expertises. A tag spelled
twice shows once, and the hero shows three tags at most. Two tags are the same when they match after
ignoring case, reading "&" as "and" and stripping punctuation and extra spaces. The first spelling met
is the one shown. The stage (a company's size) is not a hero tag.

**Why.** The report asked for de-duplicated tags and at most three. Twelve insights carried four tags.
The near-repeats in them are two taxonomies naming one subject, for example the industry "Commerce"
beside the expertise "Commerce & Transactional Products", or "EdTech" beside "EdTech & Learning".
Under the order, the cap drops the second one. No two tags on any page are the same by the spelling
rule today; the rule guards the next CMS entry. The
stage names the reader's company, not what the piece is about, and under a cap of three it pushed a
subject out.

**The mistake it prevents.** `published-resource.ts` de-duplicated on the exact string, so one CMS tag
entered twice under two spellings rendered twice. It also passed every taxonomy, stage included, with no
limit.

**How to apply.** Every label set goes through `distinctLabels` in `src/lib/labels.ts`, so the rule
lives in one place:
- The content seam orders a record's labels and caps them with `HERO_LABEL_LIMIT`.
- PageHero de-duplicates whatever it is handed, on every page type.
- An author's topic tally counts by `labelKey`.

Overlapping names across taxonomies ("Commerce" and "Commerce & Transactional Products") are a CMS
clean-up, not something this rule merges.
