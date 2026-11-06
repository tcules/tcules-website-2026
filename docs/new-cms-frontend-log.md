# new-cms — frontend change log

The frontend changes Devagya pushed **directly to `new-cms`**, the branch where Mihir wires the site to
Strapi. They are not on `main` unless the Status line says so. Read this before porting work between
the two branches, or before wondering why a page behaves differently on the Railway build than on `main`.

Scope: commits authored by Devagya in `origin/main..origin/new-cms`. Mihir's CMS integration commits
are left out; each page's integration has its own `docs/*-cms-integration.md`. `new-cms` branched
from `main` on 5 Nov 2026, and `main` was last merged in at `ee1eec62` (PR #239, responsive pass 1).

List what is new since the last entry:

```sh
git fetch && git log origin/main..origin/new-cms --author=Devagya --reverse --format='%h %ad %s' --date=short
```

Check whether an entry has reached `main` (a `-` means an equivalent patch is already there):

```sh
git cherry -v origin/main origin/new-cms
```

This file lives on `main`, so the shared context reaches everyone, while the commits it describes
are on `new-cms`. After pushing a frontend change to `new-cms`, add it here as an entry, newest last,
in a small PR to `main`. When an entry is ported to `main`, update its Status line in the same PR.

---

## 6 Nov 2026

### 1. Performance: drop the loading fallbacks, keep the tab panel one height — `9e6a63df`

**Why:** Lighthouse on the Railway build scored 53–68 on mobile and 62–95 on desktop. `/services`, the
service pages, `/why-tcules` and `/how-we-work` had CLS of 0.69–0.74.

- **Deleted `loading.tsx` from 13 routes:** audits listing, careers, cookie-policy,
  future-interfaces-lab (+ join), how-we-work, authors listing, matter-design-system, privacy-policy,
  services, sitemap, terms-of-use, why-tcules. Each one painted "Loading …" before the content, so
  the footer appeared near the top and then dropped by a screen. The routes are prerendered, so the
  fallback helped no one. Local production build, median of 3: `/services` went 53 → 80 mobile and
  67 → 99 desktop; `/why-tcules` went 64 → 93 mobile and 66 → 94 desktop.
- **ClaimTabs (`ClaimSet.module.css`):** every slide now sits in the track's one grid cell. The panel
  is as tall as the tallest claim and doesn't resize on autoplay or hover.
- **Tried and rejected:** self-hosting the fonts measured worse (mobile FCP +0.2–1 s), so the Google
  Fonts link stays.

**Status:** ClaimTabs half ported to `main` in PR #246. The `loading.tsx` half has nothing to port, because `main` never had those files.

### 2. TextureFlow holds still where the machine can't keep up — `08c01466`

**Why:** PageSpeed mobile on `/contact` scored 66 with 20 s of total blocking time. Without a GPU,
WebGL renders on the CPU, so each frame of the island's texture field took ~140 ms at 30 fps.

- `src/components/Texture/TextureFlow.tsx`: the field draws one frame and holds it, the same as
  under reduced motion, when either of these is true:
  - the WebGL context is a software renderer (SwiftShader, llvmpipe and similar);
  - three ticks in a row arrive 100 ms or more apart.
- On a real GPU it moves as before (checked on Apple M4 Metal). The same guard covers CtaSection's
  close, which uses the same field.

**Status:** ported to `main` in PR #246.

### 3. Favicon from the logomark; internal links stop prefetching — `eb991c7c`

- **Favicon:** the Tcules logomark (the T with its bar), neutral-950 on a paper tile with rounded
  corners. Added as `src/app/icon.svg`, `favicon.ico` (16/32/48) and `apple-icon.png` (180). The site
  had no favicon before, so every page logged a 404 and lost a Best Practices point.
- **Prefetch off:** in `SiteNav`, `SiteFooter`, `lib/inline-render.tsx` (copy links) and
  `/sitemap`. Every page renders on request from the CMS, so prefetching each visible link cost a
  full server render on every page load. Links now fetch on click. **Revisit once pages are cached
  again.**

**Status:** favicon ported to `main` in PR #246. Prefetch stays on `new-cms` only, since `main` prerenders its pages and prefetching is cheap there.

### 4. Layout: `justifyItems` per breakpoint; the footer's action uses it — `2248877a`

**Why:** the footer's `.brandAction { justify-items }` had the same specificity as Layout's own
`.layout { justify-items }`. The winner was whichever CSS chunk the bundler emitted last: end-aligned
on `main`, stretched to full width on the `new-cms` production build.

- `Layout` takes `justifyItems` per breakpoint (`Layout.tsx`, `Layout.module.css`). The order is
  fixed in one stylesheet, so build order no longer decides placement.
- `SiteFooter` drops its class override and passes the prop instead.
- A specimen was added on `/design/layout`.

**Status:** ported to `main` in PR #244 (`c1ed8739` on `fix/layout-justify-responsive`).

### 5. ClaimTabs: a moving slide stays in the cell — `8af0f600`

**Why:** follow-up to entry 1. The leaving slide and the peek's next slide were still taken out of
flow (`position: absolute`). When the tallest claim was one of those two, it stopped counting toward
the panel's height, so the panel still jumped (`/services/design-systems`: 255 → 234 → 255).

- `ClaimSet.module.css`, `ClaimTabs.tsx`: both slides stay in the cell and move by transform only.
  The panel's height animation was removed because the height no longer changes.
- Measured at 1440 on `/services/design-systems`, `product-design` and `product-modernisation`: the
  panel height stays the same through the peek and through switches in both directions.

**Status:** ported to `main` in PR #246, together with entry 1.

---

## Still to carry to `main`

Nothing. Everything that applies to `main` is in PR #244 and PR #246. Once they merge, change
"ported … in PR" to "on `main`".
