---
title: Web fonts may arrive after the first paint, on metric-matched fallbacks
date: 2026-11-06
status: active
area: [type, process]
source: Owner, 6 Nov 2026, after comparing the current build and PR #247 side by side on Slow 4G (PR #247, into new-cms)
supersedes: []
dbf: ["ch03 §1"]
dbf_status: pending
enforced_by: review
---

The page paints before the web fonts arrive. Text first sets in local fallback faces sized to each web
font's metrics (`Newsreader Fallback` on Georgia, `Public Sans Fallback` on Arial, `Geist Mono Fallback` on
Courier New, in `tokens/fonts.css`), then swaps to Newsreader, Public Sans and Geist Mono when Google Fonts
deliver them, up to about a second on a slow first visit. The owner is "okay with the fonts loading a
little late"; a loading state may be designed later.

**Why.** The Google Fonts stylesheet was render-blocking on a second origin, and the hero heading (the
largest paint on most pages) waited for it. That kept 7 of 14 templates at 88–94 on mobile PageSpeed
against the 95 goal. Attaching it without blocking moved first paint 0.3–0.8 s earlier in a local
Lighthouse A/B. Once the fonts load, every page is pixel-identical to before.

**The mistake it prevents.** Putting the fonts stylesheet back as a plain `<link rel="stylesheet">` (or a
CSS `@import`) to stop the swap, which brings back the blank page and costs the score. Also, adding a
family or changing a stack without its fallback face: an unmatched fallback re-wraps lines when the font
lands.

**How to apply.** `src/app/layout.tsx` attaches the stylesheet by script, with a `<noscript>` link.
Every `--font-family-*` stack in `primitives.css` names its fallback face second. If a family or weight
changes, recompute that face's `size-adjust` and overrides with the formula in the comment in
`tokens/fonts.css`. Any later loading state must not hold the page's content back, or it undoes the faster
first paint.
