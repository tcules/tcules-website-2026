# Digital Branding Framework

The brand's written chapters. Open any `.html` file in a browser: each one is a self-contained paged
document, and they cross-link to each other.

| File | Chapter | Version |
|---|---|---|
| `00 Cover and Contents.html` | Cover, contents, reading conventions | 0.1 |
| `02 Colour.html` | Palettes, surface model, roles, proportion, pairing | 1.1 |
| `03 Typography.html` | Families, roles, measure, hierarchy | 0.2 |
| `04 Iconography.html` | Solar Bold, sizes, colour, meaning | 0.3 |
| `05 Imagery.html` | Client work, photography, illustration, placements | 1.1 |
| `10 Social media.html` | Posts and share previews | 1.1 |

Every other file here is a dependency of those six: `dbf.css` and `dbf-social.css` style them,
`doc-page.js` is the paged-document shell, `image-slot.js` backs the image placeholders in 05, and the
images and wordmarks are the figures they show.

## Where this came from

Copied on 25 September 2026 and re-pulled at v1.0 on 28 September 2026 from the Claude Design project **Tcules Design System - Aug 2026**, folder
`Digital Branding Framework/`, byte for byte. Only the six written chapters and their dependencies
were brought over; the rest of that folder (the `bundle-src` and `standalone` variants, `10a`, the
keyword and comparison sheets) were working tools for developing the guidelines and are not part of
the framework.

**This copy is now the one to edit.** `/ds-publish` publishes it to the Design System artifact under
`brand/`; the Claude Design project is retired.

## Known gaps

None open. Chapter 05's two images that were too large for the old sync tool,
`client-darkroast-mobile.png` and `ui-mock-panel.png`, were restored on 20 October 2026 from the
archived artifact (`devagya-tc/tcules-design-archive`, `project/Digital Branding Framework/`).

(`ill-closed-loop.svg`, `ill-the-cutaway.svg` and `ill-the-seam.svg`, missing at source on 25 September,
now exist and were pulled on 28 September.)

The decision records are ch05 §12 and ch10 §F2. Nothing in either is open.
