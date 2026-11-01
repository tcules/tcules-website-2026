# Insights rich text: report (TRACKER 2.44)

Branch `feat/insights-rich-text`. The live insights ship from Strapi as they are, on the same URLs, and
the article shell now renders every rich-text construct they use. There was no design pass: everything
renders through `Prose`, `Figure`, `Media`, `Callout` and `PageHero`. The full tally is in
`insights-rich-text-inventory.md` (step 1). This file covers what was built, the independent review,
and what is still open.

## What is live (1 Nov 2026)

- 102 blogs (81 Articles, 14 Guides, 7 Videos), 3 events and 0 podcasts: 105 routes.
- `/insights/cpq-ux-design` is served by the corpus, so 104 of them render through the Strapi mappers.
- Every body is Markdown. No live entry uses Strapi's blocks JSON (`SharedRichText`) or `CodeSection`.

| Block / construct | Count | Pages | Renders as |
|---|---|---|---|
| Markdown text block | 1162 | 105 | `Prose` |
| Separator | 529 | 102 | `<hr>` in `Prose` |
| TL;DR (`TldrSection`) | 85 | 85 | `Callout` |
| Body image (`SectionImage`) | 47 | 11 | `Figure` when captioned, otherwise a bare `Media` |
| Hero video (YouTube) | 13 | 13 | `PageHero` media |
| Inline SVG embed | 1 | 1 | `Figure` (an `<img>` of a sanitised `data:` SVG) |
| h2 / h3 / h4 | 707 / 313 / 8 | 102 / 41 / 1 | h2 carries a `toc-n` id for the TOC |
| Bullet / ordered / task items | 1072 / 298 / 74 | 84 / 51 / 8 | `<ul>` / `<ol>`; the task box is dropped |
| Blockquotes | 40 (22 multi-paragraph) | 13 | `<blockquote>` with one `<p>` per quoted paragraph |
| GFM tables | 184 | 82 | `<table>` in `Prose`, first column `th scope=row` |
| Inline code, bold, italic | 66 / 1299 / 53 | – | `<code>` / `<strong>` / `<em>` |
| Links: external, absolute tcules.com, `#anchor` | 1486 / 508 / 40 | 96 / 98 / 9 | `<a>` through `safeContentHref` |
| Escaped characters / hard breaks | 49 / 1 effective | 6 / 1 | unescaped / `<br>` |

## What was built (all inside `src/content/sources/strapi/`, plus three routes)

1. **Marks around links.** `**[label](url)**` printed literal asterisks (28 links on 3 pages).
   - Links are now rendered first and held as placeholders, then the marks run over the whole line.
   - Code spans are held the same way, so `service_role` can't pair with an underscore outside it.
   - `_` emphasis needs a non-word character on each side, as in CommonMark, so `snake_case` stays plain.
2. **In-page anchors.** `resolveInPageAnchors` runs once per entry over its mapped blocks.
   - Each authored `#slug` is matched to a heading in three steps: the exact slug, else the one heading
     that starts with the anchor's words, else the one heading that contains them all in order.
   - A tie resolves nothing. Nothing is guessed.
   - The link is rewritten to the heading's existing id. An h2 already has `toc-n`; a lower heading
     gets `heading-n`, and only when a link points at it.
   - This also runs for case studies, events and podcasts.
3. **Multi-paragraph blockquotes.** A bare `>` line starts a new `<p>` inside the same quote, so an
   attribution no longer runs on from the quote text.
4. **Hard breaks.** Two trailing spaces in the middle of a paragraph or quote now render `<br>`.
5. **Source cleanup before parsing.**
   - U+2028 and U+2029 become newlines. Before this, `### ` headings showed their hashes on
     `/insights/building-trust-and-transparency-in-ai-first-user-interfaces`.
   - A line holding only zero-width characters becomes a blank line, so no empty `<p>` is rendered.
6. **Body images.**
   - The query now asks for the upload's `caption`.
   - The invented caption and alt (`"<title> — article image N"`) are gone.
   - A captioned image renders as a `Figure`. An image with no caption renders as a bare `Media`.
   - Alt text is whatever was authored, or `alt=""`.
   - The same applies to video and embed thumbnails, which always sit beside a visible title.
7. **Inline SVG embed.** This is the one live case, on
   `/insights/9-ux-design-tips-to-boost-your-ecommerce-conversion-rates`.
   - The SVG is turned into a `data:image/svg+xml` `<img>` inside `Figure`.
   - Alt comes from its `aria-label`, `<desc>` or `<title>`, and the caption from its `<figcaption>`.
   - Scripts, event handlers, `<foreignObject>` and non-fragment hrefs are removed. This is extra safety,
     since an `<img>` runs no script and loads nothing external anyway.
   - No CMS markup reaches the DOM.

## Independent review (step 4)

I read `git diff origin/main...HEAD` against CLAUDE.md and checked it for correctness. **Nothing needed
changing.**

- **Tiers and import direction.**
  - Routes import `Media` and `Figure` from `@/components` and `@/patterns`.
  - Patterns and templates are untouched, and nothing above `sources/strapi` imports Strapi types.
  - The view model change is `caption` becoming optional on `BlogBlock` and `PodcastBlock` figures.
  - No CSS changed: no margins, no hand-rolled grid or flex, no tokens.
- **XSS.**
  - All Markdown text is escaped before any mark is applied.
  - Link hrefs pass through `safeContentHref` and are then attribute-escaped. A test link
    `[q](https://x.com/"onmouseover="x)` renders the quotes as `&quot;`.
  - A `javascript:` link renders as plain text.
  - Raw `<script>` in Markdown is shown as text.
  - Embed alt text and captions are taken as plain text and React-escaped.
  - Rewritten anchor and heading ids are escaped.
- **Heading levels.**
  - `#` is clamped to h2, so an article has no second h1.
  - Five pages go straight from the hero h1 to an h3 (see below).
- **Empty nodes.** No `<p></p>` on any route, and an empty quote renders nothing.
- **Alt text.** No body image or thumbnail gets an invented alt. The SVG gets its authored alt.
- **Checks.**
  - `npm run verify` passes. Its only lint warnings are in files outside this diff.
  - `npm run build && npm run aria:check` passes: 265 prerendered pages, 5417 idrefs.
  - The Strapi insight routes render on demand, so aria:check does not cover them. I swept all 105
    routes on a production server (port 3331, now stopped) instead. The sweep found:
    - no literal `**`, `#` or `](`;
    - no empty `<p>`;
    - no duplicate ids;
    - 1004 h2, 790 h3, 8 h4, 184 tables, 40 blockquotes, 1 figure, 1 `<br>`.

## Articles still imperfect, and why

| Route | What is wrong | Why it is not fixed here |
|---|---|---|
| `/insights/hiring-a-ui-ux-design-studio-in-india-for-a-saas-product` | `#complex-saas-already-live` (3 links) and `#questions-to-ask` (2) point at nothing | No heading carries those words ("Questions to put to every studio on your list" has no "ask"). This is a content fix in the CMS |
| `/insights/ai-search-in-saas-should-search-and-the-ai-assistant-be-one-input` | `#one-field-two-modes-our-eden-ai-redesign` points at nothing | Same: the heading was renamed or removed |
| `/insights/best-design-system-agencies-and-consultants` | `#grow-the-system-out-of-product-work` points at nothing | Same |
| `/insights/compare-two-interaction-models-at-equal-depth` | `#running-the-comparison` points at nothing | Same |
| `/insights/videos/saas-uxx-faq-does-your-saas-app-need-a-mobile-version`, `/insights/videos/when-a-product-designer-moves-to-bollywood-filmmaking-workshop`, `/insights/events/design-systems-for-everyone-from-basics-to-advanced`, `/insights/events/lessons-from-designing-the-ux-for-ai-products`, `/insights/events/product-design-and-filmmaking` | The body opens at h3 straight after the hero h1 (level skip) | The h3 is authored. Lifting it in the mapper would change the outline rule (TOC is h2 only). See question 3 |
| 11 articles, 46 of 47 body images | No alt text, no caption | Nothing was authored. The images render as decorative (`alt=""`) rather than with invented words |
| `/insights/9-ux-design-tips-to-boost-your-ecommerce-conversion-rates` | The SVG diagram's type falls back to a system sans | Inside an `<img>` the SVG can't reach the page's web fonts. Shapes and words are intact |

## Open questions for the owner

1. **Image alt text.** Should content fill alt (and, where wanted, caption) on the 46 images in the
   Strapi media library before 6 Nov? Until then they are announced as decorative.
2. **Dead anchors.** There are 7 links across 4 pages. Fix them in the CMS (content), or drop the link
   in the mapper when no heading matches? Today it stays as written.
3. **Opening at h3.** On the 5 routes above, should content change the first headings to `##`? The
   alternative is a mapper rule that lifts an entry's headings when it has no h2. That rule would also
   add those headings to the TOC.
4. **Iframe embeds** accept any `http(s)` host, with no `sandbox`. This was already the case and none is
   live today. Should embeds be limited to an allowlist (YouTube, Vimeo, Figma, Loom …) before editors
   start using them?
5. **Inline SVG embed.** Keep the sanitised `<img>` path, or ask content to upload the diagram as an
   image and retire the path?
6. **Quote attribution.** It renders as a second `<p>` in the quote. Should it become `<cite>`, which
   `Prose` already styles?
7. **Already logged as out of scope.**
   - The hub capped blogs at 100, so 2 live articles were missing from `/insights`. Fixed 1 Nov: the limit is 500.
   - 8 links point at `/insights/authors/*`, which has no route.
   - 508 absolute `https://www.tcules.com/…` links could be made root-relative at the seam.

## Owner answers, 1 Nov 2026

1. Alt text: content fills it. Listed in `docs/content-changes.md` (live insights, item 1).
2. Dead anchors: content fixes them. Listed there, item 2.
3. Bodies opening at h3: keep what is authored; listed there, item 3.
4. Embed host allowlist: not now.
5. SVG diagrams are fine; content flattens type to outlines before export so the fonts are baked in.
6. `/insights/cpq-ux-design` on the corpus: fine, content moves to the new Strapi server anyway.
7. Hub cap: raised to 500.
8. `/insights/authors/*`: the author pages are being built (phase 1 now).
