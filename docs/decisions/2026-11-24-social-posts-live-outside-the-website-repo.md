---
title: Social posts are made in their own folder, outside the website repo
date: 2026-11-24
status: active
area: [process]
source: Owner, 24 Nov 2026 ("any social media related stuff that is on the website-repo should be moved out"; "he gives content, reviews on browser, makes edits, exports. plain and simple")
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

Social posts are made in `tcules-social`, a standalone folder holding its own copy of the template,
the parts it draws with, the tokens and the fonts. Nothing social lives in this repo except the
rulings here in `docs/decisions/` and the brand chapters in `docs/brand/`. Yash pastes a week's
content, reviews the posts in the browser, asks for edits and exports. He never uses GitHub.

**Why.** Weekly posts would add two pull requests a week (main and new-cms), put drafts in a public
repo and deploy unused images to the live site.

**The mistake it prevents.** Adding social templates, fixtures, illustrations or export scripts to
this repo. The `design/social-frames` branch (unmerged) was the first and last time.

**How to apply.** A change to how posts look is made in `tcules-social`. A ruling about social design
is still logged here, so `/dbf-update ch10` has everything it needs. If the site's tokens or
components change and posts should follow, copy them into `tcules-social` again on request.
