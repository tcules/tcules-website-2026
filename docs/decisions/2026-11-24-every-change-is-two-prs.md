---
title: 'Every change is two PRs, one to main and one to new-cms; no sync between the branches'
date: 2026-11-24
status: active
area: [process]
source: 'Owner, 24 Nov 2026: "get rid of the auto sync workflow altogether, we''ve been doing 2 PRs for every update. one to main and one to new-cms"'
supersedes: [2026-11-17-new-cms-is-production-main-is-staging]
dbf: []
dbf_status: none
enforced_by: 'review; graphics-carry.yml opens the new-cms PR for a merged graphics change'
---

`new-cms` is still the production branch: it reads Strapi and the live site deploys from it. `main` is
still staging: the same CMS-connected site plus `/design`. What changes is how work reaches both. Every
change gets two PRs, one into `main` and one into `new-cms`. Neither branch is ever merged into the other,
in either direction. There's no sync PR from `new-cms` into `main` and no workflow that opens one.

`/design` and its checks (`specimens:check`, the `/design` route names in `src/lib/routes.ts`,
`public/design/`) exist on `main` only. On production they're deleted, not hidden.

**Why.** That's how the team already works. Each change is made once per branch, deliberately, so a
whole-branch merge isn't needed to keep them level. The sync was a second route for the same commits: it
fell 55 commits behind within a week, and merging it would have replayed every change already sent up by PR.

**The mistake it prevents.** A session that still followed the 17 Nov ruling offered to open a sync PR
carrying 55 `new-cms` commits into `main`. Many were production versions of changes `main` already had
from its own PRs, so merging it would have brought those changes in a second time, as conflicts. Merging the other way would put `/design` on
the live site.

**How to apply.**

- Open a change against `main`, then open the same change as its own PR into `new-cms`, cut from
  `new-cms`. A change Mihir commits straight to `new-cms` gets its own PR into `main`.
- A session's catch-up no longer counts how far `new-cms` is ahead of `main` and never offers a sync PR.
- Never merge `main` into `new-cms` or `new-cms` into `main`.
- Before opening the `new-cms` PR, prove its blast radius against `new-cms` itself, not against `main`.
- `main`'s deploy needs `NEW_CMS_GRAPHQL_URL`, as production's does.
