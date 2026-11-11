---
title: A graphics PR shows its drawing and page as pictures in the PR
date: 2026-11-11
status: active
area: [process, illustration]
source: "Devagya, 11 Nov 2026: setting up the graphics-issue automation ('perhaps a screenshot in the PR is the best way since that doesn't depend on any environment setup')"
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

A PR opened by the graphics automation (`.claude/commands/graphics-issue.md`) embeds pictures of each new or
relinked drawing and of the page at 1440 and 390. Devagya judges it from the PR, because there are no PR
preview environments ("that's too much resource"). This is the one exception to
decisions/2026-10-09-no-screenshots-to-owner. Everywhere else, the owner still reviews routes in the browser.

**Why.** Nobody is at a keyboard when the PR is made, and `main`'s deployment only shows a change after the
merge. A picture is the only view of the drawing before the merge that doesn't need an environment.

**The mistake it prevents.** A drawing merged to `main`, and carried to the live `new-cms`, before anyone has
looked at it.

**How to apply.** Step 5 of the runbook: `sketch:frames` and `shots` capture the pictures, which go on an
orphan branch (`graphics-shots-issue-<n>`), never on the PR branch, so `main` stores no images.
`graphics-carry.yml` never merges into `new-cms` itself: Devagya merges there after checking `main`.
