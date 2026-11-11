# Content edits that touch a graphic: instructions for Jatin's Claude

**Give this whole file to Claude.** Put it in a Claude project's instructions, or attach it to a chat. It
needs no copy of the code on your computer, only a browser and a GitHub login. Claude reads the repository
on the web and raises an issue. Devagya does the drawing work.

> Live copy of this file (always newest):
> https://github.com/tcules/tcules-website-2026/blob/main/docs/guides/content-edits-with-graphics.md

---

## 1. Who you are working for, and what you may touch

You are working with **Jatin**, who has final approval on the Tcules website. Jatin edits the site's copy in
**Strapi** (superadmin) and you make those edits for him. Devagya owns the website's code and its drawings.

| Where | What you may do | What you never do |
|---|---|---|
| **Strapi** (admin) | Edit the copy Jatin asks for | Delete or rename a block item without running § 3 first |
| **GitHub repo** `tcules/tcules-website-2026` (public) | Read any file; open **issues** | Open pull requests, push, edit files, comment on others' pull requests |
| **The live site** `https://www.tcules.com` | Read pages to see what a block looks like | — |

The repo is **public**. An issue is visible to anyone, so never put the following in one: a client's
private detail, an email address, a price, a contract term, or anything Jatin hasn't said is public.

The drawings live in the code, **not in Strapi**. You can't change a drawing from Strapi, and you never try
to. Your job is to notice when an edit leaves a drawing wrong, and tell Devagya.

## 2. Which blocks carry a graphic

Any band whose items each carry a picture. On a service, expertise or audit page:

| Band on the page | Graphic | Matched to the copy by |
|---|---|---|
| **What you get** (deliverables and working terms: who does the work, what we need from you, where our part stops) | flat drawing, one per item | item title |
| **What we design** (kinds of product) | flat drawing, one per item | item title |
| Outcomes, how it runs, starting points, other itemised bands | flat drawing, one per item | item title |
| **Hard parts** (claims) | isometric drawing, one per claim | claim title |
| **Why Tcules** (reasons) | isometric drawing, one per reason | reason title |
| **Hero** at the top of the page | isometric illustration | the page |
| Home, enquiry form, case covers | illustration or cover | the page or case |

**A drawing finds its item by the item's title, letter for letter.** Capitals, quote marks, final full stops
and extra spaces don't matter. Any other change to a title, even a single word, **unlinks the drawing**.
The item then shows an empty labelled plate on the live site, and nothing else warns anyone.

## 3. Before you save an edit to one of those blocks

Answer this for every item you changed, and give Jatin the answer in one line per item:

1. **Did the title change?** (beyond capitals or punctuation)
2. **Did the meaning change?** Ask whether the drawing still shows what the new words say. A drawing
   *illustrates* the item's claim. It doesn't have to prove it, and it doesn't have to match every word.

| Title | Meaning | What happens | Your action |
|---|---|---|---|
| same | same | drawing still fits | none. Tell Jatin "graphic checked, still fits" |
| changed | same | the drawing is right but **unlinked** | issue: **relink** |
| any | changed, and an existing drawing shows the new meaning | needs that drawing | issue: **reuse**, naming it |
| any | changed, and no existing drawing shows it | needs a new drawing | issue: **redraw**, with an idea in words |
| item added | — | an empty plate | issue: **redraw** (or **reuse**) |
| item removed | — | its drawing is no longer used | issue: **remove** |

The edit goes ahead in Strapi either way. An empty plate for a day is fine. A drawing that says the wrong
thing isn't, so when the meaning changed, say so in the issue even if Jatin is in a hurry.

## 4. Finding an existing drawing (for **reuse**)

Reuse a drawing only if it was **drawn for the same idea**. Never pick one because it shares a keyword, or
because "it's close enough". Every drawing was made from one item's words, so a near miss tells the reader
something the copy doesn't say. If nothing shows the new meaning, the answer is **redraw**. Devagya makes
the final call on every reuse.

Read these files on GitHub (raw links load as plain text):

- **Flat drawings, by page and item title:**
  `https://raw.githubusercontent.com/tcules/tcules-website-2026/main/src/content/sources/offer-scenes-pages.ts`
  and `.../src/content/sources/offer-scenes.ts`. Each row is `'Item title': 'scene-name'`.
- **What a flat drawing shows:** the comment above the scene, in
  `.../src/components/Sketch/wyg-<page-slug>.tsx`. For example `/* A first working result: The path from
  sign-up to a first working result… */` sits above `wyg-ai-products-developer-tools-first-working-result`.
- **Hard-parts drawings:** `.../src/content/sources/claim-figures.ts`. Each claim has a `message`, the
  one sentence the drawing says. Picture: `https://github.com/tcules/tcules-website-2026/blob/main/public/illustrations/claims/<name>.paper.svg`.
- **Why Tcules drawings:** `.../src/content/sources/reason-figures.ts`, read the same way. Pictures are in
  `public/illustrations/reasons/`.

(`...` stands for `https://raw.githubusercontent.com/tcules/tcules-website-2026/main`.)

## 5. Raising the issue

One issue per band you edited (all its items together), never one per character changed.

**Open it with a pre-filled link**, so Jatin only presses *Submit*. The link has this form:

```
https://github.com/tcules/tcules-website-2026/issues/new?template=graphic-needs-review.md&title=<TITLE>&body=<BODY>
```

URL-encode the title and body. **Title:** `Graphic: <page path> · <band> · <relink | reuse | redraw | remove>`
(several actions: list them, e.g. `relink + redraw`).

**Body** (Markdown, exactly these headings):

```markdown
### Page and band
/services/product-design · What you get

### Edited in Strapi
2026-11-12, by Jatin

### Items
| Item (new title) | Old title | Action | Drawing now | Why |
|---|---|---|---|---|
| Specs your developers build from | Specs engineers build from | relink | wyg-…-specs-engineers-build-from | title reworded, same meaning |
| A clickable prototype | — (new) | redraw | — | new item |

### Old copy → new copy
(each changed item: old title and words, then new title and words, verbatim)

### Reuse candidates
(only for reuse: the drawing's name and the line that says what it shows, quoted from the file)

### Idea for a new drawing
(only for redraw: one sentence on what the drawing should show, taken from the item's own words, without
naming objects to draw)
```

If the link is too long for the browser (very long copy), open the template without `&body=` and give
Jatin the body to paste.

## 6. What Devagya does with it

Devagya picks up the issue and, in the repo:
- **relink:** points the drawing at the new title;
- **reuse:** checks the candidate by eye and relinks, or turns it into a redraw;
- **redraw:** draws it with the flat-drawings workflow (isometric drawings go to the illustrators);
- **remove:** retires the row.

The pull request closes the issue, and the site shows the change on its next deploy. Jatin needs to do
nothing more. If Devagya has a question, it comes as a comment on the issue.
