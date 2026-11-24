---
title: 'new-cms is production and main is staging; new-cms comes down by merge, main goes up by PR'
date: 2026-11-17
status: superseded
area: [process]
source: 'Owner, 17 Nov 2026, in a session on whether main should connect to the CMS: "new-cms should remain the production branch with main acting as staging", "we don''t want to block \"/design\" route so i''d rather keep it deleted on production", and Mihir keeps committing to new-cms directly'
supersedes: []
dbf: []
dbf_status: none
enforced_by: 'workflow (graphics-carry.yml carries graphics up); the new-cms → main sync PR is opened by hand'
---

`new-cms` is the production branch: it reads Strapi, the live site deploys from it, and Mihir commits to
it directly. `main` is staging: the same CMS-connected site plus `/design`, deployed to its own Railway
project. Production comes down to staging by merging `new-cms` into `main`, through a sync PR opened
by hand when `new-cms` is ahead. (The `new-cms-sync.yml` workflow that opened it was removed on 20 Nov 2026:
GitHub Actions may not create PRs in this repo, so it only ever failed.) Staging goes up to production one PR per change, never by merging `main`
into `new-cms`. `/design` and its checks (`specimens:check`, the `/design` route names in
`src/lib/routes.ts`, `public/design/`) exist on `main` only. On production they're deleted, not hidden.

**Why.** Kept apart, the branches drifted 59 and 15 commits in 11 days. Every change was made twice,
rulings applied on one branch and not the other, and a page approved on `main` (still rendering
fixtures) wasn't the page that shipped. A staging branch only helps if it shows production, so `main`
reads the CMS too. It can't be merged up wholesale, because that would bring `/design` back to the live site.

**The mistake it prevents.** On `new-cms`, `96487a48` deleted `/design` with its route names, scripts,
fixtures and the CLAUDE.md rule that guards it. Merged into `main` as is, that would have removed the
proving ground and the Design System artifact's previews. Merging `main` into `new-cms` would do the reverse
and publish 90 `/design` routes. And a sync PR squashed instead of merged leaves no record that `main`
has `new-cms`'s history, so the next sync replays the same commits as conflicts.

**How to apply.**

- A session's catch-up (CLAUDE.md) says when `new-cms` is ahead of `main` and offers to open the sync PR
  from a `sync/new-cms` branch cut from `new-cms`.
- Merge the sync PR with "Create a merge commit". Resolve a conflict on `sync/new-cms`, never on
  `new-cms`, keeping `main`'s side for anything under `/design`.
- Send a frontend change up as its own PR to `new-cms`, or open it against `new-cms` from the start
  (as #258 was).
- `main`'s deploy needs `NEW_CMS_GRAPHQL_URL`, as production's does.
- Before merging a sync, the comparison that counts is `main` against `new-cms`. Every public page
  should match, and only `/design` should be extra.
