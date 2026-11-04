# Share-card fonts

Static TTF instances for the share-card generator (`../render.tsx`). Satori, which draws the card,
reads neither WOFF2 nor a variable font's axes, so the site's Google Fonts stylesheet cannot serve it.

| File | Face | Use |
|---|---|---|
| `public-sans-500.ttf` | Public Sans 500 | the title: sans, as card titles are on the site (owner, 4 Nov 2026) |
| `geist-mono-600.ttf` | Geist Mono 600 | the meta and action lines (ch10 A3, C2) |

Both are from Google Fonts (`fonts.googleapis.com/css2?family=Public+Sans:wght@500` and
`Geist+Mono:wght@600`, fetched with a non-WOFF2 user agent) and are under the SIL Open Font License
1.1. Replace them together with the site's faces if those change.
