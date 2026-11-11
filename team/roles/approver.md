# Role: approver

Jatin. Final approval on the site, given in feedback sessions (Devagya logs those rulings:
decisions/2026-10-22-rulings-valid-once-devagya-logs-them). Edits copy directly in Strapi as superadmin,
usually through Claude.

- **No copy of the repo.** Jatin's Claude reads the public repo on GitHub and never writes to it: no
  branches, no pull requests.
- **Content edits that touch a graphic become issues.** Before saving an edit to a band whose items carry
  drawings, Claude runs the check in `docs/guides/content-edits-with-graphics.md` and raises a
  `graphic-needs-review` issue for anything to relink, reuse, redraw or remove. A GitHub Action turns the
  issue into a PR (`.claude/commands/graphics-issue.md`); Devagya merges it, and it is carried to `new-cms`
  (decisions/2026-11-11-content-edits-flag-their-graphics).
- **Needs write access on GitHub**, and a place in the repo variable `GRAPHICS_TRIGGER_USERS`, for the
  Action to accept the issue. Jatin's Claude still never pushes.
- **The repo is public.** Nothing private goes in an issue.
