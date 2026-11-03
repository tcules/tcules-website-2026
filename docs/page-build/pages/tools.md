# /tools and the six tool pages — design pass, 4 Nov 2026 (local, in review)

The hub routes to six free tools; each tool page is the worksheet itself. Composed from the library: the
hub through OfferPage's plan with DirectoryBand's tool tiles, the tool pages through LongformPage's new
`tool` family. Every word is the copy's, in its order.

## Decisions
- **Tracker 2.57, the hub's cards did not read as clickable.** The borderless glyph cards became the kit's
  clickable tiles (hairline at rest, lift, blue hairline, accent title, the tool's drawing moving on hover,
  the whole tile the link), the /services service-guide answer.
- **`ai`**: Bento split tiles. The band's table (Tool | Best for | You leave with) folds into each tile's
  result panel as two labelled fields (Bento `detail.fields`, specimen 2d4), so no column is dropped and the
  tools are not shown twice; the key cell is carried by the tile, whose body opens with the tool's name. The
  two paragraphs after the table follow at the body measure.
- **`compare`** stays the boxed DataTable (a comparison read across rows), the page's one undrawn band
  between the tile bands.
- **`design-systems`**: two wide Bento tiles, drawing beside words, one row.
- **`modernisation`, `prototypes`**: each a single tool, so its wide ServiceTile across the row (the audits'
  answer for one named offer), the visual on the end side, then on the start side (ServiceTile
  `visual="start"`, specimen 9c). The 29 Oct note asked for the stacked card at the set's track width;
  treatment-rules § 2 (no lone tile on a row) was followed instead.
- **Hero**: CorpusHero beside the studio review photograph (images.ts STUDIO_HERO), a team acting on a
  brief; the photo register sets the hero apart from the drawn tiles.
- **Tile action** "Try the tool" (`tileActionFor`, one wording per kind of tile).
- **Tool pages: the article shell** (the shape-off, 4 Nov: candidate B over the composed tool layout A,
  whose prose bands were half-width ribbons beside empty halves). LongformPage `family="tool"`: the hero's
  one action to `#workspace`, no byline or dates, the worksheet in one shell beside the outline rail, the
  FAQ last. Fixes the old ToolPage, which dropped every numbered method, workspace table, after-table note
  and FAQ, and showed an empty tinted close and a "record builder opens here" placeholder. ToolPage is
  retired.
- In the column (`ToolShell`): bold-led numbered methods as Steps; the worked example as the tint example
  panel, words beside the story plate from 1440 and stacked below, any table at the panel's full width
  (drift checker); a diagram plate after the paragraph naming the marks (readiness `marking`, rebuild
  `reading-your-results`, fidelity `corrections`), held to `--measure-lead`.

## Owed
- Drawings: four hub tile scenes (components/Sketch/wyg-tools.tsx; the drift checker's and the prototype
  checklist's are in wyg-glossary-destinations.tsx), six example stories and three diagrams
  (components/Sketch/wyg-tool-<slug>.tsx). All empty plates until drawn.
- The 27 Aug ruling (tools are not long-form) is still active: the article shape needs a /decide entry that
  limits it for tools, citing the 28 Oct launch plan, for Devagya to confirm.
- The copy promises an interactive record builder ("download the result as a brief"); it is not built, so
  the hero action lands on the authored table.
- Outline labels are long (the TOC warns on 7–8 per page); short markers are the TOC's open content item.
- Register adjacency: design-systems, modernisation and prototypes are three adjacent drawn-tile bands
  (the copy fixes the order); mitigated by arrangement only (a pair, then whole-row tiles alternating).
