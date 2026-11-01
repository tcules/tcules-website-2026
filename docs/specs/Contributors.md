---
component: Contributors
tier: pattern
status: approved
source: owner, 30 Oct 2026 — byline board G (https://claude.ai/artifact/9ypGtvvn1ZxJGRr5b5s5fh); decisions/2026-10-30-byline-faces-top-people-after-content
---

# Contributors

The people behind a piece, after its content: "About the author", "About the authors", "In this
episode". Written after the build from the approved mock (board G), so the decisions are recorded
rather than proposed.

## 1 · Job

The hero's byline carries faces and names only, so the opening is not front-loaded with supporting
content (owner, 30 Oct 2026). This block is where each person says who they are and where to read
more of them. It closes an article; it is not a card set and not an advert for the author.

## 2 · Anatomy

- `root` — a `<section>` labelled by its heading, a hairline above (`--ctb-rule-*`) and `--gap-block`
  of padding under it, as the hero's byline strip.
- `label` — an `<h2>` in the mono micro voice ("About the authors").
- `list` — a `Cluster` `<ul>`: `colGap="stack"`, `rowGap="block"`, wrapping one person per line on a
  phone.
- `person` — portrait (64 square, 8 radius, `Media` filling it) or initials (the h4 role, optically centred: trimmed to the capitals, tracking balanced) in full ink on the portrait's tint ground (1 Nov 2026); name and role 4 apart, the link 16 below them, the text top-aligned to the portrait;
  beside it at `--gap-text`, the name (`<h3>` at `--text-h5`), the role (`--text-body-sm`) and the
  link, `inline` apart.
- `link` — `Button` `emphasis="link"`, `size="sm"`, trailing arrow: "More from Shoghi".

## 3 · Props

```ts
type ContributorLink = { label: string; href: string }
type Contributor = { name: string; role?: string; portrait?: MediaImage; link?: ContributorLink }
type ContributorsProps = { label: string; people: readonly Contributor[] }
```

`label` is authored by the caller, so the count decides "author" or "authors" at the call site. The
role is as authored ("Host · Founder and CEO, Tcules"): the host is marked inside the role, not by a
second heading.

## 4 · Rules

- Renders only the people the content carries (launch rule, 29 Oct 2026). `people` empty renders
  nothing.
- A person without a page (a podcast guest) has no link and a plain name. No link renders until
  author pages have routes in `@/lib/routes`.
- The portrait is decoration (`alt=""`): the name beside it says who it is. Initials are
  `aria-hidden`.
- Initials and the portrait focus come from `@/lib/initials`, shared with PageHero.

## 5 · Tokens

`tokens/components/contributors.css`, `--ctb-*`, every surface-dependent token on all four surfaces.

## 6 · Specimen

`/design/contributors`: one author, two authors, a host with three guests without portraits or pages,
on paper, tint, ink and blue.
