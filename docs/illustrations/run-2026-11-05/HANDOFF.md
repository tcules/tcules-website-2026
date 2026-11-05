# Illustration run, 5 Nov 2026: where it stands

Branch `design/illustration-run`, worked in the worktree `/Users/devagya/tcules-illustration-run` (node_modules
symlinked from the main checkout). Local only, not pushed, no PR: nothing ships until the owner approves the
drawings (TRACKER 2.61 holds the scope). Review page: https://claude.ai/artifact/EEzv5xoFFBKNh3Z3fL67LF

**Run agents in this worktree, never the main checkout.** A pilot agent switched the main checkout's branch once.

## Done, waiting on the owner's verdict (round 3)

- `/services` hero: `services/hero.svg` (rich scene, one bench, the whole service line).
- `/why-tcules` band: `why-tcules-band/band.svg` (one wide drawing, three Tcules–client pairs). Replaces the three
  principle figures; the band's layout change on the page is still to build once the drawing is approved.
- The ten approved heroes in `public/illustrations/heroes/`: solid Tcules arms; client arms light, outlined in blue.

## Rules from the owner today (all in `STYLE.md`)

Older rules are loose; consistency with the ten heroes is the standard. Real-life objects welcome. Rich scenes
for hubs and important pages. Laptops and monitors: light body, only the screen dark blue (a phone may be solid
blue). Blue figures = Tcules, light figures = clients. Tcules arm: solid, from the shoulder, round hand. Client
arm: light, outlined in blue. Never a crowd of blue: pair Tcules and clients.

## Still to draw (19 in scope, 3 drafted)

- **Expertise heroes, 12.** Built around each industry's object in the expertise hub drawing; briefs in
  `expertise-briefs.json`. Batch 1 (fintech, climatetech, edtech, proptech) was **stopped mid-draw** when the
  owner switched accounts: `expertise-fintech/`, `expertise-climatetech-energy/`, `expertise-edtech-learning/` hold
  unreviewed first drafts (no blind read, no critic); proptech was not started. Healthtech has the pilot draft
  (`expertise-healthtech/hero.svg`; owner: "blue phone is fine"), to bring in line with the new people rules.
- **`/tools` and `/future-interfaces-lab` heroes.** Not started.
- **Designer's desk** (`public/illustrations/enquiry/designer-desk.svg`) redrawn in the new hand, for /careers or the
  Lab. Not started.
- The workflow scripts used (pilot, round 2, round 3, batch 1) are under
  `~/.claude/projects/-Users-devagya-tcules-website-2026/8ce2649d-2659-42a3-9188-cf1a5a33f4b0/workflows/scripts/`
  on Devagya's machine; batch 1 is `expertise-heroes-batch-1-*.js`.

## Waiting elsewhere

- `design/expertise-cards-take-illustrations` (worktree `/Users/devagya/tcules-expertise-chips`): /expertise
  cards take each industry's hero once it exists. Open its PR with the first expertise heroes.
- Audit heroes: out of this run (TRACKER 2.66).
