---
name: ship-section
description: Bring one section or component from the overhaul design to the live site through Strapi, the right way — CMS fields, frontend mapping, guarded content write, staging, production.
when_to_use: Use when Devagya says to ship, bring over or take live a section, component or checklist item from the overhaul (the checklist in the rollout doc), or types /ship-section.
argument-hint: "<checklist item or section name>"
---

# Ship one section to the live site

Section: **$ARGUMENTS**

The overhaul designs live on `design/overhaul` (worktree `../tcules-ov`). The live site renders only what
Strapi holds, so every section reaches it through the CMS model: proper fields and components, never a
fixture, a mapper trick or a title-matched lookup (owner, 19 Nov 2026). The checklist of sections, in
priority order, is the rollout doc (claude.ai/artifact/9WE2XuEn5j31owHTQtgZf1); tick an item there when it
is live.

Devagya does two things per section: looks at it on staging, and merges, CMS pull requests included
(Devagya merges and deploys them; owner, 24 Nov 2026). Everything else is Claude's.

## Where things are

| | |
|---|---|
| Strapi source | `tcules/tcules-cms-2026`, clone `../tcules-cms-2026`. Branch from **`migration/case-study-staging-20261104`** (its schema matched production on 20 Nov; `main` stops at 6 Nov). Check push access first: `gh api repos/tcules/tcules-cms-2026 --jq .permissions` |
| Strapi host | production only (`tcules-cms-2026-production.up.railway.app`); staging (`main`) and production (`new-cms`) both read its published content |
| Content scripts | `../tcules-cms-copy/scripts/cms/` on `strapi-lib.mjs`: snapshot, drift refusal, field-complete writes, diff assertion, `--verify`, `--restore` |
| Website | a worktree from `origin/main`; production gets its own cherry-pick PR onto `new-cms` (main is never merged into new-cms) |

## Steps

1. **Scope.**
   - Diff the section on `design/overhaul` against `main`.
   - Read the section's rulings in `docs/decisions/`.
   - Find every template that renders it, and every CMS entry that holds it (count them).
   - List exactly which fields it needs. Check each against the **live** schema
     (`/api/content-type-builder`), not the doc: a value may already exist as an enum option.
   - A decision only the owner can make (for example, text typed per page or linked from a record) is
     asked once, with a recommendation, before building.
2. **CMS pull request**, only when a field is missing.
   - **Additive only:** nothing renamed, removed or made required. Reuse an existing component before
     adding one.
   - Help text goes on every new field. The field also goes into the edit layout and
     `types/generated/*`.
   - Run `npm test`, and the same suite on the base branch: report only failures the change introduced.
   - Open the PR against the migration branch for Devagya to merge and deploy. Merging changes nothing on the live site,
     because no query asks for the field yet.
3. **Wait for the deploy.** Confirm the field in the live schema before any website change that queries
   it can render. A GraphQL query naming a field the CMS lacks fails the whole page.
4. **Website pull request to `main`.**
   - Port the design commits from `design/overhaul` (cherry-pick, drop `sources/overhaul/*`).
   - Add the field to the query and the mapper (`src/content/sources/strapi/`).
   - Make the template follow one rule keyed to CMS content, so the section switches per entry when its
     content changes and a restore switches it back.
   - Run `npm run verify`, then `npm run build && npm run aria:check`.
   - Render every published route on `main` and on the branch at 1440 and 390, and list every difference.
     Before the content write there should be none.
5. **Content.**
   - Write a guarded script for the section: snapshot published and draft, refuse when the draft drifts,
     send only the changed top-level fields re-sent whole, and assert that the only differences are the
     intended ones.
   - Show Devagya the dry run, then `--write --status=published` and `--verify`.
   - Keep the snapshot directory name for `--restore`.
6. **Review on staging.** Send Devagya the routes to look at, in words, no screenshots.
7. **Production.** Cherry-pick the website commits onto a branch from `origin/new-cms` (leave out
   `src/app/design/**` when `new-cms` lacks it) and open that PR. Devagya merges it.
8. **Tick** the item in the rollout doc, and log any ruling with `/decide` in the website PR.

Stop and report when a step is blocked: CMS access, a deploy that hasn't landed, a drifted draft, or a
check that fails on the change. Never work around a missing field in code.
